import fs from 'node:fs'

const masterPath = 'data/jlpt_n3_toan_master.json'
const curatedPath = 'data/jlpt_n3_explanations_curated.json'
const reviewPath = 'reports/n3-quality-audit/star-source-2012-07-review.json'
const pdfUrl = 'https://drive.google.com/file/d/11YNc2TftE52Ow9f1q3HCrVz5rkbGt9gR/view'
const answerKeyUrl = 'https://www.scribd.com/document/885818943/%C4%90ap-An-Jlpt-n3-Update-290724'

const items = [
  {
    number: 49,
    printedQuestion: 14,
    answer: 2,
    order: [3, 2, 4, 1],
    starPosition: 1,
    sentence:
      '配達員「お荷物の配達時間ですが、明日の夜8時ごろでいかがですか。」客「その時間は多分家にいると思うので大丈夫です。お願いします。」',
    translation:
      'Nhân viên giao hàng hỏi giao vào khoảng 8 giờ tối mai có được không. Khách trả lời: ‘Giờ đó tôi nghĩ có lẽ mình sẽ ở nhà, nên được ạ. Nhờ anh/chị.’',
    explanation: `Câu hoàn chỉnh: 「配達員「お荷物の配達時間ですが、明日の夜8時ごろでいかがですか。」客「その時間は多分家にいると思うので大丈夫です。お願いします。」」
Dịch: Nhân viên giao hàng hỏi giao vào khoảng 8 giờ tối mai có được không. Khách trả lời: ‘Giờ đó tôi nghĩ có lẽ mình sẽ ở nhà, nên được ạ. Nhờ anh/chị.’
Thứ tự bốn mảnh là 3 → 2 → 4 → 1. Dấu ★ nằm ở vị trí thứ hai, nên đáp án là 2 「多分」.
1. 「と思う」 đứng sau mệnh đề 「家にいる」 để diễn tả suy nghĩ/dự đoán; sau đó 「ので」 nêu lý do đồng ý.
2. 「多分」 là phó từ “có lẽ”; nó đứng trước vị ngữ 「家にいる」, đúng ô ★.
3. 「時間は」 nối với 「その」 thành chủ đề 「その時間は」 (“về giờ đó”), nên mở đầu chuỗi.
4. 「家にいる」 là vị ngữ “ở nhà”; nó theo sau phó từ 「多分」 và đứng trước 「と思う」.
Ghi nhớ: 「その時間は」 nêu mốc thời gian, 「多分」 bổ nghĩa cho nhận định, còn 「～と思うので」 đưa ra lý do.
`,
  },
  {
    number: 50,
    printedQuestion: 15,
    answer: 1,
    order: [4, 3, 1, 2],
    starPosition: 2,
    sentence:
      '山下「田中さん、ABC大学のリュウ先生を知っていますか。」田中「お名前は聞いたことがありますが、会ったことはありません。」',
    translation:
      'Yamashita hỏi Tanaka có biết thầy Liu ở Đại học ABC không. Tanaka đáp: ‘Tôi từng nghe tên thầy, nhưng chưa gặp thầy.’',
    explanation: `Câu hoàn chỉnh: 「山下「田中さん、ABC大学のリュウ先生を知っていますか。」田中「お名前は聞いたことがありますが、会ったことはありません。」」
Dịch: Yamashita hỏi Tanaka có biết thầy Liu ở Đại học ABC không. Tanaka đáp: ‘Tôi từng nghe tên thầy, nhưng chưa gặp thầy.’
Thứ tự bốn mảnh là 4 → 3 → 1 → 2. Dấu ★ nằm ở vị trí thứ ba, nên đáp án là 1 「ありますが」.
1. 「ありますが」 hoàn tất cụm 「聞いたことがあります」 (“đã từng nghe”), rồi 「が」 nối với ý đối lập phía sau.
2. 「会ったことは」 mở đầu ý “còn việc gặp thì…”, nên đứng ngay trước phần có sẵn 「ありません」.
3. 「聞いたことが」 là cụm “đã nghe”; nó theo sau chủ đề 「お名前は」 và đứng trước 「ありますが」.
4. 「お名前は」 nêu chủ đề “còn tên thì…”, nên đứng đầu câu trả lời.
Ghi nhớ: 「Vたことがある」 nói về trải nghiệm; 「～が、～ない」 nối hai ý tương phản.
`,
  },
  {
    number: 51,
    printedQuestion: 16,
    answer: 4,
    order: [3, 1, 4, 2],
    starPosition: 2,
    sentence: 'わたしがもっとも行ってみたい寺のひとつに京都の高山寺がある。',
    translation: 'Một trong những ngôi chùa tôi muốn đến thăm nhất là chùa Kōsanji ở Kyoto.',
    explanation: `Câu hoàn chỉnh: 「わたしがもっとも行ってみたい寺のひとつに京都の高山寺がある。」
Dịch: Một trong những ngôi chùa tôi muốn đến thăm nhất là chùa Kōsanji ở Kyoto.
Thứ tự bốn mảnh là 3 → 1 → 4 → 2. Dấu ★ nằm ở vị trí thứ ba, nên đáp án là 4 「寺の」.
1. 「行ってみたい」 nghĩa là “muốn thử đến”; nó theo sau phó từ mức độ 「もっとも」.
2. 「ひとつに」 khép lại cụm 「寺のひとつに」 (“một trong những ngôi chùa”) và nối với địa điểm được nêu sau đó.
3. 「もっとも」 nghĩa là “nhất”; nó bổ nghĩa cho 「行ってみたい」 và mở đầu cụm mô tả điều người nói muốn làm.
4. 「寺の」 nối danh từ 「寺」 với 「ひとつ」 thành 「寺のひとつ」; vì thế nó nằm sau 「行ってみたい」 và ở ô ★.
Ghi nhớ: 「もっとも～たい」 diễn tả điều muốn làm nhất; 「Nのひとつ」 nghĩa là “một trong những N”.
`,
  },
  {
    number: 52,
    printedQuestion: 17,
    answer: 2,
    order: [1, 3, 2, 4],
    starPosition: 2,
    sentence: '「プレゼント」という映画を見て、この映画ほど人生について考えさせられる映画はないと思った。',
    translation:
      'Sau khi xem bộ phim “Present”, tôi nghĩ không có bộ phim nào khiến mình suy ngẫm về cuộc đời nhiều như bộ phim này.',
    explanation: `Câu hoàn chỉnh: 「「プレゼント」という映画を見て、この映画ほど人生について考えさせられる映画はないと思った。」
Dịch: Sau khi xem bộ phim “Present”, tôi nghĩ không có bộ phim nào khiến mình suy ngẫm về cuộc đời nhiều như bộ phim này.
Thứ tự bốn mảnh là 1 → 3 → 2 → 4. Dấu ★ nằm ở vị trí thứ ba, nên đáp án là 2 「について」.
1. 「ほど」 tạo cấu trúc so sánh mức độ 「この映画ほど～映画はない」 (“không bộ phim nào … bằng bộ phim này”), nên đứng ngay sau 「この映画」.
2. 「について」 đi sau danh từ 「人生」 để nêu chủ đề “về cuộc đời”; nó nằm ở ô ★ trước 「考えさせられる」.
3. 「人生」 là danh từ được 「について」 đánh dấu làm chủ đề suy nghĩ, nên đứng trước mảnh 2.
4. 「考えさせられる」 diễn tả việc bị gợi khiến phải suy nghĩ; nó kết thúc cụm bổ nghĩa cho danh từ 「映画」.
Ghi nhớ: 「Nについて考える」 nghĩa là “suy nghĩ về N”; 「Aほど～ない」 diễn tả “không … bằng A”.
`,
  },
  {
    number: 53,
    printedQuestion: 18,
    answer: 3,
    order: [2, 4, 3, 1],
    starPosition: 2,
    sentence: '友だちからのメールが来るまで、今日がレポートのしめ切り日だったということをすっかり忘れていた。',
    translation: 'Tôi đã hoàn toàn quên hôm nay là hạn nộp báo cáo cho đến khi nhận được email của bạn.',
    explanation: `Câu hoàn chỉnh: 「友だちからのメールが来るまで、今日がレポートのしめ切り日だったということをすっかり忘れていた。」
Dịch: Tôi đã hoàn toàn quên hôm nay là hạn nộp báo cáo cho đến khi nhận được email của bạn.
Thứ tự bốn mảnh là 2 → 4 → 3 → 1. Dấu ★ nằm ở vị trí thứ ba, nên đáp án là 3 「ということを」.
1. 「すっかり忘れていた」 nghĩa là “đã hoàn toàn quên”; nó làm vị ngữ cuối và nhận nội dung được đánh dấu bằng 「を」.
2. 「メールが来るまで」 nêu mốc “cho đến khi email đến”; cụm thời gian đứng đầu câu.
3. 「ということを」 biến mệnh đề vừa nêu thành nội dung “rằng…” làm tân ngữ của 「忘れていた」, nên đứng ở ô ★ ngay trước 「すっかり忘れていた」.
4. 「今日がレポートのしめ切り日だった」 là mệnh đề “hôm nay là ngày hạn chót nộp báo cáo”; nó cung cấp nội dung mà người nói quên.
Ghi nhớ: 「普通形 + ということを忘れる」 nghĩa là “quên rằng…”; 「～まで」 chỉ mốc mà một trạng thái kéo dài đến.
`,
  },
]

const readJson = (file) => JSON.parse(fs.readFileSync(file, 'utf8'))
const writeJson = (file, value) => fs.writeFileSync(file, `${JSON.stringify(value, null, 2)}\n`, 'utf8')
const exams = readJson(masterPath)
const curated = readJson(curatedPath)
const exam = exams.find((item) => item.id === 'toan-n3-201207-full')
if (!exam) throw new Error('Could not find the full JLPT N3 July 2012 exam.')
const questions = exam.parts.flatMap((part) => part.questions || [])
const normalizeOption = (option) =>
  String(typeof option === 'object' && option ? option.text : option)
    .normalize('NFKC')
    .replace(/^\s*[1-4][.．、\s　]*/u, '')
    .trim()

const reviewedQuestions = items.map((item) => {
  const question = questions.find((candidate) => Number(candidate.number) === item.number)
  if (!question || question.options?.length !== 4) {
    throw new Error(`Missing question or four choices for internal question ${item.number}.`)
  }
  if (item.order[item.starPosition] !== item.answer) {
    throw new Error(`Answer and ★ position do not agree for printed question ${item.printedQuestion}.`)
  }

  question.answer = item.answer
  question.correctAnswer = item.answer
  question.starCorrectOrder = [...item.order]
  question.starPosition = item.starPosition
  question.starOrderVerified = true
  question.starPositionVerified = true
  question.starVerificationSources = [`${pdfUrl}#page=5`, answerKeyUrl]
  question.starVerificationStatus = 'verified-against-source'
  question.starVerificationNote =
    'Đã đọc trực tiếp PDF gốc trong Chrome, trang PDF 5/trang in 5, để đối chiếu bốn mảnh và vị trí dấu ★. Dãy đáp án 2–1–4–2–3 khớp với một bảng khóa thứ cấp và với câu hoàn chỉnh; chưa có khóa JLPT chính thức để đối chiếu. Lớp chữ PDF gắn số trang 6 vào cuối lựa chọn 4 của câu 18, nhưng bản hiển thị xác nhận lựa chọn kết thúc ở 「だった」.'
  question.explanation = item.explanation.trim()
  curated[question.id] = question.explanation

  return {
    printedQuestion: item.printedQuestion,
    internalQuestionNumber: item.number,
    sourceOptions: question.options.map(normalizeOption),
    answer: item.answer,
    order: [...item.order],
    starPosition: item.starPosition,
    completedSentence: item.sentence,
    vietnameseTranslation: item.translation,
    explanationCoverage: {
      answerIdentified: item.explanation.includes(`đáp án là ${item.answer}`),
      allFourOptionsAddressed: [1, 2, 3, 4].every((choice) =>
        new RegExp(`(?:^|\\n)${choice}\\.`, 'u').test(item.explanation)
      ),
      fullSentenceAndTranslation:
        item.explanation.includes(item.sentence) && item.explanation.includes(item.translation),
      fragmentPlacementExplained: /Dấu ★ nằm ở vị trí/u.test(item.explanation),
    },
  }
})

const report = {
  generatedAt: new Date().toISOString(),
  exam: 'JLPT N3 July 2012',
  scope: 'Grammar Mondai 2, printed questions 14–18.',
  sourcePdf: {
    title: '3. N3 7-2012.pdf',
    url: pdfUrl,
    driveFileId: '11YNc2TftE52Ow9f1q3HCrVz5rkbGt9gR',
    renderedPage: 5,
    printedQuestions: [14, 15, 16, 17, 18],
    visualReview:
      'PDF trang 5 được mở trong Chrome ở mức thu phóng 75%; ảnh trang xác nhận nội dung và vị trí ★ của năm câu. Lớp chữ gắn số trang in 6 vào lựa chọn 4 của câu 18; ảnh trực quan xác nhận đó là số trang, không thuộc phương án.',
  },
  answerReference: {
    name: 'Scribd — Đáp Án JLPT N3 (Update 290724)',
    url: answerKeyUrl,
    answers: [2, 1, 4, 2, 3],
    status:
      'Nguồn tổng hợp thứ cấp, không phải khóa chính thức JLPT. Dãy đáp án khớp với thứ tự mảnh khi hoàn chỉnh câu và vị trí sao trên PDF gốc.',
  },
  officialKeyEstablished: false,
  corrections: [
    {
      printedQuestion: 14,
      previousAnswer: 4,
      answer: 2,
      previousStarPosition: 2,
      starPosition: 1,
      order: [3, 2, 4, 1],
    },
    {
      printedQuestion: 18,
      previousAnswer: 1,
      answer: 3,
      previousStarPosition: 3,
      starPosition: 2,
      order: [2, 4, 3, 1],
    },
  ],
  explanationsAppliedTo: ['full mock exam', 'curated explanation map'],
  questions: reviewedQuestions,
}

writeJson(masterPath, exams)
writeJson(curatedPath, curated)
writeJson(reviewPath, report)
console.log('Reviewed and synchronized the five July 2012 grammar ★ questions.')
