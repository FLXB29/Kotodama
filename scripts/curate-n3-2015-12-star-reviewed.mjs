import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'

const root = path.resolve('.')
const sourcePdfUrl = 'https://drive.google.com/file/d/1vWtX1zFJn129Jr2maGRTq5TcuKxu3PD4/view'
const studyKeyUrl =
  'https://njlptcenter.wordpress.com/2015/12/10/%E0%B9%80%E0%B8%89%E0%B8%A5%E0%B8%A2%E0%B8%82%E0%B9%89%E0%B8%AD%E0%B8%AA%E0%B8%AD%E0%B8%9A-n3-gram2015/'
const review = {
  reviewedAt: '2026-09-27',
  examId: 'toan-n3-201512-full',
  section: 'Grammar Mondai 2, sentence construction',
  sources: {
    questionPaper: {
      name: 'JLPT N3 December 2015 question paper in Google Drive',
      url: sourcePdfUrl,
      reviewedLocations: ['PDF pages 6–7, printed questions 14–18'],
      status:
        'The scan shows the four answer slots, printed ★ position, prompts, and answer fragments. The source exam establishes question text and star slot, not an official answer key.',
    },
    studyAnswerKey: {
      name: 'NJLPT Center study answer for N3 Grammar, December 2015',
      url: studyKeyUrl,
      reviewedLocation: '問題2, lines 63–76',
      status:
        'An independent study solution gives the fragment order for questions 14–18. It is not an official JLPT answer key.',
    },
  },
  questions: [
    {
      printedQuestion: 14,
      questionId: 'toan_q_2015_12_49',
      promptBefore: '実家にある冷蔵庫は 30 年も',
      promptAfter: '、 親は「まだ買い替えない」と言っている。',
      sourceOptions: ['いつ壊れてもおかしくない', '古いもので', 'のに', '使っている'],
      starOrder: [4, 2, 1, 3],
      starPositionZeroBased: 1,
      starChoice: 2,
      completedSentence:
        '実家にある冷蔵庫は30年も使っている古いもので、いつ壊れてもおかしくないのに、親は「まだ買い替えない」と言っている。',
      translation:
        'Tủ lạnh ở nhà bố mẹ đã được dùng tới 30 năm, là một món đồ cũ có thể hỏng bất cứ lúc nào vậy mà bố mẹ vẫn nói chưa thay mới.',
      answerNote:
        '★ ở vị trí thứ hai nhận 「古いもので」. 「30年も使っている古いもの」 mô tả chiếc tủ lạnh đã dùng suốt 30 năm; 「もので」 nối sang việc nó có thể hỏng bất cứ lúc nào, rồi 「のに」 nêu sự tương phản với việc bố mẹ chưa muốn thay.',
      choices: [
        '1. 「いつ壊れてもおかしくない」: “có thể hỏng bất cứ lúc nào”; đứng sau 「古いもので」 để mô tả tình trạng chiếc tủ lạnh.',
        '2. 「古いもので」: “là một món đồ cũ và…”; khớp sau cụm 「30年も使っている」 và là mảnh ★.',
        '3. 「のに」: “mặc dù/vậy mà”; kết thúc mệnh đề tương phản trước 「親はまだ買い替えない」.',
        '4. 「使っている」: “đang/đã sử dụng”; kết hợp tự nhiên với khoảng thời gian 「30年も」.',
      ],
    },
    {
      printedQuestion: 15,
      questionId: 'toan_q_2015_12_50',
      promptBefore: '',
      promptAfter: '遅れているそうだ。',
      sourceOptions: ['駅ビルの建設工事が', '予定だった', 'あと半年で', '終わる'],
      starOrder: [3, 4, 2, 1],
      starPositionZeroBased: 2,
      starChoice: 2,
      completedSentence: 'あと半年で終わる予定だった駅ビルの建設工事が遅れているそうだ。',
      translation:
        'Nghe nói công trình xây dựng tòa nhà ga, vốn được dự kiến hoàn thành sau nửa năm nữa, đang bị chậm tiến độ.',
      answerNote:
        '★ ở vị trí thứ ba nhận 「予定だった」. 「あと半年で終わる予定だった」 bổ nghĩa cho 「駅ビルの建設工事」; 「工事が遅れている」 là mệnh đề chính.',
      choices: [
        '1. 「駅ビルの建設工事が」: “công trình xây tòa nhà ga thì…”; làm chủ ngữ cho vị ngữ cuối 「遅れている」.',
        '2. 「予定だった」: “đã được dự kiến”; nối 「あと半年で終わる」 với danh từ 「駅ビルの建設工事」 và là mảnh ★.',
        '3. 「あと半年で」: “sau sáu tháng nữa/trong sáu tháng nữa”; bổ nghĩa thời gian cho 「終わる」.',
        '4. 「終わる」: “hoàn thành”; đứng trước 「予定だった」 trong cụm “dự kiến sẽ hoàn thành”.',
      ],
    },
    {
      printedQuestion: 16,
      questionId: 'toan_q_2015_12_51',
      promptBefore: 'プレゼントをするときは、贈る相手の',
      promptAfter: '時間も楽しい。',
      sourceOptions: ['選ぶ', 'ことを', 'どれにするか', '考えながら'],
      starOrder: [2, 4, 3, 1],
      starPositionZeroBased: 2,
      starChoice: 3,
      completedSentence: 'プレゼントをするときは、贈る相手のことを考えながらどれにするか選ぶ時間も楽しい。',
      translation:
        'Khi tặng quà, khoảng thời gian nghĩ đến người nhận, cân nhắc xem nên chọn món nào rồi chọn cũng thật vui.',
      answerNote:
        '★ ở vị trí thứ ba nhận 「どれにするか」, câu hỏi gián tiếp “chọn món nào”. Cụm này đứng trước 「選ぶ時間」 để nói khoảng thời gian chọn quà cũng vui.',
      choices: [
        '1. 「選ぶ」: “chọn”; bổ nghĩa cho 「時間」 trong cụm 「選ぶ時間」.',
        '2. 「ことを」: tạo cụm tân ngữ 「相手のことを」, “nghĩ đến/nghĩ về người nhận”.',
        '3. 「どれにするか」: “chọn món nào”; câu hỏi gián tiếp làm bổ ngữ cho 「選ぶ」 và là mảnh ★.',
        '4. 「考えながら」: “vừa suy nghĩ vừa…”; nối việc nghĩ đến người nhận với việc chọn món quà.',
      ],
    },
    {
      printedQuestion: 17,
      questionId: 'toan_q_2015_12_52',
      promptBefore: 'このパソコン教室にはさまざまなコースがあります。基礎コースは、パソコンの',
      promptAfter: 'ぴったりです。',
      sourceOptions: ['コースなので', '初めて習う方に', '慣れるための', '基本的な使い方に'],
      starOrder: [4, 3, 1, 2],
      starPositionZeroBased: 2,
      starChoice: 1,
      completedSentence:
        'このパソコン教室にはさまざまなコースがあります。基礎コースは、パソコンの基本的な使い方に慣れるためのコースなので、初めて習う方にぴったりです。',
      translation:
        'Lớp học máy tính này có nhiều khóa học. Khóa cơ bản là khóa giúp làm quen với cách sử dụng máy tính cơ bản, nên rất phù hợp với người mới học.',
      answerNote:
        '★ ở vị trí thứ ba nhận 「コースなので」. Cụm 「基本的な使い方に慣れるためのコース」 mô tả khóa học; 「なので」 nêu lý do khóa này phù hợp với người mới.',
      choices: [
        '1. 「コースなので」: “vì là khóa học…”; khép cụm danh từ mô tả khóa cơ bản, nêu lý do, và là mảnh ★.',
        '2. 「初めて習う方に」: “đối với người mới học”; kết hợp với kết luận 「ぴったりです」.',
        '3. 「慣れるための」: “để làm quen”; bổ nghĩa cho danh từ 「コース」.',
        '4. 「基本的な使い方に」: “với cách sử dụng cơ bản”; đi cùng 「慣れる」 trong mẫu 「Nに慣れる」.',
      ],
    },
    {
      printedQuestion: 18,
      questionId: 'toan_q_2015_12_53',
      promptBefore: 'エアコンから',
      promptAfter: 'かというと、冷たい空気は暖かい空気より重いからだ。',
      sourceOptions: ['冷たい空気が', '出た', 'どうして', '部屋の下の方に行くのは'],
      starOrder: [2, 1, 4, 3],
      starPositionZeroBased: 2,
      starChoice: 4,
      completedSentence:
        'エアコンから出た冷たい空気が部屋の下の方に行くのはどうしてかというと、冷たい空気は暖かい空気より重いからだ。',
      translation:
        'Vì sao luồng khí lạnh thổi ra từ máy điều hòa lại đi xuống phía dưới phòng? Là vì không khí lạnh nặng hơn không khí ấm.',
      answerNote:
        '★ ở vị trí thứ ba nhận 「部屋の下の方に行くのは」. 「エアコンから出た冷たい空気」 là chủ đề; cụm ★ nêu hiện tượng cần hỏi, rồi 「どうしてかというと」 mở lời giải thích nguyên nhân. Cách xếp cũ đặt 「冷たい空気が出た」 khiến 「部屋」 bị gắn thành nơi không khí thoát ra và không khớp lời giải nguồn; đã sửa về thứ tự được bản đáp án học tập đối chiếu.',
      choices: [
        '1. 「冷たい空気が」: “luồng khí lạnh thì…”; đặt sau 「出た」 để tạo cụm chủ đề 「出た冷たい空気が」.',
        '2. 「出た」: “thổi/đi ra”; đứng sau 「エアコンから」 và bổ nghĩa cho 「冷たい空気」.',
        '3. 「どうして」: “vì sao”; đứng trước 「かというと」 trong kết cấu dẫn vào lời giải thích.',
        '4. 「部屋の下の方に行くのは」: “việc đi xuống phía dưới phòng là…”; nêu hiện tượng cần giải thích và là mảnh ★.',
      ],
    },
  ],
}

const examsPath = path.join(root, 'data/jlpt_n3_toan_master.json')
const exams = JSON.parse(fs.readFileSync(examsPath, 'utf8'))
const exam = exams.find((item) => item.id === review.examId)
assert.ok(exam, `Missing exam ${review.examId}`)
const questions = new Map(exam.parts.flatMap((part) => part.questions).map((question) => [question.id, question]))
const sectionExamsPath = path.join(root, 'data/jlpt_full_master.json')
const sectionExams = JSON.parse(fs.readFileSync(sectionExamsPath, 'utf8'))
const sectionExam = sectionExams.find((item) => item.id === 'cm2u2wco4002g134io8nm04te-grammar-reading')
assert.ok(sectionExam, 'Missing December 2015 grammar-reading section exam')
const sectionQuestions = new Map(
  sectionExam.parts.flatMap((part) => part.questions || []).map((question) => [Number(question.number), question])
)

const normalizeOption = (value) =>
  String(value || '')
    .replace(/^\s*[1-4][.．、\s　]*/u, '')
    .replace(/[。．]+$/u, '')
    .replace(/\s+/gu, '')
const normalizeSentence = (value) => String(value || '').replace(/[\s、。,.，．]/gu, '')

for (const entry of review.questions) {
  const question = questions.get(entry.questionId)
  assert.ok(question, `Missing question ${entry.questionId}`)
  assert.equal(
    question.starPosition,
    entry.starPositionZeroBased,
    `${entry.questionId}: ★ position differs from scanned paper`
  )
  assert.equal(
    question.correctAnswer,
    entry.starChoice,
    `${entry.questionId}: answer differs from the starred source fragment`
  )
  assert.equal(
    question.answer,
    entry.starChoice,
    `${entry.questionId}: answer label differs from the starred source fragment`
  )
  assert.equal(question.starPrompt.before, entry.promptBefore, `${entry.questionId}: prompt prefix differs from scan`)
  if (entry.printedQuestion === 15) {
    assert.ok(
      ['が、遅れているそうだ。', entry.promptAfter].includes(question.starPrompt.after),
      `${entry.questionId}: unexpected prompt suffix before source correction`
    )
  } else {
    assert.equal(question.starPrompt.after, entry.promptAfter, `${entry.questionId}: prompt suffix differs from scan`)
  }
  question.starPrompt.after = entry.promptAfter
  assert.deepEqual(
    question.options.map(normalizeOption),
    entry.sourceOptions.map(normalizeOption),
    `${entry.questionId}: source options differ`
  )
  if (entry.printedQuestion === 18) question.options[1] = '2.出た'
  question.starCorrectOrder = entry.starOrder
  assert.equal(
    question.starCorrectOrder[question.starPosition],
    entry.starChoice,
    `${entry.questionId}: ★ fragment does not match source key`
  )
  const options = question.options.map(normalizeOption)
  const rebuilt = `${question.starPrompt.before}${entry.starOrder.map((choice) => options[choice - 1]).join('')}${question.starPrompt.after}`
  assert.equal(
    normalizeSentence(rebuilt),
    normalizeSentence(entry.completedSentence),
    `${entry.questionId}: reconstructed sentence differs`
  )

  question.starOrderVerified = true
  question.starPositionVerified = true
  question.starVerificationStatus = 'verified'
  question.starVerificationSources = [sourcePdfUrl, studyKeyUrl]
  question.starVerificationNote =
    'Prompt and ★ slot checked against the December 2015 source scan (PDF pp. 6–7); fragment order checked against the independent NJLPT Center study solution. The study solution is not an official JLPT answer key.'
  question.explanation = [
    `Câu hoàn chỉnh: 「${entry.completedSentence}」`,
    `Dịch: “${entry.translation}”`,
    `Thứ tự bốn mảnh là ${entry.starOrder.join(' → ')}; ô ★ ở vị trí ${entry.starPositionZeroBased + 1} nhận lựa chọn ${entry.starChoice}. ${entry.answerNote}`,
    ...entry.choices,
  ].join('\n')
}

const sectionQuestion15 = sectionQuestions.get(50)
const sectionQuestion18 = sectionQuestions.get(53)
assert.ok(sectionQuestion15, 'Missing December 2015 grammar section question 15')
assert.ok(sectionQuestion18, 'Missing December 2015 grammar section question 18')
assert.equal(sectionQuestion15.correctAnswer, '2')
assert.ok(['駅ビル', '駅ビルの建設工事が'].includes(sectionQuestion15.options[0]?.text))
sectionQuestion15.question = ' __ __ _★_ __ 遅れているそうだ。'
sectionQuestion15.sentence = sectionQuestion15.question
sectionQuestion15.options[0].text = review.questions[1].sourceOptions[0]
sectionQuestion15.script = '<u>あと半年で終わる予定だった駅ビルの建設工事が</u>遅れているそうだ。'

assert.equal(sectionQuestion18.correctAnswer, '4')
assert.ok(['出た。', '出た'].includes(sectionQuestion18.options[1]?.text))
sectionQuestion18.options[1].text = review.questions[4].sourceOptions[1]
sectionQuestion18.script = review.questions[4].completedSentence
sectionQuestion18.explanation = null

fs.writeFileSync(examsPath, `${JSON.stringify(exams, null, 2)}\n`, 'utf8')
fs.writeFileSync(sectionExamsPath, `${JSON.stringify(sectionExams, null, 2)}\n`, 'utf8')
const reportPath = path.join(root, 'reports/n3-quality-audit/star-source-2015-12-review.json')
fs.writeFileSync(reportPath, `${JSON.stringify(review, null, 2)}\n`, 'utf8')
console.log(
  `Reviewed ${review.questions.length} source-backed star questions; corrected the question 18 order and synchronized the two section-copy prompts.`
)
