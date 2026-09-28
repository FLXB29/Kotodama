import test from 'node:test'
import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { NhaiKanjiService } from './nhaikanji-service.mjs'

const root = fileURLToPath(new URL('../', import.meta.url))
const master = JSON.parse(fs.readFileSync(path.join(root, 'data/jlpt_n3_toan_master.json'), 'utf8'))
const curated = JSON.parse(fs.readFileSync(path.join(root, 'data/jlpt_n3_explanations_curated.json'), 'utf8'))
const report = JSON.parse(
  fs.readFileSync(path.join(root, 'reports/n3-quality-audit/listening-2019-transcript-review.json'), 'utf8')
)
const exams = master.filter((exam) => ['toan-n3-201907-full', 'toan-n3-201912-full'].includes(exam.id))
const questions = exams.flatMap((exam) =>
  exam.parts.filter((part) => part.title.startsWith('Nghe')).flatMap((part) => part.questions)
)
const questionsById = new Map(questions.map((question) => [question.id, question]))

test('2019 review covers 56 listening questions in two exams and records its evidence limits', () => {
  assert.equal(exams.length, 2)
  assert.equal(questions.length, 56)
  assert.equal(report.totals.questionsReviewed, 56)
  assert.equal(report.totals.explanationsAdded, 56)
  assert.equal(report.totals.keysChanged, 0)
  assert.equal(report.totals.keysMatchedTranscriptMarkers, 56)
  assert.equal(report.totals.keysComparedWithOfficialAnswerKey, 0)
  assert.equal(report.totals.optionsRecoveredFromTranscript, 32)
  assert.equal(report.totals.visuallyVerifiedImageQuestions, 3)
  assert.equal(report.totals.unresolvedVisualMappings, 0)
})

test('each transcript answer marker, saved key, and Vietnamese explanation agrees', () => {
  for (const row of report.questions) {
    const question = questionsById.get(row.questionId)
    assert.ok(question, row.questionId)
    const markers = [...question.script.matchAll(/正解\s*[：:]\s*([1-4])/g)].map((match) => Number(match[1]))
    assert.ok(markers.length > 0, row.questionId)
    assert.equal(row.transcriptKeyConflict, false, row.questionId)
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

test('Mondai 4–5 option text is recovered exactly from the attached transcripts', () => {
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

test('December 2019 image choices are visually mapped to the transcript answers', () => {
  const question75 = report.questions.find((row) => row.questionId === 'toan_q_2019_12_75')
  const question77 = report.questions.find((row) => row.questionId === 'toan_q_2019_12_77')
  const question80 = report.questions.find((row) => row.questionId === 'toan_q_2019_12_80')
  assert.equal(question75.answer, 2)
  assert.equal(question75.sourcePdfPage, 15)
  assert.equal(question75.status, 'visual-source-verified')
  assert.match(question75.explanation, /Hình 2 đúng.*hình 1.*hình 3.*hình 4/u)
  assert.equal(question77.answer, 1)
  assert.equal(question77.sourcePdfPage, 15)
  assert.equal(question77.status, 'visual-source-verified')
  assert.match(question77.explanation, /Hình 1 ghép đúng.*hình 2.*hình 3.*hình 4/u)
  assert.equal(question80.answer, 3)
  assert.equal(question80.sourcePdfPage, 16)
  assert.equal(question80.transcriptKeyConflict, false)
  assert.equal(question80.status, 'visual-source-verified')
  assert.match(question80.answerEvidence, /ngày 1\/4 là thứ Ba.*ngày 2\/4 là thứ Tư/u)
  assert.match(question80.explanation, /ngày 16\/4.*các ngày thứ Tư là 2, 9 và 16/u)
  assert.match(question80.explanation, /Mũi tên 3 chỉ ngày 16/u)
  assert.equal(report.visualSourceMappings.toan_q_2019_12_80.answer, 3)
})

test('December 2019 standalone listening serves the reviewed explanations and missing image choices', () => {
  const service = new NhaiKanjiService()
  const standalone = service.getJlptExamDetail('cm2u2xbu400ta134iaz003jdg-listening')
  const standaloneQuestions = standalone.parts.flatMap((part) => part.questions || [])
  const fullMockQuestions = new Map(
    exams
      .find((exam) => exam.id === 'toan-n3-201912-full')
      .parts.flatMap((part) => part.questions || [])
      .map((question) => [Number(question.number), question])
  )

  assert.equal(standalone.year, '2019')
  assert.equal(String(standalone.session).padStart(2, '0'), '12')
  assert.equal(standaloneQuestions.length, 28)
  for (const question of standaloneQuestions) {
    const sourceQuestion = fullMockQuestions.get(Number(question.number) + 74)
    assert.ok(sourceQuestion, `Missing full mock source for listening question ${question.number}`)
    assert.equal(
      Number(question.correctAnswer ?? question.answer),
      Number(sourceQuestion.correctAnswer ?? sourceQuestion.answer)
    )
    assert.equal(
      question.explanation,
      curated[sourceQuestion.id],
      `Question ${question.number} must serve its reviewed explanation.`
    )
    assert.ok(
      !question.explanation.includes('Nguồn đề chưa có phần giải thích chi tiết'),
      `Question ${question.number} must not show the missing-explanation placeholder.`
    )
  }

  assert.equal(standaloneQuestions[0].image, 'https://i.ibb.co/WvQgrh8T/Chat-GPT-Image-Jun-2-2026-11-56-56-PM.png')
  assert.equal(standaloneQuestions[2].image, 'https://i.ibb.co/Y7ynybq7/Chat-GPT-Image-May-31-2026-12-42-06-AM.png')
  assert.equal(standaloneQuestions[5].image, '/assets/jlpt/listening/n3-2019-12/m1-q6.png')
})
