import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

// Run after `pnpm build`: node --test tests/footer.test.mjs
const routes = ["", "tours", "ediciones", "sobre-nosotros", "contacto"];
const navigation = ["/", "/tours", "/sobre-nosotros", "/contacto"];

for (const route of routes) {
	test(`footer on /${route}: navigation, contact and shared social icons`, async () => {
		const html = await readFile(new URL(`../dist/${route ? `${route}/` : ""}index.html`, import.meta.url), "utf8");
		const footer = html.match(/<footer\b[\s\S]*?<\/footer>/)?.[0];
		assert.ok(footer, "Footer is present");
		assert.doesNotMatch(footer, /<form\b|<input\b|newsletter|primary-red/i);
		assert.doesNotMatch(footer, /footer-invitation|contact-cta|Hablemos por WhatsApp/);
		const cta = html.match(/<section class="contact-cta"[\s\S]*?<\/section>/)?.[0];
		if (route === "" || route === "sobre-nosotros") {
			assert.ok(cta, "CTA appears on the index and about page");
			assert.match(cta, /data-icon="brand-whatsapp"/, "WhatsApp CTA includes its icon");
			assert.ok(html.indexOf(cta) < html.indexOf(footer), "CTA is outside and before the footer");
		} else {
			assert.equal(cta, undefined, "CTA does not appear on other pages");
		}
		assert.match(footer, /class="footer-logo"[\s\S]*?width="443" height="338"/, "Use the complete condor and wordmark proportions");
		assert.match(footer, /https:\/\/wa\.me\/593995900614/);
		assert.match(footer, /href="tel:\+593995900614"/);
		assert.match(footer, /href="mailto:info@condorexpedition\.com"/);
		assert.match(footer, /https:\/\/maps\.app\.goo\.gl\//);
		assert.doesNotMatch(footer, /href="\/en\//, "Do not link to nonexistent translated routes");

		const nav = footer.match(/<nav\b[\s\S]*?<\/nav>/)?.[0];
		assert.ok(nav);
		for (const href of navigation) {
			assert.ok(nav.includes(`href="${href}"`), `Navigation includes ${href}`);
		}
		assert.doesNotMatch(nav, /href="\/ediciones"/);
		assert.equal((nav.match(/aria-current="page"/g) || []).length, route === "ediciones" ? 0 : 1);

		const header = html.match(/<header\b[\s\S]*?<\/header>/)?.[0];
		assert.doesNotMatch(header, /href="\/ediciones"/);
		const socialPattern = /<div class="social-links"[^>]*>([\s\S]*?)<\/div>/;
		const headerSocials = header?.match(socialPattern)?.[1];
		const footerSocials = footer.match(socialPattern)?.[1];
		assert.ok(headerSocials);
		assert.equal(footerSocials, headerSocials, "Menu and footer render identical social links and SVGs");
		assert.equal((footerSocials.match(/<svg\b/g) || []).length, 5);
	});
}

test("footer and social styles use theme tokens, not hardcoded colors", async () => {
	for (const path of ["../src/components/ui/footer/footer.css", "../src/components/shared/SocialLinks.astro", "../src/components/sections/index/ContactCTA.astro"]) {
		const source = await readFile(new URL(path, import.meta.url), "utf8");
		assert.doesNotMatch(source, /#[\da-f]{3,8}\b|\b(?:rgb|hsl)a?\(/i);
		assert.match(source, /var\(--color-rojo\)/);
		assert.match(source, /prefers-reduced-motion/);
		assert.match(source, /focus-visible/);
	}
});

test("footer refinements: readable headings and nearby arrows", async () => {
	const css = await readFile(new URL("../src/components/ui/footer/footer.css", import.meta.url), "utf8");
	assert.doesNotMatch(css, /--color-crema/);
	assert.match(css, /\.footer-eyebrow\s*\{[^}]*font-family: var\(--font-family-sans\)[^}]*font-size: \.875rem[^}]*font-weight: 700/);
	assert.match(css, /\.footer-navigation a\s*\{[^}]*width: fit-content/);
	assert.doesNotMatch(css, /margin-left: auto/);
});

test("index CTA preserves its red background and button hover", async () => {
	const source = await readFile(new URL("../src/components/sections/index/ContactCTA.astro", import.meta.url), "utf8");
	assert.match(source, /\.contact-cta\s*\{[^}]*background: var\(--color-rojo\)/);
	assert.match(source, /\.contact-cta-button:hover\s*\{[^}]*background: var\(--color-negro\)/);
});
