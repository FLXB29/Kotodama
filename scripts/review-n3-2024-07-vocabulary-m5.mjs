import fs from 'node:fs'

const toanPath = 'data/jlpt_n3_toan_master.json'
const sectionPath = 'data/jlpt_full_master.json'
const curatedPath = 'data/jlpt_n3_explanations_curated.json'
const reportPath = 'reports/n3-quality-audit/vocabulary-2024-07-m5-review.json'
const sourcePdf = 'https://www.tiengnhatdongian.com/wp-content/uploads/2024/07/De-thi-JLPT-chinh-thuc-N3-thang-7_2024.pdf'
const answerPdf = 'https://vtimirai.edu.vn/upload/files/De%20thi%20N3/%C4%90%C3%A1p%20%C3%A1n%20N3%20T7-2024%20Ver%202_0.pdf'

const readJson = (path) => JSON.parse(fs.readFileSync(path, 'utf8'))
const toan = readJson(toanPath)
const sections = readJson(sectionPath)
const curated = readJson(curatedPath)

const options = {
  31: [
    '1　いつ財布を落としたか知識がありません。',
    '2　はさみがどこにあるか知識がありますか。',
    '3　パーティーには私の知識がない人も大勢来ていた。',
    '4　その仕事は医学の知識がないとできない。',
  ],
  32: [
    '1　台所からおいしそうなにおいがひびいている。',
    '2　この技術は100年くらい前に外国からひびいたものだ。',
    '3　この広場で歌を歌うと声がよくひびく。',
    '4　社長が代わるといううわさが会社内でひびいている。',
  ],
  33: [
    '1　みんなの意見が一つに完成したので、これから発表します。',
    '2　娘は子どものころからの夢が完成して医者になった。',
    '3　親戚の結婚が完成したので、お祝いを贈ろうと思います。',
    '4　今建てている家が完成したら、ぜひ遊びに来てください。',
  ],
  34: [
    '1　昨日大雨が降ったので、今日は川の水があわてて流れている。',
    '2　寝坊をして、あわてて家を出たので、携帯電話を忘れてきてしまった。',
    '3　マラソン大会で優勝するため、私はゴールまであわてて走り続けた。',
    '4　あのレストランは人気があるので、お店の人はいつもあわてて働いている。',
  ],
  35: [
    '1　服はインターネットの写真だけではなく、実物を見てから買いたい。',
    '2　そのときは彼女の実物の気持ちが分からなかった。',
    '3　デパートで買い物したとき、実物が足りなかったので、クレジットカードで払った。',
    '4　緊張したので発表のときは失敗しましたが、実物はもっと上手にできます。',
  ],
}

const explanations = {
  31: `Đáp án tham khảo 4 — 知識（ちしき）là kiến thức hoặc điều mình hiểu về một lĩnh vực. Câu 「その仕事は医学の知識がないとできない」 nghĩa là “Không có kiến thức y học thì không thể làm công việc đó”; 医学の知識 là kết hợp tự nhiên.
1. 「いつ財布を落としたか知識がありません」: “Tôi không biết mình đã đánh rơi ví lúc nào.” Với việc nhớ/biết một sự việc cụ thể, dùng 覚えていません・分かりません; 知識 không có nghĩa là trí nhớ.
2. 「はさみがどこにあるか知識がありますか」: “Bạn có biết cái kéo ở đâu không?” Hỏi vị trí của một vật thường dùng どこにあるか知っていますか／分かりますか, không nói có 知識 về vị trí.
3. 「パーティーには私の知識がない人も大勢来ていた」: “Trong tiệc cũng có nhiều người mà tôi không quen.” Câu muốn nói “người tôi không biết” thì dùng 私の知らない人; 知識 là kiến thức, không thể thay cho 知らない trong cụm này.
4. “Công việc đó không thể làm nếu không có kiến thức y học”: 医学の知識 là cách dùng đúng.
Ghi nhớ: 知識 = kiến thức; 知っている／知らない = biết／không biết người hoặc sự việc.`,
  32: `Đáp án tham khảo 3 — 響く（ひびく） thường nói âm thanh/giọng vang ra hoặc dội lại. Câu 「この広場で歌を歌うと声がよくひびく」 nghĩa là “Khi hát ở quảng trường này, giọng vang rất rõ”, là cách kết hợp tự nhiên.
1. 「台所からおいしそうなにおいがひびいている」: “Từ bếp có mùi thơm ngon đang vang ra.” Mùi tỏa đến thì nói においがする／漂ってくる; 響く chủ yếu dùng cho âm thanh, tiếng động hoặc sự rung.
2. 「この技術は100年くらい前に外国からひびいたものだ」: “Công nghệ này vang đến từ nước ngoài khoảng 100 năm trước.” Ý nói kỹ thuật được truyền đến là 外国から伝わったもの.
3. “Khi hát ở quảng trường này, giọng vang rất rõ”: 声が響く là kết hợp đúng.
4. 「社長が代わるといううわさが会社内でひびいている」: “Tin đồn giám đốc thay đổi đang vang khắp công ty.” Tin đồn lan trong công ty thường nói うわさが会社内に広まっている. Cách nói với 響く có thể gợi nghĩa bóng “vang vọng”, nhưng đây không phải cách diễn đạt thông thường cho tin đồn trong câu này.
Ghi nhớ: âm thanh vang là 響く; thông tin/tin đồn lan ra là 伝わる／広まる.`,
  33: `Đáp án tham khảo 4 — 完成（かんせい） là hoàn tất, làm xong một vật, sản phẩm hoặc công trình. 「今建てている家が完成したら、ぜひ遊びに来てください」 nghĩa là “Khi ngôi nhà đang xây hoàn thành, nhất định hãy đến chơi”; 家が完成する là cách dùng tự nhiên.
1. 「みんなの意見が一つに完成した」: “Ý kiến mọi người hoàn thành thành một.” Ý kiến thống nhất/hội tụ thì nói 意見が一つにまとまった; 完成 không dùng theo nghĩa đó.
2. 「娘は子どものころからの夢が完成して医者になった」: “Ước mơ từ nhỏ của con gái hoàn thành nên cô ấy trở thành bác sĩ.” Ước mơ thành hiện thực là 夢がかなう／実現する.
3. 「親戚の結婚が完成した」: “Cuộc hôn nhân của họ hàng được hoàn tất.” Nói họ hàng kết hôn là 親戚が結婚した; 完成 không kết hợp tự nhiên với 結婚.
4. “Khi ngôi nhà đang xây hoàn thành thì hãy đến chơi”: 完成する dùng đúng cho công trình.
Ghi nhớ: công trình/sản phẩm hoàn tất là 完成する; ý kiến hội tụ là まとまる; ước mơ thành hiện thực là かなう／実現する.`,
  34: `Đáp án tham khảo 2 — あわてる là mất bình tĩnh trước việc bất ngờ; dạng あわてて＋động từ cũng có nghĩa là vội vã làm việc gì. Câu 「寝坊をして、あわてて家を出たので、携帯電話を忘れてきてしまった」 nghĩa là “Vì ngủ quên nên tôi cuống cuồng ra khỏi nhà và bỏ quên điện thoại”; nguyên nhân và hành động khớp rõ ràng.
1. 「今日は川の水があわてて流れている」: “Hôm nay nước sông đang cuống cuồng chảy.” あわてる diễn tả phản ứng của người/con vật; nước chảy mạnh thì nói 水が勢いよく流れる.
2. “Vì ngủ quên nên cuống cuồng ra khỏi nhà và để quên điện thoại”: あわてて家を出る dùng đúng.
3. 「優勝するため、ゴールまであわてて走り続けた」: “Để vô địch, tôi cuống cuồng chạy đến đích.” Nếu cố ý chạy hết sức để thắng, tự nhiên hơn là 全力で走る; あわてて hợp hơn khi có sự cuống quýt.
4. 「人気があるので、お店の人はいつもあわてて働いている」: “Vì nhà hàng nổi tiếng nên nhân viên lúc nào cũng vội cuống cuồng làm việc.” Câu này có thể dùng nếu nhân viên thực sự rối/vội; trong ngữ cảnh chỉ nêu nhà hàng đông/nổi tiếng, 忙しく働いている tự nhiên hơn. Vì vậy 2 là đáp án phù hợp nhất theo khóa tham khảo, nhưng không nên coi あわてて働く là sai trong mọi hoàn cảnh.
Ghi nhớ: bất ngờ làm mất bình tĩnh hoặc cuống lên làm gấp là あわてる／あわてて; bận rộn là 忙しい; chạy hết sức là 全力で走る.`,
  35: `Đáp án tham khảo 1 — 実物（じつぶつ） là vật thật/hiện vật thực tế, đối lập với ảnh, hình minh họa hoặc mô hình. 「服はインターネットの写真だけではなく、実物を見てから買いたい」 nghĩa là “Tôi muốn xem quần áo ngoài đời thật rồi mới mua, chứ không chỉ nhìn ảnh trên mạng.”
1. “Tôi muốn xem món đồ thật trước khi mua, không chỉ nhìn ảnh trên mạng”: 実物 là món đồ thật.
2. 「そのときは彼女の実物の気持ちが分からなかった」: “Lúc ấy tôi không hiểu cảm xúc ‘vật thật’ của cô ấy.” Muốn nói cảm xúc thật/lòng thật thì dùng 本当の気持ち／本心.
3. 「実物が足りなかったので、クレジットカードで払った」: “Vì vật thật không đủ nên đã trả bằng thẻ tín dụng.” Ngữ cảnh thanh toán cần 現金が足りなかった (không đủ tiền mặt), không phải 実物.
4. 「発表のときは失敗しましたが、実物はもっと上手にできます」: “Tôi đã thất bại khi thuyết trình, nhưng ‘vật thật’ có thể làm tốt hơn.” PDF in 実物; từ này chỉ đồ vật nên không thể chỉ phần thuyết trình. Nếu muốn nói lần biểu diễn/thực hiện thật thì 本番はもっと上手にできる sẽ hợp nghĩa.
Ghi nhớ: 実物 = đồ vật thật; 本心／本当の気持ち = cảm xúc thật; 現金 = tiền mặt; 本番 = lúc thi/biểu diễn thật.`,
}

const answerKeys = { 31: 4, 32: 3, 33: 4, 34: 2, 35: 1 }
const exam = toan.find(({ id }) => id === 'toan-n3-202407-full')
const section = sections.find(({ id }) => id === 'cm2u2yale01jo134i8wwru1oo-vocab')
if (!exam || !section) throw new Error('Missing July 2024 N3 mock exam or standalone vocabulary section')
const findNumber = (record, number) => record.parts.flatMap((part) => part.questions || []).find((question) => Number(question.number) === number)

const sourceDiffs = []
for (const number of Object.keys(answerKeys).map(Number)) {
  const mainQuestion = findNumber(exam, number)
  const sectionQuestion = findNumber(section, number)
  if (!mainQuestion || !sectionQuestion) throw new Error(`Missing question ${number}`)
  if (Number(mainQuestion.correctAnswer ?? mainQuestion.answer) !== answerKeys[number]) throw new Error(`Unexpected keyed answer for question ${number}`)
  if (String(sectionQuestion.answer ?? sectionQuestion.correctAnswer) !== String(answerKeys[number])) throw new Error(`Unexpected standalone key for question ${number}`)

  const before = {
    main: mainQuestion.options.map((option) => typeof option === 'string' ? option : option.text),
    section: sectionQuestion.options.map((option) => typeof option === 'string' ? option : option.text),
  }
  mainQuestion.options = options[number]
  sectionQuestion.options = options[number].map((text, index) => ({
    ...(typeof sectionQuestion.options[index] === 'object' ? sectionQuestion.options[index] : { id: String(index + 1) }),
    text: text.replace(/^\s*[1-4][.)．、\s　]*/u, ''),
  }))
  const explanation = explanations[number]
  mainQuestion.explanation = explanation
  sectionQuestion.explanation = explanation
  curated[mainQuestion.id] = explanation
  sourceDiffs.push({
    number,
    questionIds: { mock: mainQuestion.id, section: sectionQuestion.id },
    key: answerKeys[number],
    priorOptionTextDifferences: before.main.map((old, index) => old.replace(/^\s*[1-4][.)．、\s　]*/u, '').replace(/[\s　]/gu, '') !== options[number][index].replace(/^\s*[1-4][.)．、\s　]*/u, '').replace(/[\s　]/gu, '') || before.section[index].replace(/^\s*[1-4][.)．、\s　]*/u, '').replace(/[\s　]/gu, '') !== options[number][index].replace(/^\s*[1-4][.)．、\s　]*/u, '').replace(/[\s　]/gu, '')),
  })
}

const report = {
  exam: 'JLPT N3 2024/07 — vocabulary Mondai 5, questions 31–35',
  reviewDate: '2026-09-27',
  answerKeysChanged: 0,
  answers: answerKeys,
  rationale: 'Keys are preserved from the existing corpus and corroborated by a third-party answer sheet; this is not an official JLPT key. The exam wording is aligned to the Kosei-hosted PDF transcription linked below. Ambiguity is called out in q32 option 4 and q34 option 4 rather than overstating that those strings are impossible in every context.',
  sourceDiffs,
  sources: [
    { type: 'exam-text', url: sourcePdf, note: 'Kosei-hosted N3 July 2024 PDF, pages 2–3, questions 31–35; source transcription used to align all option text.' },
    { type: 'answer-key', url: answerPdf, note: 'Independent third-party answer PDF, page 1, Mondai 5 sequence 4–3–4–2–1; answer keys remain unverified as official.' },
    { type: 'dictionary', url: 'https://kotobank.jp/word/%E7%9F%A5%E8%AD%98-96098', note: 'Digital Daijisen entry for 知識.' },
    { type: 'dictionary', url: 'https://kotobank.jp/word/%E9%9F%BF%E3%81%8F-585232', note: 'Digital Daijisen entry for 響く, including sound spreading/resounding and figurative meanings.' },
    { type: 'dictionary', url: 'https://kotobank.jp/word/%E5%AE%8C%E6%88%90-470378', note: 'Digital Daijisen entry for 完成.' },
    { type: 'dictionary', url: 'https://kotobank.jp/word/%E6%85%8C%E3%81%A6%E3%82%8B-428974', note: 'Digital Daijisen entry for 慌てる, including the “lose composure” and “hurry to do” senses.' },
    { type: 'dictionary', url: 'https://kotobank.jp/word/%E5%AE%9F%E7%89%A9-521685', note: 'Digital Daijisen entry for 実物 (じつぶつ, actual thing/object).' },
    { type: 'usage-reference', url: 'https://www2.ninjal.ac.jp/IPALBV/mibook.html', note: 'NINJAL IPAL example 「世間に噂が広まる」 supports the ordinary collocation for a rumor spreading.' },
  ],
}

fs.writeFileSync(toanPath, `${JSON.stringify(toan, null, 2)}\n`, 'utf8')
fs.writeFileSync(sectionPath, `${JSON.stringify(sections, null, 2)}\n`, 'utf8')
fs.writeFileSync(curatedPath, `${JSON.stringify(curated, null, 2)}\n`, 'utf8')
fs.writeFileSync(reportPath, `${JSON.stringify(report, null, 2)}\n`, 'utf8')
console.log(`Aligned and reviewed ${sourceDiffs.length} questions; answer keys changed: ${report.answerKeysChanged}.`)
