import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = fileURLToPath(new URL('../', import.meta.url))
const masterPath = path.join(root, 'data/jlpt_n3_toan_master.json')
const curatedPath = path.join(root, 'data/jlpt_n3_explanations_curated.json')
let source = fs.readFileSync(masterPath, 'utf8')
const curated = JSON.parse(fs.readFileSync(curatedPath, 'utf8'))

for (const session of ['07', '12']) {
  for (let number = 75; number <= 102; number++) {
    const id = `toan_q_2014_${session}_${number}`
    const marker = `"id": "${id}"`
    const start = source.indexOf(marker)
    if (start < 0 || source.indexOf(marker, start + marker.length) >= 0) throw new Error(`Missing or duplicated ${id}`)
    const end = source.indexOf('\n          }', start)
    if (end < 0) throw new Error(`Cannot locate end of ${id}`)
    let block = source.slice(start, end)
    const key = Number(block.match(/"correctAnswer": ([1-4])/)?.[1])
    if (!key || !curated[id]) throw new Error(`Missing key or curated explanation for ${id}`)
    const scriptPattern = /("script": )(?:"(?:\\.|[^"\\])*"|null)/
    if (!scriptPattern.test(block)) throw new Error(`Missing script for ${id}`)
    block = block.replace(scriptPattern, '$1null')
    source = source.slice(0, start) + block + source.slice(end)
    curated[id] =
      `Chưa thẩm định lời giải nghe. Khóa đáp án hiện lưu là ${key}; trong đề ${session}/2014 đã phát hiện nhiều transcript và lời giải cũ không khớp PDF nguồn, nên phần nghe của cả đề đang được giữ để rà lại. Chưa có đủ bằng chứng để giải thích vì sao từng phương án đúng hoặc sai và dịch chính xác câu hỏi này. Hãy nghe audio, xem PDF nguồn trước khi dùng câu này để ôn tập.`
  }
}

fs.writeFileSync(masterPath, source)
fs.writeFileSync(curatedPath, JSON.stringify(curated, null, 2) + '\n')
console.log('Quarantined 56 listening scripts and explanations pending review in 2014/07 and 2014/12.')
