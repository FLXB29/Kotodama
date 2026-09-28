import fs from 'node:fs'
import prettier from 'prettier'

const masterPath = 'data/jlpt_n3_toan_master.json'
const standalonePath = 'data/jlpt_full_master.json'
const curatedPath = 'data/jlpt_n3_explanations_curated.json'
const reportPath = 'reports/n3-quality-audit/vocabulary-gloss-2021-12-review.json'
const fullMockId = 'toan-n3-202112-full'
const vocabStandaloneId = 'cm2u2xosv0138134ib0bvpy32-vocab'
const grammarStandaloneId = 'cm2u2xosv0138134ib0bvpy32-grammar-reading'
const questionPdfUrl = 'https://drive.google.com/file/d/1J-ZCgDqadzo6_E7zYqYBY0mu4YEtqgpo/view'
const answerSheet = {
  name: 'ĐÁP ÁN JLPT N3 (update 26.6.2026).pdf',
  url: 'https://drive.google.com/file/d/1Lmr3LwhnS3lEv4FYemiM0f93Qg5DLNZL/view#page=23',
  page: 23,
  answers: [1, 3, 3, 2, 1, 1, 4, 4, 4, 1, 2, 1, 3, 4, 2, 3, 2, 4, 1, 4, 2, 2, 3, 4, 2, 2, 3, 4, 1, 2, 1, 3, 1, 3, 4],
}

const reviews = [
  {
    number: 6,
    answer: 1,
    options: ['はえた', 'せいえた', 'しようえた', 'うえた'],
    explanation:
      'Đáp án 1 — 「生える」（はえる）là mọc/lớn lên tự nhiên, dùng cho cỏ, cây, tóc hoặc răng; dạng quá khứ là 「生えた」(はえた).\nDịch: “Trong đám cỏ mọc trong vườn, những bông hoa đẹp đang nở.”\n1. 「はえた」: cách đọc đúng của 「生えた」, mọc lên.\n2. 「せいえた」: đọc chữ 「生」 theo âm Hán 「せい」 rồi ghép sai; không phải cách đọc của từ 「生えた」.\n3. 「しようえた」: cách đọc sai, không phải cách đọc của 「生えた」.\n4. 「うえた」: cũng không phải cách đọc ở đây; 「植えた」（うえた）nghĩa là đã trồng (cây), một động từ khác.',
  },
  {
    number: 8,
    answer: 4,
    options: ['ほそう', 'ほうそう', 'ゆそう', 'ゆうそう'],
    explanation:
      'Đáp án 4 — 「郵送」（ゆうそう）là gửi thư/vật phẩm qua đường bưu điện.\nDịch: “Xin hãy gửi món này qua bưu điện.”\n1. 「ほそう」: cách đọc sai của 「郵送」.\n2. 「ほうそう」: cách đọc sai của 「郵送」; từ đồng âm 「放送」（ほうそう）lại có nghĩa là phát sóng.\n3. 「ゆそう」: thiếu trường âm 「う」 nên không phải cách đọc của 「郵送」.\n4. 「ゆうそう」: cách đọc đúng của 「郵送」, gửi qua bưu điện.',
  },
  {
    number: 10,
    answer: 1,
    options: ['性格', '正格', '性確', '正確'],
    explanation:
      'Đáp án 1 — 「性格」（せいかく）là tính cách.\nDịch: “Cô ấy vừa thông minh vừa có tính cách tốt.”\n1. 「性格」（せいかく）: tính cách; đúng với lời khen một người.\n2. 「正格」（せいかく）: đúng quy tắc/loại hình chuẩn, chủ yếu dùng trong phân loại ngữ pháp; không có nghĩa là tính cách.\n3. 「性確」: không phải cách viết chuẩn của từ せいかく.\n4. 「正確」（せいかく）: chính xác; nói về thông tin/kết quả, không diễn tả tính cách tốt.',
  },
  {
    number: 11,
    answer: 2,
    options: ['命例', '命令', '企例', '企令'],
    explanation:
      'Đáp án 2 — 「命令」（めいれい）là mệnh lệnh/chỉ thị.\nDịch: “Đó là mệnh lệnh của ai vậy?”\n1. 「命例」: không phải từ chuẩn; 「命」 có nghĩa sinh mệnh, 「例」 là ví dụ.\n2. 「命令」（めいれい）: mệnh lệnh; viết đúng từ 「めいれい」 trong câu.\n3. 「企例」: không phải từ chuẩn; 「企」 liên quan đến dự định/lập kế hoạch, 「例」 là ví dụ.\n4. 「企令」: không phải cách viết của từ này; chữ 「令」 có nghĩa mệnh lệnh nhưng 「企令」 không tạo thành từ 「めいれい」.',
  },
  {
    number: 12,
    answer: 1,
    options: ['預け', '借け', '替け', '貯け'],
    explanation:
      'Đáp án 1 — 「預ける」（あずける）là gửi/ký gửi tài sản cho nơi hoặc người khác giữ; ở ngân hàng là gửi tiền.\nDịch: “Tôi sẽ đến ngân hàng gửi tiền.”\n1. 「預け」（あずけ）: phần thân của 「預ける」; đúng nghĩa gửi tiền vào ngân hàng.\n2. 「借け」: cách viết sai; động từ “vay/mượn” là 「借りる」（かりる）, tức nhận tiền từ nơi khác chứ không gửi vào.\n3. 「替け」: cách viết sai; từ có nghĩa thay thế là 「替える」（かえる）, không đọc là あずけ.\n4. 「貯け」: cách viết sai; 「貯める」（ためる）là để dành/tích lũy, không viết động từ 「預ける」.',
  },
  {
    number: 13,
    answer: 3,
    options: ['予習', '予測', '予想', '予定'],
    explanation:
      'Đáp án 3 — 「予想」（よそう）là dự đoán/điều mình nghĩ trước sẽ xảy ra.\nDịch: “Điểm bài kiểm tra tốt hơn tôi dự đoán.”\n1. 「予習」（よしゅう）: chuẩn bị bài trước buổi học; không phải điều dự đoán.\n2. 「予測」（よそく）: dự báo/ước tính dựa trên thông tin hoặc xu hướng.\n3. 「予想」（よそう）: dự đoán/kỳ vọng; kết hợp đúng trong 「予想以上」, hơn mức dự đoán.\n4. 「予定」（よてい）: kế hoạch/lịch dự định; không có nghĩa là kết quả kỳ vọng.',
  },
  {
    number: 14,
    answer: 4,
    options: ['高値', '高費', '高給', '高価'],
    explanation:
      'Đáp án 4 — 「高価」（こうか）là đắt tiền/có giá trị cao; 「高価なもの」 là món đồ đắt tiền.\nDịch: “Đây là một món đồ rất đắt tiền.”\n1. 「高値」（たかね）: mức giá cao, thường nói về giá giao dịch/thị trường; không phải tính từ な để tả món đồ.\n2. 「高費」: không phải từ thông dụng/chuẩn với nghĩa “đắt”; nói chi phí cao là 「費用が高い」.\n3. 「高給」（こうきゅう）: mức lương cao; dùng cho tiền lương, không dùng để tả giá món đồ.\n4. 「高価」（こうか）: có giá trị cao/đắt; kết hợp đúng thành 「高価なもの」.',
  },
  {
    number: 15,
    answer: 2,
    options: ['発言', '報告', '講演', '応答'],
    explanation:
      'Đáp án 2 — 「出張の報告をする」 là báo cáo chuyến công tác sau khi trở về công ty.\nDịch: “Khi về công ty, tôi phải báo cáo về chuyến công tác lần này.”\n1. 「発言」（はつげん）: phát biểu/nêu ý kiến; không phải báo cáo kết quả chuyến đi.\n2. 「報告」（ほうこく）: báo cáo tình hình hoặc kết quả; kết hợp tự nhiên thành 「出張の報告」.\n3. 「講演」（こうえん）: bài diễn thuyết/buổi nói chuyện trước người nghe; không phải bản báo cáo công tác.\n4. 「応答」（おうとう）: lời đáp/sự hồi đáp; không dùng với nghĩa báo cáo chuyến đi.',
  },
  {
    number: 16,
    answer: 3,
    options: ['なぐった', 'うつった', 'あたった', 'うった'],
    explanation:
      'Đáp án 3 — 「ボールが人に当たった」 nghĩa là quả bóng va trúng một người. 「当たる」 là động từ tự động từ, dùng khi vật chạm trúng người/vật.\nDịch: “Quả bóng tennis đã trúng một người đang xem trận đấu.”\n1. 「なぐった」（殴った）: đã đấm/đánh ai đó; là hành động do người thực hiện và thường cần đối tượng 「人を」, không hợp với quả bóng làm chủ thể.\n2. 「うつった」: tùy chữ Hán có thể là 「移った」 (đã chuyển/di chuyển) hoặc 「映った・写った」 (đã hiện lên/được ghi hình); không diễn tả bóng va trúng khán giả.\n3. 「あたった」（当たった）: đã va trúng; đúng với quả bóng chạm vào người xem.\n4. 「うった」（打った）: đã đánh/đập (vào vật gì); thường là người chơi đánh quả bóng, nên chiều hành động không phù hợp với câu này.',
  },
  {
    number: 17,
    answer: 2,
    options: ['苦手', '無駄', '貧乏', '不用'],
    explanation:
      'Đáp án 2 — 「お金の無駄」 là sự lãng phí tiền bạc. Mua thứ không cần thiết chính là lãng phí tiền.\nDịch: “Mua những thứ không cần thiết là lãng phí tiền bạc.”\n1. 「苦手」（にがて）: kém/không giỏi hoặc không thích làm gì; không mang nghĩa lãng phí.\n2. 「無駄」（むだ）: vô ích, lãng phí; tạo cụm tự nhiên 「お金の無駄」.\n3. 「貧乏」（びんぼう）: nghèo, cảnh nghèo khó; không có nghĩa “lãng phí tiền”.\n4. 「不用」（ふよう）: không cần dùng/không dùng đến; bản thân từ này không diễn tả việc tiêu tiền hoang phí.',
  },
  {
    number: 18,
    answer: 4,
    options: ['うっかり', 'たいてい', 'そっと', 'なるべく'],
    explanation:
      'Đáp án 4 — 「なるべく多く」 là “càng nhiều càng tốt/có thể”. Dù chuyến đi chỉ có ba ngày, người nói muốn thăm thật nhiều ngôi chùa.\nDịch: “Chuyến đi lần này chỉ có ba ngày nên không có nhiều thời gian, nhưng tôi muốn thăm càng nhiều chùa càng tốt.”\n1. 「うっかり」: lơ đãng/vô ý; diễn tả cách làm do sơ suất, không bổ nghĩa cho số lượng chùa.\n2. 「たいてい」: thường/thông thường hoặc phần lớn; không có nghĩa “càng nhiều càng tốt”.\n3. 「そっと」: nhẹ nhàng/khẽ khàng, thường để tránh gây chú ý; không phù hợp với 「多く」 ở đây.\n4. 「なるべく」: hết mức có thể/cố gắng để đạt mức cao nhất; kết hợp tự nhiên với 「多く」.',
  },
  {
    number: 19,
    answer: 1,
    options: ['翌日', '今後', '明日', '早速'],
    explanation:
      'Đáp án 1 — 「日本に着いた翌日」 là ngày sau ngày đến Nhật. 「翌日」 xác định ngày tiếp theo tính từ một sự việc vừa được nhắc đến.\nDịch: “Ngày hôm sau khi đến Nhật, ở trường đại học có buổi hướng dẫn về các lớp học.”\n1. 「翌日」（よくじつ）: ngày hôm sau, tính từ mốc sự việc đã nêu; đúng với 「日本に着いた」.\n2. 「今後」（こんご）: từ nay về sau/trong tương lai; không chỉ ngày ngay sau khi đến.\n3. 「明日」（あした・あす）: ngày mai tính từ thời điểm người nói hiện đang kể; không nhất thiết là ngày sau hôm đến Nhật.\n4. 「早速」（さっそく）: ngay lập tức/không chậm trễ; không có nghĩa “ngày hôm sau”.',
  },
  {
    number: 20,
    answer: 4,
    options: ['オープン', 'ノック', 'マーク', 'チャレンジ'],
    explanation:
      'Đáp án 4 — 「新しいことにチャレンジする」 nghĩa là thử sức với điều mới.\nDịch: “Năm sau, tôi định thử làm một điều gì đó mới.”\n1. 「オープン」: mở cửa/khai trương; không kết hợp với 「新しいことに～する」 theo nghĩa thử sức.\n2. 「ノック」: tiếng gõ hoặc hành động gõ cửa; không phù hợp với việc thử một điều mới.\n3. 「マーク」: dấu/ký hiệu hoặc đánh dấu; không có nghĩa là thử sức.\n4. 「チャレンジ」: thử thách/thử sức; kết hợp tự nhiên thành 「新しいことにチャレンジする」.',
  },
  {
    number: 21,
    answer: 2,
    options: ['住所', '土地', '近所', '番地'],
    explanation:
      'Đáp án 2 — 「土地」 là đất/mảnh đất; có thể mua bán và mô tả là 「安く買った」.\nDịch: “Tôi đã mua được một mảnh đất gần ga với giá rẻ.”\n1. 「住所」（じゅうしょ）: địa chỉ/nơi cư trú; không phải thứ được mua trong câu này.\n2. 「土地」（とち）: đất đai/mảnh đất; phù hợp với việc mua gần ga.\n3. 「近所」（きんじょ）: khu vực lân cận/hàng xóm; chỉ khu vực, không phải một mảnh đất được mua.\n4. 「番地」（ばんち）: số lô/số địa chỉ trong một địa chỉ; không phải bất động sản để mua.',
  },
  {
    number: 22,
    answer: 2,
    options: ['これから', 'このあいだ', 'ふだん', 'しばらく'],
    explanation:
      'Đáp án 2 — 「このあいだ電話でお願いした件」 là việc đã nhờ qua điện thoại hôm trước/lần trước.\nDịch: “Việc tôi đã nhờ anh/chị qua điện thoại hôm trước tiến triển thế nào rồi?”\n1. 「これから」: từ bây giờ/từ đây trở đi; không phù hợp với việc đã nhờ trước đó.\n2. 「このあいだ」: hôm trước/dạo gần đây, chỉ một dịp đã xảy ra; đúng với lời nhờ trong quá khứ.\n3. 「ふだん」: thường ngày/thông thường; nói về thói quen, không chỉ một lần cụ thể.\n4. 「しばらく」: một lúc/một thời gian; chỉ khoảng thời gian chứ không có nghĩa “hôm trước”.',
  },
  {
    number: 23,
    answer: 3,
    options: ['がらがら', 'どきどき', 'ばらばら', 'ずきずき'],
    explanation:
      'Đáp án 3 — 「意見がばらばら」 nghĩa là ý kiến rời rạc/khác nhau, không thống nhất được thành một ý.\nDịch: “Ý kiến của mọi người khác nhau, nên không thể gộp thành một ý kiến.”\n1. 「がらがら」: lạch cạch/rầm rầm; cũng có thể tả nơi vắng người hoặc cửa mở toang, không tả ý kiến bất đồng.\n2. 「どきどき」: tim đập thình thịch vì hồi hộp; không nói về sự khác nhau giữa các ý kiến.\n3. 「ばらばら」: rời rạc/không thống nhất; dùng tự nhiên với 「意見」 trong câu này.\n4. 「ずきずき」: đau nhói/đau giật theo nhịp; thường tả cơn đau, không phải ý kiến.',
  },
  {
    number: 24,
    answer: 4,
    options: ['満足', '将来', '努力', '意志'],
    explanation:
      'Đáp án 4 — 「強い意志」 là ý chí/quyết tâm mạnh mẽ. 「絶対に音楽家になる」 nêu mục tiêu mà Sato quyết tâm thực hiện.\nDịch: “Có vẻ anh/chị Sato có ý chí mạnh mẽ là nhất định sẽ trở thành nhạc sĩ.”\n1. 「満足」（まんぞく）: sự hài lòng/thỏa mãn; thường nói 「満足する」, không phải thứ cần có để chỉ quyết tâm.\n2. 「将来」（しょうらい）: tương lai; 「強い将来」 không phải kết hợp tự nhiên.\n3. 「努力」（どりょく）: nỗ lực; thường dùng 「努力する」 hoặc 「努力を続ける」, còn 「強い努力」 không diễn tả ý chí trong câu.\n4. 「意志」（いし）: ý chí/quyết tâm; kết hợp tự nhiên thành 「強い意志」.',
  },
  {
    number: 25,
    answer: 2,
    options: ['おまちどおさま', 'おつかれさま', 'おかえりなさい', 'おかげさまで'],
    explanation:
      'Đáp án 2 — Khi đồng nghiệp nói 「お先に失礼します」 để xin phép về trước, câu đáp tự nhiên là 「お疲れさま」.\nDịch: “Yamada: Tôi làm xong việc rồi, xin phép về trước. — Tanaka: Anh/chị vất vả rồi.”\n1. 「おまちどおさま」（お待ち遠様）: xin lỗi/ cảm ơn vì đã để người khác chờ; dùng khi người kia phải đợi, không phải lời chào đồng nghiệp về trước.\n2. 「おつかれさま」（お疲れさま）: anh/chị đã vất vả rồi; lời đáp quen thuộc giữa đồng nghiệp khi một người kết thúc công việc.\n3. 「おかえりなさい」（お帰りなさい）: mừng bạn đã về; dùng khi đón người vừa trở về.\n4. 「おかげさまで」（お陰さまで）: nhờ ơn/nhờ mọi người mà…; thường đáp lời hỏi thăm, không phải lời tiễn đồng nghiệp.',
  },
  {
    number: 26,
    answer: 2,
    options: ['めずらしかった', 'つまらなかった', 'おかしかった', 'おもしろかった'],
    explanation:
      'Đáp án 2 — 「退屈だった」nghĩa là buồn tẻ/chán; cách nói gần nghĩa là 「つまらなかった」.\nDịch: “Bộ phim tôi xem hôm qua chán.”\n1. 「めずらしかった」（珍しかった）: hiếm/lạ; không đồng nghĩa với chán.\n2. 「つまらなかった」: chán/không thú vị; gần nghĩa với 「退屈だった」.\n3. 「おかしかった」（可笑しかった）: buồn cười hoặc kỳ lạ; khác nghĩa.\n4. 「おもしろかった」（面白かった）: thú vị/hay; gần như trái nghĩa với 「退屈だった」.',
  },
  {
    number: 27,
    answer: 3,
    options: ['座らないで', '走らないで', '触らないで', '休まないで'],
    explanation:
      'Đáp án 3 — 「触らないでください」là xin/ra lệnh đừng chạm vào.\nDịch: “Vì nguy hiểm nên tuyệt đối đừng chạm vào.”\n1. 「座らないで」: đừng ngồi xuống.\n2. 「走らないで」: đừng chạy.\n3. 「触らないで」（ふれないで）: đừng chạm vào; đúng với cảnh báo nguy hiểm.\n4. 「休まないで」: đừng nghỉ/đừng vắng mặt; không liên quan đến việc chạm vào vật nguy hiểm.',
  },
  {
    number: 28,
    answer: 4,
    options: ['プレゼント', 'アイディア', 'パーティー', 'チャンス'],
    explanation:
      'Đáp án 4 — 「機会」（きかい）là dịp/cơ hội; từ vay mượn tương đương là 「チャンス」.\nDịch: “Tôi nghĩ đó là một cơ hội rất tốt.”\n1. 「プレゼント」: quà tặng; không phải một dịp để làm việc gì.\n2. 「アイディア」: ý tưởng; là suy nghĩ/đề xuất, không phải cơ hội.\n3. 「パーティー」: bữa tiệc; là một sự kiện cụ thể, không đồng nghĩa với 機会.\n4. 「チャンス」: cơ hội; gần nghĩa với 「機会」.',
  },
  {
    number: 29,
    answer: 1,
    options: ['大変だった', '簡単だった', '楽しかった', '長かった'],
    explanation:
      'Đáp án 1 — 「きつかった」ở đây là vất vả/nặng nhọc; cách diễn đạt gần nghĩa là 「大変だった」.\nDịch: “Công việc lần này vất vả hơn thường ngày.”\n1. 「大変だった」: đã vất vả/khó khăn; gần nghĩa với 「きつかった」 trong câu này.\n2. 「簡単だった」: đã dễ dàng; không phải công việc nặng nhọc.\n3. 「楽しかった」: đã vui/thú vị; mô tả cảm giác vui, không phải mức độ vất vả.\n4. 「長かった」: đã dài/lâu; nói thời lượng, không nói công việc khó nhọc.',
  },
  {
    number: 30,
    answer: 2,
    options: ['少し分かった', 'とてもよく分かった', 'もう一度考えた', '何度も考えた'],
    explanation:
      'Đáp án 2 — 「納得した」là đã hiểu và chấp nhận lý do/lời giải thích; gần nhất là 「とてもよく分かった」.\nDịch: “Nghe bạn giải thích vì sao đáp án của mình sai, tôi đã hiểu rõ và thấy thuyết phục.”\n1. 「少し分かった」: đã hiểu một chút; mức độ hiểu chưa rõ bằng 「納得した」.\n2. 「とてもよく分かった」: đã hiểu rất rõ; gần nghĩa nhất trong ngữ cảnh này.\n3. 「もう一度考えた」: đã suy nghĩ lại một lần; không có nghĩa là hiểu/chấp nhận lời giải thích.\n4. 「何度も考えた」: đã suy nghĩ nhiều lần; nói về số lần suy nghĩ chứ không phải đã hiểu ra.\nGhi chú nguồn: PDF in 「少しかった」, có vẻ là lỗi in; hai bản dữ liệu giữ cách viết tự nhiên 「少し分かった」.',
  },
  {
    number: 33,
    answer: 1,
    options: [
      'マラソンで前の人を追い抜くときに、腕がぶつかってしまった。',
      'この山を追い抜いたら、向こうに海が見えると思います。',
      'この国では二十歳を追い抜くと、もう大人だ。',
      '12時を追い抜いたので、お昼ご飯にしましょう。',
    ],
    explanation:
      'Đáp án 1 — 「追い抜く」（おいぬく）là vượt lên trước người/vật đang di chuyển cùng hướng. 「マラソンで前の人を追い抜く」 là vượt người chạy phía trước trong cuộc đua marathon; đây là cách dùng đúng.\nDịch: “Khi vượt người chạy phía trước trong cuộc đua marathon, cánh tay tôi va phải người đó.”\n1. 「前の人を追い抜く」: vượt lên trước người ở phía trước; dùng đúng với người chạy marathon.\n2. 「山を追い抜く」: không dùng 追い抜く để nói vượt qua núi; nói vượt núi là 「山を越える」.\n3. 「二十歳を追い抜く」: không dùng với mốc tuổi; nói qua tuổi 20 là 「二十歳を過ぎる」.\n4. 「12時を追い抜く」: không dùng với mốc giờ; nói đã quá 12 giờ là 「12時を過ぎた」.\nGhi nhớ: 追い抜く là vượt người/vật đang đi phía trước; 越える là vượt chướng ngại/vật cản; 過ぎる dùng cho thời gian hoặc tuổi đã qua.',
  },
  {
    number: 34,
    answer: 3,
    options: [
      '今度のスピーチ大会には、川井さんが学校の見本で出るそうだ。',
      '私の兄は、日本人の見本の身長より10センチくらい高い。',
      'ここに申込書の書き方の見本があるので、参考にしてください。',
      'ギターを弾くのが初めての人は、見本から教えてもらえます。',
    ],
    explanation:
      'Đáp án 3 — 「見本」（みほん）là mẫu để xem và làm theo. 「申込書の書き方の見本」 là mẫu hướng dẫn cách điền đơn đăng ký, có thể dùng làm tài liệu tham khảo.\nDịch: “Ở đây có mẫu cách điền đơn đăng ký, vì vậy hãy tham khảo nhé.”\n1. 「学校の見本で出る」: không tự nhiên với nghĩa đại diện trường; dùng 「学校の代表として出る」.\n2. 「日本人の見本の身長」: chiều cao trung bình là 「日本人の平均身長」, không phải 見本の身長.\n3. 「書き方の見本」: mẫu cách viết/điền để xem và làm theo; cách dùng đúng.\n4. 「見本から教えてもらえる」: không tự nhiên với nghĩa được dạy từ căn bản; nên nói 「基本から教えてもらえる」.\nGhi nhớ: 見本 là mẫu tham khảo; 代表 là đại diện; 平均 là mức trung bình; 基本 là nền tảng.',
  },
]

const readJson = (file) => JSON.parse(fs.readFileSync(file, 'utf8'))
const normalizeOption = (option) => {
  const raw = typeof option === 'string' ? option : String(option?.text || '')
  return raw
    .replace(/^\s*[1-4](?:[.)．、]\s*|\s+)/u, '')
    .normalize('NFKC')
    .replace(/\s+/gu, '')
}
const formatJson = async (value, filepath) =>
  prettier.format(`${JSON.stringify(value, null, 2)}\n`, {
    ...(await prettier.resolveConfig(filepath)),
    filepath,
  })

const master = readJson(masterPath)
const standaloneMaster = readJson(standalonePath)
const curated = readJson(curatedPath)
const fullMock = master.find((exam) => exam.id === fullMockId)
const vocabStandalone = standaloneMaster.find((exam) => exam.id === vocabStandaloneId)
const grammarStandalone = standaloneMaster.find((exam) => exam.id === grammarStandaloneId)
if (!fullMock || !vocabStandalone || !grammarStandalone) {
  throw new Error('Could not find the December 2021 full, vocabulary, and grammar-reading exam views.')
}
const fullQuestions = fullMock.parts.flatMap((part) => part.questions || [])
const vocabQuestions = vocabStandalone.parts.flatMap((part) => part.questions || [])
const grammarQuestions = grammarStandalone.parts.flatMap((part) => part.questions || [])

const sourceCorrections = [
  { number: 6, optionIndex: 1, earlierLocalText: 'せいた', sourceText: 'せいえた' },
  { number: 12, optionIndex: 2, earlierLocalText: '替え', sourceText: '替け' },
]
for (const correction of sourceCorrections) {
  const question = fullQuestions.find((entry) => Number(entry.number) === correction.number)
  const option = question?.options?.[correction.optionIndex]
  if (!question || typeof option !== 'string') throw new Error(`Missing full-mock question ${correction.number}.`)
  const actualText = normalizeOption(option)
  if (actualText === correction.earlierLocalText) {
    question.options[correction.optionIndex] = option.replace(correction.earlierLocalText, correction.sourceText)
  } else if (actualText !== correction.sourceText) {
    throw new Error(`Question ${correction.number} option changed; check the original PDF before editing it.`)
  }
}

const standaloneTextCorrections = [
  { number: 33, optionIndex: 3, earlierLocalText: 'しましよう', sourceText: 'しましょう' },
  { number: 34, optionIndex: 2, earlierLocalText: 'くだきい', sourceText: 'ください' },
]
for (const correction of standaloneTextCorrections) {
  const question = vocabQuestions.find((entry) => Number(entry.number) === correction.number)
  const option = question?.options?.[correction.optionIndex]
  if (!question || !option || typeof option.text !== 'string') {
    throw new Error(`Missing standalone vocabulary question ${correction.number} option.`)
  }
  const actualText = normalizeOption(option)
  if (actualText.includes(correction.earlierLocalText.normalize('NFKC'))) {
    option.text = option.text.replace(correction.earlierLocalText, correction.sourceText)
  } else if (!actualText.includes(correction.sourceText.normalize('NFKC'))) {
    throw new Error(`Question ${correction.number} option changed; inspect the original PDF before editing it.`)
  }
}

const standaloneQuestionCorrections = [{ number: 27, earlierLocalText: 'くだきい', sourceText: 'ください' }]
for (const correction of standaloneQuestionCorrections) {
  const question = vocabQuestions.find((entry) => Number(entry.number) === correction.number)
  if (!question) throw new Error(`Missing standalone vocabulary question ${correction.number}.`)
  for (const field of ['question', 'sentence']) {
    const actualText = String(question[field] || '').normalize('NFKC')
    if (actualText.includes(correction.earlierLocalText)) {
      question[field] = question[field].replace(correction.earlierLocalText, correction.sourceText)
    } else if (!actualText.includes(correction.sourceText)) {
      throw new Error(`Question ${correction.number} ${field} changed; inspect the original PDF before editing it.`)
    }
  }
}

for (const row of reviews) {
  const full = fullQuestions.find((question) => Number(question.number) === row.number)
  const section = [...vocabQuestions, ...grammarQuestions].find((question) => Number(question.number) === row.number)
  if (!full || !section) throw new Error(`Question ${row.number} is missing from an exam view.`)
  if (
    Number(full.correctAnswer ?? full.answer) !== row.answer ||
    Number(section.correctAnswer ?? section.answer) !== row.answer
  ) {
    throw new Error(`Question ${row.number} stored answer differs from the reviewed answer.`)
  }
  if (
    JSON.stringify(full.options.map(normalizeOption)) !== JSON.stringify(row.options.map((x) => x.normalize('NFKC')))
  ) {
    throw new Error(`Question ${row.number} options changed; inspect before applying the glossary review.`)
  }
  if (
    JSON.stringify(section.options.map(normalizeOption)) !== JSON.stringify(row.options.map((x) => x.normalize('NFKC')))
  ) {
    throw new Error(`Question ${row.number} standalone options differ from the expected choices.`)
  }
  full.explanation = row.explanation
  section.explanation = row.explanation
  curated[full.id] = row.explanation
  curated[section.id] = row.explanation
}

const grammarQuestionNumbers = grammarStandalone.parts.flatMap((part) =>
  (part.questions || []).map((question) => Number(question.number))
)
const vocabQuestionNumbers = vocabStandalone.parts.flatMap((part) =>
  (part.questions || []).map((question) => Number(question.number))
)
if (grammarQuestionNumbers.some((number) => number >= 15 && number <= 25)) {
  const misplacedIndex = grammarStandalone.parts.findIndex((part) =>
    (part.questions || []).some((question) => Number(question.number) >= 15 && Number(question.number) <= 25)
  )
  const misplacedPart = grammarStandalone.parts[misplacedIndex]
  const movedQuestions = (misplacedPart?.questions || []).filter(
    (question) => Number(question.number) >= 15 && Number(question.number) <= 25
  )
  if (
    movedQuestions.length !== 11 ||
    (misplacedPart.questions || []).length !== 11 ||
    vocabQuestionNumbers.some((number) => number >= 15 && number <= 25)
  ) {
    throw new Error('The misplaced vocabulary group changed; inspect both section exams before reclassifying it.')
  }
  const sourcePart = fullMock.parts.find((part) =>
    (part.questions || []).some((question) => Number(question.number) === 15)
  )
  if (!sourcePart || !sourcePart.instruction.includes('問題 3')) {
    throw new Error('Could not verify the original vocabulary Mondai 3 instruction in the full mock.')
  }
  grammarStandalone.parts.splice(misplacedIndex, 1)
  vocabStandalone.parts.splice(2, 0, {
    title: 'Mondai 3',
    titleJP: '第3問',
    instruction: sourcePart.instruction,
    questions: movedQuestions,
  })
}

for (const [index, part] of vocabStandalone.parts.entries()) {
  part.title = `Mondai ${index + 1}`
  part.titleJP = `第${index + 1}問`
}
for (const [index, part] of grammarStandalone.parts.entries()) {
  part.title = `Mondai ${index + 1}`
  part.titleJP = `第${index + 1}問`
}

const correctedVocabNumbers = vocabStandalone.parts.flatMap((part) =>
  (part.questions || []).map((question) => Number(question.number))
)
const correctedGrammarNumbers = grammarStandalone.parts.flatMap((part) =>
  (part.questions || []).map((question) => Number(question.number))
)
const expectedVocabNumbers = Array.from({ length: 35 }, (_, index) => index + 1)
const expectedGrammarNumbers = Array.from({ length: 38 }, (_, index) => index + 36)
if (
  correctedVocabNumbers.length !== 35 ||
  correctedGrammarNumbers.length !== 38 ||
  JSON.stringify([...correctedVocabNumbers].sort((a, b) => a - b)) !== JSON.stringify(expectedVocabNumbers) ||
  JSON.stringify([...correctedGrammarNumbers].sort((a, b) => a - b)) !== JSON.stringify(expectedGrammarNumbers)
) {
  throw new Error('Reclassified section question counts or ranges are not the expected 35 and 38.')
}
vocabStandalone.questionCount = correctedVocabNumbers.length
grammarStandalone.questionCount = correctedGrammarNumbers.length

if (answerSheet.answers.length !== 35)
  throw new Error('The user-provided answer sheet sequence must cover 35 vocabulary questions.')
const standaloneVocabQuestions = vocabStandalone.parts.flatMap((part) => part.questions || [])
for (const [index, expectedAnswer] of answerSheet.answers.entries()) {
  const questionNumber = index + 1
  const fullQuestion = fullQuestions.find((question) => Number(question.number) === questionNumber)
  const standaloneQuestion = standaloneVocabQuestions.find((question) => Number(question.number) === questionNumber)
  if (!fullQuestion || !standaloneQuestion) {
    throw new Error(`Question ${questionNumber} is missing while checking the user-provided vocabulary answer sheet.`)
  }
  if (
    Number(fullQuestion.correctAnswer ?? fullQuestion.answer) !== expectedAnswer ||
    Number(standaloneQuestion.correctAnswer ?? standaloneQuestion.answer) !== expectedAnswer
  ) {
    throw new Error(`Question ${questionNumber} differs from the user-provided vocabulary answer sheet.`)
  }
}

const report = {
  generatedAt: new Date().toISOString(),
  examId: fullMockId,
  standaloneExamId: vocabStandaloneId,
  grammarReadingExamId: grammarStandaloneId,
  scope:
    'Manual contextual Vietnamese explanation and four-choice review for December 2021 vocabulary questions 6, 8, 10–25, 26–30, 33, and 34; source-text corrections; correction of the misplaced section group; and comparison of all 35 vocabulary answers against the user-provided answer sheet.',
  method:
    'Fetched the original question PDF text through Google Drive, visually inspected source PDF pages 4–6 and the user-provided answer sheet page 23 in Chrome, compared all 35 vocabulary answers in both app views against that sheet, compared the two stored question variants, and added concise contextual Vietnamese explanations with translations and distractor distinctions.',
  sourceLimits: {
    officialAnswerKeyConfirmed: false,
    userProvidedAnswerSheetVisuallyInspected: true,
    userProvidedAnswerSheetPage: answerSheet.page,
    originalPdfTextFetched: true,
    questionPdfVisuallyInspected: true,
    questionPaperPdfUrl: questionPdfUrl,
    visuallyInspectedPages: [4, 5, 6],
    note: 'The full-mock variants for questions 6 and 12 were corrected to the extracted PDF text. Visual inspection confirmed the standalone typo in question 27 should read ください, question 33 option 4 should read しましょう, and question 34 option 3 should read ください. The printed PDF visibly says 少しかった for question 30 option 1, while both app sources use the natural 少し分かった; the web version retains the natural wording and records the source misprint. All 35 vocabulary answers in both app views match page 23 of the user-provided reference sheet; this is not an official JLPT answer notice.',
  },
  answerKeyReview: {
    sourceName: answerSheet.name,
    sourceUrl: answerSheet.url,
    page: answerSheet.page,
    answerSequence: answerSheet.answers,
    questionCount: answerSheet.answers.length,
    fullMockMatches: answerSheet.answers.length,
    standaloneMatches: answerSheet.answers.length,
    officialAnswerPdfConfirmed: false,
    qualification: 'User-provided reference sheet; not an official JLPT answer notice.',
  },
  sourceCorrections: [
    {
      questionNumber: 6,
      optionNumber: 2,
      previousFullMockText: 'せいた',
      sourceText: 'せいえた',
      standaloneText: 'せいえた',
      result: 'corrected-full-mock-to-source',
    },
    {
      questionNumber: 12,
      optionNumber: 3,
      previousFullMockText: '替え',
      sourceText: '替け',
      standaloneText: '替け',
      result: 'corrected-full-mock-to-source',
    },
    {
      questionNumber: 30,
      optionNumber: 1,
      printedPdfText: '少しかった',
      storedText: '少し分かった',
      result: 'pdf-source-misprint-retained-natural-app-text',
    },
    {
      questionNumber: 33,
      optionNumber: 4,
      previousStandaloneText: 'しましよう',
      sourceText: 'しましょう',
      result: 'corrected-standalone-from-visual-source-review',
    },
    {
      questionNumber: 34,
      optionNumber: 3,
      previousStandaloneText: 'くだきい',
      sourceText: 'ください',
      result: 'corrected-standalone-from-visual-source-review',
    },
  ],
  transcriptionCorrections: [
    {
      questionNumber: 27,
      fields: ['question', 'sentence'],
      previousStandaloneText: 'くだきい',
      sourceText: 'ください',
      result: 'corrected-standalone-from-visual-source-review',
    },
  ],
  reviewedQuestionCount: reviews.length,
  reviewedChoiceCount: reviews.length * 4,
  sectionClassification: {
    vocabularyBefore: 24,
    grammarReadingBefore: 49,
    vocabularyAfter: 35,
    grammarReadingAfter: 38,
    movedQuestionNumbers: Array.from({ length: 11 }, (_, index) => index + 15),
    mondaiLabelsReindexed: true,
  },
  rows: reviews.map(({ number, answer, options }) => ({ number, answer, options, allChoicesExplained: true })),
  verdict:
    'Reviewed 25 questions and 100 choices, replacing misleading or missing local dictionary glosses with contextual meanings and concise distractor distinctions. Corrected two full-mock choices against the extracted PDF and three standalone typos against visual source inspection. Question 30 retains a natural app option while documenting the printed PDF misprint. All 35 vocabulary answers in both app views match the user-provided reference sheet; this does not establish an official JLPT key.',
}

fs.writeFileSync(masterPath, await formatJson(master, masterPath))
fs.writeFileSync(standalonePath, await formatJson(standaloneMaster, standalonePath))
fs.writeFileSync(curatedPath, await formatJson(curated, curatedPath))
fs.writeFileSync(reportPath, await formatJson(report, reportPath))
console.log(
  JSON.stringify({ reportPath, reviewedQuestions: reviews.length, reviewedChoices: reviews.length * 4 }, null, 2)
)
