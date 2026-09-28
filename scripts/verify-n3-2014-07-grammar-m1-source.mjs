import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'

const root = path.resolve('.')
const readJson = (file) => JSON.parse(fs.readFileSync(path.join(root, file), 'utf8'))
const review = readJson('reports/n3-quality-audit/grammar-source-2014-07-m1-review.json')
const keyReview = readJson('reports/n3-quality-audit/grammar-answer-key-2014-07-review.json')
const exams = readJson('data/jlpt_n3_toan_master.json')
const curated = readJson('data/jlpt_n3_explanations_curated.json')
const exam = exams.find((item) => item.id === review.examId)
assert.ok(exam, 'Missing JLPT N3 07/2014 full exam')
const questions = new Map(exam.parts.flatMap((part) => part.questions).map((question) => [question.id, question]))
const keyByQuestion = new Map(keyReview.answers.map((item) => [item.questionId, item.answer]))
const answerSource = `Google Drive: ${keyReview.source.file}, page ${keyReview.source.viewerPage}; Drive file ${keyReview.source.driveFileId}.`
const normalize = (value) =>
  String(value || '')
    .replace(/<[^>]*>/gu, '')
    .replace(/&nbsp;/giu, ' ')
    .normalize('NFKC')
    .replace(/\s+/gu, '')

assert.equal(review.questions.length, 13, 'Expected all 13 Grammar Mondai 1 questions')
assert.equal(keyReview.answers.length, 13, 'Expected all 13 separate answer-key entries')

for (const row of review.questions) {
  const question = questions.get(row.questionId)
  assert.ok(question, `Missing question ${row.questionId}`)
  const sourcePage = row.printedQuestion <= 11 ? 4 : 5
  const questionSource = `Google Drive: ${review.source.file}, printed page ${sourcePage}; Drive file ${review.source.driveFileId}.`
  const prompt = normalize(question.question).replace(/^\[\d+\]/u, '')
  const sentence = normalize(question.sentence).replace(/^\[\d+\]/u, '')
  const sourcePrompt = normalize(row.sourcePrompt)
  assert.ok(prompt.includes(sourcePrompt), `Question wording differs from source PDF for ${row.questionId}`)
  assert.ok(sentence.includes(sourcePrompt), `Sentence wording differs from source PDF for ${row.questionId}`)
  assert.deepEqual(
    question.options.map((option) => normalize(option).replace(/^[1-4][.．、]?/u, '')),
    row.sourceOptions.map(normalize),
    `Answer choices differ from source PDF for ${row.questionId}`
  )
  assert.equal(question.answer, keyByQuestion.get(row.questionId), `Key differs from answer PDF for ${row.questionId}`)
  if (question.correctAnswer !== undefined) {
    assert.equal(question.correctAnswer, keyByQuestion.get(row.questionId), `correctAnswer differs for ${row.questionId}`)
  }
  assert.equal(question.sourceVerificationStatus, 'verified', `Missing source verification status for ${row.questionId}`)
  assert.deepEqual(question.sourceVerificationSources, [questionSource, answerSource], `Wrong provenance for ${row.questionId}`)
  assert.equal(curated[row.questionId], question.explanation, `Curated explanation is out of sync for ${row.questionId}`)
  assert.ok(question.explanation.includes(`Đáp án ${keyByQuestion.get(row.questionId)}`), `Answer label is absent for ${row.questionId}`)
  assert.ok(question.explanation.includes('Dịch:'), `Translation is absent for ${row.questionId}`)
  assert.ok(question.explanation.includes('Ghi nhớ:'), `Grammar summary is absent for ${row.questionId}`)
  for (let choice = 1; choice <= 4; choice += 1) {
    assert.ok(question.explanation.includes(`\n${choice}.`), `Per-choice explanation ${choice} is absent for ${row.questionId}`)
  }
}

console.log('Verified source wording, all four choices, separate answer key, and explanation structure for all 13 JLPT N3 07/2014 Grammar Mondai 1 questions.')
