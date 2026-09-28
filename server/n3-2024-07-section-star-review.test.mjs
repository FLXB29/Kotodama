import assert from 'node:assert/strict'
import test from 'node:test'
import { NhaiKanjiService } from './nhaikanji-service.mjs'

test('July 2024 source-verified star explanations are served from the split exam', () => {
  const service = new NhaiKanjiService()
  const section = service.getJlptExamDetail('cm2u2yale01jo134i8wwru1oo-grammar-reading')
  const full = service.getJlptExamDetail('toan-n3-202407-full')
  const find = (exam, number) => exam.parts.flatMap((part) => part.questions || []).find((item) => item.number === number)

  for (const [number, answer, scriptText] of [
    [49, 4, 'いいにおい'],
    [51, 3, '覚えなければいけない'],
  ]) {
    const sectionQuestion = find(section, number)
    const fullQuestion = find(full, number)
    assert.equal(Number(sectionQuestion.correctAnswer ?? sectionQuestion.answer), answer)
    assert.equal(Number(fullQuestion.correctAnswer ?? fullQuestion.answer), answer)
    assert.ok(sectionQuestion.explanation, `question ${number} should inherit its reviewed explanation`)
    assert.match(sectionQuestion.explanation, /Câu hoàn chỉnh:.*Dịch:/su)
    assert.match(sectionQuestion.script, new RegExp(scriptText, 'u'))
    assert.equal(fullQuestion.starCorrectOrder[fullQuestion.starPosition], answer)
    assert.ok(fullQuestion.starVerificationSources?.length)
  }
})
