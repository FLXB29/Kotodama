import fs from 'node:fs'
import path from 'node:path'

const masterFile = path.resolve('data/jlpt_n3_toan_master.json')
const exams = JSON.parse(fs.readFileSync(masterFile, 'utf8'))

const labels = [
  '日時', '場所', '会費', '参加費', '募集人数', '募集期間', '内容', '費用', 
  '対象', '持ち物', '連絡先', '電話', 'FAX', 'Eメール', 'メール', '主催', 
  '問合せ', '問い合わせ', '出発日', '代金合計', '振り込み先'
]

console.log('--- SCANNING FOR SMUSHED LABELS & LETTERS ---')

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

      const lines = p.text.split(/<br\s*\/?>/i)
      for (const line of lines) {
        const found = labels.filter((lbl) => line.includes(lbl + '：') || line.includes(lbl + ':'))
        if (found.length >= 2) {
          console.log(`[SMUSHED_LABELS] ${exam.id} ${p.id}: Found [${found.join(', ')}] in: "${line.slice(0, 80)}..."`)
        }
      }

      if (p.text.includes('拝啓') && !p.text.includes('拝啓<br>') && !p.text.includes('<br>拝啓')) {
        console.log(`[SMUSHED_HAIKEI] ${exam.id} ${p.id}`)
      }
    }
  }
}
