import {
  FaFacebookF,
  FaInstagram,
  FaLinkedinIn,
  FaPinterestP,
} from "react-icons/fa";
import BrandLogo from "../ui/BrandLogo";

function Footer() {
  const footerGroups = [
    {
      title: "Explore",
      items: [
        "Winter Routes",
        "Summer Routes",
        "Private Guiding",
        "Skills Days",
        "Gift Vouchers",
        "Group Bookings",
      ],
    },
    {
      title: "Discover",
      items: [
        "About Us",
        "Our Guides",
        "Regions",
        "Route Difficulty",
        "Seasonal Tours",
        "Mountain Advice",
      ],
    },
    {
      title: "Support",
      items: [
        "FAQ",
        "Contact Us",
        "Booking Help",
        "Cancellation Policy",
        "Accessibility",
        "Safety Information",
      ],
    },
    {
      title: "Account",
      items: [
        "My Account",
        "My Bookings",
        "Manage Booking",
        "Saved Routes",
        "Email Preferences",
        "Customer Support",
      ],
    },
  ];

  const legalLinks = [
    "Terms of Service",
    "Privacy Policy",
    "Booking Terms",
  ];

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
                      <li key={item}>
                        <button type="button" className="site-footer__link">
                          {item}
                        </button>
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
              Join for route updates, new departures, and seasonal mountain news.
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
              <button key={item} type="button" className="site-footer__legal-link">
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