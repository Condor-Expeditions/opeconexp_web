import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import { allTours, publishedTours } from "./helpers/tour-data.mjs";
import { tourSeo } from "../src/data/tours/seo.ts";

const load = path => readFile(new URL(`../dist/${path}index.html`, import.meta.url), "utf8");
const text = html => html.replace(/<[^>]*>/g, "").replace(/&amp;/g, "&").replace(/\s+/g, " ").trim();
const graph = html => JSON.parse(html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)[1])["@graph"];

test("every editable tour, including disabled walking, has a 40–60-word direct answer and SEO metadata", () => {
  for (const tour of allTours) {
    const seo = tourSeo(tour);
    const words = seo.directAnswer.split(/\s+/).length;
    assert.ok(words >= 40 && words <= 60, `${tour.slug}: ${words} words`);
    assert.match(seo.title, /Cuenca/);
    assert.ok(seo.description.length > 60);
    assert.ok(seo.questions.length >= 6);
    assert.doesNotMatch(JSON.stringify(seo), /pendingReview|snapshot/);
  }
  const walking = allTours.find(tour => tour.slug === "free-walking-tour-cuenca");
  assert.equal(walking.enabled, false);
  assert.match(tourSeo(walking).directAnswer, /aporte al guía es voluntario/);
  assert.doesNotMatch(tourSeo(walking).directAnswer, /USD|anticipo del 50/);
});

test("home and catalog expose factual headings, direct answers and consistent canonical social URLs", async () => {
  for (const route of ["", "tours/"]) {
    const html = await load(route);
    assert.equal((html.match(/<h1\b/g) || []).length, 1);
    assert.match(text(html.match(/<h1\b[^>]*>[\s\S]*?<\/h1>/)[0]), /Cuenca/);
    const canonical = `https://condorexpedition.com/${route}`;
    assert.ok(html.includes(`<link rel="canonical" href="${canonical}">`));
    assert.ok(html.includes(`<meta property="og:url" content="${canonical}">`));
    assert.doesNotMatch(html, /name="keywords"/);
    const agency = graph(html).find(node => node["@type"] === "TravelAgency");
    assert.equal(agency.telephone, "+593995900614");
    assert.equal(agency.address.addressLocality, "Cuenca");
  }
});

test("published tour schemas match visible answers, prices and ordered itineraries", async () => {
  for (const tour of publishedTours) {
    const html = await load(`tours/${tour.slug}/`);
    const nodes = graph(html);
    const trip = nodes.find(node => node["@type"] === "TouristTrip");
    assert.equal(trip.description, tourSeo(tour).directAnswer);
    assert.equal(trip.name, text(html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/)[1]));
    assert.equal(trip.description, text(html.match(/<p class="tour-direct-answer">([\s\S]*?)<\/p>/)[1]));
    assert.equal(trip.itinerary.itemListElement.length, tour.itinerary.length);
    if (tour.price.kind === "paid" && !tour.provisional) assert.equal(trip.offers.priceSpecification.minPrice, tour.price.adult);
    else assert.equal(trip.offers, undefined);
    const faq = nodes.find(node => node["@type"] === "FAQPage");
    const section = html.match(/<section id="preguntas"[\s\S]*?<\/section>/)[0];
    const visible = text(section);
    for (const question of faq.mainEntity) {
      assert.ok(visible.includes(question.name));
      assert.ok(visible.includes(question.acceptedAnswer.text));
    }
    assert.doesNotMatch(JSON.stringify(nodes), /InStock|AggregateRating|pendingReview|priceValidUntil/);
  }
});

test("home FAQ schema mirrors visible content, including the non-bookable walking explanation", async () => {
  const html = await load("");
  const section = text(html.match(/<section[^>]*aria-labelledby="faq-title"[\s\S]*?<\/section>/)[0]);
  const faq = graph(html).find(node => node["@type"] === "FAQPage");
  for (const question of faq.mainEntity) {
    assert.ok(section.includes(question.name));
    assert.ok(section.includes(question.acceptedAnswer.text));
  }
  assert.match(section, /no implica disponibilidad/);
});

test("catalog structured list and comparison include only published tours", async () => {
  const html = await load("tours/");
  const list = graph(html).find(node => node["@type"] === "CollectionPage").mainEntity;
  assert.equal(list.numberOfItems, publishedTours.length);
  const visiblePaths = [...html.matchAll(/<article class="tour-card"[\s\S]*?<h2[^>]*>\s*<a href="([^"]+)"/g)].map(match => match[1]);
  assert.deepEqual(list.itemListElement.map(item => new URL(item.url).pathname), visiblePaths);
  assert.deepEqual([...visiblePaths].sort(), publishedTours.map(tour => `/tours/${tour.slug}/`).sort());
  assert.match(html, /<table/);
  assert.doesNotMatch(html, /free-walking-tour-cuenca|paute-dinosaurios-naturaleza-y-sabores/);
});

test("robots and sitemap expose public canonical routes but never disabled tours", async () => {
  const sitemap = await readFile(new URL("../dist/sitemap-index.xml", import.meta.url), "utf8");
  const robots = await readFile(new URL("../dist/robots.txt", import.meta.url), "utf8");
  assert.match(robots, /Allow: \/\n/);
  assert.match(robots, /Sitemap: https:\/\/condorexpedition.com\/sitemap-index.xml/);
  for (const tour of allTours) {
    assert.equal(sitemap.includes(`/tours/${tour.slug}/`), tour.enabled);
    if (!tour.enabled) await assert.rejects(load(`tours/${tour.slug}/`), { code: "ENOENT" });
  }
});
