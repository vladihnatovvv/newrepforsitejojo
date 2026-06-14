<?php
/**
 * Front page template.
 *
 * @package JoJoAVOE
 */

get_header();

$featured_products = jojo_avoe_get_featured_products(4);
$placeholder_items = jojo_avoe_get_placeholder_products();
$reviews           = jojo_avoe_reviews();
$faq_items         = jojo_avoe_faq_items();
?>
<main id="primary" class="site-main">
	<section class="hero">
		<div class="container hero__grid">
			<div class="hero__content">
				<span class="hero__eyebrow"><?php echo esc_html(jojo_avoe_get_mod('hero_eyebrow')); ?></span>
				<h1><?php echo esc_html(jojo_avoe_get_mod('hero_title')); ?></h1>
				<p><?php echo esc_html(jojo_avoe_get_mod('hero_text')); ?></p>
				<div class="hero__actions">
					<a class="button" href="<?php echo esc_url(jojo_avoe_shop_url()); ?>"><?php esc_html_e('Переглянути колекцію', 'jojo-avoe'); ?></a>
					<a class="button button--ghost" href="<?php echo esc_url(home_url('/about')); ?>"><?php esc_html_e('Дізнатися більше', 'jojo-avoe'); ?></a>
				</div>
			</div>
			<div class="hero__visual" aria-hidden="true">
				<div class="hero-bag hero-bag--large"></div>
				<div class="hero-bag hero-bag--small"></div>
			</div>
		</div>
	</section>

	<section class="stats">
		<div class="container stats__grid">
			<div class="stat-card"><strong>16+</strong><span><?php esc_html_e('Сумок у колекції', 'jojo-avoe'); ?></span></div>
			<div class="stat-card"><strong>5K+</strong><span><?php esc_html_e('Задоволених клієнтів', 'jojo-avoe'); ?></span></div>
			<div class="stat-card"><strong>48Г</strong><span><?php esc_html_e('Швидка доставка', 'jojo-avoe'); ?></span></div>
			<div class="stat-card"><strong>14</strong><span><?php esc_html_e('Днів на повернення', 'jojo-avoe'); ?></span></div>
		</div>
	</section>

	<section class="section">
		<div class="container section__head">
			<div>
				<span class="section__eyebrow"><?php esc_html_e('Колекція', 'jojo-avoe'); ?></span>
				<h2><?php esc_html_e('Колекція жіночих сумок та аксесуарів', 'jojo-avoe'); ?></h2>
			</div>
			<a class="section__link" href="<?php echo esc_url(jojo_avoe_shop_url()); ?>"><?php esc_html_e('Усі товари', 'jojo-avoe'); ?></a>
		</div>
		<div class="container product-grid">
			<?php if (! empty($featured_products)) : ?>
				<?php foreach ($featured_products as $post) : setup_postdata($post); ?>
					<?php get_template_part('template-parts/product', 'card', array('product_id' => get_the_ID())); ?>
				<?php endforeach; wp_reset_postdata(); ?>
			<?php else : ?>
				<?php foreach ($placeholder_items as $index => $item) : ?>
					<article class="product-card">
						<div class="product-card__media product-card__media--<?php echo esc_attr((string) (($index % 4) + 1)); ?>">
							<span class="product-card__badge"><?php echo esc_html($item['badge']); ?></span>
						</div>
						<div class="product-card__content">
							<h3><?php echo esc_html($item['title']); ?></h3>
							<div class="product-card__price"><?php echo esc_html($item['price']); ?> ₴</div>
							<a class="product-card__link" href="<?php echo esc_url(jojo_avoe_shop_url()); ?>"><?php esc_html_e('Переглянути', 'jojo-avoe'); ?></a>
						</div>
					</article>
				<?php endforeach; ?>
			<?php endif; ?>
		</div>
	</section>

	<section class="section section--highlight">
		<div class="container section__head">
			<div>
				<span class="section__eyebrow"><?php esc_html_e('Відгуки', 'jojo-avoe'); ?></span>
				<h2><?php esc_html_e('Клієнтам подобається сервіс і чистий досвід покупки', 'jojo-avoe'); ?></h2>
			</div>
			<div class="rating-pill">4.9★ <?php esc_html_e('на основі 5000+ відгуків', 'jojo-avoe'); ?></div>
		</div>
		<div class="container review-slider js-review-slider">
			<?php foreach ($reviews as $review) : ?>
				<article class="review-card">
					<div class="review-card__stars">★★★★★</div>
					<p><?php echo esc_html($review['text']); ?></p>
					<strong><?php echo esc_html($review['name']); ?></strong>
				</article>
			<?php endforeach; ?>
		</div>
	</section>

	<section class="section">
		<div class="container section__head section__head--center">
			<span class="section__eyebrow"><?php esc_html_e('Особливості', 'jojo-avoe'); ?></span>
			<h2><?php esc_html_e('Все, що робить магазин сильним для продажу', 'jojo-avoe'); ?></h2>
		</div>
		<div class="container features-grid">
			<article class="feature-card"><h3><?php esc_html_e('Преміум якість', 'jojo-avoe'); ?></h3><p><?php esc_html_e('Матеріали, фурнітура і конструкція підібрані під довгий термін служби.', 'jojo-avoe'); ?></p></article>
			<article class="feature-card"><h3><?php esc_html_e('Швидка доставка', 'jojo-avoe'); ?></h3><p><?php esc_html_e('Структура магазину вже підготовлена під Нову пошту та швидке оформлення.', 'jojo-avoe'); ?></p></article>
			<article class="feature-card"><h3><?php esc_html_e('Легке повернення', 'jojo-avoe'); ?></h3><p><?php esc_html_e('Прозорі умови повернення, винесені в окремий інформаційний блок.', 'jojo-avoe'); ?></p></article>
			<article class="feature-card"><h3><?php esc_html_e('CRM і облік', 'jojo-avoe'); ?></h3><p><?php esc_html_e('Тема спроектована так, щоб підключення keyCRM і Torgsoft не ламало UX.', 'jojo-avoe'); ?></p></article>
		</div>
	</section>

	<section class="section section--split">
		<div class="container about-grid">
			<div class="about-grid__visual" aria-hidden="true"></div>
			<div class="about-grid__content">
				<span class="section__eyebrow"><?php echo esc_html(jojo_avoe_get_mod('about_title')); ?></span>
				<h2><?php esc_html_e('Сайт, який продає без візуального шуму', 'jojo-avoe'); ?></h2>
				<p><?php echo esc_html(jojo_avoe_get_mod('about_text')); ?></p>
				<div class="about-metrics">
					<div><strong>SKU-ready</strong><span><?php esc_html_e('Структура під артикул, залишок і варіації', 'jojo-avoe'); ?></span></div>
					<div><strong>Woo + CRM</strong><span><?php esc_html_e('Підготовка до статусів, синхронізацій і доставок', 'jojo-avoe'); ?></span></div>
				</div>
			</div>
		</div>
	</section>

	<section class="section">
		<div class="container section__head section__head--center">
			<span class="section__eyebrow"><?php esc_html_e('FAQ', 'jojo-avoe'); ?></span>
			<h2><?php esc_html_e('Часті запитання покупців', 'jojo-avoe'); ?></h2>
		</div>
		<div class="container faq-list">
			<?php foreach ($faq_items as $item) : ?>
				<details class="faq-item">
					<summary><?php echo esc_html($item['question']); ?></summary>
					<p><?php echo esc_html($item['answer']); ?></p>
				</details>
			<?php endforeach; ?>
		</div>
	</section>
</main>
<?php
get_footer();

