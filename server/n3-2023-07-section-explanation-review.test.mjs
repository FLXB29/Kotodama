import assert from 'node:assert/strict'
import test from 'node:test'
import { NhaiKanjiService } from './nhaikanji-service.mjs'

test('July 2023 grammar section serves the curated explanation for each of its 13 grammar questions', () => {
  const service = new NhaiKanjiService()
  const exam = service.getJlptExamDetail('cm2u2y1xl01d2134ilubjx79d-grammar-reading')
  const questions = exam.parts.flatMap((part) => part.questions || [])

  for (let number = 36; number <= 48; number += 1) {
    const question = questions.find((item) => Number(item.number) === number)
    assert.ok(question, `missing question ${number}`)
    assert.match(question.explanation || '', /^Đáp án [1-4] —/u, `question ${number}`)
    assert.match(question.explanation, /Dịch:/u, `question ${number} should translate the sentence`)
    for (const choice of [1, 2, 3, 4]) {
      assert.match(question.explanation, new RegExp(`^${choice}\\.`, 'mu'), `question ${number} option ${choice}`)
    }
  }

  const question44 = questions.find((item) => item.number === 44)
  assert.equal(question44.options[0].text, '眠りたかった')
  assert.match(question44.question, /気になって/u)
  const question46 = questions.find((item) => item.number === 46)
  assert.match(question46.question, /そうだね。(?:<\/strong><\/span><\/p>|$)/u)
  assert.doesNotMatch(question46.question, /そうだね。J/u)
  assert.match(questions.find((item) => item.number === 47).question, /そうなんだ/u)
  assert.match(questions.find((item) => item.number === 48).question, /店員/u)
})
