import fs from 'node:fs'
import path from 'node:path'

const root = process.cwd()
const masterPath = path.join(root, 'data/jlpt_n3_toan_master.json')
const curatedPath = path.join(root, 'data/jlpt_n3_explanations_curated.json')
const exams = JSON.parse(fs.readFileSync(masterPath, 'utf8'))
const curated = JSON.parse(fs.readFileSync(curatedPath, 'utf8'))
const exam = exams.find((item) => item.id === 'toan-n3-201212-full')
if (!exam) throw new Error('Could not find JLPT N3 2012/12 exam')
const questions = exam.parts.flatMap((part) => part.questions)

const revisions = [
  {
    id: 'toan_q_2012_12_49',
    answer: 2,
    options: ['忙しくなり', '今日中に', 'そうですし', 'やってしまい'],
    previous:
      'Đáp án 2: Cụm 「今日中に」 bổ nghĩa cho việc hoàn thành công việc trong ngày hôm nay. Trong câu sắp xếp, đặt mốc thời hạn này trước phần nói việc phải làm xong vì sắp bận.',
    next: `Câu hoàn chỉnh: 「A『片づけはあしたにしますか。』B『あしたは朝から忙しくなりそうですし、今日中にやってしまいましょう。』」
Dịch: “A: Mình dọn dẹp vào ngày mai nhé? — B: Ngày mai có vẻ sẽ bận từ sáng, nên mình làm xong trong hôm nay đi.”
Trật tự là 1 → 3 → 2 → 4; ô ★ ở vị trí thứ ba là lựa chọn 2 「今日中に」. 「忙しくなり」 là phần nối của 「忙しくなる」; 「そうです」 theo sau thân động từ 「なり」 diễn tả dự đoán “có vẻ sẽ trở nên bận”, còn 「し」 nối lý do. 「今日中に」 nêu hạn chót “trong hôm nay”. 「やってしまい」 nối với 「ましょう」 thành 「やってしまいましょう」, lời rủ hoàn tất việc. Bốn mảnh đều thuộc cùng câu; đáp án được chấm là mảnh nằm tại ô ★, không phải ba mảnh còn lại.
Ghi nhớ: 「Vます-stem＋そうだ」 = có vẻ sắp/sẽ V; 「Vてしまう」 nhấn mạnh làm xong; 「今日中に」 = trong hôm nay.`,
  },
  {
    id: 'toan_q_2012_12_50',
    answer: 3,
    options: ['私は本当に', '「おかえり」と言われると', '娘がいる', 'こんなかわいい'],
    previous:
      'Đáp án 3: Trật tự câu tạo thành ý 「娘がいることで、私は本当に…」: chính việc có con gái khiến người mẹ cảm thấy điều tiếp theo. ことで nối một sự việc với kết quả/cảm nhận của người nói.',
    next: `Câu hoàn chỉnh: 「仕事から帰って、娘に笑顔で『おかえり』と言われると、こんなかわいい娘がいる私は本当に幸せだといつも思う。」
Dịch: “Khi đi làm về và được con gái cười tươi nói ‘Mừng bố/mẹ về’, tôi luôn nghĩ mình thật hạnh phúc vì có cô con gái đáng yêu như thế này.”
Trật tự là 2 → 4 → 3 → 1; ô ★ ở vị trí thứ ba là lựa chọn 3 「娘がいる」. 「『おかえり』と言われると」 nêu tình huống “khi được nói câu mừng về”; 「こんなかわいい」 bổ nghĩa cho danh từ 「娘」; 「娘がいる」 hoàn tất mệnh đề “có một cô con gái”; 「私は本当に」 mở chủ đề và mức độ cho vị ngữ 「幸せだと思う」. Vì vậy các mảnh khác đều cần ở vị trí riêng, còn lựa chọn 3 là mảnh đặt đúng vào ô ★.
Ghi nhớ: 「Nに〜と言われる」 nêu người nói trong câu bị động; 「こんな＋い形容詞＋N」 = N đáng yêu/đẹp như thế này.`,
  },
  {
    id: 'toan_q_2012_12_53',
    answer: 4,
    options: ['三人', '割引券一枚で', '二割引', 'まで'],
    previous:
      'Đáp án 4: 「三人まで」 nghĩa là tối đa ba người. Cụm giới hạn số người kết hợp với phiếu giảm giá và mức giảm 20% được nêu trong câu.\n\nMẫu ngữ pháp được nhận diện từ dữ liệu N3 cục bộ (khớp trực tiếp với lựa chọn):\n4. 「〜まで」: Tới cả / Đến mức cả；Cấu trúc: N + まで',
    next: `Câu hoàn chỉnh: 「その割引券一枚で三人まで二割引になるんだ。」
Dịch: “Chỉ với một phiếu giảm giá đó, tối đa ba người sẽ được giảm 20%.”
Trật tự là 2 → 1 → 4 → 3; ô ★ ở vị trí thứ ba là lựa chọn 4 「まで」. 「割引券一枚で」 nêu phương tiện/điều kiện “với một phiếu”; 「三人まで」 dùng 「まで」 đặt giới hạn tối đa là ba người; 「二割引になる」 nói kết quả giảm 20%. Các mảnh còn lại hoàn chỉnh những vị trí trước và sau ô sao, không thể thay cho chức năng giới hạn của 「まで」.
Ghi nhớ: 「Nまで」 = tối đa/cho tới N; 「二割引」 = giảm 20%.`,
  },
]

for (const revision of revisions) {
  const question = questions.find((item) => item.id === revision.id)
  if (!question) throw new Error(`Missing question ${revision.id}`)
  if (question.correctAnswer !== revision.answer) {
    throw new Error(`Answer key changed for ${revision.id}; expected ${revision.answer}`)
  }
  const optionTexts = question.options.map((option) => option.replace(/^\s*[1-4１-４][.．、\s　]*/u, '').trim())
  if (JSON.stringify(optionTexts) !== JSON.stringify(revision.options)) {
    throw new Error(`Option source changed for ${revision.id}`)
  }
  if (curated[revision.id] !== revision.previous) {
    throw new Error(`Existing explanation changed for ${revision.id}; review before applying`)
  }
}

for (const revision of revisions) curated[revision.id] = revision.next
fs.writeFileSync(curatedPath, `${JSON.stringify(curated, null, 2)}\n`, 'utf8')
console.log(`Updated ${revisions.length} explanations; answer keys unchanged.`)
