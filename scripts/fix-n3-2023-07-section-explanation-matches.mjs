import fs from 'node:fs'

const fullMasterPath = 'data/jlpt_full_master.json'
const toanMasterPath = 'data/jlpt_n3_toan_master.json'
const fullExams = JSON.parse(fs.readFileSync(fullMasterPath, 'utf8'))
const toanExams = JSON.parse(fs.readFileSync(toanMasterPath, 'utf8'))
const sectionExam = fullExams.find((exam) => exam.id === 'cm2u2y1xl01d2134ilubjx79d-grammar-reading')
const toanExam = toanExams.find((exam) => exam.id === 'toan-n3-202307-full')
if (!sectionExam || !toanExam) throw new Error('Could not find the July 2023 N3 grammar exam copies')

const sectionQuestions = sectionExam.parts.flatMap((part) => part.questions || [])
const toanQuestions = toanExam.parts.flatMap((part) => part.questions || [])
const replacements = new Map([
  [39, [['步いて', '歩いて']]],
  [44, [['気になつて', '気になって']]],
  [46, [['そうだね。J', 'そうだね。']]],
  [48, [['店员', '店員']]],
])

for (const [number, changes] of replacements) {
  const question = sectionQuestions.find((item) => Number(item.number) === number)
  if (!question) throw new Error(`Missing July 2023 section question ${number}`)
  for (const field of ['question', 'sentence']) {
    for (const [incorrect, corrected] of changes) question[field] = String(question[field] || '').replaceAll(incorrect, corrected)
  }
}

const sourceQuestion = toanQuestions.find((question) => Number(question.number) === 44)
const sectionQuestion = sectionQuestions.find((question) => Number(question.number) === 44)
if (!sourceQuestion || !sectionQuestion) throw new Error('Missing July 2023 question 44 source copy')
sectionQuestion.options = sourceQuestion.options.map((option, index) => ({
  ...sectionQuestion.options[index],
  text: String(option).replace(/^\s*[1-4][.．、]?\s*/u, '').trim(),
}))

fs.writeFileSync(fullMasterPath, `${JSON.stringify(fullExams, null, 2)}\n`, 'utf8')
console.log('Corrected four July 2023 section OCR/text mismatches and aligned question 44 options to the reviewed source.')
