# Từng chút một · Pixel Arena — mã nguồn tự host

Bản xuất từ phiên bản web số **6**, ngày **23/10/2026**.
Commit gốc: `eb38509f396d6b0d14c2e51029d4352233c73274`.
Mã game và tài nguyên trong `dist/` giữ nguyên so với phiên bản này.

## Gói này có gì?

- Bản đồ 50 chủ đề, 5 miền đất, mỗi màn 12 từ và một boss.
- Mở màn tiếp theo theo tiến độ học; mỗi 10 màn mở một trang phục.
- Thẻ bài đánh boss, đội hình robot, 3 nhân vật và kỹ năng riêng trong các trận chiến thuật.
- Ba dạng câu hỏi: Anh → Việt, Việt → Anh, tự điền từ vào câu.
- Từ sai từ 2 lần thành từ khó nhớ; cần đúng 3 lần liên tiếp để ghi nhớ.
- Từ đã nhớ không được đưa lại làm câu hỏi; từ từng sai được ôn tiếp.
- Toàn màn hình, giao diện điện thoại, hiệu ứng âm thanh và giọng đọc.
- Đủ mã HTML/CSS/JavaScript, 600 từ, ảnh pixel và bộ kiểm tra tự động.

**Đây là bản demo tĩnh:** tiến độ được lưu trong `localStorage` của từng trình duyệt. Gói này chưa có đăng ký/đăng nhập thật, backend, database người dùng hoặc trang quản trị admin. Cài lên Ubuntu không tự tạo thêm những phần đó. Những người dùng chung một trình duyệt/profile cũng dùng chung tiến độ.

600 từ được tự biên soạn theo 50 chủ đề TOEIC; không khẳng định trùng nguyên danh sách của sách *600 Essential Words for the TOEIC*.

## Cách 1 — Docker Compose

Máy Ubuntu cần có Docker Engine và Docker Compose plugin. Nếu chưa cài, dùng hướng dẫn chính thức:
https://docs.docker.com/engine/install/ubuntu/

Sau khi chép file ZIP lên Ubuntu, giải nén vào một thư mục bạn chọn:

```bash
sudo apt update
sudo apt install -y unzip
unzip pixel-arena-source-ubuntu-v6.zip
cd pixel-arena
cp .env.example .env
sudo docker compose up -d
```

Mở `http://IP_SERVER:8080`. Cổng mặc định là **8080**, không dùng cổng 80/443 của Caddy/WAF hiện tại.
Nếu 8080 đang được dùng, sửa `PORT` trong `.env`, rồi chạy lại `sudo docker compose up -d`.

Kiểm tra ngay trên server:

```bash
sudo docker compose ps
curl -f http://127.0.0.1:8080/healthz
sudo docker compose logs --tail=50 web
```

`healthz` trả về `ok`. Cần cho phép truy cập cổng 8080 trong mạng/firewall nếu truy cập trực tiếp bằng IP. Nếu dùng reverse proxy trên cùng host, đổi `BIND_ADDRESS=127.0.0.1` trong `.env` rồi chạy lại Compose; khi đó chỉ reverse proxy trên host truy cập trực tiếp cổng này.

Dừng/chạy lại:

```bash
sudo docker compose down
sudo docker compose up -d
```

Không cần `npm install`, build JavaScript hay chạy Node.js trên server để phục vụ web. Compose dùng image Nginx chính thức `nginx:stable-alpine`; lần đầu cần Internet để tải image. File trong `dist/` được mount chỉ đọc.

## Cách 2 — Nginx trực tiếp trên Ubuntu

Chọn cách này nếu không dùng Docker. Không chạy cả hai cách trên cùng cổng 8080.

Từ thư mục `pixel-arena` đã giải nén:

```bash
sudo apt update
sudo apt install -y nginx rsync
sudo install -d -m 755 /var/www/pixel-arena
sudo rsync -rlt --chmod=D755,F644 dist/ /var/www/pixel-arena/
sudo install -m 644 deploy/nginx-ubuntu.conf /etc/nginx/sites-available/pixel-arena
sudo ln -sfn /etc/nginx/sites-available/pixel-arena /etc/nginx/sites-enabled/pixel-arena
sudo nginx -t
sudo systemctl reload nginx
curl -f http://127.0.0.1:8080/healthz
```

Mở `http://IP_SERVER:8080`. Cấu hình đi kèm là một site riêng trên cổng 8080; không xóa site mặc định hoặc thay cấu hình website khác. Nếu cần đổi cổng, sửa dòng `listen 8080` trong file cấu hình rồi kiểm tra/reload Nginx.

## Tên miền, Caddy và WAF

Đặt ứng dụng ở **gốc một hostname riêng**, ví dụ `toeic.example.com`. Các tài nguyên dùng đường dẫn `/assets/...`; chưa cấu hình để chạy dưới đường dẫn con như `/toeic/`.

Nếu Caddy chạy trực tiếp trên cùng host Ubuntu, tham khảo `deploy/Caddyfile.example` và thay hostname bằng tên miền của bạn:

```caddyfile
toeic.example.com {
    reverse_proxy 127.0.0.1:8080
}
```

Nếu giữ WAF/Nginx/Cloudflare Tunnel phía trước, cho upstream trỏ đến `http://127.0.0.1:8080` khi proxy/tunnel chạy trên cùng host. Nếu proxy/tunnel ở một container hoặc máy khác, dùng địa chỉ host hoặc mạng Docker mà nó truy cập được; `127.0.0.1` trong container là chính container đó. HTTPS được kết thúc tại proxy/tunnel hiện có.

## Tiến độ khi chuyển từ demo sang server riêng

Tiến độ gắn với từng trình duyệt và từng origin (giao thức + hostname + cổng), không nằm trong server. Miền demo ChatGPT và miền/IP tự host có vùng lưu khác nhau; dữ liệu cũ không tự chuyển sang.

Muốn giữ tiến độ, trên trình duyệt đang chơi:

1. Ở web cũ, mở DevTools → Application → Local Storage (Firefox: Storage).
2. Sao chép nguyên giá trị JSON của khóa `toeic-pixel-arena-demo-v1` vào một file văn bản để giữ bản sao.
3. Mở web mới, trong Local Storage của địa chỉ mới, đặt khóa cùng tên với giá trị JSON đó.
4. Tải lại trang mới. Kiểm tra số từ đã nhớ và tiến độ bản đồ.

Xóa dữ liệu trình duyệt hoặc dùng cửa sổ ẩn danh sẽ ảnh hưởng khả năng giữ tiến độ. Sao lưu server `dist/` không sao lưu tiến độ học trên các máy người chơi.

## Sửa mã / kiểm tra

- `dist/index.html`: khung ứng dụng.
- `dist/data.js`: 600 từ, IPA, nghĩa, ví dụ và bản dịch.
- `dist/question-engine.js`: câu hỏi ba mức.
- `dist/campaign-engine.js`, `dist/campaign-ui.js`, `dist/campaign.css`: bản đồ và mở khóa.
- `dist/battle-engine.js`, `dist/battle-games.js`: thẻ bài và robot.
- `dist/word-journey.js`: ghi nhớ / từ khó.
- `dist/assets/`: toàn bộ hình ảnh đi kèm.
- `tests/`: 37 kiểm tra tự động của game.

Nếu máy phát triển có Node.js, chạy `npm test`. Khi thay đổi `dist/`, cấu hình Docker phục vụ trực tiếp các file đó. Với Nginx trực tiếp, chép lại `dist/` vào `/var/www/pixel-arena/`.

Âm thanh hành động được tạo bằng Web Audio. Nút nghe từ dùng giọng tiếng Anh qua API giọng đọc của trình duyệt/thiết bị, không cần API key trong project; giọng đọc phụ thuộc thiết bị.

## Kiểm tra bản xuất

`SOURCE.json` ghi phiên bản/commit gốc; `SHA256SUMS` ghi checksum từng file. Có thể kiểm tra bằng:

```bash
sha256sum -c SHA256SUMS
```

Mã game đã qua 37 kiểm tra tự động trước khi xuất. Cấu hình Docker/Nginx trong gói là phần bổ sung để tự host; môi trường xuất không có Docker/Nginx nên chưa chạy thử container hoặc `nginx -t` tại đây. Các lệnh kiểm tra trên Ubuntu được ghi ở trên.

Tài liệu tham khảo: https://hub.docker.com/_/nginx và https://nginx.org/en/docs/http/ngx_http_core_module.html
