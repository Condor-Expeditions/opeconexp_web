// Imports estáticos de assets para astro:assets + prerender
import type { ImageMetadata } from "astro";
import chordelegImg from "@/assets/menu/tours/chordeleg-joyeria.jpg";
import gironImg from "@/assets/menu/tours/chorro-de-giron.jpg";
import delegImg from "@/assets/menu/tours/conoce-deleg.jpg";
import guachapalaImg from "@/assets/menu/tours/guachapala-andacocha.jpg";
import gualaceoImg from "@/assets/menu/tours/gualaceo-textiles.jpg";
import ingapircaImg from "@/assets/menu/tours/ingapirca.jpg";
import cajasImg from "@/assets/menu/tours/parque-nacional-el-cajas.jpg";
import type { Tour } from "../core/helpers";
import { getCategoryTitle, getTours, resolveLabel } from "../core/helpers";

// ─── Tipos de destino extendidos ───────────────────────────
// Campos para las secciones de la página de destino (/destinos/[slug]):
// itinerario[] { titulo, descripcion, imagen, hora, duracion, coordenadas? }
// rutaMapa { origen, destino, waypoints[], urlEmbed }
// galeria[] { src, alt, caption? } — src vacío = se resuelve con fallback
// resenas[] { autor, avatar, fecha, calificacion, comentario }
// faqs[] { pregunta, respuesta } · incluye[] / noIncluye[]: string[]
// puntoEncuentro { nombre, direccion, urlMapa, recomendacion }
// precios { adulto, terceraEdad, discapacitado, niños[{ rango, precio, descuento? }], bebes }
//   bebes = 0 (gratis 0-2 años) · niños 3-10: precio con descuento % o $2 fijo
// disponibilidad { dias[], horarios[] } · recomendaciones[]: slugs de destinos
// Todos los campos nuevos son opcionales con valores por defecto seguros.

export interface ItinerarioPunto {
	titulo: string;
	descripcion: string;
	imagen?: string;
	hora: string;
	duracion: string;
	coordenadas?: string;
}

export interface RutaMapa {
	origen: string;
	destino: string;
	waypoints: string[];
	urlEmbed: string;
}

export interface GaleriaItem {
	src: string;
	alt: string;
	caption?: string;
}

export interface Resena {
	autor: string;
	avatar: string;
	fecha: string;
	calificacion: number;
	comentario: string;
}

export interface FaqItem {
	pregunta: string;
	respuesta: string;
}

export interface PuntoEncuentro {
	nombre: string;
	direccion: string;
	urlMapa: string;
	recomendacion: string;
}

export interface PrecioRango {
	rango: string;
	precio: number;
	descuento?: number;
}

export interface Precios {
	adulto: number;
	terceraEdad: number;
	discapacitado: number;
	niños: PrecioRango[];
	bebes: number;
}

export interface Disponibilidad {
	dias: string[];
	horarios: string[];
}

export interface Destination {
	id: string;
	slug: string;
	name: string;
	region: string;
	category: string;
	shortDescription: string;
	longDescription: string;
	highlights: string[];
	coordinates?: string;
	image?: ImageMetadata;
	heroImage?: ImageMetadata;
	bestTime?: string;
	difficulty?: string;
	duracion?: string;
	// Nuevos campos para las secciones extendidas
	itinerario: ItinerarioPunto[];
	rutaMapa: RutaMapa;
	galeria: GaleriaItem[];
	resenas: Resena[];
	faqs: FaqItem[];
	incluye: string[];
	noIncluye: string[];
	puntoEncuentro: PuntoEncuentro;
	precios: Precios;
	disponibilidad: Disponibilidad;
	recomendaciones: string[];
}

const imgMap: Record<string, ImageMetadata> = {
	"parque-nacional-el-cajas": cajasImg,
	ingapirca: ingapircaImg,
	"el-chorro-de-giron": gironImg,
	deleg: delegImg,
	guachapala: guachapalaImg,
	gualaceo: gualaceoImg,
	chordeleg: chordelegImg,
};

export const destinations: Destination[] = [
	{
		id: "parque-nacional-el-cajas",
		slug: "parque-nacional-el-cajas",
		name: "Parque Nacional El Cajas",
		region: "Azuay",
		category: "Naturaleza",
		shortDescription:
			"Un laberinto de lagunas glaciares, bosques de polylepis y páramo andino a pocos minutos de Cuenca.",
		longDescription:
			"El Parque Nacional El Cajas es uno de los tesoros naturales más importantes del Ecuador. Con más de 270 lagunas, senderos que serpentean entre montañas y una biodiversidad única, es el escenario perfecto para reconectar con la naturaleza. Desde caminatas suaves hasta rutas más desafiantes, cada visita revela un nuevo paisaje de niebla, agua y roca.",
		highlights: [
			"Laguna Toreadora",
			"Mirador de las Tres Cruces",
			"Centro de Interpretación",
			"Flora y fauna del páramo",
			"Caminatas para todos los niveles",
		],
		coordinates: "2°47'S 79°14'O",
		image: imgMap["parque-nacional-el-cajas"],
		heroImage: imgMap["parque-nacional-el-cajas"],
		duracion: "Día completo (8 horas)",
		bestTime: "Todo el año",
		difficulty: "Baja a media",
		itinerario: [
			{
				titulo: "Llegada a Cuenca y traslado",
				descripcion:
					"Encuentro en el punto de salida y traslado al parque nacional.",
				imagen: "",
				hora: "08:00",
				duracion: "45 min",
				coordenadas: "2°47'S 79°14'O",
			},
			{
				titulo: "Laguna Toreadora",
				descripcion:
					"Paseo por la laguna principal y observación de flora nativa.",
				imagen: "",
				hora: "09:00",
				duracion: "1h 30min",
			},
			{
				titulo: "Mirador de las Tres Cruces",
				descripcion:
					"Vista panorámica del parque y caminata de interpretación.",
				imagen: "",
				hora: "11:00",
				duracion: "1h",
			},
			{
				titulo: "Almuerzo y tiempo libre",
				descripcion:
					"Descanso en el centro de interpretación y tiempo para explorar por libre.",
				imagen: "",
				hora: "12:30",
				duracion: "1h 30min",
			},
			{
				titulo: "Sendero de los molles",
				descripcion:
					"Caminata suave por bosque de polylepis con posibilidad de avistamiento.",
				imagen: "",
				hora: "14:00",
				duracion: "2h",
			},
		],
		rutaMapa: {
			origen: "Cuenca, Ecuador",
			destino: "Parque Nacional El Cajas",
			waypoints: ["Laguna Toreadora", "Mirador de las Tres Cruces"],
			urlEmbed:
				"https://maps.google.com/maps?q=Parque%20Nacional%20El%20Cajas%2C%20Azuay%2C%20Ecuador&z=12&output=embed",
		},
		galeria: [
			{ src: "", alt: "Laguna Toreadora" },
			{ src: "", alt: "Mirador de las Tres Cruces" },
			{ src: "", alt: "Flora del páramo" },
			{ src: "", alt: "Sendero de los molles" },
		],
		resenas: [
			{
				autor: "María González",
				avatar: "",
				fecha: "2025-08-12",
				calificacion: 5,
				comentario:
					"Un parque precioso, muy bien conservado. Las lagunas son de un azul impresionante.",
			},
			{
				autor: "Carlos Ruiz",
				avatar: "",
				fecha: "2025-07-03",
				calificacion: 4,
				comentario:
					"Excelente experiencia, aunque hace mucho frío en la mañana. Lleva ropa abrigada.",
			},
			{
				autor: "Ana Torres",
				avatar: "",
				fecha: "2025-06-21",
				calificacion: 5,
				comentario:
					"Guía atento, paisajes increíbles. Recomendado para desconectar.",
			},
		],
		faqs: [
			{
				pregunta: "¿A qué hora debo llegar?",
				respuesta:
					"Te recomendamos llegar 15 minutos antes de la hora de salida para el registro y la breve inducción.",
			},
			{
				pregunta: "¿Qué debo llevar?",
				respuesta:
					"Ropa abrigada, calzado impermeable, protector solar, agua y snacks.",
			},
			{
				pregunta: "¿Hay baños disponibles?",
				respuesta:
					"Sí, hay baños en el centro de interpretación y en el área de Laguna Toreadora.",
			},
		],
		incluye: [
			"Guía local certificado",
			"Traslado ida y vuelta",
			"Entrada al parque nacional",
			"Seguro de accidentes personales",
		],
		noIncluye: [
			"Almuerzo",
			"Bebidas",
			"Equipo de fotografía profesional",
			"Propinas",
		],
		puntoEncuentro: {
			nombre: "Plaza de Armas de Cuenca",
			direccion: "Calle Sucre y Mariscal Sucre, Cuenca",
			urlMapa: "https://www.google.com/maps/place/Plaza+de+Armas+Cuenca",
			recomendacion: "Llega 15 minutos antes de la hora de salida.",
		},
		precios: {
			adulto: 25,
			terceraEdad: 15,
			discapacitado: 15,
			niños: [
				{ rango: "0-2 años", precio: 0 },
				{ rango: "3-10 años", precio: 22.5, descuento: 10 },
			],
			bebes: 0,
		},
		disponibilidad: {
			dias: [
				"lunes",
				"martes",
				"miércoles",
				"jueves",
				"viernes",
				"sábado",
				"domingo",
			],
			horarios: ["08:00", "09:00", "14:00"],
		},
		recomendaciones: ["ingapirca", "el-chorro-de-giron", "deleg"],
	},
	{
		id: "ingapirca",
		slug: "ingapirca",
		name: "Ingapirca",
		region: "Cañar",
		category: "Cultura e Historia",
		shortDescription:
			"El complejo arqueológico más importante del Ecuador, donde convergen la herencia inca y cañari.",
		longDescription:
			"Ingapirca es mucho más que ruinas de piedra. Es el punto donde dos mundos —inca y cañari— se encontraron y dejaron una huella imborrable en la historia del Ecuador. El Templo del Sol, los terrones ceremoniales y el museo local cuentan una historia de astronomía, poder y resistencia que sigue viva en las comunidades andinas.",
		highlights: [
			"Templo del Sol",
			"Museo de Ingapirca",
			"Terrazas ceremoniales",
			"Mercado artesanal local",
			"Paisajes de la cordillera de Cañar",
		],
		coordinates: "2°32'S 78°52'O",
		image: imgMap["ingapirca"],
		heroImage: imgMap["ingapirca"],
		duracion: "Día completo (7 horas)",
		bestTime: "Todo el año",
		difficulty: "Baja",
		itinerario: [
			{
				titulo: "Llegada a Ingapirca",
				descripcion:
					"Traslado desde Cuenca y llegada al complejo arqueológico.",
				imagen: "",
				hora: "08:30",
				duracion: "1h 30min",
			},
			{
				titulo: "Templo del Sol",
				descripcion:
					"Visita guiada al templo principal y explicación astronómica.",
				imagen: "",
				hora: "10:00",
				duracion: "1h",
			},
			{
				titulo: "Museo y terrazas",
				descripcion:
					"Recorrido por el museo local y las terrazas ceremoniales.",
				imagen: "",
				hora: "11:30",
				duracion: "1h",
			},
			{
				titulo: "Almuerzo en el mercado",
				descripcion: "Experiencia gastronómica con productores locales.",
				imagen: "",
				hora: "12:30",
				duracion: "1h 30min",
			},
		],
		rutaMapa: {
			origen: "Cuenca, Ecuador",
			destino: "Ingapirca",
			waypoints: ["Templo del Sol", "Museo de Ingapirca"],
			urlEmbed:
				"https://maps.google.com/maps?q=Ingapirca%2C%20Ca%C3%B1ar%2C%20Ecuador&z=13&output=embed",
		},
		galeria: [
			{ src: "", alt: "Templo del Sol" },
			{ src: "", alt: "Terrazas ceremoniales" },
			{ src: "", alt: "Paisaje de Cañar" },
		],
		resenas: [
			{
				autor: "Jorge Maldonado",
				avatar: "",
				fecha: "2025-09-01",
				calificacion: 5,
				comentario:
					"Un sitio histórico impresionante. La guía supo transmitir toda la historia.",
			},
			{
				autor: "Paula Salazar",
				avatar: "",
				fecha: "2025-07-18",
				calificacion: 4,
				comentario:
					"Muy interesante, aunque el calor fue intenso. Recomendable de manera temprano.",
			},
		],
		faqs: [
			{
				pregunta: "¿Cuánto dura la visita?",
				respuesta: "La visita guiada dura aproximadamente 3 horas.",
			},
			{
				pregunta: "¿Hay estacionamiento?",
				respuesta: "Sí, hay estacionamiento disponible cerca del museo.",
			},
		],
		incluye: [
			"Guía local certificado",
			"Entrada al complejo arqueológico",
			"Seguro de accidentes personales",
		],
		noIncluye: ["Almuerzo", "Bebidas", "Propinas"],
		puntoEncuentro: {
			nombre: "Plaza de Armas de Cuenca",
			direccion: "Calle Sucre y Mariscal Sucre, Cuenca",
			urlMapa: "https://www.google.com/maps/place/Plaza+de+Armas+Cuenca",
			recomendacion: "Llega 15 minutos antes de la hora de salida.",
		},
		precios: {
			adulto: 20,
			terceraEdad: 12,
			discapacitado: 12,
			niños: [
				{ rango: "0-2 años", precio: 0 },
				{ rango: "3-10 años", precio: 18, descuento: 10 },
			],
			bebes: 0,
		},
		disponibilidad: {
			dias: [
				"lunes",
				"martes",
				"miércoles",
				"jueves",
				"viernes",
				"sábado",
				"domingo",
			],
			horarios: ["08:30", "10:00"],
		},
		recomendaciones: [
			"parque-nacional-el-cajas",
			"el-chorro-de-giron",
			"deleg",
		],
	},
	{
		id: "el-chorro-de-giron",
		slug: "el-chorro-de-giron",
		name: "El Chorro de Girón",
		region: "Azuay",
		category: "Aventura",
		shortDescription:
			"Una cascada de 85 metros rodeada de adrenalina, naturaleza y tradición en el cantón Girón.",
		longDescription:
			"El Chorro de Girón es uno de los destinos de aventura más cercanos a Cuenca. Su cascada imponente es el telón de fondo para actividades como canopy, skybike, puente tibetano y caminatas extremas. Ideal para quienes buscan un día de emoción sin alejarse demasiado de la ciudad.",
		highlights: [
			"Cascada de 85 metros",
			"Canopy y skybike",
			"Puente tibetano",
			"Caminata Ruta del Caudrón",
			"Centro histórico de Girón",
		],
		coordinates: "3°14'S 78°59'O",
		image: imgMap["el-chorro-de-giron"],
		heroImage: imgMap["el-chorro-de-giron"],
		duracion: "Día completo (7 horas)",
		bestTime: "Todo el año",
		difficulty: "Media",
		itinerario: [
			{
				titulo: "Llegada a Girón",
				descripcion: "Traslado desde Cuenca al cantón Girón.",
				imagen: "",
				hora: "08:00",
				duracion: "45 min",
			},
			{
				titulo: "Cascada del Chorro",
				descripcion:
					"Caminata hasta la cascada de 85 metros y tiempo para fotos.",
				imagen: "",
				hora: "09:00",
				duracion: "1h",
			},
			{
				titulo: "Canopy y puente tibetano",
				descripcion: "Actividades de aventura en el área del Chorro.",
				imagen: "",
				hora: "10:30",
				duracion: "2h",
			},
			{
				titulo: "Almuerzo en Girón",
				descripcion: "Almuerzo en el centro histórico de Girón.",
				imagen: "",
				hora: "12:30",
				duracion: "1h 30min",
			},
		],
		rutaMapa: {
			origen: "Cuenca, Ecuador",
			destino: "El Chorro de Girón",
			waypoints: ["Cascada del Chorro", "Puente tibetano"],
			urlEmbed:
				"https://maps.google.com/maps?q=El%20Chorro%20de%20Gir%C3%B3n%2C%20Azuay%2C%20Ecuador&z=13&output=embed",
		},
		galeria: [
			{ src: "", alt: "Cascada de 85 metros" },
			{ src: "", alt: "Puente tibetano" },
			{ src: "", alt: "Centro histórico de Girón" },
		],
		resenas: [
			{
				autor: "Tomás Ibarra",
				avatar: "",
				fecha: "2025-08-20",
				calificacion: 5,
				comentario:
					"Aventura increíble, la cascada es impressionante. Muy bien organizado.",
			},
			{
				autor: "Lucía Castro",
				avatar: "",
				fecha: "2025-07-05",
				calificacion: 4,
				comentario:
					"Excelente día, aunque hace mucho calor. Lleva gorra y agua.",
			},
		],
		faqs: [
			{
				pregunta: "¿Necesito experiencia para el canopy?",
				respuesta:
					"No, la actividad está adaptada para principiantes con instrucción previa.",
			},
			{
				pregunta: "¿Hay vestuario para cambiarse?",
				respuesta: "Sí, hay áreas con camerinos cerca de la cascada.",
			},
		],
		incluye: [
			"Guía local certificado",
			"Equipo de seguridad",
			"Entrada al Chorro de Girón",
			"Seguro de accidentes personales",
		],
		noIncluye: ["Almuerzo", "Fotografía profesional", "Propinas"],
		puntoEncuentro: {
			nombre: "Plaza de Armas de Cuenca",
			direccion: "Calle Sucre y Mariscal Sucre, Cuenca",
			urlMapa: "https://www.google.com/maps/place/Plaza+de+Armas+Cuenca",
			recomendacion: "Llega 15 minutos antes de la hora de salida.",
		},
		precios: {
			adulto: 30,
			terceraEdad: 18,
			discapacitado: 18,
			niños: [
				{ rango: "0-2 años", precio: 0 },
				{ rango: "3-10 años", precio: 27, descuento: 10 },
			],
			bebes: 0,
		},
		disponibilidad: {
			dias: [
				"lunes",
				"martes",
				"miércoles",
				"jueves",
				"viernes",
				"sábado",
				"domingo",
			],
			horarios: ["08:00", "09:00"],
		},
		recomendaciones: ["parque-nacional-el-cajas", "ingapirca", "deleg"],
	},
	{
		id: "deleg",
		slug: "deleg",
		name: "Déleg",
		region: "Azuay",
		category: "Cultura y Naturaleza",
		shortDescription:
			"Un rincón andino donde el tiempo parece detenerse entre paisajes, tradición y calidez humana.",
		longDescription:
			"Déleg invita a desconectar del ritmo urbano y sumergirse en la vida rural del Austro ecuatoriano. Sus paisajes de valle, tradiciones agrícolas y comunidades acogedoras ofrecen una experiencia auténtica de turismo comunitario y conexión con la tierra.",
		highlights: [
			"Paisajes de valle andino",
			"Tradiciones agrícolas",
			"Turismo comunitario",
			"Gastronomía local",
			"Caminatas tranquilas",
		],
		coordinates: "3°08'S 78°56'O",
		image: imgMap["deleg"],
		heroImage: imgMap["deleg"],
		duracion: "Medio día (5 horas)",
		bestTime: "Todo el año",
		difficulty: "Baja",
		itinerario: [
			{
				titulo: "Llegada a Déleg",
				description: "Traslado desde Cuenca al valle de Déleg.",
				imagen: "",
				hora: "08:00",
				duracion: "1h",
			},
			{
				titulo: "Paseo por el valle",
				descripcion:
					"Caminata tranquila por paisajes de valle y contacto con comunidades locales.",
				imagen: "",
				hora: "09:30",
				duracion: "2h",
			},
			{
				titulo: "Almuerzo comunitario",
				descripcion: "Almuerzo con gastronomía local y turismo comunitario.",
				imagen: "",
				hora: "12:00",
				duracion: "1h 30min",
			},
		],
		rutaMapa: {
			origen: "Cuenca, Ecuador",
			destino: "Déleg",
			waypoints: ["Valle de Déleg"],
			urlEmbed:
				"https://maps.google.com/maps?q=D%C3%A9leg%2C%20Azuay%2C%20Ecuador&z=13&output=embed",
		},
		galeria: [
			{ src: "", alt: "Paisajes de valle andino" },
			{ src: "", alt: "Comunidad local" },
		],
		resenas: [
			{
				autor: "Fernanda Vera",
				avatar: "",
				fecha: "2025-07-22",
				calificacion: 5,
				comentario:
					"Un lugar mágico, la gente muy acogedora. Experiencia auténtica.",
			},
		],
		faqs: [
			{
				pregunta: "¿Cómo llego a Déleg?",
				respuesta:
					"Hay traslados desde Cuenca o puedes tomar el transporte público desde el terminal.",
			},
		],
		incluye: ["Guía local", "Caminata guiada", "Almuerzo comunitario"],
		noIncluye: ["Bebidas", "Equipo de fotografía"],
		puntoEncuentro: {
			nombre: "Plaza de Armas de Cuenca",
			direccion: "Calle Sucre y Mariscal Sucre, Cuenca",
			urlMapa: "https://www.google.com/maps/place/Plaza+de+Armas+Cuenca",
			recomendacion: "Llega 15 minutos antes de la hora de salida.",
		},
		precios: {
			adulto: 15,
			terceraEdad: 10,
			discapacitado: 10,
			niños: [
				{ rango: "0-2 años", precio: 0 },
				{ rango: "3-10 años", precio: 13.5, descuento: 10 },
			],
			bebes: 0,
		},
		disponibilidad: {
			dias: [
				"lunes",
				"martes",
				"miércoles",
				"jueves",
				"viernes",
				"sábado",
				"domingo",
			],
			horarios: ["08:00"],
		},
		recomendaciones: ["parque-nacional-el-cajas", "ingapirca", "guachapala"],
	},
	{
		id: "guachapala",
		slug: "guachapala",
		name: "Guachapala",
		region: "Azuay",
		category: "Naturaleza y Paisaje",
		shortDescription:
			"Lagunas, miradores y la serenidad de la cordillera en uno de los rincones más tranquilos del Azuay.",
		longDescription:
			"Guachapala es sinónimo de paz y belleza natural. Sus lagunas, miradores y caminos rurales son el escenario ideal para quienes buscan un día de contemplación, fotografía y contacto con la naturaleza. Un destino que sorprende por su calma y sus vistas panorámicas.",
		highlights: [
			"Laguna de Busa",
			"Miradores panorámicos",
			"Caminatas rurales",
			"Fotografía de paisaje",
			"Tranquilidad y naturaleza",
		],
		coordinates: "3°05'S 78°56'O",
		image: imgMap["guachapala"],
		heroImage: imgMap["guachapala"],
		duracion: "Día completo (7 horas)",
		bestTime: "Todo el año",
		difficulty: "Baja",
		itinerario: [
			{
				titulo: "Llegada a Guachapala",
				description: "Traslado desde Cuenca a Guachapala.",
				imagen: "",
				hora: "08:00",
				duracion: "1h",
			},
			{
				titulo: "Laguna de Busa",
				description: "Paseo por la laguna y tiempo para fotografía de paisaje.",
				imagen: "",
				hora: "09:30",
				duracion: "1h 30min",
			},
			{
				titulo: "Miradores panorámicos",
				description: "Visita a los miradores y caminata rural.",
				imagen: "",
				hora: "11:00",
				duracion: "1h 30min",
			},
			{
				titulo: "Almuerzo y tiempo libre",
				description: "Almuerzo y tiempo para explorar el pueblo.",
				imagen: "",
				hora: "12:30",
				duracion: "1h 30min",
			},
		],
		rutaMapa: {
			origen: "Cuenca, Ecuador",
			destino: "Guachapala",
			waypoints: ["Laguna de Busa", "Miradores panorámicos"],
			urlEmbed:
				"https://maps.google.com/maps?q=Guachapala%2C%20Azuay%2C%20Ecuador&z=13&output=embed",
		},
		galeria: [
			{ src: "", alt: "Laguna de Busa" },
			{ src: "", alt: "Miradores panorámicos" },
			{ src: "", alt: "Caminata rural" },
		],
		resenas: [
			{
				autor: "Daniela Cevallos",
				avatar: "",
				fecha: "2025-06-15",
				calificacion: 5,
				comentario: "Lugarcito tranquilo y hermoso, ideal para desconectar.",
			},
			{
				autor: "Mateo Flores",
				avatar: "",
				fecha: "2025-05-20",
				calificacion: 4,
				comentario: "Muy bonito, aunque hace mucho viento en los miradores.",
			},
		],
		faqs: [
			{
				pregunta: "¿Hay baños en la laguna?",
				respuesta: "Sí, hay baños públicos cerca del acceso a la laguna.",
			},
			{
				pregunta: "¿Puedo llevar mascotas?",
				respuesta: "Se recomienda no llevar mascotas para proteger la fauna.",
			},
		],
		incluye: ["Guía local", "Traslado ida y vuelta", "Entrada a la laguna"],
		noIncluye: ["Almuerzo", "Bebidas", "Fotografía profesional"],
		puntoEncuentro: {
			nombre: "Plaza de Armas de Cuenca",
			direccion: "Calle Sucre y Mariscal Sucre, Cuenca",
			urlMapa: "https://www.google.com/maps/place/Plaza+de+Armas+Cuenca",
			recomendacion: "Llega 15 minutos antes de la hora de salida.",
		},
		precios: {
			adulto: 12,
			terceraEdad: 8,
			discapacitado: 8,
			niños: [
				{ rango: "0-2 años", precio: 0 },
				{ rango: "3-10 años", precio: 10.8, descuento: 10 },
			],
			bebes: 0,
		},
		disponibilidad: {
			dias: [
				"lunes",
				"martes",
				"miércoles",
				"jueves",
				"viernes",
				"sábado",
				"domingo",
			],
			horarios: ["08:00", "14:00"],
		},
		recomendaciones: ["deleg", "parque-nacional-el-cajas", "gualaceo"],
	},
	{
		id: "gualaceo",
		slug: "gualaceo",
		name: "Gualaceo",
		region: "Azuay",
		category: "Cultura y Artesanía",
		shortDescription:
			"El valle de las flores y las makanas, donde el tejido tradicional sigue vivo.",
		longDescription:
			"Gualaceo, conocido como el 'Jardín del Azuay', conserva vivas las tradiciones textiles del Ecuador. En la Casa de las Makana se puede apreciar el proceso de tejido de estas bandas ceremoniales, patrimonio cultural que acompaña a comunidades indígenas en celebraciones y rituales.",
		highlights: [
			"Casa de las Makana",
			"Centro histórico",
			"Mercado de artesanías",
			"Gastronomía del valle",
			"Río Santa Bárbara",
		],
		coordinates: "2°54'S 78°47'O",
		image: imgMap["gualaceo"],
		heroImage: imgMap["gualaceo"],
		duracion: "Medio día (6 horas)",
		bestTime: "Todo el año",
		difficulty: "Baja",
		itinerario: [
			{
				titulo: "Llegada a Gualaceo",
				description: "Traslado desde Cuenca al valle de Gualaceo.",
				imagen: "",
				hora: "08:00",
				duracion: "1h",
			},
			{
				titulo: "Casa de las Makana",
				description: "Visita guiada al proceso de tejido de las makanas.",
				imagen: "",
				hora: "09:30",
				duracion: "1h 30min",
			},
			{
				titulo: "Centro histórico y mercado",
				description:
					"Recorrido por el centro histórico y mercado de artesanías.",
				imagen: "",
				hora: "11:00",
				duracion: "1h 30min",
			},
			{
				titulo: "Almuerzo y río Santa Bárbara",
				description: "Almuerzo y paseo por las riberas del río Santa Bárbara.",
				imagen: "",
				hora: "12:30",
				duracion: "1h 30min",
			},
		],
		rutaMapa: {
			origen: "Cuenca, Ecuador",
			destino: "Gualaceo",
			waypoints: ["Casa de las Makana", "Centro histórico"],
			urlEmbed:
				"https://maps.google.com/maps?q=Gualaceo%2C%20Azuay%2C%20Ecuador&z=13&output=embed",
		},
		galeria: [
			{ src: "", alt: "Casa de las Makana" },
			{ src: "", alt: "Centro histórico" },
			{ src: "", alt: "Río Santa Bárbara" },
		],
		resenas: [
			{
				autor: "Pablo Ochoa",
				avatar: "",
				fecha: "2025-07-10",
				calificacion: 5,
				comentario:
					"Muy interesante la parte textil, aprendí mucho sobre las makanas.",
			},
			{
				autor: "Carmen Landázuri",
				avatar: "",
				fecha: "2025-06-02",
				calificacion: 4,
				comentario: "Bonito pueblo, el mercado tiene buenos productos.",
			},
		],
		faqs: [
			{
				pregunta: "¿Cómo llego a la Casa de las Makana?",
				respuesta:
					"Está en el centro histórico de Gualaceo, fácil de encontrar.",
			},
			{
				pregunta: "¿Hay estacionamiento?",
				respuesta: "Sí, hay estacionamiento cerca del centro histórico.",
			},
		],
		incluye: [
			"Guía local",
			"Entrada a la Casa de las Makana",
			"Recorrido por el centro histórico",
		],
		noIncluye: ["Almuerzo", "Compras artesanales", "Propinas"],
		puntoEncuentro: {
			nombre: "Plaza de Armas de Cuenca",
			direccion: "Calle Sucre y Mariscal Sucre, Cuenca",
			urlMapa: "https://www.google.com/maps/place/Plaza+de+Armas+Cuenca",
			recomendacion: "Llega 15 minutos antes de la hora de salida.",
		},
		precios: {
			adulto: 15,
			terceraEdad: 10,
			discapacitado: 10,
			niños: [
				{ rango: "0-2 años", precio: 0 },
				{ rango: "3-10 años", precio: 13.5, descuento: 10 },
			],
			bebes: 0,
		},
		disponibilidad: {
			dias: [
				"lunes",
				"martes",
				"miércoles",
				"jueves",
				"viernes",
				"sábado",
				"domingo",
			],
			horarios: ["08:00", "09:00"],
		},
		recomendaciones: ["chordeleg", "deleg", "guachapala"],
	},
	{
		id: "chordeleg",
		slug: "chordeleg",
		name: "Chordeleg",
		region: "Azuay",
		category: "Cultura y Artesanía",
		shortDescription:
			"La capital de la joyería ecuatoriana, donde cada pieza cuenta una historia de orfebrería andina.",
		longDescription:
			"Chordeleg es un pueblo mágico del Azuay famoso por sus talleres de orfebrería. Recorrer sus calles significa descubrir el trabajo de artesanos que transforman el oro, la plata y las piedras semipreciosas en joyas únicas. Un destino imprescindible para los amantes del arte y la cultura.",
		highlights: [
			"Talleres de joyería",
			"Plaza central",
			"Artesanías locales",
			"Gastronomía típica",
			"Historia minera de la región",
		],
		coordinates: "2°32'S 78°47'O",
		image: imgMap["chordeleg"],
		heroImage: imgMap["chordeleg"],
		duracion: "Medio día (6 horas)",
		bestTime: "Todo el año",
		difficulty: "Baja",
		itinerario: [
			{
				titulo: "Llegada a Chordeleg",
				description: "Traslado desde Cuenca a Chordeleg.",
				imagen: "",
				hora: "08:00",
				duracion: "45 min",
			},
			{
				titulo: "Talleres de joyería",
				description:
					"Recorrido por los talleres de orfebrería y observación del trabajo artesanal.",
				imagen: "",
				hora: "09:00",
				duracion: "2h",
			},
			{
				titulo: "Plaza central",
				description:
					"Paseo por la plaza central y tiempo para compras artesanales.",
				imagen: "",
				hora: "11:30",
				duracion: "1h",
			},
			{
				titulo: "Almuerzo típico",
				description: "Almuerzo con gastronomía típica de la región.",
				imagen: "",
				hora: "12:30",
				duracion: "1h 30min",
			},
		],
		rutaMapa: {
			origen: "Cuenca, Ecuador",
			destino: "Chordeleg",
			waypoints: ["Talleres de joyería", "Plaza central"],
			urlEmbed:
				"https://maps.google.com/maps?q=Chordeleg%2C%20Azuay%2C%20Ecuador&z=13&output=embed",
		},
		galeria: [
			{ src: "", alt: "Talleres de joyería" },
			{ src: "", alt: "Plaza central" },
			{ src: "", alt: "Artesanías locales" },
		],
		resenas: [
			{
				autor: "Andrés Jaramillo",
				avatar: "",
				fecha: "2025-08-05",
				calificacion: 5,
				comentario:
					"Increíble ver el trabajo de los artesanos, cada pieza es única.",
			},
			{
				autor: "Valeria Muñoz",
				avatar: "",
				fecha: "2025-07-14",
				calificacion: 4,
				comentario: "Muy bonito, aunque los talleres cierran temprano.",
			},
		],
		faqs: [
			{
				pregunta: "¿Puedo comprar joyas en los talleres?",
				respuesta: "Sí, la mayoría de talleres vende sus piezas directamente.",
			},
			{
				pregunta: "¿A qué hora cierran los talleres?",
				respuesta:
					"Generalmente cierran a las 17:00, te recomendamos llegar temprano.",
			},
		],
		incluye: [
			"Guía local",
			"Recorrido por talleres",
			"Entrada a la plaza central",
		],
		noIncluye: ["Almuerzo", "Compras de joyas", "Propinas"],
		puntoEncuentro: {
			nombre: "Plaza de Armas de Cuenca",
			direccion: "Calle Sucre y Mariscal Sucre, Cuenca",
			urlMapa: "https://www.google.com/maps/place/Plaza+de+Armas+Cuenca",
			recomendacion: "Llega 15 minutos antes de la hora de salida.",
		},
		precios: {
			adulto: 15,
			terceraEdad: 10,
			discapacitado: 10,
			niños: [
				{ rango: "0-2 años", precio: 0 },
				{ rango: "3-10 años", precio: 13.5, descuento: 10 },
			],
			bebes: 0,
		},
		disponibilidad: {
			dias: [
				"lunes",
				"martes",
				"miércoles",
				"jueves",
				"viernes",
				"sábado",
				"domingo",
			],
			horarios: ["08:00", "09:00"],
		},
		recomendaciones: ["gualaceo", "deleg", "ingapirca"],
	},
];

export const getDestinationBySlug = (slug: string): Destination | undefined =>
	destinations.find((destination) => destination.slug === slug);

export const getDestinationsByRegion = (region: string): Destination[] =>
	destinations.filter(
		(destination) => destination.region.toLowerCase() === region.toLowerCase(),
	);

export const getFeaturedDestinations = (count = 5): Destination[] =>
	destinations.slice(0, count);

// Tours relacionados por categoría del destino o coincidencia de nombre.
// Misma lógica que usaba DestinationDetail; centralizada para reusar en página.
export function getRelatedToursForDestination(
	destination: Destination,
	lang: "es" | "en" = "es",
	count = 3,
): Tour[] {
	const destCategory = destination.category.toLowerCase().split(",")[0].trim();
	const destName = destination.name.toLowerCase();
	return getTours()
		.filter((t) => {
			const categoryTitles = t.categories.map((c) =>
				getCategoryTitle(c, lang).toLowerCase(),
			);
			const title = resolveLabel(t.title, lang).toLowerCase();
			return (
				categoryTitles.some((cat) => cat.includes(destCategory)) ||
				title.includes(destName)
			);
		})
		.slice(0, count);
}
