import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'

const examPath = path.resolve('data/jlpt_n3_toan_master.json')
const fullMasterPath = path.resolve('data/jlpt_full_master.json')
const curatedPath = path.resolve('data/jlpt_n3_explanations_curated.json')
const reportPath = path.resolve('reports/n3-quality-audit/star-source-2018-07-review.json')
const examId = 'toan-n3-201807-full'
const fullExamId = 'cm2u2wyk900j8134i65mmhnr8-grammar-reading'
const sourcePdfUrl = 'https://drive.google.com/file/d/1dGoaVmeSyblxeUaTrAEhbqnf1zlf7C8M/view'
const answerKeyUrl = 'https://drive.google.com/file/d/1Lmr3LwhnS3lEv4FYemiM0f93Qg5DLNZL/view#page=17'

const expected = [
  {
    printedQuestion: 14,
    id: 'toan_q_2018_07_49',
    number: 49,
    options: ['で', '人生', 'にとって', 'いちばん大切'],
    order: [3, 2, 1, 4],
    answer: 1,
    sentence: '私にとって人生でいちばん大切なのは、家族の幸せだ。',
    translation: 'Điều quan trọng nhất trong cuộc đời đối với tôi là hạnh phúc của gia đình.',
    optionNotes: [
      '「で」 theo sau 「人生」 để giới hạn phạm vi “trong cuộc đời”; đây là mảnh ở ô ★.',
      '「人生」 theo sau 「私にとって」 và đứng trước 「で」 để tạo cụm 「人生で」.',
      '「にとって」 theo sau 「私」, nêu góc nhìn “đối với tôi”.',
      '「いちばん大切」 đứng trước 「なのは」 để nêu điều được xem là quan trọng nhất.',
    ],
  },
  {
    printedQuestion: 15,
    id: 'toan_q_2018_07_50',
    number: 50,
    options: ['見ても', '何度も', '見たけれど', '何度'],
    order: [2, 3, 4, 1],
    answer: 4,
    sentence: 'この映画は昔から大好きで今まで何度も見たけれど、何度見ても感動して泣いてしまう。',
    translation:
      'Tôi rất thích bộ phim này từ lâu và đã xem nhiều lần, nhưng xem bao nhiêu lần tôi vẫn cảm động đến phát khóc.',
    optionNotes: [
      '「見ても」 theo sau 「何度」 để tạo mẫu 「何度見ても」, nghĩa là “dù xem bao nhiêu lần”.',
      '「何度も」 theo sau 「今まで」, diễn tả đã xem nhiều lần.',
      '「見たけれど」 nối việc đã xem nhiều lần với ý tương phản ở vế sau.',
      '「何度」 mở cụm 「何度見ても」; đây là mảnh ở ô ★.',
    ],
  },
  {
    printedQuestion: 16,
    id: 'toan_q_2018_07_51',
    number: 51,
    options: ['ある', '大通り側に', 'せいで', '車の音が'],
    order: [2, 1, 3, 4],
    answer: 3,
    sentence:
      '新しい家は、駅に近くて便利なのだが、窓が大通り側にあるせいで、車の音が聞こえてきて、うるさいと感じることがある。',
    translation:
      'Ngôi nhà mới gần ga và tiện lợi, nhưng vì cửa sổ hướng ra đường lớn nên đôi khi nghe tiếng xe và cảm thấy ồn.',
    optionNotes: [
      '「ある」 hoàn tất vị ngữ 「窓が大通り側にある」.',
      '「大通り側に」 nêu vị trí của cửa sổ và phải đứng trước 「ある」.',
      '「せいで」 nối nguyên nhân bất lợi với kết quả; đây là mảnh ở ô ★.',
      '「車の音が」 mở mệnh đề kết quả, làm chủ thể của 「聞こえてきて」.',
    ],
  },
  {
    printedQuestion: 17,
    id: 'toan_q_2018_07_52',
    number: 52,
    options: ['作る', 'ほど', 'ハンバーグ', 'おいしい'],
    standalonePrompt:
      '林さんの奥さんは料理がとても上手で、ハンバーグが特においしいらしい。林さんは奥さんの ___ ___ _★_ ___ ものはないとよく言っている。',
    order: [1, 3, 2, 4],
    answer: 2,
    sentence:
      '林さんの奥さんは料理がとても上手で、ハンバーグが特においしいらしい。林さんは奥さんの作るハンバーグほどおいしいものはないとよく言っている。',
    translation: 'Ông Hayashi thường nói rằng không có món nào ngon bằng hamburger do vợ ông làm.',
    optionNotes: [
      '「作る」 bổ nghĩa cho danh từ theo sau trong cụm 「奥さんの作るハンバーグ」.',
      '「ほど」 theo sau cụm so sánh và tạo cấu trúc 「Aほどおいしいものはない」; đây là mảnh ở ô ★.',
      '「ハンバーグ」 là món ăn do 「奥さんの作る」 bổ nghĩa, rồi được đem ra so sánh.',
      '「おいしい」 đứng trước 「ものはない」, khép ý “không có món nào ngon đến mức ấy”.',
    ],
  },
  {
    printedQuestion: 18,
    id: 'toan_q_2018_07_53',
    number: 53,
    options: ['食事をするたび', '妻との初めてのデートで', '来たとき', 'このレストランで'],
    order: [4, 1, 2, 3],
    answer: 2,
    sentence: 'このレストランで食事をするたび、妻との初めてのデートで来たときのことを思い出す。',
    translation: 'Mỗi lần ăn ở nhà hàng này, tôi lại nhớ đến lần mình đến đây trong buổi hẹn đầu tiên với vợ.',
    optionNotes: [
      '「食事をするたび」 theo sau địa điểm, nghĩa là “mỗi lần ăn”.',
      '「妻との初めてのデートで」 bổ nghĩa cho 「来たとき」, nêu lần đến nhà hàng trong buổi hẹn đầu tiên; đây là mảnh ở ô ★.',
      '「来たとき」 khép cụm chỉ kỷ niệm trước 「のこと」.',
      '「このレストランで」 là địa điểm cho hành động 「食事をする」.',
    ],
  },
]

const normalize = (value) =>
  String(typeof value === 'string' ? value : value?.text || '')
    .normalize('NFKC')
    .replace(/^\s*[1-4][.．、]\s*/u, '')
    .replace(/^\s*[1-4]\s+/u, '')
    .replace(/\s+/gu, '')
    .trim()
const normalizeSentence = (value) => normalize(value).replace(/[、。,.，]/gu, '')

const exams = JSON.parse(fs.readFileSync(examPath, 'utf8'))
const fullMaster = JSON.parse(fs.readFileSync(fullMasterPath, 'utf8'))
const curated = JSON.parse(fs.readFileSync(curatedPath, 'utf8'))
const exam = exams.find((item) => item.id === examId)
assert.ok(exam, `Could not find ${examId}`)
const grammarPart = exam.parts.find((part) => part.title.includes('Ngữ pháp') && part.title.includes('Mondai 2'))
assert.ok(grammarPart, 'Could not find the full-exam star-order grammar part')
const fullExam = fullMaster.find((item) => item.id === fullExamId)
assert.ok(fullExam, `Could not find ${fullExamId}`)
const fullGrammarPart = fullExam.parts.find((part) => part.title === 'Mondai 2')
assert.ok(fullGrammarPart, 'Could not find the standalone star-order grammar part')

const reportQuestions = expected.map((item) => {
  const question = grammarPart.questions.find((entry) => entry.id === item.id)
  const fullQuestion = fullGrammarPart.questions.find((entry) => entry.number === item.number)
  assert.ok(question, `Could not find ${item.id}`)
  assert.ok(fullQuestion, `Could not find standalone question ${item.number}`)

  assert.deepEqual(
    question.options.map(normalize),
    item.options.map(normalize),
    `Question ${item.printedQuestion} options differ from the visually checked source`
  )
  assert.deepEqual(question.starCorrectOrder, item.order, `Question ${item.printedQuestion} order changed`)
  assert.equal(
    Number(question.correctAnswer ?? question.answer),
    item.answer,
    `Question ${item.printedQuestion} answer changed`
  )
  assert.equal(Number(question.starPosition), 2, `Question ${item.printedQuestion} ★ is not in the third slot`)

  const explanationBase = String(question.explanation || '')
    .split('Vị trí từng mảnh:')[0]
    .trim()
  const placementNotes = item.optionNotes.map((note, index) => `${index + 1}. ${note}`).join('\n')
  const explanation = `${explanationBase}\n\nVị trí từng mảnh:\n${placementNotes}`
  assert.ok(
    normalizeSentence(explanation).includes(normalizeSentence(item.sentence)),
    `Question ${item.printedQuestion} explanation is missing the full sentence`
  )
  assert.ok(
    explanation.includes(item.translation),
    `Question ${item.printedQuestion} explanation is missing the translation`
  )
  assert.ok(
    item.optionNotes.every((note) => note.length > 20),
    `Question ${item.printedQuestion} needs notes for all four fragments`
  )
  fullQuestion.options = item.options.map((text, index) => ({
    ...(fullQuestion.options[index] || {}),
    id: String(index + 1),
    text,
  }))
  if (item.standalonePrompt) {
    fullQuestion.question = item.standalonePrompt
    fullQuestion.sentence = item.standalonePrompt
    fullQuestion.prompt = item.standalonePrompt
    assert.equal(fullQuestion.question, item.standalonePrompt)
    assert.equal(fullQuestion.sentence, item.standalonePrompt)
    assert.equal(fullQuestion.prompt, item.standalonePrompt)
  }
  fullQuestion.correctAnswer = String(item.answer)
  fullQuestion.answer = String(item.answer)
  fullQuestion.starCorrectOrder = item.order
  fullQuestion.starPosition = 2
  fullQuestion.starOrderVerified = true
  fullQuestion.starPositionVerified = true
  fullQuestion.starVerificationStatus = 'verified-against-source'
  fullQuestion.starVerificationSources = [
    ...new Set([sourcePdfUrl, answerKeyUrl, ...(fullQuestion.starVerificationSources || [])]),
  ]
  fullQuestion.starVerificationNote =
    'The original exam PDF was visually checked on viewer/printed page 5 at 50% zoom. All five ★ marks are in the third of four slots. The answer compilation on page 17 agrees with the reconstructed orders, but it has not been authenticated as an official JLPT key.'
  fullQuestion.starAnswerKeyConflict = null
  fullQuestion.script = item.order
    .map((optionNumber, position) => {
      const text = item.options[optionNumber - 1]
      return position === 2 ? `<u>${text}</u>` : text
    })
    .join(' ')
  fullQuestion.explanation = explanation
  question.explanation = explanation
  curated[item.id] = explanation

  question.starOrderVerified = true
  question.starPositionVerified = true
  question.starVerificationStatus = 'verified-against-source'
  question.starVerificationSources = [
    ...new Set([sourcePdfUrl, answerKeyUrl, ...(question.starVerificationSources || [])]),
  ]
  question.starVerificationNote =
    'The original exam PDF was visually checked on viewer/printed page 5. All five ★ marks are in the third slot. The page-17 answer compilation agrees with each reconstructed sentence, but it is a secondary reference and has not been authenticated as an official JLPT key.'
  question.starAnswerKeyConflict = null

  return {
    printedQuestion: item.printedQuestion,
    fullExamQuestionId: question.id,
    standaloneQuestionId: fullQuestion.id,
    printedOptions: item.options,
    answer: item.answer,
    order: item.order,
    starPosition: 2,
    completedSentence: item.sentence,
    vietnameseTranslation: item.translation,
    optionPlacementNotes: item.optionNotes,
    displayedSolutionScript: fullQuestion.script,
    ...(item.standalonePrompt ? { standalonePrompt: item.standalonePrompt } : {}),
    status: 'verified-against-supplied-source',
    officialKeyEstablished: false,
  }
})

const report = {
  exam: 'JLPT N3 07/2018',
  sourcePdf: {
    title: '9. N3 Tháng 7 2018.pdf',
    driveFileId: '1dGoaVmeSyblxeUaTrAEhbqnf1zlf7C8M',
    url: sourcePdfUrl,
    renderedPages: [{ viewerPage: 5, printedPage: 5, printedQuestions: [14, 15, 16, 17, 18] }],
    method:
      'Visually checked viewer page 5 at 50% zoom in Chrome, which shows the complete option layout and all five ★ marks. The printed fragments and the third-slot placement were compared with the PDF text layer.',
  },
  questions: reportQuestions,
  secondaryAnswerKey: {
    title: 'ĐÁP ÁN JLPT N3 (update 26.6.2026).pdf',
    driveFileId: '1Lmr3LwhnS3lEv4FYemiM0f93Qg5DLNZL',
    url: answerKeyUrl,
    viewerPage: 17,
    section: 'JLPT N3 7/2018 — 文法・問題2',
    printedQuestions: [14, 15, 16, 17, 18],
    answers: expected.map((item) => item.answer),
    matchesStoredAnswers: true,
    authority: 'Secondary answer compilation supplied in Drive; not authenticated as an official JLPT key.',
  },
  summary:
    'The five option sets and third-slot ★ marks were visually checked against the supplied exam PDF. Reconstructed orders place answers 1–4–3–2–2 in the ★ slots and agree with the supplied secondary answer compilation on page 17. Four explanations missing from the standalone grammar-and-reading exam are now synchronized from the complete exam dataset. No official answer key was established.',
  officialKeyEstablished: false,
}

fs.mkdirSync(path.dirname(reportPath), { recursive: true })
fs.writeFileSync(examPath, `${JSON.stringify(exams, null, 2)}\n`, 'utf8')
fs.writeFileSync(fullMasterPath, `${JSON.stringify(fullMaster, null, 2)}\n`, 'utf8')
fs.writeFileSync(curatedPath, `${JSON.stringify(curated, null, 2)}\n`, 'utf8')
fs.writeFileSync(reportPath, `${JSON.stringify(report, null, 2)}\n`, 'utf8')
console.log(`Verified printed questions 14–18 against ${sourcePdfUrl}`)
