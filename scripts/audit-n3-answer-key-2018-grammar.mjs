import fs from 'node:fs'

const exams = JSON.parse(fs.readFileSync('data/jlpt_n3_toan_master.json', 'utf8'))
const sets = [
  {
    period: '201812',
    examId: 'toan-n3-201812-full',
    answers: [1, 4, 4, 3, 2, 4, 3, 1, 2, 1, 2, 4, 3],
    sources: [
      { name: 'SOFL published answer table', url: 'https://trungtamnhatngu.edu.vn/blog/dap-an-ky-thi-jlpt-thang-12-2018-1260/' },
      { name: 'Read01 grammar explanations', url: 'https://read01.com/AJ273Dj.html' },
    ],
    qualification: 'The local 13-item key agrees with the SOFL table; Read01 separately explains several specific items. These are nonofficial references and do not certify other parts of the test.',
  },
  {
    period: '201807',
    examId: 'toan-n3-201807-full',
    answers: [4, 1, 2, 4, 2, 3, 3, 2, 3, 1, 4, 1, 2],
    sources: [
      { name: 'Saromalang answer table', url: 'https://www.saromalang.com/2018/06/jlpt.html' },
      { name: 'TryNihongo question-and-answer review', url: 'https://trynihongo.com/ja/giai-de-jlpt-n3-thang-7-nam-2018-bunpou-dokkai-p1075' },
    ],
    qualification: 'The local 13-item key agrees with Saromalang; TryNihongo provides question text and translations. Neither is an official JLPT marking sheet.',
  },
]

const reports = []
for (const set of sets) {
  const exam = exams.find((entry) => entry.id === set.examId)
  if (!exam) throw new Error(`Could not find ${set.examId}.`)
  const questions = exam.parts
    .filter((part) => part.title.includes('Ngữ pháp'))
    .flatMap((part) => part.questions)
    .filter((question) => Number(question.number) >= 36 && Number(question.number) <= 48)
    .sort((a, b) => Number(a.number) - Number(b.number))
  if (questions.length !== 13) throw new Error(`${set.period}: found ${questions.length} grammar items.`)
  const rows = questions.map((question, index) => ({
    questionNumber: Number(question.number),
    storedAnswer: Number(question.correctAnswer ?? question.answer),
    referenceAnswer: set.answers[index],
    choices: question.options,
    matches: Number(question.correctAnswer ?? question.answer) === set.answers[index],
  }))
  const mismatches = rows.filter((row) => !row.matches)
  if (mismatches.length) throw new Error(`${set.period}: stored key differs at ${mismatches.map((row) => row.questionNumber).join(', ')}.`)
  reports.push({
    generatedAt: new Date().toISOString(), examId: set.examId, scope: 'Grammar Mondai 1, question numbers 36–48.',
    method: set.qualification, sources: set.sources, rows,
    totals: { questions: rows.length, storedMatchesReference: rows.filter((row) => row.matches).length },
  })
}

fs.mkdirSync('reports/n3-quality-audit', { recursive: true })
for (const report of reports) {
  const period = report.examId.slice('toan-n3-'.length, -'-full'.length)
  const reportPath = `reports/n3-quality-audit/answer-key-${period}-grammar.json`
  fs.writeFileSync(reportPath, `${JSON.stringify(report, null, 2)}\n`)
  console.log(`${reportPath}: ${report.totals.storedMatchesReference}/${report.totals.questions}`)
}
