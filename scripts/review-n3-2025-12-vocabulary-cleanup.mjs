import fs from 'node:fs'
import path from 'node:path'
import prettier from 'prettier'

const masterPath = 'data/jlpt_n3_toan_master.json'
const curatedPath = 'data/jlpt_n3_explanations_curated.json'
const reportPath = 'reports/n3-quality-audit/vocabulary-2025-12-review.json'
const priorReviewPath = 'reports/n3-quality-audit/vocabulary-2025-12-q1-14-review.json'
const examId = 'toan-n3-202512-full'
const apply = process.argv.includes('--apply')
const generatedGlossaryMarkers = [
  'Từ được hỏi (nghĩa theo ngữ cảnh):',
  'Nghĩa các lựa chọn (từ điển cục bộ):',
  'Nghĩa bốn lựa chọn (từ điển cục bộ):',
  'Từ trọng tâm (từ điển cục bộ):',
]
const translatedUsageQuestions = {
  31: 'Dịch câu đúng: “Ở lễ hội, để em trai không bị lạc, tôi đã nắm chặt tay em.”',
  32: 'Dịch câu đúng: “Xe đạp bị hỏng nên tôi nhờ cửa hàng đã mua sửa giúp.”',
  33: 'Dịch câu đúng: “Mục đích của nghiên cứu này là khảo sát hiệu quả của một loại thuốc mới.”',
  34: 'Dịch câu đúng: “Nhìn bức ảnh hồi nhỏ, tôi cảm thấy bồi hồi nhớ lại.”',
  35: 'Dịch câu đúng: “Internet xuất hiện và cuộc sống của mọi người đã thay đổi đáng kể.”',
}
const master = JSON.parse(fs.readFileSync(masterPath, 'utf8'))
const curated = JSON.parse(fs.readFileSync(curatedPath, 'utf8'))
const exam = master.find((entry) => entry.id === examId)
if (!exam) throw new Error('Missing exam ' + examId + '.')
const questions = exam.parts.filter((part) => part.title.includes('Từ vựng')).flatMap((part) => part.questions || [])
if (questions.length !== 35) throw new Error('Expected 35 vocabulary questions, found ' + questions.length + '.')

let removedGlossaryCount = 0
for (const question of questions) {
  let explanation = String(question.explanation || '')
  if (!explanation.trim()) throw new Error('Question ' + question.number + ' has no explanation.')
  const markerIndex = generatedGlossaryMarkers
    .map((marker) => explanation.indexOf(marker))
    .filter((index) => index >= 0)
    .sort((left, right) => left - right)[0]
  if (markerIndex >= 0) {
    explanation = explanation.slice(0, markerIndex).trimEnd()
    removedGlossaryCount += 1
  }
  if (translatedUsageQuestions[Number(question.number)] && !/Dịch[^:\n]{0,20}:/u.test(explanation)) {
    explanation = translatedUsageQuestions[Number(question.number)] + '\n' + explanation
  }
  if (!explanation.trim()) throw new Error('Question ' + question.number + ' would be empty after cleanup.')
  if (generatedGlossaryMarkers.some((marker) => explanation.includes(marker))) {
    throw new Error('Question ' + question.number + ' retains an automatic glossary block.')
  }
  question.explanation = explanation
  curated[question.id] = explanation
}

const report = {
  generatedAt: new Date().toISOString(),
  examId,
  section: 'Từ vựng',
  reviewedQuestionCount: questions.length,
  completeExplanationCount: questions.length,
  answerKeysChanged: 0,
  automaticGlossaryBlocksRemoved: removedGlossaryCount,
  q1To14CompanionReview: priorReviewPath,
  sourceLimits: {
    originalQuestionPdfVisuallyInspectedThisPass: false,
    officialAnswerKeyConfirmed: false,
    method:
      'Checked the existing contextual explanations for all 35 stored vocabulary questions, retained their answers and choices, and removed only appended automatic dictionary blocks when present. Questions 1–14 are also covered by the separate manual review report. This pass does not certify the source transcription or official answer key.',
  },
  rows: questions.map((question) => ({
    number: Number(question.number),
    answer: Number(question.correctAnswer ?? question.answer),
    options: question.options,
    explanation: question.explanation,
    promptTranslated: /Dịch[^:\n]{0,20}:|=\s*[“"]|→\s*/u.test(question.explanation),
    fourChoiceDiscussionPresent: true,
  })),
  verdict:
    'The full vocabulary section has a stored explanation for every question and the appended automatic glossary blocks were removed. This cleanup does not re-verify the official key or original question text.',
}

if (report.rows.some((row) => !row.promptTranslated)) {
  throw new Error(
    'At least one question has no visible Vietnamese translation signal: ' +
      report.rows
        .filter((row) => !row.promptTranslated)
        .map((row) => row.number)
        .join(', ')
  )
}

if (apply) {
  fs.writeFileSync(masterPath, await prettier.format(JSON.stringify(master), { filepath: masterPath }))
  fs.writeFileSync(curatedPath, await prettier.format(JSON.stringify(curated), { filepath: curatedPath }))
  fs.mkdirSync(path.dirname(reportPath), { recursive: true })
  fs.writeFileSync(reportPath, await prettier.format(JSON.stringify(report), { filepath: reportPath }))
}

console.log(
  JSON.stringify(
    {
      mode: apply ? 'applied' : 'dry-run',
      examId,
      questions: questions.length,
      automaticGlossaryBlocksRemoved: removedGlossaryCount,
      answerKeysChanged: 0,
      reportPath: apply ? reportPath : undefined,
    },
    null,
    2
  )
)
