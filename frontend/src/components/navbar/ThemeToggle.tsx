/**
 * ThemeToggle Component - Using Preact Signals
 */

import { useEffect } from 'preact/hooks';
import type { ComponentChildren } from 'preact';
import { Sun, Moon } from 'lucide-preact';
import { theme, setTheme } from '../../stores/preferencesStore';
import IconButton from '../ui/IconButton';

export default function ThemeToggle() {
  /**
   * Apply theme to document root element
   * Using useEffect with theme.value to react to changes
   */
  useEffect(() => {
    if (typeof document === 'undefined') return;

    const root = document.documentElement;
    const currentTheme = theme.value; // Read the signal value

    if (currentTheme === 'dark') {
      root.classList.add('dark');
    } else if (currentTheme === 'light') {
      root.classList.remove('dark');
    } else {
      // System theme
      if (typeof window !== 'undefined') {
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        if (prefersDark) {
          root.classList.add('dark');
        } else {
          root.classList.remove('dark');
        }
      }
    }
  }, [theme.value]); // React to signal changes

  /**
   * Toggle between light and dark themes
   */
  const toggleTheme = () => {
    setTheme(theme.value === 'light' ? 'dark' : 'light');
  };

  // Compute if dark mode is active
  const isDark = theme.value === 'dark' ||
    (theme.value === 'system' && typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches);

  const icon = (isDark ? <Sun size={20} /> : <Moon size={20} />) as ComponentChildren;

  return (
    <IconButton
      icon={icon}
      onClick={toggleTheme}
      ariaLabel={`Switch to ${isDark ? 'light' : 'dark'} mode`}
      active={false}
    />
  );
}