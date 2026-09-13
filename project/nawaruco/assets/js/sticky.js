/* Chiều cao header dán ở đỉnh -> biến CSS --header-h.
   Đo bằng JS thay vì viết số cứng: header cao khác nhau ở desktop và mobile, và
   đổi ngay khi menu mobile bung ra. CSS dùng biến này cho hai việc: chỗ dán của
   menu neo và scroll-margin-top của các mục neo.
   Nguồn: mockup/index.html (script cuối trang). */
(function () {
  var header = document.querySelector('.site-header');
  if (!header) return;
  var root = document.documentElement;
  var topbar = document.querySelector('.topbar');
  function measure() {
    root.style.setProperty('--header-h', header.getBoundingClientRect().height + 'px');
    var anchor = document.querySelector('.anchor-nav');
    if (anchor) root.style.setProperty('--anchor-h', anchor.getBoundingClientRect().height + 'px');
    /* Drawer menu mobile bắt đầu ngay dưới topbar (xem nav:has() trong
       components.css) để nút X trùng đúng vị trí nút Menu lúc chưa bấm --
       topbar ẩn/hiện brandline theo mốc màn hình nên đo thật bằng JS thay
       vì đoán một số cố định. */
    if (topbar) root.style.setProperty('--topbar-h', topbar.getBoundingClientRect().height + 'px');
  }
  measure();
  window.addEventListener('resize', measure);
  if ('ResizeObserver' in window) new ResizeObserver(measure).observe(header);
  if (topbar && 'ResizeObserver' in window) new ResizeObserver(measure).observe(topbar);
})();
