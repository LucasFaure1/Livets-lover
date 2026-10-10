# Livets lover
Uavhengig statisk norsk landing. Ingen lokale betalingsskjemaer eller backend.
Produksjon: https://livets-lover.vercel.app
Checkout: https://livets-lover.impultienda.ar/checkout

## Konfigurasjon
Rediger product-config.js: baseUrl, checkoutUrl, priceDisplay, price, currency, metaPixelId, supportEmail og contactUrl. Ingen miljøvariabler eller hemmelige nøkler er nødvendige.
npm run build oppdaterer statiske kjøpslenker, priser, canonical, delingsbilder, robots og sitemap fra konfigurasjonen. Hold priceDisplay og numerisk price i samsvar.

## Kontroll
npm install
npm run lint
npm run build
npm test

## Måling
Meta lastes bare etter samtykke. PageView og ViewContent sendes én gang per sidevisning. Automatisk hendelsesoppsett er deaktivert. Ingen AddToCart (ingen lokal handlekurv), InitiateCheckout, Purchase eller CAPI fra denne landingen.
Se FUNNEL-QA.md for test av checkout og kjøp.
Formelle selgeropplysninger og juridisk kvalitetssikring gjenstår.
