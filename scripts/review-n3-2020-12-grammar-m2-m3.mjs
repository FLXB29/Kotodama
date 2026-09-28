import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'

const root = process.cwd()
const fullMasterPath = path.join(root, 'data/jlpt_n3_toan_master.json')
const sectionMasterPath = path.join(root, 'data/jlpt_full_master.json')
const curatedPath = path.join(root, 'data/jlpt_n3_explanations_curated.json')
const reportPath = path.join(root, 'reports/n3-quality-audit/grammar-2020-12-m2-m3-review.json')
const fullExamId = 'toan-n3-202012-full'
const sectionExamId = 'cm2u2xg4300wm134izpbjrysi-grammar-reading'

const reviews = [
  {
    number: 49,
    answer: 1,
    options: ['などの', 'スパゲッティ', '料理も', 'だけでなく'],
    order: [4, 2, 1, 3],
    explanation: [
      'Câu hoàn chỉnh: 「この喫茶店はコーヒーだけでなく、スパゲッティなどの料理もおいしい。」',
      'Dịch: “Quán cà phê này không chỉ có cà phê ngon mà các món như mì spaghetti cũng ngon.”',
      'Thứ tự bốn mảnh là 4 → 2 → 1 → 3; ô ★ ở vị trí thứ ba nhận 「などの」, lựa chọn 1. Cả bốn mảnh đều được dùng, nên các lựa chọn không phải phương án sai; cần đặt chúng đúng vị trí trong câu.',
      '1. などの: đứng sau danh từ nêu ví dụ 「スパゲッティ」 và trước danh từ khái quát 「料理」, tạo cụm 「スパゲッティなどの料理」 (các món như spaghetti). Đây là mảnh ở ô ★.',
      '2. スパゲッティ: đứng sau 「だけでなく」 để nêu món thứ hai được khen ngon, trước 「などの料理」.',
      '3. 料理も: kết thúc phần liệt kê bằng “các món ăn cũng”; theo sau cụm ví dụ 「スパゲッティなどの」.',
      '4. だけでなく: gắn với 「コーヒー」 thành 「コーヒーだけでなく」, nghĩa là “không chỉ cà phê”; mở đầu vế bổ sung tương ứng với 「料理も」.',
      'Ghi nhớ: 「AだけでなくBも」 = không chỉ A mà B cũng; 「NなどのN」 = những N như N.',
    ].join('\n'),
  },
  {
    number: 50,
    answer: 3,
    options: ['しかない', '始まる', 'あと3分', 'まで'],
    order: [2, 4, 3, 1],
    explanation: [
      'Câu hoàn chỉnh: 「映画が始まるまであと3分しかないよ。」',
      'Dịch: “Chỉ còn ba phút nữa là phim bắt đầu đấy.”',
      'Thứ tự bốn mảnh là 2 → 4 → 3 → 1; ô ★ ở vị trí thứ ba nhận 「あと3分」, lựa chọn 3. Cả bốn mảnh đều cần thiết để tạo câu tự nhiên.',
      '1. しかない: đặt sau lượng thời gian 「あと3分」 để nhấn mạnh “chỉ còn ba phút”; đứng cuối cụm trước 「よ」.',
      '2. 始まる: mở đầu phần nêu sự kiện sắp tới 「映画が始まるまで」 (cho đến lúc phim bắt đầu).',
      '3. あと3分: nêu lượng thời gian còn lại; đây là mảnh đứng ở ô ★.',
      '4. まで: nối thời điểm phim bắt đầu với thời lượng còn lại: 「始まるまであと3分」 (còn ba phút đến khi bắt đầu).',
      'Ghi nhớ: 「VるまであとN分」 = còn N phút nữa đến khi V; 「Nしかない」 = chỉ có/còn N mà thôi.',
    ].join('\n'),
  },
  {
    number: 51,
    answer: 2,
    options: ['の', 'いい', '晴れる', 'と'],
    order: [3, 4, 2, 1],
    explanation: [
      'Câu hoàn chỉnh: 「今度の日曜日に友人の結婚式がある。晴れるといいのだが……」',
      'Dịch: “Chủ nhật tới có đám cưới của bạn tôi. Mong là trời nắng, nhưng…”',
      'Thứ tự bốn mảnh là 3 → 4 → 2 → 1; ô ★ ở vị trí thứ ba nhận 「いい」, lựa chọn 2. Cả bốn mảnh đều được dùng.',
      '1. の: theo sau 「いい」 để tạo 「いいのだが」, cách kết câu bỏ lửng diễn tả mong muốn pha chút băn khoăn.',
      '2. いい: tạo cấu trúc mong ước 「晴れるといい」 (mong là trời nắng); đây là mảnh ở ô ★.',
      '3. 晴れる: động từ thể từ điển, đứng đầu cụm điều kiện 「晴れると」.',
      '4. と: nối điều kiện với mong ước: 「晴れるといい」.',
      'Ghi nhớ: 「Vるといい」 = mong là V; 「～のだが……」 có thể để lửng điều người nói còn băn khoăn.',
    ].join('\n'),
  },
  {
    number: 52,
    answer: 3,
    options: ['よく言っているが', 'やっぱりサッカーが', '続けているのは', 'それでもやめずに'],
    order: [1, 4, 3, 2],
    explanation: [
      'Câu hoàn chỉnh: 「息子は、サッカークラブの練習がきついとよく言っているが、それでもやめずに続けているのはやっぱりサッカーが好きだからだと思う。」',
      'Dịch: “Con trai tôi thường nói việc luyện tập ở câu lạc bộ bóng đá rất vất vả, nhưng dù vậy nó vẫn tiếp tục vì tôi nghĩ quả nhiên là nó thích bóng đá.”',
      'Thứ tự bốn mảnh là 1 → 4 → 3 → 2; ô ★ ở vị trí thứ ba nhận 「続けているのは」, lựa chọn 3. Đây là bài sắp xếp, nên bốn mảnh đều thuộc câu hoàn chỉnh.',
      '1. よく言っているが: theo sau mệnh đề 「練習がきついと」, tạo ý “thường nói rằng buổi tập vất vả, nhưng…”.',
      '2. やっぱりサッカーが: đứng trước 「好きだから」, nêu lý do tiếp tục là “quả nhiên vì thích bóng đá”.',
      '3. 続けているのは: mở mệnh đề chủ đề “việc vẫn tiếp tục là…”; đây là mảnh ở ô ★.',
      '4. それでもやめずに: nối với vế trước bằng ý nhượng bộ “dù vậy vẫn không bỏ”, rồi dẫn đến 「続けている」.',
      'Ghi nhớ: 「それでも」 biểu thị “dù vậy”; 「Vているのは～からだ」 nêu lý do của việc đang/tiếp tục V.',
    ].join('\n'),
  },
  {
    number: 53,
    answer: 4,
    options: ['こんでいる電車は', 'よい運動になるから', '嫌いだし', '自転車で行けば'],
    order: [1, 3, 4, 2],
    explanation: [
      'Câu hoàn chỉnh: 「うちから学校まで自転車で40分かかる。電車なら20分だが、朝のこんでいる電車は嫌いだし、自転車で行けばよい運動になるから自転車で通っている。」',
      'Dịch: “Từ nhà đến trường đi xe đạp mất 40 phút; đi tàu thì 20 phút, nhưng tôi không thích tàu đông vào buổi sáng, hơn nữa đi xe đạp cũng là vận động tốt nên tôi đi học bằng xe đạp.”',
      'Thứ tự bốn mảnh là 1 → 3 → 4 → 2; ô ★ ở vị trí thứ ba nhận 「自転車で行けば」, lựa chọn 4. Bốn mảnh đều cần thiết: nêu tàu đông, thái độ với tàu, điều kiện đi xe đạp và lợi ích của việc đó.',
      '1. こんでいる電車は: theo sau 「朝の」 để thành chủ đề 「朝のこんでいる電車は」 (tàu đông buổi sáng thì…).',
      '2. よい運動になるから: nêu lý do “vì sẽ thành một hình thức vận động tốt”, đứng trước kết luận đi xe đạp thường xuyên.',
      '3. 嫌いだし: bổ sung lý do không thích tàu đông, rồi nối thêm lý do thứ hai bằng 「し」.',
      '4. 自転車で行けば: nêu điều kiện “nếu đi bằng xe đạp thì…”; đây là mảnh ở ô ★, nối tự nhiên với 「よい運動になる」.',
      'Ghi nhớ: 「～ば」 có thể nêu điều kiện và kết quả; 「～し」 liệt kê một lý do, thường còn lý do khác.',
    ].join('\n'),
  },
  {
    number: 54,
    answer: 4,
    options: ['待つことです', '待ちにくいからです', '待ったところです', '待っているのです'],
    explanation: [
      'Đáp án 4 — 「店に入るために待っているのです」 giải thích những người được nhìn thấy đang xếp hàng trước nhà hàng: họ đang chờ để vào quán.',
      'Dịch đoạn: “Khi đi trên phố Tokyo, tôi thường thấy rất đông người xếp hàng trước nhà hàng. Họ đang chờ để vào quán. Có lẽ đó là những quán nổi tiếng, nhưng chờ lâu thì rất phí thời gian, nên tôi thường chọn quán có thể vào ngay.”',
      '1. 待つことです: 「こと」 danh từ hóa hành động “chờ”; có thể hiểu riêng lẻ nhưng không diễn tả tự nhiên trạng thái đang chờ của đám đông vừa được quan sát như câu cần làm.',
      '2. 待ちにくいからです: “vì khó chờ”; không hoàn tất lời giải thích về việc vì sao có người đang xếp hàng để vào quán, và 「にくい」 không hợp với ý tiếp nối về thời gian chờ lâu.',
      '3. 待ったところです: “vừa mới chờ xong”; trái với cảnh người ta vẫn đang xếp hàng và mạch sau nói về việc chờ lâu.',
      '4. 待っているのです: “đang chờ đấy/chính là đang chờ”; thể 「ている」 mô tả hành động đang diễn ra, còn 「のです」 giải thích cảnh xếp hàng; phù hợp nhất.',
      'Ghi nhớ: 「Vている」 mô tả trạng thái/hành động đang diễn ra; 「のです」 thường đưa ra lời giải thích cho điều vừa nêu.',
    ].join('\n'),
  },
  {
    number: 55,
    answer: 1,
    options: ['でも', 'また', 'つまり', 'そのうえ'],
    explanation: [
      'Đáp án 1 — 「でも」 tạo quan hệ tương phản: cửa hàng đông người, nhưng nhờ trò chuyện với bạn trong lúc chờ nên người viết không cảm thấy thời gian chờ quá dài.',
      'Dịch: “Khi đến quán thì quả nhiên có rất đông người xếp hàng. Thế nhưng, trong lúc vừa chờ vừa nói chuyện với bạn, tôi không cảm thấy mình đã phải đợi lâu.”',
      '1. でも: “nhưng/thế nhưng”; nối tình trạng đông người với kết quả trái dự đoán là chờ mà không thấy lâu; đúng mạch.',
      '2. また: “lại/cũng/thêm nữa”; thường bổ sung sự việc cùng chiều, không nêu tương phản giữa hàng dài và cảm nhận thời gian.',
      '3. つまり: “nói cách khác/tức là”; dùng để diễn giải hoặc kết luận điều vừa nói, không phù hợp vì vế sau nêu kết quả trái kỳ vọng.',
      '4. そのうえ: “hơn nữa”; thêm thông tin cùng chiều, trong khi câu cần chuyển ý tương phản.',
      'Ghi nhớ: 「でも」 chuyển ý tương phản; 「また／そのうえ」 bổ sung; 「つまり」 diễn đạt lại hoặc rút kết luận.',
    ].join('\n'),
  },
  {
    number: 56,
    answer: 2,
    options: ['言えて', '言われて', '言ってきて', '言ってくれて'],
    explanation: [
      'Đáp án 2 — 「先輩に……と言われてうれしかった」 nghĩa là người viết vui khi được tiền bối nói với mình câu ấy. 「に」 đánh dấu người nói trong cấu trúc bị động 「言われる」.',
      'Dịch: “Hôm sau, tôi kể với tiền bối trong nhóm nghiên cứu về chiếc bánh phô mai nổi tiếng đã ăn. Tiền bối nói: ‘Hay quá nhỉ. Lần tới mình cũng muốn đi thử.’ Nghe vậy tôi rất vui.”',
      '1. 言えて: 「言える」 là “có thể nói/nói được”; ghép với câu trích dẫn sẽ biến chủ thể thành người kể, trong khi lời thoại là của tiền bối.',
      '2. 言われて: thể bị động của 言う; 「先輩に」 là người nói, người viết là người nhận lời nói và cảm thấy vui; đúng cả vai giao tiếp lẫn trợ từ.',
      '3. 言ってきて: 「～てくる」 có thể nhấn hướng hành động về phía người nói, nhưng câu không kể tiền bối đi tới để nói; cấu trúc này không khớp bằng bị động 「先輩に言われて」.',
      '4. 言ってくれて: 「～てくれる」 diễn tả người khác làm việc gì cho mình, nhưng trong cách nói này người thực hiện thường làm chủ ngữ 「先輩が」; với 「先輩に」, dạng bị động 「言われて」 tự nhiên và chính xác hơn.',
      'Ghi nhớ: 「人に言われる」 = được ai nói với mình; 「人が言ってくれる」 = ai đó nói/làm điều ấy cho mình.',
    ].join('\n'),
  },
  {
    number: 57,
    answer: 3,
    options: ['その', 'どの', '別の', 'チーズケーキの'],
    explanation: [
      'Đáp án 3 — 「別の人気店」 nghĩa là “một quán nổi tiếng khác”; phù hợp với ý người viết muốn xếp hàng thử thêm một quán vào dịp khác.',
      'Dịch câu chứa chỗ trống: “Nếu có dịp lần tới, tôi cũng muốn thử xếp hàng ở một quán nổi tiếng khác.”',
      '1. その: “quán nổi tiếng đó”; chỉ một quán đã xác định, không nêu ý chuyển sang quán khác như mạch văn.',
      '2. どの: “quán nổi tiếng nào”; cần câu hỏi hoặc cụm lựa chọn, nhưng câu này là lời kể về mong muốn trong tương lai.',
      '3. 別の: “khác”; 「別の人気店」 thể hiện muốn thử một quán nổi tiếng khác với quán bánh phô mai vừa kể.',
      '4. チーズケーキの: “quán bánh phô mai”; lặp lại đúng loại quán đã kể, không mang nghĩa “một quán khác”.',
      'Ghi nhớ: 「別の＋danh từ」 = một … khác; 「どの＋danh từ」 = … nào trong số đó.',
    ].join('\n'),
  },
]

const cleanOption = (option) => {
  const value = typeof option === 'object' && option ? option.text : option
  return String(value)
    .normalize('NFKC')
    .replace(/^\s*[1-4][.)．、\s　]*/u, '')
    .trim()
}
const stripPrintedOptionNumber = (value) => String(value).replace(/^[\s　]*[１-４1-4][.)．、][\s　]*/u, '').trim()
const replacePhraseDeep = (value, from, to) => {
  if (typeof value === 'string') return value.replaceAll(from, to)
  if (Array.isArray(value)) return value.map((entry) => replacePhraseDeep(entry, from, to))
  if (value && typeof value === 'object') {
    return Object.fromEntries(Object.entries(value).map(([key, entry]) => [key, replacePhraseDeep(entry, from, to)]))
  }
  return value
}
const readJson = (file) => JSON.parse(fs.readFileSync(file, 'utf8'))
const fullMaster = readJson(fullMasterPath)
const sectionMaster = readJson(sectionMasterPath)
const curated = readJson(curatedPath)
const fullExam = fullMaster.find((exam) => exam.id === fullExamId)
const sectionExam = sectionMaster.find((exam) => exam.id === sectionExamId)
assert.ok(fullExam, `Missing full exam ${fullExamId}`)
assert.ok(sectionExam, `Missing standalone exam ${sectionExamId}`)
const fullQuestions = fullExam.parts.flatMap((part) => part.questions || [])
const sectionQuestions = sectionExam.parts.flatMap((part) => part.questions || [])

for (const row of reviews) {
  const fullQuestion = fullQuestions.find((question) => Number(question.number) === row.number)
  const sectionQuestion = sectionQuestions.find((question) => Number(question.number) === row.number)
  assert.ok(fullQuestion && sectionQuestion, `Missing question ${row.number} in one of the two exam records`)
  for (const question of [fullQuestion, sectionQuestion]) {
    assert.deepEqual(question.options.map(cleanOption), row.options, `Unexpected option text at question ${row.number}`)
    assert.equal(Number(question.correctAnswer ?? question.answer), row.answer, `Unexpected key at question ${row.number}`)
  }
  if (row.number === 49) {
    fullQuestion.options = fullQuestion.options.map(stripPrintedOptionNumber)
    sectionQuestion.options = sectionQuestion.options.map((option) => ({
      ...option,
      text: stripPrintedOptionNumber(option.text),
    }))
  }
  if (row.number === 52) {
    const correctedFull = replacePhraseDeep(fullQuestion, 'サッカークラップ', 'サッカークラブ')
    const correctedSection = replacePhraseDeep(sectionQuestion, 'サッカークラップ', 'サッカークラブ')
    Object.assign(fullQuestion, correctedFull)
    Object.assign(sectionQuestion, correctedSection)
    assert.match(JSON.stringify(fullQuestion), /サッカークラブの練習/u)
    assert.doesNotMatch(JSON.stringify(fullQuestion), /サッカークラップ/u)
  }
  if (row.order) {
    assert.deepEqual(fullQuestion.starCorrectOrder, row.order, `Unexpected fragment order at question ${row.number}`)
    assert.equal(fullQuestion.starPosition, 2, `Unexpected ★ position at question ${row.number}`)
    assert.equal(fullQuestion.starCorrectOrder[fullQuestion.starPosition], row.answer, `Stored answer does not match ★ at ${row.number}`)
  }
  assert.ok(row.explanation.includes('Dịch'), `Missing Vietnamese translation at question ${row.number}`)
  for (let choice = 1; choice <= 4; choice++) {
    assert.ok(row.explanation.includes(`\n${choice}. `), `Missing explanation for choice/fragment ${choice} at question ${row.number}`)
  }
  fullQuestion.explanation = row.explanation
  sectionQuestion.explanation = row.explanation
  curated[fullQuestion.id] = row.explanation
  curated[sectionQuestion.id] = row.explanation
}

fs.writeFileSync(fullMasterPath, `${JSON.stringify(fullMaster, null, 2)}\n`, 'utf8')
fs.writeFileSync(sectionMasterPath, `${JSON.stringify(sectionMaster, null, 2)}\n`, 'utf8')
fs.writeFileSync(curatedPath, `${JSON.stringify(curated, null, 2)}\n`, 'utf8')
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
      sourceCorrections: [
        {
          questionNumber: 49,
          issue: 'One ★ fragment contained its printed option number, which duplicated the interface number.',
          correction: 'Removed only the redundant leading “2.” from the fragment text; no answer or fragment wording changed.',
        },
        {
          questionNumber: 52,
          issue: 'The stored stem had OCR/transcription “サッカークラップ”.',
          correction: 'Corrected it to “サッカークラブ”, matching independent transcriptions of the same question.',
        },
      ],
      starOrders: reviews.filter((row) => row.order).map(({ number, order, answer }) => ({ number, order, starPosition: 3, starredChoice: answer })),
      scope: 'Explain the complete ★ fragment order and starred piece for questions 14–18; explain every blank option in context for questions 19–22; include translations.',
      rows: reviews.map(({ number, answer, options, order, explanation }) => ({
        number,
        answer,
        options,
        order: order || null,
        explanation,
        includesTranslation: explanation.includes('Dịch'),
        explainsAllChoicesOrFragments: [1, 2, 3, 4].every((choice) => explanation.includes(`\n${choice}. `)),
      })),
      sources: [
        {
          url: 'https://www.tiengnhatdongian.com/dap-an-jlpt-n3-12-2020/',
          type: 'Published third-party answer compilation; its grammar Mondai 2 and 3 keys match questions 14–22. Not an official JLPT answer sheet.',
        },
        {
          url: 'https://trynihongo.com/en/de-thi-jlpt-ngu-phap-doc-hieu-n3-thang-12-2020-q1217',
          type: 'Third-party transcription of the grammar passage and options, used to cross-check the text. Not an official source.',
        },
        {
          url: 'https://www.nihongoph.com/2022/10/jlpt-n3-122020.html',
          type: 'Independent third-party reproduction of December 2020 N3 question text and ★ options. Not an official answer key.',
        },
      ],
      method: 'Kept the existing keys and fragment orders, checked all nine keys against the published reference sequence, verified the ★ choice against the stored order metadata, and wrote contextual Vietnamese explanations for every piece/answer option. This is not official-key certification.',
    },
    null,
    2,
  )}\n`,
  'utf8',
)

console.log(`Updated ${reviews.length} explanations for the N3 12/2020 grammar ★ and cloze questions in both exam records.`)
