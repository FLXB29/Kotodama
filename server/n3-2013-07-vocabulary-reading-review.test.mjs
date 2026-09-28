import test from 'node:test'
import assert from 'node:assert/strict'
import fs from 'node:fs'

const exams = JSON.parse(fs.readFileSync(new URL('../data/jlpt_n3_toan_master.json', import.meta.url), 'utf8'))
const curated = JSON.parse(
  fs.readFileSync(new URL('../data/jlpt_n3_explanations_curated.json', import.meta.url), 'utf8')
)
const exam = exams.find((item) => item.id === 'toan-n3-201307-full')
const questions = new Map(exam.parts.flatMap((part) => part.questions).map((question) => [question.id, question]))
const checks = [
  [1, 3, '苦しい（くるしい）', '悲しい'],
  [2, 4, '出張（しゅっちょう）', '主張'],
  [3, 1, '席（せき）', '鍵'],
  [4, 1, '根（ね）', '葉'],
  [5, 2, '事情（じじょう）', '事故'],
  [6, 1, '通知（つうち）', '通史'],
  [7, 3, '選手（せんしゅ）', '先週'],
  [8, 2, '実力（じつりょく）', '努力'],
]

test('2013-07 vocabulary reading explanations preserve the independently checked key', () => {
  for (const [number, answer] of checks) {
    const question = questions.get(`toan_q_2013_07_${number}`)
    assert.equal(question.answer, answer)
    assert.equal(question.correctAnswer, answer)
  }
  const q8 = questions.get('toan_q_2013_07_8')
  assert.equal(q8.options[2], '3. どりょく')
})

test('2013-07 vocabulary reading explanations translate the sentence and discuss every choice', () => {
  for (const [number, answer, correctReading, contrast] of checks) {
    const question = questions.get(`toan_q_2013_07_${number}`)
    const explanation = question.explanation || curated[question.id]
    assert.match(explanation, new RegExp(`^Đáp án ${answer} —`))
    assert.match(explanation, /Dịch:/)
    assert.ok(explanation.includes(correctReading))
    assert.ok(explanation.includes(contrast))
    for (let option = 1; option <= 4; option++) assert.ok(explanation.includes(`\n${option}. `))
  }
  const q8Explanation = questions.get('toan_q_2013_07_8').explanation
  assert.match(q8Explanation, /3\. どりょく.*努力/)
  assert.doesNotMatch(q8Explanation, /どりょくり/)
})
