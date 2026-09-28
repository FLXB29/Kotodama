import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import test from 'node:test'

const exams = JSON.parse(fs.readFileSync(path.resolve('data/jlpt_n3_toan_master.json'), 'utf8'))
const curated = JSON.parse(fs.readFileSync(path.resolve('data/jlpt_n3_explanations_curated.json'), 'utf8'))
const exam = exams.find((item) => item.id === 'toan-n3-202412-full')
const questions = exam.parts.flatMap((part) => part.questions)
const expected = [
  { id: 'toan_q_2024_12_49', order: [1, 3, 2, 4], answer: 2, text: '持っている' },
  { id: 'toan_q_2024_12_50', order: [1, 4, 3, 2], answer: 3, text: 'かばんを' },
  { id: 'toan_q_2024_12_51', order: [2, 3, 4, 1], answer: 4, text: 'ように' },
  { id: 'toan_q_2024_12_52', order: [4, 1, 2, 3], answer: 2, text: '買ってきてくれる' },
  { id: 'toan_q_2024_12_53', order: [3, 2, 1, 4], answer: 1, text: '景色を楽しみながら' },
]

test('December 2024 star positions, answer keys, source wording, and explanations match the PDF', () => {
  for (const item of expected) {
    const question = questions.find((entry) => entry.id === item.id)
    assert.ok(question, `missing ${item.id}`)
    assert.equal(question.starOrderVerified, true, item.id)
    assert.equal(question.starPositionVerified, true, item.id)
    assert.deepEqual(question.starCorrectOrder, item.order, item.id)
    assert.equal(question.starPosition, 2, item.id)
    assert.equal(question.correctAnswer, item.answer, item.id)
    assert.match(question.starVerificationSources?.[0] || '', /#page=9$/u, item.id)
    assert.match(curated[item.id] || '', new RegExp(item.text, 'u'), item.id)
    assert.match(curated[item.id] || '', /Dịch:/u, item.id)
  }

  const finalItem = questions.find((entry) => entry.id === 'toan_q_2024_12_53')
  assert.match(finalItem.options[2], /だけではなく/u)
  assert.doesNotMatch(finalItem.options[2], /だけでなく/u)
  assert.match(curated.toan_q_2024_12_53, /Thứ tự là 3 → 2 → 1 → 4/u)
  assert.match(curated.toan_q_2024_12_53, /Bản gốc dùng 「だけではなく」/u)
})
