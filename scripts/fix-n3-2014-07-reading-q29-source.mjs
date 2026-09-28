import fs from 'node:fs'
import path from 'node:path'

const root = path.resolve('.')
const masterPath = path.join(root, 'data/jlpt_n3_toan_master.json')
const reviewPath = path.join(root, 'reports/n3-quality-audit/reading-source-2014-07-q28-30-review.json')
const exams = JSON.parse(fs.readFileSync(masterPath, 'utf8'))
const review = JSON.parse(fs.readFileSync(reviewPath, 'utf8'))
const exam = exams.find((item) => item.id === review.examId)
if (!exam) throw new Error(`Missing exam ${review.examId}`)
const questions = new Map(exam.parts.flatMap((part) => part.questions).map((question) => [question.id, question]))
const questionSource = `Google Drive: ${review.source.questionFile}, printed page 9; Drive file ${review.source.questionDriveFileId}.`
const keySource = `Google Drive: ${review.source.answerKeyFile}, viewer page ${review.source.answerKeyViewerPage}; Drive file ${review.source.answerKeyDriveFileId}.`
for (const row of review.questions) {
  const target = questions.get(row.questionId)
  if (!target) throw new Error(`Missing question ${row.questionId}`)
  if (row.printedQuestion === 29) {
    if (!target.options.includes(row.previousAppOption) && !target.options.includes(row.sourceOptions[0].replace(/[。．]$/u, ''))) {
      throw new Error(`Unexpected source option for ${target.id}; refusing to overwrite: ${target.options[0]}`)
    }
    target.options[0] = row.sourceOptions[0].replace(/[。．]$/u, '')
  }
  target.sourceVerificationStatus = 'verified'
  target.sourceVerificationSources = [questionSource, keySource]
}
fs.writeFileSync(masterPath, `${JSON.stringify(exams, null, 2)}\n`)
console.log('Corrected July 2014 reading question 29 and recorded source/key provenance for questions 28-30.')
