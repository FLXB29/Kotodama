import fs from 'node:fs'
import prettier from 'prettier'

const masterPath = 'data/jlpt_n3_toan_master.json'
const examId = 'toan-n3-201112-full'
const apply = process.argv.includes('--apply')
const formatJson = async (file, value) =>
  prettier.format(JSON.stringify(value), { ...(await prettier.resolveConfig(file)), filepath: file })
const corrections = [
  {
    number: 32,
    answer: 2,
    before: [
      '1.朝の電車はこんでいたが、帰りはゆるかった',
      '2.ズボンがゆるいので、ベルトをきつくしめた',
      '今回の旅行は荷物が少ないので、スーツケースがまだゆるい',
      '4.この家は、夫婦二人で住むなら十分ゆるいです',
    ],
    after: [
      '1.朝の電車はこんでいたが、帰りはゆるかった',
      '2.ズボンがゆるいので、ベルトをきつくしめた',
      '3.今回の旅行は荷物が少ないので、スーツケースがまだゆるい',
      '4.この家は、夫婦二人で住むなら十分ゆるいです',
    ],
  },
  {
    number: 33,
    answer: 1,
    before: [
      '1.短気の性格の人は、この仕事にはあまり向かない',
      '2.雨のせいで、今日はグランドの性格がよくくない',
      '3.この車の性格は電気で走る点だ',
      '4.あの人はその日の性格で言うことが変わる',
    ],
    after: [
      '1.短気な性格の人は、この仕事にはあまり向かない',
      '2.雨のせいで、今日はグランドの性格がよくない',
      '3.この車の性格は電気で走る点だ',
      '4.あの人はその日の性格で言うことが変わる',
    ],
  },
]
const normalizeOption = (value) =>
  String(value || '')
    .normalize('NFKC')
    .replace(/^\s*[1-4][.)．、]?\s*/u, '')
    .replace(/\s+/gu, '')

const master = JSON.parse(fs.readFileSync(masterPath, 'utf8'))
const exam = master.find((entry) => entry.id === examId)
if (!exam) throw new Error('Missing exam ' + examId + '.')
const questions = exam.parts.filter((part) => part.title.includes('Từ vựng')).flatMap((part) => part.questions || [])
if (questions.length !== 35) throw new Error('Expected 35 vocabulary questions.')

for (const row of corrections) {
  const question = questions.find((entry) => Number(entry.number) === row.number)
  if (!question) throw new Error('Missing question ' + row.number + '.')
  if (Number(question.correctAnswer ?? question.answer) !== row.answer) {
    throw new Error('Answer key changed for question ' + row.number + '.')
  }
  const actual = question.options.map(normalizeOption)
  if (
    JSON.stringify(actual) !== JSON.stringify(row.before.map(normalizeOption)) &&
    JSON.stringify(actual) !== JSON.stringify(row.after.map(normalizeOption))
  ) {
    throw new Error('Unexpected source options for question ' + row.number + '; review manually before applying.')
  }
  question.options = row.after
}

if (apply) fs.writeFileSync(masterPath, await formatJson(masterPath, master))
console.log(
  JSON.stringify(
    {
      mode: apply ? 'applied' : 'dry-run',
      examId,
      corrections: corrections.map((row) => row.number),
      answerKeysChanged: 0,
    },
    null,
    2
  )
)
