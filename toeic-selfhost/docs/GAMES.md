# Hai chiến dịch từ vựng — v1.3.1

Mở **Chơi mà nhớ** rồi chọn **Biệt đội Neon** hoặc **Long Vương Nhật Thực**. Chọn chủ đề ở sảnh trước khi bắt đầu; từ đến hạn ôn, từ từng nhầm và từ đã lưu được ưu tiên. Mỗi tài khoản có một ván đang lưu riêng cho mỗi trò.

## Biệt đội Neon

- 5 đợt, căn cứ có 20 máu. Bắt đầu với 6 đồng, tuyển robot giá 3 đồng.
- Mỗi đợt nạp 2 từ Anh–Việt. Đúng nhận 4 đồng và tăng 8% công cho đợt đó; sai nhận 1 đồng hỗ trợ. Phần giải thích có phát âm, nghĩa và ví dụ song ngữ. Câu đúng tự chuyển sau 2 giây; câu sai chờ người chơi xác nhận.
- 6 loại robot thuộc 3 vai trò. Hai tiên phong tăng 25% máu toàn đội, hai xạ thủ tăng 25% công, hai hỗ trợ tăng lượng hồi máu. Ba bản giống nhau cùng sao tự ghép thành một robot thêm một sao, tối đa 3 sao.
- Chạm một robot trên sân rồi chạm ô khác để đổi chỗ. Ba ô hàng trên là tuyến trước; ba ô hàng dưới là hậu phương. Địch ưu tiên tấn công tuyến trước.
- Có thể bán robot, đổi cửa hàng với giá 1 đồng và xem trước số quân địch. Nạp đủ 2 từ và có ít nhất một robot thì bấm Xuất kích.
- Trận đánh tự chạy, có thanh máu, số sát thương/hồi máu, chuyển động công/thủ và tốc độ ×1/×2. Thắng đợt được thêm 5 đồng; thua mất 3 + số thứ tự đợt máu căn cứ. Robot được sửa đầy máu trước đợt sau. Thắng đợt 5 là thắng chiến dịch; căn cứ hết máu thì thua.

## Long Vương Nhật Thực

Đồ họa pixel thống nhất: pháp sư giữ ký ức, Hộ Vệ Pha Lê, Bạo Chúa Tro Tàn và Long Vương Nhật Thực có sprite riêng. Nền đấu trường dưới trăng, sáu hình thẻ phép và hạt hiệu ứng dùng cùng phong cách. Tắt hoạt ảnh theo tùy chọn giảm chuyển động của thiết bị.

- Đấu 3 boss liên tiếp. 12 thẻ từ tạo thành bộ bài, mỗi lượt rút 5 thẻ, bắt đầu với 3 năng lượng. Thẻ hết được xáo lại từ chồng đã dùng.
- Chọn thẻ rồi chọn nghĩa đúng để thi triển. Sai mất năng lượng của thẻ và 4 máu, không có hiệu ứng kỹ năng. Hiển thị nghĩa đúng và ví dụ để học lại.
- Sáu kỹ năng: đánh 15, giáp 18, thiên thạch 32 (giá 2), hồi 14 máu, tia chớp 10 kèm rút 1, tăng 4 sức mạnh cho cả hành trình. Sức mạnh cộng vào đòn đánh và khiên; ba câu đúng liên tiếp thêm 1 năng lượng.
- Boss báo trước đòn tiếp theo. Kết thúc lượt để boss hành động rồi rút thẻ mới. Giáp người chơi chỉ che chắn cho lượt đó. Boss sau có thể tự hồi máu hoặc tạo giáp; kéo dài quá 6 lượt thì đòn đánh tăng dần.
- Hạ boss 1 và 2 được nghỉ hồi 12 máu, chọn một di vật: thêm sức mạnh, thêm năng lượng tối đa hoặc hồi thêm máu. Hạ boss 3 là thắng; hết máu hoặc quá 40 lượt ở một boss thì thua.

## Hồ sơ, lịch ôn và nâng cấp

Ván lưu gồm đội hình/cấp sao/đồng/đợt hoặc bộ bài/máu/năng lượng/boss, câu hỏi đang làm, hiệu ứng đang xử lý và thời gian chơi. Lưu sau hành động, mỗi 5 giây đang chơi, khi tạm dừng, rời trang hoặc đóng trang. Khi mở lại, ván được tạm dừng cho đến khi người chơi bấm Tiếp tục. Mạng lỗi thì giữ bản đệm trên trình duyệt và đồng bộ lại theo cơ chế hồ sơ hiện có.

Câu sai cập nhật lịch ôn và thêm vào sổ từ. Mỗi từ trả lời đúng chỉ nâng lịch một lần trong cùng chiến dịch; dùng lại thẻ đó không làm tăng giả tạo chuỗi lịch ôn. Lần sai tiếp theo vẫn đưa từ về mốc ôn sớm. Kết quả chiến dịch ghi theo ID ván để không nhân đôi sau tải lại. Tổng từ trong lịch sử là số từ của bộ chiến dịch; trang kết quả hiển thị riêng số từ đã thực sự trả lời.

Các trường `battleDrafts.robot` và `battleDrafts.boss` nằm trong JSON tiến độ của bảng SQLite `profiles`. Không đổi cấu trúc bảng và không cần xóa database. Khi hai thiết bị sửa cùng ván, checkpoint mới nhất được ưu tiên; nên tạm dừng và đợi trạng thái **Đã lưu lên hồ sơ** trước khi chuyển máy. Hai trò khác nhau được hợp nhất riêng. API giữ các trường mới nếu trình duyệt phiên bản cũ chưa gửi chúng.

Sao lưu như README, thay mã nguồn, giữ nguyên `.env` và volume rồi chạy:

```bash
docker compose up -d --build
```

Tải lại trang trình duyệt để nạp JavaScript mới. Tất cả hình ảnh được đóng gói tại `public/assets`, không cần dịch vụ tạo ảnh khi chạy.

## Phạm vi

Hai trò chơi một người, AI luật cố định; không có PvP hoặc xếp hạng chống gian lận. Điểm là dữ liệu học do trình duyệt gửi về hồ sơ, không dùng làm kết quả thi có giám sát. Âm thanh dùng giọng đọc của thiết bị như các chế độ học hiện có.
