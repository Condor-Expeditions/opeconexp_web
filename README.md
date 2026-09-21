# opeconexp_web — Cóndor Expeditions

Sitio web de la operadora turística **Cóndor Expeditions** (`opeconexp` =
**Ope**radora **Con**dor **Exp**editions). Construido con **Astro 5** + **React 19**
+ **Tailwind CSS 3**.

> Estado: en desarrollo temprano (landing base con Hero). Rama de trabajo: `dev`.

---

## Stack

- **Astro 5** (output estático)
- **React 19** (`@astrojs/react`) para islas interactivas
- **Tailwind CSS 3** (`@astrojs/tailwind`) — tema en `tailwind.config.mjs`
  (colores de marca: `primary-red #8B1D20`, `primary-black`, `background-light`;
  fuente `Montserrat`)
- Íconos: `lucide-react`
- **Gestor de paquetes: pnpm**

---

## Requisitos

- **Node** >= 18
- **[pnpm](https://pnpm.io/)**

---

## Instalación y comandos

```bash
pnpm install        # instala dependencias
pnpm dev            # dev server en http://localhost:4321
pnpm build          # build de producción -> ./dist/
pnpm preview        # previsualiza el build
pnpm astro ...      # CLI de Astro (astro add, astro check, etc.)
```

> **Nota (este host Windows):** el `PYTHONPATH` de Hermes no afecta a Node, pero
> si `pnpm build` falla con `ERR_PNPM_ABORTED_REMOVE_MODULES_DIR_NO_TTY`, corre
> con `CI=true` delante (`CI=true pnpm build`) o invoca astro directo:
> `node_modules/.bin/astro build`.

---

## Estructura

```
src/
  pages/index.astro      página principal (ruta /)
  components/Hero.astro   sección hero
  layouts/MainLayout.astro
  styles/global.css
public/                   assets estáticos (logo.svg, etc.)
astro.config.mjs          integraciones: tailwind() + react()
tailwind.config.mjs       tema de marca
```

Astro expone cada `.astro`/`.md` de `src/pages/` como una ruta según su nombre
de archivo. Los assets estáticos van en `public/`.

---

## Notas de mantenimiento

- Config de Tailwind unificada en **`tailwind.config.mjs`** (se eliminó un
  `tailwind.config.js` duplicado idéntico — jul 2026).
- Un clon de terceros `HeadlessX` que estaba incrustado por error en `src/` se
  movió a `D:/Coders/03_tools/HeadlessX` (no pertenece al sitio — jul 2026).
- Despliegue: Vercel (`.vercel/` ignorado en git).
