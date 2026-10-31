import { paidConditions, source } from "./shared";
import type { Tour } from "./types";

export default {
	enabled: true,
	id: "ARTE-001", slug: "compras-y-artesanias", title: "Compras y Artesanías", signature: "El valor de lo hecho a mano",
	category: "Cultura · Artesanía · Compras", location: "Chordeleg · Gualaceo",
	destinations: ["chordeleg", "gualaceo"], experienceTypes: ["cultura", "artesania"],
	summary: "Filigrana, calzado artesanal y tejido Ikat entre Chordeleg y Gualaceo.",
	description: "Descubre la orfebrería en filigrana de Chordeleg, el calzado artesanal de Gualaceo y el tejido tradicional de la makana. Un recorrido cultural con demostraciones de los artesanos y tiempo organizado para compras directas.",
	duration: "4 h", difficulty: "Fácil", languages: "Español", languageNote: "Consulta disponibilidad de guía en inglés.",
	audience: "Familias, grupos y viajeros.", season: "Todo el año",
	price: { kind: "paid", adult: 25 }, meeting: "Parque Calderón, Centro Histórico de Cuenca", returnPoint: "Parque Calderón, Centro Histórico de Cuenca",
	operation: "Viernes a domingo", operatingDays: [0, 5, 6], departures: ["08:30", "14:00"], minimumPeople: 4,
	transport: "Van turística de 12–16 plazas", transferDuration: "Aproximadamente 1,5 horas.",
	highlights: [
		{ title: "La filigrana de Chordeleg", description: "Museo Comunitario, talleres de plata y oro y un paseo por la plaza central." },
		{ title: "El oficio del calzado", description: "Fábricas artesanales de Gualaceo y compras directas de calzado y cuero." },
		{ title: "La tradición de la makana", description: "Demostración de tintes naturales y técnica Ikat en el Museo Taller Casa de la Makana." },
	],
	itinerary: [
		{ durationMinutes: 45, title: "De Cuenca a Chordeleg", description: "Encuentro y traslado panorámico con introducción cultural." },
		{ durationMinutes: 60, title: "Museo y filigrana en Chordeleg", description: "Visita al Museo Comunitario, taller-tienda de filigrana en plata y oro y recorrido por la plaza central." },
		{ durationMinutes: 15, title: "Rumbo a Gualaceo", description: "Traslado terrestre hacia el valle de Gualaceo." },
		{ durationMinutes: 45, title: "Calzado y cuero artesanal", description: "Recorrido por fábricas artesanales con tiempo de compras directas." },
		{ durationMinutes: 45, title: "Casa de la Makana en Bullcay", description: "Demostración de tintes naturales y técnica Ikat en el Museo Taller Casa de la Makana." },
		{ durationMinutes: 30, title: "Regreso a Cuenca", description: "Traslado de retorno y despedida en el punto de encuentro central." },
	],
	includes: ["Transporte turístico ida y vuelta desde Cuenca con conductor profesional.", "Guía acreditado especializado en artesanías y cultura.", "Entradas y visitas al Museo Comunitario y Museo Casa de la Makana.", "Demostraciones de orfebrería en filigrana y técnica textil Ikat.", "Botiquín de primeros auxilios y póliza de asistencia médica en ruta.", "Tiempo organizado para compras en centros históricos y fábricas."],
	excludes: ["Propinas voluntarias.", "Compras personales de joyas, calzado y souvenirs.", "Bebidas alcohólicas y consumos no estipulados.", "Actividades o traslados fuera del itinerario.", "Seguros para actividades no contempladas.", "Almuerzo formal."],
	packing: [
		{ title: "Camina con comodidad", description: "Ropa ligera y cómoda, abrigo ligero y calzado cómodo para caminar." },
		{ title: "Protección solar", description: "Protector solar, sombrero o gorra y gafas UV." },
		{ title: "Agua y efectivo", description: "Botella de agua y efectivo en billetes pequeños para compras." },
		{ title: "Recuerdos del recorrido", description: "Cámara o teléfono móvil para fotografías y videos." },
	],
	restrictions: [
		{ title: "Edad y condición física", description: "Apto para todas las edades. Caminatas urbanas suaves y visitas a talleres, de exigencia baja." },
		{ title: "Respeto por los talleres", description: "Respeta las normas de cada taller artesanal y no dañes las piezas." },
	],
	conditions: paidConditions,
	practical: ["Hay baños en la plaza central de Chordeleg y Casa de la Makana.", "Retira efectivo en Cuenca; también hay cajeros en el centro de Chordeleg.", "Los talleres y las compras menores manejan preferentemente efectivo."],
	photos: [
		{ src: "/src/assets/tours/chordeleg/20261024_0596.webp", alt: "Manos de un artesano trabajando una pieza de filigrana en Chordeleg", position: "50% 55%" },
		{ src: "/src/assets/tours/museo-de-la-makana/20261024_0439.webp", alt: "Demostración de tejido en telar en el Museo de la Makana" },
		{ src: "/src/assets/tours/chordeleg/20261024_0605.webp", alt: "Collares y piezas de joyería en una vitrina de Chordeleg" },
		{ src: "/src/assets/tours/museo-de-la-makana/20261024_0368.webp", alt: "Semillas y materiales para la demostración de tintes naturales en la Makana" },
		{ src: "/src/assets/tours/chordeleg/20261024_0562.webp", alt: "Tiendas de artesanías y fachadas del centro de Chordeleg" },
		{ src: "/src/assets/tours/museo-de-la-makana/20261024_0462.webp", alt: "Prendas de colores y demostración de una makana en el taller artesanal" },
		{ src: "/src/assets/tours/museo-de-la-makana/20261024_0470.webp", alt: "Textiles y prendas expuestos en el interior de la Casa de la Makana" },
		{ src: "/src/assets/tours/chordeleg/20261024_0533.webp", alt: "Letras de Chordeleg y arquitectura alrededor de la plaza central" },
	], illustrativePhotos: false,
	source: source("ARTE-001", ["A69", "C69"], ["Total calculado con A22:A27. Precio desde la tarifa general, sin tarifas infantiles.", "Política de cancelación pendiente de revisión."]),
} satisfies Tour;
