import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'

const exams = JSON.parse(fs.readFileSync(path.resolve('data/jlpt_n3_toan_master.json'), 'utf8'))
const curated = JSON.parse(fs.readFileSync(path.resolve('data/jlpt_n3_explanations_curated.json'), 'utf8'))
const report = JSON.parse(
  fs.readFileSync(path.resolve('reports/n3-quality-audit/vocabulary-source-2016-12-q26-q28-q30-review.json'), 'utf8')
)
const exam = exams.find((item) => item.id === 'toan-n3-201612-full')
assert.ok(exam)
const required = {
  toan_q_2016_12_26: { answer: 4, meanings: ['dừng lại', 'lay động', 'bị bẩn', 'phát sáng'] },
  toan_q_2016_12_27: { answer: 1, meanings: ['đáng tiếc/thất vọng', 'vui mừng', 'ngạc nhiên', 'yên tâm'] },
  toan_q_2016_12_28: { answer: 3, meanings: ['nhiều loại', 'một chút', 'dĩ nhiên', 'luôn luôn'] },
  toan_q_2016_12_30: {
    answer: 2,
    meanings: ['không được ngồi', 'không được băng qua', 'không được chạy', 'không được đi vào'],
  },
}
for (const [id, expected] of Object.entries(required)) {
  const question = exam.parts.flatMap((part) => part.questions || []).find((item) => item.id === id)
  assert.ok(question)
  assert.equal(Number(question.correctAnswer ?? question.answer), expected.answer)
  assert.equal(question.explanation, curated[id])
  for (const meaning of expected.meanings) {
    assert.ok(question.explanation.includes(meaning), `${id} is missing option meaning: ${meaning}`)
  }
  assert.doesNotMatch(question.explanation, /簧|撰|詩化|Hán Việt|Chưa khớp/u)
  const row = report.questions.find((item) => item.id === id)
  assert.ok(row)
  assert.equal(row.answer, expected.answer)
  assert.equal(row.explanationChecks.eachOptionTranslatedInContext, true)
}
assert.equal(report.sourcePdf.printedPage, 3)
assert.equal(report.sourcePdf.officialAnswerKeyPresent, false)

console.log(
  'Verified source keys, translations and contextual meanings of all four options for December 2016 vocabulary questions 26–28 and 30.'
)
