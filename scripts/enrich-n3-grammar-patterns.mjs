import fs from 'node:fs'
import path from 'node:path'

const root = path.resolve('.')
const masterPath = path.join(root, 'data/jlpt_n3_toan_master.json')
const standalonePath = path.join(root, 'data/jlpt_full_master.json')
const curatedPath = path.join(root, 'data/jlpt_n3_explanations_curated.json')
const reportPath = path.join(root, 'reports/n3-quality-audit/grammar-pattern-coverage.json')
const apply = process.argv.includes('--apply')
const applyContextual = process.argv.includes('--apply-contextual')
const exams = JSON.parse(fs.readFileSync(masterPath, 'utf8'))
const curated = JSON.parse(fs.readFileSync(curatedPath, 'utf8'))
const mimi = JSON.parse(fs.readFileSync(path.join(root, 'data/mimi_kara_n3_grammar.json'), 'utf8'))
const bunpo = JSON.parse(fs.readFileSync(path.join(root, 'data/nhaikanji/bunpo_data.json'), 'utf8')).filter(
  (entry) => entry.level === 'N3'
)

const normalize = (value) =>
  String(value || '')
    .replace(/^[\s　]*[1-4１-４][.．、\s　]*/u, '')
    .replace(/[～〜~・\s　（）()［］【】]/gu, '')
    .replace(/[①②③④]/gu, '')

const plainText = (value) =>
  String(value || '')
    .replace(/<[^>]*>/gu, ' ')
    .replace(/&nbsp;|&#160;/giu, ' ')
    .replace(/&lt;/giu, '<')
    .replace(/&gt;/giu, '>')
    .replace(/&amp;/giu, '&')

function contextualSurface(text, question, part) {
  const mondai = Number(part.title.match(/Mondai\s+(\d+)/u)?.[1])
  const stem = plainText(question.question || question.sentence)
  let before = ''
  let after = ''
  let completed = ''

  if (mondai === 1) {
    const blank = /[（(]\s*(?:_{1,}|[　\s]*)[）)]/u.exec(stem)
    if (!blank) return null
    before = stem.slice(0, blank.index)
    after = stem.slice(blank.index + blank[0].length)
    completed = `${before}${text}${after}`
  } else if (mondai === 3) {
    const sharedPassage = plainText(part.passage || '')
    const markerNumber = String(Number(question.number) - 35)
    if (!markerNumber) return null
    const marker = new RegExp(`[（(]\\s*0?${markerNumber}\\s*[）)]`, 'u').exec(sharedPassage)
    if (!marker) return null
    before = sharedPassage.slice(0, marker.index)
    after = sharedPassage.slice(marker.index + marker[0].length)
    completed = `${before}${text}${after}`
  } else {
    return null
  }

  const normalizedBefore = normalize(before)
  const normalizedOption = normalize(text)
  const optionStart = normalizedBefore.length
  const optionEnd = optionStart + normalizedOption.length
  return { completed: normalize(completed), optionStart, optionEnd }
}

function findContextPatterns(context) {
  if (!context) return []
  const matches = []
  for (const entry of patterns) {
    const { alias } = entry
    if (unsafeContextAliases.has(alias) || alias.length <= 2) continue
    const index = context.completed.indexOf(alias, context.optionStart)
    if (index < context.optionStart || index > context.optionEnd + 4) continue
    const aliasEnd = index + alias.length
    if (aliasEnd < context.optionStart || index > context.optionEnd) continue
    if (alias === '今に' && context.completed[aliasEnd] === 'も') continue
    if (alias === 'ところ' && context.completed[aliasEnd] === 'で') continue
    if (matches.some((match) => index < match.end && aliasEnd > match.start)) continue
    matches.push({ ...entry, start: index, end: aliasEnd })
    if (matches.length === 4) break
  }
  return matches
}

// These short or homographic surfaces match unrelated grammar/lexical uses when
// they are attached to the end of a longer answer choice. Leave them to the
// question-specific explanation instead of guessing from the suffix alone.
const unsafePatternAliases = new Set([
  'かけ',
  'かける',
  'といい',
  'ばいい',
  'たらいい',
  'にして',
  'てください',
  'れる',
  'られる',
  'もない',
  'ところ',
  'より',
])
const unsafeContextAliases = new Set(['たら', 'よう', 'れる', 'られる', 'そうだ', 'らしい'])
const contextualSurfaceExclusions = new Map([
  [
    'toan_q_2025_12_55',
    {
      surface: 'でも',
      reason:
        'In this sentence-initial position, でも means “but/however”; it is not the dictionary pattern N + でも (“even/as much as”).',
    },
  ],
])

function aliases(pattern) {
  if (/[.]{2,}|…|など/u.test(String(pattern || ''))) return []
  const raw = String(pattern || '')
  const forms = new Set([raw.replace(/[（(][^）)]*[）)]/gu, '')])
  for (const match of raw.matchAll(/[（(](て|は|も|だ|の|に)[）)]/gu)) {
    forms.add(raw.replace(match[0], match[1]))
  }
  return [...forms]
    .flatMap((form) => form.split(/[／/・]/u))
    .map((part) =>
      normalize(part)
        .replace(/^[〜～~]+/u, '')
        .replace(/[①②③④]$/u, '')
    )
    .filter((part) => part.length >= 1 && !/[＋+／]/u.test(part) && !unsafePatternAliases.has(part))
}

const entries = [
  ...bunpo.map((entry) => ({
    pattern: entry.pattern,
    meaning: entry.shortMeaning,
    structure: entry.structure,
    source: entry.bookName || 'bunpo_data.json',
    aliases: aliases(entry.pattern),
  })),
  ...mimi.map((entry) => ({
    pattern: entry.title,
    meaning: entry.meaning,
    structure: entry.structure,
    source: 'mimi_kara_n3_grammar.json',
    aliases: aliases(entry.title),
  })),
]

// Keep the more specific N3 book entry when two local datasets contain the same surface pattern.
const patternGroups = new Map()
for (const entry of entries) {
  for (const alias of entry.aliases) {
    const matches = patternGroups.get(alias) || []
    matches.push(entry)
    patternGroups.set(alias, matches)
  }
}
const ambiguousPatternAliases = []
const patterns = []
for (const [alias, matches] of patternGroups) {
  if (alias.length < 2 || unsafePatternAliases.has(alias)) continue
  const meanings = new Set(
    matches.map((entry) =>
      String(entry.meaning || '')
        .replace(/[\s　、，。；;]+/gu, '')
        .toLocaleLowerCase('vi-VN')
    )
  )
  if (meanings.size > 1) {
    ambiguousPatternAliases.push({
      alias,
      candidates: matches.map(({ pattern, meaning, source }) => ({ pattern, meaning, source })),
    })
    continue
  }
  // Prefer the curated textbook entry when equivalent surfaces occur in both local corpora.
  const preferred = matches.find((entry) => entry.source === '新完全マスター 文法 N3') || matches[0]
  patterns.push({ ...preferred, alias })
}
patterns.sort((a, b) => b.alias.length - a.alias.length)

const totals = {
  questions: 0,
  options: 0,
  optionsWithPattern: 0,
  questionsWithAnyPattern: 0,
  optionsWithContextualPattern: 0,
  questionsWithAnyContextualPattern: 0,
}
const byMondai = {}
const changed = []
const annotated = new Set()
let appliedPatternOptionCount = 0
const matchLedger = []
const unmatched = []
const excludedContextualMatches = []
let alreadyAnnotatedQuestions = 0
for (const exam of exams) {
  for (const part of exam.parts || []) {
    if (!part.title.includes('Ngữ pháp')) continue
    const mondai = part.title.match(/Mondai\s+(\d+)/u)?.[1] || 'other'
    const summary = (byMondai[mondai] ||= {
      questions: 0,
      options: 0,
      matchedOptions: 0,
      questionsWithAnyPattern: 0,
      optionsWithContextualPattern: 0,
      questionsWithAnyContextualPattern: 0,
    })
    for (const question of part.questions || []) {
      totals.questions++
      summary.questions++
      const matches = (question.options || []).map((option) => {
        totals.options++
        summary.options++
        const surface = normalize(option)
        const exception = contextualSurfaceExclusions.get(question.id)
        const optionSurface = String(option)
          .replace(/^\s*[1-4１-４][.．、\s　]+/u, '')
          .trim()
        if (exception?.surface === optionSurface) {
          unmatched.push({ examId: exam.id, questionId: question.id, option })
          excludedContextualMatches.push({
            examId: exam.id,
            questionId: question.id,
            option: String(option),
            rejectedPattern: '〜でも',
            reason: exception.reason,
          })
          return null
        }
        const match = patterns.find((entry) => {
          if (entry.alias.length > surface.length) return false
          if (entry.alias.length <= 2) return surface === entry.alias
          return surface === entry.alias || surface.endsWith(entry.alias)
        })
        if (match) {
          totals.optionsWithPattern++
          summary.matchedOptions++
          matchLedger.push({
            examId: exam.id,
            questionId: question.id,
            option: String(option),
            matchedSurface: match.alias,
            pattern: match.pattern,
            meaning: match.meaning,
            source: match.source,
          })
          return { option, entry: match }
        }
        unmatched.push({ examId: exam.id, questionId: question.id, option })
        return null
      })
      const contextualMatches = (question.options || []).map((option, index) => {
        const surface = String(option)
          .replace(/^\s*[1-4１-４][.．、\s　]+/u, '')
          .trim()
        const context = contextualSurface(surface, question, part)
        const contextPatterns = findContextPatterns(context).filter(
          ({ alias }) => !matches[index] || matches[index].entry.alias !== alias
        )
        if (contextPatterns.length) {
          totals.optionsWithContextualPattern++
          summary.optionsWithContextualPattern++
          for (const entry of contextPatterns) {
            matchLedger.push({
              examId: exam.id,
              questionId: question.id,
              option: String(option),
              matchedSurface: entry.alias,
              pattern: entry.pattern,
              meaning: entry.meaning,
              source: entry.source,
              contextual: true,
            })
          }
          return contextPatterns.map((entry) => ({ option, entry }))
        }
        return []
      })
      const matched = matches.filter(Boolean)
      // Star fragments are incomplete until placed in order; surface-only matches can assign
      // the wrong sense (for example, という as hearsay vs. quotation).
      const explainableMatches = mondai === '2' ? [] : matched
      const contextual = contextualMatches.flat()
      if (matched.length) {
        totals.questionsWithAnyPattern++
        summary.questionsWithAnyPattern++
      }
      if (contextual.length) {
        totals.questionsWithAnyContextualPattern++
        summary.questionsWithAnyContextualPattern++
      }
      const storedBase = question.explanation || curated[question.id] || ''
      const alreadyAnnotated = storedBase.includes('Mẫu ngữ pháp được nhận diện')
      if (alreadyAnnotated) alreadyAnnotatedQuestions++
      const base = storedBase
        .replace(/\n+Mẫu ngữ pháp được nhận diện[^\n]*[\s\S]*$/u, '')
        .replace(/\n+Mẫu khớp khi đặt từng lựa chọn vào chỗ trống[\s\S]*$/u, '')
        .trim()
      if (!apply || (!explainableMatches.length && !(applyContextual && contextual.length) && !alreadyAnnotated))
        continue
      const lines = explainableMatches.map(({ option, entry }) => {
        const label = String(option).match(/^\s*([1-4])/u)?.[1] || String((question.options || []).indexOf(option) + 1)
        const answerStatus =
          Number(label) === Number(question.answer) ? 'đáp án đang lưu' : 'không phải đáp án đang lưu'
        const details = [entry.meaning, entry.structure && `Cấu trúc: ${entry.structure}`].filter(Boolean).join('；')
        return `Phương án ${label} (${answerStatus}) — 「${entry.pattern}」: ${details || 'mẫu có trong dữ liệu N3'}`
      })
      const addition = explainableMatches.length
        ? `Mẫu ngữ pháp được nhận diện từ dữ liệu N3 cục bộ; từng lựa chọn chỉ khớp mặt chữ, không xác định đáp án — xem nhãn đúng/sai và phần giải thích ở trên:\n${lines.join('\n')}`
        : ''
      const contextLines = contextual.map(({ option, entry }) => {
        const label = String(option).match(/^\s*([1-4])/u)?.[1] || String((question.options || []).indexOf(option) + 1)
        const details = [entry.meaning, entry.structure && `Cấu trúc: ${entry.structure}`].filter(Boolean).join('；')
        return `${label}. 「${entry.pattern}」${entry.alias === entry.pattern ? '' : ` (khớp 「${entry.alias}」)`}: ${details || 'mẫu có trong dữ liệu N3'} (nhận diện trong câu sau khi điền lựa chọn)`
      })
      const contextualAddition =
        applyContextual && contextLines.length
          ? `Mẫu khớp khi đặt từng lựa chọn vào chỗ trống (đối chiếu kho N3 cục bộ; chỉ nêu phần có khớp rõ):\n${[...new Set(contextLines)].join('\n')}`
          : ''
      const explanation = [base, addition, contextualAddition].filter(Boolean).join('\n\n')
      if (question.explanation) question.explanation = explanation
      curated[question.id] = explanation
      if (addition || contextualAddition) {
        annotated.add(question.id)
        appliedPatternOptionCount += explainableMatches.length
      }
      changed.push(question.id)
    }
  }
}

let standaloneSyncedQuestionCount = 0
let standaloneCuratedFallbacksRemoved = 0
if (apply) {
  const standaloneExams = JSON.parse(fs.readFileSync(standalonePath, 'utf8'))
  const explanationByExamAndNumber = new Map()

  for (const exam of exams) {
    const date = /toan-n3-(\d{4})(\d{2})-full/u.exec(exam.id)
    if (!date) continue
    const examDate = `${date[1]}${date[2]}`
    for (const part of exam.parts || []) {
      if (!part.title.includes('Ngữ pháp')) continue
      for (const question of part.questions || []) {
        if (!changed.includes(question.id)) continue
        const explanation = question.explanation || curated[question.id]
        if (explanation) {
          explanationByExamAndNumber.set(`${examDate}:${question.number}`, explanation)
        }
      }
    }
  }

  for (const exam of standaloneExams) {
    if (exam.level !== 'N3' || !['grammar-reading', 'grammar'].includes(exam.section)) continue
    const date = /^(07|12)\s+(\d{4})$/u.exec(String(exam.year || '').trim())
    if (!date) continue
    const examDate = `${date[2]}${date[1]}`
    for (const part of exam.parts || []) {
      for (const question of part.questions || []) {
        const explanation = explanationByExamAndNumber.get(`${examDate}:${question.number}`)
        if (!explanation) continue
        question.explanation = explanation
        standaloneSyncedQuestionCount++
      }
    }
  }

  // Standalone copies carry their own source wording; keep their explanations embedded so the
  // service can invalidate them when that wording changes, instead of falling back by id alone.
  for (const exam of standaloneExams) {
    if (exam.level !== 'N3' || !['grammar-reading', 'grammar'].includes(exam.section)) continue
    for (const part of exam.parts || []) {
      for (const question of part.questions || []) {
        if (!curated[question.id]?.includes('Mẫu ngữ pháp được nhận diện')) continue
        delete curated[question.id]
        standaloneCuratedFallbacksRemoved++
      }
    }
  }

  if (standaloneSyncedQuestionCount) {
    fs.writeFileSync(standalonePath, `${JSON.stringify(standaloneExams, null, 2)}\n`, 'utf8')
  }
}

const report = {
  generatedAt: new Date().toISOString(),
  method:
    'Normalized exact or terminal pattern matches only; no interior substring matches are accepted. Surfaces that map to conflicting local meanings, known homographs, and unsafe short suffixes are omitted, as are ellipsis bundles and ambiguous aliases.',
  excludedUnsafeAliases: [...unsafePatternAliases].sort(),
  sourceCounts: { mimiKara: mimi.length, bunpoN3: bunpo.length },
  applied: apply,
  contextualApplied: applyContextual,
  totals,
  byMondai,
  changedQuestionCount: changed.length,
  changedQuestionIds: changed,
  patternAnnotatedQuestionCount: annotated.size,
  patternAnnotatedQuestionIds: [...annotated],
  appliedPatternOptionCount,
  standaloneSyncedQuestionCount,
  standaloneCuratedFallbacksRemoved,
  existingAnnotatedQuestionCount: alreadyAnnotatedQuestions,
  ambiguousPatternAliasCount: ambiguousPatternAliases.length,
  ambiguousPatternAliases,
  excludedContextualMatches,
  contextualMatchMethod:
    'For Mondai 1 and 3, each answer option is inserted into its own blank. Only unambiguous local grammar aliases found within six normalized characters of that insertion are reported. This is a candidate match, not independent semantic validation.',
  matchedOptions: matchLedger,
  unmatchedOptionCount: unmatched.length,
  unmatchedOptions: unmatched,
}
fs.mkdirSync(path.dirname(reportPath), { recursive: true })
fs.writeFileSync(reportPath, `${JSON.stringify(report, null, 2)}\n`, 'utf8')
if (apply && changed.length) {
  fs.writeFileSync(masterPath, `${JSON.stringify(exams, null, 2)}\n`, 'utf8')
  fs.writeFileSync(curatedPath, `${JSON.stringify(curated, null, 2)}\n`, 'utf8')
}
console.log(
  JSON.stringify(
    {
      ...report,
      changedQuestionIds: changed.length > 20 ? `${changed.length} ids in ${reportPath}` : changed,
      matchedOptions: `${matchLedger.length} option matches listed in ${reportPath}`,
      unmatchedOptions: `${unmatched.length} option surfaces listed in ${reportPath}`,
    },
    null,
    2
  )
)
