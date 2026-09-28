import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'

const root = path.resolve('.')
const review = JSON.parse(
  fs.readFileSync(path.join(root, 'reports/n3-quality-audit/vocabulary-source-2014-07-m1-reviews.json'), 'utf8')
)
const exams = JSON.parse(fs.readFileSync(path.join(root, 'data/jlpt_n3_toan_master.json'), 'utf8'))
const curated = JSON.parse(fs.readFileSync(path.join(root, 'data/jlpt_n3_explanations_curated.json'), 'utf8'))
const exam = exams.find((item) => item.id === 'toan-n3-201407-full')
assert.ok(exam, 'Missing JLPT N3 07/2014 full exam')
const questions = new Map(exam.parts.flatMap((part) => part.questions).map((question) => [question.id, question]))

const normalizeText = (value) =>
  String(value || '')
    .replace(/<[^>]*>/gu, '')
    .replace(/^\s*\[\d+\]\s*/u, '')
    .normalize('NFKC')
    .replace(/\s+/gu, '')

const normalizeOption = (value) =>
  String(value || '')
    .replace(/<[^>]*>/gu, '')
    .normalize('NFKC')
    .replace(/^\s*[1-4][.．、\s]*/u, '')
    .replace(/[。．.]+$/u, '')
    .replace(/\s+/gu, '')

for (const reviewed of review.questions) {
  const question = questions.get(reviewed.questionId)
  assert.ok(question, `Missing question ${reviewed.questionId}`)
  assert.equal(question.answer, reviewed.answerKeyAnswer, `Answer differs from page 9 key: ${reviewed.questionId}`)
  if ('correctAnswer' in question) {
    assert.equal(
      question.correctAnswer,
      reviewed.answerKeyAnswer,
      `correctAnswer differs from page 9 key: ${reviewed.questionId}`
    )
  }
  assert.equal(
    question.sourceVerificationStatus,
    'verified',
    `Missing source verification status: ${reviewed.questionId}`
  )
  assert.ok(question.sourceVerificationSources?.includes(review.sources.questionSourceUrl))
  assert.ok(question.sourceVerificationSources?.includes(review.sources.answerKeySource))
  assert.ok(
    question.explanation && curated[question.id] === question.explanation,
    `Explanation not mirrored: ${reviewed.questionId}`
  )

  if (reviewed.sourceStem) {
    assert.equal(
      normalizeText(question.question),
      normalizeText(reviewed.sourceStem),
      `Stem differs from PDF: ${reviewed.questionId}`
    )
  }
  if (reviewed.sourceTarget) {
    assert.ok(
      normalizeText(question.question).includes(normalizeText(reviewed.sourceTarget)),
      `Target differs from PDF: ${reviewed.questionId}`
    )
  }
  if (reviewed.sourceOptions) {
    assert.deepEqual(
      question.options.map(normalizeOption),
      reviewed.sourceOptions.map(normalizeOption),
      `Options differ from PDF: ${reviewed.questionId}`
    )
  }
}

const q6 = questions.get('toan_q_2014_07_6')
assert.ok(q6.question.includes('<u>割れて</u>いる'), 'Question 6 underline should match the PDF target')
assert.ok(
  q6.explanation.includes('よごれて') && q6.explanation.includes('たおれて') && q6.explanation.includes('ぬれて')
)

const q2 = questions.get('toan_q_2014_07_2')
assert.ok(q2.explanation.includes('nhớ địa chỉ email'))
assert.ok(!q2.explanation.includes(': cảm thấy；học'))

const q5 = questions.get('toan_q_2014_07_5')
assert.ok(q5.explanation.includes('giải thể thao'))
assert.ok(!q5.explanation.includes(': đại hội.'))

const q7 = questions.get('toan_q_2014_07_7')
assert.ok(q7.explanation.includes('dồn sự chú ý'))
assert.ok(!q7.explanation.includes('trong văn tập'))

const q18 = questions.get('toan_q_2014_07_18')
assert.ok(q18.question.includes('する ( ) な人だ。'), 'Question 18 sentence should match the PDF')
assert.ok(q18.options[1].includes('効果的') && !q18.options[1].includes('効果的な'))
assert.ok(q18.explanation.includes('có hiệu quả') && q18.explanation.includes('Dịch:'))

const q35 = questions.get('toan_q_2014_07_35')
assert.ok(q35.options[0].includes('このテレビが最近'), 'Question 35 choice 1 should match the PDF particle')
assert.ok(q35.explanation.includes('このテレビが最近') && !q35.explanation.includes('このテレビは…'))
console.log(
  `Verified source transcription, ${review.questions.length} answer-key entries, and revised per-option explanations for JLPT N3 07/2014.`
)
