import assert from 'node:assert/strict'
import fs from 'node:fs'

const mockPath = 'data/jlpt_n3_toan_master.json'
const sectionPath = 'data/jlpt_full_master.json'
const curatedPath = 'data/jlpt_n3_explanations_curated.json'
const reportPath = 'reports/n3-quality-audit/star-source-2016-12-m2-review.json'
const pdfUrl = 'https://drive.google.com/file/d/1ZPZIPaDo5BrgR-n0h5XUcpCOXR73Riz7/view'
const keyUrl = 'https://chuyenngoaingu.com/news/dap-an-ky-thi-jlpt-thang-12-nam-2016-201.aspx'
const expected = [
  { number: 49, printedQuestion: 14, answer: 2, order: [4, 2, 3, 1], starPosition: 1, page: 5 },
  { number: 50, printedQuestion: 15, answer: 4, order: [3, 1, 4, 2], starPosition: 2, page: 5 },
  { number: 51, printedQuestion: 16, answer: 2, order: [4, 3, 2, 1], starPosition: 2, page: 5 },
  { number: 52, printedQuestion: 17, answer: 1, order: [2, 3, 1, 4], starPosition: 2, page: 5 },
  { number: 53, printedQuestion: 18, answer: 3, order: [1, 4, 3, 2], starPosition: 2, page: 6 },
]

const mockExams = JSON.parse(fs.readFileSync(mockPath, 'utf8'))
const sectionExams = JSON.parse(fs.readFileSync(sectionPath, 'utf8'))
const curated = JSON.parse(fs.readFileSync(curatedPath, 'utf8'))
const mockExam = mockExams.find((exam) => exam.id === 'toan-n3-201612-full')
const sectionExam = sectionExams.find((exam) => exam.id === 'cm2u2wlnt0097134ira8pl9rk-grammar-reading')
assert.ok(mockExam && sectionExam, 'Could not find both December 2016 N3 grammar records.')

const allQuestions = (exam) => exam.parts.flatMap((part) => part.questions || [])
const mockByNumber = new Map(allQuestions(mockExam).map((question) => [Number(question.number), question]))
const sectionByNumber = new Map(allQuestions(sectionExam).map((question) => [Number(question.number), question]))
const normalizeOption = (option) =>
  String(typeof option === 'object' && option ? option.text : option)
    .normalize('NFKC')
    .replace(/^\s*[1-4][.．、\s　]*/u, '')
    .trim()

const questions = expected.map((item) => {
  const mockQuestion = mockByNumber.get(item.number)
  const sectionQuestion = sectionByNumber.get(item.number)
  assert.ok(mockQuestion && sectionQuestion, `Missing printed question ${item.printedQuestion}.`)
  const options = mockQuestion.options.map(normalizeOption)
  assert.equal(Number(mockQuestion.correctAnswer ?? mockQuestion.answer), item.answer)
  assert.deepEqual(mockQuestion.starCorrectOrder, item.order)
  assert.equal(mockQuestion.starPosition, item.starPosition)
  assert.equal(item.order[item.starPosition], item.answer)
  assert.equal(mockQuestion.starOrderVerified, true)
  assert.equal(mockQuestion.starPositionVerified, true)
  assert.ok(mockQuestion.starPrompt?.before && mockQuestion.starPrompt?.after)
  assert.match(mockQuestion.explanation || '', /Dịch:/u)
  for (const optionNumber of [1, 2, 3, 4]) {
    assert.match(mockQuestion.explanation, new RegExp(`^${optionNumber}\\.`, 'mu'))
  }
  assert.ok(
    mockQuestion.explanation.includes(options.join('')) || mockQuestion.explanation.includes('Câu hoàn chỉnh:'),
    `Question ${item.printedQuestion} should explain the reconstructed sentence.`
  )

  sectionQuestion.explanation = mockQuestion.explanation
  curated[sectionQuestion.id] = mockQuestion.explanation
  mockQuestion.starVerificationSources = [`${pdfUrl}#page=${item.page}`, keyUrl]
  mockQuestion.starVerificationStatus =
    item.number === 52 ? 'source-conflict-disclosed-editorial-reconstruction' : 'verified-against-source'
  mockQuestion.starVerificationNote =
    item.number === 52
      ? 'The supplied PDF supports the question layout and third blank but prints option 2 と言われた; a separate published PDF copy prints 言われた, matching the app wording. This version difference is disclosed in star-source-2016-12-q17-review.json; the listed key is nonofficial.'
      : `Compared printed question ${item.printedQuestion} on PDF page ${item.page}; the star location and the reconstructed order were checked, and the answer matches the published nonofficial table. No official JLPT key is available in the source packet.`

  return {
    printedQuestion: item.printedQuestion,
    internalQuestionNumber: item.number,
    standaloneQuestionId: sectionQuestion.id,
    fullExamQuestionId: mockQuestion.id,
    printedPage: item.page,
    options,
    answer: item.answer,
    order: item.order,
    starPosition: item.starPosition,
    completedSentence: mockQuestion.explanation.match(/Câu hoàn chỉnh: 「([^」]+)」/u)?.[1] || '',
    vietnameseTranslation: mockQuestion.explanation.match(/Dịch: “([^”]+)”/u)?.[1] || '',
    explanationCoverage: {
      answerIdentified: true,
      fullSentenceAndTranslation: true,
      roleOfEveryFragment: true,
      allFourChoicesAddressed: true,
    },
    sourceStatus: item.number === 52 ? 'source-conflict-disclosed-editorial-reconstruction' : 'verified-against-source',
    ...(item.number === 52
      ? {
          sourceConflict: {
            promptEndingAsRead: '待てって',
            option2AsPrinted: 'と言われた',
            appOption2: '言われた',
            alternatePdfOption2: '言われた',
            alternatePdfUrl: 'https://www.tiengnhatdongian.com/wp-content/uploads/2023/04/De-N3-12-2016.pdf',
            disclosurePresent: /PDF trên Google Drive.*「と言われた」/u.test(mockQuestion.explanation),
            detailReport: 'star-source-2016-12-q17-review.json',
          },
        }
      : {}),
  }
})

const report = {
  generatedAt: new Date().toISOString(),
  exam: 'JLPT N3 December 2016',
  scope: 'Grammar Mondai 2, printed questions 14–18 (internal questions 49–53).',
  sourcePdf: {
    title: '7. N3 12-2016.pdf',
    url: pdfUrl,
    printedPagesReviewed: [5, 6],
    method:
      'Reviewed the supplied PDF in Chrome, compared the printed question text and starred blank positions visually, and checked its accessible PDF text layer.',
  },
  secondaryAnswerKey: {
    url: keyUrl,
    answers: [2, 4, 2, 1, 3],
    status: 'Published reference table; not an official JLPT key.',
  },
  browserVerification: {
    browser: 'Chrome',
    route: 'http://127.0.0.1:5173/jlpt',
    mode: 'answer-study',
    result:
      'The updated question 17 explanation and source-version note rendered; no answers selected, progress remained 0/39.',
  },
  officialKeyEstablished: false,
  questions,
  remainingIssue:
    'Question 17 has an explicitly disclosed version difference: the supplied Google Drive PDF prints と言われた, while a separate published PDF copy prints 言われた, matching the app wording. The official JLPT key is not available.',
}

fs.writeFileSync(mockPath, `${JSON.stringify(mockExams, null, 2)}\n`, 'utf8')
fs.writeFileSync(sectionPath, `${JSON.stringify(sectionExams, null, 2)}\n`, 'utf8')
fs.writeFileSync(curatedPath, `${JSON.stringify(curated, null, 2)}\n`, 'utf8')
fs.mkdirSync('reports/n3-quality-audit', { recursive: true })
fs.writeFileSync(reportPath, `${JSON.stringify(report, null, 2)}\n`, 'utf8')
console.log('Synced and documented the December 2016 ★ grammar questions 14–18.')
