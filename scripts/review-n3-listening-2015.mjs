import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = fileURLToPath(new URL('../', import.meta.url))
const masterPath = path.join(root, 'data/jlpt_n3_toan_master.json')
const curatedPath = path.join(root, 'data/jlpt_n3_explanations_curated.json')
const reportPath = path.join(root, 'reports/n3-quality-audit/listening-2015-source-review.json')
const master = JSON.parse(fs.readFileSync(masterPath, 'utf8').replace(/^\uFEFF/, ''))
const curated = JSON.parse(fs.readFileSync(curatedPath, 'utf8').replace(/^\uFEFF/, ''))

const reviews = {
  toan_q_2015_07_75: {
    answer: 3,
    page: 1,
    explanation: `Đáp án 3 — đổi một ít tiền trước chuyến đi. Dịch câu hỏi: “Nữ sinh sẽ làm gì tiếp theo?” Cô đã đặt khách sạn và vé máy bay; thuốc cũng mua rồi. Tiền thì định đổi ở sân bay nơi đến, nhưng đàn anh khuyên nên chuẩn bị sẵn một ít, nên việc còn phải làm là đổi tiền. 1 và 2 sai vì đã đặt xong; 4 sai vì thuốc đã mua. Ghi nhớ: phân biệt việc đã hoàn thành với lời khuyên mới.`,
  },
  toan_q_2015_07_76: {
    answer: 4,
    page: 2,
    keyEvidence: 'PDF ghi 正解:4',
    explanation: `Đáp án 4 — cho chăn mỏng mùa hè vào túi rác, không buộc riêng bằng dây. Dịch câu hỏi: “Người đàn ông sẽ bỏ chăn như thế nào?” Trung tâm rác nói đồ lớn phải buộc dây; nếu chăn vừa túi rác thì cho vào túi và không buộc dây. Hình 4 khớp cách xử lý chăn mỏng trong túi; 1 là chăn buộc dây, 2 là chăn trong túi nhưng còn buộc vòng ngoài, 3 không dùng túi. Khóa 4 cũng được ghi ngay trong PDF kịch bản. Ghi nhớ: nghe điều kiện 「ゴミ袋に入るなら」 rồi chọn cách xử lý tương ứng.`,
  },
  toan_q_2015_07_77: {
    answer: 2,
    page: 2,
    explanation: `Đáp án 2 — rung chuông báo hết giờ. Dịch câu hỏi: “Ngày hội diễn thuyết, người phụ nữ sẽ làm gì?” Học sinh đã nhận chuẩn bị hội trường; người phụ nữ nhận rung chuông khi đến giới hạn thời gian. Cô chỉ đề nghị quay video nhưng được trả lời rằng chỉ cần cài máy trước; người dẫn chương trình đã là cựu học sinh. Vì vậy 1, 3 và 4 không phải phần việc cô nhận. Ghi nhớ: chọn nhiệm vụ được giao/nhận lời, không chọn việc chỉ được nhắc tới.`,
  },
  toan_q_2015_07_78: {
    answer: 3,
    page: 3,
    explanation: `Đáp án 3 — đưa mẩu giấy báo cho trưởng phòng bộ phận. Dịch câu hỏi: “Người đàn ông phải làm gì tiếp theo?” Khách đã được đưa vào phòng tiếp khách; trưởng phòng đi công tác, còn trưởng bộ phận đang họp. Nữ đồng nghiệp bảo anh viết việc khách đang đợi ra giấy và đưa kín cho trưởng bộ phận. 1 sai vì đã hướng dẫn khách; 2 sai vì trưởng phòng không có mặt; 4 sai vì người phụ nữ sẽ mang trà. Ghi nhớ: theo dõi ai đang có mặt và nhiệm vụ cuối cùng được giao.`,
  },
  toan_q_2015_07_79: {
    answer: 2,
    previousAnswer: 1,
    page: 3,
    explanation: `Đáp án 2 — đi nghe buổi diễn thuyết của thầy Kato. Dịch câu hỏi: “Sinh viên phải làm gì ngay sau giờ học?” Bài luận phải đọc trước buổi học ngày mai, còn buổi diễn thuyết bắt đầu ngay sau tiết này và mọi người bắt buộc dự. Có thể hỏi thầy sau buổi nói chuyện; giáo viên nói không cần viết báo cáo. 1 là việc làm sau đó; 3 không bắt buộc; 4 bị loại vì được dặn rõ không cần viết.`,
  },
  toan_q_2015_07_80: {
    answer: 3,
    page: 4,
    explanation: `Đáp án 3 — chọn và đặt địa điểm tổ chức. Dịch câu hỏi: “Người đàn ông sẽ làm gì trước?” Người phụ nữ sẽ kiểm tra lại lịch của trưởng bộ phận và trưởng phòng; cô cũng nhận xin trưởng phòng phát biểu. Người đàn ông được giao tìm/đặt nhà hàng phù hợp sớm vì cuối tuần đông khách. Anh chỉ báo cho anh Tanaka sau khi chốt ngày và nơi. 1 và 2 do người phụ nữ xử lý; 4 phải đợi đến khi đã có thông tin.`,
  },
  toan_q_2015_07_81: {
    answer: 2,
    page: 4,
    explanation: `Đáp án 2 — các buổi tiệc có khách nước ngoài. Dịch câu hỏi: “Cô giáo thường mặc kimono khi nào?” Cô nói bản thân thường mặc khi dự tiệc có khách nước ngoài. Cưới hỏi và lễ nhập học là dịp nhiều người thường mặc, nhưng không phải dịp cô nêu cho mình. Tết năm nay là lần đầu cô mặc kimono, nên 1 sai; 3 và 4 chỉ là ví dụ chung. Ghi nhớ: phân biệt thói quen cá nhân với tập quán nói chung.`,
  },
  toan_q_2015_07_82: {
    answer: 3,
    page: 4,
    explanation: `Đáp án 3 — muốn học ngoại ngữ trước chuyến công tác. Dịch câu hỏi: “Vì sao gần đây người đàn ông đi làm sớm?” Tháng sau anh đi công tác nước ngoài nên muốn tranh thủ học ngoại ngữ lúc văn phòng yên tĩnh. 1 sai vì sáng không có nhiều cuộc họp; 2 sai vì giấy tờ không tồn đọng; 4 sai vì chỗ ngồi trên tàu chỉ là lợi ích tình cờ, không phải lý do chính.`,
  },
  toan_q_2015_07_83: {
    answer: 4,
    page: 5,
    explanation: `Đáp án 4 — những điều nhận ra khi sống ở Nhật. Dịch câu hỏi: “Nam sinh cho rằng chủ đề nào hay nhất?” Hai người cân nhắc ước mơ tương lai, giới thiệu quê hương và nghiên cứu ở đại học. Nam sinh nghĩ chủ đề nghiên cứu dễ quá chuyên môn, còn hai chủ đề đầu có thể trùng với người khác; anh đề xuất kể những điều thú vị mà cô nhận ra trong cuộc sống ở Nhật. 1–3 đều được nhắc tới nhưng không phải lựa chọn anh đánh giá hay nhất.`,
  },
  toan_q_2015_07_84: {
    answer: 1,
    page: 6,
    explanation: `Đáp án 1 — số ca làm thêm của cậu ấy tăng. Dịch câu hỏi: “Vì sao nam sinh gần đây bận hơn?” Hai đồng nghiệp ở cửa hàng tiện lợi nghỉ, khiến số ngày cậu phải đi làm tăng lên. 2 và 3 là lý do hai người kia nghỉ/tăng bận, không phải nguyên nhân trực tiếp của cậu; 4 sai vì cậu nói mình không còn thời gian học cho kế hoạch du học. Ghi nhớ: phân biệt lý do đồng nghiệp nghỉ với hệ quả đối với người đang được hỏi.`,
  },
  toan_q_2015_07_85: {
    answer: 4,
    page: 6,
    explanation: `Đáp án 4 — khó tập trung khi muốn học. Dịch câu hỏi: “Nữ du học sinh gặp khó khăn gì?” Ba đứa trẻ trong gia đình chủ nhà thường rủ cô chơi; giao tiếp tiếng Nhật tăng là điều tốt, nhưng lúc cần học cô khó tập trung. 1 sai vì cô ăn được mọi món; 2 sai vì cô thích khác biệt văn hóa; 3 sai vì cơ hội nói tiếng Nhật không hề ít. Ghi nhớ: đáp án nằm sau 「ただね」, chỗ người nói chuyển sang nêu điều phiền lòng.`,
  },
  toan_q_2015_07_86: {
    answer: 1,
    page: 7,
    explanation: `Đáp án 1 — muốn được thầy giáo khen. Dịch câu hỏi: “Vì sao họa sĩ bắt đầu vẽ mỗi ngày từ nhỏ?” Ông muốn thầy giáo mình yêu quý khen rằng ông vẽ giỏi, nên chăm chỉ vẽ. 2 sai vì ông vốn có bạn thân nhưng chủ động không đi chơi; 3 là kết quả về sau, không phải động cơ ban đầu; 4 là phản ứng của mọi người sau khi ông đoạt giải. Ghi nhớ: phân biệt nguyên nhân với kết quả xảy ra sau đó.`,
  },
  toan_q_2015_07_87: {
    answer: 4,
    page: 8,
    explanation: `Đáp án 4 — mời cô tham gia câu lạc bộ guitar. Dịch câu hỏi: “Nam sinh muốn nói gì?” Cậu kể câu lạc bộ muốn tăng thành viên và mọi người nghĩ cô tham gia thì tốt; còn nói người mới cũng có thể bắt đầu sau khi vào. 1 sai vì cậu không xin cô dạy guitar; 2 sai vì không xin mượn đàn; 3 sai vì buổi hòa nhạc chỉ được nhắc để trấn an cô. Ghi nhớ: đây là lời mời tham gia, không phải lời nhờ giúp riêng.`,
  },
  toan_q_2015_07_88: {
    answer: 1,
    page: 8,
    explanation: `Đáp án 1 — gọi để từ chối công việc làm thêm. Dịch câu hỏi: “Nam sinh gọi điện để làm gì?” Cậu đã tìm đường và biết đi tàu cộng xe buýt mất hơn một giờ mỗi chiều; cậu không có bằng lái nên không thể dùng xe máy. Cậu nói đó là công việc tốt nhưng xin thôi. 2 sai vì đã tự tìm đường; 3 sai vì không thể mượn xe máy; 4 sai vì cậu chưa mượn xe.`,
  },
  toan_q_2015_07_89: {
    answer: 2,
    page: 8,
    explanation: `Đáp án 2 — leo núi ban đêm nguy hiểm. Dịch câu hỏi: “Người đàn ông chủ yếu nói về điều gì?” Ông thừa nhận ngắm bình minh là điều thú vị, rồi nhấn mạnh ban đêm lạnh, tối, dễ mất sức và bị thương; người chưa quen leo núi nên tránh. 1 là điều hấp dẫn được nêu làm mở đầu; 3 và 4 chỉ là các yếu tố giải thích nguy hiểm, không phải chủ đề bao quát.`,
  },
  toan_q_2015_07_90: {
    answer: 1,
    page: 9,
    explanation: `Đáp án 1 — “Xin mời dùng chiếc bút này.” Dịch tình huống: bút khách đang dùng ở khách sạn hết mực nên nhân viên đưa bút khác. 1 vừa lịch sự vừa đúng hành động trao đồ thay thế. 2 hỏi “cái này thế nào?” như đang xin đánh giá; 3 mang nghĩa “ở đây là đủ/được rồi”, không phải lời đưa bút. Ghi nhớ: dùng 「こちらをお使いください」 khi mời khách sử dụng vật mình đưa.`,
  },
  toan_q_2015_07_91: {
    answer: 3,
    page: 9,
    explanation: `Đáp án 3 — “Tôi nên để đĩa ở đâu ạ?” Dịch tình huống: ăn xong ở căng tin đại học nhưng không biết chỗ trả đĩa. 3 hỏi đúng vị trí đặt/trả đĩa. 1 hỏi mượn đĩa ở đâu; 2 xin phép dùng đĩa, trong khi đã ăn xong. Ghi nhớ: 「どこに置けばいいですか」 hỏi nơi đặt đồ vật.`,
  },
  toan_q_2015_07_92: {
    answer: 2,
    page: 9,
    explanation: `Đáp án 2 — “Này, sắp dính tương cà vào áo cậu kìa!” Dịch tình huống: bạn thấy áo bạn mình sắp bị bẩn vì tương cà. 「ついちゃうよ」 cảnh báo tương cà sắp dính vào áo. 1 nói “phải cho tương cà vào” — ngược với ý cảnh báo; 3 nói “sẽ bị đổ”, không diễn đạt trực tiếp vết bẩn sắp dính lên áo. Ghi nhớ: 「つく」 là dính/bám lên bề mặt.`,
  },
  toan_q_2015_07_93: {
    answer: 1,
    page: 9,
    explanation: `Đáp án 1 — “Nếu thấy điểm nào cần sửa thì nói mình nhé.” Dịch tình huống: đang tập thuyết trình và muốn nghe bạn góp ý. 1 chủ động xin người nghe nêu điều họ nhận thấy. 2 cảm ơn vì đã nhận được lời khuyên tốt, nhưng chưa hề có lời khuyên; 3 hỏi người khác muốn được góp ý điều gì, đảo ngược vai.`,
  },
  toan_q_2015_07_94: {
    answer: 3,
    page: 10,
    explanation: `Đáp án 3 — “Xin chờ thêm một chút.” Dịch lời nhân viên: “Quý khách đã chọn món xong chưa ạ?” 3 cho biết khách chưa quyết định và cần thêm thời gian. 1 「承知しました」 là “tôi đã hiểu/đã nhận yêu cầu”, không trả lời việc chọn món; 2 「遠慮なく」 thường nhận lời mời hay cho phép, cũng không phù hợp.`,
  },
  toan_q_2015_07_95: {
    answer: 1,
    page: 10,
    explanation: `Đáp án 1 — “À, xin lỗi.” Dịch lời nhắc: “Đây là thư viện, bạn có thể nói nhỏ hơn một chút được không?” 1 nhận lỗi và xin lỗi vì nói to. 2 hỏi “không nghe thấy à?” không đáp ứng yêu cầu; 3 「はい、お願いします」 là “vâng, nhờ bạn”, dùng khi nhờ người khác làm giúp chứ không phải khi được nhắc nhở.`,
  },
  toan_q_2015_07_96: {
    answer: 2,
    page: 10,
    explanation: `Đáp án 2 — “Cảm ơn, họ nói khi nào hàng đến?” Dịch lời đồng nghiệp: “Văn phòng phẩm anh nhờ đặt lúc nãy, tôi đặt rồi.” 2 cảm ơn và hỏi thời gian giao hàng, tiếp nối tự nhiên sau khi đặt. 1 hỏi cất món đã nhận ở đâu, nhưng hàng chưa tới; 3 hứa sẽ đặt sau, trái với việc đã đặt xong.`,
  },
  toan_q_2015_07_97: {
    answer: 3,
    page: 10,
    explanation: `Đáp án 3 — “Ơ, bạn không có điện thoại à?” Dịch lời nhờ: “Cho mình dùng điện thoại một chút nhé?” 3 là phản ứng phù hợp khi nghe người kia cần mượn vì không có máy. 1 hỏi muốn mua loại nào, như đang chọn điện thoại; 2 cảm ơn rồi dùng máy, đảo vai người cho mượn với người đi mượn.`,
  },
  toan_q_2015_07_98: {
    answer: 2,
    page: 10,
    explanation: `Đáp án 2 — “Anh ấy đã về nhà rồi.” Dịch câu hỏi: “Anh/chị có biết trưởng phòng đang ở đâu không?” 2 trả lời trực tiếp vị trí hiện tại của trưởng phòng. 1 nói trưởng phòng có lẽ không biết một điều gì đó, nhầm người biết/không biết; 3 nói “tôi đã báo trước”, không cho biết ông ấy ở đâu.`,
  },
  toan_q_2015_07_99: {
    answer: 1,
    page: 10,
    explanation: `Đáp án 1 — “Ừ, mình cũng nghe vậy, mừng cho anh ấy.” Dịch tin: “Anh Yamada ở câu lạc bộ đã được nhận vào nơi anh ấy mong muốn.” 1 xác nhận tin tốt và chúc mừng. 2 「あんなに頑張ってたのに」 mang sắc thái “dù đã cố gắng đến vậy…” thường dẫn đến kết quả trái kỳ vọng; 3 chúc sớm có kết quả, trong khi việc đã được quyết định.`,
  },
  toan_q_2015_07_100: {
    answer: 2,
    page: 10,
    explanation: `Đáp án 2 — 「どこが分からないの？」, “Em không hiểu chỗ nào?” Dịch tình huống: nam sinh nhờ tiền bối chỉ giúp phần chưa rõ trong cách viết báo cáo công tác. 2 hỏi cụ thể chỗ nào cần giải thích. 1 hỏi đã nhận báo cáo chưa, không đúng điều đang vướng; 3 chỉ dẫn nơi nộp báo cáo, không giải đáp cách viết. Ghi nhớ: 「教えてほしいところがある」 là muốn được chỉ dẫn một phần cụ thể.`,
  },
  toan_q_2015_07_101: {
    answer: 1,
    page: 10,
    explanation: `Đáp án 1 — “Nghe vui đấy, tổ chức khi nào?” Dịch lời rủ: “Mọi người đang tính cùng nhau đốt pháo hoa, cậu thấy sao?” 1 thể hiện hứng thú và hỏi thêm lịch. 2 nói buổi đó đã bị hủy dù chưa ai nói vậy; 3 đề nghị rủ thêm ai đó, không trả lời người nói có muốn tham gia hay không.`,
  },
  toan_q_2015_07_102: {
    answer: 3,
    page: 10,
    explanation: `Đáp án 3 — “À, vậy phải mua thêm giấy rồi.” Dịch lời nhắc: “Sáng nay dùng nhiều giấy photocopy, chắc sắp hết rồi nhỉ?” 3 nhận ra cần bổ sung giấy. 1 nói còn thừa khá nhiều, trái với “sắp hết”; 2 nói đã photocopy không nhiều, cũng trái với việc dùng rất nhiều. Ghi nhớ: 「残り少ない」 nghĩa là lượng còn lại ít.`,
  },
  toan_q_2015_12_75: {
    answer: 4,
    page: 1,
    keyEvidence: 'PDF ghi 正解:4',
    explanation: `Đáp án 4 — thuê xe đạp ở ga. Dịch câu hỏi: “Nữ sinh đi đến chùa Nishiyama bằng cách nào?” Xe buýt vừa chạy, chuyến sau phải chờ một giờ; đi bộ mất gần một giờ, còn taxi cũng phải đợi. Nhân viên gợi ý xe đạp: đi khoảng 20 phút, đường bằng phẳng, có biển chỉ đường và được phát bản đồ; cô đồng ý. Các hình 1–3 không ứng với xe đạp; hình 4 là phương tiện được chọn. PDF kịch bản cũng ghi khóa 4.`,
  },
  toan_q_2015_12_76: {
    answer: 3,
    page: 2,
    keyEvidence: 'PDF ghi 正解:3',
    explanation: `Đáp án 3 — đặt vé chuyến 7 giờ. Dịch câu hỏi: “Người con đặt vé lúc mấy giờ?” Chuyến 6 giờ đã hết chỗ; chuyến 7 giờ và 8 giờ còn chỗ. Người mẹ nói 7 giờ tốt hơn, dù nhớ năm ngoái từng đi chuyến 5 giờ; con xác nhận không có chuyến gần 5 giờ. 5 giờ và 6 giờ đều không đặt được; 8 giờ không phải giờ mẹ chọn. Khóa 3 được in trong PDF.`,
  },
  toan_q_2015_12_77: {
    answer: 2,
    page: 2,
    keyEvidence: 'PDF ghi 正解:2',
    explanation: `Đáp án 2 — dịch phiếu khảo sát sang tiếng Anh. Dịch câu hỏi: “Người phụ nữ phải làm gì?” Yamamoto đang soạn phiếu bằng tiếng Nhật; người quản lý sẽ kiểm tra trước, rồi giao cô dịch sang tiếng Anh để gửi các chi nhánh ở nước ngoài. 1 sai vì phiếu tiếng Nhật đã có người soạn; 3 là việc người quản lý nhận làm; 4 là bước gửi đi sau khi dịch. Khóa 2 được in trong PDF.`,
  },
  toan_q_2015_12_78: {
    answer: 3,
    page: 3,
    keyEvidence: 'PDF ghi 正解:3',
    explanation: `Đáp án 3 — dọn mặt bàn cạnh cửa sổ. Dịch câu hỏi: “Người phụ nữ phải làm gì trước tiên?” Cô đã được nhờ hướng dẫn khách đặt chỗ sau 30 phút; ban đầu quản lý cũng bảo cô mang trà cho khách đang đợi, nhưng sau đó ông nhận tự làm phần trà. Việc còn giao cho cô ngay là dọn bàn khách đã rời đi. 1 và 2 không còn là việc đầu tiên; 4 rửa bát để sau khi rảnh. PDF ghi khóa 3.`,
  },
  toan_q_2015_12_79: {
    answer: 3,
    page: 3,
    keyEvidence: 'PDF ghi 正解:3',
    explanation: `Đáp án 3 — chuyển các thùng sang phòng bên cạnh. Dịch câu hỏi: “Người đàn ông sẽ làm gì trước tiên?” Anh đề nghị đi lấy thức ăn nhưng cửa hàng sẽ giao; bàn không thể xếp lại khi còn nhiều thùng trên đó, nên cần dời thùng sang phòng bên cạnh trước. Sau đó mới sắp bàn, rồi chuẩn bị đĩa và cốc. 1 không cần làm; 2 là bước kế tiếp sau khi dọn thùng; 4 làm sau khi những việc khác xong. Khóa 3 được in trong PDF.`,
  },
  toan_q_2015_12_80: {
    answer: 1,
    page: 4,
    keyEvidence: 'PDF ghi 正解:1',
    explanation: `Đáp án 1 — mang bưu thiếp hướng dẫn và đồ uống. Dịch câu hỏi: “Sinh viên phải mang gì trong ngày chạy marathon?” Bưu thiếp đã gửi về nhà phải đưa ở quầy tiếp nhận; đồ uống mỗi người tự chuẩn bị. Mũ được phát ngay trong ngày nên không cần tự mang. Hình 1 ghép đúng bưu thiếp với chai nước; các hình có mũ sai vì mũ do ban tổ chức phát, còn lựa chọn thiếu bưu thiếp hoặc nước thì chưa đủ. PDF ghi khóa 1.`,
  },
  toan_q_2015_12_81: {
    answer: 2,
    page: 4,
    keyEvidence: 'PDF ghi 正解:2',
    explanation: `Đáp án 2 — học riêng tại nhà với giáo viên đến dạy. Dịch câu hỏi: “Người phụ nữ đang luyện mặc kimono bằng cách nào?” Cô từng học lớp kimono nhưng đã quên, nên hiện mỗi tuần mời giáo viên đến nhà dạy riêng. 1 là lớp cô đã học trước đây; 3 là DVD cô từng thử nhưng thấy khó; 4 là chuyện người đàn ông nói về cách học ngày xưa, không phải cách cô đang làm. PDF ghi khóa 2.`,
  },
  toan_q_2015_12_82: {
    answer: 4,
    page: 5,
    keyEvidence: 'PDF ghi 正解:4',
    explanation: `Đáp án 4 — cô ngại lái xe ở nơi không quen. Dịch câu hỏi: “Vì sao người phụ nữ không thuê xe khi đi du lịch?” Cả cô và chồng đều có bằng lái, giá thuê cũng không quá cao, nhưng cô sợ lái ở vùng đất lạ. 1 là khả năng người đàn ông nêu về con mình, không phải lý do của cô; 2 sai vì giá không đắt; 3 sai vì hai người có bằng. PDF ghi khóa 4.`,
  },
  toan_q_2015_12_83: {
    answer: 3,
    page: 5,
    keyEvidence: 'PDF ghi 正解:3',
    explanation: `Đáp án 3 — trò chuyện tới sáng với các bạn cùng lớp. Dịch câu hỏi: “Du học sinh nói kỷ niệm đáng nhớ nhất là gì?” Ngắm hoa anh đào và chuyến du lịch đều là kỷ niệm đẹp; nhưng điều đọng lại nhất là đêm nói chuyện với cả lớp về tương lai và những nỗi lo. Cùng học trước kỳ thi cũng là kỷ niệm vui, nhưng không phải điều cậu chọn là số một. PDF ghi khóa 3.`,
  },
  toan_q_2015_12_84: {
    answer: 2,
    page: 6,
    keyEvidence: 'PDF ghi 正解:2',
    explanation: `Đáp án 2 — thêm ảnh và một phần truyện tranh. Dịch câu hỏi: “Nam sinh góp ý gì cho tài liệu thuyết trình của bạn nữ?” Anh khen lời giải thích đã dùng từ dễ hiểu, nhưng khuyên thêm ảnh hoặc trích một đoạn manga để người nghe hứng thú hơn. 1 sai vì phần diễn đạt đã ổn; 3 và 4 là việc của khảo sát do chính nam sinh làm, không phải góp ý cho tài liệu của cô. PDF ghi khóa 2.`,
  },
  toan_q_2015_12_85: {
    answer: 3,
    page: 6,
    keyEvidence: 'PDF ghi 正解:3',
    explanation: `Đáp án 3 — kích cỡ bao đựng hộ chiếu lớn hơn. Dịch câu hỏi: “Sản phẩm lần này thay đổi điểm nào?” Khóa kéo và túi đựng vé vẫn như trước; màu sắc cũng vẫn có bảy loại. Điểm mới là toàn bộ bao được làm lớn hơn một cỡ để lấy hộ chiếu ra dễ hơn. Vì vậy 1, 2 và 4 là những đặc điểm không thay đổi. Khóa 3 được in trong PDF.`,
  },
  toan_q_2015_12_86: {
    answer: 1,
    page: 7,
    keyEvidence: 'PDF ghi 正解:1',
    explanation: `Đáp án 1 — nhầm ngày lưu trú. Dịch câu hỏi: “Khi đặt phòng, khách đã nhầm điều gì?” Cô đặt hai đêm nhưng đặt bắt đầu từ ngày mai, trong khi đến nhận phòng hôm nay. Tên khách, khách sạn và loại phòng đều khớp; lễ tân chỉ đề nghị phòng loại khác cho đêm nay với giá cao hơn. 2–4 vì thế không phải lỗi đặt ban đầu. PDF ghi khóa 1.`,
  },
  toan_q_2015_12_87: {
    answer: 2,
    page: 7,
    explanation: `Đáp án 2 — những điều cần chú ý khi leo núi. Dịch câu hỏi: “Người hướng dẫn nói về điều gì?” Ông nhắc đi theo tốc độ phù hợp, tránh đá ướt trơn và nghỉ khi mệt. 1 sai vì không nêu lịch trình; 3 chỉ là một phần nhỏ về cách đi bộ, không bao quát cả lời nhắc; 4 chỉ nhắc giữ phép lịch sự ở câu cuối. Trọng tâm là các lưu ý an toàn khi leo.`,
  },
  toan_q_2015_12_88: {
    answer: 3,
    page: 8,
    explanation: `Đáp án 3 — mời nam sinh vào câu lạc bộ phim. Dịch câu hỏi: “Nữ sinh muốn nhắn điều gì?” Cô kể câu lạc bộ chiếu phim nước ngoài và làm báo giới thiệu phim, rồi mời cậu đến xem thử vì câu lạc bộ đang thiếu thành viên. 1 sai vì cô không nhờ cậu giới thiệu phim; 2 sai vì không làm phim; 4 chỉ là đề nghị đến tham quan trước khi quyết định, còn mục đích chính là rủ tham gia câu lạc bộ.`,
  },
  toan_q_2015_12_89: {
    answer: 3,
    page: 8,
    explanation: `Đáp án 3 — phong trào bảo vệ công trình cũ. Dịch câu hỏi: “Phóng viên đang đưa tin về điều gì?” Thành phố định phá thư viện hơn 100 năm tuổi để xây siêu thị, còn người dân đang thu thập ý kiến và kiến nghị dừng kế hoạch. 1 sai vì không tập trung kể lịch sử thư viện; 2 sai vì kế hoạch là phá bỏ, không phải chuyển địa điểm; 4 sai vì không phân tích lý do người dân yêu công trình.`,
  },
  toan_q_2015_12_90: {
    answer: 2,
    page: 9,
    explanation: `Đáp án 2 — “Tôi phải đặt vé như thế nào ạ?” Dịch tình huống: dùng máy ở cửa hàng tiện lợi để đặt vé xem phim nhưng không biết thao tác, nên hỏi nhân viên cách làm. 1 「予約したらどうですか」 là “sao bạn không đặt thử?”, đưa lời khuyên; 3 「教えましょうか」 là “để tôi chỉ cho nhé?”, lời đề nghị của người hướng dẫn chứ không phải câu khách cần nói.`,
  },
  toan_q_2015_12_91: {
    answer: 3,
    page: 9,
    explanation: `Đáp án 3 — “Món này tôi không gọi ạ.” Dịch tình huống: nhà hàng đem ra món mà khách không đặt. 3 báo lịch sự rằng mình không gọi món đó. 1 nói không định ăn món ấy nhưng không chỉ rõ nhà hàng mang nhầm; 2 chủ động đổi sang món khác, trong khi trước hết cần báo rằng món được đem ra không đúng.`,
  },
  toan_q_2015_12_92: {
    answer: 1,
    page: 9,
    explanation: `Đáp án 1 — “Xin lỗi, cho tôi đi qua một chút được không?” Dịch tình huống: muốn đi qua nhưng lối hẹp nên bị chắn. 1 xin người đang đứng đó nhường đường. 2 hỏi có nên đi vòng ra phía sau không; 3 yêu cầu người kia đi theo lối này, đảo ngược người cần di chuyển.`,
  },
  toan_q_2015_12_93: {
    answer: 1,
    page: 9,
    explanation: `Đáp án 1 — “Để xe ở đây chắc là không được đâu nhỉ?” Dịch tình huống: nhắc bạn không được đỗ xe máy tại vị trí này. 1 cảnh báo nhẹ nhàng rằng không được để xe ở đây. 2 「駐車しなくちゃね」 lại mang nghĩa “phải đỗ xe”; 3 nói có biển bảo đỗ xe ở đây, trái với tình huống.`,
  },
  toan_q_2015_12_94: {
    answer: 3,
    page: 9,
    explanation: `Đáp án 3 — “Tôi cần dùng vào tháng sau, nên trước lúc đó thì được.” Dịch lời nhờ: “Nếu không phiền, cho tôi mượn quyển sách đó được không?” 3 đồng ý cho mượn nhưng đặt giới hạn vì tháng sau mình cần sách. 1 nói không có thời gian đọc, không trả lời việc cho mượn; 2 hỏi xin mượn trong hai tuần, tức là lời của người muốn mượn chứ không phải người được hỏi.`,
  },
  toan_q_2015_12_95: {
    answer: 1,
    page: 10,
    explanation: `Đáp án 1 — “Bút chì thì mình có.” Dịch lời hỏi: “Này, có bút hay gì tương tự không?” 1 đưa ra món gần nhất với thứ người kia cần. 2 hỏi “dùng vở thay được không?”, không đưa dụng cụ để viết; 3 hỏi lại “bút không được à?”, không giải quyết nhu cầu. Ghi nhớ: 「ペンか何か」 là xin một vật viết, nên bút chì là phương án thay thế hợp lý.`,
  },
  toan_q_2015_12_96: {
    answer: 1,
    page: 10,
    explanation: `Đáp án 1 — “À, xin lỗi.” Dịch lời nhắc: “Xin vui lòng không sử dụng điện thoại di động ở đây.” 1 nhận lỗi và dừng lại. 2 hiểu ngược thành “may quá, ở đây dùng được”; 3 「いいえ、結構です」 là lời từ chối một đề nghị, không phải đáp lại quy định cấm.`,
  },
  toan_q_2015_12_97: {
    answer: 3,
    page: 10,
    explanation: `Đáp án 3 — “Thật vậy sao? Để tôi kiểm tra.” Dịch câu hỏi: “Bảng trong tài liệu hôm qua bạn làm có số liệu sai không?” 3 thể hiện ngạc nhiên và sẽ kiểm tra lại. 1 nói “may quá, yên tâm rồi”, chỉ hợp khi đã được xác nhận là đúng; 2 lặp lại câu hỏi mà không trả lời hay hành động.`,
  },
  toan_q_2015_12_98: {
    answer: 2,
    page: 10,
    explanation: `Đáp án 2 — “Không sao, để lần khác nhé.” Dịch lời xin lỗi: “Hôm qua bạn đã mời mình đi ăn mà mình không đi được, xin lỗi nhé.” 2 chấp nhận lời xin lỗi và hẹn dịp khác. 1 chỉ nói tiếc nuối; 3 lại xin lỗi người vừa xin lỗi mình, đảo vai người mắc lỗi.`,
  },
  toan_q_2015_12_99: {
    answer: 1,
    page: 10,
    explanation: `Đáp án 1 — “À, lâu rồi mới gặp nhỉ.” Dịch lời chào: “Anh/chị Suzuki, lâu rồi không gặp, tình cờ thật.” 1 đáp lại đúng sắc thái gặp lại sau thời gian dài. 2 「こちらこそ、よろしく」 dùng khi nhận lời nhờ/giới thiệu; 3 「いいえ、けっこうです」 từ chối lời mời hay đề nghị.`,
  },
  toan_q_2015_12_100: {
    answer: 2,
    page: 10,
    explanation: `Đáp án 2 — “Đúng là cô ấy đã trưởng thành với vai trò thư ký.” Dịch nhận xét: “Cô Yamada mới vào công ty cuối cùng cũng ra dáng thư ký rồi nhỉ.” 2 đồng tình và diễn đạt sự tiến bộ của cô. 1 chỉ nhắc lại rằng cô trông giống thư ký; 3 biến ý thành tin đồn rằng cô sẽ trở thành thư ký, trong khi cô đã là nhân viên thư ký.`,
  },
  toan_q_2015_12_101: {
    answer: 3,
    page: 10,
    explanation: `Đáp án 3 — “Đây là đi công tác chứ có phải đi chơi đâu.” Dịch lời nhận xét: “Nghe nói lần này đi công tác ở nước ngoài à? Hay thật.” 3 đáp lại rằng chuyến đi là vì công việc, không phải kỳ nghỉ. 1 nói về một chuyến công tác bận rộn trong quá khứ; 2 xin quà lưu niệm, coi chuyến đi như đi chơi.`,
  },
  toan_q_2015_12_102: {
    answer: 2,
    page: 10,
    explanation: `Đáp án 2 — “Ừ, cứ bắt tay vào làm đã.” Dịch lời động viên: “Hai chúng ta làm việc này thì vất vả, nhưng cứ than phiền cũng chẳng giải quyết được gì.” 2 đồng ý và thúc đẩy cùng làm thử. 1 hiểu 「始まらない」 theo nghĩa đen là công việc chưa bắt đầu; 3 đề nghị đi báo rằng mình không làm được, trái với tinh thần câu nói.`,
  },
}

const examsByDate = new Map([
  ['07', master.find((exam) => exam.id === 'toan-n3-201507-full')],
  ['12', master.find((exam) => exam.id === 'toan-n3-201512-full')],
])
const questionMap = new Map(
  [...examsByDate.values()].flatMap((exam) => exam.parts.flatMap((part) => part.questions)).map((q) => [q.id, q])
)
const reviewed = []

for (const [id, review] of Object.entries(reviews)) {
  const q = questionMap.get(id)
  if (!q) throw new Error(`Question not found: ${id}`)
  const matchesPreviousKey =
    review.previousAnswer && q.correctAnswer === review.previousAnswer && q.answer === review.previousAnswer
  const alreadyReviewed = q.correctAnswer === review.answer && q.answer === review.answer
  if (!matchesPreviousKey && !alreadyReviewed) {
    throw new Error(`${id}: expected current answer ${review.answer}, got ${q.correctAnswer}/${q.answer}`)
  }
  if (matchesPreviousKey) {
    q.correctAnswer = review.answer
    q.answer = review.answer
  }
  curated[id] = review.explanation
  reviewed.push({
    questionId: id,
    examId: id.includes('_07_') ? 'toan-n3-201507-full' : 'toan-n3-201512-full',
    number: q.number,
    answer: review.answer,
    previousAnswer: review.previousAnswer ?? null,
    sourcePdfPage: review.page,
    answerEvidence:
      review.keyEvidence ||
      'PDF xác nhận bối cảnh/câu hỏi; lời giải được suy luận từ transcript trong master, không phải khóa chính thức',
    explanation: review.explanation,
  })
}

if (reviewed.length !== 56) throw new Error(`Expected 56 reviewed questions; got ${reviewed.length}`)
fs.writeFileSync(curatedPath, JSON.stringify(curated, null, 2) + '\n')
fs.writeFileSync(masterPath, JSON.stringify(master, null, 2) + '\n')
fs.mkdirSync(path.dirname(reportPath), { recursive: true })
fs.writeFileSync(
  reportPath,
  JSON.stringify(
    {
      generatedAt: new Date().toISOString(),
      method:
        'Vietnamese explanations were written against the transcript stored with each question. Local script PDFs independently confirm the question contexts and print answer keys for all 12 questions in 12/2015 Mondai 1-2, and only 07/2015 question 76. The remaining answers are reasoning reviews, not official JLPT key validation. Diagram-based listening items were visually checked in Chrome where noted in each explanation.',
      sourcePdfs: [
        'data/n3_scripts/6. N3 7-2015/6. N3 7-2015 (script).pdf',
        'data/n3_scripts/6. N3 12-2015/6. N3 12-2015 (script).pdf',
      ],
      totals: {
        questionsReviewed: reviewed.length,
        explanationsAdded: reviewed.length,
        answerKeysPrintedInLocalPdfs: reviewed.filter((q) => q.answerEvidence.startsWith('PDF ghi')).length,
        answerKeysNotIndependentlyValidatedByPdf: reviewed.filter((q) => !q.answerEvidence.startsWith('PDF ghi'))
          .length,
      },
      questions: reviewed,
    },
    null,
    2
  ) + '\n'
)
console.log(
  JSON.stringify({
    reviewed: reviewed.length,
    reportPath,
    pdfKeyChecks: reviewed.filter((q) => q.answerEvidence.startsWith('PDF ghi')).length,
  })
)
