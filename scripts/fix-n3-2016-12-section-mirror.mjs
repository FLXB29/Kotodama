import assert from 'node:assert/strict'
import fs from 'node:fs'
import prettier from 'prettier'

const fullMasterPath = 'data/jlpt_full_master.json'
const mockMasterPath = 'data/jlpt_n3_toan_master.json'
const reportPath = 'reports/n3-quality-audit/section-2016-12-review.json'
const fullMaster = JSON.parse(fs.readFileSync(fullMasterPath, 'utf8'))
const mockMaster = JSON.parse(fs.readFileSync(mockMasterPath, 'utf8'))

const vocabulary = fullMaster.find((exam) => exam.id === 'cm2u2wlnt0097134ira8pl9rk-vocab')
const grammarReading = fullMaster.find((exam) => exam.id === 'cm2u2wlnt0097134ira8pl9rk-grammar-reading')
const listening = fullMaster.find((exam) => exam.id === 'cm2u2wlnt0097134ira8pl9rk-listening')
const fullMock = mockMaster.find((exam) => exam.id === 'toan-n3-201612-full')
assert.ok(vocabulary && grammarReading && listening && fullMock, 'Could not find all December 2016 N3 exam records.')

const questionNumbers = (part) => (part.questions || []).map((question) => Number(question.number))
const rangeKey = (part) => {
  const numbers = questionNumbers(part)
  return numbers.length ? `${numbers[0]}-${numbers.at(-1)}` : `empty:${part.title}`
}
const byRange = (exam) => new Map(exam.parts.map((part) => [rangeKey(part), part]))
const vocabParts = byRange(vocabulary)
const grammarParts = byRange(grammarReading)
const listeningParts = byRange(listening)
const beforeVocabularyRanges = ['1-8', '9-14', '15-25', '26-30']
const beforeGrammarRanges = [
  '31-35',
  '36-48',
  '49-53',
  '54-58',
  '59-62',
  '63-68',
  '69-72',
  '73-74',
  'empty:Mondai 9',
  '16-19',
]
const beforeListeningRanges = ['1-6', '7-12', '13-15', '20-28']
const vocabRanges = ['1-8', '9-14', '15-25', '26-30', '31-35']
const grammarReadingRanges = ['36-48', '49-53', '54-58', '59-62', '63-68', '69-72', '73-74']
const listeningRanges = ['1-6', '7-12', '13-15', '16-19', '20-28']
const isBeforeRepair =
  JSON.stringify(vocabulary.parts.map(rangeKey)) === JSON.stringify(beforeVocabularyRanges) &&
  JSON.stringify(grammarReading.parts.map(rangeKey)) === JSON.stringify(beforeGrammarRanges) &&
  JSON.stringify(listening.parts.map(rangeKey)) === JSON.stringify(beforeListeningRanges)
const isAlreadyRepaired =
  JSON.stringify(vocabulary.parts.map(rangeKey)) === JSON.stringify(vocabRanges) &&
  JSON.stringify(grammarReading.parts.map(rangeKey)) === JSON.stringify(grammarReadingRanges) &&
  JSON.stringify(listening.parts.map(rangeKey)) === JSON.stringify(listeningRanges)
assert.ok(isBeforeRepair || isAlreadyRepaired, 'Unexpected December 2016 section ranges; refusing to rewrite data.')

const mockQuestions = new Map(
  fullMock.parts.flatMap((part) => part.questions || []).map((question) => [Number(question.number), question])
)
const optionText = (option) =>
  String(typeof option === 'object' && option ? option.text : option)
    .replace(/^\s*[1-4１-４][.．、\s　)]*/u, '')
    .trim()
const mirrorVocabularyContent = (target, source) => {
  target.options = source.options.map((option, index) => ({ id: String(index + 1), text: optionText(option) }))
  target.answer = String(source.correctAnswer ?? source.answer)
  target.correctAnswer = String(source.correctAnswer ?? source.answer)
}

// Mondai 5 vocabulary questions 31–35 were placed in the grammar-reading mirror.
// Match their answers and choices to the reviewed full-exam record before moving them.
const movedVocabulary = grammarParts.get('31-35') || vocabParts.get('31-35')
assert.ok(movedVocabulary, 'Missing the misplaced vocabulary questions 31–35.')
for (const question of movedVocabulary.questions) {
  const source = mockQuestions.get(Number(question.number))
  assert.ok(source, `Missing canonical full-exam question ${question.number}.`)
  mirrorVocabularyContent(question, source)
}

// Questions 16–19 are listening Mondai 4 and were placed in grammar-reading.
const movedListening = grammarParts.get('16-19') || listeningParts.get('16-19')
assert.ok(movedListening, 'Missing the misplaced listening questions 16–19.')
for (const question of movedListening.questions) {
  const source = mockQuestions.get(Number(question.number) + 74)
  assert.ok(source, `Missing canonical full-exam listening question ${Number(question.number) + 74}.`)
  assert.equal(Number(question.correctAnswer ?? question.answer), Number(source.correctAnswer ?? source.answer))
}

// The source listening-script PDF page 8 confirms the Japanese transcript for full-exam question 93.
const listeningQuestion93 = mockQuestions.get(93)
assert.ok(listeningQuestion93, 'Missing full-exam listening question 93.')
const oldScript = String(listeningQuestion93.script || '')
const correctScriptPhrase = '今日はあまりおなかがすいていません'
if (oldScript.includes('今日はおあまりなかがすいていません')) {
  listeningQuestion93.script = oldScript.replace('今日はおあまりなかがすいていません', correctScriptPhrase)
} else {
  assert.ok(
    oldScript.includes(correctScriptPhrase),
    'Unexpected listening question 93 script; refusing to overwrite it.'
  )
}

vocabulary.parts = [...vocabRanges].map((range) => (range === '31-35' ? movedVocabulary : vocabParts.get(range)))
grammarReading.parts = grammarReadingRanges.map((range) => grammarParts.get(range))
listening.parts = listeningRanges.map((range) => (range === '16-19' ? movedListening : listeningParts.get(range)))

for (const [index, part] of vocabulary.parts.entries()) {
  part.title = `Mondai ${index + 1}`
  part.titleJP = `第${index + 1}問`
}
for (const [index, part] of grammarReading.parts.entries()) {
  part.title = `Mondai ${index + 1}`
  part.titleJP = `第${index + 1}問`
}
for (const [index, part] of listening.parts.entries()) {
  part.title = `Mondai ${index + 1}`
  part.titleJP = `第${index + 1}問`
}

vocabulary.questionCount = vocabulary.parts.reduce((count, part) => count + part.questions.length, 0)
grammarReading.questionCount = grammarReading.parts.reduce((count, part) => count + part.questions.length, 0)
listening.questionCount = listening.parts.reduce((count, part) => count + part.questions.length, 0)

assert.equal(vocabulary.questionCount, 35)
assert.equal(grammarReading.questionCount, 39)
assert.equal(listening.questionCount, 28)
assert.deepEqual(vocabulary.parts.map(rangeKey), vocabRanges)
assert.deepEqual(grammarReading.parts.map(rangeKey), grammarReadingRanges)
assert.deepEqual(listening.parts.map(rangeKey), listeningRanges)

fs.writeFileSync(fullMasterPath, `${JSON.stringify(fullMaster, null, 2)}\n`)
fs.writeFileSync(mockMasterPath, `${JSON.stringify(mockMaster, null, 2)}\n`)
fs.mkdirSync('reports/n3-quality-audit', { recursive: true })
const report = {
  generatedAt: new Date().toISOString(),
  examId: 'cm2u2wlnt0097134ira8pl9rk',
  scope: 'Repair of the December 2016 N3 standalone section mirrors and one source-checked listening transcript typo.',
  source: {
    examPdf: {
      name: '7. N3 12-2016.pdf',
      inspectedInChrome: true,
      pages: [3, 4, 5],
      notes:
        'Printed page 3 shows vocabulary questions 31–35; printed pages 4–5 start grammar at question 36 and confirm grammar/cloze questions through 23 (global 58).',
    },
    scriptPdf: {
      name: '7. N3 12-2016 (script).pdf',
      localPath: 'data/n3_scripts/7. N3 12-2016/7. N3 12-2016 (script).pdf',
      inspectedWithPdfplumber: true,
      printedPage: 8,
      confirmedQuestionPrompts: [
        '約束の時間に少し遅れました。友達に何と言いますか。',
        '観光の案内をしています。建物を見てもらいたいです。何と言いますか。',
        '荷物を受け取ります。サインするところがわかりません。何と言いますか。',
        correctScriptPhrase + '。ご飯を普通より少なくしてほしいです。何と言いますか。',
      ],
      confirmedText: correctScriptPhrase,
    },
    listeningKeys: 'Existing answer fields were retained; script transcription review does not certify those keys.',
  },
  before: {
    vocabularyQuestionCount: 30,
    grammarReadingQuestionCount: 48,
    listeningQuestionCount: 24,
    misplacedVocabularyRange: '31-35',
    misplacedListeningRange: '16-19',
    listeningQuestion93Script: '今日はおあまりなかがすいていません',
    sectionQuestion35Option4: '第が希望の大学に合格したので、家族で外食をして慰めた。',
  },
  after: {
    vocabularyQuestionCount: vocabulary.questionCount,
    grammarReadingQuestionCount: grammarReading.questionCount,
    listeningQuestionCount: listening.questionCount,
    vocabularyRanges: vocabRanges,
    grammarReadingRanges,
    listeningRanges,
    listeningQuestion93Script: correctScriptPhrase,
    sectionQuestion35Option4: optionText(vocabulary.parts.at(-1).questions.at(-1).options[3]),
  },
  officialKeysConfirmed: false,
}
const prettierConfig = (await prettier.resolveConfig(reportPath)) || {}
const formattedReport = await prettier.format(JSON.stringify(report), {
  ...prettierConfig,
  filepath: reportPath,
})
fs.writeFileSync(reportPath, formattedReport)
console.log(
  'Repaired N3 December 2016 standalone sections: vocabulary 35, grammar/reading 39, listening 28; corrected the source-checked q93 transcript typo.'
)
