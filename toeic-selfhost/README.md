# Từng chút một — bản tự host

Ứng dụng học từ vựng TOEIC bằng tiếng Việt: 600 từ và ví dụ tự biên soạn, 50 chủ đề, flashcard, bài luyện 30 câu và các game, gồm bảng tìm cặp 8×8. Trả lời đúng trong bài luyện và các mini game tự chuyển sau 2 giây.

Bản này chạy độc lập trên server của bạn. Backend Node.js 24, database SQLite trong Docker volume, không cần Cloudflare D1 hoặc ChatGPT để đăng nhập. Không có thư viện npm bên ngoài cần cài đặt.

## Có gì cho admin?

- Đăng nhập bằng tài khoản và mật khẩu; không có tài khoản/mật khẩu mặc định.
- Trang `/admin`: tìm kiếm, phân trang, tạo tài khoản, đổi tên hiển thị, phân quyền admin/học viên, khóa/mở khóa, đặt lại mật khẩu và thu hồi phiên đăng nhập.
- Xem số từ đã nhớ, sổ từ, bài đã hoàn thành, bài luyện đang làm và số ván đã lưu của từng người.
- Tài khoản do admin cấp phải đổi mật khẩu tạm trước khi vào học. Người dùng có thể tự tạo tài khoản học viên ngay ở màn hình đăng nhập. Tài khoản admin vẫn phải do người vận hành hoặc admin hiện có cấp.
- Nhật ký tạo tài khoản, thay đổi quyền/trạng thái, đặt lại mật khẩu, đăng nhập và đăng xuất. Không lưu mật khẩu trong nhật ký.

## Chạy bằng Docker Compose

Yêu cầu Docker Engine và plugin Docker Compose trên server Linux. Giải nén gói mã nguồn rồi vào thư mục:

```bash
cp .env.example .env
nano .env
```

Đặt `PUBLIC_ORIGIN` bằng URL chính xác sẽ dùng, ví dụ `https://toeic.tenmiencuaban.com`. Biến này dùng kiểm tra nguồn yêu cầu và quyết định cookie HTTPS. `APP_PORT` mặc định là `8081`.

```bash
docker compose up -d --build
docker compose exec -it app node scripts/create-admin.mjs admin
```

Script hỏi mật khẩu hai lần, không hiện ký tự khi nhập. Chọn ít nhất 12 ký tự. Không đưa mật khẩu vào lệnh shell hoặc file `.env`.

Mở URL đã cấu hình, đăng nhập bằng admin vừa tạo. Người học có thể bấm **Tạo tài khoản**, nhập tên hiển thị, tên tài khoản và mật khẩu rồi đăng nhập để mở hồ sơ riêng. Admin vẫn có thể tạo tài khoản trong **Hồ sơ học tập → Quản trị người dùng**.

`ALLOW_REGISTRATION=true` mặc định bật tự đăng ký. Đặt `ALLOW_REGISTRATION=false` trong `.env` rồi chạy `docker compose up -d` nếu muốn chỉ admin cấp tài khoản. Tự đăng ký luôn có quyền học viên; người đăng ký đầu tiên cũng không được cấp quyền admin.

Container chỉ mở `127.0.0.1:8081` trên host. Đặt reverse proxy HTTPS hoặc Cloudflare Tunnel ở phía trước; không mở database ra mạng.

### Nếu dùng Cloudflare Tunnel đang có trên server

Thêm hostname mới vào danh sách `ingress` trong cấu hình tunnel hiện có, trước rule cuối `http_status:404`:

```yaml
- hostname: toeic.tenmiencuaban.com
  service: http://127.0.0.1:8081
```

Tạo bản ghi DNS cho hostname đó bằng tunnel đang dùng. Sau khi chỉnh cấu hình, khởi động lại dịch vụ tunnel phù hợp trên server của bạn. Nếu `cloudflared` chạy trong container riêng, `127.0.0.1` là chính container đó: nối chung Docker network và trỏ tới `http://app:3000` thay vì dùng ví dụ host ở trên.

### Thử cục bộ trước

Trong `.env`, đặt `PUBLIC_ORIGIN=http://localhost:8081`. Trên chính server, mở `http://localhost:8081`. Nếu truy cập từ máy khác qua LAN, đặt origin là IP/hostname và cổng thực sự dùng, rồi cấu hình reverse proxy hoặc ánh xạ cổng phù hợp. Khi đổi `.env`, chạy `docker compose up -d` để tạo lại container với cấu hình mới.

## Dữ liệu và đăng nhập

SQLite là database quan hệ nằm trong volume `toeic_data`. Các bảng gồm `users`, `profiles`, `sessions`, `audit_log`, `login_limits` và `schema_migrations`. Tiến độ gắn với ID người dùng lấy từ phiên đăng nhập ở server; gửi tên người khác trong request không cho phép đọc hoặc ghi hồ sơ của họ.

Mật khẩu được băm scrypt với salt ngẫu nhiên. Cookie phiên có HttpOnly, SameSite=Strict và Secure khi origin là HTTPS; token phiên chỉ được lưu dưới dạng hash trong database. Phiên có hạn cố định tối đa 365 ngày kể từ lúc đăng nhập (cookie và database cùng thời hạn). Các thao tác ghi kiểm tra Origin và CSRF token. Có giới hạn thử đăng nhập; chặn tài khoản hoặc đổi/reset mật khẩu sẽ thu hồi các phiên liên quan.

Trình duyệt giữ bản đệm tiến độ để tiếp tục đồng bộ nếu mất mạng trong lúc học. Không giữ mật khẩu/token đăng nhập trong localStorage. Phải kết nối server để đăng nhập mới. Dữ liệu học trên thiết bị dùng chung vẫn có thể còn trong bộ nhớ trình duyệt; dùng tài khoản hệ điều hành/trình duyệt riêng nếu cần tách dữ liệu tại máy.

Bảng tìm cặp 4×4, 6×6 và 8×8 tự lưu khi ghép thẻ, tạm dừng, rời trang và mỗi 5 giây đang chơi. Quay lại **Chơi mà nhớ → Tiếp tục ván đang lưu** để khôi phục vị trí thẻ, thẻ đã dọn, lượt sai, điểm và thời gian. Đồng hồ tạm dừng khi rời trang và chỉ chạy tiếp sau khi bấm Tiếp tục. Các mini game khác lưu kết quả khi hoàn thành. Lịch sử giữ tối đa 100 ván gần nhất. Bài luyện 30 câu có lưu tiến độ sau khi chuyển câu.

SQLite phù hợp bản một server, một tiến trình này. Không chạy nhiều replica dùng chung file database qua network filesystem. Nếu sau này cần nhiều server hoặc tải ghi lớn, nên chuyển lớp database sang PostgreSQL.

## Ôn theo lịch, chơi tiếp và luyện nghe (v1.2)

- **Ôn theo lịch** trong thanh điều hướng: từ đã học/đánh dấu/làm bài sẽ vào vòng ôn. Trả lời đúng liên tiếp giãn lịch 1, 3, 7, 14, 30, 60 ngày; trả lời sai quay lại sau 10 phút. Mỗi lượt tối đa 20 từ. Các câu trả lời trong bài luyện, mini game và bảng thẻ đều cập nhật lịch. Đây là quy tắc lịch ôn của ứng dụng, không phải lịch thi TOEIC.
- **Tiếp tục ván đang lưu** trong Chơi mà nhớ: một ván bảng thẻ cho mỗi tài khoản. Ván mới thay ván đang lưu; các trò nhỏ khác không xóa ván bảng thẻ. Nếu hai thiết bị cùng chơi, bản lưu có thời điểm cập nhật mới nhất được dùng; nên tạm dừng và chờ “Đã lưu lên hồ sơ” trước khi đổi thiết bị. Khi mất mạng, bản đệm vẫn giữ ván trên chính trình duyệt và gửi lại khi có kết nối.
- **Nghe rồi nhớ** trong Chơi mà nhớ: 10 từ tiếng Anh, chọn nghĩa tiếng Việt, nghe lại và đổi giọng chậm/tốc độ thường. Không hiện chữ tiếng Anh trước khi trả lời. Đáp án chỉ mở khi trình duyệt bắt đầu đọc; khi phát lỗi có thông báo để thử lại.
- Âm thanh dùng Web Speech API và giọng đọc của thiết bị. Chất lượng/khả năng đọc tiếng Anh và hoạt động offline phụ thuộc trình duyệt, hệ điều hành và giọng đã cài. Không có file MP3 hoặc dịch vụ TTS trả phí trong bản này.
- Lịch ôn và ván đang lưu được lưu trong JSON tiến độ của SQLite. Không cần xóa database hoặc tạo lại tài khoản khi nâng cấp. Bản cũ chưa có các trường này vẫn đọc được; API giữ chúng khi nhận yêu cầu từ client cũ.

Nâng cấp: sao lưu, cập nhật mã nguồn rồi chạy `docker compose up -d --build`, giữ nguyên `.env` và volume `toeic_data`. Tải lại trang trên các thiết bị để nhận JavaScript mới.

## Đội hình robot và thẻ bài đánh boss (v1.3)

- **Biệt đội Neon:** 6 loại robot, ghép 3 bản để tăng sao, xếp 6 ô trước/sau, cộng hưởng vai trò và 5 đợt chiến đấu tự động. Nhớ đúng từ để kiếm đồng tuyển quân và tiếp năng lượng.
- **Long Vương Nhật Thực:** bộ bài 12 từ, 6 kỹ năng có chi phí, giáp/hồi máu, đòn boss báo trước, 3 boss và di vật nâng cấp giữa chặng. Chọn chiến thuật đồng thời ôn từ Anh–Việt.
- Đấu trường, sprite robot và boss có hình ảnh riêng kèm hiệu ứng. Có đồng hồ thời gian thực, tạm dừng, tốc độ chiến đấu và lưu riêng từng ván theo tài khoản. Đúng tự đi tiếp sau 2 giây.
- Kết quả và từ vừa nhầm nối với hồ sơ, sổ từ và lịch ôn. Nâng cấp giữ database hiện có; không cần tạo lại tài khoản.

Luật chơi, cách lưu và hướng dẫn cập nhật: [docs/GAMES.md](docs/GAMES.md). Nguồn tài sản đồ họa: [docs/ART.md](docs/ART.md).

**v1.3.1:** màn đánh boss chuyển sang pixel art: pháp sư, ba tạo hình boss riêng, đấu trường dưới trăng, sáu hình kỹ năng, khung thẻ/HP kiểu retro và hiệu ứng phép theo từng kỹ năng. Có chế độ giảm chuyển động theo thiết bị. Dùng tiếp hồ sơ và ván đang lưu hiện có; không có thay đổi schema database. Chi tiết ảnh và prompt: [docs/PIXEL-ART.md](docs/PIXEL-ART.md).

## Kiểm tra nguồn đăng nhập (v1.3.2)

Nếu request ghi dữ liệu không có header `Origin`, server kiểm tra origin của `Referer` và chỉ chấp nhận khi trùng chính xác `PUBLIC_ORIGIN`. Nếu có `Origin`, giá trị đó phải hợp lệ và trùng; giá trị rỗng, `null` hoặc khác origin không được dùng Referer để bỏ qua. Request thiếu cả hai bằng chứng hoặc có `Sec-Fetch-Site: cross-site` vẫn bị từ chối. Kiểm tra CSRF, cookie, mật khẩu và database giữ nguyên.

Khi bị từ chối, server ghi một dòng JSON `origin_rejected` chỉ chứa mã lý do và origin; không ghi mật khẩu, cookie, token, đường dẫn hoặc query của Referer. Sau khi thử đăng nhập một lần, xem:

```bash
sudo docker compose logs --since=3m app | grep origin_rejected
```

`origin_mismatch` / `referer_mismatch` chỉ ra URL khác cấu hình; `missing_source` là thiếu nguồn có thể kiểm chứng; `invalid_origin` là Origin không hợp lệ; `cross_site` là Fetch Metadata đánh dấu khác site. Đặt `PUBLIC_ORIGIN` đúng giao thức + hostname + cổng và dùng cùng URL trên máy tính, điện thoại. Sau khi sửa `.env`, chạy `sudo docker compose up -d --force-recreate`; sau khi sửa code, chạy `sudo docker compose up -d --build`.

Bản sửa có kiểm tra tự động cho đăng nhập và lưu hồ sơ khi thiếu Origin nhưng Referer hợp lệ, đồng thời kiểm tra các trường hợp bị chặn. Chưa xác minh request từ iPhone của người vận hành, nên không khẳng định mọi lỗi Safari đã được giải quyết. Không cần xóa database hoặc reset tài khoản khi cập nhật.

## Toàn màn hình cho hai game chiến thuật (v1.3.4)

- **Biệt đội Neon** và **Long Vương Nhật Thực** đều có nút **Toàn màn hình** ở thanh công cụ trong trận. Trên máy tính có thể dùng F11; Esc thoát chế độ mở rộng/native, còn toàn màn hình do trình duyệt F11 điều khiển thì dùng F11 để thoát.
- Chỉ phần game chiếm màn hình khi mở rộng; thanh bên, thanh trên và chân trang được ẩn. Thoát trận, đổi mục học hoặc đăng xuất sẽ khôi phục giao diện web.
- Fullscreen dùng phần tử ứng dụng cố định, không dùng khung trận bị thay mỗi khi trả lời/chuyển lượt. Nếu API không hỗ trợ, bị từ chối hoặc trình xem nhúng không cho toàn màn hình, game vẫn mở rộng trong vùng nhìn hiện có.
- Điện thoại tự chuyển sang bố cục vừa vùng nhìn: màn hình dọc xếp cảnh và lựa chọn theo chiều dọc; màn hình ngang đặt cạnh nhau. Chiều cao được cập nhật khi đổi hướng/thanh trình duyệt thay đổi, có chừa vùng tai thỏ. Nội dung giải thích/kết quả quá dài cuộn trong bảng riêng.
- Đã kiểm tra giao diện trong trình duyệt với các vùng nhìn 390×844, 375×667 và 844×390. Chưa kiểm tra trên iPhone/Safari vật lý; vùng nhìn mở rộng không thể ẩn thanh trình duyệt nếu thiết bị không hỗ trợ Fullscreen API.
- Sau khi cập nhật mã, chạy `sudo docker compose up -d --build` trong đúng thư mục đang triển khai rồi tải lại trang. Giữ nguyên `.env`, cấu hình Compose và volume dữ liệu. Phiên đăng nhập 365 ngày của bản 1.3.3 vẫn được giữ.

## Phiên đăng nhập một năm (v1.3.3)

- Phiên mới có hạn **365 ngày** (31.536.000 giây), áp dụng cho cả học viên và admin. Hạn tính từ lúc đăng nhập, không tự kéo dài mỗi lần mở trang.
- Cookie trình duyệt và `sessions.expires_at` trong SQLite dùng chung một thời hạn. Đổi mật khẩu thành công cũng tạo phiên mới với hạn 365 ngày.
- Sau khi nâng cấp, **đăng xuất rồi đăng nhập lại một lần** để nhận cookie và phiên mới. Phiên được tạo trước bản cập nhật vẫn giữ hạn cũ; không gia hạn hàng loạt trong database.
- Đăng xuất, đặt lại/đổi mật khẩu, khóa tài khoản hoặc admin thu hồi phiên vẫn có hiệu lực ngay. Xóa cookie/dữ liệu trình duyệt cũng có thể yêu cầu đăng nhập lại sớm hơn.
- Không cần đổi `.env` hoặc schema database. Cập nhật mã rồi chạy `sudo docker compose up -d --build`, giữ nguyên `PUBLIC_ORIGIN=https://learn.datngoc.lol` nếu đó là địa chỉ thực tế bạn dùng.

## Sao lưu và khôi phục

Tạo snapshot nhất quán ngay cả khi app đang chạy (script dùng SQLite backup API):

```bash
docker compose exec app node scripts/backup.mjs
docker compose cp app:/data/backups ./backups
```

Lưu bản sao ở nơi khác ngoài server. Snapshot có dữ liệu người học và password hash: chỉ cấp quyền cho người vận hành.

Khôi phục một bản sao cụ thể, ví dụ `./backups/toeic-2026-10-21T00-00-00-000Z.sqlite` (thay bằng tên file thực tế):

```bash
docker compose stop app
docker compose run --rm --user root --entrypoint sh app -c 'rm -f /data/toeic.sqlite-wal /data/toeic.sqlite-shm'
docker compose run --rm --user root --entrypoint sh -v "$PWD/backups:/restore:ro" app -c 'cp /restore/TEN_FILE_THUC_TE.sqlite /data/toeic.sqlite && chown node:node /data/toeic.sqlite && chmod 600 /data/toeic.sqlite'
docker compose up -d
```

Đổi `TEN_FILE_THUC_TE.sqlite` thành file muốn khôi phục. Sao lưu hiện trạng trước khi khôi phục; thao tác này thay database bằng snapshot. Không dùng `docker compose down -v` nếu muốn giữ dữ liệu.

## Quên mật khẩu admin

Người có quyền shell trên server có thể đặt lại mật khẩu admin bằng script vận hành:

```bash
docker compose exec -it app node scripts/recover-admin.mjs admin
```

## Nhập tiến độ cũ

Dữ liệu trong bản Sites/D1 không tự xuất hiện trên server mới. Xem [docs/MIGRATION.md](docs/MIGRATION.md). Gói mã nguồn không chứa hồ sơ người dùng thật hay dữ liệu D1.

## Chạy không dùng Docker / kiểm tra

Dùng Node.js 24.11 trở lên trong nhánh 24.x:

```bash
node --test tests/*.test.mjs
PUBLIC_ORIGIN=http://localhost:3000 DB_PATH=./data/toeic.sqlite node server/main.mjs
```

Ở terminal khác, dùng cùng `DB_PATH` để tạo admin:

```bash
DB_PATH=./data/toeic.sqlite node scripts/create-admin.mjs admin
```

## Tham khảo kỹ thuật

- Node.js SQLite / backup: https://nodejs.org/download/release/latest-v24.x/docs/api/sqlite.html
- Node.js crypto / scrypt: https://nodejs.org/docs/latest-v24.x/api/crypto.html
- OWASP Password Storage: https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html

Cấu hình hash dùng scrypt N=32768, r=8, p=3. Hãy giữ Node/Docker image được cập nhật và đặt HTTPS trước khi cho người dùng truy cập qua Internet.
