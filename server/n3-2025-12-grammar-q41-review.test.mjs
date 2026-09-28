import assert from 'node:assert/strict'
import fs from 'node:fs'
import test from 'node:test'
import { NhaiKanjiService } from './nhaikanji-service.mjs'

const curated = JSON.parse(fs.readFileSync('data/jlpt_n3_explanations_curated.json', 'utf8'))
const master = JSON.parse(fs.readFileSync('data/jlpt_n3_toan_master.json', 'utf8'))
const review = JSON.parse(
  fs.readFileSync('reports/n3-quality-audit/grammar-explanation-2025-12-q41-review.json', 'utf8')
)

test('December 2025 grammar question 41 distinguishes ～ておく from finishing a book', () => {
  assert.equal(review.questionId, 'toan_q_2025_12_41')
  assert.equal(review.source.pattern, '縮約形（～ておく／～でおく）')
  assert.match(review.source.meaning, /làm trước hoặc chuẩn bị sẵn/u)
  assert.equal(review.browserVerification.browser, 'Chrome')
  assert.match(review.browserVerification.result, /all four options/u)
  const sourceQuestion = master
    .flatMap((exam) => exam.parts || [])
    .flatMap((part) => part.questions || [])
    .find((q) => q.id === review.questionId)
  assert.ok(sourceQuestion)
  assert.equal(sourceQuestion.explanation, curated[review.questionId])
  assert.match(curated[review.questionId], /「～ておく」/u)
  assert.match(curated[review.questionId], /đúng ngữ pháp/u)
  assert.match(curated[review.questionId], /không nói rõ mốc “đọc xong”/u)
  assert.match(curated[review.questionId], /Dịch:.*Em gái.*Chị/u)
  for (let option = 1; option <= 4; option += 1) {
    assert.match(curated[review.questionId], new RegExp(`^${option}\\.`, 'mu'))
  }

  const served = new NhaiKanjiService().getJlptExamDetail('toan-n3-202512-full')
  const question = served.parts.flatMap((part) => part.questions || []).find((item) => item.id === review.questionId)
  assert.equal(question?.answer, 4)
  assert.match(question?.explanation || '', /～ておく/u)
  assert.match(question?.explanation || '', /読み終わったら/u)
})
