import fs from 'node:fs'
import path from 'node:path'

const masterFile = path.resolve('data/jlpt_n3_toan_master.json')
const exams = JSON.parse(fs.readFileSync(masterFile, 'utf8'))

console.log('--- INSPECTING MONDAI 2 & 3 PASSAGES STARTS ---')

for (const exam of exams) {
  const dokkaiParts = (exam.parts || []).filter(
    (p) => (Number(p.sectionType) === 3 || (p.title && (p.title.includes('Đọc hiểu') || p.title.includes('読解')))) &&
           p.title && (p.title.includes('Mondai 2') || p.title.includes('Mondai 3'))
  )

  for (const part of dokkaiParts) {
    const passages = [
      { id: `${part.title} (part)`, text: part.passage },
      ...(part.questions || []).map((q) => ({ id: `${part.title} Q${q.id}`, text: q.passage }))
    ]
    for (const p of passages) {
      if (!p.text) continue
      // print first 70 chars
      const clean = p.text.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim()
      console.log(`[${exam.id}] ${p.id} => "${clean.slice(0, 70)}"`)
    }
  }
}
