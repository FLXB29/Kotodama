import fs from 'node:fs'
import path from 'node:path'

const fullPath = path.resolve('data/jlpt_n3_toan_master.json')
const sectionPath = path.resolve('data/jlpt_full_master.json')
const curatedPath = path.resolve('data/jlpt_n3_explanations_curated.json')
const fullExams = JSON.parse(fs.readFileSync(fullPath, 'utf8'))
const sectionExams = JSON.parse(fs.readFileSync(sectionPath, 'utf8'))
const curated = JSON.parse(fs.readFileSync(curatedPath, 'utf8'))

function getExam(exams, id) {
  const exam = exams.find((item) => item.id === id)
  if (!exam) throw new Error(`Could not find exam ${id}.`)
  return exam
}

function getQuestion(exam, number) {
  const matches = exam.parts.flatMap((part) => part.questions || []).filter((item) => Number(item.number) === number)
  if (matches.length !== 1) throw new Error(`Expected one question ${number}; found ${matches.length}.`)
  return matches[0]
}

function optionText(option) {
  return typeof option === 'string' ? option : String(option?.text ?? option?.value ?? '')
}

function setOptionText(question, index, text) {
  const current = question.options[index]
  if (typeof current === 'string') question.options[index] = text
  else question.options[index] = { ...current, text }
}

const fullExam = getExam(fullExams, 'toan-n3-202212-full')
const q39Full = getQuestion(fullExam, 39)
const fullQ39Options = q39Full.options.map((option) => String(option).replace(/\s+/gu, ''))
const originalQ39Options = ['1全く', '2非常', '3決して', '4必ず']
const correctedQ39Options = ['1全く', '2非常に', '3決して', '4必ず']
const serializedQ39Options = JSON.stringify(fullQ39Options)
if (
  Number(q39Full.answer) !== 4 ||
  (serializedQ39Options !== JSON.stringify(originalQ39Options) &&
    serializedQ39Options !== JSON.stringify(correctedQ39Options))
) {
  throw new Error('Unexpected full-mock question 39; refusing to restore the source option.')
}
if (serializedQ39Options === JSON.stringify(originalQ39Options)) {
  q39Full.options[1] = String(q39Full.options[1]).replace('非常', '非常に')
}

const section = getExam(sectionExams, 'cm2u2xxmo019t134izzsjxgrl-grammar-reading')
const q36 = getQuestion(section, 36)
if (Number(q36.answer) !== 2)
  throw new Error('Unexpected standalone question 36 answer; refusing to repair its transcription.')
const originalQ36Fragment = 'ところがあった\n んですが'
const correctedQ36Fragment = 'ところがあったんですが'
for (const field of ['question', 'sentence']) {
  const value = String(q36[field] || '')
  if (value.includes(originalQ36Fragment)) q36[field] = value.replace(originalQ36Fragment, correctedQ36Fragment)
  else if (!value.includes(correctedQ36Fragment)) throw new Error(`Unexpected standalone question 36 ${field}.`)
  q36[field] = q36[field].replace('、 ここの書き方', '、ここの書き方')
}

const q43 = getQuestion(section, 43)
for (const field of ['question', 'text', 'sentence']) {
  const value = String(q43[field] || '')
  if (value.includes('？J')) q43[field] = value.replace('？J', '？」')
}
if (String(q43.question || q43.text || '').includes('？J')) {
  throw new Error('Question 43 still contains the stray character.')
}
if (
  Number(q43.answer) !== 3 ||
  q43.options.map(optionText).join('|') !==
    '出かけるところなのに|出かけているところなのに|出かけるところだから|出かけているところだから'
) {
  throw new Error('Unexpected section question 43; refusing to repair the prompt.')
}

const q51 = getQuestion(section, 51)
const originalQ51Option = '年前に習い始めたのだが'
const correctedQ51Option = '1年前に習い始めたのだが'
if (Number(q51.answer) !== 3 || ![originalQ51Option, correctedQ51Option].includes(optionText(q51.options?.[0]))) {
  throw new Error('Unexpected section question 51; refusing to restore the missing year numeral.')
}
if (optionText(q51.options?.[0]) === originalQ51Option) setOptionText(q51, 0, correctedQ51Option)
const originalQ51Script = '弾けるようになりたくて年前に習い始めたのだが<u>弾けば</u>弾くほど'
const correctedQ51Script = '弾けるようになりたくて1年前に習い始めたのだが<u>弾けば</u>弾くほど'
if (String(q51.script || '') !== originalQ51Script && String(q51.script || '') !== correctedQ51Script) {
  throw new Error('Unexpected section question 51 script; refusing to repair the source text.')
}
q51.script = correctedQ51Script

const q53 = getQuestion(fullExam, 53)
if (
  Number(q53.answer) !== 2 ||
  JSON.stringify(
    q53.options.map((option) =>
      String(option)
        .replace(/^\s*[1-4][.．、]?\s*/u, '')
        .replace(/\s+/gu, '')
    )
  ) !== JSON.stringify(['という点で', '違いは', '生活している', 'ない'])
) {
  throw new Error('Unexpected full-mock question 53; refusing to add a derived explanation.')
}
const q53Explanation = [
  'Đáp án 2 — Câu hoàn chỉnh: 「都会と田舎には違うところも多いが、どちらも人が働き、生活しているという点で違いはない。」',
  'Dịch: “Thành thị và nông thôn có nhiều điểm khác nhau, nhưng đều giống nhau ở chỗ con người làm việc và sinh sống.”',
  'Thứ tự bốn mảnh là 3 → 1 → 2 → 4; vị trí ★ là mảnh 「違いは」 (lựa chọn 2). 「生活している」 hoàn tất ý “đang làm việc và sinh sống”; 「という点で」 nêu khía cạnh đem ra so sánh; 「違いはない」 kết luận “không có khác biệt”.',
  'Ghi nhớ: 「〜という点で」 = xét ở điểm/khía cạnh là…; 「違いはない」 = không có khác biệt.',
].join('\n')
if (q53.explanation && q53.explanation !== q53Explanation)
  throw new Error('Question 53 already has a different explanation.')
q53.explanation = q53Explanation
const previousQ53Explanation =
  'Đô thị và nông thôn có nhiều điểm khác, nhưng cả hai đều có người làm việc và sinh sống nên không khác nhau ở khía cạnh đó. Trật tự 3・1・2・4; ★ là 違いは, đáp án 2.'
if (curated[q53.id] && curated[q53.id] !== previousQ53Explanation && curated[q53.id] !== q53Explanation) {
  throw new Error('Curated question 53 explanation conflicts with this edit.')
}
curated[q53.id] = q53Explanation

const q52 = getQuestion(fullExam, 52)
const previousQ52Translation = 'Dịch: ““Đúng lúc mình đang muốn một chiếc túi có màu như thế này.””'
const correctedQ52Translation =
  'Dịch: “A: Chúc mừng sinh nhật. Đây là quà tặng cho cậu. — B: Wow, túi xách. Đúng lúc mình đang muốn một chiếc túi có màu như thế này. Cảm ơn nhé.”'
if (!q52.explanation.includes(correctedQ52Translation)) {
  if (!q52.explanation.includes(previousQ52Translation))
    throw new Error('Unexpected question 52 translation; refusing to replace unknown wording.')
  q52.explanation = q52.explanation.replace(previousQ52Translation, correctedQ52Translation)
}
if (curated[q52.id] && curated[q52.id] !== q52.explanation) {
  if (!curated[q52.id].includes(previousQ52Translation))
    throw new Error('Curated question 52 explanation conflicts with the source correction.')
  curated[q52.id] = curated[q52.id].replace(previousQ52Translation, correctedQ52Translation)
}

fs.writeFileSync(fullPath, `${JSON.stringify(fullExams, null, 2)}\n`, 'utf8')
fs.writeFileSync(sectionPath, `${JSON.stringify(sectionExams, null, 2)}\n`, 'utf8')
fs.writeFileSync(curatedPath, `${JSON.stringify(curated, null, 2)}\n`, 'utf8')
console.log(
  'Applied idempotent December 2022 source/transcription fixes for questions 36, 39, 43, and 51; synchronized explanations and translations for questions 52–53.'
)
