import { Button, PageShell } from '../../components/ui'
import PageHeader from '../../components/PageHeader'
import { BookOpen } from 'lucide-react'
import VocabularyPage from '../vocabulary/VocabularyPage'

export function CoursesPage({
  canManageCourses,
  onManage,
  onReview,
}: {
  canManageCourses: boolean
  onManage: () => void
  onReview?: () => void
}) {
  return (
    <PageShell width="wide" className="courses-page-v2">
      <PageHeader
        eyebrow="KHÓA HỌC"
        title="Khám phá khóa học phù hợp với bạn"
        description="Chọn giáo trình, mở bài học và lưu từ vựng vào bộ ôn tập của bạn."
        icon={BookOpen}
      />
      {canManageCourses ? (
        <Button variant="secondary" onClick={onManage}>
          Quản lý khóa học
        </Button>
      ) : null}
      <VocabularyPage {...(onReview ? { onGoToSrs: onReview } : {})} />
    </PageShell>
  )
}
