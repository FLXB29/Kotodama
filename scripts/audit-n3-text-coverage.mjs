import fs from 'node:fs'
import path from 'node:path'

const exams = JSON.parse(fs.readFileSync(path.resolve('data/jlpt_n3_toan_master.json'), 'utf8'))
const hasImage = (value) => /<img\b/i.test(String(value || ''))
const hasText = (value) =>
  Boolean(
    String(value || '')
      .replace(/<[^>]*>/g, '')
      .trim()
  )

const rows = exams.map((exam) => {
  const row = {
    exam: `${exam.year}/${String(exam.session).padStart(2, '0')}`,
    star: 0,
    starSourceText: 0,
    starInteractive: 0,
    starVerifiedOrder: 0,
    starSourceConflicts: 0,
    starSecondaryKeyDiscrepancies: 0,
    starImage: 0,
    cloze: 0,
    clozeText: 0,
    clozeImage: 0,
    readingQuestions: 0,
    reading: 0,
    readingPassageText: 0,
    readingImage: 0,
  }
  for (const part of exam.parts || []) {
    const title = part.title || ''
    if (title.includes('Ngữ pháp') && title.includes('Mondai 3')) {
      row.cloze++
      if (part.sourceTextExtracted && hasText(part.passage) && !hasImage(part.passage)) row.clozeText++
      if (hasImage(part.passage) || part.questions?.some((question) => hasImage(question.passage))) row.clozeImage++
      continue
    }
    for (const question of part.questions || []) {
      const image =
        hasImage(part.passage) || hasImage(question.passage) || hasImage(question.question) || Boolean(question.image)
      if (title.includes('Ngữ pháp') && title.includes('Mondai 2')) {
        row.star++
        const disclosedConflict = ['conflict', 'source-conflict-disclosed-editorial-reconstruction'].includes(
          question.starVerificationStatus
        )
        if (disclosedConflict) row.starSourceConflicts++
        if (/secondary-key discrepancy/i.test(question.starVerificationNote || '')) row.starSecondaryKeyDiscrepancies++
        if (question.starPrompt && question.options?.length === 4) row.starSourceText++
        const answer = Number(question.correctAnswer ?? question.answer)
        const hasInteractiveOrder =
          question.starCorrectOrder?.length === 4 &&
          Number.isInteger(question.starPosition) &&
          question.starPosition >= 0 &&
          question.starPosition < 4 &&
          question.starCorrectOrder[question.starPosition] === answer
        if (hasInteractiveOrder) {
          row.starInteractive++
          if (
            !disclosedConflict &&
            question.starOrderVerified &&
            question.starPositionVerified &&
            question.starVerificationSources?.length
          ) {
            row.starVerifiedOrder++
          }
        }
        if (image) row.starImage++
      } else if (title.includes('Đọc hiểu')) {
        row.readingQuestions++
        if (image) row.readingImage++
        if (question.readingSourcePassage) {
          row.reading++
          const passage = question.passage || part.passage
          if ((question.sourceTextExtracted || part.sourceTextExtracted) && hasText(passage) && !hasImage(passage))
            row.readingPassageText++
        }
      }
    }
  }
  return row
})

const sum = (key) => rows.reduce((total, row) => total + row[key], 0)
const markdown = [
  '# Mức chuyển đề N3 từ PDF sang text — 27/09/2026',
  '',
  'Nguồn đếm: `data/jlpt_n3_toan_master.json`. Đây là kiểm tra cấu trúc và mức trích xuất; nó không tự chứng nhận độ đúng ngôn ngữ hoặc đáp án.',
  '',
  `- Đề: **${rows.length}**. Câu dấu ★: **${sum('starSourceText')}/${sum('star')}** có prompt và bốn mảnh text; **${sum('starInteractive')}/${sum('star')}** có cấu hình ghép khớp với khóa hiện lưu; **${sum('starVerifiedOrder')}/${sum('star')}** đã đối chiếu thứ tự và ô ★ với nguồn; **${sum('starSourceConflicts')}** đang có xung đột với PDF nên không tính là đã xác minh; **${sum('starSecondaryKeyDiscrepancies')}** có bảng đáp án phụ bất đồng với cách đọc từ PDF và lời giải thích được ghi rõ.`,
  `- Câu điền bài văn: **${sum('clozeText')}/${sum('cloze')}** có bài chung dạng text.`,
  `- Đọc hiểu: **${sum('readingPassageText')}/${sum('reading')}** điểm gắn passage có text; **${sum('readingImage')}/${sum('readingQuestions')}** câu có ảnh đính kèm. Một passage có thể dùng chung cho nhiều câu; số liệu cấu trúc không đánh giá độ đúng của OCR.`,
  '',
  '| Đề | ★ nguồn text | ★ cấu hình khớp khóa | ★ đã đối chiếu nguồn | ★ xung đột PDF | ★ lệch bảng phụ | Câu điền text | Passage text | ★ cần rà nguồn | Đọc còn ảnh |',
  '| :-- | --: | --: | --: | --: | --: | --: | --: | --: | --: |',
  ...rows.map(
    (row) =>
      `| ${row.exam} | ${row.starSourceText}/${row.star} | ${row.starInteractive}/${row.star} | ${row.starVerifiedOrder}/${row.star} | ${row.starSourceConflicts} | ${row.starSecondaryKeyDiscrepancies} | ${row.clozeText}/${row.cloze} | ${row.readingPassageText} | ${row.star - row.starVerifiedOrder} | ${row.readingImage} |`
  ),
  '',
  `Toàn bộ 30 đề gốc đã ghép từ lớp chữ trong PDF. Cả ${sum('starInteractive')} câu ★ đều có cấu hình để bấm ghép và khớp với khóa đang lưu; ${sum('starVerifiedOrder')} câu đã được đối chiếu trực tiếp với nguồn PDF. ${sum('starSourceConflicts')} câu đang mâu thuẫn với nội dung PDF và bị loại khỏi số đã xác minh; ${sum('starSecondaryKeyDiscrepancies')} câu có bảng đáp án phụ ghi khác với vị trí dấu ★, được chốt theo PDF gốc và câu hoàn chỉnh, đồng thời ghi lại bất đồng. Các câu còn lại cần soát thứ tự và vị trí ô ★ trực tiếp với nguồn. Ba nội dung đọc từng nằm trong ảnh đã được chuyển từ lớp chữ PDF sang text (納豆, quảng cáo guitar, bảng mua hàng); không cần OCR cho các nguồn có lớp chữ.`,
  '',
  `Chưa đủ điều kiện push/Render: ${sum('starSourceConflicts')} câu ★ còn xung đột giữa PDF và khóa tham khảo; ${sum('starSecondaryKeyDiscrepancies')} câu có bất đồng ở bảng đáp án phụ cần tiếp tục công khai. PDF 12/2023 trực quan in câu 納豆 là 27, trùng số với câu đầu Mondai 5; câu này là mục thứ tư của Mondai 4, và bảng đáp án tham khảo đánh số Mondai 4 là 23–26 với đáp án cuối là 1. Ứng dụng giữ nhãn [26] và đáp án 1; xem biên bản để biết đây là suy luận từ cấu trúc và khóa tham khảo, chưa có xác nhận từ khóa JLPT chính thức. Nghĩa từ và mẫu ngữ pháp chỉ được thêm khi khớp dữ liệu cục bộ, chưa chứng nhận toàn bộ nội dung; chưa thử đồng bộ Neon/Render.`,
  '',
].join('\n')

const output = path.resolve('reports/n3-quality-audit/text-coverage.md')
fs.mkdirSync(path.dirname(output), { recursive: true })
fs.writeFileSync(output, markdown, 'utf8')
console.log(`Wrote ${output}`)
