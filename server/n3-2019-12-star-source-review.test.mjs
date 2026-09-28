import assert from 'node:assert/strict'
import fs from 'node:fs'
import test from 'node:test'

const exam = JSON.parse(fs.readFileSync('data/jlpt_n3_toan_master.json', 'utf8')).find(
  (item) => item.id === 'toan-n3-201912-full',
)
const report = JSON.parse(fs.readFileSync('reports/n3-quality-audit/star-source-2019-12-review.json', 'utf8'))
const expected = [
  {
    id: 'toan_q_2019_12_49',
    printedQuestion: 14,
    options: ['1.と', '2.車を', '3.ので', '4.使わせてほしい'],
    answer: 4,
    order: [3, 2, 4, 1],
  },
  {
    id: 'toan_q_2019_12_50',
    printedQuestion: 15,
    options: ['1.に対する', '2.の', '3.考え方', '4.働くこと'],
    answer: 1,
    order: [2, 4, 1, 3],
  },
  {
    id: 'toan_q_2019_12_51',
    printedQuestion: 16,
    options: ['1.ときに', '2.ばかりの', '3 白いTシャツ', '4.買った'],
    answer: 2,
    order: [1, 4, 2, 3],
  },
  {
    id: 'toan_q_2019_12_52',
    printedQuestion: 17,
    options: ['1.わからなくて', '2.どの電車で', '3.一番早く着くのか', '4.行けば'],
    answer: 3,
    order: [2, 4, 3, 1],
  },
  {
    id: 'toan_q_2019_12_53',
    printedQuestion: 18,
    options: ['1 もし', '2 乗せていってあげる', '3 行くんだったら', '4 行くつもりだから'],
    answer: 3,
    order: [4, 1, 3, 2],
  },
]

test('December 2019 star questions 14–18 match the rendered source page', () => {
  assert.ok(exam)
  assert.equal(report.sourcePdf.renderedPage, 6)
  assert.equal(report.questions.length, expected.length)
  assert.match(report.summary, /★ positions match/u)
  assert.equal(report.officialKeyEstablished, false)
  assert.equal(report.secondaryAnswerKey.renderedPage, 20)
  assert.deepEqual(report.secondaryAnswerKey.answers, expected.map((item) => item.answer))
  assert.equal(report.secondaryAnswerKey.matchesStoredAnswers, true)

  const questions = exam.parts.flatMap((part) => part.questions || [])
  for (const [index, item] of expected.entries()) {
    const question = questions.find((candidate) => candidate.id === item.id)
    const entry = report.questions[index]
    assert.ok(question)
    assert.deepEqual(question.options, item.options)
    assert.equal(question.correctAnswer, item.answer)
    assert.deepEqual(question.starCorrectOrder, item.order)
    assert.equal(question.starPosition, 2)
    assert.equal(question.starVerificationStatus, 'verified-against-source')
    assert.equal(question.starOrderVerified, true)
    assert.equal(question.starPositionVerified, true)
    assert.match(question.starVerificationSources?.[0] || '', /#page=6$/u)
    assert.equal(entry.printedQuestion, item.printedQuestion)
    assert.deepEqual(entry.appData.order, item.order)
    assert.equal(entry.appData.answer, item.answer)
    assert.match(entry.completedSentence, /./u)
    assert.equal(entry.status, 'verified-against-supplied-source')
    assert.equal(entry.officialKeyEstablished, false)
  }

  assert.match(report.questions[3].decision, /kana spelling/u)
  assert.match(report.questions[4].decision, /page number/u)
})
