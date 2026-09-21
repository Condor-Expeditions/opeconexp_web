# Cóndor Expeditions — Navbar Compacto + Catálogo Unificado de Tours

> **For Hermes:** Use subagent-driven-development skill to implement this plan task-by-task.

**Goal:** Navbar de 7 ítems (no 11) agrupando tours geográficos bajo un solo dropdown "Tours", con catálogo unificado en `tours.json` clasificado por categoría/región/tags. Vuelos desactivado pero visible + nuevas páginas FAQ, Grupos, Personalizados, Conciertos.

**Architecture:** `navigation.ts` define ítems jerárquicos con tipo, hijos y estado disabled. Header.astro itera recursivamente sin condicionales por label. Todas las páginas de tours leen de un único `tours.json`. Páginas auxiliares (FAQ, Grupos, Personalizados, Conciertos, Paquetes) cada una con su propio JSON o datos estáticos.

**Tech Stack:** Astro 5.17 · Tailwind v4 · JSON data · Vanilla JS para acordeones FAQ · Dropdown/DropdownItem existentes

---

## Navbar Compacto (7 ítems, 4 con dropdown, 3 con sub-dropdowns internos)

```
Logo | Tours ▼ | Personalizados | ~Vuelos~ | Conciertos & Fútbol | Cotizaciones ▼ | Contacto
```

| # | Ítem | Tipo | Contenido / Sub-ítems |
|---|---|---|---|
| 1 | **Tours** | mega-dropdown (columnas) | Columna A: "Por Región" (Cuenca, Azuay, Ecuador) · Columna B: "Por Tipo" (Trekking, Rafting, Cultural, Selva, Montañismo) · Columna C: "Temporada" (Ballenas, Carnaval, Fin de Año) |
| 2 | **Personalizados** | link → `/personalizados` | Formulario "Diseña tu expedición" |
| 3 | **~Cotizar Vuelo~** | deshabilitado (opaco, sin href) | Visible con pill "próximamente" |
| 4 | **Conciertos & Fútbol** | link → `/conciertos` | Página de eventos con tarjetas + botón cotizar |
| 5 | **Grupos** | link → `/grupos` | Formulario de cotización grupal |
| 6 | **Paquetes Intl** | link → `/paquetes` | Paquetes internacionales con formulario |
| 7 | **Más** | dropdown con (Quiénes Somos · FAQ · Contacto) | Reemplaza los links sueltos |

Total visual: 7 ítems en el menú principal — no se satura.

---

## Catálogo unificado `tours.json`

Un solo archivo JSON con todos los tours, clasificados por:

```json
{
  "tours": [
    {
      "id": "city-tour-cuenca",
      "slug": "city-tour-cuenca",
      "title": "City Tour Cuenca Patrimonial",
      "titleEn": "Heritage City Walk",
      "category": ["cuenca", "cultural", "city-tour"],
      "region": "cuenca",
      "type": ["cultural", "city"],
      "season": ["todo-el-ano"],
      "duration": "3 horas",
      "difficulty": "Fácil",
      "priceFrom": 25,
      ...
    }
  ],
  "metadata": {
    "regions": ["cuenca", "azuay", "ecuador"],
    "categories": ["city-tour", "trekking", "rafting", "selva", "cultural", "montanismo", "camping"],
    "seasons": ["ballenas", "c02naval", "findeano", "semana-santa", "vacaciones"]
  }
}
```

Esto permite que una sola página `/tours/[slug].astro` renderiza cualquier tour dinámicamente, y que los dropdowns (y la página de listado) filtren por `category`, `region` o `season`.

---

## Páginas a crear

| Ruta ES | Ruta EN | Datos | Contenido |
|---|---|---|---|
| `/tours/cuenca` | `/en/tours/cuenca` | tours.json filtrado `region: cuenca` | Grid de tours + filtros |
| `/tours/azuay` | `/en/tours/azuay` | tours.json filtrado `region: azuay` | Grid de tours + filtros |
| `/tours/ecuador` | `/en/tours/ecuador` | tours.json filtrado `region: ecuador` | Grid de tours + filtros |
| `/tours/temporada` | `/en/tours/temporada` | tours.json filtrado `season` | Grid de tours + filtros |
| `/tours/[slug]` | `/en/tours/[slug]` | tours.json ítem único | Detalle tipo ficha turística (ya existe `[slug]` en experiencias, se replica el patrón) |
| `/personaliz` | `/en/personalizados` | — | Formulario "Diseña tu expedición" |
| `/conciertos` | `/en/conciertos` | `eventos.json` | Lista de eventos con botón "Cotizar" |
| `/paquetes` | `/en/paquetes` | `paquetes.json` | Paquetes internacionales con form cotizador |
| `/grupos` | `/en/grupos` | — | Form Cotización para Grupos |
| `/faq` | `/en/faq` | `faq.json` | Acordeón de FAQs |

---

## Tareas

### Task B14: Crear `src/data/tours.json` con el catálogo unificado
**Objetivo:** Catálogo completo de 20-25 tours de Condor Expeditions en todos los clústers.

- Incluir regiones `cuenca` (6 tours), `azuay` (5 tours), `ecuador` (10 tours) con variantes de temporada.
- Clausuras por `season` ↔ algunos tours solo están en temporada (fecha/mesica).
- Cada tour con fields: id, slug, title, titleEn, region, category[], season[], duration, difficulty, priceFrom, includes, highlights[], image.

### Task B15: `src/data/navigation.ts` con el menú los 7 puntos

### Task B16: Refactorizar Header.astro para usar `navigation.ts` y mega-dropdown de Tours

### Task B17: Página `/tours/templo` con filtros por regions

### Task B18: Página `/tophage/ [slug]` (detalle tour)

### Task B19: Páginas: `/personalizados`, `/conciertos`, `/paquetes`, `/grupos`, `/faq` + en inglés cada una

### Task B20: Ajustar `global.css` / agregar clase `text-disabled` y states
--

## Orden de ejecución

1. **B14** — Redactar `tours.json` - 20≥ tours
2. **B15** — `navigation.ts` + 7 items
3. **B16** — Header.astro genérico mega-dropdown
4. **B17** — Página listado `/tours/`
5. **B18 ** — Página detalle tour `[slug]`
6. **B118, 20** — Personalizados, Conciertos, FAQ, etc.
7. **B21** — Limpieza (opcional dejar leer solo si usa)

##  Verificación
- `pnpm build exitoso` ( esperamos +n 42-56 páginas)
- Navegación: dropdow prima columna, disabled con visual de "próximamente"
- nav scroll working sin perder la hamburguesa.

---

Las mejores prácticas usan este menú en línea. Commiso solo después de verify.

---

## Pregunta abierta

- Solo una: ¿los tours con su contenido del names invités? (ej. "Aventura en Cajas") o quieres que sean descriptivos ("Trekking al Santuario de la Virgen del Cajas, P.N. Cajas").