import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = fileURLToPath(new URL('../', import.meta.url))
const masterPath = path.join(root, 'data/jlpt_n3_toan_master.json')
const curatedPath = path.join(root, 'data/jlpt_n3_explanations_curated.json')
const reportPath = path.join(root, 'reports/n3-quality-audit/listening-2018-transcript-review.json')
const master = JSON.parse(fs.readFileSync(masterPath, 'utf8').replace(/^\uFEFF/, ''))
const curated = JSON.parse(fs.readFileSync(curatedPath, 'utf8').replace(/^\uFEFF/, ''))

const reviews = {
  toan_q_2018_07_75: {
    answer: 1,
    explanation:
      'Đáp án 1 — gửi một chiếc cặp mẫu. Dịch câu hỏi: “Người phụ nữ phải gửi gì tới chi nhánh?” Cô gửi một mẫu cặp mới; chiếc thứ hai được giữ lại trên bàn người quản lý. Tài liệu mô tả sản phẩm sẽ được gửi qua email, không kèm bưu kiện. Vì vậy không gửi cả hai chiếc hoặc chỉ gửi tài liệu.',
  },
  toan_q_2018_07_76: {
    answer: 3,
    explanation:
      'Đáp án 3 — chọn ảnh để đưa lên áp phích. Dịch câu hỏi: “Trước tiên nữ sinh phải làm gì?” Cậu nam đã chọn màu giấy; hai người đồng ý sẽ dùng ảnh các thành viên và nhờ cô chọn bức phù hợp trong hôm nay. Vẽ tranh không phải nhiệm vụ; in áp phích dự kiến tuần sau, sau khi hoàn thành.',
  },
  toan_q_2018_07_77: {
    answer: 4,
    explanation:
      'Đáp án 4 — chuẩn bị ảnh mặc trang phục Tết. Dịch câu hỏi: “Du học sinh phải làm gì tiếp theo?” Bài viết đã được thầy kiểm tra, không có lỗi và độ dài phù hợp. Cô không có trang phục ở Nhật nên sẽ cho học sinh xem ảnh khi phát biểu. Vì vậy không cần sửa lỗi, rút ngắn bài hoặc nhờ bố mẹ gửi quần áo.',
  },
  toan_q_2018_07_78: {
    answer: 2,
    explanation:
      'Đáp án 2 — sửa vị trí công ty trên bản đồ. Dịch câu hỏi: “Ngay sau đây người đàn ông phải sửa phần nào trên trang web?” Bản đồ hiện đặt cửa hàng tiện lợi chưa khai trương vào vị trí bên cạnh công ty; quản lý yêu cầu trả bản đồ về bản cũ rồi chỉ cập nhật sau khi cửa hàng mở. Lời chào giám đốc sẽ có tuần sau; mô tả sản phẩm và địa chỉ chi nhánh đã kiểm tra đúng.',
  },
  toan_q_2018_07_79: {
    answer: 3,
    explanation:
      'Đáp án 3 — phát phiếu giảm giá trước cửa hàng. Dịch câu hỏi: “Hôm nay nhân viên làm gì?” Áp phích và tờ rơi đã được thử tháng trước nhưng không hiệu quả; hôm nay họ chuyển sang phát phiếu giảm giá trước giờ mở cửa. Thực đơn mới chỉ phát sau khi quyết định giá và món ăn, nên 1, 2 và 4 không phải việc hôm nay.',
  },
  toan_q_2018_07_80: {
    answer: 3,
    explanation:
      'Đáp án 3 — liên lạc lại với trưởng câu lạc bộ để báo có thể dự buổi họp hay không. Dịch câu hỏi: “Nghe tin nhắn xong, trước tiên phải làm gì?” Trưởng câu lạc bộ nhờ trả lời liệu ngày mai lúc 5 giờ có thể tới phòng câu lạc bộ họp không. Email cho mọi người được gửi sau khi quyết định đi hay hoãn buổi picnic; mua nước cũng bàn sau. Vì vậy 1, 2 và 4 chưa làm trước.',
  },
  toan_q_2018_07_81: {
    answer: 3,
    explanation:
      'Đáp án 3 — họ quen nhau qua trang web về trượt tuyết. Dịch câu hỏi: “Hai người đã gặp nhau như thế nào?” Người phát biểu nói họ có chung sở thích trượt tuyết và quen nhau trên một trang web về môn này; lần đầu gặp trực tiếp là ở lớp học tại khu trượt tuyết. 1 là bạn của người phát biểu từ thời trung học; 2 chỉ nói ông nghe về cô trong bữa ăn với đồng nghiệp; 4 là nơi họ gặp trực tiếp lần đầu, không phải nơi quen biết.',
  },
  toan_q_2018_07_82: {
    answer: 2,
    explanation:
      'Đáp án 2 — muốn tăng cường thể lực. Dịch câu hỏi: “Vì sao gần đây người phụ nữ bắt đầu học bơi?” Cô thấy thể lực giảm sau khi đi làm và nghĩ bơi sẽ giúp cơ thể khỏe, ít cảm lạnh, bớt mệt. Cô đã học căn bản từ nhỏ; bơi xa dễ hơn và có bạn mới là kết quả/vui thêm, không phải lý do ban đầu.',
  },
  toan_q_2018_07_83: {
    answer: 3,
    explanation:
      'Đáp án 3 — cảnh sát. Dịch câu hỏi: “Nghề nào đứng đầu lựa chọn của các bé trai năm nay?” Phát thanh viên nói năm nay nhiều bé trai muốn làm cảnh sát nhất. Nhà khoa học là nghề tăng nhanh nhưng không đứng đầu; giáo viên tiểu học là lựa chọn số một của bé gái; bác sĩ đứng đầu cuộc khảo sát mười năm trước.',
  },
  toan_q_2018_07_84: {
    answer: 2,
    explanation:
      'Đáp án 2 — vì anh có cuộc họp. Dịch câu hỏi: “Vì sao người chồng nói hôm nay sẽ về muộn?” Anh nói vẫn đang ở công ty và sẽ họp sau đó. Mưa lớn và khả năng tàu dừng là điều người vợ hỏi; anh không xác nhận tàu bị ngừng. Anh định về ăn tối ở nhà, không đi ăn với đồng nghiệp và cũng không cần mua đồ.',
  },
  toan_q_2018_07_85: {
    answer: 4,
    explanation:
      'Đáp án 4 — một lá thư viết cho chính mình. Dịch câu hỏi: “Khi tốt nghiệp tiểu học, người phụ nữ đã bỏ gì vào hộp kỷ niệm?” Cô nói mình cũng là người bỏ thư cho bản thân, hỏi sau này có trở thành ca sĩ không. Bài kiểm tra, ảnh bạn bè và CD là đồ một số học sinh khác bỏ vào, không phải món của cô.',
  },
  toan_q_2018_07_86: {
    answer: 1,
    explanation:
      'Đáp án 1 — tổ chức giải thể thao. Dịch câu hỏi: “Buổi giao lưu quốc tế tiếp theo sẽ làm gì?” Hai người chọn giải thể thao vì cổ vũ và gọi nhau tạo cơ hội trò chuyện tự nhiên giữa du học sinh với người dân. Lớp dạy ngôn ngữ đã làm năm ngoái; karaoke từng thiếu thời gian giao lưu; lớp nấu ăn được để dành cho dịp sau.',
  },
  toan_q_2018_07_87: {
    answer: 2,
    restoreOptions: true,
    explanation:
      'Đáp án 2 — sách dễ đọc nhưng nội dung không như anh mong đợi. Dịch câu hỏi: “Nam sinh nhận xét cuốn sách thế nào?” Ngôn từ đơn giản, nhưng phần lớn chỉ là kiến thức cơ bản anh đã biết, khác điều anh hình dung khi mua. 1 nói nội dung đúng kỳ vọng; 3–4 nói sách khó đọc, trái với nhận xét rằng nó hợp cho người mới. Lựa chọn chữ được khôi phục từ transcript.',
  },
  toan_q_2018_07_88: {
    answer: 4,
    restoreOptions: true,
    explanation:
      'Đáp án 4 — muốn nam sinh thay cô làm người chụp ảnh cho chuyến đi. Máy ảnh cô bị hỏng; anh đề nghị cho mượn máy, nhưng cô nói anh chụp giỏi hơn và nhờ anh đảm nhận việc chụp. 1 sửa máy, 2 cho mượn máy và 3 dạy cách chụp đều không phải yêu cầu cuối cùng. Lựa chọn chữ được khôi phục từ transcript.',
  },
  toan_q_2018_07_89: {
    answer: 2,
    restoreOptions: true,
    explanation:
      'Đáp án 2 — nhà nghỉ thuận tiện cho người đi du lịch bằng xe đạp. Du khách có thể nhận phòng khi vẫn đi xe và để xe trong phòng; nhân viên cũng tư vấn tuyến đạp xe, sau đó khách có thể ngâm suối nước nóng. 1 không nói môn thể thao mùa thu phổ biến; 3 không hướng dẫn cách chọn tuyến; 4 không tập trung vào suối nước nóng. Lựa chọn chữ được khôi phục từ transcript.',
  },
  toan_q_2018_07_90: {
    answer: 2,
    restoreOptions: true,
    explanation:
      'Đáp án 2 — 「ご注文はお決まりになりましたか」: “Quý khách đã chọn món chưa ạ?” Đây là câu nhân viên hỏi khách khi nhận gọi món. 1 yêu cầu khách cho mình nghe đơn hàng; 3 là khách hỏi xin phép được gọi món. Hai câu kia đảo vai người hỏi và khách. Lựa chọn chữ được khôi phục từ transcript.',
  },
  toan_q_2018_07_91: {
    answer: 1,
    restoreOptions: true,
    explanation:
      'Đáp án 1 — 「食べ物、やっちゃだめだよ」: “Không được cho chim ăn đâu.” Quy định trong công viên cấm cho chim thức ăn, nên cần nhắc bạn dừng lại. 2 bảo cứ cẩn thận mà cho ăn; 3 nói không thấy biển cấm, trái với tình huống đã cho biết có quy định. Lựa chọn chữ được khôi phục từ transcript.',
  },
  toan_q_2018_07_92: {
    answer: 2,
    restoreOptions: true,
    explanation:
      'Đáp án 2 — 「工場の中をご案内します」: “Tôi sẽ hướng dẫn quý khách tham quan bên trong nhà máy.” Người nói là hướng dẫn viên chủ động đưa khách đi xem, dùng ご案内します. 1 là nhờ người khác hướng dẫn mình; 3 yêu cầu ai đó hướng dẫn. Lựa chọn chữ được khôi phục từ transcript.',
  },
  toan_q_2018_07_93: {
    answer: 3,
    restoreOptions: true,
    explanation:
      'Đáp án 3 — 「みんな、こっちむいて」: “Mọi người nhìn sang đây nào.” Người chụp ảnh muốn cả nhóm hướng về máy ảnh. 1 yêu cầu ai đó chụp ảnh; 2 chỉ hỏi mình có lọt vào ảnh không, không hướng dẫn cả nhóm nhìn về phía ống kính. Lựa chọn chữ được khôi phục từ transcript.',
  },
  toan_q_2018_07_94: {
    answer: 1,
    restoreOptions: true,
    explanation:
      'Đáp án 1 — “Vậy để lần sau tôi mời nhé.” Người được mời ngắm hoa xin lỗi vì thứ Sáu không đi được; người mời chấp nhận và hẹn dịp khác. 2 hiểu nhầm rằng buổi ngắm hoa bị hủy; 3 nói người kia sẽ đi được, trái với lời từ chối. Lựa chọn chữ được khôi phục từ transcript.',
  },
  toan_q_2018_07_95: {
    answer: 1,
    restoreOptions: true,
    explanation:
      'Đáp án 1 — “Cảm ơn, nhưng tôi ổn.” Đồng nghiệp hỏi có thể giúp gì cho chuyến công tác; đây là lời cảm ơn và từ chối nhẹ nhàng vì chưa cần giúp. 2 trách người kia không chịu giúp, trái với câu hỏi đề nghị; 3 bảo cứ nhờ bất cứ điều gì, thường là lời của người đang đề nghị giúp. Lựa chọn chữ được khôi phục từ transcript.',
  },
  toan_q_2018_07_96: {
    answer: 3,
    restoreOptions: true,
    explanation:
      'Đáp án 3 — đồng ý tham gia bữa ăn cùng mọi người. Người nói thông báo trưởng phòng rủ cả nhóm đi ăn; 「いいですね。私も行きます」 nhận lời. 1 nói về bữa ăn đã qua; 2 chỉ phù hợp nếu trưởng phòng không thể đi, điều chưa được nói. Lựa chọn chữ được khôi phục từ transcript.',
  },
  toan_q_2018_07_97: {
    answer: 2,
    restoreOptions: true,
    explanation:
      'Đáp án 2 — “Ơ, là tin gì vậy?” Người nói hỏi có xem bản tin sáng nay chưa; đáp lại bằng câu hỏi tin nào là tự nhiên khi chưa biết chủ đề. 1 hỏi người kia có xem tin không; 3 dùng 「お目にかかる」 là gặp ai đó, không liên quan đến xem tin. Lựa chọn chữ được khôi phục từ transcript.',
  },
  toan_q_2018_07_98: {
    answer: 1,
    restoreOptions: true,
    explanation:
      'Đáp án 1 — “Có chuyện gì xảy ra chăng?” Mọi người biết Kobayashi không có lý do gì để đến muộn, nên suy đoán đã có việc phát sinh. 2 nói anh ấy thường xuyên trễ, trái với 「遅れてくるはずない」; 3 lại nói anh ấy đã đến sớm, không phù hợp vì đang chờ. Lựa chọn chữ được khôi phục từ transcript.',
  },
  toan_q_2018_07_99: {
    answer: 3,
    restoreOptions: true,
    explanation:
      'Đáp án 3 — 「どうぞ、お持ちください」: “Xin mời cầm lấy.” Khách xin phép lấy tờ rơi; nhân viên cho phép mang đi. 1 là xin phép xem tài liệu; 2 nói mình sẽ giữ lấy, không trả lời yêu cầu của khách. Lựa chọn chữ được khôi phục từ transcript.',
  },
  toan_q_2018_07_100: {
    answer: 3,
    restoreOptions: true,
    explanation:
      'Đáp án 3 — “Vậy thì khó thật.” Người nói báo không ai tới dự tiệc tuần sau; đáp lời rằng tình hình đáng lo là phù hợp. 1 nói mọi người muốn tới và 2 khen đông người đến, đều trái với việc chưa có ai đăng ký. Lựa chọn chữ được khôi phục từ transcript.',
  },
  toan_q_2018_07_101: {
    answer: 2,
    restoreOptions: true,
    explanation:
      'Đáp án 2 — “Người như vậy hiếm lắm.” Câu 「吉田さんほど親切な人っていない」 khen Yoshida là người rất tử tế; đáp án đồng tình rằng khó tìm được ai như vậy. 1 hỏi lại như thể Yoshida không tử tế; 3 nói có rất nhiều người tử tế, làm yếu và đảo ý lời khen. Lựa chọn chữ được khôi phục từ transcript.',
  },
  toan_q_2018_07_102: {
    answer: 1,
    restoreOptions: true,
    explanation:
      'Đáp án 1 — 「あっ、少し前につけました」: “À, tôi bật từ nãy rồi.” Người quản lý nhờ bật sưởi trước khi khách tới; nhân viên báo đã làm xong. 2 nói sẽ tắt, trái yêu cầu; 3 hỏi sưởi còn bật không, không xác nhận đã bật giúp. Lựa chọn chữ được khôi phục từ transcript.',
  },
  toan_q_2018_12_75: {
    answer: 3,
    explanation:
      'Đáp án 3 — đến ga Yamakawa nhận túi. Dịch câu hỏi: “Người phụ nữ sẽ làm gì tiếp theo?” Túi đỏ được tìm thấy ở ga kế tiếp Yamakawa; cô nói sẽ đi lấy ngay. Nếu để tới ngày mai, đồ sẽ chuyển sang trung tâm thất lạc ở Tokyo. Vì thế gọi điện hoặc đến ga Tokyo không phải bước tiếp theo.',
  },
  toan_q_2018_12_76: {
    answer: 4,
    explanation:
      'Đáp án 4 — gọi cửa hàng cơm hộp để tăng số suất. Dịch câu hỏi: “Người đàn ông làm gì ngay bây giờ?” Anh đặt phòng nhỏ và chỉ có 15 suất, trong khi cuộc họp có 20 người. Người phụ nữ tự đổi phòng; anh phải liên hệ cửa hàng để tăng cơm hộp. 1 và 3 là các bước đã được giao cho cô; 2 đổi phòng không phải nhiệm vụ của anh.',
  },
  toan_q_2018_12_77: {
    answer: 2,
    needsVisualMapping: true,
    explanation:
      'Đáp án đang lưu là 2. Dịch câu hỏi: “Trước khi học từ hôm nay, nam sinh sẽ làm gì?” Bạn nữ khuyên vận động để đổi trạng thái; cô cũng kể có thể ngủ ngắn nhưng sau đó nói tốt hơn nên chọn vận động và bỏ cách ngủ. Transcript chỉ nêu các việc, không có nội dung bốn lựa chọn hiện là ký hiệu số, nên chưa thể xác định ký hiệu nào là vận động hoặc loại từng hình nhiễu. Cần khôi phục ảnh lựa chọn để xác nhận số đáp án.',
  },
  toan_q_2018_12_78: {
    answer: 4,
    explanation:
      'Đáp án 4 — 15.000 yên. Dịch câu hỏi: “Người đàn ông sẽ trả bao nhiêu?” Suất ăn 3.000 yên/người đã được chuẩn bị cho năm người; một người hủy ngay trong ngày nhưng nhà hàng vẫn thu toàn bộ 15.000 yên. Phiếu giảm giá 2.000 yên chỉ dùng cho lần sau, không trừ vào hóa đơn này. Vì vậy 3.000, 12.000 và 13.000 yên đều sai.',
  },
  toan_q_2018_12_79: {
    answer: 3,
    needsVisualMapping: true,
    explanation:
      'Đáp án đang lưu là 3 (アエ). Dịch tình huống: du học sinh cần mang ảnh về đất nước mình và giày thể thao để đi trong nhà thi đấu; bữa trưa không cần mang vì mọi người sẽ cùng nấu cà ri, còn trường chuẩn bị nguyên liệu và tạp dề. Tuy nhiên transcript không cho biết ア／イ／ウ／エ ứng với từng vật trong hình, nên chưa thể đối chiếu từng tổ hợp nhiễu hoặc xác nhận số 3.',
  },
  toan_q_2018_12_80: {
    answer: 1,
    explanation:
      'Đáp án 1 — sân trường tiểu học Nakagawa. Dịch câu hỏi: “Người phụ nữ sẽ xem pháo hoa ở đâu?” Cô đồng ý xem tại khuôn viên trường cùng gia đình Yamada; anh sẽ giữ chỗ cho hai người. Cầu Midori là nơi có thể nhìn nhưng xa ga; nhà anh bị tòa nhà che; tàu trên sông đã hết chỗ. Vì vậy 2–4 không phải địa điểm được chọn.',
  },
  toan_q_2018_12_81: {
    answer: 2,
    explanation:
      'Đáp án 2 — làm thêm quá nhiều. Dịch câu hỏi: “Nhân viên văn phòng lo điều gì về sinh viên?” Anh nói điều đáng lo không phải chất lượng báo cáo mà là cô quá bận vì làm thêm. Thi trượt học bổng được nhắc như bối cảnh; anh lo cô làm ảnh hưởng sức khỏe nếu tiếp tục quá sức. Vì vậy 1, 3 và 4 không diễn đạt đúng mối lo được nêu.',
  },
  toan_q_2018_12_82: {
    answer: 3,
    explanation:
      'Đáp án 3 — chuyển tất cả phòng thành phòng trải chiếu tatami. Dịch câu hỏi: “Vì sao khách nước ngoài ở lữ quán tăng?” Khách quan tâm văn hóa Nhật nên thích việc toàn bộ phòng được đổi sang tatami. Tờ rơi nhiều thứ tiếng không phải nguyên nhân; giường kiểu Tây bị thay bằng tatami; lớp nấu món Nhật mới chỉ dự kiến mở sau này.',
  },
  toan_q_2018_12_83: {
    answer: 1,
    explanation:
      'Đáp án 1 — bọc rác thức ăn bằng giấy báo để phơi khô ngoài ban công. Dịch câu hỏi: “Người phụ nữ làm gì để ngăn mùi rác?” Cô không thích mùi giấm, cũng không muốn bỏ rác vào tủ đông cùng thức ăn; ở căn hộ không có vườn để chôn. Phơi khô trong giấy báo là cách cô đang dùng.',
  },
  toan_q_2018_12_84: {
    answer: 3,
    explanation:
      'Đáp án 3 — giúp con trai có thêm tự tin. Dịch câu hỏi: “Mục đích chính người đàn ông đi núi gần đây là gì?” Trước đây anh đi để ngắm hoa và nghĩ ý tưởng tiểu thuyết; gần đây anh mời con trai đi vì muốn con có trải nghiệm cố gắng tới cùng và tự tin hơn. Gia đình trò chuyện nhiều hơn là kết quả phụ, không phải mục đích chính.',
  },
  toan_q_2018_12_85: {
    answer: 4,
    explanation:
      'Đáp án 4 — mua pizza mang về từ nhà hàng. Dịch câu hỏi: “Tối nay hai vợ chồng ăn thế nào?” Người vợ không muốn ra ăn hoặc tự làm, cũng không muốn gọi giao tận nhà; cô đề nghị đặt pizza tại nhà hàng mới rồi nhờ chồng ghé lấy. Anh đồng ý vì trước tiên họ có thể ăn ở nhà.',
  },
  toan_q_2018_12_86: {
    answer: 2,
    explanation:
      'Đáp án 2 — chất lượng in rõ đẹp. Dịch câu hỏi: “Vì sao trưởng phòng chọn máy in Asahi?” Hai máy đều vừa chỗ cũ và sức chứa giấy tương đương; máy Asahi cho bản in đẹp hơn. Mực đắt hơn nhưng trưởng phòng chấp nhận. Máy nhỏ hơn là ưu điểm của hãng Kawada; tiết kiệm mực và chứa nhiều giấy không phải lý do chọn Asahi.',
  },
  toan_q_2018_12_87: {
    answer: 3,
    restoreOptions: true,
    explanation:
      'Đáp án 3 — lý do cô bắt đầu chạy marathon. Cô vốn không thích chạy đường dài; bắt đầu tập vì đàn anh ở công ty rủ tham gia giải và câu chuyện khiến cô muốn thử. Sức khỏe có lợi chỉ là điều phụ cô thừa nhận; cách tập và kết quả giải chưa phải nội dung chính. Lựa chọn chữ được khôi phục từ transcript.',
  },
  toan_q_2018_12_88: {
    answer: 1,
    restoreOptions: true,
    explanation:
      'Đáp án 1 — anh sẽ tới họp muộn. Xét nghiệm kết thúc lúc 1 giờ còn cuộc họp bắt đầu 1 giờ 30; anh nói có lẽ sẽ không kịp dự từ đầu nhưng sẽ tới phần báo cáo cuối. 2 nói không thể dự cả buổi; 3 và 4 yêu cầu đổi giờ hoặc đổi thứ tự, điều anh không xin. Lựa chọn chữ được khôi phục từ transcript.',
  },
  toan_q_2018_12_89: {
    answer: 4,
    restoreOptions: true,
    explanation:
      'Đáp án 4 — mối liên hệ giữa đau nhức cơ thể và tư thế đi bộ. Người dẫn nói chỉnh dáng đi có thể làm dịu đau đầu gối hoặc thắt lưng; chọn giày phù hợp cũng quan trọng. 1 không nói đi đẹp; 2 không tập trung vào chọn giày; 3 chỉ nhắc tuổi tác là một trong các nguyên nhân, không phải chủ đề chính. Lựa chọn chữ được khôi phục từ transcript.',
  },
  toan_q_2018_12_90: {
    answer: 1,
    restoreOptions: true,
    explanation:
      'Đáp án 1 — 「空いているところ、ありませんか」: “Có chỗ nào còn trống không ạ?” Bãi đỗ đông và tài xế chưa biết có chỗ hay không, nên hỏi nhân viên chỗ trống. 2 rủ nhân viên cùng quyết định đỗ ở đây; 3 nhờ ai đó dừng lại, không hỏi chỗ đỗ. Lựa chọn chữ được khôi phục từ transcript.',
  },
  toan_q_2018_12_91: {
    answer: 3,
    restoreOptions: true,
    explanation:
      'Đáp án 3 — 「このゲームやってみたい」: “Mình muốn thử chơi trò này.” Người nói thấy trò chơi mới ở nhà bạn và muốn mượn chơi ngay. 1 xin được tặng trò chơi; 2 hỏi bạn có muốn chơi không, không bày tỏ mong muốn của mình. Lựa chọn chữ được khôi phục từ transcript.',
  },
  toan_q_2018_12_92: {
    answer: 2,
    restoreOptions: true,
    explanation:
      'Đáp án 2 — 「予約はどうすればいいんですか」: “Tôi phải đặt vé thế nào ạ?” Người dùng máy ở cửa hàng tiện lợi không biết thao tác nên hỏi nhân viên cách đặt. 1 tự đề nghị chỉ cách cho nhân viên; 3 khuyên người khác nên đặt vé. Lựa chọn chữ được khôi phục từ transcript.',
  },
  toan_q_2018_12_93: {
    answer: 1,
    restoreOptions: true,
    explanation:
      'Đáp án 1 — xin phép phô-tô vở ghi hôm qua. Người nói nghỉ học hôm qua và muốn sao chép ghi chép của bạn, nên dùng 「コピーさせて」 để xin phép. 2 chỉ kể rằng mình sẽ chép; 3 là chủ vở cho phép người khác chép, đảo vai giao tiếp. Lựa chọn chữ được khôi phục từ transcript.',
  },
  toan_q_2018_12_94: {
    answer: 2,
    restoreOptions: true,
    explanation:
      'Đáp án 2 — 「じゃ早速いただくね」: “Vậy mình ăn ngay đây.” Người kia bảo ăn trước khi món nguội, nên nhận lời và bắt đầu ăn. 1 nói món có vẻ đã nguội; 3 từ chối hoặc bảo chưa được ăn, trái với lời mời. Lựa chọn chữ được khôi phục từ transcript.',
  },
  toan_q_2018_12_95: {
    answer: 1,
    restoreOptions: true,
    explanation:
      'Đáp án 1 — đồng ý sẽ gọi điện cho Yamada. Người bạn nhận xét Yamada đến muộn và gợi ý nên gọi, nên 「うん、そうしようか」 chấp nhận đề xuất. 2 chỉ nhận xét chuyện không hay đã xảy ra; 3 bảo người kia nên đến sớm, không liên quan tới cuộc gọi. Lựa chọn chữ được khôi phục từ transcript.',
  },
  toan_q_2018_12_96: {
    answer: 3,
    restoreOptions: true,
    explanation:
      'Đáp án 3 — 「おかげさまで、もうすっかり」: “Nhờ mọi người, tôi khỏi hẳn rồi.” Câu hỏi thăm tình trạng sau khi cảm lạnh; đây là câu trả lời xác nhận đã hồi phục. 1 nói về quyết định quay lại đâu đó; 2 chúc người bệnh khỏe lên dù người kia đang hỏi xem đã khỏe chưa. Lựa chọn chữ được khôi phục từ transcript.',
  },
  toan_q_2018_12_97: {
    answer: 2,
    restoreOptions: true,
    explanation:
      'Đáp án 2 — “Ngày mai thì tôi rảnh.” Được rủ đi mua quần áo hôm nay, người nói đề xuất một thời điểm khác mình có thể đi. 1 nói hiện không muốn mua quần áo; 3 khuyên người rủ tự nhờ ai khác đi cùng, không nhận lời vào ngày mai. Lựa chọn chữ được khôi phục từ transcript.',
  },
  toan_q_2018_12_98: {
    answer: 2,
    restoreOptions: true,
    explanation:
      'Đáp án 2 — báo cáo đã xong và nhờ xem giúp. Người kia hỏi bản báo cáo cuộc họp đã viết xong chưa; câu này trả lời có rồi và xin cấp trên kiểm tra. 1 hỏi lại người khác đã hoàn thành chưa; 3 nhầm “báo cáo cuộc họp” với việc cuộc họp đã kết thúc. Lựa chọn chữ được khôi phục từ transcript.',
  },
  toan_q_2018_12_99: {
    answer: 2,
    restoreOptions: true,
    explanation:
      'Đáp án 2 — hỏi liệu địa chỉ email có được không. Người nói muốn gặp Tanaka và hỏi đàn anh có thông tin liên lạc không; đề nghị cung cấp địa chỉ email là câu trả lời hữu ích. 1 hỏi lần cuối liên lạc khi nào; 3 bảo tự gặp để hỏi, không cung cấp thông tin liên hệ đang được hỏi. Lựa chọn chữ được khôi phục từ transcript.',
  },
  toan_q_2018_12_100: {
    answer: 1,
    restoreOptions: true,
    explanation:
      'Đáp án 1 — 「いいえ、違いますけど」: “Không, tôi không phải nhân viên cửa hàng.” Người lạ hỏi người này có làm ở cửa hàng không; câu phủ nhận trực tiếp là phù hợp. 2 nói không biết sự việc nào đó; 3 chỉ nói thường xuyên tới đây, không xác nhận mình có phải nhân viên không. Lựa chọn chữ được khôi phục từ transcript.',
  },
  toan_q_2018_12_101: {
    answer: 1,
    restoreOptions: true,
    explanation:
      'Đáp án 1 — nhận lỗi và hứa sẽ chú ý từ nay. Người nghe bị nhắc đã nói điều khiến trưởng phòng tức giận, nên 「つい、これから気を付けます」 thừa nhận sơ suất và hứa cẩn thận hơn. 2 nói bản thân cũng bất ngờ; 3 hỏi trưởng phòng có tức không, dù câu trước khẳng định ông đang tức. Lựa chọn chữ được khôi phục từ transcript.',
  },
  toan_q_2018_12_102: {
    answer: 3,
    restoreOptions: true,
    explanation:
      'Đáp án 3 — hỏi có hơi sớm không. Còn một tiếng nữa tiệc mới bắt đầu, nên người nghe thấy bày món ngay có thể quá sớm. 1 ngạc nhiên vì món đã được bày rồi; 2 nói nếu chờ đến lúc bắt đầu sẽ muộn, trái với việc đang được đề nghị làm trước. Lựa chọn chữ được khôi phục từ transcript.',
  },
}

function extractPrintedOptions(script) {
  const matches = [...String(script ?? '').matchAll(/^\s*([1-4])\.\s*(.+?)\s*$/gm)]
  if (matches.length < 3) return []
  const numbers = matches.map((match) => Number(match[1]))
  if (!numbers.every((number, index) => number === index + 1)) return []
  return matches.map((match) => match[2].replace(/\s*[（(]正解\s*[：:]\s*[1-4][）)]\s*$/, '').trim())
}

function printedAnswers(script) {
  return [...String(script ?? '').matchAll(/正解\s*[：:]\s*([1-4])/g)].map((match) => Number(match[1]))
}

const examIds = new Set(['toan-n3-201807-full', 'toan-n3-201812-full'])
const exams = master.filter((exam) => examIds.has(exam.id))
if (exams.length !== 2) throw new Error('Expected both 2018 exams; found ' + exams.length)

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
  const printed = printedAnswers(question.script)
  if (!printed.length || printed.some((answer) => answer !== review.answer)) {
    keyMismatches.push({
      questionId: id,
      expected: review.answer,
      actual: [question.correctAnswer, question.answer],
      transcriptMarkers: printed,
    })
    continue
  }
  if (question.correctAnswer !== review.answer || question.answer !== review.answer) {
    keyMismatches.push({
      questionId: id,
      expected: review.answer,
      actual: [question.correctAnswer, question.answer],
      transcriptMarkers: printed,
    })
    continue
  }

  if (review.restoreOptions) {
    const options = extractPrintedOptions(question.script)
    if (options.length !== question.options.length) {
      throw new Error(id + ': could not recover ' + question.options.length + ' options from transcript')
    }
    if (JSON.stringify(question.options) !== JSON.stringify(options)) {
      question.options = options
    }
    restoredOptionQuestions.push(id)
  }

  curated[id] = review.explanation
  reviewed.push({
    questionId: id,
    examId: id.includes('_07_') ? 'toan-n3-201807-full' : 'toan-n3-201812-full',
    number: question.number,
    answer: review.answer,
    transcriptKeyMarkers: printed,
    answerEvidence:
      'Transcript gắn trong dữ liệu in đáp án 正解 trùng khóa đang lưu; chưa đối chiếu độc lập với PDF gốc/khóa JLPT chính thức.',
    status: review.needsVisualMapping ? 'needs-visual-mapping' : 'transcript-key-and-explanation-reviewed',
    optionsRecoveredFromTranscript: Boolean(review.restoreOptions),
    explanation: review.explanation,
  })
}

if (keyMismatches.length) {
  throw new Error('Stored answers do not match the printed transcript keys: ' + JSON.stringify(keyMismatches))
}
if (reviewed.length !== 56) throw new Error('Expected 56 reviewed questions; got ' + reviewed.length)
if (restoredOptionQuestions.length !== 32) {
  throw new Error('Expected 32 option lists recovered from transcript; got ' + restoredOptionQuestions.length)
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
        'All 56 stored answers were checked against the 正解 markers present in their attached transcripts; every marker matched. Explanations were written from those transcripts with Vietnamese rendering and distractor reasoning. No original PDF or official JLPT answer key was inspected in this pass. Text options missing from questions 87–102 of both exams were recovered from transcript lines. December 2018 questions 77 and 79 still need their missing visual choice mappings.',
      transcriptSource: 'data/jlpt_n3_toan_master.json, script field on each question',
      answerKeySource: '正解 markers in stored transcripts; original document provenance not independently verified',
      totals: {
        questionsReviewed: reviewed.length,
        explanationsAdded: reviewed.length,
        keysChanged: 0,
        keysMatchedTranscriptMarkers: reviewed.length,
        keysComparedWithOfficialAnswerKey: 0,
        optionsRecoveredFromTranscript: restoredOptionQuestions.length,
        unresolvedVisualMappings: reviewed.filter((question) => question.status === 'needs-visual-mapping').length,
      },
      restoredOptionQuestions,
      limitations: [
        {
          questionIds: ['toan_q_2018_12_77', 'toan_q_2018_12_79'],
          issue:
            'The transcript gives the likely intended action/items and printed key but the visible choices are image markers or letter combinations without their figure mapping, preventing choice-by-choice explanation.',
        },
        {
          issue:
            'Transcript answer markers match the stored keys, but the source PDF and official JLPT answer key were not independently checked.',
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
    matchedTranscriptKeys: reviewed.length,
    restoredOptionQuestions: restoredOptionQuestions.length,
    reportPath,
    unresolvedVisualMappings: reviewed.filter((question) => question.status === 'needs-visual-mapping').length,
    keysChanged: 0,
  })
)
