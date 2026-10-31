/** Preserve catalog context without changing scroll behavior on other routes. */
const storageKey = "tour-catalog-return";
type CatalogPosition = { url: string; x: number; y: number };
const isCatalog = (url: URL) => url.pathname.replace(/\/$/, "") === "/tours";
let position: CatalogPosition | undefined;
let pending: CatalogPosition | undefined;

try {
	const saved = JSON.parse(sessionStorage.getItem(storageKey) ?? "null");
	if (saved && typeof saved.url === "string" && Number.isFinite(saved.x) && Number.isFinite(saved.y)) {
		const url = new URL(saved.url, location.origin);
		if (url.origin === location.origin && isCatalog(url)) position = saved;
	}
} catch { /* Storage may be unavailable; in-memory restoration still works. */ }

const save = (url: URL) => {
	position = { url: url.pathname + url.search + url.hash, x: scrollX, y: scrollY };
	try { sessionStorage.setItem(storageKey, JSON.stringify(position)); } catch { /* Optional persistence. */ }
};

const updateReturnLink = () => {
	const link = document.querySelector<HTMLAnchorElement>("[data-catalog-return]");
	if (link && position) link.href = position.url;
};

document.addEventListener("astro:before-preparation", event => {
	pending = undefined;
	if (isCatalog(event.from)) save(event.from);
	if (!isCatalog(event.to) || event.to.hash) return;
	if (event.navigationType === "traverse") {
		// Astro's target history entry is already active. Restore again after filters initialize.
		const state = history.state;
		if (Number.isFinite(state?.scrollY)) {
			pending = { url: event.to.pathname + event.to.search, x: state.scrollX ?? 0, y: state.scrollY };
		}
	} else if (event.sourceElement?.closest("[data-catalog-return]") && position) {
		pending = position;
	}
});

document.addEventListener("astro:page-load", () => {
	updateReturnLink();
	if (!pending || !document.querySelector("[data-tour-catalog]")) return;
	const target = pending;
	pending = undefined;
	// Catalog initialization exposes filters and can change the document height.
	requestAnimationFrame(() => {
		if (location.pathname + location.search !== target.url) return;
		window.scrollTo({ left: target.x, top: target.y, behavior: "instant" });
	});
});

window.addEventListener("pagehide", () => {
	const url = new URL(location.href);
	if (isCatalog(url)) save(url);
});

updateReturnLink();
