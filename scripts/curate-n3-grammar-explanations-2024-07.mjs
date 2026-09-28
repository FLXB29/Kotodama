import fs from 'node:fs'

const masterPath = 'data/jlpt_n3_toan_master.json'
const curatedPath = 'data/jlpt_n3_explanations_curated.json'
const exams = JSON.parse(fs.readFileSync(masterPath, 'utf8'))
const curated = JSON.parse(fs.readFileSync(curatedPath, 'utf8'))

const updates = {
  toan_q_2024_07_36: `Đáp án 4 — 「楽しい時間を過ごした」: đã có một khoảng thời gian vui vẻ. 「時間を過ごす」 là cụm động từ nhận を cho quãng thời gian được trải qua.
1. で: thường nêu nơi chốn hoặc phương tiện; 「時間で過ごす」 không diễn tả trải qua khoảng thời gian.
2. に: có thể nêu đích đến hoặc thời điểm, nhưng 「時間に過ごす」 không phải kết hợp của 「過ごす」 ở đây.
3. が: đánh dấu chủ ngữ; câu đã có chủ thể là người nói/người bạn, còn 「時間」 là đối tượng của 「過ごす」.
4. を: đánh dấu khoảng thời gian người nói đã trải qua; 「時間を過ごす」 là cách kết hợp tự nhiên.
Dịch: “Tôi gặp lại người bạn thời đại học sau một thời gian dài và đã có những giờ phút vui vẻ.”
Ghi nhớ: 「時間を過ごす」 = trải qua thời gian; 「場所で過ごす」 = trải qua thời gian ở một nơi.`,

  toan_q_2024_07_37: `Đáp án 2 — 「スーパーが2軒あって、どちらへも歩いて行ける」: có hai siêu thị và đi bộ đến cả hai nơi đều được. 「へ」 nêu hướng/đích đi đến, 「も」 bao gồm cả hai lựa chọn.
1. どちらから: “từ phía nào”; hỏi điểm xuất phát, không diễn tả việc đi đến hai siêu thị.
2. どちらへも: “đến cả hai phía/đến siêu thị nào cũng được”; đúng với hai siêu thị ở gần nhà.
3. どちらかでも: “dù chỉ một trong hai”; không khớp ý tiện lợi vì cả hai đều đi bộ được.
4. どちらかまで: “đến tận một trong hai”; か／まで không diễn đạt quan hệ bao gồm cả hai địa điểm.
Dịch: “Gần nhà tôi có hai siêu thị, đi bộ đến siêu thị nào cũng được nên rất tiện.”
Ghi nhớ: 「どちらへも」 = đến cả hai nơi; 「どちらから」 = từ phía nào.`,

  toan_q_2024_07_38: `Đáp án 1 — 「バスの運転手として働いている」: làm việc với tư cách là tài xế xe buýt. 「として」 nêu vai trò/nghề nghiệp đảm nhận.
1. として: “với tư cách là”; nối danh từ chỉ vai trò với 「働く」, đúng ngữ cảnh nghề nghiệp.
2. のほうが: “cái/người bên … hơn”; dùng trong so sánh, không nêu nghề.
3. にとって: “đối với …”; nêu góc nhìn, không chỉ chức danh người làm việc.
4. のほかに: “ngoài … ra”; dùng khi thêm một đối tượng nữa, không thể hiện vai trò.
Dịch: “Từ nhỏ tôi đã rất thích xe buýt, nên hiện đang làm tài xế xe buýt.”
Ghi nhớ: 「Nとして働く」 = làm việc với tư cách/vai trò N.`,

  toan_q_2024_07_39: `Đáp án 2 — 「道が込んでいて、結局遅刻してしまった」: đường tắc nên rốt cuộc vẫn đến muộn. 「結局」 tóm kết kết quả cuối cùng sau một diễn biến.
1. つい: “lỡ/vô tình”; thường nói hành động ngoài ý muốn, không nêu kết quả cuối sau khi thử đi taxi.
2. 結局: “cuối cùng/rốt cuộc”; taxi vẫn không giúp kịp giờ vì tắc đường, nên người nói rốt cuộc bị muộn.
3. 次第に: “dần dần”; diễn tả thay đổi tăng tiến theo thời gian, không phù hợp với kết quả đến muộn.
4. ほとんど: “hầu như”; cần một vị ngữ mang nghĩa gần như hoặc phủ định, không nối tự nhiên với 「遅刻してしまった」 ở đây.
Dịch: “Sáng nay tôi ngủ quên, sắp muộn họp nên đã đi taxi, nhưng đường đông tắc và cuối cùng tôi vẫn đến muộn.”
Ghi nhớ: 「結局」 = kết quả cuối cùng; 「次第に」 = dần dần.`,

  toan_q_2024_07_40: `Đáp án 2 — 「この歌を聞くたびに」: mỗi lần nghe bài hát này, tôi lại nhớ chuyện thời đại học. Mẫu 「Vるたびに」 diễn tả việc B lặp lại mỗi khi A xảy ra.
1. 聞き: gốc bỏ ます không đứng trực tiếp trước 「たびに」; cần thể từ điển 「聞く」.
2. 聞く: thể từ điển nối với 「たびに」 thành 「聞くたびに」, đúng mẫu chỉ sự lặp lại.
3. 聞いた: thể quá khứ không kết hợp trực tiếp với 「たびに」 theo cách này; không nói 「聞いたたび」.
4. 聞いている: 「聞いているたび」 không phải cách nối chuẩn/tự nhiên trong câu này; mẫu thông dụng là 「聞くたびに」.
Dịch: “Mỗi lần nghe bài hát này, tôi lại nhớ đến chuyện thời đại học.”
Ghi nhớ: 「Vるたびに」 = mỗi lần làm V thì lại…; 「見るたびに思い出す」 = mỗi lần nhìn lại nhớ.`,

  toan_q_2024_07_41: `Đáp án 1 — 「帰ってからどうするかはまだ決めていません」: tôi chưa quyết định sẽ làm gì sau khi về nước. 「どうするか」 tạo câu hỏi gián tiếp; 「は」 đưa việc chưa quyết định lên làm chủ đề.
1. するかは: 「どうするか」 = làm gì hay không/làm như thế nào; 「はまだ決めていない」 nói rõ nội dung ấy chưa được quyết định.
2. するかが: 「が」 đặt câu hỏi gián tiếp làm chủ ngữ, nhưng kết hợp 「がまだ決めていない」 khiến chủ thể quyết định bị lệch/thiếu tự nhiên trong hội thoại này.
3. することは: 「どうすること」 không tạo câu hỏi “làm gì”; こと biến hành động thành danh từ.
4. することが: cũng danh từ hóa hành động, không giữ cấu trúc nghi vấn gián tiếp cần có 「か」.
Dịch: “Yuuki: Sau khi tốt nghiệp, An sẽ làm gì? — An: Tôi sẽ về nước, nhưng vẫn chưa quyết định sau khi về sẽ làm gì.”
Ghi nhớ: 「疑問 từ＋Vるか」 tạo câu hỏi gián tiếp; 「〜かは決めていない」 = chưa quyết định xem….`,

  toan_q_2024_07_42: `Đáp án 1 — 「実際に着てみるとぴったりだった」: khi thử mặc thật thì chiếc áo len vừa khít. 「Vてみる」 nghĩa là thử làm V; 「と」 nối với kết quả nhận ra sau khi thử.
1. 着てみると: “khi thử mặc thì”; hợp với lo lắng về cỡ áo và kết quả áo vừa khít.
2. 着たのだから: “vì đã mặc”; nêu lý do đã xảy ra, không diễn tả thao tác thử rồi phát hiện kết quả.
3. 着るとしたら: “nếu giả sử sẽ mặc”; tạo giả định, trái với việc người nói đã nhận áo và thử thực tế.
4. 着ていることで: “bằng việc đang mặc”; nêu phương tiện/nguyên nhân theo danh từ hóa, không diễn tả phát hiện sau khi thử.
Dịch: “Chiếc áo len mua trên mạng đã được giao. Tôi lo cỡ áo có thể hơi rộng, nhưng thử mặc thật thì vừa khít.”
Ghi nhớ: 「Vてみる」 = thử làm V; 「Vてみると」 thường dẫn tới điều nhận thấy sau khi thử.`,

  toan_q_2024_07_43: `Đáp án 4 — 「あしたレポートを出さないといけないのに、まだ終わってなくて」: ngày mai phải nộp báo cáo vậy mà vẫn chưa làm xong. 「〜ないといけない」 diễn tả nghĩa vụ; 「のに」 nêu tình huống trái với mong đợi.
1. 出したほうがよくても: “dù nộp thì tốt hơn”; không nói đây là bài bắt buộc phải nộp ngày mai.
2. 出さなくてもいいのに: “dù không cần nộp”; trái nghĩa với phần báo cáo chưa hoàn thành và lý do phải đến thư viện.
3. 出してはいけなくても: “dù không được nộp”; trái với lịch phải nộp.
4. 出さないといけないのに: “phải nộp vậy mà…”; diễn tả đúng nghĩa vụ và sự trái ngược là bài chưa xong.
Dịch: “A: Hôm nay sau giờ học đi ăn tối không? — B: Xin lỗi, sau giờ học mình định đến thư viện. Ngày mai phải nộp báo cáo mà mình vẫn chưa làm xong.”
Ghi nhớ: 「Vないといけない」 = phải làm V; 「のに」 = vậy mà/mặc dù, nêu sự trái ngược.`,

  toan_q_2024_07_44: `Đáp án 3 — 「この町に住む人々によって続けられている」: lễ hội được những người sống trong thị trấn duy trì từ hơn 100 năm trước. 「によって」 nêu tác nhân trong câu bị động.
1. 続けてもらえる: “được ai đó tiếp tục giúp”; cách nói nhận sự giúp đỡ, không kết hợp tự nhiên với tác nhân 「人々によって」.
2. 続けさせられる: “bị bắt phải tiếp tục”; thể sai khiến bị động, nói người chịu ép buộc, trái với ý lễ hội được duy trì.
3. 続けられている: bị động của 「続ける」 ở trạng thái tiếp diễn: lễ hội hiện vẫn được người dân duy trì; đúng cấu trúc và nghĩa.
4. 続けてくれている: người dân “tiếp tục làm giúp cho mình”; là cách nhìn lợi ích từ phía người nói, không hợp văn tường thuật khách quan với 「によって」.
Dịch: “Lễ hội mùa hè này vẫn được những người sống trong thị trấn duy trì từ hơn 100 năm trước.”
Ghi nhớ: 「NによってVられている」 = đang được thực hiện/duy trì bởi N.`,

  toan_q_2024_07_45: `Đáp án 1 — 「このクッキー、どこで買ったの？」: “Bạn mua chiếc bánh quy này ở đâu vậy?”. 「の」 ở cuối câu hỏi thân mật làm câu hỏi mềm hơn.
1. 買ったの: hỏi thông tin mới về nơi mua; đúng với câu trả lời 「さくらデパートだよ」.
2. 買ったよね: “bạn đã mua rồi nhỉ?”; thường xác nhận một điều người hỏi đã biết, không hỏi nơi mua mới.
3. 買ったことある: “đã từng mua chưa”; cần trợ từ 「か」 hoặc ngữ điệu câu hỏi, và hỏi trải nghiệm chứ không hỏi địa điểm.
4. 買ったんじゃない: “chẳng phải đã mua … sao?”; là câu xác nhận/phỏng đoán và cũng thiếu cách hỏi 「どこで」 tự nhiên.
Dịch: “A: Chiếc bánh quy này ngon nhỉ. Bạn mua ở đâu vậy? — B: Ở cửa hàng bách hóa Sakura.”
Ghi nhớ: 「Vたの？」 có thể là câu hỏi thân mật; 「Vたよね」 thường xác nhận điều đã biết.`,

  toan_q_2024_07_46: `Đáp án 3 — 「エアコンはつけたままにしておいてください」: xin hãy để điều hòa bật nguyên như vậy, vì sau đó còn dùng phòng họp. 「Vておく」 chỉ việc giữ/chuẩn bị trạng thái cho lúc sau.
1. していませんか: hỏi “có đang không làm/để không?”; không phải lời nhờ giữ điều hòa bật.
2. なっていませんか: hỏi một trạng thái “đã thành/chuyển thành… chưa”; 「なる」 không có nghĩa chủ động giữ thiết bị bật.
3. しておいてください: 「そのままにしておく」 = để nguyên/giữ nguyên; là lời nhờ lịch sự đúng với 「あとでまた使う」.
4. なっておいてください: 「なる」 là tự trở thành một trạng thái; kết hợp này không diễn tả việc chủ động để điều hòa tiếp tục bật.
Dịch: “(Trong phòng họp) A: Cảm ơn mọi người về cuộc họp. Sau này còn dùng phòng này, nên xin hãy để điều hòa bật nguyên nhé. — B: Vâng, tôi hiểu rồi.”
Ghi nhớ: 「Vておく」 = làm trước hoặc duy trì trạng thái cho về sau; 「そのままにしておく」 = để nguyên như vậy.`,

  toan_q_2024_07_47: `Đáp án 2 — 「忘れることは、必ずしも悪いことではない」: “quên đi không nhất thiết là điều xấu”. 「必ずしも〜ない」 phủ định tính đúng trong mọi trường hợp.
1. 悪いことなのだ: khẳng định “là điều xấu”, ngược với ý phủ định khái quát.
2. 悪いことではない: “không phải là điều xấu”; hoàn thành mẫu 「必ずしも〜ではない」 = không nhất thiết/không hẳn là…
3. 悪いことのはずだ: 「はずだ」 là chắc hẳn/phải là; khẳng định kết luận, không đi với ý phủ định “必ずしも”.
4. 悪いことかもしれない: “có thể là điều xấu”; chỉ phỏng đoán khả năng, không tạo mẫu 「必ずしも〜ない」.
Dịch: “Trong tạp chí tôi đọc hôm qua có viết: ‘Quên đi không nhất thiết là điều xấu’.”
Ghi nhớ: 「必ずしも＋phủ định」 = không nhất thiết/không hẳn là….`,

  toan_q_2024_07_48: `Đáp án 3 — 「先生は、ふだん何かスポーツをなさいますか」: hỏi thầy/cô có thường chơi môn thể thao nào không. 「なさる」 là kính ngữ của 「する」.
1. いたしますか: khiêm nhường của 「する」, dùng để nói hành động của phía người nói; ở đây học sinh hỏi hành động của thầy/cô.
2. まいりますか: khiêm nhường của 「行く／来る」, nghĩa là đi/đến; không thay cho 「スポーツをする」.
3. なさいますか: kính ngữ tôn trọng người nghe của 「する」; kết hợp tự nhiên với 「スポーツをする」 và 「ふだん」.
4. いらっしゃいますか: kính ngữ của đi/đến/ở; không dùng với 「スポーツを」 để hỏi “chơi thể thao”.
Dịch: “Học sinh: Bình thường thầy/cô có chơi môn thể thao nào không ạ? — Thầy/cô: Có. Thỉnh thoảng tôi đi chơi golf.”
Ghi nhớ: 「なさる」 tôn kính hành động của người khác; 「いたす」 khiêm nhường hành động của mình.`,
}

let updated = 0
let fixedOption = false
for (const exam of exams) {
  for (const part of exam.parts || []) {
    for (const question of part.questions || []) {
      if (question.id === 'toan_q_2024_07_46' && question.options?.[2] === '2.しておいてください') {
        question.options[2] = '3.しておいてください'
        fixedOption = true
      }
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
if (!fixedOption) throw new Error('Expected to correct the duplicated option label in question 46.')

fs.writeFileSync(masterPath, `${JSON.stringify(exams, null, 2)}\n`, 'utf8')
fs.writeFileSync(curatedPath, `${JSON.stringify(curated, null, 2)}\n`, 'utf8')
console.log(`Updated ${updated} grammar explanations and fixed the duplicated choice label in 2024/07 question 46.`)
