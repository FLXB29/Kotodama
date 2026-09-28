import test from 'node:test'
import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = fileURLToPath(new URL('../', import.meta.url))
const master = JSON.parse(fs.readFileSync(path.join(root, 'data/jlpt_n3_toan_master.json'), 'utf8'))
const curated = JSON.parse(fs.readFileSync(path.join(root, 'data/jlpt_n3_explanations_curated.json'), 'utf8'))
const report = JSON.parse(
  fs.readFileSync(path.join(root, 'reports/n3-quality-audit/listening-2020-transcript-review.json'), 'utf8')
)
const exam = master.find((item) => item.id === 'toan-n3-202012-full')
const questions = exam.parts.filter((part) => part.title.startsWith('Nghe')).flatMap((part) => part.questions)
const questionsById = new Map(questions.map((question) => [question.id, question]))

test('December 2020 review covers all 28 listening questions and records evidence limits', () => {
  assert.equal(questions.length, 28)
  assert.equal(report.totals.questionsReviewed, 28)
  assert.equal(report.totals.explanationsAdded, 28)
  assert.equal(report.totals.keysChanged, 0)
  assert.equal(report.totals.keysMatchedTranscriptMarkers, 28)
  assert.equal(report.totals.keysComparedWithOfficialAnswerKey, 0)
  assert.equal(report.totals.optionsRecoveredFromTranscript, 16)
  assert.equal(report.totals.unresolvedVisualMappings, 2)
  assert.equal(report.totals.sourceTextCorrections, 1)
})

test('transcript keys, stored answers, and explanations agree for every reviewed question', () => {
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

test('spoken choice text is restored and a mixed-script choice typo is corrected', () => {
  assert.equal(report.restoredOptionQuestions.length, 16)
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
  assert.equal(questionsById.get('toan_q_2020_12_77').options[1], '資料をコピーする')
})

test('image-only souvenir and exercise questions stay flagged', () => {
  assert.deepEqual(
    report.questions
      .filter((row) => row.status === 'needs-visual-mapping')
      .map((row) => row.questionId)
      .sort(),
    ['toan_q_2020_12_76', 'toan_q_2020_12_79']
  )
})
