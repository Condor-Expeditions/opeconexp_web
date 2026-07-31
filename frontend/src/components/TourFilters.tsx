import { h } from 'preact';
import { useState, useEffect } from 'preact/hooks';
import { useTranslation } from 'preact-i18next';

interface TourFiltersProps {
  categories: any[];
  difficultyLevels: any[];
  activityTypes: any[];
}

export default function TourFilters({ categories, difficultyLevels, activityTypes }: TourFiltersProps) {
  const { t, i18n } = useTranslation();
  const [filters, setFilters] = useState({
    category: '',
    difficulty: '',
    activity: '',
    location: '',
    minPrice: '',
    maxPrice: '',
    minDuration: '',
    maxDuration: ''
  });

  const [showFilters, setShowFilters] = useState(false);

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const clearFilters = () => {
    setFilters({
      category: '',
      difficulty: '',
      activity: '',
      location: '',
      minPrice: '',
      maxPrice: '',
      minDuration: '',
      maxDuration: ''
    });
  };

  const getActiveFiltersCount = () => {
    return Object.values(filters).filter(value => value !== '').length;
  };

  const getTranslatedName = (item: any, field: string) => {
    const lang = i18n.language;
    switch (lang) {
      case 'en':
        return item[`nameEn`] || item.name;
      case 'pt':
        return item[`namePt`] || item.name;
      default:
        return item.nameEs || item.name;
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
      {/* Filter Toggle */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center space-x-2 text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
            </svg>
            <span className="font-medium">Filtros</span>
            {getActiveFiltersCount() > 0 && (
              <span className="bg-primary-600 text-white text-xs px-2 py-1 rounded-full">
                {getActiveFiltersCount()}
              </span>
            )}
          </button>
        </div>

        {getActiveFiltersCount() > 0 && (
          <button
            onClick={clearFilters}
            className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
          >
            Limpiar filtros
          </button>
        )}
      </div>

      {/* Filters Panel */}
      <div className={`transition-all duration-300 ease-in-out ${showFilters ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0 overflow-hidden'}`}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Category Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Categoría
            </label>
            <select
              value={filters.category}
              onChange={(e) => handleFilterChange('category', e.currentTarget.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="">Todas las categorías</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {getTranslatedName(category, 'name')}
                </option>
              ))}
            </select>
          </div>

          {/* Difficulty Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Dificultad
            </label>
            <select
              value={filters.difficulty}
              onChange={(e) => handleFilterChange('difficulty', e.currentTarget.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="">Todas las dificultades</option>
              {difficultyLevels.map((level) => (
                <option key={level.id} value={level.id}>
                  {getTranslatedName(level, 'name')}
                </option>
              ))}
            </select>
          </div>

          {/* Activity Type Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Tipo de Actividad
            </label>
            <select
              value={filters.activity}
              onChange={(e) => handleFilterChange('activity', e.currentTarget.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="">Todas las actividades</option>
              {activityTypes.map((activity) => (
                <option key={activity.id} value={activity.id}>
                  {getTranslatedName(activity, 'name')}
                </option>
              ))}
            </select>
          </div>

          {/* Location Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Ubicación
            </label>
            <input
              type="text"
              value={filters.location}
              onChange={(e) => handleFilterChange('location', e.currentTarget.value)}
              placeholder="Ej: Cusco, Perú"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            />
          </div>

          {/* Price Range */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Precio Mínimo ($)
            </label>
            <input
              type="number"
              value={filters.minPrice}
              onChange={(e) => handleFilterChange('minPrice', e.currentTarget.value)}
              placeholder="0"
              min="0"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Precio Máximo ($)
            </label>
            <input
              type="number"
              value={filters.maxPrice}
              onChange={(e) => handleFilterChange('maxPrice', e.currentTarget.value)}
              placeholder="1000"
              min="0"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            />
          </div>

          {/* Duration Range */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Duración Mínima
            </label>
            <select
              value={filters.minDuration}
              onChange={(e) => handleFilterChange('minDuration', e.currentTarget.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="">Cualquier duración</option>
              <option value="1">1 día</option>
              <option value="2">2 días</option>
              <option value="3">3 días</option>
              <option value="4">4 días</option>
              <option value="5">5+ días</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Duración Máxima
            </label>
            <select
              value={filters.maxDuration}
              onChange={(e) => handleFilterChange('maxDuration', e.currentTarget.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="">Cualquier duración</option>
              <option value="1">1 día</option>
              <option value="2">2 días</option>
              <option value="3">3 días</option>
              <option value="4">4 días</option>
              <option value="5">5+ días</option>
            </select>
          </div>
        </div>

        {/* Active Filters Display */}
        {getActiveFiltersCount() > 0 && (
          <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
            <div className="flex flex-wrap gap-2">
              {Object.entries(filters).map(([key, value]) => {
                if (!value) return null;

                let label = '';
                switch (key) {
                  case 'category':
                    const category = categories.find(c => c.id === value);
                    label = `Categoría: ${category ? getTranslatedName(category, 'name') : value}`;
                    break;
                  case 'difficulty':
                    const difficulty = difficultyLevels.find(d => d.id === value);
                    label = `Dificultad: ${difficulty ? getTranslatedName(difficulty, 'name') : value}`;
                    break;
                  case 'activity':
                    const activity = activityTypes.find(a => a.id === value);
                    label = `Actividad: ${activity ? getTranslatedName(activity, 'name') : value}`;
                    break;
                  case 'location':
                    label = `Ubicación: ${value}`;
                    break;
                  case 'minPrice':
                    label = `Precio min: $${value}`;
                    break;
                  case 'maxPrice':
                    label = `Precio max: $${value}`;
                    break;
                  case 'minDuration':
                    label = `Duración min: ${value} día${value !== '1' ? 's' : ''}`;
                    break;
                  case 'maxDuration':
                    label = `Duración max: ${value} día${value !== '1' ? 's' : ''}`;
                    break;
                }

                return (
                  <span key={key} className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-primary-100 dark:bg-primary-900 text-primary-800 dark:text-primary-200">
                    {label}
                    <button
                      onClick={() => handleFilterChange(key, '')}
                      className="ml-2 text-primary-600 dark:text-primary-400 hover:text-primary-800 dark:hover:text-primary-200"
                    >
                      ×
                    </button>
                  </span>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}