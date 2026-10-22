import { source } from "./shared";
import type { Tour } from "./types";

export default {
	id: "FWT-001", slug: "free-walking-tour-cuenca", title: "Free Walking Tour de Cuenca", signature: "La ciudad, paso a paso",
	category: "Cultura · Recorrido a pie", location: "Centro Histórico de Cuenca",
	destinations: ["cuenca"], experienceTypes: ["cultura", "recorrido-a-pie"],
	summary: "Patios, plazas y cacao: conoce las historias del centro de Cuenca.",
	description: "Descubre el encanto colonial y patrimonial de Cuenca en un recorrido a pie dinámico y sin tarifa fija. Entre patios, flores, arquitectura y cacao, conoce la ciudad con un guía local y aporta al finalizar según tu satisfacción.",
	duration: "2–2,5 horas", difficulty: "Fácil", languages: "Español · Inglés", audience: "Familias y viajeros. Apto para todas las edades.", season: "Todo el año",
	price: { kind: "free" }, meeting: "Parque Calderón, Centro Histórico de Cuenca", returnPoint: "Museo del Cacao, Centro Histórico de Cuenca",
	operation: "Lunes y martes · otras salidas según demanda", operatingDays: [0, 1, 2, 3, 4, 5, 6],
	departures: ["Mañana", "Tarde"], minimumPeople: 2,
	transport: "100% a pie · sin transporte vehicular", transferDuration: "Sin traslados vehiculares",
	highlights: [
		{ title: "Patios que cuentan historias", description: "La Catedral Antigua y el Seminario San Luis, entre memoria y arquitectura colonial." },
		{ title: "Flores y arte local", description: "Una caminata por el Parque de las Flores y el entorno del Museo de la Témpera." },
		{ title: "Un cierre con cacao", description: "Descubre la historia del cacao antes de despedirte de tu guía." },
	],
	itinerary: [
		{ durationMinutes: 15, title: "Nos vemos en Parque Calderón", description: "Bienvenida, presentación del guía y explicación de la dinámica del Free Tour." },
		{ durationMinutes: 30, title: "Catedral Antigua y Seminario San Luis", description: "Historia de la fundación de Cuenca y vistas de sus patios coloniales." },
		{ durationMinutes: 30, title: "Parque de las Flores y arte local", description: "Recorrido aromático y acercamiento al arte tradicional en el entorno del Museo de la Témpera." },
		{ durationMinutes: 30, title: "Palacio de Justicia y eje patrimonial", description: "Arquitectura neoclásica e historia institucional republicana." },
		{ durationMinutes: 45, title: "Museo del Cacao y despedida", description: "Historia del cacao y cierre del recorrido con aporte voluntario. Las entradas a interiores con costo no están incluidas." },
	],
	includes: ["Acompañamiento de un guía turístico local profesional y calificado.", "Recorrido interpretativo e interactivo por el Centro Histórico.", "Flexibilidad del itinerario y personalización de paradas.", "Orientación turística, datos históricos y recomendaciones.", "Asistencia en ruta durante el recorrido."],
	excludes: ["Entradas a museos e iglesias con costo.", "Alimentos y bebidas.", "Transporte o traslados vehiculares.", "Aporte voluntario al guía, que tú decides al finalizar.", "Visitas vinculadas a otros tours comerciales."],
	packing: [
		{ title: "Camina con comodidad", description: "Calzado cómodo para adoquines, ropa liviana por capas e impermeable." },
		{ title: "Protección solar", description: "Protector solar, gorra o sombrero y gafas UV." },
		{ title: "Agua y snacks", description: "Botella reutilizable, snacks y tu medicación personal." },
		{ title: "Efectivo menudo", description: "Para entradas opcionales y el aporte voluntario al guía." },
	],
	restrictions: [
		{ title: "Para todas las edades", description: "Ambiente familiar. Se requiere condición física básica para una caminata urbana de 2–2,5 horas." },
		{ title: "Movilidad", description: "Consulta las necesidades de accesibilidad antes de coordinar la ruta: el centro tiene tramos adoquinados." },
		{ title: "Cuida la ciudad", description: "No botar basura, dañar el patrimonio ni fumar durante el recorrido." },
	],
	conditions: [
		{ title: "Sin pago anticipado", description: "No hay tarifa fija ni anticipo. El aporte al guía es voluntario al finalizar, según tu satisfacción." },
		{ title: "Coordinemos tu salida", description: "Mínimo 2 personas. Horario a convenir en la mañana o tarde y salidas sujetas a demanda. Consultar no confirma tu plaza." },
		{ title: "Antes de caminar", description: "Preséntate 10 minutos antes. El itinerario es flexible por clima o preferencias del grupo." },
	],
	practical: ["El recorrido comienza en Parque Calderón y termina en el Museo del Cacao.", "Las entradas a interiores de museos e iglesias no están cubiertas.", "Coméntanos tus necesidades de movilidad para coordinar el recorrido."],
	photos: [
		{ src: "/public/assets/menu/tours/walking-tour-cuenca.webp", alt: "Calle y arquitectura del Centro Histórico de Cuenca" },
		{ src: "/src/assets/tours/demo/joyeria.jpg", alt: "Detalles de piezas de joyería" },
		{ src: "/public/assets/menu/tours/walking-tour-gastronomico.webp", alt: "Sabores y vida local de Cuenca" },
		{ src: "/public/assets/menu/tours/ruta-artesano.jpg", alt: "Colores de los utensilios en un mercado" },
		{ src: "/public/assets/menu/destinos/azuay.jpg", alt: "El paisaje del Azuay" },
	], illustrativePhotos: true,
	source: source("FWT-001", ["A82", "C82"], ["B14 indica lunes a martes y salidas diarias según demanda: no prometer salidas diarias confirmadas.", "A22:A26 suman 150 min: consistente con máximo 2,5h.", "D65 dice itinerario accesible sin evidencia de accesibilidad universal. Consultar necesidades, no prometer acceso universal.", "B73:E77 repiten logística vehicular/km28 del Cajas: no publicar."]),
} satisfies Tour;
