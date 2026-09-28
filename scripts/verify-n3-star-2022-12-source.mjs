import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'

const examPath = path.resolve('data/jlpt_n3_toan_master.json')
const fullMasterPath = path.resolve('data/jlpt_full_master.json')
const curatedPath = path.resolve('data/jlpt_n3_explanations_curated.json')
const reportPath = path.resolve('reports/n3-quality-audit/star-source-2022-12-review.json')
const examId = 'toan-n3-202212-full'
const sourceFolderUrl = 'https://drive.google.com/drive/folders/1ccBkcPviGdtm9TZZaDP0393exMAG5MDv'
const answerKeyUrl = 'https://drive.google.com/file/d/1Lmr3LwhnS3lEv4FYemiM0f93Qg5DLNZL/view#page=25'

const expected = [
  {
    printedQuestion: 14,
    id: 'toan_q_2022_12_49',
    number: 49,
    options: ['メール', 'から', 'に', 'の'],
    sectionOptions: ['1 メール', '2 から', '3 に', '4 の'],
    order: [2, 4, 1, 3],
    answer: 1,
    position: 2,
    text: 'メール',
    sentence: '留学している息子からのメールに毎日楽しく過ごしていると書かれていて安心した。',
    translation:
      'Tôi thấy yên tâm khi đọc email của con trai đang du học, trong đó viết rằng ngày nào con cũng sống vui vẻ.',
    reasoning:
      '「留学している息子」 là N trong mẫu 「Nからのメール」 (“email từ N”); tiếp theo 「に」 đánh dấu email là nơi chứa nội dung được viết. Ô ★ là mảnh thứ ba nên nhận 「メール」. Cả bốn mảnh đều cần dùng; các mảnh còn lại sai tại ★ vì chúng thuộc các vị trí đã ghi dưới đây.',
    optionNotes: [
      'メール: đứng sau 「からの」 và trước trợ từ 「に」, tạo cụm “email từ con trai đang du học”; đây là mảnh ở ô ★.',
      'から: theo sau 「留学している息子」, nêu nguồn gửi.',
      'に: theo sau 「メール」 để đánh dấu nơi chứa nội dung được viết.',
      'の: nối 「から」 với danh từ 「メール」 thành mẫu 「Nからのメール」.',
    ],
  },
  {
    printedQuestion: 15,
    id: 'toan_q_2022_12_50',
    number: 50,
    options: ['いるので', 'いる間に', '友達が', '東京に'],
    sectionOptions: ['1 いるので', '2 いる間に', '3 友達が', '4 東京に'],
    order: [3, 1, 4, 2],
    answer: 4,
    position: 2,
    text: '東京に',
    sentence: '来週から1か月間、出張で東京に行く。東京には友達がいるので、東京にいる間に一緒に食事でもしたいと思う。',
    translation:
      'Từ tuần sau, tôi sẽ đi công tác ở Tokyo trong một tháng. Vì có bạn ở Tokyo, tôi muốn cùng bạn đi ăn trong khoảng thời gian mình ở đó.',
    reasoning:
      '「東京には」 được nối với 「友達がいるので」 để nêu lý do; 「東京にいる間に」 chỉ khoảng thời gian muốn đi ăn cùng bạn. Ô ★ là mảnh thứ ba 「東京に」. Cả bốn mảnh đều cần dùng; ba mảnh còn lại không thể thay thế mảnh này ở ô ★.',
    optionNotes: [
      'いるので: theo sau 「友達が」 để nêu lý do có bạn ở Tokyo.',
      'いる間に: kết thúc cụm chỉ khoảng thời gian “trong lúc ở đó”.',
      '友達が: theo sau 「東京には」, nêu người bạn làm chủ thể của 「いる」.',
      '東京に: đứng trước 「いる間に」 để tạo cụm thời gian “trong lúc ở Tokyo”; đây là mảnh ở ô ★.',
    ],
  },
  {
    printedQuestion: 16,
    id: 'toan_q_2022_12_51',
    number: 51,
    options: ['1年前に習い始めたのだが', '弾くほど', '弾けば', '弾けるようになりたくて'],
    sectionOptions: ['1. 1年前に習い始めたのだが', '2. 弾くほど', '3. 弾けば', '4. 弾けるようになりたくて'],
    order: [4, 1, 3, 2],
    answer: 3,
    position: 2,
    text: '弾けば',
    sentence:
      'バイオリンが弾けるようになりたくて1年前に習い始めたのだが、弾けば弾くほどこんなに面白い楽器はないと感じる。',
    translation:
      'Tôi bắt đầu học violin cách đây một năm vì muốn chơi được; càng chơi, tôi càng thấy chưa có nhạc cụ nào thú vị như thế.',
    reasoning:
      '「バイオリンが弾けるようになりたくて」 nêu mục đích; tiếp theo là 「1年前に習い始めたのだが」. Cấu trúc 「弾けば弾くほど」 nghĩa là “càng chơi thì càng…”. Ô ★ là 「弾けば」, mảnh thứ ba. PDF in lựa chọn 1 là 「1年前に」; dấu cách trong lớp chữ là lỗi trích xuất.',
    optionNotes: [
      '1年前に習い始めたのだが: nêu thời điểm bắt đầu học và nối với vế sau bằng 「のだが」 (“nhưng…”).',
      '弾くほど: theo sau mệnh đề điều kiện 「弾けば」 để tạo mẫu 「VばVるほど」.',
      '弾けば: mở vế điều kiện trong 「弾けば弾くほど」; đây là mảnh ở ô ★.',
      '弾けるようになりたくて: nối với 「バイオリンが」 để nêu mục tiêu “muốn có thể chơi violin”.',
    ],
  },
  {
    printedQuestion: 17,
    id: 'toan_q_2022_12_52',
    number: 52,
    options: ['こういう色の', '欲しい', 'と思っていた', 'かばんが'],
    sectionOptions: ['1 こういう色の', '2 欲しい', '3 と思っていた', '4 かばんが'],
    order: [1, 4, 2, 3],
    answer: 2,
    position: 2,
    text: '欲しい',
    sentence:
      'A「お誕生日おめでとう。これ、プレゼントだよ。」B「わあ、かばんだ。ちょうどこういう色のかばんが欲しいと思っていたんだ。ありがとう。」',
    translation:
      'A: “Chúc mừng sinh nhật. Đây là quà tặng cho cậu.” B: “Ồ, là túi xách. Đúng lúc mình đang muốn một chiếc túi màu như thế này. Cảm ơn nhé.”',
    reasoning:
      '「こういう色の」 bổ nghĩa cho 「かばん」; 「かばんが欲しい」 nêu món đồ người nói mong muốn, rồi 「と思っていた」 diễn tả ý định đã có từ trước. Ô ★ là 「欲しい」, mảnh thứ ba.',
    optionNotes: [
      'こういう色の: đứng trước 「かばん」 để bổ nghĩa “màu như thế này”.',
      '欲しい: theo sau chủ ngữ 「かばんが」, nêu mong muốn; đây là mảnh ở ô ★.',
      'と思っていた: theo sau 「欲しい」, diễn tả mong muốn đã nghĩ đến từ trước.',
      'かばんが: hoàn thành cụm danh từ 「こういう色のかばん」 và làm chủ ngữ cho 「欲しい」.',
    ],
  },
  {
    printedQuestion: 18,
    id: 'toan_q_2022_12_53',
    number: 53,
    options: ['という点で', '違いは', '生活している', 'ない'],
    sectionOptions: ['1 という点で', '2 違いは', '3 生活している', '4 ない'],
    order: [3, 1, 2, 4],
    answer: 2,
    position: 2,
    text: '違いは',
    sentence: '都会と田舎には違うところも多いが、どちらも人が働き、生活しているという点で違いはない。',
    translation:
      'Thành thị và nông thôn có nhiều điểm khác nhau, nhưng xét ở điểm con người đều làm việc và sinh sống thì không có khác biệt.',
    reasoning:
      '「生活している」 nối với 「という点で」 để nêu khía cạnh so sánh; 「違いはない」 kết luận rằng không có khác biệt ở khía cạnh ấy. Ô ★ là 「違いは」, mảnh thứ ba.',
    optionNotes: [
      'という点で: theo sau mệnh đề 「人が働き、生活している」, nêu tiêu chí so sánh.',
      '違いは: mở cụm kết luận 「違いはない」; đây là mảnh ở ô ★.',
      '生活している: song song với 「働き」 để nêu việc con người sinh sống.',
      'ない: theo sau 「違いは」 để khép ý “không có khác biệt”.',
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

const exams = JSON.parse(fs.readFileSync(examPath, 'utf8'))
const fullMaster = JSON.parse(fs.readFileSync(fullMasterPath, 'utf8'))
const curated = JSON.parse(fs.readFileSync(curatedPath, 'utf8'))
const exam = exams.find((item) => item.id === examId)
assert.ok(exam, `Could not find ${examId}`)
const grammarPart = exam.parts.find((part) => part.title.includes('Ngữ pháp') && part.title.includes('Mondai 2'))
assert.ok(grammarPart, 'Could not find the star-order grammar part')
const fullExam = fullMaster.find((item) => item.id === 'cm2u2xxmo019t134izzsjxgrl-grammar-reading')
assert.ok(fullExam, 'Could not find the standalone 12/2022 grammar and reading exam')
const fullGrammarPart = fullExam.parts.find((part) => part.title === 'Mondai 2')
assert.ok(fullGrammarPart, 'Could not find the standalone star-order grammar part')

const reportQuestions = expected.map((item) => {
  const question = grammarPart.questions.find((entry) => entry.id === item.id)
  const fullQuestion = fullGrammarPart.questions.find((entry) => entry.number === item.number)
  assert.ok(question, `Could not find ${item.id}`)
  assert.ok(fullQuestion, `Could not find standalone question ${item.number}`)

  question.options = item.sectionOptions
  fullQuestion.options = item.options.map((text, index) => ({
    ...(fullQuestion.options[index] || {}),
    id: String(index + 1),
    text,
  }))
  fullQuestion.starCorrectOrder = item.order
  fullQuestion.starPosition = item.position
  fullQuestion.starOrderVerified = true
  fullQuestion.starPositionVerified = true
  fullQuestion.starVerificationStatus = 'verified-against-source'
  fullQuestion.starVerificationSources = [
    ...new Set([sourceFolderUrl, answerKeyUrl, ...(fullQuestion.starVerificationSources || [])]),
  ]
  fullQuestion.starVerificationNote =
    'Visually checked the printed fragments and ★ slot on pages 6–7 of the supplied December 2022 exam PDF. The page-25 answer compilation agrees but has not been authenticated as an official JLPT key.'
  fullQuestion.script = item.order
    .map((optionNumber, position) => {
      const text = item.options[optionNumber - 1]
      return position === item.position ? `<u>${text}</u>` : text
    })
    .join(' ')

  assert.deepEqual(
    question.options.map(normalize),
    item.options.map(normalize),
    `Question ${item.printedQuestion} options differ from the visually checked source`
  )
  assert.deepEqual(
    fullQuestion.options.map(normalize),
    item.options.map(normalize),
    `Standalone question ${item.printedQuestion} options differ from the visually checked source`
  )
  assert.deepEqual(
    question.starCorrectOrder,
    item.order,
    `Question ${item.printedQuestion} stored fragment order changed`
  )
  assert.equal(
    Number(question.correctAnswer ?? question.answer),
    item.answer,
    `Question ${item.printedQuestion} stored answer changed`
  )
  assert.equal(
    Number(question.starPosition),
    item.position,
    `Question ${item.printedQuestion} stored ★ position changed`
  )

  const explanation = [
    `Câu hoàn chỉnh: 「${item.sentence}」`,
    `Dịch: “${item.translation}”`,
    `Thứ tự mảnh: ${item.order.join(' → ')}; ô ★ ở vị trí thứ ${item.position + 1} nhận 「${item.text}」, lựa chọn ${item.answer}.`,
    item.reasoning,
    ...item.optionNotes.map((note, index) => `${index + 1}. ${note}`),
  ].join('\n')

  question.explanation = explanation
  question.starOrderVerified = true
  question.starPositionVerified = true
  question.starVerificationStatus = 'verified-against-source'
  question.starVerificationSources = [
    ...new Set([sourceFolderUrl, answerKeyUrl, ...(question.starVerificationSources || [])]),
  ]
  question.starVerificationNote = `Visually checked the printed fragments and ★ slot on pages 6–7 of the supplied December 2022 exam PDF. The answer order forms the printed sentence and places the stored answer in the printed ★ slot. The page-25 answer compilation agrees but has not been authenticated as an official JLPT key.`
  question.starAnswerKeyConflict = null

  fullQuestion.explanation = explanation
  curated[item.id] = explanation

  return {
    printedQuestion: item.printedQuestion,
    fullExamQuestionId: question.id,
    standaloneQuestionId: fullQuestion.id,
    printedOptions: item.options,
    appData: {
      options: question.options,
      answer: Number(question.correctAnswer ?? question.answer),
      order: question.starCorrectOrder,
      starPosition: question.starPosition,
    },
    displayedSolutionScript: fullQuestion.script,
    completedSentence: item.sentence,
    vietnameseTranslation: item.translation,
    starSlotReasoning: item.reasoning,
    optionPlacementNotes: item.optionNotes,
    status: 'verified-against-supplied-source',
    officialKeyEstablished: false,
  }
})

const report = {
  exam: 'JLPT N3 12/2022',
  sourcePdf: {
    title: '13. N3 12-2022 .pdf',
    driveFolderId: '1ccBkcPviGdtm9TZZaDP0393exMAG5MDv',
    driveFolderUrl: sourceFolderUrl,
    renderedPages: [
      { viewerPage: 6, printedPage: 6, printedQuestions: [14, 15, 16] },
      { viewerPage: 7, printedPage: 7, printedQuestions: [17, 18] },
    ],
    method:
      'Visually checked source pages 6 and 7 at 75% zoom, examined page 6 more closely at 200% zoom, and cross-checked the displayed PDF text layer. All five ★ marks are above the third of four answer slots.',
  },
  questions: reportQuestions,
  secondaryAnswerKey: {
    title: 'ĐÁP ÁN JLPT N3 (update 26.6.2026).pdf',
    driveFileId: '1Lmr3LwhnS3lEv4FYemiM0f93Qg5DLNZL',
    viewerPage: 25,
    section: 'JLPT N3 12/2022 — 文法・問題2',
    printedQuestions: [14, 15, 16, 17, 18],
    answers: expected.map((item) => item.answer),
    matchesStoredAnswers: true,
    authority: 'Secondary answer compilation in the supplied Drive; not authenticated as an official JLPT key.',
  },
  textLayerNotes: [
    'Question 16 option 1 visibly reads 「1年前に習い始めたのだが」; the PDF text layer separates the number and year as 「1 年前」. The source-exact option is kept with no inserted space.',
  ],
  summary:
    'All five option sets, fragment orders, and third-position ★ slots were visually checked against pages 6–7 of the supplied exam PDF. The stored answers (1–4–3–2–2) follow from the completed sentences and agree with the secondary answer compilation on page 25. That compilation has not been authenticated as an official JLPT key.',
  officialKeyEstablished: false,
}

fs.mkdirSync(path.dirname(reportPath), { recursive: true })
fs.writeFileSync(examPath, `${JSON.stringify(exams, null, 2)}\n`, 'utf8')
fs.writeFileSync(fullMasterPath, `${JSON.stringify(fullMaster, null, 2)}\n`, 'utf8')
fs.writeFileSync(curatedPath, `${JSON.stringify(curated, null, 2)}\n`, 'utf8')
fs.writeFileSync(reportPath, `${JSON.stringify(report, null, 2)}\n`, 'utf8')
console.log(`Verified printed questions 14–18 against ${sourceFolderUrl}`)
