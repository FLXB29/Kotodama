import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import test from 'node:test'

const read = (name) => JSON.parse(fs.readFileSync(path.resolve(name), 'utf8'))
const review = read('reports/n3-quality-audit/grammar-source-2018-07-m1-review.json')
const full = read('data/jlpt_n3_toan_master.json')
const standalone = read('data/jlpt_full_master.json')

const fullExam = full.find((exam) => exam.id === 'toan-n3-201807-full')
const fullPart = fullExam?.parts.find((part) => part.id === 'toan_part_2018_07_m2_g1')
const standaloneExam = standalone.find((exam) => exam.id === 'cm2u2wyk900j8134i65mmhnr8-grammar-reading')
const standalonePart = standaloneExam?.parts.find((part) => part.title === 'Mondai 1')

test('07/2018 grammar questions 43–45 match the source text, stored answer, and both study views', () => {
  assert.ok(fullPart)
  assert.ok(standalonePart)
  assert.deepEqual(review.secondaryAnswerKey.answers, [4, 1, 2, 4, 2, 3, 3, 2, 3, 1, 4, 1, 2])
  assert.equal(review.secondaryAnswerKey.allStoredAnswersMatch, true)
  assert.deepEqual(review.secondaryAnswerKey.answersForReviewedQuestions, [2, 3, 1])
  assert.equal(review.secondaryAnswerKey.officialKeyEstablished, false)

  for (const item of review.questions) {
    const fullQuestion = fullPart.questions.find((question) => question.id === item.fullExamQuestionId)
    const standaloneQuestion = standalonePart.questions.find((question) => question.id === item.standaloneQuestionId)
    assert.ok(fullQuestion)
    assert.ok(standaloneQuestion)
    assert.deepEqual(
      fullQuestion.options.map((option) => option.replace(/^\s*[1-4]\s*/u, '').trim()),
      item.options
    )
    assert.deepEqual(
      standaloneQuestion.options.map((option) => (typeof option === 'string' ? option : option.text)),
      item.options
    )
    assert.equal(fullQuestion.correctAnswer, item.answer)
    assert.equal(Number(standaloneQuestion.correctAnswer), item.answer)
    assert.equal(standaloneQuestion.explanation, fullQuestion.explanation)
    assert.match(fullQuestion.explanation, /Dịch:/u)
    assert.match(fullQuestion.explanation, new RegExp(`Đáp án ${item.answer}`))
  }

  assert.equal(review.questions[0].options[2], 'コピーしたらいかがですか')
  assert.equal(review.questions[1].options[1], 'ずつなら')
  assert.equal(review.questions[2].options[2], '行っただろう')

  for (let index = 0; index < review.secondaryAnswerKey.answers.length; index += 1) {
    const number = index + 36
    assert.equal(
      fullPart.questions.find((question) => question.number === number)?.correctAnswer,
      review.secondaryAnswerKey.answers[index]
    )
    assert.equal(
      Number(standalonePart.questions.find((question) => question.number === number)?.correctAnswer),
      review.secondaryAnswerKey.answers[index]
    )
  }
})
