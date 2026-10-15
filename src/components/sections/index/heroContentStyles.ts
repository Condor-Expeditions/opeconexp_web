export interface HeroTour {
	slug: string;
	name: string;
}

/**
 * Botones de tours del hero: estilo "glass" oscuro que contrasta sobre
 * cualquier imagen (blur + borde + sombra) e invierte a blanco sólido
 * al hover. `pointer-events-auto` porque el overlay del hero es
 * pointer-events-none para permitir el swipe del carrusel.
 */
export const HERO_TOUR_BUTTON_CLASSES = [
	"group pointer-events-auto inline-flex items-center gap-2 rounded-full",
	"border border-white/30 bg-black/35 backdrop-blur-md",
	"px-5 py-2.5 text-sm font-semibold text-white",
	"shadow-lg shadow-black/25",
	"transition-all duration-300",
	"hover:-translate-y-0.5 hover:border-white hover:bg-white hover:text-black hover:shadow-xl hover:shadow-black/30",
	"focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black/40",
].join(" ");

/**
 * Chips de tags: micro-tipografía en mayúsculas sobre glass oscuro sutil.
 * Decorativos (sin pointer-events) para no bloquear el swipe del carrusel.
 */
export const HERO_TAG_CLASSES = [
	"inline-flex items-center rounded-full",
	"border border-white/20 bg-black/25 backdrop-blur-md",
	"px-3 py-1 text-[11px] font-medium uppercase tracking-[0.16em] text-white/85",
	"shadow-sm shadow-black/20",
].join(" ");

/** Animación de entrada escalonada (ver global.css). */
export const HERO_CHIP_ANIMATION_CLASS = "hero-chip-in";

export const HERO_CHIP_STAGGER_MS = 60;

export const HERO_TEXT_ANIMATION_CLASS = "hero-text-in";

export const HERO_TEXT_DELAY_MS = {
	title: 0,
	subtitle: 90,
	paragraph: 160,
} as const;

