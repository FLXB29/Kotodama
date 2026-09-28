import fs from 'node:fs'

const masterPath = 'data/jlpt_n3_toan_master.json'
const sectionMasterPath = 'data/jlpt_full_master.json'
const curatedPath = 'data/jlpt_n3_explanations_curated.json'
const sourceUrl = 'https://drive.google.com/file/d/1U0CZnFUibxiS9PFX_BdfWK2QgaDB-m6C/view'
const master = JSON.parse(fs.readFileSync(masterPath, 'utf8'))
const sectionMaster = JSON.parse(fs.readFileSync(sectionMasterPath, 'utf8'))
const curated = JSON.parse(fs.readFileSync(curatedPath, 'utf8'))
const exam = master.find((item) => item.id === 'toan-n3-201712-full')
if (!exam) throw new Error('Could not locate the N3 December 2017 full exam.')
const sectionExam = sectionMaster.find((item) => item.id === 'cm2u2wuad00fw134ipsfpq3fu-grammar-reading')
if (!sectionExam) throw new Error('Could not locate the N3 December 2017 grammar and reading section.')

const questions = new Map(
  exam.parts.flatMap((part) => (part.questions || []).map((question) => [Number(question.number), question]))
)
const getQuestion = (number) => {
  const question = questions.get(number)
  if (!question) throw new Error(`Could not locate December 2017 question ${number}.`)
  return question
}
const sectionQuestions = new Map(
  sectionExam.parts.flatMap((part) => (part.questions || []).map((question) => [Number(question.number), question]))
)
const getSectionQuestion = (number) => {
  const question = sectionQuestions.get(number)
  if (!question) throw new Error(`Could not locate December 2017 section question ${number}.`)
  return question
}
const writeExplanation = (number, lines) => {
  const question = getQuestion(number)
  const explanation = lines.join('\n')
  question.explanation = explanation
  curated[question.id] = explanation
}

const q45 = getQuestion(45)
if (q45.correctAnswer !== 2) throw new Error('December 2017 question 45 answer changed unexpectedly.')
for (const field of ['question', 'sentence']) {
  if (q45[field]?.includes('そのま食べる')) {
    q45[field] = q45[field].replace('そのま食べる', 'そのまま食べる')
  } else if (!q45[field]?.includes('そのまま食べる')) {
    throw new Error(`Unexpected December 2017 question 45 ${field}: ${q45[field]}`)
  }
}

const q42Section = getSectionQuestion(42)
for (const field of ['question', 'sentence']) {
  if (typeof q42Section[field] !== 'string') continue
  if (q42Section[field]?.includes('客きゃく')) {
    q42Section[field] = q42Section[field].replace('客きゃく', '客')
  } else if (!/客:?「すみません/u.test(q42Section[field])) {
    throw new Error(`Unexpected December 2017 section question 42 ${field}: ${q42Section[field]}`)
  }
}
for (const [optionNumber, printedText] of [
  [1, 'でいらっしゃいます'],
  [3, 'と申し上げます'],
  [4, 'とおっしゃいます'],
]) {
  const option = q42Section.options?.find((item) => Number(item.id) === optionNumber)
  if (!option) throw new Error(`Could not locate December 2017 section question 42 option ${optionNumber}.`)
  if (option.text !== printedText && option.text !== `${printedText}。`) {
    throw new Error(`Unexpected December 2017 section question 42 option ${optionNumber}: ${option.text}`)
  }
  option.text = printedText
}

const clozeSectionPart = sectionExam.parts.find((part) =>
  part.questions?.some((question) => Number(question.number) === 54)
)
if (!clozeSectionPart?.passage) throw new Error('Could not locate the December 2017 section cloze passage.')
for (const [before, after] of [
  ['大おお勢ぜい', '大勢'],
  ['自じ由ゆう', '自由'],
]) {
  if (clozeSectionPart.passage.includes(before)) {
    clozeSectionPart.passage = clozeSectionPart.passage.replace(before, after)
  } else if (!clozeSectionPart.passage.includes(after)) {
    throw new Error(`Unexpected December 2017 section cloze passage text: ${before}`)
  }
}
const q57SectionOption2 = getSectionQuestion(57).options?.find((item) => Number(item.id) === 2)
if (!q57SectionOption2) throw new Error('Could not locate December 2017 section question 57 option 2.')
if (q57SectionOption2.text === 'そんな部屋が') q57SectionOption2.text = 'そんな部屋'
if (q57SectionOption2.text !== 'そんな部屋') {
  throw new Error(`Unexpected December 2017 section question 57 option 2: ${q57SectionOption2.text}`)
}

const starRecords = [
  {
    number: 49,
    answer: 3,
    order: [4, 2, 3, 1],
    sentence: 'まででいいですから',
    lines: [
      'Đáp án 3 — câu hoàn chỉnh: 「来週の金曜まででいいですから、できるときにお願いします。」',
      'Thứ tự bốn mảnh ghép đúng là 4 → 2 → 3 → 1; dấu ★ rơi vào mảnh 3 「いい」.',
      '4. まで: đặt hạn chót “đến/trước thứ Sáu tuần sau”. 2. で: đi sau cụm hạn chót trong 「まででいい」, nghĩa là “đến mốc đó là được”. 3. いい: đánh giá hạn chót là chấp nhận được; đây là vị trí dấu ★. 1. ですから: nối lý do “vì … nên”, dẫn sang lời nhờ làm lúc thuận tiện.',
      'Không đảo ですから lên trước いい vì cần kết thúc mệnh đề 「いいですから」; 「までで」 phải theo sau mốc thời gian để nêu thời hạn.',
      'Dịch: “Trưởng phòng: Anh Yamada có thể sắp xếp tài liệu giúp tôi không? Đến thứ Sáu tuần sau là được, nên khi nào tiện thì làm giúp nhé.”',
      'Ghi nhớ: 「期限まででいい」 = làm xong trước/đến hạn đó là được; 「ですから」 nêu lý do.',
    ],
  },
  {
    number: 50,
    answer: 2,
    order: [3, 4, 2, 1],
    sentence: '患者だったらどうしてほしいかということを考えながら',
    lines: [
      'Đáp án 2 — câu hoàn chỉnh: 「私は、もし自分が患者だったらどうしてほしいかということを考えながら看護師の仕事をしています。」',
      'Thứ tự bốn mảnh ghép đúng là 3 → 4 → 2 → 1; dấu ★ rơi vào mảnh 2 「ということを」.',
      '3. 患者だったら: “nếu là bệnh nhân”, hoàn thành giả định sau 「もし自分が」. 4. どうしてほしいか: “muốn người khác làm gì cho mình”, tạo câu hỏi gián tiếp. 2. ということを: danh từ hóa nội dung câu hỏi làm tân ngữ cho 「考えながら」; đây là vị trí dấu ★. 1. 考えながら: “vừa suy nghĩ vừa…”, nối cách suy xét với công việc điều dưỡng.',
      'Đặt 1 trước nội dung bệnh nhân sẽ muốn gì thì mạch câu bị đảo; thiếu 「ということを」 thì phần câu hỏi gián tiếp không nối tự nhiên với 「考える」.',
      'Dịch: “Tôi làm công việc điều dưỡng trong khi luôn nghĩ rằng nếu mình là bệnh nhân thì mình muốn người khác làm gì cho mình.”',
      'Ghi nhớ: 「もしNだったら、どうしてほしいかということを考える」 = nghĩ xem nếu là N thì mình muốn được đối xử ra sao.',
    ],
  },
  {
    number: 51,
    answer: 2,
    order: [1, 3, 2, 4],
    sentence: 'どうしても寝られないとき以外は',
    lines: [
      'Đáp án 2 — câu hoàn chỉnh: 「私はエアコンの風が好きではないので、夏の夜、暑くてどうしても寝られないとき以外は、自分の部屋ではエアコンを使いません。」',
      'Thứ tự bốn mảnh ghép đúng là 1 → 3 → 2 → 4; dấu ★ rơi vào mảnh 2 「とき」.',
      '1. どうしても: nhấn mạnh “dù thế nào cũng/rất khó mà không…”, bổ nghĩa cho khả năng ngủ. 3. 寝られない: “không ngủ được”, kết thúc mệnh đề điều kiện. 2. とき: “lúc/khi”, biến mệnh đề trước thành thời điểm; đây là vị trí dấu ★. 4. 以外は: “ngoại trừ”, giới hạn trường hợp phải dùng điều hòa.',
      '「以外は」 cần theo sau mốc hoặc trường hợp 「とき」; đặt 「とき」 sau 「以外は」 sẽ phá cụm 「とき以外は」. 「どうしても」 đứng trước 「寝られない」 để nhấn mạnh mức độ.',
      'Dịch: “Vì tôi không thích gió điều hòa nên vào những đêm hè, trừ khi nóng đến mức không thể ngủ được, tôi không dùng điều hòa trong phòng mình.”',
      'Ghi nhớ: 「〜とき以外は」 = ngoại trừ khi…; 「どうしてもVられない」 nhấn mạnh không thể V được.',
    ],
  },
  {
    number: 52,
    answer: 4,
    order: [2, 1, 4, 3],
    sentence: 'あったのか聞いても答えてくれないので何も',
    lines: [
      'Đáp án 4 — câu hoàn chỉnh: 「最近、田中さんは元気がない。心配だが、何があったのか聞いても答えてくれないので何もしてあげられない。」',
      'Thứ tự bốn mảnh ghép đúng là 2 → 1 → 4 → 3; dấu ★ rơi vào mảnh 4 「答えてくれないので」.',
      '2. あったのか: khép câu hỏi gián tiếp 「何があったのか」 — “đã xảy ra chuyện gì”. 1. 聞いても: “dù có hỏi”, mở vế nhượng bộ. 4. 答えてくれないので: “vì bạn ấy không trả lời”, nêu nguyên nhân; đây là vị trí dấu ★. 3. 何も: đi với phủ định 「してあげられない」 để thành “không thể làm gì cả”.',
      '「何があったのか」 phải đi liền trước 「聞いても」; 「何も」 cần đứng ngay trước vị từ phủ định 「してあげられない」, nên không thể đặt nó vào giữa câu hỏi và động từ hỏi.',
      'Dịch: “Gần đây anh Tanaka có vẻ không khỏe. Tôi lo lắm, nhưng dù hỏi anh ấy đã xảy ra chuyện gì thì anh ấy cũng không trả lời, nên tôi chẳng biết làm gì để giúp.”',
      'Ghi nhớ: 「疑問語＋のか」 tạo câu hỏi gián tiếp; 「何も＋phủ định」 = không… gì cả.',
    ],
  },
  {
    number: 53,
    answer: 1,
    order: [4, 2, 1, 3],
    sentence: '車の運転ができない私には生活する',
    lines: [
      'Đáp án 1 — câu hoàn chỉnh: 「この辺りは自然が多く、いつかこういうところに住んでみたいと思うが、近くに買い物できる場所がないので、車の運転ができない私には生活するのは大変そうだ。」',
      'Thứ tự bốn mảnh ghép đúng là 4 → 2 → 1 → 3; dấu ★ rơi vào mảnh 1 「私には」.',
      '4. 車の運転が: đặt chủ đề “việc lái xe”. 2. できない: bổ nghĩa cho người không thể lái xe. 1. 私には: “đối với tôi”, nêu người sẽ thấy việc sống ở đó khó khăn; đây là vị trí dấu ★. 3. 生活する: “sống/sinh hoạt”, nối với 「のは大変そう」 để đánh giá việc sống ở đó.',
      '「車の運転ができない」 phải liền nhau để tạo mệnh đề bổ nghĩa cho 「私」; 「生活する」 đứng ngay trước 「のは大変そう」 để danh từ hóa hành động được đánh giá.',
      'Dịch: “Khu này có nhiều thiên nhiên, nên tôi muốn một ngày nào đó sống ở nơi như thế. Nhưng vì gần đây không có chỗ mua sắm, nên với tôi — người không lái được ô tô — sống ở đây có vẻ sẽ vất vả.”',
      'Ghi nhớ: 「NにはVのは大変」 nêu việc gì khó đối với ai; 「Vことができない」 = không thể V.',
    ],
  },
]

for (const record of starRecords) {
  const question = getQuestion(record.number)
  if (Number(question.correctAnswer ?? question.answer) !== record.answer) {
    throw new Error(`Unexpected December 2017 ★ answer at question ${record.number}.`)
  }
  if (JSON.stringify(question.starCorrectOrder) !== JSON.stringify(record.order)) {
    throw new Error(`Unexpected December 2017 ★ option order at question ${record.number}.`)
  }
  if (question.starPosition !== 2 || record.order[2] !== record.answer) {
    throw new Error(`December 2017 ★ position does not match question ${record.number}.`)
  }
  const fragments = question.options.map((option) => option.replace(/^\s*\d+[.．、]\s*/u, '').trim())
  question.script = record.order.map((optionNumber) => fragments[optionNumber - 1]).join('')
  question.starOrderVerified = true
  question.starPositionVerified = true
  question.starVerificationSources = [...new Set([...(question.starVerificationSources || []), sourceUrl])]
  writeExplanation(record.number, record.lines)
  if (question.script !== record.sentence) {
    throw new Error(`Reconstructed sentence mismatch at December 2017 question ${record.number}: ${question.script}`)
  }
}

writeExplanation(54, [
  'Đáp án 3 — 「それでも」 nghĩa là “dù vậy/tuy thế”, nối việc không thể hát một mình suốt buổi với nhận xét rằng karaoke vẫn vui như một bữa tiệc.',
  '1. そのうえ: “hơn nữa”; thêm một ý cùng chiều, không diễn tả sự tương phản với việc không hát được lâu.',
  '2. 特に: “đặc biệt”; cần nêu rõ điều gì đặc biệt, không nối hai mệnh đề ở đây.',
  '3. それでも: “dù vậy”; phù hợp với 「できません」 ở trước và 「楽しい」 ở sau.',
  '4. また: “cũng/lại”; chỉ thêm ý hoặc lặp lại, thiếu quan hệ nhượng bộ.',
  'Dịch: “Vì lúc nào chúng tôi cũng đi đông người nên tôi không thể hát một mình suốt buổi. Dù vậy, tôi vẫn nghĩ karaoke vui như một bữa tiệc.”',
  'Ghi nhớ: 「それでも」 dùng khi kết quả hoặc đánh giá sau vẫn đúng bất chấp điều vừa nêu.',
])
writeExplanation(55, [
  'Đáp án 1 — 「カラオケは人と一緒に楽しむものだと思っていたからです」 giải thích nguyên nhân của sự ngạc nhiên: người viết vốn nghĩ karaoke là hoạt động vui cùng người khác.',
  '1. 思っていたからです: “vì tôi đã nghĩ như vậy”; dạng 「からです」 trả lời trực tiếp vì sao người viết ngạc nhiên.',
  '2. 思っていたはずです: “chắc hẳn đã nghĩ”; 「はず」 là suy đoán, không nêu lý do của chính người viết.',
  '3. 思いつづけたのです: “đã tiếp tục nghĩ”; 「思いつづける」 nói suy nghĩ kéo dài, không phù hợp với nội dung và quan hệ nguyên nhân.',
  '4. 思いつづけたようです: “có vẻ đã tiếp tục nghĩ”; vừa mang suy đoán từ bên ngoài vừa không giải thích được câu 「驚きました」.',
  'Dịch: “Tôi đã rất ngạc nhiên, vì tôi vốn nghĩ karaoke là thứ người ta tận hưởng cùng với người khác.”',
  'Ghi nhớ: 「〜と思っていたからです」 = vì trước đó đã nghĩ rằng…; 「はず」 biểu thị điều được cho là chắc đúng, không phải nguyên nhân.',
])
writeExplanation(56, [
  'Đáp án 2 — 「私も一人で行ってみることにしました」: sau khi biết có thể đi một mình, người viết tự quyết định thử đi.',
  '1. 行ってみることになっています: “đã được sắp xếp/quyết định là sẽ đi thử”; 「ことになる」 thường nêu quyết định từ bên ngoài hoặc theo hoàn cảnh.',
  '2. 行ってみることにしました: “đã quyết định thử đi”; 「ことにする」 diễn tả quyết định của chính chủ thể.',
  '3. 行かせてくれたことです: “việc ai đó đã cho phép tôi đi”; câu không nói về sự cho phép của người khác.',
  '4. 行かせることができました: “đã có thể cho/bắt ai đó đi”; dạng sai khiến đổi chủ thể và ý nghĩa.',
  'Dịch: “Biết rằng đi một mình cũng được, tôi quyết định tự mình thử đi.”',
  'Ghi nhớ: 「Vことにする」 = tự mình quyết định làm; 「Vことになる」 = được quyết định/sắp xếp.',
])
writeExplanation(57, [
  'Đáp án 1 — 「受付で名前を書きました。そして、部屋に入り」: viết tên ở quầy tiếp tân rồi bước vào phòng hát.',
  '1. 部屋: “căn phòng”; danh từ mới được giới thiệu tự nhiên khi kể hành động bước vào.',
  '2. そんな部屋: “căn phòng như thế”; cần quy chiếu tới kiểu phòng vừa được mô tả, nhưng đoạn này chỉ vừa nêu quyết định đi hát một mình.',
  '3. こんな部屋: “căn phòng như thế này”; thường chỉ căn phòng trước mắt hoặc đang được nhận xét, không có dấu hiệu chỉ trỏ như vậy.',
  '4. あんな部屋: “căn phòng như thế kia”; hàm ý một căn phòng xa người nói hoặc đã được nhắc tới, không có tiền đề trong đoạn.',
  'Dịch: “Tôi hồi hộp viết tên ở quầy tiếp tân rồi bước vào phòng.”',
  'Ghi nhớ: danh từ trần 「部屋」 tự nhiên khi lần đầu giới thiệu một căn phòng trong mạch kể; các từ 「こんな・そんな・あんな」 cần ngữ cảnh chỉ định.',
])
writeExplanation(58, [
  'Đáp án 4 — 「カラオケは一人でも楽しかったです」 nghĩa là “karaoke vui ngay cả khi đi một mình”; 「でも」 diễn tả “dù là/trong trường hợp … vẫn”.',
  '1. だけ: “chỉ”; 「一人だけ」 nhấn mạnh chỉ một người, không tạo ý “dù đi một mình vẫn vui”.',
  '2. より: “hơn/so với”; cần một đối tượng so sánh rõ ràng.',
  '3. なら: “nếu là/nếu”; tạo điều kiện hoặc nêu chủ đề, không hợp với kết quả trải nghiệm đã xảy ra.',
  '4. でも: “ngay cả”; đúng với sự tương phản giữa đi một mình và cảm nhận vẫn vui.',
  'Dịch: “Karaoke vui ngay cả khi chỉ có một mình. Từ giờ có lẽ tôi sẽ đi karaoke thường xuyên hơn.”',
  'Ghi nhớ: 「一人でも楽しい」 = dù chỉ một mình vẫn vui; 「でも」 ở đây mang nghĩa nhượng bộ.',
])

fs.writeFileSync(masterPath, `${JSON.stringify(master, null, 2)}\n`)
fs.writeFileSync(sectionMasterPath, `${JSON.stringify(sectionMaster, null, 2)}\n`)
fs.writeFileSync(curatedPath, `${JSON.stringify(curated, null, 2)}\n`)
console.log(
  'Aligned both December 2017 grammar datasets with the PDF, repaired ★ reconstructions, and added complete explanations for q49–58.'
)
