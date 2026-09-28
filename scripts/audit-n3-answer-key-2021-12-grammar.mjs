import fs from 'node:fs'
import path from 'node:path'
import prettier from 'prettier'

const fullExams = JSON.parse(fs.readFileSync('data/jlpt_n3_toan_master.json', 'utf8'))
const standaloneExams = JSON.parse(fs.readFileSync('data/jlpt_full_master.json', 'utf8'))
const exam = fullExams.find((entry) => entry.id === 'toan-n3-202112-full')
const standalone = standaloneExams.find((entry) => entry.id === 'cm2u2xosv0138134ib0bvpy32-grammar-reading')
if (!exam) throw new Error('Could not find the December 2021 N3 paper.')
if (!standalone) throw new Error('Could not find the standalone December 2021 N3 grammar-reading exam.')

const questions = exam.parts
  .filter((part) => part.title.includes('Ngữ pháp') && part.title.includes('Mondai 1'))
  .flatMap((part) => part.questions || [])
  .sort((left, right) => Number(left.number) - Number(right.number))
const standaloneQuestions = standalone.parts
  .flatMap((part) => part.questions || [])
  .filter((question) => Number(question.number) >= 36 && Number(question.number) <= 48)
  .sort((left, right) => Number(left.number) - Number(right.number))
const answerSheetSequence = [3, 4, 2, 4, 1, 2, 4, 1, 2, 2, 4, 1, 4]
const questionNumbers = Array.from({ length: 13 }, (_, index) => index + 36)
if (questions.length !== answerSheetSequence.length || standaloneQuestions.length !== answerSheetSequence.length) {
  throw new Error(
    `Expected 13 December 2021 grammar items in both views; found ${questions.length} and ${standaloneQuestions.length}.`
  )
}

const rows = questions.map((question, index) => {
  const standaloneQuestion = standaloneQuestions[index]
  const storedAnswer = Number(question.correctAnswer ?? question.answer)
  const standaloneAnswer = Number(standaloneQuestion.correctAnswer ?? standaloneQuestion.answer)
  return {
    questionNumber: Number(question.number),
    storedAnswer,
    standaloneAnswer,
    userSheetAnswer: answerSheetSequence[index],
    choices: question.options,
    fullMockMatchesSheet: storedAnswer === answerSheetSequence[index],
    standaloneMatchesSheet: standaloneAnswer === answerSheetSequence[index],
  }
})
if (rows.some((row, index) => row.questionNumber !== questionNumbers[index])) {
  throw new Error('The December 2021 grammar questions are missing or out of order.')
}
const mismatches = rows.filter((row) => !row.fullMockMatchesSheet || !row.standaloneMatchesSheet)
if (mismatches.length) {
  throw new Error(
    `Stored answers differ from the user-provided answer sheet at: ${mismatches.map((row) => row.questionNumber).join(', ')}`
  )
}

const question41 = questions.find((question) => Number(question.number) === 41)
const question41Text = `${question41?.question || ''} ${question41?.sentence || ''}`
if (!question41?.options?.some((option) => option.includes('使い')) || !question41Text.includes('続けている')) {
  throw new Error('Question 41 must use the corrected Japanese form 使い続けている.')
}

const report = {
  generatedAt: new Date().toISOString(),
  examId: exam.id,
  standaloneExamId: standalone.id,
  scope: 'Grammar Mondai 1, 13 questions numbered 36–48.',
  method:
    'Compared both app exam views with the original question PDF and the user-provided answer sheet, then checked each answer against its Japanese sentence and options. The supplied answer sheet is a reference, not an official JLPT answer notice; this review covers only these 13 grammar questions.',
  sources: [
    {
      name: 'User-provided question PDF, “12. N3 12-2021.pdf”',
      pages: [7, 8],
      qualification: 'Read directly in the connected Google Drive viewer; used to verify wording and choices.',
    },
    {
      name: 'User-provided answer sheet, “ĐÁP ÁN JLPT N3 (update 26.6.2026).pdf”',
      page: 23,
      answerSequence: answerSheetSequence,
      qualification:
        'The 12/2021 grammar Mondai 1 row matches both app views; this is not an official JLPT answer notice.',
    },
    {
      name: 'TryNihongo question transcription',
      url: 'https://trynihongo.com/en/jlpt-grammar-reading-comprehension-n3-test-december-2021-q1314',
      qualification:
        'Additional transcription cross-check; the original PDF remains the primary wording source for this audit.',
    },
    {
      name: 'Uno Japano reference answers',
      url: 'https://unojapano.com/jlpt-december-2021-n3-answers/',
      qualification: 'An unofficial answer reference; not used as proof of an official JLPT key.',
    },
  ],
  rows,
  totals: {
    questions: rows.length,
    fullMockMatchesUserSheet: rows.filter((row) => row.fullMockMatchesSheet).length,
    standaloneMatchesUserSheet: rows.filter((row) => row.standaloneMatchesSheet).length,
  },
  officialAnswerPdfConfirmed: false,
  sourceCorrections: [
    {
      questionNumber: 41,
      sourcePdfPrint: '使い続いている',
      learnerFacingText: '使い続けている',
      reason:
        'The printed form is ungrammatical for the intended “continue using” meaning. 「使い＋続ける」 forms 「使い続ける」; the app preserves the intended answer while documenting the source discrepancy.',
    },
  ],
  interpretationNotes: [
    {
      questionNumber: 42,
      note: '「こと」 can nominalize an event; it is described as less idiomatic than 「の」 for a directly perceived action, rather than being labeled universally ungrammatical.',
    },
    {
      questionNumber: 46,
      answerSheetChoice: 4,
      note: '「できるでしょうね」 is grammatical as a prediction. The answer sheet selects 「みたいだ」, which better fits the dialogue as sharing a new piece of information. The item has some pragmatic ambiguity, so the explanation records that choice 1 is not ungrammatical in every context.',
    },
  ],
}

const reportPath = 'reports/n3-quality-audit/answer-key-2021-12-grammar.json'
fs.mkdirSync(path.dirname(reportPath), { recursive: true })
const prettierConfig = (await prettier.resolveConfig(reportPath)) ?? {}
fs.writeFileSync(reportPath, await prettier.format(JSON.stringify(report), { ...prettierConfig, filepath: reportPath }))
console.log(JSON.stringify({ reportPath, totals: report.totals }, null, 2))
