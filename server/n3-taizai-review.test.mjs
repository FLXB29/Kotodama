import assert from 'node:assert/strict'
import fs from 'node:fs'
import test from 'node:test'
import { NhaiKanjiService } from './nhaikanji-service.mjs'

const readJson = (path) => JSON.parse(fs.readFileSync(path, 'utf8'))
const questions = (exam) => exam.parts.flatMap((part) => part.questions || [])
const cleanOption = (option) => {
  const value = typeof option === 'object' && option ? option.text : option
  return String(value).normalize('NFKC').replace(/^\s*[1-4][.)．、\s　]*/u, '').replace(/[。.]$/u, '').trim()
}

test('reviewed 滞在 explanations preserve keys and explain ambiguity in both exam records', () => {
  const fullExams = readJson('data/jlpt_n3_toan_master.json')
  const sectionExams = readJson('data/jlpt_full_master.json')
  const report = readJson('reports/n3-quality-audit/vocabulary-taizai-2017-07-2020-12-review.json')
  const service = new NhaiKanjiService()
  const cases = [
    {
      number: 33,
      answer: 2,
      fullExamId: 'toan-n3-201707-full',
      sectionExamId: 'cm2u2wq1c00ck134imolbo8ac-vocab',
      required: ['Dịch:', 'đều có thể hiểu', 'không nên học rằng 「滞在」 bắt buộc'],
    },
    {
      number: 35,
      answer: 4,
      fullExamId: 'toan-n3-202012-full',
      sectionExamId: 'cm2u2xg4300wm134izpbjrysi-vocab',
      required: ['Dịch:', 'không có quy tắc cứng', 'hai bảng khóa tham khảo'],
    },
  ]

  assert.equal(report.answerKeysChanged, 0)
  for (const row of cases) {
    const fullExam = fullExams.find(({ id }) => id === row.fullExamId)
    const sectionExam = sectionExams.find(({ id }) => id === row.sectionExamId)
    assert.ok(fullExam, `Missing full exam ${row.fullExamId}`)
    assert.ok(sectionExam, `Missing standalone exam ${row.sectionExamId}`)
    const fullQuestion = questions(fullExam).find((question) => question.number === row.number)
    const sectionQuestion = questions(sectionExam).find((question) => question.number === row.number)
    assert.ok(fullQuestion && sectionQuestion, `Missing question ${row.number}`)
    assert.equal(Number(fullQuestion.correctAnswer ?? fullQuestion.answer), row.answer)
    assert.equal(Number(sectionQuestion.correctAnswer ?? sectionQuestion.answer), row.answer)
    assert.deepEqual(sectionQuestion.options.map(cleanOption), fullQuestion.options.map(cleanOption))
    assert.equal(sectionQuestion.explanation, fullQuestion.explanation)
    for (let option = 1; option <= 4; option++) {
      assert.match(fullQuestion.explanation, new RegExp(`^${option}\\.`, 'mu'))
    }
    assert.equal((fullQuestion.explanation.match(/Dịch:/gu) || []).length, 4, 'Each option needs its own translation.')
    for (const phrase of row.required) assert.ok(fullQuestion.explanation.includes(phrase), `Missing nuance: ${phrase}`)

    const served = service.getJlptExamDetail(row.sectionExamId)
    const servedQuestion = questions(served).find((question) => question.number === row.number)
    assert.equal(servedQuestion.explanation, fullQuestion.explanation)
    assert.equal(Number(servedQuestion.correctAnswer ?? servedQuestion.answer), row.answer)
  }
})
