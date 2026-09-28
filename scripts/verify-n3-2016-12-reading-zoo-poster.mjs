import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'

const exams = JSON.parse(fs.readFileSync(path.resolve('data/jlpt_n3_toan_master.json'), 'utf8'))
const curated = JSON.parse(fs.readFileSync(path.resolve('data/jlpt_n3_explanations_curated.json'), 'utf8'))
const report = JSON.parse(
  fs.readFileSync(path.resolve('reports/n3-quality-audit/reading-source-2016-12-zoo-poster-review.json'), 'utf8')
)
const exam = exams.find((item) => item.id === 'toan-n3-201612-full')
assert.ok(exam)
const part = exam.parts.find((item) => item.title === 'Đọc hiểu - Mondai 4')
assert.ok(part?.passage)
assert.equal(part.sourceTextExtracted, true)
assert.equal(part.passageSource.file, '7. N3 12-2016.pdf')
assert.equal(part.passageSource.printedPage, 13)
assert.match(part.instruction, /動物園のイベント/u)

const text = part.passage.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ')
for (const required of [
  '大原動物園をもっと楽しむために',
  '毎日3回：①10時半～ ②14時半～ ③16時～',
  '毎週日曜 13時半～15時',
  '途中からでも参加できます',
  '毎週土曜 14時半',
  '毎週日曜 11時～12時',
  '申し込む、参加料金 全て不要',
  'B：資料館1階受付（途中参加の人も）',
  '日時：8月2日、9日、16日、23日、30日',
  '各日 17時半～21時（入園は19時半まで）',
  '17時の閉園に一度園の外に出て',
  'もう一度入園料を支払って',
  '東口は17時で閉めます',
]) {
  assert.ok(text.includes(required), `Poster text is missing: ${required}`)
}

const expected = [
  {
    id: 'toan_q_2016_12_73',
    answer: 2,
    readingSourcePassage: true,
    explanation: /AとB|A và B/u,
    details: ['14:30', '13:30', 'Saturday-only', 'noon Sunday'],
  },
  {
    id: 'toan_q_2016_12_74',
    answer: 2,
    readingSourcePassage: false,
    explanation: /trả vé.*lần nữa/u,
    details: ['17:00', '17:30', 'pay admission again', 'front entrance'],
  },
]
for (const expectedQuestion of expected) {
  const question = part.questions.find((item) => item.id === expectedQuestion.id)
  assert.ok(question)
  assert.equal(Number(question.correctAnswer ?? question.answer), expectedQuestion.answer)
  assert.equal(question.sourceTextExtracted, true)
  assert.equal(question.readingSourcePassage ?? false, expectedQuestion.readingSourcePassage)
  assert.equal(question.passage, null, 'Shared poster should render once at the part level.')
  assert.match(curated[question.id], expectedQuestion.explanation)
  const reportQuestion = report.questions.find((item) => item.id === question.id)
  assert.ok(reportQuestion)
  assert.equal(reportQuestion.answer, expectedQuestion.answer)
  for (const detail of expectedQuestion.details) {
    assert.ok(reportQuestion.reasoning.includes(detail), `Review record is missing: ${detail}`)
  }
}
assert.equal(report.sourcePdf.printedPage, 13)
assert.equal(report.sourcePdf.officialAnswerKeyPresent, false)
assert.match(report.limitation, /no answer key/u)

console.log(
  'Verified poster transcription, shared part-level rendering, source provenance, both answer rationales, and official-key limitation for December 2016 reading questions 38–39.'
)
