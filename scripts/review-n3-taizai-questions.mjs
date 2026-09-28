import assert from 'node:assert/strict'
import fs from 'node:fs'

const fullPath = 'data/jlpt_n3_toan_master.json'
const sectionPath = 'data/jlpt_full_master.json'
const reportPath = 'reports/n3-quality-audit/vocabulary-taizai-2017-07-2020-12-review.json'
const reviews = [
  {
    exam: '2017-07',
    fullExamId: 'toan-n3-201707-full',
    sectionExamId: 'cm2u2wq1c00ck134imolbo8ac-vocab',
    number: 33,
    answer: 2,
    explanation: `Đáp án theo khóa tham khảo: 2. 滞在（たいざい）する là đi đến một nơi khác rồi ở lại đó trong một khoảng thời gian. Từ điển nêu ví dụ điển hình 「ホテルに滞在する」. Hai lựa chọn 2 và 4 đều có thể hiểu về mặt ngữ pháp; câu 2 là cách kết hợp quen thuộc nhất trong dạng bài này.
1. 「あの湖には珍しい鳥が滞在しているらしい」 — Dịch: “Nghe nói ở hồ kia có loài chim quý hiếm đang lưu lại.” Với ý nói nơi sống của loài chim, 「生息している」 tự nhiên hơn 「滞在している」.
2. 「このホテルには、以前、有名な作家が滞在していたそうだ」 — Dịch: “Nghe nói trước đây một nhà văn nổi tiếng từng lưu trú tại khách sạn này.” Người đi đến khách sạn và ở đó một khoảng thời gian là cách dùng điển hình của 「滞在する」.
3. 「バス停にバスが滞在していた」 — Dịch: “Xe buýt đang dừng ở bến nên tôi vội đi về phía bến.” Với xe đang dừng tại bến, dùng 「停車していた」; 「滞在」 thường nói về người lưu trú ở một địa điểm.
4. 「雨がやむまで、喫茶店に滞在することにした」 — Dịch: “Tôi quyết định ở lại quán cà phê đến khi mưa tạnh.” Câu này không vô nghĩa hay sai ngữ pháp: một người có thể ở quán trong khoảng thời gian chờ. Tuy vậy, với ý trú/chờ mưa, 「喫茶店で雨宿りする」 hoặc 「喫茶店で待つ」 tự nhiên hơn. Vì thế 2 là phương án được khóa tham khảo chọn, nhưng không nên học rằng 「滞在」 bắt buộc phải chỉ một kỳ ở dài.
Ghi nhớ: 「滞在」 = đến một nơi rồi ở lại trong một khoảng thời gian; nơi sống của động vật là 「生息地」/「生息する」; xe dừng là 「停車する」.`,
  },
  {
    exam: '2020-12',
    fullExamId: 'toan-n3-202012-full',
    sectionExamId: 'cm2u2xg4300wm134izpbjrysi-vocab',
    number: 35,
    answer: 4,
    explanation: `Đáp án theo hai bảng khóa tham khảo: 4. 滞在（たいざい）する là đi đến một nơi khác rồi ở lại đó trong một khoảng thời gian; từ này không có quy tắc cứng rằng thời gian phải “dài”, nhưng thường gắn với một chuyến đi hoặc nơi lưu trú. 「あしたから一週間、仕事で東京に滞在します」 là cách dùng rất điển hình.
1. 「特急電車は、出発の10分前からホームに滞在している」 — Dịch: “Tàu tốc hành đang lưu trú ở sân ga từ 10 phút trước giờ khởi hành.” Với tàu dừng ở sân ga, nói 「ホームに停車している」.
2. 「少し疲れたので、しばらく喫茶店に滞在しませんか」 — Dịch: “Mình hơi mệt, ở quán cà phê một lúc nhé?” Câu có thể hiểu được; trong lời rủ nghỉ ngắn, 「喫茶店で少し休みませんか」 tự nhiên hơn. Đây là phương án gần nghĩa nhưng kém điển hình hơn câu 4.
3. 「わたしの車は、来週まで修理のため工場に滞在しています」 — Dịch: “Xe tôi đang ở xưởng để sửa đến tuần sau.” Ý định hiểu được, nhưng câu đặt chiếc xe làm chủ thể của 「滞在する」 nghe kém tự nhiên; thường nói 「工場に預けてある」 hoặc 「工場で修理中だ」.
4. 「あしたから一週間、仕事で東京に滞在します」 — Dịch: “Từ ngày mai, tôi sẽ ở Tokyo một tuần vì công việc.” Người nói ở lại thành phố trong chuyến công tác là cách dùng chuẩn và tự nhiên nhất trong bốn câu.
Ghi nhớ: 「滞在」 nói về việc ở lại một nơi trong một khoảng thời gian; tàu dừng là 「停車」; nghỉ ở quán thường nói 「休む」; gửi xe đi sửa là 「預ける」.`,
  },
]

const readText = (path) => fs.readFileSync(path, 'utf8')
const cleanOption = (option) => {
  const value = typeof option === 'object' && option ? option.text : option
  return String(value).normalize('NFKC').replace(/^\s*[1-4][.)．、\s　]*/u, '').replace(/[。.]$/u, '').trim()
}
const parseWithEol = (path) => {
  const text = readText(path)
  return { value: JSON.parse(text), eol: text.includes('\r\n') ? '\r\n' : '\n' }
}
const full = parseWithEol(fullPath)
const section = parseWithEol(sectionPath)
const flat = (exam) => exam.parts.flatMap((part) => part.questions || [])
const findQuestion = (exams, examId, number) => {
  const exam = exams.find(({ id }) => id === examId)
  assert.ok(exam, `Missing exam ${examId}`)
  const question = flat(exam).find((row) => Number(row.number) === number)
  assert.ok(question, `Missing question ${number} in ${examId}`)
  return question
}

for (const review of reviews) {
  const fullQuestion = findQuestion(full.value, review.fullExamId, review.number)
  const sectionQuestion = findQuestion(section.value, review.sectionExamId, review.number)
  assert.equal(Number(fullQuestion.correctAnswer ?? fullQuestion.answer), review.answer)
  assert.equal(Number(sectionQuestion.correctAnswer ?? sectionQuestion.answer), review.answer)
  assert.deepEqual(sectionQuestion.options.map(cleanOption), fullQuestion.options.map(cleanOption), `Option mismatch in ${review.exam} question ${review.number}`)
  fullQuestion.explanation = review.explanation
  sectionQuestion.explanation = review.explanation
  review.fullQuestionId = fullQuestion.id
  review.sectionQuestionId = sectionQuestion.id
}

fs.writeFileSync(fullPath, `${JSON.stringify(full.value, null, 2)}\n`.replace(/\n/gu, full.eol), 'utf8')
fs.writeFileSync(sectionPath, `${JSON.stringify(section.value, null, 2)}\n`.replace(/\n/gu, section.eol), 'utf8')

const report = {
  reviewedOn: '2026-09-27',
  scope: 'Revised two high-risk M5 explanations for 滞在, preserving stored answer keys while separating dictionary meaning, prototypical collocations, and merely less-idiomatic alternatives.',
  answerKeysChanged: 0,
  rows: reviews.map(({ explanation, ...row }) => ({ ...row, explanation })),
  findings: [
    'For 2017-07 question 33, the published secondary key selects 2. Option 4 is understandable and grammatically possible for waiting out rain at a cafe; the explanation marks 2 as the key-intended, more prototypical use rather than declaring 4 impossible.',
    'For 2020-12 question 35, two secondary answer compilations select 4. A public learner comment questions whether option 3 could fit; the explanation now discusses both 2 and 3 as understandable but less idiomatic, with no unsupported long-stay rule.',
    'The dictionary definition says to go elsewhere and remain there for a period and illustrates the typical collocation ホテルに滞在する. It does not specify a minimum duration.',
  ],
  sources: [
    {
      url: 'https://kotobank.jp/word/%E6%BB%9E%E5%9C%A8-557045',
      notes: 'Digital Daijisen defines 滞在 as going elsewhere and staying there for a period, with ホテルに滞在する as an example; not an exam answer key.',
    },
    {
      url: 'https://chuyenngoaingu.com/news/dap-an-ky-thi-nang-luc-nhat-ngu-jlpt-thang-7-2017-1211.aspx',
      notes: 'Published secondary answer table gives 2017-07 vocabulary question 33 as 2; not an official JLPT key.',
    },
    {
      url: 'https://chuyenngoaingu.com/news/de-thi-va-dap-an-jlpt-ky-thi-thang-12-2020-nang-luc-tieng-nhat-5276.aspx',
      notes: 'Published secondary answer table gives 2020-12 vocabulary question 35 as 4; not an official JLPT key.',
    },
    {
      url: 'https://www.jpedo.com/news/1572.html',
      notes: 'Independent published secondary answer sequence also gives 2020-12 vocabulary question 35 as 4; not an official JLPT key.',
    },
    {
      url: 'https://www.dethitiengnhat.com/jlpt/N3/202012/2',
      notes: 'A learner comment questions whether question 35 option 3 could be more appropriate. Treated as a signal to explain nuance, not as authoritative evidence of the answer.',
    },
  ],
}
fs.mkdirSync('reports/n3-quality-audit', { recursive: true })
fs.writeFileSync(reportPath, `${JSON.stringify(report, null, 2)}\n`, 'utf8')
console.log(`Reviewed ${reviews.length} 滞在 usage questions; answer keys unchanged.`)
