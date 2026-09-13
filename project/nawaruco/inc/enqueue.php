<?php
/**
 * Enqueue CSS/JS. Không chèn <link>/<script> thủ công vào header.php/footer.php.
 *
 * Thứ tự cascade bắt buộc: tokens.css → components.css → site.css (nhịp bố cục
 * dùng chung mọi trang) → assets/css/pages/<slug>.css (nếu trang đó có, việc
 * enqueue file trang riêng sẽ nằm ở from-page template khi trang đó được dựng).
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

function nawaruco_enqueue_assets() {
	$dir = get_template_directory();
	$uri = get_template_directory_uri();

	wp_enqueue_style(
		'nawaruco-fonts',
		'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Montserrat:wght@600;700;800&display=swap',
		array(),
		null
	);

	wp_enqueue_style(
		'nawaruco-tokens',
		$uri . '/assets/css/tokens.css',
		array(),
		filemtime( $dir . '/assets/css/tokens.css' )
	);

	wp_enqueue_style(
		'nawaruco-components',
		$uri . '/assets/css/components.css',
		array( 'nawaruco-tokens' ),
		filemtime( $dir . '/assets/css/components.css' )
	);

	wp_enqueue_style(
		'nawaruco-site',
		$uri . '/assets/css/site.css',
		array( 'nawaruco-components' ),
		filemtime( $dir . '/assets/css/site.css' )
	);

	wp_enqueue_script(
		'nawaruco-nav',
		$uri . '/assets/js/nav.js',
		array(),
		filemtime( $dir . '/assets/js/nav.js' ),
		true
	);

	wp_enqueue_script(
		'nawaruco-sticky',
		$uri . '/assets/js/sticky.js',
		array(),
		filemtime( $dir . '/assets/js/sticky.js' ),
		true
	);
}
add_action( 'wp_enqueue_scripts', 'nawaruco_enqueue_assets' );
