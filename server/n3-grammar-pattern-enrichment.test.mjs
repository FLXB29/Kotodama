import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import test from 'node:test'

const root = path.resolve('.')
const exams = JSON.parse(fs.readFileSync(path.join(root, 'data/jlpt_n3_toan_master.json'), 'utf8'))
const standaloneExams = JSON.parse(fs.readFileSync(path.join(root, 'data/jlpt_full_master.json'), 'utf8'))
const report = JSON.parse(
  fs.readFileSync(path.join(root, 'reports/n3-quality-audit/grammar-pattern-coverage.json'), 'utf8')
)
const curated = JSON.parse(fs.readFileSync(path.join(root, 'data/jlpt_n3_explanations_curated.json'), 'utf8'))
const mimi = JSON.parse(fs.readFileSync(path.join(root, 'data/mimi_kara_n3_grammar.json'), 'utf8'))
const bunpo = JSON.parse(fs.readFileSync(path.join(root, 'data/nhaikanji/bunpo_data.json'), 'utf8')).filter(
  (entry) => entry.level === 'N3'
)

const questionsById = new Map(
  exams.flatMap((exam) =>
    (exam.parts || []).flatMap((part) => (part.questions || []).map((question) => [question.id, question]))
  )
)
const mondaiByQuestionId = new Map(
  exams.flatMap((exam) =>
    (exam.parts || []).flatMap((part) =>
      (part.questions || []).map((question) => [question.id, part.title.match(/Mondai\s+(\d+)/u)?.[1]])
    )
  )
)
const directMatches = report.matchedOptions.filter((match) => !match.contextual)
const applicableMatches = directMatches.filter((match) => mondaiByQuestionId.get(match.questionId) !== '2')

test('grammar enrichment applies only direct matches from the local N3 data', () => {
  assert.equal(report.applied, true)
  assert.equal(report.contextualApplied, false)
  assert.equal(report.totals.optionsWithPattern, directMatches.length)
  assert.equal(directMatches.length, 166)
  assert.equal(
    directMatches.some((match) => match.questionId === 'toan_q_2025_12_55' && match.matchedSurface === 'でも'),
    false,
    'the sentence-initial conjunction でも must not be labeled as the particle pattern Nでも'
  )
  assert.ok(
    report.excludedContextualMatches.some((match) => match.questionId === 'toan_q_2025_12_55'),
    'record the rejected surface match and the contextual reason'
  )
  for (const unsafeAlias of report.excludedUnsafeAliases) {
    assert.equal(
      directMatches.some((match) => match.matchedSurface === unsafeAlias),
      false,
      `unsafe suffix ${unsafeAlias} must not be attached to a grammar explanation`
    )
  }
  assert.equal(report.patternAnnotatedQuestionCount, new Set(applicableMatches.map((match) => match.questionId)).size)
  assert.equal(report.appliedPatternOptionCount, applicableMatches.length)
  assert.equal(report.patternAnnotatedQuestionIds.length, report.patternAnnotatedQuestionCount)
  assert.equal(report.standaloneSyncedQuestionCount, 62)
  assert.ok(Number.isInteger(report.standaloneCuratedFallbacksRemoved))

  const annotatedIds = new Set(report.patternAnnotatedQuestionIds)
  assert.equal(annotatedIds.size, report.patternAnnotatedQuestionCount)
  for (const match of applicableMatches) assert.ok(annotatedIds.has(match.questionId))

  const localEntries = [
    ...mimi.map((entry) => ({ pattern: entry.title, meaning: entry.meaning })),
    ...bunpo.map((entry) => ({ pattern: entry.pattern, meaning: entry.shortMeaning })),
  ]

  for (const match of applicableMatches) {
    const question = questionsById.get(match.questionId)
    assert.ok(question, `missing question ${match.questionId}`)
    assert.ok(question.options.includes(match.option), `option changed for ${match.questionId}`)
    assert.ok(
      localEntries.some((entry) => entry.pattern === match.pattern && entry.meaning === match.meaning),
      `pattern is absent from the local N3 sources: ${match.pattern}`
    )

    const optionIndex = question.options.indexOf(match.option)
    const label = String(match.option).match(/^\s*([1-4])/u)?.[1] || String(optionIndex + 1)
    const answerStatus = Number(label) === Number(question.answer) ? 'đáp án đang lưu' : 'không phải đáp án đang lưu'
    const expectedLine = `Phương án ${label} (${answerStatus}) — 「${match.pattern}」: ${match.meaning}`

    const explanation = question.explanation || curated[match.questionId] || ''
    assert.ok(
      explanation.includes(expectedLine),
      `missing local pattern explanation for ${match.questionId}: ${expectedLine}`
    )
  }

  const knownDistractorMatch = applicableMatches.find(
    (match) => match.questionId === 'toan_q_2021_12_37' && match.option.includes('次第に')
  )
  assert.ok(knownDistractorMatch, 'expected the December 2021 item with a matched distractor')
  const knownQuestion = questionsById.get(knownDistractorMatch.questionId)
  assert.match(
    knownQuestion.explanation,
    /Phương án 3 \(không phải đáp án đang lưu\).*次第に/u,
    'a pattern match on a wrong option must be clearly marked as wrong'
  )

  assert.equal(
    applicableMatches.some(
      (match) =>
        match.questionId === 'toan_q_2011_12_36' &&
        match.option.includes('にして') &&
        match.pattern === '～をきっかけに／にして／として'
    ),
    false,
    'a shortened alternative must not be mistaken for the full きっかけ construction'
  )
  assert.equal(
    applicableMatches.some(
      (match) =>
        match.questionId === 'toan_q_2011_07_44' &&
        match.option.includes('みさせてください') &&
        match.pattern.includes('ぜひ・なんとかして')
    ),
    false,
    'てください alone must not identify an unrelated optional pattern suffix'
  )
  assert.equal(
    directMatches.some((match) => match.questionId === 'toan_q_2015_12_56' && match.matchedSurface === 'より'),
    false,
    'より alone must not identify the multi-sense による／より bundle'
  )
  assert.equal(
    curated.toan_q_2015_12_56?.includes('Mẫu ngữ pháp được nhận diện') || false,
    false,
    'a stale generated alias note must be removed after its ambiguous suffix is excluded'
  )

  for (const questionId of annotatedIds) {
    const question = questionsById.get(questionId)
    assert.ok(question, `missing changed question ${questionId}`)
    const explanation = question.explanation || curated[questionId] || ''
    assert.ok(explanation.includes('Mẫu ngữ pháp được nhận diện từ dữ liệu N3 cục bộ'))
    assert.equal(explanation.includes('Mẫu khớp khi đặt từng lựa chọn vào chỗ trống'), false)
  }

  const sourceByDateAndNumber = new Map()
  for (const exam of exams) {
    const date = /toan-n3-(\d{4})(\d{2})-full/u.exec(exam.id)
    if (!date) continue
    const examDate = `${date[1]}${date[2]}`
    for (const part of exam.parts || []) {
      if (!part.title.includes('Ngữ pháp')) continue
      for (const question of part.questions || []) {
        const explanation = question.explanation || curated[question.id] || ''
        if (report.changedQuestionIds.includes(question.id)) {
          sourceByDateAndNumber.set(`${examDate}:${question.number}`, explanation)
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
        const expected = sourceByDateAndNumber.get(`${examDate}:${question.number}`)
        if (expected) {
          assert.equal(question.explanation, expected, `${exam.id} question ${question.number}`)
          assert.equal(
            curated[question.id]?.includes('Mẫu ngữ pháp được nhận diện từ dữ liệu N3 cục bộ') || false,
            false,
            `${exam.id} must not use an id-only grammar-pattern fallback for question ${question.number}`
          )
        }
        assert.equal(
          curated[question.id]?.includes('Mẫu ngữ pháp được nhận diện từ dữ liệu N3 cục bộ') || false,
          false,
          `${exam.id} must not keep a generated annotation as an id-only fallback`
        )
      }
    }
  }
})
