import assert from 'node:assert/strict'
import fs from 'node:fs'
import test from 'node:test'
import { NhaiKanjiService } from './nhaikanji-service.mjs'

const readJson = (file) => JSON.parse(fs.readFileSync(file, 'utf8'))
const master = readJson('data/jlpt_n3_toan_master.json')
const report = readJson('reports/n3-quality-audit/reading-2012-07-q38-q39-review.json')
const exam = master.find((item) => item.id === 'toan-n3-201207-full')
const part = exam.parts.find((item) => item.id === report.correction.partId)

test('July 2012 reading task instruction now names the source party-venue guide', () => {
  assert.equal(report.sourcePdf.renderedPages.join(','), '12,13')
  assert.equal(report.correction.answerKeysChanged, 0)
  assert.equal(report.answerReference.officialKeyEstablished, false)
  assert.match(report.correction.previousInstruction, /リサイクルショップ/u)
  assert.match(report.correction.correctedInstruction, /安見市内のパーティー会場/u)
  assert.equal(part.instruction, report.correction.correctedInstruction)
  assert.equal(part.questions.find((question) => question.id === 'toan_q_2012_07_73').correctAnswer, 1)
  assert.equal(part.questions.find((question) => question.id === 'toan_q_2012_07_74').correctAnswer, 2)
})

test('the exam service serves the corrected instruction without changing questions', () => {
  const served = new NhaiKanjiService().getJlptExamDetail(exam.id)
  const servedPart = served.parts.find((item) => item.id === part.id)
  assert.ok(servedPart)
  assert.equal(servedPart.instruction, report.correction.correctedInstruction)
  assert.deepEqual(
    servedPart.questions
      .filter((question) => [73, 74].includes(Number(question.number)))
      .map((question) => question.correctAnswer),
    [1, 2]
  )
})
