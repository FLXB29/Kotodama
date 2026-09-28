import fs from 'node:fs'
import path from 'node:path'

const masterFile = path.resolve('data/jlpt_n3_toan_master.json')
const exams = JSON.parse(fs.readFileSync(masterFile, 'utf8'))

console.log(`Analyzing all 30 exams for smushed headers, salutations, bullet items, and truncated lines...\n`)

const findings = []

for (const exam of exams) {
  const examId = exam.id
  for (const part of exam.parts) {
    const list = [
      { type: 'part', id: part.title, text: part.passage },
      ...(part.questions || []).map((q) => ({ type: 'q', id: `Q${q.number} (${q.id})`, text: q.passage })),
    ].filter((p) => Boolean(p.text))

    for (const item of list) {
      const text = item.text

      // 1. Smushed metadata headers: e.g. "件名：...送信日時：" or "日時：...会場："
      const smushedHeaders = text.match(/[^\s<br>]{2,}(あて先|宛先|件名|送信日時|発信|日時|会場|場所|会費|参加費|参加料|定員|費用|料金|広さ|設備|電話|メールアドレス|代表)[：:]/g)
      if (smushedHeaders) {
        // filter out valid patterns like "参加費：300円" if it's already preceded by <br> or 【
        const realSmushed = smushedHeaders.filter((h) => !h.startsWith('【') && !h.startsWith('>') && !h.startsWith('、'))
        if (realSmushed.length > 0) {
          findings.push({
            exam: examId,
            loc: item.id,
            kind: 'SMUSHED_HEADER',
            matches: realSmushed,
          })
        }
      }

      // 2. Smushed salutations: e.g. "中村さんおはよう", "ジョンさん先週", "中野様注文"
      const smushedSalutations = text.match(/[一-龯ぁ-んァ-ヶa-zA-Z]+(さん|様|先生)[一-龯ぁ-んァ-ヶ]/g)
      if (smushedSalutations) {
        // Filter out common false positives like "たくさんの" or "皆さんの"
        const filtered = smushedSalutations.filter(
          (s) => !s.includes('たくさん') && !s.includes('皆さん') && !s.includes('お客さん') && !s.includes('お母さん') && !s.includes('お父さん') && !s.includes('兄さん') && !s.includes('姉さん') && !s.includes('奥さん') && !s.includes('様子') && !s.includes('様々')
        )
        if (filtered.length > 0) {
          findings.push({
            exam: examId,
            loc: item.id,
            kind: 'SMUSHED_SALUTATION',
            matches: filtered,
          })
        }
      }

      // 3. Truncated sentence ending right before <br> or </p> (e.g. "がありま<br>", "していま<br>")
      const truncated = text.match(/[一-龯ぁ-んァ-ヶ]+(がありま|していま|なっていま|できま|れま)(<br|<\/p)/g)
      if (truncated) {
        findings.push({
          exam: examId,
          loc: item.id,
          kind: 'TRUNCATED_SENTENCE',
          matches: truncated,
        })
      }
    }
  }
}

console.log(`Found ${findings.length} formatting improvement opportunities:\n`)
for (const f of findings) {
  console.log(`[${f.exam}] [${f.loc}] ${f.kind}:`, f.matches)
}
