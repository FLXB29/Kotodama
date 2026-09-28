import test from 'node:test'
import assert from 'node:assert/strict'
import fs from 'node:fs'
import { NhaiKanjiService } from './nhaikanji-service.mjs'

const master = JSON.parse(fs.readFileSync('data/jlpt_n3_toan_master.json', 'utf8'))
const curated = JSON.parse(fs.readFileSync('data/jlpt_n3_explanations_curated.json', 'utf8'))
const report = JSON.parse(fs.readFileSync('reports/n3-quality-audit/vocabulary-2011-12-review.json', 'utf8'))
const exam = master.find((entry) => entry.id === 'toan-n3-201112-full')
const questions = exam.parts.filter((part) => part.title.includes('Từ vựng')).flatMap((part) => part.questions || [])
const normalizeOption = (value) =>
  String(value || '')
    .normalize('NFKC')
    .replace(/^\s*[1-4][.)．、]?\s*/u, '')
    .replace(/\s+/gu, '')

test('December 2011 vocabulary has translated prompts and explanations for all four choices', () => {
  assert.ok(exam)
  assert.equal(report.examId, exam.id)
  assert.equal(report.questionRange, '1–35')
  assert.equal(report.reviewedQuestionCount, 35)
  assert.equal(report.reviewedChoiceCount, 140)
  assert.equal(report.answerKeysChanged, 0)
  assert.equal(report.sourceLimits.originalQuestionSourceCompared, true)
  assert.equal(report.sourceLimits.officialAnswerKeyConfirmed, false)

  for (const row of report.rows) {
    const question = questions.find((entry) => Number(entry.number) === row.number)
    assert.ok(question, 'Missing question ' + row.number)
    assert.equal(Number(question.correctAnswer ?? question.answer), row.answer)
    assert.deepEqual(question.options.map(normalizeOption), row.options.map(normalizeOption))
    assert.equal(question.explanation, row.explanation)
    assert.equal(curated[question.id], row.explanation)
    assert.match(row.explanation, /\nDịch:/u)
    for (let choice = 1; choice <= 4; choice++) {
      assert.match(row.explanation, new RegExp('^' + choice + '\\.', 'mu'), 'Question ' + row.number)
    }
    assert.match(row.explanation, /\nGhi nhớ:/u)
    assert.doesNotMatch(row.explanation, /từ điển cục bộ|Hán Việt:/u)
    assert.equal(row.allFourChoicesExplained, true)
    assert.equal(row.promptTranslated, true)
  }
})

test('the reviewed items explain important vocabulary contrasts precisely', () => {
  const byNumber = new Map(report.rows.map((row) => [row.number, row.explanation]))
  assert.match(byNumber.get(7), /貸しました.*cho mượn/u)
  assert.match(byNumber.get(17), /力を合わせる/u)
  assert.match(byNumber.get(23), /1000個前後/u)
  assert.match(byNumber.get(31), /断つ（たつ/u)
  assert.match(byNumber.get(34), /受け付ける/u)
  assert.match(byNumber.get(35), /とうとう/u)
})

test('the exam service returns the reviewed December 2011 explanations', () => {
  const service = new NhaiKanjiService()
  const served = service.getJlptExamDetail(exam.id)
  const servedQuestions = served.parts
    .filter((part) => part.title.includes('Từ vựng'))
    .flatMap((part) => part.questions || [])

  for (const row of report.rows) {
    const question = servedQuestions.find((entry) => Number(entry.number) === row.number)
    assert.ok(question, 'API omitted question ' + row.number)
    assert.equal(question.explanation, row.explanation)
  }
})
