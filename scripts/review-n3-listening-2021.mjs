import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = fileURLToPath(new URL('../', import.meta.url))
const masterPath = path.join(root, 'data/jlpt_n3_toan_master.json')
const curatedPath = path.join(root, 'data/jlpt_n3_explanations_curated.json')
const reportPath = path.join(root, 'reports/n3-quality-audit/listening-2021-transcript-review.json')
const master = JSON.parse(fs.readFileSync(masterPath, 'utf8').replace(/^\uFEFF/, ''))
const curated = JSON.parse(fs.readFileSync(curatedPath, 'utf8').replace(/^\uFEFF/, ''))

const reviews = {
  toan_q_2021_12_74: [
    3,
    'Đáp án đang lưu là 3 — chỉ tưới vào phần đất gần rễ khi đất khô, tránh để nước dính lên lá. Dịch câu hỏi: “Người đàn ông tưới hoa này thế nào?” Người bán nói nước đọng trên đĩa bên dưới cũng phải đổ đi. Transcript giải thích cách chăm cây nhưng bốn lựa chọn hiện chỉ còn hình, nên chưa thể đối chiếu mô tả với số 3 hoặc loại từng hình nhiễu.',
  ],
  toan_q_2021_12_75: [
    2,
    'Đáp án 2 — lên tàu địa phương ở đường ray số 2. Dịch câu hỏi: “Người phụ nữ đi tàu ở đường ray nào?” Nhân viên nói đường ray 3 và 4 đi hướng ngược lại; tàu nhanh ở đường ray 1 không dừng tại Yamakawa; cô cần tàu thường ở đường ray 2.',
  ],
  toan_q_2021_12_76: [
    4,
    'Đáp án đang lưu là 4 — bổ sung họ vào tên và sửa tên môn học thành “Văn học thế giới”. Dịch câu hỏi: “Nữ sinh sửa phần nào của bài báo cáo?” Tiêu đề không có vấn đề; tên phải có cả họ và môn học đang bị ghi nhầm thành Văn học Nhật. Cô cần sửa các mục này rồi nộp lại. Tuy nhiên lựa chọn dùng tổ hợp ký hiệu ア／イ／ウ／エ mà dữ liệu không còn sơ đồ ánh xạ, nên chưa thể xác nhận tổ hợp số 4 hay loại từng lựa chọn sai.',
  ],
  toan_q_2021_12_77: [
    2,
    'Đáp án đang lưu là 2 — trước khi gửi bưu điện, nhờ trưởng bộ phận ký vào giấy tờ. Dịch câu hỏi: “Sau tin nhắn, trước tiên cần làm gì?” Sếp nói rõ việc ký phải làm trước; sau đó mới đem hồ sơ ra bưu điện và gọi điện báo đã gửi. Transcript nêu thứ tự nhưng lựa chọn chỉ còn ký hiệu hình, vì vậy số 2 và các hình nhiễu chưa được xác minh độc lập.',
  ],
  toan_q_2021_12_78: [
    1,
    'Đáp án 1 — trước tiên hỏi lịch của mọi người để xem họ có thể họp không. Dịch câu hỏi: “Nam sinh cần làm gì đầu tiên?” Bạn nữ muốn tổ chức buổi họp để lấy ý kiến trực tiếp; chỉ khi khó sắp xếp mọi người mới chuyển sang email. Sau khi biết lịch mới báo ngày họp và lấy ý kiến.',
  ],
  toan_q_2021_12_79: [
    2,
    'Đáp án đang lưu là 2 — mang vợt riêng, không mang bóng cá nhân. Dịch câu hỏi: “Người đàn ông mang gì tới lớp bóng bàn?” Anh nói định mang cả vợt lẫn bóng, nhưng nhân viên yêu cầu không dùng bóng riêng vì có thể thất lạc hoặc bị người khác cầm nhầm; vợt riêng vẫn được dùng. Phương án hiện là tổ hợp ký hiệu ア／イ mà không có sơ đồ các vật, nên chưa thể xác minh số 2 hoặc từng phương án nhiễu.',
  ],
  toan_q_2021_12_80: [
    3,
    'Đáp án 3 — có khu vườn. Dịch câu hỏi: “Người phụ nữ thích nhất điều gì ở nhà mới?” Nhà rộng hơn, gần ga và gần công ty đều là điểm thuận tiện, nhưng cô nói rõ điều mình thích nhất là khu vườn và còn mời đồng nghiệp tới chơi.',
  ],
  toan_q_2021_12_81: [
    1,
    'Đáp án 1 — hương vị món ăn. Dịch câu hỏi: “Người phụ nữ thích nhất điểm nào ở nhà hàng?” Cô khen mọi món đều ngon rồi kết luận món ăn là tuyệt nhất, đặc biệt là cá. Lượng thức ăn, bộ bát đĩa và phục vụ đều được nhắc tới nhưng không phải điểm cô chọn là số một.',
  ],
  toan_q_2021_12_82: [
    4,
    'Đáp án 4 — đứng nhầm cổng phía bắc thay vì cổng phía nam. Dịch câu hỏi: “Vì sao nam sinh lỡ buổi đi bộ đường dài?” Hai người đều tới đúng ga và đúng giờ; cô gái chờ ở cổng nam còn cậu ở cổng bắc. Cậu bỏ lỡ cuộc hẹn vì nhầm lối ra, không phải nhầm ngày, ga hay giờ.',
  ],
  toan_q_2021_12_83: [
    3,
    'Đáp án 3 — thứ Bảy tuần sau lúc 3 giờ. Dịch câu hỏi: “Nữ sinh tới gặp giáo viên khi nào?” Lịch ban đầu thứ Bảy tuần này bị hoãn một tuần và giữ nguyên giờ 3 giờ chiều để có đủ thời gian trao đổi. Thứ Tư tuần này không phù hợp vì cô có lớp và giáo viên có giờ dạy sau 5 giờ.',
  ],
  toan_q_2021_12_84: [
    2,
    'Đáp án 2 — quen thêm người trong khu phố. Dịch câu hỏi: “Điều gì tốt khi người phụ nữ bắt đầu trồng rau ở nhà?” Nhờ có chung sở thích làm vườn, cô trở nên thân thiết với những người hàng xóm trước đây chưa từng trò chuyện. Cô đã dậy sớm từ trước; chuyện không mua rau ở cửa hàng và hy vọng cháu thích rau mới là ví dụ/kỳ vọng, chưa phải lợi ích đã nêu.',
  ],
  toan_q_2021_12_85: [
    3,
    'Đáp án 3 — bức ảnh chụp con chim ở ao. Dịch câu hỏi: “Bức ảnh đăng tạp chí là ảnh gì?” Ban đầu người đàn ông định chụp hoa ở công viên, nhưng phát hiện một con chim lạ trong ao và chụp nó. Ảnh trẻ em, hoa và cá không phải bức ảnh được đăng.',
  ],
  toan_q_2021_12_86: [
    4,
    'Đáp án 4 — cô muốn được làm ở nơi bạn nam đang làm thêm. Dịch câu hỏi: “Nữ sinh muốn truyền đạt điều gì?” Cô nói đang tìm việc làm thêm và hỏi quán Aoyama có tuyển người không; cậu bạn hứa hỏi nhân viên. Cô không xin giới thiệu đồng nghiệp, hỏi cách tìm việc hay chỉ rủ nhau tới ăn. Khôi phục lựa chọn từ transcript.',
  ],
  toan_q_2021_12_87: [
    2,
    'Đáp án 2 — nên cười thường xuyên để hỗ trợ sức khỏe. Dịch câu hỏi: “Bác sĩ muốn nói điều gì?” Bác sĩ giải thích cười giúp giảm căng thẳng, cải thiện lưu thông máu và có thể khiến cơ thể khỏe hơn; đây là cách dễ thử. Bác sĩ không chỉ bảo người mệt phải tới khám hay khuyên tránh xem TV, và cũng không lấy việc tập thể dục làm lời khuyên chính. Khôi phục lựa chọn từ transcript.',
  ],
  toan_q_2021_12_88: [
    3,
    'Đáp án 3 — trời lạnh và thời tiết thay đổi trong ngày. Dịch câu hỏi: “Thời tiết ngày mai ra sao?” Trời lạnh; mưa kéo dài tới sáng, tạnh vào trưa và nắng buổi chiều, nhưng chiều tối mưa lớn trở lại, muộn có thể chuyển thành tuyết. Vì vậy không nắng ấm cả ngày, không chỉ lạnh và nắng, cũng không mưa suốt ngày. Khôi phục lựa chọn từ transcript.',
  ],
  toan_q_2021_12_89: [
    1,
    'Đáp án 1 — 「手伝ってくれる？」: “Bạn giúp mình được không?” Người nói cần chuyển chiếc bàn rất nặng nên nhờ bạn giúp. Đáp án 2 là người nói tự đề nghị giúp người khác; đáp án 3 nói mình có thể giúp, cũng không phải lời nhờ. Khôi phục lựa chọn từ transcript.',
  ],
  toan_q_2021_12_90: [
    1,
    'Đáp án 1 — 「これ、召し上がってください」: “Xin mời dùng món này.” Đây là cách kính ngữ lịch sự mời người khác ăn món mình đã làm. Đáp án 2 xin phép mình được ăn món của người kia; đáp án 3 lại mời đối phương làm món ăn. Khôi phục lựa chọn từ transcript.',
  ],
  toan_q_2021_12_91: [
    3,
    'Đáp án 3 — 「まだやってますか」: “Cửa hàng vẫn còn mở chứ ạ?” Đã muộn nên người nói muốn hỏi nhân viên cửa hàng còn hoạt động không. Đáp án 1 hỏi việc mua sắm đã xong chưa; đáp án 2 hỏi người khác có thể vào cửa hàng hay không, không hỏi giờ mở cửa. Khôi phục lựa chọn từ transcript.',
  ],
  toan_q_2021_12_92: [
    2,
    'Đáp án 2 — 「予約はどうすればいいんですか」: “Tôi phải đặt vé thế nào ạ?” Người dùng không biết cách thao tác máy ở cửa hàng tiện lợi nên hỏi nhân viên. Đáp án 1 đề nghị chỉ cách đặt cho nhân viên; đáp án 3 chỉ gợi ý đặt vé chứ không xin hướng dẫn. Khôi phục lựa chọn từ transcript.',
  ],
  toan_q_2021_12_93: [
    1,
    'Đáp án 1 — 「できれば行きたいんだけど」: “Nếu được thì mình muốn đi lắm.” Đây là phản hồi phù hợp khi được hỏi có đi tiệc ngày mai không và muốn thể hiện mong muốn tham gia. Đáp án 2 yêu cầu rủ mọi người, còn 3 hỏi đổi ngày tiệc; cả hai không trả lời về ý định của người nghe. Khôi phục lựa chọn từ transcript.',
  ],
  toan_q_2021_12_94: [
    1,
    'Đáp án 1 — 「良かったな。どんなバイト？」: “Tốt quá. Việc làm thêm gì vậy?” Người kia vừa nói đàn anh sẽ giới thiệu việc làm thêm, nên chúc mừng và hỏi thêm là hợp ngữ cảnh. Đáp án 2 hỏi công việc đã bắt đầu thế nào; đáp án 3 hiểu nhầm là nhờ đàn anh làm giúp. Khôi phục lựa chọn từ transcript.',
  ],
  toan_q_2021_12_95: [
    3,
    'Đáp án 3 — 「できるだけ早く払ってください」: “Hãy thanh toán sớm nhất có thể.” Người hỏi muốn biết hạn thanh toán; câu trả lời đưa ra yêu cầu về thời điểm. Đáp án 1 nói cách trả một lần; đáp án 2 chỉ lặp rằng phải trả chứ không trả lời khi nào. Khôi phục lựa chọn từ transcript.',
  ],
  toan_q_2021_12_96: [
    1,
    'Đáp án 1 — 「やっぱり旅行がいいな」: “Mình vẫn muốn đi du lịch nhất.” Câu hỏi giả định có kỳ nghỉ dài một tháng và hỏi muốn làm gì; đáp án nêu mong muốn. Đáp án 2 nói sẽ xin nghỉ vào kỳ nghỉ hè; đáp án 3 nhận xét rằng lẽ ra nên nghỉ ở nhà. Khôi phục lựa chọn từ transcript.',
  ],
  toan_q_2021_12_97: [
    2,
    'Đáp án 2 — 「はい、わかりました」: “Vâng, tôi hiểu rồi.” Người kia nhờ đóng cửa sổ, và người nghe xác nhận sẽ làm. Đáp án 1 là lời nhờ vả/đề nghị không đúng vai; đáp án 3 đồng ý mở cửa, trái với yêu cầu đóng. Khôi phục lựa chọn từ transcript.',
  ],
  toan_q_2021_12_98: [
    3,
    'Đáp án 3 — 「しばらく使う予定がないから」: “Vì một thời gian nữa tôi chưa định dùng.” Đây là lý do người cho mượn đồng ý để đàn em mượn máy ảnh cả tuần. Đáp án 1 nói mình cũng đang định mượn máy ảnh; đáp án 2 là lời của người đi mượn, không trả lời đề nghị. Khôi phục lựa chọn từ transcript.',
  ],
  toan_q_2021_12_99: [
    3,
    'Đáp án 3 — 「誰か上手な人に教えてもらったら？」: “Hay nhờ ai nấu giỏi dạy cho?” Người bạn than nấu mỗi ngày nhưng không tiến bộ, nên gợi ý học từ người có kinh nghiệm là hợp lý. Đáp án 1 hiểu nhầm “một chút” thành lượng tiến bộ; đáp án 2 khen cố gắng nhưng không đưa lời khuyên. Khôi phục lựa chọn từ transcript.',
  ],
  toan_q_2021_12_100: [
    2,
    'Đáp án 2 — 「気にしないで」: “Đừng bận tâm.” Người bạn xin lỗi vì hôm qua không thể đi xem phim dù đã được mời; câu này nhẹ nhàng bảo không sao. Đáp án 1 tiếc nuối, đáp án 3 xin lỗi lại, không phải phản hồi trấn an phù hợp. Khôi phục lựa chọn từ transcript.',
  ],
  toan_q_2021_12_101: [
    1,
    'Đáp án 1 — 「拝見します」: “Tôi xin phép xem ạ.” Người nói được giới thiệu cuốn sách do giám đốc viết và đáp bằng cách khiêm nhường nói mình sẽ xem. 「お見せします」 là tôi sẽ cho người khác xem; 「お目にかかります」 nghĩa là gặp người, không dùng cho sách. Khôi phục lựa chọn từ transcript.',
  ],
  toan_q_2021_07_74: [
    4,
    'Đáp án 4 — đưa thẻ vào máy đọc để mở cửa. Dịch câu hỏi: “Người phụ nữ mở cửa bằng cách nào?” Nhân viên giải thích nhân viên chính thức dùng mã số hoặc ngón trỏ, nhưng nhân viên thời vụ như cô phải dùng thẻ. Chạm ngón tay và nhập mã không phải cách cô được hướng dẫn.',
  ],
  toan_q_2021_07_75: [
    4,
    'Đáp án 4 — mua vở và trứng. Dịch câu hỏi: “Cô bé sẽ mua gì?” Bố ban đầu nói thiếu bắp cải nhưng thấy đã có cải thảo nên bảo không cần mua bắp cải; ông nhờ mua thêm trứng. Cô vốn đang đi mua vở, nên tổng cộng mang về vở và trứng.',
  ],
  toan_q_2021_07_76: [
    1,
    'Đáp án 1 — chở kệ sách bằng xe tới nhà cô bạn. Dịch câu hỏi: “Nam sinh giúp việc gì?” Cô đã quyết định mua kệ và chỉ nhờ chở kệ về nhà. Cô sẽ tự lắp ráp, không cần chọn kệ cùng ở cửa hàng, cũng tự sơn sau khi lắp.',
  ],
  toan_q_2021_07_77: [
    2,
    'Đáp án đang lưu là 2 — tháo tất trước khi đo chiều cao và cân nặng. Dịch câu hỏi: “Người khám sức khỏe làm gì đầu tiên?” Y tá yêu cầu cởi tất trước khi đo; sau đó mới đo huyết áp và vào khám nội khoa để nộp phiếu khảo sát. Phiếu cần giữ tới lúc gặp bác sĩ. Tuy nhiên các phương án hiện chỉ còn hình nên chưa xác định được số 2 ứng với thao tác nào hoặc loại từng hình sai.',
  ],
  toan_q_2021_07_78: [
    1,
    'Đáp án 1 — làm lại tài liệu cuộc họp, đổi bảng ở trang ba thành biểu đồ. Dịch câu hỏi: “Người đàn ông làm gì trước?” Trưởng bộ phận bảo ưu tiên việc này, dù anh vốn được giao nộp báo cáo công tác buổi sáng; bà sẽ giải thích với trưởng phòng Mori. Đi gặp khách là việc của Honda, còn nộp báo cáo bị lùi lại.',
  ],
  toan_q_2021_07_79: [
    2,
    'Đáp án 2 — gửi một phong bì đã ghi địa chỉ nhà mình. Dịch câu hỏi: “Anh cần gửi bổ sung gì để nhận giấy chứng nhận tốt nghiệp?” Phòng sinh viên đã nhận mẫu đơn, bản sao bằng lái và phí bằng tem; quy định mới yêu cầu người xin tự chuẩn bị phong bì hồi đáp có ghi địa chỉ. Vì vậy không cần gửi lại mẫu đơn, giấy tờ tùy thân hay tem phí.',
  ],
  toan_q_2021_07_80: [
    3,
    'Đáp án 3 — đi sở thú. Dịch câu hỏi: “Gia đình quyết định làm gì vào ngày sinh nhật của con?” Mẹ gợi ý sở thú vì Takuya thích động vật và cả nhà có thể cùng đi; bố đồng ý. Đi ăn là kế hoạch năm ngoái, mua sách là món con muốn nhưng không phải hoạt động chốt, còn xem bóng đá bị bỏ vì mẹ không hiểu môn này.',
  ],
  toan_q_2021_07_81: [
    2,
    'Đáp án 2 — anh lên nhầm tàu nhanh và đi quá ga. Dịch câu hỏi: “Vì sao người đàn ông đến muộn?” Anh nói đã dậy sớm nhưng lên tàu tốc hành nên bị đưa tới ga tiếp theo. Cô gái nhắc các khả năng ngủ quên, không muốn xem phim hay quên hẹn, nhưng anh phủ nhận.',
  ],
  toan_q_2021_07_82: [
    2,
    'Đáp án 2 — hy vọng gặp được ca sĩ cô yêu thích. Dịch câu hỏi: “Vì sao người phụ nữ bắt đầu đi dạo?” Cô nghe tin ca sĩ mình yêu thích sống trong khu phố và bắt đầu đi bộ với hy vọng tình cờ gặp. Sức khỏe là lý do người đàn ông nêu cho bản thân; tư thế tốt và cảm nhận mùa là kết quả tích cực về sau.',
  ],
  toan_q_2021_07_83: [
    4,
    'Đáp án 4 — cô thấy khu phố trở nên sôi động hơn. Dịch câu hỏi: “Người phụ nữ nghĩ gì về sự thay đổi của khu phố?” Cô thừa nhận các cửa hàng cũ dần biến mất nhưng vẫn cho rằng nhiều cửa hàng mới và người trẻ khiến nơi này có sức sống. Cô không nói mình thường dùng cửa hàng mới; cũng không khó chịu vì người trẻ kéo đến.',
  ],
  toan_q_2021_07_84: [
    1,
    'Đáp án 1 — chim dễ chăm hơn khi cô thường đi công tác. Dịch câu hỏi: “Vì sao người phụ nữ chọn nuôi chim?” Cô vắng nhà vài ngày vì công việc và không thể đưa chó hoặc mèo đi dạo hằng ngày; chim có thể ở nhà với thức ăn và nước. Màu lông, việc đậu trên tay hay tiếng kêu dễ thương là chi tiết người đàn ông nêu, không phải lý do chọn.',
  ],
  toan_q_2021_07_85: [
    3,
    'Đáp án 3 — cuộc thi tạo cơ hội giao lưu cho người dân. Dịch câu hỏi: “Thị trưởng muốn mọi người biết điều gì nhất về cuộc marathon?” Trẻ em, người nước ngoài và khách du lịch đều tham gia, nhưng điều ông nhấn mạnh nhất là cuộc thi giúp cư dân địa phương vượt qua khác biệt ngôn ngữ và văn hóa để gặp gỡ.',
  ],
  toan_q_2021_07_86: [
    4,
    'Đáp án 4 — bộ phim không cảm động như cô đã tưởng. Dịch câu hỏi: “Người phụ nữ thấy bộ phim thế nào?” Vì nghe nhiều lời khen, cô đã kỳ vọng quá cao; khi xem thì không xúc động tới mức bạn đi cùng đã khóc. Cô không nói bộ phim hoàn toàn không làm mình xúc động, cũng không thấy nó hay hơn mong đợi. Khôi phục lựa chọn từ transcript.',
  ],
  toan_q_2021_07_87: [
    4,
    'Đáp án 4 — lời mời đến dự tiệc chào đón. Dịch câu hỏi: “Mục đích chính của cuộc gọi là gì?” Người gọi chúc mừng năm mới và hỏi thăm nhà mới như lời mở đầu, nhưng việc chính là mời người nghe đến tiệc chào đón Yamada khi anh ấy trở về Nhật tháng sau. Khôi phục lựa chọn từ transcript.',
  ],
  toan_q_2021_07_88: [
    1,
    'Đáp án 1 — lịch sử của chocolate. Dịch câu hỏi: “Phát thanh viên nói về khía cạnh nào của chocolate?” Bài nói kể chocolate từng được dùng như đồ uống, rồi chocolate ăn được có đường xuất hiện ở thế kỷ 19 và mất thời gian mới phổ biến tại Nhật. Nguyên liệu và các loại chocolate chỉ là thông tin nền, chủ đề là quá trình lịch sử. Khôi phục lựa chọn từ transcript.',
  ],
  toan_q_2021_07_89: [
    3,
    'Đáp án 3 — 「ご無沙汰しております」: “Lâu rồi không gặp ạ.” Đây là lời chào trang trọng khi gặp lại giáo viên đã lâu không gặp. 「ご苦労様です」 thường dùng để ghi nhận công sức cấp dưới; phương án 2 không phải lời chào tự nhiên trong tình huống này. Khôi phục lựa chọn từ transcript.',
  ],
  toan_q_2021_07_90: [
    1,
    'Đáp án 1 — 「ボタン取れてるよ」: “Này, nút áo bị tuột/mất rồi.” Nút đã rơi khỏi áo khoác nên dùng trạng thái đã xảy ra. Đáp án 2 nói nút sắp rơi; đáp án 3 bảo phải tháo nút, khác hẳn tình huống. Khôi phục lựa chọn từ transcript.',
  ],
  toan_q_2021_07_91: [
    1,
    'Đáp án 1 — 「撮るなって書いてあるよ」: “Có ghi là đừng chụp ảnh đấy.” Đây là cách nhắc bạn chú ý biển cấm. Đáp án 2 bảo có thể chụp; đáp án 3 nói bắt buộc phải chụp, đều trái với quy định. Khôi phục lựa chọn từ transcript.',
  ],
  toan_q_2021_07_92: [
    3,
    'Đáp án 3 — 「ご一緒させてください」: “Xin cho tôi được đi cùng.” Người nghe muốn nhận lời mời chơi golf của trưởng bộ phận và dùng cách nói khiêm nhường lịch sự. Đáp án 1 mời cấp trên tới nơi của mình; đáp án 2 nhờ mời vào dịp khác, không nhận lời lần này. Khôi phục lựa chọn từ transcript.',
  ],
  toan_q_2021_07_93: [
    2,
    'Đáp án 2 — 「こちらこそ」: “Chính tôi mới phải cảm ơn anh/chị.” Khi người kia cảm ơn vì đã giúp đỡ, câu này đáp lại rằng mình cũng vậy. Đáp án 1 là lời nhờ vả; đáp án 3 nói không sao, không phải đáp lời cảm ơn tự nhiên ở đây. Khôi phục lựa chọn từ transcript.',
  ],
  toan_q_2021_07_94: [
    3,
    'Đáp án 3 — 「遊びじゃなくて仕事だから」: “Không phải đi chơi đâu, là đi công tác mà.” Người kia nói ghen tị vì chuyến đi nước ngoài; đáp án làm rõ đó là công việc, không phải kỳ nghỉ vui chơi. Đáp án 1 nói chuyến công tác bận; đáp án 2 đòi quà, nhưng không phản hồi ý hiểu nhầm chuyến đi là du lịch. Khôi phục lựa chọn từ transcript.',
  ],
  toan_q_2021_07_95: [
    1,
    'Đáp án 1 — 「また手伝うからいつでも言って」: “Lần sau mình lại giúp, cứ nói nhé.” Đồng nghiệp khen nhờ Sato mà chuẩn bị họp xong sớm; đáp lại phù hợp là sẵn sàng giúp thêm lần nữa. Đáp án 2 cảm ơn người vừa giúp mình, đảo vai; đáp án 3 hỏi bắt đầu từ đâu như thể việc chưa làm xong. Khôi phục lựa chọn từ transcript.',
  ],
  toan_q_2021_07_96: [
    2,
    'Đáp án 2 — 「温かいうちに」: “Vậy mình ăn lúc còn nóng nhé, cảm ơn.” Pizza vừa giao và được mời ăn trước khi nguội; người nghe nhận lời. Đáp án 1 hiểu ngược là để sau; đáp án 3 hỏi pizza đã nguội chưa, không ăn khớp lời mời. Khôi phục lựa chọn từ transcript.',
  ],
  toan_q_2021_07_97: [
    2,
    'Đáp án 2 — 「ずっと降りそうですね」: “Có vẻ sẽ mưa dai dẳng đấy.” Người kia nói mưa rất to và không có vẻ sắp tạnh; đáp án đồng tình dự báo mưa sẽ tiếp tục. Đáp án 1 nói mưa đã dứt, còn 3 cho rằng không cần ô, trái với tình hình. Khôi phục lựa chọn từ transcript.',
  ],
  toan_q_2021_07_98: [
    2,
    'Đáp án 2 — 「肉だけじゃなくて野菜も食べてるよ」: “Con ăn rau chứ đâu chỉ ăn thịt.” Đây là lời phản hồi rằng mình đã ăn cả rau khi bị nhắc ăn thêm rau. Đáp án 1 hỏi có thể không ăn rau không; đáp án 3 hiểu thành phải chỉ ăn thịt. Khôi phục lựa chọn từ transcript.',
  ],
  toan_q_2021_07_99: [
    1,
    'Đáp án 1 — 「うっかりしてました。すぐやります」: “Em sơ ý mất. Em sẽ làm ngay.” Cấp trên nhắc đã giao cả việc ghim tài liệu bằng dập ghim, người nghe nhận lỗi quên và hứa làm. Đáp án 2 hỏi có cần ghim không; đáp án 3 hiểu nhầm nhiệm vụ chỉ là photocopy. Khôi phục lựa chọn từ transcript.',
  ],
  toan_q_2021_07_100: [
    1,
    'Đáp án 1 — 「募集する方向で行きましょう」: “Ừ, ta tiến hành theo hướng kêu gọi người tiêu dùng gửi ý tưởng nhé.” Người kia đề xuất thu thập ý tưởng sản phẩm từ khách hàng và đáp án chấp thuận. Đáp án 2 hỏi có phải dừng tuyển ý tưởng; đáp án 3 xác nhận không nhận từ người tiêu dùng, ngược với đề xuất. Khôi phục lựa chọn từ transcript.',
  ],
  toan_q_2021_07_101: [
    2,
    'Đáp án 2 — 「そこにあるんで、持ってって」: “Tài liệu ở đằng kia, cứ mang đi.” Người gọi đến nhận tài liệu đã nhờ chuẩn bị; nhân viên chỉ chỗ để lấy. Đáp án 1 yêu cầu người kia làm tài liệu ngay, còn 3 bảo đặt tài liệu lên bàn thay vì đưa cho người tới lấy. Khôi phục lựa chọn từ transcript.',
  ],
}

const unresolvedVisualIds = [
  'toan_q_2021_12_74',
  'toan_q_2021_12_76',
  'toan_q_2021_12_77',
  'toan_q_2021_12_79',
  'toan_q_2021_07_77',
]

function printedOptions(script) {
  const matches = [...String(script ?? '').matchAll(/^\s*([1-4])\.\s*(.+?)\s*$/gm)]
  if (matches.length < 3 || !matches.every((match, index) => Number(match[1]) === index + 1)) return []
  return matches.map((match) => match[2].replace(/\s*[（(]正解\s*[：:]\s*[1-4][）)]\s*$/, '').trim())
}

const printedAnswers = (script) =>
  [...String(script ?? '').matchAll(/正解\s*[：:]\s*([1-4])/g)].map((match) => Number(match[1]))
const examIds = new Set(['toan-n3-202107-full', 'toan-n3-202112-full'])
const exams = master.filter((exam) => examIds.has(exam.id))
if (exams.length !== 2) throw new Error('Expected both 2021 exams; found ' + exams.length)
const questions = exams.flatMap((exam) =>
  exam.parts.filter((part) => part.title.startsWith('Nghe')).flatMap((part) => part.questions)
)
if (questions.length !== 56) throw new Error('Expected 56 listening questions; found ' + questions.length)

const reviewed = []
const restoredOptionQuestions = []
const mismatches = []
for (const [id, [answer, explanation]] of Object.entries(reviews)) {
  const question = questions.find((item) => item.id === id)
  if (!question?.script) throw new Error('Missing question or transcript: ' + id)
  const markers = printedAnswers(question.script)
  if (
    !markers.length ||
    markers.some((value) => value !== answer) ||
    question.correctAnswer !== answer ||
    question.answer !== answer
  ) {
    mismatches.push({
      id,
      expected: answer,
      stored: [question.correctAnswer, question.answer],
      transcriptMarkers: markers,
    })
    continue
  }
  if (question.number >= 86 && !unresolvedVisualIds.includes(id)) {
    const options = printedOptions(question.script)
    if (options.length !== question.options.length) throw new Error(id + ': could not recover transcript option text')
    question.options = options
    restoredOptionQuestions.push(id)
  }
  curated[id] = explanation
  reviewed.push({
    questionId: id,
    examId: id.includes('_07_') ? 'toan-n3-202107-full' : 'toan-n3-202112-full',
    number: question.number,
    answer,
    transcriptKeyMarkers: markers,
    answerEvidence:
      '正解 marker trong transcript gắn với câu hỏi trùng khóa đang lưu; chưa đối chiếu độc lập với PDF gốc hoặc khóa JLPT chính thức.',
    status: unresolvedVisualIds.includes(id) ? 'needs-visual-mapping' : 'transcript-key-and-explanation-reviewed',
    optionsRecoveredFromTranscript: question.number >= 86 && !unresolvedVisualIds.includes(id),
    explanation,
  })
}
if (mismatches.length) throw new Error('Stored answers do not match transcript keys: ' + JSON.stringify(mismatches))
if (reviewed.length !== 56) throw new Error('Expected 56 reviewed explanations; got ' + reviewed.length)
if (restoredOptionQuestions.length !== 32)
  throw new Error('Expected 32 restored option lists; got ' + restoredOptionQuestions.length)

fs.writeFileSync(masterPath, JSON.stringify(master, null, 2) + '\n')
fs.writeFileSync(curatedPath, JSON.stringify(curated, null, 2) + '\n')
fs.mkdirSync(path.dirname(reportPath), { recursive: true })
fs.writeFileSync(
  reportPath,
  JSON.stringify(
    {
      generatedAt: new Date().toISOString(),
      method:
        'All 56 saved keys were checked against 正解 markers in their attached transcripts and all matched. Vietnamese explanations include question translation and distractor reasoning. Text choices for questions 86–88 and 89–101 in both exams were restored from transcript lines. Five image/letter-diagram questions remain unresolved because the transcript does not map the depicted choices to answer numbers. Original PDFs and official JLPT keys were not independently checked.',
      transcriptSource: 'data/jlpt_n3_toan_master.json, script field on each question',
      answerKeySource: '正解 markers in stored transcripts; original document provenance not independently verified',
      totals: {
        questionsReviewed: reviewed.length,
        explanationsAdded: reviewed.length,
        keysChanged: 0,
        keysMatchedTranscriptMarkers: reviewed.length,
        keysComparedWithOfficialAnswerKey: 0,
        optionsRecoveredFromTranscript: restoredOptionQuestions.length,
        unresolvedVisualMappings: reviewed.filter((row) => row.status === 'needs-visual-mapping').length,
      },
      restoredOptionQuestions,
      limitations: [
        {
          questionIds: unresolvedVisualIds,
          issue:
            'The transcript gives the intended action/answer, but the image or letter-symbol map needed to match it to the numbered choice is missing.',
        },
        {
          issue:
            'Transcript answer markers match saved keys, but the source PDFs and official JLPT answer keys were not independently verified.',
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
    unresolvedVisualMappings: unresolvedVisualIds.length,
    keysChanged: 0,
    reportPath,
  })
)
