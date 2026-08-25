# Session security boundary

The frontend implements the safe browser-side part of the session lifecycle:

- Access tokens are stored only in `sessionStorage`, never persistent local storage.
- A token is not attached to auth endpoints, including login, password reset, and refresh.
- Startup restores the signed-in user once through `/auth/me`, then performs one deduplicated refresh attempt after a 401 or for a cookie-only session.
- Restore requests can be cancelled when the app unmounts. A 401 in that internal flow does not log the user out before refresh can finish.
- Explicit logout broadcasts only a timestamp (never a token) through `localStorage`, so other tabs clear their session state.

## Backend requirements before production

1. Access tokens should be short-lived (recommended: 5–15 minutes).
2. Refresh tokens must be `HttpOnly`, `Secure`, `SameSite` cookies with rotation and revocation.
3. Refresh requests need CSRF protection if cookies are cross-site.
4. Every protected endpoint must validate token and authorization server-side.
5. Do not return refresh tokens or internal errors to the browser.
