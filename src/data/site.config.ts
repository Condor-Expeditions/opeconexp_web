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
		tourismRegistration: {
			denomination: string;
			classification: string;
			number: string;
			annualLicense: string;
		};
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
		tourismRegistration: {
			denomination: "Agencia Operadora de Turismo Condor Expeditions",
			classification: "Agencia Operadora de Turismo",
			number: "0195167990001.001.4011862",
			annualLicense: "95876",
		},
		address: "Gran Colombia 1-82 y Manuel Vega, Cuenca, Azuay, Ecuador",
		scheduleWeekdays: "Lunes a Domingo de 08:00h a 18:00h",
		scheduleWeekends: "Fines de semana: salidas programadas",
		whatsApp:
			"https://wa.me/593995900614?text=Hola,%20me%20gustaría%20saber%20más%20sobre%20Condor%20Expeditions",
		phone: {
			name: "+593 99 590 0614",
			href: "tel:+593995900614",
		},
		email: {
			name: "info@condorexpedition.com",
			href: "mailto:info@condorexpedition.com",
		},
		location: "https://www.google.com/maps/search/?api=1&query=Gran%20Colombia%201-82%20y%20Manuel%20Vega%2C%20Cuenca%2C%20Ecuador",
	},
	socials: [
		{
			name: "Facebook",
			href: "https://www.facebook.com/share/1ZTwuhkEyo/",
			icon: "facebook",
		},
		{
			name: "Instagram",
			href: "https://www.instagram.com/condorexpedition/",
			icon: "instagram",
		},
		{
			name: "TikTok",
			href: "https://www.tiktok.com/@condorexpeditions",
			icon: "tiktok",
		},
		{
			name: "WhatsApp",
			href: "https://wa.me/593995900614?text=Hola,%20me%20gustaría%20saber%20más%20sobre%20Condor%20Expeditions",
			icon: "whatsapp",
		},
	],
};
