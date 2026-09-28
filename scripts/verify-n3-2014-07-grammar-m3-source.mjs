import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'

const root = path.resolve('.')
const review = JSON.parse(fs.readFileSync(path.join(root, 'reports/n3-quality-audit/grammar-m3-2014-07-source-review.json'), 'utf8'))
const exams = JSON.parse(fs.readFileSync(path.join(root, 'data/jlpt_n3_toan_master.json'), 'utf8'))
const curated = JSON.parse(fs.readFileSync(path.join(root, 'data/jlpt_n3_explanations_curated.json'), 'utf8'))
const exam = exams.find((item) => item.id === review.examId)
assert.ok(exam, 'Missing JLPT N3 07/2014 full exam')
const part = exam.parts.find((item) => item.questions.some((question) => question.id === 'toan_q_2014_07_54'))
assert.ok(part, 'Missing Grammar Mondai 3 passage')
const questions = new Map(part.questions.map((question) => [question.id, question]))
const normalize = (value) => String(value || '').replace(/<[^>]*>/gu, '').normalize('NFKC').replace(/\s+/gu, '')
const sourceKey = `Google Drive: ${review.source.answerKeyFile}, viewer page ${review.source.answerKeyViewerPage}; Drive file ${review.source.answerKeyDriveFileId}.`
const sourcePdf = `Google Drive: ${review.source.questionFile}, printed page ${review.source.printedPage}; Drive file ${review.source.questionDriveFileId}.`

assert.ok(normalize(part.passage).includes(normalize(review.sourcePassage)), 'Grammar M3 passage differs from the source PDF')
assert.equal(review.questions.length, 5)
for (const row of review.questions) {
  const question = questions.get(row.questionId)
  assert.ok(question, `Missing ${row.questionId}`)
  assert.ok(normalize(question.question).includes(normalize(row.sourceMarker)), `Blank marker differs for ${row.questionId}`)
  assert.deepEqual(
    question.options.map((option) => normalize(option).replace(/^[1-4][.．、]?/u, '')),
    row.sourceOptions.map(normalize),
    `Options differ from exam PDF for ${row.questionId}`
  )
  assert.equal(question.answer, row.answerKeyAnswer, `Answer differs from separate key for ${row.questionId}`)
  assert.equal(question.correctAnswer, row.answerKeyAnswer, `correctAnswer differs from separate key for ${row.questionId}`)
  assert.equal(question.sourceVerificationStatus, 'verified', `Missing source status for ${row.questionId}`)
  assert.deepEqual(question.sourceVerificationSources, [sourcePdf, sourceKey], `Wrong provenance for ${row.questionId}`)
  if (typeof curated[row.questionId] === 'string') {
    assert.equal(curated[row.questionId], question.explanation, `Explanation map is out of sync for ${row.questionId}`)
  }
  assert.ok(question.explanation.includes(`Đáp án ${row.answerKeyAnswer}`), `Explanation answer label differs for ${row.questionId}`)
  for (let choice = 1; choice <= 4; choice += 1) {
    assert.ok(question.explanation.includes(`\n${choice}.`), `Missing explanation for choice ${choice} in ${row.questionId}`)
  }
}
console.log('Verified the Grammar M3 passage, all 20 choices, all five answer keys, provenance, and per-choice explanation structure for July 2014.')
