import type { DestinationId, ExperienceId } from "./taxonomy";

export interface TourPhoto {
	/** Local image path. The gallery optimizes the image and reads its dimensions. */
	src: string;
	alt: string;
	position?: string;
}

export interface Tour {
	id: string;
	slug: string;
	title: string;
	/** Short handwritten accent, not a replacement for the tour name. */
	signature: string;
	category: string;
	location: string;
	destinations: DestinationId[];
	experienceTypes: ExperienceId[];
	/** Short, factual introduction for the listing card. */
	summary: string;
	/** Editorial proposal, not an operating product yet. */
	provisional?: boolean;
	description: string;
	duration: string;
	durationNote?: string;
	difficulty: string;
	languages: string;
	languageNote?: string;
	audience: string;
	season: string;
	price: { kind: "paid"; adult: number; child?: number; childAges?: string } | { kind: "free" } | { kind: "pending" };
	meeting: string;
	returnPoint: string;
	operation: string;
	/** JavaScript weekday numbers. These are operating days, NOT live availability. */
	operatingDays: number[];
	/** Preferred periods (e.g. Mañana / Tarde), never fixed clock times. */
	departures: string[];
	minimumPeople: number;
	transport: string;
	transferDuration: string;
	highlights: { title: string; description: string }[];
	/** Approximate stage duration, including transfers when grouped. null = not confirmed. */
	itinerary: { durationMinutes: number | null; title: string; description: string }[];
	includes: string[];
	excludes: string[];
	packing: { title: string; description: string }[];
	restrictions: { title: string; description: string }[];
	conditions: { title: string; description: string }[];
	practical: string[];
	photos: TourPhoto[];
	/** Set false only once the gallery contains approved photos of this tour. */
	illustrativePhotos: boolean;
	source: {
		snapshot: string;
		sheet: "FICHA TOUR";
		priceCells: string[];
		/** Internal editorial notes, never rendered or sent to the browser. */
		pendingReview: string[];
	};
}
