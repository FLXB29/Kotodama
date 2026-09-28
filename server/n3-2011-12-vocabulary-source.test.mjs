import test from 'node:test'
import assert from 'node:assert/strict'
import fs from 'node:fs'

const master = JSON.parse(fs.readFileSync('data/jlpt_n3_toan_master.json', 'utf8'))
const exam = master.find((entry) => entry.id === 'toan-n3-201112-full')
const questions = exam.parts.filter((part) => part.title.includes('Từ vựng')).flatMap((part) => part.questions || [])

test('December 2011 vocabulary source corrections preserve answer keys', () => {
  const q32 = questions.find((question) => Number(question.number) === 32)
  const q33 = questions.find((question) => Number(question.number) === 33)
  assert.deepEqual(q32.options, [
    '1.朝の電車はこんでいたが、帰りはゆるかった',
    '2.ズボンがゆるいので、ベルトをきつくしめた',
    '3.今回の旅行は荷物が少ないので、スーツケースがまだゆるい',
    '4.この家は、夫婦二人で住むなら十分ゆるいです',
  ])
  assert.equal(Number(q32.correctAnswer ?? q32.answer), 2)
  assert.deepEqual(q33.options, [
    '1.短気な性格の人は、この仕事にはあまり向かない',
    '2.雨のせいで、今日はグランドの性格がよくない',
    '3.この車の性格は電気で走る点だ',
    '4.あの人はその日の性格で言うことが変わる',
  ])
  assert.equal(Number(q33.correctAnswer ?? q33.answer), 1)
})
