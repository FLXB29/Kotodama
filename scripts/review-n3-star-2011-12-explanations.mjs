import fs from 'node:fs'

const masterPath = 'data/jlpt_n3_toan_master.json'
const curatedPath = 'data/jlpt_n3_explanations_curated.json'
const reportPath = 'reports/n3-quality-audit/star-explanations-2011-12-review.json'
const sourceUrl = 'https://www.scribd.com/document/1022846440/2-N3-12-2011'

const explanations = {
  toan_q_2011_12_49:
    'Câu hoàn chỉnh: 「中山「上田さんは、本当にこの仕事が好きなんですね。」上田「はい、わたしは、これほどおもしろい仕事はないと思っているんです。」」\n' +
    'Dịch: “Nakamura: ‘Ueda, anh thật sự thích công việc này nhỉ.’ Ueda: ‘Vâng, tôi nghĩ không có công việc nào thú vị đến thế này.’”\n' +
    'Thứ tự ghép là 3→1→4→2. 「これ」(3) chỉ công việc đang nói; 「ほど」(1) tạo cụm nhấn mức độ 「これほど」, “đến mức này”; 「おもしろい」(4) là tính từ “thú vị”, bổ nghĩa cho 「仕事」; 「仕事は」(2) đưa “công việc” làm chủ đề trong cấu trúc phủ định 「仕事はない」. Ô ★ thứ ba nhận lựa chọn 4 「おもしろい」. Các mảnh cần giữ liền mạch để tạo 「これほど」, 「おもしろい仕事」 và 「仕事はない」.',
  toan_q_2011_12_51:
    'Câu hoàn chỉnh: 「昨日のパーティーは、友だちと話していたら、ほとんど何も食べないうちに終わってしまって、あとでおなかがすいてしまった。」\n' +
    'Dịch: “Hôm qua ở bữa tiệc, tôi mải trò chuyện với bạn bè nên bữa tiệc đã kết thúc trước khi tôi ăn được gì; sau đó tôi bị đói.”\n' +
    'Thứ tự ghép là 2→4→3→1. 「何も」(2) nghĩa là “gì cả” và đi với phủ định; 「食べない」(4) tạo cụm 「何も食べない」, “không ăn gì”; 「うちに」(3) nghĩa là “trước khi/khi còn chưa”, tạo 「食べないうちに」; 「終わってしまって」(1) nêu bữa tiệc kết thúc ngoài ý muốn rồi nối với kết quả bị đói. Ô ★ thứ ba nhận lựa chọn 3 「うちに」. Nếu đặt 「終わってしまって」 trước 「うちに」, cụm chỉ thời điểm 「食べないうちに」 sẽ bị phá vỡ.',
  toan_q_2011_12_52:
    'Câu hoàn chỉnh: 「夏休みに行われた会社での実習は、わたしにとって、企業で働くというのがどういうことか考えるいい機会になった。」\n' +
    'Dịch: “Buổi thực tập ở công ty vào kỳ nghỉ hè là cơ hội tốt để tôi suy nghĩ xem làm việc trong doanh nghiệp là như thế nào.”\n' +
    'Thứ tự ghép là 3→2→4→1. 「働く」(3) hoàn thành cụm 「企業で働く」, “làm việc trong doanh nghiệp”; 「というのが」(2) danh từ hóa cụm vừa nêu và đưa nó làm chủ đề; 「どういうことか」(4) là câu hỏi gián tiếp “là việc như thế nào”; 「考える」(1) là “suy nghĩ”, đứng trước 「いい機会」 để tạo “cơ hội tốt để suy nghĩ”. Ô ★ thứ ba nhận lựa chọn 4 「どういうことか」. Cần giữ thứ tự câu hỏi gián tiếp 「どういうことか考える」 trước danh từ 「いい機会」.',
  toan_q_2011_12_53:
    'Câu hoàn chỉnh: 「母は「風邪をひかないのは、毎朝しているジョギングのおかげだ。」とよく言っている。」\n' +
    'Dịch: “Mẹ tôi thường nói rằng việc không bị cảm là nhờ chạy bộ mỗi sáng.”\n' +
    'Thứ tự ghép là 4→2→1→3. 「毎朝」(4) là “mỗi sáng”; 「している」(2) bổ nghĩa cho 「ジョギング」, tạo cụm 「毎朝しているジョギング」, “việc chạy bộ mà mẹ thực hiện mỗi sáng”; 「ジョギングの」(1) nối danh từ này với 「おかげ」; 「おかげだ」(3) kết luận kết quả tốt là “nhờ vào”. Ô ★ thứ ba nhận lựa chọn 1 「ジョギングの」. Cụm sở hữu/nguyên nhân phải liền nhau thành 「ジョギングのおかげだ」.',
}

const master = JSON.parse(fs.readFileSync(masterPath, 'utf8'))
const curated = JSON.parse(fs.readFileSync(curatedPath, 'utf8'))
const exam = master.find((item) => item.id === 'toan-n3-201112-full')
if (!exam) throw new Error('December 2011 N3 full exam is missing')
const questions = exam.parts.flatMap((part) => part.questions || [])
for (const [id, explanation] of Object.entries(explanations)) {
  const question = questions.find((item) => item.id === id)
  if (!question) throw new Error(`Missing question ${id}`)
  if (!Array.isArray(question.starCorrectOrder) || question.starCorrectOrder.length !== 4)
    throw new Error(`${id}: expected the existing four-fragment order`)
  if (question.starCorrectOrder[question.starPosition] !== Number(question.correctAnswer ?? question.answer))
    throw new Error(`${id}: current order and stored starred answer disagree`)
  question.explanation = explanation
  curated[id] = explanation
}

const report = {
  reviewedAt: '2026-09-27',
  examId: exam.id,
  scope: 'Sentence construction, printed questions 14–18 (application question IDs 49–53).',
  source: {
    name: 'JLPT N3 December 2011 scan/transcription hosted on Scribd',
    url: sourceUrl,
    location:
      'Printed page 5, questions 14–18; the rendered transcription contains the Japanese prompts and all four fragments.',
    method:
      'Compared prompt wording and fragments to the accessible rendered transcription, then reconstructed each sentence from its four pieces. The existing answer key, fragment order, and stored star slot were not changed.',
    limitation:
      'The Scribd transcription view did not expose a verifiable visual rendering of the ★ glyph placement in this review. This report therefore records explanation improvements, not new source verification of the starred slots or official answer key.',
  },
  officialAnswerKeyConfirmed: false,
  starLayoutVisuallyConfirmed: false,
  starSourceVerificationAdded: false,
  questions: [
    ...questions
      .filter((item) => Number(item.number) >= 49 && Number(item.number) <= 53)
      .map((question) => ({
        questionId: question.id,
        printedQuestion: Number(question.number) - 35,
        order: question.starCorrectOrder,
        starPositionZeroBased: question.starPosition,
        storedAnswer: Number(question.correctAnswer ?? question.answer),
        completedSentence:
          (question.explanation || '').match(/(?:Câu hoàn chỉnh|câu hoàn chỉnh): 「(.+?)」/u)?.[1] || null,
        explanation: question.explanation,
        translationPresent: /Dịch:/u.test(question.explanation || ''),
        allFragmentsExplained: [1, 2, 3, 4].every(
          (choice) =>
            question.explanation?.includes(`(${choice})`) ||
            new RegExp(`\\b${choice}\\.`, 'u').test(question.explanation || '')
        ),
        provenanceUnchanged: true,
      })),
  ],
}

fs.writeFileSync(masterPath, `${JSON.stringify(master, null, 2)}\n`)
fs.writeFileSync(curatedPath, `${JSON.stringify(curated, null, 2)}\n`)
fs.writeFileSync(reportPath, `${JSON.stringify(report, null, 2)}\n`)
console.log(
  'Updated four December 2011 star explanations; preserved the existing question 15 review and all answer/provenance fields.'
)
