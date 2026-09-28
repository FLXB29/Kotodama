import fs from 'node:fs'
import path from 'node:path'

const root = path.resolve('.')
const masterPath = path.join(root, 'data/jlpt_n3_toan_master.json')
const curatedPath = path.join(root, 'data/jlpt_n3_explanations_curated.json')
const reviewPath = path.join(root, 'reports/n3-quality-audit/vocabulary-source-2014-07-q1-review.json')
const exams = JSON.parse(fs.readFileSync(masterPath, 'utf8'))
const curated = JSON.parse(fs.readFileSync(curatedPath, 'utf8'))
const review = JSON.parse(fs.readFileSync(reviewPath, 'utf8'))
const exam = exams.find((item) => item.id === 'toan-n3-201407-full')
const question = exam?.parts.flatMap((part) => part.questions).find((item) => item.id === review.question.questionId)
if (!question) throw new Error('Missing JLPT N3 07/2014 vocabulary question 1')

const explanation = `Đáp án 2 — 商業 đọc là 「しょうぎょう」, nghĩa là thương mại/hoạt động buôn bán. Câu 「この町は、昔から商業が盛んだった。」 dịch là “Thị trấn này từ xưa đã phát triển hoạt động thương mại.” 「商業が盛ん」 là cụm tự nhiên để nói hoạt động thương mại phát triển mạnh.\n\n1. さんぎょう: cách đọc của 「産業」, nghĩa là công nghiệp/ngành sản xuất; khác chữ 商 trong từ được gạch dưới. PDF in đủ âm 「さんぎょう」.\n2. しょうぎょう: cách đọc đúng của 「商業」.\n3. じょうぎょう: không phải cách đọc của 「商業」; chữ 商 ở đây đọc しょう.\n4. ざんぎょう: cách đọc của 「残業」, nghĩa là làm thêm giờ; đây là từ khác, không phải 商業.\n\nTừ trọng tâm: 「商業」（しょうぎょう） = thương mại, hoạt động buôn bán.`

question.options = review.question.appAfter
question.explanation = explanation
question.sourceVerificationStatus = 'verified'
question.sourceVerificationSources = [review.source.questionSourceUrl, review.source.answerKeySource]
curated[question.id] = explanation

fs.writeFileSync(curatedPath, `${JSON.stringify(curated, null, 2)}\n`, 'utf8')
fs.writeFileSync(masterPath, `${JSON.stringify(exams, null, 2)}\n`, 'utf8')
console.log(`Restored and documented source transcription for ${question.id}; answer remains ${question.answer}.`)
