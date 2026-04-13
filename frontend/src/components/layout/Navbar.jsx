import { useState } from "react";
import { NavLink } from "react-router-dom";
import { FaUser } from "react-icons/fa6";
import siteNav from "../../data/siteNav";
import ThemeToggle from "../ui/ThemeToggle";
import BrandLogo from "../ui/BrandLogo";

function Navbar({ theme, onToggleTheme }) {
  const [menuOpen, setMenuOpen] = useState(false);

  function closeMenu() {
    setMenuOpen(false);
  }

  return (
    <header className="site-header">
      <div className="container site-header__inner">
        <BrandLogo className="site-brand" to="/" />

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

          <NavLink
            to="/account"
            className={({ isActive }) =>
              isActive
                ? "site-account-link is-active"
                : "site-account-link"
            }
            aria-label="Account"
            title="Login or create account"
          >
            <FaUser aria-hidden="true" />
            <span className="site-account-link__label">Account</span>
          </NavLink>
        </nav>

        <div className="site-header__actions site-header__actions--mobile">
          <NavLink
            to="/account"
            className={({ isActive }) =>
              isActive
                ? "site-account-link site-account-link--compact is-active"
                : "site-account-link site-account-link--compact"
            }
            aria-label="Account"
            title="Login or create account"
          >
            <FaUser aria-hidden="true" />
          </NavLink>

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