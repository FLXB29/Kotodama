import fs from 'node:fs'

const mockPath = 'data/jlpt_n3_toan_master.json'
const sectionPath = 'data/jlpt_full_master.json'
const curatedPath = 'data/jlpt_n3_explanations_curated.json'
const reviewPath = 'reports/n3-quality-audit/star-source-2015-07-review.json'
const pdfUrl = 'https://drive.google.com/file/d/1JLn00FB2uQgPS44-FqqoNtPWXVquNeEe/view'
const answerReferences = [
  {
    name: 'TiengNhatDonGian — đáp án và giải thích',
    url: 'https://www.tiengnhatdongian.com/wp-content/uploads/2023/04/Dap-anScript-N3-7-2015.pdf',
    answers: [3, 2, 1, 4, 1],
  },
  {
    name: 'Tailieutiengnhat — đáp án đề JLPT N3 7/2015',
    url: 'https://tailieutiengnhat.net/luyen-thi-ngu-phap-jlpt-n3-de-6.html',
    answers: [3, 2, 1, 4, 1],
  },
  {
    name: 'Scribd — bảng đáp án JLPT N3',
    url: 'https://www.scribd.com/document/885818943/%C4%90ap-An-Jlpt-n3-Update-290724',
    answers: [3, 2, 1, 4, 1],
  },
]

const items = [
  {
    internalNumber: 49,
    printedQuestion: 14,
    answer: 3,
    order: [3, 2, 1, 4],
    starPosition: 0,
    pdfPage: 5,
    sentence: 'この家に引っ越してきて、もう半年になるのにまだ住所を覚えていないだけです。',
    translation: 'Tôi chuyển đến ngôi nhà này đã nửa năm rồi mà vẫn chưa nhớ được địa chỉ.',
    explanation: `Câu hoàn chỉnh: 「この家に引っ越してきて、もう半年になるのにまだ住所を覚えていないだけです。」
Dịch: “Tôi chuyển đến ngôi nhà này đã nửa năm rồi mà vẫn chưa nhớ được địa chỉ.”
Thứ tự bốn mảnh là 3 → 2 → 1 → 4. Ô ★ đầu tiên nhận 「半年になる」, nên đáp án là 3.
1. 「まだ」 nghĩa là “vẫn/chưa”; nó đứng sát trước vị ngữ phủ định 「住所を覚えていない」, nên không thể ở ô đầu.
2. 「のに」 nối hai ý tương phản “đã nửa năm rồi” và “vẫn chưa nhớ địa chỉ”; nó phải theo sau 「半年になる」.
3. 「半年になる」 nói thời gian kể từ khi chuyển nhà đã tròn nửa năm. 「もう」 đứng trước cụm này, còn 「のに」 đứng ngay sau, nên lựa chọn 3 nằm ở ô ★.
4. 「住所を覚えていない」 là vị ngữ “chưa nhớ địa chỉ”; nó phải theo sau 「まだ」 và là mảnh cuối trước 「だけです」.
Ghi nhớ: 「もう期間になるのに、まだ～ない」 = “đã được một khoảng thời gian rồi vậy mà vẫn chưa…”.`,
  },
  {
    internalNumber: 50,
    printedQuestion: 15,
    answer: 2,
    order: [1, 4, 2, 3],
    starPosition: 2,
    pdfPage: 5,
    sentence: '毎年、X社には多くの新入社員が入るが、仕事があまりに忙しくて3年以内にやめてしまう社員が多いそうだ。',
    translation:
      'Hằng năm có nhiều nhân viên mới vào công ty X, nhưng nghe nói nhiều người nghỉ việc trong vòng ba năm vì công việc quá bận.',
    explanation: `Câu hoàn chỉnh: 「毎年、X社には多くの新入社員が入るが、仕事があまりに忙しくて3年以内にやめてしまう社員が多いそうだ。」
Dịch: “Hằng năm có nhiều nhân viên mới vào công ty X, nhưng nghe nói nhiều người nghỉ việc trong vòng ba năm vì công việc quá bận.”
Thứ tự bốn mảnh là 1 → 4 → 2 → 3. Ô ★ thứ ba nhận 「やめてしまう」, nên đáp án là 2.
1. 「あまりに忙しくて」 diễn tả nguyên nhân “vì quá bận”; cụm này bổ sung cho 「仕事が」 và mở đầu phần ghép.
2. 「やめてしまう」 là hành động nghỉ việc; nó theo sau mốc thời gian 「3年以内に」 và bổ nghĩa cho 「社員」.
3. 「社員が」 là chủ ngữ của 「多い」, nên đứng sau cụm bổ nghĩa 「やめてしまう」 và sát trước 「多いそうだ」.
4. 「3年以内に」 nghĩa là “trong vòng ba năm”; nó đứng sau cụm chỉ nguyên nhân và trước động từ 「やめてしまう」.
Ghi nhớ: 「あまりに～くて」 nêu mức độ quá mức dẫn đến tình trạng tiếp theo; 「Vてしまう」 ở đây diễn tả kết quả nghỉ việc đáng tiếc/không mong muốn.`,
  },
  {
    internalNumber: 51,
    printedQuestion: 16,
    answer: 1,
    order: [4, 3, 1, 2],
    starPosition: 2,
    pdfPage: 5,
    sentence: 'この島は、空から見ると人の耳のような形に見えることから「耳島」と呼ばれています。',
    translation: 'Hòn đảo này được gọi là ‘đảo Tai’ vì nhìn từ trên cao, nó có hình dáng giống tai người.',
    explanation: `Câu hoàn chỉnh: この島は、空から見ると人の耳のような形に見えることから「耳島」と呼ばれています。
Dịch: “Hòn đảo này được gọi là ‘đảo Tai’ vì nhìn từ trên cao, nó có hình dáng giống tai người.”
Thứ tự bốn mảnh là 4 → 3 → 1 → 2. Ô ★ thứ ba nhận 「形に」, nên đáp án là 1.
1. 「形に」 nghĩa là “thành/có hình dạng”; nó theo sau phần so sánh 「人の耳のような」 và kết hợp với 「見える」.
2. 「見えることから」 nêu lý do “vì trông có vẻ…”, nên đứng sau toàn bộ cụm 「人の耳のような形に見える」 và trước 「「耳島」と呼ばれています」.
3. 「人の耳のような」 nghĩa là “giống tai người”; nó bổ nghĩa cho danh từ 「形」, nên phải đứng ngay trước 「形に」.
4. 「見ると」 nghĩa là “khi nhìn”; nó nối với 「空から」 thành “khi nhìn từ trên trời”, nên mở đầu chuỗi mảnh.
Ghi nhớ: 「Nのような形に見える」 = “trông có hình dạng giống N”; 「～ことから」 nêu căn cứ/lý do.`,
  },
  {
    internalNumber: 52,
    printedQuestion: 17,
    answer: 4,
    order: [2, 1, 4, 3],
    starPosition: 2,
    pdfPage: 5,
    sentence: '一人暮らしを始めて3か月が過ぎたが、家に話し相手が誰もいないのは寂しいといつも思う。',
    translation: 'Dù đã qua ba tháng sống một mình, tôi vẫn luôn thấy buồn vì ở nhà chẳng có ai để trò chuyện.',
    explanation: `Câu hoàn chỉnh: 「一人暮らしを始めて3か月が過ぎたが、家に話し相手が誰もいないのは寂しいといつも思う。」
Dịch: “Dù đã qua ba tháng sống một mình, tôi vẫn luôn thấy buồn vì ở nhà chẳng có ai để trò chuyện.”
Thứ tự bốn mảnh là 2 → 1 → 4 → 3. Ô ★ thứ ba nhận 「のは」, nên đáp án là 4.
1. 「誰もいない」 hoàn thành ý “không có ai”; nó theo sau chủ ngữ 「話し相手が」.
2. 「話し相手が」 nêu “người để trò chuyện” là chủ thể của 「誰もいない」, nên đứng trước lựa chọn 1.
3. 「寂しい」 là phần nhận xét “thật buồn”; nó đứng sau mệnh đề đã được danh từ hóa bằng 「のは」.
4. 「のは」 danh từ hóa mệnh đề 「話し相手が誰もいない」 và nêu đó là điều khiến người nói thấy buồn; nó phải nằm ngay trước 「寂しい」, đúng vị trí ★.
Ghi nhớ: 「mệnh đề + のは + tính từ」 biến một sự việc thành chủ đề để nhận xét: “việc… thì…”.`,
  },
  {
    internalNumber: 53,
    printedQuestion: 18,
    answer: 1,
    order: [4, 2, 1, 3],
    starPosition: 2,
    pdfPage: 5,
    sentence: '30日以上雨の降らない日が続いているが、すぐ気にならなくなった。',
    translation: 'Đã hơn 30 ngày liền không mưa, nhưng rồi tôi cũng nhanh chóng không còn bận tâm đến điều đó nữa.',
    explanation: `Câu hoàn chỉnh: 「30日以上雨の降らない日が続いているが、すぐ気にならなくなった。」
Dịch: “Đã hơn 30 ngày liền không mưa, nhưng rồi tôi cũng nhanh chóng không còn bận tâm đến điều đó nữa.”
Thứ tự bốn mảnh là 4 → 2 → 1 → 3. Ô ★ thứ ba nhận 「日が」, nên đáp án là 1.
1. 「日が」 nghĩa là “ngày/ngày đó”; nó là chủ ngữ của 「続いている」, nên đứng sau cụm bổ nghĩa 「雨の降らない」 và trước động từ cuối.
2. 「降らない」 nghĩa là “không mưa”; nó bổ nghĩa cho danh từ 「日」, nên đứng sau 「雨の」 và trước 「日が」.
3. 「続いている」 là vị ngữ “đang tiếp diễn”; nó hoàn tất cụm chủ ngữ 「雨の降らない日が」 ngay trước liên từ 「が」.
4. 「雨の」 mở đầu cụm “mưa không rơi”; 「の」 đánh dấu chủ thể trong mệnh đề bổ nghĩa cho 「日」, vì vậy nó phải đứng trước 「降らない」.
Ghi nhớ: 「雨の降らない日」 = “ngày không mưa”; danh từ 「日」 mang trợ từ 「が」 làm chủ ngữ cho 「続いている」.`,
  },
]

const readJson = (file) => JSON.parse(fs.readFileSync(file, 'utf8'))
const writeJson = (file, value) => fs.writeFileSync(file, `${JSON.stringify(value, null, 2)}\n`, 'utf8')
const mockExams = readJson(mockPath)
const sectionExams = readJson(sectionPath)
const curated = readJson(curatedPath)
const mockExam = mockExams.find((exam) => exam.id === 'toan-n3-201507-full')
const sectionExam = sectionExams.find((exam) => exam.id === 'cm2u2w9ag0000134idizwckzy-grammar-reading')
if (!mockExam || !sectionExam) throw new Error('Missing one of the July 2015 N3 exams.')

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
  if (!mockQuestion || !sectionQuestion) throw new Error(`Missing internal question ${item.printedQuestion}.`)
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
    'Đã xem trực tiếp PDF gốc trong Chrome để xác nhận nguyên văn các mảnh và vị trí ★; thứ tự/đáp án khớp ba bảng giải thứ cấp độc lập. Chưa có khóa đáp án JLPT chính thức trong bộ nguồn.'
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
    printedPage: item.pdfPage,
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
  exam: 'JLPT N3 July 2015',
  scope: 'Grammar Mondai 2, printed questions 14–18.',
  sourcePdf: {
    title: 'JLPT・N3・7/2015',
    url: pdfUrl,
    driveFileId: '1JLn00FB2uQgPS44-FqqoNtPWXVquNeEe',
    renderedPages: [
      {
        printedPage: 5,
        pdfPage: 5,
        printedQuestions: [14, 15, 16, 17, 18],
      },
    ],
    status:
      'PDF gốc đã được kiểm tra trực tiếp bằng mắt trong Chrome ở mức thu phóng cho thấy trọn trang; chữ các lựa chọn và vị trí ★ của cả năm câu đã được đối chiếu với dữ liệu.',
  },
  answerReferences: answerReferences.map(({ name, url, answers }) => ({
    name,
    url,
    answers,
    status: 'Nguồn khóa/giải không chính thức; dãy đáp án khớp với câu đã hoàn chỉnh và lựa chọn nằm tại dấu ★.',
  })),
  officialKeyEstablished: false,
  corrections: [
    {
      printedQuestion: 14,
      previousFullExamAnswer: 1,
      previousStandaloneAnswer: 3,
      answer: 3,
      previousStarPosition: 2,
      starPosition: 0,
      order: [3, 2, 1, 4],
    },
  ],
  explanationsAppliedTo: ['full mock exam', 'standalone grammar/reading exam', 'curated explanation map'],
  questions: reviewQuestions,
}

writeJson(mockPath, mockExams)
writeJson(sectionPath, sectionExams)
writeJson(curatedPath, curated)
writeJson(reviewPath, report)
console.log('Reviewed and synchronized the five July 2015 grammar ★ questions.')
