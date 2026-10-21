export interface HeroTour {
	slug: string;
	name: string;
}

/** Editorial treatments; layout and interaction states live in hero.css. */
export const HERO_TOUR_BUTTON_CLASSES = "hero-tour-link";
export const HERO_TAG_CLASSES = "hero-tag";
export const HERO_CHIP_ANIMATION_CLASS = "hero-chip-in";
export const HERO_CHIP_STAGGER_MS = 60;
export const HERO_TEXT_ANIMATION_CLASS = "hero-text-in";
export const HERO_TEXT_DELAY_MS = {
	title: 0,
	subtitle: 90,
	paragraph: 160,
} as const;
