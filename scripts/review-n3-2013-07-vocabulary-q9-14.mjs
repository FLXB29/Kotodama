import fs from 'node:fs'
import path from 'node:path'
import prettier from 'prettier'

const masterPath = 'data/jlpt_n3_toan_master.json'
const curatedPath = 'data/jlpt_n3_explanations_curated.json'
const reportPath = 'reports/n3-quality-audit/vocabulary-2013-07-q9-14-review.json'
const examId = 'toan-n3-201307-full'
const apply = process.argv.includes('--apply')
const reviews = [
  {
    number: 9,
    answer: 2,
    options: ['真じて', '信じて', '心じて', '親じて'],
    explanation: [
      'Đáp án 2 — 「信じる」（しんじる）là tin/tin tưởng; 「彼ならできると信じている」là tin rằng anh ấy có thể làm được.',
      'Dịch: “Tôi tin rằng nếu là anh ấy thì anh ấy làm được.”',
      '1. 真じて: 真（しん／ま）gợi nghĩa thật/chân thật, nhưng không viết động từ しんじる bằng chữ này.',
      '2. 信じて: cách viết đúng của thể て của 信じる.',
      '3. 心じて: 心（こころ／しん）là trái tim/tấm lòng; không tạo thành cách viết của しんじる.',
      '4. 親じて: 親（おや／しん）là cha mẹ/thân thiết; không phải chữ dùng trong động từ này.',
    ].join('\n'),
  },
  {
    number: 10,
    answer: 3,
    options: ['遠く', '後く', '遅く', '復く'],
    explanation: [
      'Đáp án 3 — 「遅く」（おそく）là dạng trạng từ của 遅い (muộn); 「夜遅くまで」là đến tận khuya.',
      'Dịch: “Cửa hàng này mở đến tận khuya nên rất tiện.”',
      '1. 遠く（とおく）: ở xa; cách đọc và nghĩa đều không khớp おそく.',
      '2. 後く: không phải cách viết chuẩn của おそく; 後 thường đọc あと／うしろ／ご.',
      '3. 遅く（おそく）: muộn; đúng cách đọc và nghĩa trong câu.',
      '4. 復く: không phải cách viết chuẩn của おそく; 復 xuất hiện trong từ như 復習（ふくしゅう, ôn tập）.',
    ].join('\n'),
  },
  {
    number: 11,
    answer: 2,
    options: ['浴器', '容器', '容機', '浴機'],
    explanation: [
      'Đáp án 2 — 「容器」（ようき）là đồ đựng/vật chứa; 「プラスチックの容器」là hộp hoặc bao bì nhựa.',
      'Dịch: “Nhà máy này sản xuất đồ đựng bằng nhựa.”',
      '1. 浴器: 浴 liên quan đến tắm/ngâm; không viết từ ようき “đồ đựng” bằng chữ này.',
      '2. 容器: 容 (chứa) + 器 (đồ dùng/vật chứa), đúng cách viết của ようき.',
      '3. 容機: 容 là chứa, 機 là máy móc; không phải từ chỉ hộp/đồ đựng.',
      '4. 浴機: ghép sai chữ; 浴 không mang nghĩa “chứa”, còn 機 là máy móc.',
    ].join('\n'),
  },
  {
    number: 12,
    answer: 1,
    options: ['疲れました', '痛れました', '病れました', '症れました'],
    explanation: [
      'Đáp án 1 — 「疲れました」（つかれました）là đã mệt; đi bộ cả ngày khiến chân mỏi/mệt.',
      'Dịch: “Hôm nay tôi đi bộ suốt cả ngày nên chân đã mỏi.”',
      '1. 疲れました: dạng lịch sự quá khứ của 疲れる (mệt), cách viết đúng của つかれました.',
      '2. 痛れました: không phải dạng động từ chuẩn; 痛む／痛い diễn tả đau, nhưng không viết つかれました bằng 痛.',
      '3. 病れました: không phải cách chia chuẩn; 病気になる／病む diễn tả mắc bệnh.',
      '4. 症れました: không phải động từ chuẩn; 症 xuất hiện trong danh từ như 症状 (triệu chứng).',
    ].join('\n'),
  },
  {
    number: 13,
    answer: 4,
    options: ['整ねて', '列ねて', '階ねて', '重ねて'],
    explanation: [
      'Đáp án 4 — 「重ねて」（かさねて）là xếp chồng lên nhau; 「皿を重ねる」là chồng các chiếc đĩa lên.',
      'Dịch: “Xin hãy xếp chồng đĩa lên rồi cất vào chiếc kệ đó.”',
      '1. 整ねて: không phải cách viết của かさねて; 整える（ととのえる）là sắp xếp/chỉnh cho ngay ngắn.',
      '2. 列ねて: không đọc là かさねて; 列 liên quan đến hàng/lối hoặc xếp thành hàng.',
      '3. 階ねて: 階（かい）là tầng/bậc; không tạo thành động từ かさねる.',
      '4. 重ねて: thể て của 重ねる, xếp chồng/đặt nhiều vật lên nhau; hợp với đĩa.',
    ].join('\n'),
  },
  {
    number: 14,
    answer: 4,
    options: ['増勤', '増業', '残勤', '残業'],
    explanation: [
      'Đáp án 4 — 「残業」（ざんぎょう）là làm thêm giờ ngoài thời gian làm việc thông thường.',
      'Dịch: “Tuần này tôi phải làm thêm giờ nhiều.”',
      '1. 増勤: không phải từ chuẩn cho làm thêm giờ; 増 liên quan đến tăng, 勤 đến việc chuyên cần/làm việc.',
      '2. 増業: không phải cách viết của ざんぎょう; 増業 không phải danh từ thông dụng mang nghĩa tăng ca.',
      '3. 残勤: 残 là còn lại, 勤 là làm việc/chuyên cần; không phải thuật ngữ chuẩn cho giờ làm ngoài lịch.',
      '4. 残業: 残 (còn lại) + 業 (công việc), là phần việc làm thêm sau giờ; đúng.',
    ].join('\n'),
  },
]

const normalizeOption = (value) =>
  String(value || '')
    .normalize('NFKC')
    .replace(/^\s*[1-4][.)．、]\s*/u, '')
    .replace(/^\s*[1-4]\s+/u, '')
    .replace(/\s+/gu, '')
if (reviews.length !== 6 || new Set(reviews.map((row) => row.number)).size !== 6) {
  throw new Error('The review must cover questions 9–14 exactly once.')
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
    throw new Error('Question ' + row.number + ' answer key changed; review before applying.')
  }
  if (JSON.stringify(question.options.map(normalizeOption)) !== JSON.stringify(row.options.map(normalizeOption))) {
    throw new Error('Question ' + row.number + ' options changed; re-check the source before applying.')
  }
  question.explanation = row.explanation
  curated[question.id] = row.explanation
}

const report = {
  generatedAt: new Date().toISOString(),
  examId,
  section: 'Từ vựng',
  questionRange: '9–14',
  reviewedQuestionCount: reviews.length,
  reviewedChoiceCount: reviews.length * 4,
  answerKeysChanged: 0,
  sourceLimits: {
    originalQuestionPdfVisuallyInspectedThisPass: false,
    officialAnswerKeyConfirmed: false,
    method:
      'Reviewed the stored Japanese stems and each printed choice, translated the sentences, and explained contextual meanings and invalid Kanji constructions. The stored answer keys and option text were preserved; this pass does not independently certify the source transcription or official answer key.',
  },
  rows: reviews.map(({ number, answer, options, explanation }) => ({
    number,
    answer,
    options,
    explanation,
    allFourChoicesExplained: true,
    promptTranslated: true,
  })),
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
      choiceNotes: reviews.length * 4,
      answerKeysChanged: 0,
      reportPath: apply ? reportPath : undefined,
    },
    null,
    2
  )
)
