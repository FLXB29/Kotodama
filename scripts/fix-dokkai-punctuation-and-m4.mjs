import fs from 'node:fs'
import path from 'node:path'

const masterFile = path.resolve('data/jlpt_n3_toan_master.json')
const exams = JSON.parse(fs.readFileSync(masterFile, 'utf8'))

function cleanPassage(text) {
  if (!text || typeof text !== 'string') return text

  let s = text

  // 1. Remove <br> right before punctuation: 、，,。．.：:）］\]」』
  s = s.replace(/<br\s*\/?>\s*([、，,。．.：:）］\]」』])/gi, '$1')

  // 2. Remove <br> right after comma inside sentences (unless followed by bullet points)
  s = s.replace(/([、，,])\s*<br\s*\/?>\s*(?![【※★■●◆・]|注(?![\)）]))/gi, '$1')
  s = s.replace(/また、\s*<br\s*\/?>\s*\(注\)/gi, 'また、(注)')

  // 3. Fix (注) colon splits: e.g. (注 1)役割<br>:ここでは -> (注 1)役割：ここでは
  s = s.replace(/(\(注\s*\d*\)[^:<]*?)<br\s*\/?>\s*[:：]/gi, '$1：')
  s = s.replace(/(（注\s*\d*）[^:<]*?)<br\s*\/?>\s*[:：]/gi, '$1：')

  // 4. Fix words split before colons: e.g. 畳設備<br>：ベッド -> 畳<br>設備：ベッド
  s = s.replace(/畳設備<br\s*\/?>\s*[:：]/gi, '畳<br>設備：')
  s = s.replace(/([^\s<]+)<br\s*\/?>\s*[:：]/gi, '$1：')

  // 5. Fix closing quotes/brackets split across lines: e.g. 「朝市<br>」 -> 「朝市」
  s = s.replace(/([「『][^」』]*?)<br\s*\/?>\s*([」』])/gi, '$1$2')
  s = s.replace(/([（(][^）)]*?)<br\s*\/?>\s*([）)])/gi, '$1$2')

  // 6. Fix mid-sentence breaks before numerals or circled numbers:
  // e.g. "人は、<br>3%しか", "そして、<br>2 時間", "たびに、<br>②びっくり"
  s = s.replace(/([、，,])\s*<br\s*\/?>\s*([①-⑳\d])/gi, '$1$2')

  // 7. Fix prompt typo: 選びなさいい -> 選びなさい
  s = s.replace(/選びなさいい/g, '選びなさい')

  return s
}

let modifiedCount = 0

for (const exam of exams) {
  // Specifically fix 2025-12 q59 (picnic notice) and q60 (hotel room info)
  if (exam.id === 'toan-n3-202512-full') {
    for (const part of exam.parts) {
      for (const q of part.questions || []) {
        if (q.id === 'toan_q_2025_12_59') {
          q.passage = '<p>このお知らせが掲示板にはってある。<br>国際交流クラブ<br>春のピクニックのお知らせ<br>国際交流クラブの 会員でない方も参加できます。留学生も日本人学生も、ぜひ参加してください。<br>【日時】4月 20 日（土）14 時～16 時<br>【場所】花森公園 北広場<br>【参加費】300 円（当日集めます。会員は無料です。）<br>【その他】お菓子は 準備しますが、飲み物は持参してください。<br>参加の連絡は不要ですが、質問がある方はメールをください。<br>希望する方は、当日、年会費（2,000 円）を払えば、会員になることができます。その場合、参加費は無料になります。<br>東山大学 国際交流クラブ<br>代表：丸川良子 r_marukawa@higashiyama.ac.jp</p>'
          modifiedCount++
        }
        if (q.id === 'toan_q_2025_12_60') {
          q.passage = '<p>これは、ある旅館からサンディさんに届いたメールである。<br>サンディ・シン様<br>ご質問のメールをくださり、ありがとうございました。<br>3 月 25 日の「和室」のお部屋が空いているかというお尋ねでしたが、「和室」は全室予約が入っております。大変申し訳ございません。<br>ただ、ベッド付きの「和洋室」のお部屋でしたら、ご予約になれます。<br>ホームページで、お部屋の写真などもごらんになれますので、ぜひご検討ください。<br>なお、 桜の時期は、毎年たくさんのお客様がいらっしゃいます。ご予約になる場合は、お早めにお願いします。<br>＜和洋室のお部屋の情報＞<br>広さ：20ｍ2＋6 畳<br>設備：ベッド 2 台、風呂、トイレ、冷蔵庫、テレビ<br>2 名様、夕朝食付き 料金合計 42,000 円（税込み）<br>中雲山旅館 森田<br>ホームページ https://www.nakagumoyama.co.jp<br>電話 013-109-4475<br>メールアドレス morita@nakagumoyama.co.jp</p>'
          modifiedCount++
        }
      }
    }
  }

  for (const part of exam.parts) {
    const isMondai4 = part.title && (part.title.includes('Mondai 4') || part.title.includes('Tìm kiếm'))

    if (part.passage) {
      const orig = part.passage
      const cleaned = cleanPassage(orig)
      if (cleaned !== orig) {
        part.passage = cleaned
        modifiedCount++
      }
    }

    if (isMondai4) {
      // In Mondai 4, the passage is at part.passage (with the flyer image).
      // Clear duplicate question-level passages so it does not render twice!
      for (const q of part.questions || []) {
        if (q.passage) {
          q.passage = null
          modifiedCount++
        }
      }
    } else {
      for (const q of part.questions || []) {
        if (q.passage) {
          const orig = q.passage
          const cleaned = cleanPassage(orig)
          if (cleaned !== orig) {
            q.passage = cleaned
            modifiedCount++
          }
        }
      }
    }
  }
}

fs.writeFileSync(masterFile, JSON.stringify(exams, null, 2), 'utf8')
console.log(`Successfully updated ${masterFile} with ${modifiedCount} improvements.`)
