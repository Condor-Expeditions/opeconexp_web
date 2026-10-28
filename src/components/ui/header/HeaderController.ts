import { navigate } from "astro:transitions/client";

export class HeaderController {
	private header = document.getElementById("site-header");
	private button = document.getElementById("menu-button");
	private panel = document.getElementById("fullscreen-menu");
	private abort = new AbortController();
	private background: { element: HTMLElement; inert: boolean }[] = [];
	private savedFocus: HTMLElement | null = null;
	private bodyStyle = "";
	private scrollY = 0;
	private active = false;
	private closing: Promise<void> | null = null;
	private timer: ReturnType<typeof setTimeout> | undefined;
	private resolveClose: (() => void) | undefined;

	init() {
		if (!this.header || !this.button || !this.panel) return;
		const options = { signal: this.abort.signal };
		const hero = document.querySelector<HTMLElement>(".hero");
		if (hero) {
			const updateHeader = () => {
				const pastHero = hero.getBoundingClientRect().bottom <= 80;
				if (this.header) {
					this.header.dataset.pastHero = String(pastHero);
					this.header.dataset.lightPage = String(pastHero);
				}
			};
			window.addEventListener("scroll", updateHeader, { ...options, passive: true });
			window.addEventListener("resize", updateHeader, options);
			updateHeader();
		}
		this.button.addEventListener(
			"click",
			() => {
				if (this.active) void this.close();
				else if (!this.closing) this.open();
			},
			options,
		);
		document.addEventListener("keydown", this.onKeyDown, options);
		// Capture before Astro's delegated router: close first, then navigate.
		this.header.addEventListener("click", this.onLinkClick, {
			...options,
			capture: true,
		});
		document.addEventListener(
			"astro:before-preparation",
			(event) => {
				if (!this.active && !this.closing) return;
				const loader = event.loader;
				event.loader = async () => {
					await this.close(false);
					await loader();
				};
			},
			options,
		);
	}

	private duration() {
		return window.matchMedia("(prefers-reduced-motion: reduce)").matches
			? 0
			: 680;
	}

	private open() {
		if (!this.header || !this.button || !this.panel) return;
		this.active = true;
		this.savedFocus =
			document.activeElement instanceof HTMLElement
				? document.activeElement
				: null;
		this.scrollY = window.scrollY;
		this.bodyStyle = document.body.style.cssText;
		const gutter = window.innerWidth - document.documentElement.clientWidth;
		Object.assign(document.body.style, {
			position: "fixed",
			top: `-${this.scrollY}px`,
			width: "100%",
			overflow: "hidden",
		});
		if (gutter) document.body.style.paddingRight = `${gutter}px`;
		this.background = Array.from(document.body.children)
			.filter(
				(node): node is HTMLElement =>
					node instanceof HTMLElement &&
					node !== this.header &&
					!node.contains(this.header),
			)
			.map((element) => ({ element, inert: element.inert }));
		for (const { element } of this.background) element.inert = true;
		this.header.setAttribute("role", "dialog");
		this.header.setAttribute("aria-modal", "true");
		this.header.setAttribute("aria-label", "Menú de navegación");
		this.panel.inert = false;
		this.panel.removeAttribute("aria-hidden");
		this.button.setAttribute("aria-expanded", "true");
		this.button.setAttribute("aria-label", "Cerrar menú");
		this.header.dataset.menuState = "opening";
		this.timer = setTimeout(() => {
			if (this.header && this.active) this.header.dataset.menuState = "open";
		}, this.duration());
		this.button.focus({ preventScroll: true });
	}

	private close(restoreFocus = true): Promise<void> {
		if (this.closing) return this.closing;
		if (!this.active || !this.header) return Promise.resolve();
		this.active = false;
		clearTimeout(this.timer);
		this.header.dataset.menuState = "closing";
		this.button?.setAttribute("aria-expanded", "false");
		this.button?.setAttribute("aria-label", "Abrir menú");
		this.closing = new Promise((resolve) => {
			this.resolveClose = resolve;
			this.timer = setTimeout(() => {
				this.reset(restoreFocus);
				this.closing = null;
				this.resolveClose = undefined;
				resolve();
			}, this.duration());
		});
		return this.closing;
	}

	private reset(restoreFocus: boolean) {
		if (this.header) {
			this.header.dataset.menuState = "closed";
			this.header.removeAttribute("role");
			this.header.removeAttribute("aria-modal");
			this.header.removeAttribute("aria-label");
		}
		if (this.panel) {
			this.panel.inert = true;
			this.panel.setAttribute("aria-hidden", "true");
		}
		this.button?.setAttribute("aria-expanded", "false");
		this.button?.setAttribute("aria-label", "Abrir menú");
		for (const { element, inert } of this.background) element.inert = inert;
		this.background = [];
		document.body.style.cssText = this.bodyStyle;
		window.scrollTo({ top: this.scrollY, behavior: "instant" });
		if (restoreFocus) this.savedFocus?.focus({ preventScroll: true });
	}

	private onKeyDown = (event: KeyboardEvent) => {
		if (!this.active && !this.closing) return;
		if (event.key === "Escape") {
			event.preventDefault();
			void this.close();
		}
		if (event.key !== "Tab" || !this.header) return;
		const focusable = Array.from(
			this.header.querySelectorAll<HTMLElement>(
				"a[href], button:not([disabled])",
			),
		).filter((element) => element.getClientRects().length > 0);
		const first = focusable[0];
		const last = focusable.at(-1);
		if (event.shiftKey && document.activeElement === first) {
			event.preventDefault();
			last?.focus();
		} else if (!event.shiftKey && document.activeElement === last) {
			event.preventDefault();
			first?.focus();
		}
	};

	private onLinkClick = (event: MouseEvent) => {
		if (
			(!this.active && !this.closing) ||
			event.defaultPrevented ||
			event.button !== 0 ||
			event.metaKey ||
			event.ctrlKey ||
			event.shiftKey ||
			event.altKey
		)
			return;
		const link =
			event.target instanceof Element
				? event.target.closest<HTMLAnchorElement>("a[href]")
				: null;
		if (!link || link.target === "_blank" || link.hasAttribute("download"))
			return;
		const url = new URL(link.href);
		if (url.origin !== location.origin) return;
		event.preventDefault();
		event.stopImmediatePropagation();
		if (this.closing) return;
		void this.close(false).then(() =>
			navigate(url.pathname + url.search + url.hash),
		);
	};

	destroy() {
		this.abort.abort();
		clearTimeout(this.timer);
		if (this.active || this.closing) this.reset(false);
		this.active = false;
		this.resolveClose?.();
		this.closing = null;
	}
}
