import fs from 'node:fs'

const fullMasterPath = 'data/jlpt_full_master.json'
const mockMasterPath = 'data/jlpt_n3_toan_master.json'
const curatedPath = 'data/jlpt_n3_explanations_curated.json'
const fullMaster = JSON.parse(fs.readFileSync(fullMasterPath, 'utf8'))
const mockMaster = JSON.parse(fs.readFileSync(mockMasterPath, 'utf8'))
const curated = JSON.parse(fs.readFileSync(curatedPath, 'utf8'))

const fullExam = fullMaster.find((exam) => exam.id === 'cm2u2wq1c00ck134imolbo8ac-grammar-reading')
const mockExam = mockMaster.find((exam) => exam.id === 'toan-n3-201707-full')
if (!fullExam || !mockExam) throw new Error('Could not find both July 2017 N3 grammar sources.')

const getQuestion = (exam, number) =>
  exam.parts.flatMap((part) => part.questions || []).find((question) => Number(question.number) === number)
const setSectionOption = (number, optionId, before, after) => {
  const question = getQuestion(fullExam, number)
  const option = question?.options?.find((item) => Number(item.id) === optionId)
  if (!option) throw new Error(`Could not locate July 2017 section question ${number}, option ${optionId}.`)
  if (option.text === after) return
  if (!option.text.includes(before)) {
    throw new Error(`Unexpected July 2017 section option ${number}-${optionId}: ${option.text}`)
  }
  option.text = option.text.replace(before, after)
}
const q37 = getQuestion(mockExam, 37)
const q37Option3 = q37?.options?.find((option) => /^\s*3[.．、]/u.test(option))
if (!q37 || !q37Option3) throw new Error('Could not locate July 2017 grammar question 37 and option 3.')
if (q37Option3.includes('のに対して')) {
  // A repeated run is fine once the PDF transcription already matches.
} else if (q37Option3.includes('に対して')) {
  q37.options[q37.options.indexOf(q37Option3)] = q37Option3.replace('に対して', 'のに対して')
} else {
  throw new Error(`Unexpected July 2017 q37 option 3: ${q37Option3}`)
}

const q37Explanation = `Đáp án 4 — 「仕事に慣れるにしたがって」: 「〜にしたがって」 diễn tả một thay đổi tiến triển song song với một thay đổi khác.
1. までに: “trước khi/cho tới hạn”; cần một mốc thời gian hoặc hạn chót, không diễn tả hai thay đổi cùng tăng dần.
2. たびに: “mỗi lần”; nói một kết quả lặp lại mỗi khi sự việc xảy ra, không hợp với quá trình dần quen việc trong câu này.
3. のに対して: “trái lại/trong khi”; dùng để đối chiếu hai người, nhóm hoặc tình trạng. Câu đang kể một thay đổi kéo theo khả năng mới, nên cần 「にしたがって」.
4. にしたがって: “cùng với/theo quá trình”; mức độ quen việc tăng dần thì người nói cũng dần có thể trò chuyện với khách bằng nụ cười.
Dịch: “Lúc mới bắt đầu làm ở nhà hàng, ngày nào tôi cũng căng thẳng, nhưng càng quen việc, tôi càng có thể trò chuyện với khách hàng bằng nụ cười.”
Ghi nhớ: 「Vる／Nにしたがって」 nêu hai thay đổi cùng tiến triển.`
q37.explanation = q37Explanation
curated[q37.id] = q37Explanation

const q42Section = getQuestion(fullExam, 42)
if (!q42Section) throw new Error('Could not locate July 2017 grammar question 42.')
if (!q42Section.question.startsWith('A 小学校')) {
  q42Section.question = q42Section.question.replace('小学校の近く', 'A 小学校の近く')
}
q42Section.sentence = q42Section.question
setSectionOption(43, 2, '買うことにする。', '買うことにする')
setSectionOption(43, 4, '買ってしまう。', '買ってしまう')

// The PDF prints these two choices differently from the imported section record.
setSectionOption(46, 1, '入りたいもの', '入りたいのも')
setSectionOption(47, 2, 'がしてくると', 'がしてくる')
setSectionOption(51, 2, 'どりらが', 'どちらが')
setSectionOption(51, 4, '勝手も', '勝っても')
setSectionOption(52, 3, '興味があるのものを', '興味があるものを')
const q51Section = getQuestion(fullExam, 51)
if (q51Section?.script?.includes('どりらが') || q51Section?.script?.includes('勝手も')) {
  q51Section.script = q51Section.script.replace('どりらが', 'どちらが').replace('勝手も', '勝っても')
}
const q52Section = getQuestion(fullExam, 52)
if (q52Section?.script?.includes('興味があるのものを')) {
  q52Section.script = q52Section.script.replace('興味があるのものを', '興味があるものを')
}
const q47Mock = getQuestion(mockExam, 47)
const q47MockOption1 = q47Mock?.options?.find((option) => /^\s*1[.．、]/u.test(option))
if (!q47Mock || !q47MockOption1) throw new Error('Could not locate July 2017 mock question 47, option 1.')
if (q47MockOption1.includes('をしていく')) {
  // A repeated run is fine once the PDF transcription already matches.
} else if (q47MockOption1.includes('をしてい')) {
  q47Mock.options[q47Mock.options.indexOf(q47MockOption1)] = q47MockOption1.replace('をしてい', 'をしていく')
} else {
  throw new Error(`Unexpected July 2017 mock option 47-1: ${q47MockOption1}`)
}
const q47Explanation = `Đáp án 2 — 「みそ汁のにおいがしてくる」: mùi súp miso bay tới. 「においがする」 là cách kết hợp chuẩn để nói có/ngửi thấy mùi; 「〜てくる」 diễn tả mùi lan đến phía người nói.
1. をしていく: sai trợ từ với 「におい」; 「〜ていく」 nói một chuyển biến tiếp diễn từ hiện tại về sau, không diễn tả mùi bay tới.
2. がしてくる: đúng mẫu 「においがする」, còn 「くる」 cho biết mùi lan tới người đang mở cửa sổ.
3. をしている: không dùng 「を」 trong cách nói cảm nhận mùi 「においがする」.
4. がしてある: 「〜てある」 nêu trạng thái do ai đó chủ ý tạo ra; mùi súp tự nhiên thoảng đến không phải kết quả được làm sẵn.
Dịch: “Chiều tối, khi mở cửa sổ, lúc nào tôi cũng ngửi thấy mùi súp miso bay tới.”
Ghi nhớ: 「音・におい・味がする」 = có/nghe thấy, ngửi thấy hoặc nếm thấy; 「〜てくる」 = lan tới phía người nói.`
q47Mock.explanation = q47Explanation
curated[q47Mock.id] = q47Explanation
const q48Section = getQuestion(fullExam, 48)
if (!q48Section) throw new Error('Could not locate July 2017 grammar question 48.')
if (!q48Section.question.includes('(会社で)')) {
  q48Section.question = `(会社で)\n${q48Section.question}`
}
q48Section.question = q48Section.question.replace(/\s+。/gu, '。')
q48Section.sentence = q48Section.question
const q48Mock = getQuestion(mockExam, 48)
if (!q48Mock?.question) throw new Error('Could not locate July 2017 grammar mock question 48.')
q48Mock.question = q48Mock.question.replace('お疲れ様です', 'お疲れさまです')
q48Mock.sentence = q48Mock.question

const clozePart = fullExam.parts.find((part) => part.questions?.some((question) => Number(question.number) === 54))
if (!clozePart?.passage) throw new Error('Could not locate the July 2017 section cloze passage.')
const passageFixes = [
  ['廊下の拍除を始めました', '廊下の掃除を始めました'],
  ['私の小学校では拍除は拍除の会社の人', '私の小学校では掃除は掃除の会社の人'],
  ['子供が描除するのを見た', '子供が掃除するのを見た'],
  ['知っている人が招除した場所', '知っている人が掃除した場所'],
]
for (const [before, after] of passageFixes) {
  if (clozePart.passage.includes(before)) {
    clozePart.passage = clozePart.passage.replace(before, after)
  } else if (!clozePart.passage.includes(after)) {
    throw new Error(`Expected July 2017 cloze source phrase is missing: ${before}`)
  }
}

fs.writeFileSync(fullMasterPath, `${JSON.stringify(fullMaster, null, 2)}\n`)
fs.writeFileSync(mockMasterPath, `${JSON.stringify(mockMaster, null, 2)}\n`)
fs.writeFileSync(curatedPath, `${JSON.stringify(curated, null, 2)}\n`)
console.log('Corrected July 2017 q37 option 3 from the source PDF and repaired four OCR errors in the cloze passage.')
