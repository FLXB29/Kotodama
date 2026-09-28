import assert from 'node:assert/strict'
import fs from 'node:fs'
import test from 'node:test'
import { NhaiKanjiService } from './nhaikanji-service.mjs'

const readJson = (file) => JSON.parse(fs.readFileSync(file, 'utf8'))
const plainText = (value) =>
  String(value || '')
    .replace(/<[^>]*>/gu, ' ')
    .replace(/\s+/gu, ' ')
    .trim()

test('N3 July 2022 grammar questions 35–47 match the supplied key and have complete, source-checked explanations', () => {
  const master = readJson('data/jlpt_n3_toan_master.json')
  const curated = readJson('data/jlpt_n3_explanations_curated.json')
  const keyReview = readJson('reports/n3-quality-audit/answer-key-2022-07-grammar.json')
  const explanationReview = readJson('reports/n3-quality-audit/grammar-explanation-2022-07-review.json')
  const sourceCorrectionReview = readJson('reports/n3-quality-audit/source-corrections-2022-07-review.json')
  const exam = master.find((entry) => entry.id === 'toan-n3-202207-full')
  assert.ok(exam, 'Missing July 2022 full mock.')

  const questions = exam.parts
    .filter((part) => part.title.includes('Ngữ pháp') && part.title.includes('Mondai 1'))
    .flatMap((part) => part.questions || [])
    .sort((left, right) => Number(left.number) - Number(right.number))
  const expectedAnswers = [3, 2, 4, 1, 2, 2, 3, 3, 4, 1, 4, 1, 3]
  assert.deepEqual(
    questions.map((question) => Number(question.number)),
    Array.from({ length: 13 }, (_, index) => index + 35)
  )
  assert.deepEqual(
    questions.map((question) => Number(question.correctAnswer ?? question.answer)),
    expectedAnswers
  )
  assert.equal(keyReview.sourceReview.answerSheetPdfPage, 24)
  assert.equal(keyReview.sourceReview.storedAnswersMatchUserProvidedSheet, 13)
  assert.equal(keyReview.sourceReview.officialAnswerPdfConfirmed, false)
  assert.equal(explanationReview.sourceReview.questionPaperPages.join(','), '5,6')
  assert.equal(explanationReview.sourceReview.answerSheetPdfPage, 24)
  assert.equal(explanationReview.sourceReview.storedAnswersMatchUserProvidedSheet, 13)
  assert.equal(explanationReview.sourceReview.officialAnswerPdfConfirmed, false)

  for (const question of questions) {
    const explanation = question.explanation || curated[question.id] || ''
    assert.ok(explanation.length > 400, `${question.number}: explanation is too short.`)
    assert.equal(explanation, curated[question.id], `${question.id}: curated explanation differs.`)
    assert.match(explanation, /Dịch:/u, `${question.number}: missing full translation.`)
    assert.match(explanation, /Ghi nhớ:/u, `${question.number}: missing usage summary.`)
    for (let choice = 1; choice <= 4; choice++) {
      assert.match(explanation, new RegExp(`^${choice}\\.`, 'mu'), `${question.number}: missing choice ${choice}.`)
    }
  }

  const q44 = questions.find((question) => Number(question.number) === 44)
  assert.match(plainText(q44.question), /石山「わかりました。では、またあとで/u)
  assert.doesNotMatch(plainText(q44.question), /田中「わかりました。では、またあとで/u)
  assert.match(plainText(q44.sentence), /石山「わかりました。では、またあとで/u)
  assert.doesNotMatch(plainText(q44.sentence), /田中「わかりました。では、またあとで/u)
  assert.equal(explanationReview.sourceReview.sourceCorrection.questionNumber, 44)
  assert.equal(explanationReview.explanationCriteria.questionsReviewed, 13)
  assert.equal(explanationReview.explanationCriteria.allFourChoicesExplained, true)
  assert.equal(explanationReview.explanationCriteria.fullVietnameseTranslation, true)

  const q48 = exam.parts.flatMap((part) => part.questions || []).find((question) => Number(question.number) === 48)
  const q48Explanation = curated[q48.id]
  assert.deepEqual(q48.starCorrectOrder, [3, 2, 4, 1])
  assert.equal(q48.starPosition, 1)
  assert.equal(Number(q48.correctAnswer ?? q48.answer), 2)
  assert.match(q48Explanation, /あの先生ほどわかりやすく教えてくれる先生はいない/u)
  assert.match(q48Explanation, /3 → 2 → 4 → 1/u)
  assert.match(q48Explanation, /dấu ★ nằm ở ô thứ hai nên điền lựa chọn 2/u)
  assert.match(q48Explanation, /lựa chọn 4.*bổ nghĩa cho/iu)
  assert.doesNotMatch(q48Explanation, /ô ★ là lựa chọn 4/u)

  const reviewedStars = exam.parts
    .filter((part) => part.title.includes('Ngữ pháp') && part.title.includes('Mondai 2'))
    .flatMap((part) => part.questions || [])
    .sort((left, right) => Number(left.number) - Number(right.number))
  const starExpectations = [
    { number: 48, answer: 2, position: 1, order: [3, 2, 4, 1] },
    { number: 49, answer: 2, position: 2, order: [3, 1, 2, 4] },
    { number: 50, answer: 3, position: 2, order: [1, 4, 3, 2] },
    { number: 51, answer: 1, position: 2, order: [4, 2, 1, 3] },
    { number: 52, answer: 4, position: 2, order: [2, 1, 4, 3] },
  ]
  assert.equal(reviewedStars.length, starExpectations.length)
  assert.deepEqual(
    reviewedStars.map((question) => ({
      number: Number(question.number),
      answer: Number(question.correctAnswer ?? question.answer),
      position: question.starPosition,
      order: question.starCorrectOrder,
      verified: question.starOrderVerified && question.starPositionVerified,
      status: question.starVerificationStatus,
      hasSource: question.starVerificationSources?.some((source) => source.includes('drive.google.com/file/d/')),
    })),
    starExpectations.map((expected) => ({
      ...expected,
      verified: true,
      status: 'verified-against-source',
      hasSource: true,
    }))
  )
  assert.deepEqual(sourceCorrectionReview.sourceReview.userProvidedStarAnswers, [2, 2, 3, 1, 4])
  assert.equal(sourceCorrectionReview.sourceReview.answerSheetPdfPage, 24)

  const standalone = new NhaiKanjiService().getJlptExamDetail('cm2u2xt6n016j134inupqhmlp-grammar-reading')
  const standaloneQ48 = standalone.parts
    .flatMap((part) => part.questions || [])
    .find((question) => Number(question.number) === 48)
  assert.equal(standaloneQ48.answer, '2')
  assert.equal(standaloneQ48.options[3].text, 'わかりやすく教えてくれる')
  assert.equal(standaloneQ48.explanation, q48Explanation, 'The split exam must receive the corrected ★ answer explanation.')

  const q62 = exam.parts.flatMap((part) => part.questions || []).find((question) => Number(question.number) === 62)
  assert.equal(q62.options[1], '熱い飲み物を入れたら、水筒が壊れてしまったこと')
  assert.equal(q62.options[2], '熱い飲み物が水筒から直接飲めなかったこと')
  const q65 = exam.parts.flatMap((part) => part.questions || []).find((question) => Number(question.number) === 65)
  assert.equal(q65.options[3], 'カラスの鳴き方の違いを利用して、「集まっても問題のない場所」に行かせる実験')
  assert.deepEqual(
    sourceCorrectionReview.corrections.map((correction) => correction.questionNumber),
    [44, 48, 49, 50, 51, 52, 48, 62, 62, 65]
  )

  const served = new NhaiKanjiService().getJlptExamDetail(exam.id)
  const servedQuestions = served.parts
    .flatMap((part) => part.questions || [])
    .filter((question) => Number(question.number) >= 35 && Number(question.number) <= 47)
    .sort((left, right) => Number(left.number) - Number(right.number))
  assert.deepEqual(
    servedQuestions.map((question) => question.explanation),
    questions.map((question) => question.explanation),
    'API detail must serve the reviewed explanations.'
  )
  assert.match(
    plainText(servedQuestions.find((question) => Number(question.number) === 44).question),
    /石山「わかりました/u
  )
  assert.match(
    plainText(servedQuestions.find((question) => Number(question.number) === 44).sentence),
    /石山「わかりました/u
  )
  const servedQ48 = served.parts
    .flatMap((part) => part.questions || [])
    .find((question) => Number(question.number) === 48)
  assert.equal(servedQ48.explanation, q48Explanation)
  assert.deepEqual(
    served.parts.flatMap((part) => part.questions || []).find((question) => Number(question.number) === 62).options,
    q62.options
  )
  assert.deepEqual(
    served.parts.flatMap((part) => part.questions || []).find((question) => Number(question.number) === 65).options,
    q65.options
  )
})
