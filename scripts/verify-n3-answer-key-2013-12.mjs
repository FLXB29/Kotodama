import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = fileURLToPath(new URL('../', import.meta.url))
const key = JSON.parse(fs.readFileSync(path.join(root, 'reports/n3-quality-audit/answer-key-2013-12.json'), 'utf8'))
const exams = JSON.parse(fs.readFileSync(path.join(root, 'data/jlpt_n3_toan_master.json'), 'utf8'))
const exam = exams.find((item) => item.id === key.examId)
if (!exam) throw new Error(`Missing exam ${key.examId}`)

const expected = key.groups.flat()
const actual = exam.parts.flatMap((part) => part.questions.map((question) => question.correctAnswer))
if (exam.parts.length !== key.groups.length) throw new Error('Mondai group count changed')
for (let group = 0; group < key.groups.length; group++) {
  const questions = exam.parts[group].questions
  if (questions.length !== key.groups[group].length) throw new Error(`Question count changed in group ${group + 1}`)
  for (let index = 0; index < questions.length; index++) {
    const question = questions[index]
    const answer = key.groups[group][index]
    if (question.correctAnswer !== answer || question.answer !== answer)
      throw new Error(`${question.id}: expected ${answer}, found ${question.correctAnswer}/${question.answer}`)
  }
}
if (expected.length !== 102 || actual.length !== 102) throw new Error('Expected exactly 102 questions')
console.log(`Verified ${actual.length} answer keys for ${key.examId} against the reviewed reference sheet.`)
