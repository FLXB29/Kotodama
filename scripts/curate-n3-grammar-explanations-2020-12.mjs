import fs from 'node:fs'

const masterPath = 'data/jlpt_n3_toan_master.json'
const curatedPath = 'data/jlpt_n3_explanations_curated.json'
const exams = JSON.parse(fs.readFileSync(masterPath, 'utf8'))
const curated = JSON.parse(fs.readFileSync(curatedPath, 'utf8'))

const updates = {
  toan_q_2020_12_36: `Đáp án 2 — 「去年ほど暑くない」: mùa hè năm nay không nóng bằng năm ngoái. 「Aほど〜ない」 so sánh rằng mức độ của chủ thể thấp hơn A.
1. から: “từ/vì”; 「去年から暑くない」 nói từ năm ngoái không nóng, không phải so sánh hai mùa hè.
2. ほど: trong câu phủ định 「Aほど〜ない」 nghĩa là “không… bằng A”; đúng cách so sánh mức nóng năm nay với năm ngoái.
3. まで: “đến tận”; không tạo cấu trúc so sánh mức độ.
4. しか: “chỉ”; cần đi với phủ định nhưng không thể nói 「去年しか暑くない」 để so sánh như câu này.
Dịch: “Mùa hè năm nay không nóng bằng năm ngoái.”
Ghi nhớ: 「Aほど〜ない」 = không… bằng A; 「AよりBのほうが…」 = B… hơn A.`,

  toan_q_2020_12_37: `Đáp án 1 — 「シャンプーか何かわからない」: không biết đó là dầu gội hay thứ gì, nhưng mùi rất thơm. 「Nか何か」 nêu phỏng đoán/khả năng “N hay gì đó”.
1. か／か: tạo cụm 「シャンプーか何かわからない」 = không biết là dầu gội hay gì; đúng nghĩa người nói không rõ nguồn mùi.
2. は／は: nêu hai chủ đề/đối lập “dầu gội thì…, cái gì thì…”; không tạo câu hỏi gián tiếp tự nhiên.
3. が／が: đánh dấu chủ ngữ nhưng không kết hợp thành mẫu 「何がわからない」 với lựa chọn giữa dầu gội và thứ khác.
4. で／で: chỉ phương tiện/địa điểm, không dùng để nói “dầu gội hay thứ gì”.
Dịch: “Sáng nay trên tàu, từ người ngồi cạnh tỏa ra mùi thơm dễ chịu. Tôi không biết là dầu gội hay gì nữa, nhưng quả thật rất thơm.”
Ghi nhớ: 「Nか何か」 = N hay thứ gì đó; 「何かわからない」 = không biết là gì.`,

  toan_q_2020_12_38: `Đáp án 4 — 「会議の資料だけならできる」: nếu chỉ làm tài liệu cho cuộc họp thì có lẽ kịp. 「だけなら」 giới hạn điều kiện/phạm vi ở riêng phần đó.
1. とでも: “hay cái gì đó”; không nêu giới hạn công việc có thể hoàn thành.
2. となら: “nếu là với N”; cần một danh từ/đối tượng phù hợp sau と, không tự nhiên với 「資料」 trong ý này.
3. だけでも: “ít nhất/dù chỉ N cũng…”; câu này vẫn có thể hiểu được, nhưng nhấn vào mức tối thiểu có thể làm. 「だけなら」 diễn đạt chính xác hơn điều kiện “nếu giới hạn ở riêng tài liệu họp”.
4. だけなら: “nếu chỉ N thì”; nói chỉ riêng tài liệu họp có thể làm xong, dù không kịp cả hai việc.
Dịch: “Trưởng phòng: Hayashi, em có thể hoàn thành cả báo cáo công tác và tài liệu cuộc họp ngày mai trước khoảng trưa nay không? — Hayashi: Có lẽ em không làm kịp cả hai. Nếu chỉ tài liệu họp thì em nghĩ có thể xong…”
Ghi nhớ: 「Nだけなら」 = nếu chỉ giới hạn ở N; 「Nだけでも」 = dù chỉ N cũng….`,

  toan_q_2020_12_39: `Đáp án 3 — 「ちっとも私の言うことを聞かない」: con trai hoàn toàn chẳng chịu nghe lời người nói. 「ちっとも」 nhấn mạnh mức độ bằng không và thường đi với phủ định.
1. やっと: “cuối cùng/mãi mới”; nói kết quả sau chờ đợi, không hợp với hành vi lặp lại “không nghe lời”.
2. きっと: “chắc chắn”; phỏng đoán, không có nghĩa “hoàn toàn không”.
3. ちっとも: “chẳng… chút nào”; kết hợp với 「聞かない」 để nói cậu con trai không nghe lời chút nào.
4. せっかく: “đã mất công/nhân dịp”; cần một cơ hội hoặc nỗ lực bị phí, không bổ nghĩa cho 「聞かない」 theo nghĩa này.
Dịch: “Dạo này con trai tôi chẳng chịu nghe lời tôi chút nào nên tôi đang khổ sở.”
Ghi nhớ: 「ちっとも〜ない」 = hoàn toàn không; 「きっと」 = chắc chắn/có lẽ chắc.`,

  toan_q_2020_12_40: `Đáp án 1 — 「技術の進歩のおかげで便利になった」: nhờ công nghệ tiến bộ mà cuộc sống trở nên tiện lợi. 「おかげで」 nêu nguyên nhân mang lại kết quả tốt.
1. おかげで: “nhờ”; kết hợp với sự tiến bộ công nghệ để giải thích cuộc sống tiện lợi hơn.
2. ようで: “có vẻ/như”; không nêu nguyên nhân theo ý câu.
3. ことで: “bằng việc/do việc”; 「進歩のことで」 không phải kết cấu tự nhiên chỉ nguyên nhân.
4. ほかで: “ở nơi khác”; không tạo quan hệ nguyên nhân–kết quả.
Dịch: “Nhờ sự tiến bộ của công nghệ, cuộc sống của chúng ta đã trở nên rất tiện lợi.”
Ghi nhớ: 「Nのおかげで」 = nhờ N (kết quả tốt); 「Nのせいで」 = do/tại N (kết quả xấu).`,

  toan_q_2020_12_41: `Đáp án 3 — 「駅に着いたとしても安心だ」: vì khách sạn ở ngay trước ga nên kể cả đến ga muộn vào ban đêm cũng yên tâm. 「〜たとしても」 nêu giả định nhượng bộ: cho dù… thì…
1. 着いたり: 「たり」 liệt kê hành động, thường cần một hành động khác; không tạo ý “dù đến muộn”.
2. 着いたため: “vì đã đến”; nêu nguyên nhân, không khớp tình huống giả định vào đêm muộn.
3. 着いたとしても: “dù có đến”; phù hợp vì khách sạn cạnh ga nên vẫn yên tâm ngay cả khi tàu đến trễ/đến ga vào tối muộn.
4. 着いたかどうか: “có đến hay không”; biến phần trước thành câu hỏi gián tiếp, không nối với 「安心だ」 theo ý này.
Dịch: “Khách sạn Y mà tôi sẽ ở trong chuyến công tác tới nằm ngay trước ga, nên dù đến ga vào đêm muộn tôi cũng yên tâm.”
Ghi nhớ: 「普通形＋としても」 = cho dù… thì; 「ため」 = vì/do.`,

  toan_q_2020_12_42: `Đáp án 3 — 「喫茶店がまだ営業していて驚いた」: người nói ngạc nhiên vì quán cà phê vẫn đang hoạt động. 「〜ていて」 nối trạng thái đang tiếp diễn với cảm xúc.
1. 営業して: thể て có thể nối hai hành động nhưng không hoàn chỉnh trước 「驚いた」 theo cách câu muốn nêu nguyên nhân/trạng thái.
2. 営業しなくて: “không hoạt động nên…”; trái với sự ngạc nhiên rằng quán cũ vẫn còn mở.
3. 営業していて: “đang hoạt động/vẫn mở”; nêu điều người nói phát hiện và lý do ngạc nhiên.
4. 営業していなくて: “không còn hoạt động”; trái với ý quán vẫn còn kinh doanh.
Dịch: “Đây là lần thứ hai tôi đến Nhật. Lần trước là 20 năm trước; tôi ngạc nhiên khi quán cà phê mình ghé khi ấy vẫn đang hoạt động.”
Ghi nhớ: 「まだVている」 = vẫn đang V; 「まだVていない」 = vẫn chưa V/không còn V tùy ngữ cảnh.`,

  toan_q_2020_12_43: `Đáp án 2 — 「親に絵本を読んでもらってから寝ていた」: hồi nhỏ trước khi ngủ, người nói được bố mẹ đọc sách tranh cho nghe. 「Vてもらう」 diễn tả nhận được hành động có lợi từ người khác.
1. 読んでくれてから: 「くれる」 thường cần chủ thể “bố mẹ đọc cho tôi”; cách ghép chủ ngữ/tân ngữ với 「親に」 không phù hợp bằng mẫu nhận hành động 「てもらう」.
2. 読んでもらってから: “sau khi được đọc sách tranh cho nghe”; 「親に」 đánh dấu người thực hiện, người nói nhận hành động.
3. 読んでくれるから: “vì bố mẹ đọc cho”; hiện tại/tương lai và quan hệ nguyên nhân không khớp thói quen hồi nhỏ.
4. 読んでもらうから: “vì được đọc cho”; thể hiện tương lai/thói quen ở hiện tại, trong khi câu kể thói quen quá khứ 「寝ていた」.
Dịch: “Khi còn nhỏ, trước khi ngủ, tôi thường được bố mẹ đọc sách tranh cho nghe.”
Ghi nhớ: 「人にVてもらう」 = nhận việc V từ ai; 「人がVてくれる」 = ai đó làm V cho mình.`,

  toan_q_2020_12_44: `Đáp án 4 — 「肉の色が変わってきたら野菜を入れる」: khi màu thịt bắt đầu đổi, hãy cho rau vào. 「〜てくる」 nhìn sự thay đổi dần tiến đến thời điểm hiện tại; 「たら」 nêu mốc thực hiện bước tiếp theo.
1. 変わっていって: 「〜ていく」 nói thay đổi tiếp tục từ hiện tại về sau; thiếu mốc điều kiện hoàn tất trước khi cho rau.
2. 変わってくるのに: 「のに」 nêu tương phản “mặc dù”, không phù hợp với hướng dẫn nấu theo trình tự.
3. 変わっていくと: “khi màu cứ thay đổi thì…” có thể tạo quan hệ điều kiện rộng, nhưng không nhấn mạnh thời điểm thịt đã bắt đầu chuyển màu để chuyển sang bước tiếp theo.
4. 変わってきたら: “khi đã bắt đầu đổi màu”; phù hợp hướng dẫn canh thời điểm cho rau vào.
Dịch: “(Trong chương trình nấu ăn) Trước hết xào thịt trên chảo. Khi màu thịt bắt đầu đổi, hãy cho rau vào.”
Ghi nhớ: 「〜てくる」 nhìn sự thay đổi tiến đến hiện tại; 「〜ていく」 nhìn sự thay đổi tiếp tục về sau; 「〜たら」 = khi/sau khi.`,

  toan_q_2020_12_45: `Đáp án 1 — 「赤ちゃんにクラシック音楽を聞かせる」: cho em bé nghe nhạc cổ điển. 「聞かせる」 là thể sai khiến của 「聞く」, khiến/cho ai nghe.
1. 聞かせる: “cho nghe”; phù hợp với lời khuyên mở nhạc cho em bé khi khó ngủ.
2. 聞かれる: bị động/tôn kính “được nghe”; không diễn tả người lớn chủ động mở nhạc cho bé.
3. 聞かされる: bị ép phải nghe; mang sắc thái bị động ngoài ý muốn, không phù hợp lời khuyên chăm em bé.
4. 聞いている: “đang nghe”; chủ thể nghe là em bé, nhưng câu cần người chăm sóc cho bé nghe nhạc.
Dịch: “Tôi nghe nói khi em bé mãi không ngủ, nếu cho bé nghe nhạc cổ điển thì bé sẽ ngủ ngon.”
Ghi nhớ: 「人に音楽を聞かせる」 = cho ai nghe nhạc; 「聞かされる」 = bị bắt phải nghe.`,

  toan_q_2020_12_46: `Đáp án 2 — 「森先生はいらっしゃいますか」: “Thầy Mori có ở đó không ạ?”. 「いらっしゃる」 là kính ngữ của 「いる／来る／行く」, dùng để hỏi về giáo viên.
1. ございます: cách nói lịch sự của 「ある」, thường dùng với vật/sự việc; không dùng để hỏi một người có ở đó hay không.
2. いらっしゃいます: kính ngữ chỉ sự hiện diện của người được tôn trọng; phù hợp khi học viên hỏi giáo viên qua điện thoại.
3. 拝見します: khiêm nhường ngữ “tôi xem”; không hỏi giáo viên có mặt hay không.
4. お目にかかります: khiêm nhường ngữ “tôi gặp”; nói về hành động của người nói, không phải hỏi người nghe về sự hiện diện của thầy.
Dịch: “(Qua điện thoại) Thầy Mori: Alo, trường tiếng Nhật Kitayama xin nghe. — Lee: Alo, em là Lee lớp trung cấp. Thầy Mori có ở đó không ạ? — Thầy Mori: À, Lee đấy à. Thầy Mori đây. Em cần gì?”
Ghi nhớ: 「いらっしゃいますか」 tôn kính hỏi người khác có mặt; 「おります」 khiêm nhường nói người bên mình có mặt; 「拝見する」 = xem (khiêm nhường).`,

  toan_q_2020_12_47: `Đáp án 4 — 「始める前から心配ばかりしていてもしかたないでしょう」: lo lắng mãi từ trước khi bắt đầu cũng chẳng ích gì. 「ばかり」 nhấn mạnh chỉ làm một việc; 「〜てもしかたない」 nói việc đó không thay đổi được gì.
1. よりしていれば: 「より」 không kết hợp với 「心配する」 để nói “chỉ lo lắng”; câu không tạo nghĩa tự nhiên.
2. よりしていても: cũng không tạo được mẫu giới hạn “chỉ lo”; 「より」 thường đánh dấu so sánh.
3. ばかりしていれば: “nếu cứ lo suốt thì…”; 「ばかり」 đúng, nhưng điều kiện 「いれば」 không hợp với kết luận 「しかたないでしょう」 bằng nhượng bộ 「いても」.
4. ばかりしていても: “dù chỉ cứ lo lắng thì cũng chẳng ích gì”; đúng cấu trúc và lời trấn an 「大丈夫だよ」.
Dịch: “A: Con tôi từ tuần sau bắt đầu học lớp bơi, tôi lo đủ thứ. — B: Lo lắng mãi từ trước khi bắt đầu cũng chẳng giải quyết gì đâu. Không sao đâu.”
Ghi nhớ: 「Vてばかりいる」 = chỉ suốt ngày V; 「Vてもしかたない」 = có V cũng chẳng ích gì.`,

  toan_q_2020_12_48: `Đáp án 1 — 「急に出勤しなきゃならなくなった」: đột nhiên thành ra phải đi làm. 「しなきゃならない」 là khẩu ngữ của 「しなければならない」; 「〜なくなる」 diễn tả tình trạng mới phát sinh.
1. しなきゃならなくなった: “đã trở nên phải làm”; hợp với cuộc gọi bất ngờ từ công ty vào ngày nghỉ.
2. しちゃいけなくなった: “đã trở nên không được làm”; trái với việc người chồng phải đi làm.
3. するつもりでいる: “đang định làm”; không nêu việc bất ngờ thành nghĩa vụ.
4. しないようにしている: “đang cố không làm”; ngược nghĩa với việc phải đi làm.
Dịch: “Chồng: Anh đi công ty đây. — Vợ: Ủa, hôm nay anh được nghỉ mà? — Chồng: Công ty vừa gọi, đột nhiên anh lại phải đi làm.”
Ghi nhớ: 「Vなきゃならない」 = phải V (khẩu ngữ); 「Vなくなる」 = trở nên không/không còn; 「Vなきゃならなくなる」 = phát sinh việc phải V.`,
}

let updated = 0
for (const exam of exams) {
  if (exam.id !== 'toan-n3-202012-full') continue
  for (const part of exam.parts || []) {
    if (!part.title.includes('Ngữ pháp') || !part.title.includes('Mondai 1')) continue
    for (const question of part.questions || []) {
      const explanation = updates[question.id]
      if (!explanation) continue
      question.explanation = explanation.trim()
      curated[question.id] = explanation.trim()
      updated++
    }
  }
}

if (updated !== Object.keys(updates).length) {
  throw new Error(`Expected to update ${Object.keys(updates).length} known questions; found ${updated}.`)
}

fs.writeFileSync(masterPath, `${JSON.stringify(exams, null, 2)}\n`, 'utf8')
fs.writeFileSync(curatedPath, `${JSON.stringify(curated, null, 2)}\n`, 'utf8')
console.log(`Updated ${updated} hand-written N3 grammar explanations for December 2020.`)
