import fs from 'node:fs'
import path from 'node:path'

const filePath = path.resolve('data/jlpt_n3_explanations_curated.json')
const explanations = JSON.parse(fs.readFileSync(filePath, 'utf8'))
const questionId = 'toan_q_2025_12_51'

explanations[questionId] = `Đáp án trong khóa tham khảo hiện lưu là 4 「弾けるように」.
Câu hoàn chỉnh: 「半年前にギターを習い始めてから、毎日練習している。弾けば弾くほど上手に弾けるようになっていくのが自分でもわかり、とても楽しい。」
Dịch: “Tôi bắt đầu học guitar nửa năm trước và ngày nào cũng luyện tập. Tôi tự nhận ra càng chơi nhiều thì mình càng chơi được tốt hơn, điều đó thật thú vị.”
Thứ tự bốn mảnh là 2 → 1 → 4 → 3. Dấu ★ ở vị trí thứ ba nên nhận lựa chọn 4 「弾けるように」.
1. 「上手に」: “một cách giỏi/thành thạo”; đứng trước 「弾けるように」 để bổ nghĩa cho cách chơi, nên là mảnh thứ hai chứ không ở ô ★.
2. 「弾くほど」: theo sau 「弾けば」 để tạo mẫu 「VばVるほど」, “càng chơi thì càng…”; là mảnh đầu tiên trong bốn mảnh.
3. 「なっていくのが」: hoàn tất 「弾けるようになっていく」, nói về việc dần chơi được; là mảnh cuối cùng trước 「自分でもわかり」.
4. 「弾けるように」: “để có thể chơi”; nối 「上手に」 với 「なっていく」 thành 「上手に弾けるようになっていく」 và nằm đúng ô ★.
Ghi nhớ: 「～ば～ほど」 diễn tả mức độ tăng dần, “càng… thì càng…”.
Lưu ý nguồn: PDF đề gốc trang 9 được ghi nhận là in lựa chọn 2 「弾くけど」, trong khi khóa tham khảo và câu ghép tự nhiên dùng 「弾くほど」. Phần giải thích này theo mảnh và khóa hiện lưu; xung đột với bản in chưa có khóa JLPT chính thức để phân xử.`

fs.writeFileSync(filePath, `${JSON.stringify(explanations, null, 2)}\n`, 'utf8')
console.log(`Updated curated explanation for ${questionId}`)
