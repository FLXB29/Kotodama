import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'

const full = JSON.parse(fs.readFileSync(path.resolve('data/jlpt_n3_toan_master.json'), 'utf8'))
const sections = JSON.parse(fs.readFileSync(path.resolve('data/jlpt_full_master.json'), 'utf8'))
const curated = JSON.parse(fs.readFileSync(path.resolve('data/jlpt_n3_explanations_curated.json'), 'utf8'))
const report = JSON.parse(
  fs.readFileSync(path.resolve('reports/n3-quality-audit/grammar-source-2022-12-q39-q43-q51-review.json'), 'utf8')
)

function exam(exams, id) {
  const found = exams.find((item) => item.id === id)
  assert.ok(found, `Missing exam ${id}`)
  return found
}

function question(selectedExam, number) {
  const matches = selectedExam.parts
    .flatMap((part) => part.questions || [])
    .filter((item) => Number(item.number) === number)
  assert.equal(matches.length, 1, `Expected one question ${number}`)
  return matches[0]
}

function optionText(option) {
  return typeof option === 'string' ? option.replace(/^\s*[1-4][.．、]?\s*/u, '').trim() : option.text
}

const fullExam = exam(full, 'toan-n3-202212-full')
const section = exam(sections, 'cm2u2xxmo019t134izzsjxgrl-grammar-reading')
const q36Section = question(section, 36)
assert.match(q36Section.question, /ところがあったんですが/u)
assert.doesNotMatch(q36Section.question, /ところがあった\s+んですが/u)
assert.doesNotMatch(q36Section.question, /、\s+ここの書き方/u)
const q39Full = question(fullExam, 39)
const q39Section = question(section, 39)
assert.equal(optionText(q39Full.options[1]), '非常に')
assert.equal(optionText(q39Section.options[1]), '非常に')
assert.equal(Number(q39Full.answer), 4)
assert.equal(Number(q39Section.answer), 4)
assert.match(q39Full.explanation, /必ず持ってきてください/)

const q43 = question(section, 43)
assert.match(q43.question, /今ちょっといい？」/)
assert.doesNotMatch(q43.question, /？J/u)
assert.equal(Number(q43.answer), 3)

const q51 = question(section, 51)
assert.equal(optionText(q51.options[0]), '1年前に習い始めたのだが')
assert.equal(Number(q51.answer), 3)
assert.match(q51.script, /1年前に習い始めたのだが<u>弾けば<\/u>/u)

const q52 = question(fullExam, 52)
assert.match(q52.explanation, /Dịch: “A: Chúc mừng sinh nhật\./u)
assert.doesNotMatch(q52.explanation, /Dịch: ““/u)
assert.equal(curated[q52.id], q52.explanation)

const q53 = question(fullExam, 53)
assert.match(q53.explanation, /Dịch:/u)
assert.match(q53.explanation, /Thứ tự bốn mảnh là 3 → 1 → 2 → 4/u)
assert.equal(curated[q53.id], q53.explanation)
assert.deepEqual(report.answerReference.answers, { 36: 2, 39: 4, 43: 3, 51: 3, 52: 2, 53: 2 })
assert.match(report.limitation, /unverified/u)

console.log(
  'Verified source-backed N3 12/2022 grammar transcription, answer-reference entries, and explanation synchronization for questions 36, 39, 43, and 51–53.'
)
