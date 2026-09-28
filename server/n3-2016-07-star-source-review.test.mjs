import assert from 'node:assert/strict'
import fs from 'node:fs'
import test from 'node:test'
import { NhaiKanjiService } from './nhaikanji-service.mjs'

const readJson = (file) => JSON.parse(fs.readFileSync(file, 'utf8'))
const mockExams = readJson('data/jlpt_n3_toan_master.json')
const sectionExams = readJson('data/jlpt_full_master.json')
const report = readJson('reports/n3-quality-audit/star-source-2016-07-review.json')
const mockExam = mockExams.find((item) => item.id === 'toan-n3-201607-full')
const sectionExam = sectionExams.find((item) => item.id === 'cm2u2wh2e005t134ip8znt3dd-grammar-reading')
const allQuestions = (exam) => exam.parts.flatMap((part) => part.questions || [])

test('July 2016 grammar ★ answers and star positions match the PDF and two secondary keys', () => {
  assert.ok(mockExam)
  assert.ok(sectionExam)
  assert.equal(report.officialKeyEstablished, false)
  assert.deepEqual(
    report.answerReferences.map((reference) => reference.answers),
    [
      [1, 3, 4, 1, 2],
      [1, 3, 4, 1, 2],
    ]
  )
  assert.deepEqual(
    report.corrections.map((item) => [item.printedQuestion, item.previousAnswer, item.answer]),
    [
      [14, 4, 1],
      [15, 2, 3],
      [18, 1, 2],
    ]
  )
  assert.deepEqual(
    report.sourcePdf.renderedPages.map((page) => page.printedQuestions),
    [[14, 15, 16, 17], [18]]
  )
  assert.match(report.sourceTextCorrection, /なったいる/u)

  const mockByNumber = new Map(allQuestions(mockExam).map((question) => [Number(question.number), question]))
  const sectionByNumber = new Map(allQuestions(sectionExam).map((question) => [Number(question.number), question]))
  assert.equal(report.questions.length, 5)

  for (const item of report.questions) {
    const mockQuestion = mockByNumber.get(item.internalQuestionNumber)
    const sectionQuestion = sectionByNumber.get(item.internalQuestionNumber)
    assert.ok(mockQuestion, `Missing full-mock question ${item.printedQuestion}.`)
    assert.ok(sectionQuestion, `Missing standalone question ${item.printedQuestion}.`)
    assert.equal(Number(mockQuestion.correctAnswer), item.answer)
    assert.equal(Number(sectionQuestion.correctAnswer), item.answer)
    assert.deepEqual(mockQuestion.starCorrectOrder, item.order)
    assert.equal(mockQuestion.starPosition, item.starPosition)
    assert.deepEqual(sectionQuestion.starCorrectOrder, item.order)
    assert.equal(sectionQuestion.starPosition, item.starPosition)
    assert.equal(item.order[item.starPosition], item.answer)
    assert.equal(mockQuestion.starVerificationStatus, 'verified-against-source')
    assert.equal(sectionQuestion.starVerificationStatus, 'verified-against-source')
    assert.equal(mockQuestion.starOrderVerified, true)
    assert.equal(mockQuestion.starPositionVerified, true)
    assert.equal(mockQuestion.explanation, sectionQuestion.explanation)
    assert.equal(mockQuestion.explanation, readJson('data/jlpt_n3_explanations_curated.json')[mockQuestion.id])
    assert.ok(mockQuestion.explanation.includes(item.completedSentence))
    assert.ok(mockQuestion.explanation.includes(item.vietnameseTranslation))
    assert.ok(mockQuestion.starVerificationSources.includes(report.sourcePdf.url))
    assert.ok(mockQuestion.starVerificationSources.includes(report.answerReferences[0].url))
    assert.ok(mockQuestion.starVerificationSources.includes(report.answerReferences[1].url))
    assert.equal(sectionQuestion.script, item.displayedSolutionScript)
    assert.match(sectionQuestion.script, /<u>[^<]+<\/u>/u)
    assert.equal(item.explanationCoverage.answerIdentified, true)
    assert.equal(item.explanationCoverage.allFourOptionsAddressed, true)
    assert.equal(item.explanationCoverage.fullSentenceAndTranslation, true)
    assert.equal(item.explanationCoverage.fragmentPlacementExplained, true)
  }
})

test('the NhaiKanji service serves the corrected answers and explanations in both views', () => {
  const service = new NhaiKanjiService()
  const views = [service.getJlptExamDetail(mockExam.id), service.getJlptExamDetail(sectionExam.id)]

  for (const view of views) {
    const byNumber = new Map(
      view.parts.flatMap((part) => part.questions || []).map((question) => [Number(question.number), question])
    )
    for (const item of report.questions) {
      const question = byNumber.get(item.internalQuestionNumber)
      assert.ok(question?.explanation, `${view.title}: question ${item.printedQuestion} is explained.`)
      assert.equal(Number(question.correctAnswer ?? question.answer), item.answer)
      assert.match(question.explanation, /Dịch:/u)
    }
  }
})
