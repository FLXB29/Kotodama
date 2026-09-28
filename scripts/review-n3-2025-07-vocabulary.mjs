import fs from 'node:fs'
import path from 'node:path'
import prettier from 'prettier'

const masterPath = 'data/jlpt_n3_toan_master.json'
const curatedPath = 'data/jlpt_n3_explanations_curated.json'
const reportPath = 'reports/n3-quality-audit/vocabulary-2025-07-review.json'
const examId = 'toan-n3-202507-full'
const apply = process.argv.includes('--apply')
const review = (number, answer, options, lines) => ({
  number,
  answer,
  options,
  explanation: lines.join('\n'),
})

const reviews = [
  review(
    1,
    1,
    ['なみだ', 'あせ', 'せき', 'くしゃみ'],
    [
      'Đáp án 1 — 「涙」（なみだ）là nước mắt; 「涙が出る」là nước mắt trào ra.',
      'Dịch: “Bỗng nhiên nước mắt trào ra.”',
      '1. なみだ: cách đọc đúng của 涙, nghĩa là nước mắt.',
      '2. あせ: 汗, mồ hôi; là từ khác, không phải cách đọc của 涙.',
      '3. せき: 咳, cơn ho; là từ khác, không phải cách đọc của 涙.',
      '4. くしゃみ: hắt hơi; là từ khác, không phải cách đọc của 涙.',
    ]
  ),
  review(
    2,
    1,
    ['かんぜん', 'かんたん', 'けんぜん', 'けんたん'],
    [
      'Đáp án 1 — 「完全」（かんぜん）là hoàn toàn, trọn vẹn; 「完全に治る」là khỏi hẳn.',
      'Dịch: “Vết thương đã khỏi hẳn.”',
      '1. かんぜん: cách đọc đúng của 完全.',
      '2. かんたん: 「簡単」, đơn giản/dễ; khác chữ và khác nghĩa.',
      '3. けんぜん: 「健全」, lành mạnh/khỏe mạnh; không phải cách đọc của 完全.',
      '4. けんたん: không phải cách đọc của 完全.',
    ]
  ),
  review(
    3,
    3,
    ['ちめい', 'ちめん', 'じめん', 'しめん'],
    [
      'Đáp án 3 — 「地面」（じめん）là mặt đất; 「地面がぬれる」là mặt đất bị ướt.',
      'Dịch: “Mặt đất bị ướt vì mưa.”',
      '1. ちめい: 「地名」là địa danh; không phải cách đọc của 地面.',
      '2. ちめん: đọc sai chữ 地 trong từ này.',
      '3. じめん: cách đọc đúng của 地面.',
      '4. しめん: có thể đọc các từ khác như 四面 (bốn mặt) hoặc 紙面 (trang báo), không phải 地面.',
    ]
  ),
  review(
    4,
    4,
    ['もどした', 'かくした', 'のこした', 'うつした'],
    [
      'Đáp án 4 — 「移した」（うつした）là đã chuyển/dời thứ gì sang chỗ khác.',
      'Dịch: “Có nên chuyển tiền sang chiếc hộp kia không?”',
      '1. もどした: 「戻した」, đã đưa/trả về chỗ cũ.',
      '2. かくした: 「隠した」, đã giấu đi.',
      '3. のこした: 「残した」, đã để lại/chừa lại.',
      '4. うつした: cách đọc đúng của 移した, chuyển sang nơi khác.',
    ]
  ),
  review(
    5,
    2,
    ['こきょう', 'こきゅう', 'こうきゅう', 'こうきょう'],
    [
      'Đáp án 2 — 「呼吸」（こきゅう）là hô hấp/hơi thở; 「呼吸をする」là thở.',
      'Dịch: “Xin hãy thở chậm.”',
      '1. こきょう: 「故郷」là quê hương; phát âm gần giống nhưng khác từ.',
      '2. こきゅう: cách đọc đúng của 呼吸.',
      '3. こうきゅう: 「高級」là cao cấp.',
      '4. こうきょう: 「公共」là công cộng.',
    ]
  ),
  review(
    6,
    2,
    ['せんちょう', 'しんちょう', 'じんちょう', 'ぜんちょう'],
    [
      'Đáp án 2 — 「身長」（しんちょう）là chiều cao cơ thể; biểu mẫu thường yêu cầu ghi 身長.',
      'Dịch: “Xin hãy ghi chiều cao của bạn ở đây.”',
      '1. せんちょう: 「船長」là thuyền trưởng.',
      '2. しんちょう: cách đọc đúng của 身長.',
      '3. じんちょう: không phải cách đọc của 身長.',
      '4. ぜんちょう: 「前兆」là điềm báo; 「全長」là tổng chiều dài.',
    ]
  ),
  review(
    7,
    3,
    ['まよって', 'おこって', 'こまって', 'だまって'],
    [
      'Đáp án 3 — 「困っている」（こまっている）là đang gặp khó khăn/lúng túng.',
      'Dịch: “Có vẻ anh Maeda đang gặp khó khăn.”',
      '1. まよって: 「迷って」, đang lạc đường hoặc phân vân.',
      '2. おこって: 「怒って」, đang tức giận.',
      '3. こまって: cách đọc đúng của 困って.',
      '4. だまって: 「黙って」, đang im lặng.',
    ]
  ),
  review(
    8,
    3,
    ['やっきょ', 'やきょく', 'やっきょく', 'やきょ'],
    [
      'Đáp án 3 — 「薬局」（やっきょく）là hiệu thuốc. Cách đọc có âm ngắt nhỏ っ.',
      'Dịch: “Gần đây có hiệu thuốc nào không?”',
      '1. やっきょ: thiếu âm く cuối từ.',
      '2. やきょく: thiếu âm ngắt nhỏ っ.',
      '3. やっきょく: cách đọc đúng của 薬局.',
      '4. やきょ: thiếu cả âm ngắt nhỏ っ lẫn âm く cuối từ.',
    ]
  ),
  review(
    9,
    2,
    ['産たい', '育てたい', '愛たい', '幸たい'],
    [
      'Đáp án 2 — 「育てる」（そだてる）là nuôi dưỡng/nuôi dạy; 「子どもを育てたい」là muốn nuôi dạy con.',
      'Dịch: “Tôi đang nghĩ muốn nuôi dạy con cái ở thị trấn này.”',
      '1. 産 có nghĩa sinh/đẻ, nhưng 「産たい」không phải dạng đúng; 「産む」là sinh con và 「産みたい」là muốn sinh con.',
      '2. 育てたい: cách viết đúng của そだてたい, muốn nuôi dưỡng/nuôi dạy.',
      '3. 愛 là tình yêu/yêu thương; động từ 愛する chia thành 愛したい, không phải 「愛たい」.',
      '4. 幸 liên quan đến hạnh phúc/sự may mắn; 「幸たい」không phải động từ chuẩn.',
    ]
  ),
  review(
    10,
    1,
    ['煙', '燥', '焼', '爆'],
    [
      'Đáp án 1 — 「煙」（けむり）là khói; từ được hỏi là cách viết của けむり.',
      'Dịch sát câu dữ liệu: “Khi ngực cháy thì khói xuất hiện.” Cụm 「胸が燃える」không hợp ngữ cảnh khói, có thể là lỗi chép; giữ nguyên câu nguồn và không suy đoán cách sửa.',
      '1. 煙（けむり）: khói; đáp án đúng.',
      '2. 燥: xuất hiện trong từ như 乾燥 (khô/sự khô); không viết từ けむり.',
      '3. 焼: liên quan đến đốt/nướng, như 焼く（やく）; không có nghĩa là khói.',
      '4. 爆: nổ/bùng nổ, như 爆発 (vụ nổ) hoặc 爆笑 (cười phá lên); không có nghĩa là khói.',
    ]
  ),
  review(
    11,
    2,
    ['森村', '森林', '山林', '山村'],
    [
      'Đáp án 2 — 「森林」（しんりん）là rừng; 「森林が見える」là nhìn thấy rừng.',
      'Dịch: “Từ đây có thể nhìn thấy rừng.”',
      '1. 森村: không phải từ thông dụng chỉ rừng; có thể gặp như họ tên Morimura.',
      '2. 森林（しんりん）: rừng; đúng cả cách đọc lẫn nghĩa.',
      '3. 山林（さんりん）: rừng núi/đất rừng; nghĩa gần nhưng cách đọc không phải しんりん.',
      '4. 山村（さんそん）: làng miền núi; khác nghĩa với rừng.',
    ]
  ),
  review(
    12,
    4,
    ['流びました', '洗びました', '清びました', '浴びました'],
    [
      'Đáp án 4 — 「シャワーを浴びる」（あびる）là tắm vòi sen.',
      'Dịch: “Sáng nay tôi đã tắm vòi sen.”',
      '1. 流びる: không phải động từ chuẩn; 流す・流れる nghĩa là làm chảy/chảy.',
      '2. 洗びる: không phải dạng đúng; 洗う（あらう）nghĩa là rửa/giặt.',
      '3. 清びる: không phải động từ chuẩn; 清い là trong sạch, 清潔 là sạch sẽ.',
      '4. 浴びました: dạng lịch sự quá khứ của 浴びる, tắm dưới vòi sen hoặc tiếp xúc với thứ gì.',
    ]
  ),
  review(
    13,
    1,
    ['可能', '可態', '化能', '化態'],
    [
      'Đáp án 1 — 「可能」（かのう）là có thể/khả thi; 「可能でしょうか」hỏi liệu việc đó có thể thực hiện được không.',
      'Dịch: “Có thể đổi màu chữ được không?”',
      '1. 可能（かのう）: có thể, khả thi; đúng cách viết và cách đọc.',
      '2. 可態: không phải từ chuẩn có cách đọc かのう; 可 là có thể/được phép, 態 là trạng thái/dạng thức.',
      '3. 化能: không phải từ chuẩn có cách đọc かのう; 化 liên quan đến biến đổi, 能 là năng lực/khả năng.',
      '4. 化態: không phải cách viết chuẩn của 可能; 化 và 態 không ghép thành từ cần tìm.',
    ]
  ),
  review(
    14,
    3,
    ['返信', '送真', '送信', '返真'],
    [
      'Đáp án 3 — 「送信」（そうしん）là gửi/truyền dữ liệu; 「メールを送信する」là gửi email.',
      'Dịch: “Bây giờ tôi sẽ gửi email.”',
      '1. 返信（へんしん）: trả lời/hồi âm một tin nhắn hoặc thư; không phải hành động gửi thư đi.',
      '2. 送真: không phải từ chuẩn そうしん; 送 là gửi, 真 là thật/chân lý.',
      '3. 送信（そうしん）: gửi/truyền thông tin; đúng trong ngữ cảnh email.',
      '4. 返真: không phải từ chuẩn; 返 liên quan đến trả lại/đáp lại, 真 là thật/chân lý.',
    ]
  ),
  review(
    15,
    4,
    ['拝見', '歓迎', '応答', '感動'],
    [
      'Đáp án 4 — 「感動する」（かんどうする）là xúc động/rung động trước điều gây ấn tượng.',
      'Dịch: “Phong cảnh nhìn từ trên núi rất tuyệt, khiến tôi vô cùng xúc động.”',
      '1. 拝見（はいけん）: xem/đọc một cách khiêm nhường; không dùng với した để nói mình xúc động.',
      '2. 歓迎（かんげい）: chào đón/hoan nghênh; không hợp với cảnh đẹp khiến người nói xúc động.',
      '3. 応答（おうとう）: trả lời/đáp lại; không diễn tả cảm xúc trước phong cảnh.',
      '4. 感動（かんどう）: sự xúc động; 感動した là đã xúc động.',
    ]
  ),
  review(
    16,
    3,
    ['後半', '中年', '中古', '後期'],
    [
      'Đáp án 3 — 「中古の車」là xe đã qua sử dụng.',
      'Dịch: “Cửa hàng này bán xe mà trước đây người khác từng sử dụng.”',
      '1. 後半（こうはん）: nửa sau của một khoảng thời gian/trận đấu.',
      '2. 中年（ちゅうねん）: tuổi trung niên.',
      '3. 中古（ちゅうこ）: đồ đã qua sử dụng; kết hợp tự nhiên với 車.',
      '4. 後期（こうき）: giai đoạn sau/kỳ sau; không có nghĩa là đồ cũ.',
    ]
  ),
  review(
    17,
    2,
    ['スケジュール', 'リスト', 'カタログ', 'プログラム'],
    [
      'Đáp án 2 — 「リストを作る」là lập danh sách; ở đây là danh sách đồ cần mang theo.',
      'Dịch: “Tôi đã lập danh sách những thứ cần mang cho chuyến đi tuần sau.”',
      '1. スケジュール: lịch trình/thời gian biểu.',
      '2. リスト: danh sách đồ cần kiểm tra/mang theo.',
      '3. カタログ: ca-ta-lô giới thiệu sản phẩm/hàng hóa.',
      '4. プログラム: chương trình hoặc kế hoạch các tiết mục/hoạt động.',
    ]
  ),
  review(
    18,
    1,
    ['くやしかった', 'まずしかった', 'ゆるかった', 'ずるかった'],
    [
      'Đáp án 1 — 「悔しかった」（くやしかった）diễn tả tiếc nuối/bực bội vì thất bại hoặc việc không như ý.',
      'Dịch: “Lần trước tôi thua trận nên rất ấm ức, nhưng lần này đã thắng nên tôi thật sự vui.”',
      '1. くやしかった: 悔しかった, đã thấy tiếc nuối/ấm ức; hợp với việc thua trận.',
      '2. まずしかった: 貧しかった, đã nghèo; không nói về cảm giác sau trận thua.',
      '3. ゆるかった: 緩かった, đã lỏng/không nghiêm; không hợp với cảm xúc trong câu.',
      '4. ずるかった: 狡かった, đã gian trá/không công bằng; không diễn tả sự tiếc nuối vì thua.',
    ]
  ),
  review(
    19,
    4,
    ['途中', '徒歩', '方向', '距離'],
    [
      'Đáp án 4 — 「距離」（きょり）là khoảng cách; 「距離はどのくらい」hỏi xa bao nhiêu.',
      'Dịch: “Khoảng cách từ đây đến tòa thị chính là bao xa?”',
      '1. 途中（とちゅう）: giữa đường/trong quá trình đi.',
      '2. 徒歩（とほ）: việc đi bộ; không phải khoảng cách.',
      '3. 方向（ほうこう）: phương hướng.',
      '4. 距離（きょり）: khoảng cách; đúng với câu hỏi từ đây đến tòa thị chính xa bao nhiêu.',
    ]
  ),
  review(
    20,
    2,
    ['ほして', 'ふいて', '張って', '直して'],
    [
      'Đáp án 2 — 「体を拭く」（からだをふく）là lau người; dùng khăn sau khi tắm.',
      'Dịch: “Sau khi tắm, hãy dùng chiếc khăn này lau người.”',
      '1. ほして: 「干して」, đem phơi/làm khô bằng cách hong; không phải lau người.',
      '2. ふいて: 「拭いて」, dạng nối của 拭く, lau bằng khăn; đúng.',
      '3. 張って: 張る, căng/giăng/dán; không hợp với khăn lau người.',
      '4. 直して: 直す, sửa/chỉnh lại; không hợp với cơ thể và khăn.',
    ]
  ),
  review(
    21,
    4,
    ['失礼', '命令', '否定', '文句'],
    [
      'Đáp án 4 — 「文句を言う」là phàn nàn/kêu ca; khách phàn nàn vì giao hàng chậm.',
      'Dịch: “Do việc giao hàng bị chậm nên tôi đã bị khách phàn nàn.”',
      '1. 失礼（しつれい）: sự thất lễ/thiếu lịch sự; không phải lời phàn nàn.',
      '2. 命令（めいれい）: mệnh lệnh/chỉ thị.',
      '3. 否定（ひてい）: sự phủ định/bác bỏ.',
      '4. 文句（もんく）: lời than phiền/khiếu nại; kết hợp với 言う.',
    ]
  ),
  review(
    22,
    1,
    ['思いついた', '引き受けた', '知り合った', '取り替えた'],
    [
      'Đáp án 1 — 「思いつく」（おもいつく）là chợt nghĩ ra/nảy ra một ý tưởng.',
      'Dịch: “Có ai nghĩ ra được cách nào hay để giải quyết vấn đề này không?”',
      '1. 思いついた: đã nghĩ ra; đúng với 方法を思いつく.',
      '2. 引き受けた: đã nhận/đảm nhận một công việc hoặc trách nhiệm.',
      '3. 知り合った: đã quen/đã làm quen với ai đó.',
      '4. 取り替えた: đã thay hoặc đổi một vật khác.',
    ]
  ),
  review(
    23,
    1,
    ['坂道', '通り道', '片道', '近道'],
    [
      'Đáp án 1 — 「坂道」（さかみち）là đường dốc; phải đi bộ trên dốc khiến người nói mệt.',
      'Dịch: “Từ nhà tôi đến ga là đường dốc nên đi bộ tới ga rất mệt.”',
      '1. 坂道（さかみち）: con đường dốc; hợp với lý do đi bộ thấy mệt.',
      '2. 通り道（とおりみち）: lối/đường đi qua trên hành trình.',
      '3. 片道（かたみち）: một chiều/một lượt đi.',
      '4. 近道（ちかみち）: đường tắt, lối đi ngắn hơn.',
    ]
  ),
  review(
    24,
    3,
    ['帯', '線', '列', '壁'],
    [
      'Đáp án 3 — 「列」（れつ）là hàng người/hàng vật xếp nối tiếp nhau.',
      'Dịch: “Trước cửa hàng này lúc nào cũng có một hàng dài người chờ mở cửa.”',
      '1. 帯（おび・たい）: dải/băng hoặc đai thắt lưng; không phải hàng người.',
      '2. 線（せん）: đường kẻ/đường dây; không diễn tả hàng người đứng đợi.',
      '3. 列（れつ）: hàng/dãy; 「長い列ができる」là hình thành hàng dài.',
      '4. 壁（かべ）: bức tường.',
    ]
  ),
  review(
    25,
    2,
    ['申請', '記録', '予報', '通知'],
    [
      'Đáp án 2 — 「結果をノートに記録する」là ghi kết quả vào sổ để dùng sau này.',
      'Dịch: “Tôi đã ghi kết quả thí nghiệm vào vở để sau này viết báo cáo.”',
      '1. 申請（しんせい）: nộp đơn/đề nghị chính thức.',
      '2. 記録（きろく）: ghi chép hoặc lưu lại kết quả; đúng trong câu.',
      '3. 予報（よほう）: dự báo, như dự báo thời tiết.',
      '4. 通知（つうち）: thông báo/việc báo tin cho người khác.',
    ]
  ),
  review(
    26,
    2,
    ['危険だった', '大変だった', 'つまらなかった', 'やりたくなかった'],
    [
      'Đáp án 2 — 「苦労した」là đã vất vả/gặp nhiều khó khăn; gần nghĩa với 「大変だった」.',
      'Dịch: “Công việc đó thực sự rất vất vả.”',
      '1. 危険だった: đã nguy hiểm; nói về rủi ro, không nhất thiết là sự vất vả.',
      '2. 大変だった: đã vất vả/gian nan; gần nghĩa nhất với 苦労した.',
      '3. つまらなかった: đã nhàm chán/không thú vị.',
      '4. やりたくなかった: đã không muốn làm; nói về mong muốn, không phải mức độ khó khăn.',
    ]
  ),
  review(
    27,
    1,
    ['静かに', 'にぎやかに', '急いで', '二人で'],
    [
      'Đáp án 1 — 「そっと」là khẽ/nhẹ nhàng để không gây tiếng động hoặc chú ý; gần nghĩa với 「静かに」.',
      'Dịch: “Anh Honda và anh Sato rời khỏi phòng thật khẽ.”',
      '1. 静かに（しずかに）: một cách yên lặng/khẽ; phù hợp nhất.',
      '2. にぎやかに: một cách náo nhiệt/ồn ào; trái nghĩa với そっと.',
      '3. 急いで（いそいで）: một cách vội vàng; nói về tốc độ, không phải sự nhẹ nhàng.',
      '4. 二人で（ふたりで）: hai người cùng nhau; nói về số người.',
    ]
  ),
  review(
    28,
    4,
    ['早く起きた', '早く来た', '早く寝た', '早く帰った'],
    [
      'Đáp án 4 — 「早退した」（そうたいした）là rời trường/nơi làm việc sớm hơn giờ thường lệ; gần nghĩa với 「早く帰った」.',
      'Dịch: “Nghe nói hôm qua anh Tanaka đã về sớm.”',
      '1. 早く起きた: đã thức dậy sớm.',
      '2. 早く来た: đã đến sớm.',
      '3. 早く寝た: đã đi ngủ sớm.',
      '4. 早く帰った: đã về/rời đi sớm; gần nghĩa nhất trong các lựa chọn.',
    ]
  ),
  review(
    29,
    4,
    ['待ちました', '続けました', '休ました', '過ぎました'],
    [
      'Đáp án 4 — 「時間が過ぎる」（じかんがすぎる）là thời gian trôi qua; 「一週間くらい過ぎました」gần nghĩa với câu hỏi.',
      'Dịch: “Từ khi tôi đến đây, khoảng một tuần đã trôi qua.”',
      '1. 待ちました（まちました）: đã chờ đợi.',
      '2. 続けました（つづけました）: đã tiếp tục/duy trì.',
      '3. 休ました: văn bản hiện tại thiếu dạng chia chuẩn; nếu ý đề là 「休みました」thì nghĩa là đã nghỉ, vẫn không có nghĩa thời gian trôi qua.',
      '4. 過ぎました（すぎました）: đã trôi qua/vượt quá; đúng với khoảng thời gian.',
    ]
  ),
  review(
    30,
    3,
    ['きれいな', '有名な', 'いろいろな', '特別な'],
    [
      'Đáp án 3 — 「さまざまな」là đa dạng/nhiều loại; gần nghĩa với 「いろいろな」.',
      'Dịch: “Ở cửa hàng này có thể ăn nhiều món khác nhau.”',
      '1. きれいな: đẹp/sạch sẽ.',
      '2. 有名な（ゆうめいな）: nổi tiếng.',
      '3. いろいろな: nhiều loại/đa dạng; gần nghĩa nhất với さまざまな.',
      '4. 特別な（とくべつな）: đặc biệt.',
    ]
  ),
  review(
    31,
    3,
    [
      '弟はサッカーの試合に負けてから、元気が減少している。',
      '気温が減少しているので、今夜は雪が降ると思う。',
      '調査によると、この国の人口は今後減少するそうだ。',
      '今年はりんごの値段が去年より減少したらしい。',
    ],
    [
      'Đáp án 3 — 「減少」（げんしょう）là giảm về số lượng hoặc mức độ, thường đi với 人口・数・量.',
      'Dịch: “Theo khảo sát, dân số nước này sẽ giảm trong thời gian tới.”',
      '1. 元気が減少する: hiểu được nhưng không tự nhiên khi nói một người xuống tinh thần; thường nói 元気がなくなる hoặc 落ち込む.',
      '2. 気温が減少する: nhiệt độ giảm thường nói 気温が下がる・低下する; 減少 thường dùng cho số lượng.',
      '3. 人口が減少する: dân số giảm; kết hợp chuẩn và là đáp án.',
      '4. 値段が減少する: giá giảm thường nói 値段が下がる; số lượng hàng mới dùng 減少する.',
      'Ghi nhớ: số lượng/dân số 減少する; giá và nhiệt độ 下がる; tinh thần sa sút 落ち込む.',
    ]
  ),
  review(
    32,
    4,
    [
      '.子どもたちは重大な顔をして、先生の話を聞いていた。',
      'これは祖母からもらった重大な指輪だ。',
      '外国での一人暮らしは、重大な経験になると思う。',
      '明日、社長から重大な発表があるそうだ。',
    ],
    [
      'Đáp án 4 — 「重大」（じゅうだい）là quan trọng/nghiêm trọng và có ảnh hưởng lớn; thường đi với 発表・問題・事件.',
      'Dịch: “Nghe nói ngày mai giám đốc sẽ có một thông báo quan trọng.”',
      '1. 重大な顔: kết hợp không tự nhiên; vẻ mặt nghiêm túc là 真剣な顔.',
      '2. 重大な指輪: không tự nhiên; chiếc nhẫn được trân trọng là 大切な指輪.',
      '3. 重大な経験: có thể hiểu là trải nghiệm có ý nghĩa lớn, nhưng trong câu này 貴重な経験 (trải nghiệm quý báu) tự nhiên hơn.',
      '4. 重大な発表: thông báo quan trọng/có ảnh hưởng lớn; kết hợp đúng.',
      'Phân biệt: 重大 nhấn mạnh tầm quan trọng/hệ quả; 大切 là thứ được trân trọng; 真剣 là thái độ nghiêm túc; 貴重 là quý giá/hiếm có.',
    ]
  ),
  review(
    33,
    2,
    [
      '冷凍庫に入れるのを忘れて、アイスクリームがばらばらになってしまった。',
      '床に落としてしまい、資料がばらばらになってしまった。',
      'ドアを開けたので、部屋の暖かい空気がばらばらになってしまった。',
      'コップが倒れて、中のジュースがばらばらになってしまった。',
    ],
    [
      'Đáp án 2 — 「ばらばらになる」là các vật rời nhau bị tản ra/lộn xộn; dùng được khi tài liệu rơi văng ra.',
      'Dịch: “Tôi làm rơi tài liệu xuống sàn nên chúng văng tung tóe.”',
      '1. Kem để ngoài tủ lạnh sẽ tan chảy; tự nhiên hơn là 「アイスクリームが溶ける」.',
      '2. Tài liệu rơi xuống sàn và tản ra nhiều phía: 「資料がばらばらになる」dùng đúng.',
      '3. Không khí ấm không tách thành các vật rời; khi mở cửa có thể nói 「暖かい空気が外へ逃げる」.',
      '4. Nước trái cây bị đổ/tràn thì nói 「ジュースがこぼれる」, không nói ばらばらになる.',
      'Ghi nhớ: đồ vật rời bị tản ra là ばらばら; chất lỏng đổ là こぼれる; kem tan là 溶ける.',
    ]
  ),
  review(
    34,
    1,
    [
      'じゃがいもは皮をむかないで、そのままゆでます。',
      '机におちていて、パソコンの皮に傷がついてしまった。',
      '割った卵の皮はここに捨ててください。',
      'テキストの皮に名前が書いてあるので、誰の物かわかります。',
    ],
    [
      'Đáp án 1 — 「皮」（かわ）là lớp vỏ mềm bên ngoài của rau củ/quả; 「皮をむく」là gọt vỏ.',
      'Dịch: “Tôi luộc khoai tây nguyên như vậy, không gọt vỏ.”',
      '1. Khoai tây có thể được luộc nguyên vỏ; 「皮をむかない」dùng đúng.',
      '2. Vỏ ngoài của máy tính thường gọi là カバー hoặc 外装, không gọi là 皮.',
      '3. Vỏ cứng của trứng gọi là 「殻」（から）, không phải 皮.',
      '4. Bìa sách/tài liệu gọi là 「表紙」（ひょうし）, không phải 皮.',
      'Phân biệt: 皮 là vỏ mềm của rau quả; 殻 là vỏ cứng như trứng; 表紙 là bìa sách; máy móc có カバー・外装.',
    ]
  ),
  review(
    35,
    3,
    [
      '健康のため、毎日運動をするように医者からオーダーされた。',
      '母は妹に部屋の掃除をオーダーした。',
      'レストランで食事の後にデザートをオーダーした。',
      '次の大会で必ず優勝してほしいと選手たちにオーダーした。',
    ],
    [
      'Đáp án 3 — 「オーダーする」là gọi/đặt món hoặc đặt hàng; ở nhà hàng có thể gọi món tráng miệng.',
      'Dịch: “Sau bữa ăn, tôi đã gọi món tráng miệng ở nhà hàng.”',
      '1. 「医者からオーダーされた」nghe như bị bác sĩ ra lệnh; bác sĩ khuyên tập thể dục thường dùng 指示された・勧められた.',
      '2. Nhờ em gái dọn phòng nên dùng 頼んだ hoặc 指示した; オーダーする không tự nhiên cho yêu cầu trong gia đình.',
      '3. Gọi món tráng miệng ở nhà hàng: オーダーする dùng đúng.',
      '4. Mong vận động viên vô địch nên dùng 期待する・伝える; オーダーする không diễn tả kỳ vọng đó.',
      'Phân biệt: gọi món/đặt hàng オーダーする; nhờ ai làm 頼む; chỉ thị 指示する; kỳ vọng 期待する.',
    ]
  ),
]

const normalizeOption = (value) =>
  String(value || '')
    .normalize('NFKC')
    .replace(/^\s*[1-4][.)．、]\s*/u, '')
    .replace(/^\s*[1-4]\s+/u, '')
    .replace(/\s+/gu, '')

if (reviews.length !== 35 || new Set(reviews.map((row) => row.number)).size !== 35) {
  throw new Error('The review must cover each of the 35 vocabulary questions exactly once.')
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
    throw new Error('Question ' + row.number + ' answer key changed; review the key before applying explanations.')
  }
  if (JSON.stringify(question.options.map(normalizeOption)) !== JSON.stringify(row.options.map(normalizeOption))) {
    throw new Error('Question ' + row.number + ' options changed; re-check this review against the current source.')
  }
  question.explanation = row.explanation
  curated[question.id] = row.explanation
}

const report = {
  generatedAt: new Date().toISOString(),
  examId,
  section: 'Từ vựng',
  reviewedQuestionCount: reviews.length,
  reviewedChoiceCount: reviews.length * 4,
  answerKeysChanged: 0,
  method:
    'Manually reviewed the stored Japanese prompts and choices, translated each prompt, explained the correct word or reading, and added a concise meaning/use note for every option. Existing local dictionary entries were checked where available; misleading or missing automatic glosses were replaced with contextual Vietnamese. This pass did not compare the source exam PDF or independently certify an official answer key.',
  sourceLimits: {
    originalQuestionPdfVisuallyInspectedThisPass: false,
    officialAnswerKeyConfirmed: false,
    unresolvedTranscriptionNotes: [
      'Question 10 stores 胸が燃える with the smoke vocabulary item; its odd wording is preserved and disclosed rather than silently corrected.',
      'Question 29 option 3 is stored as 休ました; the explanation notes the malformed form and does not silently substitute 休みました.',
    ],
  },
  rows: reviews.map(({ number, answer, options, explanation }) => ({
    number,
    answer,
    options,
    explanation,
    allFourChoicesExplained: true,
    promptTranslated: true,
  })),
  verdict:
    'All 35 vocabulary questions now have a Vietnamese prompt translation and four numbered option notes. This is an explanation-content review of the current stored exam text; it does not certify the original paper transcription or an official JLPT key.',
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
      optionNotes: reviews.length * 4,
      answerKeysChanged: 0,
      reportPath: apply ? reportPath : undefined,
    },
    null,
    2
  )
)
