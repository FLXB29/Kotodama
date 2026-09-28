import assert from 'node:assert/strict'
import fs from 'node:fs'
import test from 'node:test'
import { NhaiKanjiService } from './nhaikanji-service.mjs'

const readJson = (path) => JSON.parse(fs.readFileSync(path, 'utf8'))
const normalizeOption = (option) => String(typeof option === 'object' && option ? option.text : option)
  .normalize('NFKC')
  .replace(/^\s*[1-4](?:[.)．、]\s*|\s+)/u, '')
  .replace(/[\s　]/gu, '')
  .replace(/[。.]+$/u, '')

test('N3 December 2021 vocabulary M5 questions 31–35 are synchronized and served with reviewed explanations', () => {
  const mock = readJson('data/jlpt_n3_toan_master.json').find(({ id }) => id === 'toan-n3-202112-full')
  const section = readJson('data/jlpt_full_master.json').find(({ id }) => id === 'cm2u2xosv0138134ib0bvpy32-vocab')
  const curated = readJson('data/jlpt_n3_explanations_curated.json')
  const report = readJson('reports/n3-quality-audit/vocabulary-2021-12-m5-review.json')
  const served = section && new NhaiKanjiService().getJlptExamDetail(section.id)
  assert.ok(mock && section && served)

  const byNumber = (exam) => new Map(exam.parts.flatMap(({ questions }) => questions || []).map((question) => [Number(question.number), question]))
  const mockQuestions = byNumber(mock)
  const sectionQuestions = byNumber(section)
  const servedQuestions = byNumber(served)
  const expectedAnswers = { 31: 1, 32: 3, 33: 1, 34: 3, 35: 4 }
  assert.equal(report.answerKeysChanged, 0)
  assert.deepEqual(report.answers, expectedAnswers)
  assert.equal(report.sourceConflicts.length, 1)
  assert.ok(report.sourceConflicts[0].variants.some((text) => text.includes('7時')))
  assert.ok(report.sourceConflicts[0].variants.some((text) => text.includes('10時')))
  assert.match(report.limitations.join(' '), /original JLPT question scan/u)

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
    assert.match(sectionQuestion.explanation, /^Đáp án \d/u)
    assert.match(sectionQuestion.explanation, /Dịch:/u)
    for (let option = 1; option <= 4; option += 1) assert.match(sectionQuestion.explanation, new RegExp(`^${option}\\.`, 'mu'))
    assert.ok((sectionQuestion.explanation.match(/“[^”]+”/gu) || []).length >= 5, `question ${number} should translate the target sentence and all choices`)
  }

  assert.match(sectionQuestions.get(31).options[0].text, /7\s*時/u)
  assert.match(sectionQuestions.get(31).explanation, /lúc 7 giờ/u)
  assert.match(sectionQuestions.get(32).explanation, /đã qua sử dụng/u)
  assert.match(sectionQuestions.get(33).explanation, /vượt người chạy phía trước/u)
  assert.match(sectionQuestions.get(34).explanation, /mẫu cách điền đơn đăng ký/u)
  assert.match(sectionQuestions.get(35).explanation, /cơ thể mệt mỏi/u)
})
