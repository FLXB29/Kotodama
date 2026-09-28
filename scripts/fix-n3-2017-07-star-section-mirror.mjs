import fs from 'node:fs'

const fullPath = 'data/jlpt_n3_toan_master.json'
const sectionPath = 'data/jlpt_full_master.json'
const fullExams = JSON.parse(fs.readFileSync(fullPath, 'utf8').replace(/^\uFEFF/, ''))
const sectionExams = JSON.parse(fs.readFileSync(sectionPath, 'utf8').replace(/^\uFEFF/, ''))
const fullExam = fullExams.find((exam) => exam.id === 'toan-n3-201707-full')
const sectionExam = sectionExams.find((exam) => exam.id === 'cm2u2wq1c00ck134imolbo8ac-grammar-reading')
const fullPart = fullExam?.parts.find((part) => part.title.includes('Ngữ pháp') && part.title.includes('Mondai 2'))
const sectionPart = sectionExam?.parts.find((part) => part.title === 'Mondai 2')

if (!fullPart || !sectionPart) throw new Error('Could not find the July 2017 grammar star section in both datasets')

for (const number of [49, 50, 51, 52, 53]) {
  const source = fullPart.questions.find((question) => question.number === number)
  const target = sectionPart.questions.find((question) => question.number === number)
  if (!source || !target || !source.starPrompt) throw new Error(`Could not find July 2017 star question ${number}`)

  const prompt = `${source.starPrompt.before} ___ ___ _★_ ___ ${source.starPrompt.after}`
  target.question = prompt
  target.sentence = prompt
  target.options = source.options.map((option, index) => ({
    id: String(index + 1),
    text: String(option)
      .replace(/^\s*[1-4][.．、]?\s*/u, '')
      .trim(),
  }))
  target.correctAnswer = String(source.correctAnswer)
  target.answer = String(source.answer)
  target.starPrompt = structuredClone(source.starPrompt)
  target.starCorrectOrder = structuredClone(source.starCorrectOrder)
  target.starPosition = source.starPosition
  target.starOrderVerified = source.starOrderVerified
  target.starPositionVerified = source.starPositionVerified
  target.starVerificationStatus = source.starVerificationStatus
  target.starVerificationSources = structuredClone(source.starVerificationSources)
  target.starAnswerKeyConflict = source.starAnswerKeyConflict
  target.explanation = source.explanation
  const fragments = source.options.map((option) =>
    String(option)
      .replace(/^\s*[1-4][.．、]?\s*/u, '')
      .trim()
  )
  target.script = source.starCorrectOrder
    .map((choice, index) => (index === source.starPosition ? `<u>${fragments[choice - 1]}</u>` : fragments[choice - 1]))
    .join(' ')
}

fs.writeFileSync(fullPath, `${JSON.stringify(fullExams, null, 2)}\n`)
fs.writeFileSync(sectionPath, `${JSON.stringify(sectionExams, null, 2)}\n`)
console.log(
  'Synchronized all five July 2017 ★ questions into the standalone grammar section; the q49 answer-reference dispute remains explicit.'
)
