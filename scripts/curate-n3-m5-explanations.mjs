import fs from 'node:fs'

const masterPath = 'data/jlpt_n3_toan_master.json'
const curatedPath = 'data/jlpt_n3_explanations_curated.json'
const exams = JSON.parse(fs.readFileSync(masterPath, 'utf8'))
const curated = JSON.parse(fs.readFileSync(curatedPath, 'utf8'))

// Hand-written contextual explanations. Each item translates the four example
// sentences and explains why only the keyed usage fits the target word.
const updates = {
  toan_q_2024_07_31: `Đáp án 4 — 知識（ちしき）là kiến thức/tri thức về một lĩnh vực. 「医学の知識がないとできない」 nghĩa là “Không có kiến thức y học thì không thể làm công việc đó”.
1. 「いつ財布を落としたか知識がありません」: “Tôi không có kiến thức về lúc nào đánh rơi ví”. Muốn nói không nhớ/không biết thời điểm, dùng 覚えていません・分かりません.
2. 「はさみがどこにあるか知識がありますか」: “Bạn có kiến thức về việc kéo ở đâu không?”. Hỏi người kia có biết vị trí không, dùng 分かりますか・ご存じですか.
3. Nguồn PDF in 「私の知識がない人」. Câu này không tự nhiên nếu định nói “những người tôi không quen”; khi đó dùng 私の知らない人・知り合いではない人. 知識 là kiến thức, không phải người quen.
4. Công việc đòi hỏi kiến thức y học: 医学の知識 là kết hợp đúng.
Ghi nhớ: 知識 = kiến thức; 知っている・知らない = biết/không biết một người hoặc sự việc.`,
  toan_q_2024_07_32: `Đáp án 3 — 響く（ひびく）là âm thanh vang hoặc dội lại trong một không gian. 「この広場で歌を歌うと声がよくひびく」 nghĩa là “Khi hát ở quảng trường này, giọng vang rất rõ”.
1. 「おいしそうなにおいがひびいている」: “Mùi thơm ngon đang vang lên”. Mùi thơm lan ra từ bếp là においが漂ってくる・してくる.
2. 「技術は外国からひびいた」: “Công nghệ vang đến từ nước ngoài”. Công nghệ được truyền từ nước khác là 外国から伝わった.
3. Giọng hát vang rõ trong quảng trường: 声が響く dùng đúng với âm thanh.
4. 「うわさが会社中でひびいている」: “Tin đồn vang khắp công ty”. Tin đồn lan truyền là うわさが広まっている.
Ghi nhớ: âm thanh vang là 響く; mùi lan là 漂う; thông tin truyền tới là 伝わる; tin đồn lan rộng là 広まる.`,
  toan_q_2024_07_33: `Đáp án 4 — 完成（かんせい）là hoàn tất một sản phẩm/công trình đã làm. 「今建てている家が完成したら」 nghĩa là “Khi ngôi nhà đang xây được hoàn thành”, dùng đúng.
1. 「みんなの意見が一つに完成した」: “Ý kiến mọi người được hoàn thành thành một”. Khi ý kiến thống nhất, dùng 一つにまとまった・一致した.
2. 「夢が完成して医者になった」: “Ước mơ được hoàn thành và trở thành bác sĩ”. Ước mơ thành hiện thực là 夢がかなった・実現した.
3. 「親戚の結婚が完成した」: “Cuộc hôn nhân của họ hàng được hoàn thành”. Nói họ hàng kết hôn là 親戚が結婚した; 完成 thường dùng cho vật/công trình.
4. Ngôi nhà xây xong thì mời bạn đến chơi: 家が完成する dùng đúng.
Ghi nhớ: công trình/sản phẩm hoàn tất là 完成する; ý kiến hội tụ là まとまる; ước mơ thành hiện thực là かなう.`,
  toan_q_2024_07_34: `Đáp án 2 — あわてる là cuống lên, vội vàng vì bất ngờ hoặc không kịp chuẩn bị. 「寝坊をして、あわてて家を出たので、携帯電話を忘れてきてしまった」 nghĩa là “Vì ngủ quên nên tôi cuống cuồng ra khỏi nhà và bỏ quên điện thoại”.
1. 「川の水があわてて流れている」: “Nước sông đang cuống cuồng chảy”. Nước chảy mạnh nói 水が勢いよく流れている; あわてる chỉ người/con vật có phản ứng cuống.
2. Ngủ quên, vội rời nhà nên quên điện thoại: あわてて家を出る dùng đúng.
3. 「ゴールまであわてて走り続けた」: “Cuống cuồng chạy đến đích để thắng”. Thi đấu để thắng thì chạy 全力で走る; あわてる không có nghĩa là chạy nhanh có chủ đích.
4. 「お店の人はいつもあわてて働いている」: “Nhân viên lúc nào cũng hoảng hốt làm việc”. Nhà hàng đông thì nói 忙しく働いている; câu này không nêu tình huống bất ngờ khiến họ cuống lên.
Ghi nhớ: cuống vì bất ngờ là あわてる; chạy hết sức là 全力で; làm việc bận rộn là 忙しく.`,
  toan_q_2024_07_35: `Đáp án 1 — 実物（じつぶつ）là vật thật ngoài đời, đối lập với ảnh, hình minh họa hoặc bản sao. 「実物を見てから買いたい」 nghĩa là “Tôi muốn xem món đồ thật rồi mới mua”, dùng đúng.
1. Quần áo muốn xem tận mắt thay vì chỉ nhìn ảnh trên mạng: 実物 là món đồ thật.
2. 「彼女の実物の気持ち」: “Cảm xúc vật thật của cô ấy”. Cảm xúc thật là 本当の気持ち・本心.
3. 「実物が足りなかったので、クレジットカードで払った」: “Vì vật thật không đủ nên trả bằng thẻ tín dụng”. Nếu thiếu tiền mặt, nói 現金が足りなかった.
4. PDF in 「実物はもっと上手にできます」. 「実物」 là vật thật nên không thể nói “vật thật làm giỏi hơn”; nếu nói về bài thuyết trình, 本番はもっと上手にできた sẽ hợp nghĩa.
Ghi nhớ: 実物 là đồ vật thật; 本心・本当の気持ち là cảm xúc thật; 現金 là tiền mặt; 本番 là lúc biểu diễn/thi thật.`,
  toan_q_2023_07_31: `Đáp án 2 — 進歩（しんぽ）là sự tiến bộ nhờ cải thiện về năng lực, công nghệ hoặc phương pháp. 「技術が進歩して、人々の生活は便利になった」 nghĩa là “Công nghệ tiến bộ nên đời sống mọi người trở nên tiện lợi hơn”.
1. 「大きな会社に進歩した」: “Tiến bộ thành một công ty lớn”. Công ty phát triển/mở rộng là 大きな会社に成長した・発展した.
2. Công nghệ tiến bộ làm đời sống thuận tiện hơn: 技術が進歩する dùng đúng.
3. 「食欲もだんだん進歩してきた」: “Sự thèm ăn cũng tiến bộ dần”. Khẩu vị/ăn ngon trở lại nói 食欲が戻ってきた・回復してきた.
4. 「家賃が進歩して高くなる」: “Tiền thuê tiến bộ và tăng”. Giá thuê tăng là 家賃が上がる.
Ghi nhớ: tiến bộ là 進歩; quy mô công ty phát triển là 発展・成長; sức khỏe/khẩu vị hồi phục là 回復; giá tăng là 上がる.`,
  toan_q_2023_07_32: `Đáp án 1 — 話しかける（はなしかける）là chủ động bắt chuyện với một người. 「駅で観光客に英語で話しかけられた」 nghĩa là “Ở ga, một du khách bắt chuyện với tôi bằng tiếng Anh”; dạng bị động られた cho biết người nói được người khác bắt chuyện.
1. Du khách bắt chuyện bằng tiếng Anh ở ga: 話しかける dùng đúng với việc mở lời với người.
2. 「家族と話しかけて決める」: “Bắt chuyện với gia đình rồi quyết định”. Cùng nhau thảo luận là 家族と話し合って決める.
3. 「名前を話しかける」: “Bắt chuyện tên”. Đọc/gọi tên là 名前を呼ぶ・読み上げる.
4. 「お礼を話しかけられました」: “Được bắt chuyện lời cảm ơn”. Nói lời cảm ơn với ai là お礼を言う; được cảm ơn là お礼を言われる.
Ghi nhớ: bắt chuyện với người là 話しかける; trao đổi qua lại là 話し合う; gọi tên là 呼ぶ; nói lời cảm ơn là お礼を言う.`,
  toan_q_2023_07_33: `Đáp án 3 — 交流（こうりゅう）là giao lưu, trao đổi qua lại giữa người, tổ chức hoặc quốc gia. 「海外の人たちと交流する機会が多い」 nghĩa là “Trường của con trai tôi có nhiều cơ hội giao lưu với người nước ngoài”.
1. 「二つの色が交流して」: “Hai màu giao lưu với nhau”. Hai màu hòa/trộn thành hồng là 色が混ざり合って.
2. 「野菜と交流するとおいしい」: “Giao lưu với rau thì ngon”. Nước xốt hợp với rau nói 野菜によく合う.
3. Trường có nhiều cơ hội giao lưu với người nước ngoài: 海外の人たちと交流する dùng đúng.
4. 「兄の物と私の物が交流している」: “Đồ của anh và tôi đang giao lưu”. Đồ vật bị lẫn vào nhau là 混ざっている.
Ghi nhớ: 交流する dùng cho giao tiếp/trao đổi giữa người hoặc nhóm; vật trộn lẫn là 混ざる; món ăn hợp nhau là 合う.`,
  toan_q_2023_07_34: `Đáp án 2 — 渋滞（じゅうたい）là tình trạng xe cộ ùn ứ, di chuyển chậm hoặc đứng lại. 「事故で道が渋滞していたので、遅刻してしまった」 nghĩa là “Vì đường ùn tắc do tai nạn nên tôi đã đến muộn”.
1. 「家の工事が渋滞していて」: “Công trình nhà bị ùn tắc”. Công việc xây dựng bị chậm là 工事が遅れている・進んでいない.
2. Đường ùn tắc do tai nạn khiến người nói đến muộn: 道が渋滞する dùng đúng.
3. 「ストレスが渋滞している」: “Căng thẳng bị ùn tắc”. Căng thẳng tích tụ là ストレスがたまっている.
4. 「商品が倉庫の中で渋滞している」: “Hàng hóa bị ùn tắc trong kho”. Hàng bán chậm còn tồn là 商品が売れ残っている.
Ghi nhớ: xe ùn tắc là 渋滞する; tiến độ chậm là 遅れる; căng thẳng tích tụ là たまる; hàng tồn là 売れ残る.`,
  toan_q_2023_07_35: `Đáp án 4 — にこにこ là trạng thái mỉm cười vui vẻ, thường dùng cho nét mặt hoặc người đang cười. 「祖母はうれしそうににこにこしていた」 nghĩa là “Bà mỉm cười vui vẻ khi nhìn chúng tôi chơi”.
1. 「車が…にこにこした」: “Chiếc xe mỉm cười”. Khi xăng sắp hết, xe có thể 止まりそうになる・エンジンが止まりそうになる; にこにこ chỉ nụ cười.
2. 「胸がにこにこした」: “Ngực mỉm cười”. Hồi hộp trước đám đông thì 胸がどきどきした.
3. 「頭がにこにこしている」: “Đầu đang mỉm cười”. Đầu đau âm ỉ là 頭がずきずきする・痛む.
4. Bà nhìn các cháu chơi và cười vui vẻ: にこにこする dùng đúng.
Ghi nhớ: cười vui vẻ là にこにこ; tim đập hồi hộp là どきどき; đau nhói là ずきずき.`,
  toan_q_2022_07_30: `Đáp án 2 — 諦める（あきらめる）là từ bỏ một kế hoạch/mong muốn vì thấy không thể tiếp tục hoặc đạt được. 「台風が来そうなので、あしたの登山を諦めることにした」 nghĩa là “Vì có vẻ bão sắp tới nên tôi quyết định bỏ chuyến leo núi ngày mai”.
1. 「傘を諦めてよさそう」: “Có vẻ có thể từ bỏ chiếc ô”. Trời đẹp nên không cần mang ô là 傘を持たなくてよさそう.
2. Dự báo bão nên hủy kế hoạch leo núi: 登山を諦める dùng đúng.
3. 「鍵をかけるのを諦めた」: “Từ bỏ việc khóa cửa”. Nếu quên khóa cửa, nói 鍵をかけ忘れた.
4. 「泣くのを諦められなかった」: “Không thể từ bỏ việc khóc”. Không ngừng khóc là 泣くのをやめられなかった・泣かずにはいられなかった.
Ghi nhớ: từ bỏ kế hoạch là 諦める; quên làm là 忘れる; dừng hành động là やめる.`,
  toan_q_2022_07_31: `Đáp án 3 — 参加（さんか）する là tham gia một sự kiện hoặc hoạt động tập thể. 「息子と一緒にパーティーに参加する」 nghĩa là “Tôi định cùng con trai tham gia bữa tiệc”.
1. 「赤ちゃんが家族に参加した」: “Em bé tham gia vào gia đình”. Nói gia đình có thêm em bé dùng 家族が増えた・家族に加わった.
2. 「事故に参加して」: “Tham gia vào tai nạn”. Bị tai nạn là 事故に遭った.
3. Tham dự bữa tiệc cùng con trai: パーティーに参加する dùng đúng.
4. 「貿易会社に参加している」: “Đang tham gia công ty thương mại”. Làm việc cho công ty là 貿易会社に勤めている・入社している.
Ghi nhớ: tham gia sự kiện là 参加する; gia nhập công ty là 入社する・勤める; gặp tai nạn là 事故に遭う.`,
  toan_q_2022_07_32: `Đáp án 4 — 盛ん（さかん）diễn tả một hoạt động diễn ra sôi nổi/nhiều hoặc một lĩnh vực phát triển mạnh. 「外国人との交流が盛んだ」 nghĩa là “Hoạt động giao lưu với người nước ngoài rất sôi nổi”.
1. 「練習時間が盛んだった」: “Thời gian luyện tập rất sôi nổi”. Nói thời lượng dài dùng 練習時間が長かった; nói buổi luyện sôi nổi có thể dùng 練習が盛んだった.
2. 「荷物が盛んなので」: “Hành lý rất sôi nổi”. Hành lý nhiều là 荷物が多い.
3. 「魚も野菜も盛んでおいしい」: “Cá và rau đều sôi nổi và ngon”. Khen món ăn ngon/tươi dùng おいしい・新鮮だ.
4. Giao lưu với người nước ngoài phát triển mạnh ở thị trấn: 交流が盛ん là kết hợp đúng.
Ghi nhớ: hoạt động sôi nổi/phát triển mạnh là 盛ん; số lượng nhiều là 多い; thời lượng dài là 長い.`,
  toan_q_2022_07_33: `Đáp án 1 — 整理（せいり）する là sắp xếp đồ vật/tài liệu gọn gàng và phân loại. 「机の引き出しを整理して、いらない物を捨てました」 nghĩa là “Tôi sắp xếp ngăn kéo bàn rồi vứt những món không cần”.
1. Sắp xếp ngăn kéo và bỏ đồ không cần: 整理する dùng đúng.
2. 「廊下をぞうきんで整理した」: “Sắp xếp hành lang bằng giẻ lau”. Lau chỗ bẩn là ぞうきんで拭いた・掃除した.
3. 「空気を整理した」: “Sắp xếp không khí”. Mở cửa sổ để thay không khí là 換気した.
4. 「歯を整理している」: “Sắp xếp răng”. Làm sạch răng sau khi ăn là 歯を磨く.
Ghi nhớ: đồ/vật liệu được sắp xếp là 整理する; lau dọn là 掃除する; thay không khí là 換気する; đánh răng là 歯を磨く.`,
  toan_q_2022_07_34: `Đáp án 1 — 通り過ぎる（とおりすぎる）là đi qua và vượt khỏi một địa điểm trên đường. 「店の前を自転車で通り過ぎた」 nghĩa là “Tôi nghĩ người đạp xe vừa đi qua trước cửa tiệm là anh Kimura”.
1. Đạp xe đi qua phía trước cửa tiệm: 店の前を通り過ぎる dùng đúng cho chuyển động vượt qua một địa điểm.
2. 「待ち合わせの時間を通り過ぎた」: “Đi qua giờ hẹn”. Thời gian hẹn đã qua nói 待ち合わせの時間を過ぎた; không dùng 通り過ぎる cho mốc thời gian.
3. 「ご飯の量を通り過ぎて」: “Đi qua lượng cơm”. Ăn quá nhiều nói ご飯を食べ過ぎて・量を超えて.
4. 「締め切りを通り過ぎないように」: “Đừng đi qua hạn chót”. Nói nộp đúng hạn là 締め切りを過ぎないように・遅れないようにする.
Ghi nhớ: 通り過ぎる đi qua một nơi; thời hạn đã qua là 過ぎる; ăn quá nhiều là 食べ過ぎる.`,
  toan_q_2021_12_31: `Đáp án 1 — 集合（しゅうごう）する là tập hợp/tụ họp tại một địa điểm đã hẹn. 「あしたは駅前に７時に集合してください」 nghĩa là “Ngày mai hãy tập trung trước ga lúc 7 giờ”.
1. Hẹn mọi người tập trung ở trước ga lúc 7 giờ: 集合する dùng đúng cho một nhóm người.
2. 「雨が集合してふった」: “Mưa tập hợp rồi rơi”. Mưa rơi nhiều trong thời gian ngắn là 短時間に雨が強く降った.
3. 「ワインが集合している」: “Rượu vang đang tụ họp trong cửa hàng”. Nói cửa hàng có nhiều loại rượu là ワインがそろっている.
4. 「切手を集合する」: “Tập hợp tem làm sở thích”. Sưu tập đồ vật là 切手を集める.
Ghi nhớ: người tụ họp là 集合する; hàng hóa được bày đủ loại là そろう; sưu tập vật là 集める.`,
  toan_q_2021_12_32: `Đáp án 3 — 中古（ちゅうこ）là đồ đã qua sử dụng, thường dùng với xe, máy ảnh, sách hoặc thiết bị. 「中古のカメラが安く買えます」 nghĩa là “Nếu đến cửa hàng đó thì có thể mua máy ảnh cũ với giá rẻ”.
1. 「中古の卵」: “Trứng đã qua sử dụng”. Trứng không phải hàng dùng rồi; nếu muốn nói trứng cũ thì dùng 古い卵.
2. 「中古の友達」: “Người bạn đã qua sử dụng”. Bạn quen từ nhỏ là 昔からの友達・幼なじみ.
3. Máy ảnh đã qua sử dụng bán rẻ: 中古のカメラ là kết hợp đúng.
4. 「中古の店員」: “Nhân viên đã qua sử dụng”. Nhân viên nhiều kinh nghiệm là ベテランの店員.
Ghi nhớ: 中古 dùng cho sản phẩm đã qua sử dụng; 古い nói đồ vật cũ; ベテラン là người nhiều kinh nghiệm.`,
  toan_q_2021_12_33: `Đáp án 1 — 追い抜く（おいぬく）là vượt lên trước một người/vật đang đi cùng hướng. 「マラソンで前の人を追い抜くとき」 nghĩa là “Khi vượt người chạy phía trước trong cuộc đua marathon”, cách dùng đúng.
1. Vượt người đang chạy trước trong cuộc đua: 前の人を追い抜く diễn tả vượt lên phía trước.
2. 「山を追い抜いたら」: “Nếu vượt qua ngọn núi”. Đi qua núi dùng 山を越える・通り過ぎる.
3. 「二十歳を追い抜く」: “Vượt qua tuổi 20”. Nói quá tuổi 20 dùng 二十歳を過ぎる.
4. 「12時を追い抜いた」: “Vượt qua 12 giờ”. Khi đã qua mốc giờ, dùng 12時を過ぎた.
Ghi nhớ: 追い抜く vượt lên trước người/vật đang di chuyển; 越える vượt núi/rào cản; 過ぎる nói thời gian hoặc tuổi đã qua.`,
  toan_q_2021_12_34: `Đáp án 3 — 見本（みほん）là mẫu để xem và làm theo, chẳng hạn mẫu đơn hoặc sản phẩm trưng bày. 「申込書の書き方の見本」 nghĩa là “Mẫu cách điền đơn đăng ký”, đúng với ngữ cảnh tham khảo.
1. 「学校の見本で出る」: “Xuất hiện với tư cách mẫu của trường”. Người đại diện trường dự thi là 学校の代表として出る.
2. 「日本人の見本の身長」: “Chiều cao mẫu của người Nhật”. Chiều cao trung bình là 日本人の平均身長.
3. Có mẫu hướng dẫn cách điền đơn để tham khảo: 書き方の見本 dùng đúng.
4. 「見本から教えてもらえる」: “Được dạy từ một mẫu”. Người mới bắt đầu được dạy từ kiến thức căn bản là 基本から教えてもらえる.
Ghi nhớ: 見本 là mẫu tham khảo; 代表 là người đại diện; 平均 là mức trung bình; 基本 là nền tảng.`,
  toan_q_2021_12_35: `Đáp án 4 — だるい diễn tả cơ thể mệt mỏi, nặng nề, thiếu sức lực. 「体がだるくて起きられない」 nghĩa là “Người mệt rã rời nên tôi không thể dậy”.
1. 「スープは味がだるい」: “Súp có vị uể oải”. Vị nhạt là 味が薄い; vị không ngon là おいしくない.
2. 「スカートがだるくなった」: “Váy trở nên mệt mỏi”. Váy bị rộng sau khi giảm cân là スカートがゆるくなった・大きくなった.
3. 「少しだるくしたい」: “Muốn làm cho mình mệt một chút”. Muốn nghỉ ngơi sau khi xong báo cáo là 少し休みたい・休憩したい.
4. Cơ thể mệt nặng đến mức không thể dậy: 体がだるい dùng đúng.
Ghi nhớ: cơ thể uể oải là だるい; vị nhạt là 薄い; quần áo rộng là ゆるい; nghỉ ngơi là 休む.`,
  toan_q_2020_12_31: `Đáp án 2 — 割引（わりびき）là giảm giá/chiết khấu so với giá niêm yết. 「団体で見学を申し込むと料金が割引になる」 nghĩa là “Nếu đăng ký tham quan theo đoàn thì phí vào cửa được giảm”.
1. 「人口が割引になっている」: “Dân số được giảm giá”. Dân số giảm là 人口が減少している.
2. Đăng ký theo đoàn được giảm phí tham quan: 料金が割引になる là cách dùng đúng.
3. 「体重が割引になってきた」: “Cân nặng được giảm giá”. Cân nặng giảm là 体重が減ってきた.
4. 「寝る時間が割引になっている」: “Thời gian ngủ được giảm giá”. Thời gian ngủ ít đi là 寝る時間が減っている.
Ghi nhớ: giá được chiết khấu là 割引; dân số/cân nặng/thời lượng giảm là 減少する・減る.`,
  toan_q_2020_12_32: `Đáp án 3 — 気づく（きづく）là nhận ra/phát hiện ra một sự việc hoặc điều mình chưa nhận biết. 「電車に忘れ物をしたことに気づいた」 nghĩa là “Khi về đến nhà, tôi nhận ra mình đã để quên đồ trên tàu”.
1. 「ふるさとの景色に気づいて」: “Nhận ra phong cảnh quê nhà”. Câu muốn nói bức tranh gợi nhớ quê hương, nên tự nhiên hơn là ふるさとの景色を思い出して.
2. 「声に気づいて眠れなかった」: “Nhận ra tiếng nói nên không ngủ được”. Bị tiếng ồn làm phiền là 声が気になって・声が聞こえて眠れなかった.
3. Đến nhà mới nhận ra mình để quên đồ trên tàu: 忘れ物をしたことに気づく dùng đúng.
4. 「大学生活に気づくと楽しみだ」: “Khi nhận ra cuộc sống đại học thì thấy vui”. Nghĩ đến cuộc sống sắp bắt đầu mà thấy mong chờ là 大学生活が始まると思うと楽しみだ.
Ghi nhớ: một sự việc chợt nhận ra là 気づく; nhớ lại cảnh cũ là 思い出す; thấy khó chịu vì tiếng động là 気になる.`,
  toan_q_2020_12_33: `Đáp án 1 — 栄養（えいよう）là chất dinh dưỡng hoặc giá trị dinh dưỡng của thức ăn. 「栄養が足りないと風邪をひきやすくなる」 nghĩa là “Nếu thiếu dinh dưỡng thì dễ bị cảm, vì vậy tôi chú ý đến bữa ăn”.
1. Thiếu chất dinh dưỡng dễ khiến cơ thể bị cảm: 栄養が足りない dùng đúng.
2. 「会社の栄養が増えている」: “Dinh dưỡng của công ty đang tăng”. Công ty tăng trưởng là 会社が成長している; doanh thu tăng là 売上が増えている.
3. 「飛行機は多くの栄養がかかる」: “Máy bay tốn nhiều dinh dưỡng”. Chi phí cao là 多くの費用がかかる.
4. 「講義は難しいけど、栄養が多い」: “Bài giảng khó nhưng có nhiều dinh dưỡng”. Bài giảng hữu ích/bổ ích là ためになる・勉強になる.
Ghi nhớ: 栄養 thuộc về thức ăn/cơ thể; doanh nghiệp 成長する; chi phí 費用がかかる; kiến thức bổ ích ためになる.`,
  toan_q_2020_12_34: `Đáp án 2 — ふらふら diễn tả cơ thể loạng choạng/chóng mặt, khó đứng vững. 「熱があるから、立って歩くと少し体がふらふらする」 nghĩa là “Vì bị sốt nên khi đứng dậy đi, người tôi hơi loạng choạng”.
1. 「畑の野菜がふらふらだ」: “Rau ngoài ruộng đang loạng choạng”. Nắng nóng kéo dài làm rau héo là 野菜がしおれている.
2. Bị sốt nên đi đứng hơi loạng choạng: 体がふらふらする dùng đúng.
3. 「指がふらふらだ」: “Ngón tay loạng choạng” sau khi chơi piano cả ngày. Ngón tay mỏi là 指が疲れている.
4. 「声がふらふらした」: “Giọng nói loạng choạng”. Giọng run vì căng thẳng là 声が震えた.
Ghi nhớ: cơ thể loạng choạng/chóng mặt là ふらふら; rau héo là しおれる; giọng run là 震える.`,
  toan_q_2020_12_35: `Đáp án 4 — 滞在（たいざい）する là ở lại một nơi trong một khoảng thời gian đáng kể, thường nói về thành phố, quốc gia hoặc nơi lưu trú khi đi công tác/du lịch. 「一週間、仕事で東京に滞在します」 nghĩa là “Từ ngày mai tôi sẽ ở Tokyo một tuần vì công việc”.
1. 「電車がホームに滞在している」: “Tàu đang lưu trú ở sân ga”. Tàu dừng tại sân ga là ホームに停車している.
2. 「しばらく喫茶店に滞在しませんか」: “Chúng ta ở lại quán cà phê một lúc nhé?”. Câu này có thể hiểu được, nhưng 滞在 thường dùng cho nơi lưu trú/chuyến đi dài hơn; với lúc nghỉ ngắn ở quán, tự nhiên hơn là しばらく喫茶店で休みませんか. Vì vậy đây là phương án kém thích hợp hơn câu 4 chứ không phải câu vô nghĩa.
3. 「車が工場に滞在しています」: “Chiếc xe đang lưu trú ở xưởng”. Xe được gửi để sửa thì nói 修理のため工場に預けてある.
4. Ở Tokyo một tuần vì công việc: 東京に滞在する là cách dùng điển hình.
Ghi nhớ: 滞在する là ở lại một nơi trong chuyến đi; tàu dừng là 停車する; gửi xe vào xưởng là 預ける.`,
  toan_q_2019_12_31: `Đáp án 2 — 健康（けんこう）là trạng thái cơ thể khỏe mạnh. 「毎日運動をしているので、今でもとても健康だ」 nghĩa là “Ông tôi tập thể dục mỗi ngày nên đến giờ vẫn rất khỏe mạnh”.
1. 「成績が健康だった」: “Thành tích học tập khỏe mạnh”. Điểm số tốt hơn bình thường là 成績がよかった.
2. Ông tập thể dục hằng ngày và vẫn khỏe mạnh: 健康だ dùng đúng cho sức khỏe con người.
3. 「ビルは古いけど健康そう」: “Tòa nhà cũ nhưng có vẻ khỏe mạnh”. Tòa nhà trông còn chắc chắn là 丈夫そう・状態がよさそう.
4. 「パソコンが健康ではない」: “Máy tính không khỏe”. Máy tính có trục trặc là 調子が悪い.
Ghi nhớ: con người khỏe mạnh là 健康; đồ vật chắc chắn là 丈夫; thiết bị hoạt động bất thường là 調子が悪い.`,
  toan_q_2019_12_32: `Đáp án 1 — 参加（さんか）する là tham gia một sự kiện/hoạt động. 「留学セミナーに参加しますか」 nghĩa là “Bạn có tham gia hội thảo du học lần tới không?”.
1. Hỏi Takahashi có tham gia hội thảo du học không: セミナーに参加する dùng đúng.
2. 「林の中に参加したら」: “Nếu tham gia vào trong rừng”. Đi vào rừng là 林の中に入ったら.
3. 「渋滞に参加してしまった」: “Tham gia vào tắc đường”. Bị kẹt xe là 渋滞に巻き込まれた.
4. 「猫が家族に参加しました」: “Con mèo tham gia gia đình”. Nói mèo trở thành thành viên gia đình là 家族に加わった・家族の一員になった.
Ghi nhớ: tham dự sự kiện là 参加する; đi vào nơi chốn là 入る; bị cuốn vào tắc đường là 巻き込まれる; gia nhập gia đình là 加わる.`,
  toan_q_2019_12_33: `Đáp án 3 — 中旬（ちゅうじゅん）là khoảng giữa của một tháng, thường vào khoảng ngày 11–20. 「来月の中旬には帰国するつもりだ」 nghĩa là “Tôi định về nước vào giữa tháng sau”.
1. 「本棚の中旬」: “Giữa tháng của giá sách”. Vị trí giữa giá sách là 棚の中段.
2. 「試合の中旬」: “Giữa tháng của trận đấu”. Phần giữa trận đấu là 試合の中盤.
3. Về nước vào khoảng giữa tháng sau: 来月の中旬 dùng đúng cho thời điểm trong tháng.
4. 「三人兄弟の中旬」: “Người giữa tháng trong ba anh em”. Người con thứ hai/người ở giữa là 真ん中・真ん中の子.
Ghi nhớ: 中旬 dùng cho giữa tháng; 中段 cho tầng giữa của giá; 中盤 cho giữa trận/tiến trình; 真ん中 cho vị trí ở giữa.`,
  toan_q_2019_12_34: `Đáp án 3 — 落ち着く（おちつく）là bình tĩnh lại hoặc khiến tâm trạng lắng xuống. 「好きな音楽を聞いていると、気持ちが落ち着く」 nghĩa là “Nghe nhạc mình thích thì tâm trạng bình tĩnh lại”.
1. 「店の前に大勢の人が落ち着いている」: “Nhiều người đang bình tĩnh trước cửa hàng”. Trong ngữ cảnh cửa hàng đông khách từ sáng, ý là mọi người xếp hàng nên dùng 店の前に並んでいる; 落ち着く không có nghĩa là xếp hàng.
2. 「本が床に落ち着いている」: “Cuốn sách đang bình tĩnh trên sàn”. Cuốn sách được đặt/để trên sàn là 床に置いてある・落ちている.
3. Nghe nhạc yêu thích làm tâm trạng bình tĩnh: 気持ちが落ち着く là kết hợp đúng.
4. 「ごみが道に落ち着く」: “Rác bình tĩnh trên đường”. Rác nằm rải rác trên đường là ごみが落ちている・散らかっている.
Ghi nhớ: tâm trạng ổn định là 落ち着く; người đứng thành hàng là 並ぶ; đồ vật nằm ở đâu là 置いてある・落ちている.`,
  toan_q_2019_12_35: `Đáp án 2 — ほえる là sủa/gầm, thường dùng với chó hoặc một số động vật. 「隣の家の犬がほえるので、とてもうるさい」 nghĩa là “Chó nhà bên sủa nên rất ồn”.
1. 「鳥がほえている」: “Chim đang sủa/gầm”. Chim kêu thường dùng 鳥が鳴いている.
2. Chó nhà bên sủa vào ban đêm: 犬がほえる là cách dùng đúng.
3. 「目覚まし時計がほえる音」: “Tiếng đồng hồ báo thức sủa”. Đồng hồ reo là 目覚まし時計が鳴る.
4. 「音楽がほえている」: “Âm nhạc đang sủa”. Nhạc phát/đang vang lên là 音楽が流れている・鳴っている.
Ghi nhớ: chó sủa là ほえる; chim kêu/chuông reo là 鳴く・鳴る; nhạc phát là 流れる.`,
  toan_q_2014_07_32: `Đáp án 1 — 発展（はってん）là phát triển/mở rộng về quy mô, ngành nghề hoặc xã hội. 「この町は海に近く、外国との貿易によって発展してきた」 nghĩa là “Thị trấn này gần biển và đã phát triển nhờ giao thương với nước ngoài”. 発展する kết hợp tự nhiên với thị trấn và hoạt động thương mại.
1. Thị trấn phát triển nhờ giao thương: 発展する dùng đúng cho đô thị, kinh tế hoặc một lĩnh vực.
2. 「毎日ピアノの練習をしているが、なかなか発展しない」: “Ngày nào cũng luyện piano nhưng mãi không phát triển”. Với kỹ năng cá nhân dùng 上達する・進歩する.
3. 「ビルもずいぶん発展してきた」: “Tòa nhà cũng đã phát triển đáng kể”. Nói công trình xây dựng tiến triển thì dùng 工事が進む; tòa nhà hoàn thiện dần là 完成してくる.
4. 「留学していた息子が…発展していて」: “Con trai đi du học về đã phát triển”. Nói người trưởng thành hơn dùng 成長する.
Ghi nhớ: 発展 hợp với đô thị, kinh tế, thương mại hoặc lĩnh vực; kỹ năng tiến bộ là 上達; con người trưởng thành là 成長.`,
  toan_q_2012_12_31: `Đáp án 3 — 募集（ぼしゅう）する là kêu gọi/tuyển người đăng ký tham gia một hoạt động. 「スピーチ大会の参加者を募集しています」 nghĩa là “Chúng tôi đang tuyển người tham gia cuộc thi hùng biện”, đúng với cách dùng của từ.
1. 「新入生を１番教室に募集した」: “Tuyển tân sinh viên vào phòng học số 1 để giải thích về lớp”. 募集する là công khai kêu gọi người đăng ký; đưa những người đã có vào phòng thì dùng 集める.
2. 「いろいろな国のコインを募集する」: “Tuyển/chiêu mộ tiền xu từ nhiều nước làm sở thích”. Vật để sưu tập thì dùng 集める・収集する, không dùng 募集する.
3. 「スピーチ大会の参加者を募集しています」: “Đang tuyển người tham dự cuộc thi hùng biện”. Đây là người đăng ký tham gia nên 募集する đúng.
4. 「ごみを募集しています」: “Đang tuyển rác hai lần mỗi tuần”. Thành phố thu gom rác là ごみを回収する.
Ghi nhớ: 募集する dùng khi mời gọi người tham gia/đăng ký; 集める・収集する là gom hoặc sưu tập đồ vật; 回収する là thu hồi, thu gom.`,
  toan_q_2012_12_32: `Đáp án 4 — 空（から）là trạng thái bên trong đã hết, trống rỗng. 「飲み終わって空になったビンはここに置いてください」 nghĩa là “Hãy đặt những chai đã uống hết vào đây”. 空になる kết hợp tự nhiên với chai đã cạn.
1. 「空の日が一日もない」: “Không có ngày nào trống”. Khi nói lịch không có ngày rảnh, thường nói 予定のない日 hoặc 空いている日; 空の日 không phải cách diễn đạt tự nhiên trong câu này.
2. 「話は内容が空なので」: “Câu chuyện có nội dung rỗng”. Nội dung thiếu ý thường diễn đạt là 内容がない・中身がない; 空（から）thường nói vật chứa không còn gì bên trong.
3. 「いつ行っても家が空だ」: “Lúc nào đến nhà anh Hayashi cũng thấy nhà trống”. Muốn nói không có ai ở nhà dùng 留守だ; 空き家 nói căn nhà bỏ trống.
4. 「空になったビン」: “Chai đã cạn”. Chất bên trong đã được uống hết nên 空になる dùng đúng.
Ghi nhớ: 空（から）là trống/rỗng bên trong; 空いている日 là ngày rảnh; 留守 là vắng nhà.`,
  toan_q_2012_12_33: `Đáp án 1 — 活動（かつどう）する là tiến hành hoạt động có mục đích, thường nói về cá nhân, tổ chức hoặc một lĩnh vực. 「文化教室を開くなどの活動をしている」 nghĩa là “Tổ chức này đang thực hiện các hoạt động như mở lớp văn hóa để giới thiệu văn hóa Nhật”, dùng tự nhiên.
1. Tổ chức mở lớp văn hóa và làm các hoạt động khác để giới thiệu văn hóa Nhật: 活動する phù hợp với hoạt động có chủ đích của một tổ chức.
2. 「掃除や洗濯などの活動を手伝う」: “Giúp các hoạt động như dọn dẹp và giặt giũ”. Trong sinh hoạt gia đình thường nói 掃除や洗濯を手伝う; 活動 quá chung và không tự nhiên ở đây.
3. 「エレベーターの活動がまた始まった」: “Hoạt động của thang máy lại bắt đầu”. Thang máy chạy lại sau sửa chữa thì nói 運転が再開した・動き始めた.
4. 「トラックの活動が多くなった」: “Hoạt động của xe tải tăng lên”. Nói xe tải qua lại nhiều hơn dùng トラックの往来・交通量が増えた.
Ghi nhớ: 活動する dùng cho hoạt động có mục đích; máy móc 運転する・動く; xe cộ qua lại là 往来する.`,
  toan_q_2012_12_34: `Đáp án 2 — 行き先（いきさき）là nơi một người hoặc phương tiện sẽ đi tới. 「誰かに行き先を伝えておいてください」 nghĩa là “Hãy báo trước cho ai đó biết mình sẽ đi đâu”, đúng với tình huống ra ngoài trong giờ làm.
1. 「メールの行き先を間違えて」: “Gửi nhầm nơi đến của email”. Địa chỉ/người nhận email là 宛先; 行き先 dùng cho điểm đến của chuyến đi.
2. 「外出するときは、行き先を伝えて」: “Khi ra ngoài, hãy báo điểm đến”. Nói cho đồng nghiệp biết mình sẽ đi đâu là 行き先を伝える.
3. 「駅はこの行き先であっていますか」: “Nhà ga có đúng hướng đi này không?”. Khi hỏi đường hoặc hướng, dùng 方向・道順; 行き先 là địa điểm cần tới, không phải hướng đi.
4. 「この川は行き先で二つに分かれて」: “Con sông này tách làm hai ở điểm đến”. Nơi dòng sông tách nhánh là 分岐点; không gọi là 行き先.
Ghi nhớ: 行き先 = điểm đến; 宛先 = người/nơi nhận thư; 方向 = hướng.`,
  toan_q_2012_12_35: `Đáp án 2 — 経由（けいゆ）する là đi qua một địa điểm trung gian trên hành trình tới nơi khác. 「このバスは市役所を経由して駅へ向かいます」 nghĩa là “Xe buýt này đi qua tòa thị chính rồi hướng tới nhà ga”; 市役所 là điểm dừng/điểm đi qua trên tuyến đường.
1. 「公園の中を経由するとちょっと近道になる」: “Nếu đi qua bên trong công viên thì sẽ thành đường tắt”. Ý chung có thể hiểu được, nhưng 経由する thường nêu một điểm trung chuyển trên tuyến như 市役所や東京駅; khi nói đi xuyên qua công viên để tắt, cách nói tự nhiên là 公園の中を通る.
2. Xe buýt đi qua tòa thị chính rồi đến ga: 経由して chỉ điểm mà tuyến xe đi qua, dùng đúng.
3. 「会社員を経由して大学に入った」: “Đi qua giai đoạn nhân viên công ty rồi vào đại học”. 経由する dùng cho tuyến đường/điểm trung gian, không dùng cho một nghề nghiệp như một chặng đời; có thể nói 会社員を経て大学に入った.
4. 「昼休みを経由して午後まで続いた」: “Cuộc họp đi qua giờ nghỉ trưa rồi kéo dài đến chiều”. Cuộc họp bị tạm ngưng qua giờ nghỉ thì nói 昼休みを挟んで; 経由する không dùng cho khoảng thời gian này.
Ghi nhớ: 経由する = đi qua một điểm trên tuyến; 通る = đi qua một con đường/nơi; 経て = trải qua một giai đoạn; 挟む = có một khoảng nghỉ ở giữa.`,
  toan_q_2011_12_31: `Đáp án 4 — 断る（ことわる）là từ chối lời mời, đề nghị hoặc yêu cầu. 「パーティーの誘いを断りました」 nghĩa là “Vì đã có hẹn khác nên tôi từ chối lời mời dự tiệc”, kết hợp đúng.
1. 「タバコを断ってから」: “Từ khi từ chối thuốc lá”. Muốn nói bỏ thuốc lá dùng タバコをやめる・断つ; 断る là từ chối một lời mời/yêu cầu.
2. 「働いた会社を断って」: “Từ chối công ty nơi mình đã làm rồi mở cửa hàng”. Nghỉ việc ở công ty là 会社を辞める.
3. 「夢は断らないでください」: “Xin đừng từ chối ước mơ”. Với 夢, tự nhiên là 夢をあきらめないでください; không dùng 断る theo nghĩa từ bỏ.
4. Có hẹn khác nên từ chối lời mời đi tiệc: 誘いを断る là kết hợp đúng.
Ghi nhớ: từ chối lời mời/yêu cầu là 断る; bỏ thuốc là やめる・断つ; nghỉ việc là 辞める; từ bỏ ước mơ là あきらめる.`,
  toan_q_2011_12_32: `Đáp án 2 — 緩い（ゆるい）diễn tả vật không được siết chặt hoặc rộng hơn cơ thể. 「ズボンがゆるいので、ベルトをきつくしめた」 nghĩa là “Quần rộng nên tôi siết chặt thắt lưng”, dùng đúng.
1. 「帰りはゆるかった」: “Lúc về thì lỏng”. Tàu ít đông nói 電車が空いていた; 緩い không có nghĩa là vắng người.
2. Quần bị rộng nên siết dây nịt: ズボンがゆるい kết hợp tự nhiên.
3. 「スーツケースがまだゆるい」: “Va-li vẫn lỏng”. Khi còn nhiều chỗ trống trong va-li, nói まだ余裕がある・まだ空いている.
4. 「家が十分ゆるい」: “Ngôi nhà đủ lỏng”. Nói nhà đủ rộng cho hai người là 十分広い.
Ghi nhớ: quần áo/dây bị lỏng hoặc rộng là 緩い; chỗ trống trong hành lý là 余裕がある; căn phòng rộng là 広い.`,
  toan_q_2011_12_33: `Đáp án 1 — 性格（せいかく）là tính cách của một người. 「短気の性格の人は、この仕事にはあまり向かない」 nghĩa là “Người có tính nóng nảy không hợp lắm với công việc này”; 性格 được dùng để nói đặc điểm tâm tính.
1. Người có tính nóng nảy không hợp công việc: 性格 dùng đúng; cách gọn hơn thường là 短気な人・短気な性格の人.
2. 「グランドの性格がよくない」: “Tính cách của sân vận động không tốt”. Muốn nói mặt sân xấu sau mưa, dùng 状態・コンディション.
3. 「車の性格は電気で走る点」: “Tính cách của chiếc xe là chạy bằng điện”. Đặc tính/hiệu năng kỹ thuật của xe là 性能・特徴.
4. 「その日の性格で言うことが変わる」: “Lời nói thay đổi theo tính cách của ngày hôm đó”. Ý định là tâm trạng trong ngày, nên dùng 気分.
Ghi nhớ: 性格 là tính cách; 性能・特徴 là đặc tính của đồ vật; 気分 là tâm trạng.`,
  toan_q_2011_12_34: `Đáp án 1 — 受け入れる（うけいれる）là tiếp nhận người/vật hoặc chấp nhận một đề nghị, ý kiến, hoàn cảnh. 「大勢の留学生を受け入れています」 nghĩa là “Trường đại học của tôi tiếp nhận đông du học sinh mỗi năm”, đúng với cách dùng này.
1. Trường tiếp nhận nhiều du học sinh: 受け入れる dùng được với người được nhận vào tổ chức.
2. 「パンフレットを受け入れて」: “Tiếp nhận tờ giới thiệu ở lối vào”. Khi cầm/lấy một vật được đưa cho, dùng 受け取る.
3. 「申し込みを受け入れています」: “Đang chấp nhận đơn đăng ký vé qua điện thoại”. Với việc nhận đơn, cách nói chuẩn là 申し込みを受け付ける.
4. 「最新の技術を受け入れた製品」: “Sản phẩm tiếp nhận công nghệ mới nhất”. Sản phẩm áp dụng/tích hợp công nghệ là 技術を取り入れた製品.
Ghi nhớ: tiếp nhận người/chấp nhận điều gì là 受け入れる; nhận vật là 受け取る; nhận đơn là 受け付ける; áp dụng công nghệ là 取り入れる.`,
  toan_q_2011_12_35: `Đáp án 4 — そろそろ báo hiệu thời điểm thích hợp đã đến hoặc sắp đến. 「そろそろ１２時なので昼休みにしよう」 nghĩa là “Sắp 12 giờ rồi, nghỉ trưa thôi”, nên dùng đúng.
1. 「バスがそろそろ来ない」: “Xe buýt sắp không đến”. そろそろ thường đi với việc sắp xảy ra ở dạng khẳng định; ở đây có thể nói まだ来ない・そろそろ来てもいいころだ.
2. 「昨日そろそろ壊れた」: “Hôm qua máy giặt từ từ bị hỏng”. 壊れる thường là sự cố xảy ra, không phải quá trình từ từ; nói 昨日とうとう壊れた hoặc そろそろ壊れそうだ.
3. 「本がそろそろ見つかった」: “Cuốn sách được tìm thấy sắp/sơ sơ”. Kết quả vừa tìm thấy dùng やっと見つかった; そろそろ見つかる dự đoán rằng sẽ sớm tìm được.
4. Dù còn việc nhưng gần đến giờ nghỉ trưa: そろそろ１２時 đúng là thời điểm sắp tới.
Ghi nhớ: そろそろ + hành động sắp đến; やっと + kết quả đạt được sau chờ đợi; とうとう + sự việc cuối cùng đã xảy ra.`,
  toan_q_2011_07_31: `Đáp án 4 — 転ぶ（ころぶ）là ngã, mất thăng bằng rồi đổ xuống. 「階段でころんでけがをした」 nghĩa là “Tôi bị ngã ở cầu thang và bị thương”, đúng với nghĩa của từ.
1. 「ベッドにころんだ」: “Ngã lên giường”. Nếu muốn nói nằm/ngả người lên giường, dùng 横になった・ベッドに入った.
2. 「旅行の計画がころんでしまった」: “Kế hoạch du lịch bị ngã”. Kế hoạch bị hỏng/bị đổ bể là 計画がだめになった・くずれた.
3. 「台風で庭の木がころんだ」: “Cây trong vườn bị ngã vì bão”. Cây bị đổ là 木が倒れた; 転ぶ chủ yếu dùng với người hoặc con vật.
4. Bị ngã trên cầu thang rồi bị thương: 転んでけがをする là cách kết hợp đúng.
Ghi nhớ: người ngã là 転ぶ; cây/vật lớn đổ là 倒れる; nằm xuống là 横になる.`,
  toan_q_2011_07_32: `Đáp án 1 — 指示（しじ）する là đưa chỉ thị hoặc hướng dẫn cụ thể cho người khác làm việc gì. 「秘書に指示した」 nghĩa là “Tôi chỉ thị cho thư ký sao chép sẵn 30 bản tài liệu”.
1. Yêu cầu thư ký sao chép 30 bản: người nói giao chỉ thị công việc, 指示する phù hợp.
2. 「作文を見ていただけませんか」と先生に指示した: “Tôi chỉ thị giáo viên xem bài văn giúp”. Đây là lời nhờ lịch sự; dùng お願いした・頼んだ.
3. 「映画を見に行こうよ」と友達に指示した: “Tôi chỉ thị bạn đi xem phim”. Đây là lời rủ, dùng 誘った.
4. 「トイレはどこですか」と店員に指示した: “Tôi chỉ thị nhân viên nhà vệ sinh ở đâu”. Đây là câu hỏi, dùng 尋ねた・聞いた.
Ghi nhớ: 指示する là giao việc/chỉ thị; nhờ ai là 頼む; rủ ai là 誘う; hỏi thông tin là 尋ねる.`,
  toan_q_2011_07_33: `Đáp án 4 — 見送る（みおくる）là tiễn người lên đường hoặc nhìn một người/phương tiện rời đi. 「国に帰る友人を空港まで見送った」 nghĩa là “Tôi tiễn người bạn về nước đến tận sân bay”.
1. 「メールを見送る」: “Tiễn email”. Ý định là đọc/kiểm tra thư, nên dùng メールを読む・確認する.
2. 「何ページか見送ってみた」: “Thử tiễn vài trang”. Nếu bỏ qua vài trang để đọc tiếp, dùng 何ページか飛ばして読んだ.
3. 「景色を見送る」: “Tiễn cảnh vật”. Ngắm cảnh qua cửa sổ tàu là 景色を眺める; 見送る thường hướng tới người hoặc chuyến xe/tàu đang đi.
4. Tiễn bạn về nước tới sân bay: 見送る dùng đúng.
Ghi nhớ: tiễn người là 見送る; ngắm cảnh là 眺める; bỏ qua trang là 飛ばす; 見送る còn có nghĩa hoãn một quyết định.`,
  toan_q_2011_07_34: `Đáp án 1 — 植える（うえる）là đặt cây/hạt vào đất để cây mọc. 「公園にはいろいろな花が植えてある」 nghĩa là “Trong công viên gần nhà có trồng nhiều loại hoa”.
1. Hoa được trồng sẵn trong công viên: 花を植える là cách dùng đúng.
2. 「ケーキにいちごやクリームを植えた」: “Trồng dâu và kem lên bánh”. Đặt/trang trí nguyên liệu lên bánh dùng のせる・飾る.
3. 「海に土を植えて作られた」: “Được tạo ra bằng cách trồng đất xuống biển”. Lấn biển bằng đất là 海を埋め立てて作る.
4. 「道に電灯を植えた」: “Trồng đèn đường”. Lắp đèn là 電灯を設置する.
Ghi nhớ: 植える dùng cho cây/hạt; trang trí bánh là 飾る; lấn biển là 埋め立てる; lắp đặt thiết bị là 設置する.`,
  toan_q_2011_07_35: `Đáp án 1 — 正直（しょうじき）là trung thực, không nói dối. 「正直な人で、決してうそは言いません」 nghĩa là “Anh Ogawa là người trung thực, tuyệt đối không nói dối”.
1. Người không bao giờ nói dối là người 正直; cách dùng đúng.
2. 「正直な使い方」: “Cách sử dụng trung thực”. Cách dùng đúng/quy chuẩn là 正しい使い方.
3. 「これは正直な話なのに」: “Dù đây là lời nói thật”. 正直な話 thường có nghĩa “nói thật lòng mà nói” khi mở đầu lời nói; muốn khẳng định nội dung là sự thật, dùng 本当の話.
4. 「正直な距離」: “Khoảng cách trung thực”. Khoảng cách chính xác là 正確な距離.
Ghi nhớ: 正直 mô tả con người/thái độ nói thật; 正しい là đúng; 本当 là thật; 正確 là chính xác.`,
  toan_q_2010_07_31: `Đáp án 4 — 落ち着く（おちつく）là bình tĩnh lại hoặc giữ được sự bình tĩnh. 「火事のとき落ち着いて行動しよう」 nghĩa là “Khi có hỏa hoạn, hãy bình tĩnh hành động”.
1. 「電車が駅に落ち着いたら」: “Khi tàu bình tĩnh ở ga”. Tàu đến/đỗ ở ga là 駅に着く・停車する.
2. 「商品が棚に落ち着いている」: “Hàng hóa yên vị trên kệ”. Nếu hàng không bán được và nằm trên kệ, dùng 売れ残っている・置かれている.
3. 「かぎが穴に落ち着いた」: “Chìa khóa bình tĩnh trong lỗ”. Chìa lọt vào lỗ dùng 穴に入った・はまった.
4. Bình tĩnh hành động khi có cháy: 落ち着いて行動する là kết hợp đúng.
Ghi nhớ: người/tâm trạng bình tĩnh là 落ち着く; tàu đến ga là 着く; vật lọt khít vào lỗ là はまる.`,
  toan_q_2010_07_32: `Đáp án 2 — 量る（はかる）là cân/đong khối lượng hoặc lượng nguyên liệu. 「小麦粉やバターをきちんとはかってケーキを作った」 nghĩa là “Tôi cân đong cẩn thận bột mì và bơ để làm bánh”.
1. 「りんごの数をはかってみたら、１７個あった」: “Đo số táo thì được 17 quả”. Với số lượng từng quả, dùng 数える.
2. Cân đong bột mì và bơ để làm bánh: 量る dùng đúng với nguyên liệu cần đo lượng.
3. 「一時間ぐらいで終わるとはかっています」: “Tôi đo rằng bài tập xong trong khoảng một giờ”. Dự đoán/thấy rằng dùng 思っている・予想している; はかる không có nghĩa đó.
4. 「生活費を電卓ではかった」: “Đo chi phí sinh hoạt bằng máy tính”. Tính tiền bằng máy tính là 電卓で計算した.
Ghi nhớ: 量る cân/đong lượng; 数える đếm số món; 予想する dự đoán; 計算する tính toán.`,
  toan_q_2010_07_33: `Đáp án 2 — ユーモア là sự hài hước/khiếu hài hước. 「ユーモアがあって、いっしょにいると楽しい」 nghĩa là “Anh Kimura có khiếu hài hước nên ở cùng rất vui”. Mẫu tự nhiên là ユーモアがある.
1. 「ユーモアした映画」: “Bộ phim đã hài hước”. ユーモア không dùng như động từ する; nói ユーモアのある映画.
2. Kimura có khiếu hài hước, ở cùng rất vui: ユーモアがある dùng đúng.
3. 「本はとてもユーモアだった」: “Cuốn sách rất là sự hài hước”. Tính từ là ユーモラスだった hoặc おもしろかった.
4. 「ユーモアに自己紹介をして」: “Tự giới thiệu bằng sự hài hước”. Nói tự giới thiệu có pha chút hài hước là ユーモアを交えて自己紹介する.
Ghi nhớ: ユーモアがある = có khiếu hài hước; ユーモラスな = hài hước; ユーモアを交える = pha chút hài hước.`,
  toan_q_2010_07_34: `Đáp án 1 — 未来（みらい）là tương lai, thời gian phía trước. 「地球の未来のために環境問題について考えよう」 nghĩa là “Hãy suy nghĩ về vấn đề môi trường vì tương lai của Trái Đất”.
1. Nghĩ về vấn đề môi trường vì tương lai Trái Đất: 地球の未来 là kết hợp đúng.
2. 「山本さんは未来は何になりたいですか」: “Tương lai ông Yamamoto muốn trở thành gì?”. Khi hỏi nghề nghiệp mong muốn, nói 将来は何になりたいですか; 未来は không tự nhiên ở đây.
3. 「未来の都合を教えてください」: “Hãy cho biết sự thuận tiện của tương lai”. Muốn hỏi lịch rảnh trong tương lai, dùng これからの予定・都合のいい日.
4. 「未来の今ごろ」: “Khoảng thời gian này trong tương lai”. Cụm quen dùng là 来年の今ごろ・将来のある時点; 未来の今ごろ không tự nhiên trong ngữ cảnh này.
Ghi nhớ: 未来 dùng cho tương lai nói chung; 将来 thường nói về tương lai/định hướng của người; 予定・都合 là lịch trình và thời gian thuận tiện.`,
  toan_q_2010_07_35: `Đáp án 4 — そっくり nghĩa là giống nhau đến mức có thể nhận ra nét giống rõ rệt, thường dùng với khuôn mặt/giọng nói. 「顔だけでなく声までそっくり」 nghĩa là “Người chồng và con trai giống nhau không chỉ ở khuôn mặt mà cả giọng nói”.
1. 「そっくりの時間」: “Thời gian giống hệt”. Giờ đi làm giống nhau mỗi ngày thì nói 毎朝同じ時間.
2. 「私にそっくりのサイズ」: “Kích cỡ giống hệt tôi”. Quần áo vừa khít người là 私にぴったりのサイズ.
3. 「誕生日はそっくりです」: “Sinh nhật giống nhau”. Ngày sinh trùng nhau nói 誕生日が同じです.
4. Chồng và con giống cả mặt lẫn giọng: そっくり dùng tự nhiên để chỉ sự giống nhau.
Ghi nhớ: そっくり = rất giống nhau; ぴったり = vừa khít/phù hợp; 同じ = giống hệt về ngày, giờ hoặc loại.`,
  toan_q_2025_12_31: `Đáp án 2 — 握る（にぎる）là nắm bằng tay. 「弟の手をしっかりと握った」: “Tôi nắm chặt tay em trai để em không bị lạc”, dùng đúng.
1. Nắm đồ nội thất nặng khi chuyển nhà: đồ cồng kềnh thường dùng 持ち上げる・運ぶ (nâng/khiêng), không phải 握る.
2. Nắm tay em trai ở lễ hội để em không đi lạc: 手を握る là kết hợp chuẩn.
3. Mũ bị gió thổi bay nhưng Ishihara “chạy rồi nắm”: ý là đuổi theo và bắt lấy, nên dùng 追いかけてつかまえた.
4. Ôm em bé mới sinh một cách trìu mến: nói 抱く (bế/ôm), không phải 握る (nắm).
Ghi nhớ: 握る nắm tay/vật nhỏ; 持つ cầm; 抱く ôm bế; つかまえる bắt lấy vật/người đang chạy.`,
  toan_q_2025_12_32: `Đáp án 3 — 修理（しゅうり）là sửa chữa vật bị hỏng để dùng lại. 「自転車が壊れたので、買ったお店で修理してもらった」: “Xe đạp hỏng nên tôi nhờ cửa hàng đã mua sửa giúp”.
1. Sau cãi nhau muốn “sửa chữa quan hệ”: làm hòa/khôi phục quan hệ là 仲直りする・関係を修復する.
2. Bị thương ở tay và “được sửa chữa” tại bệnh viện: bác sĩ chữa bệnh là 治療してもらう.
3. Xe đạp hỏng được cửa hàng sửa: 修理する dùng cho phương tiện/đồ vật hỏng.
4. Giáo viên dùng bút đỏ “sửa chữa” chữ Hán sai: sửa lỗi bài viết là 直す・訂正する.
Ghi nhớ: 修理 dùng cho máy móc/đồ vật; 治療 dùng cho người bệnh; 訂正・直す dùng cho lỗi; 仲直り dùng cho quan hệ.`,
  toan_q_2025_12_33: `Đáp án 4 — 目的（もくてき）là mục đích cần đạt khi làm việc gì. 「この研究の目的は、新しい薬の効果を調べることです」: “Mục đích nghiên cứu này là khảo sát hiệu quả của thuốc mới”.
1. Bán được hàng vượt 100.000 yên: con số đặt ra là 目標 (mục tiêu), không phải 目的.
2. Khi đặt chỗ, báo muốn ngồi cạnh cửa sổ: đó là 希望 (nguyện vọng), không phải mục đích.
3. Vì sắp đi công tác nước ngoài một tháng nên bận chuẩn bị: nói 海外出張する予定なので (vì có lịch đi công tác), không dùng 目的なので.
4. Nghiên cứu được thực hiện nhằm kiểm tra hiệu quả thuốc: nêu rõ làm để làm gì, nên 目的 dùng đúng.
Ghi nhớ: 目的 = mục đích/lý do thực hiện; 目標 = đích/mốc muốn đạt; 希望 = mong muốn; 予定 = kế hoạch.`,
  toan_q_2025_12_34: `Đáp án 1 — 懐かしい（なつかしい）diễn tả cảm giác bồi hồi khi nhớ lại điều thân thuộc trong quá khứ. 「子どものときの写真を見て、懐かしい気持ちになった」: “Nhìn ảnh hồi nhỏ, tôi thấy bồi hồi nhớ lại”.
1. Ảnh thời thơ ấu gợi cảm xúc nhớ về quá khứ: 懐かしい dùng tự nhiên.
2. Ngôi chùa 800 năm tuổi là cổ kính/lịch sử: 歴史のある・古い寺, không phải 懐かしい nếu người nói không có kỷ niệm riêng.
3. Quan hệ với vợ sau 30 năm là thân thiết/gắn bó: 親しい関係・長い付き合い; 懐かしい không tả mức độ thân thiết hiện tại.
4. Mới gặp Tamura nhưng “trở thành người bạn hoài niệm”: người mới quen là 友達になる・親しくなる; 懐かしい chỉ cảm xúc nhớ lại chuyện cũ.
Ghi nhớ: 懐かしい gợi kỷ niệm; 親しい là thân; 歴史がある là có lịch sử lâu đời.`,
  toan_q_2025_12_35: `Đáp án 3 — 変化（へんか）là sự thay đổi trạng thái/tính chất. 「インターネットが登場して、人々の生活は大きく変化した」: “Internet xuất hiện khiến đời sống con người thay đổi lớn”.
1. Bữa ăn bị chuyển sang tuần sau: đổi lịch là 変更する・延期する, không phải 変化する.
2. Địa chỉ thay đổi sau khi chuyển nhà: thông tin được cập nhật/đổi là 住所が変わった・変更になった.
3. Internet làm đời sống đổi khác rõ rệt: 生活が変化する dùng đúng.
4. Người điều phối cuộc họp đổi từ Mizuno sang Takahashi: đổi người phụ trách là 交代する.
Ghi nhớ: trạng thái biến đổi là 変化; lịch/thông tin đổi là 変更; đổi người trực là 交代.`,
  toan_q_2019_07_31: `Đáp án 4 — 報告（ほうこく）là báo cáo kết quả hoặc tình hình cho người khác. 「アンケートの結果について、今日の会議で報告があった」: “Trong cuộc họp hôm nay đã có báo cáo về kết quả khảo sát”.
1. Dự báo thời tiết trên TV: phát bản tin là 天気予報を伝える・放送する; 報告 thường báo cáo cho nhóm/cấp trên.
2. Có thông tin rằng cả lớp sẽ đi bảo tàng: đó là 提案・知らせ, không phải báo cáo kết quả.
3. Người bạn gọi nói muốn gặp để xin lỗi: đó là 連絡・申し出 (liên lạc/đề nghị), không phải 報告.
4. Hội nghị trình bày kết quả khảo sát: 報告 dùng đúng với kết quả công việc.
Ghi nhớ: 報告 = báo cáo kết quả/tình hình; 予報 = dự báo; 提案 = đề xuất; 連絡 = liên lạc.`,
  toan_q_2019_07_32: `Đáp án 4 — 満員（まんいん）là kín chỗ, đầy người. 「会場は満員で、座れない人もたくさんいた」: “Hội trường kín người, nhiều người không có chỗ ngồi”.
1. Tuyển nhân viên bán thời gian nhưng “không thể đầy người”: vị trí tuyển dụng chưa đủ người là 定員に達しない・人が集まらない.
2. Đường gần ga đông/đông nghẹt: với đường xe cộ dùng 混雑している; 満員 thường nói nơi có sức chứa người.
3. Số người tham gia đã đủ nên bắt đầu trò chuyện: số lượng đạt giới hạn là 定員になった・全員そろった.
4. Hội trường đông kín đến mức có người không ngồi được: 満員 dùng đúng.
Ghi nhớ: phương tiện/phòng kín chỗ là 満員; đường phố đông là 混雑; đạt sức chứa là 定員に達する.`,
  toan_q_2019_07_33: `Đáp án 2 — かき混ぜる là khuấy/trộn đều bằng dụng cụ hoặc tay. 「牛乳に卵と砂糖を入れたら、よくかき混ぜてください」: “Cho trứng và đường vào sữa rồi khuấy đều”.
1. Văn bản tiếng Nhật có chữ Hán và hiragana đan xen: dùng 混ざっている (được trộn/lẫn), không phải かき混ぜる (chủ động khuấy).
2. Khuấy trứng và đường trong sữa: かき混ぜる dùng đúng với thao tác khuấy hỗn hợp.
3. Trộn bức thư quý vào sách cũ rồi vứt: ở đây muốn nói giấu/kẹp lẫn vào; văn cảnh không có thao tác khuấy, nên dùng 混ぜる・紛れ込ませる tùy ý.
4. Du học sinh từ nhiều nước đang được trộn lẫn vào lớp: người có quốc tịch đa dạng thì nói いる・集まっている; không “khuấy” người.
Ghi nhớ: かき混ぜる khuấy chất lỏng/hỗn hợp; 混ざる tự lẫn; 紛れる bị lẫn vào vật khác.`,
  toan_q_2019_07_34: `Đáp án 3 — 発生（はっせい）là phát sinh/xảy ra, thường dùng với sự cố, hiện tượng hoặc khí. 「火災が発生したときのために、みんなで避難訓練をした」: “Mọi người diễn tập sơ tán để chuẩn bị khi xảy ra hỏa hoạn”.
1. Nhà máy tạo ra nhiều sản phẩm mới: sản phẩm được sản xuất là 商品を生産する・作る.
2. Nhiều khách sạn mới mọc lên gần biển: khách sạn được xây dựng là 建設される・できる.
3. Hỏa hoạn xảy ra: 火災が発生する là kết hợp chuẩn.
4. Xem phim làm nảy sinh hứng thú với Nhật Bản: sự quan tâm tăng lên là 興味が湧く・生まれる.
Ghi nhớ: sự cố/khí phát sinh là 発生; hàng hóa sản xuất là 生産; công trình xây là 建設; cảm xúc nảy sinh là 湧く.`,
  toan_q_2019_07_35: `Đáp án 1 — お互いに là lẫn nhau, chỉ hành động/quan hệ có tính hai chiều. 「あの夫婦は、どんなときでもお互いに協力し合って生きてきた」: “Vợ chồng đó đã luôn hỗ trợ lẫn nhau trong mọi hoàn cảnh”.
1. Hai vợ chồng cùng hỗ trợ nhau: お互いに dùng đúng cho hai phía.
2. Người cùng đi thang máy hôm qua là giáo viên tiểu học: câu chỉ nói một người; không có hành động qua lại để dùng お互いに.
3. Vì cúm lan trong trường, các bạn cùng lớp đều nghỉ: nghỉ học có thể xảy ra với từng người, nhưng không phải nghỉ lẫn nhau; dùng みんな休んでいる.
4. Hai loại bánh trông đều ngon nên khó chọn: nói cả hai đều trông ngon là どちらもおいしそう, không phải ngon lẫn nhau.
Ghi nhớ: お互いに đi với hành động qua lại như 助け合う・協力する・教え合う.`,
  toan_q_2018_12_31: `Đáp án 4 — 建築（けんちく）là xây dựng công trình/kiến trúc. 「この図書館は50年前に建築された」: “Thư viện này được xây cách đây 50 năm”, dùng đúng.
1. Bức tranh được họa sĩ nổi tiếng “xây dựng”: tranh được vẽ là 描かれた.
2. Nhà máy sản xuất hơn 100 ô tô mỗi ngày: ô tô được 製造する・生産する.
3. Môi trường làm việc dễ chịu được “xây dựng”: môi trường được 整える・作る.
4. Thư viện là công trình được xây dựng: 建築された dùng đúng.
Ghi nhớ: 建築する xây tòa nhà/công trình; 製造する sản xuất; 描く vẽ; 環境を整える tạo môi trường.`,
  toan_q_2018_12_32: `Đáp án 2 — 埋める（うめる）là lấp/ chôn vật vào đất hoặc lấp kín một khoảng trống. 「生ごみは庭に穴を掘って埋めている」: “Nhà tôi đào hố trong vườn để chôn rác nhà bếp”.
1. Cài nút áo: nút được 留める, không phải 埋める.
2. Đào hố rồi chôn rác hữu cơ: 埋める dùng đúng.
3. Trồng cây hoa hồng vào bồn: cây được 植える; 埋める sẽ là vùi lấp cây.
4. Xếp sáu chiếc bánh vào hộp: bánh được 詰める・入れる.
Ghi nhớ: chôn/lấp đất là 埋める; cài nút 留める; trồng cây 植える; cho đồ vào hộp 入れる.`,
  toan_q_2018_12_33: `Đáp án 2 — 重大（じゅうだい）là nghiêm trọng, có tầm quan trọng và hậu quả lớn. 「パソコンに重大な問題が見つかった」: “Người ta phát hiện sự cố nghiêm trọng trong máy tính”.
1. Cha mẹ đã chịu nhiều vất vả để nuôi con: nói 大変な苦労 (vất vả lớn), không phải 重大な苦労.
2. Phát hiện vấn đề nghiêm trọng nên phải thu hồi máy tính: 重大な問題 dùng tự nhiên.
3. Cảm ơn đã dành thời gian quan trọng giúp khảo sát: cảm ơn đã dành 貴重な時間 (thời gian quý báu).
4. Kỳ nghỉ hè trở thành kỷ niệm nghiêm trọng: kỷ niệm đáng nhớ/quý giá là 大切な・貴重な思い出.
Ghi nhớ: 重大 thường đi với 問題・事件・発表; 貴重 dùng với thời gian/kinh nghiệm; 大変 diễn tả vất vả/lớn.`,
  toan_q_2018_12_34: `Đáp án 1 — 延期（えんき）là hoãn một sự kiện sang thời điểm muộn hơn. 「台風が来るので、明日の試合は来週に延期する」: “Vì bão đến nên trận đấu ngày mai được hoãn sang tuần sau”.
1. Trận đấu được dời sang tuần sau: 延期する dùng đúng.
2. Vì không khỏe nên dời giờ đi làm muộn một chút: đổi giờ/lùi giờ là 遅らせる・変更する.
3. Học lâu hơn bình thường nên bài thi làm tốt: học lâu là 長く勉強した; 延期 không có nghĩa “kéo dài”.
4. Bài phát biểu giới hạn 5 phút, đừng “hoãn”: không vượt thời gian là 時間を延長しないで・長くしないで.
Ghi nhớ: 延期 hoãn một sự kiện; 変更 đổi lịch/thông tin; 延長 kéo dài thời lượng.`,
  toan_q_2018_12_35: `Đáp án 3 — 知り合う（しりあう）là quen biết một người lần đầu. 「佐藤さんとは、10年前に旅行先で知り合った」: “Tôi quen anh Sato trong một chuyến đi cách đây 10 năm”.
1. Vẫy tay với Hayashi nhưng anh ấy không “quen biết”: nếu không nhận ra thì 気づかなかった・気がつかなかった.
2. Biết Kimura đoạt giải qua bản tin: dùng 知った; 知り合う chỉ việc hai người làm quen.
3. Làm quen với Sato ở nơi du lịch: 知り合う dùng đúng.
4. Đọc kỹ hướng dẫn rồi “làm quen” với máy trước khi dùng: hiểu cách máy hoạt động là 使い方を知ってから・慣れてから.
Ghi nhớ: 知り合う = làm quen với người; 知る = biết thông tin; 慣れる = quen với cách dùng/sự việc.`,
  toan_q_2018_07_31: `Đáp án 1 — 距離（きょり）là khoảng cách giữa hai địa điểm/người. 「東京から京都までの距離は何キロメートルか」: “Tôi thử tra khoảng cách từ Tokyo đến Kyoto bao nhiêu ki-lô-mét”.
1. Khoảng cách giữa hai thành phố: 距離 dùng đúng.
2. Sửa “khoảng cách” của quần dài cho ngắn lại: ống quần là ズボンの丈・長さ.
3. Olympic tổ chức với “khoảng cách” bốn năm: chu kỳ bốn năm là 4年に1回・4年ごと.
4. Hai anh em cách nhau năm tuổi: chênh lệch tuổi là 年齢差がある.
Ghi nhớ: 距離 là khoảng cách không gian; 丈 là độ dài quần áo; 周期 là chu kỳ; 年齢差 là chênh lệch tuổi.`,
  toan_q_2018_07_32: `Đáp án 3 — 活動（かつどう）là hoạt động có mục tiêu do người/nhóm thực hiện. 「文化を子どもたちに紹介する活動に参加した」: “Tôi tham gia hoạt động giới thiệu văn hóa các nước cho trẻ em”.
1. Tuyết làm tàu dừng chạy: hoạt động của tàu là 運行, nên 運行が止まる.
2. Siêu thị mở đến 9 giờ tối: giờ mở cửa là 営業時間.
3. Tham gia hoạt động giới thiệu văn hóa: 活動に参加する dùng đúng.
4. Làm cử động chân và eo trước khi chạy: khởi động cơ thể là 準備運動をする.
Ghi nhớ: 活動 là hoạt động có chủ đích; 運行 là vận hành phương tiện; 営業 là kinh doanh; 運動 là vận động.`,
  toan_q_2018_07_33: `Đáp án 4 — 盛ん（さかん）diễn tả hoạt động diễn ra sôi nổi hoặc phát triển mạnh. 「私の学校はスポーツが盛んだ」: “Trường tôi có phong trào thể thao rất phát triển”.
1. Học chăm nên làm bài tốt: cách nói tự nhiên là 熱心に勉強した, không phải 勉強が盛ん.
2. Tivi cũ nên hỏng thường xuyên: 故障が多くなってきた.
3. Em trai rất thích chụp ảnh, lúc nào cũng mang máy: sở thích nhiệt tình là 写真を撮るのが好き・趣味だ.
4. Trường có nhiều hoạt động thể thao: スポーツが盛ん dùng đúng.
Ghi nhớ: hoạt động/phong trào 盛ん; người chăm chỉ 熱心; sở thích 趣味; lỗi hỏng thường xuyên 故障が多い.`,
  toan_q_2018_07_34: `Đáp án 2 — 区別（くべつ）là phân biệt hai hay nhiều thứ để nhận ra điểm khác nhau. 「意味のよく似ていることばを区別して覚える」: “Học cách phân biệt các từ có nghĩa gần giống nhau”.
1. Bạn học tiến lên đại học hoặc đi làm theo các hướng khác nhau: chia/ngả theo hướng là 分かれて進む.
2. Phân biệt các từ gần nghĩa để ghi nhớ: 区別する dùng đúng.
3. Lâu không gặp Ishikawa nên có thể không nhận ra: không nhận diện được người là 顔を見ても分からない・見分けられない.
4. Đất nước được phân biệt với nước khác bởi hai con sông: bị chia/cách ranh giới là 隔てられている・分けられている.
Ghi nhớ: 区別する phân biệt khái niệm; 見分ける nhận diện; 分かれる tách thành nhóm; 隔てる ngăn cách.`,
  toan_q_2018_07_35: `Đáp án 4 — 追いつく（おいつく）là đuổi kịp người/vật đang đi trước. 「妹より後に家を出たが駅の近くで追いついた」: “Tôi rời nhà sau em gái nhưng đã đuổi kịp em gần ga”.
1. Với tay không tới cuốn sách trên kệ: với tới là 手が届かない.
2. Tắc đường nên không “đuổi kịp” giờ họp: không kịp giờ là 会議に間に合わなかった.
3. Leo hơn năm giờ để đến điểm cao nhất: tới đỉnh là 山頂に着いた・登り着いた.
4. Rời nhà sau em nhưng bắt kịp em gần ga: 追いつく dùng đúng.
Ghi nhớ: 追いつく đuổi kịp người/vật; 届く với tới; 間に合う kịp giờ; 着く đến nơi.`,
  toan_q_2017_12_31: `Đáp án 1 — 減少（げんしょう）する là giảm về số lượng. 「図書室の利用者がかなり減少している」: “Số người sử dụng thư viện trường tôi đang giảm đáng kể”.
1. Số người sử dụng thư viện giảm: 利用者が減少する dùng đúng.
2. Giá giảm trong đợt sale: cách nói tự nhiên là 値段が下がる・安くなる.
3. Thành tích học giảm: nói 成績が下がる; 減少 dùng cho số lượng/thống kê.
4. Thu nhỏ hình còn một nửa: 半分に縮小してコピーする.
Ghi nhớ: số lượng 減少する; giá/điểm 下がる; kích thước 縮小する.`,
  toan_q_2017_12_32: `Đáp án 2 — 身につける（みにつける）là học và làm chủ kiến thức/kỹ năng. 「留学では多くの知識を身につけることができた」: “Trong thời gian du học, tôi đã tiếp thu được nhiều kiến thức”.
1. Có nhiều bạn bè: 友人がたくさんいる・友達ができた; không “mang bạn bè trên người”.
2. Tiếp thu kiến thức qua du học: 知識を身につける dùng đúng.
3. Hấp thụ chất dinh dưỡng: 栄養を取る・摂取する, không dùng 身につける.
4. Dắt chó đi dạo: 犬を連れて散歩する.
Ghi nhớ: kiến thức/kỹ năng 身につける; dinh dưỡng 摂取する; dẫn theo người/con vật 連れる.`,
  toan_q_2017_12_33: `Đáp án 3 — 中古（ちゅうこ）là đồ đã qua sử dụng. 「先輩から中古の冷蔵庫をもらった」: “Tôi nhận được chiếc tủ lạnh cũ từ đàn anh”.
1. Nhân viên năm thứ ba được tin cậy: nói 一人前 (đủ năng lực), không phải 中古.
2. Thông tin đã cũ: 古い・古くなった情報, không dùng 中古 cho tin tức.
3. Tủ lạnh đã qua sử dụng vẫn có thể dùng tốt: 中古の冷蔵庫 là cách nói chuẩn.
4. Tình bạn sau mười năm “trở thành đồ cũ”: quan hệ trở nên xa cách là 疎遠になった.
Ghi nhớ: 中古 dùng cho đồ đã qua sử dụng; 古い dùng rộng cho thông tin/đồ vật; 一人前 là người thành thạo.`,
  toan_q_2017_12_34: `Đáp án 4 — 断る（ことわる）là từ chối lời mời/yêu cầu. 「用事があるので誘いを断った」: “Tôi có việc nên đã từ chối lời rủ đi xem phim”.
1. Không từ bỏ ước mơ dù mọi người phản đối: từ bỏ là 夢を諦める; 断る không dùng với 夢.
2. Không ai “từ chối tin đồn”: nếu tin đồn không bị phủ nhận, nói うわさを否定しない.
3. Bỏ việc ở công ty để làm nông: từ chức/nghỉ việc là 会社を辞めた・退職した.
4. Từ chối lời mời đi xem phim vì bận: 誘いを断る dùng đúng.
Ghi nhớ: 断る từ chối đề nghị; 諦める từ bỏ mục tiêu; 否定する phủ nhận; 辞める nghỉ việc.`,
  toan_q_2017_12_35: `Đáp án 3 — 受け取る（うけとる）là nhận vật/tài liệu được gửi hoặc trao. 「送ってくださった資料は、本日確かに受け取りました」: “Hôm nay tôi đã nhận đủ tài liệu anh/chị gửi”.
1. Người cha “nhận” đứa trẻ chạy tới bằng hai tay: đỡ/bắt lấy người đang lao tới là 受け止める.
2. Nhà tôi “nhận” sinh viên homestay mỗi năm: tiếp nhận lưu trú là 受け入れる.
3. Nhận tài liệu được gửi: 受け取る dùng đúng.
4. Đỡ cánh tay người sắp ngã: 扶ける・支える (đỡ/hỗ trợ), không phải nhận một vật được trao.
Ghi nhớ: nhận đồ 受け取る; tiếp nhận khách/người 受け入れる; đỡ người đang ngã 受け止める・支える.`,
  toan_q_2017_07_31: `Đáp án 3 — 分類（ぶんるい）là phân loại theo đặc điểm/nhóm. 「本は内容によって分類され、番号が付けられている」: “Sách được phân loại theo nội dung và đánh số”.
1. Bốn mùa được chia thành xuân, hạ, thu, đông: dùng 分けられている; 分類 thường là phân loại đối tượng thành nhóm.
2. Trả tiền hàng thành ba đợt: 分割して払う (trả góp/chia đợt).
3. Sách thư viện được xếp loại theo nội dung: 分類する dùng đúng.
4. Đường có phần dành cho người đi bộ và xe hơi: được phân làn/chia thành 道路が分けられている.
Ghi nhớ: 分類 phân nhóm theo tiêu chí; 分ける chia/tách; 分割する chia thành nhiều phần.`,
  toan_q_2017_07_32: `Đáp án 4 — 引き受ける（ひきうける）là nhận đảm trách một công việc/yêu cầu. 「先輩から頼まれた仕事を引き受ける」: “Tôi quyết định nhận công việc đàn anh nhờ”.
1. Chấp nhận lời khuyên: lời khuyên được 受け入れる・聞き入れる; 引き受ける thường là việc/trách nhiệm.
2. Món ăn mang đặc trưng nhiều quốc gia: đặc trưng được 取り入れている.
3. Bị lây cảm cúm từ em: 風邪がうつった.
4. Nhận lời đảm nhiệm công việc: 仕事を引き受ける dùng đúng.
Ghi nhớ: nhận trách nhiệm/công việc 引き受ける; chấp nhận ý kiến 受け入れる; bệnh lây うつる.`,
  toan_q_2017_07_33: `Đáp án 2 — 滞在（たいざい）là lưu trú ở một nơi trong một khoảng thời gian. 「有名な作家がこのホテルに滞在していた」: “Nghe nói một nhà văn nổi tiếng từng lưu trú tại khách sạn này”.
1. Chim quý hiếm ở hồ: nơi sống của động vật là 生息している.
2. Nhà văn ở lại khách sạn: 滞在する dùng đúng.
3. Xe buýt đang ở trạm: xe đang dừng là バスが停車していた.
4. Chờ mưa tạnh ở quán cà phê: hiểu được, nhưng với quãng nghỉ ngắn tự nhiên hơn là 喫茶店で過ごす・待つ; 滞在 thường nói về lưu trú có thời lượng dài hơn. Cách dùng này kém tự nhiên, nên đáp án dự kiến là 2.
Ghi nhớ: 滞在 lưu trú; 生息 động vật sinh sống; 停車 xe dừng; 待つ・過ごす dùng cho lúc chờ/nghỉ ngắn.`,
  toan_q_2017_07_34: `Đáp án 1 — どきどき diễn tả tim đập thình thịch vì hồi hộp/sợ hãi hoặc phấn khích. 「大勢の前でスピーチをしたとき、胸がどきどきした」: “Khi phát biểu trước đông người, tim tôi đập thình thịch vì hồi hộp”.
1. Tim đập nhanh vì căng thẳng: 胸がどきどきする dùng đúng.
2. Tiếng đồng hồ “đập thình thịch”: đồng hồ tích tắc là 時計のチクタクする音.
3. Ở chỗ lạnh lâu, cơ thể “đập thình thịch”: cảm thấy lạnh/run là 体が冷える・震える.
4. Biển hiệu lay động vì gió mạnh: biển rung lắc là 看板が揺れる.
Ghi nhớ: hồi hộp どきどき; đồng hồ チクタク; run 震える; vật lay 揺れる.`,
  toan_q_2017_07_35: `Đáp án 2 — 枯れる（かれる）là cây/hoa khô héo vì thiếu nước hoặc hết mùa. 「水をやるのを忘れて、庭の花が枯れてしまった」: “Quên tưới hơn một tuần nên hoa trong vườn héo mất”.
1. Thịt cháy đen do lửa quá lớn: 焦げる・焼ける.
2. Hoa héo vì không được tưới: 花が枯れる dùng đúng.
3. Máy cũ có nhiều bộ phận “khô héo” nên không chạy: máy bị hỏng là 故障する・壊れる.
4. Tuyết tan khi trời ấm lên: 雪が解ける.
Ghi nhớ: cây khô héo 枯れる; đồ ăn cháy 焦げる; máy hỏng 故障する; tuyết tan 解ける.`,
  toan_q_2025_07_31: `Đáp án 3 — 減少（げんしょう）する là giảm về số lượng hoặc mức độ, thường dùng với 人口・数・量. 「この国の人口は今後減少するそうだ」 nghĩa là “Theo khảo sát, dân số nước này sẽ giảm trong thời gian tới”.
1. 「元気が減少している」: “Sức sống đang giảm”. Ý hiểu được nhưng khi nói em trai mất tinh thần sau trận thua, tự nhiên hơn là 元気がなくなった・落ち込んでいる.
2. 「気温が減少している」: “Nhiệt độ đang giảm”. Nhiệt độ giảm nói 気温が下がる・低下する; 減少 thường nói lượng/số giảm.
3. Dân số sẽ giảm: 人口が減少する là kết hợp chuẩn.
4. 「りんごの値段が減少した」: “Giá táo giảm”. Giá cả giảm nói 値段が下がる; số lượng táo giảm mới dùng 数が減少する.
Ghi nhớ: số lượng/dân số 減少する; nhiệt độ/giá 下がる・低下する; tinh thần sa sút 落ち込む.`,
  toan_q_2025_07_32: `Đáp án 4 — 重大（じゅうだい）là quan trọng và có ảnh hưởng lớn, thường đi với 発表・問題・事件. 「社長から重大な発表がある」 nghĩa là “Nghe nói ngày mai giám đốc sẽ có một thông báo quan trọng”.
1. 「重大な顔」: “Khuôn mặt quan trọng”. Vẻ mặt nghiêm túc khi nghe giáo viên nói là 真剣な顔.
2. 「重大な指輪」: “Chiếc nhẫn quan trọng”. Nhẫn quý/được trân trọng là 大切な指輪.
3. 「重大な経験」: “Trải nghiệm quan trọng”. Trải nghiệm quý báu, có giá trị là 貴重な経験.
4. Thông báo có ảnh hưởng lớn của giám đốc: 重大な発表 dùng đúng.
Ghi nhớ: 重大 là mức độ quan trọng/nghiêm trọng của sự việc; 大切 là thứ được trân trọng; 真剣 là thái độ nghiêm túc; 貴重 là quý hiếm/quý giá.`,
  toan_q_2025_07_33: `Đáp án 2 — ばらばらになる là các vật vốn rời nhau bị tản ra, nằm lộn xộn. 「床に落としてしまい、資料がばらばらになってしまった」 nghĩa là “Tôi làm rơi tài liệu xuống sàn nên chúng văng tung tóe”.
1. 「アイスクリームがばらばらになった」: “Kem bị tách thành mảnh”. Kem để ngoài tủ lạnh sẽ tan chảy, nên nói 溶けてしまった.
2. Tài liệu rơi xuống sàn và văng ra nhiều phía: ばらばらになる diễn tả đúng.
3. 「暖かい空気がばらばらになった」: “Không khí ấm bị tản thành mảnh”. Không khí ấm trong phòng thoát ra khi mở cửa thì nói 外に出ていった・逃げてしまった.
4. 「ジュースがばらばらになった」: “Nước quả bị tách rời”. Nước trong cốc đổ ra thì nói こぼれてしまった.
Ghi nhớ: giấy/vật rời bị tản ra là ばらばら; chất lỏng đổ là こぼれる; kem tan là 溶ける.`,
  toan_q_2025_07_34: `Đáp án 1 — 皮（かわ）là lớp vỏ ngoài của rau, củ hoặc quả. 「皮をむかないで、そのままゆでます」 nghĩa là “Không gọt vỏ khoai tây mà luộc nguyên như vậy”.
1. Khoai tây có thể được luộc nguyên vỏ: 皮をむく là gọt vỏ, dùng đúng.
2. 「パソコンの皮」: “Vỏ da của máy tính”. Vỏ ngoài/ốp máy tính thường gọi là 外装・カバー; đồ điện không có 皮.
3. 「卵の皮」: “Vỏ trứng”. Vỏ cứng của trứng là 殻（から）, không phải 皮.
4. 「テキストの皮」: “Lớp vỏ của sách giáo khoa”. Bìa sách là 表紙（ひょうし）.
Ghi nhớ: 皮 là vỏ mềm của rau quả; 殻 là vỏ cứng như trứng; 表紙 là bìa sách; máy móc thường có カバー・外装.`,
  toan_q_2025_07_35: `Đáp án 3 — オーダーする là gọi/đặt món hoặc đặt hàng. 「食事の後にデザートをオーダーした」 nghĩa là “Sau bữa ăn, tôi gọi món tráng miệng”.
1. 「医者からオーダーされた」: “Được bác sĩ ra lệnh”. Bác sĩ dặn/tư vấn tập thể dục thì dùng 指示された・勧められた.
2. 「妹に掃除をオーダーした」: “Đặt hàng em gái dọn phòng”. Giao/nhờ em làm việc dùng 頼んだ・指示した; オーダーする không tự nhiên với mệnh lệnh trong gia đình.
3. Gọi món tráng miệng ở nhà hàng: オーダーする là cách dùng đúng.
4. 「選手たちに優勝してほしいとオーダーした」: “Ra lệnh các vận động viên phải vô địch”. Nói mong họ vô địch là 優勝してほしいと期待した・伝えた; オーダーする không diễn đạt kỳ vọng này.
Ghi nhớ: món/đồ đặt mua là オーダーする; nhờ ai làm là 頼む; chỉ thị là 指示する; kỳ vọng là 期待する.`,
  toan_q_2021_07_31: `Đáp án 2 — オーバーする là vượt quá một giới hạn, dự toán hoặc mức đã định. 「1万円もオーバーしてしまった」 nghĩa là “Tôi đã lỡ chi vượt ngân sách tới 10.000 yên”.
1. 「出発時間がオーバーになった」: “Giờ khởi hành bị vượt quá”. Chuyến bay khởi hành muộn nói 出発時間が遅れた・出発が遅れた.
2. Không tìm được món nào rẻ nên số tiền vượt ngân sách 10.000 yên: 予算を１万円オーバーする dùng đúng.
3. 「頭がオーバーになった」: “Đầu bị quá mức”. Nghĩ quá nhiều đến mức rối trí nói 頭がいっぱいになった.
4. 「料理がオーバーして」: “Món ăn vượt quá”. Có quá nhiều món/ăn không hết nói 料理が多すぎて、もう食べられない.
Ghi nhớ: オーバーする đi với ngân sách, thời lượng hoặc giới hạn; giờ bị muộn là 遅れる; đồ ăn quá nhiều là 多すぎる.`,
  toan_q_2021_07_32: `Đáp án 1 — 欠点（けってん）là nhược điểm, mặt chưa tốt của người/vật/địa điểm. 「駅から遠いという欠点がある」 nghĩa là “Nơi này có cảnh đẹp nhưng có nhược điểm là xa nhà ga”.
1. Cảnh đẹp nhưng xa ga là một điểm bất lợi: 欠点がある dùng đúng.
2. 「栄養に欠点が出ないように」: “Để nhược điểm không xuất hiện trong dinh dưỡng”. Muốn nói bữa ăn đủ chất, dùng 栄養が不足しないように.
3. 「車に欠点がついた」: “Khuyết điểm dính lên xe”. Xe bị trầy xước thì nói 車に傷がついた.
4. 「メールアドレスに欠点がないか」: “Kiểm tra xem địa chỉ email có khuyết điểm không”. Kiểm tra lỗi đánh máy là 間違い・ミスがないか確認する.
Ghi nhớ: 欠点 là nhược điểm; 栄養不足 là thiếu dinh dưỡng; 傷 là vết xước; 間違い là lỗi.`,
  toan_q_2021_07_33: `Đáp án 4 — 親しい（したしい）là thân thiết, có quan hệ gần gũi với người khác. 「近くにまだ親しい人はいない」 nghĩa là “Tôi mới chuyển đến nên quanh đây chưa có người nào thân quen”.
1. 「数学より理科の方が親しかった」: “Tôi thân thiết với môn khoa học tự nhiên hơn toán”. Với môn học mình giỏi, nói 理科の方が得意だった; 親しい dùng chủ yếu cho quan hệ với người.
2. 「親しい道」: “Con đường thân thiết”. Con đường gần/quen thuộc nói 近い道・よく知っている道; 親しい không bổ nghĩa tự nhiên cho 道.
3. 「友達と会って、親しかった」: “Gặp bạn rồi thân thiết”. 親しい mô tả mối quan hệ đã có, không phải kết quả của việc gặp lại; có thể nói 久しぶりに会った友達と楽しく話した.
4. Người mới chuyển nhà chưa có ai thân thiết ở gần: 親しい人 dùng đúng.
Ghi nhớ: 親しい人/友人 = người/bạn thân thiết; 得意 là giỏi một môn; 近い là gần; 知っている là quen thuộc/biết rõ.`,
  toan_q_2021_07_34: `Đáp án 1 — 詰める（つめる）là xếp/nhét đồ vào túi, hộp hoặc khoảng chứa sao cho đầy. 「かばんに洋服やお土産を詰めた」 nghĩa là “Tôi xếp quần áo và quà lưu niệm vào túi trước khi về nước”.
1. Xếp quần áo và quà vào túi: かばんに詰める là cách dùng đúng.
2. 「テーブルに食器を２枚詰めて」: “Nhét hai chiếc bát đĩa lên bàn”. Bày bát đĩa lên bàn dùng 並べる・置く.
3. 「大切なことをノートに詰めた」: “Nhét điều quan trọng vào vở”. Ghi điều quan trọng vào vở dùng 書き留めた・メモした.
4. 「ポケットに手を詰めて」: “Nhét bàn tay vào túi áo”. Cho tay vào túi là ポケットに手を入れる.
Ghi nhớ: xếp đồ vào vật chứa là 詰める; bày ra là 並べる; ghi lại là 書き留める; đưa tay vào là 入れる.`,
  toan_q_2021_07_35: `Đáp án 3 — 支給（しきゅう）する là cấp phát hoặc chi trả cho người nhận theo quy định, thường dùng trong quan hệ công ty, cơ quan hoặc tổ chức. 「交通費を支給してくれる」 nghĩa là “Công ty này chi trả tiền đi lại từ nhà đến công ty”.
1. 「プレゼントを支給しよう」: “Định cấp phát quà sinh nhật cho mẹ”. Tặng quà cá nhân dùng プレゼントを贈る・あげる.
2. 「レポートを支給しに行く」: “Đi cấp phát bài báo cáo cho giáo viên”. Nộp báo cáo dùng レポートを提出する.
3. Công ty chi trả tiền đi lại cho nhân viên: 交通費を支給する là cách dùng đúng.
4. 「お釣りを支給してもらう」: “Được cấp phát tiền thừa”. Khi nhận tiền thối lại ở cửa hàng, dùng お釣りを受け取る.
Ghi nhớ: tổ chức cấp tiền/phụ cấp là 支給する; tặng quà là 贈る; nộp bài là 提出する; nhận tiền là 受け取る.`,
  toan_q_2016_12_31: `Đáp án 3 — 急に（きゅうに）là đột nhiên, bất ngờ. 「部屋から急に人が飛び出してきた」: “Một người đột nhiên lao ra khỏi phòng nên suýt va vào tôi”.
1. Làm món ăn “đột nhiên” bằng lò vi sóng: nói 簡単にできる (làm dễ dàng/nhanh chóng), không phải 急に.
2. Tàu sắp chạy sau 10 phút nên “đột nhiên” hướng tới ga: người đang vội cần 急いで駅に向かった; 急に không diễn tả chạy nhanh có chủ ý.
3. Người bất ngờ lao ra khỏi phòng: 急に飛び出す đúng nghĩa đột ngột.
4. Mới mua game nên “đột nhiên” chơi thử: ý là vừa về nhà liền chơi, dùng すぐにやってみた.
Ghi nhớ: 急に = đột nhiên; 急いで = vội vàng; すぐに = ngay lập tức.`,
  toan_q_2016_12_32: `Đáp án 2 — 沸騰（ふっとう）する là sôi sùng sục, dùng cho chất lỏng được đun nóng. 「鍋のお湯が沸騰したら、とうふを入れて」: “Khi nước trong nồi sôi, hãy cho đậu phụ vào”.
1. Nhiệt độ ngoài trời tăng cao: 気温が上がる・高くなる, không nói nhiệt độ sôi.
2. Nước trong nồi sôi rồi cho đậu phụ vào: お湯が沸騰する dùng đúng.
3. Cơn sốt tăng: 熱が上がる・高くなる; 沸騰する chỉ chất lỏng sôi.
4. Lò sưởi “sôi nhanh”: lò khởi động/ấm lên nhanh là すぐに暖まる.
Ghi nhớ: nước sôi 沸騰する; nhiệt độ/sốt tăng 上がる; căn phòng ấm lên 暖まる.`,
  toan_q_2016_12_33: `Đáp án 2 — 曲げる（まげる）là làm cho vật/người đổi từ thẳng sang cong. 「腕を伸ばしたり曲げたりすると、まだ少し痛む」: “Duỗi hoặc gập cánh tay thì vẫn còn hơi đau”.
1. Quàng khăn quanh cổ: マフラーを首に巻く.
2. Duỗi rồi gập cánh tay: 腕を曲げる dùng đúng.
3. Bẻ đôi ổ bánh mì: nếu tách thành hai phần, nói 半分に割る・ちぎる; 曲げる là làm cong chứ không chia đôi.
4. Gấp áo gọn trước khi cất vào ngăn kéo: シャツを畳む.
Ghi nhớ: 曲げる làm cong/gập; 巻く quấn; 割る・ちぎる chia/bẻ; 畳む gấp quần áo.`,
  toan_q_2016_12_34: `Đáp án 1 — 出張（しゅっちょう）là đi công tác theo nhiệm vụ công việc. 「営業のため、来週一週間、課長とアメリカに出張します」: “Tuần sau tôi đi công tác ở Mỹ một tuần cùng trưởng phòng để làm kinh doanh”.
1. Đi Mỹ theo công việc bán hàng: 出張する dùng đúng.
2. Nghỉ việc rồi đi nước ngoài với gia đình: chuyến đi nghỉ là 旅行する.
3. Đi công ty lúc 9 giờ mỗi sáng: đi làm/đi làm hằng ngày là 出勤する・通勤する.
4. Đi dự hội thao của con: đi tham dự là 参加する・行く.
Ghi nhớ: đi công tác 出張; đi du lịch 旅行; đến nơi làm 出勤; đi dự sự kiện 参加.`,
  toan_q_2016_12_35: `Đáp án 3 — 慰める（なぐさめる）là an ủi người đang buồn/thất vọng. 「仕事で失敗したが、友人が慰めてくれたので元気が出た」: “Tôi thất bại trong công việc nhưng được bạn an ủi nên đã lấy lại tinh thần”.
1. Dùng đồ cũ trong thời gian dài: 大切に使う・長く使う, không phải 慰める.
2. Cổ vũ vận động viên mong họ vô địch: 応援する.
3. An ủi bạn sau thất bại: 友人を慰める dùng đúng.
4. Cả nhà ăn ngoài để chúc mừng em đỗ đại học: 祝う・お祝いする.
Ghi nhớ: người buồn được 慰める; cổ vũ 応援する; chúc mừng 祝う.`,
  toan_q_2016_07_31: `Đáp án 3 — 性格（せいかく）là tính cách của một người. 「妹はおしゃべり好きな性格が似ている」: “Tính thích nói chuyện của em gái tôi giống với tôi”.
1. Bài hát có “tính cách tươi sáng”: bài hát có giai điệu/vẻ tươi sáng là 明るい曲.
2. Từ nhỏ chạy nhanh là “tính cách”: đây là năng khiếu/khả năng, nói 足が速かった・走るのが得意だった.
3. Hai chị em có tính thích trò chuyện giống nhau: 性格が似ている dùng đúng.
4. Nhà hàng có “tính cách yên tĩnh”: không gian nhà hàng yên tĩnh là 静かな雰囲気のレストラン.
Ghi nhớ: 性格 là nét tính cách con người; 雰囲気 là không khí/nét của nơi chốn; 得意 là sở trường.`,
  toan_q_2016_07_32: `Đáp án 1 — 募集（ぼしゅう）する là công khai mời người đăng ký/tham gia. 「駅前のスーパーでアルバイトを募集している」: “Siêu thị trước ga đang tuyển nhân viên bán thời gian”.
1. Siêu thị đang tuyển người làm thêm: アルバイトを募集する dùng đúng.
2. Sưu tầm tem cổ: 切手を集める・収集する.
3. Sau này sẽ “tuyển” tài liệu: thu thập/phát tài liệu tùy ý là 集める・配る.
4. “Tuyển” rác trong phòng rồi bỏ vào thùng: dọn/gom rác là ごみを集める・片付ける.
Ghi nhớ: 募集 mời người/tác phẩm đăng ký; 集める gom đồ; 収集する sưu tầm.`,
  toan_q_2016_07_33: `Đáp án 4 — 似合う（にあう）là hợp với ngoại hình/phong cách của người hoặc vật. 「その白い帽子、池田さんによく似合っていますね」: “Chiếc mũ trắng đó rất hợp với chị Ikeda”.
1. Động tác nhảy không “hợp” với mọi người: nhảy không đồng bộ là 動きが合わない・そろわない.
2. Hai người không “hợp” ý kiến: ý kiến bất đồng là 意見が合わない.
3. Ngày thứ Tư hợp với lịch của mọi người: lịch khớp là 予定が合う.
4. Mũ trắng hợp với Ikeda: 人に服・帽子が似合う dùng đúng.
Ghi nhớ: đồ hợp với người 似合う; lịch/ý kiến trùng khớp 合う; động tác đồng bộ そろう.`,
  toan_q_2016_07_34: `Đáp án 1 — 消費（しょうひ）する là tiêu thụ/sử dụng tài nguyên, năng lượng hoặc hàng hóa. 「電気などのエネルギーを大量に消費して生活している」: “Chúng ta sinh hoạt bằng cách tiêu thụ lượng lớn năng lượng như điện”.
1. Tiêu thụ nhiều năng lượng khi sinh hoạt: エネルギーを消費する dùng đúng.
2. Có nhiều việc phải “tiêu thụ” hôm nay: hoàn thành công việc là 仕事を済ませる・片付ける.
3. Thông tin trong máy tính bị “tiêu thụ”: thông tin bị xóa là 消去された・失われた.
4. Thức ăn được “tiêu thụ” trong dạ dày: thức ăn được tiêu hóa là 消化される.
Ghi nhớ: tài nguyên/hàng hóa 消費する; thông tin 消去する; thức ăn 消化する.`,
  toan_q_2016_07_35: `Đáp án 2 — 空（から）là rỗng, không còn thứ gì bên trong. 「飲み終わって空になったペットボトル」: “Chai nhựa đã uống hết và trở nên rỗng”, dùng đúng.
1. Trà không thêm đường/sữa: gọi là ストレートティー・何も入れていない紅茶, không phải 空の紅茶.
2. Chai đã uống hết và rỗng: 空になったペットボトル dùng đúng.
3. Lịch tuần sau kín hết nên “không có ngày rỗng”: ngày còn trống nói 空いている日.
4. Không có kinh nghiệm làm việc này: 未経験・経験がない.
Ghi nhớ: vật rỗng 空; lịch trống 空いている; chưa có kinh nghiệm 未経験; trà nguyên vị ストレート.`,
  toan_q_2015_12_31: `Đáp án 3 — 修理（しゅうり）là sửa máy móc/đồ vật bị hỏng. 「洗濯機が動かなくなったので、修理してください」: “Máy giặt không chạy nữa, xin hãy sửa giúp”.
1. Làm hòa và “sửa” mối quan hệ: 仲直りする・関係を修復する.
2. Chỉnh phát âm tiếng Nhật: 発音を直す・矯正する.
3. Máy giặt hỏng cần sửa: 修理する dùng đúng.
4. Bị thương ở tay và được bác sĩ “sửa”: chữa trị là 治療する.
Ghi nhớ: sửa đồ hỏng 修理; điều trị 治療; sửa phát âm 直す; làm hòa 仲直り.`,
  toan_q_2015_12_32: `Đáp án 1 — 親しい（したしい）là thân thiết với một người. 「一緒に食事をしてから親しくなった」: “Tôi trở nên thân thiết với Mori sau khi cùng ăn một bữa”.
1. Cùng ăn rồi trở nên thân: 親しくなる dùng đúng.
2. Quen với công việc mới: 仕事に慣れる, không phải 親しくなる.
3. Áo khoác ấm, thiết kế đẹp nên “rất thân”: áo khoác hợp/được yêu thích là 気に入っている.
4. Quen với các loại xe nhờ đọc sách: xe là đối tượng kiến thức, nói よく知っている・詳しい.
Ghi nhớ: thân với người 親しい; quen việc 慣れる; thích món đồ 気に入る; am hiểu chủ đề 詳しい.`,
  toan_q_2015_12_33: `Đáp án 4 — 締め切り（しめきり）là hạn cuối để nộp/đăng ký. 「大会に申し込む人は、明日が締め切り」: “Người đăng ký cuộc thi phát biểu cần nhớ ngày mai là hạn cuối”.
1. Ga tiếp theo là ga cuối: 終点・終着駅.
2. Bộ phim kết thúc hôm nay: 最終回・最終日.
3. Vận động viên chạy về “hạn cuối” ở mốc 40 km: đích đến là ゴール.
4. Ngày mai là hạn cuối đăng ký: 締め切り dùng đúng.
Ghi nhớ: hạn nộp 締め切り; điểm cuối tuyến 終点; kết thúc chương trình 最終回; đích chạy ゴール.`,
  toan_q_2015_12_34: `Đáp án 2 — ゆでる là luộc thực phẩm trong nước nóng. 「鍋に野菜を入れて、5分ゆでた」: “Cho rau vào nồi nước và luộc năm phút”.
1. Ngâm mình trong bồn nước nóng: お風呂に入る・体を温める.
2. Luộc rau trong nồi nước: ゆでる dùng đúng.
3. Bật lò sưởi để làm ấm phòng: 部屋を暖める.
4. Hâm trà nguội bằng lò vi sóng: 温める; không đun trà bằng cách ゆでる.
Ghi nhớ: luộc thức ăn ゆでる; hâm/ủ ấm 温める; làm ấm phòng 暖める.`,
  toan_q_2015_12_35: `Đáp án 2 — 渋滞（じゅうたい）là xe cộ ùn tắc khiến lưu thông chậm/đứng. 「朝の通勤時間になると道が渋滞して、車が前に進まない」: “Đến giờ đi làm buổi sáng, đường tắc khiến ô tô không tiến lên được”.
1. Xe buýt đầy người không lên được: xe buýt chật kín là バスが満員・混雑している.
2. Đường tắc và xe không đi tiếp: 道が渋滞する dùng đúng.
3. Lịch trình kín vì có nhiều chuyến công tác/cuộc họp: 予定が詰まっている.
4. Nghe nhiều việc cùng lúc khiến đầu óc rối: 頭が混乱する・いっぱいになる; 渋滞 là ẩn dụ kém tự nhiên ở đây.
Ghi nhớ: xe/đường ùn 渋滞; phương tiện đông 満員; lịch dày 詰まる; đầu óc rối 混乱する.`,
  toan_q_2015_07_31: `Đáp án 2 — 移動（いどう）là di chuyển người/vật từ vị trí này sang vị trí khác. 「名前を呼ばれた人は、隣の部屋に移動してください」: “Ai được gọi tên hãy di chuyển sang phòng bên cạnh”.
1. Tin tức lan khắp thế giới trên Internet: 情報が世界中に広まる・伝わる.
2. Người được gọi tên chuyển sang phòng kế bên: 移動する dùng đúng.
3. Kim đồng hồ không “di chuyển”: kim đứng yên là 時計の針が動いていなかった.
4. Cảm cúm của em gái “di chuyển” sang tôi: bệnh lây là 風邪がうつる.
Ghi nhớ: người/vật di chuyển 移動; tin lan 伝わる; kim chạy 動く; bệnh lây うつる.`,
  toan_q_2015_07_32: `Đáp án 1 — 預ける（あずける）là gửi vật/người cho nơi/người khác trông giữ. 「受付に荷物を預けて出かけた」: “Tôi gửi hành lý ở quầy lễ tân rồi đi ra ngoài”.
1. Gửi hành lý ở quầy khi chưa nhận phòng: 荷物を預ける dùng đúng.
2. Chủ nhà cho sinh viên thuê phòng: phòng được 貸す, người thuê 借りる.
3. Cất thức ăn thừa trong tủ lạnh: 冷蔵庫に入れておく・保存する.
4. Sáng nay có 10.000 yên trong ví rồi tiêu gần hết: tiền nằm trong ví là 財布に入れておいた; 預ける là giao cho người/nơi giữ.
Ghi nhớ: nhờ giữ 預ける; cho thuê 貸す; cất vào 入れる; tự giữ tiền trong ví 入れておく.`,
  toan_q_2015_07_33: `Đáp án 3 — 新鮮（しんせん）là tươi, mới hái/mới đánh bắt; cũng có thể chỉ cảm giác mới mẻ. 「スーパーでは新鮮な野菜を売っている」: “Siêu thị bán rau tươi”.
1. Tên lửa dùng “công nghệ tươi”: nói 最新の技術 (công nghệ mới nhất).
2. CD mới phát hành là CD mới: 新発売のCD・新しいCD.
3. Rau còn tươi ở siêu thị: 新鮮な野菜 dùng đúng.
4. Nhân viên mới vào là 新人; không gọi 新鮮な社員.
Ghi nhớ: thực phẩm tươi 新鮮; công nghệ mới nhất 最新; nhân viên mới 新人.`,
  toan_q_2015_07_34: `Đáp án 4 — 清潔（せいけつ）là sạch sẽ, không bẩn. 「部屋はよく掃除されていて清潔だ」: “Phòng được dọn kỹ và sạch sẽ”.
1. Giọng trẻ em rất “sạch”: giọng trong trẻo là 澄んでいる・きれいな声.
2. Thiên nhiên còn nguyên vẹn vì ít người đến: 自然が豊か・手つかずの自然.
3. Bơi xong cảm thấy “sạch sẽ về tâm trạng”: cảm thấy sảng khoái là さっぱりした気持ち.
4. Phòng khách sạn được lau dọn sạch: 清潔な部屋 dùng đúng. Lựa chọn này mang số 4 trong bản dữ liệu.
Ghi nhớ: 清潔 là sạch về vệ sinh; 澄んだ声 là giọng trong; 自然が豊か là thiên nhiên phong phú.`,
  toan_q_2015_07_35: `Đáp án 2 — 混ぜる（まぜる）là trộn hai hay nhiều vật/chất với nhau. 「赤と白の絵の具を混ぜて、ピンク色を作った」: “Trộn màu đỏ với trắng để tạo màu hồng”.
1. Cộng tiền làm thêm với tiền tiết kiệm để đủ đi du lịch: 合わせる・足す (gộp/cộng tiền), không phải trộn vật chất.
2. Trộn màu đỏ và trắng: 絵の具を混ぜる dùng đúng.
3. Gộp sức của hai người: 力を合わせる・協力する.
4. Hai ngân hàng hợp thành ngân hàng mới: 銀行が合併する.
Ghi nhớ: trộn nguyên liệu 混ぜる; cộng/gộp nguồn lực 合わせる; công ty/ngân hàng sáp nhập 合併する.`,
  toan_q_2014_12_31: `Đáp án 2 — たまる／貯まる（たまる）là tích tụ hoặc dành dụm dần. 「もう少しお金がたまったら、旅行に行こう」: “Khi để dành thêm được chút tiền, tôi sẽ đi du lịch”.
1. Sinh viên tụ lại ở hội trường nghe diễn thuyết: 人が集まる.
2. Tiền dành dụm được thêm thì đi du lịch: お金がたまる dùng đúng.
3. Sau khi lên TV, độ nổi tiếng tăng: 人気が高まる・出る.
4. Đường mới làm xong, cửa hàng xuất hiện nhiều: 店が増える・できる.
Ghi nhớ: tiền/nước/chất tích lại たまる; người tụ tập 集まる; mức độ tăng 高まる; số lượng tăng 増える.`,
  toan_q_2014_12_32: `Đáp án 3 — 縮小（しゅくしょう）する là làm giảm kích thước/quy mô. 「写真が少し大きいので、コピーするときに縮小してください」: “Ảnh hơi lớn nên khi photocopy hãy thu nhỏ lại”.
1. Giảm âm lượng/giọng nói: 声を小さくする.
2. Cục tẩy nhỏ đi sau khi viết sửa nhiều lần: 消しゴムが小さくなる・減る.
3. Thu nhỏ ảnh khi sao chụp: 縮小する dùng đúng.
4. Hết hứng thú với trò chơi: 興味が薄れる・なくなる.
Ghi nhớ: ảnh/quy mô 縮小; âm lượng 小さくする; vật nhỏ dần 小さくなる; hứng thú giảm 薄れる.`,
  toan_q_2014_12_33: `Đáp án 1 — 制限（せいげん）là giới hạn/quy định phạm vi hoặc số lượng. 「この乗り物に乗れる人数には10人までという制限がある」: “Phương tiện này giới hạn tối đa 10 hành khách”.
1. Quy định sức chứa tối đa 10 người: 人数に制限がある dùng đúng.
2. Bài tập phải nộp ngày mai: hạn nộp là 締め切り.
3. Không chạy hết marathon vì thiếu thể lực: 体力が足りなかった・限界だった.
4. Tiếng Nhật chưa tốt nên không nói được nhiều: 日本語の力・能力が足りない.
Ghi nhớ: giới hạn quy định 制限; hạn cuối 締め切り; sức lực chạm giới hạn 限界; năng lực 能力.`,
  toan_q_2014_12_34: `Đáp án 2 — 話しかける（はなしかける）là chủ động bắt chuyện với ai. 「列車の中で近くの人にその国の言葉で話しかけてみた」: “Tôi thử bắt chuyện bằng ngôn ngữ nước đó với người ngồi gần trên tàu”.
1. Báo tên và mã đặt chỗ ở quầy: 伝える・言う; không bắt chuyện với thông tin.
2. Chủ động nói chuyện với người gần mình: 人に話しかける dùng đúng.
3. Sắp nói về lịch tuần sau cho mọi người nghe: 説明します・話します.
4. Nhờ du học sinh kể điều bất ngờ khi đến Nhật: 話してもらう・聞かせてもらう.
Ghi nhớ: bắt chuyện với người 話しかける; thông báo nội dung 伝える; nói/giải thích 話す; nghe kể 聞かせてもらう.`,
  toan_q_2014_12_35: `Đáp án 4 — 離す（はなす）là tách/để cách xa một vật. 「燃えやすい容器は火から離して置いてください」: “Hãy đặt vật chứa dễ cháy cách xa ngọn lửa”.
1. Tháo bóng đèn để thay bóng mới: 電球を外す・取り外す.
2. Tháo đồng hồ trước khi tắm: 腕時計を外す.
3. Hút bụi vụn trên sàn: ごみを掃除機で吸い取る.
4. Đặt bình dễ cháy cách xa lửa: 火から離す dùng đúng.
Ghi nhớ: giữ khoảng cách 離す; tháo đồ 外す; hút bụi 吸い取る.`,
  toan_q_2013_12_31: `Đáp án 3 — 早退（そうたい）là rời trường/nơi làm trước giờ tan vì lý do riêng. 「病院に行かなければいけないので、会社を早退した」: “Tôi phải đến bệnh viện vào buổi tối nên đã rời công ty sớm”.
1. Rời rạp phim giữa chừng: thường nói 映画館を途中で出た・帰った; 早退 dành cho trường/công việc.
2. Vận động viên rời trận giữa chừng vì chấn thương: 試合を途中で退場した・棄権した.
3. Rời công ty trước giờ tan để đi bệnh viện: 会社を早退する dùng đúng.
4. Dự kiến nằm viện một tuần nhưng ra viện sau năm ngày: 退院する.
Ghi nhớ: nghỉ học/làm sớm 早退; ra viện 退院; rời trận 退場・棄権.`,
  toan_q_2013_12_32: `Đáp án 2 — 進歩（しんぽ）là sự tiến bộ về kỹ thuật/năng lực. 「科学技術が進歩して、人々の生活は便利になった」: “Khoa học kỹ thuật tiến bộ khiến đời sống tiện lợi hơn”.
1. Rau phát triển tốt nhờ có nắng: 野菜がよく育つ.
2. Khoa học công nghệ tiến bộ: 科学技術が進歩する dùng đúng.
3. Thể lực tăng lên nhờ chạy bộ: 体力がついた・向上した.
4. Điểm tiếng Nhật tăng lên: 成績が上がった・よくなった.
Ghi nhớ: tiến bộ chung 進歩; cây lớn 育つ; sức lực/năng lực tăng 向上する; điểm tăng 上がる.`,
  toan_q_2013_12_33: `Đáp án 4 — 余る（あまる）là còn dư sau khi đã phân chia/dùng. 「欠席した人がいたので、資料が何人分か余っている」: “Có người vắng nên còn thừa tài liệu cho vài người”.
1. Chỉ còn ba ngày đến hạn báo cáo: thời gian còn lại là あと3日しかない; 余る không dùng cho thời gian đếm ngược.
2. Uống thuốc đỡ hơn nhưng vẫn còn sốt: 熱が残っている.
3. Dọn phòng rồi không còn rác: ごみが残っていない・ない.
4. Tài liệu dư do người nghỉ học: 資料が余る dùng đúng.
Ghi nhớ: đồ/số lượng còn dư 余る; triệu chứng còn lại 残る; thời hạn còn lại あと何日.`,
  toan_q_2013_12_34: `Đáp án 3 — 効果（こうか）là tác dụng/kết quả do biện pháp tạo ra. 「広告の効果があったようで、今月はお客さんが多かった」: “Có vẻ quảng cáo phát huy hiệu quả vì tháng này khách đông”.
1. Nhờ bạn giúp nên việc chuyển nhà xong sớm: 助けのおかげで・助けられて.
2. Mắt kém đi do tuổi tác: tuổi tác là 原因 (nguyên nhân), không phải 効果.
3. Quảng cáo đem lại kết quả là có thêm khách: 効果がある dùng đúng.
4. Mệt mỏi hôm qua “phát huy tác dụng” khiến sáng nay khó dậy: hậu quả là 疲れが残った・疲れが出た.
Ghi nhớ: biện pháp có 効果; nguyên nhân 原因; mệt mỏi còn lại 疲れが残る.`,
  toan_q_2013_12_35: `Đáp án 1 — こぼす là làm đổ/tràn chất lỏng. 「机の上にジュースをこぼして、ノートを汚した」: “Tôi làm đổ nước trái cây lên bàn và làm bẩn vở”.
1. Làm đổ nước trái cây: ジュースをこぼす dùng đúng.
2. Mồ hôi chảy khi chờ tàu: 汗をかく・汗が出る, không nói 汗をこぼす.
3. Làm rơi điện thoại khỏi túi: 携帯電話を落とす.
4. Kẹp giấy tuột nên giấy rơi xuống sàn: 書類を落とす・ばらまく.
Ghi nhớ: chất lỏng đổ こぼす; người đổ mồ hôi 汗をかく; làm rơi đồ 落とす.`,
  toan_q_2013_07_31: `Đáp án 3 — 建設（けんせつ）là xây dựng công trình lớn như sân bay, cầu, tòa nhà. 「ここに新しい空港が建設される予定です」: “Dự kiến xây sân bay mới ở đây”.
1. Tự làm tủ sách: 本棚を作る・組み立てる.
2. Đặt thêm ghế dài ở công viên: ベンチを設置する・置く.
3. Sân bay mới dự kiến được xây: 建設する dùng đúng.
4. Nhà máy đóng tàu: tàu được 造る・建造する.
Ghi nhớ: xây hạ tầng 建設; lắp/đặt 設置; lắp ráp vật dụng 組み立て; đóng tàu 建造.`,
  toan_q_2013_07_32: `Đáp án 3 — 身につける（みにつける）là tiếp thu và làm chủ kiến thức/kỹ năng. 「専門学校で技術を身につけて、いい会社に入りたい」: “Tôi muốn học vững kỹ năng ở trường chuyên môn rồi vào công ty tốt”.
1. Mang trong mình mong muốn làm việc ở nước ngoài: 希望を持っている.
2. Được mọi người kính trọng: 尊敬を集めた・尊敬されている.
3. Học được nhiều kỹ thuật: 技術を身につける dùng đúng.
4. Ghi nhớ mặt và tên của mọi người: 顔と名前を覚える.
Ghi nhớ: kỹ năng/kiến thức 身につける; có mong muốn 希望を持つ; được kính trọng 尊敬される; ghi nhớ 覚える.`,
  toan_q_2013_07_33: `Đáp án 1 — 発生（はっせい）là phát sinh/xảy ra, dùng với khí, sự cố hoặc hiện tượng. 「二つの洗剤を混ぜると危険なガスが発生する」: “Trộn hai loại chất tẩy rửa sẽ phát sinh khí độc”.
1. Khí nguy hiểm sinh ra khi trộn hóa chất: ガスが発生する dùng đúng.
2. Trường đại học “sinh ra” nhiều nhà nghiên cứu: trường đào tạo/đưa ra nhà nghiên cứu là 研究者を輩出する.
3. Nhiều cửa hàng mới “phát sinh” quanh ga: cửa hàng mở ra là 店ができた・増えた.
4. Cây nở nhiều hoa trắng vào mùa xuân: 花が咲く.
Ghi nhớ: khí/sự cố 発生する; trường đào tạo nhân tài 輩出する; cửa hàng mở できる; hoa nở 咲く.`,
  toan_q_2013_07_34: `Đáp án 2 — 握る（にぎる）là nắm chặt bằng tay. 「ロープを強く握っていたせいで、手が赤くなった」: “Vì nắm dây thừng quá chặt nên tay bị đỏ”.
1. Túi được “nắm chặt bằng dây”: buộc chặt là ひもで固く結ぶ.
2. Nắm mạnh sợi dây: ロープを握る dùng đúng.
3. Dùng đũa thì món ăn “khó nắm”: gắp được hay không nói つかみにくい・食べにくい.
4. Kẹp giấy để giữ tài liệu: クリップで留める・まとめる.
Ghi nhớ: nắm bằng tay 握る; buộc dây 結ぶ; gắp/giữ lấy つかむ; kẹp tài liệu 留める.`,
  toan_q_2013_07_35: `Đáp án 3 — だるい là mệt mỏi, uể oải toàn thân. 「熱があって体がだるかったので、会社を休んだ」: “Tôi bị sốt và uể oải từ sáng nên đã nghỉ làm”.
1. Buổi hòa nhạc mong đợi bị hủy nên thấy buồn/chán: がっかりした・残念だった.
2. Bầu trời “có vẻ uể oải”: trời trông âm u là 空が曇っている.
3. Sốt và cơ thể uể oải: 体がだるい dùng đúng.
4. Phòng đóng kín cửa nên “uể oải”: không khí bí/mù mịt là 空気がこもっている.
Ghi nhớ: người uể oải だるい; thất vọng がっかり; trời nhiều mây 曇る; không khí bí こもる.`,
  toan_q_2012_07_31: `Đáp án 4 — 緊張（きんちょう）する là căng thẳng/hồi hộp trong tình huống gây áp lực. 「テレビのインタビューを受けて、とても緊張した」: “Tôi rất hồi hộp khi được phỏng vấn trên truyền hình”.
1. Vui khi lần đầu thấy tuyết, tim “căng thẳng”: tim đập mạnh vì vui là 胸がどきどきした.
2. Kế hoạch vui chơi trong kỳ nghỉ hè “căng thẳng”: kế hoạch được lên rất thú vị/đầy đủ là 計画が楽しみだ・充実している.
3. Cách dùng máy tính mới “căng thẳng”: khó dùng là 使い方が難しい.
4. Hồi hộp khi phỏng vấn trên TV: 緊張する dùng đúng.
Ghi nhớ: căng thẳng 緊張; tim đập dồn どきどき; khó sử dụng 使い方が難しい.`,
  toan_q_2012_07_32: `Đáp án 2 — 暗記（あんき）する là học thuộc lòng bằng trí nhớ. 「教科書に載っている文は、すべて暗記しています」: “Tôi đã học thuộc tất cả câu trong sách giáo khoa”.
1. Muốn “học thuộc” cảnh đẹp mãi: muốn nhớ mãi là 目に焼き付けておきたい・覚えておきたい.
2. Học thuộc các câu trong sách: 暗記する dùng đúng.
3. Có quen biết bạn cùng lớp cũ không: người được biết là 知っていますか.
4. Không nhớ đã cất sách mượn ở đâu: 覚えていません.
Ghi nhớ: 暗記 học thuộc có chủ ý; 覚える ghi nhớ nói chung; 知り合い là người quen.`,
  toan_q_2012_07_33: `Đáp án 1 — 通り過ぎる（とおりすぎる）là đi ngang qua và vượt khỏi một địa điểm. 「看板に気づかず、前を通り過ぎていた」: “Không để ý biển hiệu nên tôi đã đi quá cửa hàng”.
1. Đi quá cửa hàng mà không thấy biển: 通り過ぎる dùng đúng.
2. Con trai cao hơn cha: 身長で父を追い越した・上回った.
3. Vận động viên vượt qua đối thủ để về nhất: 選手を追い抜いた.
4. Đã qua 10 giờ tối: 時間が過ぎていた.
Ghi nhớ: đi quá địa điểm 通り過ぎる; vượt người trên đường 追い越す; vượt đối thủ 追い抜く; thời gian trôi 過ぎる.`,
  toan_q_2012_07_34: `Đáp án 1 — 訪問（ほうもん）する là đến thăm một người/cơ quan/nơi theo mục đích cụ thể. 「就職活動のために先輩の会社を訪問した」: “Tôi đến thăm công ty của đàn anh để tìm việc”.
1. Đến thăm công ty để tìm việc: 会社を訪問する dùng đúng.
2. Thư mời đám cưới “đến thăm”: thư được 届く・来る.
3. Cuối tuần đi biển với gia đình: đi chơi/ghé biển là 海に行く・出かける.
4. Cơ hội du lịch nước ngoài “đến thăm”: cơ hội đến là チャンスが訪れる.
Ghi nhớ: thăm người/cơ quan 訪問する; thư đến 届く; cơ hội đến 訪れる; đi chơi 行く.`,
  toan_q_2012_07_35: `Đáp án 3 — 翻訳（ほんやく）する là dịch văn bản từ ngôn ngữ này sang ngôn ngữ khác. 「小説は十以上の言語に翻訳されている」: “Cuốn tiểu thuyết được dịch sang hơn mười ngôn ngữ”.
1. Đổi chữ Hán sang hiragana là 書き換える・直す; đó là đổi hệ chữ trong cùng ngôn ngữ.
2. Rút gọn một văn bản dài là 要約する・短くまとめる.
3. Dịch tiểu thuyết sang nhiều thứ tiếng: 翻訳する dùng đúng.
4. Giải thích nghĩa của 生産 bằng cách nói “làm ra đồ vật”: 言い換える・説明する, không phải dịch sang ngôn ngữ khác.
Ghi nhớ: chuyển ngôn ngữ 翻訳; tóm tắt 要約; diễn đạt lại 言い換える; giải nghĩa 説明する.`,
}

const optionFixes = {
  toan_q_2024_07_31: [
    '1　いつ財布を落としたか知識がありません。',
    '2　はさみがどこにあるか知識がありますか。',
    '3　パーティーには私の知識がない人も大勢来ていた。',
    '4　その仕事は医学の知識がないとできない。',
  ],
  toan_q_2024_07_35: [
    '1　服はインターネットの写真だけではなく、実物を見てから買いたい。',
    '2　そのときは彼女の実物の気持ちが分からなかった。',
    '3　デパートで買い物をしたとき、実物が足りなかったので、クレジットカードで払った。',
    '4　緊張したので発表のときは失敗しましたが、実物はもっと上手にできます。',
  ],
  toan_q_2011_07_33: [
    '1.毎日かならずメールを見送るようにしている',
    '2.何ページか見送ってみたが、むずかしくてわからなかった',
    '3.電車の窓から景色を見送るのが好きだ',
    '4.国に帰る友人を空港まで見送った',
  ],
  toan_q_2016_12_32: [
    '1. 今日は朝からどんどん暑くなり、昼には気温が沸騰した',
    '2. 鍋のお湯が沸騰したら、とうふを入れて火を少し弱くしてください',
    '3. 昼ごろから具合が悪くなり、夕方熱が沸騰したので病院へ行った',
    '4. このストーブは沸騰するのが早いので、すぐに部屋が暖かくなる',
  ],
  toan_q_2016_07_34: [
    '1. わたしたちは、電気などのエネルギーを大量に消費して生活している',
    '2. 今日中に消費しなければならない仕事がたくさんある',
    '3. 一度消費されたパソコンの中の情報を、前と同じ状態に戻すことは難しい',
    '4. 食べた物が胃の中で消費されるには、時間がかかる',
  ],
  toan_q_2015_07_34: [
    '1. 歌っている子どもの声がとても清潔で、感動した',
    '2. この島にはほとんど人が来ないので、清潔な自然がまだ残っている',
    '3. 仕事の後にプールで泳いで、清潔な気持ちになった',
    '4. このホテルは古いが、部屋はよく掃除されていて清潔だ',
  ],
}

const questions = new Map()
for (const exam of exams)
  for (const part of exam.parts) for (const question of part.questions) questions.set(question.id, question)
for (const [id, explanation] of Object.entries(updates)) {
  const question = questions.get(id)
  if (!question) throw new Error(`Question not found: ${id}`)
  question.explanation = explanation
  curated[id] = explanation
}
for (const [id, options] of Object.entries(optionFixes)) {
  const question = questions.get(id)
  if (!question || question.options.length !== options.length) throw new Error(`Invalid option fix: ${id}`)
  question.options = options
}

fs.writeFileSync(masterPath, `${JSON.stringify(exams, null, 2)}\n`, 'utf8')
fs.writeFileSync(curatedPath, `${JSON.stringify(curated, null, 2)}\n`, 'utf8')
console.log(`Updated ${Object.keys(updates).length} explanations and ${Object.keys(optionFixes).length} option sets.`)
