# Livets lover — Norge

Uavhengig norsk ecommerce-landing for `nb-NO`, marked `NO`, merkevaren **Livets lover** og produktet **Murphys lov for barn**.

Prosjektet kopierer den godkjente visuelle strukturen, rekkefølgen og responsive oppførselen fra referanselandingen, men har ingen teknisk avhengighet til andre markeder.

## Lokal forhåndsvisning

```sh
npm run dev
```

Åpne `http://127.0.0.1:4174`.

## Kvalitetssikring

```sh
npm run build
```

## Konfigurasjon før lansering

Oppdater bare `product-config.js` for:

- `baseUrl`
- `checkoutUrl`
- `priceDisplay`, `originalPriceDisplay`, `discountDisplay`, `savingsDisplay`
- `metaPixelId` (skal være tom frem til et norsk Pixel-ID er godkjent)
- `supportEmail`

Canonical- og delings-URL-er hydreres fra `baseUrl`. Oppdater også det statiske domenet i `sitemap.xml` og `robots.txt` når sluttdomenet er kjent.

Checkout-knappene peker kontrollert til `#checkout-pending` til `checkoutUrl` er satt. Ingen betaling, analyse, Meta Pixel eller CAPI er aktivert.

## Åpne produksjonspunkter

- Se `ASSET-LOCALIZATION.md` for bilder med innbakt tekst som trenger godkjent Bokmål-artwork.
- Kundeomtaler er ikke fabrikkert; seksjonen viser en ærlig lanseringsstatus.
- Juridisk selgerinformasjon, endelige vilkår og kundeserviceadresse må fylles ut.
- `noindex, nofollow` skal beholdes til pris, checkout, personvern, vilkår og domene er godkjent.
