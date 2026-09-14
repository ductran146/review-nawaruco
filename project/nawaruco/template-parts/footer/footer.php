<?php
/**
 * Footer 2 cột: thương hiệu, liên hệ. Các giá trị liên hệ thật (địa chỉ,
 * fax, MST) lấy qua get_theme_mod — thêm control trong Customizer khi NAWARUCO
 * cung cấp số liệu chính thức; cho tới lúc đó vẫn hiện đúng chữ "[cần ...]"
 * như bản demo tĩnh để không ai tưởng nhầm là số liệu thật.
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}
?>
<footer class="site-footer">
  <div class="container">
    <div class="footer-grid footer-grid--2">

      <div class="footer-brand">
        <span class="footer-logo"><img src="<?php echo esc_url( get_template_directory_uri() . '/assets/images/logo-vertical.svg' ); ?>" width="92" height="90" alt="" loading="lazy"></span>
        <b><?php esc_html_e( 'Công ty Cổ phần Cấp nước', 'nawaruco' ); ?><br><?php esc_html_e( 'Nông thôn Nam Định', 'nawaruco' ); ?></b>
      </div>

      <div>
        <h2><?php esc_html_e( 'Thông tin liên hệ', 'nawaruco' ); ?></h2>
        <ul class="contact-list">
          <li><svg class="icon icon-md" aria-hidden="true"><use href="#ico-pin"></use></svg>
            <span><?php echo esc_html( get_theme_mod( 'nawaruco_address', __( '[cần địa chỉ trụ sở], tỉnh Nam Định', 'nawaruco' ) ) ); ?></span></li>
          <li><svg class="icon icon-md" aria-hidden="true"><use href="#ico-phone"></use></svg>
            <span><?php esc_html_e( 'Điện thoại:', 'nawaruco' ); ?> <a href="tel:<?php echo esc_attr( get_theme_mod( 'nawaruco_hotline_tel', '19006xxx' ) ); ?>"><?php echo esc_html( get_theme_mod( 'nawaruco_hotline_display', '1900 6xxx' ) ); ?></a></span></li>
          <li><svg class="icon icon-md" aria-hidden="true"><use href="#ico-mail"></use></svg>
            <span><?php esc_html_e( 'Email:', 'nawaruco' ); ?> <a href="mailto:<?php echo esc_attr( get_theme_mod( 'nawaruco_email', 'cskh@nawaruco.vn' ) ); ?>"><?php echo esc_html( get_theme_mod( 'nawaruco_email', 'cskh@nawaruco.vn' ) ); ?></a></span></li>
          <li><svg class="icon icon-md" aria-hidden="true"><use href="#ico-fax"></use></svg>
            <span><?php esc_html_e( 'Fax:', 'nawaruco' ); ?> <?php echo esc_html( get_theme_mod( 'nawaruco_fax', __( '[cần số fax]', 'nawaruco' ) ) ); ?></span></li>
          <li><svg class="icon icon-md" aria-hidden="true"><use href="#ico-doc"></use></svg>
            <span><?php esc_html_e( 'MST:', 'nawaruco' ); ?> <?php echo esc_html( get_theme_mod( 'nawaruco_tax_code', __( '[cần mã số thuế]', 'nawaruco' ) ) ); ?></span></li>
        </ul>
      </div>

    </div>

    <div class="footer-bottom">
      <span><?php echo esc_html( sprintf( /* translators: %s: năm hiện tại */ __( '© %s Công ty Cổ phần Cấp nước Nông thôn Nam Định. Bảo lưu mọi quyền.', 'nawaruco' ), gmdate( 'Y' ) ) ); ?></span>
      <span><a href="<?php echo esc_url( home_url( '/chinh-sach-bao-mat' ) ); ?>"><?php esc_html_e( 'Chính sách bảo mật', 'nawaruco' ); ?></a> · <a href="#"><?php esc_html_e( 'Sơ đồ website', 'nawaruco' ); ?></a></span>
    </div>
  </div>
</footer>
