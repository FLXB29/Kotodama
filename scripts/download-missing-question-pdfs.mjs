import fs from 'node:fs'
import path from 'node:path'

const drafts = JSON.parse(fs.readFileSync('reports/n3-quality-audit/source-import-draft.json', 'utf8'))
const targetDir = path.resolve('tmp/original-question-pdfs')
if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true })
}

async function downloadFile(url, dest) {
  const res = await fetch(url)
  if (!res.ok) {
    throw new Error(`HTTP ${res.status} ${res.statusText}`)
  }
  const buffer = Buffer.from(await res.arrayBuffer())
  fs.writeFileSync(dest, buffer)
  return buffer.length
}

async function run() {
  console.log(`Checking ${drafts.length} exams for missing PDFs...`)
  let downloaded = 0
  let skipped = 0

  for (const draft of drafts) {
    const sessionKey = draft.exam.replace('/', '-')
    const canonicalName = `n3-${sessionKey}-question.pdf`
    const dest = path.join(targetDir, canonicalName)

    if (fs.existsSync(dest) && fs.statSync(dest).size > 100_000) {
      console.log(`[SKIP] Already exists: ${canonicalName} (${fs.statSync(dest).size} bytes)`)
      skipped++
      continue
    }

    const downloadUrl = `https://drive.usercontent.google.com/download?id=${draft.sourceId}&export=download&authuser=0`
    console.log(`[DOWNLOADING] ${draft.examId} (${draft.source}) from Drive ID ${draft.sourceId}...`)
    try {
      const bytes = await downloadFile(downloadUrl, dest)
      console.log(`[OK] Saved ${canonicalName} (${bytes} bytes)`)
      downloaded++
    } catch (err) {
      console.error(`[FAIL] ${draft.examId}: ${err.message}`)
    }
  }

  console.log(`\nFinished: ${downloaded} downloaded, ${skipped} skipped. Total: ${downloaded + skipped}/30`)
}

run()
