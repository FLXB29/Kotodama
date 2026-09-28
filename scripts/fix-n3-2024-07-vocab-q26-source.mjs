import fs from 'node:fs'
import path from 'node:path'

const masterPath = path.resolve('data/jlpt_n3_toan_master.json')
const sectionMasterPath = path.resolve('data/jlpt_full_master.json')
const curatedPath = path.resolve('data/jlpt_n3_explanations_curated.json')
const reportPath = path.resolve('reports/n3-quality-audit/vocabulary-source-review.json')
const source =
  'https://www.tiengnhatdongian.com/wp-content/uploads/2024/07/De-thi-JLPT-chinh-thuc-N3-thang-7_2024.pdf'
const questionId = 'toan_q_2024_07_26'
const explanation = `Đáp án 2 — 「売り切れました」nghĩa là sản phẩm đã bán hết. 「全部売れました」cũng nghĩa là toàn bộ đã bán được; 「売り切れる」nhấn mạnh hàng không còn vì đã bán hết.
1. ほとんど売れました: gần như đã bán hết, nhưng không khẳng định toàn bộ đã hết.
2. 全部売れました: toàn bộ đã bán hết; đúng với 「売り切れました」.
3. あまり売れませんでした: không bán được nhiều; trái nghĩa với câu gốc.
4. 全然売れませんでした: hoàn toàn không bán được; trái nghĩa với câu gốc.
Dịch: “Sản phẩm này đã bán hết.” Ghi nhớ: 全部 = toàn bộ; 売り切れる = bán hết.`

const exams = JSON.parse(fs.readFileSync(masterPath, 'utf8'))
const sectionExams = JSON.parse(fs.readFileSync(sectionMasterPath, 'utf8'))
const curated = JSON.parse(fs.readFileSync(curatedPath, 'utf8'))
const question = exams
  .flatMap((exam) => exam.parts.flatMap((part) => part.questions))
  .find((item) => item.id === questionId)
if (!question) throw new Error(`Missing question ${questionId}`)
if (question.correctAnswer !== 2 || question.answer !== 2) {
  throw new Error(`Unexpected answer key for ${questionId}; refusing to modify it`)
}
if (!['2　全然売れました', '2　全部売れました'].includes(question.options[1])) {
  throw new Error(`Unexpected option 2 for ${questionId}: ${question.options[1]}`)
}

question.options[1] = '2　全部売れました'
question.explanation = explanation
curated[questionId] = explanation

const sectionExam = sectionExams.find((exam) => exam.id === 'cm2u2yale01jo134i8wwru1oo-vocab')
const sectionQuestion = sectionExam?.parts
  ?.flatMap((part) => part.questions || [])
  .find((item) => item.id === 'cm2u2ybg201ki134ijzygln16')
if (!sectionQuestion) throw new Error('Missing duplicated July 2024 vocabulary question in jlpt_full_master.json')
if (String(sectionQuestion.answer) !== '2' || String(sectionQuestion.correctAnswer) !== '2') {
  throw new Error('Unexpected answer key in jlpt_full_master.json; refusing to modify it')
}
if (!['全然売れました', '全部売れました'].includes(sectionQuestion.options?.[1]?.text)) {
  throw new Error(`Unexpected standalone choice 2: ${sectionQuestion.options?.[1]?.text}`)
}
sectionQuestion.options[1].text = '全部売れました'
sectionQuestion.explanation = explanation

fs.writeFileSync(masterPath, `${JSON.stringify(exams, null, 2)}\n`, 'utf8')
fs.writeFileSync(sectionMasterPath, `${JSON.stringify(sectionExams, null, 2)}\n`, 'utf8')
fs.writeFileSync(curatedPath, `${JSON.stringify(curated, null, 2)}\n`, 'utf8')

const report = fs.existsSync(reportPath) ? JSON.parse(fs.readFileSync(reportPath, 'utf8')) : { reviews: [] }
report.generatedAt = new Date().toISOString()
report.reviews = (report.reviews || []).filter((review) => review.questionId !== questionId)
report.reviews.push({
  questionId,
  exam: '2024/07',
  printedQuestion: 26,
  pdfPage: 3,
  source,
  sourceExcerpt: '26. この商品は売り切れました。 1 ほとんど売れました 2 全部売れました 3 あまり売れませんでした 4 全然売れませんでした',
  correction: 'Choice 2 was transcribed as 全然売れました; the source PDF says 全部売れました.',
  answerKey: { before: 2, after: 2, changed: false },
  mirroredInto: [
    { file: 'data/jlpt_n3_toan_master.json', examId: 'toan-n3-202407-full', questionId },
    {
      file: 'data/jlpt_full_master.json',
      examId: 'cm2u2yale01jo134i8wwru1oo-vocab',
      questionId: 'cm2u2ybg201ki134ijzygln16',
    },
  ],
})
fs.writeFileSync(reportPath, `${JSON.stringify(report, null, 2)}\n`, 'utf8')
console.log(`Corrected both July 2024 vocabulary copies from the source PDF; answer key stayed 2.`)
