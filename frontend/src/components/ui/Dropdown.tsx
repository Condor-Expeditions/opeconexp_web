import { useState, useEffect, useRef } from 'preact/hooks';
import type { ComponentChildren } from 'preact';

/**
 * Dropdown menu item interface
 */
export interface DropdownItem {
  value: string;
  label: string;
  icon?: ComponentChildren;
}

/**
 * Dropdown component props
 */
export interface DropdownProps {
  /** The trigger element that opens the dropdown */
  trigger: ComponentChildren;
  /** Array of dropdown items */
  items: DropdownItem[];
  /** Currently selected value */
  value?: string;
  /** Callback when an item is selected */
  onChange: (value: string) => void;
  /** Optional additional CSS classes */
  className?: string;
}

/**
 * Reusable Dropdown Component
 * 
 * A fully accessible dropdown menu with keyboard navigation,
 * click-outside-to-close, and dark mode support.
 * 
 * @example
 * ```tsx
 * <Dropdown
 *   trigger={<button>Select Language</button>}
 *   items={[
 *     { value: 'en', label: 'English', icon: <FlagIcon /> },
 *     { value: 'es', label: 'Español', icon: <FlagIcon /> }
 *   ]}
 *   value={currentLang}
 *   onChange={setLanguage}
 * />
 * ```
 */
export default function Dropdown({
  trigger,
  items,
  value,
  onChange,
  className = '',
}: DropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  /**
   * Handle click outside to close dropdown
   */
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  /**
   * Handle keyboard navigation
   */
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  /**
   * Handle item selection
   */
  const handleItemClick = (itemValue: string) => {
    onChange(itemValue);
    setIsOpen(false);
  };

  /**
   * Toggle dropdown open/closed
   */
  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div ref={dropdownRef} className={`relative inline-block ${className}`}>
      {/* Trigger Button */}
      <div
        onClick={toggleDropdown}
        role="button"
        tabIndex={0}
        aria-haspopup="true"
        aria-expanded={isOpen}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            toggleDropdown();
          }
        }}
      >
        {trigger}
      </div>

      {/* Dropdown Menu */}
      {isOpen && (
        <div
          className="absolute right-0 mt-2 w-48 rounded-lg bg-white dark:bg-gray-800 shadow-lg ring-1 ring-black ring-opacity-5 z-50 transition-all duration-200 ease-out"
          role="menu"
          aria-orientation="vertical"
        >
          <div className="py-1">
            {items.map((item) => (
              <button
                key={item.value}
                onClick={() => handleItemClick(item.value)}
                className={`
                  w-full text-left px-4 py-2 text-sm flex items-center gap-3
                  transition-colors duration-150
                  ${
                    value === item.value
                      ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300'
                      : 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }
                `}
                role="menuitem"
                aria-label={item.label}
              >
                {item.icon && (
                  <span className="flex-shrink-0 w-5 h-5 flex items-center justify-center">
                    {item.icon}
                  </span>
                )}
                <span className="flex-1">{item.label}</span>
                {value === item.value && (
                  <svg
                    className="w-4 h-4 text-blue-600 dark:text-blue-400"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}