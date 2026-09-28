import assert from 'node:assert/strict'
import fs from 'node:fs'
import test from 'node:test'
import { normalizeChoiceText } from '../scripts/n3-option-normalization.mjs'
import { NhaiKanjiService } from './nhaikanji-service.mjs'

const master = JSON.parse(fs.readFileSync('data/jlpt_n3_toan_master.json', 'utf8'))
const curated = JSON.parse(fs.readFileSync('data/jlpt_n3_explanations_curated.json', 'utf8'))
const review = JSON.parse(fs.readFileSync('reports/n3-quality-audit/star-explanations-2011-12-review.json', 'utf8'))
const sourceReview = JSON.parse(fs.readFileSync('reports/n3-quality-audit/star-source-2011-12-review.json', 'utf8'))
const exam = master.find((entry) => entry.id === 'toan-n3-201112-full')
const questions = exam.parts.flatMap((part) => part.questions || [])

test('December 2011 star questions now have full-sentence translations and fragment explanations', () => {
  assert.equal(review.questions.length, 5)
  assert.match(review.source.url, /scribd\.com\/document\/1022846440\/2-N3-12-2011/u)
  assert.equal(review.officialAnswerKeyConfirmed, false)
  assert.equal(review.starLayoutVisuallyConfirmed, false)
  assert.equal(review.starSourceVerificationAdded, false)
  assert.match(review.source.limitation, /did not expose a verifiable visual rendering/u)

  for (const row of review.questions) {
    const question = questions.find((item) => item.id === row.questionId)
    assert.ok(question, `${row.questionId} exists`)
    assert.equal(question.explanation, curated[question.id])
    assert.equal(question.explanation, row.explanation)
    assert.ok(row.completedSentence)
    assert.equal(row.translationPresent, true)
    assert.equal(row.allFragmentsExplained, true)
    assert.deepEqual(question.starCorrectOrder, row.order)
    assert.equal(question.starPosition, row.starPositionZeroBased)
    assert.equal(Number(question.correctAnswer ?? question.answer), row.storedAnswer)
    assert.equal(question.starVerificationStatus, 'verified-against-source')
    assert.equal(row.provenanceUnchanged, true)
    for (let choice = 1; choice <= 4; choice += 1) {
      assert.ok(
        question.explanation.includes(`(${choice})`) || new RegExp(`\\b${choice}\\.`, 'u').test(question.explanation),
        `${question.id} explains fragment ${choice}`
      )
    }
  }
})

test('December 2011 source PDF confirms the five option sets and third ★ slots', () => {
  assert.equal(sourceReview.sourcePdf.driveFileId, '1JLd7Jc1RtUIs0FwWcE8mXwuqT-h2WjJj')
  assert.deepEqual(
    sourceReview.sourcePdf.renderedPages.map((page) => page.printedQuestions),
    [
      [14, 15, 16],
      [17, 18],
    ]
  )
  assert.equal(sourceReview.officialAnswerKeyConfirmed, false)
  assert.equal(sourceReview.questions.length, 5)

  for (const row of sourceReview.questions) {
    const question = questions.find((item) => item.id === row.questionId)
    assert.ok(question, `missing ${row.questionId}`)
    assert.deepEqual(
      question.options.map((option, index) => normalizeChoiceText(option, index + 1)),
      row.printedOptions
    )
    assert.deepEqual(question.starCorrectOrder, row.order)
    assert.equal(question.starPosition, 2)
    assert.equal(question.starPositionVerified, true)
    assert.equal(question.starOrderVerified, true)
    assert.equal(question.starVerificationStatus, 'verified-against-source')
    assert.equal(Number(question.correctAnswer ?? question.answer), row.answer)
    assert.ok(question.starVerificationSources?.some((url) => url.endsWith(`#page=${row.viewerPage}`)))
    assert.match(question.starVerificationNote || '', /Visually checked printed question/u)
    assert.equal(row.officialKeyEstablished, false)
  }
})

test('the exam service serves the reviewed December 2011 explanations', () => {
  const served = new NhaiKanjiService().getJlptExamDetail(exam.id)
  const servedQuestions = served.parts.flatMap((part) => part.questions || [])
  for (const row of review.questions) {
    const question = servedQuestions.find((item) => item.id === row.questionId)
    assert.equal(question?.explanation, curated[row.questionId])
  }
})
