# Cóndor Expeditions — Reorganización del Navbar y Nuevas Páginas

> **For Hermes:** Use subagent-driven-development skill to implement this plan task-by-task.

**Goal:** Reorganizar la navegación para acomodar tours por zona geográfica (Cuenca, Azuay, Ecuador), temporada, personalizados, y nuevas categorías (cotizaciones, vuelos, conciertos, fútbol, paquetes internacionales, grupos, FAQ), con un navbar limpio y usable.

**Architecture:** El navbar actual tiene dropdowns hardcodeados para "Destinos" y "Experiencias" con condicionales `route.label === "X"`. Se reemplaza por un sistema basado en un nuevo archivo `navigation.ts` que define ítems con su tipo (link, dropdown, divider) y componentes asociados. Las páginas nuevas se crean como `.astro` estáticas, leyendo de JSONs de datos (patrón existente: `src/data/*.json`).

**Tech Stack:** Astro 5.17 · Tailwind CSS v4 · JSON data · TypeScript · Dropdown + DropdownItem components existentes.

---

## Análisis del problema actual

**Navbar actual (`Header.astro`):**
- Filtra `Inicio` hacia afuera (logo hace de home).
- Itera `ROUTES` con condicionales hardcodeados (`label === "Destinos"`, `label === "Experiencias"`).
- El filter aún deja `routes.ts` como fuente de verdad.
- Dificultad: añadir N+1 ítems con dropdowns/subgrupos requiere escribir un `if` por cada label.

**Propuesta:** Reemplazar `routes.ts` por `navigation.ts` con una estructura jerárquica donde cada ítem define su tipo (`link`, `dropdown`, `divider`, `subheading`) y sus hijos. El Header itera esa estructura recursivamente sin condicionales por label.

---

## Arquitectura del Navbar Propuesto

### Nivel 1 — Links directos visibles (6→7 ítems, 4 con dropdown, 3 link simples)

```
Logo | Tours ▼ | Ecuador ▼ | ▸ personalizados | ▸ (vuelos) | ▸ paquetes ▼ | ▸ eventos ▼ | Nosotros | FAQ | Contacto | [ES ▾] [Botón Reserva]
```

| # | Ítem | Tipo | Sub-items |
|---|---|---|---|
| 1 | **Tours en Cuenca** | dropdown | City tour, Cajas, Baños, Gualaceo, Chordeleg, Ingapirca ← ejemplos |
| 2 | **Tours del Azuay** | dropdown | Girón, Paute, Sigsig, San Bartolomé, Yunguilla, etc. |
| 3 | **Tours del Ecuador** | dropdown | Andes, Amazonía, Costa, Galápagos (sub-items de la región actual) |
| 4 | **Tours de Temporada** | dropdown | Carnaval, Ballenas (jun-sep), Fin de Año, Semana Santa, Vacaciones |
| 5 | **Personalizados** | link | /personalizados (formulario "diseña tu expedición") |
| 6 | **~ Cotizar Vuelo** | link | /vuelos (→ página con "próximamente" o redirección, visual deshabilitado / pill opacado) |
| 7 | **Paquetes Internacionales** | dropdown | Colombia, Perú, Brasil, Europa ← ejemplos |
| 8 | **Conciertos & Fútbol** | dropdown | Lista de eventos con botón "Cotizar" |
| 9 | **Grupos (Cotizaciones)** | link | /grupos (form Cotizaciones para grupos) |
| 10 | **Quiénes Somos** | link | /nosotros (ya existe) |
| 11 | **Preguntas Frecuentes** | link | /faq |
| 12 | **Contacto** | link | /contacto |

**Elementos ocultos/deshabilitados:** Cotizar Vuelo aparece con opacidad, texto "Próximamente" en tooltip, sin href. No se puede cliquear.

### Prioridad / Orden visual

De izquierda a derecha (desktop):
1-4 Tours principales (dropdown) → 5 Personalizados → 6 Vuelos (inactivo) → 7 Paquetes → 8 Conciertos → 9 Grupos → 10 Quiénes Somos → 11 FAQ → 12 Contacto

En mobile: lista completa colapsable igual, con el item inactivo grey marc.

---

## Tareas (B14–B20, cada una 2-5 min)

### Task B14: Crear `src/data/navigation.ts` con structura jerárquica

**Objective:** Definir el esquema de navegación unificado.

**Files:**
- Create: `src/data/navigation.ts`
- Modify (tras B15): `src/components/ui/header/Header.astro`

**Contenido sugerido:**
```typescript
export interface NavItem {
  label: string;           // "Tours en Cuenca"
  labelEn: string;         // "Cuenca Tours"
  href?: string;          // undefined si es dropdown
  disabled?: boolean;      // item como "Cotizar Vuelo" (inactivo)
  description?: string;     // Tooltip "Próximamente"
  children?: NavItem[];   // Sub-items
  childrenDivider?: boolean; // línea separadora entre grupos en dropdown
}
export const NAV: NavItem[] = [
  {
    id: "tours::cuenca", label: "Tours en Cuenca", labelEn: "Cuenca Tours",
    type: "dropdown", children: [
      { id: "cuenca::citytour", label: "Tienda", labelEn: "Lak", href: "/tour/cuenca/city-tour" },
      ...
    ]
  },
  {
    id: "tours::azuay": ...
    children: [{ label: "Girón", href:... }, ...]
  },
  {
    id: "gions::ecuador,...: "Tours del Ecuador", children: [
      { label: "San", href: "/andes" }, ... 4 regiones
    ]
  },
  {
    id: "temporada", label: "Tu de Temporada", children: [
      { label: "OppAvistamiento Ballenas (junísep)", href: "/ opcional" },
      ...
    ]
  },
  { id: "tours::personalizados", label: "Personalizado", labelEn: "Custom Tours", href: "/personalizados", type: "link" },
  { id: "respirador::vuelos", label: "Cotizar Vuelo", labelEn: "Flight", href: undefined, disabled: true, description: "Próximamente" },
  { id: "turismo::paquetes", label: "Paquetes Internacionales", labelEn: "Intl Packages", type: "dropdown", children: [...] },
  { id: "servi::conciertos", label: "Conciertos & Fútbol", href: "/conciertos", type: "link" },
  { id: "cotizacion::grupos", href: "/grupos", type: "link" },
  { id: "quienes aportamos", label: "Quiénes Somos", href: "/nosotros", type: "link" },
  { id: "ayuda::efaq", label: "Preguntas Frecuentes", href: "/faq", type: "link" },
  { id: "contacto", label: "Contacto", href: "/contacto", type: "link" },
];*replace por la navegación limpia en nav.
```

### Task B15: Reescribir Header.astro para usar `navigation.ts` genérico

**Objetivo:** Eliminar condicionales hardcodeados por label. Iterar `¿?` con `renderItem()`.<br>
- Si `item.children`, renderizar `<Dropdown>` con items<br/>
- Si `item.disabled`, renderizar span opaco con tooltip<br/>
- Si `item.href`, renderizar `<a>`.

**Mobile:** misma iteración.

### Task B16: Crear página `tours-cuenca.astro` con contenido dinámico

**Objetivo:** Página /tour/cuenca/city-tour o /tours/cuenca con los primeros ejemplos de tours de Cuenca (use parque, iglesias, caudal, etc.). Crear `/en/` versión.

### Task B17: Crear página `login/tour-extranjero.astro` con paquetes internacionales

**Objetivo:** Lista de 4-5 paquetes internacionales (Perú, Chile, Australia, etc.) con formulario de cotización.

### Task B18: Crear página `/faq.astro` (ES+EN)

**Objetivo:** Sección de preguntas frecuentes con acordeón simple client-.

### Task B19: Página `/grupos` con entorno tipo "Cotizaciones para Grupos"

**Objetivo:** Form Cotización (mismas plantillas de contacto) pero con campos extra: cantidad, tipo de grupo (colegio, empresa, familia...).

### Task B20: Página `/petertosysfutbol` eventos (conciertos, futbol, etc.)

**Objetivo:** Sección lista eventos con imágenes y botón "Cotizar pase" que abre el cotizador de contacto.

---

## Resumende archivos

| Tipo | Archivos |
| ---- | -------- |
| **Crear** | `src/data/navigation.ts`, `src/pages/tours-cuenca.astro`, `src/pages/tours-azuy.astro`, `src/pages/tours-ecuador.astro`, `src/pages/tour-ptemporada.astro`, `src/pages/personalizados.astro`, `src/pages/faq.astro`, `src/pages/groups.astro`, `src/pages/conciertos.astro`, `src/pages/paquetes.astro`, + 9 EN + `src/data/faq.json`, `src/data/paquetes.json`, `src/data/tours-azuy.json`, `src/data/tos-cuenca.json`, `src/data/eventos.json` |
| **Modificar** | `src/components/ui/header/Header.astro`, `src/layout/Layout.astro`, probablemente `src/styles/global.css` para `text-disabled` class, `src/data/routes.ts` → eliminar o archivar |

## Orden de ejecución

1. **B14** — `sustento/estructura`: navigation.ts + datos JSON de tours, paquetes, events, FAQ
2. **B15** — **Header.astro** genérico (solo eso) + build
3. **B16** — Tours de Cuenca, Azuay y Provinciaria (3 páginas completas que se usarán como plantilla para replicar)
4. **B17** — Paquetes internacionales **(nacionalizado)**
5. **B18** — FAQ
6. **B19** — Grupos
7. **B20** — Conciertos & eliminar route anterior `destinos/experiencias` dropeando las obsoletas si no se reutilizan (no se hace con esta tarea)

## Verificación

- `cp build` → obviamente exitoso
- Navegación interactiva (dropdown activable con hover o clic) + item desactivado → estilos opacos, sin clic.
- Items con `href=` enlazan correctamente.

## Riesgos

- Muchas páginas vacías en muy poco tiempo — pero se ejecutan con YAGNI (cada página tiene al menos lo mínimo funcional: datos del JSON o formulario, no diseño 100% pulido).
- Header usando dropdowns y breadcrumbs pueden perder estabilidad si los componentes dependen de `ROUTES` → chequeo post-migración.
- Evitar romper el botón de luz el idioma ES/EN que está ahí.

---

## Preguntas abiertas

- ¿Agreed con el orden de los ítems del menú propuesto? ¿Quieres algo diferente en la posición de "Paquetes" o "Quiénes Somos"?
- Los "Tours de Temporada" ¿tienen ya 4-5 ciertas tours definidos, o quieres que los defina yo?
- El estilo de los items desactivados: ¿solo opacidad (30%) o también ícono de candado?