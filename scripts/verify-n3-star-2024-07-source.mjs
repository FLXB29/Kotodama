import fs from 'node:fs'
import path from 'node:path'

const masterPath = path.resolve('data/jlpt_n3_toan_master.json')
const exams = JSON.parse(fs.readFileSync(masterPath, 'utf8'))
const exam = exams.find((item) => item.id === 'toan-n3-202407-full')
if (!exam) throw new Error('Could not find JLPT N3 2024/07 exam')

const questions = exam.parts.flatMap((part) => part.questions)
const pdf = 'https://drive.google.com/file/d/17J8BA7FDuQHsrqmwrXcfE3-EK2mDssfR/view'
const normalize = (value) =>
  String(value || '')
    .replace(/^\s*[1-4１-４][.．、\s　]*/u, '')
    .replace(/\s+/g, '')
    .trim()

const checks = [
  {
    id: 'toan_q_2024_07_49',
    number: 49,
    printedNumber: 14,
    options: ['1 が', '2 焼ける', '3 の', '4 いいにおい'],
    order: [3, 2, 4, 1],
    answer: 4,
  },
  {
    id: 'toan_q_2024_07_50',
    number: 50,
    printedNumber: 15,
    options: ['1 とか', '2 歩く', '3 使う', '4 スピードを速くする'],
    order: [3, 1, 2, 4],
    answer: 2,
  },
  {
    id: 'toan_q_2024_07_51',
    number: 51,
    printedNumber: 16,
    options: ['1 多くて', '2 覚えなければいけない', '3 ことが', '4 ばかりなので'],
    order: [4, 2, 3, 1],
    answer: 3,
  },
  {
    id: 'toan_q_2024_07_52',
    number: 52,
    printedNumber: 17,
    options: ['1 きれいな', '2 なんて', '3 なんだろう', '4 眺め'],
    order: [2, 1, 4, 3],
    answer: 4,
  },
  {
    id: 'toan_q_2024_07_53',
    number: 53,
    printedNumber: 18,
    options: ['1 結婚するんだ', '2 って', '3 と', '4 受付の林さん'],
    order: [4, 3, 1, 2],
    answer: 1,
  },
]

for (const check of checks) {
  const question = questions.find((item) => item.id === check.id)
  if (!question) throw new Error(`Missing question ${check.id}`)

  const normalizedOptions = (question.options || []).map(normalize)
  const sourceOptions = check.options.map(normalize)
  if (
    question.number !== check.number ||
    normalizedOptions.length !== sourceOptions.length ||
    normalizedOptions.some((option, index) => option !== sourceOptions[index]) ||
    question.correctAnswer !== check.answer ||
    JSON.stringify(question.starCorrectOrder) !== JSON.stringify(check.order) ||
    question.starPosition !== 2
  ) {
    throw new Error(`Question ${check.id} changed; review its answer/order before source verification`)
  }

  const previousSources = question.starVerificationSources || []
  question.starOrderVerified = true
  question.starPositionVerified = true
  question.starVerificationSources = [
    `${pdf}#page=8`,
    ...previousSources.filter((source) => source !== pdf && source !== `${pdf}#page=8`),
  ]
  question.starVerificationNote =
    `Compared in Chrome with the rendered original PDF, printed question ${check.printedNumber} on page 8. ` +
    `The printed ★ is over the third segment. The assembled sentence order ${check.order.join('→')} places choice ${check.answer} in that slot. ` +
    'The key and sequence match the source; for question 14 the existing secondary answer reference also agrees.'
}

fs.writeFileSync(masterPath, `${JSON.stringify(exams, null, 2)}\n`, 'utf8')
console.log(`Recorded source review for five July 2024 star questions.`)
