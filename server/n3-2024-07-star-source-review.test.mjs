import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import test from 'node:test'

const exams = JSON.parse(fs.readFileSync(path.resolve('data/jlpt_n3_toan_master.json'), 'utf8'))
const curated = JSON.parse(fs.readFileSync(path.resolve('data/jlpt_n3_explanations_curated.json'), 'utf8'))
const exam = exams.find((item) => item.id === 'toan-n3-202407-full')
const questions = exam.parts.flatMap((part) => part.questions)
const expected = [
  { id: 'toan_q_2024_07_49', order: [3, 2, 4, 1], answer: 4, term: 'いいにおい' },
  { id: 'toan_q_2024_07_50', order: [3, 1, 2, 4], answer: 2, term: '歩く' },
  { id: 'toan_q_2024_07_51', order: [4, 2, 3, 1], answer: 3, term: 'ことが' },
  { id: 'toan_q_2024_07_52', order: [2, 1, 4, 3], answer: 4, term: '眺め' },
  { id: 'toan_q_2024_07_53', order: [4, 3, 1, 2], answer: 1, term: '結婚するんだ' },
]

test('July 2024 star positions, keys, options, and explanations match the source PDF', () => {
  for (const item of expected) {
    const question = questions.find((entry) => entry.id === item.id)
    assert.ok(question, `missing ${item.id}`)
    assert.equal(question.starOrderVerified, true, item.id)
    assert.equal(question.starPositionVerified, true, item.id)
    assert.deepEqual(question.starCorrectOrder, item.order, item.id)
    assert.equal(question.starPosition, 2, item.id)
    assert.equal(question.correctAnswer, item.answer, item.id)
    assert.match(question.starVerificationSources?.[0] || '', /#page=8$/u, item.id)
    assert.match(curated[item.id] || '', new RegExp(item.term, 'u'), item.id)
    assert.match(curated[item.id] || '', /Dịch:/u, item.id)
  }
})
