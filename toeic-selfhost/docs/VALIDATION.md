# Kiểm tra bản bàn giao

Ngày kiểm tra gần nhất: 22/10/2026. Runtime kiểm tra: Node.js v24.19.0.

- 38 bài kiểm thử tự động đều qua (`node --test tests/*.test.mjs`).
- Đã kiểm tra tự đăng ký, xác nhận mật khẩu, tên tài khoản trùng (kể cả request đồng thời), giới hạn tạo tài khoản, quyền học viên mặc định và tắt đăng ký bằng cấu hình.
- Đã kiểm tra đăng nhập, mật khẩu tạm, đổi mật khẩu, cookie phiên, quyền admin/học viên, tách dữ liệu giữa người dùng, khóa/mở khóa, reset mật khẩu và thu hồi phiên.
- Đã kiểm tra Origin/CSRF, dữ liệu đầu vào, giới hạn đăng nhập sai, phiên hết hạn và đăng xuất.
- Đã kiểm tra lưu tiến độ qua API, retry không nhân đôi, xung đột phiên bản, lưu bù sau mất mạng, tải lại từ server khi không có cache trình duyệt, mở lại database và SQLite backup.
- Đã kiểm tra lịch ôn 1–3–7–14–30–60 ngày, quay lại sau 10 phút khi sai, hợp nhất lịch giữa thiết bị và giữ lịch khi client cũ lưu tiến độ.
- Đã kiểm tra checkpoint bảng thẻ, đúng vị trí thẻ, lỗi payload, tạm dừng đồng hồ, khôi phục sau reload, tách hồ sơ và hoàn tất một lần kể cả khi đóng trong animation cuối.
- Đã kiểm tra game luyện nghe bằng bộ phát giả lập: không lộ chữ tiếng Anh trước đáp án, chỉ mở đáp án khi bắt đầu phát, đổi tốc độ, hủy phát và xử lý lỗi.
- Đã giữ và chạy kiểm thử bộ từ, game 8×8 và tự chuyển sau 2 giây.
- Đã kiểm tra cú pháp toàn bộ JavaScript.
- Đã kiểm tra giao diện admin, tìm kiếm và hộp xem tiến độ trên trình duyệt với dữ liệu thử nghiệm cùng phiên thử nghiệm tách biệt; không dùng dữ liệu người học thật.

Kiểm tra trình duyệt cho v1.2: lịch ôn cập nhật sau câu đúng và chuyển sau 2 giây; bảng thẻ đã lưu 2/16 thẻ, 100 điểm và 00:11.3, khôi phục đúng sau reload; đã sửa và kiểm tra đồng bộ trong môi trường HTTP không có crypto.randomUUID. Trình duyệt thử không phát được tiếng từ Web Speech API; giao diện hiển thị thông báo lỗi và giữ đáp án khóa đúng thiết kế. Phát âm thực tế cần kiểm tra trên thiết bị người dùng có giọng tiếng Anh.

Kiểm tra v1.3: 9 bài kiểm thử mới cho kinh tế robot/ghép sao/đổi vị trí/cộng hưởng, khóa câu trả lời, chiến đấu có thể khôi phục, đi hết 5 đợt, năng lượng/thẻ/giáp/di vật, chiến thuật thắng cả 3 boss, chặn dữ liệu ván hỏng, hợp nhất hai loại ván, tự chuyển 2 giây và ghi kết quả một lần. Một bài API mới kiểm tra lưu/đọc lại cả hai trò, giữ ván khi client cũ gửi tiến độ, tách người dùng, reset rõ ràng, phục vụ ảnh đúng MIME và chặn đường dẫn ngoài thư mục công khai.

Trình duyệt v1.3 đã kiểm tra mua Aegis/Volt/Mender, nạp hai câu đúng, nhận đồng và sức mạnh, tự chuyển câu đúng, thắng giao chiến, sang đợt 2 và khôi phục sau reload đúng 5 robot/4 đồng/20 máu căn cứ. Đã kiểm tra màn boss và dùng thẻ Thiên thạch: chọn đúng nghĩa cable làm máu boss giảm từ 76 xuống 44, năng lượng từ 3 còn 1; câu đúng có ví dụ song ngữ và tự chuyển. Ảnh thật của cả hai màn được kiểm tra. CSS có bố cục thích ứng màn nhỏ và giảm chuyển động theo thiết bị; không mô phỏng kiểm thử trên thiết bị di động thật.

Kiểm tra v1.3.1: cả 38 kiểm thử qua sau khi thay đồ họa. Các sprite pixel mới được kiểm tra qua API tệp công khai, vẫn chặn đường dẫn ngoài phạm vi. Trình duyệt đã mở trận có pháp sư/boss/nền/thẻ pixel, khôi phục ván sau reload và dùng Kiếm ánh sáng: trả lời đúng warranty làm boss từ 76 xuống 61 máu, năng lượng từ 3 xuống 2, hiển thị hiệu ứng fx-strike và ví dụ song ngữ. Không đổi luật chiến đấu hoặc cấu trúc hồ sơ.

Giới hạn: môi trường xây dựng không có Docker, nên chưa build/chạy image hoặc kiểm tra Compose bằng Docker thực tế. Chưa kết nối hoặc triển khai lên server của người dùng; chưa chuyển dữ liệu D1 cũ; chưa kiểm tra DNS/HTTPS/tunnel thực tế. Đây là bản mã nguồn đã kiểm tra ở mức ứng dụng, cần chạy thử Docker và xác nhận cấu hình URL trên server đích.
