import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'

const root = path.resolve('.')
const exams = JSON.parse(fs.readFileSync(path.join(root, 'data/jlpt_n3_toan_master.json'), 'utf8'))
const curated = JSON.parse(fs.readFileSync(path.join(root, 'data/jlpt_n3_explanations_curated.json'), 'utf8'))
const review = JSON.parse(
  fs.readFileSync(path.join(root, 'reports/n3-quality-audit/grammar-source-2017-07-review.json'), 'utf8')
)
const exam = exams.find((item) => item.id === 'toan-n3-201707-full')
assert.ok(exam, 'Missing JLPT N3 July 2017 exam.')
const part = (mondai) => exam.parts.find((item) => item.title === `Kiến thức ngôn ngữ (Ngữ pháp) - Mondai ${mondai}`)
const normalizeOption = (value) =>
  String(value || '')
    .replace(/<[^>]*>/gu, '')
    .replace(/^\s*[1-4１-４][.．、\s　]*/u, '')
    .replace(/[\s　]/gu, '')
const normalizeSentence = (value) => String(value || '').replace(/[\s、。,.，．「」『』]/gu, '')

const m1 = part(1)
assert.equal(m1.questions.length, 13)
for (const question of m1.questions) {
  const explanation = question.explanation || curated[question.id] || ''
  assert.match(explanation, /Dịch:/u, `${question.id}: missing full-sentence translation`)
  for (let option = 1; option <= 4; option++) {
    assert.match(explanation, new RegExp(`^${option}\\.`, 'mu'), `${question.id}: missing option ${option} rationale`)
  }
}

const starPart = part(2)
assert.equal(starPart.questions.length, 5)
assert.equal(review.questions.length, 5)
const questionMap = new Map(starPart.questions.map((question) => [question.id, question]))
for (const entry of review.questions) {
  const question = questionMap.get(entry.questionId)
  assert.ok(question, `${entry.questionId}: missing star question`)
  assert.equal(entry.sourceOptions.length, 4)
  assert.deepEqual(
    question.options.map(normalizeOption),
    entry.sourceOptions.map(normalizeOption),
    `${entry.questionId}: choices differ from the reviewed PDF`
  )
  assert.deepEqual(
    question.starPrompt,
    { before: entry.promptBefore, after: entry.promptAfter },
    `${entry.questionId}: prompt differs from the reviewed PDF`
  )
  assert.deepEqual(question.starCorrectOrder, entry.order, `${entry.questionId}: fragment order differs`)
  assert.equal(question.starPosition, entry.starSlotIndex, `${entry.questionId}: ★ slot differs`)
  assert.equal(question.correctAnswer, entry.reconstructedAnswer, `${entry.questionId}: answer differs`)
  assert.equal(question.answer, entry.reconstructedAnswer)
  assert.equal(entry.order[entry.starSlotIndex], entry.reconstructedAnswer)
  assert.equal(question.starOrderVerified, true)
  assert.equal(question.starPositionVerified, true)
  assert.equal(question.starVerificationStatus, entry.status)
  assert.ok(question.starVerificationSources?.includes(review.source.questionPdf.url))
  assert.ok(question.starVerificationSources?.includes(review.source.answerReference.url))
  assert.ok(question.explanation || curated[entry.questionId], `${entry.questionId}: explanation missing`)

  const explanation = question.explanation || curated[entry.questionId]
  assert.match(explanation, /Câu hoàn chỉnh:/u, `${entry.questionId}: missing completed sentence`)
  assert.match(explanation, /Dịch:/u, `${entry.questionId}: missing Vietnamese translation`)
  assert.match(explanation, /Thứ tự mảnh/u, `${entry.questionId}: missing fragment order`)
  for (const option of entry.sourceOptions) {
    assert.ok(explanation.includes(option), `${entry.questionId}: explanation omits fragment ${option}`)
  }
  const fragmentText = entry.sourceOptions.map(normalizeOption)
  const reconstructed = normalizeSentence(
    `${question.starPrompt.before}${entry.order.map((choice) => fragmentText[choice - 1]).join('')}${question.starPrompt.after}`
  )
  assert.equal(reconstructed, normalizeSentence(entry.completedSentence))

  if (entry.status === 'disputed') {
    assert.notEqual(entry.answerReference, entry.reconstructedAnswer)
    assert.ok(question.starAnswerKeyConflict)
    assert.match(explanation, /còn bất đồng nguồn/u)
  } else {
    assert.equal(entry.answerReference, entry.reconstructedAnswer)
    assert.equal(question.starAnswerKeyConflict, null)
  }
}
assert.deepEqual(
  review.questions.map((entry) => entry.answerReference),
  [3, 1, 3, 2, 4]
)
assert.deepEqual(
  review.questions.map((entry) => entry.reconstructedAnswer),
  [2, 1, 3, 2, 4]
)

const m3 = part(3)
assert.equal(m3.questions.length, 5)
assert.equal(m3.sourceTextExtracted, true)
assert.ok(m3.passage && !/<img\b/iu.test(m3.passage), 'M3 passage must be readable text without an image.')
assert.deepEqual(
  review.cloze.map((entry) => entry.questionId),
  m3.questions.map((question) => question.id)
)
assert.deepEqual(
  review.cloze.map((entry) => entry.answer),
  [2, 1, 3, 4, 3]
)
for (const [index, entry] of review.cloze.entries()) {
  const question = m3.questions[index]
  assert.equal(question.correctAnswer, entry.answer, `${entry.questionId}: key differs`)
  assert.equal(question.answer, entry.answer, `${entry.questionId}: answer alias differs`)
  const explanation = question.explanation || curated[entry.questionId] || ''
  assert.match(explanation, /Câu hoàn chỉnh:/u, `${entry.questionId}: missing source sentence`)
  assert.match(explanation, /Dịch:/u, `${entry.questionId}: missing translation`)
  for (let option = 1; option <= 4; option++) {
    assert.match(
      explanation,
      new RegExp(`^${option}\\.`, 'mu'),
      `${entry.questionId}: missing option ${option} rationale`
    )
  }
}

console.log(
  'Verified all 23 July 2017 grammar questions: M1 translations and four-choice rationales; five PDF-aligned star orders with one explicit answer-key dispute; and five translated M3 blanks with all-option explanations.'
)
