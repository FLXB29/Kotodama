import PageHeader from '../../components/PageHeader'
import { Button, EmptyState, PageShell } from '../../components/ui'
import { ArrowLeft, ArrowRight, ShieldCheck } from 'lucide-react'

export function CourseAdminPage({ onBack, onAccountAdmin }: { onBack: () => void; onAccountAdmin?: () => void }) {
  return (
    <PageShell>
      <div className="course-admin__navigation">
        <Button variant="secondary" className="course-admin__back" onClick={onBack}>
          <ArrowLeft aria-hidden="true" size={16} /> Quay lại khóa học
        </Button>
        {onAccountAdmin && (
          <Button variant="ghost" onClick={onAccountAdmin}>
            Quản trị tài khoản <ArrowRight aria-hidden="true" size={16} />
          </Button>
        )}
      </div>
      <PageHeader
        eyebrow="QUẢN TRỊ"
        title="Tạo khóa học"
        description="Nội dung khóa học sẽ được quản lý khi API dữ liệu sẵn sàng."
        icon={ShieldCheck}
      />
      <EmptyState
        title="Quản lý khóa học đang chờ dữ liệu"
        description="Không lưu khóa học tạm trên trình duyệt. Danh sách và biểu mẫu sẽ hoạt động sau khi kết nối API."
      />
    </PageShell>
  )
}
