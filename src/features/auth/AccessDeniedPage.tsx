import { Button, EmptyState, PageShell } from '../../components/ui'
import type { Page } from '../../types/app'

export default function AccessDeniedPage({ onNavigate }: { onNavigate: (page: Page) => void }) {
  return (
    <PageShell width="reading" className="access-denied-page">
      <EmptyState
        title="Bạn không có quyền truy cập"
        description="Tài khoản hiện tại không được phép mở khu vực này. Nếu bạn cho rằng đây là nhầm lẫn, hãy liên hệ quản trị viên."
        action={<Button onClick={() => onNavigate('home')}>Về trang chủ</Button>}
      />
    </PageShell>
  )
}
