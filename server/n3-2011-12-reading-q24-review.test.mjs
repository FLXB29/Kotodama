import assert from 'node:assert/strict'
import fs from 'node:fs'
import test from 'node:test'
import { NhaiKanjiService } from './nhaikanji-service.mjs'

const readJson = (file) => JSON.parse(fs.readFileSync(file, 'utf8'))
const master = readJson('data/jlpt_n3_toan_master.json')
const curated = readJson('data/jlpt_n3_explanations_curated.json')
const report = readJson('reports/n3-quality-audit/reading-2011-12-q24-review.json')
const exam = master.find((item) => item.id === 'toan-n3-201112-full')
const question = exam.parts
  .flatMap((part) => part.questions || [])
  .find((item) => item.id === report.correction.questionId)
const passageText = question?.passage.replace(/<[^>]*>/gu, '')

test('December 2011 reading question 24 follows the email and corrects the earlier explanation', () => {
  assert.equal(report.answerKeysChanged, 0)
  assert.equal(report.answerReference.officialKeyEstablished, false)
  assert.equal(report.source.pdfIndependentlyReviewed, false)
  assert.ok(question)
  assert.match(passageText, /日時とだいたいのご出席人数は伺っております/u)
  assert.match(passageText, /こちらにいらっしゃる日を知らせていただけないでしょうか/u)
  assert.match(passageText, /最終的な人数については、パーティー当日の 3 日までに/u)
  assert.equal(question.answer, 3)
  assert.equal(question.options[2], 'パーティーの相談をするためにレストランに行ける日')
  assert.equal(curated[question.id], report.correction.explanation)
  assert.match(curated[question.id], /Trước hết, Tanaka cần báo ngày nào anh có thể đến nhà hàng/u)
  assert.match(curated[question.id], /số lượng chính thức phải báo riêng trước buổi tiệc ba ngày/u)
  assert.match(report.correction.previousExplanation, /số người cuối cùng/u)
  assert.match(curated[question.id], /Dịch:/u)
})

test('the exam service serves the corrected December 2011 reading explanation', () => {
  const served = new NhaiKanjiService().getJlptExamDetail(exam.id)
  const servedQuestion = served.parts.flatMap((part) => part.questions || []).find((item) => item.id === question.id)
  assert.ok(servedQuestion)
  assert.equal(servedQuestion.answer, 3)
  assert.equal(servedQuestion.explanation, report.correction.explanation)
})
