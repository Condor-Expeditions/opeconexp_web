import { paidConditions, source } from "./shared";
import type { Tour } from "./types";

export default {
	enabled: true,
	id: "ARQ-002", slug: "raices-ancestrales-sigsig", title: "Raíces Ancestrales: Sígsig y Chobshi", signature: "Un encuentro con la memoria",
	category: "Arqueología · Historia · Cultura", location: "Sígsig · Chobshi",
	destinations: ["sigsig"], experienceTypes: ["arqueologia", "historia", "cultura"],
	summary: "Cueva Negra, Castillo de Duma, museo y caminata por el Pailón de Chobshi.",
	description: "Viaja desde Cuenca hacia Sígsig y Chobshi para descubrir la Cueva Negra, las ruinas del Castillo del Cacique Duma y el Museo de Sitio. La jornada incluye una pausa para almorzar en Sígsig y una caminata interpretativa por el Cañón del Pailón de Chobshi.",
	duration: "9 h 30 min", difficulty: "Fácil", languages: "Español", languageNote: "Consulta disponibilidad de guía en inglés.",
	audience: "Familias, grupos y viajeros.", season: "Todo el año",
	price: { kind: "paid", adult: 40 }, meeting: "Parque Calderón, Centro Histórico de Cuenca", returnPoint: "Parque Calderón, Centro Histórico de Cuenca",
	operation: "Viernes a domingo", operatingDays: [0, 5, 6], departures: ["08:30"], minimumPeople: 4,
	transport: "Van turística de 12–16 plazas", transferDuration: "Aproximadamente 3 h 10 min según ficha.",
	highlights: [
		{ title: "La Cueva Negra de Chobshi", description: "Una visita arqueológica guiada a las huellas de los primeros pobladores." },
		{ title: "El legado del Cacique Duma", description: "Explora las ruinas y los muros ceremoniales del castillo y conoce el Museo de Sitio." },
		{ title: "El paisaje del Pailón", description: "Caminata interpretativa por el cañón natural y el ancestral camino cañari." },
	],
	itinerary: [
		{ durationMinutes: 90, title: "De Cuenca a Sígsig", description: "Organización del grupo y traslado panorámico hacia la Cueva Negra de Chobshi." },
		{ durationMinutes: 75, title: "Cueva Negra de Chobshi", description: "Visita arqueológica guiada a la cueva." },
		{ durationMinutes: 75, title: "Castillo del Cacique Duma", description: "Exploración de las ruinas y muros ceremoniales del complejo arqueológico." },
		{ durationMinutes: 75, title: "Tiempo para almorzar en Sígsig", description: "Pausa para almorzar y descansar en un restaurante local. El almuerzo se paga por separado y no está incluido en el precio." },
		{ durationMinutes: 60, title: "Museo de Sitio de Chobshi", description: "Recorrido interpretativo por las salas de exhibición del museo." },
		{ durationMinutes: 105, title: "Cañón del Pailón de Chobshi", description: "Caminata interpretativa por el cañón y el ancestral camino cañari." },
		{ durationMinutes: 90, title: "Regreso a Cuenca", description: "Traslado de retorno a la ciudad de Cuenca." },
	],
	includes: ["Transporte turístico ida y vuelta desde Cuenca con conductor profesional.", "Guía acreditado especializado en arqueología y patrimonio andino.", "Entradas y visitas guiadas a Cueva Negra, Castillo de Duma y Museo de Chobshi.", "Caminata guiada por el ancestral camino cañari y cañón del Pailón.", "Botiquín de primeros auxilios y póliza de asistencia médica en ruta.", "Refrigerio ligero y botella de agua purificada."],
	excludes: ["Propinas voluntarias.", "Gastos personales, artesanías y compras no especificadas.", "Bebidas alcohólicas o consumos fuera del itinerario.", "Transportes adicionales o actividades fuera de ruta.", "Seguros especiales de aventura extrema.", "Almuerzo completo; se reserva tiempo para almorzar por cuenta propia."],
	packing: [
		{ title: "Vestimenta y calzado", description: "Ropa cómoda, abrigo ligero y calzado cómodo para caminar." },
		{ title: "Protección solar", description: "Protector solar, sombrero o gorra y gafas UV." },
		{ title: "Agua y efectivo", description: "Botella de agua y efectivo en billetes pequeños para el almuerzo y gastos personales." },
		{ title: "Fotografía", description: "Cámara o teléfono móvil para fotografías y videos." },
	],
	restrictions: [
		{ title: "Edad y condición física", description: "Apto para todas las edades y público familiar. Nivel físico bajo según la ficha del tour." },
		{ title: "Salud", description: "Apto para público general, sin restricciones especiales indicadas en la ficha." },
	],
	conditions: paidConditions,
	practical: ["Lleva efectivo para el almuerzo y gastos personales."],
	photos: [
		{ src: "/public/assets/menu/tours/ruta-artesano.jpg", alt: "Imagen ilustrativa de artesanías del Austro" },
		{ src: "/public/assets/menu/destinos/azuay.jpg", alt: "Paisaje ilustrativo de Azuay" },
		{ src: "/public/assets/menu/tours/conoce-deleg.jpg", alt: "Sendero ilustrativo entre árboles" },
		{ src: "/src/assets/tours/demo/tejidos.jpg", alt: "Textiles ilustrativos de la tradición artesanal" },
		{ src: "/public/assets/menu/tours/walking-tour-gastronomico.webp", alt: "Gastronomía ilustrativa del Austro" },
	], illustrativePhotos: true,
	source: source("ARQ-002", ["A69", "C69"], ["Se conserva la dificultad fácil de D7 por indicación del propietario.", "Tiempo para almorzar confirmado, coste excluido según C47; se elimina la referencia errónea a media jornada.", "B37:B38 y B61:E64 contienen logística de Chordeleg/Gualaceo: no usar. D52/D54 contienen texto de talleres: no trasladarlo a la ruta arqueológica.", "A70/C70 son plantillas ajenas de ARTE-001; se ignoran. C69 usa código ARQ-001 incorrecto.", "Política de cancelación y fotografías aprobadas pendientes de revisión."]),
} satisfies Tour;
