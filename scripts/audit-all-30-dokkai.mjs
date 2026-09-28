import fs from 'node:fs'
import path from 'node:path'

const masterFile = path.resolve('data/jlpt_n3_toan_master.json')
const exams = JSON.parse(fs.readFileSync(masterFile, 'utf8'))

console.log(`Loaded ${exams.length} exams. Beginning exhaustive Dokkai audit...\n`)

const report = []

for (const exam of exams) {
  const examId = exam.id
  const match = examId.match(/^toan-n3-(\d{4})(\d{2})-full$/)
  const year = match ? match[1] : 'unknown'
  const session = match ? match[2] : 'unknown'

  const examSummary = {
    examId,
    year,
    session,
    dokkaiParts: [],
    issues: [],
    m4ImageValid: false,
    m4ImagePath: null,
    totalPassages: 0,
    totalQuestions: 0,
  }

  // Find dokkai parts (sectionType === 3 or title includes Đọc hiểu / 読解)
  const dokkaiParts = (exam.parts || []).filter(
    (p) => Number(p.sectionType) === 3 || (p.title && (p.title.includes('Đọc hiểu') || p.title.includes('読解')))
  )

  for (const part of dokkaiParts) {
    const isM4 = Boolean(part.title && (part.title.includes('Mondai 4') || part.title.includes('Tìm kiếm')))
    const partPassage = part.passage || ''
    const questions = part.questions || []
    examSummary.totalQuestions += questions.length

    const partInfo = {
      title: part.title,
      isM4,
      hasPartPassage: Boolean(partPassage),
      questionCount: questions.length,
      questionPassagesCount: questions.filter((q) => Boolean(q.passage)).length,
    }

    if (partPassage) examSummary.totalPassages++
    examSummary.totalPassages += partInfo.questionPassagesCount

    // Check M4 Image
    if (isM4) {
      const imgMatch = partPassage.match(/src="([^"]+)"/)
      if (imgMatch) {
        examSummary.m4ImagePath = imgMatch[1]
        const diskPath = path.join(process.cwd(), 'public', imgMatch[1].replace(/^\//, ''))
        if (fs.existsSync(diskPath)) {
          const stats = fs.statSync(diskPath)
          examSummary.m4ImageValid = stats.size > 10000
          partInfo.imageSizeKB = Math.round(stats.size / 1024)
        } else {
          examSummary.issues.push(`M4 image file does not exist on disk: ${diskPath}`)
        }
      } else {
        examSummary.issues.push(`M4 part passage has NO <img src="..."> tag`)
      }

      // Check for duplicate passage in M4 questions
      questions.forEach((q, idx) => {
        if (q.passage) {
          examSummary.issues.push(`M4 Question ${q.number || idx + 1} has duplicate q.passage`)
        }
      })
    }

    // Check all passages in this part
    const passagesToCheck = [
      { source: `${part.title} (part.passage)`, text: partPassage },
      ...questions.map((q, idx) => ({
        source: `${part.title} Q${q.number || idx + 1}`,
        text: q.passage,
      })),
    ].filter((p) => Boolean(p.text))

    for (const item of passagesToCheck) {
      const text = item.text

      // 1. Linebreak immediately followed by punctuation
      const p1 = text.match(/.{0,20}<br\s*\/?>\s*[、，,。．.：:）］\]」』?!].{0,20}/g)
      if (p1) {
        examSummary.issues.push({
          type: 'BR_BEFORE_PUNCT',
          source: item.source,
          matches: p1,
        })
      }

      // 2. Linebreak immediately preceded by comma inside sentence
      const p2 = text.match(/.{0,20}[、，,]\s*<br\s*\/?>\s*(?![【※★■●◆・]|注).{0,20}/g)
      if (p2) {
        examSummary.issues.push({
          type: 'COMMA_BEFORE_BR',
          source: item.source,
          matches: p2,
        })
      }

      // 3. Watermark check
      const wm = text.match(/(JLPT[・\s]N3[^\s"<>]*|N3\s+\d{1,2}\/\d{4})/i)
      if (wm) {
        examSummary.issues.push({
          type: 'WATERMARK_IN_PASSAGE',
          source: item.source,
          matches: wm[0],
        })
      }

      // 4. Trailing page number check
      const tp = text.match(/([。！？」）\w\u3040-\u30ff\u4e00-\u9faf])(\d{1,2})\s*<\/p>$/)
      if (tp && !text.match(/\b\d{4}\s*<\/p>$/)) {
        examSummary.issues.push({
          type: 'TRAILING_PAGE_NUM',
          source: item.source,
          matches: tp[0],
        })
      }

      // 5. Genuine Mid-word linebreak
      // Exclude valid line boundaries (salutations, bullet lists, metadata labels, dates, signatures)
      const validPre = /(?:[様さん先生君殿各位へ男園せ]|知らせ|ご案内|案内|メモ|広告|お願い|こと|プリント|募集|代表|準備|サービス|について|[年月日時分円課部社会室館組係名点人階号所店方線駅道校袋箱本冊枚台畳者長]|森田|高木|野口|中野|伊藤|佐藤|鈴木|田中|山本|機械|電気|工業|デパート|文房具|鉄道|図書館|クラブ|係|担当|拝啓|敬具|草々|[。！？」』）\)\]＞>・●■◆★※])$/
      const validPost = /^(?:[・●■◆★※注（(〈＜【]|第?\d+[.、)）]|あて先|件名|送信日時|日時|場所|会費|参加費|定員|広さ|設備|内容|費用|時間|期間|対象|持ち物|連絡先|電話|FAX|E\s*メール|メール|主催|問合せ|問い合わせ|ツアー名|出発日|代金合計|振り込み先|司会|パソコン|花束|ビデオカメラ|受付|募集人数|応募方法|応募できる方|お疲れ|いつも|ごぶさた|こんにちは|おはよう|先週|先日|今、|注文した|東山|岩丸|ナカノ|中野|カレン|原口|太田|川田|川村|緑図書館|ふじ図書館|南山鉄道|石野旅行|日本ノート|拝啓)/

      const allBrs = [...text.matchAll(/([\u3040-\u30ff\u4e00-\u9faf]{1,10})<br\s*\/?>([\u3040-\u30ff\u4e00-\u9faf]{1,10})/g)]
      const badBrs = allBrs.filter((m) => {
        const pre = m[1]
        const post = m[2]
        if (validPre.test(pre)) return false
        if (validPost.test(post)) return false
        return true
      })

      if (badBrs.length > 0) {
        examSummary.issues.push({
          type: 'MID_WORD_BR',
          source: item.source,
          count: badBrs.length,
          samples: badBrs.map((m) => m[0]).slice(0, 3),
        })
      }

      // 6. Broken bracket/quote
      const p4 = text.match(/[「『][^」』]*?<br\s*\/?>\s*[」』]/g)
      if (p4) {
        examSummary.issues.push({
          type: 'BROKEN_QUOTE',
          source: item.source,
          matches: p4,
        })
      }

      // 7. Multiple consecutive breaks
      const p5 = text.match(/<br\s*\/?>\s*<br\s*\/?>\s*<br\s*\/?>/g)
      if (p5) {
        examSummary.issues.push({
          type: 'EXCESSIVE_BR',
          source: item.source,
          matches: p5,
        })
      }
    }

    examSummary.dokkaiParts.push(partInfo)
  }

  report.push(examSummary)
}

// Summary Statistics
let totalIssues = 0
let examsWithIssues = 0

console.log('='.repeat(80))
console.log('EXHAUSTIVE DOKKAI AUDIT RESULTS ACROSS 30 EXAMS')
console.log('='.repeat(80))

for (const ex of report) {
  const issueCount = ex.issues.length
  totalIssues += issueCount
  if (issueCount > 0) examsWithIssues++

  const m4Status = ex.m4ImageValid
    ? `M4 Image OK (${ex.m4ImagePath})`
    : `M4 Image INVALID/MISSING (${ex.m4ImagePath})`
  const issueStatus = issueCount === 0 ? '✓ CLEAN' : `⚠ ${issueCount} ISSUES`

  console.log(
    `[${ex.year}-${ex.session}] ${ex.examId.padEnd(24)} | Parts: ${ex.dokkaiParts.length} | Qs: ${String(ex.totalQuestions).padStart(2)} | Passages: ${String(ex.totalPassages).padStart(2)} | ${m4Status} | ${issueStatus}`
  )

  if (issueCount > 0) {
    for (const iss of ex.issues) {
      if (typeof iss === 'string') {
        console.log(`     - [ERROR] ${iss}`)
      } else {
        console.log(`     - [${iss.type}] in ${iss.source}:`, JSON.stringify(iss.matches || iss.samples || iss.count))
      }
    }
  }
}

console.log('='.repeat(80))
console.log(`TOTAL EXAMS: ${report.length}`)
console.log(`EXAMS WITH ISSUES: ${examsWithIssues}`)
console.log(`TOTAL DETECTED ISSUES: ${totalIssues}`)
console.log('='.repeat(80))
