import type { ImageMetadata } from "astro";
import type { TourPhoto } from "./types";

const images = import.meta.glob<{ default: ImageMetadata }>([
	"/public/assets/menu/tours/*.{jpg,jpeg,png,webp}",
	"/public/assets/menu/destinos/*.{jpg,jpeg,png,webp}",
	"/src/assets/tours/*.{jpg,jpeg,png,webp}",
	"/src/assets/tours/demo/*.{jpg,jpeg,png,webp}",
], { eager: true });

/** Shared by the gallery and recommendations, so editing a tour's photos updates both. */
export function getTourPhoto(photo: TourPhoto): ImageMetadata {
	const image = images[photo.src]?.default;
	if (!image) throw new Error(`Imagen de tour no encontrada: ${photo.src}`);
	return image;
}
