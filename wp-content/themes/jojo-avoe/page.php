<?php
/**
 * Default page template.
 *
 * @package JoJoAVOE
 */

get_header();
?>
<main id="primary" class="site-main page-shell">
	<section class="page-hero">
		<div class="container">
			<p class="section__eyebrow"><?php echo esc_html(get_the_title()); ?></p>
			<h1><?php the_title(); ?></h1>
		</div>
	</section>

	<div class="container prose-shell">
		<?php while (have_posts()) : the_post(); ?>
			<article <?php post_class('prose-article'); ?>>
				<?php the_content(); ?>
			</article>
		<?php endwhile; ?>
	</div>
</main>
<?php
get_footer();

