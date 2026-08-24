export interface RouteItem {
	id: string;
	label: string;
	href?: string;
	type?: "link" | "dropdown";
	disabled?: boolean;
	badge?: string;
	children?: { label: string; href: string; disabled?: boolean }[];
}

export const ROUTES: RouteItem[] = [
	{
		id: "explora-nav",
		label: "Explora",
		href: "/explora",
		type: "link",
	},
	{
		id: "destinos-nav",
		label: "Destinos",
		href: "/destinos",
		type: "link",
	},
	{
		id: "especiales-nav",
		label: "Especiales",
		type: "dropdown",
		disabled: true,
		badge: "Próx",
		children: [
			{ label: "Cotizar Vuelo", href: "#", disabled: true },
			{ label: "Conciertos & Fútbol", href: "#", disabled: true },
			{ label: "Grupos Especiales", href: "#", disabled: true },
			{ label: "Paquetes Internacionales", href: "#", disabled: true },
		],
	},
	{
		id: "nosotros-nav",
		label: "Quiénes Somos",
		href: "/nosotros",
		type: "link",
	},
	{
		id: "contacto-nav",
		label: "Contacto",
		href: "/contacto",
		type: "link",
	},
	{
		id: "mas-nav",
		label: "Más",
		type: "dropdown",
		children: [
			{ label: "Preguntas Frecuentes", href: "/faq" },
			{ label: "Términos y Condiciones", href: "/terminos" },
			{ label: "Política de Privacidad", href: "/privacidad" },
			{ label: "Blog", href: "#", disabled: true },
		],
	},
];

// Labels EN por id (i18n del navbar)
export const ROUTES_LABELS_EN: Record<string, string> = {
	explora: "Explore",
	destinos: "Destinations",
	especiales: "Specials",
	nosotros: "About Us",
	contacto: "Contact",
	mas: "More",
	faq: "FAQ",
	terminos: "Terms & Conditions",
	privacidad: "Privacy Policy",
	blog: "Blog",
};
