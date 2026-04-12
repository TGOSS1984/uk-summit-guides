import { FaSnowflake, FaSun } from "react-icons/fa";

function ThemeToggle({ theme, onToggleTheme, compact = false }) {
  const isWinter = theme === "winter";
  const label = isWinter ? "Winter" : "Summer";
  const Icon = isWinter ? FaSnowflake : FaSun;

  return (
    <button
      type="button"
      className={compact ? "theme-toggle theme-toggle--compact" : "theme-toggle"}
      onClick={onToggleTheme}
      aria-label={`Switch theme. Current theme: ${label}`}
      title={label}
    >
      <span className="theme-toggle__theme-icon" aria-hidden="true">
        <Icon />
      </span>

      {!compact && <span className="theme-toggle__label">{label}</span>}

      <span className="theme-toggle__track" aria-hidden="true">
        <span className="theme-toggle__thumb" />
      </span>
    </button>
  );
}

export default ThemeToggle;