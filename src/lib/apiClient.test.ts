import { afterEach, describe, expect, it, vi } from 'vitest'
import {
  apiClient,
  apiPaths,
  getApiErrorMessage,
  isAuthEndpoint,
  isRequestCancelled,
  isUnauthorizedError,
  requestApi,
  shouldAttachAccessToken,
  toApiRequestError,
  unwrapApiData,
} from './apiClient'

function axiosLikeError(status?: number, data?: unknown, code?: string) {
  return Object.assign(new Error('request failed'), {
    isAxiosError: true,
    code,
    response: status ? { status, data } : undefined,
  })
}

describe('API error contract', () => {
  afterEach(() => {
    vi.restoreAllMocks()
    vi.unstubAllGlobals()
  })

  it('keeps a safe server message and metadata', () => {
    const error = toApiRequestError(axiosLikeError(403, { message: 'Chỉ quản trị viên được phép.', code: 'FORBIDDEN' }))
    expect(error.kind).toBe('forbidden')
    expect(error.status).toBe(403)
    expect(error.code).toBe('FORBIDDEN')
    expect(error.message).toBe('Chỉ quản trị viên được phép.')
  })

  it('maps timeout, validation and rate-limit errors consistently', () => {
    expect(toApiRequestError(axiosLikeError(undefined, undefined, 'ECONNABORTED')).kind).toBe('timeout')
    expect(toApiRequestError(axiosLikeError(422)).kind).toBe('validation')
    expect(toApiRequestError(axiosLikeError(429)).retryable).toBe(true)
  })

  it('maps auth, conflict, server and unknown failures to safe UI states', () => {
    expect(toApiRequestError(axiosLikeError(401)).kind).toBe('unauthenticated')
    expect(toApiRequestError(axiosLikeError(409)).kind).toBe('conflict')
    expect(toApiRequestError(axiosLikeError(503)).kind).toBe('server')
    expect(toApiRequestError(new Error('custom failure')).kind).toBe('unknown')
    expect(getApiErrorMessage(new Error('custom failure'), 'Thông báo dự phòng')).toBe('Thông báo dự phòng')
    expect(toApiRequestError(axiosLikeError()).kind).toBe('network')
    expect(toApiRequestError(axiosLikeError(400, { error: { message: 'Thiếu dữ liệu', code: 'MISSING' } })).code).toBe(
      'MISSING'
    )
  })

  it('recognizes cancellation and malformed payloads without exposing unsafe data', () => {
    expect(isRequestCancelled({ __CANCEL__: true })).toBe(true)
    expect(isUnauthorizedError(axiosLikeError(401))).toBe(true)
    expect(unwrapApiData('raw payload')).toBe('raw payload')
  })

  it('unwraps the documented API envelope', () => {
    expect(unwrapApiData({ data: { id: 'user-1' } })).toEqual({ id: 'user-1' })
    expect(getApiErrorMessage(axiosLikeError(404))).toBe('Không tìm thấy dữ liệu bạn yêu cầu.')
  })

  it('recognizes auth paths and attaches a bearer only to protected calls', () => {
    expect(isAuthEndpoint('/api/v1/auth/refresh')).toBe(true)
    expect(isAuthEndpoint('/api/v1/courses')).toBe(false)
    expect(shouldAttachAccessToken('/api/v1/auth/login')).toBe(false)
    expect(shouldAttachAccessToken('/api/v1/auth/password/change')).toBe(true)
    expect(shouldAttachAccessToken('/api/v1/auth/logout')).toBe(false)
    expect(apiPaths.admin.userStatus('user/a')).toBe('/api/v1/admin/users/user%2Fa/status')
    expect(apiPaths.admin.userRole('user/a')).toBe('/api/v1/admin/users/user%2Fa/role')
    expect(apiPaths.video.transcript('asset/a')).toBe('/api/v1/video/assets/asset%2Fa/transcript')
    expect(apiPaths.video.playbackSession('asset/a')).toBe('/api/v1/video/assets/asset%2Fa/playback-session')
    expect(apiPaths.video.retry('asset/a')).toBe('/api/v1/video/assets/asset%2Fa/retry')
    expect(apiPaths.video.youtubeImports).toBe('/api/v1/video/youtube-imports')
  })

  it('unwraps responses and deduplicates simultaneous requests with the same key', async () => {
    const request = vi.spyOn(apiClient, 'request').mockResolvedValue({ data: { data: { id: 'course-1' } } } as never)
    const first = requestApi<{ id: string }>({ method: 'GET', url: '/api/v1/courses', dedupeKey: 'course-list' })
    const second = requestApi<{ id: string }>({ method: 'GET', url: '/api/v1/courses', dedupeKey: 'course-list' })
    await expect(Promise.all([first, second])).resolves.toEqual([{ id: 'course-1' }, { id: 'course-1' }])
    expect(request).toHaveBeenCalledTimes(1)
  })

  it('normalizes failed requests before exposing them to feature screens', async () => {
    vi.spyOn(apiClient, 'request').mockRejectedValue(axiosLikeError(503))

    await expect(requestApi({ method: 'GET', url: '/api/v1/video/assets' })).rejects.toMatchObject({
      kind: 'server',
      retryable: true,
    })
  })

  it('attaches browser credentials and signals an expired protected session', async () => {
    const getItem = vi.fn(() => 'access-token')
    const dispatchEvent = vi.fn()
    vi.stubGlobal('window', { sessionStorage: { getItem }, dispatchEvent })
    vi.stubGlobal('document', { cookie: 'kotodama_csrf=csrf-token; other=value' })

    await apiClient.request({
      method: 'POST',
      url: '/api/v1/courses',
      adapter: async (config) => {
        expect(config.headers.get('Authorization')).toBe('Bearer access-token')
        expect(config.headers.get('X-CSRF-Token')).toBe('csrf-token')
        return { data: {}, status: 200, statusText: 'OK', headers: {}, config }
      },
    })

    await expect(
      apiClient.request({
        method: 'GET',
        url: '/api/v1/courses',
        adapter: async (config) => Promise.reject({ config, response: { status: 401 } }),
      })
    ).rejects.toMatchObject({ response: { status: 401 } })
    expect(dispatchEvent).toHaveBeenCalledWith(expect.objectContaining({ type: 'kotodama:unauthorized' }))
  })
})
