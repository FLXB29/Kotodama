import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import test from 'node:test'
import { normalizeChoiceText } from '../scripts/n3-option-normalization.mjs'

const readJson = (filePath) => JSON.parse(fs.readFileSync(path.resolve(filePath), 'utf8'))
const audit = readJson('reports/n3-quality-audit/star-option-audit.json')
const exams = readJson('data/jlpt_n3_toan_master.json')

test('star option audit strips only the matching choice label and preserves content numerals', () => {
  assert.equal(normalizeChoiceText('4. 2 週間は', 4), '2週間は')
  assert.equal(normalizeChoiceText('2. ばかり', 2), 'ばかり')
  assert.equal(normalizeChoiceText('2 週間は', 4), '2週間は')
  assert.equal(normalizeChoiceText('2年前に', 2), '2年前に')

  assert.equal(audit.total, 150)
  assert.equal(audit.equal, 126)
  assert.equal(audit.mismatchCount, 24)
  assert.equal(audit.mismatches.length, audit.mismatchCount)

  for (const [exam, question] of [
    ['2021/12', 15], // choice 4 begins with the meaningful numeral in 「2週間は」
    ['2022/12', 16], // choice 1 begins with the meaningful year in 「1年前」
  ]) {
    assert.equal(
      audit.mismatches.some((item) => item.exam === exam && item.question === question),
      false,
      `${exam} question ${question} should compare equal`
    )
  }

  const exam2021 = exams.find((item) => item.id === 'toan-n3-202112-full')
  const grammar = exam2021.parts.find((part) => part.title.includes('Ngữ pháp') && part.title.includes('Mondai 2'))
  const question15 = grammar.questions.find((item) => item.id === 'toan_q_2021_12_50')
  assert.match(question15.options[3], /2\s*週間は/u)
  assert.equal(question15.answer, 1)
  assert.deepEqual(question15.starCorrectOrder, [3, 4, 1, 2])

  assert.ok(audit.mismatches.some((item) => item.exam === '2025/12' && item.question === 16))
  assert.equal(
    audit.mismatches.filter((item) => item.classification === 'possible-page-number-suffix').length,
    audit.possiblePageNumberSuffixCount
  )
  assert.equal(
    audit.mismatches.filter((item) => item.classification === 'mixed-with-possible-page-number-suffix').length,
    audit.mixedWithPossiblePageNumberSuffixCount
  )
  assert.equal(
    audit.mismatches.filter((item) => item.classification === 'other-text-layer-difference').length,
    audit.otherTextLayerDifferenceCount
  )
})
