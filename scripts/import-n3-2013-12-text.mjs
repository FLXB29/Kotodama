import fs from 'node:fs'
import path from 'node:path'

// Curated against the original 12/2013 question paper on the owner's Drive.
// The paper has a text layer; these passages were checked against its extracted text.
// Source: owner's Drive, N3_ĐỀ CÁC NĂM / 4. N3 12-2013 / 4. N3 12-2013.pdf
const file = path.resolve('data/jlpt_n3_toan_master.json')
const exams = JSON.parse(fs.readFileSync(file, 'utf8'))
const exam = exams.find((item) => item.id === 'toan-n3-201312-full')
if (!exam) throw new Error('December 2013 N3 exam not found')

const questions = new Map(exam.parts.flatMap((part) => part.questions.map((question) => [question.number, question])))
const escapeHtml = (value) => value.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;')
const html = (paragraphs) => paragraphs.map((paragraph) => `<p>${escapeHtml(paragraph)}</p>`).join('')

const starQuestions = {
  49: {
    before: '私は、息子が',
    after: '見て、「どうしたの？」と声をかけた。',
    order: [2, 3, 1, 4],
  },
  50: {
    before: 'この公園は、いろいろな花が咲きはじめる',
    after: 'と聞いた。',
    order: [4, 2, 1, 3],
  },
  51: {
    before: '友達がけがで入院したと聞き、あわてて',
    after: '元気で安心した。',
    order: [1, 3, 2, 4],
  },
  52: {
    before: '庭に植えたスイカは、これまでなかなか',
    after: '今年になっておいしいのができた。',
    order: [3, 1, 4, 2],
  },
  53: {
    before: '子供のころに祖母が作ってくれたワンピースを、',
    after: 'いる。',
    order: [4, 1, 3, 2],
  },
}

for (const [number, item] of Object.entries(starQuestions)) {
  const question = questions.get(Number(number))
  if (!question || question.options?.length !== 4) throw new Error(`Star question ${number} is missing`)
  if (item.order[2] !== Number(question.correctAnswer)) {
    throw new Error(`Star question ${number}: ★ position disagrees with the verified answer key`)
  }
  question.question = `(${Number(number) - 35}) 次の文の★に入るものを選びなさい。`
  question.sentence = question.question
  question.starPrompt = { before: item.before, after: item.after }
  question.starCorrectOrder = item.order
  question.passage = null
}

const letter = html([
  '以下の文章は、日本に留学しているユーリヤさんが、国の日本語の先生に書いた手紙である。',
  '2013年5月5日　大川和子先生',
  'ごぶさたしております。お元気ですか。日本に来て1か月がたち、やっと落ち着いてきました。今、日本の生活で大きな問題はありません。留学前に、先生がいろいろと丁寧に教えてくださったからだと思います。本当に（19）。',
  '生活には慣れましたが、学校の勉強は大変です。（20）大変だとは思いませんでした。授業の予習復習と宿題で毎日とても忙しくしています。自宅と学校の往復だけで、そのほかの場所にはほとんど出かけたことがありません。（21）、せっかく日本にやってきたのだから、勉強だけではもったいないとも思います。日本にいる間に、日本語の勉強だけでなく、いろいろな場所へ行って、いろいろな経験がしたいです。だから、これからはできるだけ（22）。',
  '夏休みは帰国せず、日本国内を旅行する予定です。先生の出身地の京都にも行こうと思っているのですが、おすすめの場所はありますか。もしあったら、（23）。',
  'それでは、またご連絡いたします。お元気でお過ごしください。　ミツケヴィチ・ユーリヤ',
])
const clozePart = exam.parts.find((part) => part.id === 'toan_part_2013_12_m2_g3')
if (!clozePart || clozePart.questions.length !== 5) throw new Error('December 2013 cloze part has changed')
clozePart.passage = letter
for (let number = 54; number <= 58; number++) {
  const question = questions.get(number)
  if (!question) throw new Error(`Cloze question ${number} is missing`)
  question.question = `Bài điền vào chỗ trống (${number - 35})`
  question.sentence = question.question
  question.passage = null
}

const reading = {
  59: [
    'これは交流会の出席予定者に届いたメールである。',
    '交流会にご出席のみなさん',
    'こんにちは、田中です。今週土曜日の交流会は、「ナポリ」というイタリア料理のレストランにしました。12時からです。「ナポリ」の場所ですが、地下鉄南北線の朝日駅から歩いて10分ぐらいのところにあります。わかりにくい場所にあるので、みんなで一緒に店に向かおうと思います。朝日駅の1番出口に11時45分に集合してください。車で直接行く人は、前日までにメールをください。',
    'それでは、楽しみにしています。寺前テニスクラブ代表　田中真理子',
  ],
  60: [
    'これはある国で行われた、すしの大会についての記事である。',
    '先日、「すし一番」という大会が行われ、各地から集まった15人のすし屋が、すしを作るはやさと、皿に並べたすしの全体的な美しさを競争した。',
    '参加者のほとんどは、10年以上の経験がある人たちだったが、今年の優勝者は、すし屋になって5年目の27歳の若者だった。優勝者には日本旅行がプレゼントされ、旅行中には、有名な日本料理店で食事をしたり、料理を作っているところを見学したりすることになっている。優勝者は、日本に初めて行くので、とてもうれしいと語った。',
  ],
  61: [
    'これは図書館からのお知らせである。',
    'ふじ図書館をご利用の皆様へ',
    'いつもふじ図書館を利用していただき、ありがとうございます。本、CDの整理を以下の日程で行います。この整理期間中は、図書館は休館いたします。ご注意ください。',
    '12月9日（月）～12月12日（木）',
    '休館中は窓口での返却はできません。本は入口横にある返却用の図書館ポストに入れてください。CDについては、ポストの利用はできませんので、12月13日以降、窓口にお返しください。',
    'ご協力をお願いいたします。11月29日　ふじ図書館',
  ],
  62: [
    '市役所に、子どもたちが描いた「緑の丘から見た町の景色」の絵が飾られていた。その中に一つ、ほかとは違う絵があった。ほかの絵には丘から見える家や木などが描かれているのに、その絵だけは、紙全体が青い色で塗られ、あちらこちらに白いものが描かれていた。たぶん、この絵を描いた子どもは、丘の上から町を見ているうちに空の青さと流れていく雲に心をひかれていったのだろう。そして、その空の美しさを紙いっぱいに描いたのではないだろうか。',
  ],
}
for (const [number, paragraphs] of Object.entries(reading)) {
  const question = questions.get(Number(number))
  if (!question) throw new Error(`Reading question ${number} is missing`)
  question.passage = html(paragraphs)
}

fs.writeFileSync(file, `${JSON.stringify(exams, null, 2)}\n`, 'utf8')
console.log('Updated 5 star questions, 5 cloze questions, and 4 reading passages from the December 2013 source paper.')
