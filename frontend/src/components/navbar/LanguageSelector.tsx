/**
 * LanguageSelector Component - Using Preact Signals
 */

import { useEffect } from 'preact/hooks';
import type { ComponentChildren } from 'preact';
import { Globe } from 'lucide-preact';
import { language, setLanguage } from '../../stores/preferencesStore';
import { SUPPORTED_LANGUAGES } from '../../lib/constants';
import Dropdown, { type DropdownItem } from '../ui/Dropdown';
import IconButton from '../ui/IconButton';
import i18n from '../../lib/i18n'; // Import i18n directly

export default function LanguageSelector() {

  /**
   * Sync i18next language with signal
   */
  useEffect(() => {
    if (i18n.language !== language.value) {
      i18n.changeLanguage(language.value);
    }
  }, [language.value, i18n]);

  /**
   * Handle language change
   */
  const handleLanguageChange = (newLanguage: string) => {
    setLanguage(newLanguage as 'es' | 'en' | 'pt');
    i18n.changeLanguage(newLanguage);
  };

  /**
   * Convert language options to dropdown items
   */
  const languageItems: DropdownItem[] = SUPPORTED_LANGUAGES.map((lang) => ({
    value: lang.code,
    label: `${lang.flag} ${lang.code.toUpperCase()}`,
    icon: <span className="text-lg">{lang.flag}</span> as ComponentChildren,
  }));

  const triggerContent = (
    <IconButton
      icon={<Globe size={20} /> as ComponentChildren}
      onClick={() => {}}
      ariaLabel="Select language"
      active={false}
    />
  ) as ComponentChildren;

  return (
    <Dropdown
      trigger={triggerContent}
      items={languageItems}
      value={language.value} // Read signal value
      onChange={handleLanguageChange}
    />
  );
}