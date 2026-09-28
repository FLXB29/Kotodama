import fs from 'node:fs'

const exams = JSON.parse(fs.readFileSync('data/jlpt_n3_toan_master.json', 'utf8'))
const sets = [
  {
    period: '201712',
    examId: 'toan-n3-201712-full',
    answers: [4, 2, 1, 3, 4, 1, 2, 3, 1, 2, 4, 1, 3],
    sources: [{ name: 'Sohu question-by-question answer review', url: 'https://www.sohu.com/a/208348786_691404' }],
  },
  {
    period: '201707',
    examId: 'toan-n3-201707-full',
    answers: [1, 4, 2, 1, 3, 2, 3, 4, 1, 3, 4, 2, 2],
    sources: [
      { name: 'ChuyenNgoaiNgu reference key', url: 'https://chuyenngoaingu.com/news/dap-an-ky-thi-nang-luc-nhat-ngu-jlpt-thang-7-2017-1211.aspx' },
      { name: 'LuyenThiTiengNhat question text and Vietnamese translations', url: 'https://www.luyenthitiengnhat.edu.vn/mod/page/view.php?id=3405' },
    ],
  },
]

fs.mkdirSync('reports/n3-quality-audit', { recursive: true })
for (const set of sets) {
  const exam = exams.find((entry) => entry.id === set.examId)
  if (!exam) throw new Error(`Could not find ${set.examId}.`)
  const questions = exam.parts
    .filter((part) => part.title.includes('Ngữ pháp'))
    .flatMap((part) => part.questions)
    .filter((question) => Number(question.number) >= 36 && Number(question.number) <= 48)
    .sort((a, b) => Number(a.number) - Number(b.number))
  if (questions.length !== 13) throw new Error(`${set.period}: found ${questions.length} items.`)
  const rows = questions.map((question, index) => ({
    questionNumber: Number(question.number), storedAnswer: Number(question.correctAnswer ?? question.answer),
    reviewedAnswer: set.answers[index], choices: question.options,
    matches: Number(question.correctAnswer ?? question.answer) === set.answers[index],
  }))
  const mismatches = rows.filter((row) => !row.matches)
  if (mismatches.length) throw new Error(`${set.period}: answer mismatch at ${mismatches.map((row) => row.questionNumber).join(', ')}.`)
  const report = {
    generatedAt: new Date().toISOString(), examId: set.examId, scope: 'Grammar Mondai 1, questions 36–48.',
    method: 'The stored and manually reviewed answer sequences agree with the linked published answer reference. These publications are not official JLPT marking sheets; the audit is scoped to this subtest.',
    sources: set.sources, rows,
    totals: { questions: rows.length, storedMatchesReviewed: rows.filter((row) => row.matches).length },
  }
  const reportPath = `reports/n3-quality-audit/answer-key-${set.period}-grammar.json`
  fs.writeFileSync(reportPath, `${JSON.stringify(report, null, 2)}\n`)
  console.log(`${reportPath}: ${report.totals.storedMatchesReviewed}/${report.totals.questions}`)
}
