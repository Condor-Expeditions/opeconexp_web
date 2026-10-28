import { destinations } from "./destinations";
import { tours } from "./tours";
import { destinationHref } from "./tours/taxonomy";

export const navigationLinks = [
	{ title: "Inicio", href: "/" },
	{ title: "Tours", href: "/tours" },
	// { title: "Ediciones", href: "/ediciones" },
	{ title: "Sobre Nosotros", href: "/sobre-nosotros" },
	{ title: "Contacto", href: "/contacto" },
];

export const featuredDestinations = destinations
	.filter(place => tours.some(tour => tour.destinations.includes(place.id)))
	.map(place => ({ ...place, href: destinationHref(place.id) }));
