import aventura from "./aventura-en-cuadron";
import cajas from "./cajas-al-descubierto";
import ancestral from "./cajas-de-laguna-a-lo-ancestral";
import walking from "./free-walking-tour-cuenca";
import pueblos from "./pueblitos-magicos";
import raices from "./raices-ancestrales-del-ecuador";
import type { Tour } from "./types";
import guachapala from "./guachapala-entre-paisajes-y-tradicion";
import cascada from "./cascada-de-giron";
import artesanias from "./compras-y-artesanias";
import sigsig from "./raices-ancestrales-sigsig";
import paute from "./paute-dinosaurios-naturaleza-y-sabores";
import { itineraryDuration } from "./duration";

export const tours: Tour[] = [cajas, ancestral, raices, pueblos, cascada, walking, aventura, artesanias, sigsig, guachapala, paute]
	.map(tour => ({ ...tour, duration: itineraryDuration(tour.itinerary) }));
export const tourHref = (tour: Pick<Tour, "slug">) => `/tours/${tour.slug}/`;
export const priceLabel = (tour: Pick<Tour, "price">) => tour.price.kind === "free"
	? "Gratis"
	: tour.price.kind === "pending" ? "Precio por confirmar" : `Desde $${tour.price.adult.toLocaleString("es-EC")} USD`;
