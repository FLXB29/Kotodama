import fs from 'node:fs'
import path from 'node:path'

const masterFile = path.resolve('data/jlpt_n3_toan_master.json')
const exams = JSON.parse(fs.readFileSync(masterFile, 'utf8'))

console.log('--- SCANNING FOR SMUSHED DATES WITH ANNOUNCEMENT TITLES ---')

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
      // date followed immediately by non-punctuation/non-break
      const matches = [...p.text.matchAll(/\d{1,2}\s*月\s*\d{1,2}\s*日(?![（(、,\s<。]).{2,30}/g)]
      for (const m of matches) {
        console.log(`[${exam.id}] ${p.id} => "${m[0]}"`)
      }
    }
  }
}
