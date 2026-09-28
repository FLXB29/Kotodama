import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'

const examPath = path.resolve('data/jlpt_n3_toan_master.json')
const fullMasterPath = path.resolve('data/jlpt_full_master.json')
const curatedPath = path.resolve('data/jlpt_n3_explanations_curated.json')
const reportPath = path.resolve('reports/n3-quality-audit/star-source-2021-07-review.json')
const examId = 'toan-n3-202107-full'
const sourceUrl = 'https://drive.google.com/file/d/1X0FHPocIsW2BxwmhRuBjKr3Cr8CWu98V/view#page=5'
const answerKeyUrl = 'https://drive.google.com/file/d/1Lmr3LwhnS3lEv4FYemiM0f93Qg5DLNZL/view#page=22'
const expected = [
  {
    printedQuestion: 14,
    id: 'toan_q_2021_07_49',
    options: ['1 会ってみたい', '2 いい', '3 で', '4 から'],
    order: [3, 2, 4, 1],
    answer: 2,
    position: 1,
    text: 'いい',
    sentence: '先生「みなさんは、一度でいいから会ってみたいと思う人はいますか。」',
    translation: 'Có ai mà các em muốn gặp dù chỉ một lần không?',
    why: 'Ô ★ đứng sau 「で」 và trước 「から」. 「いい」 tạo cụm cố định 「一度でいいから」. 「会ってみたい」 là hành động theo sau 「から」; đặt tại ★ sẽ đảo sai cụm. 「で」 sẽ lặp tiểu từ, còn 「から」 đặt trước mảnh 「いい」 không tạo thành cụm tự nhiên.',
  },
  {
    printedQuestion: 15,
    id: 'toan_q_2021_07_50',
    options: ['1 という', '2 何', '3 か', '4 魚'],
    order: [2, 1, 4, 3],
    answer: 4,
    position: 2,
    text: '魚',
    sentence: 'おいしかったです。何という魚かわかりませんが、お刺身がおいしかったです。',
    translation: 'Ngon lắm ạ. Tôi không biết đó là cá gì, nhưng món sashimi rất ngon.',
    why: '「何という」 đứng trước ô ★, còn 「か」 theo sau và khép câu hỏi gián tiếp 「何という魚か」. Vì vậy ★ phải là 「魚」. 「何」 đảo vị trí với 「という」; 「という」 sẽ lặp lại từ ngay trước ô; 「か」 sẽ tạo 「かか」.',
  },
  {
    printedQuestion: 16,
    id: 'toan_q_2021_07_51',
    options: ['1 選んでいる', '2 写真を', '3 今', '4 ところだ'],
    order: [2, 3, 1, 4],
    answer: 1,
    position: 2,
    text: '選んでいる',
    sentence: '送る写真を今選んでいるところだから、もう少し待って。',
    translation: 'Mình đang chọn ảnh để gửi đây, đợi thêm một chút nhé.',
    why: '「今」 đứng ngay trước ô ★ và 「ところだ」 theo sau, nên động từ đang diễn ra 「選んでいる」 nối đúng hai phần thành 「今選んでいるところだ」. 「写真を」 phải đi sau 「送る」; 「今」 đã nằm trước ô; 「ところだ」 phải theo sau động từ chứ không thể đứng trước nó.',
  },
  {
    printedQuestion: 17,
    id: 'toan_q_2021_07_52',
    options: ['1 苦手で', '2 料理は', '3 作れる', '4 レシピを見ずに'],
    order: [1, 4, 3, 2],
    answer: 3,
    position: 2,
    text: '作れる',
    sentence: '私は料理が苦手で、レシピを見ずに作れる料理はほとんどない。',
    translation: 'Tôi nấu ăn không giỏi, nên hầu như chẳng có món nào tôi làm được mà không xem công thức.',
    why: '「レシピを見ずに」 đứng trước ô ★ và 「料理は」 đứng sau. 「作れる」 tạo mệnh đề bổ nghĩa cho danh từ 「料理」: 「レシピを見ずに作れる料理」. 「苦手で」 thuộc đầu câu; 「料理は」 sẽ lặp danh từ ở ngay sau ô; 「レシピを見ずに」 cần một động từ theo sau để câu hoàn chỉnh.',
  },
  {
    printedQuestion: 18,
    id: 'toan_q_2021_07_53',
    options: ['1 形に', '2 見えることから', '3 人の耳のような', '4 見ると'],
    order: [4, 3, 1, 2],
    answer: 1,
    position: 2,
    text: '形に',
    sentence: 'この島は、空から見ると人の耳のような形に見えることから「耳島」と呼ばれています。',
    translation: 'Nhìn từ trên cao, hòn đảo này trông có hình giống tai người, nên được gọi là “Đảo Tai”.',
    why: '「人の耳のような」 là cụm bổ nghĩa cho danh từ 「形」, còn 「見えることから」 đứng sau để nêu lý do đặt tên. 「形に」 nối hai phần thành 「人の耳のような形に見える」. 「見ると」 phải ở đầu cụm; 「人の耳のような」 cần danh từ theo sau; 「見えることから」 đã nằm sau ô ★ nên đặt lại ở ★ sẽ lặp vị ngữ và đảo quan hệ.',
  },
]

const normalize = (value) =>
  String(value || '')
    .normalize('NFKC')
    .replace(/^\s*[1-4][.．、\s　]*/u, '')
    .replace(/\s+/gu, '')
    .trim()
const exams = JSON.parse(fs.readFileSync(examPath, 'utf8'))
const fullMaster = JSON.parse(fs.readFileSync(fullMasterPath, 'utf8'))
const curated = JSON.parse(fs.readFileSync(curatedPath, 'utf8'))
const exam = exams.find((item) => item.id === examId)
assert.ok(exam, `Could not find ${examId}`)
const grammarPart = exam.parts.find((part) => part.title.includes('Ngữ pháp') && part.title.includes('Mondai 2'))
assert.ok(grammarPart, 'Could not find the star-order grammar part')
const fullExam = fullMaster.find((item) => item.title === 'JLPT-N3 07 2021 - Ngữ Pháp & Đọc Hiểu (文法・読解)')
assert.ok(fullExam, 'Could not find the 07/2021 standalone full exam')
const fullGrammarPart = fullExam.parts.find((part) => part.title === 'Mondai 2')
assert.ok(fullGrammarPart, 'Could not find the standalone star-order grammar part')

const reportQuestions = expected.map((item) => {
  const question = grammarPart.questions.find((entry) => entry.id === item.id)
  const fullQuestion = fullGrammarPart.questions.find((entry) => entry.number === question?.number)
  assert.ok(question, `Could not find ${item.id}`)
  assert.ok(fullQuestion, `Could not find standalone printed question ${item.printedQuestion}`)
  const actualOptions = (question.options || []).map(normalize)
  assert.deepEqual(actualOptions, item.options.map(normalize), `Question ${item.printedQuestion} options differ from the visually checked source`)
  assert.deepEqual(question.starCorrectOrder, item.order, `Question ${item.printedQuestion} stored fragment order changed`)
  assert.equal(Number(question.correctAnswer ?? question.answer), item.answer, `Question ${item.printedQuestion} stored answer changed`)
  assert.equal(Number(question.starPosition), item.position, `Question ${item.printedQuestion} stored ★ position changed`)

  const explanation = [
    `Câu hoàn chỉnh: 「${item.sentence}」`,
    `Dịch: “${item.translation}”`,
    `Thứ tự mảnh: ${item.order.join(' → ')}; ô ★ ở vị trí thứ ${item.position + 1} nhận 「${item.text}」, lựa chọn ${item.answer}.`,
    item.why,
  ].join('\n')

  question.explanation = explanation
  question.starOrderVerified = true
  question.starPositionVerified = true
  question.starVerificationStatus = 'verified-against-source'
  question.starVerificationSources = [...new Set([sourceUrl, ...(question.starVerificationSources || []), answerKeyUrl])]
  question.starVerificationNote =
    'Visually checked all four printed fragments and the ★ slot against page 5 of the supplied July 2021 exam PDF in Google Drive. The stored order forms the printed sentence and places the stored answer in the printed ★ slot. The supplied answer-key compilation on viewer page 22 agrees, but is secondary and has not been authenticated as an official JLPT key.'
  question.starAnswerKeyConflict = null

  fullQuestion.explanation = explanation
  curated[item.id] = explanation

  return {
    printedQuestion: item.printedQuestion,
    fullExamQuestionId: question.id,
    standaloneQuestionId: fullQuestion.id,
    printedOptions: item.options,
    appData: {
      options: question.options,
      answer: Number(question.correctAnswer ?? question.answer),
      order: question.starCorrectOrder,
      starPosition: question.starPosition,
    },
    completedSentence: item.sentence,
    vietnameseTranslation: item.translation,
    starSlotReasoning: item.why,
    status: 'verified-against-supplied-source',
    officialKeyEstablished: false,
  }
})

const report = {
  exam: 'JLPT N3 07/2021',
  sourcePdf: {
    title: '12. N3 7-2021.pdf',
    driveFileId: '1X0FHPocIsW2BxwmhRuBjKr3Cr8CWu98V',
    renderedPage: 5,
    method: 'Visually checked all five ★ questions on the rendered PDF page and cross-checked the page text layer.',
  },
  questions: reportQuestions,
  secondaryAnswerKey: {
    title: 'ĐÁP ÁN JLPT N3 (update 26.6.2026).pdf',
    driveFileId: '1Lmr3LwhnS3lEv4FYemiM0f93Qg5DLNZL',
    viewerPage: 22,
    section: 'JLPT N3 7/2021 — 文法・問題2',
    printedQuestions: [14, 15, 16, 17, 18],
    answers: expected.map((item) => item.answer),
    matchesStoredAnswers: true,
    authority: 'Secondary answer compilation in the supplied Drive; not authenticated as an official JLPT key.',
  },
  summary:
    'All five option sets and printed ★ slots match the supplied exam PDF. The stored orders form grammatical sentences and put the stored answers in the ★ slots. The answer row on viewer page 22 of the supplied secondary answer compilation agrees (2–4–1–3–1); it is not treated as an official JLPT key.',
  officialKeyEstablished: false,
}

fs.mkdirSync(path.dirname(reportPath), { recursive: true })
fs.writeFileSync(examPath, `${JSON.stringify(exams, null, 2)}\n`, 'utf8')
fs.writeFileSync(fullMasterPath, `${JSON.stringify(fullMaster, null, 2)}\n`, 'utf8')
fs.writeFileSync(curatedPath, `${JSON.stringify(curated, null, 2)}\n`, 'utf8')
fs.writeFileSync(reportPath, `${JSON.stringify(report, null, 2)}\n`, 'utf8')
console.log(`Verified printed questions 14–18 against ${sourceUrl}`)
