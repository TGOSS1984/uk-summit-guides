import {
  FaArrowRight,
  FaCompass,
  FaLayerGroup,
  FaMountainSun,
  FaShieldHeart,
  FaUserGroup,
} from "react-icons/fa6";
import { Link } from "react-router-dom";
import Reveal from "../components/ui/Reveal";

function AboutPage() {
  const pillars = [
    {
      icon: <FaMountainSun />,
      title: "Season-led guiding",
      copy:
        "Routes are framed around the realities of winter and summer terrain, not just the summit itself. The experience is built around the season, movement, and conditions.",
    },
    {
      icon: <FaShieldHeart />,
      title: "Calm, premium experience",
      copy:
        "The aim is a guiding experience that feels clear, reassuring, and thoughtfully structured from first enquiry through to the day on the hill.",
    },
    {
      icon: <FaCompass />,
      title: "Route-first planning",
      copy:
        "Every mountain day starts with the line, the region, the objective, and the right pace for the client group. The platform will later reflect that same clarity.",
    },
  ];

  const values = [
    {
      title: "Small group focus",
      copy:
        "Built around small guided groups and premium private bookings, with a structure that later supports protected availability and route-specific scheduling.",
    },
    {
      title: "Regional expertise",
      copy:
        "The service is intended to grow around distinct mountain areas, giving each region its own routes, character, and seasonal flavour.",
    },
    {
      title: "Modern operations",
      copy:
        "Behind the visual layer, the project is being designed as a full booking and operations platform with routes, guides, tours, payments, and account management.",
    },
  ];

  return (
    <>
      <section className="about-hero">
        <div className="about-hero__image" />
        <div className="about-hero__overlay" />

        <div className="container about-hero__content">
          <Reveal variant="up">
            <p className="section-kicker">About UK Summit Guides</p>
            <h1 className="page-title about-hero__title">
              A mountain-first platform shaped around guided experiences
            </h1>
            <p className="about-hero__copy">
              UK Summit Guides is being designed as more than a brochure site.
              It is a premium guided mountain platform that brings together route
              discovery, guiding, booking, seasonal planning, and operations in
              one coherent experience.
            </p>
          </Reveal>

          <Reveal delay={80} variant="up">
            <div className="about-hero__meta">
              <div className="about-hero__meta-item">
                <span className="about-hero__meta-label">Approach</span>
                <strong className="about-hero__meta-value">Route First</strong>
              </div>
              <div className="about-hero__meta-item">
                <span className="about-hero__meta-label">Experience</span>
                <strong className="about-hero__meta-value">Premium</strong>
              </div>
              <div className="about-hero__meta-item">
                <span className="about-hero__meta-label">Guiding Style</span>
                <strong className="about-hero__meta-value">Small Groups</strong>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="section about-story">
        <div className="container about-story__layout">
          <Reveal variant="left">
            <div className="about-story__media-wrap">
              <span
                className="accent-box accent-box--media accent-box--top-left"
                aria-hidden="true"
              />
              <div className="about-story__media about-story__media--primary" />
            </div>
          </Reveal>

          <Reveal delay={80} variant="right">
            <div className="about-story__content">
              <p className="section-kicker">The idea behind it</p>
              <h2 className="section-title">
                Built to feel editorial, calm, and purposeful
              </h2>
              <p className="section-copy">
                The project vision is to create a mountain touring platform that
                feels refined at the front end and robust underneath. That means
                route pages designed around real mountain decisions, clean booking
                flows, and a visual system that reflects the atmosphere of the hills.
              </p>
              <p className="section-copy about-story__copy-spaced">
                The winter and summer theme system is part of that thinking. The
                experience should not feel like the same flat interface all year
                round. It should shift with the season, the mood, and the type of
                mountain day being offered.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="section about-pillars">
        <div className="container">
          <Reveal variant="up">
            <div className="about-section-heading">
              <p className="section-kicker">What shapes the platform</p>
              <h2 className="section-title">The guiding principles behind the experience</h2>
            </div>
          </Reveal>

          <div className="about-pillars__grid">
            {pillars.map((pillar, index) => (
              <Reveal
                key={pillar.title}
                delay={index * 70}
                variant={index % 2 === 0 ? "left" : "right"}
              >
                <article className="about-pillar-card">
                  <span className="about-pillar-card__icon">{pillar.icon}</span>
                  <h3 className="about-pillar-card__title">{pillar.title}</h3>
                  <p className="about-pillar-card__copy">{pillar.copy}</p>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="section about-split">
        <div className="container about-split__layout">
          <Reveal variant="left">
            <div className="about-split__content">
              <p className="section-kicker">Guiding DNA</p>
              <h2 className="section-title">
                Designed for real routes, small groups, and premium mountain days
              </h2>

              <div className="about-values">
                {values.map((value) => (
                  <div key={value.title} className="about-value">
                    <span className="about-value__marker" aria-hidden="true" />
                    <div>
                      <h3 className="about-value__title">{value.title}</h3>
                      <p className="about-value__copy">{value.copy}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>

          <Reveal delay={100} variant="right">
            <div className="about-split__stack">
              <div className="about-split__media-wrap">
                <span
                  className="accent-box accent-box--media accent-box--bottom-right"
                  aria-hidden="true"
                />
                <div className="about-split__media about-split__media--tall" />
              </div>

              <div className="about-stat-panel">
                <div className="about-stat-panel__item">
                  <span className="about-stat-panel__icon">
                    <FaUserGroup />
                  </span>
                  <div>
                    <span className="about-stat-panel__label">Group Style</span>
                    <strong className="about-stat-panel__value">Max 3 Per Booking</strong>
                  </div>
                </div>

                <div className="about-stat-panel__item">
                  <span className="about-stat-panel__icon">
                    <FaLayerGroup />
                  </span>
                  <div>
                    <span className="about-stat-panel__label">Platform Shape</span>
                    <strong className="about-stat-panel__value">Frontend + Booking Engine</strong>
                  </div>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="section about-cta">
        <div className="container">
          <Reveal variant="up">
            <div className="about-cta__panel">
              <p className="section-kicker">Looking ahead</p>
              <h2 className="section-title">
                The next stage is connecting this experience to real routes, guides, and bookable tours
              </h2>
              <p className="section-copy">
                This page is the visual shell for the story behind the platform.
                Later, it can expand with guide profiles, credentials, service detail,
                regional expertise, and operational trust markers.
              </p>

              <div className="about-cta__actions">
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

export default AboutPage;