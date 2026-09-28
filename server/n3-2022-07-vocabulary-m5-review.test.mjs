import assert from 'node:assert/strict'
import fs from 'node:fs'
import test from 'node:test'
import { NhaiKanjiService } from './nhaikanji-service.mjs'

const readJson = (path) => JSON.parse(fs.readFileSync(path, 'utf8'))
const normalizeOption = (option) => String(typeof option === 'object' && option ? option.text : option)
  .normalize('NFKC')
  .replace(/^\s*[1-4][.)．、\s　]*/u, '')
  .replace(/[\s　]/gu, '')

test('N3 July 2022 vocabulary M5 questions 30–34 are synchronized and served with detailed explanations', () => {
  const mock = readJson('data/jlpt_n3_toan_master.json').find(({ id }) => id === 'toan-n3-202207-full')
  const section = readJson('data/jlpt_full_master.json').find(({ id }) => id === 'cm2u2xt6n016j134inupqhmlp-vocab')
  const curated = readJson('data/jlpt_n3_explanations_curated.json')
  const report = readJson('reports/n3-quality-audit/vocabulary-2022-07-m5-review.json')
  const served = new NhaiKanjiService().getJlptExamDetail(section.id)
  assert.ok(mock && section && served)

  const byNumber = (exam) => new Map(exam.parts.flatMap(({ questions }) => questions || []).map((question) => [Number(question.number), question]))
  const mockQuestions = byNumber(mock)
  const sectionQuestions = byNumber(section)
  const servedQuestions = byNumber(served)
  const expectedAnswers = { 30: 2, 31: 3, 32: 4, 33: 1, 34: 1 }
  assert.equal(report.answerKeysChanged, 0)
  assert.deepEqual(report.answers, expectedAnswers)

  for (const [numberText, key] of Object.entries(expectedAnswers)) {
    const number = Number(numberText)
    const mockQuestion = mockQuestions.get(number)
    const sectionQuestion = sectionQuestions.get(number)
    const servedQuestion = servedQuestions.get(number)
    assert.ok(mockQuestion && sectionQuestion && servedQuestion, `question ${number} must exist in both data sets and the service`)
    assert.equal(Number(mockQuestion.correctAnswer ?? mockQuestion.answer), key)
    assert.equal(Number(sectionQuestion.answer ?? sectionQuestion.correctAnswer), key)
    assert.deepEqual(sectionQuestion.options.map(normalizeOption), mockQuestion.options.map(normalizeOption))
    assert.equal(sectionQuestion.explanation, mockQuestion.explanation)
    assert.equal(servedQuestion.explanation, sectionQuestion.explanation)
    assert.equal(curated[mockQuestion.id], sectionQuestion.explanation)
    assert.match(sectionQuestion.explanation, /^Đáp án tham khảo/u)
    for (let option = 1; option <= 4; option += 1) assert.match(sectionQuestion.explanation, new RegExp(`^${option}\\.`, 'mu'))
    assert.ok((sectionQuestion.explanation.match(/“[^”]+”/gu) || []).length >= 3, `question ${number} should translate its key usage and explain distractors`)
  }

  assert.match(sectionQuestions.get(30).options[1].text, /ことにした/u)
  assert.match(sectionQuestions.get(30).options[1].text, /あしたの登山/u)
  assert.match(sectionQuestions.get(30).options[2].text, /鍵をかける/u)
  assert.doesNotMatch(sectionQuestions.get(30).options[2].text, /眼鏡/u)
  assert.match(sectionQuestions.get(30).explanation, /không phải khẳng định câu bất khả về ngữ pháp/u)
})
