import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import test from 'node:test'

const fullExams = JSON.parse(fs.readFileSync(path.resolve('data/jlpt_full_master.json'), 'utf8'))
const toanExams = JSON.parse(fs.readFileSync(path.resolve('data/jlpt_n3_toan_master.json'), 'utf8'))

function questions(exam) {
  return (exam.parts || []).flatMap((part) => part.questions || [])
}

function normalizeOption(option) {
  const text = typeof option === 'string' ? option : (option?.text ?? option?.value ?? '')
  return String(text)
    .normalize('NFKC')
    .replace(/^\s*[1-4](?:(?:[.．、]\s*)|\s+)/u, '')
    .replace(/\s+/gu, '')
    .replace(/[.．、。]+$/gu, '')
}

test('source-verified star questions agree with their split-section answer keys and option text', () => {
  let compared = 0

  for (const exam of toanExams) {
    const date = exam.id.match(/toan-n3-(\d{4})(\d{2})-full/u)
    if (!date) continue

    const sectionExam = fullExams.find(
      (candidate) =>
        candidate.level === 'N3' &&
        String(candidate.year).trim() === `${date[2]} ${date[1]}` &&
        candidate.title.includes('Ngữ Pháp')
    )
    if (!sectionExam) continue

    const sectionQuestions = questions(sectionExam)
    for (const sourceQuestion of questions(exam).filter((question) =>
      ['verified', 'verified-against-source'].includes(question.starVerificationStatus)
    )) {
      const sectionQuestion = sectionQuestions.find(
        (question) => Number(question.number) === Number(sourceQuestion.number)
      )
      if (!sectionQuestion) continue

      compared += 1
      assert.equal(
        String(sectionQuestion.correctAnswer ?? sectionQuestion.answer),
        String(sourceQuestion.correctAnswer ?? sourceQuestion.answer),
        `${exam.id} question ${sourceQuestion.number} answer key`
      )
      assert.deepEqual(
        sectionQuestion.options.map(normalizeOption),
        sourceQuestion.options.map(normalizeOption),
        `${exam.id} question ${sourceQuestion.number} options`
      )
    }
  }

  assert.ok(compared >= 14, `expected to check at least 14 available section copies; checked ${compared}`)
})
