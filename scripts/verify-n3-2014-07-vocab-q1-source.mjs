import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'

const root = path.resolve('.')
const review = JSON.parse(
  fs.readFileSync(path.join(root, 'reports/n3-quality-audit/vocabulary-source-2014-07-q1-review.json'), 'utf8')
)
const exams = JSON.parse(fs.readFileSync(path.join(root, 'data/jlpt_n3_toan_master.json'), 'utf8'))
const exam = exams.find((item) => item.id === 'toan-n3-201407-full')
const question = exam?.parts.flatMap((part) => part.questions).find((item) => item.id === review.question.questionId)
assert.ok(question, 'Missing JLPT N3 07/2014 vocabulary question 1')
const normalize = (value) =>
  String(value || '')
    .replace(/^\s*[1-4１-４][.．、\s　]*/u, '')
    .replace(/\s+/gu, '')

assert.equal(question.answer, 2)
assert.equal(question.correctAnswer, 2)
assert.deepEqual(question.options.map(normalize), review.question.sourceOptions.map(normalize))
assert.equal(question.sourceVerificationStatus, 'verified')
assert.ok(question.sourceVerificationSources?.includes(review.source.questionSourceUrl))
assert.ok(question.sourceVerificationSources?.includes(review.source.answerKeySource))
assert.ok(question.explanation.includes('産業'))
assert.ok(question.explanation.includes('残業'))
assert.ok(question.explanation.includes(review.question.translation))
console.log(
  'Verified source transcription, all four reading options, answer-key agreement, and revised explanation for 07/2014 vocabulary question 1.'
)
