import assert from 'node:assert/strict'
import fs from 'node:fs'
import test from 'node:test'
import { NhaiKanjiService } from './nhaikanji-service.mjs'

const readJson = (file) => JSON.parse(fs.readFileSync(file, 'utf8'))

test('N3 December 2020 grammar questions 36–48 have checked keys and complete explanations', () => {
  const exams = readJson('data/jlpt_n3_toan_master.json')
  const curated = readJson('data/jlpt_n3_explanations_curated.json')
  const keyReview = readJson('reports/n3-quality-audit/answer-key-2020-12-grammar.json')
  const explanationReview = readJson('reports/n3-quality-audit/grammar-explanation-2020-12-review.json')
  const exam = exams.find((item) => item.id === 'toan-n3-202012-full')
  assert.ok(exam, 'Missing N3 December 2020 full exam.')

  const questions = exam.parts.flatMap((part) => part.questions || [])
  const grammar = questions.filter((question) => Number(question.number) >= 36 && Number(question.number) <= 48)
  const expectedAnswers = [2, 1, 4, 3, 1, 3, 3, 2, 4, 1, 2, 4, 1]
  assert.equal(grammar.length, expectedAnswers.length)
  assert.deepEqual(
    grammar.map((question) => Number(question.number)),
    Array.from({ length: 13 }, (_, index) => index + 36)
  )
  assert.deepEqual(
    grammar.map((question) => Number(question.correctAnswer ?? question.answer)),
    expectedAnswers
  )
  assert.equal(keyReview.totals.storedMatchesReviewed, 13)
  assert.equal(keyReview.totals.storedMatchesChuyenNgoai, 13)
  assert.equal(keyReview.totals.storedMatchesJpedo, 13)
  assert.equal(explanationReview.answerKeyReview.officialAnswerPdfConfirmed, false)

  for (const question of grammar) {
    const explanation = question.explanation || curated[question.id] || ''
    assert.ok(explanation.length > 200, `${question.id}: explanation is incomplete.`)
    assert.equal(explanation, curated[question.id], `${question.id}: curated and embedded explanations differ.`)
    assert.match(explanation, /Dịch:/u, `${question.id}: missing Vietnamese translation.`)
    for (let option = 1; option <= 4; option++) {
      assert.match(explanation, new RegExp(`^${option}\\.`, 'mu'), `${question.id}: missing option ${option}.`)
    }
  }

  const bookQuestion = grammar.find((question) => Number(question.number) === 43)
  assert.match(bookQuestion.explanation, /絵本/u)
  assert.match(bookQuestion.explanation, /sách tranh/u)
  assert.doesNotMatch(bookQuestion.explanation, /truyện tranh/u)

  const served = new NhaiKanjiService().getJlptExamDetail(exam.id)
  const servedGrammar = served.parts
    .flatMap((part) => part.questions || [])
    .filter((question) => question.number >= 36 && question.number <= 48)
  assert.deepEqual(
    servedGrammar.map((question) => question.explanation),
    grammar.map((question) => question.explanation),
    'API detail must serve the reviewed grammar explanations.'
  )
})
