import { productConfig } from "./product-config.js";
import { checkoutHref } from "./checkout.js";
import { startPixel } from "./tracking.js";

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
      productConfig.savingsDisplay || "Engangsbetaling.",
    );

    document.querySelectorAll("[data-support-email]").forEach((link) => {
      if (productConfig.supportEmail) {
        link.href = `mailto:${productConfig.supportEmail}`;
        link.textContent = `Kontakt (${productConfig.supportEmail})`;
      } else {
        link.href = productConfig.contactUrl;
        link.textContent = "Kontakt oss på Instagram";
      }
    });
  }

  function setupCheckoutLinks() {
    const incoming = new URLSearchParams(window.location.search);

    document.querySelectorAll("[data-checkout-link]").forEach((link) => {
      link.href = checkoutHref(productConfig.checkoutUrl, incoming);
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

  function preserveInternalAttribution() {
    const incoming = new URLSearchParams(window.location.search);
    const keys = ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term", "fbclid"];
    document.querySelectorAll('a[href="personvern.html"], a[href="kjopsvilkar.html"], a[href="/personvern"], a[href="/"]').forEach((link) => {
      const url = new URL(link.getAttribute("href"), window.location.href);
      keys.forEach(key => { if (incoming.has(key)) url.searchParams.set(key, incoming.get(key)); });
      link.href = url.href;
    });
  }

  hydrateConfig();
  setupCheckoutLinks();
  setupMobileBuyButton();
  preserveInternalAttribution();
  if (document.querySelector("[data-hero]")) startPixel();
})();
