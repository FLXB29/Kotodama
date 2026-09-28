import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = fileURLToPath(new URL('../', import.meta.url))
const masterPath = path.join(root, 'data/jlpt_n3_toan_master.json')
const curatedPath = path.join(root, 'data/jlpt_n3_explanations_curated.json')
const reportPath = path.join(root, 'reports/n3-quality-audit/listening-2017-transcript-review.json')
const master = JSON.parse(fs.readFileSync(masterPath, 'utf8').replace(/^\uFEFF/, ''))
const curated = JSON.parse(fs.readFileSync(curatedPath, 'utf8').replace(/^\uFEFF/, ''))

const reviews = {
  toan_q_2017_07_75: {
    answer: 2,
    explanation:
      'Đáp án 2 — chơi piano. Dịch câu hỏi: “Nữ sinh sẽ làm gì ở buổi giao lưu quốc tế?” Cả nhóm sẽ biểu diễn một bài quen thuộc để mọi người cùng hát; cô được nhờ chơi piano vì từng học nhạc cụ này. 1 là phần người tham dự làm; 3 là đàn guitar của nam sinh; 4 là violin của Sato. Cô ngần ngại vì lâu rồi không chơi nhưng đồng ý tập.',
  },
  toan_q_2017_07_76: {
    answer: 3,
    needsVisualMapping: true,
    explanation:
      'Đáp án đang lưu là 3. Dịch câu hỏi: “Người phụ nữ sẽ vẽ lại chỗ nào?” Quản lý thấy nút áo nhỏ là chủ ý, khen hình túi, và chỉ nhận xét phần tay áo còn đơn điệu rồi yêu cầu chỉnh thêm. Vì vậy nội dung transcript chỉ ra tay áo; dữ liệu hiện chỉ có bốn ký hiệu hình, không có ảnh để ánh xạ vị trí đó với số 3 hoặc giải thích từng hình nhiễu. Câu này cần đối chiếu hình trước khi coi khóa đã xác nhận.',
  },
  toan_q_2017_07_77: {
    answer: 2,
    explanation:
      'Đáp án 2 — đặt tài liệu lên bàn của người tham dự. Dịch câu hỏi: “Trước tiên người đàn ông phải làm gì?” Bản sao đã chuẩn bị xong và kế hoạch đổi từ phát ở quầy tiếp nhận sang đặt lên bàn từng người. Máy quay đã được mang tới hội trường, nhưng vị trí quay chỉ hỏi thầy khi thầy tới sau khoảng một giờ. Vì vậy 1 là kế hoạch cũ; 3 đã làm xong; 4 là việc làm sau.',
  },
  toan_q_2017_07_78: {
    answer: 3,
    explanation:
      'Đáp án 3 — xác nhận số người có thể dự. Dịch câu hỏi: “Người phụ nữ phải làm gì?” Chủ tịch câu lạc bộ sẽ gửi email ban đầu và chọn điệu nhảy; người phụ nữ nhắc mọi người trả lời cho cô để chốt số người. Đồ uống và bánh chỉ tính sau khi biết số lượng. Vì vậy cô không cần gửi email đầu tiên, chọn điệu nhảy hay mua đồ ăn ngay.',
  },
  toan_q_2017_07_79: {
    answer: 4,
    explanation:
      'Đáp án 4 — ngày mai đến trung tâm đồ thất lạc ở ga Minami. Dịch câu hỏi: “Người phụ nữ sẽ làm gì?” Hôm nay thẻ tháng được giữ ở quầy ga Yamakawa; từ ngày hôm sau mọi đồ thất lạc được chuyển sang trung tâm ở ga Minami. Cô không thể đi hôm nay nên ngày mai phải tới Minami. 1–2 là lấy hôm nay; 3 là tới sai ga vào ngày mai.',
  },
  toan_q_2017_07_80: {
    answer: 2,
    explanation:
      'Đáp án 2 — đặt câu hỏi về nội dung bài nói. Dịch câu hỏi: “Hôm nay người tham gia làm gì sau khi nghe bài nói của bạn bên cạnh?” Giáo viên yêu cầu hai người nghe nội dung của nhau và nhất định đặt câu hỏi. Sửa cách dùng từ đã làm tuần trước; tư thế để tuần sau; tốc độ nói tự kiểm tra ở nhà. Vì vậy chỉ 2 là nhiệm vụ trong buổi hôm nay.',
  },
  toan_q_2017_07_81: {
    answer: 2,
    explanation:
      'Đáp án 2 — lương theo giờ chưa cao. Dịch câu hỏi: “Vì sao nam sinh định nghỉ việc ở tiệm bánh?” Anh cần tiết kiệm để đi du học nên muốn tìm việc có mức lương cao hơn. Anh nói khoảng cách xa và giờ bắt đầu sớm không làm mình bận tâm; ban đầu còn thích làm bánh. Vì thế 1, 3 và 4 không phải lý do anh nêu.',
  },
  toan_q_2017_07_82: {
    answer: 4,
    explanation:
      'Đáp án 4 — thứ Sáu lúc 4 giờ chiều. Dịch câu hỏi: “Cô ấy đổi sang buổi học nào?” Cô muốn học thứ Năm lúc 4 giờ nhưng giờ đó đã kín; nhân viên đề xuất cùng giờ hôm sau và cô đồng ý. 1–2 sai ngày; 3 sai giờ. Điểm nghe: 「翌日の同じ時間」 là cùng giờ vào ngày kế tiếp.',
  },
  toan_q_2017_07_83: {
    answer: 2,
    explanation:
      'Đáp án 2 — dự thi đầu vào cao học. Dịch câu hỏi: “Vì sao nam du học sinh về nước?” Anh về để thi vào cao học ở quê nhà. Bố mẹ vừa sang thăm gần đây; đám cưới người bạn là dự định nếu còn thời gian; anh cũng mong gặp chị gái và em bé nhưng chưa chắc gặp được. Các lựa chọn đó không phải lý do chính của chuyến đi.',
  },
  toan_q_2017_07_84: {
    answer: 1,
    explanation:
      'Đáp án 1 — đạp xe 30 phút mỗi sáng. Dịch câu hỏi: “Gần đây người phụ nữ bắt đầu làm gì để khỏe hơn?” Cô đã quyết định đạp xe mỗi sáng từ ba tháng trước. Câu lạc bộ thể thao là việc cô từng làm rồi bỏ vì tốn tiền; ngủ sớm và ăn sáng đầy đủ là kết quả tích cực phát sinh sau khi tập, không phải hoạt động mới cô chọn.',
  },
  toan_q_2017_07_85: {
    answer: 3,
    explanation:
      'Đáp án 3 — máy bền, khó hỏng. Dịch câu hỏi: “Người đàn ông khen điểm nào ở máy tính mới?” Anh nói giá không rẻ, nhưng máy chắc chắn và khó hỏng, hợp với việc thường mang đi. Nhiều màu không quan trọng với khách; máy cũng không đặc biệt nhẹ. Vì vậy 1, 2 và 4 đều không phải ưu điểm anh nhấn mạnh.',
  },
  toan_q_2017_07_86: {
    answer: 4,
    explanation:
      'Đáp án 4 — mất nhiều thời gian ghi chép lời nhắn. Dịch câu hỏi: “Người nhân viên nam từng mắc lỗi gì?” Anh nghe đúng tên và nội dung, đồng thời chú ý dùng kính ngữ, nhưng viết quá lâu khiến khách bực mình. Quản lý dặn ngoài sự lịch sự còn phải ghi nhanh. 1–3 không khớp: anh không dùng sai kính ngữ, không quên tên, cũng không nghe nhầm lời nhắn.',
  },
  toan_q_2017_07_87: {
    answer: 4,
    restoreOptions: true,
    explanation:
      'Đáp án 4 — anh ấy hồi hộp nhưng nhờ tiếng cổ vũ nên cố gắng thắng. Dịch câu hỏi: “Vận động viên nam nhận xét gì về trận đấu?” Anh nói mình hồi hộp; khi bị dẫn điểm đã nghĩ có thể thua, nhưng nghe tiếng mọi người cổ vũ nên quyết tâm và có thêm sức. 1 sai vì trận thật khác lúc tập; 2 không nói thiếu luyện tập; 3 sai vì đối thủ rất mạnh. Lựa chọn chữ được khôi phục từ transcript.',
  },
  toan_q_2017_07_88: {
    answer: 2,
    restoreOptions: true,
    explanation:
      'Đáp án 2 — cửa hàng nơi khách có thể ở gần và chơi với mèo. Dịch câu hỏi: “Phát thanh viên đang giới thiệu điều gì?” Quán Mikes cho khách uống cà phê/trà và ngắm, vuốt ve, chơi với mèo nếu làm theo quy định. 1 nói việc nuôi mèo ở nhà, 3 về loại thức ăn, 4 về đặt tên chỉ là chi tiết phụ. Lựa chọn chữ được khôi phục từ transcript.',
  },
  toan_q_2017_07_89: {
    answer: 3,
    restoreOptions: true,
    explanation:
      'Đáp án 3 — tác động của lễ hội đối với thị trấn. Dịch câu hỏi: “Phát thanh viên nói về khía cạnh nào của lễ hội?” Lễ hội thu hút khách, giúp nhiều người biết đến thị trấn và kéo thêm khách du lịch cả ngoài thời gian tổ chức; thanh niên địa phương cũng hiểu hơn về quê mình. 1 lịch sử và 2 lý do khởi đầu không được kể; 4 không hỏi ý kiến cư dân. Lựa chọn chữ được khôi phục từ transcript.',
  },
  toan_q_2017_07_90: {
    answer: 1,
    restoreOptions: true,
    explanation:
      'Đáp án 1 — 「使い方、教えようか」: “Mình chỉ cách dùng cho nhé?” Người đàn em đang không biết sử dụng máy tính, nên đề nghị hướng dẫn là phù hợp. 2 nhờ người kia dạy mình; 3 chỉ cho phép dùng máy nhưng không giải quyết việc họ đang bối rối. Lựa chọn chữ được khôi phục từ transcript.',
  },
  toan_q_2017_07_91: {
    answer: 2,
    restoreOptions: true,
    explanation:
      'Đáp án 2 — 「このケーキは卵を使っていますか」: “Bánh này có dùng trứng không ạ?” Người nói dị ứng nên cần hỏi thành phần. 1 yêu cầu làm bánh không có trứng, không hỏi chiếc bánh hiện tại có chứa trứng không; 3 hỏi mình có phải ăn trứng không, trái mục đích. Lựa chọn chữ được khôi phục từ transcript.',
  },
  toan_q_2017_07_92: {
    answer: 2,
    restoreOptions: true,
    explanation:
      'Đáp án 2 — 「こちらにサインをいただきたいんですが」: “Tôi muốn xin trưởng phòng ký vào đây.” Cách nói lịch sự này trực tiếp xin chữ ký tại chỗ chỉ định. 1 nhờ người khác đi lấy chữ ký giúp; 3 hỏi sẽ ký ở đâu và dùng lối nói khiêm nhường về việc mình ký, không đúng yêu cầu. Lựa chọn chữ được khôi phục từ transcript.',
  },
  toan_q_2017_07_93: {
    answer: 1,
    restoreOptions: true,
    explanation:
      'Đáp án 1 — 「ねえ、急がないと」: “Này, mình phải nhanh lên thôi.” Tàu sắp chạy nên cần giục bạn. 2 nói tàu vừa rời đi và 3 nói tàu đã đi mất, đều là chuyện đã muộn, không khớp lúc còn kịp lên tàu. Lựa chọn chữ được khôi phục từ transcript.',
  },
  toan_q_2017_07_94: {
    answer: 3,
    restoreOptions: true,
    explanation:
      'Đáp án 3 — 「僕でよければ」: “Nếu anh/chị thấy tôi xem được thì…” Đàn em nhờ đàn anh xem báo cáo; đây là lời nhận lời khiêm nhường. 1 nói người khác đã xem giúp và vui cho họ; 2 hỏi có muốn xem đến vậy không, không phải cách nhận lời. Lựa chọn chữ được khôi phục từ transcript.',
  },
  toan_q_2017_07_95: {
    answer: 2,
    restoreOptions: true,
    explanation:
      'Đáp án 2 — “Có ở văn phòng khoa mình.” Câu hỏi là nơi lấy tờ rơi du học, nên thông tin về văn phòng khoa trả lời đúng địa điểm. 1 nói chọn nước du học nào cũng được; 3 nói không biết nơi nào nổi tiếng, không trả lời chỗ lấy tờ rơi. Lựa chọn chữ được khôi phục từ transcript.',
  },
  toan_q_2017_07_96: {
    answer: 2,
    restoreOptions: true,
    explanation:
      'Đáp án 2 — đồng ý sẽ thử hỏi ý kiến giáo viên. Người nghe được khuyên nên trao đổi với giáo viên vì nghiên cứu không tiến triển; 「そうだね」 chấp nhận đề nghị. 1 cảm ơn vì người kia đã đi hỏi thay mình; 3 nói còn quá sớm, ngược với lời khuyên. Lựa chọn chữ được khôi phục từ transcript.',
  },
  toan_q_2017_07_97: {
    answer: 3,
    restoreOptions: true,
    explanation:
      'Đáp án 3 — đồng cảm rằng chọn chủ đề thật khó. Người nói đang than khó quyết định chủ đề cho cuộc thi hùng biện; câu này tiếp nhận cảm xúc tự nhiên. 1 hỏi có bị cấm tự chọn không; 2 hiểu nhầm là chủ đề đã được quyết định. Lựa chọn chữ được khôi phục từ transcript.',
  },
  toan_q_2017_07_98: {
    answer: 2,
    restoreOptions: true,
    explanation:
      'Đáp án 2 — 「うん、後で片付けるよ」: “Ừ, lát nữa mình sẽ dọn.” Người kia nhận xét bàn bừa bộn và khuyên sắp xếp, nên câu trả lời nhận lời là hợp lý. 1 tiếp tục ra lệnh người khác dọn; 3 cảm ơn vì đã dọn giúp, nhưng chưa ai làm việc đó. Lựa chọn chữ được khôi phục từ transcript.',
  },
  toan_q_2017_07_99: {
    answer: 3,
    restoreOptions: true,
    explanation:
      'Đáp án 3 — 「じゃ、今から行こうか」: “Vậy mình đi ngay bây giờ nhé?” Người kia rủ đi ăn trước khi căng tin đông; đây là lời đồng ý và đề xuất đi ngay. 1 hỏi đã đông chưa; 2 nói muốn ăn sớm nhưng không đáp lại lời rủ một cách tự nhiên. Lựa chọn chữ được khôi phục từ transcript.',
  },
  toan_q_2017_07_100: {
    answer: 1,
    restoreOptions: true,
    explanation:
      'Đáp án 1 — 「ええ、かまいませんよ」: “Được chứ, không sao đâu.” Người nói xin phép sao chép một phần tài liệu, và câu này đồng ý cho phép. 2 hỏi lại liệu tài liệu đã bị sao chép; 3 hiểu nhầm rằng mình được yêu cầu đi sao chép. Lựa chọn chữ được khôi phục từ transcript.',
  },
  toan_q_2017_07_101: {
    answer: 1,
    restoreOptions: true,
    explanation:
      'Đáp án 1 — nhờ gửi bưu thiếp giúp. Người kia đang tới bưu điện và hỏi có cần làm gì tiện thể không; đây là yêu cầu phù hợp. 2 chỉ chỉ đường tới bưu điện; 3 nói mình không thể đi cùng, nhưng người kia không rủ đi cùng. Lựa chọn chữ được khôi phục từ transcript.',
  },
  toan_q_2017_07_102: {
    answer: 3,
    restoreOptions: true,
    explanation:
      'Đáp án 3 — “Vậy đặt chỗ thì còn ý nghĩa gì nữa.” Người nói đã đặt bàn nhưng vẫn phải chờ gần nửa tiếng; câu này đồng tình với sự bất bình. 1 khuyên đặt trước lần tới dù họ đã đặt lần này; 2 nói vui vì ăn được thong thả, trái với việc bị chờ lâu. Lựa chọn chữ được khôi phục từ transcript.',
  },
  toan_q_2017_12_75: {
    answer: 3,
    needsVisualMapping: true,
    explanation:
      'Đáp án đang lưu là 3. Dịch tình huống: người chồng muốn hộp cơm dáng dài để vừa túi đi làm, có hai tầng xếp chồng; anh từ chối mua bình nước trong dịp này. Transcript xác định loại hộp cơm cần mua, nhưng dữ liệu chỉ có bốn ký hiệu hình, không có hình các mẫu để xác định lựa chọn 3 có đúng kiểu hộp đó hay giải thích từng lựa chọn còn lại. Cần khôi phục hình trước khi xác nhận khóa.',
  },
  toan_q_2017_12_76: {
    answer: 4,
    explanation:
      'Đáp án 4 — phòng tiếp khách. Dịch câu hỏi: “Người đàn ông sẽ đợi trưởng phòng Yamamoto ở đâu?” Khách ban đầu đề nghị đợi ở sảnh, nhưng lễ tân chỉ phòng tiếp khách đã chuẩn bị tài liệu và trà; sau đó họ sẽ đưa ông đi xem nhà máy. Vì vậy 3 là nơi ông định đợi trước khi được hướng dẫn; nhà máy và phòng họp không phải nơi chờ.',
  },
  toan_q_2017_12_77: {
    answer: 1,
    explanation:
      'Đáp án 1 — cách sử dụng nhà ăn. Dịch câu hỏi: “Cô sinh viên sẽ hướng dẫn du học sinh mới điều gì?” Cô có thể ăn trưa cùng bạn ấy và chỉ cách gọi món ở nhà ăn. Sinh viên vụ nghỉ trưa đúng lúc đó, còn cô có tiết lúc 1 giờ nên một người khác sẽ lo giấy tờ và bảng tin. Thư viện có nhân viên hướng dẫn. Vì vậy 2–4 không thuộc phần cô nhận.',
  },
  toan_q_2017_12_78: {
    answer: 2,
    needsVisualMapping: true,
    explanation:
      'Đáp án đang lưu là 2. Dịch tình huống: ghế đã được mang ra và khách đang ngồi chờ; quản lý còn dặn mang trà lạnh cho họ. Rau cho món salad chỉ cần gọi thêm nếu thiếu, còn tiền lẻ do quản lý đi đổi ở ngân hàng. Transcript cho biết việc kế tiếp là đem trà, nhưng phương án hiện chỉ là bốn ký hiệu hình nên chưa thể xác nhận số 2 hoặc giải thích từng hình nhiễu. Cần đối chiếu lại hình lựa chọn.',
  },
  toan_q_2017_12_79: {
    answer: 1,
    explanation:
      'Đáp án 1 — tới phòng photocopy lấy phần giấy đã in. Dịch câu hỏi: “Trước tiên nam sinh phải làm gì?” Phần giấy còn lại đã in xong nhưng chưa được mang về; cô nhờ cậu lấy nó trước. Sau đó cậu mới giúp ghim tài liệu, rồi mọi người ra ngoài phát. Cô gái đang tự dọn đống giấy rơi dưới sàn. Vì vậy 2–4 là việc sau hoặc việc của người khác.',
  },
  toan_q_2017_12_80: {
    answer: 3,
    explanation:
      'Đáp án 3 — viết ra những điều mình biết về chùa trước. Dịch câu hỏi: “Sau đây sinh viên làm gì trước tiên?” Giáo viên phát giấy để ghi trong khoảng năm phút trước khi xem video; sau video họ mới trao đổi với bạn bên cạnh. 1 là bước tiếp theo; 2 không được yêu cầu đi nghiên cứu; 4 diễn ra sau khi xem phim.',
  },
  toan_q_2017_12_81: {
    answer: 2,
    explanation:
      'Đáp án 2 — việc chuyển tuyến tàu điện phức tạp. Dịch câu hỏi: “Nam du học sinh đang gặp khó khăn gì trong cuộc sống ở Tokyo?” Ban đầu đông người làm anh bối rối nhưng anh đã quen; hiện anh hay đi nhầm tuyến vì nhiều tàu và chuyển tuyến phức tạp, đôi khi phải hỏi người khác và đến muộn. Anh nói được tiếng Nhật. Do đó 1 và 4 không còn là vấn đề; 3 không được nhắc.',
  },
  toan_q_2017_12_82: {
    answer: 1,
    explanation:
      'Đáp án 1 — các cầu thủ chủ động gọi và động viên nhau. Dịch câu hỏi: “Thầy nói đội đã làm tốt điều gì nhất?” Thầy khen các em thường xuyên gọi nhau trong trận; tiếng động viên giúp đồng đội có thêm sức. Thầy nhắc hai bàn thua vì phòng thủ chưa tốt, và chậm chuyền bóng vì suy nghĩ quá lâu. Hai điểm sau là việc cần luyện thêm, không phải điểm mạnh.',
  },
  toan_q_2017_12_83: {
    answer: 1,
    explanation:
      'Đáp án 1 — cảnh nhìn từ phòng khách sạn rất đẹp. Dịch câu hỏi: “Vì sao khách sạn Nakayama được chọn số một?” Khảo sát nêu cảnh biển nhìn từ phòng đẹp đến nghẹt thở. Đường đi lại kém thuận tiện; buffet trưa ngon và hòa nhạc hằng đêm là những điều hai người trò chuyện thêm chứ không phải lý do của khảo sát. Vì vậy 2–4 sai.',
  },
  toan_q_2017_12_84: {
    answer: 3,
    explanation:
      'Đáp án 3 — trúng bộ dụng cụ golf trong chương trình đố vui. Dịch câu hỏi: “Vì sao người đàn ông bắt đầu chơi golf?” Anh vốn không thấy golf thú vị và từng từ chối lời mời của bạn; sau khi trúng bộ gậy/dụng cụ, anh bắt đầu dùng để tránh lãng phí. Nhận ra mình ít vận động là kết quả về sau; 1 và 2 không phải động cơ.',
  },
  toan_q_2017_12_85: {
    answer: 4,
    explanation:
      'Đáp án 4 — thành thật nói mình đang hồi hộp. Dịch câu hỏi: “Giáo viên hết run khi phát biểu bằng cách nào?” Tập luyện kỹ và thở sâu trước khi nói đều không giúp; giáo viên thử nói ngay đầu bài rằng mình đang căng thẳng, rồi thấy dễ chịu hơn và dần hết run. Vì vậy 1–3 là những cách đã thử nhưng không hiệu quả.',
  },
  toan_q_2017_12_86: {
    answer: 1,
    explanation:
      'Đáp án 1 — viết về điều chưa hiểu trong giờ học. Dịch câu hỏi: “Nam sinh quyết định viết gì cho báo cáo xã hội học?” Bạn nữ gợi ý có thể tìm hiểu phần chưa rõ; cậu nói mình muốn thử cách đó để ôn bài. Cậu từng chọn điều thú vị, còn phần sách giáo khoa chưa được dạy là dự định của bạn nữ. 2 và 3 không phải lựa chọn lần này của cậu.',
  },
  toan_q_2017_12_87: {
    answer: 2,
    restoreOptions: true,
    explanation:
      'Đáp án 2 — lý do sở thú này nổi tiếng. Dịch câu hỏi: “Phát thanh viên đang nói về điều gì?” Khách có thể quan sát động vật ở cự ly gần và đặt trước để tự cho ngựa, voi ăn; đây là điểm khiến sở thú được yêu thích. 1 chỉ tả đông khách; 3 không chỉ nói độ dễ thương; 4 nói sư tử con đang có thể xem, không phải nguyên nhân bao quát. Lựa chọn chữ được khôi phục từ transcript.',
  },
  toan_q_2017_12_88: {
    answer: 4,
    restoreOptions: true,
    explanation:
      'Đáp án 4 — mục đích dùng phim trong giờ học. Dịch câu hỏi: “Giáo viên đang nói về điều gì?” Phim giúp luyện nghe tiếng Nhật đời sống, có thể dùng hội thoại để luyện nói và tìm hiểu văn hóa. 1 cốt truyện phim chưa được kể; 2 đặc điểm chung của phim Nhật không phải trọng tâm; 3 phong tục là một điều học được, không phải toàn bộ mục đích. Lựa chọn chữ được khôi phục từ transcript.',
  },
  toan_q_2017_12_89: {
    answer: 1,
    restoreOptions: true,
    explanation:
      'Đáp án 1 — cách giảm lượng rác. Dịch câu hỏi: “Hai người đang nói về điều gì?” Người phụ nữ giảm chai và lon bằng cách tự pha trà; người đàn ông tính nấu ăn để bớt hộp và túi dùng một lần, còn có thể tận dụng vỏ rau. Họ nói về mẹo giảm rác, không bàn quy tắc bỏ rác, phân loại hay tái chế. Lựa chọn chữ được khôi phục từ transcript.',
  },
  toan_q_2017_12_90: {
    answer: 2,
    restoreOptions: true,
    explanation:
      'Đáp án 2 — 「写真を撮っていただけませんか」: “Anh/chị có thể chụp ảnh giúp chúng tôi được không?” Người nói muốn nhờ người gần đó chụp ảnh cả nhóm. 1 hỏi xin phép tự chụp ảnh; 3 đề nghị chụp ảnh cho người khác. Lựa chọn chữ được khôi phục từ transcript.',
  },
  toan_q_2017_12_91: {
    answer: 1,
    restoreOptions: true,
    explanation:
      'Đáp án 1 — 「傘、忘れてるんじゃない？」: “Cậu không quên ô đấy chứ?” Bạn sắp rời lớp nhưng ô vẫn cạnh ghế, nên nhắc họ có thể đã quên. 2 yêu cầu đừng mang ô đi, trái mục đích; 3 rủ để ô lại trong lớp. Lựa chọn chữ được khôi phục từ transcript.',
  },
  toan_q_2017_12_92: {
    answer: 3,
    restoreOptions: true,
    explanation:
      'Đáp án 3 — 「すみません。どなたかいらっしゃいませんか」: “Xin lỗi, có ai ở đây không ạ?” Khách vào cửa hàng nhưng không thấy nhân viên, nên gọi người phục vụ. 1 hỏi người đối diện là ai; 2 hỏi mặt hàng này thế nào, không gọi nhân viên. Lựa chọn chữ được khôi phục từ transcript.',
  },
  toan_q_2017_12_93: {
    answer: 2,
    restoreOptions: true,
    explanation:
      'Đáp án 2 — 「そのままにしておいてください」: “Xin cứ để nguyên như vậy.” Người phụ nữ đang dọn máy tính nhưng người nói sắp dùng ngay; cần nhờ cô đừng cất. 1 yêu cầu dọn tiếp; 3 nhờ cô sử dụng máy tính thay mình. Lựa chọn chữ được khôi phục từ transcript.',
  },
  toan_q_2017_12_94: {
    answer: 3,
    restoreOptions: true,
    explanation:
      'Đáp án 3 — 「水ならあるけど」: “Nếu là nước thì mình có.” Người nói khát và hỏi có trà hay gì uống không; đưa ra nước là đáp án hữu ích. 1 hỏi trà không được sao; 2 nói không cần dù người kia đang khát. Lựa chọn chữ được khôi phục từ transcript.',
  },
  toan_q_2017_12_95: {
    answer: 3,
    restoreOptions: true,
    explanation:
      'Đáp án 3 — 「分かりました。報告します」: “Tôi hiểu rồi, tôi sẽ báo cáo.” Người nghe được dặn truyền đạt ý kiến trong cuộc họp cho trưởng phòng và xác nhận sẽ làm. 1 hỏi trưởng phòng có truyền đạt không; 2 nhờ người khác giúp, đều không đáp lại chỉ thị. Lựa chọn chữ được khôi phục từ transcript.',
  },
  toan_q_2017_12_96: {
    answer: 1,
    restoreOptions: true,
    explanation:
      'Đáp án 1 — 「そうしていただけますか」: “Vâng, phiền anh/chị gọi giúp tôi.” Nhân viên khách sạn đề nghị gọi taxi vì trời mưa; khách chấp nhận. 2 phủ nhận đã gọi taxi, 3 cảm ơn như thể nhân viên đã gọi xong, trong khi mới đang hỏi xin phép. Lựa chọn chữ được khôi phục từ transcript.',
  },
  toan_q_2017_12_97: {
    answer: 2,
    restoreOptions: true,
    explanation:
      'Đáp án 2 — “Không, chắc là chưa đâu.” Người kia hỏi đã từng gặp trước đây chưa, nên câu trả lời phù hợp là phủ nhận một cách dè dặt. 1 hiểu nhầm 「前に」 thành phía trước; 3 hỏi đã làm mất thứ gì ở đâu. Lựa chọn chữ được khôi phục từ transcript.',
  },
  toan_q_2017_12_98: {
    answer: 1,
    restoreOptions: true,
    explanation:
      'Đáp án 1 — nhờ mua kem. Người kia đang đi siêu thị và hỏi có cần mua gì không; đây là lời nhờ mua một món. 2 tự thông báo rằng mình sẽ mua sữa, đảo vai hành động; 3 nói không thể đi cùng, nhưng không ai rủ đi cùng. Lựa chọn chữ được khôi phục từ transcript.',
  },
  toan_q_2017_12_99: {
    answer: 1,
    restoreOptions: true,
    explanation:
      'Đáp án 1 — hỏi nhà hàng đóng cửa từ khi nào. Câu trước nói quán sushi từng hay đi cùng đã đóng cửa lâu rồi; hỏi 「いつごろから」 tiếp nối tự nhiên. 2 hỏi về giờ sớm, 3 hỏi liệu quán mới nghỉ từ hôm nay, không khớp thông tin đã đóng lâu. Lựa chọn chữ được khôi phục từ transcript.',
  },
  toan_q_2017_12_100: {
    answer: 2,
    restoreOptions: true,
    explanation:
      'Đáp án 2 — xin lỗi vì đã nhận nhưng chưa trả lời email. Người gửi hỏi email tài liệu đã tới chưa; người nghe xác nhận đã nhận và xin lỗi vì chưa phản hồi. 1 nói mình chưa gửi email, đảo vai người gửi; 3 hứa đem giao trực tiếp, không cần thiết khi tài liệu đã gửi qua email. Lựa chọn chữ được khôi phục từ transcript.',
  },
  toan_q_2017_12_101: {
    answer: 1,
    restoreOptions: true,
    explanation:
      'Đáp án 1 — 「本当、量多いですね」: “Đúng thật, phần này nhiều quá.” Người ăn nhận xét suất cà ri quá lớn; câu này đồng tình. 2 nói phần ăn thiếu, trái ngược; 3 đề nghị ăn một mình, không giải quyết nhận xét về khẩu phần. Lựa chọn chữ được khôi phục từ transcript.',
  },
  toan_q_2017_12_102: {
    answer: 2,
    restoreOptions: true,
    explanation:
      'Đáp án 2 — 「ううん、気にしないで」: “Không sao đâu, đừng bận tâm.” Người bạn xin lỗi vì không đi bowling được; câu đáp này an ủi và chấp nhận lời xin lỗi. 1 nói tiếc thay, nghe như thể chính người nói lỡ việc; 3 lại xin lỗi, không đáp với vai người được xin lỗi. Lựa chọn chữ được khôi phục từ transcript.',
  },
}

function isPlaceholderOptions(options) {
  return (
    Array.isArray(options) &&
    options.length >= 3 &&
    options.every((option) => typeof option === 'string' && /^[⓵①②③④➀➁➂➃]$/.test(option))
  )
}

function extractPrintedOptions(script) {
  const matches = [...String(script ?? '').matchAll(/^\s*([1-4])\.\s*(.+?)\s*$/gm)]
  if (matches.length < 3) return []
  const numbers = matches.map((match) => Number(match[1]))
  if (!numbers.every((number, index) => number === index + 1)) return []
  return matches.map((match) => match[2].trim())
}

const examIds = new Set(['toan-n3-201707-full', 'toan-n3-201712-full'])
const exams = master.filter((exam) => examIds.has(exam.id))
if (exams.length !== 2) throw new Error('Expected both 2017 exams; found ' + exams.length)

const questionMap = new Map(
  exams.flatMap((exam) => exam.parts.flatMap((part) => part.questions)).map((question) => [question.id, question])
)
const reviewed = []
const restoredOptionQuestions = []
const keyMismatches = []

for (const [id, review] of Object.entries(reviews)) {
  const question = questionMap.get(id)
  if (!question) throw new Error('Question not found: ' + id)
  if (!question.script) throw new Error('Transcript missing: ' + id)
  if (question.correctAnswer !== review.answer || question.answer !== review.answer) {
    keyMismatches.push({
      questionId: id,
      expected: review.answer,
      actual: [question.correctAnswer, question.answer],
    })
    continue
  }

  if (review.restoreOptions) {
    const options = extractPrintedOptions(question.script)
    if (options.length !== question.options.length) {
      throw new Error(id + ': could not recover ' + question.options.length + ' options from transcript')
    }
    if (isPlaceholderOptions(question.options)) {
      question.options = options
    } else if (JSON.stringify(question.options) !== JSON.stringify(options)) {
      throw new Error(id + ': stored options differ from transcript choices')
    }
    restoredOptionQuestions.push(id)
  }

  curated[id] = review.explanation
  reviewed.push({
    questionId: id,
    examId: id.includes('_07_') ? 'toan-n3-201707-full' : 'toan-n3-201712-full',
    number: question.number,
    answer: review.answer,
    answerEvidence:
      'Đối chiếu luận cứ với transcript gắn trong dữ liệu câu hỏi; không có khóa PDF/khóa JLPT độc lập trong lượt rà này.',
    status: review.needsVisualMapping ? 'needs-visual-mapping' : 'transcript-reviewed',
    optionsRecoveredFromTranscript: Boolean(review.restoreOptions),
    explanation: review.explanation,
  })
}

if (keyMismatches.length) {
  throw new Error('Stored answer keys differ from this transcript review: ' + JSON.stringify(keyMismatches))
}
if (reviewed.length !== 56) throw new Error('Expected 56 reviewed questions; got ' + reviewed.length)
if (restoredOptionQuestions.length !== 32) {
  throw new Error('Expected 32 option lists recovered from transcripts; got ' + restoredOptionQuestions.length)
}

fs.writeFileSync(curatedPath, JSON.stringify(curated, null, 2) + '\n')
fs.writeFileSync(masterPath, JSON.stringify(master, null, 2) + '\n')
fs.mkdirSync(path.dirname(reportPath), { recursive: true })
fs.writeFileSync(
  reportPath,
  JSON.stringify(
    {
      generatedAt: new Date().toISOString(),
      method:
        'All 56 stored answers were reviewed against the transcripts attached to the local question data. Explanations include a Vietnamese rendering of the prompt, transcript-based reasoning and distractor analysis. The local source PDFs were not inspected in this pass, so no answer key is independently PDF- or JLPT-key-verified. The 32 Mondai 4–5 questions whose visible options were only circled-number placeholders now show the numbered choices transcribed in the question script. July question 76 and December questions 75 and 78 still need their missing visual mappings.',
      transcriptSource: 'data/jlpt_n3_toan_master.json, script field on each question',
      answerKeySource: 'Existing stored keys only; not independently validated against answer-key documents',
      totals: {
        questionsReviewed: reviewed.length,
        explanationsAdded: reviewed.length,
        keysChanged: 0,
        keysComparedWithIndependentAnswerKey: 0,
        optionsRecoveredFromTranscript: restoredOptionQuestions.length,
        unresolvedVisualMappings: reviewed.filter((question) => question.status === 'needs-visual-mapping').length,
      },
      restoredOptionQuestions,
      limitations: [
        {
          questionIds: ['toan_q_2017_07_76', 'toan_q_2017_12_75', 'toan_q_2017_12_78'],
          issue:
            'Transcript indicates the required action/location/object, but the stored choices are only numbered image markers; without their figures the option number and distractors cannot be independently mapped.',
        },
        {
          issue:
            'No printed or official answer key was reviewed for either 2017 exam, so transcript coherence is not independent answer-key certification.',
        },
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
    restoredOptionQuestions: restoredOptionQuestions.length,
    reportPath,
    unresolvedVisualMappings: reviewed.filter((question) => question.status === 'needs-visual-mapping').length,
    keysChanged: 0,
  })
)
