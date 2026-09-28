import { expect, test } from "@playwright/test";

const ES_URL = "/destinos/parque-nacional-el-cajas";
const EN_URL = "/en/destinos/ingapirca";

const SECTION_ORDER = [
	"dest-galeria",
	"dest-detalles",
	"dest-cart",
	"dest-experiencia",
	"dest-datos",
	"dest-incluye",
	"dest-encuentro",
	"dest-recomendaciones",
	"dest-itinerario",
	"dest-faq",
	"dest-reviews",
	"dest-mapa",
];

test.describe("Destination dynamic page (ES)", () => {
	test("renders sections in the specified order", async ({ page }) => {
		await page.goto(ES_URL);
		await expect(page.locator("h1").first()).toContainText("Cajas");

		const order = await page.evaluate(() => {
			const els = Array.from(
				document.querySelectorAll("[data-testid^='dest-']"),
			);
			return els.map((el) => el.getAttribute("data-testid"));
		});
		// All expected sections exist, in DOM order
		let lastIndex = -1;
		for (const id of SECTION_ORDER) {
			const idx = order.indexOf(id);
			expect(idx, `section ${id} exists`).toBeGreaterThan(-1);
			expect(idx, `section ${id} in order`).toBeGreaterThan(lastIndex);
			lastIndex = idx;
		}
	});

	test("timeline shows descriptions and durations (key unification)", async ({
		page,
	}) => {
		await page.goto(ES_URL);
		const descs = page.locator("[data-testid='dest-itinerario'] .timeline-desc");
		expect(await descs.count()).toBeGreaterThan(0);
		await expect(descs.first()).not.toBeEmpty();
		await expect(
			page.locator("[data-testid='dest-itinerario'] .timeline-duration").first(),
		).toContainText("Duración");
	});

	test("details show real duration (not difficulty)", async ({ page }) => {
		await page.goto(ES_URL);
		await expect(page.locator("[data-testid='dest-detalles']")).toContainText(
			"Día completo",
		);
	});

	test("gallery has no broken images", async ({ page }) => {
		await page.goto(ES_URL);
		const imgs = page.locator("[data-testid='dest-galeria'] .gallery-item img");
		expect(await imgs.count()).toBeGreaterThan(0);
		const srcs = await imgs.evaluateAll((nodes) =>
			nodes.map((n) => n.getAttribute("src")),
		);
		for (const src of srcs) {
			expect(src, "gallery img src").toBeTruthy();
		}
	});

	test("map embed and meeting point link exist", async ({ page }) => {
		await page.goto(ES_URL);
		const iframe = page.locator("[data-testid='dest-mapa'] iframe");
		await expect(iframe).toBeVisible();
		expect(await iframe.getAttribute("src")).toContain("maps.google.com");
		const mapsLink = page.locator(
			"[data-testid='dest-encuentro'] a[target='_blank']",
		);
		await expect(mapsLink.first()).toHaveAttribute("href", /google\.com\/maps/);
		await expect(page.locator("[data-testid='dest-encuentro']")).toContainText(
			/15 minutos/i,
		);
	});
});

test.describe("Destination cart (ES)", () => {
	test("pricing: adult full, child 10%/$2 (max), baby free", async ({
		page,
	}) => {
		await page.goto(ES_URL);
		const cart = page.getByTestId("dest-cart");
		const total = cart.locator("[data-cart-total]");

		// 1 adult (Cajas adulto = $25, es-EC formats decimals with comma)
		await cart.locator("[data-qty='adults'] [data-inc]").click();
		await expect(total).toContainText("25,00");
		await expect(cart.locator("[data-traveler='0']")).toBeVisible();

		// +1 child (3-10: $22.50 − max(10%, $2) = $20.50) → $45.50
		await cart.locator("[data-qty='children'] [data-inc]").click();
		await expect(total).toContainText("45,50");

		// +1 baby (free) → unchanged
		await cart.locator("[data-qty='babies'] [data-inc]").click();
		await expect(total).toContainText("45,50");
	});

	test("validation blocks submit until required fields + WhatsApp", async ({
		page,
	}) => {
		await page.goto(ES_URL);
		const cart = page.getByTestId("dest-cart");
		await cart.locator("[data-qty='adults'] [data-inc]").click();

		await cart.getByTestId("dest-cart-submit").click();
		const status = cart.locator("[data-cart-status]");
		await expect(status).toBeVisible();
		await expect(status).toContainText(/WhatsApp/i);
	});

	test("successful booking saves to localStorage and opens WhatsApp", async ({
		page,
	}) => {
		await page.goto(ES_URL);
		const cart = page.getByTestId("dest-cart");
		await cart.locator("[data-qty='adults'] [data-inc]").click();

		await cart.locator("[name='traveler_0_name']").fill("Juan Pérez");
		await cart.locator("[name='traveler_0_doc']").fill("0102030405");
		await cart.locator("[name='traveler_0_birth']").fill("1990-05-01");
		await cart.locator("[name='buyerEmail']").fill("juan@example.com");
		await cart.locator("[name='buyerPhone']").fill("0995900614");
		await cart.locator("[name='whatsapp']").check();

		const [popup] = await Promise.all([
			page.waitForEvent("popup"),
			cart.getByTestId("dest-cart-submit").click(),
		]);
		// wa.me redirects to api.whatsapp.com — assert phone + payload survive
		expect(popup.url()).toContain("593995900614");
		expect(popup.url()).toMatch(/text=|phone=/);
		expect(popup.url()).toContain("Juan");

		const stored = await page.evaluate(() =>
			JSON.parse(localStorage.getItem("coexp_cart_destinations") || "[]"),
		);
		expect(stored).toHaveLength(1);
		expect(stored[0].slug).toBe("parque-nacional-el-cajas");
		expect(stored[0].buyer.whatsapp).toBe(true);
		expect(stored[0].travelers[0].name).toBe("Juan Pérez");
	});
});

test.describe("Destination dynamic page (EN)", () => {
	test("renders cart in English and key sections", async ({ page }) => {
		await page.goto(EN_URL);
		await expect(page.locator("h1").first()).toContainText("Ingapirca");
		await expect(page.getByTestId("dest-cart")).toContainText("Book your tour");
		for (const id of ["dest-detalles", "dest-itinerario", "dest-faq", "dest-reviews", "dest-mapa"]) {
			await expect(page.getByTestId(id)).toBeVisible();
		}
	});
});

test.describe("Destination cart layout", () => {
	test("desktop: cart is sticky in right column", async ({ page }) => {
		await page.setViewportSize({ width: 1400, height: 900 });
		await page.goto(ES_URL);
		const position = await page
			.getByTestId("dest-cart")
			.evaluate((el) => getComputedStyle(el).position);
		expect(position).toBe("sticky");
	});

	test("mobile: cart toggle visible, panel collapsed", async ({ page }) => {
		await page.setViewportSize({ width: 390, height: 844 });
		await page.goto(ES_URL);
		await expect(page.locator("[data-cart-toggle]")).toBeVisible();
		const panelBox = await page
			.locator(".dest-cart-panel")
			.evaluate((el) => el.getBoundingClientRect().top);
		expect(panelBox).toBeGreaterThan(844);
	});
});
