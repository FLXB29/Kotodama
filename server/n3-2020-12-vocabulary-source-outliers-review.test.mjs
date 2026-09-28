import test from 'node:test'
import assert from 'node:assert/strict'
import fs from 'node:fs'
import { NhaiKanjiService } from './nhaikanji-service.mjs'

const fullExams = JSON.parse(fs.readFileSync(new URL('../data/jlpt_n3_toan_master.json', import.meta.url), 'utf8'))
const sectionExams = JSON.parse(fs.readFileSync(new URL('../data/jlpt_full_master.json', import.meta.url), 'utf8'))
const curated = JSON.parse(fs.readFileSync(new URL('../data/jlpt_n3_explanations_curated.json', import.meta.url), 'utf8'))
const report = JSON.parse(
  fs.readFileSync(new URL('../reports/n3-quality-audit/vocabulary-2020-12-source-outliers-review.json', import.meta.url), 'utf8'),
)
const fullExam = fullExams.find((exam) => exam.id === 'toan-n3-202012-full')
const sectionExam = sectionExams.find((exam) => exam.id === 'cm2u2xg4300wm134izpbjrysi-vocab')
const byNumber = (exam) => new Map(exam.parts.flatMap((part) => part.questions || []).map((question) => [question.number, question]))
const full = byNumber(fullExam)
const section = byNumber(sectionExam)
const stripMarkup = (value) => String(value).replace(/<[^>]*>/gu, '').replace(/[。．.、\s　]/gu, '')

test('N3 December 2020 source transcription fixes preserve intended keys and option ordering', () => {
  assert.deepEqual(report.questionNumbers, [1, 14, 19, 31, 32])
  assert.equal(full.get(1).options[3], '4.ちょさつ')
  assert.equal(section.get(1).answer, '1')
  assert.equal(full.get(14).answer, 4)
  assert.equal(full.get(14).correctAnswer, 4)
  assert.deepEqual(full.get(14).options, ['1.復推', '2.復雑', '3.複推', '4.複雑'])
  assert.equal(section.get(14).answer, '4')
  assert.equal(section.get(14).options[3].text, '複雑')
  assert.equal(section.get(19).answer, '3')
  assert.match(section.get(19).question, /この靴は（ ）です/u)
  assert.doesNotMatch(section.get(19).question, /してもらった/u)
  assert.equal(section.get(32).options[3].text, '来月から始まる大学生活に気づくと、とても楽しみだ。')
  assert.equal(report.answerKeysChanged, 1)
  assert.match(report.uncertainty, /楽しみた/)
})

test('N3 December 2020 source-outlier explanations translate prompts and explain all choices', () => {
  assert.equal(report.rows.length, 5)
  for (const row of report.rows) {
    const question = section.get(row.number)
    assert.ok(question)
    assert.equal(Number(question.answer), row.answer)
    assert.equal(stripMarkup(question.question), stripMarkup(row.prompt))
    assert.deepEqual(question.options.map((option) => option.text), row.options)
    const explanation = question.explanation || curated[question.id]
    assert.ok(explanation.startsWith(`Đáp án ${row.answer} —`))
    assert.match(explanation, /Dịch/)
    for (let option = 1; option <= 4; option++) assert.ok(explanation.includes(`\n${option}. `))
  }
  assert.match(section.get(32).explanation, /được diễn đạt tự nhiên hơn/u)
})

test('NhaiKanji service returns the corrected section questions and explanations', () => {
  const service = new NhaiKanjiService()
  const servedExam = service.getJlptExamDetail('cm2u2xg4300wm134izpbjrysi-vocab')
  const served = byNumber(servedExam)
  for (const row of report.rows) {
    const question = served.get(row.number)
    assert.ok(question)
    assert.equal(Number(question.answer), row.answer)
    assert.ok(question.explanation.startsWith(`Đáp án ${row.answer} —`))
    assert.match(question.explanation, /Dịch/)
  }
})
