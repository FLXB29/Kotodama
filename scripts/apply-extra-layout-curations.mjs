import fs from 'node:fs'
import path from 'node:path'

const masterFile = path.resolve('data/jlpt_n3_toan_master.json')
const exams = JSON.parse(fs.readFileSync(masterFile, 'utf8'))

let totalFixes = 0

function replaceInString(str, from, to, desc) {
  if (typeof str !== 'string') return str
  if (str.includes(from)) {
    totalFixes++
    console.log(`[FIX] ${desc}: replaced "${from.slice(0, 30)}..." with "${to.slice(0, 30)}..."`)
    return str.replace(from, to)
  }
  return str
}

for (const exam of exams) {
  for (const part of exam.parts || []) {
    for (const q of part.questions || []) {
      if (!q.passage) continue

      // 2025-07 Q59
      if (exam.id === 'toan-n3-202507-full' && q.id === 'toan_q_2025_07_59') {
        q.passage = replaceInString(
          q.passage,
          '1 月 25 日図書館の休館と特別窓口のお知らせ緑図書館は、',
          '1 月 25 日<br>図書館の休館と特別窓口のお知らせ<br>緑図書館は、',
          `${exam.id} Q59 notice layout`
        )
      }

      // 2024-12 Q60
      if (exam.id === 'toan-n3-202412-full' && q.id === 'toan_q_2024_12_60') {
        q.passage = replaceInString(
          q.passage,
          'ミンさん子どもが熱を出したので、早退します。',
          'ミンさん<br>子どもが熱を出したので、早退します。',
          `${exam.id} Q60 salutation break`
        )
        q.passage = replaceInString(
          q.passage,
          '9 月 8 日 12:10原口</p>',
          '9 月 8 日 12:10<br>原口</p>',
          `${exam.id} Q60 signature break`
        )
      }

      // 2019-12 Q60
      if (exam.id === 'toan-n3-201912-full' && q.id === 'toan_q_2019_12_60') {
        q.passage = replaceInString(
          q.passage,
          '中野文房具中野様',
          '中野文房具<br>中野様',
          `${exam.id} Q60 salutation break`
        )
      }

      // 2013-12 Q61
      if (exam.id === 'toan-n3-201312-full' && q.id === 'toan_q_2013_12_61') {
        q.passage = replaceInString(
          q.passage,
          '11 月 29 日ふじ図書館</p>',
          '11 月 29 日<br>ふじ図書館</p>',
          `${exam.id} Q61 signature break`
        )
      }

      // 2012-12 Q62
      if (exam.id === 'toan-n3-201212-full' && q.id === 'toan_q_2012_12_62') {
        q.passage = replaceInString(
          q.passage,
          '12 月 1 日南山鉄道</p>',
          '12 月 1 日<br>南山鉄道</p>',
          `${exam.id} Q62 signature break`
        )
      }

      // 2011-12 Q61
      if (exam.id === 'toan-n3-201112-full' && q.id === 'toan_q_2011_12_61') {
        q.passage = replaceInString(
          q.passage,
          '大西さん以下のことを、よろしくお願いします。<br>',
          '大西さん<br>以下のことを、よろしくお願いします。<br>',
          `${exam.id} Q61 salutation break`
        )
        q.passage = replaceInString(
          q.passage,
          '1. 買い物 (領収書もお願いします。)クリップ(中)',
          '1. 買い物 (領収書もお願いします。)<br>クリップ(中)',
          `${exam.id} Q61 item break`
        )
        q.passage = replaceInString(
          q.passage,
          '2. 会議用資料の準備箱の中の資料',
          '2. 会議用資料の準備<br>箱の中の資料',
          `${exam.id} Q61 item break`
        )
      }
    }
  }
}

fs.writeFileSync(masterFile, JSON.stringify(exams, null, 2), 'utf8')
console.log(`\nSuccessfully applied ${totalFixes} extra layout curations.`)
