import fs from 'node:fs'

const examFile = 'data/jlpt_n3_toan_master.json'
const reportFile = 'reports/n3-quality-audit/answer-key-2025-07-grammar.json'
const exams = JSON.parse(fs.readFileSync(examFile, 'utf8'))
const exam = exams.find((entry) => entry.id === 'toan-n3-202507-full')
if (!exam) throw new Error('Could not find the July 2025 N3 paper.')

const questions = exam.parts
  .filter((part) => part.title.includes('Ngữ pháp'))
  .flatMap((part) => part.questions)
  .filter((question) => Number(question.number) >= 36 && Number(question.number) <= 48)
  .sort((a, b) => Number(a.number) - Number(b.number))

const reviewedAnswers = [3, 1, 3, 4, 2, 4, 1, 2, 3, 2, 1, 3, 4]
const tryNihongoAnswers = [3, 1, 3, 4, 2, 4, 1, 2, 3, 2, 3, 3, 4]
const xgxeduAnswers = [2, 3, 1, 3, 4, 2, 4, 1, 2, 3, 2, 3, 4]
const njlptCenterAnswerText = [
  'から',
  'によって',
  '引っ越すか',
  '確かに',
  'うちに',
  'ばかり',
  'したくて',
  'あげたら',
  '待ってく',
  '晴れるといいね',
  'ご参加になれます',
  '見えなくなってしまった',
  'のんだ方がいい',
]
if (questions.length !== 13) throw new Error(`Expected 13 grammar questions, found ${questions.length}.`)

const rows = questions.map((question, index) => ({
  questionNumber: Number(question.number),
  optionKey: index + 1,
  storedAnswer: question.correctAnswer ?? question.answer,
  reviewedAnswer: reviewedAnswers[index],
  tryNihongoReference: tryNihongoAnswers[index],
  xgxeduReference: xgxeduAnswers[index],
  njlptCenterAnswerText: njlptCenterAnswerText[index],
  choices: question.options,
  answerMatchesReviewed: Number(question.correctAnswer ?? question.answer) === reviewedAnswers[index],
  answerMatchesTryNihongo: Number(question.correctAnswer ?? question.answer) === tryNihongoAnswers[index],
  answerMatchesXgxedu: Number(question.correctAnswer ?? question.answer) === xgxeduAnswers[index],
}))

const report = {
  generatedAt: new Date().toISOString(),
  examId: exam.id,
  scope: 'Grammar Mondai 1, question numbers 36–48.',
  method:
    'Compares the stored key with two published reference keys and an editorially checked key; neither published reference is an official JLPT answer sheet. Disagreements are reported, never auto-corrected.',
  sources: [
    {
      name: 'TryNihongo',
      url: 'https://trynihongo.com/en/jlpt-n3-exam-answers-july-2025-p1177',
      qualification:
        'Reference answers; its answer for question 46 differs from the key supported by the option wording and a third published text-answer source.',
    },
    {
      name: 'Xgxedu / 新干线日语',
      url: 'https://www.xgxedu.com/html/kszx/6736.html',
      qualification:
        'The page explicitly says answers are for reference only. Its whole grammar sequence differs from the other checked sequence, so treat it as a possible version/key mismatch.',
    },
    {
      name: 'NJLPT Center',
      url: 'https://njlptcenter.wordpress.com/2025/07/07/jlpt-n3-answer-2025-7-grammar/',
      qualification: 'Publishes answer text; for question 46 it identifies ご参加になれます (option 1).',
    },
    {
      name: 'PassJapanese',
      url: 'https://passjapanese.com/ja/jlpt/n3/exam/2025-07-grammar-reading',
      qualification:
        'Cross-check of the question wording, order, and choice surfaces; this page does not publish an answer key in the extracted content.',
    },
  ],
  question46Decision:
    'Keep option 1: ご参加になれます is the respectful potential form in a city notice telling residents they may attend. TryNihongo lists option 3, Xgxedu lists option 2, and NJLPT Center lists the text of option 1. This item remains source-disputed pending an original answer sheet.',
  otherDisagreements: [
    {
      questionNumber: 38,
      decision:
        'Keep option 3 引っ越すって. This is the colloquial quotation marker required before この前言ってた; NJLPT Center lists 引っ越すか, which does not fit that reported-speech frame.',
    },
    {
      questionNumber: 39,
      decision:
        'Keep option 4 どちらかというと as the best fit for the explicit preference contrast. NJLPT Center lists 確かに, which remains possible in some conversational readings, so mark the item ambiguous until an original answer sheet is checked.',
    },
    {
      questionNumber: 44,
      decision:
        'The stored option 3 is 持ってく. NJLPT Center prints 待ってく, which means “wait”; treat that as a likely transcription typo because TryNihongo agrees with option 3 and the question asks the speaker to bring the book to school.',
    },
  ],
  rows,
  totals: {
    storedKeyMatchesReviewed: rows.filter((row) => row.answerMatchesReviewed).length,
    storedKeyMatchesTryNihongo: rows.filter((row) => row.answerMatchesTryNihongo).length,
    storedKeyMatchesXgxedu: rows.filter((row) => row.answerMatchesXgxedu).length,
    storedAnswersWithTextSupportFromNjlptCenter: [0, 1, 4, 5, 6, 7, 9, 10, 11, 12].length,
  },
}

const changed = rows.filter((row) => !row.answerMatchesReviewed)
if (changed.length) {
  throw new Error(
    `Stored July 2025 answers differ from the reviewed key at: ${changed.map((row) => row.questionNumber).join(', ')}`
  )
}
fs.mkdirSync('reports/n3-quality-audit', { recursive: true })
fs.writeFileSync(reportFile, `${JSON.stringify(report, null, 2)}\n`)
console.log(
  JSON.stringify(
    {
      reportFile,
      totals: report.totals,
      sourceDisagreements: rows
        .filter((row) => !row.answerMatchesTryNihongo || !row.answerMatchesXgxedu)
        .map(({ questionNumber, storedAnswer, tryNihongoReference, xgxeduReference }) => ({
          questionNumber,
          storedAnswer,
          tryNihongoReference,
          xgxeduReference,
        })),
    },
    null,
    2
  )
)
