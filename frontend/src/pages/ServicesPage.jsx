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
        "Guided winter days shaped around snow, ice, daylight, wind, and changing mountain conditions. Built for clients who want a more considered way to experience the UK’s winter terrain.",
    },
    {
      icon: <FaMountainSun />,
      title: "Summer Guided Routes",
      copy:
        "Classic UK mountain routes with a scenic, confidence-building focus — from steady summit days to ridges, scrambles, and high-level walking objectives in summer conditions.",
    },
    {
      icon: <FaPersonHiking />,
      title: "Private Guiding",
      copy:
        "Flexible private bookings for individuals, couples, families, or small groups who want a tailored objective, quieter pace, and a more personal mountain experience.",
    },
    {
      icon: <FaMapLocationDot />,
      title: "Route Planning Support",
      copy:
        "Clear guidance around route choice, difficulty, terrain, regional character, and seasonal suitability — helping clients choose the right mountain day before they book.",
    },
  ];

  const process = [
    {
      step: "01",
      title: "Choose your mountain objective",
      copy:
        "Start by exploring regions, routes, and service types that match your experience, confidence, fitness, and the kind of mountain day you want.",
    },
    {
      step: "02",
      title: "Check dates and availability",
      copy:
        "Review available departures, group sizes, seasonal suitability, and guide capacity so the booking feels clear before you commit.",
    },
    {
      step: "03",
      title: "Confirm and prepare",
      copy:
        "Once booked, the flow supports confirmation, payment, account access, and pre-day information so clients arrive prepared and confident.",
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
              Guided mountain services shaped around season, terrain, and confidence
            </h1>
            <p className="services-hero__copy">
              From winter objectives and classic summer routes to private guiding
              and route-led planning, every service is designed to help clients
              choose the right day, move with confidence, and get more from their
              time in the mountains.
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
              <h2 className="section-title">Guided mountain days with clear purpose</h2>
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
                ridges, scrambles, and high-level walking routes across England
                and Wales.
              </p>
              <p className="section-copy services-locations__copy-spaced">
                Each location is connected to real route data from Django, so
                clients can move from map discovery into route detail, regional
                context, and booking with a clear sense of what each day involves.
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
                Tailored mountain days for small groups and specific objectives
              </h2>
              <p className="section-copy">
                Alongside scheduled tours, private guiding gives clients more
                control over the objective, pace, date, and focus of the day.
                It is ideal for building confidence, returning to the mountains,
                preparing for bigger routes, or sharing a quieter experience with
                a small group.
              </p>
              <p className="section-copy services-feature__copy-spaced">
                Plans can be shaped around seasonal conditions, route suitability,
                group experience, and the kind of day clients want — from scenic
                movement through big terrain to more skills-focused mountain time.
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
              <p className="section-kicker">How it works</p>
              <h2 className="section-title">A calm flow from route discovery to booking</h2>
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
                Explore the routes, then choose the guided experience that fits
              </h2>
              <p className="section-copy">
                Start with the mountain. Browse routes by region, difficulty,
                distance, and terrain, then move into a guided day that matches
                your confidence, season, and preferred objective.
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