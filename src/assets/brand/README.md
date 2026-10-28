# Variantes de marca

- `logotype/`: texto horizontal, con las versiones monocromas `black.svg` y `white.svg`.
- `logotype/variants/`: combinaciones de color; orden: CONDOR, expeditions.
- `symbol/`: cóndor sin texto.
- `complete/`: símbolo y texto, con versiones monocromas.
- `complete/variants/`: combinaciones de color; se conserva el orden de los códigos originales.

Equivalencias de los nombres originales: `n` → `black`, `b` → `white`,
`r` → `red`, `c` → `blue` (celeste).

Los SVG se mantienen sin alterar sus trazados. El encabezado conserva
`src/assets/logo.svg` en su
estado cerrado y usa `logotype/black.svg` sobre el menú blanco.

Las variantes se importan desde `src/assets/brand` para que Astro gestione
sus URLs y las incluya en el build solo cuando se utilizan.
