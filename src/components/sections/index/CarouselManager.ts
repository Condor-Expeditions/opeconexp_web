import EmblaCarousel, { type EmblaCarouselType } from "embla-carousel";
import Fade from "embla-carousel-fade";


const SWIPE_THRESHOLD = 50;

class CarouselManager {
	emblaInstance: EmblaCarouselType | null;
	wrapperNode: HTMLElement | null;
	viewportNode: HTMLElement | null;

	constructor() {
		this.emblaInstance = null;
		this.wrapperNode = document.querySelector(".embla");
		this.viewportNode = this.wrapperNode?.querySelector(
			".embla__viewport",
		) as HTMLElement;
	}

	initHeroCarousel() {
		if (!this.viewportNode || !this.wrapperNode) {
			return;
		}

		this.emblaInstance = EmblaCarousel(
			this.viewportNode,
			{
				loop: true,
				duration: 80,
				watchDrag: false,
			},
			[Fade()],
		);

		this.bindSwipe();
		this.onChangeUpdateHeroContent();
		this.others();
	}

	onChangeUpdateHeroContent() {
		if (this.emblaInstance === null) {
			return;
		}

		// this.emblaInstance.on("select", () => this.updateHeroContent());
	}

	parseSlideList<T>(slide: HTMLElement, key: "tours" | "tags"): T[] {
		try {
			const raw = slide.dataset[key];
			const parsed: unknown = raw ? JSON.parse(raw) : [];
			return Array.isArray(parsed) ? (parsed as T[]) : [];
		} catch {
			return [];
		}
	}


	bindSwipe() {
		const viewportNode = this.viewportNode;
		if (!viewportNode) return;

		let startX: number | null = null;

		viewportNode.addEventListener("pointerdown", (event) => {
			startX = event.clientX;
		});

		// Un scroll vertical cancela el pointer y no llega `pointerup`:
		// limpiamos para no arrastrar un `startX` viejo.
		viewportNode.addEventListener("pointercancel", () => {
			startX = null;
		});

		viewportNode.addEventListener("pointerup", (event) => {
			if (startX === null) return;

			const deltaX = event.clientX - startX;
			startX = null;

			if (Math.abs(deltaX) < SWIPE_THRESHOLD) return;

			if (this.emblaInstance === null) {
				return;
			}

			if (deltaX < 0) this.emblaInstance.scrollNext();
			else this.emblaInstance.scrollPrev();
		});
	}

	others() {
		const prevBtn = this.wrapperNode?.querySelector(".embla__prev");
		const nextBtn = this.wrapperNode?.querySelector(".embla__next");
		// const dotNodes = wrapperNode?.querySelectorAll(".embla__dot");
		// const updateDots = () => {
		//   const selected = emblaApi.selectedScrollSnap();
		//   dotNodes?.forEach((dot, index) => {
		//     const isSelected = index === selected;
		//     dot.setAttribute("aria-selected", isSelected ? "true" : "false");
		//     dot.classList.toggle("bg-white", isSelected);
		//     dot.classList.toggle("bg-white/50", !isSelected);
		//     dot.classList.toggle("w-8", isSelected);
		//     dot.classList.toggle("w-3", !isSelected);
		//   });
		// };

		prevBtn?.addEventListener("click", () => this.emblaInstance?.scrollPrev());
		nextBtn?.addEventListener("click", () => this.emblaInstance?.scrollNext());

		// dotNodes?.forEach((dot, index) => {
		//   dot.addEventListener("click", () => emblaApi.scrollTo(index));
		// });

		// emblaApi.on("select", updateDots);
		// updateDots();
	}
}

export default CarouselManager;
