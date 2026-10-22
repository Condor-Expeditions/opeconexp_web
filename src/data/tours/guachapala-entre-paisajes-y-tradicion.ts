import type { Tour } from "./types";

/** Provisional editorial content requested for Guachapala. Replace before offering departures. */
export default {
	id: "PROV-001", slug: "guachapala-entre-paisajes-y-tradicion",
	title: "Guachapala: Paisajes y Tradición", signature: "Un nuevo camino por descubrir",
	category: "Naturaleza · Cultura", location: "Guachapala · Andacocha",
	destinations: ["guachapala"], experienceTypes: ["naturaleza", "cultura"], provisional: true,
	summary: "Una próxima experiencia entre el paisaje de Guachapala y Andacocha.",
	description: "Estamos diseñando una experiencia para conocer Guachapala, acercarnos al entorno de Andacocha y disfrutar del paisaje del Austro. Este recorrido es una propuesta provisional: el itinerario, los servicios y las condiciones se confirmarán antes de ofrecer salidas.",
	duration: "Por confirmar", difficulty: "Por confirmar", languages: "Por confirmar",
	audience: "Por confirmar con el equipo", season: "Por confirmar",
	price: { kind: "pending" }, meeting: "Por confirmar con el equipo en Cuenca",
	returnPoint: "Por confirmar", operation: "Salidas aún no programadas", operatingDays: [],
	departures: [], minimumPeople: 0, transport: "Por confirmar", transferDuration: "Por confirmar",
	highlights: [
		{ title: "El paisaje de Guachapala", description: "Una propuesta para acercarnos a los paisajes del Austro. Paradas pendientes de validación." },
		{ title: "El entorno de Andacocha", description: "Una visita contemplada en el recorrido preliminar, sujeta a confirmación." },
		{ title: "Tiempo para descubrir", description: "Estamos preparando una experiencia con espacio para la cultura y la vida local." },
	],
	itinerary: [{ durationMinutes: null, title: "Un recorrido en preparación", description: "Los puntos de visita, tiempos y actividades se publicarán cuando el equipo valide el programa." }],
	includes: ["Los servicios incluidos se definirán en el programa final."],
	excludes: ["Todavía no existe una tarifa ni un paquete confirmado."],
	packing: [{ title: "Antes de preparar tu viaje", description: "Consulta al equipo el estado de esta propuesta y las recomendaciones del recorrido final." }],
	restrictions: [{ title: "Programa pendiente de validación", description: "La dificultad, las edades recomendadas y las condiciones de accesibilidad aún no están definidas." }],
	conditions: [{ title: "No disponible para reservar", description: "Esta ficha es provisional. No confirma salidas, servicios ni disponibilidad. Puedes escribirnos para conocer los avances." }],
	practical: ["Contenido provisional, pendiente de revisión por el equipo."],
	photos: [
		{ src: "/public/assets/menu/tours/guachapala-andacocha.jpg", alt: "Vista ilustrativa del entorno de Guachapala y Andacocha" },
		{ src: "/public/assets/menu/destinos/azuay.jpg", alt: "Paisaje ilustrativo del Austro ecuatoriano" },
	], illustrativePhotos: true,
	source: { snapshot: "", sheet: "FICHA TOUR", priceCells: [], pendingReview: ["Propuesta editorial provisional, sin ficha de operación. Validar todo el contenido y sustituir las fotos ilustrativas."] },
} satisfies Tour;
