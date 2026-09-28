import fs from 'node:fs'
import path from 'node:path'

const masterFile = path.resolve('data/jlpt_n3_toan_master.json')
const exams = JSON.parse(fs.readFileSync(masterFile, 'utf8'))

const watermarkPatterns = [
  /JLPT[・\s]N3[・\s\d/]+/gi,
  /N3\s+\d{1,2}\/\d{4}/gi,
]

for (const exam of exams) {
  for (const part of exam.parts || []) {
    const list = [
      { id: `${part.title} (part)`, text: part.passage, obj: part, field: 'passage' },
      ...(part.questions || []).flatMap((q) => [
        { id: `Q${q.id} (passage)`, text: q.passage, obj: q, field: 'passage' },
        { id: `Q${q.id} (extract)`, text: q.sourceTextExtracted, obj: q, field: 'sourceTextExtracted' },
      ])
    ]
    for (const item of list) {
      if (typeof item.text !== 'string') continue
      for (const pat of watermarkPatterns) {
        const matches = [...item.text.matchAll(pat)]
        for (const m of matches) {
          const idx = m.index
          const ctx = item.text.slice(Math.max(0, idx - 30), Math.min(item.text.length, idx + m[0].length + 30))
          console.log(`[${exam.id}] ${item.id} | MATCH "${m[0]}":\n   "...${ctx}..."\n`)
        }
      }
    }
  }
}
