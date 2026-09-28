import fs from 'node:fs'

const fullMockPath = 'data/jlpt_n3_toan_master.json'
const sectionMasterPath = 'data/jlpt_full_master.json'
const curatedPath = 'data/jlpt_n3_explanations_curated.json'
const fullMockExams = JSON.parse(fs.readFileSync(fullMockPath, 'utf8'))
const sectionExams = JSON.parse(fs.readFileSync(sectionMasterPath, 'utf8'))
const curated = JSON.parse(fs.readFileSync(curatedPath, 'utf8'))
const fullMock = fullMockExams.find((exam) => exam.id === 'toan-n3-201807-full')
const sectionExam = sectionExams.find((exam) => exam.id === 'cm2u2wyk900j8134i65mmhnr8-grammar-reading')
if (!fullMock || !sectionExam) throw new Error('Could not find the July 2018 N3 exams.')

const sourceQuestion = fullMock.parts.flatMap((part) => part.questions || []).find((question) => question.number === 51)
const sectionQuestion = sectionExam.parts.flatMap((part) => part.questions || []).find((question) => question.number === 51)
if (!sourceQuestion || !sectionQuestion) throw new Error('Could not find July 2018 question 51.')
if (
  sourceQuestion.starOrderVerified !== true ||
  sourceQuestion.starPositionVerified !== true ||
  sourceQuestion.starCorrectOrder?.join(',') !== '2,1,3,4' ||
  Number(sourceQuestion.correctAnswer) !== 3
) {
  throw new Error('July 2018 question 51 does not match the verified answer and order.')
}
const normalizeOption = (value) => String(value).normalize('NFKC').replace(/^\s*[1-4][.．、]?\s*/u, '').replace(/\s+/gu, '')
if (!sectionQuestion.options.map((option) => normalizeOption(option.text ?? option)).every((option, index) =>
  option === normalizeOption(sourceQuestion.options[index]))) {
  throw new Error('July 2018 question 51 section choices differ from the verified full exam.')
}

const explanation =
  'Câu hoàn chỉnh: 「新しい家は、駅に近くて便利なのだが、窓が大通り側にあるせいで、車の音が聞こえてきて、うるさいと感じることがある。」\n' +
  'Dịch: “Ngôi nhà mới gần ga và tiện lợi, nhưng vì cửa sổ hướng ra đường lớn nên đôi khi nghe tiếng xe và cảm thấy ồn.”\n' +
  'Thứ tự là 2 → 1 → 3 → 4; ô ★ thứ ba nhận 「せいで」, lựa chọn 3. 「大通り側にある」 hoàn thành vị ngữ về phía cửa sổ hướng ra; 「せいで」 nối nguyên nhân bất lợi ấy với kết quả 「車の音が聞こえてきて、うるさい」. 「ある」 phải theo sau cụm vị trí, còn 「車の音が」 mở mệnh đề kết quả sau dấu sao.'

sourceQuestion.explanation = explanation
sectionQuestion.explanation = explanation
curated[sourceQuestion.id] = explanation
fs.writeFileSync(fullMockPath, `${JSON.stringify(fullMockExams, null, 2)}\n`, 'utf8')
fs.writeFileSync(sectionMasterPath, `${JSON.stringify(sectionExams, null, 2)}\n`, 'utf8')
fs.writeFileSync(curatedPath, `${JSON.stringify(curated, null, 2)}\n`, 'utf8')
console.log('Updated the Vietnamese explanation for source-verified July 2018 question 51.')
