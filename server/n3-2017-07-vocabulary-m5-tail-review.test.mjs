import assert from 'node:assert/strict'
import fs from 'node:fs'
import test from 'node:test'
import { NhaiKanjiService } from './nhaikanji-service.mjs'

const readJson = (path) => JSON.parse(fs.readFileSync(path, 'utf8'))
const questionsOf = (exam) => exam.parts.flatMap((part) => part.questions || [])
const optionText = (option) => String(typeof option === 'object' && option ? option.text : option)
const cleanOption = (option) =>
  optionText(option).normalize('NFKC').replace(/^\s*[1-4][.)．、\s　]*/u, '').replace(/[。.]$/u, '').trim()

test('N3 July 2017 vocabulary M5 questions 34–35 have source-aligned text and full explanations', () => {
  const mockExams = readJson('data/jlpt_n3_toan_master.json')
  const sectionExams = readJson('data/jlpt_full_master.json')
  const curated = readJson('data/jlpt_n3_explanations_curated.json')
  const report = readJson('reports/n3-quality-audit/vocabulary-2017-07-m5-q34-q35-review.json')
  const mockExam = mockExams.find(({ id }) => id === 'toan-n3-201707-full')
  const sectionExam = sectionExams.find(({ id }) => id === 'cm2u2wq1c00ck134imolbo8ac-vocab')
  assert.ok(mockExam && sectionExam)
  const mockQuestions = new Map(questionsOf(mockExam).map((question) => [question.number, question]))
  const sectionQuestions = new Map(questionsOf(sectionExam).map((question) => [question.number, question]))
  const service = new NhaiKanjiService()
  const servedQuestions = new Map(questionsOf(service.getJlptExamDetail(sectionExam.id)).map((question) => [question.number, question]))
  const expectedAnswers = new Map([[34, 1], [35, 2]])
  const requiredTerms = new Map([
    [34, ['チクタク', '震える', '揺れる']],
    [35, ['焦げる', '花が枯れる', '故障する', '雪が溶ける']]
  ])

  assert.equal(report.answerKeysChanged, 0)
  for (const [number, answer] of expectedAnswers) {
    const mock = mockQuestions.get(number)
    const section = sectionQuestions.get(number)
    const served = servedQuestions.get(number)
    assert.ok(mock && section && served, 'Question ' + number + ' must exist in both data sets and the API.')
    assert.equal(Number(mock.correctAnswer ?? mock.answer), answer)
    assert.equal(Number(section.correctAnswer ?? section.answer), answer)
    assert.deepEqual(section.options.map(cleanOption), mock.options.map(cleanOption))
    assert.equal(section.explanation, mock.explanation)
    assert.equal(section.explanation, served.explanation)
    assert.equal(section.explanation, curated[mock.id])
    assert.ok(section.explanation.includes('Dịch cả câu:'))
    assert.equal((section.explanation.match(/Dịch:/gu) || []).length, 4)
    for (let option = 1; option <= 4; option++) {
      assert.match(section.explanation, new RegExp('^' + option + '\\.', 'mu'))
    }
    for (const term of requiredTerms.get(number)) assert.ok(section.explanation.includes(term), 'Missing contrast: ' + term)
  }

  assert.match(sectionQuestions.get(34).options[1].text, /^部屋/u)
  assert.match(sectionQuestions.get(35).options[0].text, /肉が黒く/u)
  assert.ok(mockQuestions.get(35).options[2].includes('いろいろな所'))
})
