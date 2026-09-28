import fs from 'node:fs'
import path from 'node:path'

const masterPath = path.resolve('data/jlpt_n3_toan_master.json')
const curatedPath = path.resolve('data/jlpt_n3_explanations_curated.json')
const reportPath = path.resolve('reports/n3-quality-audit/vocabulary-source-2016-12-q26-q28-q30-review.json')
const exams = JSON.parse(fs.readFileSync(masterPath, 'utf8'))
const curated = JSON.parse(fs.readFileSync(curatedPath, 'utf8'))
const exam = exams.find((item) => item.id === 'toan-n3-201612-full')
if (!exam) throw new Error('Could not find N3 December 2016 full exam.')

const edits = [
  {
    id: 'toan_q_2016_12_26',
    answer: 4,
    options: ['止まって', '揺れて', '汚れて', '光って'],
    explanation: `Đáp án 4. 「かがやく」nghĩa là tỏa sáng, lấp lánh; 「光る」gần nghĩa nhất.
Câu 「水の表面がかがやいています。」dịch là: “Mặt nước đang lấp lánh.”
1. 「止まって」— dừng lại; không nói về ánh sáng.
2. 「揺れて」— lay động, rung; diễn tả chuyển động.
3. 「汚れて」— bị bẩn; trái với hình ảnh mặt nước sáng trong.
4. 「光って」— phát sáng, lấp lánh; đúng với 「かがやく」.`,
  },
  {
    id: 'toan_q_2016_12_27',
    answer: 1,
    options: ['残念だと思った', 'うれしかった', '驚いた', '安心した'],
    explanation: `Đáp án 1. 「がっかりした」nghĩa là thất vọng; 「残念だと思った」diễn đạt gần nghĩa nhất.
Câu 「その知らせを聞いたとき、わたしはとてもがっかりした。」dịch là: “Khi nghe tin đó, tôi rất thất vọng.”
1. 「残念だと思った」— cảm thấy đáng tiếc/thất vọng; phù hợp.
2. 「うれしかった」— vui mừng; cảm xúc trái ngược.
3. 「驚いた」— ngạc nhiên; phản ứng khác với thất vọng.
4. 「安心した」— yên tâm; cảm xúc khác với thất vọng.`,
  },
  {
    id: 'toan_q_2016_12_28',
    answer: 3,
    options: ['いろいろ', '少し', 'もちろん', 'いつも'],
    explanation: `Đáp án 3. 「当然」ở đây có nghĩa là đương nhiên/tất nhiên, gần với 「もちろん」.
Câu 「留学生活に不安は当然ありました。」dịch là: “Trong cuộc sống du học, tất nhiên tôi đã có những nỗi lo.”
1. 「いろいろ」— nhiều loại, đủ thứ; không có nghĩa “tất nhiên”.
2. 「少し」— một chút; chỉ mức độ, không diễn tả điều hiển nhiên.
3. 「もちろん」— dĩ nhiên, tất nhiên; phù hợp với 「当然」.
4. 「いつも」— luôn luôn; nói tần suất, không nói điều đương nhiên.`,
  },
  {
    id: 'toan_q_2016_12_30',
    answer: 2,
    options: ['座ってはいけません', '渡ってはいけません', '走ってはいけません', '入ってはいけません'],
    explanation: `Đáp án 2. 「横断禁止」là cấm băng qua; 「渡ってはいけません」có cùng ý.
Câu 「ここは横断禁止です。」dịch là: “Ở đây cấm băng qua.”
1. 「座ってはいけません」— không được ngồi; sai hành động.
2. 「渡ってはいけません」— không được băng qua; đúng nội dung biển báo.
3. 「走ってはいけません」— không được chạy; không nói về việc băng qua.
4. 「入ってはいけません」— không được đi vào; cấm vào khác với cấm băng qua.`,
  },
]

for (const edit of edits) {
  const question = exam.parts.flatMap((part) => part.questions || []).find((item) => item.id === edit.id)
  if (!question) throw new Error(`Could not find ${edit.id}.`)
  const options = question.options.map((option) =>
    String(option)
      .replace(/^\s*[1-4][.．、\s　]*/u, '')
      .trim()
  )
  if (
    Number(question.correctAnswer ?? question.answer) !== edit.answer ||
    options.join('|') !== edit.options.join('|')
  ) {
    throw new Error(`Unexpected answer or source options for ${edit.id}; refusing to replace its explanation.`)
  }
  question.explanation = edit.explanation
  curated[edit.id] = edit.explanation
}

fs.writeFileSync(masterPath, `${JSON.stringify(exams, null, 2)}\n`, 'utf8')
fs.writeFileSync(curatedPath, `${JSON.stringify(curated, null, 2)}\n`, 'utf8')

const report = {
  generatedAt: new Date().toISOString(),
  examId: exam.id,
  sourcePdf: {
    driveFile: '7. N3 12-2016.pdf',
    printedPage: 3,
    promptsAndOptionsObserved: true,
    officialAnswerKeyPresent: false,
  },
  questions: edits.map((edit) => {
    const question = exam.parts.flatMap((part) => part.questions || []).find((item) => item.id === edit.id)
    return {
      id: edit.id,
      printedQuestionNumber: question.number,
      answer: edit.answer,
      prompt: String(question.sentence || question.question)
        .replace(/<[^>]*>/g, ' ')
        .replace(/\s+/gu, ' ')
        .trim(),
      options: edit.options,
      explanationChecks: { sentenceTranslated: true, eachOptionTranslatedInContext: true },
    }
  }),
  limitation:
    'The exam PDF does not include an official answer key; keys here are interpreted from the vocabulary meaning and source options.',
}
fs.mkdirSync(path.dirname(reportPath), { recursive: true })
fs.writeFileSync(reportPath, `${JSON.stringify(report, null, 2)}\n`, 'utf8')
console.log(
  'Rewrote contextual explanations for December 2016 vocabulary questions 26–28 and 30, translating every option.'
)
