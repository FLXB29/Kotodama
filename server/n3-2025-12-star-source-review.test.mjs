import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import test from 'node:test'
import { NhaiKanjiService } from './nhaikanji-service.mjs'

const exams = JSON.parse(fs.readFileSync(path.resolve('data/jlpt_n3_toan_master.json'), 'utf8'))
const curated = JSON.parse(fs.readFileSync(path.resolve('data/jlpt_n3_explanations_curated.json'), 'utf8'))
const sourceReview = JSON.parse(
  fs.readFileSync(path.resolve('reports/n3-quality-audit/star-source-2025-12-q16-review.json'), 'utf8')
)
const exam = exams.find((item) => item.id === 'toan-n3-202512-full')
const questions = exam.parts.flatMap((part) => part.questions)
const expected = [
  {
    id: 'toan_q_2025_12_49',
    options: ['1 と', '2 の', '3 について', '4 レポートの書き方'],
    order: [1, 4, 3, 2],
    answer: 3,
    text: 'について',
    printed: 'レポートの書き方についての本',
  },
  {
    id: 'toan_q_2025_12_50',
    options: ['1 で', '2 か何か', '3 テレビ', '4 見たこと'],
    order: [3, 2, 1, 4],
    answer: 1,
    text: 'テレビか何かで',
    printed: '見たことがある',
  },
  {
    id: 'toan_q_2025_12_52',
    options: ['1 北町を選んだ', '2 のは', '3 ずっと北町に住んでみたかった', '4 のに'],
    order: [4, 1, 2, 3],
    answer: 2,
    text: 'のは',
    printed: '会社から遠いのに',
  },
  {
    id: 'toan_q_2025_12_53',
    options: ['1 ことが', '2 使った後', '3 ぬれたままにしない', '4 ためには'],
    order: [4, 2, 3, 1],
    answer: 3,
    text: 'ぬれたままにしない',
    printed: 'ためには',
  },
]

test('December 2025 star positions, option fragments, keys, and explanations match the source PDF', () => {
  for (const item of expected) {
    const question = questions.find((entry) => entry.id === item.id)
    assert.ok(question, `missing ${item.id}`)
    assert.equal(question.starVerificationStatus, 'verified-against-source', item.id)
    assert.equal(question.starOrderVerified, true, item.id)
    assert.equal(question.starPositionVerified, true, item.id)
    assert.deepEqual(question.starCorrectOrder, item.order, item.id)
    assert.equal(question.starPosition, 2, item.id)
    assert.equal(question.correctAnswer, item.answer, item.id)
    assert.deepEqual(question.options, item.options, item.id)
    assert.match(question.starVerificationSources?.[0] || '', /#page=9$/u, item.id)
    assert.match(question.starVerificationNote || '', /rendered original PDF/u, item.id)
    assert.match(curated[item.id] || '', new RegExp(item.text, 'u'), item.id)
    assert.match(curated[item.id] || '', new RegExp(item.printed, 'u'), item.id)
    assert.match(curated[item.id] || '', /Dịch:/u, item.id)
  }
})

test('December 2025 printed question 16 conflict remains visible and excluded from verified counts', () => {
  const question = questions.find((entry) => entry.id === 'toan_q_2025_12_51')
  assert.ok(question)
  assert.equal(question.starVerificationStatus, 'conflict')
  assert.match(question.starVerificationNote || '', /PDF.*「弾くけど」/u)
  assert.match(question.starConflictSources?.[0] || '', /#page=9$/u)
  assert.match(curated[question.id] || '', /lựa chọn 2 「弾くけど」/u)
  assert.match(sourceReview.answerKeyCrossCheck.answerSequence, /3 1 4 2 3/u)
  assert.equal(
    sourceReview.answerKeyCrossCheck.provenance,
    'Independent third-party answer compilation; not an official JLPT key.'
  )
  assert.equal(sourceReview.status, 'source-conflict-disclosed-unresolved')
})

test('December 2025 question 16 explanation covers all four fragments and is served with its source caveat', () => {
  const questionId = 'toan_q_2025_12_51'
  const explanation = curated[questionId]
  assert.match(explanation, /Đáp án trong khóa tham khảo hiện lưu là 4/u)
  assert.match(explanation, /弾けば弾くほど上手に弾けるようになっていく/u)
  assert.match(explanation, /Thứ tự bốn mảnh là 2 → 1 → 4 → 3/u)
  for (let option = 1; option <= 4; option += 1) {
    assert.match(explanation, new RegExp(`^${option}\\.`, 'mu'))
  }
  assert.match(explanation, /PDF đề gốc.*「弾くけど」/u)
  assert.match(explanation, /chưa có khóa JLPT chính thức để phân xử/u)

  const servedExam = new NhaiKanjiService().getJlptExamDetail('toan-n3-202512-full')
  const servedQuestion = servedExam.parts.flatMap((part) => part.questions).find((item) => item.id === questionId)
  assert.equal(servedQuestion.answer, 4)
  assert.match(servedQuestion.explanation || '', /1\. 「上手に」/u)
  assert.match(servedQuestion.explanation || '', /4\. 「弾けるように」/u)
  assert.match(servedQuestion.explanation || '', /「弾くけど」/u)
})
