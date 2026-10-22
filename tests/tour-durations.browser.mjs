import assert from "node:assert/strict";
const { chromium } = await import(process.env.PLAYWRIGHT_MODULE || "playwright");
const base = process.env.BASE_URL || "http://localhost:4321";
const routes = ["cajas-al-descubierto", "cajas-de-laguna-a-lo-ancestral", "raices-ancestrales-del-ecuador", "pueblitos-magicos", "aventura-en-cuadron", "free-walking-tour-cuenca", "guachapala-entre-paisajes-y-tradicion"];
const browser = await chromium.launch();
try {
	const page = await browser.newPage({ viewport: { width: 390, height: 844 }, reducedMotion: "reduce" });
	const errors = [];
	page.on("pageerror", error => errors.push(error.message));
	for (const route of routes) {
		await page.goto(`${base}/tours/${route}/`, { waitUntil: "networkidle" });
		const text = await page.locator("main").innerText();
		assert.doesNotMatch(text, /\b\d{1,2}:\d{2}\b/);
		const labels = await page.locator(".timeline-duration").allTextContents();
		assert.ok(labels.length > 0);
		for (const label of labels) assert.match(label, /^(\d+ min|\d+ h( \d+ min)?|Por confirmar)$/);
		if (route.startsWith("guachapala")) {
			assert.deepEqual(labels, ["Por confirmar"]);
			assert.equal(await page.locator("#tour-departure").count(), 0);
		} else {
			const turns = await page.locator("#tour-departure option").allTextContents();
			assert.ok(turns.length > 0);
			for (const turn of turns) assert.match(turn, /^(Mañana|Tarde)$/);
			// Inspect the real submit handler without sending a WhatsApp request.
			await page.locator("form.inquiry-form").evaluate(form => form.addEventListener("submit", event => event.preventDefault()));
			await page.locator("#tour-date").fill("2099-01-07");
			await page.locator("#tour-departure").selectOption({ index: turns.length - 1 });
			await page.locator(".inquiry-submit").click();
			const message = await page.locator('input[name="text"]').inputValue();
			assert.ok(message.includes(`Turno preferido: ${turns.at(-1)}.`));
			assert.doesNotMatch(message, /\b\d{1,2}:\d{2}\b/);
		}
		console.log(`PASS ${route}: stage durations, no clock times, valid turn inquiry`);
	}
	assert.deepEqual(errors, []);
} finally {
	await browser.close();
}
