import type { Tour } from "./types";

export const mountainPacking: Tour["packing"] = [
	{ title: "Abrígate por capas", description: "Ropa térmica, chaqueta impermeable o cortavientos y calzado de trekking con buena tracción." },
	{ title: "Protégete del sol", description: "Protector solar FPS 50+, gafas UV, gorra o gorro y guantes para el viento andino." },
	{ title: "Agua y cuidado personal", description: "Botella reutilizable con agua, snacks y tu medicación personal." },
	{ title: "Lleva lo esencial", description: "Cámara protegida de la lluvia y efectivo en billetes pequeños para gastos personales." },
];

export const paidConditions: Tour["conditions"] = [
	{ title: "Salidas compartidas", description: "Operación con un mínimo de 4 pasajeros confirmados. El equipo te confirmará la salida y la tarifa aplicable." },
];

export const source = (id: string, priceCells: string[], pendingReview: string[]): Tour["source"] => ({
	snapshot: `source/${id}.json`, sheet: "FICHA TOUR", priceCells, pendingReview,
});
