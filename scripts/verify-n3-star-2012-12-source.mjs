import fs from 'node:fs'
import path from 'node:path'

const masterPath = path.resolve('data/jlpt_n3_toan_master.json')
const exams = JSON.parse(fs.readFileSync(masterPath, 'utf8'))
const exam = exams.find((item) => item.id === 'toan-n3-201212-full')
if (!exam) throw new Error('Could not find JLPT N3 2012/12 exam')
const questions = exam.parts.flatMap((part) => part.questions)
const pdf = 'https://drive.google.com/file/d/113QWsU7OKs23DMJtygRO3TU_Ht5VGdLl/view'
const normalize = (value) =>
  String(value || '')
    .replace(/^\s*[1-4１-４][.．、\s　]*/u, '')
    .replace(/\s+/g, '')
    .trim()
const checks = [
  {
    id: 'toan_q_2012_12_49',
    number: 49,
    printedNumber: 14,
    options: ['1 忙しくなり', '2 今日中に', '3 そうですし', '4 やってしまい'],
    order: [1, 3, 2, 4],
    position: 2,
    answer: 2,
    page: 6,
  },
  {
    id: 'toan_q_2012_12_50',
    number: 50,
    printedNumber: 15,
    options: ['1 私は本当に', '2 「おかえり」と言われると', '3 娘がいる', '4 こんなかわいい'],
    order: [2, 4, 3, 1],
    position: 2,
    answer: 3,
    page: 6,
  },
  {
    id: 'toan_q_2012_12_51',
    number: 51,
    printedNumber: 16,
    options: ['1 桜だけでなく', '2 ことで', '3 有名ですが', '4 きれいな'],
    order: [4, 2, 3, 1],
    position: 2,
    answer: 3,
    answerBefore: 1,
    page: 6,
  },
  {
    id: 'toan_q_2012_12_52',
    number: 52,
    printedNumber: 17,
    options: ['1 チャレンジして', '2 失敗する', '3 しないで', '4 いるより'],
    order: [3, 4, 1, 2],
    position: 2,
    answer: 1,
    page: 7,
  },
  {
    id: 'toan_q_2012_12_53',
    number: 53,
    printedNumber: 18,
    options: ['1 三人', '2 割引券一枚で', '3 二割引', '4 まで'],
    order: [2, 1, 4, 3],
    position: 2,
    answer: 4,
    page: 7,
  },
]

for (const check of checks) {
  const question = questions.find((item) => item.id === check.id)
  if (!question) throw new Error(`Missing question ${check.id}`)
  const normalizedOptions = (question.options || []).map(normalize)
  const sourceOptions = (check.options || []).map(normalize)
  if (
    question.number !== check.number ||
    normalizedOptions.length !== sourceOptions.length ||
    normalizedOptions.some((option, index) => option !== sourceOptions[index]) ||
    question.correctAnswer !== check.answer ||
    JSON.stringify(question.starCorrectOrder) !== JSON.stringify(check.order) ||
    question.starPosition !== check.position
  ) {
    throw new Error(`Question ${check.id} changed; review its answer/order before source verification`)
  }

  question.starOrderVerified = true
  question.starPositionVerified = true
  question.starVerificationSources = [`${pdf}#page=${check.page}`]
  question.starVerificationNote =
    check.answerBefore === undefined
      ? `Compared in Chrome with the rendered original PDF, printed question ${check.printedNumber} on page ${check.page}. The printed ★ slot and four fragments match; the complete order was checked by assembling the sentence. The answer key was not changed; no separate official answer sheet was consulted.`
      : `Compared in Chrome with the rendered original PDF, printed question ${check.printedNumber} on page ${check.page}. The source places the ★ over the third segment; the natural order 4→2→3→1 puts option 3 in that slot. The old key ${check.answerBefore} was corrected to ${check.answer}; no separate official answer sheet was consulted.`
}

fs.writeFileSync(masterPath, `${JSON.stringify(exams, null, 2)}\n`, 'utf8')
console.log(
  `Recorded source review for ${checks.length} star questions; reviewed the q16 key correction and kept the other four keys.`
)
