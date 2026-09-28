import assert from 'node:assert/strict'
import fs from 'node:fs'
import test from 'node:test'
import { NhaiKanjiService } from './nhaikanji-service.mjs'

const readJson = (path) => JSON.parse(fs.readFileSync(path, 'utf8'))
const cleanOption = (option) => String(typeof option === 'object' && option ? option.text : option)
  .normalize('NFKC')
  .replace(/^\s*[1-4][.)．、\s　]*/u, '')
  .replace(/[\s　]/gu, '')

test('N3 July 2024 vocabulary M5 questions 31–35 are source-aligned and served with option-by-option explanations', () => {
  const mock = readJson('data/jlpt_n3_toan_master.json').find(({ id }) => id === 'toan-n3-202407-full')
  const section = readJson('data/jlpt_full_master.json').find(({ id }) => id === 'cm2u2yale01jo134i8wwru1oo-vocab')
  const curated = readJson('data/jlpt_n3_explanations_curated.json')
  const report = readJson('reports/n3-quality-audit/vocabulary-2024-07-m5-review.json')
  const served = new NhaiKanjiService().getJlptExamDetail(section.id)
  assert.ok(mock && section && served)

  const questionsByNumber = (exam) => new Map(exam.parts.flatMap(({ questions }) => questions || []).map((question) => [Number(question.number), question]))
  const mockQuestions = questionsByNumber(mock)
  const sectionQuestions = questionsByNumber(section)
  const servedQuestions = questionsByNumber(served)
  const keys = new Map([[31, 4], [32, 3], [33, 4], [34, 2], [35, 1]])
  assert.equal(report.answerKeysChanged, 0)
  assert.deepEqual(report.answers, { 31: 4, 32: 3, 33: 4, 34: 2, 35: 1 })

  for (const [number, key] of keys) {
    const fullQuestion = mockQuestions.get(number)
    const standaloneQuestion = sectionQuestions.get(number)
    const servedQuestion = servedQuestions.get(number)
    assert.ok(fullQuestion && standaloneQuestion && servedQuestion, `Question ${number} must exist in both corpora and service output.`)
    assert.equal(Number(fullQuestion.correctAnswer ?? fullQuestion.answer), key)
    assert.equal(Number(standaloneQuestion.answer ?? standaloneQuestion.correctAnswer), key)
    assert.deepEqual(standaloneQuestion.options.map(cleanOption), fullQuestion.options.map(cleanOption))
    assert.equal(standaloneQuestion.explanation, fullQuestion.explanation)
    assert.equal(servedQuestion.explanation, standaloneQuestion.explanation)
    assert.equal(curated[fullQuestion.id], standaloneQuestion.explanation)
    assert.match(standaloneQuestion.explanation, /Đáp án tham khảo/u)
    for (let option = 1; option <= 4; option++) assert.match(standaloneQuestion.explanation, new RegExp('^' + option + '\\.', 'mu'))
    assert.ok((standaloneQuestion.explanation.match(/“[^”]+”/gu) || []).length >= 3, `Question ${number} should translate its choices or key sentence.`)
  }

  assert.match(sectionQuestions.get(31).options[1].text, /^はさみが/u)
  assert.match(sectionQuestions.get(31).options[2].text, /私の知識がない人/u)
  assert.match(sectionQuestions.get(32).options[1].text, /100年/u)
  assert.match(sectionQuestions.get(32).options[3].text, /会社内で/u)
  assert.match(sectionQuestions.get(35).options[2].text, /^デパートで買い物したとき/u)
  assert.match(sectionQuestions.get(34).explanation, /có thể dùng nếu nhân viên thực sự rối\/vội/u)
  assert.match(sectionQuestions.get(32).explanation, /có thể gợi nghĩa bóng/u)
})
