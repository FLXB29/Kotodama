import fs from 'node:fs'

const masterPath = 'data/jlpt_n3_toan_master.json'
const curatedPath = 'data/jlpt_n3_explanations_curated.json'
const exams = JSON.parse(fs.readFileSync(masterPath, 'utf8'))
const curated = JSON.parse(fs.readFileSync(curatedPath, 'utf8'))

const cases = [
  [
    'toan_q_2022_12_49',
    'Tôi thấy yên tâm khi đọc email của con trai đang du học, trong đó viết rằng ngày nào con cũng sống vui vẻ.',
    '「Nからのメール」là email gửi từ N; 「〜と書かれている」trích nội dung được viết trong thư.',
  ],
  [
    'toan_q_2022_12_50',
    'Tôi có bạn ở Tokyo, nên trong thời gian ở đó tôi muốn cùng bạn đi ăn một bữa.',
    '「友達がいるので」nêu lý do; 「東京にいる間に」giới hạn thời gian thực hiện dự định.',
  ],
  [
    'toan_q_2022_12_51',
    'Tôi muốn có thể chơi violin nên đã bắt đầu học từ một năm trước; càng chơi thì tôi càng thấy đây là nhạc cụ thú vị đến thế.',
    '「VばVるほど」diễn tả mức độ tăng theo hành động: càng chơi thì càng thấy thú vị.',
  ],
  [
    'toan_q_2022_12_52',
    '“Đúng lúc mình đang muốn một chiếc túi có màu như thế này.”',
    '「こういう色のかばん」là cụm danh từ “chiếc túi có màu như thế này”; 「欲しいと思っていた」nói về mong muốn đã có từ trước.',
  ],
  [
    'toan_q_2022_07_49',
    'Bạn có biết thịt gà sẽ mềm ra khi được ninh bằng cola không?',
    '「コーラで」nêu nguyên liệu/phương tiện; 「Vることで」diễn tả kết quả đạt được nhờ cách làm đó.',
  ],
  [
    'toan_q_2022_07_51',
    'Năm nay tôi không về nước; đây là lần đầu tiên tôi trải qua kỳ nghỉ hè ở Nhật nên tôi rất mong đợi.',
    '「日本で夏休みを過ごす」là trải qua kỳ nghỉ ở Nhật; 「今年が初めて」nhấn mạnh đây là lần đầu trong năm nay.',
  ],
  [
    'toan_q_2022_07_52',
    'Quanh Đại học Sakura có nhiều cửa hàng, chủ yếu là quán ăn và quán cà phê, cùng hiệu sách, tiệm làm đẹp và những cửa hàng khác.',
    '「Nを中心に」nghĩa là lấy N làm trung tâm/chủ yếu; 「いろいろな店がある」kết luận rằng có nhiều loại cửa hàng.',
  ],
  [
    'toan_q_2019_12_53',
    '“Tôi định đi bằng ô tô, nên nếu bạn cũng đi thì tôi sẽ chở bạn.”',
    '「もし〜んだったら」đặt điều kiện; 「乗せていってあげる」là đề nghị chở người nghe đến đó.',
  ],
  [
    'toan_q_2017_07_50',
    '“Tôi chưa từng thấy hoàng hôn nào đẹp đến thế.”',
    '「こんなに＋tính từ＋N」nhấn mạnh mức độ; 「見たことがありません」phủ định trải nghiệm từng thấy.',
  ],
  [
    'toan_q_2016_07_51',
    'Tôi ngạc nhiên khi thấy khu vực quanh nhà ga, nơi trước đây chẳng có gì, đã thay đổi hoàn toàn.',
    '「すっかり変わっている」diễn tả trạng thái đã thay đổi hẳn; 「変わっているのを見て」nêu điều khiến người nói ngạc nhiên.',
  ],
  [
    'toan_q_2015_12_51',
    'Khi tặng quà, cả khoảng thời gian vừa nghĩ xem nên chọn món nào sau khi nghĩ đến người nhận cũng rất vui.',
    '「相手のことを考えながら」là vừa nghĩ đến người nhận vừa chọn; 「どれにするか」là câu hỏi gián tiếp “chọn món nào”.',
  ],
  [
    'toan_q_2015_07_50',
    'Nghe nói có nhiều nhân viên nghỉ việc trong vòng ba năm vì công việc bận đến mức quá sức.',
    '「あまりに〜て」diễn tả mức độ quá… dẫn đến kết quả; 「3年以内に」là trong vòng ba năm.',
  ],
  [
    'toan_q_2014_12_49',
    'Gia đình tôi có sáu người, nhưng trong nhà chỉ có mẹ là phụ nữ.',
    '「家族で」giới hạn phạm vi “trong gia đình”; 「女は母だけ」nghĩa là người nữ duy nhất là mẹ.',
  ],
  [
    'toan_q_2014_12_51',
    'Giáo viên: “Khi giải thích kết quả đã khảo sát, nếu vừa trình bày vừa chỉ vào bảng hoặc biểu đồ thì người nghe sẽ dễ hiểu hơn.”',
    '「Nを示しながら説明する」là vừa chỉ/trình bày N vừa giải thích; 「わかりやすくなる」nói về kết quả trở nên dễ hiểu.',
  ],
  [
    'toan_q_2014_07_50',
    'Những món đồ nội thất ở đây hiện giờ món nào tôi cũng không dùng, nhưng nghĩ rằng có thể một ngày nào đó sẽ dùng lại nên tôi không nỡ vứt đi.',
    '「今はどれも〜ないけれども」đối lập hiện tại với khả năng tương lai; 「いつかまた」là một lúc nào đó trong tương lai.',
  ],
  [
    'toan_q_2014_07_52',
    '“Trời tối quá nhỉ.” — “Ừ. Có thể mưa bất cứ lúc nào ấy nhỉ.”',
    '「いつVてもおかしくない」diễn tả việc có thể xảy ra bất cứ lúc nào; 「雨が降る」là mưa bắt đầu rơi.',
  ],
  [
    'toan_q_2013_12_49',
    'Tôi thấy con trai có vẻ muốn nói điều gì đó nên đã hỏi: “Có chuyện gì vậy?”',
    'Ô 3 cần 「顔を」 (lựa chọn 1), vì 「何か」 phải đứng trước 「言いたそうな」 để bổ nghĩa cho 「顔」, còn 「しているのを」 (lựa chọn 4) phải theo sau 「顔を」. Nếu đặt lựa chọn 2, 3 hoặc 4 vào ô ★ thì các cụm 「何か言いたそうな顔」 hoặc 「顔をしているのを」 bị tách sai.',
  ],
  [
    'toan_q_2013_12_50',
    'Tôi nghe nói công viên này đẹp nhất vào thời điểm nhiều loài hoa bắt đầu nở.',
    'Ô 3 cần 「最も」 (lựa chọn 1) để bổ nghĩa cho 「美しい」. 「この」 (4) phải đứng trước danh từ 「時期」 (2), còn 「美しい」 (3) là vị ngữ theo sau 「最も」; vì vậy ba lựa chọn đó không thể thay vị trí ★.',
  ],
  [
    'toan_q_2013_12_51',
    'Nghe tin bạn bị thương phải nhập viện, tôi vội đến bệnh viện xem thử thì thấy bạn khỏe hơn mình tưởng nên yên tâm.',
    'Ô 3 cần 「思って」 (lựa chọn 2), ghép với 「いたよりも」 (4) thành 「思っていたよりも」, nghĩa là “hơn điều mình đã nghĩ”. 「病院に行って」 (1) phải theo sau 「あわてて」; 「みると」 (3) phải đứng ngay sau đó để tạo 「行ってみると」, “khi đến xem thử thì…”. Hai cụm này mở tình huống, không thể thay cụm so sánh ở ô ★.',
  ],
  [
    'toan_q_2013_12_52',
    'Những quả dưa hấu trồng trong vườn trước đây mãi không phát triển tốt, nhưng tôi không bỏ cuộc và thử thách bản thân mỗi năm; đến năm nay cuối cùng đã thu được quả ngon.',
    'Ô 3 cần 「毎年チャレンジしていたら」 (lựa chọn 4): 「あきらめないで」 (1) đứng trước cụm này, rồi 「ようやく」 (2) mở kết quả đạt được. 「うまく育たなかったが」 (3) nối với 「これまでなかなか」 ở phía trước; các mảnh 1–3 vì thế đều có vị trí ngữ pháp riêng. PDF nguồn in sai 「チャンジ」; giao diện chuẩn hóa thành cách viết đúng 「チャレンジ」.',
  ],
  [
    'toan_q_2013_12_53',
    'Tôi vẫn nâng niu giữ chiếc váy liền bà may cho hồi nhỏ, dù khi lớn lên tôi đã không mặc vừa nữa.',
    'Ô 3 cần 「今でも」 (lựa chọn 3), nối tình trạng 「着られなくなった」 với trạng thái hiện tại 「大切に持っている」: dù giờ không mặc vừa, tôi vẫn trân trọng giữ chiếc váy. 「体が大きくなって」 (4) phải đi trước 「着られなくなった」 (1), còn 「大切に持って」 (2) phải đứng sát 「いる」 ở cuối câu.',
  ],
  [
    'toan_q_2013_07_49',
    'Lễ tân nói: “Vâng, anh/chị Murayama. Xin mời ngồi vào chiếc ghế đằng kia và chờ một chút.”',
    'Ô ★ thứ ba nhận 「になって」 (lựa chọn 4), hoàn thành kính ngữ 「いすにおかけになって」. 「いすに」 (3) phải theo sau 「そちらの」; 「おかけ」 (2) ghép với nó; 「お待ち」 (1) đứng cuối trước 「ください」, nên ba mảnh kia không thể đặt ở ô ★.',
  ],
  [
    'toan_q_2013_07_50',
    'Ngay cả tôi, vốn không quá giỏi nấu ăn, cũng làm riêng món hambāgu thật ngon.',
    'Ô ★ thứ ba cần 「私でも」 (1), đứng sau mệnh đề bổ nghĩa 「料理をするのがそれほど得意ではない」 và trước chủ đề đối chiếu 「ハンバーグだけは」. 「のが」 (4) phải đứng đầu cụm; 「それほど得意ではない」 (3) đứng sát trước 「私」; 「ハンバーグだけは」 (2) nằm ngay trước 「おいしく作れる」.',
  ],
  [
    'toan_q_2013_07_51',
    '“Tôi luôn mang theo sổ ghi chú để khỏi quên những ý tưởng vừa nảy ra.”',
    'Ô ★ thứ ba là 「しまわないように」 (2), nối 「忘れて」 (1) thành mục đích “để không lỡ quên”. 「アイデアを」 (4) là tân ngữ của 「忘れて」, còn 「必ず持ち歩くように」 (3) là thói quen được duy trì. Trang gốc in 「入れている」; lớp chữ PDF nhầm chữ 入 thành 人.',
  ],
  [
    'toan_q_2013_07_52',
    'Tối qua, tôi có cảm giác như nghe thấy tiếng động nào đó từ căn phòng không có ai.',
    'Ô ★ thứ ba nhận 「何か音が」 (3), chủ ngữ của vị ngữ 「聞こえた」 (2). 「誰も」 phải ghép với phủ định 「いない」 (1); 「部屋から」 (4) chỉ nơi phát ra âm thanh; 「聞こえた」 hoàn tất vị ngữ ở cuối.',
  ],
  [
    'toan_q_2013_07_53',
    'Hiện đang xem xét phương án xây hai nhà thi đấu, một lớn và một nhỏ, trong công viên thể thao thành phố.',
    'Ô ★ thứ ba là 「建設する」 (2), đi ngay sau cụm tân ngữ 「大小二つの体育館を」. 「二つの」 (3) bổ nghĩa cho 「体育館」 (1); 「という案が」 (4) theo sau nội dung xây dựng để tạo chủ ngữ cho 「検討されている」.',
  ],
  [
    'toan_q_2012_12_52',
    'Bố tôi thường nói: “Thà thử thách rồi thất bại còn hơn là chẳng làm gì cả.”',
    '「何もしないでいるより」nêu lựa chọn kém hơn; 「チャレンジして失敗するほうがいい」là so sánh lựa chọn tốt hơn với ほうがいい.',
  ],
  [
    'toan_q_2012_07_49',
    '“Tôi nghĩ giờ đó có lẽ tôi sẽ ở nhà, nên không sao đâu.”',
    '「時間はたぶん家にいると思う」nêu dự đoán về việc có mặt ở nhà đúng thời gian giao hàng.',
  ],
  [
    'toan_q_2012_07_50',
    '“Tôi có nghe tên thầy Liu của Đại học ABC, nhưng chưa từng gặp thầy.”',
    '「お名前は聞いたことがあります」nói đã nghe tên; 「会ったことはありません」phủ định trải nghiệm từng gặp.',
  ],
  [
    'toan_q_2012_07_51',
    'Một trong những ngôi chùa tôi muốn đến thăm nhất là chùa Kōsanji ở Kyoto.',
    '「もっとも行ってみたい寺のひとつ」nghĩa là một trong những ngôi chùa muốn thử đến nhất; 「Nのひとつ」nêu một thành viên trong nhóm.',
  ],
  [
    'toan_q_2011_12_49',
    'Tôi nghĩ rằng không có công việc nào thú vị đến thế này.',
    '「これほどおもしろい仕事はない」dùng ほど để nói không có công việc nào đạt mức thú vị như công việc này.',
  ],
  [
    'toan_q_2011_12_51',
    'Hôm qua ở bữa tiệc, tôi mải trò chuyện với bạn bè và bữa tiệc đã kết thúc trước khi tôi ăn được gì, nên sau đó tôi bị đói.',
    '「何も食べないうちに」nghĩa là trước khi kịp ăn gì; 「終わってしまって」nêu kết quả ngoài dự định.',
  ],
  [
    'toan_q_2011_12_52',
    'Buổi thực tập ở công ty vào kỳ nghỉ hè là cơ hội tốt để tôi suy nghĩ xem làm việc trong doanh nghiệp là như thế nào.',
    '「企業で働くというのがどういうことか」là nội dung câu hỏi gián tiếp; 「考えるいい機会」là cơ hội tốt để suy nghĩ.',
  ],
  [
    'toan_q_2011_12_53',
    'Mẹ tôi thường nói: “Việc không bị cảm là nhờ chạy bộ mỗi sáng.”',
    '「毎朝しているジョギング」bổ nghĩa cho việc chạy bộ; 「Nのおかげだ」nói kết quả tốt là nhờ N.',
  ],
  [
    'toan_q_2011_07_49',
    '“Tuần sau có trận đấu vậy mà cậu chẳng đến tập chút nào; cậu đã làm gì thế?”',
    '「試合なのに」nêu điều trái mong đợi; 「ちっとも〜ない」nhấn mạnh hoàn toàn không; câu hỏi trách nhẹ vì không đến tập.',
  ],
  [
    'toan_q_2011_07_50',
    'Giờ đóng cửa của bảo tàng đó thay đổi tùy theo ngày trong tuần, vì vậy bạn nên xác nhận tại quầy.',
    '「によって」đứng sau 「曜日」 để nêu tiêu chí làm giờ đóng cửa thay đổi. Trật tự là 3→1→4→2: 「閉まる時間」 là cụm danh từ “giờ đóng cửa”; 「が」 đánh dấu cụm này làm chủ ngữ của 「違う」; 「違うから」 kết thúc mệnh đề lý do. Ô ★ ở vị trí thứ ba nhận lựa chọn 4 「が」. Đổi vị trí các mảnh sẽ làm đứt cụm 「曜日によって」 hoặc 「閉まる時間が違う」.',
  ],
  [
    'toan_q_2011_07_51',
    'Tự trồng rau rồi tôi mới hiểu việc trồng được rau ngon vất vả đến mức nào.',
    '「どんなに大変なことか」là câu cảm thán gián tiếp “vất vả biết bao”; 「〜ことがわかった」nói đã hiểu ra điều đó.',
  ],
  [
    'toan_q_2011_07_52',
    '“Tôi thích bài hát này, nhưng hơi khó, nên mong mọi người chọn một bài khác.”',
    '「少しむずかしいですから」nêu lý do; 「ほかの歌にしてほしい」mong người khác đổi sang bài khác.',
  ],
  [
    'toan_q_2010_07_49',
    'Vì buổi hòa nhạc bắt đầu lúc 7 giờ nên tôi nghĩ dù đến sớm như vậy thì cửa vẫn chưa mở.',
    '「そんなに早く行っても」nêu nhượng bộ; 「まだ開いていないと思う」dự đoán nơi đó vẫn chưa mở cửa.',
  ],
  [
    'toan_q_2010_07_50',
    'Thư ký: “Thầy đang nói chuyện với một sinh viên khác, nên xin ông chờ một chút.”',
    '「話していらっしゃいます」dùng kính ngữ cho thầy; 「〜から」nêu lý do; 「少し待ってください」là lời yêu cầu lịch sự.',
  ],
  [
    'toan_q_2010_07_51',
    'Bố tôi và tôi nghĩ hôm nay ra ngoài mà không có ô cũng không sao, nhưng rồi lại bị mưa.',
    '「大丈夫だろうと思って」là nghĩ/chắc là sẽ ổn; 「が」đưa ra kết quả trái với dự đoán.',
  ],
  [
    'toan_q_2010_07_52',
    'Hôm qua đi sở thú, tôi đã xem được một chú sư tử con vừa mới sinh tháng trước.',
    '「Vたばかり」nghĩa là vừa mới làm; 「先月生まれたばかりのライオン」là sư tử vừa sinh tháng trước.',
  ],
]

const questions = new Map()
for (const exam of exams)
  for (const part of exam.parts || []) for (const question of part.questions || []) questions.set(question.id, question)

for (const [id, translation, note] of cases) {
  const question = questions.get(id)
  if (!question?.starPrompt || !question.starCorrectOrder || !Number.isInteger(question.starPosition)) {
    throw new Error(`Missing verified star structure: ${id}`)
  }
  const fragments = question.options.map((option) => option.replace(/^\s*[1-4１-４][.．、\s　]*/u, '').trim())
  const ordered = question.starCorrectOrder.map((choice) => fragments[choice - 1])
  const starredChoice = question.starCorrectOrder[question.starPosition]
  if (!ordered.every(Boolean) || starredChoice !== question.correctAnswer) {
    throw new Error(`Star sequence and answer key disagree: ${id}`)
  }
  const sentence = `${question.starPrompt.before}${ordered.join('')}${question.starPrompt.after}`
  const orderText = question.starCorrectOrder.join(' → ')
  const explanation = `Câu hoàn chỉnh: 「${sentence}」\nDịch: “${translation}”\nThứ tự bốn mảnh là ${orderText}; tại ô ★ (vị trí ${question.starPosition + 1}), mảnh đúng là 「${starredChoice === undefined ? '' : fragments[starredChoice - 1]}」, tức lựa chọn ${question.correctAnswer}. ${note}`
  question.explanation = explanation
  curated[id] = explanation
}

fs.writeFileSync(masterPath, `${JSON.stringify(exams, null, 2)}\n`, 'utf8')
fs.writeFileSync(curatedPath, `${JSON.stringify(curated, null, 2)}\n`, 'utf8')
console.log(`Updated ${cases.length} hand-written star-order explanations.`)
