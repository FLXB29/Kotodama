import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'

const root = path.resolve('.')
const masterPath = path.join(root, 'data/jlpt_n3_toan_master.json')
const curatedPath = path.join(root, 'data/jlpt_n3_explanations_curated.json')
const reportPath = path.join(root, 'reports/n3-quality-audit/vocabulary-2020-12-context-review.json')
const examId = 'toan-n3-202012-full'

const reviews = [
  {
    number: 15,
    answer: 4,
    options: ['案外', 'せっかく', 'ついでに', '偶然'],
    target: '偶然（ぐうぜん）',
    explanation: [
      'Đáp án 4 — 「偶然」（ぐうぜん）là tình cờ, không hẹn trước; 「偶然友人に会う」 là tình cờ gặp bạn.',
      'Dịch: “Trong lúc đi dạo ở một thành phố khi đang du lịch, tôi tình cờ gặp một người bạn thời sinh viên và vô cùng ngạc nhiên.”',
      '1. 案外（あんがい）: ngoài dự đoán, hóa ra; thường nhận xét kết quả khác với điều mình nghĩ, không diễn tả rõ một cuộc gặp không hẹn trước.',
      '2. せっかく: đã mất công/có dịp quý; không phù hợp để nói cuộc gặp xảy ra ngẫu nhiên.',
      '3. ついでに: tiện thể làm thêm việc B khi đã làm việc A; ở đây không có hành động được chủ ý tranh thủ.',
      '4. 偶然（ぐうぜん）: tình cờ; khớp với việc bất ngờ gặp lại bạn cũ khi đang đi dạo.',
      'Ghi nhớ: 偶然会う = tình cờ gặp; ついでに買う = tiện thể mua.',
    ].join('\n'),
  },
  {
    number: 16,
    answer: 3,
    options: ['カロリー', 'アップ', 'ユーモア', 'レジャー'],
    target: 'ユーモア',
    explanation: [
      'Đáp án 3 — 「ユーモアのある人」 là người có khiếu hài hước; 「明るくて」 bổ sung nét tính cách vui vẻ, nên nói chuyện cùng rất thú vị.',
      'Dịch: “Anh Mori là người vui vẻ và có khiếu hài hước, nên nói chuyện cùng rất vui.”',
      '1. カロリー: ca-lo-ri, đơn vị đo năng lượng của thức ăn; không phải phẩm chất tính cách được khen trong câu.',
      '2. アップ: sự tăng lên/nâng cao hoặc trạng thái được đưa lên; không có nghĩa là óc hài hước.',
      '3. ユーモア: sự hài hước; kết hợp tự nhiên thành 「ユーモアのある人」.',
      '4. レジャー: hoạt động giải trí/thời gian nhàn rỗi; không mô tả tính cách của một người ở đây.',
      'Ghi nhớ: ユーモアのある人 = người có khiếu hài hước.',
    ].join('\n'),
  },
  {
    number: 17,
    answer: 2,
    options: ['感覚', '希望', '意識', '決心'],
    target: '希望（きぼう）',
    explanation: [
      'Đáp án 2 — 「行きたい場所の希望を聞く」 là hỏi mọi người mong muốn đi đâu; 「希望」 diễn tả điều một người muốn hoặc hy vọng.',
      'Dịch: “Chuyến đi lần này, chúng tôi sẽ hỏi mọi người muốn đến nơi nào rồi quyết định sẽ đi đâu.”',
      '1. 感覚（かんかく）: cảm giác/tri giác; không phải địa điểm mà mọi người muốn chọn cho chuyến đi.',
      '2. 希望（きぼう）: mong muốn/nguyện vọng; đúng với việc hỏi mỗi người muốn đi đâu.',
      '3. 意識（いしき）: ý thức/nhận thức; không mang nghĩa lựa chọn mong muốn.',
      '4. 決心（けっしん）: sự quyết tâm/quyết định sau khi cân nhắc; câu hỏi lấy ý muốn của mọi người, chưa nói đến quyết tâm của họ.',
      'Ghi nhớ: 希望を聞く = hỏi nguyện vọng; 希望する場所 = nơi mong muốn.',
    ].join('\n'),
  },
  {
    number: 18,
    answer: 1,
    options: ['登場', '発生', '外出', '入門'],
    target: '登場',
    explanation: [
      'Đáp án 1 — 「物語に登場する人」 là nhân vật xuất hiện trong câu chuyện; 「登場する」 dùng cho người/vật xuất hiện trong truyện, phim, sân khấu hoặc một sự kiện.',
      'Dịch: “Những người xuất hiện trong câu chuyện này đều là phụ nữ.”',
      '1. 登場（とうじょう）: xuất hiện/lên sân khấu; 「物語に登場する」 kết hợp đúng.',
      '2. 発生（はっせい）: phát sinh/xảy ra, thường dùng cho sự cố, vấn đề, hiện tượng; không nói người “phát sinh” trong truyện.',
      '3. 外出（がいしゅつ）: ra ngoài; không diễn tả việc một nhân vật xuất hiện trong nội dung câu chuyện.',
      '4. 入門（にゅうもん）: nhập môn/bắt đầu học một lĩnh vực; không phù hợp với 「人たち」 trong câu.',
      'Ghi nhớ: 物語に登場する人物 = nhân vật xuất hiện trong câu chuyện.',
    ].join('\n'),
  },
  {
    number: 19,
    answer: 3,
    options: ['はっきり', 'しっかり', 'ぴったり', 'そっくり'],
    target: 'ぴったり',
    explanation: [
      'Đáp án 3 — 「靴がぴったりだ」 nghĩa là giày vừa vặn; câu đối chiếu đôi trước hơi rộng với đôi này cho thấy đang nói về kích cỡ.',
      'Dịch: “Đôi giày tôi vừa thử lúc nãy hơi rộng, nhưng đôi này vừa vặn.”',
      '1. はっきり: rõ ràng/dứt khoát; thường nói về lời nói, hình ảnh hoặc ý định, không phải độ vừa của giày.',
      '2. しっかり: chắc chắn/vững vàng; không nêu quan hệ vừa khít giữa giày và bàn chân.',
      '3. ぴったり: vừa khít, vừa vặn hoặc khớp chính xác; đúng với phép so sánh kích cỡ giày.',
      '4. そっくり: giống hệt nhau/toàn bộ; dùng để nói hai vật giống nhau, không nói đôi giày vừa chân.',
      'Ghi nhớ: サイズがぴったり = kích cỡ vừa khít; そっくりな顔 = khuôn mặt giống hệt.',
    ].join('\n'),
  },
  {
    number: 20,
    answer: 1,
    options: ['配達', '報告', '送信', '訪問'],
    target: '配達（はいたつ）',
    explanation: [
      'Đáp án 1 — 「商品を家まで配達してもらう」 là nhờ giao hàng đến tận nhà; 「配達する」 nói về việc chuyển hàng đến địa chỉ người nhận.',
      'Dịch: “Vì đã mua rất nhiều đồ nên tôi nhờ giao các món hàng về tận nhà.”',
      '1. 配達（はいたつ）: giao hàng/giao thư đến nơi; phù hợp với 「商品を家まで」.',
      '2. 報告（ほうこく）: báo cáo một sự việc/kết quả; không phải vận chuyển hàng hóa.',
      '3. 送信（そうしん）: gửi dữ liệu/tín hiệu điện tử; không dùng cho việc giao đồ mua sắm.',
      '4. 訪問（ほうもん）: đến thăm một người hoặc nơi chốn; không có nghĩa giao món hàng.',
      'Ghi nhớ: 荷物を配達する = giao kiện hàng; メールを送信する = gửi email.',
    ].join('\n'),
  },
  {
    number: 21,
    answer: 4,
    options: ['引き出した', '受け取った', '取り付けた', '引き受けた'],
    target: '引き受ける',
    explanation: [
      'Đáp án 4 — 「司会を引き受ける」 là nhận đảm nhiệm vai trò dẫn chương trình; 「友人に頼まれたので」 cho biết người nói nhận lời theo đề nghị của bạn.',
      'Dịch: “Vì bạn nhờ nên tôi đã nhận làm người dẫn chương trình cho lễ cưới.”',
      '1. 引き出す（ひきだす）: kéo/lấy ra; cũng dùng với rút tiền hoặc khơi gợi khả năng, không phải nhận trách nhiệm.',
      '2. 受け取る（うけとる）: nhận một vật, tiền, thư hoặc thông tin; không tự nhiên với vai trò công việc 「司会」.',
      '3. 取り付ける（とりつける）: lắp đặt thiết bị hoặc đạt được lời hứa/thỏa thuận; không có nghĩa nhận làm MC.',
      '4. 引き受ける（ひきうける）: nhận lời đảm nhận công việc/trách nhiệm; đúng với vai trò được bạn nhờ.',
      'Ghi nhớ: 仕事を引き受ける = nhận đảm nhiệm công việc; 荷物を受け取る = nhận hàng.',
    ].join('\n'),
  },
  {
    number: 22,
    answer: 4,
    options: ['競争', '選択', '区別', '比較'],
    target: '比較（ひかく）',
    explanation: [
      'Đáp án 4 — 「仕事内容や給料を比較する」 là so sánh nội dung công việc và lương giữa hai công ty; sau đó mới chọn công ty mình thấy tốt hơn.',
      'Dịch: “Tôi so sánh nội dung công việc và mức lương của hai công ty, rồi quyết định vào công ty mà tôi thấy phù hợp hơn.”',
      '1. 競争（きょうそう）: cạnh tranh với đối thủ; không kết hợp với việc đem công việc và lương ra cân nhắc.',
      '2. 選択（せんたく）: lựa chọn; câu sau mới nêu quyết định chọn công ty, còn chỗ trống cần động từ chỉ việc cân nhắc hai bên.',
      '3. 区別（くべつ）: phân biệt hai loại/đối tượng để nhận ra chúng khác nhau; không nhấn vào việc cân nhắc ưu nhược điểm.',
      '4. 比較（ひかく）: so sánh hai hay nhiều đối tượng; phù hợp với hai công ty và các tiêu chí công việc, lương.',
      'Ghi nhớ: AとBを比較する = so sánh A với B; 比較してから選ぶ = so sánh rồi chọn.',
    ].join('\n'),
  },
  {
    number: 23,
    answer: 1,
    options: ['あくび', 'くしゃみ', 'せき', 'しゃっくり'],
    target: 'あくび',
    explanation: [
      'Đáp án 1 — 「あくびが出る」 là ngáp; thức đọc sách đến sáng khiến hôm nay buồn ngủ nên cứ ngáp nhiều lần.',
      'Dịch: “Vì thức đọc sách đến tận sáng nên hôm nay tôi buồn ngủ và ngáp liên tục.”',
      '1. あくび: cái ngáp; đi với 「出る」 trong cách nói 「あくびが出る」, khớp nguyên nhân buồn ngủ.',
      '2. くしゃみ: cái hắt hơi; thường do bụi, dị ứng hoặc cảm lạnh, không phải biểu hiện trực tiếp của thiếu ngủ.',
      '3. せき: cơn ho; thường liên quan đến đường hô hấp, không phải dấu hiệu buồn ngủ trong câu này.',
      '4. しゃっくり: nấc cụt; không được gợi ra bởi việc thức khuya đọc sách.',
      'Ghi nhớ: あくびが出る = ngáp; くしゃみが出る = hắt hơi.',
    ].join('\n'),
  },
  {
    number: 24,
    answer: 2,
    options: ['失礼', '文句', '我慢', '反対'],
    target: '文句（もんく）',
    explanation: [
      'Đáp án 2 — 「文句を言う」 là phàn nàn/kêu ca; câu bị động 「お客さんから文句を言われた」 nghĩa là bị khách phàn nàn.',
      'Dịch: “Vì mang món ăn ra chậm nên tôi bị khách phàn nàn.”',
      '1. 失礼（しつれい）: sự thất lễ; có thể nói 「失礼なことを言う」, nhưng cụm chuẩn diễn tả lời phàn nàn là 「文句を言う」.',
      '2. 文句（もんく）: lời phàn nàn/lời cằn nhằn; kết hợp trực tiếp với 「言う」 và đúng tình huống khách không hài lòng.',
      '3. 我慢（がまん）: sự chịu đựng/nhẫn nhịn; thường dùng 「我慢する」, không phải lời khách nói với nhân viên.',
      '4. 反対（はんたい）: sự phản đối/ý kiến trái chiều; thường nói 「反対する」「反対意見」, không diễn đạt lời khiếu nại về phục vụ chậm.',
      'Ghi nhớ: 文句を言う = phàn nàn; 文句を言われる = bị phàn nàn.',
    ].join('\n'),
  },
]

const answerKey = [4, 3, 2, 1, 3, 1, 4, 4, 1, 2]
const normalize = (value) =>
  String(value || '')
    .normalize('NFKC')
    .replace(/^\s*[1-4][.)．、\s　]*/u, '')
    .replace(/\s+/gu, '')
    .trim()
const master = JSON.parse(fs.readFileSync(masterPath, 'utf8'))
const curated = JSON.parse(fs.readFileSync(curatedPath, 'utf8'))
const exam = master.find((entry) => entry.id === examId)
assert.ok(exam, `Missing JLPT N3 ${examId} exam`)
const questions = exam.parts.flatMap((part) => part.questions || [])

for (const [index, row] of reviews.entries()) {
  const question = questions.find((entry) => Number(entry.number) === row.number)
  assert.ok(question, `Missing question ${row.number}`)
  assert.equal(Number(question.answer), answerKey[index], `Stored answer differs at question ${row.number}`)
  assert.equal(
    Number(question.correctAnswer),
    answerKey[index],
    `Correct-answer field differs at question ${row.number}`
  )
  assert.equal(row.answer, answerKey[index], `Review key differs at question ${row.number}`)
  assert.deepEqual(
    question.options.map(normalize),
    row.options.map(normalize),
    `Options changed at question ${row.number}`
  )
  assert.ok(row.explanation.startsWith(`Đáp án ${row.answer} —`), `Explanation label differs at question ${row.number}`)
  assert.ok(row.explanation.includes('Dịch:'), `Missing translation at question ${row.number}`)
  for (let option = 1; option <= 4; option++) {
    assert.ok(
      row.explanation.includes(`\n${option}. `),
      `Missing option ${option} explanation at question ${row.number}`
    )
  }
  question.explanation = row.explanation
  curated[question.id] = row.explanation
}

fs.writeFileSync(masterPath, `${JSON.stringify(master, null, 2)}\n`)
fs.writeFileSync(curatedPath, `${JSON.stringify(curated, null, 2)}\n`)
fs.mkdirSync(path.dirname(reportPath), { recursive: true })
fs.writeFileSync(
  reportPath,
  `${JSON.stringify(
    {
      reviewedOn: '2026-09-27',
      examId,
      section: 'Từ vựng – Mondai 3',
      scope:
        'Questions 15–24: translate each prompt, explain the contextual meaning of the answer, and distinguish all four choices.',
      answerKeysChanged: 0,
      answerKeys: answerKey,
      sources: [
        {
          url: 'https://chuyenngoaingu.com/news/de-thi-va-dap-an-jlpt-ky-thi-thang-12-2020-nang-luc-tieng-nhat-5276.aspx',
          type: 'Third-party answer-key compilation; official status not established.',
        },
        {
          url: 'https://www.tiengnhatdongian.com/dap-an-jlpt-n3-12-2020/',
          type: 'Independent third-party answer-key compilation; official status not established.',
        },
      ],
      method:
        'Preserved the stored Japanese prompts and options, checked all ten keys against the local section and two agreeing third-party answer-key tables, and rewrote explanations from contextual Japanese usage. The sources are not an official JLPT answer key.',
      rows: reviews.map(({ number, answer, options, target, explanation }) => ({
        number,
        answer,
        options,
        target,
        answerPreserved: true,
        includesTranslation: explanation.includes('Dịch:'),
        explainsAllFourChoices: [1, 2, 3, 4].every((option) => explanation.includes(`\n${option}. `)),
        explanation,
      })),
    },
    null,
    2
  )}\n`
)

console.log(`Reviewed JLPT N3 12/2020 vocabulary questions 15–24; confirmed and preserved all ten answer keys.`)
