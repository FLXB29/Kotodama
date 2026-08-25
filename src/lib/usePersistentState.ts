import { useEffect, useState } from 'react'

/**
 * Stores non-sensitive UI preferences in the current browser only.
 * Server-backed account data will replace this when authentication is added.
 */
export function usePersistentState<T>(key: string, initialValue: T) {
  const [value, setValue] = useState<T>(() => {
    try {
      const storedValue = window.localStorage.getItem(key)
      return storedValue === null ? initialValue : (JSON.parse(storedValue) as T)
    } catch {
      return initialValue
    }
  })

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(value))
    } catch {
      // Storage can be unavailable in private browsing or when quota is full.
    }
  }, [key, value])

  return [value, setValue] as const
}
