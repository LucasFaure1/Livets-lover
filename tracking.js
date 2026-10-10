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

