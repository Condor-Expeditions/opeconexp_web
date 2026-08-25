// src/data/core/content.service.ts
// Contenido estático del sitio (company, team, sustainability, etc.)

import type {
  Company,
  TeamRoot,
  SustainabilityItem,
  Testimonial,
  Stat,
  Differentiator,
} from "./types";

let _company: Company | undefined;
let _team: TeamRoot | undefined;
let _sustainability: SustainabilityItem[] = [];
let _testimonials: Testimonial[] = [];
let _stats: Stat[] = [];

export function setContent(data: {
  company?: Company;
  team?: TeamRoot;
  sustainability?: SustainabilityItem[];
  testimonials?: Testimonial[];
  stats?: Stat[];
}): void {
  if (data.company) _company = data.company;
  if (data.team) _team = data.team;
  if (data.sustainability) _sustainability = data.sustainability;
  if (data.testimonials) _testimonials = data.testimonials;
  if (data.stats) _stats = data.stats;
}

export function getCompany(): Company | undefined {
  return _company;
}

export function getTeam(): TeamRoot | undefined {
  return _team;
}

export function getSustainability(): SustainabilityItem[] {
  return _sustainability;
}

export function getTestimonials(): Testimonial[] {
  return _testimonials;
}

export function getStats(): Stat[] {
  return _stats;
}

// Differentiators — hardcodeados (sin JSON externo)
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