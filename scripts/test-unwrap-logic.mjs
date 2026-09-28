function cleanJapanesePassage(text) {
  if (!text) return text

  let s = text.replace(/\s*<br\s*\/?>\s*/gi, '<br>')

  // Japanese characters that form words and sentences
  const jpChar = '[\\u3040-\\u30ff\\u3400-\\u4dbf\\u4e00-\\u9faf0-9a-zA-Z]'
  // Inline punctuation that does NOT end a sentence
  const inlinePunct = '[、,()（）「」『』+＋~〜\\-ー]'

  // Never remove <br> if followed by a bullet/section start: 【, ※, ★, ■, ●, ◆, 注
  // Never remove <br> if preceded by sentence terminal: 。, ！, ？, !, ?

  // 1. Remove <br> between intra-word/intra-sentence characters
  // Preceded by: jpChar OR inlinePunct
  // Followed by: jpChar OR opening quote 「『
  const regex = new RegExp(`(${jpChar}|${inlinePunct})<br>(?![【※★■●◆・\\d+[.)]|注)(${jpChar}|[「『])`, 'g')

  let prev
  do {
    prev = s
    s = s.replace(regex, '$1$2')
  } while (s !== prev)

  return s
}

import fs from 'node:fs'

const exams = JSON.parse(fs.readFileSync('data/jlpt_n3_toan_master.json', 'utf8'))
const q0 = exams[0].parts[8].questions[0].passage
const q1 = exams[0].parts[8].questions[1].passage
const m2q0 = exams[0].parts[9].questions[0].passage

console.log('--- CLEAN Q0 ---')
console.log(cleanJapanesePassage(q0))
console.log('\n--- CLEAN Q1 ---')
console.log(cleanJapanesePassage(q1))
console.log('\n--- CLEAN M2 Q0 ---')
console.log(cleanJapanesePassage(m2q0))
