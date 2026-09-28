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

test('N3 July 2021 grammar questions 36–48 match the source, key sheet, explanations, and both exam views', () => {
  const fullMockMaster = readJson('data/jlpt_n3_toan_master.json')
  const standaloneMaster = readJson('data/jlpt_full_master.json')
  const curated = readJson('data/jlpt_n3_explanations_curated.json')
  const keyReview = readJson('reports/n3-quality-audit/answer-key-2021-07-grammar.json')
  const explanationReview = readJson('reports/n3-quality-audit/grammar-explanation-2021-07-review.json')
  const fullMock = fullMockMaster.find((exam) => exam.id === 'toan-n3-202107-full')
  const standalone = standaloneMaster.find((exam) => exam.id === 'cm2u2xkhj00zx134iasxlu6kb-grammar-reading')
  assert.ok(fullMock, 'Missing July 2021 full mock.')
  assert.ok(standalone, 'Missing July 2021 standalone grammar-reading exam.')

  const fullMockQuestions = questionsOf(fullMock)
    .filter((question) => Number(question.number) >= 36 && Number(question.number) <= 48)
    .sort((left, right) => Number(left.number) - Number(right.number))
  const standaloneQuestions = standalone.parts
    .filter((part) => part.title.includes('Mondai 1'))
    .flatMap((part) => part.questions || [])
    .sort((left, right) => Number(left.number) - Number(right.number))
  const expectedAnswers = [3, 4, 4, 2, 1, 3, 1, 4, 3, 1, 3, 2, 2]
  const questionNumbers = Array.from({ length: 13 }, (_, index) => index + 36)
  assert.deepEqual(
    fullMockQuestions.map((question) => Number(question.number)),
    questionNumbers
  )
  assert.deepEqual(
    standaloneQuestions.map((question) => Number(question.number)),
    questionNumbers
  )
  assert.deepEqual(
    fullMockQuestions.map((question) => Number(question.correctAnswer ?? question.answer)),
    expectedAnswers
  )
  assert.deepEqual(
    standaloneQuestions.map((question) => Number(question.correctAnswer ?? question.answer)),
    expectedAnswers
  )

  assert.equal(keyReview.totals.storedMatchesReference, 13)
  assert.equal(keyReview.totals.standaloneMatchesReference, 13)
  assert.equal(keyReview.totals.userProvidedAnswerSheetMatches, 13)
  assert.equal(keyReview.officialAnswerPdfConfirmed, false)
  assert.equal(explanationReview.sourceReview.storedAnswersMatchUserProvidedSheet, 13)
  assert.equal(explanationReview.sourceReview.answerSheetPdfPage, 22)
  assert.equal(explanationReview.sourceReview.officialAnswerPdfConfirmed, false)
  assert.equal(explanationReview.totals.sourceTranscriptionCorrections, 16)

  for (let index = 0; index < 13; index++) {
    const mockQuestion = fullMockQuestions[index]
    const standaloneQuestion = standaloneQuestions[index]
    const explanation = mockQuestion.explanation || curated[mockQuestion.id] || ''
    assert.ok(explanation.length > 200, `${mockQuestion.number}: explanation is incomplete.`)
    assert.equal(explanation, curated[mockQuestion.id], `${mockQuestion.id}: curated and embedded explanations differ.`)
    assert.equal(
      standaloneQuestion.explanation,
      explanation,
      `${mockQuestion.number}: exam views must share the reviewed explanation.`
    )
    assert.match(explanation, /Dịch:/u, `${mockQuestion.number}: missing Vietnamese translation.`)
    for (let choice = 1; choice <= 4; choice++) {
      assert.match(
        explanation,
        new RegExp(`^${choice}\\.`, 'mu'),
        `${mockQuestion.number}: missing choice ${choice} explanation.`
      )
    }
    assert.deepEqual(
      mockQuestion.options.map(optionText),
      standaloneQuestion.options.map(optionText),
      `${mockQuestion.number}: options must match between the exam views.`
    )
  }

  const questionByNumber = (questions, number) => questions.find((question) => Number(question.number) === number)
  const mock37 = questionByNumber(fullMockQuestions, 37)
  const mock40 = questionByNumber(fullMockQuestions, 40)
  const mock41 = questionByNumber(fullMockQuestions, 41)
  const mock42 = questionByNumber(fullMockQuestions, 42)
  const mock44 = questionByNumber(fullMockQuestions, 44)
  const mock45 = questionByNumber(fullMockQuestions, 45)
  const mock46 = questionByNumber(fullMockQuestions, 46)
  const mock47 = questionByNumber(fullMockQuestions, 47)
  const mock48 = questionByNumber(fullMockQuestions, 48)
  const standalone40 = questionByNumber(standaloneQuestions, 40)
  const standalone47 = questionByNumber(standaloneQuestions, 47)
  const standalone48 = questionByNumber(standaloneQuestions, 48)
  assert.equal(optionText(mock37.options[2]), 'ようやく')
  assert.equal(optionText(mock40.options[1]), 'ままで')
  assert.equal(optionText(mock40.options[2]), '間だから')
  assert.equal(optionText(mock41.options[0]), '何とか')
  assert.equal(optionText(mock41.options[3]), '何でも')
  assert.match(mock41.question, /きれいなんだろうか/u)
  assert.match(mock42.question, /絵がかざれるので/u)
  assert.match(mock44.question, /隣に立っている人/u)
  assert.match(mock45.question, /国際大会での/u)
  assert.doesNotMatch(mock45.question, /国際大会出の/u)
  assert.equal(optionText(mock46.options[3]), 'しなきゃ')
  assert.match(mock47.question, /おいしい食べ物をたくさん/u)
  assert.match(standalone40.question, /この図書館は/u)
  assert.doesNotMatch(standalone40.question, /この図書館はは/u)
  assert.match(standalone47.question, /昨日はどうも/u)
  assert.equal(optionText(standalone48.options[0]), '出すつもりかもしれない')
  assert.equal(optionText(standalone48.options[3]), '出なくてもよさそうだ')
  assert.match(mock40.explanation, /3\. 間だから:.*nguyên nhân/u)
  assert.match(mock41.explanation, /1\. 何とか:/u)
  assert.match(mock41.explanation, /なんだろうか/u)
  assert.match(mock42.explanation, /かざれる/u)
  assert.match(mock45.explanation, /PDF in 「国際大会出の」/u)
  assert.doesNotMatch(mock45.explanation, /lựa chọn 3 trong dữ liệu thiếu/u)
  assert.match(mock48.explanation, /1\. 出すつもりかもしれない/u)

  const service = new NhaiKanjiService()
  for (const exam of [fullMock, standalone]) {
    const served = service.getJlptExamDetail(exam.id)
    const servedQuestions = questionsOf(served)
      .filter((question) => Number(question.number) >= 36 && Number(question.number) <= 48)
      .sort((left, right) => Number(left.number) - Number(right.number))
    assert.deepEqual(
      servedQuestions.map((question) => question.explanation),
      fullMockQuestions.map((question) => question.explanation),
      `${exam.id}: API must serve all reviewed grammar explanations.`
    )
  }
})
