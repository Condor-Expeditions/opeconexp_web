import { h } from 'preact';
import { useState } from 'preact/hooks';
import { useTranslation } from 'preact-i18next';
import { TOUR_CATEGORIES } from '../../lib/constants';

interface TourDropdownProps {
  isOpen: boolean;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
}

export default function TourDropdown({ isOpen, onMouseEnter, onMouseLeave }: TourDropdownProps) {
  const { i18n } = useTranslation();

  const getCategoryName = (category: any) => {
    const lang = i18n.language;
    switch (lang) {
      case 'en':
        return category.nameEn;
      case 'pt':
        return category.namePt;
      default:
        return category.nameEs;
    }
  };

  return (
    <div
      className={`absolute top-full left-0 mt-1 w-64 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 transition-all duration-200 ${
        isOpen ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible -translate-y-2'
      }`}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <div className="p-2">
        <div className="px-3 py-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
          Categorías de Tours
        </div>
        <div className="space-y-1">
          {TOUR_CATEGORIES.map((category) => (
            <a
              key={category.id}
              href={`/tours/${category.id}`}
              className="flex items-center px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-primary-600 dark:hover:text-primary-400 rounded-md transition-colors group"
            >
              <span className="text-lg mr-3">{category.icon}</span>
              <div className="flex-1">
                <div className="font-medium">{getCategoryName(category)}</div>
                <div className="text-xs text-gray-500 dark:text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300">
                  {category.description}
                </div>
              </div>
            </a>
          ))}
        </div>
        <div className="border-t border-gray-200 dark:border-gray-700 mt-2 pt-2">
          <a
            href="/tours"
            className="block px-3 py-2 text-sm text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-medium text-center rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            Ver todos los tours →
          </a>
        </div>
      </div>
    </div>
  );
}