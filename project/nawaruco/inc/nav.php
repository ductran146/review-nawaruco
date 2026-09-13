<?php
/**
 * Vị trí menu + walker cho .mainnav / .has-sub / .subnav.
 *
 * Mục Trang chủ dạng icon tròn (.nav-home) không đi qua wp_nav_menu — nó là
 * một link tĩnh trỏ home_url(), luôn giống nhau, viết thẳng trong
 * template-parts/header/mainnav.php. wp_nav_menu chỉ dựng phần còn lại của
 * menu (Giới thiệu, Dịch vụ, Thanh toán, Hỗ trợ khách hàng, Cổ đông, Tin tức,
 * Liên hệ), lấy từ vị trí 'primary' — admin tạo menu thật trong
 * Giao diện → Menu và gán vào vị trí này.
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

function nawaruco_register_menus() {
	register_nav_menus(
		array(
			'primary' => esc_html__( 'Menu chính', 'nawaruco' ),
			'footer'  => esc_html__( 'Menu chân trang', 'nawaruco' ),
		)
	);
}
add_action( 'after_setup_theme', 'nawaruco_register_menus' );

/**
 * Walker dựng đúng markup .has-sub / <button aria-haspopup> / .subnav đã có
 * sẵn trong design-system/components.css — không đổi cấu trúc, chỉ đổi nguồn
 * dữ liệu từ HTML tĩnh sang WP_Query menu thật.
 */
class Nawaruco_Nav_Walker extends Walker_Nav_Menu {

	public function start_lvl( &$output, $depth = 0, $args = null ) {
		$output .= '<ul class="subnav">';
	}

	public function end_lvl( &$output, $depth = 0, $args = null ) {
		$output .= '</ul></li>';
	}

	public function start_el( &$output, $item, $depth = 0, $args = null, $id = 0 ) {
		$has_children = ! empty( $args->has_children );

		if ( 0 === $depth && $has_children ) {
			$output .= '<li class="has-sub"><button type="button" aria-haspopup="true" aria-expanded="false">'
				. esc_html( $item->title )
				. '<svg class="icon has-sub__chevron" aria-hidden="true"><use href="#ico-down"></use></svg></button>';
			return;
		}

		$output .= '<li><a href="' . esc_url( $item->url ) . '">' . esc_html( $item->title ) . '</a></li>';
	}

	public function end_el( &$output, $item, $depth = 0, $args = null ) {
		// Không làm gì: <li> đã đóng ở start_el (mục lá) hoặc ở end_lvl (mục cha, sau khi .subnav đóng).
	}
}
