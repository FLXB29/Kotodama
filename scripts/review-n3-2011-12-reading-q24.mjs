import fs from 'node:fs'

const masterPath = 'data/jlpt_n3_toan_master.json'
const curatedPath = 'data/jlpt_n3_explanations_curated.json'
const reportPath = 'reports/n3-quality-audit/reading-2011-12-q24-review.json'
const questionId = 'toan_q_2011_12_59'
const answer = 3
const explanation =
  'Đáp án 3 — Trước hết, Tanaka cần báo ngày nào anh có thể đến nhà hàng để trao đổi về thực đơn và đồ uống. Email đã nhận ngày tổ chức cùng số khách ước tính; số lượng chính thức phải báo riêng trước buổi tiệc ba ngày.\n' +
  'Dịch: “Trước hết, anh Tanaka cần cho nhà hàng biết ngày mình có thể đến để bàn về món ăn và đồ uống.”'

const master = JSON.parse(fs.readFileSync(masterPath, 'utf8'))
const curated = JSON.parse(fs.readFileSync(curatedPath, 'utf8'))
const exam = master.find((item) => item.id === 'toan-n3-201112-full')
const question = exam?.parts.flatMap((part) => part.questions || []).find((item) => item.id === questionId)

if (!question) throw new Error(`Could not find ${questionId}`)
const passage = String(question.passage || '').replace(/<[^>]*>/gu, '')
if (!passage.includes('日時とだいたいのご出席人数は伺っております')) {
  throw new Error('The passage no longer says the restaurant already knows the date and estimated attendance')
}
if (!passage.includes('こちらにいらっしゃる日を知らせていただけないでしょうか')) {
  throw new Error('The passage no longer asks Tanaka to report a date he can visit')
}
if (!passage.includes('最終的な人数については、パーティー当日の 3 日までに')) {
  throw new Error('The passage no longer puts the final attendee count three days before the party')
}
if (question.options[answer - 1] !== 'パーティーの相談をするためにレストランに行ける日') {
  throw new Error('The saved answer no longer points to the date Tanaka can visit')
}

const previousExplanation = curated[questionId] || null
curated[questionId] = explanation
fs.writeFileSync(curatedPath, `${JSON.stringify(curated, null, 2)}\n`, 'utf8')

const report = {
  generatedAt: new Date().toISOString(),
  exam: 'JLPT N3 December 2011',
  scope: 'Reading Mondai 4, printed question 24 (internal question 59).',
  source: {
    type: 'passage text stored with toan-n3-201112-full',
    pdfIndependentlyReviewed: false,
    relevantText: [
      '日時とだいたいのご出席人数は伺っております',
      'こちらにいらっしゃる日を知らせていただけないでしょうか',
      '最終的な人数については、パーティー当日の 3 日までにご連絡',
    ],
  },
  answerReference: {
    officialKeyEstablished: false,
    basis:
      'The saved option 3 matches the explicit request in the passage; the other timing requirements are already known or due later.',
  },
  answerKeysChanged: 0,
  correction: {
    questionId,
    previousExplanation,
    answer,
    selectedOption: question.options[answer - 1],
    explanation,
    issue:
      'The previous explanation said Tanaka first needed to report the final attendee count, contradicting the email.',
    explanationScope:
      'Concise reading explanation and translation, consistent with the requested reading-section scope.',
  },
}
fs.mkdirSync('reports/n3-quality-audit', { recursive: true })
fs.writeFileSync(reportPath, `${JSON.stringify(report, null, 2)}\n`, 'utf8')
console.log(`Corrected ${questionId}; wrote ${reportPath}`)
