import fs from 'node:fs'
import path from 'node:path'

const masterPath = path.resolve('data/jlpt_n3_toan_master.json')
const exams = JSON.parse(fs.readFileSync(masterPath, 'utf8'))

const nattoPassage = [
  '<p>納豆は、体にいいし、おいしいので、私は毎日食べている。そのまま食べる人も多いが、私は卵に混ぜて焼いたり、みそ汁に入れたり、いろいろな料理に使っている。</p>',
  '<p>しかし、今朝テレビを見て驚いた。納豆には、ほかの食べ物にはない種類の酵素が入っている。これには血液の流れをよくする効果があるが、50度以上の熱で減ってしまうそうなのだ。そうだとすると、私は今まで、とてももったいない食べ方をしていたことになる。</p>',
  '<p><small>注）酵素：ここでは、食べ物に入っている栄養のような物</small></p>',
].join('')

const guitarPassage = [
  '<h3>中村ギター教室　生徒募集</h3>',
  '<p>★初めての方にもわかりやすく教えます。</p>',
  '<p>★教室に通うかどうか決める前に、60分の「特別割引レッスン」（1000円）を1回90分受けることができます。</p>',
  '<p><strong>講師：</strong>中村カズオ（西日本音楽大学卒業）</p>',
  '<p><strong>時間：</strong>1回90分（毎日10時〜21時の間）。日時は講師と予約を相談して決めます。</p>',
  '<p><strong>レッスンのタイプ：</strong>個人レッスンと、2〜3名で申し込めるグループレッスンがあります。</p>',
  '<p><strong>1ヵ月の料金：</strong>グループレッスンは1名分の料金です。</p>',
  '<table><thead><tr><th>回数</th><th>個人</th><th>グループ</th></tr></thead><tbody><tr><td>月2回</td><td>7,000円</td><td>6,000円</td></tr><tr><td>月3回</td><td>10,000円</td><td>8,000円</td></tr><tr><td>月4回</td><td>13,000円</td><td>10,000円</td></tr></tbody></table>',
  '<p><strong>学生割引：</strong>学生は上の料金から毎月1000円引きです。</p>',
  '<p><strong>平日昼間割引：</strong>平日（月〜金）の17時までにレッスンが終了する場合、上の料金から毎月2000円引きです。</p>',
  '<p>※二つの割引を同時に使うことはできません。<br>※毎月の料金は、前の月の最終日までにお支払いください。</p>',
  '<p><strong>特別割引レッスン：</strong>メールに名前、連絡先、レッスンのタイプ、希望日時を書いて申し込みます。グループの場合は代表者が申し込みます。料金（一人1000円）は当日支払います。自分のギターを使いたい人は持参してください。持ってこられない場合は、教室のギターを無料で借りられます。</p>',
  '<p>中村ギター教室　〒120-5599 春中市高木町6-2-3（春中駅から徒歩1分）</p>',
].join('')

const shoppingChallengeTable = [
  '<table><thead><tr><th>名前</th><th>利用した店の数</th><th>レシートの数</th><th>レシートの合計</th></tr></thead><tbody>',
  '<tr><td>森田さん</td><td>2店</td><td>8枚</td><td>7,520円</td></tr>',
  '<tr><td>ヨウさん</td><td>4店</td><td>4枚</td><td>9,080円</td></tr>',
  '<tr><td>東さん</td><td>4店</td><td>6枚</td><td>6,100円</td></tr>',
  '<tr><td>クレアさん</td><td>5店</td><td>7枚</td><td>4,340円</td></tr>',
  '</tbody></table>',
].join('')

const targets = new Map([
  ['toan_q_2023_12_61', { passage: nattoPassage, source: '1Yr4o92v_iySjcXZEdiKGKgcdvltqBqad', name: '14. N3 12.2023 .pdf' }],
  ['toan_q_2022_07_71', { passage: guitarPassage, source: '1_uKerTh0TUpMKN8gF_fsgwA5SkQs5ABu', name: '13. N3 7 2022.pdf' }],
  ['toan_q_2022_07_72', { passage: guitarPassage, source: '1_uKerTh0TUpMKN8gF_fsgwA5SkQs5ABu', name: '13. N3 7 2022.pdf' }],
  ['toan_q_2024_07_72', { questionTable: shoppingChallengeTable, source: '17J8BA7FDuQHsrqmwrXcfE3-EK2mDssfR', name: '15. N3 7.2024.pdf' }],
])

const found = new Set()
for (const exam of exams) {
  for (const part of exam.parts || []) {
    for (const question of part.questions || []) {
      const source = targets.get(question.id)
      if (!source) continue
      found.add(question.id)
      question.sourceTextExtracted = true
      question.readingSourceMissing = false
      question.sourcePassageSource = `${source.name} (Google Drive file ${source.source}; embedded PDF text layer)`
      if (source.passage) question.passage = source.passage
      if (source.questionTable) {
        const questionHtml = String(question.question || '')
        if (!questionHtml.includes('<img') && !questionHtml.includes('森田さん')) {
          throw new Error(`Expected source image or converted table in ${question.id}`)
        }
        question.question = questionHtml.replace(/<img\b[^>]*>/i, source.questionTable)
        const sentenceHtml = String(question.sentence || '')
        question.sentence = sentenceHtml.includes('<img')
          ? sentenceHtml.replace(/<img\b[^>]*>/i, source.questionTable)
          : sentenceHtml.includes('森田さん')
            ? sentenceHtml
            : `${sentenceHtml}${source.questionTable}`
      }
      if (question.id === 'toan_q_2022_07_71') {
        const fixed = (value) => String(value || '').replaceAll('グループルッスン', 'グループレッスン')
        question.question = fixed(question.question)
        question.sentence = fixed(question.sentence)
      }
    }
  }
}

const missingTargets = [...targets.keys()].filter((id) => !found.has(id))
if (missingTargets.length) throw new Error(`Question IDs not found: ${missingTargets.join(', ')}`)
const stillImages = [...targets.keys()].filter((id) => {
  for (const exam of exams) for (const part of exam.parts || []) for (const q of part.questions || []) {
    if (q.id === id) return /<img\b/i.test([q.passage, q.question, q.sentence].join(' '))
  }
  return true
})
if (stillImages.length) throw new Error(`Passage images remain: ${stillImages.join(', ')}`)

fs.writeFileSync(masterPath, `${JSON.stringify(exams, null, 2)}\n`, 'utf8')
console.log(`Converted ${found.size} reading questions to source text: ${[...found].join(', ')}`)
