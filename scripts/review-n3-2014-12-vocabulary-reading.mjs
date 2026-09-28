import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'

const root = path.resolve('.')
const masterPath = path.join(root, 'data/jlpt_n3_toan_master.json')
const curatedPath = path.join(root, 'data/jlpt_n3_explanations_curated.json')
const reportPath = path.join(root, 'reports/n3-quality-audit/vocabulary-2014-12-reading-review.json')
const examSource = 'https://www.scribd.com/document/797896241/T12-2014'
const answerSource = 'https://drive.google.com/file/d/1Lmr3LwhnS3lEv4FYemiM0f93Qg5DLNZL/view'

const exams = JSON.parse(fs.readFileSync(masterPath, 'utf8'))
const curated = JSON.parse(fs.readFileSync(curatedPath, 'utf8'))
const exam = exams.find((item) => item.id === 'toan-n3-201412-full')
assert.ok(exam, 'Missing JLPT N3 12/2014 exam')

const questions = new Map(exam.parts.flatMap((part) => part.questions).map((question) => [question.id, question]))
const answerKey = [2, 3, 3, 2, 3, 2, 1, 4]
const explanations = {
  toan_q_2014_12_1: [
    'Đáp án 2 — 横（よこ） ở đây nghĩa là bên cạnh. Dịch: “Ai đang ở bên cạnh anh/chị Suzuki?”',
    '1. そば cũng có thể nghĩa là ở gần/bên cạnh, nhưng đây không phải cách đọc của 横.',
    '2. よこ là cách đọc đúng của 横; 横にいる nghĩa là ở bên cạnh.',
    '3. となり nghĩa là bên cạnh/nhà kế bên, nhưng không phải cách đọc của 横.',
    '4. おく thường chỉ phía trong/phía sau, không diễn tả vị trí ngay bên cạnh.',
    'Ghi nhớ: 横（よこ）là “bên cạnh/theo chiều ngang”; そば và となり có thể gần nghĩa nhưng là từ khác.',
  ].join('\n'),
  toan_q_2014_12_2: [
    'Đáp án 3 — 自然（しぜん）nghĩa là thiên nhiên. Dịch: “Thiên nhiên quanh khu vực này rất đẹp.”',
    '1. じぜん không phải cách đọc của 自然; âm đầu của 自然 là し.',
    '2. じぜい không phải cách đọc của 自然; âm cuối phải là ぜん.',
    '3. しぜん là cách đọc đúng của 自然.',
    '4. しぜい cũng không phải cách đọc của 自然; âm cuối bị đổi từ ぜん thành ぜい.',
    'Ghi nhớ: 自然（しぜん）= thiên nhiên; nhớ âm しぜん.',
  ].join('\n'),
  toan_q_2014_12_3: [
    'Đáp án 3 — 替える（かえる）nghĩa là thay bằng một thứ khác. Dịch: “Bạn có thể đổi/thay nó ngay giúp tôi được không?”',
    '1. つたえて thường viết 伝えて, nghĩa là truyền đạt; không phải cách đọc của 替えて.',
    '2. くわえて có thể viết 加えて (thêm vào) hoặc 咥えて (ngậm); đều là động từ khác.',
    '3. かえて là cách đọc đúng của 替えて, dạng te của 替える.',
    '4. つかまえて thường viết 捕まえて, nghĩa là bắt/nắm lấy; không phải 替えて.',
    'Ghi nhớ: 替える（かえる）= thay thế; các lựa chọn còn lại là động từ khác dù một số có thể phát âm gần giống.',
  ].join('\n'),
  toan_q_2014_12_4: [
    'Đáp án 2 — 応用（おうよう）là ứng dụng kiến thức hoặc kỹ thuật vào việc thực tế. Dịch: “Nhiều kỹ thuật khác nhau được ứng dụng vào robot này.”',
    '1. いんよう không phải cách đọc của 応用; 引用（いんよう）là trích dẫn, một từ khác.',
    '2. おうよう là cách đọc đúng của 応用, hợp với việc áp dụng kỹ thuật vào robot.',
    '3. そうよう không phải cách đọc của 応用.',
    '4. しんよう có thể viết 信用（しんよう）, nghĩa là sự tin cậy/tín dụng; không phải “ứng dụng kỹ thuật”.',
    'Ghi nhớ: 応用（おうよう）= ứng dụng; phân biệt với 引用（いんよう）= trích dẫn và 信用（しんよう）= sự tin cậy.',
  ].join('\n'),
  toan_q_2014_12_5: [
    'Đáp án 3 — 一般的（いっぱんてき）nghĩa là phổ biến/thông thường. Dịch: “Có lẽ không thể gọi điều đó là phổ biến.”',
    '1. いちばんてき không phải cách đọc của 一般的.',
    '2. いちぺんてき không phải cách đọc của 一般的.',
    '3. いっぱんてき là cách đọc đúng; 一般的とは言えない nghĩa là không thể gọi là thông thường/phổ biến.',
    '4. いっぺんてき không phải cách đọc của 一般的.',
    'Ghi nhớ: 一般（いっぱん）= nói chung; 一般的（いっぱんてき）= mang tính phổ biến/thông thường.',
  ].join('\n'),
  toan_q_2014_12_6: [
    'Đáp án 2 — 検査（けんさ）là việc kiểm tra hoặc xét nghiệm. Dịch: “Vậy thì chúng ta bắt đầu kiểm tra nhé.”',
    '1. かんさ có thể viết 監査, nghĩa là kiểm toán/kiểm tra sổ sách; không phải cách đọc của 検査.',
    '2. けんさ là cách đọc đúng của 検査.',
    '3. かんさつ thường viết 観察, nghĩa là quan sát; là từ khác.',
    '4. けんさつ thường viết 検察, nghĩa là công tố/viện kiểm sát; không phải 検査.',
    'Ghi nhớ: 検査（けんさ）= kiểm tra/xét nghiệm; 観察（かんさつ）= quan sát; 検察（けんさつ）= công tố.',
  ].join('\n'),
  toan_q_2014_12_7: [
    'Đáp án 1 — 厚い（あつい）nghĩa là dày. Dịch: “Tôi nghĩ loại dày hơn một chút sẽ tốt hơn nhỉ.”',
    '1. あつい là cách đọc đúng của 厚い, dùng cho độ dày của vật.',
    '2. うすい thường viết 薄い, nghĩa là mỏng; là từ trái nghĩa, không phải cách đọc của 厚い.',
    '3. あまい thường viết 甘い, nghĩa là ngọt; không hợp với ý nói về độ dày.',
    '4. からい thường viết 辛い, nghĩa là cay; cũng không nói về độ dày.',
    'Ghi nhớ: 厚い（あつい）= dày; 薄い（うすい）= mỏng.',
  ].join('\n'),
  toan_q_2014_12_8: [
    'Đáp án 4 — 呼吸（こきゅう）nghĩa là hô hấp/hơi thở. Dịch: “Hãy thở chậm và đều.”',
    '1. よきょう không phải cách đọc của 呼吸.',
    '2. こきょう thường viết 故郷, nghĩa là quê hương; là từ khác, không phải “hô hấp”.',
    '3. よきゅう không phải cách đọc của 呼吸; đừng nhầm với 要求（ようきゅう）= yêu cầu.',
    '4. こきゅう là cách đọc đúng của 呼吸; 呼吸をする nghĩa là hô hấp/thở.',
    'Ghi nhớ: 呼吸（こきゅう）= hô hấp; 故郷（こきょう）= quê hương.',
  ].join('\n'),
}

for (const [index, [id, explanation]] of Object.entries(explanations).entries()) {
  const question = questions.get(id)
  assert.ok(question, `Missing question ${id}`)
  const expectedAnswer = answerKey[index]
  assert.equal(question.answer, expectedAnswer, `Answer key changed at question ${index + 1}`)
  assert.equal(question.correctAnswer, expectedAnswer, `Correct answer changed at question ${index + 1}`)
  assert.ok(explanation.startsWith(`Đáp án ${expectedAnswer} —`), `Explanation label mismatch at question ${index + 1}`)
  question.explanation = explanation
  curated[id] = explanation
}

fs.writeFileSync(masterPath, JSON.stringify(exams, null, 2) + '\n')
fs.writeFileSync(curatedPath, JSON.stringify(curated, null, 2) + '\n')
fs.writeFileSync(
  reportPath,
  JSON.stringify(
    {
      examId: exam.id,
      reviewedOn: '2026-09-27',
      scope:
        'Rewrite explanations for vocabulary reading questions 1–8 with Vietnamese stem translations, correct readings, and choice-by-choice contrasts. The answer key was preserved and matches the previously reviewed PDF key.',
      sources: {
        examTranscript: {
          url: examSource,
          sourceType: 'third-party transcription; not an official JLPT answer source',
        },
        answerKey: {
          url: answerSource,
          sourceType:
            'answer-key PDF already checked in the earlier 1–35 vocabulary review; official status not established',
        },
      },
      questions: Object.entries(explanations).map(([questionId, explanation], index) => ({
        questionId,
        number: index + 1,
        answer: answerKey[index],
        answerPreserved: true,
        includesTranslation: explanation.includes('Dịch:'),
        explainsAllChoices: [1, 2, 3, 4].every((option) => explanation.includes(`\\n${option}. `)),
        explanation,
      })),
    },
    null,
    2
  ) + '\n'
)

console.log('Reviewed 8 JLPT N3 12/2014 kanji-reading explanations; answer keys preserved.')
