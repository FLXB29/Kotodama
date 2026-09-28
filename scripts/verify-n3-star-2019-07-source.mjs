import fs from 'node:fs'
import path from 'node:path'

const examPath = path.resolve('data/jlpt_n3_toan_master.json')
const reportPath = path.resolve('reports/n3-quality-audit/star-source-2019-07-review.json')
const exams = JSON.parse(fs.readFileSync(examPath, 'utf8'))
const exam = exams.find((item) => item.id === 'toan-n3-201907-full')
if (!exam) throw new Error('Could not find JLPT N3 July 2019 exam.')

const question = exam.parts.flatMap((part) => part.questions || []).find((item) => item.id === 'toan_q_2019_07_49')
if (!question) throw new Error('Could not find printed ★ question 14.')

const expectedOptions = ['1 のため', '2 による', '3 １１時開始', '4 電車の遅れ']
const reviewedQuestions = [
  {
    printedQuestion: 14,
    id: 'toan_q_2019_07_49',
    options: expectedOptions,
    answer: 1,
    order: [2, 4, 1, 3],
    starPosition: 2,
    sentence:
      'X高校とY高校のバスケットボールの試合は10時開始の予定だったが、大雨による電車の遅れのため11時開始になった。',
    note:
      'The printed option is 「１１時開始」; OCR had dropped one numeral. The ★ is over the third slot, where option 1 appears in order 2→4→1→3.',
  },
  {
    printedQuestion: 15,
    id: 'toan_q_2019_07_50',
    options: ['1 動物が', '2 なかなか', '3 動物園は', '4 見られる'],
    answer: 3,
    order: [1, 4, 3, 2],
    starPosition: 2,
    sentence:
      '昨日行った桜動物園には、500種類以上の動物がいた。あんなにいろいろな動物が見られる動物園はなかなかないだろう。',
    note: 'All four fragments, their printed labels, and the ★ third slot match the rendered source page.',
  },
  {
    printedQuestion: 16,
    id: 'toan_q_2019_07_51',
    options: ['1 今にも', '2 大学に合格したという', '3 知らせを聞いて', '4 一番行きたがっていた'],
    answer: 3,
    order: [4, 2, 3, 1],
    starPosition: 2,
    sentence:
      '母は、姉が一番行きたがっていた大学に合格したという知らせを聞いて、今にも泣きそうな顔をしていた。',
    note: 'All four fragments, their printed labels, and the ★ third slot match the rendered source page.',
  },
  {
    printedQuestion: 17,
    id: 'toan_q_2019_07_52',
    options: ['1 隣に', '2 私の家に', '3 建ったことで', '4 日が当たらなくなって'],
    answer: 2,
    order: [1, 3, 2, 4],
    starPosition: 2,
    sentence:
      '20階建ての大きいマンションが隣に建ったことで私の家に日が当たらなくなって、昼でも部屋の中が暗い。',
    note: 'All four fragments, their printed labels, and the ★ third slot match the rendered source page.',
  },
  {
    printedQuestion: 18,
    id: 'toan_q_2019_07_53',
    options: ['1 とき', '2 アルバイトしていた', '3 みたいだ', '4 コンピューター会社で'],
    answer: 2,
    order: [1, 4, 2, 3],
    starPosition: 2,
    sentence:
      '大学生のときコンピューター会社でアルバイトしていたみたいなのよ。',
    note:
      'The printed options are 「みたいだ」 and 「コンピューター会社で」; the extracted text attached the page number to option 4. The ★ is over the third slot, where option 2 appears in order 1→4→2→3.',
  },
]
const normalize = (value) =>
  String(value || '')
    .normalize('NFKC')
    .replace(/^\s*[1-4][.．、\s　]*/u, '')
    .replace(/\s+/gu, '')
    .trim()

const sourceUrl = 'https://drive.google.com/file/d/19f5O2yLHIMqb0wHquUizP2Q9uiZ7j6Vb/view#page=5'
for (const reviewed of reviewedQuestions) {
  const target = exam.parts.flatMap((part) => part.questions || []).find((item) => item.id === reviewed.id)
  if (!target) throw new Error(`Could not find printed ★ question ${reviewed.printedQuestion}.`)

  const actual = (target.options || []).map(normalize)
  const expected = reviewed.options.map(normalize)
  if (
    actual.length !== expected.length ||
    actual.some((option, index) => option !== expected[index]) ||
    JSON.stringify(target.starCorrectOrder) !== JSON.stringify(reviewed.order) ||
    Number(target.correctAnswer) !== reviewed.answer ||
    Number(target.starPosition) !== reviewed.starPosition
  ) {
    throw new Error(
      `Printed question ${reviewed.printedQuestion} no longer matches the visually reviewed source; refusing to mark it verified.`,
    )
  }

  target.starOrderVerified = true
  target.starPositionVerified = true
  target.starVerificationStatus = 'verified-against-source'
  target.starVerificationSources = [sourceUrl]
  target.starVerificationNote = `Visually checked against page 5 of the supplied PDF in Google Drive. ${reviewed.note}`
}

const verifiedQuestions = reviewedQuestions.map((reviewed) => {
  const target = exam.parts.flatMap((part) => part.questions || []).find((item) => item.id === reviewed.id)
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
    decision: reviewed.note,
    status: 'verified-against-supplied-source',
    officialKeyEstablished: false,
  }
})

const report = {
  exam: 'JLPT N3 07/2019',
  printedQuestion: 14,
  fullExamQuestionId: question.id,
  sourcePdf: {
    title: '10. N3 7-2019.pdf',
    driveFileId: '19f5O2yLHIMqb0wHquUizP2Q9uiZ7j6Vb',
    renderedPage: 5,
    method: 'Visually checked the rendered PDF page in Google Drive and cross-checked its text layer.',
    printedOptions: reviewedQuestions[0].options,
    starSlot: 3,
  },
  appData: { ...verifiedQuestions[0].appData, completedSentence: reviewedQuestions[0].sentence },
  completedSentence: reviewedQuestions[0].sentence,
  decision: verifiedQuestions[0].decision,
  status: 'verified-against-supplied-source',
  officialKeyEstablished: false,
  secondaryAnswerKey: {
    title: 'ĐÁP ÁN JLPT N3 (update 26.6.2026).pdf',
    driveFileId: '1Lmr3LwhnS3lEv4FYemiM0f93Qg5DLNZL',
    renderedPage: 19,
    section: 'JLPT N3 7/2019 — 文法・問題2',
    printedQuestions: [14, 15, 16, 17, 18],
    answers: [1, 3, 3, 2, 2],
    matchesStoredAnswers: true,
    authority: 'Secondary answer compilation in the supplied Drive; not confirmed as an official JLPT key.',
  },
  additionalQuestions: verifiedQuestions.slice(1),
}

fs.mkdirSync(path.dirname(reportPath), { recursive: true })
fs.writeFileSync(examPath, `${JSON.stringify(exams, null, 2)}\n`, 'utf8')
fs.writeFileSync(reportPath, `${JSON.stringify(report, null, 2)}\n`, 'utf8')
console.log(`Verified printed question 14 against ${sourceUrl}`)
