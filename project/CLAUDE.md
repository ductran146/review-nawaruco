# NAWARUCO — hướng dẫn cho AI agent làm việc trong repo này

Website cho **Công ty Cổ phần Cấp nước Nông thôn Nam Định**. Người dùng thật là hộ dân
nông thôn: máy cũ, mạng yếu, phần lớn vào bằng điện thoại, nhiều người lớn tuổi, và
họ vào đây khi đang có việc gấp — mất nước, tra cứu hoá đơn, báo sự cố.

## Ràng buộc kỹ thuật — không thương lượng

- **WordPress classic theme.** Không build step, không bundler, không Tailwind,
  không React/Vue. CSS thuần + JS thuần, mở được bằng `file://`.
- **Chỉ light mode.** Mọi khối `prefers-color-scheme: dark` hay `data-theme` mới
  xuất hiện đều là lỗi.
- **Ba mốc `max-width` 1024 / 760 / 640, desktop-first.** Không thêm mốc thứ tư,
  không dùng `min-width`.
- **Không `!important`.** Không inline style để thắng cascade. Không selector nhân
  đôi để tăng độ ưu tiên.

## Nguồn chân lý của hệ thiết kế

| Thứ | File | Ghi chú |
|---|---|---|
| Token | `design-system/tokens.css` | **Nguồn duy nhất.** Không tạo file token thứ hai. |
| Component | `design-system/components.css` + `components.html` | Sửa CSS thì sửa markup mẫu cùng lượt |
| Hợp đồng thiết kế | `design-system/README.md` | Bảng token, quy ước khoảng cách/typography |
| Sai lệch đã chấp nhận | `design-system/GAPS.md` | Đọc trước khi báo lỗi, tránh báo trùng |
| Đặc tả trang | `design-system/page-specs.md` | Giao việc dựng trang |
| Khung dùng chung | `mockup/site.css` | header/footer/banner/breadcrumb/lưới |

Thứ tự nhúng CSS: Google Fonts → `tokens.css` → `components.css` → `site.css` →
CSS riêng của trang.

Quyết định đã chốt với khách, đừng đề xuất ngược: màu lấy từ logo chính thức
(`--c-primary-600:#00649F`, `--c-accent-600:#00AB38`) · chữ lớn Montserrat, chữ
và **số** dùng Inter qua `--font-numeric` (`--font-mono` chỉ cho code) · khoảng
cách giữa mọi box/module **20px = `--gap-box`**, kể cả từ đầu trang xuống khối
nội dung đầu tiên · nút cao 40px · icon bộ Solar qua sprite inline, không khung
nền · tiêu đề trang là text trên banner ảnh · slider trang chủ chỉ là ảnh.

## Quy tắc nội dung

- **Không bịa số liệu.** Chưa có dữ liệu thì để `[cần …]`. Áp dụng cho giá nước,
  số ngày làm việc, số điện thoại, kết quả kiểm nghiệm, ngày ban hành văn bản.
- **Không sao chép dữ liệu của công ty khác** (địa chỉ, hotline, biểu giá, chính
  sách) — kể cả khi đang tham chiếu layout của họ.
- **Không trình bày ảnh dựng/ảnh kho như ảnh sự kiện thật của công ty.**
- Không để chữ ghi chú cho đội dựng lọt vào phần người dùng đọc được. Ghi chú kích
  thước ảnh trong khung `.img-ph` thì được — khách yêu cầu.

## Đo, đừng ước lượng

Trước khi kết luận về bố cục, tương phản hay khoảng cách: nạp trang trong iframe ở
**375 / 768 / 1024 / 1440**, đọc `getBoundingClientRect` và `getComputedStyle`.
Ảnh chụp headless ở 375px **không tin được** — cửa sổ desktop có bề rộng tối thiểu
500px nên ảnh đó chỉ là phần cắt của bản 500px.

Khi đo khoảng cách, lấy **con hiển thị đầu tiên**, không dùng `firstElementChild`:
phần tử đầu có thể là `.sr-only` cao 1px hoặc một khối `[hidden]` nằm đúng mốc
mong đợi, làm phép đo báo "đạt" trong khi mắt thường thấy sai. Chi tiết và đoạn
JS mẫu ở `.claude/agents/page-build-pipeline.md`.

---

# Dùng skill `ui-ux-pro-max` trong dự án này

Repo <https://github.com/nextlevelbuilder/ui-ux-pro-max-skill> được cài như plugin
Claude Code, gồm 7 skill. Nó **được thiết kế cho stack React/Next/Tailwind/shadcn và
cho việc sinh ra hệ thiết kế mới** — còn dự án này là WordPress classic với hệ thiết
kế đã chốt. Nên chỉ dùng phần tri thức, không dùng phần sinh code/sinh token.

## Được dùng

- **`ui-ux-pro-max` với `--domain ux`** — 119 quy tắc UX/accessibility. Đây là phần
  giá trị nhất và khớp với dự án. Dùng khi soát giao diện, xử lý form, điều hướng,
  trạng thái lỗi, vùng bấm.
- **`--domain ux` cho từng tiêu chí WCAG cụ thể**, mỗi lần một kết quả quan sát
  được (ví dụ `"error summary validation" --domain ux`).
- Tham khảo `--domain color` / `--domain typography` **chỉ để đối chiếu lý lẽ**,
  không để đổi bảng màu hay bộ font đã chốt với khách.

Chạy trực tiếp bằng Python, không cần cài npm:

```bash
python3 ~/.claude/plugins/marketplaces/ui-ux-pro-max-skill/src/ui-ux-pro-max/scripts/search.py \
  "form error message accessibility" --domain ux
```

Đã cài sẵn ở scope `user` (kiểm bằng `claude plugin list`), nên mọi project trên
máy này và cả extension VS Code lẫn CLI terminal đều dùng được. Máy chỉ có
`python3`, không có `python` — gọi `python` trần sẽ báo command not found.

## Không được dùng

- **`ui-styling`** — shadcn/ui + Radix + Tailwind. Dự án không có build step.
- **`brand`, `design`, `banner-design`, `slides`** — sinh logo bằng AI, bộ nhận diện,
  slide thuyết trình. Ngoài phạm vi. Logo đã có bản chính thức trong repo.
- **Mọi script ghi file của các skill đó**, đặc biệt
  `brand/scripts/sync-brand-to-tokens.cjs`: nó ghi ra `assets/design-tokens.css` +
  `design-tokens.json`, tức tạo **nguồn token thứ hai** song song với
  `design-system/tokens.css`. Hai nguồn chân lý là đúng thứ hệ thiết kế này tồn tại
  để tránh.
- **`design-system` skill** dùng kiến trúc token ba tầng
  (primitive→semantic→component) và đọc `assets/design-tokens.css`. Không cho nó
  tái cấu trúc `design-system/tokens.css`. `html-token-validator.py` cũng đọc sai
  đường dẫn nên không dùng được như hiện trạng.
- **Không có stack WordPress** trong 22 stack của skill (gần nhất là `html-tailwind`
  và `laravel`). Đừng áp `--stack` nào cho dự án này.

## Khi kết quả của skill trái với hệ thiết kế

Hệ thiết kế của dự án **thắng**, vì nó đã chốt với khách hàng. Ví dụ bảng ưu tiên
trong `SKILL.md` khuyên mobile-first breakpoints, trong khi dự án chốt desktop-first
ba mốc. Cách xử lý: ghi khác biệt đó vào `GAPS.md` như một **lập luận ưu tiên** kèm
nguồn, rồi để người quyết — không tự đổi hệ.

Nhưng đọc kỹ trước khi coi là xung đột: bảng ưu tiên của skill viết tắt "Min size
44×44px", còn dữ liệu `--domain ux` của chính nó lại nói *"for web use the separate
WCAG Target Size rule — Web 24 CSS px plus WCAG exceptions"*, tức **trùng** với sàn
24px của dự án; 44pt/48dp chỉ áp cho app iOS/Android. Truy vấn dữ liệu trước khi kết
luận, đừng dừng ở bảng tóm tắt.
