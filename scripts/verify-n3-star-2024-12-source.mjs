import fs from 'node:fs'
import path from 'node:path'

const masterPath = path.resolve('data/jlpt_n3_toan_master.json')
const exams = JSON.parse(fs.readFileSync(masterPath, 'utf8'))
const exam = exams.find((item) => item.id === 'toan-n3-202412-full')
if (!exam) throw new Error('Could not find JLPT N3 2024/12 exam')

const questions = exam.parts.flatMap((part) => part.questions)
const pdf = 'https://drive.google.com/file/d/1nmgQswbqLpeJWtKJXop5tTOHZ46Ufu8K/view'
const normalize = (value) =>
  String(value || '')
    .replace(/^\s*[1-4１-４][.．、\s　]*/u, '')
    .replace(/\s+/g, '')
    .trim()

const checks = [
  {
    id: 'toan_q_2024_12_49',
    number: 49,
    printedNumber: 14,
    options: ['1 大学生活', '2 持っている', '3 に対して', '4 イメージ'],
    order: [1, 3, 2, 4],
    answer: 2,
  },
  {
    id: 'toan_q_2024_12_50',
    number: 50,
    printedNumber: 15,
    options: ['1 最近', '2 プレゼントする', '3 かばんを', '4 欲しがっている'],
    order: [1, 4, 3, 2],
    answer: 3,
  },
  {
    id: 'toan_q_2024_12_51',
    number: 51,
    printedNumber: 16,
    options: ['1 している', '2 ために', '3 毎日8時間以上寝る', '4 ように'],
    order: [2, 3, 4, 1],
    answer: 4,
  },
  {
    id: 'toan_q_2024_12_52',
    number: 52,
    printedNumber: 17,
    options: ['1 たびに', '2 買ってきてくれる', '3 お土産の', '4 東京へ出張に行く'],
    order: [4, 1, 2, 3],
    answer: 2,
  },
  {
    id: 'toan_q_2024_12_53',
    number: 53,
    printedNumber: 18,
    options: ['1 景色を楽しみながら', '2 大きな窓から海が見えて', '3 だけではなく', '4 読書ができるのも'],
    order: [3, 2, 1, 4],
    answer: 1,
    sourceCorrection: { index: 2, from: 'だけでなく', to: 'だけではなく' },
  },
]

for (const check of checks) {
  const question = questions.find((item) => item.id === check.id)
  if (!question) throw new Error(`Missing question ${check.id}`)

  if (check.sourceCorrection) {
    const { index, from, to } = check.sourceCorrection
    const oldText = normalize(question.options?.[index])
    if (oldText === normalize(from)) {
      question.options[index] = question.options[index].replace(from, to)
    } else if (oldText !== normalize(to)) {
      throw new Error(`Question ${check.id} has an unexpected source option: ${question.options?.[index]}`)
    }
  }

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

  question.starOrderVerified = true
  question.starPositionVerified = true
  question.starVerificationSources = [`${pdf}#page=9`]
  question.starVerificationNote =
    `Compared in Chrome with the rendered original PDF, printed question ${check.printedNumber} on page 9. ` +
    `The printed ★ is over the third segment. The assembled sentence order ${check.order.join('→')} places choice ${check.answer} in that slot. ` +
    'The source wording, key, and sequence were checked; no separate official answer sheet was consulted.'
}

fs.writeFileSync(masterPath, `${JSON.stringify(exams, null, 2)}\n`, 'utf8')
console.log(`Recorded source review for ${checks.length} December 2024 star questions.`)
