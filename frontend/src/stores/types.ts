/**
 * Type definitions for the preferences store
 * Used for managing user preferences across the application
 */

/**
 * Supported language codes
 */
export type Language = 'es' | 'en' | 'pt';

/**
 * Supported currency codes
 */
export type Currency = 'USD' | 'EUR' | 'PEN';

/**
 * Theme options for the application
 */
export type Theme = 'light' | 'dark' | 'system';

/**
 * Language metadata including display information
 */
export interface LanguageOption {
  code: Language;
  name: string;
  nativeName: string;
  flag: string;
}

/**
 * Currency metadata including display information
 */
export interface CurrencyOption {
  code: Currency;
  name: string;
  symbol: string;
  flag: string;
}

/**
 * Complete preferences state structure
 */
export interface PreferencesState {
  language: Language;
  currency: Currency;
  theme: Theme;
  setLanguage: (language: Language) => void;
  setCurrency: (currency: Currency) => void;
  setTheme: (theme: Theme) => void;
  initializeFromStorage: () => void;
}