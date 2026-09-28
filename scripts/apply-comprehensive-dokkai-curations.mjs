import fs from 'node:fs'
import path from 'node:path'

const masterFile = path.resolve('data/jlpt_n3_toan_master.json')
const exams = JSON.parse(fs.readFileSync(masterFile, 'utf8'))

let totalFixes = 0

function replaceInString(str, from, to, desc) {
  if (typeof str !== 'string') return str
  if (str.includes(from)) {
    totalFixes++
    console.log(`[FIX] ${desc}: replaced "${from.slice(0, 30)}..." with "${to.slice(0, 30)}..."`)
    return str.replace(from, to)
  }
  return str
}

for (const exam of exams) {
  for (const part of exam.parts || []) {
    // 1. Watermarks in part.passage
    if (part.passage) {
      if (exam.id === 'toan-n3-202412-full' && part.passage.includes('N3 12/2024</p>')) {
        part.passage = replaceInString(part.passage, ' N3 12/2024</p>', '</p>', `${exam.id} ${part.title} watermark`)
      }
      if (exam.id === 'toan-n3-202407-full' && part.passage.includes('N3 7/2024</p>')) {
        part.passage = replaceInString(part.passage, ' N3 7/2024</p>', '</p>', `${exam.id} ${part.title} watermark`)
      }
      if (exam.id === 'toan-n3-202312-full' && part.passage.includes('N3 12/2023</p>')) {
        part.passage = replaceInString(part.passage, ' N3 12/2023</p>', '</p>', `${exam.id} ${part.title} watermark`)
      }
      if (exam.id === 'toan-n3-201112-full' && part.passage.includes('1600 円JLPT・N3・12/2011<br>')) {
        part.passage = replaceInString(part.passage, '1600 円JLPT・N3・12/2011<br>', '1600 円<br>', `${exam.id} ${part.title} watermark`)
      }
      if (exam.id === 'toan-n3-201107-full' && part.passage.includes('キャンセル料がかかります。JLPT・N3・7/2011</p>')) {
        part.passage = replaceInString(part.passage, 'キャンセル料がかかります。JLPT・N3・7/2011</p>', 'キャンセル料がかかります。</p>', `${exam.id} ${part.title} watermark`)
      }
      if (exam.id === 'toan-n3-201007-full' && part.passage.includes('（23）かもしれません。JLPT・N3・7/2010</p>')) {
        part.passage = replaceInString(part.passage, '（23）かもしれません。JLPT・N3・7/2010</p>', '（23）かもしれません。</p>', `${exam.id} ${part.title} watermark`)
      }
    }

    // 2. Questions
    for (const q of part.questions || []) {
      if (q.passage) {
        // Watermarks in q.passage
        if (q.passage.includes('JLPT・N3・12/2025</p>')) {
          q.passage = replaceInString(q.passage, 'JLPT・N3・12/2025</p>', '</p>', `${exam.id} Q${q.id} watermark`)
        }
        if (q.passage.includes(' N3 7/2025</p>')) {
          q.passage = replaceInString(q.passage, ' N3 7/2025</p>', '</p>', `${exam.id} Q${q.id} watermark`)
        }
        if (q.passage.includes(' N3 7/2025ものを一つえらびなさい。')) {
          q.passage = replaceInString(q.passage, ' N3 7/2025ものを一つえらびなさい。', 'ものを一つえらびなさい。', `${exam.id} Q${q.id} watermark`)
        }
        if (q.passage.includes(' N3 12/2024</p>')) {
          q.passage = replaceInString(q.passage, ' N3 12/2024</p>', '</p>', `${exam.id} Q${q.id} watermark`)
        }
        if (q.passage.includes(' N3 7/2024</p>')) {
          q.passage = replaceInString(q.passage, ' N3 7/2024</p>', '</p>', `${exam.id} Q${q.id} watermark`)
        }
        if (q.passage.includes(' N3 12/2023</p>')) {
          q.passage = replaceInString(q.passage, ' N3 12/2023</p>', '</p>', `${exam.id} Q${q.id} watermark`)
        }
        if (q.passage.includes('順番であった。JLPT・N3・12/2011この結果から')) {
          q.passage = replaceInString(q.passage, '順番であった。JLPT・N3・12/2011この結果から', '順番であった。<br>この結果から', `${exam.id} Q${q.id} watermark`)
        }
        if (q.passage.includes('神社をJLPT・N3・12/2011掃除していた人に')) {
          q.passage = replaceInString(q.passage, '神社をJLPT・N3・12/2011掃除していた人に', '神社を掃除していた人に', `${exam.id} Q${q.id} watermark`)
        }
        if (q.passage.includes('走る楽しみを生むのです。JLPT・N3・12/2011それには')) {
          q.passage = replaceInString(q.passage, '走る楽しみを生むのです。JLPT・N3・12/2011それには', '走る楽しみを生むのです。<br>それには', `${exam.id} Q${q.id} watermark`)
        }
        if (q.passage.includes('太田JLPT・N3・7/2011</p>')) {
          q.passage = replaceInString(q.passage, '太田JLPT・N3・7/2011</p>', '太田</p>', `${exam.id} Q${q.id} watermark`)
        }
        if (q.passage.includes('ご覧ください)JLPT・N3・7/2010川田美術館</p>')) {
          q.passage = replaceInString(q.passage, 'ご覧ください)JLPT・N3・7/2010川田美術館</p>', 'ご覧ください)<br>川田美術館</p>', `${exam.id} Q${q.id} watermark`)
        }

        // Trailing page numbers in q.passage
        if (q.passage.includes('引っ越しをしなくてもよさそうである。12</p>')) {
          q.passage = replaceInString(q.passage, '引っ越しをしなくてもよさそうである。12</p>', '引っ越しをしなくてもよさそうである。</p>', `${exam.id} Q${q.id} page number`)
        }
        if (q.passage.includes('生活する場所15</p>')) {
          q.passage = replaceInString(q.passage, '生活する場所15</p>', '生活する場所</p>', `${exam.id} Q${q.id} page number`)
        }
        if (q.passage.includes('心から感謝している。16</p>')) {
          q.passage = replaceInString(q.passage, '心から感謝している。16</p>', '心から感謝している。</p>', `${exam.id} Q${q.id} page number`)
        }
        if (q.passage.includes('セールが始まるが、( ) 。18</p>')) {
          q.passage = replaceInString(q.passage, 'セールが始まるが、( ) 。18</p>', 'セールが始まるが、( ) 。</p>', `${exam.id} Q${q.id} page number`)
        }
        if (q.passage.includes('9 月 10 日小川 進20</p>')) {
          q.passage = replaceInString(q.passage, '9 月 10 日小川 進20</p>', '9 月 10 日<br>小川 進</p>', `${exam.id} Q${q.id} page number & layout`)
        }
        if (q.passage.includes('本田みどり9</p>')) {
          q.passage = replaceInString(q.passage, '本田みどり9</p>', '本田みどり</p>', `${exam.id} Q${q.id} page number`)
        }
        if (q.passage.includes('「国際経済学」 横原真―10</p>')) {
          q.passage = replaceInString(q.passage, '翌週<br>7 月 18 日の授業時に必ず出してください。<br>「国際経済学」 横原真―10</p>', '翌週 7 月 18 日の授業時に必ず出してください。<br>「国際経済学」 横原真一</p>', `${exam.id} Q${q.id} page number & name typo`)
        }
        if (q.passage.includes('いい授業だと思った。13</p>')) {
          q.passage = replaceInString(q.passage, 'いい授業だと思った。13</p>', 'いい授業だと思った。</p>', `${exam.id} Q${q.id} page number`)
        }
        if (q.passage.includes('(注 2)抜ける:取れる10</p>')) {
          q.passage = replaceInString(q.passage, '(注 2)抜ける:取れる10</p>', '(注 2)抜ける:取れる</p>', `${exam.id} Q${q.id} page number`)
        }
        if (q.passage.includes('いい買い物をしたと、今でも思っている。12</p>')) {
          q.passage = replaceInString(q.passage, 'いい買い物をしたと、今でも思っている。12</p>', 'いい買い物をしたと、今でも思っている。</p>', `${exam.id} Q${q.id} page number`)
        }
        if (q.passage.includes('移り住む人が増えてくれるとうれしいです。13</p>')) {
          q.passage = replaceInString(q.passage, '移り住む人が増えてくれるとうれしいです。13</p>', '移り住む人が増えてくれるとうれしいです。</p>', `${exam.id} Q${q.id} page number`)
        }
        if (q.passage.includes('話も納得できる。10</p>')) {
          q.passage = replaceInString(q.passage, '話も納得できる。10</p>', '話も納得できる。</p>', `${exam.id} Q${q.id} page number`)
        }
        if (q.passage.includes('静かで落ち着いた場所であってほしいと思うのだ。12</p>')) {
          q.passage = replaceInString(q.passage, '静かで落ち着いた場所であってほしいと思うのだ。12</p>', '静かで落ち着いた場所であってほしいと思うのだ。</p>', `${exam.id} Q${q.id} page number`)
        }
        if (q.passage.includes('もう一度料金がかかります。9</p>')) {
          q.passage = replaceInString(q.passage, 'もう一度料金がかかります。9</p>', 'もう一度料金がかかります。</p>', `${exam.id} Q${q.id} page number`)
        }
        if (q.passage.includes('私と同じように感じたかもし れない。10</p>')) {
          q.passage = replaceInString(q.passage, '私と同じように感じたかもし れない。10</p>', '私と同じように感じたかもしれない。</p>', `${exam.id} Q${q.id} page number & spacing`)
        }
        if (q.passage.includes('とてもうれしいと語った。9</p>')) {
          q.passage = replaceInString(q.passage, 'とてもうれしいと語った。9</p>', 'とてもうれしいと語った。</p>', `${exam.id} Q${q.id} page number`)
        }
        if (q.passage.includes('喜んでいるそうです。11</p>')) {
          q.passage = replaceInString(q.passage, '喜んでいるそうです。11</p>', '喜んでいるそうです。</p>', `${exam.id} Q${q.id} page number`)
        }
        if (q.passage.includes('心から感謝している。12</p>')) {
          q.passage = replaceInString(q.passage, '心から感謝している。12</p>', '心から感謝している。</p>', `${exam.id} Q${q.id} page number`)
        }
        if (q.passage.includes('<p>6 つぎの文章を読んで、質問に答えなさい。')) {
          q.passage = replaceInString(q.passage, '<p>6 つぎの文章を読んで、質問に答えなさい。', '<p>つぎの文章を読んで、質問に答えなさい。', `${exam.id} Q${q.id} leading digit`)
        }

        // Specific passage formatting
        // 2025-07 Q58
        if (exam.id === 'toan-n3-202507-full' && q.id === 'toan_q_2025_07_58') {
          q.passage = replaceInString(q.passage, 'ジョンさん先週は、製品発表会の英語資料のチェックをしてくれて、ありがとうございました。', 'ジョンさん<br>先週は、製品発表会の英語資料のチェックをしてくれて、ありがとうございました。', `${exam.id} Q58 greeting break`)
        }
        // 2024-12 Q58
        if (exam.id === 'toan-n3-202412-full' && q.id === 'toan_q_2024_12_58') {
          q.passage = replaceInString(q.passage, 'ミゲルさんメールをありがとう。', 'ミゲルさん<br>メールをありがとう。', `${exam.id} Q58 greeting break`)
        }
        // 2024-07 Q58
        if (exam.id === 'toan-n3-202407-full' && q.id === 'toan_q_2024_07_58') {
          q.passage = replaceInString(q.passage, '部長会議にご出席予定の皆様へあさって 12 日(金)の部長会議について、ご連絡します。', '部長会議にご出席予定の皆様へ<br>あさって 12 日(金)の部長会議について、ご連絡します。', `${exam.id} Q58 greeting break`)
        }
        // 2023-12 Q58
        if (exam.id === 'toan-n3-202312-full' && q.id === 'toan_q_2023_12_58') {
          q.passage = replaceInString(q.passage, '村田新一様チケット代金を支払っていただき、ありがとうございました。', '村田新一様<br>チケット代金を支払っていただき、ありがとうございました。', `${exam.id} Q58 greeting break`)
          q.passage = replaceInString(q.passage, '東王映画館インターネットチケット予約サービスお問い合わせ 061-987-6543', '東王映画館 インターネットチケット予約サービス<br>お問い合わせ 061-987-6543', `${exam.id} Q58 signature break`)
        }
        // 2023-07 Q58
        if (exam.id === 'toan-n3-202307-full' && q.id === 'toan_q_2023_07_58') {
          q.passage = replaceInString(q.passage, '8 月 11 日・12 日にホテル岩中にお泊まりのお客様「岩中村 夏祭り」のご案内', '8 月 11 日・12 日にホテル岩中にお泊まりのお客様<br>「岩中村 夏祭り」のご案内', `${exam.id} Q58 title break`)
        }
        // 2022-12 Q60
        if (exam.id === 'toan-n3-202212-full' && q.id === 'toan_q_2022_12_60') {
          q.passage = replaceInString(q.passage, '寺坂ゆき様いつもご利用いただき、ありがとうございます。', '寺坂ゆき様<br>いつもご利用いただき、ありがとうございます。', `${exam.id} Q60 greeting break`)
        }
        // 2022-07 Q58
        if (exam.id === 'toan-n3-202207-full' && q.id === 'toan_q_2022_07_58') {
          const oldPassage = '<p>これはある旅行会社が客の水川さんに書いたメールである。<br>水川真理様「京都の旅 2 泊 3 日」へのお申し込み、ありがとうございました。下のご予約内容を確認していただき、ご出発日の 1 週間前までに旅行代金をお振り込みください。<br>なお、ご出発日の 20 日前以降のお取り消しには、キャンセル料が発生します(20 日前～8 日前まで 20%、7 日前～前日まで 30%、当日 100%)。<br>ご質問などございましたら、ご連絡ください。<br>&lt;ご予約内容&gt;<br>ツアー名：京都の旅 2 泊 3 日出発日：2 月 13 日代金合計：86,000 円 (税込)振り込み先：あおば銀行西島支店 普通 1234567 石野旅行石野旅行 予約課 岩坂電話：051-960-7451 FAX：051-960-74529</p>'
          const newPassage = '<p>これはある旅行会社が客の水川さんに書いたメールである。<br>水川真理様<br>「京都の旅 2 泊 3 日」へのお申し込み、ありがとうございました。下のご予約内容を確認していただき、ご出発日の 1 週間前までに旅行代金をお振り込みください。<br>なお、ご出発日の 20 日前以降のお取り消しには、キャンセル料が発生します(20 日前～8 日前まで 20%、7 日前～前日まで 30%、当日 100%)。<br>ご質問などございましたら、ご連絡ください。<br>&lt;ご予約内容&gt;<br>ツアー名：京都の旅 2 泊 3 日<br>出発日：2 月 13 日<br>代金合計：86,000 円 (税込)<br>振り込み先：あおば銀行西島支店 普通 1234567<br>石野旅行 予約課 岩坂<br>電話：051-960-7451 FAX：051-960-7452</p>'
          q.passage = replaceInString(q.passage, oldPassage, newPassage, `${exam.id} Q58 format layout`)
        }
        // 2021-12 Q58
        if (exam.id === 'toan-n3-202112-full' && q.id === 'toan_q_2021_12_58') {
          const oldPassage = '<p>これは、マラソン大会を手伝ってくれる人を募集するお知らせである。<br>第 3 回山川市マラソン大会大会当日に手伝ってくださる方、大募集!<br>日時:4 月 17 日(土)午前 7 時〜午後 3 時ごろ場所:山川市民運動場内容:当日の準備や会場案内など募集人数:約 100 人募集期間:1 月 8 日(金)~2 月 12 日(金)お願いする具体的な内容は、3 月下旬に郵送でお知らせいたします。<br>応募できる方:<br>・山川市民で 18 歳以上の方<br>・大会当日の午前 7 時からの説明会に参加できる方特に、マラソン大会を手伝った経験がある方は歓迎します。<br>応募方法:スポーツ課ホームページからお願いします。ホームページが見られない方は、スポーツ課窓口でも受付をいたします。<br>山川市役所スポーツ課マラソン大会係https://yamakawa-shihashiro/<br>E メール:hashiro@yamakawalg.jp</p>'
          const newPassage = '<p>これは、マラソン大会を手伝ってくれる人を募集するお知らせである。<br>第 3 回山川市マラソン大会<br>大会当日に手伝ってくださる方、大募集!<br>日時: 4 月 17 日(土) 午前 7 時〜午後 3 時ごろ<br>場所: 山川市民運動場<br>内容: 当日の準備や会場案内など<br>募集人数: 約 100 人<br>募集期間: 1 月 8 日(金)~2 月 12 日(金)<br>お願いする具体的な内容は、3 月下旬に郵送でお知らせいたします。<br>応募できる方:<br>・山川市民で 18 歳以上の方<br>・大会当日の午前 7 時からの説明会に参加できる方<br>特に、マラソン大会を手伝った経験がある方は歓迎します。<br>応募方法: スポーツ課ホームページからお願いします。ホームページが見られない方は、スポーツ課窓口でも受付をいたします。<br>山川市役所スポーツ課 マラソン大会係<br>https://yamakawa-shihashiro/<br>E メール: hashiro@yamakawalg.jp</p>'
          q.passage = replaceInString(q.passage, oldPassage, newPassage, `${exam.id} Q58 format layout`)
        }
        // 2021-12 Q60
        if (exam.id === 'toan-n3-202112-full' && q.id === 'toan_q_2021_12_60') {
          const oldPassage = '<p>10 月 15 日田中電気株式会社営業部青山一郎様鈴木電気工業株式会社営業第二課 山本和男拝啓いつもお世話になっております。先日はわが社の新製品説明会にご参加くださいまして、ありがとうございました。その他の製品についての説明を、ということでしたので、パンフレットと説明書、価格表をお送りいたします。よろしくお顧いいたします。</p>'
          const newPassage = '<p>10 月 15 日<br>田中電気株式会社 営業部<br>青山一郎 様<br>鈴木電気工業株式会社 営業第二課 山本和男<br>拝啓<br>いつもお世話になっております。<br>先日はわが社の新製品説明会にご参加くださいまして、ありがとうございました。<br>その他の製品についての説明を、ということでしたので、パンフレットと説明書、価格表をお送りいたします。<br>よろしくお願いいたします。</p>'
          q.passage = replaceInString(q.passage, oldPassage, newPassage, `${exam.id} Q60 format letter`)
        }
        // 2019-12 Q59
        if (exam.id === 'toan-n3-201912-full' && q.id === 'toan_q_2019_12_59') {
          q.passage = replaceInString(q.passage, '家庭教師募集医学部受験のため、高校 3 年生の息子に数学を教えてくれる大学生の方を探しています。', '家庭教師募集<br>医学部受験のため、高校 3 年生の息子に数学を教えてくれる大学生の方を探しています。', `${exam.id} Q59 title break`)
        }
        // 2018-12 Q60
        if (exam.id === 'toan-n3-201812-full' && q.id === 'toan_q_2018_12_60') {
          q.passage = replaceInString(q.passage, '自動車通学をしている学生の皆さんへ大学の駐車場の工事を行います。日程は以下のとおりです。', '自動車通学をしている学生の皆さんへ<br>大学の駐車場の工事を行います。日程は以下のとおりです。', `${exam.id} Q60 title break`)
        }
        // 2017-07 Q60
        if (exam.id === 'toan-n3-201707-full' && q.id === 'toan_q_2017_07_60') {
          q.passage = replaceInString(q.passage, '東山機械ダオ 様いつもお世話になっております。', '東山機械<br>ダオ 様<br>いつもお世話になっております。', `${exam.id} Q60 salutation break`)
          q.passage = replaceInString(q.passage, '池中電気池中 正 （ikenaka.t@ikenaka-denki.co.jo）9</p>', '池中電気<br>池中 正 （ikenaka.t@ikenaka-denki.co.jp）</p>', `${exam.id} Q60 signature & domain typo`)
        }
        // 2014-07 Q61
        if (exam.id === 'toan-n3-201407-full' && q.id === 'toan_q_2014_07_61') {
          q.passage = replaceInString(q.passage, '横寺工場ご担当者様J プリントでは、', '横寺工場 ご担当者様<br>J プリントでは、', `${exam.id} Q61 salutation break`)
          q.passage = replaceInString(q.passage, 'J プリント 第 1 営業部山下明夫E メール：Yamashita_a@jprint.co.jpFAX：0712-53-9853</p>', 'J プリント 第 1 営業部<br>山下明夫<br>E メール：Yamashita_a@jprint.co.jp<br>FAX：0712-53-9853</p>', `${exam.id} Q61 signature break`)
        }
        // 2013-12 Q61
        if (exam.id === 'toan-n3-201312-full' && q.id === 'toan_q_2013_12_61') {
          q.passage = replaceInString(q.passage, 'ふじ図書館をご利用の皆様へいつもふじ図書館を利用していただき、ありがとうございます。', 'ふじ図書館をご利用の皆様へ<br>いつもふじ図書館を利用していただき、ありがとうございます。', `${exam.id} Q61 greeting break`)
        }
        // 2012-12 Q59
        if (exam.id === 'toan-n3-201212-full' && q.id === 'toan_q_2012_12_59') {
          q.passage = replaceInString(q.passage, 'あて先 : t.yamada@hokutodenko.co.jp件 名 : 会議日程についてのご連絡送信日時 : 2012 年 11 月 21 日 9:45<br>北東電気工業 山田様', 'あて先 : t.yamada@hokutodenko.co.jp<br>件名 : 会議日程についてのご連絡<br>送信日時 : 2012 年 11 月 21 日 9:45<br>北東電気工業 山田様', `${exam.id} Q59 email headers`)
          q.passage = replaceInString(q.passage, '金子、野口なお、部品のサンプルを郵送しましたので、', '金子、野口<br>なお、部品のサンプルを郵送しましたので、', `${exam.id} Q59 sentence break`)
        }
        // 2012-12 Q62
        if (exam.id === 'toan-n3-201212-full' && q.id === 'toan_q_2012_12_62') {
          q.passage = replaceInString(q.passage, '電車のダイヤが変わりますいつも田村線をご利用いただき、ありがとうございます。', '電車のダイヤが変わります<br>いつも田村線をご利用いただき、ありがとうございます。', `${exam.id} Q62 title break`)
        }
        // 2012-07 Q61
        if (exam.id === 'toan-n3-201207-full' && q.id === 'toan_q_2012_07_61') {
          const oldP = '<p>これは、ピアノ教室の広告である。<br>大人のためのピアノ教室子どものころに習っていた方、もう一度ピアノを始めてみませんか。初めての方にも、丁寧にレッスンいたします。<br>● レッスンの日時や回数、時間の長さはご都合に合わせて決められます。<br>● レッスン料は、30 分 2.000 円(初級)と 2,500 円(中級)です。<br>● ご自宅でのレッスンもいたします。<br>● レッスン時間以外にご利用可能な練習室があります。(有料)ご質問がある方は、お電話ください、また、 レッスンの見学をご希望の方は、まずお電話でご予約をお願いします。<br>寺前音楽教室南区增山 1-1-1<br>01-2345-6789</p>'
          const newP = '<p>これは、ピアノ教室の広告である。<br>大人のためのピアノ教室<br>子どものころに習っていた方、もう一度ピアノを始めてみませんか。初めての方にも、丁寧にレッスンいたします。<br>● レッスンの日時や回数、時間の長さはご都合に合わせて決められます。<br>● レッスン料は、30 分 2,000 円(初級)と 2,500 円(中級)です。<br>● ご自宅でのレッスンもいたします。<br>● レッスン時間以外にご利用可能な練習室があります。(有料)<br>ご質問がある方は、お電話ください。また、レッスンの見学をご希望の方は、まずお電話でご予約をお願いします。<br>寺前音楽教室<br>南区增山 1-1-1<br>01-2345-6789</p>'
          q.passage = replaceInString(q.passage, oldP, newP, `${exam.id} Q61 format piano notice`)
        }
      }
    }
  }
}

fs.writeFileSync(masterFile, JSON.stringify(exams, null, 2), 'utf8')
console.log(`\nSuccessfully applied ${totalFixes} Dokkai curations to ${masterFile}`)
