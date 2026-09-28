import fs from 'node:fs'
import path from 'node:path'
import prettier from 'prettier'

const masterPath = 'data/jlpt_n3_toan_master.json'
const curatedPath = 'data/jlpt_n3_explanations_curated.json'
const reportPath = 'reports/n3-quality-audit/grammar-2010-07-cloze-followup.json'
const examId = 'toan-n3-201007-full'
const apply = process.argv.includes('--apply')
const formatJson = async (file, value) =>
  prettier.format(JSON.stringify(value), { ...(await prettier.resolveConfig(file)), filepath: file })
const sourceLinks = {
  examTranscription: 'https://trynihongo.com/en/grammar-exam-n3-9-q179',
  answerSolution: 'https://www.renrendoc.com/paper/122808080.html',
  starQuestionTranscription: 'https://avalon1119.pixnet.net/blog/posts/9232468943',
}
const normalized = (value) =>
  String(value || '')
    .normalize('NFKC')
    .replace(/^\s*[1-4][.)．、]?\s*/u, '')
    .replace(/\s+/gu, '')

const master = JSON.parse(fs.readFileSync(masterPath, 'utf8'))
const curated = JSON.parse(fs.readFileSync(curatedPath, 'utf8'))
const exam = master.find((entry) => entry.id === examId)
if (!exam) throw new Error('Missing exam ' + examId + '.')
const grammarParts = exam.parts.filter((part) => part.title.includes('Ngữ pháp'))
const questions = grammarParts.flatMap((part) => part.questions || [])
const findQuestion = (number) => {
  const question = questions.find((entry) => Number(entry.number) === number)
  if (!question) throw new Error('Missing grammar question ' + number + '.')
  return question
}
const star = findQuestion(53)
const clozeNumber = findQuestion(55)
const clozeLink = findQuestion(57)

if (JSON.stringify(star.starCorrectOrder) !== JSON.stringify([2, 4, 1, 3])) {
  throw new Error('Unexpected question 18 fragment order; verify the source before editing.')
}
const starState = [Number(star.correctAnswer ?? star.answer), Number(star.starPosition)].join(':')
if (!['1:2', '4:1'].includes(starState)) {
  throw new Error('Unexpected question 18 answer/star slot pair; verify the source before editing.')
}
const clozeOptions = clozeNumber.options.map(normalized)
if (
  JSON.stringify(clozeOptions) !== JSON.stringify(['ある', '一台', 'この', 'ふつうの']) &&
  JSON.stringify(clozeOptions) !== JSON.stringify(['ある', '一台の', 'この', 'ふつうの'])
) {
  throw new Error('Unexpected options for cloze question 20; verify the source before editing.')
}
if (Number(clozeNumber.correctAnswer ?? clozeNumber.answer) !== 3) {
  throw new Error('Unexpected answer for cloze question 20.')
}
if (Number(clozeLink.correctAnswer ?? clozeLink.answer) !== 2) {
  throw new Error('Unexpected answer for cloze question 22.')
}

star.correctAnswer = 4
star.answer = 4
star.starPosition = 1
star.starPositionVerified = true
star.explanation = [
  'Câu hoàn chỉnh: 「ジョン『この「りかい」という言葉はどういう意味ですか。』アリ『ああ、確か「わかる」というような意味だったと思うんですけど。』」',
  'Dịch: “John: Từ 「りかい」 này có nghĩa là gì? — Ali: À, tôi nghĩ hình như nó có nghĩa kiểu như 「わかる」 (hiểu), nhưng tôi không chắc lắm.”',
  'Thứ tự ghép là 2 → 4 → 1 → 3. Dấu ★ nằm ở ô thứ hai, nên mảnh đúng là lựa chọn 4 「ような」.',
  '1. 意味だった (いみだった): “đã là nghĩa/ý nghĩa”; là danh từ trung tâm, cần đứng sau 「ような」 để thành 「ような意味」.',
  '2. という: dấu trích dẫn/diễn giải; nối 「わかる」 với phần nói về ý nghĩa thành 「わかるという…」.',
  '3. と思う: “tôi nghĩ rằng”; theo sau nhận định 「意味だった」 để hoàn tất câu và thể hiện sự dè dặt.',
  '4. ような: “như/kiểu như”; bổ nghĩa cho danh từ 「意味」. Nó đứng ở ô ★, vì vậy chọn 4.',
  'Ghi nhớ: 「Aというような意味」 = ý nghĩa kiểu như A; 「～と思うんですけど」 làm lời giải thích mềm và không khẳng định tuyệt đối.',
].join('\n')
curated[star.id] = star.explanation

clozeNumber.options = ['1. ある', '2. 一台の', '3. この', '4. ふつうの']
clozeNumber.explanation = [
  'Đáp án 3 — 「この自動販売機」 chỉ rõ chiếc máy đã được giới thiệu ở câu trước; mạch văn nói chiếc máy gần nhà của người kể có thể nói.',
  'Dịch câu: “Máy bán đồ uống trông như máy bán hàng bình thường, nhưng chiếc máy này có thể nói chuyện.”',
  '1. ある = một/có một…; 「ある自動販売機」 có thể mở đầu một đối tượng chưa xác định, nhưng ở đây chiếc máy đã được nêu nên cần từ chỉ định.',
  '2. 一台の = một chiếc; cách viết này đúng ngữ pháp, nhưng lặp lại cách giới thiệu một chiếc máy mới thay vì chỉ rõ chiếc đã nói ở câu trước.',
  '3. この = chiếc này; hồi chỉ máy bán hàng vừa được giới thiệu, phù hợp nhất với mạch văn.',
  '4. ふつうの = bình thường; lặp lại ý “máy bán hàng bình thường” ở vế ngay trước, không nêu rõ máy cụ thể có thể nói.',
  'Ghi nhớ: この + danh từ dùng để chỉ rõ đối tượng đã biết/đang được nói đến; 一台の chỉ số lượng một chiếc.',
].join('\n')
curated[clozeNumber.id] = clozeNumber.explanation

clozeLink.explanation = [
  'Đáp án 2 — 「ですから」 nối nguyên nhân với kết quả: trong hoạt hình, máy móc cũng nói và đi lại như người; vì vậy nghe máy bán hàng chào khiến người kể thấy như đang ở thế giới hoạt hình.',
  'Dịch câu: “Trong những bộ hoạt hình tôi thường xem, máy móc cũng nói chuyện và đi lại như con người. Vì vậy, khi máy bán hàng nói với tôi, tôi cảm thấy như mình đang ở trong thế giới hoạt hình.”',
  '1. 一方（いっぽう）= mặt khác; dùng để đối chiếu hai phía, trong khi câu sau là cảm nhận nảy sinh từ ví dụ trước.',
  '2. ですから = vì vậy/do đó; diễn tả đúng quan hệ nguyên nhân–kết quả trong đoạn.',
  '3. それなのに = mặc dù vậy/thế mà; báo hiệu kết quả trái mong đợi, không có ý tương phản ở đây.',
  '4. そのうえ = hơn nữa; bổ sung thêm thông tin cùng hướng, nhưng không thể hiện kết luận/cảm nhận được giải thích bởi câu trước.',
  'Ghi nhớ: 「ですから」 nêu kết quả; 「一方」 đối chiếu, 「それなのに」 nghịch dự đoán, 「そのうえ」 bổ sung.',
].join('\n')
curated[clozeLink.id] = clozeLink.explanation

const report = {
  generatedAt: new Date().toISOString(),
  examId,
  scope: 'Grammar star question 18 and cloze questions 20 and 22.',
  sourceLimits: {
    sourcesCompared: sourceLinks,
    officialAnswerKeyConfirmed: false,
    method:
      'Compared the star-order question and vending-machine cloze passage against independent transcriptions and a published answer-solution compilation. Corrected the star slot/key for grammar question 18, restored の in the 一台の option for cloze question 20, and wrote full Vietnamese explanations for the star fragments and every cloze option. These are nonofficial copies, so the report does not claim official-key verification.',
  },
  corrections: [
    {
      questionNumber: 53,
      displayedQuestionNumber: 18,
      previousAnswer: 1,
      answer: 4,
      previousStarPosition: 2,
      starPosition: 1,
      starCorrectOrder: star.starCorrectOrder,
      reason: 'The star is on the second blank; the second fragment in 2 → 4 → 1 → 3 is option 4.',
      explanation: star.explanation,
    },
    {
      questionNumber: 55,
      displayedQuestionNumber: 20,
      answer: 3,
      correctedOption: clozeNumber.options[1],
      reason:
        'The archived question writes the counter phrase as 一台の; the missing の had made the stored distractor ungrammatical.',
      explanation: clozeNumber.explanation,
    },
    {
      questionNumber: 57,
      displayedQuestionNumber: 22,
      answer: 2,
      explanation: clozeLink.explanation,
    },
  ],
}

if (apply) {
  fs.writeFileSync(masterPath, await formatJson(masterPath, master))
  fs.writeFileSync(curatedPath, await formatJson(curatedPath, curated))
  fs.mkdirSync(path.dirname(reportPath), { recursive: true })
  fs.writeFileSync(reportPath, await formatJson(reportPath, report))
}
console.log(
  JSON.stringify(
    {
      mode: apply ? 'applied' : 'dry-run',
      examId,
      reviewedQuestions: [53, 55, 57],
      answerKeysChanged: [{ questionNumber: 53, from: 1, to: 4 }],
      starPositionChanged: [{ questionNumber: 53, from: 2, to: 1 }],
      reportPath: apply ? reportPath : undefined,
    },
    null,
    2
  )
)
