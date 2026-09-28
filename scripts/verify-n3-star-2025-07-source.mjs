import fs from 'node:fs'
import path from 'node:path'

const masterPath = path.resolve('data/jlpt_n3_toan_master.json')
const exams = JSON.parse(fs.readFileSync(masterPath, 'utf8'))
const exam = exams.find((item) => item.id === 'toan-n3-202507-full')
if (!exam) throw new Error('Could not find JLPT N3 2025/07 exam')

const questions = exam.parts.flatMap((part) => part.questions)
const pdf = 'https://drive.google.com/file/d/1da4jaykKDTW282qIbi9JQ_B1po9x5a15/view'
const normalize = (value) =>
  String(value || '')
    .replace(/^\s*[1-4１-４][.．、\s　]*/u, '')
    .replace(/\s+/g, '')
    .trim()

const checks = [
  {
    id: 'toan_q_2025_07_49',
    printedNumber: 14,
    options: ['1 異常な', '2 比べると', '3 暑さだった', '4 去年の夏に'],
    order: [1, 3, 4, 2],
    answer: 4,
  },
  {
    id: 'toan_q_2025_07_50',
    printedNumber: 15,
    options: ['1 ことか', '2 大変な', '3 ことが', '4 どれだけ'],
    order: [3, 4, 2, 1],
    answer: 2,
  },
  {
    id: 'toan_q_2025_07_51',
    printedNumber: 16,
    options: ['1 ので', '2 外が暗くなっていた', '3 驚いた', '4 いつのまにか'],
    order: [4, 2, 1, 3],
    answer: 1,
  },
  {
    id: 'toan_q_2025_07_52',
    printedNumber: 17,
    options: ['1 だから', '2 作り方は', '3 だけ', '4 材料を混ぜて冷やす'],
    order: [2, 4, 3, 1],
    answer: 3,
  },
  {
    id: 'toan_q_2025_07_53',
    printedNumber: 18,
    options: ['1 雨が降ったら', '2 試合は', '3 雨が降ったとしても', '4 中止にならないんだけど'],
    order: [3, 2, 4, 1],
    answer: 4,
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
  question.starVerificationSources = [`${pdf}#page=8`]
  question.starVerificationNote =
    `Compared with the rendered original PDF, printed question ${check.printedNumber} on page 8. ` +
    `All four option fragments match. The printed ★ is over the third segment; assembled order ` +
    `${check.order.join('→')} puts choice ${check.answer} in that slot.`
}

fs.writeFileSync(masterPath, `${JSON.stringify(exams, null, 2)}\n`, 'utf8')
console.log('Recorded PDF source verification for all five July 2025 star questions.')
