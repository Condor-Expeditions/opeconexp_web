// Helpers — capa de acceso a datos tipo API REST
// Todas las funciones usan import de los archivos en api/.
// Las páginas y componentes NUNCA importan JSON directamente.
// En el futuro, reemplazar estos imports por fetch() a una API real.

import toursList from "./api/tours/items.json";
import categoriesList from "./api/tours/categories.json";
import regionsList from "./api/tours/regions.json";
import tagsList from "./api/tours/tags.json";
import operatorsList from "./api/tours/operators.json";
import meetingPointsList from "./api/tours/meeting-points.json";
import difficultiesList from "./api/tours/difficulties.json";
import companyData from "./api/company/company.json";
import teamData from "./api/team/team.json";
import sustainabilityData from "./api/sustainability/items.json";
import testimonialsData from "./api/settings/testimonials.json";
import statsData from "./api/settings/stats.json";

// ─── Tipos ──────────────────────────────────────────

export interface Tour {
  id: string;
  slug: string;
  type: "tour" | "custom";
  status: "draft" | "active" | "hidden" | "archived";
  title: Record<string, string>;
  description: Record<string, string>;
  categories: string[];
  regions: string[];
  tags: string[];
  operator: string;
  meetingPoint: string;
  duration: string;
  difficulty: string;
  prices: Price[];
  includes: Include[];
  itinerary?: ProgramDay[];
  schedules: Schedule[];
  accommodations?: Accommodation[];
  gallery?: MediaItem[];
  seo?: SeoMeta;
  createdAt?: string;
  updatedAt?: string;
}

export interface Price {
  label: Record<string, string>;
  amount: number;
  currency: string;
}

export interface Include {
  icon: string;
  text: Record<string, string>;
}

export interface Schedule {
  start: string;
  end?: string;
  days: string[];
}

export interface ProgramDay {
  day: number;
  stops: ProgramStop[];
  meals: string[];
  meals_not_included: string[];
  highlights?: Record<string, string>[];
  activities?: string[];
}

export interface ProgramStop {
  time: string;
  title: Record<string, string>;
}

export interface Accommodation {
  id: string;
  name: string;
  url?: string;
  phone?: string;
  used_on_days: number[];
}

export interface Category {
  id: string;
  slug: string;
  icon: string;
  title: Record<string, string>;
}

export interface Region {
  id: string;
  slug: string;
  title: Record<string, string>;
}

export interface Tag {
  id: string;
  slug: string;
  title: Record<string, string>;
}

export interface MeetingPoint {
  id: string;
  title: Record<string, string>;
  location: { lat: number; lng: number };
}

export interface Difficulty {
  id: string;
  level: number;
  title: Record<string, string>;
}

export interface Operator {
  id: string;
  name: string;
  phone: string;
  email: string;
  logo: string;
}

export interface SeoMeta {
  title: Record<string, string>;
  description: Record<string, string>;
}

export interface MediaItem {
  type: "image" | "video";
  src: string;
  alt?: Record<string, string>;
}

export interface Testimonial {
  text: Record<string, string>;
  name: string;
  country: string;
  city: string;
  expedition: Record<string, string>;
  stars: number;
}

export interface Stat {
  value: number;
  suffix: string;
  label: Record<string, string>;
}

export interface Company {
  name: string;
  author: string;
  seo: { description: Record<string, string>; keywords: Record<string, string> };
  contact: {
    address: Record<string, string>;
    scheduleWeekdays: Record<string, string>;
    scheduleWeekends: Record<string, string>;
    phone: { name: string; href: string };
    email: { name: string; href: string };
    whatsapp: string;
    maps: string;
  };
  socials: { name: string; href: string; icon: string }[];
}

export interface SustainabilityItem {
  icon: string;
  title: Record<string, string>;
  text: Record<string, string>;
}

export interface TeamRoot {
  equipo: TeamMember[];
  proposito: Record<string, string>;
  values: { id: string; title: Record<string, string>; description: Record<string, string> }[];
}

// ─── Data arrays (importados) ───────────────────────

const items: Tour[] = (toursList as any).items;
const categoryEntries: Category[] = categoriesList as Category[];
const regionEntries: Region[] = regionsList as Region[];
const tagEntries: Tag[] = tagsList as Tag[];
const operatorEntries: Operator[] = operatorsList as Operator[];
const meetingPointEntries: MeetingPoint[] = meetingPointsList as MeetingPoint[];
const difficultyEntries: Difficulty[] = difficultiesList as Difficulty[];
const testimonialEntries: Testimonial[] = testimonialsData as Testimonial[];
const statEntries: Stat[] = statsData as Stat[];
const companyEntry: Company = companyData as Company;
const teamEntry: TeamRoot = teamData as TeamRoot;
const sustainEntry: { items: SustainabilityItem[] } = sustainabilityData as any;

// ─── Tour Helpers ────────────────────────────────────

export function getTours(filters?: {
  region?: string;
  category?: string;
  season?: string;
  status?: string;
}): Tour[] {
  let result = items.filter((t) => !filters?.status || t.status === filters.status);
  if (filters?.region) result = result.filter((t) => t.regions.includes(filters.region!));
  if (filters?.category) result = result.filter((t) => t.categories.includes(filters.category!));
  return result;
}

export function getTour(slug: string): Tour | undefined {
  return items.find((t) => t.slug === slug);
}

export function getTourById(id: string): Tour | undefined {
  return items.find((t) => t.id === id);
}

export function getToursByRegion(regionId: string): Tour[] {
  return items.filter((t) => t.regions.includes(regionId));
}

export function getToursByCategory(categoryId: string): Tour[] {
  return items.filter((t) => t.categories.includes(categoryId));
}

export function getToursByDifficulty(difficultyId: string): Tour[] {
  return items.filter((t) => t.difficulty === difficultyId);
}

// ─── Catálogo Helpers ───────────────────────────────

export function getCategories(): Category[] {
  return categoryEntries;
}

export function getCategory(id: string): Category | undefined {
  return categoryEntries.find((c) => c.id === id);
}

export function getRegions(): Region[] {
  return regionEntries;
}

export function getRegion(id: string): Region | undefined {
  return regionEntries.find((r) => r.id === id);
}

export function getTags(): Tag[] {
  return tagEntries;
}

export function getTag(id: string): Tag | undefined {
  return tagEntries.find((t) => t.id === id);
}

export function getOperators(): Operator[] {
  return operatorEntries;
}

export function getOperator(id: string): Operator | undefined {
  return operatorEntries.find((o) => o.id === id);
}

export function getMeetingPoints(): MeetingPoint[] {
  return meetingPointEntries;
}

export function getMeetingPoint(id: string): MeetingPoint | undefined {
  return meetingPointEntries.find((m) => m.id === id);
}

export function getDifficulties(): Difficulty[] {
  return difficultyEntries;
}

export function getDifficulty(id: string): Difficulty | undefined {
  return difficultyEntries.find((d) => d.id === id);
}

// ─── Company ────────────────────────────────────────

export function getCompany(): Company {
  return companyEntry;
}

// ─── Settings ───────────────────────────────────────

export function getTestimonials(): Testimonial[] {
  return testimonialEntries;
}

export function getStats(): Stat[] {
  return statEntries;
}

export function getTeam(): TeamRoot {
  return teamEntry;
}

export function getSustainability(): SustainabilityItem[] {
  return sustainEntry.items;
}

// ─── Resolución de lenguajes ────────────────────────

/** Resuelve el name en el idioma solicitado con fallback a "es" */
export function resolveLabel(
  item: { title: Record<string, string> },
  lang: string,
  fallbackLang?: string,
): string {
  if (!item?.title) return "";
  return item.title[lang]
    ?? item.title[fallbackLang ?? ""]
    ?? Object.values(item.title)[0]
    ?? "";
}

export function resolveText(
  texts: Record<string, string> | undefined,
  lang: string,
  fallbackLang = "es",
): string {
  if (!texts) return "";
  return texts[lang] ?? texts[fallbackLang] ?? Object.values(texts)[0] ?? "";
}

export function formatPrice(amount: number, _currency = "USD"): string {
  return `$${amount.toLocaleString("es-EC")}`;
}

// ─── Differentiators hardcodeado (se mueve a settings más adelante) ─────
export interface Differentiator {
  icon: string;
  title: Record<string, string>;
  description: Record<string, string>;
}

// ============================================================
// Cart Helpers — carrito JSON local (persistente durante sesión)
// ============================================================

import cartData from "./api/cart/cart.json";

export interface CartItem {
  tourId: string;
  tourSlug: string;
  tourTitle: Record<string, string>;
  date: string;
  time: string;
  adults: number;
  children: number;
  unitPrice: number;
  total: number;
}

export function getCart(): CartItem[] {
  return (cartData as any).items ?? [];
}

export function addToCart(item: CartItem): void {
  const items = getCart();
  items.push(item);
  // En versión API real, haría POST; aquí actualiza proxy
  (cartData as any).items = items;
}

export function removeFromCart(tourId: string, date: string, time: string): void {
  const items = getCart().filter(
    (i: CartItem) => !(i.tourId === tourId && i.date === date && i.time === time)
  );
  (cartData as any).items = items;
}

export function getCartTotal(): number {
  return getCart().reduce((sum: number, i: CartItem) => sum + i.total, 0);
}

// ============================================================
// Review Helpers — sistema de rating y reseñas
// ============================================================

import reviewsData from "./api/reviews/reviews.json";

export interface Review {
  id: string;
  tourId: string;
  author: string;
  rating: number;
  comment: Record<string, string>;
  date: string;
}

export interface RatingSummary {
  average: number;
  count: number;
}

export function getReviews(tourId: string): Review[] {
  const all: Review[] = (reviewsData as any).reviews ?? [];
  return all.filter((r) => r.tourId === tourId);
}

export function getRating(tourId: string): RatingSummary {
  const reviews = getReviews(tourId);
  if (reviews.length === 0) return { average: 0, count: 0 };
  const sum = reviews.reduce((a: number, r: Review) => a + r.rating, 0);
  return { average: Math.round((sum / reviews.length) * 10) / 10, count: reviews.length };
}

export function renderStars(rating: number): string {
  const full = "★".repeat(Math.floor(rating));
  const half = rating % 1 >= 0.5 ? "½" : "";
  const empty = "☆".repeat(5 - Math.ceil(rating));
  return full + half + empty;
}

// ============================================================
// Image Helpers — wrappers para astro:assets
// ============================================================

import councilMeetingPoints from "./api/tours/meeting-points.json";

export type { ItineraryDay, Accommodation };

export function getTourImage(tour: Tour, fallback = "/images/tours/city-tour-cuenca.webp"): string {
  return tour.image ?? (tour.gallery?.[0]?.src) ?? fallback;
}

export function getTourGallery(tour: Tour): MediaItem[] {
  return tour.gallery ?? [];
}

export function getTourMap(tour: Tour): { lat: number; lng: number } {
  if (tour.map?.lat) return tour.map;
  const mp = tour.meetingPoint
    ? (councilMeetingPoints as any).find((m) => m.id === tour.meetingPoint)
    : undefined;
  return mp?.location ?? { lat: -2.8974, lng: -79.0045 };
}

export function getTourItinerary(tour: Tour): ItineraryDay[] {
  return tour.itinerary ?? [];
}

export function getTourScheduleText(s: Schedule, lang: string): string {
  const dayLabels: Record<string, Record<string, string>> = {
    mon: { es: "Lun", en: "Mon" },
    tue: { es: "Mar", en: "Tue" },
    wed: { es: "Mié", en: "Wed" },
    thu: { es: "Jue", en: "Thu" },
    fri: { es: "Vie", en: "Fri" },
    sat: { es: "Sáb", en: "Sat" },
    sun: { es: "Dom", en: "Sun" },
  };
  if (s.days.length === 7) {
    return lang === "es" ? "Todos los días" : "Every day";
  }
  return s.days.map((d) => dayLabels[d]?.[lang] ?? d).join(", ");
}

// ============================================================
// End of helpers.ts
// ============================================================
// ============================================================
// Differentiators (restored)
// ============================================================

export function getDifferentiators(): Differentiator[] {
  return [
    {
      icon: "compass",
      title: { es: "Guías Locales Expertos", en: "Expert Local Guides" },
      description: {
        es: "Más de 10 años de experiencia en cada destino. Conocimiento profundo del territorio y su cultura.",
        en: "10+ years of experience in each destination. Deep knowledge of the territory and its culture.",
      },
    },
    {
      icon: "leaf",
      title: { es: "Turismo Sostenible", en: "Sustainable Tourism" },
      description: {
        es: "Impacto ambiental mínimo. Apoyamos comunidades locales y proyectos de conservación activa.",
        en: "Minimal environmental impact. We support local communities and active conservation projects.",
      },
    },
    {
      icon: "backpack",
      title: { es: "Expediciones a Tu Medida", en: "Custom Expeditions" },
      description: {
        es: "Itinerarios personalizados según tu nivel, intereses y ritmo. Grupos reducidos de máximo 12 personas.",
        en: "Customized itineraries according to your level, interests and pace. Small groups of maximum 12 people.",
      },
    },
    {
      icon: "shield",
      title: { es: "Seguridad Garantizada", en: "Guaranteed Safety" },
      description: {
        es: "Equipo de respuesta, seguros de accidentes personales y monitoreo satelital en cada expedición.",
        en: "Response team, personal accident insurance and satellite monitoring on every expedition.",
      },
    },
    {
      icon: "users",
      title: { es: "Turismo Responsable", en: "Responsible Tourism" },
      description: {
        es: "Trabajamos de la mano con comunidades indígenas y locales, retribuyendo a quienes protegen estos territorios.",
        en: "We work hand in hand with indigenous and local communities, giving back to those who protect these territories.",
      },
    },
    {
      icon: "certificate",
      title: { es: "Guías Certificados", en: "Certified Guides" },
      description: {
        es: "Guías acreditados ASEGUIM, IRF y WFR. Formación continua en primeros auxilios y rescate en montaña.",
        en: "ASEGUIM, IRF and WFR accredited guides. Continuous training in first aid and mountain rescue.",
      },
    },
  ];
}
