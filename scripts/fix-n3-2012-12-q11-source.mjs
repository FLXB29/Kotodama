import fs from 'node:fs'
import path from 'node:path'

const masterPath = path.resolve('data/jlpt_n3_toan_master.json')
const curatedPath = path.resolve('data/jlpt_n3_explanations_curated.json')
const exams = JSON.parse(fs.readFileSync(masterPath, 'utf8'))
const curated = JSON.parse(fs.readFileSync(curatedPath, 'utf8'))
const questionId = 'toan_q_2012_12_11'
const oldOptions = ['1.記緑', '2.紀録', '3.記録', '4.紀緑']
const sourceOptions = ['1.記録', '2.紀録', '3.記緑', '4.紀線']
const explanation = `Đáp án 1 — 「記録」（きろく）là ghi chép/lưu lại; 「きろくする」viết bằng hai chữ 記録.
1. 記録（きろく）: ghi chép/lưu lại; đúng với từ được hỏi.
2. 紀録: chữ 紀 không phải chữ 記 trong cách viết chuẩn 記録.
3. 記緑: chữ 緑 nghĩa là màu xanh, không phải 録 “ghi chép”.
4. 紀線: cả 紀 và 線 đều không tạo thành cách viết của từ きろく trong câu này; 線 có nghĩa là đường/nét.
Dịch: “Hãy ghi lại cẩn thận những điều đã được quyết định trong cuộc họp.”
Ghi nhớ: 記録する = ghi chép; phân biệt 録 (ghi lại) với 緑 (màu xanh), và 記 với 紀.`

const found = exams
  .flatMap((exam) => (exam.parts || []).flatMap((part) => part.questions || []))
  .filter((q) => q.id === questionId)
if (found.length !== 1) throw new Error(`Expected exactly one ${questionId}; found ${found.length}`)

const question = found[0]
const options = question.options.map((option) => option.replace(/\s+/gu, ''))
const oldState =
  Number(question.correctAnswer ?? question.answer) === 3 && JSON.stringify(options) === JSON.stringify(oldOptions)
const fixedState =
  Number(question.correctAnswer ?? question.answer) === 1 && JSON.stringify(options) === JSON.stringify(sourceOptions)

if (!oldState && !fixedState)
  throw new Error(`Unexpected source state for ${questionId}; refusing to alter choices or key`)
if (!String(question.question || '').includes('きろく')) throw new Error(`Unexpected question text for ${questionId}`)

question.options = sourceOptions
question.correctAnswer = 1
question.answer = 1
question.explanation = explanation
curated[questionId] = explanation

fs.writeFileSync(masterPath, `${JSON.stringify(exams, null, 2)}\n`, 'utf8')
fs.writeFileSync(curatedPath, `${JSON.stringify(curated, null, 2)}\n`, 'utf8')
console.log(`${oldState ? 'Corrected' : 'Confirmed'} ${questionId}: restored PDF option order and answer 1.`)
