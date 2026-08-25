"""Local Japanese ASR service with word-level timestamps.

Run with:
  python -m uvicorn asr_service:app --app-dir server --host 127.0.0.1 --port 8788

The Node media worker sends extracted audio chunks to this service. The model
remains loaded in GPU memory between requests, unlike a per-job CLI process.
"""

from __future__ import annotations

import os
import shutil
import site
import tempfile
from pathlib import Path
from typing import Any

from fastapi import FastAPI, File, HTTPException, UploadFile


_dll_directories = []


def configure_cuda_dll_paths() -> None:
    """Expose CUDA/cuDNN wheels to CTranslate2 on Windows without system PATH edits."""
    if os.name != "nt":
        return
    for package_root in site.getsitepackages():
        for package_name in ("cublas", "cudnn", "cuda_nvrtc"):
            dll_path = Path(package_root) / "nvidia" / package_name / "bin"
            if dll_path.is_dir():
                _dll_directories.append(os.add_dll_directory(str(dll_path)))
                os.environ["PATH"] = f"{dll_path}{os.pathsep}{os.environ.get('PATH', '')}"


configure_cuda_dll_paths()

from faster_whisper import WhisperModel

app = FastAPI(title="Kotodama local ASR", version="1.0")
_model: WhisperModel | None = None


def model_settings() -> tuple[str, str, str]:
    model_name = os.getenv("LOCAL_ASR_MODEL", "large-v3")
    device = os.getenv("LOCAL_ASR_DEVICE", "cuda")
    compute_type = os.getenv("LOCAL_ASR_COMPUTE_TYPE", "int8_float16")
    return model_name, device, compute_type


def get_model() -> WhisperModel:
    global _model
    if _model is None:
        model_name, device, compute_type = model_settings()
        _model = WhisperModel(model_name, device=device, compute_type=compute_type)
    return _model


def transcribe_with_vad_fallback(audio_path: str):
    """Keep VAD for normal speech, but retry music/singing without it when VAD removes all speech."""
    base_options = {
        "language": "ja",
        "task": "transcribe",
        "beam_size": 5,
        "word_timestamps": True,
        "condition_on_previous_text": False,
    }
    segments, info = get_model().transcribe(audio_path, vad_filter=True, **base_options)
    materialized_segments = list(segments)
    if materialized_segments:
        return materialized_segments, info
    retry_segments, retry_info = get_model().transcribe(audio_path, vad_filter=False, **base_options)
    return list(retry_segments), retry_info


@app.get("/health")
def health() -> dict[str, Any]:
    model_name, device, compute_type = model_settings()
    return {"status": "ok", "loaded": _model is not None, "model": model_name, "device": device, "computeType": compute_type}


@app.post("/v1/transcribe/japanese")
async def transcribe_japanese(file: UploadFile = File(...)) -> dict[str, Any]:
    if not file.filename:
        raise HTTPException(status_code=422, detail="Audio file is required.")

    suffix = Path(file.filename).suffix or ".m4a"
    with tempfile.NamedTemporaryFile(suffix=suffix, delete=False) as temporary:
        temporary_path = Path(temporary.name)
        shutil.copyfileobj(file.file, temporary)

    try:
        try:
            segments, info = transcribe_with_vad_fallback(str(temporary_path))
        except Exception as error:
            raise HTTPException(
                status_code=502,
                detail=f"Local ASR inference failed: {type(error).__name__}: {str(error)[:400]}",
            ) from error
        try:
            result = []
            for segment in segments:
                words = [
                    {
                        "word": word.word.strip(),
                        "start": word.start,
                        "end": word.end,
                        "probability": word.probability,
                    }
                    for word in (segment.words or [])
                    if word.word and word.start is not None and word.end is not None and word.end > word.start
                ]
                text = segment.text.strip()
                if text and segment.end > segment.start:
                    result.append({"start": segment.start, "end": segment.end, "text": text, "words": words})
            return {"language": info.language, "duration": info.duration, "segments": result}
        except Exception as error:
            raise HTTPException(
                status_code=502,
                detail=f"Local ASR inference failed: {type(error).__name__}: {str(error)[:400]}",
            ) from error
    finally:
        temporary_path.unlink(missing_ok=True)
