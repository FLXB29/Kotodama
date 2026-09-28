import test from 'node:test'
import assert from 'node:assert/strict'
import fs from 'node:fs'
import { NhaiKanjiService } from './nhaikanji-service.mjs'

const master = JSON.parse(fs.readFileSync('data/jlpt_n3_toan_master.json', 'utf8'))
const curated = JSON.parse(fs.readFileSync('data/jlpt_n3_explanations_curated.json', 'utf8'))
const report = JSON.parse(fs.readFileSync('reports/n3-quality-audit/vocabulary-2013-07-q9-14-review.json', 'utf8'))
const exam = master.find((entry) => entry.id === 'toan-n3-201307-full')
const vocabularyQuestions = exam.parts
  .filter((part) => part.title.includes('Từ vựng'))
  .flatMap((part) => part.questions || [])
const normalizeOption = (value) =>
  String(value || '')
    .normalize('NFKC')
    .replace(/^\s*[1-4][.)．、]\s*/u, '')
    .replace(/^\s*[1-4]\s+/u, '')
    .replace(/\s+/gu, '')

test('July 2013 Kanji vocabulary questions 9–14 explain all 24 choices without changing keys', () => {
  assert.ok(exam)
  assert.equal(report.examId, exam.id)
  assert.equal(report.questionRange, '9–14')
  assert.equal(report.reviewedQuestionCount, 6)
  assert.equal(report.reviewedChoiceCount, 24)
  assert.equal(report.answerKeysChanged, 0)

  for (const row of report.rows) {
    const question = vocabularyQuestions.find((entry) => Number(entry.number) === row.number)
    assert.ok(question, 'Missing question ' + row.number)
    assert.equal(Number(question.correctAnswer ?? question.answer), row.answer)
    assert.deepEqual(question.options.map(normalizeOption), row.options.map(normalizeOption))
    assert.equal(question.explanation, row.explanation)
    assert.equal(curated[question.id], row.explanation)
    assert.match(row.explanation, /^Dịch:/mu)
    for (let choice = 1; choice <= 4; choice++) {
      assert.match(row.explanation, new RegExp('^' + choice + '\\.', 'mu'))
    }
  }
})

test('common misleading dictionary readings are replaced by in-context explanations', () => {
  const byNumber = new Map(report.rows.map((row) => [row.number, row.explanation]))
  assert.match(byNumber.get(9), /信じて.*tin/u)
  assert.match(byNumber.get(10), /遅く.*khuya/u)
  assert.match(byNumber.get(11), /容器.*đồ đựng/u)
  assert.match(byNumber.get(12), /疲れました.*mệt/u)
  assert.match(byNumber.get(13), /重ねて.*xếp chồng/u)
  assert.match(byNumber.get(14), /残業.*làm thêm giờ/u)
  assert.equal(report.sourceLimits.officialAnswerKeyConfirmed, false)
})

test('the exam API returns the reviewed Kanji vocabulary explanations', () => {
  const service = new NhaiKanjiService()
  const served = service.getJlptExamDetail(exam.id)
  const questions = served.parts
    .filter((part) => part.title.includes('Từ vựng'))
    .flatMap((part) => part.questions || [])

  for (const row of report.rows) {
    const question = questions.find((entry) => Number(entry.number) === row.number)
    assert.ok(question)
    assert.equal(question.explanation, row.explanation)
  }
})
