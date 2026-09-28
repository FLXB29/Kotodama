import test from 'node:test'
import assert from 'node:assert/strict'
import fs from 'node:fs'

const exams = JSON.parse(fs.readFileSync(new URL('../data/jlpt_n3_toan_master.json', import.meta.url), 'utf8'))
const curated = JSON.parse(
  fs.readFileSync(new URL('../data/jlpt_n3_explanations_curated.json', import.meta.url), 'utf8')
)
const exam = exams.find((item) => item.id === 'toan-n3-201412-full')
const questions = new Map(exam.parts.flatMap((part) => part.questions).map((question) => [question.id, question]))

const checks = [
  [1, 2, '横（よこ）', 'そば'],
  [2, 3, '自然（しぜん）', 'しぜい'],
  [3, 3, '替える（かえる）', 'つかまえて'],
  [4, 2, '応用（おうよう）', '引用'],
  [5, 3, '一般的（いっぱんてき）', 'いっぺんてき'],
  [6, 2, '検査（けんさ）', '観察'],
  [7, 1, '厚い（あつい）', '薄い'],
  [8, 4, '呼吸（こきゅう）', '故郷'],
]

test('2014-12 vocabulary reading explanations preserve the checked answer key', () => {
  for (const [number, answer] of checks) {
    const question = questions.get(`toan_q_2014_12_${number}`)
    assert.equal(question.answer, answer)
    assert.equal(question.correctAnswer, answer)
  }
})

test('2014-12 vocabulary reading explanations translate each stem and address every choice', () => {
  for (const [number, answer, correctReading, contrast] of checks) {
    const question = questions.get(`toan_q_2014_12_${number}`)
    const explanation = question.explanation || curated[question.id]
    assert.match(explanation, new RegExp(`^Đáp án ${answer} —`))
    assert.match(explanation, /Dịch:/)
    assert.match(explanation, new RegExp(correctReading.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')))
    assert.match(explanation, new RegExp(contrast.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')))
    for (let option = 1; option <= 4; option++) assert.match(explanation, new RegExp(`\\n${option}\\. `))
  }
})
