import assert from "node:assert/strict";
import test from "node:test";
import { getActiveTourSection } from "../src/components/sections/tour/tour-interactions.ts";

const sectionsAt = (top, margin = 176) => [
	{ id: "experiencia", top: top - 900, scrollMarginTop: margin },
	{ id: "itinerario", top, scrollMarginTop: margin },
	{ id: "incluye", top: top + 1100, scrollMarginTop: margin },
];

test("mobile: itinerary is active at its CSS anchor landing, not the old 155px cutoff", () => {
	assert.equal(getActiveTourSection(sectionsAt(176), 128), "itinerario");
});

test("desktop: accounts for sticky navigation and spacing", () => {
	assert.equal(getActiveTourSection(sectionsAt(176), 152), "itinerario");
});

test("manual scroll: previous section remains active until the next one reaches the landing line", () => {
	assert.equal(getActiveTourSection(sectionsAt(240), 128), "experiencia");
	assert.equal(getActiveTourSection(sectionsAt(178), 128), "itinerario");
	assert.equal(getActiveTourSection(sectionsAt(-100), 128), "itinerario");
	assert.equal(getActiveTourSection(sectionsAt(-924), 128), "incluye");
});

test("adapts to larger fonts, changed header height and CSS scroll margin", () => {
	assert.equal(getActiveTourSection(sectionsAt(216), 200), "itinerario");
	assert.equal(getActiveTourSection(sectionsAt(240, 240), 128), "itinerario");
});

test("before the content: first tab; missing sections: no selection", () => {
	assert.equal(getActiveTourSection([{ id: "experiencia", top: 900, scrollMarginTop: 176 }], 128), "experiencia");
	assert.equal(getActiveTourSection([], 128), undefined);
});
