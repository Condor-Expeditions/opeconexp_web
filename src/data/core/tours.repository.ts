// src/data/core/tours.repository.ts
// Repository pattern para Tours — acceso a datos + lógica de filtrado

import type { Tour, Category, Difficulty } from "./types";
import { getCategory, getDifficulty } from "./catalog.repository";

let _tours: Tour[] = [];

export function setTours(tours: Tour[]): void {
  _tours = tours;
}

export function getToursCache(): Tour[] {
  return _tours;
}

export function getTours(filters?: {
  region?: string;
  category?: string;
  difficulty?: string;
  tag?: string;
  status?: string;
}): Tour[] {
  let result = _tours;
  if (filters?.status) {
    result = result.filter((t) => t.status === filters.status);
  }
  if (filters?.region) {
    result = result.filter((t) => t.regions?.includes(filters.region!));
  }
  if (filters?.category) {
    result = result.filter((t) => t.categories?.some((c) => c.id === filters.category));
  }
  if (filters?.difficulty) {
    result = result.filter((t) => t.difficulty === filters.difficulty);
  }
  if (filters?.tag) {
    result = result.filter((t) => t.tags?.some((tag) => tag.id === filters.tag));
  }
  return result;
}

export function getTour(slug: string): Tour | undefined {
  return _tours.find((t) => t.slug === slug);
}

export function getTourById(id: string): Tour | undefined {
  return _tours.find((t) => t.id === id);
}

export function getToursByRegion(regionId: string): Tour[] {
  return _tours.filter((t) => t.regions?.includes(regionId));
}

export function getToursByCategory(categoryId: string): Tour[] {
  return _tours.filter((t) => t.categories?.some((c) => c.id === categoryId));
}

export function getToursByDifficulty(difficultyId: string): Tour[] {
  return _tours.filter((t) => t.difficulty === difficultyId);
}

export function getFeaturedTours(count = 6): Tour[] {
  return _tours.filter((t) => t.status === "active").slice(0, count);
}

// Re-export alias de compatibilidad
export const getTourBySlug = getTour;

// Legacy compat functions
export function getCategoryTitle(
  categorySlug: string,
  lang: "es" | "en",
): string {
  const cat = getCategory(categorySlug);
  return cat ? cat.title[lang] ?? cat.title.es ?? categorySlug : categorySlug;
}

export function getCategoryIcon(categorySlug: string): string {
  const cat = getCategory(categorySlug);
  return cat?.icon || "📍";
}

export function getDifficultyLevel(
  difficultySlug: string,
  lang: "es" | "en",
): string {
  const diff = getDifficulty(difficultySlug);
  return diff ? diff.title[lang] ?? diff.title.es ?? difficultySlug : difficultySlug;
}