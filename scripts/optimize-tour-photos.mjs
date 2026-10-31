import { mkdir, readdir, stat, writeFile } from "node:fs/promises";
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
	Busa: "busa",
	Chordeleg: "chordeleg",
	"Complejo Arqueológico Chobsi": "chobshi",
	"El Chorro": "el-chorro",
	"Iglesia de Girón": "iglesia-de-giron",
	"Museo de la Makana": "museo-de-la-makana",
	"Museo de los Tratados": "museo-de-los-tratados",
	"Pailon del Chobsi": "pailon-de-chobshi",
	Templete: "templete-de-tarqui",
};

let originalBytes = 0;
let optimizedBytes = 0;
let count = 0;
for (const [folder, slug] of Object.entries(folders)) {
	const directory = path.join(source, folder);
	const entries = await readdir(directory).catch(error => {
		if (error.code === "ENOENT") return [];
		throw error;
	});
	const files = entries.filter(name => /\.(jpe?g|png)$/i.test(name)).sort();
	if (!files.length) continue;
	await mkdir(path.join(output, slug), { recursive: true });
	let folderBytes = 0;
	for (const file of files) {
		const input = path.join(directory, file);
		const destination = path.join(output, slug, `${path.parse(file).name}.webp`);
		// Auto-orient, preserve the full composition, never upscale, strip EXIF/GPS.
		// Astro generates smaller responsive variants from these WebP masters.
		let size = 2400;
		let optimized;
		do {
			optimized = await sharp(input).rotate().resize(size, size, { fit: "inside", withoutEnlargement: true })
				.webp({ quality: 80, effort: 6 }).toBuffer();
			size = Math.floor(size * 0.9);
		} while (optimized.length >= 1024 * 1024);
		await writeFile(destination, optimized);
		originalBytes += (await stat(input)).size;
		folderBytes += (await stat(destination)).size;
		count++;
	}
	optimizedBytes += folderBytes;
	console.log(`${folder}: ${files.length} fotos, ${(folderBytes / 1048576).toFixed(2)} MiB WebP`);
}
console.log(`${count} fotos: ${(originalBytes / 1048576).toFixed(2)} → ${(optimizedBytes / 1048576).toFixed(2)} MiB (${(100 * (1 - optimizedBytes / originalBytes)).toFixed(1)}% menos)`);
