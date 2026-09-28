import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import test from 'node:test'

const root = path.resolve('.')
const exams = JSON.parse(fs.readFileSync(path.join(root, 'data/jlpt_n3_toan_master.json'), 'utf8'))
const curated = JSON.parse(fs.readFileSync(path.join(root, 'data/jlpt_n3_explanations_curated.json'), 'utf8'))
const review = JSON.parse(
  fs.readFileSync(path.join(root, 'reports/n3-quality-audit/answer-key-2022-12-grammar.json'), 'utf8')
)

test('December 2022 N3 grammar M1 stays synchronized with the user-provided answer reference', () => {
  const exam = exams.find((item) => item.id === review.examId)
  assert.ok(exam, 'Missing December 2022 N3 full exam')

  const part = exam.parts.find((item) => item.id === 'toan_part_2022_12_m2_g1')
  assert.ok(part, 'Missing grammar Mondai 1')
  assert.equal(part.questions.length, 13)

  const reference = review.sources.find((item) => item.name === 'User-provided JLPT N3 answer-key PDF')
  assert.ok(reference, 'Missing provenance for the Google Drive answer-key reference')
  assert.match(reference.url, /#page=25$/u)
  assert.match(reference.qualification, /unknown provenance/u)
  assert.match(reference.qualification, /not an official JLPT key/u)

  const referenceSequence = [2, 1, 3, 4, 1, 4, 2, 3, 1, 4, 2, 2, 3]
  const expectedRows = review.rows
  assert.equal(expectedRows.length, 13)

  for (const [index, question] of part.questions.entries()) {
    const questionNumber = Number(question.number)
    const answerRow = expectedRows.find((row) => row.questionNumber === questionNumber)
    assert.ok(answerRow, `Missing answer audit row for question ${questionNumber}`)
    assert.equal(answerRow.storedAnswer, referenceSequence[index])
    assert.equal(answerRow.reviewedAnswer, referenceSequence[index])
    assert.equal(Number(question.answer), referenceSequence[index], `Stored answer changed for ${question.id}`)
    assert.equal(
      Number(question.correctAnswer),
      referenceSequence[index],
      `Correct-answer field changed for ${question.id}`
    )
    assert.equal(curated[question.id], question.explanation, `Curated explanation drifted for ${question.id}`)

    for (const choiceNumber of [1, 2, 3, 4]) {
      assert.match(
        question.explanation,
        new RegExp(`^${choiceNumber}\\. `, 'mu'),
        `${question.id} lacks explanation for choice ${choiceNumber}`
      )
    }
    assert.match(question.explanation, /Dịch:/u, `${question.id} lacks a translation`)
    assert.match(question.explanation, /Ghi nhớ:/u, `${question.id} lacks a takeaway`)
  }
})
