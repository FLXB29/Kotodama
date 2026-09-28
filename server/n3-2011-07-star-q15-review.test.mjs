import assert from 'node:assert/strict'
import fs from 'node:fs'
import test from 'node:test'
import { NhaiKanjiService } from './nhaikanji-service.mjs'

const master = JSON.parse(fs.readFileSync('data/jlpt_n3_toan_master.json', 'utf8'))
const curated = JSON.parse(fs.readFileSync('data/jlpt_n3_explanations_curated.json', 'utf8'))
const review = JSON.parse(fs.readFileSync('reports/n3-quality-audit/star-source-2011-07-q15-review.json', 'utf8'))
const exam = master.find((entry) => entry.id === 'toan-n3-201107-full')
const question = exam.parts.flatMap((part) => part.questions || []).find((entry) => entry.id === review.questionId)

test('July 2011 question 15 reconstructs the starred sentence and explains each fragment', () => {
  assert.ok(question)
  assert.deepEqual(question.starCorrectOrder, review.verifiedStructure.order)
  assert.equal(question.starPosition, review.verifiedStructure.starPositionZeroBased)
  assert.equal(Number(question.correctAnswer ?? question.answer), review.verifiedStructure.starChoice)
  assert.equal(review.verifiedStructure.officialAnswerKeyEstablished, false)
  assert.equal(question.explanation, curated[question.id])

  const explanation = question.explanation
  assert.ok(explanation.includes(review.verifiedStructure.completedSentence))
  assert.match(explanation, /Giờ đóng cửa của bảo tàng đó thay đổi tùy theo ngày trong tuần/u)
  assert.match(explanation, /Thứ tự ghép là 3→1→4→2/u)
  assert.match(explanation, /Dấu ★ ở vị trí thứ ba nhận lựa chọn 4 「が」/u)
  assert.match(explanation, /「によって」\(3\) theo sau 「曜日」/u)
  assert.match(explanation, /「閉まる時間」\(1\) là “giờ đóng cửa”/u)
  assert.match(explanation, /「違うから」\(2\) kết thúc mệnh đề lý do/u)
})

test('the exam service serves the reviewed July 2011 explanation', () => {
  const served = new NhaiKanjiService().getJlptExamDetail(exam.id)
  const servedQuestion = served.parts.flatMap((part) => part.questions || []).find((entry) => entry.id === question.id)
  assert.equal(servedQuestion?.explanation, question.explanation)
})
