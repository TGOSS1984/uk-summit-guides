import { useState } from "react";
import { NavLink } from "react-router-dom";
import siteNav from "../../data/siteNav";
import ThemeToggle from "../ui/ThemeToggle";

function Navbar({ theme, onToggleTheme }) {
  const [menuOpen, setMenuOpen] = useState(false);

  function closeMenu() {
    setMenuOpen(false);
  }

  return (
    <header className="site-header">
      <div className="container site-header__inner">
        <NavLink to="/" className="site-logo" onClick={closeMenu}>
          <span className="site-logo__mark" />
          <span className="site-logo__text">UK Summit Guides</span>
        </NavLink>

        <nav className="site-nav site-nav--desktop" aria-label="Primary">
          {siteNav.map((item) => (
            <NavLink
              key={item.href}
              to={item.href}
              className={({ isActive }) =>
                isActive ? "site-nav__link is-active" : "site-nav__link"
              }
            >
              {item.label}
            </NavLink>
          ))}
          <ThemeToggle theme={theme} onToggleTheme={onToggleTheme} />
        </nav>

        <div className="site-header__actions">
          <ThemeToggle theme={theme} onToggleTheme={onToggleTheme} compact />
          <button
            type="button"
            className="menu-toggle"
            aria-label="Toggle menu"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((open) => !open)}
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </div>

      <div className={menuOpen ? "mobile-menu is-open" : "mobile-menu"}>
        <div className="container mobile-menu__inner">
          <nav className="mobile-nav" aria-label="Mobile primary">
            {siteNav.map((item) => (
              <NavLink
                key={item.href}
                to={item.href}
                className={({ isActive }) =>
                  isActive ? "mobile-nav__link is-active" : "mobile-nav__link"
                }
                onClick={closeMenu}
              >
                {item.label}
              </NavLink>
            ))}
          </nav>
        </div>
      </div>
    </header>
  );
}

export default Navbar;