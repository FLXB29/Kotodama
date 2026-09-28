import fs from 'node:fs'
import path from 'node:path'

const root = path.resolve('.')
const masterPath = path.join(root, 'data/jlpt_n3_toan_master.json')
const review = JSON.parse(fs.readFileSync(path.join(root, 'reports/n3-quality-audit/grammar-m3-2014-07-source-review.json'), 'utf8'))
const exams = JSON.parse(fs.readFileSync(masterPath, 'utf8'))
const exam = exams.find((item) => item.id === review.examId)
if (!exam) throw new Error(`Missing exam ${review.examId}`)
const part = exam.parts.find((item) => item.questions.some((question) => question.id === 'toan_q_2014_07_54'))
if (!part) throw new Error('Missing Grammar Mondai 3 passage')
const questions = new Map(part.questions.map((question) => [question.id, question]))
const normalize = (value) => String(value || '').replace(/<[^>]*>/gu, '').normalize('NFKC').replace(/\s+/gu, '')
if (!normalize(part.passage).includes(normalize(review.sourcePassage))) throw new Error('Grammar M3 passage differs from source PDF; refusing to mark it verified')
const sourceKey = `Google Drive: ${review.source.answerKeyFile}, viewer page ${review.source.answerKeyViewerPage}; Drive file ${review.source.answerKeyDriveFileId}.`
const sourcePdf = `Google Drive: ${review.source.questionFile}, printed page ${review.source.printedPage}; Drive file ${review.source.questionDriveFileId}.`
for (const row of review.questions) {
  const question = questions.get(row.questionId)
  if (!question || question.answer !== row.answerKeyAnswer || question.correctAnswer !== row.answerKeyAnswer) {
    throw new Error(`Answer mismatch for ${row.questionId}; refusing to mark verified`)
  }
  const actualOptions = question.options.map((option) => normalize(option).replace(/^[1-4][.．、]?/u, ''))
  if (JSON.stringify(actualOptions) !== JSON.stringify(row.sourceOptions.map(normalize))) {
    throw new Error(`Choice mismatch for ${row.questionId}; refusing to mark verified`)
  }
  question.sourceVerificationStatus = 'verified'
  question.sourceVerificationSources = [sourcePdf, sourceKey]
}
fs.writeFileSync(masterPath, `${JSON.stringify(exams, null, 2)}\n`)
console.log('Recorded source/key provenance for Grammar M3 07/2014 after exact passage, choice, and answer checks.')
