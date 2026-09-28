import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'

const root = path.resolve('.')
const readJson = (file) => JSON.parse(fs.readFileSync(path.join(root, file), 'utf8'))
const exams = readJson('data/jlpt_n3_toan_master.json')
const curated = readJson('data/jlpt_n3_explanations_curated.json')
const review = readJson('reports/n3-quality-audit/vocabulary-source-2014-12-review.json')
const exam = exams.find((item) => item.id === 'toan-n3-201412-full')
assert.ok(exam, 'Missing JLPT N3 12/2014 full exam')
const questions = new Map(exam.parts.flatMap((part) => part.questions).map((question) => [question.id, question]))
const vocabQuestions = exam.parts
  .filter((part) => part.title.includes('(Từ vựng)'))
  .flatMap((part) => part.questions)
  .sort((left, right) => left.number - right.number)
const answerKey = [2, 3, 3, 2, 3, 2, 1, 4, 2, 4, 1, 2, 1, 2, 2, 2, 3, 1, 1, 4, 4, 2, 2, 1, 4, 4, 3, 1, 4, 3, 2, 3, 1, 2, 4]
assert.equal(vocabQuestions.length, 35)
assert.equal(review.answerKeyQuestions.length, 35)
for (const [index, question] of vocabQuestions.entries()) {
  assert.equal(question.answer, answerKey[index], 'Answer differs at vocabulary question ' + (index + 1))
  assert.equal(question.correctAnswer, answerKey[index], 'correctAnswer differs at vocabulary question ' + (index + 1))
  assert.equal(review.answerKeyQuestions[index].answer, answerKey[index])
  assert.equal(review.answerKeyQuestions[index].matched, true)
}

const normalizeText = (value) =>
  String(value || '')
    .replace(/<[^>]*>/gu, '')
    .replace(/^\s*\[\d+\]\s*/u, '')
    .normalize('NFKC')
    .replace(/\s+/gu, '')
const normalizeOption = (value) =>
  String(value || '')
    .normalize('NFKC')
    .replace(/^\s*[1-4][.．、\s]*/u, '')
    .replace(/\s+/gu, '')

for (const reviewed of review.sourceTranscriptionQuestions) {
  const question = questions.get(reviewed.questionId)
  assert.ok(question, 'Missing source-reviewed question ' + reviewed.questionId)
  assert.equal(normalizeText(question.question), normalizeText(reviewed.sourceStem))
  assert.deepEqual(question.options.map(normalizeOption), reviewed.sourceOptions.map(normalizeOption))
  assert.equal(question.answer, reviewed.answer)
  assert.equal(question.sourceVerificationStatus, 'verified')
  assert.ok(question.sourceVerificationSources.includes(review.sources.examPdf.url))
  assert.ok(question.sourceVerificationSources.includes(review.sources.answerKeyPdf.url))
  assert.equal(reviewed.verified, true)
}

const q18 = questions.get('toan_q_2014_12_18')
assert.deepEqual(q18.options, ['1. 穴', '2. 傷', '3. けが', '4. 汚れ'])
const q30 = questions.get('toan_q_2014_12_30')
assert.deepEqual(q30.options, ['1. 考えています', '2. 習っています', '3. 教えています', '4. 調べています'])

for (let number = 9; number <= 30; number += 1) {
  const question = questions.get('toan_q_2014_12_' + number)
  assert.ok(question?.explanation, 'Missing vocabulary explanation at question ' + number)
  assert.equal(curated[question.id], question.explanation, 'Curated explanation is out of sync at question ' + number)
  assert.ok(question.explanation.includes('Đáp án'), 'Missing answer rationale at question ' + number)
  assert.ok(question.explanation.includes('Dịch:'), 'Missing Vietnamese sentence translation at question ' + number)
  for (let option = 1; option <= 4; option += 1) {
    assert.ok(question.explanation.includes('\n' + option + '.'), 'Missing option explanation at question ' + number + ', option ' + option)
  }
}

const reviewedTexts = [q18.options.join(' '), q30.options.join(' '), ...Array.from({ length: 22 }, (_, i) => questions.get('toan_q_2014_12_' + (i + 9)).explanation)].join('\n')
for (const badText of ['trong văn tập', 'Hán Việt:', 'bia；đích', '教えていています', '４. 汚れ']) {
  assert.ok(!reviewedTexts.includes(badText), 'Stale incorrect text remains: ' + badText)
}

console.log('Verified 35 vocabulary answer keys against the 12/2014 answer PDF, source text for questions 18 and 30, and translated four-option explanations for questions 9–30.')
