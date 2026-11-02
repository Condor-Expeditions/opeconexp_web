/** Use the same landing line as anchor navigation, including CSS scroll-margin. */
export function getActiveTourSection(
	sections: { id: string; top: number; scrollMarginTop: number }[],
	stickyBottom: number,
) {
	return [...sections].reverse().find(section =>
		section.top <= Math.max(stickyBottom + 16, section.scrollMarginTop) + 2,
	)?.id ?? sections[0]?.id;
}

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
		const toISODate = (d: Date) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
		const MONTHS = [
			"Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
			"Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre",
		];
		const formatTriggerLabel = (iso: string) => {
			const d = new Date(`${iso}T12:00:00`);
			if (Number.isNaN(d.getTime())) return "Seleccionar fecha";
			return `${d.getDate()} de ${MONTHS[d.getMonth()]}, ${d.getFullYear()}`;
		};

		const localDate = toISODate(today);
		date.min = localDate;
		const days = JSON.parse(inquiry.dataset.operatingDays ?? "[]") as number[];

		// Preseleccionar la próxima fecha operativa disponible
		const initialDate = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 12, 0, 0);
		if (days.length > 0) {
			for (let i = 0; i < 14; i++) {
				if (days.includes(initialDate.getDay())) break;
				initialDate.setDate(initialDate.getDate() + 1);
			}
		}
		if (!date.value) {
			date.value = toISODate(initialDate);
		}

		const datePickerBox = inquiry.querySelector<HTMLElement>("#date-picker-box");
		const dateTrigger = inquiry.querySelector<HTMLButtonElement>("#date-picker-trigger");
		const dateTriggerLabel = inquiry.querySelector<HTMLElement>("#date-trigger-label");
		const calendarPanel = inquiry.querySelector<HTMLElement>("#tour-calendar-panel");
		const calendarMonthLabel = inquiry.querySelector<HTMLElement>("#calendar-month-label");
		const calendarDaysGrid = inquiry.querySelector<HTMLElement>("#calendar-days-grid");
		const calendarPrevBtn = inquiry.querySelector<HTMLButtonElement>("#calendar-prev");
		const calendarNextBtn = inquiry.querySelector<HTMLButtonElement>("#calendar-next");

		let viewYear = initialDate.getFullYear();
		let viewMonth = initialDate.getMonth();

		const syncTriggerLabel = () => {
			if (dateTriggerLabel) {
				dateTriggerLabel.textContent = date.value ? formatTriggerLabel(date.value) : "Seleccionar fecha";
			}
		};

		const renderCalendar = () => {
			if (!calendarDaysGrid || !calendarMonthLabel) return;
			calendarMonthLabel.textContent = `${MONTHS[viewMonth]} ${viewYear}`;
			if (calendarPrevBtn) {
				calendarPrevBtn.disabled =
					viewYear < today.getFullYear() ||
					(viewYear === today.getFullYear() && viewMonth <= today.getMonth());
			}

			const firstDay = new Date(viewYear, viewMonth, 1);
			const startOffset = (firstDay.getDay() + 6) % 7; // Lunes = 0 ... Domingo = 6
			const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();

			let html = "";
			for (let i = 0; i < startOffset; i++) {
				html += '<span class="calendar-day is-empty" aria-hidden="true"></span>';
			}

			for (let dayNum = 1; dayNum <= daysInMonth; dayNum++) {
				const cellDate = new Date(viewYear, viewMonth, dayNum, 12, 0, 0);
				const cellISO = toISODate(cellDate);
				const isPast = cellISO < localDate;
				const isOperating = days.includes(cellDate.getDay());
				const isDisabled = isPast || !isOperating;
				const isToday = cellISO === localDate;
				const isSelected = cellISO === date.value;

				const classes = [
					"calendar-day",
					isToday ? "is-today" : "",
					isSelected ? "is-selected" : "",
					isDisabled ? "is-disabled" : "",
				].filter(Boolean).join(" ");

				html += `<button type="button" class="${classes}" data-date="${cellISO}" ${isDisabled ? "disabled" : ""} aria-pressed="${isSelected}" aria-label="${dayNum} de ${MONTHS[viewMonth]} ${viewYear}">${dayNum}</button>`;
			}

			calendarDaysGrid.innerHTML = html;
		};

		let togglePassengers = (_open?: boolean) => {};

		const toggleCalendar = (open?: boolean) => {
			if (!calendarPanel || !dateTrigger || !datePickerBox) return;
			const shouldOpen = open ?? calendarPanel.hidden;
			calendarPanel.hidden = !shouldOpen;
			dateTrigger.setAttribute("aria-expanded", String(shouldOpen));
			datePickerBox.classList.toggle("is-open", shouldOpen);
			if (shouldOpen) {
				togglePassengers(false);
				renderCalendar();
			}
		};

		const validateDate = () => {
			date.setCustomValidity("");
			if (!date.value) return;
			if (date.value < localDate) {
				date.setCustomValidity("Selecciona una fecha igual o posterior a hoy.");
				return;
			}
			const chosen = new Date(`${date.value}T12:00:00`);
			if (!days.includes(chosen.getDay())) date.setCustomValidity("Elige uno de los días habituales de operación indicados debajo del campo.");
		};

		syncTriggerLabel();
		renderCalendar();

		dateTrigger?.addEventListener("click", () => toggleCalendar(), options);

		calendarPrevBtn?.addEventListener("click", () => {
			viewMonth--;
			if (viewMonth < 0) {
				viewMonth = 11;
				viewYear--;
			}
			renderCalendar();
		}, options);

		calendarNextBtn?.addEventListener("click", () => {
			viewMonth++;
			if (viewMonth > 11) {
				viewMonth = 0;
				viewYear++;
			}
			renderCalendar();
		}, options);

		calendarDaysGrid?.addEventListener("click", (event) => {
			const target = (event.target as HTMLElement).closest<HTMLButtonElement>(".calendar-day:not([disabled])");
			if (!target || !target.dataset.date) return;
			date.value = target.dataset.date;
			validateDate();
			syncTriggerLabel();
			renderCalendar();
			toggleCalendar(false);
			date.dispatchEvent(new Event("change", { bubbles: true }));
		}, options);

		const passengersPickerBox = inquiry.querySelector<HTMLElement>("#passengers-picker-box");
		const passengersTrigger = inquiry.querySelector<HTMLButtonElement>("#passengers-picker-trigger");
		const passengersTriggerLabel = inquiry.querySelector<HTMLElement>("#passengers-trigger-label");
		const passengersPanel = inquiry.querySelector<HTMLElement>("#tour-passengers-panel");
		const passengersDoneBtn = inquiry.querySelector<HTMLButtonElement>("#passengers-done-btn");

		const adultsInput = inquiry.querySelector<HTMLInputElement>("#tour-adults");
		const seniorsInput = inquiry.querySelector<HTMLInputElement>("#tour-seniors");
		const childrenInput = inquiry.querySelector<HTMLInputElement>("#tour-children");
		const babiesInput = inquiry.querySelector<HTMLInputElement>("#tour-babies");

		const departureSelect = inquiry.querySelector<HTMLSelectElement>("#tour-departure");
		const departureBtns = inquiry.querySelectorAll<HTMLButtonElement>(".departure-toggle-btn");
		const customDepartureBtn = inquiry.querySelector<HTMLButtonElement>(".departure-custom-btn");
		const largeGroupWarning = inquiry.querySelector<HTMLElement>("#large-group-warning");
		const confirmLargeGroup = inquiry.querySelector<HTMLInputElement>("#confirm-large-group");

		const breakdownContainer = inquiry.querySelector<HTMLElement>("#summary-breakdown");
		const totalAmountEl = inquiry.querySelector<HTMLElement>("#summary-total-amount");

		const isPaid = inquiry.dataset.priceKind === "paid";
		const adultPrice = parseFloat(inquiry.dataset.adultPrice || "0") || 0;
		const seniorPrice = parseFloat(inquiry.dataset.seniorPrice || "0") || 0;
		const childPrice = parseFloat(inquiry.dataset.kidPrice || "0") || 0;

		togglePassengers = (open?: boolean) => {
			if (!passengersPanel || !passengersTrigger || !passengersPickerBox) return;
			const shouldOpen = open ?? passengersPanel.hidden;
			passengersPanel.hidden = !shouldOpen;
			passengersTrigger.setAttribute("aria-expanded", String(shouldOpen));
			passengersPickerBox.classList.toggle("is-open", shouldOpen);
			if (shouldOpen) {
				toggleCalendar(false);
			}
		};

		passengersTrigger?.addEventListener("click", () => togglePassengers(), options);
		passengersDoneBtn?.addEventListener("click", () => togglePassengers(false), options);

		document.addEventListener("click", (event) => {
			const target = event.target as Node;
			if (calendarPanel && !calendarPanel.hidden && datePickerBox && !datePickerBox.contains(target)) {
				toggleCalendar(false);
			}
			if (passengersPanel && !passengersPanel.hidden && passengersPickerBox && !passengersPickerBox.contains(target)) {
				togglePassengers(false);
			}
		}, options);

		document.addEventListener("keydown", (event) => {
			if (event.key === "Escape") {
				if (calendarPanel && !calendarPanel.hidden) {
					toggleCalendar(false);
					dateTrigger?.focus();
				}
				if (passengersPanel && !passengersPanel.hidden) {
					togglePassengers(false);
					passengersTrigger?.focus();
				}
			}
		}, options);

		date.addEventListener("change", () => {
			validateDate();
			syncTriggerLabel();
			if (date.value) {
				const d = new Date(`${date.value}T12:00:00`);
				if (!Number.isNaN(d.getTime())) {
					viewYear = d.getFullYear();
					viewMonth = d.getMonth();
					renderCalendar();
				}
			}
		}, options);
		date.addEventListener("input", () => {
			validateDate();
			syncTriggerLabel();
		}, options);

		const selectDepartureBtn = (targetBtn: HTMLButtonElement) => {
			departureBtns.forEach(btn => {
				btn.classList.remove("active");
				btn.setAttribute("aria-checked", "false");
			});
			targetBtn.classList.add("active");
			targetBtn.setAttribute("aria-checked", "true");
			const departureVal = targetBtn.dataset.departure || "";
			if (departureSelect) {
				departureSelect.value = departureVal;
			}
		};

		departureBtns.forEach(btn => {
			btn.addEventListener("click", () => selectDepartureBtn(btn), options);
		});

		const updatePassengersAndPricing = () => {
			const adults = Math.max(0, parseInt(adultsInput?.value || "0", 10) || 0);
			const seniors = Math.max(0, parseInt(seniorsInput?.value || "0", 10) || 0);
			const children = Math.max(0, parseInt(childrenInput?.value || "0", 10) || 0);
			const babies = Math.max(0, parseInt(babiesInput?.value || "0", 10) || 0);
			const total = adults + seniors + children + babies;

			// Actualizar texto del botón disparador
			if (passengersTriggerLabel) {
				if (!isPaid) {
					passengersTriggerLabel.textContent = `${adults} persona${adults !== 1 ? "s" : ""}`;
				} else if (total === 0) {
					passengersTriggerLabel.textContent = "Seleccionar viajeros";
				} else {
					const parts: string[] = [];
					if (adults > 0) parts.push(`${adults} Adulto${adults > 1 ? "s" : ""}`);
					if (seniors > 0) parts.push(`${seniors} 3ra edad`);
					if (children > 0) parts.push(`${children} Niño${children > 1 ? "s" : ""}`);
					if (babies > 0) parts.push(`${babies} Bebé${babies > 1 ? "s" : ""}`);

					if (parts.length <= 2) {
						passengersTriggerLabel.textContent = parts.join(", ");
					} else {
						passengersTriggerLabel.textContent = `${total} Viajeros (${parts.join(", ")})`;
					}
				}
			}

			// Validar más de 44 personas en transporte regular
			if (largeGroupWarning) {
				if ((adults + seniors + children) > 44) {
					largeGroupWarning.hidden = false;
				} else {
					largeGroupWarning.hidden = true;
					if (confirmLargeGroup) confirmLargeGroup.checked = false;
				}
			}

			// Regla de más de 10 personas para horario personalizado
			if (customDepartureBtn) {
				if (total > 10) {
					customDepartureBtn.hidden = false;
				} else {
					customDepartureBtn.hidden = true;
					if (customDepartureBtn.classList.contains("active")) {
						const firstBtn = inquiry.querySelector<HTMLButtonElement>(".departure-toggle-btn:not(.departure-custom-btn)");
						if (firstBtn) {
							selectDepartureBtn(firstBtn);
						}
					}
				}
			}

			// Actualizar desglose de precios y total estimado
			if (isPaid) {
				const adultSubtotal = adults * adultPrice;
				const seniorSubtotal = seniors * seniorPrice;
				const childSubtotal = children * childPrice;
				const grandTotal = adultSubtotal + seniorSubtotal + childSubtotal;

				if (breakdownContainer && totalAmountEl) {
					let breakdownHtml = "";
					if (adults > 0) {
						breakdownHtml += `<div class="summary-line"><span>${adults} Adulto${adults > 1 ? "s" : ""} ($${adultPrice} USD c/u)</span><strong>$${adultSubtotal}</strong></div>`;
					}
					if (seniors > 0) {
						breakdownHtml += `<div class="summary-line"><span>${seniors} Tercera edad ($${seniorPrice} USD c/u)</span><strong>$${seniorSubtotal}</strong></div>`;
					}
					if (children > 0) {
						breakdownHtml += `<div class="summary-line"><span>${children} Niño${children > 1 ? "s" : ""} ($${childPrice} USD c/u)</span><strong>$${childSubtotal}</strong></div>`;
					}
					if (babies > 0) {
						breakdownHtml += `<div class="summary-line"><span>${babies} Bebé${babies > 1 ? "s" : ""} (en brazos)</span><strong>Gratis</strong></div>`;
					}
					if (!breakdownHtml) {
						breakdownHtml = `<div class="summary-line"><span>Sin pasajeros seleccionados</span><strong>$0</strong></div>`;
					}
					breakdownContainer.innerHTML = breakdownHtml;
					totalAmountEl.textContent = `$${grandTotal} USD`;
				}

				// Actualizar total en el panel desplegable de pasajeros
				const panelTotalEl = inquiry.querySelector<HTMLElement>("#passengers-panel-total-amount");
				if (panelTotalEl) {
					panelTotalEl.textContent = `$${grandTotal} USD`;
				}

				// Actualizar precio en la cabecera del tour si hay más de 1 pasajero
				const topPriceStrong = inquiry.querySelector<HTMLElement>(".tour-price strong");
				const topPriceFrom = inquiry.querySelector<HTMLElement>(".tour-price .price-from");
				const topPriceCurrency = inquiry.querySelector<HTMLElement>(".tour-price .price-currency");
				if (topPriceStrong) {
					if (total > 1) {
						if (topPriceFrom) topPriceFrom.textContent = "Total estimado";
						topPriceStrong.textContent = `$${grandTotal}`;
						if (topPriceCurrency) topPriceCurrency.innerHTML = `USD <span>(${total} personas)</span>`;
					} else {
						if (topPriceFrom) topPriceFrom.textContent = "Desde";
						topPriceStrong.textContent = `$${adultPrice}`;
						if (topPriceCurrency) topPriceCurrency.innerHTML = `USD <span>/ persona</span>`;
					}
				}
			}
		};

		// Manejo de steppers (+ y -)
		const stepperBtns = inquiry.querySelectorAll<HTMLButtonElement>(".stepper-btn");
		stepperBtns.forEach(btn => {
			btn.addEventListener("click", () => {
				const targetId = btn.dataset.stepTarget;
				const dir = parseInt(btn.dataset.stepDir || "0", 10);
				const targetInput = targetId ? inquiry.querySelector<HTMLInputElement>(`#${targetId}`) : null;
				if (!targetInput) return;

				let current = parseInt(targetInput.value || "0", 10);
				if (isNaN(current)) current = 0;

				const maxVal = targetId === "tour-children" ? 20 : targetId === "tour-babies" ? 10 : 100;

				if (dir > 0) {
					if (targetId === "tour-adults" || targetId === "tour-seniors") {
						const adults = parseInt(adultsInput?.value || "0", 10) || 0;
						const seniors = parseInt(seniorsInput?.value || "0", 10) || 0;
						if ((adults + seniors) >= 44 && !confirmLargeGroup?.checked) {
							if (largeGroupWarning) largeGroupWarning.hidden = false;
							confirmLargeGroup?.focus();
							return;
						}
					}
					if (current < maxVal) targetInput.value = String(current + 1);
				} else {
					if (current > 0) targetInput.value = String(current - 1);
				}

				updatePassengersAndPricing();
				targetInput.dispatchEvent(new Event("input", { bubbles: true }));
				targetInput.dispatchEvent(new Event("change", { bubbles: true }));
			}, options);
		});

		[adultsInput, seniorsInput, childrenInput, babiesInput].forEach(inp => {
			if (!inp) return;
			const onValChange = () => {
				let val = parseInt(inp.value, 10);
				const max = inp.id === "tour-children" ? 20 : inp.id === "tour-babies" ? 10 : 100;
				if (!isNaN(val) && val > max) inp.value = String(max);
				if (!isNaN(val) && val < 0) inp.value = "0";
				updatePassengersAndPricing();
			};
			inp.addEventListener("input", onValChange, options);
			inp.addEventListener("change", onValChange, options);
		});

		if (confirmLargeGroup) {
			confirmLargeGroup.addEventListener("change", () => {
				confirmLargeGroup.setCustomValidity("");
			}, options);
		}

		updatePassengersAndPricing();

		form.addEventListener("submit", (event) => {
			validateDate();
			if (!form.reportValidity()) { event.preventDefault(); return; }

			const adults = Math.max(0, parseInt(adultsInput?.value || "0", 10) || 0);
			const seniors = Math.max(0, parseInt(seniorsInput?.value || "0", 10) || 0);
			const children = childrenInput ? Math.max(0, parseInt(childrenInput.value || "0", 10) || 0) : 0;
			const babies = babiesInput ? Math.max(0, parseInt(babiesInput.value || "0", 10) || 0) : 0;
			const total = adults + seniors + children + babies;

			if (total === 0) {
				if (adultsInput) {
					adultsInput.setCustomValidity("Debe viajar al menos 1 pasajero.");
					adultsInput.reportValidity();
				}
				event.preventDefault();
				return;
			} else if (isPaid && adults === 0 && seniors === 0 && (children > 0 || babies > 0)) {
				if (adultsInput) {
					adultsInput.setCustomValidity("Los menores deben viajar acompañados por al menos un adulto o adulto mayor.");
					adultsInput.reportValidity();
				}
				event.preventDefault();
				return;
			} else if (adultsInput) {
				adultsInput.setCustomValidity("");
			}

			// Validar confirmación de más de 44 personas
			if ((adults + seniors + children) > 44 && confirmLargeGroup && !confirmLargeGroup.checked) {
				confirmLargeGroup.setCustomValidity("Por favor confirma que solicitas cotización para más de 44 personas.");
				confirmLargeGroup.reportValidity();
				event.preventDefault();
				return;
			}

			const activeBtn = inquiry.querySelector<HTMLButtonElement>(".departure-toggle-btn.active");
			const departure = activeBtn?.dataset.departure || departureSelect?.value || "";

			let departureMessage = `Horario de salida solicitado: ${departure}.`;
			if (departure === "Horario personalizado") {
				departureMessage = `Horario de salida solicitado: Horario personalizado (grupo privado de ${total} personas).`;
			}

			const formattedDate = new Intl.DateTimeFormat("es-EC", { dateStyle: "long" }).format(new Date(`${date.value}T12:00:00`));

			const messageLines = [
				`Hola, quisiera consultar una salida para ${inquiry.dataset.tourTitle} (${inquiry.dataset.tourId}).`,
				`Fecha propuesta: ${formattedDate}.`,
				departureMessage,
			];

			if (isPaid) {
				const passengerLines: string[] = [];
				if (adults > 0) passengerLines.push(`• ${adults} Adulto${adults > 1 ? "s" : ""} ($${adultPrice} c/u): $${adults * adultPrice} USD`);
				if (seniors > 0) passengerLines.push(`• ${seniors} Tercera edad ($${seniorPrice} c/u): $${seniors * seniorPrice} USD`);
				if (children > 0) passengerLines.push(`• ${children} Niño${children > 1 ? "s" : ""} (3–10 años, $${childPrice} c/u): $${children * childPrice} USD`);
				if (babies > 0) passengerLines.push(`• ${babies} Bebé${babies > 1 ? "s" : ""} (en brazos): Gratis`);

				const grandTotal = (adults * adultPrice) + (seniors * seniorPrice) + (children * childPrice);
				messageLines.push(`\nPasajeros (${total} en total):\n${passengerLines.join("\n")}`);
				messageLines.push(`Total estimado: $${grandTotal} USD.`);
			} else {
				messageLines.push(`Pasajeros: ${adults} personas.`);
				messageLines.push(`Modalidad: Tour a base de aporte voluntario.`);
			}

			messageLines.push("¿Podrían confirmarme disponibilidad, condiciones y tarifa aplicable? Entiendo que esta consulta no confirma una reserva.");

			const text = form.querySelector<HTMLInputElement>('input[name="text"]');
			if (text) text.value = messageLines.join("\n");
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
	const nav = root.querySelector<HTMLElement>(".tour-section-nav");
	let pendingSection: HTMLElement | undefined;
	let pendingUntil = 0;
	const setActive = (id: string | undefined) => {
		for (const link of navLinks) {
			if (link.hash === `#${id}`) {
				const changed = !link.hasAttribute("aria-current");
				link.setAttribute("aria-current", "location");
				// Keep the selected tab visible without scrolling the page vertically.
				if (changed && nav) {
					const bounds = nav.getBoundingClientRect();
					const tab = link.getBoundingClientRect();
					if (tab.left < bounds.left) nav.scrollBy({ left: tab.left - bounds.left - 4 });
					else if (tab.right > bounds.right) nav.scrollBy({ left: tab.right - bounds.right + 4 });
				}
			} else link.removeAttribute("aria-current");
		}
	};
	const markActive = () => {
		if (pendingSection && performance.now() < pendingUntil) {
			const landing = Number.parseFloat(getComputedStyle(pendingSection).scrollMarginTop) || 0;
			if (Math.abs(pendingSection.getBoundingClientRect().top - landing) > 2) {
				setActive(pendingSection.id);
				return;
			}
		}
		pendingSection = undefined;
		const stickyBottom = nav
			? (Number.parseFloat(getComputedStyle(nav).top) || 0) + nav.getBoundingClientRect().height
			: 0;
		setActive(getActiveTourSection(sections.map(section => ({
			id: section.id,
			top: section.getBoundingClientRect().top,
			scrollMarginTop: Number.parseFloat(getComputedStyle(section).scrollMarginTop) || 0,
		})), stickyBottom));
	};
	let frame = 0;
	const scheduleUpdate = () => {
		if (!frame) frame = requestAnimationFrame(() => { markActive(); frame = 0; });
	};
	const interruptNavigation = () => { pendingSection = undefined; scheduleUpdate(); };
	for (const link of navLinks) {
		link.addEventListener("click", event => {
			if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
			pendingSection = sections.find(section => `#${section.id}` === link.hash);
			pendingUntil = performance.now() + 2000;
			setActive(pendingSection?.id);
		}, options);
	}
	window.addEventListener("scroll", scheduleUpdate, { ...options, passive: true });
	window.addEventListener("scrollend", event => {
		if (event.target === document || event.target === window) interruptNavigation();
	}, options);
	window.addEventListener("wheel", interruptNavigation, { ...options, passive: true });
	window.addEventListener("touchstart", interruptNavigation, { ...options, passive: true });
	window.addEventListener("resize", interruptNavigation, options);
	window.addEventListener("hashchange", scheduleUpdate, options);
	window.addEventListener("keydown", event => {
		if (["ArrowUp", "ArrowDown", "PageUp", "PageDown", "Home", "End", " "].includes(event.key)) interruptNavigation();
	}, options);
	const layoutObserver = new ResizeObserver(scheduleUpdate);
	if (nav) layoutObserver.observe(nav);
	const story = root.querySelector(".tour-story");
	if (story) layoutObserver.observe(story);
	markActive();
	return () => { abort.abort(); cancelAnimationFrame(frame); inquiryObserver.disconnect(); layoutObserver.disconnect(); };
}
