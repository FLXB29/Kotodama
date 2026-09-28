import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'

const root = path.resolve('.')
const masterPath = path.join(root, 'data/jlpt_n3_toan_master.json')
const sectionMasterPath = path.join(root, 'data/jlpt_full_master.json')
const curatedPath = path.join(root, 'data/jlpt_n3_explanations_curated.json')
const reportPath = path.join(root, 'reports/n3-quality-audit/vocabulary-2020-12-equivalents-review.json')
const examId = 'toan-n3-202012-full'
const sectionExamId = 'cm2u2xg4300wm134izpbjrysi-vocab'

const reviews = [
  {
    number: 26,
    answer: 4,
    prompt: '電話で<u>価格</u>を聞いてみた。',
    options: ['結果', '返事', '都合', '値段'],
    explanation: [
      'Đáp án 4 — 「価格（かかく）」là giá cả/giá bán; trong câu này có thể thay bằng 「値段（ねだん）」 mà nghĩa không đổi.',
      'Dịch: “Tôi đã thử hỏi giá qua điện thoại.” 「聞いてみた」diễn tả việc thử hỏi để biết giá.',
      '1. 結果（けっか）: kết quả/kết cục; là điều thu được sau một việc, không phải số tiền phải trả.',
      '2. 返事（へんじ）: câu trả lời/hồi đáp; có thể là điều người bán nói qua điện thoại nhưng không đồng nghĩa với giá cả.',
      '3. 都合（つごう）: sự thuận tiện, tình hình hoặc lịch sắp xếp; không chỉ giá tiền.',
      '4. 値段（ねだん）: giá cả/giá tiền; gần nghĩa nhất với 価格.',
      'Ghi nhớ: 商品の価格・値段を聞く = hỏi giá món hàng; 返事を聞く = nghe câu trả lời.',
    ].join('\n'),
  },
  {
    number: 27,
    answer: 3,
    prompt: 'これは<u>らくな</u>仕事ではない。',
    options: ['安全な', '危険な', '簡単な', '大変な'],
    explanation: [
      'Đáp án 3 — 「楽（らく）な」ở đây chỉ việc nhẹ nhàng/dễ làm, ít vất vả; trong câu hỏi từ gần nghĩa nhất là 「簡単（かんたん）な」.',
      'Dịch: “Đây không phải là một công việc dễ dàng/nhàn hạ.” Thay 楽な bằng 簡単な vẫn giữ được ý chính của câu.',
      '1. 安全な（あんぜんな）: an toàn; nói về mức độ nguy hiểm, không nói công việc dễ hay vất vả.',
      '2. 危険な（きけんな）: nguy hiểm; nói về rủi ro và gần đối nghĩa với 安全な.',
      '3. 簡単な（かんたんな）: đơn giản/dễ; là lựa chọn gần nghĩa nhất với 楽な trong cụm 仕事.',
      '4. 大変な（たいへんな）: vất vả/khó khăn; thường gợi công việc nặng nhọc, nên không thay được 楽な với cùng nghĩa.',
      'Ghi nhớ: 楽な仕事 = công việc nhẹ nhàng, đỡ vất vả; 安全な仕事 = công việc an toàn. Ở câu phủ định, “không phải việc nhàn/dễ” vẫn giữ nguyên quan hệ từ gần nghĩa giữa 楽な và 簡単な.',
    ].join('\n'),
  },
  {
    number: 28,
    answer: 1,
    prompt: 'この用紙はあとで<u>回収します</u>。',
    options: ['あつめます', 'おくります', 'わたします', 'すてます'],
    explanation: [
      'Đáp án 1 — 「回収（かいしゅう）します」nghĩa là thu hồi/thu gom lại; trong câu, cách nói gần nghĩa nhất là 「集めます（あつめます）」.',
      'Dịch: “Tờ giấy này lát nữa sẽ được thu lại.” Chủ thể ngầm hiểu là người phụ trách sẽ đi thu các tờ giấy.',
      '1. あつめます（集めます）: thu gom/tập hợp; đúng với việc thu các tờ giấy lại.',
      '2. おくります（送ります）: gửi/chuyển đi; là đưa vật đến nơi khác, không phải thu về.',
      '3. わたします（渡します）: trao/đưa tận tay; chỉ hành động giao vật cho ai đó.',
      '4. すてます（捨てます）: vứt bỏ; là bỏ đi chứ không thu lại.',
      'Ghi nhớ: 用紙を回収する／集める = thu lại/thu gom giấy; 荷物を送る = gửi đồ.',
    ].join('\n'),
  },
  {
    number: 29,
    answer: 1,
    prompt: 'わたしの<u>めい</u>はみんな海外に住んでいます。',
    options: ['兄弟の娘', '兄弟の息子', '両親の姉', '両親の兄'],
    explanation: [
      'Đáp án 1 — 「めい（姪）」là con gái của anh/chị/em mình, tương ứng với 「兄弟の娘」.',
      'Dịch: “Các cháu gái tôi đều sống ở nước ngoài.” Ở đây, 姪 là con gái của anh/chị/em người nói; 「みんな」nói về tất cả các cháu gái ấy.',
      '1. 兄弟の娘（きょうだいのむすめ）: con gái của anh/chị/em; chính là 姪（めい）.',
      '2. 兄弟の息子（きょうだいのむすこ）: con trai của anh/chị/em; đó là cháu trai 甥（おい）, không phải 姪.',
      '3. 両親の姉（りょうしんのあね）: chị gái của cha hoặc mẹ; là bác gái/dì của người nói, không phải cháu gái.',
      '4. 両親の兄（りょうしんのあに）: anh trai của cha hoặc mẹ; là bác/cậu của người nói, không phải 姪.',
      'Ghi nhớ: 姪（めい）= con gái của anh chị em mình; 甥（おい）= con trai của anh chị em mình.',
    ].join('\n'),
  },
  {
    number: 30,
    answer: 2,
    prompt: 'おばあちゃんからお<u>こづかい</u>をもらった。',
    options: ['お菓子', 'お金', 'おもちゃ', 'おみやげ'],
    explanation: [
      'Đáp án 2 — 「おこづかい（お小遣い）」là tiền tiêu vặt/tiền được cho để tự chi tiêu; vì vậy từ phù hợp là 「お金（おかね）」.',
      'Dịch: “Tôi đã được bà cho tiền tiêu vặt.” 「もらった」nghĩa là đã nhận/được cho.',
      '1. お菓子（おかし）: bánh kẹo/đồ ngọt; là đồ ăn, không phải khoản tiền tiêu vặt.',
      '2. お金（おかね）: tiền; おこづかい là một khoản tiền dành cho chi tiêu cá nhân.',
      '3. おもちゃ: đồ chơi; là vật để chơi, không phải tiền.',
      '4. おみやげ: quà lưu niệm/quà mang về sau chuyến đi; là món quà hiện vật, không đồng nghĩa với tiền tiêu vặt.',
      'Ghi nhớ: おこづかいをもらう = được cho tiền tiêu vặt; おみやげをもらう = được tặng quà lưu niệm.',
    ].join('\n'),
  },
]

const answerKey = [4, 3, 1, 1, 2]
const normalize = (value) =>
  String(value || '')
    .normalize('NFKC')
    .replace(/^\s*[1-4][.)．、\s　]*/u, '')
    .replace(/\s+/gu, '')
    .trim()
const master = JSON.parse(fs.readFileSync(masterPath, 'utf8'))
const sectionMaster = JSON.parse(fs.readFileSync(sectionMasterPath, 'utf8'))
const curated = JSON.parse(fs.readFileSync(curatedPath, 'utf8'))
const exam = master.find((entry) => entry.id === examId)
assert.ok(exam, `Missing JLPT N3 ${examId} exam`)
const questions = exam.parts.flatMap((part) => part.questions || [])
const sectionExam = sectionMaster.find((entry) => entry.id === sectionExamId)
assert.ok(sectionExam, `Missing JLPT N3 section exam ${sectionExamId}`)
const sectionQuestions = sectionExam.parts.flatMap((part) => part.questions || [])

for (const [index, row] of reviews.entries()) {
  const question = questions.find((entry) => Number(entry.number) === row.number)
  assert.ok(question, `Missing question ${row.number}`)
  assert.equal(Number(question.answer), answerKey[index], `Stored answer differs at question ${row.number}`)
  assert.equal(Number(question.correctAnswer), answerKey[index], `Correct-answer field differs at question ${row.number}`)
  assert.deepEqual(question.options.map((option) => normalize(option)), row.options.map(normalize), `Options changed at question ${row.number}`)
  assert.ok(row.explanation.startsWith(`Đáp án ${row.answer} —`), `Explanation label differs at question ${row.number}`)
  assert.ok(row.explanation.includes('Dịch:'), `Missing translation at question ${row.number}`)
  for (let option = 1; option <= 4; option++) {
    assert.ok(row.explanation.includes(`\n${option}. `), `Missing option ${option} explanation at question ${row.number}`)
  }
  question.explanation = row.explanation
  curated[question.id] = row.explanation

  const sectionQuestion = sectionQuestions.find((entry) => Number(entry.number) === row.number)
  assert.ok(sectionQuestion, `Missing standalone section question ${row.number}`)
  assert.equal(sectionQuestion.options.length, 4, `Unexpected standalone option count at question ${row.number}`)
  sectionQuestion.question = row.prompt
  sectionQuestion.sentence = row.prompt
  sectionQuestion.options = sectionQuestion.options.map((option, optionIndex) => ({
    ...option,
    text: row.options[optionIndex],
  }))
  sectionQuestion.answer = String(row.answer)
  sectionQuestion.correctAnswer = String(row.answer)
  curated[sectionQuestion.id] = row.explanation
}

fs.writeFileSync(masterPath, `${JSON.stringify(master, null, 2)}\n`)
fs.writeFileSync(sectionMasterPath, `${JSON.stringify(sectionMaster, null, 2)}\n`)
fs.writeFileSync(curatedPath, `${JSON.stringify(curated, null, 2)}\n`)
fs.mkdirSync(path.dirname(reportPath), { recursive: true })
fs.writeFileSync(
  reportPath,
  `${JSON.stringify(
    {
      reviewedOn: '2026-09-27',
      examId,
      sectionExamId,
      section: 'Từ vựng – Mondai 4 (đề đầy đủ)',
      scope: 'Questions 26–30: translate each prompt and explain the target word, correct answer, all distractors, and usage contrasts.',
      answerKeysChanged: 1,
      fullMockAnswerKeysChanged: 0,
      standaloneAnswerKeysChanged: 1,
      answerKeys: answerKey,
      dataNote: 'Before this review, the standalone 12/2020 vocabulary exam record had unrelated prompts/options at questions 26–30 (including a prompt independently identified as a 2010 July N3 item). Those five standalone prompts/options were replaced with the matching 12/2020 full-mock content; the stored keys were verified against two third-party answer-key tables, and question 28 was corrected from 3 to 1. The old standalone IDs were preserved for attempt-history continuity.',
      sources: [
        {
          url: 'https://tiengnhatvui.com/luyen-thi-tu-vung-jlpt-n3-de-20.html',
          type: 'Third-party page reproducing the 12/2020 N3 vocabulary questions and choices; not an official JLPT source.',
        },
        {
          url: 'https://chuyenngoaingu.com/news/de-thi-va-dap-an-jlpt-ky-thi-thang-12-2020-nang-luc-tieng-nhat-5276.aspx',
          type: 'Third-party answer-key compilation; agrees on answers 26–30, official status not established.',
        },
        {
          url: 'https://www.tiengnhatdongian.com/dap-an-jlpt-n3-12-2020/',
          type: 'Independent third-party answer-key compilation; agrees on answers 26–30, official status not established.',
        },
        {
          url: 'https://www.ecustpress.cn/i/files/read/562837763.pdf',
          type: 'Separate 2010 July N3 vocabulary source; corroborates that the standalone question 28 “休みが明けたら” belongs to the 2010 exam, not this review.',
        },
      ],
      method: 'Matched the prompt and all four options to the 12/2020 full-mock record and a third-party reproduction of the exam, then checked the answer sequence against two agreeing third-party key tables. Answer keys were corrected only where the standalone source was demonstrably mismatched; IDs were kept stable.',
      standaloneRepair: {
        questionNumbers: reviews.map(({ number }) => number),
        previousAnswerAtQuestion28: 3,
        verifiedAnswerAtQuestion28: 1,
        idsPreserved: true,
      },
      rows: reviews.map(({ number, answer, options, prompt, explanation }) => ({
        number,
        answer,
        options,
        prompt,
        answerPreserved: true,
        includesTranslation: explanation.includes('Dịch:'),
        explainsAllFourChoices: [1, 2, 3, 4].every((option) => explanation.includes(`\n${option}. `)),
        explanation,
      })),
    },
    null,
    2,
  )}\n`,
)

console.log('Reviewed and synchronized JLPT N3 12/2020 vocabulary questions 26–30; corrected the standalone source mismatch and preserved question IDs.')
