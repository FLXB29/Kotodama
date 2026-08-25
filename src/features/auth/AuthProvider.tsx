import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react'
import { apiPaths, getApiErrorMessage, isUnauthorizedError, requestApi } from '../../lib/apiClient'
import { AuthContext, type AuthStatus, type AuthUser } from './authContext'

type Credentials = { email: string; password: string }
type Registration = Credentials & { name: string }

const TOKEN_KEY = 'kotodama.access-token'
const LOGOUT_BROADCAST_KEY = 'kotodama.auth:logout'
const hasRefreshCookieHint = () => document.cookie.split('; ').some((cookie) => cookie.startsWith('kotodama_csrf='))

function unwrap<T>(payload: unknown): T {
  if (payload && typeof payload === 'object' && 'data' in payload) return (payload as { data: T }).data
  return payload as T
}

function normalizeUser(payload: unknown): AuthUser {
  const source = unwrap<Record<string, unknown>>(payload)
  const role = source['role'] === 'admin' ? 'admin' : 'learner'
  const emailVerified = source['emailVerified'] === true || source['email_verified'] === true
  const accountStatus = source['status'] === 'suspended' ? 'suspended' : 'active'
  return {
    id: String(source['id'] ?? source['userId'] ?? ''),
    name: String(source['name'] ?? source['fullName'] ?? source['email'] ?? 'Thành viên Kotodama'),
    email: String(source['email'] ?? ''),
    role,
    emailVerified,
    accountStatus,
  }
}

function normalizeSession(payload: unknown) {
  const source = unwrap<Record<string, unknown>>(payload)
  const accessToken =
    typeof source['accessToken'] === 'string'
      ? source['accessToken']
      : typeof source['token'] === 'string'
        ? source['token']
        : undefined
  const userPayload = source['user'] ?? source['profile']
  return { accessToken, user: userPayload ? normalizeUser(userPayload) : null }
}

async function fetchCurrentUser(signal?: AbortSignal) {
  return normalizeUser(
    await requestApi<unknown>({
      method: 'GET',
      url: apiPaths.auth.me,
      dedupeKey: 'auth:me',
      skipSessionExpiry: true,
      ...(signal ? { signal } : {}),
    })
  )
}

async function refreshSession(signal?: AbortSignal) {
  const session = normalizeSession(
    await requestApi<unknown>({
      method: 'POST',
      url: apiPaths.auth.refresh,
      dedupeKey: 'auth:refresh',
      skipSessionExpiry: true,
      ...(signal ? { signal } : {}),
    })
  )
  if (!session.accessToken) throw new Error('Phiên đăng nhập không hợp lệ.')
  window.sessionStorage.setItem(TOKEN_KEY, session.accessToken)
  return session.user ?? fetchCurrentUser(signal)
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [status, setStatus] = useState<AuthStatus>('loading')
  const [user, setUser] = useState<AuthUser | null>(null)
  const [sessionExpired, setSessionExpired] = useState(false)

  const clearSession = useCallback((broadcast = false, expired = false) => {
    window.sessionStorage.removeItem(TOKEN_KEY)
    if (broadcast) window.localStorage.setItem(LOGOUT_BROADCAST_KEY, String(Date.now()))
    setUser(null)
    setStatus('anonymous')
    setSessionExpired(expired)
  }, [])

  useEffect(() => {
    let active = true
    const controller = new AbortController()
    const restore = async () => {
      try {
        const hasToken = Boolean(window.sessionStorage.getItem(TOKEN_KEY))
        if (!hasToken && !hasRefreshCookieHint()) {
          if (active) setStatus('anonymous')
          return
        }
        let restoredUser: AuthUser
        if (hasToken) {
          try {
            restoredUser = await fetchCurrentUser(controller.signal)
          } catch (error) {
            if (!isUnauthorizedError(error)) throw error
            restoredUser = await refreshSession(controller.signal)
          }
        } else {
          restoredUser = await refreshSession(controller.signal)
        }
        if (active) {
          setUser(restoredUser)
          setStatus('authenticated')
        }
      } catch {
        if (controller.signal.aborted) return
        if (active) clearSession(false)
      }
    }
    const handleUnauthorized = () => clearSession(false, true)
    const handleExternalLogout = (event: StorageEvent) => {
      if (event.key === LOGOUT_BROADCAST_KEY) clearSession(false)
    }
    void restore()
    window.addEventListener('kotodama:unauthorized', handleUnauthorized)
    window.addEventListener('storage', handleExternalLogout)
    return () => {
      active = false
      controller.abort()
      window.removeEventListener('kotodama:unauthorized', handleUnauthorized)
      window.removeEventListener('storage', handleExternalLogout)
    }
  }, [clearSession])

  const signIn = useCallback(async (values: Credentials) => {
    try {
      const session = normalizeSession(
        await requestApi<unknown>({ method: 'POST', url: apiPaths.auth.login, data: values })
      )
      if (!session.accessToken) throw new Error('Máy chủ không trả về phiên đăng nhập.')
      window.sessionStorage.setItem(TOKEN_KEY, session.accessToken)
      const authenticatedUser = session.user ?? (await fetchCurrentUser())
      setUser(authenticatedUser)
      setStatus('authenticated')
      setSessionExpired(false)
    } catch (error) {
      throw new Error(getApiErrorMessage(error, error instanceof Error ? error.message : 'Không thể đăng nhập.'))
    }
  }, [])

  const signUp = useCallback(
    async (values: Registration) => {
      try {
        const session = normalizeSession(
          await requestApi<unknown>({ method: 'POST', url: apiPaths.auth.register, data: values })
        )
        if (session.accessToken) {
          window.sessionStorage.setItem(TOKEN_KEY, session.accessToken)
          setUser(session.user ?? (await fetchCurrentUser()))
          setStatus('authenticated')
          setSessionExpired(false)
          return
        }
        await signIn({ email: values.email, password: values.password })
      } catch (error) {
        throw new Error(getApiErrorMessage(error, error instanceof Error ? error.message : 'Không thể tạo tài khoản.'))
      }
    },
    [signIn]
  )

  const signOut = useCallback(async () => {
    try {
      await requestApi<void>({ method: 'POST', url: apiPaths.auth.logout })
    } catch (error) {
      if (!isUnauthorizedError(error)) console.warn('Không thể thông báo đăng xuất cho máy chủ.', error)
    } finally {
      clearSession(true)
    }
  }, [clearSession])

  const acceptSession = useCallback((payload: unknown) => {
    const session = normalizeSession(payload)
    if (!session.accessToken) throw new Error('Máy chủ không trả về phiên đăng nhập.')
    window.sessionStorage.setItem(TOKEN_KEY, session.accessToken)
    if (session.user) setUser(session.user)
    setStatus('authenticated')
    setSessionExpired(false)
  }, [])

  const value = useMemo(
    () => ({ status, user, sessionExpired, signIn, signUp, acceptSession, signOut }),
    [status, user, sessionExpired, signIn, signUp, acceptSession, signOut]
  )
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
