// Datos estáticos para las secciones del home de Cóndor Expeditions.
// Fuente única de datos: archivos JSON en src/data/ (destinos.json,
// experiencias.json, equipo.json, company.json).
// Edita los JSON, no este archivo.

import destinos from "./destinos.json";
import experiencias from "./experiencias.json";
import equipo from "./equipo.json";

export const featuredDestinations = destinos.destinations.map((d) => ({
	name: d.name,
	slug: d.slug,
	description: d.description,
	image: d.image,
	alt: d.alt,
	highlight: d.highlight ?? "",
	tag: d.tag,
}));

export const experiences = experiencias.categories.flatMap((cat) =>
	cat.experiences.map((exp) => ({
		title: exp.title,
		category: cat.id,
		duration: exp.duration,
		difficulty: exp.difficulty,
		description: exp.includes,
		image: "",
	}))
);

export const differentiators = [
	{
		icon: "compass",
		title: "Guías Locales Expertos",
		description:
			"Más de 10 años de experiencia en cada destino. Conocimiento profundo del territorio y su cultura.",
	},
	{
		icon: "leaf",
		title: "Turismo Sostenible",
		description:
			"Impacto ambiental mínimo. Apoyamos comunidades locales y proyectos de conservación activa.",
	},
	{
		icon: "backpack",
		title: "Expediciones a Tu Medida",
		description:
			"Itinerarios personalizados según tu nivel, intereses y ritmo. Grupos reducidos de máximo 12 personas.",
	},
	{
		icon: "shield",
		title: "Seguridad Garantizada",
		description:
			"Equipo de respuesta, seguros de accidentes personales y monitoreo satelital en cada expedición.",
	},
	{
		icon: "users",
		title: "Turismo Responsable",
		description:
			"Trabajamos de la mano con comunidades indígenas y locales, retribuyendo a quienes protegen estos territorios.",
	},
	{
		icon: "certificate",
		title: "Guías Certificados",
		description:
			"Guías acreditados ASEGUIM, IRF y WFR. Formación continua en primeros auxilios y rescate en montaña.",
	},
];

export const testimonials = [
	{
		text: "La experiencia en el Cotopaxi fue insuperable. Los guías fueron completamente profesionales, el equipo perfecto y el paisaje impresionante. Totalmente recomendada.",
		name: "Ana González",
		country: "España",
		city: "Madrid",
		expedition: "Ascenso al Cotopaxi",
		stars: 5,
	},
	{
		text: "Viajamos en familia al Yasuní y Cóndor lo organizó todo. Los niños fascinados con los monos y los loros. Seguridad y organización de primer nivel.",
		name: "Jean-Pierre Moreau",
		country: "Francia",
		city: "Lyon",
		expedition: "Expedición Amazonía",
		stars: 5,
	},
	{
		text: "Años soñando con Galápagos y superaron todas mis expectativas. Nadar con tiburones martillo fue la experiencia más increíble de mi vida.",
		name: "Marco Rivera",
		country: "México",
		city: "CDMX",
		expedition: "Expedición Galápagos",
		stars: 5,
	},
];

export const stats = [
	{ value: 15, suffix: "+", label: "Años de experiencia" },
	{ value: 50, suffix: "+", label: "Destinos explorados" },
	{ value: 5000, suffix: "+", label: "Viajeros felices" },
	{ value: 100, suffix: "%", label: "Seguridad garantizada" },
];

export const equipoData = equipo.equipo;
export const propositoData = equipo.proposito;
export const valoresData = equipo.values;