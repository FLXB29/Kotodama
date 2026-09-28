import assert from 'node:assert/strict'
import fs from 'node:fs'
import test from 'node:test'
import { NhaiKanjiService } from './nhaikanji-service.mjs'

const readJson = (path) => JSON.parse(fs.readFileSync(path, 'utf8'))
const questionsOf = (exam) => exam.parts.flatMap((part) => part.questions || [])
const cleanOption = (option) =>
  String(typeof option === 'object' && option ? option.text : option)
    .normalize('NFKC')
    .replace(/^\s*[1-4][.)．、\s　]*/u, '')
    .replace(/[。.]$/u, '')
    .replace(/[\s/]/gu, '')

test('N3 July 2017 vocabulary M5 questions 31–32 match the source and explain every option', () => {
  const mocks = readJson('data/jlpt_n3_toan_master.json')
  const sections = readJson('data/jlpt_full_master.json')
  const curated = readJson('data/jlpt_n3_explanations_curated.json')
  const report = readJson('reports/n3-quality-audit/vocabulary-2017-07-m5-q31-q32-review.json')
  const mockExam = mocks.find(({ id }) => id === 'toan-n3-201707-full')
  const sectionExam = sections.find(({ id }) => id === 'cm2u2wq1c00ck134imolbo8ac-vocab')
  assert.ok(mockExam && sectionExam)
  const mockQuestions = new Map(questionsOf(mockExam).map((question) => [question.number, question]))
  const sectionQuestions = new Map(questionsOf(sectionExam).map((question) => [question.number, question]))
  const servedQuestions = new Map(questionsOf(new NhaiKanjiService().getJlptExamDetail(sectionExam.id)).map((question) => [question.number, question]))
  const answers = new Map([[31, 3], [32, 4]])

  assert.equal(report.answerKeysChanged, 0)
  for (const [number, answer] of answers) {
    const mock = mockQuestions.get(number)
    const section = sectionQuestions.get(number)
    const served = servedQuestions.get(number)
    assert.ok(mock && section && served, 'Question ' + number + ' must exist in both records and the API.')
    assert.equal(Number(mock.correctAnswer ?? mock.answer), answer)
    assert.equal(Number(section.correctAnswer ?? section.answer), answer)
    assert.deepEqual(section.options.map(cleanOption), mock.options.map(cleanOption))
    assert.equal(section.explanation, mock.explanation)
    assert.equal(section.explanation, served.explanation)
    assert.equal(section.explanation, curated[mock.id])
    assert.ok(section.explanation.includes('Dịch cả câu'))
    assert.equal((section.explanation.match(/Dịch:/gu) || []).length, 4)
    for (let option = 1; option <= 4; option++) {
      assert.match(section.explanation, new RegExp('^' + option + '\\.', 'mu'))
    }
  }

  assert.match(sectionQuestions.get(32).options[0].text, /^友人/u)
  assert.doesNotMatch(sectionQuestions.get(32).options[1].text, /\/u/u)
  assert.match(sectionQuestions.get(32).options[3].text, /^先輩/u)
  assert.ok(sectionQuestions.get(31).explanation.includes('Ý này hiểu được'))
  assert.ok(sectionQuestions.get(31).explanation.includes('kém tự nhiên'))
  assert.ok(sectionQuestions.get(32).explanation.includes('アドバイスを受け入れる'))
  assert.ok(sectionQuestions.get(32).explanation.includes('仕事を引き受ける'))
})
