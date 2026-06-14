<?php
/**
 * Single product template.
 *
 * @package JoJoAVOE
 */

defined('ABSPATH') || exit;

get_header('shop');
?>
<section class="page-hero page-hero--compact">
	<div class="container">
		<?php woocommerce_breadcrumb(); ?>
	</div>
</section>
<?php
do_action('woocommerce_before_main_content');

while (have_posts()) {
	the_post();
	wc_get_template_part('content', 'single-product');
}

do_action('woocommerce_after_main_content');
get_footer('shop');

