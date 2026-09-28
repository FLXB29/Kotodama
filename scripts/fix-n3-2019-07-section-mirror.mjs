import assert from 'node:assert/strict'
import fs from 'node:fs'

const fullMasterPath = 'data/jlpt_full_master.json'
const mockMasterPath = 'data/jlpt_n3_toan_master.json'
const reportPath = 'reports/n3-quality-audit/section-2019-07-review.json'

const fullMaster = JSON.parse(fs.readFileSync(fullMasterPath, 'utf8'))
const mockMaster = JSON.parse(fs.readFileSync(mockMasterPath, 'utf8'))
const vocabulary = fullMaster.find((exam) => exam.id === 'cm2u2x7h500py134iyd65aphn-vocab')
const grammarReading = fullMaster.find((exam) => exam.id === 'cm2u2x7h500py134iyd65aphn-grammar-reading')
const fullMock = mockMaster.find((exam) => exam.id === 'toan-n3-201907-full')

assert.ok(vocabulary && grammarReading && fullMock, 'Could not find all July 2019 N3 exam records.')

const questionNumbers = (part) => (part.questions || []).map((question) => Number(question.number))
const rangeKey = (part) => {
  const numbers = questionNumbers(part)
  return `${numbers[0]}-${numbers.at(-1)}`
}
const vocabRanges = ['1-8', '9-14', '15-25', '26-30', '31-35']
const grammarReadingRanges = ['36-48', '49-53', '54-58', '59-62', '63-68', '69-72', '73-74']
const allParts = [...vocabulary.parts, ...grammarReading.parts]
const partsByRange = new Map(allParts.map((part) => [rangeKey(part), part]))
const expectedRanges = [...vocabRanges, ...grammarReadingRanges]
assert.equal(partsByRange.size, allParts.length, 'Found duplicate question ranges in the sectional exams.')
assert.deepEqual(
  [...partsByRange.keys()].sort((left, right) => Number(left.split('-')[0]) - Number(right.split('-')[0])),
  [...expectedRanges].sort((left, right) => Number(left.split('-')[0]) - Number(right.split('-')[0])),
  'Unexpected question ranges; refusing to move or drop exam content.'
)

const flatten = (exam) => exam.parts.flatMap((part) => part.questions || [])
const sectionalQuestions = new Map(
  [...flatten(vocabulary), ...flatten(grammarReading)].map((question) => [Number(question.number), question])
)
const canonicalQuestions = new Map(flatten(fullMock).map((question) => [Number(question.number), question]))
for (let number = 1; number <= 74; number++) {
  assert.ok(sectionalQuestions.has(number), `Missing sectional question ${number}.`)
}

const optionText = (option) => (typeof option === 'string' ? option : String(option?.text ?? option?.value ?? ''))
const mirrorFields = (target, source, fields) => {
  for (const field of fields) {
    if (source[field] !== undefined) target[field] = source[field]
  }
}

// The supplied PDF's pages 4–5 were checked against these prompts and choices.
// The legacy section record contains a different, malformed M1 transcription.
for (let number = 36; number <= 48; number++) {
  const target = sectionalQuestions.get(number)
  const source = canonicalQuestions.get(number)
  assert.ok(source, `Missing canonical full-exam question ${number}.`)
  mirrorFields(target, source, ['question', 'sentence', 'options', 'answer', 'correctAnswer'])
}

// Keep the standalone star interaction in sync with the PDF-checked full exam.
for (let number = 49; number <= 53; number++) {
  const target = sectionalQuestions.get(number)
  const source = canonicalQuestions.get(number)
  assert.ok(source?.starPrompt, `Missing canonical star prompt for question ${number}.`)
  mirrorFields(target, source, [
    'options',
    'answer',
    'correctAnswer',
    'starPrompt',
    'starPosition',
    'starPositionVerified',
    'starOrderVerified',
    'starVerificationSources',
    'starSourceExtracted',
  ])
  target.starCorrectOrder = source.starCorrectOrder || source.starOrder
  assert.ok(Array.isArray(target.starCorrectOrder), `Missing star order for question ${number}.`)
}

// Question 30 in the PDF (global question 65) places the piano and ballet
// distractors in a different order than the stale sectional transcription.
const q65 = sectionalQuestions.get(65)
const canonicalQ65 = canonicalQuestions.get(65)
assert.ok(q65 && canonicalQ65, 'Could not locate July 2019 reading question 65.')
mirrorFields(q65, canonicalQ65, ['options', 'answer', 'correctAnswer'])

vocabulary.parts = vocabRanges.map((range) => partsByRange.get(range))
grammarReading.parts = grammarReadingRanges.map((range) => partsByRange.get(range))
vocabulary.questionCount = vocabulary.parts.reduce((count, part) => count + part.questions.length, 0)
grammarReading.questionCount = grammarReading.parts.reduce((count, part) => count + part.questions.length, 0)

for (const [index, part] of vocabulary.parts.entries()) {
  part.title = `Mondai ${index + 1}`
  part.titleJP = `第${index + 1}問`
}
for (const [index, part] of grammarReading.parts.entries()) {
  part.title = `Mondai ${index + 1}`
  part.titleJP = `第${index + 1}問`
}

assert.equal(vocabulary.questionCount, 35)
assert.equal(grammarReading.questionCount, 39)
assert.deepEqual(grammarReading.parts.map(rangeKey), grammarReadingRanges)
assert.deepEqual(vocabulary.parts.map(rangeKey), vocabRanges)

fs.writeFileSync(fullMasterPath, `${JSON.stringify(fullMaster, null, 2)}\n`)
fs.mkdirSync('reports/n3-quality-audit', { recursive: true })
const report = {
  generatedAt: new Date().toISOString(),
  examId: 'cm2u2x7h500py134iyd65aphn',
  scope: 'Repair of the July 2019 standalone N3 vocabulary and grammar-reading mirrors.',
  source: {
    name: 'User-provided source PDF: 10. N3 7-2019.pdf',
    inspectedInChrome: true,
    pages: [2, 3, 4, 5, 6, 9],
    notes:
      'Pages 2–3 show the vocabulary numbering and sections; pages 4–5 confirm grammar questions 36–48 and the ★ fragments; page 9 confirms reading question 65 option order. The grammar answer comparison also uses the nonofficial reference documented in answer-key-2019-07-grammar.json.',
  },
  before: {
    vocabularyQuestionCount: 19,
    grammarReadingQuestionCount: 55,
    vocabularyRangesInGrammarReading: ['15-25', '31-35'],
    grammarM1Answers36to48: [2, 4, 4, 1, 2, 1, 3, 2, 1, 3, 2, 3, 2],
    readingQuestion65Options: [
      'バレエ教室を探す',
      '仕事を早く終わらせる',
      'ピアノ教室を探す',
      '何かやりたいことを見つける',
    ],
  },
  after: {
    vocabularyQuestionCount: vocabulary.questionCount,
    grammarReadingQuestionCount: grammarReading.questionCount,
    vocabularyRanges: vocabRanges,
    grammarReadingRanges,
    grammarM1Answers36to48: Array.from({ length: 13 }, (_, index) =>
      Number(canonicalQuestions.get(index + 36).correctAnswer ?? canonicalQuestions.get(index + 36).answer)
    ),
    readingQuestion65Options: q65.options.map(optionText),
    starQuestions49to53UseOrderedAssembly: true,
  },
  scoringNote:
    'Grammar-reading parts 1–3 count as grammar even when the cloze part includes a shared passage; parts 4–7 count as reading.',
  correctedAnswers: [
    {
      questionNumber: 44,
      before: 1,
      after: Number(canonicalQuestions.get(44).correctAnswer ?? canonicalQuestions.get(44).answer),
      reason:
        'The legacy answer marked a distractor; the source prompt and choices match the verified full exam and nonofficial answer reference.',
    },
    {
      questionNumber: 48,
      before: 2,
      after: Number(canonicalQuestions.get(48).correctAnswer ?? canonicalQuestions.get(48).answer),
      reason: 'The legacy answer marked 使いすぎるらしい; the source sentence calls for 使いやすそうだ.',
    },
  ],
  officialKeyConfirmed: false,
}
fs.writeFileSync(reportPath, `${JSON.stringify(report, null, 2)}\n`)
console.log(
  'Repaired July 2019 N3 standalone section mapping: vocabulary 35, grammar/reading 39; synced PDF-checked grammar content and question 65 choices.'
)
