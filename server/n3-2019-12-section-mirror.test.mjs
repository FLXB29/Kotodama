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

test('N3 December 2019 standalone sections preserve source wording, keys, explanations, and grading', () => {
  const fullMaster = readJson('data/jlpt_full_master.json')
  const mockMaster = readJson('data/jlpt_n3_toan_master.json')
  const vocabulary = fullMaster.find((exam) => exam.id === 'cm2u2xbu400ta134iaz003jdg-vocab')
  const grammarReading = fullMaster.find((exam) => exam.id === 'cm2u2xbu400ta134iaz003jdg-grammar-reading')
  const listening = fullMaster.find((exam) => exam.id === 'cm2u2xbu400ta134iaz003jdg-listening')
  const fullMock = mockMaster.find((exam) => exam.id === 'toan-n3-201912-full')
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
  const expectedAnswers = new Map([
    [1, 2],
    [2, 4],
    [3, 1],
    [4, 2],
    [5, 3],
    [6, 1],
    [7, 4],
    [8, 1],
    [9, 4],
    [10, 3],
    [11, 4],
    [12, 3],
    [13, 1],
    [14, 2],
    [15, 3],
    [16, 2],
    [17, 3],
    [18, 1],
    [19, 1],
    [20, 4],
    [21, 2],
    [22, 4],
    [23, 3],
    [24, 2],
    [25, 4],
    [26, 2],
    [27, 4],
    [28, 4],
    [29, 2],
    [30, 1],
    [31, 2],
    [32, 1],
    [33, 3],
    [34, 3],
    [35, 2],
  ])
  for (const [number, expectedAnswer] of expectedAnswers) {
    const question = vocabularyQuestions.get(number)
    const sourceQuestion = fullMockQuestions.get(number)
    assert.ok(question && sourceQuestion)
    assert.equal(Number(question.correctAnswer ?? question.answer), expectedAnswer)
    assert.equal(Number(sourceQuestion.correctAnswer ?? sourceQuestion.answer), expectedAnswer)
    assert.equal(question.sentence, question.question, `Question ${number} must display the reviewed prompt.`)
    assert.equal(
      sourceQuestion.sentence,
      sourceQuestion.question,
      `Full mock question ${number} must display the reviewed prompt.`
    )
    assert.ok(question.explanation.length > 200, `Question ${number} needs a complete explanation.`)
    assert.match(question.explanation, /Đáp án/u)
    for (const choiceNumber of [1, 2, 3, 4]) assert.ok(question.explanation.includes(`${choiceNumber}.`))
    assert.equal(
      question.explanation,
      sourceQuestion.explanation,
      `Question ${number} must use the same reviewed explanation in both exam views.`
    )
  }

  assert.equal(optionText(vocabularyQuestions.get(31).options[2]), '駅前にある大きなビルは、古いけど健康だそうだ。')
  assert.equal(optionText(vocabularyQuestions.get(12).options[0]), '一藩的')
  assert.equal(Number(vocabularyQuestions.get(12).correctAnswer ?? vocabularyQuestions.get(12).answer), 3)
  assert.match(vocabularyQuestions.get(15).question, /会社に/u)
  assert.match(vocabularyQuestions.get(15).sentence, /会社に/u)
  assert.match(vocabularyQuestions.get(21).question, /ホテルは慎重/u)
  assert.match(vocabularyQuestions.get(21).sentence, /ホテルは慎重/u)
  assert.match(vocabularyQuestions.get(1).explanation, /10時に予約/u)
  assert.match(vocabularyQuestions.get(2).explanation, /あの頃は私も若かった/u)
  assert.match(vocabularyQuestions.get(20).explanation, /誰でも木村さん/u)
  assert.match(vocabularyQuestions.get(22).explanation, /お弁当を買うことにしました/u)
  assert.match(vocabularyQuestions.get(23).explanation, /初めてスピーチ/u)
  assert.equal(
    optionText(vocabularyQuestions.get(31).options[3]),
    '最近パソコンが健康ではないみたいで、ときどき変な音がする。'
  )
  assert.equal(optionText(vocabularyQuestions.get(32).options[0]), '高橋さんは今度の留学セミナーに参加しますか。')
  assert.equal(optionText(vocabularyQuestions.get(33).options[1]), '今日のサッカーは試合の中旬に点が入りました。')
  assert.equal(optionText(vocabularyQuestions.get(35).options[1]), '夜になると、お隣さんの犬がほえていて、うるさい。')
  assert.equal(optionText(vocabularyQuestions.get(35).options[2]), '私は毎朝、目覚まし時計がほえる音で起きる。')
  assert.ok(vocabularyQuestions.get(32).explanation.includes('ゼミナー'))
  assert.ok(vocabularyQuestions.get(32).explanation.includes('セミナー'))

  const grammarNumbers = questionsOf(grammarReading).map((question) => Number(question.number))
  assert.deepEqual(
    grammarNumbers,
    Array.from({ length: 39 }, (_, index) => index + 36)
  )
  assert.deepEqual(
    questionsOf(listening).map((question) => Number(question.number)),
    Array.from({ length: 28 }, (_, index) => index + 1)
  )

  const service = new NhaiKanjiService()
  const servedExams = [vocabulary, grammarReading, listening].map((exam) => service.getJlptExamDetail(exam.id))
  for (const number of expectedAnswers.keys()) {
    const servedQuestion = questionsOf(servedExams[0]).find((question) => Number(question.number) === number)
    assert.ok(servedQuestion?.explanation, `Question ${number} must be explained by the API.`)
    assert.ok(
      !servedQuestion.explanation.includes('Nguồn đề chưa có phần giải thích chi tiết'),
      `Question ${number} must not fall back to the missing-explanation placeholder.`
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
