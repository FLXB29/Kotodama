# Mức chuyển đề N3 từ PDF sang text — 27/09/2026

Nguồn đếm: `data/jlpt_n3_toan_master.json`. Đây là kiểm tra cấu trúc và mức trích xuất; nó không tự chứng nhận độ đúng ngôn ngữ hoặc đáp án.

- Đề: **30**. Câu dấu ★: **150/150** có prompt và bốn mảnh text; **150/150** có cấu hình ghép khớp với khóa hiện lưu; **148/150** đã đối chiếu thứ tự và ô ★ với nguồn; **2** đang có xung đột với PDF nên không tính là đã xác minh; **1** có bảng đáp án phụ bất đồng với cách đọc từ PDF và lời giải thích được ghi rõ.
- Câu điền bài văn: **30/30** có bài chung dạng text.
- Đọc hiểu: **240/240** điểm gắn passage có text; **0/480** câu có ảnh đính kèm. Một passage có thể dùng chung cho nhiều câu; số liệu cấu trúc không đánh giá độ đúng của OCR.

| Đề      | ★ nguồn text | ★ cấu hình khớp khóa | ★ đã đối chiếu nguồn | ★ xung đột PDF | ★ lệch bảng phụ | Câu điền text | Passage text | ★ cần rà nguồn | Đọc còn ảnh |
| :------ | -----------: | -------------------: | -------------------: | -------------: | --------------: | ------------: | -----------: | -------------: | ----------: |
| 2025/12 |          5/5 |                  5/5 |                  4/5 |              1 |               0 |           1/1 |            8 |              1 |           0 |
| 2025/07 |          5/5 |                  5/5 |                  5/5 |              0 |               0 |           1/1 |            8 |              0 |           0 |
| 2024/12 |          5/5 |                  5/5 |                  5/5 |              0 |               0 |           1/1 |            8 |              0 |           0 |
| 2024/07 |          5/5 |                  5/5 |                  5/5 |              0 |               0 |           1/1 |            8 |              0 |           0 |
| 2023/12 |          5/5 |                  5/5 |                  5/5 |              0 |               0 |           1/1 |            8 |              0 |           0 |
| 2023/07 |          5/5 |                  5/5 |                  5/5 |              0 |               1 |           1/1 |            8 |              0 |           0 |
| 2022/12 |          5/5 |                  5/5 |                  5/5 |              0 |               0 |           1/1 |            8 |              0 |           0 |
| 2022/07 |          5/5 |                  5/5 |                  5/5 |              0 |               0 |           1/1 |            8 |              0 |           0 |
| 2021/12 |          5/5 |                  5/5 |                  5/5 |              0 |               0 |           1/1 |            8 |              0 |           0 |
| 2021/07 |          5/5 |                  5/5 |                  5/5 |              0 |               0 |           1/1 |            8 |              0 |           0 |
| 2020/12 |          5/5 |                  5/5 |                  5/5 |              0 |               0 |           1/1 |            8 |              0 |           0 |
| 2019/12 |          5/5 |                  5/5 |                  5/5 |              0 |               0 |           1/1 |            8 |              0 |           0 |
| 2019/07 |          5/5 |                  5/5 |                  5/5 |              0 |               0 |           1/1 |            8 |              0 |           0 |
| 2018/12 |          5/5 |                  5/5 |                  5/5 |              0 |               0 |           1/1 |            8 |              0 |           0 |
| 2018/07 |          5/5 |                  5/5 |                  5/5 |              0 |               0 |           1/1 |            8 |              0 |           0 |
| 2017/12 |          5/5 |                  5/5 |                  5/5 |              0 |               0 |           1/1 |            8 |              0 |           0 |
| 2017/07 |          5/5 |                  5/5 |                  5/5 |              0 |               0 |           1/1 |            8 |              0 |           0 |
| 2016/12 |          5/5 |                  5/5 |                  4/5 |              1 |               0 |           1/1 |            8 |              1 |           0 |
| 2016/07 |          5/5 |                  5/5 |                  5/5 |              0 |               0 |           1/1 |            8 |              0 |           0 |
| 2015/12 |          5/5 |                  5/5 |                  5/5 |              0 |               0 |           1/1 |            8 |              0 |           0 |
| 2015/07 |          5/5 |                  5/5 |                  5/5 |              0 |               0 |           1/1 |            8 |              0 |           0 |
| 2014/12 |          5/5 |                  5/5 |                  5/5 |              0 |               0 |           1/1 |            8 |              0 |           0 |
| 2014/07 |          5/5 |                  5/5 |                  5/5 |              0 |               0 |           1/1 |            8 |              0 |           0 |
| 2013/12 |          5/5 |                  5/5 |                  5/5 |              0 |               0 |           1/1 |            8 |              0 |           0 |
| 2013/07 |          5/5 |                  5/5 |                  5/5 |              0 |               0 |           1/1 |            8 |              0 |           0 |
| 2012/12 |          5/5 |                  5/5 |                  5/5 |              0 |               0 |           1/1 |            8 |              0 |           0 |
| 2012/07 |          5/5 |                  5/5 |                  5/5 |              0 |               0 |           1/1 |            8 |              0 |           0 |
| 2011/12 |          5/5 |                  5/5 |                  5/5 |              0 |               0 |           1/1 |            8 |              0 |           0 |
| 2011/07 |          5/5 |                  5/5 |                  5/5 |              0 |               0 |           1/1 |            8 |              0 |           0 |
| 2010/07 |          5/5 |                  5/5 |                  5/5 |              0 |               0 |           1/1 |            8 |              0 |           0 |

Toàn bộ 30 đề gốc đã ghép từ lớp chữ trong PDF. Cả 150 câu ★ đều có cấu hình để bấm ghép và khớp với khóa đang lưu; 148 câu đã được đối chiếu trực tiếp với nguồn PDF. 2 câu đang mâu thuẫn với nội dung PDF và bị loại khỏi số đã xác minh; 1 câu có bảng đáp án phụ ghi khác với vị trí dấu ★, được chốt theo PDF gốc và câu hoàn chỉnh, đồng thời ghi lại bất đồng. Các câu còn lại cần soát thứ tự và vị trí ô ★ trực tiếp với nguồn. Ba nội dung đọc từng nằm trong ảnh đã được chuyển từ lớp chữ PDF sang text (納豆, quảng cáo guitar, bảng mua hàng); không cần OCR cho các nguồn có lớp chữ.

Chưa đủ điều kiện push/Render: 2 câu ★ còn xung đột giữa PDF và khóa tham khảo; 1 câu có bất đồng ở bảng đáp án phụ cần tiếp tục công khai. PDF 12/2023 trực quan in câu 納豆 là 27, trùng số với câu đầu Mondai 5; câu này là mục thứ tư của Mondai 4, và bảng đáp án tham khảo đánh số Mondai 4 là 23–26 với đáp án cuối là 1. Ứng dụng giữ nhãn [26] và đáp án 1; xem biên bản để biết đây là suy luận từ cấu trúc và khóa tham khảo, chưa có xác nhận từ khóa JLPT chính thức. Nghĩa từ và mẫu ngữ pháp chỉ được thêm khi khớp dữ liệu cục bộ, chưa chứng nhận toàn bộ nội dung; chưa thử đồng bộ Neon/Render.
