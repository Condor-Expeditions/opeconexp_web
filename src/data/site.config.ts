interface ContactInfo {
	name: string;
	href: string;
}

interface SocialLink {
	name: string;
	href: string;
	icon: string;
}

interface SiteConfig {
	author: string;
	companyName: string;
	seo: {
		description: string;
	};
	companyInfo: {
		address: string;
		scheduleWeekdays: string;
		scheduleWeekends: string;
		whatsApp: string;
		phone: ContactInfo;
		email: ContactInfo;
		location: string;
	};
	socials: SocialLink[];
}

export const siteConfig: SiteConfig = {
	author: "Condor Expeditions",
	companyName: "Condor Expeditions",
	seo: {
		description:
			"Condor Expeditions es una operadora turística en Cuenca, Ecuador. Ofrecemos expediciones auténticas al Parque Nacional El Cajas, Ingapirca, Girón, Déleg y Guachapala. Ecuador: Vive lo que otros solo visitan.",
	},
	companyInfo: {
		address: "Cuenca, Azuay, Ecuador",
		scheduleWeekdays: "Lunes a Domingo de 08:00h a 18:00h",
		scheduleWeekends: "Fines de semana: salidas programadas",
		whatsApp:
			"https://wa.me/593986006849?text=Hola,%20me%20gustaría%20saber%20más%20sobre%20Condor%20Expeditions",
		phone: {
			name: "+593 98 600 6849",
			href: "tel:+593986006849",
		},
		email: {
			name: "info@condorexpedition.com",
			href: "mailto:info@condorexpedition.com",
		},
		location: "https://maps.app.goo.gl/skhR8ofDDeLaU8XCA",
	},
	socials: [
		{
			name: "Facebook",
			href: "https://www.facebook.com/CondorExpeditionsCuenca",
			icon: "facebook",
		},
		{
			name: "Instagram",
			href: "https://www.instagram.com/condorexpeditionscuenca",
			icon: "instagram",
		},
		{
			name: "TikTok",
			href: "https://www.tiktok.com/@condorexpeditionscuenca",
			icon: "tiktok",
		},
		{
			name: "YouTube",
			href: "https://www.youtube.com/@condorexpeditionscuenca",
			icon: "youtube",
		},
		{
			name: "WhatsApp",
			href: "https://wa.me/593986006849?text=Hola,%20me%20gustaría%20saber%20más%20sobre%20Condor%20Expeditions",
			icon: "whatsapp",
		},
	],
};
