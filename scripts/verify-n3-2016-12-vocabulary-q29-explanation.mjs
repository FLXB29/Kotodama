import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'

const exams = JSON.parse(fs.readFileSync(path.resolve('data/jlpt_n3_toan_master.json'), 'utf8'))
const curated = JSON.parse(fs.readFileSync(path.resolve('data/jlpt_n3_explanations_curated.json'), 'utf8'))
const report = JSON.parse(
  fs.readFileSync(path.resolve('reports/n3-quality-audit/vocabulary-source-2016-12-q29-review.json'), 'utf8')
)
const exam = exams.find((item) => item.id === 'toan-n3-201612-full')
assert.ok(exam)
const question = exam.parts.flatMap((part) => part.questions || []).find((item) => item.id === 'toan_q_2016_12_29')
assert.ok(question)
assert.equal(Number(question.correctAnswer ?? question.answer), 1)
assert.deepEqual(
  question.options.map((option) =>
    String(option)
      .replace(/^\s*[1-4][.．、\s　]*/u, '')
      .trim()
  ),
  ['多すぎて残りました', '少し足りませんでした', 'とてもおいしかったです', 'そんなにおいしくなかったです']
)
assert.equal(question.explanation, curated[question.id])
for (const required of [
  '「あまる」',
  'Món ăn trong bữa tiệc còn thừa lại',
  'quá nhiều nên còn lại',
  'hơi thiếu',
  'rất ngon',
  'không ngon đến thế',
]) {
  assert.ok(question.explanation.includes(required), `Explanation is missing: ${required}`)
}
assert.doesNotMatch(question.explanation, /簧|撰|詩化|Hán Việt/u)
assert.equal(report.sourcePdf.printedPage, 3)
assert.equal(report.answer, 1)
assert.equal(report.officialAnswerKeyPresent, false)
assert.equal(report.explanationChecks.everyOptionExplainedInContext, true)

console.log(
  'Verified the source prompt/options, answer, Vietnamese translation, four contextual option meanings, and removal of irrelevant dictionary matches for December 2016 vocabulary question 29.'
)
