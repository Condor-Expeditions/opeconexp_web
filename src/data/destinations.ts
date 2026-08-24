// Imports estáticos de assets para astro:assets + prerender
import type { ImageMetadata } from "astro";
import cajasImg from "@/assets/menu/tours/parque-nacional-el-cajas.jpg";
import ingapircaImg from "@/assets/menu/tours/ingapirca.jpg";
import gironImg from "@/assets/menu/tours/chorro-de-giron.jpg";
import delegImg from "@/assets/menu/tours/conoce-deleg.jpg";
import guachapalaImg from "@/assets/menu/tours/guachapala-andacocha.jpg";
import gualaceoImg from "@/assets/menu/tours/gualaceo-textiles.jpg";
import chordelegImg from "@/assets/menu/tours/chordeleg-joyeria.jpg";

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
		bestTime: "Todo el año",
		difficulty: "Baja a media",
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
		bestTime: "Todo el año",
		difficulty: "Baja",
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
		bestTime: "Todo el año",
		difficulty: "Media",
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
		bestTime: "Todo el año",
		difficulty: "Baja",
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
		bestTime: "Todo el año",
		difficulty: "Baja",
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
		bestTime: "Todo el año",
		difficulty: "Baja",
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
		bestTime: "Todo el año",
		difficulty: "Baja",
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
