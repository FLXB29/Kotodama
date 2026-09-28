# Kotodama AI Video & Pronunciation — Shared Memory và Master Plan

> **Vai trò của tài liệu:** đây là nguồn sự thật chung cho mọi phiên làm việc tiếp theo về tính năng học tiếng Nhật từ video và chấm phát âm. Đọc file này trước khi tìm lại toàn bộ codebase.
>
> **Lần rà soát/cập nhật runtime gần nhất:** 2026-09-18, nhánh `main`, bắt đầu từ commit `3cd5dec`; thay đổi chưa commit được ghi ở mục 17.
>
> **Phạm vi:** upload/import video, xử lý media, ASR, timeline, tách người nói, furigana/romaji, dịch Nhật–Việt, từ vựng/ngữ pháp/tóm tắt, shadowing, chấm phát âm/ngữ điệu, persistence, API, UI, test và deploy.

## 0. Cách dùng tài liệu này ở các phiên sau

1. Đọc mục **Tóm tắt điều hành**, **Trạng thái hiện tại** và **Backlog thực thi**.
2. Chọn task ID chưa hoàn thành theo đúng thứ tự phụ thuộc.
3. Trước khi sửa, kiểm tra `git status`, commit hiện tại và đọc đúng các file được liệt kê trong task; không cần quét lại toàn repository nếu kiến trúc chưa đổi.
4. Sau mỗi task:
   - cập nhật trạng thái task trong file này;
   - ghi migration/API/model contract mới;
   - ghi lệnh test đã chạy và kết quả;
   - cập nhật mục **Decision log** nếu thay đổi quyết định kiến trúc.
5. Nếu code thực tế mâu thuẫn tài liệu, code và migration là bằng chứng cuối cùng; sửa lại tài liệu ngay trong cùng thay đổi.

Quy ước trạng thái:

- `[x]` Đã có và đã được nối vào runtime.
- `[~]` Có một phần hoặc chỉ đủ cho demo.
- `[ ]` Chưa làm.
- `[!]` Có hành vi gây hiểu nhầm/rủi ro, phải ưu tiên sửa.
- `RESEARCH-ONLY` Có code nghiên cứu nhưng chưa được phép coi là tính năng production.

---

## 1. Tóm tắt điều hành

Kotodama **không bắt đầu từ số 0**. Dự án đã có đường đi thật:

```text
Upload/YouTube local
  -> lưu media riêng
  -> worker + FFmpeg tách audio theo chunk
  -> Faster-Whisper local / OpenAI / Gemini
  -> transcript có segment timestamp
  -> làm giàu furigana + dịch Việt
  -> lưu PostgreSQL
  -> player đồng bộ video/phụ đề
  -> ghi âm shadowing
  -> ASR câu người học + DSP pitch/rhythm
  -> lưu điểm và hiển thị feedback
```

Tuy nhiên, chất lượng hiện tại chia thành ba lớp rất khác nhau:

1. **Nền tảng production tương đối tốt:** auth/CSRF, upload, private playback token, range streaming, job queue, transcript version, player, database, retry, test.
2. **AI video đủ demo nhưng cần chuẩn hóa:** ASR/timestamp hoạt động; furigana/dịch có dữ liệu; token hóa, bunsetsu, translation provider, quality score và content enrichment chưa đủ tin cậy.
3. **Chấm phát âm chưa phải chấm âm vị production:** web runtime hiện chấm chủ yếu từ transcript Whisper, Levenshtein, thời lượng và đường pitch DTW. Model A (phoneme/GOP) và Model B (prosody/mora) đã được nghiên cứu kỹ nhưng chưa nối vào web, chưa có artifact calibrate và chưa có dữ liệu giáo viên đủ để tuyên bố “phát âm đúng/sai”.

Kết luận kiến trúc:

- Giữ Node/React/PostgreSQL hiện tại làm product shell.
- Giữ media worker làm orchestrator nhưng tách pipeline thành các stage có provenance rõ.
- Dùng **Faster-Whisper local** làm nguồn transcript/timestamp ưu tiên ở máy phát triển; dùng **OpenAI diarized transcription** khi production cần speaker diarization; chỉ dùng Gemini transcript như fallback có nhãn chất lượng thấp hơn.
- Dùng **Gemini translation wrapper chính thức đang có** cho dịch/enrichment, không gọi endpoint Google Translate `client=gtx` không chính thức.
- Dùng **Azure Pronunciation Assessment (ja-JP)** làm baseline managed để sản phẩm có chấm phát âm ổn định ngay khi cấu hình key; lưu output đã chuẩn hoá tách biệt với điểm shadowing cục bộ.
- Để **Model A/B tự train** ở trạng thái so sánh/research cho đến khi có artifact đã calibrate trên người học Việt Nam; không thay baseline bằng model tự train trước release gate.
- Dùng DSP hiện tại cho biểu đồ tham khảo; nối **Model B/B5** sau khi có reference audio đúng câu và artifact B4 đã calibrate.
- Tuyệt đối không tự sinh dữ liệu “giống kết quả AI” khi model thất bại.

---

## 2. Bản đồ codebase liên quan

### 2.1 Product runtime

| Khu vực           | File chính                                                       | Vai trò                                                  |
| ----------------- | ---------------------------------------------------------------- | -------------------------------------------------------- |
| App route         | `src/App.tsx`, `src/VideoLearning.tsx`                           | Nạp trang Video Learning                                 |
| Luồng trang video | `src/features/video/VideoLearningPage.tsx`                       | Chuyển import -> processing -> study                     |
| Import/upload     | `VideoImportScreen.tsx`, `videoApi.ts`                           | Upload file, YouTube local, danh sách asset              |
| Theo dõi job      | `VideoProcessingScreen.tsx`                                      | Poll trạng thái asset/job/transcript, retry              |
| Player học        | `VideoStudyPlayer.tsx`                                           | Phát video, sync transcript, speaker filter, tabs học    |
| Phụ đề tương tác  | `FuriganaSubtitleBar.tsx`, `bunsetsuHelper.ts`                   | Furigana/romaji/chunk highlight                          |
| Shadowing UI      | `ShadowingPracticePanel.tsx`, `PitchContourVisualizer.tsx`       | Thu âm, gửi attempt, hiển thị score/pitch                |
| Types/API client  | `videoTypes.ts`, `videoApi.ts`, `src/lib/apiClient.ts`           | Contract phía frontend                                   |
| HTTP API          | `server/index.mjs`                                               | Route video, playback, transcript, shadowing             |
| Worker            | `server/media-worker.mjs`                                        | Claim job, verify, download, transcribe, enrich, save    |
| Media storage     | `server/media-storage.mjs`, `server/media-range.mjs`             | Lưu file, kiểm signature, byte-range playback            |
| ASR adapters      | `server/transcription-provider.mjs`                              | FFmpeg chunk + local/OpenAI/Gemini adapters              |
| Local ASR/DSP     | `server/asr_service.py`, `server/dsp_service.py`                 | Faster-Whisper và YIN/DTW pitch                          |
| Dịch              | `server/translation-provider.mjs`                                | Gemini Nhật -> Việt có JSON schema                       |
| NLP/từ điển       | `server/dictionary-service.mjs`                                  | Lookup, furigana heuristic, translation hiện tại         |
| Scorer web        | `server/shadowing-scorer.mjs`                                    | So text, timing, pitch và feedback                       |
| Persistence       | `server/auth-store.mjs`                                          | Memory/PostgreSQL store cho media/transcript/shadowing   |
| Schema            | migrations `004`, `005`, `006`                                   | Media, jobs, transcript, token, grammar, quiz, shadowing |
| Config/deploy     | `server/config.mjs`, `.env.example`, `Dockerfile`, `render.yaml` | Provider, storage, worker, Render                        |

### 2.2 ML research runtime

| Nhánh                   | Trạng thái           | Nội dung                                                                                                          |
| ----------------------- | -------------------- | ----------------------------------------------------------------------------------------------------------------- |
| `ml/model_a`            | `RESEARCH-ONLY`      | Japanese phoneme CTC, G2P, forced alignment, GOP, rule baseline, classifier A6, acoustic fine-tune A7, FastAPI A9 |
| Model A pretrained base | Có khai báo          | `prj-beatrice/japanese-hubert-base-phoneme-ctc-v2`                                                                |
| `ml/model_b`            | `RESEARCH-ONLY`      | Mora mapping, F0/prosody, native-vs-learner comparison, label contract, B4 classifiers, B5 aggregation API        |
| Model A artifacts       | Chưa có              | `ml/model_a/artifacts` không tồn tại tại lúc audit                                                                |
| Model B artifacts       | Chưa có              | `ml/model_b/artifacts` không tồn tại tại lúc audit                                                                |
| Private label manifests | Chưa có dữ liệu thật | Model A chỉ có `.gitkeep`; Model B manifest chưa tồn tại                                                          |

### 2.3 Tài liệu phải đọc khi làm scoring

- `ml/model_a/README.md`
- `ml/model_a/docs/A5_DATA_COLLECTION.md`
- `ml/model_a/docs/A6_CLASSIFIER.md`
- `ml/model_a/docs/A7_ACOUSTIC_FINETUNE.md`
- `ml/model_a/docs/A8_NATIVE_DATA_AND_ERROR_LABELS.md`
- `ml/model_a/docs/A9_CALIBRATED_API.md`
- `ml/model_b/docs/B2_REFERENCE_COMPARISON.md`
- `ml/model_b/docs/B3_HUMAN_LABELS.md`
- `ml/model_b/docs/B4_TRAINING.md`
- `ml/model_b/docs/B5_SHADOWING_API.md`

---

## 3. Trạng thái hiện tại: cái gì đã thật sự có

### 3.1 Ingestion, storage và processing

| Năng lực                                  | Trạng thái | Bằng chứng/giới hạn                                                                          |
| ----------------------------------------- | ---------- | -------------------------------------------------------------------------------------------- |
| Upload MP4/WebM/MOV/OGG                   | `[x]`      | Draft -> upload session -> stream file -> signature validation                               |
| File riêng theo asset                     | `[x]`      | `MEDIA_STORAGE_PATH`, playback token 5 phút, byte ranges                                     |
| Giới hạn upload                           | `[x]`      | Mặc định 2 GiB, config 1 MiB–4 GiB                                                           |
| YouTube import                            | `[~]`      | `yt-dlp`, chỉ local, production luôn tắt; cần quyền sử dụng nội dung                         |
| Background job                            | `[x]`      | PostgreSQL queue, `FOR UPDATE SKIP LOCKED`, worker poll                                      |
| Retry thủ công                            | `[x]`      | Retry job failed gần nhất                                                                    |
| Tự hồi phục job `running` khi worker chết | `[~]`      | Requeue stale job theo `started_at`; chưa có heartbeat/backoff + jitter                      |
| Stage `extract_audio` riêng               | `[ ]`      | Schema có tên job nhưng worker đang extract ngầm trong `transcribe`                          |
| Asset duration từ probe                   | `[~]`      | Worker biết duration khi FFmpeg extract, nhưng cần xác nhận/chuẩn hóa việc lưu `duration_ms` |

### 3.2 Transcript và timeline

| Năng lực                            | Trạng thái    | Bằng chứng/giới hạn                                                                     |
| ----------------------------------- | ------------- | --------------------------------------------------------------------------------------- |
| Local Faster-Whisper                | `[x]` code    | `large-v3`, word timestamps, VAD fallback, CUDA -> CPU fallback                         |
| OpenAI diarized ASR                 | `[x]` adapter | Gửi `diarized_json`, speaker label nếu provider trả về                                  |
| Gemini ASR                          | `[~]`         | Structured segment JSON; timing do model sinh, không nên coi ngang word timing acoustic |
| Chunk audio dài                     | `[x]`         | FFmpeg segment, offset được cộng vào timeline                                           |
| Segment timestamps                  | `[x]`         | Persist `start_ms/end_ms`, sync được với player                                         |
| Word timestamps                     | `[~]`         | Local Whisper trả được; không phải provider nào cũng trả `words`                        |
| Speaker diarization                 | `[~]`         | Có khi dùng OpenAI; local Whisper hiện không diarize                                    |
| Transcript versioning               | `[x]`         | Ready cũ thành superseded; chỉ một current ready                                        |
| Quality score                       | `[ ]`         | Cột có nhưng 0/24 transcript ready có `quality_score` lúc audit                         |
| Editor sửa transcript               | `[ ]`         | Schema có source `editor`, chưa có API/UI edit/review                                   |
| Forced alignment sau sửa transcript | `[ ]`         | Chưa có stage căn lại timeline                                                          |
| Server-side natural segment split   | `[~]`         | Provider + normalize; frontend còn tự chia đoạn dài theo dấu câu/tỷ lệ ký tự            |

### 3.3 NLP, furigana, dịch và nội dung học

| Năng lực                        | Trạng thái | Bằng chứng/giới hạn                                                                                                           |
| ------------------------------- | ---------- | ----------------------------------------------------------------------------------------------------------------------------- |
| Furigana                        | `[~]`      | `Intl.Segmenter` + exact dictionary lookup; lưu HTML `<ruby>` trong DB                                                        |
| Romaji                          | `[~]`      | Bộ chuyển kana tự viết, đủ demo; không phải thư viện chuẩn đầy đủ                                                             |
| Token surface + timing          | `[x]`      | 3.255 token đều có timing ở snapshot DB                                                                                       |
| Reading/lemma/POS từng token    | `[ ]`      | 0/3.255 token có reading, lemma hoặc POS ở snapshot DB                                                                        |
| Bunsetsu/chunk                  | `[~]`      | Rule-based; backend tạo nhưng không persist chunks, frontend phải dựng lại                                                    |
| Dịch Nhật–Việt                  | `[~]`      | 1.660/1.660 segment có dịch trong snapshot; enrichment mới gọi wrapper Gemini chính thức, transcript cũ vẫn giữ provenance cũ |
| Translation provider chính thức | `[~]`      | `translation-provider.mjs` có Gemini wrapper, test và đã được gọi khi enrichment; cần batch/context/provenance đầy đủ         |
| Dịch có context                 | `[ ]`      | Hiện dịch từng segment, dễ sai chủ ngữ/đại từ/ngữ cảnh                                                                        |
| Grammar annotations             | `[ ]`      | Có bảng DB nhưng pipeline không ghi                                                                                           |
| Quiz generation                 | `[ ]`      | Có bảng/job enum nhưng worker không xử lý                                                                                     |
| Từ vựng thực từ transcript      | `[~]`      | `GET .../learning-content` đối chiếu token current transcript với từ điển cục bộ; chưa persist/cache/SRS                      |
| Ngữ pháp thực từ transcript     | `[ ]`      | Không còn mẫu hard-code; bảng DB có nhưng pipeline chưa ghi annotation                                                        |
| Tóm tắt AI                      | `[~]`      | Không còn nút chèn text giả; UI hiện thống kê deterministic từ transcript, chưa có summary job có evidence                    |
| Saved items/SRS                 | `[~]`      | Saved items chỉ giữ trong React state; ghi chú dùng localStorage; chưa nối SRS/account persistence                            |

### 3.4 Shadowing và pronunciation

| Năng lực                             | Trạng thái     | Bằng chứng/giới hạn                                                                                      |
| ------------------------------------ | -------------- | -------------------------------------------------------------------------------------------------------- |
| Ghi âm browser                       | `[x]`          | `MediaRecorder`, gửi base64, body limit 10 MiB                                                           |
| Chuyển WAV chuẩn                     | `[x]`          | FFmpeg 16 kHz mono PCM trước ASR/DSP                                                                     |
| ASR câu người học                    | `[x]`          | Thử local Whisper 4 giây, fallback cloud Gemini                                                          |
| Azure Pronunciation Assessment       | `[x]` optional | Short-audio ja-JP baseline, phoneme-level evidence được chuẩn hoá; chỉ bật khi có key + region           |
| Content alignment                    | `[x]`          | `Intl.Segmenter` + Levenshtein token/ký tự                                                               |
| Timing score                         | `[x]`          | Duration ratio hoặc rhythm score DSP                                                                     |
| Pitch contour                        | `[~]`          | YIN -> semitone normalize -> FastDTW; chỉ render/score khi có voiced data thật                           |
| Điểm phoneme                         | `[ ]` runtime  | Model A có code nhưng server web không gọi A9                                                            |
| Điểm mora/prosody calibrate          | `[ ]` runtime  | Model B/B5 có code nhưng server web không gọi                                                            |
| Human calibration artifacts          | `[ ]`          | Không có A6/B4 artifacts và label dataset thật                                                           |
| Reference audio đúng đoạn            | `[x]`          | Backend cắt audio gốc theo segment để so DSP                                                             |
| Persist audio attempt                | `[ ]`          | `audio_storage_key` đang lưu `null`                                                                      |
| Feedback theo phoneme/mora timestamp | `[ ]` runtime  | Research API hỗ trợ hướng này nhưng UI/runtime chưa nối                                                  |
| Honest missing-data state            | `[~]`          | Không còn contour/điểm cao độ giả; thiếu dữ liệu trả `pitchScore: null`, còn cần quality gate            |
| Tính toàn vẹn target text            | `[x]`          | Backend resolve canonical segment/transcript/asset theo session owner; client chỉ gửi segment ID + audio |

### 3.5 Security/ownership liên quan feature

Đã có auth, CSRF, rate limit, signed playback token và owner check ở phần lớn asset routes. Các điểm cần sửa trước khi mở feature rộng:

- Owner-only query đã áp dụng cho asset, jobs và transcript; tạo session/attempt kiểm tra asset -> transcript current ready -> segment.
- `referenceText`, `referenceDurationMs` và số attempt do server resolve/cấp trong transaction; client chỉ gửi audio và segment ID.
- Lỗi convert không còn đổi đuôi WebM thành WAV giả; trả lỗi 422. Base64, decoded size và duration WAV 0,5–15 giây đã được kiểm tra.
- Có signal-level gate sau server-side normalization: chặn near-silence và sustained clipping trước khi gọi ASR/Azure; metric RMS/active-frame/clipping được lưu cùng evaluation. Còn thiếu MIME sniff riêng, SNR/VAD gate và hàng đợi/concurrency limit GPU.

---

## 4. Bằng chứng runtime tại thời điểm audit

Snapshot read-only từ `DATABASE_URL` đang cấu hình ngày 2026-09-18. Không ghi hoặc in thông tin người dùng/nội dung video.

### 4.1 Dữ liệu

- Media assets: 139 `ready`, 16 `failed`, 2 `queued`.
- Jobs:
  - upload verify: 33 succeeded;
  - YouTube download: 29 succeeded, 9 failed;
  - transcribe: 24 succeeded, 8 failed.
- Transcript versions:
  - 15 ready từ `gemini:gemini-3.5-flash-lite`;
  - 9 ready từ các biến thể `local_whisper:large-v3`;
  - 6 version superseded.
- 1.660 transcript segments; cả 1.660 có `text_vi` và `text_furigana`.
- 3.255 tokens; tất cả có timestamps, nhưng không token nào có reading/lemma/POS.
- 25 shadowing attempts ở trạng thái `scored`; 25 score rows.
- 0 transcript ready có `quality_score`.
- Lỗi transcript phổ biến: `TRANSCRIPT_EMPTY` (4), generic processing (2), provider failed (2).
- Lỗi YouTube phổ biến: download failed (5), unavailable (3), thiếu yt-dlp (1).

### 4.2 Môi trường local

- `.env` có cấu hình DB, Gemini, local ASR URL, FFmpeg và YouTube; giá trị bí mật không ghi vào tài liệu.
- Local ASR health không phản hồi tại lúc audit, tức service chưa chạy dù module Python cần thiết có mặt.
- `var/media` có 128 media files, tổng khoảng 2,76 GB; thư mục bị gitignore.
- Không có Model A/B trained artifacts.

### 4.3 Test đã chạy

```text
npm run typecheck        PASS
npm run test:frontend    PASS: 14 files, 122 tests
npm run test:server      PASS: 38, SKIP: 3 integration tests cần DB test riêng
```

Relevant server subset có 15/15 test pass cho transcription, translation, shadowing và media ranges.

Python tests chưa chạy vì `.venv` hiện không có module `pytest`/`pip`, trong khi `ml/model_a/.venv` và `ml/model_b/.venv` chưa được tạo. Đây là thiếu môi trường test, không phải bằng chứng các test Python fail.

---

## 5. Các vấn đề ưu tiên theo mức độ

### P0 — phải sửa trước khi gọi đây là AI chấm phát âm thật

1. Xóa synthetic pitch contour; thiếu DSP thì trả `pitchStatus: unavailable`.
2. Đổi tên/nhãn điểm hiện tại thành **shadowing similarity/content/timing**, không khẳng định phoneme correctness.
3. Bỏ vocab, grammar và summary hard-code khỏi màn hình thật; thay bằng empty/loading/unavailable state cho đến khi backend trả dữ liệu.
4. Backend lấy reference text/timing từ segment DB, không tin client.
5. Siết owner relation asset -> transcript -> segment -> session -> attempt.
6. Không fallback raw WebM thành WAV giả khi FFmpeg lỗi.
7. Tách provenance/model version cho từng score component.

### P1 — chất lượng transcript/timeline

1. Chuẩn hóa stage, job retry/lease và idempotency.
2. Chấm quality theo coverage, overlap, confidence, empty ratio và language detection.
3. Phân biệt acoustic word timing với timing ước lượng/model-generated.
4. Persist learning segments/chunks server-side; bỏ chia timeline theo độ dài ký tự ở frontend.
5. Cho sửa transcript và re-align/re-enrich theo version.

### P2 — NLP/translation/content thật

1. Morphological analysis thật: reading, lemma, POS.
2. Furigana dạng structured token, không lưu HTML là nguồn canonical.
3. Dịch batch có context bằng provider được cấu hình; cache/provenance/retry.
4. Trích từ vựng/ngữ pháp có evidence span và dictionary grounding.
5. Summary/quiz grounded hoàn toàn trong transcript.

### P3 — pronunciation Model A/B

1. Nối Model A API để tạo phoneme alignment/GOP evidence.
2. Thu thập label người học Việt Nam có consent và teacher rubric.
3. Train/calibrate A6; đánh giá speaker-disjoint.
4. Chuẩn hóa reference audio và B2 evidence.
5. Train B4, nối B5, chỉ mở điểm tổng khi metric đạt gate.

---

## 6. Kiến trúc mục tiêu

```text
Browser
  |-- upload/import/status/playback/transcript
  |-- record shadowing attempt
  v
Node API (auth, ownership, contracts, orchestration)
  |-- PostgreSQL: asset/job/version/segment/token/enrichment/score
  |-- private media storage
  |-- job enqueue + status/event API
  v
Media Worker
  1. probe_and_verify
  2. extract_audio
  3. transcribe
  4. diarize/merge (nếu provider hỗ trợ)
  5. align_and_segment
  6. japanese_nlp
  7. translate_with_context
  8. extract_learning_content
  9. quality_gate -> ready | needs_review | failed

AI/ML services
  |-- ASR local: Faster-Whisper large-v3
  |-- ASR cloud optional: OpenAI diarized transcription
  |-- Translation/enrichment: Gemini structured JSON
  |-- Pronunciation A: phoneme CTC -> alignment/GOP -> calibrated classifier
  |-- Prosody B: mora + native reference -> F0/rhythm/intonation -> calibrated classifier
  v
Versioned evidence, never anonymous/fabricated scores
```

### 6.1 Nguyên tắc provider

Mỗi provider adapter phải khai báo capability thay vì code ngầm giả định:

```ts
type TranscriptionCapabilities = {
  segmentTiming: 'acoustic' | 'model_estimated'
  wordTiming: boolean
  speakerDiarization: boolean
  confidence: 'segment' | 'word' | 'none'
}
```

Quy tắc:

- Timeline karaoke cấp từ/chunk chỉ bật khi có word/phoneme timing thật.
- Nếu chỉ có segment timing, UI highlight cả câu; không chia thời gian theo ký tự rồi gọi là “chính xác”.
- Gemini transcript fallback phải lưu provenance `model_estimated`.
- Diarization local là một stage độc lập trong tương lai; không gán speaker giả.

### 6.2 Stack model được chọn

| Bài toán                       | Lựa chọn mặc định                                                         | Fallback                                 | Lý do                                                |
| ------------------------------ | ------------------------------------------------------------------------- | ---------------------------------------- | ---------------------------------------------------- |
| ASR local                      | Existing Faster-Whisper `large-v3`                                        | CPU int8                                 | Đã có code, word timing, giữ dữ liệu local           |
| ASR production                 | Existing OpenAI diarized adapter                                          | Gemini transcript có nhãn estimated      | Speaker diarization đã được chuẩn bị trong contract  |
| Text alignment                 | Word timestamps; Model A CTC forced alignment khi có transcript canonical | Segment-level only                       | Không bịa word timing                                |
| Japanese morphology            | Spike và chọn SudachiPy + core dictionary; tái dùng pyopenjtalk cho G2P   | Existing dictionary/Intl heuristic       | Cần lemma/POS/reading thực                           |
| Dịch Nhật–Việt                 | `translation-provider.mjs` Gemini structured response, theo batch context | Không dịch + retry                       | Provider chính thức, test được, có schema            |
| Vocab/grammar                  | Deterministic dictionary/grammar DB trước, LLM chỉ đề xuất/rank           | Empty state                              | Giảm hallucination                                   |
| Summary/quiz                   | Gemini JSON schema, grounded segment IDs                                  | Không sinh                               | Cần trace về transcript                              |
| Content pronunciation          | Model A CTC/GOP + A6 classifier                                           | ASR content similarity, nhãn riêng       | Tách “nói đúng câu” khỏi “phát âm đúng”              |
| Managed pronunciation baseline | Azure Pronunciation Assessment (ja-JP)                                    | Không có điểm external nếu chưa cấu hình | Có kết quả ổn định để dùng và làm mốc so sánh thesis |
| Pitch/rhythm/intonation        | Model B B2/B4/B5                                                          | DSP visualization `review_only`          | Tách prosody khỏi phoneme                            |

Không đổi model/version chỉ vì có model mới. Mọi thay đổi phải có evaluation set và lưu `provider`, `model`, `configVersion`, `promptVersion`, `scoringVersion`.

---

## 7. Contract dữ liệu mục tiêu

### 7.1 Transcript segment

Canonical transcript không lưu HTML làm nguồn chính:

```json
{
  "id": "uuid",
  "sequenceNo": 1,
  "speaker": { "label": "SPEAKER_00", "confidence": 0.91 },
  "startMs": 1200,
  "endMs": 4380,
  "textJa": "今日は学校に行きます。",
  "timingSource": "acoustic_word",
  "asrConfidence": 0.88,
  "qualityFlags": [],
  "translation": {
    "textVi": "Hôm nay tôi đi học.",
    "provider": "gemini",
    "model": "configured-model",
    "contextWindow": [0, 1, 2],
    "status": "machine"
  },
  "tokens": [],
  "chunks": []
}
```

### 7.2 Japanese token

```json
{
  "surface": "学校",
  "reading": "ガッコウ",
  "readingHiragana": "がっこう",
  "lemma": "学校",
  "partOfSpeech": "名詞",
  "startChar": 3,
  "endChar": 5,
  "startMs": 1980,
  "endMs": 2620,
  "timingConfidence": 0.86,
  "dictionaryEntryId": "optional"
}
```

### 7.3 Learning content

Mọi vocab/grammar/summary item phải chứa:

- `sourceSegmentIds`;
- exact `evidenceText` hoặc char spans;
- provider/model/rule version;
- confidence;
- `reviewStatus: machine | reviewed | rejected`;
- không xuất hiện ở UI nếu không truy ngược được về transcript.

### 7.4 Shadowing evaluation

```json
{
  "evaluationStatus": "scored | partial | unscorable | review_only",
  "content": { "score": 91, "source": "asr_alignment", "version": "..." },
  "phoneme": { "score": null, "status": "not_calibrated", "phones": [] },
  "managedBaseline": {
    "provider": "azure_pronunciation_assessment",
    "overallScore": 86,
    "accuracyScore": 88,
    "fluencyScore": 82,
    "completenessScore": 100,
    "words": []
  },
  "rhythm": { "score": 78, "source": "model_b_or_dsp", "version": "..." },
  "pitch": { "score": null, "status": "unavailable", "contours": null },
  "overall": { "score": null, "reason": "required_component_not_calibrated" },
  "feedback": [],
  "audioQuality": {},
  "provenance": {}
}
```

Không ép `null` thành 0. Không tạo overall grade khi component bắt buộc thiếu hoặc chưa calibrate.

---

## 8. Thay đổi database dự kiến

Không sửa migration cũ đã chạy; tạo migration mới theo số tiếp theo sau migration hiện có.

### 8.1 Bổ sung media/jobs

- `media_assets`: probe metadata (`container`, `audio_codec`, `sample_rate`, checksum), `pipeline_version`.
- `media_processing_jobs`: `available_at`, `lease_expires_at`, `heartbeat_at`, `max_attempts`, `depends_on_job_id`, progress phần trăm/stage.
- Unique idempotency key: `(media_asset_id, job_type, pipeline_version, input_hash)` cho job active/succeeded.

### 8.2 Transcript provenance/quality

- `transcript_versions`: `model`, `config_version`, `timing_source`, `quality_report jsonb`, `review_status`.
- `transcript_segments`: `timing_source`, `quality_flags jsonb`, `translation_status`, `translation_provider`, `translation_model`.
- `segment_tokens`: `reading_hiragana`, char spans, timing confidence, morphology provider/version.
- Tạo `segment_chunks` để persist phrase/chunk boundaries và timings.
- Tạo `transcript_edits` hoặc version diff/audit table; không update machine transcript mất dấu.

### 8.3 Enrichment/content

- Dùng `grammar_annotations` hiện có nhưng thêm `source`, `model_version`, `review_status`, evidence spans.
- Tạo `video_vocabulary_items` với token/entry linkage, frequency, first segment, JLPT, review status.
- Tạo `video_summaries` có prompt/model/version/source transcript version.
- Dùng `video_quizzes` hiện có, bắt buộc evidence/source và validation state.

### 8.4 Pronunciation provenance

- Bổ sung `shadowing_attempts`: `audio_quality`, `reference_segment_version`, `consent_to_retain`, optional retention deadline.
- Bổ sung `shadowing_scores`: component status/provenance JSON, model A/B artifact IDs, không chỉ numeric score.
- Nếu giữ audio attempt: object key private, encryption/retention/delete workflow; mặc định xóa sau inference nếu user không consent dataset.

---

## 9. API mục tiêu

Giữ các endpoint hiện có để tương thích, bổ sung:

| Method | Path                                           | Mục đích                                                                  |
| ------ | ---------------------------------------------- | ------------------------------------------------------------------------- |
| GET    | `/api/v1/video/assets/:id/pipeline`            | Trả stage/progress/capabilities/provenance                                |
| GET    | `/api/v1/video/assets/:id/transcript`          | Thêm quality/timing source/review state                                   |
| POST   | `/api/v1/video/assets/:id/transcript/versions` | Tạo version editor từ correction                                          |
| POST   | `/api/v1/video/assets/:id/reprocess`           | Chọn stage bắt đầu lại, idempotent                                        |
| GET    | `/api/v1/video/assets/:id/learning-content`    | Vocab/grammar/summary/quiz đã grounded                                    |
| POST   | `/api/v1/video/assets/:id/summary`             | Enqueue summary nếu chưa có                                               |
| POST   | `/api/v1/shadowing/sessions`                   | Backend resolve transcript canonical và owner                             |
| POST   | `/api/v1/shadowing/sessions/:id/attempts`      | Client chỉ gửi segment ID + audio; server resolve text/duration/attemptNo |
| GET    | `/api/v1/shadowing/attempts/:id`               | Trả component status/provenance và evidence                               |

API không trả đường dẫn storage, prompt nội bộ, provider error raw hoặc secret. Error code phải ổn định và retryability rõ.

---

## 10. Backlog thực thi chi tiết

Ước lượng là **engineering days**, dùng để sắp thứ tự chứ không phải cam kết lịch. Mỗi task phải có test và cập nhật tài liệu này.

### Phase 0 — Truthfulness, integrity và authorization (2–4 ngày)

#### AVI-000 — Loại bỏ dữ liệu AI giả

- `[x]` Xóa generated pitch contours trong `server/shadowing-scorer.mjs`.
- `[x]` Trả contour/điểm pitch thật hoặc `null`.
- `[x]` Xóa hard-coded summary/vocab/grammar khỏi `VideoStudyPlayer.tsx`.
- `[x]` Empty state cho grammar; summary deterministic; vocab chỉ hiện dictionary-grounded item.
- `[x]` Đổi label “Phát âm” hiện tại thành “Độ khớp nội dung”/“Độ khớp câu đọc”.

**Acceptance:** tắt ASR/DSP/LLM không còn sinh điểm/biểu đồ/nội dung giả; frontend tests cover missing-data states.

#### AVI-001 — Server-owned reference contract

- `[x]` Attempt request không dùng `referenceText`, `referenceDurationMs`, `attemptNo` từ client.
- `[x]` Load session -> transcript -> segment trong một ownership-safe query.
- `[x]` Tự tính attempt number trong transaction/unique constraint.
- `[x]` Reject segment không thuộc transcript/session bằng `SEGMENT_SESSION_MISMATCH`.

**Acceptance:** sửa request payload không thể thay target text hay chấm segment của video khác.

#### AVI-002 — Ownership audit

- `[x]` Bỏ điều kiện `OR assets.processing_status = 'ready'` ở owned-video queries.
- `[x]` Validate owner khi tạo shadowing session.
- `[x]` Validate transcript belongs to asset và current/allowed version.
- `[x]` Thêm memory-store test với user A/user B và segment/transcript sai.

#### AVI-003 — Audio validation/failure semantics

- `[x]` Nếu FFmpeg conversion lỗi, trả lỗi 422, không copy raw bytes thành `.wav`.
- `[~]` Validate base64/decoded bytes và duration WAV 0.5–15 giây; conversion chuẩn hoá 16 kHz mono. MIME sniff riêng còn thiếu.
- `[~]` Reject near-silence và sustained clipping trước ASR/Azure với feedback cụ thể; chưa có SNR/VAD speech-ratio chuẩn.
- `[~]` Có rate limit 20 attempts/15 phút; chưa có concurrent queue limit GPU.

### Phase 1 — Pipeline/job foundation (3–5 ngày)

#### AVI-010 — Stage graph và idempotency

- `[ ]` Chuyển pipeline thành stage rõ: verify -> probe/extract -> transcribe -> align -> NLP -> translate -> learning content -> quality gate.
- `[ ]` Mỗi stage có input/output schema, version và input hash.
- `[ ]` Không rerun stage succeeded khi input/model version không đổi.
- `[ ]` Worker hỗ trợ dependency và resume từ stage failed.

#### AVI-011 — Job lease/recovery

- `[~]` Có lease timeout bằng `started_at`, cấu hình `MEDIA_JOB_STALE_AFTER_MS` và worker recovery định kỳ.
- `[~]` Requeue job stale khi process chết; job vượt 10 attempts thành failed. Chưa có heartbeat/backoff + jitter.
- `[ ]` Phân biệt transient/permanent error.
- `[~]` Asset có stale job sẽ chuyển `queued` hoặc `failed`; cần thêm dashboard/alert cho retry dài.

#### AVI-012 — Progress/observability

- `[ ]` Store stage progress, duration, provider request ID, token/audio seconds và sanitized error.
- `[ ]` Structured log có `requestId`, `assetId`, `jobId`, `attemptId`.
- `[ ]` Metrics: queue lag, stage latency, success rate, retry rate, provider error rate.
- `[ ]` Processing UI hiển thị stage thật thay vì suy đoán từ vài job types.

### Phase 2 — Transcript và timeline tin cậy (5–8 ngày)

#### AVI-020 — Provider capability contract

- `[ ]` Chuẩn hóa output local/OpenAI/Gemini vào một schema.
- `[ ]` Lưu capability và `timingSource`.
- `[ ]` Test boundary chunk, overlap, empty chunk, timestamp ngoài duration, speaker change.

#### AVI-021 — Media probe và audio normalization

- `[ ]` `ffprobe` duration/container/codecs trước transcript.
- `[ ]` Extract canonical 16 kHz mono WAV/FLAC artifact một lần, tái dùng cho downstream.
- `[ ]` Detect music-only/low speech coverage/VAD statistics.
- `[ ]` Lưu checksum để tránh xử lý file trùng.

#### AVI-022 — Alignment và segmentation

- `[ ]` Khi có word timestamps: segment theo pause/punctuation/speaker, target 2–10 giây.
- `[ ]` Khi transcript được sửa: dùng forced alignment để căn lại; nếu confidence thấp, mark review.
- `[ ]` Persist segment/chunk boundaries server-side.
- `[ ]` Xóa `splitOverlongSegment` proportional timing khỏi vai trò canonical; frontend chỉ render.

#### AVI-023 — Transcript quality gate

Tính quality report từ:

- speech coverage và empty chunks;
- timestamp monotonic/overlap/gaps;
- language confidence;
- ASR confidence/no-speech probability nếu provider có;
- character sanity/repetition/hallucination;
- segment duration/length outlier;
- sample manual WER/CER evaluation set.

Kết quả: `ready`, `needs_review`, hoặc `failed`; ghi `quality_score` và flags, không chỉ một số mơ hồ.

#### AVI-024 — Transcript editor/versioning

- `[ ]` UI sửa text/speaker/boundary.
- `[ ]` Save version mới `source=editor`; giữ machine version cũ.
- `[ ]` Re-run align/NLP/translation/content từ version mới.
- `[ ]` Audit ai sửa và lúc nào.

### Phase 3 — Japanese NLP và translation (5–8 ngày)

#### AVI-030 — Morphology spike

- `[ ]` Benchmark SudachiPy vs pyopenjtalk/existing dictionary trên 100–300 câu anime/hội thoại.
- `[ ]` Chọn theo token boundary, lemma, reading, POS, Windows/Linux deploy cost.
- `[ ]` Pin version/dictionary; ghi license.
- `[ ]` Tạo service/CLI batch, không gọi process Python cho từng token.

#### AVI-031 — Structured tokens/furigana

- `[ ]` Persist surface, reading, lemma, POS, char spans.
- `[ ]` Render `<ruby>` ở frontend từ structured tokens; sanitize/không tin HTML DB.
- `[ ]` Xử lý okurigana, names, loanwords, numbers, punctuation và user dictionary.
- `[ ]` Unit corpus cho sokuon `っ`, long vowel `ー`, `ん`, rendaku và proper nouns.

#### AVI-032 — Bunsetsu/learning chunks

- `[ ]` Đổi tên hiện tại thành `heuristic_phrase` nếu chưa có dependency parser.
- `[ ]` Persist chunk tokens/timing/confidence.
- `[ ]` Chỉ highlight karaoke khi source timing đủ mạnh.
- `[ ]` Không tự chia theo tỷ lệ ký tự nếu UI gắn nhãn timing chính xác.

#### AVI-033 — Context-aware translation

- `[ ]` Worker gọi `translateJapaneseToVietnamese` hoặc batch extension chính thức.
- `[ ]` Bỏ endpoint `client=gtx`.
- `[ ]` Gửi cửa sổ 1–2 câu trước/sau, speaker labels, nhưng output map đúng segment ID.
- `[ ]` JSON schema, prompt injection isolation, timeout/retry/cache by hash.
- `[ ]` Lưu provider/model/prompt version/context IDs.
- `[ ]` Evaluation set Nhật–Việt có reviewer, đo adequacy/fluency và name consistency.

### Phase 4 — Nội dung học thật từ video (4–7 ngày)

#### AVI-040 — Vocabulary extraction

- `[ ]` Lấy candidate từ lemma/POS/frequency, bỏ stop tokens.
- `[ ]` Ground vào `master_dictionary.db`, reading/meaning/JLPT nếu có.
- `[ ]` Lưu first occurrence, count, segment IDs.
- `[ ]` Tab vocab đọc API thật; mastery lấy từ SRS của user, không random/hard-code.
- `[ ]` “Lưu” tạo SRS item idempotently với source context video/segment.

#### AVI-041 — Grammar detection

- `[ ]` Match deterministic grammar DB trước.
- `[ ]` LLM chỉ đề xuất pattern chưa match, bắt buộc quote span và confidence.
- `[ ]` Validate spans tồn tại trong exact segment text.
- `[ ]` Persist `grammar_annotations`; UI nhảy về câu nguồn.

#### AVI-042 — Summary grounded

- `[ ]` Summary job dùng transcript version hiện tại, chunk nếu dài.
- `[ ]` Output JSON gồm bullet + supporting segment IDs.
- `[ ]` Không cho model thêm từ vựng/ngữ pháp không có evidence.
- `[ ]` Nút summary gọi job/API và hiển thị provenance.

#### AVI-043 — Quiz generation

- `[ ]` Sinh quiz từ reviewed transcript/translation.
- `[ ]` Deterministic distractor validation; không để answer key mâu thuẫn.
- `[ ]` Admin/reviewer gate trước publish nếu dùng catalog.

### Phase 5 — Pronunciation MVP có bằng chứng phoneme (5–8 ngày)

#### AVI-049 — Managed baseline và protocol so sánh thesis

- `[x]` Tích hợp Azure Pronunciation Assessment short-audio `ja-JP` sau server-side WAV normalization; key không được gửi client/log.
- `[x]` Chuẩn hoá và persist `overall/accuracy/fluency/completeness`, recognized text, word/phoneme evidence; loại bỏ raw provider response.
- `[x]` Nếu Azure có transcript thì không ghi đè bằng Whisper; nếu provider lỗi/chưa cấu hình, fallback local ASR + DSP vẫn chạy.
- `[ ]` Tạo gold set có consent + rubric giáo viên và export so sánh Azure/Model A/Model B theo cùng audio, cùng split speaker-disjoint.
- `[ ]` Báo correlation với teacher, macro-F1 theo nhãn, MAE/RMSE score, calibration (ECE), latency/cost/failure rate; không chỉ so average score.

**Config:** `AZURE_SPEECH_KEY`, `AZURE_SPEECH_REGION`, optional `AZURE_PRONUNCIATION_TIMEOUT_MS` (3–60 s, default 15 s). Khi thiếu một trong key/region, Azure tắt hoàn toàn; không có network call.

**So sánh sau khi train:** không thay đổi `evaluation.overallScore` cục bộ để “làm đẹp” score. Lưu từng baseline/model với provider, artifact/model version, config version, timestamp và evidence riêng; một bảng kết quả thesis chỉ so các attempt/audio giống hệt nhau.

#### AVI-050 — Model A service packaging

- `[ ]` Tạo reproducible `ml/model_a/.venv`/container, CUDA và CPU profile.
- `[ ]` Chạy toàn bộ Model A tests và smoke test với audio thật được phép.
- `[ ]` Thêm config `PRONUNCIATION_SERVICE_URL`, health/readiness, timeout/circuit breaker.
- `[ ]` Không load untrusted joblib; artifact allowlist + checksum.

#### AVI-051 — Worker/API integration Model A

- `[ ]` Server gửi attempt audio + expected text canonical tới A9.
- `[ ]` Lưu phoneme alignment/GOP/rule evidence và model version.
- `[ ]` Map phoneme findings về token/mora timestamps cho UI.
- `[ ]` Khi chưa có A6 artifact: trạng thái `review_only`, không overall correctness grade.

#### AVI-052 — Audio-quality gate

- `[~]` Detect near-silence, quiet recording và sustained clipping trên canonical 16 kHz mono PCM; duration đã được check riêng. Chưa có SNR/VAD speech ratio.
- `[x]` Recording `unscorable` bị reject trước provider/scoring, nên không lưu thành attempt score 0 hay tính vào tiến độ/mastery.
- `[ ]` Feedback ưu tiên sửa microphone trước sửa phát âm.

#### AVI-053 — Honest score composition

- `[ ]` Tách content vs phoneme vs timing vs pitch.
- `[ ]` Component thiếu giữ `null` + status.
- `[ ]` Weight chỉ áp dụng khi model calibrate; lưu scoring formula version.
- `[ ]` UI cho xem “hệ thống nghe thành gì” nhưng không gọi đó là lỗi phát âm chắc chắn.

### Phase 6 — Data collection và calibration Model A (phụ thuộc người thật, 2–4+ tuần)

#### AVI-060 — Consent và data governance

- `[ ]` Consent riêng cho dùng recording cải thiện model.
- `[ ]` Pseudonymous speaker ID, quyền rút/xóa, retention policy.
- `[ ]` Không dùng recording thường để train nếu chưa consent.
- `[ ]` Dataset license matrix được review.

#### AVI-061 — Pilot Vietnamese learner corpus

- `[ ]` Chọn sentence set bao phủ sokuon, trường âm, devoicing, `ん`, mora timing và cặp âm khó với người Việt.
- `[ ]` Nhiều speaker/gender/device/environment; không để speaker leakage.
- `[ ]` Ít nhất hai rater cho subset; đo agreement.
- `[ ]` Dùng rubric A5; nhãn `correct/near_correct/incorrect/unscorable`.

#### AVI-062 — Train/evaluate A6

- `[ ]` Export GOP/evidence, train logistic baseline trước model phức tạp.
- `[ ]` Báo macro-F1, per-phoneme F1, false accept/reject, calibration curve/ECE.
- `[ ]` Test speaker độc lập; phân tích theo device/noise/gender nếu dữ liệu cho phép.
- `[ ]` Chọn threshold theo mục tiêu học tập, không tối ưu accuracy chung.

**Release gate gợi ý:** không quảng cáo score correctness nếu chưa có test set speaker-disjoint, rater agreement và false-accept rate được chấp nhận/document.

### Phase 7 — Prosody Model B/B5 (7–12 ngày sau khi có data)

#### AVI-070 — Reference audio contract

- `[ ]` Reference phải đúng exact sentence/text/version và có quyền sử dụng.
- `[ ]` Cắt với padding nhỏ, chuẩn hóa audio nhưng giữ prosody.
- `[ ]` Model A alignment topology khớp learner/reference.

#### AVI-071 — B2 productionization

- `[ ]` Thay `raw_ac_fallback` bằng pitch backend đã review hoặc ghi rõ giới hạn.
- `[ ]` Extract mora F0/rhythm/pause evidence; reject topology mismatch.
- `[ ]` Không so absolute Hz trực tiếp giữa hai người; dùng normalized contour phù hợp.

#### AVI-072 — B3/B4 labels và calibration

- `[ ]` Thu label pitch/rhythm/intonation theo speaker-disjoint split.
- `[ ]` Train B4, đánh giá per-task và rater agreement.
- `[ ]` Artifact version/checksum/review metadata.

#### AVI-073 — B5 integration

- `[ ]` Worker tạo Model A score + B2 evidence một lần.
- `[ ]` B5 ghép feedback theo mora.
- `[ ]` UI click issue -> phát đúng khoảng mora/reference.
- `[ ]` Giữ `review_only_baseline` cho đến khi release gate đạt.

### Phase 8 — UX, QA và production hardening (5–8 ngày)

#### AVI-080 — Processing UX

- `[ ]` Stage progress, ETA khoảng, retry từ stage, cancel/delete.
- `[ ]` Phân biệt “video xem được nhưng AI chưa xong”.
- `[ ]` Review transcript trước khi tạo learning content với quality thấp.

#### AVI-081 — Shadowing UX

- `[ ]` Quy trình nghe -> thu -> nghe lại -> đánh giá -> luyện issue cụ thể.
- `[ ]` Accessibility, keyboard, mobile microphone states.
- `[ ]` Không dùng màu duy nhất để biểu đạt đúng/sai.

#### AVI-082 — Performance/cost

- `[ ]` Cache by audio/text/model hash.
- `[ ]` Batch translation/enrichment; giới hạn concurrency GPU/provider.
- `[ ]` Theo dõi cost theo phút audio, asset và user.
- `[ ]` Retention cleanup cho extracted chunks/temp files.

#### AVI-083 — Production topology

- `[ ]` Render hiện không chạy local Whisper/CUDA; production dùng cloud adapter hoặc tách GPU service có private auth.
- `[ ]` Worker và API có thể cùng process vì persistent disk chỉ gắn một service; nếu tách, chuyển media sang object storage.
- `[ ]` Readiness phản ánh DB/storage/provider queue, không bắt provider cloud luôn online.

---

## 11. Test strategy và quality gates

### 11.1 Unit/contract

- Provider normalization golden fixtures cho local/OpenAI/Gemini.
- Timestamp invariants: monotonic, non-negative, within media, no invalid overlap.
- Japanese tokenization/reading/g2p corpus.
- Translation JSON/parser/prompt-injection tests.
- Ownership relation tests.
- Score composition with missing/unscorable/not-calibrated components.

### 11.2 Integration

Fixture video ngắn có quyền sử dụng với transcript chuẩn và speaker changes.

```text
upload -> verify -> transcribe -> NLP -> translate -> ready
       -> playback range
       -> transcript timeline
       -> shadowing attempt -> evidence -> persistence
```

Các test phải chạy với provider fake deterministic trong CI; provider thật chạy nightly/manual và không làm CI flaky.

### 11.3 Evaluation sets

- ASR: CER/WER Nhật, timestamp error, diarization DER nếu có.
- Translation: reviewer adequacy/fluency/consistency.
- NLP: token boundary, reading, lemma/POS accuracy.
- Pronunciation: macro-F1, false accept/reject, calibration error, rater agreement.
- Prosody: pitch/rhythm/intonation task metrics, speaker-disjoint.

### 11.4 Required commands mỗi task

Tối thiểu:

```powershell
npm run format:check
npm run typecheck
npm run lint
npm run test:frontend
npm run test:server
npm run build
```

Khi đụng Model A/B, phải bootstrap env riêng và chạy:

```powershell
ml\model_a\.venv\Scripts\python.exe -m pytest ml/model_a/tests -q
ml\model_b\.venv\Scripts\python.exe -m pytest ml/model_b/tests -q
```

Không dùng DB production cho integration mutation test. Dùng database/schema test tách biệt.

---

## 12. Product success metrics

### Video pipeline

- % asset hoàn tất từng stage;
- processing latency p50/p95 trên mỗi phút video;
- transcript failure/retry rate theo provider;
- tỷ lệ asset `needs_review`;
- cost/phút audio.

### Transcript learning

- CER/WER và median timestamp absolute error trên gold set;
- % tokens có reading/lemma/POS;
- translation reviewer pass rate;
- số vocab/grammar item grounded được user lưu/học.

### Shadowing

- `unscorable` rate và nguyên nhân;
- retry-to-improvement rate;
- correlation với teacher ratings;
- false positive nghiêm trọng: hệ thống khen sai;
- score stability khi cùng speaker đọc lại trong điều kiện giống nhau.

Không tối ưu engagement bằng cách cho điểm cao giả. Tính tin cậy quan trọng hơn điểm “đẹp”.

---

## 13. Privacy, bản quyền và safety

- Upload chỉ dành cho nội dung owned/licensed/internal; `rights_basis` phải giữ và được enforce.
- YouTube local không đồng nghĩa có quyền sao chép/đưa lên production.
- Voice recording là dữ liệu nhạy cảm; mặc định inference rồi xóa, chỉ giữ khi có mục đích/consent rõ.
- Tách telemetry sản phẩm khỏi dataset training.
- Không log raw transcript/audio/base64/token/provider secret.
- LLM prompt phải coi transcript là dữ liệu không tin cậy, không phải instruction.
- Model feedback là hỗ trợ học, không phải chứng nhận ngôn ngữ hay đánh giá y khoa.
- Artifact pickle/joblib chỉ load từ local trusted build, có checksum.

---

## 14. Definition of Done cuối cùng

Feature được coi là hoàn thành khi một user thật có thể:

1. Upload video tiếng Nhật có quyền sử dụng.
2. Theo dõi các stage và hiểu lỗi/retry.
3. Nhận transcript Nhật có segment timeline đúng, provenance và quality state.
4. Xem furigana/romaji/dịch Việt thật, không hard-code.
5. Bấm từ/cụm để tra; xem vocab/grammar lấy đúng từ video và lưu vào SRS.
6. Sửa transcript sai và reprocess version mới.
7. Chọn một câu, nghe reference, ghi âm và nhận:
   - ASR content comparison;
   - phoneme evidence đã calibrate hoặc nhãn rõ `review_only`;
   - rhythm/pitch evidence thật hoặc `unavailable`;
   - feedback gắn timestamp, không bịa dữ liệu.
8. Dữ liệu chỉ truy cập bởi đúng owner/catalog policy.
9. Pipeline sống sót worker restart, idempotent và có metrics.
10. Full JS/TS/Python quality gates và gold-set evaluation đạt ngưỡng đã công bố.

---

## 15. Thứ tự bắt đầu khuyến nghị

Sprint đầu không nên lao ngay vào train model. Thứ tự có giá trị cao nhất:

1. `AVI-000` đến `AVI-003`: trung thực UI + integrity + security.
2. `AVI-010` đến `AVI-012`: job pipeline có thể phục hồi/quan sát.
3. `AVI-020` đến `AVI-024`: transcript/timeline làm nguồn sự thật.
4. `AVI-030` đến `AVI-033`: NLP/dịch chuẩn.
5. `AVI-040` đến `AVI-043`: thay toàn bộ placeholder bằng content thật.
6. `AVI-050` đến `AVI-053`: nối Model A ở chế độ review-only.
7. Song song về mặt tổ chức, chuẩn bị consent/rater/dataset cho `AVI-060+`.
8. Chỉ sau calibration mới bật Model B/B5 score tổng cho learner.

MVP đáng tin cậy đầu tiên có thể dừng ở cuối Phase 5: video -> transcript/timeline -> dịch/NLP/content thật -> shadowing có content/timing và phoneme evidence review-only. Điều này tốt hơn nhiều so với một “điểm phát âm 90” không có calibration.

---

## 16. Decision log

### 2026-09-18 — D-001: Không viết lại toàn bộ stack

Giữ React/Node/PostgreSQL/media worker vì ingestion, storage, auth, playback, transcript và shadowing persistence đã hoạt động và có test.

### 2026-09-18 — D-002: Tách content correctness khỏi pronunciation

Transcript match không phải bằng chứng đủ cho phát âm đúng. UI và schema phải tách content, phoneme, timing và prosody.

### 2026-09-18 — D-003: Model A/B chưa phải production score

Cho phép nối để thu evidence và demo `review_only`; không dùng pass/fail/mastery/leaderboard trước calibration speaker-disjoint.

### 2026-09-18 — D-004: Không sinh fallback giả

Provider/model thiếu dữ liệu phải trả `unavailable`, không sinh pitch, vocab, grammar, summary hoặc score có vẻ thật.

### 2026-09-18 — D-005: Transcript version là source of truth

Mọi translation, vocab, grammar, summary, quiz, reference text và scoring phải trỏ tới exact transcript/segment version.

### 2026-09-18 — D-006: Deterministic grounding trước LLM

Dictionary/morphology/grammar DB tạo và kiểm candidate trước; LLM dùng cho dịch, xếp hạng, giải thích và summary có evidence.

### 2026-09-18 — D-007: Managed baseline trước, self-trained model để so sánh sau

Azure Pronunciation Assessment là baseline managed optional cho `ja-JP`, dùng để có kết quả ổn định sớm. Điểm Azure không được trộn vào score shadowing cục bộ và không được gọi là model tự train. Model A/B chỉ được đưa vào bảng so sánh sau khi có dữ liệu consent, nhãn teacher và split speaker-disjoint.

---

## 17. Nhật ký phiên làm việc

### 2026-09-18 — Audit và master plan

- Rà soát toàn bộ danh sách file và sâu các khu vực video/server/ML/schema/deploy/test.
- Xác nhận pipeline đã có dữ liệu thật trong DB.
- Chạy typecheck, toàn bộ frontend test và toàn bộ server test: pass như mục 4.3.
- Python ML tests chưa chạy do chưa bootstrap env Model A/B.
- Tạo tài liệu chung này; chưa thay đổi runtime behavior trong phiên audit.

Các phiên sau thêm entry mới ở đây với task IDs, commit, migrations, tests và vấn đề còn lại.

### 2026-09-18 — Phase 0 truthfulness, integrity và learning-content nền (chưa commit)

- Hoàn thành `AVI-000`, `AVI-001`, `AVI-002`; hoàn thành một phần `AVI-003`.
- Shadowing: backend lấy reference text/duration từ canonical segment, attempt number do PostgreSQL transaction cấp; session/asset/transcript/segment phải cùng owner. Không còn trả evaluation 201 giả khi DB không lưu được.
- Audio: request không gửi duration; server validate base64/kích thước, FFmpeg -> 16 kHz mono WAV, đo duration từ RIFF data, giới hạn 0,5–15 giây; lỗi conversion trả 422 và luôn cleanup temp.
- DSP: khi voiced contour không đủ, `pitchScore` là `null`, không sinh contour/score trung bình. UI đổi nhãn tránh tuyên bố đây là điểm phát âm âm vị.
- Learning content: thêm `server/video-learning-content.mjs` và API owner-only `GET /api/v1/video/assets/:id/learning-content`; vocabulary được lấy từ token current transcript rồi exact lookup trong `master_dictionary.db`. UI dùng endpoint, chỉ hiển thị nghĩa có thật và mở modal từ điển khi bấm từ. Grammar tiếp tục empty state, summary chỉ là dữ kiện deterministic.
- Translation enrichment chuyển khỏi `client=gtx` không chính thức sang `translateJapaneseToVietnamese`.
- `AVI-011` bắt đầu: worker phục hồi tối đa 100 stale `running` jobs mỗi chu kỳ, dùng `FOR UPDATE SKIP LOCKED` trên PostgreSQL; dưới 10 lần thử thì queue lại, quá giới hạn thì failed. Cấu hình mới: `MEDIA_JOB_STALE_AFTER_MS` (mặc định 15 phút) và `MEDIA_JOB_RECOVERY_INTERVAL_MS` (mặc định 60 giây).
- Thêm test `auth-store-shadowing.test.mjs`, `transcription-provider.test.mjs`, `video-learning-content.test.mjs`; sửa scorer/integration test.
- Gates đã chạy: `npm run typecheck`, `npm run lint`, `npm run test:server` (38 pass, 3 PostgreSQL skip), frontend (122 pass), production build, `py -3 -m py_compile server/dsp_service.py`. `format:check` toàn repo vẫn báo 142 file cũ ngoài phạm vi; toàn bộ file đã sửa đều pass Prettier khi kiểm riêng.
- Vẫn bị chặn để hoàn thành Pronunciation Model A/B production: chưa có artifact A6/B4 calibrated hoặc dữ liệu người học có consent/rater. Không được train/đặt “điểm phát âm” production khi thiếu hai đầu vào này.

### 2026-09-18 — AVI-049 managed pronunciation baseline (chưa commit)

- Thêm `server/pronunciation-provider.mjs`: adapter Azure short-audio `ja-JP`, timeout, error code ổn định, chỉ trả contract đã chuẩn hoá (điểm, transcript, word/phoneme evidence), không đưa raw response/key ra client/log.
- Thêm config/documentation: `AZURE_SPEECH_KEY`, `AZURE_SPEECH_REGION`, `AZURE_PRONUNCIATION_TIMEOUT_MS`. Không có cả key lẫn region thì luồng Azure tắt, product tiếp tục dùng local ASR + DSP.
- Trong shadowing endpoint: audio vẫn do server chuẩn hoá WAV 16 kHz; Azure là nguồn transcript ưu tiên khi trả text; Whisper/Gemini chỉ fallback. Score Azure được persist trong `feedback.providerAssessment` và UI hiển thị tách riêng là **baseline**, không phải model hiệu chỉnh cho người học Việt Nam.
- Để lại Model A/B self-training và calibration ở AVI-050+ / AVI-060+; `AVI-049` định nghĩa protocol so sánh công bằng cùng audio/gold set/speaker-disjoint.
- Tests thêm: config enable/disable, Azure response normalization/fail-closed và scorer separation. Gates sau thay đổi phải chạy lại trước khi giao.

### 2026-09-18 — AVI-052 audio quality gate nền (chưa commit)

- Thêm `server/audio-quality.mjs`: đọc đúng WAV canonical sau FFmpeg và đo RMS dBFS, peak, active-frame ratio, clipping ratio. Đây là kiểm tra tín hiệu, **không** phải điểm phát âm hay ước lượng SNR.
- Near-silence hoặc clipping liên tục trả `422 AUDIO_QUALITY_UNSCORABLE` trước Azure/ASR/DSP, với thông báo hướng dẫn sửa microphone. Bài thu không bị persist thành score 0.
- Recording hợp lệ lưu metric quality vào evaluation/feedback để phục vụ audit và protocol so sánh model sau này. UI hiển thị chính xác error API thay vì thông báo upload chung chung.
