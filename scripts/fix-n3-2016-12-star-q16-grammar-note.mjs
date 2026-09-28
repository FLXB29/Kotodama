import fs from 'node:fs'
import path from 'node:path'

const masterPath = path.resolve('data/jlpt_n3_toan_master.json')
const curatedPath = path.resolve('data/jlpt_n3_explanations_curated.json')
const reportPath = path.resolve('reports/n3-quality-audit/grammar-source-2016-12-q16-review.json')
const exams = JSON.parse(fs.readFileSync(masterPath, 'utf8'))
const curated = JSON.parse(fs.readFileSync(curatedPath, 'utf8'))
const exam = exams.find((item) => item.id === 'toan-n3-201612-full')
if (!exam) throw new Error('Could not find N3 December 2016 full exam.')
const question = exam.parts.flatMap((part) => part.questions || []).find((item) => item.id === 'toan_q_2016_12_51')
if (!question) throw new Error('Could not find December 2016 star question 16.')

const normalizedOptions = question.options?.map((option) =>
  String(option).replace(/^\s*[1-4][.．、\s　]*/u, '').trim()
)
if (
  Number(question.correctAnswer) !== 2 ||
  normalizedOptions?.join('|') !== 'のが|という|家で過ごす|どこにも出かけずに' ||
  JSON.stringify(question.starCorrectOrder) !== JSON.stringify([4, 3, 2, 1]) ||
  question.starPrompt?.before !== '土曜日は買い物をしたり友人と食事をしたりし、日曜日は' ||
  question.starPrompt?.after !== '、私の好きな 週末の過ごし方だ。'
) {
  throw new Error('Unexpected December 2016 star question 16; refusing to change its explanation.')
}

const explanation = `Đáp án 2 là mảnh 「という」 ở ô ★; thứ tự ghép đúng là 4 → 3 → 2 → 1.
Câu hoàn chỉnh: 「土曜日は買い物をしたり友人と食事をしたりし、日曜日はどこにも出かけずに家で過ごすというのが、私の好きな週末の過ごし方だ。」
Dịch: “Thứ Bảy tôi làm những việc như đi mua sắm và ăn cùng bạn bè; Chủ nhật tôi ở nhà, không đi đâu cả, và đó là cách tôi thích dành cuối tuần.”
4. どこにも出かけずに = không đi đâu cả; nối với 「家で過ごす」.
3. 家で過ごす = ở nhà; đây là hoạt động được nói đến.
2. という = gói hoạt động vừa nêu thành “việc/cách …”, rồi dẫn vào 「のが」; ở đây không mang nghĩa nghe nói.
1. のが danh hóa cụm đứng trước và đánh dấu nó làm chủ ngữ của 「私の好きな週末の過ごし方だ」.
Ghi nhớ: trong 「Vるというのが好きだ／私の好きなNだ」, 「という」 giới thiệu nội dung hoặc hoạt động được nhắc tới; nghĩa tường thuật “nghe nói” không phù hợp câu này.`

curated[question.id] = explanation
fs.writeFileSync(curatedPath, `${JSON.stringify(curated, null, 2)}\n`, 'utf8')

const report = {
  generatedAt: new Date().toISOString(),
  examId: exam.id,
  questionId: question.id,
  fullExamQuestionNumber: 51,
  sectionQuestionNumber: 16,
  sourcePdf: {
    driveFile: '7. N3 12-2016.pdf',
    printedPage: 5,
    promptAndOptionsObserved: true,
    prompt: '土曜日は買い物をしたり友人と食事をしたりし、日曜日は ★ 、私の好きな 週末の過ごし方だ。',
    options: normalizedOptions,
  },
  answer: { choiceAtStar: 2, order: [4, 3, 2, 1], basis: 'Natural syntax and sentence meaning; the source exam PDF does not contain an official answer key.' },
  officialKeyEstablished: false,
  explanationChecks: {
    completeSentence: true,
    vietnameseTranslation: true,
    orderAndRoleOfEveryPiece: true,
    distinguishesContextualMeaningFromHearsay: true,
  },
}
fs.writeFileSync(reportPath, `${JSON.stringify(report, null, 2)}\n`, 'utf8')
console.log('Corrected the contextual grammar explanation for December 2016 star question 16 and wrote its source-review record.')
