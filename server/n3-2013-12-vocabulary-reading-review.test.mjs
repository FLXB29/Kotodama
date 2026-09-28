import test from 'node:test'
import assert from 'node:assert/strict'
import fs from 'node:fs'

const exams = JSON.parse(fs.readFileSync(new URL('../data/jlpt_n3_toan_master.json', import.meta.url), 'utf8'))
const curated = JSON.parse(
  fs.readFileSync(new URL('../data/jlpt_n3_explanations_curated.json', import.meta.url), 'utf8')
)
const exam = exams.find((item) => item.id === 'toan-n3-201312-full')
const questions = new Map(exam.parts.flatMap((part) => part.questions).map((question) => [question.id, question]))
const checks = [
  [1, 1, '生えた（はえた）', '植えた'],
  [2, 4, '各地（かくち）', '各自（かくじ）'],
  [3, 2, '貯金（ちょきん）', '税金'],
  [4, 1, '留守（るす）', '留守番'],
  [5, 3, '浅い（あさい）', '深い'],
  [6, 4, '文章（ぶんしょう）', '文書（ぶんしょ）'],
  [7, 1, '改札（かいさつ）', '警察'],
  [8, 3, '笑って（わらって）', '怒って'],
  [9, 2, '倍（ばい）', '培養'],
  [10, 3, '停電（ていでん）', '落雷'],
  [11, 4, '包んで（つつんで）', '結んで'],
  [12, 1, '独身（どくしん）', '単身'],
  [13, 4, '貸して（かして）', '借りて'],
  [14, 1, '逃げる（にげる）', '返す'],
  [15, 2, '調子（ちょうし）', '気分'],
  [16, 3, '緩い（ゆるい）', 'きつい'],
  [17, 4, 'たちました', 'かかりました'],
  [18, 1, '突然（とつぜん）', '早めに'],
  [19, 2, '物価（ぶっか）', '支出'],
  [20, 4, '追いつきました', '間に合いました'],
  [21, 3, 'おぼれる（溺れる）', '凍りそう'],
  [22, 2, '材料（ざいりょう）', '資源'],
  [23, 1, '別々に（べつべつに）', '半々に'],
  [24, 1, '引き受けて（ひきうけて）', '引き出して'],
  [25, 3, '自慢して（じまんして）', '応援して'],
  [26, 2, '台所（だいどころ）', '玄関'],
  [27, 2, '場所（ばしょ）', '値段'],
  [28, 1, '売り切れた', '全部売れなかった'],
  [29, 4, '理由（りゆう）', '計画'],
  [30, 3, '集める（あつめる）', '贈る'],
]

test('2013-12 vocabulary and kanji explanations preserve the independently checked key', () => {
  for (const [number, answer] of checks) {
    const question = questions.get(`toan_q_2013_12_${number}`)
    assert.equal(question.answer, answer)
    assert.equal(question.correctAnswer, answer)
  }
})

test('2013-12 vocabulary and kanji explanations translate the sentence and discuss every choice', () => {
  for (const [number, answer, correctReading, contrast] of checks) {
    const question = questions.get(`toan_q_2013_12_${number}`)
    const explanation = question.explanation || curated[question.id]
    assert.match(explanation, new RegExp(`^Đáp án ${answer} —`))
    assert.match(explanation, /Dịch:/)
    assert.ok(explanation.includes(correctReading))
    assert.ok(explanation.includes(contrast))
    for (let option = 1; option <= 4; option++) assert.ok(explanation.includes(`\n${option}. `))
  }
})
