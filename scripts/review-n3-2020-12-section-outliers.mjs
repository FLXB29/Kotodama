import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'

const root = path.resolve('.')
const fullMasterPath = path.join(root, 'data/jlpt_n3_toan_master.json')
const sectionMasterPath = path.join(root, 'data/jlpt_full_master.json')
const curatedPath = path.join(root, 'data/jlpt_n3_explanations_curated.json')
const reportPath = path.join(root, 'reports/n3-quality-audit/vocabulary-2020-12-source-outliers-review.json')
const fullExamId = 'toan-n3-202012-full'
const sectionExamId = 'cm2u2xg4300wm134izpbjrysi-vocab'

const explanations = {
  1: [
    'Đáp án 1 — 「調査（ちょうさ）」là điều tra/khảo sát để tìm hiểu một vấn đề. Cách đọc đúng là ちょうさ.',
    'Dịch: “Trước tiên, tôi sẽ điều tra vấn đề này.” 「まず」nghĩa là trước tiên; 「調査する」là điều tra, khảo sát.',
    '1. ちょうさ: cách đọc đúng của 調査.',
    '2. ちょうさつ: thêm âm つ ở cuối; đây không phải cách đọc của 調査.',
    '3. ちょさ: thiếu âm dài 「う」 trong ちょう; không phải cách đọc chuẩn của từ.',
    '4. ちょさつ: vừa thiếu âm dài 「う」 vừa thêm 「つ」; không phải cách đọc của 調査.',
    'Ghi nhớ: 調査（ちょうさ）する = điều tra/khảo sát; các phương án còn lại là cách đọc sai của cùng chữ, không phải những từ có nghĩa riêng trong câu này.',
  ].join('\n'),
  14: [
    'Đáp án 4 — 「複雑（ふくざつ）」nghĩa là phức tạp; 「複雑な気持ち」diễn tả cảm xúc lẫn lộn, khó gọi tên. Trong bộ lựa chọn của bản này, 複雑 đứng ở vị trí 4.',
    'Dịch: “Bây giờ tôi có tâm trạng phức tạp/lẫn lộn.”',
    '1. 復推: không phải cách viết của từ ふくざつ; 復 thường mang ý quay lại/lặp lại, còn 推 không được đọc là ざつ ở đây.',
    '2. 復雑: sai chữ đầu; 「復」không phải chữ 「複」 trong 複雑. Không tạo thành cách viết đúng của từ cần điền.',
    '3. 複推: chữ 「推」không phải 「雑」 và không thể ghi âm 「ざつ」 trong từ này.',
    '4. 複雑（ふくざつ）: phức tạp; đúng cả cách viết lẫn nghĩa trong cụm 複雑な気持ち.',
    'Ghi nhớ: 複雑な問題 = vấn đề phức tạp; 複雑な気持ち = cảm xúc lẫn lộn. Chữ 複 trong 複雑 khác 復 trong 復習（ふくしゅう, ôn tập).',
  ].join('\n'),
  19: [
    'Đáp án 3 — 「ぴったり」là vừa khít/vừa vặn hoặc khớp chính xác; đối chiếu đôi giày trước hơi rộng thì đôi này vừa vặn là hợp ngữ cảnh nhất.',
    'Dịch: “Đôi giày tôi vừa thử lúc nãy hơi rộng, nhưng đôi này vừa vặn.” Các bản chép đề được đối chiếu viết phần cuối là 「この靴は（ ）です」; dữ liệu cũ 「してもらった」đã được sửa vì không khớp câu trong các bản này.',
    '1. はっきり: rõ ràng/dứt khoát; thường nói về lời nói, hình ảnh hoặc ý định, không nói độ vừa của giày.',
    '2. しっかり: chắc chắn/vững vàng; không diễn tả việc kích cỡ đôi giày vừa khít.',
    '3. ぴったり: vừa vặn/vừa khít hoặc khớp chính xác; đúng với câu đang so kích cỡ hai đôi giày.',
    '4. そっくり: giống hệt nhau/toàn bộ; dùng khi hai người/vật rất giống nhau, không phải nói giày vừa chân.',
    'Ghi nhớ: サイズがぴったり = kích cỡ vừa khít; そっくりな顔 = khuôn mặt giống hệt.',
  ].join('\n'),
  31: [
    'Đáp án 2 — 「割引（わりびき）」là giảm giá/chiết khấu so với giá thông thường; 「料金が割引になる」là phí được giảm.',
    'Dịch câu đúng: “Nếu đăng ký tham quan bảo tàng theo đoàn thì phí tham quan được giảm.”',
    '1. 「村の人口が割引になっている」: “Dân số làng được giảm giá.” 割引 dùng cho giá cả; dân số giảm thì nói 「人口が減る／減少する」.',
    '2. 「料金が割引になる」: phí được giảm giá; dùng đúng với ưu đãi khi đăng ký theo đoàn.',
    '3. 「体重が割引になってきた」: “Cân nặng được giảm giá.” Cân nặng giảm là 「体重が減ってきた」.',
    '4. 「眠る時間が割引になっている」: “Thời gian ngủ được giảm giá.” Thời lượng ngủ ít đi là 「寝る時間が減っている」.',
    'Ghi nhớ: giá/phí được giảm = 割引になる; dân số, cân nặng hoặc thời lượng giảm = 減る／減少する.',
  ].join('\n'),
  32: [
    'Đáp án 3 — 「気づく（きづく）」là chợt nhận ra/phát hiện một sự việc mà trước đó mình chưa biết. Trong câu 3, người nói về đến nhà rồi nhận ra mình để quên đồ trên tàu.',
    'Dịch câu đúng: “Khi về đến nhà, tôi nhận ra mình đã để quên đồ trên tàu.”',
    '1. 「ふるさとの景色に気づいて懐かしくなる」: “Nhận ra phong cảnh quê nhà rồi thấy nhớ.” Có thể hiểu nếu bức tranh làm người nói chú ý đến một cảnh cụ thể, nhưng ý thường được diễn đạt tự nhiên hơn là 「ふるさとの景色を思い出して懐かしくなる」; phương án 3 dùng 気づく rõ ràng hơn với việc phát hiện ra một sự thật.',
    '2. 「声に気づいて眠れなかった」: “Nhận ra tiếng nói nên không ngủ được.” Việc tiếng ồn làm phiền thường nói 「声が気になって眠れなかった」; nhận ra có tiếng nói không tự nó giải thích vì sao không ngủ được.',
    '3. 「電車に忘れ物をしたことに気づいた」: nhận ra mình đã để quên đồ trên tàu; kết cấu 「〜ことに気づく」nêu chính xác điều vừa được nhận ra.',
    '4. 「大学生活に気づくと、とても楽しみだ」: 気づく không có nghĩa là mong chờ cuộc sống đại học; tự nhiên hơn là 「大学生活が始まると思うと楽しみだ」. Một số bản chép in 「楽しみた」, nhưng câu dùng 「楽しみだ」trong các bản đối chiếu khác.',
    'Ghi nhớ: sự việc vừa nhận ra = 気づく; nhớ lại khung cảnh = 思い出す; bị âm thanh làm bận tâm = 気になる; mong chờ = 楽しみにする／楽しみだ.',
  ].join('\n'),
}

const fullMaster = JSON.parse(fs.readFileSync(fullMasterPath, 'utf8'))
const sectionMaster = JSON.parse(fs.readFileSync(sectionMasterPath, 'utf8'))
const curated = JSON.parse(fs.readFileSync(curatedPath, 'utf8'))
const fullExam = fullMaster.find((entry) => entry.id === fullExamId)
const sectionExam = sectionMaster.find((entry) => entry.id === sectionExamId)
assert.ok(fullExam, `Missing N3 full exam ${fullExamId}`)
assert.ok(sectionExam, `Missing N3 section exam ${sectionExamId}`)
const fullQuestions = fullExam.parts.flatMap((part) => part.questions || [])
const sectionQuestions = sectionExam.parts.flatMap((part) => part.questions || [])
const questionByNumber = (questions, number) => questions.find((question) => Number(question.number) === number)

// Repair demonstrated source transcription/order errors in the full-mock copy.
const fullQ1 = questionByNumber(fullQuestions, 1)
assert.ok(fullQ1)
assert.equal(Number(fullQ1.answer), 1)
fullQ1.options[3] = '4.ちょさつ'
fullQ1.explanation = explanations[1]
curated[fullQ1.id] = explanations[1]

const fullQ14 = questionByNumber(fullQuestions, 14)
assert.ok(fullQ14)
fullQ14.options = ['1.復推', '2.復雑', '3.複推', '4.複雑']
fullQ14.answer = 4
fullQ14.correctAnswer = 4
fullQ14.explanation = explanations[14]
curated[fullQ14.id] = explanations[14]

const fullQ19 = questionByNumber(fullQuestions, 19)
assert.ok(fullQ19)
const fullQ19Explanation = fullQ19.explanation || curated[fullQ19.id]
assert.ok(fullQ19Explanation?.startsWith('Đáp án 3 —'))
for (const number of [31, 32]) {
  const question = questionByNumber(fullQuestions, number)
  assert.ok(question)
  question.explanation = explanations[number]
  curated[question.id] = explanations[number]
}

const sectionRepairs = [
  { number: 1, answer: 1, explanation: explanations[1] },
  { number: 14, answer: 4, explanation: explanations[14] },
  { number: 19, answer: 3, explanation: explanations[19] },
  { number: 31, answer: 2, explanation: explanations[31] },
  { number: 32, answer: 3, explanation: explanations[32] },
]

for (const row of sectionRepairs) {
  const sectionQuestion = questionByNumber(sectionQuestions, row.number)
  const fullQuestion = questionByNumber(fullQuestions, row.number)
  assert.ok(sectionQuestion, `Missing section question ${row.number}`)
  assert.ok(fullQuestion, `Missing full-mock question ${row.number}`)
  assert.equal(Number(sectionQuestion.answer), row.answer, `Unexpected section answer at ${row.number}`)

  if (row.number === 19) {
    const corrected = 'さっき履いてみた靴は少し大きかったけど、この靴は（ ）です。'
    sectionQuestion.question = corrected
    sectionQuestion.sentence = corrected
  }
  if (row.number === 32) {
    const option = sectionQuestion.options[3]
    if (/楽しみた/u.test(option.text)) option.text = option.text.replace('楽しみた', '楽しみだ')
    else assert.match(option.text, /楽しみだ/u)
  }

  const explanation = row.explanation || fullQuestion.explanation || curated[fullQuestion.id]
  assert.ok(explanation?.startsWith(`\u0110\u00e1p \u00e1n ${row.answer} \u2014`), `Missing explanation for question ${row.number}`)
  curated[sectionQuestion.id] = explanation
  sectionQuestion.explanation = explanation
}

fs.writeFileSync(fullMasterPath, `${JSON.stringify(fullMaster, null, 2)}\n`)
fs.writeFileSync(sectionMasterPath, `${JSON.stringify(sectionMaster, null, 2)}\n`)
fs.writeFileSync(curatedPath, `${JSON.stringify(curated, null, 2)}\n`)
fs.mkdirSync(path.dirname(reportPath), { recursive: true })
fs.writeFileSync(
  reportPath,
  `${JSON.stringify(
    {
      reviewedOn: '2026-09-27',
      fullExamId,
      sectionExamId,
      questionNumbers: [1, 14, 19, 31, 32],
      answerKeys: { section: { 1: 1, 14: 4, 19: 3, 31: 2, 32: 3 }, fullMockQuestion14Before: 2, fullMockQuestion14After: 4 },
      answerKeysChanged: 1,
      contentRepairs: [
        { question: 1, change: 'Restored missing initial ち in option 4: ちょさつ.' },
        { question: 14, change: 'Restored source option order; 複雑 is option 4, so corrected the full-mock key 2→4.' },
        { question: 19, change: 'Replaced malformed ending してもらった with です, matching multiple December 2020 reproductions.' },
        { question: 32, change: 'Normalized option 4 ending 楽しみた to 楽しみだ; reproductions conflict, but independent copies and grammar support だ.' },
        { question: 31, change: 'Added translation and choice-by-choice usage contrasts for all four examples.' },
        { question: 32, change: 'Added translation, all-choice explanations, and marked the first distractor as less natural rather than impossible.' },
      ],
      sources: [
        {
          url: 'https://www.nihongoph.com/2022/10/jlpt-n3-122020.html',
          type: 'Third-party 12/2020 N3 vocabulary transcription; includes the canonical q1 reading options and q32 option 4 ending だ; not an official JLPT file.',
        },
        {
          url: 'https://www.scribd.com/document/879176896/2020%E5%B9%B412%E6%9C%88%E6%97%A5%E6%9C%AC%E8%AA%9E%E8%83%BD%E5%8A%9B%E8%A9%A6%E9%A8%93N3%E7%9C%9F%E9%A1%8C',
          type: 'Third-party copy of the December 2020 N3 exam; reproduces q14 choice order, q19 ending です, and q32 ending だ; not an official JLPT file.',
        },
        {
          url: 'https://www.scribd.com/document/894142200/N3-%C4%90e-2020-12',
          type: 'Another third-party copy reproducing q31–32 and the corrected q19 prompt; not an official JLPT file.',
        },
        {
          url: 'https://learnjapaneseaz.com/jlpt-n3-vocabulary-test-17.html',
          type: 'Third-party answer and usage compilation; lists q31=2 and q32=3; not an official JLPT key.',
        },
      ],
      uncertainty: 'Some third-party transcriptions print 楽しみた for question 32 option 4, while two other copies and the full-mock source print 楽しみだ. The app uses the grammatical だ reading and keeps the disagreement recorded here. Answer-key sources are secondary, not official JLPT keys.',
      rows: sectionRepairs.map(({ number, answer }) => {
        const question = questionByNumber(sectionQuestions, number)
        return {
          number,
          id: question.id,
          answer,
          prompt: question.question,
          options: question.options.map((option) => option.text),
          explanation: curated[question.id],
          includesTranslation: curated[question.id].includes('Dịch:'),
          explainsAllFourChoices: [1, 2, 3, 4].every((choice) => curated[question.id].includes(`\n${choice}. `)),
        }
      }),
    },
    null,
    2,
  )}\n`,
)

console.log('Reviewed N3 12/2020 vocabulary source outliers at questions 1, 14, 19, 31 and 32.')
