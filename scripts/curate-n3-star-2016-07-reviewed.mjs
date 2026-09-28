import fs from 'node:fs'

const mockPath = 'data/jlpt_n3_toan_master.json'
const sectionPath = 'data/jlpt_full_master.json'
const curatedPath = 'data/jlpt_n3_explanations_curated.json'
const reviewPath = 'reports/n3-quality-audit/star-source-2016-07-review.json'
const pdfUrl = 'https://drive.google.com/file/d/1wTMSYTI-E1v3c67VMlkPUkJBz1uF9FGZ/view'
const answerReferences = [
  {
    name: 'Saromalang',
    url: 'https://www.saromalang.com/2016/07/jlptn3-bunpou.html',
    answers: [1, 3, 4, 1, 2],
  },
  {
    name: 'NJLPT Center',
    url: 'https://njlptcenter.wordpress.com/tag/%E0%B9%81%E0%B8%81%E0%B8%A3%E0%B8%A1%E0%B8%A1%E0%B9%88%E0%B8%B2/',
    answers: [1, 3, 4, 1, 2],
  },
]

const items = [
  {
    internalNumber: 49,
    printedQuestion: 14,
    answer: 1,
    order: [3, 1, 4, 2],
    starPosition: 1,
    page: 6,
    sentence: '今日は、久しぶりに家族5人で楽しい休日を過ごした。',
    translation: 'Hôm nay, sau một thời gian dài, gia đình năm người chúng tôi đã có một ngày nghỉ vui vẻ.',
    explanation: `Câu hoàn chỉnh: 「今日は、久しぶりに家族5人で楽しい休日を過ごした。」
Dịch: “Hôm nay, sau một thời gian dài, gia đình năm người chúng tôi đã có một ngày nghỉ vui vẻ.”
Thứ tự ghép là 3 → 1 → 4 → 2. Ô ★ là vị trí thứ hai nên đáp án là 1 「で」.
1. 「で」đứng sau 「家族5人」, chỉ việc cả năm thành viên cùng trải qua ngày nghỉ.
2. 「を」đánh dấu tân ngữ 「楽しい休日」, vì vậy phải đứng sau cụm này, ngay trước 「過ごした」.
3. 「5人」bổ nghĩa cho 「家族」, nên đứng ngay sau 「家族」.
4. 「楽しい休日」là tân ngữ của 「過ごした」; tính từ 「楽しい」bổ nghĩa cho danh từ 「休日」, và cả cụm phải đứng trước 「を」.
Do vị trí ★ nằm sau 「家族5人」, chỉ mảnh 1 nối đúng ở đó; ba mảnh còn lại có vị trí cú pháp khác trong câu.
Ghi nhớ: 「Nで過ごす」nêu nhóm người hoặc cách thức cùng trải qua một khoảng thời gian.`,
  },
  {
    internalNumber: 50,
    printedQuestion: 15,
    answer: 3,
    order: [1, 3, 2, 4],
    starPosition: 1,
    page: 6,
    sentence: '駅前の店のラーメンは、濃い味が好きな人にはいいかもしれないが、私はちょっと苦手だ。',
    translation:
      'Món ramen của quán trước nhà ga có thể hợp với những người thích vị đậm, nhưng tôi thì hơi không hợp khẩu vị.',
    explanation: `Câu hoàn chỉnh: 「駅前の店のラーメンは、濃い味が好きな人にはいいかもしれないが、私はちょっと苦手だ。」
Dịch: “Món ramen của quán trước nhà ga có thể hợp với những người thích vị đậm, nhưng tôi thì hơi không hợp khẩu vị.”
Thứ tự ghép là 1 → 3 → 2 → 4. Ô ★ là vị trí thứ hai nên đáp án là 3 「好きな人には」.
1. 「味が」ghép với 「濃い」thành 「濃い味が」, nên đứng đầu bốn mảnh.
2. 「いい」là vị ngữ đánh giá, đứng sau 「好きな人には」.
3. 「好きな人には」nghĩa là “đối với người thích…”, nối sau 「濃い味が」và đứng trước 「いい」.
4. 「かもしれないが」nối sau 「いい」, tạo nghĩa “có thể ngon/hợp, nhưng…”.
Tại ★, mảnh 1 còn thiếu vế 「好きな人には」 để bổ nghĩa cho 「いい」; các mảnh 2 và 4 chỉ có thể đứng sau mảnh 3.
Ghi nhớ: 「Nが好きな人には」= “đối với người thích N”; 「かもしれないが」nêu khả năng rồi chuyển sang ý trái chiều.`,
  },
  {
    internalNumber: 51,
    printedQuestion: 16,
    answer: 4,
    order: [3, 2, 4, 1],
    starPosition: 2,
    page: 6,
    sentence: '久しぶりにふるさとに帰ったが、昔は何もなかった駅の周りがすっかり変わっているのを見て驚いた。',
    translation:
      'Lâu ngày mới trở về quê, tôi ngạc nhiên khi thấy khu vực quanh nhà ga, nơi trước đây chẳng có gì, đã thay đổi hoàn toàn.',
    explanation: `Câu hoàn chỉnh: 「久しぶりにふるさとに帰ったが、昔は何もなかった駅の周りがすっかり変わっているのを見て驚いた。」
Dịch: “Lâu ngày mới trở về quê, tôi ngạc nhiên khi thấy khu vực quanh nhà ga, nơi trước đây chẳng có gì, đã thay đổi hoàn toàn.”
Thứ tự ghép là 3 → 2 → 4 → 1. Ô ★ là vị trí thứ ba nên đáp án là 4 「変わっている」.
1. 「のを」danh từ hóa sự việc 「変わっている」để nối với 「見て驚いた」: ngạc nhiên khi nhìn thấy việc đó.
2. 「すっかり」là trạng từ “hoàn toàn”, đứng trước động từ 「変わっている」.
3. 「駅の周りが」là chủ ngữ của trạng thái thay đổi và đứng trước 「すっかり」.
4. 「変わっている」hoàn tất vị ngữ sau 「すっかり」, rồi mới tới 「のを見て」.
Vì ★ đứng sau 「すっかり」và trước 「のを」, chỉ mảnh 4 tạo được cụm 「すっかり変わっているのを」.
Ghi nhớ: 「すっかり変わっている」= đã thay đổi hoàn toàn; 「Vているのを見て」nêu việc được nhìn thấy.`,
  },
  {
    internalNumber: 52,
    printedQuestion: 17,
    answer: 1,
    order: [2, 4, 1, 3],
    starPosition: 2,
    page: 6,
    sentence: 'これまでの人生の中で自分の子供が生まれた日ほど、うれしかった日はない。',
    translation: 'Trong suốt cuộc đời mình cho đến nay, chưa có ngày nào vui bằng ngày con tôi chào đời.',
    explanation: `Câu hoàn chỉnh: 「これまでの人生の中で自分の子供が生まれた日ほど、うれしかった日はない。」
Dịch: “Trong suốt cuộc đời mình cho đến nay, chưa có ngày nào vui bằng ngày con tôi chào đời.”
Thứ tự ghép là 2 → 4 → 1 → 3. Ô ★ là vị trí thứ ba nên đáp án là 1 「日ほど」.
1. 「日ほど」đứng sau mệnh đề bổ nghĩa 「自分の子供が生まれた」, tạo cụm “đến mức/ngang bằng ngày…”, làm chuẩn so sánh.
2. 「自分の子供が」nêu chủ thể của việc chào đời, đứng đầu cụm.
3. 「うれしかった」là tính từ quá khứ, đứng sau 「日ほど」; vế sau 「日はない」hoàn tất mẫu so sánh phủ định.
4. 「生まれた」bổ nghĩa cho danh từ 「日」, nên đứng sau chủ ngữ và trước 「日ほど」.
Ở vị trí ★, 「日ほど」khép cụm danh từ vừa được bổ nghĩa và nối với 「うれしかった日はない」; các mảnh còn lại cần đứng trước hoặc sau nó.
Ghi nhớ: 「Aほど～ない」= không … bằng A; 「Vた日」= ngày mà việc V đã xảy ra.`,
  },
  {
    internalNumber: 53,
    printedQuestion: 18,
    answer: 2,
    order: [3, 4, 2, 1],
    starPosition: 2,
    page: 7,
    sentence: '今回の彼の新曲は、友情がテーマになっているという点でこれまでに発表されてきた彼の曲と大きく違う。',
    translation:
      'Ca khúc mới lần này của anh ấy khác hẳn các ca khúc anh từng phát hành trước đây ở điểm chủ đề là tình bạn.',
    explanation: `Câu hoàn chỉnh: 「今回の彼の新曲は、友情がテーマになっているという点でこれまでに発表されてきた彼の曲と大きく違う。」
Dịch: “Ca khúc mới lần này của anh ấy khác hẳn các ca khúc anh từng phát hành trước đây ở điểm chủ đề là tình bạn.”
Thứ tự ghép là 3 → 4 → 2 → 1. Ô ★ là vị trí thứ ba nên đáp án là 2 「発表されてきた」.
1. 「彼の曲と」đứng sau cụm bổ nghĩa cho 「彼の曲」và làm đối tượng so sánh trong 「～と違う」.
2. 「発表されてきた」bổ nghĩa cho danh từ 「彼の曲」: những ca khúc đã được phát hành từ trước đến nay.
3. 「という点で」nối sau nội dung 「友情がテーマになっている」, nghĩa là “ở điểm/ở khía cạnh là…”.
4. 「これまでに」nghĩa là “cho đến nay/trước đây”, đứng trước 「発表されてきた」.
Sau 「これまでに」, vị trí ★ cần động từ bổ nghĩa cho 「彼の曲」; chỉ mảnh 2 nối được ở đó. Mảnh 1 cần đứng cuối ngay trước 「大きく違う」.
Ghi nhớ: 「～という点で」nêu khía cạnh so sánh; 「Vてくる」trong 「発表されてきた」nhìn lại quá trình diễn ra cho đến hiện tại.`,
  },
]

const readJson = (file) => JSON.parse(fs.readFileSync(file, 'utf8'))
const writeJson = (file, value) => fs.writeFileSync(file, `${JSON.stringify(value, null, 2)}\n`, 'utf8')
const mockExams = readJson(mockPath)
const sectionExams = readJson(sectionPath)
const curated = readJson(curatedPath)
const mockExam = mockExams.find((exam) => exam.id === 'toan-n3-201607-full')
const sectionExam = sectionExams.find((exam) => exam.id === 'cm2u2wh2e005t134ip8znt3dd-grammar-reading')
if (!mockExam || !sectionExam) throw new Error('Missing one of the July 2016 N3 exams.')

const allQuestions = (exam) => exam.parts.flatMap((part) => part.questions || [])
const mockByNumber = new Map(allQuestions(mockExam).map((question) => [Number(question.number), question]))
const sectionByNumber = new Map(allQuestions(sectionExam).map((question) => [Number(question.number), question]))
const normalizeOption = (option) =>
  String(typeof option === 'object' && option ? option.text : option)
    .normalize('NFKC')
    .replace(/^\s*[1-4][.．、\s　]*/u, '')
    .trim()

const renderScript = (item, question) => {
  const options = question.options.map(normalizeOption)
  const fragments = item.order.map((choice, index) =>
    index === item.starPosition ? `<u>${options[choice - 1]}</u>` : options[choice - 1]
  )
  return `${question.starPrompt.before}${fragments.join('')}${question.starPrompt.after}`
}

const reviewQuestions = items.map((item) => {
  const mockQuestion = mockByNumber.get(item.internalNumber)
  const sectionQuestion = sectionByNumber.get(item.internalNumber)
  if (!mockQuestion || !sectionQuestion) throw new Error(`Missing internal question ${item.internalNumber}.`)
  const options = mockQuestion.options.map(normalizeOption)
  if (mockQuestion.options.length !== 4 || item.order[item.starPosition] !== item.answer) {
    throw new Error(`Invalid options, answer, or star position for printed question ${item.printedQuestion}.`)
  }
  for (const reference of answerReferences) {
    if (reference.answers[item.printedQuestion - 14] !== item.answer) {
      throw new Error(`Answer key mismatch for ${reference.name}, question ${item.printedQuestion}.`)
    }
  }

  mockQuestion.answer = item.answer
  mockQuestion.correctAnswer = item.answer
  mockQuestion.starCorrectOrder = [...item.order]
  mockQuestion.starPosition = item.starPosition
  mockQuestion.starOrderVerified = true
  mockQuestion.starPositionVerified = true
  mockQuestion.starVerificationSources = [pdfUrl, ...answerReferences.map((reference) => reference.url)]
  mockQuestion.starVerificationStatus = 'verified-against-source'
  mockQuestion.starVerificationNote =
    'PDF trang gốc đã được xem trực tiếp để xác nhận mảnh lựa chọn, thứ tự và vị trí ★; đáp án khớp với hai bảng giải không chính thức. Chưa có đáp án chính thức JLPT trong bộ nguồn.'
  mockQuestion.explanation = item.explanation

  sectionQuestion.answer = String(item.answer)
  sectionQuestion.correctAnswer = String(item.answer)
  sectionQuestion.script = renderScript(item, mockQuestion)
  sectionQuestion.explanation = item.explanation
  sectionQuestion.starCorrectOrder = [...item.order]
  sectionQuestion.starPosition = item.starPosition
  sectionQuestion.starOrderVerified = true
  sectionQuestion.starPositionVerified = true
  sectionQuestion.starVerificationSources = [pdfUrl, ...answerReferences.map((reference) => reference.url)]
  sectionQuestion.starVerificationStatus = 'verified-against-source'
  sectionQuestion.starVerificationNote = mockQuestion.starVerificationNote
  curated[mockQuestion.id] = item.explanation
  curated[sectionQuestion.id] = item.explanation

  return {
    printedQuestion: item.printedQuestion,
    internalQuestionNumber: item.internalNumber,
    fullExamQuestionId: mockQuestion.id,
    standaloneQuestionId: sectionQuestion.id,
    printedPage: item.page,
    printedOptions: options,
    answer: item.answer,
    order: [...item.order],
    starPosition: item.starPosition,
    completedSentence: item.sentence,
    vietnameseTranslation: item.translation,
    displayedSolutionScript: sectionQuestion.script,
    explanationCoverage: {
      answerIdentified: item.explanation.includes(`đáp án là ${item.answer}`),
      allFourOptionsAddressed: [1, 2, 3, 4].every((choice) =>
        new RegExp(`(?:^|\\n)${choice}\\.`, 'u').test(item.explanation)
      ),
      fullSentenceAndTranslation:
        item.explanation.includes(item.sentence) && item.explanation.includes(item.translation),
      fragmentPlacementExplained: /Ô ★/u.test(item.explanation),
    },
    sourceStatus: 'verified-against-source',
  }
})

const report = {
  generatedAt: new Date().toISOString(),
  exam: 'JLPT N3 July 2016',
  scope: 'Grammar Mondai 2, printed questions 14–18.',
  sourcePdf: {
    title: 'JLPT・N3・7/2016',
    url: pdfUrl,
    renderedPages: [
      { printedPage: 6, pdfPage: 6, printedQuestions: [14, 15, 16, 17] },
      { printedPage: 7, pdfPage: 7, printedQuestions: [18] },
    ],
    status:
      'Original PDF reviewed visually in Chrome; option text, sentence fragments, and each printed ★ slot checked against the stored order.',
  },
  answerReferences: answerReferences.map(({ name, url, answers }) => ({
    name,
    url,
    answers,
    status: 'Independent nonofficial answer explanation; agrees with the assembled sentence and marked ★ option.',
  })),
  officialKeyEstablished: false,
  corrections: [
    { printedQuestion: 14, previousAnswer: 4, answer: 1, previousStarPosition: 2, starPosition: 1 },
    { printedQuestion: 15, previousAnswer: 2, answer: 3, previousStarPosition: 2, starPosition: 1 },
    { printedQuestion: 18, previousAnswer: 1, answer: 2, previousStarPosition: 3, starPosition: 2 },
  ],
  sourceTextCorrection:
    'Câu 18 ở đề học riêng từng có lỗi chép 「テーマになったいる」; câu và script đã được đồng bộ theo PDF thành 「テーマになっている」.',
  explanationsAppliedTo: ['full mock exam', 'standalone grammar/reading exam'],
  questions: reviewQuestions,
}

writeJson(mockPath, mockExams)
writeJson(sectionPath, sectionExams)
writeJson(curatedPath, curated)
writeJson(reviewPath, report)
console.log(`Reviewed and synchronized the five July 2016 grammar ★ questions.`)
