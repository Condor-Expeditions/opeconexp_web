export class HeaderController {
	headerNode: HTMLElement | null;
	navMenu: HTMLElement | null;
	megaMenu: HTMLElement | null;
	currentSubmenu: string | null = null;
	// AbortController: limpia listeners globales (window/document) al re-inicializar
	private abort = new AbortController();

	constructor() {
		this.headerNode = document.getElementById("site-header");
		this.navMenu = document.getElementById("header-nav");
		this.megaMenu = document.getElementById("explora-nav-submenu");
	}

	init() {
		if (!this.headerNode || !this.navMenu) return;

		this.setScrollBehavior();
		this.setMegaMenuListeners();
		this.setMobileMenuListeners();
	}

	setScrollBehavior() {
		const scrollThreshold = 80;

		const updateHeader = () => {
			if (!this.headerNode) return;
			if (window.scrollY > scrollThreshold) {
				this.headerNode.classList.add("header-scrolled");
				this.headerNode.classList.remove("header-top");
			} else {
				this.headerNode.classList.add("header-top");
				this.headerNode.classList.remove("header-scrolled");
			}
		};

		updateHeader();
		window.addEventListener("scroll", updateHeader, {
			passive: true,
			signal: this.abort.signal,
		});
	}

	setMegaMenuListeners() {
		if (!this.navMenu || !this.megaMenu) return;

		const trigger = this.navMenu.querySelector('[data-mega-trigger="explora"]');
		if (!trigger) return;

		const showMegaMenu = () => {
			this.megaMenu?.classList.add("mega-menu-open");
			this.megaMenu?.classList.remove("mega-menu-closed");
			trigger.setAttribute("aria-expanded", "true");
		};

		const hideMegaMenu = () => {
			this.megaMenu?.classList.add("mega-menu-closed");
			this.megaMenu?.classList.remove("mega-menu-open");
			trigger.setAttribute("aria-expanded", "false");
		};

		trigger.addEventListener("mouseenter", showMegaMenu);
		trigger.addEventListener("focus", showMegaMenu);

			this.headerNode?.addEventListener("mouseleave", hideMegaMenu, {
				signal: this.abort.signal,
			});

			this.megaMenu.addEventListener("mouseenter", showMegaMenu);
			this.megaMenu.addEventListener("mouseleave", hideMegaMenu);

			this.navMenu
				.querySelectorAll("a:not([data-mega-trigger])")
				.forEach((link) => {
					link.addEventListener("mouseenter", hideMegaMenu, {
						signal: this.abort.signal,
					});
				});
	}

	setMobileMenuListeners() {
		const toggle = document.getElementById("mobile-menu-toggle");
		const mobileMenu = document.getElementById("mobile-menu");
		const mobileClose = document.getElementById("mobile-menu-close");
		const hamburgerIcon = document.getElementById("hamburger-icon");
		const closeIcon = document.getElementById("close-icon");
		const mobileLinks = mobileMenu?.querySelectorAll("a");

		if (!toggle || !mobileMenu || !hamburgerIcon || !closeIcon) return;

		const openMenu = () => {
			mobileMenu.classList.remove("-translate-x-full");
			mobileMenu.setAttribute("aria-hidden", "false");
			toggle.setAttribute("aria-expanded", "true");
			hamburgerIcon.classList.add("hidden");
			closeIcon.classList.remove("hidden");
			document.body.classList.add("overflow-hidden");
		};

		const closeMenu = () => {
			mobileMenu.classList.add("-translate-x-full");
			mobileMenu.setAttribute("aria-hidden", "true");
			toggle.setAttribute("aria-expanded", "false");
			hamburgerIcon.classList.remove("hidden");
			closeIcon.classList.add("hidden");
			document.body.classList.remove("overflow-hidden");
		};

		toggle.addEventListener("click", () => {
			const isOpen = toggle.getAttribute("aria-expanded") === "true";
			isOpen ? closeMenu() : openMenu();
		});

		mobileLinks?.forEach((link) => {
			link.addEventListener("click", closeMenu);
		});

		mobileClose?.addEventListener("click", closeMenu);

		document.addEventListener(
			"keydown",
			(e) => {
				if (
					e.key === "Escape" &&
					toggle.getAttribute("aria-expanded") === "true"
				) {
					closeMenu();
				}
			},
			{ signal: this.abort.signal },
		);
	}

	/** Llamar antes de re-inicializar (astro:page-load) para limpiar listeners globales */
	destroy() {
		this.abort.abort();
	}
}
