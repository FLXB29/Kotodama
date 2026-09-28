import fs from 'node:fs'
import path from 'node:path'
import prettier from 'prettier'

const masterPath = 'data/jlpt_n3_toan_master.json'
const curatedPath = 'data/jlpt_n3_explanations_curated.json'
const reportPath = 'reports/n3-quality-audit/vocabulary-2011-07-review.json'
const examId = 'toan-n3-201107-full'
const apply = process.argv.includes('--apply')

const reviews = [
  {
    number: 1,
    answer: 3,
    options: ['しゅとう', 'しゅうと', 'しゅと', 'しゅうとう'],
    explanation: [
      'Đáp án 3 — 首都（しゅと）là thủ đô; câu hỏi muốn biết thủ đô của Nhật Bản ở đâu.',
      'Dịch: “Thủ đô của Nhật Bản ở đâu?”',
      '1. しゅとう: không phải cách đọc 首都; từ này đọc là しゅと.',
      '2. しゅうと: sai trường âm và âm cuối; không phải cách đọc chuẩn của 首都.',
      '3. しゅと: cách đọc đúng của 首都, nghĩa là thủ đô.',
      '4. しゅうとう: thêm trường âm không có trong cách đọc 首都.',
    ].join('\n'),
  },
  {
    number: 2,
    answer: 2,
    options: ['じきゅう', 'ちきゅう', 'じきゅ', 'ちきゅ'],
    explanation: [
      'Đáp án 2 — 地球（ちきゅう）là Trái Đất; câu nêu chuyển động quay quanh Mặt Trời.',
      'Dịch: “Trái Đất quay quanh Mặt Trời.”',
      '1. じきゅう: sai âm đầu; 地 đọc là ち trong từ này.',
      '2. ちきゅう: cách đọc đúng của 地球.',
      '3. じきゅ: sai âm đầu và thiếu trường âm cuối.',
      '4. ちきゅ: thiếu trường âm う; cách đọc chuẩn là ちきゅう.',
    ].join('\n'),
  },
  {
    number: 3,
    answer: 2,
    options: ['こわれて', 'おくれて', 'たおれて', 'よごれて'],
    explanation: [
      'Đáp án 2 — 遅れる（おくれる）là chậm/trễ; đồng hồ đó đang chạy chậm so với giờ đúng.',
      'Dịch: “Chiếc đồng hồ đó đang bị chậm.”',
      '1. こわれて: 壊れる, bị hỏng; không phải cách đọc 遅れて.',
      '2. おくれて: cách đọc đúng của 遅れて, dạng て của 遅れる.',
      '3. たおれて: 倒れる, ngã/đổ; không phải cách đọc của 遅れる.',
      '4. よごれて: 汚れる, bị bẩn; không phải cách đọc của 遅れる.',
    ].join('\n'),
  },
  {
    number: 4,
    answer: 3,
    options: ['きょりょく', 'どりょく', 'きょうりょく', 'どうりょく'],
    explanation: [
      'Đáp án 3 — 協力（きょうりょく）là hợp tác; hai người cùng làm thì công việc có thể kết thúc sớm.',
      'Dịch: “Nếu hai người cùng hợp tác thì công việc sẽ xong nhanh hơn.”',
      '1. きょりょく: thiếu trường âm; không phải cách đọc chuẩn của 協力.',
      '2. どりょく: 努力, nỗ lực; là từ khác, không phải 協力.',
      '3. きょうりょく: cách đọc đúng của 協力, sự hợp tác.',
      '4. どうりょく: sai âm đầu và âm ghép; không phải cách đọc 協力.',
    ].join('\n'),
  },
  {
    number: 5,
    answer: 1,
    options: ['おうぼ', 'おうも', 'おうぼう', 'おうもう'],
    explanation: [
      'Đáp án 1 — 応募（おうぼ）là nộp đơn/ứng tuyển; người nói đã nộp đơn xin học bổng đại học.',
      'Dịch: “Tôi đã đăng ký xin học bổng của trường đại học.”',
      '1. おうぼ: cách đọc đúng của 応募.',
      '2. おうも: sai phụ âm cuối của 応募.',
      '3. おうぼう: thêm trường âm sau ぼ; cách đọc đúng không có う cuối.',
      '4. おうもう: vừa sai âm ぼ vừa thêm trường âm; không phải cách đọc 応募.',
    ].join('\n'),
  },
  {
    number: 6,
    answer: 4,
    options: ['くもん', 'きもん', 'ぐもん', 'ぎもん'],
    explanation: [
      'Đáp án 4 — 疑問（ぎもん）là câu hỏi/điều thắc mắc; người nói đã trả lời điều trẻ muốn biết.',
      'Dịch: “Tôi đã trả lời thắc mắc của đứa trẻ.”',
      '1. くもん: sai phụ âm đầu của 疑問.',
      '2. きもん: sai phụ âm đầu; 疑 đọc là ぎ trong từ này.',
      '3. ぐもん: sai âm đục của 疑.',
      '4. ぎもん: cách đọc đúng của 疑問.',
    ].join('\n'),
  },
  {
    number: 7,
    answer: 2,
    options: ['はつひょう', 'はっぴょう', 'はつひょ', 'はっぴょ'],
    explanation: [
      'Đáp án 2 — 発表（はっぴょう）là công bố/thông báo; kết quả thi đã được công bố.',
      'Dịch: “Kết quả kỳ thi đã được công bố.”',
      '1. はつひょう: thiếu âm ngắt nhỏ っ và sai âm đọc của 表.',
      '2. はっぴょう: cách đọc đúng của 発表.',
      '3. はつひょ: thiếu っ và thiếu trường âm よう.',
      '4. はっぴょ: thiếu trường âm よう ở cuối.',
    ].join('\n'),
  },
  {
    number: 8,
    answer: 4,
    options: ['げいご', 'けいご', 'だんご', 'たんご'],
    explanation: [
      'Đáp án 4 — 単語（たんご）là từ vựng/từ đơn; danh sách từ nằm ở trang bên cạnh.',
      'Dịch: “Danh sách từ vựng nằm ở trang bên cạnh.”',
      '1. げいご: sai âm đầu và âm đục; không phải cách đọc 単語.',
      '2. けいご: 敬語, ngôn ngữ kính ngữ; là từ khác.',
      '3. だんご: 団子, bánh dango; là từ khác.',
      '4. たんご: cách đọc đúng của 単語.',
    ].join('\n'),
  },
  {
    number: 9,
    answer: 3,
    options: ['改決', '改結', '解決', '解結'],
    explanation: [
      'Đáp án 3 — 解決（かいけつ）là giải quyết; mọi người thảo luận rồi xử lý vấn đề.',
      'Dịch: “Mọi người cùng bàn bạc rồi giải quyết vấn đề.”',
      '1. 改決: không phải cách viết chuẩn của かいけつ; 改める mang nghĩa sửa đổi, không phải giải quyết trong từ này.',
      '2. 改結: không tạo thành từ chuẩn với nghĩa giải quyết vấn đề.',
      '3. 解決: cách viết đúng; 解決する là giải quyết vấn đề.',
      '4. 解結: 結 không phải chữ dùng trong từ 解決; tổ hợp này không mang nghĩa cần tìm.',
    ].join('\n'),
  },
  {
    number: 10,
    answer: 4,
    options: ['安内', '家内', '室内', '案内'],
    explanation: [
      'Đáp án 4 — 案内（あんない）là hướng dẫn/dẫn đường; Yamaguchi đã dẫn người nói đi tham quan Tokyo.',
      'Dịch: “Anh/chị Yamaguchi đã dẫn tôi đi tham quan Tokyo.”',
      '1. 安内: không phải từ chuẩn chỉ sự hướng dẫn; 安 có nghĩa yên/ổn.',
      '2. 家内（かない）: trong nhà/vợ (cách gọi khiêm nhường); không có nghĩa hướng dẫn.',
      '3. 室内（しつない）: trong phòng; chỉ địa điểm, không phải hành động dẫn đi.',
      '4. 案内（あんない）: hướng dẫn/đưa đi; 案内してもらう là được ai đó dẫn đi.',
    ].join('\n'),
  },
  {
    number: 11,
    answer: 1,
    options: ['健康', '建康', '健庫', '建庫'],
    explanation: [
      'Đáp án 1 — 健康（けんこう）là sức khỏe; người nói chạy bộ mỗi ngày để giữ gìn sức khỏe.',
      'Dịch: “Tôi chạy bộ mỗi ngày vì sức khỏe.”',
      '1. 健康: cách viết chuẩn của けんこう, sức khỏe.',
      '2. 建康: 建 không phải chữ trong từ 健康; cách viết này không mang nghĩa sức khỏe.',
      '3. 健庫: 庫 là kho; tổ hợp này không phải từ chỉ sức khỏe.',
      '4. 建庫: không phải từ chuẩn có cách đọc けんこう và nghĩa sức khỏe.',
    ].join('\n'),
  },
  {
    number: 12,
    answer: 2,
    options: ['気湿', '気温', '気湯', '気混'],
    explanation: [
      'Đáp án 2 — 気温（きおん）là nhiệt độ không khí; câu nói mùa hè năm nay trời nóng với nhiệt độ cao.',
      'Dịch: “Nhiệt độ mùa hè năm nay đã cao.”',
      '1. 気湿: 湿 nghĩa là độ ẩm; không phải cách viết của 気温.',
      '2. 気温: cách viết đúng của きおん, nhiệt độ không khí.',
      '3. 気湯: 湯 là nước nóng; tổ hợp này không có nghĩa nhiệt độ không khí.',
      '4. 気混: 混 liên quan đến trộn/lẫn; không phải từ chỉ nhiệt độ.',
    ].join('\n'),
  },
  {
    number: 13,
    answer: 2,
    options: ['病い', '痛い', '疫い', '症い'],
    explanation: [
      'Đáp án 2 — 痛い（いたい）là đau; vì bị đau đầu nên người nói đã uống thuốc.',
      'Dịch: “Vì đau đầu nên tôi đã uống thuốc.”',
      '1. 病い: 病 là bệnh (びょう/やまい), không dùng cách viết này cho tính từ いたい.',
      '2. 痛い: cách viết đúng của いたい, đau.',
      '3. 疫い: 疫 xuất hiện trong từ như 疫病, nhưng 疫い không phải cách viết của いたい.',
      '4. 症い: 症 xuất hiện trong 症状 (triệu chứng); 症い không phải từ có cách đọc và nghĩa này.',
    ].join('\n'),
  },
  {
    number: 14,
    answer: 3,
    options: ['多量', '多料', '大量', '大料'],
    explanation: [
      'Đáp án 3 — 大量（たいりょう）là số lượng lớn; chiếc áo được sản xuất với số lượng lớn tại nhà máy.',
      'Dịch: “Chiếc áo này được sản xuất hàng loạt tại nhà máy.”',
      '1. 多量（たりょう）: số lượng nhiều, nhưng đọc là たりょう chứ không phải たいりょう.',
      '2. 多料: không phải từ chuẩn với nghĩa sản xuất số lượng lớn; 料 thường liên quan phí/nguyên liệu.',
      '3. 大量（たいりょう）: cách viết và cách đọc đúng, nghĩa là số lượng lớn.',
      '4. 大料: không phải cách viết chuẩn của たいりょう trong nghĩa này.',
    ].join('\n'),
  },
  {
    number: 15,
    answer: 2,
    options: ['関心', '不満', '目標', '我慢'],
    explanation: [
      'Đáp án 2 — 不満（ふまん）là sự không hài lòng/phàn nàn; một số người dùng không thích việc nút bấm khó nhấn.',
      'Dịch: “Một số người dùng phàn nàn rằng các nút của chiếc điện thoại này khó bấm.”',
      '1. 関心（かんしん）: sự quan tâm; không diễn tả ý kiến tiêu cực về nút bấm.',
      '2. 不満（ふまん）: điều không hài lòng; 「不満を持つ」là có lời phàn nàn/bất mãn.',
      '3. 目標（もくひょう）: mục tiêu; không phải cảm nhận của khách hàng về sản phẩm.',
      '4. 我慢（がまん）: sự chịu đựng; 「不便を我慢する」là chịu bất tiện, không phải có phàn nàn.',
    ].join('\n'),
  },
  {
    number: 16,
    answer: 4,
    options: ['ぐらぐら', 'がらがら', 'ばらばら', 'ぶらぶら'],
    explanation: [
      'Đáp án 4 — ぶらぶらする là đi loanh quanh thong thả, không có mục đích cụ thể; đang đi dạo phố thì tình cờ gặp Yamamoto.',
      'Dịch: “Đang đi loanh quanh trong phố thì tôi gặp anh Yamamoto.”',
      '1. ぐらぐら: lắc lư/chao đảo; thường tả vật không vững hoặc răng lung lay.',
      '2. がらがら: trống vắng hoặc tiếng lạch cạch; không có nghĩa đi dạo.',
      '3. ばらばら: rời rạc/tách rời; không diễn tả việc đi chơi quanh phố.',
      '4. ぶらぶら: đi dạo/đi quanh nhàn rỗi; 街をぶらぶらする là kết hợp tự nhiên.',
    ].join('\n'),
  },
  {
    number: 17,
    answer: 3,
    options: ['証明書', '領収書', '申込書', '参考書'],
    explanation: [
      'Đáp án 3 — 申込書（もうしこみしょ）là mẫu đơn đăng ký; người muốn dự hội thảo điền địa chỉ, tên và ngày mong muốn vào đơn.',
      'Dịch: “Ai muốn tham gia hội thảo hãy điền địa chỉ, họ tên và ngày mong muốn vào đơn đăng ký.”',
      '1. 証明書（しょうめいしょ）: giấy chứng nhận; không phải biểu mẫu đăng ký dự sự kiện.',
      '2. 領収書（りょうしゅうしょ）: biên lai; dùng để chứng minh đã thanh toán.',
      '3. 申込書（もうしこみしょ）: đơn đăng ký/phiếu đăng ký; phù hợp với thông tin cần điền trước khi tham gia.',
      '4. 参考書（さんこうしょ）: sách tham khảo; không phải giấy để ghi thông tin đăng ký.',
    ].join('\n'),
  },
  {
    number: 18,
    answer: 3,
    options: ['意外', '重大', '複雑', '正常'],
    explanation: [
      'Đáp án 3 — 複雑（ふくざつ）là phức tạp; phép tính rắc rối đến mức dùng máy tính vẫn tốn thời gian.',
      'Dịch: “Phép tính này phức tạp nên dù dùng máy tính vẫn mất thời gian.”',
      '1. 意外（いがい）: bất ngờ/không ngờ; không mô tả độ khó của phép tính.',
      '2. 重大（じゅうだい）: nghiêm trọng/quan trọng; không giải thích vì sao phải tính lâu.',
      '3. 複雑（ふくざつ）: phức tạp; hợp với phép tính nhiều bước/rắc rối.',
      '4. 正常（せいじょう）: bình thường/hoạt động ổn định; trái với ý phép tính khó xử lý.',
    ].join('\n'),
  },
  {
    number: 19,
    answer: 1,
    options: ['流れて', 'しずんで', '浮いて', 'こぼれて'],
    explanation: [
      'Đáp án 1 — 川が流れる là dòng sông chảy; câu nói có một con sông lớn chảy qua thị trấn.',
      'Dịch: “Ở thị trấn này có một con sông lớn chảy qua.”',
      '1. 流れて（流れる）: chảy; kết hợp tự nhiên với 川が〜いる.',
      '2. しずんで（沈む）: chìm/lặn xuống; không phải chuyển động thông thường của dòng sông qua thị trấn.',
      '3. 浮いて（浮く）: nổi; không diễn tả con sông chảy.',
      '4. こぼれて（こぼれる）: tràn/đổ ra ngoài khỏi vật chứa; không dùng để nói sông chảy qua.',
    ].join('\n'),
  },
  {
    number: 20,
    answer: 1,
    options: ['産', '製', '作', '品'],
    explanation: [
      'Đáp án 1 — アメリカ産 là có nguồn gốc/sản xuất tại Mỹ; 産 gắn sau địa danh để nêu nơi sản vật được trồng hoặc làm ra.',
      'Dịch: “Quả cam này có xuất xứ từ Mỹ.”',
      '1. 産: chỉ nơi xuất xứ; アメリカ産オレンジ là cam có nguồn gốc Mỹ.',
      '2. 製: nói về nơi/chủ thể chế tạo vật, thường trong tên sản phẩm công nghiệp như 日本製; không dùng tự nhiên cho nông sản ở mẫu này.',
      '3. 作: nghĩa là làm/tạo ra; アメリカ作 không phải cách nói xuất xứ chuẩn.',
      '4. 品: món hàng/sản phẩm; 品 đứng riêng không biểu thị nơi sản xuất.',
    ].join('\n'),
  },
  {
    number: 21,
    answer: 2,
    options: ['スピーチ', 'インタビュー', 'メッセージ', 'コミュニケーション'],
    explanation: [
      'Đáp án 2 — インタビューをする là phỏng vấn; người viết bài hỏi vận động viên vừa vô địch để lấy thông tin.',
      'Dịch: “Tôi đã phỏng vấn vận động viên vô địch rồi viết bài.”',
      '1. スピーチ: bài phát biểu; người viết không yêu cầu vận động viên phát biểu trước khán giả.',
      '2. インタビュー: cuộc phỏng vấn; 優勝した選手にインタビューする là cách dùng đúng.',
      '3. メッセージ: lời nhắn/thông điệp; không phải một cuộc hỏi đáp để viết bài.',
      '4. コミュニケーション: giao tiếp/nối kết; nghĩa rộng hơn, không chỉ việc phỏng vấn một người.',
    ].join('\n'),
  },
  {
    number: 22,
    answer: 3,
    options: ['命令', '返信', '主張', '注文'],
    explanation: [
      'Đáp án 3 — 意見を主張する là nêu/khẳng định ý kiến của mình; vì ai cũng nói lập trường nên cuộc họp kéo dài.',
      'Dịch: “Vì mọi người đều nêu ý kiến riêng nên cuộc họp mãi chưa kết thúc.”',
      '1. 命令（めいれい）: ra lệnh; không phải bày tỏ ý kiến trong cuộc họp.',
      '2. 返信（へんしん）: trả lời thư/tin nhắn; không khớp với 会議で意見を〜する.',
      '3. 主張（しゅちょう）: khẳng định/nêu lập trường; 意見を主張する là kết hợp phù hợp.',
      '4. 注文（ちゅうもん）: đặt hàng/gọi món hoặc yêu cầu; không phải nêu quan điểm.',
    ].join('\n'),
  },
  {
    number: 23,
    answer: 4,
    options: ['準備', '世話', '選択', '整理'],
    explanation: [
      'Đáp án 4 — 書類や本が整理されている nghĩa là giấy tờ và sách được sắp xếp ngăn nắp; đó là lý do căn phòng trông gọn gàng.',
      'Dịch: “Giấy tờ và sách được sắp xếp chỉnh tề; căn phòng đẹp và gọn thật.”',
      '1. 準備（じゅんび）: chuẩn bị; không có nghĩa là các giấy tờ đã được xếp gọn.',
      '2. 世話（せわ）: chăm sóc/giúp đỡ; không phù hợp với đồ vật được sắp xếp.',
      '3. 選択（せんたく）: lựa chọn; không mô tả tình trạng ngăn nắp.',
      '4. 整理（せいり）: sắp xếp/phân loại gọn gàng; 書類や本が整理されている dùng đúng.',
    ].join('\n'),
  },
  {
    number: 24,
    answer: 2,
    options: ['ぺらぺら', 'からから', 'ふらふら', 'ぺこぺこ'],
    explanation: [
      'Đáp án 2 — のどがからから là cổ họng khô khốc/khát khô; từ sáng chưa uống gì nên người nói khát.',
      'Dịch: “Từ sáng tôi chưa uống gì nên cổ họng khô khốc.”',
      '1. ぺらぺら: nói trôi chảy (ngôn ngữ) hoặc mỏng; không diễn tả khát.',
      '2. からから: khô rang; のどがからから là cách nói tự nhiên về khát nước.',
      '3. ふらふら: choáng váng/đi không vững; mô tả trạng thái cơ thể chứ không phải cổ họng khô.',
      '4. ぺこぺこ: đói cồn cào, thường nói おなかがぺこぺこ; không diễn tả cổ họng khát.',
    ].join('\n'),
  },
  {
    number: 25,
    answer: 1,
    options: ['ためて', 'のせて', 'かさねて', 'くわえて'],
    explanation: [
      'Đáp án 1 — お金をためる là để dành/tiết kiệm tiền; người nói tiết kiệm cho tương lai.',
      'Dịch: “Tôi đang để dành tiền cho tương lai.”',
      '1. ためて: 貯める, tích góp/để dành; kết hợp đúng với お金.',
      '2. のせて: 乗せる/載せる, đặt hoặc chở lên; không có nghĩa tiết kiệm tiền.',
      '3. かさねて: 重ねる, xếp chồng/chồng thêm; không dùng với お金 để nói dành dụm.',
      '4. くわえて: 加える, thêm vào; không diễn tả tiết kiệm để dành.',
    ].join('\n'),
  },
  {
    number: 26,
    answer: 1,
    options: ['仕事に行って', '勉強に行って', '買い物に行って', '散歩に行って'],
    explanation: [
      'Đáp án 1 — 通勤する（つうきんする）là đi từ nhà đến nơi làm việc; nghĩa gần nhất là đi làm.',
      'Dịch: “Tôi đang đi làm cùng với vợ.”',
      '1. 仕事に行って: đi làm; gần nghĩa nhất với 通勤して.',
      '2. 勉強に行って: đi học/đi học tập; khác với đi làm.',
      '3. 買い物に行って: đi mua sắm; là mục đích khác.',
      '4. 散歩に行って: đi dạo; không liên quan đến việc đi làm hằng ngày.',
    ].join('\n'),
  },
  {
    number: 27,
    answer: 4,
    options: ['たのしい', 'うれしい', 'はずかしい', 'こわい'],
    explanation: [
      'Đáp án 4 — おそろしい nghĩa là đáng sợ/kinh khủng; gần nghĩa nhất là こわい.',
      'Dịch: “Tôi đã trải qua một chuyện rất đáng sợ.”',
      '1. たのしい: vui/thú vị; trái với sắc thái đáng sợ.',
      '2. うれしい: vui mừng; diễn tả niềm vui chứ không phải sợ hãi.',
      '3. はずかしい: xấu hổ/ngượng; là cảm xúc khác.',
      '4. こわい: sợ/đáng sợ; gần nghĩa với おそろしい trong câu này.',
    ].join('\n'),
  },
  {
    number: 28,
    answer: 3,
    options: ['アイディア', 'ルール', '理由', '秘密'],
    explanation: [
      'Đáp án 3 — わけ ở đây là lý do/nguyên do; người nói kể lý do của mình với giáo viên.',
      'Dịch: “Tôi đã kể lý do cho thầy/cô.”',
      '1. アイディア: ý tưởng; không đồng nghĩa với lý do.',
      '2. ルール: quy tắc; không giải thích vì sao một việc xảy ra.',
      '3. 理由（りゆう）: lý do; gần nghĩa với わけ trong câu này.',
      '4. 秘密（ひみつ）: bí mật; một thông tin cần giấu, không phải nguyên do.',
    ].join('\n'),
  },
  {
    number: 29,
    answer: 2,
    options: ['多くなった', '少なくなった', 'きれいになった', 'きたなくなった'],
    explanation: [
      'Đáp án 2 — 水が減る（へる）là lượng nước giảm; gần nghĩa với 少なくなる.',
      'Dịch: “Gần đây tôi có cảm giác lượng nước ở con sông này đã giảm.”',
      '1. 多くなった: đã tăng/nhiều lên; ngược nghĩa với へった.',
      '2. 少なくなった: đã ít đi; diễn đạt đúng việc lượng nước giảm.',
      '3. きれいになった: đã sạch/đẹp hơn; nói về chất lượng, không phải lượng nước.',
      '4. きたなくなった: đã bẩn hơn; cũng nói về chất lượng chứ không phải lượng.',
    ].join('\n'),
  },
  {
    number: 30,
    answer: 3,
    options: ['やり方を調べた', 'やり方を教わった', 'もう一度やった', 'やるのを途中でやめた'],
    explanation: [
      'Đáp án 3 — やり直す（やりなおす）là làm lại một lần nữa/từ đầu; thí nghiệm không thành công nên được thử lại.',
      'Dịch: “Thí nghiệm không thành công nên tôi đã làm lại.”',
      '1. やり方を調べた: đã tìm hiểu cách làm; không có nghĩa thực hiện lại thí nghiệm.',
      '2. やり方を教わった: đã được chỉ cách làm; chưa nói rằng đã làm lại.',
      '3. もう一度やった: đã làm thêm một lần nữa; gần nghĩa trực tiếp với やり直した.',
      '4. やるのを途中でやめた: đã dừng giữa chừng; trái nghĩa với làm lại.',
    ].join('\n'),
  },
  {
    number: 31,
    answer: 4,
    options: [
      '今日は疲れたので、早めにベッドにころんだ',
      '仕事が入ったので、旅行の計画がころんでしまった',
      '台風で庭の木がころんだ',
      '階段でころんでけがをした',
    ],
    explanation: [
      'Đáp án 4 — 転ぶ（ころぶ）là ngã, mất thăng bằng rồi đổ xuống; người nói bị ngã trên cầu thang và bị thương.',
      'Dịch câu đúng: “Tôi bị ngã ở cầu thang và bị thương.”',
      '1. Nếu muốn nói “mệt nên đi nằm/đi ngủ sớm”, cách nói tự nhiên là 横になった hoặc ベッドに入った. 転んだ nói về việc ngã; có thể hình dung ai đó ngã lên giường, nhưng câu không nêu tai nạn và không diễn đạt tự nhiên ý “đi nằm sớm”.',
      '2. Kế hoạch du lịch bị hủy/đổ bể thì dùng 計画がだめになった・くずれた; kế hoạch không “ngã”.',
      '3. Cây đổ do bão thì thường dùng 木が倒れた; 転ぶ chủ yếu nói về người/con vật ngã.',
      '4. 階段で転んでけがをした: ngã ở cầu thang rồi bị thương; cách dùng đúng.',
    ].join('\n'),
  },
  {
    number: 32,
    answer: 1,
    options: [
      '「この書類、３０部コピーしておいて」と秘書に指示した',
      '「この作文を見ていただけませんか」と先生に指示した',
      '「あした映画を見に行こうよ」と友達に指示した',
      '「トイレはどこにありますか」と店員に指示した',
    ],
    explanation: [
      'Đáp án 1 — 指示する（しじする）là giao chỉ thị/hướng dẫn công việc; yêu cầu thư ký sao chép tài liệu là chỉ thị cụ thể.',
      'Dịch câu đúng: “Tôi chỉ thị cho thư ký: ‘Hãy sao chép sẵn 30 bản tài liệu này nhé.’”',
      '1. Giao cho thư ký nhiệm vụ sao chép 30 bản: 指示した dùng đúng.',
      '2. Nhờ giáo viên xem bài là お願いした・頼んだ; không phải ra chỉ thị cho giáo viên.',
      '3. Rủ bạn đi xem phim thì dùng 誘った; đó không phải chỉ thị.',
      '4. Hỏi nhân viên nhà vệ sinh ở đâu thì dùng 尋ねた・聞いた; không phải chỉ thị.',
    ].join('\n'),
  },
  {
    number: 33,
    answer: 4,
    options: [
      '毎日かならずメールを見送るようにしている',
      '何ページか見送ってみたが、むずかしくてわからなかった',
      '電車の窓から景色を見送るのが好きだ',
      '国に帰る友人を空港まで見送った',
    ],
    explanation: [
      'Đáp án 4 — 見送る（みおくる）là tiễn người lên đường hoặc nhìn họ rời đi; người nói tiễn bạn ở sân bay.',
      'Dịch câu đúng: “Tôi đã tiễn người bạn về nước đến tận sân bay.”',
      '1. Với email, nói đọc/kiểm tra thư là メールを読む・確認する; không nói 見送る.',
      '2. Bỏ qua vài trang để đọc tiếp thì dùng ページを飛ばして読む; không “tiễn” các trang.',
      '3. 見送る thường dùng khi tiễn hoặc nhìn người/phương tiện rời đi. 景色を見送る có thể hiểu là nhìn cảnh vật khuất dần, nhưng cách nói thông thường là 景色を眺める; câu 4 là kết hợp rõ và tự nhiên hơn.',
      '4. Tiễn bạn về nước tới sân bay: 見送った dùng đúng.',
    ].join('\n'),
  },
  {
    number: 34,
    answer: 1,
    options: [
      '近所の公園にはいろいろな花が植えてある',
      'ケーキにいちごやクリームをたくさん植えた',
      'この空港は海に土を植えて作られた',
      '道に電灯を植えたので明るくなった',
    ],
    explanation: [
      'Đáp án 1 — 植える（うえる）là trồng cây/hạt vào đất; công viên có nhiều loại hoa đã được trồng.',
      'Dịch câu đúng: “Trong công viên gần nhà có trồng nhiều loại hoa.”',
      '1. Hoa được trồng sẵn trong công viên: 花を植える là cách dùng đúng.',
      '2. Đặt dâu và kem lên bánh thì dùng のせる・飾る, không dùng 植える.',
      '3. Tạo đất bằng cách lấn biển thì nói 海を埋め立てて作る; không “trồng đất” xuống biển.',
      '4. Lắp đèn đường thì dùng 電灯を設置する; không “trồng” đèn.',
    ].join('\n'),
  },
  {
    number: 35,
    answer: 1,
    options: [
      '小川さんは正直な人で、決してうそは言いません',
      'この商品の正直な使い方をこれから説明します',
      'これは正直な話なのに、だれも信じてくれません',
      '正直な距離は分かりませんが、１０キロぐらいだと思います',
    ],
    explanation: [
      'Đáp án 1 — 正直（しょうじき）là trung thực, không nói dối; đây là cách dùng tự nhiên để mô tả tính cách một người.',
      'Dịch câu đúng: “Anh Ogawa là người trung thực, tuyệt đối không nói dối.”',
      '1. 正直な人: người trung thực; câu giải thích ngay là người ấy không nói dối nên cách dùng đúng.',
      '2. Cách dùng đúng/quy chuẩn là 正しい使い方; 正直 không có nghĩa “đúng”.',
      '3. 正直な話 là cụm có thật, thường dùng với nghĩa “nói thật lòng”. Nếu ý là “đây là chuyện có thật nhưng chẳng ai tin”, 本当の話 tự nhiên và rõ nghĩa hơn; vì vậy câu này kém phù hợp với cách dùng đang kiểm tra, chứ không phải sai ngữ pháp tuyệt đối.',
      '4. Khoảng cách chính xác là 正確な距離; 正直 không mô tả độ chính xác.',
    ].join('\n'),
  },
]

const normalizeOption = (value) =>
  String(value || '')
    .normalize('NFKC')
    .replace(/^\s*[1-4][.)．、]\s*/u, '')
    .replace(/^\s*[1-4]\s+/u, '')
    .replace(/\s+/gu, '')

if (reviews.length !== 35 || new Set(reviews.map((row) => row.number)).size !== 35) {
  throw new Error('The review must cover questions 1–35 exactly once.')
}

const master = JSON.parse(fs.readFileSync(masterPath, 'utf8'))
const curated = JSON.parse(fs.readFileSync(curatedPath, 'utf8'))
const exam = master.find((entry) => entry.id === examId)
if (!exam) throw new Error('Missing exam ' + examId + '.')
const questions = exam.parts.filter((part) => part.title.includes('Từ vựng')).flatMap((part) => part.questions || [])
if (questions.length !== 35) throw new Error('Expected 35 vocabulary questions, found ' + questions.length + '.')

for (const row of reviews) {
  const question = questions.find((entry) => Number(entry.number) === row.number)
  if (!question) throw new Error('Missing question ' + row.number + '.')
  if (Number(question.correctAnswer ?? question.answer) !== row.answer) {
    throw new Error('Question ' + row.number + ' answer key changed; review before applying.')
  }
  if (JSON.stringify(question.options.map(normalizeOption)) !== JSON.stringify(row.options.map(normalizeOption))) {
    throw new Error('Question ' + row.number + ' options changed; re-check the source before applying.')
  }
  question.explanation = row.explanation
  curated[question.id] = row.explanation
}

const report = {
  generatedAt: new Date().toISOString(),
  examId,
  section: 'Từ vựng',
  questionRange: '1–35',
  reviewedQuestionCount: reviews.length,
  reviewedChoiceCount: reviews.length * 4,
  answerKeysChanged: 0,
  sourceLimits: {
    originalQuestionPdfVisuallyInspectedThisPass: false,
    officialAnswerKeyConfirmed: false,
    questionTextSources: [
      'https://ns2.jlpt.jp/samples/sample2012/pdf/N3V.pdf',
      'https://www.chengzhushuo.com/jlpt_test_one.html?month=07%E6%9C%88&nLevel=n3&year=2011',
    ],
    secondaryAnswerKeySources: [
      'https://www.scribd.com/document/1058014920/2011%E5%B9%B47%E6%9C%88%E6%96%B0%E6%97%A5%E8%AF%AD%E8%83%BD%E5%8A%9B%E8%80%83%E8%AF%95N3',
    ],
    secondaryAnswerKeyConfirmed: true,
    method:
      'Reviewed all stored prompts and choices for the vocabulary section. Questions 31–35 were checked against the official JLPT N3 sample PDF, which prints the same five usage questions, and a separate transcription of the July 2011 exam. The stored key for questions 31–35 (4–1–4–1–1) matches a secondary solution scan, not an official JLPT answer key. Question 35 choice 3 uses the established phrase 正直な話 and is therefore documented as less suitable in the intended meaning, not categorically ungrammatical. The original July 2011 paper was not visually inspected this pass.',
  },
  linguisticCautions: [
    {
      question: 31,
      choice: 1,
      note: 'Literal falling onto a bed is imaginable; the choice is unsuitable for the intended meaning of going to bed early.',
    },
    {
      question: 33,
      choice: 3,
      note: '景色を見送る is interpretable when scenery recedes, but 景色を眺める is the usual collocation and choice 4 is clearer.',
    },
    {
      question: 35,
      choice: 3,
      note: '正直な話 is an established expression; choice 3 is not labeled ungrammatical, though 本当の話 is clearer for “a true story”.',
    },
  ],
  rows: reviews.map(({ number, answer, options, explanation }) => ({
    number,
    answer,
    options,
    explanation,
    allFourChoicesExplained: true,
    promptTranslated: true,
  })),
}

if (apply) {
  fs.writeFileSync(masterPath, JSON.stringify(master, null, 2) + '\n')
  fs.writeFileSync(curatedPath, await prettier.format(JSON.stringify(curated), { filepath: curatedPath }))
  fs.mkdirSync(path.dirname(reportPath), { recursive: true })
  fs.writeFileSync(reportPath, await prettier.format(JSON.stringify(report), { filepath: reportPath }))
}

console.log(
  JSON.stringify(
    {
      mode: apply ? 'applied' : 'dry-run',
      examId,
      questions: reviews.length,
      choiceNotes: reviews.length * 4,
      answerKeysChanged: 0,
      reportPath: apply ? reportPath : undefined,
    },
    null,
    2
  )
)
