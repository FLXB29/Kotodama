import { Button, EmptyState, PageShell } from '../../components/ui'
import PageHeader from '../../components/PageHeader'
import { BookOpen } from 'lucide-react'

export function CoursesPage({ canManageCourses, onManage }: { canManageCourses: boolean; onManage: () => void }) {
  return (
    <PageShell width="wide" className="courses-page-v2">
      <PageHeader
        eyebrow="KHÓA HỌC"
        title="Khám phá khóa học phù hợp với bạn"
        description="Các khóa học sẽ xuất hiện khi nội dung được kết nối với hệ thống."
        icon={BookOpen}
      />
      <section className="courses-empty">
        <EmptyState
          title="Chưa có khóa học"
          description="Nội dung khóa học sẽ được bổ sung khi dữ liệu thật sẵn sàng."
          action={
            canManageCourses ? (
              <Button variant="secondary" onClick={onManage}>
                Quản lý khóa học
              </Button>
            ) : undefined
          }
        />
      </section>
    </PageShell>
  )
}
