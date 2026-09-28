import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'

const examPath = path.resolve('data/jlpt_n3_toan_master.json')
const fullMasterPath = path.resolve('data/jlpt_full_master.json')
const curatedPath = path.resolve('data/jlpt_n3_explanations_curated.json')
const reportPath = path.resolve('reports/n3-quality-audit/star-source-2020-12-review.json')
const examId = 'toan-n3-202012-full'
const sourceUrl = 'https://drive.google.com/file/d/1KkIqo10qWkUMyKJBIRrwcO2vbRd65c05/view#page=5'
const answerKeyUrl = 'https://drive.google.com/file/d/1Lmr3LwhnS3lEv4FYemiM0f93Qg5DLNZL/view#page=21'

const expected = [
  {
    printedQuestion: 14,
    id: 'toan_q_2020_12_49',
    number: 49,
    options: ['などの', 'スパゲティ', '料理も', 'だけでなく'],
    order: [4, 2, 1, 3],
    answer: 1,
    position: 2,
    text: 'などの',
    sentence: 'この喫茶店はコーヒーだけでなく、スパゲティなどの料理もおいしい。',
    translation: 'Quán cà phê này không chỉ có cà phê ngon mà các món như spaghetti cũng ngon.',
    reasoning:
      '「だけでなく」 gắn với 「コーヒー」; tiếp theo là 「スパゲティなどの料理も」. Ô ★ nằm sau 「スパゲティ」 và trước 「料理も」, nên nhận 「などの」. Trong dạng bài này cả bốn mảnh đều cần dùng; ba mảnh còn lại sai nếu đặt vào ô ★ vì chúng thuộc các vị trí đã nêu.',
    optionNotes: [
      'などの: đứng sau danh từ nêu ví dụ 「スパゲティ」 và trước danh từ khái quát 「料理」; đây là mảnh ở ô ★.',
      'スパゲティ: đứng sau 「だけでなく」, trước cụm 「などの料理」.',
      '料理も: đứng sau 「スパゲティなどの」 để khép vế bổ sung 「Bも」.',
      'だけでなく: theo ngay sau 「コーヒー」, mở cấu trúc “không chỉ A mà B cũng”.',
    ],
    note: 'Cách in trên PDF là 「スパゲティ」; đã sửa cách viết khác dấu nhỏ ッ trong dữ liệu cũ.',
  },
  {
    printedQuestion: 15,
    id: 'toan_q_2020_12_50',
    number: 50,
    options: ['しかない', 'はじまる', 'あと3分', 'まで'],
    order: [2, 4, 3, 1],
    answer: 3,
    position: 2,
    text: 'あと3分',
    sentence: '映画がはじまるまであと3分しかないよ。',
    translation: 'Chỉ còn ba phút nữa là phim bắt đầu đấy.',
    reasoning:
      '「映画が」 được nối với 「はじまるまで」, sau đó nêu thời gian còn lại 「あと3分」 và kết bằng 「しかない」. Ô ★ là mảnh thứ ba, nên đáp án là 「あと3分」. Cả bốn mảnh đều cần thiết; đặt một mảnh khác vào ★ sẽ làm đảo vị trí thời điểm, thời lượng hoặc kết cấu giới hạn.',
    optionNotes: [
      'しかない: theo sau lượng thời gian 「あと3分」, nghĩa là “chỉ còn ba phút”.',
      'はじまる: nối với chủ ngữ 「映画が」 và đứng trước 「まで」; PDF in bằng hiragana.',
      'あと3分: nêu thời lượng còn lại và đứng tại ô ★.',
      'まで: nối sự kiện phim bắt đầu với thời gian còn lại: 「はじまるまであと3分」.',
    ],
    note: 'PDF in lựa chọn 2 bằng hiragana 「はじまる」 và lựa chọn 3 là 「あと3分」; chuẩn hóa dữ liệu theo cách in.',
  },
  {
    printedQuestion: 16,
    id: 'toan_q_2020_12_51',
    number: 51,
    options: ['の', 'いい', '晴れる', 'と'],
    order: [3, 4, 2, 1],
    answer: 2,
    position: 2,
    text: 'いい',
    sentence: '今度の日曜日に友人の結婚式がある。晴れるといいのだが……',
    translation: 'Chủ nhật tới có đám cưới của bạn tôi. Mong là trời nắng, nhưng…',
    reasoning:
      '「晴れる」 đứng trước 「と」 để tạo điều kiện, rồi 「いい」 diễn tả mong ước; 「の」 theo sau trước 「だが」. Vì ô ★ là mảnh thứ ba, đáp án là 「いい」. Các mảnh còn lại đã có vị trí ngữ pháp cố định trong 「晴れるといいのだが」.',
    optionNotes: [
      'の: theo sau 「いい」, tạo 「いいのだが」 với sắc thái mong muốn còn điều băn khoăn.',
      'いい: kết hợp với 「晴れると」 thành lời mong “mong trời nắng”; đây là mảnh ở ô ★.',
      '晴れる: đứng trước 「と」 để mở cụm điều kiện.',
      'と: theo sau động từ điều kiện 「晴れる」 và trước 「いい」.',
    ],
  },
  {
    printedQuestion: 17,
    id: 'toan_q_2020_12_52',
    number: 52,
    options: ['よく言っているが', 'やっぱりサッカーが', '続けているのは', 'それでもやめずに'],
    order: [1, 4, 3, 2],
    answer: 3,
    position: 2,
    text: '続けているのは',
    sentence:
      '息子は、サッカークラブの練習がきついとよく言っているが、それでもやめずに続けているのはやっぱりサッカーが好きだからだと思う。',
    translation:
      'Con trai tôi thường nói rằng buổi tập ở câu lạc bộ bóng đá rất vất vả, nhưng vẫn không bỏ mà tiếp tục; tôi nghĩ là vì nó thích bóng đá.',
    reasoning:
      'Sau 「きついと」 là 「よく言っているが」; ý nhượng bộ 「それでもやめずに」 nối với 「続けている」. Cụm 「続けているのは」 dẫn vào nguyên nhân 「やっぱりサッカーが好きだから」 và đúng vị trí ★.',
    optionNotes: [
      'よく言っているが: hoàn thành ý “thường nói rằng… nhưng” sau 「練習がきついと」.',
      'やっぱりサッカーが: đứng trước 「好きだから」 để nêu lý do.',
      '続けているのは: mở mệnh đề “việc vẫn tiếp tục là…”; đây là mảnh ở ô ★.',
      'それでもやめずに: nối ý nhượng bộ “dù vậy vẫn không bỏ”, rồi dẫn tới 「続けている」.',
    ],
  },
  {
    printedQuestion: 18,
    id: 'toan_q_2020_12_53',
    number: 53,
    options: ['こんでいる電車は', 'よい運動になるから', '嫌いだし', '自転車で行けば'],
    order: [1, 3, 4, 2],
    answer: 4,
    position: 2,
    text: '自転車で行けば',
    sentence:
      'うちから学校まで自転車で40分かかる。電車なら20分だが、朝のこんでいる電車は嫌いだし、自転車で行けばよい運動になるから自転車で通っている。',
    translation:
      'Từ nhà đến trường đi xe đạp mất 40 phút; đi tàu thì 20 phút, nhưng tôi không thích tàu đông buổi sáng, hơn nữa đi xe đạp cũng là vận động tốt nên tôi đi học bằng xe đạp.',
    reasoning:
      '「朝の」 bổ nghĩa cho 「こんでいる電車」; tiếp theo là 「嫌いだし」 nêu một lý do. Ô ★ nhận 「自転車で行けば」, tạo điều kiện cho kết quả 「よい運動になるから」. Bản PDF xác nhận lựa chọn 2 là 「運動」; lớp chữ nhận dạng nhầm thành 「運転」 và thêm ký tự rác gần ★.',
    optionNotes: [
      'こんでいる電車は: theo sau 「朝の」, nêu chủ đề “tàu đông buổi sáng thì…”.',
      'よい運動になるから: theo sau điều kiện 「自転車で行けば」, nêu lý do đi xe đạp.',
      '嫌いだし: theo sau chủ đề tàu đông, nêu lý do thứ nhất và nối thêm lý do khác.',
      '自転車で行けば: nêu điều kiện “nếu đi xe đạp thì…”; đây là mảnh ở ô ★.',
    ],
  },
]

const normalize = (value) =>
  String(value || '')
    .normalize('NFKC')
    .replace(/^\s*[1-4][.．、\s　]*/u, '')
    .replace(/\s+/gu, '')
    .trim()

const exams = JSON.parse(fs.readFileSync(examPath, 'utf8'))
const fullMaster = JSON.parse(fs.readFileSync(fullMasterPath, 'utf8'))
const curated = JSON.parse(fs.readFileSync(curatedPath, 'utf8'))
const exam = exams.find((item) => item.id === examId)
assert.ok(exam, `Could not find ${examId}`)
const grammarPart = exam.parts.find((part) => part.title.includes('Ngữ pháp') && part.title.includes('Mondai 2'))
assert.ok(grammarPart, 'Could not find the star-order grammar part')
const fullExam = fullMaster.find((item) => item.title === 'JLPT-N3 12 2020 - Ngữ Pháp & Đọc Hiểu (文法・読解)')
assert.ok(fullExam, 'Could not find the 12/2020 standalone full exam')
const fullGrammarPart = fullExam.parts.find((part) => part.title === 'Mondai 2')
assert.ok(fullGrammarPart, 'Could not find the standalone star-order grammar part')

const reportQuestions = expected.map((item) => {
  const question = grammarPart.questions.find((entry) => entry.id === item.id)
  const fullQuestion = fullGrammarPart.questions.find((entry) => entry.number === item.number)
  assert.ok(question, `Could not find ${item.id}`)
  assert.ok(fullQuestion, `Could not find standalone question ${item.number}`)

  question.options = item.options.map((text, index) => {
    const old = question.options[index]
    return typeof old === 'string' ? text : { ...old, text }
  })
  fullQuestion.options = item.options.map((text, index) => ({
    ...(fullQuestion.options[index] || {}),
    id: String(index + 1),
    text,
  }))
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
    ...new Set([sourceUrl, ...(question.starVerificationSources || []), answerKeyUrl]),
  ]
  question.starVerificationNote = `Visually checked the printed fragments and ★ slot against page 5 of the supplied December 2020 exam PDF. ${item.note || 'The stored order forms the printed sentence and places the stored answer in the printed ★ slot.'} The secondary answer compilation agrees but is not authenticated as an official JLPT key.`
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
  exam: 'JLPT N3 12/2020',
  sourcePdf: {
    title: '11. N3 12-2020.pdf',
    driveFileId: '1KkIqo10qWkUMyKJBIRrwcO2vbRd65c05',
    renderedPage: 5,
    method:
      'Visually checked the complete rendered PDF page at reduced zoom and cross-checked its text layer. The visible PDF resolves text-layer OCR artifacts for question 18.',
  },
  questions: reportQuestions,
  secondaryAnswerKey: {
    title: 'ĐÁP ÁN JLPT N3 (update 26.6.2026).pdf',
    driveFileId: '1Lmr3LwhnS3lEv4FYemiM0f93Qg5DLNZL',
    viewerPage: 21,
    section: 'JLPT N3 12/2020 — 文法・問題2',
    printedQuestions: [14, 15, 16, 17, 18],
    answers: expected.map((item) => item.answer),
    matchesStoredAnswers: true,
    authority: 'Secondary answer compilation in the supplied Drive; not authenticated as an official JLPT key.',
  },
  textLayerNotes: [
    'Question 18 text extraction returned 「運転」 for option 2 and a stray “g” beside the stem; the rendered PDF visibly reads 「運動」 and shows no extra character.',
    'Question 14 and 15 option typography was normalized to match the rendered source: 「スパゲティ」, 「はじまる」, and 「あと3分」.',
  ],
  summary:
    'All five option sets, fragment orders, and third-position ★ slots were visually checked against page 5 of the supplied exam PDF. The stored answers (1–3–2–3–4) follow from the complete sentences and agree with the secondary answer compilation on viewer page 21. That compilation has not been authenticated as an official JLPT key.',
  officialKeyEstablished: false,
}

fs.mkdirSync(path.dirname(reportPath), { recursive: true })
fs.writeFileSync(examPath, `${JSON.stringify(exams, null, 2)}\n`, 'utf8')
fs.writeFileSync(fullMasterPath, `${JSON.stringify(fullMaster, null, 2)}\n`, 'utf8')
fs.writeFileSync(curatedPath, `${JSON.stringify(curated, null, 2)}\n`, 'utf8')
fs.writeFileSync(reportPath, `${JSON.stringify(report, null, 2)}\n`, 'utf8')
console.log(`Verified printed questions 14–18 against ${sourceUrl}`)
