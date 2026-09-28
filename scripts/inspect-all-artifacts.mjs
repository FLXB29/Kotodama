import fs from 'node:fs'
import path from 'node:path'

const masterFile = path.resolve('data/jlpt_n3_toan_master.json')
const exams = JSON.parse(fs.readFileSync(masterFile, 'utf8'))

console.log('--- SCANNING ALL PASSAGES FOR WATERMARKS & TRAILING PAGE NUMBERS ---')

const watermarkRegex = /(JLPT[・\s]N3[^\s<]*|N3\s+\d{1,2}\/\d{4}|\b\d{1,2}\/\d{4})\s*<\/p>$/i
const trailingPageNumRegex = /([。！？」）\w\u3040-\u30ff\u4e00-\u9faf])(\d{1,2})\s*<\/p>$/

const candidates = []

for (const exam of exams) {
  const dokkaiParts = (exam.parts || []).filter(
    (p) => Number(p.sectionType) === 3 || (p.title && (p.title.includes('Đọc hiểu') || p.title.includes('読解')))
  )
  for (const part of dokkaiParts) {
    const passages = [
      { id: `${part.title} (part)`, text: part.passage },
      ...(part.questions || []).map((q) => ({ id: `Q${q.id}`, text: q.passage }))
    ]
    for (const p of passages) {
      if (!p.text) continue

      if (watermarkRegex.test(p.text)) {
        candidates.push({
          examId: exam.id,
          pId: p.id,
          type: 'WATERMARK',
          tail: p.text.slice(-50),
          full: p.text
        })
      }

      const m = p.text.match(trailingPageNumRegex)
      if (m && !p.text.match(/\d{4}\s*<\/p>$/)) {
        candidates.push({
          examId: exam.id,
          pId: p.id,
          type: 'PAGE_NUM',
          num: m[2],
          tail: p.text.slice(-45),
          full: p.text
        })
      }
    }
  }
}

for (const c of candidates) {
  console.log(`[${c.type}] ${c.examId} | ${c.pId} => tail: ${JSON.stringify(c.tail)}`)
}
