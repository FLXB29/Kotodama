import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = fileURLToPath(new URL('../', import.meta.url))
const masterPath = path.join(root, 'data/jlpt_n3_toan_master.json')
const curatedPath = path.join(root, 'data/jlpt_n3_explanations_curated.json')
const reportPath = path.join(root, 'reports/n3-quality-audit/listening-2020-transcript-review.json')
const master = JSON.parse(fs.readFileSync(masterPath, 'utf8').replace(/^\uFEFF/, ''))
const curated = JSON.parse(fs.readFileSync(curatedPath, 'utf8').replace(/^\uFEFF/, ''))

const reviews = {
  toan_q_2020_12_74: [
    2,
    'Đáp án 2 — cho 20 hộp cơm vào thùng carton. Dịch câu hỏi: “Nhân viên làm gì trước?” Cơm hộp đã làm xong; quản lý nhờ đóng chúng vào thùng trước. Xe được chuyển ra trước cửa sau đó, còn 20 chai trà chỉ đặt lên xe ngay trước lúc giao.',
  ],
  toan_q_2020_12_75: [
    3,
    'Đáp án 3 — viết bản nháp báo cáo khoảng một trang. Dịch câu hỏi: “Nam sinh phải làm gì trước tuần sau?” Tài liệu đã thu thập và chủ đề nghiên cứu đã chọn; bài tập là viết bản nháp. Giáo viên nói lần này chưa cần biểu đồ hay bảng, còn việc thảo luận ý kiến đã diễn ra ở buổi trước.',
  ],
  toan_q_2020_12_76: [
    4,
    'Đáp án đang lưu là 4 — mua lịch năm sau có ảnh đẹp về Kyoto để dùng trong phòng nghiên cứu. Dịch câu hỏi: “Nam sinh mua quà lưu niệm nào?” Giáo viên muốn có lịch dùng trong phòng nghiên cứu; bánh kẹo không hợp vì thầy không ăn vặt, còn bát có thể vỡ và chưa chắc thầy dùng quạt. Transcript xác định món quà dự định, nhưng các lựa chọn chỉ còn ký hiệu hình nên chưa thể xác minh món đó ứng với số 4 hay giải thích từng hình nhiễu.',
  ],
  toan_q_2020_12_77: [
    2,
    'Đáp án 2 — sao chép thêm tài liệu để đủ 60 bộ. Dịch câu hỏi: “Người đàn ông phải làm gì hôm nay?” Anh đã lắp micro và sao chép 50 bộ, nhưng số người có thể tới trong ngày nhiều hơn số đăng ký; quản lý yêu cầu làm thêm cho đủ 60 bộ. Bàn ghế sẽ xếp vào ngày mai, còn diễn giả tự chuẩn bị máy tính.',
  ],
  toan_q_2020_12_78: [
    2,
    'Đáp án 2 — đọc kỹ tài liệu trước. Dịch câu hỏi: “Người phụ nữ cần làm gì trước tiên?” Cô phải thay trưởng nhóm trình bày báo cáo nên cần xem tài liệu anh ấy gửi để phát hiện chỗ khó giải thích hay cần sửa. Nếu thấy vấn đề thì báo qua email trong hôm nay; in 15 bản là việc sau đó.',
  ],
  toan_q_2020_12_79: [
    4,
    'Đáp án đang lưu là 4 — nằm ngửa, giữ hai chân duỗi thẳng và hai tay cạnh thân, rồi nâng chân lên cách sàn 10 cm. Dịch câu hỏi: “Học viên tạo tư thế nào?” Giáo viên nhấn mạnh nằm ngửa chứ không nằm sấp, lưng áp sàn, chân thẳng và tay đặt dọc hai bên. Tuy nhiên bốn lựa chọn chỉ còn hình, nên chưa đối chiếu được tư thế này với số 4 hoặc loại từng hình sai.',
  ],
  toan_q_2020_12_80: [
    3,
    'Đáp án 3 — anh muốn gặp con trai đang học ở trường đại học gần đó. Dịch câu hỏi: “Vì sao người đàn ông không đi bảo tàng?” Chân đau chỉ là vấn đề buổi sáng và anh nói đã hết đau; anh cũng khẳng định không phải vì không thích nghệ thuật. Vé không được hoàn tiền nhưng anh vẫn đồng ý hủy để gặp con.',
  ],
  toan_q_2020_12_81: [
    2,
    'Đáp án 2 — chơi bóng chuyền nhẹ với quả bóng mềm. Dịch câu hỏi: “Tháng sau họ làm gì cùng người cao tuổi?” Hai người chốt phương án bóng chuyền đơn giản. Tập thể dục là hoạt động lần trước; chơi nhạc cụ không được vì phòng đặt trước quá ồn, còn hát bài xưa cũng bị gạt đi.',
  ],
  toan_q_2020_12_82: [
    4,
    'Đáp án 4 — không để khách phải chờ lâu ở quầy tính tiền. Dịch câu hỏi: “Quản lý muốn nhân viên chú ý điều gì từ nay?” Ông khen cửa hàng sạch, giá đúng và chào khách vui vẻ, nhưng nhắc hôm nay hàng người ở quầy thu ngân bị dồn nên cần tăng tốc phục vụ.',
  ],
  toan_q_2020_12_83: [
    4,
    'Đáp án 4 — hai vé người lớn và hai vé trẻ em. Dịch câu hỏi: “Người phụ nữ đặt bao nhiêu vé loại nào?” Ban đầu cô tính một vé người lớn và hai vé trẻ em, rồi thêm một học sinh trung học. Nhân viên giải thích học sinh trung học tính giá người lớn, còn hai bé (một tiểu học, một 4 tuổi) tính giá trẻ em; tổng cộng là 2 vé người lớn và 2 vé trẻ em.',
  ],
  toan_q_2020_12_84: [
    2,
    'Đáp án 2 — lá thư người bạn tiểu học viết từ mười năm trước. Dịch câu hỏi: “Gần đây người phụ nữ nhận được lá thư nào?” Khu vui chơi đã giữ lá thư bạn cô viết cách đây mười năm rồi gửi lại. Đó không phải thư cô tự viết cho tương lai, thiệp mời đám cưới hay thư gắn vào bóng bay.',
  ],
  toan_q_2020_12_85: [
    3,
    'Đáp án 3 — kiểm tra độ chắc của cái cây làm tổ. Dịch câu hỏi: “Vì sao con chim gõ cây?” Nó dùng mỏ cầm cành nhỏ gõ vào cây để nghe âm thanh, qua đó kiểm tra cây có đủ vững để nuôi con hay không. Không phải báo động nguy hiểm, chơi nhạc hay gọi đàn ở xa.',
  ],
  toan_q_2020_12_86: [
    1,
    'Đáp án 1 — sự thay đổi trong mục đích sử dụng phòng karaoke. Dịch câu hỏi: “Người đàn ông nói về điều gì ở các cửa hàng karaoke?” Người dẫn nói nơi này trước kia chủ yếu để hát, nay còn được dùng để tập nhạc, luyện thuyết trình, học bài hoặc ngủ trưa. Trọng tâm là công dụng đang mở rộng, không phải khung giờ đông khách hay một cách quảng cáo mới.',
  ],
  toan_q_2020_12_87: [
    4,
    'Đáp án 4 — hoạt động giúp không lãng phí tài nguyên. Dịch câu hỏi: “Hiệu trưởng đang nói về điều gì?” Hiệu trưởng kể trường biến rác thức ăn thành đất trồng rau, dùng nước mưa tưới cây, tắt đèn khi rời lớp và tái chế giấy. Các ví dụ đều minh họa hoạt động tiết kiệm, tận dụng tài nguyên; bài không chỉ nói về phân loại rác, một quy tắc trong lớp hay thú vui trồng rau.',
  ],
  toan_q_2020_12_88: [
    2,
    'Đáp án 2 — cách phòng tránh chấn thương. Dịch câu hỏi: “Cầu thủ bóng chày chủ yếu nói về điều gì?” Anh kể mình điều chỉnh ăn uống và thêm bài vận động mới mỗi sáng theo lời khuyên chuyên gia để ít bị thương hơn. Ăn uống là một phần trong các biện pháp; bài không chỉ bàn về cơn đau, chế độ ăn hay chi tiết kỹ thuật của bài tập mới.',
  ],
  toan_q_2020_12_89: [
    2,
    'Đáp án 2 — 「佐藤と申します」: “Tôi tên là Sato.” 「申します」 là cách khiêm nhường, lịch sự để tự giới thiệu tên mình. 「佐藤をお呼びします」 nghĩa là tôi sẽ gọi Sato tới; 「佐藤だとおっしゃっています」 nói rằng người khác đang phát biểu điều gì đó về Sato. Khôi phục lựa chọn từ transcript.',
  ],
  toan_q_2020_12_90: [
    2,
    'Đáp án 2 — 「今、戻りました」: “Tôi vừa về tới.” Tình huống là người nói đã đi ra ngoài và nay quay lại công ty. Đáp án 1 báo sắp ra ngoài; đáp án 3 là lời tiễn người khác lên đường. Khôi phục lựa chọn từ transcript.',
  ],
  toan_q_2020_12_91: [
    3,
    'Đáp án 3 — 「甘いものはちょっと苦手なんだ」: “Mình hơi không hợp đồ ngọt.” 「苦手」 diễn đạt không thích hoặc không giỏi một việc theo cách nhẹ nhàng. Đáp án 1 nói không ghét đồ ngọt (ngược ý đã cho); đáp án 2 nói không gì thích hơn đồ ngọt, hoàn toàn trái tình huống. Khôi phục lựa chọn từ transcript.',
  ],
  toan_q_2020_12_92: [
    2,
    'Đáp án 2 — 「これ運ぶからそっち持って」: “Tôi bê cái này, cậu cầm đầu bên kia nhé.” Người nói cần đàn em cùng chuyển máy nên phân chia hai người mỗi người giữ một phía. Đáp án 1 tự nguyện giúp người khác, còn 3 hỏi có cần giúp không; cả hai không giao việc như đề bài yêu cầu. Khôi phục lựa chọn từ transcript.',
  ],
  toan_q_2020_12_93: [
    2,
    'Đáp án 2 — 「明日、運動場が使えないんだ」: “Ngày mai không dùng được sân thể thao.” Học sinh hỏi xác nhận ngày mai có tập bóng đá không; thầy giải thích nguyên nhân là sân không sử dụng được. Đáp án 1 chỉ nhận xét lâu rồi mới chơi; đáp án 3 hứa báo cho mọi người nhưng không trả lời lý do. Khôi phục lựa chọn từ transcript.',
  ],
  toan_q_2020_12_94: [
    3,
    'Đáp án 3 — 「じゃ、応援に行くね」: “Vậy mình sẽ tới cổ vũ nhé.” Người bạn nói đang tính dự thi hùng biện, và phản hồi phù hợp là động viên sẽ tới xem. Đáp án 1 hỏi như thể cuộc thi đã diễn ra; đáp án 2 nói người kia sẽ không thi, trái với câu vừa nghe. Khôi phục lựa chọn từ transcript.',
  ],
  toan_q_2020_12_95: [
    2,
    'Đáp án 2 — 「知りませんでした。すぐ捨てます」: “Tôi không biết. Tôi sẽ vứt ngay.” Nhân viên nhắc thư viện có quy định không nhai kẹo cao su, người nghe xin nhận lỗi và làm theo. Đáp án 1 hỏi tại sao được phép; đáp án 3 hiểu ngược thành kẹo cao su không bị cấm. Khôi phục lựa chọn từ transcript.',
  ],
  toan_q_2020_12_96: [
    3,
    'Đáp án 3 — 「本当、ゆっくりしたいよね」: “Ừ nhỉ, muốn được nghỉ thong thả thật.” Đây là lời đồng cảm với mong muốn có kỳ nghỉ dài hơn. Đáp án 1 nói người kia đã nghỉ mất rồi; đáp án 2 khen kỳ nghỉ dài, ngược với lời than rằng hiện tại chưa đủ dài. Khôi phục lựa chọn từ transcript.',
  ],
  toan_q_2020_12_97: [
    1,
    'Đáp án 1 — 「どうぞ。他にもございますよ」: “Xin cứ lấy, chúng tôi còn bản khác nữa.” Khách xin mang tờ giới thiệu chuyến đi về nhà; nhân viên cho phép và nói còn thêm. Đáp án 2 hiểu nhầm khách không cần tờ rơi; đáp án 3 phủ nhận một điều nhưng không trả lời yêu cầu. Khôi phục lựa chọn từ transcript.',
  ],
  toan_q_2020_12_98: [
    2,
    'Đáp án 2 — 「まだお使いになるんですね」: “Anh vẫn còn dùng máy tính ạ.” Cấp trên dặn để máy bật sau cuộc họp; câu đáp xác nhận hiểu rằng ông còn cần dùng. Đáp án 1 nói sẽ tắt máy, trái yêu cầu; đáp án 3 nói máy đang tắt, không phù hợp. Khôi phục lựa chọn từ transcript.',
  ],
  toan_q_2020_12_99: [
    3,
    'Đáp án 3 — 「じゃ、出かけましょうか」: “Vậy mình đi thôi nhé?” Người kia báo mưa đã tạnh, nên đề nghị ra ngoài là nối tiếp tự nhiên. Đáp án 1 nói mưa đang rơi nhiều; đáp án 2 bảo mở ô, đều trái với thông tin mưa đã ngừng. Khôi phục lựa chọn từ transcript.',
  ],
  toan_q_2020_12_100: [
    1,
    'Đáp án 1 — 「そうだね。もう行っちゃおうか」: “Ừ nhỉ, mình đi luôn thôi.” Ishida chưa tới và hai người nói chờ tiếp cũng vô ích, nên họ quyết định rời đi. Đáp án 2 hỏi có nên chờ thêm; đáp án 3 cho rằng Ishida sắp tới, trái với ý định vừa nêu. Khôi phục lựa chọn từ transcript.',
  ],
  toan_q_2020_12_101: [
    2,
    'Đáp án 2 — 「気をつけて運転するから平気だよ」: “Anh sẽ lái cẩn thận nên không sao đâu.” Đây là lời đáp trấn an khi bị lo việc lái xe đêm một mình nguy hiểm. Đáp án 1 trách người kia bắt mình lái; đáp án 3 chất vấn tại sao họ không lo, không phải lời trấn an. Khôi phục lựa chọn từ transcript.',
  ],
}

const unresolvedVisualIds = ['toan_q_2020_12_76', 'toan_q_2020_12_79']
function extractPrintedOptions(script) {
  const matches = [...String(script ?? '').matchAll(/^\s*([1-4])\.\s*(.+?)\s*$/gm)]
  if (matches.length < 3) return []
  const numbers = matches.map((match) => Number(match[1]))
  if (!numbers.every((number, index) => number === index + 1)) return []
  return matches.map((match) => match[2].replace(/\s*[（(]正解\s*[：:]\s*[1-4][）)]\s*$/, '').trim())
}
const printedAnswers = (script) =>
  [...String(script ?? '').matchAll(/正解\s*[：:]\s*([1-4])/g)].map((match) => Number(match[1]))

const exam = master.find((item) => item.id === 'toan-n3-202012-full')
if (!exam) throw new Error('Expected 2020-12 exam')
const questions = exam.parts.filter((part) => part.title.startsWith('Nghe')).flatMap((part) => part.questions)
if (questions.length !== 28) throw new Error('Expected 28 listening questions; found ' + questions.length)

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
    const options = extractPrintedOptions(question.script)
    if (options.length !== question.options.length)
      throw new Error(id + ': could not recover choice text from transcript')
    question.options = options
    restoredOptionQuestions.push(id)
  }
  if (id === 'toan_q_2020_12_77') question.options[1] = '資料をコピーする'
  curated[id] = explanation
  reviewed.push({
    questionId: id,
    examId: exam.id,
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
if (reviewed.length !== 28) throw new Error('Expected 28 reviewed questions; got ' + reviewed.length)
if (restoredOptionQuestions.length !== 16)
  throw new Error('Expected 16 restored option sets; got ' + restoredOptionQuestions.length)

fs.writeFileSync(masterPath, JSON.stringify(master, null, 2) + '\n')
fs.writeFileSync(curatedPath, JSON.stringify(curated, null, 2) + '\n')
fs.mkdirSync(path.dirname(reportPath), { recursive: true })
fs.writeFileSync(
  reportPath,
  JSON.stringify(
    {
      generatedAt: new Date().toISOString(),
      method:
        'All 28 stored answers were checked against 正解 markers in their attached transcripts and all matched. Vietnamese explanations were written from those transcripts with question translation and distractor reasoning. Text choices for questions 86–88 and 89–101 were recovered from transcript lines; one obvious mixed-script typo in the saved choice for question 77 was corrected to the wording spoken in its transcript. Questions 76 and 79 retain unresolved image-to-answer-number mappings. Original PDF and official JLPT key were not independently checked.',
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
        sourceTextCorrections: 1,
      },
      restoredOptionQuestions,
      limitations: [
        {
          questionIds: unresolvedVisualIds,
          issue:
            'Transcript reveals the intended object/pose, but choices are image-only and their mapping to answer numbers is missing.',
        },
        {
          issue:
            'Transcript answer markers match saved answer keys, but the source PDF and official JLPT answer key were not independently verified.',
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
    sourceTextCorrections: 1,
    keysChanged: 0,
    reportPath,
  })
)
