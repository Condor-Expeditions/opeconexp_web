import type { ComponentChildren } from 'preact';

/**
 * IconButton component props
 */
export interface IconButtonProps {
  /** The icon element to display */
  icon: ComponentChildren;
  /** Click handler callback */
  onClick: () => void;
  /** Accessible label for screen readers */
  ariaLabel: string;
  /** Optional additional CSS classes */
  className?: string;
  /** Whether the button is in an active state */
  active?: boolean;
}

/**
 * Reusable IconButton Component
 * 
 * A fully accessible icon button with hover effects, active state styling,
 * and dark mode support. Perfect for toolbar buttons, navigation icons, etc.
 * 
 * @example
 * ```tsx
 * <IconButton
 *   icon={<MenuIcon />}
 *   onClick={toggleMenu}
 *   ariaLabel="Toggle menu"
 *   active={isMenuOpen}
 * />
 * ```
 */
export default function IconButton({
  icon,
  onClick,
  ariaLabel,
  className = '',
  active = false,
}: IconButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={ariaLabel}
      className={`
        inline-flex items-center justify-center
        p-2 rounded-lg
        transition-all duration-200 ease-in-out
        focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
        dark:focus:ring-offset-gray-900
        ${
          active
            ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
            : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
        }
        hover:scale-105 active:scale-95
        ${className}
      `}
    >
      <span className="w-5 h-5 flex items-center justify-center">
        {icon}
      </span>
    </button>
  );
}