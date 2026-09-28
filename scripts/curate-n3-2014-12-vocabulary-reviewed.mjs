import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'

const root = path.resolve('.')
const masterPath = path.join(root, 'data/jlpt_n3_toan_master.json')
const curatedPath = path.join(root, 'data/jlpt_n3_explanations_curated.json')
const reviewPath = path.join(root, 'reports/n3-quality-audit/vocabulary-source-2014-12-review.json')
const examSource = 'https://drive.google.com/file/d/1YhA5giAFeFjf1aUb3HjahysLC6-wP1zR/view'
const answerSource = 'https://drive.google.com/file/d/1Lmr3LwhnS3lEv4FYemiM0f93Qg5DLNZL/view'
const exams = JSON.parse(fs.readFileSync(masterPath, 'utf8'))
const curated = JSON.parse(fs.readFileSync(curatedPath, 'utf8'))
const exam = exams.find((item) => item.id === 'toan-n3-201412-full')
assert.ok(exam, 'Missing JLPT N3 12/2014 full exam')
const questions = new Map(exam.parts.flatMap((part) => part.questions).map((question) => [question.id, question]))
const vocabQuestions = exam.parts
  .filter((part) => part.title.includes('(Từ vựng)'))
  .flatMap((part) => part.questions)
  .sort((left, right) => left.number - right.number)
assert.equal(vocabQuestions.length, 35, 'Expected 35 vocabulary questions')

const answerKey = [2, 3, 3, 2, 3, 2, 1, 4, 2, 4, 1, 2, 1, 2, 2, 2, 3, 1, 1, 4, 4, 2, 2, 1, 4, 4, 3, 1, 4, 3, 2, 3, 1, 2, 4]
for (const [index, question] of vocabQuestions.entries()) {
  const expected = answerKey[index]
  assert.equal(question.answer, expected, 'Answer differs from PDF key at question ' + (index + 1))
  assert.equal(question.correctAnswer, expected, 'correctAnswer differs from PDF key at question ' + (index + 1))
}

const explanations = {
  toan_q_2014_12_9: [
    'Đáp án 2 — 「ちゅうしゃ」 là 「駐車」, nghĩa là đỗ xe. Dịch: “Không được đỗ xe ở địa điểm này”.',
    '1. 「駅」 là nhà ga; 「駅車」 không viết từ ちゅうしゃ.',
    '2. 「駐車」 (ちゅうしゃ): đỗ xe; đúng cả cách viết lẫn nghĩa.',
    '3. 「停車」 (ていしゃ): dừng xe; là từ khác.',
    '4. 「卓」 là bàn; 「卓車」 không phải cách viết của từ này.',
    'Ghi nhớ: 駐車 = đỗ xe; 停車 = dừng xe.'
  ].join('\n'),
  toan_q_2014_12_10: [
    'Đáp án 4 — 「移る」 viết là 「移りました」, nghĩa là chuyển sang/chuyển địa điểm. Dịch: “Văn phòng đã chuyển sang tòa nhà mới”.',
    '1. 「着る」: mặc quần áo; không diễn tả văn phòng chuyển nơi.',
    '2. 「到る」: tới/đạt đến; cách viết và cách đọc không phải うつる.',
    '3. 「動」 gợi ý chuyển động, nhưng 「動りました」 không phải dạng viết chuẩn của うつりました.',
    '4. 「移る」 (うつる): chuyển sang nơi khác; phù hợp với 事務所が新しいビルに移る.'
  ].join('\n'),
  toan_q_2014_12_11: [
    'Đáp án 1 — 「温泉」（おんせん） là suối nước nóng. Dịch: “Tôi đã lần đầu đến một suối nước nóng ở Nhật”.',
    '1. 「温泉」: suối nước nóng; từ chuẩn đọc là おんせん.',
    '2. 「湯」 là nước nóng và 「泉」 là suối, nhưng 「湯泉」 không phải cách viết chuẩn của おんせん.',
    '3. 「温」 là ấm/nóng, 「池」 là ao; 「温池」 không viết おんせん.',
    '4. 「湯池」 ghép nước nóng với ao, không phải từ chỉ onsen.'
  ].join('\n'),
  toan_q_2014_12_12: [
    'Đáp án 2 — 「ざっし」 viết là 「雑誌」, nghĩa là tạp chí. Dịch: “Tôi đã mua một cuốn tạp chí nước ngoài”.',
    '1. 「稚」 mang nghĩa non trẻ; 「志」 là ý chí/nguyện vọng. 「稚志」 không phải từ tạp chí.',
    '2. 「雑誌」 (ざっし): tạp chí; cách viết đúng.',
    '3. 「稚誌」 không phải cách viết chuẩn của tạp chí.',
    '4. 「雑」 là tạp/thập cẩm, 「志」 là ý chí; phải dùng 「誌」 (ấn phẩm/tạp chí), không phải 「志」.'
  ].join('\n'),
  toan_q_2014_12_13: [
    'Đáp án 1 — 「恋しい」（こいしい） nghĩa là nhớ nhung, mong nhớ. Dịch: “Thỉnh thoảng tôi lại nhớ da diết món ăn mẹ nấu”.',
    '1. 「恋しく」: nhớ nhung/tha thiết mong; đúng cách viết của こいしく.',
    '2. 「愛しい」 thường đọc いとしい, nghĩa là yêu quý/đáng yêu; không viết こいしい trong câu này.',
    '3. 「親しい」 đọc したしい, nghĩa là thân thiết; không khớp cách đọc.',
    '4. 「好しい」 không phải cách viết thông thường của こいしい.'
  ].join('\n'),
  toan_q_2014_12_14: [
    'Đáp án 2 — 「仮定」（かてい） là giả định. Dịch: “Hãy thử giả định rằng câu chuyện đó là đúng”.',
    '1. 「科」 là môn/khoa học; 「科定」 không phải từ mang nghĩa giả định.',
    '2. 「仮定」: giả định; khớp cả cách đọc và ngữ cảnh.',
    '3. 「課」 là bài học/bộ phận; 「課定」 không mang nghĩa giả định.',
    '4. 「化」 là biến đổi/thay đổi; 「化定」 không phải cách viết của かてい.'
  ].join('\n'),
  toan_q_2014_12_15: [
    'Đáp án 2 — 「目標」（もくひょう） là mục tiêu. Dịch: “Mục tiêu của chúng tôi là đạt hạng nhất ở giải đấu tới”.',
    '1. 「予報」: dự báo/thông báo trước, thường về thời tiết; không phải điều nhóm muốn đạt được.',
    '2. 「目標」: mục tiêu/đích cần đạt; phù hợp với việc đứng thứ nhất.',
    '3. 「効果」: hiệu quả/tác dụng; không chỉ mục tiêu.',
    '4. 「完成」: sự hoàn thành/hoàn tất; không kết hợp với việc trở thành hạng nhất.'
  ].join('\n'),
  toan_q_2014_12_16: [
    'Đáp án 2 — Cụm 「目が覚める」 nghĩa là tỉnh giấc. Dịch: “Tối qua, khi đang ngủ, tôi nghe tiếng động lớn và tỉnh dậy”.',
    '1. 「驚く」: ngạc nhiên/giật mình; 「目が驚く」 không phải cách nói diễn tả tỉnh giấc.',
    '2. 「覚める」: tỉnh; 「目が覚める」 là kết hợp tự nhiên.',
    '3. 「感じる」: cảm nhận; không dùng trong cụm này.',
    '4. 「気付く」: nhận ra/chú ý; 「目が気付く」 không có nghĩa “tỉnh giấc”.'
  ].join('\n'),
  toan_q_2014_12_17: [
    'Đáp án 3 — 「テーマ」 nghĩa là chủ đề. Dịch: “Tôi định viết bài báo cáo lần này với chủ đề là vấn đề môi trường”.',
    '1. 「プログラム」: chương trình; không phải chủ đề của bài báo cáo.',
    '2. 「ヒント」: gợi ý; không nói điều bài viết tập trung vào.',
    '3. 「テーマ」: chủ đề; 「環境問題というテーマ」 là chủ đề vấn đề môi trường.',
    '4. 「インフォメーション」: thông tin; không tự nhiên trong mẫu 「～というテーマで書く」.'
  ].join('\n'),
  toan_q_2014_12_18: [
    'Đáp án 1 — 「穴」（あな） là lỗ thủng. Dịch: “Có một lỗ ở đáy túi nên một vài món bánh kẹo đã rơi ra”.',
    '1. 「穴」: lỗ; 「穴があく」 là bị thủng/lộ ra một cái lỗ.',
    '2. 「傷」: vết xước/vết thương; không diễn tả chỗ hở khiến đồ vật rơi ra.',
    '3. 「けが」: thương tích trên cơ thể; không thể là chỗ thủng ở đáy túi.',
    '4. 「汚れ」: vết bẩn; không làm bánh kẹo rơi khỏi túi.'
  ].join('\n'),
  toan_q_2014_12_19: [
    'Đáp án 1 — 「合計」（ごうけい） là tổng cộng. Dịch: “Chuyến đi này tốn tổng cộng 15.000 yên: 5.000 yên tiền đi lại và 10.000 yên tiền khách sạn”.',
    '1. 「合計」: tổng số/tổng cộng; đúng vì cộng hai khoản tiền.',
    '2. 「共通」: điểm chung/dùng chung; không nói tổng chi phí.',
    '3. 「全体」: toàn bộ/tổng thể; không dùng tự nhiên để nêu tổng số tiền trong câu này.',
    '4. 「集中」: tập trung; không diễn tả phép cộng.'
  ].join('\n'),
  toan_q_2014_12_20: [
    'Đáp án 4 — 「悔しい」（くやしい） diễn tả sự ấm ức/tiếc nuối vì thất bại. Dịch: “Dù rất muốn vô địch hôm nay, tôi đã thua nên vô cùng ấm ức”.',
    '1. 「くさい」: có mùi hôi; không hợp cảm xúc sau trận thua.',
    '2. 「うるさい」: ồn ào; không diễn tả tiếc vì thua.',
    '3. 「こわい」: đáng sợ/sợ hãi; không khớp với ý câu.',
    '4. 「くやしい」: ấm ức, tiếc nuối vì không đạt điều mình muốn; đúng ngữ cảnh.'
  ].join('\n'),
  toan_q_2014_12_21: [
    'Đáp án 4 — 「手をぶつける」 là va/đập tay vào vật gì. Dịch: “Lúc nãy tôi va tay vào góc bàn nên đến giờ vẫn hơi đau”.',
    '1. 「振る」: vẫy/lắc; không gây nghĩa va vào góc bàn.',
    '2. 「握る」: nắm/chụp lấy; không hợp với 「机の角に」.',
    '3. 「重ねる」: chồng/xếp lên; không diễn tả va đập.',
    '4. 「ぶつける」: làm va mạnh vào; 「角に手をぶつける」 khớp câu.'
  ].join('\n'),
  toan_q_2014_12_22: [
    'Đáp án 2 — 「間隔」（かんかく） là khoảng cách giữa các vật. Dịch: “Hãy xếp ghế trong phòng cách nhau một mét”.',
    '1. 「順番」: thứ tự; không thể đo bằng một mét trong câu này.',
    '2. 「間隔」: khoảng cách/khoảng cách đều giữa các vật; đúng với cách xếp ghế.',
    '3. 「方向」: phương hướng; không chỉ khoảng cách giữa ghế.',
    '4. 「位置」: vị trí; cần 「1メートルの間隔」 để nói khoảng cách.'
  ].join('\n'),
  toan_q_2014_12_23: [
    'Đáp án 2 — 「くせ」 ở đây là thói quen vô thức. Dịch: “Khi căng thẳng lúc nói ý kiến trước mọi người, tôi có thói quen cứ chạm vào mũi”.',
    '1. 「決まり」: quy định/lệ thường; không phải phản ứng vô thức của cá nhân.',
    '2. 「くせ」: thói quen khó tự nhận ra; 「鼻を触ってしまうくせ」 dùng đúng.',
    '3. 「かたち」: hình dạng; không kết hợp với 「があります」 theo nghĩa thói quen.',
    '4. 「続き」: phần tiếp theo/sự tiếp diễn; không phù hợp.'
  ].join('\n'),
  toan_q_2014_12_24: [
    'Đáp án 1 — 「ふらふら」 diễn tả trạng thái choáng váng, đứng đi không vững. Dịch: “Tôi bị cảm và sốt cao nên người cứ choáng váng”.',
    '1. 「ふらふら」: choáng váng/lảo đảo; phù hợp với sốt cao.',
    '2. 「ばらばら」: rời rạc/tách rời; không tả tình trạng cơ thể.',
    '3. 「からから」: khô khốc/khát khô; không nói về choáng váng.',
    '4. 「ぺらぺら」: nói trôi chảy hoặc mỏng dẹt; không hợp với triệu chứng.'
  ].join('\n'),
  toan_q_2014_12_25: [
    'Đáp án 4 — 「当日」（とうじつ） là đúng ngày diễn ra sự kiện. Dịch: “Chủ nhật tuần sau là cuộc thi hùng biện. Hãy đến hội trường lúc 10 giờ vào chính ngày thi”.',
    '1. 「平日」: ngày trong tuần, thường đối lập với ngày nghỉ; không phải ngày thi đã nêu.',
    '2. 「本日」: hôm nay; không phù hợp với sự kiện tuần sau.',
    '3. 「先日」: hôm trước/một ngày gần đây trong quá khứ; không chỉ ngày sắp tới.',
    '4. 「当日」: ngày được nhắc tới, ở đây là ngày diễn ra cuộc thi.'
  ].join('\n'),
  toan_q_2014_12_26: [
    'Đáp án 4 — 「きつい」 ở đây là vất vả/nặng nhọc; gần nghĩa với 「大変」. Dịch: “Công việc này rất vất vả”.',
    '1. 「簡単」: đơn giản/dễ; trái nghĩa trong ngữ cảnh.',
    '2. 「つまらない」: chán tẻ; nói về mức độ thú vị, không phải độ nặng nhọc.',
    '3. 「楽しい」: vui/thú vị; không đồng nghĩa.',
    '4. 「大変」: vất vả/khó khăn; gần nghĩa nhất ở đây.'
  ].join('\n'),
  toan_q_2014_12_27: [
    'Đáp án 3 — 「案」（あん） là ý tưởng hoặc đề xuất. Dịch: “Đó là một ý tưởng hay”.',
    '1. 「チャンス」: cơ hội; không phải nội dung được đề xuất.',
    '2. 「サービス」: dịch vụ/sự phục vụ; không đồng nghĩa với ý tưởng.',
    '3. 「アイディア」: ý tưởng; gần nghĩa nhất với 「案」.',
    '4. 「ニュース」: tin tức; không phải đề xuất.'
  ].join('\n'),
  toan_q_2014_12_28: [
    'Đáp án 1 — 「くたびれた」 nghĩa là mệt rã rời, gần nghĩa với 「疲れた」. Dịch: “Hôm qua tôi thật sự mệt rã rời”.',
    '1. 「疲れた」: mệt; đồng nghĩa gần nhất.',
    '2. 「困った」: gặp khó/bối rối; không phải mệt.',
    '3. 「眠かった」: buồn ngủ; khác với kiệt sức.',
    '4. 「恥ずかしかった」: xấu hổ/ngượng; là cảm xúc khác.'
  ].join('\n'),
  toan_q_2014_12_29: [
    'Đáp án 4 — 「約」（やく） nghĩa là khoảng/xấp xỉ. Dịch: “Hành lý nặng khoảng 10 kg”.',
    '1. 「10キロ以上」: từ 10 kg trở lên; nêu một ngưỡng, không phải xấp xỉ.',
    '2. 「10キロ以下」: không quá 10 kg; cũng là ngưỡng.',
    '3. 「ちょうど10キロ」: đúng chính xác 10 kg.',
    '4. 「だいたい10キロ」: khoảng 10 kg; gần nghĩa nhất với 「約10キロ」.'
  ].join('\n'),
  toan_q_2014_12_30: [
    'Đáp án 3 — 「指導する」 là hướng dẫn/giảng dạy. Lựa chọn đúng là 「教えています」. Dịch: “Anh Yamada đang hướng dẫn cách sử dụng chiếc máy này”.',
    '1. 「考えています」: đang suy nghĩ; không đồng nghĩa với hướng dẫn.',
    '2. 「習っています」: đang học; đổi người dạy thành người học.',
    '3. 「教えています」: đang dạy/chỉ cách làm; gần nghĩa nhất với 指導しています.',
    '4. 「調べています」: đang tra cứu/kiểm tra; không diễn tả việc chỉ dẫn người khác.'
  ].join('\n')
}

for (const [id, explanation] of Object.entries(explanations)) {
  const question = questions.get(id)
  assert.ok(question, 'Missing vocabulary question ' + id)
  question.explanation = explanation
  curated[id] = explanation
}

const sourceQuestions = [
  {
    id: 'toan_q_2014_12_18',
    sourceStem: '袋の底に（　）があいていたので、入れたお菓子がいくつか落ちてしまった。',
    sourceOptions: ['穴', '傷', 'けが', '汚れ'],
    answer: 1,
    oldOption: '４. 汚れ',
    page: 2
  },
  {
    id: 'toan_q_2014_12_30',
    sourceStem: '山田さんはこの機械の使い方を指導しています。',
    sourceOptions: ['考えています', '習っています', '教えています', '調べています'],
    answer: 3,
    oldOption: '3.教えていています',
    page: 3
  }
]

const normalizeText = (value) =>
  String(value || '')
    .replace(/<[^>]*>/gu, '')
    .replace(/^\s*\[\d+\]\s*/u, '')
    .normalize('NFKC')
    .replace(/\s+/gu, '')
const normalizeOption = (value) =>
  String(value || '')
    .replace(/<[^>]*>/gu, '')
    .normalize('NFKC')
    .replace(/^\s*[1-4][.．、\s]*/u, '')
    .replace(/\s+/gu, '')

for (const reviewed of sourceQuestions) {
  const question = questions.get(reviewed.id)
  assert.ok(question, 'Missing source-reviewed question ' + reviewed.id)
  const priorOptions = question.options.map(normalizeOption)
  const sourceOptions = reviewed.sourceOptions.map(normalizeOption)
  const priorMatches = JSON.stringify(priorOptions) === JSON.stringify(sourceOptions)
  const knownTranscriptionError = question.options.includes(reviewed.oldOption)
  assert.ok(priorMatches || knownTranscriptionError, 'Unexpected prior source text at ' + reviewed.id)
  question.options = reviewed.sourceOptions.map((option, index) => (index + 1) + '. ' + option)
  assert.equal(normalizeText(question.question), normalizeText(reviewed.sourceStem), 'Stem differs from PDF: ' + reviewed.id)
  assert.deepEqual(question.options.map(normalizeOption), sourceOptions, 'Options differ from PDF: ' + reviewed.id)
  assert.equal(question.answer, reviewed.answer, 'Answer differs from answer PDF: ' + reviewed.id)
  assert.equal(question.correctAnswer, reviewed.answer, 'correctAnswer differs from answer PDF: ' + reviewed.id)
  question.sourceVerificationStatus = 'verified'
  question.sourceVerificationSources = [examSource, answerSource]
}

const review = {
  examId: exam.id,
  reviewedOn: '2026-09-26',
  scope: 'JLPT N3 12/2014 vocabulary answer-key comparison for questions 1–35, plus source transcription review for questions 18 and 30.',
  sources: {
    examPdf: { url: examSource, viewedPages: [1, 2, 3] },
    answerKeyPdf: { url: answerSource, viewedPage: 10, officialStatus: 'not established' }
  },
  answerKeyQuestions: vocabQuestions.map((question, index) => ({
    questionId: question.id,
    number: index + 1,
    answer: answerKey[index],
    matched: true
  })),
  sourceTranscriptionQuestions: sourceQuestions.map((question) => ({
    questionId: question.id,
    sourceStem: question.sourceStem,
    sourceOptions: question.sourceOptions,
    answer: question.answer,
    examPdfPage: question.page,
    answerKeyPdfPage: 10,
    verified: true
  })),
  corrections: [
    {
      questionId: 'toan_q_2014_12_18',
      field: 'options[3]',
      before: '４. 汚れ',
      after: '4. 汚れ',
      reason: 'Remove the duplicated option number; the source prints option 4 as 汚れ.'
    },
    {
      questionId: 'toan_q_2014_12_30',
      field: 'options[2]',
      before: '3.教えていています',
      after: '3. 教えています',
      reason: 'Restore the printed option from the exam PDF.'
    },
    {
      scope: 'questions 9–30',
      field: 'explanation',
      reason: 'Replace inaccurate dictionary glosses with contextual Vietnamese meanings and concise distractor explanations.'
    }
  ]
}

fs.writeFileSync(masterPath, JSON.stringify(exams, null, 2) + '\n')
fs.writeFileSync(curatedPath, JSON.stringify(curated, null, 2) + '\n')
fs.writeFileSync(reviewPath, JSON.stringify(review, null, 2) + '\n')
console.log('Updated vocabulary explanations 9–30, matched all 35 answers with the PDF key, and corrected source text for questions 18 and 30.')
