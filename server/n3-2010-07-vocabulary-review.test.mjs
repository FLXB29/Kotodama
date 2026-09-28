import test from 'node:test'
import assert from 'node:assert/strict'
import fs from 'node:fs'
import { NhaiKanjiService } from './nhaikanji-service.mjs'

const master = JSON.parse(fs.readFileSync('data/jlpt_n3_toan_master.json', 'utf8'))
const curated = JSON.parse(fs.readFileSync('data/jlpt_n3_explanations_curated.json', 'utf8'))
const report = JSON.parse(fs.readFileSync('reports/n3-quality-audit/vocabulary-2010-07-review.json', 'utf8'))
const exam = master.find((entry) => entry.id === 'toan-n3-201007-full')
const questions = exam.parts.filter((part) => part.title.includes('Từ vựng')).flatMap((part) => part.questions || [])
const normalizeOption = (value) =>
  String(value || '')
    .normalize('NFKC')
    .replace(/^\s*[1-4][.)．、]?\s*/u, '')
    .replace(/\s+/gu, '')

test('July 2010 vocabulary has translated prompts and contextual notes for all four choices', () => {
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

test('the reviewed choices keep important readings and contextual distinctions accurate', () => {
  const byNumber = new Map(report.rows.map((row) => [row.number, row.explanation]))
  assert.match(byNumber.get(4), /表す（あらわす）.*示す（しめす）/u)
  assert.match(byNumber.get(11), /追う.*送る.*押す.*折る/u)
  assert.ok(byNumber.get(12).includes('移る') && byNumber.get(12).includes('降る'))
  assert.match(byNumber.get(16), /上品な感じがする/u)
  assert.match(byNumber.get(32), /量る.*数える.*時間を計る.*見積もる/u)
  assert.match(byNumber.get(32), /はかる cũng có nghĩa.*một số cách dùng/u)
  assert.doesNotMatch(byNumber.get(32), /はかるは.*できない|意味しない/u)
  assert.match(byNumber.get(35), /そっくり.*ぴったり.*同じ/u)
})

test('July 2010 M5 wording and answer sequence have an independent source record', () => {
  const checks = report.targetedSourceChecks
  assert.ok(checks)
  assert.equal(checks.questionRange, '31–35 (Mondai 5)')
  assert.equal(checks.officialAnswerKeyConfirmed, false)
  assert.deepEqual(checks.answerSequence, [4, 2, 2, 1, 4])
  assert.equal(checks.questionTranscriptions.length, 2)
  assert.ok(checks.secondaryAnswerKeyUrl.startsWith('https://'))
  assert.ok(checks.dictionarySources.length >= 5)

  for (let number = 31; number <= 35; number++) {
    const question = questions.find((entry) => Number(entry.number) === number)
    assert.ok(question, 'Missing M5 question ' + number)
    assert.equal(Number(question.correctAnswer ?? question.answer), checks.answerSequence[number - 31])
  }
})

test('the source transcription corrections restore missing and duplicated option numbers', () => {
  const q16 = questions.find((question) => Number(question.number) === 16)
  const q24 = questions.find((question) => Number(question.number) === 24)
  assert.deepEqual(q16.options, ['1.関心', '2.気分', '3.考え', '4.感じ'])
  assert.deepEqual(q24.options, ['1.ぴったり', '2.ぐっすり', '3.うっかり', '4.がっかり'])
  assert.equal(q16.correctAnswer, 4)
  assert.equal(q24.correctAnswer, 3)
})

test('M5 option 2 says バター, matching the independent Japanese transcription', () => {
  const q32 = questions.find((question) => Number(question.number) === 32)
  assert.match(q32.options[1], /バター/u)
})

test('the exam service returns the reviewed July 2010 explanations', () => {
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
