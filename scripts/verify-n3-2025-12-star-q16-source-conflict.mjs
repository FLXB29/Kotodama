import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'

const exams = JSON.parse(fs.readFileSync(path.resolve('data/jlpt_n3_toan_master.json'), 'utf8'))
const curated = JSON.parse(fs.readFileSync(path.resolve('data/jlpt_n3_explanations_curated.json'), 'utf8'))
const report = JSON.parse(
  fs.readFileSync(path.resolve('reports/n3-quality-audit/star-source-2025-12-q16-review.json'), 'utf8')
)
const exam = exams.find((item) => item.id === 'toan-n3-202512-full')
assert.ok(exam)
const question = exam.parts.flatMap((part) => part.questions || []).find((item) => item.id === 'toan_q_2025_12_51')
assert.ok(question)
assert.equal(Number(question.correctAnswer), 4)
assert.deepEqual(question.starCorrectOrder, [2, 1, 4, 3])
assert.match(question.options[1], /弾くほど/u)
assert.match(curated[question.id], /PDF đề gốc trang 9 được ghi nhận là in lựa chọn 2 「弾くけど」/u)
assert.match(curated[question.id], /chưa có khóa JLPT chính thức/u)
assert.equal(report.sourcePdf.printedPage, 9)
assert.equal(report.sourcePdf.option2AsSeen, '弾くけど')
assert.equal(report.reference.answerOrderText, '弾けば2弾くほど1上手に4弾けるように3')
assert.match(report.answerKeyCrossCheck.answerSequence, /3 1 4 2 3/u)
assert.match(report.answerKeyCrossCheck.result, /Question 16 is also listed as answer 4/u)
assert.equal(
  report.answerKeyCrossCheck.provenance,
  'Independent third-party answer compilation; not an official JLPT key.'
)
assert.equal(report.status, 'source-conflict-disclosed-unresolved')
assert.equal(report.officialKeyEstablished, false)

console.log('Verified the 12/2025 star question 16 app wording, answer order, and disclosed source conflict.')
