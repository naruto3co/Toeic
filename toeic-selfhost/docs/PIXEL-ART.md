# Đồ họa pixel — Eclipse v1.3.1

Bộ ảnh này dùng ImageGen tích hợp (không dùng CLI), được tạo riêng và đưa vào màn chơi thật. Các ảnh có alpha giữ nguyên nền trong suốt; phần chuyển động, khung giao diện và hạt hiệu ứng được dựng bằng CSS có bước nhảy, hỗ trợ giảm chuyển động.

Tệp được dùng trong dự án:

- `public/assets/pixel-crystal-v1.png`: Hộ Vệ Pha Lê.
- `public/assets/pixel-ember-v1.png`: Bạo Chúa Tro Tàn.
- `public/assets/pixel-eclipse-v1.png`: Long Vương Nhật Thực, đồng thời dùng ở sảnh game.
- `public/assets/pixel-hero-v1.png`: pháp sư giữ ký ức.
- `public/assets/pixel-arena-v1.png`: đấu trường dưới trăng và phần giới thiệu.
- `public/assets/pixel-spells-v1.png`: atlas 3×2 cho sáu thẻ kỹ năng và hiệu ứng phép.
- `public/boss-pixel.css`: giao diện pixel, bố cục và hiệu ứng; chỉ áp dụng trò đánh boss.

Boss trong bản v1.3 đã được thay bằng ba sprite riêng. Bộ robot và nền robot dùng các tệp cũ của Biệt đội Neon.

Prompt đầy đủ theo lần tạo (atlas boss ban đầu chỉ làm ảnh tham chiếu cho ba sprite cuối):

## 1. bosses

Use case: stylized-concept. Asset type: production pixel-art boss sprite sheet for a browser deckbuilding game. Create a WIDE 3:1 transparent PNG with THREE EQUAL SQUARE CELLS in a single horizontal row. Cell 1: enormous cobalt stone crystal guardian with cyan crystal fists and a bright blue heart. Cell 2: towering ember-red armored ash demon with glowing orange molten fissures, a horned crown and a heavy axe. Cell 3: majestic violet-and-gold eclipse dragon with spread bat wings and amethyst crystal armor. Every boss faces LEFT toward a player on the left, fully visible inside its own cell, feet aligned near the same bottom baseline, at least 8% clear padding, no overlapping cells. True hand-placed 16-bit SNES-era pixel art, large readable pixel clusters, strong 1-pixel dark navy outlines, 3-tone stepped shading, limited 32-color palette, clear silhouettes, no anti-aliasing, no smooth gradients, no 3D rendering or painting. Think effective 96x96 source sprites enlarged with nearest-neighbor to 512x512 cells. Transparent outside the characters, no floor, no background, no UI, no labels, no text, no watermark. Three separate impressive full-body enemies.

## 2. hero

Use case: stylized-concept. Asset type: production player sprite for a pixel-art fantasy deckbuilding browser game. One original memory-keeper mage knight, full body, facing RIGHT in a confident combat stance, holding an open floating spellbook in one hand and a radiant cyan rune in the other. Teal hood and short teal cloak, ivory-and-gold armor, small dark boots, determined human face visible. Charming heroic silhouette, readable from a small game size, not a giant head. Genuine hand-placed 16-bit SNES-era pixel art, deliberate chunky pixel clusters, dark navy 1-pixel outlines, 3-tone stepped shading, limited 24-color palette. Effective 96x96 source sprite enlarged by nearest-neighbor. No antialiasing, no smooth gradients, no 3D, no painterly texture. Single square image, full silhouette centered with 10% padding, alpha transparent background, no floor, no scene, no UI, no letters, no words, no watermark.

## 3. arena

Use case: stylized-concept. Asset type: widescreen pixel-art battle arena background for a deckbuilding game. Original ancient moonlit spell-temple ruins on a floating island, side-view combat stage. Broad EMPTY flat horizontal stone platform across the lower third, with room to place a mage on the left and a huge boss on the right. Broken pillars at extreme left and right, cyan runes, distant layered indigo mountains and violet clouds, large pale moon high near center, tiny stars. Beautiful cohesive blue-purple 16-bit SNES pixel art with deliberately chunky square pixels and crisp hard edges, limited 32-color palette, stepped color bands and subtle dithering, no gradients, no blur, no antialiasing, no 3D. Landscape 16:9 composition, effective 384x216 logical pixels enlarged nearest-neighbor, no characters, no enemies, no text, no HUD, no borders, no watermarks. Foreground must remain open and playable.

## 4. spells

Use case: stylized-concept. Asset type: 6 pixel-art spell illustrations atlas for a browser card game. Landscape 3:2 image divided EXACTLY into a seamless grid of THREE equal columns and TWO equal rows, SIX square panels. Each illustration stays inside its own cell, with equal margins. Top-left: silver sword making a cyan crescent slash, navy backdrop. Top-center: lavender crystal shield with a blue protective aura, navy backdrop. Top-right: fiery orange meteor with yellow core and red pixel embers falling diagonally, dark wine backdrop. Bottom-left: emerald healing sprout and green restorative sparkle, dark forest backdrop. Bottom-center: bold golden lightning bolt with electric yellow sparks, dark blue backdrop. Bottom-right: amethyst spellbook and focused violet rune, deep purple backdrop. Cohesive authentic 16-bit SNES-style pixel art, effective 64x64 logical pixels per cell enlarged nearest-neighbor, blocky readable pixel clusters, dark outlines, stepped 3-shade colors, no smooth gradients, no antialiasing, no 3D, no photographic surfaces, no text, no letters, no numbers, no card frames, no watermark. Every panel fully opaque and richly colored.

## 5. crystal

Use case: style-transfer / production sprite extraction. Edit target: the attached boss sprite sheet. Create a standalone square sprite containing ONLY the LEFT blue crystal stone guardian. Preserve that character's exact pixel-art design, palette and recognizable details: large blue crystal fists, cobalt stone armor and cyan heart. Recompose the full body inside a single square canvas with at least 10% empty transparent margins on ALL sides, completely contained wings/weapon/tail, feet visible, boss facing LEFT. Remove the other two characters entirely; absolutely no fragments of neighboring sprites. Keep deliberate crisp 16-bit square pixels, stepped shading and dark outlines. No smooth painting, no 3D, no antialiasing. True transparent background, no floor, no background, no text, no UI. This is one isolated full-body boss, not a sprite sheet.

## 6. ember

Use case: style-transfer / production sprite extraction. Edit target: the attached boss sprite sheet. Create a standalone square sprite containing ONLY the CENTER ash demon. Preserve that character's exact pixel-art design, palette and recognizable details: obsidian armor, horned ember crown, orange molten fissures and huge axe. Recompose the full body inside a single square canvas with at least 10% empty transparent margins on ALL sides, completely contained wings/weapon/tail, feet visible, boss facing LEFT. Remove the other two characters entirely; absolutely no fragments of neighboring sprites. Keep deliberate crisp 16-bit square pixels, stepped shading and dark outlines. No smooth painting, no 3D, no antialiasing. True transparent background, no floor, no background, no text, no UI. This is one isolated full-body boss, not a sprite sheet.

## 7. eclipse

Use case: style-transfer / production sprite extraction. Edit target: the attached boss sprite sheet. Create a standalone square sprite containing ONLY the RIGHT purple eclipse dragon. Preserve that character's exact pixel-art design, palette and recognizable details: amethyst scales, violet-and-gold wings, gold horns and eclipse wing markings. Recompose the full body inside a single square canvas with at least 10% empty transparent margins on ALL sides, completely contained wings/weapon/tail, feet visible, boss facing LEFT. Remove the other two characters entirely; absolutely no fragments of neighboring sprites. Keep deliberate crisp 16-bit square pixels, stepped shading and dark outlines. No smooth painting, no 3D, no antialiasing. True transparent background, no floor, no background, no text, no UI. This is one isolated full-body boss, not a sprite sheet.

