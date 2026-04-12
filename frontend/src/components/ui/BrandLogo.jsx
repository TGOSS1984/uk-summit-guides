import { Link } from "react-router-dom";

function BrandLogo({ className = "", to = "/" }) {
  return (
    <Link to={to} className={`brand-logo ${className}`.trim()} aria-label="UK Summit Guides home">
      <span className="brand-logo__mark" aria-hidden="true">
        <span className="brand-logo__mountain brand-logo__mountain--back" />
        <span className="brand-logo__mountain brand-logo__mountain--front" />
        <span className="brand-logo__cut" />
      </span>

      <span className="brand-logo__text">
        <span className="brand-logo__title">UK SUMMIT GUIDES</span>
        <span className="brand-logo__subtitle">MOUNTAINEERING</span>
      </span>
    </Link>
  );
}

export default BrandLogo;