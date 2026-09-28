import assert from 'node:assert/strict'
import fs from 'node:fs'
import test from 'node:test'
import { NhaiKanjiService } from './nhaikanji-service.mjs'

const master = JSON.parse(fs.readFileSync('data/jlpt_n3_toan_master.json', 'utf8'))
const curated = JSON.parse(fs.readFileSync('data/jlpt_n3_explanations_curated.json', 'utf8'))
const review = JSON.parse(fs.readFileSync('reports/n3-quality-audit/grammar-m3-2025-12-review.json', 'utf8'))
const exam = master.find((entry) => entry.id === 'toan-n3-202512-full')
const part = exam?.parts?.find((entry) => entry.id === review.partId)
const questions = new Map((part?.questions || []).map((question) => [question.id, question]))
const plain = (text) =>
  String(text || '')
    .replace(/<[^>]*>/gu, ' ')
    .replace(/\s+/gu, ' ')
    .trim()

test('December 2025 grammar cloze passage matches its source and preserves the answer keys', () => {
  assert.ok(part)
  assert.match(part.instruction, /19から22/u)
  assert.doesNotMatch(part.instruction, /29|33/u)
  assert.equal(review.sourceInstructionCorrection.pdfPage, 10)
  assert.equal(review.sourceInstructionCorrection.visualCrossCheck, true)
  assert.match(review.sourceInstructionCorrection.priorStoredInstruction, /（\s*29\s*）から（\s*33\s*）/u)
  assert.match(plain(part.passage), /にはないデザートやパンや弁当などがあるのです/u)
  assert.doesNotMatch(plain(part.passage), /コンビニはないデザート|弁当のです/u)
  assert.equal(review.sourcePassageCorrection.pdfPage, 10)
  assert.equal(review.sourcePassageCorrection.visualCrossCheck, true)
  assert.equal(review.answerKeyCrossCheck.pdfPage, 31)
  assert.equal(
    review.answerKeyCrossCheck.limitation,
    'This is a third-party answer compilation, not an official JLPT answer key.'
  )
  assert.deepEqual(review.answerKeyCrossCheck.answers, { 19: 3, 20: 4, 21: 1, 22: 2 })
  assert.equal(review.browserVerification.browser, 'Chrome')

  const expected = [
    ['toan_q_2025_12_54', 3],
    ['toan_q_2025_12_55', 4],
    ['toan_q_2025_12_56', 1],
    ['toan_q_2025_12_57', 2],
  ]
  for (const [questionId, answer] of expected) {
    const question = questions.get(questionId)
    assert.ok(question, questionId)
    assert.equal(question.correctAnswer, answer)
    assert.equal(question.explanation, curated[questionId])
    assert.equal(question.explanation, review.questions.find((entry) => entry.questionId === questionId)?.explanation)
    for (let option = 1; option <= 4; option += 1) {
      assert.match(question.explanation, new RegExp(`^${option}\\.`, 'mu'), `${questionId} option ${option}`)
    }
    assert.match(question.explanation, /Dịch:/u)
    assert.match(question.explanation, /Ghi nhớ:/u)
  }
})

test('the conjunction でも is not mislabeled as the particle pattern Nでも', () => {
  const explanation = questions.get('toan_q_2025_12_55')?.explanation || ''
  assert.match(explanation, /liên từ đầu câu thể hiện tương phản/u)
  assert.match(explanation, /không phải trợ từ 「Nでも」/u)
  assert.doesNotMatch(explanation, /Mẫu ngữ pháp được nhận diện từ dữ liệu N3 cục bộ/u)
  assert.equal(review.grammarPatternException.contextualUse, 'Sentence-initial conjunction meaning “but/however”.')
})

test('the served full exam includes the corrected passage and four detailed explanations', () => {
  const served = new NhaiKanjiService().getJlptExamDetail('toan-n3-202512-full')
  const servedPart = served?.parts?.find((entry) => entry.id === review.partId)
  assert.ok(servedPart)
  assert.match(plain(servedPart.passage), /にはないデザートやパンや弁当などがあるのです/u)
  for (const [questionId, answer] of [
    ['toan_q_2025_12_54', 3],
    ['toan_q_2025_12_55', 4],
    ['toan_q_2025_12_56', 1],
    ['toan_q_2025_12_57', 2],
  ]) {
    const question = servedPart.questions.find((entry) => entry.id === questionId)
    assert.equal(question?.answer, answer)
    assert.equal(question?.explanation, curated[questionId])
  }
  assert.doesNotMatch(questions.get('toan_q_2025_12_57')?.explanation || '', /「その場所」/u)
})
