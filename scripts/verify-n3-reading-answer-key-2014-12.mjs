import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'

const root = path.resolve('.')
const review = JSON.parse(fs.readFileSync(path.join(root, 'reports/n3-quality-audit/reading-answer-key-2014-12-review.json'), 'utf8'))
const exams = JSON.parse(fs.readFileSync(path.join(root, 'data/jlpt_n3_toan_master.json'), 'utf8'))
const exam = exams.find((item) => item.id === review.examId)
assert.ok(exam, `Missing ${review.examId}`)
const questions = new Map(exam.parts.flatMap((part) => part.questions).map((question) => [question.id, question]))
assert.equal(review.answers.length, 16)
for (const row of review.answers) {
  const question = questions.get(row.questionId)
  assert.ok(question, `Missing ${row.questionId}`)
  assert.equal(question.answer, row.answer, `Stored answer differs from the reference key for ${row.questionId}`)
  assert.equal(question.correctAnswer, row.answer, `Stored correctAnswer differs from the reference key for ${row.questionId}`)
}
console.log('Verified all 16 December 2014 Reading answer keys (questions 24–39) against the reference PDF.')
