import fs from 'node:fs'

const fullExamPath = 'data/jlpt_n3_toan_master.json'
const sectionExamPath = 'data/jlpt_full_master.json'
const curatedPath = 'data/jlpt_n3_explanations_curated.json'
const reviewPath = 'reports/n3-quality-audit/grammar-m3-2015-07-review.json'

const examId = 'toan-n3-201507-full'
const standaloneExamId = 'cm2u2w9ag0000134idizwckzy-grammar-reading'
const expectedAnswers = [1, 3, 2, 1, 2]
const questionNumbers = [54, 55, 56, 57, 58]
const sourceOptions = [
  ['負けるでしょう', '負けてしまいます', '負けました', '負けていました'],
  ['それから', 'そのほか', 'そのころ', 'それでも'],
  ['考えてくれたのです', '考えることができたのです', '考えてくれたらいいです', '考えることができたらいいです'],
  ['チャンス', 'あのチャンス', 'どちらかのチャンス', 'このチャンス'],
  ['大好きな言葉があります', '私が大好きな言葉です', '大好きだという点です', '嫌いだという点です'],
]

const sourcePassage = `以下の文章は、留学生の作文である。
<p><strong>私の好きな言葉</strong><br>ヤン ミン</p>
<p>「あきらめたら、そこで試合終了ですよ。」</p>
<p>私はこの言葉を高校生のときに見ていたアニメで知りました。そのアニメは、ある高校のバスケットボール部の話です。ほかの高校と試合をして、残り時間が11分になったとき、そのバスケットボール部は22点の差で(19)。選手たちはもう勝てないかもしれないと思い始めました。そんなとき、そのバスケットボール部の先生が言いました。</p>
<p>「あきらめたら、そこで試合終了ですよ。」この言葉を聞いて、私は「確かにそうだ！」と思いました。(20)、私はうまくできないと、すぐにあきらめていました。でも、この言葉で、「できなかったのは、できないとあきらめたからじゃないのか。」と気づきました。それで、「あきらめなければ、できることもあるかもしれない」と(21)。</p>
<p>今、私はすぐにあきらめません。あきらめないで続けていると、(22)が生まれたり、できなかったことができたりします。</p>
<p>「あきらめたら、そこで試合終了ですよ。」この言葉は、私にあきらめないでがんばる力をくれます。(23)。</p>`

const explanations = [
  `Đáp án 1 theo bảng giải tham khảo — 「22点の差で負けるでしょう」: 「でしょう」đưa ra phỏng đoán về kết quả trận đấu: đội bóng có lẽ sẽ thua khi còn 11 phút và đang kém 22 điểm. Câu sau nói các cầu thủ bắt đầu nghĩ rằng họ có thể không thắng được nữa, phù hợp với sắc thái dự đoán.
1. 「負けるでしょう」: “có lẽ sẽ thua”; diễn tả một dự đoán chưa chắc chắn về kết quả.
2. 「負けてしまいます」: “sẽ thua mất”; có thể nói về kết quả tương lai nhưng khẳng định mạnh hơn, trong khi câu kế tiếp thể hiện sự chưa chắc chắn 「勝てないかもしれない」.
3. 「負けました」: “đã thua”; nói trận đấu đã kết thúc, không hợp với thời điểm còn 11 phút.
4. 「負けていました」: “đang bị thua/bị dẫn điểm”; đây là phương án nhiễu sát nghĩa nhất. Nó có thể mô tả trạng thái tỷ số tại thời điểm đó, nên không thể xem là sai ngữ pháp tuyệt đối. Bảng giải tham khảo chọn phương án 1 vì hiểu chỗ trống là dự đoán kết quả; câu hỏi này có độ mơ hồ về việc đang mô tả tỷ số hay dự đoán kết quả.
Dịch câu chứa chỗ trống: “Khi trận đấu còn 11 phút, đội bóng rổ đó có lẽ sẽ thua với cách biệt 22 điểm. Các cầu thủ bắt đầu nghĩ rằng có lẽ mình không thể thắng nữa.”
Ghi nhớ: 「でしょう」diễn tả suy đoán; 「Vている」có thể diễn tả trạng thái đang diễn ra, vì vậy cần đọc mạch văn để phân biệt dự đoán kết quả với tỷ số hiện tại.`,
  `Đáp án 3 — 「そのころ」: sau khi hồi tưởng về lời thầy giáo, người viết nói rằng “vào khoảng thời gian ấy” mình thường bỏ cuộc ngay khi làm chưa tốt. Từ chỉ thời gian này nối với giai đoạn học sinh vừa được kể.
1. 「それから」: “sau đó”; chỉ trình tự sự việc, không khớp bằng cách hồi chỉ khoảng thời gian.
2. 「そのほか」: “ngoài ra”; dùng để bổ sung mục hoặc thông tin khác, không chỉ thời điểm.
3. 「そのころ」: “vào khoảng thời gian đó”; chỉ giai đoạn trong quá khứ khi người viết còn hay từ bỏ.
4. 「それでも」: “dù vậy”; cần quan hệ nhượng bộ/tương phản, không hợp với câu kể thói quen trước đây.
Dịch câu chứa chỗ trống: “Vào khoảng thời gian ấy, mỗi khi làm không tốt, tôi thường nhanh chóng bỏ cuộc.”
Ghi nhớ: 「そのころ」= vào khoảng thời gian đã được nhắc đến.`,
  `Đáp án 2 — 「あきらめなければ、できることもあるかもしれない」と考えることができたのです: nhờ câu nói của thầy, người viết đã có thể nghĩ rằng nếu không bỏ cuộc thì có lẽ sẽ làm được một số việc. 「ことができた」diễn tả khả năng đã có trong quá khứ.
1. 「考えてくれたのです」: “ai đó đã suy nghĩ giúp tôi”; 「くれる」hàm ý người khác làm việc đó vì người nói, nhưng chủ thể ở đây là chính người viết tự suy nghĩ.
2. 「考えることができたのです」: “tôi đã có thể nghĩ/nhận ra”; đúng với sự thay đổi trong nhận thức sau khi nghe lời thầy.
3. 「考えてくれたらいいです」: “sẽ tốt nếu ai đó nghĩ giúp tôi”; là mong muốn có điều kiện, không kể một nhận thức đã xảy ra.
4. 「考えることができたらいいです」: “sẽ tốt nếu tôi có thể nghĩ”; cũng là mong muốn/giả định, không diễn tả điều người viết đã nhận ra.
Dịch câu chứa chỗ trống: “Nhờ câu nói đó, tôi nhận ra rằng có lẽ những việc mình không làm được là vì tôi đã nghĩ rằng mình không thể làm. Vì thế, tôi đã có thể nghĩ: ‘Nếu không bỏ cuộc thì có lẽ cũng sẽ có những việc mình làm được.’”
Ghi nhớ: 「Vることができる」= có thể làm V; 「Vたことができた」ở đây dùng dạng quá khứ để nói về khả năng suy nghĩ đã xuất hiện sau sự việc.`,
  `Đáp án 1 — 「チャンスが生まれたり、できなかったことができたりします」: người viết liệt kê hai điều có thể xảy ra khi kiên trì: cơ hội xuất hiện và việc trước đây chưa làm được trở nên làm được. 「チャンス」nói chung, chưa xác định cơ hội cụ thể nào.
1. 「チャンス」: “cơ hội”; danh từ chung, hợp với 「が生まれる」(cơ hội xuất hiện).
2. 「あのチャンス」: “cơ hội kia”; chỉ một cơ hội đã biết/đã nhắc, trong khi câu đang nói khái quát.
3. 「どちらかのチャンス」: “một trong hai cơ hội”; không có hai cơ hội cụ thể nào để lựa chọn.
4. 「このチャンス」: “cơ hội này”; chỉ một cơ hội cụ thể trước mắt, không hợp với nhận xét khái quát về việc kiên trì.
Dịch câu chứa chỗ trống: “Bây giờ tôi không dễ dàng bỏ cuộc nữa. Nếu cứ tiếp tục mà không từ bỏ, cơ hội có thể xuất hiện và những việc trước đây mình chưa làm được cũng có thể làm được.”
Ghi nhớ: Danh từ không có từ chỉ định như 「この／あの」thường được dùng khi nói khái quát hoặc giới thiệu điều chưa xác định.`,
  `Đáp án 2 — 「私が大好きな言葉です」: cụm này hoàn tất ý cuối bằng cách xác nhận câu nói vừa nhắc đến là câu mà người viết rất yêu thích. Phần chủ đề 「この言葉は」được lược đi vì đã xuất hiện ở câu trước.
1. 「大好きな言葉があります」: “có một câu nói tôi rất thích”; tự nhiên khi giới thiệu lần đầu rằng mình có một câu nói yêu thích, nhưng ở đây câu nói cụ thể vừa được nhắc đến và đã trở thành chủ đề.
2. 「私が大好きな言葉です」: “đó là câu nói tôi rất yêu thích”; nối trực tiếp với 「この言葉は」đã nêu ở trước.
3. 「大好きだという点です」: “điểm là tôi rất thích”; 「点」(điểm/khía cạnh) không tạo được vị ngữ phù hợp để nhận xét câu nói vừa trích.
4. 「嫌いだという点です」: “điểm là tôi ghét”; vừa không hoàn tất tự nhiên ý về câu nói, vừa trái với việc câu nói ấy tiếp thêm sức mạnh cho người viết.
Dịch câu chứa chỗ trống: “Câu nói này tiếp thêm cho tôi sức mạnh để cố gắng mà không bỏ cuộc. Đó là câu nói tôi rất yêu thích.”
Ghi nhớ: Khi muốn giải thích danh từ đứng trước là loại nào/thuộc về ai, dùng 「Nは…です」; 「私が大好きな言葉」là “câu nói mà tôi rất thích”.`,
]

const readJson = (path) => JSON.parse(fs.readFileSync(path, 'utf8'))
const writeJson = (path, value) => fs.writeFileSync(path, `${JSON.stringify(value, null, 2)}\n`, 'utf8')
const plainOptionText = (option) =>
  String(typeof option === 'string' ? option : option?.text)
    .replace(/^\s*\d+[.．、)）]?\s*/u, '')
    .trim()
const findPart = (exam, predicate, label) => {
  const part = exam?.parts?.find(predicate)
  if (!part) throw new Error(`Missing ${label}.`)
  return part
}
const getQuestions = (part) =>
  part.questions
    .filter((question) => questionNumbers.includes(Number(question.number)))
    .sort((a, b) => Number(a.number) - Number(b.number))

const fullExams = readJson(fullExamPath)
const sectionExams = readJson(sectionExamPath)
const curated = readJson(curatedPath)
const exam = fullExams.find((item) => item.id === examId)
const standaloneExam = sectionExams.find((item) => item.id === standaloneExamId)
const part = findPart(exam, (item) => item.id === 'toan_part_2015_07_m2_g3', '2015/07 full-exam Grammar Mondai 3')
const standalonePart = findPart(
  standaloneExam,
  (item) => item.questions?.some((question) => Number(question.number) === 54),
  '2015/07 standalone Grammar Mondai 3'
)
const questions = getQuestions(part)
const standaloneQuestions = getQuestions(standalonePart)

if (questions.length !== 5 || standaloneQuestions.length !== 5 || explanations.length !== 5) {
  throw new Error('Expected five questions in both 2015/07 Grammar Mondai 3 views.')
}

const previousQuestion58Options = [
  plainOptionText(questions[4].options[3]),
  plainOptionText(standaloneQuestions[4].options[3]),
]
if (!['大好きそうな点です', sourceOptions[4][3]].includes(previousQuestion58Options[0])) {
  throw new Error(`Unexpected full-exam question 23 option 4: ${previousQuestion58Options[0]}`)
}
if (!['大好きだという点です', sourceOptions[4][3]].includes(previousQuestion58Options[1])) {
  throw new Error(`Unexpected standalone question 23 option 4: ${previousQuestion58Options[1]}`)
}
questions[4].options[3] = '4.嫌いだという点です'
standaloneQuestions[4].options[3].text = sourceOptions[4][3]

const reviewRows = []
for (let index = 0; index < questions.length; index += 1) {
  const question = questions[index]
  const standaloneQuestion = standaloneQuestions[index]
  const expectedNumber = questionNumbers[index]
  const expectedAnswer = expectedAnswers[index]
  const answer = Number(question.correctAnswer ?? question.answer)
  const standaloneAnswer = Number(standaloneQuestion.correctAnswer ?? standaloneQuestion.answer)

  if (Number(question.number) !== expectedNumber || Number(standaloneQuestion.number) !== expectedNumber) {
    throw new Error(`Unexpected internal question number at index ${index}.`)
  }
  if (answer !== expectedAnswer || standaloneAnswer !== expectedAnswer) {
    throw new Error(`Question ${expectedNumber}: stored answer does not match the answer reference.`)
  }

  const actualOptions = question.options.map(plainOptionText)
  const standaloneOptions = standaloneQuestion.options.map(plainOptionText)
  if (actualOptions.some((option, optionIndex) => option !== sourceOptions[index][optionIndex])) {
    throw new Error(`Full exam question ${expectedNumber} options do not match the verified source.`)
  }
  if (standaloneOptions.some((option, optionIndex) => option !== sourceOptions[index][optionIndex])) {
    throw new Error(`Standalone question ${expectedNumber} options do not match the verified source.`)
  }

  question.explanation = explanations[index]
  standaloneQuestion.explanation = explanations[index]
  curated[question.id] = explanations[index]
  curated[standaloneQuestion.id] = explanations[index]

  reviewRows.push({
    printedQuestion: expectedNumber - 35,
    internalQuestion: expectedNumber,
    questionIds: [question.id, standaloneQuestion.id],
    options: actualOptions,
    answer,
    explanationCoverage: {
      answerIdentified: explanations[index].startsWith(`Đáp án ${answer}`),
      allFourOptionsAddressed: [1, 2, 3, 4].every((choice) =>
        new RegExp(`(?:^|\\n)${choice}\\.`, 'u').test(explanations[index])
      ),
      contextualTranslation: /Dịch câu chứa chỗ trống:/u.test(explanations[index]),
      grammarNote: /Ghi nhớ:/u.test(explanations[index]),
      sourceKeyAmbiguityFlagged: index !== 0 || /độ mơ hồ/u.test(explanations[index]),
    },
    explanation: explanations[index],
  })
}

part.passage = sourcePassage
standalonePart.passage = sourcePassage

const review = {
  generatedAt: new Date().toISOString(),
  examId,
  standaloneExamId,
  scope: 'Grammar Mondai 3, printed questions 19–23 (internal questions 54–58).',
  sourcePassageAndOptions: {
    name: 'TryNihongo, JLPT N3 grammar and reading, July 2015',
    url: 'https://trynihongo.com/ko/de-thi-jlpt-ngu-phap-doc-hieu-n3-thang-7-2015-q654',
    reviewedLines: '464–590',
    status:
      'Passage and all four option texts checked; the complete passage is normalized and synchronized to the standalone exam.',
  },
  answerReference: {
    name: 'TiengNhatDongGian, 2015 July N3 answer and explanation PDF',
    url: 'https://www.tiengnhatdongian.com/wp-content/uploads/2023/04/Dap-anScript-N3-7-2015.pdf',
    answers: expectedAnswers,
    status:
      'Nonofficial answer key with written explanations; the supplied question data was also checked against the TryNihongo question copy.',
  },
  optionCorrections: [
    {
      internalQuestion: 58,
      printedQuestion: 23,
      previousFullExamText: previousQuestion58Options[0],
      previousStandaloneText: previousQuestion58Options[1],
      correctedText: sourceOptions[4][3],
      reason:
        'The standalone copy duplicated choice 3 and the full-exam copy had a different distractor; the checked source gives 嫌いだという点です.',
    },
  ],
  ambiguityReview: {
    internalQuestion: 54,
    printedQuestion: 19,
    storedAnswer: 1,
    answerKeyIsOfficial: false,
    ambiguity:
      'Choice 4, 負けていました, can naturally describe the team being behind by 22 points at that moment. The nonofficial key selects choice 1 by reading the blank as a prediction of the eventual result. The explanation explicitly discloses this ambiguity.',
  },
  officialKeyEstablished: false,
  explanationsAppliedTo: ['canonical full exam', 'standalone grammar/reading exam', 'curated explanation map'],
  questions: reviewRows,
}

writeJson(fullExamPath, fullExams)
writeJson(sectionExamPath, sectionExams)
writeJson(curatedPath, curated)
writeJson(reviewPath, review)
console.log('Reviewed and synchronized all five July 2015 Grammar Mondai 3 questions.')
