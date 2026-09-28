import fs from 'node:fs'
import path from 'node:path'

const root = path.resolve('.')
const masterPath = path.join(root, 'data/jlpt_n3_toan_master.json')
const curatedPath = path.join(root, 'data/jlpt_n3_explanations_curated.json')
const reportPath = path.join(root, 'reports/n3-quality-audit/grammar-source-2017-07-review.json')
const questionSourceUrl = 'https://drive.google.com/file/d/1tY9_wD5KNZP0OcZWax1NzJUV552szecV/view'
const answerReferenceUrl = 'https://chuyenngoaingu.com/news/dap-an-ky-thi-nang-luc-nhat-ngu-jlpt-thang-7-2017-1211.aspx'
const explanationReferenceUrl =
  'https://jp-files.riyutool.com/%E8%80%83%E8%AF%95%E7%9C%9F%E9%A2%98/N3/2017.07/2017.07.N3%E8%AF%AD%E6%B3%95%E8%A7%A3%E6%9E%90%40mzff%40.pdf'

const exams = JSON.parse(fs.readFileSync(masterPath, 'utf8'))
const curated = JSON.parse(fs.readFileSync(curatedPath, 'utf8'))
const exam = exams.find((item) => item.id === 'toan-n3-201707-full')
if (!exam) throw new Error('Missing JLPT N3 July 2017 exam.')

const grammarPart = (mondai) => {
  const part = exam.parts.find((item) => item.title === `Kiến thức ngôn ngữ (Ngữ pháp) - Mondai ${mondai}`)
  if (!part) throw new Error(`Missing July 2017 grammar Mondai ${mondai}.`)
  return part
}
const clozePart = grammarPart(3)
const clozeQuestions = clozePart.questions
const starSources = [
  questionSourceUrl,
  answerReferenceUrl,
  explanationReferenceUrl,
  '8. N3 7-2017.pdf, printed pages 5–6: original wording, four fragments, and the third-slot ★ were visually checked in Google Drive PDF viewer.',
]

const reviewedStars = [
  {
    id: 'toan_q_2017_07_49',
    number: 14,
    before: 'レストラン A は',
    after: 'なかなか予約がとれない人気店になった。',
    options: ['雑誌か', 'で', '何か', '紹介されてから'],
    order: [1, 3, 2, 4],
    answer: 2,
    sourceAnswer: 3,
    status: 'disputed',
    sentence: 'レストランAは雑誌か何かで紹介されてから、なかなか予約がとれない人気店になった。',
    explanation: `Câu hoàn chỉnh: 「レストランAは雑誌か何かで紹介されてから、なかなか予約がとれない人気店になった。」
Dịch: “Sau khi được giới thiệu trên một tạp chí nào đó, nhà hàng A trở thành quán nổi tiếng đến mức rất khó đặt chỗ.”
Thứ tự mảnh: 1 → 3 → 2 → 4; ô ★ ở vị trí thứ ba là 「で」, lựa chọn 2. Mảnh 1 「雑誌か」 và mảnh 3 「何か」 ghép thành cách liệt kê 「雑誌か何か」, nghĩa là “tạp chí hay một phương tiện nào đó”; mảnh 2 「で」 chỉ phương tiện/nguồn giới thiệu; mảnh 4 「紹介されてから」 nêu việc được giới thiệu trước khi nhà hàng trở nên nổi tiếng. 「〜てから」 biểu thị việc sau xảy ra sau mốc được giới thiệu.
Lưu ý nguồn: một bảng đáp án tham khảo ghi lựa chọn 3, nhưng đáp án đó không tạo được câu tự nhiên ở vị trí ★. Một tài liệu giải độc lập và cách ghép theo PDF cùng cho đáp án 2. Vì chưa có phiếu đáp án JLPT chính thức, câu này được giữ trạng thái còn bất đồng nguồn.`,
  },
  {
    id: 'toan_q_2017_07_50',
    number: 15,
    before: '（海岸で）A「わあ、夕日がきれいですね。」B「本当にすばらしいですね。',
    after: 'ありません。',
    options: ['夕日は', '見たことが', 'きれいな', 'こんなに'],
    order: [4, 3, 1, 2],
    answer: 1,
    sourceAnswer: 1,
    status: 'verified',
    sentence:
      '（海岸で）A「わあ、夕日がきれいですね。」B「本当にすばらしいですね。こんなにきれいな夕日は見たことがありません。」',
    explanation: `Câu hoàn chỉnh: 「（海岸で）A「わあ、夕日がきれいですね。」B「本当にすばらしいですね。こんなにきれいな夕日は見たことがありません。」」
Dịch: “(Ở bờ biển) A: ‘Ồ, hoàng hôn đẹp quá.’ B: ‘Đẹp thật. Tôi chưa từng thấy hoàng hôn nào đẹp đến thế.’”
Thứ tự mảnh: 4 → 3 → 1 → 2; ô ★ ở vị trí thứ ba là 「夕日は」, lựa chọn 1. 「こんなに」 bổ nghĩa cho tính từ 「きれい」; 「きれいな」 đứng trước danh từ 「夕日」; 「夕日は」 nêu chủ đề của câu; 「見たことがありません」 phủ định trải nghiệm từng nhìn thấy. Mẫu cần nhớ: 「こんなに＋tính từ＋danh từ」 và 「Vたことがある／ない」 để nói về trải nghiệm.`,
  },
  {
    id: 'toan_q_2017_07_51',
    number: 16,
    before: '昨日、テレビでテニスの試合を見た。',
    after: '最後まで本当にどきどきした。',
    options: ['試合で', 'どちらが', 'おかしくない', '勝っても'],
    order: [2, 4, 3, 1],
    answer: 3,
    sourceAnswer: 3,
    status: 'verified',
    sentence: '昨日、テレビでテニスの試合を見た。どちらが勝ってもおかしくない試合で、最後まで本当にどきどきした。',
    explanation: `Câu hoàn chỉnh: 「昨日、テレビでテニスの試合を見た。どちらが勝ってもおかしくない試合で、最後まで本当にどきどきした。」
Dịch: “Hôm qua tôi xem một trận quần vợt trên TV. Trận đấu cân bằng đến mức bên nào thắng cũng chẳng có gì lạ, khiến tôi hồi hộp đến tận cuối.”
Thứ tự mảnh: 2 → 4 → 3 → 1; ô ★ ở vị trí thứ ba là 「おかしくない」, lựa chọn 3. 「どちらが」 nêu hai bên và hỏi bên nào; 「勝っても」 dùng mẫu nghi vấn từ＋「ても」, nghĩa là “dù bên nào thắng”; 「おかしくない」 nói kết quả đó không có gì bất thường; 「試合で」 khép cụm bổ nghĩa cho trận đấu và nối sang cảm giác hồi hộp.`,
  },
  {
    id: 'toan_q_2017_07_52',
    number: 17,
    before: '子供には、親の',
    after: '習わせたほうがいいと思う。',
    options: ['習わせるのではなくて', '子供の', '興味があるものを', '習わせたいものを'],
    order: [4, 1, 2, 3],
    answer: 2,
    sourceAnswer: 2,
    status: 'verified',
    sentence: '子供には、親の習わせたいものを習わせるのではなくて子供の興味があるものを習わせたほうがいいと思う。',
    explanation: `Câu hoàn chỉnh: 「子供には、親の習わせたいものを習わせるのではなくて子供の興味があるものを習わせたほうがいいと思う。」
Dịch: “Tôi nghĩ nên cho trẻ học điều trẻ hứng thú, thay vì bắt trẻ học điều cha mẹ muốn.”
Thứ tự mảnh: 4 → 1 → 2 → 3; ô ★ ở vị trí thứ ba là 「子供の」, lựa chọn 2. 「習わせたいもの」 là điều cha mẹ muốn cho con học; 「習わせるのではなくて」 chuyển sang ý đối lập “thay vì cho học…”; 「子供の興味があるもの」 là điều trẻ quan tâm. Mẫu 「AのではなくてB」 sửa/đối lập A bằng B; 「興味がある」 bổ nghĩa cho 「もの」.`,
  },
  {
    id: 'toan_q_2017_07_53',
    number: 18,
    before: '来月、大学のスピーチ大会に出る。全部覚える',
    after: 'つもりだ。',
    options: ['ようにする', 'たくさん練習して', 'まで', 'メモを見ないで話せる'],
    order: [3, 2, 4, 1],
    answer: 4,
    sourceAnswer: 4,
    status: 'verified',
    sentence:
      '来月、大学のスピーチ大会に出る。全部覚えるまでたくさん練習して、メモを見ないで話せるようにするつもりだ。',
    explanation: `Câu hoàn chỉnh: 「来月、大学のスピーチ大会に出る。全部覚えるまでたくさん練習して、メモを見ないで話せるようにするつもりだ。」
Dịch: “Tháng sau tôi sẽ tham gia cuộc thi hùng biện của trường đại học. Tôi định luyện tập thật nhiều cho đến khi thuộc hết bài và có thể nói mà không nhìn giấy ghi chú.”
Thứ tự mảnh: 3 → 2 → 4 → 1; ô ★ ở vị trí thứ ba là 「メモを見ないで話せる」, lựa chọn 4. 「まで」 đặt giới hạn “cho đến khi thuộc hết”; 「たくさん練習して」 nối việc luyện tập với mục tiêu; 「見ないで」 nghĩa là làm mà không nhìn; 「話せるようにする」 diễn tả cố gắng đạt trạng thái có thể nói không cần giấy.`,
  },
]

const reviewedCloze = [
  {
    id: 'toan_q_2017_07_54',
    printedNumber: 19,
    answer: 2,
    sentence: '食べ終わって話していたとき、掃除の時間を知らせる放送が流れました。すると、予想外のことが起きました。',
    explanation: `Đáp án 2 「すると」 nối sự việc vừa xảy ra với diễn biến tiếp theo: loa báo giờ dọn dẹp vang lên, rồi một việc ngoài dự đoán xảy ra.
Câu hoàn chỉnh: 「食べ終わって話していたとき、掃除の時間を知らせる放送が流れました。すると、予想外のことが起きました。」
Dịch: “Khi mọi người ăn xong và đang trò chuyện thì loa báo giờ dọn dẹp vang lên. Ngay sau đó, một việc ngoài dự đoán đã xảy ra.”
1. 「つまり」 = nói cách khác/tóm lại; dùng để diễn đạt lại, không mở sự kiện tiếp nối.
2. 「すると」 = thế rồi/ngay sau đó; đúng vì hành động dọn dẹp bắt đầu sau thông báo.
3. 「結局」 = cuối cùng/rốt cuộc; tóm kết kết quả, không hợp diễn biến xảy ra ngay sau đó.
4. 「例えば」 = ví dụ như; cần theo sau bằng ví dụ, không phù hợp ở đây.
Ghi nhớ: 「すると」 thường nối một sự việc làm bối cảnh với kết quả hoặc phát hiện tiếp theo.`,
  },
  {
    id: 'toan_q_2017_07_55',
    printedNumber: 20,
    answer: 1,
    sentence:
      'これを見て、とても驚きました。私の小学校では掃除は掃除の会社の人がしていたので、子供が掃除するのを見たのは初めてだったのです。',
    explanation: `Đáp án 1 「驚きました」 diễn tả phản ứng của người kể ở ngôi thứ nhất khi tận mắt thấy học sinh tự dọn lớp.
Câu hoàn chỉnh: 「これを見て、とても驚きました。」
Dịch: “Nhìn thấy cảnh đó, tôi đã rất ngạc nhiên.” Câu sau giải thích rằng ở trường tiểu học của người kể, nhân viên công ty vệ sinh mới là người dọn dẹp nên đây là lần đầu người kể thấy trẻ em làm việc đó.
1. 「驚きました」 = tôi đã ngạc nhiên; đúng với lời tự thuật của người kể.
2. 「驚かれました」 = bị ai làm cho ngạc nhiên hoặc dạng kính ngữ; không phù hợp với chủ thể đang kể phản ứng của chính mình.
3. 「驚いたようです」 = có vẻ (người ấy) đã ngạc nhiên; là suy đoán về người khác, không phải cảm nhận trực tiếp của “tôi”.
4. 「驚かれたようです」 = có vẻ đã bị làm cho ngạc nhiên/đã ngạc nhiên (dạng bị động hoặc kính ngữ); sai chủ thể và góc nhìn.
Ghi nhớ: lời tự thuật về phản ứng của người nói dùng 「驚きました」; 「ようです」 thường biểu thị phỏng đoán từ dấu hiệu.`,
  },
  {
    id: 'toan_q_2017_07_56',
    printedNumber: 21,
    answer: 3,
    sentence: '私は、これがその学校にごみが落ちていなかった理由だと思います。',
    explanation: `Đáp án 3 「その」 chỉ ngôi trường vừa được nhắc đến: ngôi trường mà người kể đã đến thăm và quan sát giờ dọn dẹp.
Câu hoàn chỉnh: 「私は、これがその学校にごみが落ちていなかった理由だと思います。」
Dịch: “Tôi nghĩ đây là lý do khiến ngôi trường ấy không có rác rơi trên sàn.”
1. 「ある」 = một/có một (địa điểm chưa xác định); không chỉ lại ngôi trường cụ thể trong mạch kể.
2. 「あらゆる」 = mọi/tất cả; khái quát hóa thành mọi trường học, vượt quá điều người kể vừa quan sát.
3. 「その」 = ngôi đó/ấy; đúng vì liên kết với trường tiểu học được giới thiệu ở đầu bài.
4. 「私の」 = của tôi; không đúng vì trường của người kể được nói riêng ở câu kế tiếp và là nơi nhân viên công ty dọn dẹp.
Ghi nhớ: 「その＋danh từ」 dùng để nhắc lại một đối tượng đã được đưa vào ngữ cảnh.`,
  },
  {
    id: 'toan_q_2017_07_57',
    printedNumber: 22,
    answer: 4,
    sentence: 'きっと、自分や自分の知っている人が掃除した場所なら大切に使うのでしょう。',
    explanation: `Đáp án 4 「なら」 đặt điều kiện dựa trên danh từ 「場所」: nếu là nơi mình hoặc người mình quen đã dọn, người ta có lẽ sẽ sử dụng nơi ấy cẩn thận.
Câu hoàn chỉnh: 「きっと、自分や自分の知っている人が掃除した場所なら大切に使うのでしょう。」
Dịch: “Có lẽ người ta sẽ trân trọng sử dụng những nơi do chính mình hoặc người mình quen dọn dẹp.”
1. 「などに」 = vào/đối với những thứ như…; 「大切に使う」 cần tân ngữ chỉ vật được sử dụng, nên trợ từ 「に」 không nối tự nhiên ở đây.
2. 「よりは」 = so với/thay vì; cần một đối tượng đem ra so sánh, nhưng câu không nêu vế so sánh.
3. 「でも」 = ngay cả/cũng; có thể nhấn mạnh một phạm vi, nhưng không diễn tả quan hệ điều kiện “nếu là nơi mình quen thuộc thì dùng cẩn thận”.
4. 「なら」 = nếu là/trong trường hợp là; nối điều kiện với kết quả 「大切に使う」, phù hợp lập luận của đoạn văn.
Ghi nhớ: 「Nなら」 nhận điều kiện/chủ đề đã nêu rồi đưa ra nhận định hoặc kết quả tương ứng.`,
  },
  {
    id: 'toan_q_2017_07_58',
    printedNumber: 23,
    answer: 3,
    sentence:
      '「掃除の時間」は学校がきれいになるだけではありません。みんなで使う場所をきれいに使う習慣が身についていいと思います。',
    explanation: `Đáp án 3 「身についていいと思います」 nêu đánh giá tích cực của người viết: thói quen sử dụng sạch sẽ nơi mọi người cùng dùng được hình thành là điều tốt.
Câu hoàn chỉnh: 「『掃除の時間』は学校がきれいになるだけではありません。みんなで使う場所をきれいに使う習慣が身についていいと思います。」
Dịch: “Giờ dọn dẹp không chỉ làm trường học sạch hơn. Tôi nghĩ việc hình thành thói quen giữ gìn sạch sẽ những nơi mọi người cùng sử dụng cũng rất tốt.”
1. 「身についてもいいです」 = có hình thành/tiếp thu thì cũng được; 「てもいい」 biểu thị cho phép, trong khi đoạn văn đang nêu lợi ích của thói quen.
2. 「身についていいだけです」 = chỉ là hình thành thì tốt; 「だけ」 giới hạn ý thành “chỉ vậy thôi”, trái với lời kết luận tích cực.
3. 「身についていいと思います」 = tôi nghĩ hình thành được là tốt; diễn tả đúng đánh giá của người viết.
4. 「身についてもいいと思うだけです」 = tôi chỉ nghĩ rằng hình thành được cũng không sao; 「だけ」 và 「てもいい」 làm câu thành lời nhận xét dè dặt/giới hạn, không hợp lập luận.
Ghi nhớ: 「身につく」 là tự động từ chỉ kiến thức/kỹ năng/thói quen được tiếp thu; 「〜ていい」 ở đây đánh giá kết quả là tốt, còn 「〜てもいい」 thường nói việc gì được cho phép.`,
  },
]

const questionMap = new Map(exam.parts.flatMap((part) => part.questions).map((question) => [question.id, question]))
for (const entry of reviewedStars) {
  const question = questionMap.get(entry.id)
  if (!question) throw new Error(`Missing star question ${entry.id}.`)
  question.starPrompt = { before: entry.before, after: entry.after }
  question.options = entry.options.map((option, index) => `${index + 1}. ${option}`)
  question.starCorrectOrder = entry.order
  question.starPosition = 2
  question.correctAnswer = entry.answer
  question.answer = entry.answer
  question.starOrderVerified = true
  question.starPositionVerified = true
  question.starVerificationSources = starSources
  question.starVerificationStatus = entry.status
  question.starAnswerKeyConflict =
    entry.status === 'disputed'
      ? 'The ChuyenNgoaiNgu reference table lists option 3 for printed question 14. The PDF shows the star in slot 3; the natural order 1→3→2→4 places option 2 (で) there, and the independent Hujiang explanation also reconstructs option 2. Keep option 2 provisionally and expose the disagreement; no official JLPT key has been found.'
      : null
  question.explanation = entry.explanation
  curated[entry.id] = entry.explanation
}

const clozeExpectedAnswers = [2, 1, 3, 4, 3]
if (clozeQuestions.length !== reviewedCloze.length) throw new Error('Unexpected July 2017 M3 question count.')
if (!clozePart.sourceTextExtracted) throw new Error('July 2017 M3 passage is missing source-text provenance.')
if (clozePart.passage?.includes('<img')) throw new Error('July 2017 M3 passage unexpectedly contains an image.')
for (const [index, entry] of reviewedCloze.entries()) {
  const question = clozeQuestions[index]
  if (question.id !== entry.id) throw new Error(`M3 sequence changed at ${entry.id}.`)
  if ((question.correctAnswer ?? question.answer) !== clozeExpectedAnswers[index]) {
    throw new Error(`Stored answer differs from reviewed July 2017 M3 sequence at ${entry.id}.`)
  }
  question.explanation = entry.explanation
  curated[entry.id] = entry.explanation
}

fs.writeFileSync(masterPath, `${JSON.stringify(exams, null, 2)}\n`)
fs.writeFileSync(curatedPath, `${JSON.stringify(curated, null, 2)}\n`)
fs.mkdirSync(path.dirname(reportPath), { recursive: true })
fs.writeFileSync(
  reportPath,
  `${JSON.stringify(
    {
      exam: 'JLPT N3 July 2017',
      scope:
        'Grammar questions 36–58: Mondai 1 (13 questions), star ordering (5 questions), and cloze passage (5 questions).',
      source: {
        questionPdf: {
          file: '8. N3 7-2017.pdf',
          url: questionSourceUrl,
          printedPages: { mondai1: [4, 5], starQuestions14To18: [5, 6], clozeQuestions19To23: [7] },
          method:
            "Fetched the PDF text from the user's connected Google Drive, then visually inspected printed pages 4–6 at 50% and 100% in Chrome. The five ★ locations are in the third blank; all four options and local prompts were compared with the PDF.",
        },
        answerReference: {
          name: 'ChuyenNgoaiNgu, JLPT July 2017 answer table',
          url: answerReferenceUrl,
          qualification:
            'Secondary reference, not an official JLPT marking sheet. It agrees with printed questions 15–18 but lists option 3 for question 14, which conflicts with the source star position and reconstructed sentence.',
          grammarMondai2Answers: [3, 1, 3, 2, 4],
        },
        independentExplanation: {
          name: 'Hujiang Japanese, 2017.07 N3 grammar explanations',
          url: explanationReferenceUrl,
          qualification:
            'Secondary Chinese explanation source. Its indexed excerpt reconstructs question 14 as 1→3→2→4 with starred option 2 (で), and explains M3 questions 19–23 with answers 2, 1, 3, 4, 3. It is not an official JLPT key.',
        },
      },
      questions: reviewedStars.map((entry) => ({
        questionId: entry.id,
        printedNumber: entry.number,
        promptBefore: entry.before,
        promptAfter: entry.after,
        sourceOptions: entry.options,
        order: entry.order,
        starSlotIndex: 2,
        reconstructedAnswer: entry.answer,
        answerReference: entry.sourceAnswer,
        status: entry.status,
        completedSentence: entry.sentence,
      })),
      cloze: reviewedCloze.map((entry) => ({
        questionId: entry.id,
        printedNumber: entry.printedNumber,
        answer: entry.answer,
        sentence: entry.sentence,
      })),
      limitations:
        'Question 14 remains explicitly disputed because one secondary answer table conflicts with both the PDF star reconstruction and an independent explanation. No official answer sheet was located. M3 answers match the independent secondary explanation; they are not certified against an official JLPT key.',
    },
    null,
    2
  )}\n`
)

console.log(`Updated five July 2017 star explanations, five cloze explanations, source notes, and ${reportPath}.`)
