import assert from 'node:assert/strict'
import fs from 'node:fs'

const mockPath = 'data/jlpt_n3_toan_master.json'
const sectionPath = 'data/jlpt_full_master.json'
const curatedPath = 'data/jlpt_n3_explanations_curated.json'
const reportPath = 'reports/n3-quality-audit/grammar-2020-12-m1-section-review.json'
const fullExamId = 'toan-n3-202012-full'
const sectionExamId = 'cm2u2xg4300wm134izpbjrysi-grammar-reading'
const rows = [
  { number: 44, answer: 4 },
  { number: 45, answer: 1 },
  { number: 48, answer: 1 },
]

const readJson = (file) => JSON.parse(fs.readFileSync(file, 'utf8'))
const cleanOption = (option) => {
  const value = typeof option === 'object' && option ? option.text : option
  return String(value)
    .normalize('NFKC')
    .replace(/^\s*[1-4][.)．、\s　]*/u, '')
    .trim()
}
const getQuestions = (exam) => exam.parts.flatMap((part) => part.questions || [])
const mockExams = readJson(mockPath)
const sectionText = fs.readFileSync(sectionPath, 'utf8')
const sectionLineEnding = sectionText.includes('\r\n') ? '\r\n' : '\n'
const sectionExams = JSON.parse(sectionText)
const curated = readJson(curatedPath)
const fullExam = mockExams.find((exam) => exam.id === fullExamId)
const sectionExam = sectionExams.find((exam) => exam.id === sectionExamId)
assert.ok(fullExam, `Missing source exam ${fullExamId}`)
assert.ok(sectionExam, `Missing standalone exam ${sectionExamId}`)
const mockQuestions = getQuestions(fullExam)
const sectionQuestions = getQuestions(sectionExam)

for (const row of rows) {
  const source = mockQuestions.find((question) => Number(question.number) === row.number)
  const section = sectionQuestions.find((question) => Number(question.number) === row.number)
  assert.ok(source && section, `Question ${row.number} is missing from one of the exam records`)
  assert.equal(Number(source.correctAnswer ?? source.answer), row.answer, `Unexpected source key at ${row.number}`)
  assert.equal(Number(section.correctAnswer ?? section.answer), row.answer, `Unexpected section key at ${row.number}`)
  assert.deepEqual(section.options.map(cleanOption), source.options.map(cleanOption), `Option mismatch at ${row.number}`)
  assert.ok(source.explanation?.includes('Dịch:'), `Source explanation lacks a translation at ${row.number}`)
  for (let choice = 1; choice <= 4; choice++) {
    assert.match(source.explanation, new RegExp(`^${choice}\\.`, 'mu'), `Source explanation misses option ${choice} at ${row.number}`)
  }

  section.explanation = source.explanation
  if (row.number === 44) {
    assert.match(source.question, /フライパン/u, 'Full mock should retain the correct pan transcription.')
    section.question = section.question.replaceAll('フライバン', 'フライパン')
    section.sentence = section.sentence.replaceAll('フライバン', 'フライパン')
    assert.match(section.question, /フライパン/u, 'Section question should use the corrected transcription.')
  }
  curated[section.id] = source.explanation
}

fs.writeFileSync(sectionPath, `${JSON.stringify(sectionExams, null, 2)}\n`.replace(/\n/gu, sectionLineEnding), 'utf8')
fs.writeFileSync(curatedPath, `${JSON.stringify(curated, null, 2)}\n`, 'utf8')
fs.mkdirSync('reports/n3-quality-audit', { recursive: true })
fs.writeFileSync(
  reportPath,
  `${JSON.stringify(
    {
      reviewedOn: '2026-09-27',
      fullExamId,
      sectionExamId,
      questionNumbers: rows.map(({ number }) => number),
      answerKeysChanged: 0,
      rows: rows.map(({ number, answer }) => {
        const source = mockQuestions.find((question) => Number(question.number) === number)
        const section = sectionQuestions.find((question) => Number(question.number) === number)
        return {
          number,
          answer,
          sourceQuestionId: source.id,
          sectionQuestionId: section.id,
          ...(number === 44 ? { sourceTranscriptionCorrection: { from: 'フライバン', to: 'フライパン' } } : {}),
          options: section.options.map(cleanOption),
          explanation: section.explanation,
          includesTranslation: section.explanation.includes('Dịch:'),
          explainsAllChoices: [1, 2, 3, 4].every((choice) => new RegExp(`^${choice}\\.`, 'mu').test(section.explanation)),
        }
      }),
      sources: [
        {
          url: 'https://learnjapaneseaz.com/jlpt-n3-grammar-practice-test-8.html',
          notes: 'Third-party transcription lists the N3 12/2020 grammar items and answers 9 (4) and 10 (1); not an official JLPT key.',
        },
        {
          url: 'https://ahovn.net/jlpt-n3-12-2020/6/',
          notes: 'Third-party Vietnamese walkthrough identifies question 13 option 1; the page is not an official JLPT key.',
        },
        {
          url: 'https://trynihongo.com/pt/de-thi-jlpt-ngu-phap-doc-hieu-n3-thang-12-2020-q1217',
          notes: 'Independent transcription includes question 13 wording and options; it is not an official JLPT key.',
        },
      ],
      scope: 'Mirror the already-curated full-mock explanations for questions 9, 10, and 13 (internal questions 44, 45, and 48) into the standalone grammar-reading exam; correct the standalone OCR typo フライバン to フライパン against the full-mock transcription.',
    },
    null,
    2
  )}\n`,
  'utf8'
)

console.log(`Synchronized ${rows.length} section explanations; answer keys unchanged.`)
