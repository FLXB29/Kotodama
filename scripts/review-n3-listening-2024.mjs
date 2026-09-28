import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = fileURLToPath(new URL('../', import.meta.url))
const masterPath = path.join(root, 'data/jlpt_n3_toan_master.json')
const curatedPath = path.join(root, 'data/jlpt_n3_explanations_curated.json')
const reportPath = path.join(root, 'reports/n3-quality-audit/listening-2024-transcript-review.json')
const master = JSON.parse(fs.readFileSync(masterPath, 'utf8').replace(/^\uFEFF/, ''))
const curated = JSON.parse(fs.readFileSync(curatedPath, 'utf8').replace(/^\uFEFF/, ''))

const translations = {
  toan_q_2024_12_74: 'Người nam cần sửa mục nào trong báo cáo chuyến công tác?',
  toan_q_2024_12_75: 'Để đặt trước cuốn sách, nam sinh sẽ làm gì tiếp theo?',
  toan_q_2024_12_76: 'Sau đây, nữ sinh cần làm việc gì?',
  toan_q_2024_12_77: 'Sau đây, người phụ nữ sẽ làm gì trước tiên?',
  toan_q_2024_12_78: 'Người đàn ông sẽ thay đổi điều gì từ bây giờ?',
  toan_q_2024_12_79: 'Sau khi xuống tàu, khách trong đoàn sẽ làm gì trước tiên?',
  toan_q_2024_12_80: 'Vì sao người chồng quay về nhà?',
  toan_q_2024_12_81: 'Người đàn ông nói điều gì là tốt nhất khi nuôi chó?',
  toan_q_2024_12_82: 'Vì mục đích gì người phụ nữ phải quay lại tiệm bánh?',
  toan_q_2024_12_83: 'Thầy giáo muốn học sinh làm gì trong kỳ nghỉ hè?',
  toan_q_2024_12_84: 'Nam sinh thấy điều gì hữu ích nhất khi tham gia buổi giới thiệu công ty?',
  toan_q_2024_12_85: 'Theo người dẫn chương trình, vì sao chiếc bàn được người cao tuổi ưa chuộng?',
  toan_q_2024_07_74: 'Du học sinh nam sẽ làm gì trước tiên?',
  toan_q_2024_07_75: 'Người phụ nữ sẽ sửa tài liệu như thế nào?',
  toan_q_2024_07_76: 'Du học sinh nam phải làm gì?',
  toan_q_2024_07_77: 'Người đàn ông phải làm gì trước tiên?',
  toan_q_2024_07_78: 'Nữ sinh sẽ mua những gì?',
  toan_q_2024_07_79: 'Hôm nay nhân viên mới sẽ làm gì?',
  toan_q_2024_07_80: 'Người phụ nữ nói vì sao cô trở thành giáo viên?',
  toan_q_2024_07_81: 'Điều gì đọng lại nhất trong chuyến đi của người đàn ông?',
  toan_q_2024_07_82: 'Vì sao nam sinh mời nữ sinh đến quán cà phê gần nhà ga?',
  toan_q_2024_07_83: 'Trung tâm thương mại Minami bắt đầu làm gì trong năm nay cho khách nước ngoài?',
  toan_q_2024_07_84: 'Điều gì giúp nam sinh nhảy tốt hơn và hữu ích nhất với cậu ấy?',
  toan_q_2024_07_85: 'Từ khi nào không thể mượn sách ở thư viện trường?',
}

const explanations = {
  toan_q_2024_12_86:
    'Dịch câu hỏi: “Hai người đang nói về điều gì?” Họ muốn làm món quà chia tay cho thầy Sato; vì không biết rõ gu ăn mặc của thầy nên họ chọn tự làm thiệp có ảnh cả lớp và lời nhắn. Đáp án 2, món quà tặng thầy, bao quát đúng cuộc trò chuyện. Đáp án 1 hỏi lý do thầy nghỉ việc, 3 là tin nhắn thầy gửi cho lớp, còn 4 là kỷ niệm với thầy; không đáp án nào là chủ đề họ đang bàn.',
  toan_q_2024_12_87:
    'Dịch câu hỏi: “Người phụ nữ đang nói về điều gì?” Nhóm tỉa cành yếu và dọn cỏ quanh cây do con người trồng để rừng Midoriyama khỏe và được bảo tồn; đó là hoạt động bảo vệ thiên nhiên, đáp án 1. Họ không bàn nguyên nhân cây giảm, đặc điểm riêng của cây mọc tự nhiên hay cách trồng cây mới (đáp án 2–4).',
  toan_q_2024_12_88:
    'Dịch câu hỏi: “Người đàn ông đang nói về điều gì?” Anh nêu wasabi làm giảm mùi cá sống, giúp thức ăn khó hỏng hơn, kích thích ăn ngon và có thể có lợi cho sức khỏe; đáp án 2 là các tác dụng của wasabi. Anh chỉ nói mình thích ăn wasabi ở phần mở đầu, không giải thích lý do anh bắt đầu thích (1), vì sao nhiều người ghét (3), hay nghiên cứu về vị ngon (4).',
  toan_q_2024_12_89:
    'Dịch tình huống: “Bạn mua bánh ngon để mời đồng nghiệp. Bạn sẽ nói gì?” Đáp án 3 「１つ召し上がりませんか」 là “Anh/chị dùng thử một cái nhé?”; 召し上がる là kính ngữ của 食べる nên lời mời lịch sự. Đáp án 1 「お味はいかがですか」 hỏi “Mùi vị thế nào?” sau khi người kia đã ăn; đáp án 2 「では、いただきますね」 là “Vậy tôi xin nhận/dùng nhé”, lời của người được mời.',
  toan_q_2024_12_90:
    'Dịch tình huống: “Trong rạp phim, có người đang ngồi vào ghế của bạn. Bạn sẽ nói gì?” Đáp án 2 「ここ私の席なんですけど」 nghĩa là “Xin lỗi, đây là chỗ của tôi…”; cách nói mềm nhưng báo đúng vấn đề. Đáp án 1 hỏi ghế bên cạnh có trống không, không nhắc chiếc ghế họ ngồi nhầm; đáp án 3 「どうぞ座ってください」 lại mời họ ngồi.',
  toan_q_2024_12_91:
    'Dịch tình huống: “Cà ri sắp dính vào cà vạt bạn mình. Bạn muốn báo cho bạn ấy.” Đáp án 2 「あ、ついちゃうよ」 là “Này, sắp dính vào đấy”, cảnh báo về vết bẩn sắp xảy ra. Đáp án 1 「つけなくちゃ」 là “phải làm cho dính/phải bôi”, không phải cảnh báo; đáp án 3 「ついたら教えて」 là “nếu bị dính thì nói mình biết”, tức nói sau khi việc đã xảy ra.',
  toan_q_2024_12_92:
    'Dịch tình huống: “Bạn cần dùng kéo nhưng không có, nên muốn nói gì với đàn anh?” Đáp án 1 「はさみをちょっとお借りできますか」 là “Em có thể mượn kéo một lát được không ạ?”, lời xin phép lịch sự. Đáp án 2 「お返ししましょうか」 hỏi “Em trả lại nhé?” như thể đã mượn kéo rồi; đáp án 3 「使っていただきたい」 có nghĩa muốn đối phương sử dụng kéo, ngược với điều người nói cần.',
  toan_q_2024_12_93:
    'Dịch tình huống: “Bạn mình bị đau chân; bạn khuyên nghỉ buổi tập tennis chiều nay. Bạn ấy đáp gì?” Đáp án 1 「そうする。今日は帰るね」 là “Ừ, mình sẽ làm vậy. Hôm nay mình về đây”, chấp nhận lời khuyên. Đáp án 2 tưởng hôm nay không có buổi tập; đáp án 3 hỏi ngược “Hôm nay bạn nghỉ tennis à?” nên không phải lời nhận nghỉ của người đang đau chân.',
  toan_q_2024_12_94:
    'Dịch tình huống: “Nghe nói lễ hội pháo hoa của thị trấn năm nay bị hủy. Bạn sẽ nói gì?” Đáp án 2 「え？なんで？楽しみにしてたのに」 nghĩa là “Ơ, sao vậy? Mình đã mong chờ lắm mà…”, thể hiện ngạc nhiên và tiếc nuối. Đáp án 1 chỉ nói “có lẽ không tổ chức” dù tin đã xác nhận bị hủy; đáp án 3 “vậy phải đi xem thôi” trái với việc lễ hội không diễn ra.',
  toan_q_2024_12_95:
    'Dịch tình huống: “Yoshida được cảm ơn vì đã dẫn bạn đi chơi. Cô ấy đáp gì?” Đáp án 1 「喜んでもらえてよかった」 là “Mình vui vì bạn đã vui/thích chuyến đi”, đúng vai người dẫn. Đáp án 2 xin lỗi vì không đi cùng, trong khi cô ấy đã dẫn bạn đi; đáp án 3 cảm ơn người kia vì đã dẫn đường, đảo ngược vai trò.',
  toan_q_2024_12_96:
    'Dịch tình huống: “Một người chưa biết có dự được buổi ăn tuần sau không và hỏi hạn trả lời. Bạn đáp gì?” Đáp án 1 「今週中なら大丈夫ですよ」 nghĩa là “Trả lời trong tuần này thì vẫn kịp”, trực tiếp cho biết thời hạn. Đáp án 2 mừng vì người kia có thể tham dự, dù họ chưa xác nhận; đáp án 3 chỉ nói đang chờ phản hồi mà không trả lời khi nào cần báo.',
  toan_q_2024_12_97:
    'Dịch tình huống: “Trời chuyển nhiều mây; hai người muốn về trước khi mưa.” Đáp án 3 「降る前に帰ったほうがいいね」 là “Nên về trước khi mưa”, đồng ý đúng kế hoạch. Đáp án 1 hỏi mưa đã bắt đầu chưa; đáp án 2 đề nghị chờ mưa tạnh, trái với ý về trước khi mưa.',
  toan_q_2024_12_98:
    'Dịch tình huống: “Bạn được nhờ mang thùng các-tông gần cửa đến kho. Bạn muốn hỏi có thể làm sau không.” Đáp án 3 「あとでもいいですか」 là “Để lát nữa làm có được không?”, xin đổi thời điểm. Đáp án 1 hiểu nhầm rằng thùng đang ở trong kho; đáp án 2 chỉ cảm ơn và nhận việc, không xin hoãn.',
  toan_q_2024_12_99:
    'Dịch tình huống: “Khách hỏi có thể chụp ảnh bên trong cửa hàng không vì thấy nơi này đẹp. Nhân viên sẽ trả lời gì?” Đáp án 1 「写真はご遠慮ください」 là “Xin vui lòng không chụp ảnh”, cách từ chối lịch sự. Đáp án 2 cảm ơn vì bức ảnh đẹp dù khách chưa chụp; đáp án 3 nói “Tôi không chụp ảnh”, không trả lời quy định dành cho khách.',
  toan_q_2024_12_100:
    'Dịch tình huống: “Trưởng phòng gọi điện báo sẽ về nhà thẳng từ nơi thăm khách, không ghé công ty. Bạn xác nhận lại thế nào?” Đáp án 2 「そのまま家に帰られるんですね」 là “Vậy trưởng phòng về nhà luôn nhỉ?”, xác nhận đúng thông tin và dùng kính ngữ. Đáp án 1 nói ông sẽ quay lại công ty; đáp án 3 hiểu thành ông ghé qua nhà rồi mới đi đâu đó.',
  toan_q_2024_12_101:
    'Dịch tình huống: “Công trình đang chậm tiến độ; đồng nghiệp nói có lẽ nên báo trưởng phòng. Bạn đáp gì?” Đáp án 3 「そうですね。伝えておきます」 là “Đúng vậy. Tôi sẽ báo lại”, vừa đồng ý vừa nhận việc. Đáp án 1 hỏi trưởng phòng có phải người nói công trình chậm không; đáp án 2 từ chối báo cáo, trái với đề nghị.',
  toan_q_2024_07_86:
    'Dịch câu hỏi: “Người đàn ông muốn nói điều gì?” Cô cháu gái bốn tuổi tặng chú chiếc lá vàng và cũng nói “cảm ơn” khi chú nhận quà; nụ cười và lời nói ấy khiến chú xúc động, nên đáp án 4. Đáp án 1 nói cháu vui vì món quà, 2 khen nụ cười đáng yêu, 3 nói chú vui khi chơi cùng cháu; cả ba không nêu điều khiến chú rơi nước mắt là lời nói của cháu.',
  toan_q_2024_07_87:
    'Dịch câu hỏi: “Phát thanh viên đang nói về điều gì?” Bài nói nêu cả lợi ích của làm việc tại nhà (không mất thời gian đi lại, có thêm thời gian cho gia đình/sở thích) lẫn bất lợi (khó trao đổi trực tiếp, khó xin ý kiến, dễ căng thẳng), nên đáp án 3. Các đáp án 1, 2 và 4 lần lượt nói về lý do nghỉ việc, cách xây dựng quan hệ, hoặc đặc điểm người căng thẳng; đó không phải chủ đề bao quát bài nói.',
  toan_q_2024_07_88:
    'Dịch câu hỏi: “Thầy ở lớp thể thao đang nói về điều gì?” Thầy dạy tư thế và cách vận động, đồng thời yêu cầu trẻ tự hiểu vì sao phải đạp đất mạnh hoặc hạ thấp người khi xuất phát; trọng tâm là cách giảng dạy, đáp án 1. Đáp án 2 chỉ nói quan hệ thể thao-khoa học, 3 hỏi bài tập hôm nay, 4 hỏi cách chạy phù hợp từng trẻ; các ý này không bao quát phương pháp hướng dẫn được mô tả.',
  toan_q_2024_07_89:
    'Dịch tình huống: “Bạn ở nhờ nhà bạn trong kỳ nghỉ; lúc về, bạn chào bố mẹ của bạn mình thế nào?” Đáp án 1 「お世話になりました」 là “Cảm ơn cô chú đã giúp đỡ/chăm sóc cháu”, lời cảm ơn khi rời đi. Đáp án 2 「お邪魔します」 thường nói lúc mới vào nhà; đáp án 3 「気をつけて帰ってください」 là lời chủ nhà dặn khách trên đường về.',
  toan_q_2024_07_90:
    'Dịch tình huống: “Ở quán cà phê, chỗ cạnh cửa sổ vừa trống. Bạn muốn hỏi nhân viên có thể chuyển sang đó không.” Đáp án 3 「あっちの席に移れますか」 là “Tôi có thể chuyển sang chỗ kia không?”, đúng ý xin phép. Đáp án 1 「変わってもらえますか」 dễ thành nhờ người khác đổi chỗ với mình; đáp án 2 hỏi có bắt buộc phải ngồi chỗ cạnh cửa sổ hay không.',
  toan_q_2024_07_91:
    'Dịch tình huống: “Bạn đang cầm kem nên không thể cúi buộc dây giày. Bạn nhờ bạn mình thế nào?” Đáp án 2 「これ、持っててもらえる？」 là “Bạn cầm cái này giúp mình nhé?”, dùng ～てもらえる để nhờ vả thân mật. Đáp án 1 hỏi có buộc dây giúp không; đáp án 3 xin kem, không giải quyết việc hai tay đang bận.',
  toan_q_2024_07_92:
    'Dịch tình huống: “Trời mưa và trưởng phòng không có ô. Bạn muốn lịch sự mời ông dùng ô của mình.” Đáp án 1 「傘、お使いになりませんか」 là “Trưởng phòng dùng ô này nhé ạ?”, dùng kính ngữ お使いになる. Đáp án 2 xin trưởng phòng cho mình mượn ô; đáp án 3 hỏi có cầm giữ ô giúp ông không, đều ngược ý định.',
  toan_q_2024_07_93:
    'Dịch tình huống: “Ví của Yamada sắp rơi khỏi túi.” Đáp án 1 「あ、本当だ。ありがとう」 là “À, đúng thật. Cảm ơn nhé”, phản hồi tự nhiên khi được cảnh báo. Đáp án 2 nói đã đánh rơi mà không nhận ra, tức việc đã xảy ra; đáp án 3 hỏi đã mất ví chưa, trong khi ví vẫn sắp rơi chứ chưa mất.',
  toan_q_2024_07_94:
    'Dịch tình huống: “Thầy nhắc Yang chưa nộp báo cáo và yêu cầu mang đến trong hôm nay.” Đáp án 2 「今日必ず出します」 là “Hôm nay em nhất định sẽ nộp”, xác nhận đúng hạn. Đáp án 1 xin nộp ngày mai và đáp án 3 hiểu nhầm là hôm nay không cần nộp.',
  toan_q_2024_07_95:
    'Dịch tình huống: “Mong ngày mai lễ tốt nghiệp trời đẹp nhỉ.” Đáp án 2 「晴れてほしいよね」 là “Ừ, mong trời nắng nhỉ”, cùng chia sẻ mong muốn. Đáp án 1 hỏi trời có nắng không rồi nói may quá như thể đã biết kết quả; đáp án 3 hỏi có muốn trời không nắng không, ngược ý.',
  toan_q_2024_07_96:
    'Dịch tình huống: “Bạn đồng nghiệp hỏi về việc các anh chị định mua quà cưới cho Mori và xin tham gia.” Đáp án 3 「あぁ、ぜひ一緒に」 là “Ừ, tất nhiên là cùng đi rồi”, chấp nhận lời xin tham gia. Đáp án 1 hiểu thành người kia không muốn mua quà; đáp án 2 ngạc nhiên hỏi chính mình có tham gia không, đảo vai.',
  toan_q_2024_07_97:
    'Dịch tình huống: “Đàn em nói đang nghĩ đến chuyện rời câu lạc bộ tennis.” Đáp án 3 「何かあったの？」 là “Có chuyện gì vậy?”, hỏi thăm tự nhiên khi người kia mới cân nhắc nghỉ. Đáp án 1 tưởng bạn đã quyết định tiếp tục; đáp án 2 tưởng bạn đã nghỉ rồi, trong khi chưa có quyết định cuối cùng.',
  toan_q_2024_07_98:
    'Dịch tình huống: “Bạn được hỏi trưởng phòng hiện đang ở đâu.” Đáp án 1 「さっき出かけられました」 là “Trưởng phòng vừa ra ngoài lúc nãy”, dùng 出かけられる để kính trọng và báo tình trạng hiện tại. Đáp án 2 chỉ nói người trả lời nghĩ mình không biết; đáp án 3 “ở đâu cũng được” không trả lời và thiếu lịch sự.',
  toan_q_2024_07_99:
    'Dịch tình huống: “Người bạn lo cho trận đấu ngày mai vì lần nào thi đấu cũng căng thẳng đến đau bụng.” Đáp án 3 「毎回なんだ。大変だね」 là “Lần nào cũng vậy à, vất vả thật”, hiểu đúng 毎回 (mỗi lần) và thể hiện cảm thông. Đáp án 1 nói đây là lần đầu; đáp án 2 nói chỉ xảy ra một lần, đều trái thông tin.',
  toan_q_2024_07_100:
    'Dịch tình huống: “Bạn xin được hướng dẫn lại cách làm biểu đồ để đưa vào tài liệu.” Đáp án 3 「難しかったですか」 là “Phần đó khó với bạn à?”, phản hồi phù hợp để xác nhận lý do cần hướng dẫn lại. Đáp án 1 hiểu nhầm rằng người kia yêu cầu mình làm biểu đồ; đáp án 2 lặp lại lời xin dạy mà không đáp lại.',
  toan_q_2024_07_101:
    'Dịch tình huống: “Chiếc máy giặt đã dùng 20 năm, có thể hỏng bất cứ lúc nào.” Đáp án 2 「よく壊れないで動いているよね」 là “Nó vẫn chạy mà chưa hỏng cũng giỏi thật”, bày tỏ ngạc nhiên rằng máy vẫn hoạt động. Đáp án 1 hỏi khi nào nó đã hỏng và đáp án 3 nói cuối cùng nó đã hỏng, đều nhầm giả định với tình trạng thực tế.',
}

const examIds = new Set(['toan-n3-202407-full', 'toan-n3-202412-full'])
const exams = master.filter((exam) => examIds.has(exam.id))
if (exams.length !== 2) throw new Error(`Expected both 2024 exams; found ${exams.length}`)
const questions = exams.flatMap((exam) =>
  exam.parts.filter((part) => part.title.startsWith('Nghe')).flatMap((part) => part.questions)
)
if (questions.length !== 56) throw new Error(`Expected 56 listening questions; found ${questions.length}`)

const recoverPrintedOptions = (script, answer, id) => {
  const options = []
  for (const line of script.split(/\r?\n/u)) {
    if (/^\s*[1-4１-４]\s*番/u.test(line)) continue
    const match = line.match(/^\s*([1-4１-４])(?:[.．、]\s*|\s+)(.+?)\s*$/u)
    if (!match) continue
    const number = Number(match[1].replace(/[１-４]/gu, (digit) => String('１２３４'.indexOf(digit) + 1)))
    if (number !== options.length + 1) continue
    options.push(`${number}. ${match[2].replace(/[（(]正解\s*[：:]?\s*[1-4１-４][）)]/u, '').trim()}`)
  }
  if (!options.length || answer > options.length)
    throw new Error(`${id}: recovered ${options.length} printed options for answer ${answer}`)
  return options
}

const imageOptions = {
  toan_q_2024_07_74: [
    '1. Cán bột thành đế bánh tròn',
    '2. Phết sốt cà chua lên đế bánh',
    '3. Cắt nguyên liệu làm nhân bánh',
    '4. Xếp nguyên liệu lên mặt bánh',
  ],
  toan_q_2024_12_76: [
    '1. ア＋イ — mang ghế đến hội trường và đặt chương trình lên bàn tiếp tân',
    '2. ア＋イ＋ウ — mang ghế, đặt chương trình và chuyển trống',
    '3. ア＋エ — mang ghế và gặp giáo viên',
    '4. イ＋ウ＋エ — đặt chương trình, chuyển trống và gặp giáo viên',
  ],
}
const concertImageNote =
  'Chú thích hình: ア là mang ghế, イ là đặt xấp chương trình lên bàn, ウ là chuyển trống, エ là ngồi trao đổi với giáo viên. Lựa chọn 1 (ア＋イ) khớp thứ tự nhiệm vụ; các tổ hợp còn lại thêm việc chuyển trống đã xong hoặc gặp giáo viên chưa đến lượt.'

const reviewed = []
const markerMismatches = []
const restoredOptionQuestions = []
const imageOptionQuestions = []
const optionCountCorrections = []
for (const question of questions) {
  const id = question.id
  const explanation = explanations[id] ?? curated[id]
  if (!explanation) throw new Error(`${id}: missing explanation`)
  if (question.number <= 85) {
    const translation = translations[id]
    if (!translation) throw new Error(`${id}: missing translated question`)
    const explanationBody = curated[id].replace(/^(?:Dịch câu hỏi: “.*?”\s*)+/u, '')
    const keyMention = new RegExp(`(?:đáp án|chọn(?: phương án)?)(?: số)?\\s*${question.answer}\\b`, 'iu')
    const answerLabel = keyMention.test(explanationBody) ? '' : `Đáp án ${question.answer}. `
    curated[id] = `Dịch câu hỏi: “${translation}” ${answerLabel}${explanationBody}`
    if (id === 'toan_q_2024_12_76') {
      const bodyWithoutImageNote = curated[id].replaceAll(concertImageNote, '').trim()
      curated[id] = `${bodyWithoutImageNote} ${concertImageNote}`
    }
  } else {
    curated[id] = explanation
    if (!question.script) throw new Error(`${id}: missing listening transcript`)
    const storedOptionCount = question.options.length
    question.options = recoverPrintedOptions(question.script, question.answer, id)
    if (question.options.length !== storedOptionCount) {
      optionCountCorrections.push({ id, stored: storedOptionCount, transcript: question.options.length })
    }
    restoredOptionQuestions.push(id)
  }
  if (imageOptions[id]) {
    question.options = imageOptions[id]
    imageOptionQuestions.push(id)
  }

  const markers = [...question.script.matchAll(/正解\s*[：:]\s*([1-4１-４])/gu)].map((match) =>
    Number(match[1].replace(/[１-４]/gu, (digit) => String('１２３４'.indexOf(digit) + 1)))
  )
  const markerMatches = markers.length > 0 && markers.every((answer) => answer === question.answer)
  if (markers.some((answer) => answer !== question.answer) || question.answer !== question.correctAnswer) {
    markerMismatches.push({ id, stored: [question.answer, question.correctAnswer], markers })
  }
  reviewed.push({
    questionId: id,
    examId: exams.find((exam) => exam.parts.some((part) => part.questions.some((item) => item.id === id))).id,
    number: question.number,
    answer: question.answer,
    transcriptKeyMarkers: markers,
    answerVerification: markerMatches ? 'transcript-marker-matched' : 'manual-transcript-choice-review-no-marker',
    status: 'transcript-and-explanation-reviewed',
    optionsRecoveredFromTranscript: restoredOptionQuestions.includes(id),
    optionsTranscribedFromImage: imageOptionQuestions.includes(id),
    explanation: curated[id],
  })
}

if (markerMismatches.length)
  throw new Error(`Stored answers conflict with transcript: ${JSON.stringify(markerMismatches)}`)
if (Object.keys(explanations).length !== 32)
  throw new Error(`Expected 32 reviewed short-response explanations; got ${Object.keys(explanations).length}`)
if (Object.keys(translations).length !== 24)
  throw new Error(`Expected 24 question translations; got ${Object.keys(translations).length}`)
if (restoredOptionQuestions.length !== 32)
  throw new Error(`Expected 32 restored option sets; got ${restoredOptionQuestions.length}`)
if (imageOptionQuestions.length !== 2)
  throw new Error(`Expected two transcribed image-option sets; got ${imageOptionQuestions.length}`)

fs.writeFileSync(masterPath, `${JSON.stringify(master, null, 2)}\n`)
fs.writeFileSync(curatedPath, `${JSON.stringify(curated, null, 2)}\n`)
fs.mkdirSync(path.dirname(reportPath), { recursive: true })
fs.writeFileSync(
  reportPath,
  `${JSON.stringify(
    {
      generatedAt: new Date().toISOString(),
      method:
        'Reviewed all 56 listening questions in 2024-07 and 2024-12. Translated the prompt or situation and expanded each explanation to justify the keyed answer and distinguish distractors. 43 keys match 正解 markers in the attached scripts; the last 13 December questions have no marker and were checked against their transcript and choices. Restored choice text for 32 questions from scripts and transcribed two pictured choice sets by visual inspection in Chrome. No answer key was changed.',
      transcriptSource: 'data/jlpt_n3_toan_master.json script fields',
      answerKeySource:
        'Attached 正解 markers when present; otherwise transcript and choice-level review only. Official JLPT key not independently checked.',
      totals: {
        questionsReviewed: reviewed.length,
        explanationsExpanded: reviewed.length,
        keysChanged: 0,
        keysMatchedTranscriptMarkers: reviewed.filter((row) => row.transcriptKeyMarkers.length).length,
        keysWithoutTranscriptMarkers: reviewed.filter((row) => !row.transcriptKeyMarkers.length).length,
        keysComparedWithOfficialAnswerKey: 0,
        optionsRecoveredFromTranscript: restoredOptionQuestions.length,
        optionsTranscribedFromImage: imageOptionQuestions.length,
        unresolvedVisualMappings: 0,
        optionCountCorrections: optionCountCorrections.length,
      },
      restoredOptionQuestions,
      optionCountCorrections,
      imageOptionQuestions,
      limitations: [
        {
          questionIds: reviewed.filter((row) => !row.transcriptKeyMarkers.length).map((row) => row.questionId),
          issue:
            'December questions 89–101 do not contain 正解 markers in the attached scripts; the answer choices and dialogue were reviewed, but these keys were not independently verified against an official answer key.',
        },
        { issue: 'Original JLPT PDFs and official answer keys were not independently checked for this batch.' },
      ],
      questions: reviewed,
    },
    null,
    2
  )}\n`
)
console.log(
  JSON.stringify({
    reviewed: reviewed.length,
    matchedTranscriptKeys: reviewed.filter((row) => row.transcriptKeyMarkers.length).length,
    keysWithoutTranscriptMarkers: reviewed.filter((row) => !row.transcriptKeyMarkers.length).length,
    restoredTranscriptOptions: restoredOptionQuestions.length,
    imageOptionsTranscribed: imageOptionQuestions.length,
    keysChanged: 0,
    reportPath,
  })
)
