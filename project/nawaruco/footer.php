<?php
/**
 * footer.php — đóng <main>, gọi component footer, nút về đầu trang, wp_footer().
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}
?>
</main>

<?php get_template_part( 'template-parts/footer/footer' ); ?>

<a class="to-top" href="#top" aria-label="<?php esc_attr_e( 'Về đầu trang', 'nawaruco' ); ?>">
  <svg class="icon icon-md" aria-hidden="true"><use href="#ico-up"></use></svg>
</a>

<?php wp_footer(); ?>
</body>
</html>
