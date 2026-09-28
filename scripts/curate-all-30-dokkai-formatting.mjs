import fs from 'node:fs'
import path from 'node:path'

const masterFile = path.resolve('data/jlpt_n3_toan_master.json')
const exams = JSON.parse(fs.readFileSync(masterFile, 'utf8'))

let totalModifications = 0

function polishPassage(text) {
  if (!text || typeof text !== 'string') return text
  let s = text

  const orig = s

  // 1. Email header breaks:
  // e.g. "あて先：...件名：" -> "あて先：...<br>件名："
  s = s.replace(/([^\s<br>]+@(groups\.ac\.jp|kinkyugoyana-daigaku\.ac\.jp|nihonnote\.co\.jp|hokutodenko\.co\.jp|[a-zA-Z0-9._%+-]+))\s*(件名|件\s*名)[：:]/g, '$1<br>$3：')
  s = s.replace(/(あて先|宛先)[：:]\s*([^\s<br]+)\s*(件名|件\s*名)[：:]/g, '$1：$2<br>$3：')
  s = s.replace(/(件名|件\s*名)[：:]\s*([^<br]+?)\s*(送信日時|発信日時)[：:]/g, '$1：$2<br>$3：')
  s = s.replace(/(送信日時|発信日時)[：:]\s*([\d\s年月日時:：]+)\s*(学生のみなさん|皆[様さま]|川島先生|北東電気|日本ノート|山田様)/g, '$1：$2<br>$3')

  // 2. Specific email salutations / bodies
  // 2010-07 Q61
  s = s.replace(/件名：「新学期向け文房具」について\s*日本ノート社\s*営業部和田様いつもお世話になっております。/g,
    '件名：「新学期向け文房具」について<br>日本ノート社<br>営業部 和田様<br>いつもお世話になっております。')
  s = s.replace(/よろしくお願いいたします。<br>川村デパート文房具担当鈴木みどり/g,
    'よろしくお願いいたします。<br>川村デパート<br>文房具担当 鈴木みどり')

  // 2011-07 Q59
  s = s.replace(/先生からのメモが置いてある。<br>中村さんおはようございます昨日/g,
    '先生からのメモが置いてある。<br>中村さん<br>おはようございます。<br>昨日')

  // 2011-07 Q60
  s = s.replace(/送信日時：2011年6月 30 日 16：20川島先生のお別れ会について/g,
    '送信日時：2011年6月 30 日 16：20<br>川島先生のお別れ会について')
  s = s.replace(/午後7時―9 時会場：レストラン（春）会費：3000円記念品代：500円（記念品代だけを 7 月中に払ってください。<br>太田/g,
    '午後7時―9 時<br>会場：レストラン（春）<br>会費：3000円<br>記念品代：500円（記念品代だけを 7 月中に払ってください。）<br>太田')

  // 2011-07 M4
  s = s.replace(/・ホテルには屋内プールがありま<br>/g,
    '・ホテルには屋内プールがあります<br>')

  // 2011-12 Q59
  s = s.replace(/田中真一様今回は、/g,
    '田中真一様<br>今回は、')

  // 2012-12 Q59
  s = s.replace(/送信日時 : 2012 年 11 月 21 日 9:45北東電気工業 山田様いつもお世話になっております。/g,
    '送信日時 : 2012 年 11 月 21 日 9:45<br>北東電気工業 山田様<br>いつもお世話になっております。')
  s = s.replace(/日 時 : 12 月 11 日\(火\) 14~16 時場 所 : 岩丸工業ビル 3 階会議室出席者 : 田中様/g,
    '日 時 : 12 月 11 日(火) 14~16 時<br>場 所 : 岩丸工業ビル 3 階会議室<br>出席者 : 田中様')
  s = s.replace(/よろしくお願いいたします。<br>岩丸工業 野口/g,
    'よろしくお願いいたします。<br>岩丸工業<br>野口')

  // 2013-07 Q59
  s = s.replace(/営業部の皆様お疲れさまです。/g,
    '営業部の皆様<br>お疲れさまです。')

  // 2013-07 Q61
  s = s.replace(/田中先生講演会準備メモ日時、場所：/g,
    '田中先生講演会準備メモ<br>日時、場所：')
  s = s.replace(/市民文化センター司会 町村さんに/g,
    '市民文化センター<br>司会 町村さんに')
  s = s.replace(/持っていってもらうパソコン 当日/g,
    '持っていってもらう<br>パソコン 当日')
  s = s.replace(/先生に確認する花束 1 日までに/g,
    '先生に確認する<br>花束 1 日までに')

  // 2013-12 Q59
  s = s.replace(/交流会にご出席のみなさんこんにちは、田中です。/g,
    '交流会にご出席のみなさん<br>こんにちは、田中です。')
  s = s.replace(/寺前テニスクラブ代表 田中真理子/g,
    '寺前テニスクラブ代表<br>田中真理子')

  // 2014-07 Q60
  s = s.replace(/エミリさんこんにちは。/g,
    'エミリさん<br>こんにちは。')
  s = s.replace(/matsuri\.info\.htmlチョウ/g,
    'matsuri.info.html<br>チョウ')

  // 2015-07 Q59
  s = s.replace(/コーヒー教室のご案内コーヒーについて/g,
    'コーヒー教室のご案内<br>コーヒーについて')
  s = s.replace(/13：00~15：00場 所：コーヒー「ふかだ」参加費：1,500 円定 員：10 名/g,
    '13：00~15：00<br>場 所：コーヒー「ふかだ」<br>参加費：1,500 円<br>定 員：10 名')

  // 2015-07 Q60
  s = s.replace(/山下先生ごぶさたしています。タインです花村日本語学校では/g,
    '山下先生<br>ごぶさたしています。タインです。<br>花村日本語学校では')

  // 2015-12 Q61
  s = s.replace(/集合場所：第一公園活動内容：町内のゴミ拾い持ち物 ：手袋/g,
    '集合場所：第一公園<br>活動内容：町内のゴミ拾い<br>持ち物：手袋')
  s = s.replace(/帯川町町内会電話：222-33\(森口\)obikawacho/g,
    '帯川町町内会<br>電話：222-33(森口)<br>obikawacho')

  // 2016-07 Q59
  s = s.replace(/皆様ごぶさたしています。/g,
    '皆様<br>ごぶさたしています。')
  s = s.replace(/odori-kyoushitsu\.co\.jp小林真由/g,
    'odori-kyoushitsu.co.jp<br>小林真由')

  // 2016-12 Q59
  s = s.replace(/送信日時：2016 年 12 月 1 日 7:00学生のみなさん現在、/g,
    '送信日時：2016 年 12 月 1 日 7:00<br>学生のみなさん<br>現在、')

  // 2016-12 Q62
  s = s.replace(/パクさん先週の/g,
    'パクさん<br>先週の')
  s = s.replace(/12 月 1 日（木）19:30黒田/g,
    '12 月 1 日（木）19:30<br>黒田')

  // 2017-12 Q60
  s = s.replace(/ラナさんこんにちは。/g,
    'ラナさん<br>こんにちは。')

  // 2017-12 Q61
  s = s.replace(/寺市商店寺市様いつもお世話になっております。/g,
    '寺市商店 寺市様<br>いつもお世話になっております。')
  s = s.replace(/ナカノ文房具中野/g,
    'ナカノ文房具<br>中野')

  // 2018-07 Q59
  s = s.replace(/田中先生ごぶさたしております。/g,
    '田中先生<br>ごぶさたしております。')
  s = s.replace(/4 月 10 日カレン・コルベイKaren_beil@xxmail\.com/g,
    '4 月 10 日<br>カレン・コルベイ<br>Karen_beil@xxmail.com')

  // 2018-07 Q62
  s = s.replace(/内田さん今、/g,
    '内田さん<br>今、')
  s = s.replace(/よろしくお願いします野村/g,
    'よろしくお願いします。<br>野村')

  // 2018-12 Q61
  s = s.replace(/原さんお疲れさまです。/g,
    '原さん<br>お疲れさまです。')

  // 2020-12 Q60
  s = s.replace(/9 時に集合してください集合場所：第一公園活動内容：町内のゴミ拾い持ち物：手袋/g,
    '9 時に集合してください。<br>集合場所：第一公園<br>活動内容：町内のゴミ拾い<br>持ち物：手袋')
  s = s.replace(/帯川町町内会電話：222―333（森口）obikawacho@xxmail\.com/g,
    '帯川町町内会<br>電話：222―333（森口）<br>obikawacho@xxmail.com')

  // 2020-12 Q61
  s = s.replace(/営業部の皆様お疲れ様です。/g,
    '営業部の皆様<br>お疲れ様です。')

  if (s !== orig) {
    totalModifications++
  }

  return s
}

for (const exam of exams) {
  for (const part of exam.parts) {
    if (part.passage) {
      part.passage = polishPassage(part.passage)
    }
    for (const q of part.questions || []) {
      if (q.passage) {
        q.passage = polishPassage(q.passage)
      }
    }
  }
}

fs.writeFileSync(masterFile, JSON.stringify(exams, null, 2), 'utf8')
console.log(`Polished ${totalModifications} passages across the 30 exams.`)
