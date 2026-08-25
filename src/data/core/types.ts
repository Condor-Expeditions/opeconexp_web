// src/data/core/types.ts
// Tipos del dominio — separados para SRP

export interface Bilingual {
  es: string;
  en: string;
}

export interface Category {
  id: string;
  title: Bilingual;
  icon?: string;
}

export interface Region {
  id: string;
  title: Bilingual;
}

export interface Tag {
  id: string;
  title: Bilingual;
}

export interface MeetingPoint {
  id: string;
  title: Bilingual;
  location: { lat: number; lng: number };
}

export interface Difficulty {
  id: string;
  title: Bilingual;
  level: number;
}

export interface Operator {
  id: string;
  name: string;
  description?: Bilingual;
}

export interface Price {
  label: Bilingual;
  amount: number;
  currency: string;
}

export interface Include {
  icon: string | null;
  text: Bilingual;
}

export interface Schedule {
  start: string;
  end: string;
  days: string[];
}

export interface ProgramDay {
  day: number;
  title: Bilingual;
  description: Bilingual;
  image?: string;
}

export interface ItineraryDay {
  day: number;
  stops: ItineraryStop[];
  meals: string[];
  meals_not_included: string[];
}

export interface ItineraryStop {
  time: string;
  title: Bilingual;
  description: Bilingual;
  image?: string;
}

export interface Accommodation {
  name: Bilingual;
  type: string;
}

export interface MediaItem {
  type: string;
  src: string;
  alt: Bilingual;
}

export interface Tour {
  id: string;
  slug: string;
  type: string;
  status: string;
  title: Bilingual;
  description: Bilingual;
  categories: Category[];
  regions: string[];
  tags: Tag[];
  operator: string;
  meetingPoints: MeetingPoint[];
  duration: string;
  difficulty: string;
  prices: Price[];
  includes: Include[];
  schedules: Schedule[];
  gallery: MediaItem[];
  seo: { title: Bilingual; description: Bilingual };
  createdAt: string;
  updatedAt: string;
  image: string;
  map: { lat: number; lng: number };
  itinerary: ItineraryDay[];
  reviews: unknown[];
  accommodations: Accommodation[];
  seasons: { high: string[]; low: string[] };
  bookingUrl?: string;
}

export interface Review {
  id: string;
  tourId: string;
  author: string;
  rating: number;
  comment: Bilingual;
  date: string;
}

export interface RatingSummary {
  average: number;
  count: number;
}

export interface Testimonial {
  text: Bilingual;
  name: string;
  country: string;
  city: string;
  expedition: Bilingual;
  stars: number;
}

export interface Stat {
  value: number;
  suffix: string;
  label: Bilingual;
}

export interface Company {
  name: string;
  author: string;
  seo: { description: Bilingual; keywords: Bilingual };
  contact: {
    address: Bilingual;
    scheduleWeekdays: Bilingual;
    scheduleWeekends: Bilingual;
    phone: { name: string; href: string };
    email: { name: string; href: string };
    whatsapp: string;
    maps: string;
  };
  socials: { name: string; href: string; icon: string }[];
}

export interface SustainabilityItem {
  icon: string;
  title: Bilingual;
  text: Bilingual;
}

export interface TeamMember {
  name: string;
  role: string;
  bio?: Bilingual;
  image?: string;
}

export interface TeamRoot {
  equipo: TeamMember[];
  proposito: Bilingual;
  values: { id: string; title: Bilingual; description: Bilingual }[];
}

export interface Differentiator {
  icon: string;
  title: Bilingual;
  description: Bilingual;
}

export interface CartItem {
  tourId: string;
  tourSlug: string;
  tourTitle: Bilingual;
  date: string;
  time: string;
  adults: number;
  children: number;
  unitPrice: number;
  total: number;
}