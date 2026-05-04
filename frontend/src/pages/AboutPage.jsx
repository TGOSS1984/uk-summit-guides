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
        "Every mountain day is shaped by the season, the weather, the terrain, and the people on the route. Winter and summer each bring their own pace, risks, and rewards.",
    },
    {
      icon: <FaShieldHeart />,
      title: "Calm, considered experience",
      copy:
        "The aim is to create mountain days that feel reassuring, well planned, and quietly professional from first enquiry through to the final steps off the hill.",
    },
    {
      icon: <FaCompass />,
      title: "Route-first planning",
      copy:
        "Every experience starts with the right route, the right pace, and the right objective for the group — not simply chasing a summit for the sake of it.",
    },
  ];

  const values = [
    {
      title: "Small group focus",
      copy:
        "Smaller groups allow for better communication, safer pacing, and a more personal experience on the mountain.",
    },
    {
      title: "Respect for the landscape",
      copy:
        "The mountains are not just a backdrop. They are living, changing places that deserve care, patience, and respect.",
    },
    {
      title: "Meaningful mountain days",
      copy:
        "The best days are not always about speed or distance. They are about confidence, connection, memories, and moving well through wild places.",
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
              Guided mountain days with a personal connection to the landscape
            </h1>
            <p className="about-hero__copy">
              UK Summit Guides is shaped by a love of the outdoors, the drama of
              the British mountain landscape, and the belief that time in the
              hills should feel calm, meaningful, and well considered.
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
                <strong className="about-hero__meta-value">Personal</strong>
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
              <p className="section-kicker">The story behind it</p>
              <h2 className="section-title">
                A personal love for wild places, ridgelines, and mountain days
              </h2>
              <p className="section-copy">
                My name is Tom Goss, and UK Summit Guides comes from a genuine
                love of the outdoors — the quiet pull of the hills, the changing
                light across a ridge, and the feeling of perspective that only a
                long mountain day can give you.
              </p>
              <p className="section-copy about-story__copy-spaced">
                For me, mountain walking has never just been about reaching the
                top. It is about the route, the weather, the people you share it
                with, and the memories that stay with you long after the boots
                are cleaned and packed away.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="section about-story">
        <div className="container about-story__layout">
          <Reveal variant="left">
            <div className="about-story__content">
              <p className="section-kicker">In memory</p>
              <h2 className="section-title">
                For Tom Goss Snr — whose love of the mountains still leads the way
              </h2>
              <p className="section-copy">
                Much of my connection to the mountains was shaped by my late
                father, Tom Goss Snr, who passed away in 2025. His love of the
                outdoors, mountain landscapes, and days spent walking through wild
                places left a lasting mark on me.
              </p>
              <p className="section-copy about-story__copy-spaced">
                This part of the journey is about keeping that love alive —
                continuing to walk the UK mountains, carrying those memories
                forward, and building something that honours the quiet strength,
                perspective, and connection that the hills gave us.
              </p>
            </div>
          </Reveal>

          <Reveal delay={80} variant="right">
            <div className="about-story__media-wrap">
              <span
                className="accent-box accent-box--media accent-box--top-left"
                aria-hidden="true"
              />
              <div
                className="about-story__media about-story__media--primary"
                style={{
                  backgroundImage:
                    "url('/images/ui/about/tom_goss_snr.webp')",
                }}
              />
            </div>
          </Reveal>
        </div>
      </section>

      <section className="section about-pillars">
        <div className="container">
          <Reveal variant="up">
            <div className="about-section-heading">
              <p className="section-kicker">What shapes the experience</p>
              <h2 className="section-title">The principles behind every mountain day</h2>
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
                Built around real routes, small groups, and meaningful mountain days
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
                    <strong className="about-stat-panel__value">Small Groups</strong>
                  </div>
                </div>

                <div className="about-stat-panel__item">
                  <span className="about-stat-panel__icon">
                    <FaLayerGroup />
                  </span>
                  <div>
                    <span className="about-stat-panel__label">Mountain Focus</span>
                    <strong className="about-stat-panel__value">Routes, Seasons & Experience</strong>
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
              <p className="section-kicker">Start your journey</p>
              <h2 className="section-title">
                Find a route that matches your season, confidence, and sense of adventure
              </h2>
              <p className="section-copy">
                Explore guided mountain routes across the UK, from classic summer
                ridges to atmospheric winter objectives, and choose the day that
                feels right for you.
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