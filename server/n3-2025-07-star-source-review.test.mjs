import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import test from 'node:test'

const exams = JSON.parse(fs.readFileSync(path.resolve('data/jlpt_n3_toan_master.json'), 'utf8'))
const curated = JSON.parse(fs.readFileSync(path.resolve('data/jlpt_n3_explanations_curated.json'), 'utf8'))
const exam = exams.find((item) => item.id === 'toan-n3-202507-full')
const questions = exam.parts.flatMap((part) => part.questions)
const expected = [
  {
    id: 'toan_q_2025_07_49',
    options: ['1 異常な', '2 比べると', '3 暑さだった', '4 去年の夏に'],
    order: [1, 3, 4, 2],
    answer: 4,
    text: '異常な暑さだった去年の夏に比べると',
    starred: '去年の夏に',
  },
  {
    id: 'toan_q_2025_07_50',
    options: ['1 ことか', '2 大変な', '3 ことが', '4 どれだけ'],
    order: [3, 4, 2, 1],
    answer: 2,
    text: 'どれだけ大変なことか',
    starred: '大変な',
  },
  {
    id: 'toan_q_2025_07_51',
    options: ['1 ので', '2 外が暗くなっていた', '3 驚いた', '4 いつのまにか'],
    order: [4, 2, 1, 3],
    answer: 1,
    text: 'いつのまにか外が暗くなっていたので驚いた',
    starred: 'ので',
  },
  {
    id: 'toan_q_2025_07_52',
    options: ['1 だから', '2 作り方は', '3 だけ', '4 材料を混ぜて冷やす'],
    order: [2, 4, 3, 1],
    answer: 3,
    text: '作り方は材料を混ぜて冷やすだけだから',
    starred: 'だけ',
  },
  {
    id: 'toan_q_2025_07_53',
    options: ['1 雨が降ったら', '2 試合は', '3 雨が降ったとしても', '4 中止にならないんだけど'],
    order: [3, 2, 4, 1],
    answer: 4,
    text: '雨が降ったとしても、試合は中止にならないんだけど',
    starred: '中止にならないんだけど',
  },
]

test('July 2025 star positions, option fragments, keys, and explanations match the rendered PDF', () => {
  for (const item of expected) {
    const question = questions.find((entry) => entry.id === item.id)
    assert.ok(question, `missing ${item.id}`)
    assert.equal(question.starVerificationStatus, 'verified-against-source', item.id)
    assert.equal(question.starOrderVerified, true, item.id)
    assert.equal(question.starPositionVerified, true, item.id)
    assert.deepEqual(question.options, item.options, item.id)
    assert.deepEqual(question.starCorrectOrder, item.order, item.id)
    assert.equal(question.starPosition, 2, item.id)
    assert.equal(question.correctAnswer, item.answer, item.id)
    assert.match(question.starVerificationSources?.[0] || '', /#page=8$/u, item.id)
    assert.match(question.starVerificationNote || '', /rendered original PDF/u, item.id)
    assert.match(curated[item.id] || '', new RegExp(item.text, 'u'), item.id)
    assert.match(curated[item.id] || '', new RegExp(item.starred, 'u'), item.id)
    assert.match(curated[item.id] || '', /Dịch:/u, item.id)
  }
})

test('July 2025 question 17 uses the fragments printed in the original PDF', () => {
  const question = questions.find((entry) => entry.id === 'toan_q_2025_07_52')
  assert.ok(question)
  assert.deepEqual(question.options, ['1 だから', '2 作り方は', '3 だけ', '4 材料を混ぜて冷やす'])
  assert.match(curated[question.id], /PDF gốc có đủ bốn mảnh/u)
  assert.doesNotMatch(curated[question.id], /bốn mảnh.*không thể xếp thành câu tự nhiên/u)
})
