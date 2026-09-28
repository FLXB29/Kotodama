import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = fileURLToPath(new URL('../', import.meta.url))
const masterPath = path.join(root, 'data/jlpt_n3_toan_master.json')
let source = fs.readFileSync(masterPath, 'utf8')

// The existing listening scripts for this exam describe different situations
// from the local source PDF. Hide them until they can be transcribed faithfully.
const corrections = new Map([
  [80, [1, 2]],
  [87, [1, 2]],
  [89, [2, 3]],
  [91, [1, 3]],
  [92, [1, 2]],
  [96, [1, 2]],
  [97, [1, 3]],
  [99, [1, 3]],
  [100, [1, 3]],
  [101, [1, 3]],
  [102, [1, 2]],
])

for (let number = 75; number <= 102; number++) {
  const id = `toan_q_2013_12_${number}`
  const marker = `"id": "${id}"`
  const start = source.indexOf(marker)
  if (start < 0 || source.indexOf(marker, start + marker.length) >= 0) throw new Error(`Missing or duplicated ${id}`)
  const end = source.indexOf('\n          }', start)
  if (end < 0) throw new Error(`Cannot locate end of ${id}`)
  let block = source.slice(start, end)
  if (corrections.has(number)) {
    const [before, after] = corrections.get(number)
    for (const field of ['correctAnswer', 'answer']) {
      const pattern = new RegExp(`("${field}": )([1-4])`)
      const match = block.match(pattern)
      if (!match || ![before, after].includes(Number(match[2]))) throw new Error(`Unexpected ${field} for ${id}`)
      block = block.replace(pattern, `$1${after}`)
    }
  }
  const scriptPattern = /("script": )(?:"(?:\\.|[^"\\])*"|null)/
  if (!scriptPattern.test(block)) throw new Error(`Missing script for ${id}`)
  block = block.replace(scriptPattern, '$1null')
  source = source.slice(0, start) + block + source.slice(end)
}

fs.writeFileSync(masterPath, source)
console.log('Corrected 11 keys and removed 28 mismatched listening scripts in 2013/12.')
