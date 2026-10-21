import aventura from "./aventura-en-cuadron";
import cajas from "./cajas-al-descubierto";
import ancestral from "./cajas-de-laguna-a-lo-ancestral";
import walking from "./free-walking-tour-cuenca";
import pueblos from "./pueblitos-magicos";
import raices from "./raices-ancestrales-del-ecuador";
import type { Tour } from "./types";
import guachapala from "./guachapala-entre-paisajes-y-tradicion";

export const tours: Tour[] = [cajas, ancestral, raices, pueblos, aventura, walking, guachapala];
export const tourHref = (tour: Pick<Tour, "slug">) => `/tours/${tour.slug}/`;
export const priceLabel = (tour: Pick<Tour, "price">) => tour.price.kind === "free"
	? "Gratis"
	: tour.price.kind === "pending" ? "Precio por confirmar" : `Desde $${tour.price.adult.toLocaleString("es-EC")} USD`;
