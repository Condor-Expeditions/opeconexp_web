// Run against Astro dev/preview. Landscape must keep all ten cards in one rectangle.
import assert from "node:assert/strict";
const { chromium } = await import(process.env.PLAYWRIGHT_MODULE || "playwright");
const browser = await chromium.launch();
const page = await browser.newPage({ reducedMotion: "reduce" });
const base = process.env.BASE_URL || "http://localhost:4321";
try {
  for (const [width, height] of [[1920, 1080], [1440, 900], [1136, 690], [1024, 768], [844, 390]]) {
    await page.setViewportSize({ width, height });
    await page.goto(base, { waitUntil: "networkidle" });
    await page.locator("#menu-button").click();
    await page.waitForFunction(() => document.querySelector("#site-header").dataset.menuState === "open");
    await page.waitForTimeout(1000);
    const layout = await page.locator(".destination-grid").evaluate(grid => {
      const style = getComputedStyle(grid);
      const rect = grid.getBoundingClientRect();
      const columns = style.gridTemplateColumns.split(" ").length;
      const rows = style.gridTemplateRows.split(" ").length;
      const cards = [...grid.children].map(card => {
        const bounds = card.getBoundingClientRect();
        return { right: bounds.right, bottom: bounds.bottom };
      });
      const contentHeight = style.gridTemplateRows.split(" ").reduce((sum, row) => sum + parseFloat(row), 0)
        + parseFloat(style.rowGap) * (rows - 1);
      return { columns, rows, cards, right: rect.right, bottom: rect.top + contentHeight };
    });
    assert.equal(layout.cards.length, 10);
    assert.equal(layout.rows, layout.columns === 4 ? 4 : 5, `${width}: no implicit trailing row`);
    for (const card of layout.cards) {
      assert.ok(card.right <= layout.right + 1 && card.bottom <= layout.bottom + 1, `${width}: card inside mosaic`);
    }
    console.log(`PASS ${width}×${height}: ten destinations, ${layout.columns} columns, no trailing row`);
  }
} finally {
  await browser.close();
}
