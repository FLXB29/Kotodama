import fs from 'node:fs'
import path from 'node:path'

const masterPath = path.resolve('data/jlpt_n3_toan_master.json')
const curatedPath = path.resolve('data/jlpt_n3_explanations_curated.json')
const reportPath = path.resolve('reports/n3-quality-audit/reading-source-2016-12-zoo-poster-review.json')
const exams = JSON.parse(fs.readFileSync(masterPath, 'utf8'))
const curated = JSON.parse(fs.readFileSync(curatedPath, 'utf8'))
const exam = exams.find((item) => item.id === 'toan-n3-201612-full')
if (!exam) throw new Error('Could not find N3 December 2016 full exam.')

const part = exam.parts.find((item) => item.title === 'Đọc hiểu - Mondai 4')
const q73 = part?.questions?.find((item) => item.id === 'toan_q_2016_12_73')
const q74 = part?.questions?.find((item) => item.id === 'toan_q_2016_12_74')
if (!part || !q73 || !q74) throw new Error('Could not find zoo-poster reading questions 38 and 39.')
if (part.passage && !part.passage.includes('大原動物園をもっと楽しむために')) {
  throw new Error('Unexpected existing passage on December 2016 reading Mondai 4; refusing to replace it.')
}
if (
  Number(q73.correctAnswer ?? q73.answer) !== 2 ||
  Number(q74.correctAnswer ?? q74.answer) !== 2 ||
  q73.options?.length !== 4 ||
  q74.options?.length !== 4
) {
  throw new Error('Unexpected answer key or option count for the two zoo-poster questions.')
}

const poster = `<h3>大原動物園をもっと楽しむために</h3>
<h4>昼のイベント</h4>
<p>いろいろなイベントに参加して、動物のことをもっとよく知ってください。</p>
<h4>A 動物園案内</h4>
<p>専門の係の説明を受けながら、動物園の中を歩きます。必要時間は約1時間です。<br>毎日3回：①10時半～　②14時半～　③16時～</p>
<h4>B 動物教室</h4>
<p>普段知ることのできない、動物たちの生活について話を聞くことができます。<br>毎週日曜 13時半～15時<br>（途中からでも参加できます）</p>
<h4>C 台所見学</h4>
<p>動物たちのえさを準備しているところが見られます。必要時間は約45分～1時間です。<br>毎週土曜 14時半</p>
<h4>D 川の生き物教室</h4>
<p>川の生き物に実際に触ったりしながら、楽しく学べます。<br>毎週火曜、木曜 15時～16時<br>毎週土曜 13時～14時<br>毎週日曜 11時～12時</p>
<p>申し込む、参加料金 全て不要<br>集合場所 A、C、D：正面口<br>B：資料館1階受付（途中参加の人も）</p>
<h4>夜の動物園</h4>
<p>昼とは違う、夜の動物たちの様子を見てください。<br>日時：8月2日、9日、16日、23日、30日<br>各日 17時半～21時（入園は19時半まで）</p>
<p>入園料：昼と同じ入園料がかかります。</p>
<p>昼の最後入園時間（16時半）までに入園された方は、17時の閉園に一度園の外に出て、17時半に夜の動物園が開園後、もう一度入園料を支払って入園していただく必要があります。</p>
<p>入り口：東口は17時で閉めますので、正面口からお入りください。<br>レストラン、売店 営業しています。</p>`

part.passage = poster
part.instruction =
  '下のページは、「動物園のイベント」についての案内である。これを読んで、下の質問に答えなさい。答えは、1・2・3・4から最もよいものを一つ選びなさい。'
part.sourceTextExtracted = true
part.passageSource = {
  file: '7. N3 12-2016.pdf',
  printedPage: 13,
  transcription: 'PDF text layer checked against the visible poster; corrected OCR line breaks and glyph spacing.',
}
for (const question of [q73, q74]) {
  question.passage = null
  question.sourceTextExtracted = true
}
q73.readingSourcePassage = true
delete q74.readingSourcePassage

curated[q73.id] =
  `Đáp án 2: A và B. Áp phích ghi A có lượt tham quan lúc 14:30; B diễn ra Chủ nhật từ 13:30 đến 15:00 và cho phép tham gia giữa chừng, nên Sophie vẫn kịp tham gia lúc 14:00. C chỉ có vào thứ Bảy; D vào Chủ nhật kết thúc lúc 12:00.`
curated[q74.id] =
  `Đáp án 2: phải ra khỏi vườn thú lúc đóng cửa 17:00 rồi trả vé vào cổng lần nữa khi khu buổi tối mở lúc 17:30. Ngày 9/8 có sự kiện; áp phích cũng yêu cầu vào bằng cổng chính vì cổng Đông đóng lúc 17:00.`
fs.writeFileSync(masterPath, `${JSON.stringify(exams, null, 2)}\n`, 'utf8')
fs.writeFileSync(curatedPath, `${JSON.stringify(curated, null, 2)}\n`, 'utf8')

const report = {
  generatedAt: new Date().toISOString(),
  examId: exam.id,
  sourcePdf: {
    driveFile: '7. N3 12-2016.pdf',
    printedPage: 13,
    visuallyReviewed: true,
    officialAnswerKeyPresent: false,
  },
  passageStorage: 'Shared at the reading-part level so both questions can use the poster without duplicate rendering.',
  questions: [
    {
      id: q73.id,
      fullExamQuestionNumber: 73,
      printedQuestionNumber: 38,
      answer: 2,
      reasoning:
        'At Sunday 14:00, A has a 14:30 tour; B runs 13:30–15:00 and explicitly accepts late participants. C is Saturday-only and D ends at noon Sunday.',
      sourceChecks: [
        'A: daily, 10:30 / 14:30 / 16:00, about one hour',
        'B: Sunday 13:30–15:00, mid-session participation allowed',
        'C: Saturday 14:30',
        'D: Sunday 11:00–12:00',
      ],
    },
    {
      id: q74.id,
      fullExamQuestionNumber: 74,
      printedQuestionNumber: 39,
      answer: 2,
      reasoning:
        'The poster says daytime visitors must exit at 17:00 and pay admission again after the night zoo opens at 17:30; the east gate closes at 17:00, so re-enter via the front entrance.',
      sourceChecks: [
        'August 9 is listed',
        'night opening 17:30–21:00; last entry 19:30',
        'daytime visitors must exit and pay again',
        'use the front entrance',
      ],
    },
  ],
  limitation:
    'The source exam PDF contains no answer key; answers are supported by the poster schedule and question wording, not an independently verified official key.',
}
fs.mkdirSync(path.dirname(reportPath), { recursive: true })
fs.writeFileSync(reportPath, `${JSON.stringify(report, null, 2)}\n`, 'utf8')
console.log(
  'Transcribed the December 2016 zoo poster, linked it once to both reading questions, and wrote concise source-grounded explanations.'
)
