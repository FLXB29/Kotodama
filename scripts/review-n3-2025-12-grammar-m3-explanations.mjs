import fs from 'node:fs'
import path from 'node:path'

const root = path.resolve('.')
const masterPath = path.join(root, 'data/jlpt_n3_toan_master.json')
const curatedPath = path.join(root, 'data/jlpt_n3_explanations_curated.json')
const reportPath = path.join(root, 'reports/n3-quality-audit/grammar-m3-2025-12-review.json')
const examId = 'toan-n3-202512-full'
const partId = 'toan_part_2025_12_m2_g3'
const sourceInstruction =
  '問題3　つぎの文章を読んで、文章全体の内容を考えて、19から22の中に入る最もよいものを、1・2・3・4から一つえらびなさい。'
const sourcePassage = `<p>以下は、留学生の作文である。コンビニ ウイルソン リサ
私は日本のコンビニが好きです。家の近くや大学の近くにいろいろなコンビニがあるのですが、24時間営業なので、とても便利です。
日本に来たばかりのころ、コンビニに行くとき、コンビニの会社の違いはあまり気にしていませんでした。会社が違っても、売っている商品は同じだと（19）。売っている商品が会社によって少し違うことに気がついたのは、日本に来て1か月ぐらいたったころでした。飲み物、食べ物、生活用品、雑誌などが売られているのは同じです。（20）、それぞれの会社のコンビニには、ほかの会社のコンビニにはないデザートやパンや弁当などがあるのです。会社ごとにおいしいデザートやパンや弁当を考えて、自分たちだけの新しい商品を作っているようです。いつ行っても店には新しい商品がたくさん並んでいます。見ているだけでも楽しいし、（21）会社もいい商品を売ろうとがんばっているようで、応援したくなります。
私にとってコンビニは買い物をするだけの場所ではありません。食べてみたい商品や新商品がたくさん並んでいて、行くと楽しい気分になれる（22）。</p>`

const explanations = {
  toan_q_2025_12_54: `Đáp án 3 — 「思っていたからです」.

Câu hoàn chỉnh: 「会社が違っても、売っている商品は同じだと思っていたからです。」「～と思っていた」 diễn tả điều người viết đã nghĩ trong quá khứ; 「からです」 nêu lý do. Câu trước nói lúc mới sang Nhật người viết chưa để ý sự khác nhau giữa các chuỗi cửa hàng, nên đây là nguyên nhân phù hợp.

Dịch: “Vì tôi đã nghĩ rằng dù công ty khác nhau thì những món hàng được bán cũng giống nhau.”

1. 思います — “nghĩ rằng”. 「同じだと思います」 là nhận định hiện tại, không giải thích việc trước đây người viết đã không để ý.
2. 思ってしまいます — “lỡ/cứ nghĩ rằng”. Cách này nói cảm giác hoặc kết quả ngoài ý muốn ở hiện tại, không tạo lý do ở quá khứ như đoạn văn cần.
3. 思っていたからです — “vì đã nghĩ rằng”. Vừa khớp mốc quá khứ, vừa nối nguyên nhân bằng 「からです」.
4. 思ったことです — “điều tôi đã nghĩ”. Dạng này danh từ hóa nội dung đã nghĩ; đặt sau 「同じだと」 không nêu được nguyên nhân cho câu trước.

Ghi nhớ: đọc mốc thời gian và quan hệ câu. Ở đây cần một niềm tin trong quá khứ làm nguyên nhân, nên 「～と思っていたからです」 phù hợp nhất.`,
  toan_q_2025_12_55: `Đáp án 4 — 「でも」.

Câu chứa chỗ trống: 「飲み物、食べ物、生活用品、雑誌などが売られているのは同じです。でも、それぞれの会社のコンビニには、ほかの会社のコンビニにはないデザートやパンや弁当などがあるのです。」

Dịch: “Các cửa hàng đều bán những nhóm hàng như đồ uống, thức ăn, đồ dùng sinh hoạt và tạp chí. Nhưng mỗi chuỗi cửa hàng lại có những món tráng miệng, bánh mì và cơm hộp mà các chuỗi khác không có.”

1. つまり — “nói cách khác”. Dùng để diễn đạt lại hoặc tóm tắt ý vừa nêu; câu tiếp theo bổ sung một điểm đối lập, không phải lời diễn đạt lại.
2. ところで — “nhân tiện/chuyển sang chuyện khác”. Dùng để đổi chủ đề, trong khi đoạn vẫn đang so sánh các chuỗi cửa hàng.
3. ちなみに — “nhân tiện/nói thêm”. Dùng cho thông tin bổ sung bên lề; không thể hiện rõ sự tương phản giữa nhóm hàng giống nhau và món riêng của từng chuỗi.
4. でも — “nhưng/tuy vậy”. Là liên từ đầu câu thể hiện tương phản, đúng với hai ý trước và sau.

Lưu ý: 「でも」 ở đây là liên từ “nhưng”, không phải trợ từ 「Nでも」 mang nghĩa “ngay cả N”. Tra khớp mặt chữ với mục 「〜でも」 trong kho ngữ pháp sẽ gán sai nghĩa nếu bỏ qua ngữ cảnh.

Ghi nhớ: 「でも」 đầu câu có thể nối hai vế tương phản, tương tự “nhưng/tuy vậy” trong tiếng Việt.`,
  toan_q_2025_12_56: `Đáp án 1 — 「どの」.

Câu hoàn chỉnh: 「見ているだけでも楽しいし、どの会社もいい商品を売ろうとがんばっているようで、応援したくなります。」Mẫu 「どのNも」 có nghĩa “N nào cũng/mọi N đều”; ở đây nói về tất cả các chuỗi cửa hàng.

Dịch: “Chỉ ngắm thôi cũng vui, hơn nữa có vẻ công ty nào cũng cố gắng bán sản phẩm tốt nên tôi muốn ủng hộ họ.”

1. どの — “nào/mỗi (trong số nào)”; kết hợp với 「も」 thành “công ty nào cũng”, phù hợp với nhận xét khái quát.
2. その — “công ty đó”; chỉ một công ty đã được nhắc đến, không có nghĩa “tất cả các công ty”.
3. この — “công ty này”; trỏ tới một công ty gần người nói, quá cụ thể so với ý khái quát.
4. あの — “công ty kia”; trỏ tới một công ty ở xa hoặc đã biết, cũng không diễn đạt phạm vi “mọi công ty”.

Ghi nhớ: 「どの + danh từ + も」 diễn đạt phạm vi bao quát: “danh từ nào cũng”.`,
  toan_q_2025_12_57: `Đáp án 2 — 「場所なのです」.

Câu hoàn chỉnh: 「私にとってコンビニは買い物をするだけの場所ではありません。食べてみたい商品や新商品がたくさん並んでいて、行くと楽しい気分になれる場所なのです。」Cụm 「楽しい気分になれる」 bổ nghĩa cho 「場所」; 「なのです」 giải thích và kết luận nơi cửa hàng tiện lợi có ý nghĩa gì với người viết.

Dịch: “Đối với tôi, cửa hàng tiện lợi không chỉ là nơi để mua sắm. Đó còn là nơi bày bán nhiều món tôi muốn thử và sản phẩm mới, khiến tôi cảm thấy vui khi ghé đến.”

1. 場所にしたのです — “đã biến/chọn thành một nơi”. 「Nにする」 diễn tả ai đó chủ động chọn hoặc biến đổi thành N; đoạn văn đang mô tả cảm nhận của người viết, không kể việc người viết tạo ra cửa hàng.
2. 場所なのです — “chính là một nơi như vậy”. Hoàn chỉnh phần kết luận và khẳng định cảm nhận đã nêu.
3. 場所にするのでしょう — “có lẽ sẽ biến/chọn thành một nơi”. 「にする」 nói về hành động chọn/biến đổi, còn 「のでしょう」 mang sắc thái phỏng đoán; cả hai đều lệch với lời kết luận chắc chắn của người viết.
4. 場所なのでしょうか — “liệu có phải là một nơi như vậy không?”. Đây là câu hỏi/phỏng đoán, không hợp với lời khẳng định về cảm nhận của chính người viết.

Ghi nhớ: đọc vị ngữ ngay trước chỗ trống và giọng điệu toàn đoạn. Bài kết bằng nhận xét của người viết nên dùng 「場所なのです」; lựa chọn không có đại từ 「その」.`,
}

const expected = new Map([
  [
    'toan_q_2025_12_54',
    { answer: 3, options: ['思います', '思ってしまいます', '思っていたからです', '思ったことです'] },
  ],
  ['toan_q_2025_12_55', { answer: 4, options: ['つまり', 'ところで', 'ちなみに', 'でも'] }],
  ['toan_q_2025_12_56', { answer: 1, options: ['どの', 'その', 'この', 'あの'] }],
  [
    'toan_q_2025_12_57',
    { answer: 2, options: ['場所にしたのです', '場所なのです', '場所にするのでしょう', '場所なのでしょうか'] },
  ],
])

const master = JSON.parse(fs.readFileSync(masterPath, 'utf8'))
const curated = JSON.parse(fs.readFileSync(curatedPath, 'utf8'))
const exam = master.find((entry) => entry.id === examId)
const part = exam?.parts?.find((entry) => entry.id === partId)
if (!part) throw new Error(`Missing exam part ${partId}`)

const previousPassage = String(part.passage || '')
if (previousPassage !== sourcePassage && !previousPassage.includes('弁当のです')) {
  throw new Error('Unexpected passage; review its current source text before replacing it')
}
const previousInstruction = String(part.instruction || '')
if (previousInstruction !== sourceInstruction && !/29[\s）)]*から[\s（(]*33/u.test(previousInstruction)) {
  throw new Error('Unexpected instruction; review its current source text before replacing it')
}
part.instruction = sourceInstruction
part.passage = sourcePassage
if (part.metadata) part.metadata.passage = sourcePassage

for (const [questionId, target] of expected) {
  const question = part.questions.find((entry) => entry.id === questionId)
  if (!question) throw new Error(`Missing question ${questionId}`)
  const options = question.options.map((option) =>
    String(option)
      .replace(/^\s*[1-4][.．、\s　]*/u, '')
      .trim()
  )
  if (question.correctAnswer !== target.answer || options.some((option, index) => option !== target.options[index])) {
    throw new Error(`Question key/options changed unexpectedly for ${questionId}`)
  }
  question.explanation = explanations[questionId]
  curated[questionId] = explanations[questionId]
}

fs.writeFileSync(masterPath, `${JSON.stringify(master, null, 2)}\n`, 'utf8')
fs.writeFileSync(curatedPath, `${JSON.stringify(curated, null, 2)}\n`, 'utf8')
fs.mkdirSync(path.dirname(reportPath), { recursive: true })
fs.writeFileSync(
  reportPath,
  `${JSON.stringify(
    {
      exam: 'JLPT N3 12/2025',
      partId,
      questions: [...expected].map(([questionId, target]) => ({
        questionId,
        answer: target.answer,
        options: target.options,
        explanation: explanations[questionId],
      })),
      sourceInstructionCorrection: {
        source: 'Google Drive PDF: 17.N3 12-2025 (260506).pdf',
        pdfPage: 10,
        visualCrossCheck: true,
        correctedInstruction: sourceInstruction,
        priorStoredInstruction: previousInstruction,
        note: 'The stored instruction incorrectly referred to blanks 29–33; the source page labels this passage blanks 19–22.',
      },
      sourcePassageCorrection: {
        source: 'Google Drive PDF: 17.N3 12-2025 (260506).pdf',
        pdfPage: 10,
        visualCrossCheck: true,
        correctedPhrase: 'ほかの会社のコンビニにはないデザートやパンや弁当などがあるのです。',
        priorStoredPhrase: 'ほかの会社のコンビニはないデザートやパンや弁当のです。',
        note: 'Transcribed from the visible PDF page; the stored passage had lost 「には」 and 「などがある」.',
      },
      answerKeyCrossCheck: {
        source: 'Google Drive PDF: ĐÁP ÁN JLPT N3 (update 26.6.2026).pdf',
        pdfPage: 31,
        answers: { 19: 3, 20: 4, 21: 1, 22: 2 },
        result: 'Matches the stored answer fields and the contextual reading of the passage.',
        limitation: 'This is a third-party answer compilation, not an official JLPT answer key.',
      },
      grammarPatternException: {
        questionId: 'toan_q_2025_12_55',
        surfaceMatch: 'でも',
        rejectedDictionaryMatch: '〜でも: “even/as much as”, pattern N + でも',
        contextualUse: 'Sentence-initial conjunction meaning “but/however”.',
        reason:
          'A terminal surface match alone confuses two different uses; no automatic pattern label is shown in this explanation.',
      },
      browserVerification: {
        browser: 'Chrome',
        sourceExamPdfPage: 10,
        sourceAnswerPdfPage: 31,
        result: 'Visually inspected the original exam passage and the answer table; the four stored keys agree.',
      },
      passage: sourcePassage,
    },
    null,
    2
  )}\n`,
  'utf8'
)

console.log(
  `Reviewed four 12/2025 grammar cloze questions; source and review record: ${path.relative(root, reportPath)}`
)
