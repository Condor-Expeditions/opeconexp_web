import { paidConditions, source } from "./shared";
import type { Tour } from "./types";

export default {
	enabled: true,
	id: "NAT-006", slug: "paute-dinosaurios-naturaleza-y-sabores", title: "Paute: Dinosaurios, Naturaleza y Sabores", signature: "Un valle para compartir",
	category: "Naturaleza · Gastronomía", location: "Paute",
	destinations: ["paute"], experienceTypes: ["naturaleza", "gastronomia"],
	summary: "Jurassic Paute, Animal Paute y un encuentro con los sabores del valle.",
	description: "Descubre el valle de Paute en una experiencia familiar desde Cuenca. Recorre Jurassic Paute y Animal Paute, visita el Parque Lineal y el monumento de La Cuchara de Palo y disfruta de un almuerzo tradicional con degustación de dulces del cantón.",
	duration: "5 h 15 min", difficulty: "Intermedia", languages: "Español", languageNote: "Consulta disponibilidad de guía en inglés.",
	audience: "Familias, amantes de la fotografía y grupos.", season: "Todo el año",
	price: { kind: "paid", adult: 35 }, meeting: "Parque Calderón / Hotel Ensueños, Cuenca", returnPoint: "Parque Calderón / Hotel Ensueños, Cuenca",
	operation: "Viernes a domingo", operatingDays: [0, 5, 6], departures: ["08:30", "14:00"], minimumPeople: 4,
	transport: "Van turística climatizada de 12–16 plazas", transferDuration: "Aproximadamente 1,5 horas, 45 minutos por trayecto.",
	highlights: [
		{ title: "Un encuentro con los dinosaurios", description: "Recorrido temático entre réplicas y fotografías en Jurassic Paute." },
		{ title: "Naturaleza en el valle", description: "Visita a Animal Paute y paseo escénico junto al río en el Parque Lineal." },
		{ title: "Sabores y madera labrada", description: "La Cuchara de Palo, talleres de madera y gastronomía tradicional pauteña." },
	],
	itinerary: [
		{ durationMinutes: 15, title: "Encuentro y salida desde Cuenca", description: "Registro de pasajeros y salida hacia Paute." },
		{ durationMinutes: 60, title: "Jurassic Paute", description: "Recorrido guiado temático con réplicas de dinosaurios y tiempo para fotografías." },
		{ durationMinutes: 60, title: "Animal Paute", description: "Visita a la granja y espacio de fauna con contacto natural e interacción acompañada por el personal del lugar." },
		{ durationMinutes: 45, title: "La Cuchara de Palo", description: "Visita a la escultura y a los talleres de madera labrada." },
		{ durationMinutes: 45, title: "Parque Lineal de Paute", description: "Paseo escénico, descanso y fotografías junto a las orillas del río." },
		{ durationMinutes: 45, title: "Almuerzo y sabores locales", description: "Almuerzo típico incluido y degustación de dulces y conservas del cantón." },
		{ durationMinutes: 45, title: "Regreso a Cuenca", description: "Traslado de retorno y desembarque en Parque Calderón." },
	],
	includes: ["Transporte turístico ida y vuelta en van climatizada con conductor profesional.", "Guía profesional acreditado en español.", "Entradas a Jurassic Paute y Animal Paute.", "Almuerzo tradicional pauteño y refrigerio de agua.", "Botiquín de primeros auxilios y seguro de asistencia médica en viaje.", "Visita guiada a La Cuchara de Palo y degustación tradicional de dulces."],
	excludes: ["Propinas voluntarias.", "Compras de artesanías en madera, recuerdos y gastos personales.", "Bebidas alcohólicas y consumos fuera del menú acordado.", "Actividades opcionales, desvíos y traslados fuera del itinerario.", "Seguros especiales para actividades no programadas.", "Recogida personalizada fuera del punto de encuentro."],
	packing: [
		{ title: "Ropa y calzado", description: "Ropa ligera para clima cálido, gorra y calzado deportivo cómodo." },
		{ title: "Protección solar", description: "Protector solar FPS 50+, gorra y gafas UV." },
		{ title: "Hidratación", description: "Botella reutilizable con agua y snacks secos." },
		{ title: "Para el recorrido", description: "Cámara, repelente y efectivo en billetes pequeños." },
	],
	restrictions: [
		{ title: "Edad y caminatas", description: "Apto para la familia, con niños desde 3 años. Caminatas llanas en senderos de parques." },
		{ title: "Salud", description: "No recomendado en embarazos avanzados o cardiopatías." },
		{ title: "Respeto por el entorno", description: "No fumar, botar basura ni extraer especies." },
	],
	conditions: paidConditions,
	practical: ["Hay servicios higiénicos en Jurassic Paute, Animal Paute y Parque Lineal.", "Hay cajeros en el centro de Paute; se recomienda retirar efectivo en billetes pequeños antes de salir."],
	photos: [
		{ src: "/public/assets/menu/destinos/azuay.jpg", alt: "Paisaje ilustrativo del valle y montañas de Azuay" },
		{ src: "/public/assets/menu/tours/conoce-deleg.jpg", alt: "Sendero ilustrativo entre vegetación" },
		{ src: "/public/assets/menu/tours/walking-tour-gastronomico.webp", alt: "Gastronomía ilustrativa de la región" },
		{ src: "/public/assets/menu/tours/ruta-artesano.jpg", alt: "Artesanías ilustrativas de un mercado" },
		{ src: "/src/assets/tours/demo/laguna.jpg", alt: "Paisaje natural ilustrativo de agua y montañas" },
	], illustrativePhotos: true,
	source: source("NAT-006", ["A70", "C70"], ["Código NAT-006 de B6; las plantillas comerciales aún usan NAT-004.", "Total calculado con A22:A28, sin usar las duraciones comerciales de B9 o C70.", "Dificultad intermedia de D7 confirmada por el propietario.", "Política de cancelación y fotografías aprobadas pendientes de revisión."]),
} satisfies Tour;
