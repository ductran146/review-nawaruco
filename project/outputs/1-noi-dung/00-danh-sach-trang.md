# NAWARUCO — Danh sách trang cần có

Lập ngày 2026-09-07. Tham chiếu bố cục: bwaco.com.vn (menu 7 mục, trang chủ mở bằng
banner → giá trị → hỗ trợ trực tuyến → tra cứu hoá đơn → thanh toán → tin tức → dịch vụ).
Đối chiếu với component sẵn có trong `design-system/components.html`.

**Quy ước cột "Nguồn"**: `nội bộ` = trang WordPress tự dựng · `link ngoài` = trỏ sang
cổng tra cứu đã có · `chưa-xác-định` = chưa có dữ liệu, chưa dựng được.

**Ưu tiên**: `P0` bản chạy đầu · `P1` đợt hai · `P2` khi khách cấp nội dung.

---

## 1. Khung dùng chung (không phải trang, dựng trước tiên)

| ID | Thành phần | Template | Component | Ưu tiên |
|---|---|---|---|---|
| K1 | Topbar: hotline `tel:`, giờ trực, link cổng CSKH | `template-parts/header/topbar.php` | `.topbar` | P0 |
| K2 | Thanh chính: logo + wordmark + menu 7 mục | `template-parts/header/mainnav.php` | `.mainbar` `.mainnav` | P0 |
| K3 | **Menu mobile (hamburger + drawer)** | cùng K2 + `assets/js/nav.js` | ✅ `.nav-toggle` + `.mainnav.is-open` | P0 |
| K4 | Breadcrumb mọi trang trong | `template-parts/content/breadcrumb.php` | `.breadcrumb` | P0 |
| K5 | Footer 4 cột + dòng bản quyền | `template-parts/footer/footer.php` | `.site-footer` | P0 |
| K6 | Skip link + landmark + `lang="vi"` | `header.php` | — | P0 |

## 2. Trang chủ — `front-page.php`

Bố cục chốt ngày 2026-09-07 theo ảnh mẫu khách gửi (bwaco.com.vn). Bản dựng:
`mockup/index.html` + `mockup/home.css`.

| ID | Khối | Nội dung | Component | Nguồn | Ưu tiên |
|---|---|---|---|---|---|
| H1 | Topbar | Tên công ty · Facebook, YouTube · ô tìm kiếm · VN/EN | `.topbar` + `.topbar-tools` | nội bộ | P0 |
| H2 | Header + menu 8 mục | Trang chủ (icon) · Giới thiệu · Dịch vụ · Thanh toán · Hỗ trợ khách hàng · Cổ đông · Tin tức · Liên hệ | `.mainbar` + `.mainnav--upper` | nội bộ | P0 |
| H3 | Banner | Một thông điệp + gạch nhấn + 2 CTA + chấm chỉ báo slide | `.hero-band` | **chưa-xác-định** — cần ảnh banner | P0 |
| H4 | Ba khối hỗ trợ | Hỗ trợ trực tuyến (hotline) · Tra cứu hoá đơn điện tử · Thanh toán trực tuyến | `.support-3` | 2 khối sau **link ngoài** | P0 |
| H5 | Tin tức — Sự kiện | 3 thẻ: ảnh, tiêu đề chữ hoa, trích dẫn, "Xem chi tiết ›"; thẻ thứ 3 là thông báo cấp nước | `.news-3` + `.card-news` | nội bộ | P0 |
| H6 | Dịch vụ | Hai khối so le: Lắp đặt · Sửa chữa, mỗi khối một danh sách có dấu tích | `.svc-2` + `.check-list` | nội bộ | P0 |
| H7 | Footer 3 cột | Logo + tên · Thông tin liên hệ (2 cột) · Menu (2 cột) + nút về đầu trang | `.footer-grid--3` | **chưa-xác-định** — địa chỉ, fax, MST | P0 |

**Đã bỏ khỏi trang chủ khi đổi sang bố cục mẫu** (so với bản trước): hàng thẻ truy
cập nhanh, khối lịch cấp nước riêng, bảng biểu giá rút gọn, số liệu vận hành, giá trị
cốt lõi, dải kêu gọi. Lịch cấp nước hiện đi vào trang chủ qua thẻ tin thứ 3. Nếu khách
muốn khối thông báo riêng trên trang chủ, đó là một khối thêm vào giữa H4 và H5.

## 3. Trang trỏ sang cổng tra cứu đã có (link ngoài)

Không dựng lại chức năng, chỉ điều hướng. Mỗi liên kết: `target="_blank"`
`rel="noopener noreferrer"`, có icon rời trang `aria-hidden="true"` **và** chữ
"(mở cổng CSKH)" để trình đọc màn hình đọc được — không dùng icon một mình.

| ID | Mục | Xuất hiện ở | Đích | Trạng thái |
|---|---|---|---|---|
| L1 | Tra cứu tiền nước | H2, menu Thanh toán, footer | URL cổng CSKH | ⚠️ **chưa có URL** |
| L2 | Lịch sử sử dụng nước | H2, menu Thanh toán | URL cổng CSKH | ⚠️ **chưa có URL** |
| L3 | Trạng thái thanh toán / thanh toán trực tuyến | H2, menu Thanh toán | URL cổng CSKH | ⚠️ **chưa có URL** |
| L4 | **Trang hướng dẫn dùng cổng tra cứu** — nội bộ, có ảnh chụp màn hình và chỉ chỗ tìm mã khách hàng trên hoá đơn giấy | menu Hỗ trợ khách hàng | `page.php` | P0, nội bộ |

L4 là trang nội bộ, không phải link — hộ dân lớn tuổi bấm sang một cổng lạ mà không
biết nhập mã gì sẽ quay lại gọi tổng đài, và đó chính là việc website phải giảm.

## 4. Giới thiệu — `page.php`

| ID | Trang | Đường dẫn | Nguồn | Ưu tiên |
|---|---|---|---|---|
| GT1 | Tổng quan & quá trình phát triển | `/gioi-thieu/` | chưa-xác-định (chờ nội dung khách) | P0 |
| GT2 | Chức năng, ngành nghề kinh doanh | `/gioi-thieu/nganh-nghe/` | chưa-xác-định | P1 |
| GT3 | Sơ đồ tổ chức & ban lãnh đạo | `/gioi-thieu/so-do-to-chuc/` | chưa-xác-định | P1 |
| GT4 | Hệ thống trạm cấp nước & khu vực cấp nước | `/tram-cap-nuoc/` — danh sách lọc theo huyện/xã | CPT `tram-cap-nuoc`, chưa-xác-định danh sách | P1 |
| GT5 | Chi tiết một trạm cấp nước | `single-tram-cap-nuoc.php` | như trên | P1 |

## 5. Dịch vụ & hỗ trợ khách hàng

| ID | Trang | Nội dung bắt buộc | Component | Ưu tiên |
|---|---|---|---|---|
| D1 | Lắp đặt đồng hồ nước mới | Điều kiện · hồ sơ · **phí** · thời gian xử lý · nơi nộp | `.card-service`, danh sách bước | P0 |
| D2 | Sửa chữa & báo sự cố | Form: họ tên, SĐT, xã/thôn, mô tả, ảnh (tuỳ chọn) + hotline nổi bật | `.field` `.input` `.textarea` `.alert-info` | P0 |
| D3 | Báo chỉ số đồng hồ | Form có `.input-unit` đơn vị m³ + hướng dẫn đọc đồng hồ | `.input-unit` | P1 |
| D4 | Thay đổi hợp đồng / thông tin khách hàng | Thủ tục sang tên, đổi địa chỉ, tạm ngừng | danh sách bước | P1 |
| D5 | Chất lượng nước | Chỉ tiêu, kỳ xét nghiệm, đơn vị kiểm định | `table.tariff` | P1 |
| D6 | Hỏi đáp thường gặp | Nhóm theo chủ đề | ✅ `.accordion` (`<details>`) | P1 |

## 6. Thanh toán & giá nước

| ID | Trang | Ghi chú | Ưu tiên |
|---|---|---|---|
| T1 | Biểu giá nước | `table.tariff`, số canh phải, font mono, ghi rõ ngày áp dụng và văn bản ban hành | P0 |
| T2 | Hình thức thanh toán | Tại quầy · thu tại nhà · chuyển khoản · ví/ngân hàng · **link L3** | P0 |
| T3 | Trách nhiệm & kỳ thanh toán | Chu kỳ ghi chỉ số, hạn nộp, hậu quả chậm nộp | P1 |

## 7. Tin tức & văn bản

| ID | Trang | Template | Ưu tiên |
|---|---|---|---|
| N1 | Danh sách tin tức (phân trang) | `archive.php` + `.pagination` | P0 |
| N2 | Chi tiết bài viết | `single.php` | P0 |
| N3 | Thông báo cấp nước (danh mục riêng, có ngày–giờ–khu vực) | `archive-thong-bao.php` | P0 |
| N4 | Hoạt động xã hội / tin ngành nước | dùng chung N1 bằng taxonomy | P2 |
| N5 | Văn bản pháp lý, quy định | CPT `van-ban` + bảng tải file | P2 |
| N6 | Đấu thầu | CPT hoặc taxonomy | P2 |
| N7 | Tuyển dụng | CPT hoặc taxonomy | P2 |

## 8. Liên hệ & hệ thống

| ID | Trang | Ghi chú | Ưu tiên |
|---|---|---|---|
| C1 | Liên hệ | Địa chỉ, hotline `tel:`, email, bản đồ, **danh sách đơn vị/trạm theo huyện** + form | P0 |
| C2 | Kết quả tìm kiếm | `search.php` + `.empty-state` + `.search-form` | P0 |
| C3 | 404 | Gợi ý 4 việc hay làm nhất + hotline | P0 |
| C4 | Chính sách bảo mật & điều khoản | **Bắt buộc** vì D2/D3/C1 thu thập SĐT và địa chỉ | P0 |
| C5 | Sơ đồ website | Trang tĩnh liệt kê toàn bộ mục | P2 |

Tổng: **6 khối khung + 7 khối trang chủ + 28 trang**, trong đó **17 trang P0**.

## 9. Tình trạng component (cập nhật 2026-09-07)

Đã dựng xong trong đợt này, không còn chặn P0: menu mobile + menu con (G1),
`.table-wrap` cho bảng biểu giá (G2), `.empty-state` (G3), `.accordion` cho D6,
`.prose` cho toàn bộ nội dung bài viết, `.notice-item` cho N3/H3, `.step-list` cho D1,
`.file-list` cho N5, `.post-list` + `.widget` cho N1.

Còn thiếu, chưa chặn P0 (xem `design-system/GAPS.md`): modal/dialog và skeleton khi tải
(G4), ảnh đại diện thật cho `.card-news` (G5), hiển thị bản đồ và danh sách trạm theo
huyện cho C1/GT4 (G6).

## 10. Câu hỏi mở — cần người trả lời trước khi dựng

| # | Câu hỏi | Chặn | Ai trả lời |
|---|---|---|---|
| Q1 | URL cổng tra cứu tiền nước / lịch sử / thanh toán? Có mở được không cần đăng nhập không? | L1–L3, H2 | Khách hàng |
| Q2 | Cổng đó có tra bằng mã khách hàng hay số điện thoại? Ảnh chụp màn hình để làm L4? | L4 | Khách hàng |
| Q3 | Số liệu H4 (số hộ, km đường ống, số trạm, tỷ lệ) lấy từ báo cáo nào, chốt đến thời điểm nào? | H4 | Khách hàng |
| Q4 | Biểu giá hiện hành và văn bản ban hành kèm ngày áp dụng? | T1 | Khách hàng |
| Q5 | Phí và thủ tục lắp đặt mới? | D1 | Khách hàng |
| Q6 | Công ty có cổ đông cần mục "Quan hệ cổ đông" như BWACO không? | mục menu thứ 8 | Khách hàng |
| Q7 | Ai được đăng thông báo cắt nước khẩn **ngoài giờ hành chính**, bằng thiết bị gì? | N3, H3 | Khách hàng |
| Q8 | Báo sự cố (D2) gửi về đâu — email, Zalo, hay lưu trong WordPress? Ai trực và trong bao lâu? | D2 | Khách hàng |
| Q9 | SĐT/địa chỉ thu qua form lưu bao lâu, ai xem được? | C4, D2, D3 | Khách hàng |
| Q10 | Danh sách trạm cấp nước và khu vực phục vụ theo huyện/xã? | GT4, C1 | Khách hàng |

Không mục nào ở trên được điền bằng số liệu suy đoán. Một website dịch vụ công đăng
sai mức phí hoặc sai biểu giá gây hậu quả thật cho cả hộ dân lẫn công ty.

---

# Tình trạng dựng trang (cập nhật 2026-09-08)

Bản dựng nằm trong `mockup/`, mở trực tiếp bằng trình duyệt. Header, footer và sprite
icon giống nhau trên mọi trang — lên WordPress thành `header.php`, `footer.php`,
`template-parts/icons.php`.

| # | Trang | File | Trạng thái |
|---|---|---|---|
| 1 | Trang chủ | `mockup/index.html` | ✅ dựng xong |
| 2 | Giới thiệu công ty | `gioi-thieu.html` | ✅ khung xong, **chờ toàn bộ nội dung** |
| 3 | Dịch vụ | `dich-vu.html` | ✅ dựng xong |
| 4 | Hình thức thanh toán | `thanh-toan.html` | ✅ dựng nội dung chi tiết (tham khảo cấu trúc bwaco.com.vn/thanh-toan/hinh-thuc-thanh-toan), **chờ NAWARUCO xác nhận số tài khoản, đối tác ví điện tử/QR, điểm thu tại quầy** |
| 5 | Tin tức — danh sách | `tin-tuc.html` | ✅ dựng xong |
| 6 | Tin tức — chi tiết | `tin-tuc-chi-tiet.html` | ✅ dựng xong |
| 7 | Hỗ trợ khách hàng (hub) | `ho-tro-khach-hang.html` | ✅ dựng xong |
| 8 | Báo chỉ số đồng hồ nước | `bao-chi-so.html` | ✅ form xong, **chưa nối backend** |
| 9 | Phản ánh sự cố | `phan-anh-su-co.html` | ✅ form xong, **chưa nối backend** |
| 10 | Chất lượng nước | `chat-luong-nuoc.html` | ✅ khung xong, **chờ phiếu kiểm nghiệm** |
| 11 | Thay đổi hợp đồng | `thay-doi-hop-dong.html` | ✅ khung xong, **chờ danh mục hồ sơ** |
| 12 | Liên hệ | `lien-he.html` | ✅ khung xong, **chờ địa chỉ, fax, MST** |
| 13 | Tra cứu hoá đơn (chuyển tiếp) | `tra-cuu-hoa-don.html` | ✅ xong, **chờ `{{URL_HOA_DON}}`** |
| 14 | Thanh toán trực tuyến (chuyển tiếp) | `thanh-toan-truc-tuyen.html` | ✅ xong, **chờ `{{URL_THANH_TOAN}}`** |
| 15 | 404 | `404.html` | ✅ dựng xong |
| 16 | Cổ đông (hub) | `co-dong.html` | ✅ khung xong, **chờ xác nhận công ty có cổ đông** |
| 17 | Đại hội đồng cổ đông | `co-dong-dai-hoi-dong-co-dong.html` | ✅ dựng xong, **chờ file tài liệu + ngày đăng** |
| 18 | Công bố thông tin | `co-dong-cong-bo-thong-tin.html` | ✅ khung xong, **chờ danh mục công bố** |
| 19 | Báo cáo tài chính | `co-dong-bao-cao-tai-chinh.html` | ✅ khung xong, **chờ file báo cáo** |
| 20 | Thủ tục lắp đặt nước | `dich-vu-lap-dat.html` | ✅ dựng xong (2 tab: hộ gia đình / dự án), **chờ chính sách chi phí** |
| 21 | Giá nước | `gia-nuoc.html` | ✅ dựng bảng giá theo nhóm đối tượng (tham khảo cấu trúc pmw.vn/bang-gia-nuoc), **chờ NAWARUCO cung cấp số quyết định, đơn giá thật và file PDF quyết định** |
| 22 | Trách nhiệm thanh toán | `trach-nhiem-thanh-toan.html` | 🔸 chỉ để thông báo "đang hoàn thiện" theo yêu cầu — **chờ web chính thức hoạt động mới đưa nội dung** |
| 23 | Hướng dẫn dùng app CSKH | `huong-dan-app.html` | ✅ khung xong, **chờ xác nhận có app** |
| 24 | Sửa chữa | `dich-vu-sua-chua.html` | ✅ khung xong |
| 25 | Kiểm tra nước bất thường | `dich-vu-kiem-tra-nuoc-bat-thuong.html` | ✅ khung xong |
| 26 | Sửa đường ống, nâng dời | `dich-vu-sua-duong-ong-nang-doi.html` | ✅ khung xong |
| 27 | Ống nhựa HDPE | `dich-vu-ong-nhua-hdpe.html` | ✅ khung xong |

**Chưa dựng, có lý do:**

| Trang | Lý do |
|---|---|
| Chính sách bảo mật (9.1) | Cần bản pháp lý do công ty duyệt, không tự viết thay |
| Chi tiết từng dịch vụ (3.2) | Chưa rõ có bao nhiêu dịch vụ cần trang riêng (câu hỏi mở trong 3.2) |

**Trùng nội dung, chờ khách quyết định bỏ hay giữ:** `dich-vu-lap-moi-ho-gia-dinh.html`
và `dich-vu-cap-nuoc-du-an.html` — nội dung hai trang này đã nằm trong hai tab của
`dich-vu-lap-dat.html`. Hai file review nội bộ `review-tieu-de-widget.html`,
`review-title-v2.html` cũng chỉ dùng để chọn kiểu tiêu đề, không lên WordPress.

# Đối chiếu với `design-system/page-specs.md`

`page-specs.md` viết trước hai vòng chỉnh gần nhất, nên có bốn chỗ khác với bản đang
dựng. Bản dựng theo **quyết định mới nhất của khách**, ghi lại ở đây để không ai sửa
ngược trở lại:

| Spec nói | Bản dựng làm | Vì sao |
|---|---|---|
| Breakpoint chính 760px, thêm 960/640; "menu mobile chưa có, cần bổ sung" | Ba mốc **1024 / 760 / 640**; menu mobile **đã có** (`.nav-toggle` + `.mainnav.is-open`) | Menu 8 mục chữ hoa không vừa một hàng ở 1024. Mốc 960 không nằm trong hệ. |
| Số liệu dùng `.mono` / `--font-mono` | Dùng `--font-numeric` (Inter) + `tabular-nums` | Khách chốt font số là Inter; IBM Plex Mono đã bỏ khỏi hệ |
| Hero trang chủ có tiêu đề + 2 nút CTA | Banner **chỉ là ảnh**, chữ nằm trong ảnh | Khách chốt slider chỉ để dạng ảnh |
| Trang chủ có 3 thẻ truy cập nhanh + khối số liệu vận hành | Không có hai khối này | Khách chốt bố cục theo ảnh mẫu; hai khối đó không có trong ảnh |

Ngoài ra: spec ghi ảnh icon dịch vụ tỉ lệ 1:1 — bản dựng dùng 15:8 cho ảnh khối dịch
vụ theo ảnh mẫu, còn tỉ lệ 1:1 giữ cho logo. Kích thước từng vị trí ở
`outputs/1-noi-dung/kich-thuoc-anh.md`.
