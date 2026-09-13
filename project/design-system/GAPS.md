# NAWARUCO — Sổ ghi khoảng trống thiết kế

Các sai lệch **đã được ghi nhận** giữa thiết kế mong muốn và bộ component hiện có.
`ui-ux-reviewer` đọc file này trước khi viết phát hiện: một mục ở đây không bị báo
lại như lỗi mới. Chủ sở hữu file: `design-system-keeper`.

Ngày lập: 2026-09-07 (đọc từ `tokens.css`, `components.css`, `components.html`).

## Đang mở — cần quyết định hoặc cần dựng

| # | Khoảng trống | Ảnh hưởng | Xử lý tạm | Ai nợ quyết định |
|---|---|---|---|---|
| G4 | Chưa có modal/dialog và skeleton khi tải | Trang cần đến sẽ tự chế markup | Dùng `.alert` + `.empty-state` thay thế | Khi có trang đầu tiên cần |
| G6 | Chưa có component hiển thị bản đồ / danh sách trạm theo huyện | Trang Liên hệ và Trạm cấp nước phải tự dựng | Dùng `.card-grid` + `.card` | `design-system-keeper` |
| G5 | `.card-news .thumb` là nền gradient, không phải ảnh thật | Bài viết có ảnh đại diện vẫn hiện gradient nếu theme không xử lý | Theme dùng `the_post_thumbnail()`, rơi về gradient khi trống | `wp-theme-dev` |

## Đã đóng

| # | Khoảng trống | Đóng ngày | Bằng gì |
|---|---|---|---|
| G7 | Tài liệu (`README.md`, `review-tieu-de-widget.html`) mô tả `.widget-title` sai so với `components.css` thực tế (3 mô tả khác nhau cho cùng 1 component) | 2026-09-08 | Sửa lại mô tả trong README + alert box review file cho khớp bản gradient nhạt đang chạy trên site — xem `components.css` dòng 413-426 |
| G1 | Menu chính mất dưới 760px | 2026-09-07 | `.nav-toggle` + `.mainnav.is-open` + `.subnav` xếp chồng, kèm 6 dòng JS trong README |
| G2 | Bảng rộng tràn ngang | 2026-09-07 | `.table-wrap` (`role="region"`, `tabindex="0"`) — **bắt buộc** bọc quanh `table.tariff` |
| G3 | Không có trạng thái rỗng | 2026-09-07 | `.empty-state`; trạng thái đang tải vẫn còn thiếu, xem G4 |

## Đã chấp nhận — không phải lỗi

| # | Sai lệch | Lý do chấp nhận |
|---|---|---|
| A1 | `.hero-mod`, `.site-footer` dùng `rgba(255,255,255,…)` viết trực tiếp | Lớp phủ trên nền gradient/nền đậm; không token nào diễn đạt được vai trò này |
| A2 | `.btn-primary` / `.btn-accent` đặt `color:#fff` thay vì `var(--text-on-brand)` | Chỉ có light mode nên hai giá trị luôn trùng nhau; đổi khi có lượt sửa button kế tiếp |
| A3 | Thang trung tính ngả xanh thay vì xám thuần | Quyết định nhận diện, lấy từ logo |
| A4 | Chỉ có ba mốc `max-width` 1024 / 760 / 640 | Desktop-first có chủ đích; không thêm mốc thứ tư |
| A5 | Không có theme tối | Khách hàng chốt 2026-09-07: chỉ giao diện sáng |
| A7 | Viền `.input`/`.select`/`.textarea` (`--border-input`, #CFDBE2) chỉ 1.41:1 trên nền trắng — dưới mức 3:1 mà WCAG 1.4.11 yêu cầu cho viền thành phần giao diện | Khách hàng chốt 2026-09-09: đậm hơn nền trắng 15%, ưu tiên nhìn tinh tế hơn ngưỡng truy cập được. Đã báo tỉ lệ tương phản trước khi đổi (bản trước #7890A0 đạt 3.06:1, là mức nhạt nhất còn hợp lệ) |
| A8 | `.topbar-search input:focus-visible{outline:none}` — ô tìm kiếm ở topbar không còn dấu hiệu focus nào khi điều hướng bằng bàn phím, vi phạm WCAG 2.4.7 (Focus Visible, mức AA) | Khách hàng chốt 2026-09-09: bỏ hẳn viền trắng khi focus. Đã báo vi phạm 2.4.7 trước khi áp dụng — `components.css` dòng quanh 280 |

## Quyết định màu 2026-09-08

Bộ màu chuyển sang **giá trị chính thức từ file logo** (`brand/logo-wave.svg`):
xanh nước `#00649F`, xanh lá `#00AB38`. Các bậc còn lại suy ra bằng cách giữ nguyên
tông và độ tươi, chỉ đổi độ sáng. Bộ cũ (`#1B6FA8` / `#2E8B47`) là màu ước lượng
bằng mắt từ ảnh logo — không dùng lại.

| Ràng buộc | Lý do |
|---|---|
| Nền nút accent dùng `--c-accent-700`, không dùng `#00AB38` | Chữ trắng trên `#00AB38` chỉ đạt **3.05:1**, dưới chuẩn 4.5:1 |
| `--c-success` dùng bậc 700 | Chữ trạng thái nằm trên nền nhạt, cần ≥4.5:1 |
| `--c-warning` đổi `#B8720F` → `#975D0C` | Bản cũ chỉ đạt **3.41:1** trên `--c-warning-bg`; bản mới 4.79:1 |
| `#00AB38` chỉ dùng cho đồ hoạ | Vệt sóng logo, icon trang trí — nơi không có chữ đặt lên |

## Cách thêm dòng

Một dòng gồm: ngày tuyệt đối, thứ đang thiếu, chỗ chịu ảnh hưởng (`file:dòng`), cách
xử lý tạm, và **tên người nợ quyết định**. Một gap không có người chịu trách nhiệm sẽ
nằm đó mãi mãi.
