export interface Tour {
	id: string;
	slug: string;
	name: string;
	category: string;
	shortDescription: string;
	meetingPoints: string[];
	itinerary: string[];
	activities?: string[];
	operational: {
		duration: string;
		days: string;
		capacity: string;
		difficulty: string;
	};
	includes: string[];
	excludes: string[];
	whatToBring: string[];
	pricing: {
		general: string;
		special: string;
	};
	image?: string;
	heroImage?: string;
	badge?: string;
}

export const tours: Tour[] = [
	{
		id: "extremo-giron",
		slug: "extremo-giron-cascada-adrenalina",
		name: "Extremo Girón: Cascada y Adrenalina",
		category: "Cultura, Aventura y Naturaleza",
		shortDescription:
			"Una jornada completa que combina historia, paisajes andinos y la adrenalina de juegos extremos. Ideal para desconectar, reír y conocer la rica historia de Girón.",
		meetingPoints: [
			"08:20 am: Plaza San Blas.",
			"08:30 am: Parque Calderón (Catedral).",
		],
		itinerary: [
			"08:30 - 10:00: Salida desde Cuenca con parada breve en el Templete de Tarqui y Museo de los Tratados (contexto histórico).",
			"10:00 - 10:45: Llegada y paseo por el centro histórico de Girón.",
			"11:00 - 12:30: Tiempo de almuerzo (gastronomía local).",
			"12:30 - 15:30: ¡Hora de Aventura! Disfrute de las actividades extremas en el Chorro de Girón.",
			"15:30 - 16:00: Tiempo libre para fotos y preparación de retorno.",
			"16:00 - 17:00: Regreso a Cuenca.",
		],
		activities: [
			"Canopy (2 líneas de vuelo)",
			"Skybike (Ciclismo en las alturas)",
			"Ruta de Caudron (Caminata extrema de 1 hora)",
			"Puente Tibetano",
			"Resbaladilla Gigante",
			"Columpio Gigante",
		],
		operational: {
			duration: "7 a 8 horas",
			days: "Viernes, Sábados y Domingos",
			capacity: "Mín. 4 personas / Máx. 24 personas",
			difficulty: "Media (Apto para niños mayores de 5 años y adultos activos)",
		},
		includes: [
			"Transporte ida y vuelta",
			"Todas las actividades extremas mencionadas",
			"Almuerzo",
			"Guía acompañante",
			"Entradas al área",
		],
		excludes: [
			"Bebidas adicionales",
			"Propinas",
			"Souvenirs",
		],
		whatToBring: [
			"Zapatos deportivos con buen agarre",
			"Ropa cómoda y abrigada",
			"Impermeable",
			"Bloqueador solar",
		],
		pricing: {
			general: "$90,00 p/p",
			special: "$85,00 p/p",
		},
		image: "/assets/menu/tours/chorro-de-giron.jpg",
		heroImage: "/assets/menu/tours/chorro-de-giron.jpg",
		badge: "Más demandado",
	},
	{
		id: "giron-natural",
		slug: "giron-natural-cascada-aventura",
		name: "Girón Natural: Cascada y Aventura",
		category: "Naturaleza y Cultura",
		shortDescription:
			"Una escapada perfecta de medio día para conectar con la naturaleza. Disfruta de la majestuosa cascada de Girón y vive una emoción a elección.",
		meetingPoints: [
			"Opción Matutina: 08:20 am (San Blas) / 08:30 am (Calderón).",
			"Opción Vespertina: 02:00 pm (Calderón).",
		],
		itinerary: [
			"Salida: Viaje desde Cuenca hacia Girón.",
			"Llegada: Ingreso al área del Chorro de Girón.",
			"Actividad: Elección de Puente Tibetano o Columpio Gigante.",
			"Naturaleza: Caminata hacia la cascada y tiempo para fotografía.",
			"Retorno: Regreso a Cuenca.",
		],
		operational: {
			duration: "4 horas",
			days: "Todos los días",
			capacity: "Sin límite especificado",
			difficulty: "Media-Baja",
		},
		includes: [
			"Transporte ida y vuelta",
			"Entrada al Chorro de Girón",
			"Una actividad de aventura a elección",
		],
		excludes: [
			"Almuerzo",
			"Juegos extremos adicionales",
		],
		whatToBring: [
			"Zapatos deportivos con buen agarre",
			"Ropa cómoda",
			"Impermeable",
			"Bloqueador solar",
		],
		pricing: {
			general: "$35,00 p/p",
			special: "$30,00 p/p",
		},
		image: "/assets/menu/tours/chorro-de-giron.jpg",
		heroImage: "/assets/menu/tours/chorro-de-giron.jpg",
		badge: "Medio día",
	},
	{
		id: "cajas-express",
		slug: "cajas-express-mistica-naturaleza",
		name: "Cajas Express: Mística y Naturaleza",
		category: "Naturaleza, Cultura y Aventura Suave",
		shortDescription:
			"Una escapada perfecta para conectar con la naturaleza andina. Visita el mágico Parque Nacional Cajas, camina entre lagunas glaciares y descubre la flora del páramo.",
		meetingPoints: [
			"08:20 am: Plaza San Blas.",
			"08:30 am: Parque Calderón.",
		],
		itinerary: [
			"08:30 am: Salida hacia el Parque.",
			"09:15 am: Mirador de las Tres Cruces.",
			"09:45 am: Laguna Toreadora (Caminata suave).",
			"10:30 am: Centro de Interpretación.",
			"11:00 am: Paradas de regreso (Dos Chorreras, Parador, Molinos).",
			"12:30 pm: Llegada aproximada a Cuenca.",
		],
		operational: {
			duration: "4 horas",
			days: "Todos los días",
			capacity: "Sin límite especificado",
			difficulty: "Baja",
		},
		includes: [
			"Transporte ida y vuelta",
			"Entrada al Parque Nacional Cajas",
			"Guía naturalista",
			"Shot de canelazo caliente",
			"Caramelos para la altura",
		],
		excludes: [
			"Alimentación (Almuerzo o snacks extras)",
		],
		whatToBring: [
			"Zapatos para caminar",
			"Ropa de abrigo e impermeable",
			"Gorra y bloqueador solar",
			"Agua",
		],
		pricing: {
			general: "$25,00 p/p",
			special: "$20,00 p/p",
		},
		image: "/assets/menu/tours/parque-nacional-el-cajas.jpg",
		heroImage: "/assets/menu/tours/parque-nacional-el-cajas.jpg",
		badge: "Más accesible",
	},
	{
		id: "ruta-sol-plata",
		slug: "ruta-sol-plata-3-ciudades",
		name: "Ruta del Sol y la Plata: 3 Ciudades",
		category: "Cultural, Histórico y Artesanal",
		shortDescription:
			"Un viaje en el tiempo que conecta la herencia inca con las tradiciones vivas del Azuay. Visita el majestuoso Complejo de Ingapirca y el arte en Gualaceo y Chordeleg.",
		meetingPoints: [
			"08:30 am: Parque Calderón (Catedral).",
		],
		itinerary: [
			"08:30 am: Salida.",
			"09:15 am: Gualaceo (Museo Casa de las Makana).",
			"10:30 am: Chordeleg (Joyería y centro histórico).",
			"12:00 pm: Parada para Almuerzo (Típico, no incluido).",
			"01:30 pm: Ingapirca (Recorrido arqueológico guiado).",
			"03:30 pm: Retorno.",
			"05:00 pm: Llegada a Cuenca.",
		],
		operational: {
			duration: "8 a 9 horas",
			days: "Todos los días",
			capacity: "Sin límite especificado",
			difficulty: "Baja",
		},
		includes: [
			"Transporte ida y vuelta",
			"Guía especializado",
			"Entrada a Ingapirca",
			"Demostración en Casa de las Makana",
		],
		excludes: [
			"Almuerzo",
		],
		whatToBring: [
			"Zapatos cómodos",
			"Ropa ligera y abrigo",
			"Bloqueador solar",
			"Dinero en efectivo para compras",
		],
		pricing: {
			general: "$40,00 p/p",
			special: "$35,00 p/p",
		},
		image: "/assets/menu/tours/ingapirca.jpg",
		heroImage: "/assets/menu/tours/ingapirca.jpg",
		badge: "Cultura viva",
	},
	{
		id: "ruta-artesano",
		slug: "ruta-artesano-gualaceo-chordeleg",
		name: "Ruta del Artesano: Gualaceo y Chordeleg",
		category: "Cultural y Artesanal",
		shortDescription:
			"Sumérgete en el alma artesanal del Azuay. Conoce el tejido de makanas y explora la capital de la joyería ecuatoriana.",
		meetingPoints: [
			"08:30 am: Parque Calderón (Catedral).",
		],
		itinerary: [
			"08:30 am: Salida.",
			"09:15 am: Gualaceo (Makana).",
			"10:30 am: Chordeleg (Joyería).",
			"12:30 pm: Parada opcional para gastronomía.",
			"01:30 pm: Retorno.",
		],
		operational: {
			duration: "4 a 5 horas",
			days: "Todos los días",
			capacity: "Sin límite especificado",
			difficulty: "Baja",
		},
		includes: [
			"Transporte",
			"Guía",
			"Entrada y demostración en Casa de las Makana",
		],
		excludes: [
			"Almuerzo ni compras",
		],
		whatToBring: [
			"Zapatos cómodos",
			"Dinero en efectivo",
			"Cámara",
		],
		pricing: {
			general: "$30,00 p/p",
			special: "$25,00 p/p",
		},
		image: "/assets/menu/tours/ruta-artesano.jpg",
		heroImage: "/assets/menu/tours/ruta-artesano.jpg",
		badge: "Medio día",
	},
	{
		id: "giron-magico",
		slug: "giron-magico-cascada-laguna-busa",
		name: "Girón Mágico: Cascada y Laguna de Busa",
		category: "Naturaleza, Paisajístico y Cultural",
		shortDescription:
			"Un día completo para reconectar con la historia y la naturaleza. Combina la cascada de Girón con la serenidad de la Laguna de Busa.",
		meetingPoints: [
			"08:30 am: Parque Calderón (Catedral).",
		],
		itinerary: [
			"08:30 am: Salida.",
			"09:00 am: Girón (Historia y Museo).",
			"10:00 am: Chorro de Girón (Cascada).",
			"12:30 pm: Almuerzo (Libre).",
			"13:30 pm: Laguna de Busa (Paseo y relax).",
			"15:30 pm: Retorno.",
		],
		operational: {
			duration: "7 a 8 horas",
			days: "Todos los días",
			capacity: "Sin límite especificado",
			difficulty: "Baja-Media",
		},
		includes: [
			"Transporte",
			"Guía",
			"Entradas a atractivos",
		],
		excludes: [
			"Almuerzo",
		],
		whatToBring: [
			"Zapatos deportivos",
			"Ropa de abrigo",
			"Impermeable",
			"Bloqueador solar",
		],
		pricing: {
			general: "$45,00 p/p",
			special: "$40,00 p/p",
		},
		image: "/assets/menu/tours/guachapala-andacocha.jpg",
		heroImage: "/assets/menu/tours/guachapala-andacocha.jpg",
		badge: "Día completo",
	},
];

export const getTourBySlug = (slug: string): Tour | undefined =>
	tours.find((tour) => tour.slug === slug);

export const getFeaturedTours = (count = 6): Tour[] => tours.slice(0, count);

export const getToursByCategory = (category: string): Tour[] =>
	tours.filter((tour) =>
		tour.category.toLowerCase().includes(category.toLowerCase()),
	);
