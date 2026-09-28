import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'

const root = path.resolve('.')
const review = JSON.parse(
  fs.readFileSync(path.join(root, 'reports/n3-quality-audit/grammar-answer-key-2014-07-review.json'), 'utf8')
)
const exams = JSON.parse(fs.readFileSync(path.join(root, 'data/jlpt_n3_toan_master.json'), 'utf8'))
const curated = JSON.parse(fs.readFileSync(path.join(root, 'data/jlpt_n3_explanations_curated.json'), 'utf8'))
const exam = exams.find((item) => item.id === review.examId)
assert.ok(exam, 'Missing JLPT N3 07/2014 full exam')
const questions = new Map(exam.parts.flatMap((part) => part.questions).map((question) => [question.id, question]))
assert.equal(review.answers.length, 13, 'Expected all 13 Grammar Mondai 1 answers')

for (const row of review.answers) {
  const question = questions.get(row.questionId)
  assert.ok(question, `Missing question ${row.questionId}`)
  assert.equal(question.answer, row.answer, `Answer differs from answer-key PDF for ${row.questionId}`)
  if (question.correctAnswer !== undefined) {
    assert.equal(question.correctAnswer, row.answer, `correctAnswer differs from answer-key PDF for ${row.questionId}`)
  }
  assert.equal(curated[question.id], question.explanation, `Curated explanation is out of sync for ${row.questionId}`)
  assert.ok(question.explanation?.trim(), `Missing explanation for ${row.questionId}`)
}

console.log('Verified all 13 JLPT N3 07/2014 Grammar Mondai 1 answers against the separate answer-key PDF.')
