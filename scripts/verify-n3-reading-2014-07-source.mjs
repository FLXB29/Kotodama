import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'

const root = path.resolve('.')
const readJson = (file) => JSON.parse(fs.readFileSync(path.join(root, file), 'utf8'))
const keyReview = readJson('reports/n3-quality-audit/reading-answer-key-2014-07-review.json')
const sourceReview = readJson('reports/n3-quality-audit/reading-source-2014-07-q28-30-review.json')
const exams = readJson('data/jlpt_n3_toan_master.json')
const curated = readJson('data/jlpt_n3_explanations_curated.json')
const exam = exams.find((item) => item.id === keyReview.examId)
assert.ok(exam, 'Missing JLPT N3 07/2014 full exam')
const questions = new Map(exam.parts.flatMap((part) => part.questions).map((question) => [question.id, question]))
const normalize = (value) => String(value || '').replace(/<[^>]*>/gu, '').normalize('NFKC').replace(/\s+/gu, '').replace(/[。．、]+$/gu, '')
const questionSource = `Google Drive: ${sourceReview.source.questionFile}, printed page 9; Drive file ${sourceReview.source.questionDriveFileId}.`
const keySource = `Google Drive: ${sourceReview.source.answerKeyFile}, viewer page 9; Drive file ${sourceReview.source.answerKeyDriveFileId}.`

assert.equal(keyReview.answers.length, 16, 'Expected every Reading question 24-39')
assert.deepEqual(keyReview.answers.map((row) => row.printedQuestion), Array.from({ length: 16 }, (_, i) => i + 24))
for (const row of keyReview.answers) {
  const question = questions.get(row.questionId)
  assert.ok(question, `Missing ${row.questionId}`)
  assert.equal(question.answer, row.answer, `Answer differs from separate key for ${row.questionId}`)
  if (question.correctAnswer !== undefined) assert.equal(question.correctAnswer, row.answer, `correctAnswer differs for ${row.questionId}`)
}

assert.equal(sourceReview.questions.length, 3)
for (const row of sourceReview.questions) {
  const question = questions.get(row.questionId)
  assert.ok(question, `Missing ${row.questionId}`)
  assert.ok(normalize(question.question).includes(normalize(row.sourcePrompt)), `Prompt differs from exam PDF for ${row.questionId}`)
  assert.deepEqual(question.options.map(normalize), row.sourceOptions.map(normalize), `Options differ from exam PDF for ${row.questionId}`)
  assert.equal(question.answer, row.answerKeyAnswer, `Key differs for ${row.questionId}`)
  assert.equal(question.sourceVerificationStatus, 'verified', `Missing source verification status for ${row.questionId}`)
  assert.deepEqual(question.sourceVerificationSources, [questionSource, keySource], `Wrong provenance for ${row.questionId}`)
  if (typeof question.explanation === 'string') {
    assert.equal(curated[row.questionId], question.explanation, `Embedded/curated explanation is out of sync for ${row.questionId}`)
  }
  if (typeof curated[row.questionId] === 'string') {
    assert.ok(curated[row.questionId].includes(`Đáp án ${row.answerKeyAnswer}`), `Curated explanation has the wrong answer label for ${row.questionId}`)
  }
}
assert.ok(!questions.get('toan_q_2014_07_64').options[0].includes('上手な科目'))
assert.ok(sourceReview.questions.find((row) => row.questionId === 'toan_q_2014_07_64').sourceOptions[0].includes('苦手な科目'))

console.log('Verified all 16 July 2014 Reading answer keys and exact source text/options for questions 28-30.')
