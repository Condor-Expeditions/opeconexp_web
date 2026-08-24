// Tipos estructurados para el API local
// Inspirado en la arquitectura de feature/api-rest-datos

export interface MultilingualText {
	es: string;
	en: string;
	[lang: string]: string;
}

export interface Price {
	label: MultilingualText;
	amount: number;
	currency: string;
}

export interface Include {
	icon: string;
	text: MultilingualText;
}

export interface Schedule {
	start: string;
	end?: string;
	days: string[];
}

export interface ProgramStop {
	time: string;
	title: MultilingualText;
}

export interface ProgramDay {
	day: number;
	stops: ProgramStop[];
	meals: string[];
	meals_not_included: string[];
	highlights?: MultilingualText[];
	activities?: string[];
}

export interface Accommodation {
	id: string;
	name: string;
	url?: string;
	phone?: string;
	used_on_days: number[];
}

export interface Category {
	id: string;
	slug: string;
	icon: string;
	title: MultilingualText;
}

export interface Region {
	id: string;
	slug: string;
	title: MultilingualText;
}

export interface Tag {
	id: string;
	slug: string;
	title: MultilingualText;
}

export interface MeetingPoint {
	id: string;
	title: MultilingualText;
	location: { lat: number; lng: number };
}

export interface Difficulty {
	id: string;
	level: number;
	title: MultilingualText;
}

export interface Operator {
	id: string;
	name: string;
	phone: string;
	email: string;
	logo: string;
}

export interface MediaItem {
	type: "image" | "video";
	src: string;
	alt: MultilingualText;
	caption?: MultilingualText;
}

export interface SeoMeta {
	title: MultilingualText;
	description: MultilingualText;
}

// Tour principal: usa la arquitectura API local con mapas de idioma
export interface Tour {
	id: string;
	slug: string;
	type: "tour" | "custom";
	status: "draft" | "active" | "hidden" | "archived";
	title: MultilingualText;
	description: MultilingualText;
	categories: string[];
	regions: string[];
	tags: string[];
	operator: string;
	meetingPoint: string;
	duration: string;
	difficulty: string;
	prices: Price[];
	includes: Include[];
	itinerary?: ProgramDay[];
	schedules: Schedule[];
	accommodations?: Accommodation[];
	gallery?: MediaItem[];
	seo?: SeoMeta;
	createdAt?: string;
	updatedAt?: string;
}

export interface Company {
	name: MultilingualText;
	author: string;
	seo: SeoMeta;
	contact: {
		phone: string;
		email: string;
		address: MultilingualText;
	};
	socials: Record<string, string>;
}

export interface TeamMember {
	id: string;
	name: string;
	role: MultilingualText;
	photo: string;
	bio: MultilingualText;
}

export interface SustainabilityItem {
	id: string;
	title: MultilingualText;
	description: MultilingualText;
	image: string;
	stats: {
		label: MultilingualText;
		value: string;
	}[];
}

export interface Stat {
	id: string;
	label: MultilingualText;
	value: string;
	icon: string;
	suffix?: string;
}

export interface Review {
	id: string;
	tourId: string;
	author: string;
	rating: number;
	comment: MultilingualText;
	date: string;
	avatar?: string;
}

export interface Testimonial {
	id: string;
	name: string;
	role: MultilingualText;
	content: MultilingualText;
	rating: number;
	avatar: string;
}

export interface CartItem {
	id: string;
	tourId: string;
	date: string;
	quantity: number;
	price: number;
}
