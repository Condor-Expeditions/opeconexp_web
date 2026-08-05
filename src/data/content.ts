// Datos estáticos para las secciones de Cóndor Expeditions

export const featuredDestinations = [
	{
		name: "Andes Ecuatorianos",
		slug: "andes",
		description:
			"Trekking en el volcán Cotopaxi, ascenso al Chimborazo, y la majestuosa Avenida de los Volcanes.",
		image: "/images/destinos/andes.jpg",
		alt: "Vista panorámica del Cotopaxi al amanecer",
		highlight: "5,897 m",
		tag: "Montaña",
	},
	{
		name: "Amazonía",
		slug: "amazonia",
		description:
			"Expediciones en la selva del Yasuní y Cuyabeno, encuentro con la biodiversidad más rica del planeta.",
		image: "/images/destinos/amazonia.jpg",
		alt: "Río amazónico rodeado de selva densa",
		tag: "Selva",
	},
	{
		name: "Costa del Pacífico",
		slug: "costa",
		description:
			"Avistamiento de ballenas en Puerto López, surf en Montañita, y bosque nublado de Mindo.",
		image: "/images/destinos/costa.jpg",
		alt: "Playa al atardecer con acantilados verdes",
		tag: "Costa",
	},
	{
		name: "Islas Galápagos",
		slug: "galapagos",
		description:
			"Navegación entre islas, snorkel con leones marinos y tortugas gigantes, senderismo volcánico.",
		image: "/images/destinos/galapagos.jpg",
		alt: "Tortuga gigante de Galápagos en su hábitat",
		tag: "Islas",
	},
];

export const experiences = [
	{
		title: "Ascenso al Cotopaxi",
		category: "trekking",
		duration: "2 días",
		difficulty: "Intermedio",
		description:
			"Ascenso guiado al cráter del volcán Cotopaxi (5,897 m). Incluye aclimatación y noche en refugio José Rivas.",
		image: "/images/experiencias/cotopaxi.jpg",
	},
	{
		title: "Rafting Río Jatunyacu",
		category: "rafting",
		duration: "1 día",
		difficulty: "Clase III+",
		description:
			"Rápidos clase III en la selva alta del Napo. Equipo profesional y guías IRF certificados.",
		image: "/images/experiencias/rafting.jpg",
	},
	{
		title: "Escalada en Roc a Cachorral",
		category: "montanismo",
		duration: "1 día",
		difficulty: "Todos los niveles",
		description:
			"Escalada deportiva en formación rocosa con vistas panorámicas del valle. Rutas de 5.7 a 5.12b.",
		image: "/images/experiencias/climbing.jpg",
	},
	{
		title: "Expedición Cuyabeno",
		category: "selva",
		duration: "4 días",
		difficulty: "Suave",
		description:
			"Exploración en canoa por la reserva Cuyabeno, delfines rosados, y camping en la selva amazónica.",
		image: "/images/experiencias/cuyabeno.jpg",
	},
];

export const differentiators = [
	{
		icon: "🗺️",
		title: "Guías Locales Expertos",
		description:
			"Más de 10 años de experiencia en cada destino. Conocimiento profundo del territorio y su cultura.",
	},
	{
		icon: "🌿",
		title: "Turismo Sostenible",
		description:
			"Impacto ambiental mínimo. Apoyamos comunidades locales y proyectos de conservación activa.",
	},
	{
		icon: "🎒",
		title: "Expediciones a Tu Medida",
		description:
			"Itinerarios personalizados según tu nivel, intereses y ritmo. Grupos reducidos de máximo 12 personas.",
	},
	{
		icon: "🛡️",
		title: "Seguridad Garantizada",
		description:
			"Equipo de respuesta, seguros de accidentes personales y monitoreo satelital en cada expedición.",
	},
];

export const testimonials = [
	{
		text: "La experiencia en el Cotopaxi fue insuperable. Los guías fueron completamente profesionales, el equipo perfecto y el paisaje impresionante. Totalmente recomendada.",
		name: "Ana González",
		country: "España",
		expedition: "Ascenso al Cotopaxi",
	},
	{
		text: "Viajamos en familia al Yasuní y Cóndor lo organizó todo. Los niños fascinados con los monos y los loros. Seguridad y organización de primer nivel.",
		name: "Jean-Pierre Moreau",
		country: "Francia",
		expedition: "Expedición Amazonía",
	},
	{
		text: "Años soñando con Galápagos y superaron todas mis expectativas. Nadar con tiburones martillo fue la experiencia más increíble de mi vida.",
		name: "Marco Rivera",
		country: "México",
		expedition: "Expedición Galápagos",
	},
];

export const stats = [
	{ value: "15+", label: "Años de experiencia" },
	{ value: "50+", label: "Destinos explorados" },
	{ value: "5,000+", label: "Viajeros felices" },
	{ value: "100%", label: "Seguridad garantizada" },
];