document.addEventListener("DOMContentLoaded", () => {
  const ICONS = {
    cart: `
      <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
        <path d="M6 7h12l-1 10H7L6 7Z"></path>
        <path d="M9 7a3 3 0 0 1 6 0"></path>
      </svg>
    `,
    search: `
      <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
        <circle cx="11" cy="11" r="6"></circle>
        <path d="m20 20-4.2-4.2"></path>
      </svg>
    `,
    menu: `
      <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
        <path d="M4 7h16"></path>
        <path d="M4 12h16"></path>
        <path d="M4 17h16"></path>
      </svg>
    `,
    close: `
      <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
        <path d="M6 6 18 18"></path>
        <path d="M18 6 6 18"></path>
      </svg>
    `,
    trash: `
      <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
        <path d="M3 6h18"></path>
        <path d="M8 6V4h8v2"></path>
        <path d="M19 6l-1 14H6L5 6"></path>
        <path d="M10 11v5"></path>
        <path d="M14 11v5"></path>
      </svg>
    `
  };

  const shell = document.documentElement;
  const mobileMenu = document.getElementById("mobile-menu");
  const menuToggles = document.querySelectorAll(".js-menu-toggle");
  const miniCart = document.getElementById("mini-cart-panel");
  const cartToggles = document.querySelectorAll(".js-cart-toggle");
  const cartButtons = document.querySelectorAll(".cart-pill");
  const closeButtons = document.querySelectorAll(".mini-cart__close");
  const store = window.JOJO_STORE || null;
  const page = document.body.dataset.page || "";
  const desktopSearchMedia = window.matchMedia("(min-width: 1101px)");
  const buildSearchUrl = (term) => `./search.html?q=${encodeURIComponent(term)}`;

  const injectIcons = () => {
    document.querySelectorAll(".cart-pill").forEach((button) => {
      if (!button.querySelector(".icon-inline")) {
        const icon = document.createElement("span");
        icon.className = "icon-inline icon-inline--cart";
        icon.innerHTML = ICONS.cart;
        button.prepend(icon);
      }
    });

    document.querySelectorAll(".header-search button[type='submit']").forEach((button) => {
      button.classList.add("icon-button");
      button.setAttribute("aria-label", "Знайти");
      button.innerHTML = `<span class="icon-inline icon-inline--search">${ICONS.search}</span><span class="button-sr-only">Знайти</span>`;
    });

    document.querySelectorAll(".js-menu-toggle").forEach((button) => {
      button.classList.add("icon-button", "icon-button--ghost");
      button.innerHTML = `<span class="icon-inline icon-inline--menu">${ICONS.menu}</span><span class="button-sr-only">Меню</span>`;
    });

    document.querySelectorAll(".mini-cart__close").forEach((button) => {
      button.classList.add("icon-button", "icon-button--ghost", "icon-button--close");
      button.innerHTML = `<span class="icon-inline icon-inline--close">${ICONS.close}</span><span class="button-sr-only">Закрити</span>`;
    });
  };

  const ensureMobileSearch = () => {
    if (!mobileMenu) return;
    const drawerInner = mobileMenu.querySelector(".mobile-drawer__inner");
    if (!drawerInner || drawerInner.querySelector("[data-mobile-search]")) return;
    const mobileSearch = document.createElement("form");
    mobileSearch.className = "header-search header-search--mobile";
    mobileSearch.setAttribute("data-search-form", "");
    mobileSearch.setAttribute("data-mobile-search", "true");
    mobileSearch.innerHTML = `
      <input type="search" placeholder="Пошук товарів" aria-label="Пошук товарів" data-search-input />
      <button type="submit">Знайти</button>
    `;
    drawerInner.prepend(mobileSearch);
  };

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

  const bindHeaderSearchUi = () => {
    const desktopSearchForms = [...document.querySelectorAll(".header-search:not(.header-search--mobile)")];

    const syncSearchState = () => {
      const desktopMode = desktopSearchMedia.matches;
      desktopSearchForms.forEach((form) => {
        const input = form.querySelector("[data-search-input]");
        if (!input) return;
        const hasValue = Boolean(input.value.trim());
        form.classList.toggle("is-collapsed", desktopMode && !hasValue);
        form.classList.toggle("is-open", desktopMode && hasValue);
        form.dataset.expanded = desktopMode && hasValue ? "true" : "false";
      });
    };

    desktopSearchForms.forEach((form) => {
      const input = form.querySelector("[data-search-input]");
      const submitButton = form.querySelector("button[type='submit']");
      if (!input || !submitButton) return;

      const openSearch = () => {
        if (!desktopSearchMedia.matches) return;
        form.classList.add("is-open");
        form.classList.remove("is-collapsed");
        form.dataset.expanded = "true";
      };

      const closeSearch = ({ force = false } = {}) => {
        if (!desktopSearchMedia.matches) {
          form.classList.remove("is-open", "is-collapsed");
          form.dataset.expanded = "false";
          return;
        }
        if (!force && input.value.trim()) return;
        form.classList.remove("is-open");
        form.classList.add("is-collapsed");
        form.dataset.expanded = "false";
      };

      submitButton.addEventListener("click", (event) => {
        if (!desktopSearchMedia.matches) return;
        if (form.dataset.expanded !== "true") {
          event.preventDefault();
          openSearch();
          requestAnimationFrame(() => input.focus());
        }
      });

      input.addEventListener("focus", openSearch);
      input.addEventListener("keydown", (event) => {
        if (event.key !== "Escape") return;
        input.value = "";
        closeSearch({ force: true });
        submitButton.focus();
      });

      input.addEventListener("blur", () => {
        window.setTimeout(() => {
          if (form.contains(document.activeElement)) return;
          closeSearch();
        }, 120);
      });

      document.addEventListener("click", (event) => {
        if (!desktopSearchMedia.matches || form.contains(event.target)) return;
        closeSearch();
      });
    });

    desktopSearchMedia.addEventListener("change", syncSearchState);
    syncSearchState();
  };

  const bindSearchForms = () => {
    document.querySelectorAll("[data-search-form]").forEach((form) => {
      if (form.dataset.searchBound === "true") return;
      form.dataset.searchBound = "true";
      form.addEventListener("submit", (event) => {
        event.preventDefault();
        const input = form.querySelector("[data-search-input]");
        const term = input ? input.value.trim() : "";
        window.location.href = buildSearchUrl(term);
      });
    });
  };

  ensureMobileSearch();
  injectIcons();
  bindHeaderSearchUi();
  bindSearchForms();

  if (!store) return;

  const map = new Map(store.products.map((product) => [product.slug, product]));
  const cartItems = (store.sampleCart || [])
    .map((item) => ({ ...item, product: map.get(item.slug) }))
    .filter((item) => item.product);

  const params = new URLSearchParams(window.location.search);
  const query = (params.get("q") || "").trim().toLowerCase();
  const sort = params.get("sort") || "default";
  const requestedCategorySlug = params.get("category") || "";

  const formatPrice = (value) => `${Number(value).toLocaleString("uk-UA")} ₴`;
  const escapeHtml = (value) =>
    String(value)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;");

  const buildProductUrl = (slug) => `./product.html?product=${encodeURIComponent(slug)}`;
  const buildCatalogUrl = ({ category = "", sortValue = "", queryValue = "" } = {}) => {
    const next = new URL("./catalog.html", window.location.href);
    if (category) next.searchParams.set("category", category);
    if (sortValue && sortValue !== "default") next.searchParams.set("sort", sortValue);
    if (queryValue) next.searchParams.set("q", queryValue);
    return `${next.pathname}${next.search}`;
  };

  const categoryEntries = store.categories.flatMap((group) =>
    (group.children || []).map((child) => ({
      ...child,
      parentName: group.name,
      parentSlug: group.slug
    }))
  );
  const categoryMap = new Map(categoryEntries.map((entry) => [entry.slug, entry]));
  const defaultCategorySlug = categoryEntries.find((entry) => entry.active)?.slug || "";
  const selectedCategorySlug = requestedCategorySlug || defaultCategorySlug;
  const selectedCategory = categoryMap.get(selectedCategorySlug) || null;

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

  const matchesCategory = (product, categorySlug) => {
    if (!categorySlug) return true;
    const category = categoryMap.get(categorySlug);
    if (!category) return true;
    return product.category.toLowerCase() === category.name.toLowerCase();
  };

  const sortProducts = (products, sortValue) => {
    const sorted = [...products];
    if (sortValue === "price-asc") sorted.sort((a, b) => a.price - b.price);
    if (sortValue === "price-desc") sorted.sort((a, b) => b.price - a.price);
    if (sortValue === "name-asc") sorted.sort((a, b) => a.name.localeCompare(b.name, "uk"));
    return sorted;
  };

  const getFilteredProducts = ({ term = query, sortValue = sort, categorySlug = selectedCategorySlug } = {}) =>
    sortProducts(
      store.products.filter(
        (product) => matchesCategory(product, categorySlug) && matchesQuery(product, term)
      ),
      sortValue
    );

  const filteredProducts = getFilteredProducts();

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
      list.innerHTML = cartItems.length
        ? cartItems
            .map(
              ({ product, quantity }) => `
                <li class="woocommerce-mini-cart-item">
                  <img class="mini-cart-item__thumb" src="${product.images[0]}" alt="${escapeHtml(product.name)}" />
                  <div class="mini-cart-item__content">
                    <div class="mini-cart-item__row">
                      <strong>${escapeHtml(product.name)}</strong>
                      <button class="mini-cart-item__remove" type="button" data-remove-from-cart="${escapeHtml(product.slug)}" aria-label="Прибрати ${escapeHtml(product.name)} з кошика">
                        <span class="icon-inline icon-inline--trash">${ICONS.trash}</span>
                      </button>
                    </div>
                    <div>${quantity} × ${formatPrice(product.price)}</div>
                  </div>
                </li>
              `
            )
            .join("")
        : `<li class="mini-cart__empty">У кошику поки немає товарів.</li>`;
    }
    const itemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
    const orderTotal = cartItems.reduce((sum, item) => sum + item.quantity * item.product.price, 0);
    document.querySelectorAll(".cart-pill__count").forEach((node) => {
      node.textContent = String(itemCount);
    });
    if (total) total.textContent = formatPrice(orderTotal);
  };

  const removeCartItem = (slug) => {
    const index = cartItems.findIndex((item) => item.slug === slug);
    if (index === -1) return;
    cartItems.splice(index, 1);
    renderMiniCart();
    if (page === "cart") renderCart();
    if (page === "checkout") renderCheckout();
  };

  const bindCartInteractions = () => {
    document.addEventListener("click", (event) => {
      const removeButton = event.target.closest("[data-remove-from-cart]");
      if (!removeButton) return;
      removeCartItem(removeButton.dataset.removeFromCart || "");
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
      if (node.tagName === "A") {
        const handle = store.meta.instagram.replace(/^@/, "");
        node.href = `https://instagram.com/${handle}`;
        node.target = "_blank";
        node.rel = "noreferrer";
      }
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
      const curatedFeatured = (store.featuredSlugs || [])
        .map((slug) => map.get(slug))
        .filter(Boolean);
      const featured =
        curatedFeatured.length >= 4 ? curatedFeatured : store.products.slice(0, Math.min(store.products.length, 6));
      featuredNode.innerHTML = featured.map((product) => renderProductCard(product)).join("");
    }
    renderFaq();
  };

  const bindFeaturedSlider = () => {
    const track = document.querySelector("[data-featured-products]");
    const prevButton = document.querySelector("[data-featured-prev]");
    const nextButton = document.querySelector("[data-featured-next]");
    if (!track || !prevButton || !nextButton) return;

    const applyFeaturedSliderLayout = () => {
      const visibleItems = window.matchMedia("(max-width: 767px)").matches ? 1 : window.matchMedia("(max-width: 1100px)").matches ? 2 : 3;
      const gap = 30;
      track.style.display = "grid";
      track.style.gridTemplateColumns = "none";
      track.style.gridAutoFlow = "column";
      track.style.gridAutoColumns =
        visibleItems === 1 ? "100%" : visibleItems === 2 ? `calc((100% - ${gap}px) / 2)` : `calc((100% - ${gap * 2}px) / 3)`;
      track.style.overflowX = "auto";
      track.style.overflowY = "hidden";
      track.style.scrollSnapType = "x mandatory";
      track.style.scrollBehavior = "smooth";
      track.style.width = "100%";
    };

    const scrollByPage = (direction) => {
      const firstCard = track.querySelector(".product-card");
      const cardWidth = firstCard ? firstCard.getBoundingClientRect().width : 0;
      const gap = 30;
      const visibleItems = window.matchMedia("(max-width: 767px)").matches ? 1 : window.matchMedia("(max-width: 1100px)").matches ? 2 : 3;
      const distance = (cardWidth + gap) * visibleItems;
      track.scrollBy({ left: distance * direction, behavior: "smooth" });
    };

    applyFeaturedSliderLayout();
    prevButton.addEventListener("click", () => scrollByPage(-1));
    nextButton.addEventListener("click", () => scrollByPage(1));
    window.addEventListener("resize", applyFeaturedSliderLayout);
  };

  const renderCategoryNav = () => {
    const categoryNode = document.querySelector("[data-category-nav]");
    if (!categoryNode) return;
    categoryNode.innerHTML = store.categories
      .map(
        (group) => `
          <div class="catalog-tree__group">
            <span class="catalog-tree__parent${group.children.some((child) => child.slug === selectedCategorySlug) ? " is-active" : ""}">${escapeHtml(group.name)}</span>
            <div class="catalog-tree__children">
              ${group.children
                .map(
                  (child) => `
                    <a class="catalog-tree__child${child.slug === selectedCategorySlug || (!selectedCategorySlug && child.active) ? " is-active" : ""}" href="${buildCatalogUrl({ category: child.slug, sortValue: sort, queryValue: query })}">${escapeHtml(child.name)}</a>
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
    const titleNode = document.querySelector("[data-catalog-title]");
    const descriptionNode = document.querySelector("[data-catalog-description]");
    const eyebrowNode = document.querySelector("[data-catalog-eyebrow]");
    const sortSelect = document.querySelector("[data-sort-select]");
    const liveSearchInput = document.querySelector("[data-live-search-input]");
    const totalInScope = store.products.filter((product) =>
      matchesCategory(product, selectedCategorySlug)
    ).length;
    const defaultTitle = selectedCategory ? `${selectedCategory.name} JoJo` : "Каталог JoJo";
    const defaultDescription = selectedCategory
      ? `Добірка товарів у категорії "${selectedCategory.name}". Пошук і сортування працюють у межах вибраного розділу.`
      : "Оновлений каталог із фільтром, пошуком і тільки вашими товарами.";

    if (sortSelect) sortSelect.value = sort;
    if (liveSearchInput) liveSearchInput.value = query;
    if (searchNode) searchNode.textContent = query || "усі товари";
    if (titleNode) titleNode.textContent = defaultTitle;
    if (descriptionNode) descriptionNode.textContent = defaultDescription;
    if (eyebrowNode && selectedCategory?.parentName) eyebrowNode.textContent = selectedCategory.parentName;

    if (catalogNode) {
      catalogNode.innerHTML = filteredProducts.map((product) => renderProductCard(product, { compact: true })).join("");
    }
    if (countNode) {
      countNode.textContent = `Показано ${filteredProducts.length} з ${totalInScope} товарів`;
    }
    if (emptyNode) {
      emptyNode.hidden = filteredProducts.length > 0;
    }

    if (sortSelect) {
      sortSelect.addEventListener("change", () => {
        window.location.href = buildCatalogUrl({
          category: selectedCategorySlug,
          sortValue: sortSelect.value,
          queryValue: liveSearchInput?.value.trim().toLowerCase() || ""
        });
      });
    }

    if (liveSearchInput) {
      liveSearchInput.addEventListener("input", () => {
        const term = liveSearchInput.value.trim().toLowerCase();
        const liveProducts = getFilteredProducts({
          term,
          sortValue: sortSelect ? sortSelect.value : sort,
          categorySlug: selectedCategorySlug
        });
        if (catalogNode) {
          catalogNode.innerHTML = liveProducts.map((product) => renderProductCard(product, { compact: true })).join("");
        }
        if (countNode) {
          countNode.textContent = `Показано ${liveProducts.length} з ${totalInScope} товарів`;
        }
        if (emptyNode) emptyNode.hidden = liveProducts.length > 0;
        if (searchNode) searchNode.textContent = term || "усі товари";
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
      cartTable.innerHTML = cartItems.length
        ? cartItems
            .map(
              ({ product, quantity }) => `
                <tr>
                  <td class="product-name" data-title="Товар">
                    <div class="cart-line__name">
                      <span>${escapeHtml(product.name)}</span>
                      <button class="mini-cart-item__remove mini-cart-item__remove--table" type="button" data-remove-from-cart="${escapeHtml(product.slug)}" aria-label="Прибрати ${escapeHtml(product.name)} з кошика">
                        <span class="icon-inline icon-inline--trash">${ICONS.trash}</span>
                      </button>
                    </div>
                  </td>
                  <td data-title="Ціна">${formatPrice(product.price)}</td>
                  <td data-title="Кількість"><input class="qty" type="number" value="${quantity}" min="1" /></td>
                  <td data-title="Разом">${formatPrice(product.price * quantity)}</td>
                </tr>
              `
            )
            .join("")
        : `<tr><td colspan="4">Кошик порожній.</td></tr>`;
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

  bindCartInteractions();
  bindFeaturedSlider();
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
