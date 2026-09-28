import test from 'node:test'
import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = fileURLToPath(new URL('../', import.meta.url))
const master = JSON.parse(fs.readFileSync(path.join(root, 'data/jlpt_n3_toan_master.json'), 'utf8'))
const curated = JSON.parse(fs.readFileSync(path.join(root, 'data/jlpt_n3_explanations_curated.json'), 'utf8'))
const report = JSON.parse(
  fs.readFileSync(path.join(root, 'reports/n3-quality-audit/listening-2022-transcript-review.json'), 'utf8')
)
const exams = master.filter((exam) => ['toan-n3-202207-full', 'toan-n3-202212-full'].includes(exam.id))
const questions = exams.flatMap((exam) =>
  exam.parts.filter((part) => part.title.startsWith('Nghe')).flatMap((part) => part.questions)
)
const questionsById = new Map(questions.map((question) => [question.id, question]))

test('2022 review covers both listening exams and records source verification limits', () => {
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

test('transcript answer markers, saved keys, and explanations agree for all questions', () => {
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
    assert.match(row.explanation, /^Đáp án (?:đang lưu là )?[1-4] —/u)
    assert.ok(row.explanation.length > 160, row.questionId)
  }
})

test('Mondai 4–5 option text is recovered exactly from attached transcripts', () => {
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
  }
})

test('diagram mappings remain unresolved for the two letter-coded questions', () => {
  assert.deepEqual(
    report.questions
      .filter((row) => row.status === 'needs-visual-mapping')
      .map((row) => row.questionId)
      .sort(),
    ['toan_q_2022_07_77', 'toan_q_2022_12_76']
  )
})
