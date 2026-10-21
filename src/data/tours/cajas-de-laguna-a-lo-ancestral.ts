import { mountainPacking, paidConditions, source } from "./shared";
import type { Tour } from "./types";

export default {
	id: "NAT-002", slug: "cajas-de-laguna-a-lo-ancestral",
	title: "Cajas: de Laguna a lo Ancestral", signature: "Otra forma de sentir los Andes",
	category: "Naturaleza · Cultura · Gastronomía", location: "El Cajas · Cuenca",
	destinations: ["el-cajas"], experienceTypes: ["naturaleza", "cultura", "gastronomia"],
	summary: "Un día entre paisajes andinos, tradiciones y experiencias del campo.",
	description: "Redescubre el Cajas desde una perspectiva ancestral y vivencial: la Laguna de Patoquinoa, el Santuario de la Virgen y una experiencia entre arte y pizza artesanal en Dos Chorreras o el Poblado de Guavidula. El día continúa con pesca deportiva en La Casa del Abuelo.",
	duration: "8 horas", difficulty: "Media", languages: "Español · Inglés",
	audience: "Familias, aventureros, amantes de la cultura, fotógrafos, viajeros y grupos.", season: "Todo el año",
	price: { kind: "paid", adult: 40, child: 35, childAges: "6–11 años" },
	meeting: "Parque Calderón / San Blas, Cuenca", returnPoint: "Parque Calderón / Hotel Ensueños, Cuenca",
	operation: "Miércoles a domingo", operatingDays: [0, 3, 4, 5, 6], departures: ["08:30 · encuentro desde las 08:15"], minimumPeople: 4,
	transport: "Transporte turístico privado · van de 12–16 plazas", transferDuration: "La ficha indica 8 horas para la jornada completa.",
	highlights: [
		{ title: "El silencio de Patoquinoa", description: "Paisaje glaciar, interpretación de naturaleza y fotografía junto a la laguna." },
		{ title: "Elige tu experiencia", description: "Guavidula y Valle Perdido, o taller de arte y pizza artesanal en Dos Chorreras. Confirma la opción al consultar." },
		{ title: "Sabores del campo", description: "Pesca deportiva de trucha andina y una parada gastronómica en La Casa del Abuelo." },
	],
	itinerary: [
		{ time: "08:15–08:30", title: "Encuentro en Cuenca", description: "Bienvenida en Parque Calderón / San Blas y salida oficial a las 08:30." },
		{ time: "08:30–09:20", title: "Laguna de Patoquinoa", description: "Traslado, recorrido interpretativo y fotografía del paisaje glaciar." },
		{ time: "09:20–10:20", title: "Santuario Virgen del Cajas", description: "Visita de contemplación espiritual y mirador panorámico." },
		{ time: "10:20–12:50", title: "Guavidula o arte en Dos Chorreras", description: "Opción A: Poblado Guavidula y Valle Perdido. Opción B: taller de arte y pizza en Dos Chorreras. La opción y sus inclusiones se confirman antes de reservar." },
		{ time: "12:50–15:30", title: "La Casa del Abuelo", description: "Pesca deportiva de trucha andina y almuerzo campestre según el programa confirmado." },
		{ time: "15:30–16:30", title: "Regreso a Cuenca", description: "Retorno y despedida en Parque Calderón / Hotel Ensueños." },
	],
	includes: ["Transporte turístico privado ida y vuelta con conductor profesional.", "Guía profesional naturalista y cultural acreditado.", "Visita a Patoquinoa y al Santuario de la Virgen del Cajas.", "Experiencia Guavidula / Valle Perdido o taller de arte y pizza artesanal: confirmar modalidad e inclusiones al reservar.", "Pesca deportiva con equipo y cañas en La Casa del Abuelo / San Juan.", "Agua y snacks."],
	excludes: ["Propinas voluntarias.", "Bebidas especiales, alcohólicas y consumos adicionales.", "Piezas o combos de arte fuera del paquete base.", "Recogida personalizada en hotel, disponible con recargo.", "Compras personales y actividades no especificadas."],
	packing: mountainPacking,
	restrictions: [
		{ title: "Edad y esfuerzo", description: "Desde 6 años. Condición física regular a moderada para caminatas suaves y aclimatación." },
		{ title: "Altitud", description: "Recorrido a más de 3.800 metros. No recomendado para personas con cardiopatías severas." },
		{ title: "Respeta los senderos", description: "No fumar, botar basura, extraer especies ni salir del sendero delimitado." },
	],
	conditions: paidConditions,
	practical: ["Retira efectivo antes de salir de Cuenca; no hay cajeros en la ruta.", "Consulta las paradas de servicios higiénicos con el guía.", "Confirma si tu programa incluye Guavidula o Dos Chorreras y qué alimentación corresponde."],
	photos: [
		{ src: "/src/assets/tours/cajas.jpg", alt: "Laguna entre montañas del páramo" },
		{ src: "/public/assets/menu/tours/parque-nacional-el-cajas.jpg", alt: "El paisaje andino de El Cajas" },
		{ src: "/src/assets/tours/demo/laguna.jpg", alt: "El reflejo de las montañas sobre un lago" },
		{ src: "/public/assets/menu/tours/aventura-parque-nacional-el-cajas.jpg", alt: "Senderismo en el paisaje andino" },
		{ src: "/public/assets/menu/tours/walking-tour-gastronomico.webp", alt: "Sabores y tradiciones de Cuenca" },
	], illustrativePhotos: true,
	source: source("NAT-002", ["A58", "C58"], ["B25 plantea alternativas A/B, pero A33/A34 enumeran ambas como inclusiones. Confirmar paquete y comidas.", "B9: 8h; salida 08:30 a retorno 16:30, con encuentro 08:15.", "Políticas y tarifas provienen de las plantillas A58/C58 dentro de FICHA TOUR; no de MODELOS DE COSTOS."]),
} satisfies Tour;
