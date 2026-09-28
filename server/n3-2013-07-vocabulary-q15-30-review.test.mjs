import test from 'node:test'
import assert from 'node:assert/strict'
import fs from 'node:fs'
import { NhaiKanjiService } from './nhaikanji-service.mjs'

const master = JSON.parse(fs.readFileSync('data/jlpt_n3_toan_master.json', 'utf8'))
const curated = JSON.parse(fs.readFileSync('data/jlpt_n3_explanations_curated.json', 'utf8'))
const report = JSON.parse(fs.readFileSync('reports/n3-quality-audit/vocabulary-2013-07-q15-30-review.json', 'utf8'))
const exam = master.find((entry) => entry.id === 'toan-n3-201307-full')
const questions = exam.parts.filter((part) => part.title.includes('Từ vựng')).flatMap((part) => part.questions || [])
const normalizeOption = (value) =>
  String(value || '')
    .normalize('NFKC')
    .replace(/^\s*[1-4][.)．、]\s*/u, '')
    .replace(/^\s*[1-4]\s+/u, '')
    .replace(/\s+/gu, '')

test('July 2013 vocabulary questions 15–30 have translations and four contextual choice notes', () => {
  assert.ok(exam)
  assert.equal(report.examId, exam.id)
  assert.equal(report.questionRange, '15–30')
  assert.equal(report.reviewedQuestionCount, 16)
  assert.equal(report.reviewedChoiceCount, 64)
  assert.equal(report.answerKeysChanged, 0)

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
    assert.doesNotMatch(row.explanation, /từ điển cục bộ|Chưa khớp được mục từ|Hán Việt:/u)
    assert.equal(row.allFourChoicesExplained, true)
    assert.equal(row.promptTranslated, true)
  }
})

test('ambiguous source forms remain disclosed and contextual meanings are accurate', () => {
  const byNumber = new Map(report.rows.map((row) => [row.number, row.explanation]))
  assert.match(byNumber.get(15), /のどがかわく.*khát/u)
  assert.match(byNumber.get(17), /まずいい.*không tự sửa/u)
  assert.match(byNumber.get(23), /きっとり.*không phải dạng từ chuẩn/u)
  assert.match(byNumber.get(28), /たしかめる.*xác nhận/u)
  assert.match(byNumber.get(30), /しゃべる.*nói chuyện/u)
  assert.equal(report.sourceLimits.officialAnswerKeyConfirmed, false)
})

test('the exam service returns the reviewed July 2013 vocabulary explanations', () => {
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
