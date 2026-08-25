import { afterEach, describe, expect, it, vi } from 'vitest'
import { getRecentDiagnostics, reportDiagnostic } from './observability'

describe('local diagnostics', () => {
  afterEach(() => vi.unstubAllGlobals())

  it('stores a bounded, redacted diagnostic and emits an integration event', () => {
    const storage = new Map<string, string>()
    const dispatchEvent = vi.fn()
    vi.stubGlobal('window', {
      sessionStorage: {
        getItem: (key: string) => storage.get(key) ?? null,
        setItem: (key: string, value: string) => storage.set(key, value),
      },
      dispatchEvent,
    })

    const id = reportDiagnostic('api', new Error('Request failed: token=private-token'), {
      endpoint: '/api/v1/courses',
    })
    const diagnostics = getRecentDiagnostics()

    expect(id).toBeTruthy()
    expect(diagnostics).toHaveLength(1)
    expect(diagnostics[0]).toMatchObject({
      id,
      source: 'api',
      message: 'Request failed: token=[redacted]',
      context: { endpoint: '/api/v1/courses' },
    })
    expect(dispatchEvent).toHaveBeenCalledTimes(1)
  })
})
