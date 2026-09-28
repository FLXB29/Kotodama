import fs from 'node:fs'
import path from 'node:path'

const masterFile = path.resolve('data/jlpt_n3_toan_master.json')
const exams = JSON.parse(fs.readFileSync(masterFile, 'utf8'))

console.log('--- INSPECTING ALL MONDAI 1 PASSAGES HEADER & INTROS ---')

for (const exam of exams) {
  const m1Part = (exam.parts || []).find(
    (p) => p.title && (p.title.includes('Mondai 1') || p.title.includes('問題 1') || p.title.includes('問題１')) &&
    (Number(p.sectionType) === 3 || p.title.includes('Đọc hiểu') || p.title.includes('読解'))
  )
  if (!m1Part) continue

  for (const q of m1Part.questions || []) {
    if (!q.passage) continue
    const introMatch = q.passage.match(/^<p>(これは[^\n<]+?(?:である|手紙|メモ|案内|メール|お知らせ|文章)[^<]*?。)<br>(.+?)(?:<br>|<\/p>)/)
    if (introMatch) {
      const intro = introMatch[1]
      const nextLine = introMatch[2]
      console.log(`[${exam.id} Q${q.id}] Next line after intro: "${nextLine.slice(0, 60)}"`)
    }
  }
}
