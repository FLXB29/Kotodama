import fs from 'node:fs'

const masterPath = 'data/jlpt_full_master.json'
const exams = JSON.parse(fs.readFileSync(masterPath, 'utf8'))
const exam = exams.find((item) => item.id === 'cm2u2yale01jo134i8wwru1oo-grammar-reading')
if (!exam) throw new Error('Could not find the July 2024 N3 grammar and reading section')

const questions = exam.parts.flatMap((part) => part.questions || [])
for (const [number, expectedScript] of [
  [49, 'の 焼ける <u>いいにおい</u> が'],
  [51, 'ばかりなので 覚えなければいけない <u>ことが</u> 多くて'],
]) {
  const question = questions.find((item) => Number(item.number) === number)
  if (!question) throw new Error(`Missing July 2024 question ${number}`)
  question.script = expectedScript
}

fs.writeFileSync(masterPath, `${JSON.stringify(exams, null, 2)}\n`, 'utf8')
console.log('Aligned the July 2024 section star-script text with its four source-verified fragments.')
