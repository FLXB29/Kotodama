import fs from 'node:fs'
import prettier from 'prettier'

const masterPath = 'data/jlpt_n3_toan_master.json'
const curatedPath = 'data/jlpt_n3_explanations_curated.json'
const reportPath = 'reports/n3-quality-audit/source-corrections-2022-07-review.json'
const examId = 'toan-n3-202207-full'
const exams = JSON.parse(fs.readFileSync(masterPath, 'utf8'))
const exam = exams.find((entry) => entry.id === examId)
if (!exam) throw new Error(`Could not find exam ${examId}.`)

const questions = exam.parts.flatMap((part) => part.questions || [])
const findQuestion = (number) => {
  const question = questions.find((entry) => Number(entry.number) === number)
  if (!question) throw new Error(`Could not find question ${number}.`)
  return question
}

const q44 = findQuestion(44)
for (const field of ['question', 'sentence']) {
  if (
    typeof q44[field] !== 'string' ||
    !q44[field].includes('石山「わかりました。では、またあとで') ||
    q44[field].includes('田中「わかりました。では、またあとで')
  ) {
    throw new Error(`Question 44 ${field} has not been corrected to match the source PDF.`)
  }
}

const starQuestion = findQuestion(48)
if (JSON.stringify(starQuestion.starCorrectOrder) !== JSON.stringify([3, 2, 4, 1])) {
  throw new Error('Question 48 star order did not match the source-based order reviewed in Chrome.')
}
if (![2, 4].includes(Number(starQuestion.correctAnswer ?? starQuestion.answer)) || ![1, 2].includes(starQuestion.starPosition)) {
  throw new Error('Question 48 has an unexpected key or star position; inspect it before updating.')
}

const curated = JSON.parse(fs.readFileSync(curatedPath, 'utf8'))
const sourcePdfUrl = 'https://drive.google.com/file/d/1_uKerTh0TUpMKN8gF_fsgwA5SkQs5ABu/view'
const reviewedStars = [
  { number: 48, printedNumber: 14, order: [3, 2, 4, 1], position: 1, answer: 2, page: 6 },
  { number: 49, printedNumber: 15, order: [3, 1, 2, 4], position: 2, answer: 2, page: 6 },
  { number: 50, printedNumber: 16, order: [1, 4, 3, 2], position: 2, answer: 3, page: 6 },
  { number: 51, printedNumber: 17, order: [4, 2, 1, 3], position: 2, answer: 1, page: 7 },
  { number: 52, printedNumber: 18, order: [2, 1, 4, 3], position: 2, answer: 4, page: 7 },
]
for (const row of reviewedStars) {
  const question = findQuestion(row.number)
  if (JSON.stringify(question.starCorrectOrder) !== JSON.stringify(row.order)) {
    throw new Error(`Unexpected question ${row.number} star order; inspect before updating.`)
  }
  const oldAnswer = Number(question.correctAnswer ?? question.answer)
  const oldPosition = question.starPosition
  if (row.number === 48 ? ![2, 4].includes(oldAnswer) || ![1, 2].includes(oldPosition) : oldAnswer !== row.answer || oldPosition !== row.position) {
    throw new Error(`Unexpected question ${row.number} answer or star position; inspect before updating.`)
  }
  question.answer = row.answer
  question.correctAnswer = row.answer
  question.starPosition = row.position
  question.starOrderVerified = true
  question.starPositionVerified = true
  question.starVerificationStatus = 'verified-against-source'
  question.starVerificationSources = [sourcePdfUrl]
  question.starVerificationNote =
    `Compared printed question ${row.printedNumber} on page ${row.page} of the original July 2022 PDF. The four fragments form order ${row.order.join(' → ')}; the printed ★ is at zero-based slot ${row.position}, so choice ${row.answer} belongs in the marked slot. The user-provided answer sheet page 24 also lists choice ${row.answer}; that sheet is a reference, not an official JLPT key.`
}
curated[starQuestion.id] =
  'Đáp án đúng là 2. Câu hoàn chỉnh: 「私は、森先生の授業を受けてから数学が好きになった。あの先生ほどわかりやすく教えてくれる先生はいないと思う。」 Dịch: “Từ khi học lớp của thầy/cô Mori, tôi bắt đầu thích toán. Tôi nghĩ không có giáo viên nào giảng dễ hiểu bằng thầy/cô ấy.” Thứ tự ghép là 3 → 2 → 4 → 1; dấu ★ nằm ở ô thứ hai nên điền lựa chọn 2 「先生ほど」. Lựa chọn 3 「あの」 mở đầu cụm danh từ, lựa chọn 4 「わかりやすく教えてくれる」 bổ nghĩa cho 「先生」, còn lựa chọn 1 「先生は」 nối câu với vị ngữ 「いない」; ba mảnh đó thuộc các ô còn lại, không phải đáp án của ô ★. 「Nほど～ない」 diễn tả “không có … nào bằng …”.'

const sectionExams = JSON.parse(fs.readFileSync('data/jlpt_full_master.json', 'utf8'))
const sectionExam = sectionExams.find((entry) => entry.id === 'cm2u2xt6n016j134inupqhmlp-grammar-reading')
const sectionQ48 = sectionExam?.parts.flatMap((part) => part.questions || []).find((question) => Number(question.number) === 48)
if (!sectionQ48 || sectionQ48.options?.[3]?.text !== '分かりやすく教えてくれる' && sectionQ48.options?.[3]?.text !== 'わかりやすく教えてくれる') {
  throw new Error('Unexpected standalone July 2022 question 48 option; inspect before correcting.')
}
sectionQ48.options[3].text = 'わかりやすく教えてくれる'
if (
  typeof sectionQ48.script !== 'string' ||
  (!sectionQ48.script.includes('分かりやすく教えてくれる') && !sectionQ48.script.includes('わかりやすく教えてくれる'))
) {
  throw new Error('Unexpected standalone question 48 script; inspect before correcting its source spelling.')
}
sectionQ48.script = sectionQ48.script.replace('分かりやすく教えてくれる', 'わかりやすく教えてくれる')
const sectionFormatted = await prettier.format(`${JSON.stringify(sectionExams, null, 2)}\n`, { filepath: 'data/jlpt_full_master.json' })
fs.writeFileSync('data/jlpt_full_master.json', sectionFormatted)

const sourceCorrections = []
const correctOption = (questionNumber, optionIndex, sourceText, correctedText, sourcePage) => {
  const question = findQuestion(questionNumber)
  const existing = question.options?.[optionIndex]
  if (typeof existing !== 'string') throw new Error(`Question ${questionNumber} is missing option ${optionIndex + 1}.`)
  const changed = existing === sourceText
  if (changed) question.options[optionIndex] = correctedText
  else if (existing !== correctedText) {
    throw new Error(`Question ${questionNumber} option ${optionIndex + 1} did not match the known transcription.`)
  }
  sourceCorrections.push({
    questionNumber,
    field: `options[${optionIndex + 1}]`,
    before: sourceText,
    after: correctedText,
    sourcePdfPage: sourcePage,
    changed,
  })
}

correctOption(
  62,
  1,
  '熱い飲み物を入れら、水筒が壊れてしまったこと',
  '熱い飲み物を入れたら、水筒が壊れてしまったこと',
  10
)
correctOption(
  62,
  2,
  '熱いもの飲み物が水筒から直接飲めなかったこと    熱い飲み物がすぐに冷めてしまったこと',
  '熱い飲み物が水筒から直接飲めなかったこと',
  10
)
correctOption(
  65,
  3,
  'カラスの鳴き方の違いを利用して、「東でも問題のない場所」に行かせる実験',
  'カラスの鳴き方の違いを利用して、「集まっても問題のない場所」に行かせる実験',
  11
)

const report = {
  generatedAt: new Date().toISOString(),
  examId,
  scope:
    'Source-text and answer-explanation corrections for questions 44, 48–52, 62, and 65 in the July 2022 N3 full mock.',
  sourceReview: {
    questionPaper: '13. N3 7 2022.pdf',
    printedPagesReviewed: [6, 7, 10, 11],
    answerSheet: 'ĐÁP ÁN JLPT N3 (update 26.6.2026).pdf',
    answerSheetPdfPage: 24,
    userProvidedStarAnswers: [2, 2, 3, 1, 4],
    officialAnswerKeyConfirmed: false,
  },
  corrections: [
    {
      questionNumber: 44,
      field: 'speaker label in question and sentence',
      before: '田中「わかりました。では、またあとで（　）。」',
      after: '石山「わかりました。では、またあとで（　）。」',
      sourcePdfPage: 6,
    },
    {
      questionNumber: 48,
      field: 'star answer, star position, verification metadata, and curated explanation',
      beforeAnswer: 4,
      afterAnswer: 2,
      beforeStarPositionZeroBased: 2,
      afterStarPositionZeroBased: 1,
      afterOrder: starQuestion.starCorrectOrder,
      correctAnswer: 2,
      sourcePdfPage: 6,
    },
    ...reviewedStars.slice(1).map((row) => ({
      questionNumber: row.number,
      printedQuestionNumber: row.printedNumber,
      field: 'source verification metadata',
      order: row.order,
      starPositionZeroBased: row.position,
      answer: row.answer,
      sourcePdfPage: row.page,
    })),
    {
      questionNumber: 48,
      sectionExamId: 'cm2u2xt6n016j134inupqhmlp-grammar-reading',
      field: 'option 4 and reconstructed script orthography',
      before: '分かりやすく教えてくれる',
      after: 'わかりやすく教えてくれる',
      sourcePdfPage: 6,
    },
    ...sourceCorrections,
  ],
  note: 'The question and answer-sheet PDFs were read directly in Chrome. The user-provided answer sheet is a reference and is not represented as an official JLPT key. These corrections do not certify the full exam.',
}

const formatJson = async (value, filepath) => prettier.format(`${JSON.stringify(value, null, 2)}\n`, { filepath })
fs.writeFileSync(masterPath, await formatJson(exams, masterPath))
fs.writeFileSync(curatedPath, await formatJson(curated, curatedPath))
fs.writeFileSync(reportPath, await formatJson(report, reportPath))
console.log(JSON.stringify({ reportPath, correctedQuestionNumbers: [44, 48, 62, 65] }, null, 2))
