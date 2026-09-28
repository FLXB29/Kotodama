import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'

const root = path.resolve('.')
const readJson = (file) => JSON.parse(fs.readFileSync(path.join(root, file), 'utf8'))
const exams = readJson('data/jlpt_n3_toan_master.json')
const curated = readJson('data/jlpt_n3_explanations_curated.json')
const m1Review = readJson('reports/n3-quality-audit/grammar-source-2014-12-m1-review.json')
const keyReview = readJson('reports/n3-quality-audit/grammar-answer-key-2014-12-review.json')
const starReview = readJson('reports/n3-quality-audit/star-source-2014-12-review.json')
const exam = exams.find((item) => item.id === m1Review.examId)
assert.ok(exam, `Missing ${m1Review.examId}`)
const questions = new Map(exam.parts.flatMap((part) => part.questions).map((question) => [question.id, question]))
const normalize = (value) => String(value || '').replace(/<[^>]*>/gu, '').replace(/&nbsp;/giu, ' ').normalize('NFKC').replace(/\s+/gu, '')
const optionsOf = (question) => question.options.map((option) => normalize(option).replace(/^[1-4][.．、]?/u, ''))
const answerSources = (review) => `Google Drive: ${review.source.file}, viewer page ${review.source.viewerPage}; Drive file ${review.source.driveFileId}.`
const m1AnswerById = new Map(keyReview.grammarM1Answers.map((row) => [row.questionId, row.answer]))
const m1AnswerSource = answerSources(keyReview)

assert.equal(m1Review.questions.length, 13)
assert.equal(keyReview.grammarM1Answers.length, 13)
assert.equal(starReview.questions.length, 5)
for (const row of m1Review.questions) {
  const question = questions.get(row.questionId)
  assert.ok(question, `Missing ${row.questionId}`)
  const cleanQuestion = normalize(question.question).replace(/^\[\d+\]/u, '')
  const cleanSentence = normalize(question.sentence).replace(/^\[\d+\]/u, '')
  assert.ok(cleanQuestion.includes(normalize(row.sourcePrompt)), `Prompt differs from the source PDF for ${row.questionId}`)
  assert.ok(cleanSentence.includes(normalize(row.sourcePrompt)), `Sentence differs from the source PDF for ${row.questionId}`)
  assert.deepEqual(optionsOf(question), row.sourceOptions.map(normalize), `Choices differ from the source PDF for ${row.questionId}`)
  assert.equal(question.answer, m1AnswerById.get(row.questionId), `Answer differs from separate key for ${row.questionId}`)
  if (question.correctAnswer !== undefined) assert.equal(question.correctAnswer, m1AnswerById.get(row.questionId))
  assert.equal(question.sourceVerificationStatus, 'verified', `Missing verified status for ${row.questionId}`)
  assert.deepEqual(question.sourceVerificationSources, [
    `Google Drive: ${m1Review.source.file}, printed page ${row.printedPage}; Drive file ${m1Review.source.driveFileId}.`,
    m1AnswerSource
  ])
  assert.equal(curated[row.questionId], question.explanation, `Curated explanation is stale for ${row.questionId}`)
  assert.ok(question.explanation.includes(`Đáp án ${m1AnswerById.get(row.questionId)}`), `Missing answer label for ${row.questionId}`)
  assert.ok(question.explanation.includes('Dịch:'), `Missing translation for ${row.questionId}`)
  assert.ok(question.explanation.includes('Ghi nhớ:'), `Missing summary for ${row.questionId}`)
  for (let choice = 1; choice <= 4; choice += 1) {
    assert.ok(question.explanation.includes(`\n${choice}.`), `Missing explanation for option ${choice} in ${row.questionId}`)
  }
}

const starAnswerSource = answerSources({
  source: {
    file: starReview.answerKeyFile,
    viewerPage: starReview.answerKeyViewerPage,
    driveFileId: starReview.answerKeyDriveFileId
  }
})
const normalizeSentence = (value) => normalize(value).replace(/[「」]/gu, '')
for (const row of starReview.questions) {
  const question = questions.get(row.questionId)
  assert.ok(question, `Missing ${row.questionId}`)
  assert.deepEqual(optionsOf(question), row.sourceOptions.map(normalize), `Star fragments differ from source for ${row.questionId}`)
  assert.equal(question.answer, row.answer, `Star key differs for ${row.questionId}`)
  if (question.correctAnswer !== undefined) assert.equal(question.correctAnswer, row.answer)
  assert.equal(question.sourceVerificationStatus, 'verified', `Missing verified status for ${row.questionId}`)
  assert.deepEqual(question.sourceVerificationSources, [
    `Google Drive: ${starReview.source.file}, printed page ${starReview.source.printedPage}; Drive file ${starReview.source.driveFileId}.`,
    starAnswerSource
  ])
  assert.equal(question.starOrderVerified, true)
  assert.equal(question.starPositionVerified, true)
  assert.deepEqual(question.starVerificationSources, question.sourceVerificationSources)
  assert.equal(curated[row.questionId], question.explanation, `Curated explanation is stale for ${row.questionId}`)
  assert.ok(question.explanation.includes(`Đáp án ${row.answer}`), `Missing star answer label for ${row.questionId}`)
  assert.ok(question.explanation.includes('Thứ tự bốn mảnh'), `Missing order explanation for ${row.questionId}`)
  assert.ok(question.explanation.includes('Dịch:'), `Missing translation for ${row.questionId}`)
  assert.ok(normalizeSentence(question.explanation).includes(normalizeSentence(row.completeSentence)), `Completed sentence differs for ${row.questionId}`)
}

console.log('Verified 13 Grammar M1 prompts, 52 source choices and answer keys; also verified all five star choices, keys, completed sentences, translations and provenance for December 2014.')
