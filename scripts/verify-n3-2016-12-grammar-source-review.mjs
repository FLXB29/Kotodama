import assert from 'node:assert/strict'
import fs from 'node:fs'

const fullExams = JSON.parse(fs.readFileSync('data/jlpt_full_master.json', 'utf8'))
const mockExams = JSON.parse(fs.readFileSync('data/jlpt_n3_toan_master.json', 'utf8'))
const curated = JSON.parse(fs.readFileSync('data/jlpt_n3_explanations_curated.json', 'utf8'))
const fullExam = fullExams.find((exam) => exam.title === 'JLPT-N3 12 2016 - Ngữ Pháp & Đọc Hiểu (文法・読解)')
const mockExam = mockExams.find((exam) => exam.id === 'toan-n3-201612-full')
assert.ok(fullExam, 'December 2016 grammar/reading section must exist.')
assert.ok(mockExam, 'December 2016 full mock must exist.')

const fullQuestions = new Map(
  fullExam.parts.flatMap((part) => part.questions || []).map((question) => [question.number, question])
)
const mockQuestions = new Map(
  mockExam.parts.flatMap((part) => part.questions || []).map((question) => [question.number, question])
)
const answers = [2, 4, 3, 1, 4, 2, 3, 2, 3, 1, 2, 4, 1, 2, 4, 2, 1, 3, 3, 4, 1, 3, 2]
const mismatches = []

for (const [index, answer] of answers.entries()) {
  const number = index + 36
  const sectionQuestion = fullQuestions.get(number)
  const mockQuestion = mockQuestions.get(number)
  assert.ok(sectionQuestion, `Section question ${number} must exist.`)
  assert.ok(mockQuestion, `Full mock question ${number} must exist.`)
  assert.equal(Number(sectionQuestion.correctAnswer ?? sectionQuestion.answer), answer, `Section key q${number}.`)
  assert.equal(Number(mockQuestion.correctAnswer ?? mockQuestion.answer), answer, `Full mock key q${number}.`)

  const explanation = mockQuestion.explanation || curated[mockQuestion.id]
  assert.ok(explanation, `Question ${number} must have a reviewed explanation.`)
  assert.equal(Number(explanation.match(/^Đáp án\s+(\d+)/imu)?.[1]), answer, `Explanation key q${number}.`)
  assert.match(explanation, /Dịch:/u, `Question ${number} must translate the sentence/context.`)
  for (const choice of [1, 2, 3, 4]) {
    assert.match(explanation, new RegExp(`^${choice}\\.`, 'mu'), `Question ${number} must address choice ${choice}.`)
  }
  if (
    Number(sectionQuestion.correctAnswer ?? sectionQuestion.answer) !==
    Number(mockQuestion.correctAnswer ?? mockQuestion.answer)
  ) {
    mismatches.push(number)
  }
}

assert.deepEqual(mismatches, [], 'The two December 2016 grammar banks must agree on every answer.')

const expectedStar = [
  { number: 49, answer: 2, order: [4, 2, 3, 1], position: 1 },
  { number: 50, answer: 4, order: [3, 1, 4, 2], position: 2 },
  { number: 51, answer: 2, order: [4, 3, 2, 1], position: 2 },
  { number: 52, answer: 1, order: [2, 3, 1, 4], position: 2 },
  { number: 53, answer: 3, order: [1, 4, 3, 2], position: 2 },
]
for (const expected of expectedStar) {
  const question = mockQuestions.get(expected.number)
  assert.equal(question.correctAnswer, expected.answer, `Star key q${expected.number}.`)
  assert.deepEqual(question.starCorrectOrder, expected.order, `Star order q${expected.number}.`)
  assert.equal(question.starPosition, expected.position, `Printed ★ position q${expected.number}.`)
  assert.equal(question.starCorrectOrder[question.starPosition], expected.answer, `Piece at ★ q${expected.number}.`)
  assert.equal(question.starOrderVerified, true, `Star order q${expected.number} must be source-reviewed.`)
  assert.equal(question.starPositionVerified, true, `Star position q${expected.number} must be source-reviewed.`)
}

assert.match(fullQuestions.get(37).question, /会社の面接/u)
assert.equal(fullQuestions.get(42).options[3].text, '申し上げます')
assert.equal(fullQuestions.get(43).options[3].text, '持っていくつもりだ')
assert.equal(fullQuestions.get(46).options[3].text, '予約してあるね')
assert.match(fullQuestions.get(47).question, /このトマト/u)
assert.match(fullQuestions.get(52).question, /レストランで/u)
assert.match(fullQuestions.get(52).question, /待てって/u)
assert.equal(fullQuestions.get(57).options[2].text, '持つのかもしれません')
assert.equal(mockQuestions.get(43).options[3], '4.持っていくつもりだ')
assert.match(mockQuestions.get(52).starPrompt.before, /待てって$/u)
assert.equal(mockQuestions.get(57).options[2], '3.持つのかもしれません')

console.log(
  'Verified grammar answers, source corrections, ★ slots, and complete explanations for all 23 December 2016 grammar questions.'
)
