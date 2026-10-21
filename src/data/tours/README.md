# Editar los tours

Cada archivo `.ts` con el nombre de un tour contiene su contenido público. Cambia textos, precio, itinerario, horarios, recomendaciones y fotos allí; no hace falta editar componentes. `types.ts` documenta los campos y detecta omisiones.

- `price: { kind: "paid", adult: 25 }` → **Desde $25 USD**. Es la tarifa adulta general, no una promoción condicionada. La infantil se informa aparte, también con «Desde».
- `price: { kind: "free" }` → **Gratis**, con «Aporte voluntario al finalizar» en pequeño.
- `photos`: rutas locales desde la raíz del proyecto, como `/public/assets/menu/tours/mi-foto.jpg` o `/src/assets/tours/mi-foto.jpg`. La galería obtiene dimensiones y genera versiones optimizadas automáticamente. Usa al menos cinco fotos, con textos alternativos descriptivos.
- Para nuevas carpetas de imágenes, añade el patrón a `import.meta.glob` en `images.ts`. La primera foto de cada tour se utiliza también como miniatura en «Otra ruta, otra historia».
- Cambia `illustrativePhotos` a `false` únicamente cuando sean fotografías aprobadas del tour. Este campo identifica las fotos de ejemplo en las etiquetas accesibles, sin mostrar un aviso bajo la galería.
- `operatingDays` describe días habituales (domingo=0), **no disponibilidad en tiempo real**. La consulta nunca confirma una reserva.
- `source.pendingReview` conserva discrepancias por validar; no se renderiza ni se envía al navegador. Tras validarlas, actualiza el campo público y la nota.

## Fuente y trazabilidad

Los seis JSON en `source/` conservan todas las celdas con contenido y fórmulas de **FICHA TOUR**, con nombre del Excel y coordenadas de celda. Son snapshots internos, no contenido para mostrar directamente. No contienen otras hojas.

Para volver a extraer los Excel: `python3 scripts/extract-tours.py`. Requiere Python 3, sin dependencias externas. **No sobrescribe los `.ts` editables**. Las fórmulas se conservan sin evaluarlas, incluidos enlaces. Revisa diferencias manualmente antes de actualizar el contenido público.

No publicar números de soporte de plantilla, responsables internos, tarifas netas de agencias ni logística copiada de otros tours. Las políticas de cancelación ambiguas se consultan con el equipo en lugar de prometer cancelación gratuita.

Los originales están en `public/tmp` por solicitud inicial; recuerda que cualquier archivo bajo `public` se publica en un despliegue de Astro. Antes de desplegar, retíralos de esa carpeta pública si contienen información interna. Los JSON de `src/data/tours/source` no se importan en la interfaz.

## Comprobaciones

- Compilación: `pnpm build`.
- Pruebas de contenido, precios, procedencia y estilos: `node --test tests/*.test.mjs` (después de compilar).
- Navegador: con Playwright y Chromium disponibles, inicia `pnpm preview --port 4322` y ejecuta `node tests/tours.browser.mjs`. También admite `BASE_URL` y `PLAYWRIGHT_MODULE` para usar otra URL o instalación externa de Playwright. No envía consultas reales.
