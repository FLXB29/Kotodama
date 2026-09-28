import test from 'node:test'
import assert from 'node:assert/strict'
import fs from 'node:fs'
import { NhaiKanjiService } from './nhaikanji-service.mjs'

const master = JSON.parse(fs.readFileSync('data/jlpt_n3_toan_master.json', 'utf8'))
const curated = JSON.parse(fs.readFileSync('data/jlpt_n3_explanations_curated.json', 'utf8'))
const report = JSON.parse(fs.readFileSync('reports/n3-quality-audit/vocabulary-2011-07-review.json', 'utf8'))
const exam = master.find((entry) => entry.id === 'toan-n3-201107-full')
const questions = exam.parts.filter((part) => part.title.includes('Từ vựng')).flatMap((part) => part.questions || [])
const normalizeOption = (value) =>
  String(value || '')
    .normalize('NFKC')
    .replace(/^\s*[1-4][.)．、]\s*/u, '')
    .replace(/^\s*[1-4]\s+/u, '')
    .replace(/\s+/gu, '')

test('July 2011 vocabulary has translated prompts and notes for all four choices', () => {
  assert.ok(exam)
  assert.equal(report.examId, exam.id)
  assert.equal(report.questionRange, '1–35')
  assert.equal(report.reviewedQuestionCount, 35)
  assert.equal(report.reviewedChoiceCount, 140)
  assert.equal(report.answerKeysChanged, 0)

  for (const row of report.rows) {
    const question = questions.find((entry) => Number(entry.number) === row.number)
    assert.ok(question, 'Missing question ' + row.number)
    assert.equal(Number(question.correctAnswer ?? question.answer), row.answer)
    assert.deepEqual(question.options.map(normalizeOption), row.options.map(normalizeOption))
    assert.equal(question.explanation, row.explanation)
    assert.equal(curated[question.id], row.explanation)
    assert.match(row.explanation, /\nDịch(?: câu đúng)?:/u)
    for (let choice = 1; choice <= 4; choice++) {
      assert.match(row.explanation, new RegExp('^' + choice + '\\.', 'mu'), 'Question ' + row.number)
    }
    assert.doesNotMatch(row.explanation, /từ điển cục bộ|Hán Việt:/u)
    assert.equal(row.allFourChoicesExplained, true)
    assert.equal(row.promptTranslated, true)
  }
})

test('the reviewed vocabulary distinguishes readings, collocations, and usage contexts', () => {
  const byNumber = new Map(report.rows.map((row) => [row.number, row.explanation]))
  assert.match(byNumber.get(14), /多量.*たりょう/u)
  assert.match(byNumber.get(16), /ぶらぶら.*đi loanh quanh/u)
  assert.match(byNumber.get(20), /アメリカ産.*nguồn gốc/u)
  assert.match(byNumber.get(24), /のどがからから.*khô khốc/u)
  assert.match(byNumber.get(31), /có thể hình dung.*ngã lên giường/u)
  assert.match(byNumber.get(33), /景色を見送る.*có thể hiểu/u)
  assert.match(byNumber.get(35), /正直な話.*cụm có thật/u)
  assert.match(byNumber.get(35), /không phải sai ngữ pháp tuyệt đối/u)
  assert.equal(report.sourceLimits.officialAnswerKeyConfirmed, false)
  assert.equal(report.sourceLimits.secondaryAnswerKeyConfirmed, true)
  assert.equal(report.sourceLimits.originalQuestionPdfVisuallyInspectedThisPass, false)
  assert.equal(report.linguisticCautions.length, 3)
  assert.deepEqual(
    report.rows.filter((row) => row.number >= 31).map((row) => row.answer),
    [4, 1, 4, 1, 1]
  )
})

test('the exam service returns the reviewed July 2011 vocabulary explanations', () => {
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
