<?php
/**
 * Custom single product content wrapper.
 *
 * @package JoJoAVOE
 */

defined('ABSPATH') || exit;

global $product;
?>
<article id="product-<?php the_ID(); ?>" <?php wc_product_class('product product--single-shell', $product); ?>>
	<div class="product__gallery-shell">
		<?php
		do_action('woocommerce_before_single_product_summary');
		?>
	</div>

	<div class="product__summary-shell">
		<?php
		do_action('woocommerce_single_product_summary');
		?>

		<div class="product-extra-panels">
			<div class="product-extra-panel">
				<strong><?php esc_html_e('Доставка', 'jojo-avoe'); ?></strong>
				<p><?php esc_html_e('Нова пошта 1-3 дні, місто та відділення можна буде вибрати на checkout.', 'jojo-avoe'); ?></p>
			</div>
			<div class="product-extra-panel">
				<strong><?php esc_html_e('Повернення', 'jojo-avoe'); ?></strong>
				<p><?php esc_html_e('Повернення протягом 14 днів за стандартними умовами магазину.', 'jojo-avoe'); ?></p>
			</div>
			<div class="product-extra-panel">
				<strong><?php esc_html_e('Синхронізація', 'jojo-avoe'); ?></strong>
				<p><?php esc_html_e('Картка підготовлена під SKU, залишки та майбутні інтеграції з CRM і обліком.', 'jojo-avoe'); ?></p>
			</div>
		</div>
	</div>
</article>

<?php do_action('woocommerce_after_single_product_summary'); ?>

