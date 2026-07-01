<?php
/**
 * Custom product loop card.
 *
 * @package JoJoAVOE
 */

defined('ABSPATH') || exit;

global $product;

if (! $product || ! $product->is_visible()) {
	return;
}

$badges = array();
if ($product->is_featured()) {
	$badges[] = __('Хіт', 'jojo-avoe');
}
if ($product->is_on_sale()) {
	$badges[] = __('Акція', 'jojo-avoe');
}
if (empty($badges) && $product->get_date_created()) {
	$diff = time() - $product->get_date_created()->getTimestamp();
	if ($diff < MONTH_IN_SECONDS * 3) {
		$badges[] = __('Нове', 'jojo-avoe');
	}
}
?>
<li <?php wc_product_class('product-card', $product); ?>>
	<a class="product-card__media" href="<?php the_permalink(); ?>">
		<?php if ($product->get_image_id()) : ?>
			<?php echo wp_kses_post($product->get_image('large')); ?>
		<?php else : ?>
			<div class="product-card__media product-card__media--1"></div>
		<?php endif; ?>
		<?php if (! empty($badges)) : ?>
			<span class="product-card__badge"><?php echo esc_html($badges[0]); ?></span>
		<?php endif; ?>
	</a>
	<div class="product-card__content">
		<h3><a href="<?php the_permalink(); ?>"><?php echo esc_html($product->get_name()); ?></a></h3>
		<div class="product-card__price"><?php echo wp_kses_post($product->get_price_html()); ?></div>
		<a class="product-card__link" href="<?php the_permalink(); ?>"><?php esc_html_e('Переглянути', 'jojo-avoe'); ?></a>
	</div>
</li>
