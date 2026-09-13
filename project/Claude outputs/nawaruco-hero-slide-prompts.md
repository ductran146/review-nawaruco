# Câu lệnh tạo ảnh slide banner trang chủ — NAWARUCO

Dùng cho AI tạo ảnh (Midjourney, DALL·E, Ideogram, Stable Diffusion...). Chủ đề: **đời sống người dân được hưởng lợi từ nước sạch nông thôn**. Mỗi slide có 1 câu lệnh tiếng Anh (để AI hiểu tốt hơn) kèm mô tả tiếng Việt bên dưới.

## Thông số kỹ thuật chung (áp cho cả 4 slide)

- **Tỉ lệ khung hình:** 21:7 (tương đương 3:1, banner ngang). Nếu công cụ không hỗ trợ `21:7`, chọn trực tiếp tỉ lệ `3:1`; chỉ dùng tỉ lệ khác khi không còn lựa chọn và crop về đúng 3:1 trước khi đưa lên web.
- **Độ phân giải xuất:** tối thiểu 2400×800px (đúng tỉ lệ 21:7, đủ nét cho banner full-width). Bản dùng cho màn hình lớn có thể xuất 3000×1000px.
- **Vùng chừa cho chữ:** bố cục nhân vật/chủ thể lệch về **bên phải khung hình**, 40% bên trái để trống/mờ hậu cảnh — vì banner sẽ overlay tiêu đề + nút CTA phía bên trái theo đúng bố cục `.hero-mod` đã dựng.
- **Tông màu:** ánh sáng tự nhiên ban ngày, hơi ngả xanh dương–xanh lá nhẹ trong hậu kỳ để đồng bộ với bộ nhận diện NAWARUCO (#0B3C5D navy, #1B6FA8 xanh nước, #2E8B47 xanh lá) — có thể ghi rõ trong prompt "cool blue-green color grade" như bên dưới.
- **Phong cách:** ảnh tài liệu chân thực (documentary photography), KHÔNG phải minh hoạ 3D/illustration, không chèn chữ/logo trong ảnh (chữ sẽ overlay bằng HTML sau).

---

## Slide 1 — Gia đình lấy nước sạch tại vòi trước sân nhà

**Prompt:**
```
Documentary photography, a rural Vietnamese family in their front yard using a clean outdoor water tap, mother filling a metal bucket with clear running water while her child watches happily, traditional rural house with red clay tiles in soft-focus background, warm morning sunlight, natural candid moment, shallow depth of field, subject composed on the right two-thirds of frame with open negative space on the left, cool blue-green color grade, photorealistic, shot on 35mm lens, high detail, no text, no logo, no watermark --ar 21:7
```

**Mô tả:** một gia đình nông thôn Việt Nam đang hứng nước sạch từ vòi ngoài sân, người mẹ hứng nước vào xô, đứa trẻ đứng cạnh nhìn vui vẻ; nhà mái ngói đỏ mờ phía sau; ánh sáng buổi sáng ấm; bố cục lệch phải để chừa chỗ đặt tiêu đề.

---

## Slide 2 — Trẻ em rửa tay / uống nước sạch

**Prompt:**
```
Documentary photography, close-up of a smiling rural Vietnamese child washing hands under clean flowing tap water, water droplets catching sunlight, genuine candid expression, blurred green rural background, shallow depth of field, subject on the right side of frame with soft negative space on the left, cool blue-green color grade, photorealistic, natural light, high detail, no text, no logo, no watermark --ar 21:7
```

**Mô tả:** cận cảnh một em nhỏ đang rửa tay dưới vòi nước sạch, nước bắn lấp lánh dưới ánh nắng, hậu cảnh xanh mờ; truyền tải thông điệp sức khỏe/vệ sinh nhờ nước sạch.

---

## Slide 3 — Người phụ nữ nấu ăn trong bếp với nước sạch

**Prompt:**
```
Documentary photography, a rural Vietnamese woman in her kitchen washing fresh vegetables under clean running tap water, simple rustic kitchen setting, warm natural window light, authentic candid moment, shallow depth of field, subject composed on the right side of frame with negative space on the left, cool blue-green color grade, photorealistic, high detail, no text, no logo, no watermark --ar 21:7
```

**Mô tả:** người phụ nữ đang rửa rau củ dưới vòi nước sạch trong gian bếp mộc mạc, ánh sáng cửa sổ tự nhiên; thể hiện nước sạch phục vụ sinh hoạt hàng ngày.

---

## Slide 4 — Cận cảnh dòng nước sạch chảy (ảnh mở đầu/trung tính)

**Prompt:**
```
Documentary photography, close-up of clear clean water flowing from a modern tap into a ceramic basin, glistening water droplets, soft morning light, minimal rural home background blurred, elegant and calming composition, negative space on the left side of frame, cool blue-green color grade, photorealistic, high detail, no text, no logo, no watermark --ar 21:7
```

**Mô tả:** cận cảnh nước chảy trong vắt từ vòi hiện đại xuống chậu sứ, không cần có người — dùng làm slide mở đầu trung tính hoặc ảnh dự phòng khi chưa có ảnh thật từ hiện trường.

---

## Sau khi tạo ảnh — trước khi upload lên WordPress

1. Kiểm tra vùng bên trái ảnh đủ "sạch" để chữ overlay đọc rõ — nếu chưa đủ tương phản, thêm lớp gradient tối `linear-gradient(90deg, rgba(11,60,93,.75), transparent 60%)` đè lên ảnh khi code (không cần sửa lại ảnh gốc).
2. Nén ảnh trước khi upload (TinyPNG hoặc tương tự), xuất `.webp` song song `.jpg` để tối ưu tốc độ tải trang.
3. Đặt tên file rõ nghĩa, không dấu, có từ khoá: `nawaruco-hero-gia-dinh-lay-nuoc.webp`, `nawaruco-hero-tre-em-rua-tay.webp`... — hỗ trợ SEO ảnh khi upload vào WordPress Media Library.
4. Khai báo Alt text mô tả đúng nội dung (ví dụ: "Gia đình nông thôn sử dụng nước sạch NAWARUCO tại vòi sân nhà") — bắt buộc cho khả năng tiếp cận và SEO.

## Lưu ý về ảnh do AI tạo

Vì đây là ảnh do AI tạo (không phải ảnh thật của NAWARUCO), nên ghi chú rõ với đội truyền thông trước khi dùng chính thức — nhiều đơn vị nhà nước/dịch vụ công yêu cầu ảnh minh hoạ trên website phải là ảnh thật để đảm bảo tính xác thực. Dùng ảnh AI tạo phù hợp cho **bản demo/phác thảo giao diện**; nên thay bằng ảnh thật chụp tại hiện trường khi lên bản chính thức.
