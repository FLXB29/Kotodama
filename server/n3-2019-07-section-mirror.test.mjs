import assert from 'node:assert/strict'
import fs from 'node:fs'
import test from 'node:test'
import { NhaiKanjiService } from './nhaikanji-service.mjs'

const readJson = (file) => JSON.parse(fs.readFileSync(file, 'utf8'))
const questionsOf = (exam) => exam.parts.flatMap((part) => part.questions || [])
const normalizeText = (value) =>
  String(value || '')
    .replace(/<br\s*\/?\s*>/giu, ' ')
    .replace(/<[^>]*>/gu, '')
    .normalize('NFKC')
    .replace(/[\s「」『』【】()（）［］:：,，、。.!！?？]/gu, '')

test('N3 July 2019 standalone sections contain the right questions and checked content', () => {
  const source = readJson('data/jlpt_full_master.json')
  const mock = readJson('data/jlpt_n3_toan_master.json').find((exam) => exam.id === 'toan-n3-201907-full')
  const vocabulary = source.find((exam) => exam.id === 'cm2u2x7h500py134iyd65aphn-vocab')
  const grammarReading = source.find((exam) => exam.id === 'cm2u2x7h500py134iyd65aphn-grammar-reading')
  assert.ok(mock && vocabulary && grammarReading)

  assert.equal(vocabulary.questionCount, 35)
  assert.equal(grammarReading.questionCount, 39)
  assert.deepEqual(
    vocabulary.parts.map((part) => part.questions.length),
    [8, 6, 11, 5, 5]
  )
  assert.deepEqual(
    grammarReading.parts.map((part) => part.questions.length),
    [13, 5, 5, 4, 6, 4, 2]
  )
  assert.deepEqual(
    vocabulary.parts.map((part) => part.title),
    ['Mondai 1', 'Mondai 2', 'Mondai 3', 'Mondai 4', 'Mondai 5']
  )
  assert.deepEqual(
    grammarReading.parts.map((part) => part.title),
    ['Mondai 1', 'Mondai 2', 'Mondai 3', 'Mondai 4', 'Mondai 5', 'Mondai 6', 'Mondai 7']
  )

  const sectionQuestions = new Map(questionsOf(grammarReading).map((question) => [question.number, question]))
  const mockQuestions = new Map(questionsOf(mock).map((question) => [question.number, question]))
  for (let number = 36; number <= 48; number++) {
    const sectionQuestion = sectionQuestions.get(number)
    const mockQuestion = mockQuestions.get(number)
    assert.equal(normalizeText(sectionQuestion.question), normalizeText(mockQuestion.question))
    assert.deepEqual(sectionQuestion.options, mockQuestion.options)
    assert.equal(Number(sectionQuestion.correctAnswer), Number(mockQuestion.correctAnswer))
  }

  for (let number = 49; number <= 53; number++) {
    const question = sectionQuestions.get(number)
    assert.ok(question.starPrompt, `Question ${number} should use the ordered assembly interaction.`)
    assert.equal(question.starPosition, 2, `Question ${number} places ★ in fragment three.`)
    assert.equal(question.starCorrectOrder[question.starPosition], Number(question.correctAnswer))
  }
  assert.deepEqual(
    sectionQuestions.get(65).options,
    mockQuestions.get(65).options,
    'Reading question 65 must keep the source PDF option order.'
  )

  const service = new NhaiKanjiService()
  const served = service.getJlptExamDetail(grammarReading.id)
  const servedQuestions = new Map(questionsOf(served).map((question) => [question.number, question]))
  for (let number = 36; number <= 58; number++) {
    assert.ok(servedQuestions.get(number).explanation, `Question ${number} should inherit its matching explanation.`)
  }
  assert.ok(servedQuestions.get(65).explanation, 'Question 65 should inherit its source-matched reading note.')

  const answers = Object.fromEntries(
    questionsOf(served).map((question) => [question.id, question.correctAnswer ?? question.answer])
  )
  const result = service.submitJlptExam(grammarReading.id, answers)
  assert.equal(result.totalQuestions, 39)
  assert.equal(result.sectionBreakdown.section1.total, 23)
  assert.equal(result.sectionBreakdown.section2.total, 16)
  assert.equal(result.sectionBreakdown.section3.total, 0)
  assert.equal(result.correctCount, 39)
})
