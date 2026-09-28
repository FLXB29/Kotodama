import fs from 'node:fs'

const fullMockPath = 'data/jlpt_n3_toan_master.json'
const sectionMasterPath = 'data/jlpt_full_master.json'
const curatedPath = 'data/jlpt_n3_explanations_curated.json'
const fullMocks = JSON.parse(fs.readFileSync(fullMockPath, 'utf8'))
const sections = JSON.parse(fs.readFileSync(sectionMasterPath, 'utf8'))
const curated = JSON.parse(fs.readFileSync(curatedPath, 'utf8'))
const sourceExam = fullMocks.find((exam) => exam.id === 'toan-n3-202207-full')
const sectionExam = sections.find(
  (exam) => exam.level === 'N3' && exam.section === 'grammar-reading' && exam.year === '07 2022'
)
if (!sourceExam || !sectionExam) throw new Error('Could not find the July 2022 N3 exams.')

const sourcePart = sourceExam.parts.find((part) => part.questions?.some((question) => Number(question.number) === 53))
const sectionPart = sectionExam.parts.find((part) => part.questions?.some((question) => Number(question.number) === 53))
if (!sourcePart || !sectionPart) throw new Error('Could not find the factory-visit cloze passage.')

const passage =
  '<p>以下は、留学生の作文である。</p>' +
  '<p><strong>工場見学</strong><br>コルホネン・アーロン</p>' +
  '<p>日本に来る前に、日本には無料で工場見学ができるところがあると聞いて、面白そうだと思いました。日本に行ったら絶対に行こうと思っていたのですが、先月ついに行くことができました。（19）のはアイスクリームの会社の工場です。工場では機械を使って、材料を混ぜたり、型に入れたり、凍らせたりしていました。工場の人の説明は丁寧で、機械や商品の説明が書かれた資料もくれたので、よくわかりました。できたばかりのアイスも食べさせてくれました。工場見学は本当に楽しかったです。（20）、どうして無料で見学をさせてくれるのかわかりませんでした。</p>' +
  '<p>調べてみたら、工場見学は会社側にもいいことがあるとわかりました。ある新聞の調査によると、工場見学をした人の大部分が、（21）で作られている商品を好きになり、会社に対するイメージもよくなったそうです。実際に、私も工場見学をした会社の印象が前よりよくなりました。</p>' +
  '<p>日本には、他にも同じような工場見学ができるところがたくさんあるそうです。今、次に見学に行く工場を探しています。日本にいる間にいろいろな工場に見学に（22）。</p>'

const normalizeOption = (option) =>
  String(typeof option === 'string' ? option : option?.text ?? option?.value ?? '')
    .normalize('NFKC')
    .replace(/^\s*[1-4][.．、\s　)]*/u, '')
    .replace(/\s+/gu, '')
const sourceQuestions = new Map(sourcePart.questions.map((question) => [Number(question.number), question]))
const sectionQuestions = new Map(sectionPart.questions.map((question) => [Number(question.number), question]))
const sourceQ55 = sourceQuestions.get(55)
const sectionQ55 = sectionQuestions.get(55)
if (!sourceQ55 || !sectionQ55) throw new Error('Could not find the July 2022 question 21 choices.')
if (sectionQ55.options[3]?.text === 'そこま') sectionQ55.options[3].text = 'そこ'
else if (sectionQ55.options[3]?.text !== 'そこ') throw new Error('Question 21 choice 4 did not match the known OCR error.')

for (const number of [53, 55, 56]) {
  const sourceQuestion = sourceQuestions.get(number)
  const sectionQuestion = sectionQuestions.get(number)
  if (!sourceQuestion || !sectionQuestion || !sourceQuestion.explanation) {
    throw new Error(`Missing reviewed source explanation or section question ${number}.`)
  }
  if (Number(sourceQuestion.correctAnswer ?? sourceQuestion.answer) !== Number(sectionQuestion.correctAnswer ?? sectionQuestion.answer)) {
    throw new Error(`Question ${number} answer keys differ.`)
  }
  if (
    sourceQuestion.options.length !== sectionQuestion.options.length ||
    sourceQuestion.options.some((option, index) => normalizeOption(option) !== normalizeOption(sectionQuestion.options[index]))
  ) {
    throw new Error(`Question ${number} options differ; refusing to mirror its explanation.`)
  }
  sectionQuestion.explanation = sourceQuestion.explanation
}

const sourceQ54 = sourceQuestions.get(54)
const sectionQ54 = sectionQuestions.get(54)
if (!sourceQ54 || !sectionQ54 || Number(sourceQ54.correctAnswer ?? sourceQ54.answer) !== 1) {
  throw new Error('Question 20 does not match the reviewed answer key.')
}
if (
  sourceQ54.options.length !== sectionQ54.options.length ||
  sourceQ54.options.some((option, index) => normalizeOption(option) !== normalizeOption(sectionQ54.options[index]))
) {
  throw new Error('Question 20 options differ between the source and section exam.')
}
const q54Explanation =
  'Đáp án 1 — 「でも」 nối hai ý tương phản: chuyến tham quan rất vui, nhưng người viết vẫn không hiểu vì sao nhà máy cho tham quan miễn phí.\n' +
  '1. 「でも」: nghĩa là “nhưng/tuy vậy”, phù hợp với sự chuyển ý từ niềm vui sang thắc mắc.\n' +
  '2. 「また」: nghĩa là “lại/cũng”; không tạo được quan hệ tương phản cần có ở đây.\n' +
  '3. 「すると」: nghĩa là “sau đó/thế thì”, thường mở kết quả hoặc diễn biến kế tiếp; câu sau nêu điều người viết chưa hiểu, không phải sự việc xảy ra sau đó.\n' +
  '4. 「たとえば」: nghĩa là “ví dụ như”, nhưng sau đó không có ví dụ mà là một câu nêu thắc mắc.\n' +
  'Dịch câu: “Chuyến tham quan nhà máy thật sự rất vui. Tuy vậy, tôi không hiểu vì sao họ cho tham quan miễn phí.”'
sourceQ54.explanation = q54Explanation
sectionQ54.explanation = q54Explanation
curated[sourceQ54.id] = q54Explanation

sourcePart.passage = passage
sectionPart.passage = passage
fs.writeFileSync(fullMockPath, `${JSON.stringify(fullMocks, null, 2)}\n`, 'utf8')
fs.writeFileSync(sectionMasterPath, `${JSON.stringify(sections, null, 2)}\n`, 'utf8')
fs.writeFileSync(curatedPath, `${JSON.stringify(curated, null, 2)}\n`, 'utf8')
console.log('Reconstructed and synchronized the July 2022 factory-visit cloze passage; copied matching source explanations for questions 19, 21, and 22.')
