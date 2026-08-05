export interface NavItem {
	id: string
	label: string
	labelEn: string
	type: "link" | "dropdown"
	href?: string
	disabled?: boolean
	tooltip?: string
	children?: NavItem[]
}

export const NAV: NavItem[] = [
	{
		id: "tours",
		label: "Tours",
		labelEn: "Tours",
		type: "dropdown",
		children: [
			{
				id: "tours-header-region",
				label: "Por Región",
				labelEn: "By Region",
				type: "dropdown",
				children: [
					{ id: "tour-cuenca", label: "Cuenca", labelEn: "Cuenca", type: "link", href: "/tours/cuenca" },
					{ id: "tour-azuay", label: "Azuay", labelEn: "Azuay", type: "link", href: "/tours/azuay" },
					{ id: "tour-ecuador", label: "Ecuador", labelEn: "Ecuador", type: "link", href: "/tours/ecuador" },
				],
			},
			{
				id: "tours-header-tipo",
				label: "Por Tipo",
				labelEn: "By Type",
				type: "dropdown",
				children: [
					{ id: "tipo-trekking", label: "Trekking", labelEn: "Trekking", type: "link", href: "/tours?tipo=trekking" },
					{ id: "tipo-rafting", label: "Rafting", labelEn: "Rafting", type: "link", href: "/tours?tipo=rafting" },
					{ id: "tipo-montanismo", label: "Montañismo", labelEn: "Mountaineering", type: "link", href: "/tours?tipo=montanismo" },
					{ id: "tipo-selva", label: "Selva", labelEn: "Jungle", type: "link", href: "/tours?tipo=selva" },
					{ id: "tipo-cultural", label: "Cultural", labelEn: "Cultural", type: "link", href: "/tours?tipo=cultural" },
				],
			},
			{
				id: "tours-header-temporada",
				label: "Temporada",
				labelEn: "Season",
				type: "dropdown",
				children: [
					{ id: "temp-ballenas", label: "Ballenas (jun-sep)", labelEn: "Whales (jun-sep)", type: "link", href: "/tours/temporada#ballenas" },
					{ id: "temp-carnaval", label: "Carnaval", labelEn: "Carnival", type: "link", href: "/tours/temporada#carnaval" },
					{ id: "temp-finano", label: "Fin de Año", labelEn: "New Year", type: "link", href: "/tours/temporada#fin-de-ano" },
					{ id: "temp-vacaciones", label: "Vacaciones", labelEn: "Holidays", type: "link", href: "/tours/temporada#vacaciones" },
				],
			},
			{
				id: "tours-header-personalizados",
				label: "Personalizados",
				labelEn: "Custom Tours",
				type: "link",
				href: "/personalizados",
			},
		],
	},
	{
		id: "especiales",
		label: "Especiales",
		labelEn: "Special Reservations",
		type: "dropdown",
		disabled: true,
		tooltip: "Próximamente",
		children: [
			{ id: "esp-vuelos", label: "Cotizar Vuelo", labelEn: "Flight Quotes", type: "link", href: "#", disabled: true },
			{ id: "esp-conciertos", label: "Conciertos & Fútbol", labelEn: "Concerts & Soccer", type: "link", href: "#", disabled: true },
			{ id: "esp-grupos", label: "Grupos", labelEn: "Groups", type: "link", href: "#", disabled: true },
			{ id: "esp-paquetes", label: "Paquetes Internacionales", labelEn: "International Packages", type: "link", href: "#", disabled: true },
		],
	},
	{
		id: "mas",
		label: "Más",
		labelEn: "More",
		type: "dropdown",
		children: [
			{ id: "quienes-somos", label: "Quiénes Somos", labelEn: "About Us", type: "link", href: "/nosotros" },
			{ id: "faq", label: "Preguntas Frecuentes", labelEn: "FAQ", type: "link", href: "/faq" },
			{ id: "contacto", label: "Contacto", labelEn: "Contact", type: "link", href: "/contacto" },
		],
	},
]