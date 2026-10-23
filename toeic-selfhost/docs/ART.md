# Tài sản hình ảnh — Neon / Eclipse

Ảnh gốc được tạo riêng bằng ImageGen cho bản nâng cấp này, đã được đưa vào game thật. Giao diện, thẻ bài, thanh máu, bố cục đội hình, các chuyển động và hiệu ứng được dựng bằng HTML/CSS; ảnh không chứa chữ hay giao diện giả.

| Tệp | Nội dung và cách dùng |
| --- | --- |
| `public/assets/robots-v1.png` | Sprite sheet nền trong suốt, ba ô bằng nhau: robot tiên phong xanh, xạ thủ trắng/ngọc, hỗ trợ tím/vàng. Dùng trên sân, cửa hàng, thẻ giới thiệu trong Biệt đội Neon. CSS cắt theo từng phần ba; ba biến thể khác dùng đổi sắc. |
| Bộ `public/assets/pixel-*.png` | v1.3.1: ba boss pixel riêng, pháp sư, đấu trường và atlas phép. Xem [PIXEL-ART.md](PIXEL-ART.md) để biết các tệp và prompt đang dùng. |
| `public/assets/arena-v1.png` | Đấu trường khoa học viễn tưởng trên đảo nổi. Dùng làm nền sân robot; màn đánh boss dùng nền pixel riêng từ v1.3.1. |

Các chỉ dẫn tạo ảnh:

1. **Robot:** production game asset sprite sheet, transparent, one row of THREE EQUAL SQUARE CELLS; original bulky blue shield guardian, teal-and-white ranged cannon mech, and violet-and-gold floating support robot. Polished stylized 3D, complete silhouettes, one character per third, no text, UI or logos.
2. **Boss:** original full-body obsidian crystal winged dragon-golem, violet and gold armor, molten amber core, facing left; polished premium stylized 3D game art, transparent background, no scene, text, UI or logos.
3. **Arena:** panoramic futuristic floating arena at dusk, navy/violet sky, cyan pylons, magenta energy, distant planets and structures; broad empty foreground for units and a boss, no characters, text or UI.

Ảnh được cung cấp trực tiếp từ các tệp cùng origin của ứng dụng. Không cần API key hoặc yêu cầu mạng tới nhà cung cấp ảnh khi chơi.
