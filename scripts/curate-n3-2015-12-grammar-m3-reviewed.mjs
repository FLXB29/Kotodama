import fs from 'node:fs'

const fullExamPath = 'data/jlpt_n3_toan_master.json'
const sectionExamPath = 'data/jlpt_full_master.json'
const curatedPath = 'data/jlpt_n3_explanations_curated.json'
const reviewPath = 'reports/n3-quality-audit/grammar-m3-2015-12-review.json'

const examId = 'toan-n3-201512-full'
const standaloneExamId = 'cm2u2wco4002g134io8nm04te-grammar-reading'
const expectedAnswers = [1, 4, 1, 2, 3]
const questionNumbers = [54, 55, 56, 57, 58]
const sourceOptions = [
  [
    '出してしまったのです',
    '出してしまったからです',
    '出してしまったかもしれません',
    '出してしまったからかもしれません',
  ],
  ['また', 'たとえば', 'それに', 'ところが'],
  ['も', 'と', 'だけ', 'より'],
  ['分けられることになります', '分けるようにしています', '分けようと思っていました', '分けられるだろうと思います'],
  ['気がするそうです', '気がしたのでしょうか', '気がします', '気がしたようです'],
]

const sourcePassage = `以下の文章は、留学生が書いた作文である。
<p><strong>ごみの捨て方</strong><br>リークリスティーナ</p>
<p>日本ではごみは、「燃えるごみ」「燃えないごみ」「リサイクルできる物」などに分けて出さなければいけません。でも、日本で初めてごみを出すとき、私はそのルールのことがまだあまりよくわかっていませんでした。それで、ごみを分けずに(19)。</p>
<p>朝、出かけるとき、アパートの前の決められた場所にごみを出しました。(20)、夕方帰宅すると、私のごみは回収されずに残っていました。</p>
<p>その日の夜、大家さんが来て、紙などの「燃えるごみ」、ガラスなどの「燃えないごみ」、ペットボトルなどの「リサイクルできる物」を分けなければいけない理由を説明してくれました。ごみの中には、もう一度資源として使える物(21)たくさんあります。それをきちんと分ければ、大切な地球の資源が守れるということがわかりました。</p>
<p>それ以降は、きちんとごみを(22)。最近は物を買うときに、これは燃えるか、リサイクルできるか、と考えたりもします。ごみを分けるのは少し大変です。でも、今まで深く考えたことのなかった環境問題が少し身近になったような(23)。</p>`

const explanations = [
  `Đáp án 1 — 「ごみを分けずに出してしまったのです」: người viết kể việc mình đã bỏ rác khi chưa phân loại. 「～てしまう」ở đây nhấn mạnh hành động đã lỡ hoàn tất và có sắc thái nhận ra mình làm sai; 「のです」dùng để giải thích điều vừa kể.
1. 「出してしまったのです」: “đã đem bỏ mất rồi”; câu giải thích một việc có thật xảy ra với người kể, hợp với câu tiếp theo kể rõ thời điểm và địa điểm.
2. 「出してしまったからです」: “là vì đã đem bỏ”; 「からです」thường đưa ra lý do cho một kết quả đã nêu, nhưng ở đây chưa có mệnh đề kết quả cần giải thích.
3. 「出してしまったかもしれません」: “có lẽ đã đem bỏ”; 「かもしれません」biểu thị phỏng đoán, không hợp khi người kể đang thuật lại việc chính mình đã làm.
4. 「出してしまったからかもしれません」: “có lẽ là do đã đem bỏ”; vừa nêu nguyên nhân vừa phỏng đoán, nhưng câu cần kể trực tiếp hành động đã xảy ra.
Dịch câu chứa chỗ trống: “Ở Nhật, rác phải được phân loại như rác cháy được, rác không cháy được và đồ có thể tái chế. Nhưng lần đầu bỏ rác ở Nhật, tôi vẫn chưa hiểu rõ quy định. Vì thế, tôi đã đem rác chưa phân loại đi bỏ.”
Ghi nhớ: 「Vてしまう」có thể nhấn mạnh hành động đã hoàn tất hoặc việc lỡ làm điều không mong muốn; 「～のです」giải thích, làm rõ sự việc.`,
  `Đáp án 4 — 「ところが」: người viết đã đặt rác đúng nơi quy định, nhưng khi về nhà thì rác vẫn chưa được thu gom. Đây là kết quả trái với dự đoán, nên dùng 「ところが」.
1. 「また」: “lại/cũng”; không thể hiện kết quả bất ngờ trái với điều vừa kể.
2. 「たとえば」: “ví dụ”; câu sau không nêu ví dụ mà kể kết quả thực tế của việc bỏ rác.
3. 「それに」: “hơn nữa”; dùng để bổ sung thông tin cùng chiều, không nối được ý tương phản ở đây.
4. 「ところが」: “thế nhưng”; báo hiệu điều xảy ra trái với mong đợi sau khi người viết đã mang rác ra điểm tập kết.
Dịch câu chứa chỗ trống: “Buổi sáng, lúc ra ngoài, tôi đã đem rác đến địa điểm quy định trước căn hộ. Thế nhưng khi về nhà vào buổi tối, tôi thấy rác của mình vẫn chưa được thu gom.”
Ghi nhớ: 「ところが」nối với một kết quả bất ngờ hoặc trái dự đoán.`,
  `Đáp án 1 — 「使える物もたくさんあります」: trong rác cũng có nhiều thứ có thể được dùng lại làm tài nguyên. 「も」thêm một thông tin vào nhóm đồ vật đang được nói đến.
1. 「も」: “cũng”; tự nhiên trong câu tồn tại 「使える物もたくさんあります」, nghĩa là “cũng có nhiều vật dùng được”.
2. 「と」: thường dùng để nối danh từ trong phép liệt kê hoặc đánh dấu nội dung trích dẫn; 「物とたくさんあります」không tạo được cấu trúc phù hợp.
3. 「だけ」: “chỉ”; cần diễn đạt giới hạn, nhưng ngữ cảnh đang bổ sung rằng trong rác có thêm các vật có thể tái sử dụng.
4. 「より」: “hơn/so với” hoặc “từ”; cần một đối tượng so sánh hay điểm xuất phát, không phù hợp trước 「たくさんあります」.
Dịch câu chứa chỗ trống: “Tối hôm đó, chủ nhà đến giải thích vì sao phải phân loại giấy là rác cháy được, thủy tinh là rác không cháy được và chai nhựa là đồ có thể tái chế. Trong rác cũng có nhiều thứ có thể dùng lại làm tài nguyên. Tôi hiểu rằng nếu phân loại chúng đúng cách thì có thể bảo vệ nguồn tài nguyên quý giá của Trái Đất.”
Ghi nhớ: 「Nもあります」= “cũng có N”; trợ từ 「も」thêm một điều vào những gì đã được nhắc đến.
Mẫu ngữ pháp được nhận diện từ dữ liệu N3 cục bộ; mục dưới đây khớp mặt chữ, không xác định đáp án:
Phương án 4 (không phải đáp án đang lưu) — 「～による／より／よって／よっては」: Do…; bởi… | Bằng…; nhờ… | Dựa vào… | Tùy… mà khác | Tùy trường hợp…；Cấu trúc: N +  による／より／よって／よっては`,
  `Đáp án 2 — 「それ以降は、きちんとごみを分けるようにしています」: sau khi hiểu lý do phân loại rác, người viết chủ động duy trì việc phân loại như một thói quen. 「Vるようにしている」diễn tả việc cố gắng duy trì một hành động.
1. 「分けられることになります」: “sẽ thành ra được phân loại/có thể phân loại”; 「ことになる」nêu một kết quả hoặc quyết định, không diễn tả thói quen do người viết chủ động duy trì.
2. 「分けるようにしています」: “tôi cố gắng phân loại/tạo thói quen phân loại”; khớp với 「それ以降は」và các hành động người viết vẫn làm gần đây.
3. 「分けようと思っていました」: “đã định phân loại”; nêu ý định trong quá khứ, không cho biết người viết thực sự duy trì việc đó từ thời điểm ấy.
4. 「分けられるだろうと思います」: “tôi nghĩ có lẽ có thể phân loại/được phân loại”; là phỏng đoán về khả năng hoặc trạng thái, không phải hành động thường xuyên của người kể.
Dịch câu chứa chỗ trống: “Từ đó trở đi, tôi luôn cố gắng phân loại rác cho đúng. Gần đây, khi mua đồ, tôi còn nghĩ xem món này có cháy được hay có thể tái chế không.”
Ghi nhớ: 「Vるようにしている」= cố gắng duy trì V, biến V thành thói quen. Không nhầm với 「Vようと思っている」= đang dự định làm V.`,
  `Đáp án 3 — 「身近になったような気がします」: người viết cảm thấy các vấn đề môi trường trước đây chưa từng nghĩ sâu đến nay đã trở nên gần gũi hơn. 「～ような気がします」diễn tả cảm nhận chủ quan, dè dặt.
1. 「気がするそうです」: ghép 「気がする」(có cảm giác) với 「そうです」(nghe nói/có vẻ), khiến câu thành lời thuật lại cảm nhận của người khác; không hợp với lời tự nhận xét của người kể.
2. 「気がしたのでしょうか」: “không biết có phải đã cảm thấy như vậy không”; là câu hỏi suy đoán về quá khứ, không khớp với câu trần thuật.
3. 「気がします」: “tôi có cảm giác”; nối tự nhiên với 「身近になったような」thành cách nói “tôi có cảm giác như đã trở nên gần gũi hơn”.
4. 「気がしたようです」: “có vẻ đã cảm thấy”; vừa ở quá khứ vừa mang sắc thái suy đoán/hồi thuật, không diễn tả trực tiếp cảm nhận hiện tại của người kể.
Dịch câu chứa chỗ trống: “Việc phân loại rác hơi vất vả. Nhưng tôi có cảm giác rằng những vấn đề môi trường mà trước đây tôi chưa từng suy nghĩ sâu sắc đã trở nên gần gũi hơn một chút.”
Ghi nhớ: 「～ような気がします」= “tôi có cảm giác như…”; đây là cách nêu nhận xét cá nhân một cách dè dặt.`,
]

const readJson = (path) => JSON.parse(fs.readFileSync(path, 'utf8'))
const writeJson = (path, value) => fs.writeFileSync(path, `${JSON.stringify(value, null, 2)}\n`, 'utf8')
const findPart = (exam, predicate, label) => {
  const part = exam?.parts?.find(predicate)
  if (!part) throw new Error(`Missing ${label}.`)
  return part
}
const getQuestions = (part) =>
  part.questions
    .filter((question) => questionNumbers.includes(Number(question.number)))
    .sort((a, b) => Number(a.number) - Number(b.number))
const plainOptionText = (option) =>
  String(typeof option === 'string' ? option : option?.text)
    .replace(/^\s*\d+[.．、)）]?\s*/u, '')
    .trim()

const fullExams = readJson(fullExamPath)
const sectionExams = readJson(sectionExamPath)
const curated = readJson(curatedPath)
const exam = fullExams.find((item) => item.id === examId)
const standaloneExam = sectionExams.find((item) => item.id === standaloneExamId)
const part = findPart(exam, (item) => item.id === 'toan_part_2015_12_m2_g3', '2015/12 full-exam Grammar Mondai 3')
const standalonePart = findPart(
  standaloneExam,
  (item) => item.title === 'Mondai 3',
  '2015/12 standalone Grammar Mondai 3'
)
const questions = getQuestions(part)
const standaloneQuestions = getQuestions(standalonePart)

if (questions.length !== 5 || standaloneQuestions.length !== 5 || explanations.length !== 5) {
  throw new Error('Expected five questions in both 2015/12 Grammar Mondai 3 views.')
}

const previousQuestion57Option = plainOptionText(questions[3].options[1])
if (!['分けようとしています', sourceOptions[3][1]].includes(previousQuestion57Option)) {
  throw new Error(`Unexpected question 22 option 2: ${previousQuestion57Option}`)
}
questions[3].options[1] = '2.分けるようにしています'

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
    throw new Error(`Question ${expectedNumber}: stored answer does not match the answer references.`)
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
  // Both exam views carry their own reviewed explanation. Do not mirror these
  // source-checked notes into the shared ID fallback map, which can leak them
  // into unrelated section views that reuse question IDs.
  delete curated[question.id]
  delete curated[standaloneQuestion.id]

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
    name: 'TryNihongo, JLPT N3 Grammar and Reading, December 2015',
    url: 'https://trynihongo.com/ko/de-thi-jlpt-ngu-phap-doc-hieu-n3-thang-12-2015-q655',
    reviewedLines: '464–590',
    status:
      'Passage and all five groups of four option texts checked; passage restored in full and normalized in both app exam views.',
  },
  corroboratingQuestionCopy: {
    name: 'Studocu, N3 12-2015 question paper',
    url: 'https://www.studocu.vn/vn/document/truong-dai-hoc-bach-khoa-dai-hoc-quoc-gia-thanh-pho-ho-chi-minh/giao-duc-chinh-tri/n3-12-2015-%E5%95%8F%E9%A1%8C%E9%9B%86%E3%81%A8%E8%A7%A3%E7%AD%94%E4%BE%8B/170463438',
    reviewedLines: '447–493',
    status: 'Question passage and answer-choice wording corroborated; not treated as an answer key.',
  },
  answerReferences: [
    {
      name: 'NJLPT Center, December 2015 N3 grammar answer key',
      url: 'https://njlptcenter.wordpress.com/2015/12/10/%E0%B9%80%E0%B8%89%E0%B8%A5%E0%B8%A2%E0%B8%82%E0%B9%89%E0%B8%AD%E0%B8%AA%E0%B8%AD%E0%B8%9A-n3-gram2015/',
      answers: expectedAnswers,
      status:
        'Nonofficial key; confirms the answer text sequence 出してしまったのです・ところが・も・分けるようにしています・気がします.',
    },
  ],
  optionCorrection: {
    internalQuestion: 57,
    printedQuestion: 22,
    incorrectPreviousText: '分けようとしています',
    correctedText: sourceOptions[3][1],
    reason:
      'The canonical full-exam dataset disagreed with the source and standalone exam at choice 2; the verified option is 分けるようにしています.',
  },
  officialKeyEstablished: false,
  explanationsAppliedTo: ['canonical full exam', 'standalone grammar/reading exam'],
  questions: reviewRows,
}

writeJson(fullExamPath, fullExams)
writeJson(sectionExamPath, sectionExams)
writeJson(curatedPath, curated)
writeJson(reviewPath, review)
console.log('Reviewed and synchronized all five December 2015 Grammar Mondai 3 questions.')
