import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import {
  FaAddressBook,
  FaBookOpen,
  FaCalendarDays,
  FaHouse,
  FaImage,
  FaMountain,
  FaRightFromBracket,
  FaRoute,
  FaUser,
} from "react-icons/fa6";
import siteNav from "../../data/siteNav";
import { getCurrentUser, logoutUser } from "../../lib/api";
import ThemeToggle from "../ui/ThemeToggle";
import BrandLogo from "../ui/BrandLogo";

function Navbar({ theme, onToggleTheme }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  function closeMenu() {
    setMenuOpen(false);
  }

  useEffect(() => {
    let isMounted = true;

    async function loadCurrentUser() {
      try {
        setAuthLoading(true);
        const currentUser = await getCurrentUser();

        if (isMounted) {
          setUser(currentUser);
        }
      } catch {
        if (isMounted) {
          setUser(null);
        }
      } finally {
        if (isMounted) {
          setAuthLoading(false);
        }
      }
    }

    loadCurrentUser();

    function handleAuthChanged() {
      loadCurrentUser();
    }

    window.addEventListener("auth-changed", handleAuthChanged);

    return () => {
      isMounted = false;
      window.removeEventListener("auth-changed", handleAuthChanged);
    };
  }, []);

  useEffect(() => {
    function handleResize() {
      if (window.innerWidth > 900) {
        setMenuOpen(false);
      }
    }

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  async function handleLogout() {
    try {
      setIsLoggingOut(true);
      await logoutUser();
      setUser(null);
      setMenuOpen(false);
      window.dispatchEvent(new Event("auth-changed"));
    } catch {
      // Keep this silent in the navbar for now.
    } finally {
      setIsLoggingOut(false);
    }
  }

  const accountLabel = authLoading
    ? "Account"
    : user?.first_name || user?.username || "Account";

  const mobileNavIcons = {
    "/": FaHouse,
    "/about": FaMountain,
    "/services": FaBookOpen,
    "/routes": FaRoute,
    "/gallery": FaImage,
    "/book-now": FaCalendarDays,
    "/contact": FaAddressBook,
  };

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
            title={user ? "My account" : "Login or create account"}
          >
            <FaUser aria-hidden="true" />
            <span className="site-account-link__label">{accountLabel}</span>
          </NavLink>

          {user ? (
            <button
              type="button"
              className="site-logout-link"
              onClick={handleLogout}
              disabled={isLoggingOut}
              aria-label="Logout"
              title="Logout"
            >
              <FaRightFromBracket aria-hidden="true" />
              <span className="site-logout-link__label">
                {isLoggingOut ? "Logging out..." : "Logout"}
              </span>
            </button>
          ) : null}
        </nav>

        <div className="site-header__actions site-header__actions--mobile">
          <NavLink
            to="/account"
            className={({ isActive }) =>
              isActive
                ? "site-account-link site-account-link--compact is-active"
                : "site-account-link site-account-link--compact"
            }
            aria-label={user ? "My account" : "Account"}
            title={user ? accountLabel : "Login or create account"}
            onClick={closeMenu}
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
          <nav className="mobile-nav mobile-nav--premium" aria-label="Mobile primary">
            {siteNav.map((item) => {
              const MobileIcon = mobileNavIcons[item.href] || FaMountain;

              return (
                <NavLink
                  key={item.href}
                  to={item.href}
                  className={({ isActive }) =>
                    isActive
                      ? "mobile-nav__link mobile-nav__link--premium is-active"
                      : "mobile-nav__link mobile-nav__link--premium"
                  }
                  onClick={closeMenu}
                >
                  <span className="mobile-nav__icon" aria-hidden="true">
                    <MobileIcon />
                  </span>
                  <span>{item.label}</span>
                </NavLink>
              );
            })}

            <NavLink
              to="/account"
              className={({ isActive }) =>
                isActive
                  ? "mobile-nav__link mobile-nav__link--premium is-active"
                  : "mobile-nav__link mobile-nav__link--premium"
              }
              onClick={closeMenu}
            >
              <span className="mobile-nav__icon" aria-hidden="true">
                <FaUser />
              </span>
              <span>{user ? `My Account (${accountLabel})` : "Login / Create Account"}</span>
            </NavLink>

            {user ? (
              <button
                type="button"
                className="mobile-nav__logout mobile-nav__logout--premium"
                onClick={handleLogout}
                disabled={isLoggingOut}
              >
                <span className="mobile-nav__icon" aria-hidden="true">
                  <FaRightFromBracket />
                </span>
                <span>{isLoggingOut ? "Logging out..." : "Logout"}</span>
              </button>
            ) : null}
          </nav>
        </div>
      </div>
    </header>
  );
}

export default Navbar;