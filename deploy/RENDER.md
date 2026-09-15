# Chạy Kotodama trên Render

## Kết quả kiểm tra web ngày 15/09/2026

Đã kiểm tra `https://kotodama-nsnm.onrender.com/` bằng HTTP và trình duyệt:

| Chức năng trên bản đang chạy trước sửa | Kết quả                                                                         |
| -------------------------------------- | ------------------------------------------------------------------------------- |
| Giao diện, PostgreSQL, `/health`       | Hoạt động                                                                       |
| Giáo trình từ vựng                     | 7 giáo trình, 9.702 mục từ; mở được Mimikara N3 và danh sách bài                |
| Tra từ `学校`                          | Không có kết quả vì đường dẫn từ điển trỏ tới ổ D:                              |
| Hán tự, ngữ pháp                       | API trả danh sách rỗng vì thiếu nguồn dữ liệu                                   |
| Anime                                  | Danh mục rỗng; repository không có bộ catalog/video production để tự triển khai |
| Video AI và SRS trong tài khoản thật   | Chưa kiểm tra được trực tiếp vì cần đăng nhập                                   |

Các thay đổi trong bản sửa:

- Dùng trực tiếp `data/master_dictionary.db` (192.776 mục) mà không cần database ngoài máy.
- Đóng gói 2.517 Hán tự và 548 mẫu ngữ pháp từ dữ liệu NhaiKanji local vào `data/nhaikanji`; file chi tiết được nén gzip. Manifest ghi số lượng và checksum của dữ liệu gốc.
- Mở kho từ vựng thực tế tại trang Khóa học, thay cho trang chờ dữ liệu cố định.
- Chạy migration trước các truy vấn khởi động; khóa migration/seed để tránh hai lần khởi động cùng ghi. Lỗi migration dừng khởi động thay vì báo web sẵn sàng.
- Worker video chạy cùng API ở production, dùng chung kho media. Local dev vẫn có thể chạy worker riêng.
- Cho xem video đã xác minh khi chưa có phụ đề; hiển thị đúng khả năng nhập YouTube và tạo phụ đề từ server.
- Sửa HTTP byte ranges, bao gồm yêu cầu đọc phần cuối tệp, và hỗ trợ tua audio JLPT được phục vụ từ `dist`.
- Bỏ SMTP giả trên Render. `/ready` báo `emailConfigured` đúng theo cấu hình; email không ngăn việc xem video/học từ.

## Cập nhật service hiện có

1. Đưa mã nguồn đã sửa và thư mục `data/nhaikanji` lên đúng repository/branch đang liên kết với service.
2. Trong Render, giữ nguyên `DATABASE_URL` và `AUTH_JWT_SECRET` đang dùng. Không đổi secret khi cập nhật thông thường.
3. Với runtime Node hiện tại, Build Command là `npm ci --include=dev && npm run build`, Start Command là `npm start`, Health Check Path là `/health`.
4. Đặt các biến sau:

   ```dotenv
   NODE_ENV=production
   CURRICULUM_STORAGE=postgres
   ANIME_STORAGE=postgres
   MEDIA_WORKER_ENABLED=true
   TRUST_PROXY=true
   VNJPDICT_DB_PATH=data/master_dictionary.db
   NHAIKANJI_DATA_PATH=data/nhaikanji
   YOUTUBE_IMPORT_ENABLED=false
   ```

5. Để frontend và API dùng cùng domain, để trống `VITE_API_BASE_URL`. Xóa override API cũ trỏ tới localhost. Với domain mặc định, có thể bỏ `APP_ORIGIN`/`CORS_ORIGINS` để server dùng `RENDER_EXTERNAL_URL`; nếu có custom domain thì đặt cả hai theo domain HTTPS đó.
6. Gắn persistent disk ở `/var/data`, đặt `MEDIA_STORAGE_PATH=/var/data/media`. Nếu đã có disk/media thì giữ đường dẫn hiện tại hoặc chuyển tệp có kiểm soát; đổi biến đường dẫn không tự di chuyển video cũ.
7. Deploy bản mới và chạy kiểm tra cuối tài liệu.

Filesystem mặc định trên Render mất dữ liệu khi restart/redeploy. Persistent disk yêu cầu service trả phí và chỉ một service truy cập được. Vì vậy API và worker trong cấu hình này chạy cùng service; không tạo worker Render riêng để đọc cùng disk. [Tài liệu Render về disk](https://render.com/docs/disks).

Nếu video trước đó đã mất khỏi filesystem tạm, cần tải lại tệp; metadata trong PostgreSQL không chứa nội dung video.

## Docker và phụ đề AI

`Dockerfile` cài sẵn FFmpeg; `render.yaml` cung cấp Blueprint cho một web service có disk.
Blueprint mẫu dùng compute `1c-2g` và disk 10 GB, có phát sinh phí. Đây là cấu hình để xem xét, chưa tự tạo hay nâng cấp tài nguyên.
Với service hiện tại, xem và giữ các thiết lập đang dùng trước khi áp Blueprint; tên mẫu `kotodama` không bảo đảm khớp tên service của bạn.

Để xử lý AI trên Render:

- Chạy bằng Dockerfile để có FFmpeg, hoặc bảo đảm `ffmpeg -version` hoạt động trong runtime Node.
- Chọn `TRANSCRIPTION_PROVIDER=openai` + `OPENAI_API_KEY`, hoặc `TRANSCRIPTION_PROVIDER=gemini` + `GEMINI_API_KEY`. Có thể đặt model tương ứng qua biến trong `.env.example`. Khóa/model phải được bật cho tài khoản nhà cung cấp.
- Nếu chọn `local_whisper`, `LOCAL_ASR_URL` phải trỏ tới dịch vụ ASR mà Render truy cập được. `127.0.0.1:8788` trên Render không phải máy tính cá nhân của bạn. Dockerfile này không chạy model Whisper/CUDA.
- Pipeline Gemini và Whisper khác nhau về độ chính xác timestamp; không coi timestamp ước lượng là căn chỉnh từ thực.
- Cấu hình `SMTP_HOST`, `SMTP_FROM` và thông tin SMTP thật để gửi xác minh email/khôi phục mật khẩu. Không dùng `smtp.example.com`.

Video MP4 với H.264/AAC là lựa chọn dễ phát trên trình duyệt. Việc nhận dạng container MOV/OGV không bảo đảm codec bên trong được mọi trình duyệt hỗ trợ.

Anime cần nhập catalog và nguồn phát/subtitle được cấu hình, được duyệt theo cơ chế hiện có. Bản sửa này không gán trạng thái duyệt cho dữ liệu chưa xác minh và không có sẵn video Anime production.

## Kiểm tra sau deploy

1. `/health` trả 200 với PostgreSQL connected.
2. `/api/v1/video/capabilities` phản ánh đúng cấu hình AI và YouTube.
3. Tra `学校`/`gakkou`, mở Hán tự/ngữ pháp, vào Khóa học → chọn giáo trình → chọn bài.
4. Đăng nhập, lưu từ vào SRS, đánh giá một thẻ, tải lại trang để kiểm tra dữ liệu lưu.
5. Tải MP4 nhỏ, đợi xác minh, bấm **Xem video** nếu chưa có AI hoặc **Bắt đầu học với video** khi đã có phụ đề. Thử tua tới giữa/cuối.
6. Restart service, xác nhận video và thẻ SRS vẫn còn.

## Kiểm thử tự động

```sh
npm run build
npm run test:frontend
npm run test:server
```

Kiểm tra toàn luồng Render bằng PostgreSQL local riêng (không dùng database production):

```sh
RENDER_TEST_DATABASE_URL=postgresql://user:password@127.0.0.1:5432/kotodama_test node --test server/render.integration.test.mjs
```

Test tạo schema riêng rồi xóa schema đó, kiểm tra migration trên schema trống, seed, dữ liệu đóng gói, đăng nhập, upload/worker, HTTP Range, lưu/ôn SRS và restart. Đặt `RENDER_TEST_VIDEO_PATH` tới MP4 thật để kiểm tra truyền đúng tệp; nếu bỏ trống, test dùng header MP4 tối giản để kiểm tra giao thức, không xác minh giải mã video.

Tham khảo cấu hình chính thức: [Blueprint](https://render.com/docs/blueprint-spec), [Docker](https://render.com/docs/docker), [Health checks](https://render.com/docs/health-checks).
