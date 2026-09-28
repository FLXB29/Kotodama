import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'

const root = path.resolve('.')
const readJson = (file) => JSON.parse(fs.readFileSync(path.join(root, file), 'utf8'))
const masterPath = path.join(root, 'data/jlpt_n3_toan_master.json')
const curatedPath = path.join(root, 'data/jlpt_n3_explanations_curated.json')
const exams = readJson('data/jlpt_n3_toan_master.json')
const curated = readJson('data/jlpt_n3_explanations_curated.json')
const m1Review = readJson('reports/n3-quality-audit/grammar-source-2014-12-m1-review.json')
const keyReview = readJson('reports/n3-quality-audit/grammar-answer-key-2014-12-review.json')
const starReview = readJson('reports/n3-quality-audit/star-source-2014-12-review.json')
const exam = exams.find((item) => item.id === m1Review.examId)
assert.ok(exam, `Missing exam ${m1Review.examId}`)
assert.equal(starReview.examId, exam.id)

const questionMap = new Map(exam.parts.flatMap((part) => part.questions).map((question) => [question.id, question]))
const normalize = (value) => String(value || '').replace(/<[^>]*>/gu, '').replace(/&nbsp;/giu, ' ').normalize('NFKC').replace(/\s+/gu, '')
const extractOptions = (question) => question.options.map((option) => normalize(option).replace(/^[1-4][.．、]?/u, ''))
const sourceOptions = (options) => options.map(normalize)
const keyById = new Map(keyReview.grammarM1Answers.map((item) => [item.questionId, item.answer]))
const answerSource = `Google Drive: ${keyReview.source.file}, viewer page ${keyReview.source.viewerPage}; Drive file ${keyReview.source.driveFileId}.`
const examSource = (page) => `Google Drive: ${m1Review.source.file}, printed page ${page}; Drive file ${m1Review.source.driveFileId}.`

assert.equal(m1Review.questions.length, 13)
assert.equal(keyReview.grammarM1Answers.length, 13)
assert.equal(starReview.questions.length, 5)
for (const row of m1Review.questions) {
  const question = questionMap.get(row.questionId)
  assert.ok(question, `Missing ${row.questionId}`)
  const prompt = normalize(question.question).replace(/^\[\d+\]/u, '')
  const sentence = normalize(question.sentence).replace(/^\[\d+\]/u, '')
  assert.ok(prompt.includes(normalize(row.sourcePrompt)), `Prompt mismatch ${row.questionId}`)
  assert.ok(sentence.includes(normalize(row.sourcePrompt)), `Sentence mismatch ${row.questionId}`)
  const actual = extractOptions(question)
  const expected = sourceOptions(row.sourceOptions)
  if (row.questionId === 'toan_q_2014_12_45') {
    assert.ok(['とか何かに', 'と何かに'].includes(actual[1]), 'Refusing to rewrite an unexpected source mismatch for question 45')
    actual[1] = 'と何かに'
  }
  assert.deepEqual(actual, expected, `Choices mismatch ${row.questionId}`)
  assert.equal(question.answer, keyById.get(row.questionId), `Answer mismatch ${row.questionId}`)
  if (question.correctAnswer !== undefined) assert.equal(question.correctAnswer, keyById.get(row.questionId))
}

const explanations = {
  toan_q_2014_12_43: `Đáp án 3 — 「教えてほしいんです」: người nói muốn anh/chị Ishida chỉ giúp một nha sĩ tốt. 「Vてほしい」 diễn tả mong người nghe làm việc gì; 「んです」 giải thích tình huống khiến người nói cần nhờ.
1. 教えたいんですが: “tôi muốn chỉ/bảo”; chuyển ý muốn sang người nói, trong khi người nói đang cần được giới thiệu nha sĩ.
2. 教えていいですか: “tôi chỉ cho anh/chị được không?”; cũng nói về việc người nói tự chỉ, trái với ý định xin gợi ý.
3. 教えてほしいんです: “tôi muốn anh/chị chỉ cho”; đúng vai người được nhờ và hợp với câu giải thích 「歯が痛くて」.
4. 教えてもらっていますか: “anh/chị đang được ai đó chỉ cho à?”; hỏi về việc nhận chỉ dẫn, không phải lời nhờ.
Dịch: “Xin lỗi, nếu anh/chị biết nha sĩ nào tốt gần công ty thì tôi muốn nhờ anh/chị chỉ giúp. Răng tôi đau quá.”
Ghi nhớ: 「人にVてほしい」 = muốn người đó V; 「Vたい」 = bản thân muốn V. Lựa chọn 3 trong đề kết thúc ở 「んです」, không có 「が」.`,
  toan_q_2014_12_45: `Đáp án 3 — 「授業のことでも何でも相談してくださいね」: đàn anh khuyến khích hậu bối cứ hỏi bất cứ chuyện gì, kể cả việc học.
1. か何かが: 「か何か」 là “hay gì đó”, nhưng 「が」 khiến cụm này thành chủ ngữ, không nối đúng với lời mời 「相談してください」.
2. と何かに: đúng như phương án in trong PDF; 「授業のことと何かに相談する」 không tạo được quan hệ trợ từ tự nhiên ở câu này.
3. でも何でも: mẫu 「Nでも何でも」 mở rộng phạm vi thành “N hay bất cứ việc gì”; phù hợp với lời mời trao đổi.
4. など何も: 「何も」 thường đi với vị ngữ phủ định; không tạo lời khuyến khích như 「相談してください」.
Dịch: “Nếu gặp chuyện khó khăn trong đời sống đại học, cứ trao đổi với anh/chị bất cứ điều gì, kể cả chuyện học nhé.”
Ghi nhớ: 「Nでも何でも相談してください」 = cứ tư vấn/trao đổi bất cứ chuyện gì, kể cả N.`,
  toan_q_2014_12_49: `Đáp án 1 — tại ô ★, mảnh đúng là 「は」 (lựa chọn 1).
Câu hoàn chỉnh: 「僕の家族は、両親と弟三人の六人家族です。家族で女は母だけです。」
Thứ tự bốn mảnh: 4 → 2 → 1 → 3. 「で」 ở lựa chọn 4 giới hạn phạm vi “trong gia đình”; 「女」 ở lựa chọn 2 nêu nhóm được nói đến; 「は」 ở lựa chọn 1 đánh dấu chủ đề; 「母」 ở lựa chọn 3 hoàn tất ý “chỉ có mẹ”. Vì 「だけ」 đứng sau 「母」, mảnh cuối phải là lựa chọn 3.
Dịch: “Gia đình tôi có sáu người gồm bố mẹ và ba em trai. Trong nhà, mẹ là người phụ nữ duy nhất.”`,
  toan_q_2014_12_50: `Đáp án 2 — tại ô ★, mảnh đúng là 「会議の資料の」 (lựa chọn 2).
Câu hoàn chỉnh: 「必ず今日中に作らなくてはいけない会議の資料のことをすっかり忘れていた。」
Thứ tự bốn mảnh: 3 → 4 → 2 → 1. 「今日中に」 ở lựa chọn 3 nêu hạn chót; 「作らなくてはいけない」 ở lựa chọn 4 tạo mệnh đề bổ nghĩa cho danh từ đứng sau; 「会議の資料の」 ở lựa chọn 2 nối với 「こと」; 「ことを」 ở lựa chọn 1 danh từ hóa toàn bộ việc phải làm và làm tân ngữ của 「すっかり忘れていた」. Do ★ là vị trí thứ ba trong chuỗi, nó nhận lựa chọn 2.
Dịch: “Tôi đã quên bẵng mất việc nhất định phải chuẩn bị tài liệu cuộc họp trong hôm nay.”`,
  toan_q_2014_12_51: `Đáp án 4 — tại ô ★, mảnh đúng là 「説明すると」 (lựa chọn 4).
Câu hoàn chỉnh: 「先生「調べた結果を説明するとき、表やグラフを示しながら説明するとわかりやすくなります。」」
Thứ tự bốn mảnh: 3 → 2 → 4 → 1. 「表やグラフを」 ở lựa chọn 3 là tân ngữ của 「示す」; 「示しながら」 ở lựa chọn 2 diễn tả vừa chỉ/trình bày vừa giải thích; 「説明すると」 ở lựa chọn 4 nối với kết quả 「わかりやすくなります」; 「わかりやすく」 ở lựa chọn 1 bổ nghĩa cho 「なります」. Vì ★ ở vị trí thứ ba nên chọn 4.
Dịch: “Giáo viên: ‘Khi giải thích kết quả đã khảo sát, nếu vừa trình bày bằng bảng hoặc biểu đồ vừa giải thích thì nội dung sẽ dễ hiểu hơn.’”`,
  toan_q_2014_12_52: `Đáp án 3 — tại ô ★, mảnh đúng là 「友人と電話で話していたら」 (lựa chọn 3).
Câu hoàn chỉnh: 「昨日の夜、高校時代にずっと同じクラスだった友人と電話で話していたら、いつのまにか３時間もたっていて、驚いた。」
Thứ tự bốn mảnh: 4 → 2 → 3 → 1. 「ずっと同じ」 ở lựa chọn 4 kết hợp với 「クラスだった」 ở lựa chọn 2 để bổ nghĩa cho 「友人」; lựa chọn 3 nêu tình huống “đang nói điện thoại với bạn thì…”; lựa chọn 1 「いつのまにか３時間も」 bổ nghĩa cho 「たっていて」. Do ★ ở vị trí thứ ba, đáp án là lựa chọn 3.
Dịch: “Tối qua, khi đang nói điện thoại với người bạn từng học cùng lớp suốt thời cấp ba, tôi giật mình nhận ra đã trôi qua tận ba tiếng lúc nào không hay.”`,
  toan_q_2014_12_53: `Đáp án 4 — tại ô ★, mảnh đúng là 「思う」 (lựa chọn 4).
Câu hoàn chỉnh: 「私が今住んでいるアパートは線路の近くにある。住み始めたころは、電車の通る音がしてうるさいと思うこともあったが、すぐ気にならなくなった。」
Thứ tự bốn mảnh: 3 → 1 → 4 → 2. 「音がして」 ở lựa chọn 3 nối với 「電車の通る」 để nêu âm thanh nghe thấy; 「うるさいと」 ở lựa chọn 1 mở nội dung suy nghĩ; 「思う」 ở lựa chọn 4 hoàn thành cụm 「うるさいと思う」; 「こともあった」 ở lựa chọn 2 danh từ hóa và nêu rằng đôi khi đã có cảm giác ấy. ★ nằm ở vị trí thứ ba nên chọn 4.
Dịch: “Căn hộ tôi đang ở gần đường ray. Lúc mới dọn đến, đôi khi nghe tiếng tàu chạy qua tôi thấy ồn, nhưng chẳng bao lâu sau tôi không còn bận tâm nữa.”`
}

for (const row of m1Review.questions) {
  const question = questionMap.get(row.questionId)
  if (row.questionId === 'toan_q_2014_12_45') question.options[1] = String(question.options[1]).replace(/^(\s*2[.．、]?\s*).*/u, '$1と何かに')
  const explanation = explanations[row.questionId]
  if (explanation) {
    question.explanation = explanation
    curated[row.questionId] = explanation
  }
  question.sourceVerificationStatus = 'verified'
  question.sourceVerificationSources = [examSource(row.printedPage), answerSource]
}

for (const row of starReview.questions) {
  const question = questionMap.get(row.questionId)
  assert.ok(question, `Missing ${row.questionId}`)
  assert.deepEqual(extractOptions(question), sourceOptions(row.sourceOptions), `Star choices mismatch ${row.questionId}`)
  assert.equal(question.answer, row.answer)
  if (question.correctAnswer !== undefined) assert.equal(question.correctAnswer, row.answer)
  const explanation = explanations[row.questionId]
  assert.ok(explanation, `Missing reviewed explanation for ${row.questionId}`)
  question.explanation = explanation
  curated[row.questionId] = explanation
  question.sourceVerificationStatus = 'verified'
  question.sourceVerificationSources = [
    `Google Drive: ${starReview.source.file}, printed page ${starReview.source.printedPage}; Drive file ${starReview.source.driveFileId}.`,
    answerSource
  ]
  question.starOrderVerified = true
  question.starPositionVerified = true
  question.starVerificationSources = [...question.sourceVerificationSources]
}

for (const row of [...m1Review.questions, ...starReview.questions]) {
  const question = questionMap.get(row.questionId)
  assert.equal(curated[row.questionId], question.explanation, `Curated map mismatch ${row.questionId}`)
}

fs.writeFileSync(masterPath, `${JSON.stringify(exams, null, 2)}\n`)
fs.writeFileSync(curatedPath, `${JSON.stringify(curated, null, 2)}\n`)
console.log('Corrected the source typo in Grammar M1 question 10, synchronized its explanation, completed all five star-order explanations, and recorded PDF/answer-key provenance for the 18 reviewed questions.')
