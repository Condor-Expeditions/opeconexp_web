import { getCompany } from "./helpers";

interface ContactInfo {
	name: string;
	href: string;
}

interface SocialLink {
	name: string;
	href: string;
	icon: string;
}

export interface SiteConfig {
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

// Fuente única de datos: src/data/helpers.ts → api/company/company.json
// Para cambiar teléfonos, emails, redes sociales o dirección,
// edita únicamente ese el JSON api/company/company.json.
const company = getCompany();
export const siteConfig: SiteConfig = {
	author: company.author,
	companyName: company.name,
	seo: {
		description: company.seo.description["es"],
	},
	companyInfo: {
		address: company.contact.address["es"],
		scheduleWeekdays: company.contact.scheduleWeekdays["es"],
		scheduleWeekends: company.contact.scheduleWeekends["es"],
		whatsApp: company.contact.whatsapp,
		phone: company.contact.phone,
		email: company.contact.email,
		location: company.contact.maps,
	},
	socials: company.socials,
};