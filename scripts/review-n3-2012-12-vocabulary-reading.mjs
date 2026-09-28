import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'

const root = path.resolve('.')
const masterPath = path.join(root, 'data/jlpt_n3_toan_master.json')
const curatedPath = path.join(root, 'data/jlpt_n3_explanations_curated.json')
const reportPath = path.join(root, 'reports/n3-quality-audit/vocabulary-2012-12-reading-review.json')
const examSource = 'https://www.scribd.com/document/861809754/jlpt-n3-2012-12'
const answerSource =
  'https://www.scribd.com/document/909969790/2012%E5%B9%B412%E6%9C%88-N3%E7%9C%9F%E9%A2%98%E7%AD%94%E6%A1%88'

const exams = JSON.parse(fs.readFileSync(masterPath, 'utf8'))
const curated = JSON.parse(fs.readFileSync(curatedPath, 'utf8'))
const exam = exams.find((item) => item.id === 'toan-n3-201212-full')
assert.ok(exam, 'Missing JLPT N3 12/2012 exam')
const questions = new Map(exam.parts.flatMap((part) => part.questions).map((question) => [question.id, question]))
const answerKey = [2, 3, 4, 2, 1, 3, 1, 4]

const explanations = {
  toan_q_2012_12_1: [
    'Đáp án 2 — 短い（みじかい）nghĩa là ngắn; 短すぎて là ngắn quá. Dịch: “Sợi dây này ngắn quá nên khó sử dụng.”',
    '1. よわすぎて là 弱すぎて, yếu quá; không nói về chiều dài sợi dây.',
    '2. みじかすぎて là cách đọc đúng của 短すぎて, nghĩa là ngắn quá.',
    '3. ほそすぎて là 細すぎて, mảnh/quá nhỏ bề ngang; không phải cách đọc của 短い.',
    '4. かたすぎて là 硬すぎて, cứng quá; không phải cách đọc của 短い.',
    'Ghi nhớ: 短い（みじかい）= ngắn; 細い（ほそい）= mảnh; 弱い（よわい）= yếu; 硬い（かたい）= cứng.',
  ].join('\n'),
  toan_q_2012_12_2: [
    'Đáp án 3 — 他人（たにん）là người khác/người ngoài. Dịch: “Người đó hoàn toàn không nghe ý kiến của người khác.”',
    '1. ちにん không phải cách đọc của 他人.',
    '2. たじん không phải cách đọc chuẩn của 他人.',
    '3. たにん là cách đọc đúng; 他人の意見 nghĩa là ý kiến của người khác.',
    '4. ちじん thường viết 知人, nghĩa là người quen; đó là từ khác, không phải 他人.',
    'Ghi nhớ: 他人（たにん）= người khác/người ngoài; 知人（ちじん）= người quen.',
  ].join('\n'),
  toan_q_2012_12_3: [
    'Đáp án 4 — 示す（しめす）nghĩa là chỉ ra hoặc biểu thị. Dịch: “Tôi đã biểu thị sự thay đổi dân số bằng biểu đồ.”',
    '1. うつした có thể viết 移した (di chuyển) hoặc 写した (chụp/sao lại); không phải cách đọc của 示した.',
    '2. さした có thể viết 指した (chỉ) hoặc 刺した (đâm/chích); không phải 示した.',
    '3. あらわした có thể viết 表した (thể hiện); nghĩa gần câu này nhưng không phải cách đọc của chữ 示.',
    '4. しめした là cách đọc đúng của 示した, quá khứ của 示す.',
    'Ghi nhớ: 示す（しめす）= chỉ ra/biểu thị; 表す（あらわす）= thể hiện. Nghĩa có thể gần nhau nhưng cách đọc và chữ Hán khác.',
  ].join('\n'),
  toan_q_2012_12_4: [
    'Đáp án 2 — 外科（げか）là khoa ngoại. Dịch: “Anh/chị Tanaka là bác sĩ ngoại khoa.”',
    '1. がいか có thể viết 外貨, nghĩa là ngoại tệ; không phải cách đọc của 外科.',
    '2. げか là cách đọc đúng của 外科, chỉ khoa phẫu thuật/ngoại khoa.',
    '3. げいか không phải cách đọc của 外科.',
    '4. がか thường viết 画家, nghĩa là họa sĩ; là từ khác.',
    'Ghi nhớ: 外科（げか）= ngoại khoa; 外貨（がいか）= ngoại tệ; 画家（がか）= họa sĩ.',
  ].join('\n'),
  toan_q_2012_12_5: [
    'Đáp án 1 — 笑顔（えがお）là nụ cười/vẻ mặt tươi cười. Dịch: “Nụ cười của anh/chị Sato rất duyên.”',
    '1. えがお là cách đọc đúng của 笑顔.',
    '2. えかお không phải cách đọc chuẩn của 笑顔.',
    '3. わらがお không đọc 笑顔; 笑う thường đọc わらう, còn cả từ này đọc là えがお.',
    '4. わらかお cũng không phải cách đọc của 笑顔.',
    'Ghi nhớ: học 笑顔 như một từ ghép có cách đọc えがお, không ghép máy móc わらう + かお.',
  ].join('\n'),
  toan_q_2012_12_6: [
    'Đáp án 3 — 以降（いこう）nghĩa là từ mốc đó trở đi. Dịch: “Xin hãy gọi lại một lần nữa sau 5 giờ.”',
    '1. いこ không phải cách đọc đầy đủ của 以降.',
    '2. いごう không phải cách đọc của 以降.',
    '3. いこう là cách đọc đúng của 以降.',
    '4. いご có thể viết 以後, cũng mang nghĩa “sau đó”, nhưng không phải cách đọc của chữ 降 trong 以降.',
    'Ghi nhớ: 以降（いこう）= từ thời điểm ấy trở đi; 以後（いご）= từ đó về sau.',
  ].join('\n'),
  toan_q_2012_12_7: [
    'Đáp án 1 — 横断（おうだん）nghĩa là băng qua. Dịch: “Khi băng qua đường, hãy chú ý xe cộ đầy đủ.”',
    '1. おうだん là cách đọc đúng của 横断.',
    '2. よこだん đọc chữ 横 theo âm よこ, nhưng trong từ ghép này phải dùng âm おう.',
    '3. おうたん đọc sai chữ 断; cách đọc ở đây là だん.',
    '4. よこたん đọc sai cả cách ghép âm của 横断.',
    'Ghi nhớ: 横断（おうだん）= băng ngang/băng qua; âm よこ thường gặp trong từ độc lập như 横（よこ）.',
  ].join('\n'),
  toan_q_2012_12_8: [
    'Đáp án 4 — 合図（あいず）là tín hiệu hoặc hiệu lệnh. Dịch: “Khi tôi ra hiệu thì hãy bắt đầu.”',
    '1. ごうと không phải cách đọc của 合図.',
    '2. あいと đọc sai âm cuối; 合図 đọc là あいず với âm đục ず.',
    '3. ごうず đọc sai âm đầu của 合図; chữ 合 trong từ này đọc あい.',
    '4. あいず là cách đọc đúng; 合図をする nghĩa là ra hiệu.',
    'Ghi nhớ: 合図（あいず）= tín hiệu/hiệu lệnh; chú ý âm cuối là ず.',
  ].join('\n'),
}

for (const [index, [id, explanation]] of Object.entries(explanations).entries()) {
  const question = questions.get(id)
  assert.ok(question, `Missing question ${id}`)
  const expectedAnswer = answerKey[index]
  assert.equal(question.answer, expectedAnswer, `Answer key changed at question ${index + 1}`)
  assert.equal(question.correctAnswer, expectedAnswer, `correctAnswer changed at question ${index + 1}`)
  assert.ok(explanation.startsWith(`Đáp án ${expectedAnswer} —`), `Explanation label mismatch at question ${index + 1}`)
  question.explanation = explanation
  curated[id] = explanation
}

fs.writeFileSync(masterPath, JSON.stringify(exams, null, 2) + '\n')
fs.writeFileSync(curatedPath, JSON.stringify(curated, null, 2) + '\n')
fs.writeFileSync(
  reportPath,
  JSON.stringify(
    {
      examId: exam.id,
      reviewedOn: '2026-09-27',
      scope:
        'Rewrite explanations for vocabulary reading questions 1–8 with Vietnamese translations, correct kanji readings, and choice-by-choice distractor contrasts. The existing answer key was checked against an independent third-party answer transcription and preserved.',
      sources: {
        examTranscript: { url: examSource, sourceType: 'third-party transcription; not an official JLPT publication' },
        answerKey: {
          url: answerSource,
          sourceType: 'independent third-party answer transcription; official status not established',
        },
      },
      questions: Object.entries(explanations).map(([questionId, explanation], index) => ({
        questionId,
        number: index + 1,
        answer: answerKey[index],
        answerPreserved: true,
        includesTranslation: explanation.includes('Dịch:'),
        explainsAllChoices: [1, 2, 3, 4].every((option) => explanation.includes(`\n${option}. `)),
        explanation,
      })),
    },
    null,
    2
  ) + '\n'
)

console.log('Reviewed 8 JLPT N3 12/2012 kanji-reading explanations; checked and preserved answer keys.')
