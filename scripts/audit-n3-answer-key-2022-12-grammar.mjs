import fs from 'node:fs'
import path from 'node:path'

const exams = JSON.parse(fs.readFileSync('data/jlpt_n3_toan_master.json', 'utf8'))
const exam = exams.find((entry) => entry.id === 'toan-n3-202212-full')
if (!exam) throw new Error('Could not find the December 2022 N3 paper.')

const questions = exam.parts
  .filter((part) => part.title.includes('Ngữ pháp'))
  .flatMap((part) => part.questions)
  .filter((question) => Number(question.number) >= 36 && Number(question.number) <= 48)
  .sort((a, b) => Number(a.number) - Number(b.number))

const reviewedAnswers = [2, 1, 3, 4, 1, 4, 2, 3, 1, 4, 2, 2, 3]
const chuyenNgoaiReference = [3, 4, 4, 2, 1, 3, 1, 4, 3, 1, 3, 2, 2]
const luyenThiJapaneseReference = [4, 1, 3, 4, 1, 4, 2, 3, 1, 4, 1, 2, 3]

if (questions.length !== reviewedAnswers.length) {
  throw new Error(`Expected 13 December 2022 grammar items, found ${questions.length}.`)
}

const rows = questions.map((question, index) => ({
  questionNumber: Number(question.number),
  storedAnswer: Number(question.correctAnswer ?? question.answer),
  reviewedAnswer: reviewedAnswers[index],
  chuyenNgoaiReference: chuyenNgoaiReference[index],
  luyenThiJapaneseReference: luyenThiJapaneseReference[index],
  choices: question.options,
  answerMatchesReviewed: Number(question.correctAnswer ?? question.answer) === reviewedAnswers[index],
  answerMatchesChuyenNgoai: Number(question.correctAnswer ?? question.answer) === chuyenNgoaiReference[index],
  answerMatchesLuyenThiJapanese: Number(question.correctAnswer ?? question.answer) === luyenThiJapaneseReference[index],
}))

const changed = rows.filter((row) => !row.answerMatchesReviewed)
if (changed.length) {
  throw new Error(`Stored December 2022 answers differ from the reviewed key at: ${changed.map((row) => row.questionNumber).join(', ')}`)
}

const report = {
  generatedAt: new Date().toISOString(),
  examId: exam.id,
  scope: 'Grammar Mondai 1, question numbers 36–48.',
  method:
    'The stored key was manually checked against each sentence and option. The two published answer tables disagree strongly with one another and with obvious sentence fits; they are recorded as low-confidence references and never used to auto-correct the data. JLPT does not publish this examination answer key.',
  sources: [
    {
      name: 'Chuyenngoaingu',
      url: 'https://chuyenngoaingu.com/news/de-thi-va-dap-an-jlpt-ky-thi-thang-12-2022-nang-luc-tieng-nhat-5284.aspx',
      qualification:
        'Publishes grammar sequence 3442131431322, which conflicts with the text and answer sequence independently listed by LuyenThiTiengNhat. Treat as low-confidence/version-uncertain.',
    },
    {
      name: 'LuyenThiTiengNhat',
      url: 'https://www.luyenthitiengnhat.edu.vn/mod/page/view.php?id=3492&lang=ja',
      qualification:
        'Publishes grammar sequence 4134142314123. This sequence conflicts with the other reference on most items and includes answers that do not fit the reconstructed item text, such as question 36.',
    },
    {
      name: 'Question paper text',
      url: 'https://www.tiengnhatdongian.com/wp-content/uploads/2023/04/Tu-vung-ngu-phap-N3-T12-2022-Ver-1.0-2212015-Dokkai-dnag-cap-nhat.pdf',
      qualification: 'Cross-checks the reconstructed Japanese sentence and choice wording; it is not an answer key.',
    },
  ],
  rows,
  totals: {
    questions: rows.length,
    storedMatchesReviewed: rows.filter((row) => row.answerMatchesReviewed).length,
    storedMatchesChuyenNgoai: rows.filter((row) => row.answerMatchesChuyenNgoai).length,
    storedMatchesLuyenThiJapanese: rows.filter((row) => row.answerMatchesLuyenThiJapanese).length,
    disagreementsWithAtLeastOneReference: rows.filter(
      (row) => !row.answerMatchesChuyenNgoai || !row.answerMatchesLuyenThiJapanese
    ).length,
  },
  manualDecisions: {
    36: 'Keep option 2: 「ここの書き方はこれで大丈夫でしょうか」 is the natural check that the form was filled out this way. Both reference tables select another option, but 「これが大丈夫」 or 「これと大丈夫」 do not fit the printed predicate.',
    46: 'Keep option 2: 「中川がおりますので、今、代わります」 is the standard humble way for staff to say a colleague is present. Neither reference selects it; the alternatives 「いたします」 and 「いただきます」 do not express a colleague being present.',
  },
}

const reportPath = 'reports/n3-quality-audit/answer-key-2022-12-grammar.json'
fs.mkdirSync(path.dirname(reportPath), { recursive: true })
fs.writeFileSync(reportPath, `${JSON.stringify(report, null, 2)}\n`)
console.log(JSON.stringify({ reportPath, totals: report.totals, manualDecisions: report.manualDecisions }, null, 2))
