import fs from 'node:fs'

const masterPath = 'data/jlpt_n3_toan_master.json'
const curatedPath = 'data/jlpt_n3_explanations_curated.json'
const exams = JSON.parse(fs.readFileSync(masterPath, 'utf8'))
const curated = JSON.parse(fs.readFileSync(curatedPath, 'utf8'))

const updates = {
  toan_q_2017_12_10: `Đáp án 3 — 「飛んだ」（とんだ）là “đã bay”. 「ボールが遠くまで飛んだ」 nghĩa là quả bóng bay xa; 飛ぶ dùng cho vật bay trong không trung.
1. 投んだ: 投 có cách đọc 投げる（なげる, ném）, nhưng 「投んだ」không phải cách viết đúng của とんだ.
2. 打んだ: 打つ（うつ, đánh/đập）không tạo thành dạng 「打んだ」; câu hỏi yêu cầu chữ viết cho とんだ.
3. 飛んだ: 飛ぶ chia quá khứ thành 飛んだ; đúng cả cách đọc lẫn nghĩa “bay”.
4. 転んだ: 転ぶ（ころぶ）là ngã/lăn; 「ころんだ」không đọc là とんだ và không hợp với quả bóng bay xa.
Dịch: “Quả bóng đã bay xa.” Ghi nhớ: 飛ぶ（とぶ）bay; 投げる（なげる）ném; 転ぶ（ころぶ）ngã.`,
  toan_q_2016_12_12: `Đáp án 2 — 「腕を組む」（うでをくむ）nghĩa là khoanh tay hoặc đan hai tay lại. Câu mô tả người cha đang suy nghĩ với hai tay khoanh trước ngực.
1. 接んで: 接ぐ（つぐ）là nối/gắn; 「接んで」không phải cách viết đúng của くんで.
2. 組んで: 組む（くむ）là kết hợp, đan hoặc khoanh; 腕を組む là cụm dùng tự nhiên cho tư thế khoanh tay.
3. 折んで: 折る（おる）là gấp/bẻ; 「折んで」không phải cách chia đúng, và không tạo cụm 腕を組む.
4. 結んで: 結ぶ（むすぶ）là buộc/thắt nút; thường nói 髪を結ぶ hoặc ひもを結ぶ, không nói 腕を結ぶ trong nghĩa khoanh tay.
Dịch: “Bố khoanh tay và đang suy nghĩ điều gì đó.” Ghi nhớ: 腕を組む = khoanh tay; 腕を伸ばす = duỗi tay.`,
  toan_q_2013_12_11: `Đáp án 4 — 「包む」（つつむ）nghĩa là gói/bọc một vật. 「すぐに包んでください」 là lời nhờ gói món đồ ngay.
1. 呼んで（よんで）: 呼ぶ là gọi người hoặc gọi tên; không có nghĩa gói đồ.
2. 結んで（むすんで）: 結ぶ là buộc/thắt nút, chẳng hạn buộc dây; không diễn tả bọc toàn bộ món đồ.
3. 運んで（はこんで）: 運ぶ là vận chuyển/mang đi; không có nghĩa gói.
4. 包んで（つつんで）: thể て của 包む; đúng với yêu cầu gói đồ.
Dịch: “Xin hãy gói món này ngay.” Ghi nhớ: 包む = gói/bọc; 結ぶ = buộc; 運ぶ = mang/vận chuyển.`,
  toan_q_2020_12_25: `Đáp án 3 — 「ファンに囲まれた」nghĩa là được người hâm mộ vây quanh. Cầu thủ Tanaka đến sân và rất đông người hâm mộ đang chờ, nên 囲む khớp với tình huống đám đông bao quanh.
1. うめられた（埋められた）: “bị lấp/chôn”; không thể dùng để nói cầu thủ bị người hâm mộ lấp.
2. つつまれた（包まれた）: “được bọc/bao phủ”; thường nói được bao bọc bởi vật hoặc không khí, không diễn tả đám đông tụ lại quanh người.
3. かこまれた（囲まれた）: bị vây quanh; là bị động đúng của 囲む và hợp với nhiều người hâm mộ đang chờ.
4. まぜられた（混ぜられた）: “bị trộn lẫn”; không hợp với người và người hâm mộ trong ngữ cảnh này.
Dịch: “Cầu thủ Tanaka đến sân thi đấu và được đông đảo người hâm mộ đang chờ vây quanh.” Ghi nhớ: 人に囲まれる = bị người ta vây quanh; 材料を混ぜる = trộn nguyên liệu.`,
  toan_q_2017_07_21: `Đáp án 4 — 「正常に動いている」nghĩa là đang hoạt động bình thường. Máy tính có thể kiểm tra thang máy có chạy đúng trạng thái hay không.
1. 健康に（けんこうに）: “một cách khỏe mạnh”; dùng cho sức khỏe người hoặc động vật, không phải trạng thái vận hành của thang máy.
2. 立派に（りっぱに）: “đàng hoàng/xuất sắc”; đánh giá phẩm chất hoặc kết quả, không nói thiết bị vận hành đúng hay sai.
3. 丁寧に（ていねいに）: “cẩn thận/lịch sự”; mô tả cách một người làm việc, không bổ nghĩa tự nhiên cho độngいている của thang máy.
4. 正常に（せいじょうに）: “bình thường/đúng quy cách”; kết hợp tự nhiên với 機械が動く.
Dịch: “Trong tòa nhà này, có thể dùng máy tính để kiểm tra xem thang máy có đang hoạt động bình thường hay không.” Ghi nhớ: 正常に作動する = hoạt động bình thường.`,
  toan_q_2013_12_21: `Đáp án 3 — 「海でおぼれそうになった」nghĩa là suýt chết đuối ở biển. Người nói bơi kém, nên おぼれる là động từ phù hợp với nguy hiểm dưới nước.
1. こおりそう（凍りそう）: “suýt đóng băng”; nói nước/vật bị đóng băng hoặc người lạnh cóng, không phải tình huống bơi kém.
2. たまりそう（溜まりそう）: “có vẻ sẽ tích tụ/đọng lại”; không diễn tả nguy hiểm khi bơi.
3. おぼれそう（溺れそう）: “suýt bị chìm/suýt chết đuối”; kết hợp với 海で và lý do 泳ぐのが下手.
4. すべりそう（滑りそう）: “suýt trượt”; thường nói trượt chân trên bề mặt, không phải suýt chết đuối.
Dịch: “Vì tôi bơi kém nên lần trước suýt chết đuối ở biển.” Ghi nhớ: 溺れる = chết đuối; 滑る = trượt; 凍る = đóng băng.`,
  toan_q_2012_07_21: `Đáp án 2 — 「大きな問題は起きなくなった」nghĩa là những vấn đề lớn không còn phát sinh nữa. 「問題が起きる」là cụm tự nhiên cho vấn đề xảy ra/phát sinh; なくなった diễn tả việc đó chấm dứt.
1. 立たなくなった（問題が立つ）: 立つ có nhiều nghĩa, nhưng không kết hợp với 問題 để nói vấn đề phát sinh; cách nói là 問題が起きる・発生する.
2. 起きなくなった: 起きる = xảy ra/phát sinh; phủ định quá khứ với なくなった cho biết vấn đề lớn không còn xảy ra sau khi đổi cách làm.
3. 始まらなくなった: 始まる = bắt đầu; 「問題が始まる」không diễn đạt tự nhiên việc vấn đề nảy sinh.
4. 開かなくなった: 開く = mở; không dùng để nói vấn đề phát sinh.
Dịch: “Sau khi thay đổi cách làm việc, những vấn đề lớn không còn phát sinh nữa.” Ghi nhớ: 問題が起きる／発生する = vấn đề xảy ra/phát sinh.`,
  toan_q_2024_07_26: `Đáp án 2 — 「売り切れました」nghĩa là hàng đã bán hết; cách diễn đạt tương đương trong câu lựa chọn là 「全然売れました」, ở đây 全然 nhấn mạnh mức độ hoàn toàn trong câu khẳng định. 「ほとんど」chỉ gần hết, chưa chắc đã hết.
1. ほとんど売れました: “gần như đã bán hết”; ほとんど để ngỏ khả năng vẫn còn hàng, còn 売り切れる khẳng định hết sạch.
2. 全然売れました: “đã bán hết hoàn toàn”; là phương án diễn đạt mức bán hết tương ứng với 売り切れました trong đề.
3. あまり売れませんでした: “không bán được nhiều”; nghĩa ngược với việc hàng đã bán hết.
4. 全然売れませんでした: “hoàn toàn không bán được”; trái nghĩa trực tiếp với 売り切れました.
Dịch: “Món hàng này đã bán hết.” Ghi nhớ: 売り切れる = bán hết; 売れ残る = bán không hết/còn tồn hàng.`,
  toan_q_2021_07_30: `Đáp án 4 — 「学校をサボる」là trốn/bỏ học không có lý do chính đáng, thường vì muốn làm việc khác. 「遊びたくて学校を休んでしまった」nói rằng người đó nghỉ học vì muốn đi chơi, đúng với サボる.
1. 病気になって学校をやめた: vì bị bệnh nên thôi học; やめる là bỏ học dài hạn, không phải nghỉ một buổi.
2. 病気になって学校を休んだ: vì bị bệnh nên nghỉ học; đây là nghỉ có lý do chính đáng, không phải サボる.
3. あそびたくて学校をやめた: muốn đi chơi nên bỏ học hẳn; やめる mang nghĩa thôi học, quá mạnh so với việc nghỉ buổi đó.
4. あそびたくて学校を休んだ: nghỉ học để đi chơi; đúng nghĩa lười/trốn học của サボる.
Dịch: “Tuần trước tôi đã trốn học vì muốn đi chơi.” Ghi nhớ: 学校を休む có thể là nghỉ học có lý do; 学校をサボる là tự ý bỏ học.`,
  toan_q_2014_07_29: `Đáp án 2 — 「あわてて」là cuống quýt/vội vàng vì bất ngờ, lo lắng hoặc thiếu thời gian. Câu nói Yamamoto đã cuống cuồng đi ra; 「急いだようすで」diễn tả gần đúng trạng thái vội vã.
1. 困ったようすで: “trông có vẻ gặp khó khăn/bối rối”; không nhất thiết có hành động vội vàng.
2. 急いだようすで: “trông có vẻ vội”; khớp với あわてて出ていく.
3. 疲れたようすで: “trông có vẻ mệt”; không nêu sự cuống quýt.
4. 怒ったようすで: “trông có vẻ tức giận”; là cảm xúc khác, không đồng nghĩa あわてる.
Dịch: “Nghe nói anh Yamamoto đã vội vã đi ra ngoài.” Ghi nhớ: あわてる = cuống lên; 急ぐ = vội; 困る = gặp khó khăn; 怒る = tức giận.`,
}

const questions = new Map()
for (const exam of exams)
  for (const part of exam.parts || []) for (const question of part.questions || []) questions.set(question.id, question)

for (const [id, explanation] of Object.entries(updates)) {
  const question = questions.get(id)
  if (!question) throw new Error(`Question not found: ${id}`)
  question.explanation = explanation
  curated[id] = explanation
}

fs.writeFileSync(masterPath, `${JSON.stringify(exams, null, 2)}\n`, 'utf8')
fs.writeFileSync(curatedPath, `${JSON.stringify(curated, null, 2)}\n`, 'utf8')
console.log(`Updated ${Object.keys(updates).length} hand-written vocabulary explanations.`)
