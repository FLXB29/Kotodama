import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import test from 'node:test'
import { NhaiKanjiService } from './nhaikanji-service.mjs'

const readJson = (filePath) => JSON.parse(fs.readFileSync(path.resolve(filePath), 'utf8'))
const master = readJson('data/jlpt_n3_toan_master.json')
const fullMaster = readJson('data/jlpt_full_master.json')
const curated = readJson('data/jlpt_n3_explanations_curated.json')
const report = readJson('reports/n3-quality-audit/star-source-2022-12-review.json')
const starAudit = readJson('reports/n3-quality-audit/star-option-audit.json')
const exam = master.find((item) => item.id === 'toan-n3-202212-full')
const fullExam = fullMaster.find((item) => item.id === 'cm2u2xxmo019t134izzsjxgrl-grammar-reading')
const sectionExamId = 'cm2u2xxmo019t134izzsjxgrl-grammar-reading'
const expected = [
  {
    id: 'toan_q_2022_12_49',
    number: 49,
    options: ['メール', 'から', 'に', 'の'],
    order: [2, 4, 1, 3],
    answer: 1,
    position: 2,
    text: 'メール',
  },
  {
    id: 'toan_q_2022_12_50',
    number: 50,
    options: ['いるので', 'いる間に', '友達が', '東京に'],
    order: [3, 1, 4, 2],
    answer: 4,
    position: 2,
    text: '東京に',
  },
  {
    id: 'toan_q_2022_12_51',
    number: 51,
    options: ['1年前に習い始めたのだが', '弾くほど', '弾けば', '弾けるようになりたくて'],
    order: [4, 1, 3, 2],
    answer: 3,
    position: 2,
    text: '弾けば',
  },
  {
    id: 'toan_q_2022_12_52',
    number: 52,
    options: ['こういう色の', '欲しい', 'と思っていた', 'かばんが'],
    order: [1, 4, 2, 3],
    answer: 2,
    position: 2,
    text: '欲しい',
  },
  {
    id: 'toan_q_2022_12_53',
    number: 53,
    options: ['という点で', '違いは', '生活している', 'ない'],
    order: [3, 1, 2, 4],
    answer: 2,
    position: 2,
    text: '違いは',
  },
]

const questionsByNumber = (targetExam) =>
  new Map(
    targetExam.parts.flatMap((part) => part.questions || []).map((question) => [Number(question.number), question])
  )
const normalize = (option) =>
  String(typeof option === 'string' ? option : option?.text || '')
    .normalize('NFKC')
    .replace(/^\s*[1-4][.．、]\s*/u, '')
    .replace(/^\s*[1-4]\s+/u, '')
    .replace(/\s+/gu, '')
    .trim()

test('December 2022 star fragments, ★ slots, keys, and explanations match the supplied PDF', () => {
  assert.ok(exam)
  assert.ok(fullExam)
  assert.equal(report.sourcePdf.driveFolderId, '1ccBkcPviGdtm9TZZaDP0393exMAG5MDv')
  assert.deepEqual(
    report.sourcePdf.renderedPages.map((page) => page.printedQuestions),
    [
      [14, 15, 16],
      [17, 18],
    ]
  )
  assert.match(report.sourcePdf.method, /third of four answer slots/u)

  const sectionPart = exam.parts.find((part) => part.title.includes('Ngữ pháp') && part.title.includes('Mondai 2'))
  const fullPart = fullExam.parts.find((part) => part.title === 'Mondai 2')
  assert.ok(sectionPart)
  assert.ok(fullPart)
  const sectionQuestions = questionsByNumber({ parts: [sectionPart] })
  const fullQuestions = questionsByNumber({ parts: [fullPart] })

  for (const item of expected) {
    const question = sectionQuestions.get(item.number)
    const fullQuestion = fullQuestions.get(item.number)
    const questionReport = report.questions.find((entry) => entry.fullExamQuestionId === item.id)
    assert.ok(question, `missing ${item.id}`)
    assert.ok(fullQuestion, `missing standalone question ${item.number}`)
    assert.ok(questionReport, `missing source report for ${item.id}`)
    assert.deepEqual(question.options.map(normalize), item.options.map(normalize), item.id)
    assert.deepEqual(fullQuestion.options.map(normalize), item.options.map(normalize), item.id)
    assert.equal(question.starVerificationStatus, 'verified-against-source', item.id)
    assert.equal(question.starOrderVerified, true, item.id)
    assert.equal(question.starPositionVerified, true, item.id)
    assert.deepEqual(question.starCorrectOrder, item.order, item.id)
    assert.deepEqual(fullQuestion.starCorrectOrder, item.order, item.id)
    assert.equal(question.starPosition, item.position, item.id)
    assert.equal(fullQuestion.starPosition, item.position, item.id)
    assert.equal(Number(question.correctAnswer ?? question.answer), item.answer, item.id)
    assert.equal(Number(fullQuestion.correctAnswer ?? fullQuestion.answer), item.answer, item.id)
    assert.equal(
      fullQuestion.script.replace(/<[^>]*>/gu, '').replace(/\s+/gu, ''),
      item.order.map((choice) => item.options[choice - 1]).join(''),
      item.id
    )
    assert.match(fullQuestion.script || '', new RegExp(`<u>${item.text}</u>`, 'u'), item.id)
    assert.ok(question.starVerificationSources?.includes(report.sourcePdf.driveFolderUrl), item.id)
    assert.ok(
      question.starVerificationSources?.some((url) => url.endsWith('#page=25')),
      item.id
    )

    for (const explanation of [question.explanation, fullQuestion.explanation, curated[item.id]]) {
      assert.match(explanation || '', /Câu hoàn chỉnh:/u, item.id)
      assert.match(explanation || '', /Dịch:/u, item.id)
      assert.match(explanation || '', /ô ★/u, item.id)
      assert.match(explanation || '', new RegExp(item.text, 'u'), item.id)
      for (let option = 1; option <= 4; option += 1)
        assert.match(explanation || '', new RegExp(`^${option}\\.`, 'mu'), item.id)
    }
    assert.equal(questionReport.appData.answer, item.answer, item.id)
  }

  assert.ok(report.questions.every((question) => question.officialKeyEstablished === false))
  assert.equal(report.officialKeyEstablished, false)
})

test('the secondary answer compilation agrees with all five keys without being labelled official', () => {
  assert.equal(report.secondaryAnswerKey.viewerPage, 25)
  assert.deepEqual(
    report.secondaryAnswerKey.answers,
    expected.map((item) => item.answer)
  )
  assert.equal(report.secondaryAnswerKey.matchesStoredAnswers, true)
  assert.match(report.secondaryAnswerKey.authority, /not authenticated as an official/u)
})

test('the visually printed year in question 16 is preserved despite the text-layer spacing', () => {
  const item = report.questions.find((question) => question.printedQuestion === 16)
  assert.ok(item)
  assert.ok(report.textLayerNotes.some((note) => /「1年前に習い始めたのだが」/u.test(note)))
  assert.deepEqual(item.printedOptions, expected[2].options)
  assert.equal(
    starAudit.mismatches.some((mismatch) => mismatch.exam === '2022/12' && mismatch.question === 16),
    false,
    'the OCR comparison must not mistake the year digit for an option label'
  )
})

test('the exam service serves the reviewed star explanations in both exam records', () => {
  const service = new NhaiKanjiService()
  for (const examId of ['toan-n3-202212-full', sectionExamId]) {
    const served = service.getJlptExamDetail(examId)
    assert.ok(served, `service should return ${examId}`)
    const servedQuestions = questionsByNumber(served)
    for (const item of expected) {
      const question = servedQuestions.get(item.number)
      assert.ok(question, `service response missing question ${item.number} in ${examId}`)
      assert.match(question.explanation || '', /Câu hoàn chỉnh:/u)
      assert.match(question.explanation || '', /Dịch:/u)
      if (examId === sectionExamId) assert.match(question.script || '', new RegExp(`<u>${item.text}</u>`, 'u'))
    }
  }
})
