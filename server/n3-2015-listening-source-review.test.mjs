import test from 'node:test'
import assert from 'node:assert/strict'
import fs from 'node:fs'

const master = JSON.parse(fs.readFileSync(new URL('../data/jlpt_n3_toan_master.json', import.meta.url), 'utf8'))
const curated = JSON.parse(
  fs.readFileSync(new URL('../data/jlpt_n3_explanations_curated.json', import.meta.url), 'utf8')
)
const report = JSON.parse(
  fs.readFileSync(new URL('../reports/n3-quality-audit/listening-2015-source-review.json', import.meta.url), 'utf8')
)

const exams = ['toan-n3-201507-full', 'toan-n3-201512-full'].map((id) => master.find((exam) => exam.id === id))
const questions = exams.flatMap((exam) => exam.parts.flatMap((part) => part.questions))

test('all 56 listening questions in the 2015 exams have reviewed Vietnamese explanations', () => {
  const reviewed = report.questions.map((row) => row.questionId)
  assert.equal(reviewed.length, 56)
  assert.equal(new Set(reviewed).size, 56)

  for (const question of questions.filter((q) => q.number >= 75)) {
    const explanation = curated[question.id]
    assert.ok(explanation, `${question.id} has an explanation`)
    assert.match(explanation, /^Đáp án [1-4] —/u)
    assert.match(explanation, /Dịch (?:câu hỏi|tình huống|lời|câu|lời nhắc|nhận xét|tin)/u)
    assert.ok(explanation.length > 160, `${question.id} includes an explanation, not just a key`)
  }
})

test('the printed keys for 12/2015 Mondai 1–2 and 07/2015 q76 match the stored answers', () => {
  assert.equal(report.totals.answerKeysPrintedInLocalPdfs, 13)
  for (const row of report.questions.filter((item) => item.answerEvidence.startsWith('PDF ghi'))) {
    const question = questions.find((q) => q.id === row.questionId)
    assert.equal(question.correctAnswer, row.answer, row.questionId)
    assert.equal(question.answer, row.answer, row.questionId)
  }
})

test('07/2015 q79 key is corrected from reading the lecture instruction in the transcript', () => {
  const question = questions.find((q) => q.id === 'toan_q_2015_07_79')
  const review = report.questions.find((q) => q.questionId === question.id)
  assert.equal(review.previousAnswer, 1)
  assert.equal(question.correctAnswer, 2)
  assert.equal(question.answer, 2)
  assert.match(curated[question.id], /nghe buổi diễn thuyết/u)
  assert.match(curated[question.id], /ngày mai/u)
})

test('07/2015 q100 explanation matches the report-writing request', () => {
  const explanation = curated.toan_q_2015_07_100
  assert.match(explanation, /どこが分からないの/u)
  assert.match(explanation, /báo cáo công tác/u)
  assert.doesNotMatch(explanation, /trưởng thành trong vai trò thư ký/u)
})

test('report states the limit of answer-key verification', () => {
  assert.equal(report.totals.questionsReviewed, 56)
  assert.equal(report.totals.answerKeysNotIndependentlyValidatedByPdf, 43)
  assert.match(report.method, /not official JLPT key validation/u)
})
