import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import test from 'node:test'

const root = path.resolve('.')
const review = JSON.parse(
  fs.readFileSync(path.join(root, 'reports/n3-quality-audit/star-source-2015-12-review.json'), 'utf8')
)
const exams = JSON.parse(fs.readFileSync(path.join(root, 'data/jlpt_n3_toan_master.json'), 'utf8'))
const exam = exams.find((item) => item.id === review.examId)
const questions = new Map(exam.parts.flatMap((part) => part.questions).map((question) => [question.id, question]))
const normalizeOption = (value) =>
  String(value || '')
    .replace(/^\s*[1-4][.．、\s　]*/u, '')
    .replace(/\s+/gu, '')
const normalizeSentence = (value) => String(value || '').replace(/[\s、。,.，．]/gu, '')

test('December 2015 star questions match the scan, independent study key, and completed sentences', () => {
  assert.equal(review.questions.length, 5)
  for (const entry of review.questions) {
    const question = questions.get(entry.questionId)
    assert.ok(question, `${entry.questionId}: missing question`)
    assert.deepEqual(question.starCorrectOrder, entry.starOrder)
    assert.equal(question.starPosition, entry.starPositionZeroBased)
    assert.equal(question.starCorrectOrder[question.starPosition], entry.starChoice)
    assert.deepEqual(question.starPrompt, { before: entry.promptBefore, after: entry.promptAfter })
    assert.deepEqual(question.options.map(normalizeOption), entry.sourceOptions.map(normalizeOption))
    assert.equal(question.correctAnswer, entry.starChoice)
    assert.equal(question.answer, entry.starChoice)
    assert.ok(question.starOrderVerified)
    assert.ok(question.starPositionVerified)
    assert.ok(question.starVerificationSources.includes(review.sources.questionPaper.url))
    assert.ok(question.starVerificationSources.includes(review.sources.studyAnswerKey.url))
    assert.ok(question.explanation.includes(`Dịch: “${entry.translation}”`))
    for (let choice = 1; choice <= 4; choice++) {
      assert.ok(question.explanation.includes(`${choice}.`), `${entry.questionId}: explanation omits choice ${choice}`)
    }
    const options = question.options.map(normalizeOption)
    const completed = `${question.starPrompt.before}${entry.starOrder.map((choice) => options[choice - 1]).join('')}${question.starPrompt.after}`
    assert.equal(normalizeSentence(completed), normalizeSentence(entry.completedSentence))
  }
})

test('question 18 uses the source-backed grammatical order and explains the prior ordering error', () => {
  const question = questions.get('toan_q_2015_12_53')
  assert.deepEqual(question.starCorrectOrder, [2, 1, 4, 3])
  assert.equal(question.correctAnswer, 4)
  assert.match(question.explanation, /Cách xếp cũ đặt/u)
  assert.match(question.explanation, /どうしてかというと/u)
})
