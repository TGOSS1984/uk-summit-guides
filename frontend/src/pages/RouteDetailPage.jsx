import {
  FaArrowRight,
  FaLocationDot,
  FaMapLocationDot,
  FaMountain,
  FaUserGroup,
} from "react-icons/fa6";
import { FiClock } from "react-icons/fi";
import { Link, useParams } from "react-router-dom";
import Reveal from "../components/ui/Reveal";
import RouteCard from "../components/ui/RouteCard";

const relatedRoutes = [
  {
    id: 2,
    slug: "blencathra-via-sharp-edge",
    name: "Blencathra via Sharp Edge",
    region: "Lake District",
    season: "Alpine Feel",
    difficulty: "Advanced",
    distance: "9 km",
    duration: "6 hrs",
    height: "868 m",
    elevation: "760 m",
    summary:
      "A sharper, more dramatic line with exposed movement and a strong mountain character suited to confident clients.",
    imageClass: "route-card__media--sharp",
  },
  {
    id: 5,
    slug: "scafell-pike-corridor-route",
    name: "Scafell Pike Corridor Route",
    region: "Lake District",
    season: "Summit Day",
    difficulty: "Moderate",
    distance: "14 km",
    duration: "6.5 hrs",
    height: "978 m",
    elevation: "840 m",
    summary:
      "A flagship summit experience with classic lines, strong mountain atmosphere, and adaptable guiding options.",
    imageClass: "route-card__media--scafell",
  },
];

function RouteDetailPage() {
  const { slug } = useParams();

  const route = {
    slug: slug || "helvellyn-via-striding-edge",
    name: "Helvellyn via Striding Edge",
    region: "Lake District",
    season: "Winter Classic",
    difficulty: "Advanced",
    distance: "11 km",
    duration: "7 hrs",
    height: "950 m",
    elevation: "860 m",
    groupSize: "Max 3",
    guide: "Lead Winter Mountain Guide",
    summary:
      "A premium ridge day with steep exposure, winter movement, and one of the UK's most iconic summit approaches.",
    overview:
      "This guided day is designed for clients who want a classic mountain line with a strong sense of atmosphere, movement, and exposure. The route combines a premium summit objective with terrain that feels memorable from start to finish.",
    details:
      "In winter conditions, Helvellyn via Striding Edge offers a more serious mountain experience, requiring judgement, pacing, and precise guiding. In calmer conditions it becomes a visually striking guided traverse with one of the best-known approaches in the UK.",
    highlights: [
      "Iconic ridge line with strong mountain character",
      "Premium guided day suited to experienced clients",
      "Excellent route for winter movement and exposure management",
      "Route detail, mapping, and availability will later connect to live backend data",
    ],
    imageClass: "route-detail-hero__image--ridge",
  };

  return (
    <>
      <section className="route-detail-hero">
        <div className={`route-detail-hero__image ${route.imageClass}`} />
        <div className="route-detail-hero__overlay" />

        <div className="container route-detail-hero__content">
          <Reveal variant="up">
            <div className="route-detail-hero__breadcrumb">
              <Link to="/routes" className="route-detail-hero__breadcrumb-link">
                Routes
              </Link>
              <span>/</span>
              <span>{route.name}</span>
            </div>

            <p className="section-kicker">{route.region}</p>
            <h1 className="page-title route-detail-hero__title">{route.name}</h1>
            <p className="route-detail-hero__copy">{route.summary}</p>
          </Reveal>

          <Reveal delay={80} variant="up">
            <div className="route-detail-hero__stats">
              <div className="route-detail-hero__stat">
                <span className="route-detail-hero__stat-icon">
                  <FaRoute />
                </span>
                <div>
                  <span className="route-detail-hero__stat-label">Distance</span>
                  <strong className="route-detail-hero__stat-value">{route.distance}</strong>
                </div>
              </div>

              <div className="route-detail-hero__stat">
                <span className="route-detail-hero__stat-icon">
                  <FiClock />
                </span>
                <div>
                  <span className="route-detail-hero__stat-label">Duration</span>
                  <strong className="route-detail-hero__stat-value">{route.duration}</strong>
                </div>
              </div>

              <div className="route-detail-hero__stat">
                <span className="route-detail-hero__stat-icon">
                  <FaMountain />
                </span>
                <div>
                  <span className="route-detail-hero__stat-label">Height</span>
                  <strong className="route-detail-hero__stat-value">{route.height}</strong>
                </div>
              </div>

              <div className="route-detail-hero__stat">
                <span className="route-detail-hero__stat-icon">
                  <FaLocationDot />
                </span>
                <div>
                  <span className="route-detail-hero__stat-label">Elevation</span>
                  <strong className="route-detail-hero__stat-value">{route.elevation}</strong>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="section route-detail-shell">
        <div className="container route-detail-layout">
          <div className="route-detail-main">
            <Reveal variant="left">
              <article className="route-detail-panel">
                <span
                  className="accent-box accent-box--content accent-box--right"
                  aria-hidden="true"
                />
                <p className="section-kicker">Overview</p>
                <h2 className="section-title">A flagship guided ridge day</h2>
                <p className="section-copy">{route.overview}</p>
                <p className="section-copy route-detail-panel__copy-spaced">
                  {route.details}
                </p>
              </article>
            </Reveal>

            <Reveal delay={80} variant="left">
              <article className="route-detail-panel route-detail-panel--map">
                <div className="route-detail-panel__header">
                  <div>
                    <p className="section-kicker">Mapping</p>
                    <h2 className="section-title">Leaflet / OS map integration placeholder</h2>
                  </div>

                  <button type="button" className="route-detail-action">
                    <FaMapLocationDot />
                    Open Map Placeholder
                  </button>
                </div>

                <div className="route-detail-map">
                  <div className="route-detail-map__overlay">
                    <span className="route-detail-map__tag">Interactive map area</span>
                    <p className="route-detail-map__text">
                      This panel will later hold the live Leaflet map, route line,
                      OS map link, and supporting route metadata from the backend.
                    </p>
                  </div>
                </div>
              </article>
            </Reveal>

            <Reveal delay={120} variant="left">
              <article className="route-detail-panel">
                <p className="section-kicker">Highlights</p>
                <h2 className="section-title">What to expect on this route</h2>

                <div className="route-detail-highlights">
                  {route.highlights.map((item) => (
                    <div key={item} className="route-detail-highlight">
                      <span className="route-detail-highlight__marker" aria-hidden="true" />
                      <p className="route-detail-highlight__text">{item}</p>
                    </div>
                  ))}
                </div>
              </article>
            </Reveal>
          </div>

          <aside className="route-detail-aside">
            <Reveal variant="right">
              <div className="route-booking-card">
                <p className="route-booking-card__eyebrow">Guided Booking</p>
                <h2 className="route-booking-card__title">Plan this mountain day</h2>

                <div className="route-booking-card__meta">
                  <div className="route-booking-card__meta-row">
                    <span>Difficulty</span>
                    <strong>{route.difficulty}</strong>
                  </div>
                  <div className="route-booking-card__meta-row">
                    <span>Guide Type</span>
                    <strong>{route.guide}</strong>
                  </div>
                  <div className="route-booking-card__meta-row">
                    <span>Group Size</span>
                    <strong>{route.groupSize}</strong>
                  </div>
                  <div className="route-booking-card__meta-row">
                    <span>Season</span>
                    <strong>{route.season}</strong>
                  </div>
                </div>

                <button type="button" className="route-booking-card__button">
                  Book This Route
                  <FaArrowRight />
                </button>

                <button type="button" className="route-booking-card__secondary">
                  View Dates Placeholder
                </button>
              </div>
            </Reveal>

            <Reveal delay={70} variant="right">
              <div className="route-guide-card">
                <p className="route-guide-card__eyebrow">Guide</p>
                <div className="route-guide-card__avatar" />
                <h3 className="route-guide-card__title">Lead Winter Mountain Guide</h3>
                <p className="route-guide-card__copy">
                  This panel will later show the assigned guide profile, experience,
                  seasonal qualifications, and availability.
                </p>

                <div className="route-guide-card__meta">
                  <div className="route-guide-card__meta-item">
                    <FaUserGroup />
                    <span>Small guided groups</span>
                  </div>
                  <div className="route-guide-card__meta-item">
                    <FaMountain />
                    <span>Technical terrain support</span>
                  </div>
                </div>
              </div>
            </Reveal>
          </aside>
        </div>
      </section>

      <section className="section related-routes">
        <div className="container">
          <Reveal variant="up">
            <div className="related-routes__header">
              <div>
                <p className="section-kicker">Continue Exploring</p>
                <h2 className="section-title">Related mountain routes</h2>
              </div>

              <Link to="/routes" className="route-detail-action route-detail-action--link">
                Back to all routes
                <FaArrowRight />
              </Link>
            </div>
          </Reveal>

          <div className="routes-grid routes-grid--related">
            {relatedRoutes.map((item, index) => (
              <Reveal
                key={item.id}
                delay={index * 70}
                variant={index % 2 === 0 ? "left" : "right"}
              >
                <RouteCard route={item} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

export default RouteDetailPage;