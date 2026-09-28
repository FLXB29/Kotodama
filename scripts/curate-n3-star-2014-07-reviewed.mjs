import fs from 'node:fs'
import path from 'node:path'

const root = path.resolve('.')
const masterPath = path.join(root, 'data/jlpt_n3_toan_master.json')
const curatedPath = path.join(root, 'data/jlpt_n3_explanations_curated.json')
const reviewPath = path.join(root, 'reports/n3-quality-audit/star-source-2014-07-review.json')
const exams = JSON.parse(fs.readFileSync(masterPath, 'utf8'))
const curated = JSON.parse(fs.readFileSync(curatedPath, 'utf8'))
const review = JSON.parse(fs.readFileSync(reviewPath, 'utf8'))

const explanations = {
  toan_q_2014_07_49: `Câu hoàn chỉnh: 「娘が歌手になることには反対でしたが、娘も一生懸命がんばろうとしているので応援してやろうかと思っています。」 Dịch: “Dù trước đó tôi phản đối việc con gái trở thành ca sĩ, nhưng thấy con cũng đang cố gắng hết sức nên tôi nghĩ mình sẽ thử ủng hộ con.” Thứ tự là 1→4→2→3; ô ★ thứ ba nhận lựa chọn 2 「応援して」. Mảnh 1 「がんばろうとして」 phải tiếp sau 一生懸命; mảnh 4 「いるので」 hoàn tất 「がんばろうとしているので」; mảnh 3 「やろうか」 phải theo sau 「応援して」 và đứng trước 「と思っています」. Vì vậy chỉ lựa chọn 2 vừa nối được phần trước vừa mở cụm 「応援してやろうか」.`,
  toan_q_2014_07_50: `Câu hoàn chỉnh: 「ここにある家具は今はどれも使っていないけれどもいつかまた使うかもしれないと思うと、捨てられない。」 Dịch: “Những món đồ nội thất ở đây hiện giờ món nào tôi cũng không dùng, nhưng nghĩ rằng có thể một ngày nào đó sẽ dùng lại nên tôi không nỡ vứt đi.” Thứ tự là 4→3→1→2; ô ★ thứ ba nhận lựa chọn 1 「けれども」. 「今はどれも使っていない」 là mệnh đề phủ định hiện tại; 「けれども」 nối ý tương phản với khả năng sẽ dùng lại 「いつかまた使うかもしれない」. Lựa chọn 4 phải đứng trước lựa chọn 3, lựa chọn 3 kết thúc bằng ない để nối với けれども, còn lựa chọn 2 phải đứng ngay trước 「使う」; ba mảnh đó không thể thay vào ô ★.`,
  toan_q_2014_07_51: `Câu hoàn chỉnh: 「書いたまま出すのを忘れていた友人への手紙が引き出しにあった。」 Dịch: “Trong ngăn kéo có lá thư gửi bạn mà tôi đã viết nhưng quên đem gửi.” Thứ tự là 1→3→2→4; ô ★ thứ ba nhận lựa chọn 2 「忘れていた」. 「書いたまま」 nói trạng thái lá thư vẫn để nguyên sau khi viết; 「出すのを忘れていた」 là quên đem gửi; 「友人への」 đứng ngay trước danh từ 「手紙」. Do đó 「忘れていた」 cần đứng sau 「出すのを」 và trước 「友人への手紙」; các lựa chọn 1, 3, 4 lần lượt có vị trí cú pháp cố định.`,
  toan_q_2014_07_52: `Câu hoàn chỉnh: 「A「空が暗いですね。」B「そうですね。雨がいつ降ってもおかしくないですね。」」 Dịch: “A: ‘Trời tối quá nhỉ.’ B: ‘Ừ nhỉ. Có thể mưa bất cứ lúc nào ấy.’” Thứ tự là 2→4→3→1; ô ★ thứ ba nhận lựa chọn 3 「おかしく」. Cụm 「いつ降ってもおかしくない」 nghĩa là “mưa bất cứ lúc nào cũng không có gì lạ”. 「いつ」 phải đứng trước 「降っても」; 「おかしく」 đi ngay trước phủ định 「ない」. Vì vậy chỉ lựa chọn 3 vừa nhận vế điều kiện phía trước vừa nối tự nhiên với 「ない」 phía sau.`,
  toan_q_2014_07_53: `Câu hoàn chỉnh theo thứ tự ghép: 「（電話で）A「もしもし、ちょっと話したいことがあるんだけど、今、時間ある？」B「ごめん。ちょうど出かけるところで時間がないから、あとでゆっくり話す。私から電話するね。」」 Dịch: “A: ‘A lô, mình có chuyện muốn nói, bây giờ bạn có thời gian không?’ B: ‘Xin lỗi nhé. Mình đang đúng lúc chuẩn bị ra ngoài nên không có thời gian; lát nữa mình sẽ nói chuyện kỹ. Mình sẽ gọi lại cho bạn.’” Thứ tự câu tự nhiên là 3→4→2→1, nên ô ★ thứ ba nhận lựa chọn 2 「あとで」: 「ところで」 nối với 「ちょうど出かける」 để nói vừa đúng lúc sắp đi; 「時間がないから」 nêu lý do; 「あとでゆっくり話す」 nói sẽ nói chuyện kỹ sau. Các lựa chọn 1, 3, 4 không thể đứng ở ô thứ ba mà vẫn tạo thành câu tự nhiên. Lưu ý kiểm định: PDF đề và thứ tự ngữ pháp dẫn đến lựa chọn 2, nhưng PDF đáp án riêng ghi lựa chọn 4. Hai nguồn đang mâu thuẫn, nên đáp án câu này chưa được coi là xác minh hoàn toàn.`,
}

const exam = exams.find((item) => item.id === 'toan-n3-201407-full')
if (!exam) throw new Error('Missing JLPT N3 July 2014 exam')
const questions = new Map(exam.parts.flatMap((part) => part.questions).map((item) => [item.id, item]))
const questionSource = review.source.questionSourceUrl
const answerSource = review.source.answerKeySource

for (const entry of review.questions) {
  const question = questions.get(entry.questionId)
  if (!question) throw new Error(`Missing question ${entry.questionId}`)
  const sources = [questionSource, answerSource]
  question.starVerificationSources = [...new Set([...(question.starVerificationSources || []), ...sources])]
  question.starVerificationStatus = entry.status
  question.starAnswerKeyConflict =
    entry.status === 'disputed'
      ? `PDF đáp án ghi lựa chọn ${entry.answerFromAnswerKey}, nhưng câu ghép tự nhiên đặt lựa chọn ${entry.answerFromSentence} vào ô ★.`
      : null
  if (explanations[entry.questionId]) {
    question.explanation = explanations[entry.questionId]
    curated[entry.questionId] = explanations[entry.questionId]
  }
}

fs.writeFileSync(curatedPath, `${JSON.stringify(curated, null, 2)}\n`, 'utf8')
fs.writeFileSync(masterPath, `${JSON.stringify(exams, null, 2)}\n`, 'utf8')
console.log(
  `Curated complete star-order explanations and recorded source status for ${review.questions.length} 07/2014 questions.`
)
