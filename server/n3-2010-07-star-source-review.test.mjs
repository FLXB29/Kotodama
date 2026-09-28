import assert from 'node:assert/strict'
import fs from 'node:fs'
import test from 'node:test'
import { NhaiKanjiService } from './nhaikanji-service.mjs'

const readJson = (file) => JSON.parse(fs.readFileSync(file, 'utf8'))
const master = readJson('data/jlpt_n3_toan_master.json')
const curated = readJson('data/jlpt_n3_explanations_curated.json')
const report = readJson('reports/n3-quality-audit/star-source-2010-07-review.json')
const exam = master.find((entry) => entry.id === 'toan-n3-201007-full')
const questions = new Map(exam.parts.flatMap((part) => part.questions || []).map((item) => [item.id, item]))

test('July 2010 source review verifies all five printed ★ slots and fully explains each fragment', () => {
  assert.equal(report.sourcePdf.renderedPage, 8)
  assert.equal(report.answerKey.officialKeyEstablished, false)
  assert.deepEqual(
    report.questions.map((entry) => entry.answer),
    [3, 1, 2, 2, 4]
  )

  for (const entry of report.questions) {
    const question = questions.get(entry.questionId)
    assert.ok(question, `missing ${entry.questionId}`)
    assert.deepEqual(question.starPrompt, { before: entry.promptBefore, after: entry.promptAfter })
    assert.deepEqual(question.starCorrectOrder, entry.order)
    assert.equal(question.starPosition, entry.starSlotIndexZeroBased)
    assert.equal(question.correctAnswer, entry.answer)
    assert.equal(question.answer, entry.answer)
    assert.equal(question.starCorrectOrder[question.starPosition], question.correctAnswer)
    assert.equal(question.starOrderVerified, true)
    assert.equal(question.starPositionVerified, true)
    assert.equal(question.starVerificationStatus, 'verified-against-source')
    assert.ok(question.starVerificationSources.includes(report.sourcePdf.url))
    assert.equal(question.explanation, curated[question.id])
    assert.match(question.explanation, /Dịch:/u)
    assert.match(question.explanation, /Thứ tự(?: ghép)?/u)
    assert.match(question.explanation, /ô ★/u)
    for (const choice of [1, 2, 3, 4]) assert.match(question.explanation, new RegExp(`(?:^|\\n)${choice}\\.`, 'u'))
    assert.equal(entry.explanationCoverage.allFragmentsExplainedByRole, true)
    assert.equal(entry.explanationCoverage.completedSentenceAndTranslation, true)
  }
})

test('exam service serves the reviewed July 2010 ★ answers and translations', () => {
  const served = new NhaiKanjiService().getJlptExamDetail(exam.id)
  const servedQuestions = new Map(served.parts.flatMap((part) => part.questions || []).map((item) => [item.id, item]))
  for (const entry of report.questions) {
    const question = servedQuestions.get(entry.questionId)
    assert.ok(question)
    assert.equal(question.correctAnswer, entry.answer)
    assert.equal(question.explanation, curated[entry.questionId])
    assert.match(question.explanation, /Dịch:/u)
  }
})
