import fs from 'node:fs'
import path from 'node:path'

const exams = JSON.parse(fs.readFileSync('data/jlpt_n3_toan_master.json', 'utf8'))
const exam = exams.find((entry) => entry.id === 'toan-n3-202307-full')
if (!exam) throw new Error('Could not find the July 2023 N3 paper.')

const questions = exam.parts
  .filter((part) => part.title.includes('Ngữ pháp'))
  .flatMap((part) => part.questions)
  .filter((question) => Number(question.number) >= 36 && Number(question.number) <= 48)
  .sort((a, b) => Number(a.number) - Number(b.number))

const reviewedAnswers = [4, 3, 4, 1, 2, 4, 4, 2, 3, 3, 2, 1, 3]
const aixinjpReference = [4, 3, 4, 1, 2, 4, 4, 2, 3, 3, 2, 1, 3]
const scribdReference = [4, 3, 4, 1, 2, 4, 4, 2, 3, 3, 2, 1, 3]

if (questions.length !== reviewedAnswers.length) {
  throw new Error(`Expected 13 July 2023 grammar items, found ${questions.length}.`)
}

const rows = questions.map((question, index) => ({
  questionNumber: Number(question.number),
  storedAnswer: Number(question.correctAnswer ?? question.answer),
  reviewedAnswer: reviewedAnswers[index],
  aixinjpReference: aixinjpReference[index],
  scribdReference: scribdReference[index],
  choices: question.options,
  answerMatchesReviewed: Number(question.correctAnswer ?? question.answer) === reviewedAnswers[index],
  answerMatchesAixinjp: Number(question.correctAnswer ?? question.answer) === aixinjpReference[index],
  answerMatchesScribd: Number(question.correctAnswer ?? question.answer) === scribdReference[index],
}))

const changed = rows.filter((row) => !row.answerMatchesReviewed)
if (changed.length) {
  throw new Error(`Stored July 2023 answers differ from the reviewed key at: ${changed.map((row) => row.questionNumber).join(', ')}`)
}

const report = {
  generatedAt: new Date().toISOString(),
  examId: exam.id,
  scope: 'Grammar Mondai 1, question numbers 36–48.',
  method:
    'Compares the stored and linguistically reviewed keys with two published reference sequences. Neither reference is an official JLPT answer sheet. This is a scoped cross-check, not certification of all answers in the exam.',
  sources: [
    {
      name: 'Aixin Japanese School',
      url: 'https://aixinjp.com/a/lianxifangshi/zhentidaan/2023/0703/1076.html',
      qualification: 'Publishes the sequence 文法・読解問題１ ４３４１２４４２３３２１３; a reference key, not an official JLPT answer sheet.',
    },
    {
      name: 'Scribd N3 answer compilation',
      url: 'https://www.scribd.com/document/1026523073/jlpt-n3-2023-07-1',
      qualification: 'Extracted grammar key agrees with the stored sequence; uploaded answer compilation, not an official JLPT answer sheet.',
    },
    {
      name: 'PassJapanese question transcription',
      url: 'https://passjapanese.com/ja/jlpt/n3/exam/2023-07-grammar-reading',
      qualification: 'Cross-checks the question text and order; does not independently establish the answer key.',
    },
  ],
  rows,
  totals: {
    questions: rows.length,
    storedMatchesReviewed: rows.filter((row) => row.answerMatchesReviewed).length,
    storedMatchesAixinjp: rows.filter((row) => row.answerMatchesAixinjp).length,
    storedMatchesScribd: rows.filter((row) => row.answerMatchesScribd).length,
  },
  transcriptionCorrection:
    'Question 47 response typo 「そんなんだ」 was corrected to 「そうなんだ」. PassJapanese independently transcribes the response as 「そうなんだ」.',
}

const reportPath = 'reports/n3-quality-audit/answer-key-2023-07-grammar.json'
fs.mkdirSync(path.dirname(reportPath), { recursive: true })
fs.writeFileSync(reportPath, `${JSON.stringify(report, null, 2)}\n`)
console.log(JSON.stringify({ reportPath, totals: report.totals, transcriptionCorrection: report.transcriptionCorrection }, null, 2))
