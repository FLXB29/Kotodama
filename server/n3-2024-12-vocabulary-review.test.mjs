import test from 'node:test'
import assert from 'node:assert/strict'
import fs from 'node:fs'
import { NhaiKanjiService } from './nhaikanji-service.mjs'

const master = JSON.parse(fs.readFileSync('data/jlpt_n3_toan_master.json', 'utf8'))
const curated = JSON.parse(fs.readFileSync('data/jlpt_n3_explanations_curated.json', 'utf8'))
const report = JSON.parse(fs.readFileSync('reports/n3-quality-audit/vocabulary-2024-12-review.json', 'utf8'))
const exam = master.find((entry) => entry.id === 'toan-n3-202412-full')
const vocabularyQuestions = exam.parts
  .filter((part) => part.title.includes('Từ vựng'))
  .flatMap((part) => part.questions || [])
const normalizeOption = (value) =>
  String(value || '')
    .normalize('NFKC')
    .replace(/^\s*[1-4][.)．、]\s*/u, '')
    .replace(/^\s*[1-4]\s+/u, '')
    .replace(/\s+/gu, '')

test('December 2024 vocabulary has complete translated explanations for all 35 questions', () => {
  assert.ok(exam)
  assert.equal(report.examId, exam.id)
  assert.equal(report.reviewedQuestionCount, 35)
  assert.equal(report.completedExplanationCount, 35)
  assert.equal(report.newlyWrittenExplanationCount, 1)
  assert.equal(report.answerKeysChanged, 0)
  assert.equal(report.rows.length, 35)
  assert.equal(vocabularyQuestions.length, 35)

  for (const row of report.rows) {
    const question = vocabularyQuestions.find((entry) => Number(entry.number) === row.number)
    assert.ok(question, 'Missing question ' + row.number)
    assert.equal(Number(question.correctAnswer ?? question.answer), row.answer)
    assert.equal(question.answer, question.correctAnswer)
    assert.deepEqual(question.options.map(normalizeOption), row.options.map(normalizeOption))
    assert.equal(question.explanation, row.explanation)
    assert.equal(curated[question.id], row.explanation)
    assert.ok(row.explanation.length > 80, 'Question ' + row.number + ' explanation is too short')
    assert.equal(row.promptTranslated, true, 'Question ' + row.number + ' has no translation signal')
    assert.equal(row.fourChoicesDiscussed, true, 'Question ' + row.number + ' lacks a numbered choice note')
    assert.doesNotMatch(row.explanation, /Chưa khớp được mục từ|từ điển cục bộ|Hán Việt:/u)
  }
})

test('the empty parents question now explains 父母, its reading, translation, and every distractor', () => {
  const question = vocabularyQuestions.find((entry) => Number(entry.number) === 3)
  assert.equal(question.correctAnswer, 2)
  assert.match(question.explanation, /父母」?（ふぼ）.*cha mẹ/u)
  assert.match(question.explanation, /Dịch:.*Lễ tốt nghiệp/u)
  assert.match(question.explanation, /1\. ふば/u)
  assert.match(question.explanation, /2\. ふぼ/u)
  assert.match(question.explanation, /3\. ふうぼ/u)
  assert.match(question.explanation, /4\. ふうば/u)
  assert.equal(report.sourceLimits.officialAnswerKeyConfirmed, false)
  assert.equal(report.sourceLimits.originalQuestionPdfVisuallyInspectedThisPass, false)
})

test('the exam API serves all 35 reviewed explanations', () => {
  const service = new NhaiKanjiService()
  const served = service.getJlptExamDetail(exam.id)
  const servedVocabulary = served.parts
    .filter((part) => part.title.includes('Từ vựng'))
    .flatMap((part) => part.questions || [])

  assert.equal(servedVocabulary.length, 35)
  for (const row of report.rows) {
    const question = servedVocabulary.find((entry) => Number(entry.number) === row.number)
    assert.ok(question, 'API omitted question ' + row.number)
    assert.equal(question.explanation, row.explanation)
  }
})
