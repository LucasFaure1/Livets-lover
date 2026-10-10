export const attributionKeys = ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term", "fbclid"];

export function checkoutHref(checkoutUrl, search) {
  const checkout = new URL(checkoutUrl);
  const incoming = new URLSearchParams(search);
  for (const key of attributionKeys) {
    if (incoming.has(key)) checkout.searchParams.set(key, incoming.get(key));
  }
  return checkout.href;
}
