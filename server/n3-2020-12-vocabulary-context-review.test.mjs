import test from 'node:test'
import assert from 'node:assert/strict'
import fs from 'node:fs'

const exams = JSON.parse(fs.readFileSync(new URL('../data/jlpt_n3_toan_master.json', import.meta.url), 'utf8'))
const curated = JSON.parse(
  fs.readFileSync(new URL('../data/jlpt_n3_explanations_curated.json', import.meta.url), 'utf8')
)
const report = JSON.parse(
  fs.readFileSync(
    new URL('../reports/n3-quality-audit/vocabulary-2020-12-context-review.json', import.meta.url),
    'utf8'
  )
)
const exam = exams.find((entry) => entry.id === 'toan-n3-202012-full')
const questions = new Map(exam.parts.flatMap((part) => part.questions).map((question) => [question.number, question]))
const answerKey = [4, 3, 2, 1, 3, 1, 4, 4, 1, 2]
const normalize = (value) =>
  String(value || '')
    .normalize('NFKC')
    .replace(/^\s*[1-4][.)．、\s　]*/u, '')
    .replace(/\s+/gu, '')
    .trim()

test('N3 December 2020 vocabulary review preserves the independently cross-checked answers and options', () => {
  for (const [index, row] of report.rows.entries()) {
    const question = questions.get(row.number)
    assert.ok(question)
    assert.equal(question.answer, answerKey[index])
    assert.equal(question.correctAnswer, answerKey[index])
    assert.equal(question.answer, row.answer)
    assert.deepEqual(question.options.map(normalize), row.options.map(normalize))
    assert.equal(row.answerPreserved, true)
  }
})

test('N3 December 2020 contextual vocabulary explains the target, translation, and each distractor', () => {
  assert.equal(report.rows.length, 10)
  for (const row of report.rows) {
    const question = questions.get(row.number)
    const explanation = question.explanation || curated[question.id]
    assert.ok(explanation.startsWith(`Đáp án ${row.answer} —`))
    assert.ok(explanation.includes(row.target))
    assert.match(explanation, /Dịch:/)
    for (let option = 1; option <= 4; option++) assert.ok(explanation.includes(`\n${option}. `))
    assert.doesNotMatch(explanation, /Chưa khớp được mục từ|từ điển cục bộ/u)
  }
})
