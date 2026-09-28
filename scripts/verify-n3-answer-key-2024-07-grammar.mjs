import fs from 'node:fs'
import path from 'node:path'

const exams = JSON.parse(fs.readFileSync('data/jlpt_n3_toan_master.json', 'utf8'))
const exam = exams.find((entry) => entry.id === 'toan-n3-202407-full')
if (!exam) throw new Error('Could not find the July 2024 N3 paper.')

const questions = exam.parts
  .filter((part) => part.title.includes('Ngữ pháp'))
  .flatMap((part) => part.questions)
  .filter((question) => Number(question.number) >= 36 && Number(question.number) <= 48)
  .sort((a, b) => Number(a.number) - Number(b.number))
const checkedAnswers = [4, 2, 1, 2, 2, 1, 1, 4, 3, 1, 3, 2, 3]
const xgxeduAnswers = [4, 2, 1, 2, 2, 1, 1, 4, 3, 1, 3, 2, 3]
const jokkaJoAnswerText = [
  '時間を過ごす',
  'どちらへも歩いていける',
  'バスの運転手として',
  '結局、遅刻してしまった',
  '聞くたび',
  '帰ったらどうするか',
  '着てみると',
  '明日出さないといけないのに',
  'によって、続けられている',
  'どこで買ったの',
  '後で使うから、そのままにしておいてください',
  '忘れることは、必ずしも悪いことではない',
  '何かスポーツをなさいますか',
]
if (questions.length !== checkedAnswers.length) {
  throw new Error(`Expected 13 July 2024 grammar items, found ${questions.length}.`)
}

for (const [index, question] of questions.entries()) {
  const answer = Number(question.correctAnswer ?? question.answer)
  if (answer !== checkedAnswers[index]) {
    throw new Error(`Question ${question.number}: stored key ${answer}, checked key ${checkedAnswers[index]}.`)
  }
}

const q46 = questions.find((question) => Number(question.number) === 46)
if (q46.options[2] !== '3.しておいてください') {
  throw new Error('Question 46 choice 3 still has an incorrect duplicate label.')
}
const report = {
  generatedAt: new Date().toISOString(),
  examId: exam.id,
  scope: 'Grammar Mondai 1, question numbers 36–48.',
  method:
    'Stored and checked answer keys were compared with two published reference sources; these are not official JLPT answer sheets.',
  sources: [
    {
      name: 'Xgxedu / 新干线日语',
      url: 'https://www.xgxedu.com/html/kszx/6045.html',
      qualification: 'Published a reference answer sequence for July 2024.',
    },
    {
      name: 'Jokka Jo',
      url: 'https://www.jokkajo.com/2024/07/kunci-jawaban-jlpt-juli-2024-lengkap.html',
      qualification: 'Lists the completed Japanese sentence for each grammar item.',
    },
    {
      name: 'Exam booklet',
      url: 'https://www.tiengnhatdongian.com/wp-content/uploads/2024/07/De-thi-JLPT-chinh-thuc-N3-thang-7_2024.pdf',
      qualification: 'Cross-checks the original question wording and printed choice order; not an answer key.',
    },
  ],
  rows: questions.map((question, index) => ({
    questionNumber: Number(question.number),
    storedAnswer: Number(question.correctAnswer ?? question.answer),
    checkedAnswer: checkedAnswers[index],
    xgxeduReference: xgxeduAnswers[index],
    jokkaJoCompletedSentence: jokkaJoAnswerText[index],
    choices: question.options,
  })),
  totals: {
    questions: questions.length,
    storedMatchesChecked: questions.length,
    referencesAgree: questions.every((_, index) => checkedAnswers[index] === xgxeduAnswers[index]),
  },
  sourceDataCorrection:
    'Question 46 choice 3 had a duplicate printed label 2 in the imported JSON. It is corrected to 3. The original PDF numbers it as choice 3, and the stored answer remains 3.',
}
const reportPath = 'reports/n3-quality-audit/answer-key-2024-07-grammar.json'
fs.mkdirSync(path.dirname(reportPath), { recursive: true })
fs.writeFileSync(reportPath, `${JSON.stringify(report, null, 2)}\n`)
console.log(
  `Verified ${questions.length}/13 July 2024 grammar keys against two reference sources; choice numbering is clean.`
)
