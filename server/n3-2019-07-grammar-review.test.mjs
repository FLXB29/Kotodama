import assert from 'node:assert/strict'
import fs from 'node:fs'
import test from 'node:test'

const readJson = (file) => JSON.parse(fs.readFileSync(file, 'utf8'))

test('N3 July 2019 grammar answers and explanations are aligned for questions 36–58', () => {
  const exams = readJson('data/jlpt_n3_toan_master.json')
  const curated = readJson('data/jlpt_n3_explanations_curated.json')
  const review = readJson('reports/n3-quality-audit/grammar-2019-07-review.json')
  const exam = exams.find((item) => item.id === 'toan-n3-201907-full')
  assert.ok(exam, 'Missing N3 July 2019 full exam.')

  const questions = new Map(
    exam.parts.flatMap((part) => part.questions || []).map((question) => [question.id, question])
  )
  const expectedAnswers = [2, 4, 4, 1, 2, 1, 3, 2, 4, 3, 2, 3, 3, 1, 3, 3, 2, 2, 4, 2, 4, 3, 1]
  const reviewed = Array.from({ length: 23 }, (_, index) => questions.get(`toan_q_2019_07_${index + 36}`))
  assert.ok(reviewed.every(Boolean), 'Expected every grammar question from 36 through 58.')
  assert.deepEqual(
    reviewed.map((question) => question.correctAnswer),
    expectedAnswers
  )
  assert.deepEqual(
    reviewed.map((question) => question.answer),
    expectedAnswers
  )
  assert.deepEqual(review.answerSequence, expectedAnswers)
  assert.equal(review.officialKeyConfirmed, false)

  const explanationFor = (question) => question.explanation || curated[question.id] || ''
  for (const question of reviewed) {
    assert.ok(explanationFor(question), `${question.id}: missing explanation.`)
    assert.match(explanationFor(question), /Dịch:/u, `${question.id}: missing Vietnamese translation.`)
  }

  for (const question of reviewed.slice(0, 13)) {
    const explanation = explanationFor(question)
    for (let option = 1; option <= 4; option++) {
      assert.match(
        explanation,
        new RegExp(`^${option}\\.`, 'mu'),
        `${question.id}: missing option ${option} rationale.`
      )
    }
  }

  for (const question of reviewed.slice(13, 18)) {
    const explanation = explanationFor(question)
    assert.match(explanation, /Câu hoàn chỉnh(?: hiển thị)?:/u)
    assert.match(explanation, /thứ tự ghép là/iu)
    for (let option = 1; option <= 4; option++) {
      assert.match(
        explanation,
        new RegExp(`^${option}\\.`, 'mu'),
        `${question.id}: missing fragment ${option} rationale.`
      )
      const fragment = question.options[option - 1]
        .replace(/^\s*[1-4１-４][.．、\s　]*/u, '')
        .replace(/[０-９]/gu, (digit) => String.fromCharCode(digit.charCodeAt(0) - 0xfee0))
        .trim()
      assert.ok(explanation.includes(fragment), `${question.id}: explanation omits fragment ${option}.`)
    }
    assert.equal(question.starPosition, 2, `${question.id}: ★ must be the third fragment.`)
    assert.equal(question.starCorrectOrder[question.starPosition], question.correctAnswer)
  }

  const reportStars = review.starQuestions.map((question) =>
    question.completeSentence.replace(/[０-９]/gu, (digit) => String.fromCharCode(digit.charCodeAt(0) - 0xfee0))
  )
  assert.equal(reportStars.length, 5)
  assert.match(reportStars[0], /大雨による電車の遅れのため11時開始/u)
  assert.match(reportStars[3], /隣に建ったことで私の家に日が当たらなくなって/u)
  assert.match(reportStars[4], /アルバイトしていたみたいだよ/u)
})
