import fs from 'node:fs'
import path from 'node:path'

const masterPath = path.resolve('data/jlpt_n3_toan_master.json')
const curatedPath = path.resolve('data/jlpt_n3_explanations_curated.json')
const exams = JSON.parse(fs.readFileSync(masterPath, 'utf8'))
const curated = JSON.parse(fs.readFileSync(curatedPath, 'utf8'))

const updates = {
  toan_q_2025_12_51: `Câu hoàn chỉnh: 「半年前にギターを習い始めてから、毎日練習している。弾けば弾くほど上手に弾けるようになっていくのが自分でもわかり、とても楽しい。」 Nghĩa là tôi bắt đầu học guitar nửa năm trước và luyện tập mỗi ngày; tôi tự nhận ra mình chơi khá hơn và chơi được tốt hơn theo từng lần luyện, điều đó rất vui. Trật tự là 2→1→4→3; ô ★ ở vị trí thứ ba nhận lựa chọn 4 「弾けるように」. Mẫu 「～ば～ほど」 diễn tả mức độ tăng dần: càng chơi thì càng chơi tốt; 「弾けるようになっていく」 nói về sự tiến bộ dần dần.`,
  toan_q_2023_12_51: `Câu hoàn chỉnh: 「(大学で)中山「林先輩、ゼミの発表で使う資料を作ったんですが、自信がないところがあるので、一度チェックしてもらえないでしょうか。」林「いいですよ。」」 Nghĩa là: “Anh Hayashi, em đã làm tài liệu cho buổi thuyết trình ở seminar, nhưng có chỗ em chưa tự tin; anh xem giúp em một lần được không ạ?” Trật tự là 4→2→3→1; ô ★ ở vị trí thứ ba nhận lựa chọn 3 「一度チェックして」. 「自信がない」 bổ nghĩa cho 「ところ」; 「ので」 nêu lý do, rồi 「～てもらえないでしょうか」 là cách nhờ vả lịch sự.`,
  toan_q_2024_07_49: `Câu hoàn chỉnh: 「朝、近所のパン屋の前を通ると、パンの焼けるいいにおいがする。」 Nghĩa là buổi sáng đi ngang tiệm bánh gần nhà thì có mùi bánh nướng rất thơm. Trật tự là 3→2→4→1; ô ★ ở vị trí thứ ba nhận lựa chọn 4 「いいにおい」. 「パンの焼ける」 bổ nghĩa cho 「いいにおい」; cụm 「いいにおいがする」 nghĩa là “có mùi thơm”.`,
  toan_q_2023_07_49: `Câu hoàn chỉnh: 「パソコンや携帯電話の見すぎによる目の疲れが原因で、頭が痛くなることもあるそうだ。」 Nghĩa là nghe nói có khi đau đầu do mỏi mắt vì nhìn máy tính hoặc điện thoại quá nhiều. Trật tự là 3→2→4→1; dấu ★ ở vị trí thứ hai nhận lựa chọn 2 「による」. Cụm 「見すぎによる目の疲れ」 nghĩa là “mỏi mắt do nhìn quá nhiều”; 「が原因で」 nêu nguyên nhân.`,
  toan_q_2023_07_51: `Câu hoàn chỉnh: 「失敗をすることは誰にでもある。大切なのはどうして失敗をしてしまったのか考えて、同じ失敗を繰り返さないようにすることだ。」 Nghĩa là ai cũng có lúc mắc lỗi; điều quan trọng là suy nghĩ vì sao mình đã mắc lỗi để không lặp lại. Trật tự là 4→2→1→3; dấu ★ ở vị trí thứ ba nhận lựa chọn 1 「失敗をしてしまった」. 「大切なのは」 nêu điều quan trọng; 「どうして～のか」 tạo câu hỏi gián tiếp “vì sao”.`,
  toan_q_2025_07_53: `Câu hoàn chỉnh: 「もし雨が降ったとしても、試合は中止にならないんだけど、雨が降ったら応援には無理して来なくてもいいよ。」 Nghĩa là: Dù trời có mưa thì trận đấu cũng không bị hủy; nếu trời mưa thì bạn không cần cố đến cổ vũ. Trật tự là 3→2→4→1; ô ★ thứ ba nhận lựa chọn 4 「中止にならないんだけど」. 「もし～としても」 nêu điều kiện nhượng bộ; 「試合は」 đi với vị ngữ 「中止にならない」. Mảnh 「雨が降ったら」 thuộc mệnh đề sau về việc có cần đến cổ vũ hay không.`,
  toan_q_2011_07_53: `Câu hoàn chỉnh: 「最近、子どもがピアノを習いたいと言いだした。わたしは、子どもがしたいと思うことはやらせてやりたいと思っている。」 Nghĩa là: Gần đây con nói muốn học piano; tôi muốn cho con làm những điều con muốn làm. Trật tự là 1→4→3→2; ô ★ thứ ba nhận lựa chọn 3 「やらせて」. 「したいと思うこと」 là điều đứa trẻ muốn làm; 「やらせてやりたい」 diễn tả mong muốn cho người khác (ở đây là con) làm việc đó.`,
  toan_q_2016_12_49: `Câu hoàn chỉnh: 「この写真の鳥はとても珍しくて、この鳥の研究をしている専門家でもなかなか見る機会がないそうだ。」 Nghĩa là loài chim trong ảnh hiếm đến mức ngay cả chuyên gia nghiên cứu nó cũng hiếm có dịp nhìn thấy. Trật tự là 4→2→3→1; ô ★ nằm ở lựa chọn 3 「なかなか」. Mẫu 「なかなか～ない」 diễn tả việc khó hoặc hiếm khi xảy ra; 「でも」 mang nghĩa “ngay cả”, còn 「研究をしている」 bổ nghĩa cho 「専門家」.`,
  toan_q_2016_07_49: `Câu hoàn chỉnh: 「今日は、久しぶりに家族5人で楽しい休日を過ごした。」 Nghĩa là hôm nay, sau lâu ngày, tôi đã có một ngày nghỉ vui vẻ cùng gia đình năm người. Trật tự là 3→1→4→2; ô ★ là lựa chọn 4 「楽しい休日」. 「家族5人で」 nêu nhóm người cùng làm việc gì; 「休日を過ごす」 là cụm tự nhiên để nói trải qua một ngày nghỉ.`,
  toan_q_2016_07_50: `Câu hoàn chỉnh: 「駅前の店のラーメンは、濃い味が好きな人にはいいかもしれないが、私はちょっと苦手だ。」 Nghĩa là mì ramen ở quán trước ga có thể hợp với người thích vị đậm, nhưng tôi lại không thích lắm. Trật tự là 1→3→2→4; ô ★ là lựa chọn 2 「いい」. 「濃い味が好きな人には」 nêu đối tượng mà món ăn có thể hợp; 「かもしれないが」 nêu khả năng rồi chuyển sang ý trái ngược của người nói.`,
  toan_q_2016_07_53: `Câu hoàn chỉnh: 「今回の彼の新曲は、友情がテーマになっているという点で、これまでに発表されてきた彼の曲と大きく違う。」 Nghĩa là ca khúc mới lần này khác hẳn các bài anh ấy từng phát hành ở điểm lấy tình bạn làm chủ đề. Trật tự là 3→4→2→1; ô ★ là lựa chọn 1 「彼の曲と」. 「という点で」 nêu khía cạnh dùng để so sánh; cụm 「これまでに発表されてきた」 bổ nghĩa cho 「彼の曲」, nên phải đặt liền trước nó.`,
  toan_q_2015_07_49: `Câu hoàn chỉnh: 「この家に引っ越してきて、もう半年になるのに、まだ住所を覚えていないだけです。」 Nghĩa là tôi chuyển đến căn nhà này đã nửa năm rồi mà vẫn chưa nhớ được địa chỉ. Trật tự là 3→2→1→4; ô ★ là lựa chọn 1 「まだ」. 「もう半年になるのに」 tạo ý tương phản “đã nửa năm rồi mà…”, vì vậy 「まだ」 đi với vế phủ định 「覚えていない」.`,
  toan_q_2015_07_53: `Câu hoàn chỉnh: 「30日以上雨の降らない日が続いているが、すぐ気にならなくなった。」 Nghĩa là những ngày không mưa đã kéo dài hơn 30 ngày, nhưng rồi tôi cũng không còn bận tâm nữa. Trật tự là 4→2→1→3; ô ★ là lựa chọn 1 「日が」. 「雨の降らない」 bổ nghĩa cho danh từ 「日」, 「が」 đánh dấu chủ ngữ của 「続いている」; 「続いている」 không thể đứng trước cụm danh từ này.`,
  toan_q_2014_12_53: `Câu hoàn chỉnh: 「私が今住んでいるアパートは線路の近くにある。住み始めたころは、電車の通る音がしてうるさいと思うこともあったが、すぐ気にならなくなった。」 Nghĩa là căn hộ tôi đang ở gần đường ray; lúc mới dọn đến, đôi khi tôi nghe tiếng tàu và thấy ồn, nhưng chẳng mấy chốc đã quen. Trật tự là 3→1→4→2; ô ★ là lựa chọn 4 「思う」. 「電車の通る音がして」 nêu âm thanh nghe được; 「うるさいと思う」 diễn tả cảm nhận, rồi 「こともあった」 nói rằng đôi khi đã có cảm giác ấy.`,
  toan_q_2014_12_50: `Câu hoàn chỉnh: 「必ず今日中に作らなくてはいけない会議の資料のことをすっかり忘れていた。」 Nghĩa là tôi đã quên bẵng việc phải làm xong tài liệu cuộc họp trong hôm nay. Trật tự là 3→4→2→1; ô ★ ở vị trí thứ ba nhận lựa chọn 2 「会議の資料の」. 「今日中に作らなくてはいけない」 bổ nghĩa cho 「会議の資料」; 「資料のことを忘れる」 là quên việc/tài liệu đó. Cách xếp này cũng khớp với đáp án và thứ tự trong bảng giải độc lập.`,
  toan_q_2014_07_53: `Câu hoàn chỉnh: 「ちょうど出かけるところで時間がないから、あとでゆっくり話す。私から電話するね。」 Nghĩa là mình vừa chuẩn bị ra ngoài nên không có thời gian; lát nữa mình sẽ nói chuyện từ từ và sẽ gọi cho bạn. Trật tự là 3→4→2→1; ô ★ là lựa chọn 2 「あとで」. 「出かけるところ」 là vừa đúng lúc sắp đi; 「時間がないから」 nêu lý do, còn 「あとで」 bổ nghĩa cho 「ゆっくり話す」.`,
  toan_q_2014_07_51: `Câu hoàn chỉnh: 「書いたまま出すのを忘れていた友人への手紙が引き出しにあった。」 Nghĩa là lá thư gửi bạn mà tôi viết rồi nhưng quên gửi vẫn nằm trong ngăn kéo. Trật tự là 1→3→2→4; ô ★ thứ ba nhận lựa chọn 2 「忘れていた」. 「Vたまま」 diễn tả trạng thái vẫn giữ nguyên sau khi làm việc gì; 「出すのを忘れていた」 là đã quên gửi lá thư.`,
  toan_q_2015_12_49: `Câu hoàn chỉnh: 「実家にある冷蔵庫は30年も使っている古いもので、いつ壊れてもおかしくないのに、親は『まだ買い替えない』と言っている。」 Nghĩa là chiếc tủ lạnh ở nhà bố mẹ đã dùng suốt 30 năm, cũ đến mức có thể hỏng bất cứ lúc nào, vậy mà bố mẹ vẫn nói chưa thay. Trật tự là 4→2→1→3; dấu ★ ở vị trí thứ hai nhận lựa chọn 2 「古いもので」. 「使っている古いもの」 mô tả chiếc tủ lạnh đã dùng lâu; 「いつ壊れてもおかしくない」 nghĩa là hỏng lúc nào cũng không lạ; 「のに」 nối ý tương phản.`,
  toan_q_2015_12_50: `Câu hoàn chỉnh: 「あと半年で終わる予定だった駅ビルの建設工事が遅れているそうだ。」 Nghĩa là nghe nói công trình xây tòa nhà ga, vốn dự kiến hoàn thành trong nửa năm nữa, đang bị chậm tiến độ. Trật tự là 3→4→2→1; ô ★ thứ ba nhận lựa chọn 2 「予定だった」. Cụm 「あと半年で終わる予定だった」 bổ nghĩa cho 「駅ビルの建設工事」.`,
  toan_q_2015_12_53: `Câu hoàn chỉnh: 「エアコンから冷たい空気が出た。部屋の下の方に行くのはどうしてかというと、冷たい空気は暖かい空気より重いからだ。」 Nghĩa là: “Vì sao khí lạnh từ máy điều hòa đi xuống phía dưới phòng? Vì khí lạnh nặng hơn khí ấm.” Trật tự là 1→2→4→3; dấu ★ ở vị trí thứ ba nhận lựa chọn 4 「部屋の下の方に行くのは」. Đã thêm dấu chấm sau 「出た」 để phân tách hai câu; nếu không, các mảnh nối thành câu khó hiểu.`,
  toan_q_2019_07_53: `Câu tự nhiên: 「田中「山下さんって、パソコンにすごく詳しいよね。」木村「うん、大学生のとき、コンピューター会社でアルバイトしていたみたいだよ。」」 Nghĩa là: “Ừ, hình như hồi còn là sinh viên, cậu ấy đã làm thêm ở công ty máy tính.” Trật tự là 1→4→2→3; ô ★ thứ ba nhận lựa chọn 2 「アルバイトしていた」. Bản PDF ghi đuôi 「のよ」 sau 「みたいだ」, tạo thành 「みたいだのよ」 không tự nhiên; phần hiển thị đã sửa thành 「よ」 để câu đúng ngữ pháp.`,
  toan_q_2019_12_50: `Câu hoàn chỉnh: 「桜大学は学生の働くことに対する考え方についてアンケート調査を行った。」 Nghĩa là Đại học Sakura đã khảo sát quan điểm của sinh viên về việc đi làm. Trật tự là 2→4→1→3; ô ★ thứ ba nhận lựa chọn 1 「に対する」. 「学生の働くこと」 là việc sinh viên đi làm; 「～に対する考え方」 nghĩa là quan điểm đối với điều gì.`,
  toan_q_2019_12_51: `Câu hoàn chỉnh: 「食事のときに買ったばかりの白いTシャツを汚してしまった。」 Nghĩa là tôi lỡ làm bẩn chiếc áo thun trắng vừa mới mua lúc ăn. Trật tự là 1→4→2→3; ô ★ thứ ba nhận lựa chọn 2 「ばかりの」. 「Vたばかり」 diễn tả việc vừa mới xảy ra; cụm này bổ nghĩa cho 「白いTシャツ」.`,
  toan_q_2022_07_50: `Câu hoàn chỉnh: 「田中さんが北森町に住んでいるから聞いてみたらどう？」 Nghĩa là: “Vì anh Tanaka sống ở Kitamori nên thử hỏi anh ấy xem sao?” Trật tự là 1→4→3→2; ô ★ thứ ba nhận lựa chọn 3 「から」. 「が」 đánh dấu chủ thể của 「住んでいる」, còn 「から」 nêu lý do cho lời gợi ý 「聞いてみたらどう」.`,
  toan_q_2021_07_51: `Câu hoàn chỉnh: 「送る写真を今選んでいるところだから、もう少し待って。」 Nghĩa là: “Mình đang chọn ảnh để gửi đây, đợi thêm một chút nhé.” Trật tự là 2→3→1→4; ô ★ thứ ba nhận lựa chọn 1 「選んでいる」. 「送る写真」 là những bức ảnh sẽ gửi; 「今～ているところ」 nhấn mạnh việc đang diễn ra ngay lúc nói.`,
  toan_q_2012_12_51: `Câu hoàn chỉnh: 「川名寺は桜がきれいなことで有名ですが、桜だけでなく秋の景色もすばらしいです。」 Nghĩa là chùa Kawana nổi tiếng vì hoa anh đào đẹp, nhưng không chỉ hoa anh đào mà cảnh mùa thu cũng tuyệt vời. Trật tự là 4→2→3→1; ô ★ thứ ba nhận lựa chọn 3 「有名ですが」. 「きれいなことで有名」 nghĩa là nổi tiếng vì đẹp; 「ですが」 nối ý tương phản; 「桜だけでなく」 mở cấu trúc “không chỉ hoa anh đào” và đi với 「秋の景色も」 ở vế sau. Lựa chọn 1, 2 và 4 cần lần lượt ở các vị trí còn lại để hoàn thành câu tự nhiên.`,
  toan_q_2012_07_53: `Câu hoàn chỉnh: 「友だちからのメールが来るまで、今日がレポートのしめ切り日だったということをすっかり忘れていた。」 Nghĩa là tôi đã quên bẵng hôm nay là hạn nộp báo cáo cho đến khi nhận được email của bạn. Trật tự là 2→4→3→1; ô ★ là lựa chọn 1 「すっかり忘れていた」. 「ということを」 danh từ hóa nội dung “hôm nay là hạn nộp”; 「すっかり」 bổ nghĩa cho 「忘れていた」, nghĩa là quên hoàn toàn.`,
  toan_q_2013_07_49: `Câu hoàn chỉnh: 「（病院で）村山「すみません。予約をした村山ですが。」受付「はい、村山さんですね。では、そちらのいすにおかけになってお待ちください。」」 Dịch: “Lễ tân: “Vâng, anh/chị Murayama. Xin mời ngồi vào chiếc ghế đằng kia và chờ một chút.”” Trật tự là 3→2→4→1; ô ★ ở vị trí thứ ba là lựa chọn 4 「になって」. 「いすに」 (3) phải theo sau 「そちらの」; 「おかけ」 (2) đi sau 「いすに」 để tạo cách nói kính trọng 「いすにおかけになる」; 「お待ち」 (1) đứng cuối trước 「ください」. Vì vậy chỉ 「になって」 hoàn tất cụm kính ngữ ở ô ★.`,
  toan_q_2013_07_50: `Câu hoàn chỉnh: 「料理をするのがそれほど得意ではない私でもハンバーグだけはおいしく作れる。」 Dịch: “Ngay cả tôi, vốn không quá giỏi nấu ăn, cũng làm riêng món hambāgu thật ngon.” Trật tự là 4→3→1→2; ô ★ ở vị trí thứ ba là lựa chọn 1 「私でも」. 「のが」 (4) mở cụm chủ đề “việc nấu ăn”; 「それほど得意ではない」 (3) bổ nghĩa cho 「私」 nên phải đứng trước nó; 「ハンバーグだけは」 (2) nêu món ăn làm được và đứng ngay trước 「おいしく作れる」. Đặt các mảnh ấy ở ô ★ sẽ phá vỡ các cụm này; 「私でも」 nối tự nhiên chủ thể với vế “cũng có thể làm ngon”.`,
  toan_q_2013_07_51: `Câu hoàn chỉnh: 「高木「山村さんは、いつもポケットにメモ帳を入れているんですか。」山村「はい。思いついたアイデアを忘れてしまわないように必ず持ち歩くようにしているんです。」」 Dịch: “Tôi luôn mang theo sổ ghi chú để khỏi quên những ý tưởng vừa nảy ra.” Trật tự là 4→1→2→3; ô ★ ở vị trí thứ ba là lựa chọn 2 「しまわないように」. 「アイデアを」 (4) là tân ngữ của 「忘れて」 (1); 「忘れてしまわないように」 diễn tả mục đích “để không lỡ quên”; 「必ず持ち歩くように」 (3) là hành động được duy trì. Ở trang gốc, chữ trong 「メモ帳を入れている」 là 「入」; lớp chữ PDF nhận nhầm thành 「人」.`,
  toan_q_2013_07_52: `Câu hoàn chỉnh: 「昨日の夜、誰もいない部屋から何か音が聞こえた気がした。」 Dịch: “Tối qua, tôi có cảm giác như nghe thấy tiếng động nào đó từ căn phòng không có ai.” Trật tự là 1→4→3→2; ô ★ ở vị trí thứ ba là lựa chọn 3 「何か音が」. 「誰も」 phải đi với phủ định 「いない」 (1); 「部屋から」 (4) chỉ nơi phát ra âm thanh; 「何か音が」 (3) là chủ ngữ của 「聞こえた」 (2), vị ngữ đứng sau. Ba mảnh còn lại đều có vai trò cố định ở các vị trí xung quanh ô ★.`,
  toan_q_2013_07_53: `Câu hoàn chỉnh: 「現在、市民運動公園の中に、大小二つの体育館を建設するという案が検討されている。」 Dịch: “Hiện đang xem xét phương án xây hai nhà thi đấu, một lớn và một nhỏ, trong công viên thể thao thành phố.” Trật tự là 3→1→2→4; ô ★ ở vị trí thứ ba là lựa chọn 2 「建設する」. 「二つの」 (3) bổ nghĩa cho danh từ 「体育館」 (1); 「体育館を建設する」 là cụm tân ngữ–động từ; 「という案が」 (4) biến nội dung ấy thành “phương án rằng…” và làm chủ ngữ của 「検討されている」.`,
}

const verifiedOrders = {
  toan_q_2025_12_51: {
    order: [2, 1, 4, 3],
    position: 2,
    sources: [
      'https://drive.google.com/file/d/1OtMcYHQ5ZBqJzsJY4jpUEyPX-HCJforX/view',
      'https://aixinjp.com/a/lianxifangshi/zhentidaan/2025/1208/1241.html',
    ],
  },
  toan_q_2014_07_51: {
    order: [1, 3, 2, 4],
    position: 2,
    answer: 2,
    sources: [
      'https://drive.google.com/file/d/1oRFJ0VVyVbfT4YmoJ03-bJWQsrYgJ05C/view',
      'https://www.reddit.com/r/LearnJapanese/comments/1gj15ep/',
    ],
  },
  toan_q_2015_12_49: {
    order: [4, 2, 1, 3],
    position: 1,
    answer: 2,
    sources: [
      'https://drive.google.com/file/d/1vWtX1zFJn129Jr2maGRTq5TcuKxu3PD4/view',
      'https://njlptcenter.wordpress.com/2015/12/10/%E0%B9%80%E0%B8%89%E0%B8%A5%E0%B8%A2%E0%B8%82%E0%B9%89%E0%B8%AD%E0%B8%AA%E0%B8%AD%E0%B8%9A-n3-gram2015/',
    ],
  },
  toan_q_2015_12_50: {
    order: [3, 4, 2, 1],
    position: 2,
    answer: 2,
    sources: [
      'https://drive.google.com/file/d/1vWtX1zFJn129Jr2maGRTq5TcuKxu3PD4/view',
      'https://njlptcenter.wordpress.com/2015/12/10/%E0%B9%80%E0%B8%89%E0%B8%A5%E0%B8%A2%E0%B8%82%E0%B9%89%E0%B8%AD%E0%B8%AA%E0%B8%AD%E0%B8%9A-n3-gram2015/',
    ],
  },
  toan_q_2023_12_51: {
    order: [4, 2, 3, 1],
    position: 2,
    sources: ['https://drive.google.com/file/d/1Yr4o92v_iySjcXZEdiKGKgcdvltqBqad/view'],
  },
  toan_q_2022_07_50: {
    order: [1, 4, 3, 2],
    position: 2,
    sources: [
      'https://drive.google.com/file/d/1_uKerTh0TUpMKN8gF_fsgwA5SkQs5ABu/view',
      'https://jpnihon.com/5112.html',
    ],
  },
  toan_q_2021_07_51: {
    order: [2, 3, 1, 4],
    position: 2,
    answer: 1,
    sources: [
      'https://drive.google.com/file/d/1X0FHPocIsW2BxwmhRuBjKr3Cr8CWu98V/view',
      'https://trynihongo.com/ja/dap-an-ky-thi-jlpt-n3-thang-072021-p450',
    ],
  },
  toan_q_2024_07_49: {
    order: [3, 2, 4, 1],
    position: 2,
    sources: [
      'https://drive.google.com/file/d/17J8BA7FDuQHsrqmwrXcfE3-EK2mDssfR/view',
      'https://vtimirai.edu.vn/upload/files/De%20thi%20N3/%C4%90%C3%A1p%20%C3%A1n%20N3%20T7-2024%20Ver%202_0.pdf',
    ],
  },
  toan_q_2023_07_49: {
    order: [3, 2, 4, 1],
    position: 1,
    answer: 2,
    sources: [
      'https://drive.google.com/file/d/1asWlZ9d0ZPZFByphJ-sgCTAtrWMhnCMz/view',
      'https://www.scribd.com/document/919730926/jlpt-n3-2023-07',
    ],
  },
  toan_q_2023_07_51: {
    order: [4, 2, 1, 3],
    position: 2,
    answer: 1,
    sources: [
      'https://drive.google.com/file/d/1asWlZ9d0ZPZFByphJ-sgCTAtrWMhnCMz/view',
      'https://www.scribd.com/document/919730926/jlpt-n3-2023-07',
    ],
  },
  toan_q_2025_07_53: {
    order: [3, 2, 4, 1],
    position: 2,
    sources: ['https://nnote.app/n3/1'],
  },
  toan_q_2011_07_53: {
    order: [1, 4, 3, 2],
    position: 2,
    sources: [
      'https://passjapanese.com/en/jlpt/n2/exam/official-sample-vol1-grammar-reading/q/16',
      'https://ns.jlpt.jp/samples/sample2012/pdf/N2G.pdf',
    ],
  },
  toan_q_2014_12_50: {
    order: [3, 4, 2, 1],
    position: 2,
    sources: [
      'https://www.studocu.com/in/document/chennai-institute-of-technology/japanese-n3-shinkanzen/jlpt-n3-2014%E5%B9%B412%E6%9C%88%E7%9C%9F%E9%A1%8C%E5%8F%8A%E7%AD%94%E6%A1%88%E8%A7%A3%E6%9E%90/159498580',
    ],
  },
  toan_q_2012_12_49: {
    order: [1, 3, 2, 4],
    position: 2,
    answer: 2,
    sources: ['https://drive.google.com/file/d/113QWsU7OKs23DMJtygRO3TU_Ht5VGdLl/view#page=6'],
  },
  toan_q_2012_12_50: {
    order: [2, 4, 3, 1],
    position: 2,
    answer: 3,
    sources: ['https://drive.google.com/file/d/113QWsU7OKs23DMJtygRO3TU_Ht5VGdLl/view#page=6'],
  },
  toan_q_2012_12_51: {
    order: [4, 2, 3, 1],
    position: 2,
    answer: 3,
    sources: ['https://drive.google.com/file/d/113QWsU7OKs23DMJtygRO3TU_Ht5VGdLl/view#page=6'],
  },
  toan_q_2012_12_52: {
    order: [3, 4, 1, 2],
    position: 2,
    answer: 1,
    sources: ['https://drive.google.com/file/d/113QWsU7OKs23DMJtygRO3TU_Ht5VGdLl/view#page=7'],
  },
  toan_q_2012_12_53: {
    order: [2, 1, 4, 3],
    position: 2,
    answer: 4,
    sources: ['https://drive.google.com/file/d/113QWsU7OKs23DMJtygRO3TU_Ht5VGdLl/view#page=7'],
  },
  toan_q_2013_12_49: {
    order: [2, 3, 1, 4],
    position: 2,
    answer: 1,
    sources: ['Google Drive: 4. N3 12-2013.pdf, printed page 6 (visual source check)'],
  },
  toan_q_2013_12_50: {
    order: [4, 2, 1, 3],
    position: 2,
    answer: 1,
    sources: ['Google Drive: 4. N3 12-2013.pdf, printed page 6 (visual source check)'],
  },
  toan_q_2013_12_51: {
    order: [1, 3, 2, 4],
    position: 2,
    answer: 2,
    sources: ['Google Drive: 4. N3 12-2013.pdf, printed page 6 (visual source check)'],
  },
  toan_q_2013_12_52: {
    order: [3, 1, 4, 2],
    position: 2,
    answer: 4,
    sources: ['Google Drive: 4. N3 12-2013.pdf, printed page 6 (visual source check)'],
  },
  toan_q_2013_12_53: {
    order: [4, 1, 3, 2],
    position: 2,
    answer: 3,
    sources: ['Google Drive: 4. N3 12-2013.pdf, printed page 6 (visual source check)'],
  },
  toan_q_2013_07_49: {
    order: [3, 2, 4, 1],
    position: 2,
    answer: 4,
    sources: [
      'Google Drive: 4. N3 7-2013.pdf, printed page 6 (visual source check)',
      'Google Drive: ĐÁP ÁN JLPT N3 (update 26.6.2026).pdf, page 7 (answer-key cross-check)',
    ],
  },
  toan_q_2013_07_50: {
    order: [4, 3, 1, 2],
    position: 2,
    answer: 1,
    sources: [
      'Google Drive: 4. N3 7-2013.pdf, printed page 6 (visual source check)',
      'Google Drive: ĐÁP ÁN JLPT N3 (update 26.6.2026).pdf, page 7 (answer-key cross-check)',
    ],
  },
  toan_q_2013_07_51: {
    order: [4, 1, 2, 3],
    position: 2,
    answer: 2,
    sources: [
      'Google Drive: 4. N3 7-2013.pdf, printed page 6 (visual source check)',
      'Google Drive: ĐÁP ÁN JLPT N3 (update 26.6.2026).pdf, page 7 (answer-key cross-check)',
    ],
  },
  toan_q_2013_07_52: {
    order: [1, 4, 3, 2],
    position: 2,
    answer: 3,
    sources: [
      'Google Drive: 4. N3 7-2013.pdf, printed page 6 (visual source check)',
      'Google Drive: ĐÁP ÁN JLPT N3 (update 26.6.2026).pdf, page 7 (answer-key cross-check)',
    ],
  },
  toan_q_2013_07_53: {
    order: [3, 1, 2, 4],
    position: 2,
    answer: 2,
    sources: [
      'Google Drive: 4. N3 7-2013.pdf, printed page 6 (visual source check)',
      'Google Drive: ĐÁP ÁN JLPT N3 (update 26.6.2026).pdf, page 7 (answer-key cross-check)',
    ],
  },
}

for (const [questionId, explanation] of Object.entries(updates)) {
  const question = exams
    .flatMap((exam) => exam.parts.flatMap((part) => part.questions))
    .find((item) => item.id === questionId)
  if (!question) throw new Error(`Unknown N3 question: ${questionId}`)
  if (questionId === 'toan_q_2025_12_51') {
    question.options = ['1 上手に', '2 弾くほど', '3 なっていくのが', '4 弾けるように']
  }
  if (questionId === 'toan_q_2023_12_51') {
    question.options[1] = '2 ところがあるので'
  }
  if (questionId === 'toan_q_2024_07_49') {
    question.options[2] = '3 の'
    question.correctAnswer = 4
    question.answer = 4
  }
  if (questionId === 'toan_q_2014_07_51') {
    question.correctAnswer = 2
    question.answer = 2
  }
  if (questionId === 'toan_q_2015_12_49' || questionId === 'toan_q_2015_12_50') {
    question.correctAnswer = 2
    question.answer = 2
  }
  if (questionId === 'toan_q_2023_07_49') {
    question.correctAnswer = 2
    question.answer = 2
  }
  if (questionId === 'toan_q_2023_07_51') {
    question.correctAnswer = 1
    question.answer = 1
  }
  if (questionId === 'toan_q_2019_12_51') {
    question.options[2] = '3 白いTシャツ'
  }
  if (questionId === 'toan_q_2024_12_53') {
    question.options[2] = '3.だけではなく '
  }
  const label = Number(explanation.match(/★[^.]*?lựa chọn\s+(\d)/i)?.[1])
  const verifiedAnswer = Number.isInteger(verifiedOrders[questionId]?.answer)
    ? verifiedOrders[questionId].answer
    : Number(question.correctAnswer ?? question.answer)
  if (label !== verifiedAnswer)
    throw new Error(`${questionId}: explanation says answer ${label}, question key is ${verifiedAnswer}`)
  question.correctAnswer = verifiedAnswer
  question.answer = verifiedAnswer
  curated[questionId] = explanation
  if (question.explanation) question.explanation = explanation
}

for (const [questionId, verification] of Object.entries(verifiedOrders)) {
  const question = exams
    .flatMap((exam) => exam.parts.flatMap((part) => part.questions))
    .find((item) => item.id === questionId)
  if (!question) throw new Error(`Unknown N3 star question: ${questionId}`)
  if (verification.order.length !== 4 || new Set(verification.order).size !== 4) {
    throw new Error(`${questionId}: the source order must be a permutation of four pieces`)
  }
  if (
    !Number.isInteger(verification.position) ||
    verification.position < 0 ||
    verification.position >= verification.order.length
  ) {
    throw new Error(`${questionId}: invalid star position`)
  }
  const verifiedAnswer = Number.isInteger(verification.answer)
    ? verification.answer
    : Number(question.correctAnswer ?? question.answer)
  if (verifiedAnswer !== verification.order[verification.position]) {
    throw new Error(`${questionId}: verified order does not put the answer-key piece in the ★ slot`)
  }
  question.starCorrectOrder = verification.order
  question.starPosition = verification.position
  question.correctAnswer = verifiedAnswer
  question.answer = verifiedAnswer
  question.starPositionVerified = true
  question.starOrderVerified = true
  question.starVerificationSources = verification.sources
  if (questionId === 'toan_q_2011_07_53') {
    question.options[2] = String(question.options[2]).replace(/^\s*4(?=[.．、\s])/u, '3')
  }
}

const reconstructedOrders = {
  toan_q_2019_12_50: [2, 4, 1, 3],
}
for (const [questionId, order] of Object.entries(reconstructedOrders)) {
  const question = exams
    .flatMap((exam) => exam.parts.flatMap((part) => part.questions))
    .find((item) => item.id === questionId)
  if (!question) throw new Error(`Unknown N3 reconstructed star order: ${questionId}`)
  if (order.length !== 4 || new Set(order).size !== 4)
    throw new Error(`${questionId}: expected a four-piece permutation`)
  question.starCorrectOrder = order
}

const promptCorrections = {
  toan_q_2018_12_49: {
    after: 'した。',
  },
  toan_q_2018_12_53: {
    options: ['1.まで', '2.あった', '3.あそこに', '4.白い段ボール箱に'],
    after: '入ってたんですけど、気づいたら箱がなくなって。」林「ああ、山下さんがどこかに持っていきましたよ。」',
  },
  toan_q_2017_12_49: {
    before: '課長「山田さん、資料の整理をやってもらえますか。来週の金曜',
  },
  toan_q_2016_12_52: {
    before: '(レストランで)「すみません。15分ぐらい前に案内をお願いして、しばらくここで待てって',
    after: '。まだですか。」店員「大変申し訳ありません。」',
  },
  toan_q_2021_12_53: {
    before: '患者「先生、おふろには入ってもいいんでしょうか。」医者「',
    after: 'いいですよ」',
  },
  toan_q_2024_12_53: {
    after: 'いい。」',
  },
  toan_q_2011_07_52: {
    after: 'してほしいです。」',
  },
  toan_q_2022_07_48: {
    after: 'いないと思う。',
  },
  toan_q_2021_07_49: {
    after: 'と思う人はいますか。」',
  },
  toan_q_2020_12_53: {
    before: 'うちから学校まで自転車で40分かかる。電車なら20分だが、朝の',
  },
  toan_q_2022_12_52: {
    before: 'A「お誕生日おめでとう。これ、プレゼントだよ。」B「わあ、かばんだ。ちょうど',
  },
  toan_q_2015_07_52: {
    before: '一人暮らしを始めて 3 か月が過ぎたが、家に',
  },
  toan_q_2014_07_53: {
    after: '。私から電話するね。」',
  },
  toan_q_2023_12_53: {
    after: 'そうだ。',
  },
  toan_q_2015_12_53: {
    options: ['1.冷たい空気が', '2.出た。', '3.どうして', '4.部屋の下の方に行くのは'],
  },
  toan_q_2019_07_53: {
    after: 'よ。',
  },
  toan_q_2016_07_50: {
    after: '、私はちょっと苦手だ。',
  },
  toan_q_2021_12_50: {
    after: 'だった。',
  },
  toan_q_2010_07_49: {
    before:
      'Ａ「じゃあ、あしたはコンサート会場の入り口に5時に集まりませんか。」Ｂ「コンサートは7時からですから、そんなに',
  },
  toan_q_2012_12_49: {
    before: 'A「片づけはあしたにしますか。」B「あしたは朝から',
  },
  toan_q_2013_07_51: {
    before: '高木「山村さんは、いつもポケットにメモ帳を入れているんですか。」山村「はい。思いついた',
  },
}
for (const [questionId, correction] of Object.entries(promptCorrections)) {
  const question = exams
    .flatMap((exam) => exam.parts.flatMap((part) => part.questions))
    .find((item) => item.id === questionId)
  if (!question) throw new Error(`Unknown N3 prompt correction: ${questionId}`)
  const { options, ...prompt } = correction
  if (options) question.options = options
  question.starPrompt = { ...question.starPrompt, ...prompt }
}

fs.writeFileSync(curatedPath, `${JSON.stringify(curated, null, 2)}\n`, 'utf8')
fs.writeFileSync(masterPath, `${JSON.stringify(exams, null, 2)}\n`, 'utf8')
console.log(
  `Updated ${Object.keys(updates).length} star-question explanations and applied ${Object.keys(verifiedOrders).length} source-verified orders.`
)
