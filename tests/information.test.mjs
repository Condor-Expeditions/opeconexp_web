import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const load = route => readFile(new URL(`../dist/${route}index.html`, import.meta.url), "utf8");

test("new information sections use existing theme colors, not custom hex colors", async () => {
  for (const path of ["src/styles/information.css", "src/components/sections/index/HomeInformation.astro", "src/pages/contacto.astro"]) {
    const source = await readFile(new URL(`../${path}`, import.meta.url), "utf8");
    const css = source.includes("<style>") ? source.split("<style>")[1].split("</style>")[0] : source;
    assert.doesNotMatch(css, /#[\da-f]{3,8}\b/i, path);
    assert.match(css, /var\(--color-/);
  }
  const countdown = await readFile(new URL("../src/components/sections/launch/Countdown.astro", import.meta.url), "utf8");
  assert.doesNotMatch(countdown, /#162522/i);
});

for (const route of ["", "sobre-nosotros/", "contacto/"]) {
  test(`information /${route}: main landmark, substantive content, no reviews`, async () => {
    const html = await load(route);
    assert.equal((html.match(/<main\b/g) || []).length, 1);
    assert.equal((html.match(/<h1\b/g) || []).length, 1);
    const main = html.match(/<main\b[\s\S]*?<\/main>/)[0];
    assert.doesNotMatch(main, /testimonios|reseñas|valoraciones|AggregateRating|Review|Página en construcción/i);
    assert.ok((main.match(/<section\b/g) || []).length >= 3);
  });
}

test("home: current catalog links, clear imagery and contribution notice", async () => {
  const html = await load("");
  const section = html.match(/<section[^>]*aria-labelledby="featured-title"[\s\S]*?<\/section>/)[0];
  assert.equal((section.match(/<article\b/g) || []).length, 4);
  assert.doesNotMatch(section, /Guachapala|Precio por confirmar/);
  assert.match(section, /Aporte voluntario al guía/);
  assert.doesNotMatch(section, /Fotografía ilustrativa/);
  for (const [, slug] of section.matchAll(/href="\/tours\/([^/"?]+)\//g)) await assert.doesNotReject(load(`tours/${slug}/`));
  assert.match(html, /<details>/);
});

test("contact: real WhatsApp action, no fake submission or provisional product", async () => {
  const html = await load("contacto/");
  const form = html.match(/<form\b[\s\S]*?<\/form>/)[0];
  assert.match(form, /action="https:\/\/wa.me\/593995900614" method="get"/);
  assert.match(form, /name="text"/);
  assert.match(form, /Continuar en WhatsApp/);
  assert.doesNotMatch(form, /Guachapala|type="email"|type="tel"/);
  assert.match(html, /no una reserva/);
  assert.match(html, /<noscript>/);
  assert.match(html, /no guarda tus datos/);
});
