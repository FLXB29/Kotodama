import fs from 'node:fs'

const masterPath = 'data/jlpt_n3_toan_master.json'
const curatedPath = 'data/jlpt_n3_explanations_curated.json'
const exams = JSON.parse(fs.readFileSync(masterPath, 'utf8'))
const curated = JSON.parse(fs.readFileSync(curatedPath, 'utf8'))
const grammar201407SourceReview = JSON.parse(fs.readFileSync('reports/n3-quality-audit/grammar-source-2014-07-m1-review.json', 'utf8'))
const grammar201407AnswerKeyReview = JSON.parse(fs.readFileSync('reports/n3-quality-audit/grammar-answer-key-2014-07-review.json', 'utf8'))

const sets = {
  '201412': {
    examId: 'toan-n3-201412-full',
    answers: [2, 3, 2, 1, 1, 4, 2, 3, 4, 3, 4, 2, 1],
    source: 'https://passjapanese.com/ja/jlpt/n3/exam/2014-12-grammar-reading; https://www.studocu.com/in/document/chennai-institute-of-technology/japanese-n3-shinkanzen/jlpt-n3-2014%E5%B9%B412%E6%9C%88%E7%9C%9F%E9%A2%98%E5%8F%8A%E7%AD%94%E6%A1%88%E8%A7%A3%E6%9E%90/159498580',
    method: 'Question text was compared with the independent PassJapanese and VNJPClub test transcriptions; answer choices were checked against the complete Japanese sentence. A nonofficial answer compilation was also consulted where its extracted sequence was legible. This is not an official JLPT answer key.',
    explanations: [
      `Đáp án 2 — 「きれいな色をしている」: có màu sắc đẹp. 「Nをしている」 mô tả diện mạo/đặc điểm bên ngoài.
1. が: đánh dấu chủ ngữ, không tạo kết hợp 「色がしている」 ở nghĩa “mang màu”.
2. を: là trợ từ trong mẫu 「色をしている」, đúng.
3. も: “cũng”, cần một ý song song trước đó; không hợp câu miêu tả đơn.
4. より: “hơn/so với”, cần đối tượng so sánh.
Dịch: “Con cá Mori nuôi có màu sắc rất đẹp.”
Ghi nhớ: 「赤い色をしている」 = có màu đỏ; không dịch を riêng.` ,
      `Đáp án 3 — 「ラーメンやスパゲティに比べて」: so với mì ramen và mì Ý thì soba ít calo hơn.
1. について: “về”, chỉ chủ đề chứ không so sánh mức calo.
2. において: “tại/trong lĩnh vực”, không hợp phép so sánh món ăn.
3. に比べて: “so với”, kết hợp tự nhiên với 「低い」.
4. にしたがって: “theo/cùng với”, diễn tả biến đổi tương ứng, không phải so sánh trực tiếp.
Dịch: “Soba có lượng calo thấp hơn ramen và mì Ý.”
Ghi nhớ: 「Nに比べて」 = so với N.` ,
      `Đáp án 2 — 「買ったばかりなのに」: dù mới mua tháng trước mà đã muốn cây đàn khác. 「Vたばかり」 chỉ việc vừa mới xảy ra.
1. あいだ: “trong lúc”; cần khoảng thời gian kéo dài.
2. ばかり: đúng mẫu 「Vたばかりなのに」, nhấn mạnh thời gian mới xảy ra.
3. たび: “mỗi lần”; cần 「Vるたびに」.
4. ころ: “vào khoảng lúc”; không đi với 「買った」 để tạo nghĩa “vừa mới”.
Dịch: “Em trai tôi mới mua một cây đàn guitar tháng trước vậy mà đã nói muốn cây khác.”
Ghi nhớ: 「Vたばかり」 = vừa mới V.` ,
      `Đáp án 1 — 「自分も早くああなりたい」: tôi cũng muốn sớm trở nên như thế. 「ああ」 chỉ trạng thái/cách làm đã được nhắc tới.
1. ああ: “như vậy”, thay cho hình ảnh tiền bối đang làm việc đầy phong cách.
2. あんな: phải đứng trước danh từ, như 「あんな人」; không đứng trực tiếp trước 「なりたい」.
3. そういう: “kiểu như thế”, thường bổ nghĩa danh từ và không tự nhiên trong kết cấu này.
4. そこも: “cả chỗ đó”, chỉ nơi chốn, sai nghĩa.
Dịch: “Khi vào công ty, nhìn các anh chị đi trước làm việc rất phong cách, tôi nghĩ mình cũng muốn sớm được như vậy.”
Ghi nhớ: 「ああなる」 = trở nên như thế.` ,
      `Đáp án 1 — 「次第に晴れてきて」: trời dần quang đãng. 「次第に」 diễn tả thay đổi tiến triển theo thời gian.
1. 次第に: “dần dần”, nối hợp lý với kết quả buổi chiều trời quang.
2. 今にも: “ngay lúc này có vẻ sắp”; thường đi với sự việc sắp xảy ra, không tả diễn tiến đã bắt đầu.
3. まだ: “vẫn/còn”, không diễn tả trời chuyển dần từ nhiều mây sang nắng.
4. いつでも: “bất cứ lúc nào”, không phù hợp mốc thời gian cụ thể.
Dịch: “Buổi sáng trời âm u, nhưng dần dần hửng nắng và đến chiều thì quang đãng.”
Ghi nhớ: 「次第に」 = dần dần.` ,
      `Đáp án 4 — 「買ったんじゃなくて、自分で作った」: không phải mua mà tự làm. 「AんじゃなくてB」 đính chính A thành B.
1. 買ったんだって: “nghe nói đã mua”; không thể đối lập tự nhiên với vế “tự làm”.
2. 買わなくたって: “dù không mua thì…”; cần mệnh đề kết quả khác.
3. 買ってもよくて: “dù mua cũng được/và mua cũng tốt”; sai quan hệ đính chính.
4. 買ったんじゃなくて: “không phải đã mua mà là”; đúng với lời giải thích.
Dịch: “À, sợi dây chuyền này không phải mua đâu, tôi tự làm đấy.”
Ghi nhớ: 「AのではなくてB」/「AんじゃなくてB」 = không phải A mà là B.` ,
      `Đáp án 2 — 「ご存じですか」: quý vị có biết không? Đây là kính ngữ của 「知っている」.
1. なさいます: kính ngữ của 「する」, không mang nghĩa “biết”.
2. ご存じです: cách nói kính trọng “biết”, phù hợp khi hỏi khán giả.
3. 申します: khiêm nhường ngữ của 「言う」, dùng cho lời người nói chứ không hỏi tri thức.
4. お目にかかります: khiêm nhường ngữ “gặp”, sai nghĩa.
Dịch: “Quý vị có biết Internet đã có lịch sử hơn 40 năm không?”
Ghi nhớ: 「ご存じですか」 = 「知っていますか」 ở kính ngữ.` ,
      `Đáp án 3 — 「教えてほしいんですが」: tôi muốn anh/chị chỉ cho (một nha sĩ tốt). Đây là cách nhờ vả gián tiếp.
1. 教えたい: “tôi muốn chỉ”, đảo ý định sang người nói.
2. 教えていいですか: “tôi chỉ có được không?”, cũng đảo người thực hiện.
3. 教えてほしい: “muốn anh/chị chỉ cho”, hợp với lời nhờ vì đang đau răng.
4. 教えてもらっていますか: “đang được chỉ cho à?”, thành câu hỏi về việc đã xảy ra.
Dịch: “Nếu anh biết nha sĩ nào tốt gần công ty thì tôi muốn nhờ anh chỉ giúp. Răng tôi đau quá.”
Ghi nhớ: 「人にVてほしい」 = muốn người đó V.` ,
      `Đáp án 4 — 「1個ずつしか残っていなかった」: chỉ còn mỗi loại một cái. 「しか」 đi với phủ định để giới hạn số lượng.
1. ぐらい: “khoảng”, không tạo nghĩa “chỉ còn”.
2. ぐらいから: “từ khoảng”, không hợp với 「残る」 ở đây.
3. ずつと: không phải kết hợp chuẩn; 「ずつ」 cần vị trí ngay sau số lượng.
4. ずつしか: 「一個ずつしか～ない」 = mỗi thứ chỉ còn một; khớp 「残っていなかった」.
Dịch: “Tôi đến tiệm bánh lúc chiều thì gần như bán hết; bánh sô-cô-la và bánh phô mai mỗi loại chỉ còn một cái.”
Ghi nhớ: 「数量＋ずつしか～ない」 = mỗi phần chỉ có từng ấy.` ,
      `Đáp án 3 — 「授業のことでも何でも相談してください」: cứ trao đổi bất cứ chuyện gì, chẳng hạn việc học.
1. か何かが: “hay gì đó” kèm が, không nối tự nhiên với 「相談する」.
2. とか何かに: cách liệt kê và trợ từ に không phù hợp với 「授業のこと」 làm đề tài tư vấn.
3. でも何でも: 「Nでも何でも」 mở rộng phạm vi thành “N hay bất cứ việc gì”; đúng lời mời.
4. など何も: kết hợp này sai/không tạo lời khuyến khích tự nhiên.
Dịch: “Nếu gặp khó khăn trong đời sống đại học, cứ trao đổi với anh/chị bất cứ chuyện gì, kể cả việc học nhé.”
Ghi nhớ: 「Nでも何でも相談する」 = tư vấn bất cứ chuyện gì, kể cả N.` ,
      `Đáp án 4 — 「サイズが合うか不安だった」: tôi lo không biết kích cỡ có vừa không.
1. 合って不安がない: “vừa và không lo”, ngược với mối lo trước khi mặc thử.
2. 合ったから不安だ: “vì vừa nên lo”, quan hệ nghĩa không hợp.
3. 合うし不安もない: “vừa và cũng không lo”, không khớp với 「が」 rồi 「ちょうどよかった」.
4. 合うか不安だった: 「か」 đánh dấu điều chưa biết, đúng với nỗi lo về kích cỡ.
Dịch: “Áo len đặt trên mạng khiến tôi lo không biết mặc thử có vừa không, nhưng hóa ra vừa đúng.”
Ghi nhớ: 「～か不安だ」 = lo không biết liệu có… hay không.` ,
      `Đáp án 2 — 「作りすぎてしまう」: thường lỡ nấu quá nhiều. 「Vすぎる」 là quá mức; 「てしまう」 diễn tả kết quả ngoài ý muốn.
1. 作り出している: “đang bắt đầu chế tạo”, không diễn tả lượng thức ăn thừa.
2. 作りすぎてしまう: nấu vượt nhu cầu và thường thành ra như vậy; đúng với khó nấu một phần.
3. 作り終わったところだ: “vừa làm xong”, không diễn tả thói quen nấu quá nhiều.
4. 作っておこう: “hãy làm sẵn”, là ý định, không khớp 「いつも」.
Dịch: “Từ tháng trước tôi sống một mình, nhưng nấu phần ăn cho một người khó quá nên lúc nào tôi cũng nấu dư.”
Ghi nhớ: 「Vすぎてしまう」 = lỡ/quá tay khi V.` ,
      `Đáp án 1 — 「話を聞いてあげられなかった」: tôi đã không thể dành thời gian nghe bạn tâm sự. 「～てあげる」 thể hiện việc làm cho người khác; thể khả năng phủ định là không thể làm.
1. 聞いてあげられなかった: không thể lắng nghe giúp bạn vì bận; khớp 「仕事が忙しくて」.
2. 聞いてあげてよかった: “may mà đã nghe”, trái với tình huống đã không thể.
3. 聞いたほうがよかった: “đáng lẽ nên nghe”, là tiếc nuối/lời khuyên, không nối tự nhiên bằng quá khứ đã nêu.
4. 聞いてもかまわなかった: “nghe cũng không sao”, nói sự cho phép chứ không phải không thể giúp.
Dịch: “Tôi biết bạn mình đang phiền muộn, nhưng lúc đó công việc bận nên tôi đã không thể ngồi nghe bạn tâm sự.”
Ghi nhớ: 「Vてあげる」 = làm V cho người khác; 「Vられなかった」 = đã không thể V.` ,
    ],
  },
  '201407': {
    examId: 'toan-n3-201407-full',
    answers: [2, 3, 1, 3, 1, 4, 3, 2, 1, 2, 4, 4, 3],
    source: 'https://trynihongo.com/en/de-thi-jlpt-ngu-phap-doc-hieu-n3-thang-7-2014-q652; https://www.vnjpclub.com/de-thi-chinh-thuc-jlpt-n3/de-thi-jlpt-n3-7-2014-bunpo-dokkai.html',
    method: 'Question wording was cross-checked against independent TryNihongo and VNJPClub transcriptions; answers were manually selected by completing and interpreting the sentence. These sites reproduce questions and are not an official answer-key certification.',
    explanations: [
      `Đáp án 2 — 「天気や場所によって」: thay ống kính tùy theo thời tiết và địa điểm. 「によって」 biểu thị điều kiện làm cách xử lý thay đổi.
1. にとって: “đối với”, chỉ quan điểm/đối tượng đánh giá.
2. によって: “tùy theo/bởi”, phù hợp với việc đổi ống kính theo hoàn cảnh.
3. において: “ở/tại”, nêu phạm vi địa điểm nhưng không mang nghĩa tùy điều kiện.
4. に比べて: “so với”, cần hai đối tượng so sánh.
Dịch: “Nhiếp ảnh gia chuyên nghiệp thay ống kính tùy vào thời tiết và địa điểm.”
Ghi nhớ: 「Nによって変える」 = thay đổi tùy theo N.` ,
      `Đáp án 3 — 「もちろん優勝です」: mục tiêu tất nhiên là vô địch. 「もちろん」 biểu thị điều người nói khẳng định chắc chắn.
1. 必ずしも: “không hẳn”, thông thường đi với phủ định.
2. 非常に: “rất”, cần tính từ/trạng thái làm vị ngữ hoặc bổ nghĩa.
3. もちろん: “tất nhiên”, phù hợp câu khẳng định quyết tâm.
4. あまりにも: “quá”, dùng nhấn mức độ, không trả lời tự nhiên cho mục tiêu giải đấu.
Dịch: “Mục tiêu của tôi tất nhiên là vô địch. Tôi không nghĩ đến điều gì khác.”
Ghi nhớ: 「もちろん」 = tất nhiên.` ,
      `Đáp án 1 — 「本を読んだりしています」: thường làm những việc như đọc sách. 「たり～たりする」 liệt kê ví dụ hoạt động.
1. 読んだり: đúng dạng quá khứ ngắn gắn với 「たり」.
2. 読んだから: “vì đã đọc”, cần kết quả/nguyên nhân.
3. 読んで: nối hành động bằng thể て nhưng câu thiếu hành động kế tiếp.
4. 読んでから: “sau khi đọc”, cần một hành động xảy ra sau đó.
Dịch: “Chủ nhật bạn thường làm gì? — Tôi thường làm những việc như đọc sách.”
Ghi nhớ: 「VたりVたりする」 = làm những việc như V.` ,
      `Đáp án 3 — 「早く寝ろと怒られた」: bị bố mắng rằng hãy đi ngủ sớm. 「寝ろ」 là mệnh lệnh của 「寝る」.
1. 寝られる: “có thể ngủ/bị ngủ”, không tạo lời ra lệnh.
2. 寝ている: “đang ngủ”, thiếu cấu trúc trích dẫn mệnh lệnh.
3. 寝ろ: mệnh lệnh trực tiếp, phù hợp với 「～と怒られた」.
4. 寝たいか: “có muốn ngủ không?”, không khớp lời mắng.
Dịch: “Tôi đang đọc truyện tranh giữa đêm thì bị bố mắng: ‘Đi ngủ sớm đi!’”
Ghi nhớ: 「Vろと言う／怒る」 = bảo/mắng ai hãy V.` ,
      `Đáp án 1 — 「田村さんらしい部屋」: căn phòng đúng kiểu người yêu động vật như Tamura. 「らしい」 diễn tả đặc trưng tiêu biểu.
1. らしい: “đúng chất/đặc trưng của”, hợp với nhiều ảnh động vật trong phòng.
2. である: là dạng văn viết của “là”, không bổ nghĩa tự nhiên cho 「部屋」 ở đây.
3. そうな: “trông có vẻ”, cần tính từ/danh từ phù hợp và 「好きそうな部屋」 đổi nghĩa thành phòng trông có vẻ thích.
4. ばかりの: “toàn là”, cần danh từ chỉ thứ hiện diện, không tạo nghĩa “đúng kiểu Tamura”.
Dịch: “Phòng Tamura treo nhiều ảnh các loài vật, đúng là căn phòng của người yêu động vật như anh ấy.”
Ghi nhớ: 「人らしいN」 = N mang đặc trưng đúng với người đó.` ,
      `Đáp án 4 — 「もう降っていなかった」: lúc vừa ra ngoài thì mưa đã tạnh. Quá khứ tiếp diễn phủ định mô tả trạng thái không mưa tại thời điểm nhìn lại.
1. 降らない: hiện tại/tương lai, không phù hợp mốc 「さっき」.
2. 降っていない: trạng thái hiện tại, trong khi người nói kể lại lúc đã ra ngoài.
3. 降らなかった: “đã không mưa”, có thể nói một sự kiện không xảy ra, nhưng không diễn tả rõ trạng thái mưa đã tạnh tại thời điểm ấy.
4. 降っていなかった: “đã không còn đang mưa”, khớp ngữ cảnh kiểm tra trước đó.
Dịch: “Mưa tạnh chưa? — Lúc tôi ra ngoài ban nãy thì trời đã không còn mưa nữa.”
Ghi nhớ: 「Vていなかった」 có thể tả trạng thái đang/không diễn ra tại một mốc quá khứ.` ,
      `Đáp án 3 — 「トマトのアイスクリームでございます」 là lời xác định món kem màu đỏ đó có vị cà chua. 「Nでございます」 là cách nói trang trọng của 「Nです」.
1. ございます: dạng lịch sự của 「ある」, dùng để nói thứ gì đó hiện có/ở đâu. Trong ngữ cảnh khác có thể nói 「トマトのアイスクリームがございます」 để báo là có kem cà chua; câu này cần gọi tên món kem đang được hỏi.
2. がございます: cấu trúc tồn tại “có kem cà chua”, không trả lời trực tiếp 「何のアイスクリームですか」 là kem vị gì. PDF in lựa chọn này là 「がございます」.
3. でございます: 「トマトのアイスクリームです」 ở lối nói trang trọng; trực tiếp xác định vị của món kem.
4. はございます: nêu kem cà chua làm chủ đề để nói “kem cà chua thì có”, chuyển sang ý có sẵn hay không chứ không xác định món đang được chỉ.
Dịch: “Khách: Xin hỏi, món kem màu đỏ này là kem vị gì ạ? — Nhân viên: Là kem cà chua ạ.”
Ghi nhớ: 「Nでございます」 trang trọng hơn 「Nです」 khi giới thiệu/xác định món hoặc sự vật.` ,
      `Đáp án 2 — 「お席にご案内いたします」: chúng tôi xin dẫn quý khách đến chỗ ngồi. 「いたす」 khiêm nhường hành động của nhân viên.
1. 参ります: khiêm nhường “đi/đến”, không có nghĩa đưa khách vào chỗ.
2. いたします: khiêm nhường của 「する」 trong 「ご案内いたす」, đúng chủ thể là nhân viên.
3. なさいます: kính ngữ cho hành động của khách, sai chủ thể.
4. くださいます: kính ngữ “làm cho tôi”, sai hướng lợi ích và chủ thể.
Dịch: “Tôi đã đặt bàn lúc 7 giờ, tên Yamada. — Vâng, mời theo lối này, chúng tôi xin dẫn quý khách đến chỗ.”
Ghi nhớ: 「ごNいたします」 = chúng tôi khiêm nhường làm N cho khách.` ,
      `Đáp án 1 — 「写真を撮るためなら」: nếu là để chụp ảnh tàu thì anh ấy đi bất cứ đâu. 「ためなら」 nêu mục đích mà người nói sẵn sàng làm.
1. ためなら: “nếu vì/để”, đúng với mức say mê chụp tàu.
2. ためで: không tạo điều kiện và không nối tự nhiên với 「どこへでも行く」.
3. からなら: 「から」 nêu nguyên nhân/điểm xuất phát; kết hợp ở đây sai nghĩa.
4. からで: không phải mẫu chỉ mục đích.
Dịch: “Anh Tanaka rất mê tàu hỏa; nếu là để chụp ảnh đoàn tàu thì anh ấy đi bất cứ đâu.”
Ghi nhớ: 「Vるためなら」 = nếu là vì mục tiêu V thì…` ,
      `Đáp án 2 — 「今週末ぐらいまで続く」: nghe nói đợt nóng kéo dài đến khoảng cuối tuần này. 「まで」 đánh dấu điểm kết thúc.
1. ごろは: “vào khoảng… thì”, không diễn tả kéo dài tới thời điểm đó.
2. ぐらいまで: “đến khoảng”, phù hợp với 「続く」.
3. ごろよりも: “so với khoảng…”, cần vế so sánh.
4. ぐらいに: mốc thời điểm “vào khoảng”, không hợp bằng 「まで」 để nêu thời hạn kéo dài.
Dịch: “Dù ngày nóng cứ tiếp diễn, nghe nói đợt nóng này sẽ còn kéo dài đến khoảng cuối tuần.”
Ghi nhớ: 「Nまで続く」 = kéo dài đến N.` ,
      `Đáp án 4 — 「親に店の掃除などを手伝わされる」: bị bố mẹ bắt giúp dọn cửa hàng. 「手伝わされる」 là sai khiến bị động.
1. 手伝える: “có thể giúp”, nói khả năng tự nguyện.
2. 手伝われる: bị động “được/ bị giúp”, không phải bị buộc giúp.
3. 手伝わせる: “bắt/cho ai giúp”, cần chủ thể sai khiến làm chủ ngữ.
4. 手伝わされる: “bị bắt giúp”, phù hợp với việc ngày nghỉ vẫn phải làm.
Dịch: “Vì nhà bố mẹ là tiệm bánh nên ngay cả ngày nghỉ tôi thường bị bảo phụ dọn cửa hàng và hầu như không chơi với bạn.”
Ghi nhớ: 「Vさせられる」 = bị buộc phải V.` ,
      `Đáp án 4 — 「駅の近くでなくてもよければ」: nếu không nhất thiết phải ở gần ga thì tôi biết một khách sạn. 「なくてもよい」 diễn tả không cần điều kiện.
1. よくないと: “nếu không tốt thì”, đổi tiêu chí thành chất lượng khách sạn.
2. なくてもいいと: “rằng không cần”, thiếu 「ば」 để nối điều kiện với câu sau.
3. よくなければ: “nếu không tốt”, nghĩa là chất lượng không tốt.
4. なくてもよければ: “nếu không cần phải…”, đúng với tiêu chí vị trí.
Dịch: “Nếu khách sạn không nhất thiết phải gần ga thì tôi biết một chỗ.”
Ghi nhớ: 「Vなくてもよければ」 = nếu không cần V cũng được.` ,
      `Đáp án 3 — 「薬を飲んでしまわないように」: để con không lỡ uống thuốc. 「Vてしまう」 ở đây chỉ việc ngoài ý muốn; 「ように」 nêu mục đích phòng ngừa.
1. 飲み終わらないように: “để không uống hết”, không phải ngăn bé uống nhầm thuốc.
2. 飲み終わらないようで: 「ようで」 mang nghĩa có vẻ/như là, không nêu mục đích.
3. 飲んでしまわないように: “để không lỡ uống”, đúng với việc cất thuốc ngoài tầm tay.
4. 飲んでしまわないようで: không hoàn chỉnh mục đích và sai cách nối.
Dịch: “Vì có con gái ba tuổi nên tôi để thuốc ngoài tầm với của trẻ để con không lỡ uống nhầm.”
Ghi nhớ: 「Vないように」 = để không V; 「Vてしまう」 có thể chỉ sự cố ngoài ý muốn.` ,
    ],
  },
  '201312': {
    examId: 'toan-n3-201312-full',
    answers: [4, 2, 2, 3, 1, 3, 4, 1, 4, 2, 2, 3, 1],
    source: 'https://max.book118.com/html/2021/0822/6221052015003235.shtm; https://www.jpedo.com/news/1667.html',
    method: 'The complete stored answer key was independently reconciled earlier against two answer compilations for this exam (102/102). These M1 explanations were then checked against the Japanese sentence and choice semantics; the sources are nonofficial reproductions.',
    explanations: [
      `Đáp án 4 — 「お正月休みを海外で過ごす」: trải qua kỳ nghỉ năm mới ở nước ngoài. 「休みを過ごす」 là kết hợp tự nhiên với を.
1. へ: đánh dấu hướng đến, không thể làm tân ngữ của 「過ごす」 ở đây.
2. が: biến kỳ nghỉ thành chủ ngữ và làm câu không có tân ngữ phù hợp.
3. と: “với/cùng”, không chỉ khoảng thời gian trải qua.
4. を: đánh dấu thời gian/khoảng thời gian được trải qua; đúng.
Dịch: “Sân bay đang đông những người định trải qua kỳ nghỉ Tết ở nước ngoài.”
Ghi nhớ: 「休み・時間を過ごす」 = trải qua kỳ nghỉ/thời gian.` ,
      `Đáp án 2 — 「必ず学校に連絡してください」: nhất định hãy liên lạc với trường. 「必ず」 nhấn mạnh yêu cầu không được quên.
1. 全く: “hoàn toàn”, thường đi với phủ định.
2. 必ず: “nhất định”, phù hợp chỉ dẫn nếu có nguy cơ đến muộn.
3. 非常に: “rất”, bổ nghĩa mức độ, không dùng cho yêu cầu liên lạc.
4. 決して: “tuyệt đối không”, cũng thường đi với phủ định và ngược ý.
Dịch: “Về chuyến dã ngoại tuần sau, giờ tập trung là 9 giờ. Nếu đến muộn, nhất định hãy liên lạc với trường.”
Ghi nhớ: 「必ずVてください」 = nhất định hãy V.` ,
      `Đáp án 2 — 「部長のあの言い方」: cách nói đó của trưởng phòng. 「あの」 trỏ đến điều cả hai vừa nhắc tới.
1. その: thường trỏ điều phía người nghe vừa nêu; câu hỏi đang nói về cách nói cụ thể của trưởng phòng mà hai người cùng chứng kiến, dùng 「あの」 tự nhiên hơn.
2. あの: “cái… đó” đã được cả hai biết/nhìn thấy; đúng ngữ cảnh.
3. そう: “như thế”, cần kết cấu như 「そういう言い方」.
4. ああ: trạng từ “như thế”, không đứng trực tiếp trước danh từ.
Dịch: “Đúng là Hayashi cũng có lỗi, nhưng cậu không thấy cách nói đó của trưởng phòng quá đáng sao?”
Ghi nhớ: 「あの＋N」 chỉ đối tượng đã cùng biết hoặc cùng chứng kiến.` ,
      `Đáp án 3 — 「私にとって大きな問題」: đây là vấn đề lớn đối với tôi. 「にとって」 nêu góc nhìn/đối tượng chịu đánh giá.
1. では: “ở/với tư cách”, không nêu người chịu ảnh hưởng tự nhiên.
2. から: “từ/vì”, không biểu thị quan điểm đánh giá.
3. にとって: “đối với”, khớp với việc người lái xe hằng ngày thấy giá xăng là vấn đề.
4. によって: “bởi/tùy theo”, thường chỉ tác nhân hoặc phương thức.
Dịch: “Giá xăng đã tăng. Đối với tôi, người lái xe mỗi ngày, đây là vấn đề lớn.”
Ghi nhớ: 「人にとって」 = đối với người đó.` ,
      `Đáp án 1 — 「どんな練習をしたら上手になれるのだろうか」: không biết luyện tập thế nào thì sẽ giỏi. 「どうしたら」/「何をしたら」 hỏi cách đạt kết quả.
1. したら: “nếu làm/thử làm thì”, tạo câu hỏi về cách luyện tập để tiến bộ.
2. したのに: “dù đã làm”, cần kết quả trái dự đoán.
3. するより: “thay vì làm”, cần vế so sánh.
4. することは: “việc làm”, không tạo câu hỏi cách thức.
Dịch: “Tôi bắt đầu học guitar tháng trước nhưng mãi vẫn chơi không giỏi; không biết luyện thế nào thì mới tiến bộ được nhỉ?”
Ghi nhớ: 「疑問詞＋Vたらいいか」 = nên V thế nào.` ,
      `Đáp án 3 — 「行かせてあげたら」: hãy cho con gái đi du học. 「Vさせる」 là sai khiến/cho phép; 「てあげる」 thể hiện làm điều có lợi cho con.
1. 行ってあげる: người mẹ tự đi thay/đi cùng vì con; không phải cho con đi.
2. 行けてあげる: sai kết hợp thể khả năng với 「てあげる」.
3. 行かせてあげる: cho phép con đi, đúng lời khuyên cho mẹ.
4. 行かされてあげる: sai khiến bị động và ngược vai nghĩa.
Dịch: “Mẹ lo lắng và phản đối chuyện con gái muốn đi du học; người bạn khuyên dù lo cũng hãy cho con đi vì đó sẽ là trải nghiệm tốt.”
Ghi nhớ: 「人をVさせてあげる」 = cho phép/làm cho ai được V.` ,
      `Đáp án 4 — 「今日中に出さないといけないレポート」: báo cáo phải nộp trong hôm nay. 「Vないといけない」 diễn tả nghĩa vụ.
1. 出すようになる: “trở nên nộp”, sai cấu trúc và nghĩa.
2. 出すことがある: “có khi nộp”, không diễn tả nghĩa vụ.
3. 出さないかもしれないだ: dạng sai, đồng thời chỉ phỏng đoán.
4. 出さないといけない: “phải nộp”, phù hợp việc hạn nộp hôm nay.
Dịch: “Tôi còn một báo cáo phải nộp trong hôm nay mà vẫn chưa làm xong.”
Ghi nhớ: 「Vないといけない」 = phải V.` ,
      `Đáp án 1 — 「募集について伺いたいんですが」: tôi muốn hỏi về việc tuyển nhân viên làm thêm. 「伺う」 khiêm nhường ngữ của “hỏi/nghe”.
1. 伺いたい: muốn hỏi, phù hợp cuộc gọi đến nơi tuyển dụng.
2. いただきたい: muốn nhận; thiếu hành động cụ thể và sai mục đích.
3. ご覧になりたい: “muốn xem” kính ngữ, dùng cho người nghe chứ không tự nói về mình.
4. お聞きになりたい: kính ngữ “muốn nghe/hỏi”, cũng dùng cho đối phương, không phải người gọi.
Dịch: “Tôi gọi vì muốn hỏi một chút về việc tuyển nhân viên làm thêm bên mình.”
Ghi nhớ: 「伺う」 = khiêm nhường của 「聞く・尋ねる・行く」.` ,
      `Đáp án 4 — 「街のどこからでも見える」: có thể nhìn thấy từ bất cứ đâu trong thành phố. 「どこからでも」 chỉ mọi vị trí xuất phát.
1. どこまで: “đến đâu”, chỉ giới hạn/đích đến.
2. どこから: “từ đâu”, chưa có ý “bất cứ nơi nào”.
3. どこへでも: “đi đến bất cứ đâu”, chỉ hướng chuyển động, không hợp với 「見える」.
4. どこからでも: “từ bất cứ đâu”, diễn tả khả năng nhìn thấy.
Dịch: “Tòa nhà này cao nhất thành phố và có thể nhìn thấy từ bất cứ đâu trong thành phố.”
Ghi nhớ: 「どこからでも見える」 = nhìn thấy từ mọi nơi.` ,
      `Đáp án 2 — 「新聞の小さい字が見えにくくて」: chữ nhỏ khó nhìn. 「見えにくい」 diễn tả khó nhìn/khó hiện ra với người nhìn.
1. 見なくて: “không nhìn”, là hành động chủ ý, không phải khó khăn về thị lực.
2. 見えにくくて: “khó nhìn”, nêu nguyên nhân khiến cha gặp phiền.
3. 見せなくて: “không cho xem”, cần người làm chủ thể.
4. 見られにくくて: bị động/khả năng “khó được nhìn thấy”, không đúng ý cha khó đọc chữ.
Dịch: “Cha nói gặp khó vì chữ nhỏ trên báo gần đây khó nhìn nên tôi cùng cha đi mua kính.”
Ghi nhớ: 「見える」 là tự nhìn thấy; 「見えにくい」 = khó nhìn.` ,
      `Đáp án 2 — 「暗くならないうちに帰ろう」: hãy về trước khi trời tối. 「Vないうちに」 nêu việc cần làm trước khi trạng thái thay đổi.
1. なるときで: “vào lúc trở nên tối”, sai nối và không có nghĩa “trước khi”.
2. ならないうちに: “khi còn chưa tối”, đúng lời rủ về sớm.
3. なるまえ: “trước khi tối” cần 「なる前に」; phương án thiếu trợ từ に trong câu hoàn chỉnh.
4. ならないあいだ: “trong lúc chưa tối”, không tự nhiên để thúc giục hành động trước khi trời tối.
Dịch: “Đã hơn 6 giờ rồi; về trước khi trời tối nhé.”
Ghi nhớ: 「Vないうちに」 = tranh thủ trước khi V xảy ra.` ,
      `Đáp án 3 — 「野菜が畑から運ばれてきます」: rau được chở từ ruộng gần đó đến chợ này. 「運ばれる」 là bị động; 「くる」 hướng về nơi nói.
1. 運んできます: “mang đến” chủ động, nhưng chủ ngữ 「野菜が」 không thể tự vận chuyển.
2. 運んでいきます: “mang đi”, chủ động và hướng ra xa.
3. 運ばれてきます: “được chở đến đây”, đúng chủ thể và hướng.
4. 運ばれていきます: bị động “được chở đi”, hướng rời khỏi chợ.
Dịch: “Ở chợ A này, nhiều rau tươi được chở đến từ các cánh đồng gần đó.”
Ghi nhớ: 「～てくる」 hướng về phía người nói/địa điểm hiện tại.` ,
      `Đáp án 1 — 「やりすぎるのもよくない」: tưới quá nhiều cũng không tốt. 「Vすぎる」 chỉ vượt quá mức thích hợp.
1. やりすぎるのもよくない: “tưới quá tay cũng không tốt”, phù hợp với việc nước nhiều làm thối rễ.
2. やらなくていいのがいい: “không cần tưới thì tốt”, trái với câu đầu nói phải tưới khi đất khô.
3. やってやる: “làm/tưới cho” mang sắc thái ban ơn, không đúng lời khuyên chăm cây.
4. やらないでおく: “cứ để không tưới”, trái với yêu cầu cung cấp nước khi đất khô.
Dịch: “Khi đất khô thì cần tưới hoa, nhưng tưới quá nhiều cũng không tốt vì nước dư làm rễ bị thối.”
Ghi nhớ: 「Vすぎる」 = V quá mức.` ,
    ],
  },
  '201307': {
    examId: 'toan-n3-201307-full',
    answers: [3, 3, 2, 4, 1, 1, 2, 3, 2, 3, 1, 4, 4],
    source: 'https://trynihongo.com/ja/jlpt-n3-july-2013-test-solution-bunpou-dokkai; https://www.luyenthitiengnhat.edu.vn/mod/page/view.php?id=3404',
    method: 'Question text was checked against the local source transcription and the linked independent 2013 test materials; each answer was verified by completing the sentence and checking the requested grammar. These are nonofficial study sources.',
    explanations: [
      `Đáp án 3 — 「意志が強いという点で」: giống nhau ở điểm có ý chí mạnh. 「という点で」 đóng khung một phương diện cụ thể để so sánh.
1. の: 「意志が強いの点」 sai kết cấu danh từ.
2. ことの: không tạo cụm tự nhiên trước 「点」 trong câu này.
3. という: 「～という点」 = điểm rằng/điểm là, đúng.
4. をいう: cần tân ngữ và không nối 「点」 theo cách này.
Dịch: “Anh trai và tôi rất giống nhau ở điểm cả hai đều có ý chí mạnh.”
Ghi nhớ: 「～という点で似ている」 = giống nhau ở điểm…` ,
      `Đáp án 3 — 「金閣寺への行き方」: cách đi đến chùa Kinkaku. 「Nへの」 hướng đến đích.
1. に: có thể chỉ đích trong động từ 「行く」, nhưng không nối tự nhiên thành 「Nに行き方」.
2. で: chỉ nơi diễn ra/phương tiện, không đánh dấu điểm đến trong danh từ 「行き方」.
3. への: “đến/tới”, tạo cụm 「金閣寺への行き方」.
4. とは: “còn về/được gọi là”, không diễn tả tuyến đường.
Dịch: “Trong sách hướng dẫn có ghi cách đi đến chùa Kinkaku.”
Ghi nhớ: 「Nへの行き方」 = cách đi đến N.` ,
      `Đáp án 2 — 「隣の町と比べて」: so với thị trấn bên cạnh, thị trấn tôi sống có phí nước cao. 「と比べて」 nêu chuẩn so sánh.
1. として: “với tư cách là”, không so sánh hai nơi.
2. と比べて: “so với”, hợp với hai mức phí nước.
3. にまで: “đến tận”, chỉ phạm vi/điểm đến.
4. において: “tại/trong”, nêu địa điểm chứ không đối chiếu.
Dịch: “So với thị trấn bên cạnh, phí nước ở nơi tôi sống cao hơn.”
Ghi nhớ: 「Aと比べてB」 = so với A thì B.` ,
      `Đáp án 4 — 「本屋に行ったら、偶然会った」: khi/đến hiệu sách thì tình cờ gặp bạn. 「Vたら」 kể sự kiện xảy ra sau khi làm V.
1. 行けば: “nếu đi”, điều kiện giả định.
2. 行くなら: “nếu định đi”, điều kiện dựa vào ý định.
3. 行こうと: “dù định đi/thử đi”, cần mệnh đề nối tiếp khác.
4. 行ったら: “khi đã đi/đến nơi thì”, tự nhiên với 「偶然会った」.
Dịch: “Hôm qua, khi ghé hiệu sách trước ga, tôi tình cờ gặp một người bạn thời sinh viên.”
Ghi nhớ: 「Vたら、～た」 thường kể sự việc kế tiếp bất ngờ.` ,
      `Đáp án 1 — 「せっかく海外に来たのだから」: đã cất công đến nước ngoài rồi nên… 「のだから」 nêu lý do người nói thấy đủ để đưa ra ý muốn/kết luận.
1. 来たのだから: “vì đã đến”, phù hợp với mong muốn tranh thủ tham quan.
2. 来たために: “do đến” thường nêu nguyên nhân trung tính/kết quả, không hợp giọng tiếc nếu bỏ lỡ cơ hội.
3. 来たおかげで: “nhờ đã đến”, thường dẫn kết quả tích cực đã đạt được.
4. 来たかったから: “vì đã muốn đến”, nói mong muốn trước đó chứ không phải đã cất công đến.
Dịch: “Đã cất công đến nước ngoài rồi nên tôi muốn đi thăm nhiều nơi.”
Ghi nhớ: 「せっかく～のだから」 = đã mất công/đã có dịp thì nên…` ,
      `Đáp án 1 — 「あんなに楽しみにしていたのに」: đã mong chờ đến thế vậy mà… 「あんなに」 chỉ mức độ lớn đã thấy/biết.
1. あんなに: “đến thế”, nhấn mạnh Tanaka mong chờ chuyến đi rất nhiều.
2. やっと: “cuối cùng”, nói một việc đạt sau chờ đợi, không bổ nghĩa mức độ mong chờ.
3. どんなに: “dù… đến đâu”, thường cần cấu trúc nhượng bộ ở sau.
4. つい: “lỡ/vô tình”, không nói cường độ.
Dịch: “Anh ấy đã mong chuyến trượt tuyết đến thế mà giờ không đi được, tiếc thật.”
Ghi nhớ: 「あんなに～のに」 = đã… đến vậy mà…` ,
      `Đáp án 2 — 「行きたくないと嫌がっていた」: ban đầu em gái tỏ vẻ không muốn đi học bơi. 「嫌がる」 mô tả biểu hiện không thích của người khác.
1. 嫌そうだ: “trông có vẻ ghét”, hiện tại; không khớp với 「最初は」 và 「が」.
2. 嫌がっていた: đã tỏ ra không thích trong thời gian đầu; đúng trước khi giờ vui vẻ đi học.
3. 嫌なのだ: “là ghét”, không tự nhiên sau trích dẫn 「～と」 và không diễn tả biểu hiện.
4. 嫌がったままだ: “vẫn cứ ghét”, mâu thuẫn với việc bây giờ vui vẻ đến lớp.
Dịch: “Lúc đầu em gái tôi tỏ vẻ không muốn đến lớp bơi, nhưng giờ có bạn rồi nên đi học rất vui.”
Ghi nhớ: 「人が嫌がる」 = ai đó tỏ ra không muốn/khó chịu.` ,
      `Đáp án 3 — 「練習を見学させていただけませんか」: xin cho tôi dự khán buổi tập được không? 「させていただく」 khiêm nhường xin phép được làm.
1. 見学してはいけませんよ: “không được dự khán”, là lời cấm.
2. 見学しましょうよ: “chúng ta cùng đi xem nhé”, rủ người khác.
3. 見学させていただけませんか: xin phép được tham quan, đúng với người gọi hỏi câu lạc bộ.
4. 見学ではどうですか: “dự khán thì thế nào?”, là đề xuất, không phải xin phép.
Dịch: “Tôi muốn gia nhập câu lạc bộ bóng đá của anh/chị; tôi có thể đến xem thử một buổi tập được không?”
Ghi nhớ: 「Vさせていただけませんか」 = xin phép cho tôi V được không?` ,
      `Đáp án 2 — 「階段の近くにございます」: nhà vệ sinh ở gần cầu thang. 「に」 đánh dấu nơi tồn tại.
1. 階段の近く: chỉ cụm danh từ “khu gần cầu thang”, thiếu trợ từ để nối 「ございます」.
2. 階段の近くに: đúng mẫu địa điểm 「Nにございます」.
3. 階段に近くて: “gần cầu thang và…”, cần vế nối tiếp, không hoàn chỉnh.
4. 階段は近くて: chủ đề “cầu thang thì gần…”, sai cấu trúc và thiếu nơi tồn tại.
Dịch: “Nhà vệ sinh ở gần cầu thang phía bên kia ạ.”
Ghi nhớ: 「場所にございます」 = có/ở tại địa điểm, lối nói trang trọng.` ,
      `Đáp án 3 — 「ジョギングをしなくなってから一年」: đã một năm kể từ khi tôi ngừng chạy bộ buổi sáng. 「Vなくなってから」 nêu mốc bắt đầu tính thời gian.
1. しないときに: “vào lúc không chạy”, chỉ thời điểm đơn lẻ.
2. しないあいだは: “trong thời gian không chạy thì”, cần mệnh đề chính.
3. しなくなってから: “từ khi không còn chạy”, khớp với 「一年がたつ」.
4. しなくなったあとで: “sau khi đã ngừng”, cần hành động tiếp theo chứ không tạo mốc kéo dài.
Dịch: “Đã một năm trôi qua kể từ khi tôi bỏ thói quen chạy bộ buổi sáng.”
Ghi nhớ: 「Vなくなってから時間がたつ」 = đã bao lâu kể từ khi không còn V.` ,
      `Đáp án 1 — 「今から作り直すには時間が足りない」: không đủ thời gian để làm lại từ bây giờ. 「Vるには」 nêu việc cần làm để đạt mục tiêu.
1. 作り直すには: “để làm lại”, nối tự nhiên với việc thiếu thời gian.
2. 作ったままでは: “nếu cứ để nguyên đã làm”, không liên kết được với 「時間が足りない」.
3. 作り始めなくて: “không bắt đầu làm”, sai cấu trúc và nghĩa.
4. 作っていなくて: “chưa làm”, không nêu hành động cần hoàn thành trong thời gian còn lại.
Dịch: “Tài liệu dùng trong cuộc họp có lỗi, nhưng từ bây giờ không đủ thời gian để làm lại.”
Ghi nhớ: 「Vるには時間が足りない」 = không đủ thời gian để V.` ,
      `Đáp án 4 — 「首相になってもおかしくない」: có năng lực đến mức trở thành thủ tướng cũng chẳng lạ. 「～てもおかしくない」 nói kết quả hoàn toàn có thể xảy ra.
1. をしてよかった: “đã làm … là tốt”, không tạo nghĩa về năng lực.
2. になってもしかたなかった: “dù có trở thành cũng đành chịu”, sai đánh giá.
3. をしたくなった: “đã muốn làm”, diễn tả mong muốn chứ không đánh giá khả năng.
4. になってもおかしくない: “trở thành cũng không có gì lạ”, phù hợp với thực lực.
Dịch: “Yamashita Kazuo có năng lực đến mức trở thành thủ tướng cũng chẳng có gì lạ.”
Ghi nhớ: 「Vてもおかしくない」 = V cũng là chuyện có thể hiểu được.` ,
      `Đáp án 4 — 「買い替えてもいいんじゃない？」: chẳng phải đến lúc thay chiếc mới rồi sao? 「てもいい」 gợi ý điều được phép/có thể làm; 「んじゃない」 làm lời đề nghị mềm hơn.
1. 買い替えなし: dạng danh từ không nối được; câu này không hoàn chỉnh.
2. 買い替えてみた: “đã thử thay”, quá khứ và không tạo đề nghị.
3. 買い替えにくかった: “khó thay”, trái với ý định gợi ý.
4. 買い替えてもいい: “thay mới cũng được”, lời đề xuất hợp với chiếc TV đã 15 năm.
Dịch: “Mua từ 15 năm trước rồi à? Chẳng phải cũng đến lúc thay cái mới được rồi sao? — Vẫn xem được nên chưa cần.”
Ghi nhớ: 「Vてもいいんじゃない」 = hay là V cũng được đấy/đến lúc V rồi chăng.` ,
    ],
  },
}

for (const [period, set] of Object.entries(sets)) {
  const exam = exams.find((entry) => entry.id === set.examId)
  if (!exam) throw new Error(`Could not find ${set.examId}.`)
  const questions = exam.parts
    .filter((part) => part.title.includes('Ngữ pháp') && part.title.includes('Mondai 1'))
    .flatMap((part) => part.questions || [])
    .filter((question) => Number(question.number) >= 36 && Number(question.number) <= 48)
    .sort((a, b) => Number(a.number) - Number(b.number))
  if (questions.length !== 13 || set.explanations.length !== 13) throw new Error(`${period}: expected 13 questions and explanations.`)
  if (period === '201407') {
    const q42 = questions.find((question) => Number(question.number) === 42)
    q42.question = q42.question.replace('どのアイスクリームですか。', '何のアイスクリームですか。')
    q42.sentence = q42.sentence.replace('どのアイスクリームですか。', '何のアイスクリームですか。')
    q42.options[1] = q42.options[1].replace('がざいます', 'がございます')
    q42.sourceVerificationStatus = 'verified'
    q42.sourceVerificationSources = [
      'Google Drive: 5. N3 7-2014.pdf, printed page 4; Drive file 1oRFJ0VVyVbfT4YmoJ03-bJWQsrYgJ05C.',
      'Google Drive: ĐÁP ÁN JLPT N3 (update 26.6.2026).pdf, page 9; Drive file 1Lmr3LwhnS3lEv4FYemiM0f93Qg5DLNZL.'
    ]
    const answerKeySource = `Google Drive: ${grammar201407AnswerKeyReview.source.file}, page ${grammar201407AnswerKeyReview.source.viewerPage}; Drive file ${grammar201407AnswerKeyReview.source.driveFileId}.`
    for (const sourceRow of grammar201407SourceReview.questions) {
      const sourceQuestion = questions.find((question) => question.id === sourceRow.questionId)
      if (!sourceQuestion) throw new Error(`Missing 07/2014 grammar source question ${sourceRow.questionId}.`)
      const page = sourceRow.printedQuestion <= 11 ? 4 : 5
      sourceQuestion.sourceVerificationStatus = 'verified'
      sourceQuestion.sourceVerificationSources = [
        `Google Drive: ${grammar201407SourceReview.source.file}, printed page ${page}; Drive file ${grammar201407SourceReview.source.driveFileId}.`,
        answerKeySource,
      ]
    }
  }
  questions.forEach((question, index) => {
    const answer = Number(question.correctAnswer ?? question.answer)
    if (answer !== set.answers[index]) throw new Error(`${period} q${question.number}: stored ${answer}, reviewed ${set.answers[index]}.`)
    question.explanation = set.explanations[index]
    curated[question.id] = set.explanations[index]
  })
  if (period === '201407') {
    const q42 = questions.find((question) => Number(question.number) === 42)
    curated[q42.id] = q42.explanation
  }
  fs.writeFileSync(`reports/n3-quality-audit/grammar-${period}-curation.json`, `${JSON.stringify({
    generatedAt: new Date().toISOString(), examId: set.examId, scope: 'Grammar Mondai 1, questions 36–48.', source: set.source,
    method: set.method, answerSequence: set.answers,
    rows: questions.map((question) => ({ questionNumber: Number(question.number), storedAnswer: Number(question.correctAnswer ?? question.answer), choices: question.options })),
  }, null, 2)}\n`)
}

fs.writeFileSync(masterPath, `${JSON.stringify(exams, null, 2)}\n`, 'utf8')
fs.writeFileSync(curatedPath, `${JSON.stringify(curated, null, 2)}\n`, 'utf8')
console.log('Updated 52 hand-written 2013–2014 N3 Grammar Mondai 1 explanations.')
