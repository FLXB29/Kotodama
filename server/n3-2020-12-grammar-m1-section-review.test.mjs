import assert from 'node:assert/strict'
import fs from 'node:fs'
import test from 'node:test'
import { NhaiKanjiService } from './nhaikanji-service.mjs'

const readJson = (file) => JSON.parse(fs.readFileSync(file, 'utf8'))
const cleanOption = (option) => {
  const value = typeof option === 'object' && option ? option.text : option
  return String(value)
    .normalize('NFKC')
    .replace(/^\s*[1-4][.)．、\s　]*/u, '')
    .trim()
}
const getQuestions = (exam) => exam.parts.flatMap((part) => part.questions || [])

test('N3 December 2020 standalone grammar questions 36–57 serve complete explanations', () => {
  const fullMock = readJson('data/jlpt_n3_toan_master.json').find((exam) => exam.id === 'toan-n3-202012-full')
  const sectionExam = readJson('data/jlpt_full_master.json').find(
    (exam) => exam.id === 'cm2u2xg4300wm134izpbjrysi-grammar-reading'
  )
  const curated = readJson('data/jlpt_n3_explanations_curated.json')
  const report = readJson('reports/n3-quality-audit/grammar-2020-12-m1-section-review.json')
  assert.ok(fullMock, 'Missing N3 December 2020 full exam.')
  assert.ok(sectionExam, 'Missing N3 December 2020 standalone grammar-reading exam.')

  const fullQuestions = getQuestions(fullMock)
  const sectionQuestions = getQuestions(sectionExam)
  const sectionGrammar = sectionQuestions.filter((question) => question.number >= 36 && question.number <= 57)
  assert.equal(sectionGrammar.length, 22)
  const served = new NhaiKanjiService().getJlptExamDetail(sectionExam.id)
  const servedGrammar = getQuestions(served).filter((question) => question.number >= 36 && question.number <= 57)
  assert.equal(servedGrammar.length, 22)
  for (const question of servedGrammar) {
    const explanation = question.explanation || curated[question.id] || ''
    assert.ok(explanation.length > 200, `Question ${question.number}: explanation is incomplete.`)
    assert.match(
      explanation,
      /Dịch(?: đoạn| câu chứa chỗ trống)?:/u,
      `Question ${question.number}: missing Vietnamese translation.`
    )
    for (let choice = 1; choice <= 4; choice++) {
      assert.match(
        explanation,
        new RegExp(`^${choice}\\.`, 'mu'),
        `Question ${question.number}: missing option ${choice}.`
      )
    }
  }

  const reviewed = [
    { number: 44, answer: 4 },
    { number: 45, answer: 1 },
    { number: 48, answer: 1 },
  ]
  assert.deepEqual(
    report.questionNumbers,
    reviewed.map(({ number }) => number)
  )
  assert.equal(report.answerKeysChanged, 0)
  for (const { number, answer } of reviewed) {
    const source = fullQuestions.find((question) => question.number === number)
    const section = sectionQuestions.find((question) => question.number === number)
    assert.ok(source && section, `Missing question ${number} from an exam record.`)
    assert.equal(Number(source.correctAnswer ?? source.answer), answer)
    assert.equal(Number(section.correctAnswer ?? section.answer), answer)
    assert.deepEqual(section.options.map(cleanOption), source.options.map(cleanOption))
    assert.equal(section.explanation, source.explanation)
    assert.equal(section.explanation, curated[source.id] || source.explanation)
    assert.ok(report.rows.some((row) => row.number === number && row.explainsAllChoices))
    if (number === 44) {
      assert.match(source.question, /フライパン/u)
      assert.match(section.question, /フライパン/u)
      assert.doesNotMatch(section.question, /フライバン/u)
      assert.deepEqual(report.rows.find((row) => row.number === 44).sourceTranscriptionCorrection, {
        from: 'フライバン',
        to: 'フライパン',
      })
    }
  }
})
