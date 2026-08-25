import { Button, EmptyState, PageShell } from '../../components/ui'

export default function ReviewPage({ onDictionary }: { onDictionary: () => void }) {
  return (
    <PageShell width="reading" className="review-page">
      <header className="review-page__header">
        <span>ÔN TẬP SRS</span>
        <h1>Ôn đúng lúc để nhớ lâu</h1>
        <p>Hàng đợi ôn tập sẽ xuất hiện khi dữ liệu SRS được kết nối.</p>
      </header>
      <EmptyState
        title="Hàng đợi ôn tập đang chờ dữ liệu"
        description="Không tạo thẻ hoặc lịch ôn giả trên trình duyệt. Từ cần ôn sẽ đến từ API SRS."
        action={<Button onClick={onDictionary}>Mở từ điển tiếng Nhật</Button>}
      />
    </PageShell>
  )
}
