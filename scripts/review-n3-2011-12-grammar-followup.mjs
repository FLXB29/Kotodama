import fs from 'node:fs'
import path from 'node:path'
import prettier from 'prettier'

const masterPath = 'data/jlpt_n3_toan_master.json'
const curatedPath = 'data/jlpt_n3_explanations_curated.json'
const reportPath = 'reports/n3-quality-audit/grammar-2011-12-followup.json'
const examId = 'toan-n3-201112-full'
const apply = process.argv.includes('--apply')
const formatJson = async (file, value) =>
  prettier.format(JSON.stringify(value), { ...(await prettier.resolveConfig(file)), filepath: file })

const sourceBefore = '小学校に入学したことからは、だんだん風を引いたり'
const sourceAfter = '小学校に入学したころからは、だんだん風邪を引いたり'
const q50Explanation = [
  'Đáp án 4 (mảnh ở ô ★) — câu hoàn chỉnh: 「この美術館には、19世紀の画家たちによって描かれた絵がたくさんあります。」',
  'Dịch: “Trong bảo tàng mỹ thuật này có nhiều bức tranh do các họa sĩ thế kỷ 19 vẽ.”',
  'Thứ tự ghép là 2 → 1 → 4 → 3: 「画家たちに」＋「よって」＋「描かれた」＋「絵が」. Ô ★ nằm ở vị trí thứ ba, nên đáp án tại ô sao là 「描かれた」, lựa chọn 4.',
  '1. よって: nối với 画家たちに thành 「画家たちによって」, cụm nêu tác giả trong câu bị động; không đứng đúng tại ô ★.',
  '2. 画家たちに: phải đứng trước よって để tạo cụm 「画家たちによって」 (“do các họa sĩ…”).',
  '3. 絵が: là chủ ngữ “những bức tranh”, đứng ngay trước たくさんあります; không thể đứng ở ô sao trước phần bổ nghĩa 描かれた.',
  '4. 描かれた: dạng bị động “được vẽ”, bổ nghĩa cho 絵; đây là mảnh thứ ba trong câu hoàn chỉnh và điền vào ô ★.',
  'Ghi nhớ: 「人によって描かれた絵」= bức tranh được người đó vẽ; thứ tự trong câu là cụm tác giả → phần bổ nghĩa bị động → danh từ 絵が.',
].join('\n')

const master = JSON.parse(fs.readFileSync(masterPath, 'utf8'))
const curated = JSON.parse(fs.readFileSync(curatedPath, 'utf8'))
const exam = master.find((entry) => entry.id === examId)
if (!exam) throw new Error('Missing exam ' + examId + '.')
const questions = exam.parts.flatMap((part) => part.questions || [])
const q48 = questions.find((question) => Number(question.number) === 48)
const q50 = questions.find((question) => Number(question.number) === 50)
if (!q48 || !q50) throw new Error('Missing grammar question 48 or 50.')
if (Number(q48.correctAnswer ?? q48.answer) !== 2 || Number(q50.correctAnswer ?? q50.answer) !== 4) {
  throw new Error('A stored answer key changed; review before applying.')
}

for (const field of ['question', 'sentence']) {
  const text = String(q48[field] || '')
  if (!text.includes(sourceBefore) && !text.includes(sourceAfter)) {
    throw new Error('Unexpected question 48 source text in ' + field + '; review manually before applying.')
  }
  q48[field] = text.replace(sourceBefore, sourceAfter)
}

if (
  q50.starPrompt?.before !== 'この美術館には、19 世紀の' ||
  q50.starPrompt?.after !== 'たくさんあります。' ||
  JSON.stringify(q50.starCorrectOrder) !== JSON.stringify([2, 1, 4, 3]) ||
  q50.starOrderVerified !== true ||
  q50.starPosition !== 2 ||
  q50.starPositionVerified !== true
) {
  throw new Error('Question 50 star source/order metadata is unexpected; review before applying.')
}
q50.explanation = q50Explanation
curated[q50.id] = q50Explanation

const report = {
  generatedAt: new Date().toISOString(),
  examId,
  sourceUrl: 'https://www.scribd.com/document/1022846440/2-N3-12-2011',
  officialAnswerKeyConfirmed: false,
  answerKeysChanged: 0,
  rows: [
    {
      number: 48,
      type: 'source-transcription-correction',
      correctedFields: ['question', 'sentence'],
      correction:
        '小学校に入学したことからは、だんだん風を引いたり → 小学校に入学したころからは、だんだん風邪を引いたり',
      answer: 2,
      answerKeyChanged: false,
      evidence: 'Compared the prompt with the accessible exam copy; it reads 入学したころからは and 風邪を引いたり.',
    },
    {
      number: 50,
      type: 'star-order-explanation',
      answer: 4,
      correctOrder: [2, 1, 4, 3],
      starPosition: 3,
      starChoice: 4,
      fullSentence: 'この美術館には、19世紀の画家たちによって描かれた絵がたくさんあります。',
      allFourChoicesExplained: true,
      translated: true,
      answerKeyChanged: false,
    },
  ],
}

if (apply) {
  fs.writeFileSync(masterPath, await formatJson(masterPath, master))
  fs.writeFileSync(curatedPath, await formatJson(curatedPath, curated))
  fs.mkdirSync(path.dirname(reportPath), { recursive: true })
  fs.writeFileSync(reportPath, await formatJson(reportPath, report))
}

console.log(
  JSON.stringify(
    { mode: apply ? 'applied' : 'dry-run', examId, rows: report.rows.length, answerKeysChanged: 0 },
    null,
    2
  )
)
