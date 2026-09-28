import fs from 'node:fs'
import path from 'node:path'

const root = path.resolve('.')
const dataPath = path.join(root, 'data/jlpt_full_master.json')
const reportPath = path.join(root, 'reports/n3-quality-audit/grammar-section-mirror-normalization-review.json')
const exams = JSON.parse(fs.readFileSync(dataPath, 'utf8'))
const corrections = [
  {
    examId: 'cm2u2xg4300wm134izpbjrysi-grammar-reading',
    sourceExamId: 'toan-n3-202012-full',
    questionNumber: 48,
    field: 'question',
    from: '急に出勤（ ）」',
    to: '急に出勤（ ）んだ。」',
    reason: 'The standalone copy omitted んだ after the answer blank, unlike the matching full-exam question.',
  },
  {
    examId: 'cm2u2xg4300wm134izpbjrysi-grammar-reading',
    sourceExamId: 'toan-n3-202012-full',
    questionNumber: 55,
    field: 'passage',
    from: '並んで待つ気持ちが少わかりました',
    fromPattern: '並んで\\s*待つ気持ちが少\\s*[。．.・…]*\\s*わかりました',
    to: '並んで待つ気持ちが少しわかりました',
    reason:
      'The standalone passage omitted し from 少し, producing malformed Japanese and preventing passage matching.',
  },
  {
    examId: 'cm2u2xkhj00zx134iasxlu6kb-grammar-reading',
    sourceExamId: 'toan-n3-202107-full',
    questionNumber: 45,
    field: 'question',
    from: 'こんかいの大会',
    to: '今回の大会',
    reason:
      'The standalone copy uses hiragana where the matching full-exam source uses 今回; normalized text then matches exactly.',
  },
  {
    examId: 'cm2u2xosv0138134ib0bvpy32-grammar-reading',
    sourceExamId: 'toan-n3-202112-full',
    questionNumber: 40,
    field: 'question',
    from: 'びつくりする',
    to: 'びっくりする',
    reason: 'The standalone copy has a small-tsu transcription error in びっくり.',
  },
  {
    examId: 'cm2u2xosv0138134ib0bvpy32-grammar-reading',
    sourceExamId: 'toan-n3-202112-full',
    questionNumber: 46,
    field: 'option:0',
    from: 'でしよう',
    to: 'でしょう',
    reason: 'The first answer choice confuses small ょ with よ.',
  },
]

function partQuestions(exam) {
  return (exam?.parts || []).flatMap((part) => (part.questions || []).map((question) => ({ part, question })))
}

for (const correction of corrections) {
  const exam = exams.find((entry) => entry.id === correction.examId)
  const target = partQuestions(exam).find(({ question }) => Number(question.number) === correction.questionNumber)
  if (!target) throw new Error(`Missing ${correction.examId} question ${correction.questionNumber}`)
  const { question, part } = target
  if (correction.field === 'question') {
    let changed = false
    for (const field of ['question', 'sentence', 'text']) {
      const current = question[field]
      if (typeof current !== 'string' || current.includes(correction.to)) continue
      const sourcePattern = correction.fromPattern ? new RegExp(correction.fromPattern, 'u') : null
      if (sourcePattern ? sourcePattern.test(current) : current.includes(correction.from)) {
        question[field] = sourcePattern
          ? current.replace(sourcePattern, correction.to)
          : current.replace(correction.from, correction.to)
        changed = true
      }
    }
    if (
      !changed &&
      !['question', 'sentence', 'text'].some((field) => String(question[field] || '').includes(correction.to))
    ) {
      throw new Error(`Expected source text not found in ${correction.examId} question ${correction.questionNumber}`)
    }
    continue
  }
  let container
  let current
  if (correction.field === 'passage') {
    container = part
    current = part.passage || ''
  } else if (correction.field.startsWith('option:')) {
    const optionIndex = Number(correction.field.split(':')[1])
    container = question.options[optionIndex]
    current = typeof container === 'string' ? container : container?.text
  } else {
    container = question
    current = question[correction.field] || ''
  }
  if (current.includes(correction.to)) continue
  const sourcePattern = correction.fromPattern ? new RegExp(correction.fromPattern, 'u') : null
  if (sourcePattern ? !sourcePattern.test(current) : !current.includes(correction.from)) {
    throw new Error(`Expected source text not found in ${correction.examId} question ${correction.questionNumber}`)
  }
  const next = sourcePattern
    ? current.replace(sourcePattern, correction.to)
    : current.replace(correction.from, correction.to)
  if (correction.field === 'passage') part.passage = next
  else if (correction.field.startsWith('option:')) {
    if (typeof container === 'string') question.options[Number(correction.field.split(':')[1])] = next
    else container.text = next
  } else question[correction.field] = next
}

fs.writeFileSync(dataPath, `${JSON.stringify(exams, null, 2)}\n`, 'utf8')
fs.mkdirSync(path.dirname(reportPath), { recursive: true })
fs.writeFileSync(
  reportPath,
  `${JSON.stringify(
    {
      generatedAt: new Date().toISOString(),
      method:
        'Section-copy transcription fixes were checked against the corresponding full-exam data already stored in the repository; this is not an official JLPT PDF confirmation.',
      corrections,
    },
    null,
    2
  )}\n`,
  'utf8'
)
console.log(JSON.stringify({ updated: corrections.length, reportPath }, null, 2))
