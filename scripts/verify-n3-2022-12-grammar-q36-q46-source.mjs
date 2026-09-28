import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'

const root = path.resolve('.')
const review = JSON.parse(
  fs.readFileSync(path.join(root, 'reports/n3-quality-audit/grammar-source-2022-12-q36-q46-review.json'), 'utf8')
)
const keyReview = JSON.parse(
  fs.readFileSync(path.join(root, 'reports/n3-quality-audit/answer-key-2022-12-grammar.json'), 'utf8')
)
const exams = JSON.parse(fs.readFileSync(path.join(root, 'data/jlpt_n3_toan_master.json'), 'utf8'))
const curated = JSON.parse(fs.readFileSync(path.join(root, 'data/jlpt_n3_explanations_curated.json'), 'utf8'))
const exam = exams.find((item) => item.id === review.examId)
assert.ok(exam, 'Missing December 2022 N3 full exam')
assert.equal(review.answerKeyStatus, 'unresolved_reference_conflict')

const normalize = (value) =>
  String(value || '')
    .replace(/<[^>]*>/gu, '')
    .normalize('NFKC')
    .replace(/\s+/gu, '')
    .replace(/[「」『』]/gu, '')

for (const sourceItem of review.questions) {
  const matches = exam.parts.flatMap((part) => part.questions || []).filter((item) => item.id === sourceItem.questionId)
  assert.equal(matches.length, 1, `Expected one ${sourceItem.questionId}`)
  const question = matches[0]
  const prompt = normalize(question.question)
  assert.ok(prompt.includes(normalize(sourceItem.sourcePrompt)), `${sourceItem.questionId} prompt differs from the PDF review`)
  assert.ok(normalize(question.sentence).includes(normalize(sourceItem.sourcePrompt)), `${sourceItem.questionId} sentence differs from the PDF review`)
  assert.deepEqual(
    question.options.map((option) => normalize(option).replace(/^[1-4][.．、]?/u, '')),
    sourceItem.sourceOptions.map(normalize),
    `${sourceItem.questionId} options differ from the PDF review`
  )
  assert.equal(Number(question.answer), sourceItem.storedAnswer, `${sourceItem.questionId} answer changed`)
  assert.equal(Number(question.correctAnswer), sourceItem.storedAnswer, `${sourceItem.questionId} correctAnswer changed`)
  assert.equal(curated[question.id], question.explanation, `${sourceItem.questionId} explanation is not synchronized`)

  const keyRow = keyReview.rows.find((row) => row.questionNumber === Number(question.number))
  assert.ok(keyRow, `Missing reference-key row for ${sourceItem.questionId}`)
  assert.equal(keyRow.chuyenNgoaiReference, sourceItem.referenceAnswers.Chuyenngoaingu)
  assert.equal(keyRow.luyenThiJapaneseReference, sourceItem.referenceAnswers.LuyenThiTiengNhat)
  assert.equal(keyRow.reviewedAnswer, sourceItem.storedAnswer)
  assert.notEqual(keyRow.chuyenNgoaiReference, sourceItem.storedAnswer, `${sourceItem.questionId} conflict was lost`)
  assert.notEqual(keyRow.luyenThiJapaneseReference, sourceItem.storedAnswer, `${sourceItem.questionId} conflict was lost`)
}

const q36 = exam.parts.flatMap((part) => part.questions || []).find((item) => item.id === 'toan_q_2022_12_36')
assert.ok(!normalize(q36.question).includes(normalize('書き方がよくわからないところなんですが')))
assert.ok(q36.explanation.includes('Dịch:'))
assert.ok(q36.explanation.includes('Có chỗ em chưa hiểu rõ cách điền'))

console.log('Verified December 2022 grammar question 36 transcription and questions 36/46 prompt, options, retained answers, synchronized explanations, and unresolved external-key disagreements.')
