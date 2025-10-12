/**
 * i18next configuration for internationalization
 * Supports Spanish (default), English, and Portuguese
 * Configured for client-side usage with Preact
 */

import i18n from 'i18next';
import { initReactI18next } from 'preact-i18next';
import esTranslations from './translations/es.json';
import enTranslations from './translations/en.json';
import ptTranslations from './translations/pt.json';

// Initialize i18n immediately
i18n
  .use(initReactI18next)
  .init({
    resources: {
      es: {
        translation: esTranslations,
      },
      en: {
        translation: enTranslations,
      },
      pt: {
        translation: ptTranslations,
      },
    },
    lng: 'es', // Default language (Spanish)
    fallbackLng: 'es', // Fallback to Spanish if translation is missing
    interpolation: {
      escapeValue: false, // Preact already escapes values
    },
    react: {
      useSuspense: false, // Disable suspense for client-side compatibility
      bindI18n: 'languageChanged loaded',
      bindI18nStore: 'added removed',
      transEmptyNodeValue: '',
      transSupportBasicHtmlNodes: true,
      transKeepBasicHtmlNodesFor: ['br', 'strong', 'i', 'em', 'p'],
    },
    // Client-side compatibility settings
    compatibilityJSON: 'v3',
    // Debug mode (set to false in production)
    debug: false,
  });

export default i18n;