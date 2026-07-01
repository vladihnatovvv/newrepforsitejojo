<?php
/**
 * Site header.
 *
 * @package JoJoAVOE
 */
?><!DOCTYPE html>
<html <?php language_attributes(); ?>>
<head>
	<meta charset="<?php bloginfo('charset'); ?>">
	<meta name="viewport" content="width=device-width, initial-scale=1">
	<?php wp_head(); ?>
</head>
<body <?php body_class(); ?>>
<?php wp_body_open(); ?>
<div class="site-shell">
	<header class="site-header">
		<div class="container site-header__row">
			<div class="site-header__brand">
				<?php echo jojo_avoe_theme_logo(); ?>
			</div>

			<nav class="site-nav" aria-label="<?php esc_attr_e('Primary', 'jojo-avoe'); ?>">
				<?php
				wp_nav_menu(array(
					'theme_location' => 'primary',
					'container'      => false,
					'menu_class'     => 'menu',
					'fallback_cb'    => 'jojo_avoe_menu_fallback',
				));
				?>
			</nav>

			<div class="site-header__actions">
				<a class="header-contact" href="tel:<?php echo esc_attr(str_replace(' ', '', jojo_avoe_get_mod('phone'))); ?>">
					<?php echo esc_html(jojo_avoe_get_mod('phone')); ?>
				</a>
				<button class="cart-pill js-cart-toggle" type="button" aria-expanded="false" aria-controls="mini-cart-panel">
					<span class="cart-pill__label"><?php esc_html_e('Кошик', 'jojo-avoe'); ?></span>
					<span class="cart-pill__count"><?php echo esc_html((string) jojo_avoe_cart_count()); ?></span>
				</button>
				<button class="menu-toggle js-menu-toggle" type="button" aria-expanded="false" aria-controls="mobile-menu">
					<span></span><span></span><span></span>
				</button>
			</div>
		</div>

		<div id="mobile-menu" class="mobile-drawer" hidden>
			<div class="mobile-drawer__inner">
				<?php
				wp_nav_menu(array(
					'theme_location' => 'primary',
					'container'      => false,
					'menu_class'     => 'mobile-menu',
					'fallback_cb'    => 'jojo_avoe_menu_fallback',
				));
				?>
				<a class="mobile-drawer__contact" href="mailto:<?php echo esc_attr(jojo_avoe_get_mod('email')); ?>">
					<?php echo esc_html(jojo_avoe_get_mod('email')); ?>
				</a>
			</div>
		</div>
	</header>

	<aside id="mini-cart-panel" class="mini-cart" aria-hidden="true">
		<div class="mini-cart__overlay js-cart-toggle"></div>
		<div class="mini-cart__panel">
			<div class="mini-cart__header">
				<h2><?php esc_html_e('Ваш кошик', 'jojo-avoe'); ?></h2>
				<button class="mini-cart__close js-cart-toggle" type="button" aria-label="<?php esc_attr_e('Закрити кошик', 'jojo-avoe'); ?>">×</button>
			</div>
			<div class="mini-cart__body">
				<?php if (jojo_avoe_is_woocommerce_active()) : ?>
					<?php woocommerce_mini_cart(); ?>
				<?php else : ?>
					<p><?php esc_html_e('Підключіть WooCommerce, щоб побачити товари у кошику.', 'jojo-avoe'); ?></p>
				<?php endif; ?>
			</div>
			<div class="mini-cart__footer">
				<div class="mini-cart__total">
					<span><?php esc_html_e('Всього', 'jojo-avoe'); ?></span>
					<div class="mini-cart__total-value"><?php echo wp_kses_post(jojo_avoe_cart_total()); ?></div>
				</div>
				<div class="mini-cart__cta">
					<a class="button button--ghost" href="<?php echo esc_url(jojo_avoe_cart_url()); ?>"><?php esc_html_e('До кошика', 'jojo-avoe'); ?></a>
					<a class="button" href="<?php echo esc_url(jojo_avoe_checkout_url()); ?>"><?php esc_html_e('Оформити замовлення', 'jojo-avoe'); ?></a>
				</div>
			</div>
		</div>
	</aside>
