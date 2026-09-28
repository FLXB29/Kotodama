import assert from 'node:assert/strict'
import fs from 'node:fs'
import test from 'node:test'

const exam = JSON.parse(fs.readFileSync('data/jlpt_n3_toan_master.json', 'utf8')).find(
  (item) => item.id === 'toan-n3-201907-full'
)
const report = JSON.parse(fs.readFileSync('reports/n3-quality-audit/star-source-2019-07-review.json', 'utf8'))
const question = exam?.parts.flatMap((part) => part.questions || []).find((item) => item.id === 'toan_q_2019_07_49')

test('July 2019 star question 14 matches the supplied PDF, including the 11 o’clock fragment', () => {
  assert.ok(question)
  assert.equal(question.starVerificationStatus, 'verified-against-source')
  assert.equal(question.starOrderVerified, true)
  assert.equal(question.starPositionVerified, true)
  assert.deepEqual(question.options, ['１．のため　', '２．による　', '３．１１時開始', '４．電車の遅れ'])
  assert.deepEqual(question.starCorrectOrder, [2, 4, 1, 3])
  assert.equal(question.starPosition, 2)
  assert.equal(question.correctAnswer, 1)
  assert.match(question.starVerificationSources?.[0] || '', /#page=5$/u)
  assert.match(question.starVerificationNote || '', /OCR had dropped one numeral/u)
  assert.deepEqual(report.sourcePdf.printedOptions, ['1 のため', '2 による', '3 １１時開始', '4 電車の遅れ'])
  assert.equal(report.appData.completedSentence.includes('大雨による電車の遅れのため11時開始'), true)
  assert.equal(report.officialKeyEstablished, false)
  assert.deepEqual(report.secondaryAnswerKey.answers, [1, 3, 3, 2, 2])
  assert.equal(report.secondaryAnswerKey.matchesStoredAnswers, true)
  assert.equal(report.secondaryAnswerKey.renderedPage, 19)
})

test('July 2019 star questions 15–18 match the rendered source page and OCR-only differences', () => {
  const expected = [
    {
      id: 'toan_q_2019_07_50',
      printedQuestion: 15,
      options: ['１．動物が', '２．なかなか', '３．動物園は', '４．見られる'],
      answer: 3,
      order: [1, 4, 3, 2],
    },
    {
      id: 'toan_q_2019_07_51',
      printedQuestion: 16,
      options: ['１．今にも', '２．大学に合格したという', '３．知らせを聞いて', '４．一番行きたがっていた'],
      answer: 3,
      order: [4, 2, 3, 1],
    },
    {
      id: 'toan_q_2019_07_52',
      printedQuestion: 17,
      options: ['１．隣に', '２．私の家に', '３．建ったことで', '４．日が当たらなくなって'],
      answer: 2,
      order: [1, 3, 2, 4],
    },
    {
      id: 'toan_q_2019_07_53',
      printedQuestion: 18,
      options: ['１．とき', '２．アルバイトしていた', '３．みたいだ', '４．コンピューター会社で'],
      answer: 2,
      order: [1, 4, 2, 3],
    },
  ]
  const questions = exam.parts.flatMap((part) => part.questions || [])

  assert.equal(report.additionalQuestions.length, expected.length)
  assert.deepEqual(report.secondaryAnswerKey.answers, [1, ...expected.map((item) => item.answer)])
  assert.equal(report.secondaryAnswerKey.matchesStoredAnswers, true)
  assert.equal(report.secondaryAnswerKey.renderedPage, 19)
  for (const [index, item] of expected.entries()) {
    const question = questions.find((candidate) => candidate.id === item.id)
    const entry = report.additionalQuestions[index]
    assert.ok(question)
    assert.deepEqual(question.options, item.options)
    assert.equal(question.correctAnswer, item.answer)
    assert.deepEqual(question.starCorrectOrder, item.order)
    assert.equal(question.starPosition, 2)
    assert.equal(question.starVerificationStatus, 'verified-against-source')
    assert.equal(question.starOrderVerified, true)
    assert.equal(question.starPositionVerified, true)
    assert.match(question.starVerificationSources?.[0] || '', /#page=5$/u)
    assert.equal(entry.printedQuestion, item.printedQuestion)
    assert.equal(entry.appData.answer, item.answer)
    assert.deepEqual(entry.appData.order, item.order)
    assert.match(entry.completedSentence, /./u)
    assert.equal(entry.status, 'verified-against-supplied-source')
    assert.equal(entry.officialKeyEstablished, false)
  }
  assert.match(report.additionalQuestions[3].decision, /page number/u)
})
