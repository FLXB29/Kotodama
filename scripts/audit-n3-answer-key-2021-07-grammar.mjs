import fs from 'node:fs'
import path from 'node:path'
import prettier from 'prettier'

const exams = JSON.parse(fs.readFileSync('data/jlpt_n3_toan_master.json', 'utf8'))
const exam = exams.find((entry) => entry.id === 'toan-n3-202107-full')
if (!exam) throw new Error('Could not find the July 2021 N3 paper.')
const standaloneExams = JSON.parse(fs.readFileSync('data/jlpt_full_master.json', 'utf8'))
const standalone = standaloneExams.find((entry) => entry.id === 'cm2u2xkhj00zx134iasxlu6kb-grammar-reading')
if (!standalone) throw new Error('Could not find the standalone July 2021 N3 grammar and reading exam.')

const questions = exam.parts
  .filter((part) => part.title.includes('Ngữ pháp') && part.title.includes('Mondai 1'))
  .flatMap((part) => part.questions)
const referenceAnswers = [3, 4, 4, 2, 1, 3, 1, 4, 3, 1, 3, 2, 2]
if (questions.length !== referenceAnswers.length) {
  throw new Error(`Expected 13 July 2021 grammar items, found ${questions.length}.`)
}

const rows = questions.map((question, index) => ({
  questionNumber: Number(question.number),
  storedAnswer: Number(question.correctAnswer ?? question.answer),
  referenceAnswer: referenceAnswers[index],
  choices: question.options,
  answerMatchesReference: Number(question.correctAnswer ?? question.answer) === referenceAnswers[index],
}))
const changed = rows.filter((row) => !row.answerMatchesReference)
if (changed.length) {
  throw new Error(
    `Stored July 2021 answers differ from the reference key at: ${changed.map((row) => row.questionNumber).join(', ')}`
  )
}
const standaloneQuestions = standalone.parts
  .filter((part) => part.title.includes('Mondai 1'))
  .flatMap((part) => part.questions || [])
if (standaloneQuestions.length !== referenceAnswers.length) {
  throw new Error(`Expected 13 standalone July 2021 grammar items, found ${standaloneQuestions.length}.`)
}
const standaloneMatches = standaloneQuestions.every(
  (question, index) => Number(question.correctAnswer ?? question.answer) === referenceAnswers[index]
)
if (!standaloneMatches) throw new Error('The standalone July 2021 answer sequence differs from the reviewed key.')
const q45 = questions.find((question) => Number(question.number) === 45)
if (!q45?.options[2]?.includes('優勝するに違いない')) {
  throw new Error('Question 45 choice 3 has not been restored to the transcribed source wording.')
}

const report = {
  generatedAt: new Date().toISOString(),
  examId: exam.id,
  scope: 'Grammar Mondai 1, 13 items, questions 36–48.',
  method:
    'All 13 stored answers match the published reference sequence and were checked against the Japanese sentence context. Reference keys are not official JLPT answer sheets.',
  sources: [
    {
      name: 'TryNihongo reference answer key',
      url: 'https://trynihongo.com/hi/jlpt-n3-parakashha-utatara-jalii-2021-p450',
      qualification: 'Publishes the full N3 reference sequence, including grammar Mondai 1: 3 4 4 2 1 3 1 4 3 1 3 2 2.',
    },
    {
      name: 'TryNihongo question transcription',
      url: 'https://trynihongo.com/ja/ri-ben-yu-neng-li-shi-yan-jlptwen-fa-du-jie-n3-2021nian-7yue-shi-yan-q1226',
      qualification:
        'Cross-checks grammar sentence wording and confirms choice 3 in question 45 is 優勝するに違いない.',
    },
    {
      name: 'PassJapanese question transcription',
      url: 'https://passjapanese.com/vi/jlpt/n3/exam/2021-07-grammar-reading',
      qualification:
        'Cross-checks the grammar section. Its extracted question 43 repeats なりにくい for choice 4; the local choice なりやすい fits the sentence and the referenced key, so this is recorded as a transcription discrepancy in that page.',
    },
    {
      name: 'User-provided answer sheet, “ĐÁP ÁN JLPT N3 (update 26.6.2026).pdf”',
      page: 22,
      answerSequence: referenceAnswers,
      qualification:
        'The displayed answer row for JLPT N3 7/2021 matches all 13 stored grammar answers. This is a user-provided reference sheet, not an official JLPT answer notice.',
    },
  ],
  rows,
  totals: {
    questions: rows.length,
    storedMatchesReference: rows.filter((row) => row.answerMatchesReference).length,
    standaloneMatchesReference: standaloneMatches ? standaloneQuestions.length : 0,
    userProvidedAnswerSheetMatches: referenceAnswers.length,
  },
  officialAnswerPdfConfirmed: false,
  transcriptionCorrections: [
    {
      questionNumber: 37,
      view: 'Full mock',
      choice: 3,
      before: 'ようやくか',
      after: 'ようやく',
      evidence: 'The original question PDF prints ようやく without the trailing か.',
    },
    {
      questionNumber: 38,
      view: 'Standalone section',
      choice: 1,
      before: '対して',
      after: 'に対して',
      evidence: 'The original question PDF prints に対して.',
    },
    {
      questionNumber: 40,
      view: 'Full mock',
      choice: 2,
      before: 'まで',
      after: 'ままで',
      evidence: 'The original question PDF prints ままで.',
    },
    {
      questionNumber: 40,
      view: 'Full mock',
      choice: 3,
      before: '間だからが',
      after: '間だから',
      evidence: 'The original question PDF prints 間だから; the extra が was introduced in the mock transcription.',
    },
    {
      questionNumber: 40,
      view: 'Standalone section',
      before: 'この図書館はは',
      after: 'この図書館は',
      evidence: 'The PDF has one は; the duplicate was in the standalone transcription.',
    },
    {
      questionNumber: 41,
      view: 'Full mock',
      choice: 1,
      before: 'ときでも',
      after: '何とか',
      evidence: 'The original question PDF prints 何とか.',
    },
    {
      questionNumber: 41,
      view: 'Full mock',
      choice: 4,
      before: 'なんでも',
      after: '何でも',
      evidence: 'The original question PDF prints 何でも.',
    },
    {
      questionNumber: 41,
      view: 'Full mock',
      before: 'きれいなんだろう。',
      after: 'きれいなんだろうか。',
      evidence: 'The original question PDF ends the exclamation with なんだろうか.',
    },
    {
      questionNumber: 42,
      view: 'Full mock',
      before: '絵がかざられるので',
      after: '絵がかざれるので',
      evidence: 'The original question PDF prints かざれる.',
    },
    {
      questionNumber: 44,
      view: 'Full mock',
      before: '隣に立っていた人',
      after: '隣に立っている人',
      evidence: 'The original question PDF uses 立っている.',
    },
    {
      questionNumber: 45,
      view: 'Both',
      before: '国際大会出の',
      after: '国際大会での',
      evidence:
        'The PDF appears to print 出の; the app corrects the obvious particle/character typo so the sentence reads naturally.',
    },
    {
      questionNumber: 46,
      view: 'Full mock',
      choice: 4,
      before: 'しなきゃなる',
      after: 'しなきゃ',
      evidence: 'The original question PDF prints only しなきゃ.',
    },
    {
      questionNumber: 47,
      view: 'Standalone section',
      before: '昨日がどうも',
      after: '昨日はどうも',
      evidence: 'The original question PDF prints 昨日はどうも.',
    },
    {
      questionNumber: 47,
      view: 'Full mock',
      before: 'おいしい物をたくさん',
      after: 'おいしい食べ物をたくさん',
      evidence: 'The original question PDF prints おいしい食べ物をたくさん.',
    },
    {
      questionNumber: 48,
      view: 'Both',
      choice: 1,
      before: '出るつもりかもしれない (one mock copy also had a stray trailing う)',
      after: '出すつもりかもしれない',
      evidence: 'The original question PDF prints 出すつもりかもしれない.',
    },
    {
      questionNumber: 48,
      view: 'Standalone section',
      choice: 4,
      before: '行出なくてもよさそうだ',
      after: '出なくてもよさそうだ',
      evidence: 'The original question PDF prints 出なくてもよさそうだ.',
    },
  ],
}

const reportPath = 'reports/n3-quality-audit/answer-key-2021-07-grammar.json'
fs.mkdirSync(path.dirname(reportPath), { recursive: true })
const prettierConfig = (await prettier.resolveConfig(reportPath)) ?? {}
fs.writeFileSync(reportPath, await prettier.format(JSON.stringify(report), { ...prettierConfig, filepath: reportPath }))
console.log(
  JSON.stringify(
    { reportPath, totals: report.totals, transcriptionCorrections: report.transcriptionCorrections },
    null,
    2
  )
)
