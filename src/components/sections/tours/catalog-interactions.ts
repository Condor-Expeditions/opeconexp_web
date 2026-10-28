/** Filtering and card galleries use only DOM APIs: no third-party initialization. */
export function initTourCatalog() {
	const root = document.querySelector<HTMLElement>("[data-tour-catalog]");
	if (!root) return;
	const abort = new AbortController();
	const options = { signal: abort.signal };
	const inputs = Array.from(root.querySelectorAll<HTMLInputElement>('input[type="checkbox"]'));
	const cards = Array.from(root.querySelectorAll<HTMLElement>("[data-tour-card]"));
	const filters = Array.from(root.querySelectorAll<HTMLElement>(".catalog-filter"));
	const active = root.querySelector<HTMLElement>("[data-active-filters]");
	const count = root.querySelector<HTMLElement>("[data-results-count]");
	const empty = root.querySelector<HTMLElement>("[data-empty-results]");
	const clearButtons = root.querySelectorAll<HTMLButtonElement>("[data-clear-filters]");
	const section = root.querySelector<HTMLElement>("[data-filter-section]");
	if (section) section.hidden = false;
	const galleryCleanups = new Map<HTMLElement, () => void>();
	const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)");

	const startGallery = (card: HTMLElement) => {
		if (card.hidden || galleryCleanups.has(card)) return;
		const viewport = card.querySelector<HTMLElement>(".card-viewport");
		const controls = card.querySelector<HTMLElement>(".card-gallery-controls");
		if (!viewport || !controls) return;
		const slides = Array.from(card.querySelectorAll<HTMLElement>(".card-slide"));
		const galleryAbort = new AbortController();
		const galleryOptions = { signal: galleryAbort.signal };
		let current = 0;
		let frame = 0;
		const load = (index: number) => {
			const template = slides[(index + slides.length) % slides.length]?.querySelector<HTMLTemplateElement>("template");
			if (template) template.replaceWith(template.content.cloneNode(true));
		};
		const update = (index: number) => {
			current = index;
			load(index);
			for (const [i, slide] of slides.entries()) {
				if (i === index) slide.removeAttribute("aria-hidden");
				else slide.setAttribute("aria-hidden", "true");
			}
			const indicator = controls.querySelector<HTMLElement>("[data-photo-current]");
			if (indicator) indicator.textContent = String(index + 1);
		};
		const move = (direction: number) => {
			const next = (current + direction + slides.length) % slides.length;
			load(next);
			const wrap = Math.abs(next - current) > 1;
			viewport.scrollTo({ left: next * viewport.clientWidth, behavior: reducedMotion.matches || wrap ? "instant" : "smooth" });
		};
		card.dataset.carouselReady = "true";
		viewport.scrollLeft = 0;
		controls.hidden = false;
		update(0);
		viewport.addEventListener("scroll", () => {
			if (frame) return;
			frame = requestAnimationFrame(() => {
				frame = 0;
				if (!viewport.clientWidth) return;
				const index = Math.max(0, Math.min(slides.length - 1, Math.round(viewport.scrollLeft / viewport.clientWidth)));
				if (index !== current) update(index);
			});
		}, { ...galleryOptions, passive: true });
		viewport.addEventListener("pointerdown", () => { load(current - 1); load(current + 1); }, galleryOptions);
		card.querySelector(".card-prev")?.addEventListener("click", () => move(-1), galleryOptions);
		card.querySelector(".card-next")?.addEventListener("click", () => move(1), galleryOptions);
		controls.addEventListener("keydown", event => {
			if (event.key === "ArrowLeft") { event.preventDefault(); move(-1); }
			if (event.key === "ArrowRight") { event.preventDefault(); move(1); }
		}, galleryOptions);
		galleryCleanups.set(card, () => {
			galleryAbort.abort();
			cancelAnimationFrame(frame);
			controls.hidden = true;
			delete card.dataset.carouselReady;
		});
	};

	const render = (writeURL = false) => {
		const selected = inputs.filter(input => input.checked);
		const places = selected.filter(input => input.name === "lugar").map(input => input.value);
		const types = selected.filter(input => input.name === "experiencia").map(input => input.value);
		let visible = 0;
		for (const card of cards) {
			const destinations = card.dataset.destinations?.split(" ") ?? [];
			const experiences = card.dataset.experiences?.split(" ") ?? [];
			const matches = (!places.length || places.some(id => destinations.includes(id))) && (!types.length || types.some(id => experiences.includes(id)));
			if (!matches) { galleryCleanups.get(card)?.(); galleryCleanups.delete(card); }
			card.hidden = !matches;
			if (matches) { visible++; startGallery(card); }
		}
		if (count) count.textContent = selected.length ? `${visible} de ${cards.length} experiencias` : `${visible} experiencias por descubrir`;
		if (empty) empty.hidden = visible !== 0;
		for (const button of clearButtons) button.disabled = selected.length === 0;
		for (const filter of filters) {
			const number = selected.filter(input => input.name === filter.dataset.filter).length;
			const badge = filter.querySelector<HTMLElement>("[data-filter-count]");
			if (badge) { badge.hidden = number === 0; badge.textContent = String(number); }
		}
		if (active) {
			active.hidden = selected.length === 0;
			active.replaceChildren(...selected.map(input => {
				const button = document.createElement("button");
				button.type = "button";
				button.dataset.removeFilter = `${input.name}:${input.value}`;
				button.setAttribute("aria-label", `Quitar filtro ${input.dataset.label}`);
				button.append(document.createTextNode(input.dataset.label ?? input.value));
				const cross = document.createElement("span");
				cross.textContent = "×";
				cross.setAttribute("aria-hidden", "true");
				button.append(cross);
				return button;
			}));
		}
		if (writeURL) {
			const url = new URL(location.href);
			for (const key of ["lugar", "experiencia"]) {
				url.searchParams.delete(key);
				for (const input of selected.filter(input => input.name === key)) url.searchParams.append(key, input.value);
			}
			history.replaceState(history.state, "", url);
		}
	};
	const fitPanel = (filter: HTMLElement) => {
		const panel = filter.querySelector<HTMLElement>(".filter-panel");
		const fieldset = panel?.querySelector("fieldset");
		if (!panel || panel.hidden || !fieldset) return;
		const chrome = panel.offsetHeight - fieldset.offsetHeight;
		const available = Math.max(80, (window.visualViewport?.height ?? innerHeight) - panel.getBoundingClientRect().top - chrome - 16);
		fieldset.style.setProperty("--filter-available-height", `${available}px`);
	};
	const setOpen = (filter: HTMLElement, open: boolean) => {
		const toggle = filter.querySelector<HTMLButtonElement>(".filter-toggle");
		const panel = filter.querySelector<HTMLElement>(".filter-panel");
		if (!toggle || !panel) return;
		toggle.setAttribute("aria-expanded", String(open));
		panel.hidden = !open;
		if (open) {
			if (toggle.getBoundingClientRect().bottom > innerHeight - 240) toggle.scrollIntoView({ block: "center", behavior: "instant" });
			fitPanel(filter);
		}
	};
	const readURL = () => {
		const params = new URLSearchParams(location.search);
		const aliases: Record<string, string> = JSON.parse(root.dataset.destinationAliases ?? "{}");
		for (const input of inputs) input.checked = params.getAll(input.name)
			.map(value => input.name === "lugar" ? aliases[value] ?? value : value).includes(input.value);
		render(params.getAll("lugar").some(value => value in aliases));
	};
	readURL();
	for (const input of inputs) input.addEventListener("change", () => render(true), options);
	for (const button of clearButtons) button.addEventListener("click", () => {
		for (const input of inputs) input.checked = false;
		render(true);
		if (button.closest("[data-empty-results]")) filters[0]?.querySelector<HTMLButtonElement>(".filter-toggle")?.focus();
	}, options);
	active?.addEventListener("click", event => {
		const button = (event.target as Element).closest<HTMLButtonElement>("[data-remove-filter]");
		if (!button) return;
		const input = inputs.find(input => `${input.name}:${input.value}` === button.dataset.removeFilter);
		if (input) input.checked = false;
		render(true);
		(active.querySelector("button") ?? filters[0]?.querySelector<HTMLButtonElement>(".filter-toggle"))?.focus();
	}, options);
	for (const filter of filters) filter.querySelector(".filter-toggle")?.addEventListener("click", () => {
		const open = filter.querySelector(".filter-toggle")?.getAttribute("aria-expanded") !== "true";
		for (const other of filters) setOpen(other, other === filter && open);
	}, options);
	document.addEventListener("click", event => {
		for (const filter of filters) if (!filter.contains(event.target as Node)) setOpen(filter, false);
	}, options);
	document.addEventListener("keydown", event => {
		if (event.key !== "Escape") return;
		for (const filter of filters) {
			const toggle = filter.querySelector<HTMLButtonElement>(".filter-toggle");
			if (toggle?.getAttribute("aria-expanded") === "true") { setOpen(filter, false); toggle.focus(); }
		}
	}, options);
	root.addEventListener("focusout", event => {
		if (!event.relatedTarget) return;
		for (const filter of filters) if (filter.contains(event.target as Node) && !filter.contains(event.relatedTarget as Node)) setOpen(filter, false);
	}, options);
	window.addEventListener("popstate", readURL, options);
	window.addEventListener("resize", () => filters.forEach(fitPanel), options);
	window.addEventListener("scroll", () => filters.forEach(fitPanel), { ...options, passive: true });
	return () => {
		abort.abort();
		for (const cleanup of galleryCleanups.values()) cleanup();
		galleryCleanups.clear();
	};
}
