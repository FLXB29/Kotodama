import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'

const root = path.resolve('.')
const masterPath = path.join(root, 'data/jlpt_n3_toan_master.json')
const curatedPath = path.join(root, 'data/jlpt_n3_explanations_curated.json')
const reportPath = path.join(root, 'reports/n3-quality-audit/vocabulary-2013-12-reading-review.json')
const examSource = 'https://www.vnjpclub.com/de-thi-chinh-thuc-jlpt-n3/de-thi-jlpt-n3-12-2013-moji-goi.html'
const answerSource = 'https://max.book118.com/html/2021/0822/6221052015003235.shtm'
const answerKeyPath = path.join(root, 'reports/n3-quality-audit/answer-key-2013-12.json')

const exams = JSON.parse(fs.readFileSync(masterPath, 'utf8'))
const curated = JSON.parse(fs.readFileSync(curatedPath, 'utf8'))
const exam = exams.find((item) => item.id === 'toan-n3-201312-full')
assert.ok(exam, 'Missing JLPT N3 12/2013 exam')
const questions = new Map(exam.parts.flatMap((part) => part.questions).map((question) => [question.id, question]))
const answerKey = [1, 4, 2, 1, 3, 4, 1, 3, 2, 3, 4, 1, 4, 1, 2, 3, 4, 1, 2, 4, 3, 2, 1, 1, 3, 2, 2, 1, 4, 3]
const answerGroups = JSON.parse(fs.readFileSync(answerKeyPath, 'utf8')).groups
const localAnswerKey = [...answerGroups[0], ...answerGroups[1], ...answerGroups[2], ...answerGroups[3]]
assert.deepEqual(localAnswerKey, answerKey, 'Local answer-key transcription differs')

const explanations = {
  toan_q_2013_12_1: [
    'Đáp án 1 — 生えた（はえた）là dạng quá khứ của 生える, “mọc lên”. Dịch: “Những bông hoa đẹp đã nở trên đám cỏ mọc trong vườn.”',
    '1. はえた là cách đọc đúng của 生えた.',
    '2. せいえた không phải cách đọc của 生えた.',
    '3. しょうえた không phải cách đọc của 生えた.',
    '4. うえた thường viết 植えた, “đã trồng”. 植える là chủ động đem cây trồng xuống đất; 生える là tự mọc lên.',
    'Ghi nhớ: 草が生える = cỏ mọc; 草を植える = trồng cỏ.',
  ].join('\n'),
  toan_q_2013_12_2: [
    'Đáp án 4 — 各地（かくち）nghĩa là nhiều nơi/các địa phương. Dịch: “Tuần này có nhiều lễ hội ở khắp các nơi.”',
    '1. かっじ không phải cách đọc của 各地.',
    '2. かっち không phải cách đọc của 各地.',
    '3. かくじ có thể là 各自（かくじ）, “mỗi người/từng người”; 地 ở đây phải đọc ち.',
    '4. かくち là cách đọc đúng của 各地.',
    'Ghi nhớ: 各地（かくち）= các địa phương; 各自（かくじ）= mỗi người tự mình.',
  ].join('\n'),
  toan_q_2013_12_3: [
    'Đáp án 2 — 貯金（ちょきん）là tiền tiết kiệm. Dịch: “Tôi không biết mình có bao nhiêu tiền tiết kiệm.”',
    '1. だいきん thường viết 代金, tiền phải trả/giá hàng hóa.',
    '2. ちょきん là cách đọc đúng của 貯金.',
    '3. げんきん thường viết 現金, tiền mặt.',
    '4. ぜいきん thường viết 税金, tiền thuế.',
    'Ghi nhớ: 貯金 = tiền tiết kiệm; 現金 = tiền mặt; 税金 = thuế; 代金 = tiền hàng.',
  ].join('\n'),
  toan_q_2013_12_4: [
    'Đáp án 1 — 留守（るす）là tình trạng vắng nhà. Dịch: “Có vẻ nhà hàng xóm đang không có ai ở nhà.”',
    '1. るす là cách đọc đúng của 留守.',
    '2. りゅうす không phải cách đọc của 留守.',
    '3. るしゅ không phải cách đọc của 留守; âm cuối của từ là す.',
    '4. りゅうしゅ không phải cách đọc của 留守.',
    'Ghi nhớ: 留守（るす）= vắng nhà; 留守番（るすばん）= trông nhà khi người khác đi vắng.',
  ].join('\n'),
  toan_q_2013_12_5: [
    'Đáp án 3 — 浅い（あさい）là nông/cạn. Dịch: “Có chiếc đĩa nào nông hơn một chút không?”',
    '1. ふかい thường viết 深い, “sâu”; trái nghĩa với 浅い.',
    '2. あつい thường viết 厚い, “dày”; không phải cách đọc của 浅い.',
    '3. あさい là cách đọc đúng của 浅い.',
    '4. うすい thường viết 薄い, “mỏng”; không phải cách đọc của 浅い.',
    'Ghi nhớ: 浅い（あさい）= nông; 深い（ふかい）= sâu; 薄い（うすい）= mỏng.',
  ].join('\n'),
  toan_q_2013_12_6: [
    'Đáp án 4 — 文章（ぶんしょう）là bài viết/đoạn văn. Dịch: “Bài viết này dài và khó hiểu.”',
    '1. ぶんそ không phải cách đọc chuẩn của 文章.',
    '2. ぶんしょ thường viết 文書, nghĩa là văn bản/tài liệu; là từ khác.',
    '3. ぶんそう không phải cách đọc chuẩn của 文章.',
    '4. ぶんしょう là cách đọc đúng của 文章.',
    'Ghi nhớ: 文章（ぶんしょう）= bài viết/văn xuôi; 文書（ぶんしょ）= văn bản/tài liệu.',
  ].join('\n'),
  toan_q_2013_12_7: [
    'Đáp án 1 — 改札（かいさつ）là cổng/khu soát vé ở ga. Dịch: “Tôi đang đợi ở trước cổng soát vé.”',
    '1. かいさつ là cách đọc đúng của 改札.',
    '2. かいじょう thường viết 会場, địa điểm tổ chức sự kiện; không phải cổng soát vé.',
    '3. けいさつ thường viết 警察, cảnh sát; là từ khác.',
    '4. けいじょう thường viết 形状, hình dạng/trạng thái hình thể; là từ khác.',
    'Ghi nhớ: 改札（かいさつ）= cổng soát vé; 会場（かいじょう）= địa điểm; 警察（けいさつ）= cảnh sát.',
  ].join('\n'),
  toan_q_2013_12_8: [
    'Đáp án 3 — 笑って（わらって）là thể て của 笑う, “cười”. Dịch: “Khi tôi kể chuyện đó, cô ấy đã cười.”',
    '1. こまって thường viết 困って, “lúng túng/gặp khó khăn”.',
    '2. おこって thường viết 怒って, “đang giận”.',
    '3. わらって là cách đọc đúng của 笑って.',
    '4. うたがって thường viết 疑って, “đang nghi ngờ”.',
    'Ghi nhớ: 笑う（わらう）= cười; 困る（こまる）= lúng túng; 怒る（おこる）= giận; 疑う（うたがう）= nghi ngờ.',
  ].join('\n'),
  toan_q_2013_12_9: [
    'Đáp án 2 — 倍（ばい）chỉ số lần/gấp bội; ２倍 là gấp đôi. Dịch: “Lượng gạo xuất khẩu đã gấp đôi năm ngoái.”',
    '1. 培 có âm バイ trong từ như 培養（ばいよう, nuôi cấy/bồi dưỡng） và mang nghĩa vun trồng; không phải chữ chỉ số lần.',
    '2. 倍（ばい）là chữ cần điền trong ２倍, nghĩa là gấp hai.',
    '3. 増 thường đọc ゾウ hoặc ふえる, nghĩa là tăng; không viết ２ばい.',
    '4. 憎 đọc ゾウ／にくむ, liên quan đến ghét; không mang nghĩa “lần”.',
    'Ghi nhớ: 倍 = số lần; 増える = tăng lên; 培う = vun đắp/nuôi dưỡng.',
  ].join('\n'),
  toan_q_2013_12_10: [
    'Đáp án 3 — 停電（ていでん）là sự mất điện/cúp điện. Dịch: “Chiều qua, khu vực này đã bị mất điện.”',
    '1. 止電 không phải cách viết thông dụng của “mất điện”; 止める／停止 diễn tả dừng lại.',
    '2. 落電 không phải từ chuẩn ở nghĩa này; 落雷（らくらい）mới là sét đánh.',
    '3. 停電（ていでん）là cách viết đúng của ていでん, chỉ tình trạng nguồn điện bị ngắt.',
    '4. 閉電 không phải cách viết chuẩn của “mất điện”.',
    'Ghi nhớ: 停電 = mất điện; 落雷 = sét đánh; 停止 = dừng lại.',
  ].join('\n'),
  toan_q_2013_12_11: [
    'Đáp án 4 — 包んで（つつんで）là thể て của 包む, gói/bọc đồ vật. Dịch: “Xin hãy gói món đồ ngay.”',
    '1. 呼んで（よんで）là gọi người/gọi tên; không phải gói đồ.',
    '2. 結んで（むすんで）là buộc hoặc thắt nút, thường dùng với dây; khác với bọc món đồ.',
    '3. 運んで（はこんで）là mang/vận chuyển vật đi.',
    '4. 包んで（つつんで）là cách viết đúng của つつんで.',
    'Ghi nhớ: 包む = gói/bọc; 結ぶ = buộc; 運ぶ = vận chuyển; 呼ぶ = gọi.',
  ].join('\n'),
  toan_q_2013_12_12: [
    'Đáp án 1 — 独身（どくしん）nghĩa là độc thân, chưa kết hôn. Dịch: “Anh Tanaka độc thân.”',
    '1. 独身（どくしん）là từ chỉ tình trạng hôn nhân độc thân.',
    '2. 単身（たんしん）nghĩa là một mình/sống một mình; không khẳng định người đó chưa kết hôn.',
    '3. 独者 không phải từ chuẩn cho nghĩa “độc thân”; 者（しゃ）là người.',
    '4. 単者 không phải cách viết của từ どくしん.',
    'Ghi nhớ: 独身 = chưa kết hôn; 単身 = một mình, đơn thân trong một số ngữ cảnh.',
  ].join('\n'),
  toan_q_2013_12_13: [
    'Đáp án 4 — 貸して（かして）là thể て của 貸す, cho người khác mượn. Dịch: “Hãy cho tôi mượn quyển sách này.”',
    '1. 措して không phải cách viết của かして; 措く（おく）có nghĩa đặt/để trong những cách dùng nhất định.',
    '2. 借して là cách viết sai; động từ “mượn” là 借りる, thể て là 借りて（かりて）.',
    '3. 貨 liên quan đến hàng hóa/tiền tệ, không viết động từ かす bằng chữ này.',
    '4. 貸して là thể て đúng của 貸す（かす）, cho mượn.',
    'Ghi nhớ: 貸す = cho mượn; 借りる = mượn.',
  ].join('\n'),
  toan_q_2013_12_14: [
    'Đáp án 1 — 逃げる（にげる）là chạy trốn/bỏ chạy. Dịch: “Con mèo này hễ tôi định chạm vào là lập tức bỏ chạy.”',
    '1. 逃げる（にげる）là cách viết đúng của にげる.',
    '2. 遠げる không phải cách viết của にげる; 遠い（とおい）nghĩa là xa.',
    '3. 逆げる không phải động từ にげる; 逆（ぎゃく）nghĩa là ngược/đảo lại.',
    '4. 返げる không phải cách viết của にげる; 返す（かえす）là trả lại, 返る（かえる）là quay trở lại.',
    'Ghi nhớ: 逃げる = chạy trốn; 返す = trả lại; 遠い = xa.',
  ].join('\n'),
  toan_q_2013_12_15: [
    'Đáp án 2 — 調子（ちょうし）là tình trạng/hoạt động của một bộ phận; のどの調子が悪い nghĩa là cổ họng không ổn. Dịch: “Tôi bị cảm nên cổ họng không được khỏe.”',
    '1. 気分（きぶん）là tâm trạng hoặc cảm giác chung của người; 気分が悪い thường là cảm thấy buồn nôn/khó chịu, không nói riêng tình trạng cổ họng.',
    '2. 調子（ちょうし）kết hợp tự nhiên với のど để nói tình trạng cổ họng; đúng.',
    '3. 事情（じじょう）là hoàn cảnh/lý do, không phải tình trạng cơ thể.',
    '4. 都合（つごう）là sự thuận tiện/điều kiện; thường nói 都合がいい・悪い về lịch hoặc hoàn cảnh.',
    'Ghi nhớ: bộ phận cơ thể không khỏe 調子が悪い; tâm trạng/cảm giác 気分; sự thuận tiện 都合.',
  ].join('\n'),
  toan_q_2013_12_16: [
    'Đáp án 3 — 緩い（ゆるい）nghĩa là lỏng/rộng; người nói xin đổi sang cỡ nhỏ hơn. Dịch: “Chiếc quần này hơi rộng nên hãy cho tôi chiếc nhỏ hơn một chút.”',
    '1. きつい là chật hoặc bó sát; khi quần chật, thường cần cỡ lớn hơn, trái với vế sau.',
    '2. だるい là mệt mỏi/uể oải, thường tả cơ thể; không miêu tả độ vừa của quần.',
    '3. 緩い（ゆるい）là rộng/lỏng; khớp với yêu cầu lấy cỡ nhỏ hơn.',
    '4. 苦しい（くるしい）là khổ sở/khó chịu, không phải từ thông dụng chỉ quần rộng.',
    'Ghi nhớ: quần chật きつい → đổi cỡ lớn hơn; quần rộng 緩い → đổi cỡ nhỏ hơn.',
  ].join('\n'),
  toan_q_2013_12_17: [
    'Đáp án 4 — たつ（経つ）diễn tả thời gian trôi qua; もう３年たちました là đã ba năm rồi. Dịch: “Đã ba năm trôi qua kể từ khi tôi đến Nhật.”',
    '1. 移りました（うつりました）là đã chuyển/dời sang nơi khác; không đi với mốc thời gian theo nghĩa thời gian trôi qua.',
    '2. かかりました là đã mất/tốn một khoảng thời gian để hoàn tất việc gì; cấu trúc này không khớp với もう３年 sau khi đến Nhật.',
    '3. 通りました（とおりました）là đã đi qua hoặc được thông qua; không nói thời gian đã trôi qua.',
    '4. たちました（経ちました）là đã trôi qua; đúng với khoảng thời gian kể từ khi đến Nhật.',
    'Ghi nhớ: thời gian trôi qua 経つ; mất bao lâu để làm việc gì かかる; đi qua một nơi 通る.',
  ].join('\n'),
  toan_q_2013_12_18: [
    'Đáp án 1 — 突然（とつぜん）là đột nhiên/bất ngờ; thời tiết vừa đẹp thì mưa bất chợt khiến người nói bị ướt. Dịch: “Mới nãy trời còn đẹp vậy mà đột nhiên mưa xuống, làm tôi bị ướt.”',
    '1. 突然（とつぜん）là đột nhiên; hợp với sự thay đổi thời tiết bất ngờ.',
    '2. 早めに（はやめに）nghĩa là sớm hơn một chút; không diễn tả việc mưa bất ngờ.',
    '3. さっそく là ngay lập tức, thường nói bắt tay làm việc gì ngay; không tự nhiên để bổ nghĩa cho 雨が降ってきた ở đây.',
    '4. 急ぐ（いそぐ）là động từ “vội/vội vàng”; dạng nguyên mẫu không thể điền tự nhiên trước 雨が降ってきて.',
    'Ghi nhớ: sự việc xảy ra bất ngờ 突然; làm việc sớm hơn dự kiến 早めに; bắt tay vào việc ngay さっそく.',
  ].join('\n'),
  toan_q_2013_12_19: [
    'Đáp án 2 — 物価（ぶっか）là mặt bằng giá cả hàng hóa/dịch vụ; 物価が高い làm chi phí sinh hoạt tăng. Dịch: “Ở nước này giá cả cao nên cuộc sống rất vất vả.”',
    '1. 経済（けいざい）là nền kinh tế nói chung; không nói nền kinh tế “cao” theo cách này.',
    '2. 物価（ぶっか）kết hợp tự nhiên với 高い để nói giá cả đắt; đúng.',
    '3. 消費（しょうひ）là sự tiêu dùng; không mang nghĩa giá của hàng hóa.',
    '4. 支出（ししゅつ）là khoản chi/chi tiêu; có thể nhiều hoặc ít, nhưng không nói 支出が高い để chỉ giá cả đắt.',
    'Ghi nhớ: giá cả 物価; nền kinh tế 経済; tiêu dùng 消費; khoản chi 支出.',
  ].join('\n'),
  toan_q_2013_12_20: [
    'Đáp án 4 — 追いつく（おいつく）là đuổi kịp một người/vật đi trước. Dịch: “Cuối cùng tôi cũng đuổi kịp anh trai, người đã rời nhà trước, ở gần nhà ga.”',
    '1. 間に合いました（まにあいました）là kịp giờ/kịp hạn; không có mốc giờ hoặc chuyến tàu cần kịp.',
    '2. ぶつかりました（ぶつかりました）là va vào/đâm phải; không hợp với ý đi theo anh trai.',
    '3. 届きました（とどきました）là vật được gửi tới/đến nơi; thường không dùng để nói đuổi kịp một người.',
    '4. 追いつきました（おいつきました）là đã đuổi kịp; phù hợp với việc anh trai đi trước và người nói gặp kịp anh ở gần ga.',
    'Ghi nhớ: đuổi kịp 追いつく; đến kịp giờ 間に合う; đồ vật được chuyển tới 届く.',
  ].join('\n'),
  toan_q_2013_12_21: [
    'Đáp án 3 — おぼれる（溺れる）là chết đuối/chìm dưới nước; おぼれそうになった là suýt chết đuối. Dịch: “Vì tôi bơi kém nên lần trước suýt chết đuối ở biển.”',
    '1. こおりそう（凍りそう）là suýt đóng băng/lạnh cóng; không diễn tả nguy hiểm do bơi kém.',
    '2. たまりそう（溜まりそう）là có vẻ sẽ tích tụ/đọng lại; không hợp với người bơi ở biển.',
    '3. おぼれそう（溺れそう）là suýt bị chìm/suýt chết đuối; đúng với 海で và lý do 泳ぐのが下手.',
    '4. すべりそう（滑りそう）là suýt trượt chân; khác với bị chìm dưới nước.',
    'Ghi nhớ: 溺れる = chết đuối; 凍る = đóng băng; 滑る = trượt.',
  ].join('\n'),
  toan_q_2013_12_22: [
    'Đáp án 2 — 材料（ざいりょう）là nguyên liệu/thành phần dùng để làm món ăn. Dịch: “Vì chiếc bánh ăn ở nhà bạn rất ngon nên tôi nhờ bạn ấy cho biết nguyên liệu và cách làm.”',
    '1. 資源（しげん）là tài nguyên, chẳng hạn tài nguyên thiên nhiên; không phải thành phần làm bánh.',
    '2. 材料（ざいりょう）là nguyên liệu; cụm 材料と作り方 nghĩa là nguyên liệu và cách làm.',
    '3. 部品（ぶひん）là linh kiện/bộ phận của máy móc hoặc đồ vật lắp ghép.',
    '4. 原因（げんいん）là nguyên nhân; không phải nguyên liệu hay công thức.',
    'Ghi nhớ: nguyên liệu 材料; tài nguyên 資源; linh kiện 部品; nguyên nhân 原因.',
  ].join('\n'),
  toan_q_2013_12_23: [
    'Đáp án 1 — 別々に（べつべつに）là riêng rẽ/tách riêng. Dịch: “Hai anh em đó thường đi học cùng nhau, nhưng hôm nay lại đến riêng.”',
    '1. 別々に（べつべつに）là riêng từng người; trái với 一緒に “cùng nhau” ở vế đầu.',
    '2. 半々に（はんはんに）là chia đều một nửa mỗi bên; không diễn tả hai người đến tách nhau.',
    '3. 分けて（わけて）là chia/tách một thứ thành phần; cần nói hai người hành động riêng rẽ nên 別々に tự nhiên hơn.',
    '4. 区切って（くぎって）là ngăn/chia thành đoạn hoặc phần; không dùng cho hai người đi học riêng.',
    'Ghi nhớ: đi riêng 別々に; chia đôi 半々に; chia một vật 分ける; ngắt thành đoạn 区切る.',
  ].join('\n'),
  toan_q_2013_12_24: [
    'Đáp án 1 — 引き受ける（ひきうける）là nhận lời/đảm nhận việc được nhờ. Dịch: “Khi tôi nhờ anh Sato làm việc đó, anh ấy đã nhận lời giúp.”',
    '1. 引き受けて（ひきうけて）là nhận đảm nhiệm một công việc; hợp với 仕事をお願いした.',
    '2. 引き出して（ひきだして）là kéo/lấy thứ gì ra; cũng có thể là rút tiền, nhưng không có nghĩa nhận việc.',
    '3. 引っ張って（ひっぱって）là kéo/giật một vật hoặc dẫn ai đi; không phải nhận lời làm việc.',
    '4. 引っかけて（ひっかけて）là móc/vướng vào hoặc lừa mắc bẫy; không hợp với lời nhờ nhận việc.',
    'Ghi nhớ: nhận việc 引き受ける; kéo ra 引き出す; kéo 引っ張る; móc/vướng 引っかける.',
  ].join('\n'),
  toan_q_2013_12_25: [
    'Đáp án 3 — 自慢する（じまんする）là khoe/kể với vẻ tự hào về điều mình có. Dịch: “Anh Mori lúc nào cũng khoe với mọi người rằng thú cưng mình nuôi là đáng yêu nhất.”',
    '1. 期待して（きたいして）là mong đợi/kỳ vọng; không có nghĩa khoe với người khác.',
    '2. 応援して（おうえんして）là cổ vũ/ủng hộ một người hay đội; không hợp với nội dung khoe thú cưng.',
    '3. 自慢して（じまんして）là khoe/tự hào kể; kết hợp đúng với việc nói pet của mình đáng yêu nhất.',
    '4. 賛成して（さんせいして）là đồng ý/tán thành một ý kiến hoặc đề xuất; không phải chủ động khoe.',
    'Ghi nhớ: khoe 自慢する; kỳ vọng 期待する; cổ vũ 応援する; tán thành 賛成する.',
  ].join('\n'),
  toan_q_2013_12_26: [
    'Đáp án 2 — キッチン là bếp/nhà bếp, gần nghĩa nhất với 台所（だいどころ）. Dịch: “Nhà anh Takahashi có căn bếp rộng, thích thật.”',
    '1. 玄関（げんかん）là lối vào/sảnh trước nhà; không phải bếp.',
    '2. 台所（だいどころ）là nhà bếp; đồng nghĩa gần nhất với キッチン.',
    '3. 部屋（へや）là phòng nói chung; không xác định đó là bếp.',
    '4. 廊下（ろうか）là hành lang nối các phòng; không phải bếp.',
    'Ghi nhớ: bếp 台所; cửa/lối vào 玄関; phòng 部屋; hành lang 廊下.',
  ].join('\n'),
  toan_q_2013_12_27: [
    'Đáp án 2 — 位置（いち）là vị trí, nơi một vật nằm/được đặt; nghĩa gần nhất là 場所（ばしょ）. Dịch: “Xin hãy kiểm tra trước vị trí chiếc bàn.”',
    '1. 値段（ねだん）là giá tiền; không phải vị trí.',
    '2. 場所（ばしょ）là địa điểm/nơi chốn; gần nghĩa nhất với 位置.',
    '3. 数（かず）là số lượng; không nói bàn đang ở đâu.',
    '4. 色（いろ）là màu sắc; là thuộc tính khác của chiếc bàn.',
    'Ghi nhớ: vị trí 位置／場所; giá tiền 値段; số lượng 数; màu 色.',
  ].join('\n'),
  toan_q_2013_12_28: [
    'Đáp án 1 — 売り切れた（うりきれた）là đã bán hết sạch. Dịch: “Món hàng đó đã bán hết.”',
    '1. 全部売れた là đã bán hết tất cả; diễn đạt đúng nghĩa 売り切れた.',
    '2. 全部売れなかった là không bán được món nào; ngược nghĩa.',
    '3. だんだん売れなくなってきた là dần dần bán không chạy nữa; không có nghĩa toàn bộ hàng đã hết.',
    '4. よく売れるようになってきた là bắt đầu bán chạy; không nói hàng đã hết.',
    'Ghi nhớ: bán hết 売り切れる; bán chạy よく売れる; không bán được 売れない.',
  ].join('\n'),
  toan_q_2013_12_29: [
    'Đáp án 4 — わけ trong câu này có nghĩa là lý do; từ gần nghĩa nhất là 理由（りゆう）. Dịch: “Lần tới hãy cho tôi biết lý do nhé.”',
    '1. 計画（けいかく）là kế hoạch/dự định, không phải lý do.',
    '2. 意見（いけん）là ý kiến/quan điểm; khác với căn cứ khiến sự việc xảy ra.',
    '3. 規則（きそく）là quy tắc/nội quy; không đồng nghĩa với わけ.',
    '4. 理由（りゆう）là lý do; thay vào câu vẫn giữ nguyên nghĩa.',
    'Ghi nhớ: lý do わけ／理由; kế hoạch 計画; ý kiến 意見; quy tắc 規則.',
  ].join('\n'),
  toan_q_2013_12_30: [
    'Đáp án 3 — 回収（かいしゅう）là thu gom/thu lại những thứ đã phát hoặc phân phát; 集める（あつめる）là gom lại. Dịch: “Bây giờ tôi sẽ thu lại các phiếu khảo sát.”',
    '1. 渡す（わたす）là đưa/giao cho người khác; chiều hành động ngược với thu lại.',
    '2. 贈る（おくる）là tặng/biếu; không phải thu hồi phiếu.',
    '3. 集める（あつめる）là gom/thu thập; gần nghĩa nhất với 回収する.',
    '4. 始める（はじめる）là bắt đầu; không mang nghĩa thu gom.',
    'Ghi nhớ: thu lại 回収する; gom tập hợp 集める; đưa cho 渡す; tặng 贈る.',
  ].join('\n'),
}

for (const [index, [id, explanation]] of Object.entries(explanations).entries()) {
  const question = questions.get(id)
  assert.ok(question, `Missing question ${id}`)
  const expectedAnswer = answerKey[index]
  assert.equal(question.answer, expectedAnswer, `Answer key differs at question ${index + 1}`)
  assert.equal(question.correctAnswer, expectedAnswer, `correctAnswer differs at question ${index + 1}`)
  assert.ok(explanation.startsWith(`Đáp án ${expectedAnswer} —`), `Explanation label mismatch at question ${index + 1}`)
  question.explanation = explanation
  curated[id] = explanation
}

fs.writeFileSync(masterPath, JSON.stringify(exams, null, 2) + '\n')
fs.writeFileSync(curatedPath, JSON.stringify(curated, null, 2) + '\n')
fs.writeFileSync(
  reportPath,
  JSON.stringify(
    {
      examId: exam.id,
      reviewedOn: '2026-09-27',
      scope:
        'Rewrite vocabulary explanations for questions 1–30 with Vietnamese sentence translations and choice-by-choice reading, meaning, and usage distinctions. Answers were checked against the local answer-key transcription and independent third-party sources; official status is not established.',
      sources: {
        examTranscript: {
          url: examSource,
          sourceType: 'third-party exam transcription; not an official JLPT publication',
        },
        answerKey: {
          url: answerSource,
          sourceType: 'third-party answer-key transcription; official status not established',
        },
        crossCheck: {
          url: 'https://www.scribd.com/document/891971853/jlpt-n3-2013-12',
          sourceType: 'third-party exam, answer, and explanation transcription; official status not established',
        },
      },
      questions: Object.entries(explanations).map(([questionId, explanation], index) => ({
        questionId,
        number: index + 1,
        answer: answerKey[index],
        answerPreserved: true,
        includesTranslation: explanation.includes('Dịch:'),
        explainsAllChoices: [1, 2, 3, 4].every((option) => explanation.includes(`\n${option}. `)),
        explanation,
      })),
    },
    null,
    2
  ) + '\n'
)

console.log('Reviewed 30 JLPT N3 12/2013 vocabulary explanations; checked and preserved answer keys.')
