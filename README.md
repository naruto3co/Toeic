# Từng chút một · TOEIC

Hai ứng dụng độc lập để học từ vựng TOEIC. Xem [hướng dẫn chọn bản và cài đặt](README-DAU-TIEN.md).

| Thư mục | Phiên bản | Hồ sơ học tập |
| --- | --- | --- |
| [`toeic-selfhost/`](toeic-selfhost/README.md) | 1.3.3 | Tài khoản, SQLite, admin, đồng bộ trên server |
| [`pixel-arena-latest/`](pixel-arena-latest/README.md) | Demo Sites 6 | localStorage từng trình duyệt; chưa có tài khoản/database |

Demo có bản đồ và giao diện mới nhất; các cập nhật đó chưa được ghép vào backend. Nội dung gồm 600 từ tự biên soạn theo 50 chủ đề TOEIC.

## Cài mới bản có tài khoản và database

```bash
git clone https://github.com/naruto3co/Toeic.git
cd Toeic/toeic-selfhost
cp .env.example .env
nano .env
sudo docker compose up -d --build
sudo docker compose exec -it app node scripts/create-admin.mjs admin
```

Đặt `PUBLIC_ORIGIN` đúng URL sẽ mở, ví dụ `https://learn.datngoc.lol`. Không có mật khẩu mặc định; script hỏi mật khẩu admin trực tiếp. Reverse proxy cùng host trỏ tới `http://127.0.0.1:8081`; proxy ở máy/container khác cần địa chỉ và ánh xạ cổng truy cập được.

## Nâng cấp server đang dùng

Sao lưu theo README của backend, cập nhật mã trong đúng thư mục repo đang chạy và giữ nguyên `.env`, cấu hình Compose, tên project Compose, volume database. Sau đó từ thư mục `toeic-selfhost` chạy:

```bash
sudo docker compose up -d --build
```

Không cần tạo lại tài khoản. Chuyển sang thư mục/project Compose khác có thể dùng volume mới; không dùng `docker compose down -v` khi cần giữ dữ liệu.

## Phiên đăng nhập 365 ngày (1.3.3)

Phiên mới giữ đăng nhập tối đa 365 ngày, tính từ lần đăng nhập. Sau khi cập nhật, đăng xuất rồi đăng nhập lại một lần để nhận hạn mới. Phiên cũ giữ hạn cũ; đăng xuất, đổi/reset mật khẩu, khóa tài khoản hoặc thu hồi phiên vẫn kết thúc phiên ngay.

## Bản sửa nguồn đăng nhập 1.3.2

Request thiếu `Origin` được kiểm tra bằng origin của `Referer`. Nguồn khác, Origin không hợp lệ, thiếu cả hai bằng chứng hoặc Fetch Metadata báo `cross-site` vẫn bị chặn. Các thao tác ghi vẫn cần CSRF token; cookie, mật khẩu và schema database giữ nguyên.

Sau một lần thử đăng nhập bị từ chối:

```bash
sudo docker compose logs --since=3m app | grep origin_rejected
```

Log chỉ chứa mã lý do và origin, không chứa mật khẩu/cookie/token. Bản sửa chưa được xác minh trên iPhone thực tế; URL khác `PUBLIC_ORIGIN` vẫn phải sửa đúng cấu hình. Chi tiết trong README của backend.

## Kiểm tra mã nguồn

Node.js 24.11 trở lên trong nhánh 24.x: chạy `npm test` từ từng thư mục ứng dụng. Backend có 44 kiểm tra, demo có 37 kiểm tra. Docker/Nginx chưa được chạy thử trong môi trường chuẩn bị mã.
