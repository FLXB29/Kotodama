export type ManagedUser = {
  id: string
  name: string
  email: string
  role: 'learner' | 'admin'
  emailVerified: boolean
  status: 'active' | 'suspended'
  createdAt: string
  lastActivityAt: string | null
}

export type UserList = { items: ManagedUser[]; page: number; pageSize: number; total: number; totalPages: number }
export type AuditEntry = {
  id: string
  action: string
  userId: string
  targetUserId?: string
  role?: string
  at: string
}
export type PendingAction = { user: ManagedUser; type: 'status' | 'role'; value: string }
