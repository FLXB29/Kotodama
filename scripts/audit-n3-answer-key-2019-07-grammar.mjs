import fs from 'node:fs'

const exams = JSON.parse(fs.readFileSync('data/jlpt_n3_toan_master.json', 'utf8'))
const exam = exams.find((entry) => entry.id === 'toan-n3-201907-full')
if (!exam) throw new Error('Could not find the July 2019 N3 paper.')

const questions = exam.parts
  .filter((part) => part.title.includes('Ngữ pháp'))
  .flatMap((part) => part.questions)
  .filter((question) => Number(question.number) >= 36 && Number(question.number) <= 48)
  .sort((a, b) => Number(a.number) - Number(b.number))

const reviewedAnswers = [2, 4, 4, 1, 2, 1, 3, 2, 4, 3, 2, 3, 3]
const vietnameseReference = [2, 4, 4, 1, 2, 1, 3, 2, 4, 3, 2, 3, 3]

if (questions.length !== 13) throw new Error(`Expected 13 July 2019 grammar items, found ${questions.length}.`)

const rows = questions.map((question, index) => ({
  questionNumber: Number(question.number),
  storedAnswer: Number(question.correctAnswer ?? question.answer),
  reviewedAnswer: reviewedAnswers[index],
  vietnameseReference: vietnameseReference[index],
  choices: question.options,
  answerMatchesReviewed: Number(question.correctAnswer ?? question.answer) === reviewedAnswers[index],
  answerMatchesVietnameseReference: Number(question.correctAnswer ?? question.answer) === vietnameseReference[index],
}))

const changed = rows.filter((row) => !row.answerMatchesReviewed)
if (changed.length) throw new Error(`Stored July 2019 answers differ at: ${changed.map((row) => row.questionNumber).join(', ')}`)

const report = {
  generatedAt: new Date().toISOString(),
  examId: exam.id,
  scope: 'Grammar Mondai 1, question numbers 36–48.',
  method:
    'Compares the local answer sequence with a published Vietnamese reference table and checks the question transcription against PassJapanese. The answer table is nonofficial; review of one grammar subtest does not certify the rest of this exam.',
  sources: [
    { name: 'Phanmemhoctiengnhat answer table', url: 'https://phanmemhoctiengnhat.com/jlpt/dap-an-jlpt-n3/dap-an-jlpt-n3-7-2019-chuan-day-du-nhat.html' },
    { name: 'PassJapanese question transcription', url: 'https://passjapanese.com/ja/jlpt/n3/exam/2019-07-grammar-reading' },
  ],
  rows,
  totals: {
    questions: rows.length,
    storedMatchesReviewed: rows.filter((row) => row.answerMatchesReviewed).length,
    storedMatchesVietnameseReference: rows.filter((row) => row.answerMatchesVietnameseReference).length,
  },
}

const reportPath = 'reports/n3-quality-audit/answer-key-2019-07-grammar.json'
fs.mkdirSync('reports/n3-quality-audit', { recursive: true })
fs.writeFileSync(reportPath, `${JSON.stringify(report, null, 2)}\n`)
console.log(JSON.stringify({ reportPath, totals: report.totals }, null, 2))
