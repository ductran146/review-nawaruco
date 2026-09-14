# NAWARUCO — Design System

Bộ token và component giao diện cho website Công ty Cổ phần Cấp nước Nông thôn Nam Định (**NAWARUCO**). Màu lấy **đúng từ file logo chính thức** (`brand/logo-wave.svg`: xanh nước `#00649F`, xanh lá `#00AB38`) — cập nhật 2026-09-08, trước đó là màu ước lượng bằng mắt từ ảnh logo và tham khảo bố cục/mô-đun của website ngành nước [bwaco.com.vn](https://www.bwaco.com.vn/).

## Cấu trúc thư mục

```
design-system/
├── tokens.css        → biến CSS: màu, typography, khoảng cách, bo góc, đổ bóng
├── components.css     → style cho từng thành phần UI (dùng lại tokens.css)
├── components.html    → thư viện xem trực quan + markup mẫu copy-paste
└── README.md          → tài liệu này
```

Nhúng theo đúng thứ tự trong `<head>`:

```html
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Montserrat:wght@600;700;800&display=swap" rel="stylesheet">
<link rel="stylesheet" href="tokens.css">
<link rel="stylesheet" href="components.css">
```

Mở `components.html` trực tiếp trong trình duyệt để xem toàn bộ thành phần và copy markup.

## Component dùng chung ở tầng HTML (mockup)

Ngoài style (`components.css`), phần mockup tĩnh (`mockup/*.html`) còn có 1 lớp
component ở tầng HTML/JS, để sửa header/footer/icon/khung banner chỉ cần sửa
đúng 1 nơi thay vì lặp lại trong 29 file trang. Nguồn: `mockup/partials/`,
`mockup/assets/js/include-partials.js`. **Cần chạy qua HTTP** (vd. Five Server),
không mở được bằng `file://`.

- **Nội dung giống hệt mọi trang** (icon sprite, header, footer) → nạp bằng
  `fetch()` từ 1 file trong `mockup/partials/`, mỗi trang chỉ còn 1 mount point:
  `<div data-include="partials/header.html" data-nav="dich-vu"></div>`. Trạng
  thái active của menu gắn qua `data-nav`/`data-nav-leaf`, script tự set
  `aria-current="page"` đúng chỗ sau khi header nạp xong.
- **Khung giống nhau, nội dung khác mỗi lần dùng** (page-banner, widget-promo
  ở sidebar) → khung HTML nằm cố định trong `include-partials.js`, nội dung
  truyền qua data-attribute ngay trên mount point, dựng chuỗi tại chỗ (không
  cần fetch):
  ```html
  <div data-include="page-banner" data-image="images/page-banners/gia-nuoc.jpg"
       data-title="Giá nước" data-desc="..." data-crumbs="Trang chủ|index.html;Giá nước|"></div>
  <div data-include="widget-promo" data-href="ho-tro-khach-hang.html"
       data-img="images/..." data-img-w="1680" data-img-h="640" data-alt="..."
       data-cta="Xem tất cả hỗ trợ khách hàng" data-after-block="true"></div>
  ```
- **Không componentize được**: khối `<head>` (meta, link font, link
  tokens.css/components.css) — phải chạy đồng bộ trước khi trang vẽ, nạp bằng
  `fetch()` sẽ gây trắng trang/không có CSS một nhịp. Vẫn lặp lại nguyên trong
  từng file, đúng chuẩn cho site HTML tĩnh nhiều trang không có build step.

**Lên WordPress:** toàn bộ phần trên đã có bản PHP thật trong `nawaruco/`
(`header.php`, `footer.php`, `template-parts/icons.php`, `get_template_part()`)
— không cần `include-partials.js` nữa vì PHP include ở tầng server.

## 1. Token màu

| Nhóm | Token | Hex | Vai trò |
|---|---|---|---|
| Primary | `--c-primary-900` | #003A5C | Chữ thương hiệu, header/footer nền đậm |
| | `--c-primary-700` | #005080 | Hover của nút primary, link |
| | `--c-primary-600` | #00649F | **Màu thương hiệu chính** — nút, icon, accent |
| | `--c-primary-400` | #51A5D6 | Gradient, nhấn nhẹ |
| | `--c-primary-100` | #CBE6F6 | Viền/nền tint nhạt |
| | `--c-primary-50` | #EFF6FB | Nền tint rất nhạt (hover thẻ, nền dải nhấn) |
| Accent (xanh lá) | `--c-accent-700` | #007A28 | Hover nút accent |
| | `--c-accent-600` | #00AB38 | Nút accent, gradient thẻ tin tức |
| | `--c-accent-300` | #7BD599 | Nhấn trên nền tối (eyebrow trong hero) |
| | `--c-accent-100` | #DEF7E6 | Nền badge success |
| Neutral (thiên xanh) | `--c-neutral-950` → `--c-neutral-0` | #0E1B26 → #FFFFFF | Text, nền, viền — không dùng xám thuần |
| Ngữ nghĩa | `--c-success` / `--c-warning` / `--c-danger` / `--c-info` | #00AB38 / #975D0C / #B23A2E / #00649F | Trạng thái cấp nước: bình thường / cảnh báo / sự cố / thông báo |

Sản phẩm **chỉ có giao diện sáng** (quyết định 2026-09-07). `tokens.css` khai báo `color-scheme: light` để trình duyệt không tự đảo màu form khi máy người dùng bật chế độ tối. Không thêm biến thể tối vào bất kỳ component nào.

## 2. Typography

Cập nhật 2026-09-07: chỉ nạp **hai** webfont. IBM Plex Mono đã bỏ — bớt một font
phải tải trên đường truyền yếu ở nông thôn.

| Vai trò | Font | Dùng cho |
|---|---|---|
| Display | **Montserrat** (600/700/800) | Chữ lớn: tiêu đề trang, tiêu đề khối, wordmark, tên khối trong header/footer |
| Body | **Inter** (400/500/600/700) | Toàn bộ nội dung, nhãn, form, bảng biểu |
| Số liệu | **Inter** qua `--font-numeric` | Chỉ số nước, tiền hoá đơn, mã khách hàng, ngày tháng, số điện thoại |

Số liệu cần canh cột thì **không đổi font**, mà thêm `font-variant-numeric: tabular-nums`
— các chữ số rộng bằng nhau nên cột số vẫn thẳng hàng. `components.css` đã khai báo sẵn
ở mọi chỗ dùng `--font-numeric`.

`--font-mono` vẫn còn nhưng chỉ dành cho thẻ `<code>` trong bài viết, và trỏ vào font
monospace có sẵn của máy — không tải webfont cho việc này.

Thang cỡ chữ: `--fs-xs` (12px) → `--fs-3xl` (44px), khai báo sẵn trong `tokens.css`.

## 3. Khoảng cách, bo góc, đổ bóng

- **Khoảng cách giữa các box thông tin và giữa các module: 20px — `--gap-box`** (chốt 2026-09-07). Mọi `gap` của lưới thẻ, hai cột nội dung và box xếp chồng đều dùng token này, không viết `20px` rải rác.
- Khoảng cách bên trong một box và các mục nhỏ theo thang `--sp-1` (4px) đến `--sp-9` (72px).
- **Đầu trang → nội dung: cũng đúng 20px.** Khối nội dung đầu tiên ngay sau
  `.page-banner` (hoặc sau `.crumb-bar` ở trang không có banner) cách đúng
  `--gap-box`. Đã có rule sẵn trong `mockup/site.css`:
  `.page-banner + .section, .crumb-bar + .section{padding-top:var(--gap-box)}`
  — **không** đặt lại `padding-top` cho `.section` đầu trang ở từng trang.
- **Khối đầu tiên không được mang thêm `margin-top`.** `padding` của `.section`
  chặn margin collapse, nên một khối `.after-block` (margin-top 20px) đứng đầu
  trang sẽ cho 40px. Rule đã xử lý hai trường hợp: `.after-block` là con đầu
  tiên, và `.tabs[hidden] + .after-block` (dải tab bị ẩn khi lọc tin theo
  chuyên mục — margin 20px vốn để cách dải tab, tab ẩn thì nó thành khoảng
  trống thừa).

  *Vì sao phải ghi ra:* vị trí này từng có **bốn** giá trị khác nhau cùng lúc —
  72px ở 20 trang (thừa hưởng `.section{padding:var(--sp-9) 0}`), 44px ở 3
  trang dùng `.section--tight`, 40px ở trang tin tức khi đang lọc chuyên mục
  (margin mồ côi), và 20px ở trang giới thiệu (tình cờ đúng nhờ `margin-top`
  của `.anchor-nav-wrap`). Lỗi phát hiện 2026-09-08 khi soát toàn site; đã đo
  lại 27 trang × 3 bề rộng = 81 phép đo, cộng 5 trạng thái lọc × 3 bề rộng,
  tất cả đúng 20px.
- Bo góc theo vai trò: `--radius-sm` (input/badge) · `--radius-md` (button/table) · `--radius-lg` (card/module) · `--radius-pill` (badge/nút pill).
- Đổ bóng theo 3 cấp `--shadow-sm/md/lg`, chỉ dùng khi cần phân lớp thao tác (thẻ hover, banner ưu tiên) — không đóng dấu lên mọi khối.

## 4. Danh sách component (xem đầy đủ trong `components.html`)

- **Nút bấm**: `.btn-primary` / `.btn-accent` / `.btn-secondary` / `.btn-ghost`, kích thước `.btn-sm` / mặc định / `.btn-lg`
- **Biểu mẫu**: `.input`, `.select`, `.textarea`, `.input-unit` (input có đơn vị m³), checkbox/radio
- **Nhãn trạng thái**: `.badge-success/warning/danger/info/neutral` — dùng cho tình trạng cấp nước, hoá đơn
- **Thông báo**: `.alert-info/warning/danger` — banner lịch ghi chỉ số, cảnh báo áp lực, sự cố khẩn cấp
- **Thẻ nội dung**: `.card-quick` (truy cập nhanh), `.card-news` (tin tức), `.card-service` (dịch vụ)
- **Số liệu vận hành**: `.stat-grid` — hộ dân được cấp nước, km đường ống, trạm cấp nước, tỷ lệ nước sạch
- **Bảng biểu giá**: `table.tariff` — số liệu canh phải, font mono
- **Điều hướng**: `.tabs`, `.pagination`, `.breadcrumb`
- **Mô-đun trang**: `.site-header` (topbar + mainbar + mainnav), `.hero-mod` (banner chính), `.site-footer` (4 cột + footer-bottom)
- **Tiêu đề widget** *(cập nhật 2026-09-08, theo bản Figma khách gửi — thay bản gradient
  100deg trước đó)*: `.widget-title` ba lớp trong một dải bo góc trên — nền gradient nhạt 90deg
  (`--c-primary-50` → `--c-accent-100`, gần khớp `#EBF6FA`/`#D9F7E2` của Figma), một vệt màu mờ
  lớn (`::before`, `filter:blur(12px)`, ba màu `#F5F5F5`/`#8AF4AD`/`#00AB38` đúng theo Figma) làm
  hoạ tiết nền bên phải, và trên cùng là chữ (Montserrat 700 20px, **không viết hoa** — khác bản
  trước) + vệt sóng nhỏ sắc nét bên dưới (72×6px, cắt từ hoạ tiết logo, **không còn opacity .5**
  vì bản Figma không mờ lớp này). Không dùng `clip-path` hay `mask` nên không cần fallback
  `@supports`.
  **Bẫy đã gặp khi dựng**: `::before` cần `z-index:-1` để nằm dưới chữ nhưng trên nền — nhưng
  `.widget-title` phải có **`z-index:0` tường minh** đi kèm `position:relative`, không thì
  `position:relative` một mình không tạo ngữ cảnh xếp lớp riêng, `::before` thoát ra so lớp với
  nền của `.widget` (cha) và bị nền trắng đó che mất hoàn toàn — biểu hiện là hoạ tiết mờ **không
  hiện chút nào**, không phải hiện mờ hơn dự kiến. Các phương án khác từng cân nhắc (nền navy
  đặc, vát chéo bằng `clip-path`, mép cắt hình sóng bằng `mask` — xem
  `mockup/review-tieu-de-widget.html`, `mockup/review-title-v2.html`) không được chọn.
- **Menu neo trong trang** *(thêm 2026-09-07)*: `.anchor-nav` — hộp bo góc, mục đang xem là viên thuốc nền `--bg-tint`; section đích thêm `.anchor-target`. Đã thay hoàn toàn kiểu tab gạch chân cho việc điều hướng trong trang.
- **Điều hướng nâng cao** *(thêm 2026-09-07)*: `.subnav` (menu con, mở bằng cả hover và focus), `.nav-toggle` + `.mainnav.is-open` (menu mobile dưới 760px), `.search-form`, `.skip-link`, `.sr-only`
- **Trang trong & bài viết** *(thêm 2026-09-07)*: `.page-hero`, `.article-layout` (nội dung + cột phải), `.article-header` + `.article-meta`, **`.prose`** (style cho `the_content` của WordPress), `.tag-list`, `.article-nav`, `.post-list` / `.post-item`, `.widget` + `.widget-list`
- **Thành phần nghiệp vụ** *(thêm 2026-09-07)*: `.notice-item` (lịch cấp nước), `.table-wrap` (vùng cuộn bắt buộc cho bảng rộng), `.empty-state`, `.accordion` (dùng `<details>`, không cần JS), `.step-list`, `.file-list`, `.link-external`, `.footer-hotline`

### Hai điều bắt buộc khi dùng markup mẫu

**Bảng rộng phải bọc `.table-wrap`** — nếu không, biểu giá tràn ngang trên điện thoại:

```html
<div class="table-wrap" role="region" tabindex="0" aria-label="Bảng biểu giá nước, cuộn ngang để xem thêm cột">
  <table class="tariff">…</table>
</div>
```

**Menu mobile cần đúng 6 dòng JS** (`assets/js/nav.js`, enqueue kèm `defer`). Không có
JS thì menu vẫn hiện, không mất điều hướng:

```js
document.querySelectorAll('.nav-toggle').forEach(function (btn) {
  btn.addEventListener('click', function () {
    var nav = document.getElementById(btn.getAttribute('aria-controls'));
    btn.setAttribute('aria-expanded', nav.classList.toggle('is-open'));
  });
});
```

Mọi con số trong `components.html` là **placeholder `[số liệu]`** — biểu giá, số hộ dân,
km đường ống đều chờ khách hàng cung cấp. Không copy số minh hoạ vào trang thật.

## 5. Áp dụng vào theme WordPress

Theo cấu trúc `template-parts/` đã trao đổi, các component ở trên map trực tiếp vào từng file:

```
template-parts/
  header/
    topbar.php        → .topbar
    mainnav.php       → .mainbar + .mainnav
  home/
    hero.php          → .hero-mod
    quick-access.php  → .card-quick (card-grid 3 cột)
    news.php          → .card-news (dùng The Loop, post format tin tức)
  content/
    service-card.php  → .card-service
    stat-block.php    → .stat-grid
  form/
    lookup-form.php   → .field + .input / .select / .input-unit
    report-form.php   → .field + .textarea
  footer/
    footer.php        → .site-footer
```

`tokens.css` và `components.css` enqueue trong `functions.php`:

```php
function nawaruco_enqueue_assets() {
    wp_enqueue_style('nawaruco-tokens', get_template_directory_uri() . '/assets/css/tokens.css');
    wp_enqueue_style('nawaruco-components', get_template_directory_uri() . '/assets/css/components.css', ['nawaruco-tokens']);
}
add_action('wp_enqueue_scripts', 'nawaruco_enqueue_assets');
```

## 6. Bản xem trực tuyến

Bản demo tương tác đầy đủ (có công tắc sáng/tối, bấm sao chép mã màu) đã publish tại Artifact — dùng để trình bày với khách hàng hoặc đội phát triển, còn bộ file trong thư mục này là bản "production-ready" để nhúng thẳng vào theme.
