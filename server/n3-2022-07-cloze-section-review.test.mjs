import assert from 'node:assert/strict'
import test from 'node:test'
import { NhaiKanjiService } from './nhaikanji-service.mjs'

test('July 2022 factory-visit cloze passage has corrected OCR and matching question explanations', () => {
  const service = new NhaiKanjiService()
  const exam = service.getJlptExamDetail('cm2u2xt6n016j134inupqhmlp-grammar-reading')
  assert.ok(exam)
  const part = exam.parts.find((item) => item.questions?.some((question) => Number(question.number) === 53))
  assert.ok(part?.passage)
  assert.match(part.passage, /機械を使って/u)
  assert.doesNotMatch(part.passage, /機会を使って/u)
  assert.match(part.passage, /（19）のはアイスクリームの会社の工場です/u)
  assert.doesNotMatch(part.passage, /できるとこと/u)

  const questions = new Map(part.questions.map((question) => [Number(question.number), question]))
  for (const number of [53, 54, 55, 56]) {
    assert.ok(questions.get(number)?.explanation, `Question ${number} should have its matching explanation.`)
    assert.match(questions.get(number).explanation, /Dịch/u)
  }
  assert.equal(questions.get(55).options[3].text, 'そこ')
  for (const option of [1, 2, 3, 4]) assert.match(questions.get(54).explanation, new RegExp(`^${option}\\.`, 'mu'))
})
