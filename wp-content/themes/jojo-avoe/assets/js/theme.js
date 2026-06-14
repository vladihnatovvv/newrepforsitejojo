document.addEventListener("DOMContentLoaded", () => {
  const shell = document.documentElement;
  const mobileMenu = document.getElementById("mobile-menu");
  const menuToggles = document.querySelectorAll(".js-menu-toggle");
  const miniCart = document.getElementById("mini-cart-panel");
  const cartToggles = document.querySelectorAll(".js-cart-toggle");

  const toggleVisibility = (node, stateClass, expanded) => {
    if (!node) return;
    const isOpen = expanded ?? !node.classList.contains(stateClass);
    node.classList.toggle(stateClass, isOpen);
    node.hidden = !isOpen;
    shell.classList.toggle("has-overlay", isOpen);
    return isOpen;
  };

  menuToggles.forEach((toggle) => {
    toggle.addEventListener("click", () => {
      const isOpen = toggleVisibility(mobileMenu, "is-open");
      menuToggles.forEach((button) =>
        button.setAttribute("aria-expanded", String(Boolean(isOpen)))
      );
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
});

