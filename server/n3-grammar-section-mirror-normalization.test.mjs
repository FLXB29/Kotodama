import assert from 'node:assert/strict'
import fs from 'node:fs'
import test from 'node:test'
import { NhaiKanjiService } from './nhaikanji-service.mjs'

const standalone = JSON.parse(fs.readFileSync('data/jlpt_full_master.json', 'utf8'))
const full = JSON.parse(fs.readFileSync('data/jlpt_n3_toan_master.json', 'utf8'))
const report = JSON.parse(
  fs.readFileSync('reports/n3-quality-audit/grammar-section-mirror-normalization-review.json', 'utf8')
)

const question = (exam, number) =>
  exam.parts.flatMap((part) => part.questions || []).find((item) => Number(item.number) === number)

test('standalone grammar transcription fixes align with matching full-exam text and serve reviewed explanations', () => {
  assert.equal(report.corrections.length, 5)
  const service = new NhaiKanjiService()
  for (const correction of report.corrections) {
    const sectionExam = standalone.find((exam) => exam.id === correction.examId)
    const fullExam = full.find((exam) => exam.id === correction.sourceExamId)
    const sectionQuestion = question(sectionExam, correction.questionNumber)
    const fullQuestion = question(fullExam, correction.questionNumber)
    assert.ok(sectionQuestion && fullQuestion)
    assert.equal(
      Number(sectionQuestion.correctAnswer ?? sectionQuestion.answer),
      Number(fullQuestion.correctAnswer ?? fullQuestion.answer)
    )
    if (correction.field === 'question') {
      assert.ok(sectionQuestion.question.includes(correction.to))
      assert.ok(sectionQuestion.sentence.includes(correction.to))
    } else if (correction.field === 'passage') {
      const sectionPart = sectionExam.parts.find((part) => part.questions?.includes(sectionQuestion))
      assert.ok(sectionPart.passage.includes(correction.to))
    } else {
      const text = sectionQuestion.options[0].text || sectionQuestion.options[0]
      assert.ok(text.includes(correction.to))
    }
    const served = service.getJlptExamDetail(correction.examId)
    const servedQuestion = question(served, correction.questionNumber)
    assert.ok(
      servedQuestion.explanation,
      `missing explanation for ${correction.examId} question ${correction.questionNumber}`
    )
    assert.match(servedQuestion.explanation, /Dịch(?: câu|:)/u)
  }
})
