import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'

const root = path.resolve('.')
const reviewPath = path.join(root, 'reports/n3-quality-audit/star-source-2013-12-review.json')
const masterPath = path.join(root, 'data/jlpt_n3_toan_master.json')
const review = JSON.parse(fs.readFileSync(reviewPath, 'utf8'))
const exams = JSON.parse(fs.readFileSync(masterPath, 'utf8'))
const exam = exams.find((item) => item.id === 'toan-n3-201312-full')
assert.ok(exam, 'Missing JLPT N3 December 2013 exam')

const questions = new Map(exam.parts.flatMap((part) => part.questions).map((question) => [question.id, question]))
const normalizeOption = (value) =>
  String(value || '')
    .replace(/^\s*[1-4１-４][.．、\s　]*/u, '')
    .replace(/\s+/gu, '')
const normalizeSentence = (value) => String(value || '').replace(/[\s、。,.，．]/gu, '')

assert.equal(review.questions.length, 5, 'Expected the five printed star questions 14–18')
for (const entry of review.questions) {
  const question = questions.get(entry.questionId)
  assert.ok(question, `${entry.questionId}: missing question`)
  assert.deepEqual(
    question.starPrompt,
    { before: entry.promptBefore, after: entry.promptAfter },
    `${entry.questionId}: prompt differs`
  )
  assert.equal(entry.sourceOptions.length, 4, `${entry.questionId}: expected four source options`)
  assert.equal(question.options.length, 4, `${entry.questionId}: expected four app options`)

  const displayOptions = entry.displayOptions || entry.sourceOptions
  assert.deepEqual(
    question.options.map(normalizeOption),
    displayOptions.map(normalizeOption),
    `${entry.questionId}: displayed option text differs from reviewed source transcription`
  )
  if (entry.displayOptions) {
    assert.ok(entry.sourceTextNote, `${entry.questionId}: normalized source text needs an explanation`)
  }

  assert.deepEqual(question.starCorrectOrder, entry.order, `${entry.questionId}: piece order differs`)
  assert.equal(question.starPosition, entry.starSlotIndex, `${entry.questionId}: star slot differs`)
  assert.equal(question.correctAnswer, entry.answer, `${entry.questionId}: correctAnswer differs`)
  assert.equal(question.answer, entry.answer, `${entry.questionId}: answer differs`)
  assert.equal(entry.order[entry.starSlotIndex], entry.answer, `${entry.questionId}: answer is not in the star slot`)
  assert.equal(question.starOrderVerified, true, `${entry.questionId}: order lacks verified status`)
  assert.equal(question.starPositionVerified, true, `${entry.questionId}: star slot lacks verified status`)
  assert.ok(question.starVerificationSources?.some((source) => source.includes('4. N3 12-2013.pdf')))

  const fragments = displayOptions.map(normalizeOption)
  const completedFromMaster = normalizeSentence(
    `${question.starPrompt.before}${question.starCorrectOrder.map((choice) => fragments[choice - 1]).join('')}${question.starPrompt.after}`
  )
  assert.equal(
    completedFromMaster,
    normalizeSentence(entry.completedSentence),
    `${entry.questionId}: completed sentence differs`
  )
  assert.ok(question.explanation?.includes('Dịch:'), `${entry.questionId}: explanation lacks a translation`)
}

console.log(
  `Verified source transcription, four options, order, star slot, answer, and explanation for ${review.questions.length} JLPT N3 12/2013 star questions.`
)
