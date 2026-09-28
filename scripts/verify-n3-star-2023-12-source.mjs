import fs from 'node:fs'
import path from 'node:path'

const masterPath = path.resolve('data/jlpt_n3_toan_master.json')
const exams = JSON.parse(fs.readFileSync(masterPath, 'utf8'))
const exam = exams.find((item) => item.id === 'toan-n3-202312-full')
if (!exam) throw new Error('Could not find JLPT N3 2023/12 exam')

const questions = exam.parts.flatMap((part) => part.questions)
const pdf = 'https://drive.google.com/file/d/1Yr4o92v_iySjcXZEdiKGKgcdvltqBqad/view'
const normalize = (value) =>
  String(value || '')
    .replace(/^\s*[1-4１-４][.．、\s　]*/u, '')
    .replace(/\s+/g, '')
    .trim()

const checks = [
  {
    id: 'toan_q_2023_12_49',
    printedNumber: 14,
    options: ['1 声がきれいな', '2 は', '3 歌手', '4 ほど'],
    order: [4, 1, 3, 2],
    position: 0,
    answer: 4,
  },
  {
    id: 'toan_q_2023_12_50',
    printedNumber: 15,
    options: ['1 人が', '2 増えてきている', '3 インターネットで買う', '4 ということを'],
    order: [3, 1, 2, 4],
    position: 2,
    answer: 2,
  },
  {
    id: 'toan_q_2023_12_51',
    printedNumber: 16,
    options: ['1 もらえない', '2 ところがあるので', '3 一度チェックして', '4 自信がない'],
    order: [4, 2, 3, 1],
    position: 2,
    answer: 3,
  },
  {
    id: 'toan_q_2023_12_52',
    printedNumber: 17,
    options: ['1 玄関の電気を消すのを', '2 きて', '3 家を出て', '4 忘れて'],
    order: [1, 4, 3, 2],
    position: 2,
    answer: 3,
  },
  {
    id: 'toan_q_2023_12_53',
    printedNumber: 18,
    options: ['1 必ずノートに記録する', '2 忘れない', '3 ように', '4 ことにしている'],
    order: [2, 3, 1, 4],
    position: 2,
    answer: 1,
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
    JSON.stringify(question.starCorrectOrder) !== JSON.stringify(check.order)
  ) {
    throw new Error(`Question ${check.id} differs from the rendered source; review before marking verified`)
  }

  if (check.id === 'toan_q_2023_12_49') {
    const hasKnownStoredMismatch = question.correctAnswer === 3 && question.starPosition === 2
    const alreadyCorrected = question.correctAnswer === check.answer && question.starPosition === check.position
    if (!hasKnownStoredMismatch && !alreadyCorrected) {
      throw new Error('Question 14 has an unexpected stored key/position; inspect before correcting it')
    }
  } else if (question.correctAnswer !== check.answer || question.starPosition !== check.position) {
    throw new Error(`Question ${check.id} key/position changed; re-review against the original PDF`)
  }

  question.correctAnswer = check.answer
  question.answer = check.answer
  question.starPosition = check.position
  question.starOrderVerified = true
  question.starPositionVerified = true
  question.starVerificationStatus = 'verified-against-source'
  question.starVerificationSources = [`${pdf}#page=8`]
  question.starVerificationNote =
    `Compared with the rendered original PDF, printed question ${check.printedNumber} on page 8. ` +
    `All four option fragments match. The printed ★ is over segment ${check.position + 1}; assembled order ` +
    `${check.order.join('→')} puts choice ${check.answer} in that slot. ` +
    (check.id === 'toan_q_2023_12_49'
      ? 'The prior stored key (choice 3 at segment 3) contradicted both the printed ★ and the answer key; corrected to choice 4 at segment 1.'
      : '')
}

fs.writeFileSync(masterPath, `${JSON.stringify(exams, null, 2)}\n`, 'utf8')
console.log('Recorded original-PDF verification for all five December 2023 star questions and corrected question 14.')
