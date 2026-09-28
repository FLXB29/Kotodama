import fs from 'node:fs'
import path from 'node:path'

const masterPath = path.resolve('data/jlpt_n3_toan_master.json')
const exams = JSON.parse(fs.readFileSync(masterPath, 'utf8'))
const exam = exams.find((item) => item.id === 'toan-n3-202307-full')
if (!exam) throw new Error('Could not find JLPT N3 2023/07 exam')

const questions = exam.parts.flatMap((part) => part.questions)
const pdf = 'https://drive.google.com/file/d/1asWlZ9d0ZPZFByphJ-sgCTAtrWMhnCMz/view'
const normalize = (value) =>
  String(value || '')
    .replace(/^\s*[1-4１-４][.．、\s　]*/u, '')
    .replace(/\s+/g, '')
    .trim()

const checks = [
  {
    id: 'toan_q_2023_07_49',
    printedNumber: 14,
    options: ['1 が', '2 による', '3 見すぎ', '4 目の疲れ'],
    order: [3, 2, 4, 1],
    position: 1,
    answer: 2,
  },
  {
    id: 'toan_q_2023_07_50',
    printedNumber: 15,
    options: ['1 上手に弾けない', '2 練習しても', '3 なかなか', '4 曲があって'],
    order: [2, 3, 1, 4],
    position: 1,
    answer: 3,
    keyNote:
      'The rendered exam puts ★ over the second fragment, 「なかなか」. A secondary answer-key compilation lists choice 1, which would put ★ over the third fragment; the original question layout and natural assembled sentence support choice 3.',
  },
  {
    id: 'toan_q_2023_07_51',
    printedNumber: 16,
    options: ['1 失敗をしてしまった', '2 どうして', '3 のか', '4 のは'],
    order: [4, 2, 1, 3],
    position: 2,
    answer: 1,
  },
  {
    id: 'toan_q_2023_07_52',
    printedNumber: 17,
    options: ['1 いいんじゃない', '2 から', '3 とか', '4 タオル'],
    order: [2, 4, 3, 1],
    position: 2,
    answer: 3,
  },
  {
    id: 'toan_q_2023_07_53',
    printedNumber: 18,
    options: ['1 専門家で', '2 都会で', '3 いらっしゃる', '4 山下花子先生に'],
    order: [1, 3, 4, 2],
    position: 2,
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
    JSON.stringify(question.starCorrectOrder) !== JSON.stringify(check.order)
  ) {
    throw new Error(`Question ${check.id} differs from the rendered source; review before marking verified`)
  }

  const alreadyMatches = question.correctAnswer === check.answer && question.starPosition === check.position
  if (check.id === 'toan_q_2023_07_50') {
    const knownMismatch = question.correctAnswer === 1 && question.starPosition === 2
    if (!knownMismatch && !alreadyMatches) {
      throw new Error('Question 15 has an unexpected stored key/position; inspect before correcting it')
    }
  } else if (!alreadyMatches) {
    throw new Error(`Question ${check.id} key/position changed; re-review against the original PDF`)
  }

  question.correctAnswer = check.answer
  question.answer = check.answer
  question.starPosition = check.position
  question.starOrderVerified = true
  question.starPositionVerified = true
  question.starVerificationStatus = 'verified-against-source'
  question.starVerificationSources = [`${pdf}#page=7`]
  question.starVerificationNote =
    `Compared visually with the rendered original PDF, printed question ${check.printedNumber} on page 7. ` +
    `All four option fragments match. The printed ★ is over segment ${check.position + 1}; assembled order ` +
    `${check.order.join('→')} puts choice ${check.answer} in that slot.` +
    (check.keyNote ? ` Secondary-key discrepancy: ${check.keyNote}` : '')
}

fs.writeFileSync(masterPath, `${JSON.stringify(exams, null, 2)}\n`, 'utf8')
console.log('Recorded original-PDF verification for all five July 2023 star questions; corrected question 15 from the printed star layout.')
