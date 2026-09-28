import fs from 'node:fs'
import path from 'node:path'
import prettier from 'prettier'

const exams = JSON.parse(fs.readFileSync('data/jlpt_n3_toan_master.json', 'utf8'))
const exam = exams.find((entry) => entry.id === 'toan-n3-202207-full')
if (!exam) throw new Error('Could not find the July 2022 N3 paper.')

const questions = exam.parts
  .filter((part) => part.title.includes('Ngữ pháp') && part.title.includes('Mondai 1'))
  .flatMap((part) => part.questions)
const reviewedAnswers = [3, 2, 4, 1, 2, 2, 3, 3, 4, 1, 4, 1, 3]
if (questions.length !== reviewedAnswers.length) {
  throw new Error(`Expected 13 July 2022 grammar items, found ${questions.length}.`)
}

const rows = questions.map((question, index) => ({
  questionNumber: Number(question.number),
  storedAnswer: Number(question.correctAnswer ?? question.answer),
  reviewedAnswer: reviewedAnswers[index],
  choices: question.options,
  answerMatchesReviewed: Number(question.correctAnswer ?? question.answer) === reviewedAnswers[index],
}))
const changed = rows.filter((row) => !row.answerMatchesReviewed)
if (changed.length) {
  throw new Error(
    `Stored July 2022 answers differ from the reviewed key at: ${changed.map((row) => row.questionNumber).join(', ')}`
  )
}

const report = {
  generatedAt: new Date().toISOString(),
  examId: exam.id,
  scope: 'Grammar Mondai 1, the 13 items stored as questions 35–47 in this dataset.',
  method:
    'The 13 prompts and choices were checked against the user-provided original exam PDF, printed pages 5–6. The stored key was checked against the user-provided answer-sheet PDF, page 24, and reviewed in sentence context. This confirms agreement with the supplied reference sheet, not an official JLPT key.',
  sourceReview: {
    questionPaper: '13. N3 7 2022.pdf',
    questionPaperPages: [5, 6],
    questionPaperItemNumbers: Array.from({ length: 13 }, (_, index) => index + 1),
    answerSheet: 'ĐÁP ÁN JLPT N3 (update 26.6.2026).pdf',
    answerSheetPdfPage: 24,
    userProvidedAnswers: reviewedAnswers,
    storedAnswersMatchUserProvidedSheet: rows.filter((row) => row.answerMatchesReviewed).length,
    officialAnswerPdfConfirmed: false,
  },
  sources: [
    {
      name: 'TryNihongo question transcription',
      url: 'https://trynihongo.com/en/jlpt-grammar-reading-comprehension-n3-test-july-2022-q1309',
      qualification:
        'Cross-checks wording and order for the full grammar section; no answer key was exposed in the text page.',
    },
    {
      name: 'JPNIHON reconstructed test',
      url: 'https://jpnihon.com/5112.html',
      qualification:
        'Its extracted item answers agree with the stored choice for the study-abroad question and PIN-security question; this is a third-party answer reconstruction.',
    },
    {
      name: 'Tiếng Nhật Đơn Giản reference-answer page',
      url: 'https://www.tiengnhatdongian.com/hot-dap-an-jlpt-n3-thang-7-2022-chuan-xac-nhat/',
      qualification:
        'Identifies its key as a reference compiled from teachers; answer is embedded in images and was not independently OCR-verified in this audit.',
    },
  ],
  rows,
  totals: {
    questions: rows.length,
    storedMatchesReviewed: rows.filter((row) => row.answerMatchesReviewed).length,
    referenceAnswerTextChecks: [
      { questionNumber: 46, storedAnswer: 1, reconstructedAnswerText: '留学することにしたんです', matches: true },
      { questionNumber: 47, storedAnswer: 3, reconstructedAnswerText: '知られないようにしてください', matches: true },
    ],
  },
}

const reportPath = 'reports/n3-quality-audit/answer-key-2022-07-grammar.json'
fs.mkdirSync(path.dirname(reportPath), { recursive: true })
const formattedReport = await prettier.format(`${JSON.stringify(report, null, 2)}\n`, {
  filepath: reportPath,
})
fs.writeFileSync(reportPath, formattedReport)
console.log(JSON.stringify({ reportPath, totals: report.totals }, null, 2))
