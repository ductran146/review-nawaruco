<?php
/**
 * Thanh trên cùng: tên đơn vị, mạng xã hội, tìm kiếm, chuyển ngôn ngữ.
 *
 * GAP: chuyển ngôn ngữ (VN/EN) hiện là hai link tĩnh — chưa nối với hệ đa
 * ngôn ngữ thật (Polylang/WPML). Ghi vào design-system/GAPS.md nếu khách xác
 * nhận cần song ngữ thật.
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}
?>
<div class="topbar">
    <span class="brandline"><?php esc_html_e( 'Công ty Cấp nước sạch Nông thôn Nam Định', 'nawaruco' ); ?></span>
    <div class="topbar-tools">
      <div class="topbar-social">
        <!-- Solar không có icon thương hiệu: giữ hình chính thức của nền tảng -->
        <a href="<?php echo esc_url( get_theme_mod( 'nawaruco_facebook_url', '#' ) ); ?>" aria-label="<?php esc_attr_e( 'Trang Facebook của NAWARUCO', 'nawaruco' ); ?>">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M13 22v-9h3l1-4h-4V7c0-1 .3-1.7 1.8-1.7H17V1.8C16.6 1.7 15.4 1.6 14 1.6c-2.9 0-4.9 1.8-4.9 5V9H6v4h3.1v9z"/></svg>
        </a>
        <a href="<?php echo esc_url( get_theme_mod( 'nawaruco_youtube_url', '#' ) ); ?>" aria-label="<?php esc_attr_e( 'Kênh YouTube của NAWARUCO', 'nawaruco' ); ?>">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M22 12s0-3.2-.4-4.7a2.5 2.5 0 00-1.7-1.8C18.3 5 12 5 12 5s-6.3 0-7.9.5a2.5 2.5 0 00-1.7 1.8C2 8.8 2 12 2 12s0 3.2.4 4.7c.2.9.9 1.6 1.7 1.8C5.7 19 12 19 12 19s6.3 0 7.9-.5a2.5 2.5 0 001.7-1.8C22 15.2 22 12 22 12zM10 15V9l5.2 3z"/></svg>
        </a>
      </div>
      <form class="topbar-search" role="search" method="get" action="<?php echo esc_url( home_url( '/' ) ); ?>">
        <label class="sr-only" for="s"><?php esc_html_e( 'Tìm kiếm trên website', 'nawaruco' ); ?></label>
        <input type="search" id="s" name="s" placeholder="<?php esc_attr_e( 'Tìm kiếm', 'nawaruco' ); ?>" value="<?php echo esc_attr( get_search_query() ); ?>">
        <button type="submit" aria-label="<?php esc_attr_e( 'Tìm kiếm', 'nawaruco' ); ?>">
          <svg class="icon icon-sm" aria-hidden="true"><use href="#ico-search"></use></svg>
        </button>
      </form>
    <nav class="lang-switch" aria-label="<?php esc_attr_e( 'Chọn ngôn ngữ', 'nawaruco' ); ?>">
      <a href="#" aria-current="page">VN</a>
      <a href="#">EN</a>
    </nav>
  </div>
</div>
