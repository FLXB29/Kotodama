import assert from 'node:assert/strict'
import fs from 'node:fs'
import test from 'node:test'
import { NhaiKanjiService } from './nhaikanji-service.mjs'

const readJson = (path) => JSON.parse(fs.readFileSync(path, 'utf8'))
const normalizeOption = (option) => String(typeof option === 'object' && option ? option.text : option)
  .normalize('NFKC')
  .replace(/^\s*[1-4][.)．、\s　]*/u, '')
  .replace(/[\s　]/gu, '')

test('N3 July 2023 vocabulary M5 questions 31–35 are synchronized and served with option-by-option explanations', () => {
  const mock = readJson('data/jlpt_n3_toan_master.json').find(({ id }) => id === 'toan-n3-202307-full')
  const section = readJson('data/jlpt_full_master.json').find(({ id }) => id === 'cm2u2y1xl01d2134ilubjx79d-vocab')
  const curated = readJson('data/jlpt_n3_explanations_curated.json')
  const report = readJson('reports/n3-quality-audit/vocabulary-2023-07-m5-review.json')
  const served = new NhaiKanjiService().getJlptExamDetail(section.id)
  assert.ok(mock && section && served)

  const byNumber = (exam) => new Map(exam.parts.flatMap(({ questions }) => questions || []).map((question) => [Number(question.number), question]))
  const mockQuestions = byNumber(mock)
  const sectionQuestions = byNumber(section)
  const servedQuestions = byNumber(served)
  const expectedAnswers = { 31: 2, 32: 1, 33: 3, 34: 2, 35: 4 }
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
    assert.ok((sectionQuestion.explanation.match(/“[^”]+”/gu) || []).length >= 3, `question ${number} should translate the target usage and choices`)
  }

  assert.match(sectionQuestions.get(31).options[3].text, /家賃/u)
  assert.match(sectionQuestions.get(31).options[3].text, /5,000/u)
  assert.match(sectionQuestions.get(33).options[1].text, /ドレッシング/u)
  assert.doesNotMatch(sectionQuestions.get(33).options[1].text, /ドレツシング/u)
  assert.match(sectionQuestions.get(35).explanation, /Chủ thể của にこにこした bị lược bỏ/u)
  assert.match(sectionQuestions.get(35).explanation, /Câu vẫn có thể hiểu/u)
  assert.match(sectionQuestions.get(35).explanation, /không hợp lý trong ngữ cảnh thông thường/u)
})
