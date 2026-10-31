# Editar los tours

Cada archivo `.ts` con el nombre de un tour contiene su contenido público. Cambia textos, precio, itinerario, horarios, recomendaciones y fotos allí; no hace falta editar componentes. `types.ts` documenta los campos y detecta omisiones.

## Activar o desactivar un tour

Cada tour declara `enabled: true`. Cambia únicamente ese campo a `false` para despublicarlo de todo el sitio, sin borrar su contenido:

```ts
enabled: false, // true para volver a publicarlo
```

- `index.ts` filtra los tours una sola vez: hero, menú masonry, catálogo, filtros, destacados, relacionados y selector de contacto consumen únicamente los habilitados.
- No se genera la página de detalle de un tour desactivado. Tras compilar y desplegar de nuevo, su URL devuelve 404.
- Las slides del hero y las tarjetas del masonry representan destinos: desaparecen solo cuando ya no tienen ningún tour habilitado asociado. La slide introductoria de Ecuador permanece aunque todos estén desactivados.
- `enabled` es independiente de `provisional`: el primero controla si se publica; el segundo indica que la experiencia está en preparación y mantiene sus restricciones de consulta.
- Para añadir un tour, crea su archivo con `enabled: true` y regístralo en `index.ts`. Los destinos relacionados se incorporan automáticamente al hero y al menú si tienen su presentación definida.
- Los cambios requieren volver a ejecutar `pnpm build` y desplegar el resultado actualizado.

### Duraciones y horarios de salida

- Cada etapa del itinerario usa `durationMinutes`, por ejemplo `45`, `60` o `150`. Se muestra como **45 min**, **1 h** o **2 h 30 min**. No uses horas de reloj en los títulos, descripciones ni notas visibles.
- Los minutos proceden de las duraciones de cada etapa de **FICHA TOUR**. No se reparten artificialmente las etapas que combinan traslado y visita.
- El total público se calcula automáticamente en `index.ts` con `itineraryDuration`: suma todas las etapas, incluyendo bienvenida, traslados y pausas para almorzar. Prevalece sobre la duración comercial del Excel. Si editas el itinerario, el total publicado se actualiza con él; mantén también el texto `duration` del archivo coherente para facilitar su lectura.
- Para programas aún no validados usa `durationMinutes: null`: aparecerá **Por confirmar**, nunca una duración inventada.
- `departures` contiene las horas de salida de **FICHA TOUR**, en formato de 24 horas (`08:30`, `14:00`). Se comparten entre el selector, la logística y la consulta de WhatsApp. Para NAT-002 se usa la salida oficial `08:30`, no el inicio del encuentro `08:15`. Free Walking Tour indica salida flexible, por lo que se muestra `Horario a convenir` sin inventar horas. Las salidas siguen sujetas a confirmación, no son disponibilidad en tiempo real.

- `price: { kind: "paid", adult: 25 }` → **Desde $25 USD por persona**. Solo se publica un precio base, sin promociones condicionadas ni tarifas infantiles. El importe puede tomarse de las plantillas comerciales de **FICHA TOUR**, pero no sus promesas ni condiciones.
- Las tarifas actualizadas por el propietario prevalecen sobre los snapshots del Excel: FWT-001 gratuito; NAT-001 y ARTE-001 $25; NAT-003 $35; ARQ-001 y CULT-001 $40; CULT-002, NAT-002 y NAT-004 $45. Esta actualización no modifica los precios de ARQ-002 ni NAT-006 ni activa tours despublicados.
- `price: { kind: "free" }` → **Gratuito**, con «Aporte voluntario al finalizar» en pequeño.
- `price: { kind: "pending" }` → **Precio por confirmar** en el listado. Úsalo con `provisional: true` mientras se prepara una propuesta: no se muestran formularios de fechas ni se prometen salidas.
- `summary`: frase breve para la tarjeta; evita copiar la descripción completa.
- `destinations`: identificadores de lugares visitados (no del simple punto de salida). Un tour puede incluir varios. El filtro combina lugares con OR y los cruza con los tipos de experiencia con AND.
- `experienceTypes`: identificadores de `taxonomy.ts`; admite varias experiencias por tour.
- El catálogo `../destinations.ts` define imagen, encuadres y textos de cada lugar. `taxonomy.ts` define sus nombres e identificadores estables para enlaces `/tours/?lugar=chordeleg`. Admite varios `lugar` y `experiencia` en la URL.
- Hero, masonry y filtros se generan con los mismos destinos y relaciones. Para añadir un lugar, registra su etiqueta, presentación y al menos un tour relacionado; no añadas enlaces manuales.
- San Fernando y la laguna de Busa se agrupan bajo **Girón** en el catálogo, Hero y menú, sin tarjeta de destino independiente. El detalle conserva los lugares reales visitados. Los enlaces antiguos con `?lugar=san-fernando` filtran Girón mediante `destinationAliases`.
- Guachapala ya es `CULT-002`, **Entre Montañas y Milagros**, con ficha operativa. Se conservan las URL anteriores de Guachapala, Cajas NAT-002 y Aventura en Cuadrón para no romper enlaces existentes.
- `photos`: rutas locales desde la raíz del proyecto, como `/public/assets/menu/tours/mi-foto.jpg` o `/src/assets/tours/mi-foto.jpg`. La galería obtiene dimensiones y genera versiones optimizadas automáticamente. Usa al menos cinco fotos, con textos alternativos descriptivos.
- Las subcarpetas de `src/assets/tours/` se detectan automáticamente en `images.ts`. La primera foto de cada tour es la portada del listado, los destacados de inicio y las recomendaciones de «Otra ruta, otra historia».
- Cambia `illustrativePhotos` a `false` únicamente cuando sean fotografías aprobadas del tour. Este campo identifica las fotos de ejemplo en las etiquetas accesibles, sin mostrar un aviso bajo la galería.
- `operatingDays` describe días habituales (domingo=0), **no disponibilidad en tiempo real**. La consulta nunca confirma una reserva.
- `source.pendingReview` conserva discrepancias por validar; no se renderiza ni se envía al navegador. Tras validarlas, actualiza el campo público y la nota.

## Fuente y trazabilidad

### Fotografías propias

Las 205 fotografías recibidas en octubre de 2026 están optimizadas como WebP en `src/assets/tours/`, organizadas por lugar. Máximo 2400 px en el lado largo, calidad 80, orientación corregida y sin metadatos EXIF/GPS. El optimizador reduce las dimensiones de las imágenes más pesadas hasta dejarlas por debajo de 1 MiB sin bajar la calidad configurada. Astro genera las versiones responsive y las ampliaciones de galería; no se envían los originales de cámara al navegador.

- Copia local de los originales: `tmp/tour-photo-originals/`, fuera de `public/` y excluida de Git. Conserva una copia de seguridad externa de esos originales.
- Para regenerar: `node scripts/optimize-tour-photos.mjs`. También acepta otra carpeta de origen como primer argumento; la estructura debe conservar los nombres de las carpetas recibidas. Las carpetas ausentes se omiten para admitir entregas parciales.
- Las carpetas originales `Coyotor` y `El Abuelo` se normalizan a `coyoctor` y `casa-del-abuelo` en assets.
- La segunda entrega incorpora 104 fotos de Busa, Chordeleg, Chobshi, El Chorro, la iglesia de Girón, la Makana, la Casa de los Tratados, el Pailón de Chobshi y el Templete de Tarqui: 2797,03 MiB originales → 49,24 MiB WebP (98,2 % menos).
- Se habilitan Cascada de Girón, Aventura en Girón, Compras y Artesanías, Pueblitos Mágicos y Sígsig–Chobshi. Cada galería selecciona fotografías de sus propias paradas. Los originales de ambas entregas se conservan juntos en la carpeta local indicada arriba.
- Portadas diferenciadas: Toreadora para NAT-001, casas de piedra de Dos Chorreras para NAT-002, El Chorro para NAT-003, Busa para NAT-004, plaza de Chordeleg para CULT-001, filigrana para ARTE-001 y muros de Chobshi para ARQ-002. Las portadas de destino de Girón, Chordeleg, Gualaceo y Sígsig también usan fotos propias.

### Fichas comerciales

Los once JSON en `source/` conservan todas las celdas con contenido y fórmulas de **FICHA TOUR**, con nombre del Excel y coordenadas de celda. Son snapshots internos, no contenido para mostrar directamente. No contienen otras hojas. `tourId` identifica el código normalizado del catálogo; `cells.B6` conserva el original, aunque sea incorrecto.

La única fuente para esta actualización es **FICHA TOUR**, más las decisiones del propietario: variantes de NAT-002 al mismo precio, dificultad fácil de NAT-001, dificultad sin cambios en Sígsig e intermedia en Paute, sin condiciones específicas nuevas del cuadrón y sin actualizar todavía cancelaciones, mapas ni fotografías. Los mínimos y los días salen de los campos operativos, nunca del mínimo rentable o las plantillas de venta. Los idiomas se presentan como español, con inglés sujeto a disponibilidad.

Los códigos normalizados son NAT-001 a NAT-004, NAT-006, ARQ-001, ARQ-002, CULT-001, CULT-002 y ARTE-001, más FWT-001. NAT-004 corresponde a Aventura en Girón (su ficha aún dice NAT-003); CULT-002 corresponde a Guachapala (archivo NAT-005). No renumerar las celdas originales de los snapshots.

Para volver a extraer los Excel: `python3 scripts/extract-tours.py`. Requiere Python 3, sin dependencias externas. **No sobrescribe los `.ts` editables**. Las fórmulas se conservan sin evaluarlas, incluidos enlaces. Revisa diferencias manualmente antes de actualizar el contenido público.

No publicar números de soporte de plantilla, responsables internos, tarifas netas de agencias ni logística copiada de otros tours. Las políticas de cancelación ambiguas se consultan con el equipo en lugar de prometer cancelación gratuita.

Los Excel se cargaron inicialmente en `public/tmp`; no vuelvas a colocar documentos internos ni originales de cámara allí, porque cualquier archivo bajo `public` se publica sin procesar. Los JSON de `src/data/tours/source` no se importan en la interfaz.

## Comprobaciones

- Compilación: `pnpm build`.
- Pruebas de contenido, precios, procedencia y estilos: `node --test tests/*.test.mjs` (después de compilar).
- Navegador: con Playwright y Chromium disponibles, inicia `pnpm preview --port 4322` y ejecuta `node tests/tours.browser.mjs`. También admite `BASE_URL` y `PLAYWRIGHT_MODULE` para usar otra URL o instalación externa de Playwright. No envía consultas reales.
- Listado, filtros, carruseles, hero y masonry: `node tests/catalog.browser.mjs` con el mismo servidor y variables. Incluye navegación cliente, historial, táctil landscape y fallback sin JavaScript.
- Fotografías propias: `node tests/tour-photos.browser.mjs` con el mismo servidor y variables. Comprueba hero, masonry, carga diferida de portadas y galerías en escritorio/móvil; guarda capturas en `/tmp/opencode/tour-photo-preview` (configurable con `SCREENSHOT_DIR`).
- Los filtros usan botones accesibles (`aria-expanded`) y casillas; las galerías de las tarjetas usan scroll-snap nativo, sin Embla ni observadores de tamaño. Embla se mantiene únicamente en el hero.
