import fs from 'node:fs'

const masterPath = 'data/jlpt_n3_toan_master.json'
const curatedPath = 'data/jlpt_n3_explanations_curated.json'
const exams = JSON.parse(fs.readFileSync(masterPath, 'utf8'))
const curated = JSON.parse(fs.readFileSync(curatedPath, 'utf8'))

const updates = {
  toan_q_2023_12_36: `Đáp án 4 — 「外国からの観光客」: khách du lịch đến từ nước ngoài. 「からの＋N」 dùng để bổ nghĩa cho danh từ sau, nêu xuất xứ.
1. で: 「外国で観光客」 có thể nói khách du lịch ở nước ngoài, nhưng không diễn tả nguồn gốc của khách.
2. での: “hoạt động/sự việc ở nước ngoài”; 「外国での観光客」 không tự nhiên khi muốn nói khách nước ngoài.
3. から: “từ nước ngoài”, nhưng trước danh từ 観光客 cần 「の」 để nối cụm bổ nghĩa.
4. からの: 「外国からの観光客」 = du khách đến từ nước ngoài; đúng nghĩa và đúng cấu trúc.
Dịch: “Khu vực này có nhiều chùa và đền cổ, nên cũng được du khách nước ngoài yêu thích.”
Ghi nhớ: 「Nから来る人」 hoặc 「Nからの人」 nêu nơi xuất phát; 「Nでの経験」 nêu sự việc diễn ra tại N.`,

  toan_q_2023_12_37: `Đáp án 3 — 「社員の数は100人にまで増えた」: số nhân viên đã tăng lên đến tận 100 người. 「に」 nêu điểm đạt tới; 「まで」 nhấn mạnh mức tăng.
1. までが: 「まで」 chỉ giới hạn, nhưng 「が」 đánh dấu “đến tận 100 người” làm chủ ngữ một cách không tự nhiên trước 「増えた」.
2. までで: 「で」 thường nêu mốc kết thúc/quy mô, nhưng 「100人までで増えた」 không phải kết hợp tự nhiên ở đây.
3. にまで: 「100人に増える」 là tăng lên thành 100 người; 「まで」 nhấn mạnh quy mô đạt tới con số đó.
4. のまで: không tạo được cấu trúc bổ nghĩa/danh từ phù hợp với 「100人」 và 「増えた」.
Dịch: “Mười năm trước tôi cùng một người bạn thành lập công ty. Trong mười năm, công ty dần lớn mạnh và số nhân viên đã tăng lên đến 100 người.”
Ghi nhớ: 「Nに増える」 = tăng lên thành N; 「Nにまで」 nhấn mạnh đã đạt đến tận N.`,

  toan_q_2023_12_38: `Đáp án 2 — 「よく売れる弁当は天気によって違う」: hộp cơm bán chạy thay đổi tùy theo thời tiết. 「Nによって違う」 nêu yếu tố làm kết quả khác nhau.
1. について: “về/liên quan đến”; không diễn tả sự thay đổi theo thời tiết.
2. によって: “tùy theo/do”; 「天気によって違う」 là khác nhau tùy thời tiết, đúng kết hợp.
3. において: “tại/trong lĩnh vực”; nêu bối cảnh, không phải yếu tố làm món bán chạy thay đổi.
4. に比べて: “so với”; cần một đối tượng so sánh như 「昨日に比べて」, không thể chỉ đặt sau 「天気」 theo nghĩa này.
Dịch: “Một người bạn làm ở cửa hàng cơm hộp nói rằng loại cơm hộp bán chạy thường khác nhau tùy theo thời tiết.”
Ghi nhớ: 「Nによって異なる／違う」 = khác nhau tùy N; 「Nについて」 = về N.`,

  toan_q_2023_12_39: `Đáp án 3 — 「ついに留学できることになった」: cuối cùng người nói đã có thể sang Nhật du học. 「ついに」 báo một kết quả được chờ đợi lâu nay.
1. どうか: “liệu có… hay không/xin hãy”; cần cấu trúc nghi vấn hoặc lời cầu xin, không hợp câu khẳng định kết quả.
2. 決して: “nhất định không”, thường đi với phủ định 「決して〜ない」; câu sau lại khẳng định có thể du học.
3. ついに: “cuối cùng/rốt cuộc”; hợp với mong muốn du học từ thời trung học nay đã thành hiện thực.
4. 今にも: “ngay tức khắc/sắp sửa”; thường nói việc sắp xảy ra, không diễn tả mong ước lâu ngày cuối cùng thành hiện thực.
Dịch: “Cuối cùng tôi đã có thể đi du học ở Nhật Bản, nơi tôi đã muốn đến học từ hồi trung học.”
Ghi nhớ: 「ついに」 = cuối cùng (kết quả sau chờ đợi); 「今にも」 = sắp xảy ra ngay; 「決して」 thường đi với phủ định.`,

  toan_q_2023_12_40: `Đáp án 1 — 「ひどくならないうちに歯医者に診てもらう」: đi khám nha sĩ trước khi sâu răng trở nặng. 「〜ないうちに」 tranh thủ làm việc gì trước khi trạng thái thay đổi.
1. うちに: “trong lúc còn/chưa…”; cần đi khám khi tình trạng chưa nặng, đúng với lời khuyên.
2. ときに: “khi/lúc”; chỉ thời điểm chung, không nhấn mạnh phải hành động trước khi sâu răng nặng lên.
3. までに: “trước hạn chót”; thường cần mốc thời gian cụ thể, không diễn tả trạng thái răng chưa nặng.
4. たびに: “mỗi lần”; nói việc lặp lại, không phù hợp lời khuyên đi khám sớm một lần.
Dịch: “Sâu răng sẽ mất thời gian chữa nếu để nặng rồi mới khám. Điều quan trọng là đi nha sĩ trước khi tình trạng trở nặng.”
Ghi nhớ: 「Vないうちに」 = trước khi không còn/biến đổi trạng thái hiện tại; 「Vたびに」 = mỗi lần V.`,

  toan_q_2023_12_41: `Đáp án 2 — 「通学のしやすさを考えて、大学まで歩いて通える所にした」: đã cân nhắc việc đi học thuận tiện rồi chọn nơi có thể đi bộ đến trường. 「考えて」 nối lý do với quyết định.
1. 考えるように: “để cố gắng nghĩ/thành thói quen suy nghĩ”; không nêu điều người nói đã cân nhắc để chọn nhà.
2. 考えて: thể て nối hành động cân nhắc với quyết định chọn chỗ ở; đúng mạch câu.
3. 考えたのに: “mặc dù đã cân nhắc”; cần kết quả trái mong đợi, trong khi việc chọn nơi đi bộ được là kết quả phù hợp.
4. 考えるのか: câu hỏi gián tiếp “có nghĩ hay không”; không thể nối tự nhiên với 「所にした」.
Dịch: “Từ tháng sau tôi sẽ sống một mình gần trường đại học. Tôi đã cân nhắc việc đi học cho tiện và chọn một nơi có thể đi bộ đến trường.”
Ghi nhớ: 「Vて、結果／quyết định」 nối hành động/căn cứ với điều xảy ra tiếp theo.`,

  toan_q_2023_12_42: `Đáp án 1 — 「一人では全部食べられそうにない」: một mình có vẻ không ăn hết được. 「可能動詞＋そうにない」 dự đoán rằng việc gì đó khó/không thể xảy ra.
1. 食べられそうにない: “có vẻ không thể ăn hết”; hợp với số quýt nhiều và việc đem chia cho bạn.
2. 食べられなくなる: “sẽ trở nên không ăn được”; nói khả năng bị mất trong tương lai, không phải dự đoán hiện tại ăn không hết.
3. 食べられるだろう: “chắc là ăn được”; trái với lý do người nói đem một nửa cho bạn.
4. 食べられたほうがいい: dạng quá khứ khả năng với 「ほうがいい」 không tạo lời dự đoán tự nhiên trong câu này.
Dịch: “Tôi nhận được rất nhiều quýt gửi từ nhà. Tôi nghĩ một mình có vẻ không ăn hết được nên đã chia một nửa cho bạn.”
Ghi nhớ: 「Vられそうにない」 = có vẻ không thể V; 「Vられるだろう」 = có lẽ có thể V.`,

  toan_q_2023_12_43: `Đáp án 4 — 「動物が好きな娘を喜ばせたくて、動物園に連れていった」: vì muốn làm con gái vui nên tôi đưa con đến sở thú. 「喜ばせる」 là sai khiến của 「喜ぶ」: làm cho ai vui.
1. 喜んだら: “nếu con gái vui”; biến việc con gái vui thành điều kiện, không nêu động cơ của người cha/mẹ.
2. 喜びたくて: “vì muốn vui”; chủ thể mong muốn trở thành con gái, không đúng ý người lớn muốn làm con vui.
3. 喜ばせたら: “nếu làm con vui”; nêu giả định điều kiện, trong khi việc đưa con đi đã xảy ra.
4. 喜ばせたくて: “vì muốn làm con vui”; thể hiện mục đích/động cơ dẫn tới việc đưa con đi sở thú.
Dịch: “Vì muốn làm cô con gái hai tuổi rất thích động vật vui, tuần trước lần đầu tiên tôi đưa con đến sở thú.”
Ghi nhớ: 「人を喜ばせる」 = làm ai vui; 「Vたくて」 nối mong muốn/nguyên nhân.`,

  toan_q_2023_12_44: `Đáp án 4 — 「上手に踊れるようになるのに何年かかるかわからない」: không biết sẽ mất bao nhiêu năm để có thể nhảy giỏi. 「〜ようになる」 diễn tả đạt được khả năng/trạng thái; 「〜のに何年かかる」 hỏi thời gian cần thiết.
1. 踊れるようにすると: 「すると」 tạo điều kiện “nếu làm cho có thể nhảy”; không hoàn chỉnh cấu trúc nói mất bao nhiêu năm để bản thân đạt khả năng đó.
2. 踊れるようになっても: “dù có thể nhảy được”; 「ても」 cần vế nhượng bộ, không nối với câu hỏi thời lượng 「何年かかる」.
3. 踊れるようにして: “để cho có thể nhảy”; nối mục đích/cách thức, nhưng không có động từ 「なる」 nêu quá trình đạt kỹ năng cần nhiều năm.
4. 踊れるようになるのに: 「〜ようになる」 = trở nên có thể làm; 「〜のに何年かかる」 = mất bao nhiêu năm để đạt điều đó, đúng ngữ pháp và nghĩa.
Dịch: “Gần đây tôi bắt đầu học ba lê. Tôi không biết sẽ mất bao nhiêu năm mới nhảy giỏi được, nhưng tôi sẽ cố gắng.”
Ghi nhớ: 「Vられるようになる」 = trở nên có thể V; 「Vるのに時間がかかる」 = mất thời gian để V.
Lưu ý đối chiếu: hai bảng đáp án tham khảo ghi lựa chọn 3, nhưng câu hoàn chỉnh 「上手に踊れるようになるのに何年かかる」 cần 「なる」 để nói mất thời gian đạt khả năng. Khóa hiện lưu giữ lựa chọn 4 theo cấu trúc câu; cần bảng khóa gốc để giải quyết bất đồng.`,

  toan_q_2023_12_45: `Đáp án 2 — 「雨の日は散歩に行きたがらない」: ngày mưa, con chó có vẻ không muốn đi dạo. 「〜たがる」 diễn tả mong muốn của người/vật khác qua biểu hiện bên ngoài.
1. 行かなくてはいけない: “phải đi”; trái với việc con chó ghét bị ướt nên không muốn đi.
2. 行きたがらない: 「行きたい」 thành 「行きたがる」 khi nói mong muốn của chủ thể khác; phủ định thành không muốn đi, đúng ngữ cảnh.
3. 行ってもかまわない: “đi cũng không sao”; nói được phép đi, không diễn tả sự không muốn.
4. 行くに違いない: “chắc chắn sẽ đi”; phỏng đoán khẳng định, trái với lý do trời mưa và sợ ướt.
Dịch: “Con chó nhà tôi rất thích đi dạo, nhưng ngày mưa có vẻ nó ghét bị ướt nên không muốn đi dạo.”
Ghi nhớ: 「〜たい」 nói mong muốn của mình; 「〜たがる」 nói điều người khác có vẻ muốn/không muốn.`,

  toan_q_2023_12_46: `Đáp án 3 — 「5階でございます」: “ở tầng 5 ạ”. 「でございます」 là cách nói lịch sự của 「です」, dùng để trả lời vị trí/tầng.
1. がございます: “có …”; cần nói vật/người tồn tại, không trả lời trực tiếp “quầy bán quần áo trẻ em ở tầng mấy?”.
2. がいらっしゃいます: 「いらっしゃる」 là kính ngữ về người đi/đến/ở; 「5階がいらっしゃいます」 sai đối tượng và trợ từ.
3. でございます: 「5階です」 được nói trang trọng hơn; đúng câu trả lời của nhân viên về vị trí quầy hàng.
4. でいらっしゃいます: kính ngữ thường nói về người; tầng lầu không phải người để dùng 「いらっしゃる」.
Dịch: “(Ở cửa hàng bách hóa) Khách: Xin lỗi, quầy quần áo trẻ em ở tầng mấy ạ? — Nhân viên: Ở tầng 5 ạ.”
Ghi nhớ: 「Nでございます」 = là/ở N (cách nói lịch sự); 「いらっしゃる」 dùng tôn kính khi nói về người.
Lưu ý đối chiếu: hai bảng đáp án tham khảo ghi lựa chọn 4, nhưng 「5階でございます」 là câu trả lời vị trí tự nhiên; 「でいらっしゃいます」 là kính ngữ dùng cho người, không dùng để chỉ tầng. Giữ lựa chọn 3 theo ngữ cảnh và phân biệt kính ngữ; cần bảng khóa gốc để chốt.`,

  toan_q_2023_12_47: `Đáp án 3 — 「スーパーまで買いにいってくる」: người nói sẽ đi đến siêu thị mua trứng rồi quay về. 「Vに行く」 nêu mục đích đi; 「〜てくる」 nhìn việc đi làm rồi trở lại.
1. 買ってきておく: “mua mang về và chuẩn bị sẵn”; không nói rõ người nói sẽ đi đến siêu thị ngay bây giờ.
2. 買いにきている: “đang đến đây để mua”; 「くる」 hướng về điểm nhìn của người nghe, trái với người nói đang ở nhà và đi ra siêu thị.
3. 買いにいってくる: “đi mua rồi quay lại”; đúng mục đích thiếu trứng cho bữa tối và lời nói 「ちょっとスーパーまで」.
4. 買っていってしまう: “mua rồi mang đi mất”; 「いってしまう」 hướng rời khỏi nhà, không hàm ý quay lại mang trứng về.
Dịch: “(Ở nhà) A: Thiếu trứng dùng cho bữa tối nên tôi đi siêu thị một lát để mua rồi về nhé. — B: Ừ, được.”
Ghi nhớ: 「買いに行く」 = đi để mua; 「行ってくる」 = đi làm việc gì rồi quay về.`,

  toan_q_2023_12_48: `Đáp án 1 — 「私も今ちょうど電話をしようと思っていたところでした」: tôi cũng vừa đúng lúc đang định gọi cho anh/chị. 「Vようと思っていたところ」 diễn tả vừa định làm việc gì đúng vào thời điểm đó.
1. 思っていたところでした: thể quá khứ + 「ところ」 nêu đúng việc người nói vừa có ý định gọi ngay lúc ấy.
2. 思っているところです: “hiện đang nghĩ”; diễn tả trạng thái hiện tại, không tự nhiên bằng khi đáp lại lời gọi đến vừa đúng lúc.
3. 思っていたからでした: “vì đã nghĩ định gọi”; 「から」 biến phần sau thành lời giải thích nguyên nhân, không tạo câu đáp hoàn chỉnh ở đây.
4. 思っているからです: “vì hiện đang nghĩ”; nêu nguyên nhân ở hiện tại, không diễn tả vừa đúng lúc định gọi.
Dịch: “(Qua điện thoại) Tanaka: Alo, tôi là Tanaka. Anh/chị Yamashita, bây giờ nói chuyện một chút có tiện không? — Yamashita: À, anh Tanaka. Tôi cũng vừa đúng lúc đang định gọi cho anh.”
Ghi nhớ: 「Vようと思う」 = định làm; 「Vようと思っていたところ」 = vừa đúng lúc đang định làm.
Lưu ý đối chiếu: hai bảng đáp án tham khảo ghi lựa chọn 3, nhưng lựa chọn 1 tạo đúng mẫu 「電話をしようと思っていたところでした」 (“vừa định gọi”) và là câu trả lời tự nhiên cho cuộc gọi đến. Giữ khóa 1 theo cấu trúc và ngữ cảnh; cần bảng khóa gốc để giải quyết bất đồng.`,
}

let updated = 0
for (const exam of exams) {
  for (const part of exam.parts || []) {
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
console.log(`Updated ${updated} hand-written N3 grammar explanations for December 2023.`)
