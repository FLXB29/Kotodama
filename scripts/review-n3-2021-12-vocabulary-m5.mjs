import fs from 'node:fs'

const mainPath = 'data/jlpt_n3_toan_master.json'
const sectionPath = 'data/jlpt_full_master.json'
const curatedPath = 'data/jlpt_n3_explanations_curated.json'
const reportPath = 'reports/n3-quality-audit/vocabulary-2021-12-m5-review.json'

const readJson = (path) => JSON.parse(fs.readFileSync(path, 'utf8'))
const mainExams = readJson(mainPath)
const sectionExams = readJson(sectionPath)
const curated = readJson(curatedPath)

const expectedAnswers = { 31: 1, 32: 3, 33: 1, 34: 3, 35: 4 }
const explanations = {
  31: `Đáp án 1 — 集合（しゅうごう）する là tập hợp hoặc tụ họp tại một địa điểm đã hẹn.
Dịch: “Ngày mai hãy tập trung trước nhà ga lúc 7 giờ.”
1. 「あしたは駅前に7時に集合してください」: “Ngày mai hãy tập trung trước nhà ga lúc 7 giờ.” 集合する dùng đúng khi hẹn một nhóm người tập trung tại một nơi.
2. 「短時間に雨が集合してふった」: “Trong thời gian ngắn, mưa tập hợp rồi rơi.” Với mưa dồn xuống trong thời gian ngắn, cách nói phù hợp là 「雨が集中して降る」; nói mưa rơi to là 「雨が強く降る」.
3. 「この店にはおいしいワインが集合している」: “Ở cửa hàng này, rượu vang ngon đang tụ họp.” Trong ngữ cảnh cửa hàng có nhiều lựa chọn, thường nói 「ワインがそろっている」; 集合する thường dùng cho nhóm được hẹn tập trung.
4. 「私の趣味は切手を集合することです」: “Sở thích của tôi là tập hợp tem.” Sưu tập tem là 「切手を集める／収集する」; 集合 không dùng với を theo nghĩa sưu tập ở đây.
Ghi nhớ: người tụ họp là 集合する; sự việc dồn tập trung là 集中する; sưu tập đồ vật là 集める／収集する.`,
  32: `Đáp án 3 — 中古（ちゅうこ）là đã qua sử dụng; thường đi với đồ vật như xe, máy ảnh hoặc thiết bị.
Dịch: “Nếu đến cửa hàng đó, bạn có thể mua máy ảnh cũ với giá rẻ.”
1. 「これは中古の卵なので、早く食べたほうがいいですね」: “Đây là trứng đã qua sử dụng nên ăn sớm thì hơn.” 中古 dùng cho đồ đã dùng rồi, không tự nhiên để mô tả trứng thực phẩm; nói trứng để lâu là 「古い卵」 hoặc 「残った卵」 tùy ý.
2. 「彼女は、子どものころから仲良くしている中古の友達です」: “Cô ấy là người bạn ‘đã qua sử dụng’ mà tôi thân từ nhỏ.” Bạn thân quen từ nhỏ là 「昔からの友達」 hoặc 「幼なじみ」, không phải 中古の友達.
3. 「あの店に行けば、中古のカメラが安く買えますよ」: “Đến cửa hàng kia thì có thể mua máy ảnh đã qua sử dụng với giá rẻ.” 中古のカメラ là cách kết hợp đúng.
4. 「ここでアルバイトを始めてから3年なので、私は中古の店員です」: “Tôi làm thêm ở đây được ba năm nên là nhân viên ‘đã qua sử dụng’.” Nhân viên giàu kinh nghiệm là 「ベテランの店員」.
Ghi nhớ: 中古 mô tả đồ vật đã qua sử dụng; người có nhiều kinh nghiệm là ベテラン; người bạn quen từ nhỏ là 幼なじみ.`,
  33: `Đáp án 1 — 追い抜く（おいぬく）là đuổi kịp người/vật phía trước rồi vượt lên.
Dịch: “Khi vượt người chạy phía trước trong cuộc đua marathon, cánh tay chúng tôi đã va vào nhau.”
1. 「マラソンで前の人を追い抜くときに、腕がぶつかってしまった」: “Khi vượt người chạy phía trước trong marathon, cánh tay đã va vào nhau.” 追い抜く dùng đúng với người đang chạy phía trước.
2. 「この山を追い抜いたら、向こうに海が見えると思います」: “Nếu vượt qua ngọn núi này, tôi nghĩ phía bên kia sẽ nhìn thấy biển.” Với núi hoặc chướng ngại vật, dùng 「山を越える」.
3. 「この国では二十歳を追い抜くと、もう大人だ」: “Ở đất nước này, khi vượt qua tuổi 20 thì đã là người lớn.” Với mốc tuổi đã qua, dùng 「二十歳を過ぎる」.
4. 「12時を追い抜いたので、お昼ご飯にしましょう」: “Vì đã vượt qua 12 giờ nên chúng ta ăn trưa thôi.” Với thời gian, dùng 「12時を過ぎた」.
Ghi nhớ: 追い抜く là vượt một người/vật đang ở phía trước; 越える là vượt qua núi hoặc vật cản; 過ぎる dùng với thời gian và mốc tuổi.`,
  34: `Đáp án 3 — 見本（みほん）là mẫu hoặc ví dụ cụ thể để xem và làm theo.
Dịch: “Ở đây có mẫu cách điền đơn đăng ký, bạn hãy tham khảo.”
1. 「今度のスピーチ大会には、川井さんが学校の見本で出るそうだ」: “Nghe nói Kawai sẽ tham gia cuộc thi hùng biện với tư cách ‘mẫu’ của trường.” Người đại diện cho trường là 「学校の代表として出る」.
2. 「私の兄は、日本人の見本の身長より10センチくらい高い」: “Anh tôi cao hơn chiều cao ‘mẫu’ của người Nhật khoảng 10 cm.” Chiều cao trung bình là 「日本人の平均身長」.
3. 「ここに申込書の書き方の見本があるので、参考にしてください」: “Ở đây có mẫu cách điền đơn đăng ký, hãy dùng để tham khảo.” 見本 diễn tả đúng mẫu/ví dụ để làm theo.
4. 「ギターを弾くのが初めての人は、見本から教えてもらえます」: “Người lần đầu chơi guitar có thể được dạy bắt đầu từ ‘mẫu’.” Nếu nói học từ phần cơ bản, dùng 「基本から教えてもらう」.
Ghi nhớ: 見本 là mẫu tham khảo; 代表 là người đại diện; 平均 là mức trung bình; 基本 là nền tảng/cơ bản.`,
  35: `Đáp án 4 — だるい diễn tả cơ thể mệt mỏi, nặng nề hoặc thiếu sức lực.
Dịch: “Người mệt rã rời nên tôi không thể dậy.”
1. 「このスープは味がだるいから、塩を足したほうがいい」: “Món súp này có vị ‘uể oải’ nên thêm muối thì hơn.” Trong cách nói thông thường, vị nhạt là 「味が薄い」; だるい thường diễn tả trạng thái cơ thể, không phải vị súp.
2. 「ダイエットをしたら、スカートがだるくなった」: “Sau khi ăn kiêng, chiếc váy trở nên ‘mệt mỏi’.” Quần áo bị rộng là 「スカートがゆるくなった」.
3. 「レポートが終わったら少しだるくしたい」: “Làm xong báo cáo, tôi muốn khiến mình hơi uể oải.” Nếu muốn nói nghỉ ngơi/thư giãn một chút, dùng 「少し休みたい」 hoặc 「ゆっくりしたい」.
4. 「体がだるくて起きられない」: “Cơ thể mệt nặng nên không thể dậy.” 体がだるい là cách kết hợp tự nhiên và phù hợp.
Ghi nhớ: だるい = cơ thể uể oải; 味が薄い = vị nhạt; ゆるい = rộng/lỏng; 休む = nghỉ ngơi.`,
}

const findQuestion = (exam, number) => exam.parts.flatMap((part) => part.questions || []).find((question) => Number(question.number) === number)
const mainExam = mainExams.find(({ id }) => id === 'toan-n3-202112-full')
const sectionExam = sectionExams.find(({ id }) => id === 'cm2u2xosv0138134ib0bvpy32-vocab')
if (!mainExam || !sectionExam) throw new Error('Missing December 2021 N3 mock exam or standalone vocabulary section')

const sourceDiffs = []
for (const [numberText, expectedAnswer] of Object.entries(expectedAnswers)) {
  const number = Number(numberText)
  const mainQuestion = findQuestion(mainExam, number)
  const sectionQuestion = findQuestion(sectionExam, number)
  if (!mainQuestion || !sectionQuestion) throw new Error(`Missing M5 question ${number}`)
  if (Number(mainQuestion.correctAnswer ?? mainQuestion.answer) !== expectedAnswer) throw new Error(`Unexpected mock key for question ${number}`)
  if (String(sectionQuestion.answer ?? sectionQuestion.correctAnswer) !== String(expectedAnswer)) throw new Error(`Unexpected standalone key for question ${number}`)
  if (mainQuestion.options.length !== 4 || sectionQuestion.options.length !== 4) throw new Error(`Question ${number} must have four choices in both records`)

  const optionText = (option) => String(typeof option === 'object' && option ? option.text : option)
  const normalize = (value) => String(value).normalize('NFKC').replace(/^\s*[1-4](?:[.)．、]\s*|\s+)/u, '').replace(/[\s　]/gu, '').replace(/[。.]+$/u, '')
  const mainOptions = mainQuestion.options.map(optionText)
  const sectionOptions = sectionQuestion.options.map(optionText)
  const mismatches = mainOptions.map((text, index) => normalize(text) !== normalize(sectionOptions[index]))
  if (mismatches.some(Boolean)) throw new Error(`Question ${number} options differ between full and standalone data`)

  mainQuestion.explanation = explanations[number]
  sectionQuestion.explanation = explanations[number]
  curated[mainQuestion.id] = explanations[number]
  sourceDiffs.push({ question: number, key: expectedAnswer, questionIds: { mock: mainQuestion.id, section: sectionQuestion.id }, priorOptionDifferences: mismatches })
}

const report = {
  exam: 'JLPT N3 2021/12 — vocabulary Mondai 5, questions 31–35',
  reviewDate: '2026-09-27',
  answerKeysChanged: 0,
  answers: expectedAnswers,
  rationale: 'Preserved answer keys 1–3–1–3–4. The explanations now translate the full correct sentence and all four options, identify the word usage in each distractor, and provide a short usage contrast. The q31 question text is retained as 7時 because several question transcriptions show 7時, while some answer/recollection pages show 10時; the original scan was not available to resolve this conflict.',
  sourceDiffs,
  sourceConflicts: [
    { question: 31, option: 1, variants: ['7時 (multiple question transcriptions)', '10時 (some answer/recollection references)'], decision: 'Keep 7時 in the question text because it is corroborated by multiple question-paper transcriptions; do not silently alter it based on answer-key/recollection pages. This remains unverified against an original scan.' },
  ],
  limitations: [
    'The available answer references are secondary references, not an official JLPT key.',
    'No original JLPT question scan was available for direct visual verification; q31 has an unresolved 7時／10時 transcription conflict.',
    'The distractor explanations describe the intended standard usage and replacements; they do not claim every sentence could never be interpreted in any context.',
  ],
  sources: [
    { type: 'exam-transcription', url: 'https://www.scribd.com/document/1047321670/N3-T12-2021-Final-Version', note: 'Public transcription of the December 2021 questions; q31 option 1 is transcribed with 7時. Not an official or original scan.' },
    { type: 'exam-transcription-cross-check', url: 'https://www.scribd.com/document/1068037765/Jlpt-n3-2021-December', note: 'Another public transcription also gives 7時 for q31. Not an official or original scan.' },
    { type: 'answer-key', url: 'https://trynihongo.com/zh/dap-an-ky-thi-jlpt-n3-thang-122021-p809', note: 'Public reference answers give the M5 key and show 10時 for q31 option 1; this conflicts with multiple question transcriptions. Not an official key.' },
    { type: 'answer-key-cross-check', url: 'https://jp-files.riyutool.com/%E8%80%83%E8%AF%95%E7%9C%9F%E9%A2%98/N3/2021.12/2021%E5%B9%B412%E6%9C%88N3%E7%AD%94%E6%A1%88%E4%B8%8E%E8%A7%A3%E6%9E%90%40x9az%40.pdf', note: 'After-exam recollection PDF provides explanations for 集合, 中古, 追い抜く, 見本, and だるい; it is not an official source and also shows 10時 for q31.' },
    { type: 'dictionary', url: 'https://kotobank.jp/word/%E9%9B%86%E5%90%88-4409', note: 'Digital Daijisen: 集合 means people/things gather at one place; includes 駅前に八時に集合する.' },
    { type: 'dictionary', url: 'https://kotobank.jp/word/%E9%9B%86%E4%B8%AD-527265', note: 'Digital Daijisen: 集中 is gathering/concentrating at one place or focus.' },
    { type: 'dictionary', url: 'https://kotobank.jp/word/%E4%B8%AD%E5%8F%A4-567365', note: 'Digital Daijisen: 中古 describes something used and somewhat old; examples include 中古のカメラ.' },
    { type: 'dictionary', url: 'https://kotobank.jp/word/%E8%BF%BD%E6%8A%9C%E3%81%8F-448551', note: 'Digital Daijisen: 追い抜く means catch up with something ahead and go past it.' },
    { type: 'dictionary', url: 'https://kotobank.jp/word/%E8%A6%8B%E6%9C%AC-639559', note: 'Digital Daijisen: 見本 is a sample or concrete example to follow.' },
    { type: 'dictionary', url: 'https://kotobank.jp/word/%E6%80%A0%E3%81%84-563322', note: 'Digital Daijisen: だるい commonly describes a body that feels heavy or reluctant to move because of fatigue or illness.' },
  ],
}

fs.mkdirSync('reports/n3-quality-audit', { recursive: true })
fs.writeFileSync(mainPath, `${JSON.stringify(mainExams, null, 2)}\n`, 'utf8')
fs.writeFileSync(sectionPath, `${JSON.stringify(sectionExams, null, 2)}\n`, 'utf8')
fs.writeFileSync(curatedPath, `${JSON.stringify(curated, null, 2)}\n`, 'utf8')
fs.writeFileSync(reportPath, `${JSON.stringify(report, null, 2)}\n`, 'utf8')
console.log(`Reviewed and synchronized ${sourceDiffs.length} questions; answer keys changed: ${report.answerKeysChanged}.`)
