<?php
/**
 * Fallback template.
 *
 * @package JoJoAVOE
 */

get_header();
?>
<main id="primary" class="site-main page-shell">
	<div class="container prose-shell">
		<?php if (have_posts()) : ?>
			<?php while (have_posts()) : the_post(); ?>
				<article <?php post_class('prose-article'); ?>>
					<h1><?php the_title(); ?></h1>
					<?php the_content(); ?>
				</article>
			<?php endwhile; ?>
		<?php else : ?>
			<h1><?php esc_html_e('Контент готується', 'jojo-avoe'); ?></h1>
		<?php endif; ?>
	</div>
</main>
<?php
get_footer();

