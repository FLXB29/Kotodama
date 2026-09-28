import fs from 'node:fs'
import path from 'node:path'
import { DatabaseSync } from 'node:sqlite'

const root = path.resolve('.')
const masterPath = path.join(root, 'data/jlpt_n3_toan_master.json')
const curatedPath = path.join(root, 'data/jlpt_n3_explanations_curated.json')
const reportPath = path.join(root, 'reports/n3-quality-audit/vocabulary-gloss-coverage.json')
const apply = process.argv.includes('--apply')
const m5Only = process.argv.includes('--m5-only')
const m1Only = process.argv.includes('--m1-only')
const coverageArgument = process.argv.find((argument) => argument.startsWith('--min-coverage='))
const minimumTokenCoverage = coverageArgument ? Number(coverageArgument.split('=')[1]) : 0.45
if (!Number.isFinite(minimumTokenCoverage) || minimumTokenCoverage <= 0 || minimumTokenCoverage > 1) {
  throw new Error('--min-coverage must be greater than 0 and at most 1')
}
const exams = JSON.parse(fs.readFileSync(masterPath, 'utf8'))
const curated = JSON.parse(fs.readFileSync(curatedPath, 'utf8'))
const db = new DatabaseSync(path.join(root, 'data/master_dictionary.db'), { readOnly: true })
const rows = db.prepare('SELECT word, reading, han_viet, jlpt, pos, meanings, verified FROM words').all()
db.close()

const byWord = new Map()
for (const row of rows) {
  if (row.word) {
    const matches = byWord.get(row.word) || []
    matches.push(row)
    byWord.set(row.word, matches)
  }
}

const segmenter = new Intl.Segmenter('ja', { granularity: 'word' })
const particles = new Set([
  'は',
  'が',
  'を',
  'に',
  'で',
  'と',
  'も',
  'へ',
  'から',
  'まで',
  'より',
  'の',
  'や',
  'か',
  'ね',
  'よ',
])
const contextualTargetGlosses = new Map([
  ['toan_q_2025_12_31', '「握る」（にぎる）: nắm hoặc cầm chặt; ở đây là nắm tay em trai.'],
  ['toan_q_2025_12_34', '「懐かしい」（なつかしい）: gợi nhớ quá khứ thân thuộc, khiến người ta bồi hồi.'],
  ['toan_q_2025_07_31', '「減少」（げんしょう）: giảm sút về số lượng; ở đây nói dân số giảm.'],
  ['toan_q_2025_07_34', '「皮」（かわ）: lớp vỏ ngoài của rau củ hoặc quả; ở đây là vỏ khoai tây.'],
  ['toan_q_2025_07_35', '「オーダーする」: gọi hoặc đặt món ở nhà hàng.'],
  ['toan_q_2024_12_35', '「性格」（せいかく）: tính cách của một người.'],
  ['toan_q_2021_07_31', '「オーバーする」: vượt quá mức dự định; ở đây là chi vượt ngân sách 10.000 yên.'],
  ['toan_q_2021_07_34', '「詰める」（つめる）: xếp hoặc nhét đồ vào túi, va-li hay vật chứa.'],
  ['toan_q_2014_12_31', '「貯まる」（たまる）: tích cóp, để dành được tiền.'],
  ['toan_q_2014_12_35', '「離す」（はなす）: đặt cách xa hoặc tách ra; ở đây là đặt bình cách xa lửa.'],
  ['toan_q_2014_07_31', '「内容」（ないよう）: nội dung/thông tin của thư.'],
  ['toan_q_2014_07_32', '「発展」（はってん）: phát triển, mở rộng về quy mô hoặc trình độ.'],
  ['toan_q_2014_07_33', '「伝わる」（つたわる）: được truyền đến hoặc du nhập từ nơi khác.'],
  ['toan_q_2014_07_35', '「期限」（きげん）: thời hạn cuối hoặc hạn chót đã quy định.'],
  ['toan_q_2023_12_31', '「診察」（しんさつ）: bác sĩ khám và kiểm tra tình trạng sức khỏe của bệnh nhân.'],
  ['toan_q_2023_12_32', '「行き先」（いきさき）: nơi sẽ đến/điểm đến của chuyến đi.'],
  ['toan_q_2023_12_33', '「取り消す」（とりけす）: hủy bỏ một đặt chỗ, quyết định hoặc thỏa thuận.'],
  ['toan_q_2023_12_34', '「共通」（きょうつう）: chung, có cùng điểm/đặc điểm giữa nhiều người hoặc vật.'],
  ['toan_q_2023_12_35', '「詰める」（つめる）: xếp, nhét đồ vào túi hoặc vật chứa.'],
  ['toan_q_2022_12_31', '「発展」（はってん）: phát triển về quy mô, mức độ hoặc lĩnh vực.'],
  ['toan_q_2022_12_32', '「抱く」（だく）: ôm/bế ai đó bằng tay.'],
  ['toan_q_2022_12_33', '「原料」（げんりょう）: nguyên liệu ban đầu dùng để sản xuất sản phẩm khác.'],
  ['toan_q_2022_12_34', '「異常」（いじょう）: bất thường, khác hẳn mức bình thường.'],
  ['toan_q_2022_12_35', '「重なる」（かさなる）: chồng lên nhau hoặc xảy ra trùng thời điểm.'],
  ['toan_q_2013_12_31', '「早退」（そうたい）: rời nơi làm việc hoặc trường học trước giờ tan.'],
  [
    'toan_q_2013_07_33',
    '「発生」（はっせい）: phát sinh hoặc được tạo ra; ở đây là khí độc sinh ra khi trộn chất tẩy rửa.',
  ],
  ['toan_q_2012_12_32', '「空」（から）: trống, rỗng; ở đây là chai đã uống hết, không đọc là そら “bầu trời”.'],
  ['toan_q_2011_12_31', '「断る」（ことわる）: từ chối một lời mời hoặc yêu cầu.'],
  ['toan_q_2011_07_33', '「見送る」（みおくる）: tiễn ai đó khi họ lên đường.'],
  ['toan_q_2010_07_32', '「量る」（はかる）: cân hoặc đong một lượng; ở đây là cân bột mì và bơ.'],
  ['toan_q_2010_07_33', '「ユーモア」: sự hài hước, khiếu gây cười.'],
  ['toan_q_2010_07_35', '「そっくり」: giống hệt hoặc rất giống nhau; ở đây giống cả mặt lẫn giọng.'],
  ['toan_q_2014_07_34', '「怒鳴る」（どなる）: quát lớn, hét vào ai đó.'],
  ['toan_q_2013_12_35', '「零す」（こぼす）: làm đổ hoặc làm tràn chất lỏng.'],
  ['toan_q_2013_07_34', '「握る」（にぎる）: nắm chặt bằng tay.'],
  ['toan_q_2013_07_35', '「怠い」（だるい）: mệt mỏi, uể oải toàn thân.'],
  ['toan_q_2011_12_32', '「緩い」（ゆるい）: lỏng hoặc rộng; ở đây là quần rộng nên phải siết dây nịt.'],
  ['toan_q_2011_07_31', '「転ぶ」（ころぶ）: ngã; ở đây là ngã ở cầu thang và bị thương.'],
])
const contextualM1Glosses = new Map([
  ['toan_q_2025_07_5', '「呼吸」（こきゅう）: hô hấp, hơi thở; 呼吸をする là thở.'],
  ['toan_q_2024_12_6', '「深い」（ふかい）: sâu; 深く là dạng trạng từ “một cách sâu”.'],
  ['toan_q_2024_12_8', '「残す」（のこす）: để lại, chừa lại; 残さないで là đừng để thừa lại.'],
  ['toan_q_2023_07_4', '「細い」（ほそい）: hẹp/mảnh; ở đây nói bề ngang con đường nhỏ dần.'],
  ['toan_q_2022_07_6', '「包む」（つつむ）: gói hoặc bọc một vật bằng giấy/vải.'],
  ['toan_q_2021_12_7', '「恋しい」（こいしい）: nhớ da diết, mong được gặp/lại gần; ở đây là nhớ món ăn quê nhà.'],
  ['toan_q_2021_07_3', '「悲しい」（かなしい）: buồn; 悲しそう là trông có vẻ buồn.'],
  ['toan_q_2019_07_7', '「包む」（つつむ）: gói hoặc bọc một vật; ở đây nhờ người khác gói món đồ.'],
  ['toan_q_2017_12_2', '「燃える」（もえる）: cháy, bắt lửa; 燃えません nghĩa là không cháy.'],
  ['toan_q_2017_12_7', '「結ぶ」（むすぶ）: buộc hoặc thắt nút; ở đây là buộc cho gọn/đẹp.'],
  ['toan_q_2017_07_6', '「転ぶ」（ころぶ）: vấp/ngã; 転んだとき là lúc bị ngã.'],
  ['toan_q_2012_07_6', '「平日」（へいじつ）: ngày thường trong tuần, đối lập với ngày nghỉ.'],
  ['toan_q_2012_07_8', '「固い」（かたい）: cứng/chặt; ở đây vặn nắp chai thật chặt.'],
  ['toan_q_2010_07_1', '「包む」（つつむ）: gói hoặc bọc; món quà được gói bằng giấy đẹp.'],
])
const normalize = (value) =>
  String(typeof value === 'object' && value ? value.text || '' : value || '')
    .replace(/^\s*[1-4１-４][.．、\s　]*/u, '')
    .replace(/^[①②③④]\s*/, '')
    .replace(/[\s　]/g, '')
    .replace(/[「」『』（）()［］【】。、，,。！？!?・]/g, '')
    .trim()

function choose(rows, surface) {
  if (!rows?.length) return null
  return [...rows].sort((a, b) => {
    const score = (row) =>
      Number(row.word === surface) * 100 +
      Number(row.verified) * 20 +
      Number(String(row.jlpt || '').includes('N3')) * 10 +
      Number(Boolean(row.meanings)) * 5 +
      Number(Boolean(row.reading))
    return score(b) - score(a)
  })[0]
}

function lemmaCandidates(value) {
  const candidates = new Set([value])
  const add = (prefix, suffixes) => suffixes.forEach((suffix) => candidates.add(prefix + suffix))

  if (/(?:ました|ませんでした|ません|ます)$/.test(value)) {
    const stem = value.replace(/(?:ました|ませんでした|ません|ます)$/, '')
    candidates.add(`${stem}る`)
    candidates.add(`${stem}す`)
    const godan = { い: 'う', き: 'く', ぎ: 'ぐ', し: 'す', ち: 'つ', に: 'ぬ', び: 'ぶ', み: 'む', り: 'る' }
    const last = [...stem].at(-1)
    if (godan[last]) candidates.add(`${stem.slice(0, -1)}${godan[last]}`)
  }
  for (const ending of [
    'ていました',
    'ていた',
    'ている',
    'ています',
    'ていない',
    'ていなくて',
    'てしまった',
    'てしまう',
    'てしまい',
    'ておく',
    'てくる',
  ]) {
    if (value.endsWith(ending)) add(value.slice(0, -ending.length), ['る'])
  }
  for (const ending of ['ませんでした', 'ました', 'ません', 'ます']) {
    if (value.endsWith(ending)) {
      const stem = value.slice(0, -ending.length)
      add(stem, ['る', 'う', 'く', 'ぐ', 'す', 'つ', 'ぬ', 'ぶ', 'む', 'る'])
      const last = [...stem].at(-1)
      const godan = { い: 'う', き: 'く', ぎ: 'ぐ', し: 'す', ち: 'つ', に: 'ぬ', び: 'ぶ', み: 'む', り: 'る' }
      if (godan[last]) candidates.add(`${stem.slice(0, -1)}${godan[last]}`)
    }
  }
  for (const ending of ['なかった', 'くない', 'くて', 'かった']) {
    if (value.endsWith(ending)) candidates.add(`${value.slice(0, -ending.length)}い`)
  }
  if (value.endsWith('て') || value.endsWith('た')) {
    const ending = value.endsWith('て') ? 'て' : 'た'
    const stem = value.slice(0, -1)
    add(stem, ['る', 'う', 'つ', 'く', 'ぐ', 'す', 'ぬ', 'ぶ', 'む'])
    const rules =
      ending === 'て'
        ? [
            ['って', ['う', 'つ', 'る']],
            ['いて', ['く']],
            ['いで', ['ぐ']],
            ['んで', ['む', 'ぶ', 'ぬ']],
            ['して', ['す', 'する']],
          ]
        : [
            ['った', ['う', 'つ', 'る']],
            ['いた', ['く']],
            ['いだ', ['ぐ']],
            ['んだ', ['む', 'ぶ', 'ぬ']],
            ['した', ['す', 'する']],
          ]
    for (const [suffix, lemmas] of rules) {
      if (value.endsWith(suffix)) add(value.slice(0, -suffix.length), lemmas)
    }
    if (value === '行って' || value === '行った') candidates.add('行く')
    if (value === '来て' || value === '来た') candidates.add('来る')
    if (value === 'して' || value === 'した') candidates.add('する')
  }
  if (value.endsWith('ない')) {
    const stem = value.slice(0, -2)
    const godan = { わ: 'う', か: 'く', が: 'ぐ', さ: 'す', た: 'つ', な: 'ぬ', ば: 'ぶ', ま: 'む', ら: 'る' }
    const last = [...stem].at(-1)
    if (godan[last]) candidates.add(`${stem.slice(0, -1)}${godan[last]}`)
    candidates.add(`${stem}る`)
    candidates.add(`${stem}い`)
  }
  return [...candidates].filter(Boolean)
}

function lookupToken(token) {
  const candidates = lemmaCandidates(token)
  for (const candidate of candidates) {
    const word = choose(byWord.get(candidate), candidate)
    if (word) return word
  }
  return null
}

function glossaryFor(option) {
  const surface = normalize(option)
  if (!surface || surface.length > 18) return null
  const direct = lookupToken(surface)
  if (direct) return { surface, entries: [direct], coverage: 1 }

  const tokens = Array.from(segmenter.segment(surface), (entry) => entry.segment).filter(
    (token) => token && !particles.has(token) && !/^[0-9０-９]+$/u.test(token)
  )
  if (tokens.length < 2 || !tokens.some((token) => token.length >= 2 && /[一-龯々ァ-ヺ]/u.test(token))) return null
  const entries = []
  for (const token of tokens) {
    if (token.length < 2 && !/[一-龯々]/u.test(token)) continue
    if (/^[ぁ-ゖァ-ヺー]+$/u.test(token)) continue
    const entry = lookupToken(token)
    if (entry) entries.push(entry)
  }
  const unique = [...new Map(entries.map((entry) => [entry.word, entry])).values()]
  const coveredChars = unique.reduce((sum, entry) => sum + entry.word.length, 0)
  const coverage = Math.min(1, coveredChars / surface.length)
  if (!unique.length || coverage < minimumTokenCoverage) return null
  return { surface, entries: unique.slice(0, 4), coverage }
}

function formatGloss(entry) {
  let rawMeanings = []
  try {
    rawMeanings = JSON.parse(entry.meanings || '[]')
  } catch {
    /* skip malformed local rows */
  }
  const seenMeanings = new Set()
  const meanings = []
  for (const rawMeaning of rawMeanings) {
    const value = String(rawMeaning || '')
      .replace(/[；;，,、。.!！?？]+$/u, '')
      .trim()
    const key = value.normalize('NFKC').toLocaleLowerCase('vi-VN')
    if (!value || seenMeanings.has(key)) continue
    seenMeanings.add(key)
    meanings.push(value)
    if (meanings.length === 2) break
  }
  const meaning = meanings.join('；')
  if (!meaning) return null
  const primaryReading = String(entry.reading || '').split(/\s+/u)[0]
  const reading = primaryReading ? `（${primaryReading}）` : ''
  return `「${entry.word}」${reading}: ${meaning}`
}

function targetWord(question) {
  const text = String(question?.question || '')
    .replace(/<[^>]*>/gu, ' ')
    .replace(/&nbsp;|&#160;/gu, ' ')
    .replace(/&amp;/gu, '&')
    .replace(/\s+/gu, ' ')
    .trim()
  const match = text.match(/^(?:\[?\s*[0-9０-９]+\s*\]?)[\s　]+(.+?)\s*$/u)
  if (!match) return null
  const surface = match[1].replace(/[「」『』（）()［］【】。、，,。！？!?・]/gu, '').trim()
  if (!surface || surface.length > 18 || /[\s　]/u.test(surface)) return null
  return lookupToken(surface)
}

function underlinedWord(question) {
  const match = String(question?.question || '').match(/<u\b[^>]*>([\s\S]*?)<\/u>/iu)
  return match?.[1]?.replace(/<[^>]*>/gu, '').trim() || null
}

function stripLocalGlossary(text) {
  return String(text || '')
    .replace(
      /\n{2,}(?:(?:Nghĩa các lựa chọn|Nghĩa bốn lựa chọn|Nghĩa lựa chọn|Từ trọng tâm|Từ gạch chân|Từ được gạch chân) \(từ điển cục bộ\)|Từ trọng tâm \(nghĩa theo ngữ cảnh câu đúng\)):[\s\S]*$/u,
      ''
    )
    .trim()
}

const stats = {}
const changed = []
const optionMatchStats = { options: 0, wholeOptionMatches: 0, segmentedMatches: 0, unmatched: 0 }
const segmentedExamples = []
const unmatchedExamples = []
for (const exam of exams) {
  for (const part of exam.parts) {
    if (!part.title.includes('Từ vựng')) continue
    const mondai = part.title.match(/Mondai\s+(\d+)/)?.[1] || 'other'
    if (m5Only && mondai !== '5') continue
    if (m1Only && mondai !== '1') continue
    const summary = (stats[mondai] ||= {
      questions: 0,
      allFourGlossed: 0,
      someGlossed: 0,
      targetWordGlossed: 0,
      questionsWithExplanation: 0,
    })
    for (const question of part.questions || []) {
      summary.questions++
      const storedBase = question.explanation || curated[question.id] || ''
      const base = stripLocalGlossary(storedBase)
      if (base) summary.questionsWithExplanation++
      if (mondai === '5') {
        const entry = targetWord(question)
        const contextualGloss = contextualTargetGlosses.get(question.id)
        if (entry || contextualGloss) summary.targetWordGlossed++
        if (!apply || (!entry && !contextualGloss)) continue
        const addition = contextualGloss
          ? `Từ trọng tâm (nghĩa theo ngữ cảnh câu đúng): ${contextualGloss}`
          : `Từ trọng tâm (từ điển cục bộ): ${formatGloss(entry) || entry.word}.`
        const explanation = base ? `${base}\n\n${addition}` : addition
        question.explanation = explanation
        curated[question.id] = explanation
        changed.push(question.id)
        continue
      }
      if (mondai === '1') {
        const word = underlinedWord(question)
        const entry = word ? lookupToken(word) : null
        const contextualGloss = contextualM1Glosses.get(question.id)
        if (entry || contextualGloss) summary.targetWordGlossed++
        if (!apply || (!entry && !contextualGloss)) continue
        const answer = Number(question.correctAnswer ?? question.answer)
        const correctReading = normalize(question.options?.[answer - 1])
        const gloss = contextualGloss || `${formatGloss(entry) || word}.`
        const addition = `Từ được hỏi (nghĩa theo ngữ cảnh): ${gloss} Đáp án đúng là cách đọc 「${correctReading}」; các lựa chọn kana còn lại là cách đọc sai của từ này, không phải từ khác nên không gán nghĩa của từ đồng âm.`
        const explanation = base ? `${base}\n\n${addition}` : addition
        if (question.explanation) question.explanation = explanation
        curated[question.id] = explanation
        changed.push(question.id)
        continue
      }
      const glosses = (question.options || []).map(glossaryFor)
      for (const [index, gloss] of glosses.entries()) {
        optionMatchStats.options++
        if (!gloss) {
          optionMatchStats.unmatched++
          if (unmatchedExamples.length < 100) {
            unmatchedExamples.push({ questionId: question.id, option: question.options[index] })
          }
        } else if (gloss.coverage === 1) optionMatchStats.wholeOptionMatches++
        else {
          optionMatchStats.segmentedMatches++
          if (segmentedExamples.length < 100) {
            segmentedExamples.push({
              questionId: question.id,
              option: question.options[index],
              coverage: Number(gloss.coverage.toFixed(2)),
              matchedWords: gloss.entries.map((entry) => entry.word),
            })
          }
        }
      }
      const found = glosses.filter(Boolean).length
      if (found === glosses.length && found === 4) summary.allFourGlossed++
      else if (found) summary.someGlossed++
      if (!apply || !found) continue
      const lines = glosses.map((gloss, index) => {
        const label = String(question.options[index]).match(/^\s*([1-4])/u)?.[1] || String(index + 1)
        if (!gloss) return `${label}. Chưa khớp được mục từ trực tiếp trong từ điển hiện có.`
        const details = gloss.entries.map(formatGloss).filter(Boolean)
        const prefix = gloss.coverage < 0.75 ? 'Từ khớp trong lựa chọn: ' : ''
        return `${label}. ${prefix}${details.length ? details.join(' / ') : gloss.surface}`
      })
      const addition = `Nghĩa các lựa chọn (từ điển cục bộ):\n${lines.join('\n')}`
      const explanation = base ? `${base}\n\n${addition}` : addition
      question.explanation = explanation
      curated[question.id] = explanation
      changed.push(question.id)
    }
  }
}

const report = {
  generatedAt: new Date().toISOString(),
  dictionaryRows: rows.length,
  mode: apply
    ? `applied direct or segmented local dictionary matches${m5Only ? ' for vocabulary Mondai 5 only' : ''}; kana-reading homophones are excluded`
    : 'dry run; pass --apply to write',
  stats,
  optionMatchStats,
  segmentedExamples,
  unmatchedExamples,
  changedQuestions: changed,
  changedCount: changed.length,
}
fs.mkdirSync(path.dirname(reportPath), { recursive: true })
fs.writeFileSync(reportPath, `${JSON.stringify(report, null, 2)}\n`, 'utf8')
if (apply && changed.length) {
  fs.writeFileSync(masterPath, `${JSON.stringify(exams, null, 2)}\n`, 'utf8')
  fs.writeFileSync(curatedPath, `${JSON.stringify(curated, null, 2)}\n`, 'utf8')
}
console.log(
  JSON.stringify(
    { ...report, changedQuestions: changed.length > 20 ? `${changed.length} ids in ${reportPath}` : changed },
    null,
    2
  )
)
