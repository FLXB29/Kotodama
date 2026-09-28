import fs from 'node:fs'

const masterPath = 'data/jlpt_n3_toan_master.json'
const curatedPath = 'data/jlpt_n3_explanations_curated.json'
const exams = JSON.parse(fs.readFileSync(masterPath, 'utf8'))
const curated = JSON.parse(fs.readFileSync(curatedPath, 'utf8'))

const updates = {
  toan_q_2022_12_36: `Đáp án 2 — 「これで大丈夫でしょうか」: “viết như thế này có ổn không ạ?”. 「Nで大丈夫」 hỏi liệu cách thức/trạng thái hiện tại có chấp nhận được không.
1. に: có thể đánh dấu đích hoặc thời điểm, nhưng 「これに大丈夫」 không phải cách nói “như thế này có ổn không”.
2. で: trong 「これで大丈夫」, で nêu cách làm/phương án đang được hỏi; đây là cách kết hợp tự nhiên.
3. と: có thể đánh dấu trích dẫn hoặc cùng hành động, nhưng 「これと大丈夫」 không tạo câu hỏi về cách điền đơn.
4. が: đánh dấu chủ ngữ; câu sẽ cần cấu trúc khác như 「これが大丈夫」 và không khớp mẫu xác nhận cách làm 「これで」.
Dịch: “(Trong lớp) An: Thưa thầy, em đã điền đơn đăng ký cuộc thi diễn thuyết. Có chỗ em chưa hiểu rõ cách điền; em viết phần này như thế này có ổn không ạ?”
Ghi nhớ: 「これで大丈夫ですか」 = như thế này/cách này có được không; 「Nで」 nêu phương án đang được đánh giá.`,

  toan_q_2022_12_37: `Đáp án 1 — 「北山公園において夏祭りが行われました」: lễ hội mùa hè đã được tổ chức tại công viên Kitayama. 「Nにおいて」 là cách nói trang trọng của 「Nで」 khi nêu địa điểm/sự kiện.
1. において: chỉ nơi diễn ra sự kiện; phù hợp với 「夏祭りが行われました」.
2. にとって: “đối với”; cần một người/nhóm có góc nhìn, không phải địa điểm tổ chức.
3. に対して: “đối với/hướng tới”; nêu đối tượng tác động hoặc đối chiếu, không nêu nơi diễn ra lễ hội.
4. について: “về”; nêu chủ đề, trong khi câu cần địa điểm.
Dịch: “(Trên trang chủ thành phố Kitayama) Lễ hội mùa hè đã được tổ chức trong hai ngày 25 và 26 tháng 7 tại công viên Kitayama.”
Ghi nhớ: 「Nにおいて」 = tại N (văn viết/trang trọng); 「Nについて」 = về N; 「Nにとって」 = đối với N.`,

  toan_q_2022_12_38: `Đáp án 3 — 「誰にでも親切で優しい兄」: người anh trai tử tế, hiền lành với bất kỳ ai. 「誰にでも」 nghĩa là “với bất cứ ai/mọi người”.
1. にだけ: “chỉ với…”; 「誰にだけ」 hỏi/giới hạn một người cụ thể, không khái quát anh trai tốt với tất cả mọi người.
2. からだけ: “chỉ từ…”; 「親切」 ở đây cần người nhận sự tử tế đi với に, không phải nguồn bắt đầu bằng から.
3. にでも: 「誰にでも」 dùng với nghĩa “với bất kỳ ai”; 「でも」 mở rộng phạm vi, phù hợp với tính cách thân thiện của anh.
4. からでも: “ngay cả từ…”; から chỉ nguồn/điểm xuất phát, không đánh dấu người mà anh đối xử tử tế.
Dịch: “Tôi rất kính trọng anh trai mình, một người tử tế và hiền lành với bất cứ ai.”
Ghi nhớ: 「人に親切だ」 = tử tế với người; 「誰にでも」 = với bất kỳ ai.`,

  toan_q_2022_12_39: `Đáp án 4 — 「必ず持ってきてください」: xin hãy chắc chắn mang theo tờ giấy này. 「必ず」 nhấn mạnh yêu cầu phải thực hiện.
1. 全く: “hoàn toàn”; thường đi với phủ định 「全く〜ない」, không dùng làm trạng từ khẳng định trong lời nhắc này.
2. 非常に: “rất”; bổ nghĩa tính từ/trạng thái, không hợp với yêu cầu mang giấy.
3. 決して: “nhất định không”; thường đi cùng vị ngữ phủ định 「決して〜ない」, trái với mệnh lệnh khẳng định.
4. 必ず: “nhất định/chắc chắn”; phù hợp lời giáo viên dặn học sinh mang tài liệu.
Dịch: “(Trong lớp) Giáo viên: Vì tuần sau chúng ta sẽ dùng tờ giấy này trong giờ học, nên các em nhất định phải mang theo nhé.”
Ghi nhớ: 「必ずV」 = nhất định hãy V; 「決して〜ない」 = tuyệt đối không.`,

  toan_q_2022_12_40: `Đáp án 1 — 「出張があってどうしても行けない」: vì có chuyến công tác nên dù rất muốn cũng không thể đi được. 「どうしても〜ない」 nhấn mạnh việc không thể làm trong hoàn cảnh hiện tại.
1. どうしても: kết hợp tự nhiên với phủ định để nói “dù thế nào cũng không thể”; hợp với chuyến công tác cản trở việc dự đám cưới.
2. それほど: “đến mức ấy”; thường đi với phủ định nhẹ, nhưng không nêu sự bất khả thi do lịch công tác.
3. せっかく: “đã mất công/nhân dịp hiếm có”; cần vế sau nói cơ hội bị phí hoặc cố gắng không được đền đáp.
4. つい: “lỡ/vô tình”; thường bổ nghĩa hành động xảy ra ngoài ý muốn, không đi với 「行けない」 để nêu không thể tham dự.
Dịch: “Tôi được mời dự đám cưới của bạn nhưng có chuyến công tác nên dù thế nào cũng không thể đi.”
Ghi nhớ: 「どうしても〜ない」 = không thể nào/dù thế nào cũng không; 「せっかく」 thường hàm ý tiếc nếu cơ hội bị bỏ lỡ.`,

  toan_q_2022_12_41: `Đáp án 4 — 「肩のけがのために」: vì chấn thương vai nên vận động viên sẽ không thể thi đấu một thời gian. 「Nのために」 nêu nguyên nhân theo cách trung tính.
1. 途中で: “giữa chừng”; cần nói việc gì xảy ra giữa một quá trình, không nối tự nhiên với chấn thương làm nguyên nhân.
2. 一方で: “mặt khác”; cần vế đối lập hoặc khía cạnh thứ hai, trong khi câu chỉ nêu nguyên nhân và kết quả.
3. ように: “để/sao cho” hoặc “như thể”; không nêu nguyên nhân chấn thương trong câu này.
4. ために: 「Nのために」 = do/vì N; giải thích lý do không thể ra sân trong một thời gian.
Dịch: “Cầu thủ bóng chày mà tôi cổ vũ đã không thể thi đấu một thời gian vì chấn thương vai. Tôi rất lo.”
Ghi nhớ: 「Nのために」 = vì N/do N; 「Vために」 thường chỉ mục đích khi chủ thể chủ động thực hiện hành động.`,

  toan_q_2022_12_42: `Đáp án 2 — 「歯を磨かずに寝てしまう」: ngủ luôn mà không đánh răng. 「Vずに」 diễn tả làm một việc mà không thực hiện V; 「磨かずに」 là dạng của 「磨かないで」.
1. 磨いて: 「歯を磨いて寝る」 là đánh răng rồi ngủ, trái với lời cảnh báo sâu răng.
2. 磨かずに: “không đánh răng rồi…”; nêu rõ hành động ngủ mà bỏ qua việc đánh răng.
3. 磨くたび: “mỗi lần đánh răng”; không hợp với động từ ngủ và lời cảnh báo về việc bỏ đánh răng.
4. 磨かなくて: có thể dùng để nêu nguyên nhân hoặc trạng thái không đánh răng, nhưng trong câu này cần cách nối chỉ việc bỏ qua hành động trước khi ngủ; 「磨かずに」 tự nhiên và trực tiếp hơn.
Dịch: “Nha sĩ: Nếu cứ đi ngủ mà không đánh răng, răng sẽ dễ bị sâu. Hãy cố gắng đánh răng cẩn thận trước khi ngủ.”
Ghi nhớ: 「Vずに」 = không làm V mà…; 「磨く」 là đánh/chải răng.`,

  toan_q_2022_12_43: `Đáp án 3 — 「これから出かけるところだから」: tôi sắp ra ngoài đây, vì vậy lát nữa sẽ gọi lại. 「Vるところ」 là thời điểm ngay trước khi bắt đầu hành động.
1. 出かけるところなのに: “dù sắp ra ngoài”; 「のに」 đòi kết quả trái dự đoán, nhưng gọi lại sau đó không phải kết quả tương phản.
2. 出かけているところなのに: “dù đang ở ngoài/đang chuẩn bị đi”; 「ているところ」 chỉ hành động đang diễn ra và vẫn dùng quan hệ nhượng bộ không hợp.
3. 出かけるところだから: “vì sắp ra ngoài”; nêu lý do không tiện nghe máy và hợp với lời hứa gọi lại sau.
4. 出かけているところだから: “vì đang đi ra ngoài”; có thể dùng khi việc đi đã bắt đầu, nhưng 「これから」 chỉ việc sắp bắt đầu nên 「Vるところ」 khớp hơn.
Dịch: “(Qua điện thoại) Nakagawa: Alo, anh Hayashi, bây giờ nói chuyện một chút có tiện không? — Hayashi: À, xin lỗi. Vì tôi sắp ra ngoài nên lát nữa tôi sẽ gọi lại cho anh.”
Ghi nhớ: 「Vるところ」 = sắp bắt đầu V; 「Vているところ」 = đang V; 「Vたところ」 = vừa mới V.`,

  toan_q_2022_12_44: `Đáp án 1 — 「この坂を上っていくと郵便局があります」: cứ đi lên con dốc này thì sẽ thấy bưu điện. 「Vていく」 nêu hướng đi xa khỏi điểm hiện tại; 「Vと」 diễn tả kết quả tự nhiên khi làm theo hướng dẫn.
1. 上っていくと: “đi lên thì sẽ có/thấy”; hợp với chỉ đường dẫn tới bưu điện phía trước.
2. 上っていきながら: “vừa đi lên vừa…”; cần một hành động đồng thời khác, không có ở câu này.
3. 上ってくるには: “để đi lên đây thì…”; 「には」 thường cần đánh giá/điều kiện tiếp theo, không tạo chỉ dẫn đường này.
4. 上ってくるとき: “khi đi lên đây”; 「くる」 hướng về phía người nói và 「とき」 chỉ thời điểm, không nêu kết quả sẽ gặp bưu điện.
Dịch: “(Trên đường) A: Xin lỗi, tôi đang tìm thư viện Higashi… — B: À, thư viện Higashi ạ. Anh/chị cứ đi lên con dốc này thì sẽ thấy bưu điện; rẽ phải ở góc đó. Đi thêm một chút nữa là tới thư viện.”
Ghi nhớ: 「Vていく」 hướng rời điểm nhìn; 「Vてくる」 hướng về điểm nhìn; 「Vると」 có thể nêu kết quả tự nhiên của một chỉ dẫn.`,

  toan_q_2022_12_45: `Đáp án 4 — 「新しくできたラーメン屋、知ってる？」: “Cậu biết quán ramen mới mở gần ga Sakura không?”. 「知っている」 diễn tả trạng thái đã biết; trong hội thoại thân mật thường rút gọn thành 「知ってる」.
1. 知っとく: rút gọn của 「知っておく」 = biết/ghi nhớ trước; không phải câu hỏi xem bạn đã biết quán đó chưa.
2. 知っちゃう: rút gọn của 「知ってしまう」, “lỡ biết/biết mất”; không tự nhiên khi hỏi về thông tin quen thuộc.
3. 知ってく: 「知っていく」 nói sự hiểu biết tăng dần về sau; không chỉ trạng thái biết hiện tại.
4. 知ってる: dạng nói thân mật của 「知っている」; phù hợp câu hỏi xem bạn có biết quán ramen mới hay chưa.
Dịch: “A: Cậu biết quán ramen mới mở gần ga Sakura không? — B: Không, tớ không biết. — A: Hôm qua tớ mới đến lần đầu, ngon lắm.”
Ghi nhớ: 「知っている」 = biết (trạng thái); 「知っておく」 = biết/ghi nhớ sẵn để dùng sau.`,

  toan_q_2022_12_46: `Đáp án 2 — 「中川がおります」: anh Nakagawa hiện có mặt, để tôi chuyển máy ngay. 「おります」 là khiêm nhường ngữ của 「いる」, phù hợp khi nhân viên nói về đồng nghiệp với khách gọi đến.
1. いたします: khiêm nhường ngữ của 「する」, nghĩa là “làm”; không dùng để nói một người đang có mặt.
2. おります: khiêm nhường ngữ của 「いる」; câu lịch sự từ phía nhân viên khi xác nhận đồng nghiệp đang ở đó.
3. いただきます: khiêm nhường ngữ của 「もらう／食べる」; nghĩa là nhận/dùng bữa, không thể diễn tả sự có mặt.
4. ございます: cách nói lịch sự của 「ある」, thường dùng cho vật/sự việc; không dùng ở đây để nói người Nakagawa đang ở đó.
Dịch: “(Qua điện thoại) Yamashita: Xin chào, phòng kinh doanh xây dựng X, tôi là Yamashita. — Ishida: Tôi là Ishida của ngân hàng ABC. Anh Nakagawa hoặc anh Hayashi có ở đó không ạ? — Yamashita: Vâng, anh Nakagawa đang có mặt, tôi chuyển máy ngay.”
Ghi nhớ: 「おります」 nói khiêm nhường về sự hiện diện của mình/nhóm mình; 「いらっしゃいます」 tôn kính người nghe hoặc người thuộc phía họ.`,

  toan_q_2022_12_47: `Đáp án 2 — 「海外の美術館に行ったことはない」: người nói chưa từng đến bảo tàng ở nước ngoài. 「Vたことがある／ない」 nói về kinh nghiệm đã từng/chưa từng.
1. 行ったこともある: “cũng từng đi”; khẳng định đã có kinh nghiệm, trái với ý đối lập 「国内の美術館が多いが」.
2. 行ったことはない: “thì chưa từng đi”; nêu sự đối lập với việc đã đến nhiều bảo tàng trong nước.
3. 行くこともできる: “cũng có thể đi”; nói khả năng hiện tại/tương lai, không phải kinh nghiệm quá khứ.
4. 行くこともできない: “cũng không thể đi”; nói không có khả năng, trong khi đoạn văn chỉ nói người nói chưa từng đi.
Dịch: “Tôi thích bảo tàng và đến nhiều bảo tàng trong nước, nhưng chưa từng đến bảo tàng nào ở nước ngoài.”
Ghi nhớ: 「Vたことがある」 = đã từng V; 「Vたことはない」 = chưa từng V; 「Vことができる」 = có thể V.`,

  toan_q_2022_12_48: `Đáp án 3 — 「この靴、履いてみてもいいですか」: “Tôi thử mang đôi giày này được không?”. 「Vてみる」 là thử làm; 「〜てもいいですか」 xin phép.
1. 履いてもらえませんか: “anh/chị có thể mang thử giúp tôi không?”; yêu cầu người nghe mang giày, đảo sai người thực hiện.
2. 履かないんですか: “anh/chị không mang à?”; là câu hỏi về người nghe, không phải lời khách xin thử.
3. 履いてみてもいいですか: xin phép tự thử mang giày; đúng lời khách hỏi nhân viên cửa hàng.
4. 履くことになりますか: “sẽ thành ra phải mang à?”; hỏi về quyết định/kết quả, không xin phép thử giày.
Dịch: “(Ở cửa hàng giày) Khách: Xin lỗi, tôi thử mang đôi này được không? — Nhân viên: Xin mời. Cỡ này có vừa chân anh/chị không ạ? — Khách: Vâng.”
Ghi nhớ: 「Vてみる」 = thử V; 「Vてもいいですか」 = tôi làm V có được không; 「Vてもらう」 = nhờ người khác làm V cho mình.`,
}

let updated = 0
for (const exam of exams) {
  if (exam.id !== 'toan-n3-202212-full') continue
  for (const part of exam.parts || []) {
    if (!part.title.includes('Ngữ pháp')) continue
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
console.log(`Updated ${updated} hand-written N3 grammar explanations for December 2022.`)
