import assert from 'node:assert/strict'
import fs from 'node:fs'

const masterPath = 'data/jlpt_n3_toan_master.json'
const curatedPath = 'data/jlpt_n3_explanations_curated.json'
const reportPath = 'reports/n3-quality-audit/grammar-2019-07-review.json'
const exams = JSON.parse(fs.readFileSync(masterPath, 'utf8'))
const curated = JSON.parse(fs.readFileSync(curatedPath, 'utf8'))
const exam = exams.find((item) => item.id === 'toan-n3-201907-full')
assert.ok(exam, 'Missing JLPT N3 July 2019 full exam.')

const explanations = {
  toan_q_2019_07_49: `Đáp án ★: 1 「のため」. Ô ★ là mảnh thứ ba; thứ tự ghép là 2 → 4 → 1 → 3.
Câu hoàn chỉnh: 「X高校とY高校のバスケットボールの試合は10時開始の予定だったが、大雨による電車の遅れのため11時開始になった。」
Dịch: “Trận bóng rổ giữa trường X và trường Y dự kiến bắt đầu lúc 10 giờ, nhưng do tàu bị trễ vì mưa lớn nên giờ bắt đầu chuyển thành 11 giờ.”
1. のため: “do/vì”; đứng sau 「電車の遅れ」 để nêu nguyên nhân khiến trận đấu bắt đầu muộn. Đây là mảnh ở vị trí ★ thứ ba.
2. による: “do/bởi”; phải đứng ngay sau 「大雨」 để bổ nghĩa cho 「電車の遅れ」, nên thuộc vị trí đầu.
3. 11時開始: kết quả sau cụm chỉ nguyên nhân 「のため」, rồi nối với 「になった」; không thể đứng ở ô thứ ba.
4. 電車の遅れ: danh từ được 「大雨による」 bổ nghĩa và đứng trước 「のため」; không đứng sau 「のため」.
Ghi nhớ: 「NによるN」 = N do/bởi nguyên nhân nào; 「Nのため」 = vì/do N.`,
  toan_q_2019_07_50: `Đáp án ★: 3 「動物園は」. Ô ★ là mảnh thứ ba; thứ tự ghép là 1 → 4 → 3 → 2.
Câu hoàn chỉnh: 「昨日行った桜動物園には、500種類以上の動物がいた。あんなにいろいろな動物が見られる動物園はなかなかないだろう。」
Dịch: “Ở sở thú Sakura tôi đến hôm qua có hơn 500 loài động vật. Chắc hiếm có sở thú nào mà người ta có thể xem được nhiều loại động vật như thế.”
1. 動物が: nối sau 「いろいろな」 thành 「いろいろな動物が」, nêu động vật là đối tượng được nhìn thấy; đây là mảnh đầu.
2. なかなか: “khá/không dễ”; trong câu này đi với phủ định 「ない」 thành “khó mà có/hiếm có”, nên đứng cuối ngay trước 「ないだろう」.
3. 動物園は: chuyển sang nêu “sở thú như thế” làm chủ đề để kết luận 「なかなかないだろう」; đây là mảnh tại ★.
4. 見られる: “có thể xem/nhìn thấy”; theo sau 「動物が」 và đứng trước danh từ 「動物園」 mà mệnh đề này bổ nghĩa.
Ghi nhớ: trong mệnh đề bổ nghĩa danh từ, động từ đứng trước danh từ: 「動物が見られる動物園」.`,
  toan_q_2019_07_51: `Đáp án ★: 3 「知らせを聞いて」. Ô ★ là mảnh thứ ba; thứ tự ghép là 4 → 2 → 3 → 1.
Câu hoàn chỉnh: 「母は、姉が一番行きたがっていた大学に合格したという知らせを聞いて、今にも泣きそうな顔をしていた。」
Dịch: “Nghe tin chị gái đỗ vào trường đại học mà chị mong muốn nhất, mẹ có vẻ như sắp khóc đến nơi.”
1. 今にも: “sắp sửa”; bổ nghĩa trực tiếp cho 「泣きそう」 và đứng sau mệnh đề kể việc nghe tin.
2. 大学に合格したという: “rằng đã đỗ đại học”; bổ nghĩa cho danh từ 「知らせ」, nên phải đứng ngay trước danh từ này.
3. 知らせを聞いて: “nghe tin”; hoàn tất cụm 「知らせを聞いて」 rồi nối với phản ứng 「今にも泣きそう」. Đây là mảnh ở ô ★.
4. 一番行きたがっていた: “mong muốn theo học nhất”; bổ nghĩa cho 「大学」, nên phải đứng ngay trước 「大学に合格したという」.
Ghi nhớ: 「～という知らせ」 = tin rằng…; 「今にも～そう」 = trông như sắp sửa….`,
  toan_q_2019_07_52: `Đáp án ★: 2 「私の家に」. Ô ★ là mảnh thứ ba; thứ tự ghép là 1 → 3 → 2 → 4.
Câu hoàn chỉnh: 「20階建ての大きいマンションが隣に建ったことで私の家に日が当たらなくなって、昼でも部屋の中が暗い。」
Dịch: “Vì tòa chung cư lớn 20 tầng được xây bên cạnh nên ánh nắng không còn chiếu vào nhà tôi; bởi vậy trong phòng tối ngay cả ban ngày.”
1. 隣に: “ở bên cạnh”; chỉ nơi tòa chung cư được xây và đứng trước 「建ったことで」.
2. 私の家に: “vào nhà tôi”; 「に」 đánh dấu nơi ánh nắng chiếu tới trong cụm 「家に日が当たる」. Khi phủ định thành 「家に日が当たらなくなって」, đây là mảnh tại ★.
3. 建ったことで: “do đã được xây”; theo sau địa điểm 「隣に」, nêu nguyên nhân dẫn đến việc nhà không còn nắng.
4. 日が当たらなくなって: “ánh nắng không còn chiếu vào”; theo sau 「私の家に」 và nối nguyên nhân với kết quả căn phòng tối.
Ghi nhớ: 「場所に日が当たる」 = ánh nắng chiếu vào địa điểm đó; 「Vたことで」 nêu nguyên nhân/sự việc dẫn đến kết quả.`,
  toan_q_2019_07_53: `Đáp án ★: 2 「アルバイトしていた」. Ô ★ là mảnh thứ ba; thứ tự ghép là 1 → 4 → 2 → 3.
Câu hoàn chỉnh hiển thị: 「田中「山下さんって、パソコンにすごく詳しいよね。」木村「うん、大学生のとき、コンピューター会社でアルバイトしていたみたいだよ。」」
Dịch: “Tanaka: ‘Yamashita rành máy tính thật nhỉ.’ Kimura: ‘Ừ, hình như hồi còn là sinh viên, cậu ấy từng làm thêm ở một công ty máy tính.’”
1. とき: “khi”; nối với 「大学生の」 thành cụm chỉ thời gian 「大学生のとき」, nên đứng đầu.
2. アルバイトしていた: “đã làm thêm”; nối nơi làm việc 「コンピューター会社で」 với phỏng đoán 「みたいだ」. Đây là mảnh tại ★.
3. みたいだ: “có vẻ/hình như”; đứng cuối mệnh đề trước 「よ」 để thể hiện suy đoán dựa trên thông tin được kể.
4. コンピューター会社で: “ở công ty máy tính”; đánh dấu nơi làm thêm và phải đứng trước động từ 「アルバイトしていた」.
Ghi chú nguồn: bản đề in đuôi 「のよ」 sau chỗ trống; câu trong ứng dụng dùng 「よ」 để câu ghép đúng ngữ pháp 「みたいだよ」, như vậy không tạo chuỗi không tự nhiên 「みたいだのよ」.`,
  toan_q_2019_07_54: `Đáp án 4 — 「どうしたら日本人の友達ができるのかわかりませんでした」: người kể không biết phải làm thế nào mới kết bạn được với sinh viên Nhật. 「どうしたら～のか」 nêu điều người nói đang băn khoăn; 「わかりませんでした」 giữ mốc quá khứ của đoạn văn.
1. できるのか知りたいです: “muốn biết liệu có thể kết bạn được không”; 「知りたいです」 là mong muốn ở hiện tại, không khớp mốc hai tháng đầu đã qua.
2. できたのかわかりません: “không biết đã kết bạn được chưa”; hỏi kết quả đã xảy ra, trong khi người kể đang tự hỏi cách làm sao để kết bạn.
3. できたのか知りたかったです: “đã muốn biết liệu có kết bạn được chưa”; vừa đổi trọng tâm sang kết quả quá khứ, vừa không hợp với việc lúc đó chưa có bạn Nhật.
4. できるのかわかりませんでした: “đã không biết liệu/làm thế nào có thể kết bạn”; phù hợp cả mốc quá khứ lẫn băn khoăn về cách kết bạn.
Câu hoàn chỉnh: 「大学では日本語の授業にだけ出ていたので日本人学生と話す機会はなく、どうしたら日本人の友達ができるのかわかりませんでした。」
Dịch: “Vì ở trường đại học tôi chỉ tham dự lớp tiếng Nhật nên không có dịp trò chuyện với sinh viên Nhật; tôi chẳng biết phải làm thế nào mới kết bạn được với người Nhật.”`,
  toan_q_2019_07_55: `Đáp án 2 — 「そして」: sau khi xem các sinh viên tập bóng rổ, người kể tiếp tục kể suy nghĩ nảy ra lúc đó. Đây là liên từ nối diễn biến và ý tiếp theo, không phải quan hệ đối lập.
1. つまり: “nói cách khác/tức là”; dùng để diễn giải lại ý trước, nhưng suy nghĩ tham gia câu lạc bộ là ý mới chứ không phải diễn đạt lại việc đứng xem.
2. そして: “rồi/sau đó/và”; nối việc xem tập với suy nghĩ tiếp theo, phù hợp mạch kể theo thời gian.
3. ところが: “thế nhưng”; báo hiệu kết quả trái với dự đoán hoặc sự việc đối lập, trong khi câu sau không hề phủ định hay đối lập với việc người kể xem bóng rổ.
4. たとえば: “ví dụ”; cần theo sau một ví dụ minh họa cho ý tổng quát, nhưng câu sau kể một suy nghĩ cụ thể tiếp diễn.
Câu hoàn chỉnh: 「私もバスケットボールが好きなので、しばらく見ていました。そして、クラブに入れば日本人の友達ができるのではないかと考えました。」
Dịch: “Vì tôi cũng thích bóng rổ nên đã xem một lúc. Sau đó, tôi nghĩ rằng nếu tham gia câu lạc bộ thì có lẽ mình sẽ kết bạn được với sinh viên Nhật.”`,
  toan_q_2019_07_56: `Đáp án 4 — 「ないかもしれないと思いました」: người kể nghĩ rằng nếu không vào câu lạc bộ thì có lẽ sẽ chẳng còn cơ hội kết bạn với sinh viên Nhật. 「かもしれない」 biểu thị khả năng chưa chắc chắn; 「と思いました」 cho biết đây là suy nghĩ của người kể.
1. ないそうです: “nghe nói là không có”; biến suy nghĩ riêng thành thông tin nghe từ người khác.
2. ないのでしょうか: “không biết có phải là không có không?”; là câu hỏi/phỏng đoán hỏi người nghe, không kết thúc lời kể về điều người kể đã nghĩ.
3. ないと思ったからです: “bởi vì tôi đã nghĩ là không có”; 「からです」 cần mệnh đề chính để giải thích nguyên nhân, nhưng vị trí này kết thúc câu trước khi người kể nêu hành động.
4. ないかもしれないと思いました: “tôi nghĩ có lẽ sẽ không có”; là mệnh đề trần thuật hoàn chỉnh và diễn đạt đúng sự lo lắng chưa chắc chắn.
Câu hoàn chỉnh: 「でも、クラブに入らなかったら、ずっと日本人学生と友達になる機会はないかもしれないと思いました。」
Dịch: “Nhưng tôi nghĩ rằng nếu không tham gia câu lạc bộ thì có lẽ tôi sẽ mãi không có cơ hội kết bạn với sinh viên Nhật.”`,
  toan_q_2019_07_57: `Đáp án 3 — 「答えてくれました」: cô sinh viên đã vui lòng trả lời câu hỏi của người kể. 「Vてくれる」 diễn tả người khác làm việc có lợi cho người nói/người trong nhóm của người nói.
1. 答えてやりました: “(tôi/ai đó) trả lời cho người dưới”; 「やる」 đặt người nói ở phía ban ơn và không hợp chủ ngữ 「彼女は」 đang nói về cô sinh viên trả lời.
2. 答えてもらえました: “(tôi) đã nhận được việc được trả lời”; dùng 「もらう」 đặt người nhận sự giúp đỡ làm chủ thể ngầm, nên không khớp với 「彼女は」 là cô sinh viên đang trả lời.
3. 答えてくれました: “cô ấy đã trả lời giúp/tử tế trả lời”; hợp chủ thể 「彼女は」 và nhìn hành động có lợi từ phía người kể.
4. 答えてあげられました: “(tôi) đã có thể trả lời giúp người khác”; 「あげる」 đặt người kể ở phía ban ơn, đảo ngược ai trả lời cho ai.
Câu hoàn chỉnh: 「私は近くにいた学生に話しかけてみました。彼女は質問に丁寧に答えてくれました。」
Dịch: “Tôi thử bắt chuyện với một sinh viên ở gần đó. Cô ấy đã trả lời câu hỏi của tôi rất tận tình.”
Đối chiếu khóa: bảng đáp án tham khảo 07/2019 ghi câu in số 22 là lựa chọn 3; dữ liệu cũ ghi 2 đã được sửa.`,
  toan_q_2019_07_58: `Đáp án 1 — 「あのとき」: “vào lúc ấy”; trỏ lại khoảnh khắc trước đó khi người kể quyết định không bỏ cuộc và hỏi cách tham gia câu lạc bộ.
1. あのとき: “lúc ấy”; chỉ thời điểm đã qua, đã được nhắc đến trong câu chuyện, nên phù hợp.
2. そんなとき: “vào lúc như thế”; thường chỉ tình huống tương tự hoặc thời điểm vừa được mô tả, nhưng ở đây người kể nhấn vào chính lần cụ thể đã hỏi sinh viên kia.
3. このときも: “lần này cũng”; gợi một thời điểm gần hiện tại hoặc thêm một lần nữa, không phù hợp với sự việc quá khứ được nhìn lại.
4. どんなときも: “bất cứ lúc nào”; khái quát mọi thời điểm, trong khi câu đang nói đến một khoảnh khắc cụ thể.
Câu hoàn chỉnh: 「あのときあきらめないでクラブの入り方を聞いたから、こんなに速く友達ができたのだと思います。」
Dịch: “Tôi nghĩ rằng chính vì lúc ấy mình không bỏ cuộc mà hỏi cách tham gia câu lạc bộ, nên đã kết bạn được nhanh đến vậy.”`,
}

const parts = exam.parts
const questions = new Map(parts.flatMap((part) => part.questions || []).map((question) => [question.id, question]))
for (const [questionId, explanation] of Object.entries(explanations)) {
  const question = questions.get(questionId)
  assert.ok(question, `Missing ${questionId}.`)
  question.explanation = explanation
  curated[questionId] = explanation
}

const reviewedAnswers = new Map([
  ['toan_q_2019_07_55', { original: 3, reviewed: 2 }],
  ['toan_q_2019_07_57', { original: 2, reviewed: 3 }],
])
for (const [questionId, entry] of reviewedAnswers) {
  const question = questions.get(questionId)
  assert.ok(question, `Missing ${questionId}.`)
  const oldAnswer = Number(question.correctAnswer ?? question.answer)
  assert.ok(
    oldAnswer === entry.original || oldAnswer === entry.reviewed,
    `${questionId}: unexpected answer ${oldAnswer}; refusing to overwrite it.`
  )
  question.correctAnswer = entry.reviewed
  question.answer = entry.reviewed
}

const starQuestions = [49, 50, 51, 52, 53].map((number) => questions.get(`toan_q_2019_07_${number}`))
assert.ok(starQuestions.every(Boolean), 'Missing a 2019-07 star-order question.')
assert.equal(starQuestions[4].starPrompt.after, 'よ。', 'Keep the corrected natural ending 「みたいだよ」 in the app.')

const reviewedSequence = [
  ...parts
    .find((part) => part.title.includes('Ngữ pháp') && part.title.includes('Mondai 1'))
    .questions.filter((question) => question.number >= 36 && question.number <= 48)
    .map((question) => Number(question.correctAnswer)),
  ...starQuestions.map((question) => Number(question.correctAnswer)),
  ...[54, 55, 56, 57, 58].map((number) => Number(questions.get(`toan_q_2019_07_${number}`).correctAnswer)),
]
const referenceSequence = [2, 4, 4, 1, 2, 1, 3, 2, 4, 3, 2, 3, 3, 1, 3, 3, 2, 2, 4, 2, 4, 3, 1]
assert.deepEqual(
  reviewedSequence,
  referenceSequence,
  'Reviewed 2019-07 grammar answers differ from the reference table.'
)

const report = {
  generatedAt: new Date().toISOString(),
  examId: exam.id,
  scope: 'Grammar questions 36–58: Mondai 1, star-order Mondai 2, cloze Mondai 3.',
  method:
    'Compared printed prompts/options and star placement with the supplied Google Drive PDF (printed pages 4–6), reconstructed each star sentence and checked the answer sequence against a nonofficial Vietnamese reference table. The reference table is not an official JLPT answer key.',
  sources: [
    {
      name: 'User-provided source PDF: 10. N3 7-2019.pdf',
      scope:
        'Prompt and option visual inspection, printed pages 4–6; star prompts/order on page 5 and cloze passage/options on page 6.',
    },
    {
      name: 'Phanmemhoctiengnhat answer table',
      url: 'https://phanmemhoctiengnhat.com/jlpt/dap-an-jlpt-n3/dap-an-jlpt-n3-7-2019-chuan-day-du-nhat.html',
      scope: 'Published nonofficial answers for all 23 grammar items.',
    },
    {
      name: 'PassJapanese question transcription',
      url: 'https://passjapanese.com/ja/jlpt/n3/exam/2019-07-grammar-reading',
      scope: 'Cross-check of exam structure and question transcription; not used as an official answer key.',
    },
  ],
  answerSequence: reviewedSequence,
  corrections: [
    {
      questionNumber: 55,
      before: 3,
      after: 2,
      reason:
        '「そして」 carries the narrative forward from watching practice to the resulting thought; 「ところが」 incorrectly implies a contrast. The reference table also gives option 2.',
    },
    {
      questionNumber: 57,
      before: 2,
      after: 3,
      reason:
        '「彼女は」 is the person who answered; 「答えてくれました」 matches that subject and the narrator’s beneficiary perspective. The reference table also gives option 3.',
    },
  ],
  starQuestions: starQuestions.map((question) => ({
    questionNumber: question.number,
    order: question.starCorrectOrder,
    starPosition: question.starPosition,
    starAnswer: question.correctAnswer,
    completeSentence: `${question.starPrompt.before}${question.starCorrectOrder.map((choice) => question.options[choice - 1].replace(/^\s*[1-4１-４][.．、\s　]*/u, '').trim()).join('')}${question.starPrompt.after}`,
  })),
  explanationsCompleted: Object.keys(explanations).length,
  officialKeyConfirmed: false,
}

fs.writeFileSync(masterPath, `${JSON.stringify(exams, null, 2)}\n`, 'utf8')
fs.writeFileSync(curatedPath, `${JSON.stringify(curated, null, 2)}\n`, 'utf8')
fs.writeFileSync(reportPath, `${JSON.stringify(report, null, 2)}\n`, 'utf8')
console.log(
  `Reviewed N3 July 2019 grammar q36–58: ${reviewedSequence.length} answers, ${Object.keys(explanations).length} explanations, 2 answer corrections.`
)
