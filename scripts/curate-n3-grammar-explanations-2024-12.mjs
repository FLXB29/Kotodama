import fs from 'node:fs'

const masterPath = 'data/jlpt_n3_toan_master.json'
const curatedPath = 'data/jlpt_n3_explanations_curated.json'
const exams = JSON.parse(fs.readFileSync(masterPath, 'utf8'))
const curated = JSON.parse(fs.readFileSync(curatedPath, 'utf8'))
const updates = new Map([
  ['toan_q_2024_12_36', [
    'Đáp án 2 — 「たくさんの人に食べてほしい」: người nói mong nhiều người ăn bánh mình làm. Trong 「人にVてほしい」, に đánh dấu người được mong muốn thực hiện hành động.',
    '1. は: đưa 「たくさんの人」 thành chủ đề; câu dễ thành “nhiều người muốn ăn”, đổi chủ thể của mong muốn.',
    '2. に: đánh dấu người mà người nói muốn họ ăn; đúng cấu trúc 「人にVてほしい」.',
    '3. まで: “đến tận/cả”; nhấn mạnh phạm vi, không đánh dấu người thực hiện hành động trong 「Vてほしい」.',
    '4. なら: “nếu là/về … thì”; tạo điều kiện hoặc chủ đề đối chiếu, không hợp ý câu.',
    'Dịch: “Tôi bắt đầu mở tiệm bánh vì muốn nhiều người ăn bánh do chính mình làm.”',
    'Ghi nhớ: 「私は人に食べてほしい」 = tôi muốn người khác ăn; 「私は食べたい」 = chính tôi muốn ăn.',
  ].join('\n')],
  ['toan_q_2024_12_37', [
    'Đáp án 3 — 「来週の発表のことで」 nghĩa là “về buổi thuyết trình tuần tới”. 「Nのことで相談する」 là cách nói tự nhiên khi muốn trao đổi về một việc.',
    '1. にとって: “đối với”; cần nêu góc nhìn của người nào, không tạo cụm “trao đổi về buổi thuyết trình”.',
    '2. によると: “theo như (nguồn tin)”; thường theo sau tên người/tài liệu rồi dẫn thông tin, không hợp 「ご相談したい」.',
    '3. のことで: 「Nのこと」 nêu chủ đề/sự việc cần bàn; kết hợp 「相談する」 đúng.',
    '4. のほか: “ngoài … ra”; cần nội dung tiếp theo để liệt kê thêm, không nêu chủ đề tư vấn.',
    'Dịch: “(Trong phòng nghiên cứu) Sinh viên: Thưa thầy/cô, bây giờ thầy/cô có tiện không ạ? Em muốn trao đổi một chút về buổi thuyết trình tuần tới. — Thầy/cô: Được chứ.”',
    'Ghi nhớ: 「Nのことで相談する」 = trao đổi về N; 「Nによると」 = theo nguồn N.',
  ].join('\n')],
  ['toan_q_2024_12_38', [
    'Đáp án 4 — 「1時間ぐらいで終わりそう」: “có vẻ sẽ xong trong khoảng một tiếng”. で chỉ khoảng thời gian cần để hoàn tất.',
    '1. ごろに: 「ごろ」 chỉ thời điểm xấp xỉ (“khoảng lúc…”); 「1時間ごろ」 không diễn đạt thời lượng để làm xong.',
    '2. ごろで: kết hợp 「ごろ」 với で không tạo được cách nói thời lượng cần thiết ở đây.',
    '3. ぐらいに: “khoảng một giờ”; に hướng tới một mốc thời gian, không nêu khoảng thời gian cần để hoàn thành.',
    '4. ぐらいで: “trong khoảng chừng”; 「時間＋で終わる」 nêu thời gian hoàn tất, hợp với 「終わりそう」.',
    'Dịch: “Thường bài tập về nhà mất hơn hai tiếng, nhưng hôm nay có vẻ chỉ cần khoảng một tiếng là xong.”',
    'Ghi nhớ: 「時間＋ぐらいで終わる」 nói thời lượng để xong; 「時刻＋ごろに」 nói khoảng thời điểm.',
  ].join('\n')],
  ['toan_q_2024_12_39', [
    'Đáp án 3 — 「さっきご飯を食べたばかり」: “mới ăn cơm lúc nãy thôi”. 「さっき」 chỉ thời điểm gần trong quá khứ.',
    '1. そろそろ: “sắp đến lúc”; dùng cho việc gần xảy ra, không khớp với 「食べたばかり」 vừa xảy ra.',
    '2. だんだん: “dần dần”; chỉ sự thay đổi tiến triển, không chỉ một thời điểm ăn.',
    '3. さっき: “lúc nãy”; giải thích vì sao người mẹ ngạc nhiên khi con lại đói.',
    '4. ずっと: “suốt/mãi”; chỉ khoảng thời gian kéo dài, không có nghĩa “vừa mới”.',
    'Dịch: “Con trai: Mẹ ơi, con đói. — Mẹ: Hả, lúc nãy con vừa ăn cơm xong mà, sao đã đói nữa rồi?”',
    'Ghi nhớ: 「さっき」 = lúc nãy; 「そろそろ」 = sắp đến lúc; 「だんだん」 = dần dần.',
  ].join('\n')],
  ['toan_q_2024_12_40', [
    'Đáp án 1 — 「ポケットに入れたまま洗濯してしまった」: đã giặt quần mà vẫn để tờ hóa đơn trong túi. 「〜たまま」 diễn tả trạng thái được giữ nguyên.',
    '1. 入れたまま: 「入れる」 là ngoại động từ “cho vào”; 「入れたまま」 nghĩa là vẫn để nguyên sau khi đã cho vào túi.',
    '2. 入ったまま: 「入る」 là nội động từ, không dùng を làm tân ngữ ở đây; cấu trúc cần 「レシートをポケットに入れる」.',
    '3. 入れている間: “trong lúc đang cho vào”; 「間」 nêu khoảng thời gian đang thao tác, không phải trạng thái hóa đơn vẫn nằm trong túi khi giặt.',
    '4. 入っている間: “trong lúc đang ở bên trong”; cách nối này không diễn đạt việc đã bỏ hóa đơn vào túi rồi giặt.',
    'Dịch: “Tôi đã để quên hóa đơn quan trọng trong túi quần rồi đem quần đi giặt.”',
    'Ghi nhớ: 「Vたまま」 = giữ nguyên trạng thái sau khi làm V; 「入れる」 là cho vào, 「入る」 là tự đi vào/được đặt vào.',
  ].join('\n')],
  ['toan_q_2024_12_41', [
    'Đáp án 2 — 「走ったってもう間に合わない」: “dù có chạy thì cũng không kịp nữa”. 「〜たって」 là khẩu ngữ của 「〜ても」, nêu giả định nhượng bộ.',
    '1. 走ってて: dạng nói rút gọn của 「走っていて」 (“đang chạy”), không nêu ý “dù có chạy”.',
    '2. 走ったって: 「Vたって」 = dù có làm V thì…; hợp với kết luận đã muộn và đề nghị đi chuyến sau.',
    '3. 走らなきゃ: rút gọn 「走らなければ」 (“nếu không chạy thì phải…”); không hoàn chỉnh quan hệ với 「もう間に合わない」 theo ý câu.',
    '4. 走っちゃって: rút gọn 「走ってしまって」, nói làm xong/lỡ làm; không mang nghĩa nhượng bộ “dù có chạy”.',
    'Dịch: “A: Nếu nhanh thì có lẽ kịp chuyến tàu lúc 9 giờ. Chạy nhé? — B: Không, dù có chạy thì tôi nghĩ cũng không kịp nữa. Đi chuyến sau đi.”',
    'Ghi nhớ: 「Vたって」 trong khẩu ngữ thường tương đương 「Vても」 = dù có V thì…',
  ].join('\n')],
  ['toan_q_2024_12_42', [
    'Đáp án 3 — 「実際に着てみてから買いたい」: muốn thử mặc thực tế rồi mới mua. 「Vてみる」 là thử làm; 「Vてから」 là sau khi làm xong.',
    '1. 着てみないと: “nếu không thử mặc thì…”; thường cần vế sau nêu điều không thể biết/làm, không khớp trực tiếp với 「買いたい」.',
    '2. 着ておかないと: “nếu không mặc/chuẩn bị mặc trước thì…”; 「ておく」 nói chuẩn bị trước, không phải thử đồ.',
    '3. 着てみてから: thử mặc trước rồi mua; đúng trình tự người nói muốn kiểm tra quần áo ngoài đời.',
    '4. 着ておいてから: làm trước rồi mới…; 「ておく」 không mang nghĩa thử mặc để kiểm tra độ vừa hoặc đẹp.',
    'Dịch: “Tôi thường mua sắm trên mạng, nhưng không mua quần áo vì muốn mặc thử thực tế rồi mới mua.”',
    'Ghi nhớ: 「Vてみる」 = thử làm V; 「Vてから」 = sau khi làm V; 「Vておく」 = làm sẵn/chuẩn bị trước.',
  ].join('\n')],
  ['toan_q_2024_12_43', [
    'Đáp án 3 — 「たくさん召し上がってください」: “xin mời dùng thật nhiều”. 「召し上がる」 là kính ngữ của 「食べる／飲む」, dùng để mời khách.',
    '1. なさって: kính ngữ của 「する」 (“làm”); không có nghĩa ăn/uống.',
    '2. おっしゃって: kính ngữ của 「言う」 (“nói”); không hợp với lời mời dùng món.',
    '3. めしあがって: 「召し上がる」 là kính ngữ của ăn/uống; kết hợp 「ください」 thành lời mời lịch sự.',
    '4. いらっしゃって: kính ngữ của đi/đến/ở; không có nghĩa ăn/uống.',
    'Dịch: “(Ở nhà anh Hayashi) Yamashita: Món ăn trông ngon quá. — Hayashi: Xin mời anh/chị cứ dùng thật nhiều. — Yamashita: Cảm ơn, tôi xin phép.”',
    'Ghi nhớ: 「召し上がる」 = ăn/uống (kính ngữ); 「おっしゃる」 = nói; 「いらっしゃる」 = đi/đến/ở.',
  ].join('\n')],
  ['toan_q_2024_12_44', [
    'Đáp án 4 — 「寒くなってきましたね」: “trời đã trở lạnh dần rồi nhỉ”. 「〜てくる」 nhìn sự thay đổi tiến triển đến hiện tại.',
    '1. なっていました: 「〜ていた」 kể trạng thái/diễn biến trong quá khứ; không khớp bằng cách nhìn sự thay đổi đang dần tới hiện tại.',
    '2. なってありました: 「ある」 không dùng theo cách này để diễn tả quá trình lạnh đi; 「なる」 là nội động từ chỉ thay đổi.',
    '3. なっていきました: 「〜ていく」 nhìn diễn biến tiếp tục từ hiện tại về sau; cuộc hội thoại đang nhận xét trời gần đây đã trở lạnh.',
    '4. なってきました: 「〜てくる」 nhìn sự thay đổi tích lũy đến hiện tại; phù hợp với 「最近」 và 「今日は特に冷えます」.',
    'Dịch: “A: Dạo gần đây trời đã lạnh dần rồi nhỉ. — B: Ừ, hôm nay đặc biệt lạnh.”',
    'Ghi nhớ: 「〜てくる」 nhìn thay đổi tiến đến hiện tại; 「〜ていく」 nhìn thay đổi tiếp tục từ hiện tại về sau.',
  ].join('\n')],
  ['toan_q_2024_12_45', [
    'Đáp án 1 — 「行ってよかったよ」: “Tớ mừng là đã đi”. Đây là đánh giá tích cực về một việc đã làm xong.',
    '1. 行ってよかった: 「Vてよかった」 diễn tả vui/mừng vì đã làm V; hợp với 「楽しかった」 và kết bạn mới.',
    '2. 行こうかと思う: “đang nghĩ có nên đi không”; nói dự định chưa thực hiện, trong khi buổi giao lưu đã diễn ra.',
    '3. 行きたかった: “đã muốn đi”; thường ngụ ý mong muốn nhưng không đi được, trái với việc vừa kể đã tham gia.',
    '4. 行けたらいいな: “giá mà có thể đi”; mong muốn giả định cho tương lai, không đánh giá sự kiện đã kết thúc.',
    'Dịch: “A: Buổi giao lưu du học sinh Chủ nhật thế nào? — B: Vui lắm. Vì lần đầu tham gia nên tớ hơi hồi hộp, nhưng còn kết bạn mới nữa, tớ mừng là đã đi.”',
    'Ghi nhớ: 「Vてよかった」 = mừng vì đã làm; 「Vたかった」 = đã muốn làm; 「Vられたらいい」 = mong có thể làm.',
  ].join('\n')],
  ['toan_q_2024_12_46', [
    'Đáp án 4 — 「ペンを貸していただけませんか」: “anh/chị có thể cho tôi mượn bút được không ạ?”. 「Vていただけませんか」 là lời nhờ lịch sự.',
    '1. お貸しできますか: 「お貸しする」 là khiêm nhường ngữ “tôi cho mượn”; ở đây sẽ đảo sai chủ thể.',
    '2. お貸しいたしますか: “tôi có nên cho mượn không ạ?”; người nói chủ động cho người khác mượn, ngược với nhu cầu của sinh viên.',
    '3. 貸したらいかがですか: “sao anh/chị không cho mượn?”; là lời khuyên người khác cho ai đó mượn.',
    '4. 貸していただけませんか: người nói xin nhận hành động của người nghe; phù hợp với lời xin mượn.',
    'Dịch: “(Ở văn phòng trường đại học) Sinh viên: Xin lỗi, anh/chị có thể cho em mượn bút được không ạ? — Nhân viên: À, được, em dùng cái này nhé.”',
    'Ghi nhớ: 「Vていただけませんか」 nhờ người nghe làm cho mình; 「お／ご〜いたす」 là khiêm nhường ngữ cho hành động của mình.',
  ].join('\n')],
  ['toan_q_2024_12_47', [
    'Đáp án 2 theo hai bảng đáp án tham khảo độc lập. 「送ってこようか」 được hiểu là người cha đi đưa con bằng xe rồi quay lại; mạch này nối với câu con 「行ってくるね」 và lời đề nghị vì trời đang mưa.',
    '1. 送ってこない: dạng phủ định “không đưa đi rồi quay lại”; không tạo được lời đề nghị.',
    '2. 送ってこようか: 「Vてくる」 nhìn hành động đi làm rồi trở lại điểm nhìn; 「〜ようか」 đề nghị “để bố đưa con đi rồi quay về nhé?”.',
    '3. 送ってあげない: phủ định “không đưa giúp”; trái với lời đáp cảm ơn của con.',
    '4. 送ってあげようか: 「Vてあげる」 là đề nghị làm việc có lợi cho người nghe nên câu này vẫn có thể hiểu tự nhiên trong hội thoại. Hai đáp án tham khảo đều chọn 2; riêng ngữ cảnh hiện có không loại trừ hoàn toàn lựa chọn 4.',
    'Dịch: “(Ở nhà) Con gái: Con ra hiệu sách trước ga một chút rồi về nhé. — Bố: Trời đang mưa, hay bố lái xe đưa con đi rồi quay lại nhé? — Con: Được ạ? Cảm ơn bố.”',
    'Ghi nhớ: 「〜てくる」 có thể chỉ đi làm một việc rồi quay lại; 「〜てあげる」 nhấn mạnh làm việc có lợi cho người khác. Đáp án 2 theo nguồn tham khảo, nhưng câu hỏi có lựa chọn nhiễu gần nghĩa.',
  ].join('\n')],
  ['toan_q_2024_12_48', [
    'Đáp án 2 theo hai bảng đáp án tham khảo độc lập. 「これから銀行に行くところなんです」: “tôi sắp đi ngân hàng đây”; 「これから」 khớp với 「Vるところ」, việc sắp bắt đầu.',
    '1. 行くところだからです: cấu trúc “vì tôi sắp đi” có thể hiểu về ngữ pháp và lý do; nguồn tham khảo chọn 2, nhưng riêng mạch hội thoại chưa chứng minh lựa chọn 1 sai tuyệt đối.',
    '2. 行くところなんです: 「Vるところ」 = sắp bắt đầu làm; 「んです」 trình bày tình huống hiện tại tự nhiên.',
    '3. 行っているところだからです: 「Vているところ」 = đang làm; không khớp 「これから」 (“từ bây giờ/sắp”).',
    '4. 行っているところなんです: cũng chỉ hành động đang diễn ra, trái với việc người nói nói mình chuẩn bị đi rồi sẽ quay lại.',
    'Dịch: “(Ở công ty) Minami: Anh/chị Nakayama, bây giờ tôi hỏi một chút được không? — Nakayama: À, tôi sắp đi ngân hàng ABC. Sau khi tôi quay lại thì được không?”',
    'Ghi nhớ: 「Vるところ」 = sắp làm; 「Vているところ」 = đang làm; 「んです」 thường dùng để nêu tình huống.',
  ].join('\n')],
])

let updated = 0
let correctedAnswer = false
for (const exam of exams) {
  if (exam.id !== 'toan-n3-202412-full') continue
  for (const part of exam.parts || []) {
    for (const question of part.questions || []) {
      const explanation = updates.get(question.id)
      if (!explanation) continue
      question.explanation = explanation
      curated[question.id] = explanation
      if (question.id === 'toan_q_2024_12_47') {
        question.correctAnswer = 2
        question.answer = 2
        correctedAnswer = true
      }
      updated++
    }
  }
}

if (updated !== updates.size || !correctedAnswer) {
  throw new Error('Expected ' + updates.size + ' questions and the 2024-12 answer correction; updated ' + updated + '.')
}

fs.writeFileSync(masterPath, JSON.stringify(exams, null, 2) + '\n', 'utf8')
fs.writeFileSync(curatedPath, JSON.stringify(curated, null, 2) + '\n', 'utf8')
console.log('Updated ' + updated + ' explanations; corrected 2024-12 question 47 to reference answer 2.')
