import fs from 'node:fs'
import path from 'node:path'

const masterFile = path.resolve('data/jlpt_n3_toan_master.json')
const backupFile = path.resolve('data/jlpt_n3_toan_master.json.bak')

// 1. Create backup if not already present
if (!fs.existsSync(backupFile)) {
  fs.copyFileSync(masterFile, backupFile)
  console.log(`Created backup at ${backupFile}`)
}

const exams = JSON.parse(fs.readFileSync(masterFile, 'utf8'))
console.log(`Loaded ${exams.length} exams from ${masterFile}`)

function cleanJapaneseText(text) {
  if (!text || typeof text !== 'string') return text

  let s = text.replace(/\s*<br\s*\/?>\s*/gi, '<br>')

  // Japanese characters: Kanji, Hiragana, Katakana, Latin/digits
  const jpChar = '[\\u3040-\\u30ff\\u3400-\\u4dbf\\u4e00-\\u9faf0-9a-zA-Z]'
  // Inline punctuation that does NOT end a sentence
  const inlinePunct = '[、,()（）「」『』+＋~〜\\-ー]'

  // Never remove <br> if followed by a bullet/section start: 【, ※, ★, ■, ●, ◆, ・, digits, or 注
  // Never remove <br> if preceded by sentence terminal: 。, ！, ？, !, ?

  // Preceded by: jpChar OR inlinePunct
  // Followed by: jpChar OR opening quote 「『
  const regex = new RegExp(`(${jpChar}|${inlinePunct})<br>(?![【※★■●◆・\\d+[.)]|注)(${jpChar}|[「『])`, 'g')

  let prev
  do {
    prev = s
    s = s.replace(regex, '$1$2')
  } while (s !== prev)

  // Also remove redundant whitespace around <p> tags
  s = s.replace(/<p>\s*/gi, '<p>').replace(/\s*<\/p>/gi, '</p>')
  return s
}

let unwrappedCount = 0
let m4ImagesAttached = 0

for (const exam of exams) {
  const parts = exam.id.replace('toan-n3-', '').replace('-full', '')
  const y = parts.slice(0, 4)
  const m = parts.slice(4)
  const sessionKey = `${y}_${m}`
  const m4ImagePath = `/assets/jlpt/dokkai/m4_${sessionKey}.png`
  const localImageFile = path.join(process.cwd(), 'public', m4ImagePath.replace(/^\//, ''))

  const dokkaiParts = exam.parts.filter((p) => Number(p.sectionType) === 3)

  for (const part of dokkaiParts) {
    const isMondai4 = part.title && (part.title.includes('Mondai 4') || part.title.includes('Tìm kiếm'))

    // Process part-level passage
    if (isMondai4 && fs.existsSync(localImageFile)) {
      let leadText = cleanJapaneseText(part.passage || '')
      if (!leadText && part.questions?.[0]?.passage) {
        leadText = cleanJapaneseText(part.questions[0].passage)
      }
      // Remove any <img> from question passages
      for (const q of part.questions || []) {
        if (q.passage) {
          q.passage = cleanJapaneseText(q.passage).replace(/<div class="jlpt-dokkai-image-container"[^>]*>.*?<\/div>/gis, '').replace(/<img[^>]*>/gi, '')
        }
      }

      // Attach image cleanly to part.passage
      const imgTag = `<div class="jlpt-dokkai-image-container" style="margin-top:1rem;margin-bottom:1rem;text-align:center;"><img src="${m4ImagePath}" alt="Tài liệu thông tin bài đọc" style="max-width:100%;height:auto;border-radius:0.5rem;box-shadow:0 2px 8px rgba(0,0,0,0.08);" /></div>`
      if (!leadText.includes(m4ImagePath)) {
        part.passage = leadText ? `${leadText}${imgTag}` : imgTag
        m4ImagesAttached++
      } else {
        part.passage = leadText
      }
      unwrappedCount++
    } else if (part.passage) {
      const original = part.passage
      const cleaned = cleanJapaneseText(original)
      if (cleaned !== original) {
        part.passage = cleaned
        unwrappedCount++
      }
    }

    // Process question-level passages for non-M4 parts
    if (!isMondai4) {
      for (let qIdx = 0; qIdx < (part.questions || []).length; qIdx++) {
        const q = part.questions[qIdx]
        if (q.passage) {
          const original = q.passage
          const cleaned = cleanJapaneseText(original)
          if (cleaned !== original) {
            q.passage = cleaned
            unwrappedCount++
          }
        }
      }
    }
  }
}

console.log(`Unwrapped/updated passages count: ${unwrappedCount}`)
console.log(`Mondai 4 images attached: ${m4ImagesAttached}`)

// Write back to master JSON
fs.writeFileSync(masterFile, JSON.stringify(exams, null, 2), 'utf8')
console.log(`Successfully updated ${masterFile}!`)
