# Release checklist

- [x] Build và lint chạy sạch.
- [x] Unit test cho tìm kiếm từ, lịch SRS và activity log.
- [x] Onboarding lưu lộ trình và hiển thị lại ở Trang chủ.
- [x] Khóa học lưu bài đã hoàn thành và tiếp tục đúng bài sau reload.
- [x] Tra từ → lưu thẻ → ôn SRS → cập nhật lịch ôn.
- [x] Video URL → chuẩn bị phiên → mở phiên → lưu từ vào SRS.
- [x] Hồ sơ hiển thị tiến độ, activity và huy hiệu từ dữ liệu cục bộ.
- [x] Regression 15 route chính ở desktop và 390px mobile: không tràn ngang.
- [x] 401 giữ đường dẫn trở lại, 403 và 404 có trạng thái rõ ràng.
- [x] RBAC Guest/Learner/Admin chặn route và thao tác quản trị ở frontend.
- [x] API integration test: Admin list user, khóa Learner, audit log và bảo vệ Admin cuối cùng.
- [x] Password hash, access token, refresh cookie, CSRF, rate limit và CORS allowlist có kiểm thử.

## Lệnh chốt chất lượng

```bash
npm run test:all
```

## Giới hạn trước khi tích hợp backend

- Phân tích video, phụ đề và kết quả từ điển đang dùng dữ liệu mẫu cục bộ.
- Tài khoản, refresh session, audit, token email và rate limit đã dùng PostgreSQL. Trước production vẫn phải cấu hình SMTP thật, tập trung log/monitoring và kiểm thử domain HTTPS thực tế.
