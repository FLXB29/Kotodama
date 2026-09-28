import fs from 'node:fs'
import path from 'node:path'

const root = path.resolve('.')
const masterPath = path.join(root, 'data/jlpt_n3_toan_master.json')
const curatedPath = path.join(root, 'data/jlpt_n3_explanations_curated.json')
const reviewPath = path.join(root, 'reports/n3-quality-audit/vocabulary-source-2014-07-m1-reviews.json')
const supplementalReviewPath = path.join(root, 'reports/n3-quality-audit/vocabulary-source-2014-07-m1-q2-14-review.json')
const exams = JSON.parse(fs.readFileSync(masterPath, 'utf8'))
const curated = JSON.parse(fs.readFileSync(curatedPath, 'utf8'))
const review = JSON.parse(fs.readFileSync(reviewPath, 'utf8'))
const supplementalReview = JSON.parse(fs.readFileSync(supplementalReviewPath, 'utf8'))
const exam = exams.find((item) => item.id === 'toan-n3-201407-full')
if (!exam) throw new Error('Missing JLPT N3 07/2014 full exam')
const questions = new Map(exam.parts.flatMap((part) => part.questions).map((question) => [question.id, question]))
const sourceRefs = [review.sources.questionSourceUrl, review.sources.answerKeySource]

const explanations = {
  toan_q_2014_07_6: `Đáp án 1 — PDF gạch dưới 「割れて」, đọc là 「われて」; 「いる」 đứng ngoài phần được hỏi. 「花瓶が割れている」 nghĩa là “Bình hoa đang bị vỡ”.

1. われて: cách đọc đúng của 「割れて」 (dạng て của 割れる, bị vỡ).
2. よごれて: đọc là 「汚れて」, “bị bẩn”; là một động từ khác.
3. たおれて: đọc là 「倒れて」, “bị đổ/ngã”; không phải cách đọc của 割れる.
4. ぬれて: đọc là 「濡れて」, “bị ướt”; cũng là từ khác.

Ghi nhớ: 花瓶が割れる = bình hoa bị vỡ; 汚れる = bị bẩn; 倒れる = bị đổ; 濡れる = bị ướt.`,
  toan_q_2014_07_15: `Đáp án 1 — 「分ける」（わける） là chia/phân chia. Có sáu chiếc bánh cho ba người; chia đều thì mỗi người được hai chiếc.

1. 分ける（わける）: chia ra; 「3人で分ける」 là chia cho ba người, khớp với kết quả mỗi người hai cái.
2. 離す（はなす）: tách ra/để xa nhau; không diễn tả việc chia đều một số bánh cho từng người.
3. 引く（ひく）: trừ/kéo; không thể hiện hành động chia sáu cái cho ba người.
4. 破く（やぶく）: xé rách; không phù hợp với việc chia bánh thành phần cho mỗi người.

Dịch: “Vì có sáu chiếc bánh nên nếu chia cho ba người thì mỗi người được hai chiếc.”`,
  toan_q_2014_07_16: `Đáp án 2 — 「お祝い」（おいわい） là lời/quà chúc mừng nhân một dịp vui. Bạn của người nói vừa có em bé nên người nói muốn tặng quà mừng.

1. お願い（おねがい）: lời nhờ/yêu cầu; không phải món quà chúc mừng.
2. お祝い（おいわい）: lời chúc hoặc quà mừng; hợp với việc bạn vừa sinh con.
3. お代わり（おかわり）: phần ăn/đồ uống thêm; không liên quan đến quà tặng.
4. お見舞い（おみまい）: thăm người ốm hoặc quà thăm bệnh; dùng khi có bệnh/tai nạn, không phải dịp sinh con.

Dịch: “Bạn tôi vừa sinh con nên tôi muốn tặng bạn ấy món quà chúc mừng.”`,
  toan_q_2014_07_17: `Đáp án 1 — 「方法」（ほうほう） là phương pháp/cách làm. 「原因を調べる方法はありませんか」 hỏi có cách nào tự tìm nguyên nhân máy tính trục trặc không.

1. 方法（ほうほう）: phương pháp; kết hợp tự nhiên với 「原因を調べる」.
2. 都合（つごう）: sự thuận tiện/điều kiện; 「都合はありませんか」 không có nghĩa “có cách nào không?”.
3. 規則（きそく）: quy tắc; không hỏi về quy định mà hỏi cách tự kiểm tra.
4. 計画（けいかく）: kế hoạch; không hợp với cấu trúc hỏi cách làm cụ thể 「方法」.

Dịch: “Máy tính của tôi hoạt động không ổn; có cách nào tự tìm nguyên nhân không?”`,
  toan_q_2014_07_18: `Đáp án 3 — 「積極的」（せっきょくてき） nghĩa là chủ động, tích cực. 「何でも自分からやってみようとする」 mô tả người sẵn sàng tự mình thử làm mọi việc, nên 「積極的な人」 là cụm phù hợp.

1. 感情的（かんじょうてき）: thiên về cảm xúc/dễ bị cảm xúc chi phối; không có nghĩa là chủ động thử làm.
2. 効果的（こうかてき）: có hiệu quả; thường mô tả cách làm, biện pháp hoặc tác động, không miêu tả tính cách trong câu này. PDF ghi 「効果的」, không có な trong lựa chọn.
3. 積極的（せっきょくてき）: tích cực, chủ động; khớp với việc tự mình bắt tay thử làm.
4. 具体的（ぐたいてき）: cụ thể; thường bổ nghĩa cho kế hoạch, ví dụ hoặc cách giải thích, không có nghĩa “chủ động”.

Dịch: “Anh Tanaka là người chủ động, việc gì cũng muốn tự mình thử làm.”`,
  toan_q_2014_07_19: `Đáp án 2 — 「資源」（しげん） là tài nguyên. Dầu mỏ và vàng được nêu làm ví dụ về tài nguyên thiên nhiên, nên 「石油や金などの資源」 là kết hợp đúng.

1. 環境（かんきょう）: môi trường/hoàn cảnh; không gọi dầu mỏ và vàng là “môi trường”.
2. 資源（しげん）: tài nguyên; phù hợp với dầu mỏ và vàng.
3. 基礎（きそ）: nền tảng/cơ sở; không phải vật liệu hay nguồn tài nguyên được khai thác.
4. 栄養（えいよう）: dinh dưỡng; nói về chất nuôi cơ thể, không phải dầu mỏ hay vàng.

Dịch: “Nhật Bản không có nhiều tài nguyên như dầu mỏ và vàng.”`,
  toan_q_2014_07_20: `Đáp án 3 — 「印象を受ける」 là có/nhận được một ấn tượng. Khi mới gặp Mori, người nói cảm thấy cô ấy là người trầm tính.

1. 感覚（かんかく）: cảm giác/giác quan; 「おとなしい人だという感覚を受ける」 không phải cách kết hợp tự nhiên ở đây.
2. 意識（いしき）: ý thức/nhận thức; không dùng để gọi nhận xét ban đầu về tính cách người khác.
3. 印象（いんしょう）: ấn tượng; kết hợp cố định 「印象を受ける」 và khớp với lần đầu gặp.
4. 気分（きぶん）: tâm trạng; là trạng thái cảm xúc của bản thân, không phải nhận xét về người vừa gặp.

Dịch: “Lần đầu gặp cô Mori, tôi có ấn tượng rằng cô ấy là người trầm tính.”`,
  toan_q_2014_07_21: `Đáp án 3 — 「我慢する」（がまんする） là chịu đựng. Răng đau đến mức không thể chịu được nữa nên người nói đã đi nha sĩ vào sáng nay.

1. 遠慮（えんりょ）: giữ ý/ngại làm phiền; không phải thứ người nói không thể làm vì đau răng.
2. 努力（どりょく）: nỗ lực/cố gắng; 「努力できなくなった」 không khớp với lý do đau răng trong câu.
3. 我慢（がまん）: chịu đựng; 「歯の痛みを我慢できない」 là không thể chịu cơn đau răng.
4. 心配（しんぱい）: lo lắng; 「心配できない」 không có nghĩa là không chịu nổi cơn đau.

Dịch: “Từ tối qua răng tôi đau đến mức không thể chịu nổi, nên sáng nay tôi đã đi nha sĩ.”`,
  toan_q_2014_07_22: `Đáp án 4 — 「旅行の記念に」 nghĩa là để làm kỷ niệm cho chuyến đi. Bưu thiếp được mua như một vật lưu niệm.

1. 満足（まんぞく）: sự hài lòng; 「旅行の満足に買う」 không phải cách diễn đạt tự nhiên.
2. 感激（かんげき）: sự xúc động/cảm kích; không diễn đạt mục đích mua bưu thiếp.
3. 経験（けいけん）: kinh nghiệm/trải nghiệm; có thể nói về chuyến đi, nhưng 「旅行の経験に買う」 không đúng kết hợp.
4. 記念（きねん）: kỷ niệm/vật ghi nhớ; 「旅行の記念に」 là kết hợp đúng.

Dịch: “Tôi đã mua một tấm bưu thiếp làm kỷ niệm chuyến đi.”`,
  toan_q_2014_07_23: `Đáp án 3 — 「使用料」（しようりょう） là phí sử dụng. 「駐車場の使用料が高くなった」 nghĩa là phí sử dụng bãi đỗ xe đã tăng.

1. 金（きん／かね）: vàng hoặc tiền; 「使用金」 không phải danh từ chỉ phí sử dụng trong câu này.
2. 値（ね／あたい）: giá trị/giá; 「使用値」 không phải cách ghép thông dụng để gọi khoản phí.
3. 料（りょう）: phí/tiền dịch vụ; tạo thành từ chuẩn 「使用料」.
4. 賃（ちん）: tiền công/tiền thuê hoặc cước trong một số từ ghép; 「使用賃」 không phải từ chuẩn ở đây.

Dịch: “Từ tháng này, phí sử dụng bãi đỗ xe đã tăng.”`,
  toan_q_2014_07_24: `Đáp án 4 — 「飽きる」（あきる） là chán vì đã làm hoặc trải nghiệm nhiều lần. Ban đầu trò chơi thú vị, nhưng chơi đi chơi lại khiến người nói chán.

1. きらって（嫌って）: ghét/không ưa; không diễn tả việc mất hứng thú do chơi lặp lại.
2. あきらめて（諦めて）: từ bỏ; câu nói về chán trò chơi, không phải quyết định từ bỏ mục tiêu.
3. こわがって（怖がって）: sợ hãi; không liên quan đến việc trò chơi đã chơi nhiều lần.
4. あきて（飽きて）: chán/ngán; 「何度もやったので飽きてしまった」 là kết hợp tự nhiên.

Dịch: “Trò chơi này lúc đầu tôi thấy thú vị, nhưng chơi nhiều lần nên giờ chán mất rồi.”`,
  toan_q_2014_07_25: `Đáp án 4 — 「パンフレット」 là tập/tờ giới thiệu sản phẩm hoặc chương trình. Công ty du lịch thường bày nhiều tài liệu giới thiệu các chuyến đi nước ngoài.

1. アナウンス: thông báo, thường bằng lời nói hoặc qua loa; không phải tài liệu đặt thành chồng trên quầy.
2. コマーシャル: quảng cáo thương mại, thường là quảng cáo phát sóng; không phải tờ giới thiệu tour.
3. サンプル: mẫu hàng/sản phẩm mẫu; không phù hợp với nhiều tài liệu về du lịch nước ngoài.
4. パンフレット: tờ/tập giới thiệu; đúng với tài liệu khách có thể xem tại công ty du lịch.

Dịch: “Khi đến công ty du lịch, tôi thấy có rất nhiều tờ giới thiệu về các chuyến du lịch nước ngoài.”`,
  toan_q_2014_07_26: `Đáp án 4 — 「さっき」 nghĩa là vừa nãy/lúc nãy, gần với 「少し前に」 (một lúc trước). Câu cho biết ông Yamaguchi vừa mới về.

1. すぐに: ngay lập tức/sắp sửa; nhấn vào thời điểm ngay sau hiện tại, không phải việc đã xảy ra một lúc trước.
2. ずっと前に: từ rất lâu trước đây; xa hơn nhiều so với さっき.
3. やっと: cuối cùng thì/sau nhiều khó khăn; diễn tả kết quả chờ đợi, không chỉ thời điểm.
4. 少し前に: một lúc trước; gần nghĩa nhất với さっき.

Dịch: “Nếu hỏi anh Yamaguchi thì anh ấy vừa về lúc nãy rồi.”`,
  toan_q_2014_07_27: `Đáp án 3 — 「おかしな」 ở đây nghĩa là lạ/kỳ quặc và gần nghĩa với 「へんな」. Người nói nghe thấy âm thanh lạ từ phòng bên cạnh.

1. いろいろな: nhiều loại/đủ thứ; nói về sự đa dạng, không phải tính chất kỳ lạ.
2. にぎやかな: náo nhiệt/ồn vui; mô tả không khí có nhiều hoạt động, không đồng nghĩa với “lạ”.
3. へんな: kỳ lạ; đồng nghĩa phù hợp với おかしな trong câu.
4. 大きな（おおきな）: to/lớn; chỉ kích thước hoặc mức độ, không chỉ sự kỳ quặc.

Dịch: “Tôi nghe thấy một âm thanh kỳ lạ từ phòng bên cạnh.”`,
  toan_q_2014_07_28: `Đáp án 1 — 「時間がたつ」 là thời gian trôi qua; 「過ぎる」 có nghĩa gần nhất trong các lựa chọn. Từ thời điểm đó đến nay đã khoảng một tuần.

1. 過ぎました（すぎました）: đã trôi qua; gần nghĩa với 1週間たちました.
2. かかりました: đã mất/tốn (một khoảng thời gian để làm gì); câu không nói một việc cần một tuần để hoàn thành.
3. 待ちました（まちました）: đã chờ; không mang nghĩa thời gian tự trôi qua.
4. 続けました（つづけました）: đã tiếp tục; cần một hoạt động được tiếp diễn, không thay thế たつ.

Dịch: “Từ lúc đó đến nay đã khoảng một tuần trôi qua.”`,
  toan_q_2014_07_29: `Đáp án 2 — 「あわてて」 là cuống quýt/vội vàng vì bất ngờ, lo lắng hoặc bị thúc ép. Trong các lựa chọn, 「急いだようすで」 diễn tả gần nhất trạng thái vội vã khi rời đi.

1. 困ったようすで: trông có vẻ gặp khó khăn/bối rối; không nhất thiết có hành động vội.
2. 急いだようすで: trông có vẻ vội; gần nghĩa với あわてて出ていく.
3. 疲れたようすで: trông có vẻ mệt; là trạng thái khác.
4. 怒ったようすで: trông có vẻ tức giận; cũng không đồng nghĩa với cuống quýt.

Dịch: “Nghe nói anh Yamamoto đã cuống cuồng đi ra ngoài.”`,
  toan_q_2014_07_30: `Đáp án 1 — 「カーブしている」 nghĩa là cong/uốn khúc; 「曲がっている」 là cách diễn đạt gần nghĩa nhất. Vì đường cong nên người nói nhắc phải cẩn thận.

1. 曲がっている（まがっている）: đang cong/ngoặt; phù hợp với カーブしている.
2. 坂になっている（さかになっている）: là đường dốc; mô tả độ nghiêng chứ không phải khúc cua.
3. 暗くなっている（くらくなっている）: đã tối; không mô tả hình dạng đường.
4. 狭くなっている（せまくなっている）: đã hẹp lại; khác với đường cong.

Dịch: “Đường đang uốn cong nên xin hãy cẩn thận.”`,
}

function update(id, explanation) {
  const question = questions.get(id)
  if (!question) throw new Error(`Missing source-reviewed question ${id}`)
  question.explanation = explanation
  question.sourceVerificationStatus = 'verified'
  question.sourceVerificationSources = sourceRefs
  curated[id] = explanation
  return question
}

for (const [id, explanation] of Object.entries(explanations)) update(id, explanation)

const q6 = questions.get('toan_q_2014_07_6')
q6.options = ['1.われて', '2.よごれて', '3.たおれて', '4.ぬれて']
q6.question = q6.question.replace('<u>割れている</u>', '<u>割れて</u>いる')
if (q6.sentence) q6.sentence = q6.sentence.replace('<u>割れている</u>', '<u>割れて</u>いる')

const q18 = questions.get('toan_q_2014_07_18')
q18.options = ['1.感情的', '2.効果的', '3.積極的', '4.具体的']
q18.question = q18.question.replace('する ( ) なんだ。', 'する ( ) な人だ。')
if (q18.sentence) q18.sentence = q18.sentence.replace('する ( ) なんだ。', 'する ( ) な人だ。')

const q35 = questions.get('toan_q_2014_07_35')
q35.options[0] = q35.options[0].replace('このテレビは最近', 'このテレビが最近')
q35.explanation = `Đáp án 3 — 「期限」（きげん） là thời hạn cuối được quy định. Ở câu 3, phải chuyển tiền trước hạn thì đơn hàng mới không bị hủy, nên 「指定の期限までに」 dùng đúng.

1. 「このテレビが最近音が出ないときがあるので、そろそろ期限だと思う」: “Chiếc TV này gần đây thỉnh thoảng không phát ra tiếng, nên tôi nghĩ sắp đến hạn.” Nói về tuổi thọ/đã đến lúc thay một thiết bị thì dùng 「寿命」, không dùng 期限.
2. 「新幹線は期限より10分遅れて出発した」: “Tàu khởi hành muộn hơn hạn 10 phút.” Khi so với giờ chạy dự kiến, dùng 「予定時刻より10分遅れて」; 期限 là hạn chót để hoàn thành việc gì.
3. 「指定の期限までに代金の振り込みがない場合…」: nếu không chuyển tiền trước hạn đã chỉ định thì đơn hàng bị hủy. Đây là cách dùng đúng của 期限.
4. 「期限になっても誰も来ない」: “Dù đã đến hạn mà chẳng ai đến.” Với giờ hẹn, nói 「約束の時間になっても」.

Dịch câu 3: “Nếu không chuyển khoản thanh toán trước hạn được chỉ định, đơn hàng sẽ bị hủy.” Ghi nhớ: 期限 là hạn cuối để nộp/trả/hoàn tất; 寿命 là tuổi thọ; lịch tàu và giờ hẹn dùng 予定時刻・約束の時間.`

const contextualGlossFixes = [
  {
    id: 'toan_q_2014_07_2',
    previous: 'Từ được hỏi (nghĩa theo ngữ cảnh): 「覚える」（おぼえる）: cảm thấy；học.',
    replacement:
      'Từ trọng tâm (nghĩa trong câu): 「覚える」（おぼえる） = nhớ, ghi nhớ; ở đây là nhớ địa chỉ email. Từ này cũng có thể mang nghĩa “học/thuộc” hoặc “cảm nhận” trong ngữ cảnh khác, nhưng không phải nghĩa của câu này.'
  },
  {
    id: 'toan_q_2014_07_5',
    previous: 'Từ được hỏi (nghĩa theo ngữ cảnh): 「大会」（たいかい）: đại hội.',
    replacement:
      'Từ trọng tâm (nghĩa theo ngữ cảnh): 「大会」（たいかい） = cuộc thi/giải đấu hoặc sự kiện quy mô lớn; ở đây là giải thể thao.'
  },
  {
    id: 'toan_q_2014_07_7',
    previous: 'Từ được hỏi (nghĩa theo ngữ cảnh): 「集中」（しゅうちゅう）: tập trung；trong văn tập.',
    replacement:
      'Từ trọng tâm (nghĩa theo ngữ cảnh): 「集中」（しゅうちゅう） = tập trung, dồn sự chú ý hoặc sức lực vào một việc. 「仕事に集中する」 là tập trung làm việc.'
  }
]

for (const { id, previous, replacement } of contextualGlossFixes) {
  const question = questions.get(id)
  if (question?.explanation?.includes(replacement)) continue
  if (!question?.explanation?.includes(previous)) {
    throw new Error(`Expected glossary text is missing for ${id}`)
  }
  question.explanation = question.explanation.replace(previous, replacement)
  curated[id] = question.explanation
}

for (let number = 31; number <= 35; number += 1) {
  const question = questions.get(`toan_q_2014_07_${number}`)
  question.options = question.options.map((option) => {
    const trimmed = option.trimEnd()
    return /。$/u.test(trimmed) ? trimmed : `${trimmed}。`
  })
  question.sourceVerificationStatus = 'verified'
  question.sourceVerificationSources = sourceRefs
  curated[question.id] = question.explanation
}

for (const item of review.questions) {
  const question = questions.get(item.questionId)
  if (!question) throw new Error(`Missing reviewed question ${item.questionId}`)
  if (question.answer !== item.answerKeyAnswer) {
    throw new Error(
      `App key ${question.answer} differs from answer-key PDF ${item.answerKeyAnswer} for ${item.questionId}`
    )
  }
}

const normalize = (value) =>
  String(value || '')
    .replace(/<[^>]*>/gu, '')
    .normalize('NFKC')
    .replace(/\s+/gu, '')

for (const item of supplementalReview.questions) {
  const question = questions.get(item.questionId)
  if (!question) throw new Error(`Missing supplemental source-reviewed question ${item.questionId}`)
  const prompt = normalize(question.question).replace(/^\[\d+\]/u, '')
  assertSourcePrompt(prompt, item.sourcePrompt, item.questionId)
  const choices = question.options.map((option) => normalize(option).replace(/^[1-4][.．、]?/u, ''))
  const sourceChoices = item.sourceOptions.map(normalize)
  if (JSON.stringify(choices) !== JSON.stringify(sourceChoices)) {
    throw new Error(`Source choices differ for ${item.questionId}: ${JSON.stringify(choices)}`)
  }
  if (question.answer !== item.answerKeyAnswer) {
    throw new Error(`App key ${question.answer} differs from answer-key PDF ${item.answerKeyAnswer} for ${item.questionId}`)
  }
  question.sourceVerificationStatus = 'verified'
  question.sourceVerificationSources = [supplementalReview.sources.questionSourceUrl, supplementalReview.sources.answerKeySource]
}

function assertSourcePrompt(prompt, expected, questionId) {
  if (!prompt.includes(normalize(expected))) {
    throw new Error(`Source prompt differs for ${questionId}`)
  }
}

fs.writeFileSync(curatedPath, `${JSON.stringify(curated, null, 2)}\n`, 'utf8')
fs.writeFileSync(masterPath, `${JSON.stringify(exams, null, 2)}\n`, 'utf8')
console.log(
  `Curated source-backed explanations/transcriptions for ${Object.keys(explanations).length} vocabulary questions; verified all ${review.questions.length} answer keys.`
)
