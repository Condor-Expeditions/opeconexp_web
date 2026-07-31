/**
 * Application constants for supported languages and currencies
 */

import type { LanguageOption, CurrencyOption } from '../stores/types';

/**
 * Supported languages with metadata
 * Spanish is the default language for Condor Expeditions
 */
export const SUPPORTED_LANGUAGES: LanguageOption[] = [
  {
    code: 'es',
    name: 'Spanish',
    nativeName: 'Español',
    flag: '🇪🇸',
  },
  {
    code: 'en',
    name: 'English',
    nativeName: 'English',
    flag: '🇺🇸',
  },
  {
    code: 'pt',
    name: 'Portuguese',
    nativeName: 'Português',
    flag: '🇧🇷',
  },
];

/**
 * Supported currencies with metadata
 * USD is the default currency for international bookings
 */
export const SUPPORTED_CURRENCIES: CurrencyOption[] = [
  {
    code: 'USD',
    name: 'US Dollar',
    symbol: '$',
    flag: '🇺🇸',
  },
  {
    code: 'EUR',
    name: 'Euro',
    symbol: '€',
    flag: '🇪🇺',
  },
  {
    code: 'PEN',
    name: 'Peruvian Sol',
    symbol: 'S/',
    flag: '🇵🇪',
  },
];

/**
 * Default language for the application
 */
export const DEFAULTLANGUAGE = 'es';

/**
 * Default currency for the application
 */
export const DEFAULTCURRENCY = 'USD';

/**
 * Default theme for the application
 */
export const DEFAULTTHEME = 'light';

/**
 * Tour categories for Condor Expeditions
 */
export const TOUR_CATEGORIES = [
  {
    id: 'trekking',
    name: 'Trekking',
    nameEs: 'Trekking',
    nameEn: 'Trekking',
    namePt: 'Trekking',
    icon: '🏔️',
    description: 'Rutas de montaña y senderismo',
  },
  {
    id: 'cultural',
    name: 'Cultural',
    nameEs: 'Cultural',
    nameEn: 'Cultural',
    namePt: 'Cultural',
    icon: '🏛️',
    description: 'Experiencias culturales y arqueológicas',
  },
  {
    id: 'adventure',
    name: 'Aventura',
    nameEs: 'Aventura',
    nameEn: 'Adventure',
    namePt: 'Aventura',
    icon: '⚡',
    description: 'Actividades de aventura extrema',
  },
  {
    id: 'nature',
    name: 'Naturaleza',
    nameEs: 'Naturaleza',
    nameEn: 'Nature',
    namePt: 'Natureza',
    icon: '🌿',
    description: 'Observación de flora y fauna',
  },
  {
    id: 'photography',
    name: 'Fotografía',
    nameEs: 'Fotografía',
    nameEn: 'Photography',
    namePt: 'Fotografia',
    icon: '📸',
    description: 'Tours especializados en fotografía',
  },
  {
    id: 'family',
    name: 'Familiar',
    nameEs: 'Familiar',
    nameEn: 'Family',
    namePt: 'Familiar',
    icon: '👨‍👩‍👧‍👦',
    description: 'Actividades para toda la familia',
  },
];

/**
 * Difficulty levels for tours
 */
export const DIFFICULTY_LEVELS = [
  {
    id: 'easy',
    name: 'Fácil',
    nameEn: 'Easy',
    namePt: 'Fácil',
    color: 'green',
  },
  {
    id: 'moderate',
    name: 'Moderado',
    nameEn: 'Moderate',
    namePt: 'Moderado',
    color: 'yellow',
  },
  {
    id: 'challenging',
    name: 'Desafiante',
    nameEn: 'Challenging',
    namePt: 'Desafiador',
    color: 'orange',
  },
  {
    id: 'extreme',
    name: 'Extremo',
    nameEn: 'Extreme',
    namePt: 'Extremo',
    color: 'red',
  },
];

/**
 * Activity types for tours
 */
export const ACTIVITY_TYPES = [
  {
    id: 'hiking',
    name: 'Caminata',
    nameEn: 'Hiking',
    namePt: 'Caminhada',
  },
  {
    id: 'climbing',
    name: 'Escalada',
    nameEn: 'Climbing',
    namePt: 'Escalada',
  },
  {
    id: 'rafting',
    name: 'Rafting',
    nameEn: 'Rafting',
    namePt: 'Rafting',
  },
  {
    id: 'cultural_visit',
    name: 'Visita Cultural',
    nameEn: 'Cultural Visit',
    namePt: 'Visita Cultural',
  },
  {
    id: 'wildlife',
    name: 'Observación de Vida Silvestre',
    nameEn: 'Wildlife Watching',
    namePt: 'Observação da Vida Selvagem',
  },
  {
    id: 'photography',
    name: 'Sesión Fotográfica',
    nameEn: 'Photography Session',
    namePt: 'Sessão Fotográfica',
  },
];

/**
 * Default language for the application
 */
export const DEFAULT_LANGUAGE = 'es';

/**
 * Default currency for the application
 */
export const DEFAULT_CURRENCY = 'USD';

/**
 * Default theme for the application
 */
export const DEFAULT_THEME = 'light';

/**
 * LocalStorage key for persisting user preferences
 */
export const PREFERENCES_STORAGE_KEY = 'condor-preferences';