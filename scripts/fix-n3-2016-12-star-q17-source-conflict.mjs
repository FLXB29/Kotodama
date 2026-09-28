import fs from 'node:fs'
import path from 'node:path'

const mockPath = path.resolve('data/jlpt_n3_toan_master.json')
const fullPath = path.resolve('data/jlpt_full_master.json')
const curatedPath = path.resolve('data/jlpt_n3_explanations_curated.json')
const reportPath = path.resolve('reports/n3-quality-audit/star-source-2016-12-q17-review.json')
const mockExams = JSON.parse(fs.readFileSync(mockPath, 'utf8'))
const fullExams = JSON.parse(fs.readFileSync(fullPath, 'utf8'))
const curated = JSON.parse(fs.readFileSync(curatedPath, 'utf8'))
const mockExam = mockExams.find((item) => item.id === 'toan-n3-201612-full')
const sectionExam = fullExams.find((item) => item.id === 'cm2u2wlnt0097134ira8pl9rk-grammar-reading')
if (!mockExam || !sectionExam) throw new Error('Could not find both December 2016 N3 exam records.')

const mockQuestion = mockExam.parts
  .flatMap((part) => part.questions || [])
  .find((item) => item.id === 'toan_q_2016_12_52')
const sectionQuestion = sectionExam.parts
  .flatMap((part) => part.questions || [])
  .find((item) => item.id === 'cm2u2wn7d00au134irqsgbkcg')
if (!mockQuestion || !sectionQuestion) throw new Error('Could not find December 2016 star question 17 in both records.')

const normalizeOptions = (options) =>
  options?.map((option) =>
    String(typeof option === 'object' && option ? option.text : option)
      .replace(/^\s*[1-4][.．、\s　]*/u, '')
      .trim()
  )
const expectedOptions = ['待っているんです', '言われた', 'から', 'けど']
if (
  Number(mockQuestion.correctAnswer) !== 1 ||
  JSON.stringify(normalizeOptions(mockQuestion.options)) !== JSON.stringify(expectedOptions) ||
  JSON.stringify(mockQuestion.starCorrectOrder) !== JSON.stringify([2, 3, 1, 4]) ||
  !String(mockQuestion.starPrompt?.before || '').includes('待てって') ||
  !String(sectionQuestion.question || '').includes('待てって')
) {
  throw new Error('Unexpected December 2016 star question; refusing to change it.')
}

const sourceEnding = '待てって'
const normalizePromptEnding = (prompt) => {
  if (prompt.endsWith(sourceEnding)) return prompt
  if (prompt.endsWith('待ってて')) return `${prompt.slice(0, -'待ってて'.length)}${sourceEnding}`
  throw new Error('Unexpected prompt ending; refusing to overwrite source text.')
}
mockQuestion.starPrompt.before = normalizePromptEnding(mockQuestion.starPrompt.before)
for (const field of ['question', 'sentence']) {
  const current = String(sectionQuestion[field] || '')
  if (current.includes('待てって')) continue
  if (!current.includes('待ってて'))
    throw new Error(`Unexpected sectional ${field}; refusing to overwrite source text.`)
  sectionQuestion[field] = current.replace('待ってて', '待てって')
}

const explanation = `Đáp án 1: thứ tự ghép là 2 → 3 → 1 → 4, nên ô ★ nhận 「待っているんです」.
Câu hoàn chỉnh: 「しばらくここで待てって言われたから待っているんですけど、まだですか。」
Dịch: “Họ bảo tôi chờ ở đây một lúc nên tôi vẫn đang đợi, nhưng vẫn chưa đến lượt phải không ạ?”
2. 言われた = đã được bảo/được yêu cầu; nối với lời dặn thân mật 「待てって」.
3. から = vì/do; nêu lý do người khách vẫn đang đợi.
1. 待っているんです = đang chờ; là phần ở ô ★ và mô tả tình trạng hiện tại.
4. けど = nhưng; làm câu than phiền mềm hơn trước 「まだですか」.
Ghi nhớ: 「Vてと言われた」 trích lời yêu cầu; trong câu này, 「待てって言われた」 dùng 「って」 làm dấu trích dẫn khẩu ngữ.

Lưu ý nguồn: PDF trên Google Drive trang 5 in phần cuối 「待てって」 và phương án 2 「と言われた」. Một bản PDF công khai khác của đề 12/2016 (trang 7, câu in 17) ghi phương án 2 là 「言われた」, khớp với cách ghép trong phần học. Vì hai bản đề khác nhau, ứng dụng theo bản thứ hai và ghi rõ sai khác với bản Google Drive; khóa JLPT chính thức chưa được xác nhận.`

mockQuestion.explanation = explanation
sectionQuestion.explanation = explanation
curated[mockQuestion.id] = explanation
curated[sectionQuestion.id] = explanation

const report = JSON.parse(fs.readFileSync(reportPath, 'utf8'))
report.sourcePdf.promptEnding = sourceEnding
report.sourcePdf.option2AsSeen = 'と言われた'
report.appData.promptEnding = sourceEnding
report.appData.option2 = '言われた'
report.appData.completedSentence = 'しばらくここで待てって言われたから待っているんですけど。'
report.alternatePdf = {
  title: '2016 年 12 月新日本語能力試験N3 真题',
  url: 'https://www.tiengnhatdongian.com/wp-content/uploads/2023/04/De-N3-12-2016.pdf',
  zeroBasedPageIndex: 6,
  printedQuestion: 17,
  promptEnding: '待てって',
  option2: '言われた',
  result: 'This separate PDF copy corroborates the app wording; it differs from the supplied Google Drive PDF.',
  provenance: 'Third-party PDF reproduction; not an official JLPT answer key.',
}
report.decision =
  'Keep app option 2 言われた because a separate published PDF copy prints that wording and it forms 待てって言われた. Continue disclosing that the supplied Google Drive PDF prints と言われた; no official JLPT key has been established.'
report.browserVerification = {
  browser: 'Chrome',
  route: 'http://127.0.0.1:5173/jlpt',
  exam: 'JLPT N3 12/2016, grammar and reading, answer-study mode',
  result:
    'Printed question 17, all fragments, full explanation, and the source-version note were visible; zero answers were selected and progress remained 0/39.',
}
report.status = 'source-conflict-disclosed-editorial-reconstruction'
report.explanationContainsSourceConflictDisclosure = true
report.officialKeyEstablished = false

fs.writeFileSync(mockPath, `${JSON.stringify(mockExams, null, 2)}\n`, 'utf8')
fs.writeFileSync(fullPath, `${JSON.stringify(fullExams, null, 2)}\n`, 'utf8')
fs.writeFileSync(curatedPath, `${JSON.stringify(curated, null, 2)}\n`, 'utf8')
fs.writeFileSync(reportPath, `${JSON.stringify(report, null, 2)}\n`, 'utf8')
console.log(
  'Corrected and disclosed the source-based editorial reconstruction for December 2016 star question 17 in both exam records.'
)
