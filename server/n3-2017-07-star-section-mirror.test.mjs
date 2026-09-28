import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import test from 'node:test'

const full = JSON.parse(fs.readFileSync(path.resolve('data/jlpt_n3_toan_master.json'), 'utf8'))
const sections = JSON.parse(fs.readFileSync(path.resolve('data/jlpt_full_master.json'), 'utf8'))
const fullExam = full.find((exam) => exam.id === 'toan-n3-201707-full')
const sectionExam = sections.find((exam) => exam.id === 'cm2u2wq1c00ck134imolbo8ac-grammar-reading')
const fullPart = fullExam?.parts.find((part) => part.title.includes('Ngữ pháp') && part.title.includes('Mondai 2'))
const sectionPart = sectionExam?.parts.find((part) => part.title === 'Mondai 2')

test('July 2017 standalone ★ questions mirror the matching source exam questions', () => {
  assert.ok(fullPart)
  assert.ok(sectionPart)

  for (const number of [49, 50, 51, 52, 53]) {
    const source = fullPart.questions.find((question) => question.number === number)
    const section = sectionPart.questions.find((question) => question.number === number)
    assert.ok(source)
    assert.ok(section)
    assert.ok(section.question.includes(source.starPrompt.before))
    assert.deepEqual(
      section.options.map((option) => option.text),
      source.options.map((option) => option.replace(/^\s*[1-4][.．、]?\s*/u, '').trim())
    )
    assert.equal(section.correctAnswer, String(source.correctAnswer))
    assert.deepEqual(section.starCorrectOrder, source.starCorrectOrder)
    assert.equal(section.starPosition, source.starPosition)
    assert.equal(section.starVerificationStatus, source.starVerificationStatus)
    assert.equal(section.starAnswerKeyConflict, source.starAnswerKeyConflict)
    assert.equal(section.explanation, source.explanation)
    const expectedFragments = source.options.map((option) => option.replace(/^\s*[1-4][.．、]?\s*/u, '').trim())
    const expectedScript = source.starCorrectOrder
      .map((choice, index) =>
        index === source.starPosition ? `<u>${expectedFragments[choice - 1]}</u>` : expectedFragments[choice - 1]
      )
      .join(' ')
    assert.equal(section.script, expectedScript)
  }

  const disputed = sectionPart.questions.find((question) => question.number === 49)
  assert.equal(disputed.correctAnswer, '2')
  assert.equal(disputed.starVerificationStatus, 'disputed')
  assert.match(disputed.explanation, /còn bất đồng nguồn/u)
})
