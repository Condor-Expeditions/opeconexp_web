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
			"Cóndor Expeditions: operadora de turismo de aventura en Ecuador. Expediciones personalizadas de trekking, rafting, montañismo y selva en los Andes, Amazonía y Galápagos.",
	},
	companyInfo: {
		address: "Cuenca, Ecuador",
		scheduleWeekdays: "Lunes a Viernes de 08:00h a 18:00h",
		scheduleWeekends: "Sábados de 09:00h a 13:00h",
		whatsApp:
			"https://wa.me/593986006849?text=Hola,%20quiero%20información%20sobre%20expediciones%20con%20Cóndor%20Expeditions",
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
			href: "https://www.facebook.com/condorexpeditions",
			icon: "facebook",
		},
		{
			name: "Instagram",
			href: "https://www.instagram.com/condorexpeditions/",
			icon: "instagram",
		},
		{
			name: "TikTok",
			href: "https://www.tiktok.com/@condorexpeditions",
			icon: "tiktok",
		},
		{
			name: "YouTube",
			href: "https://www.youtube.com/@condorexpeditions",
			icon: "youtube",
		},
		{
			name: "WhatsApp",
			href: "https://wa.me/593986006849?text=Hola,%20quiero%20información%20sobre%20expediciones",
			icon: "whatsapp",
		},
	],
};