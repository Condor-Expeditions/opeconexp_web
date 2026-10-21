export function initTourDetail() {
	const root = document.querySelector<HTMLElement>(".tour-detail");
	if (!root) return;
	const abort = new AbortController();
	const options = { signal: abort.signal };
	const inquiry = root.querySelector<HTMLElement>(".tour-inquiry");
	const form = inquiry?.querySelector<HTMLFormElement>("form");
	const date = inquiry?.querySelector<HTMLInputElement>("#tour-date");
	if (inquiry && form && date) {
		form.setAttribute("rel", "noopener noreferrer");
		const today = new Date();
		const localDate = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
		date.min = localDate;
		const days = JSON.parse(inquiry.dataset.operatingDays ?? "[]") as number[];
		const validateDate = () => {
			date.setCustomValidity("");
			if (!date.value) return;
			const chosen = new Date(`${date.value}T12:00:00`);
			if (!days.includes(chosen.getDay())) date.setCustomValidity("Elige uno de los días habituales de operación indicados debajo del campo.");
		};
		date.addEventListener("change", validateDate, options);
		form.addEventListener("submit", (event) => {
			validateDate();
			if (!form.reportValidity()) { event.preventDefault(); return; }
			const adults = inquiry.querySelector<HTMLSelectElement>("#tour-adults")?.value ?? "1";
			const children = inquiry.querySelector<HTMLSelectElement>("#tour-children")?.value;
			const departure = inquiry.querySelector<HTMLSelectElement>("#tour-departure")?.value;
			const formattedDate = new Intl.DateTimeFormat("es-EC", { dateStyle: "long" }).format(new Date(`${date.value}T12:00:00`));
			const message = [
				`Hola, quisiera consultar una salida para ${inquiry.dataset.tourTitle} (${inquiry.dataset.tourId}).`,
				`Fecha propuesta: ${formattedDate}.`,
				`Salida preferida: ${departure}.`,
				children === undefined ? `Personas: ${adults}.` : `Adultos: ${adults}. Niños: ${children} (edades por confirmar).`,
				"¿Podrían confirmarme disponibilidad, condiciones y tarifa aplicable? Entiendo que esta consulta no confirma una reserva.",
			].join("\n");
			const text = form.querySelector<HTMLInputElement>('input[name="text"]');
			if (text) text.value = message;
		}, options);
		form.hidden = false;
		const fallback = inquiry.querySelector<HTMLElement>(".inquiry-fallback");
		if (fallback) fallback.hidden = true;
	}
	const share = root.querySelector<HTMLButtonElement>("[data-tour-share]");
	if (share) {
		share.hidden = false;
		share.addEventListener("click", async () => {
			const url = location.origin + location.pathname;
			const title = root.querySelector("h1")?.textContent ?? "Condor Expeditions";
			const status = document.querySelector<HTMLElement>(".tour-share-status");
			try {
				if (navigator.share) await navigator.share({ title, url });
				else { await navigator.clipboard.writeText(url); if (status) status.textContent = "Enlace copiado. ¡Comparte la aventura!"; }
			} catch (error) {
				if (error instanceof DOMException && error.name === "AbortError") return;
				const fallback = document.querySelector<HTMLElement>(".tour-share-fallback");
				const input = fallback?.querySelector<HTMLInputElement>("input");
				if (fallback && input) { fallback.hidden = false; input.value = url; input.focus(); input.select(); }
			}
		}, options);
	}
	const navLinks = Array.from(root.querySelectorAll<HTMLAnchorElement>(".tour-section-nav a:not(.section-nav-cta)"));
	const inquiryObserver = new IntersectionObserver(([entry]) => {
		root.dataset.inquiryVisible = String(entry.isIntersecting);
	}, { rootMargin: "-160px 0px -80px 0px" });
	if (inquiry) inquiryObserver.observe(inquiry);
	const sections = navLinks.map(link => root.querySelector<HTMLElement>(link.hash)).filter((item): item is HTMLElement => !!item);
	const markActive = () => {
		const offset = innerWidth < 768 ? 155 : 180;
		const active = [...sections].reverse().find(section => section.getBoundingClientRect().top <= offset) ?? sections[0];
		for (const link of navLinks) {
			if (link.hash === `#${active?.id}`) link.setAttribute("aria-current", "location");
			else link.removeAttribute("aria-current");
		}
	};
	let frame = 0;
	window.addEventListener("scroll", () => {
		if (!frame) frame = requestAnimationFrame(() => { markActive(); frame = 0; });
	}, { ...options, passive: true });
	markActive();
	return () => { abort.abort(); cancelAnimationFrame(frame); inquiryObserver.disconnect(); };
}
