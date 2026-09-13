<?php
/**
 * NAWARUCO theme bootstrap.
 *
 * Chỉ require các file trong inc/ — không viết logic trực tiếp ở đây.
 * Xem design-system/README.md và .claude/agents/wp-theme-dev.md cho quy ước.
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Không cho truy cập trực tiếp.
}

define( 'NAWARUCO_VERSION', '0.1.0' );

require get_template_directory() . '/inc/setup.php';
require get_template_directory() . '/inc/enqueue.php';
require get_template_directory() . '/inc/nav.php';
