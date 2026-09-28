import fs from 'node:fs'

const masterPath = 'data/jlpt_n3_toan_master.json'
const standalonePath = 'data/jlpt_full_master.json'
const curatedPath = 'data/jlpt_n3_explanations_curated.json'
const exams = JSON.parse(fs.readFileSync(masterPath, 'utf8'))
const standaloneExams = JSON.parse(fs.readFileSync(standalonePath, 'utf8'))
const curated = JSON.parse(fs.readFileSync(curatedPath, 'utf8'))

const updates = {
  toan_q_2021_12_36: `Đáp án 3 — 「うれしそうな顔をしていた」: mẹ có vẻ rất vui. 「顔をしている」 diễn tả vẻ mặt/trạng thái biểu lộ ra bên ngoài; 「そう」 gắn với tính từ để nói “trông có vẻ”.
1. へ: chỉ hướng đến nơi, không kết hợp với 「顔をする」.
2. が: đánh dấu chủ ngữ cho 「顔」, nhưng mẫu cố định ở đây là 「顔をしている」.
3. を: tạo cụm 「顔をしていた」 = có/để vẻ mặt như thế; đúng mẫu.
4. の: nối danh từ, nhưng 「顔のしていた」 không tạo cấu trúc đúng.
Dịch: “Mẹ nói chuyện điện thoại với anh trai đang du học sau một thời gian dài và trông rất vui.”
Ghi nhớ: 「うれしそう」 = trông có vẻ vui; 「〜顔をしている」 = có vẻ mặt/trạng thái biểu lộ như vậy.`,

  toan_q_2021_12_37: `Đáp án 4 — 「昨日ついに完成した」: tòa nhà ABC xây dựng suốt thời gian dài cuối cùng đã hoàn thành hôm qua. 「ついに」 nêu kết quả đạt được sau quá trình chờ đợi.
1. ずっと: “suốt/mãi”; cần miêu tả khoảng thời gian kéo dài, không thay cho kết quả cuối cùng.
2. 今にも: “sắp sửa ngay”; thường đi với dự đoán sắp xảy ra, không hợp sự kiện đã hoàn tất hôm qua.
3. 次第に: “dần dần”; diễn tả thay đổi từ từ, không nhấn mạnh thời điểm hoàn thành.
4. ついに: “cuối cùng”; phù hợp với quá trình xây dựng lâu dài và tòa nhà đã hoàn thành hôm qua.
Dịch: “Tòa nhà ABC đã được xây dựng trong một thời gian dài, cuối cùng hôm qua cũng hoàn thành.”
Ghi nhớ: 「ついに」 = cuối cùng sau chờ đợi/quá trình; 「次第に」 = dần dần; 「今にも」 = sắp xảy ra ngay.`,

  toan_q_2021_12_38: `Đáp án 2 — 「午後からなら行けます」: nếu bắt đầu từ buổi chiều thì tôi có thể đi làm. 「Nからなら」 giới hạn thời điểm bắt đầu có thể tham gia.
1. でなら: 「午後で」 có thể chỉ thời điểm trong một số kết cấu, nhưng 「午後でなら行ける」 không phải cách nói tự nhiên ở đây.
2. からなら: “nếu từ…”; nêu mốc giờ người nhân viên có thể đến, phù hợp với câu hỏi có thể đi làm ngày mai hay không.
3. へでも: 「へ」 chỉ hướng di chuyển; 「午後へ」 không phải mốc thời gian cho ca làm.
4. まででも: “dù đến tận…”; cần một mốc kết thúc, trong khi câu trả lời cần thời điểm bắt đầu có thể đi.
Dịch: “(Qua điện thoại) Quản lý: Anh Ooshita, xin lỗi vì báo gấp, ngày mai anh có thể đi làm được không? — Ooshita: Nếu từ buổi chiều thì tôi đi được, như vậy có ổn không ạ? — Quản lý: Cảm ơn anh. Nhờ anh nhé.”
Ghi nhớ: 「Nから」 = từ mốc N; 「Nまで」 = đến mốc N.`,

  toan_q_2021_12_39: `Đáp án 4 — 「さくら広場において開かれます」: buổi hòa nhạc sẽ được tổ chức tại quảng trường Sakura. 「Nにおいて」 là cách nói trang trọng/văn viết của 「Nで」 khi nêu địa điểm sự kiện.
1. に対して: “đối với/hướng tới”; nêu đối tượng tác động, không chỉ địa điểm.
2. によって: “do/bởi” hoặc “tùy theo”; không nêu nơi tổ chức buổi hòa nhạc.
3. について: “về”; nêu chủ đề, không phải địa điểm.
4. において: “tại”; phù hợp với giờ bắt đầu và địa điểm tổ chức sự kiện.
Dịch: “Buổi hòa nhạc sẽ được tổ chức tại quảng trường Sakura từ 11 giờ ngày mai.”
Ghi nhớ: 「場所において」 = tại địa điểm (văn viết); hội thoại thường dùng 「場所で」.`,

  toan_q_2021_12_40: `Đáp án 1 — 「会うたびに大きくなっていて」: mỗi lần gặp, đứa bé lại lớn thêm. 「Vるたびに」 nói rằng một kết quả lặp lại mỗi khi hành động xảy ra.
1. たびに: “mỗi lần”; mỗi lần người nói gặp cháu thì cháu đã lớn hơn, đúng mạch ngạc nhiên.
2. うちに: “trong lúc/khi còn”; thường diễn tả thay đổi diễn ra trong một khoảng thời gian, không nhấn mạnh từng lần gặp.
3. 間に: “trong khoảng thời gian”; cần nói một sự việc xảy ra trong khoảng giữa hai mốc, không nói mỗi lần gặp.
4. 前に: “trước khi”; trái với ý mỗi lần gặp thì cháu đã lớn hơn.
Dịch: “Chị tôi sinh con năm ngoái. Khoảng hai, ba tháng tôi gặp cháu một lần, và lần nào gặp cháu cũng đã lớn hơn, thật ngạc nhiên.”
Ghi nhớ: 「Vるたびに」 = mỗi lần V thì…; 「Vるうちに」 = trong khi V/qua thời gian V.`,

  toan_q_2021_12_41: `Đáp án 2 — 「同じかばんを使い続けている」: người nói vẫn tiếp tục dùng cùng một chiếc túi từ 10 năm trước đến nay. 「ます形 bỏ ます＋続ける」 diễn tả tiếp tục hành động. Ghi chú nguồn: PDF in 「使い続いている」, nhưng cách đúng là 「使い続けている」; dữ liệu học đã hiệu đính lỗi in/chép này.
1. 使う: thể từ điển không nối trực tiếp với 「続けている」 theo mẫu này.
2. 使い: bỏ 「ます」 từ 「使います」 rồi ghép 「続ける」 thành 「使い続ける」 = tiếp tục dùng.
3. 使おう: ý chí “hãy dùng/định dùng”; 「使おう続ける」 không đúng hình thức.
4. 使った: thể quá khứ không kết hợp với 「続ける」 theo ý tiếp tục dùng từ quá khứ đến hiện tại.
Dịch: “Tôi tiếp tục sử dụng cùng một chiếc túi từ mười năm trước đến nay.”
Ghi nhớ: 「Vます形－ます＋続ける」 = tiếp tục V; 「使い続ける」 = tiếp tục sử dụng.`,

  toan_q_2021_12_42: `Đáp án 4 — 「田中さんがわたしの方に走ってくるのが見えました」: tôi nhìn thấy anh Tanaka chạy về phía mình. 「Vのが見える」 là cách nói tự nhiên khi mô tả trực tiếp một hành động đang được nhìn thấy; 「くる」 chỉ hướng về phía người nói.
1. 走っていくことが: 「いく」 chỉ hướng rời xa người nói, trái với 「わたしの方に」. 「こと」 có thể danh từ hóa sự việc, nhưng 「Vのが見える」 tự nhiên hơn khi nói điều mắt trực tiếp nhìn thấy.
2. 走ってくることが: hướng chạy về phía người nói đúng, nhưng 「こと」 ở đây kém tự nhiên hơn 「の」 để nêu hành động đang được nhìn thấy; đây là lựa chọn kém phù hợp, không phải cấu trúc 「こと」 luôn sai.
3. 走っていくのが: 「のが見える」 đúng kiểu danh từ hóa, nhưng 「いく」 là chạy đi xa khỏi điểm nhìn, trái với 「わたしの方に」.
4. 走ってくるのが: vừa diễn tả chạy về phía người nói vừa dùng 「の」 danh từ hóa hành động làm đối tượng được nhìn thấy.
Dịch: “Tôi nhìn thấy anh Tanaka chạy về phía mình.”
Ghi nhớ: 「Vのが見える」 = nhìn thấy việc V; 「Vてくる」 hướng chuyển động về phía người nói, 「Vていく」 hướng rời xa.`,

  toan_q_2021_12_43: `Đáp án 1 — 「早く試合に出られるようになりたい」: muốn sớm trở nên có thể ra sân thi đấu. 「可能形＋ようになる」 diễn tả đạt được khả năng.
1. 出られるように: 「出られるようになる」 = trở nên có thể tham gia; 「早く」 và việc luyện tập hằng ngày hỗ trợ mong muốn này.
2. 出られるために: 「ために」 chỉ mục đích nhưng ghép 「出られるためになる」 không tạo được ý “trở nên có thể ra sân”.
3. 出させるように: 「出させる」 là sai khiến “cho/ép ai ra sân”; nhân vật muốn chính mình được ra thi đấu.
4. 出させるために: “để cho ai đó ra sân”; sai chủ thể và vẫn không hợp với 「なりたい」.
Dịch: “Yamada: John, ngày nào em cũng luyện bóng rổ à? — John: Vâng. Em muốn sớm trở nên có thể ra sân thi đấu.”
Ghi nhớ: 「V可能形＋ようになる」 = trở nên có thể V; 「Vさせる」 là sai khiến.`,

  toan_q_2021_12_44: `Đáp án 2 — 「今はもう降っていない」: hiện giờ mưa đã tạnh. 「もう〜ない」 diễn tả hiện tượng không còn xảy ra.
1. 降っている: “đang mưa”; trái với 「今はもう」 trong câu đối lập với mưa lớn buổi sáng.
2. 降っていない: “không còn mưa”; thể hiện trạng thái hiện tại sau trận mưa sáng.
3. 降る: “sẽ mưa/mưa”; thể từ điển không nói được mưa đã dừng hiện giờ.
4. 降らない: “không mưa”; dạng này nói thói quen hoặc dự đoán, không rõ trạng thái đang kết thúc như 「降っていない」.
Dịch: “Sáng nay mưa rất to, nhưng bây giờ thì đã tạnh rồi.”
Ghi nhớ: 「もうVていない」 = không còn đang V; 「Vない」 đơn thuần phủ định hành động/trạng thái.`,

  toan_q_2021_12_45: `Đáp án 2 — 「携帯電話がポケットから落ちそう」: điện thoại trông như sắp rơi khỏi túi. 「Vます形 bỏ ます＋そう」 diễn tả dấu hiệu sắp xảy ra; 「落ちる」 là vật tự rơi.
1. 落ちるそうです: 「そうです」 sau thể từ điển thường truyền đạt tin nghe được (“nghe nói sẽ rơi”); người nói đang nhìn thấy điện thoại sắp rơi.
2. 落ちそうです: 「落ちる」 bỏ 「る」＋「そう」 tạo 「落ちそう」 = có vẻ sắp rơi, hợp với cảnh báo ngay lúc này.
3. 落とすそうです: 「落とす」 là làm rơi một vật; 「電話が」 là điện thoại tự rơi, không phải ai làm rơi.
4. 落としそうです: “có vẻ (ai đó) sắp làm rơi”; cần người gây ra hành động, không hợp khi điện thoại đang trượt khỏi túi.
Dịch: “Nishikawa: À, điện thoại di động của cậu sắp rơi khỏi túi kìa. — Mori: Đúng thật. Cảm ơn cậu.”
Ghi nhớ: 「自動詞＋そう」 = có vẻ sắp tự xảy ra; 「他動詞＋そう」 = có vẻ sắp làm rơi/làm vỡ…; 「普通形＋そうだ」 có thể là “nghe nói”.`,

  toan_q_2021_12_46: `Đáp án 4 — 「新しいケーキ屋さんができるみたいだね」: nghe có vẻ/sắp có một tiệm bánh mới mở trước ga. 「みたいだ」 nêu phỏng đoán dựa trên thông tin hoặc dấu hiệu.
1. でしょう: cấu trúc này vẫn đúng nếu người nói tự đưa ra dự đoán (“chắc sẽ có”). Theo đáp án trong bảng, câu được hiểu là đang chia sẻ thông tin/dấu hiệu mới nghe được nên 「みたいだ」 hợp ý hơn; riêng 「でしょう」 không sai ngữ pháp trong mọi ngữ cảnh.
2. といい: “giá mà/cầu mong”; cần người nói bày tỏ mong ước, trong khi người nghe bất ngờ và vui vì tin mới.
3. ほうがいい: “nên”; thường so sánh/đưa lời khuyên, không dùng để suy đoán tiệm sẽ mở.
4. みたいだ: “có vẻ/nghe nói”; 「できるみたいだね」 tự nhiên khi chia sẻ tin hoặc dấu hiệu về tiệm mới, được đáp lại bằng 「本当ですか」 và 「楽しみですね」. Đây là đáp án của bảng khóa người dùng cung cấp.
Dịch: “A: Nghe nói sắp có một tiệm bánh mới mở trước ga nhỉ. — B: Thật ạ? Đáng mong chờ quá.”
Ghi nhớ: 「普通形＋みたいだ」 = có vẻ/nghe như; 「Vといい」 = mong là V. Lưu ý: 「でしょう」 cũng có thể diễn tả phỏng đoán; lựa chọn 4 được chọn theo cách hiểu thông tin trong hội thoại và bảng khóa, nên câu này có độ mơ hồ ngữ dụng nhất định.`,

  toan_q_2021_12_47: `Đáp án 1 — 「やりすぎるのもよくない」: tưới quá nhiều cũng không tốt. 「Vすぎる」 nghĩa là làm quá mức; 「の」 danh từ hóa hành động.
1. やりすぎるのもよくない: “tưới quá nhiều cũng không tốt”; được giải thích ngay bằng việc nhiều nước làm rễ thối.
2. やらなくていいのがいい: “tốt nhất là không cần tưới”; trái với câu trước nói khi đất khô thì cần tưới.
3. やってやるのもよくない: 「やってやる」 mang nghĩa làm cho ai đó hoặc sắc thái “làm cho bằng được”; không phù hợp chăm cây và không nói tưới quá mức.
4. やらないでおくのがいい: “tốt nhất cứ để không tưới”; mâu thuẫn với việc cần tưới khi đất đã khô.
Dịch: “Cây này cần tưới khi mặt đất khô, nhưng tưới quá nhiều cũng không tốt. Nếu nhiều nước thì rễ sẽ bị thối.”
Ghi nhớ: 「Vすぎる」 = làm V quá mức; 「〜のもよくない」 = làm như vậy cũng không tốt.`,

  toan_q_2021_12_48: `Đáp án 4 — 「11時に変えていただけないでしょうか」: “tôi có thể xin đổi sang 11 giờ được không ạ?”. 「Vていただけないでしょうか」 là cách nhờ người nghe làm việc gì rất lịch sự.
1. 変えましょうか: “tôi đổi nhé?”; người nói đề nghị tự thay đổi lịch cho phía bệnh viện, đảo sai người thực hiện.
2. 変えたほうがいいですか: “tôi có nên đổi không?”; xin lời khuyên, không phải đề nghị nhân viên đổi lịch đặt khám.
3. 変えていただきましょう: “hãy để tôi nhờ/nhận việc đổi”; 「ましょう」 nói ý định rủ rê/đề xuất, không phải câu xin phép lịch sự.
4. 変えていただけないでしょうか: “anh/chị có thể đổi giúp tôi được không ạ?”; khiêm nhường, đúng lời bệnh nhân nhờ lễ tân đổi giờ hẹn.
Dịch: “(Bệnh nhân gọi điện đến bệnh viện) Lễ tân: Vâng, bệnh viện Yamada xin nghe. — Bệnh nhân: Xin lỗi, tôi là Tanaka đã đặt lịch lúc 10 giờ. Có thể đổi sang 11 giờ giúp tôi được không ạ?”
Ghi nhớ: 「Vていただけませんか／いただけないでしょうか」 = xin người nghe làm V cho mình; 「Vましょうか」 đề nghị chính người nói làm.`,
}

let updated = 0
for (const exam of exams) {
  if (exam.id !== 'toan-n3-202112-full') continue
  for (const part of exam.parts || []) {
    if (!part.title.includes('Ngữ pháp') || !part.title.includes('Mondai 1')) continue
    for (const question of part.questions || []) {
      const explanation = updates[question.id]
      if (!explanation) continue
      question.explanation = explanation.trim()
      curated[question.id] = explanation.trim()
      updated++
    }
  }
}

const standalone = standaloneExams.find((exam) => exam.id === 'cm2u2xosv0138134ib0bvpy32-grammar-reading')
if (!standalone) throw new Error('Could not find the standalone December 2021 N3 grammar-reading exam.')
let standaloneUpdated = 0
for (const part of standalone.parts || []) {
  for (const question of part.questions || []) {
    const explanation = updates[`toan_q_2021_12_${question.number}`]
    if (!explanation) continue
    question.explanation = explanation.trim()
    standaloneUpdated++
  }
}

if (updated !== Object.keys(updates).length || standaloneUpdated !== Object.keys(updates).length) {
  throw new Error(
    `Expected to update 13 questions in both views; found ${updated} full mock and ${standaloneUpdated} standalone.`
  )
}

fs.writeFileSync(masterPath, `${JSON.stringify(exams, null, 2)}\n`, 'utf8')
fs.writeFileSync(standalonePath, `${JSON.stringify(standaloneExams, null, 2)}\n`, 'utf8')
fs.writeFileSync(curatedPath, `${JSON.stringify(curated, null, 2)}\n`, 'utf8')
console.log(
  `Updated ${updated} full-mock and ${standaloneUpdated} standalone N3 grammar explanations for December 2021.`
)
