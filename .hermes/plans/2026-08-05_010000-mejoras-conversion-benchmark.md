# Cóndor Expeditions — Mejoras de Conversión & Diseño (Benchmark Competitivo)

> **For Hermes:** Use subagent-driven-development skill to implement this plan task-by-task.

**Goal:** Elevar la página de Cóndor Expeditions inspirándonos en operadoras de aventura/lujo referentes (Vaya Adventures, GalapagosIslands.com, Explorateur Travel) y las mejores prácticas UX de viajes (Baymard Institute), para maximizar consultas y reservas.

**Architecture:** Sitio Astro 5 + Tailwind CSS v4 multi-página ya construido (B1–B9) y centralizado en JSON (B10–B13). Este plan añade capas de conversión (filtros, navegación por rutas de viaje, datos restar-en-tour, testimonios con países, prueba social sostenible, sello de seguridad) sobre la base existente sin cambiar el stack.

**Tech Stack:** Astro 5.17 · Tailwind 4 · pnpm · JSON data · Formspree · TypeScript.

---

## Contexto actual (para el implementador)

- Proyecto en `D:\Coders\00_activos\opeconexp_web`, rama `feature/design-system-tourism`.
- 12 páginas: 6 ES (`/`, `/destinos`, `/experiencias`, `/nosotros`, `/contacto`, `/gracias`) + 6 EN (`/en/...`).
- Datos centralizados en `src/data/company.json`, `destinos.json`, `experiencias.json`, `equipo.json`.
- `site.config.ts` y `content.ts` leen de los JSON (fuente única).
- `hero.astro` usa video; secciones del home en `src/components/sections/`.
- Formulario apunta a `https://formspree.io/f/YOUR_FORM_ID` (placeholder — el usuario debe crear el form).
- Build verify: `pnpm build` → esperar *"12 page(s) built"*.

---

## Informe de análisis (qué hacen bien los referentes → qué implementamos)

### A. Vaya Adventures (tailor-made luxury)
- **A1.** Tarjetas de tour con 3 datos de decisión visibles: **Días | Precio desde | Nombre**. → Home: tarjetas de experiencia con badge "Desde $X · N días".
- **A2.** Iconos de diferenciales (propiedades boutique, reviews 5★, guías locales, comida, turismo responsable). → Sección "¿Por qué nosotros?" con iconos SVG nativos (ya hay 4 cards de texto; añadir iconos + 2 más: turismo responsable, guías locales).
- **A3.** Testimonios con nombre + apellido + ciudad ("David R. Hough"). → Ya tenemos `country` en testimonios; añadir **ciudad** para realismo.
- **A4.** Trofeos de confianza/certificaciones al pie (IGTOA, TIES). → Franja "sostenibilidad/certificaciones" en footer o sobre CTA.
- **A5.** CTA persistente "Request a Quote" con teléfono. → Botón flotante de WhatsApp persistente (móvil).

### B. GalapagosIslands.com (conversión directa)
- **B1.** **Carrusel "Top 10 Best Sellers"** con precio, rating ★ y duración en cada card. → Sección "Mejores ventas" en Experiencias.
- **B2.** Filtros por tipo (Cruise/Scuba/Land) y por precio (Luxury/First Class/Mid/Budget). → Filtros de experiencia por categoría + dificultad en `/experiencias`.
- **B3.** Stats animadas (0 viajeros, 0 años, 0 botes) con contador. → Ya hay StatsBar; convertir valores a contadores animados con IntersectionObserver.
- **B4.** Chat widget persistente. → Botón flotante WhatsApp (mismo que A5).

### C. Explorateur Travel (editorial emocional)
- **C1.** Headline aspiracional ("as unique as you are"). → Hero con claim corto y emotivo bajo el título.
- **C2.** Testimoniales destacados con contexto de viaje ("Italy Anniversary Trip"). → Añadir nombre de expedición al testimonio.
- **C3.** Secciones de servicio segmentadas por tipo de viajero (solo, luna de miel, familia). → Landing por público en servicios.

### D. Baymard Direct (estadísticas sector viajes)
- **D1.** **40% de sitios no ofrecen filtros específicos de industria** → añadir filtros (categoría, dificultad, duración) en `/experiencias`. *(Alta prioridad)*
- **D2.** **83% no muestran info detallada del tour** → cada experiencia necesita ficha completa: itinerario día a día, qué incluye/no incluye, física requerida. → Página de detalle de tour.
- **D3.** **57% no incluyen mapa en la página de tour** → mapa (Google Maps embed) en página de detalle de destino/tour.
- **D4.** **85% no enlazan reviews de terceros** → enlaces a TripAdvisor / Google Reviews con stars en tarjetas y detalle.
- **D5.** Upselling de "Experiencias relacionadas" al pie de cada tour.

---

## Plan de tareas

### Task 1: Iconos SVG en "¿Por qué nosotros?" (A2)
**Objetivo:** Reemplazar emojis por iconos SVG en línea para consistencia visual premium.

**Files:**
- Modify: `src/data/content.ts` (`differentiators`) — añadir campo `icon: 'svg'` 
- Modify: `src/components/sections/WhyUsSection.astro`

**Pasos:**
1. Añadir 2 diferenciales nuevos en `content.ts`: `Turismo Responsable` y `Guías Locales Certificados` (total 6).
2. En `WhyUsSection.astro`, pintar icono SVG inline (inline en un `<svg>`, sin librería) dentro de cada card.
3. Verificar: `pnpm build` exitoso.
4. Commit: `feat(conv): iconos SVG y +2 diferenciales en ¿Por qué nosotros?`

### Task 2: Testimonios con ciudad + expedición + estrellas (A3, C2)
**Objetivo:** Aumentar credibilidad con testimonios más reales y estrellas de review.

**Files:**
- Modify: `src/data/content.ts` (`testimonials`) — añadir `city` y `stars` a cada uno
- Modify: `src/components/sections/TestimonialsSection.astro`

**Pasos:**
1. Añadir `city` (ej. "Madrid, España") y `stars: 5` a cada testimonial.
2. Renderizar 5 estrellas ★ en color ámbar `text-amber-500` y el campo ciudad.
3. Verificar build. 4. Commit.

### Task 3: Filtros de experiencia en `/experiencias` (B2, D1)
**Objetivo:** Permitir filtrar por categoría, dificultad y duración — la y falta más común según Baymard (40% no la ofrecen).

**Files:**
- Modify: `src/data/experiencias.json` (si falta campo `duracionDias` numérico)
- Modify: `src/pages/experiencias.astro` (ES)
- Modify: `src/pages/en/experiencias.astro` (EN)

**Pasos (en ES primero):**
1. En `experiencias.astro`, añadir barra de filtros (botones categoria: Todas / Trekking / Rafting / etc.).
2. Lógica de filtrado en el frontmatter (cada estado es una URL query ?cat=trekking) → en Astro estático puedes generar grupos, o usar un `<script>` con vanilla JS para filtrar client-side.
   - **Decisión sugerida (DRY/YAGNI):** filtrado client-side con `<script>` vanilla (sin JS framework). Chips clickeables filtran la grid.
3. Dificultad y duración como badges ya presentes; añadir filtro combinado simple.
4. Verificar build. Commit: `feat(conv): filtros por categoría en experiencias (client-side)`

### Task 4: Botón flotante persistente de WhatsApp (A5, B4)
**Objetivo:** Canal de consulta/reserva siempre visible (especialmente móvil).

**Files:**
- Create: `src/components/WhatsAppFloat.astro`
- Modify: `src/layouts/Layout.astro` — renderizar `<WhatsAppFloat />` antes de `</body>`
- Data: usar `company.contact.whatsapp` de `company.json`

**Pasos:**
1. Crear componente con botón verde flotante fijo (`fixed bottom-5 right-5 z-50`), logo WhatsApp SVG, shrink en scroll (opcional).
2. Enlazar a `company.contact.whatsapp` (pre-link con Hello).
3. Insertar en Layout. Verificar build. Commit.

### Task 5: Contadores animados en StatsBar (B3)
**Objetivo:** Dinamismo visual; números que "cuentan" al llegar al viewport.

**Files:**
- Modify: `src/components/sections/StatsBar.astro`
- Data: `src/data/content.ts` (`stats`) — añadir `suffix` ("+", "%") y valor numérico

**Pasos:**
1. Añadir en `stats` objetos `{ value: 15, suffix: "+", label: "Años de experiencia" }`.
2. En StatsBar, `<script>` con IntersectionObserver que anime el contador de 0→valor.
3. Verificar build. Commit.

### Task 6: Franja de sostenibilidad / certificaciones (A4)
**Objetivo:** Prueba social de turismo responsable (referentes la muestran al pie).

**Files:**
- Create: `src/components/sections/SustainabilityBar.astro`
- Modify: `src/pages/index.astro` — insertar sobre el CTA final
- Data: crear `src/data/sostenibilidad.json` con 3–4 credenciales (aptas) y textos

**Pasos:**
1. Crear `sostenibilidad.json` con campos: `icono` (id), `titulo`, `tituloEn`, `texto`.
2. Componente con 3–4 items de compromiso (guías locales, límite de grupo, apoyo comunitario, mínimo impacto).
3. Insertar en home. Verificar build. Commit.

### Task 7: Página de detalle de tour + mapa + reviews (D2, D3, D4)
**Objetivo:** Ficha completa por experiencia (83% la omiten) + mapa (57% lo omiten) + enlace a reviews de terceros (85% los omiten).

**Files:**
- Create: `src/pages/experiencias/[slug].astro` (ES) y `src/pages/en/experiencias/[slug].astro` (EN)
- Modify: `src/data/experiencias.json` — añadir por experiencia: `slug`, `ficha` (quién va / qué incluye / qué no incluye / qué llevar / dificultad física), `mapaUrl` (opcional), `resenasUrl` (TripAdvisor/Google)
- Modify: `src/pages/experiencias.astro` — tarjetas enlazan a detalle

**Pasos (una experiencia piloto primero — modelar el patrón):**
1. Añadir a `experiencias.json` la estructura de ficha en 2–3 experiencias.
2. Crear página `[slug].astro` con `getStaticPaths()` que renderice: hero, badges, ficha día-a-día, qué incluye/no incluye, mapa embebido (iframe Google Maps), botones "Reservar" (WA) y "Diseña tu expedición", sección de reviews externos con link, y "Experiencias relacionadas".
3. Tarjetas en Experiencias → `<a href={...}>`.
4. Verificar build genera páginas `[slug]`. Commit.

### Task 8: Claims aspiracionales en Hero (C1)
**Objetivo:** Headline emocional y corto, estilo "Experiencia. Expand. Explore."

**Files:**
- Modify: `src/components/Hero.astro` (ES) y EN

**Pasos:**
1. Ajustar H1 con sub-claim corto (ej. "Donde los Andes besan la selva").
2. Mantener CTA "Reservar" + añadir micro-CTAs de anclaje a destinos.
3. Verificar build y preview. Commit.

---

## Resumen de archivos por tipo

| Tipo | Archivos |
|---|---|
| **Crear** | `WhatsAppFloat.astro`, `SustainabilityBar.astro`, `experiencias/[slug].astro` (ES+EN), `sostenibilidad.json` |
| **Modificar** | `content.ts`, `WhyUsSection.astro`, `TestimonialsSection.astro`, `StatsBar.astro`, `experiencias.astro` (ES+EN), `index.astro`, `Hero.astro`, `experiencias.json`, `Layout.astro` |

## Orden de ejecución (por impacto / dependencia)

1. **Task 3** (Filtros) — mayor impacto según Baymard (40%)
2. **Task 7** (Detalle de tour) — segundo mayor (83%)
3. **Task 4** (WhatsApp float) — rápida, alta conversión móvil
4. **Task 1** + **Task 2** (diferenciales + testimonios) — pulido de credibilidad
5. **Task 5** (Stats animados) — dinamismo
6. **Task 8** (Hero claim) — copy
7. **Task 6** (Sostenibilidad) — prueba social

## Verificación / validación

- **Por tarea:** `pnpm build` → *"N page(s) built"* sin errores.
- **Global:** `pnpm dev` local y recorrer: home, destinos, experiencias (con filtros), detalle de tour (mapa + reviews), contacto. Usuario revisa en pantalla antes de merge (puerto 4433 local si él lo pide; nunca servidor sin pedirlo).
- **i18n:** verificar EN en todas las rutas `/en/`.
- **Consistencia:** tras cada cambio de JSON, correr el script ad-hoc de validación de claves (JSON parseables + site.config/content.ts mapean).

## Riesgos y consideraciones

- **Filtros client-side:** no framework JS — vanilla `<script>`; mantener accesible (botones `<button>` con `aria-pressed`).
- **Iframe de mapas:** Google Maps embed sin API key (embed público por dirección) para no quemar cuota.
- **Reviews de terceros:** solo enlazar si la empresa tiene perfiles reales (TripAdvisor/Google Business) — verificar con el usuario antes de publicar URLs inventadas.
- **Formspree:** sigue en `YOUR_FORM_ID` hasta que el usuario cree el form; no publicar con placeholder.
- **Precios:** no inventar precios reales si no existen; si no hay tarifas públicas, usar "Desde / a medida" o omitir el precio y priorizar "Solicitar itinerario".
- **Imágenes reales:** placeholders con gradiente siguen presentes; el detalle de tour necesita fotos reales o mantener placeholders elegantes.

## Preguntas abiertas

1. ¿Hay tarifas públicas de las expediciones para mostrar, o preferimos "Solicitar itinerario"?
2. ¿La empresa tiene perfiles de TripAdvisor / Google Reviews reales para enlazar?
3. ¿Prefieres mostrar un mapa embebido en el detalle de tour o solo en Contacto?