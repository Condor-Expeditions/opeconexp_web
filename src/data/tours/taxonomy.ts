/** Stable URL identifiers. Shared by data, filters, the hero and navigation. */
export const destinationLabels = {
	"el-cajas": "El Cajas",
	ingapirca: "Ingapirca",
	cuenca: "Cuenca",
	giron: "Girón",
	chordeleg: "Chordeleg",
	gualaceo: "Gualaceo",
	guachapala: "Guachapala",
	sigsig: "Sígsig",
	"san-fernando": "San Fernando",
	cojitambo: "Cojitambo",
	coyoctor: "Coyoctor",
} as const;

export const experienceLabels = {
	naturaleza: "Naturaleza",
	aventura: "Aventura",
	cultura: "Cultura",
	historia: "Historia",
	arqueologia: "Arqueología",
	gastronomia: "Gastronomía",
	artesania: "Artesanía",
	"recorrido-a-pie": "Recorrido a pie",
} as const;

export type DestinationId = keyof typeof destinationLabels;
export type ExperienceId = keyof typeof experienceLabels;

export function destinationHref(id: DestinationId) {
	return `/tours/?lugar=${encodeURIComponent(id)}`;
}
