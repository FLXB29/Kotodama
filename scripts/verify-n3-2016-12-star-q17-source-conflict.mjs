import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'

const exams = JSON.parse(fs.readFileSync(path.resolve('data/jlpt_n3_toan_master.json'), 'utf8'))
const fullExams = JSON.parse(fs.readFileSync(path.resolve('data/jlpt_full_master.json'), 'utf8'))
const curated = JSON.parse(fs.readFileSync(path.resolve('data/jlpt_n3_explanations_curated.json'), 'utf8'))
const report = JSON.parse(
  fs.readFileSync(path.resolve('reports/n3-quality-audit/star-source-2016-12-q17-review.json'), 'utf8')
)
const exam = exams.find((item) => item.id === 'toan-n3-201612-full')
assert.ok(exam)
const question = exam.parts.flatMap((part) => part.questions || []).find((item) => item.id === 'toan_q_2016_12_52')
assert.ok(question)
assert.equal(Number(question.correctAnswer), 1)
assert.deepEqual(question.starCorrectOrder, [2, 3, 1, 4])
assert.match(question.starPrompt.before, /待てって$/u)
assert.match(question.options[1], /言われた/u)
assert.doesNotMatch(question.options[1], /と言われた/u)
assert.match(
  question.explanation,
  /Câu hoàn chỉnh: 「しばらくここで待てって言われたから待っているんですけど、まだですか。」/u
)
assert.match(question.explanation, /PDF trên Google Drive trang 5.*「と言われた」/u)
assert.match(question.explanation, /Một bản PDF công khai khác.*「言われた」/u)
assert.equal(curated[question.id], question.explanation)
assert.equal(report.sourcePdf.printedPage, 5)
assert.equal(report.sourcePdf.option2AsSeen, 'と言われた')
assert.equal(report.appData.option2, '言われた')
assert.equal(report.appData.completedSentence, 'しばらくここで待てって言われたから待っているんですけど。')
assert.equal(report.alternatePdf.option2, '言われた')
assert.equal(report.alternatePdf.printedQuestion, 17)
assert.match(report.decision, /separate published PDF copy prints that wording/u)
assert.equal(report.browserVerification.browser, 'Chrome')
assert.match(report.browserVerification.result, /zero answers were selected.*0\/39/u)
assert.equal(report.status, 'source-conflict-disclosed-editorial-reconstruction')
assert.equal(report.officialKeyEstablished, false)

const sectionExam = fullExams.find((item) => item.id === 'cm2u2wlnt0097134ira8pl9rk-grammar-reading')
assert.ok(sectionExam)
const sectionQuestion = sectionExam.parts
  .flatMap((part) => part.questions || [])
  .find((item) => item.id === 'cm2u2wn7d00au134irqsgbkcg')
assert.ok(sectionQuestion)
assert.match(sectionQuestion.question, /待てって/u)
assert.equal(sectionQuestion.explanation, question.explanation)

console.log('Verified the 12/2016 star question 17 app wording, answer order, and disclosed source conflict.')
