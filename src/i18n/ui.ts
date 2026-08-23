// src/i18n/ui.ts — Centralización de traducciones
// Reemplaza los translations.json dispersos con un mapa de idioma estructurado

export const ui = {
  es: {
    // Navegación
    nav: {
      tours: "Tours",
      destinos: "Destinos",
      experiencias: "Experiencias",
      sobreNosotros: "Sobre Nosotros",
      contacto: "Contacto",
      blog: "Blog",
      inicio: "Inicio",
    },
    // Botones
    buttons: {
      reservar: "Reservar",
      reservarTour: "Reservar este tour",
      verMas: "Ver más",
      enviar: "Enviar",
      buscar: "Buscar",
      filtrar: "Filtrar",
      limpiar: "Limpiar",
      bookNow: "Book Now",
      backToHome: "Volver al inicio",
    },
    // Labels de tours
    tour: {
      duracion: "Duración",
      dias: "Días",
      capacidad: "Capacidad",
      dificultad: "Dificultad",
      incluye: "Incluye",
      noIncluye: "No incluye",
      queLlevar: "Qué llevar",
      itinerario: "Itinerario",
      actividades: "Actividades",
      puntosEncuentro: "Puntos de encuentro",
      precios: "Precios",
      general: "General",
      especial: "Especial",
      desde: "Desde",
    },
    // Mensajes
    messages: {
      titulo404: "Página no encontrada",
      mensaje404: "La página que buscas no existe o ha sido movida.",
      titulo400: "Solicitud incorrecta",
      mensaje400: "La página que solicitaste contiene parámetros inválidos.",
      titulo500: "Error de servidor",
      mensaje500: "Algo salió mal en nuestro lado. Nuestro equipo ha sido notificado y está trabajando en ello.",
      noResultados: "No se encontraron tours que coincidan con tus filtros.",
    },
    // Secciones
    sections: {
      numerosTitulo: "Nuestros Números",
      numerosSub: "Números que cuentan nuestra historia de aventura e impacto.",
      sostenibilidadTitulo: "Sostenibilidad",
      sostenibilidadSub: "Turismo responsable para un futuro mejor.",
      testimoniosTitulo: "Lo que dicen nuestros viajeros",
      experienciasTitulo: "Expediciones Auténticas",
      destinosTitulo: "Destinos Únicos",
    },
  },
  en: {
    nav: {
      tours: "Tours",
      destinos: "Destinations",
      experiencias: "Experiences",
      sobreNosotros: "About Us",
      contacto: "Contact",
      blog: "Blog",
      inicio: "Home",
    },
    buttons: {
      reservar: "Book",
      reservarTour: "Book This Tour",
      verMas: "See More",
      enviar: "Send",
      buscar: "Search",
      filtrar: "Filter",
      limpiar: "Clear",
      bookNow: "Book Now",
      backToHome: "Back to home",
    },
    tour: {
      duracion: "Duration",
      dias: "Days",
      capacidad: "Capacity",
      dificultad: "Difficulty",
      incluye: "Includes",
      noIncluye: "Not included",
      queLlevar: "What to bring",
      itinerario: "Itinerary",
      actividades: "Activities",
      puntosEncuentro: "Meeting points",
      precios: "Pricing",
      general: "General",
      especial: "Special",
      desde: "From",
    },
    messages: {
      titulo404: "Page Not Found",
      mensaje404: "The page you are looking for doesn't exist or has been moved.",
      titulo400: "Bad Request",
      mensaje400: "The page you requested contains invalid parameters.",
      titulo500: "Server Error",
      mensaje500: "Something went wrong on our end. Our team has been notified and is working on it.",
      noResultados: "No tours match your filters.",
    },
    sections: {
      numerosTitulo: "Our Numbers",
      numerosSub: "Numbers that tell our story of adventure and impact.",
      sostenibilidadTitulo: "Sustainability",
      sostenibilidadSub: "Responsible tourism for a better future.",
      testimoniosTitulo: "What Travelers Say",
      experienciasTitulo: "Authentic Expeditions",
      destinosTitulo: "Unique Destinations",
    },
  },
};

// Helper para resolver labels
export function t(key: string, lang: "es" | "en" = "es"): string {
  const keys = key.split(".");
  let result: any = ui[lang as keyof typeof ui];
  for (const k of keys) {
    if (result && typeof result === "object") {
      result = result[k];
    } else {
      return key;
    }
  }
  return typeof result === "string" ? result : key;
}