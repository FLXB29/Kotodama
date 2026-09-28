import fs from 'node:fs'

const examId = 'toan-n3-202412-full'
const fixturePath = 'reports/n3-quality-audit/answer-key-2024-12-grammar.json'
const exams = JSON.parse(fs.readFileSync('data/jlpt_n3_toan_master.json', 'utf8'))
const fixture = JSON.parse(fs.readFileSync(fixturePath, 'utf8'))
const exam = exams.find((item) => item.id === examId)
if (!exam) throw new Error('Missing exam ' + examId)

const questions = new Map(exam.parts.flatMap((part) => part.questions.map((question) => [question.number, question])))
const mismatches = fixture.questionNumbers.flatMap((number, index) => {
  const question = questions.get(number)
  const expected = fixture.referenceAnswers[index]
  if (!question) return [{ number, issue: 'missing_question', expected }]
  const actual = question.correctAnswer ?? question.answer
  return actual === expected && question.answer === question.correctAnswer
    ? []
    : [{ number, id: question.id, expected, actual, alias: question.answer }]
})

if (mismatches.length) {
  throw new Error('2024-12 grammar answer-key mismatch: ' + JSON.stringify(mismatches))
}

console.log('Verified ' + fixture.questionNumbers.length + '/' + fixture.questionNumbers.length + ' stored answers against the two reference keys.')
