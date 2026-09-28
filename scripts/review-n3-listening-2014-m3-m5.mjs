import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = fileURLToPath(new URL('../', import.meta.url))
const masterPath = path.join(root, 'data/jlpt_n3_toan_master.json')
const curatedPath = path.join(root, 'data/jlpt_n3_explanations_curated.json')
const reportPath = path.join(root, 'reports/n3-quality-audit/listening-2014-m3-m5-source-review.json')

const reviews = {
  toan_q_2014_07_87: {
    page: 7,
    answer: 1,
    explanation: `Đáp án 1 — đồ cần mang cho chuyến dã ngoại ngày mai. Dịch câu hỏi: “Thầy giáo chủ yếu nói về việc gì?” Thầy nhắc học sinh tự mang cơm trưa, chuẩn bị ô/áo mưa, mũ và áo khoác vì thời tiết trên núi đổi nhanh, đồng thời đừng quên giấy lịch trình. 2 (thời tiết) chỉ là một lưu ý; 3 (cách leo núi) không được hướng dẫn; 4 (lịch chuyến đi) chỉ được nhắc là giấy cần mang. Ghi nhớ: chọn chủ đề bao quát nhiều chi tiết.`,
  },
  toan_q_2014_07_88: {
    page: 7,
    answer: 4,
    explanation: `Đáp án 4 — nam sinh không thể tham dự buổi họp. Dịch câu hỏi: “Nam sinh muốn nói điều gì?” Thầy Nakamura gọi anh đến phòng nghiên cứu và công việc sẽ kéo dài đến tối muộn, nên anh không thể dự buổi họp và nhờ báo quyết định sau. 1 sai vì anh không xin đổi giờ; 2 sai vì không xin đổi ngày; 3 sai vì không nói sẽ đến muộn mà nói không thể tham dự. Ghi nhớ: nghe kỹ 「出られない」 = không thể tham gia.`,
  },
  toan_q_2014_07_89: {
    page: 8,
    answer: 2,
    explanation: `Đáp án 2 — lý do loại gạo này trở nên nổi tiếng. Dịch câu hỏi: “Người đàn ông đang nói về điều gì?” Ông nói ngoài nỗ lực của nhà sản xuất, người mua đăng cảm nhận về gạo lên Internet đã giúp tên tuổi lan rộng. 1 (vì sao gạo ngon) không phải trọng tâm; 3 (vì sao giao tận nhà) không được nêu; 4 (vì sao lượng tiêu thụ gạo ở Nhật nhiều) hoàn toàn không liên quan. Ghi nhớ: câu kết thường nêu ý chính của đoạn giải thích.`,
  },
  toan_q_2014_07_90: {
    page: 8,
    answer: 3,
    explanation: `Đáp án 3 — “Tôi sắp kết hôn.” Dịch tình huống: “Bạn muốn báo với trưởng phòng rằng mình sắp kết hôn thì nói gì?” 1 nói như thể nghe tin cấp trên sẽ kết hôn; 2 là hứa dự đám cưới của người khác, không báo chuyện của mình; 3 trực tiếp thông báo 「今度結婚することになりました」 và đúng vai người nói.`,
  },
  toan_q_2014_07_91: {
    page: 8,
    answer: 3,
    explanation: `Đáp án 3 — “Có vẻ như hiện giờ không dùng được.” Dịch tình huống: “Thang máy không chạy; nói với người vừa đến sau thế nào?” 1 「お先に失礼します」 là xin phép đi trước; 2 「動かないでください」 bảo người kia đừng cử động, không phải báo thang máy hỏng; 3 「今、使えないようですよ」 truyền đạt đúng thông tin cần thiết.`,
  },
  toan_q_2014_07_92: {
    page: 8,
    answer: 1,
    explanation: `Đáp án 1 — “Cúc áo của bạn bị tuột rồi.” Dịch tình huống: “Bạn thấy cúc áo khoác của bạn mình bị mất thì nói gì?” 1 báo trực tiếp tình trạng; 2 hỏi như thể không nhận ra đây là cúc áo; 3 nói muốn xin/nhận cúc áo, không phù hợp khi báo cho bạn biết áo bị tuột cúc.`,
  },
  toan_q_2014_07_93: {
    page: 8,
    answer: 2,
    explanation: `Đáp án 2 — “Âm thanh có làm bạn thấy phiền không?” Dịch tình huống: “Trong thư viện, bạn muốn hỏi người bên cạnh liệu tiếng tai nghe có ồn không.” 1 đề nghị tăng âm lượng; 3 hỏi người kia có nghe rõ không, không phải hỏi có bị làm phiền; 2 「音、気になりますか」 hỏi đúng mức độ ảnh hưởng tới người bên cạnh.`,
  },
  toan_q_2014_07_94: {
    page: 9,
    answer: 2,
    explanation: `Đáp án 2 — “Sắp có thêm một người đến nên chúng tôi có ba người.” Dịch câu hỏi của nhân viên: “Quý khách có mấy người?” 1 chỉ giới thiệu tên; 3 nói giá mỗi người, không trả lời số khách; 2 cho biết tổng số người và giải thích một người đến sau.`,
  },
  toan_q_2014_07_95: {
    page: 9,
    answer: 1,
    explanation: `Đáp án 1 — “Vâng, chúng ta đi nhé.” Dịch lời mời: “Anh Kimura, nếu anh rảnh thì lát nữa cùng đi ăn nhé?” 1 nhận lời tự nhiên; 2 cảm ơn vì được đãi ăn dù lời mời không nói ai trả tiền; 3 「ご遠慮なさらずに」 là lời mời người khác cứ tự nhiên, không phải câu đáp của người được mời.`,
  },
  toan_q_2014_07_96: {
    page: 9,
    answer: 1,
    explanation: `Đáp án 1 — “À, cứ dùng đi ạ.” Dịch câu nhờ: “Xin lỗi, tôi mượn cây bút này một chút được không?” 1 là người sở hữu đồng ý cho mượn; 2 「すぐお返しします」 là lời người mượn hứa sẽ trả, không phải câu đáp của người được hỏi; 3 「大変結構です」 không diễn đạt sự cho phép trong tình huống này.`,
  },
  toan_q_2014_07_97: {
    page: 9,
    answer: 1,
    explanation: `Đáp án 1 — “Được thôi, đó là giấy tờ gì vậy?” Dịch lời nhờ: “Anh Tanaka, anh xem giúp tài liệu này được không?” 1 chấp nhận rồi hỏi thêm nội dung; 2 hỏi có đi xem cùng không, lệch yêu cầu xem tài liệu; 3 nói đang xem rồi, trong khi lời nhờ vừa mới được đưa ra.`,
  },
  toan_q_2014_07_98: {
    page: 9,
    answer: 2,
    explanation: `Đáp án 2 — “Tôi cũng đang muốn đi.” Dịch lời rủ: “Mình thử đến quán ramen mới mở trước ga nhé, nghe ngon lắm.” 2 hưởng ứng lời rủ; 1 hỏi vì sao không thể đi dù chưa ai từ chối; 3 hỏi trải nghiệm ăn ở đó như thể đã đi rồi.`,
  },
  toan_q_2014_07_99: {
    page: 9,
    answer: 1,
    explanation: `Đáp án 1 — “Lần sau tôi lại giúp, cứ nói nhé.” Dịch lời cảm ơn: “Nhờ Sato mà việc chuẩn bị cuộc họp xong sớm.” 1 đáp lại lời cảm ơn và đề nghị giúp lần sau; 2 là lời cảm ơn của người nhận trợ giúp, sai vai giao tiếp; 3 hỏi bắt đầu từ đâu dù cuộc họp đã chuẩn bị xong.`,
  },
  toan_q_2014_07_100: {
    page: 10,
    answer: 3,
    explanation: `Đáp án 3 — “Ơ, sao lại không được ạ?” Dịch lời báo: “Anh Yamada, trưởng phòng bảo đừng dùng chiếc máy tính anh đang cầm.” 3 hỏi lý do bị cấm, phù hợp phản ứng với lời nhắc; 1 nói sẽ truyền lời cho trưởng phòng, không trả lời việc bị cấm dùng; 2 lại tuyên bố sẽ dùng, trái với chỉ thị.`,
  },
  toan_q_2014_07_101: {
    page: 10,
    answer: 2,
    explanation: `Đáp án 2 — “Xin lỗi, từ sáng tôi phải họp liên tục nên…” Dịch câu hỏi: “Bản báo cáo chuyến công tác đã nộp rồi chứ?” 2 là lời xin lỗi kèm lý do chưa hoàn tất; 1 hỏi có cần báo cáo không, không đúng câu hỏi; 3 nói đã về hôm kia nhưng không giải thích tình trạng báo cáo.`,
  },
  toan_q_2014_07_102: {
    page: 10,
    answer: 3,
    explanation: `Đáp án 3 — “Tôi cũng từng gặp rồi; lúc đó cuống lên thật.” Dịch lời kể: “Hôm qua em phỏng vấn, nhưng bị hỏi một câu ngoài dự đoán.” 3 đồng cảm bằng kinh nghiệm tương tự; 1 nói dự đoán đã trúng, không đúng nghĩa “ngoài dự đoán”; 2 khen đã đặt câu hỏi tốt, nhầm vai giữa người phỏng vấn và ứng viên.`,
  },
  toan_q_2014_12_87: {
    page: 7,
    answer: 4,
    explanation: `Đáp án 4 — đợt khuyến mãi tuần tới. Dịch câu hỏi: “Đây là thông báo về việc gì?” Siêu thị mở cửa như thường lệ nhưng tuần tới sẽ giảm giá một giờ vào buổi sáng và buổi chiều mỗi ngày. 1 sai vì giờ mở cửa không thay đổi; 2 sai vì ngày hoạt động không thay đổi; 3 sai vì không phải khuyến mãi hôm nay. Ghi nhớ: 「来週一週間」 xác định thời điểm là tuần sau.`,
  },
  toan_q_2014_12_88: {
    page: 7,
    answer: 2,
    explanation: `Đáp án 2 — tác dụng của trà. Dịch câu hỏi: “Người phụ nữ nói điều gì về trà?” Cô kể trà Nhật giúp giảm mệt mỏi và uống sau đồ ngọt có thể ngừa sâu răng; chủ đề bao quát là công dụng. 1 (trà và bữa ăn) chỉ là thói quen uống của người đàn ông; 3 (lượng vitamin) không được nói; 4 (nhiệt độ pha trà ngon) không phải nội dung, dù có nhắc uống nóng khi mệt.`,
  },
  toan_q_2014_12_89: {
    page: 8,
    answer: 2,
    explanation: `Đáp án 2 — những việc ông làm để chế tạo dao tốt. Dịch câu hỏi: “Người đàn ông đang nói về điều gì?” Ông học món Tây để chế tạo dao bàn theo yêu cầu, quan sát cách người ta cắt thức ăn và cách dùng dao. 1 sai vì câu hỏi không hỏi lý do làm dao Nhật; 3 sai vì ông không so sánh hai nền ẩm thực; 4 sai vì không hướng dẫn cách ăn đúng. Ghi nhớ: gom các hành động học hỏi, quan sát vào chủ đề chung.`,
  },
  toan_q_2014_12_90: {
    page: 8,
    answer: 2,
    explanation: `Đáp án 2 — “Vậy tôi xin phép hướng dẫn quý khách.” Dịch tình huống: “Bạn đưa khách vào bên trong nhà máy thì nói gì?” Hình cho thấy người nói dẫn khách tham quan; 2 dùng 「ご案内します」 đúng nghĩa hướng dẫn. 1 「これからお伺いします」 là người nói sẽ đến thăm nơi khác; 3 「こちらを見学させてください」 là xin người khác cho mình tham quan, đảo ngược vai.`,
  },
  toan_q_2014_12_91: {
    page: 9,
    answer: 1,
    explanation: `Đáp án 1 — “Anh/chị đánh rơi khăn quàng rồi.” Dịch tình huống: người nói nhặt chiếc khăn người đi trước vừa làm rơi và gọi họ lại. 1 báo trực tiếp vật vừa rơi; 2 chỉ nói có chiếc khăn đang để ở đó, không nói người kia đánh rơi; 3 hỏi người kia có quên khăn, không khớp sự việc vừa chứng kiến.`,
  },
  toan_q_2014_12_92: {
    page: 9,
    answer: 2,
    explanation: `Đáp án 2 — “Tiện thể gửi giúp cả cái này nhé?” Dịch tình huống: đàn em đang đến bưu điện và người nói cũng muốn gửi tài liệu. 2 nhờ gửi thêm nhân tiện; 1 đề nghị tự mang giúp, trái vai vì đàn em đã đi; 3 「お願いしない？」 rủ người khác cùng nhờ, không trực tiếp yêu cầu đàn em.`,
  },
  toan_q_2014_12_93: {
    page: 10,
    answer: 3,
    explanation: `Đáp án 3 — “Xin lỗi, tôi mượn bút được không?” Dịch tình huống: “Trên máy bay, bạn muốn dùng bút nhưng không có.” 3 là lời xin mượn từ người khác; 1 là người có bút đề nghị cho mượn; 2 cũng giả định người nói đang có bút để đưa cho người khác. Ghi nhớ: chú ý ai đang thiếu đồ và ai có thể cho mượn.`,
  },
  toan_q_2014_12_94: {
    page: 10,
    answer: 1,
    explanation: `Đáp án 1 — “Vậy mua nước ép giúp mình nhé.” Dịch lời hỏi: “Tôi đi cửa hàng tiện lợi, có muốn tôi mua gì không?” 1 nêu món cần mua; 2 nói chính người đi cửa hàng sẽ mua cơm hộp cho mình, không phải lời nhờ người kia; 3 từ chối không liên quan vì người nói chỉ hỏi muốn mua gì.`,
  },
  toan_q_2014_12_95: {
    page: 10,
    answer: 2,
    explanation: `Đáp án 2 — “Ơ, vậy có được không ạ?” Dịch lời đề nghị: “Bữa trưa hôm nay để tôi trả nhé.” 2 thể hiện ngạc nhiên và nhận lời lịch sự; 1 hỏi trả riêng từng người, ngược với đề nghị bao; 3 hỏi có thể trả bằng thẻ không, không cần thiết khi người kia mời trả.`,
  },
  toan_q_2014_12_96: {
    page: 11,
    answer: 2,
    explanation: `Đáp án 2 — “Có lẽ trời sẽ còn mưa một lúc nữa.” Dịch nhận xét: “Mưa có vẻ chưa dứt; tôi tưởng chiều trời sẽ nắng.” 2 đồng tình rằng mưa còn kéo dài; 1 nói trời đã nắng và vui vì thế, trái tình hình; 3 nói mưa vừa tạnh, cũng trái với nhận xét “chưa có dấu hiệu dứt”.`,
  },
  toan_q_2014_12_97: {
    page: 11,
    answer: 3,
    explanation: `Đáp án 3 — “Ngày xưa chúng ta hay chơi ở đây nhỉ.” Dịch lời gợi nhớ: “Công viên này hoài niệm thật.” 3 nhắc kỷ niệm chung nên đáp lại tự nhiên; 1 nói đã quên mất, trái sắc thái nhớ lại; 2 hỏi có cảm động vì mới đến lần đầu, không hợp từ 「懐かしい」.`,
  },
  toan_q_2014_12_98: {
    page: 11,
    answer: 3,
    explanation: `Đáp án 3 — “Ôi nguy rồi, chạy thôi?” Dịch lời nhắc: “Phải nhanh lên, không thì không kịp buổi hòa nhạc mất.” 3 đồng ý chạy để kịp; 1 hỏi có cần vội không, trái cảnh báo; 2 nói may đã kịp, trong khi họ vẫn đang trên đường.`,
  },
  toan_q_2014_12_99: {
    page: 11,
    answer: 1,
    explanation: `Đáp án 1 — “Xin lỗi, hôm nay tôi về thẳng nhà.” Dịch lời rủ: “Ca làm thêm kết thúc sớm, ghé đâu đó nhé?” 1 từ chối lịch sự và nêu kế hoạch; 2 nói “nếu bạn bận thì đành vậy”, nhầm người được rủ là người đã từ chối; 3 mong ca làm kết thúc sớm, nhưng lời nói cho biết ca đã kết thúc.`,
  },
  toan_q_2014_12_100: {
    page: 11,
    answer: 3,
    previousAnswer: 1,
    explanation: `Đáp án 3 — “Ơ, sao lại không được ạ?” Dịch lời nhắc: “Anh Yamada, trưởng phòng bảo đừng dùng chiếc máy tính anh đang cầm.” 3 hỏi lý do bị cấm, đúng phản ứng trong đoạn hội thoại; 1 nói sẽ chuyển lời cho trưởng phòng, không liên quan; 2 định tiếp tục dùng trái với chỉ thị. Đã sửa khóa dữ liệu 1→3: PDF cục bộ đánh dấu lựa chọn 3, và nguồn đối chiếu bên ngoài cũng xác nhận câu 7 của Mondai 5 là 3. Ghi nhớ: câu 100 dữ liệu cũ sai khóa.`,
  },
  toan_q_2014_12_101: {
    page: 12,
    answer: 1,
    explanation: `Đáp án 1 — “Vâng, anh/chị muốn xác nhận việc gì ạ?” Dịch lời mở đầu: “Về giấy tờ tôi nhận sáng nay, tôi có điều muốn xác nhận.” 1 mời người kia nói rõ; 2 nói đã nhận giấy tờ rồi nhưng không trả lời điều muốn xác nhận; 3 tự nói muốn kiểm tra trong hôm nay, lặp ý người kia thay vì đáp lại.`,
  },
  toan_q_2014_12_102: {
    page: 12,
    answer: 1,
    explanation: `Đáp án 1 — “Đúng là nhiều thật nhỉ.” Dịch nhận xét: “Ramen quán này một phần cho một người à? Nhiều thế này ăn không nổi đâu.” 1 đồng tình với khẩu phần rất lớn; 2 nói quá ít, trái nghĩa; 3 đề nghị ăn một mình, không đáp lại nhận xét về lượng thức ăn.`,
  },
}

let source = fs.readFileSync(masterPath, 'utf8')
const master = JSON.parse(source)
const curated = JSON.parse(fs.readFileSync(curatedPath, 'utf8'))
const questions = new Map(
  master.flatMap((exam) => exam.parts.flatMap((part) => part.questions)).map((question) => [question.id, question])
)

for (const [id, review] of Object.entries(reviews)) {
  const question = questions.get(id)
  if (!question) throw new Error(`Missing question ${id}`)
  const previousAnswer = review.previousAnswer ?? review.answer
  const keyAlreadyUpdated =
    Boolean(review.previousAnswer) && question.answer === review.answer && question.correctAnswer === review.answer
  if (!keyAlreadyUpdated && (question.answer !== previousAnswer || question.correctAnswer !== previousAnswer)) {
    throw new Error(
      `${id}: expected current keys ${previousAnswer}/${previousAnswer} or already-reviewed ${review.answer}/${review.answer}, got ${question.answer}/${question.correctAnswer}`
    )
  }

  const marker = `"id": "${id}"`
  const start = source.indexOf(marker)
  if (start < 0 || source.indexOf(marker, start + marker.length) >= 0) throw new Error(`Missing or duplicated ${id}`)
  const end = source.indexOf('\n          }', start)
  if (end < 0) throw new Error(`Cannot locate end of ${id}`)
  let block = source.slice(start, end)
  if (review.previousAnswer && !keyAlreadyUpdated) {
    block = block.replace(/("correctAnswer": )\d+/, `$1${review.answer}`)
    block = block.replace(/("answer": )\d+/, `$1${review.answer}`)
  }
  source = source.slice(0, start) + block + source.slice(end)

  const existing = curated[id]
  if (!existing?.startsWith('Chưa thẩm định lời giải nghe.') && !existing?.startsWith(`Đáp án ${review.answer} —`)) {
    throw new Error(`${id}: refusing to overwrite an unrelated reviewed explanation`)
  }
  curated[id] = review.explanation
}

fs.writeFileSync(masterPath, source)
fs.writeFileSync(curatedPath, `${JSON.stringify(curated, null, 2)}\n`)
fs.writeFileSync(
  reportPath,
  `${JSON.stringify(
    {
      generatedAt: '2026-09-27',
      status: 'reviewed_against_local_transcript_pdf',
      sourceQuality: 'The local transcript PDFs are secondary sources, not official JLPT answer-key publications.',
      sources: [
        { file: 'data/n3_scripts/5. N3 7-2014/5. N3 7-2014 (script).pdf', questions: '87-102', pages: '7-10' },
        { file: 'data/n3_scripts/5. N3 12-2014/5. N3 12-2014 (script).pdf', questions: '87-102', pages: '7-12' },
        {
          url: 'https://dethitiengnhat.com/en/jlpt/N3/201412/4',
          note: 'Secondary source with question 100 (Mondai 5, question 7) options and a correction comment confirming answer 3.',
        },
      ],
      reviewedCount: Object.keys(reviews).length,
      reviewed: Object.fromEntries(
        Object.entries(reviews).map(([id, review]) => [
          id,
          {
            answer: review.answer,
            previousAnswer: review.previousAnswer ?? review.answer,
            sourcePage: review.page,
            answerKeyChanged: Boolean(review.previousAnswer),
            matchesStoredAnswer: true,
            explanationUpdated: true,
          },
        ])
      ),
      limits: [
        'The local script PDFs and the cited answer page are secondary sources; no claim is made that the answer keys are official JLPT keys.',
        'Mondai 4 picture prompts were reviewed against the illustrations and response choices printed on the source pages.',
      ],
    },
    null,
    2
  )}\n`
)
console.log(
  `Reviewed ${Object.keys(reviews).length} remaining 2014 listening questions; corrected 12/2014 question 100 from 1 to 3.`
)
