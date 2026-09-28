import assert from 'node:assert/strict'
import fs from 'node:fs'
import test from 'node:test'
import { NhaiKanjiService } from './nhaikanji-service.mjs'

const readJson = (file) => JSON.parse(fs.readFileSync(file, 'utf8'))
const master = readJson('data/jlpt_n3_toan_master.json')
const curated = readJson('data/jlpt_n3_explanations_curated.json')
const report = readJson('reports/n3-quality-audit/star-source-2012-07-review.json')
const exam = master.find((item) => item.id === 'toan-n3-201207-full')
const questions = new Map(exam.parts.flatMap((part) => part.questions || []).map((item) => [item.number, item]))

test('July 2012 grammar ★ answers, source positions, fragments, and explanations are reviewed', () => {
  assert.equal(report.officialKeyEstablished, false)
  assert.equal(report.answerReference.answers.join(','), '2,1,4,2,3')
  assert.equal(report.sourcePdf.renderedPage, 5)

  for (const reviewed of report.questions) {
    const question = questions.get(reviewed.internalQuestionNumber)
    assert.ok(question, `question ${reviewed.internalQuestionNumber} should exist`)
    assert.equal(question.correctAnswer, reviewed.answer)
    assert.equal(question.answer, reviewed.answer)
    assert.deepEqual(question.starCorrectOrder, reviewed.order)
    assert.equal(question.starPosition, reviewed.starPosition)
    assert.equal(question.starCorrectOrder[question.starPosition], question.correctAnswer)
    assert.equal(question.starOrderVerified, true)
    assert.equal(question.starPositionVerified, true)
    assert.ok(question.starVerificationSources.includes(report.sourcePdf.url + '#page=5'))
    assert.equal(question.explanation, curated[question.id])
    assert.match(question.explanation, /Dịch:/u)
    assert.match(question.explanation, /Dấu ★/u)
    for (const choice of [1, 2, 3, 4]) assert.match(question.explanation, new RegExp(`(?:^|\\n)${choice}\\.`, 'u'))
    assert.ok(reviewed.explanationCoverage.allFourOptionsAddressed)
    assert.ok(reviewed.explanationCoverage.fullSentenceAndTranslation)
  }

  assert.equal(questions.get(49).answer, 2)
  assert.equal(questions.get(49).starPosition, 1)
  assert.equal(questions.get(53).answer, 3)
  assert.equal(questions.get(53).starPosition, 2)
})

test('the NhaiKanji service returns the reviewed July 2012 answers and translated explanations', () => {
  const service = new NhaiKanjiService()
  const servedExam = service.getJlptExamDetail('toan-n3-201207-full')
  assert.ok(servedExam)
  const servedQuestions = new Map(
    servedExam.parts.flatMap((part) => part.questions || []).map((item) => [item.number, item])
  )

  for (const number of [49, 50, 51, 52, 53]) {
    const question = servedQuestions.get(number)
    assert.ok(question)
    assert.match(question.explanation, /Dịch:/u)
    assert.match(question.explanation, /Dấu ★/u)
  }
  assert.equal(servedQuestions.get(49).correctAnswer, 2)
  assert.equal(servedQuestions.get(53).correctAnswer, 3)
})
