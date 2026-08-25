import type { Region } from "@/data/core/helpers";
import {
	getCategories,
	getRegions,
	getTours,
	type Category,
	type Tour,
} from "@/data/core/helpers";

export interface MenuCard {
	id: string;
	label: string;
	labelEn: string;
	image: string;
	href: string;
	hrefEn: string;
	tag: string;
	tagEn: string;
}

function firstTourImage(predicate: (t: Tour) => boolean): string {
	const t = getTours().find(predicate);
	return t?.image || "";
}

const catSlug = (c: Category) => c.slug || c.id;
const regionSlug = (r: Region) => r.slug || r.id;

export function getExploraMenu(lang: "es" | "en" = "es") {
	void lang; // hrefs ya son simétricos ES/EN salvo prefijo
	const categorias: MenuCard[] = getCategories().map((c) => ({
		id: catSlug(c),
		label: c.title.es || c.id,
		labelEn: c.title.en || c.title.es || c.id,
		image: firstTourImage((t) =>
			(t.categories ?? []).some(
				(x) => x.toLowerCase() === catSlug(c).toLowerCase(),
			),
		),
		href: `/explora?tipo=categoria&valor=${catSlug(c)}`,
		hrefEn: `/en/explora?tipo=categoria&valor=${catSlug(c)}`,
		tag: "Categoría",
		tagEn: "Category",
	}));

	const regiones: MenuCard[] = getRegions().map((r) => ({
		id: regionSlug(r),
		label: r.title.es || r.id,
		labelEn: r.title.en || r.title.es || r.id,
		image: firstTourImage((t) =>
			(t.regions ?? []).some(
				(x) => x.toLowerCase() === regionSlug(r).toLowerCase(),
			),
		),
		href: `/explora?tipo=region&valor=${regionSlug(r)}`,
		hrefEn: `/en/explora?tipo=region&valor=${regionSlug(r)}`,
		tag: "Región",
		tagEn: "Region",
	}));

	const temporada: MenuCard[] = [
		{
			id: "alta",
			label: "Temporada Alta",
			labelEn: "High Season",
			image: firstTourImage((t) => (t.seasons?.high?.length ?? 0) > 0),
			href: "/explora?tipo=temporada&valor=alta",
			hrefEn: "/en/explora?tipo=temporada&valor=alta",
			tag: "Jun–Ago · Dic–Ene",
			tagEn: "Jun–Aug · Dec–Jan",
		},
		{
			id: "baja",
			label: "Temporada Baja",
			labelEn: "Low Season",
			image: firstTourImage((t) => (t.seasons?.low?.length ?? 0) > 0),
			href: "/explora?tipo=temporada&valor=baja",
			hrefEn: "/en/explora?tipo=temporada&valor=baja",
			tag: "Resto del año",
			tagEn: "Rest of the year",
		},
	];

	return { categorias, regiones, temporada };
}
