import test from 'node:test'
import assert from 'node:assert/strict'
import fs from 'node:fs'
import { NhaiKanjiService } from './nhaikanji-service.mjs'

const master = JSON.parse(fs.readFileSync('data/jlpt_n3_toan_master.json', 'utf8'))
const curated = JSON.parse(fs.readFileSync('data/jlpt_n3_explanations_curated.json', 'utf8'))
const report = JSON.parse(fs.readFileSync('reports/n3-quality-audit/vocabulary-2025-12-review.json', 'utf8'))
const q1To14 = JSON.parse(fs.readFileSync('reports/n3-quality-audit/vocabulary-2025-12-q1-14-review.json', 'utf8'))
const exam = master.find((entry) => entry.id === 'toan-n3-202512-full')
const questions = exam.parts.filter((part) => part.title.includes('Từ vựng')).flatMap((part) => part.questions || [])
const normalizeOption = (value) =>
  String(value || '')
    .normalize('NFKC')
    .replace(/^\s*[1-4][.)．、]\s*/u, '')
    .replace(/^\s*[1-4]\s+/u, '')
    .replace(/\s+/gu, '')

test('December 2025 vocabulary has explanations for all 35 questions with no automatic gloss blocks', () => {
  assert.ok(exam)
  assert.equal(report.examId, exam.id)
  assert.equal(report.reviewedQuestionCount, 35)
  assert.equal(report.completeExplanationCount, 35)
  assert.equal(report.answerKeysChanged, 0)
  assert.equal(report.rows.length, 35)
  assert.equal(questions.length, 35)
  assert.equal(q1To14.reviewedQuestionCount, 14)

  for (const row of report.rows) {
    const question = questions.find((entry) => Number(entry.number) === row.number)
    assert.ok(question, 'Missing question ' + row.number)
    assert.equal(Number(question.correctAnswer ?? question.answer), row.answer)
    assert.deepEqual(question.options.map(normalizeOption), row.options.map(normalizeOption))
    assert.equal(question.explanation, row.explanation)
    assert.equal(curated[question.id], row.explanation)
    assert.ok(question.explanation.length > 80, 'Question ' + row.number + ' explanation is too short')
    assert.equal(row.promptTranslated, true, 'Question ' + row.number + ' lacks a Vietnamese translation signal')
    assert.equal(row.fourChoiceDiscussionPresent, true)
    assert.doesNotMatch(question.explanation, /từ điển cục bộ|Chưa khớp được mục từ|Hán Việt:/u)
  }
})

test('reviewed choice groups retain contextual meanings and usage distinctions', () => {
  const byNumber = new Map(questions.map((question) => [Number(question.number), question.explanation]))
  assert.match(byNumber.get(16), /しかたない.*không còn cách nào khác/u)
  assert.match(byNumber.get(23), /ぺこぺこ.*đói/u)
  assert.match(byNumber.get(31), /握る.*nắm/u)
  assert.match(byNumber.get(35), /変化.*thay đổi/u)
  assert.equal(report.sourceLimits.officialAnswerKeyConfirmed, false)
})

test('the exam API serves all December 2025 vocabulary explanations', () => {
  const service = new NhaiKanjiService()
  const served = service.getJlptExamDetail(exam.id)
  const servedQuestions = served.parts
    .filter((part) => part.title.includes('Từ vựng'))
    .flatMap((part) => part.questions || [])

  assert.equal(servedQuestions.length, 35)
  for (const row of report.rows) {
    const question = servedQuestions.find((entry) => Number(entry.number) === row.number)
    assert.ok(question, 'API omitted question ' + row.number)
    assert.equal(question.explanation, row.explanation)
  }
})
