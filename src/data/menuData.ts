import { MENU_IMAGES } from "./menuImages";

export const MENU_DATA = {
	explora: [
		{
			title: "Ingapirca, Gualaceo y Chordeleg",
			type: "Historia y Cultura",
			image: MENU_IMAGES.explora[0],
			href: "/destinos/ingapirca-gualaceo-chordeleg",
		},
		{
			title: "Centro Cultural de Cuenca",
			type: "Historia y Cultura",
			image: MENU_IMAGES.explora[1],
			href: "/destinos/walking-tour-cuenca",
		},
		{
			title: "Cuenca Gastronómico",
			type: "Gastronomía",
			image: MENU_IMAGES.explora[2],
			href: "/destinos/walking-tour-gastronomico",
		},
		{
			title: "Conoce El Parque Nacional El Cajas",
			type: "Naturaleza y Aventura",
			image: MENU_IMAGES.explora[3],
			href: "/destinos/parque-nacional-el-cajas",
		},
		{
			title: "Aventura en El Parque Nacional El Cajas",
			type: "Naturaleza y Aventura",
			image: MENU_IMAGES.explora[4],
			href: "/destinos/aventura-parque-nacional-el-cajas",
		},
		{
			title: "El Chorro de Girón",
			type: "Naturaleza y Aventura",
			image: MENU_IMAGES.explora[5],
			href: "/destinos/chorro-de-giron",
		},
		{
			title: "Guachapala y Andacocha",
			type: "Cultura, Naturaleza y Aventura",
			image: MENU_IMAGES.explora[6],
			href: "/destinos/guachapala-andacocha",
		},
		{
			title: "Conoce Deleg",
			type: "Cultura, Naturaleza y Aventura",
			image: MENU_IMAGES.explora[7],
			href: "/destinos/conoce-deleg",
		},
		{
			title: "Mira Cuenca",
			type: "Cultura, Naturaleza y Aventura",
			image: MENU_IMAGES.explora[8],
			href: "/destinos/mira-cuenca",
		},
	],
	destinos: [
		{
			title: "Azuay",
			image: MENU_IMAGES.destinos[0],
			href: "/destinos/azuay",
			places: [
				{
					name: "Parque Nacional El Cajas",
					href: "/destinos/azuay/parque-nacional-el-cajas",
				},
				{
					name: "Centro Histórico de Cuenca",
					href: "/destinos/azuay/centro-historico-cuenca",
				},
				{
					name: "Chordeleg",
					href: "/destinos/azuay/chordeleg",
				},
				{ name: "Gualaceo", href: "/destinos/azuay/gualaceo" },
				{
					name: "El Chorro de Girón",
					href: "/destinos/azuay/el-chorro-de-giron",
				},
				{
					name: "Guachapala",
					href: "/destinos/azuay/guachapala",
				},
				{
					name: "Andacocha",
					href: "/destinos/azuay/andacocha",
				},
				{
					name: "Deleg",
					href: "/destinos/azuay/deleg",
				},
			],
		},
		{
			title: "Cañar",
			image: MENU_IMAGES.destinos[1],
			href: "/destinos/canar",
			places: [
				{
					name: "Ingapirca",
					href: "/destinos/canar/ingapirca",
				},
			],
		},
	],
};
