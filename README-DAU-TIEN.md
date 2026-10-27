# Bộ mã nguồn đầy đủ · Từng chút một

Gói này gom **hai ứng dụng độc lập**, không giả định chúng đã được ghép làm một.

## 1. pixel-arena-latest — game web mới nhất, phiên bản Sites 6

Có bản đồ 50 chủ đề / 5 miền đất, mở trang phục, ba mức câu hỏi Anh → Việt / Việt → Anh / điền từ, robot và thẻ bài pixel, giao diện điện thoại, âm thanh và toàn màn hình.

Đây là **bản demo tĩnh**, tiến độ lưu trên trình duyệt. Chưa có tài khoản, database hoặc admin trong ứng dụng này. Mã game khớp commit `eb38509f396d6b0d14c2e51029d4352233c73274`. Thư mục có Docker Compose / Nginx / Caddy, 600 từ và đầy đủ ảnh pixel.

Nếu đã cài Docker Compose trên Ubuntu:

```bash
cd pixel-arena-latest
sudo docker compose up -d
```

Mở `http://IP_SERVER:8080`. Xem `pixel-arena-latest/README.md` để đổi cổng, cấu hình proxy và chuyển tiến độ cũ.

## 2. toeic-selfhost — ứng dụng có backend/database, phiên bản 1.3.4

Có backend Node.js, database SQLite, tài khoản đăng ký/đăng nhập, hồ sơ lưu trên server, trang admin, flashcard, bài luyện, ghép thẻ 8×8, robot, thẻ bài đánh boss pixel và công cụ sao lưu / tạo admin.

Bản 1.3.4 thêm nút toàn màn hình/F11 và bố cục vừa màn hình dọc/ngang cho cả robot lẫn đánh boss. Trình duyệt không hỗ trợ fullscreen dùng chế độ mở rộng vùng nhìn.

Bản 1.3.3 tăng hạn phiên đăng nhập mới lên 365 ngày cho cả cookie và database. Cần đăng xuất/đăng nhập lại một lần sau khi cập nhật để nhận hạn mới; tài khoản và dữ liệu học giữ nguyên.

Bản 1.3.2 bổ sung kiểm tra Referer cùng origin nếu request thiếu Origin và ghi log chẩn đoán khi nguồn bị từ chối; vẫn giữ kiểm tra Origin/CSRF. URL mở trên máy tính và điện thoại phải trùng `PUBLIC_ORIGIN`. Chưa xác minh request trên iPhone thực tế; xem hướng dẫn `origin_rejected` trong README của backend.

**Bản này vẫn chưa có bản đồ 50 màn, các mức câu hỏi và cơ chế từ khó mới của demo.** Riêng toàn màn hình và bố cục điện thoại cho hai game chiến thuật đã được bổ sung ở bản 1.3.4; các phần còn lại chưa được ghép vào backend; không ghi đè các file demo vào `public/` rồi coi là đã tích hợp.

Triển khai trên Ubuntu có Docker Compose:

```bash
cd toeic-selfhost
cp .env.example .env
nano .env
sudo docker compose up -d --build
sudo docker compose exec -it app node scripts/create-admin.mjs admin
```

Trong `.env`, đặt `PUBLIC_ORIGIN` đúng URL bạn sẽ mở, ví dụ `https://toeic.example.com`. Mật khẩu admin được script hỏi trực tiếp, không có mật khẩu mặc định. Container lắng nghe ở `127.0.0.1:8081` trên host; proxy Caddy/WAF/tunnel trên cùng host trỏ về địa chỉ đó.

Nếu proxy chạy ở container/máy khác, xem giải thích mạng trong `toeic-selfhost/README.md`. Database lưu trong Docker volume `toeic_data`; không dùng `docker compose down -v` nếu muốn giữ dữ liệu.

## Chọn bản nào?

- Cần tự host **đúng game demo mới nhất**: dùng `pixel-arena-latest/`.
- Cần **tài khoản, database và admin hiện có**: dùng `toeic-selfhost/`, lưu ý giới hạn phiên bản nêu trên.

Cả hai thư mục có mã nguồn đầy đủ, tài nguyên đồ họa và hướng dẫn riêng. Gói không chứa tài khoản thật, mật khẩu, khóa API, database đã có dữ liệu, `node_modules` hay lịch sử `.git`. Các gói Docker cần Internet để lấy image lần đầu.

## Kiểm tra file

Từ thư mục gốc của bộ mã nguồn:

```bash
sha256sum -c SHA256SUMS.txt
```

`MANIFEST.json` ghi số file và dung lượng nguồn (không tính chính manifest và danh sách checksum). Sau khi chỉnh sửa mã, cần cập nhật danh sách checksum tương ứng.
