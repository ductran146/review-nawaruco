# NAWARUCO — Kích thước ảnh cần chuẩn bị

> **Hiện dùng phiên bản v2:** 9 ảnh toàn cảnh phủ toàn chiều ngang bằng cover, không có vùng nền trống bên trái; gán cho 26 trang con. JPG cạnh dài tối đa 1920px, mỗi ảnh dưới 250 KB. Xem [checklist hiện tại](../page-banners/CHECKLIST.md).

> Ghi chú phương án v1 (đã thay bằng v2): Cập nhật bộ banner trang con ngày 07/09/2026: đã có 9 ảnh minh họa AI gán cho 26 trang. Xem [checklist mới](../page-banners/CHECKLIST.md) và [trang duyệt](../../mockup/banner-review.html). Bản triển khai mới giữ nguồn ảnh 1774 × 887 để không cắt chủ thể; ảnh nằm bên phải, hòa vào nền navy, khung desktop có tỷ lệ khoảng 4:1. Mỗi JPG dưới 250 KB. Quy cách ảnh phẳng 1920 × 480 và hướng dẫn placeholder bên dưới là phương án cũ.

Lập 2026-09-07. Mỗi khung ảnh trong bản demo (`mockup/index.html`) đều ghi sẵn kích
thước tương ứng bảng này.

| Vị trí | Kích thước | Tỉ lệ | Định dạng | Dung lượng tối đa | Ghi chú |
|---|---|---|---|---|---|
| Banner trang chủ (mỗi slide) | **1920 × 823 px** (nguồn 2400 × 1029) | 2,33:1 | JPG | 300 KB | **Đã có 3 slide**, xem bên dưới. Chữ nằm sẵn trong ảnh, đặt ở nửa trái; chữ đó đã được chép vào `alt` |
| **Banner đầu trang con** (Giới thiệu, Dịch vụ, Thanh toán, Tin tức, Liên hệ…) | **1920 × 480 px** | 4:1 | JPG | 250 KB | Tiêu đề trang là **chữ HTML nằm trên ảnh**, không phải chữ trong ảnh. Chừa khoảng trống bên trái để chữ không đè vào chủ thể ảnh; trang tự phủ một lớp tối để chữ trắng đủ tương phản |
| Ảnh đại diện bài viết / tin tức | **800 × 450 px** | 16:9 | JPG | 150 KB | Dùng cho thẻ tin trang chủ, trang lưu trữ, bài chi tiết |
| **Banner quảng bá dịch vụ trong sidebar** | **1680 × 640 px** | 21:8 | JPG | 250 KB | Bốn ảnh; chủ thể ở nửa phải, chừa khoảng trống an toàn ở nửa trái để tự thiết kế chữ |
| Ảnh khối Dịch vụ (Lắp đặt, Sửa chữa) | **1200 × 640 px** | 15:8 | JPG | 200 KB | Hai ảnh |
| Logo công ty | **320 × 320 px** | 1:1 | PNG nền trong suốt | 80 KB | Kèm bản SVG nếu có — SVG luôn nét ở mọi cỡ |
| Logo trên nền đậm (footer) | như trên | 1:1 | PNG trắng | 80 KB | Bản một màu trắng |
| Favicon | **512 × 512 px** | 1:1 | PNG | 40 KB | Sinh các cỡ nhỏ hơn từ bản này |
| Ảnh chia sẻ mạng xã hội (OG) | **1200 × 630 px** | 1.91:1 | JPG | 200 KB | Hiện lên khi dán link website vào Facebook, Zalo |
| Ảnh trong nội dung bài viết | rộng tối đa **1200 px** | tự do | JPG | 250 KB | Cao tuỳ nội dung |

## Vì sao giới hạn dung lượng

Người dùng chính là hộ dân nông thôn, phần lớn vào bằng điện thoại và mạng yếu. Một
ảnh banner 3 MB làm trang chủ mất vài giây mới hiện — đúng lúc họ đang cần tra cứu
gấp. Nếu ảnh gốc nặng hơn mức trên, giảm chất lượng JPG xuống 75–80% trước khi đưa lên.

## Ảnh banner trên điện thoại

Ảnh ngang 1920 × 720 khi thu về bề rộng 375 px chỉ còn khoảng 140 px chiều cao, nên
bản dựng cắt ảnh theo tỉ lệ 16:10 trên mobile. Nếu muốn banner cao và rõ hơn trên
điện thoại thì cần thêm **một bản dọc 1080 × 1350 px** cho mỗi slide, và tôi thêm thẻ
`<picture>` để tự đổi ảnh theo bề rộng màn hình.

## Số lượng slide

Bản dựng hiện để 5 chấm chỉ báo theo mẫu. Cần bao nhiêu slide thì chuẩn bị bấy nhiêu
ảnh; ít hơn 5 cũng được, chỉ cần nói số lượng để tôi chỉnh số chấm.

## Cách nhập ảnh banner đầu trang con

Bản dựng đang để nền gradient thương hiệu. Khi có ảnh, mỗi trang sửa đúng ba chỗ:

```html
<!-- trước -->
<section class="page-banner page-banner--placeholder">
  ...
  <p class="banner-note">[cần ảnh banner 1920 × 480 px · JPG ≤ 250 KB]</p>

<!-- sau -->
<section class="page-banner" style="background-image:url(images/banner-gioi-thieu.jpg)">
  ...
  <!-- bỏ thẻ p.banner-note -->
```

Nghĩa là: bỏ class `page-banner--placeholder`, thêm `background-image`, bỏ dòng ghi chú.
Trong WordPress, `background-image` lấy từ ảnh đại diện của trang:
`style="background-image:url(<?php echo esc_url( get_the_post_thumbnail_url( null, 'full' ) ); ?>)"`.

Có thể dùng **một ảnh chung cho mọi trang con** — nhanh và vẫn nhất quán. Ảnh riêng
từng trang chỉ đáng làm khi mỗi trang có một chủ thể thật khác nhau.

## Băng ảnh trang chủ — 3 slide đã đưa vào (2026-09-07)

Nguồn: `outputs/hero-images/nawaruco-banner-*-co-chu.jpg` (2400 × 1029). Bản dùng
trên trang nằm ở `mockup/images/`, đã giảm về 1920 px và nén lại:

| Slide | File | Dung lượng | Chữ trong ảnh |
|---|---|---|---|
| 1 | `banner-1-gia-dinh.jpg` | 618 → **214 KB** | Nước sạch hôm nay / Vững bền cuộc sống mai sau |
| 2 | `banner-2-tuong-lai.jpg` | 700 → **245 KB** | Nguồn nước trong lành / Ươm mầm tương lai |
| 3 | `banner-3-van-hanh.jpg` | 541 → **186 KB** | Vận hành tận tâm / Cấp nước an toàn |

Ba ảnh gốc cộng lại 1,8 MB — với mạng yếu ở nông thôn thì đó là vài giây trắng
trang. Sau khi nén còn 645 KB, và chỉ slide 1 tải ngay (`fetchpriority="high"`),
hai slide sau `loading="lazy"`.

**Trên điện thoại**: ảnh tỉ lệ 2,33:1 thu về 375 px chỉ còn 161 px cao, chữ trong ảnh
không đọc được. Bản dựng đổi khung banner sang 4:3 và neo ảnh về bên trái
(`object-position:left center`) — phần chữ được phóng to, phần ảnh bên phải bị cắt.
Nếu muốn không cắt, cần **thêm một bản ảnh dọc cho mỗi slide** (đề xuất 1080 × 1350)
và tôi thêm thẻ `<picture>` để đổi ảnh theo bề rộng màn hình.
