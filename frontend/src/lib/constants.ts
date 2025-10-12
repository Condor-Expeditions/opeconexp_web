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