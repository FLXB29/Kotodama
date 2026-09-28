import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'

const exams = JSON.parse(fs.readFileSync(path.resolve('data/jlpt_n3_toan_master.json'), 'utf8'))
const curated = JSON.parse(fs.readFileSync(path.resolve('data/jlpt_n3_explanations_curated.json'), 'utf8'))
const report = JSON.parse(
  fs.readFileSync(path.resolve('reports/n3-quality-audit/grammar-source-2016-12-q16-review.json'), 'utf8')
)
const exam = exams.find((item) => item.id === 'toan-n3-201612-full')
assert.ok(exam)
const question = exam.parts.flatMap((part) => part.questions || []).find((item) => item.id === 'toan_q_2016_12_51')
assert.ok(question)
const explanation = curated[question.id]
assert.equal(Number(question.correctAnswer), 2)
assert.deepEqual(question.starCorrectOrder, [4, 3, 2, 1])
assert.match(explanation, /thứ tự ghép (?:đúng )?là 4 → 3 → 2 → 1/u)
assert.match(explanation, /Câu hoàn chỉnh: 「土曜日.*週末の過ごし方だ。」/u)
assert.match(explanation, /Dịch:/u)
assert.match(explanation, /2\. という = .*không mang nghĩa [“"]?nghe nói/u)
assert.match(explanation, /3\. 家で過ごす/u)
assert.match(explanation, /4\. どこにも出かけずに/u)
assert.match(explanation, /1\. のが/u)
assert.doesNotMatch(explanation, /Nghe nói…|Tương truyền/u)
assert.equal(report.sourcePdf.printedPage, 5)
assert.equal(report.answer.choiceAtStar, 2)
assert.equal(report.officialKeyEstablished, false)
assert.equal(report.explanationChecks.orderAndRoleOfEveryPiece, true)

console.log(
  'Verified the source-transcribed prompt, star answer/order, contextual grammar explanation, translation, and official-key limitation for December 2016 question 16.'
)
