import azuay from "@/assets/menu/destinos/azuay.jpg";
import canar from "@/assets/menu/destinos/canar.jpg";
import chorroDeGiron from "@/assets/menu/tours/chorro-de-giron.jpg";
import guachapalaAndacocha from "@/assets/menu/tours/guachapala-andacocha.jpg";
import ingapirca from "@/assets/menu/tours/ingapirca.jpg";
import miraCuenca from "@/assets/menu/tours/mira-cuenca.jpg";
import cajasExpress from "@/assets/menu/tours/parque-nacional-el-cajas.jpg";

export const MENU_DATA = {
	explora: [
		{
			title: "Extremo Girón: Cascada y Adrenalina",
			type: "Cultura, Aventura y Naturaleza",
			image: chorroDeGiron,
			href: "/tours/extremo-giron-cascada-adrenalina",
			gridConfig: "row-span-2 min-h-[400px]",
		},
		{
			title: "Cajas Express: Mística y Naturaleza",
			type: "Naturaleza y Aventura Suave",
			image: cajasExpress,
			href: "/tours/cajas-express-mistica-naturaleza",
			gridConfig: "row-span-2",
		},
		{
			title: "Girón Natural: Cascada y Aventura",
			type: "Naturaleza y Cultura",
			image: chorroDeGiron,
			href: "/tours/giron-natural-cascada-aventura",
		},
		{
			title: "Ruta del Sol y la Plata: 3 Ciudades",
			type: "Cultura, Historia y Artesanía",
			image: ingapirca,
			href: "/tours/ruta-sol-plata-3-ciudades",
		},
		{
			title: "Ruta del Artesano: Gualaceo y Chordeleg",
			type: "Cultura y Artesanal",
			image: miraCuenca,
			href: "/tours/ruta-artesano-gualaceo-chordeleg",
		},
		{
			title: "Girón Mágico: Cascada y Laguna de Busa",
			type: "Naturaleza, Paisajístico y Cultural",
			image: guachapalaAndacocha,
			href: "/tours/giron-magico-cascada-laguna-busa",
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
					href: "/destinos/parque-nacional-el-cajas",
				},
				{
					name: "Centro Histórico de Cuenca",
					href: "/destinos/centro-historico-cuenca",
				},
				{
					name: "Chordeleg",
					href: "/destinos/chordeleg",
				},
				{ name: "Gualaceo", href: "/destinos/gualaceo" },
				{
					name: "El Chorro de Girón",
					href: "/destinos/el-chorro-de-giron",
				},
				{
					name: "Guachapala",
					href: "/destinos/guachapala",
				},
				{
					name: "Andacocha",
					href: "/destinos/andacocha",
				},
				{
					name: "Déleg",
					href: "/destinos/deleg",
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
					href: "/destinos/ingapirca",
				},
			],
		},
	],
};
