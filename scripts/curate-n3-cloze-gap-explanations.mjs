import fs from 'node:fs'

const masterPath = 'data/jlpt_n3_toan_master.json'
const curatedPath = 'data/jlpt_n3_explanations_curated.json'
const exams = JSON.parse(fs.readFileSync(masterPath, 'utf8'))
const curated = JSON.parse(fs.readFileSync(curatedPath, 'utf8'))

// Each entry gives the Vietnamese sense of the sentence around the blank and a
// separate explanation for every answer choice. This is editorial content;
// the script checks only that it is attached to the expected keyed question.
const cases = {
  toan_q_2022_12_54: {
    translation: 'Ở Nhật, lần đầu tiên tôi ngủ trong một căn phòng trải chiếu tatami và lần đầu tắm suối nước nóng.',
    notes: [
      '温泉 (suối nước nóng) được giới thiệu lần đầu nên dùng danh từ trực tiếp; hợp với 「初めての温泉」.',
      'あの温泉 là “suối nước nóng kia”, cần một nơi đã được nhắc hoặc ở xa người nói; đoạn văn chưa xác lập nơi đó.',
      'そんな温泉 là “suối nước nóng như thế”, thường hồi chỉ đặc điểm đã nói; ở đây chỉ kể lần đầu trải nghiệm.',
      'これらの温泉 là “những suối nước nóng này”, số nhiều và có sắc thái chỉ định, không hợp với một trải nghiệm đơn lẻ.',
    ],
    rule: 'Danh từ mới được nêu thường không cần từ chỉ định; 初めて nhấn mạnh trải nghiệm lần đầu.',
  },
  toan_q_2022_12_56: {
    translation: 'Nhân viên nói rằng chiếc đồng hồ đã bị rơi ở gần lối vào suối nước nóng.',
    notes: [
      '落ちたままでです vừa sai kết hợp (ままです mới tự nhiên), vừa không thuật lại lời nhân viên.',
      '落ちたばかりです là “vừa mới rơi”; người kể không biết thời điểm rơi, mà đang truyền đạt lời được nghe.',
      '落ちていたそうです là “nghe nói đã nằm rơi ở đó”; そうです biểu thị thông tin nghe được, hợp với lời nhân viên.',
      '落ちていたことです không tạo vị ngữ tự nhiên ở đây; こと danh từ hóa nhưng thiếu cấu trúc để nối với câu.',
    ],
    rule: 'Động từ thể thường + そうです có thể thuật lại thông tin nghe được; 落ちていた tả trạng thái đã rơi và nằm ở đó.',
  },
  toan_q_2022_07_53: {
    translation: 'Nhà máy tôi đã tham quan là nhà máy của một công ty kem.',
    notes: [
      '見学する là hiện tại/tương lai “tham quan”; không khớp chuyến đi đã thực hiện tháng trước.',
      '見学した là quá khứ “đã tham quan”, bổ nghĩa tự nhiên cho のは: điều tôi đã tham quan là nhà máy kem.',
      '見学している diễn tả đang tham quan hoặc trạng thái tiếp diễn; không kể chuyến thăm đã kết thúc.',
      '見学してある dùng てある cho kết quả của hành động có chủ ý lên vật; không thể dùng để nói người viết đã đi tham quan.',
    ],
    rule: 'Mệnh đề động từ quá khứ + のは…だ dùng để nêu/giải thích sự việc đã xảy ra.',
  },
  toan_q_2022_07_55: {
    translation:
      'Phần lớn người tham quan bắt đầu thích sản phẩm được làm tại nhà máy ấy và có ấn tượng tốt hơn về công ty.',
    notes: [
      'これ thường chỉ vật gần người nói; これで作られる còn khiến これ thành nguyên liệu/công cụ, sai quan hệ.',
      'それ chỉ vật đã nhắc nhưng không kết hợp làm địa điểm với で trong câu này; cần đại từ địa điểm.',
      'ここで作られる có thể đúng nếu người viết đang chỉ nơi mình đứng; đoạn văn hồi tưởng nhà máy đã tham quan, nên cách chỉ nơi được nhắc đến là そこで.',
      'そこで chỉ địa điểm đã được nhắc trước (nhà máy); そこで作られている là “được sản xuất ở đó”, đúng ngữ cảnh.',
    ],
    rule: 'そこ + で chỉ nơi đã được nhắc trong văn cảnh; ここ có thể đúng khi điểm nhìn đặt ngay tại nơi đó, nhưng không phải điểm nhìn của câu hồi tưởng này.',
  },
  toan_q_2022_07_56: {
    translation: 'Trong thời gian ở Nhật, tôi dự định sẽ đi tham quan nhiều nhà máy.',
    notes: [
      '行ってみてほしいです là mong người khác đi thử; người viết đang nói kế hoạch của chính mình.',
      '行ってみたがっています diễn tả mong muốn quan sát được ở người thứ ba, không phải dự định “tôi sẽ đi”.',
      '行ってみるつもりです diễn tả dự định của người nói; khớp với việc đang tìm nhà máy tiếp theo.',
      '行ってみるといいです là lời khuyên “nên thử đi”, không phải lời tự thuật kế hoạch.',
    ],
    rule: 'Động từ thể từ điển + つもりです diễn tả dự định của chính người nói.',
  },
  toan_q_2021_12_55: {
    translation: 'Một người bạn đã tặng tôi chiếc ô; trên đó có hình hoa anh đào.',
    notes: [
      'その友達 đòi hỏi người bạn đã được nhắc đến trước đó; câu này đang giới thiệu người bạn tặng ô.',
      'こういう友達 là “người bạn kiểu như thế này”, cần đặc điểm/loại bạn để hồi chỉ; không tự nhiên ở đây.',
      'どちらかの友達 nghĩa là “một trong hai người bạn”; văn bản không đưa ra cặp lựa chọn nào.',
      '友達 là danh từ mới, không cần từ chỉ định; nó làm chủ thể tự nhiên của 「傘をプレゼントしてくれた」.',
    ],
    rule: 'Danh từ chưa xuất hiện trong mạch kể thường được giới thiệu không kèm その／あの; くれる cho biết người khác làm việc có lợi cho người kể.',
  },
  toan_q_2021_12_56: {
    translation: 'Bên trong chiếc ô có vẽ hình hoa anh đào — đó là điều tôi vừa nhận ra.',
    notes: [
      'かいてあったそうです là nghe nói có vẽ; người kể đang trực tiếp nhìn thấy hình vẽ, không thuật lại tin nghe được.',
      'かいてあったのです giải thích/phát hiện điều được xác nhận ngay sau khi mở ô; のです nêu điều vừa nhận ra.',
      'かいてあったはずです là suy đoán “chắc hẳn đã được vẽ”; không hợp khi người kể đang nêu sự thật nhìn thấy.',
      'かいてあったおかげです nghĩa là “nhờ có hình đã vẽ”; おかげ đòi hỏi kết quả tốt theo sau, không tạo câu ở đây.',
    ],
    rule: '～のです dùng để giải thích hoặc làm rõ thông tin; trong bài kể, nó nhấn mạnh phát hiện bất ngờ khi nhìn vào mặt trong ô.',
  },
  toan_q_2021_12_57: {
    translation: 'Khi những ngày nắng kéo dài, đôi lúc tôi cũng mong trời mưa.',
    notes: [
      '思うこともあります nghĩa là “cũng có lúc nghĩ/mong như vậy”; こともある diễn tả việc thỉnh thoảng xảy ra.',
      '思ったらいいです là lời khuyên “nghĩ như vậy thì tốt”; sai vì câu đang kể cảm xúc của người viết.',
      '思うことができません là “không thể nghĩ/mong”; trái với ý người viết thỉnh thoảng mong mưa.',
      '思わなくなりました là “đã không còn nghĩ/mong nữa”; ngược với ý mong mưa đôi lúc.',
    ],
    rule: 'Động từ thể từ điển + こともある diễn tả một việc đôi khi xảy ra.',
  },
  toan_q_2020_12_57: {
    translation: 'Nếu có dịp, lần tới tôi cũng muốn xếp hàng ở một quán nổi tiếng khác.',
    notes: [
      'その人気店 là “quán nổi tiếng đó”, cần một quán đã xác định; câu muốn nói một quán khác.',
      'どの人気店 là “quán nổi tiếng nào”, phải đi cùng câu hỏi hoặc cấu trúc lựa chọn; ở đây không có.',
      '別の人気店 nghĩa là “một quán nổi tiếng khác”, đối chiếu với quán bánh phô mai vừa kể; đúng mạch.',
      'チーズケーキの人気店 nghĩa là “quán nổi tiếng bán bánh phô mai”; có thể hiểu ngữ pháp nhưng lặp lại loại quán cũ, không thể hiện ý muốn thử nơi khác.',
    ],
    rule: '別の + danh từ dùng khi chuyển sang một đối tượng khác cùng loại.',
  },
  toan_q_2019_12_55: {
    translation:
      'Trước tiên, tôi vứt hết những món đồ không cần thiết trong nhà; sau đó lau cửa sổ và vết dầu trong bếp.',
    notes: [
      'まず nghĩa là “trước tiên”, đánh dấu bước đầu trong chuỗi việc dọn dẹp rồi đến lau chùi.',
      'または là “hoặc”, dùng nêu lựa chọn; ở đây các việc được làm nối tiếp, không phải lựa chọn thay thế.',
      'すると nghĩa là “ngay sau đó/thế là”, thường nối kết quả hoặc việc xảy ra sau; không đánh dấu rõ bước đầu như câu cần.',
      'ところが báo hiệu kết quả trái dự đoán; câu sau chỉ liệt kê việc tiếp theo, không có tương phản.',
    ],
    rule: 'まず／次に／それから dùng để sắp xếp trình tự thao tác.',
  },
  toan_q_2017_12_56: {
    translation: 'Biết rằng mình cũng có thể đi hát karaoke một mình, tôi quyết định thử đi.',
    notes: [
      '行ってみることになっています là lịch/quy định đã được quyết định từ bên ngoài; câu kể quyết định cá nhân của tôi.',
      '行ってみることにしました nghĩa là “đã quyết định thử đi”; ことにする diễn tả lựa chọn do chủ thể tự quyết.',
      '行かせてくれたことです là “việc ai đó cho phép tôi đi”; không có ai cấp phép trong ngữ cảnh.',
      '行かせることができました là “đã có thể bắt/cho ai đi”; sai chủ thể và hàm ý sai so với tự mình đi thử.',
    ],
    rule: 'ことにする = tự quyết định; ことになる = được quyết định/được sắp xếp bởi hoàn cảnh hoặc bên khác.',
  },
  toan_q_2016_12_56: {
    translation: 'Câu chuyện về thời tiết đã mở rộng sang những chủ đề liên quan đến thời tiết, khiến tôi thấy thú vị.',
    notes: [
      '広がって nối kết quả mở rộng với cảm nhận おもしろいと思いました; đúng cả nghĩa lẫn cách nối câu.',
      '広がるより là “thay vì lan rộng” hoặc “hơn là lan rộng”; より cần một đối chiếu không có trong câu.',
      '広がるように mang nghĩa “để nó lan rộng”; ように biểu thị mục đích/kết quả hướng tới, không phải việc đã xảy ra.',
      '広がったそうで là “nghe nói đã lan rộng”, thường cần mệnh đề tiếp nối phù hợp; câu đang kể trải nghiệm trực tiếp của người viết.',
    ],
    rule: 'Vて nối hành động/kết quả với đánh giá tiếp theo: 話題が広がって、おもしろかった.',
  },
  toan_q_2016_07_55: {
    translation:
      'Đúng lúc tôi đang xem đầu máy DVD trong cửa hàng thì một khách hàng đến hỏi nhân viên về một chiếc máy.',
    notes: [
      'また nghĩa là “lại/thêm nữa”; không diễn tả sự việc tiếp theo xảy đến trong cảnh kể.',
      'すると nối một tình huống với sự việc kế tiếp “thế thì/ngay sau đó”; khách hàng xuất hiện khi người kể đang xem máy.',
      'だから là “vì vậy”, cần quan hệ nguyên nhân-kết quả; hai sự việc ở đây được kể theo trình tự.',
      'そのうえ là “hơn nữa”, thêm một lý do/đặc điểm; không phù hợp với hành động bất ngờ tiếp theo.',
    ],
    rule: 'すると thường dùng trong văn kể để dẫn sự việc xuất hiện ngay sau tình huống vừa nêu.',
  },
  toan_q_2015_12_55: {
    translation: 'Tôi đã bỏ rác đúng ngày quy định, nhưng buổi tối về nhà thì thấy rác vẫn chưa được thu gom.',
    notes: [
      'また nghĩa là “cũng/lại”; không đánh dấu kết quả trái với điều người viết mong đợi.',
      'たとえば nghĩa là “ví dụ”; câu sau là một sự kiện cụ thể nhưng quan hệ cần nhấn mạnh là trái dự đoán.',
      'それに là “hơn nữa”; bổ sung thông tin cùng chiều, không biểu thị chuyện rác chưa được lấy.',
      'ところが nghĩa là “thế nhưng”, dẫn kết quả ngược mong đợi sau khi đã để rác đúng nơi/đúng ngày.',
    ],
    rule: 'ところが nối sự việc trái với dự đoán hoặc tình huống ngay trước đó.',
  },
  toan_q_2015_12_58: {
    translation: 'Từ đó, vấn đề môi trường mà trước đây tôi ít khi nghĩ đến dường như trở nên gần gũi hơn.',
    notes: [
      '気がするそうです ghép hai cách nói không tự nhiên: 気がする đã nêu cảm nhận, còn そうです không cần thiết ở đây.',
      '気がしたのでしょうか là câu hỏi suy đoán về cảm giác quá khứ; không hợp với nhận xét hiện tại của người kể.',
      '気がします kết hợp với ような tạo 「身近になったような気がします」, “tôi có cảm giác như đã trở nên gần gũi”.',
      '気がしたようです là “có vẻ đã cảm thấy” theo suy đoán/hồi thuật, không phải cảm nhận trực tiếp hiện giờ.',
    ],
    rule: '～ような気がします là cách nói dè dặt “tôi có cảm giác như…”; します giữ cảm nhận ở hiện tại.',
  },
  toan_q_2015_07_55: {
    translation: 'Hồi đó, mỗi khi làm không tốt, tôi thường nhanh chóng bỏ cuộc.',
    notes: [
      'それから nghĩa là “sau đó/rồi”; nối trình tự, nhưng không chỉ khoảng thời gian được hồi tưởng.',
      'そのほか nghĩa là “ngoài ra”; cần thêm một mục/sự vật khác, không hợp câu kể thói quen cũ.',
      'そのころ nghĩa là “vào khoảng thời gian ấy”; hồi chỉ giai đoạn trước khi lời thầy khiến người viết thay đổi.',
      'それでも nghĩa là “dù vậy”; cần ý nhượng bộ/tương phản, trong khi câu nêu thói quen thời đó.',
    ],
    rule: 'そのころ dùng để chỉ thời điểm/giai đoạn vừa được nhắc trong mạch kể.',
  },
  toan_q_2014_12_54: {
    translation: 'Khi mang chiếc cốc ấy đến quầy tính tiền, một chuyện khiến tôi ngạc nhiên đã xảy ra.',
    notes: [
      'それ chỉ vật gần trong mạch diễn ngôn vừa nhắc — chiếc cốc vừa quyết định mua; đúng với vật được mang đến quầy.',
      'あれ thường chỉ vật xa cả người nói và người nghe hoặc chuyện xa trong ký ức; không hợp vật đang cầm.',
      'そっち là “phía bên đó/đằng ấy”, chỉ phương hướng hoặc lựa chọn; không dùng thay cho chiếc cốc.',
      'あっち là cách nói thân mật “đằng kia”, chỉ hướng/nơi ở xa; câu cần đại từ chỉ vật を.',
    ],
    rule: 'それ có thể hồi chỉ một vật vừa được nêu trong lời kể; そっち／あっち thiên về phương hướng.',
  },
  toan_q_2014_12_55: {
    translation: 'Thấy tôi không hiểu câu hỏi, nhân viên đã nói lại rõ hơn: “Dùng ở nhà hay làm quà tặng ạ?”',
    notes: [
      '言い返しました là “đáp trả/cãi lại”; không hợp thái độ giúp khách hiểu.',
      '言い直しませんでした là “đã không nói lại”; trái với việc nhân viên diễn đạt lại câu hỏi.',
      '言い返さないでくれました không tự nhiên và mang nghĩa “đã không đáp trả”; không diễn tả giúp giải thích.',
      '言い直してくれました là “đã nói lại giúp tôi”; 言い直す sửa/cách nói lại, くれる cho thấy hành động có lợi cho người kể.',
    ],
    rule: 'Vてくれる nêu hành động người khác làm cho/người kể; 言い直す là diễn đạt lại cho dễ hiểu.',
  },
  toan_q_2014_12_56: {
    translation: 'Sau khi tôi trả lời “là quà tặng”, nhân viên liền cho cốc vào hộp và bắt đầu gói.',
    notes: [
      '実は nghĩa là “thật ra”; dùng để hé lộ sự thật, không nối sự kiện tiếp diễn theo thời gian.',
      'すると nối hành động vừa kể với điều xảy ra ngay sau đó; đúng với nhân viên bắt đầu gói sau câu trả lời.',
      'ところで đổi chủ đề hoặc đưa câu hỏi ngoài mạch; đoạn văn vẫn kể cùng một chuỗi hành động.',
      '例えば giới thiệu ví dụ; phần sau không phải ví dụ cho một khái quát vừa nêu.',
    ],
    rule: 'すると có nghĩa “thế thì/ngay sau đó” trong chuỗi kể sự kiện.',
  },
  toan_q_2014_12_57: {
    translation:
      'Dù gói trong thời gian ngắn, giấy vừa khít với hình chiếc hộp, như thể đã được cắt/gấp rất đẹp ngay từ đầu.',
    notes: [
      '包まれていたものでした là cấu trúc danh từ hóa thiếu tự nhiên trong vị trí này; もの không diễn tả phỏng đoán quan sát.',
      '包まれていたことでした cũng danh từ hóa bằng こと nhưng không tạo vị ngữ thích hợp cho câu.',
      '包まれていたみたいでした nghĩa là “trông như đã được gói”; みたいだ nêu nhận định dựa trên hình dáng nhìn thấy.',
      '包まれていたからでした là “là vì đã được gói”; から cần nguyên nhân được giải thích, không hợp mô tả vẻ ngoài.',
    ],
    rule: '～みたいだ／みたいでした dùng nêu sự suy đoán hoặc vẻ ngoài “có vẻ như”.',
  },
  toan_q_2014_12_58: {
    translation: 'Tôi muốn mua một món quà ở cửa hàng bách hóa, nhờ gói rồi cho gia đình xem.',
    notes: [
      '見せるだろうと思っていました là “đã nghĩ chắc sẽ cho xem”; chuyển từ dự định sang phỏng đoán về tương lai.',
      '見せようと思っています nghĩa là “đang định cho xem”; ý chí 見せよう + と思っています nêu dự định hiện tại.',
      '見せるだろうと思うはずです chồng nhiều cấu trúc suy đoán/kỳ vọng và không tự nhiên trong lời kể.',
      '見せようと思ったかもしれません là “có lẽ đã định cho xem”; suy đoán về ý định quá khứ của chính mình không hợp.',
    ],
    rule: '意向形 + と思っています diễn tả dự định hiện tại của người nói.',
  },
  toan_q_2014_07_54: {
    translation: 'Món bánh vị anh đào mà tôi mua khi ấy là sô-cô-la.',
    notes: [
      'チョコレートでした nhận diện danh từ ở quá khứ và hoàn tất câu 「桜味のチョコレートでした」.',
      'チョコレートにしてみます là “tôi sẽ thử chọn sô-cô-la”; nói quyết định tương lai, không kể món đã mua.',
      'チョコレートのことでした là “chuyện về sô-cô-la”; のこと không thể thay tên món bánh trong cấu trúc này.',
      'チョコレートにするつもりです là “định chọn sô-cô-la”; mâu thuẫn với sự việc đã xảy ra lúc mới đến Nhật.',
    ],
    rule: 'Nでした dùng xác định/miêu tả sự vật trong câu chuyện quá khứ.',
  },
  toan_q_2014_07_55: {
    translation:
      'Tôi muốn ăn lại loại bánh ấy, nhưng dù tìm thế nào cũng không thấy; cửa hàng cho biết bánh vị anh đào chỉ bán vào mùa xuân.',
    notes: [
      'それで biểu thị kết quả “vì vậy”; không diễn tả việc tìm mãi mà không thấy trái mong đợi.',
      'そのうえ nghĩa là “hơn nữa”; câu sau không bổ sung thuận chiều mà nêu kết quả bất ngờ.',
      'ちなみに nghĩa là “nhân tiện”; thông tin mùa bánh là lời giải thích nguyên nhân, không phải lời chen ngoài lề.',
      'ところが nghĩa là “thế nhưng”; tìm bánh mong muốn nhưng không thấy, tạo tương phản rõ với kỳ vọng.',
    ],
    rule: 'ところが đặt trước kết quả bất ngờ/trái dự đoán.',
  },
  toan_q_2014_07_56: {
    translation: 'Tôi ngạc nhiên khi biết Nhật Bản có những loại bánh như vậy, thay đổi theo bốn mùa.',
    notes: [
      'あるお菓子 là “một loại bánh nào đó”; giới thiệu không xác định, không hồi chỉ các loại bánh theo mùa vừa nêu.',
      'このお菓子 là “loại bánh này”, thường chỉ vật gần/được chọn cụ thể; đoạn văn khái quát nhiều loại.',
      'そういうお菓子 là “những loại bánh như thế”, hồi chỉ bánh theo mùa vừa mô tả; hợp mạch văn.',
      'どちらにも nghĩa là “ở cả hai bên/đều ở cả hai”; cần hai đối tượng song song và không bổ nghĩa tự nhiên cho お菓子.',
    ],
    rule: 'そういう + danh từ hồi chỉ một loại/đặc điểm vừa được mô tả.',
  },
  toan_q_2014_07_57: {
    translation: 'Chủ cửa hàng còn cho tôi biết người Nhật cảm nhận mùa xuân khi nhìn thấy bánh vị anh đào.',
    notes: [
      '教えられました có thể là bị động “được dạy”, nhưng trong câu có 「店の人は…」 làm chủ thể thì cần chủ động.',
      '教えてもらいました là “tôi được người ấy dạy/cho biết”; thông thường cần nêu người nhận bằng に/から, trong khi chủ thể câu đang là 店の人.',
      '教えさせられました là bị ép phải dạy; sai hướng nghĩa vì người bán truyền đạt cho người viết.',
      '教えてくれました là “đã cho tôi biết”; chủ thể 店の人 làm hành động hướng lợi ích về người kể, đúng ngữ cảnh.',
    ],
    rule: 'Người khác làm điều có lợi cho người kể: Vてくれる; người kể nhận hành động thì Vてもらう.',
  },
  toan_q_2014_07_58: {
    translation:
      'Vì không muốn quên cảm giác mới mẻ ngày ấy, tôi nghĩ mình sẽ tiếp tục trân trọng chiếc hộp có hình hoa anh đào.',
    notes: [
      '思いましょう là lời rủ “chúng ta hãy nghĩ”; không phù hợp với ý định riêng của người kể.',
      '思っています hoàn tất cụm 「大切にしようと思っています」: hiện tôi định tiếp tục trân trọng nó.',
      '思うのではありませんか là câu hỏi tu từ “chẳng phải bạn cũng nghĩ… sao?”; câu đang kể dự định của tôi.',
      '思ってもしかたありません nghĩa là “nghĩ cũng chẳng ích gì”; trái hẳn với quyết tâm giữ gìn chiếc hộp.',
    ],
    rule: '意向形 + と思っています nêu ý định đang có; 大切にしよう = sẽ trân trọng/bảo quản.',
  },
  toan_q_2013_12_54: {
    translation:
      'Nhờ thầy đã tận tình chỉ dạy trước khi tôi du học, cuộc sống hiện không có vấn đề lớn; tôi thật sự rất biết ơn thầy.',
    notes: [
      'お願いします là “xin nhờ/nhờ thầy”, dùng khi yêu cầu việc sắp tới; không phải lời cảm ơn về việc đã giúp.',
      'どうぞお構いなく là “xin đừng bận tâm/khách sáo”; dùng đáp lời mời tiếp đãi, sai chức năng ở đây.',
      'お世話になりました là lời cảm ơn vì đã được giúp đỡ/chăm sóc; khớp với việc thầy hướng dẫn trước khi đi du học.',
      'お久しぶりです là “lâu rồi không gặp”; lời chào khi gặp lại, không nối với lời cảm ơn.',
    ],
    rule: 'お世話になりました là cách nói lịch sự bày tỏ lòng biết ơn về sự giúp đỡ đã nhận.',
  },
  toan_q_2013_12_55: {
    translation: 'Cuộc sống đã quen dần, nhưng tôi không nghĩ việc học ở trường lại vất vả đến thế.',
    notes: [
      'あれは大変だ là “chuyện kia vất vả”; あれ chỉ vật/chuyện xa và không bổ nghĩa mức độ cho 大変.',
      'こんなに大変だ nghĩa là “vất vả đến mức này”; こんなに bổ nghĩa tự nhiên cho tính từ và thể hiện mức độ ngoài dự đoán.',
      'それより大変だ là “vất vả hơn điều đó”; cần một chuẩn so sánh được nêu, không có ở đây.',
      'どちらも大変だ là “cả hai đều vất vả”; phải có hai đối tượng rõ ràng để so sánh.',
    ],
    rule: 'こんなに + tính từ diễn tả mức độ “đến thế này”; とは思わなかった nhấn mạnh bất ngờ.',
  },
  toan_q_2013_12_57: {
    translation: 'Vì đã đến Nhật, tôi định từ nay cố gắng đi nhiều nơi nhất có thể và có nhiều trải nghiệm.',
    notes: [
      '出かけたがるはずです là “chắc hẳn (người khác) muốn đi”; không phải ý định của người viết.',
      '出かけるそうです là “nghe nói sẽ đi”; tường thuật lời người khác, không nêu kế hoạch của tôi.',
      '出かけるようにするつもりです nghĩa là “định cố gắng thu xếp để đi”; hợp với mục tiêu đi nhiều nơi kể từ nay.',
      '出かけてほしいのです là “tôi muốn người khác đi”; sai chủ thể so với mong muốn trải nghiệm của người viết.',
    ],
    rule: 'Vるようにする cố gắng tạo thói quen/điều kiện để làm; つもりです diễn tả dự định.',
  },
  toan_q_2013_12_58: {
    translation: 'Nếu có địa điểm nào được gợi ý, tôi muốn nhờ thầy cho biết.',
    notes: [
      '教えてはいかがですか là lời đề nghị người đối diện nên dạy/cho biết; vai người nghe và người nói bị đảo.',
      '教えていただきませんか nghe không tự nhiên như lời nhờ lịch sự; thường dùng 教えていただけませんか.',
      '教えてもよろしいでしょうか là “tôi cho biết có được không?”, người nói tự xin phép được dạy; trái vai giao tiếp.',
      '教えてくださいませんか là lời nhờ lịch sự “thầy có thể cho em biết không?”; phù hợp thư gửi giáo viên.',
    ],
    rule: 'Vてくださいませんか là cách yêu cầu lịch sự; khi nhờ người trên có thể dùng ていただけませんか.',
  },
  toan_q_2013_07_54: {
    translation: 'Khi tôi học tiếng Nhật ở đại học tại Ý, thầy giáo đã mang natto đến bữa tiệc cho chúng tôi.',
    notes: [
      '持ってきてくださったのです nêu lời giải thích “thầy đã mang đến”; khớp việc người viết trực tiếp kể sự việc.',
      '持ってきてくださったそうです là nghe nói thầy mang đến; người viết có mặt ở bữa tiệc nên không cần hearsay.',
      '持っていかれたと思います là “tôi nghĩ đã mang đi”; いく là mang ra xa khỏi điểm nhìn, trái hướng thầy mang đến tiệc.',
      '持っていかれたはずです vừa hướng “mang đi” vừa phỏng đoán chắc hẳn; sai hướng và không hợp hồi ức trực tiếp.',
    ],
    rule: '持ってくる là mang đến phía người nói; てくださる thể hiện kính trọng việc người trên làm cho mình.',
  },
  toan_q_2013_07_55: {
    translation:
      'Ngày trước tôi không ăn được vì natto có mùi nồng; thế nhưng sau này ở Nhật, tôi thử mì Ý natto và thấy rất ngon.',
    notes: [
      'そのうえ nghĩa là “hơn nữa”, thêm ý cùng chiều; câu sau chuyển sang trải nghiệm trái với ấn tượng cũ.',
      'たとえば nghĩa là “ví dụ”; không có ý khái quát nào cần được minh họa.',
      'ところが báo hiệu kết quả trái với điều vừa kể: trước kia không ăn nổi natto nhưng lần này lại thấy ngon.',
      'ちなみに nghĩa là “nhân tiện”; thông tin sau là bước ngoặt của câu chuyện chứ không phải chú thích bên lề.',
    ],
    rule: 'ところが đánh dấu sự tương phản/bất ngờ giữa trải nghiệm cũ và kết quả mới.',
  },
  toan_q_2013_07_56: {
    translation: 'Từ đó, tôi bắt đầu gọi món mì Ý natto mỗi lần đến nhà hàng ấy ba hoặc bốn lần một tuần.',
    notes: [
      '頼んだほうがいいです là lời khuyên “nên gọi”; không diễn tả thói quen đã hình thành.',
      '頼むようになりました nghĩa là “đã bắt đầu gọi/đã thành thói quen gọi”; phù hợp với diễn tiến sau khi ăn thử.',
      '頼もうと思っています là dự định hiện tại “đang định gọi”; câu sau kể thói quen lặp lại đã có.',
      '頼まなければなりません là “phải gọi”; biểu thị nghĩa vụ, không có trong ngữ cảnh.',
    ],
    rule: 'Vるようになる diễn tả sự thay đổi dẫn đến hành động/thói quen mới.',
  },
  toan_q_2013_07_57: {
    translation: 'Tôi cũng thử những loại mì Ý như vậy, chẳng hạn loại dùng mơ hoặc nước tương.',
    notes: [
      'スパゲティも食べてみました là “cũng thử mì Ý”; quá rộng và lặp lại danh từ, không chỉ nhóm vị vừa nêu.',
      'その店のスパゲティ là “mì Ý của quán đó”; không giới hạn vào các vị khác thường đang được nhắc.',
      '納豆スパゲティ là mì Ý natto, món yêu thích cũ; câu đối chiếu những hương vị khác, nên không thể là món này.',
      'そういうスパゲティ hồi chỉ các món mì Ý có vị mơ/nước tương vừa mô tả; phù hợp với ví dụ trước.',
    ],
    rule: 'そういう + danh từ gom/hồi chỉ loại được mô tả ngay trước đó.',
  },
  toan_q_2013_07_58: {
    translation: 'Khi về nước, tôi muốn tự nấu mì Ý natto cho bạn bè và gia đình ăn.',
    notes: [
      '作ってもらえました là “đã được người khác nấu cho”; người viết muốn tự nấu cho gia đình.',
      '作らせてやりました là “đã cho/ép ai nấu”; sai chiều hành động và mang sắc thái bề trên.',
      '作らせてくれます là “ai đó cho phép tôi nấu”; không diễn tả làm món ăn cho người khác.',
      '作ってあげたいです là “muốn nấu/làm cho họ”; てあげる hướng lợi ích về bạn bè và gia đình.',
    ],
    rule: 'Vてあげる diễn tả làm việc gì đó vì lợi ích của người khác; たい nêu mong muốn của người nói.',
  },
  toan_q_2012_12_55: {
    translation: 'Tôi đã tự hỏi liệu có cần đến một chiếc bồn cầu như thế này không.',
    notes: [
      '思っています là suy nghĩ đang giữ ở hiện tại; câu kể phản ứng nảy ra lúc đó, trước khi nghe bà cụ giải thích.',
      '思いました là quá khứ “đã nghĩ”; phù hợp với trình tự: thấy bồn cầu, thấy lạ, rồi tự hỏi.',
      '思ったところです là “vừa mới nghĩ”; nhấn mạnh thời điểm vừa xảy ra, không tự nhiên trong mạch hồi tưởng này.',
      '思います là hiện tại “tôi nghĩ”; không khớp với việc câu chuyện ngay sau đó nói suy nghĩ đã thay đổi.',
    ],
    rule: 'Dùng 思いました để thuật lại suy nghĩ đã có tại một thời điểm trong câu chuyện quá khứ.',
  },
  toan_q_2012_12_56: {
    translation: 'Bà cụ nói rằng khi chỗ ngồi ấm thì người cao tuổi có thể ngồi xuống yên tâm hơn.',
    notes: [
      '座ってしまうからです nghĩa là “vì lỡ/ngồi mất”; しまう biểu thị hoàn tất/đáng tiếc, không diễn tả khả năng.',
      '座るからです là “vì ngồi”; không nêu khả năng và không khớp lời giải thích về sự yên tâm khi chỗ ngồi ấm.',
      '座れることだそうです danh từ hóa bằng こと nhưng không nối tự nhiên sau 安心して; thiếu vị ngữ phù hợp.',
      '座れるのだそうです thuật lại “nghe nói có thể ngồi [yên tâm]”; 座れる là khả năng, のだそうです đánh dấu thông tin được nghe từ bà.',
    ],
    rule: '座れる là thể khả năng của 座る; ～のだそうです dùng thuật lại điều người khác giải thích.',
  },
  toan_q_2012_12_57: {
    translation:
      'Tôi không thấy chỗ ngồi lạnh hay việc mở nắp là khó, nhưng với người cao tuổi thì có lẽ không đơn giản như vậy.',
    notes: [
      'なぜなら mở đầu lý do “bởi vì”; câu sau nói trái với đánh giá của người viết, không giải thích nguyên nhân.',
      'ちなみに nghĩa là “nhân tiện”; không chuyển giữa hai cách nhìn đối lập.',
      'しかし nghĩa là “tuy nhiên”; nối tương phản giữa việc người viết thấy dễ và việc người cao tuổi có thể thấy khó.',
      'また nghĩa là “cũng/thêm nữa”; chỉ bổ sung cùng chiều, không nêu đối lập.',
    ],
    rule: 'しかし đặt trước ý đối lập hoặc điều chỉnh nhận định vừa nêu.',
  },
  toan_q_2012_12_58: {
    translation: 'Tôi tự hỏi liệu loại bồn cầu này có được tạo ra vì Nhật Bản có nhiều người cao tuổi hay không.',
    notes: [
      'が đánh dấu chủ thể của câu bị động: トイレが作られた, “chiếc bồn cầu được tạo ra”.',
      'に thường đánh dấu đích/đối tượng hoặc tác nhân trong bị động; không phải chủ thể của 作られた ở đây.',
      'で đánh dấu nơi/công cụ thực hiện hành động; câu không nói nơi chiếc bồn cầu được làm ra.',
      'から nghĩa là “từ/bởi vì”; không thể thay trợ từ chủ thể trước vị ngữ bị động này.',
    ],
    rule: 'Trong câu bị động, vật chịu tác động có thể làm chủ ngữ và đi với が: トイレが作られる.',
  },
  toan_q_2012_07_54: {
    translation: 'Có phải các anh chị và bạn bè của tôi nhầm, hay điều tôi đã học mới là sai?',
    notes: [
      'ところで chuyển chủ đề (“nhân tiện”), không nêu lựa chọn giữa hai nghi vấn.',
      'ところが báo hiệu tương phản; câu này đặt hai khả năng để lựa chọn, không kể kết quả trái dự đoán.',
      'それなら nghĩa là “nếu vậy thì”; cần một điều kiện vừa nêu, không hợp cấu trúc hai câu hỏi.',
      'それとも nghĩa là “hay là”; đặt hai khả năng song song trong câu hỏi lựa chọn.',
    ],
    rule: 'それとも nối các phương án thay thế trong câu hỏi: Aでしょうか。それともBでしょうか。',
  },
  toan_q_2012_07_55: {
    translation: 'Một buổi chiều ở trường, anh/chị khóa trên đã nói “おはよう” với tôi.',
    notes: [
      '言いました là “tôi/người đó đã nói” nhưng thiếu góc nhìn tiếp nhận; theo cấu trúc 先輩に「…」と…, câu cần “tôi được nói với”.',
      '言わせました là sai khiến: “đã bắt ai đó nói”; không có đối tượng bị yêu cầu trong câu.',
      '言われました là bị động quá khứ của 言う, “tôi được nghe/nói với”; ghép với 先輩に tự nhiên.',
      '言えました là “đã có thể nói”; đổi chủ thể thành người kể và không khớp việc senpai chào.',
    ],
    rule: 'A に言われる = được A nói với; dạng bị động giúp đặt người tiếp nhận làm chủ thể.',
  },
  toan_q_2012_07_56: {
    translation: 'Sau đó tôi nhận ra rằng xung quanh mình cũng có những người nói “おはよう” cả ban ngày lẫn ban đêm.',
    notes: [
      '気がついたのです giải thích/phát hiện điều vừa kể; のです nhấn mạnh nhận ra này.',
      '気がついたからです nghĩa là “vì đã nhận ra”; から cần một kết quả/lý do theo sau, nhưng câu kết thúc mệnh đề phát hiện.',
      '気がついたせいです nghĩa là “do lỗi/vì đã nhận ra”; せい mang đánh giá tiêu cực không phù hợp.',
      '気がついたおかげです nghĩa là “nhờ đã nhận ra”; おかげ cần kết quả tốt được nêu, không hợp cấu trúc ở đây.',
    ],
    rule: '気がつく = nhận ra; ～のです có thể nhấn mạnh một phát hiện trong mạch kể.',
  },
  toan_q_2012_07_57: {
    translation: 'Đúng là anh khóa trên ấy cũng làm việc ở cửa hàng tiện lợi.',
    notes: [
      '以下の先輩 nghĩa là “anh/chị khóa trên dưới đây”; 以下 dùng trong danh sách/tài liệu, không phải hồi chỉ.',
      'その先輩 chỉ người đã được nhắc trước — anh/chị khóa trên nói おはよう; đây là tham chiếu đúng.',
      '留学した先輩 là “anh/chị khóa trên từng du học”; không có thông tin này và làm đổi nghĩa.',
      '驚いた先輩 là “anh/chị khóa trên đã ngạc nhiên”; không phù hợp nghĩa và quan hệ trong câu.',
    ],
    rule: 'その + danh từ thường hồi chỉ đối tượng vừa được xác định trong văn cảnh.',
  },
  toan_q_2012_07_58: {
    translation: 'Tôi đã biết rằng có cách dùng khác với điều mình học trong lớp.',
    notes: [
      '知ったのでしょう là “có lẽ đã biết”; câu kể trực tiếp kết quả người viết nhận ra, không phải câu hỏi suy đoán.',
      '知るはずです là “chắc sẽ biết”; dự đoán tương lai, không thuật lại phát hiện đã có.',
      '知っていました là “đã biết từ trước”; mâu thuẫn với việc vừa hiểu ra sau khi hỏi bạn.',
      '知りました là “đã biết/đã nhận ra”; quá khứ phù hợp với kết luận sau khi được giải thích.',
    ],
    rule: '知りました diễn tả việc tiếp nhận/phát hiện thông tin mới trong câu chuyện quá khứ.',
  },
  toan_q_2011_12_54: {
    translation: 'Vì muốn hát bằng tiếng Nhật mà mọi người đều hiểu, tôi quyết định hát một bài nhạc anime Nhật Bản.',
    notes: [
      'そこで nghĩa là “vì vậy/thế là”; đưa ra hành động được chọn để giải quyết tình huống vừa nêu.',
      'それでも là “dù vậy”; cần sự nhượng bộ, nhưng chọn bài hát là kết quả hợp lý của mong muốn.',
      'ところで chuyển chủ đề (“nhân tiện”); đoạn văn vẫn tiếp tục cùng câu chuyện.',
      'ところが biểu thị kết quả trái dự đoán; câu sau không có sự bất ngờ hay tương phản.',
    ],
    rule: 'そこで nối một tình huống/lý do với hành động giải quyết tiếp theo.',
  },
  toan_q_2011_12_55: {
    translation: 'Khi tôi bắt đầu hát, mọi người cũng hát theo; họ nói rằng ở nước mình cũng từng xem bộ anime ấy.',
    notes: [
      '歌い出したせいです dùng せい “do lỗi/vì nguyên nhân xấu”; không hợp việc mọi người vui vẻ hát theo.',
      '歌い出したからです nêu lý do một cách trung tính; nối được với thông tin họ đều từng xem cùng anime.',
      '歌い出しただけです là “chỉ bắt đầu hát”; だけ không nêu nguyên nhân và không giải thích sự đồng thanh.',
      '歌い出したことです danh từ hóa việc hát nhưng không tạo vị ngữ tự nhiên sau みんながいっしょに.',
    ],
    rule: 'からです nêu nguyên nhân; せいです thường hàm ý nguyên nhân gây kết quả xấu.',
  },
  toan_q_2011_12_56: {
    translation:
      'Sau khi biết các bạn cùng lớp cũng xem chính bộ anime ấy, chúng tôi bắt đầu trò chuyện và trở nên thân thiết.',
    notes: [
      '自分のアニメ là “anime của bản thân tôi”; quan hệ sở hữu này không nói nội dung cùng xem.',
      'みんなのアニメ là “anime của mọi người”; không diễn đạt rằng họ cùng xem một bộ.',
      '違う国のアニメ là “anime của các nước khác nhau”; trái với nội dung sau nói họ xem cùng một anime.',
      '同じアニメ nghĩa là “cùng một bộ anime”; khớp với phát hiện trở thành điểm chung giữa bạn bè.',
    ],
    rule: '同じ + danh từ dùng cho đối tượng giống/cùng một; 同じアニメを見ていた = cùng xem một bộ anime.',
  },
  toan_q_2011_12_57: {
    translation: 'Nhờ anime Nhật, tôi đã có thể trở nên thân thiết hơn với năm người bạn cùng đi karaoke.',
    notes: [
      '親しくなることができた diễn tả đã có thể đạt tới trạng thái thân thiết; cấu trúc tự nhiên và khớp kết quả.',
      '親しくなったほしい sai nối dạng: ほしい cần Vてほしい (親しくなってほしい), và biến thành mong người khác thân thiết.',
      '親しくなれそうだった là “có vẻ sắp có thể thân”; そうだった chỉ vẻ ngoài lúc quá khứ, không khẳng định kết quả đã đạt.',
      '親しくなってみたい là “muốn thử trở nên thân”; みたい chỉ mong muốn/thử nghiệm, không kể kết quả đã xảy ra.',
    ],
    rule: 'Vることができる diễn tả khả năng; quá khứ できた nêu kết quả đã đạt được.',
  },
  toan_q_2011_12_58: {
    translation: 'Giờ đây, anime Nhật đối với tôi là thứ đã mở cánh cửa sang một thế giới mới.',
    notes: [
      'ものなのだと思いますか là câu hỏi “bạn có nghĩ đó là thứ… không?”; không hợp lời khẳng định của người viết.',
      'ものだったと思うそうです chồng tường thuật そうです với suy nghĩ của người khác; sai vì đây là cảm nhận của người kể.',
      'ものだったのだと思っています diễn tả nhận định hiện tại của người viết về ý nghĩa trước đây của anime; hoàn tất câu tự nhiên.',
      'ものだと思ったかもしれません suy đoán “có lẽ đã nghĩ là…”; chuyển sang phỏng đoán về suy nghĩ quá khứ, không hợp nhận xét hiện tại.',
    ],
    rule: '～と思っています nêu nhận định người nói hiện đang giữ; のだ nhấn mạnh/giải thích nội dung nhận định.',
  },
  toan_q_2011_07_54: {
    translation: 'Sau ba tháng ở Tokyo, tôi dần hiểu được lý do mọi người thường đi tàu.',
    notes: [
      'わかってくるはずです là “chắc sẽ dần hiểu”; dự đoán tương lai, trong khi tác giả đã bắt đầu hiểu.',
      'わかっていくそうです là “nghe nói sẽ hiểu dần”; hearsay không phù hợp trải nghiệm trực tiếp.',
      'わかってきました là “đã dần hiểu ra”; ～てくる diễn tả thay đổi tiến tới hiện tại sau ba tháng.',
      'わかっていったようです là “có vẻ đã hiểu dần về phía sau”; ～ていく hướng biến đổi rời điểm hiện tại, không hợp điểm nhìn đã tới hiện tại.',
    ],
    rule: '～てくる biểu thị thay đổi tích lũy hướng tới hiện tại; ～ていく thường hướng từ hiện tại về tương lai.',
  },
  toan_q_2011_07_55: {
    translation: 'Ngoài nhiều tuyến và ga, tàu ít trễ và chuyến tiếp theo đến nhanh, nên việc đi tàu rất thuận tiện.',
    notes: [
      'したがって nghĩa là “do đó”; quan hệ kết luận có thể đọc được, nhưng ở đây người viết đang tiếp tục liệt kê thêm ưu điểm sau まず.',
      'つまり nghĩa là “nói cách khác”; cần diễn đạt lại nội dung trước, không phải thêm ưu điểm mới.',
      'たとえば nghĩa là “ví dụ”; sau đó đưa ra ưu điểm cụ thể nhưng không minh họa cho một nhận định khái quát ngay trước theo cấu trúc câu này.',
      'それから nghĩa là “ngoài ra/sau đó”; nối thêm một đặc điểm nữa trong chuỗi ưu điểm của tàu.',
    ],
    rule: 'それから nối thông tin tiếp theo trong chuỗi liệt kê; まず thường mở đầu một loạt lý do.',
  },
  toan_q_2011_07_56: {
    translation:
      'Nếu cứ có những chuyến tàu như thế này đến ba phút một chuyến vào giờ cao điểm, tôi hiểu vì sao mọi người muốn đi tàu.',
    notes: [
      'ある電車なら là “nếu là một chuyến tàu nào đó”; không hồi chỉ đặc điểm tàu đến thường xuyên vừa nêu.',
      'そこの電車なら chỉ tàu ở một địa điểm xa/đã xác định; không tự nhiên khi nói về loại tàu có đặc điểm vừa mô tả.',
      'こういう電車 hồi chỉ “loại tàu như thế này” — ít trễ, đến nhanh và cứ ba phút có chuyến; đúng với kết luận.',
      'どちらかの電車 là “một trong hai chuyến tàu”; văn bản không đưa ra hai lựa chọn.',
    ],
    rule: 'こういう dùng hồi chỉ loại/đặc điểm vừa mô tả; こういう電車なら = nếu là tàu có đặc điểm như vậy.',
  },
  toan_q_2011_07_57: {
    translation: 'Tôi không hiểu vì sao nhiều người lại đi rất vội trong ga, trên cầu thang và sân ga.',
    notes: [
      '答えなのかわかりません là “không biết đó có phải câu trả lời không”; không hỏi nguyên nhân của việc đi vội.',
      'なぜなのかわかりません là “không biết tại sao lại như vậy”; なぜなのか tạo nghi vấn gián tiếp đúng nghĩa.',
      '理由なのかわかりません là “không biết đó có phải lý do không”; cần một mệnh đề/lý do cụ thể để trỏ tới.',
      'だれなのかわかりません là “không biết là ai”; hỏi người, không phù hợp với hành động đi vội.',
    ],
    rule: '疑問詞 + なのか + わからない tạo câu hỏi gián tiếp: なぜなのかわからない = không biết tại sao.',
  },
  toan_q_2011_07_58: {
    translation: 'Nếu sống lâu ở Nhật, liệu tôi cũng sẽ trở nên vội vã như vậy chăng?',
    notes: [
      'なるのでしょうか tạo câu hỏi suy đoán lịch sự về tương lai; phù hợp với 留学生活が終わるころには…かもしれません.',
      'なったでしょう là “đã trở thành rồi chăng”; quá khứ, không khớp điều kiện nếu sống lâu trong tương lai.',
      'なってしまうのです khẳng định “rốt cuộc sẽ thành ra”; không giữ sắc thái tự hỏi/suy đoán.',
      'なってしまいました là “đã trở thành mất rồi”; quá khứ trái với giả định tương lai.',
    ],
    rule: '～のでしょうか dùng đặt câu hỏi suy đoán nhẹ nhàng về điều có thể xảy ra.',
  },
  toan_q_2010_07_54: {
    translation:
      'Phần lớn mọi người sẽ cười và nói máy bán hàng tự động không thể nói; thế nhưng thật sự có máy bán hàng biết nói.',
    notes: [
      'ところが + あるのです tạo bước ngoặt “thế nhưng thật sự có”; hợp với sự thật trái dự đoán.',
      'なぜなら + あるからです phải mở lời giải thích nguyên nhân, nhưng ở đây ý là đối lập chứ không phải lý do.',
      'でも có thể mang nghĩa “nhưng”, song lựa chọn ghép với あるでしょうか thành câu hỏi “liệu có không?” không phù hợp lời khẳng định 本当に.',
      'たとえば + あるとしましょう là “ví dụ, hãy giả sử có”; câu đang khẳng định chiếc máy có thật, không giả định.',
    ],
    rule: 'ところが biểu thị điều trái với dự đoán; あるのです nhấn mạnh sự tồn tại có thật.',
  },
  toan_q_2010_07_55: {
    translation: 'Chiếc máy bán nước trông bình thường ấy có thể nói chuyện.',
    notes: [
      'ある自動販売機 là “một máy bán hàng nào đó”; câu đã xác định chiếc máy gần nhà ở câu trước.',
      '一台自動販売機 thiếu trợ từ/định ngữ tự nhiên và chỉ số lượng “một chiếc”, không xác định máy đang nói đến.',
      'この自動販売機 chỉ rõ “chiếc máy này” vừa được giới thiệu là máy gần nhà; hợp mạch kể.',
      'ふつうの自動販売機 lặp nghĩa “máy bán hàng bình thường”; câu sau đối chiếu ngoại hình bình thường với khả năng nói, nhưng lựa chọn この mới hồi chỉ đúng chiếc máy cụ thể.',
    ],
    rule: 'この + danh từ xác định đối tượng gần/đang được giới thiệu; ふつうの mô tả loại, không chỉ riêng chiếc máy.',
  },
  toan_q_2010_07_56: {
    translation: 'Tôi từng thấy chiếc máy nói “Chúc anh/chị đã vất vả rồi” với người mua đồ uống vào buổi tối.',
    notes: [
      '言っている là chủ động “đang nói/nói rằng”; chủ thể ngầm là máy bán hàng, hợp với câu kể điều đã thấy.',
      '言って帰る là “nói rồi trở về”; máy không rời đi và câu không kể hành động của người mua.',
      '言われている là bị động “được/bị nói với”; đảo vai người nói/nghe so với chủ thể máy đang nói câu chào.',
      '言われて帰る vừa bị động vừa thêm “trở về”; sai vai và không ăn khớp với のを見た.',
    ],
    rule: '～と言っている tường thuật lời nói của chủ thể; ～と言われる đặt người nhận làm chủ thể ở thể bị động.',
  },
  toan_q_2010_07_58: {
    translation: 'Có lẽ giờ đây, dù một ngày nào đó xuất hiện máy bán hàng biết đi, tôi cũng sẽ không ngạc nhiên nữa.',
    notes: [
      '信じない là “không tin”; đoạn văn nói đã quen với máy biết nói và dự đoán phản ứng trước điều kỳ lạ hơn.',
      '言い返さない là “không đáp trả”; không liên quan đến cảm xúc khi thấy máy biết đi.',
      'しゃべらない là “không nói”; mô tả hành động của máy, trong khi câu nói về phản ứng của người viết.',
      'おどろかない là “không ngạc nhiên”; khớp với もう và かもしれません: đã quen nên có thể không còn thấy lạ.',
    ],
    rule: '驚く／驚かない diễn tả ngạc nhiên/không ngạc nhiên; もう nhấn mạnh trạng thái “đến giờ đã…”.',
  },
}

const stripOption = (option) => option.replace(/^\s*[1-4][.)．。\s　]*/, '').trim()
let updated = 0
for (const [id, entry] of Object.entries(cases)) {
  const question = exams.flatMap((exam) => exam.parts.flatMap((part) => part.questions)).find((q) => q.id === id)
  if (!question) throw new Error(`Question not found: ${id}`)
  if (question.correctAnswer !== question.answer || question.options.length !== 4 || entry.notes.length !== 4) {
    throw new Error(`Answer/options mismatch: ${id}`)
  }
  const answer = question.correctAnswer
  const correct = stripOption(question.options[answer - 1])
  const explanation = [
    `Đáp án ${answer} — 「${correct}」 phù hợp với câu và ngữ cảnh.`,
    ...question.options.map((option, index) => `${index + 1}. 「${stripOption(option)}」: ${entry.notes[index]}`),
    `Dịch câu chứa chỗ trống: “${entry.translation}”`,
    `Ghi nhớ: ${entry.rule}`,
  ].join('\n')
  if (explanation.length < 300) throw new Error(`Explanation too short: ${id} (${explanation.length})`)
  question.explanation = explanation
  curated[id] = explanation
  updated += 1
}

if (updated !== 58) throw new Error(`Expected 58 updates, got ${updated}`)
fs.writeFileSync(masterPath, `${JSON.stringify(exams, null, 2)}\n`, 'utf8')
fs.writeFileSync(curatedPath, `${JSON.stringify(curated, null, 2)}\n`, 'utf8')
console.log(`Updated ${updated} detailed grammar cloze explanations.`)
