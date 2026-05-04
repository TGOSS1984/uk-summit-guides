import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import Reveal from "../components/ui/Reveal";
import StatsBand from "../components/sections/StatsBand";
import { getFeaturedRoutes } from "../lib/api";

function HomePage() {
  const [featuredRoutes, setFeaturedRoutes] = useState([]);
  const [activeFeaturedIndex, setActiveFeaturedIndex] = useState(0);

  useEffect(() => {
    let isMounted = true;

    async function loadFeaturedRoutes() {
      try {
        const data = await getFeaturedRoutes();
        if (isMounted) {
          setFeaturedRoutes(Array.isArray(data) ? data : data.results || []);
        }
      } catch (error) {
        console.error("Unable to load featured routes", error);
      }
    }

    loadFeaturedRoutes();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    if (featuredRoutes.length <= 1) return undefined;

    const interval = window.setInterval(() => {
      setActiveFeaturedIndex((currentIndex) =>
        currentIndex === featuredRoutes.length - 1 ? 0 : currentIndex + 1
      );
    }, 6500);

    return () => window.clearInterval(interval);
  }, [featuredRoutes.length]);

  const featuredRoute = featuredRoutes[activeFeaturedIndex];

  return (
    <>
      <Helmet>
        <title>UK Summit Guides | Guided Mountain Tours UK</title>
        <meta
          name="description"
          content="Premium guided mountain tours across the UK. Winter skills, summer routes, and private guiding experiences in the Lake District, Snowdonia, and Scotland."
        />
      </Helmet>

      <section className="hero">
        <div className="hero__image" />
        <div className="hero__overlay" />

        <div className="hero__map-motif hero__map-motif--one" aria-hidden="true">
          <svg
            viewBox="0 0 420 240"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M20 184C60 164 86 150 98 116C110 82 136 58 170 60C204 62 214 102 236 128C258 154 288 170 330 152C360 139 380 108 400 68"
              pathLength="1"
            />
            <circle cx="20" cy="184" r="5" />
            <circle cx="170" cy="60" r="5" />
            <circle cx="330" cy="152" r="5" />
            <circle cx="400" cy="68" r="5" />
          </svg>
        </div>

        <div className="hero__map-motif hero__map-motif--two" aria-hidden="true">
          <svg
            viewBox="0 0 260 220"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M32 188C68 176 88 150 88 118C88 80 114 52 146 50C176 48 194 72 194 104C194 138 210 164 234 178"
              pathLength="1"
            />
            <circle cx="32" cy="188" r="4.5" />
            <circle cx="146" cy="50" r="4.5" />
            <circle cx="234" cy="178" r="4.5" />
          </svg>
        </div>

        <div className="container hero__content">
          <div className="hero__content-grid">
            <div className="hero__main">
              <p className="hero__eyebrow">Mountain Travel Experts</p>
              <h1 className="hero__title">
                Guided mountain days shaped by season, terrain, and experience.
              </h1>
              <p className="hero__text">
                Premium guided mountain experiences across the UK, with
                carefully chosen routes, small-group departures, and planning
                that responds to real mountain conditions.
              </p>

              <div className="hero__actions">
                <a className="button button--primary" href="/book-now">
                  Book a Tour
                </a>
                <a className="button button--secondary" href="/routes">
                  Explore Routes
                </a>
              </div>
            </div>

            <div className="hero__aside">
              <div className="hero__route-card">
                {featuredRoute ? (
                  <>
                    <p className="hero__route-kicker">
                      Featured route
                      {featuredRoutes.length > 1 ? (
                        <span>
                          {" "}
                          {activeFeaturedIndex + 1}/{featuredRoutes.length}
                        </span>
                      ) : null}
                    </p>

                    <h2 className="hero__route-title">{featuredRoute.name}</h2>

                    <div className="hero__route-stats">
                      <div className="hero__route-stat">
                        <span className="hero__route-stat-label">Region</span>
                        <strong className="hero__route-stat-value">
                          {featuredRoute.region?.name || "UK"}
                        </strong>
                      </div>

                      <div className="hero__route-stat">
                        <span className="hero__route-stat-label">Distance</span>
                        <strong className="hero__route-stat-value">
                          {featuredRoute.distance_km} km
                        </strong>
                      </div>

                      <div className="hero__route-stat">
                        <span className="hero__route-stat-label">Duration</span>
                        <strong className="hero__route-stat-value">
                          {featuredRoute.duration_hours} hrs
                        </strong>
                      </div>

                      <div className="hero__route-stat">
                        <span className="hero__route-stat-label">Difficulty</span>
                        <strong className="hero__route-stat-value">
                          {featuredRoute.difficulty}
                        </strong>
                      </div>
                    </div>

                    <Link
                      className="hero__route-link"
                      to={`/routes/${featuredRoute.slug}`}
                    >
                      View route
                    </Link>

                    {featuredRoutes.length > 1 ? (
                      <div className="hero__route-dots" aria-label="Featured routes">
                        {featuredRoutes.map((route, index) => (
                          <button
                            key={route.id}
                            type="button"
                            className={`hero__route-dot${
                              index === activeFeaturedIndex ? " is-active" : ""
                            }`}
                            onClick={() => setActiveFeaturedIndex(index)}
                            aria-label={`Show ${route.name}`}
                          />
                        ))}
                      </div>
                    ) : null}
                  </>
                ) : (
                  <>
                    <p className="hero__route-kicker">Featured route</p>
                    <h2 className="hero__route-title">Explore our mountain routes</h2>
                    <p className="hero__route-empty">
                      Featured routes will appear here once marked in Django.
                    </p>
                    <Link className="hero__route-link" to="/routes">
                      Browse routes
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>

          <div className="hero__panel">
            <div className="hero__panel-card">
              <p className="hero__panel-kicker">Seasonal departures</p>
              <h2 className="hero__panel-title">
                Discover guided days built for winter and summer terrain.
              </h2>
              <p className="hero__panel-copy">
                Route-led planning, premium guiding, and a calm booking
                experience designed around the realities of UK mountain travel.
              </p>
            </div>

            <div className="hero__panel-meta">
              <div className="hero__meta-item">
                <span className="hero__meta-label">Regions</span>
                <strong className="hero__meta-value">5</strong>
              </div>
              <div className="hero__meta-item">
                <span className="hero__meta-label">Routes</span>
                <strong className="hero__meta-value">28</strong>
              </div>
              <div className="hero__meta-item">
                <span className="hero__meta-label">Guides</span>
                <strong className="hero__meta-value">8</strong>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section section--panel">
        <div className="container feature-band">
          <Reveal delay={80}>
            <div className="feature-band__card">
              <span className="feature-band__accent" aria-hidden="true" />
              <p className="feature-band__eyebrow">Guided by experience</p>
              <h2 className="feature-band__title">
                More than a route — a better way to move through the mountains.
              </h2>
              <p className="feature-band__text">
                Our guided days are built around clear planning, small groups,
                seasonal awareness, and the kind of judgement that only comes
                from time spent in mountain terrain.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="section editorial-section">
        <div className="container editorial-stack">
          <Reveal delay={40} variant="left">
            <article className="editorial-block editorial-block--first">
              <div className="editorial-block__text-wrap">
                <span
                  className="accent-box accent-box--content accent-box--right"
                  aria-hidden="true"
                />
                <div className="editorial-block__text">
                  <p className="editorial-block__number">01</p>
                  <p className="section-kicker">Get started</p>
                  <h2 className="section-title">
                    Find the right route for your season and experience level
                  </h2>
                  <p className="section-copy">
                    Every route is selected with intent — balancing terrain,
                    exposure, distance, and seasonal conditions. Whether you're
                    stepping into winter mountaineering or looking for a classic
                    ridge traverse, we guide you toward objectives that match
                    both your ability and the mountain’s mood.
                    <br />
                    <br />
                    Plan with clarity before you even step onto the hill.
                  </p>
                </div>
              </div>

              <div className="editorial-block__media-wrap">
                <span
                  className="accent-box accent-box--media accent-box--top-left"
                  aria-hidden="true"
                />
                <div className="editorial-block__media editorial-block__media--primary" />
              </div>
            </article>
          </Reveal>

          <Reveal delay={110} variant="right">
            <article className="editorial-block editorial-block--reverse">
              <div className="editorial-block__text-wrap">
                <span
                  className="accent-box accent-box--content accent-box--left"
                  aria-hidden="true"
                />
                <div className="editorial-block__text">
                  <p className="editorial-block__number">02</p>
                  <p className="section-kicker">Book with confidence</p>
                  <h2 className="section-title">
                    Small groups. Clear availability. No surprises.
                  </h2>
                  <p className="section-copy">
                    We keep group sizes intentionally small to maintain safety,
                    pace, and a more personal experience. Live availability
                    reflects real guide capacity — so when you book, your place
                    is secured and properly supported.
                    <br />
                    <br />
                    Simple booking, backed by real-world planning.
                  </p>
                </div>
              </div>

              <div className="editorial-block__media-wrap editorial-block__media-wrap--offset">
                <span
                  className="accent-box accent-box--media accent-box--bottom-right"
                  aria-hidden="true"
                />
                <div className="editorial-block__media editorial-block__media--alt" />
              </div>
            </article>
          </Reveal>

          <Reveal delay={140} variant="left">
            <article className="editorial-block editorial-block--first">
              <div className="editorial-block__text-wrap">
                <span
                  className="accent-box accent-box--content accent-box--right"
                  aria-hidden="true"
                />
                <div className="editorial-block__text">
                  <p className="editorial-block__number">03</p>
                  <p className="section-kicker">Seasonal awareness</p>
                  <h2 className="section-title">
                    Winter and summer are different worlds
                  </h2>
                  <p className="section-copy">
                    Snow, ice, daylight, wind, and visibility can transform
                    familiar routes into completely different days. We adapt
                    plans, pacing, and objectives around the season, the
                    forecast, and the conditions found on the hill.
                    <br />
                    <br />
                    The goal is simple: choose the best mountain day available,
                    not just the one that looked good weeks ago.
                  </p>
                </div>
              </div>

              <div className="editorial-block__media-wrap">
                <span
                  className="accent-box accent-box--media accent-box--top-left"
                  aria-hidden="true"
                />
                <div className="editorial-block__media editorial-block__media--third" />
              </div>
            </article>
          </Reveal>

          <Reveal delay={170} variant="right">
            <article className="editorial-block editorial-block--reverse">
              <div className="editorial-block__text-wrap">
                <span
                  className="accent-box accent-box--content accent-box--left"
                  aria-hidden="true"
                />
                <div className="editorial-block__text">
                  <p className="editorial-block__number">04</p>
                  <p className="section-kicker">Mountain confidence</p>
                  <h2 className="section-title">
                    More than just reaching the summit
                  </h2>
                  <p className="section-copy">
                    A guided day should leave you with more than a photo at the
                    top. Along the way, you’ll build confidence with movement,
                    route choice, pacing, weather awareness, and the small
                    decisions that shape a safer day outside.
                    <br />
                    <br />
                    The summit matters — but the experience getting there
                    matters more.
                  </p>
                </div>
              </div>

              <div className="editorial-block__media-wrap editorial-block__media-wrap--offset">
                <span
                  className="accent-box accent-box--media accent-box--bottom-right"
                  aria-hidden="true"
                />
                <div className="editorial-block__media editorial-block__media--fourth" />
              </div>
            </article>
          </Reveal>
        </div>
      </section>

      <section className="section scenic-section">
        <div className="container scenic-layout">
          <Reveal delay={60} variant="left">
            <div className="scenic-layout__left">
              <div className="scenic-layout__image-wrap">
                <span
                  className="accent-box accent-box--media accent-box--mid-left"
                  aria-hidden="true"
                />
                <div className="scenic-layout__image scenic-layout__image--one" />
              </div>

              <div className="scenic-layout__copy">
                <p className="section-kicker">Regional discovery</p>
                <h2 className="section-title">
                  Route pages that go beyond basic details
                </h2>
                <p className="section-copy">
                  Each route combines practical information with real context —
                  terrain, exposure, seasonal considerations, and what the day
                  actually feels like on the ground.
                  <br />
                  <br />
                  It’s not just a list of stats — it’s a clearer picture of the
                  experience ahead.
                </p>
              </div>
            </div>
          </Reveal>

          <Reveal delay={120} variant="right">
            <div className="scenic-layout__right">
              <div className="scenic-layout__copy scenic-layout__copy--compact">
                <p className="section-kicker">Quietly professional</p>
                <h2 className="section-title">
                  Always prepared, without overcomplicating the experience
                </h2>
                <p className="section-copy">
                  From route choice to group management, every detail is
                  considered before the day begins. The planning stays calm and
                  clear, so you can focus on the mountain rather than the
                  logistics.
                </p>
              </div>

              <div className="scenic-layout__image scenic-layout__image--two" />
            </div>
          </Reveal>
        </div>
      </section>

      <Reveal variant="up">
        <StatsBand />
      </Reveal>
    </>
  );
}

export default HomePage;