import fs from 'node:fs'

const masterPath = 'data/jlpt_n3_toan_master.json'
const curatedPath = 'data/jlpt_n3_explanations_curated.json'
const exams = JSON.parse(fs.readFileSync(masterPath, 'utf8'))
const curated = JSON.parse(fs.readFileSync(curatedPath, 'utf8'))

const updates = {
  toan_q_2023_07_36: `Đáp án 4 — 「アジアを中心に」: lấy châu Á làm trung tâm/phạm vi chính. 「Nを中心に」 nêu nơi hoặc nhóm giữ vai trò trung tâm.
1. が: đánh dấu chủ ngữ; 「アジアが中心に」 không nối đúng với 「コンサートを行う」.
2. で: chỉ địa điểm diễn ra; 「アジアで中心に」 sai kết hợp. Muốn nói biểu diễn ở châu Á có thể dùng 「アジアで」, nhưng câu này dùng mẫu 「Nを中心に」.
3. の: nối hai danh từ; cần thêm danh từ phía sau, không thể nói 「アジアの中心に」 theo nghĩa phạm vi chính.
4. を: tạo cụm 「アジアを中心に」 = chủ yếu ở châu Á; phù hợp với việc tổ chức hòa nhạc tại nhiều nước.
Dịch: “Ca sĩ Aoyama Kei được yêu thích cả ở nước ngoài và tổ chức hòa nhạc tại nhiều nước, chủ yếu ở châu Á.”
Ghi nhớ: 「Nを中心に」 = lấy N làm trung tâm/chủ yếu quanh N; 「Nで」 đơn thuần chỉ địa điểm.`,

  toan_q_2023_07_37: `Đáp án 3 — 「学年が上がるにしたがって」: khi lớp/năm học càng tăng thì thời gian đọc sách giảm. 「〜にしたがって」 diễn tả hai thay đổi tiến triển cùng nhau.
1. ことから: “từ việc/vì”; cần một mệnh đề làm căn cứ hoặc nguyên nhân, không tạo quan hệ biến đổi đồng thời.
2. としたら: “nếu giả sử”; đặt giả định, không phù hợp với kết quả khảo sát về xu hướng thực tế.
3. にしたがって: “cùng với/theo mức độ”; học sinh càng lên lớp cao thì thời gian đọc càng giảm, đúng kết quả khảo sát.
4. のに比べて: “so với”; cần hai đối tượng hoặc thời điểm để so sánh trực tiếp, không diễn tả xu hướng theo từng năm học.
Dịch: “Trường trung học Minami khảo sát thói quen đọc sách. Kết quả cho thấy học sinh càng lên lớp cao thì thời gian đọc sách càng giảm.”
Ghi nhớ: 「AにしたがってB」 = cùng với sự thay đổi của A, B cũng thay đổi; 「Aに比べて」 = so với A.`,

  toan_q_2023_07_38: `Đáp án 4 — 「家族としか行ったことがない」: trước đây chỉ từng đi du lịch cùng gia đình. 「しか」 đi với phủ định để giới hạn nghĩa là “chỉ”.
1. だけで: 「家族だけで行ったことがない」 vẫn có thể tạo câu đúng, nhưng nghĩa là “chưa từng đi chỉ riêng với gia đình”; nó không diễn tả “trước đây chỉ đi với gia đình”. Câu sau 「楽しみ」 hướng tới tương phản này.
2. だけが: 「が」 đánh dấu chủ ngữ “chỉ gia đình”; không thể hiện người đi cùng người nói.
3. となら: “nếu là đi cùng…”; không hợp với 「行ったことがない」 để kể trải nghiệm trước đây.
4. としか: 「家族と」 nêu người đi cùng; 「しか〜ない」 giới hạn rằng ngoài gia đình ra chưa từng đi với ai khác.
Dịch: “Bạn rủ tôi đi du lịch nước ngoài cùng vào kỳ nghỉ hè. Trước đây tôi chỉ từng đi du lịch nước ngoài cùng gia đình nên rất mong chờ chuyến đi này.”
Ghi nhớ: 「NとしかVない」 = không V với ai/cái gì ngoài N; 「しか」 cần vị ngữ phủ định.`,

  toan_q_2023_07_39: `Đáp án 1 — 「できればもう少し近いところがいい」: nếu được thì khách muốn căn hộ gần ga hơn một chút. 「できれば」 làm lời đề nghị/nguyện vọng mềm hơn.
1. できれば: “nếu có thể/giá mà được”; nối tự nhiên với mong muốn 「もう少し近いところがいい」.
2. 別に: “đặc biệt thì không”; thường đi với phủ định 「別に〜ない」, không phải cách nêu mong muốn này.
3. せっかく: “đã mất công/nhân dịp hiếm có”; cần nói đến một cơ hội hay nỗ lực có thể bị phí, không hợp ý muốn căn hộ gần ga.
4. 確かに: “đúng là/quả thật”; thường xác nhận điều vừa nghe rồi nêu nhận xét, nhưng ở đây chỗ trống mở đầu yêu cầu mềm hơn, phù hợp 「できれば」.
Dịch: “(Ở công ty bất động sản) Nhân viên: Căn hộ này thế nào ạ? Đi bộ từ ga mất 15 phút nhưng nhà rộng và sạch. — Khách: Phòng thì có vẻ tốt, nhưng hơi xa ga nhỉ. Nếu được thì tôi muốn chỗ nào gần hơn một chút…”
Ghi nhớ: 「できれば」 = nếu có thể; 「せっかく」 = đã mất công/nhân dịp quý, thường hàm ý tận dụng cơ hội.`,

  toan_q_2023_07_40: `Đáp án 2 — 「雨が降りだした」: mưa bắt đầu rơi đột ngột. 「ます形 bỏ ます＋出す」 diễn tả một hành động/sự việc bất ngờ bắt đầu.
1. 降る: thể từ điển không nối trực tiếp được với 「だした」 theo mẫu bắt đầu.
2. 降り: bỏ 「ます」 của 「降ります」 rồi ghép 「出す」 thành 「降りだす」 = bắt đầu mưa.
3. 降って: thể て không kết hợp với 「出す」 trong cấu trúc này.
4. 降った: thể quá khứ không tạo được mẫu bắt đầu 「〜だす」; 「降っただした」 sai hình thức.
Dịch: “Đang đi dạo thì trời đột nhiên bắt đầu mưa, nên tôi vội chạy vào quán cà phê gần đó.”
Ghi nhớ: 「動詞ます形－ます＋出す」 = đột nhiên bắt đầu; 「降り出す」 = bắt đầu mưa.`,

  toan_q_2023_07_41: `Đáp án 4 — 「お名前が呼ばれるまで」: xin chờ trước phòng khám cho đến khi tên được gọi. Đây là thể bị động 「呼ばれる」 kết hợp với 「まで」 chỉ điểm kết thúc.
1. 呼ぶと: “khi vừa gọi”; chủ động và ngụ ý nhân viên gọi tên, trong khi 「お名前が」 cần làm chủ ngữ của hành động bị động.
2. 呼ぶまで: dùng chủ động “đến khi gọi”; với 「お名前が」, câu phải dùng bị động 「呼ばれる」.
3. 呼ばれると: “khi tên được gọi thì…”; 「と」 thường mở kết quả xảy ra sau đó, không phải mốc chờ đợi theo yêu cầu.
4. 呼ばれるまで: “cho đến khi tên được gọi”; đúng cả thể bị động và mốc thời gian của lời hướng dẫn.
Dịch: “(Ở quầy tiếp nhận bệnh viện) Nhân viên: Sau khi xác nhận tên của anh/chị, xin chờ trước phòng khám cho đến khi được gọi.”
Ghi nhớ: 「人が呼ぶ」 = ai đó gọi; 「名前が呼ばれる」 = tên được gọi; 「〜まで待つ」 = chờ đến khi.`,

  toan_q_2023_07_42: `Đáp án 4 — 「電車が遅れたせいで」: vì tàu bị trễ nên người nói đi làm muộn. 「〜せいで」 nêu nguyên nhân dẫn đến kết quả không mong muốn.
1. 間に: “trong lúc”; cần hai hành động xảy ra trong một khoảng thời gian, không nêu nguyên nhân bị muộn.
2. 点で: “xét ở điểm”; cần cấu trúc đánh giá như 「この点で」, không nối trực tiếp với sự việc gây muộn.
3. たびに: “mỗi lần”; cần sự việc lặp đi lặp lại, trong khi câu kể một lần tàu trễ.
4. せいで: “do/tại”; diễn tả tàu trễ là nguyên nhân khiến người nói đến công ty muộn.
Dịch: “Sáng nay tôi đã đi làm muộn vì tàu bị trễ.”
Ghi nhớ: 「N／普通形＋せいで」 = do/tại nguyên nhân mang kết quả xấu; kết quả tích cực thường dùng 「おかげで」.`,

  toan_q_2023_07_43: `Đáp án 2 — 「30ページまで読んでおかなければならない」: phải đọc trước đến trang 30 để chuẩn bị cho buổi học ngày mai. 「〜ておく」 chỉ việc làm sẵn, còn 「なければならない」 diễn tả nghĩa vụ.
1. 読んでおいてはいけない: “không được đọc trước”; trái với yêu cầu chuẩn bị bài và việc người nói đang lo vì chưa đọc.
2. 読んでおかなければならない: “phải đọc sẵn”; phù hợp với hạn chót là buổi học ngày mai.
3. 読むことにしてはいけない: “không được quyết định sẽ đọc”; sai nghĩa và không diễn tả nghĩa vụ hoàn thành bài.
4. 読むことにしなければならない: “phải quyết định sẽ đọc”; chỉ nghĩa vụ đưa ra quyết định, không phải phải đọc xong đến trang 30.
Dịch: “Tôi phải đọc trước đến trang 30 của giáo trình cho buổi học ngày mai, vậy mà đến giờ tôi vẫn chưa đọc chút nào.”
Ghi nhớ: 「Vておく」 = làm trước/chuẩn bị sẵn; 「Vておかなければならない」 = phải làm trước.`,

  toan_q_2023_07_44: `Đáp án 3 — 「少しも眠れなかった」: hoàn toàn không ngủ được. 「少しも」 thường đi với phủ định để nhấn mạnh “không chút nào”.
1. 眠りたかった: “đã muốn ngủ”; diễn tả mong muốn, không cho biết kết quả là có ngủ được hay không.
2. 眠ろうとした: “đã định/cố ngủ”; không diễn tả rõ kết quả thất bại, trong khi 「少しも」 thường cần vị ngữ phủ định.
3. 眠れなかった: phủ định khả năng của 「眠れる」; kết hợp tự nhiên với 「少しも」 = không ngủ được chút nào.
4. 眠らなくなった: “đã trở nên không ngủ nữa”; nói về thay đổi thói quen/trạng thái, không hợp một đêm cụ thể.
Dịch: “Đêm qua tiếng gió làm tôi bận tâm nên tôi không ngủ được chút nào.”
Ghi nhớ: 「少しも〜ない」 = không… chút nào; 「眠れる」 là khả năng ngủ, khác với 「眠りたい」 là muốn ngủ.`,

  toan_q_2023_07_45: `Đáp án 3 — 「私の夢は、いつか自分のケーキ屋を開くことだ」: ước mơ của tôi là một ngày nào đó tự mở tiệm bánh. 「夢はVることだ」 dùng danh từ hóa động từ để nêu nội dung ước mơ.
1. 開くと思う: “tôi nghĩ sẽ mở”; nêu dự đoán/suy nghĩ, không định nghĩa ước mơ.
2. 開きたいと思う: “tôi nghĩ mình muốn mở”; có thể nói mong muốn, nhưng không khớp cấu trúc 「私の夢は〜」 vì mệnh đề sau không được danh từ hóa làm nội dung ước mơ.
3. 開くことだ: 「Vること」 danh từ hóa hành động; hoàn chỉnh mẫu 「私の夢は〜ことだ」.
4. 開きたいことだ: 「たい」 là tính từ nguyện vọng; không dùng trực tiếp với 「ことだ」 theo cấu trúc nêu ước mơ này.
Dịch: “Ước mơ của tôi là một ngày nào đó tự mở một tiệm bánh.”
Ghi nhớ: 「私の夢はNをVることだ」 = ước mơ của tôi là làm V; 「Vたい」 tự nó diễn tả mong muốn của người nói.`,

  toan_q_2023_07_46: `Đáp án 2 — 「雨、全然やみそうにない」: mưa hoàn toàn có vẻ chưa thể tạnh. 「ます形 bỏ ます＋そうにない」 diễn tả dự đoán rằng việc gì đó khó/không có vẻ xảy ra.
1. やまないはずがない: “không thể nào không tạnh”; nghĩa là chắc chắn sẽ tạnh, trái với đề nghị hủy chuyến đi vì mưa vẫn dai dẳng.
2. やみそうにない: 「やみます」 bỏ 「ます」＋「そうにない」 = có vẻ không tạnh; hợp với 「全然」 và quyết định không ra ngoài.
3. やむに違いない: “chắc chắn sẽ tạnh”; phỏng đoán khẳng định, không hợp với ý mưa chưa có dấu hiệu dừng.
4. やんでもしかたない: “dù có tạnh thì cũng đành chịu”; không tạo nghĩa phù hợp và không nối tự nhiên với 「ね」 trong hội thoại.
Dịch: “Vợ: Mưa hoàn toàn chưa có vẻ tạnh nhỉ. Hôm nay mình thôi không ra ngoài nữa nhé? — Chồng: Ừ.”
Ghi nhớ: 「Vます形＋そうにない」 = có vẻ không V; 「Vるに違いない」 = chắc chắn V.`,

  toan_q_2023_07_47: `Đáp án 1 — 「新しいカフェができるらしい」: nghe nói sắp có một quán cà phê mới. 「らしい」 dùng để thuật lại thông tin người nói biết được từ nguồn khác.
1. できるらしい: “nghe nói sẽ mở/được xây”; phù hợp vì người nói vừa nghe tin từ anh/chị khóa trên.
2. できてほしい: “mong là sẽ có”; diễn tả mong muốn của người nói, không phải tin đã nghe được.
3. できることがある: “có khi/có trường hợp được mở”; nói khả năng chung, không truyền đạt thông tin cụ thể về ga này.
4. できたほうがいい: “có thì tốt hơn”; đưa ra ý kiến/đề xuất, không phải thông tin mới nghe.
Dịch: “(Ở trường đại học) A: Tớ nghe anh/chị khóa trên nói là sắp có một quán cà phê mới mở trước ga đấy. — B: Vậy à. Đáng mong chờ nhỉ.”
Ghi nhớ: 「普通形＋らしい」 = nghe nói/có vẻ theo thông tin thu được; 「Vてほしい」 = mong ai đó làm.
Sửa lỗi nhập liệu: bản dữ liệu cũ ghi 「そんなんだ」; sửa thành 「そうなんだ」 theo câu đáp tự nhiên “Vậy à”.`,

  toan_q_2023_07_48: `Đáp án 3 — 「もう少し短くしてもらえますか」: anh/chị có thể cắt ngắn thêm một chút được không? 「Vていただく／もらう」 diễn tả người nói nhận được hành động có lợi từ người khác; 「〜てもらえますか」 là lời nhờ lịch sự.
1. してあげますか: “tôi làm ngắn hơn cho anh/chị nhé?”; hướng hành động từ người nói tới khách, đảo sai vai giao tiếp.
2. なってあげますか: “tôi trở nên ngắn hơn cho anh/chị nhé?”; 「なる」 là tự trở thành, không diễn tả thợ cắt tóc chỉnh tóc cho khách.
3. してもらえますか: “tôi có thể nhờ anh/chị làm … cho tôi không?”; 「短くする」 nêu việc cắt ngắn, đúng lời khách yêu cầu thợ.
4. なってもらえますか: “tôi có thể nhờ trở nên ngắn hơn không?”; chủ thể của 「なる」 là tóc/tình trạng tự đổi, không phải yêu cầu thợ cắt.
Dịch: “(Ở tiệm làm tóc) Nhân viên: Độ dài như thế này được chưa ạ? — Khách: Anh/chị cắt ngắn thêm một chút được không? — Nhân viên: Vâng, tôi hiểu rồi.”
Ghi nhớ: 「短くする」 = làm cho ngắn; 「短くなる」 = tự trở nên ngắn; 「Vてもらえますか」 = nhờ người nghe làm V cho mình.`,
}

let updated = 0
let correctedTranscript = false
for (const exam of exams) {
  if (exam.id !== 'toan-n3-202307-full') continue
  for (const part of exam.parts || []) {
    for (const question of part.questions || []) {
      const explanation = updates[question.id]
      if (!explanation) continue
      question.explanation = explanation.trim()
      curated[question.id] = explanation.trim()
      if (question.id === 'toan_q_2023_07_47') {
        question.question = question.question.replace('そんなんだ', 'そうなんだ')
        question.sentence = question.sentence.replace('そんなんだ', 'そうなんだ')
        correctedTranscript = true
      }
      updated++
    }
  }
}

if (updated !== Object.keys(updates).length || !correctedTranscript) {
  throw new Error(`Expected ${Object.keys(updates).length} questions and one transcript correction; updated ${updated}.`)
}

fs.writeFileSync(masterPath, `${JSON.stringify(exams, null, 2)}\n`, 'utf8')
fs.writeFileSync(curatedPath, `${JSON.stringify(curated, null, 2)}\n`, 'utf8')
console.log(`Updated ${updated} hand-written N3 grammar explanations for July 2023 and corrected one transcript typo.`)
