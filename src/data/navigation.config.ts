import cajas from "@/assets/tours/cajas.jpg";
import ingapirca from "@/assets/tours/ingapirca.jpg";
import nevado from "@/assets/tours/nevado.jpg";
import chordeleg from "../../public/assets/menu/tours/chordeleg-joyeria.jpg";
import giron from "../../public/assets/menu/tours/chorro-de-giron.jpg";
import deleg from "../../public/assets/menu/tours/conoce-deleg.jpg";
import guachapala from "../../public/assets/menu/tours/guachapala-andacocha.jpg";
import gualaceo from "../../public/assets/menu/tours/gualaceo-textiles.jpg";
import cuenca from "../../public/assets/menu/tours/walking-tour-cuenca.webp";

export const navigationLinks = [
	{ title: "Inicio", href: "/" },
	{ title: "Tours", href: "/tours" },
	{ title: "Ediciones", href: "/ediciones" },
	{ title: "Sobre Nosotros", href: "/sobre-nosotros" },
	{ title: "Contacto", href: "/contacto" },
];

// Link destinations to the available tour details; others keep the shared route.
export const featuredTours = [
	{
		title: "El Cajas",
		caption: "Entre lagunas y montañas",
		image: cajas,
		href: "/tours/cajas-al-descubierto/",
	},
	{
		title: "Ingapirca",
		caption: "Huellas de nuestra historia",
		image: ingapirca,
		href: "/tours/raices-ancestrales-del-ecuador/",
	},
	{
		title: "Los Andes",
		caption: "Un poco más cerca del cielo",
		image: nevado,
		href: "/tours/cajas-de-laguna-a-lo-ancestral/",
	},
	{
		title: "Cuenca",
		caption: "Calles que cuentan historias",
		image: cuenca,
		href: "/tours/free-walking-tour-cuenca/",
	},
	{
		title: "Girón",
		caption: "La fuerza de la naturaleza",
		image: giron,
		href: "/tours/aventura-en-cuadron/",
	},
	{
		title: "Déleg",
		caption: "Paisajes por descubrir",
		image: deleg,
		href: "/tours",
	},
	{
		title: "Chordeleg",
		caption: "El arte de nuestras manos",
		image: chordeleg,
		href: "/tours/pueblitos-magicos/",
	},
	{
		title: "Gualaceo",
		caption: "Tradición entre hilos y colores",
		image: gualaceo,
		href: "/tours/pueblitos-magicos/",
	},
	{
		title: "Guachapala",
		caption: "Un encuentro con nuestras raíces",
		image: guachapala,
		href: "/tours",
	},
];
