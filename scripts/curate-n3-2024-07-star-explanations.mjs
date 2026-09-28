import fs from 'node:fs'
import path from 'node:path'

const masterPath = path.resolve('data/jlpt_n3_toan_master.json')
const curatedPath = path.resolve('data/jlpt_n3_explanations_curated.json')
const exams = JSON.parse(fs.readFileSync(masterPath, 'utf8'))
const curated = JSON.parse(fs.readFileSync(curatedPath, 'utf8'))
const exam = exams.find((item) => item.id === 'toan-n3-202407-full')
if (!exam) throw new Error('Could not find JLPT N3 2024/07 exam')
const questions = exam.parts.flatMap((part) => part.questions)

const explanations = {
  toan_q_2024_07_49:
    'Câu hoàn chỉnh: 「朝、近所のパン屋の前を通ると、パンの焼けるいいにおいがする。」\n' +
    'Dịch: “Buổi sáng, khi đi ngang tiệm bánh gần nhà, tôi ngửi thấy mùi bánh đang nướng rất thơm.”\n' +
    'Thứ tự là 3 → 2 → 4 → 1. Ô ★ nằm ở mảnh thứ ba, 「いいにおい」, nên chọn 4. 「パンの焼ける」 bổ nghĩa cho 「いいにおい」; 「いいにおいがする」 là cách nói “có mùi thơm”. 「の」 phải nối 「パン」 với cụm bổ nghĩa, 「焼ける」 đứng sau 「の」, còn 「が」 theo sau danh từ để làm chủ ngữ của 「する」.',
  toan_q_2024_07_50:
    'Câu hoàn chỉnh: 「平日はなかなか運動する時間がないので、日常生活の中で、エレベーターではなくて階段を使うとか歩くスピードを速くするとかしている。」\n' +
    'Dịch: “Ngày thường tôi khó có thời gian vận động, nên trong sinh hoạt hằng ngày tôi làm những việc như dùng cầu thang thay vì thang máy hoặc đi bộ nhanh hơn.”\n' +
    'Thứ tự là 3 → 1 → 2 → 4. Ô ★ là 「歩く」, đáp án 2. 「使う」 nêu ví dụ thứ nhất; 「とか」 nối các ví dụ; 「歩く」 bổ nghĩa cho 「スピード」; 「スピードを速くする」 nêu ví dụ thứ hai trước mẫu kết 「とかしている」. Đặt 「歩く」 sau 「スピードを速くする」 sẽ đảo trật tự cụm danh từ; 「とか」 phải đứng sau ví dụ đầu tiên.',
  toan_q_2024_07_51:
    'Câu hoàn chỉnh: 「始めたばかりなので覚えなければいけないことが多くて大変ですが、楽しいです。」\n' +
    'Dịch: “Vì vừa mới bắt đầu nên có nhiều điều phải học, khá vất vả nhưng vui.”\n' +
    'Thứ tự là 4 → 2 → 3 → 1. Ô ★ là 「ことが」, đáp án 3. 「始めたばかりなので」 nêu nguyên nhân “vì vừa mới bắt đầu”; 「覚えなければいけない」 bổ nghĩa cho danh từ 「こと」; 「ことが多くて」 nghĩa là “có nhiều điều”; 「多くて」 nối với tính từ 「大変」. 「ことが」 phải đứng sau cụm động từ bổ nghĩa và trước 「多くて」.',
  toan_q_2024_07_52:
    'Câu hoàn chỉnh: 「初めて登山をしたとき、山の上からの景色を見て、『なんてきれいな眺めなんだろう』と感動した。」\n' +
    'Dịch: “Lần đầu leo núi, nhìn phong cảnh từ trên đỉnh, tôi xúc động thốt lên: ‘Phong cảnh đẹp biết bao!’”\n' +
    'Thứ tự là 2 → 1 → 4 → 3. Ô ★ là 「眺め」, đáp án 4. 「なんて」 mở đầu câu cảm thán; 「きれいな」 bổ nghĩa cho danh từ 「眺め」; 「なんだろう」 khép lại lời cảm thán “đẹp biết bao”. Nếu đặt 「眺め」 trước 「きれいな」 thì cụm danh từ bị đảo sai; 「なんだろう」 phải ở cuối câu trích dẫn.',
  toan_q_2024_07_53:
    'Câu hoàn chỉnh: 「営業課の山下さん、来月受付の林さんと結婚するんだって。」\n' +
    'Dịch: “Này, nghe nói anh Yamashita ở phòng kinh doanh tháng sau sẽ kết hôn với cô Hayashi ở quầy lễ tân.”\n' +
    'Thứ tự là 4 → 3 → 1 → 2. Ô ★ là 「結婚するんだ」, đáp án 1. 「受付の林さん」 xác định người được nhắc đến; 「と」 đánh dấu người kết hôn cùng; 「結婚するんだ」 nêu nội dung sự việc; 「って」 ở cuối câu là cách nói thân mật để truyền đạt tin nghe được. 「と」 không thể đứng sau động từ ở cấu trúc này, còn 「って」 cần nằm cuối phần dẫn tin.',
}

for (const [id, explanation] of Object.entries(explanations)) {
  const question = questions.find((item) => item.id === id)
  if (!question) throw new Error(`Missing question ${id}`)
  if (!question.starOrderVerified || !question.starPositionVerified || !question.starVerificationSources?.length) {
    throw new Error(`Question ${id} must be checked against the PDF before its explanation is curated`)
  }
  curated[id] = explanation
}

fs.writeFileSync(curatedPath, `${JSON.stringify(curated, null, 2)}\n`, 'utf8')
console.log(`Updated translations and fragment explanations for five July 2024 questions.`)
