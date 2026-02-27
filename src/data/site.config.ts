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
	author: "SIMTEC Ecuador",
	companyName: "Condor Expeditions",
	seo: {
		description:
			"SIMTEC es una empresa dedicada a la mantenimiento, instalación, reparación y venta de equipos para la automatización y seguridad del hogar.",
	},
	companyInfo: {
		address: "Calle Mallorca y Av. España Cuenca, Ecuador",
		scheduleWeekdays: "Lunes a Viernes de 07:30h a 19:00h",
		scheduleWeekends: "Sábados de 08:00h a 14:00h",
		whatsApp:
			"https://wa.me/593986006849?text=Hola,%20me%20gustaría%20saber%20más%20sobre%20SIMTEC",
		phone: {
			name: "+593 98 600 6849",
			href: "tel:+593986006849",
		},
		email: {
			name: "simtec.oficial@gmail.com",
			href: "mailto:simtec.oficial@gmail.com",
		},
		location: "https://maps.app.goo.gl/skhR8ofDDeLaU8XCA",
	},
	socials: [
		{
			name: "Facebook",
			href: "https://www.facebook.com/profile.php?id=100090573176748",
			icon: "facebook",
		},
		{
			name: "Instagram",
			href: "https://www.instagram.com/simtecuador/",
			icon: "instagram",
		},
		{
			name: "TikTok",
			href: "https://www.tiktok.com/@simtecuador",
			icon: "tiktok",
		},
		{
			name: "YouTube",
			href: "https://www.youtube.com/@simtecuador",
			icon: "youtube",
		},
		{
			name: "WhatsApp",
			href: "https://wa.me/593986006849?text=Hola,%20me%20gustaría%20saber%20más%20sobre%20SIMTEC",
			icon: "whatsapp",
		},
	],
};
