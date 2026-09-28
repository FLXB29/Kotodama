import fs from 'node:fs'
import path from 'node:path'

const root = process.cwd()
const files = [
  path.join(root, 'data/jlpt_n3_toan_master.json'),
  path.join(root, 'data/jlpt_n3_explanations_curated.json'),
]
const incorrect = '「他人」（たにん）: khách；người khác.'
const corrected = '「他人」（たにん）: người khác; người ngoài.'

for (const file of files) {
  const parsed = JSON.parse(fs.readFileSync(file, 'utf8'))
  const beforeAnswers = new Map()
  let replacements = 0
  let alreadyCorrect = 0

  const correctGloss = (explanation) => {
    if (typeof explanation !== 'string' || !explanation.includes('「他人」')) return explanation
    const oldCount = explanation.split(incorrect).length - 1
    const newCount = explanation.split(corrected).length - 1
    replacements += oldCount
    alreadyCorrect += newCount
    return explanation.replaceAll(incorrect, corrected)
  }

  if (Array.isArray(parsed)) {
    for (const exam of parsed) {
      for (const part of exam.parts || []) {
        for (const question of part.questions || []) {
          beforeAnswers.set(question.id, question.correctAnswer ?? question.answer)
          question.explanation = correctGloss(question.explanation)
        }
      }
    }
  } else {
    for (const [questionId, explanation] of Object.entries(parsed)) {
      parsed[questionId] = correctGloss(explanation)
    }
  }

  if (replacements + alreadyCorrect !== 2) {
    throw new Error(
      `${path.basename(file)}: expected 2 incorrect/corrected 他人 glosses, found ${replacements + alreadyCorrect}`
    )
  }

  if (Array.isArray(parsed)) {
    for (const exam of parsed) {
      for (const part of exam.parts || []) {
        for (const question of part.questions || []) {
          if (
            beforeAnswers.has(question.id) &&
            beforeAnswers.get(question.id) !== (question.correctAnswer ?? question.answer)
          ) {
            throw new Error(`Answer key unexpectedly changed for ${question.id}`)
          }
        }
      }
    }
  }

  fs.writeFileSync(file, `${JSON.stringify(parsed, null, 2)}\n`, 'utf8')
  console.log(
    `Corrected ${replacements} and confirmed ${alreadyCorrect} 他人 contextual glosses in ${path.relative(root, file)}; answer keys unchanged.`
  )
}
