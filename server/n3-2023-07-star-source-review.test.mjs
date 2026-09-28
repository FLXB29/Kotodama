import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import test from 'node:test'

const exams = JSON.parse(fs.readFileSync(path.resolve('data/jlpt_n3_toan_master.json'), 'utf8'))
const sectionExams = JSON.parse(fs.readFileSync(path.resolve('data/jlpt_full_master.json'), 'utf8'))
const curated = JSON.parse(fs.readFileSync(path.resolve('data/jlpt_n3_explanations_curated.json'), 'utf8'))
const exam = exams.find((item) => item.id === 'toan-n3-202307-full')
const sectionExam = sectionExams.find((item) => item.id === 'cm2u2y1xl01d2134ilubjx79d-grammar-reading')
const questions = exam.parts.flatMap((part) => part.questions)
const sectionQuestions = sectionExam.parts.flatMap((part) => part.questions)
const expected = [
  {
    id: 'toan_q_2023_07_49',
    options: ['1 が', '2 による', '3 見すぎ', '4 目の疲れ'],
    order: [3, 2, 4, 1],
    position: 1,
    answer: 2,
    text: '見すぎによる目の疲れが原因で',
    starred: 'による',
  },
  {
    id: 'toan_q_2023_07_50',
    options: [' 1 上手に弾けない', '2 練習しても ', ' 3 なかなか', '4 曲があって'],
    order: [2, 3, 1, 4],
    position: 1,
    answer: 3,
    text: '何回練習してもなかなか上手に弾けない曲があって',
    starred: 'なかなか',
  },
  {
    id: 'toan_q_2023_07_51',
    options: ['1 失敗をしてしまった', '2 どうして', '3 のか', '4 のは'],
    order: [4, 2, 1, 3],
    position: 2,
    answer: 1,
    text: '大切なのは、どうして失敗をしてしまったのか',
    starred: '失敗をしてしまった',
  },
  {
    id: 'toan_q_2023_07_52',
    options: [' 1 いいんじゃない', '2 から', '3 とか ', '4 タオル'],
    order: [2, 4, 3, 1],
    position: 2,
    answer: 3,
    text: 'スポーツが好きだと言っていたから、タオルとかいいんじゃない',
    starred: 'とか',
  },
  {
    id: 'toan_q_2023_07_53',
    options: ['1 専門家で', '2 都会で', '3 いらっしゃる', '4 山下花子先生に'],
    order: [1, 3, 4, 2],
    position: 2,
    answer: 4,
    text: '鳥の専門家でいらっしゃる山下花子先生に、都会で見る',
    starred: '山下花子先生に',
  },
]

test('July 2023 star fragments, ordering, printed star slots, and explanations match the source PDF', () => {
  assert.ok(exam, 'missing July 2023 exam')
  for (const item of expected) {
    const question = questions.find((entry) => entry.id === item.id)
    assert.ok(question, `missing ${item.id}`)
    assert.equal(question.starVerificationStatus, 'verified-against-source', item.id)
    assert.equal(question.starOrderVerified, true, item.id)
    assert.equal(question.starPositionVerified, true, item.id)
    assert.deepEqual(question.options, item.options, item.id)
    assert.deepEqual(question.starCorrectOrder, item.order, item.id)
    assert.equal(question.starPosition, item.position, item.id)
    assert.equal(question.correctAnswer, item.answer, item.id)
    assert.equal(question.answer, item.answer, item.id)
    assert.match(question.starVerificationSources?.[0] || '', /#page=7$/u, item.id)
    assert.match(question.starVerificationNote || '', /rendered original PDF/u, item.id)
    assert.match(curated[item.id] || '', new RegExp(item.text, 'u'), item.id)
    assert.match(curated[item.id] || '', new RegExp(item.starred, 'u'), item.id)
    assert.match(curated[item.id] || '', /Dịch:/u, item.id)
    assert.equal(question.explanation, curated[item.id], `${item.id}: full-exam explanation is out of sync`)

    const sectionQuestion = sectionQuestions.find((entry) => Number(entry.number) === question.number)
    assert.ok(sectionQuestion, `${item.id}: section question is missing`)
    assert.equal(sectionQuestion.correctAnswer, String(item.answer), `${item.id}: section answer differs`)
    assert.equal(sectionQuestion.explanation, curated[item.id], `${item.id}: section explanation differs`)
  }
})

test('July 2023 question 15 follows the original printed star over the second ordered fragment', () => {
  const question = questions.find((entry) => entry.id === 'toan_q_2023_07_50')
  assert.ok(question)
  assert.equal(question.starCorrectOrder[question.starPosition], 3)
  assert.equal(question.correctAnswer, 3)
  assert.match(question.starVerificationNote || '', /secondary-key discrepancy/i)
  assert.match(question.starVerificationNote || '', /original question layout and natural assembled sentence support choice 3/u)
  assert.match(curated[question.id], /bảng đáp án tổng hợp ghi lựa chọn 1/u)
})
