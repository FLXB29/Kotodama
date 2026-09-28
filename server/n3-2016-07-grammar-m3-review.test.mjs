import assert from 'node:assert/strict'
import fs from 'node:fs'
import test from 'node:test'
import { NhaiKanjiService } from './nhaikanji-service.mjs'

const readJson = (file) => JSON.parse(fs.readFileSync(file, 'utf8'))
const answerSequence = [1, 2, 1, 4, 3]
const review = readJson('reports/n3-quality-audit/grammar-m3-2016-07-review.json')
const fullExam = readJson('data/jlpt_n3_toan_master.json').find((exam) => exam.id === 'toan-n3-201607-full')
const sectionExam = readJson('data/jlpt_full_master.json').find(
  (exam) => exam.id === 'cm2u2wh2e005t134ip8znt3dd-grammar-reading'
)

const questionsInRange = (exam) =>
  exam.parts
    .flatMap((part) => part.questions || [])
    .filter((question) => Number(question.number) >= 54 && Number(question.number) <= 58)
    .sort((a, b) => Number(a.number) - Number(b.number))

test('July 2016 Grammar Mondai 3 has full translations and explanations for all four choices', () => {
  assert.ok(fullExam)
  assert.ok(sectionExam)
  assert.equal(review.officialKeyEstablished, false)
  assert.equal(review.sourcePdf.printedPageReviewed, 6)
  assert.equal(review.questions.length, 5)

  const canonicalQuestions = questionsInRange(fullExam)
  const standaloneQuestions = questionsInRange(sectionExam)
  assert.equal(canonicalQuestions.length, 5)
  assert.equal(standaloneQuestions.length, 5)
  assert.deepEqual(
    canonicalQuestions.map((question) => Number(question.correctAnswer ?? question.answer)),
    answerSequence
  )

  canonicalQuestions.forEach((question, index) => {
    const explanation = question.explanation
    assert.ok(explanation, `Question ${question.number} has an explanation.`)
    assert.match(explanation, new RegExp(`Đáp án ${answerSequence[index]}`, 'u'))
    assert.match(explanation, /Dịch câu chứa chỗ trống:/u)
    assert.match(explanation, /Ghi nhớ:/u)
    for (let choice = 1; choice <= 4; choice++) {
      assert.match(explanation, new RegExp(`(?:^|\\n)${choice}\\.`, 'u'))
    }
    assert.equal(standaloneQuestions[index].explanation, explanation)
  })
})

test('the NhaiKanji service serves the reviewed July 2016 cloze explanations in both views', () => {
  const service = new NhaiKanjiService()
  const fullView = service.getJlptExamDetail(fullExam.id)
  const sectionView = service.getJlptExamDetail(sectionExam.id)
  for (const view of [fullView, sectionView]) {
    const byNumber = new Map(
      view.parts.flatMap((part) => part.questions || []).map((question) => [Number(question.number), question])
    )
    for (let number = 54; number <= 58; number++) {
      const question = byNumber.get(number)
      assert.ok(question?.explanation, `${view.title}: question ${number} is served with its explanation.`)
      assert.match(question.explanation, /Dịch câu chứa chỗ trống:/u)
    }
  }
})
