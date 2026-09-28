import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'

const root = path.resolve('.')
const readJson = (file) => JSON.parse(fs.readFileSync(path.join(root, file), 'utf8'))
const review = readJson('reports/n3-quality-audit/grammar-m3-2014-12-source-review.json')
const masterPath = path.join(root, 'data/jlpt_n3_toan_master.json')
const curatedPath = path.join(root, 'data/jlpt_n3_explanations_curated.json')
const exams = readJson('data/jlpt_n3_toan_master.json')
const curated = readJson('data/jlpt_n3_explanations_curated.json')
const exam = exams.find((item) => item.id === review.examId)
assert.ok(exam, `Missing ${review.examId}`)
const part = exam.parts.find((item) => item.questions.some((question) => question.id === review.questions[0].questionId))
assert.ok(part, 'Missing Grammar Mondai 3 passage')
const questionMap = new Map(part.questions.map((question) => [question.id, question]))
const normalize = (value) => String(value || '').replace(/<[^>]*>/gu, '').replace(/&nbsp;/giu, ' ').normalize('NFKC').replace(/\s+/gu, '')
const examSource = `Google Drive: ${review.source.questionFile}, printed page ${review.source.printedPage}; Drive file ${review.source.questionDriveFileId}.`
const keySource = `Google Drive: ${review.source.answerKeyFile}, viewer page ${review.source.answerKeyViewerPage}; Drive file ${review.source.answerKeyDriveFileId}.`

const explanations = {
  toan_q_2014_12_54: `Đáp án 1 — 「それ」 chỉ chiếc cốc vừa được nhắc đến: người kể quyết định mua chiếc cốc dễ thương rồi mang chính chiếc cốc đó đến quầy tính tiền.
1. それ: đại từ hồi chỉ vật vừa xuất hiện trong mạch kể; phù hợp với chiếc cốc.
2. あれ: thường chỉ vật ở xa người nói và người nghe hoặc vật đã được biết từ trước; kém phù hợp hơn với vật vừa được giới thiệu.
3. そっち: thường chỉ phía bên kia hoặc một lựa chọn; không tự nhiên khi thay cho chiếc cốc làm tân ngữ của を.
4. あっち: cách nói thân mật chỉ hướng/nơi ở xa; câu cần đại từ chỉ vật.
Dịch: “Khi mang chiếc cốc đó đến quầy tính tiền, một chuyện khiến tôi ngạc nhiên đã xảy ra.”
Ghi nhớ: それ hồi chỉ sự vật vừa được nêu; そっち／あっち chủ yếu chỉ phía hoặc hướng.`,
  toan_q_2014_12_55: `Đáp án 4 — 「言い直してくれました」: nhân viên diễn đạt lại câu hỏi 「ご自宅用ですか」 thành 「家で使いますか、プレゼントですか」 để người kể hiểu.
1. 言い返しました: “đáp trả/cãi lại”; không có nghĩa là nói lại cho dễ hiểu.
2. 言い直しませんでした: “đã không nói lại”; trái với câu hỏi được diễn đạt lại ngay sau đó.
3. 言い返さないでくれました: “đã không đáp trả”; 言い返す là đáp trả, không phải diễn đạt lại câu hỏi.
4. 言い直してくれました: “đã nói lại giúp tôi”; 言い直す là nói lại/sửa cách diễn đạt, còn くれる cho thấy hành động có lợi cho người kể.
Dịch: “Thấy tôi không hiểu và chưa trả lời được, nhân viên nói lại: ‘Anh/chị dùng ở nhà hay mua làm quà ạ?’”
Ghi nhớ: 言い直す = nói lại hoặc diễn đạt lại; Vてくれる cho biết ai đó làm việc ấy giúp người kể.`,
  toan_q_2014_12_56: `Đáp án 2 — 「すると」 nối lời kể với hành động xảy ra tiếp theo: người kể vừa trả lời “là quà”, thì nhân viên bắt đầu chuẩn bị gói chiếc cốc.
1. 実は: “thật ra”; thường mở đầu một thông tin được tiết lộ, không nối chuỗi hành động ở đây.
2. すると: “thế rồi/ngay sau đó”; hợp với diễn biến tiếp nối trong câu chuyện.
3. ところで: “nhân tiện/nói sang chuyện khác”; dùng chuyển chủ đề, trong khi mạch kể không đổi.
4. 例えば: “ví dụ”; câu sau không đưa ra ví dụ cho một ý khái quát.
Dịch: “Sau khi tôi trả lời ‘là quà’, nhân viên cho chiếc cốc vào hộp và lấy ra một tờ giấy.”
Ghi nhớ: すると thường nối một hành động/sự việc với điều xảy ra ngay sau đó.`,
  toan_q_2014_12_57: `Đáp án 3 — 「包まれていたみたいでした」: tờ giấy ôm khít hình chiếc hộp, khiến người kể có cảm giác nó như đã được gói đẹp từ trước.
1. 包まれていたものでした: 「もの」 không tạo được vị ngữ tự nhiên để diễn tả vẻ ngoài của cách gói trong câu này.
2. 包まれていたことでした: 「こと」 danh từ hóa sự việc nhưng không kết hợp tự nhiên sau 「最初からきれいに」 ở đây.
3. 包まれていたみたいでした: 「みたい」 nêu vẻ ngoài/nhận định “trông như”; phù hợp với hình ảnh tờ giấy vừa khít chiếc hộp.
4. 包まれていたからでした: 「から」 nêu lý do (“là vì đã được gói”), không hoàn tất ý so sánh vẻ ngoài.
Dịch: “Dù chỉ mất ít thời gian để gói, tờ giấy vừa khít với hình chiếc hộp. Trông như thể chiếc hộp đã được gói đẹp ngay từ đầu.”
Ghi nhớ: 「普通形 + みたいだ」 có thể diễn tả “trông/có vẻ như…”.`,
  toan_q_2014_12_58: `Đáp án 2 — 「見せようと思っています」 diễn tả dự định hiện tại: người kể định mua quà lưu niệm, nhờ gói rồi cho gia đình xem.
1. 見せるだろうと思っていました: “đã nghĩ có lẽ sẽ cho xem”; nói về suy nghĩ trong quá khứ, không phải dự định hiện tại.
2. 見せようと思っています: 「見せよう」 là ý chí “định cho xem”; 「と思っています」 diễn tả dự định đang có.
3. 見せるだろうと思うはずです: chồng cách suy đoán 「だろう」 với 「はず」, tạo ý “chắc sẽ nghĩ rằng có lẽ sẽ cho xem”, không hợp mạch tự thuật.
4. 見せようと思ったかもしれません: “có lẽ đã từng định cho xem”; phỏng đoán về ý định quá khứ, trái với dự định sau khi về nước.
Dịch: “Vì vậy, tôi định mua một món quà lưu niệm ở cửa hàng bách hóa, nhờ gói rồi cho gia đình xem.”
Ghi nhớ: 「意向形 + と思っています」 diễn tả dự định hiện tại của người nói.`
}

assert.ok(normalize(part.passage).includes(normalize(review.sourcePassage)), 'Passage differs from the reviewed exam PDF')
assert.equal(review.questions.length, 5)
for (const row of review.questions) {
  const question = questionMap.get(row.questionId)
  assert.ok(question, `Missing ${row.questionId}`)
  assert.ok(normalize(question.question).includes(normalize(row.sourceMarker)), `Blank marker differs for ${row.questionId}`)
  const actualOptions = question.options.map((option) => normalize(option).replace(/^[1-4][.．、]?/u, ''))
  assert.deepEqual(actualOptions, row.sourceOptions.map(normalize), `Choices differ from the exam PDF for ${row.questionId}`)
  assert.equal(question.answer, row.answerKeyAnswer, `Answer differs from the reference key for ${row.questionId}`)
  if (question.correctAnswer !== undefined) assert.equal(question.correctAnswer, row.answerKeyAnswer)
  const explanation = explanations[row.questionId]
  assert.ok(explanation, `Missing reviewed explanation for ${row.questionId}`)
  question.explanation = explanation
  question.sourceVerificationStatus = 'verified'
  question.sourceVerificationSources = [examSource, keySource]
  curated[row.questionId] = explanation
}

fs.writeFileSync(masterPath, `${JSON.stringify(exams, null, 2)}\n`)
fs.writeFileSync(curatedPath, `${JSON.stringify(curated, null, 2)}\n`)
console.log('Curated and source-tagged the five December 2014 Grammar M3 explanations after checking the passage, 20 choices and five reference keys.')
