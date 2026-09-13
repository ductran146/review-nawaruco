<?php
/**
 * Theme setup: theme_supports cơ bản. Không load nav/enqueue ở đây — hai việc
 * đó có file riêng (inc/nav.php, inc/enqueue.php) theo đúng cấu trúc đã chốt.
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

function nawaruco_setup() {
	add_theme_support( 'title-tag' );
	add_theme_support( 'html5', array( 'search-form', 'comment-form', 'comment-list', 'gallery', 'caption', 'style', 'script' ) );
	add_theme_support( 'post-thumbnails' );
	add_theme_support( 'automatic-feed-links' );

	// Kích thước ảnh đại diện tin tức — khớp media-16-9 dùng trong .card-news
	// và .post-item (xem design-system/components.css).
	add_image_size( 'nawaruco-news-card', 800, 450, true );
	add_image_size( 'nawaruco-news-feature', 1200, 675, true );

	load_theme_textdomain( 'nawaruco', get_template_directory() . '/languages' );
}
add_action( 'after_setup_theme', 'nawaruco_setup' );
