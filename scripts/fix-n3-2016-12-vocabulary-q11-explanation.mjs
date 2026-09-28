import fs from 'node:fs'
import path from 'node:path'

const masterPath = path.resolve('data/jlpt_n3_toan_master.json')
const curatedPath = path.resolve('data/jlpt_n3_explanations_curated.json')
const reportPath = path.resolve('reports/n3-quality-audit/vocabulary-source-2016-12-q11-review.json')
const exams = JSON.parse(fs.readFileSync(masterPath, 'utf8'))
const curated = JSON.parse(fs.readFileSync(curatedPath, 'utf8'))
const exam = exams.find((item) => item.id === 'toan-n3-201612-full')
if (!exam) throw new Error('Could not find N3 December 2016 full exam.')
const question = exam.parts.flatMap((part) => part.questions || []).find((item) => item.id === 'toan_q_2016_12_11')
if (!question) throw new Error('Could not find December 2016 vocabulary question 11.')
const options = question.options.map((option) =>
  String(option)
    .replace(/^\s*[1-4][.．、\s　]*/u, '')
    .trim()
)
if (Number(question.correctAnswer ?? question.answer) !== 3 || options.join('|') !== '満続|万続|満足|万足') {
  throw new Error('Unexpected December 2016 vocabulary question 11; refusing to replace its explanation.')
}

const explanation = `Đáp án 3. 「満足」（まんぞく）nghĩa là hài lòng, thỏa mãn.
Câu 「わたしは今の生活に満足している。」dịch là: “Tôi hài lòng với cuộc sống hiện tại.”
1. 「満続」— dùng nhầm chữ 続 (tiếp tục); cách viết đúng của từ là 満足.
2. 「万続」— hai chữ 万・続 không tạo thành từ まんぞく.
3. 「満足」— đúng cách viết và nghĩa “hài lòng”.
4. 「万足」— dùng nhầm chữ 万; 「足」ở đây không thể thay chữ 満.
Ghi nhớ: 「満足する」= hài lòng, thỏa mãn.`

question.explanation = explanation
curated[question.id] = explanation
fs.writeFileSync(masterPath, `${JSON.stringify(exams, null, 2)}\n`, 'utf8')
fs.writeFileSync(curatedPath, `${JSON.stringify(curated, null, 2)}\n`, 'utf8')

const report = {
  generatedAt: new Date().toISOString(),
  examId: exam.id,
  questionId: question.id,
  printedQuestionNumber: 11,
  sourcePdf: { driveFile: '7. N3 12-2016.pdf', printedPage: 2, promptAndOptionsObserved: true },
  answer: 3,
  explanationChecks: { targetKanji: '満足', vietnameseTranslation: true, allFourSpellingsExplained: true },
  officialAnswerKeyPresent: false,
}
fs.mkdirSync(path.dirname(reportPath), { recursive: true })
fs.writeFileSync(reportPath, `${JSON.stringify(report, null, 2)}\n`, 'utf8')
console.log(
  'Corrected the misleading local-dictionary gloss for December 2016 vocabulary question 11 and clarified the four kanji spellings.'
)
