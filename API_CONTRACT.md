# Kotodama API contract

Feature screens use `requestApi` from `src/lib/apiClient.ts`, not Axios directly. Account preferences and the Japanese learning plan are persisted for signed-in users; browser storage is only a temporary offline fallback.

## Configuration

- `VITE_API_BASE_URL` is the preferred API origin (for example, `https://api.kotodama.app`). `VITE_API_URL` remains supported for compatibility; a legacy value ending in `/api/v1` is normalized automatically.
- Requests time out after 10 seconds, accept JSON, and include browser credentials for the future HttpOnly refresh cookie.
- A short-lived access token is held in session storage only until the backend's cookie refresh flow is completed.

## Response shape

New successful endpoints should return this envelope (raw data remains supported for a gradual migration):

```json
{ "data": {}, "meta": { "requestId": "optional", "page": 1 } }
```

Error responses must use a safe message and a stable machine-readable code:

```json
{ "message": "Bạn không có quyền thực hiện thao tác này.", "code": "FORBIDDEN" }
```

## Auth endpoints expected by the frontend

| Method | Path                           | Purpose                                |
| ------ | ------------------------------ | -------------------------------------- |
| POST   | `/api/v1/auth/register`        | Register `{ name, email, password }`   |
| POST   | `/api/v1/auth/login`           | Sign in `{ email, password }`          |
| POST   | `/api/v1/auth/logout`          | Clear server session                   |
| POST   | `/api/v1/auth/refresh`         | Issue a new short-lived access token   |
| GET    | `/api/v1/auth/me`              | Return the current user                |
| POST   | `/api/v1/auth/password/forgot` | Send a password-reset email            |
| POST   | `/api/v1/auth/password/reset`  | Reset using `{ token, password }`      |
| POST   | `/api/v1/auth/password/change` | Change password for the signed-in user |
| POST   | `/api/v1/auth/email/verify`    | Verify using `{ token }`               |
| POST   | `/api/v1/auth/email/resend`    | Send another verification email        |

Login/register/refresh may return `{ data: { accessToken, user } }`; `user` has `id`, `name`, `email`, and `role` (`learner` or `admin`).

## Account, profile and onboarding endpoints

All endpoints require an active access token. `POST` endpoints also require the CSRF cookie/header pair.

| Method | Path                            | Purpose                                                                                           |
| ------ | ------------------------------- | ------------------------------------------------------------------------------------------------- |
| GET    | `/api/v1/account/profile`       | Return the signed-in user, preferences and current learning plan.                                 |
| POST   | `/api/v1/account/profile`       | Update the display name with `{ name }`.                                                          |
| GET    | `/api/v1/account/preferences`   | Return persisted learning, UI, privacy and notification preferences.                              |
| POST   | `/api/v1/account/preferences`   | Update one or more allowed preference fields.                                                     |
| GET    | `/api/v1/account/learning-plan` | Return the current plan or `null` when onboarding is unfinished.                                  |
| POST   | `/api/v1/account/learning-plan` | Create/update the Japanese plan with `language`, `level`, `dailyWords`, `dailyMinutes`, `reason`. |

The server validates every selectable value. Only `jp` is accepted during the current product phase; plans for future languages cannot be forged from the browser.

## Admin endpoints

All endpoints below require an active Admin access token; state-changing requests additionally require the CSRF cookie/header pair.

| Method | Path                             | Purpose                                                                         |
| ------ | -------------------------------- | ------------------------------------------------------------------------------- |
| GET    | `/api/v1/admin/users`            | Search/filter/paginate users with `query`, `role`, `status`, `page`, `pageSize` |
| POST   | `/api/v1/admin/users/:id/status` | Set `{ status: "active"                                                         | "suspended" }` |
| POST   | `/api/v1/admin/users/:id/role`   | Set `{ role: "learner"                                                          | "admin" }`     |
| GET    | `/api/v1/admin/audit`            | Read recent sanitized admin audit events                                        |

The service blocks self-locking, self-demotion, and any action that would remove the last active Admin.

## Video AI foundation endpoints

These endpoints persist owned video metadata and accept an authenticated raw-file upload. When the media worker is configured with OpenAI Audio and FFmpeg, verified uploads are transcribed into timestamped Japanese speaker segments. Every endpoint requires an active user access token; state-changing requests also require the CSRF cookie/header pair.

| Method | Path                                      | Purpose                                                                      |
| ------ | ----------------------------------------- | ---------------------------------------------------------------------------- |
| GET    | `/api/v1/video/assets`                    | List the caller's non-deleted video assets. Accepts optional `limit` (1–50). |
| POST   | `/api/v1/video/assets`                    | Create an owned metadata draft for an upload or catalogue item.              |
| POST   | `/api/v1/video/youtube-imports`           | Local-only YouTube import, queued for `yt-dlp` download and transcription.   |
| GET    | `/api/v1/video/assets/:id`                | Get one asset only when it belongs to the caller.                            |
| POST   | `/api/v1/video/assets/:id/upload-session` | Validate that a user-upload draft may receive a file.                        |
| PUT    | `/api/v1/video/assets/:id/upload`         | Stream one supported video into configured media storage.                    |
| GET    | `/api/v1/video/assets/:id/transcript`     | Return the current ready transcript and its ordered speaker segments.        |
| GET    | `/api/v1/video/assets/:id/jobs`           | List processing jobs for the caller's asset.                                 |

`POST /api/v1/video/assets` accepts:

```json
{
  "sourceType": "user_upload",
  "title": "Hội thoại tại nhà hàng",
  "language": "ja",
  "rightsBasis": "owned",
  "sourceReference": "optional internal catalogue reference",
  "originalFilename": "restaurant-dialogue.mp4"
}
```

- `sourceType` is `user_upload`, `catalog`, or local-only `youtube`.
- `rightsBasis` is `owned`, `licensed`, `internal`, or `unknown`.
- A `catalog` item must carry a source reference. Recording provenance is mandatory before processing content.
- New assets begin at `processingStatus: "draft"`. A successful upload becomes `queued` and creates an `upload_verify` job. When `OPENAI_API_KEY` is configured, a verified upload queues a `transcribe` job. The worker extracts compact audio chunks with FFmpeg and calls `gpt-4o-transcribe-diarize` with `diarized_json`; it stores only real provider segments and speaker labels.
- Run `npm run media:worker` beside the API. Configure `FFMPEG_PATH`, `OPENAI_API_KEY`, and optionally `OPENAI_TRANSCRIPTION_MODEL`, `TRANSCRIPTION_CHUNK_SECONDS`, and `TRANSCRIPTION_TIMEOUT_MS`. Without an API key, the upload is still verified but transcription is deliberately not fabricated.
- The API validates the file signature after it is streamed; browser-provided MIME headers are not trusted. The configured maximum is `MEDIA_MAX_UPLOAD_BYTES` (2 GiB by default).

## Status behavior

| Status    | Frontend behavior                         |
| --------- | ----------------------------------------- |
| 400 / 422 | Show form validation feedback             |
| 401       | Restore or end the session in phase 2     |
| 403       | Keep the user on a permission-safe screen |
| 404       | Show a not-found state                    |
| 409       | Ask the user to refresh and retry         |
| 429 / 5xx | Error is marked retryable                 |

## Rules for later backend integration

- The backend, never the frontend alone, enforces authorization on every endpoint.
- Roles are `guest`, `learner`, and `admin`. Only `admin` may create or manage course content; a learner may manage only their own account UI.
- Use HttpOnly, Secure, SameSite refresh cookies in production; allow only approved CORS origins.
- Do not put passwords, refresh tokens, role-management permissions, or internal errors in browser storage or API responses.
