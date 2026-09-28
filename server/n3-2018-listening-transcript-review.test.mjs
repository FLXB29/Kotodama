import test from 'node:test'
import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = fileURLToPath(new URL('../', import.meta.url))
const master = JSON.parse(fs.readFileSync(path.join(root, 'data/jlpt_n3_toan_master.json'), 'utf8'))
const curated = JSON.parse(fs.readFileSync(path.join(root, 'data/jlpt_n3_explanations_curated.json'), 'utf8'))
const report = JSON.parse(
  fs.readFileSync(path.join(root, 'reports/n3-quality-audit/listening-2018-transcript-review.json'), 'utf8')
)
const reviewedById = new Map(report.questions.map((question) => [question.questionId, question]))
const exams = master.filter((exam) => ['toan-n3-201807-full', 'toan-n3-201812-full'].includes(exam.id))
const questions = exams.flatMap((exam) =>
  exam.parts.filter((part) => part.title.startsWith('Nghe')).flatMap((part) => part.questions)
)
const questionsById = new Map(questions.map((question) => [question.id, question]))

test('2018 listening review covers both exams and transcript answer markers', () => {
  assert.equal(exams.length, 2)
  assert.equal(questions.length, 56)
  assert.equal(report.totals.questionsReviewed, 56)
  assert.equal(report.totals.explanationsAdded, 56)
  assert.equal(report.totals.keysChanged, 0)
  assert.equal(report.totals.keysMatchedTranscriptMarkers, 56)
  assert.equal(report.totals.keysComparedWithOfficialAnswerKey, 0)
  assert.equal(report.totals.optionsRecoveredFromTranscript, 32)
  assert.equal(report.totals.unresolvedVisualMappings, 2)
})

test('each transcript answer marker, stored key, and explanation agrees', () => {
  for (const row of report.questions) {
    const question = questionsById.get(row.questionId)
    assert.ok(question, row.questionId)
    const markers = [...question.script.matchAll(/正解\s*[：:]\s*([1-4])/g)].map((match) => Number(match[1]))
    assert.ok(markers.length > 0, row.questionId)
    assert.ok(
      markers.every((answer) => answer === row.answer),
      row.questionId
    )
    assert.equal(question.correctAnswer, row.answer, row.questionId)
    assert.equal(question.answer, row.answer, row.questionId)
    assert.equal(curated[row.questionId], row.explanation, row.questionId)
    assert.ok(row.explanation.length > 160, row.questionId)
  }
})

test('Mondai 4–5 options are normalized and recovered exactly from transcript lines', () => {
  assert.equal(report.restoredOptionQuestions.length, 32)
  for (const id of report.restoredOptionQuestions) {
    const question = questionsById.get(id)
    const extracted = [...question.script.matchAll(/^\s*([1-4])\.\s*(.+?)\s*$/gm)]
    assert.equal(extracted.length, question.options.length, id)
    assert.deepEqual(
      question.options,
      extracted.map((match) => match[2].replace(/\s*[（(]正解\s*[：:]\s*[1-4][）)]\s*$/, '').trim()),
      id
    )
    assert.equal(
      question.options.some((option) => /^[⓵①②③④➀➁➂➃]$/.test(option)),
      false,
      id
    )
  }
})

test('the two December 2018 questions with missing visual choice maps stay flagged', () => {
  const unresolved = report.questions.filter((question) => question.status === 'needs-visual-mapping')
  assert.deepEqual(unresolved.map((question) => question.questionId).sort(), ['toan_q_2018_12_77', 'toan_q_2018_12_79'])
  assert.equal(reviewedById.get('toan_q_2018_07_75').status, 'transcript-key-and-explanation-reviewed')
})
