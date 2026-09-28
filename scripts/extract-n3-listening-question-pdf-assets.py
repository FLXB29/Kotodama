"""Extract the remaining N3 listening illustrations from verified question-paper PDFs.

The downloaded PDFs are deliberately kept under tmp/ because the deployed site serves
only the resulting PNGs. This script records every question-to-PDF mapping in the audit
report so the local assets remain reproducible and reviewable.
"""

from __future__ import annotations

from io import BytesIO
import json
from pathlib import Path

import pymupdf
from PIL import Image
from pypdf import PdfReader


ROOT = Path(__file__).resolve().parent.parent
INPUT_DIRECTORY = ROOT / "tmp" / "original-question-pdfs"
MANIFEST_PATH = ROOT / "data" / "jlpt_n3_listening_image_assets.json"
MASTER_PATH = ROOT / "data" / "jlpt_n3_toan_master.json"
PUBLIC_DIRECTORY = ROOT / "public"
REPORT_PATH = ROOT / "reports" / "n3-quality-audit" / "listening-question-pdf-image-extraction.json"

PDF_SOURCES = {
    "2015-07": "https://drive.google.com/file/d/1JLn00FB2uQgPS44-FqqoNtPWXVquNeEe/view",
    "2015-12": "https://drive.google.com/file/d/1vWtX1zFJn129Jr2maGRTq5TcuKxu3PD4/view",
    "2018-12": "https://drive.google.com/file/d/1IIZSnchqU4xzRTWbwO18l99FzgOaQfn5/view",
    "2019-12": "https://drive.google.com/file/d/1UNA2Sm0KwwFWSZ8JI226j4HV4PQEzAOb/view",
    "2020-12": "https://drive.google.com/file/d/1KkIqo10qWkUMyKJBIRrwcO2vbRd65c05/view",
    "2021-07": "https://drive.google.com/file/d/1X0FHPocIsW2BxwmhRuBjKr3Cr8CWu98V/view",
    "2021-12": "https://drive.google.com/file/d/1J-ZCgDqadzo6_E7zYqYBY0mu4YEtqgpo/view",
    "2022-07": "https://drive.google.com/file/d/1_uKerTh0TUpMKN8gF_fsgwA5SkQs5ABu/view",
    "2024-12": "https://drive.google.com/file/d/1nmgQswbqLpeJWtKJXop5tTOHZ46Ufu8K/view",
    "2025-07": "https://drive.google.com/file/d/1da4jaykKDTW282qIbi9JQ_B1po9x5a15/view",
    "2025-12": "https://drive.google.com/file/d/1OtMcYHQ5ZBqJzsJY4jpUEyPX-HCJforX/view",
}

# These sessions contain a vector illustration or a non-question image in addition to
# the normal sequence. Only the listed question IDs need an explicit source index.
NATIVE_IMAGE_OVERRIDES = {
    "2015-12": {"toan_q_2015_12_80": 1},
    "2018-12": {"toan_q_2018_12_77": 0},
    "2020-12": {"toan_q_2020_12_76": 0, "toan_q_2020_12_79": 1},
    "2021-07": {"toan_q_2021_07_77": 0},
}

# PDF coordinates (A4 points) for the four vector panels on page 16 of N3 12/2018.
# They include the panel number and its arrow, and are rendered at 2x for legibility.
VECTOR_CROPS = {
    "2018-12": {
        "toan_q_2018_12_90": {"page": 16, "rect": [155, 312, 292, 445]},
        "toan_q_2018_12_91": {"page": 16, "rect": [293, 312, 438, 445]},
        "toan_q_2018_12_92": {"page": 16, "rect": [155, 445, 292, 572]},
        "toan_q_2018_12_93": {"page": 16, "rect": [293, 445, 445, 572]},
    }
}

EXPECTED_LISTENING_IMAGES = {
    "2015-07": 5,
    "2015-12": 3,
    "2018-12": 3,
    "2019-12": 7,
    "2020-12": 5,
    "2021-07": 6,
    "2021-12": 8,
    "2022-07": 6,
    "2024-12": 5,
    "2025-07": 5,
    "2025-12": 5,
}


def session_key(exam: dict) -> str:
    exam_id = str(exam.get("id", ""))
    parts = exam_id.split("-")
    if len(parts) >= 4 and parts[2].isdigit() and len(parts[2]) == 6:
        return f"{parts[2][:4]}-{parts[2][4:]}"
    raise ValueError(f"Cannot read session from {exam_id!r}")


def listening_images(reader: PdfReader, listening_start: int) -> list[dict]:
    result = []
    for page_number, page in enumerate(reader.pages, start=1):
        if page_number < listening_start:
            continue
        for index, image in enumerate(page.images):
            result.append(
                {
                    "page": page_number,
                    "pageImageIndex": index,
                    "name": image.name,
                    "data": image.data,
                }
            )
    return result


def write_native_png(image_bytes: bytes, destination: Path) -> tuple[int, int]:
    with Image.open(BytesIO(image_bytes)) as source:
        normalized = source.convert("RGBA") if source.mode in {"LA", "P"} else source.convert("RGB")
        destination.parent.mkdir(parents=True, exist_ok=True)
        normalized.save(destination, format="PNG", optimize=True)
        return normalized.size


def write_vector_crop(document: pymupdf.Document, page_number: int, rect_values: list[float], destination: Path) -> tuple[int, int]:
    page = document[page_number - 1]
    rect = pymupdf.Rect(rect_values)
    pixmap = page.get_pixmap(matrix=pymupdf.Matrix(2, 2), clip=rect, alpha=False)
    destination.parent.mkdir(parents=True, exist_ok=True)
    pixmap.save(destination)
    return pixmap.width, pixmap.height


def main() -> None:
    manifest = json.loads(MANIFEST_PATH.read_text(encoding="utf8"))
    master = json.loads(MASTER_PATH.read_text(encoding="utf8"))
    assets = manifest["assets"]
    exams = {session_key(exam): exam for exam in master if exam.get("isFullMock")}
    extracted = []

    for key, source_url in PDF_SOURCES.items():
        source_pdf = INPUT_DIRECTORY / f"n3-{key}-question.pdf"
        if not source_pdf.exists():
            raise FileNotFoundError(f"Missing verified source PDF: {source_pdf}")
        exam = exams.get(key)
        if not exam:
            raise ValueError(f"No full N3 mock is available for {key}")

        candidates = []
        for part in exam.get("parts", []):
            if int(part.get("sectionType", 0)) != 4:
                continue
            for question in part.get("questions", []):
                asset = assets.get(question.get("id"))
                if asset:
                    candidates.append((question, asset))
        missing = [(question, asset) for question, asset in candidates if asset.get("sourceType") == "embedded-full-mock"]

        reader = PdfReader(source_pdf)
        listening_start = next(
            (number for number, page in enumerate(reader.pages, start=1) if "聴解" in (page.extract_text() or "")),
            None,
        )
        if not listening_start:
            raise ValueError(f"Cannot find the listening section in {source_pdf.name}")
        source_images = listening_images(reader, listening_start)
        if len(source_images) != EXPECTED_LISTENING_IMAGES[key]:
            raise ValueError(
                f"{key} has {len(source_images)} listening image objects; expected {EXPECTED_LISTENING_IMAGES[key]}"
            )

        position_by_question_id = {question["id"]: index for index, (question, _) in enumerate(candidates)}
        native_indexes = {
            question["id"]: position_by_question_id[question["id"]]
            for question, _ in missing
            if key not in NATIVE_IMAGE_OVERRIDES
        }
        native_indexes.update(NATIVE_IMAGE_OVERRIDES.get(key, {}))
        document = pymupdf.open(source_pdf)
        vector_crops = VECTOR_CROPS.get(key, {})

        for question, asset in missing:
            question_id = question["id"]
            destination = PUBLIC_DIRECTORY / asset["publicPath"].lstrip("/")
            if question_id in vector_crops:
                crop = vector_crops[question_id]
                size = write_vector_crop(document, crop["page"], crop["rect"], destination)
                provenance = {
                    "kind": "vector-crop",
                    "page": crop["page"],
                    "rect": crop["rect"],
                    "renderScale": 2,
                }
            else:
                image_index = native_indexes.get(question_id)
                if image_index is None or image_index >= len(source_images):
                    raise ValueError(f"No verified native-image mapping for {question_id}")
                image = source_images[image_index]
                size = write_native_png(image["data"], destination)
                provenance = {
                    "kind": "native-image",
                    "page": image["page"],
                    "pageImageIndex": image["pageImageIndex"],
                    "pdfObjectName": image["name"],
                    "sessionImageIndex": image_index,
                }
            extracted.append(
                {
                    "examId": exam["id"],
                    "questionId": question_id,
                    "questionNumber": question.get("number"),
                    "publicPath": asset["publicPath"],
                    "sourcePdfUrl": source_url,
                    "sourcePdf": source_pdf.name,
                    "provenance": provenance,
                    "width": size[0],
                    "height": size[1],
                }
            )
        document.close()

    if len(extracted) != 37:
        raise ValueError(f"Extracted {len(extracted)} listening assets; expected 37")
    REPORT_PATH.parent.mkdir(parents=True, exist_ok=True)
    REPORT_PATH.write_text(
        json.dumps(
            {
                "scope": "N3 full mocks from 2015 through 2025; PDF-sourced listening illustrations absent from the standalone source.",
                "sourcePdfCount": len(PDF_SOURCES),
                "extractedAssetCount": len(extracted),
                "assets": extracted,
            },
            ensure_ascii=False,
            indent=2,
        )
        + "\n",
        encoding="utf8",
    )
    print(f"Extracted {len(extracted)} verified PNG listening illustrations.")


if __name__ == "__main__":
    main()
