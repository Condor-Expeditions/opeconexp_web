// Helpers — capa de acceso a datos tipo API REST local
// Todas las funciones usan imports de los archivos en api/.
// Las páginas y componentes NUNCA importan JSON directamente.
// En el futuro, reemplazar estos imports por fetch() a una API real.

import toursData from "./api/tours/items.json";
import categoriesData from "./api/tours/categories.json";
import regionsData from "./api/tours/regions.json";
import tagsData from "./api/tours/tags.json";
import operatorsData from "./api/tours/operators.json";
import meetingPointsData from "./api/tours/meeting-points.json";
import difficultiesData from "./api/tours/difficulties.json";
import companyData from "./api/company/company.json";
import teamData from "./api/team/team.json";
import sustainabilityData from "./api/sustainability/items.json";
import testimonialsData from "./api/settings/testimonials.json";
import statsData from "./api/settings/stats.json";
import reviewsData from "./api/reviews/reviews.json";
import cartData from "./api/cart/cart.json";

import type {
  Tour,
  Category,
  Region,
  Tag,
  Operator,
  MeetingPoint,
  Difficulty,
  Company,
  TeamMember,
  SustainabilityItem,
  Stat,
  Testimonial,
  Review,
  CartItem,
  MultilingualText,
} from "./types";

// ============================================================
// Función utilitaria para resolver textos multilingües
// ============================================================

export function resolveLabel(obj: Record<string, string>, lang: string): string {
  return obj[lang] ?? obj["es"] ?? "";
}

// ============================================================
// Catálogos: Categories, Regions, Tags, Operators, etc.
// ============================================================

export function getCategories(): Category[] {
  return categoriesData as unknown as Category[];
}

export function getRegions(): Region[] {
  return regionsData as unknown as Region[];
}

export function getTags(): Tag[] {
  return tagsData as unknown as Tag[];
}

export function getOperators(): Operator[] {
  return operatorsData as unknown as Operator[];
}

export function getMeetingPoints(): MeetingPoint[] {
  return meetingPointsData as unknown as MeetingPoint[];
}

export function getDifficulties(): Difficulty[] {
  return difficultiesData as unknown as Difficulty[];
}

// ============================================================
// Tours — funciones principales
// ============================================================

export function getTours(): Tour[] {
  return toursData.items as unknown as Tour[];
}

export function getToursByStatus(status: "active" | "draft" | "hidden" | "archived" = "active"): Tour[] {
  return getTours().filter((t) => t.status === status);
}

export function getToursByCategory(categorySlug: string): Tour[] {
  return getTours().filter((t) => t.categories.includes(categorySlug));
}

export function getToursByRegion(regionSlug: string): Tour[] {
  return getTours().filter((t) => t.regions.includes(regionSlug));
}

export function getToursByTag(tagSlug: string): Tour[] {
  return getTours().filter((t) => t.tags.includes(tagSlug));
}

export function getFeaturedTours(count = 6): Tour[] {
  return getToursByStatus("active").slice(0, count);
}

export function getTourById(id: string): Tour | undefined {
  return getTours().find((t) => t.id === id);
}

export function getTourBySlug(slug: string): Tour | undefined {
  return getTours().find((t) => t.slug === slug);
}

// Helper para verificar si un path de imagen es válido
// Usado porque /public/images/tours/ no está completamente populated
// Fallback: placehold.co con nombre del tour como texto

// Imágenes conocidas válidas en /public/images/
const VALID_PREFIXES = [
  "/assets/menu/tours/",
  "/assets/icons/",
  "/images/team/",
  "/images/destinations/",
];

export function getValidImageUrl(imgPath: string | undefined, altText: string = "Tour"): string {
  if (!imgPath) {
    // Fallback a placehold.co con el nombre del tour
    const encodedText = encodeURIComponent(altText);
    return `https://placehold.co/800x400?text=${encodedText}&font=montserrat`;
  }
  // No usar paths remotos (http)
  if (imgPath.startsWith("http")) return imgPath;
  // Imágenes conocidas válidas en /public
  if (VALID_PREFIXES.some((p) => imgPath.startsWith(p))) {
    return imgPath;
  }
  // Si es un path /images/tours/ que no existe, usar fallback placehold.co
  const encodedText = encodeURIComponent(altText);
  return `https://placehold.co/800x400?text=${encodedText}&font=montserrat`;
}

// Helper para compatibilidad legacy con el frontend existente
export function getTourData(tour: Tour, lang: "es" | "en") {
  if (!tour) {
    console.error("getTourData: tour is undefined/null");
    return {};
  }
  if (!tour.categories || !Array.isArray(tour.categories)) {
    console.error("getTourData: tour.categories missing", tour.id);
    return {};
  }
  if (!tour.includes || !Array.isArray(tour.includes)) {
    console.error("getTourData: tour.includes missing", tour.id);
  }
  const category = getCategories().find((c) => tour.categories[0] === c.id);
  const difficulty = getDifficulties().find((d) => tour.difficulty === d.id);
  const firstGallery = tour.gallery?.[0];

  return {
    id: tour.id,
    slug: tour.slug,
    name: resolveLabel(tour.title, lang),
    category: resolveLabel(category?.title || { es: tour.categories[0], en: tour.categories[0] }, lang),
    shortDescription: resolveLabel(tour.description, lang),
    image: getValidImageUrl(tour.heroImage || firstGallery?.src || tour.image, resolveLabel(tour.title, lang)),
    heroImage: getValidImageUrl(tour.heroImage || firstGallery?.src || tour.image, resolveLabel(tour.title, lang)),
    badge: tour.duration,
    operational: {
      duration: tour.duration,
      days: tour.schedules?.[0]?.days?.join(", ") || "",
      capacity: "Mín. 4 / Máx. 24",
      difficulty: resolveLabel(difficulty?.title || { es: "Media", en: "Medium" }, lang),
    },
    includes: (tour.includes || []).map((i) => resolveLabel(i.text, lang)),
    meetingPoints: (tour.schedules || []).map((s) => `${s.start} (${s.days?.join(", ") || ""})`),
    itinerario: (tour.itinerary || []).flatMap((d) => (d.stops || []).map((s) => resolveLabel(s.title, lang))) || [],
    excludes: [],
    whatToBring: [],
    activities: tour.tags || [],
    pricing: {
      general: `$${tour.prices?.[0]?.amount || 0}`,
      special: `$${(tour.prices?.[0]?.amount * 0.9).toFixed(0) || 0}`,
    },
  };
}

// ============================================================
// Empresa y Equipo
// ============================================================

export function getCompany(): Company {
  return companyData as unknown as Company;
}

export function getTeam(): TeamMember[] {
  return teamData?.equipo || [];
}

// ============================================================
// Sostenibilidad
// ============================================================

export function getSustainability(): SustainabilityItem[] {
  if (Array.isArray(sustainabilityData)) return sustainabilityData as unknown as SustainabilityItem[];
  return sustainabilityData?.items || [];
}

// ============================================================
// Estadísticas
// ============================================================

export function getStats(): Stat[] {
  return statsData as unknown as Stat[];
}

// ============================================================
// Testimonios
// ============================================================

export function getTestimonials(): Testimonial[] {
  return testimonialsData as unknown as Testimonial[];
}

// ============================================================
// Reviews
// ============================================================

export function getReviews(): Review[] {
  return (reviewsData as unknown as { reviews?: Review[] }).reviews || [];
}

export function getReviewsByTourId(tourId: string): Review[] {
  return getReviews().filter((r) => r.tourId === tourId);
}

// ============================================================
// Carrito
// ============================================================

export function getCart(): CartItem[] {
  return cartData?.items || [];
}

export function getCartTotal(): number {
  return getCart().reduce((sum, item) => sum + item.price * item.quantity, 0);
}

// ============================================================
// Utilidades de formateo
// ============================================================

export function formatPrice(amount: number, currency = "USD"): string {
  return `${currency === "USD" ? "$" : currency} ${amount}`;
}

export function getCategoryTitle(categorySlug: string, lang: "es" | "en"): string {
  const cat = getCategories().find((c) => c.id === categorySlug);
  return cat ? resolveLabel(cat.title, lang) : categorySlug;
}

export function getCategoryIcon(categorySlug: string): string {
  const cat = getCategories().find((c) => c.id === categorySlug);
  return cat?.icon || "📍";
}

export function getDifficultyLevel(difficultySlug: string, lang: "es" | "en"): string {
  const diff = getDifficulties().find((d) => d.id === difficultySlug);
  return diff ? resolveLabel(diff.title, lang) : difficultySlug;
}