import type { ImageMetadata } from "astro";


const tourImageModules = import.meta.glob<{ default: ImageMetadata }>(
	"@/assets/tours/*.{jpg,jpeg,png,webp,avif}",
	{ eager: true },
);

/**
 * Índice por nombre de archivo (`nevado.jpg`), independiente de cómo Vite
 * exponga la ruta completa de cada clave del glob.
 */
const tourImagesByFile = new Map<string, ImageMetadata>(
	Object.entries(tourImageModules).map(([path, module]) => [
		path.slice(path.lastIndexOf("/") + 1),
		module.default,
	]),
);

/** Devuelve la imagen de `src/assets/tours` con ese nombre de archivo. */
export function getTourImage(file: string): ImageMetadata {
	const image = tourImagesByFile.get(file);

	if (!image) {
		const available = [...tourImagesByFile.keys()].sort().join(", ");
		throw new Error(
			`Imagen "${file}" no encontrada en src/assets/tours. Disponibles: ${available || "(ninguna)"}`,
		);
	}

	return image;
}

/** Todas las imágenes de `src/assets/tours`, ordenadas por nombre de archivo. */
export function listTourImages(): ImageMetadata[] {
	return [...tourImagesByFile.entries()]
		.sort(([a], [b]) => a.localeCompare(b))
		.map(([, image]) => image);
}
