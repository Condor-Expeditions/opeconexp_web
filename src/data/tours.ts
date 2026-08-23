// tours.ts → Re-exporta desde la arquitectura API-local
// Mantiene compatibilidad con los imports existentes del código
import { type Tour, getTours, getTourBySlug, getFeaturedTours, getToursByCategory } from "./helpers";

export type { Tour };
export { getTours, getTourBySlug, getFeaturedTours, getToursByCategory };

// Legacy export para compatibilidad
export const tours: Tour[] = getTours();