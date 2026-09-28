import fs from 'node:fs'
import path from 'node:path'

const masterPath = path.resolve('data/jlpt_n3_toan_master.json')
const exams = JSON.parse(fs.readFileSync(masterPath, 'utf8'))
const exam = exams.find((item) => item.id === 'toan-n3-202512-full')
if (!exam) throw new Error('Could not find JLPT N3 2025/12 exam')

const questions = exam.parts.flatMap((part) => part.questions)
const pdf = 'https://drive.google.com/file/d/1OtMcYHQ5ZBqJzsJY4jpUEyPX-HCJforX/view'
const normalize = (value) =>
  String(value || '')
    .replace(/^\s*[1-4１-４][.．、\s　]*/u, '')
    .replace(/\s+/g, '')
    .trim()

const checks = [
  {
    id: 'toan_q_2025_12_49',
    printedNumber: 14,
    options: ['1 と', '2 の', '3 について', '4 レポートの書き方'],
    order: [1, 4, 3, 2],
    answer: 3,
  },
  {
    id: 'toan_q_2025_12_50',
    printedNumber: 15,
    options: ['1 で', '2 か何か', '3 テレビ', '4 見たこと'],
    order: [3, 2, 1, 4],
    answer: 1,
  },
  {
    id: 'toan_q_2025_12_52',
    printedNumber: 17,
    options: ['1 北町を選んだ', '2 のは', '3 ずっと北町に住んでみたかった', '4 のに'],
    order: [4, 1, 2, 3],
    answer: 2,
  },
  {
    id: 'toan_q_2025_12_53',
    printedNumber: 18,
    options: ['1 ことが', '2 使った後', '3 ぬれたままにしない', '4 ためには'],
    order: [4, 2, 3, 1],
    answer: 3,
  },
]

for (const check of checks) {
  const question = questions.find((item) => item.id === check.id)
  if (!question) throw new Error(`Missing question ${check.id}`)

  const normalizedOptions = (question.options || []).map(normalize)
  const sourceOptions = check.options.map(normalize)
  if (
    normalizedOptions.length !== sourceOptions.length ||
    normalizedOptions.some((option, index) => option !== sourceOptions[index]) ||
    question.correctAnswer !== check.answer ||
    JSON.stringify(question.starCorrectOrder) !== JSON.stringify(check.order) ||
    question.starPosition !== 2
  ) {
    throw new Error(`Question ${check.id} changed; review its answer/order before source verification`)
  }

  question.starOrderVerified = true
  question.starPositionVerified = true
  question.starVerificationStatus = 'verified-against-source'
  question.starVerificationSources = [`${pdf}#page=9`]
  question.starVerificationNote =
    `Compared with the rendered original PDF, printed question ${check.printedNumber} on page 9. ` +
    `All four option fragments match. The printed ★ is over the third segment; assembled order ` +
    `${check.order.join('→')} puts choice ${check.answer} in that slot.`
}

const disputedQuestion = questions.find((item) => item.id === 'toan_q_2025_12_51')
if (!disputedQuestion) throw new Error('Missing disputed December 2025 question 16')
if (normalize(disputedQuestion.options?.[1]) !== normalize('2 弾くほど')) {
  throw new Error('Question 16 stored option changed; re-review the source conflict')
}
disputedQuestion.starVerificationStatus = 'conflict'
disputedQuestion.starVerificationNote =
  `The rendered source PDF (printed question 16, page 9) says option 2 is 「弾くけど」, ` +
  `but the stored key and secondary answer reference use 「弾くほど」 to form 「弾けば弾くほど」. ` +
  `The source wording and answer key conflict, so this item is excluded from source-verified counts pending authoritative confirmation.`
disputedQuestion.starConflictSources = [`${pdf}#page=9`]

fs.writeFileSync(masterPath, `${JSON.stringify(exams, null, 2)}\n`, 'utf8')
console.log('Recorded PDF source verification for four December 2025 star items; retained q16 as a source conflict.')
