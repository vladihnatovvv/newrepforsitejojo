<?php
/**
 * WooCommerce wrapper template.
 *
 * @package JoJoAVOE
 */

get_header();
?>
<section class="page-hero page-hero--shop">
	<div class="container">
		<p class="section__eyebrow"><?php esc_html_e('Магазин', 'jojo-avoe'); ?></p>
		<h1><?php woocommerce_page_title(); ?></h1>
	</div>
</section>
<?php woocommerce_content(); ?>
<?php
get_footer();

