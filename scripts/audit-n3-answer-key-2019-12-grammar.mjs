import fs from 'node:fs'

const exams = JSON.parse(fs.readFileSync('data/jlpt_n3_toan_master.json', 'utf8'))
const exam = exams.find((entry) => entry.id === 'toan-n3-201912-full')
if (!exam) throw new Error('Could not find the December 2019 N3 paper.')

const questions = exam.parts
  .filter((part) => part.title.includes('Ngữ pháp'))
  .flatMap((part) => part.questions)
  .filter((question) => Number(question.number) >= 36 && Number(question.number) <= 48)
  .sort((a, b) => Number(a.number) - Number(b.number))

const reviewedAnswers = [2, 1, 4, 4, 3, 2, 1, 3, 1, 3, 4, 2, 4]
const vietnameseReference = [2, 1, 4, 4, 3, 2, 1, 3, 1, 3, 4, 2, 4]
const scribdReference = [2, 1, 4, 4, 3, 3, 1, 3, 1, 3, 4, 2, 4]

if (questions.length !== 13) throw new Error(`Expected 13 December 2019 grammar items, found ${questions.length}.`)

const rows = questions.map((question, index) => ({
  questionNumber: Number(question.number),
  storedAnswer: Number(question.correctAnswer ?? question.answer),
  reviewedAnswer: reviewedAnswers[index],
  vietnameseReference: vietnameseReference[index],
  scribdReference: scribdReference[index],
  choices: question.options,
  answerMatchesReviewed: Number(question.correctAnswer ?? question.answer) === reviewedAnswers[index],
  answerMatchesVietnameseReference: Number(question.correctAnswer ?? question.answer) === vietnameseReference[index],
  answerMatchesScribd: Number(question.correctAnswer ?? question.answer) === scribdReference[index],
}))

const changed = rows.filter((row) => !row.answerMatchesReviewed)
if (changed.length) throw new Error(`Stored December 2019 answers differ from reviewed grammar sequence at: ${changed.map((row) => row.questionNumber).join(', ')}`)

const report = {
  generatedAt: new Date().toISOString(),
  examId: exam.id,
  scope: 'Grammar Mondai 1, question numbers 36–48.',
  method:
    'Compares the answer sequence with a Vietnamese reference table and a separately uploaded answer compilation. The Vietnamese table agrees with the stored sequence; the Scribd compilation differs on one item. Neither source is an official JLPT answer sheet, so the disputed item remains flagged.',
  sources: [
    { name: 'TrungTamNhatNgu answer table', url: 'https://trungtamnhatngu.edu.vn/blog/dap-an-ky-thi-jlpt-12-2019-tu-n5-n1-chinh-xac-nhat-1746/' },
    { name: 'Scribd answer compilation', url: 'https://www.scribd.com/document/885818943/%C4%90ap-An-Jlpt-n3-Update-290724' },
  ],
  disputedQuestion: {
    questionNumber: 41,
    storedAndReviewed: 2,
    vietnameseReference: 2,
    scribdReference: 3,
    note: '「買うことにしている」 is the natural form for a recurring personal rule, and the Vietnamese table agrees. The Scribd sequence differs; keep the discrepancy visible rather than treating the cross-check as unanimous.',
  },
  rows,
  totals: {
    questions: rows.length,
    storedMatchesReviewed: rows.filter((row) => row.answerMatchesReviewed).length,
    storedMatchesVietnameseReference: rows.filter((row) => row.answerMatchesVietnameseReference).length,
    storedMatchesScribd: rows.filter((row) => row.answerMatchesScribd).length,
  },
}

const reportPath = 'reports/n3-quality-audit/answer-key-2019-12-grammar.json'
fs.mkdirSync('reports/n3-quality-audit', { recursive: true })
fs.writeFileSync(reportPath, `${JSON.stringify(report, null, 2)}\n`)
console.log(JSON.stringify({ reportPath, totals: report.totals, disputedQuestion: report.disputedQuestion }, null, 2))
