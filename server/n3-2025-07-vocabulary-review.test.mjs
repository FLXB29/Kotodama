import test from 'node:test'
import assert from 'node:assert/strict'
import fs from 'node:fs'
import { NhaiKanjiService } from './nhaikanji-service.mjs'

const master = JSON.parse(fs.readFileSync('data/jlpt_n3_toan_master.json', 'utf8'))
const curated = JSON.parse(fs.readFileSync('data/jlpt_n3_explanations_curated.json', 'utf8'))
const review = JSON.parse(fs.readFileSync('reports/n3-quality-audit/vocabulary-2025-07-review.json', 'utf8'))
const exam = master.find((entry) => entry.id === 'toan-n3-202507-full')
const vocabularyQuestions = exam.parts
  .filter((part) => part.title.includes('Từ vựng'))
  .flatMap((part) => part.questions || [])
const normalizeOption = (value) =>
  String(value || '')
    .normalize('NFKC')
    .replace(/^\s*[1-4][.)．、]\s*/u, '')
    .replace(/^\s*[1-4]\s+/u, '')
    .replace(/\s+/gu, '')

test('July 2025 vocabulary review covers all 35 questions and 140 choices without changing keys', () => {
  assert.ok(exam)
  assert.equal(review.examId, exam.id)
  assert.equal(review.reviewedQuestionCount, 35)
  assert.equal(review.reviewedChoiceCount, 140)
  assert.equal(review.answerKeysChanged, 0)
  assert.equal(review.rows.length, 35)
  assert.equal(vocabularyQuestions.length, 35)

  for (const row of review.rows) {
    const question = vocabularyQuestions.find((entry) => Number(entry.number) === row.number)
    assert.ok(question, 'Missing question ' + row.number)
    assert.equal(Number(question.correctAnswer ?? question.answer), row.answer)
    assert.equal(question.answer, question.correctAnswer)
    assert.deepEqual(question.options.map(normalizeOption), row.options.map(normalizeOption))
    assert.equal(question.explanation, row.explanation)
    assert.equal(curated[question.id], row.explanation)
    assert.match(row.explanation, new RegExp('^Đáp án ' + row.answer + ' —', 'u'))
    assert.match(row.explanation, /^Dịch(?: sát câu dữ liệu)?:/mu)
    for (let choice = 1; choice <= 4; choice++) {
      assert.match(row.explanation, new RegExp('^' + choice + '\\.', 'mu'), 'Question ' + row.number)
    }
    assert.doesNotMatch(row.explanation, /Chưa khớp được mục từ|từ điển cục bộ|Hán Việt:/u)
    assert.equal(row.allFourChoicesExplained, true)
    assert.equal(row.promptTranslated, true)
  }
})

test('known bad contextual glosses are replaced and unresolved source text stays disclosed', () => {
  const byNumber = new Map(review.rows.map((row) => [row.number, row.explanation]))
  assert.match(byNumber.get(9), /育てたい.*nuôi dưỡng/u)
  assert.match(byNumber.get(10), /胸が燃える[\s\S]*không hợp ngữ cảnh/u)
  assert.match(byNumber.get(11), /森林（しんりん）.*rừng/u)
  assert.match(byNumber.get(17), /リスト: danh sách/u)
  assert.match(byNumber.get(21), /失礼.*thất lễ/u)
  assert.match(byNumber.get(29), /休ました.*thiếu dạng chia chuẩn/u)
  assert.doesNotMatch(byNumber.get(17), /cổ tay/u)
  assert.doesNotMatch(byNumber.get(21), /chào tạm biệt/u)
  assert.equal(review.sourceLimits.officialAnswerKeyConfirmed, false)
  assert.equal(review.sourceLimits.originalQuestionPdfVisuallyInspectedThisPass, false)
})

test('the JLPT exam service returns the reviewed explanations for the live full-exam view', () => {
  const service = new NhaiKanjiService()
  const served = service.getJlptExamDetail(exam.id)
  const servedVocabulary = served.parts
    .filter((part) => part.title.includes('Từ vựng'))
    .flatMap((part) => part.questions || [])

  assert.equal(servedVocabulary.length, 35)
  for (const row of review.rows) {
    const question = servedVocabulary.find((entry) => Number(entry.number) === row.number)
    assert.ok(question, 'API omitted question ' + row.number)
    assert.equal(question.explanation, row.explanation)
  }
})
