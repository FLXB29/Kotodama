import fs from 'node:fs'

const explanationsPath = 'data/jlpt_n3_explanations_curated.json'
const sectionsPath = 'data/jlpt_full_master.json'
const explanations = JSON.parse(fs.readFileSync(explanationsPath, 'utf8'))
const exams = JSON.parse(fs.readFileSync(sectionsPath, 'utf8'))
const exam = exams.find((item) => item.id === 'cm2u2wco4002g134io8nm04te-grammar-reading')
if (!exam) throw new Error('Could not find the December 2015 N3 grammar/reading exam.')

const notes = new Map([
  [
    'cm2u2wezh004h134icxmzz8b3',
    'Đáp án 3 — Đoạn văn nói người kể nghe bài hát của ca sĩ mình yêu thích mỗi ngày, cả khi học và khi ngủ. Vì chiếc máy cassette luôn phát những bài hát ấy nên nó thường ở bên người kể.',
  ],
  [
    'cm2u2wezi004i134iatlo4df9',
    'Đáp án 2 — Người kể dùng máy cassette hằng ngày ở cấp hai, nhưng ngừng dùng khi được tặng máy CD lúc vào cấp ba. Vì vậy, mẹ cho rằng món đồ chỉ được dùng trong một thời gian ngắn; người kể vẫn không hối tiếc vì đã mua thứ mình thật sự muốn.',
  ],
  [
    'cm2u2wezi004j134igqh1gtkt',
    'Đáp án 1 — Người kể vẫn xem đó là một món mua tốt vì lúc ấy mình thật sự muốn có chiếc máy cassette và đã mua nó. Việc sau này được tặng máy CD không làm thay đổi cảm nhận đó.',
  ],
])

const questions = new Map(
  exam.parts.flatMap((part) => (part.questions || []).map((question) => [question.id, question]))
)
const expectedAnswers = new Map([
  ['cm2u2wezh004h134icxmzz8b3', 3],
  ['cm2u2wezi004i134iatlo4df9', 2],
  ['cm2u2wezi004j134igqh1gtkt', 1],
])

for (const [id, explanation] of notes) {
  const question = questions.get(id)
  if (!question) throw new Error(`Question ${id} is missing from the standalone exam.`)
  if (Number(question.correctAnswer ?? question.answer) !== expectedAnswers.get(id)) {
    throw new Error(`Question ${id} has an unexpected saved answer.`)
  }
  explanations[id] = explanation
}

fs.writeFileSync(explanationsPath, `${JSON.stringify(explanations, null, 2)}\n`, 'utf8')
console.log(`Added short passage-grounded notes for ${notes.size} December 2015 reading questions.`)
