# Kotodama

Kotodama là web app học ngôn ngữ với lộ trình, từ vựng/SRS, video AI và quản trị tài khoản.

## Phát triển

```bash
npm install
npm run db:migrate
npm run api
npm run dev
```

API đọc `DATABASE_URL` từ `.env`, áp migration bằng `npm run db:migrate` và dùng PostgreSQL để lưu tài khoản,
phiên đăng nhập, token một lần và nhật ký quản trị. File `.env` không được commit; xem `.env.example` để biết cấu hình.

### Kho giáo trình từ vựng (Curriculum Library)

Kho giáo trình từ vựng chuẩn hỗ trợ lưu trữ phân tách qua biến môi trường `CURRICULUM_STORAGE`:

- **Ở local dev (mặc định)**: Sử dụng SQLite tại `CURRICULUM_SQLITE_PATH` (mặc định: `tmp/curriculum/curriculum.db`). Chạy `npm run curriculum:ingest` để ingest dữ liệu canonical vào SQLite. **Tuyệt đối không chạy migration hoặc ingest vào Neon/PostgreSQL production khi chưa thẩm định quyền sử dụng.**
- **PostgreSQL**: Chỉ kích hoạt khi được cấu hình tường minh `CURRICULUM_STORAGE=postgres` (khi DB đích đã được áp dụng migration `008_curriculum_tables.sql`).
- Hệ thống áp dụng nguyên tắc cách ly nguồn dữ liệu rõ ràng, **không tự động fallback âm thầm** giữa SQLite và PostgreSQL.

## Kiểm tra chất lượng

```bash
npm run ci
```

Lệnh này chạy format, strict typecheck, lint, coverage, test frontend/server và production build.

### Rà soát đề JLPT N3

Đang hoàn thiện nội dung và kiểm tra nguồn cho mục tiêu đủ 30 đề; chưa coi bộ đề là sẵn sàng phát hành. Các batch lời giải nghe đã rà gồm 07/12 của 2014–2018 (280 câu), 07/12/2019 (56 câu), 12/2020 (28 câu), 07/12 của 2021–2022 (112 câu), 07/12/2023 (56 câu) và 07/12/2024 (56 câu): tổng cộng 588 câu. Lời giải dịch câu hỏi/tình huống, nêu đáp án và giải thích phương án nhiễu dựa trên transcript.

Các báo cáo chi tiết nằm trong [`reports/n3-quality-audit`](reports/n3-quality-audit), gồm `listening-2019-transcript-review.json` đến `listening-2024-transcript-review.json`. Với các batch 2019–2022, dấu `正解` trong transcript khớp cả 196 khóa đang lưu; khóa không bị đổi. Năm 2023, 43/56 khóa trùng dấu `正解`; 13 câu cuối của đề tháng 12 không có dấu này và được rà theo hội thoại cùng lựa chọn. Năm 2024, 43/56 khóa trùng dấu `正解`; 13 câu cuối của đề tháng 12 cũng không có dấu này và được rà theo hội thoại cùng lựa chọn. Không khóa nào bị đổi. Hai bộ lựa chọn dạng hình năm 2024 được chép thành chữ sau khi đối chiếu ảnh trên Chrome; câu 77/2023 vẫn thiếu bảng ghép số với ngày. Cộng với 12 câu cũ, hiện có 13 câu cần bổ sung/đối chiếu hình hoặc bảng lựa chọn. Transcript và khóa chính thức vẫn chưa được đối chiếu độc lập với PDF gốc. Câu 77/2020 có một lỗi chữ trộn ký tự được sửa theo transcript.

Các con số trong `audit-run-summary.json` đo cấu trúc và tín hiệu biên tập tự động, không xác nhận tính đúng ngữ nghĩa. Lượt kiểm tra ngày 27/09/2026 đạt 243/243 test server chạy được (3 test DB/Render bị bỏ qua do thiếu `DATABASE_URL`), 133/133 test frontend, lint và build. Trên Chrome, câu ★ 14–18 của đề 07/2012 hiện hiển thị đúng thứ tự, vị trí sao, lời giải và bản dịch; tiến độ vẫn 0/39. Lượt rà cũng sửa lời giải đọc hiểu câu in 24 đề 07/2012 vốn nhầm sang bài sửa đồ chơi, cùng hướng dẫn câu 38–39 vốn mô tả nhầm loại quảng cáo; khóa các câu đọc hiểu không đổi. Chi tiết tại [`reports/n3-quality-audit`](reports/n3-quality-audit). Phần đọc hiểu và các đề còn lại vẫn cần rà soát trước khi hoàn tất mục tiêu 30 đề; hiện chưa đủ điều kiện phát hành hoặc xác minh Neon/Render.

## Chuẩn bị public

Xem [PUBLIC_LAUNCH.md](PUBLIC_LAUNCH.md) để cấu hình API, static hosting, security headers và checklist trước khi mở public.

### Deploy trên Render

Xem [deploy/RENDER.md](deploy/RENDER.md) để cập nhật service hiện có hoặc dùng Dockerfile/Blueprint.
API production tự áp migration trước khi đọc database, chạy worker xử lý video cùng tiến trình,
và sử dụng từ điển/Hán tự/ngữ pháp đóng gói trong repository. Video tải lên cần persistent disk;
phụ đề AI cần thêm nhà cung cấp nhận diện giọng nói.

## Scripts

- `npm run dev` — chạy local development.
- `npm run build` — tạo artifact production và smoke-check `dist`.
- `npm run preview` — mở artifact production ở local.
- `npm run ci` — quality gate đầy đủ.

## Model A baseline

Phần nghiên cứu phát âm tiếng Nhật được tách riêng khỏi web runtime tại
[`ml/model_a`](ml/model_a/README.md). A0–A1 chuẩn bị audio, Japanese G2P và
phoneme CTC baseline; chưa chấm phát âm hoặc train model riêng.
