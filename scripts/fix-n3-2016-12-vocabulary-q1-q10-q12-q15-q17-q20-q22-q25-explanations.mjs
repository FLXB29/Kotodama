import fs from 'node:fs'
import path from 'node:path'

const masterPath = path.resolve('data/jlpt_n3_toan_master.json')
const curatedPath = path.resolve('data/jlpt_n3_explanations_curated.json')
const reportPath = path.resolve('reports/n3-quality-audit/vocabulary-source-2016-12-q1-q25-review.json')
const master = JSON.parse(fs.readFileSync(masterPath, 'utf8'))
const curated = JSON.parse(fs.readFileSync(curatedPath, 'utf8'))
const exam = master.find((item) => item.id === 'toan-n3-201612-full')
if (!exam) throw new Error('Could not find N3 December 2016 full exam.')

const languageCheckedKey = [
  4, 2, 1, 3, 2, 4, 3, 1, 4, 3, 3, 2, 1, 4, 2, 4, 1, 3, 1, 3, 2, 4, 4, 1, 2, 4, 1, 3, 1, 2, 3, 2, 2, 1, 3,
]
const publicTableKey = [
  3, 2, 1, 3, 2, 4, 3, 1, 4, 3, 3, 2, 1, 4, 2, 4, 1, 3, 1, 3, 2, 4, 4, 1, 2, 4, 1, 3, 1, 2, 3, 2, 2, 1, 3,
]
const expectedOptions = {
  1: ['けんぎゃく', 'かんぎゃく', 'けんきゃく', 'かんきゃく'],
  2: ['くばって', 'はらって', 'かざって', 'ひろって'],
  3: ['とうちゃく', 'とうつく', 'とちゃく', 'とつく'],
  4: ['つたえました', 'おえました', 'くわえました', 'かえました'],
  5: ['くんれい', 'くんれん', 'ぐんれい', 'ぐんれん'],
  6: ['こな', 'いも', 'かい', 'まめ'],
  7: ['きょうつ', 'こうつう', 'きょうつう', 'こうつ'],
  8: ['ぜいきん', 'ぜっきん', 'せいきん', 'せっきん'],
  9: ['池', '湖', '港', '波'],
  10: ['軽く', '急く', '速く', '進く'],
  11: ['満続', '万続', '満足', '万足'],
  12: ['接んで', '組んで', '折んで', '結んで'],
  13: ['輸出', '諭出', '輪出', '論出'],
  14: ['寝って', '宿って', '眼って', '眠って'],
  15: ['実力', '特長', '専門', '主張'],
  16: ['ヒント', 'タイトル', 'アイディア', 'イメージ'],
  17: ['囲み', '通し', '包み', '越え'],
  18: ['ふらふら', 'ぐっすり', 'がらがら', 'うっかり'],
  19: ['うわさ', '宣伝', 'うそ', '冗談'],
  20: ['従って', '守って', '許して', '抑えて'],
  21: ['様子', '姿勢', '印象', '間隔'],
  22: ['くりかえして', '気にして', '見つめて', 'たしかめて'],
  23: ['自然', '資源', '作物', '農業'],
  24: ['しずんで', 'ころんで', 'たおれて', 'おぼれて'],
  25: ['裏側', '内緒', '後方', '中身'],
  26: ['止まって', '揺れて', '汚れて', '光って'],
  27: ['残念だと思った', 'うれしかった', '驚いた', '安心した'],
  28: ['いろいろ', '少し', 'もちろん', 'いつも'],
  29: ['多すぎて残りました', '少し足りませんでした', 'とてもおいしかったです', 'そんなにおいしくなかったです'],
  30: ['座ってはいけません', '渡ってはいけません', '走ってはいけません', '入ってはいけません'],
  31: [
    'この料理は電子レンジを使って急にできるので、とても簡単だ。',
    'あと 10 分で電車が出発してしまうので、急に駅に向かった',
    '部屋から急に人が飛び出してきたので、ぶつかりそうになった',
    '新しいゲームを買ったので、家に帰って急にやってみた',
  ],
  32: [
    '今日は朝からどんどん暑くなり、昼には気温が沸騰した',
    '鍋のお湯が沸騰したら、とうふを入れて火を少し弱くしてください',
    '昼ごろから具合が悪くなり、夕方熱が沸騰したので病院へ行った',
    'このストーブは沸騰するのが早いので、すぐに部屋が暖かくなる',
  ],
  33: [
    '今朝は寒かったので、マフラーを首にまげて出かけた',
    'けがは良くなったが、腕を伸ばしたりまげたりすると、まだ少し痛む',
    '一つのパンを半分にまげて、二人で分けて食べた',
    'シャツをきちんとまげたら、たんすの引き出しにしまってください',
  ],
  34: [
    '営業のため、来週一週間、課長とアメリカに出張します',
    '仕事を辞めたら、家族とゆっくり海外に出張したいと思う',
    'わたしは毎朝 9 時に会社に出張し、残業はしないで家に帰る',
    'あしたは子どもの運動会に出張するので、仕事を休みます',
  ],
  35: [
    '祖母は古い物でも捨てないで、長い間慰めて使っている',
    '試合を見ながら、優勝を願って一生懸命選手を慰めた',
    '仕事で失敗してしまったが、友人が慰めてくれたので元気が出た',
    '弟が希望の大学に合格したので、家族で外食をして慰めた',
  ],
}

const explanations = {
  1: [
    'Đáp án 4: 「観客」đọc là かんきゃく, nghĩa là khán giả/người xem.',
    '1. けんぎゃく — sai âm đầu của 観 và âm 客; không phải cách đọc chuẩn.',
    '2. かんぎゃく — âm 観 đúng nhưng 客 phải đọc きゃく, không phải ぎゃく.',
    '3. けんきゃく — âm 客 đúng nhưng 観 phải đọc かん, không phải けん.',
    '4. かんきゃく — đúng cách đọc của 観客.',
    'Dịch: “Ở hội trường có rất đông khán giả.” Ghi nhớ: 観客（かんきゃく）= khán giả; các lựa chọn kana còn lại là cách đọc sai của cùng chữ, không phải từ riêng để dịch.',
  ].join('\n'),
  2: [
    'Đáp án 2: 「払って」đọc là はらって, thể て của 払う（はらう）, nghĩa là trả tiền/thanh toán.',
    '1. くばって — cách đọc của 配って, “phân phát”; không phải 払って.',
    '2. はらって — đúng cách đọc; 払ってくれる nghĩa là trả giúp.',
    '3. かざって — cách đọc của 飾って, “trang trí”.',
    '4. ひろって — cách đọc của 拾って, “nhặt lên”.',
    'Dịch: “Anh/chị Tamura đã trả tiền giúp tôi.”',
  ].join('\n'),
  3: [
    'Đáp án 1: 「到着」đọc là とうちゃく, nghĩa là đến nơi/sự đến nơi.',
    '1. とうちゃく — đúng cách đọc của 到着.',
    '2. とうつく — đọc sai chữ 着; âm chuẩn trong từ này là ちゃく.',
    '3. とちゃく — thiếu âm dài う trong 到（とう）.',
    '4. とつく — đọc sai cả 到着; không phải cách đọc とうちゃく.',
    'Dịch: “Tôi sẽ đến khách sạn vào khoảng 3 giờ.”',
  ].join('\n'),
  4: [
    'Đáp án 3: 「加えました」đọc là くわえました; 加える nghĩa là thêm/bổ sung.',
    '1. つたえました — “đã truyền đạt”; thường viết 伝えました.',
    '2. おえました — “đã kết thúc”; thường viết 終えました.',
    '3. くわえました — đúng cách đọc; 説明を加える là bổ sung lời giải thích.',
    '4. かえました — có thể là “đã thay đổi/đổi” (変えました), không phải cách đọc của 加えました.',
    'Dịch: “Anh/chị Yamashita đã bổ sung lời giải thích.”',
  ].join('\n'),
  5: [
    'Đáp án 2: 「訓練」đọc là くんれん, nghĩa là huấn luyện/luyện tập.',
    '1. くんれい — sai âm cuối: 練 đọc れん.',
    '2. くんれん — đúng cách đọc 訓練.',
    '3. ぐんれい — sai cả âm đầu 訓（くん）và âm cuối 練（れん）.',
    '4. ぐんれん — sai âm đầu; 訓 đọc くん, không đọc ぐん.',
    'Dịch: “Bây giờ chúng ta sẽ tiến hành huấn luyện.”',
  ].join('\n'),
  6: [
    'Đáp án 4: 「豆」đọc là まめ, nghĩa là đậu/hạt đậu; phù hợp với nguyên liệu cho súp.',
    '1. こな — “bột” (粉), không phải cách đọc 豆.',
    '2. いも — “khoai” (芋), không phải cách đọc 豆.',
    '3. かい — có thể là 貝 “sò/ốc”, không phải cách đọc 豆.',
    '4. まめ — đúng cách đọc của 豆.',
    'Dịch: “Loại đậu này dùng nấu súp thì ngon đấy.”',
  ].join('\n'),
  7: [
    'Đáp án 3: 「共通」đọc là きょうつう, nghĩa là chung/được chia sẻ giữa nhiều người hoặc vật.',
    '1. きょうつ — thiếu âm う cuối trong 通（つう）.',
    '2. こうつう — đọc thành 交通（こうつう, giao thông）, không phải 共通.',
    '3. きょうつう — đúng cách đọc 共通.',
    '4. こうつ — sai âm đầu và thiếu âm dài ở 通.',
    'Dịch: “Trong xã hội có những quy tắc chung.”',
  ].join('\n'),
  8: [
    'Đáp án 1: 「税金」đọc là ぜいきん, nghĩa là thuế/tiền thuế.',
    '1. ぜいきん — đúng cách đọc 税金.',
    '2. ぜっきん — sai âm của 税; đọc là ぜい, không phải ぜっ.',
    '3. せいきん — 税 đọc ぜい, không phải せい.',
    '4. せっきん — sai cả âm đầu của 税 và cách kéo dài âm.',
    'Dịch: “Nghe nói từ năm sau thuế sẽ tăng.”',
  ].join('\n'),
  9: [
    'Đáp án 4: 「なみ」được viết là 波, nghĩa là sóng.',
    '1. 池（いけ）— ao; không phải sóng.',
    '2. 湖（みずうみ）— hồ; không phải sóng.',
    '3. 港（みなと）— cảng/bến cảng; không phải sóng.',
    '4. 波（なみ）— sóng; đúng với câu.',
    'Dịch: “Tôi đã ngắm những con sóng đẹp một lúc.”',
  ].join('\n'),
  10: [
    'Đáp án 3: Trong 「もう少しはやく歩く」, はやく nói về tốc độ nên viết 速く.',
    '1. 軽く（かるく）— nhẹ nhàng/nhẹ; không có nghĩa đi nhanh hơn.',
    '2. 急く（せく）— vội/vội vàng; không phải cách viết はやく trong câu này.',
    '3. 速く（はやく）— nhanh về tốc độ; đúng với 歩く.',
    '4. 進く — không phải cách viết chuẩn cho はやく; 進む（すすむ）là tiến lên.',
    'Dịch: “Chúng ta hãy đi bộ nhanh hơn một chút.”',
  ].join('\n'),
  12: [
    'Đáp án 2: 「腕を組む」（うでをくむ）là khoanh/đan hai tay.',
    '1. 接んで — 接ぐ（つぐ）nghĩa là nối/gắn; không đọc là くむ và không tạo cụm này.',
    '2. 組んで — đúng chữ 組む（くむ）; 腕を組む là khoanh tay.',
    '3. 折んで — 折る（おる）là gấp/bẻ; cách viết và cách đọc không khớp.',
    '4. 結んで — 結ぶ（むすぶ）là buộc/thắt; không dùng với 腕 trong nghĩa khoanh tay.',
    'Dịch: “Bố khoanh tay và đang suy nghĩ điều gì đó.”',
  ].join('\n'),
  13: [
    'Đáp án 1: 「輸出」（ゆしゅつ）nghĩa là xuất khẩu.',
    '1. 輸出 — đúng từ chỉ việc đưa hàng hóa ra nước ngoài.',
    '2. 諭出 — 諭 mang nghĩa khuyên bảo; cách ghép này không viết từ ゆしゅつ.',
    '3. 輪出 — 輪 nghĩa là vòng/bánh xe; không phải chữ 輸 trong 輸出.',
    '4. 論出 — 論 là bàn luận/lý lẽ; không tạo thành từ này.',
    'Dịch: “Nước này chủ yếu xuất khẩu gạo.”',
  ].join('\n'),
  14: [
    'Đáp án 4: 「眠って」là thể て của 眠る（ねむる）, nghĩa là ngủ.',
    '1. 寝って — 寝る（ねる）chuyển thành 寝て, không phải 寝って.',
    '2. 宿って — dạng của 宿る（やどる）, nghĩa là trú/ngụ; không phải ngủ trong câu này.',
    '3. 眼って — 眼 là chữ chỉ mắt, không phải động từ đọc ねむる.',
    '4. 眠って — đúng cách viết và dạng chia của 眠る.',
    'Dịch: “Em bé đang ngủ trong vòng tay mẹ.”',
  ].join('\n'),
  15: [
    'Đáp án 2: 「特長」là đặc điểm nổi bật/ưu điểm; giấy khó rách khi ướt là một đặc tính của nó.',
    '1. 実力 — năng lực thực tế; không phải thuộc tính của tờ giấy.',
    '2. 特長 — đặc điểm nổi bật; hợp với thông tin giới thiệu loại giấy.',
    '3. 専門 — chuyên môn/lĩnh vực chuyên sâu; không phù hợp cấu trúc và ý.',
    '4. 主張 — ý kiến/lập luận được khẳng định; không phải đặc tính của sản phẩm.',
    'Dịch: “Loại giấy này có đặc tính là dù bị ướt cũng khó rách.”',
  ].join('\n'),
  16: [
    'Đáp án 4: 「イメージ」là hình dung/ấn tượng về một người; câu nói mọi người có ấn tượng anh Sato trầm tính dù anh ấy có vẻ năng động.',
    '1. ヒント — gợi ý/manh mối; không phải ấn tượng về tính cách.',
    '2. タイトル — tiêu đề/tên tác phẩm; không dùng để nói người khác có hình dung gì về một người.',
    '3. アイディア — ý tưởng; nói về suy nghĩ hoặc kế hoạch, không phải ấn tượng.',
    '4. イメージ — hình dung/ấn tượng; phù hợp với mẫu 「おとなしいイメージがある」.',
    'Dịch: “Mọi người có ấn tượng anh Sato là người trầm tính, nhưng thực ra anh ấy có vẻ năng động.”',
  ].join('\n'),
  17: [
    'Đáp án 1: 「テーブルを囲む」là quây quần/ngồi quanh bàn.',
    '1. 囲み — 囲む（かこむ）nghĩa là vây quanh; kết hợp tự nhiên với テーブル.',
    '2. 通し — 通す（とおす）là cho đi qua/xuyên qua; không dùng theo nghĩa quây bàn ăn.',
    '3. 包み — 包む（つつむ）là bọc/gói; không phù hợp với テーブルを…食事する.',
    '4. 越え — 越える（こえる）là vượt qua; không diễn tả mọi người ngồi quanh bàn.',
    'Dịch: “Vào dịp Tết, họ hàng tụ họp, mọi người quây quần quanh bàn và ăn uống vui vẻ.”',
  ].join('\n'),
  18: [
    'Đáp án 3: 「がらがら」miêu tả nơi vắng người, gần như trống không.',
    '1. ふらふら — loạng choạng/chóng mặt; thường tả người đi đứng không vững.',
    '2. ぐっすり — ngủ say; thường dùng với 眠る, không tả số khách trong nhà hàng.',
    '3. がらがら — vắng khách/trống không khi nói về 店内; đúng vì món ăn không ngon.',
    '4. うっかり — lơ đãng/vô ý; không diễn tả mức độ đông khách.',
    'Dịch: “Vì món ăn nhà hàng này không ngon nên bên trong lúc nào cũng vắng khách.”',
  ].join('\n'),
  19: [
    'Đáp án 1: 「うわさ」là tin đồn/tin truyền miệng; người nói chưa biết việc chuyển nhà có thật không.',
    '1. うわさ — tin đồn; đúng với câu hỏi 本当かどうか気になる.',
    '2. 宣伝（せんでん）— quảng cáo/tuyên truyền; thường nhằm giới thiệu sản phẩm hay sự kiện.',
    '3. うそ — lời nói dối; câu không khẳng định ai đó cố ý nói dối.',
    '4. 冗談（じょうだん）— lời nói đùa; không hợp với thông tin đang cần xác minh.',
    'Dịch: “Tôi nghe tin đồn anh Takada sẽ chuyển nhà và đang băn khoăn không biết có thật không.”',
  ].join('\n'),
  20: [
    'Đáp án 3: 「許す」（ゆるす）nghĩa là tha thứ; phù hợp với việc người cha phản ứng sau lời xin lỗi.',
    '1. 従う（したがう）— làm theo/tuân theo; không nói người cha tha thứ.',
    '2. 守る（まもる）— bảo vệ/giữ (quy tắc, lời hứa); không phù hợp với lời xin lỗi.',
    '3. 許す（ゆるす）— tha thứ/cho phép; ở đây là tha thứ cho việc làm mất sách.',
    '4. 抑える（おさえる）— kìm/nén/kiềm chế; không phải tha thứ.',
    'Dịch: “Tôi xin lỗi vì làm mất cuốn sách mượn của bố; bố đã tha thứ cho tôi ngay.”',
  ].join('\n'),
  21: [
    'Đáp án 2: 「姿勢」（しせい）là tư thế; 「同じ姿勢でいる」nghĩa là giữ nguyên một tư thế.',
    '1. 様子（ようす）— trạng thái/diện mạo; không chỉ vị trí cơ thể khi ngồi lâu.',
    '2. 姿勢 — tư thế; đúng với việc ở trước máy tính lâu khiến cơ thể đau.',
    '3. 印象（いんしょう）— ấn tượng; không phải tư thế cơ thể.',
    '4. 間隔（かんかく）— khoảng cách/khoảng thời gian; không phù hợp với 「同じ…でいる」ở đây.',
    'Dịch: “Tôi giữ nguyên một tư thế trước máy tính suốt nên cơ thể bị đau.”',
  ].join('\n'),
  22: [
    'Đáp án 4: 「確かめる」（たしかめる）là kiểm tra/xác nhận lại xem thông tin có đúng không.',
    '1. くりかえす — lặp lại; không có nghĩa rà soát lỗi trong đơn.',
    '2. 気にする — bận tâm/để ý; không diễn tả việc kiểm tra cụ thể.',
    '3. 見つめる — nhìn chăm chú; không thể hiện việc xác nhận nội dung đơn.',
    '4. 確かめる — kiểm tra/xác nhận; đúng với việc xem đơn có sai sót không.',
    'Dịch: “Tôi kiểm tra kỹ xem đơn đăng ký có lỗi không rồi mới nộp ở quầy tiếp nhận.”',
  ].join('\n'),
  23: [
    'Đáp án 4: 「農業」（のうぎょう）là nông nghiệp; việc trồng gạo và rau cho biết quê nhà phát triển nông nghiệp.',
    '1. 自然（しぜん）— thiên nhiên; không gọi hoạt động trồng trọt là 自然.',
    '2. 資源（しげん）— tài nguyên; không khớp với việc sản xuất nông sản.',
    '3. 作物（さくもつ）— cây trồng/nông sản; không tự nhiên trong mẫu 「作物が盛ん」.',
    '4. 農業 — nông nghiệp; kết hợp tự nhiên với 「盛ん」và nội dung trồng gạo, rau.',
    'Dịch: “Quê tôi phát triển nông nghiệp, trồng nhiều gạo và rau.”',
  ].join('\n'),
  24: [
    'Đáp án 1: 「沈む」（しずむ）nghĩa là chìm xuống dưới mặt nước.',
    '1. 沈んで — chìm xuống; đúng với chiếc lá đang nổi rồi chìm.',
    '2. 転んで（ころんで）— vấp/ngã; thường dùng cho người hoặc vật bị lật, không phải chiếc lá chìm trong nước.',
    '3. 倒れて（たおれて）— đổ/ngã; không diễn tả chuyển động chìm xuống nước.',
    '4. 溺れて（おぼれて）— chết đuối/ngạt nước; thường nói về sinh vật bị chìm, không hợp với chiếc lá.',
    'Dịch: “Chiếc lá nổi trên mặt nước, một lúc sau đã chìm xuống nước.”',
  ].join('\n'),
  25: [
    'Đáp án 2: 「内緒」（ないしょ）là chuyện bí mật/giữ kín; câu nói không kể với bất kỳ ai.',
    '1. 裏側（うらがわ）— mặt sau/phía bên kia; không nói về việc giữ kín thông tin.',
    '2. 内緒 — bí mật; đúng trong cụm 「内緒にしていた」= đã giữ kín.',
    '3. 後方（こうほう）— phía sau/đằng sau; chỉ vị trí.',
    '4. 中身（なかみ）— phần bên trong/nội dung; không có nghĩa bí mật.',
    'Dịch: “Tôi đã giữ kín chuyện này suốt thời gian dài, không nói với ai.”',
  ].join('\n'),
}

const editedNumbers = Object.keys(explanations).map(Number)
const questions = exam.parts.flatMap((part) => part.questions || []).filter((question) => question.number <= 35)
if (questions.length !== 35) throw new Error('Expected all 35 vocabulary questions in the full exam.')
for (const question of questions) {
  const number = Number(question.number)
  const options = question.options.map((option) =>
    String(option)
      .replace(/^\s*[1-4][.．、\s　]*/u, '')
      .trim()
  )
  if (Number(question.correctAnswer ?? question.answer) !== languageCheckedKey[number - 1]) {
    throw new Error('Answer key mismatch at vocabulary question ' + number + '; refusing to write explanations.')
  }
  if (options.join('|') !== expectedOptions[number].join('|')) {
    throw new Error('Unexpected source options at vocabulary question ' + number + '; refusing to write explanations.')
  }
  if (explanations[number]) {
    question.explanation = explanations[number]
    curated[question.id] = explanations[number]
  }
}

fs.writeFileSync(masterPath, JSON.stringify(master, null, 2) + '\n', 'utf8')
fs.writeFileSync(curatedPath, JSON.stringify(curated, null, 2) + '\n', 'utf8')
const report = {
  generatedAt: new Date().toISOString(),
  examId: exam.id,
  section: 'vocabulary M1 questions 1–35',
  questionSource: {
    file: '7. N3 12-2016.pdf',
    driveUrl: 'https://drive.google.com/file/d/1ZPZIPaDo5BrgR-n0h5XUcpCOXR73Riz7/view',
    printedPages: [1, 2, 3],
    visuallyComparedInChrome: true,
    promptAndOptionCount: { questions: 35, options: 140 },
  },
  answerKeyReference: {
    title: 'Đáp án kỳ thi JLPT tháng 12 năm 2016',
    url: 'https://chuyenngoaingu.com/news/dap-an-ky-thi-jlpt-thang-12-nam-2016-201.aspx',
    type: 'public secondary answer-key table; not an official JLPT document',
    matchedQuestions: 34,
    totalQuestions: 35,
    answerSequence: publicTableKey,
  },
  answerKeysMatchReference: {
    matchedCount: 34,
    totalCount: 35,
    mismatch: {
      questionNumber: 1,
      localAndLanguageCheckedAnswer: 4,
      publicTableAnswer: 3,
      resolution:
        'The PDF orders かんきゃく as choice 4, and an independent solution page gives the reading 観客（かんきゃく）. The table entry 3 conflicts with that reading, so answer 4 is retained and the discrepancy is disclosed.',
    },
  },
  editedQuestionNumbers: editedNumbers,
  previouslyReviewedQuestionNumbers: [11, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35],
  explanationCriteria: {
    contextualMeaningForCorrectWord: true,
    everyOptionExplained: true,
    fullVietnameseSentenceTranslation: true,
    misleadingLocalDictionaryMatchesRemovedFromEditedItems: true,
  },
  limitation:
    'The question text and options were visually checked against the Drive PDF. Thirty-four stored keys match the public secondary table. For question 1, the table conflicts with the reading かんきゃく printed as choice 4 and corroborated by an independent solution page, so the stored language-checked answer 4 is retained and the table discrepancy is disclosed. No official JLPT answer key was available for this review.',
}
fs.mkdirSync(path.dirname(reportPath), { recursive: true })
fs.writeFileSync(reportPath, JSON.stringify(report, null, 2) + '\n', 'utf8')
console.log(
  'Updated ' +
    editedNumbers.length +
    ' vocabulary explanations; 34 of 35 keys match the public reference table, with its question 1 discrepancy documented.'
)
