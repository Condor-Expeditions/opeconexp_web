import { mountainPacking, paidConditions, source } from "./shared";
import type { Tour } from "./types";

export default {
	enabled: true,
	id: "NAT-002", slug: "cajas-de-laguna-a-lo-ancestral",
	title: "Cajas: El Secreto de los Andes", signature: "Otra forma de sentir los Andes",
	category: "Naturaleza · Cultura · Gastronomía", location: "El Cajas · Cuenca",
	destinations: ["el-cajas"], experienceTypes: ["naturaleza", "cultura", "gastronomia"],
	summary: "Un día entre paisajes andinos, tradiciones y experiencias del campo.",
	description: "Redescubre el Cajas desde una perspectiva ancestral y vivencial: la Laguna de Patoquinoa, el Santuario de la Virgen y una experiencia entre arte y pizza artesanal en Dos Chorreras o el Poblado de Guavidula. El día continúa con pesca deportiva en La Casa del Abuelo.",
	duration: "6 h 25 min", difficulty: "Intermedia", languages: "Español", languageNote: "Consulta disponibilidad de guía en inglés.",
	audience: "Familias y aventureros.", season: "Todo el año",
	price: { kind: "paid", adult: 40 },
	meeting: "Parque Calderón / San Blas, Cuenca", returnPoint: "Parque Calderón / Hotel Ensueños, Cuenca",
	operation: "Miércoles a domingo", operatingDays: [0, 3, 4, 5, 6], departures: ["08:30"], minimumPeople: 4,
	transport: "Transporte turístico privado · van de 12–16 plazas", transferDuration: "4 horas según ficha.",
	highlights: [
		{ title: "El silencio de Patoquinoa", description: "Paisaje glaciar, interpretación de naturaleza y fotografía junto a la laguna." },
		{ title: "Elige tu experiencia", description: "Poblado Guavidula o taller de arte y pizza artesanal en Dos Chorreras: dos variantes al mismo precio. Indica tu preferencia al consultar." },
		{ title: "Sabores del campo", description: "Pesca deportiva de trucha andina y una parada gastronómica en La Casa del Abuelo." },
	],
	itinerary: [
		{ durationMinutes: 15, title: "Encuentro en Cuenca", description: "Bienvenida en Parque Calderón / San Blas y preparación para la salida." },
		{ durationMinutes: 50, title: "Laguna de Patoquinoa", description: "Traslado, recorrido interpretativo y fotografía del paisaje glaciar." },
		{ durationMinutes: 40, title: "Santuario Virgen del Cajas", description: "Visita de contemplación espiritual, historia y mirador panorámico." },
		{ durationMinutes: 90, title: "Guavidula o arte en Dos Chorreras", description: "Elige, al mismo precio, entre conocer el Poblado Guavidula (aldea de 1920) o participar en un taller de arte con pizza artesanal en Dos Chorreras." },
		{ durationMinutes: 160, title: "La Casa del Abuelo", description: "Pesca deportiva de trucha andina y degustación campestre tradicional." },
		{ durationMinutes: 30, title: "Regreso a Cuenca", description: "Retorno y despedida en Parque Calderón / Hotel Ensueños." },
	],
	includes: ["Transporte turístico privado ida y vuelta con conductor profesional.", "Guía profesional naturalista y cultural acreditado.", "Visita a Patoquinoa y al Santuario de la Virgen del Cajas.", "Una variante a elegir al mismo precio: visita al Poblado Guavidula o taller de arte con materiales y pizza artesanal en Dos Chorreras.", "Pesca deportiva con equipo y cañas en La Casa del Abuelo.", "Agua y snacks."],
	excludes: ["Propinas voluntarias.", "Bebidas especiales, alcohólicas y consumos adicionales.", "Piezas o combos de arte fuera del paquete base.", "Recogida personalizada en hotel, disponible con recargo.", "Compras personales y actividades no especificadas."],
	packing: mountainPacking,
	restrictions: [
		{ title: "Edad y esfuerzo", description: "Desde 3 años. Condición física regular a moderada para caminatas suaves y aclimatación." },
		{ title: "Altitud", description: "Recorrido a más de 3.800 metros. No recomendado para personas con cardiopatías severas." },
		{ title: "Respeta los senderos", description: "No fumar, botar basura, extraer especies ni salir del sendero delimitado." },
	],
	conditions: paidConditions,
	practical: ["Retira efectivo antes de salir de Cuenca; no hay cajeros en la ruta.", "Consulta las paradas de servicios higiénicos con el guía.", "Indica si prefieres Guavidula o el taller de arte y pizza en Dos Chorreras; ambas variantes tienen el mismo precio."],
	photos: [
		{ src: "/src/assets/tours/cajas.jpg", alt: "Laguna entre montañas del páramo" },
		{ src: "/public/assets/menu/tours/parque-nacional-el-cajas.jpg", alt: "El paisaje andino de El Cajas" },
		{ src: "/src/assets/tours/demo/laguna.jpg", alt: "El reflejo de las montañas sobre un lago" },
		{ src: "/public/assets/menu/tours/aventura-parque-nacional-el-cajas.jpg", alt: "Senderismo en el paisaje andino" },
		{ src: "/public/assets/menu/tours/walking-tour-gastronomico.webp", alt: "Sabores y tradiciones de Cuenca" },
	], illustrativePhotos: true,
	source: source("NAT-002", ["A67", "C67"], ["Dos variantes al mismo precio confirmadas por el propietario: Guavidula o arte y pizza; no acumular ambas inclusiones.", "Total calculado con A22:A27, no con B9.", "Se usan datos operativos, no el mínimo rentable de D15 ni las promesas de las plantillas comerciales.", "Política de cancelación pendiente de revisión."]),
} satisfies Tour;
