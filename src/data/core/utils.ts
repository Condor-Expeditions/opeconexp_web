// src/data/core/utils.ts
// Utilidades puras — sin dependencias de datos (SRP)

/**
 * Resuelve el texto en el idioma solicitado con fallback a "es".
 * Compat: acepta { title: Record } | Record<string, string>
 */
export function resolveLabel(
  item: { title: Record<string, string> } | Record<string, string> | undefined,
  lang: string,
  fallbackLang = "es",
): string {
  if (!item) return "";
  const texts: Record<string, string> = "title" in item ? item.title : item;
  return texts[lang] ?? texts[fallbackLang ?? ""] ?? Object.values(texts)[0] ?? "";
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

const DAY_LABELS: Record<string, Record<string, string>> = {
  mon: { es: "Lun", en: "Mon" },
  tue: { es: "Mar", en: "Tue" },
  wed: { es: "Mié", en: "Wed" },
  thu: { es: "Jue", en: "Thu" },
  fri: { es: "Vie", en: "Fri" },
  sat: { es: "Sáb", en: "Sat" },
  sun: { es: "Dom", en: "Sun" },
};

export function getTourScheduleText(s: Schedule, lang: string): string {
  if (s.days.length === 7) {
    return lang === "es" ? "Todos los días" : "Every day";
  }
  return s.days.map((d) => DAY_LABELS[d]?.[lang] ?? d).join(", ");
}

/**
 * Helper para validar paths de imagen.
 * PASSTHROUGH: mantiene el path original para que funcione con imágenes
 * subidas a /public/images/. El onerror JS del <img> maneja el fallback.
 * Solo genera placehold.co cuando imgPath es undefined (sin path).
 */
export function getValidImageUrl(
  imgPath: string | undefined,
  altText: string = "Tour",
): string {
  if (!imgPath) {
    const encodedText = encodeURIComponent(altText || "Tour");
    return `https://placehold.co/800x400?text=${encodedText}&font=montserrat`;
  }
  return imgPath;
}

/**
 * Helper DRY: extrae el .src de ImageMetadata (astro:assets) o string.
 * Unifica el manejo de imágenes locales vs remotas.
 */
export function resolveImageSrc(
  img: string | { src: string } | undefined | null,
  altText: string = "Tour",
): string {
  if (!img) {
    return getValidImageUrl(undefined, altText);
  }
  if (typeof img === "string") {
    return img;
  }
  return img.src;
}

export function renderStars(rating: number): string {
  const full = "★".repeat(Math.floor(rating));
  const half = rating % 1 >= 0.5 ? "½" : "";
  const empty = "☆".repeat(5 - Math.ceil(rating));
  return full + half + empty;
}