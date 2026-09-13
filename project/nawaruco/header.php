<?php
/**
 * header.php — skip link, sprite icon, topbar, site-header (logo + mainnav).
 * Không chèn <link>/<script> thủ công ở đây — enqueue nằm hết ở inc/enqueue.php.
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}
?>
<!DOCTYPE html>
<html <?php language_attributes(); ?>>
<head>
<meta charset="<?php bloginfo( 'charset' ); ?>">
<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
<script>
/* Bật hiệu ứng .reveal chỉ khi JS thật sự chạy được. Gắn sớm nhất có thể,
   trước khi phần còn lại của <head> tải xong, để tránh chớp nội dung: phần tử
   .reveal chỉ ẩn khi <html> đã có sẵn .js-reveal, nên không có JS thì .reveal
   không bao giờ bị ẩn. NGOẠI LỆ có chủ đích với quy tắc "không script thủ công
   trong header.php" — dòng này phải chạy đồng bộ trước paint, enqueue qua
   wp_enqueue_script sẽ trễ mất một nhịp và gây chớp nội dung. Xem ghi chú gốc
   trong mockup/index.html. */
document.documentElement.classList.add('js-reveal');
</script>
<?php wp_head(); ?>
</head>
<body <?php body_class(); ?> id="top">
<?php wp_body_open(); ?>

<?php get_template_part( 'template-parts/icons' ); ?>

<a class="skip-link" href="#main"><?php esc_html_e( 'Bỏ qua điều hướng, tới nội dung chính', 'nawaruco' ); ?></a>

<?php get_template_part( 'template-parts/header/topbar' ); ?>

<header class="site-header">
  <div class="mainbar">
    <a class="logo-wrap" href="<?php echo esc_url( home_url( '/' ) ); ?>">
      <img class="logo-horizontal" src="<?php echo esc_url( get_template_directory_uri() . '/assets/images/logo-horizontal.svg' ); ?>" width="329" height="82" alt="<?php esc_attr_e( 'NAWARUCO – Nước sạch cho mọi nhà nông thôn', 'nawaruco' ); ?>">
    </a>

    <div class="header-actions">
      <button type="button" class="header-search-toggle" aria-expanded="false" aria-controls="mobile-search">
        <svg class="icon icon-md" aria-hidden="true"><use href="#ico-search"></use></svg>
        <span class="sr-only"><?php esc_html_e( 'Tìm kiếm', 'nawaruco' ); ?></span>
      </button>

      <button class="nav-toggle" aria-expanded="false" aria-controls="mainnav">
        <span class="bars" aria-hidden="true"></span><span class="sr-only"><?php esc_html_e( 'Menu', 'nawaruco' ); ?></span>
      </button>
    </div>

    <form class="search-form" id="mobile-search" role="search" action="<?php echo esc_url( home_url( '/' ) ); ?>" hidden>
      <label class="sr-only" for="s-mobile"><?php esc_html_e( 'Tìm kiếm trên website', 'nawaruco' ); ?></label>
      <input type="search" id="s-mobile" name="s" class="input" placeholder="<?php esc_attr_e( 'Tìm kiếm', 'nawaruco' ); ?>">
      <button type="submit" class="btn btn-primary btn-sm" aria-label="<?php esc_attr_e( 'Tìm kiếm', 'nawaruco' ); ?>">
        <svg class="icon icon-sm" aria-hidden="true"><use href="#ico-search"></use></svg>
      </button>
    </form>

    <div class="nav-backdrop" hidden></div>

    <?php get_template_part( 'template-parts/header/mainnav' ); ?>
  </div>
</header>

<main id="main">
