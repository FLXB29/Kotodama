import test from 'node:test'
import assert from 'node:assert/strict'
import fs from 'node:fs'
import { NhaiKanjiService } from './nhaikanji-service.mjs'

const master = JSON.parse(fs.readFileSync('data/jlpt_n3_toan_master.json', 'utf8'))
const curated = JSON.parse(fs.readFileSync('data/jlpt_n3_explanations_curated.json', 'utf8'))
const report = JSON.parse(fs.readFileSync('reports/n3-quality-audit/vocabulary-2025-12-q1-14-review.json', 'utf8'))
const exam = master.find((entry) => entry.id === 'toan-n3-202512-full')
const vocabularyQuestions = exam.parts
  .filter((part) => part.title.includes('Từ vựng'))
  .flatMap((part) => part.questions || [])
const normalizeOption = (value) =>
  String(value || '')
    .normalize('NFKC')
    .replace(/^\s*[1-4][.)．、]\s*/u, '')
    .replace(/^\s*[1-4]\s+/u, '')
    .replace(/\s+/gu, '')

test('December 2025 vocabulary review covers questions 1–14 and 56 contextual choice notes', () => {
  assert.ok(exam)
  assert.equal(report.examId, exam.id)
  assert.equal(report.questionRange, '1–14')
  assert.equal(report.reviewedQuestionCount, 14)
  assert.equal(report.reviewedChoiceCount, 56)
  assert.equal(report.answerKeysChanged, 0)
  assert.equal(report.rows.length, 14)
  assert.equal(vocabularyQuestions.length, 35)

  for (const row of report.rows) {
    const question = vocabularyQuestions.find((entry) => Number(entry.number) === row.number)
    assert.ok(question, 'Missing question ' + row.number)
    assert.equal(Number(question.correctAnswer ?? question.answer), row.answer)
    assert.equal(question.answer, question.correctAnswer)
    assert.deepEqual(question.options.map(normalizeOption), row.options.map(normalizeOption))
    assert.equal(question.explanation, row.explanation)
    assert.equal(curated[question.id], row.explanation)
    assert.match(row.explanation, new RegExp('^Đáp án ' + row.answer + ' —', 'u'))
    assert.match(row.explanation, /^Dịch:/mu)
    for (let choice = 1; choice <= 4; choice++) {
      assert.match(row.explanation, new RegExp('^' + choice + '\\.', 'mu'), 'Question ' + row.number)
    }
    assert.doesNotMatch(row.explanation, /Chưa khớp được mục từ|từ điển cục bộ|Hán Việt:/u)
    assert.equal(row.allFourChoicesExplained, true)
    assert.equal(row.promptTranslated, true)
  }
})

test('contextual readings and malformed distractors are distinguished without silently rewriting source choices', () => {
  const byNumber = new Map(report.rows.map((row) => [row.number, row.explanation]))
  assert.match(byNumber.get(5), /終電.*chuyến tàu cuối/u)
  assert.match(byNumber.get(9), /辺り.*vùng lân cận/u)
  assert.match(byNumber.get(11), /細りました.*ほそりました/u)
  assert.match(byNumber.get(12), /歩道.*vỉa hè/u)
  assert.match(byNumber.get(13), /押つ.*押す/u)
  assert.match(byNumber.get(14), /性格.*tính cách/u)
  assert.equal(report.sourceLimits.officialAnswerKeyConfirmed, false)
  assert.equal(report.sourceLimits.originalQuestionPdfVisuallyInspectedThisPass, false)
})

test('exam service returns the reviewed December 2025 explanations', () => {
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
