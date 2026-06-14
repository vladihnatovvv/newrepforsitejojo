<?php
/**
 * Footer template.
 *
 * @package JoJoAVOE
 */
?>
	<footer class="site-footer">
		<div class="container site-footer__grid">
			<div class="site-footer__brand">
				<div class="site-footer__logo">AVOE</div>
				<p><?php echo esc_html(jojo_avoe_get_mod('footer_tagline')); ?></p>
			</div>

			<div class="site-footer__links">
				<h3><?php esc_html_e('Швидкі посилання', 'jojo-avoe'); ?></h3>
				<?php
				wp_nav_menu(array(
					'theme_location' => 'footer',
					'container'      => false,
					'menu_class'     => 'footer-menu',
					'fallback_cb'    => 'jojo_avoe_menu_fallback',
				));
				?>
			</div>

			<div class="site-footer__contacts">
				<h3><?php esc_html_e("Зв'яжіться з нами", 'jojo-avoe'); ?></h3>
				<a href="tel:<?php echo esc_attr(str_replace(' ', '', jojo_avoe_get_mod('phone'))); ?>"><?php echo esc_html(jojo_avoe_get_mod('phone')); ?></a>
				<a href="mailto:<?php echo esc_attr(jojo_avoe_get_mod('email')); ?>"><?php echo esc_html(jojo_avoe_get_mod('email')); ?></a>
				<span><?php echo esc_html(jojo_avoe_get_mod('shipping_note')); ?></span>
			</div>
		</div>
		<div class="container site-footer__bottom">
			<p>© <?php echo esc_html(date_i18n('Y')); ?> AVOE. <?php esc_html_e('Всі права захищені.', 'jojo-avoe'); ?></p>
		</div>
	</footer>
</div>
<?php wp_footer(); ?>
</body>
</html>

