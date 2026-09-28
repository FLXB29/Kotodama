import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import test from 'node:test'

const root = path.resolve('.')
const exams = JSON.parse(fs.readFileSync(path.join(root, 'data/jlpt_n3_toan_master.json'), 'utf8'))
const sectionExams = JSON.parse(fs.readFileSync(path.join(root, 'data/jlpt_full_master.json'), 'utf8'))
const curated = JSON.parse(fs.readFileSync(path.join(root, 'data/jlpt_n3_explanations_curated.json'), 'utf8'))
const review = JSON.parse(
  fs.readFileSync(path.join(root, 'reports/n3-quality-audit/vocabulary-gloss-2022-12-review.json'), 'utf8')
)

test('December 2022 vocabulary explanations use context-correct glosses in both exam copies', () => {
  const exam = exams.find((item) => item.id === 'toan-n3-202212-full')
  const sectionExam = sectionExams.find((item) => item.id === 'cm2u2xxmo019t134izzsjxgrl-vocab')
  assert.ok(exam, 'Missing December 2022 full exam')
  assert.ok(sectionExam, 'Missing December 2022 vocabulary-only exam')
  assert.equal(review.rows.length, 35)
  assert.deepEqual(
    review.rows.map((row) => row.questionNumber),
    Array.from({ length: 35 }, (_, index) => index + 1)
  )
  assert.match(review.answerKeySource.qualification, /not an official source/u)
  assert.match(review.questionPaperReference.qualification, /differs from the current dataset/u)
  assert.match(review.questionPaperReference.sourceNotes.q13, /variant remains unresolved/u)
  assert.match(review.questionPaperReference.sourceNotes.q30, /remains unresolved/u)
  assert.match(review.questionPaperReference.sourceNotes.toan_q_2022_12_35, /thêm ので/u)

  for (const row of review.rows) {
    const fullQuestion = exam.parts.flatMap((part) => part.questions || []).find((item) => item.id === row.questionId)
    const sectionQuestion = sectionExam.parts
      .flatMap((part) => part.questions || [])
      .find((item) => item.id === row.copies[1].questionId)
    assert.ok(fullQuestion, `Missing full-exam copy for ${row.questionId}`)
    assert.ok(sectionQuestion, `Missing section copy for ${row.questionId}`)
    assert.equal(Number(fullQuestion.answer), row.answer)
    assert.equal(Number(fullQuestion.correctAnswer), row.answer)
    assert.equal(String(sectionQuestion.answer), String(row.answer))
    assert.equal(String(sectionQuestion.correctAnswer), String(row.answer))
    assert.deepEqual(
      fullQuestion.options.map((option) => option.replace(/^\s*[1-4][.．、]?\s*/u, '').trim()),
      row.choices
    )
    assert.deepEqual(
      sectionQuestion.options.map((option) => option.text.trim()),
      row.sectionChoices
    )
    assert.equal(fullQuestion.explanation, curated[row.questionId])
    assert.equal(sectionQuestion.explanation, fullQuestion.explanation)

    for (const choiceNumber of [1, 2, 3, 4]) {
      assert.match(fullQuestion.explanation, new RegExp(`^${choiceNumber}\\. `, 'mu'))
    }
    assert.match(fullQuestion.explanation, /Dịch:/u)
    assert.match(fullQuestion.explanation, /Ghi nhớ:/u)
    assert.doesNotMatch(
      fullQuestion.explanation,
      /một trái tim nhân hậu|nợ ngập đầu|hình vẽ dự kiến|khẩn cấp；cấp bách/u
    )
  }

  const q15 = sectionExam.parts
    .flatMap((part) => part.questions || [])
    .find((question) => question.id === 'cm2u2xy8p01ab134i2vi259fm')
  assert.equal(q15.question, '田中さんは私のめいと結婚したので、私たちは( )になりました。')
  assert.equal(q15.sentence, q15.question)
  assert.doesNotMatch(q15.question, /にまりました/u)
  assert.match(review.rows.find((row) => row.questionNumber === 15).issue, /xác nhận/u)
  assert.match(review.questionPaperReference.sourceNotes.toan_q_2022_12_14, /phương án nhiễu khác/u)
  const q35 = exam.parts.flatMap((part) => part.questions || []).find((question) => question.id === 'toan_q_2022_12_35')
  assert.match(q35.options[2], /重なったので、見に行けない/u)
})
