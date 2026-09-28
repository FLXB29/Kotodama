import fs from 'node:fs'
import path from 'node:path'
import prettier from 'prettier'

const masterPath = 'data/jlpt_n3_toan_master.json'
const curatedPath = 'data/jlpt_n3_explanations_curated.json'
const reportPath = 'reports/n3-quality-audit/vocabulary-2025-12-q1-14-review.json'
const examId = 'toan-n3-202512-full'
const apply = process.argv.includes('--apply')

const reviews = [
  {
    number: 1,
    answer: 3,
    options: ['せよう', 'せいゆう', 'せいよう', 'せゆう'],
    explanation: [
      'Đáp án 3 — 「西洋」（せいよう）là phương Tây; 「西洋の建物」là tòa nhà kiểu phương Tây.',
      'Dịch: “Đây là bức ảnh chụp một tòa nhà phương Tây.”',
      '1. せよう: thiếu âm い trong cách đọc 西（せい）, nên không phải cách đọc của 西洋.',
      '2. せいゆう: đọc sai chữ 洋; từ này đọc よう, không phải ゆう.',
      '3. せいよう: cách đọc đúng của 西洋.',
      '4. せゆう: vừa thiếu âm い của 西, vừa đọc sai 洋.',
    ].join('\n'),
  },
  {
    number: 2,
    answer: 2,
    options: ['おしい', 'くるしい', 'くやしい', 'きびしい'],
    explanation: [
      'Đáp án 2 — 「苦しい試合」là trận đấu gian nan, căng thẳng hoặc đầy khó khăn.',
      'Dịch: “Lần này là một trận đấu rất căng thẳng.”',
      '1. おしい（惜しい）: đáng tiếc; suýt đạt được. Không mang nghĩa vất vả của 苦しい.',
      '2. くるしい（苦しい）: đau đớn, khổ sở hoặc gian nan; đúng với trận đấu khó khăn.',
      '3. くやしい（悔しい）: cay cú/tiếc nuối vì kết quả không như ý; là cảm xúc sau thất bại, không phải tính chất trận đấu ở đây.',
      '4. きびしい（厳しい）: nghiêm khắc hoặc khắc nghiệt; không phải cách đọc của 苦しい.',
    ].join('\n'),
  },
  {
    number: 3,
    answer: 4,
    options: ['たんじん', 'たじん', 'たんにん', 'たにん'],
    explanation: [
      'Đáp án 4 — 「他人」（たにん）là người khác/người ngoài; 「他人に見せない」là không cho người khác xem.',
      'Dịch: “Xin đừng cho người khác xem bức thư này.”',
      '1. たんじん: không phải cách đọc của 他人; thêm âm ん và đọc 人 sai.',
      '2. たじん: không phải cách đọc chuẩn của từ 他人.',
      '3. たんにん: không phải cách đọc của 他人; âm ん thừa sau た.',
      '4. たにん: cách đọc đúng của 他人.',
    ].join('\n'),
  },
  {
    number: 4,
    answer: 1,
    options: ['ふくつう', 'ふくつ', 'ずつう', 'ずつ'],
    explanation: [
      'Đáp án 1 — 「腹痛」（ふくつう）là đau bụng; 「腹痛で休む」là nghỉ vì đau bụng.',
      'Dịch: “Hôm qua tôi nghỉ học vì đau bụng.”',
      '1. ふくつう: cách đọc Hán Nhật đúng của 腹痛.',
      '2. ふくつ: thiếu âm dài う ở cuối; không phải cách đọc chuẩn của 腹痛.',
      '3. ずつう: 「頭痛」, đau đầu; là từ khác, không phải 腹痛.',
      '4. ずつ: thiếu âm dài và không phải cách đọc của 腹痛.',
    ].join('\n'),
  },
  {
    number: 5,
    answer: 2,
    options: ['しゅうでん', 'しゅうてん', 'じゅうてん', 'じゅうでん'],
    explanation: [
      'Đáp án 2 — 「終点」（しゅうてん）là điểm cuối/ga cuối của tuyến đường.',
      'Dịch: “Ga kế tiếp là ga cuối.”',
      '1. しゅうでん: 「終電」, chuyến tàu cuối trong ngày; khác chữ 点 và khác nghĩa.',
      '2. しゅうてん: cách đọc đúng của 終点.',
      '3. じゅうてん: không phải cách đọc của 終点; 「重点」（じゅうてん）là trọng điểm nhưng viết bằng chữ khác.',
      '4. じゅうでん: 「充電」, sạc điện; là từ khác và không hợp câu.',
    ].join('\n'),
  },
  {
    number: 6,
    answer: 3,
    options: ['はたらいて', 'おどろいて', 'ないて', 'やいて'],
    explanation: [
      'Đáp án 3 — 「泣いていました」là đã/đang khóc; đây là thể て của 泣く（なく）.',
      'Dịch: “Anh/chị Morita đã khóc.”',
      '1. はたらいて（働いて）: đang làm việc; khác nghĩa và khác chữ Hán.',
      '2. おどろいて（驚いて）: ngạc nhiên/giật mình.',
      '3. ないて（泣いて）: cách đọc đúng của 泣いて, khóc.',
      '4. やいて（焼いて）: nướng/đốt; thể て của 焼く.',
    ].join('\n'),
  },
  {
    number: 7,
    answer: 1,
    options: ['おび', 'えり', 'そで', 'いと'],
    explanation: [
      'Đáp án 1 — 「帯」（おび）là dải thắt lưng rộng dùng để buộc kimono.',
      'Dịch: “Dải thắt lưng của bộ kimono này rất đẹp.”',
      '1. おび: cách đọc đúng của 帯 trong nghĩa dải thắt lưng kimono.',
      '2. えり（襟）: cổ áo.',
      '3. そで（袖）: tay áo.',
      '4. いと（糸）: sợi chỉ.',
    ].join('\n'),
  },
  {
    number: 8,
    answer: 4,
    options: ['ようべん', 'ようびん', 'ゆうべん', 'ゆうびん'],
    explanation: [
      'Đáp án 4 — 「郵便」（ゆうびん）là thư từ/dịch vụ bưu chính; 「郵便が届く」là thư được gửi đến.',
      'Dịch: “Hôm qua thư từ mẹ đã được gửi đến.”',
      '1. ようべん: đọc sai cả chữ 郵（ゆう）lẫn 便（びん）.',
      '2. ようびん: đọc sai 郵; chữ này đọc ゆう.',
      '3. ゆうべん: đọc sai 便; trong 郵便, chữ này đọc びん.',
      '4. ゆうびん: cách đọc đúng của 郵便.',
    ].join('\n'),
  },
  {
    number: 9,
    answer: 2,
    options: ['通り', '辺り', '返り', '迎り'],
    explanation: [
      'Đáp án 2 — 「辺り」（あたり）nghĩa là khu vực xung quanh; 「この辺り」là khu vực này/quanh đây.',
      'Dịch: “Quanh khu vực này có nhiều chung cư.”',
      '1. 通り（とおり）: con đường; hoặc “đúng như/theo như”. Không phải cách viết của あたり.',
      '2. 辺り（あたり）: vùng lân cận; đúng nghĩa và cách đọc trong câu.',
      '3. 返り（かえり）: sự quay lại/trả về; không hợp nghĩa “khu vực”.',
      '4. 迎り: không phải cách viết thông dụng/chuẩn của từ あたり; 迎える（むかえる）là đón/đón tiếp.',
    ].join('\n'),
  },
  {
    number: 10,
    answer: 2,
    options: ['絵', '図', '表', '例'],
    explanation: [
      'Đáp án 2 — 「図」（ず）là hình vẽ/sơ đồ; 「次の図」là hình minh họa tiếp theo.',
      'Dịch: “Xin hãy xem sơ đồ tiếp theo.”',
      '1. 絵（え）: tranh/hình vẽ mang tính hình ảnh; không phải cách viết của ず.',
      '2. 図（ず）: sơ đồ hoặc hình minh họa; đúng cách đọc và nghĩa.',
      '3. 表（ひょう）: bảng biểu trình bày dữ liệu; thường đọc ひょう.',
      '4. 例（れい）: ví dụ; thường dùng như 例を見る “xem ví dụ”.',
    ].join('\n'),
  },
  {
    number: 11,
    answer: 4,
    options: ['細りました', '低りました', '消りました', '減りました'],
    explanation: [
      'Đáp án 4 — 「減りました」（へりました）là đã giảm; 「貯金が減る」là tiền tiết kiệm giảm đi.',
      'Dịch: “Tiền tiết kiệm đã giảm đi một chút.”',
      '1. 細りました: 細る（ほそる）có nghĩa gầy/thon đi và chia quá khứ là ほそりました; không đọc là へりました và không dùng tự nhiên cho số tiền tiết kiệm.',
      '2. 低りました: không phải dạng động từ chuẩn; 低い（ひくい）là tính từ “thấp”, còn “giảm xuống” có thể nói 低くなる.',
      '3. 消りました: không phải cách chia chuẩn; 消える（きえる）là biến mất, 消す（けす）là xóa/tắt.',
      '4. 減りました: dạng lịch sự quá khứ của 減る（へる）, giảm bớt; đúng cách đọc và kết hợp với 貯金.',
    ].join('\n'),
  },
  {
    number: 12,
    answer: 3,
    options: ['歩動', '走道', '歩道', '走動'],
    explanation: [
      'Đáp án 3 — 「歩道」（ほどう）là vỉa hè/lối đi dành cho người đi bộ; 「歩道ができる」là có thêm vỉa hè.',
      'Dịch: “Nghe nói năm sau ở đây sẽ có vỉa hè.”',
      '1. 歩動: không phải từ chỉ vỉa hè; 動（どう）là chuyển động, không phải 道（どう）“con đường” trong 歩道.',
      '2. 走道: không phải từ chuẩn chỉ vỉa hè; 走（そう）liên quan đến chạy, không phải 歩（ほ）“đi bộ”.',
      '3. 歩道: ghép 歩（đi bộ）+ 道（đường/lối đi）, đọc ほどう; đúng nghĩa.',
      '4. 走動: không phải cách viết chuẩn của từ được hỏi; hai chữ này không tạo thành nghĩa vỉa hè.',
    ].join('\n'),
  },
  {
    number: 13,
    answer: 1,
    options: ['打つ', '押つ', '指つ', '折つ'],
    explanation: [
      'Đáp án 1 — 「キーボードを打つ」là gõ bàn phím; 打つ（うつ）cũng có nghĩa đánh/đập tùy ngữ cảnh.',
      'Dịch: “Tôi nghe thấy tiếng gõ bàn phím máy tính.”',
      '1. 打つ（うつ）: gõ phím; cách dùng tự nhiên với キーボード.',
      '2. 押つ: không phải dạng đúng; 押す（おす）nghĩa là ấn/bấm, chia thể て thành 押して.',
      '3. 指つ: không phải động từ chuẩn; 指（ゆび）là ngón tay, không có cách đọc hay cách chia này.',
      '4. 折つ: không phải dạng đúng; 折る（おる）nghĩa là gập/bẻ, thể て là 折って.',
    ].join('\n'),
  },
  {
    number: 14,
    answer: 3,
    options: ['姓格', '性各', '性格', '姓各'],
    explanation: [
      'Đáp án 3 — 「性格」（せいかく）là tính cách; 「まじめな性格」là tính cách nghiêm túc/chăm chỉ.',
      'Dịch: “Anh/chị Yamada có tính cách nghiêm túc.”',
      '1. 姓格: không phải cách viết chuẩn của từ này; 姓（せい）là họ, 格（かく）là phẩm cấp/chuẩn mực.',
      '2. 性各: không phải từ 性格; 性（せい）liên quan đến tính chất/giới tính, 各（かく）nghĩa là mỗi/từng.',
      '3. 性格（せいかく）: tính cách; đúng cả chữ Hán, cách đọc và nghĩa.',
      '4. 姓各: ghép sai chữ; 姓 là họ còn 各 là mỗi/từng, không tạo thành từ chỉ tính cách.',
    ].join('\n'),
  },
]

const normalizeOption = (value) =>
  String(value || '')
    .normalize('NFKC')
    .replace(/^\s*[1-4][.)．、]\s*/u, '')
    .replace(/^\s*[1-4]\s+/u, '')
    .replace(/\s+/gu, '')

if (reviews.length !== 14 || new Set(reviews.map((row) => row.number)).size !== 14) {
  throw new Error('The review must cover questions 1–14 exactly once.')
}

const master = JSON.parse(fs.readFileSync(masterPath, 'utf8'))
const curated = JSON.parse(fs.readFileSync(curatedPath, 'utf8'))
const exam = master.find((entry) => entry.id === examId)
if (!exam) throw new Error('Missing exam ' + examId + '.')
const questions = exam.parts.filter((part) => part.title.includes('Từ vựng')).flatMap((part) => part.questions || [])
if (questions.length !== 35) throw new Error('Expected 35 vocabulary questions, found ' + questions.length + '.')

for (const row of reviews) {
  const question = questions.find((entry) => Number(entry.number) === row.number)
  if (!question) throw new Error('Missing question ' + row.number + '.')
  if (Number(question.correctAnswer ?? question.answer) !== row.answer) {
    throw new Error('Question ' + row.number + ' answer key changed; review it before applying explanations.')
  }
  if (JSON.stringify(question.options.map(normalizeOption)) !== JSON.stringify(row.options.map(normalizeOption))) {
    throw new Error('Question ' + row.number + ' options changed; re-check this review against the current source.')
  }
  question.explanation = row.explanation
  curated[question.id] = row.explanation
}

const report = {
  generatedAt: new Date().toISOString(),
  examId,
  section: 'Từ vựng',
  questionRange: '1–14',
  reviewedQuestionCount: reviews.length,
  reviewedChoiceCount: reviews.length * 4,
  answerKeysChanged: 0,
  method:
    'Manually reviewed the stored Japanese prompts and all four choices, translated each prompt, and replaced noisy automatic dictionary glosses with contextual Vietnamese explanations. The answer key and source option text are preserved. This pass did not visually compare the original question PDF or independently confirm the official answer key.',
  sourceLimits: {
    originalQuestionPdfVisuallyInspectedThisPass: false,
    officialAnswerKeyConfirmed: false,
    unresolvedTranscriptionNotes: [],
  },
  rows: reviews.map(({ number, answer, options, explanation }) => ({
    number,
    answer,
    options,
    explanation,
    allFourChoicesExplained: true,
    promptTranslated: true,
  })),
  verdict:
    'Questions 1–14 have contextual translations and four numbered choice notes. This review covers the stored exam text and does not certify the original paper transcription or an official JLPT key.',
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
      questions: reviews.length,
      optionNotes: reviews.length * 4,
      answerKeysChanged: 0,
      reportPath: apply ? reportPath : undefined,
    },
    null,
    2
  )
)
