// src/components/navbar/Navbar.tsx
import { useState, useEffect } from 'preact/hooks';
import { useTranslation } from 'preact-i18next';
import Logo from './Logo';
import ThemeToggle from './ThemeToggle';
import LanguageSelector from './LanguageSelector';
import CurrencySelector from './CurrencySelector';
import { initializeFromStorage, isInitialized } from '../../stores/preferencesStore';

const NavbarSkeleton = () => (
  <nav className="bg-white dark:bg-gray-900 shadow-sm border-b border-gray-200 dark:border-gray-800 sticky top-0 z-50">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex justify-between items-center h-16">
        <div className="w-32 h-8 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
        <div className="hidden md:flex items-center space-x-8">
          <div className="w-16 h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
          <div className="w-16 h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
          <div className="w-16 h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
        </div>
        <div className="hidden md:flex items-center space-x-4">
          <div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
          <div className="w-16 h-6 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
          <div className="w-16 h-6 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
        </div>
        <div className="md:hidden flex items-center space-x-2">
          <div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
          <div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
        </div>
      </div>
    </div>
  </nav>
);

const Navbar = () => {
  const { t, i18n } = useTranslation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isI18nReady, setIsI18nReady] = useState(i18n.isInitialized);

  useEffect(() => {
    // Initialize preferences from localStorage
    initializeFromStorage();
    
    // Wait for i18next to be ready
    if (!i18n.isInitialized) {
      const checkI18n = setInterval(() => {
        if (i18n.isInitialized) {
          setIsI18nReady(true);
          clearInterval(checkI18n);
        }
      }, 50);
      
      // Cleanup
      return () => clearInterval(checkI18n);
    } else {
      setIsI18nReady(true);
    }
  }, [i18n]);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  // Show skeleton while initializing or i18n not ready
  if (!isInitialized.value || !isI18nReady) {
    return <NavbarSkeleton />;
  }

  return (
    <nav className="bg-white dark:bg-gray-900 shadow-sm border-b border-gray-200 dark:border-gray-800 fixed top-0 left-0 right-0 z-50 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Logo />

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <a
              href="/tours"
              className="text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 px-3 py-2 text-sm font-medium transition-colors"
            >
              {t('nav.tours')}
            </a>
            <a
              href="/about"
              className="text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 px-3 py-2 text-sm font-medium transition-colors"
            >
              {t('nav.about')}
            </a>
            <a
              href="/contact"
              className="text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 px-3 py-2 text-sm font-medium transition-colors"
            >
              {t('nav.contact')}
            </a>
          </div>

          {/* Desktop Controls */}
          <div className="hidden md:flex items-center space-x-4">
            <ThemeToggle />
            <LanguageSelector />
            <CurrencySelector />
            
            <div className="flex items-center space-x-3 ml-4 pl-4 border-l border-gray-200 dark:border-gray-700">
              <a
                href="/login"
                className="text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 px-3 py-2 text-sm font-medium transition-colors"
              >
                {t('nav.login')}
              </a>
              <a
                href="/register"
                className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
              >
                {t('nav.register')}
              </a>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center space-x-2">
            <ThemeToggle />
            <button
              type="button"
              onClick={toggleMobileMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 dark:text-gray-500 hover:text-gray-500 dark:hover:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500 transition-colors"
              aria-expanded={isMobileMenuOpen}
              aria-label={t('nav.toggleMenu')}
            >
              <span className="sr-only">{t('nav.toggleMenu')}</span>
              {isMobileMenuOpen ? (
                <svg className="block h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="block h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div className={`md:hidden transition-all duration-300 ease-in-out ${
        isMobileMenuOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0 overflow-hidden'
      }`}>
        <div className="px-2 pt-2 pb-3 space-y-1 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
          <a href="/tours" onClick={closeMobileMenu} className="text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-gray-50 dark:hover:bg-gray-800 block px-3 py-2 rounded-md text-base font-medium transition-colors">
            {t('nav.tours')}
          </a>
          <a href="/about" onClick={closeMobileMenu} className="text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-gray-50 dark:hover:bg-gray-800 block px-3 py-2 rounded-md text-base font-medium transition-colors">
            {t('nav.about')}
          </a>
          <a href="/contact" onClick={closeMobileMenu} className="text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-gray-50 dark:hover:bg-gray-800 block px-3 py-2 rounded-md text-base font-medium transition-colors">
            {t('nav.contact')}
          </a>

          <div className="pt-4 pb-3 border-t border-gray-200 dark:border-gray-700">
            <div className="px-3 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{t('nav.language')}</span>
                <LanguageSelector />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{t('nav.currency')}</span>
                <CurrencySelector />
              </div>
            </div>
          </div>

          <div className="pt-4 pb-3 border-t border-gray-200 dark:border-gray-700">
            <div className="px-3 space-y-2">
              <a href="/login" onClick={closeMobileMenu} className="text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-gray-50 dark:hover:bg-gray-800 block px-3 py-2 rounded-md text-base font-medium transition-colors">
                {t('nav.login')}
              </a>
              <a href="/register" onClick={closeMobileMenu} className="bg-primary-600 hover:bg-primary-700 text-white block px-3 py-2 rounded-md text-base font-medium text-center transition-colors">
                {t('nav.register')}
              </a>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;