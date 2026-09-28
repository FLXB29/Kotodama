import fs from 'node:fs'
import path from 'node:path'

const masterPath = path.resolve('data/jlpt_n3_toan_master.json')
const curatedPath = path.resolve('data/jlpt_n3_explanations_curated.json')
const exams = JSON.parse(fs.readFileSync(masterPath, 'utf8'))
const curated = JSON.parse(fs.readFileSync(curatedPath, 'utf8'))
const exam = exams.find((item) => item.id === 'toan-n3-202212-full')
if (!exam) throw new Error('Could not find the December 2022 N3 full exam.')

const matches = exam.parts.flatMap((part) => part.questions || []).filter((item) => item.id === 'toan_q_2022_12_36')
if (matches.length !== 1) throw new Error(`Expected one question 36; found ${matches.length}.`)

const question = matches[0]
const sourceFragment = '書き方がよくわからないところがあったんですが'
const previousFragment = '書き方がよくわからないところなんですが'
const options = question.options.map((option) => String(option).replace(/\s+/gu, ''))
if (JSON.stringify(options) !== JSON.stringify(['1に', '2で', '3と', '4が'])) {
  throw new Error('Unexpected question 36 choices; refusing to edit the prompt.')
}
if (Number(question.answer) !== 2 || Number(question.correctAnswer) !== 2) {
  throw new Error('Unexpected question 36 answer; refusing to edit the prompt.')
}
if (curated[question.id] !== question.explanation) {
  throw new Error('Question 36 explanation differs from the curated explanation file.')
}
if (!question.explanation.includes('Có chỗ em chưa hiểu rõ cách điền')) {
  throw new Error('Question 36 explanation does not translate the missing-detail clause.')
}

let changed = false
for (const field of ['question', 'sentence']) {
  const value = String(question[field] || '')
  if (value.includes(sourceFragment)) continue
  if (!value.includes(previousFragment)) {
    throw new Error(`Unexpected question 36 ${field}; refusing to replace unknown wording.`)
  }
  question[field] = value.replace(previousFragment, sourceFragment)
  changed = true
}

fs.writeFileSync(masterPath, `${JSON.stringify(exams, null, 2)}\n`, 'utf8')
console.log(`${changed ? 'Corrected' : 'Confirmed'} question 36 transcription: restored 「ところがあったんですが」 from the source PDF; answer and options were unchanged.`)
