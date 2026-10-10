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
Samtykkevarselet er fjernet etter kundens uttrykkelige ønske, men måling er aktivert. Landingssiden laster tracking.js og sender PageView og ViewContent automatisk én gang per sidelasting til godkjent Pixel-ID. Ingen kjøpshendelser fra landingssiden, og ingen måling fra de juridiske sidene. Checkout-måling endres ikke. Dette er en teknisk implementasjon, ikke en bekreftelse på juridisk etterlevelse; samtykkeløsning for annonsemåling i Norge gjenstår.
Se FUNNEL-QA.md for test av checkout og kjøp.
Formelle selgeropplysninger og juridisk kvalitetssikring gjenstår.
