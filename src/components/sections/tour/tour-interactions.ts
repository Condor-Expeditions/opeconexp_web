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

		const toggleCalendar = (open?: boolean) => {
			if (!calendarPanel || !dateTrigger || !datePickerBox) return;
			const shouldOpen = open ?? calendarPanel.hidden;
			calendarPanel.hidden = !shouldOpen;
			dateTrigger.setAttribute("aria-expanded", String(shouldOpen));
			datePickerBox.classList.toggle("is-open", shouldOpen);
			if (shouldOpen) {
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

		document.addEventListener("click", (event) => {
			if (!calendarPanel || calendarPanel.hidden || !datePickerBox) return;
			if (!datePickerBox.contains(event.target as Node)) {
				toggleCalendar(false);
			}
		}, options);

		document.addEventListener("keydown", (event) => {
			if (event.key === "Escape" && calendarPanel && !calendarPanel.hidden) {
				toggleCalendar(false);
				dateTrigger?.focus();
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

		const adultsInput = inquiry.querySelector<HTMLInputElement>("#tour-adults");
		const childrenInput = inquiry.querySelector<HTMLInputElement>("#tour-children");
		const departureSelect = inquiry.querySelector<HTMLSelectElement>("#tour-departure");
		const departureBtns = inquiry.querySelectorAll<HTMLButtonElement>(".departure-toggle-btn");
		const customDepartureBtn = inquiry.querySelector<HTMLButtonElement>(".departure-custom-btn");
		const largeGroupWarning = inquiry.querySelector<HTMLElement>("#large-group-warning");
		const confirmLargeGroup = inquiry.querySelector<HTMLInputElement>("#confirm-large-group");
		const childrenAgesContainer = inquiry.querySelector<HTMLElement>("#children-ages-container");

		const checkGroupSizeAndSchedule = () => {
			const adults = Math.max(0, parseInt(adultsInput?.value || "0", 10) || 0);
			const children = Math.max(0, parseInt(childrenInput?.value || "0", 10) || 0);
			const total = adults + children;

			// Validar más de 44 adultos
			if (largeGroupWarning) {
				if (adults > 44) {
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
						// Si estaba activo el personalizado y baja de 10 personas, volver al primer horario
						const firstBtn = inquiry.querySelector<HTMLButtonElement>(".departure-toggle-btn:not(.departure-custom-btn)");
						if (firstBtn) {
							selectDepartureBtn(firstBtn);
						}
					}
				}
			}
		};

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

				if (targetId === "tour-adults") {
					if (dir > 0) {
						if (current >= 44 && !confirmLargeGroup?.checked) {
							if (largeGroupWarning) largeGroupWarning.hidden = false;
							confirmLargeGroup?.focus();
							return;
						}
						if (current < 100) targetInput.value = String(current + 1);
					} else {
						if (current > 0) targetInput.value = String(current - 1);
					}
				} else if (targetId === "tour-children") {
					if (dir > 0) {
						if (current < 20) targetInput.value = String(current + 1);
					} else {
						if (current > 0) targetInput.value = String(current - 1);
					}
				}

				targetInput.dispatchEvent(new Event("input", { bubbles: true }));
				targetInput.dispatchEvent(new Event("change", { bubbles: true }));
			}, options);
		});

		// Inputs de edades para niños (1 a 4 niños validados de 0 a 11 años)
		const updateChildrenAges = () => {
			if (!childrenAgesContainer || !childrenInput) return;
			const count = parseInt(childrenInput.value || "0", 10) || 0;

			// Guardar valores previos si existen
			const prevValues: string[] = [];
			childrenAgesContainer.querySelectorAll<HTMLInputElement>(".child-age-input").forEach(inp => {
				prevValues.push(inp.value);
			});

			if (count <= 0) {
				childrenAgesContainer.hidden = true;
				childrenAgesContainer.innerHTML = "";
			} else if (count >= 1 && count <= 4) {
				childrenAgesContainer.hidden = false;
				let html = '<p class="ages-title">Edades de los niños (0 a 11 años):</p><div class="ages-grid">';
				for (let i = 1; i <= count; i++) {
					const val = prevValues[i - 1] ?? "";
					html += `
						<div class="age-field">
							<label for="child-age-${i}">Niño ${i}</label>
							<div class="age-input-row">
								<input type="number" id="child-age-${i}" class="child-age-input" min="0" max="11" placeholder="Edad" value="${val}" required />
								<span>años</span>
							</div>
						</div>
					`;
				}
				html += "</div>";
				childrenAgesContainer.innerHTML = html;

				// Añadir validación individual de 0 a 11 años
				childrenAgesContainer.querySelectorAll<HTMLInputElement>(".child-age-input").forEach(input => {
					input.addEventListener("input", () => {
						const val = parseInt(input.value, 10);
						if (isNaN(val) || val < 0 || val > 11) {
							input.setCustomValidity("La edad debe estar comprendida entre 0 y 11 años.");
						} else {
							input.setCustomValidity("");
						}
					}, options);
				});
			} else {
				// Más de 4 niños
				childrenAgesContainer.hidden = false;
				childrenAgesContainer.innerHTML = '<p class="ages-notice">Para grupos de más de 4 niños, coordinaremos las edades y tarifas directamente por WhatsApp.</p>';
			}
		};

		if (adultsInput) {
			adultsInput.addEventListener("input", () => {
				let val = parseInt(adultsInput.value, 10);
				if (!isNaN(val) && val > 100) adultsInput.value = "100";
				if (!isNaN(val) && val < 0) adultsInput.value = "0";
				checkGroupSizeAndSchedule();
			}, options);
		}

		if (childrenInput) {
			childrenInput.addEventListener("input", () => {
				let val = parseInt(childrenInput.value, 10);
				if (!isNaN(val) && val < 0) childrenInput.value = "0";
				checkGroupSizeAndSchedule();
				updateChildrenAges();
			}, options);
		}

		if (confirmLargeGroup) {
			confirmLargeGroup.addEventListener("change", () => {
				confirmLargeGroup.setCustomValidity("");
			}, options);
		}

		form.addEventListener("submit", (event) => {
			validateDate();
			if (!form.reportValidity()) { event.preventDefault(); return; }

			const adults = Math.max(0, parseInt(adultsInput?.value || "0", 10) || 0);
			const children = childrenInput ? Math.max(0, parseInt(childrenInput.value || "0", 10) || 0) : undefined;
			const total = adults + (children ?? 0);

			if (total === 0) {
				if (adultsInput) {
					adultsInput.setCustomValidity("Debe viajar al menos 1 pasajero.");
					adultsInput.reportValidity();
				}
				event.preventDefault();
				return;
			} else if (adultsInput) {
				adultsInput.setCustomValidity("");
			}

			// Validar confirmación de más de 44 adultos
			if (adults > 44 && confirmLargeGroup && !confirmLargeGroup.checked) {
				confirmLargeGroup.setCustomValidity("Por favor confirma que solicitas cotización para más de 44 personas.");
				confirmLargeGroup.reportValidity();
				event.preventDefault();
				return;
			}

			// Validar edades de niños (0 a 11)
			if (children && children >= 1 && children <= 4 && childrenAgesContainer) {
				const ageInputs = childrenAgesContainer.querySelectorAll<HTMLInputElement>(".child-age-input");
				for (const input of ageInputs) {
					const val = parseInt(input.value, 10);
					if (isNaN(val) || val < 0 || val > 11) {
						input.setCustomValidity("La edad del niño debe estar entre 0 y 11 años.");
						input.reportValidity();
						event.preventDefault();
						return;
					}
					input.setCustomValidity("");
				}
			}

			const activeBtn = inquiry.querySelector<HTMLButtonElement>(".departure-toggle-btn.active");
			const departure = activeBtn?.dataset.departure || departureSelect?.value || "";

			let departureMessage = `Horario de salida solicitado: ${departure}.`;
			if (departure === "Horario personalizado") {
				departureMessage = `Horario de salida solicitado: Horario personalizado (grupo privado de ${total} personas).`;
			}

			let passengersMessage = `Personas: ${adults}.`;
			if (children !== undefined) {
				if (children === 0) {
					passengersMessage = `Adultos: ${adults}. Niños: 0.`;
				} else if (children >= 1 && children <= 4 && childrenAgesContainer) {
					const ageInputs = childrenAgesContainer.querySelectorAll<HTMLInputElement>(".child-age-input");
					const ages = Array.from(ageInputs).map(inp => `${inp.value} años`);
					const agesStr = ages.length === 1 ? ages[0] : `${ages.slice(0, -1).join(", ")} y ${ages[ages.length - 1]}`;
					passengersMessage = `Adultos: ${adults}. Niños: ${children} (edades: ${agesStr}).`;
				} else {
					passengersMessage = `Adultos: ${adults}. Niños: ${children} (edades a coordinar por WhatsApp).`;
				}
			}

			const formattedDate = new Intl.DateTimeFormat("es-EC", { dateStyle: "long" }).format(new Date(`${date.value}T12:00:00`));
			const message = [
				`Hola, quisiera consultar una salida para ${inquiry.dataset.tourTitle} (${inquiry.dataset.tourId}).`,
				`Fecha propuesta: ${formattedDate}.`,
				departureMessage,
				passengersMessage,
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
