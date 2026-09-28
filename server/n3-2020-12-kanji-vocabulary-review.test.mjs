import test from 'node:test'
import assert from 'node:assert/strict'
import fs from 'node:fs'
import { NhaiKanjiService } from './nhaikanji-service.mjs'

const fullExams = JSON.parse(fs.readFileSync(new URL('../data/jlpt_n3_toan_master.json', import.meta.url), 'utf8'))
const sectionExams = JSON.parse(fs.readFileSync(new URL('../data/jlpt_full_master.json', import.meta.url), 'utf8'))
const curated = JSON.parse(fs.readFileSync(new URL('../data/jlpt_n3_explanations_curated.json', import.meta.url), 'utf8'))
const report = JSON.parse(
  fs.readFileSync(new URL('../reports/n3-quality-audit/vocabulary-2020-12-kanji-readings-review.json', import.meta.url), 'utf8'),
)
const fullExam = fullExams.find((exam) => exam.id === 'toan-n3-202012-full')
const sectionExam = sectionExams.find((exam) => exam.id === 'cm2u2xg4300wm134izpbjrysi-vocab')
const mapQuestions = (exam) => new Map(exam.parts.flatMap((part) => part.questions || []).map((question) => [question.number, question]))
const full = mapQuestions(fullExam)
const section = mapQuestions(sectionExam)

test('N3 December 2020 kanji questions 9–13 keep existing answer keys and options', () => {
  assert.deepEqual(report.questionNumbers, [9, 10, 11, 12, 13])
  assert.equal(report.answerKeysChanged, 0)
  for (const row of report.rows) {
    const fullQuestion = full.get(row.number)
    const sectionQuestion = section.get(row.number)
    assert.ok(fullQuestion && sectionQuestion)
    assert.equal(Number(fullQuestion.answer), row.answer)
    assert.equal(Number(fullQuestion.correctAnswer), row.answer)
    assert.equal(Number(sectionQuestion.answer), row.answer)
    assert.deepEqual(sectionQuestion.options.map((option) => option.text.trim()), row.options)
  }
})

test('N3 December 2020 kanji explanations translate each sentence and distinguish all choices', () => {
  for (const row of report.rows) {
    const question = section.get(row.number)
    const explanation = question.explanation || curated[question.id]
    assert.ok(explanation.startsWith(`Đáp án ${row.answer} —`))
    assert.match(explanation, /Dịch:/)
    for (let choice = 1; choice <= 4; choice++) assert.ok(explanation.includes(`\n${choice}. `))
  }
})

test('NhaiKanji service returns the reviewed kanji explanations in the standalone section', () => {
  const service = new NhaiKanjiService()
  const served = mapQuestions(service.getJlptExamDetail('cm2u2xg4300wm134izpbjrysi-vocab'))
  for (const row of report.rows) {
    const question = served.get(row.number)
    assert.ok(question)
    assert.equal(Number(question.answer), row.answer)
    assert.ok(question.explanation.startsWith(`Đáp án ${row.answer} —`))
    assert.match(question.explanation, /Dịch:/)
  }
})
