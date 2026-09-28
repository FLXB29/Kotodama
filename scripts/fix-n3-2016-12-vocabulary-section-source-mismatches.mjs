import fs from 'node:fs'
import path from 'node:path'

const masterPath = path.resolve('data/jlpt_full_master.json')
const reportPath = path.resolve('reports/n3-quality-audit/vocabulary-section-source-2016-12-review.json')
let rawMaster = fs.readFileSync(masterPath, 'utf8')
let fullMaster = JSON.parse(rawMaster)
const sectionExam = fullMaster.find((exam) => exam.id === 'cm2u2wlnt0097134ira8pl9rk-vocab')
if (!sectionExam) throw new Error('Could not find the December 2016 vocabulary section exam.')

const expectedAfter = {
  11: { answer: '3', options: ['満続', '万続', '満足', '万足'] },
  16: {
    answer: '4',
    prompt: '佐藤さんには、おとなしい( )があるが、本当は活動的な人らしい。',
    options: ['ヒント', 'タイトル', 'アイディア', 'イメージ'],
  },
  21: { answer: '2', options: ['様子', '姿勢', '印象', '間隔'] },
  30: {
    answer: '2',
    prompt: 'ここは<u>横断禁止</u>です。',
    options: ['座ってはいけません', '渡ってはいけません', '走ってはいけません', '入ってはいけません'],
  },
}

const patchObject = (questionId, number, oldValues, replacements) => {
  const question = sectionExam.parts.flatMap((part) => part.questions || []).find((item) => item.id === questionId)
  if (!question || Number(question.number) !== number) throw new Error(`Could not find section question ${number}.`)
  const currentOptions = question.options.map((option) => option.text)
  const after = expectedAfter[number]
  if (
    String(question.correctAnswer ?? question.answer) === after.answer &&
    currentOptions.join('|') === after.options.join('|') &&
    (!after.prompt || question.question === after.prompt)
  ) {
    return
  }
  if (
    String(question.correctAnswer ?? question.answer) !== oldValues.answer ||
    currentOptions.join('|') !== oldValues.options.join('|') ||
    (oldValues.prompt && question.question !== oldValues.prompt)
  ) {
    throw new Error(`Unexpected existing section data for question ${number}; refusing to overwrite it.`)
  }

  const marker = `"id": "${questionId}"`
  const start = rawMaster.indexOf(marker)
  const end = rawMaster.indexOf('"score": 1', start)
  if (start < 0 || end < 0) throw new Error(`Could not locate the serialized question ${number}.`)
  let chunk = rawMaster.slice(start, end)
  for (const [from, to] of replacements) {
    const first = chunk.indexOf(from)
    if (first < 0 || chunk.indexOf(from, first + from.length) !== -1) {
      throw new Error(`Expected one exact source string in question ${number}: ${from}`)
    }
    chunk = `${chunk.slice(0, first)}${to}${chunk.slice(first + from.length)}`
  }
  rawMaster = `${rawMaster.slice(0, start)}${chunk}${rawMaster.slice(end)}`
  fullMaster = JSON.parse(rawMaster)
}

patchObject('cm2u2wlzy009k134ix5q88wlv', 11, { answer: '3', options: ['満続', '万族', '満足', '万足'] }, [
  ['"text": "万族"', '"text": "万続"'],
])
patchObject(
  'cm2u2wm8z009q134ihlh5unx8',
  16,
  {
    answer: '4',
    prompt: '依さんには、おとなしい( )があるが、本当は活動的な人らしい。',
    options: ['ヒント', 'タイル', 'アイディア', 'イメージ'],
  },
  [
    [
      '"question": "依さんには、おとなしい( )があるが、本当は活動的な人らしい。"',
      '"question": "佐藤さんには、おとなしい( )があるが、本当は活動的な人らしい。"',
    ],
    [
      '"sentence": "依さんには、おとなしい( )があるが、本当は活動的な人らしい。"',
      '"sentence": "佐藤さんには、おとなしい( )があるが、本当は活動的な人らしい。"',
    ],
    ['"text": "タイル"', '"text": "タイトル"'],
  ]
)
patchObject('cm2u2wm90009v134i6hf0rvt6', 21, { answer: '2', options: ['様子', '姿勢', '印象', '閲隔'] }, [
  ['"text": "閲隔"', '"text": "間隔"'],
])
patchObject(
  'cm2u2wmhk00a5134iawoie1x4',
  30,
  {
    answer: '3',
    prompt: 'ここは<u>横断禁止</u>です。',
    options: ['座ってはいけません', '走ってはいけません', '渡ってはいけません', '入ってはいけません'],
  },
  [
    ['"text": "走ってはいけません"', '"text": "__OPTION_2__"'],
    ['"text": "渡ってはいけません"', '"text": "走ってはいけません"'],
    ['"text": "__OPTION_2__"', '"text": "渡ってはいけません"'],
    ['"answer": "3"', '"answer": "2"'],
    ['"correctAnswer": "3"', '"correctAnswer": "2"'],
  ]
)

const verifiedMaster = JSON.parse(rawMaster)
const verifiedSection = verifiedMaster.find((exam) => exam.id === sectionExam.id)
for (const [number, expected] of Object.entries(expectedAfter)) {
  const question = verifiedSection.parts
    .flatMap((part) => part.questions || [])
    .find((item) => item.number === Number(number))
  if (
    !question ||
    String(question.correctAnswer ?? question.answer) !== expected.answer ||
    question.options.map((option) => option.text).join('|') !== expected.options.join('|') ||
    (expected.prompt && question.question !== expected.prompt)
  ) {
    throw new Error(`The section question ${number} did not reach its expected source-aligned state.`)
  }
}
fs.writeFileSync(masterPath, rawMaster, 'utf8')

const report = {
  generatedAt: new Date().toISOString(),
  examId: sectionExam.id,
  sourcePdf: { driveFile: '7. N3 12-2016.pdf', printedPages: [2, 3], observed: true },
  corrections: [
    { questionNumber: 11, field: 'option 2', before: '万族', after: '万続', answer: 3 },
    {
      questionNumber: 16,
      field: 'prompt and option 2',
      before: ['依さん', 'タイル'],
      after: ['佐藤さん', 'タイトル'],
      answer: 4,
    },
    { questionNumber: 21, field: 'option 4', before: '閲隔', after: '間隔', answer: 2 },
    {
      questionNumber: 30,
      field: 'options 2–3 and answer key',
      before: ['走ってはいけません', '渡ってはいけません'],
      after: ['渡ってはいけません', '走ってはいけません'],
      answerBefore: 3,
      answerAfter: 2,
    },
  ],
  explanationDelivery:
    'After source alignment, the section questions match the corresponding full-exam prompts, ordered options and answer keys; the service can attach their curated explanations.',
  limitation:
    'The exam PDF has no official answer key; the question wording and options were visually checked, while the answer keys remain sourced from the local exam dataset and language analysis.',
}
fs.mkdirSync(path.dirname(reportPath), { recursive: true })
fs.writeFileSync(reportPath, `${JSON.stringify(report, null, 2)}\n`, 'utf8')
console.log(
  'Aligned December 2016 vocabulary section questions 11, 16, 21 and 30 with the PDF-checked full exam so the correct explanations attach.'
)
