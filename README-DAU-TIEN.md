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

## 2. toeic-selfhost — ứng dụng có backend/database, phiên bản 1.3.1

Có backend Node.js, database SQLite, tài khoản đăng ký/đăng nhập, hồ sơ lưu trên server, trang admin, flashcard, bài luyện, ghép thẻ 8×8, robot, thẻ bài đánh boss pixel và công cụ sao lưu / tạo admin.

**Bản này cũ hơn giao diện Pixel Arena ở trên:** chưa có bản đồ 50 màn, các mức câu hỏi mới, cơ chế từ khó và các sửa giao diện/fullscreen mới nhất của demo. Các cập nhật đó chưa được ghép vào backend; không ghi đè các file demo vào `public/` rồi coi là đã tích hợp.

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

`MANIFEST.json` ghi số file và dung lượng. Các file ZIP và TAR.GZ được giải nén thử và đối chiếu checksum trước khi gửi.
