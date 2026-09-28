import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import test from 'node:test'

const root = path.resolve('.')
const review = JSON.parse(
  fs.readFileSync(path.join(root, 'reports/n3-quality-audit/reading-source-2023-12-natto-label-review.json'), 'utf8')
)
const exams = JSON.parse(fs.readFileSync(path.join(root, 'data/jlpt_n3_toan_master.json'), 'utf8'))
const fullExams = JSON.parse(fs.readFileSync(path.join(root, 'data/jlpt_full_master.json'), 'utf8'))
const exam = exams.find((item) => item.id === review.examId)
const parts = exam.parts
const questions = new Map(parts.flatMap((part) => part.questions).map((question) => [question.id, question]))

test('December 2023 Natto item keeps the short-reading label and answer despite the PDF duplicate number', () => {
  const question = questions.get(review.questionId)
  const shortReadings = parts.find((part) => part.title === 'Đọc hiểu - Mondai 1')
  const nextMondai = parts.find((part) => part.title === 'Đọc hiểu - Mondai 2')
  const nextFirstQuestion = nextMondai.questions[0]

  assert.ok(question)
  assert.equal(question.groupQuestionNumber, 4)
  assert.equal(shortReadings.questions.indexOf(question), 3)
  assert.match(question.question, /^<p>.*\[26\]/u)
  assert.equal(question.correctAnswer, 1)
  assert.equal(question.answer, 1)
  assert.match(nextFirstQuestion.question, /^<p>.*\[27\]/u)
  assert.equal(nextFirstQuestion.correctAnswer, 3)

  const fullQuestion = fullExams
    .flatMap((fullExam) => fullExam.parts || [])
    .flatMap((part) => part.questions || [])
    .find((item) => item.id === 'cm2u2y8cd01ib134ixsnmam9l')
  assert.ok(fullQuestion)
  assert.equal(fullQuestion.answer, '1')
  assert.equal(fullQuestion.correctAnswer, '1')
  assert.equal(review.finding.contentChanged, false)
  assert.equal(review.finding.answer, 1)
  assert.match(review.finding.decision, /Keep app label \[26\] and answer 1/u)
})
