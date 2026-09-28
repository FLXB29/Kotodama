import test from 'node:test'
import assert from 'node:assert/strict'
import fs from 'node:fs'
import { NhaiKanjiService } from './nhaikanji-service.mjs'

const master = JSON.parse(fs.readFileSync('data/jlpt_n3_toan_master.json', 'utf8'))
const curated = JSON.parse(fs.readFileSync('data/jlpt_n3_explanations_curated.json', 'utf8'))
const report = JSON.parse(fs.readFileSync('reports/n3-quality-audit/grammar-2010-07-cloze-followup.json', 'utf8'))
const starReview = JSON.parse(fs.readFileSync('reports/n3-quality-audit/star-source-2010-07-review.json', 'utf8'))
const exam = master.find((entry) => entry.id === 'toan-n3-201007-full')
const questions = exam.parts.filter((part) => part.title.includes('Ngữ pháp')).flatMap((part) => part.questions || [])
const withoutPatternLookup = (text) =>
  String(text || '')
    .replace(/\n{2,}Mẫu ngữ pháp được nhận diện từ dữ liệu N3 cục bộ[\s\S]*$/u, '')
    .trim()

test('July 2010 grammar star question 18 uses the source-verified star slot and answer', () => {
  const question = questions.find((entry) => Number(entry.number) === 53)
  const reviewed = starReview.questions.find((entry) => entry.printedQuestion === 18)
  assert.equal(question.correctAnswer, 4)
  assert.equal(question.answer, 4)
  assert.equal(question.starPosition, 1)
  assert.deepEqual(question.starCorrectOrder, [2, 4, 1, 3])
  assert.equal(question.starPositionVerified, true)
  assert.equal(question.starVerificationStatus, 'verified-against-source')
  assert.ok(question.starVerificationSources.includes(starReview.sourcePdf.url))
  assert.ok(question.explanation.includes(reviewed.completedSentence))
  assert.ok(question.explanation.includes(reviewed.translation))
  assert.equal(curated[question.id], question.explanation)
  assert.match(question.explanation, /Dịch:/u)
  assert.match(question.explanation, /2 → 4 → 1 → 3/u)
  assert.match(question.explanation, /ô ★ nằm ở vị trí thứ hai/u)
  for (let option = 1; option <= 4; option++) {
    assert.match(question.explanation, new RegExp('^' + option + '\\.', 'mu'))
  }
})

test('July 2010 cloze source restores 一台の and explains why この fits the passage', () => {
  const question = questions.find((entry) => Number(entry.number) === 55)
  const correction = report.corrections.find((entry) => entry.questionNumber === 55)
  assert.deepEqual(question.options, ['1. ある', '2. 一台の', '3. この', '4. ふつうの'])
  assert.equal(question.correctAnswer, 3)
  assert.equal(withoutPatternLookup(question.explanation), correction.explanation)
  assert.equal(curated[question.id], question.explanation)
  assert.match(question.explanation, /Dịch câu:/u)
  assert.match(question.explanation, /2\. 一台の/u)
  assert.match(question.explanation, /đúng ngữ pháp/u)
  for (let option = 1; option <= 4; option++) {
    assert.match(question.explanation, new RegExp('^' + option + '\\.', 'mu'))
  }
})

test('July 2010 cloze question 22 explains the causal connector and all alternatives', () => {
  const question = questions.find((entry) => Number(entry.number) === 57)
  const correction = report.corrections.find((entry) => entry.questionNumber === 57)
  assert.equal(question.correctAnswer, 2)
  assert.equal(withoutPatternLookup(question.explanation), correction.explanation)
  assert.equal(curated[question.id], question.explanation)
  assert.match(question.explanation, /ですから/u)
  assert.match(question.explanation, /Dịch câu:/u)
  for (let option = 1; option <= 4; option++) {
    assert.match(question.explanation, new RegExp('^' + option + '\\.', 'mu'))
  }
})

test('the exam service returns the corrected grammar content', () => {
  const service = new NhaiKanjiService()
  const served = service.getJlptExamDetail(exam.id)
  const servedQuestions = served.parts
    .filter((part) => part.title.includes('Ngữ pháp'))
    .flatMap((part) => part.questions || [])
  for (const number of [53, 55, 57]) {
    const stored = questions.find((entry) => Number(entry.number) === number)
    const result = servedQuestions.find((entry) => Number(entry.number) === number)
    assert.equal(result.explanation, stored.explanation)
    assert.equal(result.correctAnswer, stored.correctAnswer)
    if (number === 53) assert.equal(result.starPosition, 1)
  }
})
