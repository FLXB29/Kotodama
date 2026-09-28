import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import test from 'node:test'

const report = JSON.parse(
  fs.readFileSync(path.resolve('reports/n3-quality-audit/star-source-2018-07-review.json'), 'utf8')
)
const exams = JSON.parse(fs.readFileSync(path.resolve('data/jlpt_n3_toan_master.json'), 'utf8'))
const fullMaster = JSON.parse(fs.readFileSync(path.resolve('data/jlpt_full_master.json'), 'utf8'))

const exam = exams.find((item) => item.id === 'toan-n3-201807-full')
const grammarPart = exam?.parts.find((part) => part.title.includes('Ngữ pháp') && part.title.includes('Mondai 2'))
const fullExam = fullMaster.find((item) => item.id === 'cm2u2wyk900j8134i65mmhnr8-grammar-reading')
const fullGrammarPart = fullExam?.parts.find((part) => part.title === 'Mondai 2')

const normalize = (value) =>
  String(typeof value === 'string' ? value : value?.text || '')
    .normalize('NFKC')
    .replace(/^\s*[1-4][.．、]\s*/u, '')
    .replace(/^\s*[1-4]\s+/u, '')
    .replace(/[\s、。,.，]/gu, '')
    .trim()

test('07/2018 ★ review matches the source, answer reference, and both app datasets', () => {
  assert.ok(exam)
  assert.ok(grammarPart)
  assert.ok(fullExam)
  assert.ok(fullGrammarPart)
  assert.equal(report.sourcePdf.renderedPages[0].printedPage, 5)
  assert.deepEqual(report.sourcePdf.renderedPages[0].printedQuestions, [14, 15, 16, 17, 18])
  assert.deepEqual(report.secondaryAnswerKey.answers, [1, 4, 3, 2, 2])
  assert.equal(report.secondaryAnswerKey.viewerPage, 17)
  assert.equal(report.officialKeyEstablished, false)

  for (const item of report.questions) {
    const question = grammarPart.questions.find((entry) => entry.id === item.fullExamQuestionId)
    const fullQuestion = fullGrammarPart.questions.find((entry) => entry.id === item.standaloneQuestionId)
    assert.ok(question, `Missing full-exam question ${item.printedQuestion}`)
    assert.ok(fullQuestion, `Missing standalone question ${item.printedQuestion}`)
    assert.equal(question.correctAnswer, item.answer)
    assert.equal(fullQuestion.correctAnswer, String(item.answer))
    assert.deepEqual(question.starCorrectOrder, item.order)
    assert.equal(question.starPosition, 2)
    assert.equal(item.order[2], item.answer, `Wrong answer in the third slot for ${item.printedQuestion}`)
    assert.equal(question.starVerificationStatus, 'verified-against-source')
    assert.equal(fullQuestion.starVerificationStatus, 'verified-against-source')
    assert.equal(question.starOrderVerified, true)
    assert.equal(question.starPositionVerified, true)
    assert.equal(fullQuestion.starOrderVerified, true)
    assert.equal(fullQuestion.starPositionVerified, true)
    assert.deepEqual(question.options.map(normalize), item.printedOptions.map(normalize))
    assert.deepEqual(fullQuestion.options.map(normalize), item.printedOptions.map(normalize))
    assert.equal(fullQuestion.explanation, question.explanation)
    assert.equal(fullQuestion.script, item.displayedSolutionScript)
    if (item.standalonePrompt) {
      assert.equal(fullQuestion.question, item.standalonePrompt)
      assert.equal(fullQuestion.sentence, item.standalonePrompt)
      assert.equal(fullQuestion.prompt, item.standalonePrompt)
    }
    assert.match(fullQuestion.script, /<u>[^<]+<\/u>/u)
    assert.ok(normalize(question.explanation).includes(normalize(item.completedSentence)))
    assert.ok(question.explanation.includes(item.vietnameseTranslation))
    assert.ok(question.explanation.includes('Vị trí từng mảnh:'))
    assert.ok(item.optionPlacementNotes.every((note) => question.explanation.includes(note)))
    assert.ok(question.starVerificationSources.includes(report.sourcePdf.url))
    assert.ok(question.starVerificationSources.includes(report.secondaryAnswerKey.url))
    assert.ok(item.optionPlacementNotes.length === 4)
  }
})
