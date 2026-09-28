import test from 'node:test'
import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = fileURLToPath(new URL('../', import.meta.url))
const master = JSON.parse(fs.readFileSync(path.join(root, 'data/jlpt_n3_toan_master.json'), 'utf8'))
const curated = JSON.parse(fs.readFileSync(path.join(root, 'data/jlpt_n3_explanations_curated.json'), 'utf8'))
const report = JSON.parse(
  fs.readFileSync(path.join(root, 'reports/n3-quality-audit/listening-2023-transcript-review.json'), 'utf8')
)
const exams = master.filter((exam) => ['toan-n3-202307-full', 'toan-n3-202312-full'].includes(exam.id))
const questions = exams.flatMap((exam) =>
  exam.parts.filter((part) => part.title.startsWith('Nghe')).flatMap((part) => part.questions)
)
const questionsById = new Map(questions.map((question) => [question.id, question]))

test('2023 review covers both listening exams and tracks key-verification limits', () => {
  assert.equal(exams.length, 2)
  assert.equal(questions.length, 56)
  assert.equal(report.totals.questionsReviewed, 56)
  assert.equal(report.totals.explanationsAdded, 56)
  assert.equal(report.totals.keysChanged, 0)
  assert.equal(report.totals.keysMatchedTranscriptMarkers, 43)
  assert.equal(report.totals.keysWithoutTranscriptMarkers, 13)
  assert.equal(report.totals.keysComparedWithOfficialAnswerKey, 0)
  assert.equal(report.totals.optionsRecoveredFromTranscript, 32)
  assert.equal(report.totals.optionsTranscribedFromImage, 3)
  assert.equal(report.totals.unresolvedVisualMappings, 1)
})

test('all explanations match the saved answer and explain translation and distractors', () => {
  assert.equal(report.questions.length, 56)
  for (const row of report.questions) {
    const question = questionsById.get(row.questionId)
    assert.ok(question, row.questionId)
    assert.equal(question.correctAnswer, row.answer, row.questionId)
    assert.equal(question.answer, row.answer, row.questionId)
    assert.equal(curated[row.questionId], row.explanation, row.questionId)
    assert.match(row.explanation, /^Đáp án (?:đang lưu là )?[1-4] —/u)
    assert.match(row.explanation, /Dịch câu hỏi:|Dịch tình huống:/u)
    assert.ok(row.explanation.length > 160, row.questionId)
  }
})

test('transcript answer markers match saved keys wherever markers are available', () => {
  for (const row of report.questions.filter((item) => item.transcriptKeyMarkers.length)) {
    const question = questionsById.get(row.questionId)
    const markers = [...question.script.matchAll(/正解\s*[：:]\s*([1-4])/gu)].map((match) => Number(match[1]))
    assert.deepEqual(markers, row.transcriptKeyMarkers, row.questionId)
    assert.ok(
      markers.every((answer) => answer === row.answer),
      row.questionId
    )
    assert.equal(row.answerVerification, 'transcript-marker-matched', row.questionId)
  }
  assert.deepEqual(
    report.questions.filter((row) => !row.transcriptKeyMarkers.length).map((row) => row.number),
    [89, 90, 91, 92, 93, 94, 95, 96, 97, 98, 99, 100, 101]
  )
})

test('transcribed option sets are preserved in the dataset and include two recovered December audio choices', () => {
  assert.equal(report.restoredOptionQuestions.length, 32)
  assert.equal(report.imageOptionQuestions.length, 3)
  for (const row of report.questions.filter((item) => item.recoveredOptions)) {
    assert.deepEqual(questionsById.get(row.questionId).options, row.recoveredOptions, row.questionId)
  }
  assert.deepEqual(questionsById.get('toan_q_2023_07_76').options, [
    'Rửa bồn tắm',
    'Nấu món gà và bắp cải',
    'Mua bắp cải',
    'Kiểm tra máy in',
  ])
  assert.match(questionsById.get('toan_q_2023_12_74').options[2], /áo len và tem/u)
  assert.match(questionsById.get('toan_q_2023_12_77').options[1], /vật đựng ô/u)
  assert.match(questionsById.get('toan_q_2023_12_93').options[0], /病院/u)
  assert.match(questionsById.get('toan_q_2023_12_95').options[2], /ここで食べちゃ/u)
})

test('the July date-to-option mapping remains explicitly unresolved', () => {
  const unresolved = report.questions.filter((row) => row.status === 'needs-visual-choice-mapping')
  assert.deepEqual(
    unresolved.map((row) => row.questionId),
    ['toan_q_2023_07_77']
  )
  assert.deepEqual(questionsById.get('toan_q_2023_07_77').options, ['➀　1', '②　2', '③　3', '④　4'])
})
