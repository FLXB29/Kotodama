import { createContext, useContext } from 'react'

export type AuthUser = {
  id: string
  name: string
  email: string
  role: 'learner' | 'admin'
  emailVerified: boolean
  accountStatus: 'active' | 'suspended'
}
export type AuthStatus = 'loading' | 'anonymous' | 'authenticated'
type Credentials = { email: string; password: string }
type Registration = Credentials & { name: string }
export type AuthContextValue = {
  status: AuthStatus
  user: AuthUser | null
  sessionExpired: boolean
  signIn: (values: Credentials) => Promise<void>
  signUp: (values: Registration) => Promise<void>
  acceptSession: (payload: unknown) => void
  signOut: () => Promise<void>
}

export const AuthContext = createContext<AuthContextValue | null>(null)

export function useAuth() {
  const value = useContext(AuthContext)
  if (!value) throw new Error('useAuth phải được dùng bên trong AuthProvider.')
  return value
}
