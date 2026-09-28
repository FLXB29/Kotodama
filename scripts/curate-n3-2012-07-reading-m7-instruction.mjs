import fs from 'node:fs'

const masterPath = 'data/jlpt_n3_toan_master.json'
const reportPath = 'reports/n3-quality-audit/reading-2012-07-q38-q39-review.json'
const examId = 'toan-n3-201207-full'
const sourcePdfUrl = 'https://drive.google.com/file/d/11YNc2TftE52Ow9f1q3HCrVz5rkbGt9gR/view'
const previousInstruction =
  '問題7　下のページは、リサイクルショップの広告である。これを読んで、下の質問に答えなさい。答えは、1・2・3・4から最もよいものを一つえらびなさい。'
const correctedInstruction =
  '問題7　下のページは、「安見市内のパーティー会場」の案内である。これを読んで、下の質問に答えなさい。答えは、1・2・3・4から最もよいものを一つえらびなさい。'

const exams = JSON.parse(fs.readFileSync(masterPath, 'utf8'))
const exam = exams.find((item) => item.id === examId)
const part = exam?.parts.find((item) =>
  (item.questions || []).some((question) => ['toan_q_2012_07_73', 'toan_q_2012_07_74'].includes(question.id))
)
const questions = part?.questions.filter((question) => ['toan_q_2012_07_73', 'toan_q_2012_07_74'].includes(question.id))

if (!part || questions?.length !== 2) throw new Error('Could not find both July 2012 printed questions 38–39')
if (!String(questions[0].passage).includes('安見市内のパーティー会場')) {
  throw new Error('Question passage no longer matches the party-venue source')
}
if (![1, 2].every((answer, index) => Number(questions[index].correctAnswer ?? questions[index].answer) === answer)) {
  throw new Error('Question answers changed from the reviewed source-backed keys')
}
if (part.instruction !== previousInstruction && part.instruction !== correctedInstruction) {
  throw new Error('Part instruction changed unexpectedly; review before applying this correction')
}

const priorReport = fs.existsSync(reportPath) ? JSON.parse(fs.readFileSync(reportPath, 'utf8')) : null
part.instruction = correctedInstruction
fs.writeFileSync(masterPath, JSON.stringify(exams, null, 2) + '\n')

const report = {
  generatedAt: new Date().toISOString(),
  exam: 'JLPT N3 July 2012',
  scope: 'Reading Mondai 7 instruction and printed questions 38–39 (internal questions 73–74).',
  sourcePdf: {
    title: '3. N3 7-2012.pdf',
    url: `${sourcePdfUrl}#page=12`,
    driveFileId: '11YNc2TftE52Ow9f1q3HCrVz5rkbGt9gR',
    renderedPages: [12, 13],
    visualReview:
      'Chrome/PDF viewer page 12 identifies the task as a guide to party venues in Yasumi City; page 13 shows the venue table. The prior section instruction incorrectly named a second-hand shop advert.',
  },
  correction: {
    partId: part.id,
    previousInstruction: priorReport?.correction?.previousInstruction ?? previousInstruction,
    correctedInstruction,
    questionIds: questions.map((question) => question.id),
    printedQuestions: [38, 39],
    answersPreserved: questions.map((question) => Number(question.correctAnswer ?? question.answer)),
    answerKeysChanged: 0,
  },
  answerReference: {
    officialKeyEstablished: false,
    note: 'This review corrected the task instruction and checked the existing answers against the visible venue table; it does not establish an official JLPT answer key.',
  },
}
fs.writeFileSync(reportPath, JSON.stringify(report, null, 2) + '\n')
console.log(`Corrected ${part.id}; wrote ${reportPath}`)
