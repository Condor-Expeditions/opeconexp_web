import assert from "node:assert/strict";
const { chromium } = await import(process.env.PLAYWRIGHT_MODULE || "playwright");
const base = process.env.BASE_URL || "http://localhost:4321";
const routes = ["cajas-al-descubierto", "cajas-de-laguna-a-lo-ancestral", "raices-ancestrales-del-ecuador", "pueblitos-magicos", "aventura-en-cuadron", "free-walking-tour-cuenca", "guachapala-entre-paisajes-y-tradicion", "cascada-de-giron", "compras-y-artesanias", "raices-ancestrales-sigsig", "paute-dinosaurios-naturaleza-y-sabores"];
const browser = await chromium.launch();
try {
	const page = await browser.newPage({ viewport: { width: 390, height: 844 }, reducedMotion: "reduce" });
	const errors = [];
	page.on("pageerror", error => errors.push(error.message));
	for (const route of routes) {
		await page.goto(`${base}/tours/${route}/`, { waitUntil: "networkidle" });
		const timeline = await page.locator(".tour-timeline").innerText();
		assert.doesNotMatch(timeline, /\b\d{1,2}:\d{2}\b/);
		const labels = await page.locator(".timeline-duration").allTextContents();
		assert.ok(labels.length > 0);
		for (const label of labels) assert.match(label, /^(\d+ min|\d+ h( \d+ min)?|Por confirmar)$/);
		{
			const turns = await page.locator("#tour-departure option").allTextContents();
			assert.ok(turns.length > 0);
			const expected = route === "free-walking-tour-cuenca" ? ["Horario a convenir"]
				: ["cajas-al-descubierto", "compras-y-artesanias", "paute-dinosaurios-naturaleza-y-sabores"].includes(route) ? ["08:30", "14:00"] : ["08:30"];
			assert.deepEqual(turns, expected);
			const departureRow = page.locator(".tour-logistics > div").filter({ hasText: "Horarios de salida" });
			assert.equal(await departureRow.locator("dd").innerText(), expected.join(" / "));
			// Inspect the real submit handler without sending a WhatsApp request.
			await page.locator("form.inquiry-form").evaluate(form => form.addEventListener("submit", event => event.preventDefault()));
			await page.locator("#tour-date").fill("2099-01-09"); // Friday: all updated tours operate.
			await page.locator("#tour-departure").selectOption({ index: turns.length - 1 });
			await page.locator(".inquiry-submit").click();
			const message = await page.locator('input[name="text"]').inputValue();
			assert.ok(message.includes(`Horario de salida solicitado: ${turns.at(-1)}.`));
			assert.doesNotMatch(message, /Turno preferido:|Mañana|Tarde/);
		}
		console.log(`PASS ${route}: stage durations, departure times and matching WhatsApp inquiry`);
	}
	assert.deepEqual(errors, []);
} finally {
	await browser.close();
}
