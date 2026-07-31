/**
 * src/stores/preferencesStore.ts
 * State management using Preact Signals
 * Simple, lightweight, and perfect for Astro + Preact
 */

import { signal, computed } from '@preact/signals';
import type { Language, Currency, Theme } from './types';
import {
  DEFAULTLANGUAGE,
  DEFAULTCURRENCY,
  DEFAULTTHEME,
  PREFERENCES_STORAGE_KEY,
} from '../lib/constants';

/**
 * Interface for stored preferences
 */
interface StoredPreferences {
  language?: Language;
  currency?: Currency;
  theme?: Theme;
}

/**
 * Safely parse JSON from localStorage
 */
const getStoredPreferences = (): StoredPreferences | null => {
  if (typeof window === 'undefined') return null;
  
  try {
    const stored = localStorage.getItem(PREFERENCES_STORAGE_KEY);
    return stored ? JSON.parse(stored) : null;
  } catch (error) {
    console.error('Failed to parse stored preferences:', error);
    return null;
  }
};

/**
 * Save preferences to localStorage
 */
const savePreferences = (preferences: StoredPreferences): void => {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.setItem(PREFERENCES_STORAGE_KEY, JSON.stringify(preferences));
  } catch (error) {
    console.error('Failed to save preferences:', error);
  }
};

/**
 * Initialize preferences from localStorage
 */
const initializePreferences = (): StoredPreferences => {
  const stored = getStoredPreferences();
  return {
    language: stored?.language || DEFAULTLANGUAGE,
    currency: stored?.currency || DEFAULTCURRENCY,
    theme: stored?.theme || DEFAULTTHEME,
  };
};

// Initialize with stored or default values
const initial = initializePreferences();

/**
 * Signals for preferences state
 * These are reactive and can be used directly in components
 */
export const language = signal<Language>(initial.language);
export const currency = signal<Currency>(initial.currency);
export const theme = signal<Theme>(initial.theme);

/**
 * Computed value for checking if initialized
 */
export const isInitialized = signal<boolean>(false);

/**
 * Actions to update preferences
 */
export const setLanguage = (newLanguage: Language) => {
  language.value = newLanguage;
  savePreferences({
    language: newLanguage,
    currency: currency.value,
    theme: theme.value,
  });
};

export const setCurrency = (newCurrency: Currency) => {
  currency.value = newCurrency;
  savePreferences({
    language: language.value,
    currency: newCurrency,
    theme: theme.value,
  });
};

export const setTheme = (newTheme: Theme) => {
  theme.value = newTheme;
  savePreferences({
    language: language.value,
    currency: currency.value,
    theme: newTheme,
  });
};

/**
 * Initialize from storage (call on app mount)
 */
export const initializeFromStorage = () => {
  if (typeof window === 'undefined') return;
  
  const stored = getStoredPreferences();
  if (stored) {
    if (stored.language) language.value = stored.language;
    if (stored.currency) currency.value = stored.currency;
    if (stored.theme) theme.value = stored.theme;
  }
  isInitialized.value = true;
};

/**
 * Computed values (optional, for convenience)
 */
export const preferences = computed(() => ({
  language: language.value,
  currency: currency.value,
  theme: theme.value,
}));