import fs from 'node:fs'

const drafts = JSON.parse(fs.readFileSync('reports/n3-quality-audit/source-import-draft.json', 'utf8'))
console.log('Total exams in draft:', drafts.length)
for (let i = 0; i < drafts.length; i++) {
  const d = drafts[i]
  console.log(`${i + 1}. ${d.examId} | ${d.source} | Drive ID: ${d.sourceId}`)
}
