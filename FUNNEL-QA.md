# Verificación del funnel — 9 octubre 2026

## Actualización: aviso eliminado
Por pedido del usuario se eliminó el banner y su botón de ajustes. main.js ya no importa ni ejecuta tracking.js, por lo que tampoco los consentimientos guardados activan el Pixel. Los CTA, UTMs y checkout no cambian. La validación del tracking de la landing descrita abajo corresponde a la versión anterior, no a la versión actual. La medición de checkout sigue siendo responsabilidad de Impultienda y no se modificó.

Landing estática → CTA nativo → Impultienda → Impul Pay / PayPal → entrega.
No hay API de pagos ni CAPI local. Proyecto Vercel verificado: livets-lover, prj_BJAG97CfrOym9GNhZPxdRTf0q2Cm.

## Confirmado
- US$17.99 y garantía de 7 días, aprobados por el usuario tras inspeccionar el checkout.
- Cuatro CTA con una configuración; misma pestaña y los cinco UTM más fbclid conservados.
- Prueba browser: utm_source=meta, utm_medium=paid, utm_campaign=murphy_no, utm_content=qa, utm_term=test, fbclid=qa llegan al checkout.
- Producto principal correcto; dos bumps disponibles (US$11.99 y US$7.99); PayPal e Impul Pay visibles. No se realizó pago ni se entregaron datos personales.
- QA a 390/430/1280/1440: sin overflow horizontal. Imágenes cargadas al recorrer la página; FAQ y sticky funcionales. Sin errores de consola registrados.
- Rechazo del consentimiento: cero scripts Meta. Aceptación: cargador fbevents y configuración del ID 2011892559518551.
- Build, lint y cinco tests automatizados pasan.
- Cinco testimonios exactos proporcionados, sin estrellas/fotos inventadas.
- Portadas, hero y OG reemplazados por material noruego existente.

## Eventos y responsabilidad
| Evento | Responsable | Momento | Canal / estado |
|---|---|---|---|
| PageView | Landing | Tras consentimiento, una vez por carga | Browser; llamadas verificadas por test |
| ViewContent | Landing | Tras consentimiento; producto, USD, 17.99 | Browser; llamadas verificadas por test |
| AddToCart | No implementado en landing | No existe carrito local | No se inventa este evento |
| InitiateCheckout | Impultienda | Según su integración de checkout | Pendiente comprobar en Events Manager |
| Purchase | Impultienda | Solo después del pago exitoso | Browser/Server y deduplicación pendientes de verificar |

No se agregaron GTM, Google Analytics, Clarity ni CAPI. AutoConfig del Pixel se desactiva antes de init para evitar eventos automáticos de botones. No podemos garantizar la configuración remota de Meta ni la deduplicación de Impultienda desde el código de Vercel.

## Compra real de prueba (la realiza el titular)
1. En Events Manager seleccionar el Dataset 2011892559518551 y abrir Probar eventos.
2. Abrir la landing con UTMs de prueba y aceptar medición: comprobar un PageView y un ViewContent por carga.
3. Pulsar un CTA: comprobar checkout, parámetros, US$17.99 y garantía de 7 días. No debe aparecer Purchase por este paso.
4. Comprobar InitiateCheckout de Impultienda y que no se duplica por una llamada de la landing.
5. Hacer una compra autorizada con PayPal o Impul Pay, sin bumps si se quiere comprobar el importe base. Completar la autorización bancaria si corresponde.
6. Comprobar correo recibido, acceso y apertura de los cinco PDF; no basta con ver la pantalla de éxito.
7. Confirmar Purchase con importe real y moneda USD. Si llega por Browser y Server, comprobar mismo event_name/event_id y estado deduplicado. Si falla, corregir la integración de Impultienda; no crear Purchase artificial en landing.
8. Revisar Diagnósticos y descartar Purchase al recargar sin una nueva compra.

## Pendiente externo
- Checkout contiene etiquetas en inglés y componentes de urgencia (personas comprando y cuenta atrás) cuyo fundamento no ha sido validado. No se modificó su administración.
- Identidad legal, dirección y contacto formal no proporcionados; las páginas legales advierten que requieren revisión. Instagram queda como contacto disponible.
- Recepción en Events Manager, CAPI y entrega posterior al pago necesitan la prueba real anterior.
- Pruebas de rechazo/aceptación y recuentos locales no prueban por sí solas recepción ni atribución de Meta.

Consentimiento: guía primaria de Datatilsynet consultada: https://www.datatilsynet.no/personvern-pa-ulike-omrader/internett-og-apper/cookies/
