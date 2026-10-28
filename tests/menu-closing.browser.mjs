// Astro preview required. Checks real animation frames, not reduced-motion snapshots.
import assert from "node:assert/strict";
const { chromium } = await import(process.env.PLAYWRIGHT_MODULE || "playwright");
const browser = await chromium.launch();
const base = process.env.BASE_URL || "http://localhost:4322";
const page = await browser.newPage({ reducedMotion: "no-preference" });
const errors = [];
page.on("pageerror", error => errors.push(error.message));
try {
  for (const [width, height] of [[1536, 1245], [1440, 900], [844, 390], [390, 844]]) {
    await page.setViewportSize({ width, height });
    await page.goto(base, { waitUntil: "networkidle" });
    await page.evaluate(() => window.scrollTo({ top: 450, behavior: "instant" }));
    const originalScroll = await page.evaluate(() => window.scrollY);
    for (const method of ["button", "Escape"]) {
      await page.locator("#menu-button").click();
      await page.waitForFunction(() => document.querySelector("#site-header").dataset.menuState === "open");
      // Wait for staggered entry transitions to finish before measuring exit.
      await page.waitForTimeout(650);
      await page.locator(".menu-destinations").evaluate(element => {
        element.scrollTop = element.scrollHeight;
      });
      const baseline = await page.locator(".menu-destinations").evaluate(element => ({
        scroll: element.scrollTop,
        scrollHeight: element.scrollHeight,
        width: element.clientWidth,
        top: element.querySelector(".destination").getBoundingClientRect().top,
      }));
      await page.evaluate(() => {
        window.closingFrames = [];
        const sample = () => {
          const state = document.querySelector("#site-header").dataset.menuState;
          const element = document.querySelector(".menu-destinations");
          if (state === "closing") window.closingFrames.push({
            scroll: element.scrollTop,
            scrollHeight: element.scrollHeight,
            width: element.clientWidth,
            top: element.querySelector(".destination").getBoundingClientRect().top,
            overflow: getComputedStyle(element).overflowY,
          });
          if (state !== "closed") requestAnimationFrame(sample);
        };
        requestAnimationFrame(sample);
      });
      if (method === "Escape") await page.keyboard.press("Escape");
      else await page.locator("#menu-button").click();
      await page.waitForFunction(() => document.querySelector("#site-header").dataset.menuState === "closed");
      const frames = await page.evaluate(() => window.closingFrames);
      assert.ok(frames.length > 5, "Measures the animated closing interval");
      for (const frame of frames) {
        assert.ok(Math.abs(frame.top - baseline.top) < 1, `${width}: mosaic does not move`);
        assert.equal(frame.scroll, baseline.scroll, `${width}: gallery scroll is preserved`);
        assert.equal(frame.scrollHeight, baseline.scrollHeight, `${width}: no transformed overflow`);
        assert.equal(frame.width, baseline.width, `${width}: no scrollbar layout shift`);
        assert.equal(frame.overflow, "hidden");
      }
      assert.equal(await page.evaluate(() => window.scrollY), originalScroll);
      assert.equal(await page.locator("body").evaluate(element => element.style.position), "");
      assert.equal(await page.locator("#fullscreen-menu").evaluate(element => element.inert), true);
    }
    console.log(`PASS menu close ${width}×${height}: button, Escape, stable scrolled mosaic and restored page`);
  }
  assert.deepEqual(errors, []);
} finally { await browser.close(); }
