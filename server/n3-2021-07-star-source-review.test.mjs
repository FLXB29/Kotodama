import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import test from 'node:test'

const exams = JSON.parse(fs.readFileSync(path.resolve('data/jlpt_n3_toan_master.json'), 'utf8'))
const fullMaster = JSON.parse(fs.readFileSync(path.resolve('data/jlpt_full_master.json'), 'utf8'))
const curated = JSON.parse(fs.readFileSync(path.resolve('data/jlpt_n3_explanations_curated.json'), 'utf8'))
const report = JSON.parse(fs.readFileSync(path.resolve('reports/n3-quality-audit/star-source-2021-07-review.json'), 'utf8'))
const exam = exams.find((item) => item.id === 'toan-n3-202107-full')
const part = exam.parts.find((item) => item.title.includes('Ngữ pháp') && item.title.includes('Mondai 2'))
const fullExam = fullMaster.find((item) => item.title === 'JLPT-N3 07 2021 - Ngữ Pháp & Đọc Hiểu (文法・読解)')
const fullPart = fullExam.parts.find((item) => item.title === 'Mondai 2')
const expected = [
  { id: 'toan_q_2021_07_49', number: 49, order: [3, 2, 4, 1], answer: 2, position: 1, text: 'いい' },
  { id: 'toan_q_2021_07_50', number: 50, order: [2, 1, 4, 3], answer: 4, position: 2, text: '魚' },
  { id: 'toan_q_2021_07_51', number: 51, order: [2, 3, 1, 4], answer: 1, position: 2, text: '選んでいる' },
  { id: 'toan_q_2021_07_52', number: 52, order: [1, 4, 3, 2], answer: 3, position: 2, text: '作れる' },
  { id: 'toan_q_2021_07_53', number: 53, order: [4, 3, 1, 2], answer: 1, position: 2, text: '形に' },
]

test('July 2021 star fragments, ★ slots, answers, and explanations match the supplied exam PDF', () => {
  assert.equal(report.sourcePdf.driveFileId, '1X0FHPocIsW2BxwmhRuBjKr3Cr8CWu98V')
  assert.equal(report.sourcePdf.renderedPage, 5)
  for (const item of expected) {
    const question = part.questions.find((entry) => entry.id === item.id)
    const fullQuestion = fullPart.questions.find((entry) => entry.number === item.number)
    const questionReport = report.questions.find((entry) => entry.fullExamQuestionId === item.id)
    assert.ok(question, `missing ${item.id}`)
    assert.ok(fullQuestion, `missing standalone question ${item.number}`)
    assert.ok(questionReport, `missing source report for ${item.id}`)
    assert.equal(question.starVerificationStatus, 'verified-against-source', item.id)
    assert.equal(question.starOrderVerified, true, item.id)
    assert.equal(question.starPositionVerified, true, item.id)
    assert.deepEqual(question.starCorrectOrder, item.order, item.id)
    assert.equal(question.starPosition, item.position, item.id)
    assert.equal(question.correctAnswer, item.answer, item.id)
    assert.match(question.starVerificationSources?.[0] || '', /#page=5$/u, item.id)
    assert.match(question.starVerificationNote || '', /Visually checked all four printed fragments/u, item.id)
    assert.match(question.starVerificationNote || '', /not been authenticated as an official/u, item.id)
    for (const explanation of [question.explanation, fullQuestion.explanation, curated[item.id]]) {
      assert.match(explanation || '', /Câu hoàn chỉnh:/u, item.id)
      assert.match(explanation || '', /Dịch:/u, item.id)
      assert.match(explanation || '', /lựa chọn/u, item.id)
      assert.match(explanation || '', new RegExp(item.text, 'u'), item.id)
    }
    assert.equal(questionReport.appData.answer, item.answer, item.id)
  }
})

test('the secondary answer compilation agrees but is not represented as an official JLPT key', () => {
  assert.equal(report.secondaryAnswerKey.viewerPage, 22)
  assert.deepEqual(report.secondaryAnswerKey.answers, expected.map((item) => item.answer))
  assert.equal(report.secondaryAnswerKey.matchesStoredAnswers, true)
  assert.equal(report.secondaryAnswerKey.officialKeyEstablished, undefined)
  assert.match(report.secondaryAnswerKey.authority, /not authenticated as an official/u)
  assert.equal(report.officialKeyEstablished, false)
})
