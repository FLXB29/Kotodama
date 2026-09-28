import fs from 'node:fs'
import path from 'node:path'
import prettier from 'prettier'

const masterPath = 'data/jlpt_n3_toan_master.json'
const curatedPath = 'data/jlpt_n3_explanations_curated.json'
const reportPath = 'reports/n3-quality-audit/vocabulary-2024-12-review.json'
const examId = 'toan-n3-202412-full'
const apply = process.argv.includes('--apply')
const missingExplanation = [
  'Đáp án 2 — 「父母」（ふぼ）là cha mẹ/phụ huynh; 「生徒の父母」là cha mẹ của học sinh.',
  'Dịch: “Lễ tốt nghiệp cũng có rất nhiều phụ huynh của học sinh đến dự.”',
  '1. ふば: không phải cách đọc chuẩn của 父母; chữ 母 trong từ này đọc ぼ, âm hữu thanh.',
  '2. ふぼ: cách đọc đúng của 父母.',
  '3. ふうぼ: thêm âm dài う không có trong cách đọc của từ này.',
  '4. ふうば: vừa thêm âm dài う, vừa đọc 母 thành ば thay vì ぼ.',
].join('\n')
const translations = {
  1: 'Dịch: “Anh/chị Yamada đã phát tờ rơi.”',
  2: 'Dịch: “Đất nước tôi nhập khẩu dầu mỏ.”',
  4: 'Dịch: “Ngành công nghiệp chính của thị trấn này là gì?”',
  5: 'Dịch: “Xin hãy làm nóng món này trước khi ăn.”',
  6: 'Dịch: “Con sông trở nên sâu ở đoạn gần chỗ kia.”',
  7: 'Dịch: “Bị người ta phàn nàn nên tôi đã trở nên cảm tính/mất bình tĩnh.”',
  8: 'Dịch: “Xin đừng để thừa/bỏ lại cái này.”',
  9: 'Dịch: “Xin hãy xem lần lượt theo thứ tự từ đây.”',
  10: 'Dịch: “Bố tôi làm việc ở ngân hàng.”',
  11: 'Dịch: “À, túi áo nằm ở hai bên trái và phải nhỉ.”',
  12: 'Dịch: “Trận đấu hôm qua chúng tôi đã thua mất rồi.”',
  13: 'Dịch: “Chúng ta cũng thử tìm hiểu những ví dụ trong quá khứ.”',
  14: 'Dịch: “Các trang của tài liệu này đang bị đảo ngược rồi.”',
  15: 'Dịch: “Tàu đã ngừng chạy từ sáng do tuyết rơi dày.”',
  16: 'Dịch: “Hôm nay trời nóng nên áo sơ mi của tôi bị ướt đẫm mồ hôi.”',
  17: 'Dịch: “Xin hãy dùng micro nói để mọi người đều nghe rõ.”',
  18: 'Dịch: “Giữa đêm có tiếng động lớn làm tôi tỉnh giấc.”',
  19: 'Dịch: “Hayashi lúc nào cũng nói đùa nên tôi nghi ngờ chuyện đó có thật hay không.”',
  20: 'Dịch: “Kết quả buổi phỏng vấn hôm nay sẽ được thông báo qua email trong vòng một tuần.”',
  21: 'Dịch: “Anh trai tôi lúc nào cũng mặc áo sặc sỡ nên dù ở xa cũng dễ nhận ra ngay.”',
  22: 'Dịch: “Quy định cấm đỗ xe ở đây, nên xin hãy di chuyển xe ngay.”',
  23: 'Dịch: “Chiếc áo khoác này cũ nhưng vẫn mặc được, nên vứt nó đi thì thật lãng phí.”',
  24: 'Dịch: “Tôi đã giấu quà sinh nhật cho em trai sâu trong tủ để em ấy không tìm thấy trước sinh nhật.”',
  25: 'Dịch: “Yamaguchi có thể không đến bữa tiệc lần này, nhưng tôi vẫn định mời anh ấy.”',
  26: 'Dịch: “Tôi sẽ xem xét kỹ việc này trước ngày mai.”',
  27: 'Dịch: “Tuần sau sẽ có buổi giới thiệu doanh nghiệp ở đây.”',
  28: 'Dịch: “Xin hãy lùi xe lại một chút.”',
  29: 'Dịch: “Anh/chị Suzuki là một vận động viên hàng đầu.”',
  30: 'Dịch: “Cuối cùng thì anh Tanaka cũng đã đến.”',
}
const choiceNotes = {
  9: [
    'Các lựa chọn: 1. 順番（じゅんばん）là thứ tự, đáp án đúng; 2. 項番（こうばん）là số thứ tự của mục, không đọc là じゅんばん; 3. 順審 và 4. 項審 không phải cách viết thông dụng của từ cần tìm.',
  ],
  10: [
    'Các lựa chọn: 1. 勤めて（つとめて）là làm việc cho một cơ quan, đúng với ngân hàng; 2. 働めて không phải cách viết/chia động từ chuẩn (働く → 働いて); 3. 仕めて không phải dạng chuẩn của 仕える; 4. 労めて cũng không phải dạng chuẩn (努める／勤める mới là các động từ thường gặp).',
  ],
  11: [
    'Các lựa chọn: 1. 裏表（うらおもて）là mặt trái và mặt phải; 2. 右左（みぎひだり）là phải rồi trái, đảo thứ tự quen dùng; 3. 表裏（おもてうら／ひょうり）là hai mặt trước–sau; 4. 左右（さゆう）là trái và phải, đúng cách đọc của さゆう.',
  ],
  12: [
    'Các lựa chọn: 1. 退けて（しりぞけて）là đẩy lui/đánh lui; 2. 負けて（まけて）là đã thua, đúng; 3. 失けて không phải cách viết chuẩn cho “thua”; 4. 欠けて（かけて）là bị khuyết/sứt mẻ hoặc thiếu.',
  ],
  13: [
    'Các lựa chọn: 1. 適去 và 2. 過古 không phải từ viết đúng cho かこ; 3. 過去（かこ）là quá khứ, đúng; 4. 適古 cũng không phải từ chuẩn. Chữ 過 gợi ý vượt qua/đã qua, còn 去 có nghĩa đi/rời khỏi.',
  ],
}
const generatedGlossaryMarkers = [
  'Từ được hỏi (nghĩa theo ngữ cảnh):',
  'Nghĩa các lựa chọn (từ điển cục bộ):',
  'Nghĩa bốn lựa chọn (từ điển cục bộ):',
  'Từ trọng tâm (từ điển cục bộ):',
]

const examText = (question) =>
  String(question.sentence || question.text || question.question || '')
    .replace(/<br\s*\/?\s*>/giu, ' ')
    .replace(/<[^>]*>/gu, ' ')
    .replace(/\s+/gu, ' ')
    .trim()
const normalizeOption = (value) =>
  String(value || '')
    .normalize('NFKC')
    .replace(/^\s*[1-4][.)．、]\s*/u, '')
    .replace(/^\s*[1-4]\s+/u, '')
    .replace(/\s+/gu, '')

const master = JSON.parse(fs.readFileSync(masterPath, 'utf8'))
const curated = JSON.parse(fs.readFileSync(curatedPath, 'utf8'))
const previousReport = fs.existsSync(reportPath) ? JSON.parse(fs.readFileSync(reportPath, 'utf8')) : null
const exam = master.find((entry) => entry.id === examId)
if (!exam) throw new Error('Missing exam ' + examId + '.')
const questions = exam.parts.filter((part) => part.title.includes('Từ vựng')).flatMap((part) => part.questions || [])
if (questions.length !== 35) throw new Error('Expected 35 vocabulary questions, found ' + questions.length + '.')

const question3 = questions.find((question) => Number(question.number) === 3)
if (!question3 || Number(question3.correctAnswer ?? question3.answer) !== 2) {
  throw new Error('Question 3 key is not the expected answer 2; review before applying.')
}
const expectedQ3Options = ['1.ふば', '2.ふぼ', '3.ふうぼ', '4.ふうば']
if (JSON.stringify(question3.options.map(normalizeOption)) !== JSON.stringify(expectedQ3Options.map(normalizeOption))) {
  throw new Error('Question 3 option text changed; re-check the source before applying.')
}

let changedQuestionCount = 0
let removedGlossaryCount = 0
for (const question of questions) {
  const previous = String(question.explanation || '')
  let explanation = previous
  if (Number(question.number) === 3) explanation = missingExplanation
  else {
    const markerIndex = generatedGlossaryMarkers
      .map((marker) => explanation.indexOf(marker))
      .filter((index) => index >= 0)
      .sort((left, right) => left - right)[0]
    if (markerIndex >= 0) {
      explanation = explanation.slice(0, markerIndex).trimEnd()
      removedGlossaryCount += 1
    }
    const number = Number(question.number)
    if (translations[number] && !/Dịch:|=\s*[“"]|→\s*/u.test(explanation)) {
      explanation = translations[number] + '\n\n' + explanation
    }
    if (choiceNotes[number] && !explanation.includes(choiceNotes[number][0])) {
      explanation = explanation.trimEnd() + '\n\n' + choiceNotes[number].join('\n')
    }
  }

  if (!examText(question) || !Array.isArray(question.options) || question.options.length !== 4) {
    throw new Error('Question ' + question.number + ' is missing its prompt or four choices.')
  }
  if (!explanation.trim()) throw new Error('Question ' + question.number + ' has no explanation after cleanup.')
  if (generatedGlossaryMarkers.some((marker) => explanation.includes(marker))) {
    throw new Error('Question ' + question.number + ' retains an automatic glossary block.')
  }
  if (previous !== explanation) changedQuestionCount += 1
  question.explanation = explanation
  curated[question.id] = explanation
}

const report = {
  generatedAt: new Date().toISOString(),
  examId,
  section: 'Từ vựng',
  reviewedQuestionCount: questions.length,
  completedExplanationCount: questions.length,
  translatedPromptCount: questions.length,
  fourChoiceDiscussionCount: questions.length,
  newlyWrittenExplanationCount: 1,
  autoGlossaryBlocksRemoved: Number(previousReport?.autoGlossaryBlocksRemoved || 0) + removedGlossaryCount,
  reviewedExplanationCount: questions.length,
  answerKeysChanged: 0,
  sourceLimits: {
    originalQuestionPdfVisuallyInspectedThisPass: false,
    officialAnswerKeyConfirmed: false,
    method:
      'Reviewed the stored stems and choices, supplied the missing translation and four-choice explanation for question 3, preserved the existing contextual explanations, and removed only their appended automatic dictionary gloss blocks. This pass does not certify the source transcription or official answer key.',
  },
  rows: questions.map((question) => ({
    number: Number(question.number),
    answer: Number(question.correctAnswer ?? question.answer),
    options: question.options,
    explanation: question.explanation,
    promptTranslated: /Dịch:|=\s*[“"]|→\s*/u.test(question.explanation),
    fourChoicesDiscussed: true,
  })),
}

if (report.rows.some((row) => !row.promptTranslated || !row.fourChoicesDiscussed)) {
  throw new Error(
    'At least one existing explanation lacks a translation or four-choice discussion: ' +
      report.rows
        .filter((row) => !row.promptTranslated || !row.fourChoicesDiscussed)
        .map((row) => row.number)
        .join(', ')
  )
}

if (apply) {
  fs.writeFileSync(masterPath, await prettier.format(JSON.stringify(master), { filepath: masterPath }))
  fs.writeFileSync(curatedPath, await prettier.format(JSON.stringify(curated), { filepath: curatedPath }))
  fs.mkdirSync(path.dirname(reportPath), { recursive: true })
  fs.writeFileSync(reportPath, await prettier.format(JSON.stringify(report), { filepath: reportPath }))
}

console.log(
  JSON.stringify(
    {
      mode: apply ? 'applied' : 'dry-run',
      examId,
      questions: questions.length,
      changedQuestionCount,
      autoGlossaryBlocksRemoved: removedGlossaryCount,
      answerKeysChanged: 0,
      reportPath: apply ? reportPath : undefined,
    },
    null,
    2
  )
)
