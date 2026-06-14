<?php
/**
 * Theme bootstrap.
 *
 * @package JoJoAVOE
 */

if (! defined('JOJO_AVOE_VERSION')) {
	define('JOJO_AVOE_VERSION', '1.0.0');
}

require_once get_template_directory() . '/inc/store-data.php';

function jojo_avoe_setup(): void {
	load_theme_textdomain('jojo-avoe', get_template_directory() . '/languages');

	add_theme_support('title-tag');
	add_theme_support('post-thumbnails');
	add_image_size('jojo_product_card', 900, 1200, true);
	add_theme_support('custom-logo', array(
		'height'      => 80,
		'width'       => 240,
		'flex-height' => true,
		'flex-width'  => true,
	));
	add_theme_support('html5', array('search-form', 'comment-form', 'comment-list', 'gallery', 'caption', 'style', 'script'));
	add_theme_support('customize-selective-refresh-widgets');
	add_theme_support('align-wide');
	add_theme_support('responsive-embeds');
	add_theme_support('woocommerce');
	add_theme_support('wc-product-gallery-zoom');
	add_theme_support('wc-product-gallery-lightbox');
	add_theme_support('wc-product-gallery-slider');

	register_nav_menus(array(
		'primary' => __('Primary Menu', 'jojo-avoe'),
		'footer'  => __('Footer Menu', 'jojo-avoe'),
	));
}
add_action('after_setup_theme', 'jojo_avoe_setup');

function jojo_avoe_enqueue_assets(): void {
	wp_enqueue_style(
		'jojo-avoe-fonts',
		'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap',
		array(),
		null
	);

	wp_enqueue_style(
		'jojo-avoe-main',
		get_template_directory_uri() . '/assets/css/main.css',
		array('jojo-avoe-fonts'),
		JOJO_AVOE_VERSION
	);

	wp_enqueue_style(
		'jojo-avoe-style',
		get_stylesheet_uri(),
		array('jojo-avoe-main'),
		JOJO_AVOE_VERSION
	);

	wp_enqueue_script(
		'jojo-avoe-theme',
		get_template_directory_uri() . '/assets/js/theme.js',
		array(),
		JOJO_AVOE_VERSION,
		true
	);
}
add_action('wp_enqueue_scripts', 'jojo_avoe_enqueue_assets');

function jojo_avoe_default_mods(): array {
	return array(
		'phone'            => '+380 75 249 00 29',
		'email'            => 'avoe.online@gmail.com',
		'hero_eyebrow'     => __('Нова колекція', 'jojo-avoe'),
		'hero_title'       => __('Мінімалістичні сумки та аксесуари', 'jojo-avoe'),
		'hero_text'        => __('Елегантні моделі преміум якості для тих, хто цінує стиль, функціональність і чіткий сервіс.', 'jojo-avoe'),
		'shipping_note'    => __('Доставка по Україні 1-3 робочі дні', 'jojo-avoe'),
		'about_title'      => __('Про бренд', 'jojo-avoe'),
		'about_text'       => __('Ми підбираємо сумки та аксесуари з акцентом на якість, довговічність і сучасну форму. Магазин зібраний так, щоб клієнт швидко обирав, легко замовляв і отримував чесний сервіс.', 'jojo-avoe'),
		'footer_tagline'   => __('Преміум аксесуари для тих, хто цінує якість та стиль.', 'jojo-avoe'),
		'instagram_handle' => '@avoe.store',
	);
}

function jojo_avoe_get_mod(string $key): string {
	$defaults = jojo_avoe_default_mods();
	return (string) get_theme_mod('jojo_avoe_' . $key, $defaults[$key] ?? '');
}

function jojo_avoe_customize_register(WP_Customize_Manager $wp_customize): void {
	$wp_customize->add_section('jojo_avoe_store_identity', array(
		'title'    => __('Store Identity', 'jojo-avoe'),
		'priority' => 30,
	));

	$fields = array(
		'phone'          => __('Phone', 'jojo-avoe'),
		'email'          => __('Email', 'jojo-avoe'),
		'hero_eyebrow'   => __('Hero Eyebrow', 'jojo-avoe'),
		'hero_title'     => __('Hero Title', 'jojo-avoe'),
		'hero_text'      => __('Hero Text', 'jojo-avoe'),
		'shipping_note'  => __('Shipping Note', 'jojo-avoe'),
		'about_title'    => __('About Title', 'jojo-avoe'),
		'about_text'     => __('About Text', 'jojo-avoe'),
		'footer_tagline' => __('Footer Tagline', 'jojo-avoe'),
	);

	foreach ($fields as $field_key => $label) {
		$wp_customize->add_setting('jojo_avoe_' . $field_key, array(
			'default'           => jojo_avoe_default_mods()[$field_key] ?? '',
			'sanitize_callback' => 'sanitize_textarea_field',
		));

		$wp_customize->add_control('jojo_avoe_' . $field_key, array(
			'type'    => in_array($field_key, array('hero_text', 'about_text'), true) ? 'textarea' : 'text',
			'section' => 'jojo_avoe_store_identity',
			'label'   => $label,
		));
	}
}
add_action('customize_register', 'jojo_avoe_customize_register');

function jojo_avoe_menu_fallback(): void {
	echo '<ul class="menu">';
	echo '<li><a href="' . esc_url(home_url('/shop')) . '">' . esc_html__('Магазин', 'jojo-avoe') . '</a></li>';
	echo '<li><a href="' . esc_url(home_url('/product-category/all')) . '">' . esc_html__('Каталог', 'jojo-avoe') . '</a></li>';
	echo '<li><a href="' . esc_url(home_url('/about')) . '">' . esc_html__('Про нас', 'jojo-avoe') . '</a></li>';
	echo '<li><a href="' . esc_url(home_url('/faq')) . '">' . esc_html__('Питання', 'jojo-avoe') . '</a></li>';
	echo '</ul>';
}

function jojo_avoe_is_woocommerce_active(): bool {
	return class_exists('WooCommerce');
}

function jojo_avoe_get_featured_products(int $limit = 6): array {
	if (! jojo_avoe_is_woocommerce_active()) {
		return array();
	}

	$query = new WP_Query(array(
		'post_type'      => 'product',
		'posts_per_page' => $limit,
		'post_status'    => 'publish',
		'tax_query'      => array(
			array(
				'taxonomy' => 'product_visibility',
				'field'    => 'name',
				'terms'    => array('featured'),
			),
		),
	));

	return $query->posts;
}

function jojo_avoe_get_placeholder_products(): array {
	return array(
		array(
			'title' => __('Сумка Muse Mini', 'jojo-avoe'),
			'price' => '4 890',
			'badge' => __('New', 'jojo-avoe'),
		),
		array(
			'title' => __('Шкіряний тоут Linea', 'jojo-avoe'),
			'price' => '5 690',
			'badge' => __('Top', 'jojo-avoe'),
		),
		array(
			'title' => __('Клатч Velvet Form', 'jojo-avoe'),
			'price' => '3 790',
			'badge' => __('Sale', 'jojo-avoe'),
		),
		array(
			'title' => __('Ремінь Atelier', 'jojo-avoe'),
			'price' => '1 490',
			'badge' => __('Popular', 'jojo-avoe'),
		),
	);
}

function jojo_avoe_after_theme_switch(): void {
	if (! function_exists('set_theme_mod')) {
		return;
	}

	$mods = jojo_avoe_default_mods();
	foreach ($mods as $key => $value) {
		if ('' === (string) get_theme_mod('jojo_avoe_' . $key, '')) {
			set_theme_mod('jojo_avoe_' . $key, $value);
		}
	}
}
add_action('after_switch_theme', 'jojo_avoe_after_theme_switch');

function jojo_avoe_reviews(): array {
	return array(
		array(
			'name' => 'Марія',
			'text' => __('Матеріал виглядає дуже дорого, а доставка приїхала швидше, ніж очікувала. Сайт простий і дуже зручний.', 'jojo-avoe'),
		),
		array(
			'name' => 'Ірина',
			'text' => __('Сподобалось, що товарні сторінки не перевантажені. Все видно одразу: фото, колір, доставка, повернення.', 'jojo-avoe'),
		),
		array(
			'name' => 'Олена',
			'text' => __('Замовлення оформлюється швидко, а сумка вживу виглядає навіть краще, ніж на фото.', 'jojo-avoe'),
		),
	);
}

function jojo_avoe_faq_items(): array {
	return array(
		array(
			'question' => __('Чи є доставка Новою поштою?', 'jojo-avoe'),
			'answer'   => __('Так. Магазин спроектований під інтеграцію з Новою поштою: місто, відділення або поштомат, а також майбутнє автоматичне створення ТТН.', 'jojo-avoe'),
		),
		array(
			'question' => __('Чи можна повернути товар?', 'jojo-avoe'),
			'answer'   => __('Так, протягом 14 днів за умови збереження товарного вигляду та комплектації.', 'jojo-avoe'),
		),
		array(
			'question' => __('Як перевіряється наявність?', 'jojo-avoe'),
			'answer'   => __('Тема підготовлена під синхронізацію з обліком і CRM, тому актуальні залишки та статуси можуть підтягуватися автоматично.', 'jojo-avoe'),
		),
	);
}

function jojo_avoe_cart_count(): int {
	if (function_exists('WC') && WC()->cart) {
		return (int) WC()->cart->get_cart_contents_count();
	}
	return 0;
}

function jojo_avoe_cart_total(): string {
	if (function_exists('WC') && WC()->cart) {
		return wp_kses_post(WC()->cart->get_cart_total());
	}
	return '0 ₴';
}

function jojo_avoe_cart_url(): string {
	return function_exists('wc_get_cart_url') ? wc_get_cart_url() : home_url('/cart');
}

function jojo_avoe_checkout_url(): string {
	return function_exists('wc_get_checkout_url') ? wc_get_checkout_url() : home_url('/checkout');
}

function jojo_avoe_shop_url(): string {
	return function_exists('wc_get_page_permalink') ? wc_get_page_permalink('shop') : home_url('/shop');
}

function jojo_avoe_theme_logo(): string {
	if (has_custom_logo()) {
		return wp_kses_post(get_custom_logo());
	}

	return '<a class="brand-mark" href="' . esc_url(home_url('/')) . '"><span class="brand-mark__icon">A</span><span class="brand-mark__text">AVOE</span></a>';
}

function jojo_avoe_before_main_content(): void {
	echo '<main id="primary" class="site-main">';
	echo '<div class="container woocommerce-shell">';
}
add_action('woocommerce_before_main_content', 'jojo_avoe_before_main_content', 5);

function jojo_avoe_after_main_content(): void {
	echo '</div>';
	echo '</main>';
}
add_action('woocommerce_after_main_content', 'jojo_avoe_after_main_content', 50);

function jojo_avoe_remove_woocommerce_wrappers(): void {
	remove_action('woocommerce_before_main_content', 'woocommerce_output_content_wrapper', 10);
	remove_action('woocommerce_after_main_content', 'woocommerce_output_content_wrapper_end', 10);
}
add_action('wp', 'jojo_avoe_remove_woocommerce_wrappers');

function jojo_avoe_cart_fragment(array $fragments): array {
	ob_start();
	?>
	<span class="cart-pill__count"><?php echo esc_html((string) jojo_avoe_cart_count()); ?></span>
	<?php
	$fragments['.cart-pill__count'] = ob_get_clean();

	ob_start();
	?>
	<div class="mini-cart__total-value"><?php echo wp_kses_post(jojo_avoe_cart_total()); ?></div>
	<?php
	$fragments['.mini-cart__total-value'] = ob_get_clean();

	return $fragments;
}
add_filter('woocommerce_add_to_cart_fragments', 'jojo_avoe_cart_fragment');

function jojo_avoe_shop_columns(): int {
	return wp_is_mobile() ? 2 : 4;
}
add_filter('loop_shop_columns', 'jojo_avoe_shop_columns');

function jojo_avoe_products_per_page(): int {
	return 12;
}
add_filter('loop_shop_per_page', 'jojo_avoe_products_per_page');

function jojo_avoe_checkout_fields(array $fields): array {
	if (isset($fields['billing']['billing_city'])) {
		$fields['billing']['billing_city']['priority'] = 55;
	}

	if (isset($fields['billing']['billing_address_1'])) {
		$fields['billing']['billing_address_1']['label']       = __('Відділення / поштомат', 'jojo-avoe');
		$fields['billing']['billing_address_1']['placeholder'] = __('Вкажіть відділення або поштомат', 'jojo-avoe');
	}

	if (isset($fields['billing']['billing_state'])) {
		unset($fields['billing']['billing_state']);
	}

	return $fields;
}
add_filter('woocommerce_checkout_fields', 'jojo_avoe_checkout_fields');

function jojo_avoe_single_tabs(array $tabs): array {
	if (isset($tabs['additional_information'])) {
		unset($tabs['additional_information']);
	}
	return $tabs;
}
add_filter('woocommerce_product_tabs', 'jojo_avoe_single_tabs');
