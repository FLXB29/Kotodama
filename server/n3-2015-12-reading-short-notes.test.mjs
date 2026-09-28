import assert from 'node:assert/strict'
import fs from 'node:fs'
import test from 'node:test'
import { NhaiKanjiService } from './nhaikanji-service.mjs'

const readJson = (path) => JSON.parse(fs.readFileSync(path, 'utf8'))
const curated = readJson('data/jlpt_n3_explanations_curated.json')
const exam = readJson('data/jlpt_full_master.json').find(
  (item) => item.id === 'cm2u2wco4002g134io8nm04te-grammar-reading'
)
const passage = exam.parts.find((part) => part.questions?.some((question) => Number(question.number) === 63))?.passage
const questionIds = ['cm2u2wezh004h134icxmzz8b3', 'cm2u2wezi004i134iatlo4df9', 'cm2u2wezi004j134igqh1gtkt']
const answerSequence = [3, 2, 1]

test('December 2015 radio-cassette reading notes follow the passage and keep the saved answers', () => {
  assert.ok(passage?.includes('毎日大好きな歌手の歌を聞いていた'))
  assert.ok(passage?.includes('CDプレーヤーをもらうと'))
  const questions = exam.parts
    .flatMap((part) => part.questions || [])
    .filter((question) => questionIds.includes(question.id))
  assert.deepEqual(
    questions.map((question) => Number(question.correctAnswer ?? question.answer)),
    answerSequence
  )
  assert.ok(curated[questionIds[0]].includes('ca sĩ mình yêu thích'))
  assert.ok(curated[questionIds[1]].includes('thời gian ngắn'))
  assert.ok(curated[questionIds[2]].includes('thật sự muốn'))
})

test('the exam service serves concise notes for all three questions in the standalone reading section', () => {
  const service = new NhaiKanjiService()
  const detail = service.getJlptExamDetail(exam.id)
  const questions = detail.parts
    .flatMap((part) => part.questions || [])
    .filter((question) => questionIds.includes(question.id))
  assert.deepEqual(
    questions.map((question) => question.explanation),
    questionIds.map((id) => curated[id])
  )
  assert.ok(questions.every((question) => !question.explanation.includes('Nguồn đề chưa có phần giải thích')))
})
