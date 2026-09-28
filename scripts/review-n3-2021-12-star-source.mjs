import fs from 'node:fs'
import prettier from 'prettier'

const masterPath = 'data/jlpt_n3_toan_master.json'
const standalonePath = 'data/jlpt_full_master.json'
const curatedPath = 'data/jlpt_n3_explanations_curated.json'
const reportPath = 'reports/n3-quality-audit/star-review-2021-12.json'
const fullMockId = 'toan-n3-202112-full'
const standaloneId = 'cm2u2xosv0138134ib0bvpy32-grammar-reading'
const questionPdfUrl = 'https://drive.google.com/file/d/1J-ZCgDqadzo6_E7zYqYBY0mu4YEtqgpo/view'
const answerPdfUrl = 'https://drive.google.com/file/d/1Lmr3LwhnS3lEv4FYemiM0f93Qg5DLNZL/view'
const answerSheet = [3, 1, 3, 4, 3]

const reviews = [
  {
    number: 49,
    printedNumber: 14,
    answer: 3,
    position: 2,
    order: [1, 4, 3, 2],
    complete: 'この小学生は大人でも解けないような問題を簡単に解いてしまう。',
    explanation:
      'Đáp án ô ★ là 3 「解けない」. Câu hoàn chỉnh: 「この小学生は大人でも解けないような問題を簡単に解いてしまう。」\nDịch: “Học sinh tiểu học này dễ dàng giải được cả những bài mà ngay cả người lớn cũng không giải nổi.”\nThứ tự ghép là 1 → 4 → 3 → 2; dấu ★ nằm ở mảnh thứ ba nên điền 「解けない」.\n1. 「大人」: “người lớn”, mở cụm so sánh.\n2. 「ような」: đứng sau mệnh đề 「大人でも解けない」 để bổ nghĩa cho 「問題」.\n3. 「解けない」: “không giải được”, nằm trong mệnh đề bổ nghĩa cho 「問題」 và đúng vị trí ★.\n4. 「でも」: đi sau 「大人」 với nghĩa “ngay cả”.\nGhi nhớ: 「Nでも～ない」 nhấn mạnh “ngay cả N cũng không…”, còn 「～ようなN」 nối mệnh đề bổ nghĩa với danh từ.',
  },
  {
    number: 50,
    printedNumber: 15,
    answer: 1,
    position: 2,
    order: [3, 4, 1, 2],
    complete:
      '去年、初めて一人で海外を旅行した。行く前は心配なこともあったが、旅行していた２週間は楽しいことばかりだった。',
    explanation:
      'Đáp án ô ★ là 1 「楽しいこと」. Câu hoàn chỉnh: 「去年、初めて一人で海外を旅行した。行く前は心配なこともあったが、旅行していた２週間は楽しいことばかりだった。」\nDịch: “Năm ngoái, lần đầu tôi đi du lịch nước ngoài một mình. Trước chuyến đi tôi cũng lo vài điều, nhưng hai tuần đi du lịch chỉ toàn những trải nghiệm thú vị.”\nThứ tự ghép là 3 → 4 → 1 → 2; dấu ★ nằm ở mảnh thứ ba nên điền 「楽しいこと」.\n1. 「楽しいこと」: “điều vui/thú vị”, là danh từ được 「ばかり」 bổ nghĩa về ý “chỉ toàn”.\n2. 「ばかり」: theo sau danh từ để nói “chỉ toàn…”, rồi nối với 「だった」.\n3. 「旅行していた」: bổ nghĩa cho khoảng thời gian 「２週間」, nên đứng đầu cụm.\n4. 「２週間は」: nêu “hai tuần” làm chủ đề của nhận xét.\nGhi nhớ: 「Vていた期間」 có thể bổ nghĩa cho khoảng thời gian; 「Nばかり」 diễn tả “chỉ toàn N”.',
  },
  {
    number: 51,
    printedNumber: 16,
    answer: 3,
    position: 2,
    order: [4, 1, 3, 2],
    complete:
      'A「昨日は日曜日だったから、遊園地は人が多かったでしょう?」B「いや、思っていたほど込んでいませんでしたよ。」',
    explanation:
      'Đáp án ô ★ là 3 「ほど」. Câu hoàn chỉnh: 「いや、思っていたほど込んでいませんでしたよ。」\nDịch hội thoại: “A: Hôm qua là Chủ nhật nên công viên giải trí chắc đông nhỉ? B: Không, không đông như tôi nghĩ.”\nThứ tự ghép là 4 → 1 → 3 → 2; dấu ★ nằm ở mảnh thứ ba nên điền 「ほど」.\n1. 「いた」: hoàn tất cụm quá khứ 「思っていた」, “đã nghĩ”.\n2. 「込んで」: mở cụm 「込んでいませんでした」, “đã không đông”.\n3. 「ほど」: theo sau 「思っていた」 và đứng trước mức độ được phủ định, tạo mẫu 「思っていたほど～ない」 = “không … như đã nghĩ”.\n4. 「思って」: bắt đầu cụm 「思っていた」.\nGhi nhớ: 「思ったほど～ない」 diễn tả kết quả không đạt đến mức mình đã dự đoán.',
  },
  {
    number: 52,
    printedNumber: 17,
    answer: 4,
    position: 2,
    order: [2, 3, 4, 1],
    complete:
      '一人暮らしを始めて、両親が毎日仕事をしながら食事の準備や洗濯をしてくれていたことがどれだけ大変なことだったか、よくわかった。',
    explanation:
      'Đáp án ô ★ là 4 「してくれていたことが」. Câu hoàn chỉnh: 「一人暮らしを始めて、両親が毎日仕事をしながら食事の準備や洗濯をしてくれていたことがどれだけ大変なことだったか、よくわかった。」\nDịch: “Sau khi sống một mình, tôi mới hiểu việc bố mẹ vừa đi làm mỗi ngày vừa chuẩn bị bữa ăn và giặt giũ cho tôi đã vất vả đến mức nào.”\nThứ tự ghép là 2 → 3 → 4 → 1; dấu ★ nằm ở mảnh thứ ba nên điền 「してくれていたことが」.\n1. 「どれだけ」: “đến mức nào”, đứng trước 「大変」 trong câu hỏi gián tiếp.\n2. 「しながら」: nối hai việc diễn ra đồng thời, “vừa làm việc vừa…”.\n3. 「食事の準備や洗濯を」: nêu các việc bố mẹ làm, được nối với động từ ở mảnh 4.\n4. 「してくれていたことが」: gói các hành động thành việc bố mẹ đã làm cho người nói, rồi làm chủ ngữ cho 「どれだけ大変だったか」.\nGhi nhớ: 「Vながら」 diễn tả hai hành động cùng chủ thể xảy ra đồng thời; 「～てくれる」 biểu thị hành động có lợi cho người nói.',
  },
  {
    number: 53,
    printedNumber: 18,
    answer: 3,
    position: 2,
    order: [4, 1, 3, 2],
    complete: '患者「先生、おふろには入ってもいいんでしょうか。」医者「あしたになって熱が下がっていたらいいですよ。」',
    explanation:
      'Đáp án ô ★ là 3 「熱が下がって」. Câu hoàn chỉnh: 「患者「先生、おふろには入ってもいいんでしょうか。」医者「あしたになって熱が下がっていたらいいですよ。」」\nDịch: “Bệnh nhân: Thưa bác sĩ, tôi tắm được không ạ? Bác sĩ: Nếu đến ngày mai mà cơn sốt đã hạ thì được.”\nThứ tự ghép là 4 → 1 → 3 → 2; dấu ★ nằm ở mảnh thứ ba nên điền 「熱が下がって」.\n1. 「なって」: theo sau 「あしたに」 để tạo 「あしたになって」, “đến ngày mai”.\n2. 「いたら」: hoàn tất điều kiện 「下がっていたら」, “nếu đã hạ”.\n3. 「熱が下がって」: “cơn sốt hạ”, đứng sau mốc ngày mai và trước 「いたら」.\n4. 「あしたに」: nêu mốc thời gian cho 「なって」.\nGhi nhớ: 「Vていたら」 đặt điều kiện về một trạng thái đã xảy ra; 「～たらいい」 nêu điều kiện để được phép hoặc để kết quả là tốt.',
  },
]

const readJson = (file) => JSON.parse(fs.readFileSync(file, 'utf8'))
const exams = readJson(masterPath)
const standaloneExams = readJson(standalonePath)
const curated = readJson(curatedPath)
const fullMock = exams.find((exam) => exam.id === fullMockId)
const standalone = standaloneExams.find((exam) => exam.id === standaloneId)
if (!fullMock || !standalone) throw new Error('Could not find both December 2021 exam views.')
const fullQuestions = fullMock.parts.flatMap((part) => part.questions || [])
const standaloneQuestions = standalone.parts.flatMap((part) => part.questions || [])
const question53 = standaloneQuestions.find((entry) => entry.id === 'cm2u2xqd7014w134i0zdsov4l')
const sourceQuestion53 = '患者「先生、おふろには入ってもいいんでしょうか。」<br>医者「 ___ ___ _★_ ___ いいでよ」'
const ocrQuestion53 = '患者「先生、おふろには人ってもいいんでしようか。」<br>医者「 ___ ___ _★_ ___ いいでよ」'
if (!question53 || ![ocrQuestion53, sourceQuestion53].includes(question53.question)) {
  throw new Error('Question 18 transcription changed unexpectedly; inspect the source PDF before editing it.')
}
question53.question = sourceQuestion53
question53.sentence = sourceQuestion53
reviews.find((row) => row.number === 53).explanation +=
  '\nGhi chú đối chiếu: prompt đã sửa lỗi OCR 「人って」「んでしよう」 thành chữ trên bản in 「入って」「んでしょう」. PDF gốc in 「いいでよ」 (có vẻ thiếu 「す」); lời giải dùng câu tự nhiên 「いいですよ」 và không sửa âm thầm nội dung nguồn.'

const optionText = (option) => {
  const raw =
    typeof option === 'string' ? option.replace(/^\s*[1-4](?:[.)．、]\s*|\s+)/u, '') : String(option?.text || '')
  return raw.replace(/\s+/gu, '')
}

for (const row of reviews) {
  const question = fullQuestions.find((entry) => Number(entry.number) === row.number)
  const sectionQuestion = standaloneQuestions.find((entry) => Number(entry.number) === row.number)
  if (!question || !sectionQuestion) throw new Error(`Could not find question ${row.number} in both exam views.`)
  if (Number(question.correctAnswer ?? question.answer) !== row.answer) {
    throw new Error(`Question ${row.number} stored answer changed; inspect it before applying this review.`)
  }
  if (
    question.starPosition !== row.position ||
    JSON.stringify(question.starCorrectOrder) !== JSON.stringify(row.order)
  ) {
    throw new Error(
      `Question ${row.number} stored star layout differs from the reviewed PDF; inspect it before applying.`
    )
  }
  if (Number(sectionQuestion.correctAnswer ?? sectionQuestion.answer) !== row.answer) {
    throw new Error(`Standalone question ${row.number} has a different answer.`)
  }
  if (JSON.stringify(question.options.map(optionText)) !== JSON.stringify(sectionQuestion.options.map(optionText))) {
    throw new Error(`Question ${row.number} options differ between exam views.`)
  }
  const assembled = row.order.map((choice) => optionText(question.options[choice - 1])).join('')
  if (!row.complete.normalize('NFKC').replace(/\s+/gu, '').includes(assembled)) {
    throw new Error(`Question ${row.number} reconstructed answer does not match the reviewed full sentence.`)
  }
  if (row.order[row.position] !== row.answer)
    throw new Error(`Question ${row.number} answer does not occupy its star slot.`)

  question.starOrderVerified = true
  question.starPositionVerified = true
  question.starVerificationStatus = 'verified-against-source'
  question.starVerificationSources = [questionPdfUrl, answerPdfUrl]
  question.starVerificationNote = `Visually checked printed question ${row.printedNumber} on PDF page 9 in Chrome. The four choices form order ${row.order.join(' → ')}; the ★ is at zero-based slot ${row.position}, occupied by choice ${row.answer}. The user-provided answer sheet on PDF page 23 also lists ${row.answer}. That answer sheet is a reference, not an official JLPT key.`
  question.explanation = row.explanation
  curated[question.id] = row.explanation
  sectionQuestion.explanation = row.explanation
}

const report = {
  generatedAt: new Date().toISOString(),
  examId: fullMockId,
  standaloneExamId: standaloneId,
  scope:
    'Source verification and Vietnamese explanations for all five Grammar Mondai 2 star-order questions (printed 14–18).',
  sourceReview: {
    method:
      'Viewed the original question PDF and answer sheet directly in Chrome. Compared the printed star slot and reconstructed sentence with the stored options and key.',
    questionPaper: '12. N3 12-2021.pdf',
    questionPaperUrl: questionPdfUrl,
    questionPaperPdfPage: 9,
    printedQuestionNumbers: [14, 15, 16, 17, 18],
    answerSheet: 'ĐÁP ÁN JLPT N3 (update 26.6.2026).pdf',
    answerSheetUrl: answerPdfUrl,
    answerSheetPdfPage: 23,
    userProvidedAnswers: answerSheet,
    officialAnswerKeyConfirmed: false,
    transcriptionReview: {
      printedQuestionNumber: 18,
      questionPdfPage: 9,
      correctedOcrText: ['人って', 'んでしよう'],
      sourceText: ['入って', 'んでしょう'],
      sourcePrintedPhrasePreserved: 'いいでよ',
      explanationNote:
        'The source PDF visibly prints 「いいでよ」; the explanation identifies 「いいですよ」 as the natural intended Japanese form.',
    },
  },
  rows: reviews.map((row) => ({
    printedQuestionNumber: row.printedNumber,
    masterQuestionNumber: row.number,
    answer: row.answer,
    starPositionZeroBased: row.position,
    order: row.order,
    fullSentence: row.complete,
    questionPdfPage: 9,
    answerSheetAnswer: answerSheet[row.number - 49],
    sourcesAgree: answerSheet[row.number - 49] === row.answer,
    explanationAdded: true,
  })),
  verdict:
    'The stored key, marked slot, assembled sentence, and user-provided answer-sheet key agree for all five questions. Question 18 prompt OCR was corrected against the scan; the source-printed 「いいでよ」 is preserved and flagged as a likely typo. The reference sheet is not an official JLPT answer notice.',
}

const formatJson = async (value, filepath) => prettier.format(`${JSON.stringify(value, null, 2)}\n`, { filepath })
fs.writeFileSync(masterPath, await formatJson(exams, masterPath))
fs.writeFileSync(standalonePath, await formatJson(standaloneExams, standalonePath))
fs.writeFileSync(curatedPath, await formatJson(curated, curatedPath))
fs.writeFileSync(reportPath, await formatJson(report, reportPath))
console.log(JSON.stringify({ reportPath, verifiedQuestions: reviews.map((row) => row.number) }, null, 2))
