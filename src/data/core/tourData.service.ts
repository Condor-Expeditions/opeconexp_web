// src/data/core/tourData.service.ts
// Compat layer: transforma Tour crudo → shape que usan TourCard/TourDetail (Adapter)

import type { Tour } from "./types";
import { getCategory, getDifficulty } from "./catalog.repository";
import { getValidImageUrl, resolveLabel, formatPrice } from "./utils";

export interface TourData {
  id: string;
  slug: string;
  name: string;
  category: string;
  shortDescription: string;
  image: string;
  heroImage: string;
  badge: string;
  operational: {
    duration: string;
    days: string;
    capacity: string;
    difficulty: string;
  };
  includes: string[];
  meetingPoints: string[];
  itinerary: string[];
  excludes: string[];
  whatToBring: string[];
  activities: Tag[];
  pricing: {
    general: string;
    special: string;
  };
}

export function getTourData(tour: Tour | undefined, lang: "es" | "en"): TourData {
  if (!tour) {
    console.error("getTourData: tour is undefined/null");
    return emptyTourData();
  }
  // SAFE fallbacks — never let tour.categories/includes be undefined
  // (prevents .map crashes downstream in TourCard/TourDetail)
  if (!tour.categories || !Array.isArray(tour.categories)) {
    console.error("getTourData: tour.categories missing", tour.id);
  }
  if (!tour.includes || !Array.isArray(tour.includes)) {
    console.error("getTourData: tour.includes missing", tour.id);
  }
  const category = tour.categories?.[0] ? getCategory(tour.categories[0].id) : undefined;
  const difficulty = tour.difficulty ? getDifficulty(tour.difficulty) : undefined;
  const firstGallery = tour.gallery?.[0];

  return {
    id: tour.id,
    slug: tour.slug,
    name: resolveLabel(tour.title, lang),
    category: resolveLabel(
      category?.title || { es: tour.categories?.[0]?.id || "otros", en: tour.categories?.[0]?.id || "other" },
      lang,
    ),
    shortDescription: resolveLabel(tour.description, lang),
    image: getValidImageUrl(
      tour.image ?? firstGallery?.src,
      resolveLabel(tour.title, lang),
    ),
    heroImage: getValidImageUrl(
      tour.image ?? firstGallery?.src,
      resolveLabel(tour.title, lang),
    ),
    badge: tour.duration,
    operational: {
      duration: tour.duration || "",
      days: tour.schedules?.[0]?.days?.join(", ") || "",
      capacity: "Mín. 4 / Máx. 24",
      difficulty: resolveLabel(
        difficulty?.title || { es: "Media", en: "Medium" },
        lang,
      ),
    },
    includes: (tour.includes || []).map((i) => resolveLabel(i.text, lang)),
    meetingPoints: (tour.schedules || []).map(
      (s) => `${s.start} (${s.days?.join(", ") || ""})`,
    ),
    itinerary: (tour.itinerary || []).flatMap((d) =>
      (d.stops || []).map((s) => resolveLabel(s.title, lang)),
    ),
    excludes: [],
    whatToBring: [],
    activities: tour.tags || [],
    pricing: {
      general: formatPrice(tour.prices?.[0]?.amount || 0, tour.prices?.[0]?.currency),
      special: formatPrice((tour.prices?.[0]?.amount || 0) * 0.9, tour.prices?.[0]?.currency),
    },
  };
}

function emptyTourData(): TourData {
  return {
    includes: [],
    excludes: [],
    whatToBring: [],
    activities: [],
    meetingPoints: [],
    itinerary: [],
    pricing: { general: "$0", special: "$0" },
    operational: { duration: "", days: "", capacity: "", difficulty: "" },
    image: "",
    heroImage: "",
    name: "",
    category: "",
    shortDescription: "",
    badge: "",
    id: "",
    slug: "",
  };
}