import test from 'node:test'
import assert from 'node:assert/strict'
import fs from 'node:fs'

const exams = JSON.parse(fs.readFileSync(new URL('../data/jlpt_n3_toan_master.json', import.meta.url), 'utf8'))
const curated = JSON.parse(
  fs.readFileSync(new URL('../data/jlpt_n3_explanations_curated.json', import.meta.url), 'utf8')
)
const exam = exams.find((item) => item.id === 'toan-n3-201212-full')
const questions = new Map(exam.parts.flatMap((part) => part.questions).map((question) => [question.id, question]))
const checks = [
  [1, 2, '短い（みじかい）', '短すぎて'],
  [2, 3, '他人（たにん）', '知人'],
  [3, 4, '示す（しめす）', '表した'],
  [4, 2, '外科（げか）', '外貨'],
  [5, 1, '笑顔（えがお）', '笑顔'],
  [6, 3, '以降（いこう）', '以後'],
  [7, 1, '横断（おうだん）', 'おうだん'],
  [8, 4, '合図（あいず）', 'あいず'],
]

test('2012-12 vocabulary reading explanations preserve the independently checked key', () => {
  for (const [number, answer] of checks) {
    const question = questions.get(`toan_q_2012_12_${number}`)
    assert.equal(question.answer, answer)
    assert.equal(question.correctAnswer, answer)
  }
})

test('2012-12 vocabulary reading explanations translate the sentence and discuss every choice', () => {
  for (const [number, answer, correctReading, contrast] of checks) {
    const question = questions.get(`toan_q_2012_12_${number}`)
    const explanation = question.explanation || curated[question.id]
    assert.match(explanation, new RegExp(`^Đáp án ${answer} —`))
    assert.match(explanation, /Dịch:/)
    assert.ok(explanation.includes(correctReading))
    assert.ok(explanation.includes(contrast))
    for (let option = 1; option <= 4; option++) assert.ok(explanation.includes(`\n${option}. `))
  }
})
