import { readFile, access } from "node:fs/promises";
import { productConfig } from "../product-config.js";
const root = new URL("../", import.meta.url);
const html = await readFile(new URL("index.html", root), "utf8");
for (const required of ['lang="nb"', 'content="nb_NO"', 'content="index, follow"', productConfig.baseUrl, "Livets lover"]) if (!html.includes(required)) throw Error("Missing identity/SEO: " + required);
for (const match of html.matchAll(/(?:src|href)="([^"?#]+)(?:[?#][^"]*)?"/g)) {
 if (/^(https?:|mailto:)/.test(match[1])) continue;
 await access(new URL(match[1].replace(/^\//, "") + (match[1] === "/personvern" ? ".html" : ""), root));
}
for (const match of html.matchAll(/srcset="([^"]+)"/g)) for (const item of match[1].split(",")) await access(new URL(item.trim().split(/\s+/)[0].split("?")[0], root));
for (const name of ["index.html","product-config.js","main.js","tracking.js","manifest.webmanifest","robots.txt","sitemap.xml"]) {
 const text = await readFile(new URL(name, root), "utf8");
 if (/Slovensko|Slovakia|Polska|Poland|Murphyho|Zákony|Prawo|Prawa|sk-SK|pl-PL|\.example/.test(text)) throw Error("Market contamination: " + name);
}
const tracking = await readFile(new URL("tracking.js", root), "utf8");
if (/"Purchase"|"InitiateCheckout"|"AddToCart"/.test(tracking)) throw Error("Checkout-only event emitted");
if (productConfig.metaPixelId !== "2011892559518551") throw Error("Unapproved pixel");
console.log("OK: Norway identity, static assets, metadata and approved tracking.");
