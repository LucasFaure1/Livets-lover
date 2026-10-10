import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { checkoutHref, attributionKeys } from "../checkout.js";
import { productConfig } from "../product-config.js";
import { startPixel } from "../tracking.js";
test("preserves six campaign parameters without duplicates or loss of checkout parameters", () => {
 const result = new URL(checkoutHref(productConfig.checkoutUrl + "?existing=keep&utm_source=old", new URLSearchParams(attributionKeys.map(k => [k, "ø space & value"]))));
 assert.equal(result.searchParams.get("existing"), "keep");
 for (const key of attributionKeys) { assert.equal(result.searchParams.get(key), "ø space & value"); assert.equal(result.searchParams.getAll(key).length, 1); }
});
test("does not invent attribution", () => assert.equal(checkoutHref(productConfig.checkoutUrl, ""), productConfig.checkoutUrl));
test("initializes one pixel and two page events only once", () => {
 const win = {}; const scripts = [];
 const doc = { createElement: () => ({}), head: { append: s => scripts.push(s) } };
 startPixel(win, doc); startPixel(win, doc);
 assert.equal(scripts.length, 1);
 const calls = win.fbq.queue.map(a => Array.from(a));
 assert.deepEqual(calls.filter(a => a[0] === "trackSingle").map(a => a[2]), ["PageView", "ViewContent"]);
 assert.equal(calls.at(-1)[3].value, 17.99);
});
test("does not duplicate an existing loader", () => startPixel({ fbq() {} }, { createElement() { throw Error("duplicate"); } }));
test("four same-tab CTAs and five authorized testimonials", async () => {
 const html = await readFile(new URL("../index.html", import.meta.url), "utf8");
 const links = [...html.matchAll(/<a\b[^>]*data-checkout-link[^>]*>/g)];
 assert.equal(links.length, 4);
 assert.ok(links.every(([tag]) => tag.includes('href="' + productConfig.checkoutUrl + '"') && !tag.includes("target=")));
 assert.equal([...html.matchAll(/<figure class="testimonial">/g)].length, 5);
 assert.doesNotMatch(html, /Pris kommer|checkout-pending|30 dagers|\.example/);
});
