import fs from 'node:fs'

const masterPath = 'data/jlpt_n3_toan_master.json'
const curatedPath = 'data/jlpt_n3_explanations_curated.json'
const reviewPath = 'reports/n3-quality-audit/answer-key-2012-12-vocabulary-review.json'
const exams = JSON.parse(fs.readFileSync(masterPath, 'utf8'))
const curated = JSON.parse(fs.readFileSync(curatedPath, 'utf8'))
const questions = new Map(exams.flatMap((exam) => exam.parts.flatMap((part) => part.questions)).map((q) => [q.id, q]))

const q2012 = questions.get('toan_q_2012_12_30')
const expectedOptions = ['1. 小さすぎて', '2. 暗すぎて', '3. 薄すぎて', '4. 明るすぎて']
const oldOptions = ['1.明るすぎて', '2.遠すぎて', '3.薄すぎて ', '3.薄すぎて ']
const needsRestore = q2012?.correctAnswer === 1 && q2012.options.length === 4
const alreadyRestored = q2012?.correctAnswer === 4 && JSON.stringify(q2012.options) === JSON.stringify(expectedOptions)
if (!q2012 || (!needsRestore && !alreadyRestored)) {
  throw new Error('Unexpected source state for 2012/12 vocabulary question 30')
}
const previous = { answer: 1, options: oldOptions }
q2012.options = expectedOptions
q2012.correctAnswer = 4
q2012.answer = 4
q2012.explanation = `Đáp án 4 — 「明るすぎて」 là “quá sáng”, phù hợp với 「まぶしくて」 (chói mắt). Nguồn đối chiếu cục bộ giữ thứ tự lựa chọn 1 小さすぎて、2 暗すぎて、3 稼すぎて、4 明るすぎて; lựa chọn 3 đã được chuẩn hóa thành 「薄すぎて」 theo cách nhập hiện tại vì bản cũ 「稼すぎて」 không tạo thành từ/cụm tự nhiên trong câu.
1. 小さすぎて: “quá nhỏ”; chữ có thể khó đọc vì nhỏ nhưng không diễn tả ánh sáng làm lóa mắt.
2. 暗すぎて: “quá tối”; là thiếu ánh sáng, trái với chói sáng.
3. 薄すぎて: “quá nhạt/mờ”; nói nét chữ hoặc màu sắc nhạt, không phải ánh sáng chói.
4. 明るすぎて: “quá sáng”; đúng với nguyên nhân khiến người nói không nhìn rõ chữ trên áp phích.
Dịch: “Ánh sáng chói quá nên tôi không nhìn rõ chữ trên áp phích.” Ghi nhớ: まぶしい là chói mắt; 明るすぎる là quá sáng, còn 暗すぎる là quá tối.`
curated[q2012.id] = q2012.explanation

const replacements = [
  [
    'toan_q_2012_12_15',
    '「工夫」（くふう）: công nhân；người lao động tại công xưởng',
    '「工夫」（くふう）: sự khéo léo tìm cách giải quyết; cách làm/biện pháp sáng tạo',
  ],
  [
    'toan_q_2021_07_17',
    '「工夫」（くふう）: công nhân；người lao động tại công xưởng',
    '「工夫」（くふう）: sự khéo léo tìm cách giải quyết; cách làm/biện pháp sáng tạo',
  ],
  [
    'toan_q_2017_07_30',
    '「薄」（すすき うす）: ánh sáng (e.g. có màu)；cỏ bạc；Hán Việt: BẠC',
    '「薄い」（うすい）: mỏng/nhạt; 「薄すぎて」 là quá mỏng hoặc quá nhạt',
  ],
]
for (const [id, from, to] of replacements) {
  const question = questions.get(id)
  if (!question) throw new Error(`Question not found: ${id}`)
  const explanation = question.explanation || curated[id]
  if (explanation?.includes(from)) question.explanation = explanation.replace(from, to)
  else if (explanation?.includes(to)) question.explanation = explanation
  else throw new Error(`Expected dictionary gloss not found: ${id}`)
  curated[id] = question.explanation
}

const q2017 = questions.get('toan_q_2017_07_30')
if (!q2017 || q2017.correctAnswer !== 4) throw new Error('Unexpected source state for 2017/07 vocabulary question 30')
q2017.explanation = `Đáp án 4 — 「明るすぎて」 nghĩa là “quá sáng”. 「まぶしくて」 nói ánh sáng chói làm khó nhìn chữ trên biển hiệu; 「明るすぎて」 nêu đúng nguyên nhân.
1. 小さすぎて: “quá nhỏ”; chữ nhỏ cũng khó đọc nhưng không phải vì ánh sáng gây chói.
2. 暗すぎて: “quá tối”; trái nghĩa với ánh sáng chói.
3. 薄すぎて: “quá nhạt/mờ”; thường nói nét chữ hoặc màu nhạt, không nói ánh sáng làm lóa.
4. 明るすぎて: “quá sáng”; phù hợp với まぶしい và lý do không nhìn rõ.
Dịch: “Ánh sáng chói quá nên tôi không nhìn rõ chữ trên biển hiệu.” Ghi nhớ: まぶしい = chói mắt; 明るい = sáng; 暗い = tối; 薄い = mỏng/nhạt.`
curated[q2017.id] = q2017.explanation

const record = {
  questionId: q2012.id,
  exam: 'N3 12/2012, vocabulary Mondai 4, Q30',
  previous,
  reviewed: { answer: 4, options: expectedOptions },
  evidence: [
    {
      source: 'data/jlpt_full_master.json, matching question text',
      answer: 4,
      options: ['小さすぎて', '暗すぎて', '稼すぎて', '明るすぎて'],
      note: 'The local source gives answer 4 and places 明るすぎて in option 4. The malformed third choice is normalized to the existing plausible distractor 薄すぎて.',
    },
    {
      source: 'Japanese meaning and sentence context',
      note: '眩しい means dazzling/glary; 明るすぎて (too bright) directly explains why the poster text cannot be seen. This also confirms the answer independently of the copied key.',
    },
  ],
  explanation:
    'Restored the source option order and answer; corrected a duplicate option and replaced misleading dictionary senses for 工夫 and 薄 in the reviewed vocabulary entries.',
}
fs.mkdirSync('reports/n3-quality-audit', { recursive: true })
fs.writeFileSync(reviewPath, `${JSON.stringify(record, null, 2)}\n`, 'utf8')
fs.writeFileSync(masterPath, `${JSON.stringify(exams, null, 2)}\n`, 'utf8')
fs.writeFileSync(curatedPath, `${JSON.stringify(curated, null, 2)}\n`, 'utf8')
console.log('Corrected four contextual vocabulary glosses and restored 2012/12 Q30 options/key.')
