// tours.ts → Re-exporta desde la arquitectura API-local
// Mantiene compatibilidad con los imports existentes del código
import {
	getFeaturedTours,
	getTourBySlug,
	getTours,
	getToursByCategory,
	type Tour,
} from "./core/helpers";

export type { Tour };
export { getFeaturedTours, getTourBySlug, getTours, getToursByCategory };

// Legacy export para compatibilidad
export const tours: Tour[] = getTours();
