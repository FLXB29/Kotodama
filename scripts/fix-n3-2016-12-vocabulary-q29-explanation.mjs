import fs from 'node:fs'
import path from 'node:path'

const masterPath = path.resolve('data/jlpt_n3_toan_master.json')
const curatedPath = path.resolve('data/jlpt_n3_explanations_curated.json')
const reportPath = path.resolve('reports/n3-quality-audit/vocabulary-source-2016-12-q29-review.json')
const exams = JSON.parse(fs.readFileSync(masterPath, 'utf8'))
const curated = JSON.parse(fs.readFileSync(curatedPath, 'utf8'))
const exam = exams.find((item) => item.id === 'toan-n3-201612-full')
if (!exam) throw new Error('Could not find N3 December 2016 full exam.')
const question = exam.parts.flatMap((part) => part.questions || []).find((item) => item.id === 'toan_q_2016_12_29')
if (!question) throw new Error('Could not find December 2016 vocabulary question 29.')
const options = question.options.map((option) =>
  String(option)
    .replace(/^\s*[1-4][.．、\s　]*/u, '')
    .trim()
)
if (
  Number(question.correctAnswer ?? question.answer) !== 1 ||
  options.join('|') !== '多すぎて残りました|少し足りませんでした|とてもおいしかったです|そんなにおいしくなかったです' ||
  !String(question.sentence || question.question).includes('パーティーの料理が')
) {
  throw new Error('Unexpected December 2016 vocabulary question 29; refusing to change its explanation.')
}

const explanation = `Đáp án 1. 「あまる」nghĩa là còn thừa, dư lại.
Câu 「パーティーの料理があまりました。」dịch là: “Món ăn trong bữa tiệc còn thừa lại.”
1. 「多すぎて残りました」— quá nhiều nên còn lại; cùng nghĩa với câu hỏi.
2. 「少し足りませんでした」— hơi thiếu; trái nghĩa với “còn thừa”.
3. 「とてもおいしかったです」— rất ngon; nhận xét về hương vị, không nói còn dư.
4. 「そんなにおいしくなかったです」— không ngon đến thế; cũng chỉ nhận xét về hương vị.
Ghi nhớ: 「料理があまる」nói thức ăn còn dư sau khi dùng.`

question.explanation = explanation
curated[question.id] = explanation
fs.writeFileSync(masterPath, `${JSON.stringify(exams, null, 2)}\n`, 'utf8')
fs.writeFileSync(curatedPath, `${JSON.stringify(curated, null, 2)}\n`, 'utf8')

const report = {
  generatedAt: new Date().toISOString(),
  examId: exam.id,
  questionId: question.id,
  fullExamQuestionNumber: 29,
  printedQuestionNumber: 29,
  sourcePdf: {
    driveFile: '7. N3 12-2016.pdf',
    printedPage: 3,
    promptAndOptionsObserved: true,
    prompt: 'パーティーの料理があまりました。',
    options,
  },
  answer: 1,
  reasoning:
    'あまる means food or another amount remains unused. Choice 1 says too much remained; choice 2 says a little was insufficient, while 3 and 4 only evaluate taste.',
  officialAnswerKeyPresent: false,
  explanationChecks: {
    vietnameseTranslation: true,
    everyOptionExplainedInContext: true,
    unrelatedDictionaryMatchesRemoved: true,
  },
}
fs.mkdirSync(path.dirname(reportPath), { recursive: true })
fs.writeFileSync(reportPath, `${JSON.stringify(report, null, 2)}\n`, 'utf8')
console.log(
  'Replaced the malformed local-dictionary explanation for December 2016 vocabulary question 29 with a concise context-accurate explanation for all four options.'
)
