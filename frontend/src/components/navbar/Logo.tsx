/**
 * Logo Component
 * 
 * Clickable logo that navigates to the home page.
 * Features the condor emoji and company name with hover effects and dark mode support.
 */

/**
 * Logo component props
 */
export interface LogoProps {
  /** Optional additional CSS classes */
  className?: string;
}

/**
 * Logo Component
 * 
 * Displays the Condor Expeditions logo with a clickable link to the home page.
 * Includes hover effects and full dark mode support.
 * 
 * @example
 * ```tsx
 * <Logo />
 * <Logo className="custom-class" />
 * ```
 */
export default function Logo({ className = '' }: LogoProps) {
  return (
    <a
      href="/"
      className={`
        inline-flex items-center gap-2
        text-xl font-bold
        text-gray-900 dark:text-white
        transition-all duration-200 ease-in-out
        hover:opacity-80 hover:scale-105
        focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
        dark:focus:ring-offset-gray-900
        rounded-lg px-2 py-1
        ${className}
      `}
      aria-label="Condor Expeditions - Go to home page"
    >
      <span className="text-2xl" role="img" aria-label="Condor">
        🦅
      </span>
      <span className="hidden sm:inline">Condor Expeditions</span>
    </a>
  );
}