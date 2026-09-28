import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = fileURLToPath(new URL('../', import.meta.url))
const dataFile = path.join(root, 'data/jlpt_n3_toan_master.json')
const reportFile = path.join(root, 'reports/n3-quality-audit/duplicate-option-source-review.json')
const exams = JSON.parse(fs.readFileSync(dataFile, 'utf8').replace(/^\uFEFF/, ''))

const fixes = [
  {
    id: 'toan_q_2023_12_68',
    answer: 2,
    optionIndex: 2,
    before: '仕事や子供の世話で忙しかったから',
    after: '「私」のオートバイを妻が使っていたから',
    source: '14. N3 12-2023.pdf',
    page: 21,
    evidence: 'Choice 3 states 「私」のオートバイを妻が使っていたから; choice 2 remains 仕事や子供の世話で忙しかったから.',
  },
  {
    id: 'toan_q_2022_07_13',
    answer: 3,
    optionIndex: 3,
    before: '4 図面',
    after: '4 図画',
    source: '13. N3 7-2022.pdf',
    page: 2,
    evidence: 'Choice 4 is 図画; choice 2 is 図面 and choice 3 絵画 is the answer.',
  },
  {
    id: 'toan_q_2019_12_84',
    answer: 4,
    optionIndex: 1,
    before: '3.　24時間利用できる ',
    after: '2.　かりた本を家にとどけてくれる',
    source: '10. N3 12-2019.pdf',
    page: 16,
    evidence: 'Mondai 2 Q4 choice 2 is かりた本を家にとどけてくれる; choice 3 is 24時間利用できる.',
  },
  {
    id: 'toan_q_2019_07_12',
    answer: 2,
    optionIndex: 3,
    before: '４．道具',
    after: '４．道貝',
    source: '10. N3 7-2019.pdf',
    page: 1,
    evidence: 'Question 12 choices read 道具, 家具, 家貝, 道貝 in order.',
  },
  {
    id: 'toan_q_2015_12_78',
    answer: 3,
    optionIndex: 3,
    before: 'テーブルの上をかたづける',
    after: 'しょっきを洗う',
    source: '6. N3 12-2015.pdf',
    page: 16,
    evidence: 'Mondai 1 Q4 choice 4 is しょっきを洗う; choice 3 is テーブルの上をかたづける.',
  },
  {
    id: 'toan_q_2015_07_58',
    answer: 2,
    optionIndex: 3,
    before: '4.大好きだという点です',
    after: '4.大好きそうな点です',
    source: '6. N3 7-2015.pdf',
    page: 6,
    evidence: 'The source page prints choice 4 大好きそうな点です.',
  },
  {
    id: 'toan_q_2015_07_62',
    answer: 4,
    optionIndex: 2,
    before: '相手が聞きたくなるような話をする',
    after: '相手に自分のことを多く話すようにする',
    source: '6. N3 7-2015.pdf',
    page: 9,
    evidence: 'Reading Q27 choice 3 is 相手に自分のことを多く話すようにする; choice 4 is 相手にたくさん話してもらうようにする.',
  },
  {
    id: 'toan_q_2014_12_12',
    answer: 2,
    optionIndex: 3,
    before: '4.雑誌',
    after: '4.雑志',
    source: '5. N3 12-2014.pdf',
    page: 1,
    evidence: 'Question 12 choices read 稚志, 雑誌, 稚誌, 雑志 in order.',
  },
  {
    id: 'toan_q_2014_12_82',
    answer: 4,
    optionIndex: 3,
    before: ' アルバイトをしていたから',
    after: '友だちとご飯を食べていたから',
    source: '5. N3 12-2014.pdf',
    page: 16,
    evidence: 'Mondai 2 Q2 choice 4 is 友だちとご飯を食べていたから; choice 3 is アルバイトをしていたから.',
  },
  {
    id: 'toan_q_2013_12_71',
    answer: 1,
    optionIndex: 2,
    before: 'コンピューターで、距離と時間から適当な速度を計算する訓練',
    after: 'コンピューターが計算して決めた速度を守って、時刻表の通りに運転する訓練',
    source: '4. N3 12-2013.pdf',
    page: 14,
    evidence: 'Reading Q36 choice 3 is コンピューターが計算して決めた速度を守って、時刻表の通りに運転する訓練; choice 2 is the computer calculating speed from distance and time.',
  },
]

const index = new Map()
for (const exam of exams) {
  for (const part of exam.parts || []) {
    for (const question of part.questions || []) {
      if (index.has(question.id)) throw new Error(`Duplicate question id in source data: ${question.id}`)
      index.set(question.id, question)
    }
  }
}

let changed = 0
for (const fix of fixes) {
  const question = index.get(fix.id)
  if (!question) throw new Error(`Question not found: ${fix.id}`)
  if ((question.correctAnswer ?? question.answer) !== fix.answer) {
    throw new Error(`Unexpected answer key for ${fix.id}; expected ${fix.answer}`)
  }
  const current = question.options?.[fix.optionIndex]
  if (current === fix.after) continue
  if (current !== fix.before) {
    throw new Error(`Unexpected option ${fix.optionIndex + 1} for ${fix.id}: ${JSON.stringify(current)}`)
  }
  question.options[fix.optionIndex] = fix.after
  changed += 1
}

fs.writeFileSync(dataFile, `${JSON.stringify(exams, null, 2)}\n`)
fs.mkdirSync(path.dirname(reportFile), { recursive: true })
fs.writeFileSync(
  reportFile,
  `${JSON.stringify(
    {
      generatedAt: new Date().toISOString(),
      method: 'Manual comparison against the named original exam PDF, page, and printed question. The correct answer key was checked and left unchanged.',
      changed,
      verifiedQuestions: fixes.map((fix) => ({
        questionId: fix.id,
        correctAnswerPreserved: fix.answer,
        optionNumber: fix.optionIndex + 1,
        previousText: fix.before,
        sourceText: fix.after,
        sourceFile: fix.source,
        sourcePage: fix.page,
        evidence: fix.evidence,
      })),
    },
    null,
    2
  )}\n`
)
console.log(JSON.stringify({ changed, reviewed: fixes.length, reportFile }, null, 2))
