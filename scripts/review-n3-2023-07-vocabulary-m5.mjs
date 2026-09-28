import fs from 'node:fs'

const mainPath = 'data/jlpt_n3_toan_master.json'
const sectionPath = 'data/jlpt_full_master.json'
const curatedPath = 'data/jlpt_n3_explanations_curated.json'
const reportPath = 'reports/n3-quality-audit/vocabulary-2023-07-m5-review.json'

const readJson = (path) => JSON.parse(fs.readFileSync(path, 'utf8'))
const mainExams = readJson(mainPath)
const sectionExams = readJson(sectionPath)
const curated = readJson(curatedPath)

const expectedAnswers = { 31: 2, 32: 1, 33: 3, 34: 2, 35: 4 }
const sourceOptions = {
  31: [
    '1 この会社は社長が一人で始めたが、今は大きな会社に進歩した。',
    '2 技術が進歩して、人々の生活は便利になった。',
    '3 病気が治って、食欲もだんだん進歩してきた。',
    '4 アパートの家賃が進歩して、来年から 5,000 円高くなるそうだ。',
  ],
  32: [
    '1 昨日、駅で観光客に英語で話しかけられた。',
    '2 次の旅行の行き先は、家族と話しかけて決めようと思う。',
    '3 名前を話しかけるので、呼ばれた人は手を挙げてください。',
    '4 先輩にお土産をあげて、お礼を話しかけられました。',
  ],
  33: [
    '1 二つの色が交流して、きれいなピンク色になりました。',
    '2 このドレッシングは、野菜と交流するとおいしいですね。',
    '3 息子の学校は、海外の人たちと交流する機会が多いようだ。',
    '4 この引き出しには、兄の物と私の物が交流している。',
  ],
  34: [
    '1 新しい家の工事が渋滞していて、なかなか引っ越せない。',
    '2 事故で道が渋滞していたので、遅刻してしまった。',
    '3 最近仕事が忙しくて、ストレスが渋滞している。',
    '4 この商品はあまり売れないので、倉庫の中で渋滞している。',
  ],
  35: [
    '1 ガソリンが少なくなって、車が途中で止まりそうでにこにこした。',
    '2 大勢の前で歌ったとき、緊張して胸がにこにこした。',
    '3 昨日から具合が悪くて、今朝も頭が少しにこにこしている。',
    '4 遊んでいる私たちを見て、祖母はうれしそうににこにこしていた。',
  ],
}

const revisedQ35 = `Đáp án tham khảo 4 — にこにこ diễn tả vẻ mặt mỉm cười vui vẻ. 「遊んでいる私たちを見て、祖母はうれしそうににこにこしていた」 nghĩa là “Nhìn chúng tôi đang chơi, bà mỉm cười vui vẻ”. Chủ thể 祖母 được nêu rõ, còn うれしそうに cho biết nụ cười thể hiện niềm vui.
1. 「ガソリンが少なくなって、車が途中で止まりそうでにこにこした」: “Xăng đã vơi, xe có vẻ sắp dừng giữa đường nên [ai đó] mỉm cười.” Chủ thể của にこにこした bị lược bỏ; không nên hiểu là chiếc xe đang cười. Câu vẫn có thể hiểu nếu người nói là chủ thể và cười trong tình huống đó, nhưng phản ứng ấy không hợp lý trong ngữ cảnh thông thường, nên đây không phải cách dùng phù hợp nhất.
2. 「大勢の前で歌ったとき、緊張して胸がにこにこした」: “Khi hát trước đông người, tôi hồi hộp và ngực mỉm cười.” にこにこ không kết hợp với 胸. Hồi hộp, tim đập mạnh nói 胸がどきどきする.
3. 「昨日から具合が悪くて、今朝も頭が少しにこにこしている」: “Từ hôm qua tôi đã không khỏe, sáng nay đầu vẫn ‘mỉm cười’ một chút.” Đau đầu nói 頭が痛む／ずきずきする, không dùng にこにこ.
4. Nhìn chúng tôi chơi, bà mỉm cười vui vẻ: にこにこする dùng tự nhiên cho nét mặt của người.
Ghi nhớ: にこにこ = mỉm cười vui vẻ; 胸がどきどきする = tim đập hồi hộp; 頭がずきずきする = đầu đau nhói/giật từng cơn.`

const findQuestion = (exam, number) => exam.parts.flatMap((part) => part.questions || []).find((question) => Number(question.number) === number)
const mainExam = mainExams.find(({ id }) => id === 'toan-n3-202307-full')
const sectionExam = sectionExams.find(({ id }) => id === 'cm2u2y1xl01d2134ilubjx79d-vocab')
if (!mainExam || !sectionExam) throw new Error('Missing July 2023 N3 mock exam or standalone vocabulary section')

const sourceDiffs = []
for (const [numberText, expectedAnswer] of Object.entries(expectedAnswers)) {
  const number = Number(numberText)
  const mainQuestion = findQuestion(mainExam, number)
  const sectionQuestion = findQuestion(sectionExam, number)
  if (!mainQuestion || !sectionQuestion) throw new Error(`Missing question ${number}`)
  if (Number(mainQuestion.correctAnswer ?? mainQuestion.answer) !== expectedAnswer) throw new Error(`Unexpected mock key for question ${number}`)
  if (String(sectionQuestion.answer ?? sectionQuestion.correctAnswer) !== String(expectedAnswer)) throw new Error(`Unexpected standalone key for question ${number}`)
  if (sourceOptions[number].length !== 4) throw new Error(`Question ${number} must have four source choices`)

  const oldMainOptions = mainQuestion.options.map((option) => typeof option === 'string' ? option : option.text)
  const oldSectionOptions = sectionQuestion.options.map((option) => typeof option === 'string' ? option : option.text)
  mainQuestion.options = sourceOptions[number]
  sectionQuestion.options = sourceOptions[number].map((text, index) => ({
    ...(typeof sectionQuestion.options[index] === 'object' ? sectionQuestion.options[index] : { id: String(index + 1) }),
    text: text.replace(/^\s*[1-4][.)．、\s　]*/u, ''),
  }))

  const explanation = number === 35
    ? revisedQ35
    : mainQuestion.explanation.replace(/^Đáp án ([1-4])/u, 'Đáp án tham khảo $1')
  if (!explanation) throw new Error(`Missing reviewed mock explanation for question ${number}`)
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
  exam: 'JLPT N3 2023/07 — vocabulary Mondai 5, questions 31–35',
  reviewDate: '2026-09-27',
  answerKeysChanged: 0,
  answers: expectedAnswers,
  rationale: 'Preserved keys 2–1–3–2–4, corroborated by two public third-party answer references; no official JLPT key was located. The standalone section had blank explanations and OCR variants in questions 31 and 33. Question 35 option 1 is treated as contextually odd rather than grammatically impossible: the subject of にこにこした is omitted and would ordinarily be a person, not the car.',
  sourceDiffs,
  sources: [
    { type: 'exam-transcription', url: 'https://learnjapaneseaz.com/jlpt-n3-vocabulary-test-26.html', note: 'Public transcription of July 2023 N3 M5 questions 31–35 and answer sequence; not an official JLPT publication.' },
    { type: 'exam-transcription-cross-check', url: 'https://trynihongo.com/en/jlpt-vocabulary-n3-test-july-2023-q1335', note: 'Independent question transcription; contains OCR-like glyph errors in q33, so its garbled spellings were not copied.' },
    { type: 'answer-key-cross-check', url: 'https://nihongoaz.com/jlpt-n3-vocabulary-7-2023.html', note: 'Second public answer reference for the sequence 2–1–3–2–4; not an official JLPT key.' },
    { type: 'dictionary', url: 'https://kotobank.jp/word/%E9%80%B2%E6%AD%A9-169808', note: 'Digital Daijisen: 進歩 is movement toward a better or more desirable state; examples include 技術が進歩する.' },
    { type: 'dictionary', url: 'https://kotobank.jp/word/%E8%A9%B1%E3%81%97%E6%8E%9B%E3%81%91%E3%82%8B-603493', note: 'Digital Daijisen: 話しかける means addressing someone or initiating speech; example 英語で話しかけられる.' },
    { type: 'dictionary', url: 'https://kotobank.jp/word/%E4%BA%A4%E6%B5%81-63363', note: 'Digital Daijisen: 交流 describes people, regions or organizations interacting and exchanging things.' },
    { type: 'dictionary', url: 'https://kotobank.jp/word/%E6%B8%8B%E6%BB%9E-527172', note: 'Digital Daijisen entry for 渋滞 and its use for movement that does not proceed smoothly.' },
    { type: 'dictionary', url: 'https://kotobank.jp/word/%E3%81%AB%E3%81%93%E3%81%AB%E3%81%93-591473', note: 'Digital Daijisen entry for にこにこ, the adverb for smiling cheerfully.' },
  ],
}

fs.writeFileSync(mainPath, `${JSON.stringify(mainExams, null, 2)}\n`, 'utf8')
fs.writeFileSync(sectionPath, `${JSON.stringify(sectionExams, null, 2)}\n`, 'utf8')
fs.writeFileSync(curatedPath, `${JSON.stringify(curated, null, 2)}\n`, 'utf8')
fs.writeFileSync(reportPath, `${JSON.stringify(report, null, 2)}\n`, 'utf8')
console.log(`Aligned and reviewed ${sourceDiffs.length} questions; answer keys changed: ${report.answerKeysChanged}.`)
