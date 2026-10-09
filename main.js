import { productConfig } from "./product-config.js";

(() => {
  if (window.__livetsLoverInitialized) return;
  window.__livetsLoverInitialized = true;

  function setText(selector, value) {
    document.querySelectorAll(selector).forEach((element) => {
      element.textContent = value;
    });
  }

  function hydrateConfig() {
    const baseUrl = productConfig.baseUrl.replace(/\/$/, "");
    document.querySelector('link[rel="canonical"]')?.setAttribute("href", `${baseUrl}/`);
    document.querySelector('meta[property="og:url"]')?.setAttribute("content", `${baseUrl}/`);
    document.querySelector('meta[property="og:image"]')?.setAttribute("content", `${baseUrl}/img/no/fem-boker-i-en-og-1200x630.jpg`);
    document.querySelector('meta[name="twitter:image"]')?.setAttribute("content", `${baseUrl}/img/no/fem-boker-i-en-og-1200x630.jpg`);
    setText("[data-price-display]", productConfig.priceDisplay || "Pris kommer");
    document.querySelectorAll(".price-line s, .mobile-buy s").forEach((element) => {
      element.hidden = !productConfig.originalPriceDisplay;
      element.textContent = productConfig.originalPriceDisplay;
    });
    document.querySelectorAll(".discount-pill").forEach((element) => {
      element.hidden = !productConfig.discountDisplay;
      element.textContent = productConfig.discountDisplay;
    });
    setText(
      ".price-history",
      productConfig.savingsDisplay || "Norsk pris kunngjøres før lansering",
    );

    document.querySelectorAll("[data-support-email]").forEach((link) => {
      if (productConfig.supportEmail) {
        link.href = `mailto:${productConfig.supportEmail}`;
        link.textContent = `Kontakt (${productConfig.supportEmail})`;
      } else {
        link.removeAttribute("href");
        link.setAttribute("aria-disabled", "true");
        link.textContent = "Kontaktinformasjon kommer";
      }
    });
  }

  function setupCheckoutLinks() {
    const attributionKeys = [
      "utm_source",
      "utm_medium",
      "utm_campaign",
      "utm_content",
      "utm_term",
      "fbclid",
    ];
    const incoming = new URLSearchParams(window.location.search);

    document.querySelectorAll("[data-checkout-link]").forEach((link) => {
      if (!productConfig.checkoutUrl) {
        link.href = "#checkout-pending";
        link.setAttribute("aria-disabled", "true");
        link.title = "Norsk checkout kobles til før lansering";
        return;
      }

      const checkout = new URL(productConfig.checkoutUrl);
      attributionKeys.forEach((key) => {
        if (incoming.has(key)) checkout.searchParams.set(key, incoming.get(key));
      });
      link.href = checkout.toString();
      link.removeAttribute("aria-disabled");
      link.removeAttribute("title");
    });
  }

  function setupMobileBuyButton() {
    const sticky = document.querySelector("[data-mobile-buy]");
    const hero = document.querySelector("[data-hero]");
    if (!sticky || !hero || !("IntersectionObserver" in window)) return;

    new IntersectionObserver(([entry]) => {
      sticky.hidden = entry.isIntersecting || entry.boundingClientRect.bottom > 0;
    }, { threshold: 0 }).observe(hero);
  }

  hydrateConfig();
  setupCheckoutLinks();
  setupMobileBuyButton();
})();
