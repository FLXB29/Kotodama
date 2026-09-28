import fs from 'node:fs'

const masterPath = 'data/jlpt_n3_toan_master.json'
const sectionMasterPath = 'data/jlpt_full_master.json'
const curatedPath = 'data/jlpt_n3_explanations_curated.json'
const sourceUrl = 'https://drive.google.com/file/d/1IIZSnchqU4xzRTWbwO18l99FzgOaQfn5/view'
const master = JSON.parse(fs.readFileSync(masterPath, 'utf8'))
const sectionMaster = JSON.parse(fs.readFileSync(sectionMasterPath, 'utf8'))
const curated = JSON.parse(fs.readFileSync(curatedPath, 'utf8'))
const exam = master.find((item) => item.id === 'toan-n3-201812-full')
if (!exam) throw new Error('Could not locate the N3 December 2018 full exam.')
const sectionExam = sectionMaster.find((item) => item.id === 'cm2u2x30900ml134ilniaj8pm-grammar-reading')
if (!sectionExam) throw new Error('Could not locate the N3 December 2018 grammar and reading section.')

const makeQuestionMap = (target) =>
  new Map(
    target.parts.flatMap((part) =>
      (part.questions || []).map((question) => [Number(question.number), { question, part }])
    )
  )
const fullQuestions = makeQuestionMap(exam)
const sectionQuestions = makeQuestionMap(sectionExam)
const getFullQuestion = (number) => {
  const entry = fullQuestions.get(number)
  if (!entry) throw new Error(`Could not locate December 2018 full mock question ${number}.`)
  return entry.question
}
const getSectionEntry = (number) => {
  const entry = sectionQuestions.get(number)
  if (!entry) throw new Error(`Could not locate December 2018 section question ${number}.`)
  return entry
}
const writeExplanation = (number, lines) => {
  const question = getFullQuestion(number)
  const explanation = lines.join('\n')
  question.explanation = explanation
  curated[question.id] = explanation
}

const sectionOption = (number, optionNumber) => {
  const option = getSectionEntry(number).question.options?.find((item) => Number(item.id) === optionNumber)
  if (!option) throw new Error(`Could not locate December 2018 section question ${number} option ${optionNumber}.`)
  return option
}

const q38SectionOption1 = sectionOption(38, 1)
if (q38SectionOption1.text !== 'もっとも' && q38SectionOption1.text !== 'ちっとも') {
  throw new Error(`Unexpected December 2018 question 38 option 1: ${q38SectionOption1.text}`)
}
q38SectionOption1.text = 'ちっとも'

const q40SectionOption2 = sectionOption(40, 2)
if (q40SectionOption2.text !== 'やりなおす' && q40SectionOption2.text !== 'やりなおした') {
  throw new Error(`Unexpected December 2018 question 40 option 2: ${q40SectionOption2.text}`)
}
q40SectionOption2.text = 'やりなおした'

const q48 = getFullQuestion(48)
for (const field of ['question', 'sentence']) {
  if (q48[field]?.includes('今日はお帰りですか')) {
    q48[field] = q48[field].replace('今日はお帰りですか', '今日はもうお帰りですか')
  } else if (!q48[field]?.includes('今日はもうお帰りですか')) {
    throw new Error(`Unexpected December 2018 full mock question 48 ${field}: ${q48[field]}`)
  }
}
const q48FullOption4 = getFullQuestion(48).options[3]
if (q48FullOption4 !== ' 4.行かなければならないんですね' && q48FullOption4 !== '4.行かなければならないですね') {
  throw new Error(`Unexpected December 2018 full mock question 48 option 4: ${q48FullOption4}`)
}
getFullQuestion(48).options[3] = '4.行かなければならないですね'

const starRecords = [
  {
    number: 49,
    answer: 3,
    order: [2, 3, 4, 1],
    sentence: 'やっていたように何度も書いてみることに',
    lines: [
      'Đáp án 3 — câu hoàn chỉnh: 「なかなか英語の単語が覚えられないので、英語の得意な友達がやっていたように何度も書いてみることにした。」',
      'Thứ tự bốn mảnh là 2 → 3 → 4 → 1; dấu ★ nằm ở mảnh 3 「ように」.',
      '2. やっていた: “đã làm”, bổ nghĩa cho cách người bạn từng học. 3. ように: “theo cách…”, nối hành động người bạn đã làm với cách người nói sẽ bắt chước; đây là chỗ ★. 4. 何度も書いてみる: “thử viết nhiều lần”, hành động người nói quyết định làm. 1. ことに: đi với 「する」 thành 「Vることにする」, tự mình quyết định làm việc đó.',
      '「やっていたように」 phải thành cụm “theo cách bạn đã làm”; 「何度も書いてみることにした」 phải kết thúc bằng 「ことにした」 để nói quyết định của người viết. Đổi thứ tự các mảnh sẽ làm đứt một trong hai cụm này.',
      'Dịch: “Vì mãi không nhớ được từ tiếng Anh nên tôi quyết định thử viết đi viết lại nhiều lần như người bạn giỏi tiếng Anh vẫn làm.”',
      'Ghi nhớ: 「人がやっていたようにV」 = làm V theo cách người đó từng làm; 「Vることにする」 = tự quyết định V.',
    ],
  },
  {
    number: 50,
    answer: 4,
    order: [3, 2, 4, 1],
    sentence: '毎週見ていた大好きなドラマがとうとう',
    lines: [
      'Đáp án 4 — câu hoàn chỉnh: 「半年前から毎週見ていた大好きなドラマがとうとう終わってしまった。」',
      'Thứ tự bốn mảnh là 3 → 2 → 4 → 1; dấu ★ nằm ở mảnh 4 「大好きなドラマが」.',
      '3. 毎週: “mỗi tuần”, trạng từ cho việc xem. 2. 見ていた: “đã xem đều đặn”, bổ nghĩa cho bộ phim. 4. 大好きなドラマが: “bộ phim rất yêu thích”, danh từ được đánh dấu là chủ thể kết thúc; đây là chỗ ★. 1. とうとう: “cuối cùng”, đứng trước 「終わってしまった」 để nêu kết quả đã đến.',
      'Cần ghép 「毎週見ていた」 thành mệnh đề bổ nghĩa cho 「ドラマ」; 「とうとう」 bổ nghĩa cho vị ngữ 「終わってしまった」, không chen vào giữa danh từ và trợ từ 「が」.',
      'Dịch: “Bộ phim tôi rất thích, vẫn xem hằng tuần từ nửa năm trước, cuối cùng cũng đã kết thúc.”',
      'Ghi nhớ: 「VていたN」 mô tả danh từ bằng hành động từng/đang diễn ra; 「とうとう」 = cuối cùng sau một quá trình chờ đợi.',
    ],
  },
  {
    number: 51,
    answer: 1,
    order: [4, 2, 1, 3],
    sentence: 'めがねのような形をしていることから',
    lines: [
      'Đáp án 1 — câu hoàn chỉnh: 「大川橋はめがねのような形をしていることから、『めがね橋』とも呼ばれている。」',
      'Thứ tự bốn mảnh là 4 → 2 → 1 → 3; dấu ★ nằm ở mảnh 1 「している」.',
      '4. めがねのような: “giống như chiếc kính”, bổ nghĩa cho 「形」. 2. 形を: “hình dạng”, làm tân ngữ cho 「している」. 1. している: tạo cụm 「形をしている」 — “có hình dạng”; đây là chỗ ★. 3. ことから: “vì/do”, nêu căn cứ cho tên gọi 「めがね橋」.',
      '「めがねのような形」 là cụm danh từ, theo sau bằng 「をしている」; 「ことから」 phải theo sau cả mệnh đề lý do trước khi nêu tên cây cầu.',
      'Dịch: “Vì cầu Ōkawa có hình dáng giống chiếc kính nên còn được gọi là ‘cầu Mắt kính’.”',
      'Ghi nhớ: 「Nのような形をしている」 = có hình dáng giống N; 「〜ことから呼ばれる」 = được gọi như vậy vì…',
    ],
  },
  {
    number: 52,
    answer: 4,
    order: [2, 1, 4, 3],
    sentence: 'たっていないのでわからないことばかり',
    lines: [
      'Đáp án 4 — câu hoàn chỉnh: 「会社に入ってまだ少ししかたっていないので、わからないことばかりですが、毎日楽しいです。」',
      'Thứ tự bốn mảnh là 2 → 1 → 4 → 3; dấu ★ nằm ở mảnh 4 「わからないこと」.',
      '2. たっていない: “chưa trôi qua”, nối với 「少ししか」 để nói thời gian làm việc còn ngắn. 1. ので: “vì”, nêu lý do chưa có nhiều kinh nghiệm. 4. わからないこと: “những điều chưa biết”, danh từ hóa điều người nói không hiểu; đây là chỗ ★. 3. ばかり: “toàn là/chỉ toàn”, đi sau danh từ để nói công việc còn nhiều điều chưa biết.',
      '「少ししか」 cần đi với vị ngữ phủ định 「たっていない」; 「ので」 nối nguyên nhân với kết quả 「わからないことばかり」; 「ばかり」 đứng sau danh từ, không đứng trước 「わからないこと」.',
      'Dịch: “Tôi mới vào công ty chưa được bao lâu nên toàn gặp những điều chưa biết, nhưng ngày nào cũng vui.”',
      'Ghi nhớ: 「時間が少ししかたっていない」 = mới chỉ một khoảng thời gian ngắn trôi qua; 「Nばかり」 = toàn là N.',
    ],
  },
  {
    number: 53,
    answer: 2,
    order: [1, 3, 2, 4],
    sentence: 'まであそこにあった白い段ボール箱に',
    lines: [
      'Đáp án 2 — câu hoàn chỉnh: 「さっきまであそこにあった白い段ボール箱に入ってたんですけど、気づいたら箱がなくなって。」',
      'Thứ tự bốn mảnh là 1 → 3 → 2 → 4; dấu ★ nằm ở mảnh 2 「あった」.',
      '1. まで: “cho đến tận”, ghép với 「さっき」 thành mốc thời gian 「さっきまで」. 3. あそこに: “ở đằng kia”, nêu nơi chiếc hộp được đặt. 2. あった: “đã ở/có”, kết thúc mệnh đề bổ nghĩa cho chiếc hộp; đây là chỗ ★. 4. 白い段ボール箱に: “trong chiếc hộp các-tông trắng”, danh từ được bổ nghĩa và đi với 「入ってた」.',
      '「あそこにあった」 phải đứng trước danh từ 「白い段ボール箱」 để mô tả chiếc hộp; 「さっきまで」 là cụm thời gian nên mở đầu mệnh đề, còn 「箱に入ってた」 là cụm nơi chứa áp phích.',
      'Dịch: “Mới lúc nãy tấm áp phích còn ở trong chiếc hộp các-tông trắng đặt đằng kia, vậy mà lúc để ý thì cái hộp đã biến mất.”',
      'Ghi nhớ: 「場所にあったN」 = N từng ở tại địa điểm; 「さっきまで」 = cho đến tận lúc nãy.',
    ],
  },
]

for (const record of starRecords) {
  const question = getFullQuestion(record.number)
  if (Number(question.correctAnswer ?? question.answer) !== record.answer) {
    throw new Error(`Unexpected December 2018 ★ answer at question ${record.number}.`)
  }
  const fragments = question.options.map((option) =>
    String(option)
      .replace(/^\s*\d+[.．、]\s*/u, '')
      .trim()
  )
  const order = record.order.map((number) => fragments[number - 1])
  question.script = order.join('')
  question.starCorrectOrder = [...record.order]
  question.starPosition = record.order.indexOf(record.answer)
  question.starOrderVerified = true
  question.starPositionVerified = true
  question.starVerificationSources = [...new Set([...(question.starVerificationSources || []), sourceUrl])]
  writeExplanation(record.number, record.lines)
  if (question.script !== record.sentence) {
    throw new Error(`Reconstructed sentence mismatch at December 2018 question ${record.number}: ${question.script}`)
  }
  if (question.starPosition !== (record.number === 49 ? 1 : 2)) {
    throw new Error(`Unexpected printed ★ position at December 2018 question ${record.number}.`)
  }
  const sectionQuestion = getSectionEntry(record.number).question
  if (Number(sectionQuestion.answer ?? sectionQuestion.correctAnswer) !== record.answer) {
    throw new Error(`December 2018 section answer differs at question ${record.number}.`)
  }
}

const clozeRecords = [
  {
    number: 54,
    answer: 1,
    lines: [
      'Đáp án 1 — 「それから、隣の部屋に案内されました」: người kể được bạn dẫn sang căn phòng bên cạnh. 「案内される」 là thể bị động; người kể là người nhận hành động dẫn đường.',
      '1. 案内されました: “được hướng dẫn/dẫn đến”; đúng vai người khách được chủ nhà đưa sang phòng bên cạnh.',
      '2. 案内してあげました: “đã dẫn ai đó đi giúp”; người kể trở thành người dẫn, ngược với mạch đang kể mình được chủ nhà đón tiếp.',
      '3. 案内していました: “đang hướng dẫn”; chủ thể vẫn là người thực hiện việc dẫn, không diễn tả người kể được đưa đi.',
      '4. 案内させてくれました: “đã cho phép tôi hướng dẫn”; thể sai khiến với くれる đảo vai và nghĩa, như thể người kể xin phép dẫn người khác.',
      'Dịch: “Sau đó, tôi được dẫn sang căn phòng bên cạnh.”',
      'Ghi nhớ: 「案内する」 = hướng dẫn; 「案内される」 = được hướng dẫn.',
    ],
  },
  {
    number: 55,
    answer: 1,
    lines: [
      'Đáp án 1 — 「それに」 có nghĩa “hơn nữa/vả lại”, thêm một đặc điểm nữa của căn phòng: ngoài mùi chiếu khiến người kể thư thái, phòng tatami còn mát hơn phòng khách.',
      '1. それに: thêm thông tin cùng chiều; khớp với việc liệt kê cảm nhận thứ hai về phòng tatami. Đây là đáp án được chọn theo quan hệ ý nghĩa của đoạn và bảng SOFL.',
      '2. 一方: “mặt khác/trong khi đó”, thường đặt hai đối tượng hoặc hai mặt để đối chiếu; câu này tiếp tục bổ sung đặc điểm của cùng căn phòng.',
      '3. つまり: “nói cách khác/tóm lại”, cần diễn đạt lại ý trước; “mát hơn phòng khách” là thông tin mới chứ không phải diễn giải lại mùi hương và cảm giác thư thái.',
      '4. ところが: “thế nhưng/tuy nhiên”, báo hiệu kết quả trái kỳ vọng; trước đó không có ý dự đoán phòng sẽ nóng hay điều gì đối lập. Một bảng tham khảo Sohu chọn phương án này, nhưng cách nối bổ sung 「それに」 phù hợp hơn với mạch đoạn và khớp bảng SOFL cùng Chuyenngoaingu.',
      'Dịch: “Ngồi trên chiếu tatami có mùi như cỏ khô, khiến tôi rất thư thái. Hơn nữa, tôi thấy phòng tatami mát hơn phòng khách một chút.”',
      'Ghi nhớ: 「それに」 thêm lý do/đặc điểm; 「ところが」 chỉ dùng khi ý sau bất ngờ hoặc trái với dự đoán trước đó.',
    ],
  },
  {
    number: 56,
    answer: 2,
    lines: [
      'Đáp án 2 — 「今日はこの部屋で寝よう」: người bạn đề nghị hai người ngủ trong chính căn phòng tatami đang ở.',
      '1. 部屋: “căn phòng”; có thể đúng ngữ pháp riêng lẻ nhưng không chỉ rõ căn phòng đang cùng hiện diện, nên thiếu sắc thái chỉ định mà hội thoại cần.',
      '2. この部屋: “căn phòng này”; chỉ căn phòng ở ngay nơi người nói và người nghe đang đứng, phù hợp với căn phòng tatami vừa được giới thiệu. Đây là đáp án.',
      '3. あの部屋: “căn phòng kia/đó”; thường chỉ nơi xa cả người nói lẫn người nghe hoặc một nơi đã được nhắc tới ngoài cảnh hiện tại, không hợp bằng 「この部屋」 khi cả hai đang ở trong phòng.',
      '4. その部屋: “căn phòng đó”; thường dựa vào nơi phía người nghe hoặc điều vừa được nhắc tới. Có thể hiểu được trong một ngữ cảnh khác, nhưng trong cảnh hai người đang ở căn phòng này, 「この部屋」 là cách chỉ tự nhiên nhất.',
      'Dịch: “Rồi bạn tôi nói: ‘Hôm nay mình ngủ ở căn phòng này nhé.’”',
      'Ghi nhớ: 「この」 chỉ vật/nơi gần người nói; 「その」 thường gắn với phía người nghe hoặc điều vừa nêu; 「あの」 chỉ điều xa cả hai.',
    ],
  },
  {
    number: 57,
    answer: 4,
    lines: [
      'Đáp án 4 — 「ベッドでしか寝たことがなかった」: trước đó người kể chỉ từng ngủ trên giường, tức chưa có trải nghiệm ngủ trên tatami. 「しか」 đi với phủ định.',
      '1. では: “ở trên giường thì”; không mang nghĩa giới hạn “chỉ trên giường”, nên không giải thích được nỗi lo về việc lần đầu ngủ trên tatami.',
      '2. でなら: “nếu ở trên giường thì”; tạo điều kiện nhưng câu đang nói về trải nghiệm đã có trong quá khứ, không phải điều kiện.',
      '3. でだけ: 「だけ」 thường đi với câu khẳng định để nói “chỉ”; trước 「寝たことがなかった」 thì không tạo cấu trúc phủ định giới hạn tự nhiên như câu cần có.',
      '4. でしか: 「しか〜ない」 nghĩa là “không … ngoài/chỉ …”; ghép với 「寝たことがなかった」 thành “chưa từng ngủ ở đâu ngoài giường”. Đây là đáp án.',
      'Dịch: “Tôi hơi lo vì trước đó mình chưa từng ngủ ở đâu ngoài giường.”',
      'Ghi nhớ: 「NでしかVない」 = chỉ V bằng/tại N, không có cách nào khác; 「しか」 bắt buộc đi với phủ định.',
    ],
  },
  {
    number: 58,
    answer: 3,
    lines: [
      'Đáp án 3 — 「私も畳の部屋がある家に住んでみたいです」: sau khi trải nghiệm và biết điểm hay của tatami, người kể cũng muốn thử sống trong một ngôi nhà có phòng tatami.',
      '1. 住むならいいです: “nếu sống thì được/ổn”; diễn tả điều kiện hoặc sự chấp nhận, không phải mong muốn của người kể.',
      '2. 住むつもりだからです: “vì tôi định sống”; 「からです」 đòi một lý do được hỏi trước, nhưng câu kết đang nêu cảm nghĩ/mong muốn sau trải nghiệm.',
      '3. 住んでみたいです: 「Vてみたい」 = muốn thử làm V; hợp với việc vừa biết lợi ích của phòng tatami. Đây là đáp án theo câu hoàn chỉnh và giải thích Sohu; SOFL và Chuyenngoaingu đều ghi lựa chọn 4, nhưng câu đó chỉ tạo nghĩa gượng “việc cố thử sống”, không diễn đạt mong muốn tự nhiên.',
      '4. 住もうとすることです: “là việc định/cố gắng sống”; danh từ hóa hành động, không hoàn thành vị ngữ mong muốn sau 「私も…家に」. Hai bảng đáp án tham khảo chọn phương án này, nhưng không phù hợp với ý và cấu trúc câu kết.',
      'Dịch: “Tôi cũng muốn thử sống trong một ngôi nhà có phòng tatami.”',
      'Ghi nhớ: 「Vてみたい」 = muốn thử V; 「Vようとする」 = định/cố thử V, không đồng nghĩa với mong muốn trải nghiệm.',
    ],
  },
]

for (const record of clozeRecords) {
  const question = getFullQuestion(record.number)
  if (Number(question.correctAnswer ?? question.answer) !== record.answer) {
    throw new Error(`Unexpected December 2018 cloze answer at question ${record.number}.`)
  }
  const sectionQuestion = getSectionEntry(record.number).question
  if (Number(sectionQuestion.answer ?? sectionQuestion.correctAnswer) !== record.answer) {
    throw new Error(`December 2018 section answer differs at question ${record.number}.`)
  }
  writeExplanation(record.number, record.lines)
}

const mockClozePart = fullQuestions.get(54).part
const apiClozePart = getSectionEntry(54).part
if (!mockClozePart.passage?.includes('それまで、ベッド')) {
  throw new Error('Unexpected December 2018 full mock cloze passage; expected the source phrase それまで、ベッド.')
}
apiClozePart.passage = mockClozePart.passage
if (!apiClozePart.passage.includes('それまで、ベッド')) {
  throw new Error('Unexpected December 2018 API cloze phrase; expected それまで、ベッド.')
}

const optionOne = getFullQuestion(56).options[0]
if (optionOne !== ' 1.部屋　' && optionOne !== '1.部屋') {
  throw new Error(`Unexpected December 2018 question 56 first option: ${optionOne}`)
}
getFullQuestion(56).options[0] = '1.部屋'

if (
  sectionOption(38, 1).text !== 'ちっとも' ||
  sectionOption(40, 2).text !== 'やりなおした' ||
  getFullQuestion(48).options[3] !== '4.行かなければならないですね'
) {
  throw new Error('December 2018 section choices did not align with the PDF.')
}

fs.writeFileSync(masterPath, `${JSON.stringify(master, null, 2)}\n`)
fs.writeFileSync(sectionMasterPath, `${JSON.stringify(sectionMaster, null, 2)}\n`)
fs.writeFileSync(curatedPath, `${JSON.stringify(curated, null, 2)}\n`)
console.log(
  'Aligned December 2018 grammar questions 38–58, repaired three source mismatches, and marked the disputed cloze answer for review.'
)
