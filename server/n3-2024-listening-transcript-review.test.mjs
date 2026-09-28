import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import test from 'node:test'
import { fileURLToPath } from 'node:url'

const root = fileURLToPath(new URL('../', import.meta.url))
const master = JSON.parse(fs.readFileSync(path.join(root, 'data/jlpt_n3_toan_master.json'), 'utf8'))
const curated = JSON.parse(fs.readFileSync(path.join(root, 'data/jlpt_n3_explanations_curated.json'), 'utf8'))
const report = JSON.parse(
  fs.readFileSync(path.join(root, 'reports/n3-quality-audit/listening-2024-transcript-review.json'), 'utf8')
)
const examIds = new Set(['toan-n3-202407-full', 'toan-n3-202412-full'])
const exams = master.filter((exam) => examIds.has(exam.id))
const questions = exams.flatMap((exam) =>
  exam.parts.filter((part) => part.title.startsWith('Nghe')).flatMap((part) => part.questions)
)
const questionById = new Map(questions.map((question) => [question.id, question]))

function transcriptOptions(script) {
  const result = []
  for (const line of script.split(/\r?\n/u)) {
    if (/^\s*[1-4１-４]\s*番/u.test(line)) continue
    const match = line.match(/^\s*([1-4１-４])(?:[.．、]\s*|\s+)(.+?)\s*$/u)
    if (!match) continue
    const number = Number(match[1].replace(/[１-４]/gu, (digit) => String('１２３４'.indexOf(digit) + 1)))
    if (number !== result.length + 1) continue
    result.push(`${number}. ${match[2].replace(/[（(]正解\s*[：:]?\s*[1-4１-４][）)]/u, '').trim()}`)
  }
  return result
}

test('all 56 2024 listening explanations translate the prompt and review answers', () => {
  assert.equal(questions.length, 56)
  assert.equal(report.totals.questionsReviewed, 56)
  assert.equal(report.questions.length, 56)
  for (const question of questions) {
    const explanation = curated[question.id]
    assert.match(explanation, /Dịch (?:câu hỏi|tình huống):/u, question.id)
    assert.match(
      explanation,
      new RegExp(`(?:đáp án|chọn(?: phương án)?)(?: số)?\\s*${question.answer}\\b`, 'iu'),
      question.id
    )
    assert.ok(explanation.length > 160, question.id)
  }
})

test('all transcript answer markers match the stored keys; unmarked December items are reported', () => {
  const matched = report.questions.filter((row) => row.transcriptKeyMarkers.length)
  const unmarked = report.questions.filter((row) => !row.transcriptKeyMarkers.length)
  assert.equal(matched.length, 43)
  assert.equal(unmarked.length, 13)
  assert.equal(report.totals.keysChanged, 0)
  for (const row of matched) {
    assert.ok(
      row.transcriptKeyMarkers.every((answer) => answer === row.answer),
      row.questionId
    )
    assert.equal(questionById.get(row.questionId).answer, row.answer)
  }
  assert.ok(unmarked.every((row) => row.questionId.startsWith('toan_q_2024_12_') && row.number >= 89))
})

test('all 32 spoken listening questions have the choice count and text from their transcripts', () => {
  const restored = report.questions.filter((row) => row.optionsRecoveredFromTranscript)
  assert.equal(restored.length, 32)
  for (const row of restored) {
    const question = questionById.get(row.questionId)
    assert.deepEqual(question.options, transcriptOptions(question.script), row.questionId)
    assert.ok(question.answer >= 1 && question.answer <= question.options.length, row.questionId)
    assert.ok(
      question.options.every((option) => !/^[①②③④⓵⓶⓷⓸]$/u.test(option)),
      row.questionId
    )
  }
  assert.equal(questionById.get('toan_q_2024_12_91').options.length, 3)
})

test('pictured listening choices are translated from the image and their keyed choices agree with dialogue', () => {
  const pizza = questionById.get('toan_q_2024_07_74')
  assert.deepEqual(pizza.options, [
    '1. Cán bột thành đế bánh tròn',
    '2. Phết sốt cà chua lên đế bánh',
    '3. Cắt nguyên liệu làm nhân bánh',
    '4. Xếp nguyên liệu lên mặt bánh',
  ])
  assert.equal(pizza.answer, 2)

  const concert = questionById.get('toan_q_2024_12_76')
  assert.ok(concert.options[0].includes('mang ghế') && concert.options[0].includes('đặt chương trình'))
  assert.ok(concert.options[1].includes('chuyển trống'))
  assert.equal(concert.answer, 1)
  assert.equal((curated[concert.id].match(/Chú thích hình:/gu) ?? []).length, 1)
  assert.equal(report.totals.optionsTranscribedFromImage, 2)
})
