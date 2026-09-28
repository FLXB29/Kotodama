import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'

const root = path.resolve('.')
const review = JSON.parse(
  fs.readFileSync(path.join(root, 'reports/n3-quality-audit/star-source-2014-07-review.json'), 'utf8')
)
const exams = JSON.parse(fs.readFileSync(path.join(root, 'data/jlpt_n3_toan_master.json'), 'utf8'))
const exam = exams.find((item) => item.id === 'toan-n3-201407-full')
assert.ok(exam, 'Missing JLPT N3 July 2014 exam')
const questions = new Map(exam.parts.flatMap((part) => part.questions).map((question) => [question.id, question]))
const normalizeOption = (value) =>
  String(value || '')
    .replace(/^\s*[1-4１-４][.．、\s　]*/u, '')
    .replace(/\s+/gu, '')
const normalizeSentence = (value) => String(value || '').replace(/[\s、。,.，．]/gu, '')

assert.equal(review.questions.length, 5)
assert.deepEqual(
  review.source.answerKey.answers,
  review.questions.map((entry) => entry.answerFromAnswerKey)
)
let agreed = 0
let disputed = 0

for (const entry of review.questions) {
  const question = questions.get(entry.questionId)
  assert.ok(question, `${entry.questionId}: missing question`)
  assert.deepEqual(
    question.starPrompt,
    { before: entry.promptBefore, after: entry.promptAfter },
    `${entry.questionId}: prompt differs from PDF`
  )
  assert.deepEqual(
    question.options.map(normalizeOption),
    entry.sourceOptions.map(normalizeOption),
    `${entry.questionId}: options differ from PDF`
  )
  assert.deepEqual(question.starCorrectOrder, entry.order, `${entry.questionId}: piece order differs`)
  assert.equal(question.starPosition, entry.starSlotIndex, `${entry.questionId}: ★ position differs`)
  assert.equal(
    question.correctAnswer,
    entry.answerFromSentence,
    `${entry.questionId}: stored answer differs from reconstructed star choice`
  )
  assert.equal(question.answer, entry.answerFromSentence)
  assert.equal(
    entry.order[entry.starSlotIndex],
    entry.answerFromSentence,
    `${entry.questionId}: sentence answer is not at ★`
  )
  assert.ok(
    question.starVerificationSources?.includes(review.source.questionSourceUrl),
    `${entry.questionId}: question PDF provenance missing`
  )
  assert.ok(
    question.starVerificationSources?.includes(review.source.answerKeySource),
    `${entry.questionId}: answer key provenance missing`
  )
  assert.ok(question.explanation?.includes('Dịch:'), `${entry.questionId}: explanation lacks translation`)
  assert.ok(question.explanation?.includes('lựa chọn'), `${entry.questionId}: explanation does not identify the answer`)
  const options = entry.sourceOptions.map(normalizeOption)
  const completed = normalizeSentence(
    `${entry.promptBefore}${entry.order.map((choice) => options[choice - 1]).join('')}${entry.promptAfter}`
  )
  assert.equal(completed, normalizeSentence(entry.completedSentence), `${entry.questionId}: completed sentence differs`)

  if (entry.status === 'verified') {
    assert.equal(
      entry.answerFromSentence,
      entry.answerFromAnswerKey,
      `${entry.questionId}: expected answer-key agreement`
    )
    assert.equal(question.starVerificationStatus, 'verified')
    assert.equal(question.starAnswerKeyConflict, null)
    agreed++
  } else {
    assert.equal(entry.status, 'disputed')
    assert.notEqual(entry.answerFromSentence, entry.answerFromAnswerKey)
    assert.equal(question.starVerificationStatus, 'disputed')
    assert.ok(question.starAnswerKeyConflict?.includes('PDF đáp án ghi lựa chọn 4'))
    assert.ok(question.explanation.includes('chưa được coi là xác minh hoàn toàn'))
    disputed++
  }
}

assert.equal(agreed, 4)
assert.equal(disputed, 1)
console.log(`Verified 4/5 07/2014 ★ answers against the separate answer key; retained 1 explicit source conflict.`)
