import fs from 'node:fs'
import path from 'node:path'

const masterPath = path.resolve('data/jlpt_n3_toan_master.json')
const explanationReviewPath = path.resolve('reports/n3-quality-audit/star-explanations-2011-12-review.json')
const reportPath = path.resolve('reports/n3-quality-audit/star-source-2011-12-review.json')
const master = JSON.parse(fs.readFileSync(masterPath, 'utf8'))
const explanationReview = JSON.parse(fs.readFileSync(explanationReviewPath, 'utf8'))
const examId = 'toan-n3-201112-full'
const exam = master.find((entry) => entry.id === examId)
if (!exam) throw new Error(`Missing exam ${examId}`)

const part = exam.parts.find((entry) => entry.title.includes('Ngữ pháp') && entry.title.includes('Mondai 2'))
if (!part) throw new Error('Missing grammar Mondai 2')

const sourcePdf = {
  title: '2. N3 12-2011.pdf',
  driveFileId: '1JLd7Jc1RtUIs0FwWcE8mXwuqT-h2WjJj',
  url: 'https://drive.google.com/file/d/1JLd7Jc1RtUIs0FwWcE8mXwuqT-h2WjJj/view',
  renderedPages: [
    { viewerPage: 5, printedPage: 5, printedQuestions: [14, 15, 16] },
    { viewerPage: 6, printedPage: 6, printedQuestions: [17, 18] },
  ],
  method:
    'Opened the original Drive PDF in Chrome and visually compared all four printed fragments and the ★ position. Pages 5–6 were checked at 75% and 100% zoom; all five ★ marks are over the third of four blanks. The existing fragment orders make grammatical sentences and place the stored answers in that printed slot.',
  limitation:
    'The PDF confirms source wording and ★ layout, not an official JLPT answer key. The stored answer sequence was not independently confirmed against an official key.',
}

const questions = explanationReview.questions.map((reviewed) => {
  const question = part.questions.find((entry) => entry.id === reviewed.questionId)
  if (!question) throw new Error(`Missing question ${reviewed.questionId}`)
  const viewerPage = reviewed.printedQuestion <= 16 ? 5 : 6
  const sourceUrl = `${sourcePdf.url}#page=${viewerPage}`
  const options = question.options.map((option) =>
    String(option)
      .replace(/^\s*[1-4][.．、]\s*/u, '')
      .trim()
  )
  question.starOrderVerified = true
  question.starPositionVerified = true
  question.starVerificationStatus = 'verified-against-source'
  question.starVerificationSources = [sourceUrl]
  question.starVerificationNote = `Visually checked printed question ${reviewed.printedQuestion} on page ${viewerPage} of the original December 2011 PDF in Chrome. All four fragments match the source; the printed ★ is over slot 3. The stored order ${reviewed.order.join(' → ')} forms the sentence and places choice ${reviewed.storedAnswer} at the ★. This is source-layout and grammar verification, not an official JLPT answer-key confirmation.`
  return {
    printedQuestion: reviewed.printedQuestion,
    questionId: reviewed.questionId,
    viewerPage,
    printedOptions: options,
    order: reviewed.order,
    starPositionZeroBased: 2,
    answer: reviewed.storedAnswer,
    completedSentence: reviewed.completedSentence,
    sourceStatus: 'verified-against-source',
    officialKeyEstablished: false,
  }
})

const report = {
  reviewedAt: new Date().toISOString().slice(0, 10),
  exam: 'JLPT N3 December 2011',
  examId,
  section: 'Grammar Mondai 2, printed questions 14–18.',
  sourcePdf,
  questions,
  officialAnswerKeyConfirmed: false,
  summary:
    'The original exam PDF confirms all five choice sets and places every ★ in the third blank. Stored answer keys match the third fragment of the reconstructed grammatical order; no official JLPT key was independently verified.',
}

fs.writeFileSync(masterPath, `${JSON.stringify(master, null, 2)}\n`, 'utf8')
fs.writeFileSync(reportPath, `${JSON.stringify(report, null, 2)}\n`, 'utf8')
console.log(
  JSON.stringify({ report: reportPath, questions: questions.length, sourceStatus: 'verified-against-source' }, null, 2)
)
