<?php
/**
 * Menu chính. Mục Trang chủ dạng icon tròn viết tĩnh (luôn giống nhau, không
 * cần biên tập); phần còn lại lấy từ vị trí menu 'primary' qua Nawaruco_Nav_Walker
 * (xem inc/nav.php) — Giao diện → Menu phải gán một menu thật vào vị trí này,
 * thứ tự mục đúng theo design-system/page-specs.md mục "Bảng tổng hợp":
 * Giới thiệu · Dịch vụ (2 mục con) · Thanh toán (3 mục con) ·
 * Hỗ trợ khách hàng (4 mục con) · Cổ đông (3 mục con) · Tin tức (4 mục con) · Liên hệ.
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

$is_front = is_front_page();
?>
<nav aria-label="<?php esc_attr_e( 'Điều hướng chính', 'nawaruco' ); ?>">
  <div class="mainnav__head">
    <span class="mainnav__title"><?php esc_html_e( 'Danh mục', 'nawaruco' ); ?></span>
    <button type="button" class="mainnav__close" aria-controls="mainnav" aria-label="<?php esc_attr_e( 'Đóng menu', 'nawaruco' ); ?>">
      <svg class="icon icon-md" aria-hidden="true"><use href="#ico-close"></use></svg>
    </button>
  </div>
  <ul class="mainnav mainnav--upper" id="mainnav">
    <li class="nav-home"><a href="<?php echo esc_url( home_url( '/' ) ); ?>"<?php echo $is_front ? ' aria-current="page"' : ''; ?>>
      <svg class="icon icon-md" aria-hidden="true"><use href="#<?php echo $is_front ? 'ico-home' : 'ico-home-linear'; ?>"></use></svg>
      <span class="nav-home__label"><?php esc_html_e( 'Trang chủ', 'nawaruco' ); ?></span>
    </a></li>

    <?php
    if ( has_nav_menu( 'primary' ) ) {
      wp_nav_menu(
        array(
          'theme_location' => 'primary',
          'container'      => false,
          'items_wrap'     => '%3$s',
          'walker'         => new Nawaruco_Nav_Walker(),
          'depth'          => 2,
        )
      );
    } else {
      // Chưa gán menu thật trong Giao diện → Menu: hiện tạm menu mẫu theo
      // page-specs.md để trang không trống, dễ nhận biết cần cấu hình.
      ?>
      <li>
        <a href="#"><?php esc_html_e( '[Chưa gán menu — vào Giao diện → Menu để tạo]', 'nawaruco' ); ?></a>
      </li>
      <?php
    }
    ?>
  </ul>
</nav>
