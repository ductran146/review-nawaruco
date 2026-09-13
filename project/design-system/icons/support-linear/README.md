# NAWARUCO — Icon hỗ trợ / Linear

Bộ SVG tự vẽ, không phụ thuộc thư viện, không có ảnh nhúng hay font.

| File | Chức năng |
|---|---|
| support.svg | Hỗ trợ trực tuyến — tai nghe và micro |
| invoice-search.svg | Tra cứu hoá đơn — hoá đơn và kính lúp |
| payment.svg | Thanh toán — thẻ và dấu xác nhận |

## Chỉnh sửa

- Khung chung: `viewBox="0 0 32 32"`. Cỡ mặc định 72 × 72 px.
- Màu: `stroke="currentColor"`; mặc định đen khi mở độc lập. Có thể thay bằng `#1B6FA8` hoặc màu tùy chọn.
- Độ dày nét: chỉnh `stroke-width="1.5"` ở thẻ svg ngoài cùng; áp dụng chung mọi hình.
- Nét và góc nối bo tròn. Không có mảng tô, bộ lọc, mask hoặc đường path chuyển từ stroke.
- Các chi tiết tách thành path, rect và circle, có chú thích tiếng Việt để sửa bằng trình soạn thảo hoặc phần mềm vector.
- Khi nhúng SVG trực tiếp vào HTML, đặt `color:#1B6FA8` ở phần tử cha để đổi màu. Dùng thẻ img thì màu CSS của trang không truyền vào SVG; hãy chỉnh màu trong file.
- Có tiêu đề cạnh icon: thêm `aria-hidden="true"` cho SVG inline, hoặc `alt=""` cho img. Nếu đứng độc lập, thêm tên truy cập phù hợp.

Trang xem thử: ../../../mockup/icon-linear-demo.html
Bộ icon chưa thay vào trang chủ.
