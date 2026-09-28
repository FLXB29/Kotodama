import fs from 'node:fs'

const masterPath = 'data/jlpt_n3_toan_master.json'
const curatedPath = 'data/jlpt_n3_explanations_curated.json'
const exams = JSON.parse(fs.readFileSync(masterPath, 'utf8'))
const curated = JSON.parse(fs.readFileSync(curatedPath, 'utf8'))

const updates = {
  toan_q_2021_07_36: `Đáp án 3 — 「両親に買ってもらった着物で出席した」: tham dự lễ tốt nghiệp đại học trong bộ kimono bố mẹ mua cho. 「で」 chỉ phương tiện/trang phục dùng khi thực hiện hành động.
1. を: đánh dấu tân ngữ trực tiếp; câu cần nói mặc/trong bộ kimono dự lễ, không phải thực hiện động từ tác động lên kimono.
2. が: đánh dấu chủ ngữ; 「着物が出席した」 khiến kimono thành vật tham dự.
3. で: nêu cách thức/trang phục; 「着物で出席する」 = tham dự trong bộ kimono.
4. に: thường nêu đích đến/thời điểm/đối tượng; không chỉ trang phục trong cụm này.
Dịch: “Tôi đã tham dự lễ tốt nghiệp đại học trong bộ kimono mà bố mẹ mua cho.”
Ghi nhớ: 「服／制服で出席する」 = tham dự trong trang phục…; 「Nで」 nêu phương tiện/cách thức.`,

  toan_q_2021_07_37: `Đáp án 4 — 「いつのまにか5時間も経ってしまった」: chẳng biết từ lúc nào đã trôi qua tận năm tiếng. 「いつのまにか」 nói việc xảy ra mà người nói không nhận ra thời điểm.
1. そろそろ: “sắp đến lúc”; không diễn tả thời gian đã trôi qua ngoài dự tính.
2. だんだん: “dần dần”; miêu tả thay đổi từ từ, không hợp việc bất ngờ nhận ra đã năm tiếng.
3. ようやく: “cuối cùng/mãi mới”; cần quá trình chờ đợi để đạt kết quả, không phải không để ý thời gian.
4. いつのまにか: “chẳng biết từ lúc nào”; hợp với việc mải đọc sách rồi nhận ra năm tiếng đã trôi qua.
Dịch: “Tôi đang đọc sách thì chẳng biết từ lúc nào đã trôi qua tận năm tiếng.”
Ghi nhớ: 「いつのまにか」 = chẳng biết từ lúc nào; 「だんだん」 = dần dần; 「そろそろ」 = sắp đến lúc.`,

  toan_q_2021_07_38: `Đáp án 4 — 「私にとって一番大切なもの」: đối với tôi, điều quan trọng nhất hiện nay là chú chó mình nuôi. 「Nにとって」 nêu quan điểm/tiêu chuẩn đánh giá của N.
1. に対して: “đối với/hướng tới”; thường nêu hành động hoặc thái độ hướng đến đối tượng, không đặt góc nhìn cho đánh giá này.
2. 比べて: “so với”; cần đối tượng đem ra so sánh, không có trong câu.
3. おいて: 「Nにおいて」 = tại/trong lĩnh vực N; không nêu quan điểm của người nói.
4. とって: tạo mẫu 「私にとって」 = đối với tôi; đúng với lời đánh giá cá nhân “quan trọng nhất”.
Dịch: “Đối với tôi, điều quan trọng nhất hiện nay là chú chó tôi đang nuôi.”
Ghi nhớ: 「Nにとって大切／難しい」 = quan trọng/khó đối với N; 「Nに対して」 thường là hướng tới N.`,

  toan_q_2021_07_39: `Đáp án 2 — 「山下課長にしかお目にかかったことがございません」: tôi mới chỉ từng gặp trưởng phòng Yamashita thôi. 「しか〜ない」 giới hạn kinh nghiệm và đi với phủ định.
1. にだけ: “chỉ với”; trong câu đã có phủ định 「ございません」, kết hợp 「しか」 tự nhiên để nói ngoài ông Yamashita ra chưa gặp ai.
2. にしか: 「お目にかかる」 là khiêm nhường ngữ của 「会う」; 「に」 đánh dấu người gặp và 「しか〜ない」 giới hạn người đó.
3. でしか: 「で」 chỉ nơi/phương tiện; người gặp được đánh dấu bằng 「に」, không phải 「で」.
4. でだけ: cũng dùng sai trợ từ với người gặp; không tạo cấu trúc tự nhiên.
Dịch: “A: Hôm nay là lần đầu anh/chị gặp trưởng phòng Tanaka phải không? — B: Vâng. Trước đây tôi chỉ mới gặp trưởng phòng Yamashita thôi.”
Ghi nhớ: 「人にお目にかかる」 = gặp ai (khiêm nhường); 「Nにしか〜ない」 = không… ngoài N.`,

  toan_q_2021_07_40: `Đáp án 1 — 「図書館が閉まっているときでも本を返せる」: vẫn có thể trả sách ngay cả khi thư viện đóng cửa. 「〜ときでも」 nghĩa là “ngay cả vào lúc…”.
1. ときでも: “ngay cả khi”; hợp với thùng trả sách ở lối vào cho phép trả sách ngoài giờ mở cửa.
2. ままで: diễn tả trạng thái được giữ nguyên; ở đây hơi gượng vì câu cần nêu điều kiện “ngay cả lúc thư viện đóng cửa”, không phải nhấn vào việc duy trì trạng thái đóng cửa.
3. 間だから: “vì đang trong khoảng thời gian…”; cách nối này nêu nguyên nhân, trong khi câu cần ý nhượng bộ “ngay cả khi thư viện đóng cửa vẫn trả được sách”.
4. ところなら: “nếu là nơi/thời điểm…”; không nối đúng với trạng thái thư viện đóng cửa và khả năng trả sách.
Dịch: “Thư viện này có thùng nhận sách trả gần lối vào, nên ngay cả khi thư viện đóng cửa bạn vẫn có thể trả sách.”
Ghi nhớ: 「〜ときでも」 = ngay cả khi; 「図書館が閉まっている」 = thư viện đang đóng cửa.`,

  toan_q_2021_07_41: `Đáp án 3 — 「なんてきれいなんだろうか」: “sao mà đẹp đến thế nhỉ!”. 「なんて」 đứng trước tính từ để biểu lộ sự ngạc nhiên/cảm thán.
1. 何とか: “bằng cách nào đó/xoay xở”; không phải từ cảm thán đứng trước 「きれい」 trong câu này.
2. なんか: “như là/cái gì đó”; có sắc thái ví dụ hoặc xem nhẹ, không tạo câu cảm thán này.
3. なんて: “thật là/sao mà”; 「なんてきれいなんだろうか」 là lời cảm thán tự nhiên khi nhìn sao trời.
4. 何でも: “bất cứ thứ gì”; không có nghĩa cảm thán trước tính từ.
Dịch: “A: Trời quang tối nay nên có thể nhìn thấy sao rõ lắm. — B: Ồ, đúng thật. Sao mà đẹp đến thế nhỉ!”
Ghi nhớ: 「なんて＋形容詞＋んだろう（か）」 = sao mà… thế nhỉ; thường dùng để cảm thán.`,

  toan_q_2021_07_42: `Đáp án 1 — 「見に行こうかと思う」: tôi nghĩ mình sẽ đi xem. 「意向形＋かと思う」 diễn tả ý định đang cân nhắc.
1. 行こうか: thể ý chí của 「行く」 kết hợp 「かと思う」 = đang nghĩ có nên đi/định đi; hợp vì bức tranh của người quen được trưng bày.
2. 行かないか: “có nên không đi không”; phủ định ngược với ý định muốn đến xem.
3. 行くのか: “có đi hay không”; đặt câu hỏi gián tiếp, không nối tự nhiên với 「と思う」 trong ý định này.
4. 行ったか: “đã đi hay chưa”; kể/đặt câu hỏi về quá khứ, trong khi triển lãm sắp diễn ra.
Dịch: “Vì tranh của một người quen có thể được trưng bày ở triển lãm nên tôi nghĩ mình cũng sẽ đi xem.”
Ghi nhớ: 「Vようかと思う」 = đang nghĩ sẽ/có nên V; 「Vたか」 hỏi hoặc nhắc việc đã làm. 「かざれる（飾れる）」 là thể khả năng của 「飾る」, nghĩa là có thể đem trưng bày.`,

  toan_q_2021_07_43: `Đáp án 4 — 「食べ物が悪くなりやすい」: thức ăn dễ bị hỏng. 「悪くなる」 là tự trở nên xấu/hỏng; 「〜やすい」 nghĩa là dễ xảy ra.
1. なりにくい: “khó trở nên hỏng”; trái với lời cảnh báo mùa hè thức ăn dễ hỏng.
2. しやすい: 「食べ物が悪くしやすい」 thiếu tân ngữ và dùng 「する」 sai; câu cần nội động từ 「なる」.
3. しにくい: “khó làm hỏng”; cũng dùng sai 「する」 và đảo nghĩa.
4. なりやすい: 「悪くなりやすい」 = dễ bị hỏng; đúng ngữ pháp và ý cảnh báo cần chú ý vào mùa hè.
Dịch: “Mùa hè thức ăn dễ bị hỏng, nên hãy cẩn thận.”
Ghi nhớ: 「悪くなる」 = trở nên hỏng; 「Vやすい」 = dễ V; 「Vにくい」 = khó V.`,

  toan_q_2021_07_44: `Đáp án 3 — 「新しい白い靴を踏まれてしまった」: đôi giày trắng mới của tôi đã bị người đứng cạnh giẫm phải. Đây là thể bị động chịu ảnh hưởng 「Nを人にVられる」.
1. 踏んでしまった: “tôi lỡ giẫm lên”; chủ ngữ sẽ là người nói giẫm giày của người đứng cạnh, ngược với ý đôi giày của mình bị giẫm.
2. 踏んでおいた: “đã giẫm sẵn”; không diễn tả sự cố ngoài ý muốn.
3. 踏まれてしまった: bị người khác giẫm phải, và 「しまう」 thể hiện sự việc đáng tiếc; đúng với tàu dừng đột ngột và người đứng cạnh bị mất thăng bằng.
4. 踏ませておいた: “đã để/cho ai giẫm”; mang nghĩa sai khiến/chủ động sắp đặt, không phải tai nạn.
Dịch: “Tàu tôi đang đi đột ngột dừng lại, khiến người đứng cạnh giẫm phải đôi giày trắng mới của tôi.”
Ghi nhớ: 「人に足／物を踏まれる」 = bị ai giẫm lên chân/đồ của mình; 「〜てしまう」 có thể nêu sự việc đáng tiếc.`,

  toan_q_2021_07_45: `Đáp án 1 — 「誰が優勝しても不思議ではない」: ai trong số họ vô địch cũng không có gì lạ. 「疑問詞＋ても不思議ではない」 nói rằng bất kỳ kết quả nào cũng có thể xảy ra.
1. 優勝しても不思議ではない: “dù ai vô địch cũng không lạ”; hợp vì cả tám người đều từng vô địch giải quốc tế.
2. 優勝したらいい: “nếu vô địch thì tốt”; nêu mong muốn nhưng không hoàn chỉnh tự nhiên với 「誰が」 và nhận định khả năng của cả nhóm.
3. 優勝するに違いない: “chắc chắn sẽ vô địch”; 「誰が」 với kết luận khẳng định này không nêu được rằng bất kỳ ai trong tám người cũng có thể thắng.
4. 優勝するのではないだろうか: “chẳng phải sẽ vô địch sao?”; nghiêng về dự đoán một người/nhóm cụ thể và mang dạng câu hỏi tu từ, không diễn tả mọi ứng viên đều có khả năng như nhau.
Dịch: “Ngày mai giải quần vợt quốc tế bắt đầu. Cả tám người tham dự đều từng vô địch giải quốc tế, nên lần này ai thắng cũng không có gì lạ.”
Ghi nhớ: 「誰がVても不思議ではない」 = ai V cũng không có gì lạ; 「〜に違いない」 = chắc chắn/hẳn là.
Ghi chú biên tập: bản PDF in 「国際大会出の」; dữ liệu dùng 「国際大会での」 để sửa lỗi chữ in và giữ nguyên nghĩa “kinh nghiệm vô địch ở giải quốc tế”.`,

  toan_q_2021_07_46: `Đáp án 3 — 「新幹線が出発しちゃう」: tàu Shinkansen sắp sửa rời ga mất. 「しちゃう」 là khẩu ngữ của 「してしまう」, ở đây nhấn mạnh việc tàu sắp đi nếu không nhanh.
1. してる: “đang khởi hành”; nói hành động đang diễn ra, không có sắc thái sắp lỡ tàu.
2. しとく: rút gọn 「しておく」 = làm sẵn; không dùng để nói tàu sắp khởi hành.
3. しちゃう: 「出発してしまう」 rút gọn thành 「出発しちゃう」 = sẽ rời đi mất; thúc giục hai người nhanh lên.
4. しなきゃ: cách nói rút gọn của 「しなければ（ならない／いけない）」, tức “phải khởi hành”; gán nghĩa nghĩa vụ cho tàu không diễn tả hệ quả “nếu không nhanh thì tàu sẽ rời đi mất”.
Dịch: “(Ở cổng soát vé ga) Vợ: Ơ, đã 10 giờ rồi. Nếu không nhanh thì tàu Shinkansen sắp chạy mất. — Chồng: Đúng rồi. Nhanh lên.”
Ghi nhớ: 「Vちゃう」 là khẩu ngữ của 「Vてしまう」; có thể nhấn mạnh kết quả ngoài ý muốn/sắp xảy ra.`,

  toan_q_2021_07_47: `Đáp án 2 — 「おいしい食べ物をたくさんいただきました」: hôm qua tôi đã ăn rất nhiều món ngon ở nhà trưởng phòng. 「いただく」 là khiêm nhường ngữ của 「食べる／もらう」, dùng khi nói về mình với cấp trên.
1. いただいていました: “đã/đang ăn” dưới dạng tiếp diễn; câu đang cảm ơn về bữa ăn đã kết thúc nên dùng quá khứ đơn 「いただきました」.
2. いただきました: “đã ăn/được mời ăn”; cách nói khiêm nhường về việc người nói ăn món do trưởng phòng mời.
3. めしあがっていました: 「召し上がる」 là kính ngữ, nâng người được nói đến; không dùng để nâng chính người nói.
4. めしあがりました: cũng là kính ngữ “đã ăn”; sai hướng kính ngữ vì người nói đang kể về bản thân.
Dịch: “Yamada: À, trưởng phòng. Cảm ơn anh về bữa ăn hôm qua. Tôi đã được ăn rất nhiều món ngon. — Trưởng phòng: Vậy thì tốt rồi. Lần sau lại ăn ở nhà tôi nhé.”
Ghi nhớ: 「いただく」 khiêm nhường về mình; 「召し上がる」 tôn kính người nghe/người được nhắc đến.`,

  toan_q_2021_07_48: `Đáp án 2 — 「早めに家を出たほうがいいかもしれない」: có lẽ chúng ta nên rời nhà sớm hơn. 「Vたほうがいい」 đưa ra lời khuyên; 「かもしれない」 làm nhận định mềm hơn.
1. 出すつもりかもしれない: 「出す」 là ngoại động từ “đưa/lấy thứ gì ra”; 「家を出す」 không có nghĩa “rời khỏi nhà”, nên không tạo lời khuyên phù hợp.
2. 出たほうがいいかもしれない: “có lẽ nên rời đi”; phù hợp với mục tiêu đến tiệm trước khi đông khách.
3. 出てはいけなそうだ: “có vẻ không được rời nhà”; trái với kế hoạch đi ăn và không hợp lý do quán sẽ đông.
4. 出なくてもよさそうだ: “có vẻ không cần rời đi”; trái với việc muốn đến trước 11 giờ 30.
Dịch: “Vợ: Nghe nói quán ramen ngày mai đông từ khoảng 11 giờ rưỡi đấy. — Chồng: Vậy có lẽ mình nên rời nhà sớm để tới quán được sau 11 giờ một chút nhỉ. — Vợ: Ừ, mình đi sớm đi.”
Ghi nhớ: 「Vたほうがいい」 = nên V; 「かもしれない」 = có lẽ/có thể, làm lời khuyên bớt áp đặt.`,
}

const fullMock = exams.find((exam) => exam.id === 'toan-n3-202107-full')
const standaloneExams = JSON.parse(fs.readFileSync('data/jlpt_full_master.json', 'utf8'))
const standalone = standaloneExams.find((exam) => exam.id === 'cm2u2xkhj00zx134iasxlu6kb-grammar-reading')
if (!fullMock || !standalone) throw new Error('Could not find both July 2021 grammar exam views.')

const fullMockQuestions = (fullMock.parts || [])
  .filter((part) => part.title.includes('Ngữ pháp') && part.title.includes('Mondai 1'))
  .flatMap((part) => part.questions || [])
const standaloneQuestions = (standalone.parts || [])
  .filter((part) => part.title.includes('Mondai 1'))
  .flatMap((part) => part.questions || [])
const sourceFixes = {
  37: { fullMockChoice: [2, '3 ようやく'] },
  38: { standaloneChoices: [[0, 'に対して']] },
  40: {
    fullMockChoices: [
      [1, '2 ままで'],
      [2, '3 間だから'],
    ],
    standalonePrompt: ['この図書館はは', 'この図書館は'],
  },
  41: {
    fullMockChoices: [
      [0, '1 何とか'],
      [3, '4 何でも'],
    ],
    fullMockPrompt: ['きれいなんだろう。', 'きれいなんだろうか。'],
  },
  44: { prompt: ['隣に立っていた人', '隣に立っている人'] },
  42: { fullMockPrompt: ['絵がかざられるので', '絵がかざれるので'] },
  45: { prompt: ['国際大会出の', '国際大会での'] },
  46: { fullMockChoice: [3, '4 しなきゃ'] },
  47: {
    prompt: ['昨日がどうも', '昨日はどうも'],
    fullMockPrompt: ['おいしい物をたくさん', 'おいしい食べ物をたくさん'],
  },
  48: {
    fullMockChoices: [
      [0, '1 出すつもりかもしれない'],
      [3, '4 出なくてもよさそうだ'],
    ],
    standaloneChoices: [
      [0, '出すつもりかもしれない'],
      [3, '出なくてもよさそうだ'],
    ],
  },
}

const replaceOnce = (value, before, after, label) => {
  if (value.includes(before)) return value.replace(before, after)
  if (value.includes(after)) return value
  throw new Error(`${label}: expected source text ${JSON.stringify(before)} or corrected text.`)
}
const setStringChoice = (question, index, expected, label) => {
  const current = String(question.options[index] ?? '').trim()
  if (current === expected) return
  const cleaned = expected.replace(/^\s*[1-4]\s*/u, '')
  const oldChoices = {
    '3 ようやく': ['3 ようやくか'],
    '2 ままで': ['2 まで'],
    '3 間だから': ['3 間だからが'],
    '1 何とか': ['1 ときでも'],
    '4 何でも': ['4 なんでも'],
    '4 しなきゃ': ['4 しなきゃなる'],
    '1 出すつもりかもしれない': ['1 出るつもりかもしれないう'],
    '4 出なくてもよさそうだ': ['4 行出なくてもよさそうだ'],
  }
  const allowed = oldChoices[expected] || []
  if (!allowed.includes(current)) throw new Error(`${label}: unexpected option text ${JSON.stringify(current)}`)
  const choiceNumber = expected.match(/^[1-4]/u)?.[0]
  question.options[index] = `${choiceNumber} ${cleaned}`
}
const setObjectChoice = (question, index, expected, label) => {
  const current = String(question.options[index]?.text ?? '')
  if (current === expected) return
  const allowedOld = {
    出すつもりかもしれない: ['出るつもりかもしれない'],
    出なくてもよさそうだ: ['行出なくてもよさそうだ'],
    に対して: ['対して'],
  }
  if (!(allowedOld[expected] || []).includes(current))
    throw new Error(`${label}: unexpected option text ${JSON.stringify(current)}`)
  question.options[index].text = expected
}
const updateQuestion = (question, standaloneView = false) => {
  const number = Number(question.number)
  const correction = sourceFixes[number]
  if (correction?.prompt) {
    question.question = replaceOnce(question.question, ...correction.prompt, `${question.id}.question`)
    question.sentence = replaceOnce(question.sentence, ...correction.prompt, `${question.id}.sentence`)
  }
  if (standaloneView && correction?.standalonePrompt) {
    question.question = replaceOnce(question.question, ...correction.standalonePrompt, `${question.id}.question`)
    question.sentence = replaceOnce(question.sentence, ...correction.standalonePrompt, `${question.id}.sentence`)
  }
  if (!standaloneView && correction?.fullMockPrompt) {
    question.question = replaceOnce(question.question, ...correction.fullMockPrompt, `${question.id}.question`)
    question.sentence = replaceOnce(question.sentence, ...correction.fullMockPrompt, `${question.id}.sentence`)
  }
  if (!standaloneView && correction?.fullMockChoice) {
    setStringChoice(question, correction.fullMockChoice[0], correction.fullMockChoice[1], question.id)
  }
  if (!standaloneView && correction?.fullMockChoices) {
    for (const [index, expected] of correction.fullMockChoices) setStringChoice(question, index, expected, question.id)
  }
  if (standaloneView && correction?.standaloneChoices) {
    for (const [index, expected] of correction.standaloneChoices)
      setObjectChoice(question, index, expected, question.id)
  }
  const explanationId = `toan_q_2021_07_${number}`
  const explanation = updates[explanationId]
  if (!explanation) return false
  question.explanation = explanation.trim()
  if (!standaloneView) curated[question.id] = explanation.trim()
  return true
}

for (const [questions, standaloneView] of [
  [fullMockQuestions, false],
  [standaloneQuestions, true],
]) {
  if (questions.length !== 13)
    throw new Error(
      `Expected 13 grammar questions in ${standaloneView ? 'standalone' : 'full mock'}, found ${questions.length}.`
    )
  for (const question of questions) updateQuestion(question, standaloneView)
}

if (Object.keys(updates).length !== 13) throw new Error('Expected exactly 13 reviewed July 2021 explanations.')

fs.writeFileSync(masterPath, `${JSON.stringify(exams, null, 2)}\n`, 'utf8')
fs.writeFileSync('data/jlpt_full_master.json', `${JSON.stringify(standaloneExams, null, 2)}\n`, 'utf8')
fs.writeFileSync(curatedPath, `${JSON.stringify(curated, null, 2)}\n`, 'utf8')
console.log(
  'Synced 13 reviewed July 2021 grammar explanations across the full mock and standalone exam, with source-text corrections.'
)
