document.addEventListener("DOMContentLoaded", () => {
  const shell = document.documentElement;
  const mobileMenu = document.getElementById("mobile-menu");
  const menuToggles = document.querySelectorAll(".js-menu-toggle");
  const miniCart = document.getElementById("mini-cart-panel");
  const cartToggles = document.querySelectorAll(".js-cart-toggle");
  const store = window.JOJO_STORE || null;
  const page = document.body.dataset.page || "";

  const toggleVisibility = (node, stateClass, expanded) => {
    if (!node) return false;
    const isOpen = expanded ?? !node.classList.contains(stateClass);
    node.classList.toggle(stateClass, isOpen);
    node.hidden = !isOpen;
    shell.classList.toggle("has-overlay", isOpen);
    return isOpen;
  };

  menuToggles.forEach((toggle) => {
    toggle.addEventListener("click", () => {
      const isOpen = toggleVisibility(mobileMenu, "is-open");
      menuToggles.forEach((button) => {
        button.setAttribute("aria-expanded", String(Boolean(isOpen)));
      });
    });
  });

  cartToggles.forEach((toggle) => {
    toggle.addEventListener("click", () => {
      if (!miniCart) return;
      const isOpen = !miniCart.classList.contains("is-open");
      miniCart.classList.toggle("is-open", isOpen);
      miniCart.setAttribute("aria-hidden", String(!isOpen));
      shell.classList.toggle("has-overlay", isOpen);
      const control = document.querySelector(".cart-pill");
      if (control) {
        control.setAttribute("aria-expanded", String(isOpen));
      }
    });
  });

  const slider = document.querySelector(".js-review-slider");
  if (slider && window.matchMedia("(max-width: 767px)").matches) {
    slider.setAttribute("tabindex", "0");
  }

  if (!store) return;

  const map = new Map(store.products.map((product) => [product.slug, product]));
  const cartItems = (store.sampleCart || [])
    .map((item) => ({ ...item, product: map.get(item.slug) }))
    .filter((item) => item.product);

  const formatPrice = (value) => `${Number(value).toLocaleString("uk-UA")} ₴`;
  const escapeHtml = (value) =>
    String(value)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;");

  const renderProductCard = (product, { compact = false } = {}) => `
    <article class="product-card${compact ? "" : " product-card--editorial"}">
      <a class="product-card__media" href="./product.html?product=${encodeURIComponent(product.slug)}">
        <img src="${product.images[0]}" alt="${escapeHtml(product.name)}" />
      </a>
      <div class="product-card__content">
        <span class="product-card__badge product-card__badge--soft">${escapeHtml(product.badge)}</span>
        <h3><a href="./product.html?product=${encodeURIComponent(product.slug)}">${escapeHtml(product.name)}</a></h3>
        <div class="product-card__price">${formatPrice(product.price)} <small>${escapeHtml(product.material)}</small></div>
        <a class="product-card__link" href="./product.html?product=${encodeURIComponent(product.slug)}">View product</a>
      </div>
    </article>
  `;

  const renderMiniCart = () => {
    const list = document.querySelector("[data-mini-cart-items]");
    const total = document.querySelector(".mini-cart__total-value");
    const countNode = document.querySelector(".cart-pill__count");
    if (list) {
      list.innerHTML = cartItems
        .map(
          ({ product, quantity }) => `
            <li class="woocommerce-mini-cart-item">
              <img class="mini-cart-item__thumb" src="${product.images[0]}" alt="${escapeHtml(product.name)}" />
              <div><strong>${escapeHtml(product.name)}</strong><div>${quantity} × ${formatPrice(product.price)}</div></div>
            </li>
          `
        )
        .join("");
    }
    const itemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
    const orderTotal = cartItems.reduce((sum, item) => sum + item.quantity * item.product.price, 0);
    if (countNode) countNode.textContent = String(itemCount);
    if (total) total.textContent = formatPrice(orderTotal);
  };

  const renderHome = () => {
    const featuredNode = document.querySelector("[data-featured-products]");
    if (!featuredNode) return;
    const featured = (store.featuredSlugs || [])
      .map((slug) => map.get(slug))
      .filter(Boolean);
    featuredNode.innerHTML = featured.map((product) => renderProductCard(product)).join("");
  };

  const renderCatalog = () => {
    const catalogNode = document.querySelector("[data-catalog-grid]");
    const categoryNode = document.querySelector("[data-category-nav]");
    const countNode = document.querySelector("[data-catalog-count]");
    if (catalogNode) {
      catalogNode.innerHTML = store.products.map((product) => renderProductCard(product, { compact: true })).join("");
    }
    if (countNode) {
      countNode.textContent = `Показано 1–${store.products.length} з ${store.products.length} результатів`;
    }
    if (categoryNode) {
      categoryNode.innerHTML = store.categories
        .map(
          (group) => `
            <div class="catalog-tree__group">
              <span class="catalog-tree__parent">${escapeHtml(group.name)}</span>
              <div class="catalog-tree__children">
                ${group.children
                  .map(
                    (child) => `
                      <a class="catalog-tree__child${child.active ? " is-active" : ""}" href="./catalog.html">${escapeHtml(child.name)}</a>
                    `
                  )
                  .join("")}
              </div>
            </div>
          `
        )
        .join("");
    }
  };

  const renderProduct = () => {
    const params = new URLSearchParams(window.location.search);
    const slug = params.get("product") || document.body.dataset.product || store.featuredSlugs[0];
    const product = map.get(slug) || store.products[0];
    const title = document.querySelector("[data-product-title]");
    const price = document.querySelector("[data-product-price]");
    const summary = document.querySelector("[data-product-summary]");
    const details = document.querySelector("[data-product-details]");
    const colors = document.querySelector("[data-product-colors]");
    const gallery = document.querySelector("[data-product-gallery]");
    const breadcrumb = document.querySelector("[data-product-breadcrumb]");

    if (title) title.textContent = product.name;
    if (price) price.textContent = formatPrice(product.price);
    if (summary) summary.textContent = product.description;
    if (details) {
      details.innerHTML = `
        <p>Матеріал: ${escapeHtml(product.material)}.</p>
        <p>Розмір: ${escapeHtml(product.size)}.</p>
        <p>Посадка: ${escapeHtml(product.fit)}.</p>
      `;
    }
    if (breadcrumb) breadcrumb.textContent = `Головна / Каталог / Панами / ${product.name}`;
    if (colors) {
      colors.innerHTML = product.colors
        .map((color) => `<option>${escapeHtml(color)}</option>`)
        .join("");
    }
    if (gallery) {
      gallery.innerHTML = `
        <div class="product-gallery__lead">
          <img src="${product.images[0]}" alt="${escapeHtml(product.name)}" />
        </div>
        <div class="product-gallery__thumbs">
          ${product.images
            .map(
              (image, index) => `
                <button class="product-gallery__thumb${index === 0 ? " is-active" : ""}" type="button" data-gallery-thumb data-image="${image}">
                  <img src="${image}" alt="${escapeHtml(product.name)} ${index + 1}" />
                </button>
              `
            )
            .join("")}
        </div>
      `;

      const leadImage = gallery.querySelector(".product-gallery__lead img");
      gallery.querySelectorAll("[data-gallery-thumb]").forEach((thumb) => {
        thumb.addEventListener("click", () => {
          gallery.querySelectorAll("[data-gallery-thumb]").forEach((node) => node.classList.remove("is-active"));
          thumb.classList.add("is-active");
          if (leadImage) {
            leadImage.src = thumb.dataset.image;
          }
        });
      });
    }
  };

  const renderCart = () => {
    const cartTable = document.querySelector("[data-cart-items]");
    const totals = document.querySelectorAll("[data-order-total]");
    if (cartTable) {
      cartTable.innerHTML = cartItems
        .map(
          ({ product, quantity }) => `
            <tr>
              <td class="product-name" data-title="Товар">${escapeHtml(product.name)}</td>
              <td data-title="Ціна">${formatPrice(product.price)}</td>
              <td data-title="Кількість"><input class="qty" type="number" value="${quantity}" min="1" /></td>
              <td data-title="Разом">${formatPrice(product.price * quantity)}</td>
            </tr>
          `
        )
        .join("");
    }
    const orderTotal = formatPrice(cartItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0));
    totals.forEach((node) => {
      node.textContent = orderTotal;
    });
  };

  const renderCheckout = () => {
    const orderRows = document.querySelector("[data-checkout-items]");
    const totalNode = document.querySelector("[data-checkout-total]");
    if (orderRows) {
      orderRows.innerHTML = cartItems
        .map(
          ({ product, quantity }) => `
            <tr>
              <td data-title="Товар">${escapeHtml(product.name)} × ${quantity}</td>
              <td data-title="Сума">${formatPrice(product.price * quantity)}</td>
            </tr>
          `
        )
        .join("");
    }
    if (totalNode) {
      totalNode.textContent = formatPrice(cartItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0));
    }
  };

  renderMiniCart();

  if (page === "home") renderHome();
  if (page === "catalog") renderCatalog();
  if (page === "product") renderProduct();
  if (page === "cart") renderCart();
  if (page === "checkout") renderCheckout();
});
