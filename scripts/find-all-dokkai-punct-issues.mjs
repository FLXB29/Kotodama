import fs from 'node:fs'

const data = JSON.parse(fs.readFileSync('data/jlpt_n3_toan_master.json', 'utf8'))
const issues = []

for (const exam of data) {
  for (const part of exam.parts) {
    const passages = [
      { type: 'part', id: part.id || part.title, text: part.passage },
      ...(part.questions || []).map((q, idx) => ({ type: 'q', id: q.id || `q${idx}`, text: q.passage }))
    ].filter(p => Boolean(p.text))

    for (const p of passages) {
      const text = p.text

      // 1. <br> right before punctuation
      const m1 = text.match(/.{0,25}<br\s*\/?>\s*[、，,。．.：:）］\]」』].{0,25}/g)
      if (m1) issues.push({ exam: exam.id, id: p.id, kind: 'br-before-punct', matches: m1 })

      // 2. comma right before <br>
      const m2 = text.match(/.{0,25}[、，,]<br\s*\/?>.{0,25}/g)
      if (m2) issues.push({ exam: exam.id, id: p.id, kind: 'comma-before-br', matches: m2 })

      // 3. colon right before <br>
      const m3 = text.match(/.{0,25}[:：]<br\s*\/?>.{0,25}/g)
      if (m3) issues.push({ exam: exam.id, id: p.id, kind: 'colon-before-br', matches: m3 })

      // 4. word split before colon: e.g. 設備<br>：
      const m4 = text.match(/.{0,25}[^\s<]+<br\s*\/?>\s*[:：].{0,25}/g)
      if (m4) issues.push({ exam: exam.id, id: p.id, kind: 'word-before-colon-br', matches: m4 })
    }
  }
}

console.log('Total issues found:', issues.length)
for (const iss of issues) {
  console.log(`[${iss.exam} ${iss.id}] ${iss.kind}:`)
  for (const m of iss.matches) {
    console.log('   ', JSON.stringify(m))
  }
}
