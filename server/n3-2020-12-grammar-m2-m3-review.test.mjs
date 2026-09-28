import assert from 'node:assert/strict'
import fs from 'node:fs'
import test from 'node:test'
import { NhaiKanjiService } from './nhaikanji-service.mjs'

const readJson = (relativePath) => JSON.parse(fs.readFileSync(relativePath, 'utf8'))
const fullExamId = 'toan-n3-202012-full'
const sectionExamId = 'cm2u2xg4300wm134izpbjrysi-grammar-reading'
const expectedAnswers = [1, 3, 2, 3, 4, 4, 1, 2, 3]
const questionNumbers = Array.from({ length: 9 }, (_, index) => index + 49)

const fullMaster = readJson('data/jlpt_n3_toan_master.json')
const sectionMaster = readJson('data/jlpt_full_master.json')
const curated = readJson('data/jlpt_n3_explanations_curated.json')
const report = readJson('reports/n3-quality-audit/grammar-2020-12-m2-m3-review.json')
const fullExam = fullMaster.find((exam) => exam.id === fullExamId)
const sectionExam = sectionMaster.find((exam) => exam.id === sectionExamId)
const questionsByNumber = (exam) =>
  new Map(exam.parts.flatMap((part) => part.questions || []).map((question) => [Number(question.number), question]))

test('N3 December 2020 grammar ★ and cloze keys match both stored exams and published reference sequence', () => {
  assert.ok(fullExam, `Missing ${fullExamId}`)
  assert.ok(sectionExam, `Missing ${sectionExamId}`)
  assert.deepEqual(report.questionNumbers, questionNumbers)
  assert.deepEqual(report.answerKeys, expectedAnswers)
  assert.equal(report.answerKeysChanged, 0)
  assert.equal(report.rows.length, questionNumbers.length)

  for (const number of questionNumbers) {
    const fullQuestion = questionsByNumber(fullExam).get(number)
    const sectionQuestion = questionsByNumber(sectionExam).get(number)
    assert.ok(fullQuestion && sectionQuestion, `Question ${number} must exist in both records`)
    assert.equal(Number(fullQuestion.correctAnswer ?? fullQuestion.answer), expectedAnswers[number - 49])
    assert.equal(Number(sectionQuestion.correctAnswer ?? sectionQuestion.answer), expectedAnswers[number - 49])
    assert.equal(fullQuestion.explanation, curated[fullQuestion.id])
    assert.equal(sectionQuestion.explanation, curated[fullQuestion.id] || fullQuestion.explanation)
    assert.match(fullQuestion.explanation, /Dịch/u)
    for (let choice = 1; choice <= 4; choice++) {
      assert.match(
        fullQuestion.explanation,
        new RegExp(`^${choice}\\.`, 'mu'),
        `Missing choice/fragment ${choice} at ${number}`
      )
    }
  }
  const fullQuestionsByNumber = questionsByNumber(fullExam)
  const sectionQuestionsByNumber = questionsByNumber(sectionExam)
  assert.deepEqual(
    fullQuestionsByNumber.get(49).options.map((option) => (typeof option === 'string' ? option : option.text)),
    ['などの', 'スパゲティ', '料理も', 'だけでなく']
  )
  assert.deepEqual(
    sectionQuestionsByNumber.get(49).options.map((option) => option.text),
    ['などの', 'スパゲティ', '料理も', 'だけでなく']
  )
  assert.equal(sectionQuestionsByNumber.get(49).script.replace(/<[^>]*>/gu, ''), 'だけでなく スパゲティ などの 料理も')
  assert.equal(sectionQuestionsByNumber.get(50).script.replace(/<[^>]*>/gu, ''), 'はじまる まで あと3分 しかない')
  for (const question of [fullQuestionsByNumber.get(52), sectionQuestionsByNumber.get(52)]) {
    assert.match(JSON.stringify(question), /サッカークラブの練習/u)
    assert.doesNotMatch(JSON.stringify(question), /サッカークラップ/u)
  }
})

test('N3 December 2020 star answers agree with stored fragment order and third-party answer key', () => {
  const stars = report.rows.filter((row) => row.order)
  assert.deepEqual(
    stars.map((row) => row.number),
    [49, 50, 51, 52, 53]
  )
  assert.deepEqual(
    report.starOrders.map((row) => row.starredChoice),
    expectedAnswers.slice(0, 5)
  )
  for (const row of stars) {
    const question = questionsByNumber(fullExam).get(row.number)
    assert.deepEqual(question.starCorrectOrder, row.order)
    assert.equal(question.starPosition, 2)
    assert.equal(question.starCorrectOrder[question.starPosition], expectedAnswers[row.number - 49])
  }
  assert.equal(report.sources[0].url, 'https://www.tiengnhatdongian.com/dap-an-jlpt-n3-12-2020/')
  assert.match(report.sources[0].type, /Not an official/u)
})

test('NhaiKanji service returns reviewed explanations in both the full and standalone exam records', () => {
  const service = new NhaiKanjiService()
  for (const examId of [fullExamId, sectionExamId]) {
    const served = service.getJlptExamDetail(examId)
    assert.ok(served, `Service should return ${examId}`)
    const servedQuestions = questionsByNumber(served)
    for (const number of questionNumbers) {
      const question = servedQuestions.get(number)
      assert.ok(question, `Service response missing question ${number} in ${examId}`)
      assert.match(question.explanation, /Dịch/u)
      for (let choice = 1; choice <= 4; choice++) {
        assert.match(question.explanation, new RegExp(`^${choice}\\.`, 'mu'))
      }
    }
  }
})
