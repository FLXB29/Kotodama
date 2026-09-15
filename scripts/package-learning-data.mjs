import { copyFileSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { resolve, join } from 'node:path'
import { gzipSync } from 'node:zlib'
import { createHash } from 'node:crypto'

// Package existing local learning content for Linux deploys. No crawling or DB writes.
const source = process.argv[2] || process.env.NHAIKANJI_DATA_PATH
if (!source) throw new Error('Usage: node scripts/package-learning-data.mjs <nhaikanji_data directory>')
const target = resolve('data/nhaikanji')
const kanjiBytes = readFileSync(join(source, 'kanji_full_data.json'))
const kanji = JSON.parse(kanjiBytes.toString('utf8'))
const grammar = JSON.parse(readFileSync(join(source, 'bunpo_data.json'), 'utf8'))
if (!Object.keys(kanji).length || !Array.isArray(grammar) || !grammar.length) {
  throw new Error('The supplied learning dataset is empty or invalid.')
}
mkdirSync(target, { recursive: true })
copyFileSync(join(source, 'kanji_summary.csv'), join(target, 'kanji_summary.csv'))
copyFileSync(join(source, 'bunpo_data.json'), join(target, 'bunpo_data.json'))
writeFileSync(join(target, 'kanji_full_data.json.gz'), gzipSync(kanjiBytes, { level: 9 }))
writeFileSync(
  join(target, 'manifest.json'),
  JSON.stringify(
    {
      source: 'Existing NhaiKanji dataset supplied in the local project data directory',
      kanjiCount: Object.keys(kanji).length,
      grammarCount: grammar.length,
      kanjiSha256: createHash('sha256').update(kanjiBytes).digest('hex'),
    },
    null,
    2
  ) + '\n'
)
console.log(`Packaged ${Object.keys(kanji).length} kanji and ${grammar.length} grammar entries into ${target}`)
