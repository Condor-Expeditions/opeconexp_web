import type { Tour } from "./types";
import type { TravelQuestion } from "../travel-faq";

// Editorial search labels cover disabled tours too, without changing publication.
const searchTitles: Record<string, string> = {
	"cajas-al-descubierto": "Tour al Cajas: Cajas al Descubierto",
	"cajas-el-secreto-de-los-andes": "Tour vivencial al Cajas: El Secreto de los Andes",
	"raices-ancestrales-del-ecuador": "Tour a Ingapirca: Raíces Ancestrales del Ecuador",
	"pueblitos-magicos": "Tour a Ingapirca, Gualaceo y Chordeleg: Pueblitos Mágicos",
	"cascada-de-giron": "Tour a la Cascada de Girón: naturaleza e historia",
	"aventura-en-cuadron": "Tour a Girón y Busa: aventura en cuadrón",
	"free-walking-tour-cuenca": "Free Walking Tour de Cuenca: recorrido por el centro histórico",
	"compras-y-artesanias": "Tour de compras y artesanías en Chordeleg y Gualaceo",
	"el-origen-de-los-ancestros": "Tour a Sígsig y Chobshi: El Origen de los Ancestros",
	"guachapala-entre-paisajes-y-tradicion": "Tour a Andacocha y Guachapala: Entre Montañas y Milagros",
	"paute-dinosaurios-naturaleza-y-sabores": "Tour a Paute: dinosaurios, naturaleza y sabores",
};

const directDescriptions: Record<string, string> = {
	"cajas-al-descubierto": "Cajas al Descubierto es una excursión desde Cuenca al Mirador Tres Cruces, la Laguna Toreadora y el Santuario de la Virgen del Cajas, con una parada en Dos Chorreras.",
	"cajas-el-secreto-de-los-andes": "El Secreto de los Andes es un tour vivencial desde Cuenca que combina la Laguna de Patoquinoa, el Santuario de la Virgen del Cajas y experiencias culturales y gastronómicas en el entorno andino.",
	"raices-ancestrales-del-ecuador": "Raíces Ancestrales del Ecuador es una excursión arqueológica desde Cuenca que conecta Pumapungo, Cojitambo, Coyoctor e Ingapirca para conocer las huellas cañaris e incas de la región.",
	"pueblitos-magicos": "Pueblitos Mágicos es un tour desde Cuenca que reúne el patrimonio arqueológico de Ingapirca, la tradición textil del Ikat en Gualaceo y el trabajo de filigrana de Chordeleg.",
	"cascada-de-giron": "El tour a la Cascada de Girón sale desde Cuenca y combina el Templete de Tarqui, la Casa de los Tratados y el centro histórico de Girón con una caminata hacia El Chorro.",
	"aventura-en-cuadron": "Aventura en Girón es un tour desde Cuenca que combina historia local, la Cascada El Chorro, un circuito de 30 minutos en cuadrón y una visita a la Laguna de Busa.",
	"free-walking-tour-cuenca": "El Free Walking Tour de Cuenca es un recorrido a pie por el centro histórico que conecta plazas, patios, arquitectura y cacao con la interpretación de un guía local. No tiene tarifa fija: el aporte al guía es voluntario. Consulta su operación antes de planificar la visita.",
	"compras-y-artesanias": "Compras y Artesanías es un tour desde Cuenca a Chordeleg y Gualaceo que conecta la joyería en filigrana, el calzado artesanal y la tradición textil del Ikat, con demostraciones y tiempo para compras personales.",
	"el-origen-de-los-ancestros": "El Origen de los Ancestros es una excursión desde Cuenca hacia Sígsig y Chobshi que conecta la Cueva Negra, el Castillo del Cacique Duma, el Museo de Sitio y el Cañón del Pailón.",
	"guachapala-entre-paisajes-y-tradicion": "Entre Montañas y Milagros es un tour desde Cuenca que combina el Santuario de Andacocha con las actividades de Guachaventura en Guachapala: miradores, senderos, puente tibetano, columpio y piscinas temperadas.",
	"paute-dinosaurios-naturaleza-y-sabores": "Paute: Dinosaurios, Naturaleza y Sabores es una excursión familiar desde Cuenca que visita Jurassic Paute, Animal Paute, el Parque Lineal y La Cuchara de Palo, con un encuentro con la gastronomía del valle.",
};

const quote = (tour: Tour) => tour.price.kind === "paid"
	? `La tarifa de referencia es desde USD ${tour.price.adult} por adulto, sujeta a confirmación.`
	: tour.price.kind === "free"
		? "No tiene tarifa fija; el aporte al guía es voluntario al finalizar."
		: "El precio está pendiente de confirmación.";

export function tourSeo(tour: Tour) {
	const title = searchTitles[tour.slug] ?? `${tour.title} en Ecuador`;
	const introduction = directDescriptions[tour.slug] ?? `${tour.title} es una experiencia turística en Ecuador. ${tour.summary}`;
	const directAnswer = tour.price.kind === "free" ? introduction : `${introduction} ${quote(tour)}`;
	const questions: TravelQuestion[] = [
		{ question: "¿Cuánto cuesta esta experiencia?", answer: `${quote(tour)} ${tour.price.kind === "free" ? "Las entradas opcionales con costo y los consumos personales se pagan por separado." : "Revisa las inclusiones y exclusiones para conocer los gastos que se pagan por separado."}` },
		{ question: "¿Cuánto dura el recorrido?", answer: `La duración de referencia es ${tour.duration.replace(/^Aprox\.?\s*/i, "aproximadamente ")}. Las etapas son orientativas y pueden variar según el grupo y las condiciones de la ruta. Confirma el horario de regreso con el equipo.` },
		{ question: "¿Desde dónde sale y cómo se coordinan los horarios?", answer: `El punto de encuentro indicado es ${tour.meeting}. La operación prevista es: ${tour.operation}. Horarios de referencia: ${tour.departures.join(" / ") || "por confirmar"}. Confirma la ubicación, la hora exacta y la disponibilidad antes de salir.` },
		{ question: "¿Para quién es recomendable?", answer: `${tour.audience} La dificultad indicada es ${tour.difficulty.toLowerCase()}. Revisa las restricciones de edad, salud y esfuerzo de esta ficha y comunica tus necesidades antes de reservar.` },
		{ question: "¿Se puede realizar con menos participantes?", answer: tour.provisional ? "La experiencia está en preparación; el mínimo de participantes y las condiciones de operación están pendientes de validación." : `El mínimo operativo indicado es de ${tour.minimumPeople} personas. Si viajas con menos participantes, consulta las opciones disponibles. No se garantiza una salida hasta completar la confirmación con el equipo.` },
		{ question: "¿Qué idioma tiene el recorrido?", answer: `El idioma indicado es ${tour.languages}. ${tour.languageNote ?? "Consulta con el equipo cualquier necesidad de idioma antes de confirmar."}` },
		{ question: "¿Consultar por WhatsApp confirma mi reserva?", answer: tour.price.kind === "free" ? "No. El mensaje inicia una consulta para coordinar la operación y el horario. Esta experiencia no tiene tarifa fija ni requiere anticipo; confirma tu participación con el equipo antes de acudir." : "No. El mensaje inicia una consulta. Revisa disponibilidad, tarifa final y condiciones; la reserva se confirma al completar el proceso acordado y recibir el comprobante o voucher del servicio." },
	];
	const description = tour.price.kind === "paid"
		? `${tour.summary} Desde USD ${tour.price.adult} por adulto, con salida desde Cuenca. Consulta itinerario, inclusiones y disponibilidad.`
		: `${tour.summary} Recorrido por Cuenca sin tarifa fija, con aporte voluntario al guía. Consulta operación y horarios.`;
	if (tour.price.kind === "pending") return { title, description: `${tour.summary} Consulta el itinerario preliminar y las condiciones pendientes de confirmación.`, directAnswer, questions };
	return { title, description, directAnswer, questions };
}
