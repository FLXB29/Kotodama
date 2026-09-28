import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'

const root = path.resolve('.')
const masterPath = path.join(root, 'data/jlpt_n3_toan_master.json')
const curatedPath = path.join(root, 'data/jlpt_n3_explanations_curated.json')
const reportPath = path.join(root, 'reports/n3-quality-audit/vocabulary-2013-07-reading-review.json')
const examSource = 'https://www.vnjpclub.com/de-thi-chinh-thuc-jlpt-n3/de-thi-jlpt-n3-7-2013-moji-goi.html'
const answerSource = 'https://www.scribd.com/document/1042940937/N3-7-2013-Answer-Script'

const exams = JSON.parse(fs.readFileSync(masterPath, 'utf8'))
const curated = JSON.parse(fs.readFileSync(curatedPath, 'utf8'))
const exam = exams.find((item) => item.id === 'toan-n3-201307-full')
assert.ok(exam, 'Missing JLPT N3 07/2013 exam')
const questions = new Map(exam.parts.flatMap((part) => part.questions).map((question) => [question.id, question]))
const answerKey = [3, 4, 1, 1, 2, 1, 3, 2]

const explanations = {
  toan_q_2013_07_1: [
    'Đáp án 3 — 苦しい（くるしい）nghĩa là đau khổ, vất vả hoặc khó chịu. Dịch: “Khi gặp lúc khó khăn, tôi nghe bài hát này.”',
    '1. かなしい thường viết 悲しい, nghĩa là buồn; là cảm xúc khác, không phải cách đọc của 苦しい.',
    '2. くやしい thường viết 悔しい, nghĩa là ấm ức/tiếc nuối vì thất bại; không phải 苦しい.',
    '3. くるしい là cách đọc đúng của 苦しい.',
    '4. さびしい thường viết 寂しい, nghĩa là cô đơn/vắng vẻ; không phải cách đọc của 苦しい.',
    'Ghi nhớ: 苦しい = đau khổ/vất vả; 悲しい = buồn; 悔しい = ấm ức; 寂しい = cô đơn.',
  ].join('\n'),
  toan_q_2013_07_2: [
    'Đáp án 4 — 出張（しゅっちょう）là chuyến đi công tác. Dịch: “Tôi dự định đi công tác ở Nhật vào tháng tới.”',
    '1. しゅちゅう không phải cách đọc của 出張.',
    '2. しゅちょう thường viết 主張, nghĩa là khẳng định/quan điểm; không phải 出張.',
    '3. しゅっちゅう không phải cách đọc của 出張; đừng nhầm với しょっちゅう “thường xuyên”.',
    '4. しゅっちょう là cách đọc đúng của 出張, đi công tác.',
    'Ghi nhớ: 出張（しゅっちょう）= đi công tác; 主張（しゅちょう）= nêu quan điểm.',
  ].join('\n'),
  toan_q_2013_07_3: [
    'Đáp án 1 — 席（せき）là chỗ ngồi. Dịch: “Chỉ có một chỗ ngồi còn trống.”',
    '1. せき là cách đọc đúng của 席.',
    '2. かぎ thường viết 鍵, nghĩa là chìa khóa; là từ khác.',
    '3. あな thường viết 穴, nghĩa là cái lỗ; không phải chỗ ngồi.',
    '4. ふた thường viết 蓋, nghĩa là nắp; không phải cách đọc của 席.',
    'Ghi nhớ: 席（せき）= chỗ ngồi; 鍵（かぎ）= chìa khóa; 穴（あな）= lỗ; 蓋（ふた）= nắp.',
  ].join('\n'),
  toan_q_2013_07_4: [
    'Đáp án 1 — 根（ね）là rễ cây. Dịch: “Nghe nói rễ cây đó cũng có thể dùng làm thuốc.”',
    '1. ね là cách đọc đúng của 根.',
    '2. は thường viết 葉, nghĩa là lá cây; không phải rễ.',
    '3. かわ thường viết 皮, nghĩa là da/vỏ; cây có vỏ, nhưng chữ này không phải 根.',
    '4. め thường viết 目, nghĩa là mắt; không phải cách đọc của 根.',
    'Ghi nhớ: 根（ね）= rễ; 葉（は）= lá; 皮（かわ）= vỏ; 目（め）= mắt.',
  ].join('\n'),
  toan_q_2013_07_5: [
    'Đáp án 2 — 事情（じじょう）là hoàn cảnh hoặc lý do riêng. Dịch: “Xin lỗi, vì có việc nên hôm nay tôi không thể đi.”',
    '1. じこ thường viết 事故, nghĩa là tai nạn; không phải 事情.',
    '2. じじょう là cách đọc đúng của 事情.',
    '3. じこう có thể viết 事項, nghĩa là hạng mục/vấn đề; là từ khác.',
    '4. じじょ thường viết 次女, nghĩa là con gái thứ hai; không phải lý do/hoàn cảnh.',
    'Ghi nhớ: 事情（じじょう）= hoàn cảnh/lý do; 事故（じこ）= tai nạn; 事項（じこう）= hạng mục.',
  ].join('\n'),
  toan_q_2013_07_6: [
    'Đáp án 1 — 通知（つうち）là thông báo. Dịch: “Kết quả phỏng vấn sẽ được thông báo trong vòng một tuần.”',
    '1. つうち là cách đọc đúng của 通知.',
    '2. とおち không phải cách đọc của 通知.',
    '3. つうし có thể viết 通史, nghĩa là lịch sử khái quát/biên niên sử; không phải 通知.',
    '4. とおし có thể viết 通し, nghĩa là xuyên suốt/liên tục; không phải cách đọc của 通知.',
    'Ghi nhớ: 通知（つうち）= thông báo; 通史（つうし）= lịch sử khái quát; 通し（とおし）= xuyên suốt.',
  ].join('\n'),
  toan_q_2013_07_7: [
    'Đáp án 3 — 選手（せんしゅ）là vận động viên/cầu thủ. Dịch: “Người đó là cầu thủ bóng đá chuyên nghiệp.”',
    '1. ぜんしゅ không phải cách đọc của 選手.',
    '2. せんしゅう thường viết 先週, nghĩa là tuần trước; khác với 選手.',
    '3. せんしゅ là cách đọc đúng của 選手.',
    '4. ぜんしゅう thường viết 全集, nghĩa là tuyển tập toàn bộ tác phẩm; không phải 選手.',
    'Ghi nhớ: 選手（せんしゅ）= vận động viên/cầu thủ; 先週（せんしゅう）= tuần trước; 全集（ぜんしゅう）= tuyển tập.',
  ].join('\n'),
  toan_q_2013_07_8: [
    'Đáp án 2 — 実力（じつりょく）là năng lực thực sự/trình độ thực tế. Dịch: “Không thể tham gia trận đấu là vì năng lực còn chưa đủ.”',
    '1. しつりょく không phải cách đọc của 実力.',
    '2. じつりょく là cách đọc đúng của 実力.',
    '3. どりょく thường viết 努力, nghĩa là nỗ lực; là từ khác dù có liên quan tới việc rèn luyện năng lực.',
    '4. とりょく không phải cách đọc của 実力.',
    'Ghi nhớ: 実力（じつりょく）= năng lực thực tế; 努力（どりょく）= nỗ lực.',
  ].join('\n'),
}

const q8 = questions.get('toan_q_2013_07_8')
assert.ok(q8, 'Missing question 8')
const priorOption3 = String(q8.options[2] || '')
  .replace(/^\s*3[.．、]\s*/u, '')
  .trim()
assert.ok(['どりょくり', 'どりょく'].includes(priorOption3), 'Unexpected source text for question 8 option 3')
q8.options[2] = '3. どりょく'
const sourceCorrections =
  priorOption3 === 'どりょく'
    ? []
    : [
        {
          questionId: 'toan_q_2013_07_8',
          field: 'options[2]',
          before: `3. ${priorOption3}`,
          after: '3. どりょく',
          reason:
            'The independent exam/answer transcription shows どりょく（努力）; the stored どりょくり had an extra final り.',
          source: answerSource,
        },
      ]

for (const [index, [id, explanation]] of Object.entries(explanations).entries()) {
  const question = questions.get(id)
  assert.ok(question, `Missing question ${id}`)
  const expectedAnswer = answerKey[index]
  assert.equal(question.answer, expectedAnswer, `Answer key differs at question ${index + 1}`)
  assert.equal(question.correctAnswer, expectedAnswer, `correctAnswer differs at question ${index + 1}`)
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
        'Rewrite vocabulary kanji-reading explanations for questions 1–8 with Vietnamese sentence translations, contextual meanings, and distinctions for each choice. Answers were checked against an independent third-party answer transcription and preserved.',
      sources: {
        examTranscript: {
          url: examSource,
          sourceType: 'third-party exam transcription; not an official JLPT publication',
        },
        answerKey: {
          url: answerSource,
          sourceType: 'third-party answer and explanation transcription; official status not established',
        },
      },
      sourceCorrections,
      questions: Object.entries(explanations).map(([questionId, explanation], index) => ({
        questionId,
        number: index + 1,
        answer: answerKey[index],
        answerPreserved: true,
        includesTranslation: explanation.includes('Dịch:'),
        explainsAllChoices: [1, 2, 3, 4].every((option) => explanation.includes(`\n${option}. `)),
        explanation,
      })),
    },
    null,
    2
  ) + '\n'
)

console.log('Reviewed 8 JLPT N3 07/2013 kanji-reading explanations; checked and preserved answer keys.')
