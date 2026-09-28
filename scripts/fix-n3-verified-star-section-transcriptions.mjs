import fs from 'node:fs'

const fullMockPath = 'data/jlpt_n3_toan_master.json'
const sectionMasterPath = 'data/jlpt_full_master.json'
const curatedPath = 'data/jlpt_n3_explanations_curated.json'
const fullMocks = JSON.parse(fs.readFileSync(fullMockPath, 'utf8'))
const sections = JSON.parse(fs.readFileSync(sectionMasterPath, 'utf8'))
const curated = JSON.parse(fs.readFileSync(curatedPath, 'utf8'))
const normalizeOption = (value) =>
  String(value)
    .normalize('NFKC')
    .replace(/^\s*[1-4][.．、\s　)]*/u, '')
    .replace(/\s+/gu, '')

const updates = [
  {
    date: '202012',
    sectionId: 'cm2u2xg4300wm134izpbjrysi-grammar-reading',
    number: 49,
    answer: 1,
    order: [4, 2, 1, 3],
    explanation:
      'Câu hoàn chỉnh: 「この喫茶店はコーヒーだけでなく、スパゲッティなどの料理もおいしい。」\n' +
      'Dịch: “Quán cà phê này không chỉ có cà phê ngon mà các món như mì spaghetti cũng ngon.”\n' +
      'Thứ tự bốn mảnh là 4 → 2 → 1 → 3; ô ★ ở vị trí thứ ba nhận 「などの」, lựa chọn 1. Cả bốn mảnh đều được dùng, nên các lựa chọn không phải phương án sai; cần đặt chúng đúng vị trí trong câu.\n' +
      '1. などの: đứng sau danh từ nêu ví dụ 「スパゲッティ」 và trước danh từ khái quát 「料理」, tạo cụm 「スパゲッティなどの料理」 (các món như spaghetti). Đây là mảnh ở ô ★.\n' +
      '2. スパゲッティ: đứng sau 「だけでなく」 để nêu món thứ hai được khen ngon, trước 「などの料理」.\n' +
      '3. 料理も: kết thúc phần liệt kê bằng “các món ăn cũng”; theo sau cụm ví dụ 「スパゲッティなどの」.\n' +
      '4. だけでなく: gắn với 「コーヒー」 thành 「コーヒーだけでなく」, nghĩa là “không chỉ cà phê”; mở đầu vế bổ sung tương ứng với 「料理も」.\n' +
      'Ghi nhớ: 「AだけでなくBも」 = không chỉ A mà B cũng; 「NなどのN」 = những N như N.',
    script: 'だけでなく スパゲッティ <u>などの</u> 料理も',
  },
  {
    date: '201912',
    sectionId: 'cm2u2xbu400ta134iaz003jdg-grammar-reading',
    number: 52,
    answer: 3,
    order: [2, 4, 3, 1],
    explanation:
      'Câu hoàn chỉnh: 「昨日初めて花川駅に行った。花川駅までどの電車で行けば一番早く着くのかわからなくて、電車に乗る前に駅員に聞いた。」\n' +
      'Dịch: “Hôm qua tôi lần đầu đến ga Hanakawa. Vì không biết đi chuyến tàu nào thì đến đó nhanh nhất, tôi đã hỏi nhân viên ga trước khi lên tàu.”\n' +
      'Thứ tự là 2 → 4 → 3 → 1; ô ★ thứ ba nhận 「一番早く着くのか」, lựa chọn 3. Cụm 「どの電車で行けば一番早く着くのか」 là câu hỏi gián tiếp “đi chuyến nào thì đến nhanh nhất”, làm nội dung cho 「わからなくて」. 「どの電車で」 nêu chuyến tàu cần chọn; 「行けば」 nối điều kiện với kết quả 「一番早く着く」.',
    script: 'どの電車で 行けば <u><b>一番早く着くのか</b></u> わからなくて',
  },
  {
    date: '201912',
    sectionId: 'cm2u2xbu400ta134iaz003jdg-grammar-reading',
    number: 53,
    answer: 3,
    order: [4, 1, 3, 2],
    explanation:
      'Câu hoàn chỉnh: 「私、車で行くつもりだから、もし行くんだったら乗せていってあげる。」\n' +
      'Dịch: “Tôi định đi bằng ô tô, nên nếu bạn cũng đi thì tôi sẽ chở bạn.”\n' +
      'Thứ tự là 4 → 1 → 3 → 2; ô ★ thứ ba nhận 「行くんだったら」, lựa chọn 3. 「もし～んだったら」 nêu điều kiện “nếu bạn đi”; mệnh đề 「私、車で行くつもりだから」 cho biết lý do, còn 「乗せていってあげる」 là lời đề nghị chở người nghe đến đó.',
    script: '行くつもりだから もし <u><b>行くんだったら</b></u> 乗せていってあげる',
  },
  {
    date: '201512',
    sectionId: 'cm2u2wco4002g134io8nm04te-grammar-reading',
    number: 52,
    answer: 1,
    order: [4, 3, 1, 2],
    explanation:
      'Câu hoàn chỉnh: 「このパソコン教室にはさまざまなコースがあります。基礎コースは、パソコンの基本的な使い方に慣れるためのコースなので、初めて習う方にぴったりです。」\n' +
      'Dịch: “Trung tâm máy tính này có nhiều khóa học. Khóa cơ bản giúp người mới làm quen với cách sử dụng máy tính cơ bản, nên rất phù hợp với người mới học.”\n' +
      'Thứ tự là 4 → 3 → 1 → 2; ô ★ thứ ba nhận 「コースなので」, lựa chọn 1. 「基本的な使い方に慣れるためのコース」 là cụm danh từ “khóa học để làm quen với cách sử dụng cơ bản”; 「コースなので」 nêu đặc điểm/lý do trước kết luận 「初めて習う方にぴったりです」.',
    script:
      'このパソコン教室にはさまざまなコースがあります。基礎コースは、パソコンの基本的な使い方に慣れるための<u>コースなので</u>初めて習う方にぴったりです。',
  },
  {
    date: '201512',
    sectionId: 'cm2u2wco4002g134io8nm04te-grammar-reading',
    number: 53,
    answer: 4,
    order: [1, 2, 4, 3],
    explanation:
      'Câu hoàn chỉnh: 「エアコンから冷たい空気が出た。部屋の下の方に行くのはどうしてかというと、冷たい空気は暖かい空気より重いからだ。」\n' +
      'Dịch: “Khí lạnh thổi ra từ máy điều hòa. Vì sao nó đi xuống phía dưới phòng? Vì khí lạnh nặng hơn khí ấm.”\n' +
      'Thứ tự là 1 → 2 → 4 → 3; ô ★ thứ ba nhận 「部屋の下の方に行くのは」, lựa chọn 4. 「冷たい空気が出た。」 kết thúc ý thứ nhất; dấu chấm tách câu này khỏi câu hỏi 「部屋の下の方に行くのはどうしてか」. Nếu bỏ dấu ngắt, 「出た部屋」 dễ bị đọc thành cụm “căn phòng mà khí lạnh thổi ra”, không đúng ý câu.',
    script:
      'エアコンから冷たい空気が出た。部屋の下の方に行くのはどうしてかというと、冷たい空気は暖かい空気より重いからだ。',
  },
  {
    date: '201507',
    sectionId: 'cm2u2w9ag0000134idizwckzy-grammar-reading',
    number: 52,
    answer: 4,
    order: [2, 1, 4, 3],
    explanation:
      'Câu hoàn chỉnh: 「一人暮らしを始めて3か月が過ぎたが、家に話し相手が誰もいないのは寂しいといつも思う。」\n' +
      'Dịch: “Dù đã qua ba tháng sống một mình, tôi vẫn luôn thấy buồn vì ở nhà chẳng có ai để trò chuyện.”\n' +
      'Thứ tự là 2 → 1 → 4 → 3; ô ★ thứ ba nhận 「のは」, lựa chọn 4. 「話し相手が誰もいない」 hoàn thành mệnh đề “không có ai để trò chuyện”; 「の」 danh từ hóa cả mệnh đề để 「寂しい」 nhận xét nó, còn 「は」 nêu điều đang được nói đến. Vì thế 「のは」 phải đứng ngay trước 「寂しい」.',
    script: '一人暮らしを始めて3か月が過ぎたが、家に話し相手が誰もいない<u>のは</u>寂しいといつも思う。',
  },
  {
    date: '201507',
    sectionId: 'cm2u2w9ag0000134idizwckzy-grammar-reading',
    number: 53,
    answer: 1,
    order: [4, 2, 1, 3],
    explanation:
      'Câu hoàn chỉnh: 「30日以上雨の降らない日が続いているが、すぐ気にならなくなった。」\n' +
      'Dịch: “Những ngày không mưa đã kéo dài hơn 30 ngày, nhưng rồi tôi cũng nhanh chóng không còn bận tâm nữa.”\n' +
      'Thứ tự là 4 → 2 → 1 → 3; ô ★ thứ ba nhận 「日が」, lựa chọn 1. 「雨の降らない」 bổ nghĩa cho danh từ 「日」 thành “ngày không mưa”; 「日が」 là chủ ngữ của 「続いている」. Vì vậy 「雨の」 phải đứng trước 「降らない」, rồi mới đến 「日が」.',
    script: '30日以上雨の降らない<u>日が</u>続いているが、すぐ気にならなくなった。',
  },
]

for (const update of updates) {
  const sourceExam = fullMocks.find((exam) => exam.id === `toan-n3-${update.date}-full`)
  const sectionExam = sections.find((exam) => exam.id === update.sectionId)
  if (!sourceExam || !sectionExam) throw new Error(`Could not find the ${update.date} source and section exams.`)
  const sourceQuestion = sourceExam.parts.flatMap((part) => part.questions || []).find((question) => question.number === update.number)
  const sectionQuestion = sectionExam.parts.flatMap((part) => part.questions || []).find((question) => question.number === update.number)
  if (!sourceQuestion || !sectionQuestion) throw new Error(`Could not find ${update.date} question ${update.number}.`)

  if (
    sourceQuestion.starOrderVerified !== true ||
    sourceQuestion.starPositionVerified !== true ||
    JSON.stringify(sourceQuestion.starCorrectOrder) !== JSON.stringify(update.order) ||
    Number(sourceQuestion.starCorrectOrder[sourceQuestion.starPosition]) !== update.answer ||
    Number(sourceQuestion.correctAnswer ?? sourceQuestion.answer) !== update.answer ||
    Number(sectionQuestion.correctAnswer ?? sectionQuestion.answer) !== update.answer
  ) {
    throw new Error(`${update.date} question ${update.number} source order, star position, or answer does not match.`)
  }

  const sourceOptions = sourceQuestion.options.map(normalizeOption)
  if (sectionQuestion.options.length !== 4 || sectionQuestion.options.some((option, index) =>
    normalizeOption(option.text ?? option) !== sourceOptions[index])) {
    for (const [index, option] of sourceQuestion.options.entries()) {
      const sectionOption = sectionQuestion.options[index]
      if (!sectionOption || normalizeOption(sectionOption.text ?? sectionOption) !== sourceOptions[index]) {
        if (!sectionOption) throw new Error(`Missing option ${index + 1} in ${update.date} question ${update.number}.`)
        sectionOption.text = String(option).replace(/^\s*[1-4][.．、\s　)]*/u, '').trim()
      }
    }
    if (sectionQuestion.options.some((option, index) => normalizeOption(option.text ?? option) !== sourceOptions[index])) {
      throw new Error(`Could not align ${update.date} question ${update.number} choices with the verified source.`)
    }
  }

  if (update.date === '201912' && update.number === 53) {
    const prompt = `${sourceQuestion.starPrompt.before} ___ ___ _★_ ___${sourceQuestion.starPrompt.after}`
    sectionQuestion.question = prompt
    sectionQuestion.sentence = prompt
  } else if (update.date === '201507' && update.number === 52) {
    for (const field of ['question', 'sentence']) {
      if (typeof sectionQuestion[field] === 'string') {
        sectionQuestion[field] = sectionQuestion[field].replace('寂しと', '寂しいと')
      }
    }
  }

  sectionQuestion.script = update.script
  sourceQuestion.explanation = update.explanation
  sectionQuestion.explanation = update.explanation
  curated[sourceQuestion.id] = update.explanation
}

fs.writeFileSync(fullMockPath, `${JSON.stringify(fullMocks, null, 2)}\n`, 'utf8')
fs.writeFileSync(sectionMasterPath, `${JSON.stringify(sections, null, 2)}\n`, 'utf8')
fs.writeFileSync(curatedPath, `${JSON.stringify(curated, null, 2)}\n`, 'utf8')
console.log(`Aligned ${updates.length} source-verified star questions with their split-section transcriptions.`)
