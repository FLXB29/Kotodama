import assert from 'node:assert/strict'
import fs from 'node:fs'
import test from 'node:test'
import { NhaiKanjiService } from './nhaikanji-service.mjs'

const readJson = (file) => JSON.parse(fs.readFileSync(file, 'utf8'))
const questionsOf = (exam) => exam.parts.flatMap((part) => part.questions || [])
const optionText = (option) =>
  String(typeof option === 'object' && option ? (option.text ?? option.value ?? '') : option)
    .normalize('NFKC')
    .replace(/^\s*[1-4][.．、\s　)]*/u, '')
    .replace(/\s+/gu, ' ')
    .trim()
const normalizeScript = (value) =>
  String(value || '')
    .normalize('NFKC')
    .replace(/少な過ぎる/gu, '少なすぎる')
    .replace(/[\s。.!！?？:：,，、]/gu, '')

test('N3 December 2016 standalone sections have correct ranges, content, and grading groups', () => {
  const fullMaster = readJson('data/jlpt_full_master.json')
  const mockMaster = readJson('data/jlpt_n3_toan_master.json')
  const vocabulary = fullMaster.find((exam) => exam.id === 'cm2u2wlnt0097134ira8pl9rk-vocab')
  const grammarReading = fullMaster.find((exam) => exam.id === 'cm2u2wlnt0097134ira8pl9rk-grammar-reading')
  const listening = fullMaster.find((exam) => exam.id === 'cm2u2wlnt0097134ira8pl9rk-listening')
  const fullMock = mockMaster.find((exam) => exam.id === 'toan-n3-201612-full')
  assert.ok(vocabulary && grammarReading && listening && fullMock)

  assert.equal(vocabulary.questionCount, 35)
  assert.equal(grammarReading.questionCount, 39)
  assert.equal(listening.questionCount, 28)
  assert.deepEqual(
    vocabulary.parts.map((part) => part.questions.length),
    [8, 6, 11, 5, 5]
  )
  assert.deepEqual(
    grammarReading.parts.map((part) => part.questions.length),
    [13, 5, 5, 4, 6, 4, 2]
  )
  assert.deepEqual(
    listening.parts.map((part) => part.questions.length),
    [6, 6, 3, 4, 9]
  )

  const fullMockQuestions = new Map(questionsOf(fullMock).map((question) => [Number(question.number), question]))
  const vocabularyQuestions = new Map(questionsOf(vocabulary).map((question) => [Number(question.number), question]))
  for (let number = 31; number <= 35; number++) {
    const sectionQuestion = vocabularyQuestions.get(number)
    const sourceQuestion = fullMockQuestions.get(number)
    assert.ok(sectionQuestion && sourceQuestion)
    assert.deepEqual(sectionQuestion.options.map(optionText), sourceQuestion.options.map(optionText))
    assert.equal(Number(sectionQuestion.correctAnswer ?? sectionQuestion.answer), Number(sourceQuestion.correctAnswer))
  }

  const grammarQuestions = new Map(questionsOf(grammarReading).map((question) => [Number(question.number), question]))
  assert.deepEqual(
    [...grammarQuestions.keys()],
    Array.from({ length: 39 }, (_, index) => index + 36)
  )
  const listeningQuestions = new Map(questionsOf(listening).map((question) => [Number(question.number), question]))
  assert.deepEqual(
    [...listeningQuestions.keys()],
    Array.from({ length: 28 }, (_, index) => index + 1)
  )
  for (let number = 16; number <= 19; number++) {
    const question = listeningQuestions.get(number)
    const sourceQuestion = fullMockQuestions.get(number + 74)
    assert.ok(question && sourceQuestion)
    assert.equal(Number(question.correctAnswer ?? question.answer), Number(sourceQuestion.correctAnswer))
    assert.equal(normalizeScript(question.script), normalizeScript(sourceQuestion.script))
  }
  assert.match(fullMockQuestions.get(93).script, /^今日はあまりおなかがすいていません。/u)

  const service = new NhaiKanjiService()
  const servedVocabulary = service.getJlptExamDetail(vocabulary.id)
  const servedVocabularyQuestions = new Map(
    questionsOf(servedVocabulary).map((question) => [Number(question.number), question])
  )
  for (let number = 31; number <= 35; number++) {
    assert.ok(
      servedVocabularyQuestions.get(number).explanation,
      `Question ${number} should inherit its matching explanation.`
    )
  }

  const submitAllCorrect = (exam) => {
    const served = service.getJlptExamDetail(exam.id)
    const answers = Object.fromEntries(
      questionsOf(served).map((question) => [question.id, question.correctAnswer ?? question.answer])
    )
    return service.submitJlptExam(exam.id, answers)
  }
  const vocabularyResult = submitAllCorrect(vocabulary)
  assert.equal(vocabularyResult.totalQuestions, 35)
  assert.equal(vocabularyResult.correctCount, 35)
  assert.equal(vocabularyResult.sectionBreakdown.section1.total, 35)

  const grammarResult = submitAllCorrect(grammarReading)
  assert.equal(grammarResult.totalQuestions, 39)
  assert.equal(grammarResult.correctCount, 39)
  assert.equal(grammarResult.sectionBreakdown.section1.total, 23)
  assert.equal(grammarResult.sectionBreakdown.section2.total, 16)

  const listeningResult = submitAllCorrect(listening)
  assert.equal(listeningResult.totalQuestions, 28)
  assert.equal(listeningResult.correctCount, 28)
  assert.equal(listeningResult.sectionBreakdown.section3.total, 28)
})
