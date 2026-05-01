import { useEffect, useState } from "react";
import TourLocationsMap from "../components/ui/TourLocationsMap";
import { getRoutes } from "../lib/api";
import {
  FaArrowRight,
  FaCompass,
  FaMapLocationDot,
  FaMountainSun,
  FaPersonHiking,
  FaShieldHeart,
  FaSnowflake,
  FaUserGroup,
} from "react-icons/fa6";
import { Link } from "react-router-dom";
import Reveal from "../components/ui/Reveal";

function ServicesPage() {
  const [routes, setRoutes] = useState([]);
  const [routesLoading, setRoutesLoading] = useState(true);
  const [routesError, setRoutesError] = useState("");

  useEffect(() => {
    let isMounted = true;

    async function loadRoutes() {
      try {
        setRoutesLoading(true);
        setRoutesError("");

        const data = await getRoutes();

        if (!isMounted) return;

        const results = Array.isArray(data) ? data : data.results || [];
        setRoutes(results);
      } catch (err) {
        if (!isMounted) return;
        setRoutesError("Unable to load route locations right now.");
      } finally {
        if (isMounted) {
          setRoutesLoading(false);
        }
      }
    }

    loadRoutes();

    return () => {
      isMounted = false;
    };
  }, []);
  const services = [
    {
      icon: <FaSnowflake />,
      title: "Winter Mountain Days",
      copy:
        "Guided winter mountain days built around seasonal conditions, terrain awareness, and premium small-group experiences.",
    },
    {
      icon: <FaMountainSun />,
      title: "Summer Guided Routes",
      copy:
        "Classic UK mountain routes with a calmer, scenic focus, designed for clients who want a premium guided day in summer conditions.",
    },
    {
      icon: <FaPersonHiking />,
      title: "Private Guiding",
      copy:
        "Flexible private bookings for individuals or small groups who want a more tailored objective, pace, and mountain experience.",
    },
    {
      icon: <FaMapLocationDot />,
      title: "Route Planning Support",
      copy:
        "Guidance built around route selection, suitability, regional character, and later, live mapping and route detail through the platform.",
    },
  ];

  const process = [
    {
      step: "01",
      title: "Choose a route or service",
      copy:
        "Clients start by exploring regions, objectives, and service types that suit their experience level and preferred mountain day.",
    },
    {
      step: "02",
      title: "Review dates and availability",
      copy:
        "Later this will connect to scheduled tours, guide availability, seasonal pricing, and protected booking logic.",
    },
    {
      step: "03",
      title: "Confirm and prepare",
      copy:
        "Bookings will move through confirmation, payment, account access, and pre-day communication in one connected flow.",
    },
  ];

  return (
    <>
      <section className="services-hero">
        <div className="services-hero__image" />
        <div className="services-hero__overlay" />

        <div className="container services-hero__content">
          <Reveal variant="up">
            <p className="section-kicker">Services</p>
            <h1 className="page-title services-hero__title">
              Guided mountain services shaped around season, terrain, and experience
            </h1>
            <p className="services-hero__copy">
              The platform is being designed to support a premium range of guided
              mountain offerings, from winter objectives and classic summer routes
              to private guiding and route-led planning support.
            </p>
          </Reveal>

          <Reveal delay={80} variant="up">
            <div className="services-hero__meta">
              <div className="services-hero__meta-item">
                <span className="services-hero__meta-label">Format</span>
                <strong className="services-hero__meta-value">Guided & Private</strong>
              </div>
              <div className="services-hero__meta-item">
                <span className="services-hero__meta-label">Focus</span>
                <strong className="services-hero__meta-value">Small Groups</strong>
              </div>
              <div className="services-hero__meta-item">
                <span className="services-hero__meta-label">Approach</span>
                <strong className="services-hero__meta-value">Route First</strong>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="section services-grid-section">
        <div className="container">
          <Reveal variant="up">
            <div className="services-section-heading">
              <p className="section-kicker">Core Services</p>
              <h2 className="section-title">A premium set of guided mountain offerings</h2>
            </div>
          </Reveal>

          <div className="services-grid">
            {services.map((service, index) => (
              <Reveal
                key={service.title}
                delay={index * 70}
                variant={index % 2 === 0 ? "left" : "right"}
              >
                <article className="service-card">
                  <span className="service-card__icon">{service.icon}</span>
                  <h3 className="service-card__title">{service.title}</h3>
                  <p className="service-card__copy">{service.copy}</p>

                  <button type="button" className="service-card__link">
                    Learn More
                    <FaArrowRight />
                  </button>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="section services-locations">
        <div className="container services-locations__layout">
          <Reveal variant="left">
            <div className="services-locations__content">
              <p className="section-kicker">Where we guide</p>
              <h2 className="section-title">
                Guided mountain days across the UK’s classic regions
              </h2>
              <p className="section-copy">
                Our route network is built around the UK’s most recognisable
                mountain areas, from winter objectives in Scotland to classic
                scrambles, ridges, and high-level walking routes across England
                and Wales.
              </p>
              <p className="section-copy services-locations__copy-spaced">
                Each marker is powered by the route location data already stored
                in Django, keeping the map connected to the same route content
                used across the rest of the platform.
              </p>
            </div>
          </Reveal>

          <Reveal delay={90} variant="right">
            <div className="services-locations__map-panel">
              {routesLoading ? (
                <div className="services-locations__state">
                  Loading UK tour locations…
                </div>
              ) : routesError ? (
                <div className="services-locations__state">
                  {routesError}
                </div>
              ) : (
                <TourLocationsMap routes={routes} />
              )}
            </div>
          </Reveal>
        </div>
      </section>

      <section className="section services-feature">
        <div className="container services-feature__layout">
          <Reveal variant="left">
            <div className="services-feature__content">
              <p className="section-kicker">Private & Bespoke</p>
              <h2 className="section-title">
                Built to support tailored mountain days and premium private bookings
              </h2>
              <p className="section-copy">
                Alongside bookable scheduled tours, the platform is being shaped
                to support more bespoke guiding requests. That includes private
                dates, route-focused enquiries, and services that can adapt to
                the needs of a small client group.
              </p>
              <p className="section-copy services-feature__copy-spaced">
                Later, this can expand into private enquiry flows, seasonal
                recommendations, custom route support, and clearer service-led
                conversion paths.
              </p>

              <div className="services-feature__badges">
                <div className="services-feature__badge">
                  <FaUserGroup />
                  <span>Small Group Focus</span>
                </div>
                <div className="services-feature__badge">
                  <FaShieldHeart />
                  <span>Premium Guided Experience</span>
                </div>
                <div className="services-feature__badge">
                  <FaCompass />
                  <span>Route-Led Planning</span>
                </div>
              </div>
            </div>
          </Reveal>

          <Reveal delay={90} variant="right">
            <div className="services-feature__media-wrap">
              <span
                className="accent-box accent-box--media accent-box--bottom-right"
                aria-hidden="true"
              />
              <div className="services-feature__media" />
            </div>
          </Reveal>
        </div>
      </section>

      <section className="section services-process">
        <div className="container">
          <Reveal variant="up">
            <div className="services-section-heading">
              <p className="section-kicker">How it will work</p>
              <h2 className="section-title">A clean flow from route discovery to booking</h2>
            </div>
          </Reveal>

          <div className="services-process__grid">
            {process.map((item, index) => (
              <Reveal
                key={item.step}
                delay={index * 80}
                variant="up"
              >
                <article className="services-process__card">
                  <p className="services-process__step">{item.step}</p>
                  <h3 className="services-process__title">{item.title}</h3>
                  <p className="services-process__copy">{item.copy}</p>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="section services-cta">
        <div className="container">
          <Reveal variant="up">
            <div className="services-cta__panel">
              <p className="section-kicker">Next step</p>
              <h2 className="section-title">
                Explore routes now, then connect the services layer to real bookings later
              </h2>
              <p className="section-copy">
                This page is the premium shell for the service offering. Later,
                it can connect directly to route detail, private guiding forms,
                bookable departures, and seasonal service variations.
              </p>

              <div className="services-cta__actions">
                <Link to="/routes" className="route-detail-action route-detail-action--link">
                  Explore Routes
                  <FaArrowRight />
                </Link>

                <Link to="/book-now" className="route-card__link route-card__link--primary">
                  Book Now
                  <FaArrowRight />
                </Link>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}

export default ServicesPage;