import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import test from 'node:test'

const exams = JSON.parse(fs.readFileSync(path.resolve('data/jlpt_n3_toan_master.json'), 'utf8'))
const fullMaster = JSON.parse(fs.readFileSync(path.resolve('data/jlpt_full_master.json'), 'utf8'))
const curated = JSON.parse(fs.readFileSync(path.resolve('data/jlpt_n3_explanations_curated.json'), 'utf8'))
const report = JSON.parse(
  fs.readFileSync(path.resolve('reports/n3-quality-audit/star-source-2020-12-review.json'), 'utf8')
)
const exam = exams.find((item) => item.id === 'toan-n3-202012-full')
const part = exam.parts.find((item) => item.title.includes('Ngữ pháp') && item.title.includes('Mondai 2'))
const fullExam = fullMaster.find((item) => item.title === 'JLPT-N3 12 2020 - Ngữ Pháp & Đọc Hiểu (文法・読解)')
const fullPart = fullExam.parts.find((item) => item.title === 'Mondai 2')
const expected = [
  {
    id: 'toan_q_2020_12_49',
    number: 49,
    options: ['などの', 'スパゲティ', '料理も', 'だけでなく'],
    order: [4, 2, 1, 3],
    answer: 1,
    position: 2,
    text: 'などの',
  },
  {
    id: 'toan_q_2020_12_50',
    number: 50,
    options: ['しかない', 'はじまる', 'あと3分', 'まで'],
    order: [2, 4, 3, 1],
    answer: 3,
    position: 2,
    text: 'あと3分',
  },
  {
    id: 'toan_q_2020_12_51',
    number: 51,
    options: ['の', 'いい', '晴れる', 'と'],
    order: [3, 4, 2, 1],
    answer: 2,
    position: 2,
    text: 'いい',
  },
  {
    id: 'toan_q_2020_12_52',
    number: 52,
    options: ['よく言っているが', 'やっぱりサッカーが', '続けているのは', 'それでもやめずに'],
    order: [1, 4, 3, 2],
    answer: 3,
    position: 2,
    text: '続けているのは',
  },
  {
    id: 'toan_q_2020_12_53',
    number: 53,
    options: ['こんでいる電車は', 'よい運動になるから', '嫌いだし', '自転車で行けば'],
    order: [1, 3, 4, 2],
    answer: 4,
    position: 2,
    text: '自転車で行けば',
  },
]
const normalize = (value) =>
  String(typeof value === 'string' ? value : value?.text || '')
    .normalize('NFKC')
    .replace(/^\s*[1-4][.．、\s　]*/u, '')
    .replace(/\s+/gu, '')
    .trim()

test('December 2020 star fragments, ★ slots, answers, and explanations match the supplied exam PDF', () => {
  assert.equal(report.sourcePdf.driveFileId, '1KkIqo10qWkUMyKJBIRrwcO2vbRd65c05')
  assert.equal(report.sourcePdf.renderedPage, 5)
  for (const item of expected) {
    const question = part.questions.find((entry) => entry.id === item.id)
    const fullQuestion = fullPart.questions.find((entry) => entry.number === item.number)
    const questionReport = report.questions.find((entry) => entry.fullExamQuestionId === item.id)
    assert.ok(question, `missing ${item.id}`)
    assert.ok(fullQuestion, `missing standalone question ${item.number}`)
    assert.ok(questionReport, `missing source report for ${item.id}`)
    assert.deepEqual(question.options.map(normalize), item.options.map(normalize), item.id)
    assert.deepEqual(fullQuestion.options.map(normalize), item.options.map(normalize), item.id)
    assert.equal(question.starVerificationStatus, 'verified-against-source', item.id)
    assert.equal(question.starOrderVerified, true, item.id)
    assert.equal(question.starPositionVerified, true, item.id)
    assert.deepEqual(question.starCorrectOrder, item.order, item.id)
    assert.equal(question.starPosition, item.position, item.id)
    assert.equal(Number(question.correctAnswer ?? question.answer), item.answer, item.id)
    assert.match(fullQuestion.script || '', new RegExp(`<u>${item.text}</u>`, 'u'), item.id)
    assert.equal(
      fullQuestion.script.replace(/<[^>]*>/gu, '').replace(/\s+/gu, ''),
      item.order.map((choice) => item.options[choice - 1]).join(''),
      item.id
    )
    assert.match(question.starVerificationSources?.[0] || '', /#page=5$/u, item.id)
    assert.match(question.starVerificationNote || '', /Visually checked the printed fragments and ★ slot/u, item.id)
    assert.match(question.starVerificationNote || '', /not authenticated as an official/u, item.id)
    for (const explanation of [question.explanation, fullQuestion.explanation, curated[item.id]]) {
      assert.match(explanation || '', /Câu hoàn chỉnh:/u, item.id)
      assert.match(explanation || '', /Dịch:/u, item.id)
      assert.match(explanation || '', /ô ★/u, item.id)
      assert.match(explanation || '', new RegExp(item.text, 'u'), item.id)
      for (let option = 1; option <= 4; option += 1)
        assert.match(explanation || '', new RegExp(`^${option}\\.`, 'mu'), item.id)
    }
    assert.equal(questionReport.appData.answer, item.answer, item.id)
  }
})

test('the secondary answer compilation agrees but is not represented as an official JLPT key', () => {
  assert.equal(report.secondaryAnswerKey.viewerPage, 21)
  assert.deepEqual(
    report.secondaryAnswerKey.answers,
    expected.map((item) => item.answer)
  )
  assert.equal(report.secondaryAnswerKey.matchesStoredAnswers, true)
  assert.match(report.secondaryAnswerKey.authority, /not authenticated as an official/u)
  assert.equal(report.officialKeyEstablished, false)
})

test('the PDF text-layer errors for question 18 are documented as corrected from the rendered page', () => {
  assert.ok(report.textLayerNotes.some((note) => /「運転」.*「運動」/u.test(note)))
  assert.ok(report.textLayerNotes.some((note) => /stray “g”/u.test(note)))
})
