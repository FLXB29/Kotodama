import fs from 'node:fs'
import path from 'node:path'
import prettier from 'prettier'

const masterPath = 'data/jlpt_n3_toan_master.json'
const curatedPath = 'data/jlpt_n3_explanations_curated.json'
const reportPath = 'reports/n3-quality-audit/vocabulary-2013-07-q15-30-review.json'
const examId = 'toan-n3-201307-full'
const apply = process.argv.includes('--apply')
const reviews = [
  {
    number: 15,
    answer: 4,
    options: ['ふらふらなので', 'ぺこぺこなので', 'すいたので', 'かわいたので'],
    explanation: [
      'Đáp án 4 — 「のどがかわく」là khát nước; cổ họng bị khô nên muốn uống gì đó.',
      'Dịch: “Tôi khát nên muốn uống thứ gì đó.”',
      '1. ふらふらなので: vì choáng/váng, đi đứng loạng choạng; không diễn tả khát.',
      '2. ぺこぺこなので: vì đói cồn cào; thường nói おなかがぺこぺこ, không phải のどがぺこぺこ.',
      '3. すいたので: vì đói/rỗng (おなかがすく); không phải cách nói tự nhiên cho cổ họng khát.',
      '4. かわいたので: vì bị khô; のどがかわく là cách nói cố định “khát nước”.',
    ].join('\n'),
  },
  {
    number: 16,
    answer: 3,
    options: ['連休', '故障', '渋滞', '集中'],
    explanation: [
      'Đáp án 3 — 「道が渋滞している」là đường đang tắc nghẽn; vì thế xe không thể tiến lên.',
      'Dịch: “Do đang thi công nên đường bị tắc, xe hoàn toàn không tiến lên được.”',
      '1. 連休（れんきゅう）: kỳ nghỉ liên tiếp; không kết hợp với 道が〜している để nói giao thông tắc.',
      '2. 故障（こしょう）: sự cố/hỏng hóc của máy móc hoặc thiết bị; không phải tình trạng ùn xe trên đường.',
      '3. 渋滞（じゅうたい）: ùn tắc giao thông; cụm 道が渋滞する dùng đúng.',
      '4. 集中（しゅうちゅう）: tập trung/dồn vào một chỗ; không diễn tả xe đứng im vì kẹt đường.',
    ].join('\n'),
  },
  {
    number: 17,
    answer: 2,
    options: ['まずいい', 'おかしい', 'きびしいの', 'しつこい'],
    explanation: [
      'Đáp án 2 — 「音がおかしい」nghĩa là âm thanh nghe bất thường/lạ; vì vậy người nói nhờ sửa động cơ.',
      'Dịch: “Động cơ xe phát ra tiếng lạ nên tôi đã nhờ sửa.”',
      '1. まずいい: dạng được in trong lựa chọn không phải từ chuẩn theo nghĩa cần tìm; không tự sửa thành まずい để đoán đáp án.',
      '2. おかしい: kỳ lạ/bất thường hoặc có vấn đề; dùng tự nhiên để tả tiếng động cơ.',
      '3. きびしいの: きびしい là nghiêm khắc/khắc nghiệt; thêm の làm lựa chọn không khớp ngữ pháp của chỗ trống.',
      '4. しつこい: dai dẳng/quá nồng; không phải cách nói thông thường để mô tả động cơ có tiếng bất thường.',
      'Ghi chú nguồn: lựa chọn 1 được giữ nguyên như dữ liệu in/chép; cần đối chiếu bản đề gốc trước khi kết luận đó là lỗi của đề hay lỗi chép.',
    ].join('\n'),
  },
  {
    number: 18,
    answer: 3,
    options: ['移動', '変化', '交換', '入力'],
    explanation: [
      'Đáp án 3 — 「電池を交換する」là thay pin; đồng hồ dừng nên lắp pin mới.',
      'Dịch: “Đồng hồ đã ngừng chạy nên tôi thay pin mới.”',
      '1. 移動（いどう）: di chuyển một vật/người từ nơi này sang nơi khác; không dùng cho thay pin.',
      '2. 変化（へんか）: sự biến đổi trạng thái/tính chất, không phải thao tác thay một viên pin.',
      '3. 交換（こうかん）: đổi/thay vật này bằng vật khác; 電池を交換する là thay pin.',
      '4. 入力（にゅうりょく）: nhập dữ liệu/chữ vào thiết bị; không liên quan đến pin.',
    ].join('\n'),
  },
  {
    number: 19,
    answer: 1,
    options: ['リサイクル', 'キャンセル', 'カット', 'チェンジ'],
    explanation: [
      'Đáp án 1 — Tái chế lon và chai nhựa thay vì vứt chúng giúp giảm lượng rác.',
      'Dịch: “Nếu tái chế cả lon và chai nhựa thay vì vứt đi thì lượng rác sẽ giảm.”',
      '1. リサイクル: tái chế; kết hợp tự nhiên với すれば và đúng mục tiêu giảm rác.',
      '2. キャンセル: hủy (đơn, lịch hẹn, đặt chỗ); không phải xử lý rác để dùng lại.',
      '3. カット: cắt/giảm; câu cần một hành động xử lý lon và chai, không phải “cắt chúng”.',
      '4. チェンジ: thay đổi/đổi; không diễn tả việc tái sử dụng vật liệu.',
    ].join('\n'),
  },
  {
    number: 20,
    answer: 4,
    options: ['文句', '宣伝', 'うその', 'うわさ'],
    explanation: [
      'Đáp án 4 — 「結婚するといううわさ」là tin đồn rằng anh Hayashi sẽ kết hôn; người nói nghe được nhưng chưa biết có thật không.',
      'Dịch: “Tôi nghe tin đồn rằng anh Hayashi sắp kết hôn, nhưng không biết có thật hay không.”',
      '1. 文句（もんく）: lời phàn nàn/than phiền; không phải thông tin về chuyện kết hôn.',
      '2. 宣伝（せんでん）: quảng bá/tuyên truyền; không hợp với tin riêng tư đang cần xác minh.',
      '3. うその: “giả/dối” ở dạng bổ nghĩa danh từ; câu đã có 「という」và cần danh từ chỉ thông tin chưa xác thực, nên うわさ tự nhiên hơn.',
      '4. うわさ: lời đồn/chuyện truyền miệng chưa được xác nhận; khớp với 本当かどうかわからない.',
    ].join('\n'),
  },
  {
    number: 21,
    answer: 4,
    options: ['かならず', 'すべて', 'じゅうぶんの', 'おもに'],
    explanation: [
      'Đáp án 4 — 「おもに学生だったが、ほかに主婦や会社員も少しいた」nghĩa là người tham dự chủ yếu là sinh viên, ngoài ra còn có một số nội trợ và nhân viên công ty.',
      'Dịch: “Người tham dự buổi diễn thuyết chủ yếu là sinh viên, ngoài ra còn có một số nội trợ và nhân viên công ty.”',
      '1. かならず: nhất định/luôn luôn; không diễn tả nhóm chiếm phần lớn.',
      '2. すべて: tất cả; mâu thuẫn với vế sau nói còn có người nội trợ và nhân viên công ty.',
      '3. じゅうぶんの: “đủ/đầy đủ”; dạng này không bổ nghĩa tự nhiên cho 学生 trong câu.',
      '4. おもに: chủ yếu; hợp với thông tin rằng phần lớn người tham dự là sinh viên.',
    ].join('\n'),
  },
  {
    number: 22,
    answer: 1,
    options: ['不安', '無理', '退屈', '苦手'],
    explanation: [
      'Đáp án 1 — 「不安だった」là đã lo lắng/bất an về việc liệu mình có thể làm công việc quan trọng ấy không.',
      'Dịch: “Ban đầu tôi lo không biết mình có làm nổi công việc quan trọng như thế này hay không.”',
      '1. 不安（ふあん）: lo lắng/bất an; hợp với sự không chắc chắn 初めは.',
      '2. 無理（むり）: bất khả thi/quá sức; nói thẳng việc không thể làm, không phải cảm xúc phân vân ban đầu.',
      '3. 退屈（たいくつ）: buồn chán; không liên quan đến nghi ngờ năng lực của mình.',
      '4. 苦手（にがて）: không giỏi/không thích làm một việc; khác với cảm giác lo lắng được nêu trong câu.',
    ].join('\n'),
  },
  {
    number: 23,
    answer: 2,
    options: ['ずいぶん', 'なるべく', 'きっとり', 'さっそく'],
    explanation: [
      'Đáp án 2 — 「なるべく早く連絡する」là liên lạc sớm nhất/càng sớm càng tốt trong khả năng.',
      'Dịch: “Khi có việc khiến anh/chị không thuận tiện, xin hãy liên lạc sớm nhất có thể.”',
      '1. ずいぶん: khá/rất nhiều hoặc vượt dự kiến; không kết hợp với 早く để tạo lời nhờ “càng sớm càng tốt”.',
      '2. なるべく: hết mức có thể; 「なるべく早く」là cụm tự nhiên trong yêu cầu này.',
      '3. きっとり: không phải dạng từ chuẩn trong tiếng Nhật hiện đại; không tự sửa thành từ khác.',
      '4. さっそく: ngay lập tức; có thể diễn tả bắt đầu làm ngay, nhưng ở đây yêu cầu báo sớm nhất có thể khi lịch trở nên bất tiện nên なるべく早く phù hợp hơn.',
    ].join('\n'),
  },
  {
    number: 24,
    answer: 4,
    options: ['とめての', 'やめて', 'さげて', 'とじて'],
    explanation: [
      'Đáp án 4 — 「目を閉じていた」là nhắm mắt suốt; vì thế người khác tưởng anh Yamada đang ngủ.',
      'Dịch: “Trong suốt cuộc họp, anh Yamada nhắm mắt nên tôi tưởng anh ấy đang ngủ.”',
      '1. とめての: lựa chọn này không tạo được cụm ngữ pháp với いた; 目を止める có nghĩa dừng mắt/để ý, không phải nhắm mắt.',
      '2. やめて: dạng て của やめる (dừng/bỏ); 「目をやめる」không phải kết hợp tự nhiên.',
      '3. さげて: hạ xuống; 「目を下げる」là hạ mắt, không diễn tả nhắm mắt.',
      '4. とじて: thể て của 閉じる; 「目を閉じる」là nhắm mắt, đúng với suy đoán đang ngủ.',
    ].join('\n'),
  },
  {
    number: 25,
    answer: 3,
    options: ['締めて', '曲げて', 'たたんで', 'むすんで'],
    explanation: [
      'Đáp án 3 — Áo len được gấp gọn rồi cất vào ngăn kéo; たたむ là gấp quần áo.',
      'Dịch: “Tôi gấp áo len ngay ngắn rồi cất vào ngăn kéo tủ.”',
      '1. 締めて（しめて）: siết/chốt/đeo cho chặt (ví dụ dây lưng); không phải gấp áo.',
      '2. 曲げて（まげて）: bẻ/uốn cong; không phải cách cất áo len ngay ngắn.',
      '3. たたんで: gấp lại; cách dùng đúng với quần áo trước khi cất.',
      '4. むすんで（結んで）: buộc/thắt nút; không dùng để gấp áo len.',
    ].join('\n'),
  },
  {
    number: 26,
    answer: 1,
    options: ['大きさ', '値段', '色', '形'],
    explanation: [
      'Đáp án 1 — サイズ là kích cỡ/độ lớn; người nói hỏi có chiếc đĩa cùng kích cỡ hay không.',
      'Dịch: “Có chiếc đĩa nào cùng kích cỡ với chiếc này không?”',
      '1. 大きさ（おおきさ）: độ lớn/kích thước; gần nghĩa nhất với サイズ.',
      '2. 値段（ねだん）: giá tiền; là giá trị mua bán, không phải kích cỡ.',
      '3. 色（いろ）: màu sắc; khác thuộc tính được hỏi.',
      '4. 形（かたち）: hình dáng; nói về dạng bên ngoài chứ không phải độ lớn.',
    ].join('\n'),
  },
  {
    number: 27,
    answer: 2,
    options: ['作りましたか', 'たのみましたか', '食べましたか', 'はこびましたか'],
    explanation: [
      'Đáp án 2 — 注文する là gọi/đặt món; trong hội thoại thông thường, たのむ có nghĩa gọi món hoặc nhờ đặt.',
      'Dịch: “Món salad thì anh/chị đã gọi chưa?”',
      '1. 作りましたか: đã làm/chế biến chưa; hỏi salad đã được chuẩn bị chưa, khác với đã gọi món.',
      '2. たのみましたか: đã nhờ/đặt/gọi chưa; gần nghĩa với 注文しましたか trong ngữ cảnh nhà hàng.',
      '3. 食べましたか: đã ăn chưa; hỏi việc ăn, không phải đặt món.',
      '4. はこびましたか（運びましたか）: đã mang/vận chuyển chưa; không phải gọi món.',
    ].join('\n'),
  },
  {
    number: 28,
    answer: 4,
    options: ['コピーして', 'メモして', 'メールして', 'チェックして'],
    explanation: [
      'Đáp án 4 — たしかめる là xác nhận/kiểm tra lại; チェックする có nghĩa gần nhất.',
      'Dịch: “Xin lỗi, anh/chị có thể kiểm tra lại một lần nữa không?”',
      '1. コピーして: sao chép tài liệu; không phải xác minh xem nội dung có đúng không.',
      '2. メモして: ghi chú lại; không đồng nghĩa với kiểm tra.',
      '3. メールして: gửi email; là cách liên lạc, không phải thao tác xác nhận.',
      '4. チェックして: kiểm tra/xem lại; tương đương với たしかめて trong câu.',
    ].join('\n'),
  },
  {
    number: 29,
    answer: 4,
    options: ['ずっと', 'いつも', 'まだ', 'さいきん'],
    explanation: [
      'Đáp án 4 — このごろ và 最近（さいきん）đều có nghĩa là gần đây/dạo này.',
      'Dịch: “Dạo này anh Yamada có vẻ bận nhỉ.”',
      '1. ずっと: suốt/từ trước đến nay; nói về khoảng thời gian liên tục, không chỉ “gần đây”.',
      '2. いつも: lúc nào cũng/luôn luôn; chỉ thói quen thường xuyên.',
      '3. まだ: vẫn/còn/chưa; diễn tả trạng thái chưa kết thúc.',
      '4. さいきん（最近）: gần đây; đồng nghĩa với このごろ.',
    ].join('\n'),
  },
  {
    number: 30,
    answer: 2,
    options: ['騒いで', '話して', '答えて', '遊んで'],
    explanation: [
      'Đáp án 2 — しゃべる nghĩa là nói chuyện/tán gẫu; 話す（はなす）gần nghĩa nhất trong các lựa chọn.',
      'Dịch: “Từ nãy đến giờ chỉ có cậu bé kia nói mãi.”',
      '1. 騒いで（さわいで）: làm ồn/quậy phá; mạnh hơn và không đơn thuần là nói chuyện.',
      '2. 話して（はなして）: nói chuyện; thay vào câu vẫn giữ nghĩa phù hợp.',
      '3. 答えて（こたえて）: trả lời một câu hỏi; không phải cứ liên tục tán gẫu.',
      '4. 遊んで（あそんで）: chơi/đùa; không mang nghĩa nói chuyện.',
    ].join('\n'),
  },
]

const normalizeOption = (value) =>
  String(value || '')
    .normalize('NFKC')
    .replace(/^\s*[1-4][.)．、]\s*/u, '')
    .replace(/^\s*[1-4]\s+/u, '')
    .replace(/\s+/gu, '')
if (reviews.length !== 16 || new Set(reviews.map((row) => row.number)).size !== 16) {
  throw new Error('The review must cover questions 15–30 exactly once.')
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
  questionRange: '15–30',
  reviewedQuestionCount: reviews.length,
  reviewedChoiceCount: reviews.length * 4,
  answerKeysChanged: 0,
  unresolvedSourceText: [
    'Question 17 option 1 is stored as まずいい; its intended original form has not been confirmed, so the choice was preserved and not silently corrected.',
    'Question 23 option 3 is stored as きっとり, which is not a standard form; the choice was preserved and not silently corrected.',
  ],
  sourceLimits: {
    originalQuestionPdfVisuallyInspectedThisPass: false,
    officialAnswerKeyConfirmed: false,
    method:
      'Reviewed the stored Japanese prompt and all four choices for questions 15–30, translated the prompt, and replaced automatic dictionary glosses with contextual meanings and concise distractor explanations. Answer keys and printed choice text were preserved; the original question paper and official key were not independently confirmed in this pass.',
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
