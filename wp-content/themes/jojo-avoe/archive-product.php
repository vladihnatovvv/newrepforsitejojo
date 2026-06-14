<?php
/**
 * Product archive template.
 *
 * @package JoJoAVOE
 */

defined('ABSPATH') || exit;

get_header('shop');
?>
<section class="page-hero page-hero--shop">
	<div class="container page-hero__split">
		<div>
			<p class="section__eyebrow"><?php esc_html_e('Каталог', 'jojo-avoe'); ?></p>
			<h1><?php woocommerce_page_title(); ?></h1>
			<p><?php esc_html_e('Чиста сітка товарів, фільтри, сортування і швидкий шлях до замовлення.', 'jojo-avoe'); ?></p>
		</div>
		<a class="button button--ghost" href="<?php echo esc_url(home_url('/faq')); ?>"><?php esc_html_e('Питання і доставка', 'jojo-avoe'); ?></a>
	</div>
</section>
<?php
do_action('woocommerce_before_main_content');
?>
<div class="shop-layout">
	<aside class="shop-layout__sidebar">
		<div class="shop-panel">
			<span class="section__eyebrow"><?php esc_html_e('Категорії', 'jojo-avoe'); ?></span>
			<?php jojo_avoe_render_category_nav(); ?>
		</div>
	</aside>
	<div class="shop-layout__content">
		<?php do_action('woocommerce_before_shop_loop'); ?>
		<?php if (woocommerce_product_loop()) : ?>
			<?php woocommerce_product_loop_start(); ?>

			<?php if (wc_get_loop_prop('total')) : ?>
				<?php while (have_posts()) : the_post(); ?>
					<?php wc_get_template_part('content', 'product'); ?>
				<?php endwhile; ?>
			<?php endif; ?>

			<?php woocommerce_product_loop_end(); ?>
			<?php do_action('woocommerce_after_shop_loop'); ?>
		<?php else : ?>
			<?php do_action('woocommerce_no_products_found'); ?>
		<?php endif; ?>
	</div>
</div>
<?php
do_action('woocommerce_after_main_content');
get_footer('shop');
