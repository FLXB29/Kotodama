import fs from 'node:fs'
import path from 'node:path'
import prettier from 'prettier'

const masterPath = 'data/jlpt_n3_toan_master.json'
const curatedPath = 'data/jlpt_n3_explanations_curated.json'
const reportPath = 'reports/n3-quality-audit/vocabulary-2011-12-review.json'
const examId = 'toan-n3-201112-full'
const apply = process.argv.includes('--apply')
const formatJson = async (file, value) =>
  prettier.format(JSON.stringify(value), { ...(await prettier.resolveConfig(file)), filepath: file })

const reviews = [
  {
    number: 1,
    answer: 3,
    options: ['かきょ', 'かこう', 'かこ', 'かきょう'],
    target: '過去（かこ）là quá khứ; trong mẫu 「過去十年間」 nghĩa là “mười năm qua”.',
    translation: 'Nghe nói mùa hè năm nay nóng nhất trong mười năm qua.',
    notes: [
      'かきょ: sai cách đọc; 過去 đọc là かこ.',
      'かこう: sai trường âm và cách đọc của 過去.',
      'かこ: cách đọc đúng của 過去.',
      'かきょう: sai cách đọc; không có âm きょう trong từ này.',
    ],
    takeaway: '過去（かこ）十年間 là “mười năm qua”.',
  },
  {
    number: 2,
    answer: 2,
    options: ['とうつく', 'とうちゃく', 'どうつく', 'どうちゃく'],
    target: '到着（とうちゃく）nghĩa là đến nơi/việc đến.',
    translation: 'Tàu sẽ đến ga Tokyo trong năm phút nữa.',
    notes: [
      'とうつく: sai cách đọc của 到着; 着 ở đây đọc là ちゃく.',
      'とうちゃく: cách đọc đúng của 到着.',
      'どうつく: sai âm đầu và cách đọc của 着.',
      'どうちゃく: sai âm đầu; 到 đọc là とう.',
    ],
    takeaway: '到着する = đến nơi; 着 đọc là ちゃく trong từ này.',
  },
  {
    number: 3,
    answer: 2,
    options: ['うって', 'おって', 'わって', 'きって'],
    target: '折る（おる）nghĩa là bẻ/gãy; 折って là dạng て.',
    translation: 'Không được bẻ cành cây trong công viên.',
    notes: [
      'うって: có thể là 売って (bán) hoặc 打って (đánh); không phải cách đọc 折って.',
      'おって: cách đọc đúng của 折って.',
      'わって: 割って, chia/bổ; không phải cách đọc của 折って.',
      'きって: 切って, cắt; không phải cách đọc của 折って.',
    ],
    takeaway: '折る（おる）là bẻ/gấp; cành cây là 木の枝.',
  },
  {
    number: 4,
    answer: 3,
    options: ['じゅうほう', 'じょうほ', 'じょうほう', 'じゅうほ'],
    target: '情報（じょうほう）nghĩa là thông tin.',
    translation: 'Tôi đã kiểm tra thông tin mới nhất trên Internet.',
    notes: [
      'じゅうほう: sai trường âm ở 情; đọc là じょう.',
      'じょうほ: thiếu âm う cuối của 報（ほう）.',
      'じょうほう: cách đọc đúng của 情報.',
      'じゅうほ: sai trường âm ở 情 và thiếu う cuối.',
    ],
    takeaway: '情報（じょうほう）= thông tin; cả hai âm đều có trường âm.',
  },
  {
    number: 5,
    answer: 4,
    options: ['かかく', 'かがく', 'ねたん', 'ねだん'],
    target: '値段（ねだん）nghĩa là giá/giá tiền.',
    translation: 'Gần đây giá rau đang tăng.',
    notes: [
      'かかく: 価格（かかく）cũng là “giá”, nhưng không phải cách đọc của chữ 値段 trong câu.',
      'かがく: 科学（かがく）là khoa học; sai cách đọc.',
      'ねたん: sai âm đục; 段 đọc là だん.',
      'ねだん: cách đọc đúng của 値段.',
    ],
    takeaway: '値段（ねだん）là giá bán; 価格（かかく）cũng có nghĩa “giá” nhưng viết bằng chữ khác.',
  },
  {
    number: 6,
    answer: 1,
    options: ['ふかい', 'つよい', 'ひろい', 'おもい'],
    target: '深い（ふかい）nghĩa đen là sâu; 深い関心 là sự quan tâm sâu sắc.',
    translation: 'Anh ấy rất quan tâm đến văn hóa của đất nước đó.',
    notes: [
      'ふかい: cách đọc đúng của 深い.',
      'つよい: 強い, mạnh; 強い関心 cũng là một kết hợp tự nhiên, nhưng không phải cách đọc của 深い.',
      'ひろい: 広い, rộng; không phải cách đọc của 深い.',
      'おもい: 重い, nặng; không phải cách đọc của 深い.',
    ],
    takeaway: '深い関心 và 強い関心 đều diễn tả sự quan tâm lớn, nhưng câu hỏi yêu cầu cách đọc chữ gạch chân 深い.',
  },
  {
    number: 7,
    answer: 2,
    options: ['かしました', 'かえしました', 'もどしました', 'わたしました'],
    target: '返す（かえす）là trả lại; 返しました là dạng quá khứ lịch sự.',
    translation: 'Hôm qua tôi đã trả sách cho bạn.',
    notes: [
      'かしました: 貸しました, đã cho mượn; nghĩa ngược với trả lại.',
      'かえしました: cách đọc đúng của 返しました.',
      'もどしました: 戻しました, đã đưa về/đặt lại trạng thái hoặc vị trí cũ; không phải cách đọc của 返しました.',
      'わたしました: 渡しました, đã trao/chuyển cho; có thể dùng trong tình huống khác nhưng không phải cách đọc của 返しました.',
    ],
    takeaway: '貸す（かす）là cho mượn; 返す（かえす）là trả lại.',
  },
  {
    number: 8,
    answer: 4,
    options: ['しょめん', 'ひょめん', 'しょうめん', 'ひょうめん'],
    target: '表面（ひょうめん）nghĩa là bề mặt.',
    translation: 'Bề mặt Mặt Trăng gồ ghề.',
    notes: [
      'しょめん: sai âm đọc của 表 và thiếu trường âm.',
      'ひょめん: thiếu trường âm của 表（ひょう）.',
      'しょうめん: 正面（しょうめん）là mặt trước/chính diện; không phải cách đọc 表面.',
      'ひょうめん: cách đọc đúng của 表面.',
    ],
    takeaway: '表面（ひょうめん）là bề mặt; 正面（しょうめん）là mặt trước.',
  },
  {
    number: 9,
    answer: 3,
    options: ['祝在', '現存', '現在', '祝存'],
    target: '現在（げんざい）nghĩa là hiện tại/bây giờ.',
    translation: 'Ở Tokyo bây giờ là 3 giờ chiều.',
    notes: [
      '祝在: không phải cách viết của げんざい; 祝 không thay cho 現.',
      '現存（げんそん）nghĩa là hiện còn tồn tại; cách đọc và nghĩa không khớp câu.',
      '現在（げんざい）là cách viết đúng của げんざい, nghĩa là hiện tại.',
      '祝存: không phải từ viết đúng cho げんざい.',
    ],
    takeaway: '現在（げんざい）= hiện tại; 現存（げんそん）= vẫn còn tồn tại.',
  },
  {
    number: 10,
    answer: 4,
    options: ['ご事有', 'ご事由', 'ご自有', 'ご自由'],
    target: 'ご自由（ごじゆう）là cách nói lịch sự “tự do/tùy ý”; ご自由にお取りください là “xin cứ tự nhiên lấy”.',
    translation: 'Xin cứ tự nhiên lấy mẫu ở đây.',
    notes: [
      'ご事有: không tạo thành cách viết chuẩn của ごじゆう.',
      'ご事由: 事由（じゆう）có nghĩa là lý do/căn cứ, nhưng không viết lời mời này.',
      'ご自有: không phải cách viết chuẩn của 自由（じゆう）.',
      'ご自由: viết đúng 自由, phù hợp với mẫu lịch sự ご自由に.',
    ],
    takeaway: 'Mẫu cố định: ご自由にお取りください = xin cứ tự nhiên lấy.',
  },
  {
    number: 11,
    answer: 4,
    options: ['方立', '法立', '方律', '法律'],
    target: '法律（ほうりつ）nghĩa là luật pháp.',
    translation: 'Tôi đã học luật ở trường đại học.',
    notes: [
      '方立: không phải cách viết của 法律.',
      '法立: thiếu 律; không phải từ chỉ luật pháp trong câu.',
      '方律: 方 không phải chữ đúng của từ này.',
      '法律: cách viết đúng của ほうりつ, nghĩa là luật.',
    ],
    takeaway: '法律（ほうりつ）là luật pháp; ghi nhớ đúng cặp chữ 法＋律.',
  },
  {
    number: 12,
    answer: 1,
    options: ['観光', '観察', '歓光', '歓察'],
    target: '観光（かんこう）nghĩa là tham quan/du lịch.',
    translation: 'Một ngày nào đó tôi muốn thong thả tham quan Kyoto.',
    notes: [
      '観光: cách viết đúng của かんこう.',
      '観察（かんさつ）là quan sát; khác cả nghĩa lẫn âm cuối.',
      '歓光: 歓 mang nghĩa vui mừng, không phải chữ trong 観光.',
      '歓察: không phải cách viết của かんこう; 観察 mới là từ “quan sát” và đọc かんさつ.',
    ],
    takeaway: '観光（かんこう）là du lịch tham quan; 観察（かんさつ）là quan sát.',
  },
  {
    number: 13,
    answer: 2,
    options: ['巻', '券', '募', '巷'],
    target: '券（けん）là vé/phiếu; この券 là tấm vé này.',
    translation: 'Hãy nhớ đừng quên tấm vé này vào ngày diễn ra sự kiện.',
    notes: [
      '巻 thường đọc まき/かん, nghĩa là cuộn hoặc tập sách; không phải vé.',
      '券（けん）nghĩa là vé/phiếu và là chữ đúng.',
      '募（ぼ）liên quan đến tuyển mộ/quyên góp, như 募集; không đọc là けん.',
      '巷（ちまた）nghĩa là phố phường/dư luận; không đọc là けん.',
    ],
    takeaway: '乗車券・入場券 đều dùng 券 với nghĩa vé.',
  },
  {
    number: 14,
    answer: 3,
    options: ['流', '汗', '涙', '泣'],
    target: '涙（なみだ）nghĩa là nước mắt.',
    translation: 'Nước mắt mãi không ngừng khiến tôi khổ sở.',
    notes: [
      '流（りゅう／なが-れる）liên quan đến dòng chảy; không đọc là なみだ.',
      '汗（あせ）là mồ hôi, khác nghĩa.',
      '涙（なみだ）là cách viết đúng của “nước mắt”.',
      '泣（な-く）là khóc; thường cần okurigana 泣く và không phải danh từ なみだ.',
    ],
    takeaway: '涙（なみだ）là nước mắt; 泣く（なく）là khóc.',
  },
  {
    number: 15,
    answer: 2,
    options: ['うかる', 'かかる', 'あたる', 'はいる'],
    target: '病気にかかる nghĩa là mắc bệnh; trong câu 「この病気にかかると」 là “khi mắc bệnh này”.',
    translation: 'Khi mắc bệnh này, ban đầu sẽ bị sốt cao.',
    notes: [
      'うかる: 受かる, thi đỗ; thường đi với kỳ thi, như 試験に受かる.',
      'かかる: 罹る, mắc (bệnh); 病気にかかる là kết hợp đúng.',
      'あたる: 当たる, trúng/chạm hoặc đoán đúng; không dùng với 病気 theo nghĩa mắc bệnh.',
      'はいる: 入る, đi vào; 病気に入る không diễn tả mắc bệnh.',
    ],
    takeaway: 'Bệnh: 病気にかかる; thi đỗ: 試験に受かる.',
  },
  {
    number: 16,
    answer: 4,
    options: ['上品', '派手', '安全', '清潔'],
    target: '清潔（せいけつ）nghĩa là sạch sẽ/vệ sinh; được dọn kỹ nên phòng ở sạch.',
    translation: 'Phòng khách sạn này luôn được dọn dẹp cẩn thận nên rất sạch sẽ.',
    notes: [
      '上品（じょうひん）: thanh lịch/tinh tế; nói về phong cách, không phải độ sạch.',
      '派手（はで）: sặc sỡ/nổi bật; không phù hợp với việc phòng được dọn dẹp.',
      '安全（あんぜん）: an toàn; câu đang đánh giá sự sạch sẽ.',
      '清潔（せいけつ）: sạch sẽ; hợp với ngữ cảnh dọn phòng.',
    ],
    takeaway: '掃除されていて清潔だ = được dọn dẹp nên sạch sẽ.',
  },
  {
    number: 17,
    answer: 2,
    options: ['かさねて', 'あわせて', 'くわえて', 'ふやして'],
    target: '力を合わせる là thành ngữ/kết hợp quen thuộc, nghĩa là hợp sức hoặc chung sức.',
    translation: 'Trận đấu tới, mọi người hãy hợp sức và cùng cố gắng.',
    notes: [
      'かさねて: 重ねて, chồng/lặp lại; không kết hợp tự nhiên với 力 trong nghĩa hợp sức.',
      'あわせて: 合わせて, cách dùng đúng trong 力を合わせる.',
      'くわえて: 加えて, thêm vào; 加えて có thể dùng theo nghĩa bổ sung, nhưng không tạo thành cụm 力を合わせる.',
      'ふやして: 増やして, làm tăng số lượng; không nói 力を増やして頑張ろう theo ý cùng phối hợp của câu.',
    ],
    takeaway: '力を合わせる = hợp sức; 力を重ねる không phải cụm tự nhiên với nghĩa này.',
  },
  {
    number: 18,
    answer: 3,
    options: ['出席', '出勤', '出張', '出国'],
    target: '出張する（しゅっちょうする）nghĩa là đi công tác.',
    translation: 'Để dự cuộc họp, từ ngày mai tôi sẽ đi công tác ở Mỹ cùng trưởng phòng trong một tuần.',
    notes: [
      '出席（しゅっせき）: tham dự; thường là tham dự một cuộc họp/sự kiện.',
      '出勤（しゅっきん）: đi làm/đến nơi làm việc; không phải chuyến công tác.',
      '出張（しゅっちょう）: đi công tác; dùng đúng với chuyến đi Mỹ một tuần vì công việc.',
      '出国（しゅっこく）: xuất cảnh/rời khỏi đất nước; chỉ việc qua biên giới, không nêu mục đích công tác.',
    ],
    takeaway: '出張する = đi công tác; 出席する = tham dự.',
  },
  {
    number: 19,
    answer: 1,
    options: ['冗談', '文句', '感想', '希望'],
    target: '冗談（じょうだん）を言う là nói đùa/kể chuyện đùa.',
    translation: 'Anh Yamada là người thú vị, thường hay nói đùa.',
    notes: [
      '冗談（じょうだん）: lời nói đùa; kết hợp tự nhiên với を言う.',
      '文句（もんく）: lời phàn nàn; 文句を言う là than phiền, trái với sắc thái 面白い人 trong câu.',
      '感想（かんそう）: cảm nghĩ/nhận xét; 感想を言う được, nhưng không diễn tả việc thường nói đùa.',
      '希望（きぼう）: hy vọng/mong muốn; 希望を言う không phù hợp với “người thú vị hay nói đùa”.',
    ],
    takeaway: '冗談を言う = nói đùa; 文句を言う = phàn nàn.',
  },
  {
    number: 20,
    answer: 2,
    options: ['せっかく', 'さっそく', 'もうすぐ', 'なるべく'],
    target: 'さっそく nghĩa là ngay sau đó/lập tức, thường dùng khi bắt tay làm việc vừa nghe hoặc vừa quyết định.',
    translation: 'Bạn chỉ cho quán pizza ngon nên tôi liền thử đi ăn.',
    notes: [
      'せっかく: nhân dịp đã mất công/có cơ hội; không diễn tả hành động đi ngay sau lời giới thiệu.',
      'さっそく: ngay lập tức; khớp với việc được chỉ quán rồi đi thử ăn.',
      'もうすぐ: chẳng bao lâu nữa; nói về việc sắp xảy ra, không phải hành động làm ngay.',
      'なるべく: cố hết sức/càng… càng tốt; thường bổ nghĩa mức độ, không hợp với ý “liền đi”.',
    ],
    takeaway: 'Nghe gợi ý rồi làm ngay: さっそく試す／行ってみる.',
  },
  {
    number: 21,
    answer: 2,
    options: ['コース', 'カーブ', 'スピード', 'ブレーキ'],
    target: 'カーブ là khúc cua/đoạn cong của con đường.',
    translation: 'Con đường này có nhiều khúc cua nên hãy lái xe cẩn thận.',
    notes: [
      'コース: lộ trình/đường chạy hoặc khóa học; không phải khúc cua trên đường.',
      'カーブ: khúc cua; 「カーブが多い道」 là đường có nhiều đoạn cong.',
      'スピード: tốc độ; đường có nhiều tốc độ không có nghĩa phù hợp.',
      'ブレーキ: phanh; đường không “có nhiều phanh”.',
    ],
    takeaway: 'カーブが多い = có nhiều khúc cua; vì vậy cần chú ý khi lái xe.',
  },
  {
    number: 22,
    answer: 4,
    options: ['貯金', '会計', '借金', '両替'],
    target: '両替（りょうがえ）する nghĩa là đổi tiền; ドルを円に両替する là đổi đô la sang yên.',
    translation: 'Tôi đã đổi đô la sang yên ở ngân hàng.',
    notes: [
      '貯金（ちょきん）: tiền tiết kiệm/việc gửi tiết kiệm; không phải đổi ngoại tệ.',
      '会計（かいけい）: kế toán hoặc thanh toán hóa đơn; không phải đổi tiền.',
      '借金（しゃっきん）: khoản nợ/việc vay tiền; trái nghĩa với giao dịch đổi tiền.',
      '両替（りょうがえ）: đổi tiền; khớp cấu trúc AをBに両替する.',
    ],
    takeaway: 'AをBに両替する = đổi A sang B.',
  },
  {
    number: 23,
    answer: 1,
    options: ['前後', '上下', '大小', '多少'],
    target: '前後（ぜんご）sau một con số có nghĩa là xấp xỉ/khoảng con số đó.',
    translation: 'Nghe nói mỗi ngày mặt hàng này bán được khoảng 1.000 chiếc.',
    notes: [
      '前後（ぜんご）: trước sau; sau số lượng biểu thị mức xấp xỉ, như 1000個前後.',
      '上下（じょうげ）: trên dưới/tăng giảm; không dùng để nói khoảng 1.000 chiếc trong câu này.',
      '大小（だいしょう）: lớn nhỏ/kích cỡ; không diễn tả số lượng xấp xỉ.',
      '多少（たしょう）: nhiều ít/một ít; không đứng sau số lượng với nghĩa khoảng như 前後.',
    ],
    takeaway: 'Số＋前後 = khoảng/xấp xỉ số đó.',
  },
  {
    number: 24,
    answer: 2,
    options: ['効果', '影響', '制限', '結果'],
    target: '影響（えいきょう）là ảnh hưởng/tác động; 台風の影響で là do ảnh hưởng của bão.',
    translation: 'Chuyến bay bị hoãn khởi hành do ảnh hưởng của bão.',
    notes: [
      '効果（こうか）: hiệu quả/tác dụng; thường là kết quả có ích do một biện pháp.',
      '影響（えいきょう）: ảnh hưởng; dùng tự nhiên trong 「台風の影響で」.',
      '制限（せいげん）: sự hạn chế/giới hạn; không phải nguyên nhân thời tiết tác động.',
      '結果（けっか）: kết quả; 台風の結果で không phải cách nói tự nhiên ở đây.',
    ],
    takeaway: 'Nêu tác nhân gây ảnh hưởng: Nの影響で….',
  },
  {
    number: 25,
    answer: 1,
    options: ['しっかり', 'はっきり', 'うっかり', 'ぐっすり'],
    target: 'しっかり nghĩa là chắc chắn/chặt chẽ; ふたをしっかりしめる là đóng nắp thật chặt.',
    translation: 'Hãy đóng nắp thật chặt để đồ bên trong không bị đổ/tràn ra.',
    notes: [
      'しっかり: chắc chắn/kỹ; bổ nghĩa đúng cho hành động đóng nắp.',
      'はっきり: rõ ràng; thường nói về lời nói, hình dạng hoặc nhận thức, không phải độ chặt của nắp.',
      'うっかり: bất cẩn/vô ý; không mô tả cách đóng nắp cần thiết.',
      'ぐっすり: ngủ say; chỉ dùng tự nhiên với 睡眠する／眠る.',
    ],
    takeaway: 'Vật cần giữ kín hoặc chắc: しっかりしめる.',
  },
  {
    number: 26,
    answer: 4,
    options: ['すきなところ', 'いいところ', 'きらいなところ', 'わるいところ'],
    target: '欠点（けってん）là khuyết điểm/điểm yếu; gần nghĩa nhất là わるいところ.',
    translation: 'Đó chính là khuyết điểm của cuốn từ điển này.',
    notes: [
      'すきなところ: chỗ/điểm mình thích; sắc thái tích cực, trái với 欠点.',
      'いいところ: điểm tốt/ưu điểm; ngược nghĩa.',
      'きらいなところ: điểm không thích; nói cảm nhận không thích, không đồng nghĩa trực tiếp với khuyết điểm.',
      'わるいところ: điểm xấu/điểm yếu; gần nghĩa nhất với 欠点.',
    ],
    takeaway: '欠点 = khuyết điểm; 対義語 là 長所（ちょうしょ）, ưu điểm.',
  },
  {
    number: 27,
    answer: 4,
    options: ['前の前の年', '次の次の年', '前の年', '次の年'],
    target: '翌年（よくねん／よくとし）là năm kế tiếp/năm sau.',
    translation: 'Anh ấy đi du học vào năm sau khi tốt nghiệp đại học.',
    notes: [
      '前の前の年: năm trước năm trước nữa; lùi hai năm.',
      '次の次の年: năm kế tiếp nữa; tiến hai năm.',
      '前の年: năm trước; lùi một năm so với mốc.',
      '次の年: năm kế tiếp; đồng nghĩa gần nhất với 翌年.',
    ],
    takeaway: '翌年 = năm ngay sau mốc đang nói; 前年（ぜんねん）= năm trước.',
  },
  {
    number: 28,
    answer: 2,
    options: ['準備', '予定', '場所', '資料'],
    target: 'スケジュール là lịch trình/thời gian dự kiến; trong ngữ cảnh này gần với 予定（よてい）.',
    translation: 'Tôi nhận được liên lạc về lịch trình cuộc họp tuần tới.',
    notes: [
      '準備（じゅんび）: sự chuẩn bị; là việc làm trước sự kiện, không phải lịch.',
      '予定（よてい）: kế hoạch/lịch dự kiến; gần nghĩa với スケジュール trong câu.',
      '場所（ばしょ）: địa điểm; trả lời “ở đâu”, không phải “khi nào/theo lịch nào”.',
      '資料（しりょう）: tài liệu; không phải lịch trình cuộc họp.',
    ],
    takeaway: 'スケジュールは予定表・日程を指し、予定が最も近い語です。',
  },
  {
    number: 29,
    answer: 3,
    options: ['だいじな', 'こまかい', 'かんたんな', 'あたらしい'],
    target: 'らくな仕事 là công việc nhẹ/không vất vả; lựa chọn gần nghĩa nhất ở đây là かんたんな仕事 (công việc dễ).',
    translation: 'Tôi nhờ anh ấy làm một công việc nhẹ/dễ.',
    notes: [
      'だいじな: 大事な, quan trọng; không nói công việc nhẹ/dễ.',
      'こまかい: 細かい, chi tiết/nhỏ lẻ; không đồng nghĩa với らく.',
      'かんたんな: 簡単な, đơn giản/dễ; là lựa chọn gần nghĩa nhất theo bài.',
      'あたらしい: 新しい, mới; không mô tả độ nhẹ hay dễ của công việc.',
    ],
    takeaway: 'らく có thể là nhẹ nhàng/đỡ vất vả; trong các lựa chọn này かんたん là từ gần nhất.',
  },
  {
    number: 30,
    answer: 2,
    options: ['ずっと前に', '少し前に', '何回か', '何回も'],
    target: 'さっき nghĩa là vừa nãy/mới đây; gần nhất với 少し前に.',
    translation: 'Anh Tanaka vừa gọi điện lúc nãy đấy.',
    notes: [
      'ずっと前に: từ rất lâu trước đây; xa hơn nhiều so với さっき.',
      '少し前に: cách đây một lúc ngắn; gần nghĩa nhất với さっき.',
      '何回か: một vài lần; nói số lần, không nói thời điểm.',
      '何回も: nhiều lần; nói tần suất, không nói thời điểm.',
    ],
    takeaway: 'さっき／少し前に đều chỉ thời điểm gần trong quá khứ.',
  },
  {
    number: 31,
    answer: 4,
    options: [
      '半年前にタバコを断ってから、体の調子がよくなりました',
      '彼は働いた会社を断ってお店を始めました',
      'どんなに大変でも、医師になるという夢は断らないでください',
      'ほかに約束があったので、パーティーの誘いを断りました',
    ],
    target: '断る（ことわる）là từ chối lời mời, yêu cầu hoặc đề nghị; 誘いを断る là từ chối lời mời.',
    translation: 'Vì đã có hẹn khác nên tôi từ chối lời mời dự tiệc.',
    notes: [
      'Ở đây muốn nói bỏ thuốc thì dùng タバコをやめる／断つ（たつ）; 断る（ことわる）không mang nghĩa bỏ hút thuốc.',
      'Muốn nói nghỉ khỏi công ty đã làm thì dùng 会社を辞める; 会社を断る không diễn đạt nghỉ việc.',
      'Với ước mơ, cách tự nhiên là 夢をあきらめないでください (đừng từ bỏ ước mơ), không dùng 夢を断る.',
      '誘いを断る là kết hợp đúng: từ chối lời mời vì đã có hẹn khác.',
    ],
    takeaway:
      '断る = từ chối; phân biệt 断つ（たつ, dứt/bỏ một thói quen）, 辞める（nghỉ việc） và あきらめる（từ bỏ ước mơ）.',
  },
  {
    number: 32,
    answer: 2,
    options: [
      '朝の電車はこんでいたが、帰りはゆるかった',
      'ズボンがゆるいので、ベルトをきつくしめた',
      '今回の旅行は荷物が少ないので、スーツケースがまだゆるい',
      'この家は、夫婦二人で住むなら十分ゆるいです',
    ],
    target: 'ゆるい（緩い）là lỏng hoặc rộng; quần rộng nên phải siết dây lưng.',
    translation: 'Quần rộng nên tôi đã siết chặt thắt lưng.',
    notes: [
      'Tàu lúc về vắng thì nói 電車が空いていた; ゆるい không có nghĩa “ít đông”.',
      'ズボンがゆるい (quần rộng/lỏng) kết hợp tự nhiên và giải thích vì sao phải siết dây lưng.',
      'Nếu va-li còn nhiều chỗ thì nói スーツケースに余裕がある／まだ空いている; va-li không được mô tả là ゆるい.',
      'Nói căn nhà đủ rộng cho hai người thì dùng 十分広い; ゆるい không có nghĩa rộng rãi về diện tích.',
    ],
    takeaway: 'ゆるい dùng cho độ lỏng/rộng của quần áo, dây, nút; không thay cho 空いている hay 広い.',
  },
  {
    number: 33,
    answer: 1,
    options: [
      '短気な性格の人は、この仕事にはあまり向かない',
      '雨のせいで、今日はグランドの性格がよくない',
      'この車の性格は電気で走る点だ',
      'あの人はその日の性格で言うことが変わる',
    ],
    target: '性格（せいかく）là tính cách của người; 短気な性格 là tính nóng nảy.',
    translation: 'Người có tính nóng nảy không hợp lắm với công việc này.',
    notes: [
      '短気な性格の人 là người có tính nóng nảy; 性格 được dùng đúng cho đặc điểm tâm tính của người.',
      'Sau mưa, nói tình trạng mặt sân xấu thì dùng グランドの状態／コンディション; sân không có “tính cách”.',
      'Đặc tính kỹ thuật của xe nên nói 性能 hoặc 特徴; 性格 thường chỉ tính cách, nhất là của người.',
      'Ý định là lời nói thay đổi theo tâm trạng từng ngày, nên dùng その日の気分; 性格 là tính cách tương đối ổn định.',
    ],
    takeaway: '性格 = tính cách; 性能／特徴 = đặc tính của vật; 気分 = tâm trạng.',
  },
  {
    number: 34,
    answer: 1,
    options: [
      'わたしの大学では、毎年大勢の留学生を受け入れています',
      '入口でパンフレットを受け入れてから席にお座りください',
      'チケットのお申し込みは電話で受け入れています',
      '最新の技術を受け入れた製品について説明してもらいました',
    ],
    target: '受け入れる（うけいれる）là tiếp nhận người/đề nghị/hoàn cảnh; trường tiếp nhận du học sinh.',
    translation: 'Ở trường đại học của tôi, mỗi năm tiếp nhận đông du học sinh.',
    notes: [
      'Đại học tiếp nhận sinh viên quốc tế: 留学生を受け入れる là cách dùng đúng.',
      'Khi nhận tờ giới thiệu được phát ở cửa, dùng パンフレットを受け取る (nhận lấy), không dùng 受け入れる.',
      'Đơn đặt vé được nhận qua điện thoại thì dùng 申し込みを受け付ける; 受け入れる không phải động từ tự nhiên cho việc tiếp nhận đơn.',
      'Sản phẩm áp dụng công nghệ mới nên nói 技術を取り入れた／採用した製品; không dùng 受け入れた ở đây.',
    ],
    takeaway:
      '受け入れる = tiếp nhận người/chấp nhận điều gì; 受け取る = nhận vật; 受け付ける = nhận đơn; 取り入れる = áp dụng.',
  },
  {
    number: 35,
    answer: 4,
    options: [
      'もう１０分以上待っているのに、バスがそろそろ来ない',
      '最近洗濯機の調子がよくなかったが、昨日そろそろ壊れた',
      '以前から探していた本が、そろそろ見つかった',
      '仕事が残っているけど、そろそろ１２時なので昼休みにしよう',
    ],
    target: 'そろそろ báo hiệu một thời điểm thích hợp đã đến hoặc việc gì đó sắp xảy ra.',
    translation: 'Công việc vẫn còn, nhưng sắp 12 giờ rồi nên nghỉ trưa thôi.',
    notes: [
      'Sau khi chờ xe, nói 「まだ来ない」 (vẫn chưa đến) hoặc 「そろそろ来てもいいころだ」 (đến lúc xe sắp tới rồi); 「そろそろ来ない」 không hợp ý câu.',
      'Với sự cố đã xảy ra hôm qua, dùng とうとう壊れた; そろそろ thường dự đoán tương lai, như そろそろ壊れそうだ.',
      'Sau khi tìm lâu và đã tìm thấy, nói やっと見つかった; そろそろ見つかった không diễn tả kết quả đã đạt được.',
      'そろそろ12時なので là “vì sắp/đã gần 12 giờ”; đây là cách dùng tự nhiên để đề nghị nghỉ trưa.',
    ],
    takeaway:
      'そろそろ = sắp đến lúc; やっと = cuối cùng cũng đạt được sau chờ đợi; とうとう = rốt cuộc sự việc đã xảy ra.',
  },
]

const normalizeOption = (value) =>
  String(value || '')
    .normalize('NFKC')
    .replace(/^\s*[1-4][.)．、]?\s*/u, '')
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
  const explanation = [
    `Đáp án ${row.answer} — ${row.target}`,
    `Dịch: “${row.translation}”`,
    ...row.notes.map((note, index) => `${index + 1}. ${note}`),
    `Ghi nhớ: ${row.takeaway}`,
  ].join('\n')
  row.explanation = explanation
  question.explanation = explanation
  curated[question.id] = explanation
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
    originalQuestionSourceCompared: true,
    originalQuestionSourceUrl: 'https://www.scribd.com/document/1022846440/2-N3-12-2011',
    officialAnswerKeyConfirmed: false,
    method:
      'Compared the Japanese prompts and choices against an accessible copy of the December 2011 N3 paper, then translated all prompts and reviewed every answer and distractor in context. Corrected the missing choice number in question 32 and transcription errors in question 33. Existing answer keys were preserved; the paper copy is not an official answer-key source, so answer keys are explicitly not marked as independently confirmed.',
  },
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
  fs.writeFileSync(masterPath, await formatJson(masterPath, master))
  fs.writeFileSync(curatedPath, await formatJson(curatedPath, curated))
  fs.mkdirSync(path.dirname(reportPath), { recursive: true })
  fs.writeFileSync(reportPath, await formatJson(reportPath, report))
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
