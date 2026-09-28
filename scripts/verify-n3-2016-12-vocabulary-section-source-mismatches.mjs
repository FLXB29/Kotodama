import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import { NhaiKanjiService } from '../server/nhaikanji-service.mjs'

const master = JSON.parse(fs.readFileSync(path.resolve('data/jlpt_full_master.json'), 'utf8'))
const report = JSON.parse(
  fs.readFileSync(path.resolve('reports/n3-quality-audit/vocabulary-section-source-2016-12-review.json'), 'utf8')
)
const section = master.find((exam) => exam.id === 'cm2u2wlnt0097134ira8pl9rk-vocab')
assert.ok(section)
const expected = {
  11: { answer: '3', options: ['満続', '万続', '満足', '万足'] },
  16: {
    answer: '4',
    prompt: '佐藤さんには、おとなしい( )があるが、本当は活動的な人らしい。',
    options: ['ヒント', 'タイトル', 'アイディア', 'イメージ'],
  },
  21: { answer: '2', options: ['様子', '姿勢', '印象', '間隔'] },
  30: {
    answer: '2',
    prompt: 'ここは<u>横断禁止</u>です。',
    options: ['座ってはいけません', '渡ってはいけません', '走ってはいけません', '入ってはいけません'],
  },
}
for (const [number, expectedQuestion] of Object.entries(expected)) {
  const question = section.parts.flatMap((part) => part.questions || []).find((item) => item.number === Number(number))
  assert.ok(question)
  assert.equal(String(question.correctAnswer ?? question.answer), expectedQuestion.answer)
  assert.deepEqual(
    question.options.map((option) => option.text),
    expectedQuestion.options
  )
  if (expectedQuestion.prompt) assert.equal(question.question, expectedQuestion.prompt)
}

const service = new NhaiKanjiService()
const deliveredSection = service.getJlptExamDetail(section.id)
assert.ok(deliveredSection)
for (const [number, expectedQuestion] of Object.entries(expected)) {
  const question = deliveredSection.parts
    .flatMap((part) => part.questions || [])
    .find((item) => item.number === Number(number))
  assert.ok(question)
  assert.equal(String(question.correctAnswer ?? question.answer), expectedQuestion.answer)
  assert.ok(question.explanation, `The application did not attach an explanation for question ${number}.`)
}
assert.match(
  deliveredSection.parts.flatMap((part) => part.questions || []).find((item) => item.number === 11).explanation,
  /「満足」.*hài lòng/su
)
assert.match(
  deliveredSection.parts.flatMap((part) => part.questions || []).find((item) => item.number === 16).explanation,
  /タイトル/u
)
assert.match(
  deliveredSection.parts.flatMap((part) => part.questions || []).find((item) => item.number === 21).explanation,
  /間隔/u
)
assert.match(
  deliveredSection.parts.flatMap((part) => part.questions || []).find((item) => item.number === 30).explanation,
  /渡ってはいけません/u
)
assert.equal(report.sourcePdf.observed, true)
assert.deepEqual(
  report.corrections.map((correction) => correction.questionNumber),
  [11, 16, 21, 30]
)
assert.match(report.limitation, /no official answer key/u)

console.log(
  'Verified PDF-aligned section prompt/options/keys and confirmed the application service now delivers explanations for December 2016 vocabulary questions 11, 16, 21 and 30.'
)
