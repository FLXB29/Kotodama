import assert from 'node:assert/strict'
import fs from 'node:fs'

const mockPath = 'data/jlpt_n3_toan_master.json'
const sectionPath = 'data/jlpt_full_master.json'
const curatedPath = 'data/jlpt_n3_explanations_curated.json'
const reportPath = 'reports/n3-quality-audit/vocabulary-2017-07-m5-q34-q35-review.json'
const mockExams = JSON.parse(fs.readFileSync(mockPath, 'utf8'))
const sectionExams = JSON.parse(fs.readFileSync(sectionPath, 'utf8'))
const curated = JSON.parse(fs.readFileSync(curatedPath, 'utf8'))
const mockExam = mockExams.find(({ id }) => id === 'toan-n3-201707-full')
const sectionExam = sectionExams.find(({ id }) => id === 'cm2u2wq1c00ck134imolbo8ac-vocab')
assert.ok(mockExam && sectionExam, 'Both July 2017 N3 records must exist.')

const findQuestion = (exam, number) =>
  exam.parts.flatMap((part) => part.questions || []).find((question) => Number(question.number) === number)
const mockQuestions = new Map([34, 35].map((number) => [number, findQuestion(mockExam, number)]))
const sectionQuestions = new Map([34, 35].map((number) => [number, findQuestion(sectionExam, number)]))
for (const number of [34, 35]) {
  assert.ok(mockQuestions.get(number) && sectionQuestions.get(number), 'Question ' + number + ' must exist in both records.')
}

function replaceMockOption(question, optionNumber, expectedText, nextText) {
  const index = question.options.findIndex((value) => new RegExp('^\\s*' + optionNumber + '[.．、]').test(value))
  assert.notEqual(index, -1, 'Mock question ' + question.number + ' option ' + optionNumber + ' must exist.')
  const old = question.options[index]
  if (old !== nextText) {
    const prefix = old.match(/^\s*\d+[.．、]\s*/u)?.[0] || ''
    assert.equal(old.slice(prefix.length), expectedText, 'Unexpected mock option ' + question.number + '-' + optionNumber + '.')
    question.options[index] = prefix + nextText
  }
}

function replaceSectionOption(question, optionId, expectedText, nextText) {
  const option = question.options.find(({ id }) => Number(id) === optionId)
  assert.ok(option, 'Standalone question ' + question.number + ' option ' + optionId + ' must exist.')
  if (option.text !== nextText) {
    assert.equal(option.text, expectedText, 'Unexpected standalone option ' + question.number + '-' + optionId + '.')
    option.text = nextText
  }
}

const explanations = {
  34: [
    'Đáp án 1 — 「どきどきする」 diễn tả tim đập nhanh vì hồi hộp, lo lắng hoặc phấn khích; cụm 「緊張で胸がどきどきした」 dùng đúng.',
    'Dịch cả câu: “Tuần trước, khi phát biểu trước đông người, tim tôi đập thình thịch vì hồi hộp.”',
    '1. 「先週、大勢の人の前でスピーチをしたとき、緊張で胸がどきどきした」 — Dịch: “Tuần trước, khi phát biểu trước nhiều người, tim tôi đập thình thịch vì căng thẳng.” 「胸がどきどきする」 diễn tả nhịp tim nhanh do hồi hộp, nên đây là cách dùng đúng.',
    '2. 「部屋がとても静かなので、時計のどきどきする音が聞こえる」 — Dịch: “Vì căn phòng rất yên tĩnh nên tôi nghe thấy tiếng đồng hồ đập thình thịch.” 「どきどき」 nói về nhịp tim/cảm giác hồi hộp, không phải tiếng đồng hồ tích tắc; tiếng đồng hồ thường được tả là 「チクタクする」.',
    '3. 「気温の低い所にずっといると、だんだん体がどきどきしてくる」 — Dịch: “Nếu ở lâu nơi nhiệt độ thấp, dần dần cơ thể bắt đầu đập thình thịch.” Ý nói lạnh cóng hoặc run thì dùng 「体が冷える」／「体が震える」; 「どきどき」 không diễn tả cảm giác lạnh.',
    '4. 「強い風で、店の看板がどきどきしているのが見える」 — Dịch: “Tôi thấy bảng hiệu cửa hàng đang đập thình thịch vì gió mạnh.” Vật bị gió làm lay động thì nói 「看板が揺れる」; 「どきどき」 không tả chuyển động rung lắc của đồ vật.',
    'Ghi nhớ: 「胸・心臓がどきどきする」 = tim đập nhanh vì hồi hộp; 「時計がチクタクする」 = đồng hồ tích tắc; 「震える」 = run; 「揺れる」 = lay/rung.'
  ].join(String.fromCharCode(10)),
  35: [
    'Đáp án 2 — 「枯れる（かれる）」 là khô héo/chết đi do cây thiếu nước hoặc mất sức sống; dùng tự nhiên với hoa trong vườn.',
    'Dịch cả câu: “Tôi quên tưới nước hơn một tuần nên hoa trong vườn đã héo mất.”',
    '1. 「火が強すぎて、肉が黒くかれてしまった」 — Dịch: “Lửa quá to nên thịt bị đen và héo mất.” Thịt bị cháy xém/đen là 「肉が焦げる」; 「枯れる」 dùng cho cây cối chứ không dùng cho thịt.',
    '2. 「一週間以上も水をやるのを忘れたので、庭の花がかれてしまった」 — Dịch: “Tôi quên tưới nước hơn một tuần nên hoa trong vườn đã héo mất.” Hoa thiếu nước bị héo khô: 「花が枯れる」, dùng đúng.',
    '3. 「この機械はとても古いから、いろいろな所がかれて動かない」 — Dịch: “Cái máy này cũ quá nên nhiều chỗ bị héo và không chạy được.” Máy móc hỏng thì nói 「壊れる」 hoặc 「故障する」; không dùng 「枯れる」 theo nghĩa cây héo.',
    '4. 「暖かくなってきたので、雪はすっかりかれたようだ」 — Dịch: “Trời ấm dần lên nên tuyết có vẻ đã héo hết.” Tuyết tan là 「雪が溶ける」／「雪が解ける」, không phải 「枯れる」.',
    'Ghi nhớ: cây/hoa héo là 「枯れる」; thịt cháy là 「焦げる」; máy hỏng là 「壊れる・故障する」; tuyết tan là 「溶ける・解ける」.'
  ].join(String.fromCharCode(10))
}

const mockAnswer = (question) => Number(question.correctAnswer ?? question.answer)
const sectionAnswer = (question) => Number(question.correctAnswer ?? question.answer)
assert.equal(mockAnswer(mockQuestions.get(34)), 1, 'Keep question 34 answer 1.')
assert.equal(sectionAnswer(sectionQuestions.get(34)), 1, 'Keep standalone question 34 answer 1.')
assert.equal(mockAnswer(mockQuestions.get(35)), 2, 'Keep question 35 answer 2.')
assert.equal(sectionAnswer(sectionQuestions.get(35)), 2, 'Keep standalone question 35 answer 2.')

replaceSectionOption(
  sectionQuestions.get(34),
  2,
  '部強がとても静かなので、時計のどきどきする音が聞こえる。',
  '部屋がとても静かなので、時計のどきどきする音が聞こえる。'
)
replaceMockOption(
  mockQuestions.get(35),
  3,
  'この機械はとても古いから、いろいろ所がかれて動かない',
  'この機械はとても古いから、いろいろな所がかれて動かない'
)
replaceSectionOption(
  sectionQuestions.get(35),
  1,
  '火が強すぎて、肉が無くかれてしまった。',
  '火が強すぎて、肉が黒くかれてしまった。'
)

for (const number of [34, 35]) {
  const mock = mockQuestions.get(number)
  const standalone = sectionQuestions.get(number)
  mock.explanation = explanations[number]
  standalone.explanation = explanations[number]
  curated[mock.id] = explanations[number]
}

const report = {
  title: 'Rà lời giải từ vựng M5 N3 07/2017 — câu 34–35',
  answerKeysChanged: 0,
  questions: [
    {
      number: 34,
      answer: 1,
      target: 'どきどき',
      optionCorrection: 'Bản đề rời ghi nhầm 部強; nguồn đề tham khảo xác nhận 部屋.',
      source: 'https://trynihongo.com/en/solucion-del-examen-jlpt-n3-de-julio-de-2017-moji-goi-p1068',
      usageSource: 'https://www2.ninjal.ac.jp/Onomatope/50_on/dokidoki.html'
    },
    {
      number: 35,
      answer: 2,
      target: 'かれる（枯れる）',
      optionCorrections: [
        'Bản đề rời ghi 無くかれて; nguồn đề tham khảo xác nhận 黒くかれて.',
        'Đề toàn phần thiếu な trong いろいろな所; đã đồng bộ theo nguồn đề tham khảo.'
      ],
      source: 'https://trynihongo.com/en/solucion-del-examen-jlpt-n3-de-julio-de-2017-moji-goi-p1068',
      usageSource: 'https://kotobank.jp/word/%E6%9E%AF%E3%82%8C%E3%82%8B-468424'
    }
  ],
  method: 'Giữ khóa hiện có; rà theo nghĩa và kết hợp từ trong từng câu. Nguồn đáp án chính thức JLPT không được xác nhận trong lượt này.'
}
fs.writeFileSync(mockPath, JSON.stringify(mockExams, null, 2) + String.fromCharCode(10), 'utf8')
fs.writeFileSync(sectionPath, JSON.stringify(sectionExams, null, 2) + String.fromCharCode(10), 'utf8')
fs.writeFileSync(curatedPath, JSON.stringify(curated, null, 2) + String.fromCharCode(10), 'utf8')
fs.writeFileSync(reportPath, JSON.stringify(report, null, 2) + String.fromCharCode(10), 'utf8')
console.log('Updated N3 07/2017 vocabulary M5 questions 34–35 in both records.')
