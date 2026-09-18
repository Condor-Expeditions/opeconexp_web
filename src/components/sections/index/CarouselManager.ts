import EmblaCarousel, { type EmblaCarouselType } from "embla-carousel";

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


        this.emblaInstance = EmblaCarousel(this.viewportNode, {
            loop: true,
        });
    }

    others() {

        // const prevBtn = wrapperNode?.querySelector(".embla__prev");
        // const nextBtn = wrapperNode?.querySelector(".embla__next");
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

        // prevBtn?.addEventListener("click", () => emblaApi.scrollPrev());
        // nextBtn?.addEventListener("click", () => emblaApi.scrollNext());

        // dotNodes?.forEach((dot, index) => {
        //   dot.addEventListener("click", () => emblaApi.scrollTo(index));
        // });

        // emblaApi.on("select", updateDots);
        // updateDots();
    }
}

export default CarouselManager;