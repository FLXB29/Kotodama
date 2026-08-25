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

## Kiểm tra chất lượng

```bash
npm run ci
```

Lệnh này chạy format, strict typecheck, lint, coverage, test frontend/server và production build.

## Chuẩn bị public

Xem [PUBLIC_LAUNCH.md](PUBLIC_LAUNCH.md) để cấu hình API, static hosting, security headers và checklist trước khi mở public.

## Scripts

- `npm run dev` — chạy local development.
- `npm run build` — tạo artifact production và smoke-check `dist`.
- `npm run preview` — mở artifact production ở local.
- `npm run ci` — quality gate đầy đủ.
