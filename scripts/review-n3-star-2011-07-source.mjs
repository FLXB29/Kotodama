import fs from 'node:fs'

const masterPath = 'data/jlpt_n3_toan_master.json'
const curatedPath = 'data/jlpt_n3_explanations_curated.json'
const reportPath = 'reports/n3-quality-audit/star-source-2011-07-review.json'
const drivePdf = 'https://drive.google.com/file/d/19ztuEW7weABIAONSBXaqPuhHUFv4MIR9/view'
const scanPageUrl = drivePdf
const scanName = 'JLPT N3 July 2011 original exam scan in project Google Drive'

const questions = [
  {
    id: 'toan_q_2011_07_49',
    printedQuestion: 14,
    order: [3, 4, 2, 1],
    starPositionZeroBased: 2,
    answer: 2,
    completedSentence: 'Ａ「来週、試合なのにちっとも練習に来ないで何をやっていたんですか。」Ｂ「すみません。」',
    translation: 'A: “Tuần sau có trận đấu mà cậu chẳng đến tập chút nào; cậu đã làm gì vậy?” B: “Xin lỗi.”',
    explanation:
      'Câu hoàn chỉnh: 「Ａ「来週、試合なのにちっとも練習に来ないで何をやっていたんですか。」Ｂ「すみません。」」\n' +
      'Dịch: A: “Tuần sau có trận đấu mà cậu chẳng đến tập chút nào; cậu đã làm gì vậy?” B: “Xin lỗi.”\n' +
      'Thứ tự ghép là 3→4→2→1. 「なのに」(3) nối sau danh từ 「試合」 để nêu sự trái mong đợi; 「ちっとも」(4) đứng trước ý phủ định 「練習に来ない」, nghĩa là “hoàn toàn không”; 「練習に来ないで」(2) nêu việc không đến tập; 「何をやっていた」(1) là cụm hỏi “đã làm gì” ngay trước 「んですか」. Dấu ★ ở vị trí thứ ba nhận lựa chọn 2 「練習に来ないで」. Bốn mảnh đều cần cho câu này; đổi chỗ chúng sẽ làm hỏng các kết hợp 「試合なのに」「ちっとも〜ない」 hoặc vị trí cụm hỏi.',
  },
  {
    id: 'toan_q_2011_07_50',
    printedQuestion: 15,
    order: [3, 1, 4, 2],
    starPositionZeroBased: 2,
    answer: 4,
    completedSentence: 'あの美術館は曜日によって閉まる時間が違うから窓口で確認したほうがいいよ。',
    translation: 'Giờ đóng cửa của bảo tàng đó thay đổi tùy theo ngày trong tuần, vì vậy bạn nên xác nhận tại quầy.',
    explanation:
      'Câu hoàn chỉnh: 「あの美術館は曜日によって閉まる時間が違うから窓口で確認したほうがいいよ。」\n' +
      'Dịch: “Giờ đóng cửa của bảo tàng đó thay đổi tùy theo ngày trong tuần, vì vậy bạn nên xác nhận tại quầy.”\n' +
      'Thứ tự ghép là 3→1→4→2. 「によって」(3) theo sau 「曜日」, nghĩa là “tùy theo ngày”; 「閉まる時間」(1) là “giờ đóng cửa”; 「が」(4) đánh dấu 「閉まる時間」 làm chủ ngữ của 「違う」; 「違うから」(2) kết thúc mệnh đề lý do, dẫn đến lời khuyên xác nhận ở quầy. Dấu ★ ở vị trí thứ ba nhận lựa chọn 4 「が」. Đặt 「が」 sau 「曜日」 sẽ phá cụm 「曜日によって」; đặt nó sau 「閉まる時間」 mới tạo được cụm chủ-vị 「閉まる時間が違う」.',
  },
  {
    id: 'toan_q_2011_07_51',
    printedQuestion: 16,
    order: [1, 4, 2, 3],
    starPositionZeroBased: 2,
    answer: 2,
    completedSentence: '自分で野菜を作ってみて、おいしい野菜を育てることがどんなに大変なことかわかりました。',
    translation: 'Tự trồng rau rồi tôi mới hiểu việc trồng được rau ngon vất vả đến mức nào.',
    explanation:
      'Câu hoàn chỉnh: 「自分で野菜を作ってみて、おいしい野菜を育てることがどんなに大変なことかわかりました。」\n' +
      'Dịch: “Tự trồng rau rồi tôi mới hiểu việc trồng được rau ngon vất vả đến mức nào.”\n' +
      'Thứ tự ghép là 1→4→2→3. 「ことが」(1) danh từ hóa việc trồng rau và đánh dấu chủ thể trong mệnh đề hỏi gián tiếp; 「どんなに」(4) nghĩa là “đến mức nào”, bổ nghĩa cho 「大変な」; 「大変な」(2) là “vất vả/khó khăn”, bổ nghĩa cho 「こと」; 「ことか」(3) khép lại cấu trúc cảm thán gián tiếp 「どんなに〜ことか」 trước 「わかりました」. Dấu ★ ở vị trí thứ ba nhận lựa chọn 2 「大変な」. Không thể đặt 「ことか」 trước 「大変な」 vì cấu trúc cần là 「どんなに大変なことか」.',
  },
  {
    id: 'toan_q_2011_07_52',
    printedQuestion: 17,
    order: [4, 2, 1, 3],
    starPositionZeroBased: 2,
    answer: 1,
    completedSentence:
      'A「今度のさよならパーティーで、みんなで歌う歌は、これでいいですか。」B「すみません。この歌は好きなんですが、少しむずかしいですからほかのにしてほしいです。」',
    translation:
      'A: “Bài hát mọi người sẽ cùng hát trong buổi tiệc chia tay lần này, bài này được chứ?” B: “Xin lỗi. Tôi thích bài này nhưng nó hơi khó, nên tôi muốn mọi người đổi sang bài khác.”',
    explanation:
      'Câu hoàn chỉnh: 「A「今度のさよならパーティーで、みんなで歌う歌は、これでいいですか。」B「すみません。この歌は好きなんですが、少しむずかしいですからほかのにしてほしいです。」」\n' +
      'Dịch: A: “Bài hát mọi người sẽ cùng hát trong buổi tiệc chia tay lần này, bài này được chứ?” B: “Xin lỗi. Tôi thích bài này nhưng nó hơi khó, nên tôi muốn mọi người đổi sang bài khác.”\n' +
      'Thứ tự ghép là 4→2→1→3. 「から」(4) gắn với 「むずかしいです」 để nêu lý do; 「ほか」(2) nghĩa là “khác”; 「の」(1) danh từ hóa phần bị lược 「歌」 thành 「ほかの」, tức “bài khác”; 「に」(3) đánh dấu kết quả lựa chọn trong 「ほかのにして」. Dấu ★ ở vị trí thứ ba nhận lựa chọn 1 「の」. 「の」 phải theo sau 「ほか」 để tạo 「ほかの」 và đứng trước 「にしてほしい」; các lựa chọn còn lại không thể thay vào vị trí này mà vẫn tạo được cụm danh từ ấy.',
  },
  {
    id: 'toan_q_2011_07_53',
    printedQuestion: 18,
    order: [1, 4, 3, 2],
    starPositionZeroBased: 2,
    answer: 3,
    completedSentence:
      '最近、子どもがピアノを習いたいと言いだした。わたしは、子どもがしたいと思うことはやらせてやりたいと思っている。',
    translation: 'Gần đây con tôi nói muốn học piano. Tôi muốn cho con làm những điều con muốn làm.',
    explanation:
      'Câu hoàn chỉnh: 「最近、子どもがピアノを習いたいと言いだした。わたしは、子どもがしたいと思うことはやらせてやりたいと思っている。」\n' +
      'Dịch: “Gần đây con tôi nói muốn học piano. Tôi muốn cho con làm những điều con muốn làm.”\n' +
      'Thứ tự ghép là 1→4→3→2. 「したい」(1) theo sau 「子どもが」, diễn tả điều đứa trẻ muốn làm; 「と思うことは」(4) danh từ hóa ý định ấy thành “điều mà con muốn làm”; 「やらせて」(3) là dạng sai khiến nối て, ở đây mang nghĩa “cho phép con làm”; 「やりたい」(2) diễn tả mong muốn của người nói, kết hợp với 「やらせて」 thành 「やらせてやりたい」. Trên bản in, dấu ★ nằm ở ô thứ ba nên nhận lựa chọn 3 「やらせて」. Các phần sau lần lượt phải tạo thành 「したいと思うこと」 và 「やらせてやりたい」.',
  },
]

const master = JSON.parse(fs.readFileSync(masterPath, 'utf8'))
const curated = JSON.parse(fs.readFileSync(curatedPath, 'utf8'))
const exam = master.find((entry) => entry.id === 'toan-n3-201107-full')
if (!exam) throw new Error('July 2011 full exam is missing')
const examQuestions = exam.parts.flatMap((part) => part.questions || [])

for (const reviewed of questions) {
  const question = examQuestions.find((entry) => entry.id === reviewed.id)
  if (!question) throw new Error(`Missing question ${reviewed.id}`)
  if (Number(question.correctAnswer ?? question.answer) !== reviewed.answer)
    throw new Error(`${reviewed.id}: source-reviewed answer disagrees with the stored key`)
  if (!Array.isArray(question.options) || question.options.length !== 4)
    throw new Error(`${reviewed.id}: expected four printed fragments`)
  if (reviewed.order.length !== 4 || new Set(reviewed.order).size !== 4)
    throw new Error(`${reviewed.id}: order must be a four-fragment permutation`)
  if (reviewed.order[reviewed.starPositionZeroBased] !== reviewed.answer)
    throw new Error(`${reviewed.id}: the reconstructed order does not place the key under ★`)

  question.starCorrectOrder = reviewed.order
  question.starPosition = reviewed.starPositionZeroBased
  question.correctAnswer = reviewed.answer
  question.answer = reviewed.answer
  question.starOrderVerified = true
  question.starPositionVerified = true
  question.starVerificationSources =
    reviewed.id === 'toan_q_2011_07_50'
      ? [
          scanPageUrl,
          'https://www.tiengnhatdongian.com/wp-content/uploads/2023/03/de-thi-jlpt-n3-13.pdf',
          'https://japaneselanguage.client.jp/Official_N3_P13-P16_n.pdf',
        ]
      : [scanPageUrl]
  question.explanation = reviewed.explanation
  curated[reviewed.id] = reviewed.explanation
}

const report = {
  reviewedAt: '2026-09-27',
  examId: exam.id,
  section: 'Grammar Mondai 2, sentence construction (printed questions 14–18)',
  primarySource: {
    name: scanName,
    url: scanPageUrl,
    fileUrl: drivePdf,
    pdfPageNumber: 5,
    printedPage: 5,
    reviewedMethod:
      'Opened and visually inspected the rendered source page in Chrome; the PDF text layer was also compared with the printed wording and options.',
    limitation:
      'This is the original exam scan, not an official JLPT answer key. Answers below are established by reconstructing the sentence and matching the printed ★ position.',
  },
  independentCorroboration: {
    questionId: 'toan_q_2011_07_50',
    sources: [
      {
        name: 'Japanese-language scan of the July 2011 N3 paper',
        url: 'https://www.tiengnhatdongian.com/wp-content/uploads/2023/03/de-thi-jlpt-n3-13.pdf',
        status:
          'Previously reviewed as a question scan; corroborates the printed wording and fragments, but is not an answer key.',
      },
      {
        name: 'Japanese-language worked solution for the July 2011 N3 paper',
        url: 'https://japaneselanguage.client.jp/Official_N3_P13-P16_n.pdf',
        reviewedLocation: 'Printed page P13, extracted lines 523–552',
        status:
          'Gives the completed sentence 「あの美術館は曜日によって閉まる時間が違うから窓口で確認したほうがいいよ」. This is an independent study solution, not an official JLPT answer key.',
      },
    ],
  },
  questions: questions.map(
    ({ id, printedQuestion, order, starPositionZeroBased, answer, completedSentence, translation }) => {
      const entry = examQuestions.find((item) => item.id === id)
      return {
        questionId: id,
        printedQuestion,
        printedFragments: entry.options,
        order,
        starPositionZeroBased,
        answer,
        completedSentence,
        translation,
        explanation: entry.explanation,
        officialAnswerKeyEstablished: false,
        answerBasis: 'Sentence reconstruction plus the ★ position directly visible in the original exam scan.',
        explanationCoverage: {
          fullSentence: true,
          translation: true,
          allFourFragmentsExplained: true,
          starPositionAndAnswerExplained: true,
          orderingRationale: true,
        },
      }
    }
  ),
}

fs.writeFileSync(masterPath, `${JSON.stringify(master, null, 2)}\n`)
fs.writeFileSync(curatedPath, `${JSON.stringify(curated, null, 2)}\n`)
fs.writeFileSync(reportPath, `${JSON.stringify(report, null, 2)}\n`)
console.log(`Reviewed and synced ${questions.length} July 2011 ★ questions.`)
