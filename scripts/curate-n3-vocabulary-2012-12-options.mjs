import fs from 'node:fs'
import path from 'node:path'

const masterPath = path.resolve('data/jlpt_n3_toan_master.json')
const curatedPath = path.resolve('data/jlpt_n3_explanations_curated.json')
const exams = JSON.parse(fs.readFileSync(masterPath, 'utf8'))
const curated = JSON.parse(fs.readFileSync(curatedPath, 'utf8'))
const updates = {
  toan_q_2012_12_13: {
    answer: 4,
    includes: 'リボン',
    explanation: `Đáp án 4 — 「結ぶ」（むすぶ）là buộc/thắt; 「リボンを結ぶ」 là thắt nơ.
1. 組ぶ（くむ）: ghép hoặc đan các vật lại; không phải cách viết của むすぶ.
2. 絡ぶ: chữ 絡 thường đọc là からむ và chỉ sự vướng/quấn; 「絡ぶ」 không viết động từ むすぶ.
3. 給ぶ: không phải cách viết của むすぶ; 給 thường liên quan đến cấp/phát hoặc ban cho trong từ ghép/cách dùng khác.
4. 結ぶ（むすぶ）: buộc/thắt; đúng trong 「リボンを結ぶ」.
Dịch: “Thắt nơ ruy băng cho đẹp là việc khó.” Ghi nhớ: 結ぶ = buộc/thắt; 組む = ghép/đan; 絡む = vướng/quấn.`,
  },
  toan_q_2012_12_16: {
    answer: 3,
    includes: '皮を',
    explanation: `Đáp án 3 — 「皮をむく」nghĩa là gọt/bóc vỏ; 「皮をむいたりんご」là quả táo đã gọt vỏ.
1. 折って（おって）: bẻ/gập; không phải bóc vỏ.
2. 離して（はなして）: tách/để rời ra; không diễn tả gọt vỏ táo.
3. むいて（剥いて）: gọt/bóc lớp vỏ; đúng với 「皮」.
4. やぶって（破って）: xé/rách; không dùng cho việc gọt vỏ quả.
Dịch: “Tôi đã ăn quả táo sau khi gọt vỏ.” Ghi nhớ: 「皮をむく」= gọt vỏ; 「紙を破る」= xé giấy.`,
  },
  toan_q_2012_12_17: {
    answer: 3,
    includes: '花が',
    explanation: `Đáp án 3 — Trong ngữ cảnh quên tưới nước, 「花が枯れる」là hoa bị héo/chết khô.
1. 壊れる（こわれる）: hỏng/vỡ, thường dùng cho đồ vật hoặc máy móc.
2. 焦げる（こげる）: bị cháy xém do nhiệt, thường dùng cho thức ăn hoặc bề mặt.
3. 枯れる（かれる）: cây/hoa héo hoặc khô chết vì thiếu nước; đúng ngữ cảnh.
4. 溶ける（とける）: tan/chảy, như tuyết hoặc đường; không diễn tả hoa héo.
Dịch: “Vì quên tưới nước nên hoa đã héo mất.” Ghi nhớ: 花が枯れる = hoa héo; 水が涸れる = nước cạn.`,
  },
  toan_q_2012_12_19: {
    answer: 4,
    includes: 'コンサート',
    explanation: `Đáp án 4 — 「がっかりする」là thất vọng, hụt hẫng; buổi hòa nhạc mong chờ bị hủy nên cảm xúc này phù hợp.
1. はらはらする: thấp thỏm/lo lắng khi chờ xem chuyện gì xảy ra.
2. うっかりする: sơ ý, đãng trí; thường nói về một lỗi hoặc việc quên do bất cẩn.
3. どきどきする: tim đập thình thịch vì hồi hộp hoặc phấn khích.
4. がっかりする: thất vọng vì điều mong đợi không thành; đúng.
Dịch: “Buổi hòa nhạc tôi mong chờ bị hủy nên tôi rất thất vọng.” Ghi nhớ: がっかり = thất vọng; どきどき = hồi hộp.`,
  },
  toan_q_2012_12_21: {
    answer: 1,
    includes: '昔の写真',
    explanation: `Đáp án 1 — 「懐かしい」（なつかしい）diễn tả nỗi nhớ bồi hồi khi gặp lại điều thân thuộc trong quá khứ.
1. なつかしく（懐かしく）: cảm thấy hoài niệm; nhìn ảnh cũ và nhớ thời thơ ấu ở công viên, đúng.
2. うらやましく（羨ましく）: cảm thấy ghen tị/thèm muốn điều người khác có; không phải cảm giác nhớ kỷ niệm của chính mình.
3. くやしく（悔しく）: ấm ức/tiếc nuối vì thất bại hoặc việc không như ý.
4. はずかしく（恥ずかしく）: xấu hổ/ngượng ngùng; không hợp với hồi tưởng vui về tuổi thơ.
Dịch: “Nhìn ảnh cũ, tôi nhớ lại: ‘Hồi nhỏ mình thường chơi ở công viên này nhỉ’, rồi cảm thấy bồi hồi.” Ghi nhớ: 懐かしい = hoài niệm; 羨ましい = ghen tị; 悔しい = ấm ức; 恥ずかしい = xấu hổ.`,
  },
  toan_q_2012_12_23: {
    answer: 1,
    includes: '何度もことわって',
    explanation: `Đáp án 1 — 「しつこく頼む」là nài nỉ dai dẳng, cứ tiếp tục yêu cầu dù người kia đã từ chối.
1. しつこく: dai dẳng, bám riết; khớp với 「何度もことわっているのに」.
2. きびしく: nghiêm khắc/khắt khe; mô tả cách nói hoặc tiêu chuẩn, không nhấn vào việc cứ lặp lại lời yêu cầu.
3. こまかく: chi tiết/nhỏ nhặt; không diễn tả sự nài nỉ liên tục.
4. くわしく: cụ thể, chi tiết; nói về mức độ thông tin, không phải việc tiếp tục nài xin.
Dịch: “Dù tôi đã từ chối nhiều lần, anh ấy vẫn cứ nài nỉ nên tôi rất khó xử.” Ghi nhớ: しつこく頼む = nài nỉ dai dẳng; くわしく説明する = giải thích chi tiết.`,
  },
  toan_q_2012_12_25: {
    answer: 2,
    includes: '手袋が',
    explanation: `Đáp án 2 — 「片方」（かたほう）là một bên/một chiếc trong một đôi. Tìm mãi mà chỉ thấy một chiếc găng tay.
1. 半々（はんはん）: chia thành hai phần bằng nhau; không có nghĩa là một chiếc trong đôi.
2. 片方（かたほう）: một trong hai bên hoặc một trong một cặp; đúng với một chiếc găng tay.
3. 反対（はんたい）: phía đối diện hoặc điều trái ngược; không có nghĩa là một chiếc.
4. 部分（ぶぶん）: một phần/bộ phận của vật; không chỉ một bên của cặp.
Dịch: “Dù tìm bao nhiêu, tôi cũng chỉ tìm thấy một chiếc găng tay.” Ghi nhớ: 片方 = một bên/một chiếc trong đôi; 半分 = một nửa.`,
  },
}

const questions = new Map(
  exams.flatMap((exam) => exam.parts.flatMap((part) => part.questions)).map((question) => [question.id, question]),
)
for (const [id, update] of Object.entries(updates)) {
  const question = questions.get(id)
  if (!question) throw new Error(`Missing question ${id}`)
  if (Number(question.correctAnswer ?? question.answer) !== update.answer) {
    throw new Error(`Unexpected answer key for ${id}; refusing to change it`)
  }
  if (!String(question.question || '').includes(update.includes)) {
    throw new Error(`Unexpected question text for ${id}; refusing to overwrite its explanation`)
  }
  question.explanation = update.explanation
  curated[id] = update.explanation
}

fs.writeFileSync(masterPath, `${JSON.stringify(exams, null, 2)}\n`, 'utf8')
fs.writeFileSync(curatedPath, `${JSON.stringify(curated, null, 2)}\n`, 'utf8')
console.log(`Curated ${Object.keys(updates).length} vocabulary questions for 2012/12; answer keys unchanged.`)
