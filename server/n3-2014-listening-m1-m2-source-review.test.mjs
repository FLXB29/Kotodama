import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import test from 'node:test'
import { fileURLToPath } from 'node:url'

const root = fileURLToPath(new URL('../', import.meta.url))
const readJson = (relativePath) => JSON.parse(fs.readFileSync(path.join(root, relativePath), 'utf8'))
const exams = readJson('data/jlpt_n3_toan_master.json')
const curated = readJson('data/jlpt_n3_explanations_curated.json')
const m1m2Report = readJson('reports/n3-quality-audit/listening-2014-m1-m2-source-review.json')
const m3m5Report = readJson('reports/n3-quality-audit/listening-2014-m3-m5-source-review.json')
const questions = new Map(
  exams.flatMap((exam) => exam.parts.flatMap((part) => part.questions)).map((question) => [question.id, question])
)

test('the 24 reviewed 2014 listening explanations cover the question, translation, answer, and distractors', () => {
  assert.equal(m1m2Report.reviewedCount, 24)
  assert.equal(Object.keys(m1m2Report.reviewed).length, 24)

  for (const [id, evidence] of Object.entries(m1m2Report.reviewed)) {
    const question = questions.get(id)
    const explanation = curated[id]
    assert.ok(question, `missing ${id}`)
    assert.equal(evidence.matchesStoredAnswer, true, id)
    assert.equal(question.answer, evidence.answer, id)
    assert.equal(question.correctAnswer, evidence.answer, id)
    assert.ok(explanation.startsWith(`Đáp án ${evidence.answer}`), id)
    assert.match(explanation, /Dịch câu hỏi:/, id)
    assert.match(explanation, /Ghi nhớ:/, id)
    for (const optionNumber of ['1', '2', '3', '4']) {
      assert.match(
        explanation,
        new RegExp(`(?:^|\\D)${optionNumber}(?:\\D|$)`),
        `${id} should discuss option ${optionNumber}`
      )
    }
  }
})

test('the follow-up covers the remaining 32 questions and records the corrected answer key', () => {
  assert.equal(m3m5Report.reviewedCount, 32)
  assert.equal(Object.keys(m3m5Report.reviewed).length, 32)
  for (const [id, evidence] of Object.entries(m3m5Report.reviewed)) {
    const explanation = curated[id]
    assert.equal(evidence.matchesStoredAnswer, true, id)
    assert.ok(explanation.startsWith(`Đáp án ${evidence.answer}`), id)
    assert.match(explanation, /Dịch /, id)
    assert.match(explanation, /Đáp án|Ghi nhớ/, id)
  }

  const corrected = m3m5Report.reviewed.toan_q_2014_12_100
  assert.equal(corrected.previousAnswer, 1)
  assert.equal(corrected.answer, 3)
  assert.equal(questions.get('toan_q_2014_12_100').answer, 3)
  assert.equal(questions.get('toan_q_2014_12_100').correctAnswer, 3)
})

test('all 56 reviewed questions now have explanations instead of quarantine warnings', () => {
  const reviewed = { ...m1m2Report.reviewed, ...m3m5Report.reviewed }
  assert.equal(Object.keys(reviewed).length, 56)
  for (const id of Object.keys(reviewed)) assert.doesNotMatch(curated[id], /^Chưa thẩm định lời giải nghe\./, id)
})

test('source report identifies its secondary-source limits', () => {
  assert.equal(m1m2Report.status, 'reviewed_against_local_transcript_pdf')
  assert.equal(m1m2Report.sources.length, 2)
  assert.ok(m1m2Report.limits.some((limit) => /not an official|official JLPT/i.test(limit)))
  assert.ok(m1m2Report.limits.some((limit) => /follow-up batch/i.test(limit)))
  assert.ok(m3m5Report.sources.some((source) => source.url?.includes('dethitiengnhat.com')))
})
