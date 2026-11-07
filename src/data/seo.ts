import { siteConfig } from "./site.config";
import type { TravelQuestion } from "./travel-faq";
import type { Tour } from "./tours/types";
import { tourSeo } from "./tours/seo";

export const publicSite = "https://condorexpedition.com/";
export const absoluteUrl = (path: string) => new URL(path, publicSite).href;
export const organizationId = absoluteUrl("#organization");

export const homeSeo = {
	title: "Operadora turística en Ecuador",
	description: "Descubre Ecuador con Condor Expeditions. Explora nuestros tours de naturaleza, aventura y cultura en Azuay y Cañar y consulta precios y disponibilidad.",
	directAnswer: "Condor Expeditions es una operadora turística en Ecuador, con sede en Cuenca. Nuestra oferta actual reúne experiencias de naturaleza, aventura y cultura en Azuay y Cañar: El Cajas, Ingapirca, Girón y pueblos artesanos. Compara recorridos, precios e inclusiones y consulta disponibilidad con nuestro equipo antes de confirmar tu reserva.",
};

export const catalogSeo = {
	title: "Tours por Ecuador",
	description: "Explora tours por Ecuador con Condor Expeditions. Descubre nuestra oferta actual en Azuay y Cañar, compara precios e inclusiones y consulta disponibilidad.",
	directAnswer: "Descubre Ecuador con los tours de Condor Expeditions. Nuestra oferta actual abarca Azuay y Cañar, con experiencias en El Cajas, Ingapirca, Girón y pueblos artesanos. Compara destinos, precios de referencia y servicios incluidos para elegir tu recorrido. Consulta en cada ficha el punto de salida y la disponibilidad para tu viaje.",
};

export function organizationSchema() {
	return {
		"@type": "TravelAgency", "@id": organizationId,
		name: siteConfig.companyName, url: publicSite,
		description: siteConfig.seo.description,
		telephone: siteConfig.companyInfo.phone.href.replace("tel:", ""),
		email: siteConfig.companyInfo.email.name,
		address: { "@type": "PostalAddress", streetAddress: "Gran Colombia 1-82 y Manuel Vega", addressLocality: "Cuenca", addressRegion: "Azuay", addressCountry: "EC" },
		hasMap: siteConfig.companyInfo.location,
		sameAs: siteConfig.socials.filter(link => ["Instagram", "TikTok"].includes(link.name)).map(link => link.href),
	};
}

export function faqSchema(path: string, questions: TravelQuestion[]) {
	return {
		"@type": "FAQPage", "@id": absoluteUrl(`${path}#faq`), inLanguage: "es-EC",
		mainEntity: questions.map(({ question, answer }) => ({ "@type": "Question", name: question, acceptedAnswer: { "@type": "Answer", text: answer } })),
	};
}

export function catalogSchema(tours: Tour[]) {
	return {
		"@type": "CollectionPage", "@id": absoluteUrl("/tours/#webpage"), url: absoluteUrl("/tours/"),
		name: catalogSeo.title, description: catalogSeo.description, inLanguage: "es-EC",
		mainEntity: {
			"@type": "ItemList", name: "Tours por Ecuador", numberOfItems: tours.length,
			itemListElement: tours.map((tour, index) => ({ "@type": "ListItem", position: index + 1, name: tour.title, url: absoluteUrl(`/tours/${tour.slug}/`) })),
		},
	};
}

export function tripSchema(tour: Tour) {
	const seo = tourSeo(tour);
	const url = absoluteUrl(`/tours/${tour.slug}/`);
	return {
		"@type": "TouristTrip", "@id": `${url}#trip`, url, name: seo.title, description: seo.directAnswer,
		provider: { "@id": organizationId }, tripOrigin: { "@type": "City", name: "Cuenca, Ecuador" },
		itinerary: {
			"@type": "ItemList",
			itemListElement: tour.itinerary.map((stop, index) => ({ "@type": "ListItem", position: index + 1, name: stop.title, description: stop.description })),
		},
		// No inventory/availability claim, guaranteed departure, review, or invented date.
		...(tour.price.kind === "paid" && !tour.provisional ? {
			offers: { "@type": "Offer", url, name: "Tarifa de referencia para adulto", description: `Desde USD ${tour.price.adult} por adulto. Sujeto a confirmación y mínimo operativo de ${tour.minimumPeople} participantes.`, priceSpecification: { "@type": "UnitPriceSpecification", minPrice: tour.price.adult, priceCurrency: "USD", unitText: "adulto" } },
		} : {}),
	};
}
