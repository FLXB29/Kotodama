import fs from 'node:fs'
import path from 'node:path'

const sectionPath = path.resolve('data/jlpt_full_master.json')
const fullPath = path.resolve('data/jlpt_n3_toan_master.json')
const reportPath = path.resolve('reports/n3-quality-audit/vocabulary-section-source-2016-12-additional-review.json')
let rawSection = fs.readFileSync(sectionPath, 'utf8')
let rawFull = fs.readFileSync(fullPath, 'utf8')
let sectionMaster = JSON.parse(rawSection)
let fullMaster = JSON.parse(rawFull)
const sectionExam = sectionMaster.find((exam) => exam.id === 'cm2u2wlnt0097134ira8pl9rk-vocab')
const fullExam = fullMaster.find((exam) => exam.id === 'toan-n3-201612-full')
if (!sectionExam || !fullExam) throw new Error('Could not find the December 2016 vocabulary datasets.')

const expected = {
  14: {
    id: 'cm2u2wlzy009n134i3un9ja6j',
    before: 'ちゃんが母親に抱かれて<u>ねむって</u>います。',
    after: '赤ちゃんが母親に抱かれて<u>ねむって</u>います。',
  },
  17: {
    id: 'cm2u2wm90009r134iw2c1p9yw',
    before: '正月には親戚が集まって、みんなでテーブルを( ), 楽しく食事をした。',
    after: '正月には親戚が集まって、みんなでテーブルを（ ）、楽しく食事をした。',
  },
  18: {
    id: 'cm2u2wm90009s134itnnhrim2',
    before: 'このレストランの料理はおいしくないので、店内はいつも(  )た。',
    after: 'このレストランの料理はおいしくないので、店内はいつも（ ）だ。',
  },
  23: {
    id: 'cm2u2wm90009x134iqtaxyukg',
    before: 'わたしのふるさとは(  )が盛んで、米や野業をたくさん作っています。',
    after: 'わたしのふるさとは（ ）が盛んで、米や野菜をたくさん作っています。',
  },
  25: {
    id: 'cm2u2wm90009z134i70wrr0s9',
    before: '.この話は誰にも言わずに、ずっと(  )にしていた。',
    after: 'この話は誰にも言わずに、ずっと（ ）にしていた。',
  },
  29: {
    id: 'cm2u2wmhk00a4134ikkso8h46',
    before: '"text": "多すぎて残りました。"',
    after: '"text": "多すぎて残りました"',
    optionOnly: true,
  },
}

const patchSectionQuestion = (number, correction) => {
  const question = sectionExam.parts.flatMap((part) => part.questions || []).find((item) => item.number === number)
  if (!question || question.id !== correction.id) throw new Error('Could not find section question ' + number + '.')
  const current = correction.optionOnly ? '"text": "' + question.options[0].text + '"' : question.question
  if (current === correction.after || current === correction.before) {
    const marker = '"id": "' + correction.id + '"'
    const start = rawSection.indexOf(marker)
    const end = rawSection.indexOf('"score": 1', start)
    if (start < 0 || end < 0) throw new Error('Could not locate serialized section question ' + number + '.')
    let chunk = rawSection.slice(start, end)
    if (correction.optionOnly) {
      if (current !== correction.after) {
        const at = chunk.indexOf(correction.before)
        if (at < 0 || chunk.indexOf(correction.before, at + correction.before.length) !== -1) {
          throw new Error('Unexpected option text in section question ' + number + '.')
        }
        chunk = chunk.slice(0, at) + correction.after + chunk.slice(at + correction.before.length)
      }
    } else if (current !== correction.after) {
      for (const field of ['question', 'sentence']) {
        const from = '"' + field + '": "' + correction.before + '"'
        const to = '"' + field + '": "' + correction.after + '"'
        const at = chunk.indexOf(from)
        if (at < 0 || chunk.indexOf(from, at + from.length) !== -1) {
          throw new Error('Unexpected ' + field + ' text in section question ' + number + '.')
        }
        chunk = chunk.slice(0, at) + to + chunk.slice(at + from.length)
      }
    }
    rawSection = rawSection.slice(0, start) + chunk + rawSection.slice(end)
    sectionMaster = JSON.parse(rawSection)
    return
  }
  throw new Error('Unexpected source prompt or option in section question ' + number + '; refusing to patch.')
}

for (const [number, correction] of Object.entries(expected)) patchSectionQuestion(Number(number), correction)

const fullQuestion25 = fullExam.parts.flatMap((part) => part.questions || []).find((item) => item.number === 25)
if (!fullQuestion25) throw new Error('Could not find full-exam question 25.')
const fullBefore = '25. この話は誰にも言わずに、ずっと（ ）していた。'
const fullAfter = '25. この話は誰にも言わずに、ずっと（ ）にしていた。'
if (fullQuestion25.question.includes(fullAfter)) {
  // Already at the PDF-verified state.
} else if (fullQuestion25.question.includes(fullBefore)) {
  const marker = '"id": "toan_q_2016_12_25"'
  const start = rawFull.indexOf(marker)
  const end = rawFull.indexOf('"scoreWeight": 1', start)
  if (start < 0 || end < 0) throw new Error('Could not locate serialized full-exam question 25.')
  let chunk = rawFull.slice(start, end)
  const from = 'ずっと（ ）していた。'
  const to = 'ずっと（ ）にしていた。'
  if (chunk.split(from).length !== 3) throw new Error('Expected question and sentence fields in full-exam question 25.')
  chunk = chunk.split(from).join(to)
  rawFull = rawFull.slice(0, start) + chunk + rawFull.slice(end)
  fullMaster = JSON.parse(rawFull)
} else {
  throw new Error('Unexpected full-exam question 25 prompt; refusing to patch.')
}

const verifiedSection = JSON.parse(rawSection).find((exam) => exam.id === sectionExam.id)
for (const [numberText, correction] of Object.entries(expected)) {
  const question = verifiedSection.parts
    .flatMap((part) => part.questions || [])
    .find((item) => item.number === Number(numberText))
  if (!question) throw new Error('Post-patch question missing: ' + numberText)
  if (correction.optionOnly) {
    if (question.options[0].text !== '多すぎて残りました')
      throw new Error('Question 29 option did not align with the source.')
  } else if (question.question !== correction.after || question.sentence !== correction.after) {
    throw new Error('Section question did not reach the expected source text: ' + numberText)
  }
}
const verifiedFull = JSON.parse(rawFull).find((exam) => exam.id === fullExam.id)
const verifiedFullQuestion25 = verifiedFull.parts
  .flatMap((part) => part.questions || [])
  .find((item) => item.number === 25)
if (!verifiedFullQuestion25.question.includes(fullAfter) || !verifiedFullQuestion25.sentence.includes(fullAfter)) {
  throw new Error('Full-exam question 25 is not aligned with the printed PDF.')
}

fs.writeFileSync(sectionPath, rawSection, 'utf8')
fs.writeFileSync(fullPath, rawFull, 'utf8')
const report = {
  generatedAt: new Date().toISOString(),
  examId: 'toan-n3-201612-full',
  sectionExamId: sectionExam.id,
  sourcePdf: {
    file: '7. N3 12-2016.pdf',
    driveUrl: 'https://drive.google.com/file/d/1ZPZIPaDo5BrgR-n0h5XUcpCOXR73Riz7/view',
    printedPages: [1, 2, 3],
    promptAndOptionDifferencesVisuallyChecked: true,
  },
  corrections: [
    {
      questionNumber: 14,
      field: 'section prompt and sentence',
      before: expected[14].before,
      after: expected[14].after,
    },
    {
      questionNumber: 17,
      field: 'section prompt and sentence punctuation',
      before: expected[17].before,
      after: expected[17].after,
    },
    {
      questionNumber: 18,
      field: 'section prompt and sentence',
      before: expected[18].before,
      after: expected[18].after,
    },
    {
      questionNumber: 23,
      field: 'section prompt and sentence',
      before: expected[23].before,
      after: expected[23].after,
    },
    {
      questionNumber: 25,
      field: 'full mock prompt and section prompt/sentence',
      before: ['ずっと（ ）していた。', expected[25].before],
      after: ['ずっと（ ）にしていた。', expected[25].after],
    },
    {
      questionNumber: 29,
      field: 'section option 1 punctuation',
      before: '多すぎて残りました。',
      after: '多すぎて残りました',
    },
  ],
  explanationDelivery:
    'After correction, all 30 section questions match their full-mock source text/options/keys closely enough for the service to attach their curated explanations.',
  limitation:
    'The question source was checked in the supplied Drive PDF. These corrections align transcribed content and do not independently certify the answer key.',
}
fs.mkdirSync(path.dirname(reportPath), { recursive: true })
fs.writeFileSync(reportPath, JSON.stringify(report, null, 2) + '\n', 'utf8')
console.log(
  'Corrected six December 2016 section-content mismatches and the missing 「に」 in full-mock question 25 using the PDF.'
)
