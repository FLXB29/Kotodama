import fs from 'node:fs'

const fullPath = 'data/jlpt_full_master.json'
const mockPath = 'data/jlpt_n3_toan_master.json'
const curatedPath = 'data/jlpt_n3_explanations_curated.json'
const fullExams = JSON.parse(fs.readFileSync(fullPath, 'utf8'))
const mockExams = JSON.parse(fs.readFileSync(mockPath, 'utf8'))
const curated = JSON.parse(fs.readFileSync(curatedPath, 'utf8'))
const fullExam = fullExams.find((exam) => exam.title === 'JLPT-N3 12 2016 - Ngữ Pháp & Đọc Hiểu (文法・読解)')
const mockExam = mockExams.find((exam) => exam.id === 'toan-n3-201612-full')
if (!fullExam || !mockExam) throw new Error('Could not find both N3 December 2016 exam records.')

const fullQuestions = new Map(
  fullExam.parts.flatMap((part) => part.questions || []).map((question) => [question.number, question])
)
const mockQuestions = new Map(
  mockExam.parts.flatMap((part) => part.questions || []).map((question) => [question.number, question])
)
const replaceQuestionText = (question, before, after) => {
  if (!question) throw new Error(`Missing source question for replacement: ${before}`)
  let changed = false
  for (const field of ['question', 'sentence']) {
    if (typeof question[field] === 'string' && question[field].includes(before)) {
      question[field] = question[field].replace(before, after)
      changed = true
    }
  }
  if (!changed) throw new Error(`Expected source text was not found in q${question.number}: ${before}`)
}
const replaceOption = (question, optionNumber, before, after) => {
  const option = question?.options?.find(
    (item) => (typeof item === 'string' ? Number(item.match(/^\s*([1-4])/u)?.[1]) : Number(item.id)) === optionNumber
  )
  if (!option) throw new Error(`Missing option ${optionNumber} in q${question?.number ?? '?'}.`)
  const current = typeof option === 'string' ? option : option.text
  if (!current.includes(before))
    throw new Error(`Expected option text was not found in q${question.number}: ${current}`)
  const updated = current.replace(before, after)
  if (typeof option === 'string') question.options[question.options.indexOf(option)] = updated
  else option.text = updated
}

// Repair clear transcription errors against the scanned JLPT paper (printed pages 4–6).
replaceQuestionText(fullQuestions.get(37), '会社面接', '会社の面接')
replaceOption(fullQuestions.get(42), 4, '申し上げ生す', '申し上げます')
replaceOption(fullQuestions.get(43), 4, '持っていくつ香りだ', '持っていくつもりだ')
replaceOption(fullQuestions.get(46), 4, '予約してある', '予約してあるね')
replaceQuestionText(fullQuestions.get(47), 'ごのトマト', 'このトマト')
replaceQuestionText(fullQuestions.get(52), '(レスランで)', '(レストランで)')
replaceOption(fullQuestions.get(57), 3, '持つのかもしれせん', '持つのかもしれません')
replaceOption(mockQuestions.get(43), 4, '持いくつもりだ', '持っていくつもりだ')
replaceOption(mockQuestions.get(57), 3, 'つの かもしれません', '持つのかもしれません')

const explanations = {
  49: `Đáp án 2: thứ tự ghép là 4 → 2 → 3 → 1, nên ô ★ nhận 「専門家でも」.
Câu hoàn chỉnh: 「この写真の鳥はとても珍しくて、この鳥の研究をしている専門家でもなかなか見る機会がないそうだ。」
Dịch: “Loài chim trong ảnh rất hiếm; nghe nói ngay cả chuyên gia nghiên cứu loài chim này cũng hiếm khi có cơ hội nhìn thấy nó.”
4. 研究をしている = đang nghiên cứu; đứng trước và bổ nghĩa cho 「専門家」.
2. 専門家でも = ngay cả chuyên gia; nối người nghiên cứu với trạng từ 「なかなか」.
3. なかなか = hiếm khi/khó mà; thường đi với phủ định 「見る機会がない」.
1. 見る機会がない = không có cơ hội nhìn thấy; làm vị ngữ chính trước 「そうだ」.
Ghi nhớ: 「NでもなかなかVない」 nhấn mạnh rằng ngay cả N cũng khó V. Dấu ★ ở vị trí thứ hai, không phải lựa chọn 3.`,
  50: `Đáp án 4: thứ tự ghép là 3 → 1 → 4 → 2, nên ô ★ nhận 「大学時代」.
Câu hoàn chỉnh: 「春から大学生になる娘には、勉強以外にも大学時代にしかできない経験をいろいろしてほしい。」
Dịch: “Tôi mong con gái sắp trở thành sinh viên từ mùa xuân sẽ có nhiều trải nghiệm ngoài việc học mà chỉ có thể có trong quãng đời đại học.”
3. 勉強以外 = ngoài việc học; mở đầu cụm nêu phạm vi trải nghiệm.
1. にも = cũng/cả; kết hợp 「勉強以外にも」, nghĩa là “ngoài việc học ra cũng…”.
4. 大学時代 = thời sinh viên; đứng ở ô ★ và làm mốc thời gian cho 「にしかできない」.
2. にしか = chỉ trong…; kết hợp với 「大学時代」 và 「できない」 thành “chỉ trong thời sinh viên mới có thể”.
Ghi nhớ: 「Nにしかできない」 = chỉ có thể làm được trong/ở N.`,
  51: `Đáp án 2: thứ tự ghép là 4 → 3 → 2 → 1, nên ô ★ nhận 「という」.
Câu hoàn chỉnh: 「土曜日は買い物をしたり友人と食事をしたりし、日曜日はどこにも出かけずに家で過ごすというのが、私の好きな週末の過ごし方だ。」
Dịch: “Thứ Bảy tôi đi mua sắm hoặc ăn cùng bạn bè; còn Chủ nhật tôi ở nhà, không đi đâu cả. Đó là cách tôi thích dành cuối tuần.”
4. どこにも出かけずに = không đi đâu cả; nối với hoạt động tiếp theo.
3. 家で過ごす = ở nhà; hoàn tất nội dung hoạt động của Chủ nhật.
2. という = gọi/gói nội dung vừa nêu thành một việc; đây là mảnh ở ô ★, không mang nghĩa “nghe nói”.
1. のが = danh hóa cụm trước và đánh dấu nó làm chủ ngữ cho 「私の好きな週末の過ごし方だ」.
Ghi nhớ: 「Vというのが…」 dùng để nêu một hoạt động hoặc nội dung cụ thể.`,
  52: `Đáp án 1: thứ tự ghép là 2 → 3 → 1 → 4, nên ô ★ nhận 「待っているんです」.
Câu hoàn chỉnh: 「しばらくここで待っててと言われたから待っているんですけど、まだですか。」
Dịch: “Họ bảo tôi chờ ở đây một lúc nên tôi vẫn đang đợi, nhưng vẫn chưa đến lượt phải không ạ?”
2. 言われた = đã được bảo/được yêu cầu; nối tự nhiên sau lời dặn 「待ってて」.
3. から = vì/do; nêu lý do người khách vẫn đang đợi.
1. 待っているんです = đang chờ; là phần ở ô ★ và mô tả tình trạng hiện tại.
4. けど = nhưng; làm câu than phiền mềm hơn trước 「まだですか」.
Ghi nhớ: 「Vてと言われた」 trích lời yêu cầu, 「Vている」 diễn tả hành động đang tiếp diễn.`,
  53: `Đáp án 3: thứ tự ghép là 1 → 4 → 3 → 2, nên ô ★ nhận 「と思うようになって」.
Câu hoàn chỉnh: 「歴史を勉強すればするほどもっと学びたいと思うようになって、歴史学科への進学を決めた。」
Dịch: “Càng học lịch sử, tôi càng muốn tìm hiểu thêm, rồi dần dần quyết định theo học ngành Lịch sử.”
1. 勉強すればするほど = càng học thì càng…; mở đầu mẫu tăng tiến.
4. もっと学びたい = muốn học thêm; nội dung mong muốn xuất hiện khi học càng nhiều.
3. と思うようになって = dần bắt đầu nghĩ rằng; là ô ★, nối sự thay đổi suy nghĩ với quyết định sau đó.
2. 歴史学科への = hướng đến khoa/ngành Lịch sử; bổ nghĩa cho 「進学」.
Ghi nhớ: 「VばVるほど」 = càng V càng…; 「Vたいと思うようになる」 = dần muốn V.`,
  54: `Đáp án 3: けれども nối hai ý tương phản: ở Nhật người ta thường nói về thời tiết, còn ở quê người viết thì ít nói.
Ngữ cảnh: 「あちこちで、多くの人があいさつに続けて天気の話をしているのを聞きました。けれども、私の国では天気の話をあまりしないので、なぜ天気の話をするのかわかりませんでした。」
Dịch: “Tôi nghe thấy nhiều người ở khắp nơi nói chuyện thời tiết sau lời chào. Tuy nhiên, ở đất nước tôi người ta ít nói về thời tiết, nên tôi không hiểu vì sao họ lại nói chuyện đó.”
1. そのうえ = hơn nữa; thêm một ý cùng chiều, không diễn tả đối lập.
2. つまり = nói cách khác/tóm lại; dùng để diễn giải ý trước, không phải tương phản.
3. けれども = tuy nhiên/nhưng; đúng vì đối chiếu hai thói quen khác nhau.
4. すると = thế rồi/do đó; thường dẫn kết quả tiếp theo, không hợp với ý trái ngược ở đây.
Ghi nhớ: dùng 「けれども」 khi vế sau tương phản với thông tin trước.`,
  55: `Đáp án 4: 「自然に『寒いね』と言ってしまいました」 diễn tả lời nói bật ra một cách tự nhiên, ngoài dự tính.
Ngữ cảnh: người viết gặp bạn vào buổi sáng mùa đông, tự nhiên nói “Lạnh nhỉ”, rồi hai người tiếp tục trò chuyện về đồ ăn và quần áo mùa đông.
Dịch: “Một buổi sáng mùa đông lạnh giá, khi gặp người bạn Nhật, sau câu chào tôi đã tự nhiên buột miệng nói: ‘Lạnh nhỉ.’”
1. 言われていました = đã/đang được người khác nói; bị động nên sai chủ thể.
2. 言ってもらいました = được ai đó nói cho; không hợp vì chính người viết là người nói 「寒いね」.
3. 言わせてみました = thử bắt/cho ai đó nói; không có ai bị yêu cầu nói.
4. 言ってしまいました = lỡ/buột miệng nói; phù hợp với 「自然に」 và diễn biến câu chuyện.
Ghi nhớ: 「Vてしまう」 ở đây nhấn mạnh hành động xảy ra ngoài dự định, không phải hoàn tất đơn thuần.`,
  56: `Đáp án 1: 「広がって」 nối sự việc câu chuyện mở rộng sang chủ đề liên quan với cảm nhận của người viết.
Câu hoàn chỉnh: 「天気の話が天気に関係した話に広がって、おもしろいと思いました。」
Dịch: “Tôi thấy thú vị khi câu chuyện thời tiết mở rộng sang những chủ đề có liên quan đến thời tiết.”
1. 広がって = lan rộng/mở rộng rồi; thể て nối sự việc với đánh giá 「おもしろいと思いました」.
2. 広がるより = thay vì/hơn là lan rộng; 「より」 cần một nội dung để so sánh, nhưng câu không có.
3. 広がるように = để cho lan rộng/theo cách lan rộng; thường biểu thị mục đích hoặc trạng thái hướng tới, không kể sự việc đã xảy ra.
4. 広がったそうで = nghe nói đã lan rộng; không hợp vì người viết trực tiếp kể trải nghiệm và cấu trúc câu sau.
Ghi nhớ: 「Vて、おもしろいと思った」 nối sự việc thực tế với cảm nhận.`,
  57: `Đáp án 3: 「天気に関心を持つのかもしれません」 là suy đoán hợp lý từ việc Nhật có bốn mùa, nhiệt độ thay đổi lớn và thời tiết thường đổi.
Câu hoàn chỉnh: 「日本は四季があって気温の変化が大きいし、天気もよく変わります。そのため、多くの人が天気に関心を持つのかもしれません。」
Dịch: “Nhật Bản có bốn mùa, nhiệt độ thay đổi nhiều và thời tiết cũng thường biến đổi. Vì thế, có lẽ nhiều người quan tâm đến thời tiết.”
1. 持ったはずがありません = chắc chắn đã không quan tâm; phủ định quá khứ trái với suy luận vừa nêu.
2. 持ちたがりません = không muốn quan tâm; 「～たがる」 nói mong muốn của người khác, nhưng ý này trái với mạch câu.
3. 持つのかもしれません = có lẽ quan tâm; mẫu 「かもしれない」 nêu phỏng đoán, phù hợp 「そのため」.
4. 持とうとしません = không chịu/cố gắng quan tâm; mang nghĩa chủ động từ chối, không có căn cứ trong đoạn.
Ghi nhớ: 「普通形＋のかもしれない」 = có lẽ/có thể là…; ở đây phải viết đúng 「かもしれません」.`,
  58: `Đáp án 2: 「これも」 chỉ ý vừa nêu ngay trước đó: chuyện thời tiết là chủ đề dễ bắt đầu với bất kỳ ai.
Câu hoàn chỉnh: 「最近は管理人さんともよく天気の話をするようになって、天気の話は誰とでもしやすいことに気づきました。これも天気の話をする人が多い理由の一つだと思います。」
Dịch: “Gần đây tôi cũng thường nói chuyện thời tiết với người quản lý, và nhận ra rằng đây là chủ đề dễ bắt chuyện với bất kỳ ai. Tôi nghĩ điều đó cũng là một lý do khiến nhiều người nói chuyện thời tiết.”
1. どれ = cái nào trong số nhiều thứ; là từ để hỏi, không phù hợp với câu khẳng định.
2. これ = điều này; quy chiếu đến nhận xét vừa nêu, nên đúng.
3. あれら = những thứ kia; chỉ nhiều vật/sự việc ở xa trong ngữ cảnh.
4. それら = những điều đó; thường quy chiếu đến nhiều điều đã nêu, trong khi ở đây câu nêu một phát hiện gần ngay trước đó.
Ghi nhớ: 「これ」 có thể quy chiếu đến sự việc hoặc nhận xét vừa được nêu.`,
}

for (const [number, explanation] of Object.entries(explanations)) {
  const question = mockQuestions.get(Number(number))
  if (!question) throw new Error(`Missing grammar explanation question ${number}.`)
  question.explanation = explanation
  curated[question.id] = explanation
}

const q49 = mockQuestions.get(49)
if (!q49 || JSON.stringify(q49.starCorrectOrder) !== JSON.stringify([4, 2, 3, 1])) {
  throw new Error('Q49 star order changed unexpectedly; review the source before editing its answer.')
}
q49.correctAnswer = 2
q49.answer = 2
q49.starPosition = 1
q49.starOrderVerified = true
q49.starPositionVerified = true
q49.starVerificationSources = ['https://drive.google.com/file/d/1ZPZIPaDo5BrgR-n0h5XUcpCOXR73Riz7/view#page=5']
q49.starVerificationNote =
  'Compared with printed question 14 on PDF page 5. Its ★ marks the second of four slots; assembling the sentence as 4→2→3→1 places option 2 at ★. The nonofficial published key also lists answer 2.'

for (const number of [37, 42, 43, 46, 47, 52, 57]) {
  const q = fullQuestions.get(number)
  if (q && mockQuestions.get(number)) {
    const fullAnswer = Number(q.correctAnswer ?? q.answer)
    const mockAnswer = Number(mockQuestions.get(number).correctAnswer ?? mockQuestions.get(number).answer)
    if (fullAnswer !== mockAnswer) throw new Error(`Answer mismatch between masters in q${number}.`)
  }
}

const sourceCorrections = [
  {
    questionNumber: 37,
    printedQuestion: 2,
    correction: '会社面接 → 会社の面接',
    reason: 'The original PDF contains の.',
  },
  {
    questionNumber: 42,
    printedQuestion: 7,
    correction: '申し上げ生す → 申し上げます',
    reason: 'Corrected clear kana transcription in option 4.',
  },
  {
    questionNumber: 43,
    printedQuestion: 8,
    correction: '持いくつもりだ / 持っていくつ香りだ → 持っていくつもりだ',
    reason: 'Restored the printed option from the scanned PDF.',
  },
  {
    questionNumber: 46,
    printedQuestion: 11,
    correction: '予約してある → 予約してあるね',
    reason: 'Restored the final ね printed in option 4.',
  },
  {
    questionNumber: 47,
    printedQuestion: 12,
    correction: 'ごのトマト → このトマト',
    reason: 'Restored the demonstrative visible in the original PDF.',
  },
  {
    questionNumber: 52,
    printedQuestion: 17,
    correction: '(レスランで) → (レストランで); quoted wording retained as a disclosed source conflict',
    reason:
      'The scan and PDF text layer disagree on the prompt ending and option 2; see the star-specific review instead of treating this as a settled OCR correction.',
  },
  {
    questionNumber: 57,
    printedQuestion: 22,
    correction: '持つのかもしれせん / つの かもしれません → 持つのかもしれません',
    reason: 'Restored the beginning of option 3 and the correct kana.',
  },
]

fs.writeFileSync(fullPath, `${JSON.stringify(fullExams, null, 2)}\n`, 'utf8')
fs.writeFileSync(mockPath, `${JSON.stringify(mockExams, null, 2)}\n`, 'utf8')
fs.writeFileSync(curatedPath, `${JSON.stringify(curated, null, 2)}\n`, 'utf8')
fs.writeFileSync(
  'reports/n3-quality-audit/grammar-source-2016-12-review.json',
  `${JSON.stringify(
    {
      generatedAt: new Date().toISOString(),
      exam: 'JLPT N3 December 2016',
      scope: 'Grammar questions 36–58 (printed questions 1–23).',
      questionPdf: 'https://drive.google.com/file/d/1ZPZIPaDo5BrgR-n0h5XUcpCOXR73Riz7/view',
      secondaryAnswerKey: 'https://chuyenngoaingu.com/news/dap-an-ky-thi-jlpt-thang-12-nam-2016-201.aspx',
      answerKeyStatus:
        'Compared against a published nonofficial answer table and independently assembled in context; the table is not an official JLPT answer sheet.',
      verifiedAnswerSequence: {
        mondai1: [2, 4, 3, 1, 4, 2, 3, 2, 3, 1, 2, 4, 1],
        mondai2: [2, 4, 2, 1, 3],
        mondai3: [3, 4, 1, 3, 2],
      },
      keyConflictResolved: {
        questionNumber: 49,
        printedQuestion: 14,
        before: 3,
        after: 2,
        reason:
          'The source marks slot 2; the correct assembled sentence order is 4→2→3→1. The full-section master and nonofficial answer table both indicate 2.',
      },
      sourceCorrections,
      sourceDiscrepancies: [
        {
          printedQuestion: 17,
          internalQuestionNumber: 52,
          status: 'source-conflict-disclosed-editorial-reconstruction',
          visiblePromptEnding: '待てって',
          printedOption2: 'と言われた',
          appOption2: '言われた',
          alternatePdfOption2: '言われた',
          alternatePdfUrl:
            'https://www.tiengnhatdongian.com/wp-content/uploads/2023/04/De-N3-12-2016.pdf',
          explanation:
            'The supplied Google Drive PDF prints と言われた, while a separate published PDF copy prints 言われた and corroborates the app wording. Keep the version difference disclosed; no official JLPT key is established.',
          detailReport: 'star-source-2016-12-q17-review.json',
        },
      ],
      explanationCoverage:
        'All 23 grammar explanations include the selected answer, a Vietnamese translation or full translated context, and a reason for each choice.',
    },
    null,
    2
  )}\n`,
  'utf8'
)

console.log(
  'Corrected December 2016 grammar source text, fixed q49 star slot/key, and expanded explanations for q49–58.'
)
