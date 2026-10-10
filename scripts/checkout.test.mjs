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
test("public price is the approved kr offer; payment tracking remains unchanged", async () => {
 const html = await readFile(new URL("../index.html", import.meta.url), "utf8");
 assert.equal(productConfig.priceDisplay, "171,92 kr");
 assert.equal(productConfig.originalPriceDisplay, "344 kr");
 assert.equal(productConfig.discountDisplay, "−50 %");
 assert.equal(productConfig.savingsDisplay, "Du sparer 172 kr");
 assert.equal(productConfig.price, 17.99);
 assert.equal(productConfig.currency, "USD");
 assert.equal([...html.matchAll(/data-price-display>171,92 kr</g)].length, 4);
 assert.equal([...html.matchAll(/data-original-price>344 kr</g)].length, 3);
 assert.equal([...html.matchAll(/data-discount>−50 %</g)].length, 2);
 assert.equal([...html.matchAll(/data-savings>Du sparer 172 kr</g)].length, 2);
 assert.doesNotMatch(html, /USD|US\$|amerikanske dollar|USdata-price-display/);
});
test("legal drafting notes remain only in HTML TODO comments", async () => {
 for (const name of ["kjopsvilkar.html", "personvern.html"]) {
  const html = await readFile(new URL("../" + name, import.meta.url), "utf8");
  const visible = html.replace(/<!--[\s\S]*?-->/g, "");
  assert.match(html, /<!-- TODO:/);
  assert.doesNotMatch(visible, /Må kompletteres|må fortsatt kvalitetssikres|må fortsatt oppgis|ikke oppgitt|USD|amerikanske dollar/);
 }
 const privacy = await readFile(new URL("../personvern.html", import.meta.url), "utf8");
 assert.ok(privacy.includes("Landingssiden bruker Meta-pikselen til å måle besøk og klikk til kassen, slik at vi kan måle effekten av annonsene våre. Kjøpet gjennomføres hos Impultienda, som har egne personvernopplysninger i kassen."));
});
test("landing keeps measurement active without the removed consent UI", async () => {
 const html = await readFile(new URL("../index.html", import.meta.url), "utf8");
 const main = await readFile(new URL("../main.js", import.meta.url), "utf8");
 assert.doesNotMatch(html, /data-consent|consent-panel|Personverninnstillinger|facebook\.net/);
 assert.match(main, /import \{ startPixel \} from "\.\/tracking\.js"/);
 assert.match(main, /if \(document\.querySelector\("\[data-hero\]"\)\) startPixel\(\)/);
 assert.doesNotMatch(main, /setupConsent/);
});
test("initializes one pixel and two page events only once", () => {
 const win = {}; const scripts = [];
 const doc = { createElement: () => ({}), head: { append: s => scripts.push(s) } };
 startPixel(win, doc); startPixel(win, doc);
 assert.equal(scripts.length, 1);
 const calls = win.fbq.queue.map(a => Array.from(a));
 assert.equal(calls.filter(a => a[0] === "init").length, 1);
 assert.ok(calls.filter(a => a[0] === "trackSingle").every(a => a[1] === productConfig.metaPixelId));
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
 assert.deepEqual([...html.matchAll(/<figcaption><strong>([^<]+)<\/strong>/g)].map(match => match[1]), ["Ingrid Hansen", "Sofie Larsen", "Marius Johansen", "Camilla Nilsen", "Emma Berg"]);
 assert.doesNotMatch(html, /Pris kommer|checkout-pending|30 dagers|\.example/);
});
