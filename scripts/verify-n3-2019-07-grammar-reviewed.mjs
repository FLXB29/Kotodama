import assert from 'node:assert/strict'
import fs from 'node:fs'

const exams = JSON.parse(fs.readFileSync('data/jlpt_n3_toan_master.json', 'utf8'))
const curated = JSON.parse(fs.readFileSync('data/jlpt_n3_explanations_curated.json', 'utf8'))
const review = JSON.parse(fs.readFileSync('reports/n3-quality-audit/grammar-2019-07-review.json', 'utf8'))
const exam = exams.find((item) => item.id === 'toan-n3-201907-full')
assert.ok(exam)
const questions = new Map(exam.parts.flatMap((part) => part.questions || []).map((question) => [question.id, question]))
const expectedAnswers = [2, 4, 4, 1, 2, 1, 3, 2, 4, 3, 2, 3, 3, 1, 3, 3, 2, 2, 4, 2, 4, 3, 1]
const reviewedQuestions = Array.from({ length: 23 }, (_, index) => questions.get(`toan_q_2019_07_${index + 36}`))
assert.ok(reviewedQuestions.every(Boolean), 'Expected all grammar questions 36–58.')
assert.deepEqual(
  reviewedQuestions.map((question) => question.correctAnswer),
  expectedAnswers
)
assert.deepEqual(
  reviewedQuestions.map((question) => question.answer),
  expectedAnswers
)
assert.deepEqual(review.answerSequence, expectedAnswers)
assert.equal(review.explanationsCompleted, 10)
assert.equal(review.officialKeyConfirmed, false)

const explanationFor = (question) => question.explanation || curated[question.id] || ''
for (const question of reviewedQuestions) {
  const explanation = explanationFor(question)
  assert.ok(explanation, `${question.id}: missing explanation.`)
  assert.match(explanation, /Dịch:/u, `${question.id}: missing Vietnamese translation.`)
}

for (const question of reviewedQuestions.slice(0, 13)) {
  const explanation = explanationFor(question)
  for (let option = 1; option <= 4; option++) {
    assert.match(
      explanation,
      new RegExp(`^${option}\\.`, 'mu'),
      `${question.id}: missing rationale for option ${option}.`
    )
  }
}

for (const question of reviewedQuestions.slice(13, 18)) {
  const explanation = explanationFor(question)
  assert.match(explanation, /Ô ★ là mảnh thứ ba/u)
  assert.match(explanation, /thứ tự ghép là/iu)
  assert.match(explanation, /Câu hoàn chỉnh(?: hiển thị)?:/u)
  for (let option = 1; option <= 4; option++) {
    assert.match(
      explanation,
      new RegExp(`^${option}\\.`, 'mu'),
      `${question.id}: missing placement rationale for fragment ${option}.`
    )
    const fragment = question.options[option - 1]
      .replace(/^\s*[1-4１-４][.．、\s　]*/u, '')
      .replace(/[０-９]/gu, (digit) => String.fromCharCode(digit.charCodeAt(0) - 0xfee0))
      .trim()
    assert.ok(explanation.includes(fragment), `${question.id}: explanation omits fragment ${option}.`)
  }
  assert.equal(question.starPosition, 2, `${question.id}: ★ must be the third fragment.`)
  assert.equal(question.starCorrectOrder[question.starPosition], question.correctAnswer)
}

const clozePassage =
  exam.parts.find((part) => part.title.includes('Ngữ pháp') && part.title.includes('Mondai 3'))?.passage || ''
assert.match(clozePassage, /彼女は質問に丁寧に/u)
assert.match(explanationFor(questions.get('toan_q_2019_07_57')), /答えてくれました/u)
assert.equal(questions.get('toan_q_2019_07_53').starPrompt.after, 'よ。')
console.log('N3 July 2019 grammar review passed: 23 answers, 23 explanations, 5 star sentences, cloze corrections.')
