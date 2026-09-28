# Campos extendidos de destinos

Este documento describe los campos nuevos agregados al esquema de `destinations.ts`
para la página dinámica `/destinos/[slug]` (y su variante en inglés `/en/destinos/[slug]`).

## Campos por destino (adicionales a los existentes)

| Campo | Tipo | Descripción | Predeterminado seguro |
|---|---|---|---|
| `itinerario` | `ItinerarioPunto[]` | Lista de puntos del recorrido (título, descripción, imagen, hora, duración). Se renderiza en el componente `Timeline`. | `[]` |
| `rutaMapa` | `RutaMapa` | Origen, destino, waypoints y URL embebida de Google Maps. Se renderiza en `MapEmbed`. | `undefined` |
| `galeria` | `GaleriaItem[]` | Lista de imágenes con `src`, `alt` y `caption` opcional. Se renderiza en `Gallery` con lightbox. | `[]` |
| `resenas` | `Resena[]` | Reseñas con autor, avatar, fecha, calificación (0-5) y comentario. Se renderiza en `Reviews`. | `[]` |
| `faqs` | `FaqItem[]` | Pares pregunta/RESPUESTA. Se renderiza en `FAQ` como acordeón. | `[]` |
| `incluye` | `string[]` | Lista de lo que incluye el tour. | `[]` |
| `noIncluye` | `string[]` | Lista de lo que NO incluye el tour. | `[]` |
| `puntoEncuentro` | `PuntoEncuentro` | Nombre, dirección, URL de mapa y recomendación de llegada temprana. | `undefined` |
| `precios` | `Precios` | Precios por adulto, tercera edad, discapacitados, niños por rango y bebés. | Objeto completo |
| `disponibilidad` | `Disponibilidad` | Días de semana y horarios de salida. | `undefined` |
| `recomendaciones` | `string[]` | Slugs de destinos relacionados. | `[]` |

## Tipos de sub-objetos

### `Precios`
```ts
{ adulto: number; terceraEdad: number; discapacitado: number; niños: PrecioRango[]; bebes: number }
```

`PrecioRango`: `{ rango: string; precio: number; descuento?: number }`

Niños 0-2 años: precio 0 (gratis).
Niños 3-10 años: usualmente 10% de descuento sobre el precio de adulto.

### `Disponibilidad`
```ts
{ dias: string[]; horarios: string[] }
```

### `PuntoEncuentro`
```ts
{ nombre: string; direccion: string; urlMapa: string; recomendacion: string }
```

### `RutaMapa`
```ts
{ origen: string; destino: string; waypoints: string[]; urlEmbed: string }
```

### `ItinerarioPunto`
```ts
{ titulo: string; description: string; imagen?: string; hora: string; duración: string; coordenadas?: string }
```

## Reglas de renderizado

La página usa valores por defecto seguros (`?? []`, `Boolean(...)`) antes de cada
componente, por lo que un destino sin uno de estos campos no rompe el build
(prerender estático). Los componentes que reciben arrays checan `.length > 0`
antes de renderizar.

## Componentes asociados

| Componente | Ruta | Props |
|---|---|---|
| `Gallery` | `src/components/ui/Gallery.astro` | `items` (obligatorio), `lang` |
| `Timeline` | `src/components/ui/Timeline.astro` | `items` (obligatorio), `lang` |
| `MapEmbed` | `src/components/ui/MapEmbed.astro` | `ruta` (obligatorio), `lang` |
| `Reviews` | `src/components/ui/Reviews.astro` | `resenas` (obligatorio), `lang` |
| `FAQ` | `src/components/ui/FAQ.astro` | `items` (obligatorio), `lang` |
| `Cart` | `src/components/ui/Cart.astro` | `slug`, `name`, `precios`, `disponibilidad`, `lang` |

## Orden de secciones en la página

1. Hero (`DestinationDetail`)
2. Short description
3. Photo gallery (`Gallery`)
4. Tour details (salidas, horarios, duración, precio adulto)
5. Experience description
6. Data (salidas, horarios, precios por edad)
7. Qué incluye / Qué no incluye
8. Punto de encuentro
9. Tours relacionados
10. Itinerario (`Timeline`)
11. FAQ (`FAQ`)
12. Reseñas (`Reviews`)
13. Mapa de ruta (`MapEmbed`)
14. Carrito (`Cart`) — sticky a la derecha en desktop, colapsible abajo en móvil
