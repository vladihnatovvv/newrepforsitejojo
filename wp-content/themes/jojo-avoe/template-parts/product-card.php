<?php
/**
 * Reusable product card.
 *
 * @package JoJoAVOE
 */

$product_id = $args['product_id'] ?? get_the_ID();
$product    = jojo_avoe_is_woocommerce_active() ? wc_get_product($product_id) : null;

if (! $product) {
	return;
}
?>
<article <?php wc_product_class('product-card', $product); ?>>
	<a class="product-card__media" href="<?php the_permalink($product_id); ?>">
		<?php if (has_post_thumbnail($product_id)) : ?>
			<?php echo get_the_post_thumbnail($product_id, 'large'); ?>
		<?php else : ?>
			<div class="product-card__media product-card__media--1"></div>
		<?php endif; ?>
	</a>
	<div class="product-card__content">
		<h3><a href="<?php the_permalink($product_id); ?>"><?php echo esc_html($product->get_name()); ?></a></h3>
		<div class="product-card__price"><?php echo wp_kses_post($product->get_price_html()); ?></div>
		<a class="product-card__link" href="<?php the_permalink($product_id); ?>"><?php esc_html_e('Переглянути', 'jojo-avoe'); ?></a>
	</div>
</article>

