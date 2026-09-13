# NAWARUCO — Bộ icon

Nguồn: **[Solar](https://icones.netlify.app/collection/solar)** (Iconify, CC BY 4.0),
lấy ngày 2026-09-07 qua `api.iconify.design`.

## Quy ước chọn biến thể

- **bold-duotone** cho icon mang nghĩa, cỡ từ 24px trở lên: ba khối hỗ trợ, dấu tích,
  icon liên hệ ở footer. Lớp mờ phía sau tạo khối.
- **linear** cho icon điều khiển, cỡ nhỏ: tìm kiếm, mũi tên. Nét mảnh, không tranh
  chú ý với chữ.
- **bold** cho giọt nước 14–18px — duotone ở cỡ đó bị nhoè thành một vệt.

## Cách dùng

**Cập nhật 2026-09-09:** mockup không còn mở bằng `file://` — chạy qua dev server
(Five Server) — nên sprite giờ là **1 file dùng chung**
(`mockup/partials/icons.html`), nạp vào mỗi trang bằng
`mockup/assets/js/include-partials.js` (`fetch()` + inject vào
`<div data-include="partials/icons.html">` ở đầu `<body>`), thay vì lặp lại y hệt
trong từng file HTML. Sửa icon (thêm/bớt symbol) chỉ cần sửa đúng 1 file
`partials/icons.html`, áp dụng ngay cho toàn bộ 29 trang.

Tham chiếu bằng `<use>` như cũ, không đổi:

```html
<svg class="icon icon-lg" aria-hidden="true"><use href="#ico-bill"></use></svg>
```

Header và footer dùng cùng cơ chế: `mockup/partials/header.html` và
`mockup/partials/footer.html`, cũng nạp qua `include-partials.js`. Trạng thái
active của menu (mục nào đang được chọn) không hard-code trong file header nữa —
mỗi trang chỉ khai báo `data-nav="<key>"` (và `data-nav-leaf="<href>"` nếu là
trang con trong menu phụ) trên mount point `<div id="nwrc-header">`, script tự
gắn `aria-current="page"` đúng chỗ sau khi header được nạp.

**Lên WordPress:** `template-parts/icons.php` gọi trong `header.php` — không cần
`fetch()` nữa vì PHP `get_template_part()` đã là include ở tầng server (đã dựng
sẵn trong `nawaruco/`).

Cỡ: `.icon` = 1.25em theo chữ của phần tử cha; `.icon-sm` 16px · `.icon-md` 24px ·
`.icon-lg` 52px. Màu icon theo `color` của phần tử cha.

**Không đặt `fill` hay `stroke` trong CSS cho `.icon`.** Icon linear khai báo
`fill="none"` bằng thuộc tính, còn CSS đè lên thuộc tính — đặt `fill:currentColor` sẽ
biến mọi icon linear thành khối đặc.

Icon mang nghĩa phải kèm chữ hoặc `aria-label`; icon trang trí để `aria-hidden="true"`.

## Danh sách đang dùng

| Id | Icon Solar | Biến thể | Dùng ở |
|---|---|---|---|
| `#ico-home` | `solar:home-2-bold-duotone` | duotone | Ô Trang chủ trên menu — **chỉ dùng khi đang ở trang chủ** (`aria-current="page"`), nền brand, icon trắng |
| `#ico-home-linear` | `solar:home-2-linear` | linear | Ô Trang chủ trên menu ở mọi trang khác — cùng màu với các mục menu chưa active |
| `#ico-search` | `solar:magnifier-linear` | linear | Nút tìm kiếm ở topbar |
| `#ico-support` | `solar:headphones-round-bold-duotone` | duotone | Khối Hỗ trợ trực tuyến |
| `#ico-bill` | `solar:bill-list-bold-duotone` | duotone | Khối Tra cứu hoá đơn điện tử |
| `#ico-pay` | `solar:card-transfer-bold-duotone` | duotone | Khối Thanh toán trực tuyến |
| `#ico-drop` | `solar:waterdrop-bold` | bold | Giọt nước trang trí và dấu đầu dòng tiêu đề tin |
| `#ico-drop-duo` | `solar:waterdrop-bold-duotone` | duotone | Giọt nước cỡ lớn |
| `#ico-check` | `solar:check-circle-bold-duotone` | duotone | Danh sách có dấu tích ở khối Dịch vụ |
| `#ico-pin` | `solar:map-point-bold-duotone` | duotone | Địa chỉ ở footer |
| `#ico-phone` | `solar:phone-calling-rounded-bold-duotone` | duotone | Điện thoại, hotline |
| `#ico-mail` | `solar:letter-bold-duotone` | duotone | Email |
| `#ico-fax` | `solar:printer-minimalistic-bold-duotone` | duotone | Số fax |
| `#ico-doc` | `solar:document-text-bold-duotone` | duotone | Mã số thuế, văn bản |
| `#ico-up` | `solar:alt-arrow-up-linear` | linear | Nút về đầu trang |
| `#ico-down` | `solar:alt-arrow-down-linear` | linear | Mũi tên menu con (`.has-sub`) trên thanh menu chính |
| `#ico-left` | `solar:alt-arrow-left-linear` | linear | Nút xem ảnh trước trên băng ảnh |
| `#ico-right` | `solar:alt-arrow-right-linear` | linear | Liên kết Xem chi tiết, Xem hướng dẫn; nút xem ảnh sau |
| `#ico-alert` | `solar:danger-triangle-bold-duotone` | duotone | Cảnh báo sự cố cấp nước |
| `#ico-calendar` | `solar:calendar-mark-bold-duotone` | duotone | Lịch tạm ngừng cấp nước |
| `#ico-tools` | `solar:settings-minimalistic-bold-duotone` | duotone | Dịch vụ sửa chữa |
| `#ico-shield` | `solar:shield-check-bold-duotone` | duotone | Chất lượng nước đạt quy chuẩn |
| `#ico-clipboard` | `solar:clipboard-check-bold-duotone` | duotone | Thủ tục lắp đặt, hồ sơ |
| `#ico-chat` | `solar:chat-round-dots-bold-duotone` | duotone | Kênh chat (Messenger, Zalo) ở trang Liên hệ |
| `#ico-route` | `solar:map-arrow-square-bold-duotone` | duotone | Sơ đồ đường đi |
| `#ico-clock` | `solar:clock-circle-linear` | linear | Giờ làm việc, giờ trực kênh liên hệ |

## Ngoại lệ

Solar **không có icon thương hiệu**. Facebook và YouTube ở topbar giữ hình chính thức
của nền tảng — đó là yêu cầu nhận diện của họ, không thay bằng icon chung.

**Zalo và Messenger ở trang Liên hệ**: hai logo này là nhãn hiệu, vẽ lại theo trí nhớ
sẽ ra bản sai lệch và dùng sai nhận diện của họ. Bản dựng đặt sẵn ô logo
(`.channel__logo`) với chữ "Zalo" và icon chat của Solar làm chỗ giữ; khi bàn giao cần
tải bộ logo chính thức từ trang thương hiệu của Zalo / Meta và thay vào đúng ô đó.

## Thêm icon mới

```bash
curl -s "https://api.iconify.design/solar.json?icons=<ten-icon>" | python3 -m json.tool
```

Thêm `<symbol id="ico-…">` vào sprite **và** một dòng vào bảng trên, trong cùng một lượt.
