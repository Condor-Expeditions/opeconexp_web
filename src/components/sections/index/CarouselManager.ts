import EmblaCarousel, { type EmblaCarouselType } from "embla-carousel";
import Fade from "embla-carousel-fade";

const SWIPE_THRESHOLD = 50;
const DRAG_THRESHOLD = 10;
const HORIZONTAL_SWIPE_RATIO = 1.2;

class CarouselManager {
	emblaInstance: EmblaCarouselType | null;
	wrapperNode: HTMLElement | null;
	viewportNode: HTMLElement | null;

	constructor() {
		this.emblaInstance = null;
		this.wrapperNode = document.querySelector("#hero-carousel");
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
				duration: 30,
				watchDrag: false,
			},
			[Fade()],
		);

		this.bindSwipe();
		this.others();
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

		const listeners = new AbortController();
		let gesture: AbortController | null = null;
		let suppressClick = false;
		const resetGesture = () => {
			gesture?.abort();
			gesture = null;
		};

		viewportNode.addEventListener(
			"pointerdown",
			(event) => {
				if (!event.isPrimary || event.button !== 0 || gesture) return;

				suppressClick = false;
				const { clientX: startX, clientY: startY, pointerId } = event;
				gesture = new AbortController();
				const { signal } = gesture;
				const isHorizontal = (deltaX: number, deltaY: number) =>
					Math.abs(deltaX) > Math.abs(deltaY) * HORIZONTAL_SWIPE_RATIO;

				// Escuchamos fuera del viewport sin capturar el pointer para conservar
				// el destino de los clics normales sobre los enlaces.
				window.addEventListener(
					"pointermove",
					(moveEvent) => {
						if (moveEvent.pointerId !== pointerId) return;
						const deltaX = moveEvent.clientX - startX;
						const deltaY = moveEvent.clientY - startY;
						if (
							Math.abs(deltaX) >= DRAG_THRESHOLD &&
							isHorizontal(deltaX, deltaY)
						) {
							suppressClick = true;
						}
					},
					{ signal },
				);

				window.addEventListener(
					"pointerup",
					(upEvent) => {
						if (upEvent.pointerId !== pointerId) return;
						const deltaX = upEvent.clientX - startX;
						const deltaY = upEvent.clientY - startY;
						resetGesture();

						if (
							Math.abs(deltaX) < SWIPE_THRESHOLD ||
							!isHorizontal(deltaX, deltaY)
						)
							return;

						suppressClick = true;
						if (deltaX < 0) this.emblaInstance?.scrollNext();
						else this.emblaInstance?.scrollPrev();
					},
					{ signal },
				);

				// El navegador cancela el pointer cuando empieza el scroll vertical.
				window.addEventListener(
					"pointercancel",
					(cancelEvent) => {
						if (cancelEvent.pointerId === pointerId) resetGesture();
					},
					{ signal },
				);
				window.addEventListener("blur", resetGesture, { signal });
			},
			{ signal: listeners.signal },
		);

		viewportNode.addEventListener(
			"click",
			(event) => {
				if (!suppressClick || event.detail === 0) return;
				event.preventDefault();
				event.stopImmediatePropagation();
				suppressClick = false;
			},
			{ capture: true, signal: listeners.signal },
		);

		viewportNode.addEventListener(
			"dragstart",
			(event) => {
				if (gesture) event.preventDefault();
			},
			{ signal: listeners.signal },
		);

		this.emblaInstance?.on("destroy", () => {
			resetGesture();
			listeners.abort();
		});
	}

	others() {
		const prevBtn = this.wrapperNode?.querySelector(".embla__prev");
		const nextBtn = this.wrapperNode?.querySelector(".embla__next");
		const listeners = new AbortController();
		prevBtn?.addEventListener("click", () => this.emblaInstance?.scrollPrev(), {
			signal: listeners.signal,
		});
		nextBtn?.addEventListener("click", () => this.emblaInstance?.scrollNext(), {
			signal: listeners.signal,
		});
		const updateSelection = () => {
			const api = this.emblaInstance;
			if (!api) return;
			const selected = api.selectedScrollSnap();
			api.slideNodes().forEach((slide, index) => {
				const active = index === selected;
				slide.inert = !active;
				if (active) slide.removeAttribute("aria-hidden");
				else slide.setAttribute("aria-hidden", "true");
			});
			const counter = this.wrapperNode?.querySelector(".hero-current");
			if (counter) counter.textContent = String(selected + 1).padStart(2, "0");
		};
		this.emblaInstance?.on("select", updateSelection);
		this.emblaInstance?.on("reInit", updateSelection);
		this.emblaInstance?.on("destroy", () => listeners.abort());
		updateSelection();
	}
}

export default CarouselManager;
