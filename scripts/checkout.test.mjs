import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const root = new URL("../", import.meta.url);
const html = await readFile(new URL("index.html", root), "utf8");
const config = await readFile(new URL("product-config.js", root), "utf8");
const main = await readFile(new URL("main.js", root), "utf8");

test("all purchase CTAs use one controlled placeholder before checkout launch", () => {
  const links = [...html.matchAll(/<a\b[^>]*data-checkout-link[^>]*>/g)];
  assert.equal(links.length, 4);
  assert.ok(links.every((match) => /href="#checkout-pending"/.test(match[0])));
  assert.match(config, /checkoutUrl:\s*""/);
  assert.match(main, /productConfig\.checkoutUrl/);
});

test("price, tracking and support defaults are intentionally unset", () => {
  assert.match(config, /priceDisplay:\s*""/);
  assert.match(config, /metaPixelId:\s*""/);
  assert.match(config, /supportEmail:\s*""/);
  assert.doesNotMatch(main, /fbq\s*\(|Purchase|InitiateCheckout|AddToCart/);
});

test("Norwegian locale and product identity are present", () => {
  assert.match(html, /<html lang="nb">/);
  assert.match(html, /nb_NO/);
  assert.match(html, /Murphys lov for barn/);
  assert.match(html, /Livets lover/);
});
