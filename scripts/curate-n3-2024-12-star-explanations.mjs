import fs from 'node:fs'
import path from 'node:path'

const masterPath = path.resolve('data/jlpt_n3_toan_master.json')
const curatedPath = path.resolve('data/jlpt_n3_explanations_curated.json')
const exams = JSON.parse(fs.readFileSync(masterPath, 'utf8'))
const curated = JSON.parse(fs.readFileSync(curatedPath, 'utf8'))
const exam = exams.find((item) => item.id === 'toan-n3-202412-full')
if (!exam) throw new Error('Could not find JLPT N3 2024/12 exam')
const questions = exam.parts.flatMap((part) => part.questions)

const explanations = {
  toan_q_2024_12_49:
    'Câu hoàn chỉnh: 「山川大学では、新入生が大学生活に対して持っているイメージについて、毎年4月にアンケート調査を行っている。」\n' +
    'Dịch: “Ở Đại học Yamakawa, hằng năm vào tháng 4, trường khảo sát hình dung của tân sinh viên về đời sống đại học.”\n' +
    'Thứ tự là 1 → 3 → 2 → 4. Ô ★ nằm ở mảnh thứ ba, 「持っている」, nên chọn 2. 「大学生活」 nêu chủ đề; 「に対して」 chỉ đối tượng mà hình dung hướng tới; 「持っている」 bổ nghĩa cho danh từ 「イメージ」; 「イメージ」 nối với 「について」 để nêu nội dung khảo sát. Đặt 「イメージ」 trước 「持っている」 sẽ làm sai cụm danh từ; 「に対して」 không thể đứng sau động từ ở đây.',
  toan_q_2024_12_50:
    'Câu hoàn chỉnh: 「来週の夫の誕生日には、最近欲しがっているかばんをプレゼントするつもりだ。」\n' +
    'Dịch: “Đến sinh nhật chồng tuần tới, tôi định tặng chiếc túi mà gần đây anh ấy đang muốn có.”\n' +
    'Thứ tự là 1 → 4 → 3 → 2. Ô ★ nằm ở 「かばんを」, đáp án 3. 「最近」 bổ nghĩa thời gian cho 「欲しがっている」; mẫu 「欲しがる」 diễn tả mong muốn của người khác và bổ nghĩa cho 「かばん」; 「かばんを」 là tân ngữ của 「プレゼントする」; động từ 「プレゼントする」 đứng trước 「つもりだ」 để nói dự định. Nếu đưa 「プレゼントする」 lên trước thì cụm 「最近欲しがっている」 không còn bổ nghĩa cho món quà.',
  toan_q_2024_12_51:
    'Câu hoàn chỉnh: 「私は、健康のために毎日8時間以上寝るようにしている。」\n' +
    'Dịch: “Vì sức khỏe, tôi cố gắng ngủ ít nhất 8 tiếng mỗi ngày.”\n' +
    'Thứ tự là 2 → 3 → 4 → 1. Ô ★ là 「ように」, đáp án 4. 「ために」 nêu mục đích/lý do “vì sức khỏe”; 「毎日8時間以上寝る」 là hành động; 「ようにしている」 diễn tả việc đang cố duy trì thành thói quen. 「している」 phải ở cuối mẫu này, còn 「ように」 phải đứng ngay trước nó; đặt 「毎日8時間以上寝る」 sau 「ように」 sẽ làm hỏng cấu trúc.',
  toan_q_2024_12_52:
    'Câu hoàn chỉnh: 「部長が東京へ出張に行くたびに買ってきてくれるお土産のクッキーがとてもおいしいので、私も東京に行くことがあったら、買おうと思う。」\n' +
    'Dịch: “Bánh quy làm quà mà trưởng phòng mua mang về cho tôi mỗi lần đi công tác Tokyo rất ngon, nên nếu có dịp đến Tokyo, tôi cũng định mua thử.”\n' +
    'Thứ tự là 4 → 1 → 2 → 3. Ô ★ là 「買ってきてくれる」, đáp án 2. 「東京へ出張に行く」 nêu sự việc lặp lại; 「たびに」 nghĩa là “mỗi lần” và phải theo sau sự việc đó; 「買ってきてくれる」 nói trưởng phòng mua rồi mang về cho người nói; 「お土産の」 nối cụm này với danh từ 「クッキー」. Đặt 「お土産の」 trước động từ mang quà về sẽ làm sai quan hệ bổ nghĩa, còn 「たびに」 không thể đứng trước hành động mà nó đánh dấu.',
  toan_q_2024_12_53:
    'Câu hoàn chỉnh: 「私はこの図書館が好きだ。広くて本の数が多いだけではなく、大きな窓から海が見えて、景色を楽しみながら読書ができるのもいい。」\n' +
    'Dịch: “Tôi thích thư viện này. Nơi đây rộng và có nhiều sách; hơn nữa, từ cửa sổ lớn còn nhìn thấy biển, và thật tuyệt khi có thể vừa ngắm cảnh vừa đọc sách.”\n' +
    'Thứ tự là 3 → 2 → 1 → 4. Ô ★ là 「景色を楽しみながら」, đáp án 1. 「だけではなく」 theo sau ý “rộng và có nhiều sách” để mở thêm một ưu điểm; 「大きな窓から海が見えて」 nêu cảnh biển nhìn từ cửa sổ; 「景色を楽しみながら」 bổ nghĩa cho việc đọc; 「読書ができるのも」 kết thúc nội dung trước 「いい」. Vì vậy 「だけではなく」 thuộc mảnh đầu, 「大きな窓から海が見えて」 đứng thứ hai, còn 「読書ができるのも」 phải ở cuối. Bản gốc dùng 「だけではなく」; lựa chọn đã được sửa cho khớp đề.',
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
console.log(`Updated translations and fragment explanations for ${Object.keys(explanations).length} questions.`)
