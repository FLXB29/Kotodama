import fs from 'node:fs'
import path from 'node:path'

const masterPath = path.resolve('data/jlpt_n3_toan_master.json')
const curatedPath = path.resolve('data/jlpt_n3_explanations_curated.json')
const exams = JSON.parse(fs.readFileSync(masterPath, 'utf8'))
const curated = JSON.parse(fs.readFileSync(curatedPath, 'utf8'))
const exam = exams.find((item) => item.id === 'toan-n3-202507-full')
if (!exam) throw new Error('Could not find JLPT N3 2025/07 exam')
const questions = exam.parts.flatMap((part) => part.questions)

const explanations = {
  toan_q_2025_07_49:
    'Câu hoàn chỉnh: 「今年の夏も暑いが、異常な暑さだった去年の夏に比べると、ずっと涼しく感じる。」\n' +
    'Dịch: “Mùa hè năm nay cũng nóng, nhưng so với mùa hè năm ngoái nóng bất thường thì tôi cảm thấy mát hơn hẳn.”\n' +
    'Thứ tự là 1 → 3 → 4 → 2; ô ★ là 「去年の夏に」, lựa chọn 4. 「異常な暑さだった」 bổ nghĩa cho 「去年の夏」; 「に比べると」 nghĩa là “so với”; mệnh đề sau nêu cảm nhận của người nói. 「異常な」 phải đứng trước danh từ được mô tả, còn 「暑さだった」 hoàn tất cụm miêu tả mùa hè năm ngoái.',
  toan_q_2025_07_50:
    'Câu hoàn chỉnh: 「初めてアルバイトをして、お金を稼ぐことがどれだけ大変なことかわかった。」\n' +
    'Dịch: “Lần đầu đi làm thêm, tôi mới hiểu kiếm tiền vất vả đến mức nào.”\n' +
    'Thứ tự là 3 → 4 → 2 → 1; ô ★ là 「大変な」, lựa chọn 2. 「ことが」 danh từ hóa việc kiếm tiền và làm chủ ngữ; 「どれだけ」 mở cụm hỏi gián tiếp “đến mức nào”; 「大変な」 bổ nghĩa cho 「こと」; 「ことか」 khép cụm cảm thán gián tiếp trước 「わかった」. Hai mảnh 「ことが」 và 「ことか」 có vai trò khác nhau nên không đổi chỗ cho nhau.',
  toan_q_2025_07_51:
    'Câu hoàn chỉnh: 「今日、昼食の後、図書館へ行って本を読んでいたら、いつのまにか外が暗くなっていたので驚いた。」\n' +
    'Dịch: “Hôm nay sau bữa trưa, tôi đến thư viện đọc sách; chẳng biết từ lúc nào bên ngoài đã tối nên tôi ngạc nhiên.”\n' +
    'Thứ tự là 4 → 2 → 1 → 3; ô ★ là 「ので」, lựa chọn 1. 「いつのまにか」 diễn tả việc người nói chỉ nhận ra sau đó; 「外が暗くなっていた」 nêu trạng thái đã thay đổi; 「ので」 nối nguyên nhân với phản ứng; 「驚いた」 là kết quả. Vì vậy 「ので」 phải đứng giữa sự việc và phản ứng.',
  toan_q_2025_07_52:
    'Câu hoàn chỉnh: 「このチーズケーキの作り方は材料を混ぜて冷やすだけだから、誰でも簡単に作れると思う。」\n' +
    'Dịch: “Tôi nghĩ ai cũng có thể làm chiếc bánh phô mai này dễ dàng, vì cách làm chỉ cần trộn nguyên liệu rồi để lạnh.”\n' +
    'Thứ tự là 2 → 4 → 3 → 1; ô ★ là 「だけ」, lựa chọn 3. 「作り方は」 đưa cách làm thành chủ đề; 「材料を混ぜて冷やす」 nêu các bước; 「だけ」 giới hạn cách làm ở đúng những bước đó; 「だから」 đưa ra lý do cho nhận xét “ai cũng có thể làm dễ dàng”. PDF gốc có đủ bốn mảnh này, nên lời giải cũ nói đề thiếu thành phần không đúng và đã được thay thế.',
  toan_q_2025_07_53:
    'Câu hoàn chỉnh: 「もし雨が降ったとしても、試合は中止にならないんだけど、雨が降ったら応援には無理して来なくてもいいよ。」\n' +
    'Dịch: “Dù trời có mưa thì trận đấu cũng không bị hủy, nhưng nếu mưa thì bạn không cần cố đến cổ vũ đâu.”\n' +
    'Thứ tự là 3 → 2 → 4 → 1; ô ★ là 「中止にならないんだけど」, lựa chọn 4. 「もし～としても」 mở điều kiện nhượng bộ; 「試合は」 nêu chủ đề; 「中止にならない」 nói trận đấu không bị hủy; 「んだけど」 nối sang lời giải thích tiếp theo, nơi 「雨が降ったら」 là điều kiện để người bạn không phải cố đến.',
}

for (const [id, explanation] of Object.entries(explanations)) {
  const question = questions.find((item) => item.id === id)
  if (!question) throw new Error(`Missing question ${id}`)
  if (
    question.starVerificationStatus !== 'verified-against-source' ||
    !question.starVerificationSources?.some((source) => source.includes('#page=8'))
  ) {
    throw new Error(`Question ${id} must be checked against the PDF before its explanation is curated`)
  }
  curated[id] = explanation
}

fs.writeFileSync(curatedPath, `${JSON.stringify(curated, null, 2)}\n`, 'utf8')
console.log('Updated Vietnamese translations and fragment-by-fragment explanations for five July 2025 questions.')
