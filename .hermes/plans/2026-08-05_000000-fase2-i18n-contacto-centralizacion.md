# Cóndor Expeditions — Fase 2: i18n, Formulario, Centralización

> **Para Hermes:** usar `subagent-driven-development` para implementar tarea por tarea.

**Objetivo:** Completar páginas en inglés (`/en/`), funcionalizar el formulario de contacto, y centralizar datos repetidos en archivos JSON.

**Arquitectura:** Astro 5 i18n (routing `prefixDefaultLocale: false`, `locales: ["es", "en"]`). Páginas espejo en `/en/` con datos desde archivos JSON centralizados bajo `src/i18n/`. Formulario de contacto vía API endpoint en Astro (serverless function) o servicio externo (Formspree/Netlify Forms).

**Tech Stack:** Astro 5.17, pnpm, Tailwind CSS 4, archivos JSON estáticos.

---

## B10 — Centralizar datos compartidos (20 min)

### Objetivo
Mover contenido repetido entre páginas (contactos, destinos, experiencias, equipo, valores, etc.) a archivos JSON bajo `src/data/` o `src/content/`, manteniendo `site.config.ts` para configuración de sitio y creando `src/data/company.json`, `src/data/destinos.json`, `src/data/experiencias.json`, `src/data/equipo.json`.

### Tareas

#### B10.1 — Crear `src/data/company.json` con información de contacto y social

**Objetivo:** Extraer companyInfo y socials de `site.config.ts` a un JSON puro para que Footer y Contacto lo consuman sin TypeScript.

**Archivos:**
- Crear: `src/data/company.json`
- Modificar: `src/data/site.config.ts` (importar el JSON en vez de hardcodear)

**Contenido de `company.json`:**
```json
{
  "name": "Cóndor Expeditions",
  "address": "Cuenca, Ecuador",
  "scheduleWeekdays": "Lunes a Viernes de 08:00h a 18:00h",
  "scheduleWeekends": "Sábados de 09:00h a 13:00h",
  "phone": { "name": "+593 98 600 6849", "href": "tel:+593936X6849" },
  "email": { "name": "info@condorexpedition.com", "href": "mailto:info@condorexpedition.com" },
  "whatsapp": { "href": "https://wa.me/593936X6849?text=Hola" },
  "maps": "https://maps.app.goo.gl/fpRVSBdXRLTqoZKW6",
  "socials": [
    { "name": "Facebook", "href": "https://www.facebook.com/condexpeditions", "icon": "facebook" },
    { "name": "Instagram", "href": "https://www.instagram.com/condorexpeditions/", "icon": "instagram" },
    { "name": "TikTok", "href": "https://www.tiktok.com/@condorexpeditions", "icon": "tiktok" },
    { "name": "YouTube", "href": "https://www.youtube.com/@condorexpeditions", "icon": "youtube" }
  ]
}
```

**Validación:**
- `pnpm build` exitoso

---

#### T10.2 — Crear `src/data/destinos.json`

**Archivos:**
- Crear: `src/data/destinos.json`
- Modificar: `src/pages/destinos.astro` (eliminar array `regiones` hardcodeado, importar desde JSON)

#### B10.3 — Crear `src/data/experiencias.json`

**Archivos:**
- Crear: `src/data/experiencias.json`
- Modificar: `src/pages/experiencias.astro` (eliminar array `categorias`, importar desde JSON)

#### B10.4 — Crear `src/data/equipo.json`

**Archivos:**
- Crear: `src/data/equipo.json`
- Modificar: `src/pages/nosotros.astro` (eliminar array equipo hardcodeado, importar desde JSON)

#### B10.5 — Actualizar `src/pages/index.astro`

Reemplazar import `src/data/content.ts` con imports individuales de JSON para cada sección, o mantener `content.ts` pero que importe de los JSON.

#### B10.6 — Actualizar `src/components/ui/Footer.astro` y `src/pages/contacto.astro`

Consumir `company.json` en vez de `siteConfig.companyInfo`.

#### B10.7 — Eliminar `src/data/content.ts` si sus datos se migraron completamente a JSON.

---

## B11 — Páginas en inglés (`/en/`) (35 min)

### Objetivo
Cada página existente debe rusher una versión en inglés bajo `/en/` usando el sistema `src.i18n` de Astro.

**Estrategia:** Usar dos fuentes de traducción:
- **Datos estáticos**: JSON con claves `"en"` y `"es"` (ej: `src/data/destinos-site.json` con `{ "es": {...}, "en": {...} }`)
- **Textos inline**: Si Astro i18n soporta estrategia de traducción por página, usar `getLocaleFromPath()` si existe, o simplemente importar según locale.

### B11.1 — Crear `src/data/i18n/common.json`

**Propósito:** Texts comunes para Header, Footer, y CTA que varían según el idioma.

**Estructura:**
```json
{
  "es": {
    "nav": {
      "inicio": "Inicio",
      "experiencias": "Experiencias",
      "destinos": "Destinos",
      "nosotros": "Nosotros",
      "contacto": "Contacto",
      "reservar": "Reservar"
    },
    "footer": {
      "about": "Operado...",
      "maqExplora": "Explora",
      "woodAventures": "Aventuras",
      "bumContact": "Contacto"
    },
    "cta": {
      "title": "¿Listo para tu siguiente aventura?",
      "reserva": "Reserva tu expedición",
      "ver": "Ver experiencias"
    }
  },
  "en": {
    "nav": {
      "inicio": "Home",
      ...etc
    },
    "footer": { ... },
    "cta": { ... }
  }
}
```

### B11.2 — Modificar `pages/` para soportar enumeración por locale

**Objetivo:** Cada página debe entender qué idioma está activo y pasar los datos correctos.

Método recomendado: **Una única página `[lang]/destinos.astro`** o **copia completa de página usando `src/sections/` ya que permité reduplicación limpia**.

Decisión: usar **component approach** — cada página va a importar un componente compartido `DestinationsPage` que recibe `lang="es"|"en"`. De esta forma no duplicamos estructuras, solo dattos.

### B11.3 — Crear componentes de página

- `src/components/pages/HomePage.astro`: recibe `lang` y carga `i18n/common.json`  + `content_translated.ts`
- `src/components/pages/DestinationsPage.astro`
- `src/components/pages/ExperienciasPage.astro`
- `src/components/pages/NosotrosPage.astro`
- `src/components/pages/ContactPage.astro`

### B11.4 — Página Inicio `/en/`

**Archivo:** `src/pages/en/index.astro` (aritmetica: Astro no requiere subpáginas elevadas con `content` — se puede hacer un archivo directo por cada locale.

Ejemplo:
```astro
---
import Layout from "../../layouts/Layout.astro";
import HomePage from "../../components/pages/HomePage.astro";
---

<Layout lang="fi">
  <HomePage lang="en" />
</Layout>
```

### B11.5 — Página Inicio Fallback

`/en/destions`, `/en/experiencias`, `/en/nosotros`, `/en/contacto`

### B11.6 — Añadir/actualizar flag re en header (ya existe en `Header.astro` pero es estático duro)

Actualizar `src/components/ui/header/Header.astro` para que laurLanguage sea dinámica basado en `Astro.url.pathname`.

---

## B12 — Funcionalizar Formulario de contacto (30 min)

### Objetivo
Actualmente el formulario en `contacto.astro` tiene `method="POST" action="#"`. Hay que hacer que funcione de verdad.

**Escenario:** Sitio **estático** (Astro static). No haybackend. Opciones:

1. **Formspree** — tercera parte con free-tier configurable con webhook (recomendado)
2. **Netlify/Formstatic/Getform** similares
3. **Astro SSR + nodemailer** — incremental con vercel, más complejo

**Recomendación:** Formspree por ser gratuito para 50 submissions/mes y no requiere código server-side.

### B12.1 — Configurar Formspree

1. Registrar una cuenta gratuita en `formspree.?io`
2. Crear nuevo form, obtener ID: `x'abc'abcdef`
3. Guardar el ID en `vervel.json` o `.env` como `FORMSPREE_FORM_ID=abc123`

### B12.2 — Actualizar `contacto.astro`

- `action="https://formspree.io/f/${FORMSPREE_FORM_ID}"`
- `method="POST"`
- Añadir validación placeholder `required` + nativa HTML5
- Agregar input escondido `_next` para URL de agradecimiento

### B12.3 — Crear página de redirección `/gracias`

**Archivo:** `src/pages/gracias.astro` — página simple con mensaje de agradecimiento.

### B12.4 — Añadir feed back de envío exitoso en el form usando custom handler JS sin auto-redireccionar

Opción: usar XHR contra Formspree AJAX endpoint (`https://formspree.io/ajax/{id}`) para evitar redirect y mostrar toast de éxito.

### B12.5 — Validación

- `pnpm build` exitoso
- Test prácticamente con el formulario posteando al endpoint (método para verificar sin envío real: curl test)
- Verificar `required`, `type="email"`, `pattern` si es necesario

---

## B12 — Corregir y revisar todas las páginas (10 min)

### B12.1 — Verificar consistencia visual

1. Correr `pnpm build` y atender warnings/errors de CSS, TS
2. Revisar cada página generada en `dist/` (sintaxis, metadata, open graph tags)

### B12.2 — Actualizar `astro.config.mjs`

Asegurar que excluya los paths que no deben ir: `gracias.astro` y demás nuevos.

---

## Resumen de archivos a crear/modificar

| Archivo | Acción | Tipo |
|---|---|---|
| `src/data/company.json` | Crear | Datos centralizados |
| `src/data/equipo.json` | Crear | Datos centralizados |
| `src/data/i18n/translations.json` | Crear | i18n textos |
| `src/components/pages/HomePage.astro` | Crear | Page component |
| `src/components/pages/DestinationsPage.astro` | Crear | Page component |
| `src/components/pages/ExperienciasPage.astro` | Crear | Page component |
| `src/components/pages/NosotrosPage.astro` | Crear | Page component |
| `src/components/pages/ContactPage.astro` | Crear | Page component |
| `src/pages/index.astro` | Modificar | Delegate to HomePage |
| `src/pages/destinos.astro` | Modificar | Delegate + import from JSON |
| `src/pages/experiencias.astro` | Modificar | Delegate + import from JSON |
| `src/pages/nosotros.astro` | Modificar | Delegate + import from JSON |
| `src/pages/contacto.astro` | Modificar | Delegate + import from JSON + Formspree action |
| `src/pages/gracias.astro` | Crear | Th page |
| `src/pages/en/index.astro` | Crear | English production |
| `src/pages/en/destinos.astro` | Crear | English page |
| `src/pages/en/experiencias.astro` | Crear | English page |
| `src/pages/en/nosotros.astro` | Crear | English page |
| `src/pages/en/contacto.astro` | Crear | English page |
| `src/i18n/utils.ts` | Opcional | Utilidad para obtener traducción por locale |
| `src/components/ui/Footer.astro` | Modificar | Usar traducciones |
| `src/components/ui/header/Header.astro` | Modificar | Lang switch dinámico |
---

## Orden de ejecución

1. **B10** — Extraer todos los datos a JSON centralizados (reduce errores en i18n)
2. **B11** — Crear páginas en inglés con estructura base estable
3. **B12** — Funcionalizar formulario (Formspree)
4. **B13** — Revisión final y build