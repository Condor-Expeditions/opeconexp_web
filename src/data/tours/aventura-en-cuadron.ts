import { mountainPacking, paidConditions, source } from "./shared";
import type { Tour } from "./types";

export default {
	id: "NAT-003", slug: "aventura-en-cuadron", title: "Aventura en Cuadrón: Cascada & Laguna", signature: "Un día para sentirlo todo",
	category: "Naturaleza · Aventura · Historia", location: "Girón · San Fernando",
	destinations: ["giron"], experienceTypes: ["naturaleza", "aventura", "historia"],
	summary: "La fuerza de El Chorro, una aventura en cuadrón y la calma de Busa.",
	description: "Combina historia, cascadas y paisajes andinos: recorre el Templete de Tarqui y la Casa de los Tratados, descubre el Centro Histórico de Girón, siente la adrenalina de 30 minutos en cuadrón, contempla El Chorro y relájate en la Laguna de Busa.",
	duration: "8 horas", difficulty: "Intermedia", languages: "Español · Inglés", audience: "Familias, aventureros y grupos.", season: "Todo el año",
	price: { kind: "paid", adult: 85 }, meeting: "Parque Calderón / San Blas, Cuenca", returnPoint: "Parque Calderón / Hotel Ensueños, Cuenca",
	operation: "Martes a domingo", operatingDays: [0, 2, 3, 4, 5, 6], departures: ["Mañana"], minimumPeople: 4,
	transport: "Van turística de 12–16 plazas con aire acondicionado", transferDuration: "La ficha indica 8 horas para la jornada completa.",
	highlights: [
		{ title: "Historia en el camino", description: "El Templete de Tarqui y la Casa de los Tratados conectan el paisaje con su pasado." },
		{ title: "Treinta minutos de aventura", description: "Un circuito en cuadrón con casco y equipo de seguridad en el entorno de El Chorro." },
		{ title: "La calma de Busa", description: "Senderismo y tiempo libre junto a la laguna de San Fernando." },
	],
	itinerary: [
		{ durationMinutes: 15, title: "Salida desde Cuenca", description: "Encuentro y traslado privado hacia Girón." },
		{ durationMinutes: 40, title: "Templete de Tarqui", description: "Parada histórica y recorrido explicativo por el monumento de Portete de Tarqui." },
		{ durationMinutes: 60, title: "Casa de los Tratados y Girón", description: "Visita guiada al museo y caminata por el centro histórico." },
		{ durationMinutes: 140, title: "El Chorro y el cuadrón", description: "Caminata interpretativa y circuito de 30 minutos en ATV con instructor local." },
		{ durationMinutes: 60, title: "Almuerzo tradicional", description: "Almuerzo completo en un restaurante de Girón o San Fernando, incluido en el programa." },
		{ durationMinutes: 120, title: "Laguna de Busa", description: "Recorrido por el lago, senderismo y tiempo libre. El paseo en bote se paga aparte." },
		{ durationMinutes: 60, title: "De vuelta en Cuenca", description: "Traslado y despedida en Parque Calderón / Hotel Ensueños." },
	],
	includes: ["Transporte turístico privado ida y vuelta desde Cuenca.", "Guía profesional acreditado durante el recorrido.", "Entradas al Templete, Casa de los Tratados, El Chorro y Busa.", "Circuito de 30 minutos en cuadrón con casco y seguridad.", "Almuerzo tradicional completo, agua embotellada y snack."],
	excludes: ["Alquiler opcional de bote o pato en Busa.", "Bebidas alcohólicas y consumos adicionales al menú.", "Propinas opcionales.", "Compras personales y souvenirs.", "Recogida personalizada puerta a puerta en hotel."],
	packing: [...mountainPacking, { title: "Para el entorno natural", description: "Lleva repelente y protege tu cámara del agua." }],
	restrictions: [
		{ title: "Edad y caminatas", description: "Tour desde 5 años. Nivel regular a moderado para caminatas de 2–3 horas. Consulta las condiciones de edad y seguridad para conducir o participar en el ATV antes de reservar." },
		{ title: "Salud", description: "No recomendado en embarazos avanzados o cardiopatías." },
		{ title: "Respeto por la naturaleza", description: "No fumar, botar basura ni extraer especies." },
	],
	conditions: [...paidConditions, { title: "Anticipación", description: "La ficha solicita confirmación con 48 horas de anticipación. Consulta las opciones de pago con el equipo." }],
	practical: ["Lleva efectivo para actividades opcionales y compras.", "El equipo debe confirmar las condiciones de participación en el cuadrón antes de reservar."],
	photos: [
		{ src: "/src/assets/tours/demo/cascada.jpg", alt: "Una cascada entre rocas y vegetación" },
		{ src: "/src/assets/tours/demo/laguna.jpg", alt: "Lago rodeado de montañas" },
		{ src: "/public/assets/menu/tours/conoce-deleg.jpg", alt: "Sendero a través del bosque" },
		{ src: "/src/assets/tours/nevado.jpg", alt: "Una cumbre nevada de los Andes" },
		{ src: "/public/assets/menu/tours/walking-tour-gastronomico.webp", alt: "Una experiencia gastronómica local" },
	], illustrativePhotos: true,
	source: source("NAT-003", ["A82", "C82"], ["D63 permite tour desde 5 años; no hay condiciones de conducción ATV, no inferir que un niño puede conducir.", "A82 y C82 difieren en gratuidad/deducciones de cancelación: consultar política.", "B73:E77 contienen logística aparentemente copiada de El Cajas; no publicar."]),
} satisfies Tour;
