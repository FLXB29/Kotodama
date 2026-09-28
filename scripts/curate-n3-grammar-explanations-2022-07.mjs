import fs from 'node:fs'

const masterPath = 'data/jlpt_n3_toan_master.json'
const curatedPath = 'data/jlpt_n3_explanations_curated.json'
const exams = JSON.parse(fs.readFileSync(masterPath, 'utf8'))
const curated = JSON.parse(fs.readFileSync(curatedPath, 'utf8'))

const updates = {
  toan_q_2022_07_35: `Đáp án 3 — 「私には辛すぎた」: với riêng người nói, món cà ri cay quá. 「には」 đánh dấu góc nhìn/người chịu tác động trong đánh giá.
1. で: 「私で辛すぎた」 không phải cách nói tự nhiên để diễn tả món ăn quá cay đối với mình.
2. へ: chỉ hướng di chuyển, không dùng để nêu người cảm nhận vị cay.
3. には: “đối với tôi”; hợp khi khẩu vị của người nói khác với bạn đã gọi cùng món.
4. より: “hơn/so với”; cần đối tượng hoặc tiêu chuẩn so sánh, không thể hiện người chịu cảm giác cay.
Dịch: “Bạn tôi nói có quán cà ri ngon nên dẫn tôi đến. Tôi gọi món giống bạn, nhưng với tôi thì nó cay quá.”
Ghi nhớ: 「私には難しい／辛い」 = đối với tôi thì khó/cay; 「より」 dùng trong so sánh.`,

  toan_q_2022_07_36: `Đáp án 2 — 「『大きな家』って絵本」: quyển truyện tranh tên là “Ngôi nhà lớn”. 「って」 là cách nói thân mật dùng để trích/tóm tên gọi, gần với 「という」.
1. と: có thể nối danh từ trong phép liệt kê hoặc làm dấu trích dẫn, nhưng 「『大きな家』と絵本」 không tạo cách gọi tên cuốn sách tự nhiên ở đây.
2. って: khẩu ngữ của cách nêu tên/chủ đề 「という」; “quyển truyện tên là…”, hợp với câu hỏi 「知ってる？」.
3. でも: “hay là/ví dụ như”; không nối tên cụ thể với danh từ 絵本 theo ý này.
4. なんか: “như là/cái kiểu…” thường mang sắc thái xem nhẹ hoặc nêu ví dụ; không tự nhiên khi hỏi người nghe có biết một cuốn sách tên như vậy không.
Dịch: “A: Cậu biết quyển truyện tranh tên là ‘Ngôi nhà lớn’ không? — B: Ừ, tớ biết. Hồi nhỏ tớ thích nó lắm.”
Ghi nhớ: 「Nって」 trong hội thoại có thể là dạng rút gọn của 「Nという」 khi nhắc tên hoặc chủ đề.`,

  toan_q_2022_07_37: `Đáp án 4 — 「ちっとも面白くなかった」: hoàn toàn chẳng thú vị chút nào. 「ちっとも」 thường đi với phủ định để nhấn mạnh mức độ bằng không.
1. やっと: “cuối cùng/mãi mới”; nói việc sau chờ đợi, không bổ nghĩa tự nhiên cho đánh giá phủ định về bộ phim.
2. すっかり: “hoàn toàn”; thường nói trạng thái đã thay đổi/hết hẳn, không mang nghĩa “chẳng thú vị chút nào”.
3. せっかく: “đã mất công/hiếm có”; cần nêu cơ hội hoặc nỗ lực bị phí, không đứng ở vị trí này để phủ định mức độ thú vị.
4. ちっとも: “chẳng… chút nào”; kết hợp với 「面白くなかった」 để đối lập điều người nói nghe trước đó với trải nghiệm thực tế.
Dịch: “Bộ phim hôm qua tôi xem chẳng thú vị chút nào, dù trước đó tôi nghe nói nó hay.”
Ghi nhớ: 「ちっとも〜ない」 = hoàn toàn không; 「やっと」 = cuối cùng sau một thời gian chờ/khó khăn.`,

  toan_q_2022_07_38: `Đáp án 1 — 「一年中売っているパンのほかに」: ngoài loại bánh bán quanh năm ra, còn có bánh ra mắt theo mùa. 「Nのほかに」 dùng để bổ sung thêm một mục.
1. のほかに: “ngoài N ra”; nối hai nhóm bánh, đúng với 「季節ごとに発売されるパンもある」.
2. のことで: “về/vì việc N”; không tạo quan hệ liệt kê hai loại bánh.
3. に比べて: “so với”; câu không so sánh mức độ giữa hai loại bánh mà bổ sung thêm loại thứ hai.
4. について: “về”; nêu chủ đề, không nối hai nhóm theo nghĩa “ngoài ra còn có”.
Dịch: “Tiệm bánh gần nhà có nhiều loại bánh. Ngoài các loại bán quanh năm, còn có bánh được ra mắt theo từng mùa.”
Ghi nhớ: 「Nのほかに」 = ngoài N ra; 「Nに比べて」 = so với N; 「Nについて」 = về N.`,

  toan_q_2022_07_39: `Đáp án 2 — 「プロのサッカー選手として活動する一方で」: vừa hoạt động như cầu thủ bóng đá chuyên nghiệp, vừa học khoa học thể thao ở cao học. 「一方で」 đặt hai hoạt động song song của cùng chủ thể.
1. 点で: “xét ở điểm”; cần nêu tiêu chí đánh giá, không nối hai hoạt động song song.
2. 一方で: “mặt khác/đồng thời”; hợp với việc người chồng vừa là vận động viên chuyên nghiệp vừa học cao học.
3. としたら: “nếu giả sử”; đặt điều kiện giả định, trong khi câu kể sự thật hiện tại.
4. のだから: “vì là/do”; nêu nguyên nhân, nhưng học khoa học thể thao không được trình bày như nguyên nhân cho sự nghiệp cầu thủ.
Dịch: “Chồng tôi vừa hoạt động với tư cách cầu thủ bóng đá chuyên nghiệp, vừa học khoa học thể thao ở cao học.”
Ghi nhớ: 「A一方でB」 có thể nêu hai mặt/hoạt động song hành; 「AのだからB」 nêu căn cứ hoặc nguyên nhân.`,

  toan_q_2022_07_40: `Đáp án 2 — 「暑くなる前に」: trước khi trời nóng lên, người nói muốn kiểm tra điều hòa. 「Vる前に」 nêu việc cần làm trước một mốc/sự việc.
1. 暑くなるまで: “cho đến khi trời nóng”; không nhấn mạnh kiểm tra trước mùa nóng, là thời điểm cần chuẩn bị.
2. 暑くなる前に: “trước khi trời nóng lên”; hợp với việc kiểm tra sẵn điều hòa trước mùa hè.
3. 暑くするまで: 「暑くする」 là làm cho nóng lên; không hợp ý thời tiết tự nóng lên.
4. 暑くする前に: “trước khi làm nóng”; cùng sai chủ thể như lựa chọn 3.
Dịch: “Sắp đến mùa hè rồi. Trước khi trời nóng lên, tôi định kiểm tra xem điều hòa có chạy bình thường không.”
Ghi nhớ: 「Vる前に」 = trước khi V; 「まで」 = đến tận khi/mốc kết thúc; 「暑くなる」 là trời trở nên nóng.`,

  toan_q_2022_07_41: `Đáp án 3 — 「1か月ぐらいしか使っていない」: mới chỉ dùng khoảng một tháng. 「しか」 giới hạn số lượng/thời gian và đi với vị ngữ phủ định 「使っていない」.
1. ごろしか: 「ごろ」 chỉ khoảng thời điểm, không dùng để nói thời lượng sử dụng; cách ghép này không tự nhiên.
2. ごろだけ: cũng biến một khoảng thời điểm thành mốc, trong khi 「1か月」 ở đây là thời gian đã dùng.
3. ぐらいしか: “chỉ khoảng chừng”; kết hợp 「しか〜ない」 để nói thời gian sử dụng rất ngắn trước khi máy hỏng.
4. ぐらいだけ: 「だけ」 không đứng tự nhiên trước vị ngữ phủ định 「使っていない」 với nghĩa “chỉ mới dùng chừng một tháng”; mẫu thường dùng ở đây là 「しか〜ない」.
Dịch: “Tôi mới dùng chiếc máy tính mới mua được khoảng một tháng mà nó đã hỏng rồi.”
Ghi nhớ: 「数量＋しか＋否定」 = chỉ có/chỉ làm từng ấy, không hơn; 「ごろ」 dùng với thời điểm như 「3時ごろ」.`,

  toan_q_2022_07_42: `Đáp án 3 — 「飲むと眠くなることがあるので」: vì đôi khi uống thuốc này sẽ buồn ngủ. 「ことがある」 nêu một khả năng/thỉnh thoảng xảy ra.
1. なればいいので: “nếu trở nên buồn ngủ thì tốt”; biến tác dụng phụ thành mong muốn, không hợp lời cảnh báo.
2. なったばかりなので: “vì vừa mới buồn ngủ”; không tự nhiên làm hướng dẫn chung về tác dụng thuốc.
3. なることがあるので: “vì có khi sẽ trở nên…”; giải thích lý do không lái xe sau khi uống thuốc.
4. なってはいけないので: “vì không được buồn ngủ”; không phải điều người uống có thể ngăn chặn và không nêu cảnh báo tác dụng phụ.
Dịch: “(Ở hiệu thuốc) Nhân viên: Hãy uống thuốc này ba lần một ngày sau bữa ăn. Vì thuốc đôi khi gây buồn ngủ, sau khi uống xin đừng lái xe.”
Ghi nhớ: 「Vることがある」 = có khi/thỉnh thoảng V; 「〜ので」 nêu nguyên nhân.`,

  toan_q_2022_07_43: `Đáp án 4 — 「皆さんの応援のおかげです」: nhờ sự cổ vũ của mọi người nên mới vô địch. 「おかげ」 ghi nhận nguyên nhân mang lại kết quả tốt.
1. はずです: “chắc là/đáng lẽ”; diễn tả suy luận hoặc điều được dự đoán, không cảm ơn người cổ vũ.
2. ようです: “có vẻ”; nêu phỏng đoán, không phù hợp câu trả lời về nguyên nhân thành công.
3. ことです: “là việc…”; không tạo cụm nguyên nhân 「応援のこと」 theo nghĩa “nhờ cổ vũ”.
4. おかげです: “là nhờ…”; kết hợp tự nhiên với 「皆さんの応援」 để cảm ơn mọi người.
Dịch: “(Trong buổi phỏng vấn) Vận động viên: Tôi vô địch được là nhờ mọi người cổ vũ. Xin cảm ơn rất nhiều.”
Ghi nhớ: 「Nのおかげで」 = nhờ N (kết quả tốt); 「Nのせいで」 = do N (kết quả xấu).`,

  toan_q_2022_07_44: `Đáp án 1 — 「またあとでかけ直します」: “lát nữa tôi sẽ gọi lại”. 「かけ直す」 là gọi lại một lần nữa sau khi cuộc gọi trước chưa tiện trao đổi.
1. かけ直します: “gọi lại”; phù hợp lời người gọi đáp sẽ liên lạc sau khi Tanaka đang bận họp.
2. かけ出します: 「出す」 có thể chỉ bắt đầu đột ngột; 「電話をかけ出す」 không có nghĩa gọi lại.
3. かけています: “đang gọi”; không phù hợp vì cuộc trò chuyện hiện tại sắp kết thúc và người nói hẹn gọi sau.
4. かけておきます: “gọi sẵn/làm trước”; không diễn tả gọi lại sau cuộc gọi đang bận.
Dịch: “(Qua điện thoại) Tanaka: Alo, tôi là Tanaka ở phòng kinh doanh. — Ishiyama: Tôi là Ishiyama ở phòng kế toán, bây giờ nói chuyện một chút được không? — Tanaka: Xin lỗi, tôi sắp vào họp. — Ishiyama: Tôi hiểu rồi. Vậy lát nữa tôi sẽ gọi lại.”
Ghi nhớ: 「V直す」 = làm lại V; 「電話をかけ直す」 = gọi lại.`,

  toan_q_2022_07_45: `Đáp án 4 — 「帰りにスーパーで卵を買ってきてくれない？」: tiện đường về, anh mua trứng ở siêu thị mang về giúp em nhé? 「Vてくれる？」 là lời nhờ thân mật; 「買ってくる」 đi mua rồi mang về điểm nhìn.
1. 買っていってもらわない: thể phủ định của 「てもらう」 không tạo lời nhờ rõ ràng; 「いく」 hướng mang trứng rời khỏi điểm nhìn, trái với việc mua rồi về nhà.
2. 買っていってくれない: cấu trúc nhờ thân mật có thể hiểu, nhưng 「ていく」 nói mang trứng đi khỏi nhà/điểm nhìn; câu cần mua trên đường về và đem trứng về.
3. 買ってきてもらわない: hướng “mua mang về” đúng, nhưng câu hỏi dùng 「てもらわない」 không phải lời nhờ trực tiếp tự nhiên của người vợ với chồng trong ngữ cảnh này.
4. 買ってきてくれない: nhờ người nghe mua rồi mang về; khớp với 「帰りにスーパーで」 và lời đáp nhận lời 「わかった」.
Dịch: “(Ở cửa ra vào) Vợ: Ủa, anh đi ra ngoài à? Đi dạo sao? — Chồng: Ừ. — Vợ: Vậy lúc về anh mua trứng ở siêu thị giúp em nhé? — Chồng: Được.”
Ghi nhớ: 「Vてくる」 thường diễn tả đi làm V rồi quay lại; 「Vていく」 nhìn hành động rời xa điểm nhìn; 「Vてくれない？」 là lời nhờ thân mật.`,

  toan_q_2022_07_46: `Đáp án 1 — 「4月から留学することにしたんです」: “từ tháng 4 tôi đã quyết định đi du học”. 「Vことにする」 diễn tả quyết định do chính người nói đưa ra.
1. 留学することにした: quyết định đi du học; trả lời trực tiếp câu hỏi về việc nghỉ việc từ tháng 3.
2. 留学することにしそう: “có vẻ sắp quyết định đi du học”; nhận định về một quyết định chưa ngã ngũ, không tự nhiên khi chính người nói giải thích kế hoạch đã chọn.
3. 留学したことがある: “đã từng đi du học”; nói kinh nghiệm trong quá khứ, không phải kế hoạch bắt đầu tháng 4.
4. 留学したことがありそう: “có vẻ đã từng đi du học”; suy đoán kinh nghiệm của người khác, không phù hợp lời tự thuật.
Dịch: “Murayama: Anh Nakano nghỉ việc vào tháng 3 là thật à? — Nakano: Vâng, từ tháng 4 tôi quyết định đi du học.”
Ghi nhớ: 「Vことにする」 = tự quyết định V; 「Vことになる」 = được quyết định/sắp xếp; 「Vたことがある」 = đã từng V.`,

  toan_q_2022_07_47: `Đáp án 3 — 「暗証番号は決して他人に知られないようにしてください」: xin hãy tuyệt đối giữ để người khác không biết mã PIN. 「知られる」 là bị động của 「知る」; 「〜ないようにしてください」 là lời yêu cầu phòng tránh.
1. 知ってはいけません: “không được biết”; ngụ ý người đọc không được biết mã PIN, chứ không yêu cầu bảo vệ mã khỏi người khác.
2. 知らせにくいです: “khó thông báo”; 「知らせる」 là chủ động báo cho ai, không phải lời hướng dẫn bảo mật.
3. 知られないようにしてください: “hãy đảm bảo không bị người khác biết”; phù hợp với 「他人に」 và 「決して」 trong hướng dẫn ngân hàng.
4. 知らないほうがいいでしょう: “không biết thì tốt hơn”; nói về việc người đọc nên tránh biết thứ gì, không diễn tả việc ngăn người khác biết mã.
Dịch: “(Trên trang web ngân hàng) Xin hãy tuyệt đối không để người khác biết mã PIN của thẻ ngân hàng.”
Ghi nhớ: 「人に知られる」 = bị người khác biết; 「Vないようにしてください」 = xin hãy chú ý để không V.`,
}

let updated = 0
for (const exam of exams) {
  if (exam.id !== 'toan-n3-202207-full') continue
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
console.log(`Updated ${updated} hand-written N3 grammar explanations for July 2022.`)
