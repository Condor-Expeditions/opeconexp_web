import azuay from "@/assets/menu/destinos/azuay.jpg";
import canar from "@/assets/menu/destinos/canar.jpg";

import aventuraParqueNacionalElCajas from "@/assets/menu/tours/aventura-parque-nacional-el-cajas.jpg";
import ingapirca from "@/assets/menu/tours/ingapirca.jpg";
import walkingTourCuenca from "@/assets/menu/tours/walking-tour-cuenca.webp";
import walkingTourGastronomico from "@/assets/menu/tours/walking-tour-gastronomico.webp";
import parqueNacionalElCajas from "@/assets/menu/tours/parque-nacional-el-cajas.jpg";
import chorroDeGiron from "@/assets/menu/tours/chorro-de-giron.jpg";

export const MENU_DATA = {
	explora: [
		{
			title: "Ingapirca, Gualaceo y Chordeleg",
			type: "Historia y Cultura",
			image: ingapirca,
			href: "/destinos/ingapirca-gualaceo-chordeleg",
			gridConfig: "row-span-2 min-h-[400px]",
		},
		{
			title: "Centro Cultural de Cuenca",
			type: "Historia y Cultura",
			image: walkingTourCuenca,
			href: "/destinos/walking-tour-cuenca",
			gridConfig: "row-span-2",
		},
		{
			title: "Cuenca Gastronómico",
			type: "Gastronomía",
			image: walkingTourGastronomico,
			href: "/destinos/walking-tour-gastronomico",
		},
		{
			title: "Conoce El Parque Nacional El Cajas",
			type: "Naturaleza y Aventura",
			image: parqueNacionalElCajas,
			href: "/destinos/parque-nacional-el-cajas",
		},
		{
			title: "Aventura en El Parque Nacional El Cajas",
			type: "Naturaleza y Aventura",
			image: aventuraParqueNacionalElCajas,
			href: "/destinos/aventura-parque-nacional-el-cajas",
		},
		{
			title: "El Chorro de Girón",
			type: "Naturaleza y Aventura",
			image: chorroDeGiron,
			href: "/destinos/chorro-de-giron",
		},
	],
	destinos: [
		{
			title: "Azuay",
			image: azuay,
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
			image: canar,
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
