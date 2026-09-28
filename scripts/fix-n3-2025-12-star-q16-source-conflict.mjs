import fs from 'node:fs'
import path from 'node:path'

const masterPath = path.resolve('data/jlpt_n3_toan_master.json')
const curatedPath = path.resolve('data/jlpt_n3_explanations_curated.json')
const exams = JSON.parse(fs.readFileSync(masterPath, 'utf8'))
const curated = JSON.parse(fs.readFileSync(curatedPath, 'utf8'))
const exam = exams.find((item) => item.id === 'toan-n3-202512-full')
if (!exam) throw new Error('Could not find N3 December 2025 full exam.')
const question = exam.parts.flatMap((part) => part.questions || []).find((item) => item.id === 'toan_q_2025_12_51')
if (!question) throw new Error('Could not find December 2025 star question 16.')
if (
  Number(question.correctAnswer) !== 4 ||
  question.options
    ?.map((option) =>
      String(option)
        .replace(/^\s*[1-4][.．、\s　]*/u, '')
        .trim()
    )
    .join('|') !== '上手に|弾くほど|なっていくのが|弾けるように' ||
  JSON.stringify(question.starCorrectOrder) !== JSON.stringify([2, 1, 4, 3])
) {
  throw new Error('Unexpected December 2025 star question; refusing to change its explanation.')
}

const note =
  'Lưu ý nguồn: PDF đề gốc trang 9 in lựa chọn 2 là 「弾くけど」, trong khi bảng đáp án tham khảo dùng 「弾くほど」 để tạo mẫu 「弾けば弾くほど」. Bản học giữ 「弾くほど」 theo câu ghép tự nhiên và khóa tham khảo; đây là mâu thuẫn nguồn chưa có khóa JLPT chính thức để xác nhận.'
const existing = String(curated[question.id] || '')
if (!existing.includes('Lưu ý nguồn: PDF đề gốc trang 9')) {
  if (!existing.includes('弾けば弾くほど'))
    throw new Error('Unexpected existing explanation; refusing to append a source warning.')
  curated[question.id] = `${existing}\n\n${note}`
}

fs.writeFileSync(curatedPath, `${JSON.stringify(curated, null, 2)}\n`, 'utf8')
console.log('Added an idempotent learner-facing note for the December 2025 star question 16 source conflict.')
