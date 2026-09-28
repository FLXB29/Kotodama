import fs from 'node:fs'

const masterPath = 'data/jlpt_n3_toan_master.json'
const curatedPath = 'data/jlpt_n3_explanations_curated.json'
const exams = JSON.parse(fs.readFileSync(masterPath, 'utf8'))
const curated = JSON.parse(fs.readFileSync(curatedPath, 'utf8'))

// Hand-written option-by-option grammar notes. Each explanation is grounded in
// the sentence context; local-dataset pattern names are called out where they
// identify the construction being tested.
const updates = {
  toan_q_2025_12_36: `Đáp án 1 — 「今、出かけるところなんです」: “Bây giờ tôi đang chuẩn bị ra ngoài”. Mẫu 「Vるところ」 trong dữ liệu ngữ pháp N3 chỉ việc sắp bắt đầu.
1. 出かけるところ: sắp đi ra ngoài, đúng với lời xin dời cuộc hẹn.
2. 出かけているところ: đang trong lúc ra ngoài/đang đi; nói một hành động đang diễn ra, không nhấn mạnh việc sắp khởi hành.
3. 出かけたところ: vừa mới đi ra; người nói đã rời đi rồi, không hợp với lời xin phép nói chuyện sau.
4. 出かけようところ: sai kết hợp; thể ý chí cần 「出かけようとしているところ」.
Dịch hội thoại: “Anh/chị Yamashita, anh/chị có rảnh một chút không?” — “Xin lỗi, bây giờ tôi sắp ra ngoài. Để lúc khác được không?”
Ghi nhớ: Vるところ = sắp làm; Vているところ = đang làm; Vたところ = vừa mới làm.`,

  toan_q_2025_12_37: `Đáp án 4 — 「温かいうどんなんかどう？」: “Udon nóng thì sao?”. 「〜なんか」 có thể nêu một ví dụ để gợi ý thân mật; dữ liệu ngữ pháp N3 ghi cách dùng đề xuất của 「など／なんか」.
1. に: 「うどんにどう？」 không tạo được cách nêu món ăn tự nhiên trong lời rủ này.
2. だけ: “chỉ udon”; nhấn mạnh giới hạn món ăn, không có sắc thái đưa ra một gợi ý như câu cần.
3. まで: “đến cả/cho tới”; không phù hợp để đề xuất chọn một món.
4. なんか: nêu udon nóng làm ví dụ, phù hợp với câu hỏi 「どう？」.
Dịch: “Trời lạnh nên ăn udon nóng thì sao?”
Ghi nhớ: 「Nなんかどう？」 là cách thân mật đưa ra gợi ý; 「だけ」 giới hạn, 「まで」 nhấn mạnh phạm vi.`,

  toan_q_2025_12_38: `Đáp án 1 — 「手紙でなら」 kết hợp trợ từ phương tiện 「で」 với 「なら」 (“nếu bằng cách đó”). Câu nói người viết có thể truyền đạt lòng biết ơn qua thư dù ngại nói trực tiếp.
1. でなら: nếu dùng thư làm phương tiện, có thể truyền đạt; hợp với ý đối chiếu trong câu.
2. になら: 「手紙になる」 là “trở thành lá thư”; không diễn tả phương tiện truyền đạt ở đây.
3. でしか: 「しか」 đòi vế phủ định, thường là 「手紙でしか伝えられない」; câu này lại khẳng định 「伝えられる」.
4. にしか: vừa không chọn đúng trợ từ phương tiện, vừa cần vế phủ định sau 「しか」.
Dịch: “Tôi luôn viết thư vào sinh nhật bố mẹ, vì bằng thư tôi có thể truyền đạt lòng biết ơn mà bình thường ngại nói ra.”
Ghi nhớ: 「で」 nêu phương tiện; 「しか」 thường đi với phủ định.`,

  toan_q_2025_12_39: `Đáp án 2 — 「あまりに雨が強かった」: “mưa quá to”. 「あまりに」 đứng trước tính từ để nhấn mạnh mức độ quá cao; vì vậy người nói đi xe buýt.
1. ちっとも: “chẳng… chút nào”, thường đi với phủ định; 「ちっとも雨が強かった」 không đúng cấu trúc.
2. あまりに: “quá mức”, kết hợp tự nhiên với 「強い」 và giải thích lựa chọn đi xe buýt.
3. 次第に: “dần dần”; cần diễn tả sự thay đổi theo thời gian, không phải mức độ cơn mưa.
4. 今にも: “sắp sửa”; thường đi với điều sắp xảy ra như 「今にも降りそう」, không có nghĩa “mưa quá to”.
Dịch: “Thường thì dù trời mưa tôi vẫn đi xe đạp đến trường, nhưng sáng nay mưa to quá nên tôi đi xe buýt.”
Ghi nhớ: 「あまりに＋tính từ」 = quá…; 「ちっとも」 thường dùng trong câu phủ định.`,

  toan_q_2025_12_40: `Đáp án 3 — 「登っていくにしたがって」 là “cùng với việc leo lên/càng leo lên”, đúng mẫu 「〜にしたがって」 trong dữ liệu ngữ pháp N3: hai sự thay đổi tiến triển song song.
1. とすると: “nếu giả sử”; biến việc leo núi thành giả định, không diễn tả gió lạnh dần theo độ cao.
2. のと比べると: “nếu so với việc leo…”; cần một đối tượng so sánh và không nối được quan hệ biến đổi được kể ở đây.
3. にしたがって: khi quá trình leo tiếp diễn, gió trở nên lạnh; đúng quan hệ đồng biến.
4. に対して: “đối với/trái lại”; không diễn tả sự thay đổi đồng thời trong cấu trúc này.
Dịch: “Tuần trước tôi đi leo núi. Hôm ấy trời nóng, nhưng càng leo lên thì gió càng lạnh, rất dễ chịu.”
Ghi nhớ: 「Vる／N＋にしたがって」 = cùng với sự tiến triển của V/N thì một thay đổi khác cũng diễn ra.`,

  toan_q_2025_12_41: `Đáp án 4 — 「読み終わったら」: “sau khi đọc xong”. Người chị đang đọc dở truyện và hứa cho mượn sau khi hoàn tất.
1. 読んでいたら: “nếu/đang đọc thì”; không nói rõ việc đọc xong trước khi cho mượn.
2. 読み続けたら: “nếu tiếp tục đọc”; cũng không nêu mốc hoàn thành mà lời hứa cần.
3. 読んで置いたら: “nếu đọc rồi để lại”; 「置く」 là đặt/để, không có nghĩa đọc xong.
4. 読み終わったら: 「Vます-bỏ ます＋終わる」 diễn tả làm xong; 「たら」 ở đây chỉ thời điểm sau khi đọc xong.
Dịch: “Em gái: Chị đọc xong cuốn manga này chưa? Em mượn được không? — Chị: À, chị vẫn đang đọc dở. Khi đọc xong chị sẽ cho em mượn nhé.”
Ghi nhớ: 「V終わる」 nhấn mạnh hoàn tất hành động; 「Vたら」 có thể nối với hành động xảy ra sau đó.`,

  toan_q_2025_12_42: `Đáp án 4 — 「帰ってしまう前に」 nghĩa là “trước khi bạn ấy về nước”. 「前に」 đặt việc muốn cùng làm trước thời điểm người bạn rời Nhật.
1. 帰っていて: “đang/đã về”; không tạo được mốc “trước lúc về” cho mong muốn làm việc cùng nhau.
2. 帰ってしまえば: “nếu/một khi đã về”; khi đó làm nhiều việc cùng nhau ở Nhật đã quá muộn.
3. 帰っている間: “trong thời gian đang ở quê”; trái với dự định tranh thủ thời gian còn ở Nhật.
4. 帰ってしまう前に: hành động mong muốn xảy ra trước lúc người bạn trở về nước; đúng mạch thời gian.
Dịch: “Tháng tới, người bạn du học sinh sẽ kết thúc cuộc sống du học ở Nhật và về nước. Tôi muốn cùng bạn làm nhiều việc trước khi bạn ấy về.”
Ghi nhớ: 「Vる前に」 = trước khi làm V.`,

  toan_q_2025_12_43: `Đáp án 2 — 「建てられたのは今から1000年以上前」: “việc được xây dựng là từ hơn 1.000 năm trước”. 「のは」 danh từ hóa sự việc rồi đưa thời điểm của việc đó ra làm thông tin chính.
1. 建てられてからは: “kể từ khi được xây”; cần một mệnh đề nêu điều gì đã xảy ra từ mốc đó, không nối được với 「1000年以上前」.
2. 建てられたのは: thể bị động 「建てられた」 đúng vì ngôi chùa được xây; 「のは」 nêu thời điểm xây dựng.
3. 建てさせるまでは: thể sai khiến, nghĩa là “cho/ép ai xây cho đến khi…”; sai quan hệ và không hợp với tuổi ngôi chùa.
4. 建てさせたときは: “khi đã khiến ai xây”; đổi nghĩa sang việc chủ thể sai khiến người khác, không phải mô tả ngôi chùa được xây.
Dịch: “Ngôi chùa này là ngôi chùa cổ nhất trong tỉnh; nghe nói nó được xây dựng từ hơn 1.000 năm trước.”
Ghi nhớ: 「N／Vた＋のは…だ」 nêu và giải thích một sự việc; 「建てられる」 là bị động của 建てる.`,

  toan_q_2025_12_44: `Đáp án 3 — 「人気があるみたいだ」 là “có vẻ nổi tiếng”. Dữ liệu ngữ pháp N3 có mẫu 「〜みたいだ」 để suy đoán dựa trên dấu hiệu; ở đây dấu hiệu là nhiều người xếp hàng.
1. ことだ: thường nêu lời khuyên/điều nên làm hoặc danh từ hóa; 「人気があることだよ」 không diễn đạt suy đoán từ cảnh xếp hàng.
2. せいだ: “là do/tại”, thường nêu nguyên nhân, nhất là kết quả xấu; không hợp với việc nhận xét cửa hàng đông khách.
3. みたいだ: suy đoán “có vẻ”, khớp với bằng chứng vừa nhìn thấy.
4. つもりだ: “dự định/tự cho là”; không diễn tả suy đoán về mức độ nổi tiếng của cửa hàng.
Dịch: “Nghe nói có cửa hàng bánh donut mở trước ga. — Ừ, hình như đông khách lắm. Hôm qua anh đi ngang thấy nhiều người xếp hàng.”
Ghi nhớ: 「〜みたいだ」 = có vẻ/hình như; 「〜つもりだ」 = dự định hoặc tự cho là.`,

  toan_q_2025_12_45: `Đáp án 4 — 「知っていたら教えてほしいんですが」 là lời nhờ vả mềm: “nếu biết thì tôi muốn được chỉ giúp”. 「Vてほしい」 trong dữ liệu ngữ pháp N3 diễn tả mong người nghe làm việc gì cho mình.
1. 教えたいんですが: “tôi muốn chỉ/bảo”; đảo chiều mong muốn, trong khi Mori đang cần người kia chỉ cho mình.
2. 教えてもいいですか: “tôi có thể chỉ cho anh/chị không?”; xin phép tự mình cung cấp thông tin, trái với ý hỏi về phòng khám.
3. 教えてもらうんですか: “anh/chị sẽ được ai đó chỉ cho à?”; thành câu hỏi về việc nhận chỉ dẫn, không phải lời nhờ.
4. 教えてほしいんですが: mong người nghe giới thiệu; 「んですが」 làm lời nhờ dè dặt và lịch sự hơn.
Dịch: “Xin lỗi, nếu anh/chị biết phòng khám mắt nào tốt gần đây thì chỉ giúp tôi với được không? Từ sáng mắt tôi ngứa.”
Ghi nhớ: 「Vてほしい」 là muốn người khác làm; 「Vたい」 là muốn tự mình làm.`,

  toan_q_2025_12_46: `Đáp án 2 — 「分からないはずがない」 nghĩa là “không thể nào không biết”. 「〜はずがない」 trong dữ liệu ngữ pháp N3 là phán đoán phủ định mạnh; căn cứ là chính Hayashi đã tạo biểu đồ.
1. わからないに違いない: “chắc chắn là không biết”; cấu trúc 「〜に違いない」 đúng nhưng kết luận ngược với căn cứ 「林さんが作った」.
2. わからないはずがない: không thể không biết biểu đồ do chính mình tạo; đúng với suy luận của người nói.
3. わからないかもしれない: “có thể không biết”; chỉ nêu khả năng, yếu hơn kết luận mà 「なのだから」 dẫn tới.
4. わからなくてもかまわない: “không biết cũng không sao”; nói mức độ chấp nhận, không phải suy luận về kiến thức của Hayashi.
Dịch: “Khi được hỏi về biểu đồ trong tài liệu ở cuộc họp, anh Hayashi nói mình không biết; nhưng đó là biểu đồ anh ấy làm, nên tôi nghĩ không thể nào anh ấy lại không biết.”
Ghi nhớ: 「〜はずがない」 phủ định mạnh; 「〜かもしれない」 chỉ khả năng.`,

  toan_q_2025_12_47: `Đáp án 3 — 「買ってきてくれる」 nghĩa là bố mua quà khi đi công tác rồi mang về cho người nói và mẹ. 「〜てくれる」 nhìn hành động có lợi từ phía người nhận là người nói/nhóm của mình.
1. 買ってきてあげる: hướng “làm cho người khác” từ góc nhìn người bố; không hợp với lời người con kể về việc bố làm cho gia đình mình.
2. 買って行ってあげる: 「行く」 chỉ mang đi xa khỏi điểm nhìn, không phải mang món quà trở về nhà; 「あげる」 cũng sai hướng nhìn.
3. 買ってきてくれる: 「来る」 đưa món quà về phía người nói và 「くれる」 diễn tả việc bố làm điều có lợi cho gia đình; đúng cả hướng đi lẫn góc nhìn.
4. 買って行ってくれる: 「くれる」 đúng góc nhìn nhưng 「行く」 diễn tả mang đi khỏi đây, trái với ý mua quà trong chuyến công tác rồi đem về.
Dịch: “Bố tôi mỗi lần đi công tác đều mua quà mang về cho mẹ và tôi.”
Ghi nhớ: 「〜てくれる」 người khác làm cho phía mình; 「〜てあげる」 mình/người mình nói làm cho phía khác; 「来る」 hướng về điểm nhìn, 「行く」 rời điểm nhìn.`,

  toan_q_2025_12_48: `Đáp án 1 — 「授業に出られそうだ」 nghĩa là “có vẻ ngày mai tôi có thể đi học”. 「そうだ」 gắn sau gốc bỏ ます để phỏng đoán qua dấu hiệu; người nói dựa vào việc đã đỡ cảm.
1. 出られそうだ: 「出られる」 là có thể tham dự; 「出られそう」 là có vẻ có thể làm được, đúng với tự đánh giá của người nói.
2. 出られるそうだ: 「そうだ」 sau thể thường truyền đạt tin nghe được (“nghe nói có thể tham dự”); câu không nêu nguồn tin bên ngoài.
3. 出そうだ: nghĩa dễ thành “có vẻ sắp ra/xuất hiện”; thiếu dạng khả năng 出られる cần cho ý “có thể đi học”.
4. 出るそうだ: nghe nói sẽ tham dự; là tin được truyền lại và bỏ mất nghĩa khả năng.
Dịch: “Tôi bị cảm nên hôm nay đã nghỉ học, nhưng ngủ ở nhà một ngày thì đỡ nhiều. Có vẻ ngày mai tôi đi học được.”
Ghi nhớ: 「Vます-stem＋そうだ」 = trông có vẻ sắp/có thể làm; 「V thể thường＋そうだ」 = nghe nói rằng.
`,

  toan_q_2025_07_36: `Đáp án 3 — 「世界中から多くのサッカーファンが集まった」: nhiều người hâm mộ đã đến từ khắp nơi trên thế giới để dự giải đấu ở Tokyo. 「から」 nêu điểm xuất phát.
1. に: thường nêu nơi hướng đến hoặc nơi tập trung; câu đã nêu giải đấu diễn ra ở Tokyo, còn 「世界中」 ở đây là nơi những cổ động viên xuất phát.
2. で: nêu địa điểm hoặc phương tiện diễn ra hành động; không thể hiện nguồn gốc của những người đến dự giải.
3. から: “từ khắp thế giới”; diễn tả nơi các cổ động viên xuất phát rồi tập hợp tại Tokyo, đúng mạch câu.
4. まで: “đến tận”; nêu giới hạn cuối, không diễn tả nơi họ đi đến từ đó.
Dịch: “Tại giải bóng đá quốc tế tổ chức ở Tokyo tháng trước, rất nhiều người hâm mộ bóng đá từ khắp nơi trên thế giới đã tụ họp.”
Ghi nhớ: 「Nから集まる」 nêu nơi người tham dự đến từ; 「Nに集まる」 nêu nơi họ tập trung.`,

  toan_q_2025_07_37: `Đáp án 1 — 「食事のマナーは国によって違う」: phép lịch sự trong ăn uống khác nhau tùy theo quốc gia. 「Nによって」 ở đây nêu tiêu chí làm thay đổi kết quả.
1. によって: “tùy theo/theo từng”; 「国によって違う」 là khác nhau tùy nước, đúng kết hợp.
2. に対して: “đối với/đối lập với”; cần đối tượng được hướng tới hoặc vế đối lập, không có nghĩa “tùy theo quốc gia”.
3. にとって: “đối với (góc nhìn của)”; nói ý nghĩa/đánh giá với một chủ thể, không diễn tả sự khác biệt giữa các nước.
4. において: “tại/trong”; nêu bối cảnh hoặc lĩnh vực, không chỉ tiêu chí khiến phép lịch sự khác nhau.
Dịch: “Phép lịch sự khi ăn uống khác nhau tùy theo quốc gia, nên trước khi đi du lịch tôi thường tìm hiểu xem cần chú ý điều gì.”
Ghi nhớ: 「Nによって違う」 = khác nhau tùy theo N; phân biệt với 「Nにとって」 = đối với N.`,

  toan_q_2025_07_38: `Đáp án 3 — 「もうすぐ引っ越すってこの前言ってた」: 「って」 là cách nói thân mật của 「と」 dùng để trích lời đã nói. Câu hỏi nhắc lại điều người kia từng kể.
1. 引っ越す: động từ thể từ điển đứng trần trước 「この前言ってた」, thiếu dấu hiệu trích dẫn nên không nối được tự nhiên.
2. 引っ越すか: 「か」 biến nội dung thành câu hỏi “có chuyển nhà hay không”; câu này không hỏi lại một nghi vấn mà nhắc điều người kia đã nói.
3. 引っ越すって: 「って」 dẫn lời nói thường ngày, tương đương 「引っ越すと」 trong câu trích dẫn; phù hợp với 「この前言ってた」.
4. 引っ越すのを: 「のを」 danh từ hóa hành động làm tân ngữ; 「この前言ってた」 cần lời/nội dung được trích dẫn, không phải cách nối này.
Dịch: “A: Cậu có nói hôm trước là sắp chuyển nhà mà, việc chuẩn bị đến đâu rồi? — B: Ừ.”
Ghi nhớ: khẩu ngữ 「〜って言っていた」 = đã nói rằng…; 「〜か」 đánh dấu câu hỏi nghi vấn.
Lưu ý đối chiếu: một bảng tham khảo ghi 「引っ越すか」, nhưng cấu trúc đang cần lời được trích dẫn trước 「この前言ってた」 là 「引っ越すって」; một bảng khác cũng chọn phương án 3. Giữ đáp án 3 theo ngữ pháp và đối chiếu tham khảo, chờ bản khóa gốc để kết luận tuyệt đối.`,

  toan_q_2025_07_39: `Đáp án 4 — 「どちらかというと、家でDVDを見ることが多い」: “nếu phải nói bên nào hơn thì tôi thường xem DVD ở nhà”. Người nói vẫn có đi rạp, nhưng thường xem ở nhà hơn.
1. 確かに: “quả thật”; dùng để công nhận điều vừa nêu, không tạo ý so sánh xu hướng thích xem ở đâu.
2. まるで: “hệt như”, thường đi với ví von hoặc phủ định 「まるで〜ない」; không hợp câu này.
3. 必ずしも: “không hẳn là/không nhất thiết”; thường đi với phủ định 「必ずしも〜とは限らない」, còn câu này là khẳng định tích cực.
4. どちらかというと: “nếu phải chọn thì/nghiêng về phía”; nối tự nhiên sự đối chiếu giữa rạp chiếu phim và xem ở nhà.
Dịch: “Tanaka: Nghe nói anh Yamashita hay xem phim. Anh xem ở rạp à? — Yamashita: Tôi cũng đi rạp, nhưng nếu phải nói thì tôi thường xem DVD ở nhà hơn.”
Ghi nhớ: 「どちらかというと」 nêu xu hướng nghiêng về một lựa chọn; 「必ずしも」 thường xuất hiện trong câu phủ định.
Lưu ý đối chiếu: một bảng tham khảo ghi 「確かに」, còn khóa tham khảo khác và khóa hiện lưu chọn 「どちらかというと」. 「確かに」 vẫn có thể dùng khi xác nhận một nhận xét; 「どちらかというと」 khớp trực tiếp hơn với phép so sánh rạp phim và DVD ở nhà. Cần bản khóa gốc để loại trừ hoàn toàn phương án 1.`,

  toan_q_2025_07_40: `Đáp án 2 — 「ゆでた後、熱いうちに皮をむきましょう」: hãy gọt vỏ khi khoai vẫn còn nóng, trước khi nguội. 「〜うちに」 nêu khoảng thời gian mà trạng thái còn duy trì.
1. のに: “mặc dù/dùng để”; không nêu thời điểm cần tranh thủ trước khi khoai nguội.
2. うちに: “trong lúc vẫn còn”; 「熱いうちに」 là khi khoai còn nóng, đúng với hướng dẫn.
3. ことで: “bằng việc/do việc”; không đứng tự nhiên sau 「熱い」 để nói thời điểm.
4. とすると: “nếu giả sử”; mở đầu giả định, không hợp mệnh lệnh hướng dẫn nấu ăn.
Dịch: “Khoai tây gọt vỏ đẹp hơn nếu luộc trước rồi mới gọt. Sau khi luộc, hãy gọt khi khoai còn nóng.”
Ghi nhớ: 「い形容詞＋うちに」 = trong lúc vẫn còn ở trạng thái ấy; 「AのにB」 = mặc dù A nhưng B.`,

  toan_q_2025_07_41: `Đáp án 4 — 「ご飯を食べたばかりなのに」: “mới ăn cơm xong vậy mà…”. 「ばかり」 diễn tả hành động vừa mới xảy ra.
1. せい: “do/tại”; cần kết cấu nêu nguyên nhân và không nói được “vừa ăn xong”.
2. とき: “khi/lúc”; 「食べたとき」 là lúc đã ăn, không có sắc thái mới xảy ra.
3. よう: “như/thể như”; 「食べたよう」 là có vẻ đã ăn/như đã ăn, không hợp với sự tương phản.
4. ばかり: 「Vたばかり」 = vừa mới làm V; hợp với 「なのに」 và việc đã đói lại.
Dịch: “Tôi mới ăn cơm lúc nãy vậy mà giờ bụng đã đói mất rồi.”
Ghi nhớ: 「Vたばかり」 = vừa mới làm; 「ばかり」 ở đây không mang nghĩa “chỉ toàn”.`,

  toan_q_2025_07_42: `Đáp án 1 — 「ゲームがしたくて、毎日学校から走って帰っていた」: hồi nhỏ vì muốn chơi game ở nhà nên ngày nào người nói cũng chạy về từ trường.
1. したくて: 「したい」 là muốn làm; nối dạng て nêu lý do/động cơ cho việc chạy về nhà, đúng mạch câu.
2. したくても: “dù muốn chơi”; cấu trúc nhượng bộ thường cần kết quả trái mong đợi, nhưng ở đây người nói chạy về để được chơi.
3. するためで: 「ため」 nêu mục đích nhưng cách nối 「ためで」 không phù hợp trước mệnh đề này; cần 「するために」.
4. するためでも: cũng không tạo được cấu trúc mục đích tự nhiên ở đây; 「でも」 không thay thế 「に」 trong 「ために」.
Dịch: “Hồi học tiểu học, tôi rất thích trò chơi điện tử. Vì muốn được chơi ở nhà sớm nên ngày nào tôi cũng chạy từ trường về.”
Ghi nhớ: 「Vたい＋て」 có thể nối mong muốn/nguyên nhân với hành động tiếp theo; 「Vたくても」 = dù muốn V thì…`,

  toan_q_2025_07_43: `Đáp án 2 — 「何をあげたら喜ぶだろうか」: người nói tự hỏi nên tặng gì thì em trai sẽ vui. 「あげる」 nhìn việc cho từ phía người tặng.
1. くれたら: 「くれる」 nhìn hành động cho từ phía người nhận là người nói/nhóm mình; ở đây người nói đang chọn quà để tặng em trai nên đổi sai hướng nhìn.
2. あげたら: “nếu tôi tặng …”; 「たら」 nêu giả định rồi dự đoán em trai vui, đúng với câu hỏi đang cân nhắc món quà.
3. くれるから: “vì em ấy cho …”; vừa đảo chiều người cho–người nhận vừa biến câu thành nguyên nhân.
4. あげるから: “vì tôi sẽ tặng …”; nêu lý do đã xác định, không phù hợp với câu đang hỏi nên chọn món nào.
Dịch: “Tôi đang nghĩ nên mua quà sinh nhật gì cho em trai. Mình tặng món nào thì em ấy sẽ vui nhỉ?”
Ghi nhớ: 「あげる」 = mình/nhóm mình cho người khác; 「くれる」 = người khác cho mình/nhóm mình.`,

  toan_q_2025_07_44: `Đáp án 3 — 「明日、学校に持ってくね」 là khẩu ngữ rút gọn của 「学校に持っていくね」: ngày mai tôi sẽ mang cuốn tiểu thuyết đến trường cho bạn.
1. 持っとく: rút gọn 「持っておく」, nghĩa là giữ/chuẩn bị sẵn, không nói rõ sẽ đem cuốn sách đến trường cho người kia.
2. 持ってる: rút gọn 「持っている」, nghĩa là đang/có mang theo, không biểu đạt lời hứa đem tới vào ngày mai.
3. 持ってく: rút gọn khẩu ngữ của 「持っていく」; hợp với lời hứa mang sách đến trường ngày mai.
4. 持っちゃう: rút gọn 「持ってしまう」, nhấn mạnh làm xong/lỡ làm; không có nghĩa “mang tới nơi đó”.
Dịch: “A: Cuốn tiểu thuyết tớ mượn hôm trước, cậu cho mượn lại một lần nữa được không? — B: Ừ, được chứ. Ngày mai tớ mang đến trường nhé.”
Ghi nhớ: 「持っていく」 mang một vật rời điểm nhìn; trong hội thoại thân mật có thể rút gọn thành 「持ってく」.`,

  toan_q_2025_07_45: `Đáp án 2 — 「晴れるといいね」: “mong là trời sẽ nắng đẹp nhỉ”. 「〜といい」 nêu điều người nói hy vọng sẽ xảy ra.
1. 晴れてきた: “trời đã bắt đầu quang”; mô tả thay đổi đã diễn ra, không phải lời mong cho chuyến leo núi sắp tới.
2. 晴れるといい: “nếu trời quang thì tốt/mong trời quang”; đúng sắc thái hy vọng về thời tiết hai tuần sau.
3. 晴れるんだ: khẳng định/giải thích “trời sẽ quang đấy”; không diễn đạt mong muốn và không có căn cứ chắc chắn.
4. 晴れてよかった: “may quá trời đã quang”; đánh giá việc đã xảy ra, trong khi chuyến đi còn ở tương lai.
Dịch: “A: Chuyến leo núi tuần sau nữa vui đây. — B: Ừ, mong trời sẽ nắng đẹp nhỉ.”
Ghi nhớ: 「Vるといい」 = mong là V; 「Vてよかった」 = mừng vì V đã xảy ra.`,

  toan_q_2025_07_46: `Đáp án 1 — 「市民の方であれば、どなたでも無料でご参加になれます」: bất kỳ cư dân nào cũng có thể tham gia miễn phí. 「ご参加になれます」 dùng kính ngữ tôn trọng người dân tham dự.
1. ご参加になれます: cách nói lịch sự về khả năng tham gia của người nghe/khách; phù hợp với thông báo hướng tới cư dân.
2. 参加いたします: 「いたす」 khiêm nhường cho hành động của người nói; thông báo không nói rằng chính người viết sẽ tham gia.
3. ご参加になっています: diễn tả người nào đó đang/đã ở trạng thái tham gia; không nêu quyền hoặc khả năng đăng ký tham gia.
4. 参加できております: cách diễn đạt “đã có thể tham gia/đang tham gia được” theo phía người nói; không hợp với lời thông báo ai cũng được dự.
Dịch: “(Trên trang web của thành phố) Ngày 30 tháng 9 sẽ có buổi nói chuyện của tác giả sách tranh Sakaki Midori. Bất cứ cư dân nào cũng có thể tham dự miễn phí.”
Ghi nhớ: 「ご＋động từます-bỏます＋になれる」 nêu khả năng của người được tôn trọng; 「いたす」 khiêm nhường hành động của phía người nói.
Lưu ý đối chiếu: một bảng tham khảo chọn phương án 3 và một bảng khác chọn phương án 2; câu thông báo cùng đáp án chữ trong nguồn thứ ba ủng hộ phương án 1 「ご参加になれます」. Khóa hiện lưu chọn 1 theo cấu trúc kính ngữ và câu thông báo, nhưng vẫn cần bản đáp án gốc để chốt.`,

  toan_q_2025_07_47: `Đáp án 3 — 「隣に高いビルができて、海が見えなくなってしまった」: tòa nhà cao bên cạnh đã khiến biển không còn nhìn thấy được. 「見えなくなる」 nêu sự thay đổi sang trạng thái không nhìn thấy; 「〜てしまう」 nhấn mạnh kết quả đáng tiếc.
1. 見えなくてもよくなった: 「なくてもいい」 nghĩa là không cần phải nhìn thấy; câu lại nói tầm nhìn thực tế đã bị che khuất.
2. 見られたかもしれない: “có lẽ đã xem/nhìn được”; 「かもしれない」 phỏng đoán về quá khứ, không diễn tả thay đổi sau khi tòa nhà được xây.
3. 見えなくなってしまった: từ trước nhìn thấy biển được, nay không nhìn thấy nữa; 「見える」 chỉ khả năng nhìn thấy một cách tự nhiên, rất hợp khi nói tầm nhìn bị chắn.
4. 見られるようにならない: “không trở nên có thể nhìn”; phủ định một thay đổi hướng tới khả năng nhìn thấy, không khớp với việc biển bị che.
Dịch: “Trước đây từ cửa sổ công ty có thể nhìn thấy biển, nhưng sau khi tòa nhà cao được xây bên cạnh thì không còn nhìn thấy biển nữa.”
Ghi nhớ: 「見える」 = nhìn thấy được; 「見られる」 = có thể xem/nhìn hoặc được nhìn; 「〜なくなる」 = trở nên không còn…; 「〜てしまう」 có thể biểu thị kết quả ngoài mong muốn.`,

  toan_q_2025_07_48: `Đáp án 4 — 「熱が下がっても飲んだほうがいいでしょうか」: “Dù hạ sốt rồi tôi vẫn nên uống thuốc chứ ạ?”. 「〜ても」 nêu tình huống nhượng bộ; 「〜たほうがいい」 hỏi lời khuyên.
1. 飲んではいけませんか: “tôi không được uống thuốc ạ?”; hỏi xin phép không uống, trái với việc xác nhận có cần tiếp tục uống không.
2. 飲んでいないんでしょうか: “không biết [ai đó] có đang không uống không?”; thành phỏng đoán về hành động của người khác, không phải câu hỏi xin chỉ dẫn.
3. 飲んでみようと思いますか: “bác sĩ có định thử uống không?”; đổi người được hỏi và hướng hành động, không hợp lời bệnh nhân hỏi bác sĩ.
4. 飲んだほうがいいでしょうか: hỏi có nên tiếp tục uống hay không; bác sĩ trả lời “はい、五日間必ず飲んでください” xác nhận đúng lựa chọn này.
Dịch: “Bác sĩ: Hãy uống thuốc này trong năm ngày. — Bệnh nhân: Vâng. Dù hết sốt rồi thì tôi vẫn nên uống chứ ạ? — Bác sĩ: Đúng, hãy uống đủ năm ngày.”
Ghi nhớ: 「Vても」 = dù V; 「Vたほうがいい」 = nên làm V (dùng để hỏi/đưa lời khuyên).`,
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
console.log(`Updated ${updated} hand-written N3 grammar explanations.`)
