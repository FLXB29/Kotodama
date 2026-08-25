import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useMemo, useState } from 'react'
import { RetryState } from '../../components/AppStates'
import { Button, Card, Field, Input, PageShell, Select } from '../../components/ui'
import { apiPaths, getApiErrorMessage, requestApi } from '../../lib/apiClient'
import type { Page } from '../../types/app'
import { ArrowLeft, ShieldCheck } from 'lucide-react'
import { AuditLog, Confirmation, UserListSection } from './AccountAdminSections'
import type { AuditEntry, ManagedUser, PendingAction, UserList } from './accountAdminTypes'

export default function AccountAdminPage({ onNavigate }: { onNavigate: (page: Page) => void }) {
  const queryClient = useQueryClient()
  const [query, setQuery] = useState('')
  const [role, setRole] = useState('')
  const [status, setStatus] = useState('')
  const [page, setPage] = useState(1)
  const [pendingAction, setPendingAction] = useState<PendingAction | null>(null)
  const filters = useMemo(() => ({ query, role, status, page, pageSize: 10 }), [page, query, role, status])
  const users = useQuery({
    queryKey: ['admin-users', filters],
    queryFn: () =>
      requestApi<UserList>({
        method: 'GET',
        url: apiPaths.admin.users,
        params: filters,
        dedupeKey: `admin-users:${JSON.stringify(filters)}`,
      }),
  })
  const audit = useQuery({
    queryKey: ['admin-audit'],
    queryFn: () =>
      requestApi<{ items: AuditEntry[] }>({ method: 'GET', url: apiPaths.admin.audit, dedupeKey: 'admin-audit' }),
  })
  const mutation = useMutation({
    mutationFn: ({ user, type, value }: PendingAction) =>
      requestApi<ManagedUser>({
        method: 'POST',
        url: type === 'status' ? apiPaths.admin.userStatus(user.id) : apiPaths.admin.userRole(user.id),
        data: type === 'status' ? { status: value } : { role: value },
      }),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['admin-users'] })
      void queryClient.invalidateQueries({ queryKey: ['admin-audit'] })
      setPendingAction(null)
    },
  })
  const resetPage = (setter: (value: string) => void, value: string) => {
    setter(value)
    setPage(1)
  }

  return (
    <PageShell width="wide" className="account-admin-page">
      <header className="page-header">
        <div className="page-header__eyebrow">
          <ShieldCheck aria-hidden="true" size={15} strokeWidth={2.25} /> QUẢN TRỊ
        </div>
        <h1>Quản trị tài khoản</h1>
        <p>Quản lý người dùng, trạng thái tài khoản và lịch sử thao tác có kiểm soát.</p>
      </header>
      <Card padding="md" className="account-admin-filters">
        <Field label="Tìm người dùng">
          <Input
            value={query}
            placeholder="Tên hoặc email"
            onChange={(event) => resetPage(setQuery, event.target.value)}
          />
        </Field>
        <Field label="Vai trò">
          <Select value={role} onChange={(event) => resetPage(setRole, event.target.value)}>
            <option value="">Tất cả vai trò</option>
            <option value="learner">Learner</option>
            <option value="admin">Admin</option>
          </Select>
        </Field>
        <Field label="Trạng thái">
          <Select value={status} onChange={(event) => resetPage(setStatus, event.target.value)}>
            <option value="">Tất cả trạng thái</option>
            <option value="active">Đang hoạt động</option>
            <option value="suspended">Đã khóa</option>
          </Select>
        </Field>
      </Card>
      {users.isLoading && (
        <div className="account-admin-skeleton" role="status">
          Đang tải danh sách người dùng…
        </div>
      )}
      {users.isError && (
        <RetryState
          title="Không thể tải người dùng"
          description={getApiErrorMessage(users.error)}
          onRetry={() => void users.refetch()}
        />
      )}
      {users.data && (
        <UserListSection
          data={users.data}
          onAction={setPendingAction}
          onPreviousPage={() => setPage((current) => current - 1)}
          onNextPage={() => setPage((current) => current + 1)}
        />
      )}
      <AuditLog audit={audit} />
      <Button variant="ghost" onClick={() => onNavigate('courseAdmin')}>
        <ArrowLeft aria-hidden="true" size={16} /> Quản lý khóa học
      </Button>
      {pendingAction && (
        <Confirmation
          action={pendingAction}
          error={mutation.error}
          pending={mutation.isPending}
          onClose={() => setPendingAction(null)}
          onConfirm={() => mutation.mutate(pendingAction)}
        />
      )}
    </PageShell>
  )
}
