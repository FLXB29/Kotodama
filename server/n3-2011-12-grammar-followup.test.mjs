import test from 'node:test'
import assert from 'node:assert/strict'
import fs from 'node:fs'
import { NhaiKanjiService } from './nhaikanji-service.mjs'

const master = JSON.parse(fs.readFileSync('data/jlpt_n3_toan_master.json', 'utf8'))
const curated = JSON.parse(fs.readFileSync('data/jlpt_n3_explanations_curated.json', 'utf8'))
const report = JSON.parse(fs.readFileSync('reports/n3-quality-audit/grammar-2011-12-followup.json', 'utf8'))
const exam = master.find((entry) => entry.id === 'toan-n3-201112-full')
const questions = exam.parts.flatMap((part) => part.questions || [])

test('December 2011 grammar source correction preserves question 48 answer', () => {
  const question = questions.find((entry) => Number(entry.number) === 48)
  assert.equal(Number(question.correctAnswer ?? question.answer), 2)
  assert.match(question.question, /入学したころからは、だんだん風邪を引いたり/u)
  assert.match(question.sentence, /入学したころからは、だんだん風邪を引いたり/u)
  assert.doesNotMatch(question.question, /入学したことからは|風を引いたり/u)
  assert.equal(report.rows.find((row) => row.number === 48).answerKeyChanged, false)
})

test('December 2011 star question 15 explains order, starred slot, translation, and all fragments', () => {
  const question = questions.find((entry) => Number(entry.number) === 50)
  const row = report.rows.find((entry) => entry.number === 50)
  assert.equal(Number(question.correctAnswer ?? question.answer), 4)
  assert.deepEqual(question.starCorrectOrder, [2, 1, 4, 3])
  assert.equal(question.starPosition, 2)
  assert.equal(question.starOrderVerified, true)
  assert.equal(row.starPosition, 3)
  assert.equal(row.starChoice, 4)
  assert.equal(question.explanation, curated[question.id])
  assert.match(question.explanation, /Dịch:/u)
  assert.match(question.explanation, /Thứ tự ghép là 2 → 1 → 4 → 3/u)
  assert.match(question.explanation, /ô ★/u)
  for (let choice = 1; choice <= 4; choice++) {
    assert.match(question.explanation, new RegExp('^' + choice + '\\.', 'mu'))
  }
})

test('the December 2011 exam service returns the corrected grammar prompt and star explanation', () => {
  const served = new NhaiKanjiService().getJlptExamDetail(exam.id)
  const servedQuestions = served.parts.flatMap((part) => part.questions || [])
  const q48 = servedQuestions.find((question) => Number(question.number) === 48)
  const q50 = servedQuestions.find((question) => Number(question.number) === 50)
  assert.match(q48.question, /入学したころからは、だんだん風邪を引いたり/u)
  assert.equal(q50.explanation, curated[q50.id])
  assert.match(q50.explanation, /画家たちによって描かれた絵/u)
})
