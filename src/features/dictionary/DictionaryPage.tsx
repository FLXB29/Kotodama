import { useState } from 'react'
import { Button, EmptyState, Input } from '../../components/ui'
import { ArrowRight, Search } from 'lucide-react'

export default function DictionaryPage({
  inputRef,
  onReview,
}: {
  inputRef: React.RefObject<HTMLInputElement | null>
  onReview?: () => void
}) {
  const [input, setInput] = useState('')
  const [term, setTerm] = useState('')
  const submit = (event: React.FormEvent) => {
    event.preventDefault()
    setTerm(input.trim())
  }
  return (
    <section className="dictionary-page">
      <section className="dictionary-page__hero">
        <div className="dictionary-page__eyebrow">
          <Search aria-hidden="true" size={15} strokeWidth={2.25} />
          TỪ ĐIỂN TIẾNG NHẬT
        </div>
        <h1>Tra từ, lưu từ, rồi ôn lại</h1>
        <p>Kết quả tra từ, danh sách từ đã lưu và hàng đợi SRS sẽ hiển thị khi dịch vụ từ điển được kết nối.</p>
        <form className="dictionary-search" onSubmit={submit}>
          <span className="dictionary-search__icon">
            <Search aria-hidden="true" size={19} />
          </span>
          <Input
            ref={inputRef}
            className="dictionary-search__input"
            value={input}
            onChange={(event) => setInput(event.target.value)}
            placeholder="Ví dụ: 食べる, 勉強, cảm ơn"
            aria-label="Từ cần tra"
          />
          <Button type="submit" size="lg">
            Tra từ
          </Button>
        </form>
        <div className="dictionary-page__actions">
          <span>Hàng đợi SRS đang chờ dữ liệu</span>
          {onReview && (
            <Button variant="secondary" size="sm" onClick={onReview}>
              Ôn tập SRS <ArrowRight aria-hidden="true" size={15} />
            </Button>
          )}
        </div>
      </section>
      <section className="dictionary-page__results">
        {!term && (
          <EmptyState
            title="Từ điển đang chờ kết nối"
            description="Nhập một từ để chuẩn bị yêu cầu tra cứu; kết quả sẽ xuất hiện sau khi API từ điển sẵn sàng."
          />
        )}
        {term && (
          <EmptyState
            title={`Chưa thể tra “${term}”`}
            description="Kết quả chỉ được lấy từ API từ điển; hiện chưa có dữ liệu để hiển thị."
          />
        )}
      </section>
    </section>
  )
}
