import assert from 'node:assert/strict'
import fs from 'node:fs'
import test from 'node:test'
import { NhaiKanjiService } from './nhaikanji-service.mjs'

const master = JSON.parse(fs.readFileSync('data/jlpt_n3_toan_master.json', 'utf8'))
const curated = JSON.parse(fs.readFileSync('data/jlpt_n3_explanations_curated.json', 'utf8'))
const review = JSON.parse(fs.readFileSync('reports/n3-quality-audit/star-source-2011-07-review.json', 'utf8'))
const q15Review = JSON.parse(fs.readFileSync('reports/n3-quality-audit/star-source-2011-07-q15-review.json', 'utf8'))
const exam = master.find((entry) => entry.id === 'toan-n3-201107-full')
const questions = exam.parts.flatMap((part) => part.questions || [])
const normalize = (value) =>
  String(value)
    .replace(/^\s*[1-4][.．、\s]*/u, '')
    .trim()

test('July 2011 original scan review covers the five printed ★ questions', () => {
  assert.equal(review.primarySource.pdfPageNumber, 5)
  assert.equal(review.primarySource.printedPage, 5)
  assert.match(review.primarySource.url, /drive\.google\.com\/file\/d\/19ztuEW7weABIAONSBXaqPuhHUFv4MIR9/u)
  assert.match(review.primarySource.reviewedMethod, /visually inspected/u)
  assert.equal(review.primarySource.limitation.includes('not an official JLPT answer key'), true)
  assert.equal(review.questions.length, 5)
  assert.equal(
    review.questions.every((item) => item.officialAnswerKeyEstablished === false),
    true
  )

  for (const reviewed of review.questions) {
    const question = questions.find((item) => item.id === reviewed.questionId)
    assert.ok(question, `${reviewed.questionId} exists in the full exam`)
    assert.deepEqual(question.starCorrectOrder, reviewed.order)
    assert.equal(question.starPosition, reviewed.starPositionZeroBased)
    assert.equal(Number(question.correctAnswer ?? question.answer), reviewed.answer)
    assert.equal(reviewed.order[reviewed.starPositionZeroBased], reviewed.answer)
    assert.deepEqual(reviewed.printedFragments.map(normalize), question.options.map(normalize))
    assert.equal(question.explanation, curated[question.id])
    assert.equal(question.explanation, reviewed.explanation)
    assert.ok(question.starVerificationSources.includes(review.primarySource.url))
    assert.ok(question.explanation.includes(reviewed.completedSentence))
    assert.equal(reviewed.explanationCoverage.fullSentence, true)
    assert.equal(reviewed.explanationCoverage.translation, true)
    assert.equal(reviewed.explanationCoverage.allFourFragmentsExplained, true)
    assert.equal(reviewed.explanationCoverage.starPositionAndAnswerExplained, true)
    assert.equal(reviewed.explanationCoverage.orderingRationale, true)
    for (let choice = 1; choice <= 4; choice += 1) {
      assert.ok(question.explanation.includes(`(${choice})`))
    }
  }
})

test('the previously reviewed question 15 keeps its independent corroboration', () => {
  const question = questions.find((item) => item.id === q15Review.questionId)
  const reportItem = review.questions.find((item) => item.questionId === q15Review.questionId)
  assert.ok(question)
  assert.equal(q15Review.verifiedStructure.officialAnswerKeyEstablished, false)
  assert.equal(reportItem.completedSentence, q15Review.verifiedStructure.completedSentence)
  assert.ok(question.starVerificationSources.includes(q15Review.questionSource.url))
  assert.ok(question.starVerificationSources.includes(q15Review.corroboratingSource.url))
  assert.equal(
    question.starVerificationSources.some((url) => /N2G\.pdf|\/n2\//iu.test(url)),
    false
  )
})

test('the exam service serves all five reviewed July 2011 explanations', () => {
  const served = new NhaiKanjiService().getJlptExamDetail(exam.id)
  const servedQuestions = served.parts.flatMap((part) => part.questions || [])
  for (const reviewed of review.questions) {
    const question = servedQuestions.find((item) => item.id === reviewed.questionId)
    assert.equal(question?.explanation, curated[reviewed.questionId])
  }
})
