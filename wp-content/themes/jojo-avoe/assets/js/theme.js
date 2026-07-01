document.addEventListener("DOMContentLoaded", () => {
  const shell = document.documentElement;
  const mobileMenu = document.getElementById("mobile-menu");
  const menuToggles = document.querySelectorAll(".js-menu-toggle");
  const miniCart = document.getElementById("mini-cart-panel");
  const cartToggles = document.querySelectorAll(".js-cart-toggle");
  const cartButtons = document.querySelectorAll(".cart-pill");
  const closeButtons = document.querySelectorAll(".mini-cart__close");
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
    if (!toggle.getAttribute("aria-label")) {
      toggle.setAttribute("aria-label", "Відкрити меню");
    }
    toggle.addEventListener("click", () => {
      if (miniCart?.classList.contains("is-open")) {
        miniCart.classList.remove("is-open");
        miniCart.setAttribute("aria-hidden", "true");
        cartButtons.forEach((control) => {
          control.setAttribute("aria-expanded", "false");
          control.setAttribute("aria-label", "Відкрити кошик");
        });
      }
      const isOpen = toggleVisibility(mobileMenu, "is-open");
      menuToggles.forEach((button) => {
        button.setAttribute("aria-expanded", String(Boolean(isOpen)));
        button.setAttribute("aria-label", isOpen ? "Закрити меню" : "Відкрити меню");
      });
    });
  });

  cartButtons.forEach((button) => {
    if (!button.getAttribute("aria-label")) {
      button.setAttribute("aria-label", "Відкрити кошик");
    }
  });

  closeButtons.forEach((button) => {
    if (!button.getAttribute("aria-label")) {
      button.setAttribute("aria-label", "Закрити кошик");
    }
  });

  cartToggles.forEach((toggle) => {
    toggle.addEventListener("click", () => {
      if (!miniCart) return;
      if (mobileMenu?.classList.contains("is-open")) {
        toggleVisibility(mobileMenu, "is-open", false);
        menuToggles.forEach((button) => {
          button.setAttribute("aria-expanded", "false");
          button.setAttribute("aria-label", "Відкрити меню");
        });
      }
      const isOpen = !miniCart.classList.contains("is-open");
      miniCart.classList.toggle("is-open", isOpen);
      miniCart.setAttribute("aria-hidden", String(!isOpen));
      shell.classList.toggle("has-overlay", isOpen);
      cartButtons.forEach((control) => {
        control.setAttribute("aria-expanded", String(isOpen));
        control.setAttribute("aria-label", isOpen ? "Закрити кошик" : "Відкрити кошик");
      });
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

  const params = new URLSearchParams(window.location.search);
  const query = (params.get("q") || "").trim().toLowerCase();
  const sort = params.get("sort") || "default";

  const formatPrice = (value) => `${Number(value).toLocaleString("uk-UA")} ₴`;
  const escapeHtml = (value) =>
    String(value)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;");

  const buildProductUrl = (slug) => `./product.html?product=${encodeURIComponent(slug)}`;
  const buildSearchUrl = (term) => `./search.html?q=${encodeURIComponent(term)}`;

  const matchesQuery = (product, term) => {
    if (!term) return true;
    const haystack = [
      product.name,
      product.category,
      product.material,
      product.fit,
      product.size,
      product.description,
      ...(product.colors || [])
    ]
      .join(" ")
      .toLowerCase();
    return haystack.includes(term);
  };

  const sortProducts = (products, sortValue) => {
    const sorted = [...products];
    if (sortValue === "price-asc") sorted.sort((a, b) => a.price - b.price);
    if (sortValue === "price-desc") sorted.sort((a, b) => b.price - a.price);
    if (sortValue === "name-asc") sorted.sort((a, b) => a.name.localeCompare(b.name, "uk"));
    return sorted;
  };

  const filteredProducts = sortProducts(
    store.products.filter((product) => matchesQuery(product, query)),
    sort
  );

  const renderProductCard = (product, { compact = false } = {}) => `
    <article class="product-card${compact ? "" : " product-card--editorial"}">
      <a class="product-card__media" href="${buildProductUrl(product.slug)}">
        <img src="${product.images[0]}" alt="${escapeHtml(product.name)}" />
      </a>
      <div class="product-card__content">
        <span class="product-card__badge product-card__badge--soft">${escapeHtml(product.badge)}</span>
        <h3><a href="${buildProductUrl(product.slug)}">${escapeHtml(product.name)}</a></h3>
        <div class="product-card__price">${formatPrice(product.price)} <small>${escapeHtml(product.material)}</small></div>
        <div class="product-card__meta">${escapeHtml(product.fit)} · ${escapeHtml(product.size)}</div>
        <a class="product-card__link" href="${buildProductUrl(product.slug)}">Переглянути товар</a>
      </div>
    </article>
  `;

  const renderMiniCart = () => {
    const list = document.querySelector("[data-mini-cart-items]");
    const total = document.querySelector(".mini-cart__total-value");
    if (list) {
      list.innerHTML = cartItems
        .map(
          ({ product, quantity }) => `
            <li class="woocommerce-mini-cart-item">
              <img class="mini-cart-item__thumb" src="${product.images[0]}" alt="${escapeHtml(product.name)}" />
              <div>
                <strong>${escapeHtml(product.name)}</strong>
                <div>${quantity} × ${formatPrice(product.price)}</div>
              </div>
            </li>
          `
        )
        .join("");
    }
    const itemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
    const orderTotal = cartItems.reduce((sum, item) => sum + item.quantity * item.product.price, 0);
    document.querySelectorAll(".cart-pill__count").forEach((node) => {
      node.textContent = String(itemCount);
    });
    if (total) total.textContent = formatPrice(orderTotal);
  };

  const bindSearchForms = () => {
    document.querySelectorAll("[data-search-form]").forEach((form) => {
      form.addEventListener("submit", (event) => {
        event.preventDefault();
        const input = form.querySelector("[data-search-input]");
        const term = input ? input.value.trim() : "";
        window.location.href = buildSearchUrl(term);
      });
    });
  };

  const fillStoreMeta = () => {
    document.querySelectorAll("[data-store-phone]").forEach((node) => {
      node.textContent = store.meta.phone;
      if (node.tagName === "A") node.href = `tel:${store.meta.phone.replace(/\s+/g, "")}`;
    });
    document.querySelectorAll("[data-store-email]").forEach((node) => {
      node.textContent = store.meta.email;
      if (node.tagName === "A") node.href = `mailto:${store.meta.email}`;
    });
    document.querySelectorAll("[data-store-instagram]").forEach((node) => {
      node.textContent = store.meta.instagram;
    });
    document.querySelectorAll("[data-shipping-note]").forEach((node) => {
      node.textContent = store.meta.shippingNote;
    });
  };

  const renderFaq = () => {
    const node = document.querySelector("[data-faq-list]");
    if (!node) return;
    node.innerHTML = store.faq
      .map(
        (item) => `
          <details class="faq-item">
            <summary>${escapeHtml(item.question)}</summary>
            <p>${escapeHtml(item.answer)}</p>
          </details>
        `
      )
      .join("");
  };

  const renderHome = () => {
    const featuredNode = document.querySelector("[data-featured-products]");
    if (featuredNode) {
      const featured = (store.featuredSlugs || [])
        .map((slug) => map.get(slug))
        .filter(Boolean);
      featuredNode.innerHTML = featured.map((product) => renderProductCard(product)).join("");
    }
    renderFaq();
  };

  const renderCategoryNav = () => {
    const categoryNode = document.querySelector("[data-category-nav]");
    if (!categoryNode) return;
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
  };

  const renderCatalog = () => {
    const catalogNode = document.querySelector("[data-catalog-grid]");
    const countNode = document.querySelector("[data-catalog-count]");
    const emptyNode = document.querySelector("[data-catalog-empty]");
    const searchNode = document.querySelector("[data-catalog-query]");
    const sortSelect = document.querySelector("[data-sort-select]");
    const liveSearchInput = document.querySelector("[data-live-search-input]");

    if (sortSelect) sortSelect.value = sort;
    if (liveSearchInput) liveSearchInput.value = query;
    if (searchNode) searchNode.textContent = query;

    if (catalogNode) {
      catalogNode.innerHTML = filteredProducts.map((product) => renderProductCard(product, { compact: true })).join("");
    }
    if (countNode) {
      countNode.textContent = `Показано ${filteredProducts.length} з ${store.products.length} товарів`;
    }
    if (emptyNode) {
      emptyNode.hidden = filteredProducts.length > 0;
    }

    if (sortSelect) {
      sortSelect.addEventListener("change", () => {
        const next = new URL(window.location.href);
        next.searchParams.set("sort", sortSelect.value);
        if (!liveSearchInput?.value.trim()) {
          next.searchParams.delete("q");
        }
        window.location.href = next.toString();
      });
    }

    if (liveSearchInput) {
      liveSearchInput.addEventListener("input", () => {
        const term = liveSearchInput.value.trim().toLowerCase();
        const liveProducts = sortProducts(
          store.products.filter((product) => matchesQuery(product, term)),
          sortSelect ? sortSelect.value : sort
        );
        if (catalogNode) {
          catalogNode.innerHTML = liveProducts.map((product) => renderProductCard(product, { compact: true })).join("");
        }
        if (countNode) {
          countNode.textContent = `Показано ${liveProducts.length} з ${store.products.length} товарів`;
        }
        if (emptyNode) emptyNode.hidden = liveProducts.length > 0;
        if (searchNode) searchNode.textContent = term;
      });
    }
  };

  const renderProduct = () => {
    const slug = params.get("product") || document.body.dataset.product || store.featuredSlugs[0];
    const product = map.get(slug) || store.products[0];
    const title = document.querySelector("[data-product-title]");
    const price = document.querySelector("[data-product-price]");
    const summary = document.querySelector("[data-product-summary]");
    const details = document.querySelector("[data-product-details]");
    const colors = document.querySelector("[data-product-colors]");
    const gallery = document.querySelector("[data-product-gallery]");
    const breadcrumb = document.querySelector("[data-product-breadcrumb]");
    const article = document.querySelector("[data-product-article]");
    const specs = document.querySelector("[data-product-specs]");

    if (title) title.textContent = product.name;
    if (price) price.textContent = formatPrice(product.price);
    if (summary) summary.textContent = product.description;
    if (article) article.textContent = product.article;
    if (details) {
      details.innerHTML = `
        <p>Артикул: ${escapeHtml(product.article)}.</p>
        <p>Матеріал: ${escapeHtml(product.material)}.</p>
        <p>Розмір: ${escapeHtml(product.size)}.</p>
        <p>Посадка: ${escapeHtml(product.fit)}.</p>
      `;
    }
    if (specs) {
      specs.innerHTML = product.shortSpecs.map((spec) => `<li>${escapeHtml(spec)}</li>`).join("");
    }
    if (breadcrumb) breadcrumb.textContent = `Головна / Каталог / Панами / ${product.name}`;
    if (colors) {
      colors.innerHTML = product.colors.map((color) => `<option>${escapeHtml(color)}</option>`).join("");
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
          if (leadImage) leadImage.src = thumb.dataset.image;
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

  const renderSearchPage = () => {
    const title = document.querySelector("[data-search-title]");
    const list = document.querySelector("[data-search-results]");
    const count = document.querySelector("[data-search-count]");
    const empty = document.querySelector("[data-search-empty]");
    const formInput = document.querySelector("[data-search-page-input]");
    if (title) {
      title.textContent = query ? `Результати пошуку: ${query}` : "Пошук товарів";
    }
    if (formInput) formInput.value = query;
    if (count) count.textContent = `Знайдено ${filteredProducts.length} товарів`;
    if (list) list.innerHTML = filteredProducts.map((product) => renderProductCard(product, { compact: true })).join("");
    if (empty) empty.hidden = filteredProducts.length > 0;
  };

  const renderPolicyPage = () => {
    const key = document.body.dataset.policy || "";
    const title = document.querySelector("[data-policy-title]");
    const body = document.querySelector("[data-policy-body]");
    const content = store.policies[key];
    if (!content) return;
    const titles = {
      delivery: "Доставка й оплата",
      returns: "Обмін та повернення",
      privacy: "Політика конфіденційності",
      terms: "Умови користування"
    };
    if (title) title.textContent = titles[key] || "Інформаційна сторінка";
    if (body) body.innerHTML = `<p>${escapeHtml(content)}</p>`;
  };

  bindSearchForms();
  fillStoreMeta();
  renderMiniCart();

  if (page === "home") renderHome();
  if (page === "catalog") {
    renderCategoryNav();
    renderCatalog();
  }
  if (page === "product") renderProduct();
  if (page === "cart") renderCart();
  if (page === "checkout") renderCheckout();
  if (page === "search") renderSearchPage();
  if (page === "policy") renderPolicyPage();
});
