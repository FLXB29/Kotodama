import fs from 'node:fs'
import path from 'node:path'

const sourcePath = path.resolve('reports/n3-quality-audit/.source-texts.tmp.json')
const dataPath = path.resolve('data/jlpt_n3_toan_master.json')
const draftPath = path.resolve('reports/n3-quality-audit/source-import-draft.json')
const sourceDocs = JSON.parse(fs.readFileSync(sourcePath, 'utf8'))
const exams = JSON.parse(fs.readFileSync(dataPath, 'utf8'))

const halfWidth = (text) =>
  String(text || '').replace(/[０-９]/g, (char) => String.fromCharCode(char.charCodeAt(0) - 0xfee0))
const escapeHtml = (text) => String(text).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;')
const plain = (value) =>
  String(value || '')
    .replace(/<[^>]*>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()

function locateDoc(exam) {
  return sourceDocs.find((doc) => {
    const match = doc.folder.match(/N3\s+(7|12)[.\s-]*(20\d{2})/i)
    return match && match[1] === String(Number(exam.session)) && match[2] === String(exam.year)
  })
}

function cleanLines(text, { removeRuby = true } = {}) {
  const lines = halfWidth(text)
    .replace(/\r/g, '')
    .split('\n')
    .map((line) => line.replace(/[ \t\u3000]+/g, ' ').trim())
  return lines.filter((line, index) => {
    if (!line) return false
    if (/^(?:JLPT[・\s]*N3|N3\s+\d{1,2}\/20\d{2})/i.test(line)) return false
    if (/^\d{1,2}$/.test(line)) return false
    if (removeRuby && /^[ぁ-ゖー]{1,6}$/.test(line)) {
      const prev = lines[index - 1] || ''
      const next = lines[index + 1] || ''
      if (/[一-龯々〆ヵヶ]/.test(prev + next)) return false
    }
    return true
  })
}

function htmlFromText(text, { preserveLines = false } = {}) {
  const lines = cleanLines(text)
  if (!lines.length) return ''
  const escaped = lines.map(escapeHtml)
  return preserveLines ? `<p>${escaped.join('<br>')}</p>` : `<p>${escaped.join('')}</p>`
}

function cleanOption(value) {
  return cleanLines(
    String(value || '')
      .replace(/JLPT[・\s]*N3.*$/i, '')
      .replace(/N3\s+\d{1,2}\/20\d{2}.*$/i, '')
  )
    .join('')
    .replace(/([一-龯々])\s+[ぁ-ゖー]{1,8}\s+(?=[一-龯ぁ-ゖ々])/g, '$1')
    .replace(/\s+/g, ' ')
    .trim()
}

function findHeading(text, label, from = 0) {
  const problem = String(label).match(/^問題\s*(\d+)$/)
  if (problem) {
    const re = new RegExp(`(?:^|\\n)\\s*問題\\s*${problem[1]}(?=[^0-9]|$)`, 'g')
    re.lastIndex = from
    const match = re.exec(halfWidth(text))
    return match ? match.index + (match[0].startsWith('\n') ? 1 : 0) : -1
  }
  const escaped = String(label).replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  const re = new RegExp(`(?:^|\\n)\\s*${escaped}\\s*(?=\\n|$)`, 'g')
  re.lastIndex = from
  const match = re.exec(halfWidth(text))
  return match ? match.index + (match[0].startsWith('\n') ? 1 : 0) : -1
}

function sectionBetween(text, startLabel, endLabel, from = 0) {
  const start = findHeading(text, startLabel, from)
  if (start < 0) return ''
  const afterStart = start + startLabel.length
  const end = findHeading(text, endLabel, afterStart)
  return text.slice(afterStart, end < 0 ? undefined : end)
}

function findQuestionStarts(text, first, last) {
  const starts = []
  const lines = halfWidth(text).split('\n')
  let offset = 0
  for (const line of lines) {
    const match = line.match(/^\s*(\d{1,2})(?=[\s　.．、]|$)/)
    if (match) {
      const number = Number(match[1])
      if (number >= first && number <= last) starts.push({ number, offset })
    }
    offset += line.length + 1
  }
  return starts
}

function textBeforeQuestion(block, questionNumber) {
  const re = new RegExp(`(?:^|\\n)\\s*${questionNumber}(?=[\\s　.．、]|$)`)
  const match = re.exec(halfWidth(block))
  return match ? block.slice(0, match.index + (match[0].startsWith('\n') ? 1 : 0)) : ''
}

function splitParenSections(block) {
  const normal = halfWidth(block)
  const re = /(?:^|\n)\s*[（(]\s*([1-4])\s*[)）]\s*/g
  const positions = []
  let m
  while ((m = re.exec(normal))) positions.push({ n: Number(m[1]), markerStart: m.index, start: m.index + m[0].length })
  return positions.map((pos, i) => ({ n: pos.n, text: block.slice(pos.start, positions[i + 1]?.markerStart) }))
}

function getPassages(readingText, part, partIndex) {
  const problemNumber = partIndex + 4
  const partBlock = sectionBetween(readingText, `問題${problemNumber}`, `問題${problemNumber + 1}`)
  if (!partBlock) return { candidates: [], reason: `no reading problem ${problemNumber}` }
  const questions = part.questions || []
  const qNums = questions.map((q) => {
    const official = Number(plain(q.question).match(/^\s*[［（(]?\s*(\d{1,2})/)?.[1])
    return Number.isFinite(official) && official > 0 ? official : Number(q.number) - 35
  })
  if (partIndex < 2) {
    const blocks = splitParenSections(partBlock)
    const expected = partIndex === 0 ? questions.length : Math.ceil(questions.length / 3)
    if (blocks.length >= expected) {
      const starts = partIndex === 0 ? questions.map((_, i) => i) : [0, 3]
      return {
        candidates: starts.map((questionIndex, i) => {
          const section = blocks[i]?.text || ''
          const passage = textBeforeQuestion(section, qNums[questionIndex])
          return {
            questionIndex,
            qNumber: qNums[questionIndex],
            html: htmlFromText(passage, { preserveLines: true }),
            rawLength: passage.length,
          }
        }),
        reason: `paren sections ${blocks.length}`,
      }
    }
    return { candidates: [], reason: `expected ${expected} numbered reading passages; found ${blocks.length}` }
  }
  const qNum = qNums[0]
  const passage = qNum ? textBeforeQuestion(partBlock, qNum) : ''
  return {
    candidates: [
      {
        questionIndex: 0,
        qNumber: qNum,
        html: htmlFromText(passage, { preserveLines: true }),
        rawLength: passage.length,
      },
    ],
    reason: `single passage problem ${problemNumber}`,
  }
}

function getCloze(grammarText) {
  const block = sectionBetween(grammarText, '問題3', '読解')
  if (!block) return { html: '', reason: 'no grammar problem 3' }
  const lines = halfWidth(block).split('\n')
  let articleStart = -1
  let offset = 0
  for (const line of lines) {
    if (/以下は|これは/.test(line)) {
      articleStart = offset
      break
    }
    offset += line.length + 1
  }
  if (articleStart < 0) {
    const normalized = halfWidth(block)
    const instructionEnd = normalized.search(/なさい[。.]?\s*\n/)
    if (instructionEnd >= 0) articleStart = normalized.indexOf('\n', instructionEnd) + 1
  }
  if (articleStart < 0) articleStart = 0
  const fromArticle = block.slice(articleStart)
  const questionStarts = findQuestionStarts(fromArticle, 19, 23)
  const firstChoice = questionStarts.find((item) => {
    const remaining = halfWidth(fromArticle.slice(item.offset)).split('\n').slice(0, 8)
    return remaining.some((line) => /^\s*[1-4](?:[.．、]|\s)/.test(line))
  })
  const passage = firstChoice ? fromArticle.slice(0, firstChoice.offset) : fromArticle
  return {
    html: htmlFromText(passage),
    rawLength: passage.length,
    reason: firstChoice ? `trimmed before answer choices ${firstChoice.number}` : 'answer-choice boundary not found',
  }
}

function extractOptions(block) {
  const lines = halfWidth(block).replace(/\r/g, '').split('\n')
  const marker = /(?:^|\s)([1-4])(?:[.．、]?\s+)/g
  const rows = lines.map((line) => ({ line, tokens: [...line.matchAll(marker)] }))
  const startIndex = rows.findIndex((row, index) => index > 0 && row.tokens.some((token) => token[1] === '1'))
  if (startIndex < 0) return null
  const values = new Map()
  let previous = null
  for (let li = startIndex; li < rows.length; li++) {
    const { line, tokens } = rows[li]
    if (tokens.length) {
      const prefix = line.slice(0, tokens[0].index).trim()
      if (prefix && previous) values.set(previous, `${values.get(previous) || ''} ${prefix}`.trim())
      for (let i = 0; i < tokens.length; i++) {
        const token = tokens[i]
        const contentStart = token.index + token[0].length
        const contentEnd = tokens[i + 1]?.index ?? line.length
        values.set(Number(token[1]), line.slice(contentStart, contentEnd).trim())
        previous = Number(token[1])
      }
    } else if (previous && line.trim() && !/^問題\s*\d/.test(line)) {
      values.set(previous, `${values.get(previous) || ''} ${line.trim()}`.trim())
    }
  }
  if ([1, 2, 3, 4].every((n) => values.has(n))) {
    return [1, 2, 3, 4].map((n) => values.get(n).replace(/\s+/g, ' ').trim())
  }
  return null
}

function parseStarQuestions(grammarText, part) {
  const block = sectionBetween(grammarText, '問題2', '問題3')
  if (!block) return { candidates: [], reason: 'no grammar problem 2' }
  const questions = part.questions || []
  const questionStarts = findQuestionStarts(block, 14, 18)
  const candidates = []
  for (let index = 0; index < questions.length; index++) {
    const qNumber = 14 + index
    const start = questionStarts.find((item) => item.number === qNumber)
    if (!start) {
      candidates.push({ qNumber, index, reason: 'source question label not found' })
      continue
    }
    const next = questionStarts.find((item) => item.number > qNumber)?.offset ?? block.length
    const raw = block.slice(start.offset, next)
    const choices = extractOptions(raw)?.map(cleanOption)
    const optionStart = (() => {
      const marker = /(?:^|\n)\s*1(?:[.．、]?\s+)/.exec(halfWidth(raw))
      return marker?.index ?? raw.length
    })()
    let stem = raw.slice(0, optionStart).replace(/^\s*\d{1,2}[.．、]?\s*/, '')
    let lines = cleanLines(stem)
    stem = lines
      .join('')
      .replace(/[＿_]{2,}/g, '')
      .replace(/JLPT[・\s]*N3.*$/i, '')
      .trim()
    const m = stem.match(/★/)
    let before = '',
      after = '',
      missingStar = false
    if (m) {
      before = stem.slice(0, m.index).trim()
      after = stem.slice(m.index + 1).trim()
    } else {
      const blanks = /(?:＿＿+|＿{2,}|［\s　]*］|\(\s*\)|（\s*）| {3,})/.exec(stem)
      if (blanks) {
        before = stem.slice(0, blanks.index).trim()
        after = stem.slice(blanks.index + blanks[0].length).trim()
        missingStar = true
      }
    }
    candidates.push({
      qNumber,
      index,
      before,
      after,
      choices,
      sourceHasStar: Boolean(m),
      missingStar,
      stem,
      sourceLength: raw.length,
    })
  }
  return { candidates, reason: `question labels ${questionStarts.map((x) => x.number).join(',')}` }
}

const draft = []
for (const exam of exams) {
  const doc = locateDoc(exam)
  const result = {
    examId: exam.id,
    exam: `${exam.year}/${String(exam.session).padStart(2, '0')}`,
    source: doc?.file,
    sourceId: doc?.id,
    sections: { star: [], cloze: null, reading: [] },
    errors: [],
  }
  if (!doc) {
    result.errors.push('source PDF not matched')
    draft.push(result)
    continue
  }
  const text = doc.text
  const sourceText = halfWidth(text)
  const grammarMatch = /(?:^|\n)\s*文法\s*(?=\n|$)/.exec(sourceText)
  const readingMatch = /(?:^|\n)\s*読解\s*(?=\n|$)/.exec(sourceText)
  const listeningMatch = /(?:^|\n)\s*聴解\s*(?=\n|$)/.exec(sourceText)
  const grammarIndex = grammarMatch ? grammarMatch.index : sourceText.indexOf('文法')
  const problem4Index = findHeading(text, '問題4', grammarIndex)
  const readingIndex =
    problem4Index >= 0 ? problem4Index : readingMatch ? readingMatch.index : sourceText.indexOf('読解')
  const listeningIndex = listeningMatch ? listeningMatch.index : sourceText.indexOf('聴解')
  const grammarText =
    grammarIndex >= 0 ? text.slice(grammarIndex, readingIndex > grammarIndex ? readingIndex : undefined) : ''
  const readingText =
    readingIndex >= 0 ? text.slice(readingIndex, listeningIndex > readingIndex ? listeningIndex : undefined) : ''
  const starPart = exam.parts.find((part) => part.title.includes('Ngữ pháp') && part.title.includes('Mondai 2'))
  const clozePart = exam.parts.find((part) => part.title.includes('Ngữ pháp') && part.title.includes('Mondai 3'))
  if (starPart) result.sections.star = parseStarQuestions(grammarText, starPart)
  if (clozePart) result.sections.cloze = getCloze(grammarText, clozePart)
  for (let partIndex = 0; partIndex < 4; partIndex++) {
    const part = exam.parts.find(
      (candidate) => candidate.title.includes('Đọc hiểu') && candidate.title.endsWith(`Mondai ${partIndex + 1}`)
    )
    if (part) result.sections.reading.push({ partId: part.id, ...getPassages(readingText, part, partIndex) })
  }
  draft.push(result)
}

fs.writeFileSync(draftPath, `${JSON.stringify(draft, null, 2)}\n`, 'utf8')
const sum = {
  exams: draft.length,
  matched: draft.filter((x) => x.sourceId).length,
  starQuestions: 0,
  starWithPrompt: 0,
  starWithChoices: 0,
  clozeWithText: 0,
  readingPassages: 0,
  readingWithText: 0,
  errors: [],
}
for (const exam of draft) {
  const stars = exam.sections.star?.candidates || []
  sum.starQuestions += stars.length
  sum.starWithPrompt += stars.filter((q) => q.before && q.after).length
  sum.starWithChoices += stars.filter((q) => q.choices?.length === 4).length
  if (exam.sections.cloze?.html) sum.clozeWithText++
  for (const part of exam.sections.reading || []) {
    sum.readingPassages += part.candidates.length
    sum.readingWithText += part.candidates.filter((x) => x.html).length
  }
  if (exam.errors.length || stars.some((q) => !q.before || !q.after || !q.choices))
    sum.errors.push({
      exam: exam.exam,
      source: exam.source,
      errors: exam.errors,
      stars: stars
        .filter((q) => !q.before || !q.after || !q.choices)
        .map((q) => ({
          q: q.qNumber,
          before: Boolean(q.before),
          after: Boolean(q.after),
          choices: Boolean(q.choices),
          stem: q.stem?.slice(0, 80),
        })),
    })
}
console.log(JSON.stringify(sum, null, 2))
