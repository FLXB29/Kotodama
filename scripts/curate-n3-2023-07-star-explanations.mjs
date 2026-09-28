import fs from 'node:fs'
import path from 'node:path'

const masterPath = path.resolve('data/jlpt_n3_toan_master.json')
const sectionMasterPath = path.resolve('data/jlpt_full_master.json')
const curatedPath = path.resolve('data/jlpt_n3_explanations_curated.json')
const exams = JSON.parse(fs.readFileSync(masterPath, 'utf8'))
const sectionExams = JSON.parse(fs.readFileSync(sectionMasterPath, 'utf8'))
const curated = JSON.parse(fs.readFileSync(curatedPath, 'utf8'))
const exam = exams.find((item) => item.id === 'toan-n3-202307-full')
if (!exam) throw new Error('Could not find JLPT N3 2023/07 exam')
const questions = exam.parts.flatMap((part) => part.questions)
const sectionExam = sectionExams.find((item) => item.id === 'cm2u2y1xl01d2134ilubjx79d-grammar-reading')
if (!sectionExam) throw new Error('Could not find the July 2023 grammar-reading section exam')
const sectionQuestions = sectionExam.parts.flatMap((part) => part.questions)
const normalizeOption = (value) => String(value || '').replace(/^\s*[1-4１-４][.．、\s　]*/u, '').replace(/\s+/g, '').trim()

const explanations = {
  toan_q_2023_07_49:
    'Câu hoàn chỉnh: 「パソコンや携帯電話の見すぎによる目の疲れが原因で、頭が痛くなることもあるそうだ。」\n' +
    'Dịch: “Nghe nói đôi khi bị đau đầu do mỏi mắt vì nhìn máy tính hoặc điện thoại quá nhiều.”\n' +
    'Thứ tự là 3 → 2 → 4 → 1; ô ★ thứ hai là 「による」, lựa chọn 2. 「見すぎ」 là danh từ hóa hành động nhìn quá nhiều; 「見すぎによる」 bổ nghĩa cho 「目の疲れ」 và nêu nguyên nhân. 「目の疲れが原因で」 tiếp tục nêu mỏi mắt là nguyên nhân của đau đầu. Vì vậy 「が」 phải theo sau cụm danh từ, còn 「原因で」 khép mệnh đề nguyên nhân.',
  toan_q_2023_07_50:
    'Câu hoàn chỉnh: 「私は子供のとき、ピアノを習っていたが、3年でやめてしまった。何回練習してもなかなか上手に弾けない曲があって、嫌になってしまったのだ。」\n' +
    'Dịch: “Hồi nhỏ tôi từng học piano nhưng đã dừng sau ba năm. Có một bản nhạc mà dù luyện tập bao nhiêu lần tôi vẫn không chơi khá được, nên tôi chán nản.”\n' +
    'Thứ tự là 2 → 3 → 1 → 4; ô ★ thứ hai là 「なかなか」, lựa chọn 3. 「何回練習しても」 nghĩa là “dù luyện tập bao nhiêu lần”; 「なかなか」 đi với phủ định 「弾けない」 để diễn tả khó đạt được kết quả; 「上手に弾けない」 bổ nghĩa cho 「曲」; 「曲があって」 nối sang kết quả 「嫌になってしまった」. Một bảng đáp án tổng hợp ghi lựa chọn 1, nhưng PDF gốc đặt ★ ở mảnh thứ hai của thứ tự này; câu hoàn chỉnh và dấu ★ đều chỉ lựa chọn 3.',
  toan_q_2023_07_51:
    'Câu hoàn chỉnh: 「失敗をすることは誰にでもある。大切なのは、どうして失敗をしてしまったのか考えて、同じ失敗を繰り返さないようにすることだ。」\n' +
    'Dịch: “Ai cũng có lúc mắc lỗi. Điều quan trọng là suy nghĩ vì sao mình đã mắc lỗi để không lặp lại lỗi đó.”\n' +
    'Thứ tự là 4 → 2 → 1 → 3; ô ★ thứ ba là 「失敗をしてしまった」, lựa chọn 1. 「大切なのは」 nêu điều quan trọng; 「どうして～のか」 tạo câu hỏi gián tiếp “vì sao”; 「失敗をしてしまった」 là nội dung của câu hỏi; 「同じ失敗を繰り返さないようにする」 nêu mục đích “để không lặp lại cùng lỗi”.',
  toan_q_2023_07_52:
    'Câu hoàn chỉnh: 「(教室で)南「西川さんの誕生日に、何かプレゼントをあげない?」森「いいね。スポーツが好きだと言っていたから、タオルとかいいんじゃない?」」\n' +
    'Dịch: “(Trong lớp) Minami: Tặng Nishikawa món quà gì đó vào sinh nhật nhé? — Mori: Hay đấy. Bạn ấy nói thích thể thao, vậy khăn tắm hay món gì như thế chẳng phải hợp sao?”\n' +
    'Thứ tự là 2 → 4 → 3 → 1; ô ★ thứ ba là 「とか」, lựa chọn 3. 「から」 nối lời kể “bạn ấy nói thích thể thao” với lý do đề xuất; 「タオルとか」 đưa khăn tắm làm một ví dụ; 「いいんじゃない」 là lời gợi ý nhẹ nhàng. 「とか」 phải đứng sau vật được nêu làm ví dụ và trước phần đánh giá.',
  toan_q_2023_07_53:
    'Câu hoàn chỉnh: 「(講演会で)司会者「本日は、鳥の専門家でいらっしゃる山下花子先生に、都会で見ることができる様々な鳥について、お話をしていただきます。」」\n' +
    'Dịch: “(Tại buổi diễn thuyết) Người dẫn chương trình: Hôm nay, cô Hanako Yamashita, một chuyên gia về chim, sẽ chia sẻ về nhiều loài chim có thể nhìn thấy ở thành phố.”\n' +
    'Thứ tự là 1 → 3 → 4 → 2; ô ★ thứ ba là 「山下花子先生に」, lựa chọn 4. 「専門家でいらっしゃる」 là cách kính trọng để giới thiệu tư cách của diễn giả; 「先生にお話をしていただく」 diễn tả người nói được nghe thầy/cô trình bày; 「都会で見ることができる」 bổ nghĩa cho 「様々な鳥」. Vì vậy 「都会で」 đứng ngay trước động từ 「見る」 ở phần sau dấu sao.',
}

for (const [id, explanation] of Object.entries(explanations)) {
  const question = questions.find((item) => item.id === id)
  if (!question) throw new Error(`Missing question ${id}`)
  if (
    question.starVerificationStatus !== 'verified-against-source' ||
    !question.starVerificationSources?.some((source) => source.includes('#page=7'))
  ) {
    throw new Error(`Question ${id} must be source-checked before its explanation is curated`)
  }
  const answer = Number(explanation.match(/ô ★[^.]*?lựa chọn\s+(\d)/u)?.[1])
  if (answer !== question.correctAnswer) throw new Error(`${id}: explanation/key mismatch`)
  question.explanation = explanation

  const sectionQuestion = sectionQuestions.find((item) => Number(item.number) === question.number)
  if (!sectionQuestion) throw new Error(`Missing section question ${question.number}`)
  const fullOptions = (question.options || []).map(normalizeOption)
  const sectionOptions = (sectionQuestion.options || []).map((option) => normalizeOption(option.text ?? option))
  if (JSON.stringify(fullOptions) !== JSON.stringify(sectionOptions)) {
    throw new Error(`${id}: section options differ from the PDF-verified full exam`)
  }
  sectionQuestion.correctAnswer = String(question.correctAnswer)
  sectionQuestion.explanation = explanation
  curated[id] = explanation
}

fs.writeFileSync(curatedPath, `${JSON.stringify(curated, null, 2)}\n`, 'utf8')
fs.writeFileSync(masterPath, `${JSON.stringify(exams, null, 2)}\n`, 'utf8')
fs.writeFileSync(sectionMasterPath, `${JSON.stringify(sectionExams, null, 2)}\n`, 'utf8')
console.log('Updated Vietnamese translations and fragment-by-fragment explanations for five July 2023 questions.')
