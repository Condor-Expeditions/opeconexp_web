// Run against Astro preview. External navigation is intercepted; no inquiry is sent.
import assert from "node:assert/strict";
const { chromium } = await import(process.env.PLAYWRIGHT_MODULE || "playwright");
const base = process.env.BASE_URL || "http://localhost:4322";
const browser = await chromium.launch();
const page = await browser.newPage({ reducedMotion: "reduce" });
const errors = [];
page.on("pageerror", error => errors.push(error.message));
try {
  for (const route of ["/", "/sobre-nosotros/", "/contacto/"]) {
    for (const width of [1440, 768, 390, 360]) {
      await page.setViewportSize({ width, height: 900 });
      await page.goto(`${base}${route}`, { waitUntil: "networkidle" });
      assert.equal(await page.locator("main").count(), 1);
      assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false, `${route}: overflow at ${width}`);
    }
  }
  await page.goto(base, { waitUntil: "networkidle" });
  await page.locator("#places-title").scrollIntoViewIfNeeded();
  await page.waitForFunction(() => document.querySelector("#site-header").dataset.pastHero === "true");
  await page.waitForFunction(() => getComputedStyle(document.querySelector("#menu-button")).color === "rgb(0, 0, 0)");
  assert.equal(await page.locator("body").evaluate(element => getComputedStyle(element).backgroundColor), "rgb(255, 255, 255)");
  await page.locator(".info-faq summary").first().click();
  assert.equal(await page.locator(".info-faq details").first().getAttribute("open"), "");
  await page.goto(`${base}/contacto/`, { waitUntil: "networkidle" });
  assert.equal(await page.locator("[data-contact-form]").isVisible(), true);
  await page.locator("#contact-name").fill("María & José");
  await page.locator("#contact-tour").selectOption({ label: "Free Walking Tour de Cuenca" });
  await page.locator("#contact-travelers").fill("0");
  assert.equal(await page.locator("[data-contact-form]").evaluate(form => form.checkValidity()), false);
  await page.locator("#contact-travelers").fill("3");
  await page.locator("#contact-message").fill("¿Cuál es el punto de encuentro?");
  const requestPromise = page.waitForRequest(request => request.url().startsWith("https://wa.me/"));
  await page.route("https://wa.me/**", route => route.fulfill({ body: "Intercepted test only" }));
  await page.getByRole("button", { name: "Continuar en WhatsApp" }).click();
  const request = await requestPromise;
  const message = new URL(request.url()).searchParams.get("text");
  for (const text of ["María & José", "Free Walking Tour de Cuenca", "Personas: 3", "¿Cuál es el punto de encuentro?", "no confirma una reserva"]) assert.ok(message.includes(text));
  const noJS = await browser.newPage({ javaScriptEnabled: false });
  await noJS.goto(`${base}/contacto/`);
  assert.equal(await noJS.locator("[data-contact-form]").isVisible(), false);
  assert.equal(await noJS.locator("noscript .info-button").isVisible(), true);
  await noJS.close();
  assert.deepEqual(errors, []);
  console.log("PASS information pages: responsive layouts, FAQ, contact validation, encoded WhatsApp message and no-JS fallback");
} finally { await browser.close(); }
