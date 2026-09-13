/* Menu mobile là drawer (xem khối 1024px trong components.css): có hai nút
   điều khiển cùng một .mainnav — nút hamburger trong .mainbar (mở) và nút X
   trong .mainnav__head (đóng, chỉ hiện khi drawer đang mở). Cả hai phải luôn
   đồng bộ aria-expanded, không riêng gì nút vừa bấm — thiếu bước này thì đóng
   bằng nút X xong nút hamburger vẫn báo aria-expanded="true" sai sự thật.
   Nguồn: screen/assets/js/include-partials.js (initNavToggle + initSubnavAccordion). */
(function () {
  var nav = document.getElementById('mainnav');
  if (!nav) return;
  var backdrop = document.querySelector('.nav-backdrop');
  var toggles = document.querySelectorAll('.nav-toggle, .mainnav__close');

  function setOpen(open) {
    nav.classList.toggle('is-open', open);
    if (backdrop) backdrop.hidden = !open;
    toggles.forEach(function (b) { b.setAttribute('aria-expanded', String(open)); });
  }

  toggles.forEach(function (btn) {
    btn.addEventListener('click', function () {
      setOpen(!nav.classList.contains('is-open'));
    });
  });

  /* Bấm vào nền mờ để đóng drawer. .nav-backdrop PHẢI là phần tử riêng, anh
     em của <nav>, không phải ::before con của nó -- thử ::before trước rồi
     bỏ, xem lý do (thứ tự vẽ CSS 2.1 Phụ lục E) tại nav:has() trong
     components.css. */
  if (backdrop) {
    backdrop.addEventListener('click', function () { setOpen(false); });
  }

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && nav.classList.contains('is-open')) setOpen(false);
  });
})();

/* Accordion cho menu con trên mobile (xem khối 1024px trong components.css):
   mỗi nút .has-sub tự mở/đóng .subnav liền sau nó qua aria-expanded, không
   đụng tới .is-open của .mainnav ở trên. Ở desktop, .subnav hiện bằng
   :hover/:focus-within trong CSS nên aria-expanded ở đó chỉ là trạng thái,
   không ảnh hưởng hiển thị. */
document.querySelectorAll('.mainnav .has-sub > button').forEach(function (btn) {
  btn.addEventListener('click', function () {
    var expanded = btn.getAttribute('aria-expanded') === 'true';
    btn.setAttribute('aria-expanded', String(!expanded));
  });
});

/* Icon tìm kiếm trong .mainbar (mobile — xem .header-search-toggle trong
   components.css): bấm để bung/thu ô nhập .search-form ngay bên dưới, giống
   hệt cơ chế nav-toggle/backdrop ở trên nhưng độc lập, không đụng .mainnav. */
(function () {
  var btn = document.querySelector('.header-search-toggle');
  var form = document.getElementById('mobile-search');
  if (!btn || !form) return;
  btn.addEventListener('click', function () {
    var open = form.hidden;
    form.hidden = !open;
    btn.setAttribute('aria-expanded', String(open));
    if (open) {
      var input = form.querySelector('input');
      if (input) input.focus();
    }
  });
})();
