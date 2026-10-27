import { paidConditions, source } from "./shared";
import type { Tour } from "./types";

export default {
	enabled: false,
	id: "CULT-002", slug: "guachapala-entre-paisajes-y-tradicion",
	title: "Entre Montañas y Milagros", signature: "Fe, paisajes y aventura",
	category: "Cultura · Naturaleza · Aventura", location: "Andacocha · Guachapala",
	destinations: ["guachapala"], experienceTypes: ["cultura", "naturaleza", "aventura"],
	summary: "Andacocha y Guachaventura: senderos, adrenalina y piscinas temperadas.",
	description: "Combina la devoción en el Santuario del Señor de los Milagros de Andacocha con el ecoturismo y la aventura en Guachaventura. Descubre miradores, el Sendero de los Duendes y un museo de antigüedades; disfruta del puente tibetano y el columpio del barranco antes de relajarte en piscinas temperadas y baño turco.",
	duration: "9 h 15 min", difficulty: "Intermedia", languages: "Español", languageNote: "Consulta disponibilidad de guía en inglés.",
	audience: "Familias, aventureros y grupos.", season: "Todo el año",
	price: { kind: "paid", adult: 40 }, meeting: "Parque Calderón / San Blas, Centro Histórico de Cuenca",
	returnPoint: "Parque Calderón, Centro Histórico de Cuenca", operation: "Viernes a domingo", operatingDays: [0, 5, 6],
	departures: ["08:30"], minimumPeople: 4, transport: "Transporte turístico privado de 12–16 plazas", transferDuration: "Aproximadamente 3 horas según ficha.",
	highlights: [
		{ title: "Un encuentro con la fe", description: "Visita el Santuario de Andacocha, conoce su historia y recorre la feria artesanal." },
		{ title: "Senderos y adrenalina", description: "Miradores, Sendero de los Duendes, puente tibetano y columpio del barranco en Guachaventura." },
		{ title: "Una pausa para relajarte", description: "Piscinas temperadas, hidromasaje y baño turco para completar la experiencia." },
	],
	itinerary: [
		{ durationMinutes: 15, title: "Encuentro y salida desde Cuenca", description: "Encuentro de pasajeros y salida hacia Andacocha desde Parque Calderón / San Blas." },
		{ durationMinutes: 90, title: "Santuario de Andacocha", description: "Visita al Santuario del Señor de los Milagros, reseña histórica y recorrido por la feria artesanal de fe." },
		{ durationMinutes: 45, title: "Rumbo a Guachaventura", description: "Traslado hacia Guachapala y refrigerio de bienvenida." },
		{ durationMinutes: 135, title: "Senderos y miradores", description: "Caminata a las letras, Sendero de los Duendes, mirador panorámico, museo de antigüedades y fotografía en la jaula de conejos." },
		{ durationMinutes: 75, title: "Almuerzo tradicional", description: "Almuerzo típico incluido en un restaurante de la zona, con tilapia, carnes o menú tradicional." },
		{ durationMinutes: 75, title: "Puente tibetano y columpio", description: "Adrenalina en el puente tibetano suspendido y el columpio del barranco, con operadores técnicos." },
		{ durationMinutes: 120, title: "Piscinas y cierre del recorrido", description: "Descanso en piscinas temperadas y baño turco; fotos en el gorila gigante y la casita del árbol antes de iniciar el retorno a Cuenca." },
	],
	includes: ["Transporte turístico privado ida y vuelta desde Cuenca con conductor profesional.", "Guía profesional acreditado durante la ruta.", "Ingreso al Santuario de Andacocha y al complejo Guachaventura.", "Refrigerio de bienvenida y almuerzo típico completo.", "Caminata guiada a miradores, letras, Sendero de los Duendes y museo de antigüedades.", "Puente tibetano y columpio del barranco previstos en el itinerario.", "Piscinas temperadas, hidromasaje y baño turco.", "Botiquín de primeros auxilios, botella de agua y asistencia permanente."],
	excludes: ["Propinas voluntarias.", "Actividades de adrenalina adicionales fuera del paquete base.", "Bebidas especiales, alcohólicas y compras en la feria artesanal.", "Traslados personalizados fuera del punto de encuentro.", "Gastos personales y souvenirs.", "Seguros para actividades de alto riesgo fuera del itinerario regular.", "Consumos o servicios no especificados en las inclusiones."],
	packing: [
		{ title: "Ropa y calzado", description: "Ropa ligera en capas, chaqueta cortavientos impermeable y calzado de trekking o deportivo con buen labrado." },
		{ title: "Protección solar", description: "Protector solar FPS 50+, sombrero o gorra de ala ancha y gafas UV." },
		{ title: "Agua y piscinas", description: "Botella reutilizable de agua, traje de baño, toalla y zapatillas de agua para piscinas y baño turco." },
		{ title: "Fotografía y compras", description: "Cámara, teléfono con batería completa y efectivo en billetes pequeños para la feria." },
	],
	restrictions: [
		{ title: "Edad y condición física", description: "Ambiente familiar; niños desde 5 años recomendados. Nivel intermedio moderado para personas con movilidad básica." },
		{ title: "Salud", description: "Consulta previamente en caso de afecciones cardíacas graves para el baño turco o el puente tibetano." },
	],
	conditions: paidConditions,
	practical: ["Hay baños en el Santuario de Andacocha y en Guachaventura.", "Retira efectivo en Cuenca o Paute; no hay cajeros en Andacocha.", "Lleva efectivo en billetes pequeños para la feria artesanal."],
	photos: [
		{ src: "/public/assets/menu/tours/guachapala-andacocha.jpg", alt: "Vista ilustrativa del entorno de Guachapala y Andacocha" },
		{ src: "/public/assets/menu/destinos/azuay.jpg", alt: "Paisaje ilustrativo del Austro ecuatoriano" },
		{ src: "/src/assets/tours/demo/laguna.jpg", alt: "Paisaje ilustrativo de agua y montañas" },
		{ src: "/public/assets/menu/tours/conoce-deleg.jpg", alt: "Sendero ilustrativo entre vegetación" },
		{ src: "/public/assets/menu/tours/walking-tour-gastronomico.webp", alt: "Gastronomía ilustrativa del Austro" },
	], illustrativePhotos: true,
	source: source("CULT-002", ["A69", "C69"], ["Se adopta CULT-002 de B6; el nombre del archivo aún usa NAT-005.", "Puente tibetano y columpio descritos en B27, incluidos por confirmación del propietario.", "Total suma A22:A28; no se añade un tiempo de regreso que la ficha no separa.", "Política de cancelación y fotografías aprobadas pendientes de revisión."]),
} satisfies Tour;
