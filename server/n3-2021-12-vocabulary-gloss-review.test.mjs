import assert from 'node:assert/strict'
import fs from 'node:fs'
import test from 'node:test'
import { NhaiKanjiService } from './nhaikanji-service.mjs'

const readJson = (file) => JSON.parse(fs.readFileSync(file, 'utf8'))
const allQuestions = (exam) => exam.parts.flatMap((part) => part.questions || [])
const expectedOption = (option) => option.normalize('NFKC').replace(/\s+/gu, '')

test('December 2021 vocabulary grouping and 25 manually reviewed explanations are correct in both exam views', () => {
  const fullMaster = readJson('data/jlpt_n3_toan_master.json')
  const standaloneMaster = readJson('data/jlpt_full_master.json')
  const curated = readJson('data/jlpt_n3_explanations_curated.json')
  const review = readJson('reports/n3-quality-audit/vocabulary-gloss-2021-12-review.json')
  const fullMock = fullMaster.find((exam) => exam.id === 'toan-n3-202112-full')
  const vocabulary = standaloneMaster.find((exam) => exam.id === 'cm2u2xosv0138134ib0bvpy32-vocab')
  const grammarReading = standaloneMaster.find((exam) => exam.id === 'cm2u2xosv0138134ib0bvpy32-grammar-reading')
  assert.ok(fullMock)
  assert.ok(vocabulary)
  assert.ok(grammarReading)
  assert.equal(review.reviewedQuestionCount, 25)
  assert.equal(review.reviewedChoiceCount, 100)
  assert.equal(review.sourceLimits.officialAnswerKeyConfirmed, false)
  assert.equal(review.sourceLimits.userProvidedAnswerSheetVisuallyInspected, true)
  assert.equal(review.sourceLimits.userProvidedAnswerSheetPage, 23)
  assert.equal(review.answerKeyReview.questionCount, 35)
  assert.equal(review.answerKeyReview.fullMockMatches, 35)
  assert.equal(review.answerKeyReview.standaloneMatches, 35)
  assert.equal(review.answerKeyReview.officialAnswerPdfConfirmed, false)
  assert.match(review.answerKeyReview.qualification, /not an official JLPT answer notice/u)
  assert.equal(review.sourceLimits.originalPdfTextFetched, true)
  assert.equal(review.sourceLimits.questionPdfVisuallyInspected, true)
  assert.deepEqual(review.sourceLimits.visuallyInspectedPages, [4, 5, 6])
  assert.deepEqual(
    review.sourceCorrections.map(({ questionNumber, optionNumber, sourceText, result }) => ({
      questionNumber,
      optionNumber,
      sourceText,
      result,
    })),
    [
      {
        questionNumber: 6,
        optionNumber: 2,
        sourceText: 'せいえた',
        result: 'corrected-full-mock-to-source',
      },
      {
        questionNumber: 12,
        optionNumber: 3,
        sourceText: '替け',
        result: 'corrected-full-mock-to-source',
      },
      {
        questionNumber: 30,
        optionNumber: 1,
        sourceText: undefined,
        result: 'pdf-source-misprint-retained-natural-app-text',
      },
      {
        questionNumber: 33,
        optionNumber: 4,
        sourceText: 'しましょう',
        result: 'corrected-standalone-from-visual-source-review',
      },
      {
        questionNumber: 34,
        optionNumber: 3,
        sourceText: 'ください',
        result: 'corrected-standalone-from-visual-source-review',
      },
    ]
  )
  assert.deepEqual(review.transcriptionCorrections, [
    {
      questionNumber: 27,
      fields: ['question', 'sentence'],
      previousStandaloneText: 'くだきい',
      sourceText: 'ください',
      result: 'corrected-standalone-from-visual-source-review',
    },
  ])
  assert.deepEqual(review.sectionClassification, {
    vocabularyBefore: 24,
    grammarReadingBefore: 49,
    vocabularyAfter: 35,
    grammarReadingAfter: 38,
    movedQuestionNumbers: Array.from({ length: 11 }, (_, index) => index + 15),
    mondaiLabelsReindexed: true,
  })

  const vocabularyQuestions = allQuestions(vocabulary)
  const grammarQuestions = allQuestions(grammarReading)
  assert.deepEqual(
    review.answerKeyReview.answerSequence,
    vocabularyQuestions
      .slice()
      .sort((a, b) => Number(a.number) - Number(b.number))
      .map((question) => Number(question.correctAnswer ?? question.answer))
  )
  assert.deepEqual(
    review.answerKeyReview.answerSequence,
    allQuestions(fullMock)
      .filter((question) => Number(question.number) >= 1 && Number(question.number) <= 35)
      .sort((a, b) => Number(a.number) - Number(b.number))
      .map((question) => Number(question.correctAnswer ?? question.answer))
  )
  assert.equal(vocabularyQuestions.length, 35)
  assert.equal(new Set(vocabularyQuestions.map((question) => Number(question.number))).size, 35)
  assert.deepEqual(
    vocabularyQuestions.map((question) => Number(question.number)).sort((a, b) => a - b),
    Array.from({ length: 35 }, (_, index) => index + 1)
  )
  assert.equal(grammarQuestions.length, 38)
  assert.deepEqual(
    grammarQuestions.map((question) => Number(question.number)).sort((a, b) => a - b),
    Array.from({ length: 38 }, (_, index) => index + 36)
  )
  assert.equal(vocabulary.parts.length, 5)
  assert.equal(grammarReading.parts.length, 7)
  assert.equal(vocabulary.questionCount, 35)
  assert.equal(grammarReading.questionCount, 38)
  for (const [index, part] of vocabulary.parts.entries()) {
    assert.equal(part.title, `Mondai ${index + 1}`)
    assert.equal(part.titleJP, `第${index + 1}問`)
  }
  for (const [index, part] of grammarReading.parts.entries()) {
    assert.equal(part.title, `Mondai ${index + 1}`)
    assert.equal(part.titleJP, `第${index + 1}問`)
  }
  assert.match(vocabulary.parts[2].instruction, /問題 3/u)

  const service = new NhaiKanjiService()
  for (const row of review.rows) {
    const full = allQuestions(fullMock).find((question) => Number(question.number) === row.number)
    const section = vocabularyQuestions.find((question) => Number(question.number) === row.number)
    assert.ok(full, `Missing full-mock question ${row.number}.`)
    assert.ok(section, `Missing standalone question ${row.number}.`)
    assert.equal(Number(full.correctAnswer ?? full.answer), row.answer)
    assert.equal(Number(section.correctAnswer ?? section.answer), row.answer)
    assert.deepEqual(
      full.options.map((option) =>
        expectedOption(typeof option === 'string' ? option.replace(/^\s*[1-4](?:[.)．、]\s*|\s+)/u, '') : option.text)
      ),
      row.options.map(expectedOption)
    )
    assert.deepEqual(
      section.options.map((option) => expectedOption(option.text)),
      row.options.map(expectedOption)
    )

    const explanation = full.explanation || curated[full.id]
    assert.equal(curated[full.id], explanation)
    assert.equal(section.explanation, explanation)
    assert.match(explanation, /Dịch:/u)
    assert.match(explanation, new RegExp(`^Đáp án ${row.answer} —`, 'u'))
    for (let choice = 1; choice <= 4; choice++) {
      assert.match(explanation, new RegExp(`^${choice}\\.`, 'mu'), `Question ${row.number} omits choice ${choice}.`)
    }
    assert.doesNotMatch(explanation, /Chưa khớp được mục từ|từ điển cục bộ|Hán Việt:/u)
  }

  const servedQuestions = [fullMock, vocabulary].flatMap((exam) =>
    allQuestions(service.getJlptExamDetail(exam.id)).filter(
      (question) => Number(question.number) >= 15 && Number(question.number) <= 25
    )
  )
  assert.equal(servedQuestions.length, 22)
  assert.ok(servedQuestions.every((question) => question.explanation?.includes('Dịch:')))
  const question12 = vocabularyQuestions.find((question) => Number(question.number) === 12)
  assert.match(question12.explanation, /「替け」/u)
  assert.doesNotMatch(question12.explanation, /「替え」/u)
  const question33 = vocabularyQuestions.find((question) => Number(question.number) === 33)
  const question34 = vocabularyQuestions.find((question) => Number(question.number) === 34)
  const question27 = vocabularyQuestions.find((question) => Number(question.number) === 27)
  assert.match(question27.question, /ふれないで<\/u>ください/u)
  assert.match(question27.sentence, /ふれないで<\/u>ください/u)
  assert.doesNotMatch(`${question27.question} ${question27.sentence}`, /くだきい/u)
  assert.match(question33.options[3].text, /しましょう/u)
  assert.doesNotMatch(question33.options[3].text, /しましよう/u)
  assert.match(question34.options[2].text, /参考にしてください/u)
  assert.doesNotMatch(question34.options[2].text, /くだきい/u)
  assert.match(question33.explanation, /前の人を追い抜く/u)
  assert.match(question34.explanation, /申込書の書き方の見本/u)
  for (const question of [question33, question34]) {
    assert.match(question.explanation, /Dịch:/u)
    for (let choice = 1; choice <= 4; choice++) {
      assert.match(question.explanation, new RegExp(`^${choice}\\.`, 'mu'))
    }
  }
  assert.equal(review.sourceCorrections[2].result, 'pdf-source-misprint-retained-natural-app-text')
  const question30 = vocabularyQuestions.find((question) => Number(question.number) === 30)
  assert.match(question30.options[0].text, /少し分かった/u)
  assert.match(question30.explanation, /PDF in 「少しかった」/u)
  const servedGrammar = allQuestions(service.getJlptExamDetail(grammarReading.id))
  assert.equal(servedGrammar.length, 38)
  assert.ok(servedGrammar.every((question) => Number(question.number) >= 36))
})
