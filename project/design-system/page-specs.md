# NAWARUCO — Đặc tả trang website (giao việc dựng trang)

Tài liệu bàn giao để lập trình/dựng HTML từng trang. Tham chiếu bộ tài nguyên đã có sẵn trong `design-system/`:

- `tokens.css` — biến màu, typography, khoảng cách
- `components.css` — style thành phần UI (nút, form, thẻ, bảng, badge, alert, header/hero/footer...)
- `components.html` — xem trực quan + copy markup mẫu

**Quy tắc chung cho mọi trang:**
- Nhúng đúng thứ tự: Google Fonts → `tokens.css` → `components.css` → CSS riêng của trang (nếu có).
- **Khoảng cách: 20px (`--gap-box`) giữa mọi box thông tin và mọi module** — kể cả
  khoảng cách từ đầu trang xuống khối nội dung đầu tiên. Rule đã có sẵn trong
  `mockup/site.css` (`.page-banner + .section, .crumb-bar + .section`), **đừng
  đặt lại `padding-top` cho `.section` đầu trang ở từng trang**, và **đừng gắn
  `.after-block` cho khối nội dung đầu tiên** — `padding` chặn margin collapse
  nên nó cộng thành 40px. Chỗ này từng có bốn giá trị cùng lúc
  (72 / 44 / 40 / 20px) nên đã thành lỗi UI phải sửa lại toàn site ngày
  2026-09-08.
- Dùng lại `.site-header` + `.mainnav` và `.site-footer` đã dựng sẵn cho MỌI trang — không tự tạo header/footer mới.
- Responsive: **đúng ba mốc `max-width` 1024 / 760 / 640, desktop-first**. Menu mobile (`.nav-toggle` + `.mainnav.is-open`) **đã có sẵn** trong component, bật ở **1024px** vì menu 8 mục chữ hoa không vừa một hàng từ 1024 trở xuống. Không thêm mốc thứ tư, không dùng `min-width`. *(Sửa 2026-09-08: bản trước ghi 760px và một mốc 960px không tồn tại trong hệ.)*
- Mọi số liệu (tiền, chỉ số nước, mã khách hàng, ngày tháng, số điện thoại) dùng `font-family:var(--font-numeric)` + `font-variant-numeric:tabular-nums` để canh cột. `--font-numeric` là **Inter**, giống chữ nội dung. `--font-mono` **chỉ** dành cho khối code. *(Sửa 2026-09-08: bản trước ghi `.mono`/`--font-mono`; class `.mono` không tồn tại và IBM Plex Mono đã bỏ khỏi hệ.)*
- Ảnh minh hoạ: dùng placeholder tỉ lệ 16:9 cho thumbnail tin tức, 1:1 cho icon dịch vụ, ghi chú rõ "ảnh chờ khách hàng cung cấp" nếu chưa có ảnh thật — không tự bịa ảnh thương hiệu.

Chú thích loại trang: 🟦 Thiết kế đầy đủ · 🟩 Trang chuyển tiếp (redirect) · 🟨 Tuỳ chọn (xác nhận lại trước khi làm).

---

## 1. Trang chủ — 🟦 `/`

**Mục tiêu:** điểm vào chính, dẫn nhanh đến 3 tác vụ khách hàng cần nhất (tra cứu hoá đơn, thanh toán, đăng ký lắp mới) và truyền tải hình ảnh thương hiệu.

**Bố cục từ trên xuống:**
1. Header dùng chung (`.site-header`)
2. Hero (`.hero-mod`) — tiêu đề + tagline + 2 nút CTA ("Tra cứu hoá đơn" dẫn sang mục 4.4, "Đăng ký dịch vụ" dẫn sang mục 3.1)
3. Banner cảnh báo nếu có sự cố đang diễn ra (`.alert-danger`/`.alert-warning`) — **ẩn mặc định, chỉ hiện khi có nội dung**, không hard-code luôn hiển thị
4. 3 thẻ truy cập nhanh (`.card-quick` trong `.card-grid`): Tra cứu hoá đơn · Thanh toán trực tuyến · Đăng ký lắp đặt mới
5. Khối số liệu vận hành (`.stat-grid`): số hộ dân được cấp nước, km đường ống, số trạm, tỷ lệ nước sạch nông thôn — **số liệu thật cần NAWARUCO cung cấp**, không dùng số ở bản demo
6. 3 tin tức mới nhất (`.card-news`) + nút "Xem tất cả tin tức" → mục 6.1
7. 2 thẻ dịch vụ (`.card-service`): Lắp đặt · Sửa chữa → mục 3.1
8. Footer dùng chung (`.site-footer`)

**Nội dung cần cung cấp:** tagline chính thức, số liệu vận hành thật, 3 tin mới nhất (lấy từ mục 6.1).

---

## 2. Giới thiệu công ty — 🟦 `/gioi-thieu`

**Mục tiêu:** truyền tải lịch sử, sứ mệnh, phạm vi phục vụ — trang nội dung dài, chia section bằng anchor.

**Bố cục:**
1. Header
2. Tiêu đề trang + breadcrumb (`.breadcrumb`: Trang chủ / Giới thiệu)
3. Menu phụ trong trang (anchor nav, sticky) trỏ đến các section bên dưới — style tương tự `.tabs` nhưng dạng dọc hoặc ngang tuỳ độ dài nội dung
4. Section "Hình thành và phát triển" — văn bản + mốc thời gian (timeline dạng danh sách, chưa có component sẵn, dựng mới dạng list mốc năm)
5. Section "Ngành nghề kinh doanh" — danh sách gạch đầu dòng hoặc `.card-service`
6. Section "Sứ mệnh – Giá trị" — 3-4 khối giá trị cốt lõi, có thể dùng lại `.card-quick` bỏ phần link
7. Section "Sơ đồ tổ chức" — ảnh sơ đồ (cung cấp từ NAWARUCO) hoặc dựng bằng HTML/CSS nếu đơn giản
8. Section "Khu vực & nhà máy cấp nước" — danh sách địa bàn phục vụ (dạng bảng hoặc thẻ theo xã/huyện), có thể kèm bản đồ tĩnh
9. Footer

**Nội dung cần cung cấp:** toàn bộ text từng section, ảnh sơ đồ tổ chức, danh sách khu vực phục vụ.

---

## 3. Dịch vụ

### 3.1 Danh sách dịch vụ — 🟦 `/dich-vu`
- Header → Breadcrumb → Tiêu đề → lưới `.card-service` (Lắp đặt đồng hồ nước mới, Sửa chữa & bảo trì, + dịch vụ khác nếu có) → Footer.
- Mỗi thẻ dịch vụ có link đến trang chi tiết tương ứng (mục 3.2).

### 3.2 Chi tiết dịch vụ — 🟨 `/dich-vu/[slug]` (template dùng chung)
- Breadcrumb: Trang chủ / Dịch vụ / [Tên dịch vụ]
- Tiêu đề + mô tả ngắn
- Các bước quy trình (danh sách đánh số — **cân nhắc dùng số thứ tự vì đây là quy trình thật có trình tự**, không phải trang trí)
- Hồ sơ cần chuẩn bị (danh sách)
- Thời gian xử lý dự kiến, chi phí tham khảo (nếu công khai được)
- Nút CTA "Đăng ký ngay" → dẫn đến mục 5.2 (form báo chỉ số/đăng ký) hoặc trang liên hệ
- **Xác nhận với NAWARUCO** trước khi làm: có bao nhiêu dịch vụ cần trang chi tiết riêng, hay gộp hết vào mục 3.1.

---

## 4. Thanh toán & biểu giá

### 4.1 Hình thức thanh toán — 🟦 `/thanh-toan`
- Breadcrumb → Tiêu đề → danh sách kênh thanh toán dạng `.card-quick` (Tại quầy giao dịch, VNPay, Ví điện tử, Chuyển khoản ngân hàng, Thu tại nhà — xác nhận danh sách thật với NAWARUCO)
- Section "Trách nhiệm người thanh toán" gộp ngay bên dưới (không tách trang riêng) — nội dung dạng văn bản, hạn thanh toán, mức phạt chậm nộp nếu có.

### 4.2 Biểu giá nước — 🟦 `/bieu-gia` (có thể là section trong 4.1 nếu ngắn)
- Bảng giá dùng `table.tariff` — cột: Bậc / Mức sử dụng (m³) / Mục đích sử dụng / Đơn giá (đ/m³)
- Ghi chú thuế GTGT, phí bảo vệ môi trường (nếu tính riêng) ngay dưới bảng
- **Nội dung cần cung cấp:** bảng giá chính thức hiện hành của NAWARUCO.

### 4.3 Tra cứu hoá đơn điện tử — 🟩 `/tra-cuu-hoa-don` (trang chuyển tiếp)
- Header/Footer dùng chung
- Khối giữa trang: icon/logo + text "Đang chuyển đến cổng tra cứu hoá đơn điện tử NAWARUCO..." + spinner hoặc đồng hồ đếm 3 giây
- Tự động `window.location.href` sang URL hệ thống hoá đơn thật (điền placeholder `{{URL_HOA_DON}}`, chờ NAWARUCO cung cấp)
- Có nút "Nhấn vào đây nếu không tự chuyển" dự phòng nếu JS bị chặn
- Ghi rõ tên/logo hệ thống đích để khách hàng yên tâm rời site chính thức

### 4.4 Thanh toán trực tuyến — 🟩 `/thanh-toan-truc-tuyen` (trang chuyển tiếp)
- Cấu trúc y hệt mục 4.3, đích đến là cổng thanh toán (VNPay hoặc ngân hàng đối tác — placeholder `{{URL_THANH_TOAN}}`).

---

## 5. Hỗ trợ khách hàng

### 5.1 Trang tổng hợp — 🟦 `/ho-tro-khach-hang`
- Breadcrumb → Tiêu đề → lưới `.card-quick` dẫn đến 5 mục con bên dưới (Báo chỉ số, Thay đổi hợp đồng, Chất lượng nước, Hướng dẫn App CSKH, Phản ánh sự cố).

### 5.2 Báo chỉ số đồng hồ nước — 🟦 `/bao-chi-so` (form)
- Form gồm: Mã khách hàng (`.input`, bắt buộc, placeholder "VD: NW-018842"), Họ tên chủ hợp đồng (tuỳ chọn, auto-điền nếu tra được), Khu vực (`.select`, danh sách xã/thị trấn), Chỉ số hiện tại (`.input-unit`, đơn vị m³, chỉ nhận số), Ảnh chụp đồng hồ (upload — **chưa có component upload sẵn, cần bổ sung**), Số điện thoại liên hệ.
- Validate: mã khách hàng bắt buộc đúng định dạng, chỉ số phải ≥ chỉ số kỳ trước (nếu có dữ liệu so sánh).
- Sau khi gửi: thông báo thành công dùng `.alert-info`, không có backend thật thì mô tả rõ đây là **form tĩnh cần nối API/email sau**.

### 5.3 Thay đổi hợp đồng — 🟦 `/thay-doi-hop-dong`
- Nội dung hướng dẫn thủ tục (sang tên, đổi chủ hợp đồng, đổi địa chỉ nhận hoá đơn) dạng danh sách các bước
- Link tải mẫu đơn PDF (nếu có) — nút `.btn-secondary` "Tải mẫu đơn"
- Form yêu cầu tương tự 5.2 hoặc trỏ đến trang liên hệ.

### 5.4 Chất lượng nước — 🟦 `/chat-luong-nuoc`
- Nội dung: chỉ tiêu chất lượng theo QCVN, tần suất kiểm nghiệm
- Bảng kết quả kiểm nghiệm gần nhất (tái dùng `table.tariff` với cột khác: Chỉ tiêu / Đơn vị / Kết quả / Giới hạn cho phép)
- Vùng banner cảnh báo nếu có khuyến cáo đang hiệu lực (`.alert-warning`/`.alert-danger`) — logic hiển thị/ẩn giống mục 1.3.

### 5.5 Hướng dẫn sử dụng App CSKH — 🟦 `/huong-dan-app`
- Các bước hướng dẫn kèm ảnh chụp màn hình app (chờ NAWARUCO cung cấp nếu app đã có)
- 2 nút tải app — 🟩 chuyển tiếp ra App Store / CH Play (placeholder `{{URL_APPSTORE}}`, `{{URL_CHPLAY}}`)

### 5.6 Phản ánh sự cố — 🟦 `/phan-anh-su-co` (form, không có trên menu bwaco nhưng nên bổ sung)
- Form: Họ tên, Số điện thoại, Địa chỉ sự cố (bắt buộc, chi tiết), Loại sự cố (`.select`: Vỡ ống / Mất nước / Nước đục / Áp lực yếu / Khác), Mô tả chi tiết (`.textarea`), Ảnh đính kèm (tuỳ chọn)
- Sau khi gửi hiển thị `.badge-info` "Đã tiếp nhận – mã phản ánh #..." nếu có hệ thống mã theo dõi, hoặc `.alert-info` xác nhận đơn giản nếu chưa có backend.

---

## 6. Tin tức

### 6.1 Danh sách tin tức — 🟦 `/tin-tuc`
- Breadcrumb → Tiêu đề → bộ lọc chuyên mục dạng `.tabs` (Tất cả · Thông báo · Hoạt động từ thiện · Tin NAWARUCO · Tin khác) → lưới `.card-news` (9-12 tin/trang) → `.pagination`
- Mỗi thẻ tin: ảnh thumbnail 16:9, ngày đăng (`.date`, font mono), tiêu đề, mô tả ngắn 1-2 dòng.

### 6.2 Chi tiết tin tức — 🟦 `/tin-tuc/[slug]`
- Breadcrumb: Trang chủ / Tin tức / [Chuyên mục] / [Tiêu đề rút gọn]
- Tiêu đề lớn, ngày đăng, chuyên mục (`.badge-neutral` hoặc `.badge-info`)
- Ảnh đại diện full-width
- Nội dung bài viết (rich text: heading phụ, đoạn văn, ảnh chèn giữa bài, có thể có bảng/danh sách)
- Khối "Tin liên quan" cuối trang — 3 thẻ `.card-news` cùng chuyên mục.

---

## 7. Quan hệ cổ đông — 🟨 (xác nhận trước khi làm)

**Chỉ triển khai nếu** NAWARUCO là công ty cổ phần có nghĩa vụ công bố thông tin định kỳ. Nếu là đơn vị nhà nước/sự nghiệp thuần vận hành, **bỏ toàn bộ mục 7**.

- `/co-dong` — danh sách 3 nhóm tài liệu: Công bố thông tin & dữ liệu, Đại hội đồng cổ đông, Báo cáo tài chính
- Mỗi nhóm hiển thị danh sách file PDF tải về, sắp xếp theo năm (mới nhất trên đầu) — dạng bảng hoặc danh sách có icon file + ngày đăng + nút tải.

---

## 8. Liên hệ — 🟦 `/lien-he`

- Breadcrumb → Tiêu đề
- Layout 2 cột (desktop): trái là thông tin liên hệ (địa chỉ trụ sở + các trạm/chi nhánh nếu nhiều địa điểm, hotline, email, giờ làm việc, mạng xã hội), phải là form liên hệ (Họ tên, Email, Số điện thoại, Chủ đề `.select`, Nội dung `.textarea`)
- Bản đồ nhúng (Google Maps iframe) bên dưới, full-width
- Mobile: xếp dọc, form trước hay thông tin trước tuỳ ưu tiên UX — đề xuất thông tin liên hệ trước vì hotline là nhu cầu tra cứu nhanh nhất.

---

## 9. Trang pháp lý — 🟨 (tuỳ chọn nhưng khuyến nghị làm)

### 9.1 Chính sách bảo mật thông tin khách hàng — `/chinh-sach-bao-mat`
- Cần thiết vì các form ở mục 5.2, 5.6, 8 thu thập mã khách hàng, số điện thoại, địa chỉ
- Nội dung dạng văn bản pháp lý thuần, dùng heading phân đoạn, không cần component đặc biệt.

### 9.2 Trang 404 — dùng chung mọi route không khớp
- Header/Footer dùng chung, giữa trang: số "404" lớn (font mono), câu thông báo thân thiện, nút `.btn-primary` "Về trang chủ".

---

## Bảng tổng hợp ưu tiên triển khai

| Thứ tự | Trang | Loại | Ghi chú phụ thuộc |
|---|---|---|---|
| 1 | Header/Footer dùng chung | 🟦 | Làm trước tiên — mọi trang khác phụ thuộc vào đây |
| 2 | Trang chủ | 🟦 | Cần số liệu thật + 3 tin mới nhất từ mục 6 |
| 3 | Danh sách + Chi tiết tin tức | 🟦 | Độc lập, có thể làm song song với trang chủ |
| 4 | Liên hệ | 🟦 | Cần thông tin địa chỉ/hotline thật |
| 5 | Giới thiệu công ty | 🟦 | Cần nội dung dài từ NAWARUCO, có thể làm sau |
| 6 | Dịch vụ (danh sách) | 🟦 | — |
| 7 | Thanh toán + Biểu giá | 🟦 | Cần bảng giá chính thức |
| 8 | Hỗ trợ khách hàng (5 trang con) | 🟦 | Ưu tiên 5.2 Báo chỉ số và 5.6 Phản ánh sự cố vì tần suất dùng cao nhất |
| 9 | 2 trang chuyển tiếp (4.3, 4.4) | 🟩 | Chờ URL đích thật từ NAWARUCO trước khi gắn link |
| 10 | Chi tiết dịch vụ, Cổ đông, Pháp lý, 404 | 🟨 | Xác nhận phạm vi trước khi làm |

## Việc cần NAWARUCO xác nhận trước khi bàn giao agent khác thực thi

1. NAWARUCO có phải công ty cổ phần cần mục "Quan hệ cổ đông" (mục 7) không?
2. URL thật của hệ thống tra cứu hoá đơn và cổng thanh toán (mục 4.3, 4.4)
3. Số liệu vận hành thật cho trang chủ (số hộ dân, km đường ống, số trạm, tỷ lệ nước sạch)
4. Danh sách xã/thị trấn thuộc khu vực phục vụ (dùng trong form 5.2 và trang giới thiệu)
5. App CSKH đã có hay chưa (ảnh hưởng đến mục 5.5)
6. Có cần trang "Phản ánh sự cố" (5.6) hay gộp chung vào form Báo chỉ số?
