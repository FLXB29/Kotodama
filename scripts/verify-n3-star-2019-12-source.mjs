import fs from 'node:fs'
import path from 'node:path'

const examPath = path.resolve('data/jlpt_n3_toan_master.json')
const reportPath = path.resolve('reports/n3-quality-audit/star-source-2019-12-review.json')
const exams = JSON.parse(fs.readFileSync(examPath, 'utf8'))
const exam = exams.find((item) => item.id === 'toan-n3-201912-full')
if (!exam) throw new Error('Could not find JLPT N3 December 2019 exam.')

const reviewedQuestions = [
  {
    printedQuestion: 14,
    id: 'toan_q_2019_12_49',
    options: ['1 と', '2 車を', '3 ので', '4 使わせてほしい'],
    answer: 4,
    order: [3, 2, 4, 1],
    sentence: '昨日父に、来週友達と旅行に行くので車を使わせてほしいと頼んだが、断られてしまった。',
  },
  {
    printedQuestion: 15,
    id: 'toan_q_2019_12_50',
    options: ['1 に対する', '2 の', '3 考え方', '4 働くこと'],
    answer: 1,
    order: [2, 4, 1, 3],
    sentence: '桜大学は学生の働くことに対する考え方についてアンケート調査を行った。',
  },
  {
    printedQuestion: 16,
    id: 'toan_q_2019_12_51',
    options: ['1 ときに', '2 ばかりの', '3 白いTシャツ', '4 買った'],
    answer: 2,
    order: [1, 4, 2, 3],
    sentence: '食事のときに買ったばかりの白いTシャツを汚してしまった。',
  },
  {
    printedQuestion: 17,
    id: 'toan_q_2019_12_52',
    options: ['1 わからなくて', '2 どの電車で', '3 一番早く着くのか', '4 行けば'],
    answer: 3,
    order: [2, 4, 3, 1],
    sentence:
      '昨日初めて花川駅に行った。花川駅までどの電車で行けば一番早く着くのかわからなくて、電車に乗る前に駅員に聞いた。',
    note:
      'The PDF prints 「一番早く着くのか」. The existing data used the kana spelling 「いちばん」; it was standardized to the printed kanji form. The ★ third slot is option 3 in order 2→4→3→1.',
  },
  {
    printedQuestion: 18,
    id: 'toan_q_2019_12_53',
    options: ['1 もし', '2 乗せていってあげる', '3 行くんだったら', '4 行くつもりだから'],
    answer: 3,
    order: [4, 1, 3, 2],
    sentence: '私、車で行くつもりだから、もし行くんだったら乗せていってあげる。',
    note:
      'The four printed fragments match. OCR had attached the printed page number to option 4; it is not part of the fragment. The ★ third slot is option 3 in order 4→1→3→2.',
  },
]

const sourceUrl = 'https://drive.google.com/file/d/1UNA2Sm0KwwFWSZ8JI226j4HV4PQEzAOb/view#page=6'
const normalize = (value) =>
  String(value || '')
    .normalize('NFKC')
    .replace(/^\s*[1-4][.．、\s　]*/u, '')
    .replace(/\s+/gu, '')
    .trim()
const allQuestions = exam.parts.flatMap((part) => part.questions || [])

for (const reviewed of reviewedQuestions) {
  const target = allQuestions.find((item) => item.id === reviewed.id)
  if (!target) throw new Error(`Could not find printed ★ question ${reviewed.printedQuestion}.`)

  if (reviewed.printedQuestion === 17) {
    const current = normalize(target.options?.[2])
    if (current !== normalize('3 いちばん早く着くのか') && current !== normalize(reviewed.options[2])) {
      throw new Error('Question 17 differs beyond the known kana/kanji spelling; refusing to overwrite it.')
    }
    target.options[2] = '3.一番早く着くのか'
  }

  const actual = (target.options || []).map(normalize)
  const expected = reviewed.options.map(normalize)
  if (
    actual.length !== expected.length ||
    actual.some((option, index) => option !== expected[index]) ||
    JSON.stringify(target.starCorrectOrder) !== JSON.stringify(reviewed.order) ||
    Number(target.correctAnswer) !== reviewed.answer ||
    Number(target.starPosition) !== 2
  ) {
    throw new Error(
      `Printed question ${reviewed.printedQuestion} no longer matches the reviewed source; refusing to mark it verified.`,
    )
  }

  target.starOrderVerified = true
  target.starPositionVerified = true
  target.starVerificationStatus = 'verified-against-source'
  target.starVerificationSources = [sourceUrl]
  target.starVerificationNote =
    `Visually checked against page 6 of the supplied PDF in Google Drive. ${reviewed.note || 'All four fragments, their printed labels, and the ★ third slot match the rendered source page.'}`
}

const questionReports = reviewedQuestions.map((reviewed) => {
  const target = allQuestions.find((item) => item.id === reviewed.id)
  return {
    printedQuestion: reviewed.printedQuestion,
    fullExamQuestionId: target.id,
    printedOptions: reviewed.options,
    appData: {
      options: target.options,
      answer: target.correctAnswer,
      order: target.starCorrectOrder,
      starPosition: target.starPosition,
    },
    completedSentence: reviewed.sentence,
    decision:
      reviewed.note || 'The four printed fragments match; the ★ third slot and stored order place the stored answer in that slot.',
    status: 'verified-against-supplied-source',
    officialKeyEstablished: false,
  }
})

const report = {
  exam: 'JLPT N3 12/2019',
  sourcePdf: {
    title: '10. N3 12-2019.pdf',
    driveFileId: '1UNA2Sm0KwwFWSZ8JI226j4HV4PQEzAOb',
    renderedPage: 6,
    method: 'Visually checked all five ★ questions on the rendered PDF page and cross-checked the page text layer.',
  },
  questions: questionReports,
  secondaryAnswerKey: {
    title: 'ĐÁP ÁN JLPT N3 (update 26.6.2026).pdf',
    driveFileId: '1Lmr3LwhnS3lEv4FYemiM0f93Qg5DLNZL',
    renderedPage: 20,
    section: 'JLPT N3 12/2019 — 文法・問題2',
    printedQuestions: [14, 15, 16, 17, 18],
    answers: [4, 1, 2, 3, 3],
    matchesStoredAnswers: true,
    authority: 'Secondary answer compilation in the supplied Drive; not confirmed as an official JLPT key.',
  },
  summary:
    'All five stored fragment sets and ★ positions match the supplied PDF. The stored orders form grammatical sentences, place the stored answers in the printed ★ slot, and match the secondary answer compilation. Question 17 spelling was synchronized with the PDF; question 18 OCR had appended the page number to an option.',
  officialKeyEstablished: false,
}

fs.mkdirSync(path.dirname(reportPath), { recursive: true })
fs.writeFileSync(examPath, `${JSON.stringify(exams, null, 2)}\n`, 'utf8')
fs.writeFileSync(reportPath, `${JSON.stringify(report, null, 2)}\n`, 'utf8')
console.log(`Verified printed questions 14–18 against ${sourceUrl}`)
