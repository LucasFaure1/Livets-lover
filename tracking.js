import { productConfig } from "./product-config.js";

export function startPixel(win = window, doc = document) {
  if (win.__livetsPixelStarted || win.fbq) return;
  win.__livetsPixelStarted = true;
  const fbq = function () {
    if (fbq.callMethod) fbq.callMethod.apply(fbq, arguments);
    else fbq.queue.push(arguments);
  };
  fbq.push = fbq;
  fbq.loaded = true;
  fbq.version = "2.0";
  fbq.queue = [];
  win.fbq = win._fbq = fbq;
  fbq("consent", "grant");
  fbq("set", "autoConfig", false, productConfig.metaPixelId);
  fbq("init", productConfig.metaPixelId);
  fbq("trackSingle", productConfig.metaPixelId, "PageView");
  fbq("trackSingle", productConfig.metaPixelId, "ViewContent", {
    content_name: productConfig.productName,
    content_ids: ["murphys-lov-for-barn-5-boker-i-1"],
    content_type: "product",
    value: productConfig.price,
    currency: productConfig.currency,
  });
  const script = doc.createElement("script");
  script.async = true;
  script.src = "https://connect.facebook.net/en_US/fbevents.js";
  doc.head.append(script);
}

export function setupConsent() {
  const panel = document.querySelector("[data-consent]");
  if (!panel) return;
  const key = "livets-lover-marketing-v1";
  const read = () => { try { return JSON.parse(localStorage.getItem(key)); } catch { return null; } };
  const saved = read();
  const valid = saved && Date.now() - saved.at < 180 * 86400000;
  if (valid && saved.allowed) startPixel();
  panel.hidden = !!valid;
  function choose(allowed) {
    try { localStorage.setItem(key, JSON.stringify({ allowed, at: Date.now() })); } catch { /* Choice still applies to this page. */ }
    if (allowed) {
      if (window.__livetsPixelStarted) window.fbq("consent", "grant");
      else startPixel();
    } else if (window.fbq) window.fbq("consent", "revoke");
    panel.hidden = true;
  }
  document.querySelector("[data-consent-accept]").addEventListener("click", () => choose(true));
  document.querySelector("[data-consent-reject]").addEventListener("click", () => choose(false));
  document.querySelector("[data-consent-settings]").addEventListener("click", () => {
    panel.hidden = false;
    document.querySelector("[data-consent-reject]").focus();
  });
}
