import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'

const root = path.resolve('.')
const readJson = (file) => JSON.parse(fs.readFileSync(path.join(root, file), 'utf8'))
const review = readJson('reports/n3-quality-audit/vocabulary-source-2014-07-m1-q2-14-review.json')
const exams = readJson('data/jlpt_n3_toan_master.json')
const curated = readJson('data/jlpt_n3_explanations_curated.json')
const exam = exams.find((item) => item.id === review.examId)
assert.ok(exam, 'Missing JLPT N3 07/2014 full exam')
const questions = new Map(exam.parts.flatMap((part) => part.questions).map((question) => [question.id, question]))
const sources = [review.sources.questionSourceUrl, review.sources.answerKeySource]
const normalize = (value) =>
  String(value || '')
    .replace(/<[^>]*>/gu, '')
    .normalize('NFKC')
    .replace(/\s+/gu, '')

assert.equal(review.questions.length, 12, 'Expected 12 supplemental M1 source reviews')
for (const row of review.questions) {
  const question = questions.get(row.questionId)
  assert.ok(question, `Missing question ${row.questionId}`)
  const prompt = normalize(question.question).replace(/^\[\d+\]/u, '')
  assert.ok(prompt.includes(normalize(row.sourcePrompt)), `Prompt differs from exam PDF for ${row.questionId}`)
  assert.deepEqual(
    question.options.map((option) => normalize(option).replace(/^[1-4][.．、]?/u, '')),
    row.sourceOptions.map(normalize),
    `Options differ from exam PDF for ${row.questionId}`
  )
  assert.equal(question.answer, row.answerKeyAnswer, `Answer differs from answer-key PDF for ${row.questionId}`)
  if (question.correctAnswer !== undefined) {
    assert.equal(question.correctAnswer, row.answerKeyAnswer, `correctAnswer differs from answer-key PDF for ${row.questionId}`)
  }
  assert.equal(question.sourceVerificationStatus, 'verified')
  assert.deepEqual(question.sourceVerificationSources, sources)
  assert.equal(curated[question.id], question.explanation, `Curated explanation is out of sync for ${row.questionId}`)
  assert.ok(question.explanation.includes(`Đáp án ${row.answerKeyAnswer}`), `Missing answer label for ${row.questionId}`)
}

const questionsById = new Map(review.questions.map((item) => [item.questionId, questions.get(item.questionId)]))
assert.ok(questionsById.get('toan_q_2014_07_2').explanation.includes('nhớ địa chỉ email'))
assert.ok(questionsById.get('toan_q_2014_07_5').explanation.includes('giải thể thao'))
assert.ok(questionsById.get('toan_q_2014_07_7').explanation.includes('dồn sự chú ý'))
for (const number of [9, 10, 11, 12, 13, 14]) {
  const explanation = questionsById.get(`toan_q_2014_07_${number}`).explanation
  for (let choice = 1; choice <= 4; choice += 1) {
    assert.ok(explanation.includes(`\n${choice}.`), `Missing per-choice note ${choice} for question ${number}`)
  }
}

console.log('Verified source transcription, all choices, separate answer key, and explanations for JLPT N3 07/2014 vocabulary questions 2-5 and 7-14.')
