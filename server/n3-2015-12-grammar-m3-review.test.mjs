import assert from 'node:assert/strict'
import fs from 'node:fs'
import test from 'node:test'
import { NhaiKanjiService } from './nhaikanji-service.mjs'

const readJson = (file) => JSON.parse(fs.readFileSync(file, 'utf8'))
const answerSequence = [1, 4, 1, 2, 3]
const expectedPassageFragments = [
  'それで、ごみを分けずに(19)。',
  '(20)、夕方帰宅すると、私のごみは回収されずに残っていました。',
  'もう一度資源として使える物(21)たくさんあります。',
  'それ以降は、きちんとごみを(22)。',
  '環境問題が少し身近になったような(23)。',
]
const expectedQuestion22Choice = '分けるようにしています'
const review = readJson('reports/n3-quality-audit/grammar-m3-2015-12-review.json')
const curated = readJson('data/jlpt_n3_explanations_curated.json')
const fullExam = readJson('data/jlpt_n3_toan_master.json').find((exam) => exam.id === 'toan-n3-201512-full')
const sectionExam = readJson('data/jlpt_full_master.json').find(
  (exam) => exam.id === 'cm2u2wco4002g134io8nm04te-grammar-reading'
)

const getMondai3 = (exam) =>
  exam.parts.find((part) => part.id === 'toan_part_2015_12_m2_g3' || part.title === 'Mondai 3')
const getQuestions = (part) =>
  part.questions
    .filter((question) => Number(question.number) >= 54 && Number(question.number) <= 58)
    .sort((a, b) => Number(a.number) - Number(b.number))
const getOptionText = (option) =>
  String(typeof option === 'string' ? option : option.text)
    .replace(/^\s*\d+[.．、)）]?\s*/u, '')
    .trim()

test('December 2015 Grammar Mondai 3 restores the full passage and source-correct option', () => {
  assert.ok(fullExam)
  assert.ok(sectionExam)
  const canonicalPart = getMondai3(fullExam)
  const standalonePart = getMondai3(sectionExam)
  assert.ok(canonicalPart)
  assert.ok(standalonePart)

  for (const part of [canonicalPart, standalonePart]) {
    for (const fragment of expectedPassageFragments) assert.ok(part.passage.includes(fragment))
  }

  const canonicalQuestions = getQuestions(canonicalPart)
  const standaloneQuestions = getQuestions(standalonePart)
  assert.equal(canonicalQuestions.length, 5)
  assert.equal(standaloneQuestions.length, 5)
  assert.deepEqual(
    canonicalQuestions.map((question) => Number(question.correctAnswer ?? question.answer)),
    answerSequence
  )
  assert.equal(getOptionText(canonicalQuestions[3].options[1]), expectedQuestion22Choice)
  assert.equal(getOptionText(standaloneQuestions[3].options[1]), expectedQuestion22Choice)

  assert.deepEqual(
    review.questions.map((question) => question.answer),
    answerSequence
  )
  assert.equal(review.officialKeyEstablished, false)
  assert.equal(review.optionCorrection.incorrectPreviousText, '分けようとしています')
})

test('all five cloze explanations cover every choice, translation, and a usage note in both data views', () => {
  const canonicalQuestions = getQuestions(getMondai3(fullExam))
  const standaloneQuestions = getQuestions(getMondai3(sectionExam))
  canonicalQuestions.forEach((question, index) => {
    const explanation = question.explanation
    assert.ok(explanation)
    assert.match(explanation, new RegExp(`^Đáp án ${answerSequence[index]}`, 'u'))
    assert.match(explanation, /Dịch câu chứa chỗ trống:/u)
    assert.match(explanation, /Ghi nhớ:/u)
    for (let choice = 1; choice <= 4; choice += 1) {
      assert.match(explanation, new RegExp(`(?:^|\\n)${choice}\\.`, 'u'))
    }
    assert.equal(standaloneQuestions[index].explanation, explanation)
    assert.equal(curated[question.id]?.includes('Mẫu ngữ pháp được nhận diện từ dữ liệu N3 cục bộ') || false, false)
    assert.equal(
      curated[standaloneQuestions[index].id]?.includes('Mẫu ngữ pháp được nhận diện từ dữ liệu N3 cục bộ') || false,
      false
    )
  })
})

test('the NhaiKanji service returns the reviewed passage and explanations in both exam views', () => {
  const service = new NhaiKanjiService()
  const fullView = service.getJlptExamDetail(fullExam.id)
  const sectionView = service.getJlptExamDetail(sectionExam.id)
  for (const view of [fullView, sectionView]) {
    const passage = view.parts.find((part) => part.passage?.includes('ごみの捨て方'))?.passage
    assert.ok(passage?.includes('ごみを分けずに(19)'))
    const byNumber = new Map(
      view.parts.flatMap((part) => part.questions || []).map((question) => [Number(question.number), question])
    )
    for (let number = 54; number <= 58; number += 1) {
      const question = byNumber.get(number)
      assert.ok(question?.explanation, `${view.title}: question ${number} has an explanation.`)
      assert.match(question.explanation, /Dịch câu chứa chỗ trống:/u)
    }
  }
})
