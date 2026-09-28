import fs from 'node:fs'

const fullMockPath = 'data/jlpt_n3_toan_master.json'
const sectionMasterPath = 'data/jlpt_full_master.json'
const curatedPath = 'data/jlpt_n3_explanations_curated.json'
const fullMockExams = JSON.parse(fs.readFileSync(fullMockPath, 'utf8'))
const sectionExams = JSON.parse(fs.readFileSync(sectionMasterPath, 'utf8'))
const curated = JSON.parse(fs.readFileSync(curatedPath, 'utf8'))
const fullMock = fullMockExams.find((exam) => exam.id === 'toan-n3-202107-full')
const sectionExam = sectionExams.find((exam) => exam.id === 'cm2u2xkhj00zx134iasxlu6kb-grammar-reading')
if (!fullMock || !sectionExam) throw new Error('Could not find the July 2021 N3 exams.')

const explanations = {
  toan_q_2021_07_49:
    'Câu hoàn chỉnh: 「先生「みなさんは、一度でいいから会ってみたいと思う人はいますか。」」\n' +
    'Dịch: “Có ai mà các em muốn gặp dù chỉ một lần không?”\n' +
    'Thứ tự là 3 → 2 → 4 → 1; ô ★ thứ hai nhận 「いい」, lựa chọn 2. 「一度でいいから」 nghĩa là “dù chỉ một lần cũng được”; 「でいい」 tạo cụm tự nhiên sau 「一度」, còn 「から」 nối sang hành động 「会ってみたい」.',
  toan_q_2021_07_50:
    'Câu hoàn chỉnh: 「おいしかったです。何という魚かわかりませんが、お刺身がおいしかったです。」\n' +
    'Dịch: “Ngon lắm ạ. Tôi không biết đó là cá gì, nhưng món sashimi rất ngon.”\n' +
    'Thứ tự là 2 → 1 → 4 → 3; ô ★ thứ ba nhận 「魚」, lựa chọn 4. 「何という魚か」 tạo câu hỏi gián tiếp “đó là cá gì”, làm bổ ngữ cho 「わかりません」. 「何」 phải đứng trước 「という」, còn 「か」 khép câu hỏi; vì vậy chỉ 「魚」 hoàn thành cụm 「何という魚」 tại vị trí ★.',
  toan_q_2021_07_52:
    'Câu hoàn chỉnh: 「私は料理が苦手で、レシピを見ずに作れる料理はほとんどない。」\n' +
    'Dịch: “Tôi nấu ăn không giỏi, nên hầu như chẳng có món nào tôi làm được mà không xem công thức.”\n' +
    'Thứ tự là 1 → 4 → 3 → 2; ô ★ thứ ba nhận 「作れる」, lựa chọn 3. 「レシピを見ずに作れる」 nghĩa là “có thể làm mà không xem công thức” và bổ nghĩa cho danh từ 「料理」, nên 「作れる」 phải đứng ngay trước 「料理は」. Các mảnh còn lại lần lượt tạo 「苦手で」 và 「レシピを見ずに」 ở phía trước cụm bổ nghĩa này.',
  toan_q_2021_07_53:
    'Câu hoàn chỉnh: 「この島は、空から見ると人の耳のような形に見えることから『耳島』と呼ばれています。」\n' +
    'Dịch: “Nhìn từ trên cao, hòn đảo này trông có hình giống tai người, nên được gọi là ‘Đảo Tai’.”\n' +
    'Thứ tự là 4 → 3 → 1 → 2; ô ★ thứ ba nhận 「形に」, lựa chọn 1. 「人の耳のような形に見える」 nghĩa là “trông có hình giống tai người”; 「形に」 phải đứng trước 「見える」. Cụm 「見ると」 mở cách nhìn từ trên cao, còn 「見えることから」 nêu lý do hòn đảo có tên như vậy.',
  toan_q_2021_07_51:
    'Câu hoàn chỉnh: 「送る写真を今選んでいるところだから、もう少し待って。」\n' +
    'Dịch: “Mình đang chọn ảnh để gửi đây, đợi thêm một chút nhé.”\n' +
    'Thứ tự là 2 → 3 → 1 → 4; ô ★ thứ ba nhận 「選んでいる」, lựa chọn 1. 「送る写真」 là những bức ảnh sẽ gửi; 「今」 đứng trước cụm động từ; 「選んでいるところ」 nhấn mạnh hành động đang diễn ra ngay lúc nói. Vì thế 「選んでいる」 nối giữa trạng từ 「今」 và 「ところだ」.',
}

const allQuestions = (exam) => exam.parts.flatMap((part) => part.questions || [])
const sourceQuestions = allQuestions(fullMock)
const sectionQuestions = allQuestions(sectionExam)
const normalizeOption = (option) => String(option).normalize('NFKC').replace(/^\s*[1-4][.．、]?\s*/u, '').replace(/\s+/gu, '')

for (const [id, explanation] of Object.entries(explanations)) {
  const sourceQuestion = sourceQuestions.find((question) => question.id === id)
  if (!sourceQuestion) throw new Error(`Missing source question ${id}`)
  const answer = Number(sourceQuestion.correctAnswer ?? sourceQuestion.answer)
  const order = sourceQuestion.starCorrectOrder
  const position = sourceQuestion.starPosition
  if (
    sourceQuestion.starOrderVerified !== true ||
    sourceQuestion.starPositionVerified !== true ||
    !Array.isArray(order) ||
    order.length !== 4 ||
    order[position] !== answer
  ) {
    throw new Error(`${id} needs a verified source order and matching star answer`)
  }
  if (!explanation.includes(`lựa chọn ${answer}`)) throw new Error(`${id} explanation has the wrong answer key`)

  const sectionQuestion = sectionQuestions.find((question) => Number(question.number) === Number(sourceQuestion.number))
  if (!sectionQuestion) throw new Error(`Missing section question ${sourceQuestion.number}`)
  if (Number(sectionQuestion.correctAnswer ?? sectionQuestion.answer) !== answer) {
    throw new Error(`${id} section answer differs from the verified source`)
  }
  if (!sectionQuestion.options.map((option) => normalizeOption(option.text ?? option)).every((option, index) =>
    option === normalizeOption(sourceQuestion.options[index]))) {
    throw new Error(`${id} section options differ from the verified source`)
  }

  sourceQuestion.explanation = explanation
  sectionQuestion.explanation = explanation
  curated[id] = explanation
}

fs.writeFileSync(fullMockPath, `${JSON.stringify(fullMockExams, null, 2)}\n`, 'utf8')
fs.writeFileSync(sectionMasterPath, `${JSON.stringify(sectionExams, null, 2)}\n`, 'utf8')
fs.writeFileSync(curatedPath, `${JSON.stringify(curated, null, 2)}\n`, 'utf8')
console.log('Updated and synchronized the verified July 2021 star explanations for questions 49–53.')
