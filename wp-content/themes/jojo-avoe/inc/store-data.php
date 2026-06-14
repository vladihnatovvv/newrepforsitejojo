<?php
/**
 * Shared store category data and helpers.
 *
 * @package JoJoAVOE
 */

function jojo_avoe_store_categories(): array {
	return array(
		array(
			'name'     => __('Головні убори', 'jojo-avoe'),
			'slug'     => 'golovni-ubory',
			'children' => array(
				array('name' => __('Кепі', 'jojo-avoe'), 'slug' => 'kepi'),
				array('name' => __('Кепі-реглан', 'jojo-avoe'), 'slug' => 'kepi-reglan'),
				array('name' => __('Морячка', 'jojo-avoe'), 'slug' => 'moryachka'),
				array('name' => __('Кепки', 'jojo-avoe'), 'slug' => 'kepky'),
				array('name' => __('Солома', 'jojo-avoe'), 'slug' => 'soloma'),
				array('name' => __('Кепка-докерка', 'jojo-avoe'), 'slug' => 'kepka-dokerka'),
				array('name' => __('Панами', 'jojo-avoe'), 'slug' => 'panamy'),
			),
		),
		array(
			'name'     => __('Аксесуари', 'jojo-avoe'),
			'slug'     => 'aksesuary',
			'children' => array(
				array('name' => __('Футляри', 'jojo-avoe'), 'slug' => 'futlyary'),
				array('name' => __('Хустки', 'jojo-avoe'), 'slug' => 'khustky'),
				array('name' => __('Окуляри', 'jojo-avoe'), 'slug' => 'okulyary'),
			),
		),
		array(
			'name'     => __('Сумки', 'jojo-avoe'),
			'slug'     => 'sumky',
			'children' => array(),
		),
		array(
			'name'     => __('SALE', 'jojo-avoe'),
			'slug'     => 'sale',
			'children' => array(),
		),
	);
}

function jojo_avoe_flatten_categories(array $categories = null): array {
	$categories = $categories ?? jojo_avoe_store_categories();
	$flat       = array();

	foreach ($categories as $category) {
		$flat[] = array(
			'name'     => $category['name'],
			'slug'     => $category['slug'],
			'is_group' => true,
		);

		if (! empty($category['children'])) {
			foreach ($category['children'] as $child) {
				$flat[] = array(
					'name'     => $child['name'],
					'slug'     => $child['slug'],
					'parent'   => $category['slug'],
					'is_group' => false,
				);
			}
		}
	}

	return $flat;
}

function jojo_avoe_category_url(string $slug): string {
	if (function_exists('get_term_by') && function_exists('get_term_link')) {
		$term = get_term_by('slug', $slug, 'product_cat');
		if ($term && ! is_wp_error($term)) {
			return (string) get_term_link($term);
		}
	}

	return add_query_arg('product_cat', $slug, jojo_avoe_shop_url());
}

function jojo_avoe_render_category_nav(): void {
	$categories = jojo_avoe_store_categories();
	$current    = function_exists('is_product_category') && is_product_category() ? get_queried_object() : null;
	?>
	<nav class="catalog-tree" aria-label="<?php esc_attr_e('Catalog categories', 'jojo-avoe'); ?>">
		<?php foreach ($categories as $category) : ?>
			<div class="catalog-tree__group">
				<a class="catalog-tree__parent<?php echo ($current && isset($current->slug) && $current->slug === $category['slug']) ? ' is-active' : ''; ?>" href="<?php echo esc_url(jojo_avoe_category_url($category['slug'])); ?>">
					<?php echo esc_html($category['name']); ?>
				</a>
				<?php if (! empty($category['children'])) : ?>
					<div class="catalog-tree__children">
						<?php foreach ($category['children'] as $child) : ?>
							<a class="catalog-tree__child<?php echo ($current && isset($current->slug) && $current->slug === $child['slug']) ? ' is-active' : ''; ?>" href="<?php echo esc_url(jojo_avoe_category_url($child['slug'])); ?>">
								<?php echo esc_html($child['name']); ?>
							</a>
						<?php endforeach; ?>
					</div>
				<?php endif; ?>
			</div>
		<?php endforeach; ?>
	</nav>
	<?php
}

