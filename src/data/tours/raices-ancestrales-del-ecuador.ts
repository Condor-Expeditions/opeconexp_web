import { mountainPacking, paidConditions, source } from "./shared";
import type { Tour } from "./types";

export default {
	id: "ARQ-001", slug: "raices-ancestrales-del-ecuador", title: "Raíces Ancestrales del Ecuador", signature: "Historias que siguen vivas",
	category: "Arqueología · Historia · Cultura", location: "Pumapungo · Cojitambo · Coyoctor · Ingapirca",
	description: "Sumérgete en las huellas vivas de las civilizaciones cañari e inca: desde los vestigios de Tomebamba en Pumapungo y la fortaleza del Cerro Cojitambo, hasta los Baños del Inca en Coyoctor y el emblemático Templo del Sol en Ingapirca.",
	duration: "Día completo", durationNote: "Encuentro a las 08:15 y regreso previsto a las 17:30. Confirma la duración y los horarios de tu salida al consultar.",
	difficulty: "Intermedia", languages: "Español · Inglés", audience: "Familias, estudiantes, investigadores y amantes de la historia prehispánica.", season: "Todo el año",
	price: { kind: "paid", adult: 40, child: 32, childAges: "6–11 años" },
	meeting: "Parque Calderón / San Blas, Cuenca", returnPoint: "Parque Calderón / Cuenca centro",
	operation: "Miércoles a domingo", operatingDays: [0, 3, 4, 5, 6], departures: ["08:30 · encuentro desde las 08:15"], minimumPeople: 4,
	transport: "SUV o van turística con aire acondicionado", transferDuration: "Aproximadamente 3,5–4 horas de traslados según ficha.",
	highlights: [
		{ title: "Las huellas de Tomebamba", description: "Vestigios urbanos, salas y jardines de Pumapungo para empezar el viaje en el tiempo." },
		{ title: "Fortalezas y rituales", description: "Explora Cojitambo y los altares ceremoniales de los Baños del Inca en Coyoctor." },
		{ title: "Frente al Templo del Sol", description: "Descubre el conjunto monumental de Ingapirca, Pilaloma y la Cara del Inca." },
	],
	itinerary: [
		{ time: "08:15–08:30", title: "Bienvenida en Cuenca", description: "Registro y encuentro en Parque Calderón / San Blas." },
		{ time: "08:30–09:30", title: "Museo y Parque Pumapungo", description: "Visita guiada a los vestigios de Tomebamba, salas y jardines botánicos." },
		{ time: "09:30–10:30", title: "Cerro Cojitambo", description: "Exploración de la fortaleza cañari-inca, canteras y Qhapaq Ñan." },
		{ time: "10:30–12:00", title: "Camino a El Tambo", description: "Traslado escénico por la Panamericana Norte hacia Cañar." },
		{ time: "12:00–13:15", title: "Complejo Coyoctor", description: "Baños del Inca, altares ceremoniales y museo de sitio." },
		{ time: "13:15–14:15", title: "Pausa para almorzar", description: "Almuerzo tradicional andino en restaurante concertado. No incluido en la tarifa." },
		{ time: "14:15–16:15", title: "Complejo de Ingapirca", description: "Recorrido por el Templo del Sol, Pilaloma y la Cara del Inca." },
		{ time: "16:15–17:30", title: "Retorno a Cuenca", description: "Regreso a Parque Calderón / Cuenca centro y despedida." },
	],
	includes: ["Transporte turístico privado ida y vuelta desde Cuenca.", "Guía profesional especializado en arqueología e historia prehispánica.", "Entradas a Pumapungo, Cojitambo, Coyoctor e Ingapirca.", "Snack andino de bienvenida y agua embotellada.", "Bastones de trekking, botiquín de primeros auxilios y seguro de viaje."],
	excludes: ["Almuerzo tradicional y consumos adicionales.", "Bebidas alcohólicas.", "Compras de artesanías y souvenirs.", "Propinas opcionales.", "Recogida personalizada en hotel, disponible con recargo."],
	packing: mountainPacking,
	restrictions: [
		{ title: "Edad y condición física", description: "Desde 5 años; tarifa infantil publicada de 6 a 11. Consulta la tarifa para menores de 6. Nivel físico regular a moderado." },
		{ title: "Altitud", description: "Caminatas entre 2.500 y 3.160 msnm. No recomendado para personas con cardiopatías severas." },
		{ title: "Protege el patrimonio", description: "No subirse a las ruinas, alterar estructuras, extraer piezas ni fumar." },
	],
	conditions: paidConditions,
	practical: ["Hay servicios higiénicos en Pumapungo, Coyoctor e Ingapirca según la ficha.", "Retira efectivo en Cuenca o Azogues; no hay cajeros en Ingapirca.", "Lleva efectivo para el almuerzo y compras locales."],
	photos: [
		{ src: "/src/assets/tours/ingapirca.jpg", alt: "Ruinas de Ingapirca entre montañas" },
		{ src: "/public/assets/menu/tours/ingapirca.jpg", alt: "Amanecer entre siluetas de montañas" },
		{ src: "/public/assets/menu/destinos/canar.jpg", alt: "Paisaje de Cañar" },
		{ src: "/public/assets/menu/tours/walking-tour-cuenca.webp", alt: "Las cúpulas azules de una catedral de Cuenca" },
		{ src: "/public/assets/menu/tours/conoce-deleg.jpg", alt: "Sendero entre árboles y vegetación" },
	], illustrativePhotos: true,
	source: source("ARQ-001", ["A82", "C82"], ["B9 indica 8h, itinerario A22:A29 abarca 08:15–17:30.", "D63 permite 5 años pero la tarifa infantil A82 empieza a los 6.", "Almuerzo aparece en itinerario B27 pero se excluye explícitamente en C55."]),
} satisfies Tour;
