import fs from 'node:fs'
import path from 'node:path'
import prettier from 'prettier'

const masterPath = 'data/jlpt_n3_toan_master.json'
const curatedPath = 'data/jlpt_n3_explanations_curated.json'
const reportPath = 'reports/n3-quality-audit/vocabulary-2010-07-review.json'
const examId = 'toan-n3-201007-full'
const apply = process.argv.includes('--apply')
const formatJson = async (file, value) =>
  prettier.format(JSON.stringify(value), { ...(await prettier.resolveConfig(file)), filepath: file })

const reviews = [
  {
    number: 1,
    answer: 3,
    options: ['つっんで', 'つづんで', 'つつんで', 'つうづんで'],
    target: '包む（つつむ）là gói/bọc; 包んであった diễn tả món quà đã được gói sẵn.',
    translation: 'Món quà đã được gói bằng giấy đẹp.',
    notes: [
      'つっんで: sai cách viết âm; động từ là 包む（つつむ）.',
      'つづんで: âm đục づ không có trong cách đọc này.',
      'つつんで: cách đọc đúng của 包んで.',
      'つうづんで: thêm trường âm và âm đục không đúng với 包む.',
    ],
    takeaway: '包む（つつむ）= gói, bọc; dạng て là 包んで.',
  },
  {
    number: 2,
    answer: 4,
    options: ['どおくい', 'とおくい', 'どくい', 'とくい'],
    target: '得意（とくい）là giỏi về một việc hoặc là sở trường.',
    translation: 'Anh ấy giỏi nhảy.',
    notes: [
      'どおくい: sai âm đầu và thêm trường âm.',
      'とおくい: có trường âm thừa; 得意 đọc là とくい.',
      'どくい: âm đầu bị đục thành ど.',
      'とくい: cách đọc đúng của 得意.',
    ],
    takeaway: '得意だ = giỏi; ダンスが得意 = giỏi nhảy.',
  },
  {
    number: 3,
    answer: 1,
    options: ['はっけん', 'はけん', 'はつけん', 'ぼつけん'],
    target: '発見（はっけん）là sự phát hiện; 発見された là đã được phát hiện.',
    translation: 'Một ngôi sao mới đã được phát hiện.',
    notes: [
      'はっけん: cách đọc đúng của 発見.',
      'はけん: thiếu âm ngắt nhỏ っ.',
      'はつけん: không có âm ngắt nhỏ; đọc sai 発見.',
      'ぼつけん: sai âm đầu; 発 đọc はっ trong từ này.',
    ],
    takeaway: '発見する = phát hiện; 発見される = được phát hiện.',
  },
  {
    number: 4,
    answer: 4,
    options: ['しめして', 'ふやして', 'うごかして', 'あらわして'],
    target: '表す（あらわす）là biểu thị/thể hiện; 表して là dạng て.',
    translation: 'Biểu đồ này thể hiện sự thay đổi dân số.',
    notes: [
      'しめして: 示して（しめして）là chỉ ra, viết bằng 示す; không phải cách đọc của 表す.',
      'ふやして: 増やして（ふやして）là làm tăng; khác nghĩa và chữ.',
      'うごかして: 動かして（うごかして）là làm chuyển động; khác chữ và nghĩa.',
      'あらわして: cách đọc đúng của 表して trong câu này.',
    ],
    takeaway: '表す（あらわす）= biểu thị; 示す（しめす）= chỉ ra.',
  },
  {
    number: 5,
    answer: 1,
    options: ['けん', 'あん', 'ほう', 'よう'],
    target: '件（けん）là việc/vấn đề; 件で電話があった là có điện thoại về việc đó.',
    translation: 'Anh/chị Yamada gọi điện về cuộc họp tuần sau.',
    notes: [
      'けん: cách đọc đúng của 件.',
      'あん: không phải cách đọc của 件.',
      'ほう: không phải cách đọc của 件.',
      'よう: không phải cách đọc của 件.',
    ],
    takeaway: '件（けん）= việc/vụ; ～の件で連絡する = liên lạc về việc…',
  },
  {
    number: 6,
    answer: 2,
    options: ['つうがく', 'つうきん', 'つうやく', 'つうしん'],
    target: '通勤（つうきん）là việc đi làm hằng ngày.',
    translation: 'Việc đi làm mất rất nhiều thời gian.',
    notes: [
      'つうがく: 通学, đi học hằng ngày.',
      'つうきん: cách đọc đúng của 通勤.',
      'つうやく: 通訳, phiên dịch.',
      'つうしん: 通信, liên lạc/truyền thông.',
    ],
    takeaway: '通勤 = đi làm; 通学 = đi học; 通訳 = phiên dịch.',
  },
  {
    number: 7,
    answer: 2,
    options: ['かい', 'いわ', 'すな', 'なみ'],
    target: '岩（いわ）là tảng đá/đá lớn.',
    translation: 'Bờ biển này có nhiều đá.',
    notes: [
      'かい: 海（うみ／かい）là biển; không phải cách đọc của 岩.',
      'いわ: cách đọc đúng của 岩.',
      'すな: 砂, cát.',
      'なみ: 波, sóng.',
    ],
    takeaway: '岩（いわ）= đá tảng; 砂（すな）= cát; 波（なみ）= sóng.',
  },
  {
    number: 8,
    answer: 3,
    options: ['どうりょく', 'とうりょく', 'どりょく', 'とりょく'],
    target: '努力（どりょく）là sự nỗ lực/cố gắng.',
    translation: 'Tôi nghĩ nỗ lực là điều quan trọng.',
    notes: [
      'どうりょく: sai âm đục và trường âm; 努 đọc là ど.',
      'とうりょく: sai trường âm và âm đục.',
      'どりょく: cách đọc đúng của 努力.',
      'とりょく: 努 không đọc là と trong từ này.',
    ],
    takeaway: '努力する = nỗ lực, cố gắng.',
  },
  {
    number: 9,
    answer: 4,
    options: ['盛情', '威常', '正情', '正常'],
    target: '正常（せいじょう）là bình thường/hoạt động đúng; câu hỏi cách viết せいじょう.',
    translation: 'Tôi đã kiểm tra xem máy móc có hoạt động bình thường hay không.',
    notes: [
      '盛情: không phải cách viết chuẩn của từ “bình thường” được hỏi.',
      '威常: hai chữ này không tạo thành từ thông dụng chỉ trạng thái bình thường.',
      '正情: 情 có thể liên quan đến cảm xúc/tình hình, nhưng đây không phải cách viết của “bình thường”.',
      '正常: cách viết đúng của せいじょう với nghĩa bình thường.',
    ],
    takeaway: '正常（せいじょう）= bình thường; 異常（いじょう）= bất thường.',
  },
  {
    number: 10,
    answer: 3,
    options: ['意識', '園圧', '血液', '血圧'],
    target: '血液（けつえき）là máu; 血液検査 là xét nghiệm máu.',
    translation: 'Tôi đã làm xét nghiệm máu trong buổi khám sức khỏe.',
    notes: [
      '意識（いしき）= ý thức; không phải máu.',
      '園圧: không phải cách viết của từ chỉ máu trong cụm xét nghiệm này.',
      '血液（けつえき）= máu; ghép với 検査 thành 血液検査.',
      '血圧（けつあつ）= huyết áp; khác với máu (血液).',
    ],
    takeaway: '血液検査 = xét nghiệm máu; 血圧 = huyết áp.',
  },
  {
    number: 11,
    answer: 2,
    options: ['送って', '追って', '押して', '折って'],
    target: '追う（おう）là đuổi/theo sau; 追って là dạng て.',
    translation: 'Người mẹ đang chạy theo phía sau đứa trẻ.',
    notes: [
      '送って（おくって）= gửi/đưa tiễn; không hợp với việc chạy theo sau đứa trẻ.',
      '追って（おって）= đuổi theo; đúng với 後ろを追って走る.',
      '押して（おして）= đẩy/ấn; không phải chạy theo.',
      '折って（おって）= bẻ/gấp; tuy đọc giống おって nhưng khác chữ và nghĩa.',
    ],
    takeaway: '追う = đuổi theo; 送る = gửi/tiễn; 押す = đẩy; 折る = bẻ/gấp.',
  },
  {
    number: 12,
    answer: 3,
    options: ['移りる', '移る', '降りる', '降る'],
    target: '降りる（おりる）là xuống khỏi phương tiện; dạng này dùng cho xuống tàu.',
    translation: 'Tôi lỡ để quên ô khi xuống tàu.',
    notes: [
      '移りる: không phải dạng động từ chuẩn; 移る（うつる）mới là chuyển/dời.',
      '移る（うつる）= chuyển sang/di chuyển; sai cách đọc và nghĩa trong ngữ cảnh xuống tàu.',
      '降りる（おりる）= xuống xe/tàu; đúng với 電車を降りる.',
      '降る（ふる）= mưa/tuyết rơi; không dùng để nói hành khách xuống tàu.',
    ],
    takeaway: '電車を降りる = xuống tàu; 雨が降る = trời mưa; 移る = chuyển/dời.',
  },
  {
    number: 13,
    answer: 3,
    options: ['背中', '背後', '身長', '身張'],
    target: '身長（しんちょう）là chiều cao cơ thể.',
    translation: 'Từ khi vào đại học, chiều cao của tôi không thay đổi.',
    notes: [
      '背中（せなか）= lưng.',
      '背後（はいご）= phía sau/lưng chừng phía sau.',
      '身長（しんちょう）= chiều cao; đúng với điều được nói là không thay đổi.',
      '身張 không phải từ chuẩn chỉ chiều cao; chữ đúng là 身長.',
    ],
    takeaway: '身長 = chiều cao; 背中 = lưng; 背後 = phía sau.',
  },
  {
    number: 14,
    answer: 1,
    options: ['物語', '物化', '物記', '物源'],
    target: '物語（ものがたり）là câu chuyện/truyện kể.',
    translation: 'Câu chuyện đó thì ai cũng biết.',
    notes: [
      '物語（ものがたり）= câu chuyện; cách viết và cách đọc đúng.',
      '物化 không phải cách viết của ものがたり.',
      '物記 không phải cách viết của ものがたり.',
      '物源 không phải cách viết của ものがたり.',
    ],
    takeaway: '物語（ものがたり）= câu chuyện, truyện kể.',
  },
  {
    number: 15,
    answer: 1,
    options: ['カタログ', 'オーダー', 'レシート', 'セール'],
    target: 'カタログ là catalogue giới thiệu sản phẩm/mẫu xe.',
    translation: 'Để mua xe mới, tôi đã lấy catalogue ở cửa hàng.',
    notes: [
      'カタログ = catalogue; cửa hàng phát tài liệu này để khách xem mẫu xe.',
      'オーダー = đơn đặt hàng/yêu cầu đặt món; không phải tài liệu giới thiệu xe.',
      'レシート = hóa đơn/biên lai sau khi mua hàng.',
      'セール = đợt giảm giá/khuyến mãi.',
    ],
    takeaway: 'カタログを見る = xem catalogue; レシートをもらう = nhận hóa đơn.',
  },
  {
    number: 16,
    answer: 4,
    options: ['関心', '気分', '考え', '感じ'],
    target: '感じ（かんじ）là cảm giác/ấn tượng; 上品な感じがする nghĩa là tạo cảm giác thanh lịch.',
    translation: 'Trang phục của anh/chị Tanaka tạo cảm giác rất thanh lịch.',
    notes: [
      '関心（かんしん）= sự quan tâm; 関心がある là quan tâm đến điều gì.',
      '気分（きぶん）= tâm trạng; 気分がする không phù hợp với cấu trúc này.',
      '考え（かんがえ）= suy nghĩ/ý kiến; 上品な考えがする không tự nhiên ở đây.',
      '感じ（かんじ）= cảm giác/ấn tượng; 上品な感じがする là kết hợp tự nhiên.',
    ],
    takeaway: '～感じがする = có cảm giác/ấn tượng rằng…; 上品 = thanh lịch, tao nhã.',
  },
  {
    number: 17,
    answer: 4,
    options: ['価格', '代金', '会費', '家賃'],
    target: '家賃（やちん）là tiền thuê nhà.',
    translation: 'Để thuê căn hộ quanh đây, cần 50.000 yên tiền thuê mỗi tháng.',
    notes: [
      '価格（かかく）= giá niêm yết/giá trị của hàng hóa.',
      '代金（だいきん）= khoản tiền phải trả để mua hàng/dịch vụ.',
      '会費（かいひ）= hội phí/phí thành viên.',
      '家賃（やちん）= tiền thuê nhà; phù hợp với căn hộ và khoản trả hằng tháng.',
    ],
    takeaway: '家賃 = tiền thuê nhà; 価格 = giá; 代金 = tiền thanh toán; 会費 = hội phí.',
  },
  {
    number: 18,
    answer: 3,
    options: ['ためって', 'とじて', 'しまって', 'たたんで'],
    target: 'しまう trong 辞書をしまう là cất từ điển vào chỗ để, ở đây là trong cặp.',
    translation: 'Vì chúng ta sẽ bắt đầu bài kiểm tra, hãy cất từ điển vào trong cặp.',
    notes: [
      'ためって: không tạo thành cách nói tự nhiên với 辞書を…ください.',
      'とじて（閉じて）= đóng lại; thường dùng với sách/cửa, không có nghĩa cất vào cặp.',
      'しまって（仕舞って）= cất đi; đúng với yêu cầu cất từ điển trước khi kiểm tra.',
      'たたんで（畳んで）= gấp lại; từ điển không được gấp để cất.',
    ],
    takeaway: '物をしまう = cất đồ; 本を閉じる = đóng sách; 服を畳む = gấp quần áo.',
  },
  {
    number: 19,
    answer: 2,
    options: ['最大', '最新', '最中', '最多'],
    target: '最新（さいしん）のファッション là thời trang mới nhất.',
    translation: 'Tôi muốn biết xu hướng thời trang mới nhất của giới trẻ Nhật Bản.',
    notes: [
      '最大（さいだい）= lớn nhất.',
      '最新（さいしん）= mới nhất; kết hợp đúng với ファッション.',
      '最中（さいちゅう）= đang giữa/trong lúc một việc diễn ra.',
      '最多（さいた）= nhiều nhất về số lượng.',
    ],
    takeaway: '最新 = mới nhất; 最大 = lớn nhất; 最多 = nhiều nhất; 最中 = đang giữa lúc.',
  },
  {
    number: 20,
    answer: 1,
    options: ['しばって', 'かこんで', 'しめて', 'あんで'],
    target: 'しばる（縛る）là buộc bằng dây; ひもでしばって là buộc bằng dây rồi…',
    translation: 'Tôi xếp những tờ báo và tạp chí không cần nữa, buộc chúng bằng dây rồi vứt đi.',
    notes: [
      'しばって（縛って）= buộc/chằng bằng dây; đúng với ひもで.',
      'かこんで（囲んで）= bao quanh; không có nghĩa bó báo lại.',
      'しめて（締めて）= siết/thắt chặt; thường là dây nịt hoặc nút thắt, nhưng không diễn đạt việc bó báo bằng dây tự nhiên như 縛る.',
      'あんで（編んで）= đan; không phải buộc giấy báo.',
    ],
    takeaway: 'ひもで縛る = buộc bằng dây; 囲む = bao quanh; 編む = đan.',
  },
  {
    number: 21,
    answer: 3,
    options: ['チェックアウト', 'カット', 'キャンセル', 'オーバー'],
    target: 'キャンセルする là hủy; 予約をキャンセルする là hủy đặt chỗ.',
    translation: 'Vì đột nhiên có việc nên tôi đã hủy đặt chỗ ở nhà hàng.',
    notes: [
      'チェックアウト = làm thủ tục trả phòng.',
      'カット = cắt; không mang nghĩa hủy đặt bàn.',
      'キャンセル = hủy; kết hợp đúng với 予約.',
      'オーバー = vượt quá/áo khoác ngoài tùy ngữ cảnh; không có nghĩa hủy.',
    ],
    takeaway: '予約をキャンセルする = hủy đặt chỗ; 予約を取る = đặt chỗ.',
  },
  {
    number: 22,
    answer: 2,
    options: ['沿い', '向き', '込み', '建て'],
    target: '東向き（ひがしむき）là quay/hướng về phía đông.',
    translation: 'Phòng của tôi hướng đông.',
    notes: [
      '沿い（ぞい）= dọc theo; ví dụ 川沿い, dọc bờ sông.',
      '向き（むき）= hướng về; 東向き là hướng đông.',
      '込み（こみ）= đã bao gồm; ví dụ 税込み, đã gồm thuế.',
      '建て（だて）= kiểu/kết cấu xây dựng hoặc số tầng; ví dụ 2階建て.',
    ],
    takeaway: '東向き = hướng đông; 川沿い = dọc sông; 税込み = đã gồm thuế.',
  },
  {
    number: 23,
    answer: 4,
    options: ['歓迎', '応援', '期待', '感動'],
    target: '感動（かんどう）là xúc động sâu sắc; 感動して泣く là xúc động đến bật khóc.',
    translation: 'Hôm qua khi xem phim, tôi đã xúc động đến bật khóc.',
    notes: [
      '歓迎（かんげい）= chào đón/hoan nghênh.',
      '応援（おうえん）= cổ vũ, ủng hộ.',
      '期待（きたい）= kỳ vọng, mong đợi.',
      '感動（かんどう）= xúc động; kết hợp tự nhiên với 泣く trong câu này.',
    ],
    takeaway: '感動する = xúc động; 感動して泣く = xúc động đến khóc.',
  },
  {
    number: 24,
    answer: 3,
    options: ['ぴったり', 'ぐっすり', 'うっかり', 'がっかり'],
    target: 'うっかり là sơ ý/lơ đễnh, thường dẫn đến một lỗi ngoài ý muốn.',
    translation: 'Vì đang vội nên tôi sơ ý lên nhầm xe buýt.',
    notes: [
      'ぴったり = vừa khít/khớp chính xác.',
      'ぐっすり = ngủ say; thường dùng ぐっすり眠る.',
      'うっかり = sơ ý; đúng với việc lên nhầm xe vì vội.',
      'がっかり = thất vọng/chán nản sau khi kỳ vọng không thành.',
    ],
    takeaway: 'うっかりする = sơ ý; がっかりする = thất vọng; ぴったり = vừa khít.',
  },
  {
    number: 25,
    answer: 1,
    options: ['りっぱな', 'さかんな', 'まんぞくな', 'しんせんな'],
    target: '立派な（りっぱな）là xuất sắc/đáng kính; 立派な医者 là bác sĩ giỏi, đáng kính.',
    translation: 'Anh Mori đã học tập chăm chỉ và trở thành một bác sĩ giỏi.',
    notes: [
      'りっぱな（立派な）= xuất sắc/đáng kính; phù hợp để khen một bác sĩ.',
      'さかんな（盛んな）= phát triển mạnh/sôi nổi; ví dụ hoạt động đang thịnh hành.',
      'まんぞくな（満足な）= khiến hài lòng/đầy đủ; không diễn tả người bác sĩ giỏi trong câu này.',
      'しんせんな（新鮮な）= tươi mới; thường dùng với thực phẩm hoặc ấn tượng mới mẻ.',
    ],
    takeaway: '立派な人 = người đáng kính/giỏi; 新鮮な魚 = cá tươi.',
  },
  {
    number: 26,
    answer: 1,
    options: ['大変だ', '簡単だ', 'つまらない', 'おもしろい'],
    target: 'きつい khi nói về công việc là vất vả/nặng nhọc, gần nghĩa với 大変だ.',
    translation: 'Công việc lần này rất vất vả.',
    notes: [
      '大変だ = vất vả/khó khăn; phù hợp với きつい về công việc.',
      '簡単だ = dễ dàng; nghĩa trái hướng.',
      'つまらない = chán; nói về mức độ thú vị chứ không phải độ nặng nhọc.',
      'おもしろい = thú vị; không đồng nghĩa với きつい.',
    ],
    takeaway: '仕事がきつい = công việc nặng nhọc; 大変な仕事 = công việc vất vả.',
  },
  {
    number: 27,
    answer: 2,
    options: ['いそがしかった', 'つかれた', 'はずかしかった', 'こまった'],
    target: 'くたびれた là mệt/kiệt sức, gần nghĩa với 疲れた（つかれた）.',
    translation: 'Hôm nay tôi mệt rã rời.',
    notes: [
      'いそがしかった（忙しかった）= đã bận; bận có thể gây mệt nhưng không đồng nghĩa.',
      'つかれた（疲れた）= đã mệt; đồng nghĩa gần nhất với くたびれた.',
      'はずかしかった（恥ずかしかった）= đã xấu hổ/ngượng.',
      'こまった（困った）= đã gặp khó/không biết xử lý ra sao.',
    ],
    takeaway: 'くたびれる = mệt rã rời; 疲れる = mệt.',
  },
  {
    number: 28,
    answer: 3,
    options: ['とれたら', 'きまったら', 'おわったら', 'はじまったら'],
    target: '休みが明ける là kỳ nghỉ kết thúc; 明けたら tương đương おわったら trong câu này.',
    translation: 'Khi kỳ nghỉ kết thúc, tôi sẽ liên lạc lại.',
    notes: [
      'とれたら（取れたら）= nếu lấy được/giành được; không hợp với 休みが.',
      'きまったら（決まったら）= nếu được quyết định; không có nghĩa kỳ nghỉ kết thúc.',
      'おわったら（終わったら）= khi kết thúc; gần nghĩa đúng với 休みが明けたら.',
      'はじまったら（始まったら）= khi bắt đầu; ngược nghĩa với kết thúc kỳ nghỉ.',
    ],
    takeaway: '休みが明ける = kỳ nghỉ kết thúc; 休みが始まる = kỳ nghỉ bắt đầu.',
  },
  {
    number: 29,
    answer: 3,
    options: ['客があまりいない', '品物があまりない', '客がたくさんいる', '品物がたくさんある'],
    target: '混雑している là đông đúc; cửa hàng đông khách tương ứng với 客がたくさんいる.',
    translation: 'Cửa hàng này lúc nào cũng đông.',
    notes: [
      '客があまりいない = không có nhiều khách; trái với đông đúc.',
      '品物があまりない = không có nhiều hàng hóa; nói về lượng hàng, không phải đông người.',
      '客がたくさんいる = có nhiều khách; diễn đạt cửa hàng đông khách.',
      '品物がたくさんある = có nhiều hàng hóa; không đồng nghĩa với đông khách.',
    ],
    takeaway: '混雑する = đông đúc; 客が多い = đông khách; 品物が多い = nhiều hàng.',
  },
  {
    number: 30,
    answer: 2,
    options: ['よく知られている', 'わかりやすい', 'あまり知られていない', 'わかりにくい'],
    target: '単純だ là đơn giản/không phức tạp; trong câu này điều đó khiến luật dễ hiểu, gần nhất với わかりやすい.',
    translation: 'Luật của môn thể thao này rất đơn giản.',
    notes: [
      'よく知られている = được biết đến rộng rãi; nói về độ phổ biến, không phải độ đơn giản.',
      'わかりやすい = dễ hiểu; diễn đạt gần nhất ý luật đơn giản, không phức tạp.',
      'あまり知られていない = không được biết đến nhiều; không liên quan độ phức tạp.',
      'わかりにくい = khó hiểu; trái với ý của câu.',
    ],
    takeaway: '単純だ = đơn giản; わかりやすい = dễ hiểu. Trong ngữ cảnh này, luật đơn giản nên dễ hiểu.',
  },
  {
    number: 31,
    answer: 4,
    options: [
      '電車が駅に落ち着いたら電話をください',
      'この商品は人気がなくて、棚にずっと落ち着いている',
      '家のかぎが穴に落ち着いた',
      '火事のとき落ち着いて行動しよう',
    ],
    target: '落ち着く（おちつく）là bình tĩnh lại hoặc trở nên ổn định; 「落ち着いて行動する」 là bình tĩnh hành động.',
    translation: 'Khi có hỏa hoạn, hãy bình tĩnh hành động.',
    notes: [
      'Muốn nói tàu đến ga, dùng 駅に着く／停車する; 落ち着く không phải cách nói thông thường cho việc tàu đến nơi.',
      'Hàng chưa bán được và vẫn ở trên kệ nói 売れ残っている／棚に残っている; 落ち着く không diễn tả việc hàng còn tồn ở đây.',
      'Chìa khóa lọt vào lỗ nói 穴に入る／はまる; 落ち着く không diễn tả vật vô tình lọt vào lỗ trong câu này.',
      '落ち着いて行動する = bình tĩnh hành động; kết hợp đúng.',
    ],
    takeaway:
      '落ち着く = bình tĩnh lại/ổn định; tàu đến ga là 着く, hàng còn trên kệ là 残る, vật lọt vào lỗ là はまる.',
  },
  {
    number: 32,
    answer: 2,
    options: [
      'りんごの数をはかってみたら、１７個あった',
      '小麦粉やバターをきちんとはかってケーキを作った',
      'この宿題は一時間ぐらいで終わるとはかっています',
      '先月の生活費を電卓ではかった',
    ],
    target: '「はかる」 ở đáp án 2 là 量る, cân/đong lượng nguyên liệu; danh từ chỉ vật được đo giúp chọn chữ phù hợp.',
    translation: 'Tôi cân đong bột mì và bơ cẩn thận để làm bánh.',
    notes: [
      'Đếm quả táo nói 数を数える; đo số lượng trong đơn vị quả là không tự nhiên.',
      'Bột mì và bơ cần được cân/đong: 量る là cách dùng đúng.',
      'Để nói ước tính bài tập sẽ xong trong khoảng một giờ, thường nói 一時間ぐらいで終わると見積もっている／思っている. はかる cũng có nghĩa ước lượng trong một số cách dùng, nên không nên khẳng định từ này tuyệt đối không mang nghĩa đó; riêng kết hợp 終わるとはかっています ở câu này kém tự nhiên.',
      'Tính chi phí bằng máy tính nói 電卓で計算する; はかる không mang nghĩa tính tiền.',
    ],
    takeaway: '量る = cân/đong lượng; 数える = đếm; 時間を計る = đo thời gian; 終わると見積もる = ước tính sẽ xong.',
  },
  {
    number: 33,
    answer: 2,
    options: [
      '私は映画が好きでユーモアした映画をよく見る',
      '木村さんはユーモアがあって、いっしょにいると楽しい',
      'きのう友達が貸してくれた本はとてもユーモアだった',
      '彼はユーモアに自己紹介をして、名前を覚えてもらった',
    ],
    target: 'ユーモア là khiếu/sự hài hước; mẫu đúng là ユーモアがある.',
    translation: 'Anh Kimura có khiếu hài hước nên ở cùng rất vui.',
    notes: [
      'ユーモアした映画 không tự nhiên; nói ユーモアのある映画 (phim có nét hài hước).',
      'ユーモアがあって là có khiếu hài hước; kết hợp đúng và câu sau giải thích hệ quả.',
      'ユーモアだった không tự nhiên vì ユーモア là danh từ; có thể nói ユーモラスだった／おもしろかった.',
      'Nói “tự giới thiệu pha chút hài hước” là ユーモアを交えて自己紹介する, không phải ユーモアにする.',
    ],
    takeaway: 'ユーモアがある = có khiếu hài hước; ユーモラスな = hài hước; ユーモアを交える = pha chút hài hước.',
  },
  {
    number: 34,
    answer: 1,
    options: [
      '地球の未来のために環境問題について考えよう',
      '山本さんは未来は何になりたいですか',
      'いつ来られるか、未来の都合を教えてください',
      '未来の今ごろ、大学が建つ予定です',
    ],
    target: '未来（みらい）là tương lai nói chung; 地球の未来 là tương lai của Trái Đất.',
    translation: 'Hãy suy nghĩ về vấn đề môi trường vì tương lai của Trái Đất.',
    notes: [
      '地球の未来 = tương lai của Trái Đất; kết hợp tự nhiên.',
      'Hỏi ước muốn nghề nghiệp thường nói 将来は何になりたいですか; 未来は không tự nhiên trong mẫu này.',
      'Hỏi lúc nào tiện nói 都合のいい日／これからの予定; 未来の都合 không tự nhiên.',
      '未来の今ごろ nghe không tự nhiên khi nói mốc dự kiến; thường nói 来年の今ごろ hoặc một mốc thời gian cụ thể.',
    ],
    takeaway:
      '未来 = tương lai nói chung; 将来 thường nói định hướng/tương lai của một người; 都合 = sự thuận tiện về lịch.',
  },
  {
    number: 35,
    answer: 4,
    options: [
      '父は毎朝そっくりの時間に会社に行きます',
      '私にそっくりのサイズの服が見つかった',
      '私と祖母の誕生日はそっくりです',
      '夫と息子は顔だけでなく声までそっくりです',
    ],
    target: 'そっくり là rất giống nhau; đáp án nói chồng và con trai giống nhau cả khuôn mặt lẫn giọng nói.',
    translation: 'Chồng và con trai tôi giống nhau không chỉ ở khuôn mặt mà cả giọng nói.',
    notes: [
      'Nói cùng một giờ là 同じ時間; そっくりの時間 không dùng tự nhiên.',
      'Quần áo vừa với mình nói 私にぴったりのサイズ; そっくり không có nghĩa vừa vặn.',
      'Sinh nhật trùng nhau nói 誕生日が同じ; そっくり không dùng cho ngày tháng.',
      'そっくりです diễn tả hai người/vật giống nhau rõ rệt; cách dùng đúng.',
    ],
    takeaway: 'そっくり = rất giống nhau; ぴったり = vừa khít/phù hợp; 同じ = giống nhau/trùng nhau.',
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
    'Đáp án ' + row.answer + ' — ' + row.target,
    'Dịch: “' + row.translation + '”',
    ...row.notes.map((note, index) => index + 1 + '. ' + note),
    'Ghi nhớ: ' + row.takeaway,
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
    originalQuestionSourceUrl: 'https://passjapanese.com/en/jlpt/n3/exam/2010-07-vocabulary',
    officialAnswerKeyConfirmed: false,
    method:
      'Checked the archived 2010-07 N3 vocabulary question list and inspected source pages for questions 16 and 24, including their printed choice labels. The remaining stored stems and choices were reviewed against the archive transcription available for this section. Rewrote Vietnamese prompt translations and contextual explanations for every option; preserved all answer keys because an official answer key has not been independently confirmed.',
  },
  targetedSourceChecks: {
    questionRange: '31–35 (Mondai 5)',
    questionTranscriptions: [
      'https://www.chengzhushuo.com/jlpt_test_one.html?month=07%E6%9C%88&nLevel=n3&year=2010',
      'https://www.scribd.com/document/832192913/T7-2010',
    ],
    secondaryAnswerKeyUrl:
      'https://jp-files.riyutool.com/%E8%80%83%E8%AF%95%E7%9C%9F%E9%A2%98/N3/2010.07/2010%E5%B9%B47%E6%9C%88%E6%97%A5%E6%9C%AC%E8%AF%AD%E8%83%BD%E5%8A%9B%E8%80%83%E8%AF%95N3%E7%9C%9F%E9%A2%98%E7%AD%94%E6%A1%88%E8%A7%A3%E6%9E%90%40byq1%40.pdf',
    answerSequence: [4, 2, 2, 1, 4],
    officialAnswerKeyConfirmed: false,
    dictionarySources: [
      'https://kotobank.jp/word/%E8%90%BD%E7%9D%80%E3%81%8F-452941',
      'https://kotobank.jp/word/%E3%81%AF%E3%81%8B%E3%82%8B-1576791',
      'https://kotobank.jp/word/%E8%A8%88%E3%82%8B-599904',
      'https://kotobank.jp/word/%E3%82%86%E3%83%BC%E3%82%82%E3%81%82-3174159',
      'https://kotobank.jp/word/%E3%82%86%E3%83%BC%E3%82%82%E3%82%89%E3%81%99-3220021',
      'https://kotobank.jp/word/%E6%9C%AA%E6%9D%A5-640358',
      'https://kotobank.jp/word/%E3%81%9D%E3%81%A4%E3%81%8F%E3%82%8A-3213431',
    ],
    interpretationNote:
      'For question 32, choice 2 is the clearest intended use and agrees with the secondary key. The verb はかる can also mean estimate in broader dictionary usage, so choice 3 is described as an awkward collocation here rather than claiming that はかる can never express estimation.',
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
  fs.writeFileSync(masterPath, JSON.stringify(master, null, 2) + '\n')
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
