import fs from 'node:fs'
import path from 'node:path'
import prettier from 'prettier'

const masterPath = 'data/jlpt_n3_toan_master.json'
const curatedPath = 'data/jlpt_n3_explanations_curated.json'
const reportPath = 'reports/n3-quality-audit/vocabulary-2012-07-review.json'
const examId = 'toan-n3-201207-full'
const apply = process.argv.includes('--apply')

const reviews = [
  {
    number: 1,
    answer: 1,
    options: ['あせ', 'ごみ', 'よごれ', 'なみだ'],
    explanation: [
      'Đáp án 1 — 汗（あせ）là mồ hôi; chơi thể thao khiến người nói đổ mồ hôi rồi đi tắm vòi sen.',
      'Dịch: “Vì đổ mồ hôi khi chơi thể thao nên tôi đã tắm vòi sen.”',
      '1. あせ: cách đọc đúng của 汗, nghĩa là mồ hôi.',
      '2. ごみ: rác; không phải cách đọc của 汗.',
      '3. よごれ: vết bẩn/sự bẩn; không phải cách đọc của 汗.',
      '4. なみだ: nước mắt; không phải cách đọc của 汗.',
    ].join('\n'),
  },
  {
    number: 2,
    answer: 4,
    options: ['だまって', 'もらって', 'はらって', 'くばって'],
    explanation: [
      'Đáp án 4 — 配る（くばる）là phân phát; câu nhờ đưa thông báo đến từng người.',
      'Dịch: “Hãy phát thông báo này cho mọi người.”',
      '1. だまって: im lặng; không phải cách đọc 配って.',
      '2. もらって: nhận; không phải cách đọc 配って.',
      '3. はらって: trả tiền/gạt đi; không phải cách đọc 配って.',
      '4. くばって: thể て của 配る, nghĩa là phát/phân phát.',
    ].join('\n'),
  },
  {
    number: 3,
    answer: 1,
    options: ['かんせい', 'けんせつ', 'かんぜん', 'けんちく'],
    explanation: [
      'Đáp án 1 — 完成（かんせい）là hoàn thành; con đường mới sắp được xây xong.',
      'Dịch: “Nghe nói con đường mới sắp hoàn thành.”',
      '1. かんせい: cách đọc đúng của 完成, sự hoàn thành.',
      '2. けんせつ: 建設, xây dựng; khác chữ và nghĩa với 完成.',
      '3. かんぜん: 完全, hoàn toàn/hoàn hảo; khác cách đọc của 成.',
      '4. けんちく: 建築, kiến trúc/xây dựng công trình; không phải cách đọc của 完成.',
    ].join('\n'),
  },
  {
    number: 4,
    answer: 3,
    options: ['ほし', 'とり', 'しま', 'うま'],
    explanation: [
      'Đáp án 3 — 島（しま）là đảo; từ vị trí này có thể nhìn thấy nhiều đảo.',
      'Dịch: “Từ đây có thể nhìn thấy rất nhiều đảo đấy.”',
      '1. ほし: 星, ngôi sao; không phải cách đọc của 島.',
      '2. とり: 鳥, chim; không phải cách đọc của 島.',
      '3. しま: cách đọc đúng của 島, hòn đảo.',
      '4. うま: 馬, ngựa; không phải cách đọc của 島.',
    ].join('\n'),
  },
  {
    number: 5,
    answer: 2,
    options: ['まよって', 'こまって', 'おこって', 'うたがって'],
    explanation: [
      'Đáp án 2 — 困る（こまる）là gặp khó khăn hoặc lúng túng; Tanaka trông có vẻ đang ở tình huống khó xử.',
      'Dịch: “Có vẻ anh Tanaka đang gặp khó khăn một chút.”',
      '1. まよって: 迷う, bị lạc/phân vân; không phải cách đọc 困って.',
      '2. こまって: cách đọc đúng của 困って, thể て của 困る.',
      '3. おこって: 怒る, tức giận; không phải cách đọc của 困る.',
      '4. うたがって: 疑う, nghi ngờ; không phải cách đọc của 困る.',
    ].join('\n'),
  },
  {
    number: 6,
    answer: 4,
    options: ['ほんにち', 'へいにち', 'ほんじつ', 'へいじつ'],
    explanation: [
      'Đáp án 4 — 平日（へいじつ）là ngày thường trong tuần; địa điểm này mở đến 8 giờ tối vào ngày thường.',
      'Dịch: “Vào ngày thường, nơi này mở cửa đến 8 giờ tối.”',
      '1. ほんにち: không phải cách đọc chuẩn của 平日.',
      '2. へいにち: đọc sai âm 日; 平日 đọc là へいじつ.',
      '3. ほんじつ: 本日, hôm nay; là từ khác, không phải cách đọc 平日.',
      '4. へいじつ: cách đọc đúng của 平日, ngày thường.',
    ].join('\n'),
  },
  {
    number: 7,
    answer: 2,
    options: ['さつぎょう', 'そつぎょう', 'さつぎょ', 'そつぎょ'],
    explanation: [
      'Đáp án 2 — 卒業（そつぎょう）là tốt nghiệp; người nói tốt nghiệp đại học ba năm trước.',
      'Dịch: “Tôi đã tốt nghiệp đại học ba năm trước.”',
      '1. さつぎょう: sai âm đầu; 卒業 đọc là そつぎょう.',
      '2. そつぎょう: cách đọc đúng của 卒業.',
      '3. さつぎょ: sai âm đầu và thiếu trường âm よう.',
      '4. そつぎょ: thiếu trường âm よう; cách đọc chuẩn là そつぎょう.',
    ].join('\n'),
  },
  {
    number: 8,
    answer: 4,
    options: ['かるく', 'ゆるく', 'きつく', 'かたく'],
    explanation: [
      'Đáp án 4 — 固い（かたい）nghĩa là cứng/chặt; với nắp chai, 固く締める là vặn chặt.',
      'Dịch: “Xin hãy vặn chặt nắp chai.”',
      '1. かるく: 軽く, nhẹ/nhẹ nhàng; trái với yêu cầu đóng nắp chặt.',
      '2. ゆるく: 緩く, lỏng; ngược nghĩa với 固く trong câu này.',
      '3. きつく: chặt/gắt; có nghĩa gần “chặt” nhưng không phải cách đọc của 固く.',
      '4. かたく: cách đọc đúng của 固く; ở đây nghĩa là vặn thật chặt.',
    ].join('\n'),
  },
  {
    number: 9,
    answer: 3,
    options: ['保る', '要', '守る', '取る'],
    explanation: [
      'Đáp án 3 — 約束を守る（やくそくをまもる）là giữ/thực hiện lời hứa; đây là điều quan trọng.',
      'Dịch: “Giữ lời hứa là điều quan trọng.”',
      '1. 保る: dạng này không phải cách viết chuẩn của まもる; 保つ（たもつ）mới là giữ/duy trì.',
      '2. 要: đọc よう/かなめ tùy cách dùng, mang nghĩa cần thiết/điểm cốt yếu; không đọc là まもる.',
      '3. 守る（まもる）: bảo vệ, giữ hoặc tuân thủ; kết hợp đúng với 約束.',
      '4. 取る（とる）: lấy; 約束を取る không có nghĩa là giữ lời hứa.',
    ].join('\n'),
  },
  {
    number: 10,
    answer: 4,
    options: ['週間議', '週間誌', '週刊議', '週刊誌'],
    explanation: [
      'Đáp án 4 — 週刊誌（しゅうかんし）là tạp chí phát hành hằng tuần; câu nói tạp chí này đang bán chạy nhất.',
      'Dịch: “Hiện giờ, cuốn tạp chí phát hành hằng tuần này đang bán chạy nhất.”',
      '1. 週間議: ghép chữ không tạo thành từ chỉ tạp chí; 議 không có nghĩa “tạp chí”.',
      '2. 週間誌: 週間 là khoảng thời gian một tuần; từ chỉ ấn phẩm định kỳ phải dùng 週刊誌.',
      '3. 週刊議: 週刊 chỉ tần suất hằng tuần, nhưng 議 không tạo thành danh từ “tạp chí”.',
      '4. 週刊誌: đúng cách viết; 週刊 là phát hành hằng tuần, 誌 là tạp chí/ấn phẩm.',
    ].join('\n'),
  },
  {
    number: 11,
    answer: 3,
    options: ['想談', '想淡', '相談', '相淡'],
    explanation: [
      'Đáp án 3 — 相談（そうだん）là bàn bạc/tham khảo ý kiến; người nói sẽ bàn với bạn về chuyến đi.',
      'Dịch: “Từ bây giờ tôi sẽ bàn với bạn về chuyến đi.”',
      '1. 想談: không phải cách viết chuẩn của そうだん; từ này dùng 相 và 談.',
      '2. 想淡: không tạo thành từ có nghĩa “bàn bạc/tham khảo ý kiến”.',
      '3. 相談: cách viết chuẩn của そうだん, nghĩa là trao đổi hoặc xin ý kiến.',
      '4. 相淡: chữ 談 bị thay bằng 淡 (nhạt); tổ hợp này không mang nghĩa bàn bạc.',
    ].join('\n'),
  },
  {
    number: 12,
    answer: 2,
    options: ['持信', '自信', '持心', '自心'],
    explanation: [
      'Đáp án 2 — 自信（じしん）là sự tự tin; người nói tự tin về thể lực của mình.',
      'Dịch: “Tôi tự tin về thể lực của mình.”',
      '1. 持信: không phải cách viết chuẩn của じしん; từ “tự tin” dùng 自信.',
      '2. 自信: chữ 自 chỉ bản thân, 信 gắn với lòng tin; đây là từ chuẩn nghĩa là tự tin.',
      '3. 持心: không phải từ chuẩn mang nghĩa tự tin.',
      '4. 自心: tổ hợp này không được dùng để viết từ じしん với nghĩa “tự tin”.',
    ].join('\n'),
  },
  {
    number: 13,
    answer: 1,
    options: ['温めました', '湯めました', '熱めました', '熟めました'],
    explanation: [
      'Đáp án 1 — 温める（あたためる）là làm ấm/hâm nóng; sữa được hâm bằng lò vi sóng.',
      'Dịch: “Tôi đã hâm nóng sữa bằng lò vi sóng.”',
      '1. 温めました: cách viết đúng của あたためました, dùng cho hâm sữa/thức ăn.',
      '2. 湯めました: không phải cách viết chuẩn của động từ あたためる.',
      '3. 熱めました: không phải cách viết cần chọn cho あたためました; chuẩn thường dùng là 温める hoặc 暖める.',
      '4. 熟めました: 熟す（じゅくす）liên quan đến chín/muồi; không có nghĩa hâm nóng sữa.',
    ].join('\n'),
  },
  {
    number: 14,
    answer: 3,
    options: ['材料', '材量', '原料', '原量'],
    explanation: [
      'Đáp án 3 — 原料（げんりょう）là nguyên liệu thô dùng để sản xuất; câu nói toàn bộ nguyên liệu được nhập khẩu.',
      'Dịch: “Toàn bộ nguyên liệu của sản phẩm này đều được nhập khẩu.”',
      '1. 材料（ざいりょう）: vật liệu/nguyên liệu nói chung; từ đúng gần nghĩa nhưng không đọc là げんりょう.',
      '2. 材量: không phải từ chuẩn chỉ nguyên liệu; 量 là lượng/số lượng.',
      '3. 原料（げんりょう）: nguyên liệu thô, đúng cách đọc và hợp nghĩa với sản xuất sản phẩm.',
      '4. 原量: không phải từ thông dụng viết bằng chữ này với nghĩa nguyên liệu.',
    ].join('\n'),
  },
  {
    number: 15,
    answer: 1,
    options: ['ながれ', 'かんじ', 'いそぎ', 'うごき'],
    explanation: [
      'Đáp án 1 — 川の流れ（ながれ）là dòng chảy của sông; dòng chảy nhanh nên không được bơi.',
      'Dịch: “Vì dòng chảy của sông hôm nay mạnh nên không được bơi.”',
      '1. ながれ: 流れ, dòng chảy; 川の流れが速い là cách nói tự nhiên.',
      '2. かんじ: 感じ, cảm giác/ấn tượng; 川の感じ không thể chỉ dòng nước chảy.',
      '3. いそぎ: 急ぎ, việc gấp/sự vội vàng; không phải dòng nước.',
      '4. うごき: 動き, sự chuyển động; quá chung và không kết hợp tự nhiên với 川の〜が速い trong câu này.',
    ].join('\n'),
  },
  {
    number: 16,
    answer: 4,
    options: ['食器', '試食', '食欲', '外食'],
    explanation: [
      'Đáp án 4 — 外食（がいしょく）là ăn ở ngoài; vì tốn tiền nên người nói thường ăn tại nhà.',
      'Dịch: “Vì ăn ngoài tốn tiền nên tôi luôn ăn cơm ở nhà.”',
      '1. 食器（しょっき）: bát đĩa/dụng cụ ăn uống; không phải hoạt động tốn tiền trong câu.',
      '2. 試食（ししょく）: ăn thử để nếm; không phải ăn ở nhà hàng/quán.',
      '3. 食欲（しょくよく）: cảm giác thèm ăn; không thể nói 食欲はお金がかかる.',
      '4. 外食（がいしょく）: ăn ngoài; 外食はお金がかかる là kết hợp đúng.',
    ].join('\n'),
  },
  {
    number: 17,
    answer: 3,
    options: ['引', '比', '差', '別'],
    explanation: [
      'Đáp án 3 — 一点差（いってんさ）là cách biệt một điểm; đội đã thắng trận hôm qua với tỷ số sít sao.',
      'Dịch: “Trận đấu hôm qua, chúng tôi đã thắng với cách biệt một điểm.”',
      '1. 引: nghĩa/âm có thể là kéo hoặc trừ; 一点引き không phải cách nói tự nhiên cho cách biệt tỷ số.',
      '2. 比: so sánh/tỷ lệ; 一点比 không tạo thành cụm chỉ cách biệt điểm.',
      '3. 差: chênh lệch; 一点差で勝つ là thắng với cách biệt một điểm.',
      '4. 別: phân biệt/riêng biệt; 一点別 không phải kết hợp đúng ở đây.',
    ].join('\n'),
  },
  {
    number: 18,
    answer: 2,
    options: ['ストップ', 'セット', 'キャンセル', 'スタート'],
    explanation: [
      'Đáp án 2 — 目覚まし時計をセットする là cài/đặt đồng hồ báo thức; đặt hai chiếc để tránh ngủ quên.',
      'Dịch: “Để không ngủ quên, hôm qua tôi đã đặt hai chiếc đồng hồ báo thức rồi đi ngủ.”',
      '1. ストップ: dừng; ストップして寝る không có nghĩa cài báo thức.',
      '2. セット: đặt/cài giờ; 目覚まし時計をセットする là kết hợp tự nhiên.',
      '3. キャンセル: hủy; không giúp báo thức reo.',
      '4. スタート: bắt đầu; không phải thao tác cài giờ báo thức.',
    ].join('\n'),
  },
  {
    number: 19,
    answer: 1,
    options: ['意志', '期待', '努力', '希望'],
    explanation: [
      'Đáp án 1 — 意志が強い là có ý chí kiên định; Sato không bỏ cuộc dù thất bại nhiều lần.',
      'Dịch: “Anh Sato là người có ý chí mạnh mẽ, không bỏ cuộc dù thất bại bao nhiêu lần.”',
      '1. 意志（いし）: ý chí/quyết tâm; 意志の強い人 là người có ý chí kiên định.',
      '2. 期待（きたい）: kỳ vọng; 期待が強い không diễn tả sự bền chí của một người.',
      '3. 努力（どりょく）: nỗ lực; thường nói 努力する/努力を続ける, không dùng 努力の強い人 ở đây.',
      '4. 希望（きぼう）: hy vọng/mong muốn; không diễn tả quyết tâm không bỏ cuộc như 意志.',
    ].join('\n'),
  },
  {
    number: 20,
    answer: 4,
    options: ['つきあって', 'かかわって', 'まちあわせて', 'わかれて'],
    explanation: [
      'Đáp án 4 — ホストファミリーと別れる（わかれる）là chia tay/tạm biệt gia đình chủ nhà; người nói thấy cô đơn khi chỉ còn lại một mình.',
      'Dịch: “Ở sân bay, khi chia tay gia đình chủ nhà và chỉ còn một mình, tôi đã rất cô đơn.”',
      '1. つきあって: đi cùng/qua lại với; không diễn tả khoảnh khắc rời gia đình chủ nhà.',
      '2. かかわって: có liên quan đến; không phù hợp với người đi cùng ở sân bay.',
      '3. まちあわせて: hẹn gặp; không có nghĩa chia tay.',
      '4. わかれて: thể て của 別れる, chia tay/tạm biệt; khớp với cảm giác cô đơn sau đó.',
    ].join('\n'),
  },
  {
    number: 21,
    answer: 2,
    options: ['立たなくなった', '起きなくなった', '始まらなくなった', '開かなくなった'],
    explanation: [
      'Đáp án 2 — 問題が起きる là vấn đề phát sinh; 起きなくなった nghĩa là không còn xảy ra sau khi đổi cách làm.',
      'Dịch: “Sau khi thay đổi cách làm việc, những vấn đề lớn không còn xảy ra nữa.”',
      '1. 立たなくなった: 立つ là đứng/dựng lên; 問題が立つ không tự nhiên với nghĩa vấn đề phát sinh.',
      '2. 起きなくなった: không còn xảy ra; 問題が起きる là cụm thường dùng.',
      '3. 始まらなくなった: không còn bắt đầu; không nói rằng vấn đề được giải quyết hay không phát sinh.',
      '4. 開かなくなった: không còn mở; không dùng 開く cho sự việc/vấn đề xảy ra.',
    ].join('\n'),
  },
  {
    number: 22,
    answer: 3,
    options: ['参加', '指導', '応援', '競争'],
    explanation: [
      'Đáp án 3 — 応援に行く（おうえんにいく）là đi cổ vũ; đàn anh của người nói sẽ thi đấu bóng đá.',
      'Dịch: “Hôm nay đàn anh sẽ ra sân trong trận bóng đá nên tôi đã đi cổ vũ cùng bạn.”',
      '1. 参加（さんか）: tham gia; 参加に行く không tự nhiên trong cấu trúc này.',
      '2. 指導（しどう）: hướng dẫn/huấn luyện; người nói đến xem trận chứ không huấn luyện.',
      '3. 応援（おうえん）: cổ vũ/ủng hộ; 応援に行く là đi cổ vũ người thi đấu.',
      '4. 競争（きょうそう）: cạnh tranh; người nói không tham gia thi đấu với đàn anh.',
    ].join('\n'),
  },
  {
    number: 23,
    answer: 2,
    options: ['移して', 'のばして', 'やり直して', 'とりかえて'],
    explanation: [
      'Đáp án 2 — 締め切りを延ばす（のばす）là gia hạn thời hạn; giáo viên cho thêm một ngày để nộp báo cáo.',
      'Dịch: “Tôi nhờ thầy/cô gia hạn hạn nộp báo cáo đúng một ngày.”',
      '1. 移して: di chuyển/chuyển sang vị trí khác; không tự nhiên để nói kéo dài thời hạn thêm một ngày.',
      '2. のばして: 延ばす, kéo dài/gia hạn; 締め切りを一日延ばす là cách nói đúng.',
      '3. やり直して: làm lại từ đầu; không thay đổi hạn nộp.',
      '4. とりかえて: đổi/thay vật này bằng vật khác; không có nghĩa gia hạn.',
    ].join('\n'),
  },
  {
    number: 24,
    answer: 4,
    options: ['たたいて', 'にぎって', 'さわって', 'ふって'],
    explanation: [
      'Đáp án 4 — 手を振る（てをふる）là vẫy tay; người nói vẫy tiễn cho đến khi xe khuất khỏi tầm mắt.',
      'Dịch: “Tôi vẫy tay tiễn cho đến khi chiếc xe chở mọi người khuất hẳn.”',
      '1. たたいて: vỗ/đập; vỗ tay là 手をたたく, không phải cử chỉ vẫy tiễn.',
      '2. にぎって: nắm; 手を握る là nắm tay, không phải vẫy tay.',
      '3. さわって: chạm vào; không thể hiện động tác chào tạm biệt từ xa.',
      '4. ふって: 振る, vẫy; 手を振って見送る là vẫy tay tiễn.',
    ].join('\n'),
  },
  {
    number: 25,
    answer: 2,
    options: ['ケース', 'カバー', 'マスク', 'ラップ'],
    explanation: [
      'Đáp án 2 — バイクにカバーをかける là phủ bạt/áo trùm lên xe máy để che mưa.',
      'Dịch: “Nghe nói tối nay mưa nên tôi đã phủ bạt lên chiếc xe máy đỗ ngoài nhà.”',
      '1. ケース: hộp/vỏ đựng; không phải đồ phủ xe máy ngoài trời.',
      '2. カバー: tấm phủ/áo trùm; カバーをかける là che xe lại.',
      '3. マスク: khẩu trang/mặt nạ; không dùng để che cả xe máy.',
      '4. ラップ: màng bọc thực phẩm; không phù hợp để bảo vệ xe máy khỏi mưa.',
    ].join('\n'),
  },
  {
    number: 26,
    answer: 4,
    options: ['悪いところ', 'いいところ', '違うところ', '同じところ'],
    explanation: [
      'Đáp án 4 — 共通点（きょうつうてん）là điểm chung, tức đặc điểm giống nhau giữa nhiều cách làm.',
      'Dịch: “Những cách làm này có điểm chung.”',
      '1. 悪いところ: điểm xấu; không có nghĩa là điểm chung.',
      '2. いいところ: điểm tốt; nói về giá trị, không nhất thiết là điều cùng có.',
      '3. 違うところ: điểm khác nhau; gần như ngược nghĩa với 共通点.',
      '4. 同じところ: điểm giống nhau; diễn đạt đúng nghĩa 共通点.',
    ].join('\n'),
  },
  {
    number: 27,
    answer: 2,
    options: ['数えた', '片付けた', '運んだ', '探した'],
    explanation: [
      'Đáp án 2 — 書類を整理する là sắp xếp giấy tờ cho ngăn nắp; 片付ける diễn đạt gần nhất trong các lựa chọn.',
      'Dịch: “Mọi người đã cùng nhau sắp xếp giấy tờ.”',
      '1. 数えた: đã đếm; không làm giấy tờ ngăn nắp.',
      '2. 片付けた: đã dọn/sắp xếp gọn; phù hợp với việc thu xếp giấy tờ.',
      '3. 運んだ: đã vận chuyển; chỉ việc mang giấy tờ đi nơi khác.',
      '4. 探した: đã tìm kiếm; không có nghĩa phân loại/sắp xếp giấy tờ.',
    ].join('\n'),
  },
  {
    number: 28,
    answer: 3,
    options: ['すぐに', 'たぶん', 'かならず', 'あとから'],
    explanation: [
      'Đáp án 3 — ぜったいに là nhất định/chắc chắn; gần nghĩa với かならず trong câu dự đoán Tanaka sẽ đến.',
      'Dịch: “Tôi nghĩ anh Tanaka nhất định sẽ đến.”',
      '1. すぐに: ngay lập tức/sớm; nói về thời điểm, không phải mức độ chắc chắn.',
      '2. たぶん: có lẽ; thể hiện phỏng đoán, yếu hơn ぜったいに.',
      '3. かならず: nhất định/chắc chắn; tương đương với ぜったいに ở đây.',
      '4. あとから: sau đó/về sau; nói về trình tự thời gian.',
    ].join('\n'),
  },
  {
    number: 29,
    answer: 1,
    options: ['だれにも話さないで', 'いろいろな人に話して', '早く忘れて', '忘れないで'],
    explanation: [
      'Đáp án 1 — ないしょにする là giữ bí mật; tương đương với không kể cho bất kỳ ai.',
      'Dịch: “Xin hãy giữ kín chuyện này.”',
      '1. だれにも話さないで: đừng nói với bất kỳ ai; đúng nghĩa giữ bí mật.',
      '2. いろいろな人に話して: kể cho nhiều người; trái với yêu cầu giữ kín.',
      '3. 早く忘れて: hãy quên nhanh; khác với không tiết lộ chuyện đó.',
      '4. 忘れないで: đừng quên; không yêu cầu người nghe ghi nhớ hay quên.',
    ].join('\n'),
  },
  {
    number: 30,
    answer: 3,
    options: ['人気がある', 'よく覚えている', '好きな', '楽しい'],
    explanation: [
      'Đáp án 3 — 気に入っている nghĩa là thích/ưng ý; câu hỏi bài hát nào người nói thích nhất trong CD.',
      'Dịch: “Đây là bài hát tôi thích nhất trong CD này.”',
      '1. 人気がある: được nhiều người yêu thích/nổi tiếng; không nói riêng sở thích của người nói.',
      '2. よく覚えている: nhớ rõ; khác với yêu thích.',
      '3. 好きな: yêu thích; diễn đạt gần nghĩa nhất với 気に入っている.',
      '4. 楽しい: vui/thú vị; mô tả cảm giác của trải nghiệm, không đồng nghĩa với thích một bài hát.',
    ].join('\n'),
  },
  {
    number: 31,
    answer: 4,
    options: [
      '初めて雪を見て、うれしくて胸が緊張した',
      '夏休みは、あそびの計画がとても緊張している',
      '新しいパソコンは使い方が緊張していて、うまく使えない人が多い',
      'テレビのインタビューを受けて、とても緊張した',
    ],
    explanation: [
      'Đáp án 4 — 緊張する（きんちょうする）là căng thẳng/hồi hộp trước tình huống gây áp lực; được phỏng vấn trên truyền hình là ngữ cảnh tự nhiên.',
      'Dịch câu đúng: “Tôi đã rất hồi hộp khi được phỏng vấn trên truyền hình.”',
      '1. Thấy tuyết lần đầu và vui thì 胸がいっぱいになった tự nhiên hơn; 緊張した không diễn tả niềm vui đó.',
      '2. Kế hoạch vui chơi không “căng thẳng”; người có thể 緊張する, còn 計画が緊張する không tự nhiên.',
      '3. Cách dùng máy tính khó hiểu thì 使い方が難しい/複雑だ; 緊張する không có nghĩa là khó sử dụng.',
      '4. Bị phỏng vấn trên truyền hình và cảm thấy hồi hộp: 緊張した dùng đúng.',
    ].join('\n'),
  },
  {
    number: 32,
    answer: 2,
    options: [
      'このすばらしい景色をずっと暗記しておきたいです',
      '教科書に載っている文は、すべて暗記しています',
      '高校のクラスメートだった田中さんを暗記していますか',
      '借りた本をどこにしまったか、暗記していません',
    ],
    explanation: [
      'Đáp án 2 — 暗記する（あんきする）là ghi nhớ/học thuộc nội dung bằng trí nhớ; câu trong sách giáo khoa có thể được học thuộc.',
      'Dịch câu đúng: “Tôi đã học thuộc tất cả các câu trong sách giáo khoa.”',
      '1. Với cảnh đẹp, nói 目に焼き付ける (khắc sâu vào mắt/ký ức) tự nhiên hơn 暗記する.',
      '2. Văn bản/câu trong sách giáo khoa là nội dung có thể học thuộc; 暗記しています dùng đúng.',
      '3. Hỏi có nhớ bạn học thì dùng 田中さんを覚えていますか; 暗記する không tự nhiên cho việc nhớ một người.',
      '4. Hỏi nhớ chỗ cất sách thì dùng 覚えていません; 暗記する thường dành cho nội dung học thuộc.',
    ].join('\n'),
  },
  {
    number: 33,
    answer: 1,
    options: [
      '店の看板に気づかず、いつのまにか前を通り過ぎていた',
      '高校生の息子がとうとう父の身長を通り過ぎた',
      '中村選手は山口選手を通り過ぎて、１位でゴールに入った',
      '夜の１０時を通り過ぎていたので、レストランは閉まっていた',
    ],
    explanation: [
      'Đáp án 1 — 通り過ぎる（とおりすぎる）là đi ngang qua rồi đi quá khỏi một địa điểm; không nhận ra biển hiệu nên người đó đã đi quá cửa hàng.',
      'Dịch câu đúng: “Không để ý biển hiệu nên tôi đã đi quá cửa hàng lúc nào không hay.”',
      '1. 通り過ぎる dùng cho việc đi qua khỏi cửa hàng; cách dùng đúng.',
      '2. Con trai cao hơn cha thì nói 父の身長を追い越した/超えた, không dùng 通り過ぎる.',
      '3. Vận động viên vượt đối thủ trong cuộc đua thì dùng 選手を追い越す; 通り過ぎる là đi ngang qua địa điểm/người.',
      '4. Nói thời gian đã quá 10 giờ thì dùng 10時を過ぎる; 通り過ぎる không tự nhiên với mốc giờ này.',
    ].join('\n'),
  },
  {
    number: 34,
    answer: 1,
    options: [
      '就職活動のために、先輩の会社を訪問しました',
      '友人から結婚式の招待の手紙が訪問しました',
      '週末はいつも家族で海を訪問しています',
      '突然海外旅行のチャンスが訪問しました',
    ],
    explanation: [
      'Đáp án 1 — 訪問する（ほうもんする）là đến thăm người/cơ quan có mục đích; đến công ty đàn anh để tìm việc là cách dùng phù hợp.',
      'Dịch câu đúng: “Tôi đã đến thăm công ty của đàn anh để tìm việc.”',
      '1. Đến thăm công ty vì hoạt động tìm việc: 会社を訪問する dùng đúng.',
      '2. Thư mời được gửi đến thì nói 手紙が届く; thư không “đến thăm”.',
      '3. Đi chơi biển cuối tuần thường nói 海に行く/海を訪れる; 訪問 thường dùng cho người hoặc cơ quan.',
      '4. Cơ hội du lịch đột nhiên xuất hiện thì nói チャンスが訪れる, không dùng 訪問する.',
    ].join('\n'),
  },
  {
    number: 35,
    answer: 3,
    options: [
      'この漢字をひらがなに翻訳してください',
      '長い文章を短くわかりやすい文章に翻訳するのは難しい',
      'この小説は十以上の言語に翻訳されている',
      '「生産」はほかのことばに翻訳すれば「物を作る」ということです',
    ],
    explanation: [
      'Đáp án 3 — 翻訳する（ほんやくする）là chuyển nội dung từ ngôn ngữ này sang ngôn ngữ khác; tiểu thuyết có thể được dịch sang nhiều ngôn ngữ.',
      'Dịch câu đúng: “Cuốn tiểu thuyết này đã được dịch sang hơn mười ngôn ngữ.”',
      '1. Đổi chữ Hán sang hiragana là viết cách đọc/chuyển chữ (書き換える), không phải dịch giữa hai ngôn ngữ.',
      '2. Rút gọn một đoạn văn là 要約する (tóm tắt); không phải 翻訳する nếu vẫn ở cùng một ngôn ngữ.',
      '3. Dịch tiểu thuyết sang hơn mười ngôn ngữ: 翻訳されている dùng đúng.',
      '4. Giải thích 生産 bằng cụm “làm ra đồ vật” là giải nghĩa/diễn đạt lại bằng từ khác, không phải dịch sang ngôn ngữ khác.',
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
    method:
      'Reviewed the Japanese prompts and four stored choices for all vocabulary questions, translated each prompt, and wrote contextual explanations for the answer and distractors. Existing answer keys and printed option text were preserved. The original question paper and official answer key were not independently confirmed in this pass.',
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
  fs.writeFileSync(masterPath, await prettier.format(JSON.stringify(master), { filepath: masterPath }))
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
