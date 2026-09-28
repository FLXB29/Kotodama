import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import test from 'node:test'

import { NhaiKanjiService } from './nhaikanji-service.mjs'

const report = JSON.parse(
  fs.readFileSync(path.resolve('reports/n3-quality-audit/star-source-2016-12-m2-review.json'), 'utf8')
)
const mocks = JSON.parse(fs.readFileSync(path.resolve('data/jlpt_n3_toan_master.json'), 'utf8'))
const sections = JSON.parse(fs.readFileSync(path.resolve('data/jlpt_full_master.json'), 'utf8'))
const curated = JSON.parse(fs.readFileSync(path.resolve('data/jlpt_n3_explanations_curated.json'), 'utf8'))
const mockExam = mocks.find((exam) => exam.id === 'toan-n3-201612-full')
const sectionExam = sections.find((exam) => exam.id === 'cm2u2wlnt0097134ira8pl9rk-grammar-reading')
const questions = (exam) => exam.parts.flatMap((part) => part.questions || [])
const normalize = (value) =>
  String(value)
    .normalize('NFKC')
    .replace(/[\s、。,.，]/gu, '')

test('12/2016 ★ Mondai 2 has source-checked slots, mirrored explanations, and disclosed uncertainty', () => {
  assert.ok(mockExam)
  assert.ok(sectionExam)
  assert.deepEqual(report.secondaryAnswerKey.answers, [2, 4, 2, 1, 3])
  assert.equal(report.officialKeyEstablished, false)
  assert.deepEqual(report.sourcePdf.printedPagesReviewed, [5, 6])

  const mock = new Map(questions(mockExam).map((question) => [Number(question.number), question]))
  const section = new Map(questions(sectionExam).map((question) => [Number(question.number), question]))
  const apiExam = new NhaiKanjiService().getJlptExamDetail('toan-n3-201612-full')
  const apiQuestions = new Map(questions(apiExam).map((question) => [Number(question.number), question]))

  for (const item of report.questions) {
    const full = mock.get(item.internalQuestionNumber)
    const part = section.get(item.internalQuestionNumber)
    const api = apiQuestions.get(item.internalQuestionNumber)
    assert.ok(full && part && api, `Missing printed question ${item.printedQuestion}.`)
    assert.equal(Number(full.correctAnswer ?? full.answer), item.answer)
    assert.deepEqual(full.starCorrectOrder, item.order)
    assert.equal(full.starPosition, item.starPosition)
    assert.equal(full.starOrderVerified, true)
    assert.equal(full.starPositionVerified, true)
    assert.equal(full.starCorrectOrder[item.starPosition], item.answer)
    assert.equal(full.starVerificationStatus, item.sourceStatus)
    assert.ok(full.starPrompt?.before)
    assert.ok(full.starPrompt?.after)
    assert.ok(full.starVerificationSources.some((source) => source.includes('drive.google.com/file/')))
    assert.ok(full.starVerificationSources.includes(report.secondaryAnswerKey.url))
    assert.equal(api.explanation, full.explanation)

    const optionTexts = full.options.map((option) =>
      String(typeof option === 'object' && option ? option.text : option)
        .replace(/^\s*[1-4][.．、\s　]*/u, '')
        .trim()
    )
    assert.deepEqual(optionTexts, item.options)
    const orderedFragments = item.order.map((optionNumber) => optionTexts[optionNumber - 1]).join('')
    assert.ok(normalize(item.completedSentence).includes(normalize(orderedFragments)))
    assert.equal(part.explanation, full.explanation)
    assert.equal(curated[part.id], full.explanation)
    assert.equal(item.explanationCoverage.allFourChoicesAddressed, true)
    for (const optionNumber of [1, 2, 3, 4]) {
      assert.match(full.explanation, new RegExp(`^${optionNumber}\\.`, 'mu'))
    }
    assert.match(full.explanation, /Dịch:/u)
    assert.ok(item.completedSentence)
    assert.ok(item.vietnameseTranslation)
  }

  const q14 = report.questions.find((question) => question.printedQuestion === 14)
  const q15 = report.questions.find((question) => question.printedQuestion === 15)
  const q17 = report.questions.find((question) => question.printedQuestion === 17)
  const q18 = report.questions.find((question) => question.printedQuestion === 18)
  assert.equal(q14.starPosition, 1, 'printed question 14 has its star in the second blank')
  assert.equal(q15.starPosition, 2, 'printed question 15 has its star in the third blank')
  assert.equal(q18.starPosition, 2, 'printed question 18 has its star in the third blank')
  assert.equal(q17.sourceStatus, 'source-conflict-disclosed-editorial-reconstruction')
  assert.equal(q17.sourceConflict.promptEndingAsRead, '待てって')
  assert.equal(q17.sourceConflict.option2AsPrinted, 'と言われた')
  assert.equal(q17.sourceConflict.appOption2, '言われた')
  assert.equal(q17.sourceConflict.alternatePdfOption2, '言われた')
  assert.match(q17.sourceConflict.alternatePdfUrl, /De-N3-12-2016\.pdf$/u)
  assert.equal(q17.sourceConflict.disclosurePresent, true)
  assert.match(mock.get(52).explanation, /Một bản PDF công khai khác.*「言われた」/u)
  assert.match(mock.get(52).explanation, /khóa JLPT chính thức chưa được xác nhận/u)
  assert.match(report.browserVerification.result, /no answers selected, progress remained 0\/39/u)
})
