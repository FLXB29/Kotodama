import { cleanup } from '@testing-library/react'
import { afterEach, vi } from 'vitest'

afterEach(() => {
  cleanup()
  if (typeof window === 'undefined') return
  window.localStorage?.clear?.()
  window.sessionStorage?.clear?.()
})

if (typeof window !== 'undefined') Object.defineProperty(window, 'scrollTo', { value: vi.fn(), writable: true })
