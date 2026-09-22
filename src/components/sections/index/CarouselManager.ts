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

        const emblaApi = EmblaCarousel(
            this.viewportNode,
            {
                loop: true,
                duration: 200,
                watchDrag: false,
            },
            [Fade()],
        );

        this.emblaInstance = emblaApi;
        this.bindSwipe(emblaApi);
        this.others();
    }

    bindSwipe(emblaApi: EmblaCarouselType) {
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

            if (deltaX < 0) emblaApi.scrollNext();
            else emblaApi.scrollPrev();
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
