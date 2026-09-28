import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = fileURLToPath(new URL('../', import.meta.url))
const read = (name) => JSON.parse(fs.readFileSync(path.join(root, name), 'utf8').replace(/^\uFEFF/, ''))
const write = (name, value) => fs.writeFileSync(path.join(root, name), `${JSON.stringify(value, null, 2)}\n`)

const source = {
  pdf: 'https://drive.google.com/file/d/1dGoaVmeSyblxeUaTrAEhbqnf1zlf7C8M/view',
  key: 'https://drive.google.com/file/d/1Lmr3LwhnS3lEv4FYemiM0f93Qg5DLNZL/view',
  questions: [
    {
      printedQuestion: 8,
      appNumber: 43,
      answer: 2,
      options: [
        'コピーさせるでしょうか',
        'コピーさせていただけませんか',
        'コピーしたらいかがですか',
        'コピーするのではないでしょうか',
      ],
      explanation: [
        'Đáp án 2 — 「資料をコピーさせていただけませんか」: xin phép cho tôi photo tài liệu được không? 「Vさせていただけませんか」 là cách xin phép khiêm nhường, diễn tả người nói xin nhận sự cho phép.',
        '1. コピーさせるでしょうか: “liệu sẽ cho/bắt ai đó photo không”; mang sắc thái phỏng đoán, không phải lời xin phép của người nói.',
        '2. コピーさせていただけませんか: “tôi có thể xin phép photo được không?”; đúng với lời Tanaka xin Mori cho mình dùng tài liệu.',
        '3. コピーしたらいかがですか: “sao không photo thử?”; là lời khuyên cho người nghe, khác hướng với việc Tanaka xin phép tự photo.',
        '4. コピーするのではないでしょうか: “chẳng phải sẽ photo sao?”; nêu phỏng đoán, không phải yêu cầu lịch sự.',
        'Dịch: “A: Tuần trước tôi không dự được buổi hội thảo vì đi công tác. Tôi xin photo tài liệu được không? — B: Được chứ, đây, cậu dùng đi.”',
        'Ghi nhớ: 「Vさせていただけませんか」 = xin được phép V một cách khiêm nhường.',
      ].join('\n'),
    },
    {
      printedQuestion: 9,
      appNumber: 44,
      answer: 3,
      options: ['ぐらいでも', 'ずつなら', 'までなら', 'からでも'],
    },
    {
      printedQuestion: 10,
      appNumber: 45,
      answer: 1,
      options: ['行ってみないか', '行ったらいい', '行っただろう', '行ってみて'],
    },
  ],
}

const full = read('data/jlpt_n3_toan_master.json')
const standalone = read('data/jlpt_full_master.json')
const curated = read('data/jlpt_n3_explanations_curated.json')
const fullExam = full.find((exam) => exam.id === 'toan-n3-201807-full')
const fullPart = fullExam?.parts.find((part) => part.id === 'toan_part_2018_07_m2_g1')
const standaloneExam = standalone.find((exam) => exam.id === 'cm2u2wyk900j8134i65mmhnr8-grammar-reading')
const standalonePart = standaloneExam?.parts.find((part) => part.title === 'Mondai 1')
const secondaryM1Answers = [4, 1, 2, 4, 2, 3, 3, 2, 3, 1, 4, 1, 2]

if (!fullPart || !standalonePart) throw new Error('Could not find 07/2018 grammar Mondai 1 in both datasets')

for (const [index, answer] of secondaryM1Answers.entries()) {
  const number = index + 36
  const fullQuestion = fullPart.questions.find((question) => question.number === number)
  const standaloneQuestion = standalonePart.questions.find((question) => question.number === number)
  if (!fullQuestion || !standaloneQuestion) throw new Error(`Could not find M1 question ${number}`)
  if (fullQuestion.correctAnswer !== answer || Number(standaloneQuestion.correctAnswer) !== answer)
    throw new Error(`M1 stored answer differs from the secondary reference at question ${number}`)
}

for (const item of source.questions) {
  const fullQuestion = fullPart.questions.find((question) => question.number === item.appNumber)
  const standaloneQuestion = standalonePart.questions.find((question) => question.number === item.appNumber)
  if (!fullQuestion || !standaloneQuestion) throw new Error(`Could not find question ${item.appNumber}`)
  if (fullQuestion.correctAnswer !== item.answer || Number(standaloneQuestion.correctAnswer) !== item.answer)
    throw new Error(`Stored key differs from the reviewed reference for question ${item.appNumber}`)

  fullQuestion.options = item.options.map((option, index) => `${index + 1} ${option}`)
  standaloneQuestion.options = item.options.map((option, index) => {
    const current = standaloneQuestion.options[index]
    return typeof current === 'string' ? option : { ...current, text: option }
  })

  const explanation = item.explanation || curated[fullQuestion.id]
  if (!explanation) throw new Error(`No reviewed explanation available for question ${item.appNumber}`)
  fullQuestion.explanation = explanation
  standaloneQuestion.explanation = explanation
  curated[fullQuestion.id] = explanation
}

write('data/jlpt_n3_toan_master.json', full)
write('data/jlpt_full_master.json', standalone)
write('data/jlpt_n3_explanations_curated.json', curated)

const review = {
  exam: 'JLPT N3 07/2018',
  sourcePdf: {
    url: source.pdf,
    title: '9. N3 Tháng 7 2018.pdf',
    driveFileId: '1dGoaVmeSyblxeUaTrAEhbqnf1zlf7C8M',
    renderedPages: [
      {
        viewerPage: 4,
        printedPage: 4,
        printedQuestions: [1, 2, 3, 4, 5, 6, 7, 8],
        findings:
          'Visually checked in Chrome and compared with the PDF text layer; printed question 8, app question 43, option 3 is 「コピーしたらいかがですか」.',
      },
      {
        viewerPage: 5,
        printedPage: 5,
        printedQuestions: [9, 10, 11, 12, 13, 14, 15, 16, 17, 18],
        findings:
          'Compared against the PDF text layer; question 9 option 2 is 「ずつなら」 and question 10 option 3 is 「行っただろう」.',
      },
    ],
  },
  secondaryAnswerKey: {
    url: source.key,
    driveFileId: '1Lmr3LwhnS3lEv4FYemiM0f93Qg5DLNZL',
    viewerPage: 17,
    section: 'Grammar Mondai 1, questions 1–13',
    answers: secondaryM1Answers,
    answersForReviewedQuestions: [2, 3, 1],
    allStoredAnswersMatch: true,
    matchesStoredAnswers: true,
    officialKeyEstablished: false,
  },
  questions: source.questions.map(({ printedQuestion, appNumber, answer, options }) => ({
    printedQuestion,
    appNumber,
    answer,
    options,
    fullExamQuestionId: fullPart.questions.find((question) => question.number === appNumber).id,
    standaloneQuestionId: standalonePart.questions.find((question) => question.number === appNumber).id,
  })),
  corrections: [
    'Question 43 option 3 restored from the PDF: 「コピーしたらいかがですか」; corrected the explanation to distinguish advice to the listener from asking permission for oneself.',
    'Question 44 option 2 corrected in the standalone dataset from OCR 「ずっなら」 to 「ずつなら」.',
    'Question 45 option 3 corrected in the standalone dataset by removing the stray leading period.',
    'Synchronized explanations for app questions 43–45 to both full-exam and standalone datasets.',
  ],
}
write('reports/n3-quality-audit/grammar-source-2018-07-m1-review.json', review)
console.log(
  JSON.stringify({
    output: 'reports/n3-quality-audit/grammar-source-2018-07-m1-review.json',
    reviewed: source.questions.length,
  })
)
