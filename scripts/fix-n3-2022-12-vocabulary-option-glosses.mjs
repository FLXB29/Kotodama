import fs from 'node:fs'
import path from 'node:path'

const masterPath = path.resolve('data/jlpt_n3_toan_master.json')
const sectionPath = path.resolve('data/jlpt_full_master.json')
const curatedPath = path.resolve('data/jlpt_n3_explanations_curated.json')
const reportPath = path.resolve('reports/n3-quality-audit/vocabulary-gloss-2022-12-review.json')
const answerKeySource = 'https://drive.google.com/file/d/1Lmr3LwhnS3lEv4FYemiM0f93Qg5DLNZL/view#page=25'
const questionPaperSource =
  'https://www.tiengnhatdongian.com/wp-content/uploads/2023/04/Tu-vung-ngu-phap-N3-T12-2022-Ver-1.0-2212015-Dokkai-dnag-cap-nhat.pdf'

const reviews = {
  toan_q_2022_12_1: {
    number: 1,
    answer: 2,
    promptIncludes: 'いろいろな容器を売っています',
    options: ['ようぎ', 'ようき', 'どうぐ', 'どうく'],
    explanation: `Đáp án 2 — 「容器」đọc là 「ようき」, nghĩa là đồ đựng/vật chứa như chai, hộp hoặc bình.
1. ようぎ: không phải cách đọc của 「容器」; âm cuối của 「器」 ở đây là き, không phải ぎ.
2. ようき: cách đọc đúng của 「容器」.
3. どうぐ: là cách đọc của từ khác 「道具」 (dụng cụ), không phải 「容器」.
4. どうく: không phải cách đọc của 「容器」 hay 「道具」.
Dịch: “Cửa hàng này bán nhiều loại đồ đựng.”
Ghi nhớ: 「容器」= vật chứa; 「道具」= dụng cụ.`,
  },
  toan_q_2022_12_2: {
    number: 2,
    answer: 1,
    promptIncludes: '何と何を比べた',
    options: ['くらべた', 'ならべた', 'しらべた', 'えらべた'],
    explanation: `Đáp án 1 — 「比べた」là dạng quá khứ của 「比べる」（くらべる）, nghĩa là so sánh.
1. くらべた: cách đọc đúng của 「比べた」.
2. ならべた: cách đọc của 「並べた」, xếp/đặt thành hàng; là từ khác.
3. しらべた: cách đọc của 「調べた」, điều tra/kiểm tra; là từ khác.
4. えらべた: thường viết 「選べた」, đã có thể chọn; không phải cách đọc của 「比べた」.
Dịch: “Anh/chị Yamamoto đã so sánh những thứ nào với nhau?”
Ghi nhớ: 「比べる」= so sánh; 「並べる」= xếp thành hàng; 「調べる」= kiểm tra/điều tra.`,
  },
  toan_q_2022_12_3: {
    number: 3,
    answer: 3,
    promptIncludes: '書類が複数ある',
    options: ['ふくす', 'ふうすう', 'ふくすう', 'ふうす'],
    explanation: `Đáp án 3 — 「複数」đọc là 「ふくすう」, nghĩa là nhiều hơn một/số lượng nhiều.
1. ふくす: thiếu âm 「う」 ở 「数」.
2. ふうすう: kéo dài sai âm 「ふ」; 「複」đọc 「ふく」.
3. ふくすう: cách đọc đúng; 「複」= nhiều/phức, 「数」= số.
4. ふうす: kéo dài sai âm 「ふ」 và thiếu âm 「う」 ở cuối.
Dịch: “Vì có nhiều tài liệu nên xin đừng nhầm lẫn.”
Ghi nhớ: 「複数」= nhiều, từ hai trở lên. PDF tham khảo Ver 1.0 ghi cách viết hai phương án nhiễu khác; lời giải giữ theo âm đang có trong dữ liệu.`,
    sourceNote:
      'PDF Ver 1.0 ghi phương án 2 là ふうくす và phương án 4 là ふくうす; dữ liệu hiện tại ghi ふうすう・ふうす. Giữ nguyên và giải theo bộ lựa chọn hiện có.',
  },
  toan_q_2022_12_4: {
    number: 4,
    answer: 1,
    promptIncludes: '血圧を計りました',
    options: ['けつあつ', 'けつやつ', 'ちあつ', 'ちやつ'],
    explanation: `Đáp án 1 — 「血圧」đọc là 「けつあつ」, nghĩa là huyết áp; 「血圧を計る」là đo huyết áp.
1. けつあつ: cách đọc đúng; 「血」đọc là けつ, 「圧」đọc là あつ.
2. けつやつ: sai âm đầu của 「圧」; âm đúng là あつ.
3. ちあつ: 「血」ở từ này không đọc là ち.
4. ちやつ: sai cả cách đọc 「血」trong từ này lẫn âm của 「圧」.
Dịch: “Hôm qua tôi đã đo huyết áp ở bệnh viện.”
Ghi nhớ: 「血圧」= huyết áp. PDF tham khảo Ver 1.0 ghi phương án 2 và 4 khác với dữ liệu hiện tại; chưa xác nhận được phiên bản gốc.`,
    sourceNote:
      'PDF Ver 1.0 ghi phương án 2 là けいあつ và phương án 4 là ちけつ; dữ liệu hiện tại ghi けつやつ・ちやつ. Giữ nguyên và giải theo bộ lựa chọn hiện có.',
  },
  toan_q_2022_12_5: {
    number: 5,
    answer: 4,
    promptIncludes: '夕日はきれいだ',
    options: ['ゆび', 'ゆひ', 'ゆうび', 'ゆうひ'],
    explanation: `Đáp án 4 — 「夕日」đọc là 「ゆうひ」, chỉ mặt trời lúc chiều tà/hoàng hôn.
1. ゆび: là cách đọc 「指」(ngón tay), không phải 「夕日」.
2. ゆひ: thiếu trường âm ở 「夕」; âm đúng là ゆう.
3. ゆうび: thêm âm đục び; 「日」ở đây đọc là ひ.
4. ゆうひ: cách đọc đúng; 「夕」= ゆう, 「日」= ひ.
Dịch: “Mặt trời chiều nhìn từ đây thật đẹp.”
Ghi nhớ: 「夕日」= mặt trời chiều; 「指」= ngón tay.`,
  },
  toan_q_2022_12_6: {
    number: 6,
    answer: 4,
    promptIncludes: '一人で行くのは難しい',
    options: ['きびしい', 'めずらしい', 'さびしい', 'むずかしい'],
    explanation: `Đáp án 4 — 「難しい」đọc là 「むずかしい」, nghĩa là khó/khó khăn.
1. きびしい thường viết 「厳しい」, nghĩa là nghiêm khắc/khắc nghiệt.
2. めずらしい viết 「珍しい」, nghĩa là hiếm/lạ.
3. さびしい viết 「寂しい」, nghĩa là cô đơn/vắng vẻ.
4. むずかしい là cách đọc đúng của 「難しい」.
Dịch: “Tôi nghĩ đi đến đó một mình thì khó.”
Ghi nhớ: 「難しい」= khó; 「厳しい」= nghiêm khắc/khắc nghiệt; 「珍しい」= hiếm/lạ.`,
  },
  toan_q_2022_12_7: {
    number: 7,
    answer: 3,
    promptIncludes: '出張の件で',
    options: ['けい', 'よう', 'けん', 'よん'],
    explanation: `Đáp án 3 — 「件」đọc là 「けん」; cụm 「出張の件」nghĩa là việc/vấn đề liên quan đến chuyến công tác.
1. けい: không phải cách đọc của 「件」trong từ này.
2. よう: không phải cách đọc của 「件」.
3. けん: cách đọc đúng; thường gặp trong 「この件」= việc này/vấn đề này.
4. よん: cách đọc số 「四」, không phải 「件」.
Dịch: “Anh/chị Nakamura gọi điện về việc chuyến công tác.”
Ghi nhớ: 「件」（けん）= việc/vấn đề; 「出張の件」= việc liên quan chuyến công tác.`,
  },
  toan_q_2022_12_8: {
    number: 8,
    answer: 2,
    promptIncludes: '横断するとき',
    options: ['おうざん', 'おうだん', 'きだん', 'きざん'],
    explanation: `Đáp án 2 — 「横断」đọc là 「おうだん」, nghĩa là băng qua (đường/khu vực).
1. おうざん: sai âm cuối của 「断」; âm đúng là だん.
2. おうだん: cách đọc đúng của từ ghép 「横断」.
3. きだん: không đúng cách đọc của cả 「横」và 「断」trong từ này.
4. きざん: không đúng cách đọc; 「横」đọc おう trong từ ghép này.
Dịch: “Khi băng qua chỗ này, hãy cẩn thận.”
Ghi nhớ: 「横断する」= băng qua; 「横断歩道」= vạch sang đường. PDF Ver 1.0 ghi phương án nhiễu 1 và 4 khác với bộ dữ liệu hiện tại.`,
    sourceNote:
      'PDF Ver 1.0 ghi phương án 1 là おだん và phương án 4 là よこだん; dữ liệu hiện tại ghi おうざん・きざん. Giữ nguyên và giải theo bộ lựa chọn hiện có.',
  },
  toan_q_2022_12_9: {
    number: 9,
    answer: 3,
    promptIncludes: '外の空気を',
    options: ['吹った', '呼った', '吸った', '叫った'],
    explanation: `Đáp án 3 — 「吸った」 là dạng quá khứ của 「吸う」, nghĩa là hít vào; 「空気を吸う」 là hít thở không khí.
1. 吹った: 「吹く」 là thổi (gió), nhưng dạng quá khứ đúng là 「吹いた」.
2. 呼った: 「呼ぶ」 là gọi, nhưng dạng quá khứ đúng là 「呼んだ」.
3. 吸った: dạng quá khứ đúng của 「吸う」, hít vào; hợp với 「外の空気」.
4. 叫った: 「叫ぶ」 là hét, nhưng dạng quá khứ đúng là 「叫んだ」.
Dịch: “Tôi bước ra khỏi xe và hít thở không khí bên ngoài.”
Ghi nhớ: 「吸う」= hít; 「吹く」= thổi; 「呼ぶ」= gọi; 「叫ぶ」= hét.`,
  },
  toan_q_2022_12_10: {
    number: 10,
    answer: 3,
    promptIncludes: '時間が',
    options: ['早い', '長い', '短い', '遅い'],
    explanation: `Đáp án 3 — 「みじかい」 viết là 「短い」, nghĩa là ngắn; nói về khoảng thời gian thì chỉ thời lượng ngắn.
1. 早い（はやい）: sớm/nhanh; không có nghĩa “ngắn”.
2. 長い（ながい）: dài/lâu; trái nghĩa với 「短い」.
3. 短い（みじかい）: ngắn; đúng cách viết của từ được hỏi.
4. 遅い（おそい）: muộn/chậm; không diễn tả thời lượng ngắn.
Dịch: “Ngày mai thời gian làm thêm ngắn hơn mọi khi.”
Ghi nhớ: 「早い・遅い」 nói về sớm/muộn hoặc nhanh/chậm; 「長い・短い」 nói về độ dài/thời lượng.`,
  },
  toan_q_2022_12_11: {
    number: 11,
    answer: 2,
    promptIncludes: 'の調子がよくない',
    options: ['肩', '胃', '腰', '肌'],
    explanation: `Đáp án 2 — 「胃」 đọc là 「い」, nghĩa là dạ dày; 「胃の調子がよくない」 nói rằng dạ dày không được khỏe.
1. 肩（かた）: vai; không đọc là 「い」.
2. 胃（い）: dạ dày; đúng chữ Hán và cách đọc.
3. 腰（こし）: eo/lưng dưới; không đọc là 「い」.
4. 肌（はだ）: da; không đọc là 「い」.
Dịch: “Hôm nay dạ dày tôi hơi khó chịu.”
Ghi nhớ: 「胃」= dạ dày; 「肩」= vai; 「腰」= eo/lưng dưới; 「肌」= da.`,
  },
  toan_q_2022_12_12: {
    number: 12,
    answer: 4,
    promptIncludes: 'えがお',
    options: ['楽顔', '悲顔', '泣顔', '笑顔'],
    explanation: `Đáp án 4 — 「笑顔」（えがお）là nụ cười hoặc gương mặt tươi cười. Cụm 「笑顔になる」 nghĩa là nở nụ cười.
1. 楽顔: 「楽」 nghĩa là vui/thoải mái, nhưng không phải cách viết của 「えがお」; nói tự nhiên là 「楽しい顔」.
2. 悲顔: 「悲」 gợi nghĩa buồn; 「悲しい顔」 là gương mặt buồn, không phải 「えがお」.
3. 泣顔: 「泣」 là khóc; 「泣き顔」 là gương mặt đang khóc, trái với nụ cười và không đọc là 「えがお」.
4. 笑顔: 「笑」 là cười và 「顔」 là mặt; đây là cách viết đúng của 「えがお」.
Dịch: “Nghe câu chuyện đó xong, mọi người đều nở nụ cười.”
Ghi nhớ: 「笑顔」= nụ cười/gương mặt tươi cười; 「泣き顔」= gương mặt đang khóc; 「悲しい顔」= gương mặt buồn.`,
    sourceNote:
      'PDF Ver 1.0 có các phương án khác ở câu 12; giữ nguyên bộ lựa chọn hiện tại vì chưa xác định được phiên bản gốc của bộ dữ liệu.',
  },
  toan_q_2022_12_13: {
    number: 13,
    answer: 1,
    promptIncludes: 'こくばん',
    options: ['黒板', '黒坂', '告板', '告坂'],
    explanation: `Đáp án 1 — 「黒板」（こくばん）là bảng đen; đây là cách viết đúng của 「こくばん」.
1. 黒板: 「黒」 là màu đen, 「板」 là tấm/bảng; từ ghép này nghĩa là bảng đen và đọc là 「こくばん」.
2. 黒坂: 「坂」 nghĩa là dốc; không tạo thành từ 「こくばん」 (có thể gặp như tên riêng với cách đọc khác).
3. 告板: 「告」 mang nghĩa báo/cho biết, nhưng 「告板」 không phải cách viết chuẩn của từ 「こくばん」.
4. 告坂: ghép chữ mang nghĩa báo/cho biết với dốc; không phải từ cần điền.
Dịch: “Hãy nhìn lên bảng đen.”
Ghi nhớ: 「黒」= đen; 「板」= tấm/bảng; 「黒板」= bảng đen. PDF tham khảo Ver 1.0 có phương án nhiễu khác, nên bộ lựa chọn hiện tại chưa được xác nhận là bản gốc.`,
    sourceNote:
      'PDF Ver 1.0 ghi phương án 3–4 là 看板・看坂, còn dữ liệu hiện tại là 告板・告坂; lời giải theo lựa chọn đang có và không tự đồng bộ biến thể.',
  },
  toan_q_2022_12_14: {
    number: 14,
    answer: 2,
    promptIncludes: 'いっぱんてき',
    options: ['一段的', '一般的', '一役的', '一設的な'],
    sectionOptions: ['一段的', '一般的', '一役的', '一設的'],
    explanation: `Đáp án 2 — 「一般的」（いっぱんてき）nghĩa là phổ biến, thông thường; đây là cách viết đúng của từ được gạch dưới.
1. 一段的: 「一段」 thường chỉ một bậc/mức hoặc xuất hiện trong 「一段と」 (hơn hẳn); không viết 「いっぱんてき」.
2. 一般的: cách viết đúng, nghĩa là phổ biến/thông thường.
3. 一役的: 「一役」 có thể chỉ một vai trò/nhiệm vụ, nhưng 「一役的」 không phải cách viết của 「いっぱんてき」.
4. 一設的: không phải từ chuẩn mang cách đọc 「いっぱんてき」.
Dịch: “Tôi nghĩ đó là điều phổ biến/thông thường.”
Ghi nhớ: 「一般」= nói chung; 「一般的」= phổ biến, thông thường. Bản PDF tham khảo Ver 1.0 có các phương án nhiễu khác, nên cần đối chiếu bản đề gốc trước khi xác nhận bộ lựa chọn hiện tại.`,
    sourceNote:
      'PDF Ver 1.0 có các phương án nhiễu khác ở câu 14; giải nghĩa theo bộ lựa chọn hiện tại nhưng chưa xác nhận phiên bản gốc.',
  },
  toan_q_2022_12_15: {
    number: 15,
    answer: 3,
    promptIncludes: '私のめいと結婚',
    options: ['夫婦', '家内', '親戚', '兄弟'],
    explanation: `Đáp án 3 — 「親戚」（しんせき）là họ hàng/bà con. 「めい」là cháu gái; khi anh Tanaka kết hôn với cháu gái của người nói, hai người trở thành họ hàng.
1. 夫婦（ふうふ）: vợ chồng; không phải quan hệ giữa người nói và chồng của cháu gái mình.
2. 家内（かない）: vợ (cách gọi người vợ của mình) hoặc bên trong nhà; không hợp chủ ngữ 「私たち」 ở đây.
3. 親戚（しんせき）: họ hàng; đúng với quan hệ mới hình thành do hôn nhân.
4. 兄弟（きょうだい）: anh chị em; không phải quan hệ giữa hai người trong câu.
Dịch: “Vì anh Tanaka kết hôn với cháu gái tôi nên chúng tôi trở thành họ hàng.”
Ghi nhớ: 「めい」= cháu gái; 「親戚」= họ hàng; 「夫婦」= vợ chồng.`,
    correctStandaloneQuestion: '田中さんは私のめいと結婚したので、私たちは( )になりました。',
    incorrectStandaloneQuestion: '田中さんは私のめいと結婚したので、私たちは( )にまりました。',
    sourceNote:
      'PDF tham khảo trang 2 xác nhận câu và lựa chọn; bản đề rời có lỗi chép 「にまりました」, đã sửa thành 「になりました」.',
  },
  toan_q_2022_12_16: {
    number: 16,
    answer: 4,
    promptIncludes: '学生時代の友達に',
    options: ['ついでに', '当然', 'たまに', '偶然'],
    explanation: `Đáp án 4 — 「偶然」（ぐうぜん）nghĩa là tình cờ; việc bất ngờ gặp bạn cũ ở nhà ga phù hợp với nghĩa này.
1. ついでに: nhân tiện làm thêm việc gì đó; cần có một hoạt động khác làm dịp.
2. 当然（とうぜん）: đương nhiên/tất nhiên; không diễn tả cuộc gặp bất ngờ.
3. たまに: thỉnh thoảng; nói về tần suất, không hàm ý cuộc gặp xảy ra ngoài dự tính. Nếu gặp không thường xuyên thì từ này có thể hợp trong ngữ cảnh khác, nhưng 「びっくりした」 ở câu này làm 「偶然」 chính xác hơn.
4. 偶然（ぐうぜん）: tình cờ, ngẫu nhiên; diễn tả gặp bạn cũ ngoài dự tính.
Dịch: “Hôm qua ở nhà ga, tôi tình cờ gặp một người bạn thời sinh viên nên rất bất ngờ.”
Ghi nhớ: 「偶然会う」= tình cờ gặp; 「たまに会う」= thỉnh thoảng gặp.`,
  },
  toan_q_2022_12_17: {
    number: 17,
    answer: 1,
    promptIncludes: 'どれを買おうか',
    options: ['迷って', '騒いで', '疑って', '飽きて'],
    explanation: `Đáp án 1 — 「どれを買おうか迷う」 nghĩa là phân vân không biết nên mua loại nào; 「しまう」 diễn tả việc lúng túng ấy xảy ra.
1. 迷って（まよって）: phân vân, bối rối khi phải chọn; hợp với câu hỏi 「どれを買おうか」.
2. 騒いで（さわいで）: làm ồn/gây náo động; không diễn tả việc khó chọn.
3. 疑って（うたがって）: nghi ngờ; không có đối tượng nghi ngờ trong câu.
4. 飽きて（あきて）: chán/ngán; không hợp với việc đang cân nhắc chọn mua.
Dịch: “Có nhiều loại nước giặt quá nên tôi cứ phân vân không biết mua loại nào.”
Ghi nhớ: 「迷う」= phân vân; 「疑う」= nghi ngờ; 「飽きる」= chán.`,
  },
  toan_q_2022_12_18: {
    number: 18,
    answer: 2,
    promptIncludes: '足に',
    options: ['はっきり', 'ぴったり', 'うっかり', 'がっかり'],
    explanation: `Đáp án 2 — 「足にぴったり合う靴」 là đôi giày vừa khít/vừa vặn với bàn chân.
1. はっきり: rõ ràng; thường bổ nghĩa cho cách nói, hình ảnh hoặc sự khác biệt, không có nghĩa vừa vặn.
2. ぴったり: khít, vừa đúng; kết hợp tự nhiên với 「合う」 và 「足に」.
3. うっかり: sơ ý/vô ý; diễn tả hành động bất cẩn.
4. がっかり: thất vọng; diễn tả cảm xúc khi kết quả không như mong đợi.
Dịch: “Tôi mãi vẫn không tìm được đôi giày vừa khít với chân.”
Ghi nhớ: 「ぴったり合う」= vừa khít; 「うっかり」= sơ ý; 「がっかりする」= thất vọng.`,
  },
  toan_q_2022_12_19: {
    number: 19,
    answer: 3,
    promptIncludes: '洗濯物を',
    options: ['混ぜた', '揚げた', '干した', 'こぼした'],
    explanation: `Đáp án 3 — 「洗濯物を干す」 nghĩa là phơi quần áo; trời đẹp nên phơi đồ ngoài sân là hợp ngữ cảnh.
1. 混ぜた（まぜた）: đã trộn; dùng với các nguyên liệu/chất được trộn với nhau.
2. 揚げた（あげた）: đã chiên/ngập dầu; dùng với thức ăn.
3. 干した（ほした）: đã phơi/làm khô; kết hợp tự nhiên với quần áo.
4. こぼした: đã làm đổ/tràn chất lỏng; không dùng với quần áo đang đem phơi.
Dịch: “Trời đẹp nên tôi phơi quần áo ngoài sân.”
Ghi nhớ: 「洗濯物を干す」= phơi quần áo; 「油で揚げる」= chiên ngập dầu.`,
  },
  toan_q_2022_12_20: {
    number: 20,
    answer: 2,
    promptIncludes: '日本料理の',
    options: ['メッセージ', 'レシピ', 'サイン', 'アナウンス'],
    explanation: `Đáp án 2 — 「レシピ」 là công thức nấu ăn; người nói nhìn công thức Mori đã chỉ để nấu bữa tối.
1. メッセージ: lời nhắn/tin nhắn; không phải hướng dẫn nấu món ăn.
2. レシピ: công thức nấu ăn; phù hợp với 「見て作りました」 (xem rồi làm/nấu).
3. サイン: chữ ký hoặc dấu hiệu; không hướng dẫn cách nấu.
4. アナウンス: thông báo/phát thanh; không phải công thức.
Dịch: “Bữa tối nay tôi nấu theo công thức món Nhật mà anh/chị Mori đã chỉ cho.”
Ghi nhớ: 「レシピを見る」= xem công thức; 「料理を作る」= nấu món ăn.`,
  },
  toan_q_2022_12_21: {
    number: 21,
    answer: 4,
    promptIncludes: '映画の中に',
    options: ['発生', '支出', '掲示', '登場'],
    explanation: `Đáp án 4 — 「映画に登場する男性」 là người đàn ông xuất hiện trong phim.
1. 発生（はっせい）: phát sinh/xảy ra; thường dùng cho sự cố, vấn đề hoặc hiện tượng.
2. 支出（ししゅつ）: khoản chi/chi tiêu; liên quan đến tiền bạc.
3. 掲示（けいじ）: niêm yết/dán thông báo; không nói một nhân vật xuất hiện trong phim.
4. 登場（とうじょう）: xuất hiện/lên sân khấu; dùng tự nhiên cho nhân vật xuất hiện trong tác phẩm.
Dịch: “Người đàn ông xuất hiện trong phim giống hệt cha tôi.”
Ghi nhớ: 「映画に登場する人物」= nhân vật xuất hiện trong phim; 「問題が発生する」= vấn đề phát sinh.`,
  },
  toan_q_2022_12_22: {
    number: 22,
    answer: 1,
    promptIncludes: '大勢の前で歌う',
    options: ['どきどき', 'だぶだぶ', 'ぐうぐう', 'ざあざあ'],
    explanation: `Đáp án 1 — 「どきどきする」 diễn tả tim đập nhanh vì hồi hộp; lần đầu hát trước đông người là ngữ cảnh phù hợp.
1. どきどき: tim đập thình thịch/hồi hộp; hợp với cảm giác trước lần biểu diễn đầu tiên.
2. だぶだぶ: rộng thùng thình, lỏng (thường nói quần áo); không diễn tả hồi hộp.
3. ぐうぐう: tiếng ngáy/âm thanh khi ngủ say hoặc tiếng bụng réo; không hợp với việc hát trước khán giả.
4. ざあざあ: tiếng mưa hoặc nước đổ ào ào; mô phỏng âm thanh, không phải cảm xúc.
Dịch: “Vì đây là lần đầu hát trước đông người nên tôi hồi hộp.”
Ghi nhớ: 「どきどきする」= hồi hộp; 「ざあざあ降る」= mưa rơi ào ào.`,
  },
  toan_q_2022_12_23: {
    number: 23,
    answer: 3,
    promptIncludes: '海側の部屋を',
    options: ['納得', '承知', '希望', '準備'],
    explanation: `Đáp án 3 — 「海側の部屋を希望する」 nghĩa là mong muốn/yêu cầu phòng phía biển; nhưng phòng đó đã hết chỗ.
1. 納得（なっとく）: hiểu và chấp nhận một lý do/kết quả; không kết hợp tự nhiên với việc chọn phòng.
2. 承知（しょうち）: biết/đồng ý/nhận lời; không có nghĩa yêu cầu một phòng cụ thể.
3. 希望（きぼう）: mong muốn/yêu cầu; dùng được với 「部屋を希望する」.
4. 準備（じゅんび）: chuẩn bị; không có nghĩa chọn hoặc mong muốn phòng.
Dịch: “Tôi đã yêu cầu một phòng hướng ra biển ở khách sạn, nhưng phòng đó không còn trống.”
Ghi nhớ: 「部屋を希望する」= mong muốn/yêu cầu phòng; 「準備する」= chuẩn bị.`,
  },
  toan_q_2022_12_24: {
    number: 24,
    answer: 1,
    promptIncludes: '隣の家の犬が',
    options: ['ほえる', 'ひびく', 'しゃべる', 'どなる'],
    explanation: `Đáp án 1 — 「犬がほえる」 nghĩa là chó sủa; tiếng sủa của chó nhà bên làm người nói khó ngủ.
1. ほえる（吠える）: sủa (hoặc gầm/rống với một số con vật); kết hợp tự nhiên với 「犬」.
2. ひびく（響く）: vang/dội; nói âm thanh lan vọng, không phải hành động của chó.
3. しゃべる（喋る）: nói chuyện/tán gẫu; thường dùng cho người.
4. どなる（怒鳴る）: quát/hét giận dữ; thường là người lớn tiếng với ai.
Dịch: “Đến tối, chó nhà bên sủa, ồn đến nỗi tôi mãi không ngủ được.”
Ghi nhớ: 「犬が吠える」= chó sủa; 「声が響く」= tiếng nói vang vọng; 「人を怒鳴る」= quát ai.`,
  },
  toan_q_2022_12_25: {
    number: 25,
    answer: 2,
    promptIncludes: '前の車を',
    options: ['飛び出す', '追い越す', '押し込む', '取り替える'],
    explanation: `Đáp án 2 — 「前の車を追い越す」 nghĩa là vượt chiếc xe phía trước; đường hẹp nên việc vượt xe nguy hiểm.
1. 飛び出す（とびだす）: lao/bất ngờ chạy ra; không mang nghĩa vượt một chiếc xe khác.
2. 追い越す（おいこす）: vượt qua người/xe đang đi phía trước; đúng nghĩa câu.
3. 押し込む（おしこむ）: đẩy/nhét vào bên trong; không dùng với nghĩa vượt xe.
4. 取り替える（とりかえる）: thay/đổi một vật bằng vật khác; không có nghĩa vượt qua.
Dịch: “Đường này hẹp nên vượt chiếc xe phía trước rất nguy hiểm.”
Ghi nhớ: 「車を追い越す」= vượt xe; 「飛び出す」= lao vụt ra; 「取り替える」= thay thế.`,
  },
  toan_q_2022_12_26: {
    number: 26,
    answer: 1,
    promptIncludes: '時間を',
    options: ['あげよう', 'もらおう', '作ろう', '使おう'],
    explanation: `Đáp án 1 — 「あたえる」 gần nghĩa nhất với 「あげる」: trao/cho ai thứ gì. Câu nói người kể định dành thêm một chút thời gian cho người khác.
1. あげよう: cho/tặng; cùng hướng nghĩa với 「時間をあたえる」.
2. もらおう: nhận; đảo chiều người nhận và người cho.
3. 作ろう: làm/tạo ra; không có nghĩa trao thời gian cho ai.
4. 使おう: sử dụng; nói dùng thời gian, không phải dành thời gian cho người khác.
Dịch: “Tôi nghĩ mình sẽ cho thêm một chút thời gian.”
Ghi nhớ: 「与える」= trao/cung cấp; 「あげる」= cho; 「もらう」= nhận.`,
  },
  toan_q_2022_12_27: {
    number: 27,
    answer: 2,
    promptIncludes: 'ずいぶん',
    options: ['最も', '非常に', 'まあまあ', 'やっぱり'],
    explanation: `Đáp án 2 — 「ずいぶん」 ở đây nghĩa là rất/đáng kể; gần nhất với 「非常に」, “rất/vô cùng”.
1. 最も（もっとも）: nhất, ở mức cao nhất khi so sánh; không đơn thuần là “rất”.
2. 非常に（ひじょうに）: rất/vô cùng; cùng chỉ mức độ cao như 「ずいぶん」 trong câu này.
3. まあまあ: tàm tạm/khá; mức độ nhẹ hơn, không diễn tả số xe nhiều đáng kể.
4. やっぱり: quả nhiên/rốt cuộc; không phải trạng từ chỉ mức độ.
Dịch: “Ở đây xe nhiều thật đấy nhỉ.”
Ghi nhớ: 「ずいぶん・非常に」 nhấn mạnh mức độ; 「最も」 chọn mức cao nhất trong một nhóm; 「やっぱり」 nghĩa là quả nhiên/rốt cuộc.`,
  },
  toan_q_2022_12_28: {
    number: 28,
    answer: 1,
    promptIncludes: '指定',
    options: ['決められた', '空いている', '近くの', 'ほかの'],
    explanation: `Đáp án 1 — 「指定の場所」 là địa điểm được chỉ định/đã quy định; gần nghĩa nhất với 「決められた場所」.
1. 決められた: đã được quyết định/quy định; phù hợp với nơi được chỉ định.
2. 空いている: đang trống/còn chỗ; không nói nơi đã được chỉ định.
3. 近くの: ở gần; chỉ khoảng cách, không nói nơi đã được quy định.
4. ほかの: khác/một nơi khác; không mang nghĩa được chỉ định.
Dịch: “Hãy đặt hành lý ở nơi đã được chỉ định.”
Ghi nhớ: 「指定する」= chỉ định; 「決められた」= đã được quyết định; 「空いている」= còn trống.`,
  },
  toan_q_2022_12_29: {
    number: 29,
    answer: 3,
    promptIncludes: '不安',
    options: ['賛成', '大変', '心配', '反対'],
    explanation: `Đáp án 3 — 「不安」 là lo lắng/bất an; gần nghĩa nhất với 「心配」.
1. 賛成（さんせい）: tán thành; thể hiện đồng ý với ý kiến, không phải cảm giác lo.
2. 大変（たいへん）: vất vả/nghiêm trọng; mô tả tình huống khó khăn, không trực tiếp đồng nghĩa với “lo lắng”.
3. 心配（しんぱい）: lo lắng/bận tâm; gần nghĩa nhất với 「不安」.
4. 反対（はんたい）: phản đối/trái ngược; nêu thái độ hoặc quan hệ đối lập, không phải tâm trạng bất an.
Dịch: “Cho đến khi nghe anh/chị Yamada nói, tôi vẫn còn lo lắng.”
Ghi nhớ: 「不安・心配」 đều nói về lo âu; 「賛成・反対」 là tán thành/phản đối.`,
  },
  toan_q_2022_12_30: {
    number: 30,
    answer: 4,
    promptIncludes: '川井さんに聞いてください',
    options: ['行き方', '理由', 'やり方', '予定'],
    explanation: `Đáp án 4 — 「スケジュール」 là lịch trình; gần nghĩa nhất với 「予定」（よてい）, kế hoạch/dự định.
1. 行き方（いきかた）: cách đi/đường đi đến nơi nào đó; không phải lịch trình.
2. 理由（りゆう）: lý do; trả lời vì sao, không nói kế hoạch thời gian.
3. やり方: cách làm/phương pháp; chỉ cách thực hiện một việc.
4. 予定（よてい）: lịch/kế hoạch dự định; phù hợp với 「スケジュール」.
Dịch: “Hãy hỏi anh/chị Kawai về lịch trình.”
Ghi nhớ: 「予定・スケジュール」= kế hoạch/lịch trình; 「行き方」= đường đi; 「やり方」= cách làm. PDF tham khảo Ver 1.0 in lựa chọn 1 là 「生き方」 (cách sống), còn dữ liệu hiện tại ghi 「行き方」; chưa đủ căn cứ để tự đổi phiên bản.`,
    sourceNote:
      'PDF Ver 1.0 in lựa chọn 1 là 生き方, dữ liệu hiện tại là 行き方; lời giải theo lựa chọn hiện có, khóa 4 vẫn là 予定.',
  },
  toan_q_2022_12_31: {
    number: 31,
    answer: 4,
    promptIncludes: '発展',
    options: [
      '毎朝ジョギングを続けたら、健康が発展するだろう。',
      'テレビで紹介されてから、この店は客の数が発展した。',
      '林さんは中学校のとき、成績が急に発展したそうだ。',
      'この町は歴史的な建物が多く、観光地として発展してきた。',
    ],
    sectionOptions: [
      '毎朝ジョギングを続けたら、健康が発展するだろう。',
      'テレビで紹介されてから、この店は客の数が発展した。',
      '林さんは中学校のとき、成績が急に発展したそうだ 。',
      'この町は歴史的な建物が多く、観光地として発展してきた。',
    ],
    explanation: `Đáp án 4 — 「発展する」là phát triển/mở rộng về quy mô hoặc lĩnh vực; thị trấn có thể phát triển thành điểm du lịch.
1. 健康が発展する: “Sức khỏe phát triển”; không tự nhiên. Nói sức khỏe được cải thiện là 「健康になる」hoặc 「健康が増進する」.
2. 客の数が発展した: “Số khách phát triển”; số lượng tăng thì nói 「客の数が増えた」, còn cửa hàng/hoạt động kinh doanh mới 「発展する」.
3. 成績が急に発展した: “Thành tích học tập phát triển đột ngột”; điểm số tiến bộ thì nói 「成績が上がる・伸びる」.
4. 町が観光地として発展する: thị trấn phát triển thành điểm du lịch; dùng 「発展」tự nhiên.
Dịch:
1. Nếu tiếp tục chạy bộ mỗi sáng, sức khỏe sẽ “phát triển”.
2. Từ khi được giới thiệu trên TV, số khách của cửa hàng này đã “phát triển”.
3. Nghe nói thành tích học tập của anh/chị Hayashi đột nhiên “phát triển” khi còn học cấp hai.
4. Thị trấn này có nhiều công trình lịch sử và đã phát triển thành điểm du lịch.
Ghi nhớ: khu vực/ngành nghề 「発展する」; số lượng 「増える」; sức khỏe 「増進する」; thành tích 「上がる・伸びる」. PDF Ver 1.0 ghi tên người ở lựa chọn 3 khác với dữ liệu hiện tại; khác biệt này không ảnh hưởng cách dùng từ, chưa tự đồng bộ.`,
    sourceNote:
      'PDF Ver 1.0 ghi 村さん ở lựa chọn 3, trong khi dữ liệu hiện tại ghi 林さん; giữ nguyên nội dung hiện có vì chưa xác định được bản đề gốc.',
  },
  toan_q_2022_12_32: {
    number: 32,
    answer: 2,
    promptIncludes: 'だく',
    options: [
      '朝作ったお弁当を大きめのハンカチでだいてかばんに入れた。',
      '生まれた子を初めてだいたとき、とても小さくて軽いと感じた。',
      'けがをしないように、包丁をしっかりだいて魚を切った。',
      '引っ越しのとき運びやすいように、本や雑誌をひもでだいた。',
    ],
    sectionOptions: [
      '朝作ったお弁当を大きめのハンカチでだいてかばんに入れた 。',
      '生まれた子を初めてだいたとき、とても小さくて軽いと感じた 。',
      'けがをしないように、包丁をしっかりだいて魚を切った。',
      '引っ越しのとき運びやすいように、本や雑誌をひもでだいた。',
    ],
    explanation: `Đáp án 2 — 「だく」ở đây viết 「抱く」, nghĩa là ôm/bế người bằng tay. Bế em bé mới sinh là cách dùng tự nhiên.
1. 「お弁当をハンカチで抱く」: “Ôm hộp cơm bằng khăn tay”; bọc hộp cơm thì dùng 「包む」.
2. 「生まれた子を抱く」: bế em bé mới sinh; 「抱く」dùng đúng.
3. 「包丁を抱いて魚を切る」: “Ôm con dao khi cắt cá”; cầm dao chắc thì dùng 「持つ」.
4. 「本や雑誌をひもで抱く」: “Ôm sách/báo bằng dây”; buộc/bó đồ bằng dây thì dùng 「縛る」hoặc 「束ねる」.
Dịch:
1. Tôi bọc hộp cơm làm buổi sáng bằng chiếc khăn tay lớn rồi cho vào cặp.
2. Lần đầu bế em bé mới sinh, tôi thấy bé rất nhỏ và nhẹ.
3. Để không bị thương, tôi ôm chặt con dao rồi cắt cá.
4. Khi chuyển nhà, tôi buộc sách và tạp chí bằng dây để dễ mang.
Ghi nhớ: 「抱く」= ôm/bế người; 「包む」= bọc; 「持つ」= cầm; 「縛る」= buộc.`,
  },
  toan_q_2022_12_33: {
    number: 33,
    answer: 4,
    promptIncludes: '原料',
    options: [
      'ここから見える景色を原料にして、抽象的な絵をかくつもりだ。',
      '大学を卒業したら、留学の経験を原料にして仕事をしたい。',
      'このドラマは、海外の小説を原料にしたそうです。',
      '牛乳を原料にして、チーズやバターが作られます。',
    ],
    sectionOptions: [
      'ここから見える景色を原料にして、抽象的な絵をかくつもりだ。',
      '大学を卒業したら、留学の経験を原料にして仕事がしたい。',
      'このドラマは、海外の小説を原料にしたそうです。',
      '牛乳を原料にして、チーズやバターが作られます。',
    ],
    explanation: `Đáp án 4. 「原料」（げんりょう）là nguyên liệu ban đầu để chế tạo/sản xuất sản phẩm khác.
1. 「景色を原料にして絵をかく」: dùng phong cảnh làm “nguyên liệu” để vẽ tranh; đề tài/mô-típ thường nói là 「題材」.
2. 「留学の経験を原料にして仕事をしたい」: kinh nghiệm du học được vận dụng/làm nền tảng cho công việc, không phải nguyên liệu vật chất; tự nhiên hơn là 「経験を生かす」 hoặc 「経験を基にする」.
3. 「海外の小説を原料にしたドラマ」: bộ phim dựa trên tiểu thuyết nước ngoài; tác phẩm gốc gọi là 「原作」 hoặc 「原案」.
4. Sữa là nguyên liệu để làm phô mai và bơ, nên 「原料」 được dùng đúng.
Dịch:
1. Tôi định dùng phong cảnh nhìn thấy từ đây làm “nguyên liệu” để vẽ một bức tranh trừu tượng.
2. Sau khi tốt nghiệp đại học, tôi muốn dùng kinh nghiệm du học làm “nguyên liệu” cho công việc.
3. Nghe nói bộ phim này được làm từ một tiểu thuyết nước ngoài.
4. Phô mai và bơ được làm từ sữa làm nguyên liệu.
Ghi nhớ: 「原料」= nguyên liệu sản xuất; 「題材」= đề tài; 「原作」= tác phẩm gốc.

Từ trọng tâm: 「原料」（げんりょう）= nguyên liệu ban đầu dùng để sản xuất sản phẩm khác.`,
    sourceNote:
      'PDF Ver 1.0 xác nhận câu và ý nghĩa các phương án ở câu 33; có khác biệt chép liệu nhỏ giữa đề toàn phần và đề rời (描く/かく, 仕事をしたい/仕事がしたい), nên giữ nguyên từng bản và dùng giải thích chung theo ngữ nghĩa.',
  },
  toan_q_2022_12_34: {
    number: 34,
    answer: 1,
    promptIncludes: '異常',
    options: [
      '今年の夏は異常な暑さで、エアコンがよく売れたそうだ。',
      'その色は見えにくいので、赤などの異常な色を使ってください。',
      '妹の作文は上手に書けていたが、異常な漢字が一つあった。',
      '姉の靴は、私とは異常なサイズなので、借りることができない。',
    ],
    explanation: `Đáp án 1 — 「異常」（いじょう）là bất thường, khác hẳn mức thông thường; 「異常な暑さ」diễn tả cái nóng vượt xa bình thường.
1. 今年の夏は異常な暑さ: mùa hè năm nay nóng bất thường; dùng 「異常」tự nhiên.
2. 異常な色を使ってください: màu “bất thường” không đồng nghĩa với màu dễ nhìn/nổi bật; ở đây hợp hơn là 「はっきりした色」hoặc 「目立つ色」.
3. 異常な漢字: một chữ Hán bất thường; nếu muốn nói viết sai thì 「間違った漢字」, nếu muốn nói hiếm/lạ thì 「珍しい漢字」.
4. 異常なサイズ: kích thước khác thường; câu so sánh cỡ giày của chị với người nói chỉ cần 「サイズが違う」, không phải 「異常」.
Dịch:
1. Nghe nói mùa hè năm nay nóng bất thường nên điều hòa bán rất chạy.
2. Vì màu đó khó nhìn nên hãy dùng màu nổi bật như màu đỏ.
3. Bài văn của em gái tôi viết tốt, nhưng có một chữ Hán khác thường.
4. Cỡ giày của chị tôi khác cỡ của tôi nên tôi không thể mượn.
Ghi nhớ: 「異常」= bất thường/đáng lo; 「違う」= khác; 「間違った」= sai.`,
  },
  toan_q_2022_12_35: {
    number: 35,
    answer: 3,
    promptIncludes: '重なる',
    sourceOptions: [
      'A銀行とB銀行が重なって、新しい銀行ができました。',
      '私たちの研究会に、来月から新しい仲間が重なります。',
      '子どもの運動会が大切な会議と重なった、見に行けない。',
      '貯金がたくさん重なったら、車を買おうと思っている。',
    ],
    options: [
      'A銀行とB銀行が重なって、新しい銀行ができました。',
      '私たちの研究会に、来月から新しい仲間が重なります。',
      '子どもの運動会が大切な会議と重なったので、見に行けない。',
      '貯金がたくさん重なったら、車を買おうと思っている。',
    ],
    sourceSectionOptions: [
      'A銀行とB銀行が重なって、新しい銀行ができました。',
      '私たちの研究会に、来月から新しい仲間が重なります。',
      '子どもの運動会が大切な会議と重なった、見に行けない。',
      '貯金がたくさん重なったら、車を買おうと思っている。',
    ],
    sectionOptions: [
      'A銀行とB銀行が重なって、新しい銀行ができました。',
      '私たちの研究会に、来月から新しい仲間が重なります。',
      '子どもの運動会が大切な会議と重なったので、見に行けない。',
      '貯金がたくさん重なったら、車を買おうと思っている。',
    ],
    explanation: `Đáp án 3 — 「重なる」（かさなる）có thể chỉ hai sự việc xảy ra cùng thời điểm. Ngày hội thể thao trùng lịch họp nên người nói không thể đến xem.
1. A銀行とB銀行が重なって: “Hai ngân hàng chồng lên nhau”; nếu hai ngân hàng hợp nhất để thành ngân hàng mới thì dùng 「合併する」.
2. 新しい仲間が重なります: “Một thành viên mới chồng lên nhóm”; người mới tham gia thì nói 「加わる・参加する」.
3. 運動会が会議と重なったので: sự kiện thể thao trùng thời điểm với cuộc họp; 「重なる」dùng đúng. Câu đã được bổ sung 「ので」theo PDF tham khảo để nối nguyên nhân với kết quả cho tự nhiên.
4. 貯金がたくさん重なったら: “Khi tiền tiết kiệm chồng lên nhiều”; tiền tích lũy thì nói 「貯まる」.
Dịch:
1. Hai ngân hàng A và B chồng lên nhau rồi một ngân hàng mới được thành lập.
2. Từ tháng sau một thành viên mới sẽ “chồng thêm” vào nhóm nghiên cứu của chúng tôi.
3. Ngày hội thể thao của con trùng với cuộc họp quan trọng nên tôi không thể đến xem.
4. Khi tích cóp được nhiều tiền tiết kiệm, tôi định mua ô tô.
Ghi nhớ: lịch/sự kiện trùng nhau 「重なる」; tổ chức sáp nhập 「合併する」; người tham gia 「加わる」; tiền tiết kiệm 「貯まる」.`,
    sourceNote:
      'PDF tham khảo Ver 1.0 ghi 「重なったので、見に行けない」; đã sửa câu trả lời lựa chọn 3 bằng cách thêm ので, giữ nguyên khóa 3.',
  },
}

const readJson = (file) => JSON.parse(fs.readFileSync(file, 'utf8'))
const exams = readJson(masterPath)
const sectionExams = readJson(sectionPath)
const curated = readJson(curatedPath)
const fullExam = exams.find((exam) => exam.id === 'toan-n3-202212-full')
const sectionExam = sectionExams.find((exam) => exam.id === 'cm2u2xxmo019t134izzsjxgrl-vocab')
if (!fullExam || !sectionExam) throw new Error('Missing December 2022 full or vocabulary-only exam')

const fullQuestions = new Map(
  fullExam.parts.flatMap((part) => part.questions || []).map((question) => [question.id, question])
)
const standaloneByPrompt = new Map(
  sectionExam.parts
    .flatMap((part) => part.questions || [])
    .map((question) => [question.question.replace(/<[^>]*>/gu, ''), question])
)

const reportRows = []
for (const [questionId, review] of Object.entries(reviews)) {
  const question = fullQuestions.get(questionId)
  if (!question) throw new Error(`Missing full-exam question ${questionId}`)
  if (Number(question.answer) !== review.answer || Number(question.correctAnswer) !== review.answer) {
    throw new Error(`Unexpected answer key for ${questionId}; refusing to modify it`)
  }
  if (
    !String(question.question || '')
      .replace(/<[^>]*>/gu, '')
      .includes(review.promptIncludes)
  ) {
    throw new Error(`Unexpected prompt for ${questionId}; refusing to overwrite its explanation`)
  }
  const options = question.options.map((option) => option.replace(/^\s*[1-4][.．、]?\s*/u, '').trim())
  const sourceOptions = review.sourceOptions || review.options
  if (
    JSON.stringify(options) !== JSON.stringify(sourceOptions) &&
    JSON.stringify(options) !== JSON.stringify(review.options)
  ) {
    throw new Error(`Unexpected choices for ${questionId}: ${JSON.stringify(options)}`)
  }

  const prompt = question.question
    .replace(/<[^>]*>/gu, '')
    .replace(/\s+/gu, ' ')
    .trim()
  const standalone =
    standaloneByPrompt.get(prompt.replace(/\s+。/gu, '。')) ||
    [...standaloneByPrompt.values()].find((item) =>
      item.question.replace(/<[^>]*>/gu, '').includes(review.promptIncludes)
    )
  if (!standalone) throw new Error(`Missing vocabulary-only copy for ${questionId}`)
  if (
    String(standalone.answer) !== String(review.answer) ||
    String(standalone.correctAnswer) !== String(review.answer)
  ) {
    throw new Error(`Unexpected standalone answer key for ${questionId}`)
  }
  const standaloneOptions = standalone.options.map((option) => option.text.trim())
  const expectedStandaloneOptions = review.sectionOptions || review.options
  const sourceStandaloneOptions = review.sourceSectionOptions || expectedStandaloneOptions
  if (
    JSON.stringify(standaloneOptions) !== JSON.stringify(sourceStandaloneOptions) &&
    JSON.stringify(standaloneOptions) !== JSON.stringify(expectedStandaloneOptions)
  ) {
    throw new Error(`Unexpected standalone choices for ${questionId}: ${JSON.stringify(standaloneOptions)}`)
  }

  if (JSON.stringify(options) === JSON.stringify(sourceOptions) && review.sourceOptions) {
    question.options = question.options.map((option, index) => {
      const prefix = option.match(/^\s*[1-4][.．、]?\s*/u)?.[0] || ''
      return `${prefix}${review.options[index]}`
    })
  }
  if (JSON.stringify(standaloneOptions) === JSON.stringify(sourceStandaloneOptions) && review.sourceSectionOptions) {
    standalone.options = standalone.options.map((option, index) => ({
      ...option,
      text: expectedStandaloneOptions[index],
    }))
  }

  if (review.correctStandaloneQuestion) {
    if (
      standalone.question !== review.correctStandaloneQuestion &&
      standalone.question !== review.incorrectStandaloneQuestion
    ) {
      throw new Error(`Unexpected standalone prompt for ${questionId}; refusing to overwrite it`)
    }
    standalone.question = review.correctStandaloneQuestion
    standalone.sentence = review.correctStandaloneQuestion
  }
  question.explanation = review.explanation
  standalone.explanation = review.explanation
  curated[questionId] = review.explanation
  reportRows.push({
    questionId,
    questionNumber: review.number,
    answer: review.answer,
    choices: review.options,
    sectionChoices: expectedStandaloneOptions,
    issue:
      'Incorrect or missing answer explanations were replaced with context-checked meanings and a Vietnamese translation.' +
      (review.sourceNote ? ` ${review.sourceNote}` : ''),
    copies: [
      { file: 'data/jlpt_n3_toan_master.json', examId: fullExam.id, questionId },
      { file: 'data/jlpt_full_master.json', examId: sectionExam.id, questionId: standalone.id },
    ],
  })
}

fs.writeFileSync(masterPath, `${JSON.stringify(exams, null, 2)}\n`, 'utf8')
fs.writeFileSync(sectionPath, `${JSON.stringify(sectionExams, null, 2)}\n`, 'utf8')
fs.writeFileSync(curatedPath, `${JSON.stringify(curated, null, 2)}\n`, 'utf8')

const report = {
  generatedAt: new Date().toISOString(),
  exam: 'JLPT N3 December 2022',
  scope:
    'All 35 vocabulary questions; rewrote incomplete/gloss-misaligned explanations, corrected the confirmed q15 transcription typo, and restored 「ので」 to q35 choice 3 based on the Ver 1.0 source copy.',
  method:
    'The rendered answer page exposed unrelated dictionary glosses and explanations that did not translate or distinguish every choice. Explanations were rewritten against the Japanese options and sentence context. A shared-copy question PDF labelled Ver 1.0 was checked: it confirms q15 and q35 wording and q33 content but differs from the current dataset in several distractors/text details, so it is not treated as the authoritative version for the full exam. Only q15, whose standalone copy contained a clear typo, and q35 choice 3, whose causal link was missing ので, were normalized to that copy. Answer labels were retained; a user-provided answer-key PDF has unknown provenance and is not an official JLPT key.',
  questionPaperReference: {
    name: 'N3 December 2022 Ver 1.0 shared-copy question PDF',
    url: questionPaperSource,
    qualification:
      'This copy confirms q15 wording/options, q33 content and the natural q35 sentence, but differs from the current dataset in distractors/text details including q3, q4, q8, q12–14, q30 and q31. It is a version reference, not an official or definitive source for those mismatched questions.',
    sourceNotes: {
      q12: 'Current dataset choices 楽顔・悲顔・泣顔・笑顔; Ver 1.0 choices 顔笑・頭笑・笑頭・笑顔.',
      q13: 'Current dataset choices 黒板・黒坂・告板・告坂; Ver 1.0 choices 黒板・黒坂・看板・看坂. The explanation follows the current choices; the variant remains unresolved.',
      q30: 'Ver 1.0 choice 1 is 生き方; the current dataset is 行き方. This variant remains unresolved.',
      ...Object.fromEntries(
        Object.entries(reviews)
          .filter(([, row]) => row.sourceNote)
          .map(([id, row]) => [id, row.sourceNote])
      ),
    },
  },
  answerKeySource: {
    name: 'User-provided JLPT N3 answer-key PDF',
    url: answerKeySource,
    qualification:
      'Page 25 lists answers 4, 1, 2, 1, 3 for questions 12 and 26–29. It supports the retained answer labels but is not an official source and does not validate the question text.',
  },
  rows: reportRows,
}
fs.writeFileSync(reportPath, `${JSON.stringify(report, null, 2)}\n`, 'utf8')
console.log(
  `Corrected glossary explanations in both December 2022 vocabulary datasets for ${reportRows.length} questions; answer keys unchanged.`
)
