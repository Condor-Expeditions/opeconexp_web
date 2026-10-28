import { mkdir, readdir, stat } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

// Originals live outside public/ so deployments never include the camera files.
const source = path.resolve(process.argv[2] ?? "tmp/tour-photo-originals");
const output = path.resolve("src/assets/tours");
const folders = {
	"Caminata Cajas": "caminata-cajas",
	Cojitambo: "cojitambo",
	Coyotor: "coyoctor",
	"Dos Chorreras": "dos-chorreras",
	"El Abuelo": "casa-del-abuelo",
	Ingapirca: "ingapirca",
	"Laguna Toreadora": "laguna-toreadora",
	"Mirador Tres Cruces": "mirador-tres-cruces",
	"Virgen del Cajas": "virgen-del-cajas",
};

let originalBytes = 0;
let optimizedBytes = 0;
let count = 0;
for (const [folder, slug] of Object.entries(folders)) {
	const directory = path.join(source, folder);
	const files = (await readdir(directory)).filter(name => /\.(jpe?g|png)$/i.test(name)).sort();
	await mkdir(path.join(output, slug), { recursive: true });
	let folderBytes = 0;
	for (const file of files) {
		const input = path.join(directory, file);
		const destination = path.join(output, slug, `${path.parse(file).name}.webp`);
		// Auto-orient, preserve the full composition, never upscale, strip EXIF/GPS.
		// Astro generates smaller responsive variants from these WebP masters.
		await sharp(input).rotate().resize(2400, 2400, { fit: "inside", withoutEnlargement: true })
			.webp({ quality: 80, effort: 6 }).toFile(destination);
		originalBytes += (await stat(input)).size;
		folderBytes += (await stat(destination)).size;
		count++;
	}
	optimizedBytes += folderBytes;
	console.log(`${folder}: ${files.length} fotos, ${(folderBytes / 1048576).toFixed(2)} MiB WebP`);
}
console.log(`${count} fotos: ${(originalBytes / 1048576).toFixed(2)} → ${(optimizedBytes / 1048576).toFixed(2)} MiB (${(100 * (1 - optimizedBytes / originalBytes)).toFixed(1)}% menos)`);
