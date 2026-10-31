import { source } from "./shared";
import type { Tour } from "./types";

export default {
	enabled: true,
	id: "NAT-003", slug: "cascada-de-giron", title: "Cascada de Girón: Naturaleza & Historia", signature: "La historia encuentra su paisaje",
	category: "Naturaleza · Historia · Cultura", location: "Girón",
	destinations: ["giron"], experienceTypes: ["naturaleza", "historia", "cultura"],
	summary: "Templete de Tarqui, memoria de Girón y senderismo hacia El Chorro.",
	description: "Combina memoria histórica, arquitectura colonial y naturaleza: visita el Templete de Tarqui, explora la Casa de los Tratados y el Centro Histórico de Girón y admira la Cascada El Chorro con una caminata guiada.",
	duration: "4 h 15 min", difficulty: "Fácil", languages: "Español", languageNote: "Consulta disponibilidad de guía en inglés.",
	audience: "Familias, aventureros, amantes de la cultura y la fotografía y grupos.", season: "Todo el año",
	price: { kind: "paid", adult: 35 }, meeting: "Parque Calderón / San Blas, Cuenca", returnPoint: "Parque Calderón / Hotel Ensueños, Cuenca",
	operation: "Martes a domingo", operatingDays: [0, 2, 3, 4, 5, 6], departures: ["08:30"], minimumPeople: 4,
	transport: "Transporte turístico privado · van de 12–16 plazas", transferDuration: "No desglosado en la ficha.",
	highlights: [
		{ title: "Memoria en Tarqui", description: "Una parada en el Templete de Tarqui para conocer la historia de la Batalla de 1829." },
		{ title: "El patrimonio de Girón", description: "Centro histórico y Casa de los Tratados en un recorrido guiado por su memoria colonial." },
		{ title: "La fuerza de El Chorro", description: "Senderismo interpretativo hacia una caída de agua de 70 metros." },
	],
	itinerary: [
		{ durationMinutes: 15, title: "Encuentro en Cuenca", description: "Punto de encuentro, registro de pasajeros y salida desde Cuenca." },
		{ durationMinutes: 45, title: "Templete de Tarqui", description: "Parada histórica con reseña de la Batalla de 1829 y vista panorámica." },
		{ durationMinutes: 45, title: "Centro histórico y Casa de los Tratados", description: "Recorrido patrimonial por el Centro Histórico de Girón y visita a la Casa de los Tratados." },
		{ durationMinutes: 105, title: "Cascada El Chorro de Girón", description: "Caminata interpretativa por los senderos y observación de la caída de agua de 70 metros." },
		{ durationMinutes: 45, title: "Regreso a Cuenca", description: "Traslado panorámico de retorno al punto de encuentro y fin del recorrido." },
	],
	includes: ["Transporte turístico privado ida y vuelta desde Cuenca.", "Guía profesional acreditado en historia, patrimonio y naturaleza.", "Entradas al Templete de Tarqui, Casa de los Tratados y El Chorro.", "Refrigerio ligero y agua purificada embotellada.", "Botiquín de primeros auxilios y seguro de asistencia en viaje."],
	excludes: ["Almuerzo y bebidas alcohólicas.", "Propinas voluntarias.", "Gastos personales, artesanías y souvenirs.", "Actividades opcionales o desvíos fuera del itinerario.", "Recogida personalizada en hotel."],
	packing: [
		{ title: "Vestimenta y calzado", description: "Ropa abrigada e impermeable y calzado de trekking." },
		{ title: "Protección solar", description: "Protector solar FPS 50+, gorra y gafas UV." },
		{ title: "Agua y snacks", description: "Botella reutilizable con agua y snacks secos." },
		{ title: "Para la cascada", description: "Cámara, repelente y efectivo en billetes pequeños." },
	],
	restrictions: [
		{ title: "Edad y caminatas", description: "Desde 5 años. Nivel regular a moderado para caminatas de unas 2 horas." },
		{ title: "Salud", description: "No recomendado en embarazos avanzados o cardiopatías." },
		{ title: "Respeto por la naturaleza", description: "No fumar, botar basura ni extraer especies." },
	],
	conditions: [],
	practical: ["La salida se realiza desde el punto de encuentro, sin recogida personalizada en hotel.", "Lleva efectivo para compras y gastos personales."],
	photos: [
		{ src: "/src/assets/tours/el-chorro/20261024_0088.webp", alt: "Cascada El Chorro de Girón y pasarela de madera al pie de la pared rocosa", position: "50% 45%" },
		{ src: "/src/assets/tours/templete-de-tarqui/20261024_0008.webp", alt: "Escalinata y murales del Templete de Tarqui" },
		{ src: "/src/assets/tours/museo-de-los-tratados/20261024_0037.webp", alt: "Monumento frente a la fachada del Museo Casa de los Tratados en Girón" },
		{ src: "/src/assets/tours/iglesia-de-giron/20261024_0304.webp", alt: "Jardines, árboles y senderos de la plaza central de Girón" },
		{ src: "/src/assets/tours/iglesia-de-giron/20261024_0324.webp", alt: "Nave central y altar de la iglesia de Girón" },
		{ src: "/src/assets/tours/el-chorro/20261024_0047.webp", alt: "Escalinata de madera entre la vegetación del sendero de El Chorro" },
		{ src: "/src/assets/tours/el-chorro/20261024_0079.webp", alt: "Caída de agua de El Chorro sobre las rocas cubiertas de vegetación" },
		{ src: "/src/assets/tours/templete-de-tarqui/20261024_0030.webp", alt: "Valle y montañas vistos desde el entorno del Templete de Tarqui" },
	], illustrativePhotos: false,
	source: source("NAT-003", ["A56", "C56"], ["Total calculado con A22:A26; D14 contiene la duración comercial, no un traslado desglosado.", "FICHA TOUR no incluye sección de condiciones operativas: no importar políticas desde las plantillas comerciales.", "Política de cancelación pendiente de revisión."]),
} satisfies Tour;
