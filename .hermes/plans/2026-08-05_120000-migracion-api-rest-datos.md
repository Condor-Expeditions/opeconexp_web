# Migración a Arquitectura de Datos Tipo API REST

> **For Hermes:** Use subagent-driven-development skill to implement this plan task-by-task.

**Goal:** Migrar el sistema de datos del sitio Cóndor Expeditions de archivos JSON planos a una arquitectura normalizada con catálogos separados, referencias por ID y una capa de acceso (helpers) que abstraiga el storage.

**Architecture:** Crear `src/data/api/` con subdirectorios por recurso. Normalizar datos: extraer catálogos de categorías, regiones, tags, operadores y puntos de encuentro. Los tours usarán solo referencias (IDs) a estos catálogos. Crear helpers como única interfaz para el frontend.

**Tech Stack:** Astro 5.17 + TypeScript. Sin dependencias nuevas.

---

## Fase 1 — Reporte de Auditoría

### Archivos JSON actuales (6)

| Archivo | Líneas | Consumidores directos |
|---|---|---|
| `src/data/tours.json` | 261 | 8 páginas (tours/index, [region], [slug], temporada × ES/EN) |
| `src/data/experiencias.json` | 176 | 4 páginas (experiencias, [slug] × ES/EN) + content.ts |
| `src/data/company.json` | 26 | 12 archivos (site.config, WhatsAppFloat, 10 páginas) |
| `src/data/equipo.json` | 40 | content.ts |
| `src/data/destinos.json` | 80 | content.ts |
| `src/data/sostenibilidad.json` | 32 | SustainabilityBar.astro |

### Archivos .ts que envuelven datos (3)

| Archivo | Función |
|---|---|
| `src/data/site.config.ts` | Wrapper tipado sobre company.json |
| `src/data/content.ts` | Wrapper que re-exporta destinos/experiencias/equipo + hardcodea testimonials/stats/differentiators |
| `src/data/navigation.ts` | Define NAV (independiente de JSON, se queda como está) |
| `src/data/routes.ts` | (No se usa en navbar nuevo, eliminar en limpieza) |

### Páginas y componentes afectados (total: **22 archivos .astro + 2 .ts**)

**Páginas que consumen tours.json (8):**
- `src/pages/tours/index.astro` — catálogo con filtros
- `src/pages/tours/[region].astro` — filtro por región
- `src/pages/tours/[slug].astro` — detalle de tour
- `src/pages/tours/temporada.astro` — tours por temporada
- `src/pages/en/tours/` — mismas 4 rutas en EN

**Páginas que consumen experiencias.json (4):**
- `src/pages/experiencias.astro` + `src/pages/en/experiencias.astro`
- `src/pages/experiencias/[slug].astro` + `src/pages/en/experiencias/[slug].astro`

**Páginas que consumen company.json (10):**
- `src/pages/contacto.astro`, `faq.astro`, `personalizados.astro` + EN
- `src/pages/en/experiencias/[slug].astro`
- `src/pages/en/tours/[region].astro`, `[slug].astro`
- `src/pages/tours/[region].astro`, `[slug].astro`

**Componentes que consumen data (6):**
- `WhatsAppFloat.astro` — company.json
- `SustainabilityBar.astro` — sostenibilidad.json
- `Footer.astro` + `BaseHead.astro` — site.config (wrapper)
- `DestinationsSection.astro`, `ExperiencesSection.astro` — content.ts
- `StatsBar.astro`, `TestimonialsSection.astro`, `WhyUsSection.astro` — content.ts

### Riesgos identificados

1. **Duplicidad tours ↔ experiencias**: 11 tours aparecen en AMBOS archivos con estructuras diferentes (tours.json tiene flat array; experiencias.json tiene agrupación por categoría con campos extra como mapEmbed, reviewUrl, durationDays). Corregir: unificar en tours.json, experiencias.json se vuelve obsoleto.
2. **Nombres visibles en textos duplicados**: los `types[]` en tours.json son strings literales ("trekking", "rafting") que se mapean a labels en cada página. Deben migrar a referencias de catálogo.
3. **Datos hardcodeados en content.ts**: testimonials, stats, differentiators son arrays fijos. Estos deben ir a JSON o al catálogo de settings.
4. **Riesgo de build roto**: cada paso debe mantener el build funcionando (88 páginas). Se requiere un archivo de compatibilidad temporal.
5. **i18n**: actualmente los nombres visibles están en ES con campos `titleEn` ad-hoc. Los catálogos deben tener `title` y `titleEn`.

---

## Fase 2 — Nueva Estructura de Datos

```
src/data/api/
├── tours/
│   ├── items.json          ← tours normalizados con referencias por ID
│   ├── categories.json     ← {id, slug, title, titleEn, icon}
│   ├── regions.json        ← {id, slug, title, titleEn}
│   ├── tags.json           ← {id, slug, title, titleEn}
│   ├── operators.json      ← {id, name, phone, email, logo}
│   └── meeting-points.json ← {id, title, titleEn, location, maps}
├── company/
│   └── company.json        ← misma estructura que hoy, limpia (extraer socials como catalogo opcional)
├── team/
│   └── team.json           ← migrado de equipo.json
├── sustainability/
│   └── items.json          ← migrado de sostenibilidad.json
└── settings/
    ├── testimonials.json   ← testimonios extraídos de content.ts
    └── stats.json          ← stats extraídos de content.ts
```

Los archivos antiguos NO se eliminan hasta la Fase 7.

---

## Fase 3 — Normalización de Catálogos

### categories.json

```json
[
  { "id": "trekking", "slug": "trekking", "icon": "🥾", "title": { "es": "Trekking & Senderismo", "en": "Trekking & Hiking" } },
  { "id": "rafting", "slug": "rafting", "icon": "🛶", "title": { "es": "Rafting y Kayak", "en": "Rafting & Kayaking" } },
  { "id": "montanismo", "slug": "mountaineering", "icon": "🧗", "title": { "es": "Montañismo y Escalada", "en": "Mountaineering & Climbing" } },
  { "id": "selva", "slug": "jungle", "icon": "🐒", "title": { "es": "Expediciones de Selva", "en": "Jungle Expeditions" } },
  { "id": "cultural", "slug": "cultural", "icon": "🏛️", "title": { "es": "Cultural y Comunitario", "en": "Cultural & Community" } },
  { "id": "city-tour", "slug": "city-tour", "icon": "🏙️", "title": { "es": "City Tour", "en": "City Tour" } }
]
```

### regions.json

```json
[
  { "id": "cuenca", "slug": "cuenca", "title": { "es": "Cuenca", "en": "Cuenca" } },
  { "id": "azuay", "slug": "azuay", "title": { "es": "Azuay", "en": "Azuay" } },
  { "id": "ecuador", "slug": "ecuador", "title": { "es": "Ecuador", "en": "Ecuador" } }
]
```

### tags.json

```json
[
  { "id": "cajas", "slug": "cajas", "title": { "es": "Parque Nacional Cajas", "en": "Cajas National Park" } },
  { "id": "cotopaxi", "slug": "cotopaxi", "title": { "es": "Volcán Cotopaxi", "en": "Cotopaxi Volcano" } },
  { "id": "chimborazo", "slug": "chimborazo", "title": { "es": "Chimborazo", "en": "Chimborazo" } }
]
```

### meeting-points.json

```json
[
  { "id": "parque-calderon", "title": { "es": "Parque Calderón", "en": "Calderón Park" }, "location": { "lat": -2.8974, "lng": -79.0045 } }
]
```

### difficulties.json

```json
[
  { "id": "principiante", "level": 1, "title": { "es": "Principiante", "en": "Beginner" } },
  { "id": "facil", "level": 1.5, "title": { "es": "Fácil", "en": "Easy" } },
  { "id": "suave-moderado", "level": 2, "title": { "es": "Suave-Moderado", "en": "Easy-Moderate" } },
  { "id": "moderado", "level": 3, "title": { "es": "Moderado", "en": "Moderate" } },
  { "id": "intermedio", "level": 3.5, "title": { "es": "Intermedio", "en": "Intermediate" } },
  { "id": "intermedio-avanzado", "level": 4, "title": { "es": "Intermedio-Avanzado", "en": "Intermediate-Advanced" } },
  { "id": "avanzado", "level": 4.5, "title": { "es": "Avanzado", "en": "Advanced" } },
  { "id": "dificil", "level": 5, "title": { "es": "Difícil", "en": "Hard" } },
  ]
```

### items.json (Tour normalizado — ejemplos de todos los tipos)

```json
{
  "items": [
    {
      "id": "city-tour-cuenca",
      "slug": "city-tour-cuenca",
      "type": "tour",
      "status": "active",
      "title": { "es": "City Tour Cuenca Patrimonial", "en": "Cuenca Heritage City Tour" },
      "description": { "es": "Recorrido peatonal por el centro histórico de Cuenca, Patrimonio Cultural de la Humanidad.", "en": "Walking tour through Cuenca's historic center, a UNESCO World Heritage site." },
      "categories": ["cultural", "city-tour"],
      "regions": ["cuenca"],
      "tags": [],
      "operator": "condor-expeditions",
      "meetingPoint": "parque-calderon",
      "duration": "3h",
      "difficulty": "facil",
      "prices": [
        { "label": { "es": "Adulto", "en": "Adult" }, "amount": 25, "currency": "USD" }
      ],
      "includes": [
        { "icon": "🧑‍🏫", "text": { "es": "Guía bilingüe certificado", "en": "Certified bilingual guide" } },
        { "icon": "🎫", "text": { "es": "Entrada a Catedral Nueva y Museo de las Conceptas", "en": "Entrance to New Cathedral and Conceptas Museum" } },
        { "icon": "🍦", "text": { "es": "Degustación de helados artesanales", "en": "Artisan ice cream tasting" } }
      ],
      "schedules": [
        { "start": "09:00", "end": "12:00", "days": ["mon","tue","wed","thu","fri","sat","sun"] },
        { "start": "12:00", "end": "15:00", "days": ["mon","tue","wed","thu","fri","sat","sun"] },
        { "start": "14:00", "end": "17:00", "days": ["mon","tue","wed","thu","fri","sat","sun"] }
      ],
      "gallery": [],
      "seo": {
        "title": { "es": "City Tour Cuenca Patrimonial", "en": "Cuenca Heritage City Tour" },
        "description": { "es": "Descubre Cuenca a pie con guías locales.", "en": "Discover Cuenca on foot with local guides." }
      },
      "createdAt": "2025-01-01",
      "updatedAt": "2026-08-05"
    },
    {
      "id": "cajas-trekking",
      "slug": "cajas-trekking",
      "type": "tour",
      "status": "active",
      "title": { "es": "Trekking al Parque Nacional Cajas", "en": "Cajas National Park Trekking" },
      "description": { "es": "Aventura de día completo en uno de los parques nacionales más hermosos de Ecuador.", "en": "Full-day adventure in one of Ecuador's most beautiful national parks." },
      "categories": ["trekking"],
      "regions": ["cuenca"],
      "tags": ["cajas"],
      "operator": "condor-expeditions",
      "meetingPoint": "parque-calderon",
      "duration": "4h30m",
      "difficulty": "moderado",
      "prices": [
        { "label": { "es": "Adulto", "en": "Adult" }, "amount": 55, "currency": "USD" }
      ],
      "includes": [
        { "icon": "🚐", "text": { "es": "Transporte desde Cuenca", "en": "Transport from Cuenca" } },
        { "icon": "🧑‍🏫", "text": { "es": "Guía certificado", "en": "Certified guide" } },
        { "icon": "🥾", "text": { "es": "Bastones de trekking", "en": "Trekking poles" } },
        { "icon": "🍱", "text": { "es": "Box lunch", "en": "Box lunch" } }
      ],
      "schedules": [
        { "start": "08:30", "days": ["wed","thu","fri","sat","sun"] },
        { "start": "14:00", "days": ["wed","thu","fri","sat","sun"] }
      ],
      "gallery": [],
      "seo": {
        "title": { "es": "Trekking Parque Nacional Cajas", "en": "Cajas National Park Trekking" },
        "description": { "es": "200+ lagunas glaciares, cóndores y senderos de páramo.", "en": "200+ glacial lakes, condors and páramo trails." }
      },
      "createdAt": "2025-01-01",
      "updatedAt": "2026-08-05"
    },
    {
      "id": "alausi-3d-2n",
      "slug": "alausi-tren-dunas-3d",
      "type": "tour",
      "status": "active",
      "title": { "es": "Alausí: Tren, Cultura y Aventura 3D/2N", "en": "Alausí: Train, Culture & Adventure 3D/2N" },
      "description": { "es": "Viaje a Alausí, descubre la Nariz del Diablo en tren, las dunas del desierto y la cultura andina.", "en": "Trip to Alausí: Devil's Nose by train, desert dunes and Andean culture." },
      "categories": ["cultural", "trekking"],
      "regions": ["ecuador"],
      "tags": [],
      "operator": "condor-expeditions",
      "meetingPoint": "parque-calderon",
      "duration": "3d",
      "difficulty": "facil",
      "prices": [
        { "label": { "es": "Por persona", "en": "Per person" }, "amount": 320, "currency": "USD" }
      ],
      "includes": [
        { "icon": "🚐", "text": { "es": "Transporte Cuenca - Alausí - Cuenca", "en": "Transport Cuenca - Alausí - round trip" } },
        { "icon": "🧑‍🏫", "text": { "es": "Guía bilingüe durante todo el viaje", "en": "Bilingual guide throughout the trip" } },
        { "icon": "🏨", "text": { "es": "2 noches Hotel Colombia", "en": "2 nights Hotel Colombia" } },
        { "icon": "🍽️", "text": { "es": "Desayuno y almuerzo todos los días", "en": "Breakfast and lunch all 3 days" } },
        { "icon": "🚂", "text": { "es": "Boleto Tren Nariz del Diablo", "en": "Devil's Nose train ticket" } }
      ],
      "schedules": [
        {
          "start": "2026-06-15T08:00",
          "end": "2026-06-17T16:00",
          "days": []
        }
      ],
      "itinerary": [
        {
          "day": 1,
          "stops": [
            { "time": "08:00", "title": { "es": "Salida desde Cuenca", "en": "Departure from Cuenca" } },
            { "time": "10:30", "title": { "es": "Visita Punta A — Mirador del Tren", "en": "Stop A – Train viewpoint" } },
            { "time": "13:00", "title": { "es": "Almuerzo en Punta B", "en": "Lunch at Stop B" } },
            { "time": "15:00", "title": { "es": "Visita Punta C — Laguna de Colta", "en": "Stop C – Colta Lagoon" } },
            { "time": "19:00", "title": { "es": "Check-in Hotel Colombia", "en": "Check-in Hotel Colombia" } }
          ],
          "meals": ["breakfast", "lunch"],
          "meals_not_included": ["dinner"],
          "highlights": [
            { "es": "Laguna de Colta y mirador del tren", "en": "Colta Lagoon and train viewpoint" }
          ]
        },
        {
          "day": 2,
          "stops": [
            { "time": "07:00", "title": { "es": "Desayuno en hotel", "en": "Breakfast at hotel" } },
            { "time": "08:30", "title": { "es": "Punto D — Nariz del Diablo en Tren (ida y vuelta)", "en": "Stop D – Devil's Nose by Train (round trip)" } },
            { "time": "12:00", "title": { "es": "Almuerzo en Sibambe", "en": "Lunch in Sibambe" } },
            { "time": "14:00", "title": { "es": "Punto E — Dunas de Palmira (escalada en arena)", "en": "Stop E – Palmira Dunes (sand climbing)" } },
            { "time": "17:00", "title": { "es": "Punto F — Mirador del Cóndor", "en": "Stop F – Condor Viewpoint" } },
            { "time": "19:00", "title": { "es": "Check-in Hotel Colombia", "en": "Check-in Hotel Colombia" } }
          ],
          "meals": ["breakfast", "lunch"],
          "meals_not_included": ["dinner"],
          "activities": ["escalada_en_dunas", "tren_nariz_diabla"]
        },
        {
          "day": 3,
          "stops": [
            { "time": "07:00", "title": { "es": "Desayuno y check-out", "en": "Breakfast &amp; check-out" } },
            { "time": "08:30", "title": { "es": "Punto G — Cascada El Chorro", "en": "Stop G – El Chorro Waterfall" } },
            { "time": "10:00", "title": { "es": "Punto K — Tren de Descenso Alausí", "en": "Stop K – Alausí descent train" } },
            { "time": "13:00", "title": { "es": "Almuerzo y retorno a Cuenca", "en": "Lunch and return to Cuenca" } },
            { "time": "16:00", "title": { "es": "Llegada a Cuenca", "en": "Arrival in Cuenca" } }
          ],
          "meals": ["breakfast", "lunch"],
          "meals_not_included": ["dinner"]
        }
      ],
      "accommodations": [
        {
          "id": "hotel-colombia",
          "name": "Hotel Colombia",
          "url": "https://www.hotelcolombia.com.ec",
          "phone": "+593 3 2930 111",
          "used_on_days": [1, 2]
        }
      ],
      "gallery": [],
      "seo": {
        "title": { "es": "Tren, Dunas y Cultura en Alausí 3D/2N", "en": "Train, Dunes & Culture in Alausí 3D/2N" },
        "description": { "es": "Nariz del Dragón en tren, dunas de Palmira, cultura andina.", "en": "Devil's Nose train, Palmira dunes, Andean culture." }
      },
      "createdAt": "2025-01-01",
      "updatedAt": "2026-08-05"
    }
  ]
}
```

---

## Plan de Implementación (Tareas)

### Task 1: Crear `src/data/api/` con catálogos base

**Objective:** Crear estructura de directorios y archivos de catálogos (categories.json, regions.json, tags.json, operators.json, meeting-points.json). Los datos se extraen de los valores actuales en tours.json/experiencias.json.

**Files:**
- Create: `src/data/api/tours/categories.json`
- Create: `src/data/api/tours/regions.json`
- Create: `src/data/api/tours/tags.json`
- Create: `src/data/api/tours/operators.json`
- Create: `src/data/api/tours/meeting-points.json`
- Create: `src/data/api/tours/difficulties.json`

**Verification:** `pnpm build` — debe seguir compilando (nadie importa estos archivos aún).

### Task 2: Crear `src/data/api/tours/items.json` con tours normalizados

**Objective:** Reescribir el array de tours con referencias por ID a los catálogos de la Task 1. Nuevos campos: `status`, `description`, `prices[]`, `itinerary[]`, `schedules[]`, `seo`, `createdAt`.

**Files:**
- Create: `src/data/api/tours/items.json` (18 tours normalizados)

**Verification:** `pnpm build` — debe seguir compilando (nadie importa este archivo aún).

### Task 3: Migrar company.json y content.ts a `src/data/api/`

**Objective:** Mover company.json a `src/data/api/company/company.json`. Extraer testimonials y stats a `src/data/api/settings/testimonials.json` y `stats.json`. Mover equipo.json a `src/data/api/team/team.json`. Mover sostenibilidad.json a `src/data/api/sustainability/items.json`.

**Files:**
- Create: `src/data/api/company/company.json` (copia de company.json)
- Create: `src/data/api/settings/testimonials.json`
- Create: `src/data/api/settings/stats.json`
- Create: `src/data/api/team/team.json`
- Create: `src/data/api/sustainability/items.json`

**Verification:** `pnpm build` — debe seguir compilando.

### Task 4: Crear `src/data/helpers.ts` — capa de acceso a datos

**Objective:** Crear helpers que abstraen el acceso a los JSON. Todas las funciones devuelven datos tipados. Usan `import` de los archivos en `api/`. Nunca se importa un JSON directamente desde páginas/componentes después de esta task.

**Files:**
- Create: `src/data/helpers.ts`

**API:**
```typescript
// Tours
getTours(filters?: { region?: string; category?: string; season?: string }) => Tour[]
getTour(slug: string) => Tour | undefined
getToursByRegion(regionId: string) => Tour[]
getToursByCategory(categoryId: string) => Tour[]

// Catálogos
getCategories() => Category[]
getCategory(id: string) => Category | undefined
getRegions() => Region[]
getRegion(id: string) => Region | undefined
getTags() => Tag[]
getTag(id: string) => Tag | undefined

// Resolución de referencias
getOperator(id: string) => Operator | undefined
getMeetingPoint(id: string) => MeetingPoint | undefined
getDifficulty(id: string) => Difficulty | undefined

// Company
getCompany() => Company

// Helpers de visualización
resolveLabel(item: { title: Record<string, string> }, lang: string, fallbackLang?: string) => string
formatPrice(amount: number, currency?: string) => string

// Equipo / Sostenibilidad / Settings
getTeam() => TeamMember[]
getSustainability() => SustainabilityItem[]
getTestimonials() => Testimonial[]
getStats() => Stat[]
```

**Tipos incluidos en helpers.ts:**
```typescript
interface Tour {
  id: string; slug: string; type: "tour" | "custom"; status: "draft" | "active" | "hidden" | "archived";
  title: Record<string, string>; description: Record<string, string>;
  categories: string[]; regions: string[]; tags: string[];
  operator: string; meetingPoint: string;
  duration: string; difficulty: string;
  prices: Price[]; includes: Include[];
  itinerary?: ProgramDay[]; schedules: Schedule[];
  accommodations?: Accommodation[];
  gallery: MediaItem[]; seo: SeoMeta;
  createdAt: string; updatedAt: string;
}
interface Price { label: Record<string, string>; amount: number; currency: string; }
interface Include { icon: string; text: Record<string, string>; }
interface Schedule {
  start: string; end?: string;
  days: string[];
}
interface ProgramDay {
  day: number;
  stops: ProgramStop[];
  meals: string[];
  meals_not_included: string[];
  highlights?: Record<string, string>[];
  activities?: string[];
}
interface ProgramStop { time: string; title: Record<string, string>; }
interface Accommodation {
  id: string; name: string;
  url?: string; phone?: string;
  used_on_days: number[];
}
interface Category { id: string; slug: string; icon: string; title: Record<string, string>; }
interface Region { id: string; slug: string; title: Record<string, string>; }
interface Tag { id: string; slug: string; title: Record<string, string>; }
interface MeetingPoint { id: string; title: Record<string, string>; location: { lat: number; lng: number }; }
interface Difficulty { id: string; level: number; title: Record<string, string>; }
interface Operator { id: string; name: string; phone: string; email: string; logo: string; }
interface SeoMeta { title: Record<string, string>; description: Record<string, string>; }

**Verification:** `pnpm build` — debe compilar sin errores de tipo. Los helpers exportan funciones que se pueden importar desde páginas.

### Task 5: Refactor páginas de tours (8 archivos)

**Objective:** Reemplazar `import tours from "...tours.json"` por `import { getTours, getTour, getCategories, getRegions, resolveLabel } from "../../data/helpers"`. Usar `resolveLabel(getCategory(t), "es")` para resolver nombres visibles.

**Files:**
- Modify: `src/pages/tours/index.astro`
- Modify: `src/pages/tours/[region].astro`
- Modify: `src/pages/tours/[slug].astro`
- Modify: `src/pages/tours/temporada.astro`
- Modify: `src/pages/en/tours/index.astro`
- Modify: `src/pages/en/tours/[region].astro`
- Modify: `src/pages/en/tours/[slug].astro`
- Modify: `src/pages/en/tours/temporada.astro`

**Changes resumen:**
- `import tours from "..."` → `import { getTours, getRegions } from "..."`
- `tours.tours.filter(...)` → `getTours({ region: "...", category: "..." })`
- `tour.types.map(t => tipoLabels[t])` → `resolveLabel(getCategory(t) ?? { lang: {} }, "es")`
- `regionLabels[tour.region]` → `resolveLabel(getRegion(tour.regions[0]) ?? { lang: {} }, "es")`

**Verification:** `pnpm build` — 88 páginas. Las páginas de tours funcionan igual visualmente.

### Task 6: Refactor páginas de experiencias (4 archivos)

**Objective:** Migrar las 4 páginas de experiencias a usar los helpers. Nota: experiencias.json se vuelve obsoleto. Los 11 tours que estaban en experiencias.json ya están en tours/items.json. Las páginas `/experiencias` ahora consultan `getTours()` y filtran por categorías. Las páginas `[slug]` de experiencias redirigen o renderizan desde los helpers.

**Files:**
- Modify: `src/pages/experiencias.astro`
- Modify: `src/pages/experiencias/[slug].astro`
- Modify: `src/pages/en/experiencias.astro`
- Modify: `src/pages/en/experiencias/[slug].astro`

**Changes:**
- `import experiencias from "...experiencias.json"` → `import { getTours, getCategories } from "..."`
- Filtros por categoría usan `getTours({ category })`
- Detalle de tour usa `getTour(slug)` y resuelve referencias

**Verification:** `pnpm build` — debe seguir compilando.

### Task 7: Refactor company consumers (12 archivos)

**Objective:** Reemplazar todos los `import company from "...company.json"` por `import { getCompany } from "...helpers"`.

**Files (12):**
- `WhatsAppFloat.astro`, `site.config.ts`
- `contacto.astro`, `faq.astro`, `personalizados.astro` + EN
- `en/experiencias/[slug].astro`
- `en/tours/[region].astro`, `en/tours/[slug].astro`
- `tours/[region].astro`, `tours/[slug].astro`

**Verification:** `pnpm build` — debe compilar.

### Task 8: Refactor sustainability, equipo, content.ts

**Objective:** 
- `SustainabilityBar.astro` → usar `getSustainability()`
- `content.ts` → eliminar imports de destinos.json y experiencias.json; lo que se usa del home se obtiene via helpers
- `DestinationsSection.astro` → usar `getDestinations()` (nuevo helper)
- `ExperiencesSection.astro` → usar `getTours()`
- `WhyUsSection`, `TestimonialsSection`, `StatsBar` → usar `getDifferentiators()`, `getTestimonials()`, `getStats()`

**Files:**
- Modify: `src/components/sections/SustainabilityBar.astro`
- Modify: `src/components/sections/DestinationsSection.astro`
- Modify: `src/components/sections/ExperiencesSection.astro`
- Modify: `src/components/sections/WhyUsSection.astro`
- Modify: `src/components/sections/TestimonialsSection.astro`
- Modify: `src/components/sections/StatsBar.astro`
- Modify: `src/data/content.ts` (simplificar o eliminar)

**Verification:** `pnpm build`.

### Task 9: Mantener compatibilidad — adapter temporal

**Objective:** Mientras Tasks 5-8 están en progreso, crear un archivo `src/data/compat.ts` que re-exporte datos desde los helpers con la misma forma que los JSON antiguos. Esto permite que páginas no refactorizadas sigan funcionando.

**Files:**
- Create: `src/data/compat.ts` (se elimina al final)

**Nota:** Si se implementa task por task con subagent-driven-development, este paso puede omitirse si se hacen secuencialmente. Se incluye como safety net.

### Task 10: Limpieza final

**Objective:** Cuando todas las páginas usen helpers y no importen JSON directamente:
- Eliminar: `tours.json`, `experiencias.json`, `company.json` (el original), `equipo.json`, `destinos.json`, `sostenibilidad.json`
- Eliminar: `content.ts` (si ya no se usa), `routes.ts`
- Eliminar: `compat.ts` (si se creó)
- Verificar: `pnpm build` — 88 páginas mínimo

**Files to delete:**
- `src/data/tours.json`
- `src/data/experiencias.json`
- `src/data/company.json` (⚠️ solo si site.config.ts ya lee de api/company/)
- `src/data/equipo.json`
- `src/data/destinos.json`
- `src/data/sostenibilidad.json`
- `src/data/content.ts` (opcional)
- `src/data/routes.ts`
- `src/data/compat.ts` (si existe)

**Verification:** `pnpm build` — 88+ páginas, sin errores de import.

---

## Resumen por Fases

| Fase | Tasks | Archivos modificados | Build esperado |
|---|---|---|---|
| F2 (estructura) | T1, T2 | +8 archivos api/ | 88 páginas OK |
| F3 (normalización) | T3 | +5 archivos api/ | 88 páginas OK |
| F4 (helpers) | T4 | +1 archivo helpers.ts | 88 páginas OK |
| F5 (refactor tours) | T5, T6 | 12 páginas | 88 páginas OK |
| F6 (refactor company) | T7 | 12 archivos | 88 páginas OK |
| F7 (refactor home) | T8 | 8 componentes+data | 88 páginas OK |
| F8 (limpieza) | T10 | -8 archivos | 88+ páginas OK |

---

## Riesgos y Tradeoffs

1. **Duplicidad temporal**: `tours.json` y `api/tours/items.json` coexisten durante la migración. Cualquier cambio de datos debe hacerse en AMBOS hasta la limpieza final.
2. **Compatibilidad de rutas**: las páginas `/experiencias/[slug].astro` existen y tienen sus propios slugs que pueden diferir de los de `/tours/[slug]`. Deben coexistir o redirigir. Plan: mantener ambas rutas (experiencias redirige o renderiza desde helpers).
3. **Campos nuevos**: `prices[]`, `itinerary[]`, `schedules[]` son nuevos. Las páginas actuales no los muestran aún — se agregan al helper cuando estén listos, no antes (YAGNI).
4. **State de los datos**: los datos existentes en company.json tienen asteriscos en el teléfono (`tel:+593****0614`) — se preserva en la migración.
5. **i18n**: todos los catálogos deben tener `title` y `titleEn`. Los textos en helpers resuelven según parámetro `lang`.
6. **TypeScript**: todos los helpers y tipos deben estar completos antes de refactorizar páginas para evitar errores de tipo que rompan el build.

---

## Decisión del usuario

**Opción elegida: C)** Fusionar: `/experiencias` se vuelve una redirección (o re-export) a `/tours` con filtro de categorías disponible. `/experiencias/[slug]` redirige a `/tours/[slug]`. El canónico es `/tours`. El navbar ya no incluye "Experiencias" como entrada separada (solo "Tours").

**Nota de implementación:** para redirigir en Astro static, crear `src/pages/experiencias.astro` que renderice un meta refresh + link canónico, y para los slugs usar `getStaticPaths` que devuelvan redirects (o páginas con JavaScript de redirección). Como Astro 5 static no tiene `redirect()` nativo para rutas, se usarán páginas placeholder con meta refresh que se eliminan cuando se despliega con SSR.