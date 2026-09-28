import fs from 'node:fs'
import path from 'node:path'
import { normalizeChoiceText } from './n3-option-normalization.mjs'

const draft = JSON.parse(fs.readFileSync(path.resolve('reports/n3-quality-audit/source-import-draft.json'), 'utf8'))
const exams = JSON.parse(fs.readFileSync(path.resolve('data/jlpt_n3_toan_master.json'), 'utf8'))
let total = 0
let equal = 0
let placeholder = 0
const mismatches = []
let verifiedWithSource = 0
const sourceConflicts = []
const secondaryKeyDiscrepancies = []

for (const row of draft) {
  const exam = exams.find((item) => item.id === row.examId)
  const part = exam.parts.find((item) => item.title.includes('Ngữ pháp') && item.title.includes('Mondai 2'))
  for (const source of row.sections.star.candidates) {
    const question = part.questions[source.index]
    const oldOptions = question.options || []
    const hasDisclosedSourceConflict =
      question.starVerificationStatus === 'conflict' ||
      question.starVerificationStatus === 'source-conflict-disclosed-editorial-reconstruction'
    if (hasDisclosedSourceConflict) {
      sourceConflicts.push({ exam: row.exam, question: source.qNumber, note: question.starVerificationNote })
    }
    if (/secondary-key discrepancy/i.test(question.starVerificationNote || '')) {
      secondaryKeyDiscrepancies.push({ exam: row.exam, question: source.qNumber, note: question.starVerificationNote })
    }
    if (
      !hasDisclosedSourceConflict &&
      question.starOrderVerified &&
      question.starPositionVerified &&
      question.starVerificationSources?.length
    ) {
      verifiedWithSource++
    }
    if (oldOptions.every((value) => /^[①②③④]$/.test(value.trim()))) {
      placeholder++
      continue
    }
    total++
    const existing = oldOptions.map((value, index) => normalizeChoiceText(value, index + 1))
    const extracted = (source.choices || []).map((value) => normalizeChoiceText(value))
    if (existing.length === extracted.length && existing.every((value, index) => value === extracted[index])) equal++
    else {
      const differingOptions = existing.flatMap((value, index) =>
        value === extracted[index] ? [] : [{ existing: value, extracted: extracted[index] }]
      )
      const pageNumberSuffixFlags = differingOptions.map(
        ({ existing: stored, extracted: parsed }) =>
          parsed.startsWith(stored) && /^\d{1,2}$/u.test(parsed.slice(stored.length))
      )
      const classification = pageNumberSuffixFlags.every(Boolean)
        ? 'possible-page-number-suffix'
        : pageNumberSuffixFlags.some(Boolean)
          ? 'mixed-with-possible-page-number-suffix'
          : 'other-text-layer-difference'
      mismatches.push({
        exam: row.exam,
        question: source.qNumber,
        classification,
        existing,
        extracted,
      })
    }
  }
}

const report = {
  generatedAt: new Date().toISOString(),
  method:
    'Exact normalized comparison between stored star choices and choices extracted from the source PDF text layer. Choice labels are stripped only when they match the choice slot, preserving content numerals such as 「2週間は」. Mismatches that differ only by a trailing one- or two-digit suffix are flagged as possible printed-page-number contamination, not automatically corrected.',
  total,
  equal,
  mismatchCount: mismatches.length,
  possiblePageNumberSuffixCount: mismatches.filter(
    (mismatch) => mismatch.classification === 'possible-page-number-suffix'
  ).length,
  mixedWithPossiblePageNumberSuffixCount: mismatches.filter(
    (mismatch) => mismatch.classification === 'mixed-with-possible-page-number-suffix'
  ).length,
  otherTextLayerDifferenceCount: mismatches.filter(
    (mismatch) => mismatch.classification === 'other-text-layer-difference'
  ).length,
  placeholder,
  verifiedWithSource,
  sourceConflicts,
  secondaryKeyDiscrepancies,
  mismatches,
}
const output = path.resolve('reports/n3-quality-audit/star-option-audit.json')
fs.writeFileSync(output, `${JSON.stringify(report, null, 2)}\n`, 'utf8')
console.log(
  JSON.stringify(
    {
      output,
      total,
      equal,
      mismatchCount: mismatches.length,
      possiblePageNumberSuffixCount: report.possiblePageNumberSuffixCount,
      mixedWithPossiblePageNumberSuffixCount: report.mixedWithPossiblePageNumberSuffixCount,
      otherTextLayerDifferenceCount: report.otherTextLayerDifferenceCount,
      placeholder,
      verifiedWithSource,
      sourceConflictCount: sourceConflicts.length,
      secondaryKeyDiscrepancyCount: secondaryKeyDiscrepancies.length,
    },
    null,
    2
  )
)
