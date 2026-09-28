import assert from 'node:assert/strict'
import fs from 'node:fs'
import test from 'node:test'
import { NhaiKanjiService } from './nhaikanji-service.mjs'

const readJson = (file) => JSON.parse(fs.readFileSync(file, 'utf8'))
const allQuestions = (exam) => exam.parts.flatMap((part) => part.questions || [])
const normalizedOption = (option) =>
  (typeof option === 'string' ? option.replace(/^\s*[1-4](?:[.)．、]\s*|\s+)/u, '') : String(option?.text || ''))
    .normalize('NFKC')
    .replace(/\s+/gu, '')

test('December 2021 star questions 14–18 match the source PDF and receive complete explanations in both exam views', () => {
  const fullMaster = readJson('data/jlpt_n3_toan_master.json')
  const standaloneMaster = readJson('data/jlpt_full_master.json')
  const curated = readJson('data/jlpt_n3_explanations_curated.json')
  const review = readJson('reports/n3-quality-audit/star-review-2021-12.json')
  const fullMock = fullMaster.find((exam) => exam.id === 'toan-n3-202112-full')
  const standalone = standaloneMaster.find((exam) => exam.id === 'cm2u2xosv0138134ib0bvpy32-grammar-reading')
  assert.ok(fullMock)
  assert.ok(standalone)

  const expectations = [
    {
      number: 49,
      answer: 3,
      order: [1, 4, 3, 2],
      sentence: 'この小学生は大人でも解けないような問題を簡単に解いてしまう。',
    },
    { number: 50, answer: 1, order: [3, 4, 1, 2], sentence: '旅行していた２週間は楽しいことばかりだった。' },
    { number: 51, answer: 3, order: [4, 1, 3, 2], sentence: '思っていたほど込んでいませんでしたよ。' },
    {
      number: 52,
      answer: 4,
      order: [2, 3, 4, 1],
      sentence: 'しながら食事の準備や洗濯をしてくれていたことがどれだけ大変なことだったか',
    },
    { number: 53, answer: 3, order: [4, 1, 3, 2], sentence: 'あしたになって熱が下がっていたらいいですよ' },
  ]
  assert.deepEqual(
    review.sourceReview.userProvidedAnswers,
    expectations.map((row) => row.answer)
  )
  assert.equal(review.sourceReview.questionPaperPdfPage, 9)
  assert.equal(review.sourceReview.answerSheetPdfPage, 23)
  assert.equal(review.sourceReview.officialAnswerKeyConfirmed, false)
  assert.deepEqual(review.sourceReview.transcriptionReview.correctedOcrText, ['人って', 'んでしよう'])
  assert.deepEqual(review.sourceReview.transcriptionReview.sourceText, ['入って', 'んでしょう'])
  assert.equal(review.sourceReview.transcriptionReview.sourcePrintedPhrasePreserved, 'いいでよ')
  assert.equal(review.rows.length, expectations.length)

  for (const expected of expectations) {
    const full = allQuestions(fullMock).find((question) => Number(question.number) === expected.number)
    const section = allQuestions(standalone).find((question) => Number(question.number) === expected.number)
    assert.ok(full, `Missing full-mock question ${expected.number}.`)
    assert.ok(section, `Missing standalone question ${expected.number}.`)
    const explanation = full.explanation || curated[full.id]
    assert.equal(Number(full.correctAnswer ?? full.answer), expected.answer)
    assert.equal(Number(section.correctAnswer ?? section.answer), expected.answer)
    assert.deepEqual(full.starCorrectOrder, expected.order)
    assert.equal(full.starPosition, 2)
    assert.equal(full.starCorrectOrder[full.starPosition], expected.answer)
    assert.equal(full.starOrderVerified, true)
    assert.equal(full.starPositionVerified, true)
    assert.equal(full.starVerificationStatus, 'verified-against-source')
    assert.equal(full.starVerificationSources.length, 2)
    assert.ok(full.starVerificationNote.includes('zero-based slot 2'))
    assert.ok(explanation.length > 300, `Question ${expected.number} has a short explanation.`)
    assert.equal(curated[full.id], explanation)
    assert.equal(section.explanation, explanation)
    assert.match(explanation, /Dịch/u)
    for (let choice = 1; choice <= 4; choice++) {
      assert.match(
        explanation,
        new RegExp(`^${choice}\\.`, 'mu'),
        `Question ${expected.number} omits option ${choice}.`
      )
    }
    const assembled = expected.order.map((choice) => normalizedOption(full.options[choice - 1])).join('')
    assert.ok(expected.sentence.normalize('NFKC').replace(/\s+/gu, '').includes(assembled))
    assert.deepEqual(section.options.map(normalizedOption), full.options.map(normalizedOption))
    if (expected.number === 53) {
      assert.equal(
        section.question,
        '患者「先生、おふろには入ってもいいんでしょうか。」<br>医者「 ___ ___ _★_ ___ いいでよ」'
      )
      assert.match(explanation, /PDF gốc in 「いいでよ」/u)
      assert.match(explanation, /câu tự nhiên 「いいですよ」/u)
    }
  }

  const service = new NhaiKanjiService()
  for (const exam of [fullMock, standalone]) {
    const servedQuestions = allQuestions(service.getJlptExamDetail(exam.id))
      .filter((question) => Number(question.number) >= 49 && Number(question.number) <= 53)
      .sort((left, right) => Number(left.number) - Number(right.number))
    assert.equal(servedQuestions.length, 5)
    assert.ok(servedQuestions.every((question) => question.explanation?.length > 300))
  }
})
