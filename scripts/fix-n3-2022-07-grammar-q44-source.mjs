import fs from 'node:fs'

const masterPath = 'data/jlpt_n3_toan_master.json'
const exams = JSON.parse(fs.readFileSync(masterPath, 'utf8'))
const exam = exams.find((entry) => entry.id === 'toan-n3-202207-full')
if (!exam) throw new Error('Could not find the July 2022 N3 paper.')

const question = exam.parts
  .filter((part) => part.title.includes('Ngữ pháp') && part.title.includes('Mondai 1'))
  .flatMap((part) => part.questions || [])
  .find((item) => Number(item.number) === 44)
if (!question) throw new Error('Could not find July 2022 grammar question 44.')

const incorrect = '田中「わかりました。では、またあとで'
const corrected = '石山「わかりました。では、またあとで'
for (const field of ['question', 'sentence']) {
  if (typeof question[field] !== 'string') {
    throw new Error(`Question 44 is missing its ${field} source field.`)
  }
  if (question[field].includes(incorrect)) {
    question[field] = question[field].replace(incorrect, corrected)
  } else if (!question[field].includes(corrected)) {
    throw new Error(`Question 44 ${field} did not match either the known transcription or the reviewed source text.`)
  }
}

fs.writeFileSync(masterPath, `${JSON.stringify(exams, null, 2)}\n`, 'utf8')
console.log('Corrected the speaker label in both July 2022 question 44 text fields to match the source PDF, page 6.')
