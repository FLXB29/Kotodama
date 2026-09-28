import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = fileURLToPath(new URL('../', import.meta.url))
const masterPath = path.join(root, 'data/jlpt_n3_toan_master.json')
const curatedPath = path.join(root, 'data/jlpt_n3_explanations_curated.json')
const reportPath = path.join(root, 'reports/n3-quality-audit/listening-2023-transcript-review.json')
const master = JSON.parse(fs.readFileSync(masterPath, 'utf8').replace(/^\uFEFF/, ''))
const curated = JSON.parse(fs.readFileSync(curatedPath, 'utf8').replace(/^\uFEFF/, ''))
const fullTranscriptsPath = path.join(root, 'data/n3_202312_full_transcripts.json')
const fullTranscripts = JSON.parse(fs.readFileSync(fullTranscriptsPath, 'utf8').replace(/^\uFEFF/, ''))
const fullTranscriptText = fullTranscripts.map((chunk) => chunk.text).join('\n')

const reviews = {
  toan_q_2023_07_74: [
    3,
    'Đáp án 3 — gửi chó ở khách sạn thú cưng. Dịch câu hỏi: “Cuối tuần sau, người đàn ông sẽ làm gì với con chó?” Nishida đi du lịch nên không thể trông giúp; bố anh bị dị ứng nên không thể đưa chó về nhà bố mẹ. Vì vậy anh chọn khách sạn thú cưng gần ga. Phương án 1 không được vì bạn không rảnh; 2 không được vì dị ứng; 4 không thể để chó ở nhà một mình.',
  ],
  toan_q_2023_07_75: [
    4,
    'Đáp án 4 — sao 13 bộ rồi đưa cho Kimura. Dịch câu hỏi: “Người đàn ông sẽ sao tài liệu cho bao nhiêu người và đưa cho ai?” Ban đầu cần 10 bộ, sau đó có thêm 3 người bên kinh doanh, nên tổng là 13; người nhận để chuẩn bị phòng họp là Kimura. Phương án 1–2 chỉ tính thêm 3 bộ thay vì tổng số; 3 tính đúng số nhưng nhầm người nhận là trưởng phòng.',
  ],
  toan_q_2023_07_76: [
    2,
    'Đáp án 2 — nấu món gà và bắp cải cho bữa tối. Dịch câu hỏi: “Du học sinh sẽ làm gì vào chiều nay?” Mẹ chủ nhà nhờ cậu nấu lại món đã làm trước đó và nói sẵn có thịt gà, bắp cải. Ảnh số 2 là cảnh nấu ăn. Phương án 1 dọn bồn tắm đã xong; 3 mua bắp cải là không cần; 4 sửa máy in cũng không cần vì chủ nhà đã thay mực.',
  ],
  toan_q_2023_07_77: [
    4,
    'Đáp án đang lưu là 4 — theo lời thoại, cô sinh viên đồng ý làm thêm tuần kế tiếp đến Chủ nhật sau khi nghỉ tuần có lễ tốt nghiệp, thay vì dừng ngày 15 như dự định ban đầu. Dịch câu hỏi: “Nữ sinh sẽ làm thêm đến ngày nào?” Lời thoại có dấu 正解:4, nhưng lựa chọn hiện chỉ hiện số 1–4 và không có bảng ngày để ghép từng số với ngày cụ thể. Vì vậy chưa thể xác nhận độc lập rằng số 4 tương ứng ngày nào; cần bổ sung hình/bảng đề gốc.',
  ],
  toan_q_2023_07_78: [
    2,
    'Đáp án 2 — chuẩn bị hội trường/phòng họp. Dịch câu hỏi: “Người phụ nữ sẽ làm gì tiếp theo?” Cuộc họp đổi sang phòng số 3, nên cô được giao sắp xếp hội trường. Quản lý sẽ nhờ người khác hướng dẫn khách; lịch không đổi và tờ giới thiệu đã chuẩn bị dư. Vì vậy không cần tự in tờ giới thiệu, gửi email thông báo hay sửa lịch trình.',
  ],
  toan_q_2023_07_79: [
    1,
    'Đáp án 1 — ghi tên vào bảng chọn ngày, giờ luyện phỏng vấn. Dịch câu hỏi: “Sinh viên cần làm gì trước tiên sau buổi hướng dẫn?” Giáo viên bảo từng người đăng ký một khung giờ trên bảng ở cuối lớp; sau đó mới chuẩn bị câu trả lời và trang phục cho buổi luyện tập. Phương án 2 là buổi luyện tập sau này; 3 và 4 cũng là việc chuẩn bị, không phải bước làm ngay tại lớp.',
  ],
  toan_q_2023_07_80: [
    2,
    'Đáp án 2 — gặp em bé mới sinh của chị gái. Dịch câu hỏi: “Nữ sinh mong chờ điều gì trong kỳ nghỉ hè sắp tới?” Cô chưa từng gặp con của chị, mới chỉ thấy ảnh nên rất muốn gặp bé. Cô nói mùa hè đi suối nước nóng thì nóng và không thích; bạn nam mới là người bắt đầu công việc làm thêm. Vì thế 1, 3 và 4 không phải điều cô mong chờ.',
  ],
  toan_q_2023_07_81: [
    3,
    'Đáp án 3 — ngày mai lúc 4 giờ chiều. Dịch câu hỏi: “Hai người sẽ trao đổi về bài thuyết trình khi nào?” Họ đổi lịch từ hôm nay sang ngày mai và giữ nguyên giờ đã hẹn là 4 giờ. Vì vậy hôm nay 4 giờ hoặc 5 giờ đều sai ngày; ngày mai 5 giờ sai giờ.',
  ],
  toan_q_2023_07_82: [
    3,
    'Đáp án 3 — có thể nấu món ngon một cách dễ dàng. Dịch câu hỏi: “Người đàn ông thích nhất điều gì ở chiếc nồi mới?” Anh thích chỉ cần cho nguyên liệu vào nồi, đậy nắp rồi đun là có món ngon. Nồi nhẹ chưa được nêu là điểm anh thích nhất; nấu món tốt cho sức khỏe không được nhắc đến; tay cầm tháo rời là đặc điểm chiếc nồi của người phụ nữ.',
  ],
  toan_q_2023_07_83: [
    2,
    'Đáp án 2 — vì anh thấy âm thanh tiếng Nhật rất đẹp. Dịch câu hỏi: “Nữ du học sinh nói vì sao cô bắt đầu học tiếng Nhật?” Cô tình cờ nghe tiếng Nhật trong phim truyền hình và thích âm thanh ấy. Cô muốn đọc manga sau khi đã học; mong muốn hiểu văn hóa khác là trải nghiệm sau khi sang Nhật; làm việc tại Nhật không phải lý do bắt đầu.',
  ],
  toan_q_2023_07_84: [
    4,
    'Đáp án 4 — nhiều sinh viên chưa đặt tiêu đề cho bảng số liệu. Dịch câu hỏi: “Giáo viên nói nhiều người chưa làm tốt điều gì trong báo cáo thí nghiệm?” Cô khen mục đích, cách làm và bảng kết quả nhìn chung đã ổn, nhưng nhiều người quên ghi tiêu đề bảng. Vì vậy các phương án 1–3 đều là phần cô nói đã làm được, còn thiếu là phương án 4.',
  ],
  toan_q_2023_07_85: [
    3,
    'Đáp án 3 — muốn đăng ảnh của mình lên Internet. Dịch câu hỏi: “Người đàn ông nói lý do học máy tính là gì?” Ông làm tài xế taxi nên gần như không dùng máy tính cho công việc; ông đăng ký lớp để chia sẻ ảnh chụp của mình trên mạng. Ông đã biết xem các trang web, và lời khuyên của vợ không phải động cơ được nêu.',
  ],
  toan_q_2023_07_86: [
    2,
    'Đáp án 2 — trang phục khi leo núi. Dịch câu hỏi: “Hai người đang nói về điều gì?” Người phụ nữ hỏi nên mặc áo len hay áo khoác dễ cởi, và quần jeans có phù hợp không. Đây đều là lựa chọn trang phục. Họ không bàn việc leo núi thú vị ra sao, mùa nào tốt nhất hay cách đi bộ để đỡ mệt.',
  ],
  toan_q_2023_07_87: [
    4,
    'Đáp án 4 — sự khác nhau giữa ngắm hoa ngày xưa và ngày nay. Dịch câu hỏi: “Người đàn ông đang nói về điều gì?” Anh kể khoảng 1.300 năm trước người ta ngắm hoa mơ, và chỉ một nhóm người đặc biệt được tham gia; ngày nay nhiều người đi ngắm hoa anh đào. Nội dung không tập trung vào mùa hay đồ ăn, cũng không giải thích nguyên nhân khởi đầu.',
  ],
  toan_q_2023_07_88: [
    1,
    'Đáp án 1 — sự thay đổi của chữ Hán dùng trong tên người. Dịch câu hỏi: “Người phụ nữ đang nói về điều gì?” Cô so sánh danh sách tên qua các năm: gần đây có nhiều chữ Hán khó và chữ gắn với thiên nhiên; chữ mang nghĩa hạnh phúc, tươi sáng ít đi. Cô không giải thích vì sao số tên chữ Hán giảm, độ khó đặt tên hay tâm trạng của cha mẹ.',
  ],
  toan_q_2023_07_89: [
    1,
    'Đáp án 1 — 「私がやろうか？」: “Để mình mở nhé?” Người bạn không mở được nắp chai và người nói muốn chủ động giúp. 「開けてくれない？」 lại nhờ người kia mở giúp mình, ngược chiều yêu cầu; 「手伝わないの？」 hỏi sao người kia không giúp, không phải lời đề nghị giúp bạn.',
  ],
  toan_q_2023_07_90: [
    1,
    'Đáp án 1 — 「こちらでお待ちください」: “Xin vui lòng chờ ở đây.” Người nói cần đi gọi giám đốc và muốn vị khách ở lại. 「おつきになりました」 nói về việc ai đó đã đến nơi, không đưa ra yêu cầu chờ; 「呼んでいただけますか」 lại nhờ vị khách gọi giám đốc.',
  ],
  toan_q_2023_07_91: [
    2,
    'Đáp án 2 — 「コーヒーまだでしょうか」: “Xin hỏi cà phê của tôi vẫn chưa có phải không ạ?” Người nói đã gọi cà phê nhưng chờ khá lâu, nên cần hỏi lịch sự về món chưa được mang ra. 「もういただいたんですけど」 nói rằng đã nhận cà phê rồi; 「コーヒー注文しますか」 hỏi người khác có muốn gọi cà phê không.',
  ],
  toan_q_2023_07_92: [
    3,
    'Đáp án 3 — 「斜めになってるよ」: “Bức tranh đang bị nghiêng đấy.” Người nói thấy bạn treo tranh chưa thẳng nên báo đúng tình trạng. 「絵を掛けなくちゃ」 chỉ nói phải treo tranh; 「まっすぐじゃなかったら、教えて」 nhờ bạn báo nếu tranh không thẳng, ngược vai người đang nhận xét.',
  ],
  toan_q_2023_07_93: [
    3,
    'Đáp án 3 — 「いいですよ。今からですか」: “Được thôi. Làm ngay bây giờ ạ?” Đồng nghiệp vừa nhờ giúp sắp xếp kho, nên đáp án này nhận lời rồi hỏi thời điểm bắt đầu. 「倉庫の整理、終わったんですね」 hiểu nhầm rằng việc đã xong; 「手伝ってくれるんですか」 hỏi người nhờ có giúp mình hay không, đảo chiều người giúp và người được giúp.',
  ],
  toan_q_2023_07_94: [
    2,
    'Đáp án 2 — 「役に立てて、嬉しいよ」: “Mình vui vì đã giúp được cậu.” Bạn báo rằng lời khuyên làm bài thuyết trình thành công; câu đáp thể hiện vui vì lời khuyên hữu ích. 「発表、頑張ってね」 là lời động viên trước khi làm; 「アドバイスできなくて、ごめんね」 xin lỗi vì không khuyên được, trái với tình huống.',
  ],
  toan_q_2023_07_95: [
    1,
    'Đáp án 1 — 「野球のこと、よく知ってるよね」: “Cậu biết nhiều về bóng chày nhỉ.” 「詳しい」 nghĩa là am hiểu một lĩnh vực, nên câu này diễn đạt lại chính xác. Phương án 2 nói ngược rằng cậu ấy chẳng biết gì; phương án 3 nói cậu ấy không giỏi chơi bóng chày, nhầm hiểu biết kiến thức với năng lực thi đấu.',
  ],
  toan_q_2023_07_96: [
    2,
    'Đáp án 2 — 「わかりました。ありがとうございます」: “Em hiểu rồi, cảm ơn anh/chị.” Quản lý nói rằng nếu có việc chưa rõ thì cứ hỏi; nhận lời và cảm ơn là phản hồi phù hợp. 「自分で調べたほうがいいですね」 lại nói nên tự tìm hiểu; 「聞いてください」 là bảo người kia hãy hỏi mình, đổi vai.',
  ],
  toan_q_2023_07_97: [
    3,
    'Đáp án 3 — 「思ったより多いね」: “Nhiều hơn mình tưởng nhỉ.” Người bạn nói không ăn hết phần cơm chiên; nhận xét khẩu phần nhiều hơn dự tính khớp với lời than đó. 「もう一つのもう」 không phải phản hồi tự nhiên; 「ちょうどいい量」 nói lượng vừa đủ, trái với việc ăn không hết.',
  ],
  toan_q_2023_07_98: [
    1,
    'Đáp án 1 — 「一時間以内にはおわりそうです」: “Có vẻ sẽ xong trong vòng một tiếng.” Người quản lý hỏi còn khoảng bao lâu mới hoàn thành tài liệu; câu này trả lời trực tiếp về thời gian. 「あとでやります」 chỉ nói sẽ làm sau, còn 「もうできたんですか」 hỏi tài liệu đã xong chưa.',
  ],
  toan_q_2023_07_99: [
    2,
    'Đáp án 2 — 「残念！なかったんだ」: “Tiếc quá, vậy là không có rồi.” Người được nhờ mua bánh mì nghe rằng siêu thị đã bán hết, nên bày tỏ tiếc nuối là hợp lý. 「よかった、ありがとう」 cảm ơn như thể đã mua được; 「スーパー、閉まってたの？」 nhầm bán hết với cửa hàng đóng cửa.',
  ],
  toan_q_2023_07_100: [
    3,
    'Đáp án 3 — 「いいよ、何のレポート？」: “Được chứ, báo cáo môn gì vậy?” Tiền bối vừa được nhờ xem báo cáo nên đồng ý rồi hỏi nội dung. 「私のレポートは見せられない」 từ chối; 「コピーならあげられる」 chỉ đề nghị cho bản sao, không nhận xem bài.',
  ],
  toan_q_2023_07_101: [
    1,
    'Đáp án 1 — 「しなくてもいいんじゃない」: “Chắc không cần đeo đâu.” Câu hỏi là có cần đeo cà vạt tới buổi ăn tuần sau không; đáp án 1 đưa ra lời khuyên trực tiếp. 「していかなかったの？」 hỏi về một lần đã qua; 「私は参加しようと思ってる」 chỉ nói người nói định tham gia, không trả lời quy định trang phục.',
  ],

  toan_q_2023_12_74: [
    3,
    'Đáp án 3 — アとウ: áo len và tem thư. Dịch câu hỏi: “Du học sinh sẽ cho gì vào túi từ bây giờ?” Trên hình, ア là áo len, イ là thuốc và ウ là tem; thoại nói thuốc đã được cho vào túi, còn mẹ nhắc thêm áo len và tem. Vì vậy chọn ア・ウ. Các tổ hợp có イ thêm thuốc đã mang theo; tổ hợp không có áo len hoặc tem thì thiếu một trong hai thứ mới được nhắc.',
  ],
  toan_q_2023_12_75: [
    4,
    'Đáp án 4 — đến hiệu sách tìm sách công thức mới. Dịch câu hỏi: “Nam sinh sẽ làm gì tiếp theo?” Cậu muốn làm bánh táo ngay hôm nay; chị khóa trên chỉ hứa tìm tờ ghi công thức và gửi ảnh nếu tìm thấy. Cô nói sách mới của đầu bếp có thể có công thức, nên cậu định ra hiệu sách. Không phải tìm trên Internet, chép ghi chú ngay hay mượn sách của chị.',
  ],
  toan_q_2023_12_76: [
    2,
    'Đáp án 2 — gọi điện lúc 3 giờ rưỡi. Dịch câu hỏi: “Nữ sinh sẽ gọi điện cho nam sinh lúc mấy giờ?” Cậu tan học lúc 3 giờ, đề xuất nói chuyện qua điện thoại lúc 3 giờ 30 và cô đồng ý. Cậu phải rời nhà lúc 4 giờ 30 để đi làm lúc 5 giờ. Vì thế 3 giờ là trước giờ hẹn, còn 4 giờ 30 và 5 giờ không đúng.',
  ],
  toan_q_2023_12_77: [
    2,
    'Đáp án 2 — đưa vật đựng ô ra cửa vào. Dịch câu hỏi: “Người đàn ông cần làm gì trước tiên?” Quản lý yêu cầu đặt chỗ đựng ô ở ngoài lối vào vì khách có ô ướt và trời có thể mưa tiếp. Hình 2 là cảnh chuyển vật ở cửa; sau đó anh mới gặp quản lý. Hình 1 lau sàn, hình 3 trao đổi đặt chỗ và hình 4 lau bàn ngoài trời đều không phải việc được giao ngay trước tiên.',
  ],
  toan_q_2023_12_78: [
    1,
    'Đáp án 1 — đặt phòng họp số 1. Dịch câu hỏi: “Người phụ nữ cần làm gì trước tiên?” Quản lý đã gửi email báo ngày giờ, nhưng địa điểm chưa được đặt; ông nhờ cô đặt phòng số 1 ngay. Việc in tài liệu chỉ làm sau khi biết số người tham dự, còn quản lý tự kiểm tra danh sách. Vì vậy chưa cần gửi lại email hay hỏi số người trước.',
  ],
  toan_q_2023_12_79: [
    2,
    'Đáp án 2 — đi tới trước cổng lâu đài. Dịch câu hỏi: “Khách làm gì đầu tiên sau khi xuống xe buýt?” Hướng dẫn viên phát vé trước khi xuống xe và dặn mọi người tập trung trước cổng để chụp ảnh. Sau đó đoàn mới vào xem video lịch sử, tự do tham quan rồi ăn trưa. Vì thế không cần mua vé ở cổng và chưa tới lúc xem video hay vào nhà hàng.',
  ],
  toan_q_2023_12_80: [
    1,
    'Đáp án 1 — họa sĩ mà giám đốc yêu thích. Dịch câu hỏi: “Ai vẽ tranh treo trong phòng giám đốc?” Giám đốc nói mình sưu tầm tranh của một họa sĩ ông yêu thích và tin người đó sẽ có ngày đại diện cho Nhật Bản. Ông hiện ít vẽ; tranh của con gái được treo ở nhà riêng. Do đó không phải giám đốc, con gái ông hay một họa sĩ đã nổi tiếng đại diện Nhật Bản.',
  ],
  toan_q_2023_12_81: [
    2,
    'Đáp án 2 — người bạn quay lại lấy đồ bỏ quên. Dịch câu hỏi: “Vì sao nam sinh nói sẽ đến muộn?” Một người bạn từng ngủ ở nhà cậu gọi báo bỏ quên ví và đang quay lại lấy, nên cậu phải chờ. Cậu không ngủ quên; cuộc hẹn ở quán cà phê là của nữ sinh; chuyện xuống nhầm ga được nhắc như lỗi lần trước, không phải lý do lần này.',
  ],
  toan_q_2023_12_82: [
    2,
    'Đáp án 2 — học cách mặc kimono. Dịch câu hỏi: “Nữ du học sinh muốn làm gì trước khi về nước?” Cô được tặng một bộ kimono và muốn tự mặc được, nên nhờ bạn tìm người dạy. Cô nói đã đi suối nước nóng và đi tàu Shinkansen rồi; học nấu món Nhật là việc họ từng làm trước đó.',
  ],
  toan_q_2023_12_83: [
    3,
    'Đáp án 3 — vì giày nhẹ và đi thoải mái. Dịch câu hỏi: “Người đàn ông chọn đôi giày đang mang vì lý do nào?” Anh nói mang thử rồi đi thấy nhẹ, dễ chịu. Anh không biết hoa văn đang thịnh hành, vốn thích màu trầm hơn nhưng mẫu chỉ có màu này, và đôi giày cũng không rẻ.',
  ],
  toan_q_2023_12_84: [
    3,
    'Đáp án 3 — kết bạn được với người Nhật. Dịch câu hỏi: “Điều gì khiến du học sinh vui nhất khi sang Nhật?” Cậu thích xem phim Nhật và tới địa điểm quay phim, nhưng nhấn mạnh điều vui hơn cả là có bạn Nhật. Chuyến đi cùng bạn là kế hoạch sắp tới, chưa phải trải nghiệm đã xảy ra.',
  ],
  toan_q_2023_12_85: [
    4,
    'Đáp án 4 — có những cửa hàng ông không thể vào. Dịch câu hỏi: “Điều gì khiến người đàn ông thất vọng trong chuyến đi gần đây bằng xe lăn?” Ông nói muốn tới vài quán ramen và sushi nhưng không vào được vì chật hoặc chỉ có cầu thang. Thang máy và nhà vệ sinh ở ga đã tăng, phòng khách sạn cũng tiện hơn, nên không phải những điều đó.',
  ],
  toan_q_2023_12_86: [
    2,
    'Đáp án 2 — trang phục khi leo núi. Dịch câu hỏi: “Hai người đang nói về điều gì?” Người phụ nữ hỏi áo len hay áo khoác dễ cởi, và quần jeans có phù hợp không. Họ bàn cách ăn mặc theo nhiệt độ thay đổi khi leo núi; không nói về niềm vui, mùa thích hợp hay cách đi để tránh mệt.',
  ],
  toan_q_2023_12_87: [
    4,
    'Đáp án 4 — cách tránh thiếu nước. Dịch câu hỏi: “Chuyên gia nói về điều gì ở thành phố Yamakawa?” Vì khu vực ít mưa và không có sông lớn, người xưa đào hồ nhân tạo để trữ nước mưa dùng khi cần. Đó là biện pháp bảo đảm nguồn nước; bài không phân loại nông nghiệp, nói về thay đổi lượng mưa hay cách làm sạch sông.',
  ],
  toan_q_2023_12_88: [
    3,
    'Đáp án 3 — cách nhận ra thói quen suy nghĩ của bản thân. Dịch câu hỏi: “Người phụ nữ đang nói về điều gì?” Câu hỏi “còn nửa cốc” hay “chỉ còn nửa cốc” giúp nhận ra xu hướng nhìn nhận tích cực hay tiêu cực. Người nói không hướng dẫn sửa cách nghĩ, dùng từ đúng hay nói sao cho người khác dễ hiểu.',
  ],
  toan_q_2023_12_89: [
    2,
    'Đáp án 2 — 「ご無沙汰しております」: “Lâu rồi không gặp ạ.” Đây là lời chào lịch sự khi gặp lại giáo viên sau thời gian dài. 「会えるのを楽しみにしています」 nói về mong đợi được gặp trong tương lai; 「初めてお目にかかります」 dùng khi lần đầu gặp, trái với tình huống họp lớp gặp lại.',
  ],
  toan_q_2023_12_90: [
    3,
    'Đáp án 3 — 「上着、忘れてるよ」: “Cậu quên áo khoác kìa.” Bạn đang rời lớp nhưng áo vẫn ở trên ghế, nên cần nhắc bạn mang theo. 「置いていったら」 gợi ý cứ để lại; 「取ってくれる？」 nhờ bạn kia lấy áo cho người nói, đảo người sở hữu và người giúp.',
  ],
  toan_q_2023_12_91: [
    1,
    'Đáp án 1 — 「この靴、直してほしいんですが」: “Tôi muốn nhờ sửa đôi giày này.” Gót giày bị rơi và người nói muốn cửa hàng sửa giúp. 「修理しましょうか」 là lời người bán đề nghị sửa giày cho khách; 「いただけますか」 hỏi xin/nhận đôi giày, không yêu cầu sửa.',
  ],
  toan_q_2023_12_92: [
    3,
    'Đáp án 3 — 「これでいい？」: “Làm như thế này được chưa?” Người nói đang học gấp giấy và muốn xác nhận cách gấp hiện tại có đúng không. 「ちょっと折ってみて」 bảo bạn thử gấp; 「折り紙、ある？」 hỏi có giấy gấp hay không, không kiểm tra thao tác vừa làm.',
  ],
  toan_q_2023_12_93: [
    1,
    'Đáp án 1 — 「今日は病院に行かなくちゃいけなくて」: “Hôm nay mình phải đi bệnh viện.” Dịch tình huống: bạn hỏi John vì sao về sớm và không dự tiết học tiếp theo; câu trả lời nêu lý do trực tiếp. Phương án 2 hiểu nhầm là tiết học bị hủy; 3 hỏi lại vì sao không tham dự, không đáp vào câu hỏi ban đầu. Lời thoại này được khôi phục từ transcript audio đầy đủ.',
  ],
  toan_q_2023_12_94: [
    1,
    'Đáp án 1 — 「そんなに難しかった？」: “Khó đến vậy sao?” Người kia nói cuốn sách kinh tế mượn được khó tới mức chẳng hiểu gì; hỏi lại mức độ khó là phản hồi tự nhiên. 「ちょっとはわかったんだね」 lại cho rằng có hiểu một chút; 「読みやすかったなら、良かった」 nói sách dễ đọc, trái với lời than.',
  ],
  toan_q_2023_12_95: [
    3,
    'Đáp án 3 — 「ここで食べちゃいけないんですね」: “À, vậy là không được ăn ở đây nhỉ.” Nhân viên lịch sự yêu cầu khách không ăn uống trong sảnh; câu này xác nhận đã hiểu quy định. 「ロビーでいただきます」 nói vẫn sẽ ăn ở đó; 「遠慮してませんよ」 hiểu nhầm ご遠慮ください là lời nói về sự ngại ngùng. Lựa chọn được bổ sung từ transcript audio đầy đủ.',
  ],
  toan_q_2023_12_96: [
    3,
    'Đáp án 3 — 「お疲れ様でした」: “Anh/chị vất vả rồi.” Nhân viên báo trưởng phòng rằng hôm nay xin phép về sớm như đã báo trước; trưởng phòng đáp lời chào phù hợp khi nhân viên kết thúc công việc. 「早退はしないんですね」 hiểu ngược rằng cô không về sớm; 「お先に失礼します」 là câu nhân viên ra về nói với người ở lại.',
  ],
  toan_q_2023_12_97: [
    2,
    'Đáp án 2 — 「ぜひチャレンジしたいです」: “Tôi rất muốn thử sức.” Nam sinh khuyến khích Rina đăng ký cuộc thi hùng biện, và cô đồng ý muốn tham gia. 「すごく緊張しました」 nói về cảm giác sau một việc đã diễn ra; 「応募してみたんですね」 nhận xét người khác đã đăng ký, không phải lời đáp của Rina.',
  ],
  toan_q_2023_12_98: [
    2,
    'Đáp án 2 — 「見せていただけますか」: “Anh/chị cho tôi xem được không ạ?” Nhân viên mời khách xem bộ vest màu khác; câu này nhận lời và xin xem. 「他の色のは、まだ見ていません」 chỉ nói chưa xem màu khác, không trả lời lời mời; 「いつ届くんですか」 hỏi ngày giao hàng, lạc chủ đề.',
  ],
  toan_q_2023_12_99: [
    3,
    'Đáp án 3 — 「大勢の前で話すの、苦手なんです。すみません」: “Tôi không giỏi nói trước đông người, xin lỗi.” Người phụ nữ nhờ Noda phát biểu khai mạc; đáp án này lịch sự từ chối vì anh ngại phát biểu. 「しなくてよくなったんですね」 nghĩ rằng yêu cầu đã được hủy; 「してくれるんですか」 hỏi lại có phải anh sẽ nhận lời không.',
  ],
  toan_q_2023_12_100: [
    2,
    'Đáp án 2 — 「急いだほうがよさそうだね」: “Có lẽ chúng ta nên đi nhanh lên.” Hai người nghe sấm và lo mưa trước khi tới nhà trọ, nên đề nghị đi nhanh là hợp lý. 「降ってきたんだね」 nói mưa đã bắt đầu rơi, điều chưa được khẳng định; 「降ったほうがいいの」 hiểu sai mong muốn tránh mưa thành mong trời mưa.',
  ],
  toan_q_2023_12_101: [
    1,
    'Đáp án 1 — 「では、私から連絡しておきます」: “Vậy để tôi báo trước.” Hai người thống nhất cần báo trưởng phòng về việc công trình chậm; người nói chủ động nhận liên lạc. 「報告してはいけないんですね」 hiểu ngược là không được báo; 「部長から聞いたんですか」 hỏi nguồn tin, không nhận làm việc đã thống nhất.',
  ],
}

const optionOverrides = {
  toan_q_2023_07_76: ['Rửa bồn tắm', 'Nấu món gà và bắp cải', 'Mua bắp cải', 'Kiểm tra máy in'],
  toan_q_2023_12_74: [
    'ア・イ (áo len và thuốc)',
    'ア・イ・ウ (áo len, thuốc và tem)',
    'ア・ウ (áo len và tem)',
    'イ・ウ (thuốc và tem)',
  ],
  toan_q_2023_12_77: [
    'Lau sàn trong nhà',
    'Đưa vật đựng ô ra lối vào',
    'Đến hỏi quản lý về đặt chỗ',
    'Lau bàn ngoài trời',
  ],
  toan_q_2023_12_86: [
    'Điều thú vị của leo núi',
    'Trang phục khi leo núi',
    'Mùa thích hợp để leo núi',
    'Cách đi bộ để không mệt trên núi',
  ],
  toan_q_2023_12_87: [
    'Thời điểm ngắm hoa',
    'Món ăn khi đi ngắm hoa',
    'Lý do bắt đầu ngắm hoa',
    'Ngắm hoa ngày xưa và ngày nay',
  ],
  toan_q_2023_12_88: [
    'Sự thay đổi của chữ Hán dùng trong tên',
    'Lý do tên viết bằng chữ Hán giảm',
    'Khó khăn khi đặt tên',
    'Suy nghĩ của cha mẹ khi đặt tên',
  ],
  toan_q_2023_12_93: ['今日は病院に行かなくちゃいけなくて。', 'え、次の授業、なくなったの？', 'どうして出ないの？'],
  toan_q_2023_12_95: ['じゃ、ロビーでいただきます。', 'え、遠慮してませんよ。', 'あ、ここで食べちゃいけないんですね。'],
}

const situationTranslations = {
  toan_q_2023_07_89: 'Bạn của bạn không mở được nắp lọ và bạn muốn chủ động giúp. Hãy nói gì?',
  toan_q_2023_07_90: 'Có khách đến; bạn muốn họ chờ ở đây trong lúc mình đi gọi giám đốc. Hãy nói gì?',
  toan_q_2023_07_91: 'Bạn đã gọi cà phê nhưng mãi chưa được mang ra. Hãy nói gì?',
  toan_q_2023_07_92: 'Bạn thấy bức tranh bạn mình treo bị nghiêng và muốn báo cho bạn ấy. Hãy nói gì?',
  toan_q_2023_07_93: 'Đồng nghiệp nhờ bạn phụ sắp xếp kho. Bạn đáp lại thế nào?',
  toan_q_2023_07_94: 'Bạn được cảm ơn vì lời khuyên giúp bài thuyết trình thành công. Bạn trả lời thế nào?',
  toan_q_2023_07_95: 'Bạn cùng lớp rất am hiểu bóng chày. Bạn xác nhận điều đó thế nào?',
  toan_q_2023_07_96: 'Cấp trên bảo rằng có gì chưa rõ thì cứ hỏi. Bạn đáp lại thế nào?',
  toan_q_2023_07_97: 'Người bạn nói phần cơm chiên nhiều đến mức không thể ăn hết. Bạn phản hồi thế nào?',
  toan_q_2023_07_98:
    'Cấp trên muốn xem tài liệu họp trước giờ họp và hỏi khi nào tài liệu hoàn tất. Bạn trả lời thế nào?',
  toan_q_2023_07_99: 'Bạn được báo chiếc bánh mì mình nhờ mua đã bán hết. Bạn phản hồi thế nào?',
  toan_q_2023_07_100: 'Tiền bối được nhờ xem giúp một bài báo cáo. Người ấy trả lời thế nào?',
  toan_q_2023_07_101: 'Bạn hỏi có cần đeo cà vạt tới buổi ăn tuần sau không. Người kia khuyên thế nào?',
  toan_q_2023_12_89: 'Trong buổi họp lớp, bạn gặp lại giáo viên sau khi đã tốt nghiệp khá lâu. Bạn chào thế nào?',
  toan_q_2023_12_90: 'Bạn mình sắp rời lớp nhưng áo khoác vẫn ở trên ghế. Bạn nhắc bạn ấy thế nào?',
  toan_q_2023_12_91: 'Gót giày bị rơi và bạn muốn nhờ nhân viên cửa hàng sửa. Bạn nói thế nào?',
  toan_q_2023_12_92: 'Bạn đang học gấp giấy và muốn hỏi cách gấp đến đây đã đúng chưa. Bạn nói thế nào?',
  toan_q_2023_12_93: 'Một người hỏi John vì sao về sớm và không dự tiết học tiếp theo. John trả lời thế nào?',
  toan_q_2023_12_94:
    'Bạn được nghe rằng cuốn sách kinh tế đã cho mượn khó đến mức người kia không hiểu gì. Bạn hỏi lại thế nào?',
  toan_q_2023_12_95: 'Nhân viên yêu cầu khách không ăn uống trong sảnh. Khách đáp lại thế nào?',
  toan_q_2023_12_96:
    'Nhân viên báo trưởng phòng rằng hôm nay xin phép về sớm như đã báo trước. Trưởng phòng đáp thế nào?',
  toan_q_2023_12_97: 'Bạn được khuyên thử đăng ký cuộc thi hùng biện. Bạn đồng ý thế nào?',
  toan_q_2023_12_98: 'Nhân viên hỏi khách có muốn xem bộ vest màu khác không. Khách trả lời thế nào?',
  toan_q_2023_12_99:
    'Bạn được nhờ phát biểu khai mạc buổi tiệc chào mừng, nhưng không thoải mái nói trước đám đông. Bạn đáp thế nào?',
  toan_q_2023_12_100: 'Hai người nghe tiếng sấm và lo mưa trước khi tới nhà trọ. Một người đề nghị gì?',
  toan_q_2023_12_101:
    'Hai người thống nhất cần báo trưởng phòng rằng công trình bị chậm. Bạn nhận làm việc đó thế nào?',
}

function extractPrintedOptions(script, expectedCount) {
  const found = []
  for (const line of String(script ?? '').split(/\r?\n/u)) {
    const match = line.match(/^\s*([1-4])(?:[.．]\s*|\s+)(.+?)\s*$/u)
    if (!match) continue
    const number = Number(match[1])
    if (number !== found.length + 1) {
      if (number === 1) found.length = 0
      else continue
    }
    found.push(match[2].replace(/\s*[（(]正解\s*[：:]\s*[1-4][）)]\s*$/u, '').trim())
  }
  return found.length >= expectedCount ? found.slice(-expectedCount) : []
}

const examIds = new Set(['toan-n3-202307-full', 'toan-n3-202312-full'])
const exams = master.filter((exam) => examIds.has(exam.id))
if (exams.length !== 2) throw new Error('Expected both 2023 exams; found ' + exams.length)
const questions = exams.flatMap((exam) =>
  exam.parts.filter((part) => part.title.startsWith('Nghe')).flatMap((part) => part.questions)
)
if (questions.length !== 56) throw new Error('Expected 56 listening questions; found ' + questions.length)

const restoredOptionQuestions = []
const imageOptionQuestions = []
const reviewed = []
const mismatches = []
for (const [id, [answer, explanation]] of Object.entries(reviews)) {
  const question = questions.find((item) => item.id === id)
  if (!question?.script) throw new Error('Missing question or transcript: ' + id)
  const markers = [...question.script.matchAll(/正解\s*[：:]\s*([1-4])/gu)].map((match) => Number(match[1]))
  if (markers.some((value) => value !== answer) || question.correctAnswer !== answer || question.answer !== answer) {
    mismatches.push({
      id,
      expected: answer,
      stored: [question.correctAnswer, question.answer],
      transcriptMarkers: markers,
    })
    continue
  }
  let reviewedExplanation = explanation
  if (!/Dịch (?:câu hỏi|tình huống):/u.test(reviewedExplanation) && situationTranslations[id]) {
    const sentenceEnd = reviewedExplanation.indexOf('. ')
    if (sentenceEnd < 0) throw new Error(id + ': could not place Vietnamese situation translation')
    reviewedExplanation =
      reviewedExplanation.slice(0, sentenceEnd + 1) +
      ' Dịch tình huống: ' +
      situationTranslations[id] +
      ' ' +
      reviewedExplanation.slice(sentenceEnd + 1)
  }
  if (optionOverrides[id]) {
    if (optionOverrides[id].length !== question.options.length) throw new Error(id + ': option count changed')
    question.options = optionOverrides[id]
    if (/^toan_q_2023_0?7_(?:76)$/u.test(id) || /^toan_q_2023_12_(?:74|77)$/u.test(id)) imageOptionQuestions.push(id)
    else restoredOptionQuestions.push(id)
  } else if (question.number >= 86) {
    const options = extractPrintedOptions(question.script, question.options.length)
    if (options.length !== question.options.length) throw new Error(id + ': could not recover all printed option text')
    question.options = options
    restoredOptionQuestions.push(id)
  }
  curated[id] = reviewedExplanation
  const exam = exams.find((item) => item.parts.some((part) => part.questions.some((candidate) => candidate.id === id)))
  reviewed.push({
    questionId: id,
    examId: exam.id,
    number: question.number,
    answer,
    transcriptKeyMarkers: markers,
    answerVerification: markers.length ? 'transcript-marker-matched' : 'manually-reviewed-transcript-no-marker',
    answerEvidence: markers.length
      ? '正解 marker trong script trùng khóa đang lưu; chưa đối chiếu khóa JLPT chính thức.'
      : 'Script đoạn nghe không kèm marker 正解; đáp án được rà bằng tình huống và lựa chọn trong transcript, không đối chiếu khóa JLPT chính thức.',
    status: id === 'toan_q_2023_07_77' ? 'needs-visual-choice-mapping' : 'transcript-and-explanation-reviewed',
    optionsRecoveredFromTranscript: restoredOptionQuestions.includes(id),
    optionsTranscribedFromImage: imageOptionQuestions.includes(id),
    recoveredOptions:
      restoredOptionQuestions.includes(id) || imageOptionQuestions.includes(id) ? question.options : null,
    explanation: reviewedExplanation,
  })
}
if (mismatches.length) throw new Error('Stored answers do not match transcript markers: ' + JSON.stringify(mismatches))
if (reviewed.length !== 56) throw new Error('Expected 56 reviewed questions; got ' + reviewed.length)
if (restoredOptionQuestions.length !== 32)
  throw new Error('Expected 32 restored transcript option sets; got ' + restoredOptionQuestions.length)
if (imageOptionQuestions.length !== 3)
  throw new Error('Expected 3 image-transcribed option sets; got ' + imageOptionQuestions.length)

// The answer was already in the listening transcript but the question option was absent;
// confirm the two recovered spoken option lists against the full-audio transcript file.
for (const phrase of ['今日 は 病院 に 行か なく ちゃ いけ なく て', 'ここ で 食べ ちゃ いけ ない ん です ね']) {
  if (!fullTranscriptText.includes(phrase)) throw new Error('Missing recovered option in full transcript: ' + phrase)
}

fs.writeFileSync(masterPath, JSON.stringify(master, null, 2) + '\n')
fs.writeFileSync(curatedPath, JSON.stringify(curated, null, 2) + '\n')
fs.mkdirSync(path.dirname(reportPath), { recursive: true })
fs.writeFileSync(
  reportPath,
  JSON.stringify(
    {
      generatedAt: new Date().toISOString(),
      method:
        'Reviewed 56 listening questions from 2023-07 and 2023-12. Explanations translate the question or situation, identify the answer, and distinguish the other choices. All 28 July keys and the first 15 December keys match attached 正解 markers; the last 13 December scripts have no marker and were checked against their dialogue and answer choices. Choice text for questions 86–101 was restored from the attached script or full-audio transcript; three image choice panels were transcribed by visual inspection in Chrome. No answer key was changed.',
      transcriptSource:
        'data/jlpt_n3_toan_master.json script fields; data/n3_202312_full_transcripts.json for December questions 93 and 95',
      answerKeySource:
        'Attached 正解 markers when present; otherwise dialogue and choice-level review only. Official JLPT key not independently checked.',
      totals: {
        questionsReviewed: reviewed.length,
        explanationsAdded: reviewed.length,
        keysChanged: 0,
        keysMatchedTranscriptMarkers: reviewed.filter((row) => row.transcriptKeyMarkers.length).length,
        keysWithoutTranscriptMarkers: reviewed.filter((row) => !row.transcriptKeyMarkers.length).length,
        keysComparedWithOfficialAnswerKey: 0,
        optionsRecoveredFromTranscript: restoredOptionQuestions.length,
        optionsTranscribedFromImage: imageOptionQuestions.length,
        unresolvedVisualMappings: reviewed.filter((row) => row.status === 'needs-visual-choice-mapping').length,
      },
      restoredOptionQuestions,
      imageOptionQuestions,
      limitations: [
        {
          questionIds: ['toan_q_2023_07_77'],
          issue:
            'The transcript explains that the student accepts the following week through Sunday, but the answer options remain only 1–4 and the date-to-number mapping is absent. The stored key 4 matches the transcript marker but cannot be mapped to a printed date without the source page.',
        },
        {
          questionIds: reviewed.filter((row) => !row.transcriptKeyMarkers.length).map((row) => row.questionId),
          issue:
            'December questions 89–101 do not have 正解 markers in the attached question transcript; their keys were reviewed from the situation/dialogue and choices but not verified against an official key.',
        },
        { issue: 'Original JLPT PDFs and official answer keys were not independently checked for this batch.' },
      ],
      questions: reviewed,
    },
    null,
    2
  ) + '\n'
)
console.log(
  JSON.stringify({
    reviewed: reviewed.length,
    matchedTranscriptKeys: reviewed.filter((row) => row.transcriptKeyMarkers.length).length,
    keysWithoutTranscriptMarkers: reviewed.filter((row) => !row.transcriptKeyMarkers.length).length,
    restoredTranscriptOptions: restoredOptionQuestions.length,
    imageOptionsTranscribed: imageOptionQuestions.length,
    unresolvedVisualMappings: reviewed.filter((row) => row.status === 'needs-visual-choice-mapping').length,
    keysChanged: 0,
    reportPath,
  })
)
