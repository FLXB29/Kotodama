import assert from 'node:assert/strict'
import fs from 'node:fs'
import prettier from 'prettier'

const fullMasterPath = 'data/jlpt_full_master.json'
const mockMasterPath = 'data/jlpt_n3_toan_master.json'
const reportPath = 'reports/n3-quality-audit/section-2019-12-review.json'
const fullMaster = JSON.parse(fs.readFileSync(fullMasterPath, 'utf8'))
const mockMaster = JSON.parse(fs.readFileSync(mockMasterPath, 'utf8'))

const vocabulary = fullMaster.find((exam) => exam.id === 'cm2u2xbu400ta134iaz003jdg-vocab')
const grammarReading = fullMaster.find((exam) => exam.id === 'cm2u2xbu400ta134iaz003jdg-grammar-reading')
const listening = fullMaster.find((exam) => exam.id === 'cm2u2xbu400ta134iaz003jdg-listening')
const fullMock = mockMaster.find((exam) => exam.id === 'toan-n3-201912-full')
assert.ok(vocabulary && grammarReading && listening && fullMock, 'Could not find all December 2019 N3 records.')

const questionNumbers = (part) => (part.questions || []).map((question) => Number(question.number))
const rangeKey = (part) => {
  const numbers = questionNumbers(part)
  return numbers.length ? `${numbers[0]}-${numbers.at(-1)}` : `empty:${part.title}`
}
const byRange = (exam) => new Map(exam.parts.map((part) => [rangeKey(part), part]))
const vocabParts = byRange(vocabulary)
const grammarParts = byRange(grammarReading)
const beforeVocabularyRanges = ['1-8', '9-14', '15-25', '26-30']
const beforeGrammarRanges = ['31-35', '36-48', '49-53', '54-58', '59-62', '63-68', '69-72', '73-74']
const listeningRanges = ['1-6', '7-12', '13-15', '16-19', '20-28']
const vocabularyRanges = [...beforeVocabularyRanges, '31-35']
const grammarReadingRanges = beforeGrammarRanges.slice(1)
const isBeforeRepair =
  JSON.stringify(vocabulary.parts.map(rangeKey)) === JSON.stringify(beforeVocabularyRanges) &&
  JSON.stringify(grammarReading.parts.map(rangeKey)) === JSON.stringify(beforeGrammarRanges) &&
  JSON.stringify(listening.parts.map(rangeKey)) === JSON.stringify(listeningRanges)
const isAlreadyRepaired =
  JSON.stringify(vocabulary.parts.map(rangeKey)) === JSON.stringify(vocabularyRanges) &&
  JSON.stringify(grammarReading.parts.map(rangeKey)) === JSON.stringify(grammarReadingRanges) &&
  JSON.stringify(listening.parts.map(rangeKey)) === JSON.stringify(listeningRanges)
assert.ok(isBeforeRepair || isAlreadyRepaired, 'Unexpected December 2019 section ranges; refusing to rewrite data.')

const movedVocabulary = grammarParts.get('31-35') || vocabParts.get('31-35')
assert.ok(movedVocabulary, 'Missing the misplaced vocabulary questions 31–35.')
const movedQuestions = new Map(movedVocabulary.questions.map((question) => [Number(question.number), question]))
const sectionQuestions = new Map(
  [...vocabulary.parts.flatMap((part) => part.questions || []), ...movedVocabulary.questions].map((question) => [
    Number(question.number),
    question,
  ])
)
const sourceQuestions = [
  {
    number: 1,
    answer: 2,
    question: '10時に<u>予約</u>をお願いします。',
    options: ['ようやく', 'よやく', 'よよく', 'ようよく'],
  },
  {
    number: 2,
    answer: 4,
    question: 'あの頃は私も<u>若かった</u>。',
    options: ['わるかった', 'さむかった', 'こわかった', 'わかかった'],
  },
  {
    number: 3,
    answer: 1,
    question: '<u>上品</u>な人ですね。',
    options: ['じょうひん', 'じょうびん', 'じょひん', 'じょびん'],
  },
  {
    number: 4,
    answer: 2,
    question: '山田さんに<u>助けて</u>もらった。',
    options: ['とどけて', 'たすけて', 'うけて', 'かたづけて'],
  },
  {
    number: 5,
    answer: 3,
    question: '<u>未来</u>を考えてみる。',
    options: ['しょらい', 'しょうらい', 'みらい', 'みいらい'],
  },
  {
    number: 6,
    answer: 1,
    question: 'この電車は<u>各駅</u>に止まります。',
    options: ['かくえき', 'がくえき', 'きゃくえき', 'ぎゃくえき'],
  },
  {
    number: 7,
    answer: 4,
    question: '誰が<u>勝った</u>んですか。',
    options: ['かざった', 'おった', 'のこった', 'かった'],
  },
  {
    number: 8,
    answer: 1,
    question: '彼に初めて会ったときの<u>印象</u>はどうでしたか。',
    options: ['いんしょう', 'いんそう', 'にんしょう', 'にんそう'],
  },
  { number: 9, answer: 4, question: '<u>りゆう</u>はよくわかりません。', options: ['理有', '利由', '自由', '理由'] },
  { number: 10, answer: 3, question: 'この<u>しま</u>には、初めて来ました。', options: ['寺', '村', '島', '庭'] },
  {
    number: 11,
    answer: 4,
    question: '卒業の<u>きねん</u>に写真を撮りました。',
    options: ['気念', '祈念', '木念', '記念'],
  },
  {
    number: 12,
    answer: 3,
    question: 'これが<u>いっぱんてき</u>な方法です。',
    options: ['一藩的', '一番的', '一般的', '一番適'],
  },
  { number: 13, answer: 1, question: '今日も<u>かならず</u>行きます。', options: ['必ず', '必らず', '要ず', '心ず'] },
  {
    number: 14,
    answer: 2,
    question: '効果が<u>あらわれた</u>ようですよ。',
    options: ['改れた', '現れた', '表た', '現た'],
  },
  { number: 15, answer: 3, question: 'おじさんの会社を（ ）するつもりだ。', options: ['登場', '進行', '就職', '同席'] },
  {
    number: 16,
    answer: 2,
    question: 'この店の帽子は全部私が色や形などの（ ）を考えています。',
    options: ['レシピ', 'デザイン', 'サイン', 'ミックス'],
  },
  {
    number: 17,
    answer: 3,
    question: '申し込みの（ ）は来週の月曜日ですから、それまでに申込書を出してください。',
    options: ['あて先', '合図', '締め切り', '合計'],
  },
  {
    number: 18,
    answer: 1,
    question: '英語で会議をするときは、英語がわかる佐藤さんが英語を日本語に（ ）してくれる。',
    options: ['通訳', '案内', '伝言', '連絡'],
  },
  { number: 19, answer: 1, question: '部屋の電気が（ ）消えて、驚いた。', options: ['突然', '急いで', '結構', '庭'] },
  {
    number: 20,
    answer: 4,
    question: '誰でも木村さんはうそをついていると思うが、私は彼が言ったことを（ ）。',
    options: ['手伝います', '褒めます', '守ります', '信じます'],
  },
  {
    number: 21,
    answer: 2,
    question: 'このホテル慎重に清掃されているために部屋はとても（ ）だ。',
    options: ['新鮮', '清潔', '正常', '丁寧'],
  },
  {
    number: 22,
    answer: 4,
    question: '仕事で遅くなってしまい、今日はご飯を作るのが（ ）ので、お弁当を買うことにしました。',
    options: ['にくらしい', 'だらしない', 'しょうがない', '面倒臭い'],
  },
  {
    number: 23,
    answer: 3,
    question: 'みんなの前で初めてスピーチをしたときは、緊張して胸が（ ）しました。',
    options: ['こんこん', 'だぶだぶ', 'どきどき', 'ちかちか'],
  },
  {
    number: 24,
    answer: 2,
    question: 'とても暑かったので、スーパーで買ったアイスクリームが家に着く前に（ ）しまった。',
    options: ['もえて', 'とけて', 'さめて', 'かれて'],
  },
  {
    number: 25,
    answer: 4,
    question: 'アパートの鍵をなくしてしまったので、大家さんに（ ）を話して、鍵を開けてもらった。',
    options: ['秘密', '歴史', '具合', '事情'],
  },
  {
    number: 26,
    answer: 2,
    question: '鈴木さんへ<u>感謝</u>の手紙を送った。',
    options: ['お願い', 'お礼', 'お見舞い', 'お知らせ'],
  },
  {
    number: 27,
    answer: 4,
    question: '子どもたちは<u>キッチン</u>にいます。',
    options: ['廊下', '居間', '玄関', '台所'],
  },
  {
    number: 28,
    answer: 4,
    question: '<u>不安</u>なので、私は行かないことにした。',
    options: ['時間がない', 'お金がない', '危険な', '心配な'],
  },
  {
    number: 29,
    answer: 2,
    question: 'おなかが<u>ぺこぺこ</u>だ。',
    options: ['痛い', 'すいている', 'かゆい', 'いっぱい'],
  },
  {
    number: 30,
    answer: 1,
    question: '兄は<u>黙って</u>ずっと漫画を読んでいる。',
    options: ['何も話さないで', '何も食べないで', '勉強しないで', '寝ないで'],
  },
  {
    number: 31,
    answer: 2,
    question: '健康',
    options: [
      '弟の成績がいつもより健康だったので、両親は喜んだ。',
      'そふは毎日運動をしているから、今までとても健康だ。',
      '駅前にある大きなビルは、古いけど健康だそうだ。',
      '最近パソコンが健康ではないみたいで、ときどき変な音がする。',
    ],
  },
  {
    number: 32,
    answer: 1,
    question: '参加',
    options: [
      '高橋さんは今度の留学セミナーに参加しますか。',
      '林の中に参加したら、涼しくて気持ちがいいですよ。',
      '昨日タクシーに乗ったとき、渋滞に参加してしまった。',
      '猫が私の家族に参加しました。',
    ],
  },
  {
    number: 33,
    answer: 3,
    question: '中旬',
    options: [
      'その本は本棚の中旬にあります。',
      '今日のサッカーは試合の中旬に点が入りました。',
      '来月の中旬に国へ帰るつもりです。',
      '私は三人兄弟の中旬です。',
    ],
  },
  {
    number: 34,
    answer: 3,
    question: '落ち着く',
    options: [
      'この店は人気があるので、朝早くから店の前に大勢の人が落ち着いている。',
      '買った本が袋に入ったまま、床に落ち着いている。',
      '好きな音楽を聞いているとき、気持ちが落ち着いている。',
      '祭りの後はいつも道にゴミがたくさん落ち着いている。',
    ],
  },
  {
    number: 35,
    answer: 2,
    question: 'ほえる',
    options: [
      '祖父の家の近くの森は、いろいろな種類の鳥がほえている。',
      '夜になると、お隣さんの犬がほえていて、うるさい。',
      '私は毎朝、目覚まし時計がほえる音で起きる。',
      'この店は、いつもにぎやかな音楽がほえている。',
    ],
  },
]
const sourceCorrections = [
  {
    number: 31,
    option: 3,
    before: '前にある大きなビルは、古いけど健康だそうだ。',
    after: '駅前にある大きなビルは、古いけど健康だそうだ。',
  },
  {
    number: 31,
    option: 4,
    before: '最近パソコンが健康ではないみたいので、ときどき変な音がする。',
    after: '最近パソコンが健康ではないみたいで、ときどき変な音がする。',
  },
  {
    number: 32,
    option: 1,
    before: '高橋さんは今度の留学ゼミナーに参加しますか。',
    after: '高橋さんは今度の留学セミナーに参加しますか。',
  },
  {
    number: 33,
    option: 2,
    before: '今日のサッカーは試合の中旬に点に入りました。',
    after: '今日のサッカーは試合の中旬に点が入りました。',
  },
  {
    number: 35,
    option: 2,
    before: '夜になると、隣さんの犬がほえていて、うるさい。',
    after: '夜になると、お隣さんの犬がほえていて、うるさい。',
  },
  {
    number: 35,
    option: 3,
    before: '私は毎晩、目覚まし時計がほえる音で起きる。',
    after: '私は毎朝、目覚まし時計がほえる音で起きる。',
  },
]
for (const correction of sourceCorrections) {
  const question = movedQuestions.get(correction.number)
  assert.ok(question, `Missing question ${correction.number}.`)
  const option = question.options?.[correction.option - 1]
  assert.ok(option && typeof option === 'object', `Unexpected option structure in question ${correction.number}.`)
  const text = String(option.text ?? '')
  assert.ok(
    text === correction.before || text === correction.after,
    `Unexpected source text in question ${correction.number}, option ${correction.option}: ${text}`
  )
  option.text = correction.after
}

const stemCorrections = [
  { number: 1, before: '1０時に<u>予約</u>をお願いします。', after: '10時に<u>予約</u>をお願いします。' },
  { number: 2, before: '<u>若かった</u>', after: 'あの頃は私も<u>若かった</u>。' },
  {
    number: 20,
    before: '誰も木村さんはうそをついていると思うが、私は彼が言ったことを（ ）。',
    after: '誰でも木村さんはうそをついていると思うが、私は彼が言ったことを（ ）。',
  },
  {
    number: 22,
    before: '仕事で遅くなってしまい、今日はご飯を作るのが（ ）ので、お弁当を買うことをしました。',
    after: '仕事で遅くなってしまい、今日はご飯を作るのが（ ）ので、お弁当を買うことにしました。',
  },
  {
    number: 23,
    before: 'みんなの前でスピ－チをしたときは、緊張して胸が（ ）しました。',
    after: 'みんなの前で初めてスピーチをしたときは、緊張して胸が（ ）しました。',
  },
]
for (const correction of stemCorrections) {
  const question = sectionQuestions.get(correction.number)
  assert.ok(question, `Missing question ${correction.number}.`)
  assert.ok(
    question.question === correction.before || question.question === correction.after,
    `Unexpected prompt in question ${correction.number}: ${question.question}`
  )
  question.question = correction.after
}

const fullMockQuestions = new Map(
  fullMock.parts.flatMap((part) => part.questions || []).map((question) => [Number(question.number), question])
)
for (const source of sourceQuestions) {
  const sectionQuestion = sectionQuestions.get(source.number)
  const mockQuestion = fullMockQuestions.get(source.number)
  assert.ok(sectionQuestion && mockQuestion, `Missing question ${source.number}.`)
  assert.equal(Number(sectionQuestion.correctAnswer ?? sectionQuestion.answer), source.answer)
  assert.equal(Number(mockQuestion.correctAnswer ?? mockQuestion.answer), source.answer)
  sectionQuestion.question = source.question
  sectionQuestion.sentence = source.question
  sectionQuestion.options = source.options.map((text, index) => ({ id: String(index + 1), text }))
  mockQuestion.question = `<p><span style="font-family: Inter;"><strong>${source.number}. ${source.question}</strong></span></p>`
  mockQuestion.sentence = mockQuestion.question
  mockQuestion.options = source.options.map((text, index) => `${index + 1}.${text}`)
}

const editorialPromptCorrections = [
  {
    number: 15,
    source: 'おじさんの会社を（ ）するつもりだ。',
    corrected: 'おじさんの会社に（ ）するつもりだ。',
    reason: '就職する đi với nơi làm việc + に; PDF in を.',
  },
  {
    number: 21,
    source: 'このホテル慎重に清掃されているために部屋はとても（ ）だ。',
    corrected: 'このホテルは慎重に清掃されているため、部屋はとても（ ）だ。',
    reason: 'Thêm は bị thiếu sau このホテル và rút gọn ために thành ため để câu dễ đọc; PDF in như câu nguồn.',
  },
]
for (const correction of editorialPromptCorrections) {
  const sectionQuestion = sectionQuestions.get(correction.number)
  const mockQuestion = fullMockQuestions.get(correction.number)
  assert.ok(sectionQuestion && mockQuestion, `Missing prompt correction target ${correction.number}.`)
  assert.ok(
    sectionQuestion.question === correction.source || sectionQuestion.question === correction.corrected,
    `Unexpected section prompt for question ${correction.number}: ${sectionQuestion.question}`
  )
  sectionQuestion.question = correction.corrected
  sectionQuestion.sentence = correction.corrected
  mockQuestion.question = `<p><span style="font-family: Inter;"><strong>${correction.number}. ${correction.corrected}</strong></span></p>`
  mockQuestion.sentence = mockQuestion.question
}

const explanations = {
  1: `Đáp án 2 — 予約（よやく）là đặt trước/đặt chỗ; cách đọc là よやく.

1. ようやく: “cuối cùng, rốt cuộc”; cách đọc đúng của chữ này là ようやく, không phải 予約.
2. よやく: cách đọc đúng của 予約, nghĩa là “đặt trước”. Câu 「10時に予約をお願いします」 nghĩa là “Xin đặt chỗ lúc 10 giờ.”
3. よよく: không phải cách đọc chuẩn của 予約.
4. ようよく: không phải cách đọc chuẩn của 予約.

Ghi nhớ: 予（よ）＋約（やく）＝予約（よやく）.`,
  2: `Đáp án 4 — 若かった（わかかった）là dạng quá khứ của 若い（わかい）, nghĩa là “trẻ”.

1. わるかった: “đã tệ/không tốt”, cách đọc của 悪かった; không phải 若かった.
2. さむかった: “đã lạnh”, cách đọc của 寒かった.
3. こわかった: “đã đáng sợ”, cách đọc của 怖かった.
4. わかかった: cách đọc đúng. 「あの頃は私も若かった」 nghĩa là “Hồi đó tôi cũng còn trẻ.”

Phân biệt 若い（わかい, trẻ）và 悪い（わるい, xấu/tệ）.`,
  3: `Đáp án 1 — 上品（じょうひん）nghĩa là thanh lịch, tao nhã.

1. じょうひん: cách đọc đúng. 「上品な人ですね」 nghĩa là “Anh/chị ấy là người thật thanh lịch.”
2. じょうびん: đọc sai âm ひん thành びん.
3. じょひん: thiếu âm ょ nhỏ trong じょう.
4. じょびん: vừa thiếu âm ょ vừa đọc sai ひん thành びん.

Các lựa chọn kana sai chỉ là cách đọc sai của 上品, không phải từ riêng cần dịch.`,
  4: `Đáp án 2 — 助けて（たすけて）là thể て của 助ける（たすける）, nghĩa là giúp đỡ/cứu giúp.

1. とどけて: “mang/gửi đến”, cách đọc của 届けて.
2. たすけて: cách đọc đúng. 「山田さんに助けてもらった」 nghĩa là “Tôi đã được anh Yamada giúp đỡ.”
3. うけて: “nhận/đón nhận”, cách đọc của 受けて; không phải 助けて.
4. かたづけて: “dọn dẹp”, cách đọc của 片付けて.

助ける là giúp/cứu người; 届ける là giao hoặc gửi đồ đến.`,
  7: `Đáp án 4 — 勝った（かった）là dạng quá khứ của 勝つ（かつ）, nghĩa là đã thắng.

1. かざった: cách đọc của 飾った, nghĩa là “đã trang trí”; không khớp chữ 勝.
2. おった: không phải cách đọc 勝った; 折った（おった）có thể nghĩa là “đã bẻ/gấp”.
3. のこった: không phải cách đọc 勝った; 残った（のこった）nghĩa là “đã còn lại”.
4. かった: cách đọc đúng. 「誰が勝ったんですか」 nghĩa là “Ai đã thắng vậy?”

Các lựa chọn 1–3 là cách đọc của từ khác, không khớp chữ 勝.`,
  8: `Đáp án 1 — 印象（いんしょう）là ấn tượng/cảm nhận ban đầu.

1. いんしょう: cách đọc đúng. 「彼に初めて会ったときの印象はどうでしたか」 nghĩa là “Ấn tượng của bạn khi lần đầu gặp anh ấy thế nào?”
2. いんそう: đọc sai âm しょう thành そう.
3. にんしょう: đọc sai chữ 印; từ này bắt đầu bằng いん.
4. にんそう: đọc sai cả âm đầu và âm cuối.

Các lựa chọn kana sai chỉ làm nhiễu cách đọc của 印象, không phải từ riêng cần dịch.`,
  5: `Đáp án 3 — 未来（みらい）là tương lai; cách đọc của từ được gạch chân là みらい.

1. しょらい: không phải cách đọc chuẩn của 未来.
2. しょうらい: là cách đọc của 将来, cũng có nghĩa “tương lai”, nhưng không phải cách đọc của chữ 未来 trong câu này.
3. みらい: cách đọc đúng của 未来. 「未来を考えてみる」 nghĩa là “Thử nghĩ về tương lai.”
4. みいらい: không phải cách đọc chuẩn của 未来.

Ghi nhớ: 未来（みらい）và 将来（しょうらい）đều nói về tương lai, nhưng cách đọc kanji khác nhau.`,
  6: `Đáp án 1 — 各駅（かくえき）nghĩa là “mỗi ga/tất cả các ga”.

1. かくえき: cách đọc đúng. 「この電車は各駅に止まります」 nghĩa là “Tàu này dừng ở tất cả các ga.”
2. がくえき: không phải cách đọc của 各駅.
3. きゃくえき: không phải cách đọc của 各駅.
4. ぎゃくえき: không phải cách đọc của 各駅.

Ghi nhớ: 各（かく）có nghĩa “mỗi/từng”; 各駅停車（かくえきていしゃ）là tàu dừng ở mọi ga.`,
  9: `Đáp án 4 — 理由（りゆう）nghĩa là “lý do”.

1. 理有: cách viết này không tạo thành từ chuẩn 理由.
2. 利由: 利（lợi ích）không phải chữ dùng trong từ “lý do”.
3. 自由（じゆう）: “tự do”, khác nghĩa với りゆう.
4. 理由（りゆう）: cách viết đúng. 「理由はよくわかりません」 nghĩa là “Tôi không hiểu rõ lý do.”

Phân biệt 理由（りゆう, lý do）và 自由（じゆう, tự do）.`,
  10: `Đáp án 3 — 島（しま）nghĩa là hòn đảo.

1. 寺（てら）: ngôi chùa; không phải cách viết của しま.
2. 村（むら）: ngôi làng.
3. 島（しま）: đúng. 「この島には初めて来ました」 nghĩa là “Đây là lần đầu tôi đến hòn đảo này.”
4. 庭（にわ）: khu vườn/sân vườn.

Chọn chữ Hán theo cách đọc しま trong câu, không chỉ theo hình dáng chữ.`,
  11: `Đáp án 4 — 記念（きねん）là dịp/kỷ niệm để ghi nhớ một sự kiện.

1. 気念: không phải cách viết chuẩn của きねん trong câu này.
2. 祈念（きねん）: “cầu nguyện/mong ước”; có cách đọc giống nhau nhưng không hợp nghĩa “chụp ảnh kỷ niệm ngày tốt nghiệp”.
3. 木念: không phải cách viết chuẩn của từ này.
4. 記念（きねん）: đúng. 「卒業の記念に写真を撮りました」 nghĩa là “Tôi đã chụp ảnh làm kỷ niệm ngày tốt nghiệp.”

Ghi nhớ: 記念写真 là ảnh kỷ niệm; 祈念 thường dùng trong văn phong trang trọng với nghĩa cầu chúc/cầu nguyện.`,
  12: `Đáp án 3 — 一般的（いっぱんてき）nghĩa là “phổ biến, thông thường, mang tính chung”.

1. 一藩的: đây là chữ in trong PDF, nhưng 藩（はん）không tạo thành từ 一般的 và cách viết này không chuẩn.
2. 一番的: 一番（いちばん）là “nhất”, nhưng 一番的 không phải từ tự nhiên trong câu này.
3. 一般的（いっぱんてき）: cách viết đúng. 「これが一般的な方法です」 nghĩa là “Đây là phương pháp thông thường/phổ biến.”
4. 一番適: không phải cách viết chuẩn của 一般的.

Ghi chú nguồn: lựa chọn 1 trên PDF in 「一藩的」; không tự sửa lựa chọn này vì đây là phương án sai của đề.`,
  13: `Đáp án 1 — 必ず（かならず）nghĩa là “nhất định/chắc chắn”.

1. 必ず: cách viết đúng. 「今日も必ず行きます」 nghĩa là “Hôm nay tôi cũng nhất định sẽ đi.”
2. 必らず: thêm ら là sai chính tả; viết 必ず.
3. 要ず: không phải cách viết của かならず.
4. 心ず: không phải cách viết của かならず.

Ghi nhớ hình thức cố định: 必ず（かならず）.`,
  14: `Đáp án 2 — 効果が現れる（こうかがあらわれる）nghĩa là “hiệu quả xuất hiện/phát huy tác dụng”.

1. 改れた: 改める（あらためる, sửa đổi）không viết thành 改れた trong cấu trúc này.
2. 現れた: dạng quá khứ của 現れる（あらわれる）, viết đúng trong 「効果が現れた」 — “hiệu quả đã xuất hiện”.
3. 表た: thiếu kana; 表れる cần viết 「表れた」 nếu dùng chữ 表.
4. 現た: thiếu れ; phải viết 「現れた」.

現れる／表れる đều có thể đọc là あらわれる; với 効果, cách viết 現れる rất thông dụng.`,
  15: `Đáp án 3 — 就職（しゅうしょく）する là xin được việc/làm việc chính thức tại một công ty hoặc tổ chức.

1. 登場（とうじょう）: “xuất hiện/lên sân khấu”; không nói 登場する khi muốn nói vào làm ở công ty.
2. 進行（しんこう）: “tiến triển/điều hành”; không hợp với ý định làm nhân viên ở công ty.
3. 就職（しゅうしょく）: đúng. 「おじさんの会社に就職するつもりだ」 nghĩa là “Tôi định vào làm ở công ty của chú/bác.”
4. 同席（どうせき）: “cùng ngồi dự/cùng có mặt”; không có nghĩa là nhận việc.

Ghi chú nguồn: PDF in 「会社を就職する」, nhưng cách dùng tự nhiên là 「会社に就職する」; đã sửa trợ từ を thành に để người học không ghi nhớ sai.`,
  16: `Đáp án 2 — デザイン là thiết kế, kiểu dáng và cách phối màu.

1. レシピ: công thức, thường là công thức nấu ăn; không phải thứ người nói nghĩ cho kiểu dáng chiếc mũ.
2. デザイン: đúng. 「色や形などのデザインを考える」 là nghĩ ra thiết kế, màu sắc và hình dáng.
3. サイン: dấu hiệu, biển hiệu hoặc chữ ký; không mang nghĩa thiết kế kiểu dáng sản phẩm.
4. ミックス: sự pha trộn/trộn lẫn; không hợp với ý nghĩ kiểu dáng chiếc mũ.

Cả câu: “Tôi nghĩ ra thiết kế, như màu sắc và hình dáng, cho tất cả mũ của cửa hàng này.”`,
  17: `Đáp án 3 — 締め切り（しめきり）là hạn cuối nộp hoặc đăng ký.

1. あて先（宛先）: địa chỉ/người nhận thư; không thể là thứ Hai làm hạn nộp đơn.
2. 合図（あいず）: dấu hiệu/tín hiệu.
3. 締め切り（しめきり）: đúng, hạn chót. 「申し込みの締め切りは来週の月曜日」 nghĩa là “Hạn đăng ký là thứ Hai tuần tới.”
4. 合計（ごうけい）: tổng cộng/tổng số.

Vế sau yêu cầu nộp đơn trước thứ Hai, nên chỗ trống phải chỉ hạn cuối.`,
  18: `Đáp án 1 — 通訳（つうやく）là phiên dịch lời nói giữa hai ngôn ngữ.

1. 通訳: đúng. 「英語を日本語に通訳してくれる」 nghĩa là “phiên dịch tiếng Anh sang tiếng Nhật giúp”.
2. 案内（あんない）: hướng dẫn/đưa đường; không phải chuyển lời giữa hai ngôn ngữ.
3. 伝言（でんごん）: lời nhắn; không phù hợp với hành động phiên dịch trong cuộc họp.
4. 連絡（れんらく）: liên lạc/thông báo; không có nghĩa là dịch.

Ghi nhớ: phiên dịch lời nói là 通訳; biên dịch văn bản là 翻訳（ほんやく）.`,
  19: `Đáp án 1 — 突然（とつぜん）nghĩa là “đột nhiên/bất ngờ”.

1. 突然: đúng. 「部屋の電気が突然消えて、驚いた」 nghĩa là “Đèn trong phòng đột nhiên tắt khiến tôi giật mình.”
2. 急いで（いそいで）: “vội vàng”; thường diễn tả cách người làm việc gì đó, không hợp với điện tự tắt.
3. 結構（けっこう）: “khá/tương đối” hoặc “đủ rồi”; không mang nghĩa bất ngờ trong câu này.
4. 庭（にわ）: “khu vườn”, là danh từ chỉ nơi chốn chứ không thể bổ nghĩa cho 消えて ở đây.

Ghi nhớ: 突然消える = đột nhiên tắt/biến mất.`,
  20: `Đáp án 4 — 信じる（しんじる）là tin, tin tưởng một người hoặc lời họ nói.

1. 手伝う（てつだう）: giúp đỡ; 「言ったことを手伝う」 không tự nhiên.
2. 褒める（ほめる）: khen ngợi; không có nghĩa là tin lời ai.
3. 守る（まもる）: bảo vệ/giữ gìn; không hợp với 「彼が言ったこと」 theo ý câu.
4. 信じる（しんじる）: đúng. 「私は彼が言ったことを信じます」 nghĩa là “Tôi tin điều anh ấy đã nói.”

Cả câu 「誰でも木村さんはうそをついていると思うが、私は彼が言ったことを信じます」: “Ai cũng nghĩ anh Kimura đang nói dối, nhưng tôi tin điều anh ấy nói.” PDF dùng 「誰でも」; dịch theo ý là “mọi người”.`,
  21: `Đáp án 2 — 清潔（せいけつ）là sạch sẽ, vệ sinh.

1. 新鮮（しんせん）: tươi/mới, thường nói về thực phẩm hoặc không khí; không phải từ chính để nói căn phòng sạch.
2. 清潔（せいけつ）: đúng. 「部屋はとても清潔だ」 nghĩa là “phòng rất sạch sẽ/vệ sinh”.
3. 正常（せいじょう）: bình thường/hoạt động đúng; không đồng nghĩa với sạch sẽ.
4. 丁寧（ていねい）: cẩn thận/lịch sự; thường bổ nghĩa cho cách làm hoặc thái độ, không miêu tả căn phòng là sạch.

Ghi chú nguồn: PDF thiếu は sau 「このホテル」; câu đã được biên tập thành 「このホテルは…部屋はとても清潔だ」 cho đúng ngữ pháp. `,
  22: `Đáp án 4 — 面倒臭い（めんどうくさい）nghĩa là phiền/phức, ngại làm.

1. にくらしい（憎らしい）: đáng ghét/đáng ghét đến phát bực; không hợp với lý do không nấu bữa tối.
2. だらしない: luộm thuộm/thiếu ngăn nắp; không diễn tả việc nấu ăn quá phiền.
3. しょうがない: không còn cách nào khác/đành chịu; không hợp ngữ pháp và ý nghĩa trước khi mua cơm hộp.
4. 面倒臭い: đúng. 「今日はご飯を作るのが面倒臭いので、お弁当を買うことにしました」 nghĩa là “Hôm nay nấu cơm phiền quá nên tôi quyết định mua cơm hộp.”

Ghi nhớ: 面倒くさい + ので diễn tả lý do ngại/phiền làm việc gì.`,
  23: `Đáp án 3 — どきどき diễn tả tim đập thình thịch vì hồi hộp hoặc phấn khích.

1. こんこん: tiếng gõ cộc cộc hoặc tiếng ho khan; không diễn tả tim đập hồi hộp.
2. だぶだぶ: rộng thùng thình, thường nói quần áo; không hợp với 胸が（ ）する.
3. どきどき: đúng. 「緊張して胸がどきどきしました」 nghĩa là “Tôi hồi hộp đến mức tim đập thình thịch.”
4. ちかちか: nhấp nháy/chói mắt; thường tả ánh sáng hoặc mắt, không dùng cho nhịp tim.

Cả câu 「みんなの前で初めてスピーチをしたときは、緊張して胸がどきどきしました」 nghĩa là “Khi lần đầu phát biểu trước mọi người, tôi hồi hộp đến mức tim đập thình thịch.”`,
  24: `Đáp án 2 — 溶ける（とける）là tan chảy, thường dùng với kem hoặc đá dưới trời nóng.

1. 燃える（もえる）: cháy/bốc cháy; kem không cháy trong tình huống này.
2. 溶ける（とける）: đúng. 「アイスクリームが溶けてしまった」 nghĩa là “Kem đã tan mất.”
3. 冷める（さめる）: nguội đi hoặc hết hứng; đồ ăn nóng có thể nguội, nhưng kem dưới trời nóng thì 溶ける.
4. 枯れる（かれる）: khô héo (cây/cỏ) hoặc cạn (nguồn nước); không dùng cho kem.

Cả câu: “Trời nóng quá nên kem mua ở siêu thị đã tan trước khi tôi về đến nhà.”`,
  25: `Đáp án 4 — 事情（じじょう）là tình hình/hoàn cảnh cụ thể.

1. 秘密（ひみつ）: bí mật; mất chìa khóa thì cần giải thích hoàn cảnh, không nhất thiết là tiết lộ bí mật.
2. 歴史（れきし）: lịch sử; không liên quan đến việc nhờ mở cửa.
3. 具合（ぐあい）: tình trạng/điều kiện, thường nói tình trạng sức khỏe hay hoạt động.
4. 事情（じじょう）: đúng. 「大家さんに事情を話す」 là giải thích hoàn cảnh với chủ nhà.

Cả câu: “Tôi làm mất chìa khóa căn hộ nên kể hoàn cảnh với chủ nhà và nhờ mở cửa.”`,
  26: `Đáp án 2 — 感謝（かんしゃ）là lòng biết ơn; お礼（おれい）là lời/vật bày tỏ cảm ơn, gần nghĩa trong câu này.

1. お願い（おねがい）: lời nhờ vả/yêu cầu; khác với lời cảm ơn.
2. お礼（おれい）: đúng, lời cảm ơn. 「感謝の手紙」 là thư bày tỏ lòng biết ơn.
3. お見舞い（おみまい）: thăm hỏi người bệnh/người gặp chuyện không may; đôi khi cũng chỉ quà thăm bệnh.
4. お知らせ（おしらせ）: thông báo/tin báo.

Cả câu: “Tôi đã gửi thư cảm ơn cho anh/chị Suzuki.”`,
  27: `Đáp án 4 — キッチン là nhà bếp, tương đương 台所（だいどころ）.

1. 廊下（ろうか）: hành lang.
2. 居間（いま）: phòng khách/phòng sinh hoạt chung.
3. 玄関（げんかん）: lối vào/sảnh trước của nhà.
4. 台所（だいどころ）: đúng, nhà bếp.

Cả câu: 「子どもたちはキッチンにいます」 nghĩa là “Bọn trẻ đang ở trong bếp.”`,
  28: `Đáp án 4 — 不安（ふあん）là bất an/lo lắng, gần nghĩa với 心配（しんぱい）.

1. 時間がない: không có thời gian; đây có thể là lý do khác để không đi nhưng không phải nghĩa của 不安.
2. お金がない: không có tiền; cũng có thể là lý do khác, nhưng không có nghĩa “lo lắng”.
3. 危険な（きけんな）: nguy hiểm; không đồng nghĩa với 不安.
4. 心配な（しんぱいな）: đúng, lo lắng/bất an. 「不安なので、私は行かないことにした」 nghĩa là “Vì lo lắng nên tôi quyết định không đi.”

Trong câu hỏi đồng nghĩa, chọn từ gần nghĩa trực tiếp: 不安 ≈ 心配.`,
  29: `Đáp án 2 — ぺこぺこ trong 「おなかがぺこぺこ」 nghĩa là rất đói.

1. 痛い（いたい）: đau; không đồng nghĩa với đói.
2. すいている: bụng đói/rỗng. 「おなかがぺこぺこだ」 nghĩa là “Tôi đói meo.”
3. かゆい: ngứa; không liên quan đến cảm giác đói.
4. いっぱい: đầy/no; trái nghĩa với おなかがぺこぺこ trong ngữ cảnh này.

Ghi nhớ: おなかがすく = đói; おなかがいっぱい = no.`,
  30: `Đáp án 1 — 黙って（だまって）nghĩa là im lặng/không nói gì.

1. 何も話さないで: không nói gì; đúng với 黙って.
2. 何も食べないで: không ăn gì; khác nghĩa.
3. 勉強しないで: không học; khác nghĩa.
4. 寝ないで: không ngủ; khác nghĩa.

Cả câu: 「兄は黙ってずっと漫画を読んでいる」 nghĩa là “Anh tôi cứ im lặng đọc truyện tranh suốt.”`,
  31: `Đáp án 2 — 健康（けんこう）là khỏe mạnh, chủ yếu nói về tình trạng sức khỏe của người.

1. 「弟の成績がいつもより健康だったので、両親は喜んだ」: “Điểm của em trai khỏe mạnh hơn bình thường nên bố mẹ vui.” 成績 là thành tích/điểm số, không dùng 健康; nên nói 成績がよかった.
2. 「そふは毎日運動をしているから、今までとても健康だ」: “Ông tôi tập thể dục mỗi ngày nên đến giờ vẫn rất khỏe mạnh.” 健康だ dùng đúng cho sức khỏe con người.
3. 「駅前にある大きなビルは、古いけど健康だそうだ」: “Tòa nhà lớn trước ga cũ nhưng nghe nói vẫn khỏe mạnh.” Nói công trình còn chắc chắn nên dùng 丈夫だ; 健康 không dùng cho tòa nhà.
4. 「最近パソコンが健康ではないみたいで、ときどき変な音がする」: “Máy tính dạo này có vẻ không khỏe nên thỉnh thoảng phát ra tiếng lạ.” Thiết bị bị trục trặc thường nói 調子が悪い, không dùng 健康.

Mẹo: 健康 là sức khỏe của người; 丈夫 nói về độ bền/chắc; thiết bị hoạt động bất thường thì 調子が悪い.`,
  32: `Đáp án 1 — 参加（さんか）する là tham gia một hoạt động hoặc sự kiện; cấu trúc thường gặp là hoạt động + に参加する.

1. 「高橋さんは今度の留学セミナーに参加しますか」: “Anh/chị Takahashi có tham gia hội thảo du học lần này không?” 参加する đi với tên hoạt động/sự kiện như セミナー, nên cách dùng đúng.
2. 「林の中に参加したら」: “Nếu tham gia vào trong rừng.” Muốn nói đi vào rừng dùng 林の中に入ったら; địa điểm không phải một sự kiện để 参加する.
3. 「渋滞に参加してしまった」: “Tôi đã tham gia vào cảnh tắc đường.” Nói bị kẹt xe dùng 渋滞に巻き込まれた hoặc 渋滞にあった.
4. 「猫が私の家族に参加しました」: “Con mèo tham gia vào gia đình tôi.” Nói một thành viên mới gia nhập gia đình dùng 家族に加わった hoặc 家族の一員になった.

Ghi chú nguồn: PDF in nhầm 「ゼミナー」; đã sửa thành 「セミナー」, từ đúng là “hội thảo”.`,
  33: `Đáp án 3 — 中旬（ちゅうじゅん）là khoảng giữa tháng, thường chỉ các ngày 11–20.

1. 「その本は本棚の中旬にあります」: “Quyển sách nằm ở giữa tháng của giá sách.” Kệ sách có tầng giữa thì nói 本棚の中段.
2. 「今日のサッカーは試合の中旬に点が入りました」: “Hôm nay trận bóng ghi bàn vào giữa tháng của trận đấu.” Giữa trận đấu là 試合の中盤; 中旬 chỉ thời điểm giữa tháng.
3. 「来月の中旬に国へ帰るつもりです」: “Tôi định về nước vào giữa tháng sau.” 中旬 dùng đúng để nói thời điểm trong tháng.
4. 「私は三人兄弟の中旬です」: “Tôi là người giữa tháng trong ba anh chị em.” Nói người con ở giữa là 真ん中の子 hoặc 二番目.

Phân biệt: 中旬 = giữa tháng; 中段 = tầng giữa; 中盤 = giữa trận/tiến trình; 真ん中 = vị trí chính giữa.`,
  34: `Đáp án 3 — 落ち着く（おちつく）diễn tả bình tĩnh lại, yên ổn hoặc làm tâm trạng lắng xuống.

1. 「店の前に大勢の人が落ち着いている」: “Nhiều người đang bình tĩnh trước cửa hàng.” Câu muốn nói nhiều người xếp hàng/tập trung trước cửa hàng; dùng 並んでいる hoặc 集まっている.
2. 「買った本が袋に入ったまま、床に落ち着いている」: “Quyển sách mới mua vẫn trong túi và đang bình tĩnh trên sàn.” Đồ vật được đặt trên sàn dùng 床に置いてある; 落ち着く không có nghĩa là nằm/đặt ở đâu đó.
3. 「好きな音楽を聞いているとき、気持ちが落ち着いている」: “Khi nghe nhạc mình thích, tâm trạng tôi bình tĩnh lại.” 落ち着く dùng tự nhiên với 気持ち.
4. 「道にゴミがたくさん落ち着いている」: “Có nhiều rác đang bình tĩnh trên đường.” Rác nằm bừa bộn thì dùng 散らかっている hoặc たまっている.

Mẹo: người/tâm trạng có thể 落ち着く; đồ vật được đặt là 置く; người xếp hàng là 並ぶ.`,
  35: `Đáp án 2 — ほえる là sủa (chó) hoặc gầm (một số động vật lớn).

1. 「鳥がほえている」: “Chim đang sủa/gầm.” Chim kêu dùng 鳥が鳴いている.
2. 「夜になると、お隣さんの犬がほえていて、うるさい」: “Tối đến chó nhà hàng xóm sủa nên rất ồn.” ほえる dùng đúng với tiếng chó sủa.
3. 「目覚まし時計がほえる音」: “Tiếng đồng hồ báo thức sủa.” Đồng hồ reo dùng 目覚まし時計が鳴る.
4. 「にぎやかな音楽がほえている」: “Bản nhạc sôi động đang sủa.” Nhạc phát/vang lên dùng 音楽が流れている hoặc 鳴っている.

Phân biệt: chó sủa là ほえる; chim kêu là 鳴く; chuông/đồng hồ reo là 鳴る; nhạc phát là 流れる.`,
}

const mockQuestions = new Map(
  fullMock.parts.flatMap((part) => part.questions || []).map((question) => [Number(question.number), question])
)
for (const [number, explanation] of Object.entries(explanations)) {
  const question = sectionQuestions.get(Number(number))
  const source = mockQuestions.get(Number(number))
  assert.ok(question && source, `Missing full-exam question ${number}.`)
  assert.equal(Number(question.correctAnswer ?? question.answer), Number(source.correctAnswer ?? source.answer))
  if (Number(number) >= 31) {
    assert.ok(
      !question.explanation || question.explanation === explanation,
      `Question ${number} already has a different explanation; refusing to overwrite it.`
    )
  }
  question.explanation = explanation
  source.explanation = explanation
}

vocabulary.parts = vocabularyRanges.map((range) => (range === '31-35' ? movedVocabulary : vocabParts.get(range)))
grammarReading.parts = grammarReadingRanges.map((range) => grammarParts.get(range))
for (const [index, part] of vocabulary.parts.entries()) {
  part.title = `Mondai ${index + 1}`
  part.titleJP = `第${index + 1}問`
}
for (const [index, part] of grammarReading.parts.entries()) {
  part.title = `Mondai ${index + 1}`
  part.titleJP = `第${index + 1}問`
}
for (const [index, part] of listening.parts.entries()) {
  part.title = `Mondai ${index + 1}`
  part.titleJP = `第${index + 1}問`
}

vocabulary.questionCount = vocabulary.parts.reduce((count, part) => count + part.questions.length, 0)
grammarReading.questionCount = grammarReading.parts.reduce((count, part) => count + part.questions.length, 0)
listening.questionCount = listening.parts.reduce((count, part) => count + part.questions.length, 0)
assert.equal(vocabulary.questionCount, 35)
assert.equal(grammarReading.questionCount, 39)
assert.equal(listening.questionCount, 28)
assert.deepEqual(vocabulary.parts.map(rangeKey), vocabularyRanges)
assert.deepEqual(grammarReading.parts.map(rangeKey), grammarReadingRanges)
assert.deepEqual(listening.parts.map(rangeKey), listeningRanges)

fs.writeFileSync(fullMasterPath, `${JSON.stringify(fullMaster, null, 2)}\n`)
fs.writeFileSync(mockMasterPath, `${JSON.stringify(mockMaster, null, 2)}\n`)
const report = {
  generatedAt: new Date().toISOString(),
  examId: 'cm2u2xbu400ta134iaz003jdg',
  scope:
    'Align all December 2019 N3 vocabulary questions 1–35 in the full mock and standalone section with the source PDF, correct two source prompt typos for learner-facing Japanese, and provide explanations for all four choices and a Vietnamese translation for every item.',
  source: {
    examPdf: {
      name: '10. N3 12-2019.pdf',
      driveFileId: '1UNA2Sm0KwwFWSZ8JI226j4HV4PQEzAOb',
      driveUrl: 'https://drive.google.com/file/d/1UNA2Sm0KwwFWSZ8JI226j4HV4PQEzAOb/view',
      inspectedInChrome: true,
      pages: [1, 2, 3, 4],
      notes:
        'Printed pages 1–3 contain vocabulary questions 1–33; printed page 4 contains questions 34–35 and starts grammar at question 36. The prompts for questions 15 and 21 retain their exact PDF wording in the source record, with learner-facing particle/grammar corrections documented below.',
    },
    answerKeys: {
      answers: Object.fromEntries(sourceQuestions.map(({ number, answer }) => [number, answer])),
      checkedAgainstExistingFullMockKeyAndReviewedByJapaneseUsage: true,
      officialAnswerPdfConfirmed: false,
    },
  },
  before: {
    vocabularyQuestionCount: 30,
    grammarReadingQuestionCount: 44,
    listeningQuestionCount: 28,
    misplacedVocabularyRange: '31-35',
    sourceTextErrorsInQuestions31To35: sourceCorrections.length,
    explanationsMissingForQuestions: [1, 2, 5, 6, 9, 11, 12, 13, 14, 15, 18, 19, 20, 21, 22, 23, 29],
  },
  after: {
    vocabularyQuestionCount: vocabulary.questionCount,
    grammarReadingQuestionCount: grammarReading.questionCount,
    listeningQuestionCount: listening.questionCount,
    vocabularyRanges,
    grammarReadingRanges,
    listeningRanges,
    correctedSourceText: sourceCorrections.map(({ number, option, before, after }) => ({
      number,
      option,
      before,
      after,
    })),
    learnerFacingPromptCorrections: editorialPromptCorrections,
    explanationsAddedForQuestions: Object.keys(explanations).map(Number),
  },
  limitations: [
    'The original PDF is not an official answer-key document. The 35 answer keys remain cross-checked against the existing full-mock key and Japanese usage, not an official JLPT key.',
    'The source prints 留学ゼミナー in question 32; the standalone section corrects this apparent typo to 留学セミナー.',
  ],
}
const prettierConfig = (await prettier.resolveConfig(reportPath)) || {}
fs.writeFileSync(reportPath, await prettier.format(JSON.stringify(report), { ...prettierConfig, filepath: reportPath }))
console.log(
  'Repaired N3 December 2019 sections: vocabulary 35, grammar/reading 39, listening 28; aligned and explained all vocabulary questions 1–35.'
)
