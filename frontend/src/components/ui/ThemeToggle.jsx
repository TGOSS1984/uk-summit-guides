function ThemeToggle({ theme, onToggleTheme, compact = false }) {
  return (
    <button
      type="button"
      className={compact ? "theme-toggle theme-toggle--compact" : "theme-toggle"}
      onClick={onToggleTheme}
      aria-label="Switch seasonal theme"
    >
      <span className="theme-toggle__label">
        {theme === "winter" ? "Winter" : "Summer"}
      </span>
      <span className="theme-toggle__track">
        <span className="theme-toggle__thumb" />
      </span>
    </button>
  );
}

export default ThemeToggle;