// Run against Astro dev or preview. No external links are followed.
import assert from "node:assert/strict";
const { chromium } = await import(process.env.PLAYWRIGHT_MODULE || "playwright");
const base = process.env.BASE_URL || "http://localhost:4321";
const browser = await chromium.launch();
const page = await browser.newPage({ reducedMotion: "reduce" });
const errors = [];
page.on("pageerror", error => errors.push(error.message));
try {
  for (const [width, height] of [[1440, 900], [1024, 768], [844, 390], [820, 900], [768, 900], [390, 844], [360, 800], [320, 700]]) {
    await page.setViewportSize({ width, height });
    await page.goto(`${base}/bio/`, { waitUntil: "networkidle" });
    assert.equal(await page.locator("main").count(), 1);
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false, `Overflow at ${width}`);
    for (const selector of ["body", ".link-card", ".brand"]) {
      assert.equal(await page.locator(selector).evaluate(el => getComputedStyle(el).backgroundColor), "rgb(255, 255, 255)");
    }
    assert.equal(await page.locator(".link-page").evaluate(el => getComputedStyle(el).backgroundImage), "none");
    assert.equal(await page.locator("h1 em").evaluate(el => getComputedStyle(el).color), "rgb(219, 13, 0)");
    assert.equal(await page.locator(".social-links a").count(), 3);
    assert.match(await page.locator(".featured").getAttribute("href"), /^https:\/\/wa\.me\//);
    assert.equal(await page.locator(".footer-registration").evaluate(el => getComputedStyle(el).borderTopWidth), "0px");
    const header = await page.locator("article > header").boundingBox();
    const content = await page.locator(".content").boundingBox();
    if (width >= 820) {
      assert.ok(content.x >= header.x + header.width - 1, `Two columns at ${width}`);
      assert.ok(Math.abs(content.y - header.y) < 1, `Aligned columns at ${width}`);
      assert.ok(await page.locator(".link-card").evaluate(el => el.clientWidth) > width * .7);
    } else {
      assert.ok(content.y >= header.y + header.height - 1, `Stacked layout at ${width}`);
    }
  }
  await page.keyboard.press("Tab");
  assert.equal(await page.locator(".brand").evaluate(el => el === document.activeElement), true);
  assert.deepEqual(errors, []);
  console.log("PASS bio: responsive layout, brand colors, no decorative lines, links and keyboard access");
} finally {
  await browser.close();
}
