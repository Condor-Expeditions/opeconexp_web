import assert from "node:assert/strict";
import { readFile, readdir, stat } from "node:fs/promises";
import path from "node:path";
import test from "node:test";
import sharp from "sharp";
import { allTours } from "./helpers/tour-data.mjs";

const root = new URL("../", import.meta.url);
const folders = {
	"caminata-cajas": 10, cojitambo: 11, coyoctor: 12, "dos-chorreras": 12,
	"casa-del-abuelo": 10, ingapirca: 10, "laguna-toreadora": 11,
	"mirador-tres-cruces": 13, "virgen-del-cajas": 12,
};
const assignments = {
	"cajas-al-descubierto": ["laguna-toreadora", "mirador-tres-cruces", "virgen-del-cajas", "dos-chorreras"],
	"cajas-de-laguna-a-lo-ancestral": ["caminata-cajas", "casa-del-abuelo", "virgen-del-cajas", "dos-chorreras"],
	"raices-ancestrales-del-ecuador": ["ingapirca", "cojitambo", "coyoctor"],
	"pueblitos-magicos": ["ingapirca"],
};
const load = route => readFile(new URL(`dist/${route}`, root), "utf8");

test("all 101 supplied photographs are WebP masters, bounded to 2400px and stripped of metadata", async () => {
	let count = 0;
	for (const [folder, expected] of Object.entries(folders)) {
		const directory = new URL(`src/assets/tours/${folder}/`, root);
		const files = await readdir(directory);
		assert.equal(files.length, expected, folder);
		for (const file of files) {
			assert.match(file, /\.webp$/);
			const url = new URL(file, directory);
			const metadata = await sharp(await readFile(url)).metadata();
			assert.equal(metadata.format, "webp");
			assert.ok(Math.max(metadata.width, metadata.height) <= 2400, file);
			assert.equal(metadata.exif, undefined, "Do not publish EXIF/GPS");
			assert.equal(metadata.xmp, undefined);
			assert.ok((await stat(url)).size < 1024 * 1024, `${folder}/${file}: WebP master must be under 1 MiB`);
			count++;
		}
	}
	assert.equal(count, 101);
});

test("updated galleries use only supplied photos from places on their own itinerary", async () => {
	const listing = await load("tours/index.html");
	for (const [slug, allowed] of Object.entries(assignments)) {
		const tour = allTours.find(item => item.slug === slug);
		assert.equal(tour.illustrativePhotos, false, slug);
		assert.ok(tour.photos.length >= 5);
		assert.equal(new Set(tour.photos.map(photo => photo.src)).size, tour.photos.length);
		const detail = await load(`tours/${slug}/index.html`);
		const gallery = detail.match(/<div class="tour-gallery"[\s\S]*?<div class="gallery-footnote">/)[0];
		assert.doesNotMatch(gallery, /ilustrativa|\/tmp\//i);
		for (const photo of tour.photos) {
			assert.ok(photo.src.startsWith("/src/assets/tours/"));
			assert.ok(allowed.includes(photo.src.split("/").at(-2)), `${slug}: ${photo.src}`);
			assert.ok(photo.alt.length > 20);
			await stat(new URL(photo.src.slice(1), root));
			assert.ok(gallery.includes(path.parse(photo.src).name), `${slug}: every configured photo reaches the gallery`);
		}
		const card = [...listing.matchAll(/<article class="tour-card"[\s\S]*?<\/article>/g)].find(match => match[0].includes(`/tours/${slug}/`))[0];
		const cover = card.match(/<img\b[^>]*>/)[0];
		assert.ok(cover.includes(path.parse(tour.photos[0].src).name), `${slug}: listing uses the gallery's cover`);
		assert.match(cover, /srcset=/);
	}
});

test("hero, masonry and home feature cards render the new responsive photography", async () => {
	const home = await load("index.html");
	const hero = home.match(/<section class="hero"[\s\S]*?<script/)[0];
	assert.match(hero, /20261012_0233/);
	assert.match(hero, /20261012_0293/);
	assert.match(hero, /20261012_0101/);
	assert.match(hero, /20261012_0167/);
	assert.doesNotMatch(hero, /nevado\./);
	const menu = home.match(/<div class="destination-grid">[\s\S]*?<div class="menu-footer">/)[0];
	for (const name of ["20261012_0293", "20261012_0101", "20261012_0167"]) assert.ok(menu.includes(name));
	const featured = home.match(/<section[^>]*aria-labelledby="featured-title"[\s\S]*?<\/section>/)[0];
	for (const slug of ["cajas-al-descubierto", "pueblitos-magicos", "raices-ancestrales-del-ecuador"]) {
		const tour = allTours.find(item => item.slug === slug);
		assert.ok(featured.includes(path.parse(tour.photos[0].src).name));
	}
});

test("camera originals are absent from public files and build output", async () => {
	for (const directory of ["public/tmp/", "dist/tmp/"]) {
		const files = await readdir(new URL(directory, root), { recursive: true }).catch(error => {
			if (error.code === "ENOENT") return [];
			throw error;
		});
		assert.ok(!files.some(file => /\.(jpe?g|png|webp)$/i.test(file)), directory);
	}
});
