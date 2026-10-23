# Chuyển tiến độ sang bản tự host

Mã nguồn giữ cấu trúc tiến độ của bản Sites nhưng thay tài khoản tên đơn thuần bằng người dùng được admin cấp và phiên đăng nhập có mật khẩu. Server mới không có quyền tự đọc database D1 cũ.

1. Tạo tài khoản người dùng trong trang quản trị của server mới.
2. Xuất JSON tiến độ tương ứng từ bản cũ. Định dạng được chấp nhận là object tiến độ trực tiếp, hoặc object có trường `state` chứa tiến độ. Không nhập cả câu lệnh SQL hoặc toàn bộ backup D1 bằng script JSON.
3. Đưa file vào container rồi chạy script nhập dưới đây.

```bash
docker compose cp ./tien-do.json app:/tmp/tien-do.json
docker compose exec app node scripts/import-progress.mjs ten_tai_khoan /tmp/tien-do.json
```

Script kiểm tra nội dung và mặc định chỉ nhập vào hồ sơ trống. Nếu hồ sơ đã có tiến độ, sao lưu database trước và chỉ thêm `--replace` khi đã quyết định ghi đè.

Sau khi nhập, đăng xuất/đăng nhập lại ở các thiết bị. Nếu đang có thay đổi chưa đồng bộ từ thiết bị khác, nên hoàn tất đồng bộ trước khi chuyển để tránh đưa tiến độ cũ trở lại.

Trên bản tự host, người dùng có thể xuất JSON bất cứ lúc nào tại **Hồ sơ học tập → Tải tiến độ JSON**. Dùng snapshot SQLite khi cần chuyển toàn bộ người dùng, mật khẩu và nhật ký sang server khác.
