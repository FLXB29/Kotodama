import fs from 'node:fs'

const exams = JSON.parse(fs.readFileSync('data/jlpt_n3_toan_master.json', 'utf8'))
const exam = exams.find((entry) => entry.id === 'toan-n3-202012-full')
if (!exam) throw new Error('Could not find the December 2020 N3 paper.')

const questions = exam.parts
  .filter((part) => part.title.includes('Ngữ pháp'))
  .flatMap((part) => part.questions)
  .filter((question) => Number(question.number) >= 36 && Number(question.number) <= 48)
  .sort((a, b) => Number(a.number) - Number(b.number))

const reviewedAnswers = [2, 1, 4, 3, 1, 3, 3, 2, 4, 1, 2, 4, 1]
const chuyenNgoaiReference = [2, 1, 4, 3, 1, 3, 3, 2, 4, 1, 2, 4, 1]
const jpedoReference = [2, 1, 4, 3, 1, 3, 3, 2, 4, 1, 2, 4, 1]

if (questions.length !== reviewedAnswers.length) {
  throw new Error(`Expected 13 December 2020 grammar items, found ${questions.length}.`)
}

const rows = questions.map((question, index) => ({
  questionNumber: Number(question.number),
  storedAnswer: Number(question.correctAnswer ?? question.answer),
  reviewedAnswer: reviewedAnswers[index],
  chuyenNgoaiReference: chuyenNgoaiReference[index],
  jpedoReference: jpedoReference[index],
  choices: question.options,
  answerMatchesReviewed: Number(question.correctAnswer ?? question.answer) === reviewedAnswers[index],
  answerMatchesChuyenNgoai: Number(question.correctAnswer ?? question.answer) === chuyenNgoaiReference[index],
  answerMatchesJpedo: Number(question.correctAnswer ?? question.answer) === jpedoReference[index],
}))

const changed = rows.filter((row) => !row.answerMatchesReviewed)
if (changed.length) {
  throw new Error(`Stored December 2020 answers differ from the reviewed key at: ${changed.map((row) => row.questionNumber).join(', ')}`)
}

const report = {
  generatedAt: new Date().toISOString(),
  examId: exam.id,
  scope: 'Grammar Mondai 1, question numbers 36–48.',
  method:
    'Compares the stored and linguistically reviewed keys with two published reference sequences. Neither reference is an official JLPT answer sheet. This is a scoped cross-check, not certification of all answers in the exam.',
  sources: [
    {
      name: 'ChuyenNgoaiNgu answer compilation',
      url: 'https://chuyenngoaingu.com/news/de-thi-va-dap-an-jlpt-ky-thi-thang-12-2020-nang-luc-tieng-nhat-5276.aspx',
      qualification: 'Publishes the N3 grammar Mondai 1 sequence; it is a published reference key, not an official JLPT answer sheet.',
    },
    {
      name: 'Jpedo answer compilation',
      url: 'https://www.jpedo.com/news/1572.html',
      qualification: 'Publishes a matching N3 grammar Mondai 1 sequence; it is a published reference key, not an official JLPT answer sheet.',
    },
    {
      name: 'Question booklet mirror',
      url: 'https://www.scribd.com/document/871661110/14-N3-Tha-ng-12-2020',
      qualification: 'Used as a question-text mirror only; it does not establish the official answer key.',
    },
  ],
  rows,
  totals: {
    questions: rows.length,
    storedMatchesReviewed: rows.filter((row) => row.answerMatchesReviewed).length,
    storedMatchesChuyenNgoai: rows.filter((row) => row.answerMatchesChuyenNgoai).length,
    storedMatchesJpedo: rows.filter((row) => row.answerMatchesJpedo).length,
  },
}

const reportPath = 'reports/n3-quality-audit/answer-key-2020-12-grammar.json'
fs.mkdirSync('reports/n3-quality-audit', { recursive: true })
fs.writeFileSync(reportPath, `${JSON.stringify(report, null, 2)}\n`)
console.log(JSON.stringify({ reportPath, totals: report.totals }, null, 2))
