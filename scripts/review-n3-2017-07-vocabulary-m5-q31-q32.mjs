import assert from 'node:assert/strict'
import fs from 'node:fs'

const mockPath = 'data/jlpt_n3_toan_master.json'
const sectionPath = 'data/jlpt_full_master.json'
const curatedPath = 'data/jlpt_n3_explanations_curated.json'
const reportPath = 'reports/n3-quality-audit/vocabulary-2017-07-m5-q31-q32-review.json'
const mocks = JSON.parse(fs.readFileSync(mockPath, 'utf8'))
const sections = JSON.parse(fs.readFileSync(sectionPath, 'utf8'))
const curated = JSON.parse(fs.readFileSync(curatedPath, 'utf8'))
const mockExam = mocks.find(({ id }) => id === 'toan-n3-201707-full')
const sectionExam = sections.find(({ id }) => id === 'cm2u2wq1c00ck134imolbo8ac-vocab')
assert.ok(mockExam && sectionExam, 'Both July 2017 N3 records must exist.')

const findQuestion = (exam, number) =>
  exam.parts.flatMap((part) => part.questions || []).find((question) => Number(question.number) === number)
const mockQuestions = new Map([31, 32].map((number) => [number, findQuestion(mockExam, number)]))
const sectionQuestions = new Map([31, 32].map((number) => [number, findQuestion(sectionExam, number)]))
for (const number of [31, 32]) {
  assert.ok(mockQuestions.get(number) && sectionQuestions.get(number), 'Question ' + number + ' must exist in both records.')
}

const explanations = {
  31: [
    'Đáp án theo bảng khóa tham khảo: 3. 「分類（ぶんるい）」 là phân loại các vật/người thành nhóm theo đặc điểm hoặc tiêu chí chung.',
    'Dịch cả câu đúng: “Sách trong thư viện được phân loại theo nội dung và đánh số.”',
    '1. 「日本は、春、夏、秋、冬に季節が分類されている」 — Dịch: “Ở Nhật, các mùa được phân loại thành xuân, hạ, thu, đông.” Ý này hiểu được, nhưng cách đặt 「日本は」 và kết hợp 「季節が分類されている」 kém tự nhiên; thường nói 「日本では季節が春夏秋冬に分かれている」. Trong bốn câu, câu 3 là cách dùng rõ và điển hình nhất của 分類.',
    '2. 「品物の代金を3回に分類して払うことにした」 — Dịch: “Tôi quyết định phân loại tiền hàng để trả thành ba lần.” Muốn nói chia khoản thanh toán thành ba đợt thì dùng 「3回に分けて払う」; 「分類」 nói về xếp đối tượng vào các nhóm, không phải chia một khoản tiền thành kỳ trả.',
    '3. 「図書館の本は、内容によって分類され、番号が付けられている」 — Dịch: “Sách trong thư viện được phân loại theo nội dung và được đánh số.” Sách được xếp thành nhóm theo tiêu chí nội dung nên 「内容によって分類される」 dùng đúng, tự nhiên.',
    '4. 「ここの道路は、歩道と車道が分類されている」 — Dịch: “Ở đây, đường được phân loại thành vỉa hè và phần đường xe chạy.” Với các phần cấu tạo của một con đường, tự nhiên hơn là 「歩道と車道に分かれている」; dùng 分類 ở đây gượng hơn cách phân loại sách theo tiêu chí.',
    'Ghi nhớ: 「分類する」 = phân loại theo tiêu chí (本を内容で分類する); 「分ける」 = chia/tách thành phần hoặc đợt (料金を3回に分ける). Lựa chọn 1 có thể suy ra ý định, nhưng không tự nhiên bằng câu 3.'
  ].join(String.fromCharCode(10)),
  32: [
    'Đáp án theo bảng khóa tham khảo: 4. 「引き受ける（ひきうける）」 là đồng ý nhận và đảm trách một công việc, yêu cầu hoặc trách nhiệm.',
    'Dịch cả câu đúng: “Tôi quyết định nhận công việc mà đàn anh/đàn chị nhờ.”',
    '1. 「友人からのアドバイスを引き受けて、考えを変えた」 — Dịch: “Tôi nhận lời khuyên của bạn rồi đổi suy nghĩ.” Với lời khuyên, nói 「アドバイスを受け入れる」 hoặc 「聞き入れる」; 「引き受ける」 thường nhận một việc/yêu cầu cần đứng ra đảm trách.',
    '2. 「この店の料理は、いろいろな国の料理の特徴を引き受けている」 — Dịch: “Món ăn của cửa hàng này nhận đảm trách những đặc trưng của món ăn nhiều nước.” Khi món ăn kết hợp đặc trưng từ nhiều nền ẩm thực, dùng 「特徴を取り入れている」; 引き受ける không có nghĩa là hấp thụ đặc điểm.',
    '3. 「弟の風邪を引き受けたようで、わたしも熱が出てきた」 — Dịch: “Có vẻ tôi đã nhận lấy cảm lạnh của em trai nên mình cũng bắt đầu sốt.” Nói bị lây cảm là 「弟の風邪がうつった」／「風邪をうつされた」; 引き受ける không diễn tả lây bệnh.',
    '4. 「先輩から頼まれた仕事を引き受けることにした」 — Dịch: “Tôi quyết định nhận công việc mà đàn anh/đàn chị nhờ.” 「仕事を引き受ける」 là kết hợp tự nhiên, đúng nghĩa nhận trách nhiệm làm việc đó.',
    'Ghi nhớ: nhận việc/đề nghị là 「仕事・依頼を引き受ける」; chấp nhận lời khuyên là 「アドバイスを受け入れる」; tiếp thu đặc điểm là 「特徴を取り入れる」; bị lây cảm là 「風邪がうつる」.'
  ].join(String.fromCharCode(10))
}

const replaceOption = (question, id, expected, next) => {
  const option = question.options.find((item) => Number(item.id) === id)
  assert.ok(option, 'Question ' + question.number + ' option ' + id + ' must exist.')
  if (option.text !== next) {
    assert.equal(option.text, expected, 'Unexpected source transcription at question ' + question.number + ', option ' + id + '.')
    option.text = next
  }
}

assert.equal(Number(mockQuestions.get(31).correctAnswer ?? mockQuestions.get(31).answer), 3)
assert.equal(Number(sectionQuestions.get(31).correctAnswer ?? sectionQuestions.get(31).answer), 3)
assert.equal(Number(mockQuestions.get(32).correctAnswer ?? mockQuestions.get(32).answer), 4)
assert.equal(Number(sectionQuestions.get(32).correctAnswer ?? sectionQuestions.get(32).answer), 4)

replaceOption(sectionQuestions.get(32), 1, '友達からのアドバイスを引き受けて、考えを変えた。', '友人からのアドバイスを引き受けて、考えを変えた。')
replaceOption(sectionQuestions.get(32), 2, 'この店/uの料理は、いろいろな国の料理の特徴を引き受けている。', 'この店の料理は、いろいろな国の料理の特徴を引き受けている。')
replaceOption(sectionQuestions.get(32), 4, '先程から頼まれた仕事を引き受けることにした。', '先輩から頼まれた仕事を引き受けることにした。')

for (const number of [31, 32]) {
  const mock = mockQuestions.get(number)
  const section = sectionQuestions.get(number)
  mock.explanation = explanations[number]
  section.explanation = explanations[number]
  curated[mock.id] = explanations[number]
}

const report = {
  title: 'Rà lời giải từ vựng M5 N3 07/2017 — câu 31–32',
  answerKeysChanged: 0,
  questions: [
    {
      number: 31,
      answer: 3,
      target: '分類（ぶんるい）',
      note: 'Lựa chọn 1 có thể suy ra ý định nhưng diễn đạt kém tự nhiên hơn; không mô tả là hoàn toàn vô nghĩa.',
      examSource: 'https://www.tiengnhatdongian.com/wp-content/uploads/2023/04/De-N3-7-2017.pdf'
    },
    {
      number: 32,
      answer: 4,
      target: '引き受ける（ひきうける）',
      optionCorrections: ['友達 → 友人', 'bỏ lỗi ký tự /u', '先程 → 先輩'],
      examSource: 'https://www.tiengnhatdongian.com/wp-content/uploads/2023/04/De-N3-7-2017.pdf'
    }
  ],
  answerKeySource: 'https://chuyenngoaingu.com/news/dap-an-ky-thi-nang-luc-nhat-ngu-jlpt-thang-7-2017-1211.aspx',
  method: 'Đối chiếu nguyên văn lựa chọn với PDF đề tham khảo và một bảng khóa thứ cấp; xác minh cách dùng theo cấu trúc tiếng Nhật. Không có khóa JLPT chính thức được xác nhận.'
}
fs.writeFileSync(mockPath, JSON.stringify(mocks, null, 2) + String.fromCharCode(10), 'utf8')
fs.writeFileSync(sectionPath, JSON.stringify(sections, null, 2) + String.fromCharCode(10), 'utf8')
fs.writeFileSync(curatedPath, JSON.stringify(curated, null, 2) + String.fromCharCode(10), 'utf8')
fs.writeFileSync(reportPath, JSON.stringify(report, null, 2) + String.fromCharCode(10), 'utf8')
console.log('Updated N3 07/2017 vocabulary M5 questions 31–32 in both records.')
