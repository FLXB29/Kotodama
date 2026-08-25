import { Button, EmptyState, PageShell } from '../../components/ui'
import { ArrowLeft } from 'lucide-react'

export function CourseLearningPage({ onBack }: { onBack: () => void }) {
  return (
    <PageShell width="reading" className="learning-page">
      <Button variant="ghost" size="sm" onClick={onBack}>
        <ArrowLeft aria-hidden="true" size={16} /> Tất cả lộ trình
      </Button>
      <EmptyState
        title="Bài học đang chờ dữ liệu"
        description="Nội dung, bài tập và tiến độ chỉ hiển thị khi được kết nối với API khóa học."
      />
    </PageShell>
  )
}
