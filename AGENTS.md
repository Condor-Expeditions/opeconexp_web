# AGENTS.md

**Always use pnpm for all commands. Never use npm or yarn.**

## Commands

```bash
pnpm dev        # Start dev server at localhost:4321
pnpm build      # Build to ./dist/
pnpm preview    # Preview production build locally
pnpm lint       # Biome lint --write . (fixes issues)
pnpm lint:fix   # Biome check --write . (alias for lint)
```

## Tech Stack

- **Framework**: Astro 5.17.2
- **Styling**: Tailwind CSS 4 with @tailwindcss/vite plugin
- **Linting/Formatting**: Biome 2.4.4
- **Package Manager**: pnpm

## Key Config Details

- **i18n**: Default locale is `es` (Spanish), English available at `/en/`. Prefix disabled for default locale.
- **Site URL**: Dev: `http://localhost:4321`, Prod: `https://condorexpedition.com/`
- **Biome**: Uses tab indentation, double quotes. Special rules disabled for `.astro`, `.svelte`, `.vue` files (noUnusedVariables, noUnusedImports, useConst, useImportType)

## Project Structure

```
src/
├── pages/      # Astro routes
├── components/ # Reusable UI components
├── layouts/    # Page layouts
├── lib/        # Utility code
├── content/    # Content collections
├── data/       # Static data files
├── styles/     # Global styles
└── assets/     # Static assets
```

## Custom Tailwind Theme

- Colors: `primary-red` (#8B1D20), `primary-black` (#000000), `background-light` (#F5F5F5)
- Font: Montserrat (sans-serif)

## Notes

- No typecheck script (Astro handles TypeScript internally)
- No test framework configured
- No pre-commit hooks or CI workflows
- Vercel deployment disabled for main/dev branches (vercel.json)