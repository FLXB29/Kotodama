import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import { NhaiKanjiService } from '../server/nhaikanji-service.mjs'

const master = JSON.parse(fs.readFileSync(path.resolve('data/jlpt_n3_toan_master.json'), 'utf8'))
const curated = JSON.parse(fs.readFileSync(path.resolve('data/jlpt_n3_explanations_curated.json'), 'utf8'))
const report = JSON.parse(
  fs.readFileSync(path.resolve('reports/n3-quality-audit/vocabulary-source-2016-12-q1-q25-review.json'), 'utf8')
)
const exam = master.find((item) => item.id === 'toan-n3-201612-full')
assert.ok(exam)
const questions = exam.parts.flatMap((part) => part.questions || []).filter((question) => question.number <= 35)
assert.equal(questions.length, 35)

const languageCheckedKey = [
  4, 2, 1, 3, 2, 4, 3, 1, 4, 3, 3, 2, 1, 4, 2, 4, 1, 3, 1, 3, 2, 4, 4, 1, 2, 4, 1, 3, 1, 2, 3, 2, 2, 1, 3,
]
const publicTableKey = [
  3, 2, 1, 3, 2, 4, 3, 1, 4, 3, 3, 2, 1, 4, 2, 4, 1, 3, 1, 3, 2, 4, 4, 1, 2, 4, 1, 3, 1, 2, 3, 2, 2, 1, 3,
]
const mismatches = []
for (const question of questions) {
  const number = Number(question.number)
  assert.equal(
    Number(question.correctAnswer ?? question.answer),
    languageCheckedKey[number - 1],
    'Language-checked key at Q' + number
  )
  if (languageCheckedKey[number - 1] !== publicTableKey[number - 1]) mismatches.push(number)
  assert.ok(question.explanation, 'Missing explanation for vocabulary Q' + number)
  assert.equal(curated[question.id], question.explanation, 'Curated and full-exam explanations differ at Q' + number)
}
assert.deepEqual(mismatches, [1])
assert.deepEqual(report.answerKeysMatchReference, {
  matchedCount: 34,
  totalCount: 35,
  mismatch: {
    questionNumber: 1,
    localAndLanguageCheckedAnswer: 4,
    publicTableAnswer: 3,
    resolution:
      'The PDF orders かんきゃく as choice 4, and an independent solution page gives the reading 観客（かんきゃく）. The table entry 3 conflicts with that reading, so answer 4 is retained and the discrepancy is disclosed.',
  },
})
assert.equal(report.questionSource.visuallyComparedInChrome, true)
assert.deepEqual(
  report.editedQuestionNumbers,
  [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25]
)

for (const number of report.editedQuestionNumbers) {
  const question = questions.find((item) => Number(item.number) === number)
  assert.ok(question)
  for (const choice of [1, 2, 3, 4]) {
    assert.ok(question.explanation.includes(choice + '.'), 'Choice ' + choice + ' is not explained for Q' + number)
  }
  assert.match(question.explanation, /Dịch:/u, 'Missing Vietnamese sentence translation at Q' + number)
}

for (const [number, forbidden] of [
  [1, 'quan khách'],
  [2, 'biểu thị'],
  [13, 'vận chuyển ra ngoài'],
  [14, 'mang thai'],
  [16, 'Nghĩa các lựa chọn (từ điển cục bộ)'],
  [18, 'ồn ào'],
  [19, 'Chưa khớp được mục từ'],
  [22, 'Chưa khớp được mục từ'],
  [24, '葫蘆'],
  [25, 'cuộc sống gia đình'],
  [21, 'Nghĩa các lựa chọn (từ điển cục bộ)'],
]) {
  assert.ok(!questions.find((item) => Number(item.number) === number).explanation.includes(forbidden))
}

const service = new NhaiKanjiService()
const section = service.getJlptExamDetail('cm2u2wlnt0097134ira8pl9rk-vocab')
assert.ok(section)
const sectionQuestions = section.parts.flatMap((part) => part.questions || [])
for (const number of questions.filter((question) => question.number <= 30).map((question) => question.number)) {
  const question = sectionQuestions.find((item) => Number(item.number) === number)
  assert.ok(question?.explanation, 'The application did not deliver an explanation for section Q' + number)
}
for (const number of [1, 18, 24, 30]) {
  const source = questions.find((item) => Number(item.number) === number)
  const delivered = sectionQuestions.find((item) => Number(item.number) === number)
  assert.equal(delivered.explanation, source.explanation, 'The application delivered stale explanation for Q' + number)
}

console.log(
  'Verified all 35 vocabulary explanations and keys; 34 public-table matches, with the conflicting Q1 entry transparently resolved from the printed reading and solution page. The application service delivers explanations for Q1–30.'
)
