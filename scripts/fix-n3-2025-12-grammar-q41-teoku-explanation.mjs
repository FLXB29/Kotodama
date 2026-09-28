import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const masterPath = path.join(root, 'data/jlpt_n3_toan_master.json')
const curatedPath = path.join(root, 'data/jlpt_n3_explanations_curated.json')
const sourcePath = path.join(root, 'data/mimi_kara_n3_grammar.json')
const reportPath = path.join(root, 'reports/n3-quality-audit/grammar-explanation-2025-12-q41-review.json')
const questionId = 'toan_q_2025_12_41'
const oldText = '3. 読んで置いたら: “nếu đọc rồi để lại”; 「置く」 là đặt/để, không có nghĩa đọc xong.'
const newText =
  '3. 読んで置いたら: nếu 「置く」 được dùng làm trợ động từ 「～ておく」 (thường viết 「読んでおく」), nghĩa là “đọc trước/đọc sẵn”; cách này đúng ngữ pháp nhưng không nói rõ mốc “đọc xong” như lời hứa ở đây. Nếu hiểu 「置く」 theo nghĩa “đặt xuống”, lựa chọn cũng không diễn đạt việc hoàn tất đọc.'
const note =
  'Mimi Kara N3 nhận diện 「～ておく／～でおく」 là cách diễn tả làm trước hoặc chuẩn bị sẵn. Lời giải nay phân biệt mẫu này với 「読み終わる」, đồng thời không gọi lựa chọn 3 sai ngữ pháp.'

const curated = JSON.parse(fs.readFileSync(curatedPath, 'utf8'))
const exams = JSON.parse(fs.readFileSync(masterPath, 'utf8'))
const grammar = JSON.parse(fs.readFileSync(sourcePath, 'utf8'))
const explanation = curated[questionId]
if (typeof explanation !== 'string') throw new Error(`Missing curated explanation: ${questionId}`)

if (!explanation.includes(newText)) {
  if (!explanation.includes(oldText)) throw new Error('Expected original explanation text not found')
  curated[questionId] = explanation.replace(oldText, newText)
}

const question = exams
  .flatMap((exam) => exam.parts || [])
  .flatMap((part) => part.questions || [])
  .find((item) => item.id === questionId)
if (!question) throw new Error(`Missing embedded master question: ${questionId}`)
if (!question.explanation?.includes(newText)) {
  if (!question.explanation?.includes(oldText)) throw new Error('Expected original embedded explanation text not found')
  question.explanation = question.explanation.replace(oldText, newText)
  fs.writeFileSync(masterPath, `${JSON.stringify(exams, null, 2)}\n`)
}
fs.writeFileSync(curatedPath, `${JSON.stringify(curated, null, 2)}\n`)

const entries = Array.isArray(grammar) ? grammar : Object.values(grammar)
const sourceEntry = entries
  .flatMap((entry) => [entry, ...(entry.items || []), ...(entry.patterns || [])])
  .find((entry) => JSON.stringify(entry).includes('縮約形（～ておく／～でおく）'))
if (!sourceEntry) throw new Error('Could not identify the local Mimi Kara entry for ～ておく')

fs.mkdirSync(path.dirname(reportPath), { recursive: true })
fs.writeFileSync(
  reportPath,
  `${JSON.stringify(
    {
      exam: 'JLPT N3 12/2025',
      questionId,
      option: 3,
      source: {
        file: 'data/mimi_kara_n3_grammar.json',
        pattern: '縮約形（～ておく／～でおく）',
        meaning: 'Dạng rút gọn ～ておく／～でおく; vẫn giữ nghĩa làm trước hoặc chuẩn bị sẵn.',
      },
      correction: {
        from: oldText,
        to: newText,
        note,
      },
      browserVerification: {
        browser: 'Chrome',
        route: 'http://127.0.0.1:5173/jlpt',
        mode: 'answer-study',
        result:
          'Question 41, answer 4, all four options, and the revised explanation were visible; no answer was selected.',
      },
      explanation: question.explanation,
    },
    null,
    2
  )}\n`
)

console.log(`Updated ${questionId}; local pattern source is recorded in ${path.relative(root, reportPath)}`)
