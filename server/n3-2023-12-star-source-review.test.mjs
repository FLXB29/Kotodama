import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import test from 'node:test'
import { NhaiKanjiService } from './nhaikanji-service.mjs'

const exams = JSON.parse(fs.readFileSync(path.resolve('data/jlpt_n3_toan_master.json'), 'utf8'))
const fullExams = JSON.parse(fs.readFileSync(path.resolve('data/jlpt_full_master.json'), 'utf8'))
const curated = JSON.parse(fs.readFileSync(path.resolve('data/jlpt_n3_explanations_curated.json'), 'utf8'))
const exam = exams.find((item) => item.id === 'toan-n3-202312-full')
const questions = exam.parts.flatMap((part) => part.questions)
const sectionExam = fullExams.find((item) => item.id === 'cm2u2y69r01gd134iqiw21op8-grammar-reading')
const sectionQuestions = sectionExam.parts.flatMap((part) => part.questions || [])
const expected = [
  {
    id: 'toan_q_2023_12_49',
    options: ['1　声がきれいな', '2　は', '3　歌手', '4　ほど'],
    order: [4, 1, 3, 2],
    position: 0,
    answer: 4,
    text: '彼女ほど声がきれいな歌手はいない',
    starred: 'ほど',
  },
  {
    id: 'toan_q_2023_12_50',
    options: [' 1 人が　', '2 増えてきている', '3 インターネットで買う', '4 ということを'],
    order: [3, 1, 2, 4],
    position: 2,
    answer: 2,
    text: 'インターネットで買う人が増えてきている',
    starred: '増えてきている',
  },
  {
    id: 'toan_q_2023_12_51',
    options: ['1 もらえない', '2 ところがあるので', '3 一度チェックして', '4 自信がない'],
    order: [4, 2, 3, 1],
    position: 2,
    answer: 3,
    text: '自信がないところがあるので、一度チェックしてもらえない',
    starred: '一度チェックして',
  },
  {
    id: 'toan_q_2023_12_52',
    options: [' 1 玄関の電気を消すのを', '2 きて', '3 家を出て', '4 忘れて'],
    order: [1, 4, 3, 2],
    position: 2,
    answer: 3,
    text: '玄関の電気を消すのを忘れて家を出てきてしまった',
    starred: '家を出て',
  },
  {
    id: 'toan_q_2023_12_53',
    options: [' 1 必ずノートに記録する', '2 忘れない', '3 ように', '4 ことにしている'],
    order: [2, 3, 1, 4],
    position: 2,
    answer: 1,
    text: '忘れないように必ずノートに記録することにしている',
    starred: '必ずノートに記録する',
  },
]

test('December 2023 star fragments, order, star slots, and answer keys match the rendered source PDF', () => {
  assert.ok(exam, 'missing December 2023 exam')
  for (const item of expected) {
    const question = questions.find((entry) => entry.id === item.id)
    assert.ok(question, `missing ${item.id}`)
    assert.equal(question.starVerificationStatus, 'verified-against-source', item.id)
    assert.equal(question.starOrderVerified, true, item.id)
    assert.equal(question.starPositionVerified, true, item.id)
    assert.deepEqual(question.options, item.options, item.id)
    assert.deepEqual(question.starCorrectOrder, item.order, item.id)
    assert.equal(question.starPosition, item.position, item.id)
    assert.equal(question.correctAnswer, item.answer, item.id)
    assert.equal(question.answer, item.answer, item.id)
    assert.match(question.starVerificationSources?.[0] || '', /#page=8$/u, item.id)
    assert.match(question.starVerificationNote || '', /rendered original PDF/u, item.id)
    assert.match(curated[item.id] || '', new RegExp(item.text, 'u'), item.id)
    assert.match(curated[item.id] || '', new RegExp(item.starred, 'u'), item.id)
    assert.match(curated[item.id] || '', /Dịch:/u, item.id)
  }
})

test('December 2023 question 14 correction keeps the keyed fragment in the first printed star slot', () => {
  const question = questions.find((entry) => entry.id === 'toan_q_2023_12_49')
  assert.ok(question)
  assert.equal(question.correctAnswer, 4)
  assert.equal(question.starCorrectOrder[question.starPosition], 4)
  assert.equal(question.starPosition, 0)
  assert.match(question.starVerificationNote || '', /prior stored key.*corrected to choice 4 at segment 1/u)
  assert.match(curated[question.id], /vị trí thứ ba như dữ liệu cũ/u)
})

test('December 2023 section copy matches the source-verified star questions and serves the complete explanations', () => {
  assert.ok(sectionExam)
  for (const item of expected) {
    const sourceQuestion = questions.find((question) => question.id === item.id)
    const sectionQuestion = sectionQuestions.find((question) => Number(question.number) === sourceQuestion.number)
    assert.ok(sectionQuestion, `missing section question ${sourceQuestion.number}`)
    assert.equal(String(sectionQuestion.correctAnswer), String(item.answer), item.id)
    assert.deepEqual(
      sectionQuestion.options.map((option) => option.text.replace(/\s+/gu, '').normalize('NFKC')),
      sourceQuestion.options.map((option) => option.replace(/^\s*[1-4][.．、]?\s*/u, '').replace(/\s+/gu, '').normalize('NFKC')),
      item.id
    )
    assert.equal(sectionQuestion.explanation, curated[item.id], item.id)
  }

  const service = new NhaiKanjiService({
    dataPath: path.resolve('server/fixtures/nhaikanji'),
    mazziDataPath: '',
  })
  const section = service.getJlptExamDetail(sectionExam.id)
  const servedQuestion = section.parts.flatMap((part) => part.questions || []).find((question) => question.number === 49)
  assert.equal(servedQuestion.options[0].text, '声がきれいな')
  assert.equal(servedQuestion.explanation, curated['toan_q_2023_12_49'])
})
