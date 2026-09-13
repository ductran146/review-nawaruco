/* NAWARUCO — nạp component dùng chung (sprite icon, header, footer) bằng
   fetch() + inject vào các mount point <div data-include="...">, để header/
   footer/icon chỉ tồn tại ở 1 nguồn (mockup/partials/) thay vì lặp lại trong
   từng trang HTML. Cần chạy qua HTTP (vd. Five Server) — fetch() một file cục
   bộ sẽ bị chặn nếu mở trực tiếp bằng file://.
   Lên WordPress: các phần này đã có sẵn dạng PHP thật (header.php, footer.php,
   template-parts/icons.php, get_template_part()) — file JS này chỉ cần cho
   giai đoạn mockup tĩnh. */
(function () {
  'use strict';

  function inject(mount) {
    var url = mount.getAttribute('data-include');
    return fetch(url)
      .then(function (res) {
        if (!res.ok) throw new Error('Không tải được ' + url + ' (HTTP ' + res.status + ')');
        return res.text();
      })
      .then(function (html) {
        mount.innerHTML = html;
      })
      .catch(function (err) {
        mount.innerHTML = '<!-- lỗi nạp component: ' + err.message + ' -->';
        console.error(err);
      });
  }

  function applyActiveNav(headerMount) {
    var navKey = headerMount.getAttribute('data-nav');
    if (!navKey) return;
    var current = headerMount.querySelector('[data-nav-key="' + navKey + '"]');
    if (current) current.setAttribute('aria-current', 'page');
    if (navKey === 'home') {
      var homeIcon = headerMount.querySelector('[data-home-icon]');
      if (homeIcon) homeIcon.setAttribute('href', '#ico-home');
    }
    var leaf = headerMount.getAttribute('data-nav-leaf');
    if (leaf) {
      var leafLink = headerMount.querySelector('.subnav a[href="' + leaf + '"]');
      if (leafLink) leafLink.setAttribute('aria-current', 'page');
    }
  }

  /* ============ KHOA CUON NEN (scroll lock) ============
     Dung chung cho MOI thu che kin man hinh tren mobile: drawer menu (ben
     duoi) va bat ky modal/dialog nao dung sau nay -- goi window.NWRC.
     lockScroll()/unlockScroll(). Khong chi dat body{overflow:hidden}: mot
     minh no khong chan duoc scroll "rubber-band" cua Safari/iOS keo tren nen
     phia sau khi drawer/modal dang mo. Ky thuat chuan: dong bang body bang
     position:fixed dung tai vi tri dang cuon (bu lai bang top:-scrollY) roi
     tra ve dung vi tri do luc mo khoa.
     Dem so lan khoa (lockCount) vi co the co 2 thu cung khoa scroll mot luc
     (vd mo modal trong khi drawer dang mo san) -- chi thuc su mo khoa khi
     KHONG con thu nao giu khoa nua, tranh truong hop dong 1 cai lam mat
     khoa luon cho cai con lai dang mo. */
  var scrollLockCount = 0;
  var scrollLockY = 0;
  function lockScroll() {
    scrollLockCount++;
    if (scrollLockCount > 1) return;
    scrollLockY = window.scrollY || window.pageYOffset || 0;
    var b = document.body.style;
    b.position = 'fixed';
    b.top = (-scrollLockY) + 'px';
    b.left = '0';
    b.right = '0';
  }
  function unlockScroll() {
    scrollLockCount = Math.max(0, scrollLockCount - 1);
    if (scrollLockCount > 0) return;
    var b = document.body.style;
    b.position = '';
    b.top = '';
    b.left = '';
    b.right = '';
    window.scrollTo(0, scrollLockY);
  }
  window.NWRC = window.NWRC || {};
  window.NWRC.lockScroll = lockScroll;
  window.NWRC.unlockScroll = unlockScroll;

  /* Menu mobile là drawer (xem khối 1024px trong components.css): có hai nút
     điều khiển cùng một .mainnav — nút hamburger trong .mainbar (mở) và nút X
     trong .mainnav__head (đóng, chỉ hiện khi drawer đang mở). Cả hai phải
     luôn đồng bộ aria-expanded, không riêng gì nút vừa bấm — trước đây chỉ có
     một nút nên tự nó đúng, giờ thiếu bước này thì đóng bằng nút X xong nút
     hamburger vẫn báo aria-expanded="true" sai sự thật.
     Mở drawer cũng khoa cuộn nền (xem KHOA CUON NEN ở trên) -- nếu không,
     trên mobile người dùng vẫn kéo cuộn được trang phía sau drawer, dễ nhầm
     đang cuộn danh sách menu. */
  function initNavToggle() {
    var nav = document.getElementById('mainnav');
    if (!nav) return;
    var backdrop = document.querySelector('.nav-backdrop');
    var toggles = document.querySelectorAll('.nav-toggle, .mainnav__close');

    function setOpen(open) {
      var wasOpen = nav.classList.contains('is-open');
      nav.classList.toggle('is-open', open);
      if (backdrop) backdrop.hidden = !open;
      toggles.forEach(function (b) { b.setAttribute('aria-expanded', String(open)); });
      if (open && !wasOpen) { lockScroll(); }
      else if (!open && wasOpen) { unlockScroll(); }
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
  }

  /* Accordion cho menu con trên mobile (xem khối 1024px trong components.css):
     mỗi nút .has-sub tự mở/đóng .subnav liền sau nó qua aria-expanded, không
     đụng tới .is-open của .mainnav (đóng/mở toàn menu vẫn do initNavToggle lo).
     Ở desktop, .subnav hiện bằng :hover/:focus-within trong CSS nên
     aria-expanded ở đó chỉ là trạng thái, không ảnh hưởng hiển thị. */
  function initSubnavAccordion() {
    document.querySelectorAll('.mainnav .has-sub > button').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var expanded = btn.getAttribute('aria-expanded') === 'true';
        btn.setAttribute('aria-expanded', String(!expanded));
      });
    });
  }

  /* Icon tìm kiếm trong .mainbar (mobile — xem .header-search-toggle trong
     components.css): bấm để bung/thu ô nhập .search-form ngay bên dưới,
     giống hệt cơ chế initNavToggle nhưng độc lập, không đụng .mainnav. */
  function initMobileSearch() {
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
  }

  function initStickyHeader() {
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
  }

  /* ============ Component có tham số: page-banner, widget-promo ============
     Khác với icons/header/footer (nội dung giống hệt mọi trang -> fetch() 1
     nguồn), 2 khối này có KHUNG HTML giống nhau nhưng nội dung khác nhau mỗi
     lần dùng (tiêu đề, ảnh, breadcrumb...). Nên khung HTML nằm cố định ở đây
     (sửa cấu trúc chỉ cần sửa 1 chỗ), còn nội dung truyền qua data-attribute
     ngay trên mount point trong từng trang. Không cần fetch (dựng chuỗi tại
     chỗ), nên chạy được ngay, không phụ thuộc icons/header/footer nạp xong. */

  function escapeHtml(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
  }

  function renderPageBanner(mount) {
    var image = mount.getAttribute('data-image') || '';
    var title = mount.getAttribute('data-title') || '';
    var desc = mount.getAttribute('data-desc');
    var crumbsRaw = mount.getAttribute('data-crumbs') || '';

    var crumbs = crumbsRaw.split(';').filter(function (s) { return s.length; }).map(function (part) {
      var i = part.indexOf('|');
      return { label: part.slice(0, i), href: part.slice(i + 1) };
    });

    var crumbHtml = crumbs.map(function (c, i) {
      var sep = i > 0 ? '<span class="sep">/</span>' : '';
      var isLast = i === crumbs.length - 1;
      if (isLast || !c.href) {
        return sep + '<span class="current">' + escapeHtml(c.label) + '</span>';
      }
      return sep + '<a href="' + escapeHtml(c.href) + '">' + escapeHtml(c.label) + '</a>';
    }).join('');

    var html =
      '<section class="page-banner page-banner--image" style="--banner-image:url(' + escapeHtml(image) + ')">' +
      '<div class="container">' +
      '<h1>' + escapeHtml(title) + '</h1>' +
      (desc ? '<p>' + escapeHtml(desc) + '</p>' : '') +
      '<div class="breadcrumb">' + crumbHtml + '</div>' +
      '</div></section>';

    var wrapper = document.createElement('div');
    wrapper.innerHTML = html;
    mount.replaceWith(wrapper.firstElementChild);
  }

  function renderWidgetPromo(mount) {
    var href = mount.getAttribute('data-href') || '#';
    var img = mount.getAttribute('data-img') || '';
    var imgW = mount.getAttribute('data-img-w') || '';
    var imgH = mount.getAttribute('data-img-h') || '';
    var alt = mount.getAttribute('data-alt') || '';
    var cta = mount.getAttribute('data-cta') || '';
    var afterBlock = mount.getAttribute('data-after-block') === 'true';

    var html =
      '<div class="widget widget-promo' + (afterBlock ? ' after-block' : '') + '">' +
      '<a class="widget-promo__link" href="' + escapeHtml(href) + '">' +
      '<div class="widget-promo__img"><img src="' + escapeHtml(img) + '" width="' + escapeHtml(imgW) + '" height="' + escapeHtml(imgH) + '" loading="lazy" alt="' + escapeHtml(alt) + '"></div>' +
      '<span class="widget-promo__cta sr-only">' + escapeHtml(cta) + '</span>' +
      '</a></div>';

    var wrapper = document.createElement('div');
    wrapper.innerHTML = html;
    mount.replaceWith(wrapper.firstElementChild);
  }

  function renderParamComponents() {
    document.querySelectorAll('[data-include="page-banner"]').forEach(renderPageBanner);
    document.querySelectorAll('[data-include="widget-promo"]').forEach(renderWidgetPromo);
  }

  document.addEventListener('DOMContentLoaded', function () {
    renderParamComponents();

    var iconsMount = document.querySelector('[data-include="partials/icons.html"]');
    var headerMount = document.querySelector('[data-include="partials/header.html"]');
    var footerMount = document.querySelector('[data-include="partials/footer.html"]');
    var bottomNavMount = document.querySelector('[data-include="partials/bottom-nav.html"]');

    var iconsDone = iconsMount ? inject(iconsMount) : Promise.resolve();

    iconsDone.then(function () {
      var jobs = [];
      if (headerMount) jobs.push(inject(headerMount));
      if (footerMount) jobs.push(inject(footerMount));
      if (bottomNavMount) jobs.push(inject(bottomNavMount));
      return Promise.all(jobs);
    }).then(function () {
      if (headerMount) applyActiveNav(headerMount);
      /* .bottom-nav dùng lại đúng data-nav-key với .mainnav (vd "ho-tro-khach-hang"
         cho cả mục CSKH lẫn Hỗ trợ khách hàng) nên applyActiveNav() cũ dùng lại
         được nguyên vẹn, không cần viết hàm riêng. */
      if (bottomNavMount) applyActiveNav(bottomNavMount);
      initNavToggle();
      initSubnavAccordion();
      initMobileSearch();
      initStickyHeader();
      document.dispatchEvent(new CustomEvent('nawaruco:partials-ready'));
    });
  });
})();
