import fs from 'node:fs'
import path from 'node:path'

const masterFile = path.resolve('data/jlpt_n3_toan_master.json')
const content = fs.readFileSync(masterFile, 'utf8')

const regexes = [
  /JLPT[・\s]N3[^\s"<>]+/gi,
  /N3\s+\d{1,2}\/\d{4}/gi,
  /\b\d{1,2}\/\d{4}\b/g
]

for (const r of regexes) {
  const matches = [...content.matchAll(r)]
  console.log(`Pattern ${r} found ${matches.length} matches:`)
  for (const m of matches) {
    const idx = m.index
    const ctx = content.slice(Math.max(0, idx - 40), Math.min(content.length, idx + 40)).replace(/\n/g, ' ')
    console.log(`   [${m[0]}] => ...${ctx}...`)
  }
}
