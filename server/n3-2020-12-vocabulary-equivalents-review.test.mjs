import test from 'node:test'
import assert from 'node:assert/strict'
import fs from 'node:fs'
import { NhaiKanjiService } from './nhaikanji-service.mjs'

const exams = JSON.parse(fs.readFileSync(new URL('../data/jlpt_n3_toan_master.json', import.meta.url), 'utf8'))
const standaloneExams = JSON.parse(fs.readFileSync(new URL('../data/jlpt_full_master.json', import.meta.url), 'utf8'))
const curated = JSON.parse(
  fs.readFileSync(new URL('../data/jlpt_n3_explanations_curated.json', import.meta.url), 'utf8'),
)
const report = JSON.parse(
  fs.readFileSync(new URL('../reports/n3-quality-audit/vocabulary-2020-12-equivalents-review.json', import.meta.url), 'utf8'),
)
const exam = exams.find((entry) => entry.id === 'toan-n3-202012-full')
const questions = new Map(exam.parts.flatMap((part) => part.questions).map((question) => [question.number, question]))
const answerKey = [4, 3, 1, 1, 2]
const standalone = standaloneExams.find((entry) => entry.id === 'cm2u2xg4300wm134izpbjrysi-vocab')
const standaloneQuestions = new Map(standalone.parts.flatMap((part) => part.questions).map((question) => [question.number, question]))
const stripMarkup = (value) => String(value).replace(/<[^>]*>/gu, '').replace(/[。．.、\s　]/gu, '')

test('N3 December 2020 equivalents review targets the full-mock source and preserves verified answers', () => {
  assert.equal(report.rows.length, 5)
  for (const [index, row] of report.rows.entries()) {
    const question = questions.get(row.number)
    assert.ok(question)
    assert.equal(question.answer, answerKey[index])
    assert.equal(question.correctAnswer, answerKey[index])
    assert.equal(question.answer, row.answer)
    assert.deepEqual(question.options.map((option) => option.replace(/^\s*[1-4][.)．、\s　]*/u, '').trim()), row.options)
    assert.equal(row.answerPreserved, true)
  }
})

test('N3 December 2020 equivalent explanations translate and discuss every choice', () => {
  for (const row of report.rows) {
    const question = questions.get(row.number)
    const explanation = question.explanation || curated[question.id]
    assert.ok(explanation.startsWith(`Đáp án ${row.answer} —`))
    assert.match(explanation, /Dịch:/)
    for (let option = 1; option <= 4; option++) assert.ok(explanation.includes(`\n${option}. `))
  }
})

test('standalone section questions are repaired from the verified 12/2020 full-mock source', () => {
  assert.equal(report.standaloneRepair.idsPreserved, true)
  assert.deepEqual(report.standaloneRepair.questionNumbers, [26, 27, 28, 29, 30])
  assert.equal(report.standaloneRepair.previousAnswerAtQuestion28, 3)
  assert.equal(report.standaloneRepair.verifiedAnswerAtQuestion28, 1)
  assert.match(report.dataNote, /standalone.*unrelated prompts\/options/)
  assert.match(report.dataNote, /question 28 was corrected from 3 to 1/)

  for (const row of report.rows) {
    const question = standaloneQuestions.get(row.number)
    const canonical = questions.get(row.number)
    assert.ok(question)
    assert.ok(canonical)
    assert.equal(question.answer, String(row.answer))
    assert.equal(question.correctAnswer, String(row.answer))
    assert.equal(stripMarkup(question.question), stripMarkup(row.prompt))
    assert.deepEqual(question.options.map((option) => option.text), row.options)
    assert.equal(curated[question.id], row.explanation)
  }
})

test('NhaiKanji service serves the synchronized standalone prompts and explanations', () => {
  const service = new NhaiKanjiService()
  const exam = service.getJlptExamDetail('cm2u2xg4300wm134izpbjrysi-vocab')
  const served = new Map(exam.parts.flatMap((part) => part.questions || []).map((question) => [question.number, question]))

  for (const row of report.rows) {
    const question = served.get(row.number)
    assert.ok(question)
    assert.equal(stripMarkup(question.question), stripMarkup(row.prompt))
    assert.equal(Number(question.answer), row.answer)
    assert.equal(Number(question.correctAnswer), row.answer)
    assert.ok(question.explanation.startsWith(`Đáp án ${row.answer} —`))
    assert.match(question.explanation, /Dịch:/)
    for (let option = 1; option <= 4; option++) assert.ok(question.explanation.includes(`\n${option}. `))
  }
})
