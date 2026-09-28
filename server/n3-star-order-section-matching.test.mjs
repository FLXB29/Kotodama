import assert from 'node:assert/strict'
import test from 'node:test'
import { NhaiKanjiService } from './nhaikanji-service.mjs'

test('source-verified star explanations survive HTML spacing and surrounding sentence context', () => {
  const service = new NhaiKanjiService()
  const cases = [
    {
      examId: 'cm2u2xkhj00zx134iasxlu6kb-grammar-reading',
      year: '2021',
      numbers: [49, 50, 51, 52, 53],
    },
    {
      examId: 'cm2u2xg4300wm134izpbjrysi-grammar-reading',
      year: '2020',
      numbers: [49],
    },
    {
      examId: 'cm2u2xbu400ta134iaz003jdg-grammar-reading',
      year: '2019',
      numbers: [52, 53],
    },
    {
      examId: 'cm2u2xg4300wm134izpbjrysi-grammar-reading',
      year: '2020',
      numbers: [51],
    },
    {
      examId: 'cm2u2wco4002g134io8nm04te-grammar-reading',
      year: '2015',
      numbers: [52, 53],
    },
    {
      examId: 'cm2u2w9ag0000134idizwckzy-grammar-reading',
      year: '2015',
      numbers: [52, 53],
    },
    {
      examId: 'cm2u2wyk900j8134i65mmhnr8-grammar-reading',
      year: '2018',
      numbers: [51, 52],
    },
  ]

  for (const { examId, year, numbers } of cases) {
    const exam = service.getJlptExamDetail(examId)
    assert.ok(exam, `${year} grammar-reading exam should exist`)
    const questions = exam.parts.flatMap((part) => part.questions || [])

    for (const number of numbers) {
      const question = questions.find((item) => Number(item.number) === number)
      assert.ok(question, `${year} question ${number} should exist`)
      assert.ok(question.explanation, `${year} question ${number} should inherit its verified explanation`)
      assert.match(question.explanation, /Dịch:/u)
    }
  }

  const july2021 = service.getJlptExamDetail('cm2u2xkhj00zx134iasxlu6kb-grammar-reading')
  const question50 = july2021.parts.flatMap((part) => part.questions).find((question) => question.number === 50)
  assert.match(question50.explanation, /câu hỏi gián tiếp/u)
  assert.doesNotMatch(question50.explanation, /nghe nói|tương truyền/iu)

  const dec2019 = service.getJlptExamDetail('cm2u2xbu400ta134iaz003jdg-grammar-reading')
  const dec2019Question53 = dec2019.parts.flatMap((part) => part.questions).find((question) => question.number === 53)
  assert.match(dec2019Question53.question, /明日のパーティー/u)
  assert.doesNotMatch(dec2019Question53.question, /昨日のパーティー/u)
  assert.equal(dec2019Question53.options[1].text, '乗せていってあげる')

  const jul2015 = service.getJlptExamDetail('cm2u2w9ag0000134idizwckzy-grammar-reading')
  const jul2015Question52 = jul2015.parts.flatMap((part) => part.questions).find((question) => question.number === 52)
  assert.equal(jul2015Question52.options[2].text, '寂しい')
  assert.match(jul2015Question52.script, /寂しいと/u)
  const jul2015Question53 = jul2015.parts.flatMap((part) => part.questions).find((question) => question.number === 53)
  assert.match(jul2015Question53.script.replace(/<[^>]*>/gu, '').replace(/\s+/gu, ''), /30日以上雨の降らない日が/u)

  const dec2015 = service.getJlptExamDetail('cm2u2wco4002g134io8nm04te-grammar-reading')
  const dec2015Questions = new Map(
    dec2015.parts.flatMap((part) => part.questions).map((question) => [question.number, question])
  )
  assert.match(dec2015Questions.get(52).script, /パソコンの基本的な使い方/u)
  assert.match(dec2015Questions.get(53).script, /エアコンから出た冷たい空気が部屋の下の方/u)
})
