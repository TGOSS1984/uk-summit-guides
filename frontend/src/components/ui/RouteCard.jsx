import {
  FaArrowRight,
  FaLocationDot,
  FaMountain,
  FaRoute,
} from "react-icons/fa6";
import { FiClock } from "react-icons/fi";
import { Link } from "react-router-dom";

function RouteCard({ route }) {
  return (
    <article className="route-card">
      <div className="route-card__media-wrap">
        <span
          className="accent-box accent-box--media accent-box--top-left"
          aria-hidden="true"
        />
        <div className={`route-card__media ${route.imageClass || ""}`}>
          <span className="route-card__region-badge">{route.region}</span>
        </div>
      </div>

      <div className="route-card__body">
        <div className="route-card__header">
          <div>
            <p className="route-card__eyebrow">{route.season}</p>
            <h2 className="route-card__title">{route.name}</h2>
          </div>

          <span
            className={`route-card__difficulty route-card__difficulty--${route.difficulty.toLowerCase()}`}
          >
            {route.difficulty}
          </span>
        </div>

        <p className="route-card__summary">{route.summary}</p>

        <div className="route-card__meta-grid">
          <div className="route-card__meta-item">
            <span className="route-card__meta-icon">
              <FaRoute />
            </span>
            <div>
              <span className="route-card__meta-label">Distance</span>
              <strong className="route-card__meta-value">{route.distance}</strong>
            </div>
          </div>

          <div className="route-card__meta-item">
            <span className="route-card__meta-icon">
              <FiClock />
            </span>
            <div>
              <span className="route-card__meta-label">Duration</span>
              <strong className="route-card__meta-value">{route.duration}</strong>
            </div>
          </div>

          <div className="route-card__meta-item">
            <span className="route-card__meta-icon">
              <FaMountain />
            </span>
            <div>
              <span className="route-card__meta-label">Height</span>
              <strong className="route-card__meta-value">{route.height}</strong>
            </div>
          </div>

          <div className="route-card__meta-item">
            <span className="route-card__meta-icon">
              <FaLocationDot />
            </span>
            <div>
              <span className="route-card__meta-label">Elevation</span>
              <strong className="route-card__meta-value">{route.elevation}</strong>
            </div>
          </div>
        </div>

        <div className="route-card__footer">
          <Link
            to={`/routes/${route.slug || "sample-route"}`}
            className="route-card__link route-card__link--primary"
          >
            View Route
            <FaArrowRight />
          </Link>

          <button type="button" className="route-card__link">
            OS Map Placeholder
          </button>
        </div>
      </div>
    </article>
  );
}

export default RouteCard;