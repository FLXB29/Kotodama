import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'

const root = path.resolve('.')
const masterPath = path.join(root, 'data/jlpt_n3_toan_master.json')
const curatedPath = path.join(root, 'data/jlpt_n3_explanations_curated.json')
const reportPath = path.join(root, 'reports/n3-quality-audit/star-source-2010-07-review.json')
const sourceUrl = 'https://drive.google.com/file/d/1whWNU3gUS-FZrbUgLakfxk5P8lW8w9nX/view#page=8'
const entries = [
  {
    printedQuestion: 14,
    id: 'toan_q_2010_07_49',
    options: ['1. 早く', '2. 開いていない', '3. まだ', '4. 行っても'],
    order: [1, 4, 3, 2],
    starPosition: 2,
    answer: 3,
    before:
      'Ａ「じゃあ、あしたはコンサート会場の入り口に5時に集まりませんか。」Ｂ「コンサートは7時からですから、そんなに',
    after: 'と思いますよ。」',
    completed:
      'Ａ「じゃあ、あしたはコンサート会場の入り口に5時に集まりませんか。」Ｂ「コンサートは7時からですから、そんなに早く行ってもまだ開いていないと思いますよ。」',
    translation:
      'A: “Vậy ngày mai chúng ta tập trung ở lối vào địa điểm hòa nhạc lúc 5 giờ nhé?” B: “Buổi hòa nhạc bắt đầu lúc 7 giờ, nên dù đến sớm như vậy thì chắc nơi đó vẫn chưa mở cửa đâu.”',
    explanation:
      'Đáp án ★: lựa chọn 3 「まだ」. Thứ tự ghép là 1 → 4 → 3 → 2, nên mảnh ở ô ★ thứ ba là 「まだ」. Câu hoàn chỉnh: 「Ａ「じゃあ、あしたはコンサート会場の入り口に5時に集まりませんか。」Ｂ「コンサートは7時からですから、そんなに早く行ってもまだ開いていないと思いますよ。」」\nDịch: A: “Vậy ngày mai chúng ta tập trung ở lối vào địa điểm hòa nhạc lúc 5 giờ nhé?” B: “Buổi hòa nhạc bắt đầu lúc 7 giờ, nên dù đến sớm như vậy thì chắc nơi đó vẫn chưa mở cửa đâu.”\n1. 「早く」= sớm; đứng sau 「そんなに」 để thành 「そんなに早く」, không ở ô ★.\n2. 「開いていない」= chưa mở cửa; làm vị ngữ sau 「まだ」, kết thúc cụm bổ nghĩa cho 「と思います」, không ở ô ★.\n3. 「まだ」= vẫn/chưa; đứng ở ô ★ sau 「行っても」 để tạo 「まだ開いていない」.\n4. 「行っても」= dù có đi/đến; theo sau 「早く」 thành 「早く行っても」, mở mệnh đề nhượng bộ, không ở ô ★.\nGhi nhớ: 「Vても」 nêu nhượng bộ; 「まだ～ていない」 diễn tả việc đến thời điểm nói vẫn chưa xảy ra.',
  },
  {
    printedQuestion: 15,
    id: 'toan_q_2010_07_50',
    options: ['1. すこし', '2. から', '3. 待って', '4. いらっしゃいます'],
    order: [4, 2, 1, 3],
    starPosition: 2,
    answer: 1,
    before: '（田中先生の研究室で）学生「田中先生はいらっしゃいますか。」秘書「今、ほかの学生と話して',
    after: 'ください。」',
    completed:
      '（田中先生の研究室で）学生「田中先生はいらっしゃいますか。」秘書「今、ほかの学生と話していらっしゃいますからすこし待ってください。」',
    translation:
      'Ở phòng nghiên cứu của thầy Tanaka, thư ký nói: “Thầy đang nói chuyện với sinh viên khác, nên xin hãy chờ một chút.”',
    explanation:
      'Đáp án ★: lựa chọn 1 「すこし」. Thứ tự ghép là 4 → 2 → 1 → 3, vì vậy 「すこし」 nằm ở ô ★ thứ ba. Câu hoàn chỉnh: 「今、ほかの学生と話していらっしゃいますからすこし待ってください。」\nDịch: “Thầy đang nói chuyện với sinh viên khác, nên xin hãy chờ một chút.”\n1. 「すこし」= một chút; bổ nghĩa cho 「待ってください」 và chiếm ô ★.\n2. 「から」= vì/nên; đứng sau mệnh đề lý do 「話していらっしゃいます」, không đứng ở ô ★.\n3. 「待って」= chờ; ghép với 「ください」 thành yêu cầu lịch sự 「待ってください」, nằm cuối câu.\n4. 「いらっしゃいます」= đang (kính ngữ); ghép sau 「話して」 để nói kính trọng về hành động của thầy, trước 「から」.\nGhi nhớ: 「Vていらっしゃる」 là cách nói kính ngữ của 「Vている」; 「少し待ってください」 là lời nhờ lịch sự.',
  },
  {
    printedQuestion: 16,
    id: 'toan_q_2010_07_51',
    options: ['1. だろう', '2. と思って', '3. 大丈夫', '4. 出かけた'],
    order: [3, 1, 2, 4],
    starPosition: 2,
    answer: 2,
    before: '父も私も、今日はかさがなくても',
    after: 'が、雨に降られてしまった。',
    completed: '父も私も、今日はかさがなくても大丈夫だろうと思って出かけたが、雨に降られてしまった。',
    translation: 'Bố tôi và tôi nghĩ hôm nay ra ngoài không mang ô chắc cũng không sao, nhưng rồi lại bị mưa.',
    explanation:
      'Đáp án ★: lựa chọn 2 「と思って」. Thứ tự ghép là 3 → 1 → 2 → 4, nên mảnh thứ ba tại ô ★ là 「と思って」. Câu hoàn chỉnh: 「父も私も、今日はかさがなくても大丈夫だろうと思って出かけたが、雨に降られてしまった。」\nDịch: “Bố tôi và tôi nghĩ hôm nay ra ngoài không mang ô chắc cũng không sao, nhưng rồi lại bị mưa.”\n1. 「だろう」= chắc là/có lẽ; theo sau 「大丈夫」 để tạo phỏng đoán 「大丈夫だろう」, không ở ô ★.\n2. 「と思って」= nghĩ rằng rồi…; nối nhận định 「大丈夫だろう」 với hành động 「出かけた」 và nằm ở ô ★.\n3. 「大丈夫」= ổn/không sao; đi sau 「かさがなくても」 thành 「なくても大丈夫」.\n4. 「出かけた」= đã ra ngoài; là hành động chính, theo sau 「と思って」.\nGhi nhớ: 「～だろうと思う」 diễn tả phỏng đoán của người nói; 「～と思ってV」 nối suy nghĩ với hành động được thực hiện dựa trên suy nghĩ đó.',
  },
  {
    printedQuestion: 17,
    id: 'toan_q_2010_07_52',
    options: ['1. 生まれた', '2. ライオンの', '3. ばかりの', '4. 赤ちゃんを'],
    order: [1, 3, 2, 4],
    starPosition: 2,
    answer: 2,
    before: '昨日動物園に行ったら、先月',
    after: '見ることができました。',
    completed: '昨日動物園に行ったら、先月生まれたばかりのライオンの赤ちゃんを見ることができました。',
    translation: 'Hôm qua đến sở thú, tôi đã xem được một chú sư tử con vừa mới sinh tháng trước.',
    explanation:
      'Đáp án ★: lựa chọn 2 「ライオンの」. Thứ tự ghép là 1 → 3 → 2 → 4; 「ライオンの」 là mảnh thứ ba nên điền vào ô ★. Câu hoàn chỉnh: 「昨日動物園に行ったら、先月生まれたばかりのライオンの赤ちゃんを見ることができました。」\nDịch: “Hôm qua đến sở thú, tôi đã xem được một chú sư tử con vừa mới sinh tháng trước.”\n1. 「生まれた」= đã sinh/được sinh ra; bổ nghĩa cho 「ばかり」 trong cụm 「生まれたばかり」.\n2. 「ライオンの」= của sư tử; nối với 「赤ちゃん」 thành “sư tử con”, và nằm ở ô ★.\n3. 「ばかりの」= vừa mới; theo sau động từ 「生まれた」, rồi bổ nghĩa cho danh từ 「ライオンの赤ちゃん」.\n4. 「赤ちゃんを」= em bé/con non (đối tượng); ghép với 「見ることができました」 để nói đã xem được con non.\nGhi nhớ: 「Vたばかり」 diễn tả việc vừa mới xảy ra; 「Nの赤ちゃん」 là con non của N.',
  },
  {
    printedQuestion: 18,
    id: 'toan_q_2010_07_53',
    options: ['1. 意味だった', '2. という', '3. と思う', '4. ような'],
    order: [2, 4, 1, 3],
    starPosition: 1,
    answer: 4,
    before: 'ジョン「この『りかい』という言葉はどういう意味ですか。」アリ「ああ、確か『わかる』',
    after: 'んですけど。」',
    completed:
      'ジョン「この『りかい』という言葉はどういう意味ですか。」アリ「ああ、確か『わかる』というような意味だったと思うんですけど。」',
    translation:
      'John hỏi: “Từ ‘りかい’ này có nghĩa là gì?” Ali trả lời: “À, hình như nó có nghĩa kiểu như ‘わかる’ (hiểu), nhưng tôi không chắc lắm.”',
    explanation:
      'Đáp án ★: lựa chọn 4 「ような」. Thứ tự là 2 → 4 → 1 → 3; ô ★ nằm ở vị trí thứ hai nên nhận 「ような」. Câu hoàn chỉnh: 「ああ、確か『わかる』というような意味だったと思うんですけど。」\nDịch: “À, hình như nó có nghĩa kiểu như ‘わかる’ (hiểu), nhưng tôi không chắc lắm.”\n1. 「意味だった」= đã là nghĩa/ý nghĩa; là danh từ trung tâm của cụm 「ような意味」, đứng sau 「ような」.\n2. 「という」= gọi là/rằng; nối từ được trích dẫn 「わかる」 với phần giải thích 「ような意味」.\n3. 「と思う」= tôi nghĩ; theo sau 「意味だった」 để hoàn tất nhận định dè dặt 「意味だったと思う」.\n4. 「ような」= như/kiểu như; bổ nghĩa cho danh từ 「意味」 trong cụm 「というような意味」 và nằm ở ô ★.\nGhi nhớ: 「Aというような意味」 nghĩa là “ý nghĩa kiểu như A”; 「～と思うんですけど」 làm lời giải thích mềm, không khẳng định tuyệt đối.',
  },
]

const q18 = entries[4]
q18.explanation = q18.explanation
  .replace(
    'Câu hoàn chỉnh: 「ああ、確か『わかる』というような意味だったと思うんですけど。」',
    `Câu hoàn chỉnh: ${q18.completed}`
  )
  .replace(
    'Dịch: “À, hình như nó có nghĩa kiểu như ‘わかる’ (hiểu), nhưng tôi không chắc lắm.”',
    `Dịch: “${q18.translation}”`
  )

const normalize = (value) =>
  String(value || '')
    .normalize('NFKC')
    .replace(/^\s*[1-4][.．、\s　]*/u, '')
    .replace(/\s+/gu, '')

const exams = JSON.parse(fs.readFileSync(masterPath, 'utf8'))
const curated = JSON.parse(fs.readFileSync(curatedPath, 'utf8'))
const exam = exams.find((entry) => entry.id === 'toan-n3-201007-full')
assert.ok(exam, 'Missing JLPT N3 July 2010 exam')
const questions = new Map(exam.parts.flatMap((part) => part.questions || []).map((question) => [question.id, question]))

for (const entry of entries) {
  const question = questions.get(entry.id)
  assert.ok(question, `Missing printed ★ question ${entry.printedQuestion}`)
  assert.deepEqual(question.options.map(normalize), entry.options.map(normalize), `${entry.id}: source options changed`)
  assert.deepEqual(
    question.starPrompt,
    { before: entry.before, after: entry.after },
    `${entry.id}: source prompt changed`
  )
  assert.deepEqual(question.starCorrectOrder, entry.order, `${entry.id}: source order changed`)
  assert.equal(question.starPosition, entry.starPosition, `${entry.id}: source star slot changed`)
  assert.equal(question.correctAnswer, entry.answer, `${entry.id}: saved answer changed`)
  assert.equal(entry.order[entry.starPosition], entry.answer, `${entry.id}: answer is not the fragment in the ★ slot`)

  question.explanation = entry.explanation
  question.starOrderVerified = true
  question.starPositionVerified = true
  question.starVerificationStatus = 'verified-against-source'
  question.starVerificationSources = [sourceUrl]
  question.starVerificationNote =
    'Visually checked against page 8 of the supplied July 2010 PDF in Google Drive; the text layer and rendered page agree on the four fragments and ★ slot. The completed sentence and grammar were checked. No official JLPT answer key was established.'
  curated[entry.id] = entry.explanation
}

fs.writeFileSync(masterPath, `${JSON.stringify(exams, null, 2)}\n`, 'utf8')
fs.writeFileSync(curatedPath, `${JSON.stringify(curated, null, 2)}\n`, 'utf8')

const report = {
  reviewedAt: '2026-09-27',
  exam: 'JLPT N3 July 2010, Grammar Mondai 2',
  sourcePdf: {
    title: '1. N3 7-2010.pdf',
    driveFileId: '1whWNU3gUS-FZrbUgLakfxk5P8lW8w9nX',
    url: sourceUrl,
    renderedPage: 8,
    method:
      'Visually inspected the rendered page in Google Drive and cross-checked the PDF text layer. Transcribed all five prompts and options, verified each printed ★ slot, reconstructed every sentence, and reviewed the selected piece and Vietnamese explanation against the sentence grammar.',
  },
  answerKey: {
    officialKeyEstablished: false,
    basis:
      'Each selected option is the fragment that occupies the printed ★ slot in the reconstructed sentence. No separate official JLPT key was independently established for this batch.',
  },
  questions: entries.map((entry) => ({
    printedQuestion: entry.printedQuestion,
    questionId: entry.id,
    promptBefore: entry.before,
    promptAfter: entry.after,
    sourceOptions: entry.options,
    order: entry.order,
    starSlotIndexZeroBased: entry.starPosition,
    answer: entry.answer,
    completedSentence: entry.completed,
    translation: entry.translation,
    explanationCoverage: {
      allFragmentsExplainedByRole: true,
      starSlotAndAnswerExplained: true,
      completedSentenceAndTranslation: true,
      grammarSummary: true,
    },
    status: 'verified-against-supplied-source',
  })),
}
fs.mkdirSync(path.dirname(reportPath), { recursive: true })
fs.writeFileSync(reportPath, `${JSON.stringify(report, null, 2)}\n`, 'utf8')
console.log(`Reviewed source transcription and explanations for ${entries.length} JLPT N3 07/2010 star questions.`)
