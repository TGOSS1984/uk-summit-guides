import {
  FaFacebookF,
  FaInstagram,
  FaLinkedinIn,
  FaPinterestP,
} from "react-icons/fa";
import { Link } from "react-router-dom";
import BrandLogo from "../ui/BrandLogo";

function Footer() {
  const footerGroups = [
    {
      title: "Explore",
      items: [
        { label: "Winter Routes", to: "/routes" },
        { label: "Summer Routes", to: "/routes" },
        { label: "Private Guiding", to: "/services" },
        { label: "Skills Days", to: "/services" },
        { label: "Gift Vouchers" },
        { label: "Group Bookings", to: "/services" },
      ],
    },
    {
      title: "Discover",
      items: [
        { label: "About Us", to: "/about" },
        { label: "Our Guides" },
        { label: "Regions", to: "/routes" },
        { label: "Route Difficulty", to: "/routes" },
        { label: "Seasonal Tours", to: "/services" },
        { label: "Mountain Advice" },
      ],
    },
    {
      title: "Support",
      items: [
        { label: "FAQ", to: "/support/faq" },
        { label: "Contact Us", to: "/contact" },
        { label: "Booking Help" },
        { label: "Cancellation Policy", to: "/support/cancellation-policy" },
        { label: "Accessibility" },
        { label: "Safety Information" },
      ],
    },
    {
      title: "Account",
      items: [
        { label: "My Account", to: "/account" },
        { label: "My Bookings", to: "/account" },
        { label: "Manage Booking", to: "/account" },
        { label: "Saved Routes", to: "/account" },
        { label: "Email Preferences" },
        { label: "Customer Support", to: "/contact" },
      ],
    },
  ];

  const legalLinks = ["Terms of Service", "Privacy Policy", "Booking Terms"];

  const socialLinks = [
    { label: "Instagram", icon: <FaInstagram /> },
    { label: "Facebook", icon: <FaFacebookF /> },
    { label: "LinkedIn", icon: <FaLinkedinIn /> },
    { label: "Pinterest", icon: <FaPinterestP /> },
  ];

  return (
    <footer className="site-footer">
      <div className="site-footer__background" aria-hidden="true" />
      <div className="site-footer__overlay" aria-hidden="true" />

      <div className="container site-footer__content">
        <div className="site-footer__top">
          <div className="site-footer__nav-grid-wrap">
            <div className="site-footer__brand-block">
              <BrandLogo className="site-footer__brand" to="/" />
              <p className="site-footer__brand-copy">
                Guided mountain days across the UK, built around premium route
                discovery, seasonal touring, and a modern booking experience.
              </p>
            </div>

            <div className="site-footer__nav-grid">
              {footerGroups.map((group) => (
                <div key={group.title} className="site-footer__group">
                  <h3 className="site-footer__group-title">{group.title}</h3>
                  <ul className="site-footer__list">
                    {group.items.map((item) => (
                      <li key={item.label}>
                        {item.to ? (
                          <Link to={item.to} className="site-footer__link">
                            {item.label}
                          </Link>
                        ) : (
                          <button type="button" className="site-footer__link">
                            {item.label}
                          </button>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          <div className="site-footer__signup">
            <p className="site-footer__signup-kicker">Stay in the loop</p>
            <h3 className="site-footer__signup-title">
              Join for route updates, new departures, and seasonal mountain
              news.
            </h3>

            <form className="site-footer__signup-form">
              <input
                className="site-footer__input"
                type="email"
                placeholder="Your email address"
                aria-label="Your email address"
              />
              <button type="submit" className="site-footer__subscribe">
                Subscribe
              </button>
            </form>

            <div className="site-footer__socials" aria-label="Social links">
              {socialLinks.map((item) => (
                <button
                  key={item.label}
                  type="button"
                  className="site-footer__social"
                  aria-label={item.label}
                  title={item.label}
                >
                  <span className="site-footer__social-icon">{item.icon}</span>
                </button>
              ))}
            </div>

            <div className="site-footer__trust">
              <div className="site-footer__trust-badge">
                <span className="site-footer__trust-ring">UK</span>
              </div>
              <p className="site-footer__trust-text">
                Built for guided mountain touring across the UK.
              </p>
            </div>
          </div>
        </div>

        <div className="site-footer__bottom">
          <p className="site-footer__copyright">
            © 2025 UK Summit Guides. All rights reserved.
          </p>

          <div className="site-footer__legal">
            {legalLinks.map((item) => (
              <button
                key={item}
                type="button"
                className="site-footer__legal-link"
              >
                {item}
              </button>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;