import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'

const root = path.resolve('.')
const fullMasterPath = path.join(root, 'data/jlpt_n3_toan_master.json')
const sectionMasterPath = path.join(root, 'data/jlpt_full_master.json')
const curatedPath = path.join(root, 'data/jlpt_n3_explanations_curated.json')
const reportPath = path.join(root, 'reports/n3-quality-audit/vocabulary-2020-12-kanji-readings-review.json')
const fullExamId = 'toan-n3-202012-full'
const sectionExamId = 'cm2u2xg4300wm134izpbjrysi-vocab'

const reviews = [
  {
    number: 9,
    answer: 3,
    options: ['途', '迅', '逆', '造'],
    explanation: [
      'Đáp án 3 — 「逆（ぎゃく）」là ngược lại/trái chiều. Cách đọc ぎゃく khớp với chữ 逆.',
      'Dịch: “Điều đó ngược lại rồi.”',
      '1. 途（と）: đường/lộ trình; là chữ khác và không đọc là ぎゃく.',
      '2. 迅（じん）: nhanh/chớp nhoáng; không có cách đọc ぎゃく.',
      '3. 逆（ぎゃく）: ngược lại; đúng với câu 「それは逆ですよ」.',
      '4. 造（ぞう）: tạo ra/chế tạo; không đọc là ぎゃく và không hợp nghĩa câu.',
      'Ghi nhớ: 逆（ぎゃく）= ngược; 逆になる = trở nên trái ngược.',
    ].join('\n'),
  },
  {
    number: 10,
    answer: 2,
    options: ['冷く', '低く', '底く', '令く'],
    explanation: [
      'Đáp án 2 — 「低く（ひくく）」là dạng nối của 低い（ひくい）, nghĩa là thấp. Nhiệt độ dự báo sẽ xuống thấp nên dùng 低くなる.',
      'Dịch: “Nghe nói sáng mai nhiệt độ sẽ xuống thấp.”',
      '1. 冷く: 「冷」gợi nghĩa lạnh, nhưng chữ này không viết từ ひくい; “trời lạnh” thường nói 「寒い」, còn “đồ vật lạnh” là 「冷たい」.',
      '2. 低く（ひくく）: thấp; đúng với nhiệt độ ở mức thấp hơn.',
      '3. 底く: 底（そこ）là đáy/phần dưới cùng; không phải tính từ 低い và không viết cách đọc ひくい.',
      '4. 令く: 令（れい）mang nghĩa mệnh lệnh/chỉ thị; không đọc là ひく và không diễn tả nhiệt độ thấp.',
      'Ghi nhớ: nhiệt độ thấp = 気温が低い; lạnh = 寒い／冷たい tùy ngữ cảnh; 底 là đáy.',
    ].join('\n'),
  },
  {
    number: 11,
    answer: 3,
    options: ['観祭', '視察', '観察', '視祭'],
    explanation: [
      'Đáp án 3 — 「観察（かんさつ）」là quan sát kỹ để nhận biết đặc điểm. Hình dáng và màu sắc của hoa là những điều học sinh quan sát trong giờ học.',
      'Dịch: “Trong giờ học, chúng tôi đã quan sát hình dáng và màu sắc của hoa.”',
      '1. 観祭: sai chữ thứ hai; 祭（まつり／さい）liên quan đến lễ hội, không tạo thành từ かんさつ.',
      '2. 視察（しさつ）: thị sát/đi kiểm tra một địa điểm hoặc cơ sở; cách đọc và cách dùng khác với quan sát đặc điểm của hoa.',
      '3. 観察（かんさつ）: quan sát để tìm hiểu đặc điểm; dùng đúng trong ngữ cảnh bài học.',
      '4. 視祭: chữ 祭 không đúng và tổ hợp này không phải cách viết của từ かんさつ.',
      'Ghi nhớ: 花を観察する = quan sát hoa; 現場を視察する = đi thị sát hiện trường.',
    ].join('\n'),
  },
  {
    number: 12,
    answer: 4,
    options: ['恋いて', '涙いて', '悲いて', '泣いて'],
    explanation: [
      'Đáp án 4 — 「泣いて」là thể て của 泣く（なく）, nghĩa là khóc. Người ta khóc khi đọc bức thư.',
      'Dịch: “Anh/chị Tamura đã khóc khi đọc thư.”',
      '1. 恋いて: 恋（こい）là tình yêu/nhớ thương; không phải động từ 泣く và không tạo thể て này.',
      '2. 涙いて: 涙（なみだ）là nước mắt; danh từ này không chia thành 涙いて để diễn tả “khóc”.',
      '3. 悲いて: 悲しい（かなしい）là buồn; không viết động từ “khóc” bằng chữ 悲. Động từ khóc là 泣く.',
      '4. 泣いて: đúng là thể て của 泣く; 「手紙を読んで泣いていた」diễn tả đang khóc khi đọc thư.',
      'Ghi nhớ: 泣く（なく）= khóc; 涙（なみだ）= nước mắt; 悲しい（かなしい）= buồn.',
    ].join('\n'),
  },
  {
    number: 13,
    answer: 1,
    options: ['以降', '以向', '移降', '移向'],
    explanation: [
      'Đáp án 1 — 「以降（いこう）」nghĩa là từ mốc đó trở đi. 「夜の11時以降」là từ sau 11 giờ đêm.',
      'Dịch: “Từ sau 11 giờ đêm, phí sẽ cao hơn.”',
      '1. 以降（いこう）: kể từ mốc ấy trở đi; kết hợp tự nhiên với giờ giấc và đúng nghĩa câu.',
      '2. 以向: 向（むく／こう）mang nghĩa hướng về; không phải chữ 降 trong cách viết 以降 và không tạo thành từ chỉ thời điểm về sau.',
      '3. 移降: 移（うつる／い）gợi nghĩa di chuyển; đây không phải cách viết いこう trong nghĩa “từ đó trở đi”.',
      '4. 移向: hai chữ đều khác dạng cần dùng; không phải cách viết 以降 và không diễn tả thời điểm trở đi.',
      'Ghi nhớ: 11時以降 = từ sau 11 giờ; 以降／以前 dùng để chỉ mốc về sau/về trước.',
    ].join('\n'),
  },
]

const fullMaster = JSON.parse(fs.readFileSync(fullMasterPath, 'utf8'))
const sectionMaster = JSON.parse(fs.readFileSync(sectionMasterPath, 'utf8'))
const curated = JSON.parse(fs.readFileSync(curatedPath, 'utf8'))
const fullExam = fullMaster.find((exam) => exam.id === fullExamId)
const sectionExam = sectionMaster.find((exam) => exam.id === sectionExamId)
assert.ok(fullExam, `Missing N3 full exam ${fullExamId}`)
assert.ok(sectionExam, `Missing N3 section exam ${sectionExamId}`)
const fullQuestions = fullExam.parts.flatMap((part) => part.questions || [])
const sectionQuestions = sectionExam.parts.flatMap((part) => part.questions || [])

for (const row of reviews) {
  const fullQuestion = fullQuestions.find((question) => Number(question.number) === row.number)
  const sectionQuestion = sectionQuestions.find((question) => Number(question.number) === row.number)
  assert.ok(fullQuestion && sectionQuestion, `Missing question ${row.number}`)
  assert.equal(Number(fullQuestion.answer), row.answer)
  assert.equal(Number(fullQuestion.correctAnswer), row.answer)
  assert.deepEqual(
    fullQuestion.options.map((option) => String(option).replace(/^\s*[1-4][.)．、\s　]*/u, '').trim()),
    row.options,
  )
  assert.equal(Number(sectionQuestion.answer), row.answer)
  assert.deepEqual(sectionQuestion.options.map((option) => option.text.trim()), row.options)
  assert.ok(row.explanation.startsWith(`Đáp án ${row.answer} —`))
  assert.ok(row.explanation.includes('Dịch:'))
  for (let choice = 1; choice <= 4; choice++) assert.ok(row.explanation.includes(`\n${choice}. `))
  fullQuestion.explanation = row.explanation
  sectionQuestion.explanation = row.explanation
  curated[fullQuestion.id] = row.explanation
  curated[sectionQuestion.id] = row.explanation
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
      questionNumbers: reviews.map(({ number }) => number),
      answerKeysChanged: 0,
      answerKeys: reviews.map(({ answer }) => answer),
      scope: 'Translate the prompt and explain the correct reading/writing plus the meaning or spelling reason for each distractor.',
      rows: reviews.map(({ number, answer, options, explanation }) => ({
        number,
        answer,
        options,
        explanation,
        includesTranslation: explanation.includes('Dịch:'),
        explainsAllFourChoices: [1, 2, 3, 4].every((choice) => explanation.includes(`\n${choice}. `)),
      })),
      sources: [
        {
          url: 'https://www.nihongoph.com/2022/10/jlpt-n3-122020.html',
          type: 'Third-party transcription of the December 2020 N3 vocabulary prompts and choices; not an official JLPT answer key.',
        },
        {
          url: 'https://www.scribd.com/document/879176896/2020%E5%B9%B412%E6%9C%88%E6%97%A5%E6%9C%AC%E8%AA%9E%E8%83%BD%E5%8A%9B%E8%A9%A6%E9%A8%93N3%E7%9C%9F%E9%A1%8C',
          type: 'Independent third-party reproduction of the same N3 12/2020 vocabulary section; not official.',
        },
      ],
      method: 'Kept the current answer keys unchanged, matched the prompts/options in both stored exam records, translated each sentence, and described why each written choice matches or does not match the target reading and context. This is an explanation/content review, not an independent official-key audit.',
    },
    null,
    2,
  )}\n`,
)

console.log('Completed the JLPT N3 12/2020 kanji/vocabulary explanations for questions 9–13.')
