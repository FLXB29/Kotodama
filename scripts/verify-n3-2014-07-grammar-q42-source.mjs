import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'

const root = path.resolve('.')
const review = JSON.parse(
  fs.readFileSync(path.join(root, 'reports/n3-quality-audit/grammar-source-2014-07-q42-review.json'), 'utf8')
)
const exams = JSON.parse(fs.readFileSync(path.join(root, 'data/jlpt_n3_toan_master.json'), 'utf8'))
const curated = JSON.parse(fs.readFileSync(path.join(root, 'data/jlpt_n3_explanations_curated.json'), 'utf8'))
const exam = exams.find((item) => item.id === review.examId)
assert.ok(exam, 'Missing JLPT N3 07/2014 full exam')
const question = exam.parts.flatMap((part) => part.questions).find((item) => item.id === review.questionId)
assert.ok(question, 'Missing reviewed question')

const normalize = (value) =>
  String(value || '')
    .replace(/<[^>]*>/gu, '')
    .normalize('NFKC')
    .replace(/\s+/gu, '')
    .replace(/^\[\d+\]/u, '')

const prompt = normalize(question.question)
assert.ok(prompt.includes(normalize(review.sourceQuestion)), 'Question wording differs from source PDF')
assert.ok(normalize(question.sentence).includes(normalize(review.sourceQuestion)), 'Sentence wording differs from source PDF')
assert.deepEqual(
  question.options.map((option) => normalize(option).replace(/^[1-4][.．、]?/u, '')),
  review.sourceOptions.map(normalize),
  'Answer choices differ from source PDF'
)
assert.equal(question.answer, review.answerKeyAnswer, 'Answer differs from separate answer-key page 9')
assert.equal(question.correctAnswer, review.answerKeyAnswer, 'correctAnswer differs from separate answer-key page 9')
assert.equal(question.sourceVerificationStatus, 'verified')
assert.deepEqual(question.sourceVerificationSources, [review.sources.question, review.sources.answerKey])
assert.equal(curated[question.id], question.explanation, 'Curated explanation must match master question')
assert.ok(question.explanation.includes('でございます'))
assert.ok(question.explanation.includes('がございます'))
assert.ok(question.explanation.includes('Dịch:'))
assert.ok(!question.explanation.includes('がざいます'))
assert.ok(!prompt.includes('どのアイスクリーム'))

console.log('Verified 07/2014 grammar question 42 transcription, options, answer key, and explanation against PDFs.')
