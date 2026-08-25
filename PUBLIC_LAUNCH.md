# Public launch guide

## 1. Chọn cấu hình API

- Khuyến nghị đặt frontend và API dưới cùng domain, ví dụ `app.example.com` và `app.example.com/api/v1`, giữ `VITE_API_BASE_URL` trống.
- Nếu API ở domain riêng, tạo `.env.production.local` từ `.env.example`, đặt `VITE_API_BASE_URL=https://api.example.com`, và cấu hình CORS/CSRF backend chỉ cho domain frontend chính thức.
- Không đưa secret, private key, mật khẩu hay token vào bất cứ biến `VITE_*` nào: Vite sẽ nhúng chúng vào JavaScript public.

## 2. Build và smoke test

```bash
npm ci
npm run ci
npm run preview
```

Kiểm tra các route trực tiếp: `/`, `/dang-nhap`, `/khoa-hoc`, `/video-ai`, `/tra-tu`, `/cai-dat`. Khi dùng static hosting, mọi route phải fallback về `index.html`.

## 3. Hosting và headers

- Cloudflare Pages/Netlify: file `public/_headers` được đưa vào artifact build.
- Nginx: dùng [nginx.conf](deploy/nginx.conf) và đổi `root`/`server_name` phù hợp.
- Bắt buộc HTTPS; chỉ thêm domain cần thiết vào CSP `connect-src`.

## 4. Trước khi mở public

- [ ] Đặt `DATABASE_URL`, `AUTH_JWT_SECRET`, `CORS_ORIGINS`, `APP_ORIGIN` và SMTP production; gửi thử email xác minh/đặt lại mật khẩu trên domain thật.
- [ ] CORS, CSRF, cookie `Secure` và `SameSite` được kiểm tra trên domain thật.
- [ ] Bật branch protection và kiểm tra CI theo [RELEASE_CHECKLIST.md](RELEASE_CHECKLIST.md).
- [ ] Kiểm tra accessibility trên desktop/mobile và smoke test các route public.
- [ ] Thiết lập nơi tiếp nhận event `kotodama:diagnostic` nếu cần monitoring ngoài trình duyệt.
