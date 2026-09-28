import fs from 'node:fs'

const masterPath = 'data/jlpt_n3_toan_master.json'
const curatedPath = 'data/jlpt_n3_explanations_curated.json'
const reportPath = 'reports/n3-quality-audit/reading-2012-07-q24-review.json'
const sourcePdfUrl = 'https://drive.google.com/file/d/11YNc2TftE52Ow9f1q3HCrVz5rkbGt9gR/view'

const answer = 3
const explanation =
  'Đáp án 3 — 「一生の仕事だな」 (“Đây đúng là công việc cả đời mình”) nối hợp lý với ý: nếu kiên trì qua ba năm thì có thể tiếp tục làm nghề lâu dài. Đoạn văn nói về Hayashi, người đã làm sushi hơn 20 năm; đây không phải câu chuyện sửa đồ chơi.\n' +
  'Dịch: “Khoảng sau khi đã qua ba năm, ông Hayashi bắt đầu nghĩ: ‘Đây đúng là công việc cả đời mình.’”'

const exams = JSON.parse(fs.readFileSync(masterPath, 'utf8'))
const curated = JSON.parse(fs.readFileSync(curatedPath, 'utf8'))
const priorReport = fs.existsSync(reportPath) ? JSON.parse(fs.readFileSync(reportPath, 'utf8')) : null
const exam = exams.find((item) => item.id === 'toan-n3-201207-full')
const question = exam?.parts.flatMap((part) => part.questions || []).find((item) => item.id === 'toan_q_2012_07_59')

if (!question) throw new Error('Could not find July 2012 reading question 24')
if (!String(question.passage).includes('20 年以上寿司をにぎっている林さん')) {
  throw new Error('Question passage no longer matches the reviewed sushi-chef source')
}
if (Number(question.correctAnswer ?? question.answer) !== answer) {
  throw new Error('Question answer changed from the reviewed source-supported option')
}

const previousExplanation = priorReport?.correction?.previousExplanation ?? curated[question.id]
curated[question.id] = explanation
fs.writeFileSync(curatedPath, JSON.stringify(curated, null, 2) + '\n')

const report = {
  generatedAt: new Date().toISOString(),
  exam: 'JLPT N3 July 2012',
  scope: 'Reading Mondai 4, printed question 24 (internal question 59).',
  sourcePdf: {
    title: '3. N3 7-2012.pdf',
    url: `${sourcePdfUrl}#page=7`,
    driveFileId: '11YNc2TftE52Ow9f1q3HCrVz5rkbGt9gR',
    renderedPage: 7,
    visualReview:
      'Chrome/PDF viewer page 7 displays the passage about sushi chef Hayashi and all four options. The passage describes the “three days, three months, three years” proverb and his view after passing three years.',
  },
  answerReference: {
    officialKeyEstablished: false,
    basis:
      'The source passage and the four printed options support option 3; no official JLPT answer key was established in this review.',
  },
  answerKeysChanged: 0,
  correction: {
    questionId: question.id,
    previousExplanation,
    answer,
    selectedOption: question.options[answer - 1],
    explanation,
    issue: 'The previous explanation referred to toy repair, which belongs to a different reading passage.',
    explanationScope:
      'Concise reading explanation and translation; no extended distractor analysis, consistent with the requested reading-section scope.',
  },
}
fs.writeFileSync(reportPath, JSON.stringify(report, null, 2) + '\n')
console.log(`Reviewed ${question.id}; wrote ${reportPath}`)
