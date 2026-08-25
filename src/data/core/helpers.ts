// src/data/core/helpers.ts
// Barrel re-export — MISMO API PÚBLICO que el helpers.ts original (cero rotura)

export * from "./types";
export * from "./utils";
export * from "./tours.repository";
export * from "./catalog.repository";
export * from "./reviews.repository";
export * from "./content.service";
export * from "./tourData.service";
export * from "./image.service";

// Inicialización lazy (se llama al importar este módulo)
import { setTours, getToursCache } from "./tours.repository";
import { setCatalog } from "./catalog.repository";
import { setReviews } from "./reviews.repository";
import { setContent } from "./content.service";
import { setMeetingPoints } from "./image.service";

// Legacy compat — re-export para no romper consumers
export {
  getCategoryTitle,
  getCategoryIcon,
  getDifficultyLevel,
  getFeaturedTours,
  getTourBySlug,
} from "./tours.repository";

import toursList from "../api/tours.json";
import categoriesList from "../api/categories.json";
import regionsList from "../api/regions.json";
import tagsList from "../api/tags.json";
import operatorsList from "../api/operators.json";
import meetingPointsList from "../api/meeting-points.json";
import difficultiesList from "../api/difficulties.json";
import reviewsData from "../api/reviews.json";
import companyData from "../api/company.json";
import teamData from "../api/team.json";
import testimonialsData from "../api/testimonials.json";
import statsData from "../api/stats.json";
import sustainabilityData from "../api/sustainability.json";

// Poblar caches al cargar
const tours = (toursList as any).items as Tour[];
setTours(tours);

setCatalog({
  categories: categoriesList as Category[],
  regions: regionsList as Region[],
  tags: tagsList as Tag[],
  meetingPoints: meetingPointsList as MeetingPoint[],
  difficulties: difficultiesList as Difficulty[],
  operators: operatorsList as Operator[],
});

setReviews((reviewsData as any).reviews ?? []);

setContent({
  company: companyData as Company,
  team: teamData as TeamRoot,
  sustainability: (sustainabilityData as any).items ?? [],
  testimonials: testimonialsData as Testimonial[],
  stats: statsData as Stat[],
});

setMeetingPoints(meetingPointsList as MeetingPoint[]);