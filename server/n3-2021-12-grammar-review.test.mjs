import assert from 'node:assert/strict'
import fs from 'node:fs'
import test from 'node:test'
import { NhaiKanjiService } from './nhaikanji-service.mjs'

const readJson = (file) => JSON.parse(fs.readFileSync(file, 'utf8'))
const allQuestions = (exam) => exam.parts.flatMap((part) => part.questions || [])
const plainText = (value) =>
  String(value || '')
    .replace(/<[^>]*>/gu, ' ')
    .replace(/\s+/gu, ' ')
    .trim()

test('N3 December 2021 grammar questions 36–48 have verified keys and complete explanations in both exam views', () => {
  const fullMockMaster = readJson('data/jlpt_n3_toan_master.json')
  const standaloneMaster = readJson('data/jlpt_full_master.json')
  const curated = readJson('data/jlpt_n3_explanations_curated.json')
  const keyReview = readJson('reports/n3-quality-audit/answer-key-2021-12-grammar.json')
  const explanationReview = readJson('reports/n3-quality-audit/grammar-explanation-2021-12-review.json')
  const fullMock = fullMockMaster.find((exam) => exam.id === 'toan-n3-202112-full')
  const standalone = standaloneMaster.find((exam) => exam.id === 'cm2u2xosv0138134ib0bvpy32-grammar-reading')
  assert.ok(fullMock, 'Missing December 2021 full mock.')
  assert.ok(standalone, 'Missing December 2021 standalone grammar-reading exam.')

  const fullMockQuestions = fullMock.parts
    .filter((part) => part.title.includes('Ngữ pháp') && part.title.includes('Mondai 1'))
    .flatMap((part) => part.questions || [])
    .sort((left, right) => Number(left.number) - Number(right.number))
  const standaloneQuestions = standalone.parts
    .flatMap((part) => part.questions || [])
    .filter((question) => Number(question.number) >= 36 && Number(question.number) <= 48)
    .sort((left, right) => Number(left.number) - Number(right.number))
  const expectedAnswers = [3, 4, 2, 4, 1, 2, 4, 1, 2, 2, 4, 1, 4]
  const questionNumbers = Array.from({ length: 13 }, (_, index) => index + 36)
  assert.deepEqual(
    fullMockQuestions.map((question) => Number(question.number)),
    questionNumbers
  )
  assert.deepEqual(
    standaloneQuestions.map((question) => Number(question.number)),
    questionNumbers
  )
  assert.deepEqual(
    fullMockQuestions.map((question) => Number(question.correctAnswer ?? question.answer)),
    expectedAnswers
  )
  assert.deepEqual(
    standaloneQuestions.map((question) => Number(question.correctAnswer ?? question.answer)),
    expectedAnswers
  )
  assert.equal(keyReview.totals.fullMockMatchesUserSheet, 13)
  assert.equal(keyReview.totals.standaloneMatchesUserSheet, 13)
  assert.equal(keyReview.officialAnswerPdfConfirmed, false)
  assert.equal(explanationReview.sourceReview.answerSheetPdfPage, 23)
  assert.equal(explanationReview.sourceReview.storedAnswersMatchUserProvidedSheet, 13)
  assert.equal(explanationReview.sourceReview.officialAnswerPdfConfirmed, false)

  for (let index = 0; index < fullMockQuestions.length; index++) {
    const fullMockQuestion = fullMockQuestions[index]
    const standaloneQuestion = standaloneQuestions[index]
    const explanation = fullMockQuestion.explanation || curated[fullMockQuestion.id] || ''
    assert.ok(explanation.length > 200, `${fullMockQuestion.number}: explanation is incomplete.`)
    assert.equal(explanation, curated[fullMockQuestion.id], `${fullMockQuestion.id}: curated text differs.`)
    assert.equal(
      standaloneQuestion.explanation,
      explanation,
      `${fullMockQuestion.number}: views must share the explanation.`
    )
    assert.match(explanation, /Dịch:/u, `${fullMockQuestion.number}: missing Vietnamese translation.`)
    for (let choice = 1; choice <= 4; choice++) {
      assert.match(
        explanation,
        new RegExp(`^${choice}\\.`, 'mu'),
        `${fullMockQuestion.number}: missing choice ${choice}.`
      )
    }
  }

  const q41 = fullMockQuestions.find((question) => Number(question.number) === 41)
  const q42 = fullMockQuestions.find((question) => Number(question.number) === 42)
  const q46 = fullMockQuestions.find((question) => Number(question.number) === 46)
  assert.match(String(q41.options[1]), /使い/u)
  assert.match(plainText(q41.question), /続けている/u)
  assert.match(q41.explanation, /PDF in 「使い続いている」/u)
  assert.match(q41.explanation, /使い続けている/u)
  assert.match(q42.explanation, /không phải cấu trúc 「こと」 luôn sai/u)
  assert.match(q46.explanation, /「でしょう」 cũng có thể diễn tả phỏng đoán/u)
  assert.match(q46.explanation, /độ mơ hồ ngữ dụng/u)
  assert.equal(explanationReview.explanationCriteria.allFourChoicesExplained, true)
  assert.equal(explanationReview.explanationCriteria.fullVietnameseTranslation, true)
  assert.equal(explanationReview.explanationCriteria.bothExamViewsHaveSameExplanation, true)

  const service = new NhaiKanjiService()
  for (const exam of [fullMock, standalone]) {
    const served = service.getJlptExamDetail(exam.id)
    const servedQuestions = allQuestions(served)
      .filter((question) => Number(question.number) >= 36 && Number(question.number) <= 48)
      .sort((left, right) => Number(left.number) - Number(right.number))
    assert.deepEqual(
      servedQuestions.map((question) => question.explanation),
      fullMockQuestions.map((question) => question.explanation),
      `${exam.id}: API detail must serve the reviewed explanations.`
    )
  }
})
