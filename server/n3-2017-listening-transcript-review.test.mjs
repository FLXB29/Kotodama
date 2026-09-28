import test from 'node:test'
import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = fileURLToPath(new URL('../', import.meta.url))
const master = JSON.parse(fs.readFileSync(path.join(root, 'data/jlpt_n3_toan_master.json'), 'utf8'))
const curated = JSON.parse(fs.readFileSync(path.join(root, 'data/jlpt_n3_explanations_curated.json'), 'utf8'))
const report = JSON.parse(
  fs.readFileSync(path.join(root, 'reports/n3-quality-audit/listening-2017-transcript-review.json'), 'utf8')
)
const reviewedById = new Map(report.questions.map((question) => [question.questionId, question]))
const exams = master.filter((exam) => ['toan-n3-201707-full', 'toan-n3-201712-full'].includes(exam.id))
const questions = exams.flatMap((exam) =>
  exam.parts.filter((part) => part.title.startsWith('Nghe')).flatMap((part) => part.questions)
)
const questionsById = new Map(questions.map((question) => [question.id, question]))

test('2017 listening transcript review covers both exams and identifies verification limits', () => {
  assert.equal(exams.length, 2)
  assert.equal(questions.length, 56)
  assert.equal(report.totals.questionsReviewed, 56)
  assert.equal(report.totals.explanationsAdded, 56)
  assert.equal(report.totals.keysChanged, 0)
  assert.equal(report.totals.keysComparedWithIndependentAnswerKey, 0)
  assert.equal(report.totals.optionsRecoveredFromTranscript, 32)
  assert.equal(report.totals.unresolvedVisualMappings, 3)
  assert.equal(report.limitations.length, 2)
})

test('reviewed answers and explanations remain synchronized with the questions', () => {
  for (const row of report.questions) {
    const question = questionsById.get(row.questionId)
    assert.ok(question, row.questionId)
    assert.equal(question.correctAnswer, row.answer, row.questionId)
    assert.equal(question.answer, row.answer, row.questionId)
    assert.equal(curated[row.questionId], row.explanation, row.questionId)
    assert.ok(row.explanation.length > 160, row.questionId)
    assert.equal(row.answerEvidence.includes('không có khóa PDF'), true, row.questionId)
  }
})

test('Mondai 4–5 option text was recovered exactly from its attached transcript', () => {
  assert.equal(report.restoredOptionQuestions.length, 32)
  for (const id of report.restoredOptionQuestions) {
    const question = questionsById.get(id)
    const extracted = [...question.script.matchAll(/^\s*([1-4])\.\s*(.+?)\s*$/gm)]
    assert.equal(extracted.length, question.options.length, id)
    assert.deepEqual(
      question.options,
      extracted.map((match) => match[2].trim()),
      id
    )
    assert.equal(
      question.options.some((option) => /^[⓵①②③④➀➁➂➃]$/.test(option)),
      false,
      id
    )
  }
})

test('the three questions with picture-only answer markers remain explicitly unresolved', () => {
  const unresolved = report.questions.filter((question) => question.status === 'needs-visual-mapping')
  assert.deepEqual(unresolved.map((question) => question.questionId).sort(), [
    'toan_q_2017_07_76',
    'toan_q_2017_12_75',
    'toan_q_2017_12_78',
  ])
  for (const row of unresolved) {
    assert.match(row.explanation, /không có ảnh|không có hình|chỉ là bốn ký hiệu hình/)
  }
  assert.match(reviewedById.get('toan_q_2017_07_77').explanation, /1 là kế hoạch cũ; 3 đã làm xong/)
})
