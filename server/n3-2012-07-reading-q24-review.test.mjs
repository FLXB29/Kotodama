import assert from 'node:assert/strict'
import fs from 'node:fs'
import test from 'node:test'
import { NhaiKanjiService } from './nhaikanji-service.mjs'

const readJson = (file) => JSON.parse(fs.readFileSync(file, 'utf8'))
const master = readJson('data/jlpt_n3_toan_master.json')
const curated = readJson('data/jlpt_n3_explanations_curated.json')
const report = readJson('reports/n3-quality-audit/reading-2012-07-q24-review.json')
const exam = master.find((item) => item.id === 'toan-n3-201207-full')
const question = exam.parts
  .flatMap((part) => part.questions || [])
  .find((item) => item.id === report.correction.questionId)

test('July 2012 reading question 24 matches the sushi-chef passage and corrected explanation', () => {
  assert.equal(report.sourcePdf.renderedPage, 7)
  assert.equal(report.answerKeysChanged, 0)
  assert.equal(report.answerReference.officialKeyEstablished, false)
  assert.ok(question)
  assert.match(question.passage, /20 年以上寿司をにぎっている林さん/u)
  assert.match(question.passage, /三日、三月、三年/u)
  assert.deepEqual(question.options, ['お客が増えたな', '20年は続けよう', '一生の仕事だな', '三年間がんばろう'])
  assert.equal(question.correctAnswer, 3)
  assert.equal(curated[question.id], report.correction.explanation)
  assert.match(report.correction.previousExplanation, /sửa chữa đồ chơi/u)
  assert.match(curated[question.id], /Đây đúng là công việc cả đời mình/u)
  assert.match(curated[question.id], /Hayashi.*làm sushi hơn 20 năm/u)
  assert.match(curated[question.id], /không phải câu chuyện sửa đồ chơi/u)
  assert.doesNotMatch(curated[question.id], /sửa chữa đồ chơi là công việc/u)
  assert.match(curated[question.id], /Dịch:/u)
})

test('the exam service serves the corrected July 2012 reading explanation', () => {
  const served = new NhaiKanjiService().getJlptExamDetail(exam.id)
  const servedQuestion = served.parts.flatMap((part) => part.questions || []).find((item) => item.id === question.id)
  assert.ok(servedQuestion)
  assert.equal(servedQuestion.correctAnswer, 3)
  assert.equal(servedQuestion.explanation, report.correction.explanation)
})
