import fs from 'node:fs'
import path from 'node:path'

const masterPath = path.resolve('data/jlpt_n3_toan_master.json')
const fullMasterPath = path.resolve('data/jlpt_full_master.json')
const curatedPath = path.resolve('data/jlpt_n3_explanations_curated.json')
const exams = JSON.parse(fs.readFileSync(masterPath, 'utf8'))
const fullExams = JSON.parse(fs.readFileSync(fullMasterPath, 'utf8'))
const curated = JSON.parse(fs.readFileSync(curatedPath, 'utf8'))
const exam = exams.find((item) => item.id === 'toan-n3-202312-full')
if (!exam) throw new Error('Could not find JLPT N3 2023/12 exam')
const questions = exam.parts.flatMap((part) => part.questions)
const sectionExam = fullExams.find((item) => item.id === 'cm2u2y69r01gd134iqiw21op8-grammar-reading')
if (!sectionExam) throw new Error('Could not find the December 2023 N3 grammar and reading section')
const sectionQuestions = sectionExam.parts.flatMap((part) => part.questions || [])

const explanations = {
  toan_q_2023_12_49:
    'Câu hoàn chỉnh: 「私は歌手の石川あかりが大好きだ。彼女ほど声がきれいな歌手はいないと思う。」\n' +
    'Dịch: “Tôi rất thích ca sĩ Akari Ishikawa. Tôi nghĩ không có ca sĩ nào có giọng hát hay bằng cô ấy.”\n' +
    'Thứ tự là 4 → 1 → 3 → 2; ô ★ đầu tiên là 「ほど」, lựa chọn 4. 「Nほど～ない」 diễn tả “không có N nào đạt đến mức độ ấy”: 「彼女ほど」 là “bằng cô ấy”. 「声がきれいな」 bổ nghĩa cho danh từ 「歌手」; 「歌手は」 làm chủ đề của 「いない」. Vì dấu sao đứng ở ô đầu tiên, đáp án không phải mảnh đứng ở vị trí thứ ba như dữ liệu cũ.',
  toan_q_2023_12_50:
    'Câu hoàn chỉnh: 「最近は野菜や魚などの食料品もインターネットで買う人が増えてきているということをニュースで知った。」\n' +
    'Dịch: “Gần đây tôi biết qua tin tức rằng số người mua thực phẩm như rau và cá trên Internet cũng đang tăng lên.”\n' +
    'Thứ tự là 3 → 1 → 2 → 4; ô ★ thứ ba là 「増えてきている」, lựa chọn 2. 「インターネットで買う」 bổ nghĩa cho 「人」; 「人が」 là chủ thể của 「増えてきている」; 「ということを」 gom cả mệnh đề thành nội dung mà người nói biết qua tin tức. 「～てきている」 diễn tả xu hướng thay đổi tiếp diễn đến hiện tại.',
  toan_q_2023_12_51:
    'Câu hoàn chỉnh: 「(大学で)中山「林先輩、ゼミの発表で使う資料を作ったんですが、自信がないところがあるので、一度チェックしてもらえないでしょうか。」林「いいですよ。」」\n' +
    'Dịch: “(Ở trường đại học) Nakayama: Anh Hayashi, em đã làm tài liệu cho bài thuyết trình ở seminar, nhưng có chỗ em chưa tự tin, nên anh xem giúp em một lần được không ạ? — Hayashi: Được chứ.”\n' +
    'Thứ tự là 4 → 2 → 3 → 1; ô ★ thứ ba là 「一度チェックして」, lựa chọn 3. 「自信がない」 đứng trước và bổ nghĩa cho 「ところ」; 「ところがあるので」 nêu lý do; 「一度チェックしてもらえないでしょうか」 là lời nhờ vả lịch sự. Mảnh 「もらえない」 phải đi sau hành động được nhờ là 「チェックして」.',
  toan_q_2023_12_52:
    'Câu hoàn chỉnh: 「今朝は急いでいたから、玄関の電気を消すのを忘れて家を出てきてしまった。」\n' +
    'Dịch: “Sáng nay vì vội nên tôi quên tắt đèn ở lối vào rồi ra khỏi nhà mất.”\n' +
    'Thứ tự là 1 → 4 → 3 → 2; ô ★ thứ ba là 「家を出て」, lựa chọn 3. 「玄関の電気を消す」 là hành động “tắt đèn ở lối vào”; 「のを」 danh từ hóa hành động ấy để làm điều bị quên; 「忘れて」 nối với việc ra khỏi nhà; 「出てきてしまった」 nói việc đã rời đi và 「しまった」 thêm sắc thái lỡ làm/tiếc nuối. Vì vậy 「家を出て」 phải đứng trước 「きて」.',
  toan_q_2023_12_53:
    'Câu hoàn chỉnh: 「読書が趣味の友人は、いつどんな本を読んだかを、忘れないように必ずノートに記録することにしているそうだ。」\n' +
    'Dịch: “Nghe nói người bạn có sở thích đọc sách đã đặt ra thói quen ghi chắc chắn vào sổ khi nào mình đọc cuốn sách nào để không quên.”\n' +
    'Thứ tự là 2 → 3 → 1 → 4; ô ★ thứ ba là 「必ずノートに記録する」, lựa chọn 1. 「忘れないように」 nêu mục đích “để không quên”, theo mẫu 「～ないように」; 「必ずノートに記録する」 là hành động được duy trì; 「ことにしている」 diễn tả thói quen/quyết định mà chủ thể tự đặt ra. 「そうだ」 cho biết người nói thuật lại thông tin nghe được.',
}

for (const [id, explanation] of Object.entries(explanations)) {
  const question = questions.find((item) => item.id === id)
  if (!question) throw new Error(`Missing question ${id}`)
  if (
    question.starVerificationStatus !== 'verified-against-source' ||
    !question.starVerificationSources?.some((source) => source.includes('#page=8'))
  ) {
    throw new Error(`Question ${id} must be source-checked before its explanation is curated`)
  }
  const answer = Number(explanation.match(/ô ★[^.]*?lựa chọn\s+(\d)/u)?.[1])
  if (answer !== question.correctAnswer) throw new Error(`${id}: explanation/key mismatch`)
  curated[id] = explanation
  question.explanation = explanation

  const sectionQuestion = sectionQuestions.find((item) => Number(item.number) === question.number)
  if (!sectionQuestion) throw new Error(`Missing section question ${question.number}`)
  sectionQuestion.correctAnswer = String(question.correctAnswer)
  sectionQuestion.answer = String(question.correctAnswer)
  sectionQuestion.explanation = explanation

  if (id === 'toan_q_2023_12_49') {
    sectionQuestion.options[0].text = '声がきれいな'
    sectionQuestion.script = '<p>Tham khảo: <u>ほど</u> 声がきれいな 歌手 は</p><p>"Tôi nghĩ không có ca sĩ nào có giọng hát hay bằng cô ấy."</p>'
  }
}

fs.writeFileSync(curatedPath, `${JSON.stringify(curated, null, 2)}\n`, 'utf8')
fs.writeFileSync(masterPath, `${JSON.stringify(exams, null, 2)}\n`, 'utf8')
fs.writeFileSync(fullMasterPath, `${JSON.stringify(fullExams, null, 2)}\n`, 'utf8')
console.log('Updated December 2023 explanations and synchronized the section copy with its source-verified full exam.')
