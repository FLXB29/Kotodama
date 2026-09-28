import fs from 'node:fs'

const mainPath = 'data/jlpt_n3_toan_master.json'
const sectionPath = 'data/jlpt_full_master.json'
const curatedPath = 'data/jlpt_n3_explanations_curated.json'
const reportPath = 'reports/n3-quality-audit/vocabulary-2021-07-m5-review.json'

const readJson = (path) => JSON.parse(fs.readFileSync(path, 'utf8'))
const mainExams = readJson(mainPath)
const sectionExams = readJson(sectionPath)
const curated = readJson(curatedPath)

const expectedAnswers = { 31: 2, 32: 1, 33: 4, 34: 1, 35: 3 }
const sourceOptions = {
  31: [
    '1 飛行機の出発時間がオーバーになった。',
    '2 安いのがなくて、1万円もオーバーしてしまった。',
    '3 考えすぎて、頭がオーバーになった。',
    '4 料理がオーバーして、もう食べられない。',
  ],
  32: [
    '1 ここは景色のいい場所だが、駅から遠いという欠点がある。',
    '2 栄養に欠点が出ないように、食事のメニューを考えている。',
    '3 ガードレールにぶつけて、車に欠点が付いてしまった。',
    '4 メールを送る前に、メールアドレスに欠点がないか確認しよう。',
  ],
  33: [
    '1 私は学生のころ、数学より理科の方が親しかった彼女。',
    '2 彼女はとても親しい道を教えてくれた。',
    '3 久しぶりに友達と会って、親しかった。',
    '4 引っ越してきたばかりで、近くにまだ親しい人はいない。',
  ],
  34: [
    '1 明日帰国するので、かばんに洋服やお土産を詰めた。',
    '2 テーブルに食器を2枚詰めて、朝食の準備をした。',
    '3 忘れないように、大切なことをノートに詰めた。',
    '4 ジャケットのポケットに手を詰めて、切符を出した。',
  ],
  35: [
    '1 母の誕生日に、何かプレゼントを支給しようと思う。',
    '2 これから先生にレポートを支給しに行くつもりだ。',
    '3 この会社は、家から会社までの交通費を支給してくれる。',
    '4 会議が始まる前に、この資料を支給してください。',
  ],
}

const explanations = {
  31: `Đáp án tham khảo 2 — オーバー (over) nghĩa là vượt qua một mức hoặc giới hạn. 「安いのがなくて、1万円もオーバーしてしまった」 nghĩa là “Không tìm được món nào rẻ nên cuối cùng đã vượt dự toán tới 10.000 yên”; ngân sách là ý được lược theo ngữ cảnh.
1. 「飛行機の出発時間がオーバーになった」: “Giờ khởi hành của máy bay bị vượt quá”. Nếu máy bay khởi hành muộn, thường nói 出発が遅れた hoặc 出発時刻を過ぎた.
2. Không có món giá rẻ nên số tiền mua vượt mức dự kiến 10.000 yên: オーバーする dùng đúng với ngân sách/giới hạn.
3. 「頭がオーバーになった」: “Đầu bị quá mức”. Khi suy nghĩ quá nhiều, cách nói tự nhiên là 頭がいっぱいになった hoặc 頭がパンクしそうだ.
4. 「料理がオーバーして、もう食べられない」: “Món ăn bị ‘vượt mức’ nên không ăn được nữa”. Nếu phần ăn quá nhiều, nói 料理が多すぎて食べきれない; オーバー không kết hợp tự nhiên với 料理 ở nghĩa này.
Ghi nhớ: オーバーする dùng khi số lượng, chi phí hoặc thời lượng vượt giới hạn; món ăn quá nhiều là 多すぎる, chuyến bay muộn là 遅れる.

Từ trọng tâm: 「オーバー」（over）: vượt mức; vượt quá giới hạn, đặc biệt như 予算オーバー “vượt ngân sách”.`,
  32: `Đáp án tham khảo 1 — 欠点（けってん）là nhược điểm hoặc mặt chưa tốt của một người, vật hay địa điểm. 「ここは景色のいい場所だが、駅から遠いという欠点がある」 nghĩa là “Nơi này có cảnh đẹp, nhưng có nhược điểm là xa nhà ga”.
1. Cảnh đẹp nhưng xa ga là một bất lợi của địa điểm: 欠点がある dùng đúng.
2. 「栄養に欠点が出ないように」: “để nhược điểm không xuất hiện trong dinh dưỡng”. Với dinh dưỡng, nói 栄養が不足しないように hoặc 栄養が偏らないように.
3. 「ガードレールにぶつけて、車に欠点が付いてしまった」: “va vào lan can, khiến xe dính một khuyết điểm”. Nếu xe bị xước/hư hại, nói 車に傷がついた.
4. 「メールアドレスに欠点がないか」: “kiểm tra xem địa chỉ email có nhược điểm không”. Lỗi gõ hoặc địa chỉ sai là 間違い・誤り; 欠点 nói về nhược điểm, không phải lỗi ký tự.
Ghi nhớ: 欠点 = nhược điểm; 傷 = vết xước; 間違い = lỗi/sai sót. Bản chép web ghi 場面 ở lựa chọn 1, còn bản master ghi 場所; ở đây giữ 場所 vì câu đang nói về một địa điểm xa nhà ga. Bản đề JLPT gốc chưa đối chiếu được để xác nhận chữ này.

Từ trọng tâm: 「欠点」（けってん）: khuyết điểm; điểm chưa tốt hoặc bất lợi.`,
  33: `Đáp án tham khảo 4 — 親しい（したしい）diễn tả quan hệ thân thiết hoặc người quen thân. 「引っ越してきたばかりで、近くにまだ親しい人はいない」 nghĩa là “Tôi mới chuyển đến nên quanh đây vẫn chưa có ai thân thiết”.
1. Bản chép đề kết thúc lựa chọn này bằng 「彼女」 sau câu 「私は学生のころ、数学より理科の方が親しかった」, tạo thành một cụm lệch chủ thể/không hoàn chỉnh. Ngay cả khi bỏ 「彼女」, khi nói môn học mình giỏi hoặc hợp hơn thì dùng 理科の方が得意だった, không dùng 親しかった.
2. 「親しい道」: “con đường thân thiết/gần gũi”. 「親しい」 chủ yếu mô tả quan hệ người với người; nói đường ngắn là 近道, đường mình quen thuộc là よく知っている道.
3. 「久しぶりに友達と会って、親しかった」: “Gặp bạn sau lâu ngày và [đã] thân thiết”. Câu này có thể đoán được ý nếu tự bổ sung chủ thể và ngữ cảnh, nhưng quan hệ thân thiết không phải kết quả tự nhiên của việc gặp lại; cách nói rõ hơn là 久しぶりに友達と会って、楽しく話した. Không nên coi đây là bất khả về ngữ pháp; đây là lựa chọn kém tự nhiên hơn câu 4.
4. Người mới chuyển nhà chưa có ai thân thiết ở gần: 親しい人 là cách dùng tự nhiên và rõ nghĩa.
Ghi nhớ: 親しい友人・親しい人 = bạn/người thân thiết; môn học mình giỏi là 得意; đường gần/ngắn là 近い道・近道. Hai lựa chọn 1 và 3 trong bản chép có câu chữ vụng; chưa tìm được bản JLPT gốc hay khóa chính thức để xác nhận thêm ngoài đáp án tham khảo.

Từ trọng tâm: 「親しい」（したしい）: thân thiết; gần gũi (về quan hệ).`,
  34: `Đáp án tham khảo 1 — 詰める（つめる）là cho đồ vào túi/vật chứa, thường xếp dày hoặc lấp đầy chỗ trống. 「かばんに洋服やお土産を詰めた」 nghĩa là “Tôi xếp quần áo và quà lưu niệm vào va-li/túi để ngày mai về nước”.
1. Xếp quần áo và quà vào túi: かばんに詰める đúng với nghĩa cho đồ vào vật chứa.
2. 「テーブルに食器を2枚詰めて」: “nhét hai món bát đĩa lên bàn”. Bày bát đĩa để chuẩn bị bữa ăn là 食器を並べる・置く; 詰める hợp với việc xếp đồ vào va-li/hộp.
3. 「大切なことをノートに詰めた」: “nhét điều quan trọng vào vở”. Ghi lại điều cần nhớ là ノートに書く・書き留める.
4. 「ポケットに手を詰めて」: “nhét tay vào túi áo khoác”. Cách nói thông thường là ポケットに手を入れる.
Ghi nhớ: 詰める là nhét/xếp đầy vào một chỗ chứa; đồ bày trên bàn thì 並べる, ghi chép là 書き留める, đưa tay vào túi là 入れる.

Từ trọng tâm: 「詰める」（つめる）: nhét/xếp đồ vào vật chứa; làm đầy chỗ trống.`,
  35: `Đáp án tham khảo 3 — 支給（しきゅう）する là cấp hoặc chi trả thứ mà tổ chức phân bổ cho người nhận, thường là lương, phụ cấp, chi phí hay vật dụng theo chế độ. 「この会社は、家から会社までの交通費を支給してくれる」 nghĩa là “Công ty này chi trả tiền đi lại từ nhà đến công ty”.
1. 「母の誕生日に、何かプレゼントを支給しよう」: “Tôi định cấp phát món quà nào đó cho sinh nhật mẹ”. Tặng quà trong quan hệ cá nhân thường nói プレゼントを贈る・あげる; 支給 mang sắc thái cấp phát theo quy định.
2. 「先生にレポートを支給しに行く」: “Đi cấp phát bài báo cáo cho giáo viên”. Người học nộp báo cáo cho giáo viên là レポートを提出する.
3. Công ty chi trả chi phí đi lại cho nhân viên: 交通費を支給する là cách kết hợp phù hợp.
4. 「会議が始まる前に、この資料を支給してください」: “Xin hãy cấp phát tài liệu này trước cuộc họp”. 支給 cũng có thể dùng với một số vật phẩm được tổ chức cấp, nên không phải bất khả về ngữ pháp; nhưng tài liệu phát cho người dự họp thường nói 資料を配布する. Vì vậy 交通費を支給する là cách dùng sát nghĩa và tự nhiên nhất trong các lựa chọn.
Ghi nhớ: cơ quan/công ty cấp chi phí hoặc phụ cấp là 支給する; tặng cá nhân là 贈る; nộp bài là 提出する; phát tài liệu cho người tham dự là 配布する.

Từ trọng tâm: 「支給」（しきゅう）: cấp phát/chi trả theo chế độ; thường dùng với lương, phụ cấp, chi phí hoặc vật dụng do tổ chức cấp.`,
}

const findQuestion = (exam, number) => exam.parts.flatMap((part) => part.questions || []).find((question) => Number(question.number) === number)
const mainExam = mainExams.find(({ id }) => id === 'toan-n3-202107-full')
const sectionExam = sectionExams.find(({ id }) => id === 'cm2u2xkhj00zx134iasxlu6kb-vocab')
if (!mainExam || !sectionExam) throw new Error('Missing July 2021 N3 mock exam or standalone vocabulary section')

const sourceDiffs = []
for (const [numberText, expectedAnswer] of Object.entries(expectedAnswers)) {
  const number = Number(numberText)
  const mainQuestion = findQuestion(mainExam, number)
  const sectionQuestion = findQuestion(sectionExam, number)
  if (!mainQuestion || !sectionQuestion) throw new Error(`Missing M5 question ${number}`)
  if (Number(mainQuestion.correctAnswer ?? mainQuestion.answer) !== expectedAnswer) throw new Error(`Unexpected mock key for question ${number}`)
  if (String(sectionQuestion.answer ?? sectionQuestion.correctAnswer) !== String(expectedAnswer)) throw new Error(`Unexpected standalone key for question ${number}`)
  if (mainQuestion.options.length !== 4 || sectionQuestion.options.length !== 4) throw new Error(`Question ${number} must have four choices in both records`)

  const oldMainOptions = mainQuestion.options.map((option) => String(typeof option === 'object' ? option.text : option))
  const oldSectionOptions = sectionQuestion.options.map((option) => String(typeof option === 'object' ? option.text : option))
  mainQuestion.options = sourceOptions[number]
  sectionQuestion.options = sourceOptions[number].map((text, index) => ({
    ...(typeof sectionQuestion.options[index] === 'object' ? sectionQuestion.options[index] : { id: String(index + 1) }),
    text: text.replace(/^\s*[1-4][.)．、\s　]*/u, ''),
  }))

  const explanation = explanations[number]
  mainQuestion.explanation = explanation
  sectionQuestion.explanation = explanation
  curated[mainQuestion.id] = explanation

  const normalize = (value) => String(value).normalize('NFKC').replace(/^\s*[1-4][.)．、\s　]*/u, '').replace(/[\s　]/gu, '')
  sourceDiffs.push({
    number,
    questionIds: { mock: mainQuestion.id, section: sectionQuestion.id },
    key: expectedAnswer,
    priorOptionTextDifferences: sourceOptions[number].map((text, index) => normalize(oldMainOptions[index]) !== normalize(text) || normalize(oldSectionOptions[index]) !== normalize(text)),
  })
}

const report = {
  exam: 'JLPT N3 2021/07 — vocabulary Mondai 5, questions 31–35',
  reviewDate: '2026-09-27',
  answerKeysChanged: 0,
  answers: expectedAnswers,
  rationale: 'Preserved keys 2–1–4–1–3, matching the public TryNihongo answer reference; Misonedu publishes a second reference answer sheet as an image, but no official JLPT key was located. The standalone text had several transcription differences from the mock. This pass synchronizes both dataset versions, retains the published question 33 option 1 tail 「彼女」, restores the likely intended q32 guardrail particle and spelling, and uses the meeting-material q35 option 4 corroborated by the standalone copy and the Nihongoph transcription. Question 33 option 3 and q35 option 4 are treated as less natural/context-dependent rather than absolutely impossible. The original JLPT question scan was not available for direct visual verification.',
  sourceDiffs,
  sourceConflicts: [
    { question: 32, option: 1, variants: ['場所 (main mock)', '場面 (standalone and two public transcriptions)'], decision: 'Use 場所 because the sentence describes a physical location that is far from the station; original scan not verified, so this remains a transcription uncertainty.' },
    { question: 32, option: 3, variants: ['カードレールに (old main mock)', 'ガードレールぶつけて (standalone and public transcriptions)'], decision: 'Correct the common noun to ガードレール and restore に for the Japanese construction ガードレールにぶつける; exact punctuation/particle not verified against an original scan.' },
    { question: 33, option: 1, variants: ['...親しかった。 (old main mock)', '...親しかった彼女。 (standalone and public transcriptions)'], decision: 'Keep the transcribed 彼女 tail and explicitly flag the sentence as malformed/uncertain instead of silently deleting it.' },
    { question: 35, option: 4, variants: ['お釣りを支給してもらいのを忘れた (old main mock)', '会議が始まる前に、この資料を支給してください (standalone and public transcription)'], decision: 'Use the latter as the likely intended source choice; it forms a complete sentence and is corroborated by two transcriptions. Clarify that 配布する is the usual verb for distributing meeting handouts.' },
  ],
  limitations: [
    'The public answer references are secondary references, not the JLPT official key.',
    'The question-paper source is a public transcription, not an original JLPT scan. Exact characters in q32 and the malformed q33 option 1 remain uncertain.',
    'Question 33 option 3 and question 35 option 4 are context-sensitive/awkward; explanations identify the expected best usage without claiming absolute grammatical impossibility.',
  ],
  sources: [
    { type: 'exam-transcription', url: 'https://www.nihongoph.com/2022/10/jlpt-n3-72021.html', note: 'Public transcription of July 2021 N3 questions 31–35. It includes likely transcription/OCR anomalies in q32, q33 and q35; no original scan was available for visual comparison.' },
    { type: 'exam-transcription-cross-check', url: 'https://www.scribd.com/document/976942855/12-N3-7-2021', note: 'Independent public transcription of the N3 07/2021 question paper; not an official source.' },
    { type: 'answer-key', url: 'https://trynihongo.com/ko/dap-an-ky-thi-jlpt-n3-thang-072021-p450', note: 'Public reference key lists M5 questions 31–35 as 2–1–4–1–3; explicitly presented as a reference answer, not an official key.' },
    { type: 'answer-key-cross-check', url: 'https://www.misonedu.cn/riyu/n1n2/5537.html', note: 'Misonedu publishes a second July 2021 N3 answer sheet as an image; not an official JLPT key.' },
    { type: 'dictionary', url: 'https://kotobank.jp/word/%E3%81%8A%E3%83%BC%E3%81%B0%E3%83%BC-3208656', note: 'Digital Daijisen: quantity over a limit; examples include 重量制限をオーバーする and 予算オーバー.' },
    { type: 'dictionary', url: 'https://kotobank.jp/word/%E6%AC%A0%E7%82%B9-490685', note: 'Digital Daijisen: 欠点 means an insufficient or unfavorable point, shortcoming.' },
    { type: 'dictionary', url: 'https://kotobank.jp/word/%E8%A6%AA%E3%81%97%E3%81%84-520457', note: 'Digital Daijisen: 親しい means being close and on good terms; also familiar through frequent contact.' },
    { type: 'dictionary', url: 'https://www2.ninjal.ac.jp/dictionaries/IPALBA/pdf_dir/%E3%81%97%E3%81%9F%E3%81%97%E3%81%84.pdf', note: 'NINJAL IPAL: 親しい describes people who know one another well and are on good terms.' },
    { type: 'dictionary', url: 'https://kotobank.jp/word/%E8%A9%B0%E3%82%81%E3%82%8B-572623', note: 'Digital Daijisen: place objects into a container so it is full/tightly packed; example 衣装を詰めた鞄.' },
    { type: 'dictionary', url: 'https://kotobank.jp/word/%E7%B5%A6%E4%BB%98-52186', note: 'Digital Daijisen: 給付 means to provide/disburse money or goods; used as a boundary for interpreting 支給 without claiming it applies only to money.' },
  ],
}

fs.mkdirSync('reports/n3-quality-audit', { recursive: true })
fs.writeFileSync(mainPath, `${JSON.stringify(mainExams, null, 2)}\n`, 'utf8')
fs.writeFileSync(sectionPath, `${JSON.stringify(sectionExams, null, 2)}\n`, 'utf8')
fs.writeFileSync(curatedPath, `${JSON.stringify(curated, null, 2)}\n`, 'utf8')
fs.writeFileSync(reportPath, `${JSON.stringify(report, null, 2)}\n`, 'utf8')
console.log(`Aligned and reviewed ${sourceDiffs.length} questions; answer keys changed: ${report.answerKeysChanged}.`)
