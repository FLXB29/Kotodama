import fs from 'node:fs'
import path from 'node:path'

const masterPath = path.resolve('data/jlpt_n3_toan_master.json')
const curatedPath = path.resolve('data/jlpt_n3_explanations_curated.json')
const exams = JSON.parse(fs.readFileSync(masterPath, 'utf8'))
const curated = JSON.parse(fs.readFileSync(curatedPath, 'utf8'))
const exam = exams.find((item) => item.id === 'toan-n3-202512-full')
if (!exam) throw new Error('Could not find JLPT N3 2025/12 exam')
const questions = exam.parts.flatMap((part) => part.questions)

const explanations = {
  toan_q_2025_12_49:
    'Câu hoàn chỉnh: 「昨日、本屋で小説2冊とレポートの書き方についての本を1冊買った。」\n' +
    'Dịch: “Hôm qua, tôi mua hai cuốn tiểu thuyết và một cuốn sách về cách viết báo cáo ở hiệu sách.”\n' +
    'Thứ tự là 1 → 4 → 3 → 2; ô ★ là 「について」, lựa chọn 3. 「と」 nối hai nhóm đồ được mua; 「レポートの書き方」 là “cách viết báo cáo”; 「について」 nghĩa là “về”; 「の」 nối cụm 「レポートの書き方について」 với danh từ 「本」. Vì vậy cụm sau phải là 「レポートの書き方についての本」.',
  toan_q_2025_12_50:
    'Câu hoàn chỉnh: 「あの喫茶店、テレビか何かで見たことがあるよ。入ってみない？」\n' +
    'Dịch: “Tôi hình như đã thấy quán cà phê đó trên TV hay chương trình nào đó rồi. Mình vào thử nhé?”\n' +
    'Thứ tự là 3 → 2 → 1 → 4; ô ★ là 「で」, lựa chọn 1. 「テレビ」 là nguồn thông tin; 「か何か」 có nghĩa “hay thứ gì đó”; trợ từ 「で」 đánh dấu phương tiện/nguồn nơi người nói nhìn thấy; 「見たことがある」 diễn tả trải nghiệm “đã từng thấy”.',
  toan_q_2025_12_52:
    'Câu hoàn chỉnh: 「会社から遠いのに北町を選んだのは、ずっと北町に住んでみたかったからだ。」\n' +
    'Dịch: “Dù xa công ty, tôi chọn Kitamachi vì đã luôn muốn thử sống ở đó.”\n' +
    'Thứ tự là 4 → 1 → 2 → 3; ô ★ là 「のは」, lựa chọn 2. 「のに」 nối tính từ 「遠い」 với ý trái ngược; 「北町を選んだ」 nêu quyết định; 「のは」 danh từ hóa quyết định ấy để đưa ra điều cần giải thích; 「ずっと北町に住んでみたかった」 là lý do, được kết lại bằng 「からだ」.',
  toan_q_2025_12_53:
    'Câu hoàn chỉnh: 「かびを防ぐためには、使った後ぬれたままにしないことが重要らしい。」\n' +
    'Dịch: “Để ngăn nấm mốc, có vẻ điều quan trọng là sau khi dùng không để đồ vật ướt nguyên như vậy.”\n' +
    'Thứ tự là 4 → 2 → 3 → 1; ô ★ là 「ぬれたままにしない」, lựa chọn 3. 「ためには」 nêu mục đích “để”; 「使った後」 là “sau khi dùng”; 「ぬれたままにしない」 nghĩa là không để nguyên trạng thái ướt; 「ことが重要」 biến hành động thành điều được đánh giá là quan trọng.',
}

for (const [id, explanation] of Object.entries(explanations)) {
  const question = questions.find((item) => item.id === id)
  if (!question) throw new Error(`Missing question ${id}`)
  if (
    question.starVerificationStatus !== 'verified-against-source' ||
    !question.starVerificationSources?.some((source) => source.includes('#page=9'))
  ) {
    throw new Error(`Question ${id} must be checked against the PDF before its explanation is curated`)
  }
  curated[id] = explanation
}

fs.writeFileSync(curatedPath, `${JSON.stringify(curated, null, 2)}\n`, 'utf8')
console.log('Updated Vietnamese translations and fragment-by-fragment explanations for four source-verified items.')
