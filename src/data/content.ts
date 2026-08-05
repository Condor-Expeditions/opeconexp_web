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

export const equipoData = equipo.equipo;
export const propositoData = equipo.proposito;
export const valoresData = equipo.values;