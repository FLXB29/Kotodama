import fs from 'node:fs'

const mainPath = 'data/jlpt_n3_toan_master.json'
const sectionPath = 'data/jlpt_full_master.json'
const curatedPath = 'data/jlpt_n3_explanations_curated.json'
const reportPath = 'reports/n3-quality-audit/vocabulary-2022-07-m5-review.json'

const readJson = (path) => JSON.parse(fs.readFileSync(path, 'utf8'))
const mainExams = readJson(mainPath)
const sectionExams = readJson(sectionPath)
const curated = readJson(curatedPath)

const expectedAnswers = { 30: 2, 31: 3, 32: 4, 33: 1, 34: 1 }
const findQuestion = (exam, number) => exam.parts.flatMap((part) => part.questions || []).find((question) => Number(question.number) === number)
const mainExam = mainExams.find(({ id }) => id === 'toan-n3-202207-full')
const sectionExam = sectionExams.find(({ id }) => id === 'cm2u2xt6n016j134inupqhmlp-vocab')
if (!mainExam || !sectionExam) throw new Error('Missing July 2022 N3 mock exam or standalone vocabulary section')

const sourceDiffs = []
for (const [numberText, expectedAnswer] of Object.entries(expectedAnswers)) {
  const number = Number(numberText)
  const mainQuestion = findQuestion(mainExam, number)
  const sectionQuestion = findQuestion(sectionExam, number)
  if (!mainQuestion || !sectionQuestion) throw new Error(`Missing M5 question ${number}`)
  if (Number(mainQuestion.correctAnswer ?? mainQuestion.answer) !== expectedAnswer) throw new Error(`Unexpected mock key for question ${number}`)
  if (String(sectionQuestion.answer ?? sectionQuestion.correctAnswer) !== String(expectedAnswer)) throw new Error(`Unexpected standalone key for question ${number}`)
  if (mainQuestion.options.length !== 4 || sectionQuestion.options.length !== 4) throw new Error(`Question ${number} must have four choices in both records`)

  const sourceOptions = mainQuestion.options.map((option) => String(typeof option === 'object' ? option.text : option))
  const oldSectionOptions = sectionQuestion.options.map((option) => String(typeof option === 'object' ? option.text : option))
  sectionQuestion.options = sourceOptions.map((text, index) => ({
    ...(typeof sectionQuestion.options[index] === 'object' ? sectionQuestion.options[index] : { id: String(index + 1) }),
    text: text.replace(/^\s*[1-4][.)．、\s　]*/u, ''),
  }))

  let explanation = mainQuestion.explanation
  if (!explanation) throw new Error(`Missing mock explanation for question ${number}`)
  explanation = explanation.replace(/^Đáp án ([1-4])/u, 'Đáp án tham khảo $1')
  if (number === 30) {
    explanation = explanation.replace(
      'Không ngừng khóc là 泣くのをやめられなかった・泣かずにはいられなかった.',
      'Ở đây, 泣くのを諦められなかった có thể hiểu theo nghĩa đen là “không thể từ bỏ việc khóc”, nhưng với nước mắt tự nhiên khi đọc truyện buồn, cách nói thường dùng là 泣くのをやめられなかった・涙を止められなかった. Vì vậy câu này không phải lựa chọn phù hợp nhất với nghĩa “từ bỏ kế hoạch/điều mong muốn”; đây là khác biệt về cách kết hợp và ngữ cảnh, không phải khẳng định câu bất khả về ngữ pháp.',
    )
  }
  mainQuestion.explanation = explanation
  sectionQuestion.explanation = explanation
  curated[mainQuestion.id] = explanation

  const normalize = (value) => String(value).normalize('NFKC').replace(/^\s*[1-4][.)．、\s　]*/u, '').replace(/[\s　]/gu, '')
  sourceDiffs.push({
    number,
    questionIds: { mock: mainQuestion.id, section: sectionQuestion.id },
    key: expectedAnswer,
    priorOptionTextDifferences: sourceOptions.map((text, index) => normalize(oldSectionOptions[index]) !== normalize(text)),
  })
}

const report = {
  exam: 'JLPT N3 2022/07 — vocabulary Mondai 5, questions 30–34',
  reviewDate: '2026-09-27',
  answerKeysChanged: 0,
  answers: expectedAnswers,
  rationale: 'The five choices were cross-checked against the Kosei-hosted exam PDF and the existing mock, and keys 2–3–4–1–1 match a public third-party answer sheet. The standalone record had no explanations and had meaningful OCR/transcription changes in q30, including 鍵 (key) incorrectly copied as 眼鏡 (glasses) and omission of に in ことにした. The explanation for q30 option 4 now distinguishes contextual/collocational fit from absolute grammatical impossibility.',
  sourceDiffs,
  sources: [
    { type: 'exam-pdf', url: 'https://www.tiengnhatdongian.com/wp-content/uploads/2023/04/N3-T7-2022-Final-Version.pdf', note: 'Kosei-hosted exam transcription, pages 1–2, M5 questions 30–34. The extracted PDF text is OCR; obvious OCR noise was checked against the mock and a second transcription.' },
    { type: 'exam-transcription-cross-check', url: 'https://trynihongo.com/ja/de-thi-jlpt-tu-vung-n3-thang-7-nam-2022-q1308', note: 'Independent question transcription; it has OCR/copy errors in q30 and q32, so the garbled variants were not used.' },
    { type: 'answer-key', url: 'https://hikariacademy.edu.vn/hot-tong-hop-dap-an-jlpt-cac-trinh-do-ky-thi-thang-7-2022.html', note: 'Public answer reference, N3 vocabulary 問題5 row 2–3–4–1–1. This is not an official JLPT key.' },
    { type: 'answer-key-cross-check', url: 'https://jpnihon.com/5112.html', note: 'Public answer/explanation reference independently confirms the usage items for 参加, 盛ん, 整理 and 通り過ぎる (q31–34); third-party source, not official.' },
    { type: 'dictionary', url: 'https://kotobank.jp/word/%E5%8F%82%E5%8A%A0-70342', note: 'Digital Daijisen: joining a gathering for a shared purpose and acting as a member.' },
    { type: 'dictionary', url: 'https://kotobank.jp/word/%E7%9B%9B%E3%82%93-509261', note: 'Digital Daijisen entry for 盛ん, including vigorous activity and flourishing.' },
    { type: 'dictionary', url: 'https://kotobank.jp/word/%E6%95%B4%E7%90%86-546621', note: 'Digital Daijisen: put disordered things in order and dispose of unnecessary things.' },
    { type: 'dictionary', url: 'https://kotobank.jp/word/%E9%80%9A%E3%82%8A%E8%B6%8A%E3%81%99-582009', note: 'Digital Daijisen entry for 通り越す, defining movement past a point; used as a supporting distinction for the location-based 通り過ぎる item.' },
  ],
}

fs.writeFileSync(mainPath, `${JSON.stringify(mainExams, null, 2)}\n`, 'utf8')
fs.writeFileSync(sectionPath, `${JSON.stringify(sectionExams, null, 2)}\n`, 'utf8')
fs.writeFileSync(curatedPath, `${JSON.stringify(curated, null, 2)}\n`, 'utf8')
fs.writeFileSync(reportPath, `${JSON.stringify(report, null, 2)}\n`, 'utf8')
console.log(`Aligned and reviewed ${sourceDiffs.length} questions; answer keys changed: ${report.answerKeysChanged}.`)
