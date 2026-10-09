import { access, readFile, readdir, stat } from "node:fs/promises";
import { extname } from "node:path";

const root = new URL("../", import.meta.url);
const files = [];

async function walk(url) {
  for (const entry of await readdir(url, { withFileTypes: true })) {
    if ([".git", ".vercel", "node_modules"].includes(entry.name)) continue;
    const child = new URL(`${entry.name}${entry.isDirectory() ? "/" : ""}`, url);
    if (entry.isDirectory()) await walk(child);
    else files.push(child);
  }
}

await walk(root);
const errors = [];
const textExtensions = new Set([".html", ".js", ".json", ".md", ".txt", ".xml", ".svg"]);
const forbidden = [
  new RegExp(["Slo", "vakia|Slov", "ensko|sk", "-SK|sk", "_SK|Pol", "and|Pol", "ska|pl", "-PL|pl", "_PL|PL", "N|\\bE", "UR\\b"].join(""), "gi"),
  new RegExp(`https?:\\/\\/[^\\s"']*(?:${"za" + "kony-zi" + "vota"}|${"pra" + "wa-zy" + "cia"})[^\\s"']*`, "gi"),
  new RegExp(`${"impul" + "tienda"}\\.ar`, "gi"),
  /connect\.facebook\.net|fbq\s*\(/gi,
  new RegExp("201189" + "2559518551", "g"),
];

for (const url of files) {
  if (!textExtensions.has(extname(url.pathname))) continue;
  const text = await readFile(url, "utf8");
  for (const pattern of forbidden) {
    pattern.lastIndex = 0;
    if (pattern.test(text)) errors.push(`${url.pathname}: forbidden production reference ${pattern}`);
  }
}

const html = await readFile(new URL("index.html", root), "utf8");
for (const expected of [
  'lang="nb"',
  'og:locale" content="nb_NO"',
  'name="robots" content="noindex, nofollow"',
  "Murphys lov for barn",
  "Livets lover",
  "5 bøker i 1",
]) {
  if (!html.includes(expected)) errors.push(`index.html: missing ${expected}`);
}

for (const match of html.matchAll(/(?:src|href)="([^"?#]+)(?:[?#][^"]*)?"/g)) {
  const path = match[1];
  if (/^(?:https?:|mailto:|#)/.test(path)) continue;
  try { await access(new URL(path, root)); }
  catch { errors.push(`index.html: missing asset ${path}`); }
}

for (const match of html.matchAll(/srcset="([^"]+)"/g)) {
  for (const item of match[1].split(",")) {
    const path = item.trim().split(/\s+/)[0];
    try { await access(new URL(path, root)); }
    catch { errors.push(`index.html: missing responsive image ${path}`); }
  }
}

const checkoutLinks = [...html.matchAll(/<a\b[^>]*\bdata-checkout-link[^>]*>/g)];
if (checkoutLinks.length !== 4) errors.push(`Expected four checkout links, found ${checkoutLinks.length}`);
for (const [tag] of checkoutLinks) {
  if (!tag.includes('href="#checkout-pending"')) errors.push("Checkout placeholder must be explicit");
  if (/target=|onclick=/i.test(tag)) errors.push("Checkout links must use native same-tab navigation");
}

if (/<figure class="testimonial"|Anna Horváthová|Katarína Nováková/.test(html)) {
  errors.push("Unapproved customer testimonials remain in production HTML");
}

const js = await readFile(new URL("main.js", root), "utf8");
const config = await readFile(new URL("product-config.js", root), "utf8");
for (const expected of ['checkoutUrl: ""', 'priceDisplay: ""', 'metaPixelId: ""', 'supportEmail: ""']) {
  if (!config.includes(expected)) errors.push(`product-config.js: missing safe default ${expected}`);
}
if (/Purchase|InitiateCheckout|AddToCart|fbq\s*\(/.test(js)) errors.push("Tracking or purchase events must remain disabled");

const assets = new Set(["index.html", "styles.css", "main.js", "product-config.js"]);
for (const match of html.matchAll(/<(img|source|link|script)\b[^>]*>/g)) {
  const tag = match[0];
  if (tag.includes('rel="canonical"')) continue;
  for (const source of tag.matchAll(/(?:src|href)="([^"?#]+)(?:[?#][^"]*)?"/g)) {
    if (!/^https?:/.test(source[1])) assets.add(source[1]);
  }
  for (const srcset of tag.matchAll(/srcset="([^"]+)"/g)) {
    assets.add(srcset[1].split(",").at(-1).trim().split(/\s+/)[0]);
  }
}
for (const font of files.filter((url) => url.pathname.endsWith(".woff2"))) assets.add(font);
let payloadBytes = 0;
for (const asset of assets) payloadBytes += (await stat(asset instanceof URL ? asset : new URL(asset, root))).size;
if (payloadBytes > 2_500_000) errors.push(`Page payload budget exceeded: ${payloadBytes} bytes`);

if (errors.length) {
  console.error(errors.join("\n"));
  process.exit(1);
}

console.log(`OK: ${files.length} files checked; Norway-only production copy and URLs.`);
console.log(`Worst-case referenced page assets: ${(payloadBytes / 1_000_000).toFixed(2)} MB (including fonts).`);
console.log("OK: four controlled checkout placeholders; tracking and payment integrations disabled.");
