import fs from 'node:fs'

const exams = JSON.parse(fs.readFileSync('data/jlpt_n3_toan_master.json', 'utf8'))

const targets = [
  { exam: 'toan-n3-201007-full', q: 61 },
  { exam: 'toan-n3-201107-full', q: 59 },
  { exam: 'toan-n3-201107-full', q: 60 },
  { exam: 'toan-n3-201112-full', q: 59 },
  { exam: 'toan-n3-201212-full', q: 59 },
  { exam: 'toan-n3-201307-full', q: 59 },
  { exam: 'toan-n3-201307-full', q: 61 },
  { exam: 'toan-n3-201312-full', q: 59 },
  { exam: 'toan-n3-201407-full', q: 60 },
  { exam: 'toan-n3-201507-full', q: 59 },
  { exam: 'toan-n3-201507-full', q: 60 },
  { exam: 'toan-n3-201512-full', q: 61 },
  { exam: 'toan-n3-201607-full', q: 59 },
  { exam: 'toan-n3-201612-full', q: 59 },
  { exam: 'toan-n3-201612-full', q: 62 },
  { exam: 'toan-n3-201712-full', q: 60 },
  { exam: 'toan-n3-201712-full', q: 61 },
  { exam: 'toan-n3-201807-full', q: 59 },
  { exam: 'toan-n3-201807-full', q: 62 },
  { exam: 'toan-n3-201812-full', q: 61 },
  { exam: 'toan-n3-202012-full', q: 60 },
  { exam: 'toan-n3-202012-full', q: 61 },
]

for (const t of targets) {
  const e = exams.find((x) => x.id === t.exam)
  if (!e) continue
  const q = e.parts.flatMap((p) => p.questions || []).find((x) => x.number === t.q)
  if (q && q.passage) {
    console.log(`=== [${t.exam}] Q${t.q} ===`)
    console.log(q.passage)
    console.log()
  }
}
