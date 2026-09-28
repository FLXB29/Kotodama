import fs from 'node:fs'
import path from 'node:path'
import crypto from 'node:crypto'
import { execFileSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'
import { normalizeChoiceText } from './n3-option-normalization.mjs'

// This audit measures consistency and review signals, NEVER linguistic correctness.
const root = fileURLToPath(new URL('../', import.meta.url))
const read = (file) => fs.readFileSync(path.join(root, file), 'utf8').replace(/^\uFEFF/, '')
const masterFile = 'data/jlpt_n3_toan_master.json'
const curatedFile = 'data/jlpt_n3_explanations_curated.json'
const exams = JSON.parse(read(masterFile))
const curated = JSON.parse(read(curatedFile))
const text = (value) =>
  String(value || '')
    .replace(/<[^>]*>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
const normalizeOption = (value, expectedChoiceNumber) =>
  normalizeChoiceText(text(typeof value === 'object' && value ? value.text : value), expectedChoiceNumber)
const flatten = (items) => items.flatMap((e) => e.parts.flatMap((p) => p.questions))
let baseline = new Map()
let baselineCommit = null
try {
  baselineCommit = execFileSync('git', ['rev-parse', 'HEAD'], { cwd: root, encoding: 'utf8' }).trim()
  baseline = new Map(
    flatten(
      JSON.parse(execFileSync('git', ['show', `HEAD:${masterFile}`], { cwd: root, encoding: 'utf8', maxBuffer: 30e6 }))
    ).map((q) => [q.id, q])
  )
} catch {
  /* A checkout without Git still supports the content audit. */
}
const rows = []
const ids = new Set()
for (const exam of exams)
  for (const part of exam.parts)
    for (const q of part.questions) {
      // Match the production service: embedded explanation takes priority.
      const explanation = text(q.explanation || curated[q.id])
      const answer = q.correctAnswer ?? q.answer
      const labels = [
        ...explanation.matchAll(/^đáp án\s*(?:(?:đúng|chính xác)\s*)?(?:là\s*)?[:：]?\s*([1-4])(?=\D|$)/gim),
      ].map((m) => Number(m[1]))
      const flags = []
      const optionIndexes = new Map()
      for (const [index, option] of (q.options || []).entries()) {
        const normalized = normalizeOption(option, index + 1)
        if (!normalized) continue
        const indexes = optionIndexes.get(normalized) || []
        indexes.push(index + 1)
        optionIndexes.set(normalized, indexes)
      }
      const duplicateOptions = [...optionIndexes.entries()]
        .filter(([, indexes]) => indexes.length > 1)
        .map(([option, indexes]) => ({ option, indexes }))
      if (ids.has(q.id)) flags.push('duplicate_id')
      ids.add(q.id)
      if (!Number.isInteger(answer) || answer < 1 || answer > q.options.length) flags.push('invalid_answer')
      if (q.answer !== q.correctAnswer) flags.push('answer_fields_disagree')
      if (labels.some((n) => n !== answer)) flags.push('explanation_answer_label_mismatch')
      if (!explanation) flags.push('missing_explanation')
      if (duplicateOptions.length) flags.push('duplicate_answer_options')
      const hasImageContext = /<img\b/i.test(`${q.question || ''} ${q.passage || ''}`)
      const translationSignal = /dịch|nghĩa (?:của câu|là)|câu (?:này |nói |có nghĩa)|tiếng việt/i.test(explanation)
      const alternativesSignal =
        /lựa chọn (?:khác|còn lại)|phương án|đáp án (?:khác|còn lại)|các từ khác|sai|không phù hợp|không đúng/i.test(
          explanation
        )
      const summarySignal = /ghi nhớ|tổng kết|lưu ý|mẫu |cấu trúc|quy tắc|hãy chú ý/i.test(explanation)
      const localGlossaryBlocks = (
        explanation.match(
          /(?:Nghĩa các lựa chọn|Nghĩa bốn lựa chọn|Nghĩa lựa chọn|Từ trọng tâm|Từ gạch chân|Từ được gạch chân) \(từ điển cục bộ\):/giu
        ) || []
      ).length
      const localGrammarBlocks = (explanation.match(/Mẫu ngữ pháp được nhận diện từ dữ liệu N3 cục bộ/giu) || []).length
      if (localGlossaryBlocks > 1 || localGrammarBlocks > 1) flags.push('duplicate_generated_annotation')
      const old = baseline.get(q.id)
      rows.push({
        examId: exam.id,
        questionId: q.id,
        number: q.number,
        section: part.sectionType,
        group: q.mondaiGroupIndex,
        answer,
        explanationSource: q.explanation ? 'embedded' : curated[q.id] ? 'curated' : 'missing',
        explanationChars: explanation.length,
        labels,
        flags,
        duplicateOptions,
        hasImageContext,
        hasScript: Boolean(text(q.script)),
        hasAudio: Boolean(q.audioUrl || q.audio || part.audioUrl),
        quarantinedExplanation: /^(?:chưa thẩm định|chưa xác minh)/i.test(explanation),
        translationSignal,
        alternativesSignal,
        summarySignal,
        localGlossaryBlocks,
        localGrammarBlocks,
        changedAnswer: Boolean(old && old.correctAnswer !== q.correctAnswer),
        previousAnswer: old?.correctAnswer ?? null,
        stem: text(q.question),
        options: q.options,
        explanation,
        semanticReview: 'not_certified_by_automation',
      })
    }
const count = (items, fn) => items.filter(fn).length
const summarize = (items) => ({
  questions: items.length,
  explanations: count(items, (q) => q.explanationChars > 0),
  labelMismatches: count(items, (q) => q.flags.includes('explanation_answer_label_mismatch')),
  structuralErrors: count(items, (q) =>
    q.flags.some((f) =>
      [
        'invalid_answer',
        'duplicate_id',
        'answer_fields_disagree',
        'duplicate_generated_annotation',
        'duplicate_answer_options',
      ].includes(f)
    )
  ),
  duplicateOptionQuestions: count(items, (q) => q.duplicateOptions.length > 0),
  imageContext: count(items, (q) => q.hasImageContext),
  scripts: count(items, (q) => q.hasScript),
  quarantinedExplanations: count(items, (q) => q.quarantinedExplanation),
  shortExplanationsUnder160Chars: count(items, (q) => q.explanationChars < 160),
  changedAnswers: count(items, (q) => q.changedAnswer),
  translationSignal: count(items, (q) => q.translationSignal),
  alternativesSignal: count(items, (q) => q.alternativesSignal),
  summarySignal: count(items, (q) => q.summarySignal),
})
const totals = summarize(rows)
const byExam = exams.map((e) => ({ examId: e.id, ...summarize(rows.filter((q) => q.examId === e.id)) }))
const out = path.join(root, 'reports/n3-quality-audit')
fs.mkdirSync(out, { recursive: true })
const metadata = {
  generatedAt: new Date().toISOString(),
  baselineCommit,
  hashes: Object.fromEntries(
    [masterFile, curatedFile].map((f) => [f, crypto.createHash('sha256').update(read(f)).digest('hex')])
  ),
  method:
    'Structural checks include answer-option duplicates after numbering/whitespace normalization. Regex signals are editorial filters only. Embedded explanations override curated entries. No semantic correctness is inferred.',
  totals,
  byExam,
}
fs.writeFileSync(path.join(out, 'audit.json'), JSON.stringify({ ...metadata, questions: rows }, null, 2) + '\n')
fs.writeFileSync(path.join(out, 'audit-run-summary.json'), JSON.stringify({ out, ...metadata }, null, 2) + '\n')
fs.writeFileSync(
  path.join(out, 'duplicate-option-audit.json'),
  JSON.stringify(
    {
      generatedAt: metadata.generatedAt,
      method:
        'Exact duplicate option text after removing the leading option number and whitespace; not a semantic equivalence check.',
      count: totals.duplicateOptionQuestions,
      unresolved: rows
        .filter((q) => q.duplicateOptions.length)
        .map((q) => ({
          examId: q.examId,
          questionId: q.questionId,
          number: q.number,
          section: q.section,
          group: q.group,
          answer: q.answer,
          duplicateOptions: q.duplicateOptions,
          options: q.options,
        })),
    },
    null,
    2
  ) + '\n'
)
const csvFields = [
  'examId',
  'questionId',
  'number',
  'answer',
  'explanationSource',
  'flags',
  'duplicateOptions',
  'hasImageContext',
  'hasScript',
  'quarantinedExplanation',
  'translationSignal',
  'alternativesSignal',
  'summarySignal',
  'changedAnswer',
  'previousAnswer',
  'semanticReview',
]
const csv = (value) => '"' + String(Array.isArray(value) ? value.join(';') : (value ?? '')).replaceAll('"', '""') + '"'
fs.writeFileSync(
  path.join(out, 'questions.csv'),
  '\uFEFF' + [csvFields.join(','), ...rows.map((q) => csvFields.map((f) => csv(q[f])).join(','))].join('\r\n')
)
const table = byExam
  .map(
    (e) =>
      `| ${e.examId.replace('toan-n3-', '').replace('-full', '')} | ${e.questions} | ${e.explanations} | ${e.labelMismatches} | ${e.imageContext} | ${e.changedAnswers} |`
  )
  .join('\n')
const warnings = rows
  .filter((q) => q.flags.length)
  .map((q) => `| ${q.questionId} | ${q.answer} | ${q.labels.join(', ')} | ${q.flags.join(', ')} |`)
  .join('\n')
fs.writeFileSync(
  path.join(out, 'statistics.md'),
  `# Thống kê tự động N3\n\nSinh lúc ${metadata.generatedAt}. So với Git HEAD ${baselineCommit || 'không có'}.\n\nĐọc đúng lời giải mà dịch vụ ưu tiên: explanation trong đề, sau đó mới curated. Không suy ra chất lượng ngôn ngữ từ độ phủ hoặc từ khóa.\n\n| Chỉ tiêu | Số câu |\n|---|---:|\n${Object.entries(
    totals
  )
    .map(([k, v]) => `| ${k} | ${v} |`)
    .join(
      '\n'
    )}\n\nCác trường Signal chỉ là dấu hiệu từ khóa để lọc công việc biên tập, không phải số câu đạt tiêu chí. ImageContext nghĩa là có ảnh trong đề/đoạn văn, chưa chứng minh đó là toàn bộ ngữ cảnh.\n\n| Đề | Câu | Có lời giải | Lệch số đáp án trong lời giải | Có ngữ cảnh ảnh | Đổi khóa so với HEAD |\n|---|---:|---:|---:|---:|---:|\n${table}\n\n## Cảnh báo cần đọc lại\n\nPhát hiện số đáp án bằng biểu thức chính quy; một câu có thể nhắc đáp án sai để loại trừ nên cần xác nhận thủ công.\n\n| ID | Khóa hiện tại | Số được nhắc | Cảnh báo |\n|---|---:|---|---|\n${warnings || '| Không có | | | |'}\n`
)
console.log(JSON.stringify({ out, ...metadata }, null, 2))
