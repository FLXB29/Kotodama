import fs from 'node:fs'
import path from 'node:path'

const exams = JSON.parse(fs.readFileSync('data/jlpt_n3_toan_master.json', 'utf8'))
const exam = exams.find((entry) => entry.id === 'toan-n3-202312-full')
if (!exam) throw new Error('Could not find the December 2023 N3 paper.')

const questions = exam.parts
  .filter((part) => part.title.includes('Ngữ pháp'))
  .flatMap((part) => part.questions)
  .filter((question) => Number(question.number) >= 36 && Number(question.number) <= 48)
  .sort((a, b) => Number(a.number) - Number(b.number))

const editorialAnswers = [4, 3, 2, 3, 1, 2, 1, 4, 4, 2, 3, 3, 1]
const tryNihongoReference = [4, 3, 2, 3, 1, 2, 1, 4, 3, 2, 4, 3, 3]
const xgxeduReference = [4, 3, 2, 3, 1, 2, 1, 4, 3, 2, 4, 3, 3]
const disagreements = {
  44: 'Keep option 4 based on the full sentence: 上手に踊れるようになるのに何年かかる asks how long it takes to become able to dance well. Both reference keys list option 3, which does not complete the duration construction as naturally. Original answer sheet needed.',
  46: 'Keep option 3 based on the question asking which floor the counter is on: 5階でございます is the polite location answer. Both references list option 4, でいらっしゃいます, which honors a person rather than a floor. Original answer sheet needed.',
  48: 'Keep option 1 based on the phone-call context: 電話をしようと思っていたところでした means the speaker was just about to call too. Both references list option 3, which ends in からでした and does not form the natural response. Original answer sheet needed.',
}

if (questions.length !== editorialAnswers.length) {
  throw new Error(`Expected 13 December 2023 grammar items, found ${questions.length}.`)
}

const rows = questions.map((question, index) => {
  const storedAnswer = Number(question.correctAnswer ?? question.answer)
  const row = {
    questionNumber: Number(question.number),
    storedAnswer,
    editorialAnswer: editorialAnswers[index],
    tryNihongoReference: tryNihongoReference[index],
    xgxeduReference: xgxeduReference[index],
    choices: question.options,
    answerMatchesEditorial: storedAnswer === editorialAnswers[index],
    answerMatchesTryNihongo: storedAnswer === tryNihongoReference[index],
    answerMatchesXgxedu: storedAnswer === xgxeduReference[index],
  }
  if (disagreements[row.questionNumber]) row.decision = disagreements[row.questionNumber]
  return row
})

const changed = rows.filter((row) => !row.answerMatchesEditorial)
if (changed.length) {
  throw new Error(`Stored December 2023 answers differ from editorial key at: ${changed.map((row) => row.questionNumber).join(', ')}`)
}

const report = {
  generatedAt: new Date().toISOString(),
  examId: exam.id,
  scope: 'Grammar Mondai 1, question numbers 36–48.',
  method:
    'Compares the manually reviewed key with two published reference keys. Neither reference is an official JLPT answer sheet. Disagreements are recorded and never auto-corrected.',
  sources: [
    {
      name: 'TryNihongo',
      url: 'https://trynihongo.com/ja/dap-an-ky-thi-jlpt-n3-thang-12-nam-2023-p1139',
      qualification: 'Published reference answer sequence; not an official answer sheet.',
    },
    {
      name: 'Xgxedu / 新干线日语',
      url: 'https://www.xgxedu.com/html/kszx/5729.html',
      qualification: 'The page describes answers as reference only.',
    },
    {
      name: 'TryNihongo question text',
      url: 'https://trynihongo.com/ja/ri-ben-yu-neng-li-shi-yan-jlptwen-fa-du-jie-n3-2023nian-12yue-shi-yan-q1346',
      qualification: 'Cross-checks the Japanese sentence context and printed choice order; not an answer key.',
    },
    {
      name: 'Nihongoph',
      url: 'https://www.nihongoph.com/2023/12/jlpt-n3-12-2023-jlpt-n3-actual-previous.html',
      qualification: 'Additional paper and answer-link reference; original answer sheet not independently authenticated.',
    },
  ],
  rows,
  totals: {
    questions: rows.length,
    storedMatchesEditorial: rows.filter((row) => row.answerMatchesEditorial).length,
    storedMatchesTryNihongo: rows.filter((row) => row.answerMatchesTryNihongo).length,
    storedMatchesXgxedu: rows.filter((row) => row.answerMatchesXgxedu).length,
    sourceDisagreements: rows.filter((row) => !row.answerMatchesTryNihongo || !row.answerMatchesXgxedu).length,
  },
}

const reportPath = 'reports/n3-quality-audit/answer-key-2023-12-grammar.json'
fs.mkdirSync(path.dirname(reportPath), { recursive: true })
fs.writeFileSync(reportPath, `${JSON.stringify(report, null, 2)}\n`)
console.log(JSON.stringify({ reportPath, totals: report.totals, disagreements }, null, 2))
