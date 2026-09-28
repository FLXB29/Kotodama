import fs from 'node:fs'
import path from 'node:path'

const draftPath = path.resolve('reports/n3-quality-audit/source-import-draft.json')
const masterPath = path.resolve('data/jlpt_n3_toan_master.json')
const reviewPath = path.resolve('reports/n3-quality-audit/source-import-review.json')
const draft = JSON.parse(fs.readFileSync(draftPath, 'utf8'))
const exams = JSON.parse(fs.readFileSync(masterPath, 'utf8'))

// Order is the order of option numbers for the four pieces, from left to right.
// Null means the source wording or tokenization still needs visual review.
const verifiedOrders = {
  '2025/12': [[1, 4, 3, 2], [3, 2, 1, 4], [2, 1, 4, 3], [4, 1, 2, 3], [4, 2, 3, 1]],
  '2025/07': [[1, 3, 4, 2], [3, 4, 2, 1], [4, 2, 1, 3], [2, 4, 3, 1], null],
  '2024/12': [[1, 3, 2, 4], [1, 4, 3, 2], [2, 3, 4, 1], [4, 1, 2, 3], [3, 2, 1, 4]],
  '2024/07': [[3, 2, 4, 1], [3, 1, 2, 4], [4, 2, 3, 1], [2, 1, 4, 3], [4, 3, 1, 2]],
  '2023/12': [[4, 1, 3, 2], [3, 1, 2, 4], [4, 2, 3, 1], [1, 4, 3, 2], [2, 3, 1, 4]],
  '2023/07': [[3, 2, 4, 1], [2, 3, 1, 4], [1, 4, 2, 3], [2, 4, 3, 1], [1, 3, 4, 2]],
  '2022/12': [[2, 4, 1, 3], [3, 1, 4, 2], [4, 1, 3, 2], [1, 4, 2, 3], [3, 1, 2, 4]],
  '2022/07': [[3, 2, 4, 1], [3, 1, 2, 4], [4, 1, 3, 2], [4, 2, 1, 3], [2, 1, 4, 3]],
  '2021/12': [[1, 4, 3, 2], [3, 4, 1, 2], [4, 1, 3, 2], [2, 3, 4, 1], [4, 1, 3, 2]],
  '2021/07': [[3, 2, 4, 1], [2, 1, 4, 3], [3, 2, 1, 4], [1, 4, 3, 2], [4, 3, 1, 2]],
  '2020/12': [[4, 2, 1, 3], [2, 4, 3, 1], [3, 4, 2, 1], [1, 4, 3, 2], [1, 3, 4, 2]],
  '2019/12': [[3, 2, 4, 1], [4, 2, 1, 3], [1, 4, 2, 3], [2, 4, 3, 1], [4, 1, 3, 2]],
  '2019/07': [[2, 4, 1, 3], [1, 4, 3, 2], [4, 2, 3, 1], [1, 3, 2, 4], [1, 4, 2, 3]],
  '2018/12': [[2, 3, 4, 1], [3, 2, 4, 1], [4, 2, 1, 3], [2, 1, 4, 3], [1, 3, 2, 4]],
  '2018/07': [[3, 2, 1, 4], [2, 3, 4, 1], [2, 1, 3, 4], [1, 3, 2, 4], [4, 1, 2, 3]],
  '2017/12': [[4, 2, 3, 1], [3, 4, 2, 1], [1, 3, 2, 4], [2, 1, 4, 3], [4, 2, 1, 3]],
  '2017/07': [[1, 3, 2, 4], [4, 3, 1, 2], [2, 4, 3, 1], [4, 1, 2, 3], [3, 2, 4, 1]],
  '2016/12': [[4, 2, 3, 1], [3, 1, 4, 2], [4, 3, 2, 1], [2, 3, 1, 4], [1, 4, 3, 2]],
  '2016/07': [[3, 1, 4, 2], [1, 3, 2, 4], [3, 2, 4, 1], [2, 4, 1, 3], [3, 4, 2, 1]],
  '2015/12': [[4, 3, 1, 2], [1, 3, 4, 2], [2, 4, 3, 1], [4, 3, 1, 2], [1, 2, 4, 3]],
  '2015/07': [[3, 2, 1, 4], [1, 4, 2, 3], [4, 3, 1, 2], [2, 1, 4, 3], [4, 2, 1, 3]],
  '2014/12': [[4, 2, 1, 3], null, [3, 2, 4, 1], [4, 2, 3, 1], [3, 1, 4, 2]],
  '2014/07': [[1, 4, 2, 3], [4, 3, 1, 2], [4, 1, 3, 2], [2, 4, 3, 1], [3, 4, 2, 1]],
  '2013/07': [[3, 2, 4, 1], [4, 3, 1, 2], [4, 1, 2, 3], [1, 4, 3, 2], [3, 1, 2, 4]],
  '2012/12': [[1, 3, 2, 4], [2, 4, 3, 1], [4, 2, 3, 1], [3, 4, 1, 2], [2, 1, 4, 3]],
  '2012/07': [[3, 2, 4, 1], [4, 3, 1, 2], [3, 1, 4, 2], [1, 3, 2, 4], [2, 4, 3, 1]],
  '2011/12': [[3, 1, 4, 2], [2, 1, 4, 3], [2, 4, 3, 1], [3, 2, 4, 1], [4, 2, 1, 3]],
  '2011/07': [[3, 4, 2, 1], [3, 1, 4, 2], [1, 4, 2, 3], [4, 2, 1, 3], null],
  '2010/07': [[1, 4, 3, 2], [4, 2, 1, 3], [3, 1, 2, 4], [1, 3, 2, 4], [2, 4, 1, 3]],
}

const optionOverrides = {
  '2025/12:16': ['弾くほど', '上手に', '弾けるように', 'なっていくのが'],
  '2023/07:18': ['専門家で', '都会で', 'いらっしゃる', '山下花子先生に'],
  '2019/12:18': ['もし', '乗せていってあげる', '行くんだったら', '行くつもりだから'],
  '2017/07:17': ['習わせるのではなくて', '子供の', '興味があるものを', '習わせたいものを'],
  '2015/07:17': ['誰もいない', '話し相手が', '寂しい', 'のは'],
  '2014/07:14': ['がんばろうとして', '応援して', 'やろうか', 'いるので'],
  '2014/07:15': ['けれども', 'いつかまた', '使っていない', '今はどれも'],
  '2014/12:16': ['わかりやすく', '示しながら', '表やグラフを', '説明すると'],
  '2013/07:14': ['お待ち', 'おかけ', 'いすに', 'になって'],
  '2012/07:15': ['ありますが', '会ったことは', '聞いたことが', 'お名前は'],
  '2010/07:18': ['意味だった', 'という', 'と思う', 'ような'],
  '2021/07:15': ['という', '何', 'か', '魚'],
  '2021/07:18': ['形に', '見えることから', '人の耳のような', '見ると'],
}

const promptOverrides = {
  '2015/12:15': { before: '', after: 'が、遅れているそうだ。' },
  '2021/12:18': {
    before: '患者「先生、おふろに入ってもいいんでしょうか。」医者「',
    after: '入っていいですよ。」',
  },
  '2018/12:14': {
    before: 'なかなか英語の単語が覚えられないので、英語の得意な友達が',
    after: 'した。',
  },
}

const textOnly = (html) => String(html || '').replace(/<[^>]*>/g, '').replace(/&nbsp;/g, ' ').trim()
const hasImage = (html) => /<img\b/i.test(String(html || ''))
const review = { generatedAt: new Date().toISOString(), exams: [], answerPositionChecks: [], unresolved: [] }
let importedStars = 0
let importedClozes = 0
let importedReadings = 0

for (const row of draft) {
  const exam = exams.find((item) => item.id === row.examId)
  if (!exam) continue
  const examKey = `${exam.year}/${String(exam.session).padStart(2, '0')}`
  const changes = { exam: examKey, star: 0, cloze: false, reading: 0, missingReading: [] }
  const starPart = exam.parts.find((part) => part.title.includes('Ngữ pháp') && part.title.includes('Mondai 2'))
  if (starPart) {
    const candidates = row.sections.star?.candidates || []
    for (const source of candidates) {
      const question = starPart.questions[source.index]
      if (!question || (!source.before && !source.after) || !source.choices?.length) {
        review.unresolved.push({ exam: examKey, type: 'star-source', question: source.qNumber, reason: 'Prompt or four source options could not be read.' })
        continue
      }
      const key = `${examKey}:${source.qNumber}`
      const originalPassage = question.passage
      const originalImage = question.image
      let options = question.options || []
      if (optionOverrides[key]) {
        options = optionOverrides[key].map((choice, index) => `${index + 1} ${choice}`)
        question.options = options
      } else if (options.length === 4 && options.every((value) => /^[①②③④]$/.test(String(value).trim()))) {
        const replacement = source.choices
        options = replacement.map((choice, index) => `${index + 1} ${choice}`)
        question.options = options
      }
      const prompt = promptOverrides[key] || { before: source.before, after: source.after }
      question.starPrompt = prompt
      question.starSourceExtracted = true
      const expectedOrder = verifiedOrders[examKey]?.[source.index] || question.starCorrectOrder
      if (expectedOrder?.length === 4) {
        const correctAnswer = Number(question.correctAnswer ?? question.answer)
        const starPosition = expectedOrder.indexOf(correctAnswer)
        question.starCorrectOrder = expectedOrder
        question.starOrderVerified = true
        question.starPosition = starPosition
        question.starPositionVerified = starPosition >= 0
        question.question = `<p><strong>${source.qNumber}.</strong> Ghép bốn mảnh theo thứ tự để hoàn thành câu.</p>`
        question.sentence = question.question
        review.answerPositionChecks.push({ exam: examKey, question: source.qNumber, correctOption: correctAnswer, starPosition, order: expectedOrder })
        if (starPosition < 0) {
          question.passage = originalPassage
          question.image = originalImage
          review.unresolved.push({ exam: examKey, type: 'star-answer', question: source.qNumber, reason: 'The answer key does not occur in the verified piece order.' })
        } else {
          question.passage = null
          question.image = null
        }
      } else {
        question.starOrderVerified = false
        question.starPosition = null
        question.starPositionVerified = false
        question.starCorrectOrder = undefined
        question.question = `<p><strong>${source.qNumber}.</strong> Vị trí dấu sao đang được đối chiếu; ảnh đề gốc được giữ lại.</p>`
        question.sentence = question.question
        question.passage = originalPassage
        question.image = originalImage
        review.unresolved.push({ exam: examKey, type: 'star-answer', question: source.qNumber, reason: 'The complete four-piece order needs visual review before certifying the star answer.' })
      }
      importedStars++
      changes.star++
    }
  }

  const clozePart = exam.parts.find((part) => part.title.includes('Ngữ pháp') && part.title.includes('Mondai 3'))
  if (clozePart && row.sections.cloze?.html) {
    clozePart.passage = row.sections.cloze.html
    clozePart.questions.forEach((question) => { question.passage = null })
    clozePart.sourceTextExtracted = true
    importedClozes++
    changes.cloze = true
  } else if (clozePart) {
    review.unresolved.push({ exam: examKey, type: 'cloze-source', reason: row.sections.cloze?.reason || 'No shared passage was extracted.' })
  }

  for (const sourcePart of row.sections.reading || []) {
    const part = exam.parts.find((candidate) => candidate.id === sourcePart.partId)
    if (!part) continue
    const coveredQuestionIndexes = new Set()
    for (const candidate of sourcePart.candidates || []) {
      const question = part.questions[candidate.questionIndex]
      if (!question) continue
      question.readingSourcePassage = true
      if (candidate.html) {
        question.passage = candidate.html
        question.sourceTextExtracted = true
        importedReadings++
        changes.reading++
        coveredQuestionIndexes.add(candidate.questionIndex)
      } else {
        question.readingSourceMissing = true
        changes.missingReading.push(candidate.qNumber || question.number)
        review.unresolved.push({ exam: examKey, type: 'reading-source', question: candidate.qNumber || question.number, reason: 'PDF text layer did not contain this image-backed passage/table.' })
      }
    }
    // Remove images from covered blocks only; source images remain for the two unextractable items.
    if (coveredQuestionIndexes.size) {
      for (let index = 0; index < part.questions.length; index++) {
        if (coveredQuestionIndexes.has(index)) continue
        const q = part.questions[index]
        if (q.passage && !hasImage(q.passage) && textOnly(q.passage)) q.passage = null
      }
    }
  }
  review.exams.push(changes)
}

fs.writeFileSync(masterPath, `${JSON.stringify(exams, null, 2)}\n`, 'utf8')
review.totals = {
  exams: review.exams.length,
  importedStarQuestions: importedStars,
  importedClozePassages: importedClozes,
  importedReadingPassages: importedReadings,
  verifiedStarOrders: review.answerPositionChecks.length,
  verifiedStarPositions: review.answerPositionChecks.filter((item) => item.starPosition >= 0).length,
  unresolvedItems: review.unresolved.length,
}
fs.writeFileSync(reviewPath, `${JSON.stringify(review, null, 2)}\n`, 'utf8')
console.log(JSON.stringify(review.totals, null, 2))
