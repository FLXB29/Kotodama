# Backend security runbook

The API is implemented in `server/index.mjs` with Node.js, PostgreSQL and SMTP delivery. Run it locally with:

```bash
npm run api
```

For local frontend development, `.env` points `VITE_API_BASE_URL` to `http://127.0.0.1:8787`. Apply database migrations before starting the API:

```bash
npm run db:migrate
```

To make the local account-administration screen usable, start the API with a one-time bootstrap Admin. Never commit these credentials or use this mechanism as a production account-provisioning flow.

```powershell
$env:BOOTSTRAP_ADMIN_EMAIL = 'admin@example.test'
$env:BOOTSTRAP_ADMIN_PASSWORD = 'use-a-long-unique-password'
npm run api
```

## Included controls

- Passwords are salted and hashed with Node `scrypt`; comparisons use constant-time checks.
- Short-lived, HMAC-signed access tokens (15 minutes) and rotating refresh tokens (14 days).
- Refresh tokens use `HttpOnly`, `SameSite=Strict` cookies. The `Secure` attribute is always enabled in production.
- Double-submit CSRF protection for cookie-authenticated refresh, logout, and password changes.
- Explicit CORS allowlist; production fails to start without `CORS_ORIGINS` and `AUTH_JWT_SECRET`.
- Input size/JSON/email/password validation, generic reset responses and PostgreSQL-backed rate limits for sensitive endpoints.
- Server responses are safe `{ data }` or `{ message, code }` objects and never expose stacks.
- Admin user management requires server-side Admin role checks, CSRF, audit records, and protects the last active Admin from lock/demotion.
- Accounts, refresh sessions, one-time tokens, audit logs and rate-limit windows are persisted in PostgreSQL.
- Refresh sessions are rotated atomically; reuse of a revoked refresh token revokes its whole token family.
- Password reset, password change, suspension and role change invalidate existing access tokens and revoke active refresh sessions.
- Email verification and password-reset links are sent via SMTP when configured. Production refuses to start without SMTP configuration.

## Deliberate local-only limitations

Development may run without SMTP; one-time tokens are then stored but deliberately not exposed in API responses or logs. Configure SMTP before testing email flows or deploying. Rate-limit cleanup runs on startup and every six hours; production operations should additionally monitor structured logs and database health through `/ready`.
