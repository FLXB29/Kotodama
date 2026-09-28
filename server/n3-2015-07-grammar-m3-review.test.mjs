import assert from 'node:assert/strict'
import fs from 'node:fs'
import test from 'node:test'
import { NhaiKanjiService } from './nhaikanji-service.mjs'

const readJson = (file) => JSON.parse(fs.readFileSync(file, 'utf8'))
const answerSequence = [1, 3, 2, 1, 2]
const expectedPassageFragments = [
  '残り時間が11分になったとき',
  'そのバスケットボール部は22点の差で(19)。',
  '「あきらめなければ、できることもあるかもしれない」と(21)。',
  '(22)が生まれたり、できなかったことができたりします。',
  '私にあきらめないでがんばる力をくれます。(23)。',
]
const review = readJson('reports/n3-quality-audit/grammar-m3-2015-07-review.json')
const curated = readJson('data/jlpt_n3_explanations_curated.json')
const fullExam = readJson('data/jlpt_n3_toan_master.json').find((exam) => exam.id === 'toan-n3-201507-full')
const sectionExam = readJson('data/jlpt_full_master.json').find(
  (exam) => exam.id === 'cm2u2w9ag0000134idizwckzy-grammar-reading'
)

const getMondai3 = (exam) =>
  exam.parts.find(
    (part) => part.id === 'toan_part_2015_07_m2_g3' || part.questions?.some((q) => Number(q.number) === 54)
  )
const getQuestions = (part) =>
  part.questions
    .filter((question) => Number(question.number) >= 54 && Number(question.number) <= 58)
    .sort((a, b) => Number(a.number) - Number(b.number))
const getOptionText = (option) =>
  String(typeof option === 'string' ? option : option.text)
    .replace(/^\s*\d+[.．、)）]?\s*/u, '')
    .trim()

test('July 2015 Grammar Mondai 3 restores the full passage and source-correct final distractor', () => {
  assert.ok(fullExam)
  assert.ok(sectionExam)
  const canonicalPart = getMondai3(fullExam)
  const standalonePart = getMondai3(sectionExam)
  assert.ok(canonicalPart)
  assert.ok(standalonePart)

  for (const part of [canonicalPart, standalonePart]) {
    for (const fragment of expectedPassageFragments) assert.ok(part.passage.includes(fragment))
  }

  const canonicalQuestions = getQuestions(canonicalPart)
  const standaloneQuestions = getQuestions(standalonePart)
  assert.equal(canonicalQuestions.length, 5)
  assert.equal(standaloneQuestions.length, 5)
  assert.deepEqual(
    canonicalQuestions.map((question) => Number(question.correctAnswer ?? question.answer)),
    answerSequence
  )
  assert.equal(getOptionText(canonicalQuestions[4].options[3]), '嫌いだという点です')
  assert.equal(getOptionText(standaloneQuestions[4].options[3]), '嫌いだという点です')
  assert.deepEqual(
    review.questions.map((question) => question.answer),
    answerSequence
  )
  assert.equal(review.optionCorrections.length, 1)
  assert.equal(review.ambiguityReview.storedAnswer, 1)
  assert.match(review.ambiguityReview.ambiguity, /nonofficial key/u)
})

test('all five July 2015 cloze explanations cover each choice and disclose question 19 ambiguity', () => {
  const canonicalQuestions = getQuestions(getMondai3(fullExam))
  const standaloneQuestions = getQuestions(getMondai3(sectionExam))
  canonicalQuestions.forEach((question, index) => {
    const explanation = question.explanation
    assert.ok(explanation)
    assert.match(explanation, new RegExp(`^Đáp án ${answerSequence[index]}`, 'u'))
    assert.match(explanation, /Dịch câu chứa chỗ trống:/u)
    assert.match(explanation, /Ghi nhớ:/u)
    for (let choice = 1; choice <= 4; choice += 1) {
      assert.match(explanation, new RegExp(`(?:^|\\n)${choice}\\.`, 'u'))
    }
    if (index === 0) assert.match(explanation, /độ mơ hồ/u)
    assert.equal(standaloneQuestions[index].explanation, explanation)
    assert.equal(curated[question.id], explanation)
    assert.equal(curated[standaloneQuestions[index].id], explanation)
  })
})

test('the NhaiKanji service returns the July 2015 passage and explanations in both exam views', () => {
  const service = new NhaiKanjiService()
  const fullView = service.getJlptExamDetail(fullExam.id)
  const sectionView = service.getJlptExamDetail(sectionExam.id)
  for (const view of [fullView, sectionView]) {
    const passage = view.parts.find((part) => part.passage?.includes('私の好きな言葉'))?.passage
    assert.ok(passage?.includes('22点の差で(19)'))
    const byNumber = new Map(
      view.parts.flatMap((part) => part.questions || []).map((question) => [Number(question.number), question])
    )
    for (let number = 54; number <= 58; number += 1) {
      const question = byNumber.get(number)
      assert.ok(question?.explanation, `${view.title}: question ${number} has an explanation.`)
      assert.match(question.explanation, /Dịch câu chứa chỗ trống:/u)
    }
  }
})
