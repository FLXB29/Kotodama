import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = fileURLToPath(new URL('../', import.meta.url))
const masterPath = path.join(root, 'data/jlpt_n3_toan_master.json')
const curatedPath = path.join(root, 'data/jlpt_n3_explanations_curated.json')
const reportPath = path.join(root, 'reports/n3-quality-audit/listening-2014-m1-m2-source-review.json')

const reviews = {
  toan_q_2014_07_75: {
    page: 1,
    answer: 2,
    explanation: `Đáp án 2 — làm chữ lớn hơn. Dịch câu hỏi: “Nữ sinh sẽ làm gì tiếp theo với tài liệu?” Cô hỏi giáo viên cần sửa gì; thầy xác nhận số trong bảng đã sửa, rồi góp ý toàn bộ chữ nên lớn hơn để dễ nhìn. 1 sai vì số liệu đã được sửa; 3 sai vì biểu đồ đã dễ hiểu; 4 sai vì thầy nói phần giải thích không thiếu. Ghi nhớ: chọn việc giáo viên yêu cầu làm, không chọn việc đã hoàn thành.`,
  },
  toan_q_2014_07_76: {
    page: 1,
    answer: 3,
    explanation: `Đáp án 3 — đổi sang đặt xe buýt lớn hơn. Dịch câu hỏi: “Nữ sinh phải làm gì?” Cô đã đặt khách sạn và phòng họp, đồng thời đặt xe buýt; nam sinh nhắc xe năm trước quá nhỏ nên cô đồng ý đổi sang xe lớn. 1 và 2 sai vì khách sạn, phòng họp đã đặt xong; 4 sai vì cô đã báo lịch cho giáo viên. Ghi nhớ: phân biệt việc đã làm với yêu cầu mới phát sinh.`,
  },
  toan_q_2014_07_77: {
    page: 1,
    answer: 4,
    explanation: `Đáp án 4 — đến phòng nghiên cứu của thầy. Dịch câu hỏi: “Nam sinh sẽ làm gì tiếp theo?” Cuốn sách không có ở thư viện và hiệu sách quanh đó không bán; người đang mượn còn có người chờ sau. Nữ sinh nói thầy Mori có thể có sách và vừa thấy thầy ở phòng nghiên cứu, nên khuyên nam sinh đi hỏi ngay. 1 và 2 không giải quyết được vì sách không có ở đó; 3 gọi người quen không phải bước được chọn sau lời khuyên. Ghi nhớ: bám vào hành động cuối cùng được thống nhất.`,
  },
  toan_q_2014_07_78: {
    page: 2,
    answer: 2,
    explanation: `Đáp án 2 — gửi fax tập tài liệu quảng cáo. Dịch câu hỏi: “Người phụ nữ phải làm gì trước tiên?” Người đàn ông nhờ nhắn với anh Hayashi rằng muốn nhận tập brochure sớm và đề nghị gửi fax; cô đồng ý. 1 sai vì chỉ chuyển lời nhắn chưa hoàn tất yêu cầu gửi tài liệu; 3 sai vì bưu điện không được yêu cầu cho việc này; 4 sai vì không cần tự mang đến. Ghi nhớ: phân biệt phương thức được yêu cầu ngay với cách giao bản in sau đó.`,
  },
  toan_q_2014_07_79: {
    page: 3,
    answer: 2,
    explanation: `Đáp án 2 — mang 6.000 yên và cây đàn guitar. Dịch câu hỏi: “Thứ Ba tuần sau người đàn ông phải mang gì?” Học phí là 6.000 yên mỗi tháng; phí gia nhập 4.000 yên được miễn nếu đăng ký trước thứ Ba. Anh đã có đàn và cần mang đàn đến học. 1 thiếu cây đàn; 3 và 4 cộng khoản 4.000 yên đã được miễn. Ghi nhớ: tách học phí định kỳ khỏi phí gia nhập đang được miễn.`,
  },
  toan_q_2014_07_80: {
    page: 3,
    answer: 1,
    explanation: `Đáp án 1 — xem trang web của trường. Dịch câu hỏi: “Sáng mai sinh viên cần làm gì?” Vì dự báo có tuyết lớn, trường sẽ thông báo trên trang chủ trước 6 giờ liệu xe buýt/tàu có dừng và trường có nghỉ hay không. 2 sai vì email không phải kênh được nêu; 3 sai vì thầy dặn không gọi trực tiếp cho trường; 4 sai vì không được yêu cầu đến trường lúc 8 giờ 30. Ghi nhớ: tìm kênh thông báo được chỉ định.`,
  },
  toan_q_2014_07_81: {
    page: 4,
    answer: 4,
    explanation: `Đáp án 4 — làm phim cùng cả lớp. Dịch câu hỏi: “Nam sinh nói kỷ niệm đẹp nhất thời cấp ba là gì?” Nữ sinh nhắc chuyến du lịch vui, nhưng nói làm phim với lớp mới là kỷ niệm đáng nhớ nhất; nam sinh đồng tình đó cũng là kỷ niệm đẹp nhất của mình. 1, 2 và 3 (luyện sumo, tự kiếm tiền, đi du lịch) không phải lựa chọn cuối cùng được cả hai xác nhận. Ghi nhớ: bắt từ nhấn mạnh 「やっぱり」 để nhận ra điều người nói chọn sau khi cân nhắc.`,
  },
  toan_q_2014_07_82: {
    page: 4,
    answer: 2,
    explanation: `Đáp án 2 — cô ấy có vẻ hợp với công việc bán hàng. Dịch câu hỏi: “Người đàn ông nói nhân viên mới là người thế nào?” Anh nói cô ấy chưa có kinh nghiệm bán hàng nhưng vui vẻ, có vẻ hợp nghề; nếu học thêm sản phẩm thì sẽ làm được việc. 1 sai vì cô chưa có kinh nghiệm; 3 sai vì kiến thức sản phẩm còn phải học; 4 sai vì chưa nói cô đã làm việc rất giỏi. Ghi nhớ: 「向いている」 nghĩa là phù hợp/nhiều tố chất với công việc.`,
  },
  toan_q_2014_07_83: {
    page: 5,
    answer: 3,
    explanation: `Đáp án 3 — vì chi phí nguyên liệu cao. Dịch câu hỏi: “Vì sao người đàn ông thấy nấu ăn cùng con vất vả?” Anh thường làm theo công thức và phải mua nhiều gia vị, nguyên liệu nên tốn tiền. 1 sai vì không than tốn thời gian; 2 sai vì không lo con bị thương; 4 sai vì chuyện làm bẩn bếp là ví dụ người phụ nữ kể về chồng cô ấy. Ghi nhớ: phân biệt lý do người đàn ông nêu với ví dụ của người đối thoại.`,
  },
  toan_q_2014_07_84: {
    page: 5,
    answer: 4,
    explanation: `Đáp án 4 — vào quán ăn. Dịch câu hỏi: “Hai người sẽ làm gì trước tiên?” Xe buýt vừa chạy, chuyến kế tiếp còn một giờ; gọi taxi khó, đi bộ ra ga mất hơn một giờ. Họ thấy quán ăn và quyết định vào đó trong lúc chờ xe. 1 sai vì không muốn đứng chờ ở bến; 2 và 3 đều mất quá lâu/không khả thi theo lời thoại. Ghi nhớ: 「まず」 hỏi hành động ngay tiếp theo, không phải phương án di chuyển cuối cùng.`,
  },
  toan_q_2014_07_85: {
    page: 6,
    answer: 3,
    explanation: `Đáp án 3 — thuốc kem cho bé một tuổi và miếng dán cho bé bốn tuổi. Dịch câu hỏi: “Người phụ nữ sẽ mua thuốc nào?” Bé một tuổi chỉ dùng được thuốc dạng kem; với bé bốn tuổi, miếng dán phù hợp vì không cần bôi vào chỗ đang ngứa, tránh gãi làm trầy da. 1 thiếu thuốc cho bé lớn; 2 chỉ có thuốc nước và không có loại phù hợp cho bé nhỏ; 4 có thuốc nước thay vì kem cho bé một tuổi. Ghi nhớ: xét giới hạn độ tuổi của từng dạng thuốc.`,
  },
  toan_q_2014_07_86: {
    page: 6,
    answer: 2,
    explanation: `Đáp án 2 — động cơ phát ra tiếng lạ. Dịch câu hỏi: “Vì sao người phụ nữ gọi gara?” Tay lái đã được sửa tuần trước; hôm nay cô nghe động cơ phát tiếng bất thường nên gọi lại. 1 sai vì tay lái là sự cố cũ đã sửa; 3 sai vì cô không gọi để phàn nàn giá sửa; 4 sai vì phanh không có vấn đề. Ghi nhớ: đối chiếu lời mở đầu về lần sửa trước với triệu chứng mới khiến người gọi liên hệ.`,
  },
  toan_q_2014_12_75: {
    page: 1,
    answer: 2,
    explanation: `Đáp án 2 — mặc sơ mi và thắt cà vạt, không mặc áo vest. Dịch câu hỏi: “Ngày mai đàn em sẽ mặc thế nào?” Áo vest đang ở tiệm giặt; đàn anh nói chỉ mặc sơ mi là được, rồi nhắc đừng quên cà vạt. 1 sai vì thiếu cà vạt; 3 và 4 sai vì đều mặc áo vest đang chưa lấy về được. Ghi nhớ: ghép hai chi tiết cuối: 「ワイシャツだけ」 và 「ネクタイを忘れない」; hình số 2 khớp trang phục đó.`,
  },
  toan_q_2014_12_76: {
    page: 2,
    answer: 3,
    explanation: `Đáp án 3 — mang khăn và giấy tờ. Dịch câu hỏi: “Người làm thêm phải mang gì ngày mai?” Găng tay đã được chuẩn bị tại chỗ; mỗi người tự mang khăn lau mồ hôi. Vì tiền lương sẽ chuyển khoản, họ còn phải ghi thông tin cần thiết vào giấy tờ và mang theo. 1 và 2 sai vì găng tay không cần mang; 4 sai vì thiếu giấy tờ chuyển lương. Ghi nhớ: phân biệt 「用意します」 (đã chuẩn bị) với 「自分でご用意」 (tự mang).`,
  },
  toan_q_2014_12_77: {
    page: 2,
    answer: 1,
    explanation: `Đáp án 1 — giúp chở kệ sách. Dịch câu hỏi: “Người đàn ông sẽ giúp việc gì?” Cô gái đã chọn kệ và muốn chở về bằng ô tô; kệ thuộc loại tự lắp ráp và cô tự làm được, không cần sơn hộ. 2 sai vì không cần chọn kệ tại cửa hàng; 3 sai vì cô tự lắp ráp; 4 sai vì cô muốn tự sơn sau khi lắp. Ghi nhớ: yêu cầu ban đầu là nhờ đưa kệ lên xe/chở về, không phải lắp hay sơn.`,
  },
  toan_q_2014_12_78: {
    page: 3,
    answer: 3,
    explanation: `Đáp án 3 — ngâm bồn nước ấm trước khi ngủ. Dịch câu hỏi: “Tối nay người đàn ông sẽ làm gì để dễ ngủ?” Nhạc rock anh nghe làm tỉnh ngủ; anh không thích sữa; người phụ nữ gợi ý tắm nước ấm và anh quyết định thử ngay. 1 sai vì nhạc khiến khó ngủ hơn; 2 sai vì anh không uống sữa; 4 sai vì anh bận và chỉ định tập khi công việc ổn định. Ghi nhớ: tìm đề xuất được chấp nhận ngay, không chọn lời khuyên để dành sau.`,
  },
  toan_q_2014_12_79: {
    page: 3,
    answer: 2,
    explanation: `Đáp án 2 — mua rau và trứng ở siêu thị. Dịch câu hỏi: “Người chồng phải làm gì?” Anh đã lấy quần áo ở tiệm giặt rồi; vợ nhờ mua cà rốt và trứng để nấu bữa tối. Vợ sẽ tự dắt chó đi dạo. 1 sai vì quần áo đã được lấy; 3 sai vì vợ đang chuẩn bị bữa tối; 4 sai vì người vợ nhận dắt chó. Ghi nhớ: sau khi loại việc đã làm và việc người kia nhận, còn yêu cầu mua thực phẩm.`,
  },
  toan_q_2014_12_80: {
    page: 4,
    answer: 4,
    explanation: `Đáp án 4 — lấy thùng giấy và đổi tiền xu. Dịch câu hỏi: “Hôm nay đàn em phải chuẩn bị gì?” Cô đã nhận đi lấy thùng giấy ở cửa hàng; người đàn anh sẽ tự mang máy tính từ nhà. Anh nhờ cô đổi tiền thành đồng 100 yên vì anh không kịp ra ngân hàng. Trong hình, ア là đĩa, イ là thùng, ウ là máy tính, エ là tiền xu; đáp án イエ là lựa chọn 4. Lựa chọn 1 (アウ) sai vì đĩa đã được người khác lo và máy tính do đàn anh mang; 2 (アエ) sai vì vẫn thiếu thùng; 3 (イウ) sai vì không cần máy tính và thiếu tiền xu; 4 (イエ) đúng. Ghi nhớ: đọc cả lời thoại lẫn ký hiệu trong hình.`,
  },
  toan_q_2014_12_81: {
    page: 5,
    answer: 3,
    explanation: `Đáp án 3 — bức ảnh con chim lạ ở hồ. Dịch câu hỏi: “Bức ảnh đăng trên tạp chí chụp gì?” Người đàn ông kể đã chụp trẻ em và hoa nhưng cuối cùng nhấn mạnh con chim hiếm chưa từng thấy ở hồ; đó là bức ảnh được đăng. 1 sai vì trẻ em chỉ là một loại ảnh anh từng chụp; 2 sai vì hoa đẹp nhưng không phải ảnh được chọn; 4 sai vì anh nói là chim, không phải cá. Ghi nhớ: theo dõi câu chuyện đến chi tiết giải thích bức ảnh cụ thể.`,
  },
  toan_q_2014_12_82: {
    page: 5,
    answer: 4,
    explanation: `Đáp án 4 — vì anh gặp bạn cũ trên tàu rồi đi ăn cùng. Dịch câu hỏi: “Vì sao nam sinh không xem được trận bóng đá?” Anh đã hoàn thành báo cáo từ trước; sau ca làm thêm, trên tàu tình cờ gặp bạn cũ nên quyết định đi ăn. 1 sai vì báo cáo đã xong; 2 sai vì không nhắc sức khỏe; 3 sai vì anh đã kết thúc ca làm, đó không phải lý do lỡ trận. Ghi nhớ: lý do xuất hiện sau mốc 「帰りの電車の中で」.`,
  },
  toan_q_2014_12_83: {
    page: 6,
    answer: 1,
    explanation: `Đáp án 1 — lớp sơ cấp món Nhật. Dịch câu hỏi: “Người đàn ông đăng ký lớp nào?” Anh muốn học nấu món Nhật từ căn bản và nói mình chưa tự tin với món Nhật; vì vậy chọn lớp sơ cấp món Nhật. 2 sai vì lớp trung cấp dành cho món khó hơn; 3 và 4 sai vì đó là món Âu trong khi mục tiêu là nấu món Nhật. Ghi nhớ: 初級 (しょきゅう) là sơ cấp; 和食 (わしょく) là món Nhật.`,
  },
  toan_q_2014_12_84: {
    page: 6,
    answer: 2,
    explanation: `Đáp án 2 — vì người mình kính trọng từng học ở trường này. Dịch câu hỏi: “Vì sao nam sinh chọn trường đại học này?” Thầy chủ nhiệm cấp ba mà anh ngưỡng mộ từng tốt nghiệp trường này, nên anh muốn theo học ở đó. 1 là điều kiện học tập tốt nhưng không phải lý do anh nêu; 3 sai vì anh chưa chọn trường để làm giáo viên ngoại ngữ; 4 sai vì anh chỉ bắt đầu quan tâm đến ngôn ngữ sau khi vào đại học. Ghi nhớ: phân biệt lý do chọn trường với cảm nhận hiện tại.`,
  },
  toan_q_2014_12_85: {
    page: 6,
    answer: 3,
    explanation: `Đáp án 3 — muốn nghe chuyện của chủ quán. Dịch câu hỏi: “Vì sao người đàn ông thường đến quán cà phê này?” Anh không thích nhạc jazz hay đồ ngọt, nhưng chủ quán kể chuyện rất cuốn hút và anh thích nghe. 1 sai vì anh không quan tâm nhạc jazz; 2 sai vì anh không thích bánh ngọt; 4 sai vì sách về núi là sở thích của những khách khác, không phải lý do anh đến. Ghi nhớ: 「店の主人の話」 là chuyện do chủ quán kể.`,
  },
  toan_q_2014_12_86: {
    page: 7,
    answer: 1,
    explanation: `Đáp án 1 — đổi tàu ở ga Higashi (東駅). Dịch câu hỏi: “Người đi Sakura phải đổi tàu ở đâu?” Thông báo nói tàu nhanh dừng ở Higashi và Nishi rồi đến ga cuối Midoriyama; tàu không dừng ở Kita và Sakura, nên khách xuống tại ga dừng kế tiếp để đổi sang tàu thường đi Sakura. 2 sai vì Nishi không phải ga đổi được yêu cầu; 3 là ga cuối tuyến nhanh; 4 tàu không dừng ở đó. Ghi nhớ: 「次の東駅で各駅停車にお乗り換え」 = đổi ở ga Higashi kế tiếp.`,
  },
}

const exams = JSON.parse(fs.readFileSync(masterPath, 'utf8'))
const curated = JSON.parse(fs.readFileSync(curatedPath, 'utf8'))
const questions = new Map(
  exams.flatMap((exam) => exam.parts.flatMap((part) => part.questions)).map((question) => [question.id, question])
)

for (const [id, review] of Object.entries(reviews)) {
  const question = questions.get(id)
  if (!question) throw new Error(`Missing question ${id}`)
  if (question.answer !== review.answer || question.correctAnswer !== review.answer) {
    throw new Error(
      `${id}: reviewed answer ${review.answer} does not match stored keys ${question.answer}/${question.correctAnswer}`
    )
  }
  if (
    !curated[id]?.startsWith('Chưa thẩm định lời giải nghe.') &&
    !curated[id]?.startsWith(`Đáp án ${review.answer} —`)
  ) {
    throw new Error(`${id}: refusing to overwrite an unrelated reviewed explanation`)
  }
  curated[id] = review.explanation
}

fs.mkdirSync(path.dirname(reportPath), { recursive: true })
fs.writeFileSync(curatedPath, `${JSON.stringify(curated, null, 2)}\n`)
fs.writeFileSync(
  reportPath,
  `${JSON.stringify(
    {
      generatedAt: '2026-09-27',
      status: 'reviewed_against_local_transcript_pdf',
      sourceQuality:
        'The local transcript PDFs identify themselves as JLPT N3 scripts but are not an official JLPT answer-key publication.',
      sources: [
        { file: 'data/n3_scripts/5. N3 7-2014/5. N3 7-2014 (script).pdf', questions: '75-86', pages: '1-6' },
        { file: 'data/n3_scripts/5. N3 12-2014/5. N3 12-2014 (script).pdf', questions: '75-86', pages: '1-7' },
      ],
      reviewedCount: Object.keys(reviews).length,
      reviewed: Object.fromEntries(
        Object.entries(reviews).map(([id, review]) => [
          id,
          {
            answer: review.answer,
            sourcePage: review.page,
            matchesStoredAnswer: true,
            explanationUpdated: true,
          },
        ])
      ),
      limits: [
        'No full transcript was restored; the reviewed material is a Vietnamese explanation based on the matching local script page.',
        'This report documents the first review batch (questions 75-86); the follow-up batch for questions 87-102 is documented in listening-2014-m3-m5-source-review.json.',
        'The transcript PDFs are secondary sources, so this does not certify the answer key as an official JLPT key.',
      ],
    },
    null,
    2
  )}\n`
)
console.log(`Reviewed ${Object.keys(reviews).length} listening questions from the 2014 Mondai 1-2 source PDFs.`)
