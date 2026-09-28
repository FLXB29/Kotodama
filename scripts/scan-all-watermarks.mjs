import fs from 'node:fs'
import path from 'node:path'

const masterFile = path.resolve('data/jlpt_n3_toan_master.json')
const exams = JSON.parse(fs.readFileSync(masterFile, 'utf8'))

const watermarkPatterns = [
  /JLPT[・\s]N3[・\s\d/]+/gi,
  /N3\s+\d{1,2}\/\d{4}/gi,
]

console.log('--- SCANNING ALL EXAMS FOR WATERMARKS ---')

for (const exam of exams) {
  for (const part of exam.parts || []) {
    // Check part passage
    if (part.passage) {
      for (const pat of watermarkPatterns) {
        const matches = [...part.passage.matchAll(pat)]
        for (const m of matches) {
          console.log(`[PART_PASSAGE] ${exam.id} | ${part.title} => match "${m[0]}" at pos ${m.index}`)
        }
      }
    }
    // Check questions
    for (const q of part.questions || []) {
      if (q.passage) {
        for (const pat of watermarkPatterns) {
          const matches = [...q.passage.matchAll(pat)]
          for (const m of matches) {
            console.log(`[Q_PASSAGE] ${exam.id} | ${part.title} Q${q.id} => match "${m[0]}" at pos ${m.index}`)
          }
        }
      }
      if (typeof q.sourceTextExtracted === 'string') {
        for (const pat of watermarkPatterns) {
          const matches = [...q.sourceTextExtracted.matchAll(pat)]
          for (const m of matches) {
            console.log(`[Q_EXTRACT] ${exam.id} | ${part.title} Q${q.id} => match "${m[0]}" at pos ${m.index}`)
          }
        }
      }
      if (typeof q.prompt === 'string') {
        for (const pat of watermarkPatterns) {
          const matches = [...q.prompt.matchAll(pat)]
          for (const m of matches) {
            console.log(`[Q_PROMPT] ${exam.id} | ${part.title} Q${q.id} => match "${m[0]}" at pos ${m.index}`)
          }
        }
      }
    }
  }
}
